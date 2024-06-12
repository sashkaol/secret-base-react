import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './SupaBase';
import { Btn, Container, TextField, Title, Loading, HighContainer, Popup, Warning, Voile } from './styles/styles';
import { useSelector } from 'react-redux';
import { useAuth } from './hooks/user-auth';
import { Navigate, NavLink } from 'react-router-dom';
import { normalDate } from './App';

const getDataCase = async (param) => {
    const { data, error } = await supabase
        .from('cases')
        .select(`
            *, 
            proof (
                *,
                people (*)
            ),
            on_case (
                *,
                detectives (*,
                    people (*)
                )
            ),
            participants (
                *,
                people (*),
                testimony (*)
            )
        `)
        .eq('ca_id', param)
    return data || error
}

const updateCase = async (caId, obj) => {
    let { data, error } = await supabase
        .from('cases')
        .update([obj])
        .eq('ca_id', caId)
    return data || error
}

const suspendDet = async (caId, detId, status) => {
    const { data, error } = await supabase
        .from('on_case')
        .update({ o_status: status == 'suspended' ? 'suspended' : 'on' })
        .eq('o_ca_id', caId)
        .eq('o_d_id', detId)
    return data || error
}

const updatePart = async (paId, status) => {
    const { data, error } = await supabase
        .from('participants')
        .update({ pa_status: status })
        .eq('pa_id', paId)
    return data || error
}

const changeTypePart = async (paId, type) => {
    const { data, error } = await supabase
        .from('participants')
        .update({ pa_type: type })
        .eq('pa_id', paId)
    return data || error
}

export function Case() {
    const params = useParams();
    const id = params.id;
    const [info, setInfo] = useState('');
    const [load, setLoad] = useState(true);
    const user = useSelector((state) => state.user);
    const [showWarn, setShowWarn] = useState(false);
    const [showClose, setShowClose] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);
    const [change, setChange] = useState({
        ch_name: '',
        ch_id: ''
    })
    const [selectChange, setSelectChange] = useState('');

    useEffect(() => {
        getDataCase(id).then(res => {
            setInfo(res[0]);
            console.log(res[0]);
            setLoad(false);
        });
    }, [load]);
    const [popup, setPopup] = useState('');
    const showPopup = (text) => {
        setPopup(text);
        setTimeout(() => {
            setPopup('')
        }, 3000)
    }
    const [guilty, setGuilty] = useState({
        pa_id: '',
        pa_name: ''
    });

    return (
        useAuth().isAuth ?
            <HighContainer>
                {load ?
                    <Loading>&#8987;</Loading>
                    :
                    <Container>
                        <Container id='main' gap="20px">
                            <Container w="255px" gap="10px">
                                <TextField type="h"><h2>Дeло №{info.ca_id}, {info.ca_title}</h2></TextField>
                                <TextField><b>Описание:</b> {info.ca_description}</TextField>
                                <TextField><b>Тип:</b> {info.ca_type}</TextField>
                                <TextField><b>Открыто:</b> {normalDate(info.ca_date_begin)}</TextField>
                                {
                                    info.ca_date_end &&
                                    <TextField><b>Закрыто или что-то произошло, чем бы оно ни было:</b> {normalDate(info.ca_date_end)}</TextField>
                                }
                                <TextField><b>Статус:</b> {info.ca_status == 'open' ? 'открыто' : info.ca_status == 'TAKENAWAY' ? user.login != 'federal' ? 'У ФЕДЕРАЛОВ, РАБОТАЙТЕ НА СВОЙ СТРАХ И РИСК' : 'У НАС :)' : 'закрыто'}</TextField>
                                {
                                    user.rights == 'admin' && info.ca_status == 'open' &&
                                    <Btn onClick={() => {
                                        setShowClose(true);
                                    }} w="255px" h="40px" size="15px">Закрыть дело</Btn>
                                }
                                <TextField type="h"><h3>Детективы:</h3></TextField>
                                <NavLink to={`/adddetective/${id}`}><Btn disabled={info.ca_status == 'close' || user.rights == 'user'} w="255px" warn h="30px">Добавить детектива</Btn></NavLink>
                                {info.on_case && info.on_case != 0 ?
                                    info.on_case.map((el, ind) => (
                                        <Container key={el.detectives.d_id} gap="5px">
                                            <NavLink to={`/profile/${el.detectives.d_id}`}><Btn title={info.on_case[ind].o_status == 'suspended' ? 'Отстранен' : 'В деле'} disabled={info.on_case[ind].o_status == 'suspended'} w="210px" h="40px" size="15px">
                                                {el.detectives.people.pe_surname} {el.detectives.people.pe_name} {el.detectives.people.pe_patronymic || ''}
                                            </Btn></NavLink>
                                            <Btn disabled={info.ca_status == 'close' || el.detectives.d_status == 'retired' || el.detectives.d_grade == 'kapitan' || user.rights == 'user'} size="18px" id={el.detectives.d_id} title={info.on_case[ind].o_status == 'suspended' ? 'Вернуть к делу' : 'Отстранить'} w="40px" h="40px" onClick={(e) => {
                                                if (info.on_case[ind].o_status == 'suspended') {
                                                    suspendDet(+id, el.detectives.d_id, 'on');
                                                } else {
                                                    suspendDet(+id, el.detectives.d_id, 'suspended');
                                                }
                                                setLoad(true);
                                            }}>{info.on_case[ind].o_status == 'suspended' ? String.fromCharCode(8629) : String.fromCharCode(10060)}</Btn>
                                        </Container>
                                    ))
                                    :
                                    <TextField>Нет данных</TextField>
                                }
                            </Container>
                            <Container w="255px" behav="row" gap="10px">
                                <TextField type="h"><h3>Доказательства:</h3></TextField>
                                <NavLink to={`/addproof/${id}/0/0`}><Btn disabled={info.ca_status == 'close'} w="255px" warn h="30px">Добавить улику</Btn></NavLink>
                                {info.proof && info.proof != 0 ?
                                    info.proof.map((el) => (
                                        <TextField key={el.pr_id}>
                                            <p><b>Название:</b> {el.pr_title}</p>
                                            <p><b>Описание:</b> {el.pr_description}</p>
                                            <p><b>Владелец:</b> {el.people ? el.people.pe_surname + ' ' + el.people.pe_name + ' ' + (el.people.pe_patronymic || '') : 'Нет данных'}</p>
                                            <br />
                                            <NavLink to={`/addproof/${id}/1/${el.pr_id}`}><Btn disabled={info.ca_status == 'close'} w="100%" h="30px">Изменить</Btn></NavLink>
                                        </TextField>
                                    ))
                                    :
                                    <TextField>Нет данных</TextField>
                                }
                            </Container>
                            <Container w="255px" gap="10px">
                                <TextField type="h"><h3>Участники:</h3></TextField>
                                <NavLink to={`/addparticipants/${id}`}><Btn disabled={info.ca_status == 'close'} w="255px" warn h="30px">Добавить участника</Btn></NavLink>
                                {info.participants && info.participants != 0 ?
                                    info.participants.map((el) => (
                                        <TextField key={el.pa_id}>
                                            <Container gap="7px">
                                                <Title>{el.pa_type}, {el.pa_status == 'innocent' ? 'невиновен' : el.pa_status == 'accused' ? 'обвиняемый' : 'виновен'}</Title>
                                                <NavLink to={`/search/${el.people.pe_id}`}><Btn size="15px" w="235px" h="40px">{el.people.pe_surname} {el.people.pe_name} {el.people.pe_patronymic || ''}</Btn></NavLink>
                                                {
                                                    el.testimony ?
                                                        el.testimony.map(el => (
                                                            <NavLink key={el.t_id} to={`/testimony/${el.t_id}`}><Btn w="235px" h="30px">Показания от {normalDate(el.t_date)}</Btn></NavLink>
                                                        ))
                                                        :
                                                        <Title>Показаний нет</Title>
                                                }
                                                <Container gap="5px">
                                                    <NavLink to={`/addtestimony/${id}/${el.pa_id}`}><Btn warn w="115px" h="30px" disabled={info.ca_status == 'close'}>Добавить показания</Btn></NavLink>
                                                    <Btn onClick={() => {
                                                        document.querySelector(`#main`).style.pointerEvents = 'none';
                                                        setGuilty({ pa_id: +el.pa_id, pa_name: el.people.pe_surname + ' ' + el.people.pe_name + ' ' + (el.people.pe_patronymic || '') })
                                                        setShowWarn(true);
                                                    }} warn w="115px" h="30px" disabled={info.ca_status == 'close' || (el.pa_status == 'accused' && user.rights != 'admin')}>{
                                                            user.rights == 'admin' ?
                                                                el.pa_status == 'accused' ?
                                                                    'Подтвердить вину'
                                                                    :
                                                                    'Объявить виновным'
                                                                :
                                                                'Предварительно виновен'
                                                        }</Btn>
                                                    <Btn disabled={info.ca_status == 'close'} onClick={() => {
                                                        setChange({ ch_id: +el.pa_id, ch_name: el.people.pe_surname + ' ' + el.people.pe_name + ' ' + (el.people.pe_patronymic || '') });
                                                        setChangeStatus(true);
                                                        setSelectChange(info.participants.find(elem => elem.pa_id == el.pa_id).pa_type);
                                                    }} warn w="235px" h="30px">Изменить тип</Btn>
                                                </Container>
                                            </Container>
                                        </TextField>
                                    ))
                                    :
                                    <TextField>Нет данных</TextField>
                                }
                            </Container>
                            <Container gap="10px" w="255px">
                                <NavLink to="/allcases"><Btn size="15px" w="255px" h="40px">К делам</Btn></NavLink>
                                <NavLink to={`/allcases/${id}/caseline`}><Btn size="15px" w="255px" h="40px">Линия расследования</Btn></NavLink>
                                <NavLink to={`/allcases/${id}/casemapa`}><Btn size="15px" w="255px" h="40px">Карта</Btn></NavLink>
                                <NavLink to={`/allcases/${id}/casedesk`}><Btn size="15px" w="255px" h="40px">П(очти)робковая доска</Btn></NavLink>
                                {
                                    user.login == 'federal' &&
                                    <Btn disabled={info.ca_status == 'TAKENAWAY' || info.ca_status == 'close'} onClick={() => {
                                        updateCase(info.ca_id, { ca_status: 'TAKENAWAY', ca_date_end: new Date() })
                                    }}
                                        fed size="15px" w="255px" h="40px"><b>ЗАБРАТЬ ДЕЛО</b></Btn>
                                }
                            </Container>
                        </Container>
                        <Container>
                            <Popup none={!popup}>{popup}</Popup>
                            {(showWarn || showClose || changeStatus) && <Voile />}
                            {showWarn &&
                                <Warning>
                                    {
                                        user.rights == 'admin' ?
                                            <Container h="100%" gap="20px" at="center">
                                                <TextField>Как только вы объявите участника {guilty.pa_name} виновным, дело будет закрыто. После закрытия дела манипуляции с ним <b>невозможны</b>. <br />Если же обвиняемый невиновен, вы можете оправдать его</TextField>
                                                <Container w="100%" gap="20px">
                                                    <Btn size="15px" w="100%" h="40px" onClick={() => {
                                                        updatePart(guilty.pa_id, 'guilty').then(res => {
                                                            setShowWarn(false);
                                                            document.querySelector(`#main`).style.pointerEvents = 'all';
                                                            updateCase(info.ca_id, { ca_status: 'close', ca_date_end: new Date() }).then(res => {
                                                                setLoad(true);
                                                                showPopup('Дело закрыто, обвинен ' + guilty.pa_name);
                                                                setGuilty({ pa_id: '', pa_name: '' });
                                                            })
                                                        })
                                                    }}>Объявить участника {guilty.pa_name} виновным</Btn>
                                                    {
                                                        info.participants.find(el => el.pa_id == guilty.pa_id).pa_status != 'innocent' &&
                                                        <Btn size="15px" onClick={() => {
                                                            updatePart(guilty.pa_id, 'innocent').then(res => {
                                                                setGuilty({ pa_id: '', pa_name: '' });
                                                                setShowWarn(false);
                                                                document.querySelector(`#main`).style.pointerEvents = 'all';
                                                                showPopup(guilty.pa_name + ' предварительно обвинен');
                                                                setLoad(true);
                                                            })
                                                        }} w="100%" h="40px">Оправдать участника {guilty.pa_name}</Btn>
                                                    }
                                                    <Btn size="15px" onClick={() => {
                                                        setGuilty({ pa_id: '', pa_name: '' });
                                                        setShowWarn(false);
                                                        document.querySelector(`#main`).style.pointerEvents = 'all';
                                                    }
                                                    } w="100%" h="40px">Пока просто закрыть окно</Btn>
                                                </Container>
                                            </Container>
                                            :
                                            <Container h="100%" gap="20px" at="center">
                                                <TextField>Как только вы заявите об обвинении участника {guilty.pa_name}, капитан объявит его виновным или снимет вину. Вы точно хотите продолжить?</TextField>
                                                <Container w="100%" gap="20px">
                                                    <Btn size="15px" w="100%" h="40px" onClick={() => {
                                                        updatePart(guilty.pa_id, 'accused').then(res => {
                                                            setShowWarn(false);
                                                            document.querySelector(`#main`).style.pointerEvents = 'all';
                                                            showPopup(guilty.pa_name + ' предварительно обвинен');
                                                            setLoad(true);
                                                        })
                                                    }}>Да, обвинить участника {guilty.pa_name}</Btn>
                                                    <Btn size="15px" onClick={() => {
                                                        setGuilty({ pa_id: '', pa_name: '' });
                                                        setShowWarn(false);
                                                        document.querySelector(`#main`).style.pointerEvents = 'all';
                                                    }} w="100%" h="40px">Нет, закрыть окно</Btn>
                                                </Container>
                                            </Container>
                                    }
                                </Warning>
                            }
                            {
                                showClose &&
                                <Warning>
                                    <Container h="100%" gap="20px" at="center">
                                        <TextField>Вы уверены, что хотите закрыть дело? После выполнения данного действия манипуляции с ним будут невозможны, открыть дело снова нельзя, необходимо будет завести новое</TextField>
                                        <TextField>Закрыть дело?</TextField>
                                        <Container w="100%" gap="20px">
                                            <Btn onClick={() => {
                                                updateCase(info.ca_id, { ca_status: 'close', ca_date_end: new Date() }).then(res => {
                                                    setShowClose(false);
                                                    document.querySelector(`#main`).style.pointerEvents = 'all';
                                                    setLoad(true);
                                                    showPopup('Дело закрыто');
                                                })
                                            }} w="100%" h="40px" size="15px">Да, закрыть дело</Btn>
                                            <Btn size="15px" onClick={() => {
                                                setShowClose(false);
                                                document.querySelector(`#main`).style.pointerEvents = 'all';
                                            }} w="100%" h="40px">Нет, закрыть окно</Btn>
                                        </Container>
                                    </Container>
                                </Warning>
                            }
                            {
                                changeStatus &&
                                <Warning>
                                    <Container h="100%" gap="20px" at="center">
                                        <TextField>Вы хотите поменять тип участника {change.ch_name}?</TextField>
                                        <TextField>
                                            <p>Поменять на:</p>
                                            <br />
                                            <Container fe="space-around">
                                                <Btn selected={selectChange == 'Свидетель'} onClick={() => {
                                                    setSelectChange('Свидетель')
                                                }} size="15px" h="30px" w="150px">Свидетель</Btn>
                                                <Btn selected={selectChange == 'Подозреваемый'} onClick={() => {
                                                    setSelectChange('Подозреваемый')
                                                }} size="15px" h="30px" w="150px">Подозреваемый</Btn>
                                                <Btn selected={selectChange == 'Пострадавший'} onClick={() => {
                                                    setSelectChange('Пострадавший')
                                                }} size="15px" h="30px" w="150px">Пострадавший</Btn>
                                            </Container>
                                        </TextField>
                                        <Container w="100%" gap="20px">
                                            <Btn w="100%" h="40px" onClick={() => {
                                                if (selectChange !== info.participants.find(el => el.pa_id == change.ch_id).pa_type) {
                                                    changeTypePart(change.ch_id, selectChange).then(res => {
                                                        document.querySelector(`#main`).style.pointerEvents = 'all';
                                                        setChangeStatus(false);
                                                        setLoad(true);
                                                        showPopup('Тип участника ' + change.ch_name + ' изменен на ' + selectChange);
                                                    })
                                                }
                                            }}>Сохранить</Btn>
                                            <Btn onClick={() => {
                                                setSelectChange('');
                                                setChangeStatus(false);
                                                document.querySelector(`#main`).style.pointerEvents = 'all';
                                            }} w="100%" h="40px">Отменить</Btn>
                                        </Container>
                                    </Container>
                                </Warning>
                            }
                        </Container>
                    </Container>
                }
            </HighContainer >
            :
            <Navigate to="/" replace />
    )
}
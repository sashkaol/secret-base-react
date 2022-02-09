import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './SupaBase';
import { Btn, Container, TextField, Title, Loading, HighContainer, Popup } from './styles/styles';
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
    // .eq('on_case.o_status', 'on')
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

export function Case() {
    const params = useParams();
    const id = params.id;
    const [info, setInfo] = useState('');
    const [load, setLoad] = useState(true);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        getDataCase(id).then(res => {
            setInfo(res[0]);
            console.log(res[0]);
            setLoad(false);
        });
    }, [load]);

    return (
        useAuth().isAuth ?
            <HighContainer>
                {load ?
                    <Loading>&#8987;</Loading>
                    :
                    <Container gap="20px">
                        <Container w="255px" gap="10px">
                            <TextField type="h"><h2>Дeло №{info.ca_id}, {info.ca_title}</h2></TextField>
                            <TextField><b>Описание:</b> {info.ca_description}</TextField>
                            <TextField><b>Тип:</b> {info.ca_type}</TextField>
                            <TextField><b>Открыто:</b> {normalDate(info.ca_date_begin)}</TextField>
                            <TextField><b>Статус:</b> {info.ca_status == 'open' ? 'открыто' : 'закрыто'}</TextField>
                            <TextField type="h"><h3>Детективы:</h3></TextField>
                            <NavLink to={`/adddetective/${id}`}><Btn w="255px" warn h="30px">Добавить детектива</Btn></NavLink>
                            {info.on_case && info.on_case != 0 ?
                                info.on_case.map((el, ind) => (
                                    <Container key={el.detectives.d_id} gap="5px">
                                        <NavLink to={`/profile/${el.detectives.d_id}`}><Btn title={info.on_case[ind].o_status == 'suspended' ? 'Отстранен' : 'В деле'} disabled={info.on_case[ind].o_status == 'suspended'} w="210px" h="40px" size="15px">
                                            {el.detectives.people.pe_surname} {el.detectives.people.pe_name} {el.detectives.people.pe_patronymic || ''}
                                        </Btn></NavLink>
                                        <Btn size="18px" id={el.detectives.d_id} title={info.on_case[ind].o_status == 'suspended' ? 'Вернуть к делу' : 'Отстранить'} w="40px" h="40px" onClick={(e) => {
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
                            <NavLink to={`/addproof/${id}/0`}><Btn w="255px" warn h="30px">Добавить улику</Btn></NavLink>
                            {info.proof && info.proof != 0 ?
                                info.proof.map((el) => (
                                    <TextField key={el.pr_id}>
                                        <p><b>Название:</b> {el.pr_title}</p>
                                        <p><b>Описание:</b> {el.pr_description}</p>
                                        <p><b>Владелец:</b> {el.people ? el.people.pe_surname + ' ' + el.people.pe_name + ' ' + (el.people.pe_patronymic || '') : 'Нет данных'}</p>
                                        <br />
                                        <NavLink to={`/addproof/${id}/1/${el.pr_id}`}><Btn w="100%" h="30px">Изменить</Btn></NavLink>
                                    </TextField>
                                ))
                                :
                                <TextField>Нет данных</TextField>
                            }
                        </Container>
                        <Container w="255px" gap="10px">
                            <TextField type="h"><h3>Участники:</h3></TextField>
                            <NavLink to={`/addparticipants/${id}`}><Btn w="255px" warn h="30px">Добавить участника</Btn></NavLink>
                            {info.participants && info.participants != 0 ?
                                info.participants.map((el) => (
                                    <TextField key={el.pa_id}>
                                        <Container gap="7px">
                                            <Title>{el.pa_type}, {el.pa_status == 'innocent' ? 'невиновен' : 'виновен'}</Title>
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
                                                <Btn warn w="115px" h="30px">Добавить показания</Btn>
                                                <Btn warn w="115px" h="30px">Объявить виновным</Btn>
                                            </Container>
                                        </Container>
                                    </TextField>
                                ))
                                :
                                <TextField>Нет данных</TextField>
                            }
                        </Container>
                        <Container w="255px">
                            <NavLink to="/allcases"><Btn size="15px" w="255px" h="40px">К делам</Btn></NavLink>
                        </Container>
                    </Container>
                }
            </HighContainer>
            :
            <Navigate to="/" replace />
    )
}
import { useAuth } from "./hooks/user-auth";
import { Btn, Container, HighContainer, Loading, TextField, Voile, Warning, Popup, Title } from "./styles/styles";
import { Navigate, Link } from 'react-router-dom';
import { supabase } from "./SupaBase";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

const getDets = async () => {
    let { data, error } = await supabase
        .from('detectives')
        .select('*, people (*)')
    return data || error
}

const retireDetective = async (id) => {
    let { data, error } = await supabase
        .from('detectives')
        .update({ d_status: 'retired' })
        .eq('d_id', id)
    return data || error
}

const setKapitan = async (id) => {
    let { data, error } = await supabase
        .from('detectives')
        .update({ d_grade: 'kapitan', d_rights: 'admin' })
        .eq('d_id', id)
    return data || error
}

export function Detectives() {

    const [dets, setDets] = useState([]);
    const [load, setLoad] = useState(true);
    const user = useSelector((state) => state.user);
    const [retired, setRetired] = useState('');
    const [showWarn, setShowWarn] = useState(false);
    const [showDifWarn, setShowDifWarn] = useState(false);
    const [newKap, setNewKap] = useState('');

    const [popup, setPopup] = useState('');
    const showPopup = (text) => {
        setPopup(text);
        setTimeout(() => {
            setPopup('')
        }, 3000)
    }

    useEffect(() => {
        getDets().then(res => {
            setDets(res);
            setLoad(false);
        })
    }, [load]);

    const retireDet = (id) => {
        setRetired(+id);
        setShowWarn(true);
    }

    const highDet = (id) => {
        setNewKap(id);
        setShowDifWarn(true);
    }

    return (
        useAuth().isAuth ?
            <HighContainer>
                <Container w="100%" gap="10px">
                    <Container w="300px" gap="10px">
                        <TextField type="h">Капитаны</TextField>
                        <Container fe="center" w="100%" gap="10px">
                            {
                                !load ?
                                    dets.map(el => (
                                        el.d_grade == 'kapitan' &&
                                        <Container key={el.d_id} w="100%" gap="5px">
                                            <Link to={`/profile/${el.d_id}`}><Btn w="250px" size="15px" h="40px">{el.people.pe_surname} {el.people.pe_name} {el.people.pe_patronymic || ''}</Btn></Link>
                                            <Btn onClick={() => retireDet(el.d_id)} disabled={user.rights == 'user' || el.d_status != 'working'} title={user.id == el.d_id ? 'Уволиться' : 'Отправить в отставку'} size="15px" w="40px" h="40px">&#10060;</Btn>
                                        </Container>
                                    ))
                                    :
                                    <Loading>&#8987;</Loading>
                            }
                        </Container>
                    </Container>
                    <Container w="300px" gap="10px">
                        <TextField type="h">Детективы</TextField>
                        <Container fe="center" w="100%" gap="10px">
                            {
                                !load ?
                                    dets.map(el => (
                                        el.d_grade == 'detective' &&
                                        <TextField key={el.d_id}>
                                            <Container w="100%" gap="5px">
                                                <Title>{el.d_status != 'working' && 'В отставке'}</Title>
                                                <Link to={`/profile/${el.d_id}`}><Btn w="280px" size="15px" h="40px" key={el.d_id}>{el.people.pe_surname} {el.people.pe_name} {el.people.pe_patronymic || ''}</Btn></Link>
                                                <Container gap="5px">
                                                    <Btn onClick={() => retireDet(el.d_id)} disabled={el.d_status != 'working' || (user.rights == 'user' && user.id != el.d_id)} size="15px" w="137.5px" h="40px">{user.id == el.d_id ? 'Уволиться' : 'Отправить в отставку'}</Btn>
                                                    <Btn onClick={() => highDet(el.d_id)} disabled={user.rights == 'user' || el.d_status != 'working'} size="15px" w="137.5px" h="40px">Повысить до капитана</Btn>
                                                </Container>
                                            </Container>
                                        </TextField>

                                    ))
                                    :
                                    <Loading>&#8987;</Loading>
                            }
                        </Container>
                    </Container>
                    {(showWarn || showDifWarn) && <Voile />}
                    {showWarn && retired &&
                        <Warning>
                            <Container w="100%" gap="7px">
                                <TextField>{user.id == retired ? 'Вы хотите уйти в отставку?' : 'Вы хотите отправить в отставку ' + dets.find(el => el.d_id == retired).people.pe_surname + " " + dets.find(el => el.d_id == retired).people.pe_name + " " + (dets.find(el => el.d_id == retired).people.pe_patronymic || '') + '?'} После отставки {user.id == retired ? 'вы потеряете' : 'пользователь потеряет'} возможность входить в систему, но профиль и все записи будут храниться всегда.</TextField>
                                {
                                    dets.find(el => (el.d_grade == 'kapitan' && el.d_id != user.id)) == undefined && user.id == retired ?
                                        <TextField>Вы не можете подать в отставку сейчас, поскольку участок останется без капитана! Поставьте кого-то на эту должность, а уже потом мы устроим вам прощальную вечеринку.
                                        </TextField>
                                        :
                                        <Container w="100%" gap="10px">
                                            <TextField>Вы хорошо подумали?</TextField>
                                            <Btn onClick={() => {
                                                retireDetective(+retired);
                                                setShowWarn(false);
                                                setLoad(true);
                                                showPopup(dets.find(el => el.d_id == retired).people.pe_surname + " " + dets.find(el => el.d_id == retired).people.pe_name + " " + (dets.find(el => el.d_id == retired).people.pe_patronymic || '') + ' отныне в отставке');
                                            }} w="100%" h="40px" size="15px">Да, мое решение твердо</Btn>
                                        </Container>
                                }
                                <Btn w="100%" h="40px" size="15px" onClick={() => {
                                    setShowWarn(false);
                                }}>Закрыть</Btn>
                            </Container>
                        </Warning>
                    }
                    {showDifWarn && newKap &&
                        <Warning>
                            <Container w="100%" gap="7px">
                                <TextField>{'Вы хотите повысить ' + dets.find(el => el.d_id == newKap).people.pe_surname + " " + dets.find(el => el.d_id == newKap).people.pe_name + " " + (dets.find(el => el.d_id == newKap).people.pe_patronymic || '') + ' до капитана?'} Капитан получит права администратора.</TextField>
                                <Container w="100%" gap="10px">
                                    <TextField>Вы хорошо подумали?</TextField>
                                    <Btn onClick={() => {
                                        setKapitan(+newKap);
                                        setShowDifWarn(false);
                                        setLoad(true);
                                        showPopup(dets.find(el => el.d_id == newKap).people.pe_surname + " " + dets.find(el => el.d_id == newKap).people.pe_name + " " + (dets.find(el => el.d_id == newKap).people.pe_patronymic || '') + ' отныне капитан. Мы устроим вечеринку по этому поводу!');
                                    }} w="100%" h="40px" size="15px">Да, мое решение твердо</Btn>
                                    <Btn w="100%" h="40px" size="15px" onClick={() => {
                                        setShowDifWarn(false);
                                    }}>Нет, пока закрыть окно</Btn>
                                </Container>
                            </Container>
                        </Warning>
                    }
                    <Popup none={!popup}>{popup}</Popup>
                </Container>
            </HighContainer>
            :
            <Navigate to="/" />
    )
}
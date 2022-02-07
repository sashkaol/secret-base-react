import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './SupaBase';
import { Btn, Container, TextField, Title, Loading, HighContainer } from './styles/styles';
import { useSelector } from 'react-redux';
import { useAuth } from './hooks/user-auth';
import { Navigate, NavLink } from 'react-router-dom';

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
    }, []);

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
                            <TextField><b>Открыто:</b> {info.ca_date_begin}</TextField>
                            <TextField><b>Статус:</b> {info.ca_status == 'open' ? 'открыто' : 'закрыто'}</TextField>
                        </Container>
                        <Container w="255px" behav="row" gap="10px">
                            <TextField type="h"><h3>Доказательства:</h3></TextField>
                            {info.proof && info.proof != 0 ?
                                info.proof.map((el) => (
                                    <TextField key={el.pr_id}>
                                        <p><b>Название:</b> {el.pr_title}</p>
                                        <p><b>Описание:</b> {el.pr_description}</p>
                                        <p><b>Владелец:</b> {el.people ? el.people.pe_surname + ' ' + el.people.pe_name + ' ' + el.people.pe_patronymic : 'Нет данных'}</p>
                                    </TextField>
                                ))
                                :
                                <TextField>Нет данных</TextField>
                            }
                            <TextField type="h"><h3>Участники:</h3></TextField>
                            {info.participants && info.participants != 0 ?
                                info.participants.map((el) => (
                                    <TextField key={el.pa_id}>
                                        <Container gap="7px">
                                            <Title>{el.pa_type}</Title>
                                            <NavLink to={`/search/${el.people.pe_id}`}><Btn size="15px" w="235px" h="40px">{el.people.pe_surname + ' ' + el.people.pe_name + ' ' + el.people.pe_patronymic}</Btn></NavLink>
                                            {
                                                el.testimony &&
                                                    el.testimony.map(el => (
                                                        <NavLink to={`/testimony/${el.t_id}`}><Btn w="235px" h="30px" key={el.t_id}>Показания от {el.t_date}</Btn></NavLink>
                                                    ))
                                            }
                                        </Container>
                                    </TextField>
                                ))
                                :
                                <TextField>Нет данных</TextField>
                            }
                        </Container>
                        <Container w="255px" gap="10px">
                            <TextField type="h"><h3>Детективы:</h3></TextField>
                            {info.on_case && info.on_case != 0 ?
                                info.on_case.map((el) => (
                                    <NavLink key={el.detectives.d_id} to={`/profile/${el.detectives.d_id}`}><Btn w="255px" h="40px" size="15px">
                                        {el.detectives.people.pe_surname} {el.detectives.people.pe_name} {el.detectives.people.pe_patronymic || ''}
                                    </Btn></NavLink>
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
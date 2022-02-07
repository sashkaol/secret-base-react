import { NavLink, useParams } from 'react-router-dom';
import { supabase } from './SupaBase';
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/user-auth';
import { Navigate } from 'react-router-dom';
import { TextField, Title, Container, Loading, Btn, HighContainer } from './styles/styles';
import { normalDate } from './App';

const getPeopleInfo = async (id) => {
    let { data, error } = await supabase
        .from('people')
        .select(`*, 
            pe_mom: pe_mom (*),
            pe_dad: pe_dad (*)
        `)
        .eq('pe_id', id)
    return data || error
}

const getRelationship = async (id) => {
    let { data, error } = await supabase
        .from('relationship', 'people')
        .select(`
            *,
            r_pers_1: r_pers_1 (pe_id, pe_name, pe_surname, pe_patronymic),
            r_pers_2: r_pers_2 (pe_id, pe_name, pe_surname, pe_patronymic)
        `)
        .or(`r_pers_1.eq.${id},r_pers_2.eq.${id}`)
    return data || error
}

const getChildren = async (id) => {
    let { data, error } = await supabase
        .from('people')
        .select('pe_id, pe_name, pe_surname, pe_patronymic')
        .or(`pe_mom.eq.${id},pe_dad.eq.${id}`)
    return data || error
}

export function Card() {
    const params = useParams();
    const id = params.id;
    const [data, setData] = useState({});
    const [rels, setRels] = useState({});
    const [pare, setPare] = useState({});
    const [children, setChildren] = useState([]);
    const [load, setLoad] = useState(true);
    useEffect(() => {
        getPeopleInfo(id)
            .then(res => {
                setData(res[0]);
                getRelationship(id).then(res => {
                    setRels(res[0]);
                    if (res[0]) {
                        if (res[0].r_pers_1.pe_id == id) {
                            setPare(res[0].r_pers_2)
                        } else {
                            setPare(res[0].r_pers_1)
                        }
                    }
                    getChildren(id).then(res => {
                        setChildren(res);
                        setLoad(false);
                    })
                })
            })
            .catch(err => console.log(err))
    }, [id]);
    return (
        useAuth().isAuth ?
            !load ?
                <HighContainer>
                    <Container gap="20px">
                        <Container behav="column" w="255px" gap="5px">
                            <TextField type="h">Контактная информация</TextField>
                            <Title>Полное имя</Title>
                            <TextField>{data.pe_surname} {data.pe_name} {data.pe_patronymic}</TextField>
                            <Title>Дата рождения</Title>
                            <TextField h="40px">{normalDate(data.pe_date_birth)}</TextField>
                            <Title>Адрес</Title>
                            <TextField>{data.pe_address}</TextField>
                            <Title>Спутник жизни</Title>
                            {
                                pare.pe_id ?
                                    <NavLink to={`/search/${pare.pe_id}`}>
                                        <Btn size="15px" onClick={() => setLoad(true)} w="250px" h="40px">{pare.pe_surname} {pare.pe_name} {pare.pe_patronymic || ''}</Btn>
                                    </NavLink>
                                    :
                                    <TextField>Нет данных</TextField>
                            }
                            {
                                rels &&
                                <Container gap="5px">
                                    <Title>Статус отношений</Title>
                                    <TextField>{rels.r_status} с {normalDate(rels.r_date_begin)} {rels.r_date_end ? 'по ' + normalDate(rels.r_date_end) : pare.pe_id == 3 || pare.pe_id == 4 ? <span>и до конца &#9829;	</span> : ''}</TextField>
                                </Container>
                            }
                        </Container>
                        <Container w="255px" behav="column" gap="5px">
                            <TextField type="h">Родители</TextField>
                            <Title>Отец</Title>
                            {
                                data.pe_dad ?
                                    <Container gap="5px">
                                        <NavLink to={`/search/${data.pe_dad.pe_id}`}>
                                            <Btn size="15px" onClick={() => setLoad(true)} w="250px" h="40px">{data.pe_dad.pe_surname} {data.pe_dad.pe_name} {data.pe_dad.pe_patronymic}</Btn>
                                        </NavLink>
                                        <Title>Дата рождения</Title>
                                        <TextField h="40px">{normalDate(data.pe_dad.pe_date_birth)}</TextField>
                                        <Title>Адрес</Title>
                                        <TextField>{data.pe_dad.pe_address}</TextField>
                                    </Container>
                                    :
                                    <TextField>Нет данных</TextField>
                            }
                            <Title>Мать</Title>
                            {
                                data.pe_mom ?
                                    <Container gap="5px">
                                        <NavLink to={`/search/${data.pe_mom.pe_id}`}>
                                            <Btn size="15px" w="250px" h="40px" onClick={() => setLoad(true)}>{data.pe_mom.pe_surname} {data.pe_mom.pe_name} {data.pe_mom.pe_patronymic}</Btn>
                                        </NavLink>
                                        <Title>Дата рождения</Title>
                                        <TextField h="40px">{normalDate(data.pe_mom.pe_date_birth)}</TextField>
                                        <Title>Адрес</Title>
                                        <TextField>{data.pe_mom.pe_address}</TextField>
                                    </Container>
                                    :
                                    <TextField>Нет данных</TextField>
                            }
                        </Container>
                        <Container w="255px" behav="column" gap="5px">
                            <TextField type="h">Дети</TextField>
                            {
                                children != 0 ?
                                    <Container gap="5px">
                                        {
                                            children.map(el => (
                                                <NavLink to={`/search/${el.pe_id}`}>
                                                    <Btn size="15px" w="250px" h="40px" onClick={() => setLoad(true)}>{el.pe_surname} {el.pe_name} {el.pe_patronymic}</Btn>
                                                </NavLink>
                                            ))
                                        }
                                    </Container>
                                    :
                                    <TextField>Нет данных</TextField>
                            }
                        </Container>
                        <Container w="255px">
                            <NavLink to="/search"><Btn size="15px" w="250px" h="40px">К поиску</Btn></NavLink>
                        </Container>
                    </Container>
                </HighContainer>
                :
                <HighContainer>
                    <Loading>&#8987;</Loading>
                </HighContainer>
            :
            <Navigate to='/' replace />
    )
}
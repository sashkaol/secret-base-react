import { useAuth } from './hooks/user-auth';
import { Container, Loading, Input, Btn, TextField, Title, HighContainer } from './styles/styles';
import { Navigate, NavLink } from 'react-router-dom';
import { supabase } from './SupaBase';
import { useState } from 'react';

const getData = async (text) => {
    let { data, error } = await supabase
        .from('people')
        .select('*')
        .or(`pe_name.ilike.%${text}%,pe_surname.ilike.%${text}%`)
    return data || error
}

export function SearchPage() {

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [load, setLoad] = useState(false);

    return (
        useAuth().isAuth ?
            <HighContainer>
                <Container behav="column" gap="10px">
                    <Container gap="5px">
                        <Input size="15px" w="295px" placeholder="Поиск..." onChange={(e) => {
                            setSearch(e.target.value);
                        }} />
                        <Btn disabled={load} size="15px" w="100px" h="40px" onClick={() => {
                            setLoad(true);
                            getData(search).then(res => {
                                setResults(res);
                                setLoad(false);
                            });
                        }}>{!load ?
                            <p>Найти &#128270;</p>
                            :
                            <Loading>&#8987;</Loading>
                            }</Btn>
                    </Container>
                    {
                        <Container w="250px" gap="10px">
                            {
                                results.map(el => (
                                    <NavLink key={el.pe_id} to={`/search/${el.pe_id}`}><Btn size="15px" w="400px" h="40px">{el.pe_surname} {el.pe_name} {el.pe_patronymic || ''}</Btn></NavLink>
                                ))
                            }
                        </Container>
                    }
                </Container>
            </HighContainer>
            :
            <Navigate to='/' replace />
    )
}
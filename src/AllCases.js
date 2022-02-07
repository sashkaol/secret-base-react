import { useState, useEffect } from 'react';
import { CaseBook, Overlay, Container, Loading, HighContainer } from './styles/styles';
import { NavLink, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/user-auth';
import { supabase } from './SupaBase';

const fetchData = async () => {
    let { data: cases, error } = await supabase
        .from('cases')
        .select('ca_id, ca_title')
    return cases || error;
}

export default function AllCases() {

    const [allCases, setAllCases] = useState([]);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        fetchData().then(res => {
            setAllCases(res);
            setLoad(false);
        });
    }, []);

    return (
        useAuth().isAuth ?
            <HighContainer>
                <Container gap="15px">
                    {
                        load && <Loading>&#8987;</Loading>
                    }
                    {
                        allCases.map((el) => (
                            <CaseBook key={el.ca_id}>
                                <h3>Дело №{el.ca_id}</h3>
                                <p>{el.ca_title}</p>
                                <NavLink to={`/allcases/${el.ca_id}`}><Overlay /></NavLink>
                            </CaseBook>
                        ))
                    }
                </Container>
            </HighContainer>
            :
            <Navigate to='/' replace />
    )
}
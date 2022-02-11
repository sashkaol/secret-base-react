import { useState, useEffect } from 'react';
import { CaseBook, Overlay, Container, Loading, HighContainer, Warning, Input, Btn,  } from './styles/styles';
import { NavLink, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/user-auth';
import { supabase } from './SupaBase';
import { useSelector } from 'react-redux';

const fetchData = async () => {
    let { data: cases, error } = await supabase
        .from('cases')
        .select('ca_id, ca_title, ca_status')
    return cases || error;
}

const fetchUniqData = async (id) => {
    let { data: cases, error } = await supabase
        .from('on_case')
        .select('*, cases(ca_id, ca_title, ca_status)')
        .eq('o_d_id', id)
    return cases || error;
}

export default function AllCases() {

    const [allCases, setAllCases] = useState([]);
    const [load, setLoad] = useState(true);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        console.log(user.rights);
        if (user.rights == 'admin') {
            fetchData().then(res => {
                setAllCases(res);
                setLoad(false);
            });
        } else {
            fetchUniqData(user.id).then(res => {
                setAllCases(res);
                setLoad(false);
            })
        }
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
                            <CaseBook key={el.ca_id || el.cases.ca_id}>
                                <h3>Дело №{el.ca_id || el.cases.ca_id}</h3>
                                <br />
                                <p>{el.ca_title || el.cases.ca_title}</p>
                                <br />
                                <p>{el.ca_status || el.cases.ca_status == 'open' ? 'открыто' : 'закрыто'}</p>
                                <NavLink to={`/allcases/${el.ca_id || el.cases.ca_id}`}><Overlay /></NavLink>
                            </CaseBook>
                        ))
                    }
                </Container>
            </HighContainer>
            :
            <Navigate to='/' replace />
    )
}
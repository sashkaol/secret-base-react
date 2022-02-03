import { useState, useEffect } from 'react';
import { CaseBook, Overlay, Btn, Container } from './styles/styles';
import { Link, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/user-auth';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from './store/slices/userSlice';

import { supabase } from './SupaBase';

const fetchData = async () => {
    let { data: cases, error } = await supabase
        .from('cases')
        .select('ca_id, ca_title')
    return cases || error;
}

export default function AllCases() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [allCases, setAllCases] = useState([]);

    useEffect(() => {
        fetchData().then(res => setAllCases(res));
    }, []);

    return (
        useAuth().isAuth ?
            <Container behav="row" gap="15px" padd="false">
                <Container w="400px" behav="row" gap="15px" padd="false">
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
                <Container behav="row" padd="false">
                    {
                        user.rights == 'admin' ?
                            <Link to="/menu"><Btn size="15px" w="250px" h="40px">Обратно</Btn></Link>
                            :
                            <Btn size="15px" w="250px" h="40px" onClick={() => {
                                dispatch(removeUser());
                            }}>Выйти из системы</Btn>
                    }
                </Container>
            </Container>
            :
            <Navigate to='/' replace />
    )
}
import { useState, useEffect } from 'react';
import { CaseBook, Overlay, Btn, Container } from './styles/styles';
import { Link } from 'react-router-dom';

import { supabase } from './SupaBase';

const fetchData = async () => {
    let { data: cases, error } = await supabase
        .from('cases')
        .select('*')
    return cases || error;
}

const getDataCase = async (param) => {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('ca_id', param)
    return data || error
}

export default function AllCases() {

    const [allCases, setAllCases] = useState([]);
    const [cases, setCases] = useState({});

    useEffect(() => {
        fetchData().then(res => setAllCases(res));
    }, []);

    const getCase = (id) => {
        getDataCase(id).then(res => setCases(res));
    }

    return (
        <Container behav="row" gap="15px" padd="false">
            <Container w="400px" behav="row" gap="15px" padd="false">
                {
                    allCases.map((el) => (
                        <CaseBook key={el.ca_id}>
                            <h3>Дело №{el.ca_id}</h3>
                            <p>{el.ca_title}</p>
                            <Overlay onClick={() => getCase(el.ca_id)} />
                        </CaseBook>
                    ))
                }
            </Container>
            <Container behav="row" padd="false">
                <Btn w="250px" h="40px"><Link to="/menu">Обратно</Link></Btn>
            </Container>
        </Container>
    )
}
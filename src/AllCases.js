import { useState, useEffect } from 'react';
import { CaseBook, CaseList, Overlay } from './styles/styles';

import { supabase } from './LogIn';

export function Case({ title, desk }) {
    return (
        <div>
            <div>{title}</div>
            <div>{desk}</div>
        </div>
    )
}

const fetchData = async () => {
    let { data: cases, error } = await supabase
        .from('cases')
        .select('*')
    return cases;
}

const getDataCase = async (param) => {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('ca_id', param)
    return data
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
        <div>
            <CaseList>
                {
                    allCases.map((el) => (
                        <CaseBook key={el.ca_id}>
                            <h3>Дело №{el.ca_id}</h3>
                            <p>{el.ca_title}</p>
                            <Overlay onClick={() => getCase(el.ca_id)} />
                        </CaseBook>
                    ))
                }
            </CaseList>
            {cases[0] &&
                <Case title={cases[0].ca_type} desk={cases[0].ca_description} />
            }
            <br />
            {
                !cases[0] && 'Данные не найдены'
            }
        </div>
    )
}
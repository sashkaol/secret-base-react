import { useState, useEffect } from 'react';
import { CaseBook, CaseList, Overlay } from './styles/styles';

import { supabase } from './SupaBase';

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
    return cases || error;
}

const getDataCase = async (param) => {
    const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('ca_id', param)
    return data || error
}

export default function AllCases({ author }) {

    const [allCases, setAllCases] = useState([]);
    const [cases, setCases] = useState({});

    useEffect(() => {
        fetchData().then(res => setAllCases(res));
        console.log(author);
    }, []);

    const getCase = (id) => {
        getDataCase(id).then(res => setCases(res));
    }

    return (
        <div>
            {author ?
                <div>
                    <p>Вы зашли под именем {author}</p>
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
                </div>
                : 'Вы не авторизованы и не имеет доступа к данным'
            }

            {
                cases[0] &&
                <Case title={cases[0].ca_type} desk={cases[0].ca_description} />
            }
            <br />
            {
                !cases[0] && 'Данные не найдены'
            }
        </div >
    )
}
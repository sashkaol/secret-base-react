import { useState, useEffect } from 'react';
import axios from 'axios';
import { CaseBook, CaseList, Overlay } from './styles/styles';

export function Case({ title, desk }) {
    return (
        <div>
            <div>{title}</div>
            <div>{desk}</div>
        </div>
    )
}

export default function AllCases() {

    const [allCases, setAllCases] = useState([]);
    const [cases, setCases] = useState({});
    // const [id, setId] = useState(0);
    const [isLoad, setLoad] = useState(false);

    useEffect(() => {
        axios.post('http://localhost:3001/allCases').then(res => setAllCases(res.data));
        if (allCases.length != 0) setLoad(true);
        else setLoad(!isLoad);
        console.log(isLoad);
    }, [isLoad]);

    const getCase = (id) => {
        axios.post('http://localhost:3001/cases', { id: id }).then(res => setCases(res));
    }

    return (
        <div>
            <CaseList>
                {isLoad &&
                    allCases.map((el) => (
                        <CaseBook key={el.id}>
                            <h3>Дело №{el.id}</h3>
                            <p>{el.description}</p>
                            <Overlay onClick={() => getCase(el.id)} />
                        </CaseBook>
                    ))
                }
            </CaseList>
            {/* <input type="number" onChange={(e) => {
                setId(e.target.value);
            }} />
            <button onClick={() => { getCase(id) }}>click</button> */}
            {cases.data &&
                <Case title={cases.data[0].type_c} desk={cases.data[0].description} />
            }
            <br />
            {
                !cases.data && 'Данные не найдены'
            }

        </div>
    )
}
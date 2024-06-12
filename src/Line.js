import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Container, HighContainer, Loading, Popup, Line, LineLabel, LineItem, LineUl, LineContainer } from "./styles/styles";
import { supabase } from './SupaBase';
import { normalDate } from './App.js';

//import Timeline from "react-time-line";

export function MyLine() {

    const params = useParams();
    const id = params.id;

    const getTestimonyDetails = async () => {
        let { data, err } = await supabase
            .from('participants')
            .select('pa_ca_id, pa_id, people(pe_name, pe_surname), testimony (t_id, testimony_details(*))')
            .eq('pa_ca_id', id)
        let obj = {};
        data.forEach(el => {
            el.testimony.forEach(el1 => {
                if (el1.testimony_details != 0) {
                    el1.testimony_details.forEach(el2 => {
                        console.log(typeof el2.td_datetime);
                        if (obj[el2.td_datetime.slice(0, 10)] == undefined) {
                            obj[el2.td_datetime.slice(0, 10)] = [];
                        }
                        obj[el2.td_datetime.slice(0, 10)].push({ name: el.people.pe_surname + " " + el.people.pe_name, data: el2 });
                    })
                }
            })
        })
        return obj || err;
    }

    useEffect(() => {
        getTestimonyDetails()
            .then(res => {
                setEvents(res);
                setLoad(false);
            })
            .catch(err => console.log(err))
    }, [])

    const [events, setEvents] = useState({});
    const [load, setLoad] = useState(true);

    return (
        <HighContainer>
            {!load ?
                <Container fe="center" w="90vw" h="470px">
                    <Line>
                        {
                            Object.keys(events).map((el, ind) => (
                                <LineContainer key={ind}>
                                    <LineLabel>{normalDate(el)}</LineLabel>
                                    <LineUl>
                                        {
                                            events[el].map((el2, i) => (
                                                <LineItem key={i} title={el2.data.td_details}>
                                                    <p>{el2.name}</p>
                                                    <div>
                                                        <p><b>{el2.data.td_place}</b></p>
                                                        <p><b>{el2.data.td_datetime.slice(11)}</b></p>
                                                    </div>
                                                    <p>{el2.data.td_confirm ? "Подтверждено" : "Не подтверждено"}</p>
                                                </LineItem>
                                            ))
                                        }
                                    </LineUl>
                                </LineContainer>
                            ))
                        }
                    </Line>

                </Container>
                :
                <Loading>&#8987;</Loading>
            }
        </HighContainer>
    )
}

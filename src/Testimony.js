import { useAuth } from './hooks/user-auth';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './SupaBase';
import { normalDate } from './App';
import { Container, HighContainer, TextField, Title, Loading } from './styles/styles';

const getTestimony = async (idT) => {
    let { data, error } = await supabase
        .from('testimony')
        .select(`
            *,
            on_case (
                *,
                detectives (*, people (*))
            ),
            participants (*, people (*))
        `)
        .eq('t_id', idT)
    return data || error
}

export function Testimony() {
    const params = useParams();
    const id = params.id;
    const [data, setData] = useState({});
    const [load, setLoad] = useState(true);
    useEffect(() => {
        getTestimony(id).then(res => {
            setData(res[0]);
            setLoad(false);
        })
    }, []);
    return (
        useAuth().isAuth ?
            <HighContainer>
                {
                    !load ?
                    <Container behav="row" gap="10px">
                        <Container w="250px" behav="row" gap="5px">
                            <TextField type>Детали</TextField>
                            <Title>Допрашиваемый:</Title>
                            <TextField>{data.participants.people.pe_surname} {data.participants.people.pe_name} {data.participants.people.pe_patronymic || ''}</TextField>
                            <Title>Дата:</Title>
                            <TextField>{normalDate(data.t_date)}</TextField>
                            <Title>Время:</Title>
                            <TextField>{data.t_time}</TextField>
                            <Title>Детектив:</Title>
                            <TextField>{data.on_case.detectives.people.pe_surname} {data.on_case.detectives.people.pe_name} {data.on_case.detectives.people.pe_patronymic || ''}</TextField>
                        </Container> 
                        <Container w="650px" gap="5px">
                            <TextField type>Показания</TextField>
                            <TextField>{data.t_text}</TextField>
                        </Container>
                    </Container>
                    :
                    <Loading>&#8987;</Loading>
                }
            </HighContainer>
            :
            <Navigate to="/" />
    )
}
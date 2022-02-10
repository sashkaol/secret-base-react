import { useAuth } from './hooks/user-auth';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './SupaBase';
import { normalDate } from './App';
import { Container, HighContainer, TextField, Title, Loading, Input, Btn, TextArea, Popup } from './styles/styles';

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

const getStatus = async (idCa) => {
    let { data, error } = await supabase
        .from('cases')
        .select('ca_status')
        .eq('ca_id', idCa)
    return data || error
}

const updateTestimony = async (idT, obj) => {
    let { data, error } = await supabase
        .from('testimony')
        .update({
            t_time: obj.t_time,
            t_date: obj.t_date,
            t_text: obj.t_text
        })
        .eq('t_id', idT)
    return data || error
}

export function Testimony() {
    const params = useParams();
    const id = params.id;
    const [data, setData] = useState({});
    const [popup, setPopup] = useState('');
    var [status, setStatus] = useState('');
    const showPopup = (text) => {
        setPopup(text);
        setTimeout(() => {
            setPopup('')
        }, 3000)
    }
    const [newData, setNewData] = useState({
        t_date: '',
        t_time: '',
        t_text: '',
    });
    const [load, setLoad] = useState(true);
    const [corr, setCorr] = useState(1);
    useEffect(() => {
        getTestimony(id).then(res => {
            setData(res[0]);
            setNewData({
                t_date: res[0].t_date,
                t_time: res[0].t_time,
                t_text: res[0].t_text
            })
            getStatus(res[0].on_case.o_ca_id).then(res => {
                setStatus(res[0].ca_status);
                setLoad(false);
            });
        })
    }, [load]);
    return (
        useAuth().isAuth ?
            <HighContainer>
                {
                    !load ?
                        <Container behav="row" gap="10px">
                            <Container w="250px" behav="row" gap="7px">
                                <TextField type="h">Детали</TextField>
                                <Title>Допрашиваемый:</Title>
                                <TextField>{data.participants.people.pe_surname + ' ' + data.participants.people.pe_name + ' ' + (data.participants.people.pe_patronymic || '')}</TextField>
                                <Title>Дата:</Title>
                                <Input onChange={(e) => {
                                    if (new Date(e.target.value).getTime() > new Date().getTime()) {
                                        showPopup('Дата не может быть завтрашней')
                                    } else {
                                        setNewData({ ...newData, t_date: e.target.value });
                                    }
                                }} type={!corr ? 'date' : 'text'} readOnly={corr} value={!corr ? newData.t_date : normalDate(data.t_date)} />
                                <Title>Время:</Title>
                                <Input onChange={(e) => {
                                    setNewData({ ...newData, t_time: e.target.value })
                                }} type="time" readOnly={corr} value={newData.t_time} />
                                <Title>Детектив:</Title>
                                <TextField>{data.on_case.detectives.people.pe_surname} {data.on_case.detectives.people.pe_name} {data.on_case.detectives.people.pe_patronymic || ''}</TextField>
                                {
                                    status == 'open' ?
                                    <Btn w="250px" h="30px" onClick={() => setCorr(0)}>Редактировать</Btn>
                                    :
                                    <TextField>Дело закрыто, вы не можете менять показания</TextField>
                                }
                                {
                                    !corr &&
                                    <Container gap="10px">
                                        <Btn w="120px" onClick={() => {
                                            setNewData({
                                                t_date: data.t_date,
                                                t_time: data.t_time,
                                                t_text: data.t_text
                                            })
                                            setCorr(1)
                                        }}>Отменить изменения</Btn>
                                        <Btn w="120px" onClick={() => {
                                            updateTestimony(id, newData).then(res => {
                                                showPopup('Данные успешно изменены');
                                                setLoad(true)
                                            })
                                        }}>Сохранить изменения</Btn>
                                    </Container>
                                }
                            </Container>
                            <Container w="650px" gap="10px">
                                <TextField type="h">Показания</TextField>
                                <TextArea onChange={(e) => {
                                    setNewData({ ...newData, t_text: e.target.value })
                                }} size="15px" readOnly={corr} texta={!corr ? "400px" : 'max-content'} value={newData.t_text} />
                            </Container>
                            <Popup none={!popup}>{popup}</Popup>
                        </Container>
                        :
                        <Loading>&#8987;</Loading>
                }
            </HighContainer>
            :
            <Navigate to="/" />
    )
}
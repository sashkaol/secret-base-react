import { useState, useEffect } from 'react';
import { CaseBook, Overlay, Container, Loading, HighContainer, Warning, Input, Btn, Voile, TextArea, Title, Popup } from './styles/styles';
import { NavLink, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/user-auth';
import { supabase } from './SupaBase';
import { useSelector } from 'react-redux';
import { normalDate } from './App';

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

const createCase = async (obj) => {
    let { data: cases, error } = await supabase
        .from('cases')
        .insert([obj])
    return cases || error;
}

export default function AllCases() {

    const [popup, setPopup] = useState('');
    const showPopup = (text) => {
        setPopup(text);
        setTimeout(() => {
            setPopup('')
        }, 3000)
    }

    const [allCases, setAllCases] = useState([]);
    const [load, setLoad] = useState(true);
    const user = useSelector((state) => state.user);
    const [modal, setModal] = useState(false);
    const [newCase, setNewCase] = useState({
        ca_title: '',
        ca_description: '',
        ca_type: '',
        ca_date_begin: new Date().toISOString().slice(0, 10)
    })

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
    }, [load]);

    return (
        useAuth().isAuth ?
            <HighContainer>
                <Container w="315px" gap="15px" fe="center">
                    {
                        user.rights == 'admin' &&
                        <Btn h="40px" w="100%" onClick={() => {
                            setModal(true);
                        }}>Завести дело</Btn>
                    }
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
                                <p>{(el.ca_status || el.cases.ca_status) == 'open' ? 'открыто' : 'закрыто'}</p>
                                <NavLink to={`/allcases/${el.ca_id || el.cases.ca_id}`}><Overlay /></NavLink>
                            </CaseBook>
                        ))
                    }
                    {modal && <Voile />}
                    {
                        modal &&
                        <Warning>
                            <Container gap="7px">
                                <Title light>Название</Title>
                                <Input placeholder="Убийство в восточном экспрессе" value={newCase.ca_title} onChange={(e) => {
                                    setNewCase({ ...newCase, ca_title: e.target.value })
                                }} />
                                <Title light>Краткое описание</Title>
                                <TextArea texta="100px" placeholder="Описание" value={newCase.ca_description} onChange={(e) => {
                                    setNewCase({ ...newCase, ca_description: e.target.value })
                                }} />
                                <Title light>Тип (покушение, кража, убийство, и т.д.)</Title>
                                <Input placeholder="Убийство" value={newCase.ca_type} onChange={(e) => {
                                    setNewCase({ ...newCase, ca_type: e.target.value })
                                }} />
                                <Title light>Статус</Title>
                                <Input value={'Открыто'} readOnly />
                                <Title light>Дата открытия</Title>
                                <Input readOnly value={normalDate(newCase.ca_date_begin)} />
                                <Container w="100%" gap="20px" fe="center">
                                    <Btn h="40px" size="15px" w="45%" onClick={() => {
                                        if (newCase.ca_title == '' || newCase.ca_type == '' || newCase.ca_description == '') {
                                            showPopup('Заполните все поля')
                                        } else {
                                            createCase(newCase).then(res => {
                                                showPopup("Дело успешно создано");
                                                setModal(false);
                                                setNewCase({
                                                    ca_title: '',
                                                    ca_description: '',
                                                    ca_type: '',
                                                    ca_date_begin: new Date().toISOString().slice(0, 10)
                                                });
                                                setLoad(true);
                                            })
                                        }
                                    }}>Открыть дело</Btn>
                                    <Btn h="40px" size="15px" w="45%" onClick={() => {
                                        setNewCase({
                                            ca_title: '',
                                            ca_description: '',
                                            ca_type: '',
                                            ca_date_begin: new Date().toISOString().slice(0, 10)
                                        });
                                        setModal(false);
                                    }}>Отменить создание</Btn>
                                </Container>
                            </Container>
                        </Warning>
                    }
                    <Popup none={!popup}>{popup}</Popup>
                </Container>
            </HighContainer>
            :
            <Navigate to='/' replace />
    )
}
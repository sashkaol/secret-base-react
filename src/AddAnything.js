import { supabase } from "./SupaBase";
import { HighContainer, Container, Btn, Input, Title, TextField, Loading } from './styles/styles';
import { useAuth } from './hooks/user-auth';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

const getPeople = async (arr) => {
    let { data, error } = await supabase
        .from('people')
        .select('*')
        .not('pe_id', 'in', arr)
    return data || error
}

const getYetParts = async (id) => {
    let { data, error } = await supabase
        .from('participants')
        .select('pa_pe_id')
        .eq('pa_ca_id', id)
    let str = '(';
    data.forEach((el, ind) => {
        if (ind == data.length - 1)
            str += el.pa_pe_id;
        else
            str += el.pa_pe_id + ',';
    })
    str += ')';
    return str || error;
}

const addParts = async (obj, caId) => {
    let arr = [];
    Object.keys(obj).forEach(el => {
        arr.push({
            pa_ca_id: caId,
            pa_pe_id: el,
            pa_type: obj[el]
        })
    })
    let { data, error } = await supabase
        .from('participants')
        .insert(arr)
    return data || error
}

export function AddParticipant() {
    const params = useParams();
    const caId = params.id;
    const [people, setPeople] = useState([]);
    const [load, setLoad] = useState(true);
    const [selected, setSelected] = useState({});

    useEffect(() => {
        getYetParts(caId).then(res => {
            getPeople(res).then(res => {
                setPeople(res);
                setLoad(false);
            })
        })
    }, []);

    return (
        useAuth().isAuth ?
            <HighContainer>
                {
                    !load ?
                        <Container gap="10px" behav="column">
                            <Container behav="column" gap="10px">
                                {
                                    people.map(el => (
                                        <Container key={el.pe_id} gap="10px">
                                            <TextField w="450px">{el.pe_surname} {el.pe_name} {el.pe_patronymic || ''}</TextField>
                                            <Btn selected={selected[el.pe_id] == 'Свидетель'} value='Свидетель' size="15px" w="130px" h="40px" onClick={(e) => {
                                                setSelected({ ...selected, [el.pe_id]: e.target.value })
                                            }}>Свидетель</Btn>
                                            <Btn selected={selected[el.pe_id] == 'Пострадавший'} value='Пострадавший' size="15px" w="130px" h="40px" onClick={(e) => {
                                                setSelected({ ...selected, [el.pe_id]: e.target.value })
                                            }}>Пострадавший</Btn>
                                            <Btn selected={selected[el.pe_id] == 'Подозреваемый'} value='Подозреваемый' size="15px" w="130px" h="40px" onClick={(e) => {
                                                setSelected({ ...selected, [el.pe_id]: e.target.value })
                                            }}>Подозреваемый</Btn>
                                        </Container>
                                    ))
                                }
                            </Container>
                            <Container gap="10px">
                                <Btn size="15px" w="220px" h="40px" onClick={() => {
                                    addParts(selected, caId).then(res => setSelected({}))
                                }}>Добавить в дело №{caId}</Btn>
                                <Btn size="15px" w="220px" h="40px" onClick={() => {
                                    setSelected({});
                                }}>Очистить</Btn>
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

const insertProof = async (obj) => {
    let { data, error } = await supabase
        .from('proof')
        .insert([obj])
    return data || error
}

export function AddProof() {
    const params = useParams();
    const caId = params.id;
    const [proof, setProof] = useState({
        pr_title: '',
        pr_description: '',
        pr_owner_id: '',
        pr_ca_id: +caId
    });
    const [owner, setOwner] = useState('');
    const [people, setPeople] = useState([]);
    const [load, setLoad] = useState(true);
    const [selected, setSelected] = useState('');

    useEffect(() => {
        getPeople('(0)').then(res => {
            setPeople(res);
            console.log(res);
            setLoad(false);
        });
    }, []);

    return (
        useAuth().isAuth ?
            <HighContainer>
                {
                    !load ?
                        <Container w="400px" gap="7px">
                            <Title>Название</Title>
                            <Input type="text" placeholder="Улика" onChange={(e) => {
                                setProof({ ...proof, pr_title: e.target.value })
                            }} />
                            <Title>Описание</Title>
                            <Input type="text" placeholder="Улика уликовая" onChange={(e) => {
                                setProof({ ...proof, pr_description: e.target.value })
                            }} />
                            <Title>Владелец (выберите из списка ниже)</Title>
                            <Input readOnly value={owner} type="text" placeholder="Владельцев Владелец Владельцевич" />
                            <Container w="100%" at="center" behav="column" gap="10px">
                                {
                                    people ?
                                        people.map(el => (
                                            <Btn w="100%" h="30px" key={el.pe_id} selected={selected == el.pe_id} onClick={() => {
                                                setSelected(el.pe_id);
                                                setOwner(el.pe_surname + ' ' + el.pe_name + ' ' + el.pe_patronymic || '');
                                                setProof({ ...proof, pr_owner_id: el.pe_id })
                                            }}>{el.pe_surname} {el.pe_name} {el.pe_patronymic || ''}</Btn>
                                        ))
                                        :
                                        <TextField>Нет данных</TextField>
                                }
                            </Container>
                            <Btn w="400px" h="40px" onClick={() => {
                                insertProof(proof);
                                setProof({
                                    pr_title: '',
                                    pr_description: '',
                                    pr_owner_id: '',
                                    pr_ca_id: +caId
                                })
                                setOwner('');
                            }}>Добавить</Btn>
                        </Container>
                        :
                        <Loading>&#8987;</Loading>
                }
            </HighContainer>
            :
            <Navigate to="/" />
    )
}

const getDets = async (arr) => {
    let { data, error } = await supabase
        .from('detectives')
        .select('*, people(*)')
        .not('d_id', 'in', arr)
        .neq('d_grade', 'kapitan')
    return data || error
}

const addDets = async (arr, caId) => {
    let obj = []
    arr.forEach(el => {
        obj.push({
            o_ca_id: +caId,
            o_d_id: el
        })
    })
    let { data, error } = await supabase
        .from('on_case')
        .insert(obj);
    return data || error
}

const getYetDets = async (id) => {
    let { data, error } = await supabase
        .from('on_case')
        .select('o_d_id')
        .eq('o_ca_id', id)
    let str = '(';
    data.forEach((el, ind) => {
        if (ind == data.length - 1)
            str += el.o_d_id;
        else
            str += el.o_d_id + ',';
    })
    str += ')';
    return str || error;
}

export function AddDetective() {
    const params = useParams();
    const caId = params.id;
    const [dets, setDets] = useState([]);
    const [load, setLoad] = useState(true);
    const [selected, setSelected] = useState(['']);

    useEffect(() => {
        getYetDets(caId).then(res =>
            getDets(res).then(res => {
                setDets(res);
                setLoad(false);
            }));
    }, [load]);

    return (
        useAuth().isAuth ?
            <HighContainer>
                {
                    !load ?
                        <Container gap="10px" behav="column">
                            {
                                dets && dets != 0 ?
                                    <Container behav="column" gap="10px">
                                        {dets.map(el => (
                                            <Btn selected={selected.includes(el.d_id)} key={el.d_id} w="500px" h="40px" onClick={() => {
                                                setSelected([...selected, el.d_id]);
                                            }}>{el.people.pe_surname} {el.people.pe_name} {el.people.pe_patronymic || ''}</Btn>
                                        ))}
                                        <Container gap="10px">
                                            <Btn size="15px" w="245px" h="40px" onClick={() => {
                                                addDets(selected.slice(1), caId).then(res => {
                                                    setSelected(['']);
                                                    setLoad(true);
                                                })
                                            }}>Назначить на дело №{caId}</Btn>
                                            <Btn size="15px" w="245px" h="40px" onClick={() => {
                                                setSelected(['']);
                                            }}>Очистить</Btn>
                                        </Container>
                                    </Container>
                                    :
                                    <TextField>Поставить на дело больше некого</TextField>
                            }
                        </Container>
                        :
                        <Loading>&#8987;</Loading>
                }
            </HighContainer>
            :
            <Navigate to="/" />
    )
}
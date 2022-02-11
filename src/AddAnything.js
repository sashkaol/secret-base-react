import { supabase } from "./SupaBase";
import { HighContainer, Container, Btn, Input, Title, TextField, Loading, Popup, TextArea } from './styles/styles';
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
    const [popup, setPopup] = useState('');

    useEffect(() => {
        getYetParts(caId).then(res => {
            getPeople(res).then(res => {
                setPeople(res);
                setLoad(false);
            })
        })
    }, [load]);

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
                                    addParts(selected, caId).then(res => {
                                        setSelected({});
                                        setLoad(true);
                                    })
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

const updateProof = async (obj, idPr) => {
    let { data, error } = await supabase
        .from('proof')
        .update([obj])
        .eq('pr_id', idPr)
    return data || error
}

const selectProof = async (id, idPr) => {
    let { data, error } = await supabase
        .from('proof')
        .select('*, people (*)')
        .eq('pr_ca_id', id)
        .eq('pr_id', idPr)
    return data || error
}

export function AddProof() {
    const params = useParams();
    const caId = params.id;
    const corr = params.red;
    const idPr = params.idPr;
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
    const [prId, setPrId] = useState('');
    const [popup, setPopup] = useState('');

    useEffect(() => {
        getPeople('(0)').then(res => {
            setPeople(res);
            if (corr == 1) {
                selectProof(+caId, idPr).then(res => {
                    setProof({
                        pr_title: res[0].pr_title,
                        pr_description: res[0].pr_description,
                        pr_owner_id: res[0].pr_owner_id,
                        pr_ca_id: +caId
                    })
                    setPrId(+res[0].pr_id);
                    let patr = res[0].people.pe_patronymic == null ? '' : res[0].people.pe_patronymic;
                    setOwner(res[0].people.pe_surname + ' ' + res[0].people.pe_name + ' ' + patr);
                    setSelected(res[0].people.pe_id)
                    setLoad(false);
                })
            } else {
                setLoad(false);
            }
        });
    }, []);

    return (
        useAuth().isAuth ?
            <HighContainer>
                {
                    !load ?
                        <Container w="400px" gap="7px">
                            <Title>Название</Title>
                            <Input value={proof.pr_title} type="text" placeholder="Улика" onChange={(e) => {
                                setProof({ ...proof, pr_title: e.target.value })
                            }} />
                            <Title>Описание</Title>
                            <Input value={proof.pr_description} type="text" placeholder="Улика уликовая" onChange={(e) => {
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
                                                setOwner(el.pe_surname + ' ' + el.pe_name + ' ' + (el.pe_patronymic == null ? '' : el.pe_patronymic));
                                                setProof({ ...proof, pr_owner_id: el.pe_id })
                                            }}>{el.pe_surname} {el.pe_name} {el.pe_patronymic || ''}</Btn>
                                        ))
                                        :
                                        <TextField>Нет данных</TextField>
                                }
                            </Container>
                            <Btn w="400px" h="40px" onClick={() => {
                                if (corr == 1) {
                                    updateProof(proof, prId).then(res => {
                                        setPopup('Данные изменены');
                                        setTimeout(() => {
                                            setPopup('')
                                        }, 3000)
                                    });
                                } else {
                                    insertProof(proof);
                                    setProof({
                                        pr_title: '',
                                        pr_description: '',
                                        pr_owner_id: '',
                                        pr_ca_id: +caId
                                    })
                                    setOwner('');
                                }
                            }}>{corr == 1 ? 'Обновить' : 'Добавить'}</Btn>
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

const getOnCaseDets = async (caId) => {
    let { data, error } = await supabase
        .from('on_case')
        .select('*, detectives (*, people(*))')
        .eq('o_ca_id', caId);
    return data || error
}

const insertTestimony = async (obj) => {
    let {data, error} = await supabase
        .from('testimony')
        .insert([obj])
    return data || error
}

export function AddTestimony() {
    const params = useParams();
    const paId = params.idPa;
    const caId = params.id;
    const [dets, setDets] = useState([]);
    const [load, setLoad] = useState(true);
    const [detName, setDetName] = useState('');
    const [selected, setSelected] = useState('');
    const [testimony, setTestimony] = useState({
        t_date: '',
        t_time: '',
        t_text: '',
        t_o_id: '',
        t_pa_id: +paId
    });
    const [popup, setPopup] = useState('');
    const showPopup = (text) => {
        setPopup(text);
        setTimeout(() => {
            setPopup('')
        }, 3000)
    }

    useEffect(() => {
        getOnCaseDets(caId).then(res => {
            console.log(res);
            setDets(res);
            setLoad(false)
        })
    }, []);

    return (
        useAuth().isAuth ?
            <HighContainer>
                {
                    !load ?
                        <Container gap="20px">
                            <Container w="400px" gap="7px">
                                <Title>Дата</Title>
                                <Input value={testimony.t_date} type="date" onChange={(e) => {
                                    setTestimony({ ...testimony, t_date: e.target.value })
                                }} />
                                <Title>Время</Title>
                                <Input value={testimony.t_time} type="time" onChange={(e) => {
                                    setTestimony({ ...testimony, t_time: e.target.value })
                                }} />
                                <Title>Детектив, который вел допрос</Title>
                                <Input value={detName} readOnly type="text" placeholder="Владельцев Владелец Владельцевич" />
                                <Container w="100%" at="center" behav="column" gap="10px">
                                    {
                                        dets ?
                                            dets.map(el => (
                                                <Btn w="100%" h="30px" key={el.o_id} selected={selected == el.o_id} onClick={() => {
                                                    setSelected(el.o_id);
                                                    setDetName(el.detectives.people.pe_surname + ' ' + el.detectives.people.pe_name + ' ' + (el.detectives.people.pe_patronymic || ''));
                                                    setTestimony({ ...testimony, t_o_id: el.o_id })
                                                }}>{el.detectives.people.pe_surname} {el.detectives.people.pe_name} {el.detectives.people.pe_patronymic || ''}</Btn>
                                            ))
                                            :
                                            <TextField>Нет данных</TextField>
                                    }
                                </Container>
                            </Container>
                            <Container w="400px" gap="7px" fe="flex-end">
                                <Title>Показания</Title>
                                <TextArea value={testimony.t_text} placeholder="Текс......." onChange={(e) => {
                                    setTestimony({ ...testimony, t_text: e.target.value })
                                }} size="15px" texta="400px" />
                                <Btn w="200px" h="40px" onClick={() => {
                                    if (testimony.t_date == '' || testimony.t_time == '' || testimony.t_text == '' || testimony.t_o_id == '') {
                                        showPopup('Заполните все поля');
                                    } else {
                                        insertTestimony(testimony).then(() => {
                                            setTestimony({
                                                t_date: '',
                                                t_time: '',
                                                t_text: '',
                                                t_o_id: '',
                                                t_pa_id: +paId
                                            });
                                            setSelected('');
                                            setDetName('');
                                            showPopup('Показания успешно добавлены')
                                        });
                                    }
                                }}>Добавить</Btn>
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
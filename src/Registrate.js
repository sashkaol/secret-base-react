import { useState, useEffect } from 'react';
import { Input, Btn, Container, Title, Loading } from './styles/styles';
import { supabase } from './SupaBase';

var sha512 = require('js-sha512').sha512;

const reg = async (login, password, email, tel, grade, peId, rights) => {
    const { data, error } = await supabase
        .from('detectives')
        .insert([
            {
                d_login: login, d_password: password, d_email: email, d_tel: tel,
                d_grade: grade, d_pe_id: peId, d_rights: rights
            },
        ])
    return data || error;
}

const getPeople = async (dets) => {
    let { data: people, error } = await supabase
        .from('people')
        .select('pe_id, pe_name, pe_surname')
        .not('pe_id', 'in', dets)
    return people || error;
}

const getDets = async () => {
    let { data: detectives, error } = await supabase
        .from('detectives')
        .select('d_pe_id')
    console.log(detectives);
    let detRes = '(';
    detectives.forEach((el, ind) => {
        detRes += el['d_pe_id'];
        if (ind != detectives.length - 1) detRes += ',';
    })
    detRes += ')';
    return detRes || error;
}

export function Registration() {

    const [passw, setPassw] = useState('');
    const [conf, setConf] = useState('');
    const [login, setLogin] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');
    const [grade, setGrade] = useState('');
    const [rights, setRights] = useState('');
    const [peId, setPeId] = useState('');
    const [load, setLoad] = useState(true);
    const [selected, setSelected] = useState({
        first: false,
        sec: true
    });
    const [selectPeople, setSelectPeople] = useState('');
    const [people, setPeople] = useState([]);

    useEffect(() => {
        getDets().then(res => {
            getPeople(res).then(res => {
                setPeople(res);
                setLoad(false);
            })
        });
    }, []);

    const registrate = () => {
        if (sha512(passw) === sha512(conf)) {
            reg(login, sha512(passw), email, tel, grade, peId, rights).then(res => console.log(res));
        }
    }

    return (
        <Container h="max-content" behav="row" gap="50px">
            <Container padd="false" w="250px" gap="10px" behav="column" h="initial" overf="scroll">
                <Title>Выберите, кого вы хотите зарегистрировать</Title>
                {
                    !load ?
                        people.map(el => (
                            <Btn selected={selectPeople == el.pe_id} size="15px" h="40px" key={el.pe_id} id={el.pe_id} onClick={() => {
                                setPeId(el.pe_id);
                                setSelectPeople(el.pe_id);
                            }}>{el.pe_surname} {el.pe_name}</Btn>
                        ))
                        :
                        <Container fe="center">
                            <Loading>&#8987;</Loading>
                        </Container>
                }
            </Container>
            <Container w="250px" gap="20px" behav="column">
                <Input placeholder="KBecks" type="text" onChange={(e) => {
                    setLogin(e.target.value);
                }} />
                <Input placeholder="89612704567" type="tel" onChange={(e) => {
                    setTel(e.target.value);
                }} />
                <Input placeholder="KBecks@gmail.com" type="email" onChange={(e) => {
                    setEmail(e.target.value);
                }} />
                <Input placeholder="detective" type="text" onChange={(e) => {
                    setGrade(e.target.value);
                }} />
                <Input placeholder="your password" type="password" onChange={(e) => {
                    setPassw(e.target.value);
                }} />
                <Input placeholder="your password" type="password" onChange={(e) => {
                    setConf(e.target.value);
                }} />
                <Container w="250px" gap="10px" behav="row">
                    <Btn selected={selected.first} w="120px" h="40px" size="15px" onClick={() => {
                        setRights('admin');
                        setSelected({ first: true, sec: false });
                    }}>Администратор</Btn>
                    <Btn selected={selected.sec} w="120px" h="40px" size="15px" onClick={() => {
                        setRights('user');
                        setSelected({ first: false, sec: true });
                    }}>Пользователь</Btn>
                </Container>
                <Btn w="250px" h="40px" size="15px" onClick={registrate}>Зарегистрировать</Btn>
            </Container>
        </Container>
    )
}
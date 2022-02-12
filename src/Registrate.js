import { useState, useEffect } from 'react';
import { Input, Btn, Container, Title, Loading, HighContainer, Popup, Error } from './styles/styles';
import { supabase } from './SupaBase';
import { useAuth } from './hooks/user-auth';
import { Navigate } from 'react-router-dom';

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

const checkLogin = async (login) => {
    let { data, error } = await supabase
        .from('detectives')
        .select('d_id')
        .eq('d_login', login)
    return data || error
}

export function Registration() {

    const [passw, setPassw] = useState('');
    const [conf, setConf] = useState('');
    const [login, setLogin] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');
    const [grade, setGrade] = useState('');
    const [rights, setRights] = useState('user');
    const [peId, setPeId] = useState('');
    const [load, setLoad] = useState(true);
    const [selected, setSelected] = useState({
        first: false,
        sec: true
    });
    const [selectPeople, setSelectPeople] = useState('');
    const [people, setPeople] = useState([]);
    const [popup, setPopup] = useState('');
    const [loadReg, setLoadReg] = useState(false);
    // errors
    const [erLogin, setErLogin] = useState('');
    const [erTel, setErTel] = useState('');
    const [erMail, setErMail] = useState('');
    const [erGrade, setErGrade] = useState('');
    const [erPassw, setErPassw] = useState('');
    const [erConf, setErConf] = useState('');
    const [erEmpty, setErEmpty] = useState('');
    const [erPeople, setErPeople] = useState('');

    useEffect(() => {
        getDets().then(res => {
            getPeople(res).then(res => {
                setPeople(res);
                setLoad(false);
            })
        });
    }, [load]);

    const showPopup = (text) => {
        setPopup(text);
        setTimeout(() => {
            setPopup('')
        }, 3000)
    }

    const registrate = () => {
        setErLogin(''); setErLogin(''); setErPassw(''); setErTel(''); setErGrade(''); setErConf(''); setErMail(''); setErEmpty('');
        setLoadReg(true);
        checkLogin(login).then(res => {
            if (login == '' || email == '' || tel == '' || grade == '' || passw == '' || conf == '') {
                setErEmpty('Все поля должны быть заполнены');
                return 1
            }
            if (res != 0) {
                setErLogin('Пользователь с таким логином уже существует');
                return 1
            }
            if (!(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\.){6,}/g.test(passw))) {
                setErPassw('Пароль недостаточно надежен, он должен быть длиннее 6 символов содержать: заглавные и строчные латинские буквы, цифры, точки и спецсимволы')
                return 1
            }
            if (!( /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email))) {
                setErMail('Электронная почта должна содержать "@" и быть похожей на адрес электронной почты')
                return 1
            }
            if (sha512(passw) != sha512(conf)) {
                setErConf('Пароли не одинаковые')
                return 1
            }
            let grades = ['detective', 'kapitan']
            if (!(grades.includes(grade))) {
                setErGrade('Звания могут быть только: detective, kapitan')
                return 1
            }
            if (!(/^(\+7|7|8)[0-9]{10}$/.test(tel))) {
                setErTel('Телефон не соответствует формату 80000000000 или +70000000000')
                return 1
            }
            if (selectPeople == '') {
                setErPassw('Вы не выбрали человека')
                return 1
            }
            if (selected.first == true && grade != 'kapitan') {
                setErGrade('Администратором может быть ТОЛЬКО капитан участка')
                return 1
            }
            return 0
        }).then((res) => {
            setLoadReg(false);
            if (res == 0) {
                showPopup('Вы успешно зарегистрировали нового пользователя, надеемся, от раскроет много дел!');
                reg(login, sha512(passw), email, tel, grade, peId, rights).then(() => {
                    setLoad(true);
                    setLogin(''); setPassw(''); setRights(''); setTel(''); setSelected({ first: false, sec: true }); setGrade('');
                    setConf(''); setEmail('');
                });
            } else {
                showPopup('Перепроверьте данные')
            }
        })
    }

    return (
        useAuth().isAuth ?
            <HighContainer>
                <Container h="max-content" gap="50px">
                    <Container w="250px" padd="5px" gap="10px" behav="column" h="initial" overf="scroll">
                        <Title>Выберите, кого вы хотите зарегистрировать</Title>
                        {
                            !load ?
                                people.map(el => (
                                    <Btn selected={selectPeople == el.pe_id} w="100%" size="15px" h="40px" key={el.pe_id} id={el.pe_id} onClick={() => {
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
                        <Btn disabled={loadReg} w="250px" h="40px" size="15px" onClick={registrate}>
                            {
                                !loadReg ?
                                    'Зарегистрировать'
                                    :
                                    <Container fe="center">
                                        <Loading>&#8987;</Loading>
                                    </Container>
                            }
                        </Btn>
                    </Container>
                    <Container w="250px" gap="20px" behav="column">
                        {erLogin && <Error>{erLogin}</Error>}
                        {erTel && <Error>{erTel}</Error>}
                        {erMail && <Error>{erMail}</Error>}
                        {erGrade && <Error>{erGrade}</Error>}
                        {erPassw && <Error>{erPassw}</Error>}
                        {erConf && <Error>{erConf}</Error>}
                        {erPeople && <Error>{erPeople}</Error>}
                        {erEmpty && <Error>{erEmpty}</Error>}
                    </Container>
                </Container>
                <Popup none={!popup}>{popup}</Popup>
            </HighContainer>
            :
            <Navigate to="/" />
    )
}
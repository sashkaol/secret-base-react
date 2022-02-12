import { supabase } from './SupaBase';
import { normalDate } from './App';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from './hooks/user-auth';
import { Container, Loading, Input, Btn, TextField, Title, HighContainer } from './styles/styles';
import { Navigate, NavLink, useParams } from 'react-router-dom';

const getUser = async (id) => {
    let { data: detective, error } = await supabase
        .from('detectives')
        .select('*, people (*)')
        .eq('d_id', id)
    return detective || error;
}

const editData = async (id, obj) => {
    const { data, error } = await supabase
        .from('detectives')
        .update({
            d_login: obj.d_login,
            d_email: obj.d_email,
            d_grade: obj.d_grade,
            d_rights: obj.d_rights,
            d_tel: obj.d_tel
        })
        .match({ d_id: id })
    return data || error;
}

export function Profile() {
    const params = useParams();
    const idP = params.id;
    const user = useSelector((state) => state.user);
    const [load, setLoad] = useState(true);
    const [info, setInfo] = useState({});
    const [edit, setEdit] = useState(false);
    const [editInfo, setEditInfo] = useState({});

    useEffect(() => {
        getUser(idP).then(res => {
            setInfo(res[0]);
            setEditInfo({
                d_login: res[0].d_login,
                d_email: res[0].d_email,
                d_tel: res[0].d_tel,
                d_grade: res[0].d_grade,
                d_rights: res[0].d_rights
            })
            setLoad(false);
        });
    }, [load]);

    return (
        useAuth().isAuth ?
            <HighContainer>
                <Container gap="20px">
                    {
                        load ?
                            <Loading>&#8987;</Loading>
                            :
                            <Container gap="10px">
                                <Container w="250px" gap="5px">
                                    <TextField type="h">Данные профиля</TextField>
                                    <Title>Логин</Title>
                                    <Input readOnly={!edit} value={!edit ? info.d_login : editInfo.d_login} onChange={(e) => {
                                        setEditInfo({ ...editInfo, d_login: e.target.value });
                                    }} />
                                    <Title>Электронная почта</Title>
                                    <Input readOnly={!edit} value={!edit ? info.d_email : editInfo.d_email} onChange={(e) => {
                                        setEditInfo({ ...editInfo, d_email: e.target.value });
                                    }} />
                                    <Title>Телефон</Title>
                                    <Input readOnly={!edit} value={!edit ? info.d_tel : editInfo.d_tel} onChange={(e) => {
                                        setEditInfo({ ...editInfo, d_tel: e.target.value });
                                    }} />
                                    <Title>Звание</Title>
                                    <Input readOnly value={info.d_grade} />
                                    <Title>Права</Title>
                                    <Input readOnly={user.rights == 'admin' ? !edit : true} value={!edit ? info.d_rights : editInfo.d_rights} onChange={(e) => {
                                        setEditInfo({ ...editInfo, d_rights: e.target.value });
                                    }} />
                                    <Btn disabled={info.d_status != 'working'} size="15px" w="250px" h="40px" onClick={() => {
                                        setEdit(true);
                                    }}>Редактировать</Btn>
                                </Container>
                                <Container w="250px" gap="5px">
                                    <TextField type="h">Контактная информация</TextField>
                                    <Title>Полное имя</Title>
                                    <TextField>{info.people.pe_surname} {info.people.pe_name} {info.people.pe_patronymic}</TextField>
                                    <Title>Дата рождения</Title>
                                    <TextField h="40px">{normalDate(info.people.pe_date_birth)}</TextField>
                                    {
                                        info.people.pe_date_end &&
                                        <Container>
                                            <Title>Дата смерти</Title>
                                            <TextField h="40px">{normalDate(info.people.pe_date_end)}</TextField>
                                        </Container>
                                    }
                                    <Title>Адрес</Title>
                                    <TextField>{info.people.pe_address}</TextField>
                                </Container>
                                <Container behav="column" gap="10px">
                                    <NavLink to={`/search/${info.people.pe_id}`}>
                                        <Btn w="250px" h="40px" size="15px">Все данные</Btn>
                                    </NavLink>
                                    {edit &&
                                        <Container gap="10px">
                                            <Btn w="120px" h="40px" onClick={() => {
                                                setEdit(false);
                                                setEditInfo(info);
                                            }}>Отменить изменения</Btn>
                                            <Btn type="submit" w="120px" h="40px" onClick={() => {
                                                setEdit(false);
                                                editData(idP, editInfo);
                                                setLoad(true);
                                            }}>Сохранить изменения</Btn>
                                        </Container>
                                    }
                                </Container>
                            </Container>
                    }
                </Container>
            </HighContainer >
            :
            <Navigate to='/' />
    )
}
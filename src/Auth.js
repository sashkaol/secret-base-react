import { Input, Btn, Container, Error, Loading } from './styles/styles';
import { supabase } from './SupaBase';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/slices/userSlice';
import { useAuth } from './hooks/user-auth';
import { Navigate } from 'react-router-dom';

var sha512 = require('js-sha512').sha512;

const checkLogin = async (login) => {
    let { data: detectives, error } = await supabase
        .from('detectives')
        .select('d_id')
        .eq('d_login', login)
    return detectives || error;
}

const auth = async (id, passw) => {
    let { data: detectives, error } = await supabase
        .from('detectives')
        .select('*')
        .match({ d_id: id, d_password: passw })
    return detectives || error;
}

export function Authorization() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [load, setLoad] = useState(false);

    const [author, setAuthor] = useState(false);

    const logIn = () => {
        let login = document.querySelector('#alogin').value;
        setLoad(true);
        setError('');
        checkLogin(login)
            .then(res => {
                let pas = document.querySelector('#apassw').value;
                auth(res[0].d_id, sha512(pas))
                    .then(res => {
                        if (res != 0) {
                            setAuthor(res[0].d_login);
                            dispatch(setUser({ login: res[0].d_login, id: res[0].d_id, rights: res[0].d_rights }));
                        } else {
                            setError('Неверный логин или пароль');
                        }
                        setLoad(false);
                    })
            })
            .catch(err => {
                setError('Неверный логин или пароль');
                setLoad(false);
            })
    }

    return (
        <Container h="250px" behav="column" w="250px" gap="20px">
            {
                useAuth().isAuth ?
                    user.rights == 'admin' ?
                        <Navigate to='/menu' replace /> : <Navigate to='/allcases' replace />
                    :
                    <Container behav="column" w="250px" gap="20px">
                        <Input id="alogin" placeholder="your login" type="text" />
                        <Input id="apassw" placeholder="your password" type="password" />
                        <Btn disabled={load} w="250px" h="40px" size="18px" onClick={logIn}>
                            {
                                load ? <div>Идет загрузка... <Loading>&#8987;</Loading></div> : 'Войти'
                            }
                        </Btn>
                    </Container>
            }
            {
                error &&
                <Error>{error}</Error>
            }
        </Container>
    )
}
import { Link } from "react-router-dom";
import { Btn, Container } from './styles/styles';
import { useDispatch } from 'react-redux';
import { removeUser } from './store/slices/userSlice';
import { useAuth } from './hooks/user-auth';
import { Navigate } from 'react-router-dom';

export function Menu() {
    const dispatch = useDispatch();
    return (
        <div>
            {
                useAuth().isAuth ?
                    <Container w="250px" behav="column" gap="10px">
                        <Link to="/reg"><Btn size="15px" w="100%" h="40px">Зарегистрировать детектива</Btn></Link>
                        <Link to="/allcases"><Btn size="15px" w="100%" h="40px">Дела</Btn></Link>
                        <Btn size="15px" w="100%" h="40px" onClick={() => {
                            dispatch(removeUser());
                        }}>Выйти из системы</Btn>
                    </Container>
                    :
                    <Navigate to="/" replace />
            }
        </div>
    )
}
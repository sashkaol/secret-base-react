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
                        <Btn w="100%" h="40px"><Link to="/reg">Зарегистрировать детектива</Link></Btn>
                        <Btn w="100%" h="40px"><Link to="/allcases">Дела</Link></Btn>
                        <Btn size="15px" w="100%" h="40px" onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('id');
                            dispatch(removeUser());
                        }}>Выйти из системы</Btn>
                    </Container>
                    :
                    <Navigate to="/" replace />
            }
        </div>
    )
}
import { Link } from "react-router-dom";
import { Btn, Container } from './styles/styles';
import { useAuth } from './hooks/user-auth';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function Menu() {
    const user = useSelector((state) => state.user);
    return (
        <div>
            {
                useAuth().isAuth ?
                    <Container w="250px" behav="column" gap="10px">
                        {
                            user.rights == 'admin' &&
                            <Link to="/reg"><Btn size="15px" w="100%" h="40px">Зарегистрировать детектива</Btn></Link>
                        }
                        <Link to="/allcases"><Btn size="15px" w="100%" h="40px">Дела</Btn></Link>
                        <Link to="/search"><Btn size="15px" w="100%" h="40px">База данных</Btn></Link>
                    </Container>
                    :
                    <Navigate to="/" replace />
            }
        </div>
    )
}
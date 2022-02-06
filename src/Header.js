import { Btn, Container } from "./styles/styles";
import { useDispatch } from 'react-redux';
import { removeUser } from './store/slices/userSlice';
import { Link } from "react-router-dom";

export function Header() {
    const dispatch = useDispatch();
    return (
        <Container gap="20px" behav="row">
            <Link to="/menu"><Btn w="100px" h="30px">Меню</Btn></Link>
            <Link to="/profile"><Btn w="100px" h="30px">Профиль</Btn></Link>
            <Btn w="100px" h="30px" onClick={() => {
                dispatch(removeUser());
            }}>Выйти</Btn>
        </Container>
    )
}
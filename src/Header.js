import { Btn, Container, HeaderBtn } from "./styles/styles";
import { useDispatch } from 'react-redux';
import { removeUser } from './store/slices/userSlice';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

export function Header() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    return (
        <HeaderBtn>
            <Link to="/menu"><Btn w="100px" h="30px">Меню</Btn></Link>
            <Link to={`/profile/${user.id}`}><Btn w="100px" h="30px">Профиль</Btn></Link>
            <Btn w="100px" h="30px" onClick={() => {
                dispatch(removeUser());
            }}>Выйти</Btn>
        </HeaderBtn>
    )
}
import { useSelector } from 'react-redux';

export function useAuth() {
    const {login, token, id} = useSelector(state => state.user);

    return {
        isAuth: !!login,
        login,
        token,
        id
    }
}
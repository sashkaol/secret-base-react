import { useParams } from 'react-router-dom';


export function Card() {
    const params = useParams();
    const id = params.id;
    return (
        <h1>{id}</h1>
    )
}
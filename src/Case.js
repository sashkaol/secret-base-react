import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './SupaBase';
import { Btn, Container, TextField } from './styles/styles'

const getDataCase = async (param) => {
    const { data, error } = await supabase
        .from('cases')
        .select(`
            *, 
            proof (
                *,
                people (*)
            )
        `)
        .eq('ca_id', param)
    return data || error
}

export function Case() {
    const params = useParams();
    const id = params.id;
    const [info, setInfo] = useState('');

    useEffect(() => {
        getDataCase(id).then(res => {
            setInfo(res[0])
        });
    }, []);

    return (
        <Container w="75%" behav="row" gap="20px">
            <Container w="300px" behav="column" gap="10px">
                <TextField type="h"><h2>Дeло №{info.ca_id}, {info.ca_title}</h2></TextField>
                <TextField><b>Описание:</b> {info.ca_description}</TextField>
                <TextField><b>Тип:</b> {info.ca_type}</TextField>
                <TextField><b>Открыто:</b> {info.ca_date_begin}</TextField>
                <TextField><b>Статус:</b> {info.ca_status == 'open' ? 'открыто' : 'закрыто'}</TextField>
            </Container>
            <Container w="300px" behav="column" gap="10px">
                <TextField type="h"><h3>Доказательства:</h3></TextField>
                {info.proof && info.proof[0].people &&
                    info.proof.map((el) => (
                        <TextField key={el.pr_id}>
                            <p><b>Название:</b> {el.pr_title}</p>
                            <p><b>Описание:</b> {el.pr_description}</p>
                            <p><b>Владелец:</b>{el.people.pe_surname} {el.people.pe_name} {el.people.pe_patronymic}</p>
                        </TextField>
                    ))
                }
            </Container>
        </Container>
    )
}
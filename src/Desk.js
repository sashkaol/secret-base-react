import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './SupaBase';
import { Btn, Container, TextField, Title, Loading, HighContainer, Popup, Warning, Voile, StyleNote, Relative } from './styles/styles';

function Image(props) {
    const src = props.src;
    const hint = props.hint;

    return (
        <img src={src} alt={hint} title={hint} />
    )
}

function Note(props) {
    const text = props.text;
    const x = props.x;
    const y = props.y;
    const rotate = props.rotate;

    return (
        <StyleNote x={x} y={y} rotate={rotate}>
            {text}
        </StyleNote>
    )
}

export function Desk() {

    const params = useParams();
    const id = params.id;

    const getContent = async (id) => {
        let { data, err } = await supabase
            .from('desk_content')
            .select('*, desk (*)')
            .eq('desk.de_ca_id', id)
        return data || err
    }

    const [images, setImages] = useState(['']);
    const [notes, setNotes] = useState(['']);

    useEffect(() => {
        getContent(id)
            .then(res => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].dc_type == 1) {
                        setNotes([...notes, res[i]]);
                    } else {
                        setImages([...images, res[i]]);
                    }
                }
            })
    }, []);

    return (
        <HighContainer>
            <Container h="100vh" w="100vw">
                <Relative>
                    {
                        notes.length != 0 || images.length != 0 ?
                            notes.map((el, ind) => (
                                el != '' &&
                                <Note x={el.dc_coordinates.x} y={el.dc_coordinates.y} rotate={el.dc_coordinates.rotate} key={ind} text={el.dc_content} />
                            ))
                            //<TextField>ff</TextField>
                            :
                            <Loading>&#8987;</Loading>
                    }
                </Relative>
            </Container>
        </HighContainer>
    )
}
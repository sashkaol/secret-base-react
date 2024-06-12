import { Map, Marker } from "pigeon-maps"
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, HighContainer, Loading, Popup } from "./styles/styles";
import { supabase } from './SupaBase';

export function Mapa() {

    const place = useParams();
    const address = place.id;

    const getAdress = async () => {
        let { data, err } = await supabase
            .from('cases')
            .select('ca_place')
            .eq('ca_id', address)
        return data || err
    }

    const [coordinates, setCoordinates] = useState(['']);
    const [addr, setAddr] = useState('');
    const [popup, setPopup] = useState('');

    useEffect(() => {
        getAdress()
            .then(res => {
                let key = process.env.REACT_APP_MY_GEOCODE_ACCESS_KEY
                let search = res[0].ca_place.replace('', '%20');
                console.log(key);
                axios.get(`https://api.geoapify.com/v1/geocode/search?text=${search}&apiKey=${key}`, { method: "GET" })
                    .then(response => {
                        setCoordinates([response.data.features[0].geometry.coordinates[1], response.data.features[0].geometry.coordinates[0]]);
                        setAddr(res[0].ca_place)
                    }).catch(error => {
                        console.log(error);
                    });
            })
    }, []);

    const showAddress = () => {
        setPopup("Место преступления: " + addr);
    }

    const hideAddress = () => {
        setPopup('');
    }

    return (
        <HighContainer>
            {coordinates != 0 ?
                <Container w="90vw" h="470px">
                    <Map defaultCenter={coordinates} defaultZoom={11}>
                        <Marker
                            width={50}
                            anchor={coordinates}
                            color={'#DD4A48'}
                            onMouseOver={showAddress}
                            onMouseOut={hideAddress}
                        />
                    </Map>
                    <Popup none={!popup}>{popup}</Popup>
                </Container>
                :
                <Loading>&#8987;</Loading>
            }
        </HighContainer>
    )
}

import axios from "axios";
import { useState } from "react";

export default function Case(props) {
    const id = props.id;
    const [data, setData] = useState({});

    const getCase = () => {
        axios.get('http://localhost:3001/cases', { id: id }).then(res => setData(res));
    }

    return (
        <div>
            <div>{data.description}</div>
            jfrghrig
        </div>
    )
}
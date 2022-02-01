import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Registration } from './Registrate';
import { Authorization } from './Auth';
import AllCases from './AllCases';

export function App() {
    return (
        <div>
        <h1>Hi</h1>
        {/* <BrowserRouter> */}
            <Routes>
                <Route exact path="/" element={<Authorization />} />
                <Route exact path="/allcases" element={<AllCases />} />
                <Route exact path="/reg" element={<Registration />} />
                <Route exact path="/menu" element={<p>HIiiii</p>} />
            </Routes>
        {/* </BrowserRouter> */}
        </div>
    )
}
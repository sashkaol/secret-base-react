import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Registration } from './Registrate';
import { Authorization } from './Auth';
import AllCases from './AllCases';
import { Menu } from './Menu';

export function App() {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Authorization />} />
                <Route exact path="/allcases" element={<AllCases />} />
                <Route exact path="/reg" element={<Registration />} />
                <Route exact path="/menu" element={<Menu />} />
            </Routes>
        </div>
    )
}
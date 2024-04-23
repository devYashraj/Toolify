import SignIn from "../pages/SignIn";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Testing({ admin }) {
    const navigate = useNavigate();
    async function test() {
        let token;
        if (admin)
            token = localStorage.getItem("adminToken");
        else
            token = localStorage.getItem("token");

        if (token) {
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const res = await axios.get(`${baseUrl}profile`, { headers })
            if(res.status === 200){
                
            }
        } else {
            if (admin)
                return (<SignIn admin={true} />);
            return <SignIn />
        }
    }

    useEffect(() => {
        test();
    }, []);

    if (admin)
        return (<SignIn admin={true}/>);

    return (<SignIn />);
}
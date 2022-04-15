import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import './App.css';
import { useSocket } from './socket/useSocket';

function App() {

    const [formData, setFormData] = useState({name: "", pass: ""});

    const [logged, setLogged] = useState(false);

    const {login, locked, buzz} = useSocket();

    const onFormChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    }

    const log = async () => {
        await login(formData.name, formData.pass);
        setLogged(true);
    }

    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            {!logged ? 
                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <TextField
                        name="name"
                        label="Nome"
                        value={formData.name}
                        variant="outlined"
                        onChange={onFormChange}/>
                    <TextField
                        sx={{marginTop: "15px", marginBottom: "15px"}}
                        name="pass"
                        label="Senha"
                        value={formData.pass}
                        variant="outlined"
                        onChange={onFormChange}/>
                    <Button variant="contained" onClick={() => log()}>Acessar</Button>
                </Box> :
                <Box>
                    <Button variant="contained" sx={{width: "200px", height: "200px"}} disabled={locked}
                        onClick={() => buzz()}>Buzz</Button>
                </Box>}
        </Box>
    );
}

export default App;

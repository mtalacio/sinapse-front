import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

const ws = new WebSocket('ws://34.227.14.168:3000');

export const SocketProvider = ({children}) => {

    const [token, setToken] = useState("");
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        ws.addEventListener('open', () => {
            console.log("Socket opened");
        })

        ws.addEventListener('error', () => {
            alert("Erro, atualize a pagina")
        })

        ws.addEventListener('close', () => {
            alert("Erro, atualize a pagina")
        })

        ws.addEventListener('message', (payload) => {
            const data = JSON.parse(payload.data);
            switch(data.action) {
                case "lock":
                    setLocked(true);
                    break;
                case "unlock":
                    setLocked(false);
                    break;
                default:
                    break;
            }
        })
    })

    const login = (user, pass) => {
        ws.send(JSON.stringify({
            action: "login",
            user: user,
            pass: pass
        }))

        var thisPromise = new Promise((resolve, reject) => {
            const resolver = (response) => {
                console.log(response.data);
                const data = JSON.parse(response.data);
                
                if(data.result !== "success") {
                    reject();
                    ws.removeEventListener('message', resolver);
                    return;
                }
                    
                setToken(data.token);
                setLocked(data.locked);
                resolve();
                ws.removeEventListener('message', resolver);
            }

            ws.addEventListener('message', resolver);
        });

        return thisPromise;
    }

    const buzz = () => {
        ws.send(JSON.stringify({
            action: "buzz",
            token: token
        }))
    }

    const values = {
        login,
        locked,
        buzz
    };


    return(
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    )

}
import Logs from "./File";
import {useEffect, useState} from "react";

function Status() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const url = process.env.REACT_APP_BACKEND_URL

        fetch(`${url ? url : ""}/api/status/`, {
            method: "POST",
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setData(data)
            })
            .catch(err => console.log(err));
    }, [])

    return (
        <div>
            <div className={"text-left"}>
                <ul>
                    {data["model_dir_contents"] && data["model_dir_contents"].map(item => <li>{item}</li>)}
                </ul>
                <p>Model directory: {data["configured_model_dir"]}</p>
                <Logs name="Flask Logs" lines={data["flask_logs"] ? data["flask_logs"] : []}></Logs>
                <Logs name="nginx Access Logs"
                      lines={data["nginx_access_logs"] ? data["nginx_access_logs"] : []}></Logs>
                <Logs name="nginx Error Logs" lines={data["nginx_error_logs"] ? data["nginx_error_logs"] : []}></Logs>
            </div>
        </div>

    )
}

export default Status;
import {useEffect, useState} from "react";

function Status() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`/api/status/`, {
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
            <div>
                <ul>
                    {data["model_dir_contents"] && data["model_dir_contents"].map(item => <li>{item}</li>)}
                </ul>
                <p>Model directory: {data["configured_model_dir"]}</p>
            </div>
        </div>

    )
}

export default Status;
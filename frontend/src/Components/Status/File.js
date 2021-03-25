import SyntaxHighlighter from 'react-syntax-highlighter';
import {darcula} from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Logs = (props) => {
    let {name, lines} = props;
    lines = lines.join("")
    return (
        <>
            <h4>{name}</h4>
            <div className={"overflow-auto mb-2"} style={{maxHeight: "350px", minHeight:"50px"}}>
                <SyntaxHighlighter showLineNumbers={true} language="javascript" style={darcula}>
                    {lines}
                </SyntaxHighlighter>
            </div>
        </>

    );
};

export default Logs;
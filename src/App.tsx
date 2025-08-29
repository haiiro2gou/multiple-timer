import * as React from "react";
import reactLogo from "../public/react.svg";
import viteLogo from "../public/vite.svg";
import "./App.css";

// eslint-disable-next-line @typescript-eslint/naming-convention
const App = () => {
    const [count, setCount] = React.useState(0);

    // Handler function for button click
    const handleButtonClick = () => {
        setCount(count => count + 1);
    };

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank" rel="noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                {/* eslint-disable-next-line react/jsx-no-bind */}
                <button onClick={handleButtonClick}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
};

export default App;

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import TransportForm from './controllers/TransportForm';

function App(){
    return(
        <div className="App">
            <TransportForm />
            <footer></footer>
        </div>
    )
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);

//ReactDOM.render(<App/>, document.getElementById('root'));



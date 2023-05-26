import React from 'react';
import '../styles/TransportForm.scss';

export default function TransportForm(){
    return(

            <form id="main-form">
                <p>Skonfiguruj transport</p>
                <label>Transport z:</label>
                <input type="text" name="transport-form" required placeholder="Transport z"></input>
                <label>Transport do:</label>
                <input type="text" name="transport-to" required placeholder="Transport do"></input>
                <label>Typ samolotu:</label>
                <select name="plane-type">
                    <option value="airbus-A380">Airbus A380</option>
                    <option value="boeing-747">Boeing 747</option>
                </select>
                <label>Dokumenty przewozowe:</label>
                <input type="file"></input>
                <div id="drop_zone">
                    <p>Drag one or more files to this <i>drop zone</i>.</p>
                </div>
            </form>
 
    )
}
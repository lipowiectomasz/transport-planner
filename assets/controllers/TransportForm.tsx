import React from 'react';

export default function TransportForm(){
    return(
        <form>
            <p>Skonfiguruj towary do transportu</p>
            <label>Transport z:</label>
            <input type="text" name="transport-from" required placeholder='Transport z'></input>
            <label>Transport do:</label>
            <input type="text" name="transport-to" required placeholder="Transport do"></input>
            <label>Typ samolotu:</label>
            <select name="plane-type">
                <option value="airbus-A380">Airbus A380</option>
                <option value="boeing-747">Boeing 747</option>
            </select>
        </form>
    )
}

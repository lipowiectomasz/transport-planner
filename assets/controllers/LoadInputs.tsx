import React from 'react';
import '../styles/TransportForm.scss';
import ILoad from '../interfaces/ILoad';

export default function LoadInputs(props:{loads:ILoad[], maxWeight: number, modLoad: Function}){

    const SingleLoadInputs = (args:{load:ILoad}) =>{
        return(        
        <div className="load-container">
            <label>Nazwa ladunku:</label>
            <input type="text" name="load-name" required placeholder="Nazwa ladunku" onChange={e => props.modLoad(e)}></input>
            <label>Ciezar ladunku:</label>
            <input type="number" name="load-weight" required placeholder="Ciezar ladunku" min="1" max={props.maxWeight} onChange={e => props.modLoad(e)}></input>
            <label>Data transportu:</label>
            <select name="load-type" required onChange={e => props.modLoad(e)} defaultValue="common-load">
                <option value="common-load">Zwykly ladunek</option>
                <option value="dangerous-load">Ladunek niebezpieczny</option>
            </select>
        </div>)
    }

    return(
        <>{props.loads.map((element, index)=>{
            return(<SingleLoadInputs key={index} load={element}></SingleLoadInputs>);
        })}</>
    );
}

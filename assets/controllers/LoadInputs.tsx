import React from 'react';
import '../styles/TransportForm.scss';
import ILoad from '../interfaces/ILoad';

export default function LoadInputs(props:{loads:ILoad[], maxWeight: number, modLoad: Function}){

    const singleLoadInputs = (load:ILoad) =>{
        return(        
        <>
            <label>Nazwa ladunku:</label>
            <input type="text" name="load-name" required placeholder="Nazwa ladunku" onChange={e => props.modLoad(e)} value={load['load-name']}></input>
            <label>Ciezar ladunku:</label>
            <input type="number" name="load-weight" required placeholder="Ciezar ladunku" min="1" max={props.maxWeight} onChange={e => props.modLoad(e)} value={load['load-weight']}></input>
            <label>Data transportu:</label>
            <select name="load-type" required onChange={e => props.modLoad(e)} defaultValue="common-load" value={load['load-type']}>
                <option value="common-load">Zwykly ladunek</option>
                <option value="dangerous-load">Ladunek niebezpieczny</option>
            </select>
        </>)
    }

    return(
        <>{props.loads.map((element)=>{
            return(singleLoadInputs(element));
        })}</>
    );
}

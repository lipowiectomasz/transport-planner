import React from 'react';
import '../styles/TransportForm.scss';
import ILoad from '../interfaces/ILoad';

export default function LoadInputs(props:{loads:ILoad[], maxWeight: number, modLoad: Function, delLoad: Function}){

    const SingleLoadInputs = (args:{load:ILoad, id:number}) =>{
        return(        
        <div className="load-container" id={args.id.toString()}>
            <label>Nazwa ladunku:</label>
            <input type="text" name="load-name" required placeholder="Nazwa ladunku" onChange={(e) => props.modLoad(e, args.id)} defaultValue={args.load['load-name']}></input>
            <label>Ciezar ladunku:</label>
            <input type="number" name="load-weight" required placeholder="Ciezar ladunku" min="1" max={props.maxWeight} onChange={(e) => props.modLoad(e, args.id)} defaultValue={args.load['load-weight']}></input>
            <label>Data transportu:</label>
            <select name="load-type" required onChange={(e) => props.modLoad(e, args.id)} defaultValue={args.load['load-type']}>
                <option value="zwykly ladunek">Zwykly ladunek</option>
                <option value="ladunek niebezpieczny">Ladunek niebezpieczny</option>
            </select>
            <button className="del-button" onClick={(e)=>{props.delLoad(e, args.id)}}>X</button>
        </div>)
    }

    return(
        <>{props.loads.map((element, index)=>{
            return(<SingleLoadInputs key={index} load={element} id={index}></SingleLoadInputs>);
        })}</>
    );
}

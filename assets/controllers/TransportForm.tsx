import React, {useState} from 'react';
import '../styles/TransportForm.scss';

import LoadInputs from './LoadInputs';
import ILoad from '../interfaces/ILoad';

export default function TransportForm(){
    //const loads:{[key: number]: ILoad} = {};
    const loads: ILoad[] = [];
    const [loadsList, addToLoadList] = useState(loads);
    const [maxWeight, setMaxWeight] = useState(35);

    const modLoad = (e:React.ChangeEvent<HTMLFormElement>) => {

    }

    const formValidate : { [key: string]: boolean} = {
        "transpor-from" : false,
        "transport-to" : false,
        "plane-type" : false,
        "transport-docs" : false,
        "transport-date" : false
    };

    const setValidation = (inputName: string, mode : boolean)=>{
        formValidate[inputName] = mode;
    }

    const validDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        console.log(`New date value: ${newValue}`);
        let newValueDate = new Date(newValue);
        console.log(`New date value as Date obj: ${newValueDate}`);
        console.log(`Current day: ${newValueDate.getDay()}`);

        if(newValueDate.getDay() == 0 || newValueDate.getDay() == 6 ){
            console.log("Transport moze sie odbyc tylko od poniedzialku do piatku!");
            setValidation(e.target.name, false);
            e.target.className = "invalid";
        }
        else{
            setValidation(e.target.name, true);
            e.target.className = "valid";
        }
      }
    
    const setPlaneType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        console.log(`Changed plane type: ${newValue}`);
    }

    const submitButton = (e:React.FormEvent) => {
        e.preventDefault();
        console.log("Submit button event");
    }

    const addNewLoad = (e:React.FormEvent) => {
        e.preventDefault();
        
        const newLoad = {"load-name":"", "load-weight": 1, "load-type":"common-load"};
        addToLoadList([...loadsList, newLoad]); 
        console.log(`Load list: ${loadsList}`);
        /*
        console.log("Add new load button event");
        let planeTypeEl = document.querySelector("#main-form select[name=\"plane-type\"]") as HTMLInputElement;
        console.log(`Plane type el: ${planeTypeEl.value}`)
        const newMaxWeight = (planeTypeEl.value == "airbus-A380") ? 35 : 38;
        setMaxWeight(newMaxWeight);
        */
    }


    return(

            <form id="main-form">
                <p>Skonfiguruj transport</p>
                <label>Transport z:</label>
                <input type="text" name="transport-from" required placeholder="Transport z"></input>
                <label>Transport do:</label>
                <input type="text" name="transport-to" required placeholder="Transport do"></input>
                <label>Typ samolotu:</label>
                <select name="plane-type" required onChange={setPlaneType} defaultValue="airbus-A380">
                    <option value="airbus-A380">Airbus A380</option>
                    <option value="boeing-747">Boeing 747</option>
                </select>
                <label>Dokumenty przewozowe:</label>
                <input type="file" name="transport-docs"></input>
                <div id="drop_zone">
                    <p>Drag one or more files to this <i>drop zone</i>.</p>
                </div>
                <label>Wybierz date transportu:</label>
                <input type="date" name="transport-date" required onChange={validDate}></input>
                <LoadInputs maxWeight={maxWeight} loads={loadsList} modLoad={modLoad}></LoadInputs>
                <button onClick={addNewLoad}>Dodaj kolejny ladunek</button>
                <button onClick={submitButton}>Przeslij formularz</button>
            </form>
 
    )
}


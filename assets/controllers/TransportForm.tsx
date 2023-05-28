import React, {DragEventHandler, useEffect, useState} from 'react';
import '../styles/TransportForm.scss';

import LoadInputs from './LoadInputs';
import ILoad from '../interfaces/ILoad';

export default function TransportForm(){
    //const loads:{[key: number]: ILoad} = {};
    const loads: ILoad[] = [
        {"load-name":"", "load-weight": 1, "load-type":"common-load"}
    ];
    const [loadsList, addToLoadList] = useState(loads);
    const [maxWeight, setMaxWeight] = useState(35);
    const [dropZoneClass, setDropZoneClass] = useState("drop-zone-unactive");
    const [dropedList, addToDropedList] = useState<File[]>([]);

    const modLoad = (e:React.ChangeEvent<HTMLFormElement>) => {
        console.log("caling for change");
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
        console.log(`Changed plane type`);
        const newMaxWeight = (e.target.value== "airbus-A380") ? 35 : 38;
        setMaxWeight(newMaxWeight);
    }

    const submitButton = (e:React.FormEvent) => {
        //e.preventDefault();
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

    const dragEnter = () =>{
        setDropZoneClass("drop-zone-drag-enter");
    }
    const dragLeave = (e:React.DragEvent<HTMLDivElement>) =>{
        setDropZoneClass("drop-zone-drag-leave");
        e.preventDefault();
        e.stopPropagation();
    }
    //let fullDropedList: DataTransfer[] = new DataTransfer();
    

    useEffect(()=>{
        const fileInput = document.querySelector("#main-form input[name=\"transport-docs\"]") as HTMLInputElement;
        const filesDroped = new DataTransfer();
        for(let file of dropedList){
            filesDroped.items.add(file);
        }
        fileInput.files = filesDroped.files;             
    }, [dropedList]);

    const droped = (e:React.DragEvent<HTMLDivElement>) =>{
        /*
        const isFile = (testFile:File)=>{
            return testFile.name === 
        }
        */
        e.preventDefault();
        e.stopPropagation();
        setDropZoneClass("drop-zone-droped");
        
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            /*
            const placeFilesInInput = () => {
                const fileInput = document.querySelector("#main-form input[name=\"transport-docs\"]") as HTMLInputElement;
            console.log("droped");
                const filesDroped = new DataTransfer();
                if(dropedList){
                    for(let file of dropedList){
                        console.log(`Aded ${file.name}`);
                        filesDroped.items.add(file);
                    }
                    console.log(`Doing leng: ${dropedList.length}`);
                } else {
                    console.log("Its not here"+dropedList+" orr "+e.dataTransfer.files[0].name);
                    addToDropedList([e.dataTransfer.files[0]]);
                    filesDroped.items.add(e.dataTransfer.files[0]);
                }
        
                fileInput.files = filesDroped.files;
            }
            */
            for(let file of e.dataTransfer.files){
                console.log(`File: ${file.name}`);

                const isFile = (testFile:File)=>{
                    return testFile.name === file.name;
                }

                if(dropedList.find(isFile)){
                    console.log("This file is already present...");
                } 
                else{
                    console.log(`Adding file: ${file.name}`);
                    addToDropedList([...dropedList, file]);
                    //setTimeout(placeFilesInInput, 500);
                }
            }    
        }




    }

    const showFiles = (e:React.FormEvent) => {
        console.log(`Full droped: ${dropedList.length}`);
        for(let file of dropedList){
            console.log(`Elements: ${file.name}`);
        }
        
        e.preventDefault();
        const fileInput = document.querySelector("#main-form input[name=\"transport-docs\"]") as HTMLInputElement;
        if(fileInput.files != null){
            for(let file of fileInput.files){
                console.log(`Files: ${file.name}`);
            }
        }
        else {
            console.log("empty");
        }
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
                <input type="file" name="transport-docs" accept=".jpg, .png, .doc, .docx, .pdf" multiple></input>
                <div id="drop_zone" className={dropZoneClass} onDragEnter={dragEnter} onDragOver={dragLeave} onDrop={droped}>
                    <p>Drag one or more files to this <i>drop zone</i>.</p>
                </div>
                <label>Wybierz date transportu:</label>
                <input type="date" name="transport-date" required onChange={validDate}></input>
                <LoadInputs maxWeight={maxWeight} loads={loadsList} modLoad={modLoad}></LoadInputs>
                <button onClick={addNewLoad}>Dodaj kolejny ladunek</button>
                <button onClick={submitButton}>Przeslij formularz</button>
                <button onClick={showFiles}>Pokaz pliki</button>
            </form>
 
    )
}


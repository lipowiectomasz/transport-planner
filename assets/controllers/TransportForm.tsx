import React, {ChangeEvent, useEffect, useState} from 'react';
import '../styles/TransportForm.scss';

import LoadInputs from './LoadInputs';
import ILoad from '../interfaces/ILoad';
import ITransport from '../interfaces/ITransport';

export default function TransportForm(){

    const initialLoads: ILoad[] = [{"load-name":"", "load-weight": 1, "load-type":"common-load"}];

    const [loadsList, addToLoadList] = useState<ILoad[]>(initialLoads);
    const [maxWeight, setMaxWeight] = useState(35);
    const [dropZoneClass, setDropZoneClass] = useState("drop-zone-unactive");
    const [dropedList, addToDropedList] = useState<File[]>([]);
    const [dropZone, setDropZone] = useState(<>Przeciagnij tu swoje dokumenty przewozowe</>);
    const [dateAlert, setDateAlert] = useState("");

    const initialData: ITransport = {
        "transpor-from" : "",
        "transport-to" : "",
        "plane-type" : "",
        "transport-docs" : [],
        "transport-date" : "",
        "transport-loads" : []
    }
    
    const [transportData, setTransportData] = useState<ITransport>(initialData);

    useEffect(()=>{
        const fileInput = document.querySelector("#main-form input[name=\"transport-docs\"]") as HTMLInputElement;
        const filesDroped = new DataTransfer();
        for(let file of dropedList){
            filesDroped.items.add(file);
        }
        fileInput.files = filesDroped.files;   
        transportData['transport-docs'] = [...fileInput.files];     
    }, [dropedList]);

    const modLoad = (e:ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>, id:number) => {
        console.log(`ID: ${id} and target name: ${e.target.name}`);
        const element:string = 'load-name';
        switch(e.target.name){
            case 'load-name':
                loadsList[id]['load-name'] = e.target.value;
                break;
            case 'load-weight':
                loadsList[id]['load-weight'] = parseInt(e.target.value);
                break;
            case 'load-type':
                loadsList[id]['load-type'] = e.target.value;
                break;
        }
        console.log(`LISTA: ${loadsList[id]['load-name']}  ${loadsList[id]['load-weight']}  ${loadsList[id]['load-type']}`);
    }

    const formValidate : { [key: string]: boolean} = {
        "transport-date" : false
    };

    const setValidation = (inputName: string, mode : boolean)=>{
        formValidate[inputName] = mode;
    }

    const validFormData = (e: React.ChangeEvent) => {

    }

    const validDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValueDate = new Date(e.target.value);
        let currDate = new Date();
        if(newValueDate <= currDate){
            setValidation(e.target.name, false);
            e.target.className = "invalid";
            setDateAlert("Wybierz przyszla date!");
        }
        else{
            if(newValueDate.getDay() == 0 || newValueDate.getDay() == 6 ){
                setValidation(e.target.name, false);
                e.target.className = "invalid";
                setDateAlert("Transporty odbywaja sie tylko od pon-pt!");
            }
            else{
                setValidation(e.target.name, true);
                e.target.className = "valid";
                const dateString = newValueDate.getDate()+"-"+newValueDate.getMonth()+"-"+newValueDate.getFullYear();
                setTransportData(
                    prev => {
                        return {...prev, [e.target.name]: dateString}
                    }
                );
                setDateAlert("");
            }
        }
        
      }
    
    const setPlaneType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMaxWeight = (e.target.value== "airbus-A380") ? 35 : 38;
        setMaxWeight(newMaxWeight);
        for(let load of loadsList){
            if(load['load-weight']>newMaxWeight){
                load['load-weight']=newMaxWeight;
            }
        }
    }

    const submitButton = (e:React.FormEvent) => {
        //e.preventDefault();
        console.log("Submit button event");
        console.log(transportData);
    }

    const addNewLoad = (e:React.FormEvent) => {
        e.preventDefault();
        addToLoadList([...loadsList, {"load-name":"", "load-weight": 1, "load-type":"common-load"}]); 
    }

    const dragLeave = (e:React.DragEvent<HTMLDivElement>) =>{
        e.preventDefault();
        setDropZoneClass("drop-zone-drag-enter");
        setDropZone(<>Przeciagnij tu swoje dokumenty przewozowe</>);
    }

    const dragOver = (e:React.DragEvent<HTMLDivElement>) =>{
        e.preventDefault();
        setDropZoneClass("drop-zone-drag-leave");
        setDropZone(<>Upusc tutaj</>);
    }

    const droped = (e:React.DragEvent<HTMLDivElement>) =>{
        e.preventDefault();
        //e.stopPropagation();
        setDropZoneClass("drop-zone-droped");
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {

            for(let file of e.dataTransfer.files){
                const isFile = (testFile:File)=>{
                    return testFile.name === file.name;
                }

                if(dropedList.find(isFile)){
                    console.log("This file is already present...");
                } 
                else{
                    console.log(`Adding file: ${file.name}`);
                    addToDropedList([...dropedList, file]);
                }
            }    
        }

        setDropZoneClass("drop-zone-drag-enter");
        setDropZone(<>Przeciagnij tu swoje dokumenty przewozowe</>);
    }

    const fileDel = (e:React.FormEvent, file:File) => {
        e.preventDefault();
        let newList = dropedList;
        newList.splice(newList.indexOf(file),1);
        addToDropedList([...newList]);
        setDropZoneClass("drop-zone-drag-leave");
    }

    const checkFiles = (e:React.FormEvent<HTMLInputElement>) => {
        console.log("Fired checkFile");
        const filesInput = e.target as HTMLInputElement;
        if(filesInput.files){
            for(let file of filesInput.files){
                if(!dropedList.find( el => el == file))
                    addToDropedList([...dropedList, file]);
            }
        }
    }

    const getCurrentDate = ()=>{
        let currDate = new Date();
        return currDate.getFullYear()+"-"+currDate.getMonth()+1+"-"+currDate.getDate();
    }

    return(
        <>
            <p id="title">Konfigurator transportu</p>
            <div id="form-container"> 
                <form id="main-form">
                    <label>Transport z:</label>
                    <input type="text" name="transport-from" required placeholder="Transport z" onChange={validFormData}></input>
                    <label>Transport do:</label>
                    <input type="text" name="transport-to" required placeholder="Transport do" onChange={validFormData}></input>
                    <label>Typ samolotu:</label>
                    <select name="plane-type" required onChange={setPlaneType} defaultValue="airbus-A380">
                        <option value="airbus-A380">Airbus A380</option>
                        <option value="boeing-747">Boeing 747</option>
                    </select>
                    <label>Dokumenty przewozowe:</label>
                    <div id="file-zone">
                        <div id="drop-zone" className={dropZoneClass} onDragLeave={dragLeave} onDragOver={dragOver} onDrop={droped}>
                            {dropZone}
                        </div>
                        <div id="file-tab">Pliki:{dropedList.map((file, index)=><p key={index}>{file.name}<button onClick={(e)=>{fileDel(e,file);}
                        }>X</button></p>)}</div>
                    </div>
                    
                    <input type="file" name="transport-docs" onChange={checkFiles} multiple></input>
                    <label>Wybierz date transportu:</label>
                    <div id="date-box">
                        <input type="date" name="transport-date" required onChange={validDate} min={getCurrentDate()}></input>
                        <p>{dateAlert}</p>
                    </div>
                    <LoadInputs maxWeight={maxWeight} loads={loadsList} modLoad={modLoad}></LoadInputs>
                    <button onClick={addNewLoad}>Dodaj kolejny ladunek</button>
                    <button onClick={submitButton}>Przeslij formularz</button>
                    
                </form>
            </div>
        </>
    )
}


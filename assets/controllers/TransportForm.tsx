import React, {ChangeEvent, useEffect, useState} from 'react';

import axios from 'axios';

import '../styles/TransportForm.scss';

import LoadInputs from './LoadInputs';
import ILoad from '../interfaces/ILoad';
import ITransport from '../interfaces/ITransport';

export default function TransportForm(){

    const initialLoads: ILoad[] = [{"load-name":"", "load-weight": 1, "load-type":"zwykly ladunek"}];

    const [loadsList, addToLoadList] = useState<ILoad[]>(initialLoads);
    const [maxWeight, setMaxWeight] = useState(35);
    const [dropZoneClass, setDropZoneClass] = useState("drop-zone-unactive");
    const [dropedList, addToDropedList] = useState<File[]>([]);
    const [dropZone, setDropZone] = useState(<>Przeciagnij tu swoje dokumenty przewozowe</>);
    const [dateAlert, setDateAlert] = useState("");

    const initialData: ITransport = {
        "transport-from" : "",
        "transport-to" : "",
        "plane-type" : "airbus-a380",
        "transport-docs" : [],
        "transport-date" : "",
        "transport-loads" : []
    }
    
    const [transportData, setTransportData] = useState<ITransport>(initialData);

    const [dateValid, setDateValid] = useState(false);


    useEffect(()=>{
        const fileInput = document.querySelector("#main-form input[name=\"transport-docs\"]") as HTMLInputElement;
        const filesDroped = new DataTransfer();
        for(let file of dropedList){
            filesDroped.items.add(file);
        }
        fileInput.files = filesDroped.files;   
        transportData['transport-docs'] = [...fileInput.files];     
    }, [dropedList]);

    useEffect(()=>{
        transportData['transport-loads'] = [...loadsList];
    },[loadsList]);

    const modLoad = (e:ChangeEvent<HTMLInputElement>, id:number) => {
        
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
        
    }

    const delLoad = (e:React.FormEvent, id:number) => {
        e.preventDefault();
        if(loadsList.length>1){
            loadsList.splice(id,1);
            addToLoadList([...loadsList]);
        } else {
            alert("W transporcie musi byc przynajmniej jeden towar!");
        }
    }

    const validFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch(e.target.name){
            case 'transport-to':
                transportData['transport-to'] = e.target.value;
                break;
            case 'transport-from':
                transportData['transport-from'] = e.target.value;
                break;
        }
        
    }

    const validDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValueDate = new Date(e.target.value);
        let currDate = new Date();
        if(newValueDate <= currDate){
            setDateValid(false);
            e.target.className = "invalid";
            setDateAlert("Wybierz przyszla date!");
        }
        else{
            if(newValueDate.getDay() == 0 || newValueDate.getDay() == 6 ){
                setDateValid(false);
                e.target.className = "invalid";
                setDateAlert("Transporty odbywaja sie tylko od pon-pt!");
            }
            else{
                setDateValid(true);
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
        transportData['plane-type']=e.target.value;
    }

    const submitButton = (e:React.FormEvent) => {
        e.preventDefault();
        /*

        */
        if(dateValid){
            //submit
            axios.post('/api/transport/make', transportData,
                {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    }
            })
                .then(response => {
                    console.log(response.data);
                }).catch(error => {
                    console.error(error);
                })
        }
        
        else{
            alert("Ustaw poprawna date!");
        }
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
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {

            for(let file of e.dataTransfer.files){
                if(file.size/(1024*1024)>7){
                    setDropZone(<>Zbyt duzy plik (max 7MB)</>);
                    setDropZoneClass("invalid");
                }
                else{
                    const isFile = (testFile:File)=>{
                        return testFile.name === file.name;
                    }
    
                    if(dropedList.find(isFile)){
                        setDropZone(<>Ten plik zostal juz przeslany</>);
                        setDropZoneClass("invalid");
                    } 
                    else{
                        let allowType = false;
                        if(file.type == 'image/jpeg' && file.name.substring(file.name.length - 3) == 'jpg'){
                            allowType = true;
                        }
                        else if(file.type == 'image/png' && file.name.substring(file.name.length - 3) == 'png'){
                            allowType = true;
                        }
                        else if(file.type == 'application/pdf' && file.name.substring(file.name.length - 3) == 'pdf'){
                            allowType = true;
                        }
                        else if(file.type == 'application/msword' && file.name.substring(file.name.length - 3) == 'doc'){
                            allowType = true;
                        }
                        else if(file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && file.name.substring(file.name.length - 4) == 'docx'){
                            allowType = true;
                        }
                        if(allowType==true){
                            addToDropedList(prev => [...prev, file]);
                            setDropZone(<>Przeslano plik!</>);
                            setDropZoneClass("valid");
                        }
                        else{
                            setDropZone(<>Zly format. Akceptowane formaty to: .jpg, .png, .pdf, .docx, .doc.</>);
                            setDropZoneClass("invalid");
                        }
                        
                    }
                }
            }    
        }
    }

    const fileDel = (e:React.FormEvent, file:File) => {
        e.preventDefault();
        let newList = dropedList;
        newList.splice(newList.indexOf(file),1);
        addToDropedList([...newList]);
        setDropZoneClass("drop-zone-drag-leave");
    }

    const checkFiles = (e:React.FormEvent<HTMLInputElement>) => {
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
                <form id="main-form" onSubmit={submitButton}>
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
                        <div id="file-tab"><ul>{dropedList.map((file, index)=><li key={index}><p>{file.name}</p><button onClick={(e)=>{fileDel(e,file);}
                        }>X</button></li>)}</ul></div>
                    </div>
                    
                    <input type="file" name="transport-docs" onChange={checkFiles} multiple></input>
                    <label>Wybierz date transportu:</label>
                    <div id="date-box">
                        <input type="date" name="transport-date" required onChange={validDate} min={getCurrentDate()} placeholder='mm/dd/yyyy'></input>
                        <p>{dateAlert}</p>
                    </div>
                    <LoadInputs maxWeight={maxWeight} loads={loadsList} modLoad={modLoad} delLoad={delLoad}></LoadInputs>
                    <button onClick={addNewLoad}>Dodaj kolejny ladunek</button>
                    <button type="submit">Przeslij formularz</button>
                    
                </form>
            </div>
        </>
    )
}


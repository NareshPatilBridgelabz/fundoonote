import axios from "axios";
import userApiConstants from "../apiConstants/userApiConstants";
let userData = JSON.parse(localStorage.getItem("userDetails"))
export async function getUserNote(){
    try{
        const response = await axios.get(process.env.REACT_APP_NOTES_URL + userApiConstants.getNotes, {
            headers: {
                Authorization:userData.id
        }});
        return response;
    }catch(err){
        throw err;
    }
}

export async function setUserNote(noteData){
    try{
        const response = await axios.post(process.env.REACT_APP_NOTES_URL + userApiConstants.setNotes,noteData,{
            headers: {
                Authorization:userData.id
        }});
        return response
    } catch(err){
        throw err
    }
}

export async function deleteUserNote(noteID){
    try{
        let noteData = {isDeleted: true, noteIdList: [noteID]}
        const response = await axios.post(process.env.REACT_APP_NOTES_URL + userApiConstants.deleteNote,noteData,{
            headers: {
                Authorization:userData.id
        }});
        return response
    } catch(err){
        throw err
    }
}
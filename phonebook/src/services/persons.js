import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
    return axios.get(baseUrl);
}

const Create = (personObject) => {
    return axios.post(baseUrl, personObject);
}

const Delete = (id) => {
    return axios.delete(baseUrl + "/" + id);
}

const Update = (id, newobject) => {
   return axios.put(`${baseUrl}/${id}`, newobject);
};

export default {getAll, Create, Delete, Update}
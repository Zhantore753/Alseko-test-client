// const server = 'http://localhost:8080';
const server = "http://192.168.0.135:8080";

export const loadPersons = async (page, sort, direction) => {
  try{
    const res = await fetch(
      `${server}/api/person?page=${page}&sort=${sort}&direction=${direction}`
    );
    const data = await res.json();
    return data;
  }catch(e){
    console.log(e);
  }
};

export const loadOnePerson = async (id) => {
  try{
    const res = await fetch(
      `${server}/api/person/${id}`
    );
    const data = await res.json();
    return data;
  }catch(e){
    console.log(e);
  }
}

export const updatePerson = async (changes) => {
  try{
    const res = await fetch(`${server}/api/person`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(changes)
    });
    const data = await res.json();
    return data;
  }catch(e){
    console.log(e);
  }
}

export const loadMaterials = async (id) => {
  try{
    const res = await fetch(`${server}/api/material?id=${id}`);
    const data = await res.json();
    return data;
  }catch(e){
    console.log(e);
  }
};

export const updateMaterials = async (changes) => {
  try{
    await fetch(`${server}/api/material`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(changes)
    });
  }catch(e){
    console.log(e);
  }
}

export const createMaterial = async (material) => {
  try{
    await fetch(`${server}/api/material`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(material)
    });
  }catch(e){
    console.log(e);
  }
}

export const deleteMaterial = async (id) => {
  try{
    const res = await fetch(
      `${server}/api/material/${id}`
    );
    const data = await res.json();
    return data;
  }catch(e){
    console.log(e);
  }
}
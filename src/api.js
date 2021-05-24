// const server = 'http://localhost:8080';
const server = "http://192.168.0.135:8080";

export const loadPersons = async (page, sort, direction) => {
  const res = await fetch(
    `${server}/api/person?page=${page}&sort=${sort}&direction=${direction}`
  );
  const data = await res.json();
  return data;
};

export const loadMaterials = async (id) => {
  const res = await fetch(`${server}/api/material?id=${id}`);
  const data = await res.json();
  return data;
};

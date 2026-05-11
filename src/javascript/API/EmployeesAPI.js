import { ExceptionHandler } from "../Exceptions/ExceptionHandler";
import { TokenException } from "../Exceptions/TokenException";

export async function fetchEmployees() {
  try {
    const API = process.env.REACT_APP_EMPLOYEES_ALL;
    const token = sessionStorage.getItem("accessToken"); // <- read here, not at top
    if (!token) throw new Error("No access token found");

    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) throw new TokenException();

    return await res.json();
  } catch (err) {
    ExceptionHandler.handle(err);
    return []; // never return undefined
  }
}

export async function registerEmployee(employeeData) {

  const token = sessionStorage.getItem("accessToken");

  const API = process.env.REACT_APP_EMPLOYEES_REGISTER;

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(employeeData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message
    };
  }

  return data;
}

export async function updateEmployee(id, employeeData) {
  const token = sessionStorage.getItem("accessToken");
  try{
       const API = process.env.REACT_APP_EMPLOYEES_UPDATE;
  const res = await fetch(`${API + id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(employeeData)
  });
  
    if (res.status === 401) throw new TokenException();
}
  catch(err){
 ExceptionHandler.handle(err);

  }
}

export async function deleteEmployee(id){
  const token = sessionStorage.getItem("accessToken");
      
  try{
       const API = process.env.REACT_APP_EMPLOYEES_DELETE;
            const res = await fetch(`${API+id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

             if (res.status === 401) throw new TokenException();
}
  catch(err){
 ExceptionHandler.handle(err);
}
}
import { ExceptionHandler } from "../Exceptions/ExceptionHandler";
import { TokenException } from "../Exceptions/TokenException";

export async function fetchServices() {

  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch(
      "http://localhost:8000/api/mixed/sherbimet/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Handle auth errors FIRST
    if (response.status === 401 || response.status === 403) {
      throw new TokenException();
    }

    // Handle other errors
    if (!response.ok) {
      throw new Error("Request failed");
    }

    return await response.json();

  } catch (err) {
    ExceptionHandler.handle(err);
    return [];
  }
}
export async function fetchServiceAtributes(ID) {
  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `http://localhost:8000/api/mixed/sherbimet/atributet/${ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 401) throw new TokenException();

    if (!response.ok) {
      throw new Error(`Failed to fetch service attributes. Status: ${response.status}`);
    }

    const data = await response.json();

       if (data.ImagePath) {
      data.imageURL = `data:image/jpeg;base64,${data.ImagePath}`;
    } else {
      data.imageURL = null; // explicitly null for missing images
    }
    
    return data;

  } catch (err) {
    ExceptionHandler.handle(err);
    return null; 
  }
}

export async function registerServices(data){

    const token = sessionStorage.getItem("accessToken");

  try{
    const response = await fetch("http://localhost:8000/api/admin/sherbimet/register",{
          method: "POST",
            headers: { "Content-Type": "application/json" ,
            "Authorization": `Bearer ${token}`},
            body: JSON.stringify(data) });

            if(response === 401) throw new TokenException();

            return true;
  } catch(err){
    ExceptionHandler.handle(err);
    return false;
  }
}

export async function updateService(id,data){

    const token = sessionStorage.getItem("accessToken");

  try{

    const response = await fetch(`http://localhost:8000/api/admin/sherbimet/update/${id}`,
      {
        method: "PUT",
        headers:{"Content-Type": "application/json" ,
            "Authorization": `Bearer ${token}`},
        body: JSON.stringify(data)});

    if (response.status === 401) throw new TokenException();
    
    return true;
  }catch(err){
    ExceptionHandler.handle(err);
    return false;
  }
}

export async function deleteService(id) {
  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch(`http://localhost:8000/api/admin/sherbimet/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 401) throw new TokenException();

    const data = await response.text(); 
    return data;

  } catch (err) {
    ExceptionHandler.handle(err);
    return []
  }
}
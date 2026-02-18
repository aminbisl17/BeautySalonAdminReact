import { ExceptionHandler } from "../Exceptions/ExceptionHandler";
import { TokenException } from "../Exceptions/TokenException";

export async function fetchServices(){

    const token = sessionStorage.getItem("accessToken");
  try{
   const response = await fetch("http://192.168.100.47:8000/api/mixed/sherbimet/all",{
          headers: { Authorization: `Bearer ${token}` }
   });
  
   if(response === 401) throw new TokenException();

   return await response.json();
  }
 catch(err){
  ExceptionHandler.handle(err);
  return [];
 }
}

export async function fetchServiceAtributes(ID) {
    const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `http://192.168.100.47:8000/api/mixed/sherbimet/atributet/${ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

  if(response === 401) throw new TokenException();

 return await response.json();
  }
 catch(err){
  ExceptionHandler.handle(err);
  return [];
 }
}

export async function registerServices(data){

    const token = sessionStorage.getItem("accessToken");

  try{
    const response = await fetch("http://192.168.100.47:8000/api/admin/sherbimet/register",{
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

    const response = await fetch(`http://192.168.100.47:8000/api/admin/sherbimet/update/${id}`,
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
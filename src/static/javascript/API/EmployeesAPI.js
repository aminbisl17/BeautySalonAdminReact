import { ExceptionHandler } from "../Exceptions/ExceptionHandler";
import { TokenException } from "../Exceptions/TokenException";

export async function fetchEmployees() {
  try {
    const token = sessionStorage.getItem("accessToken"); // <- read here, not at top
    if (!token) throw new Error("No access token found");

    const res = await fetch("http://192.168.100.47:8000/api/admin/employees/all", {
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
  try{
  const res = await fetch("http://192.168.100.47:8000/api/admin/employees/register", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(employeeData)
  });

  if (res.status === 401) throw new TokenException();

      
    return (await res.json()).message;

}
  catch(err){
 ExceptionHandler.handle(err);
 return [];
}
}

export async function updateEmployee(id, employeeData) {
  const token = sessionStorage.getItem("accessToken");
  try{
  const res = await fetch(`http://192.168.100.47:8000/api/admin/employees/update/${id}`, {
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
            const res = await fetch(`http://192.168.100.47:8000/api/admin/employees/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

             if (res.status === 401) throw new TokenException();

             alert("Employee deleted!");
}
  catch(err){
 ExceptionHandler.handle(err);
}
}
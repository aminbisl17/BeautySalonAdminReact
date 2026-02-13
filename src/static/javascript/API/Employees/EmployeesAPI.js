import { ExceptionHandler } from "../../Exceptions/ExceptionHandler";
import { TokenException } from "../../Exceptions/TokenException";

const token = sessionStorage.getItem("accessToken");

export async function fetchEmployees() {
  try {
    const res = await fetch("http://192.168.100.47:8000/api/admin/employees/all", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401) throw new TokenException();
  
 //   store.employees = (await res.json());
    return res.json();
  } catch (err) {
    ExceptionHandler.handle(err)
  }
}

export async function registerEmployee(employeeData) {
  try{
  const res = await fetch("http://192.168.100.251:8000/api/admin/employees/register", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(employeeData)
  });

  if (res.status === 401) throw new TokenException();
}
  catch(err){
 ExceptionHandler.handle(err);
}
}

export async function updateEmployee(id, employeeData) {
  try{
  const res = await fetch(`http://192.168.100.251:8000/api/admin/employees/update/${id}`, {
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
      
  try{
            const res = await fetch(`http://192.168.100.251:8000/api/admin/employees/delete/${id}`, {
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
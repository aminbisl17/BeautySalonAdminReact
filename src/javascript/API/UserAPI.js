import { ExceptionHandler } from "../Exceptions/ExceptionHandler";
import { TokenException } from "../Exceptions/TokenException";

export async function updateUser(data){
 const token = sessionStorage.getItem("accessToken");
  try{
       const API = process.env.REACT_APP_USER_UPDATE;
  const res = await fetch(`${API}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  
    if (res.status === 401) throw new TokenException();
}
  catch(err){
    ExceptionHandler.handle(err);

  }
}

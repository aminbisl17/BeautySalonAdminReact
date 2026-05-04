import { ExceptionHandler } from "../Exceptions/ExceptionHandler";
import { TokenException } from "../Exceptions/TokenException";


export async function fetchServices() {

  const API = process.env.REACT_APP_SERVICES_ALL;
  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch(
      API,
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

    const API = process.env.REACT_APP_SERVICES_ATRIBUTES;
  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${API + ID}`,
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

       if (data.imagePath) {
    
      data.imageURL = `data:image/jpeg;base64,${data.imagePath}`;
    } else {
      data.imageURL = null; 
   
    }
    
    return data;

  } catch (err) {
    ExceptionHandler.handle(err);
   // return null; 
   return {
    atributet: [],
    imageURL: null
  };
  }
}

export async function registerServices(data, imageFile) {
  const token = sessionStorage.getItem("accessToken");
  const API = process.env.REACT_APP_SERVICES_REGISTER;

  const formData = new FormData();

  formData.append("data", JSON.stringify(data));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await fetch(
      API,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 

        },
        body: formData,
      }
    );

    if (response.status === 401) throw new TokenException();

    return true;
  } catch (err) {
    ExceptionHandler.handle(err);
    return false;
  }
}
export async function updateService(id, form) {
  const API = process.env.REACT_APP_SERVICES_UPDATE;
  const token = sessionStorage.getItem("accessToken");

  try {
    // ✅ Build JSON data part
    const data = {
      emri_sherbimit: form.emri_sherbimit,
      pershkrimi: form.pershkrimi,
      qmimi_baze: parseFloat(form.qmimi_baze),
      zbritja: parseFloat(form.zbritja),
      is_active: Boolean(form.is_active),
      kohezgjatja: form.kohezgjatja,
      atributet: form.atributet,
      removeImage: form.removeImage || false
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    
    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    const response = await fetch(`${API + id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
       
      },
      body: formData
    });

    if (response.status === 401) throw new TokenException();

    return true;

  } catch (err) {
    ExceptionHandler.handle(err);
    return false;
  }
}

export async function deleteService(id) {
  const token = sessionStorage.getItem("accessToken");
 const API = process.env.REACT_APP_SERVICES_DELETE;
  try {
    const response = await fetch(`${API + id}`, {
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
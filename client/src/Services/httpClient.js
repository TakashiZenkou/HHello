const BASE_SERVER_API_URL = "http://localhost:8000/api"

export default {
  async post(url, data, resField) {
    const postPromise = new Promise((resolve) =>{
      fetch(BASE_SERVER_API_URL.concat(url), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data || {}),
      })
      .then((res) => res.json())
      .then((data) => resolve(resField && data[resField] || data))
    })    

    return postPromise
  } 
}
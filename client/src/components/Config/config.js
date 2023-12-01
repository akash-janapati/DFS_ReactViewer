const PORT = 5000;
const config = {
  BASE_URL : "http://localhost:"+String(PORT)+"/hv",
//   BASE_URL : "https://datafoundation.iiit.ac.in/hv"
  REFRESH_TIME: 20000,
  PROCESS_URL: "http://localhost:4000"
}

export {
    config
}

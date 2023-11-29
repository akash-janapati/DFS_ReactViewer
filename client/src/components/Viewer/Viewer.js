import React, { useEffect, useRef, useState } from 'react'
import './Viewer.css'
import axios from 'axios'
import GetFiles from './components/GetFiles/GetFiles'
import ProgressBar from './components/ProgressBar/ProgressBar'
import { config } from '../Config/config'
import { toast } from 'react-toastify'
import { io } from "socket.io-client";
import StatusInfo from '../statusInfo'

function Viewer(props) {
  const [currentFile, setCurrentFile] = useState({
    count: 0,
    name: '',
  })
  const [isUploaded, setIsUploaded] = useState(false)
  const [displayProgressBar, setDisplayProgressBar] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const currentFileSelected = useRef(null)
  const [fileInfo, setFileInfo] = useState({})
  const [uploadPercentage, setUploadPercentage] = useState({});
  const [recentUploaded, setRecentUploaded] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [parentState, setParentState] = useState({
    "name": null,
    "format": null,
    "link": null,
    // "processed": "false",
  });

  const updateParentState = (updatedChildState) => {
    setParentState(updatedChildState);
  };
  

  const email = JSON.parse(
    localStorage.getItem('dfs-user')
  ).user.user_email.toLowerCase()
  let shortEmail = ''
  for (let i = 0; i < email.length; i++) {
    const charCode = email.charCodeAt(i)
    if (
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122)
    ) {
      shortEmail += email.charAt(i)
    }
  }

  function handleChange(e) {
    // console.log(e);
    // console.log(e.target.files[0]);
    const file = e.target.files[0]
    setCurrentFile((prevValue) => ({
      ...prevValue,
      name: file,
    }))
  }

  function handleProcess(e) {
    console.log("Processing Image");
    console.log('Status of image, as viewed from parent: ',parentState);

    // if one of the parent state is null, then don't process the image
    // print a toast message saying "Please select an image to process"
    if (parentState.name == null || parentState.format == null || parentState.link == null) {
      // make the toast theme red
      toast.warn("Please select an image to process");
      return;
    }

    // get the dropdown values
    let object = document.getElementById("object").value;
    let technique = document.getElementById("technique").value;
    console.log("Object: ", object);
    console.log("Technique: ", technique);

    // make an api request to the backend
    // send the object and technique as params
    // image name, format, link as body
    // get the response, that's all
    // toast the response
    let image_name = parentState.name;
    let image_format = parentState.format;
    let image_link = parentState.link;
    let image_body = {
      "name": image_name,
      "format": image_format,
      "link": image_link,
    };

    let image_params = {
      "object": object,
      "technique": technique,
    };



    

    
    
  }

  async function uploadFile(e) {
    e.preventDefault()
    const socket = io.connect('http://localhost:5000');
    socket.on('connect', () => {
      console.log('Connected:', socket.connected); // Should be true
      setIsConnected(true);
      socket.emit('addUser', JSON.parse(localStorage.getItem("dfs-user"))?.["token"])
    });

    socket.on('progress', (progress_data) => {
      console.log("progress data->", progress_data)
      if (progress_data.Data.Uploaded_Files != undefined && progress_data.Data.Total_Files != undefined) {
        let num = progress_data.Data.Uploaded_Files;
        let den = progress_data.Data.Total_Files;
        let per = (num / den) * 100;
        const fileName = currentFile.name.name;
        setUploadPercentage((prevValue) => ({
          ...prevValue,
          [fileName]: per,
        }));
      }
    })

    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    const formData = new FormData()
    setDisplayProgressBar(true)
    formData.append('file', currentFile.name)
    let bucketURL = config.BASE_URL + '/objects/' + shortEmail

    if (
      currentFile.name.name &&
      ['jpg', 'jpeg'].includes(
        currentFile.name.name.split('.').pop().toLowerCase()
      )
    ) {
      toast.info('Converting JPG/JPEG to PNG')
      // Convert the JPG/JPEG file to PNG
      const convertedFile = await convertToPng(currentFile.name);
      console.log(convertedFile);
      // if error in conversion, then return
      if (convertedFile instanceof Error) {
        toast.error('Error in Uploading File')
        return;
      }
      // clear the formData
      formData.delete('file');
      // append the converted file to formData
      formData.append('file', convertedFile);
      console.log(convertedFile.name);
      
      // change the currentFile to convertedFile
      setCurrentFile((prevValue) => ({
        ...prevValue,
        name: convertedFile.name,
        count: prevValue.count + 1,
      }))
    }
    
    formData.append('file', currentFile.name);
    console.log(formData.get('file'));
    
    console.log(currentFile.name.name);
    let res = await axios.get(config.BASE_URL + '/isUploaded/' + shortEmail, {
      headers: {
        authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
      },
      params: {
        fileName: currentFile.name.name,
      },
    })

    if (res != undefined && res.data.isUploaded == 1) {
      toast.warn('Image Already Exists')
      setDisplayProgressBar(false)
    } else {
      try {
        console.log('Initiating upload')
        console.log('File:', currentFile.name.name)
        console.log(formData)
        let response = await axios.post(bucketURL, formData, {
          headers: {
            authorization:
              'Bearer ' +
              JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
          },
          // Added On Upload Progress Config to Axios Post Request
          onUploadProgress: function (progressEvent) {
            const percentCompleted = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            )
            setProgressValue(percentCompleted)
          },
        })
        if (response.status === 200) {
          toast.info('Upload is in Progress....Please check after some time')
        } else {
          toast.error('Error in Uploading File')
        }
        setTimeout(function () {
          setProgressValue(0)
          setDisplayProgressBar(false)
        }, 3000)
        console.log('Upload complete')
        currentFileSelected.current.value = null
        setIsUploaded(true)
        setCurrentFile((prevValue) => ({
          ...prevValue,
          name: response.data.filename,
          format: response.data.format,
          count: prevValue.count + 1,
        }))
      } catch (error) {
        console.log(error)
      }
    }
  }

   async function convertToPng(file) {
    const image = new Image();
  
    return new Promise((resolve, reject) => {
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
  
        canvas.toBlob(
          (blob) => {
            const file_name = file.name.split('.')[0];
            const convertedFile = new File([blob], `${file_name}.png`, {
              type: 'image/png',
            });
            resolve(convertedFile);
          },
          'image/png',
          1
        );
      };
  
      image.onerror = function () {
        reject(new Error('Error loading image for conversion.'));
      };
  
      image.src = URL.createObjectURL(file);
    });
  }

  return (
    <div className='Viewer'>
      <div className='main-btn'>
        <div className='form-container'>
          <form>
            <input
              type='file'
              ref={currentFileSelected}
              id='fileInput'
              onChange={handleChange}
              className='input-file'
            />
            <button
              type='submit'
              onClick={uploadFile}
              className='upload-button'
            >
              Upload
            </button>
          </form>
          {displayProgressBar ? (
            <ProgressBar progressValue={progressValue} />
          ) : (
            <></>
          )}
        </div>
        <div className="dropdown-container">
          <div className="dropdown">
            {/* Create a dropdown menu for objects to anonymize, example: "faces","numberplates" */}
            <select name="object" id="object" className="dropdown-select">
              <option value="faces">Faces</option>
              <option value="numberplates">Number Plates</option>
            </select>
          </div>
          <div className="dropdown">
            {/* Similarly, for anonymisation techniques, masking, blurring, replace, etc. */}
            <select name="technique" id="technique" className="dropdown-select">
              <option value="masking">Masking</option>
              <option value="blurring">Blurring</option>
              <option value="replace">Replace</option>
            </select>
          </div>
          
            {/* a process image button, with stylings */}
            <button className="process-image" onClick={handleProcess}>Process Image</button>

            
          {/* </div> */}
        </div>
      </div>
      <div className='get-files'>
        <GetFiles
          fileObj={currentFile}
          uploadStatus={isUploaded}
          email={shortEmail}
          uploadPercentage={uploadPercentage}
          recentUploaded={recentUploaded}
          updateParentState={updateParentState}
        />
      </div>
      
      <div className='status'>
        <StatusInfo uploadPercentage={uploadPercentage} isConnected={isConnected} />
      </div>
    </div>
  )
}

export default Viewer

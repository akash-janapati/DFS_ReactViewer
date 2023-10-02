import React, { useEffect, useState } from "react";
import axios, { all } from 'axios';
import OpenSeadragonViewer from "./OpenSeadragonViewer";
import './RenderFile.css'
import BarLoader from "react-spinners/BarLoader";
import { config } from "../config";
import LoadingOverlay from 'react-loading-overlay-ts';


function RenderFile(props) {
    const [viewerImage,setViewerImage] =useState();
    const [imageName,setImageName] =useState();
    const [allImagesLinks,setAllImagesLinks] = useState({});
    const [allImageName,setAllImageName] = useState([]);
    const [format,setFormat] = useState();
    const [pyramid,setPyramid] = useState({});
    const isFirstRender = React.useRef(true);
    const [outer,setOuter] = useState();
    const [isLoding, setLoading] = useState(false)

    useEffect(() => {
        const refreshInterval = setInterval(() => {
        props.getFiles()
      }, config.REFRESH_TIME)
    return () => clearInterval(refreshInterval)
    }, [])

    useEffect(()=>{    
        setAllImageName(props.info)
        if(isFirstRender.current){
            console.log("Getting image links");
            getAllImageLinks();
            if (props.info.length > 0) {
                isFirstRender.current = false;
            }
            return;
        }
        if(props.currFile != null){
            if(isFirstRender.current){
                console.log("Getting image links");
                getAllImageLinks();
                if (props.info.length > 0) {
                    isFirstRender.current = false;
                }
                return;
            }else{
                let imageObj = { imageName: props.currFile };
                axios.get(config.BASE_URL+"/getURL/"+props.email,
                {
                    params: imageObj ,
                    headers: {
                        'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
                    }
                })
                .then((response) => {
                    let name = response.data.imageName.split('.')[0];
                    let link = response.data.imageUrl;
                    setAllImagesLinks((prevValue) => ({...prevValue, [name]:link}));
                })
                .catch((error) => {
                    console.log(error);
                    return null;
                });
            }
        }else{
            setAllImagesLinks((prevFilesLink) => {
                const newLinks = {};
                for (let key in prevFilesLink) {
                  if (key !== props.deletedfilename) {
                    newLinks[key] = prevFilesLink[key];
                  }
                }        
                return newLinks;
              });
        }
    },[props.info.length]);

    async function getAllImageLinks() {
        try {
          const responses = await Promise.all(
            props.info.map((image) => {
              const imageObj = { imageName: image.name, imageFormat: image.format };
              return axios.get(config.BASE_URL + "/getURL/" + props.email, {
                params: imageObj,
                headers: {
                  Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.token,
                },
              });
            })
          );
      
          const imageLinks = {};
          responses.forEach((response) => {
            let name = response.data.imageName.split('.')[0];
            let link = response.data.imageUrl;
            imageLinks[name] = link;
          });
      
          setAllImagesLinks(imageLinks);
        } catch (error) {
          console.log(error);
        }
    }
      

    async function handleClick(e){
        setLoading(true);
        let num = e.target.id;
        const imagetype = props.info[num].format;
        const dir_ = props.info[num].name.split('.')[0]
        if(imagetype != 'png' && imagetype != 'jpeg'){
            let imageObj = { baseDir: dir_+"/temp/"+dir_+"_files/"};
            await axios.get(config.BASE_URL+"/getURL/imagePyramid/"+props.email,
                {
                    params: imageObj,
                    headers: {
                        'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
                    }
                })
                .then((response) => {
                    setOuter(response.data.outer);
                    return response.data.image;
                })
                .then((image) => {
                    setPyramid(image);
                })
                .catch((error) => {
                    console.log(error);
                    return null;
                });
        }
        setFormat(imagetype);
        setViewerImage(allImagesLinks[props.info[num].name]);
        setImageName(props.info[num]);
        setLoading(false);
    }

    function handleDelete(event,file){
        props.onDelete(event,file);
        props.getFiles()
        setViewerImage();
    }

    return(
       <div className="render-file-container">
         <div className="button-container">
                {allImageName.map((file, i) => {
                    const buttonStyles = {
                        margin: '10px',
                        backgroundImage:allImagesLinks[file.name] ? `url(${allImagesLinks[file.name]})` : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        color: '#333',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        height: '150px',
                        width: '150px', 
                    };
                    return (
                        <div>
                            <img onClick={handleClick} style={buttonStyles} key={i} id={i} />
                            <div className="name-del">
                                <p id="image-name">{file.name.split('.')[0]+'.'+ file.format}</p> 
                                <button className="del-btn"  value={file} onClick={event => handleDelete(event,file)}> <i className="bi bi-archive"></i></button>
                            </div>
                        </div> 
                    );
                })}
            </div>
            <div className="viewer-container">
                {viewerImage ? <OpenSeadragonViewer imageUrl={viewerImage} imageName={imageName} info={pyramid} format={format} outer={outer}/> : <p>Select an image to view</p>}
            </div> 
        </div>
    )
}

export default RenderFile;


    

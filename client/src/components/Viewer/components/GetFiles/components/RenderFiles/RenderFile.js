import React, { useEffect, useState } from 'react'
import axios, { all } from 'axios'
import OpenSeadragonViewer from './components/OpenSeaDragon/OpenSeadragonViewer'
import OpenSeadragonViewer2 from './components/OpenSeaDragon/OpenSeadragonViewer2'

import './RenderFile.css'
import { config } from '../../../../../Config/config'
import { toast } from 'react-toastify'
import { FaRegImages, FaImage, FaCode } from 'react-icons/fa'
import { AiFillCloseCircle, AiOutlineFileImage } from 'react-icons/ai'
import StatusInfo from '../../../../../statusInfo'
import { indexOf } from 'openseadragon'

function RenderFile(props) {
  const [viewerImage, setViewerImage] = useState()
  const [imageName, setImageName] = useState(null)
  const [allImagesLinks, setAllImagesLinks] = useState({})
  const [allImageName, setAllImageName] = useState([])
  const [previousImageNames, setPreviousImageNames] = useState(null)
  const [format, setFormat] = useState()
  const [pyramid, setPyramid] = useState({})
  const isFirstRender = React.useRef(true)
  const [outer, setOuter] = useState()
  const [isLoding, setLoading] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(true)
  const [showProcessed, setShowProcessed] = useState(false)
  const [allProccessedImages, setAllProccessedImages] = useState([])
  const [allProccessedImagesLinks, setAllProccessedImagesLinks] = useState({})
  const [thumb, setThumb] = useState(true);
  const [processedImageName, setProcessedImageName] = useState(null) // name of the processed image
  const [processedViewerImage, setProcessedViewerImage] = useState(null) // link to the processed image
  const [processedImageFormat, setProcessedImageFormat] = useState(null) // format of the processed image
  const [processedPyramid, setProcessedPyramid] = useState(null) // pyramid of the processed image
  const [processedOuter, setProcessedOuter] = useState(null) // outer of the processed image
  const [processedAvailable, setProcessedAvailable] = useState(false) // is the processed image available
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      props.getFiles()
    }, config.REFRESH_TIME)
    return () => clearInterval(refreshInterval)
  }, [])

  useEffect(() => {
    if (props.object != null && props.technique != null && imageName != null) {
      console.log("Object, Technique, and ImageName are not null");
      const object = props.object;
      const technique = props.technique;
      console.log("Object: ", object);
      console.log("Technique: ", technique);
      console.log("ImageName: ", imageName);
      const foundIndex = allProccessedImages.findIndex((image) => {
        // if object, technique, and ImageName are in the processed images.name then return it
        if (image.name.indexOf(object) !== -1 && image.name.indexOf(technique) !== -1 && image.name.indexOf(imageName.name) !== -1) {
          // return index
          // console.log("Found Image: ", image);
          return image;
        }
      })
      if (foundIndex !== -1) {
        // display the image
        console.log("Found Index: ", foundIndex);
        console.log("Found Image: ", allProccessedImages[foundIndex]);
        setProcessedImageName(allProccessedImages[foundIndex])
        setProcessedViewerImage(allProccessedImagesLinks[allProccessedImages[foundIndex].name.split('.')[0]]);
        setProcessedImageFormat(allProccessedImages[foundIndex].format);
        setProcessedAvailable(true);
        // get the pyramid
        const dir_ = allProccessedImages[foundIndex].name.split('.')[0]
        let imageObj = { baseDir: dir_ + '/temp/' + dir_ + '_files/' }
        axios
          .get(config.BASE_URL + '/getURL/imagePyramid/' + props.email, {
            params: imageObj,
            headers: {
              authorization:
                'Bearer ' +
                JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
            },
          })
          .then((response) => {
            setProcessedOuter(response.data.outer)
            return response.data.image
          })
          .then((image) => {
            setProcessedPyramid(image)
          })
          .catch((error) => {
            console.log(error)
            return null
          })

          console.log("Processed Image Found");
          // display all state variables that are set
          console.log("Processed Image Name: ", processedImageName);
          console.log("Image Name: ", imageName);

          console.log("Processed Image Link: ", processedViewerImage);
          console.log("Image Link: ", viewerImage);

          console.log("Processed Image Format: ", processedImageFormat);
          console.log("Image Format: ", format);

          console.log("Processed Image Pyramid: ", processedPyramid);
          console.log("Image Pyramid: ", pyramid);

          console.log("Processed Image Outer: ", processedOuter);
          console.log("Image Outer: ", outer);



      }
      else {
        setProcessedAvailable(false);

        console.log("Image not found");
        console.log(imageName.name);
        console.log(allProccessedImages);

      }
    }
    else {
      console.log("Object, Technique, or ImageName is null");
    }
    // console.log("Object: ", props.object);
  }
    , [props.object, props.technique, imageName])

  useEffect(() => {
    if (
      props.info.length > 0 &&
      !isFirstRender.current &&
      previousImageNames != null
    ) {
      var newImageNames = props.info.filter((newImage) => {
        return !previousImageNames.some(
          (oldImage) =>
            oldImage.name === newImage.name &&
            oldImage.format === newImage.format
        )
      })

      const removedImageNames = previousImageNames.filter((oldImage) => {
        return !props.info.some(
          (newImage) =>
            oldImage.name === newImage.name &&
            oldImage.format === newImage.format
        )
      })

      if (removedImageNames.length > 0) {
        console.log('Removed Images found:', removedImageNames)

        const updatedImageLinks = { ...allImagesLinks }
        const processedLinks = { ...allProccessedImagesLinks }

        removedImageNames.forEach((removedImageName) => {
          const indexToRemove = allImageName.findIndex(
            (imageName) =>
              imageName.name === removedImageName.name &&
              imageName.format === removedImageName.format
          )

          const processedIndexToRemove = allProccessedImages.findIndex(
            (imageName) =>
              imageName.name === removedImageName.name &&
              imageName.format === removedImageName.format
          )

          const { name, format } = removedImageName

          if (indexToRemove !== -1 && updatedImageLinks.hasOwnProperty(name)) {
            allImageName.splice(indexToRemove, 1)
            delete updatedImageLinks[name]
          }

          if (
            processedIndexToRemove !== -1 &&
            processedLinks.hasOwnProperty(name)
          ) {
            allProccessedImages.splice(processedIndexToRemove, 1)
            delete processedLinks[name]
          }
        })
        setAllImagesLinks(updatedImageLinks)
        setAllProccessedImagesLinks(processedLinks)
      }

      if (newImageNames.length > 0) {
        newImageNames = [...new Set(newImageNames)];

        console.log('New Images found:', newImageNames)



        const reversedImageNames = [...newImageNames].reverse()

        reversedImageNames.forEach((newImage) => {
          getImageLink(newImage)
        })
        toast.success('Upload Completed!')
      }
    } else {

      const temp_allProccessedImages = [...allProccessedImages]
      const temp_allImageName = [...allImageName]

      props.info.forEach((image) => {
        if (image.name.indexOf('processed') === -1) {
          temp_allImageName.push(image)
        } else {
          temp_allProccessedImages.push(image)
        }
      })

      // divide the 

      setAllImageName(temp_allImageName)
      setAllProccessedImages(temp_allProccessedImages)

    }

    setPreviousImageNames(props.info)
    if (isFirstRender.current) {
      console.log('Getting image links')
      getAllImageLinks()
      if (props.info.length > 0) {
        isFirstRender.current = false
      }
      return
    }
  }, [props.info])

  async function displayProcessedImages() {
    try {
      const object = props.object;
      const technique = props.technique;

      // search all processed images for the file name
      // processed_ + imageName + object + "_" +  technique + .png
      // if found, then display it
    } catch (error) {
      console.log(error)
    }
  }

  async function getAllImageLinks() {
    try {
      const responses = await Promise.all(
        props.info.map((image) => {
          const imageObj = { imageName: image.name, imageFormat: image.format }
          return axios.get(config.BASE_URL + '/getURL/' + props.email, {
            params: imageObj,
            headers: {
              Authorization:
                'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))?.token,
            },
          })
        })
      )

      const imageLinks = {}
      const processLinks = {}
      responses.forEach((response) => {
        let name = response.data.imageName.split('.')[0]
        let link = response.data.imageUrl
        // imageLinks[name] = link

        if (name.indexOf('processed') === -1) {
          imageLinks[name] = link
        }
        else {
          processLinks[name] = link
        }
      })

      setAllImagesLinks(imageLinks)
      setAllProccessedImagesLinks(processLinks)
    } catch (error) {
      console.log(error)
    }
  }



  async function getImageLink(image) {
    try {
      const imageObj = { imageName: image.name, imageFormat: image.format }
      const response = await axios
        .get(config.BASE_URL + '/getURL/' + props.email, {
          params: imageObj,
          headers: {
            authorization:
              'Bearer ' +
              JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
          },
        })
        .then((response) => {
          let name = response.data.imageName.split('.')[0]
          let link = response.data.imageUrl


          if (name.indexOf('processed') === -1) {
            allImagesLinks[name] = link
            allImageName.unshift(image)
          } else {
            allProccessedImagesLinks[name] = link
            allProccessedImages.unshift(image)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
    }
  }

  async function handleClick(e, thumb) {
    setLoading(true)
    let num = e.target.id
    try {
    console.log("Thumb: ", thumb);

    if (thumb) {
      const imagetype = allImageName[num].format
      const dir_ = allImageName[num].name.split('.')[0]
      if (imagetype != 'png' && imagetype != 'jpeg') {
        let imageObj = { baseDir: dir_ + '/temp/' + dir_ + '_files/' }
        await axios
          .get(config.BASE_URL + '/getURL/imagePyramid/' + props.email, {
            params: imageObj,
            headers: {
              authorization:
                'Bearer ' +
                JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
            },
          })
          .then((response) => {
            setOuter(response.data.outer)
            return response.data.image
          })
          .then((image) => {
            setPyramid(image)
          })
          .catch((error) => {
            console.log(error)
            return null
          })
      }
      setFormat(imagetype)
      setViewerImage(allImagesLinks[allImageName[num].name.split('.')[0]])
      setImageName(allImageName[num])


      // make a copy of the current image state
      let current_image_state = {
        name: allImageName[num].name,
        format: allImageName[num].format,
        link: allImagesLinks[allImageName[num].name.split('.')[0]],
      }

      console.log('Current Image State, from RenderFile', current_image_state)
      props.updateParentState(current_image_state);

      console.log('All Images Links:', allImagesLinks);
      setLoading(false)

    } else {
      console.log("Viewing Processed Image");
      const imagetype = allProccessedImages[num].format
      const dir_ = allProccessedImages[num].name.split('.')[0]
      console.log("Image Type: ", imagetype);
      console.log("Directory: ", dir_);
      console.log("Length of allProccessedImages: ", allProccessedImages.length);
      if (imagetype != 'png' && imagetype != 'jpeg') {
        console.log("Getting Image Pyramid");
        let imageObj = { baseDir: dir_ + '/temp/' + dir_ + '_files/' }
        await axios
          .get(config.BASE_URL + '/getURL/imagePyramid/' + props.email, {
            params: imageObj,
            headers: {
              authorization:
                'Bearer ' +
                JSON.parse(localStorage.getItem('dfs-user'))?.['token'],
            },
          })
          .then((response) => {
            setOuter(response.data.outer)
            return response.data.image
          })
          .then((image) => {
            setPyramid(image)
          })
          .catch((error) => {
            console.log(error)
            return null
          })

        console.log("Getting Processed Image Pyramid");
        // console.log()
      }
      setFormat(imagetype)
      setViewerImage(allProccessedImagesLinks[allProccessedImages[num].name.split('.')[0]])
      setImageName(allProccessedImages[num])
      setLoading(false)
    }
    } catch (error) {
      console.log(error)
    }

    // console.log();
  }



  function handleDelete(event, file) {
    props.onDelete(event, file)
    toast.info('Image Deleted Successfully!')
    setViewerImage()
  }

  return (
    <div className='render-file-container'>
      {showThumbnails ? (
        <div className="uploaded-images-container">
          <p>Uploaded Images</p>
          <div className='button-container'>


            {allImageName.map((file, i) => {
              const buttonStyles = {
                margin: '10px',
                backgroundImage: allImagesLinks[file.name]
                  ? `url(${allImagesLinks[file.name]})`
                  : 'none',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                color: '#333',
                objectFit: 'cover',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                height: '100px',
                width: '100px',
              }
              return (
                <div className='thumbnail-container'>
                  <img
                    className='thumnails'
                    onClick={e => { setThumb(true); handleClick(e, true) }}
                    style={buttonStyles}
                    key={i}
                    id={i}
                  />
                  <div className='name-del'>
                    <p className='image-name'>{file.name + '.' + file.format}</p>
                    <button
                      className='del-btn'
                      value={file}
                      onClick={(event) => handleDelete(event, file)}
                    >
                      {' '}
                      <i className='bi bi-archive'></i>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <></>
      )
      }

      {showProcessed ? (
        <div className="uploaded-images-container">
          <p className="part-title">Processed Images</p>

          <div className='button-container'>
            {allProccessedImages.map((file, i) => {
              const buttonStyles = {
                margin: '10px',
                backgroundImage: allProccessedImagesLinks[file.name]
                  ? `url(${allProccessedImagesLinks[file.name]})`
                  : 'none',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                color: '#333',
                objectFit: 'cover',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                height: '100px',
                width: '100px',
              }
              return (
                <div className='thumbnail-container'>
                  <img
                    className='thumnails'
                    onClick={(e) => { console.log(e.target.id);setThumb(false); handleClick(e, false) }}
                    style={buttonStyles}
                    key={i}
                    id={i}
                  />
                  <div className='name-del'>
                    <p className='image-name'>{file.name + '.' + file.format}</p>
                    <button
                      className='del-btn'
                      value={file}
                      onClick={(event) => handleDelete(event, file)}
                    >
                      {' '}
                      <i className='bi bi-archive'></i>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {showThumbnails ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AiFillCloseCircle
              title='Hide Thumbnails'
              onClick={() => {
                setShowThumbnails(!showThumbnails)
              }}
              style={{ height: '30px', width: '30px', margin: '10px' }}
            />

          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <FaRegImages
              title='Show Thumbnails'
              onClick={() => {
                setShowThumbnails(!showThumbnails)
              }}
              style={{
                height: '30px',
                width: '30px',
                margin: '10px',

              }}
            />

          </div>
        )}

        {showProcessed ? (

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AiFillCloseCircle
              title='Hide Processed'
              onClick={() => {
                setShowProcessed(!showProcessed)
              }}
              style={{ height: '30px', width: '30px', margin: '10px' }}
            />

          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <FaCode
              title='Show Processed'
              onClick={() => {
                setShowProcessed(!showProcessed)
              }}
              style={{
                height: '30px',
                width: '30px',
                margin: '10px',

              }}
            />

          </div>
        )

        }
      </div>


      <div className='viewer-container'>
        <p id='viewer-image-name'>
          {viewerImage ? imageName.name + '.' + imageName.format : ' '}
        </p>
        {viewerImage ? (
          // <>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '1' }}>
              <OpenSeadragonViewer
                imageUrl={viewerImage}
                imageName={imageName}
                info={pyramid}
                format={format}
                outer={outer}
              />
            </div>
            {/* if processedAvailable */}
            {processedAvailable && thumb? (
              <div style={{ flex: '1' }}>
                <OpenSeadragonViewer2
                  imageUrl={processedViewerImage}
                  imageName={imageName}
                  info={processedPyramid}
                  format={processedImageFormat}
                  outer={processedOuter}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          // {/* </> */}
        ) : (
          <p>Select an image to view</p>
        )}
      </div>
      {/* <div className='status'>
        <StatusInfo uploadPercentage={props.uploadPercentage}/>  
      </div> */}
    </div>
  )
}


export default RenderFile 
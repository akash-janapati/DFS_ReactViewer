import express from 'express';
const router = express.Router();
const app = express();
import cors from 'cors';
import bodyParser from "body-parser";
app.use(cors());
app.use(bodyParser.json());
import { minioClient } from '../minioConfig.js';

router.get("/:url",async function(req,res){
    try{
        const bucketName = req.params.url;
        const {imageName,imageFormat} = req.query;
        const imageUrl = await minioClient.presignedGetObject(bucketName, "thumbnail/"+imageName+".png", 60*60);
        const imageURL = {image : imageUrl};
        res.json(imageURL);
    }catch(err){
        console.log(err.message);
        res.send({err})
    }
})

function extractSignatureFromURL(url) {
    const signatureRegex = /X-Amz-Signature=([a-fA-F0-9]+)/;
    const match = url.match(signatureRegex);
    return match ? match[1] : null;
}

function extractValueFromObjectName(objectName) {
    const regex = /\/([^/]+)\/([^/]+)\.jpeg$/;
    const match = objectName.match(regex);
  
    if (match) {
      const extractedValue = `${match[1]}/${match[2]}`;
      return extractedValue;
    } else {
      return null;
    }
}

function extractDateFromURL(url) {
    const dateRegex = /X-Amz-Date=(\d{8}T\d{6}Z)/;
    const match = url.match(dateRegex);
    return match ? match[1] : null;
}

function extractCredentialFromURL(url) {
    const regex = /X-Amz-Credential=([^&]+)/;
    const match = url.match(regex);
  
    if (match) {
        const extractedValue = match[1];
        return extractedValue;
    } else {
        return null;
    }
}


router.get("/imagePyramid/:url",function(req,res){
    try {
        const bucketName = req.params.url
        const {baseDir} = req.query
        console.log(baseDir)
        const objects = [];
        const stream = minioClient.listObjects(bucketName, `${baseDir}`, true); 
  
        let directoryCount = 0;
        stream.on('data', (obj) => {
            objects.push(obj);
        });
  
        stream.on('end', async () => {
            const presignedURLs = [];
            const data = {};
            for(const obj of objects) {
                const objectName = obj.name;
                console.log(objectName);
                const presignedURL = await minioClient.presignedGetObject(bucketName, objectName, 60 * 60 * 50);
                const extractedValue = extractValueFromObjectName(objectName);
                const date = extractDateFromURL(presignedURL);
                presignedURLs.push(presignedURL);
                const signature = extractSignatureFromURL(presignedURL);
                const credential = extractCredentialFromURL(presignedURL);
                data[extractedValue]=[signature,date,credential];
            }
            console.log(presignedURLs[0]);
            try{
                const imageURL = {image : data,outer:presignedURLs[0]};
                res.json(imageURL);
            }catch(err){
                console.log(err.message);
                res.send({err})
            }   
        });
  
  
    }catch (error) {
        console.error('Error generating presigned URLs:', error);
        throw error;
    }
})

export default router;
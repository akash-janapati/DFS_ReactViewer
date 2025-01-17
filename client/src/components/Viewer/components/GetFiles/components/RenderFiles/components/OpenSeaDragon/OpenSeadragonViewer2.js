import React, {useState,useEffect} from "react";
import OpenSeadragon from "openseadragon";
import './OpenSeadragon.css';

function OpenSeadragonViewer2({imageName,imageUrl,info,format,outer}) {
        let viewer;
        useEffect(() => {
          if(format == 'png' || format == 'jpeg')
          {
            viewer =OpenSeadragon({
              id: 'openseadragon-viewer2',
              prefixUrl:' https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/',
              tileSources: {
                    type: 'image',
                    url:  imageUrl,
                    buildPyramid: false
              },
              animationTime: 0.5,
              blendTime: 0.1,
              constrainDuringPan: true,
              maxZoomPixelRatio: 2,
              minZoomLevel: 1,
              visibilityRatio: 1,
              zoomPerScroll: 2,
              showNavigator:  true,
              ajaxWithCredentials: true,
              sequenceMode:true,
              crossOriginPolicy: "Anonymous"
            });
          }
          else{
          viewer =OpenSeadragon({
            id: 'openseadragon-viewer2',
            prefixUrl:' https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/',
            tileSources: {
                width: 28480,
                height: 28760,
                tileSize: 512,
                tileOverlap: 0,
                getTileUrl: function(level, x, y) {
                  if(info[level+"/"+x+"_"+y] != undefined){
                    let signature = info[level+"/"+x+"_"+y][0];
                    let date = info[level+"/"+x+"_"+y][1];
                    let credential = info[level+"/"+x+"_"+y][2];
                    let startLink = outer.split('_files')[0];

                    // console.log(startLink+"_files/"+level+"/"+x+"_"+y+".jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential="+credential +"&X-Amz-Date="+date+"&X-Amz-Expires=180000&X-Amz-SignedHeaders=host&X-Amz-Signature="+signature)
      
                    return [startLink+"_files/"+level+"/"+x+"_"+y+".jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential="+credential +"&X-Amz-Date="+date+"&X-Amz-Expires=180000&X-Amz-SignedHeaders=host&X-Amz-Signature="+signature].join('');
                  }
                }
            },          
            animationTime: 0.5,
            blendTime: 0.1,
            constrainDuringPan: true,
            maxZoomPixelRatio: 2,
            minZoomLevel: 1,
            visibilityRatio: 1,
            zoomPerScroll: 2,
            showNavigator:  true,
            ajaxWithCredentials: true,
            sequenceMode:true,
            crossOriginPolicy: "Anonymous"
          });
        }
        return () => {
          viewer && viewer.destroy();
        };
          
        }, [imageUrl,outer]);

      function takeSS(){
        let extension = imageName.split('.').pop();
        if(extension === 'tif') extension ='png';
        var current_view = document.getElementsByTagName("canvas");
        if (current_view){
          // console.log(current_view.length);
          var my_view = current_view[0];
          var img = my_view.toDataURL("image/"+extension);
          const link = document.createElement('a')
          link.href = img
          link.download = imageName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } 

      
      

    return ( 
      <div>
        {/* <button onClick={takeSS} id="print-view" >Print View</button> */}
        <div id="openseadragon-viewer2" ></div>
      </div>
    )
}

export default OpenSeadragonViewer2;


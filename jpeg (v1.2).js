"use strict";

/*

function draw (mcu,ctx,width){
       let m= 1,n=0;
       
    //  ctx.font="6px arial ";
       
       
       const rem = ((width%8)== 0)? 0 : 8-(width%8);
       const verticalMcu =(rem+width)/8;// Math.round(width/8);
       console.log(verticalMcu);
       let spacex  =0,spacey=8;
       for(let x= 0; x <  mcu.length-1 ;x++){
              
              
              
             
                 if((x)%(verticalMcu)== 0 ){
                     n++;
                     m=1;
                 spacey+=7;
                  spacex=0;   
                }
                
                let originX= m * 8;
                let originY= n * 8;
                
              //  ctx.fillText(x,originX+spacex,originY+spacey-1);
                
                
       for (let j= 0 ; j < 8; j++){
              
              for(let i = 0 ; i < 8; i++){
                     ctx.fillStyle ="rgb("+mcu[x][j][i]+","+mcu[x][j][i]+","+mcu[x][j][i]+")";
                     
                   spacex=0;spacey=0;
                     ctx.fillRect((originX+i+spacex),(originY+j+spacey),1,1);
                    /* if(mcu[x][j][i] == 0 || mcu[x][j][i]== undefined || mcu[x][j][i] == NaN){
                     console.log("h");
                     } ////////////
                    
              }
            
              
       }
       spacex+=7;
       m++;
       
       }
      
      
}

*/






function draw (mcu,ctxArray,sof){
       
       const ctx = ctxArray[0];
       
       
       
       let x = new Array(), y =new Array();
    
       const width = (sof.width >= sof.height)? sof.width : sof.height;
       
       const rem = ((width%8)== 0)? 0 : 8-(width%8);
       const horizontalMcuI =((rem+width)/8);// Math.round(width/8);
       
       let originY=0,originX=0;
       
       const xSub = sof.idFactorTable[1].horizontalSampleFactor * 8, ySub = sof.idFactorTable[1].verticalSampleFactor *8;
       const xSubBl = xSub/8 ;
       const remSub =  ((horizontalMcuI%xSubBl)== 0)? 0 : xSubBl-(horizontalMcuI%xSubBl);
       const horizontalMcu = horizontalMcuI+remSub;
       
       let tempOrgX = -8 , tempOrgY = 0 ;
       
       
       
       
       function updateOrigin() {
              
              
              const oneUnit = 8 ;
              
              tempOrgX += oneUnit;
              
          // tempOrgY  = (tempOrgX > xSub)? 0 : tempOrgY+=oneUnit;
              
              if ( tempOrgX >= xSub ){
                     
                     tempOrgY += oneUnit;
                     tempOrgX = 0;
                     
              }
              
              if(tempOrgY >= ySub){
                     
                     tempOrgY = 0;
                     
                     originX += xSub ;
                     
              }
              
              if ( horizontalMcu <= (originX+tempOrgX)/8) {
                  originX = 0;
                  tempOrgX = 0;
                  originY += ySub;
              }
              /*
              x.push(tempOrgX+originX);
              y.push(tempOrgY+originY);
              */
              
              
       }
       
       
       
       
       
       
       for(let x= 0; x <  mcu.length-1 ;x++){
              
           
           
                     
           updateOrigin( );   
             

                
       for (let j= 0 ; j < 8; j++){
              
              for(let i = 0 ; i < 8; i++){
                     ctx.fillStyle ="rgb("+mcu[x][j][i]+","+mcu[x][j][i]+","+mcu[x][j][i]+")";
                     
                  
                     ctx.fillRect((tempOrgX+originX+i),(tempOrgY+originY+j),1,1);
      
                    
              }
            
              
       }
           
       
       
     
   
       
   }
      
      
      
      
 //console.log(x);
 //console.log(y);
      
}




























async function jpeg(url,ctx){
   
   const response = await fetch(url);
       
       if (!response.ok) {
       console.log("fetch status: "+
       response.statusText+" \ncheck filepath");
       }
       
   const file= await response.blob();
   const Reader= new FileReader();
       
   Reader.readAsArrayBuffer(file);


Reader.onload = ()=> {
       const jfif_File= new Uint8Array(Reader.result);
       const jfif = main(jfif_File);
       const sof = jfif[0].sof;
       const mcu = jfif[1];
    draw(mcu,ctx,sof);
       }

}



function showError(message) {
       
     console.log(message);
       
}



   
       
     




function parseJfif(jfif_File) {

             
        const jfif = {
               
               app0 :{ 
                      signature : 0 ,
                      version : 0,
                      pixelDensityUnit : 0,
                      horizontalPixelDensity : 0,
                      verticalPixelDensity : 0,
                      horizontalPixelCountThumbnail :0 ,
                      verticalPixelCountThumbnail : 0 ,
                      thumbnailData : [] 
               },
               dqt  :{
                      
                      
                    0:{
                      precision : 0 ,
                      quantTable : []
                     },
                      
                      
                   1:{ 
                      precision : 0 ,
                      quantTable : []
                     },
                     
                    2:{ 
                      precision : 0 ,
                      quantTable : []
                     },
                     
                     3:{ 
                      precision : 0 ,
                      quantTable : []
                     }
                   
               },
               dri  :{
                     restartInterval : 0
               } ,
               sof  :{
                      precision : 0,
                      height : 0 ,
                      width : 0,
                      component :0 ,
                      idFactorTable: {
                           /*lumY*/ 1:{
                                    horizontalSampleFactor : 0, 
                                    verticalSampleFactor : 0,
                                    quantTableNum : 0
                                    
                                    } ,
                           /*chromCb*/ 2:{
                                    horizontalSampleFactor : 0 , 
                                    verticalSampleFactor : 0,
                                    quantTableNum :0 
                                    
                             } ,
                           /*chromCr*/ 3:{
                                    horizontalSampleFactor :0 , 
                                    verticalSampleFactor : 0,
                                    quantTableNum : 0
                             }
                      }
               } ,
               dht  :{ 
                   /* dc*/ 0: {
                              // tableDestination : [],
                             0:{
                                    codeLengths:[],
                                    symbols:[],
                                    codes:[]
                             },
                             1:{
                                    codeLengths:[],
                                    symbols:[],
                                    codes:[]
                             },
                             2:{
                                    codeLengths:[],
                                    symbols:[],
                                    codes:[]
                             },
                             3:{
                                    codeLengths:[],
                                    symbols:[],
                                    codes:[]
                             }
                             
                      },
                      
                   /* ac*/ 1: {
                               // tableDestination : [],
                            0:{
                                    codeLengths:[],
                                    symbols:[],
                                    codes:[]
                             },
                             1:{
                                    codeLengths:[],
                                    symbols:[],
                                    codes:[]
                             },
                             2:{
                                    codeLengths:[],
                                    symbols:[],
                                    codes:[]
                             },
                             3:{
                                    codeLengths:[],
                                    symbols:[],
                                    codes:[]
                             }
                      }
               },
               sos  : {
                      
                     totalComponents : 0 ,
                     
                     
                     componentSelect :{
                            //zero not given delibrately wait for error
                            1:{
                                  dcTableSelect: 0 ,
                                  acTableSelect: 0
                            },
                            2:{
                                  dcTableSelect: 0 ,
                                  acTableSelect: 0
                            },
                            3:{
                                  dcTableSelect: 0 ,
                                  acTableSelect: 0
                            },
                            4:{
                                  dcTableSelect: 0 ,
                                  acTableSelect: 0
                            }
                            
                     },
                     
                     
                     
                     
                     startSpectral:0 ,
                     endSpectral :0 ,
                     successiveApproxHi : 0,
                     successiveApproxLo: 0
                     
                      
               } ,
               
               
               ecs : [],
               
               
               
              
        } ; 
      
        const segment = { 
             byteIndex: 0,
             marker: 0,
             sLength: 0 };
  
  
  
  function readSegment() {
       
         segment.marker = (jfif_File[segment.byteIndex] << 8 )+ 
                                (jfif_File[segment.byteIndex+1]);
          segment.byteIndex += 2;   
          
          segment.sLength = (jfif_File[segment.byteIndex] << 8 ) + 
                                 (jfif_File[segment.byteIndex+1] );
         segment.byteIndex += 2;
  }
  
  function handleSegment() {
         
       //console.log(segment.marker.toString(16));
       const tempByteIndex = segment.byteIndex;
       
       switch (segment.marker) {
              
              case 0xFFE0 : //APP0
               {      
                   /*   signature : 4 bytes,
                      version : 0,
                      pixelDensityUnit : 0,
                      horizontalPixelDensity : 0,
                      verticalPixelDensity : 0,
                      horizontalPixelCountThumbnail :0 ,
                      verticalPixelCountThumbnail : 0 ,
                      thumbnailData : [] 
                      */
                      
                      jfif.app0.signature = 
                      jfif_File.slice(segment.byteIndex,segment.byteIndex+5).toString();
                      segment.byteIndex+=5;
                      
                      jfif.app0.version=jfif_File.slice(segment.byteIndex,segment.byteIndex+2);
                      segment.byteIndex+=2;
                      
                      jfif.app0.pixelDensityUnit = jfif_File[segment.byteIndex];
                      segment.byteIndex+=1;
                      
                      jfif.app0.horizontalPixelDensity = 
                      (jfif_File[segment.byteIndex] <<8 ) + jfif_File[segment.byteIndex+1] ;
                      segment.byteIndex+= 2;
                      
                      jfif.app0.verticalPixelDensity = 
                      (jfif_File[segment.byteIndex] <<8 ) + jfif_File[segment.byteIndex+1] ;
                      segment.byteIndex+= 2;
                      
                      jfif.app0.horizontalPixelCountThumbnail = jfif_File[segment.byteIndex] ;
                      segment.byteIndex+= 1;
                      
                      jfif.app0.verticalPixelCountThumbnail =  jfif_File[segment.byteIndex] ;
                      segment.byteIndex+= 1;
                      
                      if(jfif.app0.horizontalPixelCountThumbnail != 0){
                             
                             jfif.app0.thumbnailData = jfif_File.slice(segment.byteIndex,
                             segment.byteIndex+1+(3*jfif.app0.horizontalPixelCountThumbnail*jfif.app0.verticalPixelCountThumbnail));
                             segment.byteIndex+= 3*jfif.app0.horizontalPixelCountThumbnail*jfif.app0.verticalPixelCountThumbnail;
                      }
                      
                    
                      
                    } break;
                     
              case 0xFFDB : //DQT
               {   
                      function bit16(bit8Array) {
                      
                      const bit16Array = new Uint16Array (64) ;
                      for (let i = 0; i < 64 ;i++) {
                             
                           bit16Array[i] = (bit8Array[i*2] << 8 )+ bit8Array[(i*2)+1];
                             
                      }
                      
               return bit16Array;       
               }  while (segment.byteIndex- tempByteIndex < segment.sLength -2){
                      //specs not clear on which is lower or higher bits
                     const precision = ((jfif_File[segment.byteIndex] & 0xF0)>>4);
                     const identifier = (jfif_File[segment.byteIndex] & 0x0F);
                     
                      segment.byteIndex += 1;
                      
                      jfif.dqt[identifier].precision = precision;
                      
                      
                      if (precision == 0 ) {
                      jfif.dqt[identifier].quantTable=(jfif_File.slice(segment.byteIndex,segment.byteIndex+64));
                      segment.byteIndex += 64;
                      }
                      else if(precision == 1) {
                        
                        
                        
                  const quantArray16 = bit16(jfif_File.slice(segment.byteIndex,(2*64)+segment.byteIndex));
                     jfif.dqt[identifier].quantTable=quantArray16;
                     
                    
                     segment.byteIndex+= 2* 64 ;
                     // An 8-bit DCT-based process shall not use a 16-bit precision quantization table
                      }
                     
                   
                     if(segment.byteIndex- tempByteIndex < segment.sLength -2 ){
                            showError("Multiple Quantization table in a single marker detected and handled");
                            
                     }    
                     }
                   
                    
                     }break;
               
               case 0xFFDD : //DRI
               {    
                      
                     jfif.dri.restartInterval = (jfif_File[segment.byteIndex]<< 8 )+ jfif_File[segment.byteIndex+1];
                     segment.byteIndex+=2;
                     
                     }break;
                     
               case 0xFFC0 : //SOF
               {
                      jfif.sof.precision =jfif_File[segment.byteIndex];
                      segment.byteIndex+=1;
                      jfif.sof.width = (jfif_File[segment.byteIndex] << 8 ) + 
                                 (jfif_File[segment.byteIndex+1] );
                      segment.byteIndex+=2;
                      jfif.sof.height = (jfif_File[segment.byteIndex] << 8 ) + 
                                 (jfif_File[segment.byteIndex+1] );
                      segment.byteIndex+=2;
                      
                      jfif.sof.component =jfif_File[segment.byteIndex];
                      segment.byteIndex+=1;
                      
                      for(let i=0 ; i< jfif.sof.component ; i++) {
                             
                         const  componentIdentifier=jfif_File[segment.byteIndex]
                         segment.byteIndex+=1;// component  
                         
                         
                      jfif.sof.idFactorTable[componentIdentifier].horizontalSampleFactor=jfif_File[segment.byteIndex] & 0x0F;
                      
                      jfif.sof.idFactorTable[componentIdentifier].verticalSampleFactor=((jfif_File[segment.byteIndex] & 0xF0)>>4);
                      segment.byteIndex+=1;
                      jfif.sof.idFactorTable[componentIdentifier].quantTableNum=jfif_File[segment.byteIndex];
                      segment.byteIndex+=1;
                      
                      }
                      }break;
                      
               case 0xFFC4 : //DHT
               {
                  

                      while (segment.byteIndex- tempByteIndex < segment.sLength -2) {
                             
                   const tableClass = ((jfif_File[segment.byteIndex] & 0xF0)>>4);
                   const identifier = jfif_File[segment.byteIndex] & 0x0F;
                   segment.byteIndex+=1;
                   
               //    jfif.dht[tableClass].td.push(identifier);
                   jfif.dht[tableClass][identifier].codeLengths = new Uint8Array(jfif_File.slice(segment.byteIndex,segment.byteIndex+16));
                   segment.byteIndex+=16;
                   
                   const codeLengths= new Uint8Array(jfif.dht[tableClass][identifier].codeLengths)
                   
                   
                  for(let i = 0; i < 16 ; i++){
                         
                     if(codeLengths[i] != 0)  {
                          jfif.dht[tableClass][identifier].symbols.push(
                                 new Uint8Array(jfif_File.slice(
                                        segment.byteIndex,segment.byteIndex+codeLengths[i]
                                        )
                                      )
                                     );   
                       } 
                       else  {
                     jfif.dht[tableClass][identifier].symbols.push(0) ;
                      
                       }
                   segment.byteIndex+=codeLengths[i];
                          }
                       } 
                       
                     } break;
               
               case 0xFFDA : //SOS
               {
                   jfif.sos.totalComponents =jfif_File[segment.byteIndex];
                   segment.byteIndex+=1;
                   
                   for (let i = 0; i < jfif.sos.totalComponents; i++){
                 
                 const componentId = jfif_File[segment.byteIndex];
                 segment.byteIndex+=1;
                 
                     jfif.sos.componentSelect[componentId].dcTableSelect = ((jfif_File[segment.byteIndex] & 0xF0)>>4);
                     jfif.sos.componentSelect[componentId].acTableSelect = (jfif_File[segment.byteIndex] & 0x0F) ;  
                     segment.byteIndex+=1;
                   }   
                   
                   jfif.sos.startSpectral=jfif_File[segment.byteIndex];
                   segment.byteIndex+=1;
                   jfif.sos.endSpectral=jfif_File[segment.byteIndex];
                   
                   jfif.sos.successiveApproxHi =((jfif_File[segment.byteIndex] & 0xF0) >>4);
                   jfif.sos.successiveApproxLo =(jfif_File[segment.byteIndex] & 0x0F);
                     segment.byteIndex+=1; 
                     
                     jfif.ecs = jfif_File.slice(segment.byteIndex,jfif_File.length) ;
                     
                     }break;
                    
                     
               default : {
               showError("Unhandled marker - "+segment.marker.toString(16));
               segment.byteIndex +=  segment.sLength -2 ;
               }
               break;
              
       }
  }
  
             {
     segment.marker = (jfif_File[0] << 8) + (jfif_File[1] );
     console.log(segment.marker);
      if ( segment.marker != 0xFFD8 ) {
             showError("Start of image marker(SOI) missing");
             return 0;
             
      }
      
      segment.byteIndex += 2;//skip SOI marker
             }
     while ( (segment.marker != 0xFFDA ) &&
                (segment.marker != 0xDDDD ) &&
               (segment.byteIndex < jfif_File.length) )
     {
           
         readSegment();
         handleSegment();
         
       }
   
   
      return jfif;
}



function generateHuffmanCodes(jfif){
       
       for(let i = 0 ; i < 2 ; i++){
              
              for(let j = 0; j < jfif.sof.component; j++ ){
                     
                       jfif.dht[i][j].codes.push(0);
                     
                     for(let k = 1; k < 16; k++){
                            
                            
                      
                                
                            jfif.dht[i][j].codes.push(((jfif.dht[i][j].codes[k-1]+jfif.dht[i][j].codeLengths[k-1])<<1));
                                
                         
                            
                            
                     }
                     
                     
              }
              
              
       }
       
       
       
    return jfif;
}



function decode(jfif) {
    
const errorPara = {
       
       numOfNoMatch : 0
       
       
}



const ecs = jfif.ecs;

const state = {
       byteIndex : 0,
       bitIndex : 7,
       
       resetDC:0,
       
       mcu : 0,
       mcud : 0,
       
       exit : 0
       
       
}

const mcu = {
       //lum
        1:[],
      //cb 
        2:[],
      //cr
        3:[]
       
}


function setIndex(){
       
       state.bitIndex = 8;
       state.byteIndex++;
       
       if((ecs[state.byteIndex-1] == 0xFF)&(ecs[state.byteIndex]==0x00))
       {
            
             state.byteIndex++;
       }
       
       
}




function readBit(n){
       
       let readWord = 0;
       
       const sign =((ecs[state.byteIndex]>> state.bitIndex) &( 0x01 ));
      
      
              
       
       
       
       if(sign == 1){
              
       for (let i = 0 ; i < n ; i++){
              
             
             readWord = ((ecs[state.byteIndex] >> state.bitIndex) & (0x01)) + (readWord << 1);
            
              if(state.bitIndex == 0){
                 setIndex();
              }
              state.bitIndex--;
       }
       return readWord;
       }
       else {
              
              
             for (let i = 0 ; i < n ; i++){
              
             
             const  invertBit = (((ecs[state.byteIndex] >> state.bitIndex) & (0x01)) == 1)? 0 : 1 ;
             readWord = (invertBit) + ( readWord <<1);

              if(state.bitIndex == 0){
                 setIndex();
              }
              state.bitIndex--;
       } 
              

       return (readWord) * -1;       
              
       }
       
      
      
       
       
}


function getMatch(firstCodes,codeLengths,symbolTable,tableClass){
       
       let readHuffBit = 0;
      
       let symbol = 0;
       
       for (let i = 0 ; i < 16 ; i++){
              
             readHuffBit = ((ecs[state.byteIndex] >> state.bitIndex) & (0x01)) + (readHuffBit << 1);
            
             
             
            
              if(state.bitIndex == 0){
                 
                 setIndex();
                 
              }
              state.bitIndex--;
              
              if (codeLengths[i] != 0){
                   const difference =  (readHuffBit - firstCodes[i]);
                     if(difference < symbolTable[i].length){
                        
                                 
                                 
                           symbol = symbolTable[i][difference];
                           
                           
                           return symbol;
                            
                     }

                     
                     
                     
                     
              }
              
              
            
              
       }
       errorPara.numOfNoMatch++;
       if(errorPara.numOfNoMatch== 1){
              
     console.log("/*****start********/");
     
     console.log("no match at byte index : "+ state.byteIndex+" mcu no : "+state.mcu+" mcu absolute no : "+state.mcud);
     console.log("Current Bit Index : "+state.bitIndex);
     
     const id = (tableClass==0)? "DC" : "AC";
     console.log("Table class : "+ id);
     
     console.log("current read byte : " +ecs[state.byteIndex]);
     console.log(ecs.slice(state.byteIndex-3,state.byteIndex+3));
     console.log("/********end********/");
       }
       
       
       return 69;
       
}









function getMcu(componentID,comPara){
      
       
      
      
      
      
      
       let tempMcu = new Array (64);
       const quantTable= jfif.dqt[comPara].quantTable;
       let symbol = 0;
       
       
       //DC coefficient
       {
       const tableClass = 0;
       const firstCodes= jfif.dht[tableClass][comPara].codes;
       const codeLengths = jfif.dht[tableClass][comPara].codeLengths;
       const symbolTable = jfif.dht[tableClass][comPara].symbols;
       
       symbol = getMatch(firstCodes,codeLengths,symbolTable,tableClass);
        
         if(symbol != 0){  symbol =  readBit(symbol);}
         
         let actualSymbol =symbol;
                    
                    
                   if((mcu[componentID].length >1 ) &(state.resetDC !=1)){
                 
              actualSymbol = symbol + ((mcu[componentID][mcu[componentID].length -1][0])/ quantTable[0]);
          }
       
                    
                         tempMcu[0] =actualSymbol * quantTable[0];
                        
         
         
       
       }
       
       
       
       {
       
       
       const tableClass = 1;
       const firstCodes= jfif.dht[tableClass][comPara].codes;
       const codeLengths = jfif.dht[tableClass][comPara].codeLengths;
       const symbolTable = jfif.dht[tableClass][comPara].symbols;
       
      
       
       
       
       
       for(let i= 1 ; i < 64 ;){
             
           symbol = getMatch(firstCodes,codeLengths,symbolTable,tableClass);
              
            
            
             if(i != 0 ){
                   const rNibble = (symbol>>4 & 0x0F);
                   const sNibble =(symbol & 0x0F);
                 
                 if(rNibble == 0 & sNibble == 0){ 
                        tempMcu.fill(0,i,64) ;
                    
                         break;
                         //EOB
                      }   else if(rNibble == 0x0F & sNibble == 0){
                             tempMcu.fill(0,i,i+16);
                             i+=16;
                           
                      }else {
                             
                          const actualSymbol = readBit(sNibble);
                          tempMcu.fill(0,i,i+rNibble);
                          i+=rNibble;
                        
                         tempMcu[i] = actualSymbol * quantTable[i];
                       
                           i++;
                        
                      }
                    
             }
           
                      
       }
       
   }
   
    
       return tempMcu;
}



while (state.exit != 1){
       
       
       
       /*
       
       let z=0;
       
       for (let i = 1; i <= jfif.sos.totalComponents ; i++) {
        z= (i==1) ? 0 : 1;  
        
        if(i==1){
       mcu[i].push(getMcu(i,z));
       mcu[i].push(getMcu(i,z));
       mcu[i].push(getMcu(i,z));
       mcu[i].push(getMcu(i,z));
       
       
        }else{
        mcu[i].push(getMcu(i,z));
        }
        */
        
        
        
        
        /*************
         EXPERIMENTAL CODE START !!!
         ***************/
        const idTable = jfif.sof.idFactorTable;
        const lum_Num = idTable[1].horizontalSampleFactor * idTable[1].verticalSampleFactor ,
                        cb_Num = idTable[2].horizontalSampleFactor * idTable[2].verticalSampleFactor, 
                        cr_Num = idTable[3].horizontalSampleFactor * idTable[3].verticalSampleFactor ;
        const totalBlockTable = new Array (0,lum_Num,cb_Num,cr_Num);
        
        const DhtTableIdentifier = jfif.sos.componentSelect;
        
        
        
        
        for (let i = 1; i <= jfif.sos.totalComponents ; i++) {
               const DhtTableSelect = DhtTableIdentifier[i].dcTableSelect;
               for(let blockNum = 0 ; blockNum < totalBlockTable[i] ; blockNum++){
                      
                      mcu[i].push(getMcu(i,DhtTableSelect));
                      
               }
               
               
        }
        
        
        
        
       
        /*************
         EXPERIMENTAL CODE END!!!
         ***************/
        
        
       if(state.byteIndex > ecs.length){
              state.exit=1;
       }
       
     //}
     
     state.mcu++;
     
    
    
     if(jfif.dri.restartInterval !=0 & jfif.dri.restartInterval ==state.mcu)
     {
            
            
            if(state.bitIndex !=8){
                   
                   state.bitIndex = 8;
                   state.byteIndex+=3;
                   
            }
            else{
                   state.byteIndex+=2;
                   
                   
            }
            
     
       
}





}



return  mcu;

}







function main(jfif_File){
       
       const jfif =generateHuffmanCodes(parseJfif(jfif_File));
       
       console.log(jfif);
      
       const imageData = decode(jfif);
       
       console.log(imageData);
       const luminance=inverseFt(imageData[1]);
       
       //de-Subsampling step here
       
       
       return  [jfif,luminance];
     
       
}





function inverseFt(mcu){
     
      
       let luminance= new Array();
       const unZigZag = 
       [
        [0,1,5,6,14,15,27,28],
        [2,4,7,13,16,26,29,42],
        [3,8,12,17,25,30,41,43],
        [9,11,18,24,31,40,44,53],
        [10,19,23,32,39,45,52,54],
        [20,22,33,38,46,51,55,60],
        [21,34,37,47,50,56,59,61],
        [35,36,48,49,57,58,62,63]
        ];
       
       
       for (let x  = 0 ; x < mcu.length ; x++){
              let mcuSingle = mcu[x];
              let lumBlock = new Array (8);
              
              for(let j = 0 ; j < 8 ; j++){  //y
                     let row = new Array();
                     for(let i = 0 ; i < 8 ; i++){ //x
                           let f = 0;
                           let sumV = 0;
                           
                            for(let v = 0 ; v < 8 ; v++){ 
                                
                                  const cosjv = Math.cos(((((2*j)+1)*v*Math.PI)/16));
                                  const lamV = (v == 0 )? 0.7071067812 : 1;
                                  let sumU = 0;
                                 for(let u = 0 ; u < 8 ; u++){ 
                                     const guv = mcuSingle[unZigZag[v][u]];
                                     const lamU = (u == 0 )? 0.7071067812 : 1;
                                     const cosiu = Math.cos(((((2*i)+1)*u*Math.PI)/16));
                                     
                                     sumU += (guv*lamU*cosiu);
                                     
                                     
                                     
                                    
                                 }
                     
                                sumV += (sumU * lamV *cosjv);
                     
                          }
                            
                           f = sumV * (1/4);
                           
                        
                           row.push(f+128);// Math.min(Math.max( (f+128) ,0),255 ));
                     }
                     
                     
                     lumBlock[j]= row;
                     
                     
              }
              
              
              luminance.push(lumBlock);
              
       }

       return luminance;
}
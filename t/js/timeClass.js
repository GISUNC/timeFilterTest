var elEvt = undefined
// to do 
// change the method for creating the pieArrays
// remove text-above-circle when creating pie. 
// replace the name leafTiles to imgTiles
var TF = { //time filters to manage tiles of different years
    start: function(containerDIV,tileArray,svgType, options) {
        this.divContainer = containerDIV;
        this.leafTiles = tileArray;
        this.assignNamesToDiv(containerDIV);
        if (this.leaflet == true) {
            this.startLeafDiv(); 
            this.joinAllLeafDiv()
        }
        if (this.leaflet == false) {this.assingImgToDivs(tileArray)}
        if (svgType == null) {this.svgType = "circle" } else {this.svgType = svgType};
        this.makeSVG()
        this.addListerners()
        this.listenResize()  
        this.arrayObj.push(this.returnObj())
        this.counter =  this.counter + 1

    },
    arrayObj: [],
    returnObj: function(){
        let _ = this;
        const tF = {
            counter:_.counter,
            divContainer: _.divContainer,
            svgParentName: _.svgParentName,
            pieArray: _.pieArray,
            contDiv: _.contDiv,
            divNames: _.divNames,
            leafTiles: _.leafTiles,
            filterNames: _.filterNames,
            zoom: _.zoom,
            center: _.center,
            leaflet: _.leaflet,
            static: _.static,
            text:_.text,
            textMask:_.textMask,
            namesInDiv:_.namesInDiv,
            windowDimension:_.windowDimension
        };
        // there has to be a better way // but if I copy an entire object it has a pointer that 
        tF.windowDimension = Object.assign({},_.windowDimension)
        tF.divDimension = Object.assign({},_.divDimension)
        return  tF//Object.assign(tF, _.divDimension)
    },
    objName: 'TF',//'timeF3',
    divContainer: "daMap",
    svgParentName: undefined,
    counter:0,
    update: true,
    pieArray: [],
    contDivAssigned: false,
    contDiv: null, // the container div 
    divNames : [], // array with the names of the divs which for example could be the date. No spaces allowed.
    leafTiles: [], // array with the address to tiles or images 
    filterNames: [],// array with the the names for the filters if needed and allows spaces 
    zoom: 17, // the leaflet zoom 
    center: [18, -65,], // the leaflet map center
    classType: "timeFdiv", // class assigned to the div in the container 
    leafMaps: [], // array where the leaflet maps are saved 
    leafList: [],
    leaflet: true, // true to work with leaflet tiles instead of static
    static: false,
    text:true,
    textMask:false,
    namesInDiv : false,
    windowDimension: {wX:window.innerWidth, wY:window.innerHeight },
    divDimension: { width:"", height:"",xCenter:"",yCenter:"",r:"", fontSize:20, xProp:.5, yProp:.5},
    toRadians: function(angle) {return angle * (Math.PI / 180);},
    toDegrees: function(angle) {return angle * (180 / Math.PI);},
    assingImgToDivs: function(imgSrcArray){
        if (this.divNames.length == 0) {this.assignNamesToDiv()}
        if (this.divNames.length != imgSrcArray.length) {return console.log("array size different from div names")}
        if (imgSrcArray == null && this.leafTiles.length > 0) {imgSrcArray = this.leafTiles}
        if (imgSrcArray.length > 0) {this.leafTiles = imgSrcArray}
        for (i=0; i<this.divNames.length; i++){
            var daInnerHTML = '<img id="img_' + this.divNames[i] + '" src= '+ imgSrcArray[i] + ' class= "timeFimg" style="max-width:100%; max-height:100%; position:absolute; overflow: hidden"></img>'
            document.getElementById(this.divNames[i]).innerHTML = daInnerHTML;
        }
    },
    startLeafDiv: function(){
                        if (this.namesInDiv == false) {return console.log("no div names")}
                        for (i=0;i<this.divNames.length;i++){
                            this.assignTilesToDivs(this.divNames[i], this.leafTiles[i], i)
                        }    
                    },

    joinAllLeafDiv: function(){ 
                        for (i=0; i < this.leafMaps.length; i++){
                            for (j=0; j<this.leafMaps.length;j++){
                                if (i == j) {continue;}
                                this.leafMaps[i].sync(this.leafMaps[j])
                            }
                        }
                    },
    assignNamesToDiv: function(containerDIVid){
                            // if (containerDIVid == undefined && this.divContainer) {
                            //     this.contDiv = document.getElementById(this.divContainer)
                            //     }
                            if (containerDIVid) {
                                this.divContainer = containerDIVid;
                                this.contDiv = document.getElementById(containerDIVid)
                                if (this.contDiv == null) {return console.log("no div whith that ID")} } //else { this.contDivAssigned = true}
                            this.divNamesFunction()
                            if (this.namesInDiv == true) {return true}
                            for (var i = 0; i < this.divNames.length; i++)
                            {
                                var iDiv = document.createElement('div');
                                iDiv.setAttributeNS(null, 'id', this.divNames[i]);
                                iDiv.setAttributeNS(null, 'class', this.classType);
                                this.contDiv.appendChild(iDiv)
                            }
                            this.namesInDiv = true;
                            this.calcDivDimensions();
                        },
    assignTilesToDivs : function(iDIV, iTile, i){
        
        let leafMap = L.map(iDIV, { zoomControl: false , attributionControl: false,}).setView(this.center, this.zoom);
        L.tileLayer(iTile, {} ).addTo(leafMap);
        this.leafMaps[i] = leafMap;
        this.leafList.push(leafMap);
                        },

    divNamesFunction : function() {
                            if (this.divNames.length != this.leafTiles.length)
                            {for (i = 0; i < this.leafTiles.length; i++)
                                {this.divNames.push("tile" + i) }
                            }
                            else true},
    calcDivDimensions: function() {   
                            this.divDimension.width = this.contDiv.getBoundingClientRect().width;
                            this.divDimension.height = this.contDiv.getBoundingClientRect().height;
                            if(this.divDimension.height == 0)  {this.divDimension.height = Math.floor(window.innerHeight)}
                            this.divDimension.xCenter = this.divDimension.width/2;
                            this.divDimension.yCenter = this.divDimension.height/2;
                            // setting a default radio size based on the div dimension// maybe this line should be place somewhere else
                            if (this.divDimension.xCenter >= this.divDimension.yCenter && this.divDimension.r == "") {this.divDimension.r = this.divDimension.yCenter/3} else {this.divDimension.r = this.divDimension.xCenter/3}
                            
                        },
    svgArray : [],
    // haveButton: {a: true, aType: "all"}, // aTypes options: "all", "NS", "EW"
    svgType: "circle",
    svgButton:"", // svgTypes options: "circle", "pie", "circle-pie", "vertical", "horizontal",
    makeSVG : function(){ 
                    this.svgParentName = 'svgP'+this.divContainer
                    const xmlns = "http://www.w3.org/2000/svg";
                    var xText = this.divDimension.xCenter - this.divDimension.fontSize;
                    var yText = this.divDimension.yCenter - this.divDimension.fontSize - this.divDimension.r;
                     
                    //dealing with the annoying Safari I had to create an SVG that serves as a button that connects to the SVGs in the leaflet map
                    const svgParentElem = document.createElementNS(xmlns, "svg");
                    svgParentElem.setAttributeNS(null, "id", this.svgParentName);
                    svgParentElem.setAttributeNS(null, "viewBox", "0 0 " + this.divDimension.width + " " +this.divDimension.height);
                    svgParentElem.setAttributeNS(null, "style", "position: absolute; -webkit-transform: translate3d(0,0,0); -webkit-user-select: none;-moz-user-select: none;-ms-user-select: none; user-select: none; pointer-events: none; z-index: 1000");
                    /// very important to have the user-select in none, otherwise I could not interact with the background
                    var daInnerHTML = ""
                    // for the updater I will have to make a situation when it will loop by the positionArray
                    // start loop by div layers 
                    for (i=1; i<this.divNames.length; i++){
                        if(this.leaflet == true) {var iLeafMap = this.leafMaps[i]._container.getElementsByClassName("leaflet-control-container")[0]}
                        if (this.svgType == "circle" || this.svgType == "circle-pie") {
                        var xProp = i/this.divNames.length;// calculate the x location here instead of xProp
                        var yProp = 1/2;//the y prop is allowing for the svg to be placed in different places within the div
                        }
                        if (this.svgType == "horizontal") {
                            var xProp = 1/2;
                            var yProp = i/this.divNames.length;
                        }
                        if (this.svgType == "vertical") {
                            var xProp = i/this.divNames.length;
                            var yProp = 1/2;
                        }

                        const svgElem = document.createElementNS(xmlns, "svg");
                        svgElem.setAttributeNS(null, "id", "svg_"+this.divNames[i]);
                        svgElem.setAttributeNS(null, "viewBox", "0 0 " + this.divDimension.width + " " +this.divDimension.height);
                        svgElem.setAttributeNS(null, "style", "-webkit-transform: translate3d(0,0,0); -webkit-user-select: none;-moz-user-select: none;-ms-user-select: none; user-select: none; pointer-events: none; z-index: 1000");
                        if(this.leaflet == true){svgElem.setAttributeNS(null, "class", "leaflet-control upperSVG")}
                        if(this.leaflet == false){svgElem.setAttributeNS(null, "class", "upperSVG")}
                        daID = this.divNames[i];
                        var daName = daID
                        if(this.filterNames.length == this.divNames.length){daName = this.filterNames[i]}
                        
                        // var posSVG = {id:daID, x:this.divDimension.width * xProp, y:this.divDimension.height * yProp,r: this.divDimension.r};
                        // this.positionArray.push(posSVG)
                        /// The SVG witht the arrows
                        var daArrowN  = '<path id=\"daArrow_N_' + daID + '\" class=\"' + daID + ' ' + this.divContainer +' arrow Ani\" d=\"M 250 235 L253.5 241.06217782649108 L246.5 241.06217782649108 Z\" fill=\"#000\" ></path>'   // check the stroke width in the CSS since it changes with the size of the container div
                        var daArrowS  = '<path id=\"daArrow_S_' + daID + '\" class=\"' + daID + ' ' + this.divContainer +' arrow iAni\" d=\"M 250 265 L246.5 258.93782217350895 L253.5 258.93782217350895 Z\" fill=\"#000\" ></path>' 
                        var daArrowE  = '<path id=\"daArrow_E_' + daID + '\" class=\"' + daID + ' ' + this.divContainer +' arrow iAni\" d=\"M 265 250 L258.93782217350895 253.5 L258.93782217350895 246.5 Z\" fill=\"#000\" ></path>'  
                        var daArrowW  = '<path id=\"daArrow_W_' + daID + '\" class=\"' + daID + ' ' + this.divContainer +' arrow iAni\" d=\"M 235 250 L241.06217782649108 246.5 L241.06217782649108 253.5 Z\" fill=\"#000\" ></path>'  
                        
                        var svgStrokeTouch = '';
                        
                        if (this.svgType == "circle" ) {
                            svgStrokeTouch = '<circle id=\"daRadio_' + daID + '\" class=\"' + daID +  ' ' + this.divContainer +' daRadio daR radio-touch-event\" cx=\"' + (this.divDimension.width * xProp)+ '\" cy=\"' + (this.divDimension.height * yProp) + '\" r=\"' + this.divDimension.r 
                                        + '\" style=\"stroke: rgb(0, 0, 0); fill-opacity: 0; stroke-opacity: 0; cursor: pointer; stroke-width: 1%; animation: 0s ease 0s 1 normal none running none; pointer-events: stroke;' 
                                        + '\" onmousedown=\"' + this.objName + '.onMouseDown(evt)\" onmousemove=\"' + this.objName + '.onMouseMove(evt)\" onmouseup=\"' + this.objName + '.daMouseUp(evt)\" ontouchstart=\"' + this.objName + '.onMouseDown(evt)\" ontouchmove=\"' + this.objName + '.onMouseMove(evt)\" ontouchend=\"' + this.objName + '.daMouseUp(evt)\" ontouchcancel=\"' + this.objName + '.daMouseUp(evt)\"' 
                                        + '\"></circle></g>' 
                        }

                        if (this.svgType == "vertical") {
                            svgStrokeTouch = '<line id=\"daLine_' + daID + '\" class=\"' + daID + ' ' + this.divContainer +'  iAni verticalLine\" x1=\"' + (this.divDimension.width * xProp)+ '\" y1=\"' + (this.divDimension.height * 0) + '\" x2=\"' + (this.divDimension.width * xProp) + '\" y2=\"' + (this.divDimension.height) + '\" xprop=\"' + xProp + '\"' + ' yprop=\"' + yProp + '\"' 
                                        + ' style=\"stroke: rgb(0, 0, 0); stroke-opacity: .0; cursor: ew-resize; stroke-width: 5%; animation: 0s ease 0s 1 normal none running none; pointer-events: stroke;' 
                                        + '\" onmousedown=\"' + this.objName + '.onMouseDown(evt)\" onmousemove=\"' + this.objName + '.onMouseMove(evt)\" onmouseup=\"' + this.objName + '.daMouseUp(evt)\" ontouchstart=\"' + this.objName + '.onMouseDown(evt)\" ontouchmove=\"' + this.objName + '.onMouseMove(evt)\" ontouchend=\"' + this.objName + '.daMouseUp(evt)\" ontouchcancel=\"' + this.objName + '.daMouseUp(evt)\"' 
                                        + '\"></line></g>' 
                        } 

                        if (this.svgType == "horizontal") {
                            svgStrokeTouch = '<line id=\"daLine_' + daID + '\" class=\"' + daID + ' ' + this.divContainer +'  iAni verticalLine\" x1=\"' + (this.divDimension.width * 0)+ '\" y1=\"' + (this.divDimension.height * yProp) + '\" x2=\"' + (this.divDimension.width) + '\" y2=\"' + (this.divDimension.height * yProp) + '\" xprop=\"' + xProp + '\"' + ' yprop=\"' + yProp + '\"' 
                                        + ' style=\"stroke: rgb(0, 0, 0); stroke-opacity: .0; cursor: ns-resize; stroke-width: 5%; animation: 0s ease 0s 1 normal none running none; pointer-events: stroke;' 
                                        + '\" onmousedown=\"' + this.objName + '.onMouseDown(evt)\" onmousemove=\"' + this.objName + '.onMouseMove(evt)\" onmouseup=\"' + this.objName + '.daMouseUp(evt)\" ontouchstart=\"' + this.objName + '.onMouseDown(evt)\" ontouchmove=\"' + this.objName + '.onMouseMove(evt)\" ontouchend=\"' + this.objName + '.daMouseUp(evt)\" ontouchcancel=\"' + this.objName + '.daMouseUp(evt)\"' 
                                        + '\"></line></g>' 
                        } 
                        // Apply arrows depending on selection 
                        if (this.svgButton == "none"){var daArrowGroup = '';}
                        if (this.svgButton == "all"|| (this.svgButton == '' && (this.svgType == "circle" || this.svgType == "circle-pie"))) {var daArrowGroup =  daArrowN + daArrowS + daArrowE + daArrowW}
                        if (this.svgButton == "NS" || (this.svgButton == '' && this.svgType == "horizontal")) {var daArrowGroup =  daArrowN + daArrowS}
                        if (this.svgButton == "EW" || (this.svgButton == '' && this.svgType == "vertical")) {var daArrowGroup =  daArrowE + daArrowW}
                        

                        var svgButtons = '<g id=\"gUp' + daID + '\"class=\"upB\"><g  class=\"' + daID + ' ' + this.divContainer + ' daCenterSVG\"' +
                        'stroke=\"none\" stroke-width=\"4\" ' 
                        + 'style=\"pointer-events: fill; position: absolute; cursor: move;\" ' 
                        + 'onmousedown=\"' + this.objName + '.onMouseDown(evt)\" onmousemove=\"' + this.objName + '.onMouseMove(evt)\" onmouseup=\"' + this.objName + '.daMouseUp(evt)\" ontouchstart=\"' + this.objName + '.onMouseDown(evt)\" ontouchmove=\"' + this.objName + '.onMouseMove(evt)\" ontouchend=\"' + this.objName + '.daMouseUp(evt)\" ontouchcancel=\"' + this.objName + '.daMouseUp(evt)\"'     
                                       + '><circle id=\"_' + daID + '\" class=\"' + daID + ' ' + this.divContainer +' iAni daArrowCircle\"' +
                                        'xprop=\"' + xProp + '\"' + 'yprop=\"' + yProp + '\"' +
                                        'cx= \"' + (this.divDimension.width * xProp) +
                                        '\" cy= \"' + (this.divDimension.height * yProp) +
                                        '\" r=\"20\"' +
                                        '></circle>'  +
                                        '<g id=\"arrowGroup' + daID + '\" class=\"arrowGroup\" transform= \"translate('+ ((this.divDimension.width*xProp)-250) + ' ' + ((this.divDimension.height*yProp)-250) + ')\" style=\"pointer-events: none\">' + // I had to do the translate to 500 500 since the original shape was based on 500 by 500
                                        daArrowGroup +
                                        '</g></g>' +
                                        svgStrokeTouch
                                        
                        // start If statement to make circle ring and circle mask 
                        if (this.svgType == "circle" || this.svgType == "circle-pie"){ 
                        var svgTextMask = '<text></text>'
                        var svgText = '<text></text>'
                        if (this.text == true){ 
                        var xText = (this.divDimension.width * xProp)// - this.divDimension.fontSize * 5;
                        var yText = (this.divDimension.height * yProp) - this.divDimension.fontSize/2 - this.divDimension.r;
                        // if (this.textMask == true)  {
                        svgTextMask = '<text id=\"MaskText_' + daID + '\"' + ' class=\"textC\" x=\"' + xText + '\" y=\"' + yText + '\" style=\"alignment-baseline: middle; text-anchor: middle; rgb(255, 255, 255); font-size: ' + this.divDimension.fontSize + 'px;\">'+ daName + '</text>' 
                        // }
                        if (this.textMask == false)  {
                            svgText = '<text id=\"circleText_' + daID + '\"' + ' class=\"text-above-circle ' + daID +' \" radio=\"' + this.divDimension.r + '\" x=\"' + xText  + '\" y=\"' + yText + '\" style=\"z-index: 99999; alignment-baseline: middle; text-anchor: middle; font-size: ' + this.divDimension.fontSize + 'px;\">'+ daName + '</text>' 

                            }
                        }

                        var svgCircleMaskAndRing = '<clipPath id=\"mask_' + daID + '\"' + 
                            '><circle id=\"maskC_' + daID + '\"' + 'class=\"daC daR' + 
                            '\" cx= \"' + (this.divDimension.width * xProp) +
                            '\" cy= \"' + (this.divDimension.height * yProp) +
                            '\" r=\"' + this.divDimension.r + '\"></circle>' + 
                            svgTextMask +
                            '</clipPath>'  +
                            '<circle id=\"daRadioStroke_' + daID + '\" class=\"' + daID + ' ' + this.divContainer +' daAnim daRadio daR radio-stroke\" cx=\"' + (this.divDimension.width * xProp)+ '\" cy=\"' + (this.divDimension.height * yProp) + '\" r=\"' + this.divDimension.r + '\" ' 
                            +
                            'style=\"stroke: rgb(0, 0, 0); fill-opacity: 0; stroke-opacity: 0.5; cursor: pointer; stroke-width: 1%;'
                            + '\"></circle>' + svgText;
                        svgElem.innerHTML = svgCircleMaskAndRing 
                        } // End of IF creating circle ring and mask
                        // Apply selection of horizontal or vertical SVG 
                        if (this.svgType == "horizontal" || this.svgType == "vertical")
                        { 
                        if(this.svgType == "horizontal" ) {var xProp = 0}
                        if(this.svgType == "vertical" ) {var yProp = 0}

                        var svgRectMask = '<clipPath id=\"mask_' + daID + '\"' + 
                        '><rect id=\"maskC_' + daID + '\"' + 'class=\"daC daR' + 
                        '\" x= \"' + (this.divDimension.width * xProp) +
                        '\" y= \"' + (this.divDimension.height * yProp) +
                        '\" width=\"' + this.divDimension.width + 
                        '\" height=\"' + this.divDimension.height  + 
                        '\"></rect>' 
                        svgElem.innerHTML = svgRectMask 
                        }
                        // Apply masks to the leaflet map container div
                        if(this.leaflet == true & this.update == true){
                        iLeafMap.appendChild(svgElem)
                        this.leafMaps[i]._container.style.clipPath = 'url(#mask_' + daID + ')';
                        this.leafMaps[i]._container.style.webkitClipPath  = 'url(#mask_' + daID + ')';
                        this.leafMaps[i]._container.style.zIndex = "999";
                        }
                        // Apply masks to the containers of the imgs
                        if(this.leaflet == false){
                            document.getElementById(this.divNames[i]).appendChild(svgElem)
                            document.getElementById(this.divNames[i]).style.clipPath = 'url(#mask_' + daID + ')';
                            document.getElementById(this.divNames[i]).style.webkitClipPath  = 'url(#mask_' + daID + ')';
                            document.getElementById(this.divNames[i]).style.zIndex = "999";
                        }
                        document.getElementById(this.divContainer).append(document.getElementById(this.divNames[i]))// version i works with Firefox and Chrome however safari has the zindex issue. I am going to first try to put all svg in the same div then on the same
                        // I made this version for the safari issues
                        daInnerHTML = daInnerHTML + svgButtons
                        } // end loop by div layer              
                            svgParentElem.innerHTML = daInnerHTML; // safari issue solved with parentSVG above all divs
                            // this is important 
                            if(this.leaflet == true){
                            svgParentElem.setAttributeNS(null, "class", "leaflet-control")
                            this.leafMaps[0]._container.getElementsByClassName("leaflet-control-container")[0].appendChild(svgParentElem)
                            }
                            if(this.leaflet == false){
                                document.getElementById(this.divNames[0]).appendChild(svgParentElem)
                            }
                            this.updatePosition()
                        },
    listenSVG:function(){   // THIS method does not work
                            var _this = this
                            document.querySelectorAll('.daCenterSVG').forEach(e=>e.addEventListener('click',function(evt){alert(evt)}))
                            document.querySelectorAll('.daCenterSVG').forEach(e=>e.addEventListener('onmousedown',function(evt){_this.onMouseDown(evt)}))
                            document.querySelectorAll('.daCenterSVG').forEach(e=>e.addEventListener('onmousemove',function(evt){_this.onMouseMove(evt)}))
                            document.querySelectorAll('.daCenterSVG').forEach(e=>e.addEventListener('onmouseup',function(evt){_this.daMouseUp(evt)}))
                            document.querySelectorAll('.daCenterSVG').forEach(e=>e.addEventListener('ontouchstart',function(evt){_this.onMouseDown(evt)}))
                            document.querySelectorAll('.daCenterSVG').forEach(e=>e.addEventListener('ontouchmove',function(evt){_this.onMouseMove(evt)}))
                            document.querySelectorAll('.daCenterSVG').forEach(e=>e.addEventListener('ontouchend',function(evt){_this.daMouseUp(evt)}))
                            document.querySelectorAll('.daCenterSVG').forEach(e=>e.addEventListener('ontouchcancel',function(evt){_this.daMouseUp(evt)}))
                            
    },

    filterArray:["none","sepia(25%)","sepia(50%)","sepia(75%)"],//,"sepia(100%)"],
    assignFilters: function(filterArray){
        if (filterArray == null){filterArray = this.filterArray};
        if (filterArray.length != this.divNames.length){return console.log("div array not equal size of filter array")};
        if (this.leaflet == true) {this.divNames.forEach((e,i)=>document.getElementById(e).querySelectorAll(".leaflet-tile-pane").forEach(pane=> pane.style.filter = filterArray[i])) }
        if (this.leaflet == false) {this.divNames.forEach((e,i)=>document.getElementById(e).style.filter = filterArray[i])}
    },
    updateMasks: function(xChange, yChange){
                // update the mask center and SVG when changing the div dimensions
                // hopefully this will fix the problem that the masks get separeted from the SVGs when we change the size of the windows     
                // to do calculate the change in dimensions and apply it to the map. This will be applied to all elements that have a cordinate x and y. 
                // some ideas to think, let the circles free flow or move with the accelerometer. 
                var divWidth = this.divDimension.width
                var divHeight = this.divDimension.height
                function xyUpdater(e) {
                    var befX = parseFloat(e.getAttribute('cx'))
                    var befY= parseFloat(e.getAttribute('cy'))
                    e.setAttributeNS(null,'cx',(befX+xChange))
                    e.setAttributeNS(null,'cy',(befY+yChange))
                    if (e.getAttribute('xprop')){
                        e.setAttributeNS(null,'xprop',(befX+xChange)/(divWidth))
                    }
                    if (e.getAttribute('yprop')){
                        e.setAttributeNS(null,'yprop',(befY+yChange)/(divHeight))
                    }
                 }

                 function xyTextUpdater(e) {
                    var befX = parseFloat(e.getAttribute('x'))
                    var befY= parseFloat(e.getAttribute('y'))
                    e.setAttributeNS(null,'x',(befX+xChange))
                    e.setAttributeNS(null,'y',(befY+yChange))
                }

                 function xyTranslator(e){
                    if (e.getAttribute('transform') != null)
                        {   var befTrans = e.getAttribute('transform')
                            var befTransX = parseFloat(befTrans.split("(",)[1].split(" ")[0])
                            var befTransY = parseFloat(befTrans.split("(",)[1].split(" ")[1])}
                            else { var befTransX = 0; var befTransY= 0}
                            var newX = befTransX + xChange
                            var newY = befTransY + yChange
                            e.setAttributeNS(null,'transform',"translate("+newX+" "+newY+")")
                            } 
                // new percent change Updaters  
                // define classes that will represent several groups that need to be updated
                document.querySelectorAll(".daC").forEach(e=>xyUpdater(e))
                document.querySelectorAll(".arrowGroup").forEach(e=>xyTranslator(e))
                document.querySelectorAll(".radio-stroke").forEach(e=>xyUpdater(e))
                document.querySelectorAll(".radio-touch-event").forEach(e=>xyUpdater(e))
                document.querySelectorAll(".textC").forEach(e=>xyTextUpdater(e))
                document.querySelectorAll(".daArrowCircle").forEach(e=>xyUpdater(e))
                document.querySelectorAll(".text-above-circle").forEach(e=>xyTextUpdater(e))
            },
    // THIS method definitivamente necesita ser mejorado        
    objTest:undefined,        
    updatePieArray: function(obj){
        this.objTest = obj;
        if(this.pieArray.length == 0){this.pieArray = [obj]}
        else{
            var similar = 0;
            for(var i = 0; i<this.pieArray.length; i++){
                if(JSON.stringify(this.pieArray[i].divArray) == JSON.stringify(obj.divArray))
                {similar = similar + 1
                this.pieArray[i].iRad = obj.iRad
                }
            }
            if (similar == 0) {this.pieArray.push(obj)}
        }
        
    },

    makePies: function(divArray, iRad){ 
        this.updatePieArray({divArray, iRad})
        if (iRad == null){iRad = .628;} // orginally was 36 degrees I changed it to radians
        var pies = divArray[0]
        var iInputAngle = iRad
        {for(i=1; i<divArray.length; i++)
                    {pies = pies+"."+divArray[i]}        
                }
        //var svgParent = document.getElementById('SVGparent');
        var daSVG0 = document.getElementById("svg_" + divArray[0])
        if (this.daSVG.getAttribute('pies') == null)
        {var maskOrPath = "maskC_"}
        else 
        {var maskOrPath = "path_"}
        var daMask0 = document.getElementById(maskOrPath + divArray[0])
        var daRadioStroke = document.getElementById("daRadioStroke_" + divArray[0])
        var viewBox0 = daSVG0.getAttribute('viewBox')
        var daRadioCX = daRadioStroke.getAttribute('cx')
        var daRadioCY = daRadioStroke.getAttribute('cy')
        var daRadioR = daRadioStroke.getAttribute('r')
        var r = parseFloat(daMask0.getAttribute("r"));
        var xCenter = parseFloat(daMask0.getAttribute("cx"));
        var yCenter = parseFloat(daMask0.getAttribute("cy"));
        var nSVG = divArray.length
                
        

        for (var i = 0; i < nSVG; i++){ 
            //remove the pointer from the rings 
            if(i>0){document.querySelectorAll("circle.daR."+divArray[i]).forEach(e=>e.style.pointerEvents = "none")
                    document.querySelectorAll(".text-above-circle."+divArray[i]).forEach(e=>e.style.display = "none")
            }
            // remove the rotator circles
          if(this.circleRotator == false){
          document.querySelectorAll("."+ divArray[i]+".rotator").forEach(e=>e.parentNode.remove())
        }
          var daSVGmerge = document.getElementById("svg_" + divArray[i])
          var daMask = document.getElementById("mask_" + divArray[i])
          var sAngle = (Math.PI*2)/nSVG
          var daMx = (xCenter + Math.sin(iRad)*r)
          var daMy = (yCenter - Math.cos(iRad)*r)
          var daMx2 = (xCenter + Math.sin(iRad+sAngle)*r)
          var daMy2 = (yCenter - Math.cos(iRad+sAngle)*r)
          //Need to make a better calculation of the size of the arc size. 
          var pieTextSize = this.divDimension.fontSize
          var pieTextBuffer = pieTextSize/4
          var daMxText = (xCenter + Math.sin(iRad)*(r+pieTextBuffer))
          var daMyText = (yCenter - Math.cos(iRad)*(r+pieTextBuffer))
          var daMx2Text = (xCenter + Math.sin(iRad+(sAngle))*(r+pieTextBuffer))
          var daMy2Text = (yCenter - Math.cos(iRad+(sAngle))*(r+pieTextBuffer))

          iRad = iRad+sAngle
  
          var daSection = "M "+daMx+" "+daMy+
                          "A "+r+" "+r+", 0, 0, 1, "+daMx2+" "+daMy2+
                          "L "+xCenter+" "+yCenter+" Z"
          var daTextSection = "M "+daMxText+" "+daMyText+
                            "A "+(r+pieTextBuffer)+" "+(r+pieTextBuffer)+", 0, 0, 1, "+daMx2Text+" "+daMy2Text
      
        var daName = this.filterNames[this.divNames.indexOf(divArray[i])]
        var displayMask = ''  
        if (this.textMask == true) {displayMask = ' display=\"none\" '}
          var daTextPath =  '<path id=\"pathText_'+divArray[i]+ '\" class=\"pies ' + divArray[0] + ' pie-text-path\" cx=\"' + xCenter + '\" cy=\"' 
          + yCenter + '\" r=\"' + r + '\" d=\"' + daTextSection + '\" style=\"stroke-width:0; stroke: rgb(0, 0, 0); fill: none;\"></path>' + 
          '<text class=\"pie-text\" text-anchor=\"middle\"' + displayMask +'><textPath startOffset=\"50%\"  href=\"#pathText_' + divArray[i] + '\">'
          + daName + '</textPath></text>' 

          if (document.getElementById('pathText_'+divArray[i])){
            var daPath = document.getElementById('pathText_'+divArray[i])
            // daPath.outerHTML = daTextPath // another method but does not work well in Safari
            daPath.setAttribute('d',daTextSection)
   
        }
        var daText =  '<text text-anchor=\"middle\" class=\"pie-text-mask\" style=\ font-size:' + pieTextSize +'px; \"><textPath startOffset=\"50%\"  href=\"#pathText_' + divArray[i] + '\">'+
        daName + '</textPath></text>'  

          daMask.innerHTML = '<path id=\"path_'+divArray[i]+ '\" class=\"daC pies ' + divArray[0] + '\" cx=\"' + xCenter + '\" cy=\"' 
                            + yCenter + '\" r=\"' + r + '\" d=\"' + daSection + '\" fill=\"#fdcc8a\"></path>' 
                            + daText
        var xmlns = "http://www.w3.org/2000/svg";
        var circle = document.createElementNS(xmlns, "g");
            circle.setAttributeNS('null', "class", "bRot");
            var daInnerHTML = '<circle id=\"rotator_' + divArray[i] + '\" class=\"' + divArray[0] + ' ' + divArray[i] + ' rotator'+ '\" cx=\"' + daMx + '\" cy=\"' + daMy + '\" r=\"' + 20 + '\" '
                                        + 'xprop=\"' + xCenter + '\" yprop=\"' + yCenter + '\" '
                                        + 'lpie=\"'  + divArray.toString() + '"\ '
                                        + 'pierot=\"'  + iInputAngle + '\" '
                                        + '\" style=\"stroke: rgb(0, 0, 0); fill-opacity: 0; stroke-opacity: 0; cursor: pointer; stroke-width: 1%;  pointer-events: fill;' 
                                        + '\" onmousedown=\"' + this.objName + '.onMouseDown(evt)\" onmousemove=\"' + this.objName + '.onMouseMove(evt)\" onmouseup=\"' + this.objName + '.daMouseUp(evt)\" ontouchstart=\"' + this.objName + '.onMouseDown(evt)\" ontouchmove=\"' + this.objName + '.onMouseMove(evt)\" ontouchend=\"' + this.objName + '.daMouseUp(evt)\" ontouchcancel=\"' + this.objName + '.daMouseUp(evt)\"' 
                                        + ' ></circle>' + daTextPath
                circle.innerHTML = daInnerHTML

        document.getElementById(this.svgParentName).appendChild(circle)                   
        // annoying Safari
        daSVGmerge.parentNode.appendChild(daSVGmerge).appendChild(daMask);
      
        if (i > 0){
        var daRadioStrokei =  document.getElementById("daRadioStroke_" + divArray[i])
        daSVGmerge.setAttributeNS(null,"viewBox",viewBox0)
        daRadioStrokei.setAttributeNS(null,"cx",daRadioCX)
        daRadioStrokei.setAttributeNS(null,"cy",daRadioCY)
        daRadioStrokei.setAttributeNS(null,"r",daRadioR)
    }
        this.daSVG.setAttributeNS("null","pies", pies)
        this.daSVG.setAttributeNS("null","rotation", iInputAngle)
          }
        },
    svgPiesObjs:[],
    svgPiesArray: [],
    setActiveSVG: function(){for(var i=0; i<this.divNames.length;i++){
        if(this.currentID == this.divNames[i]){this.activeSVG = i};};
    },
    updatePosition: function(){
                this.positionArray = []
                var daC = document.getElementsByClassName("daC")
                for (i=0; i<daC.length; i++){
                    var daObj = {   id: daC[i].getAttribute("id").split("_")[1], 
                                    x: daC[i].getAttribute("cx"), 
                                    y: daC[i].getAttribute("cy"), 
                                    r: daC[i].getAttribute("r")
                                }
                                this.positionArray.push(daObj);
                }
            },
                    newP: { x: 0, y: 0 }, 
                    newR: 0,
                    position: { x: 0, y: 0 },
                    activeSVG: null, // the index of the active SVG
                    pieRot: 0,
                    activePies:"",
                    pieRotInit:0,
                    pieRotDelta:0,

                    positionArray: [], // {id:"back",x:0,y:0,r:0} working with pies so each cicle "knows" their relative distance
                    mergeSVG: true, // i am going to use this to instruct if it is ok to merge the circles
                    distanceArray: [0],// an array that will know the relative distance to the active circle
                    insideArray: [false],
                    minDistance: 10, // minimum distance for the circles to be merged 
                    mousedown: 0,
                    bmousedown:0, 
                    // NEW End for the animateSVG object},

            calculateDistance: function(){
                                        this.distanceArray = []
                                        this.insideArray = []
                                        var curI = 0;
                                        var curX = 0;
                                        var curY = 0;
                                        var curR = 0;
                        
                                        for (i=0;i < this.positionArray.length; i++){
                                            if (this.positionArray[i].id === this.currentID) // make this better
                                            {   curI = i
                                                curX = this.positionArray[i].x; 
                                                curY = this.positionArray[i].y
                                                curR = this.positionArray[i].r
                                            }
                                        }
                            
                                        for(i=0;i < this.positionArray.length; i++){
                                            var isInside = 0
                                            var elObj = this.positionArray[i]
                                            var newDis = Math.sqrt( Math.pow((curX - elObj.x),2) + Math.pow((curY - elObj.y),2))
                                            this.distanceArray.push(newDis)
                                            if (newDis > 0 && newDis < curR/2 && this.positionArray[i].id != this.currentID) { // made smaller rad
                                                                    isInside = 1;
                                                                    if (this.mergeSVG == true){
                                                                        var divArray = []
                                                                        if (this.daSVG.getAttribute('pies') == null) {
                                                                            divArray=[this.positionArray[curI].id, this.positionArray[i].id];
                                                                            document.querySelectorAll(".iAni."+this.positionArray[i].id).forEach(e=>e.parentNode.removeChild(e))
                                                                            // this.positionArray.splice(i,1)
                                                                        }
                                                                        else {  divArray = this.daSVG.getAttribute("pies").split('.');
                                                                                divArray.push(this.positionArray[i].id);
                                                                                document.querySelectorAll(".iAni."+this.positionArray[i].id).forEach(e=>e.parentNode.removeChild(e))
                                                                                var rotation = parseFloat(this.daSVG.getAttribute("rotation"))
                                                                                this.makePies(divArray, rotation);
                                                                                return false}
                                                                        this.makePies(divArray);
                                                                    }
                                            };
                                            if (this.positionArray[i].id === this.currentID) {isInside = -1}
                                            this.insideArray.push(isInside)
                                            };
                                        },
                 
                    addListerners: function(){
                        // document.getElementById(this.divContainer).addEventListener("mouseup", this.daMouseUp);
                        var _this = this
                        window.addEventListener("mouseup", function(evt) {_this.daMouseUp(evt)});
                        window.addEventListener("mousemove", function(evt) {_this.onMouseMove(evt)});
                        window.addEventListener("click", function(evt) {_this.daMouseUp(evt)}); 
                    },
                    radioAnimationOn: function(classQuery) {
                        var daAnim = document.querySelectorAll(classQuery)
                        for (var i = 0; i < daAnim.length; i++) {
                          daAnim[i].style.strokeWidth= "1%";
                          daAnim[i].style.animation = "dash .4s linear"
                          daAnim[i].style.animationIterationCount = "1" ;
                        //   daAnim[i].style.animationDuration = ".4s";
                         daAnim[i].style.animationDirection = "reverse"
                              } 
                    },
                    radioAnimationOff: function(classQuery){
                        var daAnim = document.querySelectorAll(classQuery)
                            for (i = 0; i < daAnim.length; i++) {
                              daAnim[i].style.strokeWidth= "1%";
                              daAnim[i].style.animation = "none"; 
                                  } 
                    },
                    aniArrowsInit: function(classQuery){ 
                                    setTimeout(function(){this.animationApagao(classQuery); 
                                        this.radioAnimationOff(".daAnim")},4000);
                        },
                    animationApagao: function (classQuery){
                                daArrows = document.querySelectorAll(classQuery);
                                for (i = 0; i < daArrows.length; i++) {
                                daArrows[i].style.animation = "none" ;
                                    }
                        },
                    radioStrikeOn: function(classQuery) {
                        var daAnim = document.querySelectorAll(classQuery);
                            for (i = 0; i < daAnim.length; i++) {
                              daAnim[i].style.strokeWidth= "6%";
                              daAnim[i].style.animation = "none"; 
                            }
                            },
                    // moveLoupe: { // remvove the mouveloupe object
                        currentID:"",
                        ownerDiv: null,
                        ownerSVG: null,
                        circleMove: false,
                        circleRadio: false,
                        circleRotator: false,
                        xCirculo: 0,
                        yCirculo: 0,
                        offset: null,

                        getMouse: function (evt){
                                    this.position.x = evt.clientX;
                                    this.position.y = evt.clientY;
                                    return this.position
                                    },
                        daSVGbutton:undefined,
                        daSVG:undefined,      
                        onMouseDown: function(evt){
                                const contDiv = document.getElementById(evt.target.classList[1])
                                if (contDiv != null){this.contDiv = contDiv
                                this.calcDivDimensions()
                                }

                                // Loop to dissable the Leaflet dragging // change to an arrow forEach function 
                                // MAKE EVT have attribute leaflet 
                                if(this.leaflet == true){
                                for (var i=0; i<this.leafList.length; i++) {
                                    this.leafList[i].dragging.disable()
                                    }}
                                    // maybe do an if statemet to make it not ittarate eavery time, 
                                    document.querySelectorAll(".daAnim, .arrow").forEach(e=>e.style.animation = "none")
                                    this.currentID = evt.target.getAttribute("class").split(" ")[0] // gets the ID from the class //there has to be a better way
                                    this.daSVG = document.getElementById("svg_" + this.currentID)
                                    this.daSVGbutton = evt.target
                                    if (this.daSVGbutton.nodeName == 'line'){this.daSVGbutton = document.getElementById(daSVGbutton.id.split("daLine")[1])}
                                    var daCircle = evt.target
                                    if (this.daSVGbutton.nodeName == 'line'){daCircle = document.getElementById(this.daSVGbutton.id.split("daLine")[1])}
                                    this.divDimension.xProp = parseFloat(daCircle.getAttribute("xprop"))
                                    this.divDimension.yProp = parseFloat(daCircle.getAttribute("yprop"))
                                    
                                    //If statement has pie rotator
                                    if (evt.target.getElementsByClassName("rotator")){
                                    this.activePies = daCircle.getAttribute('lpie') // off
                                    this.pieRot = parseFloat(daCircle.getAttribute('pierot'))
                                    }
                                    this.ownerSVG = this.daSVG;
                                    
                                    if (this.leaflet == true){this.ownerDiv = this.ownerSVG.parentElement.parentElement;}
                                    else {this.ownerDiv = this.ownerSVG.parentElement}
                                    
                                    this.offset = this.ownerDiv.getBoundingClientRect()
                                   
                                    var daC = this.daSVG.getElementsByClassName("daC")
                                        for (i=0; i<daC.length;i++){ //THERE HAS TO BE A BETTER WAY
                                            this.xCirculo = parseInt(daC[i].getAttribute("cx"))
                                            this.yCirculo = parseInt(daC[i].getAttribute("cy"))
                                         }
                                        // TO DO make false statments of other circleMove circleRadio circleRotator
                                        //Start if statment of rotator
                                        if (evt.target.classList.contains("rotator") && this.circleMove == false && this.circleRadio == false) 
                                        {//
                                        this.circleRotator = true; 
                                        
                                        var daRadio = document.querySelectorAll('.'+this.currentID+'.daR')
                                        for (i=0;i < daRadio.length; i++){
                                            daRadio[i].style.pointerEvents  = "none";
                                        }
                                        var daRing = this.ownerSVG.getElementsByClassName("iAni");
                                        for (i=0;i < daRing.length; i++){
                                            daRing[i].style.pointerEvents  = "none";
                                        }    
                                        this.bmousedown=3;
                                        } // END IF statement of Rotator

                                    //// Start IF statement of Radio (ring)
                                    if (evt.target.classList.contains("daRadio") && this.circleMove == false) 
                                        {//
                                        this.circleRadio = true; 
                                        
                                        if(this.daSVG.getAttribute('pies'))
                                            {this.daSVG.getAttribute("pies").split('.').forEach(e=>this.radioStrikeOn('.'+e+'.daR.daAnim'))}
                                        else{this.radioStrikeOn('.'+this.currentID+'.daR.daAnim')}                                                
                                        

                                        var daRing = this.ownerSVG.getElementsByClassName("iAni");
                                        for (i=0;i < daRing.length; i++){
                                            daRing[i].style.pointerEvents  = "none";
                                        }    
                                        this.bmousedown=2;
                                        } // END IF statement of Radio 
                                    
                                    // Start if statement on Arrow and center button 
                                    if (evt.target.classList.contains("iAni") && this.circleRadio == false) 
                                        {
                                        this.circleMove = true; 
                                        if(this.daSVG.getAttribute('pies'))
                                        {this.daSVG.getAttribute("pies").split('.').forEach(e=>this.radioAnimationOff('.'+e+'.daR.daAnim'))}
                                        else{this.radioAnimationOff('.'+this.currentID+'.daR.daAnim');}   
                                        var daCenterSVG = document.querySelectorAll( '.'+this.currentID+'.daCenterSVG')            
                                        for (i=0;i < daCenterSVG.length; i++){
                                            daCenterSVG[i].style.animation  = "none"
                                            daCenterSVG[i].style.opacity  = ".5"
                                        }    
                                
                                        var daRadio = document.querySelectorAll('.'+this.currentID+'.daR')
                                        for (i=0;i < daRadio.length; i++){
                                            daRadio[i].style.pointerEvents  = "none";
                                        }    
                                        this.bmousedown=1;                                      
                                        }
                                    // End IF statement on Arrow and center button                            
                                    
                                    // If statement for touch events // I should do more research on this but it worked at least for cellphones
                                    if (evt.touches){
                                            this.newP=this.getMouse(evt.touches[0]) // check if this this is a problem using cellphone
                                            if (this.circleRotator == true)
                                            {this.pieRotInit = Math.PI - Math.atan2((this.newP.x - this.divDimension.xProp),(this.newP.y - this.divDimension.yProp))
                                            }
                                            this.doUpdate(evt) // veryfy touchscreen
                                           }
                                    else{
                                            this.newP=this.getMouse(evt);
                                            if (this.circleRotator == true)
                                            {this.pieRotInit = Math.PI - Math.atan2((this.newP.x - this.divDimension.xProp),(this.newP.y - this.divDimension.yProp))
                                                }
                                           
                                            this.doUpdate(evt);
                                        }
                                    //     var _this = this
                                    // window.addEventListener("mousemove", _this.onMouseMove);
                                    // window.addEventListener("click", _this.daMouseUp);                                 
                                    // document.getElementById(this.divContainer).addEventListener("mousemove", this.onMouseMove);
                                    // document.getElementById(this.divContainer).addEventListener("click", this.daMouseUp);
                                },

                            onMouseMove: function(evt) {

                                // return}
                                    // If statements to turn off radio pointer

                                //MAKE rotator attribute

                                    if((this.bmousedown == 1 || this.bmousedown == 3) && (this.circleMove == true || this.circleRotator == true)){
                                        var daRadio = document.querySelectorAll('.'+this.currentID+'.daR')
                                            for (i=0;i < daRadio.length; i++){
                                                daRadio[i].style.pointerEvents  = "none";
                                            }}
                                    // If statements to turn off center pointer
                                    if((this.bmousedown == 2 || this.bmousedown == 3) && (this.circleRadio == true || this.circleRotator == true)){
                                    var daRing = this.ownerSVG.getElementsByClassName("iAni");
                                        for (i=0;i < daRing.length; i++){
                                            daRing[i].style.pointerEvents  = "none";
                                        }  
                                    }

                                    if(this.bmousedown != 3 && (this.circleRadio == true || this.circleMove == true)){
                                        document.querySelectorAll(".rotator").forEach(e=>e.style.pointerEvents  = "none")}

                                    if(evt.touches)
                                    {this.newP = this.getMouse(evt.touches[0]) // might be needed check cellphone
                                        if (this.circleRotator == true){
                                            var delta = (Math.PI - Math.atan2((this.newP.x - this.divDimension.xProp),(this.newP.y - this.divDimension.yProp))) - this.pieRotInit
                                            if (!isNaN(delta)) {this.pieRotDelta =  delta}
                                        }
                                        this.doUpdate()
                                    }
                                    else{
                                        // if (this.objName === 'timeF')
                                        // {  
                                            this.newP = this.getMouse(evt);// needed
                                        if (this.circleRotator == true){
                                            var delta = (Math.PI - Math.atan2((this.newP.x - this.divDimension.xProp),(this.newP.y - this.divDimension.yProp))) - this.pieRotInit
                                            if (!isNaN(delta)) {this.pieRotDelta =  delta}
                                            }
                                            this.doUpdate()};// change
                                    // }
                                },
                                
                            daMouseUp: function() {
                                    if(this.bmousedown == undefined){console.log(this)}

                                    if (this.circleRotator == true)
                                    {  this.bmousedown=0;
                                    this.circleRotator = false;
                                    if(this.activePies != null){
                                    this.makePies( this.activePies.split(","),(this.pieRot + this.pieRotDelta))}
                                    var daRadio = document.querySelectorAll('.'+this.currentID+'.daR');
                                            for (i=0;i < daRadio.length; i++){
                                                daRadio[i].style.pointerEvents  = "stroke";
                                            } 
                                    if(this.leaflet == true){
                                    for (var i=0; i<this.leafList.length; i++) {
                                        this.leafList[i].dragging.enable()
                                    }
                                    }}
                                    //If statements to activate the radio animation
                                    if(this.bmousedown==2) {
                                        if(this.daSVG.getAttribute('pies'))
                                        {this.daSVG.getAttribute("pies").split('.').forEach(e=>this.radioAnimationOn('.'+e+'.daR.daAnim'))}
                                        else{this.radioAnimationOn('.'+this.currentID+'.daR.daAnim');}                                           
                                        //Enable leaflet dragging 
                                        if(this.leaflet == true){
                                        for (var i=0; i<this.leafList.length; i++) {
                                            this.leafList[i].dragging.enable()
                                        } 
                                    }}
                                    //Enable leaflet dragging
                                    if(this.leaflet == true){
                                    for (i=0; i<this.leafList.length; i++) {
                                        this.leafList[i].dragging.enable()
                                    }}
                                    // Start IF statment if working moving the center of the circle
                                    if (this.circleMove == true) {
                                        var daRadio = document.querySelectorAll('.'+this.currentID+'.daR');

                                            for (i=0;i < daRadio.length; i++){
                                                daRadio[i].style.pointerEvents  = "stroke";
                                            }    
                                        this.bmousedown=0;
                                        this.circleMove=false;
                                        var daCenterSVG =  document.querySelectorAll( '.'+this.currentID+'.daCenterSVG')            
                                        
                                        for (i=0;i < daCenterSVG.length; i++){
                                            daCenterSVG[i].style.opacity  = "0"
                                            daCenterSVG[i].style.animation  = "cirCenterAni2 1.5s linear"

                                        }  
                                    } // End IF statement of moving center
                                    // Start IF statment if working with the Radio (ring)
                                    if (this.circleRadio == true){
                                        this.bmousedown=0;
                                        this.circleRadio=false;
                                        var daRing = this.ownerSVG.getElementsByClassName("iAni");
                                        for (var i=0;i < daRing.length; i++){
                                            daRing[i].style.pointerEvents  = "fill";
                                        }
                                        var daC = this.daSVG.getElementsByClassName("daC")
                                        console.log(daC)
                                        for (var i=0; i<daC.length;i++){ //THERE HAS TO BE A BETTER WAY
                                            this.xCirculo = parseInt(daC[i].getAttribute("cx"))
                                            this.yCirculo = parseInt(daC[i].getAttribute("cy"))
                                         }
                                    }  // End IF statement of radio     
                                },       
                                doUpdate: function (){  
                                    
                                    var daMap = this.ownerDiv
                                    this.daSVG = this.ownerSVG
                                    //Start IF statement for rotator
                                    if (this.circleRotator == true)
                                        {
                                            if(isNaN(this.pieRotDelta)) {this.pieRotDelta = 0}
                                            if(this.activePies != null){
                                            this.makePies(this.activePies.split(","),(this.pieRot + this.pieRotDelta))}
                                        }
                                    // Start IF statment if working with the Radio (ring)
                                    if (this.circleRadio == true) {
                                        

                                        xD = Math.sqrt( Math.pow((this.newP.x - this.offset.x - this.xCirculo),2) + Math.pow((this.newP.y - this.offset.y -this.yCirculo),2))
                                        if (xD > 0 ){ 

                                            rRadio = xD  
                                            // this.divDimension.r = .  
                                            var daRadio = document.querySelectorAll('.'+this.currentID+'.daR')
                                                for (var i=0; i<daRadio.length;i++){
                                              daRadio[i].setAttributeNS(null,'r',rRadio) 
                                                }       
                                            var daProp = this.daSVG.getBoundingClientRect().height/this.divDimension.height                 
                                            var daC = this.daSVG.getElementsByClassName("daC") //
                                            for (var i=0; i<daC.length;i++){
                                            daC[i].setAttributeNS(null,'r',rRadio * daProp);
                                            // this.contDiv.append(daMap)
                                            }                   
                                            if (this.text == true){
                                                var daText = this.daSVG.getElementsByClassName('textC')
                                                for (i=0; i<daText.length;i++){
                                                    var ydis = this.daSVGbutton.getBoundingClientRect().y - this.contDiv.getBoundingClientRect().y + this.daSVGbutton.getBoundingClientRect().height/2                                        
                                                    daText[i].setAttributeNS(null,'y', ydis - this.divDimension.fontSize/2 - rRadio) 
                                            }
                                                var daText = this.daSVG.getElementsByClassName('text-above-circle')
                                                for (i=0; i<daText.length;i++){
                                                        var xChange = 0
                                                        // ydis = daSVGbutton.getBoundingClientRect().y - document.getElementById(this.divContainer).getBoundingClientRect().y + daSVGbutton.getBoundingClientRect().height/2                                        
                                                        var prevRadio = parseFloat(daText[i].getAttribute('radio')) 
                                                        var yChange = prevRadio-rRadio // parseFloat(daText[i].getAttribute('y')) - daSVGbutton.getBoundingClientRect().y - document.getElementById(this.divContainer).getBoundingClientRect().y + daSVGbutton.getBoundingClientRect().height/2  - this.divDimension.fontSize/2 - rRadio                                   
                                                        if (daText[i].getAttribute('transform') != null) {
                                                            var befTrans = daText[i].getAttribute('transform')
                                                            var befTransX = parseFloat(befTrans.split("(",)[1].split(" ")[0])
                                                            var befTransY = parseFloat(befTrans.split("(",)[1].split(" ")[1])}
                                                                else { var befTransX = 0; var befTransY= 0}
                                                                var newX = befTransX + xChange
                                                                var newY = befTransY + yChange
                                                                daText[i].setAttributeNS(null,'transform',"translate("+newX+" "+newY+")")
                                                                daText[i].setAttributeNS(null,'radio', rRadio) 
                                                                } 
                                            }    
                                                
                                            
                                            if (this.daSVG.getAttribute('pies') != null){
                                                var rotation = parseFloat(this.daSVG.getAttribute("rotation"))
                                                this.makePies(this.daSVG.getAttribute('pies').split('.'),rotation)}
                                                this.contDiv.append(daMap)
                                            //  this.newR = rRadio;
                                                this.updatePosition()
            
                                        }
                                        
                                    } // End IF statement of radio size change 
                                    // Start IF statment if working moving the center of the circle
                                    else if(this.circleMove == true){
                                        bboxX= -1*(this.newP.x- 
                                            this.divDimension.xProp * this.divDimension.width
                                            - this.offset.x);// CHECK THE 250 math 
                                        bboxY = -1*(this.newP.y- // bef -1 using bbox
                                            this.divDimension.yProp * this.divDimension.height 
                                            - this.offset.y);
                                        if (this.svgType == "vertical") {
                                            bboxY = 0
                                            if (bboxX > this.divDimension.width/2) {bboxX = this.divDimension.width/2}    // change the 2 to a xProp value
                                            if (bboxX < -1*this.divDimension.width/2) {bboxX = -1*this.divDimension.width/2}
                                            }
                                        if (this.svgType == "horizontal") {
                                            bboxX = 0
                                            if (bboxY > this.divDimension.height/2) {bboxY = this.divDimension.height/2}    // change the 2 to a xProp value
                                            if (bboxY < -1*this.divDimension.height/2) {bboxY = -1*this.divDimension.height/2}
                                            
                                        }
                                        newViewBox = bboxX + " " + bboxY + " " + this.divDimension.width + " " + this.divDimension.height;
                                        this.daSVG.setAttributeNS(null, "viewBox", newViewBox)
                                        var currentR = this.daSVG.getElementsByClassName("daR")[0].getAttribute("r")
                                        this.daSVGbutton.parentElement.parentElement.setAttributeNS(null, "transform", 'translate(' +  -1*bboxX + ' ' +  -1*bboxY + ')')                                      
                                        // var xdis = this.daSVGbutton.getBoundingClientRect().x - this.contDiv.getBoundingClientRect().x + this.daSVGbutton.getBoundingClientRect().width/2
                                        // var ydis = this.daSVGbutton.getBoundingClientRect().y - this.contDiv.getBoundingClientRect().y + this.daSVGbutton.getBoundingClientRect().height/2                                        
                                        
                                        var xdis = this.daSVGbutton.getBoundingClientRect().x - this.offset.x + this.daSVGbutton.getBoundingClientRect().width/2
                                        var ydis = this.daSVGbutton.getBoundingClientRect().y - this.offset.y + this.daSVGbutton.getBoundingClientRect().height/2                                        
                                        
                                        
                                        var daC = this.daSVG.getElementsByClassName("daC")
                                        if (this.svgType == "circle"){
                                        for (i=0; i<daC.length;i++){
                                            daC[i].setAttributeNS(null,'cx',xdis)
                                            daC[i].setAttributeNS(null,'cy',ydis) 
                                            
                                            if (this.daSVG.getAttribute('pies') != null){
                                                var rotation = parseFloat(this.daSVG.getAttribute("rotation"))
                                                this.makePies(this.daSVG.getAttribute('pies').split('.'),rotation)}
                                            }
                                            if (this.text == true){
                                                daText = this.daSVG.getElementsByClassName('textC')
                                                for (i=0; i<daText.length;i++){
                                                    daText[i].setAttributeNS(null,'x',xdis)
                                                    daText[i].setAttributeNS(null,'y',ydis - this.divDimension.fontSize/2 - currentR) 
                                            }};
                                        }

                                        if (this.svgType == "vertical" && xdis > 0){ 
                                            for (i=0; i<daC.length;i++){
                                                daC[i].setAttributeNS(null,'x',xdis)
                                                }
                                        }
                                        if (this.svgType == "horizontal" && ydis > 0){ // ydis might be usefull to make the moving windows
                                            for (i=0; i<daC.length;i++){
                                                daC[i].setAttributeNS(null,'y',ydis)
                                                }
                                        }
                                        this.updatePosition()
                                        this.calculateDistance()
                                        this.contDiv.append(daMap)
                                        // document.getElementById(this.divContainer).append(daMap)                                    
                                    } // End IF statmenet if moving the center of the circle
                                    
                                },
                                // daClick: function(){
                                //     this.daMouseUp() //propbably needed
                                // },

                                                    // }, // End of moveLoupe object                      
                // }, //End of animSVG object
 resize: function(){
    this.calcDivDimensions()
    var xUpdate = (window.innerWidth - this.windowDimension.wX)/2;
    var yUpdate = (window.innerHeight - this.windowDimension.wY)/2;
    this.updateMasks(xUpdate,yUpdate)
    this.windowDimension.wY = window.innerHeight
    this.windowDimension.wX = window.innerWidth
    var vBoriginalX = document.getElementById(this.svgParentName).viewBox.baseVal.x
    var vBoriginalY = document.getElementById(this.svgParentName).viewBox.baseVal.y
    document.getElementById(this.svgParentName).setAttributeNS(null,'viewBox',vBoriginalX + " " + vBoriginalY + " "+window.innerWidth+" "+window.innerHeight)
    
    document.querySelectorAll(".upperSVG").forEach(e=>e.setAttributeNS(null,'viewBox',
          e.viewBox.baseVal.x
          +" "
          +e.viewBox.baseVal.y
          +" "+window.innerWidth+" "+window.innerHeight))
  if(this.pieArray.length > 0){
    this.pieArray.forEach(e=>this.makePies(e.divArray,e.iRad))}// 
  },
  listenResize: function(){  
    const _this = this
    window.addEventListener("resize", function() {_this.resize()})
    window.addEventListener("orientationchange", function() {_this.resize()})
}
} // end of Time Filter Object 

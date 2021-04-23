
//const width = (+window.getComputedStyle(document.body).width.replace(/px/,''));
//const height = (+window.getComputedStyle(document.body).height.replace(/px/,''));
// const height=window.innerHeight;
function convertArrayOfObjectsToCSV(data) {
    var result, ctr, keys, columnDelimiter, lineDelimiter;

    //data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = data.columnDelimiter || ',';
    lineDelimiter = data.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCSV(args1) {
    let data, filename, link;
    //if input is already csv
    let csv=args1;
    //else
    // let csv = convertArrayOfObjectsToCSV({
    //     data: args1
    //     });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
    }

async function csvtoxy(result) {
    const x=[];
    const y=[];
    const value=[];
    const arr_ofobj=[]; //array of objects (for bubble)
    
    const rows= result.split('\n').slice(1);
    rows.forEach(row => {
        const cols=row.split(',');
        x.push(parseFloat(cols[0]));
        y.push(parseFloat(cols[1]));
        value.push(10);
        arr_ofobj.push({x: cols[0], y: cols[1], r: 10});
    });
    //return {x,y,value} 
    return arr_ofobj;
}  

// converts array to csv (for data analysis)
const arrayToCSV = (arr, delimiter = ',') =>
    arr
        .map(v =>
        v.map(x => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(delimiter)
        )
        .join('\n');

async function d3dense(file,hex,scatter){ //,TforCSV){
const margin = {top: 10, right: 30, bottom: 30, left: 40};
let data= Object.assign(d3.csvParse(file, ({x, y, clock}) => ({x: +x, y: +y})), {x: "", y: ""}); //same data for scatter and hex

if (hex){ //if hex is true
function hexchart() //create a svg element using other stuff
{
let svg=d3.select("#my_dataviz")
.append("svg")
.attr("width", width )
.attr("height", height)
.attr("class", "graph_svg "); //class to change style

document.querySelector(".graph_svg").style.backgroundColor= "white";  //change background
    // background-image:
    // url("https://mdn.mozillademos.org/files/11991/startransparent.gif"),
    // url("https://mdn.mozillademos.org/files/7693/catfront.png");
    
svg.append("g")
    .call(xAxis); //calls the premade xaxis

svg.append("g")
    .call(yAxis);

svg.append("g")
    .attr("stroke", "#000") //hexagon borders are black in colour
    .attr("stroke-opacity", 0.1) //opacity of borders is 0.1
.selectAll("path")
.data(bins) 
.enter().append('path')
    .attr("d",  hexbin.hexagon())
    .attr("transform", d => `translate(${d.x},${d.y})`) 
    .attr("fill", d => color(d.length)); //d.length is how many points in each hex box

return svg.node();
}

let x= d3.scaleLinear() //scales the width linearly to the plotting window
    .domain([0, width])
    .range([ 0, width - margin.left-margin.right])

let y= d3.scaleLinear() //scales the height linearly to the plotting window
    .domain([0, height])
    .range([ height - margin.top - margin.bottom, 0]) 
let xAxis = g => g //creates x axis to append to g
.attr("transform", `translate(0,${height - margin.bottom})`)
.call(d3.axisBottom(x).ticks(width / 80, ""))
.call(g => g.select(".domain").remove())
.call(g => g.append("text")
    .attr("x", width - margin.right)
    .attr("y", -4)
    .attr("fill", "currentColor")
    .attr("font-weight", "bold")
    .attr("text-anchor", "end")
    .text(data.x));
let yAxis =g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, ".1s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", 4)
        .attr("y", margin.top)
        .attr("dy", ".71em")
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text(data.y));
let hexbin =d3.hexbin()
    .x(d => x(d.x)) //d.x gets transformed to x(d.x)
    .y(d => y(d.y))
    .radius(7)
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

let bins=hexbin(data); //data in each bin. how many objects(x and y points) in each bin
let color =d3.scaleLinear()
.domain([0, d3.max(bins, d => d.length) / 2]) //max number of points in one bin
.range(["#c8efe3",  "#1792a4"]); //colour ranges from transparent to 69b3a2
return(hexchart())}; 

if (scatter){ //if scatter is true
function scatterchart(){
    let svg = d3.select("#my_dataviz")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "scatter_svg ")
    
        svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("path")
            .datum(data) 
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1.5)
            .attr("fill", "none")
            .attr("d", line)
        
        svg.append("g")
        .selectAll("dot")
        .data(data) 
        .enter().append('circle')
            .attr("cx", (d => x(d.x)))
            .attr("cy", (d=> y(d.y)))
            .attr("r", 5)       //.attr("fill", "white");
            .attr("fill", "#69b3a2");
    return svg.node();
}
let x= d3.scaleLinear()
    .domain([0, width])
    .range([ 0, width - margin.left-margin.right])

let y= d3.scaleLinear()
    .domain([0, height])
    .range([ height - margin.top - margin.bottom, 0])

let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", -4)
        .text(data.x));
let yAxis =g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, ".1s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", 4)
        .attr("y", margin.top)
        .attr("dy", ".71em")
        .text(data.y));
let line =d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y))
return(scatterchart())
}
};

function getDistance(xA, yA, xB, yB) { 
    var xDiff = xA - xB; 
    var yDiff = yA - yB;

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

async function fixation_detection(data,t1,t2,minDur,maxx,maxy){
    let x=[],y=[],t=[]
    for (i=0; i<data.length; i++){
    x.push(Object.values(data[i])[0])
    y.push(Object.values(data[i])[1])
    t.push(Object.values(data[i])[2])
    }
    
    // x=math.matrix(x)
    // y=math.matrix(y)
    // t=math.matrix(t)

    let fixx,fixy,number_t2,start_time,end_time,duration;
    //let fixations_list_t2=math.matrix(['x','y','clock','id'])
    //let fixations_list_t2=['x','y','clock','id'];
    let fixations_list_t2=[];
    let fixation_list_3s=math.matrix()
    n=x.length;//which is also data.length
    //temp=math.zeros(1,n)._data
    //math.squeeze(temp)   
    let temp=Array(n).fill(0)
    //let fixations=math.matrix([x,y,t,temp]);
    fixations=math.squeeze(math.matrix([x,y,t,temp])._data);
    let fixid=0; //fixation id
    let mx=0; //mean coordinate x
    let my=0; //mean coordinate y
    let d=0;  //dinstance between data point and mean point
    let fixpointer=0; //fixations pointer
    for (i=0; i<n; i++){
        let a=x; //not sure if slice changes x permanently
        let b=y;
        mx=math.mean(a.slice(fixpointer,i+1));
        my=math.mean(b.slice(fixpointer,i+1));
        d=getDistance(mx,my,x[i],y[i]);
        if (d>t1){
            fixid=fixid+1;
            fixpointer=i;
        }
        fixations[3][i]=fixid
    }
    // end of clustering according to tolerance 1
    // number of fixation after clustering (t1)
    let number_fixations=fixations[3][n-1]

    // initialize the list of points which are not participate in fixation analysis
    // let list_of_out_points=[0, 0, 0, -1];
    const fixc=[]
    for(i=0;i<number_fixations;i++){
        let fixcord=await fixations_t2(fixations,i,t2)
        if (fixcord){
        fixc.push(fixcord)
        }else{
            fixc=[{x:0, y:0, clock:0}]
        }
    }
    //t2
    return fixc
} 

async function fixations_t2(fixations,fixation_id,t2){ //fixations after t1 criterion
    //let nt2= math.size(fixations); let gives undefined
    //nt2=nt2.subset(math.index(1,1))  size is num. of arrays vs length
    nt2= math.size(fixations)
    nt2=nt2[1]
    let fixations_idt2=[]
    for (i=0; i< n; i++){
        if (fixations[3][i]==fixation_id){
            fixations_idt2.push([fixations[0][i],fixations[1][i],fixations[2][i],fixations[3][i]])
        }
    }  
    console.log(fixations_idt2)
    let number_t1=math.size(fixations_idt2);
    //number_t1=number_t1.subset(math.index(0,0))
    number_t1=number_t1[0]; //size is different as its a series of arrays
    let xt2=[]
    let yt2=[]  
    for (i=0; i<number_t1; i++){
        xt2.push(fixations_idt2[i][0])
        yt2.push(fixations_idt2[i][1])
    }
    fixx=math.mean(xt2)
    fixy=math.mean(yt2)
    let dt2=0;

    for (i=0; i<number_t1; i++){
        dt2=getDistance(xt2[i],yt2[i],fixx,fixy)
        if (dt2>t2){
            //fixations_idt2.subset(math.index(i,3),0) //replace with 0;
            fixations_idt2[1][3]=0;
        }
    }

    let nxt2=[]
    let nyt2=[]
     for (i=0;i<number_t1;i++){
        if (fixations_idt2[i][3]>0){
            fixations_list_t2.push([fixations_idt2[i][0],fixations_idt2[i][1],fixations_idt2[i][2],fixations_idt2[i][3]]);//adds the ith row of fix to ath row of list
            nxt2.push(fixations_idt2[i][0])
            nyt2.push(fixations_idt2[i][1])                
        } //else {
        //     list_out_points.subset(math.index(b,[0,1,2,3]),list_out_points.subset(math.index(i,[0,1,2,3])));
        //     b=b+1 
        // }
    }
    // number_t2=math.size(fixations_list_t2);
    // number_t2=number_t2[1]
    console.log(fixations_idt2)


    //let start_time=0, endtime=0, duration=0;   
    if (nxt2.length>0){
        fixx=math.mean(nxt2)
        fixy=math.mean(nyt2)
        start_time=fixations_idt2[0][2];
        end_time=fixations_idt2[number_t1-1][2];
        duration=end_time- start_time;
        let fixcord=({x: fixx, y: fixy, clock: duration})
        return fixcord
    } else {
        return null
    }//list out points https://github.com/krasvas/EyeMMV/blob/master/fixations_t2.m
}

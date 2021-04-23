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

async function d3dense(file){ //,TforCSV){
    const margin = {top: 10, right: 30, bottom: 30, left: 40};
    function chart()//d3,width,height,xAxis,yAxis,bins,hexbin,color
    {
        let svg=d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width )
        .attr("height", height)
        .attr("class", "graph_svg ");


        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("g")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.1)
        .selectAll("path")
        .data(bins) 
        .enter().append('path')
            .attr("d",  hexbin.hexagon())
            .attr("transform", d => `translate(${d.x},${d.y})`)
            //.attr("fill", "white");
            .attr("fill", d => color(d.length));

        return svg.node();
    }
    let data= Object.assign(d3.csvParse(file, ({x, y, clock}) => ({x: +x, y: +y})), {x: "", y: ""});
    
    let x= d3.scaleLinear()
            .domain([0, width])
            .range([ 0, width - margin.left-margin.right])

    let y= d3.scaleLinear()
            .domain([0, height])
            .range([ height - margin.top - margin.bottom, 0]) 
    
    let xAxis = g => g
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
            .x(d => x(d.x))
            .y(d => y(d.y))
            .radius(7)
            .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);
    
    let bins=hexbin(data);

    
    let color =d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length) / 2]) //max number of points in one bin
        .range(["transparent",  "#69b3a2"])


    return(chart());
};



   
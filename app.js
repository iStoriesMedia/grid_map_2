function drawGridMap(url) {

  let regions = [];

  let color = d3.scaleThreshold()
        .range(['#3e4858', '#5b6576', '#7b8393', '#9ca3b1', '#c0c4cd', '#e6e6e6'].reverse())
        .domain([50000, 100000, 1000000, 10000000, 20000000, 45000000]);

  let legendLinear = d3.scaleLinear()
                .domain(color.domain())
                .range(color.range());

  let legend = d3.legendColor()
                .cells([50000, 100000, 1000000, 10000000, 20000000, 45000000])
                .orient('horizontal')
                .scale(legendLinear)
                .labelFormat(d3.format(",.0f"))
                .title('');


  let width, height, cellSize, regionGroup, text, title, title2, credit1, credit2, tooltip, notion;

  let svg = d3.select('#svgGrid');
  let region = svg.append("g");

  svg.append('g')
      .attr('class', 'legend')


  d3.select("#grid").text().split("\n").forEach(function(line, i) {

    let re = /[\wа-я]+/ig;
    let array1;

    while (array1 = re.exec(line)) regions.push({
      name: array1[0],
      x: array1.index / 5,
      y: i
    })
  });

  d3.json(url, d =>{
    let jsonRegions = d.objects.rus_regions_simpl.geometries;
    for (let i = 0; i < jsonRegions.length; i++){
      let jsonName = jsonRegions[i].properties.short;
      for (let j = 0; j < regions.length; j++){
        let arrName = regions[j].name;
        if(jsonName == arrName){
          regions[j]["shtraf"] = parseInt(jsonRegions[i].properties.shtraf);
        }
      }
    }
    draw()
  });

  let gridWidth = d3.max(regions, function(d) { return d.x; }) + 1,
      gridHeight = d3.max(regions, function(d) { return d.y; }) - 0.01;


  function draw(){

     function zeroToNd(x){ if (x===0)
     {return x.toString().replace('0','нет данных')}
     else{
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")+' руб.'}
    };

    regionGroup = region.selectAll(null)
          .data(regions)
          .enter()
          .append('g')
          .attr("class", function(d){ return 'region ' + d.name})
          .append('rect')
          .attr('fill', function(d){
            return color(d.shtraf)
          })
       .on("mousemove", function(d) {

         tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 40 + "px")
                .style("display", "inline-block")
                .html(zeroToNd(d.shtraf));
       console.log(d.shtraf)})
         .on('mouseout', function(d) {tooltip.style("display", "none");
          });

    regionGroup.attr("transform", function(d) {
                        return "translate(" + (d.x - gridWidth / 2) * cellSize + "," + (d.y - gridHeight / 2) * cellSize + ")"; })
                    .attr("x", -cellSize / 2)
                    .attr("y", -cellSize / 2)
                    .attr("width", cellSize - 1)
                    .attr("height", cellSize - 1);
    text = region.selectAll('g')
                    .append('text')
                    .attr('class', 'regionName')
                    .attr('text-anchor', 'middle')
                    .text(function(d) { return d.name;})

    .on("mousemove", function(d) {
         tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 40 + "px")
                .style("display", "inline-block")
                .html(zeroToNd(d.shtraf));})
         .on('mouseout', function(d) {tooltip.style("display", "none");
          });;

    title = svg.append("text")
        .attr('class', 'title')
        .style("fill", "#676767")
        .text("Россияне должны государству уже как минимум 175 млн рублей");

    title2 = svg.append("text")
        .attr('class', 'title2')
        .style("fill", "#9a9a9a")
        .text("По данным из опубликованных обвинительных решений по 20.6.1 и 6.3 КоАП (апр-май 2020)");

    credit1 = svg.append("text")
        .attr('class', 'credits')
        .style("fill", "#9a9a9a")
        .text("Важные истории, Холод, 2020");

    credit2 = svg.append("text")
        .attr('class', 'credits')
        .style("fill", "#6769a9a9a767")
        .text("");

    notion = svg.append("text")
        .attr('class', 'notion')
        .style("fill", "#9a9a9a")
        .text("* единственный суд в Байконуре — российский, так как Россия арендовала город у Казахстана ");

     tooltip = d3.select("body").append("div").attr("class", "toolTip");



    d3.select(window).on('resize', resize);
    resize()
  };


  function resize(){

    let bounds = d3.select('#viz').node().getBoundingClientRect();
    width = bounds.width;
    height = width/1.79;
    cellSize = width * 0.042;

    svg
      .attr('width', width)
      .attr('height', height)

    title
      .attr('x', width/95)
      .attr('y', height*0.04)

    title2
      .attr('x', width/95)
      .attr('y', height*0.085)

    credit2
      .attr('x', width/95)
      .attr('y', height*0.1)

    credit1
      .attr('x', width/95)
      .attr('y', height*0.99)

    notion
      .attr('x', width/2.6)
      .attr('y', height*0.99)





    region.attr("transform", `translate(${width/2}, ${height/2})`);

    regionGroup.attr("transform", function(d) {
            return "translate(" + (d.x - gridWidth / 2) * cellSize + "," + (d.y - gridHeight / 2) * cellSize + ")"; })
        .attr("x", -cellSize / 2)
        .attr("y", -cellSize / 2)
        .attr("width", cellSize - 1)
        .attr("height", cellSize - 1);

    text
        .attr("transform", function(d) {
            return "translate(" + (d.x - gridWidth / 2) * cellSize + "," + (d.y - (gridHeight / 2)+0.1) * cellSize + ")"; })

    legend.shapeWidth(cellSize);
    svg.select(".legend")
            .attr("transform", `translate(${width - cellSize*10},${height - cellSize*2.5})`)
            .call(legend);
  };

};


drawGridMap('data_map.json');









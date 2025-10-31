// Line chart: ARE spot prices over years
(async function(){
  try {
    const data = await loadCSVData('Ex5_ARE_Spot_Prices.csv');
    // parse
    const parsed = data.map(d=>({
      Year: +d['Year'],
      AvgPrice: +d['Average Price (notTas-Snowy)']
    })).filter(d=>!isNaN(d.Year) && !isNaN(d.AvgPrice)).sort((a,b)=>a.Year-b.Year);

    const container = d3.select('#chart1');
    function draw(){
      container.selectAll('*').remove();
      const w = container.node().clientWidth || 560;
      const h = Math.max(260, container.node().clientHeight || 320);
      const margin = {top:20,right:20,bottom:40,left:50};
      const width = w - margin.left - margin.right;
      const height = h - margin.top - margin.bottom;

      const svg = container.append('svg').attr('width',w).attr('height',h);
      const g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain(d3.extent(parsed,d=>d.Year)).range([0,width]);
      const y = d3.scaleLinear().domain([0,d3.max(parsed,d=>d.AvgPrice)]).nice().range([height,0]);

      const xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));
      const yAxis = d3.axisLeft(y);

      g.append('g').attr('transform',`translate(0,${height})`).call(xAxis);
      g.append('g').call(yAxis);

      const line = d3.line().x(d=>x(d.Year)).y(d=>y(d.AvgPrice));
      g.append('path').datum(parsed).attr('fill','none').attr('stroke','#1f77b4').attr('stroke-width',2).attr('d',line);

      // points
      g.selectAll('circle').data(parsed).enter().append('circle').attr('cx',d=>x(d.Year)).attr('cy',d=>y(d.AvgPrice)).attr('r',3).attr('fill','#1f77b4');

      // title
      svg.append('text').attr('x',w/2).attr('y',14).attr('text-anchor','middle').attr('font-weight','600').text('ARE Average Spot Price (notTas-Snowy) by Year');
    }

    draw();
    window.addEventListener('resize', draw);
  } catch (err){
    console.error('chart1 error',err);
  }
})();

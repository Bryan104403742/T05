// Bar chart: mean energy consumption for 55in TVs by screen tech
(async function(){
  try {
    const data = await loadCSVData('Ex5_TV_energy_55inchtv_byScreenType.csv');
    // find the mean column name (second column)
    if (!data || !data.length) return;
    const valueCol = Object.keys(data[0]).find(k=>k.toLowerCase().indexOf('mean')>=0) || Object.keys(data[0])[1];
    const parsed = data.map(d=>({tech: d['Screen_Tech'] || d['Screen_Tech'], value: +d[valueCol]})).filter(d=>!isNaN(d.value));

    const container = d3.select('#chart3');
    function draw(){
      container.selectAll('*').remove();
      const w = container.node().clientWidth || 560;
      const h = Math.max(260, container.node().clientHeight || 320);
      const margin = {top:20,right:20,bottom:60,left:60};
      const width = w - margin.left - margin.right;
      const height = h - margin.top - margin.bottom;

      const svg = container.append('svg').attr('width',w).attr('height',h);
      const g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand().domain(parsed.map(d=>d.tech)).range([0,width]).padding(0.2);
      const y = d3.scaleLinear().domain([0,d3.max(parsed,d=>d.value)]).nice().range([height,0]);

      g.append('g').attr('transform',`translate(0,${height})`).call(d3.axisBottom(x)).selectAll('text').attr('transform','rotate(-20)').style('text-anchor','end');
      g.append('g').call(d3.axisLeft(y));

      g.selectAll('rect').data(parsed).enter().append('rect')
        .attr('x',d=>x(d.tech))
        .attr('y',d=>y(d.value))
        .attr('width',x.bandwidth())
        .attr('height',d=>height-y(d.value))
        .attr('fill','#ff9800');

      svg.append('text').attr('x',w/2).attr('y',14).attr('text-anchor','middle').attr('font-weight','600').text('Mean Energy Consumption (55in TVs) by Screen Tech');
    }

    draw(); window.addEventListener('resize', draw);
  } catch (err){ console.error('chart3 error',err); }
})();

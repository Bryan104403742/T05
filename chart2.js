// Scatter plot: energy_consumpt vs star rating from Ex5_TV_energy.csv
(async function(){
  try {
    const data = await loadCSVData('Ex5_TV_energy.csv');
    const parsed = data.map(d=>({
      screen_tech: d['screen_tech'],
      energy: +d['energy_consumpt'],
      star: +d['star2']
    })).filter(d=>!isNaN(d.energy) && !isNaN(d.star));

    const container = d3.select('#chart2');
    function draw(){
      container.selectAll('*').remove();
      const w = container.node().clientWidth || 560;
      const h = Math.max(260, container.node().clientHeight || 320);
      const margin = {top:20,right:20,bottom:50,left:60};
      const width = w - margin.left - margin.right;
      const height = h - margin.top - margin.bottom;

      const svg = container.append('svg').attr('width',w).attr('height',h);
      const g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain(d3.extent(parsed,d=>d.star)).nice().range([0,width]);
      const y = d3.scaleLinear().domain([0,d3.max(parsed,d=>d.energy)]).nice().range([height,0]);

      g.append('g').attr('transform',`translate(0,${height})`).call(d3.axisBottom(x));
      g.append('g').call(d3.axisLeft(y));

      const color = d3.scaleOrdinal(d3.schemeCategory10).domain([...new Set(parsed.map(d=>d.screen_tech))]);

      g.selectAll('circle').data(parsed).enter().append('circle')
        .attr('cx',d=>x(d.star))
        .attr('cy',d=>y(d.energy))
        .attr('r',3.5)
        .attr('fill',d=>color(d.screen_tech))
        .attr('opacity',0.8);

      svg.append('text').attr('x',w/2).attr('y',14).attr('text-anchor','middle').attr('font-weight','600').text('TV Energy Consumption vs Star Rating');
      svg.append('text').attr('x',w/2).attr('y',h-6).attr('text-anchor','middle').attr('font-size','0.9rem').text('Star rating (x) — Energy consumption (kWh/year) (y)');
    }

    draw(); window.addEventListener('resize', draw);
  } catch (err){ console.error('chart2 error',err); }
})();

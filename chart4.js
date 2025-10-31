// Pie chart: mean energy consumption for all sizes by screen tech
(async function(){
  try {
    const data = await loadCSVData('Ex5_TV_energy_Allsizes_byScreenType.csv');
    if (!data || !data.length) return;
    const valueCol = Object.keys(data[0]).find(k=>k.toLowerCase().indexOf('mean')>=0) || Object.keys(data[0])[1];
    const parsed = data.map(d=>({tech: d['Screen_Tech'] || d['Screen_Tech'], value: +d[valueCol]})).filter(d=>!isNaN(d.value));

    const container = d3.select('#chart4');
    function draw(){
      container.selectAll('*').remove();
      const w = container.node().clientWidth || 480;
      const h = Math.max(260, container.node().clientHeight || 320);
      const radius = Math.min(w,h)/2 - 20;
      const svg = container.append('svg').attr('width',w).attr('height',h);
      const g = svg.append('g').attr('transform',`translate(${w/2},${h/2})`);

      const color = d3.scaleOrdinal().domain(parsed.map(d=>d.tech)).range(d3.schemeCategory10);
      const pie = d3.pie().value(d=>d.value)(parsed);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);

      g.selectAll('path').data(pie).enter().append('path').attr('d',arc).attr('fill',d=>color(d.data.tech)).attr('stroke','#fff');

      // labels
      g.selectAll('text').data(pie).enter().append('text').attr('transform',d=>`translate(${arc.centroid(d)})`).attr('text-anchor','middle').attr('font-size','0.85rem').text(d=>d.data.tech);

      svg.append('text').attr('x',w/2).attr('y',14).attr('text-anchor','middle').attr('font-weight','600').text('Mean Energy Consumption (All sizes) by Screen Tech');
    }

    draw(); window.addEventListener('resize', draw);
  } catch (err){ console.error('chart4 error',err); }
})();

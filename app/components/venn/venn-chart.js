/* global d3 */

import venn from 'venn.js';
import d3Tip from 'd3-tip';
import 'd3-tip/examples/example-styles.css!';

export default function (data) {
  const container = d3.select(this);

  const keys = Object.keys(data[0]).filter(d => d !== 'size');

  // console.log(keys);

  const colourScheme = ['lime', 'blue', 'red'];
  const vennColors = d3.scale.ordinal()
    .domain(keys)
    .range(colourScheme);

  function barColors (d) {
    let color = 'white';
    keys.forEach(k => {
      if (d[k] === true) {
        color = d3.interpolateRgb(color, vennColors(k))(0.3);
      }
    });
    return color;
  }

  const sFormat = d3.format('s');

  const tooltip = d3Tip().attr('class', 'd3-tip d3-tip-venn animate-top')
    .direction('w')
    .offset([0, -10])
    .html(d => {
      let html = d.label;
      if (d.size) {
        html += '<br />' + d.size;
      }
      return html;
    });

  data.forEach(d => {
    d.size = Number(d.size);
    d.sets = keys.filter(k => {
      d[k] = d[k] === 'true';
      return d[k];
    });
    d.label = d.sets.join(' + ');
    /* d.label = keys.map(k => {
      return d[k] ? k : `(${k})`;
    }).join(' ∩ '); */
  });

  data.sort((a, b) => d3.ascending(a.size, b.size));

  const intersect = getSetIntersections(data);

  makeVenn(intersect, d => d.size, 'Venn');
  makeBar(data, d => d.size, 'Number');
  makeBar(intersect, d => d.size, 'Total Number');

  return;

  // const fmt = d3.format('0,000');

  function getSetIntersections (data) {
    return data.map(d => ({
      ...d,
      label: d.sets.join(' ∩ '),
      size: d3.sum(data, e => d.sets.every(ch => e.sets.includes(ch)) ? e.size : 0)
    }));
  }

  function makeVenn (data, f, t) {
    const width = 400;
    const height = 400;

    const chart = new venn.VennDiagram()
      .colours(vennColors)
      .width(width)
      .height(height);

    const svg = container
      .append('div')
        .attr('class', 'chart col-xs-12 text-center')
        .datum(data)
        .call(chart);

    svg.select('svg')
      .attr('title', t);

    svg.selectAll('text')   // todo: move to CSS
      .style('fill', 'black');
    svg.selectAll('path')
      .attr('opacity', '0.2')
      .style('fill-opacity', '1');
    svg.selectAll('.venn-intersection')
      .attr('opacity', '0')
      .style('fill-opacity', '0');
    svg.selectAll('.venn-intersection path')
      .attr('opacity', '0')
      .style('fill-opacity', '0');
  }

  function makeBar (data, f, t) {
    const padding = {top: 70, right: 10, bottom: 10, left: 10};

    const height = 400;
    const width = 300;

    const max = d3.max(data, f);

    const x = d3.scale.linear()
      .domain([0, max])
      .range([0, width]).nice();

    const div = container
      .append('div')
        .attr('class', 'col-xs-6 text-center');

    const chart = div
      .append('svg')
        .attr('title', t)
        .attr('class', 'chart')
        .attr('width', width + (2 * (padding.left + padding.right))).attr('height', height + padding.left + padding.right)
        .append('g')
          .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

    chart.call(tooltip);

    chart.append('text')
      .attr('class', 'title')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .text(t);

    const bars = chart.selectAll('.percent_bar')
      .data(data)
      .enter().append('rect')
        .attr('class', 'percent_bar')
        .attr('y', (d, i) => {
          return i * 30 + 30;
        })
        .attr('x', 0)
        .attr('height', 25)
        // .attr('width', function(d) { return x(f(d)); })
        .style('fill', barColors)
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide);

    bars
      .transition().duration(1000)
      .attr('width', d => x(f(d)));

    const yAxis = d3.svg.axis().scale(x).ticks(5).orient('bottom').tickFormat(sFormat);

    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,5)')
      .call(yAxis);

    chart.selectAll('.label')
      .data(data)
      .enter().append('text')
        .attr('class', 'label')
        .attr('y', (d, i) => i * 30 + 30 + 17)
        .attr('x', d => x(f(d)) + 5)
        .attr('text-anchor', 'right')
        .text(d => d.label);
  }
}

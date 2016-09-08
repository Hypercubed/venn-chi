import d3 from 'd3';

import './venn.css!';
import chart from './venn-chart';

const clone = o => Object.assign({}, o);

function controller () {
  const $ctrl = this;

  $ctrl.editorOptions = {
    data: this.dataPackage,
    enableOpen: true,
    onChange,
    $onInit: onChange
  };

  function onChange () {
    const data = $ctrl.dataPackage.resources
      .filter(d => Boolean(d.data))
      .map(d => d.data.map(clone));

    const container = d3.select('#_venn__chart');

    container.selectAll('div').remove();

    const divs = container
      .selectAll('div')
      .data(data);

    divs.enter().append('div');

    divs.each(chart);
  }
}

export default {
  controller,
  templateUrl: 'components/venn/venn.html',
  bindings: {
    dataPackage: '<package'
  }
};

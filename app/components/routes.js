import angular from 'angular';

import aboutHTML from './about/about.md!md';
import vennComponent from './venn/venn';

configRoutes.$inject = ['$routeProvider'];
function configRoutes ($routeProvider) {
  $routeProvider
    .when('/about', {
      template: aboutHTML
    })
    .when('/', {
      template: '<venn data-package="$resolve.dataPackage"></venn>',
      datapackageUrl: 'components/venn/datapackage.json'
    })
    .otherwise({
      redirectTo: '/'
    });
}

export default angular
  .module('routes', ['projectX.dataService'])
  .component('venn', vennComponent)
  .config(configRoutes);

import pkg from '../package.json';

export default {
  deploy: {
    ghPages: {
      remoteUrl: 'git@github.com:Hypercubed/venn-chi.git',
      branch: 'gh-pages'
    }
  },
  template: {
    title: 'Project-χ - Venn',
    webcomponents: false,
    version: pkg.version
  }
};

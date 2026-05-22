import { defineConfig } from 'cypress';
import setupCoverage from './cypress/plugins/index';

export default defineConfig({
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      return setupCoverage(on, config);
    },
    baseUrl: 'http://localhost:4200',
  },
});

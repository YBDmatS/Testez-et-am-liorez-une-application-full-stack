/**
 * @type {Cypress.PluginConfig}
 */
import registerCodeCoverageTasks from '@cypress/code-coverage/task';

const setupCoverage = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  return registerCodeCoverageTasks(on, config);
};

export default setupCoverage;

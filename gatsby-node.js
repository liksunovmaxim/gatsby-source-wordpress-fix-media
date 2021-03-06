"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _runSteps = require("./utils/run-steps");

var steps = _interopRequireWildcard(require("./steps/index"));

module.exports = (0, _runSteps.runApisInSteps)({
  createSchemaCustomization: [steps.setGatsbyApiToState, steps.ensurePluginRequirementsAreMet, steps.ingestRemoteSchema, steps.createSchemaCustomization],
  sourceNodes: [steps.setGatsbyApiToState, steps.persistPreviouslyCachedImages, steps.sourcePreviews, steps.sourceNodes, steps.setImageNodeIdCache],
  onPostBuild: [steps.setImageNodeIdCache],
  onCreateDevServer: [steps.setImageNodeIdCache, steps.startPollingForContentUpdates]
});
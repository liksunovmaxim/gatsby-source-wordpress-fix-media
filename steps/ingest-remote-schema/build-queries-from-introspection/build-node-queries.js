"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.buildNodeQueries = void 0;

var _store = _interopRequireDefault(require("../../../store"));

var _getGatsbyApi = require("../../../utils/get-gatsby-api");

var _generateQueriesFromIngestableTypes = _interopRequireDefault(require("./generate-queries-from-ingestable-types"));

/**
 * buildNodeQueries
 *
 * Uses plugin options to introspect the remote GraphQL
 * source, run cache logic, and generate GQL query strings/info
 *
 * @returns {Object} GraphQL query info including gql query strings
 */
const buildNodeQueries = async () => {
  const {
    pluginOptions,
    helpers
  } = (0, _getGatsbyApi.getGatsbyApi)();
  const QUERY_CACHE_KEY = `${pluginOptions.url}--introspection-node-queries`;
  let nodeQueries = await helpers.cache.get(QUERY_CACHE_KEY);

  const {
    schemaWasChanged
  } = _store.default.getState().remoteSchema;

  if (schemaWasChanged || !nodeQueries) {
    // regenerate queries from introspection
    nodeQueries = await (0, _generateQueriesFromIngestableTypes.default)(); // and cache them

    await helpers.cache.set(QUERY_CACHE_KEY, nodeQueries);
  } // set the queries in our redux store to use later


  _store.default.dispatch.remoteSchema.setState({
    nodeQueries
  });

  return nodeQueries;
};

exports.buildNodeQueries = buildNodeQueries;
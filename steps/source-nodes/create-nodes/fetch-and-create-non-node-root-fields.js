"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _store = _interopRequireDefault(require("../../../store"));

var _fetchGraphql = _interopRequireDefault(require("../../../utils/fetch-graphql"));

var _formatLogMessage = require("../../../utils/format-log-message");

var _createNodes = require("./create-nodes");

var _fetchReferencedMediaItems = _interopRequireDefault(require("../fetch-nodes/fetch-referenced-media-items"));

var _constants = require("../../../constants");

const fetchAndCreateNonNodeRootFields = async () => {
  const {
    remoteSchema: {
      nonNodeQuery,
      wpUrl
    },
    gatsbyApi: {
      helpers,
      pluginOptions
    }
  } = _store.default.getState();

  const {
    actions,
    createContentDigest,
    cache,
    reporter
  } = helpers;
  const activity = reporter.activityTimer((0, _formatLogMessage.formatLogMessage)(`fetch root fields`));
  activity.start();
  const {
    data
  } = await (0, _fetchGraphql.default)({
    query: nonNodeQuery,
    errorContext: `Error occured while fetching non-Node root fields.`
  });
  const createdNodeIds = []; // const totalSideEffectNodes = []

  const referencedMediaItemNodeIds = new Set();
  const type = pluginOptions.schema.typePrefix;
  const node = Object.assign({}, data, {
    id: `${pluginOptions.url}--rootfields`,
    type
  });
  const createRootNode = (0, _createNodes.createNodeWithSideEffects)({
    node,
    actions,
    createContentDigest,
    pluginOptions,
    referencedMediaItemNodeIds,
    helpers,
    createdNodeIds,
    // totalSideEffectNodes,
    wpUrl,
    type
  });
  createRootNode();
  const referencedMediaItemNodeIdsArray = [...referencedMediaItemNodeIds];
  const newMediaItemIds = referencedMediaItemNodeIdsArray.filter(id => !helpers.getNode(id));
  /**
   * if we're not lazy fetching media items, we need to fetch them
   * upfront here
   */

  if (!pluginOptions.type.MediaItem.lazyNodes && newMediaItemIds.length) {
    _store.default.dispatch.logger.createActivityTimer({
      typeName: `MediaItems`,
      pluginOptions,
      reporter
    });

    await (0, _fetchReferencedMediaItems.default)({
      referencedMediaItemNodeIds: newMediaItemIds
    });
    const previouslyCachedNodeIds = await cache.get(_constants.CREATED_NODE_IDS);
    const createdNodeIds = [...new Set([...previouslyCachedNodeIds, ...referencedMediaItemNodeIdsArray])]; // save the node id's so we can touch them on the next build
    // so that we don't have to refetch all nodes

    await cache.set(_constants.CREATED_NODE_IDS, createdNodeIds);

    _store.default.dispatch.logger.stopActivityTimer({
      typeName: `MediaItems`
    });
  }

  activity.end();
};

var _default = fetchAndCreateNonNodeRootFields;
exports.default = _default;
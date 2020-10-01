"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createContentTypeNodes = void 0;

require("source-map-support/register");

var _graphqlQueries = require("../utils/graphql-queries");

var _fetchGraphql = _interopRequireDefault(require("../utils/fetch-graphql"));

var _store = _interopRequireDefault(require("../store"));

var _helpers = require("./create-schema-customization/helpers");

var _formatLogMessage = require("../utils/format-log-message");

/**
 *
 * This func is temporary until support for this added in WPGQL
 * see https://github.com/wp-graphql/wp-graphql/issues/1045
 */
const createContentTypeNodes = async ({
  webhookBody: {
    preview
  },
  cache
}, pluginOptions) => {
  if (preview) {
    return null;
  }

  const contentTypesCacheKey = `WP_CONTENT_TYPES_DATA`;
  let cachedContentTypesData = await cache.get(contentTypesCacheKey);

  const state = _store.default.getState();

  const {
    schemaWasChanged
  } = state.remoteSchema;
  const refetchContentTypes = schemaWasChanged || !cachedContentTypesData;
  const {
    nodeQueries,
    fieldBlacklist
  } = state.remoteSchema;
  const {
    helpers
  } = state.gatsbyApi;
  const activity = helpers.reporter.activityTimer((0, _formatLogMessage.formatLogMessage)(`fetch content types`));

  if (refetchContentTypes) {
    if (pluginOptions.verbose) {
      activity.start();
    }

    const {
      data
    } = await (0, _fetchGraphql.default)({
      query: _graphqlQueries.availablePostTypesQuery
    });
    await cache.set(contentTypesCacheKey, data);
    cachedContentTypesData = data;
  }

  const contentTypes = cachedContentTypesData.postTypes.filter(contentType => !fieldBlacklist.includes(contentType.fieldNames.plural)).map(contentTypeObj => {
    const contentTypeQueryInfo = nodeQueries[contentTypeObj.fieldNames.plural];
    const {
      typeInfo
    } = contentTypeQueryInfo;
    return helpers.actions.createNode(Object.assign({}, typeInfo, {
      id: helpers.createNodeId(`${typeInfo.nodesTypeName}${typeInfo.singularName}--content-type`),
      parent: null,
      internal: {
        contentDigest: helpers.createContentDigest(typeInfo),
        type: (0, _helpers.buildTypeName)(`ContentType`)
      }
    }));
  });

  if (pluginOptions.verbose && refetchContentTypes) {
    activity.end();
  }

  return contentTypes;
};

exports.createContentTypeNodes = createContentTypeNodes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdGVwcy9nZXQtY29udGVudC10eXBlcy5qcyJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZW50VHlwZU5vZGVzIiwid2ViaG9va0JvZHkiLCJwcmV2aWV3IiwiY2FjaGUiLCJwbHVnaW5PcHRpb25zIiwiY29udGVudFR5cGVzQ2FjaGVLZXkiLCJjYWNoZWRDb250ZW50VHlwZXNEYXRhIiwiZ2V0Iiwic3RhdGUiLCJzdG9yZSIsImdldFN0YXRlIiwic2NoZW1hV2FzQ2hhbmdlZCIsInJlbW90ZVNjaGVtYSIsInJlZmV0Y2hDb250ZW50VHlwZXMiLCJub2RlUXVlcmllcyIsImZpZWxkQmxhY2tsaXN0IiwiaGVscGVycyIsImdhdHNieUFwaSIsImFjdGl2aXR5IiwicmVwb3J0ZXIiLCJhY3Rpdml0eVRpbWVyIiwidmVyYm9zZSIsInN0YXJ0IiwiZGF0YSIsInF1ZXJ5IiwiYXZhaWxhYmxlUG9zdFR5cGVzUXVlcnkiLCJzZXQiLCJjb250ZW50VHlwZXMiLCJwb3N0VHlwZXMiLCJmaWx0ZXIiLCJjb250ZW50VHlwZSIsImluY2x1ZGVzIiwiZmllbGROYW1lcyIsInBsdXJhbCIsIm1hcCIsImNvbnRlbnRUeXBlT2JqIiwiY29udGVudFR5cGVRdWVyeUluZm8iLCJ0eXBlSW5mbyIsImFjdGlvbnMiLCJjcmVhdGVOb2RlIiwiaWQiLCJjcmVhdGVOb2RlSWQiLCJub2Rlc1R5cGVOYW1lIiwic2luZ3VsYXJOYW1lIiwicGFyZW50IiwiaW50ZXJuYWwiLCJjb250ZW50RGlnZXN0IiwiY3JlYXRlQ29udGVudERpZ2VzdCIsInR5cGUiLCJlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOzs7OztBQUtPLE1BQU1BLHNCQUFzQixHQUFHLE9BQ3BDO0FBQUVDLEVBQUFBLFdBQVcsRUFBRTtBQUFFQyxJQUFBQTtBQUFGLEdBQWY7QUFBNEJDLEVBQUFBO0FBQTVCLENBRG9DLEVBRXBDQyxhQUZvQyxLQUdqQztBQUNILE1BQUlGLE9BQUosRUFBYTtBQUNYLFdBQU8sSUFBUDtBQUNEOztBQUVELFFBQU1HLG9CQUFvQixHQUFJLHVCQUE5QjtBQUNBLE1BQUlDLHNCQUFzQixHQUFHLE1BQU1ILEtBQUssQ0FBQ0ksR0FBTixDQUFVRixvQkFBVixDQUFuQzs7QUFFQSxRQUFNRyxLQUFLLEdBQUdDLGVBQU1DLFFBQU4sRUFBZDs7QUFDQSxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBdUJILEtBQUssQ0FBQ0ksWUFBbkM7QUFFQSxRQUFNQyxtQkFBbUIsR0FBR0YsZ0JBQWdCLElBQUksQ0FBQ0wsc0JBQWpEO0FBRUEsUUFBTTtBQUFFUSxJQUFBQSxXQUFGO0FBQWVDLElBQUFBO0FBQWYsTUFBa0NQLEtBQUssQ0FBQ0ksWUFBOUM7QUFFQSxRQUFNO0FBQUVJLElBQUFBO0FBQUYsTUFBY1IsS0FBSyxDQUFDUyxTQUExQjtBQUVBLFFBQU1DLFFBQVEsR0FBR0YsT0FBTyxDQUFDRyxRQUFSLENBQWlCQyxhQUFqQixDQUNmLHdDQUFrQixxQkFBbEIsQ0FEZSxDQUFqQjs7QUFJQSxNQUFJUCxtQkFBSixFQUF5QjtBQUN2QixRQUFJVCxhQUFhLENBQUNpQixPQUFsQixFQUEyQjtBQUN6QkgsTUFBQUEsUUFBUSxDQUFDSSxLQUFUO0FBQ0Q7O0FBRUQsVUFBTTtBQUFFQyxNQUFBQTtBQUFGLFFBQVcsTUFBTSwyQkFBYTtBQUFFQyxNQUFBQSxLQUFLLEVBQUVDO0FBQVQsS0FBYixDQUF2QjtBQUVBLFVBQU10QixLQUFLLENBQUN1QixHQUFOLENBQVVyQixvQkFBVixFQUFnQ2tCLElBQWhDLENBQU47QUFFQWpCLElBQUFBLHNCQUFzQixHQUFHaUIsSUFBekI7QUFDRDs7QUFFRCxRQUFNSSxZQUFZLEdBQUdyQixzQkFBc0IsQ0FBQ3NCLFNBQXZCLENBQ2xCQyxNQURrQixDQUVqQkMsV0FBVyxJQUFJLENBQUNmLGNBQWMsQ0FBQ2dCLFFBQWYsQ0FBd0JELFdBQVcsQ0FBQ0UsVUFBWixDQUF1QkMsTUFBL0MsQ0FGQyxFQUlsQkMsR0FKa0IsQ0FJZEMsY0FBYyxJQUFJO0FBQ3JCLFVBQU1DLG9CQUFvQixHQUFHdEIsV0FBVyxDQUFDcUIsY0FBYyxDQUFDSCxVQUFmLENBQTBCQyxNQUEzQixDQUF4QztBQUNBLFVBQU07QUFBRUksTUFBQUE7QUFBRixRQUFlRCxvQkFBckI7QUFFQSxXQUFPcEIsT0FBTyxDQUFDc0IsT0FBUixDQUFnQkMsVUFBaEIsbUJBQ0ZGLFFBREU7QUFFTEcsTUFBQUEsRUFBRSxFQUFFeEIsT0FBTyxDQUFDeUIsWUFBUixDQUNELEdBQUVKLFFBQVEsQ0FBQ0ssYUFBYyxHQUFFTCxRQUFRLENBQUNNLFlBQWEsZ0JBRGhELENBRkM7QUFLTEMsTUFBQUEsTUFBTSxFQUFFLElBTEg7QUFNTEMsTUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFFBQUFBLGFBQWEsRUFBRTlCLE9BQU8sQ0FBQytCLG1CQUFSLENBQTRCVixRQUE1QixDQURQO0FBRVJXLFFBQUFBLElBQUksRUFBRSw0QkFBZSxhQUFmO0FBRkU7QUFOTCxPQUFQO0FBV0QsR0FuQmtCLENBQXJCOztBQXFCQSxNQUFJNUMsYUFBYSxDQUFDaUIsT0FBZCxJQUF5QlIsbUJBQTdCLEVBQWtEO0FBQ2hESyxJQUFBQSxRQUFRLENBQUMrQixHQUFUO0FBQ0Q7O0FBRUQsU0FBT3RCLFlBQVA7QUFDRCxDQTlETSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF2YWlsYWJsZVBvc3RUeXBlc1F1ZXJ5IH0gZnJvbSBcIn4vdXRpbHMvZ3JhcGhxbC1xdWVyaWVzXCJcbmltcG9ydCBmZXRjaEdyYXBocWwgZnJvbSBcIn4vdXRpbHMvZmV0Y2gtZ3JhcGhxbFwiXG5pbXBvcnQgc3RvcmUgZnJvbSBcIn4vc3RvcmVcIlxuaW1wb3J0IHsgYnVpbGRUeXBlTmFtZSB9IGZyb20gXCJ+L3N0ZXBzL2NyZWF0ZS1zY2hlbWEtY3VzdG9taXphdGlvbi9oZWxwZXJzXCJcbmltcG9ydCB7IGZvcm1hdExvZ01lc3NhZ2UgfSBmcm9tIFwifi91dGlscy9mb3JtYXQtbG9nLW1lc3NhZ2VcIlxuXG4vKipcbiAqXG4gKiBUaGlzIGZ1bmMgaXMgdGVtcG9yYXJ5IHVudGlsIHN1cHBvcnQgZm9yIHRoaXMgYWRkZWQgaW4gV1BHUUxcbiAqIHNlZSBodHRwczovL2dpdGh1Yi5jb20vd3AtZ3JhcGhxbC93cC1ncmFwaHFsL2lzc3Vlcy8xMDQ1XG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVDb250ZW50VHlwZU5vZGVzID0gYXN5bmMgKFxuICB7IHdlYmhvb2tCb2R5OiB7IHByZXZpZXcgfSwgY2FjaGUgfSxcbiAgcGx1Z2luT3B0aW9uc1xuKSA9PiB7XG4gIGlmIChwcmV2aWV3KSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGNvbnN0IGNvbnRlbnRUeXBlc0NhY2hlS2V5ID0gYFdQX0NPTlRFTlRfVFlQRVNfREFUQWBcbiAgbGV0IGNhY2hlZENvbnRlbnRUeXBlc0RhdGEgPSBhd2FpdCBjYWNoZS5nZXQoY29udGVudFR5cGVzQ2FjaGVLZXkpXG5cbiAgY29uc3Qgc3RhdGUgPSBzdG9yZS5nZXRTdGF0ZSgpXG4gIGNvbnN0IHsgc2NoZW1hV2FzQ2hhbmdlZCB9ID0gc3RhdGUucmVtb3RlU2NoZW1hXG5cbiAgY29uc3QgcmVmZXRjaENvbnRlbnRUeXBlcyA9IHNjaGVtYVdhc0NoYW5nZWQgfHwgIWNhY2hlZENvbnRlbnRUeXBlc0RhdGFcblxuICBjb25zdCB7IG5vZGVRdWVyaWVzLCBmaWVsZEJsYWNrbGlzdCB9ID0gc3RhdGUucmVtb3RlU2NoZW1hXG5cbiAgY29uc3QgeyBoZWxwZXJzIH0gPSBzdGF0ZS5nYXRzYnlBcGlcblxuICBjb25zdCBhY3Rpdml0eSA9IGhlbHBlcnMucmVwb3J0ZXIuYWN0aXZpdHlUaW1lcihcbiAgICBmb3JtYXRMb2dNZXNzYWdlKGBmZXRjaCBjb250ZW50IHR5cGVzYClcbiAgKVxuXG4gIGlmIChyZWZldGNoQ29udGVudFR5cGVzKSB7XG4gICAgaWYgKHBsdWdpbk9wdGlvbnMudmVyYm9zZSkge1xuICAgICAgYWN0aXZpdHkuc3RhcnQoKVxuICAgIH1cblxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgZmV0Y2hHcmFwaHFsKHsgcXVlcnk6IGF2YWlsYWJsZVBvc3RUeXBlc1F1ZXJ5IH0pXG5cbiAgICBhd2FpdCBjYWNoZS5zZXQoY29udGVudFR5cGVzQ2FjaGVLZXksIGRhdGEpXG5cbiAgICBjYWNoZWRDb250ZW50VHlwZXNEYXRhID0gZGF0YVxuICB9XG5cbiAgY29uc3QgY29udGVudFR5cGVzID0gY2FjaGVkQ29udGVudFR5cGVzRGF0YS5wb3N0VHlwZXNcbiAgICAuZmlsdGVyKFxuICAgICAgY29udGVudFR5cGUgPT4gIWZpZWxkQmxhY2tsaXN0LmluY2x1ZGVzKGNvbnRlbnRUeXBlLmZpZWxkTmFtZXMucGx1cmFsKVxuICAgIClcbiAgICAubWFwKGNvbnRlbnRUeXBlT2JqID0+IHtcbiAgICAgIGNvbnN0IGNvbnRlbnRUeXBlUXVlcnlJbmZvID0gbm9kZVF1ZXJpZXNbY29udGVudFR5cGVPYmouZmllbGROYW1lcy5wbHVyYWxdXG4gICAgICBjb25zdCB7IHR5cGVJbmZvIH0gPSBjb250ZW50VHlwZVF1ZXJ5SW5mb1xuXG4gICAgICByZXR1cm4gaGVscGVycy5hY3Rpb25zLmNyZWF0ZU5vZGUoe1xuICAgICAgICAuLi50eXBlSW5mbyxcbiAgICAgICAgaWQ6IGhlbHBlcnMuY3JlYXRlTm9kZUlkKFxuICAgICAgICAgIGAke3R5cGVJbmZvLm5vZGVzVHlwZU5hbWV9JHt0eXBlSW5mby5zaW5ndWxhck5hbWV9LS1jb250ZW50LXR5cGVgXG4gICAgICAgICksXG4gICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgaW50ZXJuYWw6IHtcbiAgICAgICAgICBjb250ZW50RGlnZXN0OiBoZWxwZXJzLmNyZWF0ZUNvbnRlbnREaWdlc3QodHlwZUluZm8pLFxuICAgICAgICAgIHR5cGU6IGJ1aWxkVHlwZU5hbWUoYENvbnRlbnRUeXBlYCksXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgaWYgKHBsdWdpbk9wdGlvbnMudmVyYm9zZSAmJiByZWZldGNoQ29udGVudFR5cGVzKSB7XG4gICAgYWN0aXZpdHkuZW5kKClcbiAgfVxuXG4gIHJldHVybiBjb250ZW50VHlwZXNcbn1cbiJdfQ==
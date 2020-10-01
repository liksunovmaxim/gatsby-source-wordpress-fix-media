"use strict";

exports.__esModule = true;
exports.categoryBeforeChangeNode = void 0;

require("source-map-support/register");

var _processNode = require("../create-nodes/process-node");

const categoryBeforeChangeNode = async ({
  remoteNode,
  actionType,
  wpStore,
  fetchGraphql,
  helpers,
  actions,
  buildTypeName
}) => {
  var _remoteNode$wpChildre, _remoteNode$wpChildre2;

  if (actionType !== `UPDATE` && actionType !== `CREATE_ALL` && actionType !== `CREATE`) {
    // no need to update children if we're not updating an existing category
    // if we're creating a new category it will be empty initially.
    // so we run this function when updating nodes or when initially
    // creating all nodes
    return null;
  }

  if (!(remoteNode === null || remoteNode === void 0 ? void 0 : (_remoteNode$wpChildre = remoteNode.wpChildren) === null || _remoteNode$wpChildre === void 0 ? void 0 : (_remoteNode$wpChildre2 = _remoteNode$wpChildre.nodes) === null || _remoteNode$wpChildre2 === void 0 ? void 0 : _remoteNode$wpChildre2.length)) {
    // if we don't have any child category items to fetch, skip out
    return null;
  }

  const state = wpStore.getState();
  const {
    selectionSet
  } = state.remoteSchema.nodeQueries.categories;
  const {
    wpUrl
  } = state.remoteSchema;
  const {
    pluginOptions
  } = state.gatsbyApi;
  const query = `
        fragment CATEGORY_FIELDS on Category {
          ${selectionSet}
        }

        query {
            ${remoteNode.wpChildren.nodes.map(({
    id
  }, index) => `id__${index}: category(id: "${id}") { ...CATEGORY_FIELDS }`).join(` `)}
          }`;
  const {
    data
  } = await fetchGraphql({
    query,
    errorContext: `Error occured while recursively fetching "Category" nodes in beforeChangeNode API.`
  });
  const remoteChildCategoryNodes = Object.values(data);
  const additionalNodeIds = remoteChildCategoryNodes.map(({
    id
  } = {}) => id);
  await Promise.all(remoteChildCategoryNodes.map(async remoteCategoryNode => {
    var _remoteCategoryNode$w, _remoteCategoryNode$w2;

    if (remoteCategoryNode === null || remoteCategoryNode === void 0 ? void 0 : (_remoteCategoryNode$w = remoteCategoryNode.wpChildren) === null || _remoteCategoryNode$w === void 0 ? void 0 : (_remoteCategoryNode$w2 = _remoteCategoryNode$w.nodes) === null || _remoteCategoryNode$w2 === void 0 ? void 0 : _remoteCategoryNode$w2.length) {
      // recursively fetch child category items
      const {
        additionalNodeIds: childNodeIds
      } = await categoryBeforeChangeNode({
        remoteNode: remoteCategoryNode,
        actionType: `CREATE`,
        wpStore,
        fetchGraphql,
        helpers,
        actions,
        buildTypeName
      });
      childNodeIds.forEach(id => additionalNodeIds.push(id));
    }

    const type = buildTypeName(`Category`);
    const processedNode = await (0, _processNode.processNode)({
      node: remoteCategoryNode,
      pluginOptions,
      wpUrl,
      helpers
    });
    await actions.createNode(Object.assign({}, processedNode, {
      nodeType: `Category`,
      type: `Category`,
      parent: null,
      internal: {
        contentDigest: helpers.createContentDigest(remoteCategoryNode),
        type
      }
    }));
  }));
  return {
    additionalNodeIds
  };
};

exports.categoryBeforeChangeNode = categoryBeforeChangeNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdGVwcy9zb3VyY2Utbm9kZXMvYmVmb3JlLWNoYW5nZS1ub2RlL2NhdGVnb3J5LmpzIl0sIm5hbWVzIjpbImNhdGVnb3J5QmVmb3JlQ2hhbmdlTm9kZSIsInJlbW90ZU5vZGUiLCJhY3Rpb25UeXBlIiwid3BTdG9yZSIsImZldGNoR3JhcGhxbCIsImhlbHBlcnMiLCJhY3Rpb25zIiwiYnVpbGRUeXBlTmFtZSIsIndwQ2hpbGRyZW4iLCJub2RlcyIsImxlbmd0aCIsInN0YXRlIiwiZ2V0U3RhdGUiLCJzZWxlY3Rpb25TZXQiLCJyZW1vdGVTY2hlbWEiLCJub2RlUXVlcmllcyIsImNhdGVnb3JpZXMiLCJ3cFVybCIsInBsdWdpbk9wdGlvbnMiLCJnYXRzYnlBcGkiLCJxdWVyeSIsIm1hcCIsImlkIiwiaW5kZXgiLCJqb2luIiwiZGF0YSIsImVycm9yQ29udGV4dCIsInJlbW90ZUNoaWxkQ2F0ZWdvcnlOb2RlcyIsIk9iamVjdCIsInZhbHVlcyIsImFkZGl0aW9uYWxOb2RlSWRzIiwiUHJvbWlzZSIsImFsbCIsInJlbW90ZUNhdGVnb3J5Tm9kZSIsImNoaWxkTm9kZUlkcyIsImZvckVhY2giLCJwdXNoIiwidHlwZSIsInByb2Nlc3NlZE5vZGUiLCJub2RlIiwiY3JlYXRlTm9kZSIsIm5vZGVUeXBlIiwicGFyZW50IiwiaW50ZXJuYWwiLCJjb250ZW50RGlnZXN0IiwiY3JlYXRlQ29udGVudERpZ2VzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVPLE1BQU1BLHdCQUF3QixHQUFHLE9BQU87QUFDN0NDLEVBQUFBLFVBRDZDO0FBRTdDQyxFQUFBQSxVQUY2QztBQUc3Q0MsRUFBQUEsT0FINkM7QUFJN0NDLEVBQUFBLFlBSjZDO0FBSzdDQyxFQUFBQSxPQUw2QztBQU03Q0MsRUFBQUEsT0FONkM7QUFPN0NDLEVBQUFBO0FBUDZDLENBQVAsS0FRbEM7QUFBQTs7QUFDSixNQUNFTCxVQUFVLEtBQU0sUUFBaEIsSUFDQUEsVUFBVSxL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UTtBQUxOLE9BQU47QUFVRCxHQXJDRCxDQURJLENBQU47QUF5Q0EsU0FBTztBQUFFUCxJQUFBQTtBQUFGLEdBQVA7QUFDRCxDQWpHTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb2Nlc3NOb2RlIH0gZnJvbSBcIn4vc3RlcHMvc291cmNlLW5vZGVzL2NyZWF0ZS1ub2Rlcy9wcm9jZXNzLW5vZGVcIlxuXG5leHBvcnQgY29uc3QgY2F0ZWdvcnlCZWZvcmVDaGFuZ2VOb2RlID0gYXN5bmMgKHtcbiAgcmVtb3RlTm9kZSxcbiAgYWN0aW9uVHlwZSxcbiAgd3BTdG9yZSxcbiAgZmV0Y2hHcmFwaHFsLFxuICBoZWxwZXJzLFxuICBhY3Rpb25zLFxuICBidWlsZFR5cGVOYW1lLFxufSkgPT4ge1xuICBpZiAoXG4gICAgYWN0aW9uVHlwZSAhPT0gYFVQREFURWAgJiZcbiAgICBhY3Rpb25UeXBlICE9PSBgQ1JFQVRFX0FMTGAgJiZcbiAgICBhY3Rpb25UeXBlICE9PSBgQ1JFQVRFYFxuICApIHtcbiAgICAvLyBubyBuZWVkIHRvIHVwZGF0ZSBjaGlsZHJlbiBpZiB3ZSdyZSBub3QgdXBkYXRpbmcgYW4gZXhpc3RpbmcgY2F0ZWdvcnlcbiAgICAvLyBpZiB3ZSdyZSBjcmVhdGluZyBhIG5ldyBjYXRlZ29yeSBpdCB3aWxsIGJlIGVtcHR5IGluaXRpYWxseS5cbiAgICAvLyBzbyB3ZSBydW4gdGhpcyBmdW5jdGlvbiB3aGVuIHVwZGF0aW5nIG5vZGVzIG9yIHdoZW4gaW5pdGlhbGx5XG4gICAgLy8gY3JlYXRpbmcgYWxsIG5vZGVzXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGlmICghcmVtb3RlTm9kZT8ud3BDaGlsZHJlbj8ubm9kZXM/Lmxlbmd0aCkge1xuICAgIC8vIGlmIHdlIGRvbid0IGhhdmUgYW55IGNoaWxkIGNhdGVnb3J5IGl0ZW1zIHRvIGZldGNoLCBza2lwIG91dFxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCBzdGF0ZSA9IHdwU3RvcmUuZ2V0U3RhdGUoKVxuXG4gIGNvbnN0IHsgc2VsZWN0aW9uU2V0IH0gPSBzdGF0ZS5yZW1vdGVTY2hlbWEubm9kZVF1ZXJpZXMuY2F0ZWdvcmllc1xuICBjb25zdCB7IHdwVXJsIH0gPSBzdGF0ZS5yZW1vdGVTY2hlbWFcbiAgY29uc3QgeyBwbHVnaW5PcHRpb25zIH0gPSBzdGF0ZS5nYXRzYnlBcGlcblxuICBjb25zdCBxdWVyeSA9IGBcbiAgICAgICAgZnJhZ21lbnQgQ0FURUdPUllfRklFTERTIG9uIENhdGVnb3J5IHtcbiAgICAgICAgICAke3NlbGVjdGlvblNldH1cbiAgICAgICAgfVxuXG4gICAgICAgIHF1ZXJ5IHtcbiAgICAgICAgICAgICR7cmVtb3RlTm9kZS53cENoaWxkcmVuLm5vZGVzXG4gICAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgICAgKHsgaWQgfSwgaW5kZXgpID0+XG4gICAgICAgICAgICAgICAgICBgaWRfXyR7aW5kZXh9OiBjYXRlZ29yeShpZDogXCIke2lkfVwiKSB7IC4uLkNBVEVHT1JZX0ZJRUxEUyB9YFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5qb2luKGAgYCl9XG4gICAgICAgICAgfWBcblxuICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGZldGNoR3JhcGhxbCh7XG4gICAgcXVlcnksXG4gICAgZXJyb3JDb250ZXh0OiBgRXJyb3Igb2NjdXJlZCB3aGlsZSByZWN1cnNpdmVseSBmZXRjaGluZyBcIkNhdGVnb3J5XCIgbm9kZXMgaW4gYmVmb3JlQ2hhbmdlTm9kZSBBUEkuYCxcbiAgfSlcblxuICBjb25zdCByZW1vdGVDaGlsZENhdGVnb3J5Tm9kZXMgPSBPYmplY3QudmFsdWVzKGRhdGEpXG5cbiAgY29uc3QgYWRkaXRpb25hbE5vZGVJZHMgPSByZW1vdGVDaGlsZENhdGVnb3J5Tm9kZXMubWFwKCh7IGlkIH0gPSB7fSkgPT4gaWQpXG5cbiAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgcmVtb3RlQ2hpbGRDYXRlZ29yeU5vZGVzLm1hcChhc3luYyAocmVtb3RlQ2F0ZWdvcnlOb2RlKSA9PiB7XG4gICAgICBpZiAocmVtb3RlQ2F0ZWdvcnlOb2RlPy53cENoaWxkcmVuPy5ub2Rlcz8ubGVuZ3RoKSB7XG4gICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGZldGNoIGNoaWxkIGNhdGVnb3J5IGl0ZW1zXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBhZGRpdGlvbmFsTm9kZUlkczogY2hpbGROb2RlSWRzLFxuICAgICAgICB9ID0gYXdhaXQgY2F0ZWdvcnlCZWZvcmVDaGFuZ2VOb2RlKHtcbiAgICAgICAgICByZW1vdGVOb2RlOiByZW1vdGVDYXRlZ29yeU5vZGUsXG4gICAgICAgICAgYWN0aW9uVHlwZTogYENSRUFURWAsXG4gICAgICAgICAgd3BTdG9yZSxcbiAgICAgICAgICBmZXRjaEdyYXBocWwsXG4gICAgICAgICAgaGVscGVycyxcbiAgICAgICAgICBhY3Rpb25zLFxuICAgICAgICAgIGJ1aWxkVHlwZU5hbWUsXG4gICAgICAgIH0pXG5cbiAgICAgICAgY2hpbGROb2RlSWRzLmZvckVhY2goKGlkKSA9PiBhZGRpdGlvbmFsTm9kZUlkcy5wdXNoKGlkKSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgdHlwZSA9IGJ1aWxkVHlwZU5hbWUoYENhdGVnb3J5YClcblxuICAgICAgY29uc3QgcHJvY2Vzc2VkTm9kZSA9IGF3YWl0IHByb2Nlc3NOb2RlKHtcbiAgICAgICAgbm9kZTogcmVtb3RlQ2F0ZWdvcnlOb2RlLFxuICAgICAgICBwbHVnaW5PcHRpb25zLFxuICAgICAgICB3cFVybCxcbiAgICAgICAgaGVscGVycyxcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IGFjdGlvbnMuY3JlYXRlTm9kZSh7XG4gICAgICAgIC4uLnByb2Nlc3NlZE5vZGUsXG4gICAgICAgIG5vZGVUeXBlOiBgQ2F0ZWdvcnlgLFxuICAgICAgICB0eXBlOiBgQ2F0ZWdvcnlgLFxuICAgICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICAgIGludGVybmFsOiB7XG4gICAgICAgICAgY29udGVudERpZ2VzdDogaGVscGVycy5jcmVhdGVDb250ZW50RGlnZXN0KHJlbW90ZUNhdGVnb3J5Tm9kZSksXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcbiAgKVxuXG4gIHJldHVybiB7IGFkZGl0aW9uYWxOb2RlSWRzIH1cbn1cbiJdfQ==
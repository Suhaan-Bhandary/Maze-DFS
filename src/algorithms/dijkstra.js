// Implementing dijkstra algorithm.
// Dijkstra is a weighted algorithm,weights are non-negative in this algorithm.

// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.

export function dijkstra(grid, startNode, endNode) {
  let newGrid = [...grid];
  let newStartNode = newGrid[startNode.row][startNode.col];
  let newEndNode = newGrid[endNode.row][endNode.col];

  console.log(startNode.row, newGrid, newStartNode, newEndNode);

  newGrid.forEach((row) => {
    row.forEach((node) => {
      node.isVisited = false;
    });
  });

  const visitedNodesInOrder = []; // To animate visited nodes in order to animate the process of searching.
  newStartNode.distance = 0;
  const unvisitedNodes = getAllNodes(newGrid);

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) {
      console.log("see this node :", closestNode);
      console.log("ohhh noooo");
      return [visitedNodesInOrder, []];
    }

    closestNode.isVisited = true;

    visitedNodesInOrder.push(closestNode);

    // Checking for the success condition.
    if (closestNode === newEndNode) {
      const shortestNodePath = getNodesInShortestPathOrder(newEndNode);
      return [visitedNodesInOrder, shortestNodePath];
    }

    updateUnvisitedNeighbors(closestNode, newGrid);
  }
}

// Sorts the unvisitedNodes every time it is called.
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// Sets the neighbour nodes distance and also the previous node property.
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    // Now the neighbor distance is not infinity and because of it it will show among the top in unvisited nodes.
    neighbor.previousNode = node; // With this property we can backtrack and find the shortest path between the start and end node.
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node; //col and row are properties of the node.

  const parent = grid[row][col];

  if (row > 0 && !parent.topWall) neighbors.push(grid[row - 1][col]); // left

  if (row < grid.length - 1 && !parent.bottomWall)
    neighbors.push(grid[row + 1][col]);

  if (col > 0 && !parent.leftWall) neighbors.push(grid[row][col - 1]);

  if (col < grid[0].length - 1 && !parent.rightWall)
    neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited); // filtering the visited node
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
    console.log("ok");
  }
  return nodesInShortestPathOrder;
}

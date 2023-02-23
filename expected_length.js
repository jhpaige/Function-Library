// Inputs and outputs defined at bottom of page. Finds the average route length to touch checkpoints (*)
// in given rectangular field of (.) while avoiding (#) and not going out of bounds.

const expected_length = async (field, checkpointTot) => {
  // Variables to store field height and width
  const height = field.length;
  const width = field[0].length;

  // Variable to store possible path lengths
  const possibleLengths = [];

  // Array to store all checkpoints to start at
  // let queue = {};
  // for (let i = 0; i < height; i++) {
  //   for (let j = 0; j < width; j++) {
  //     if (field[i][j] == '*') queue[`${i},${j}`] = 1;
  //   }
  // }
  let queue = {'2,0': 1};
  // Array to store all visited checkpoints
  const deQueued = {};

  // Run the following for each path (paramaters being checkpoints visited and path length)
  // Make path a recursive (Returning path object when desired number of checkpoints reached or terminating when move is invalid(i.e. '#', out of bounds, or visited checkpoint)) return
  // Allow to go in any direction at each checkpoint
  const findPaths = async (currPosition, pathLen = 0, visitedCheckpoints = deQueued, lastPosition = undefined) => {
    // console.log('currPos', currPosition);
    // console.log('lastPos', lastPosition);
    console.log('pathLen', pathLen);
    console.log('curr',currPosition);
    console.log('visitedChecks', visitedCheckpoints);
    // Initializes the current position being a checkpoint as false
    let prevIsCheck = false;
    // If current value is a checkpoint add to visitedCheckpoints
    if (field[currPosition[0]][currPosition[1]].localeCompare('*') == 0) {
      visitedCheckpoints[`${currPosition[0]},${currPosition[1]}`] = 1;
      prevIsCheck = true;
    }
    // If currVisitedCheckpoints length is desired length return path length in array
    if (Object.keys(visitedCheckpoints).length == checkpointTot) return [pathLen];
    // Storing current visited checkpoints in local variables
    let topVisitedCheckpoints = visitedCheckpoints;
    let bottomVisitedCheckpoints = visitedCheckpoints;
    let leftVisitedCheckpoints = visitedCheckpoints;
    let rightVisitedCheckpoints = visitedCheckpoints;
    // Variable to store invalid positions
    let badPositions = visitedCheckpoints;
    // If last position isn't undefined add to bad positions since it wasn't a checkpoint
    if (lastPosition) {
      badPositions[`${lastPosition[0]},${lastPosition[1]}`] = 1;
    }
    

    console.log('bad',badPositions);
    
    // Saving indices in each direction to variables
    const topIdx = [currPosition[0] - 1, currPosition[1]];
    const bottomIdx = [currPosition[0] + 1, currPosition[1]];
    const leftIdx = [currPosition[0], currPosition[1] - 1];
    const rightIdx = [currPosition[0], currPosition[1] + 1];
    // console.log(topIdx, bottomIdx, leftIdx, rightIdx);

    const callOnIndex = async (checkingIdx, currPathLen, currVisitedCheckpoints) => {
      console.log('currVisitedChecks', checkingIdx, currVisitedCheckpoints)
      // console.log('Index Call/Positions', checkingIdx);
      // Returns empty array if position is invalid
      if (!valid_value(checkingIdx, badPositions)) return [];
      
      // Keep the path going with current value as previous value (unless checkpoint then previous value is null)
      return await findPaths(checkingIdx, ++currPathLen, currVisitedCheckpoints, prevIsCheck ? undefined : currPosition)
    }

    const upPath = await callOnIndex(topIdx, pathLen, topVisitedCheckpoints);
    const downPath = await callOnIndex(bottomIdx, pathLen, bottomVisitedCheckpoints);
    const leftPath = await callOnIndex(leftIdx, pathLen, leftVisitedCheckpoints);
    const rightPath = await callOnIndex(rightIdx, pathLen, rightVisitedCheckpoints);
    console.log('totPath',[...upPath, ...downPath, ...leftPath, ...rightPath]);
    console.log('visited checkpoints', topVisitedCheckpoints, bottomVisitedCheckpoints, leftVisitedCheckpoints, rightVisitedCheckpoints);
    // Returns all path lengths superimposed
    return [...upPath, ...downPath, ...leftPath, ...rightPath];
  }

  // Checks whether value is in bounds and defined valid by parameters
  const valid_value = (position, invalidPositions) => {
    
    if (position[0] >= height || position[0] < 0 || position[1] >= width || position[1] < 0 // Checking out of bounds
    || field[position[0]][position[1]].localeCompare('#') == 0  // Checking whether value not #
    || invalidPositions[`${position[0]},${position[1]}`]) { // Checking that value isn't invalid position
      return false;
    }
    // console.log(position);
    return true;
  }

  // While Loop that goes until no queue
  while (Object.keys(queue).length != 0) {
    // Current checkpoint variable
    const currCheck = Object.keys(queue)[0];
    console.log(currCheck);
    // Current checkpoint variable in numbers
    let numCurrCheck = currCheck.split(',');
    // Loops through numCurrCheck to make each value a number instead of string
    for (let i = 0; i < 2; i++) {
      numCurrCheck[i] = Number(numCurrCheck[i]);
    };
    // Finds all paths for queued value
    possibleLengths.push(await findPaths(numCurrCheck));

    // Removes from queue and adds to deQueue when loop is done
    if (Object.keys(queue).length > 1) {
      delete queue[currCheck];
    }
    else queue = {};
    console.log('currQueue',queue);
    deQueued[currCheck] = 1;
  }

  // Returns average of possibleLengths
  let pathAverage = 0;
  for (let i = 0; i < possibleLengths.length; i++) {
    pathAverage += possibleLengths[i];
  }
  pathAverage /= possibleLengths.length;
  return pathAverage;
}

expected_length([
  "*#..#",
  ".#*#.",
  "*...*"]
 , 2).then(res => console.log(res));
 
 // K = 2
 // Returns: 3.8333333333333353
 
 // K = 4
 // Returns: 8.0
 
 
 // field = [    	
 //   "###################",
 //   "#*###############*#",
 //   "#.....#######.....#",
 //   "#*###*.#.*.#.*###*#",
 //   "#*####*.*#*.*####*#",
 //   "#*#####*###*#####*#",
 //   "###################"]
 //  K = 9
 //  Returns: 30.272233648704244

//   // Find size of field and define acceptable range
//   const height = field.length;
//   const width = field[0].length;
//   const queue = [];
//   const validLengths = [];

//   // Helper function which returns whether position is valid to move to (i.e. not out bounds, equal to #, or equal to previous position), return true
//   const valid_value = (field, position, prevPosition) => {
//     if (position[0] >= height || position[0] < 0 || position[1] >= width || position[1] < 0 // Checking out of bounds
//     || position[0] == prevPosition[0] && position[1] == prevPosition[1] // Checking difference from previous position
//     || field[position[0]][position[1]].localeCompare('#') == 0) { // Checking whether value valid
//       return false;
//     }
//     return true;
//   }

//   const endRepeats = (dataArr) => {
//     // Index to check values in second half of array
//     const arrHalf = dataArr.length / 2;
//     for (let i = 0; i < arrHalf; i++) {
//       // Returns false if end doesn't repeat
//       if (dataArr[i] !== dataArr[arrHalf + i]) return false;
//     }
//     // Returns true if end repeats
//     return true;
//   }

//   const isPositionLoop = (valArray) => {
//     for (let i = 4; i < valArray.length; i += 2) {
//         if (endRepeats(valArray.slice(valArray.length - i))) return true;
//     }
//     return false;
//   }
//   // Store each index that isn't a # in queue
  // for (let i = 0; i < height; i++) {
  //   for (let j = 0; j < width; j++) {
  //     if (field[i][j] != '#') queue.push([i, j]);
  //   }
  // }
//   queue.push([0,0]);

//   // Start at each queue value and move in every possible direction except backwards, #, or not in acceptable range (store previous position)
//   let checkedPositions = [];
//   // terminating only when '#' is found, track each * along the way
//   while (queue.length > 0) {
//     // If path found has checkpoint number inputted, save length - 1 to possible route lengths
//     const nextPath = async (currPosition, pathLen = 0, checkpointsPassed = {}, checkedPositions = []) => {
//       let numCheckpointsPassed = Object.keys(checkpointsPassed).length;
//       if (pathLen == 0) console.log('start', currPosition);
//       // console.log('currPosition', currPosition);
//       // console.log('pathLen', pathLen);
//       checkedPositions.push(currPosition[0].toString() + currPosition[1].toString());
//       if (field[currPosition[0]][currPosition[1]].localeCompare('*') == 0) {
//         checkpointsPassed[currPosition[0].toString() + currPosition[1].toString()] = 1;
//         numCheckpointsPassed++;
//       };
//       // console.log('checkpointsPassed', checkpointsPassed);
//       if (numCheckpointsPassed == checkpointTot) {
//         console.log('end', currPosition);
//         validLengths.push(pathLen);
//         return;
//       };
//       // Check validity of top, left, right, and bottom, add position to checked positions if not checked yet
//       const topIdx = [currPosition[0] - 1, currPosition[1]];
//       const bottomIdx = [currPosition[0] + 1, currPosition[1]];
//       const leftIdx = [currPosition[0], currPosition[1] - 1];
//       const rightIdx = [currPosition[0], currPosition[1] + 1];

//       const callOnIndex = async (checkingIdx, currPathLen, currCheckpointsPassed) => {
//         console.log('Index Call/Positions', checkingIdx, checkedPositions);
//         const idxAsString = checkingIdx[0].toString() + checkingIdx[1].toString();
//         if (!isPositionLoop([...checkedPositions, idxAsString])) {
//           if (currCheckpointsPassed < checkpointTot && valid_value(field, checkingIdx, currPosition)) {
//             console.log('successful index', checkingIdx);
//             currPathLen++;
//             await nextPath(checkingIdx, currPathLen, currCheckpointsPassed, checkedPositions);
//           }
//         };
//       }

//       await callOnIndex(topIdx, pathLen, numCheckpointsPassed);
//       await callOnIndex(bottomIdx, pathLen, numCheckpointsPassed);
//       await callOnIndex(leftIdx, pathLen, numCheckpointsPassed);
//       await callOnIndex(rightIdx, pathLen, numCheckpointsPassed);

//     }
//     await nextPath(queue[queue.length - 1]);
//     // Remove Index from queue
//     queue.pop();
    
//   }
//   console.log(validLengths);
//   // Return average of route lengths
//   let lengthSum = 0;
//   for (i = 0; i < validLengths.length; i++) {
//     lengthSum += validLengths[i];
//   }
//   return lengthSum / validLengths.length;
// }
// Inputs and outputs defined at bottom of page. Finds the average route length to touch checkpoints (*)
// in given rectangular field of (.) while avoiding (#) and not going out of bounds.

const expected_length = async (field, checkpointTot) => {
  // Find size of field and define acceptable range
  const height = field.length;
  const width = field[0].length;
  const queue = [];
  const validLengths = [];

  // Helper function which returns whether position is valid to move to (i.e. not out bounds, equal to #, or equal to previous position), return true
  const valid_value = (field, position, prevPosition) => {
    if (position[0] >= height || position[0] < 0 || position[1] >= width || position[1] < 0 // Checking out of bounds
    || position[0] == prevPosition[0] && position[1] == prevPosition[1] // Checking difference from previous position
    || field[position[0]][position[1]].localeCompare('#') == 0) { // Checking whether value valid
      return false;
    }
    return true;
  }

  const isPalindrome = (dataArr) => {
    for (let i = 0; i < Math.ceil(dataArr / 2); i++) {
      // Returns false if pair doesn't match
      if (dataArr[i] !== dataArr[dataArr.length - 1 - i]) return false;
    }
    // Returns true if no incongruencies found between start and end of function
    return true;
  }

  const isPositionLoop = (valArray) => {
    let maxLoopHalf = Math.floor(valArray.length / 2);
    for (let i = 3; i < maxLoopHalf; i++) {
      for (let j = valArray.length - 1; j > valArray.length - 1 - i; j--) {
        if (isPalindrome(valArray.slice(j))) return true;;
      }
    }
    return false;
  }
  // Store each index that isn't a # in queue
  // for (let i = 0; i < height; i++) {
  //   for (let j = 0; j < width; j++) {
  //     if (field[i][j] != '#') queue.push([i, j]);
  //   }
  // }
  queue.push([0,0]);

  // Start at each queue value and move in every possible direction except backwards, #, or not in acceptable range (store previous position)
  let checkedPositions = [];
  // terminating only when '#' is found, track each * along the way
  while (queue.length > 0) {
    checkedPositions = [];
    // If path found has checkpoint number inputted, save length - 1 to possible route lengths
    const nextPath = async (currPosition, pathLen = 0, checkpointsPassed = 0) => {
      if (pathLen == 0) console.log('start', currPosition);
      console.log('currPosition', currPosition);
      console.log('pathLen', pathLen);
      checkedPositions.push(currPosition[0].toString() + currPosition[1].toString());
      if (field[currPosition[0]][currPosition[1]].localeCompare('*') == 0) {
        checkpointsPassed++;
      };
      console.log('checkpointsPassed', checkpointsPassed);
      if (checkpointsPassed == checkpointTot) {
        console.log('end', currPosition);
        validLengths.push(pathLen);
        return;
      };
      // Check validity of top, left, right, and bottom, add position to checked positions if not checked yet
      const topIdx = [currPosition[0] - 1, currPosition[1]];
      const bottomIdx = [currPosition[0] + 1, currPosition[1]];
      const leftIdx = [currPosition[0], currPosition[1] - 1];
      const rightIdx = [currPosition[0], currPosition[1] + 1];

      const callOnIndex = async (checkingIdx, currPathLen, currCheckpointsPassed) => {
        const idxAsString = checkingIdx[0].toString() + checkingIdx[1].toString();
        checkedPositions.push(idxAsString)
        if (!isPositionLoop(checkedPositions)) {
          if (currCheckpointsPassed < checkpointTot && valid_value(field, checkingIdx, currPosition)) {
            currPathLen++;
            await nextPath(checkingIdx, currPathLen, currCheckpointsPassed);
          }
        };
      }

      await callOnIndex(topIdx, pathLen, checkpointsPassed);
      await callOnIndex(bottomIdx, pathLen, checkpointsPassed);
      await callOnIndex(leftIdx, pathLen, checkpointsPassed);
      await callOnIndex(rightIdx, pathLen, checkpointsPassed);

    }
    await nextPath(queue[queue.length - 1]);
    // Remove Index from queue
    queue.pop();
    
  }
  console.log(validLengths);
  // Return average of route lengths
  let lengthSum = 0;
  for (i = 0; i < validLengths.length; i++) {
    lengthSum += validLengths[i];
  }
  return lengthSum / validLengths.length;
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
 
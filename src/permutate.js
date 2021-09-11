export function createPermutations(arr) {
  const permutate = [];

  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].fixed) {
      permutate.push(arr[i]);
    }
  }

  const permutations = permutator(permutate);

  const results = [];

  for (let perm of permutations) {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].fixed) {
        res.push(arr[i]);
      } else {
        res.push(perm.shift());
      }
    }
    results.push(res);
  }

  return results;
}

function permutator(inputArr) {
  const result = [];

  const permute = (arr, memo = []) => {
    if (arr.length === 0) {
      result.push(memo);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), memo.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
}

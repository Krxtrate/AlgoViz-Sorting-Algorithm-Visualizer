export interface SortStep {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
}

export async function* bubbleSort(arr: number[]): AsyncGenerator<SortStep> {
  const array = [...arr];
  const n = array.length;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...array],
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
      };

      if (array[j] > array[j + 1]) {
        yield {
          array: [...array],
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
        };

        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
    sortedIndices.push(n - i - 1);
  }
  sortedIndices.push(0);

  yield {
    array: [...array],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [...sortedIndices],
  };
}

export async function* quickSort(
  arr: number[],
  start = 0,
  end = arr.length - 1,
  sortedIndices: number[] = []
): AsyncGenerator<SortStep> {
  const array = [...arr];

  if (start >= end) {
    sortedIndices.push(start);
    yield {
      array: [...array],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
    };
    return;
  }

  let pivotIndex = start;
  const pivot = array[end];
  let i = start - 1;

  for (let j = start; j < end; j++) {
    yield {
      array: [...array],
      comparingIndices: [j, end],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
    };

    if (array[j] < pivot) {
      i++;
      if (i !== j) {
        yield {
          array: [...array],
          comparingIndices: [],
          swappingIndices: [i, j],
          sortedIndices: [...sortedIndices],
        };
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  }

  yield {
    array: [...array],
    comparingIndices: [],
    swappingIndices: [i + 1, end],
    sortedIndices: [...sortedIndices],
  };

  [array[i + 1], array[end]] = [array[end], array[i + 1]];
  pivotIndex = i + 1;
  sortedIndices.push(pivotIndex);

  yield {
    array: [...array],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [...sortedIndices],
  };

  // Create new arrays for recursive calls
  const leftArray = [...array];
  const rightArray = [...array];

  // Recursively sort left and right partitions
  for await (const step of quickSortHelper(leftArray, start, pivotIndex - 1, sortedIndices)) {
    yield step;
  }

  for await (const step of quickSortHelper(rightArray, pivotIndex + 1, end, sortedIndices)) {
    yield step;
  }
}

async function* quickSortHelper(
  arr: number[],
  start: number,
  end: number,
  sortedIndices: number[]
): AsyncGenerator<SortStep> {
  if (start >= end) {
    if (start === end) sortedIndices.push(start);
    yield {
      array: [...arr],
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
    };
    return;
  }

  const array = [...arr];
  const pivot = array[end];
  let i = start - 1;

  for (let j = start; j < end; j++) {
    yield {
      array: [...array],
      comparingIndices: [j, end],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
    };

    if (array[j] < pivot) {
      i++;
      if (i !== j) {
        yield {
          array: [...array],
          comparingIndices: [],
          swappingIndices: [i, j],
          sortedIndices: [...sortedIndices],
        };
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  }

  yield {
    array: [...array],
    comparingIndices: [],
    swappingIndices: [i + 1, end],
    sortedIndices: [...sortedIndices],
  };

  [array[i + 1], array[end]] = [array[end], array[i + 1]];
  const pivotIndex = i + 1;
  sortedIndices.push(pivotIndex);

  yield {
    array: [...array],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [...sortedIndices],
  };

  // Recursively sort partitions
  for await (const step of quickSortHelper(array, start, pivotIndex - 1, sortedIndices)) {
    yield step;
  }

  for await (const step of quickSortHelper(array, pivotIndex + 1, end, sortedIndices)) {
    yield step;
  }
}

export async function* mergeSort(
  arr: number[],
  start = 0,
  end = arr.length - 1,
  sortedIndices: number[] = []
): AsyncGenerator<SortStep> {
  if (start >= end) {
    return;
  }

  const array = [...arr];
  const mid = Math.floor((start + end) / 2);

  for await (const step of mergeSort(array, start, mid, sortedIndices)) {
    yield step;
  }

  for await (const step of mergeSort(array, mid + 1, end, sortedIndices)) {
    yield step;
  }

  for await (const step of merge(array, start, mid, end, sortedIndices)) {
    yield step;
  }
}

async function* merge(
  array: number[],
  start: number,
  mid: number,
  end: number,
  sortedIndices: number[]
): AsyncGenerator<SortStep> {
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);

  let i = 0,
    j = 0,
    k = start;

  while (i < left.length && j < right.length) {
    yield {
      array: [...array],
      comparingIndices: [start + i, mid + 1 + j],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
    };

    if (left[i] <= right[j]) {
      array[k] = left[i];
      i++;
    } else {
      array[k] = right[j];
      j++;
    }

    yield {
      array: [...array],
      comparingIndices: [],
      swappingIndices: [k],
      sortedIndices: [...sortedIndices],
    };

    k++;
  }

  while (i < left.length) {
    array[k] = left[i];
    yield {
      array: [...array],
      comparingIndices: [],
      swappingIndices: [k],
      sortedIndices: [...sortedIndices],
    };
    i++;
    k++;
  }

  while (j < right.length) {
    array[k] = right[j];
    yield {
      array: [...array],
      comparingIndices: [],
      swappingIndices: [k],
      sortedIndices: [...sortedIndices],
    };
    j++;
    k++;
  }

  for (let idx = start; idx <= end; idx++) {
    if (!sortedIndices.includes(idx)) {
      sortedIndices.push(idx);
    }
  }

  yield {
    array: [...array],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [...sortedIndices],
  };
}

// Script-style assertions for the matrix helpers, mirroring the colocated
// *.test.ts convention in shared/parsing. Run directly (tsx/node type
// stripping); throws on the first failing assertion.

import { matMul, solveLinearSystem, transpose } from './matrix-math.js';

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`${label} failed: expected ${expectedJson}, got ${actualJson}`);
  }
}

assertEqual(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]], 'transpose swaps rows and columns');
assertEqual(matMul([[1, 2], [3, 4]], [[5, 6], [7, 8]]), [[19, 22], [43, 50]], 'matMul multiplies two square matrices');

const solved = solveLinearSystem([[2, 1], [1, 3]], [3, 5]);
if (solved === null) throw new Error('solveLinearSystem returned null for a well-posed system');
assertEqual(solved.map((x) => Math.round(x * 1000) / 1000), [0.8, 1.4], 'solveLinearSystem solves a well-posed 2x2 system');

assertEqual(solveLinearSystem([[1, 2], [2, 4]], [1, 2]), null, 'solveLinearSystem returns null for a singular system');

process.stdout.write('matrix math ok\n');

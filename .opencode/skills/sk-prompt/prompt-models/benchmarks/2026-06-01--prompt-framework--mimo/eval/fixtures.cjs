// Coding fixtures for the MiMo prompt-framework bake-off.
// Each fixture carries a task statement (the work MiMo must do) and a hidden
// test suite the harness runs against the extracted function. Tests stay out of
// the dispatch prompt so the model cannot overfit to exact assertions.
//
// A test = { name, args, expect }. The harness deep-equals fn(...args) vs expect.

const fixtures = [
  {
    id: 'chunk',
    fn_name: 'chunk',
    // Task statement injected into every framework template (the {{task}} slot).
    task: [
      'Implement a JavaScript function `chunk(array, size)` that splits `array`',
      'into consecutive sub-arrays ("chunks"), each of length `size`. The final',
      'chunk holds the remainder when the length is not divisible by `size`.',
      'Edge cases: if `size <= 0` return `[]`; if `array` is empty return `[]`.',
    ].join(' '),
    signature: 'function chunk(array, size)',
    tests: [
      { name: 'splits 5 into pairs', args: [[1, 2, 3, 4, 5], 2], expect: [[1, 2], [3, 4], [5]] },
      { name: 'empty array', args: [[], 3], expect: [] },
      { name: 'size zero', args: [[1, 2], 0], expect: [] },
      // Extra hidden checks (not stated as examples in the prompt) to catch overfitting.
      { name: 'exact division', args: [[1, 2, 3, 4], 2], expect: [[1, 2], [3, 4]] },
      { name: 'size one', args: [[9, 8], 1], expect: [[9], [8]] },
    ],
  },
  {
    id: 'parseRange',
    fn_name: 'parseRange',
    task: [
      'Implement a JavaScript function `parseRange(s)` where `s` is a string.',
      "If `s` is of the form 'a-b' (two integers separated by a hyphen), return an",
      'inclusive integer array from a to b: ascending when a <= b, descending when',
      "a > b. If `s` is a single integer 'n', return `[n]`.",
    ].join(' '),
    signature: 'function parseRange(s)',
    tests: [
      { name: 'ascending range', args: ['1-5'], expect: [1, 2, 3, 4, 5] },
      { name: 'descending range', args: ['5-1'], expect: [5, 4, 3, 2, 1] },
      { name: 'single value', args: ['7'], expect: [7] },
      // Extra hidden checks.
      { name: 'two-element ascending', args: ['3-4'], expect: [3, 4] },
      { name: 'equal endpoints', args: ['2-2'], expect: [2] },
    ],
  },
];

module.exports = { fixtures };

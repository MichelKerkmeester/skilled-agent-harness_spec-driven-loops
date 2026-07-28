// Five prompt-framework scaffolds under test, ported from the proven
// 120/003 MiniMax bake-off (variants v-001..005). Each scaffold wraps the SAME
// coding task and the SAME output contract ("return ONLY the function code");
// the framework is the independent variable. We measure which framing yields
// the most correct, format-clean MiMo output.
//
// The output contract is held constant across all five so the bake-off isolates
// the framework axis, not the format ask. Each template is a function
// (fixture) -> prompt string.

// Shared, framework-neutral output contract. Held constant across all variants.
function outputContract(fixture) {
  return [
    'Return ONLY the JavaScript function source for `' + fixture.fn_name + '`',
    '(signature `' + fixture.signature + '`).',
    'No prose, no explanation, no test code, no markdown fence — just the function.',
  ].join(' ');
}

// Shared guardrail / constraint line. Density is what TIDD-EC amplifies.
function constraints(fixture) {
  return [
    'Handle every stated edge case. Do not invent extra parameters, helper',
    'globals, or behaviour beyond the specification. Pure function, no side effects.',
  ].join(' ');
}

const frameworks = [
  {
    id: 'rcaf',
    name: 'RCAF',
    long: 'Role / Context / Action / Format',
    preplanning_density: 'lean',
    // Role-anchored, lean. Tests whether a clear role anchor tightens MiMo output.
    render: (f) =>
      [
        '## Role',
        'You are a senior JavaScript engineer. Produce code that satisfies the acceptance criteria exactly, staying strictly in scope.',
        '',
        '## Context',
        'Pure-function implementation task. ' + constraints(f),
        '',
        '## Action',
        f.task,
        '',
        '## Format',
        outputContract(f),
      ].join('\n'),
  },
  {
    id: 'race',
    name: 'RACE',
    long: 'Role / Action / Context / Expectation',
    preplanning_density: 'lean',
    // Compressed, execution-first. Action front-loaded ahead of context.
    render: (f) =>
      [
        '## Role',
        'Senior JavaScript engineer. Code must satisfy the acceptance criteria exactly and stay strictly in scope.',
        '',
        '## Action',
        f.task,
        '',
        '## Context',
        constraints(f),
        '',
        '## Expectation',
        outputContract(f),
      ].join('\n'),
  },
  {
    id: 'cidi',
    name: 'CIDI',
    long: 'Context / Instructions / Details / Input',
    preplanning_density: 'medium',
    // Process-oriented, explicit step instructions.
    render: (f) =>
      [
        '## Context',
        'A senior JavaScript engineer must produce a pure function that satisfies the acceptance criteria exactly, staying strictly in scope.',
        '',
        '## Instructions',
        '1. Implement the function described under Input.',
        '2. ' + outputContract(f),
        '',
        '## Details',
        constraints(f),
        '',
        '## Input',
        f.task,
      ].join('\n'),
  },
  {
    id: 'tidd-ec',
    name: 'TIDD-EC',
    long: "Task / Instructions / Do's / Don'ts / Examples / Context",
    preplanning_density: 'dense',
    // Guardrail-heavy. Explicit Do's/Don'ts curb scope + format drift.
    render: (f) =>
      [
        '## Task',
        f.task,
        '',
        '## Instructions',
        '1. Implement `' + f.fn_name + '` to satisfy every acceptance criterion.',
        '2. ' + outputContract(f),
        '',
        "## Do's",
        '- Handle every stated edge case exactly.',
        '- Keep it a single pure function with no side effects.',
        '- Return only the function source.',
        '',
        "## Don'ts",
        '- Do not add extra parameters, helper globals, or behaviour beyond the spec.',
        '- Do not include prose, explanations, tests, or a markdown fence.',
        '- Do not rename the function or change its signature.',
        '',
        '## Examples',
        'Output shape: the bare function declaration `' + f.signature + ' { ... }` and nothing else.',
        '',
        '## Context',
        'Pure-function implementation task evaluated by an automated assertion suite that calls the function directly.',
      ].join('\n'),
  },
  {
    id: 'costar',
    name: 'COSTAR',
    long: 'Context / Objective / Style / Tone / Audience / Response',
    preplanning_density: 'medium',
    // Audience-aware framing. Communication-oriented contrast.
    render: (f) =>
      [
        '## Context',
        'Pure-function JavaScript implementation task. ' + constraints(f),
        '',
        '## Objective',
        f.task,
        '',
        '## Style',
        'Precise, implementation-grade. No preamble.',
        '',
        '## Tone',
        'Direct and technical.',
        '',
        '## Audience',
        'An automated assertion suite that calls the function directly and rejects out-of-scope behaviour or invented parameters.',
        '',
        '## Response',
        outputContract(f),
      ].join('\n'),
  },
];

module.exports = { frameworks };

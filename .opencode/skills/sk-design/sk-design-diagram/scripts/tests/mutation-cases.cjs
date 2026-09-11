'use strict';

// One case per family. Each breaks exactly one thing in a copy and expects the named family to
// say the specific thing its message promises. A case that could pass for any other reason is a
// case the harness refuses, which is the point of keeping them this narrow.

const fs = require('node:fs');
const path = require('node:path');

const FILE_CASES = [
  { name: 'a diagram whose svg has no title', family: 'accessible-svg',
    file: 'assets/diagrams/architecture.html',
    from: '<title id="architecture-title">', to: '<title id="architecture-title-moved">',
    expect: /aria-labelledby|title/ },
  { name: 'an id used twice in one file', family: 'unique-ids',
    file: 'assets/diagrams/architecture.html',
    from: 'id="architecture-desc"', to: 'id="architecture-title"',
    expect: /architecture-title/ },
  { name: 'a script fetched from a host that is not the fonts allowlist', family: 'no-external',
    file: 'assets/diagrams/architecture.html',
    from: '</head>', to: '<script src="https://cdn.example.com/a.js"></script></head>',
    expect: /cdn\.example\.com/ },
  { name: 'a connector drawn with a marker nobody defined', family: 'marker-vocabulary',
    file: 'assets/diagrams/architecture.html',
    from: 'marker-end="url(#arrow)"', to: 'marker-end="url(#nope)"',
    expect: /nope/ },
  { name: 'a new file with a value off the grid', family: 'grid-4px',
    file: 'assets/diagrams/layers.html',
    from: '</defs>', to: '</defs><rect x="13" y="0" width="4" height="4"/>',
    expect: /x=13/ },
  { name: 'a connector line that runs at an angle', family: 'orthogonal-connectors',
    file: 'assets/diagrams/swimlane.html',
    from: '<path d="M460 144 H500 V176" fill="none"', to: '<line x1="460" y1="144" x2="500" y2="176"',
    expect: /angle/ },
  { name: 'more tagged nodes than the budget allows', family: 'node-budget',
    file: 'assets/diagrams/layers.html',
    from: '</defs>', to: `</defs>${'<rect data-diagram-node="true" x="0" y="0" width="4" height="4"/>'.repeat(10)}`,
    expect: /budget|nodes/ },
  { name: 'a template whose palette block drifts from the token source', family: 'derivation-gates',
    file: 'assets/diagrams/starter-light.html',
    from: '--color-muted:   #4f5d75;', to: '--color-muted:   #dddddd;',
    expect: /muted/ },
];

// The corpus-scoped families read the skill's documents and the token source, so their cases
// mutate a package copy rather than one file.
const PACKAGE_CASES = [
  { name: 'a version outside the anchor era', family: 'metadata',
    mutate: (dir) => {
      const file = path.join(dir, 'references', 'catalog.md');
      fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/^version: \d+\.\d+/m, 'version: 9.9'), 'utf8');
    },
    expect: /outside the anchor/ },
  { name: 'a catalog row naming a file that left', family: 'catalog-bidirectional',
    mutate: (dir) => {
      const file = path.join(dir, 'references', 'catalog.md');
      fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('architecture.html', 'gone.html'), 'utf8');
    },
    expect: /example-gone\.html|architecture/ },
];

module.exports = { FILE_CASES, PACKAGE_CASES };

'use strict';

// One case per family, and a second wherever a family grew a second rule. Each breaks exactly one
// thing in a copy and expects the named family to say the specific thing its message promises. A
// case that could pass for any other reason is a case the harness refuses, which is the point of
// keeping them this narrow.

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
  { name: 'a themed block whose provenance comment was deleted', family: 'derivation-gates',
    file: 'scripts/tests/fixtures/design-md-sample.html',
    from: '      /* DESIGN.md provenance: path=.opencode/skills/sk-design/sk-design-diagram/assets/style-reference/harness-diagram/DESIGN.md sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 generator=1.0.0.0 */\n',
    to: '',
    expect: /provenance/ },
  { name: 'a themed block whose accent falls under the text-on-mark gate', family: 'derivation-gates',
    file: 'scripts/tests/fixtures/design-md-sample.html',
    from: '--color-accent:  #b34a1e;', to: '--color-accent:  #c2551f;',
    expect: /textOnMark/ },
  { name: 'a legend swatch keying a dash the drawing never paints', family: 'legend-fidelity',
    file: 'assets/diagrams/high-level.html',
    from: 'x1="808" y1="466" x2="828" y2="466" stroke="rgba(45,49,66,0.35)" stroke-width="1" stroke-dasharray="4,3"',
    to: 'x1="808" y1="466" x2="828" y2="466" stroke="rgba(45,49,66,0.35)" stroke-width="1" stroke-dasharray="9,2"',
    expect: /keys the dash array "9 2"/ },
  { name: 'a label mask shifted onto its connector', family: 'label-mask-clearance',
    file: 'assets/diagrams/it-state.html',
    from: 'class="label-mask" x="478" y="312"', to: 'class="label-mask" x="470" y="312"',
    expect: /painted across it/ },
  { name: 'a label mask pulled inside the clearance floor', family: 'label-mask-clearance',
    file: 'assets/diagrams/flowchart.html',
    from: '<rect x="644" y="220" width="24" height="12"', to: '<rect x="644" y="226" width="24" height="12"',
    expect: /and the minimum is 4px/ },
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

// The other direction: rules that are exemptions rather than assertions. An off-grid value inside a
// path's command data or a polygon's point list is not a defect — those are relative offsets and
// icon glyphs, not layout positions — so the case lands the value and expects a green run. The
// measured side of the same value is a defect, which the grid-4px case above proves.
const EXEMPTION_CASES = [
  { name: 'an off-grid value inside a path command', family: 'grid-4px',
    file: 'assets/diagrams/layers.html',
    from: '</defs>', to: '</defs><path d="M13 0 H17 V4"/>' },
  { name: 'an off-grid value inside a point list', family: 'grid-4px',
    file: 'assets/diagrams/layers.html',
    from: '</defs>', to: '</defs><polygon points="13,0 17,4 13,4"/>' },
];

module.exports = { FILE_CASES, PACKAGE_CASES, EXEMPTION_CASES };

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Review Contract Snapshot Renderer                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Renders review_mode_contract.yaml into a human-readable Markdown snapshot.
// This is the single real render target declared under the manifest's
// render.artifacts — every other file that mentions this contract's
// taxonomy is hand-authored (see authoredArtifacts in the manifest) and is
// not touched by this script.
//
// The YAML reader below is a small hand-rolled parser for the constrained
// subset actually used by review_mode_contract.yaml (block mappings, block
// sequences of scalars or inline maps, inline flow lists, quoted/plain
// scalars, booleans, numbers, full-line comments). No block scalars,
// anchors, tags, or multi-document markers are supported because the source
// file does not use them; js-yaml is not a reachable dependency from this
// script's runtime path, so this parser avoids adding one for a single
// consumer.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const CONTRACT_RELATIVE_PATH = '.opencode/skills/system-deep-loop/deep-review/assets/review_mode_contract.yaml';
const SNAPSHOT_ARTIFACT_ID = 'review-contract-snapshot';
const MAPPING_KEY_PATTERN = /^([A-Za-z_][A-Za-z0-9_]*):(?: (.*))?$/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. YAML SUBSET PARSER
// ─────────────────────────────────────────────────────────────────────────────

function tokenizeLines(rawText) {
  const rawLines = rawText.split(/\r?\n/);
  const lines = [];
  for (let index = 0; index < rawLines.length; index += 1) {
    const rawLine = rawLines[index];
    if (rawLine.trim() === '') continue;
    const stripped = rawLine.replace(/^ */, '');
    if (stripped.startsWith('#')) continue;
    const indent = rawLine.length - stripped.length;
    lines.push({ indent, text: stripped.replace(/\s+$/, ''), lineNumber: index + 1 });
  }
  return lines;
}

function isDashLine(text) {
  return text === '-' || text.startsWith('- ');
}

function parseScalarText(rawText) {
  const text = rawText.trim();
  if (text === '') return null;
  if (text.startsWith('[') && text.endsWith(']')) {
    const inner = text.slice(1, -1).trim();
    if (inner === '') return [];
    return inner.split(',').map((part) => parseScalarText(part.trim()));
  }
  if (text.length >= 2 && text.startsWith('"') && text.endsWith('"')) {
    return text.slice(1, -1).replace(/\\"/g, '"');
  }
  if (text.length >= 2 && text.startsWith("'") && text.endsWith("'")) {
    return text.slice(1, -1).replace(/''/g, "'");
  }
  if (text === 'true') return true;
  if (text === 'false') return false;
  if (text === 'null' || text === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  return text;
}

function parseBlock(lines, index, indent) {
  if (index >= lines.length || lines[index].indent < indent) {
    return { value: null, next: index };
  }
  if (isDashLine(lines[index].text)) {
    return parseSequence(lines, index, indent);
  }
  return parseMapping(lines, index, indent);
}

function parseSequence(lines, index, indent) {
  const array = [];
  let cursor = index;
  while (cursor < lines.length && lines[cursor].indent === indent && isDashLine(lines[cursor].text)) {
    const line = lines[cursor];
    const rest = line.text === '-' ? '' : line.text.slice(2);
    if (rest.trim() === '') {
      cursor += 1;
      if (cursor < lines.length && lines[cursor].indent > indent) {
        const child = parseBlock(lines, cursor, lines[cursor].indent);
        array.push(child.value);
        cursor = child.next;
      } else {
        array.push(null);
      }
      continue;
    }
    const keyMatch = rest.match(MAPPING_KEY_PATTERN);
    if (keyMatch) {
      const itemIndent = indent + 2;
      const obj = {};
      const firstKey = keyMatch[1];
      const firstValueRaw = keyMatch[2];
      cursor += 1;
      if (firstValueRaw !== undefined && firstValueRaw.trim() !== '') {
        obj[firstKey] = parseScalarText(firstValueRaw);
      } else if (cursor < lines.length && lines[cursor].indent > itemIndent) {
        const child = parseBlock(lines, cursor, lines[cursor].indent);
        obj[firstKey] = child.value;
        cursor = child.next;
      } else {
        obj[firstKey] = null;
      }
      while (cursor < lines.length && lines[cursor].indent === itemIndent && !isDashLine(lines[cursor].text)) {
        const entry = parseMappingEntry(lines, cursor, itemIndent);
        obj[entry.key] = entry.value;
        cursor = entry.next;
      }
      array.push(obj);
      continue;
    }
    array.push(parseScalarText(rest));
    cursor += 1;
  }
  return { value: array, next: cursor };
}

function parseMapping(lines, index, indent) {
  const obj = {};
  let cursor = index;
  while (cursor < lines.length && lines[cursor].indent === indent && !isDashLine(lines[cursor].text)) {
    const entry = parseMappingEntry(lines, cursor, indent);
    obj[entry.key] = entry.value;
    cursor = entry.next;
  }
  return { value: obj, next: cursor };
}

function parseMappingEntry(lines, index, indent) {
  const line = lines[index];
  const match = line.text.match(MAPPING_KEY_PATTERN);
  if (!match) {
    throw new Error(`Cannot parse YAML mapping entry at line ${line.lineNumber}: "${line.text}"`);
  }
  const key = match[1];
  const rawValue = match[2];
  let value;
  let next = index + 1;
  if (rawValue !== undefined && rawValue.trim() !== '') {
    value = parseScalarText(rawValue);
  } else if (next < lines.length && lines[next].indent > indent) {
    const child = parseBlock(lines, next, lines[next].indent);
    value = child.value;
    next = child.next;
  } else {
    value = null;
  }
  return { key, value, next };
}

function parseYamlDocument(rawText) {
  const lines = tokenizeLines(rawText);
  if (lines.length === 0) return {};
  return parseBlock(lines, 0, lines[0].indent).value;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SHAPE VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function assertContractShape(doc) {
  const problems = [];
  if (!doc || typeof doc !== 'object') problems.push('document root is not a mapping');
  if (!doc.meta) problems.push('missing top-level "meta"');
  if (!doc.contract) problems.push('missing top-level "contract"');
  if (!doc.render) problems.push('missing top-level "render"');
  if (!doc.validation) problems.push('missing top-level "validation"');

  const requiredContractKeys = [
    'targetTypes',
    'dimensions',
    'severities',
    'verdicts',
    'qualityGates',
    'convergence',
    'crossReferenceProtocols',
    'outputs',
  ];
  for (const key of requiredContractKeys) {
    if (!doc.contract || doc.contract[key] === undefined) {
      problems.push(`missing "contract.${key}"`);
    }
  }
  if (!doc.validation || !Array.isArray(doc.validation.checks)) {
    problems.push('missing "validation.checks" list');
  }
  if (!doc.render || !Array.isArray(doc.render.artifacts)) {
    problems.push('missing "render.artifacts" list');
  }

  if (problems.length > 0) {
    throw new Error(`review_mode_contract.yaml does not match the shape this renderer expects:\n- ${problems.join('\n- ')}`);
  }
}

function resolveSnapshotArtifact(doc) {
  const artifacts = doc.render.artifacts;
  const snapshotArtifact = artifacts.find((artifact) => artifact && artifact.id === SNAPSHOT_ARTIFACT_ID);
  if (!snapshotArtifact) {
    throw new Error(`review_mode_contract.yaml render.artifacts is missing the "${SNAPSHOT_ARTIFACT_ID}" entry`);
  }
  if (artifacts.length !== 1) {
    throw new Error(
      `review_mode_contract.yaml render.artifacts declares ${artifacts.length} artifacts, but this script only ` +
      `supports the single "${SNAPSHOT_ARTIFACT_ID}" target. Either remove the extra artifact or extend this ` +
      'script (and its manifest markers) before adding more render targets.',
    );
  }
  if (!snapshotArtifact.markers || !snapshotArtifact.markers.begin || !snapshotArtifact.markers.end) {
    throw new Error(`review_mode_contract.yaml render.artifacts[0] ("${SNAPSHOT_ARTIFACT_ID}") is missing markers.begin/markers.end`);
  }
  if (!Array.isArray(snapshotArtifact.sections) || snapshotArtifact.sections.length === 0) {
    throw new Error(`review_mode_contract.yaml render.artifacts[0] ("${SNAPSHOT_ARTIFACT_ID}") is missing a non-empty sections list`);
  }
  if (!snapshotArtifact.path) {
    throw new Error(`review_mode_contract.yaml render.artifacts[0] ("${SNAPSHOT_ARTIFACT_ID}") is missing path`);
  }
  return snapshotArtifact;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MARKDOWN RENDER HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function escapeCell(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function renderTable(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const dividerLine = `|${headers.map(() => ' --- ').join('|')}|`;
  const bodyLines = rows.map((row) => `| ${row.map(escapeCell).join(' | ')} |`);
  return [headerLine, dividerLine, ...bodyLines].join('\n');
}

function renderIdList(values) {
  return (values || []).map((value) => `\`${value}\``).join(', ');
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SECTION RENDERERS
// ─────────────────────────────────────────────────────────────────────────────

function renderMetaSection(doc) {
  const meta = doc.meta || {};
  const rows = [
    ['ownerSkill', meta.ownerSkill],
    ['reviewModeVersion', meta.reviewModeVersion],
    ['sourceOfTruth', meta.sourceOfTruth ? `\`${meta.sourceOfTruth}\`` : ''],
  ];
  if (meta.generatedNotice && meta.generatedNotice.warning) {
    rows.push(['generatedNotice.warning', meta.generatedNotice.warning]);
  }
  return ['## Meta', '', renderTable(['Field', 'Value'], rows)].join('\n');
}

function renderTargetTypesSection(doc) {
  const rows = (doc.contract.targetTypes || []).map((item) => [`\`${item.id}\``, item.label, item.description]);
  return ['## Target Types', '', renderTable(['ID', 'Label', 'Description'], rows)].join('\n');
}

function renderDimensionsSection(doc) {
  const rows = (doc.contract.dimensions || []).map((item) => [
    `\`${item.id}\``,
    item.priority,
    item.label,
    item.checks,
    item.requiredForSeverityCoverage ? 'yes' : 'no',
  ]);
  return [
    '## Dimensions',
    '',
    renderTable(['ID', 'Priority', 'Label', 'Checks', 'Required For Severity Coverage'], rows),
  ].join('\n');
}

function renderSeveritiesSection(doc) {
  const rows = (doc.contract.severities || []).map((item) => [
    `\`${item.id}\``,
    item.weight,
    item.label,
    item.requiresFileLineEvidence ? 'yes' : 'no',
  ]);
  return ['## Severities', '', renderTable(['ID', 'Weight', 'Label', 'Requires File:Line Evidence'], rows)].join('\n');
}

function renderVerdictsSection(doc) {
  const rows = (doc.contract.verdicts || []).map((item) => [
    `\`${item.id}\``,
    item.label,
    item.condition,
    item.nextCommand,
    item.hasAdvisoriesMetadata || '',
  ]);
  return [
    '## Verdicts',
    '',
    renderTable(['ID', 'Label', 'Condition', 'Next Command', 'Advisories Metadata'], rows),
  ].join('\n');
}

function renderQualityGatesSection(doc) {
  const rows = (doc.contract.qualityGates || []).map((item) => [
    `\`${item.id}\``,
    item.label,
    item.binary ? 'yes' : 'no',
    renderIdList(item.combines),
    item.rule,
  ]);
  return ['## Quality Gates', '', renderTable(['ID', 'Label', 'Binary', 'Combines', 'Rule'], rows)].join('\n');
}

function renderSettingsTable(settingsObject) {
  const rows = Object.entries(settingsObject || {}).map(([key, value]) => [key, Array.isArray(value) ? renderIdList(value) : value]);
  return renderTable(['Setting', 'Value'], rows);
}

function renderConvergenceSection(doc) {
  const convergence = doc.contract.convergence || {};
  const signalRows = (convergence.signals || []).map((item) => [`\`${item.id}\``, item.weight, item.description]);
  return [
    '## Convergence',
    '',
    '### Defaults',
    '',
    renderSettingsTable(convergence.defaults),
    '',
    '### Signals',
    '',
    renderTable(['ID', 'Weight', 'Description'], signalRows),
    '',
    '### Severity Math',
    '',
    renderSettingsTable(convergence.severityMath),
    '',
    '### Coverage Age',
    '',
    renderSettingsTable(convergence.coverageAge),
    '',
    '### Thresholds',
    '',
    renderSettingsTable(convergence.thresholds),
  ].join('\n');
}

function renderCrossReferenceProtocolsSection(doc) {
  const protocols = doc.contract.crossReferenceProtocols || [];
  const summaryRows = protocols.map((item) => [
    `\`${item.id}\``,
    item.dimension,
    item.level,
    item.gateClass,
    renderIdList(item.appliesTo),
  ]);
  const detailLines = [];
  for (const protocol of protocols) {
    detailLines.push(`### \`${protocol.id}\``, '');
    detailLines.push(`- **Pass:** ${protocol.passCriteria}`);
    detailLines.push(`- **Partial:** ${protocol.partialCriteria}`);
    detailLines.push(`- **Fail:** ${protocol.failCriteria}`);
    detailLines.push('');
  }
  return [
    '## Cross-Reference Protocols',
    '',
    renderTable(['ID', 'Dimension', 'Level', 'Gate Class', 'Applies To'], summaryRows),
    '',
    ...detailLines,
  ].join('\n').trimEnd();
}

function renderOutputsSection(doc) {
  const outputs = doc.contract.outputs || {};
  const lines = ['## Outputs', ''];
  for (const [id, spec] of Object.entries(outputs)) {
    lines.push(`### \`${id}\``, '');
    if (spec.pathPattern) lines.push(`- **Path pattern:** \`${spec.pathPattern}\``);
    if (spec.machineOwned !== undefined) lines.push(`- **Machine owned:** ${spec.machineOwned ? 'yes' : 'no'}`);
    if (Array.isArray(spec.sections)) lines.push(`- **Sections:** ${renderIdList(spec.sections)}`);
    if (Array.isArray(spec.fields)) lines.push(`- **Fields:** ${renderIdList(spec.fields)}`);
    if (Array.isArray(spec.requiredSections)) lines.push(`- **Required sections:** ${renderIdList(spec.requiredSections)}`);
    if (spec.description) lines.push(`- **Description:** ${spec.description}`);
    if (spec.iterationRecord) {
      lines.push(`- **Iteration record required:** ${renderIdList(spec.iterationRecord.required)}`);
      lines.push(`- **Iteration record optional:** ${renderIdList(spec.iterationRecord.optional)}`);
    }
    if (spec.synthesisEvent) {
      lines.push(`- **Synthesis event required:** ${renderIdList(spec.synthesisEvent.required)}`);
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}

function renderValidationSection(doc) {
  const validation = doc.validation || {};
  const rows = (validation.checks || []).map((item) => [`\`${item.id}\``, item.description]);
  return [
    '## Validation',
    '',
    `Schema version: ${validation.schemaVersion}`,
    '',
    renderTable(['ID', 'Description'], rows),
  ].join('\n');
}

const SECTION_RENDERERS = {
  meta: renderMetaSection,
  'target-types': renderTargetTypesSection,
  dimensions: renderDimensionsSection,
  severities: renderSeveritiesSection,
  verdicts: renderVerdictsSection,
  'quality-gates': renderQualityGatesSection,
  convergence: renderConvergenceSection,
  'cross-reference-protocols': renderCrossReferenceProtocolsSection,
  outputs: renderOutputsSection,
  validation: renderValidationSection,
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. DOCUMENT ASSEMBLY
// ─────────────────────────────────────────────────────────────────────────────

function renderSnapshot(doc, snapshotArtifact) {
  const sectionBodies = snapshotArtifact.sections.map((sectionId) => {
    const renderFn = SECTION_RENDERERS[sectionId];
    if (!renderFn) {
      throw new Error(
        `review_mode_contract.yaml render.artifacts[0].sections declares unknown section "${sectionId}"; ` +
        `known sections: ${Object.keys(SECTION_RENDERERS).join(', ')}`,
      );
    }
    return renderFn(doc);
  });

  const body = [
    '<!-- Generated by render-contract-snapshot.cjs. Do not hand-edit the generated block below; edit review_mode_contract.yaml and re-run the script to refresh it. -->',
    '',
    '# Review-Mode Contract Snapshot',
    '',
    'Human-readable rendering of the deep-review review-mode contract. Regenerate with:',
    '',
    '```bash',
    'node .opencode/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs',
    '```',
    '',
    snapshotArtifact.markers.begin,
    '',
    sectionBodies.join('\n\n'),
    '',
    snapshotArtifact.markers.end,
  ].join('\n');

  return `${body.trimEnd()}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function relPath(absolutePath) {
  return path.relative(WORKSPACE_ROOT, absolutePath).split(path.sep).join('/');
}

function loadContractDocument() {
  const contractPath = path.join(WORKSPACE_ROOT, CONTRACT_RELATIVE_PATH);
  const contractText = fs.readFileSync(contractPath, 'utf8');
  const doc = parseYamlDocument(contractText);
  assertContractShape(doc);
  return doc;
}

function run(argv = process.argv.slice(2)) {
  const checkOnly = argv.includes('--check');
  const doc = loadContractDocument();
  const snapshotArtifact = resolveSnapshotArtifact(doc);
  const rendered = renderSnapshot(doc, snapshotArtifact);
  const outputPath = path.resolve(WORKSPACE_ROOT, snapshotArtifact.path);

  if (checkOnly) {
    const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : null;
    if (existing !== rendered) {
      process.stderr.write(`[render-contract-snapshot] drift detected: ${relPath(outputPath)} is stale. Run without --check to regenerate.\n`);
      return 1;
    }
    process.stdout.write(`[render-contract-snapshot] OK: ${relPath(outputPath)} is up to date.\n`);
    return 0;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, rendered, 'utf8');
  process.stdout.write(`[render-contract-snapshot] wrote ${relPath(outputPath)}\n`);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = run();
  } catch (error) {
    process.stderr.write(`[render-contract-snapshot] ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  WORKSPACE_ROOT,
  CONTRACT_RELATIVE_PATH,
  parseYamlDocument,
  assertContractShape,
  resolveSnapshotArtifact,
  renderSnapshot,
  loadContractDocument,
  run,
};

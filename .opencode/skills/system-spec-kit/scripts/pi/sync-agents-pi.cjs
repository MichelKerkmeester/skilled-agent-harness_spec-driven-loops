// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Sync Pi Agents                                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const SOURCE_DIR = path.join(REPO_ROOT, '.opencode', 'agents');
const OUTPUT_DIR = path.join(REPO_ROOT, '.pi', 'agents');

// These are the literal Pi built-in names confirmed by the installed Pi type
// definitions. OpenCode-only permissions remain visible in generated YAML
// comments instead of being silently discarded. `glob`/`list` map to `find`/`ls`
// by name only; their exact capability shape (predicate-based find vs. simple
// glob matching) is asserted from the type defs, not independently verified
// against Pi's real runtime behavior.
const PERMISSION_TOOL_MAP = Object.freeze({
  read: 'read',
  write: 'write',
  edit: 'edit',
  bash: 'bash',
  grep: 'grep',
  glob: 'find',
  list: 'ls',
});

function parseArguments(argv) {
  if (argv.length === 0) {
    return { check: false };
  }
  if (argv.length === 1 && argv[0] === '--check') {
    return { check: true };
  }
  throw new Error('Usage: node sync-agents-pi.cjs [--check]');
}

function listSourceFiles() {
  if (!fs.existsSync(SOURCE_DIR)) {
    return [];
  }
  return fs.readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
}

function listOutputFiles() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    return [];
  }
  return fs.readdirSync(OUTPUT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"')) return JSON.parse(trimmed);
  if (trimmed.startsWith("'")) return trimmed.slice(1, -1).replace(/''/g, "'");
  return trimmed;
}

function parseSource(contents, sourcePath) {
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`missing YAML frontmatter in ${sourcePath}`);
  }

  const frontmatter = match[1];
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  const descriptionMatch = frontmatter.match(/^description:\s*(.+)$/m);
  if (!nameMatch || !descriptionMatch) {
    throw new Error(`frontmatter requires name and description in ${sourcePath}`);
  }

  const permissions = new Map();
  const permissionBlock = frontmatter.match(/^permission:\s*\n((?: {2,}[^\n]*\n?)*)/m);
  if (permissionBlock) {
    for (const line of permissionBlock[1].split(/\r?\n/)) {
      const permissionMatch = line.match(/^\s{2}([A-Za-z0-9_]+):\s*(allow|deny)\s*$/);
      if (permissionMatch) permissions.set(permissionMatch[1], permissionMatch[2]);
    }
  }

  return {
    name: parseScalar(nameMatch[1]),
    description: parseScalar(descriptionMatch[1]),
    permissions,
    body: match[2],
  };
}

function mapPermissions(permissions) {
  const tools = [];
  const unmapped = [];
  for (const [permission, value] of permissions) {
    if (value !== 'allow') continue;
    const mapped = PERMISSION_TOOL_MAP[permission];
    if (mapped) {
      if (!tools.includes(mapped)) tools.push(mapped);
      continue;
    }
    unmapped.push(permission);
  }
  return { tools, unmapped };
}

function yamlString(value) {
  return JSON.stringify(value);
}

// A name with a path separator or traversal segment would let a source
// frontmatter value redirect the write outside .pi/agents/ even past the
// symlink guard below, since the target path itself would never be a symlink.
function assertSafeAgentName(name, sourcePath) {
  if (name.includes('/') || name.includes('\\') || name.split(/[\\/]/).includes('..')) {
    throw new Error(`agent name "${name}" in ${sourcePath} is not a safe bare filename`);
  }
}

function renderAgent(agent) {
  const { tools, unmapped } = mapPermissions(agent.permissions);
  const lines = [
    '---',
    `name: ${yamlString(agent.name)}`,
    `description: ${yamlString(agent.description)}`,
    // Always emit an explicit tools: list, even when empty. Omitting the key
    // makes pi-subagents fall back to Pi's full builtin tool set for that
    // agent, silently discarding the source agent's own scoped permissions.
    'tools:',
    ...tools.map((tool) => `  - ${tool}`),
  ];
  if (unmapped.length > 0) {
    lines.push(`# Unmapped OpenCode permission keys: ${unmapped.join(', ')}`);
  }
  lines.push('---', agent.body);
  return lines.join('\n');
}

function buildExpectedOutputs() {
  const sourceFiles = listSourceFiles();
  if (sourceFiles.length === 0) {
    throw new Error(`No source agents found in ${SOURCE_DIR}`);
  }

  const outputs = new Map();
  for (const sourceFile of sourceFiles) {
    const sourcePath = path.join(SOURCE_DIR, sourceFile);
    const agent = parseSource(fs.readFileSync(sourcePath, 'utf8'), sourcePath);
    assertSafeAgentName(agent.name, sourcePath);
    outputs.set(`${agent.name}.md`, renderAgent(agent));
  }
  return outputs;
}

function checkOutputs(expectedOutputs) {
  const actualFiles = new Set(listOutputFiles());
  const drift = [];

  for (const [outputFile, expected] of expectedOutputs) {
    const outputPath = path.join(OUTPUT_DIR, outputFile);
    if (!actualFiles.has(outputFile)) {
      drift.push(`MISSING ${path.relative(REPO_ROOT, outputPath)}`);
      continue;
    }
    actualFiles.delete(outputFile);
    if (fs.readFileSync(outputPath, 'utf8') !== expected) {
      drift.push(`STALE ${path.relative(REPO_ROOT, outputPath)}`);
    }
  }

  for (const outputFile of [...actualFiles].sort()) {
    drift.push(`EXTRA ${path.relative(REPO_ROOT, path.join(OUTPUT_DIR, outputFile))}`);
  }

  if (drift.length > 0) {
    console.error('[pi-agent-sync] Drift detected:');
    for (const item of drift) {
      console.error(`[pi-agent-sync] ${item}`);
    }
    return false;
  }

  console.log(`[pi-agent-sync] PASS: ${expectedOutputs.size} agents are in sync.`);
  return true;
}

function writeOutputs(expectedOutputs) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const expectedFiles = new Set(expectedOutputs.keys());

  for (const outputFile of listOutputFiles()) {
    if (!expectedFiles.has(outputFile)) {
      fs.unlinkSync(path.join(OUTPUT_DIR, outputFile));
    }
  }

  let changed = 0;
  for (const [outputFile, expected] of expectedOutputs) {
    const outputPath = path.join(OUTPUT_DIR, outputFile);
    // A pre-existing symlink at a generated output path would redirect the write
    // outside the intended output root; refuse to follow it instead of writing through.
    let stat = null;
    try {
      stat = fs.lstatSync(outputPath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    if (stat && stat.isSymbolicLink()) {
      throw new Error(`refusing to write through a pre-existing symlink at ${outputPath}`);
    }
    const actual = stat ? fs.readFileSync(outputPath, 'utf8') : null;
    if (actual !== expected) {
      fs.writeFileSync(outputPath, expected, 'utf8');
      changed += 1;
    }
  }

  console.log(
    `[pi-agent-sync] Wrote ${changed} of ${expectedOutputs.size} generated agents.`,
  );
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const expectedOutputs = buildExpectedOutputs();
  if (options.check) {
    if (!checkOutputs(expectedOutputs)) {
      process.exitCode = 1;
    }
    return;
  }
  writeOutputs(expectedOutputs);
}

try {
  main();
} catch (error) {
  console.error(`[pi-agent-sync] ERROR: ${error.message}`);
  process.exitCode = 1;
}

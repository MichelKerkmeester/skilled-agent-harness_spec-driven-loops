// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Sync Codex Agents                                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const SOURCE_DIR = path.join(REPO_ROOT, '.opencode', 'agents');
const OUTPUT_DIR = path.join(REPO_ROOT, '.codex', 'agents');
const WRITABLE_TOOLS = new Set(['write', 'edit', 'bash']);
const DEFAULT_SETTINGS = Object.freeze({
  model: 'gpt-5.5',
  modelReasoningEffort: 'high',
});

// Preserve settings recovered from the retired Codex adapters.
const HISTORICAL_SETTINGS = Object.freeze({
  'ai-council': { sandboxMode: 'workspace-write', ...DEFAULT_SETTINGS },
  code: { sandboxMode: 'workspace-write', ...DEFAULT_SETTINGS },
  context: { sandboxMode: 'read-only', ...DEFAULT_SETTINGS },
  debug: { sandboxMode: 'workspace-write', ...DEFAULT_SETTINGS },
  // deep-alignment intentionally runs workspace-write: it writes its own JSONL state,
  // deltas, and logs via Bash while treating every audited artifact as read-only by scope.
  'deep-alignment': { sandboxMode: 'workspace-write', ...DEFAULT_SETTINGS },
  'deep-improvement': { sandboxMode: 'workspace-write', ...DEFAULT_SETTINGS },
  'deep-research': { sandboxMode: 'workspace-write', ...DEFAULT_SETTINGS },
  'deep-review': { sandboxMode: 'workspace-write', ...DEFAULT_SETTINGS },
  design: { sandboxMode: 'workspace-write', ...DEFAULT_SETTINGS },
  markdown: {
    sandboxMode: 'workspace-write',
    model: 'gpt-5.5',
    modelReasoningEffort: 'medium',
  },
  orchestrate: { sandboxMode: 'read-only', ...DEFAULT_SETTINGS },
  'prompt-improver': { sandboxMode: 'read-only', ...DEFAULT_SETTINGS },
  review: { sandboxMode: 'read-only', ...DEFAULT_SETTINGS },
});

function parseArguments(argv) {
  if (argv.length === 0) {
    return { check: false };
  }
  if (argv.length === 1 && argv[0] === '--check') {
    return { check: true };
  }
  throw new Error('Usage: node sync-agents.cjs [--check]');
}

function listFiles(directory, extension) {
  if (!fs.existsSync(directory)) {
    return [];
  }
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => entry.name)
    .sort();
}

function parseFrontmatter(source, sourcePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/);
  if (!match) {
    throw new Error(`${sourcePath}: missing YAML frontmatter`);
  }
  return {
    frontmatter: match[1],
    body: source.slice(match[0].length),
  };
}

function parseScalar(frontmatter, key, sourcePath) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\r?$`, 'm'));
  if (!match) {
    throw new Error(`${sourcePath}: missing frontmatter ${key}`);
  }

  const value = match[1].trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`${sourcePath}: invalid quoted ${key}: ${error.message}`);
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

function extractSection(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);
  const startPattern = new RegExp(`^(\\s*)${key}:\\s*(.*?)\\s*$`, 'i');
  const startIndex = lines.findIndex((line) => startPattern.test(line));
  if (startIndex < 0) {
    return null;
  }

  const startMatch = lines[startIndex].match(startPattern);
  const indent = startMatch[1].length;
  const sectionLines = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() && line.match(/^\s*/)[0].length <= indent) {
      break;
    }
    sectionLines.push(line);
  }
  return { inline: startMatch[2], lines: sectionLines };
}

function sectionGrantsWritableTool(section) {
  if (!section) {
    return false;
  }

  const inlineTools = section.inline.toLowerCase().match(/[a-z][a-z-]*/g) || [];
  if (inlineTools.some((tool) => WRITABLE_TOOLS.has(tool))) {
    return true;
  }

  for (const line of section.lines) {
    const listItem = line.match(/^\s*-\s*([A-Za-z][A-Za-z-]*)\s*$/);
    if (listItem && WRITABLE_TOOLS.has(listItem[1].toLowerCase())) {
      return true;
    }

    const mapping = line.match(/^\s*([A-Za-z][A-Za-z-]*):\s*([^#\s]+)?/);
    if (mapping && WRITABLE_TOOLS.has(mapping[1].toLowerCase())) {
      const value = (mapping[2] || '').toLowerCase();
      if (['allow', 'allowed', 'true', 'yes'].includes(value)) {
        return true;
      }
    }
  }
  return false;
}

function deriveSandboxMode(frontmatter) {
  const permission = extractSection(frontmatter, 'permission');
  if (sectionGrantsWritableTool(permission)) {
    return 'workspace-write';
  }

  for (const key of ['tools', 'allowed-tools']) {
    if (sectionGrantsWritableTool(extractSection(frontmatter, key))) {
      return 'workspace-write';
    }
  }
  return 'read-only';
}

function tomlString(value) {
  return JSON.stringify(value);
}

function formatDeveloperInstructions(body) {
  if (body.includes("'''")) {
    return tomlString(body);
  }
  return `'''${body}'''`;
}

function renderAgent(sourceFile) {
  const sourcePath = path.join(SOURCE_DIR, sourceFile);
  const source = fs.readFileSync(sourcePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(source, sourcePath);
  const basename = path.basename(sourceFile, '.md');
  const name = parseScalar(frontmatter, 'name', sourcePath);
  const description = parseScalar(frontmatter, 'description', sourcePath);

  if (!/^[a-z0-9][a-z0-9-]*$/.test(basename)) {
    throw new Error(`${sourcePath}: unsupported agent filename`);
  }
  if (name !== basename) {
    throw new Error(`${sourcePath}: frontmatter name must equal filename basename`);
  }

  const settings = HISTORICAL_SETTINGS[name] || {
    sandboxMode: deriveSandboxMode(frontmatter),
    ...DEFAULT_SETTINGS,
  };

  return [
    `# Agent: ${name}`,
    `# Converted from: .opencode/agents/${sourceFile}`,
    `name = ${tomlString(name)}`,
    `description = ${tomlString(description)}`,
    `sandbox_mode = ${tomlString(settings.sandboxMode)}`,
    `model = ${tomlString(settings.model)}`,
    `model_reasoning_effort = ${tomlString(settings.modelReasoningEffort)}`,
    '',
    `developer_instructions = ${formatDeveloperInstructions(body)}`,
    '',
  ].join('\n');
}

function buildExpectedOutputs() {
  const sourceFiles = listFiles(SOURCE_DIR, '.md');
  if (sourceFiles.length === 0) {
    throw new Error(`No canonical agents found in ${SOURCE_DIR}`);
  }

  return new Map(sourceFiles.map((sourceFile) => [
    `${path.basename(sourceFile, '.md')}.toml`,
    renderAgent(sourceFile),
  ]));
}

function checkOutputs(expectedOutputs) {
  const actualFiles = new Set(listFiles(OUTPUT_DIR, '.toml'));
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
    console.error('[codex-agent-sync] Drift detected:');
    for (const item of drift) {
      console.error(`[codex-agent-sync] ${item}`);
    }
    return false;
  }

  console.log(`[codex-agent-sync] PASS: ${expectedOutputs.size} agents are in sync.`);
  return true;
}

function writeOutputs(expectedOutputs) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const expectedFiles = new Set(expectedOutputs.keys());

  for (const outputFile of listFiles(OUTPUT_DIR, '.toml')) {
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
    `[codex-agent-sync] Wrote ${changed} of ${expectedOutputs.size} generated agents.`,
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
  console.error(`[codex-agent-sync] ERROR: ${error.message}`);
  process.exitCode = 1;
}

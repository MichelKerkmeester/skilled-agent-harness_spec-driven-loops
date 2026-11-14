#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ sync-agent-roster — regenerate roster blocks from agent-registry.json    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// The routing table in orchestrate.md and the inventory in README.txt are read
// by dispatchers and by people, so they drift silently as soon as an agent is
// added, renumbered or removed. This script treats agent-registry.json as the
// single source: it rewrites only the text between each block's marker pair,
// and --check reports every disagreement without touching a file.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Repo root relative to this file: bin -> .skilled -> root
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const AGENTS_DIR = path.join(REPO_ROOT, '.skilled', 'agents');
const REGISTRY_PATH = path.join(AGENTS_DIR, 'agent-registry.json');

const ORCHESTRATE = {
  path: path.join(AGENTS_DIR, 'orchestrate.md'),
  relative: '.skilled/agents/orchestrate.md',
  beginPrefix: '<!-- BEGIN GENERATED: ',
  endPrefix: '<!-- END GENERATED: ',
};

const README = {
  path: path.join(AGENTS_DIR, 'README.txt'),
  relative: '.skilled/agents/README.txt',
  beginPrefix: '# BEGIN GENERATED: ',
  endPrefix: '# END GENERATED: ',
};

const BLOCKS = [
  { name: 'routing-table', file: ORCHESTRATE, generate: generateRoutingTable },
  { name: 'tier-table', file: ORCHESTRATE, generate: generateTierTable },
  { name: 'agent-files', file: ORCHESTRATE, generate: generateAgentFiles },
  { name: 'readme-roster', file: README, generate: generateReadmeRoster },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function loadRegistry() {
  let raw;
  try {
    raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
  } catch (err) {
    console.error(`agent-roster: cannot read agent-registry.json: ${err.message}`);
    process.exit(2);
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`agent-roster: cannot parse agent-registry.json: ${err.message}`);
    process.exit(2);
  }
}

function registryAgents(registry) {
  return Array.isArray(registry.agents) ? registry.agents : [];
}

// A routed agent is one the registry scheduled, which is exactly the records
// carrying a numeric priority. The orchestrator has none and stays out.
function routedAgents(registry) {
  return registryAgents(registry)
    .filter((agent) => typeof agent.priority === 'number')
    .sort((left, right) => left.priority - right.priority);
}

function generateRoutingTable(registry) {
  const lines = [
    '| Priority | Task Type | Agent | Tier | Skills | subagent_type |',
    '| --- | --- | --- | --- | --- | --- |',
  ];
  for (const agent of routedAgents(registry)) {
    lines.push(
      `| ${agent.priority} | ${agent.taskType} | \`@${agent.name}\` | ${agent.tier} | ${agent.skills} | \`"${agent.name}"\` |`,
    );
  }
  for (const extra of registry.routingExtras || []) {
    lines.push(
      `| ${extra.priority} | ${extra.taskType} | ${extra.agent} | ${extra.tier} | ${extra.skills} | ${extra.subagentType} |`,
    );
  }
  return lines;
}

function generateTierTable(registry) {
  const leafNames = routedAgents(registry)
    .filter((agent) => agent.tier === 'LEAF')
    .map((agent) => `@${agent.name}`)
    .join(', ');
  return [
    '| Tier | Dispatch Authority | Who |',
    '| --- | --- | --- |',
    '| **ORCHESTRATOR** | Can dispatch LEAF agents | Top-level orchestrator only |',
    `| **LEAF** | MUST NOT dispatch any sub-agents | ${leafNames} |`,
  ];
}

function generateAgentFiles(registry) {
  const lines = [
    '| Agent | File | Notes |',
    '| --- | --- | --- |',
  ];
  for (const agent of routedAgents(registry)) {
    lines.push(`| @${agent.name} | \`.skilled/agents/${agent.name}.md\` | ${agent.notes} |`);
  }
  return lines;
}

function generateReadmeRoster(registry) {
  const agents = [...registryAgents(registry)].sort((left, right) => {
    if (left.name < right.name) return -1;
    if (left.name > right.name) return 1;
    return 0;
  });
  const longestName = agents.reduce((longest, agent) => Math.max(longest, agent.name.length), 0);
  const lines = ['Agents:'];
  for (const agent of agents) {
    // The summary column starts at (longestName + 3) past the two-space indent,
    // so the name, its colon and this padding lift every summary together.
    const padding = ' '.repeat(longestName - agent.name.length + 2);
    lines.push(`  ${agent.name}:${padding}${agent.summary}`);
  }
  return lines;
}

function readLines(filePath) {
  return fs.readFileSync(filePath, 'utf8').split('\n');
}

// Agent files cite skill files and skill directories as paths, so renaming a
// skill or moving its SKILL.md leaves a citation that only fails when the
// agent tries to read it mid-task. Resolving every citation here turns that
// dead end into a check-mode problem line.
function skillPathProblems(agentName) {
  const problems = [];
  const seen = new Set();
  const source = fs.readFileSync(path.join(AGENTS_DIR, `${agentName}.md`), 'utf8');
  for (const match of source.matchAll(/\.skilled\/skills\/[A-Za-z0-9_./*<>-]*/g)) {
    // A trailing dot is sentence punctuation, not part of the path.
    const token = match[0].replace(/\.+$/, '');
    // Angle brackets and stars mark placeholders and globs, not real paths.
    if (token.includes('<') || token.includes('>') || token.includes('*')) {
      continue;
    }
    if (seen.has(token)) {
      continue;
    }
    seen.add(token);
    if (token.includes('..')) {
      problems.push(`skill path escapes the repository: ${agentName}: ${token}`);
      continue;
    }
    // The token is root-relative and ".." is gone, so the lookup below never
    // reaches outside the repository.
    const target = path.resolve(REPO_ROOT, token);
    if (!fs.existsSync(target)) {
      problems.push(`missing skill path: ${agentName}: ${token}`);
      continue;
    }
    if (fs.statSync(target).isDirectory() && !fs.existsSync(path.join(target, 'SKILL.md'))) {
      problems.push(`skill directory without SKILL.md: ${agentName}: ${token}`);
    }
  }
  return problems;
}

// Markers are matched by their prefix through the block name, so the trailing
// "edit ... and run ..." hint on a begin marker may change without hiding it.
function findBlock(lines, file, name) {
  const beginIndex = lines.findIndex((line) => line.trim().startsWith(`${file.beginPrefix}${name}`));
  if (beginIndex === -1) {
    return null;
  }
  const endIndex = lines.findIndex(
    (line, index) => index > beginIndex && line.trim().startsWith(`${file.endPrefix}${name}`),
  );
  return endIndex === -1 ? null : { beginIndex, endIndex };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function writeMode(registry) {
  // Refuse the whole run before the first write: a partial rewrite would leave
  // the roster half-generated and send the next reader to the wrong file.
  const missing = BLOCKS.filter(
    (block) => findBlock(readLines(block.file.path), block.file, block.name) === null,
  );
  if (missing.length > 0) {
    for (const block of missing) {
      console.log(`missing block: ${block.name} in ${block.file.relative}`);
    }
    process.exit(1);
  }

  const files = [...new Set(BLOCKS.map((block) => block.file))];
  for (const file of files) {
    const original = fs.readFileSync(file.path, 'utf8');
    const lines = original.split('\n');
    for (const block of BLOCKS.filter((entry) => entry.file === file)) {
      // Re-locate after every splice so earlier rewrites cannot shift this one.
      const position = findBlock(lines, file, block.name);
      const generated = block.generate(registry);
      const current = lines.slice(position.beginIndex + 1, position.endIndex);
      if (current.join('\n') === generated.join('\n')) {
        console.log(`unchanged ${block.name}`);
        continue;
      }
      lines.splice(position.beginIndex + 1, position.endIndex - position.beginIndex - 1, ...generated);
      console.log(`updated ${block.name}`);
    }
    const next = lines.join('\n');
    if (next !== original) {
      fs.writeFileSync(file.path, next, 'utf8');
    }
  }
  process.exit(0);
}

function checkMode(registry) {
  const problems = [];
  const agents = registryAgents(registry);

  if (agents.length === 0) {
    problems.push('registry holds no agents');
  }

  const agentFiles = fs
    .readdirSync(AGENTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.basename(file, '.md'))
    .sort();
  const recordNames = new Set(agents.map((agent) => agent.name));
  const fileNames = new Set(agentFiles);

  for (const name of agentFiles) {
    if (!recordNames.has(name)) {
      problems.push(`agent file without a registry record: ${name}`);
    }
  }

  for (const agent of agents) {
    if (!fileNames.has(agent.name)) {
      problems.push(`registry record without an agent file: ${agent.name}`);
    }
    if (!Array.isArray(agent.dispatchers) || agent.dispatchers.length === 0) {
      problems.push(`registry record names no dispatcher: ${agent.name}`);
    }
  }

  for (const name of agentFiles) {
    problems.push(...skillPathProblems(name));
  }

  for (const block of BLOCKS) {
    const lines = readLines(block.file.path);
    const position = findBlock(lines, block.file, block.name);
    if (position === null) {
      problems.push(`missing block: ${block.name} in ${block.file.relative}`);
      continue;
    }
    const current = lines.slice(position.beginIndex + 1, position.endIndex).join('\n');
    if (current !== block.generate(registry).join('\n')) {
      problems.push(`stale block: ${block.name} in ${block.file.relative}`);
    }
  }

  for (const problem of problems) {
    console.log(problem);
  }
  if (problems.length === 0) {
    console.log('agent-roster: OK');
    process.exit(0);
  }
  console.log(`agent-roster: FAIL (${problems.length} problem(s))`);
  process.exit(1);
}

function main() {
  const args = process.argv.slice(2);

  // An unrecognized flag must never fall through to write mode and rewrite the
  // roster because of a typo in a check invocation.
  const unknownOption = args.find((arg) => arg !== '--check');
  if (unknownOption !== undefined) {
    console.error(`sync-agent-roster.cjs: unknown option: ${unknownOption}`);
    console.error('usage: sync-agent-roster.cjs [--check]');
    process.exit(2);
  }

  const registry = loadRegistry();
  if (args.includes('--check')) {
    checkMode(registry);
  } else {
    writeMode(registry);
  }
}

main();

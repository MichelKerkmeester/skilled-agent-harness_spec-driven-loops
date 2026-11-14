import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '..', '..');
const SCRIPTS_DIR = '.skilled/bin';
const AGENTS_DIR = '.skilled/agents';
const SCRIPT_NAME = 'sync-agent-roster.cjs';
const REGISTRY_NAME = 'agent-registry.json';

type AgentRecord = {
  name: string;
  tier: 'LEAF' | 'ORCHESTRATOR';
  priority: number | null;
  dispatchers: string[];
  taskType: string;
  skills: string;
  notes: string;
  summary: string;
};

type Registry = {
  version: number;
  description: string;
  agents: AgentRecord[];
  routingExtras: Array<{
    priority: number;
    taskType: string;
    agent: string;
    tier: string;
    skills: string;
    subagentType: string;
  }>;
};

const ROUTED_NAMES = [
  'alpha',
  'bravo',
  'charlie',
  'delta',
  'echo',
  'foxtrot',
  'golf',
  'hotel',
  'india',
  'juliet',
];

const ORCHESTRATE_DOC = `# Fixture Orchestrator

## 2. ROUTING SCAN

### Agent Selection

<!-- BEGIN GENERATED: routing-table. Edit agent-registry.json, then run node .skilled/bin/sync-agent-roster.cjs -->
placeholder
<!-- END GENERATED: routing-table -->

### Agent Tier Classification

<!-- BEGIN GENERATED: tier-table. Edit agent-registry.json, then run node .skilled/bin/sync-agent-roster.cjs -->
placeholder
<!-- END GENERATED: tier-table -->

### Agent Files

<!-- BEGIN GENERATED: agent-files. Edit agent-registry.json, then run node .skilled/bin/sync-agent-roster.cjs -->
placeholder
<!-- END GENERATED: agent-files -->
`;

const README_DOC = `AGENTS DIRECTORY
================

Agents:
# BEGIN GENERATED: readme-roster. Edit agent-registry.json, then run node .skilled/bin/sync-agent-roster.cjs
placeholder
# END GENERATED: readme-roster
`;

let tmpDir: string;

function buildRegistry(): Registry {
  const agents: AgentRecord[] = ROUTED_NAMES.map((name, index) => ({
    name,
    tier: 'LEAF',
    priority: index + 1,
    dispatchers: ['orchestrate'],
    taskType: `${name} tasks`,
    skills: `skill-${name}`,
    notes: `${name} notes`,
    summary: `${name} summary`,
  }));
  agents.push({
    name: 'orchestrate',
    tier: 'ORCHESTRATOR',
    priority: null,
    dispatchers: ['operator'],
    taskType: 'Task decomposition and delegation',
    skills: 'n/a',
    notes: 'Top-level orchestrator',
    summary: 'top-level orchestrator',
  });
  return {
    version: 1,
    description: 'fixture registry',
    agents,
    routingExtras: [
      {
        priority: 11,
        taskType: 'External CLI execution when the user names an executor',
        agent: '`cli-<mode>` via the external orchestration hub',
        tier: 'LEAF',
        skills: 'external orchestration packet',
        subagentType: 'n/a (external process)',
      },
    ],
  };
}

function writeFile(relativePath: string, content: string): void {
  const filePath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function citeSkillPath(agentName: string, token: string): void {
  const agentPath = path.join(tmpDir, AGENTS_DIR, `${agentName}.md`);
  fs.appendFileSync(agentPath, `\nSee ${token} for details.\n`, 'utf8');
}

function readRegistry(): Registry {
  return JSON.parse(fs.readFileSync(path.join(tmpDir, AGENTS_DIR, REGISTRY_NAME), 'utf8')) as Registry;
}

function writeRegistry(registry: Registry): void {
  writeFile(path.join(AGENTS_DIR, REGISTRY_NAME), `${JSON.stringify(registry, null, 2)}\n`);
}

function runSync(...args: string[]) {
  return spawnSync(process.execPath, [path.join(tmpDir, SCRIPTS_DIR, SCRIPT_NAME), ...args], {
    cwd: tmpDir,
    encoding: 'utf8',
  });
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-agent-roster-'));
  // The script finds its repository from its own location, so a copy at the
  // same depth rewrites the fixture rosters instead of the real ones.
  writeFile(
    path.join(SCRIPTS_DIR, SCRIPT_NAME),
    fs.readFileSync(path.join(WORKSPACE_ROOT, SCRIPTS_DIR, SCRIPT_NAME), 'utf8'),
  );

  const registry = buildRegistry();
  writeRegistry(registry);
  for (const agent of registry.agents) {
    writeFile(path.join(AGENTS_DIR, `${agent.name}.md`), `---\nname: ${agent.name}\n---\n\n# ${agent.name}\n`);
  }
  writeFile(path.join(AGENTS_DIR, 'orchestrate.md'), ORCHESTRATE_DOC);
  writeFile(path.join(AGENTS_DIR, 'README.txt'), README_DOC);

  const generated = runSync();
  expect(generated.status).toBe(0);
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('sync-agent-roster', () => {
  it('passes on a tree that write mode just generated', () => {
    const result = runSync('--check');

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('agent-roster: OK');
  });

  it('fails when a registry record is removed', () => {
    const registry = readRegistry();
    registry.agents = registry.agents.filter((agent) => agent.name !== 'juliet');
    writeRegistry(registry);

    const result = runSync('--check');

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('juliet');
  });

  it('rejects a hand-edited block', () => {
    const orchestratePath = path.join(tmpDir, AGENTS_DIR, 'orchestrate.md');
    const content = fs.readFileSync(orchestratePath, 'utf8');
    fs.writeFileSync(orchestratePath, content.replace('| 1 |', '| 1 | hand-edited'), 'utf8');

    const result = runSync('--check');

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('stale block: routing-table');
  });

  it('flags a stale README roster', () => {
    const registry = readRegistry();
    registry.agents.push({
      name: 'kilo',
      tier: 'LEAF',
      priority: 12,
      dispatchers: ['orchestrate'],
      taskType: 'kilo tasks',
      skills: 'skill-kilo',
      notes: 'kilo notes',
      summary: 'kilo summary',
    });
    writeRegistry(registry);
    writeFile(path.join(AGENTS_DIR, 'kilo.md'), '---\nname: kilo\n---\n\n# kilo\n');

    const result = runSync('--check');

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('stale block: readme-roster');
  });

  it('flags a missing skill path', () => {
    citeSkillPath('alpha', '.skilled/skills/demo/missing.md');

    const result = runSync('--check');

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('missing skill path:');
    expect(result.stdout).toContain('alpha');
    expect(result.stdout).toContain('.skilled/skills/demo/missing.md');
  });

  it('rejects a skill path containing ..', () => {
    citeSkillPath('alpha', '.skilled/skills/../outside.md');

    const result = runSync('--check');

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('skill path escapes the repository:');
  });

  it('skips a placeholder in angle brackets', () => {
    writeFile('.skilled/skills/demo/SKILL.md', '# demo\n');
    citeSkillPath('alpha', '.skilled/skills/<skill>/SKILL.md');
    citeSkillPath('alpha', '.skilled/skills/demo/SKILL.md');

    const result = runSync('--check');

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('agent-roster: OK');
  });
});

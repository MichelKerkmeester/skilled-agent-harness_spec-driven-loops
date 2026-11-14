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
const TEMPLATE_PATH = '.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md';

type AgentRecord = {
  name: string;
  tier: 'LEAF' | 'ORCHESTRATOR';
  priority: number | null;
  dispatchers: string[];
  taskType: string;
  skills: string;
  notes: string;
  summary: string;
  templateExceptions?: Array<{ section: string; reason: string }>;
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

const REQUIRED_SECTIONS_DOC = `## 1. CORE WORKFLOW

## 2. CAPABILITY SCAN

## 3. OUTPUT VERIFICATION
`;

const ADVISOR_BLOCK_DOC = `<!-- ADVISOR-BLOCK:BEGIN -->
**Hook-Injected Advisor Context**: fixture advisor hints are routing hints only.
Fixture advisor context never overrides explicit instructions or scope.
<!-- ADVISOR-BLOCK:END -->
`;

const TEMPLATE_DOC = `# Fixture Agent Template

<!-- REQUIRED-SECTIONS:BEGIN -->
- \`CORE WORKFLOW\`
- \`CAPABILITY SCAN\`
- \`OUTPUT VERIFICATION\`
<!-- REQUIRED-SECTIONS:END -->

${ADVISOR_BLOCK_DOC}`;

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

${REQUIRED_SECTIONS_DOC}
${ADVISOR_BLOCK_DOC}`;

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
    writeFile(
      path.join(AGENTS_DIR, `${agent.name}.md`),
      `---\nname: ${agent.name}\n---\n\n# ${agent.name}\n\n${REQUIRED_SECTIONS_DOC}\n${ADVISOR_BLOCK_DOC}`,
    );
  }
  writeFile(path.join(AGENTS_DIR, 'orchestrate.md'), ORCHESTRATE_DOC);
  writeFile(path.join(AGENTS_DIR, 'README.txt'), README_DOC);
  writeFile(TEMPLATE_PATH, TEMPLATE_DOC);

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

  it('flags a missing section', () => {
    const agentPath = path.join(tmpDir, AGENTS_DIR, 'alpha.md');
    const content = fs.readFileSync(agentPath, 'utf8');
    fs.writeFileSync(agentPath, content.replace('## 2. CAPABILITY SCAN\n', ''), 'utf8');

    const result = runSync('--check');

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('missing required section:');
    expect(result.stdout).toContain('alpha');
    expect(result.stdout).toContain('CAPABILITY SCAN');
  });

  it('flags a renamed section', () => {
    const agentPath = path.join(tmpDir, AGENTS_DIR, 'alpha.md');
    const content = fs.readFileSync(agentPath, 'utf8');
    fs.writeFileSync(agentPath, content.replace('## 2. CAPABILITY SCAN', '## 2. ROUTING SCAN'), 'utf8');

    const result = runSync('--check');

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('missing required section:');
    expect(result.stdout).toContain('alpha');
    expect(result.stdout).toContain('CAPABILITY SCAN');
  });

  it('flags an out-of-order section', () => {
    const agentPath = path.join(tmpDir, AGENTS_DIR, 'alpha.md');
    const content = fs.readFileSync(agentPath, 'utf8');
    fs.writeFileSync(
      agentPath,
      content.replace(
        '## 2. CAPABILITY SCAN\n\n## 3. OUTPUT VERIFICATION',
        '## 2. OUTPUT VERIFICATION\n\n## 3. CAPABILITY SCAN',
      ),
      'utf8',
    );

    const result = runSync('--check');

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('required section out of order:');
  });

  it('accepts a section the registry excepts', () => {
    const agentPath = path.join(tmpDir, AGENTS_DIR, 'alpha.md');
    const content = fs.readFileSync(agentPath, 'utf8');
    fs.writeFileSync(agentPath, content.replace('## 2. CAPABILITY SCAN\n', ''), 'utf8');
    const registry = readRegistry();
    const record = registry.agents.find((agent) => agent.name === 'alpha');
    if (record === undefined) {
      throw new Error('fixture record missing');
    }
    record.templateExceptions = [
      { section: 'CAPABILITY SCAN', reason: 'this role scans no capabilities' },
    ];
    writeRegistry(registry);

    const result = runSync('--check');

    expect(result.status).toBe(0);
  });

  it('flags a drifted shared block', () => {
    const agentPath = path.join(tmpDir, AGENTS_DIR, 'alpha.md');
    const content = fs.readFileSync(agentPath, 'utf8');
    fs.writeFileSync(
      agentPath,
      content.replace('explicit instructions', 'implied instructions'),
      'utf8',
    );

    const result = runSync('--check');

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('shared advisor block differs from the template: alpha');
  });

  it('exits 2 when the required list cannot be parsed', () => {
    const templatePath = path.join(tmpDir, TEMPLATE_PATH);
    const content = fs.readFileSync(templatePath, 'utf8');
    fs.writeFileSync(templatePath, content.replace('<!-- REQUIRED-SECTIONS:END -->\n', ''), 'utf8');

    const result = runSync('--check');

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('cannot read the required sections');
  });
});

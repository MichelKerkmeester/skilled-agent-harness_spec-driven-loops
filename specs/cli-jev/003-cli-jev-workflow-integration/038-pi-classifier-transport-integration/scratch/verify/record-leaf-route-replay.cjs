#!/usr/bin/env node
// Records one switch-off run of the leaf-route-replay jev arm so two builds can be
// compared byte for byte. Everything lives in os.tmpdir(), so the recording that
// lands on disk carries no absolute path from this machine.
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const S = require('../../../../../../.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs');

// Shared by every synthetic hub below: one active router, two intents, tied.
const ROUTER_BODY = [
  'INTENT_SIGNALS = {',
  '    "BETA": {"weight": 3, "keywords": ["beta"]},',
  '    "ALPHA": {"weight": 4, "keywords": ["alpha"]}',
  '}',
  '',
  'RESOURCE_MAP = {',
  '    "BETA": ["pkt-b/references/b.md"],',
  '    "ALPHA": ["pkt-a/references/a.md"]',
  '}'
].join('\n');

function routerText(state, body) {
  return [
    '---',
    `router_state: ${state}`,
    'skill_pointer: SKILL.md',
    '---',
    '',
    '# Synthetic Router',
    '',
    '```python',
    body,
    '```',
    ''
  ].join('\n');
}

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-route-replay-'));
}

// A repository whose sk-doc hub holds five tied rows, so the jev arm has the
// headroom it needs to run its calls.
function tiedRepoRoot() {
  const repoRoot = tempDir();
  const hubRoot = path.join(repoRoot, '.skilled', 'skills', 'sk-doc');
  const playbookRoot = path.join(hubRoot, 'manual-testing-playbook', 'compiled-routing');
  fs.mkdirSync(playbookRoot, { recursive: true });
  fs.writeFileSync(path.join(hubRoot, 'ROUTER.md'), routerText('active', ROUTER_BODY));
  fs.writeFileSync(path.join(hubRoot, 'mode-registry.json'), JSON.stringify({
    modes: [
      { workflowMode: 'mode-a', packet: 'pkt-a' },
      { workflowMode: 'mode-b', packet: 'pkt-b' }
    ]
  }));
  for (let i = 0; i < 5; i += 1) {
    fs.writeFileSync(path.join(playbookRoot, `s${i + 1}.md`), [
      '---',
      `id: S-${i + 1}`,
      'expected_leaf_resources:',
      '  - workflow_mode: mode-a',
      '    leaf_resource_id: references/a.md',
      '---',
      '',
      `# S-${i + 1}`,
      '',
      '**Exact prompt**:',
      '',
      '```',
      'alpha beta',
      '```',
      ''
    ].join('\n'));
  }
  return repoRoot;
}

function makeStubs() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-route-replay-stubs-'));
  const log = path.join(dir, 'calls.log');

  const choice = [
    '  choice)',
    '    text=$(cat)',
    '    if [ -n "$STUB_CHOICE_EXIT" ]; then exit "$STUB_CHOICE_EXIT"; fi',
    '    key="${STUB_CHOICE:-none_of_these}"',
    '    printf \'{"answers":{"answer":{"choice":"%s","probabilities":{"%s":0.9}}},"model":"stub-jev-model"}\\n\' "$key" "$key"',
    '    ;;'
  ];

  const scripts = {
    jev: [
      '#!/bin/sh',
      `printf '%s %s\\n' "jev" "$*" >> "$STUB_LOG"`,
      'case "$1" in',
      '  --version) echo "${STUB_JEV_VERSION:-jev 0.6.2}" ;;',
      '  auth)',
      '    case "$2" in',
      '      status) exit "${STUB_AUTH_EXIT:-0}" ;;',
      '      test) echo \'{"model":"stub-jev-model"}\' ;;',
      '      *) exit 2 ;;',
      '    esac ;;',
      ...choice,
      '  *) exit 2 ;;',
      'esac'
    ].join('\n') + '\n',
    'cli-deem': [
      '#!/bin/sh',
      `printf '%s %s\\n' "cli-deem" "$*" >> "$STUB_LOG"`,
      'case "$1" in',
      '  health) echo \'{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"mc1","source_commit":"sc1"}\' ;;',
      ...choice,
      '  *) exit 2 ;;',
      'esac'
    ].join('\n') + '\n'
  };

  const write = (name) => {
    const file = path.join(dir, name);
    fs.writeFileSync(file, scripts[name]);
    fs.chmodSync(file, 0o755);
  };
  write('cli-deem');
  write('jev');

  return { dir, log };
}

function captureSinks() {
  const stdout = [];
  const stderr = [];
  return {
    out: (line) => stdout.push(line),
    err: (line) => stderr.push(line),
    stdout,
    stderr
  };
}

// Wall time is the one field no two runs can share.
function maskWallMs(text) {
  return text.replace(/"wall_ms":\d+/g, '"wall_ms":0');
}

function scrub(text, replacements) {
  let scrubbed = text;
  for (const [needle, token] of replacements) scrubbed = scrubbed.split(needle).join(token);
  return scrubbed;
}

async function record(outFile) {
  const repoRoot = tiedRepoRoot();
  const stubs = makeStubs();
  const outDir = path.join(repoRoot, 'out');
  const sinks = captureSinks();
  try {
    const code = await S.main(['--jev', '--out', outDir], {
      out: sinks.out,
      err: sinks.err,
      repoRoot,
      env: { PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log }
    });
    const argvLog = fs.existsSync(stubs.log) ? fs.readFileSync(stubs.log, 'utf8') : '';
    const callsPath = path.join(outDir, 'calls.jsonl');
    const calls = fs.existsSync(callsPath) ? fs.readFileSync(callsPath, 'utf8') : '<absent>\n';
    const recording = [
      '== exit ' + code + ' ==',
      '== stdout ==',
      sinks.stdout.join('\n'),
      '== stderr ==',
      sinks.stderr.join('\n'),
      '== stub argv ==',
      argvLog.trimEnd(),
      '== calls.jsonl (wall_ms masked) ==',
      maskWallMs(calls).trimEnd(),
      ''
    ].join('\n');
    fs.writeFileSync(outFile, scrub(recording, [[outDir, '<OUT>'], [repoRoot, '<REPO_ROOT>'], [stubs.dir, '<STUBS>']]));
    process.stdout.write(`recorded ${sinks.stdout.length} stdout lines, exit ${code}\n`);
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
}

const outFile = process.argv[2];
if (!outFile) {
  process.stderr.write('usage: record-leaf-route-replay.cjs <output-file>\n');
  process.exitCode = 2;
} else {
  record(outFile);
}

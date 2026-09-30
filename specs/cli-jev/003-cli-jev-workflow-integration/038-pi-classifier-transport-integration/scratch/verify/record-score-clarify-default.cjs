#!/usr/bin/env node
// Records one switch-off run of the score-clarify-default jev arm so two builds can
// be compared byte for byte. The rows file, the records and the stubs all live in
// os.tmpdir(), so the recording that lands on disk carries no absolute path.
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SCRIPT = path.resolve(__dirname, '../../../../../../.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs');

function writeRowsFile(dir, labels) {
  const lines = labels.map((label, i) => JSON.stringify({
    id: 'r' + i,
    hub: 'cli-external-orchestration',
    source: 'canary',
    prompt: 'row ' + i + ' pick=' + (label === 'first' ? 'cli-claude-code' : 'cli-codex') + ' first=cli-claude-code',
    alternatives: ['cli-claude-code', 'cli-codex'],
    gold: null,
    label: label === 'second' ? 'cli-codex' : label === 'first' ? 'cli-claude-code' : ''
  }));
  const file = path.join(dir, 'rows.jsonl');
  fs.writeFileSync(file, lines.join('\n') + '\n');
  return file;
}

function makeStubs() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-stubs-'));
  const log = path.join(dir, 'calls.log');

  const choice = [
    '  choice)',
    '    text=$(cat)',
    '    case "$text" in *fail*) exit 1 ;; esac',
    '    if [ -n "$STUB_CHOICE_EXIT" ]; then exit "$STUB_CHOICE_EXIT"; fi',
    '    if [ "$STUB_PICK" = "first" ]; then',
    "      key=$(printf '%s' \"$text\" | sed -n 's/.*first=\\([^ ]*\\).*/\\1/p')",
    '    else',
    "      key=$(printf '%s' \"$text\" | sed -n 's/.*pick=\\([^ ]*\\).*/\\1/p')",
    '    fi',
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

// Wall time is the one field no two runs can share.
function maskWallMs(text) {
  return text.replace(/"wall_ms":\d+/g, '"wall_ms":0');
}

function scrub(text, replacements) {
  let scrubbed = text;
  for (const [needle, token] of replacements) scrubbed = scrubbed.split(needle).join(token);
  return scrubbed;
}

function record(outFile) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  const outDir = path.join(dir, 'out');
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const result = spawnSync(process.execPath, [SCRIPT, '--score', file, '--jev', '--out', outDir], {
      encoding: 'utf8',
      env: { PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log }
    });
    const argvLog = fs.existsSync(stubs.log) ? fs.readFileSync(stubs.log, 'utf8') : '';
    const callsPath = path.join(outDir, 'calls.jsonl');
    const calls = fs.existsSync(callsPath) ? fs.readFileSync(callsPath, 'utf8') : '<absent>\n';
    const recording = [
      '== exit ' + result.status + ' ==',
      '== stdout ==',
      (result.stdout || '').trimEnd(),
      '== stderr ==',
      (result.stderr || '').trimEnd(),
      '== stub argv ==',
      argvLog.trimEnd(),
      '== calls.jsonl (wall_ms masked) ==',
      maskWallMs(calls).trimEnd(),
      ''
    ].join('\n');
    fs.writeFileSync(outFile, scrub(recording, [[outDir, '<OUT>'], [dir, '<ROWS_DIR>'], [stubs.dir, '<STUBS>']]));
    process.stdout.write(`recorded exit ${result.status}\n`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
}

const outFile = process.argv[2];
if (!outFile) {
  process.stderr.write('usage: record-score-clarify-default.cjs <output-file>\n');
  process.exitCode = 2;
} else {
  record(outFile);
}

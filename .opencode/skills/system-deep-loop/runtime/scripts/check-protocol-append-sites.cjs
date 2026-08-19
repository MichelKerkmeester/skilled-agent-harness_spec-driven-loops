#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Protocol Append-Site Conformance                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--dir).                                                ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=clean, 1=script error, 2=conformance violation.                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// A declared write mechanism that nothing checks is advisory only: a workflow can
// ignore it and no gate notices, so the declaration becomes decorative. This
// checker turns the declaration into something a run can actually fail on by
// scanning command YAML for append directives and verifying each one is backed by
// either an append-gateway protocol mechanism or an explicit migration exception.

const fs = require('fs');
const path = require('path');

function emit(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function fail(err) {
  emit({ error: String(err && err.message ? err.message : err) });
  process.exit(1);
}

// scripts -> runtime -> system-deep-loop -> skills -> .opencode -> repo
function defaultDir() {
  const scriptsDir = __dirname;
  const repoRoot = path.resolve(scriptsDir, '..', '..', '..', '..', '..');
  return path.join(repoRoot, '.opencode', 'commands', 'deep', 'assets');
}

function parseArgs(argv) {
  const out = { dir: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dir') {
      out.dir = argv[++i];
    } else if (a.startsWith('--dir=')) {
      out.dir = a.slice('--dir='.length);
    }
  }
  return out;
}

// Inspect a single YAML file's lines and return its findings.
function inspectFile(file, lines) {
  const findings = {
    appendDirectives: 0,
    hasProtocolBlock: false,
    mechanismAppendGateway: false,
    hasMigrationException: false,
    literalShellAppends: 0,
    literalJsAppends: 0,
  };

  let inProtocolBlock = false;
  let protocolBlockIndent = -1;

  for (let i = 0; i < lines.length; i++) {
    // Strip trailing newline only; preserve leading whitespace for column checks.
    const line = lines[i].replace(/\r?\n$/, '');

    // append directive at any indentation, in mapping or sequence-entry form.
    // A guard blind to the sequence form would pass a file that still appends.
    if (/^\s*(?:-\s+)?(append_to_jsonl|append_jsonl)\s*:/.test(line)) {
      findings.appendDirectives++;
    }

    // protocol block starts at column 0
    if (/^state_write_protocol\s*:/.test(line)) {
      findings.hasProtocolBlock = true;
      inProtocolBlock = true;
      protocolBlockIndent = 0;
      continue;
    }

    if (inProtocolBlock) {
      // A column-0 key ends the protocol block.
      const isColumn0Key = /^[^\s]/.test(line) && /\S/.test(line);
      if (isColumn0Key) {
        inProtocolBlock = false;
        protocolBlockIndent = -1;
      } else {
        // indented content within the block
        if (/^\s*mechanism\s*:\s*"?append-gateway"?\s*$/.test(line)) {
          findings.mechanismAppendGateway = true;
        }
        if (/^\s*migration_exception\s*:/.test(line)) {
          findings.hasMigrationException = true;
        }
      }
    }

    // A direct append is a direct append whether it is written as a shell
    // redirect or as an embedded filesystem call: recognising only one
    // spelling would let the other pass unnoticed. The shell form writes
    // straight to the state log via `>>`; the embedded-JS form calls
    // appendFileSync(...) on a state-log path. Both bypass the append
    // gateway, so both must trip the same direct-append rule.
    const gtIdx = line.indexOf('>>');
    if (gtIdx !== -1) {
      const after = line.slice(gtIdx + 2);
      if (after.includes('state_log')) {
        findings.literalShellAppends++;
      }
    }

    // Embedded JS append: a call (not a bare import/require) whose target,
    // possibly on a following line, names the state log. Requiring the call
    // shape /\bappendFileSync\s*\(/ excludes `import { appendFileSync }`.
    if (/\bappendFileSync\s*\(/.test(line)) {
      const joined = [line]
        .concat(lines.slice(i + 1, i + 4).map((l) => l.replace(/\r?\n$/, '')))
        .join('\n');
      if (/stateLog|state_log|state-log/.test(joined)) {
        findings.literalJsAppends++;
      }
    }
  }

  return findings;
}

function evaluate(file, f) {
  const violations = [];
  const info = [];

  // R1: append directive present but no append-gateway mechanism declared.
  if (f.appendDirectives >= 1 && (!f.hasProtocolBlock || !f.mechanismAppendGateway)) {
    const reason = !f.hasProtocolBlock
      ? 'append directive present but no state_write_protocol block declared'
      : 'append directive present but mechanism is not append-gateway';
    violations.push({
      file,
      rule: 'UNDECLARED_APPEND_MECHANISM',
      detail: reason,
    });
  }

  // R2: literal direct append into state_log without a migration exception.
  // Covers both the shell `>>` form and the embedded appendFileSync(...) form.
  const directAppends = f.literalShellAppends + f.literalJsAppends;
  if (directAppends >= 1 && !f.hasMigrationException) {
    violations.push({
      file,
      rule: 'UNDECLARED_DIRECT_APPEND',
      detail: 'literal direct append into state_log without a migration_exception',
    });
  }

  // R3: protocol block with zero append directives -> info only, never a violation.
  if (f.hasProtocolBlock && f.appendDirectives === 0 && directAppends === 0) {
    info.push({
      file,
      detail: 'state_write_protocol block declared but no append directives present',
    });
  }

  return { violations, info };
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const dir = args.dir ? path.resolve(args.dir) : defaultDir();

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      fail(e);
      return;
    }

    const yamlFiles = entries
      .filter((e) => e.isFile() && e.name.endsWith('.yaml'))
      .map((e) => e.name)
      .sort();

    const allViolations = [];
    const allInfo = [];
    let scanned = 0;

    for (const name of yamlFiles) {
      const full = path.join(dir, name);
      let content;
      try {
        content = fs.readFileSync(full, 'utf8');
      } catch (e) {
        fail(e);
        return;
      }
      scanned++;
      const lines = content.split('\n');
      const findings = inspectFile(name, lines);
      const { violations, info } = evaluate(name, findings);
      allViolations.push(...violations);
      allInfo.push(...info);
    }

    // Stable sort: by file then rule.
    allViolations.sort((a, b) => {
      if (a.file !== b.file) return a.file < b.file ? -1 : 1;
      if (a.rule !== b.rule) return a.rule < b.rule ? -1 : 1;
      return 0;
    });
    allInfo.sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));

    const ok = allViolations.length === 0;
    emit({
      ok,
      scanned,
      violations: allViolations,
      info: allInfo,
    });
    process.exit(ok ? 0 : 2);
  } catch (err) {
    fail(err);
  }
}

main();

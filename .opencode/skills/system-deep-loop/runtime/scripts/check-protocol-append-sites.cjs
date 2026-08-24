#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Append-Site Declaration Coverage                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--dir).                                                ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=clean, 1=script error, 2=conformance violation.                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// A declared write mechanism that nothing checks is advisory only: a workflow can
// ignore it and no gate notices, so the declaration becomes decorative. This
// checker turns the declaration into a declaration-coverage gate: it scans
// command YAML for append directives and direct filesystem appends and verifies
// each direct append is both declared (via migration_exception) and counted
// (via exempt_append_sites). A clean result means every direct append in these
// assets is declared and counted — NOT that the appends are correct or
// justified. Whether a declared exception deserves to exist is a human review
// decision, not something this checker can decide.

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
    exemptAppendSites: null,
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
        // exempt_append_sites is expected directly after migration_exception
        // and states how many direct-append sites the exception covers.
        const exm = line.match(/^\s*exempt_append_sites\s*:\s*(\d+)\s*$/);
        if (exm) {
          findings.exemptAppendSites = parseInt(exm[1], 10);
        }
      }
    }

    // A direct append is a direct append whether it is written as a shell
    // redirect or as an embedded filesystem call: recognising only one
    // spelling would let the other pass unnoticed. A workflow asset has no
    // business performing a raw filesystem append at all, so the target no
    // longer needs to be guessed — every appendFileSync(...) call is flagged
    // regardless of what it writes to, and every `>>` redirect whose target
    // is a {...} path placeholder or contains "log" is flagged. The call-shape
    // test /\bappendFileSync\s*\(/ still excludes a bare import/destructure
    // that never calls.
    const gtIdx = line.indexOf('>>');
    if (gtIdx !== -1) {
      const after = line.slice(gtIdx + 2);
      if (/\{[^}]*\}/.test(after) || /log/i.test(after)) {
        findings.literalShellAppends++;
      }
    }

    // Embedded JS append: flag every call regardless of target. Requiring the
    // call shape /\bappendFileSync\s*\(/ excludes `import { appendFileSync }`.
    if (/\bappendFileSync\s*\(/.test(line)) {
      findings.literalJsAppends++;
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

  // R2: direct appends must be both declared (migration_exception) and counted
  // (exempt_append_sites). A single exception used to cover every append in a
  // file, so a new site added later inherited an exception nobody reviewed it
  // against. Requiring an explicit count forces the author to re-declare on
  // every change. Covers both the shell `>>` form and the embedded
  // appendFileSync(...) form.
  const directAppends = f.literalShellAppends + f.literalJsAppends;
  const siteWord = directAppends === 1 ? 'site' : 'sites';
  if (directAppends >= 1) {
    if (!f.hasMigrationException) {
      violations.push({
        file,
        rule: 'UNDECLARED_DIRECT_APPEND',
        detail: `direct append without a migration_exception (${directAppends} ${siteWord} found)`,
      });
    } else if (f.exemptAppendSites === null) {
      violations.push({
        file,
        rule: 'UNCOUNTED_EXEMPTION',
        detail: `migration_exception present but exempt_append_sites missing (${directAppends} ${siteWord} found)`,
      });
    } else if (f.exemptAppendSites !== directAppends) {
      violations.push({
        file,
        rule: 'EXEMPTION_COUNT_MISMATCH',
        detail: `exempt_append_sites=${f.exemptAppendSites} but ${directAppends} ${siteWord} found`,
      });
    }
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

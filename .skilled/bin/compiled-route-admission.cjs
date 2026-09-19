#!/usr/bin/env node
'use strict';
// Checks whether a hub's compiled routing satisfies the routing gold its
// playbook authors, which is the bar a hub must clear to serve compiled
// traffic. It is read-only: it calls the compiled engine directly, bypassing
// the serving flag and the activation manifest, and writes nothing unless
// --out names a directory for the report.
//
// A hub in the default-on cohort is judged on drift and stale gold, and its
// coverage is reported. Any other registered hub is a candidate and must also
// meet the coverage floors: a scored scenario for every declared workflow mode
// and at least one negative or defer scenario.
//
// Usage:
//   compiled-route-admission.cjs --all                 every hub the engine registers
//   compiled-route-admission.cjs --hub <id> [--hub …]  named hubs
//   compiled-route-admission.cjs … --json              full report on stdout
//   compiled-route-admission.cjs … --out <dir>         also write admission-report.json and .md
//   compiled-route-admission.cjs … --warn-only         report, but always exit 0
//
// Exit codes: 0 every hub passes (or --warn-only), 1 a hub fails, 2 usage error.

const fs = require('fs');
const path = require('path');

const admission = require('./lib/compiled-route-admission.cjs');
const { compiledRoute, HUB_CHILD } = require('./lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs');
const { DEFAULT_ON_HUBS } = require('./lib/compiled-routing/014-runtime-engine/lib/resolve.cjs');

function parseArgs(argv) {
  const args = { hubs: [], all: false, json: false, out: null, warnOnly: false, error: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--all') args.all = true;
    else if (arg === '--json') args.json = true;
    else if (arg === '--warn-only') args.warnOnly = true;
    else if (arg === '--hub' || arg === '--out') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        args.error = `${arg} needs a value`;
        break;
      }
      if (arg === '--hub') args.hubs.push(value);
      else args.out = value;
      i += 1;
    } else {
      args.error = `unknown argument: ${arg}`;
      break;
    }
  }
  if (!args.error && !args.all && args.hubs.length === 0) args.error = 'name a hub with --hub or pass --all';
  if (!args.error && args.all && args.hubs.length > 0) args.error = '--all and --hub are exclusive';
  return args;
}

function unregisteredHub(hubId) {
  return {
    hubId,
    admitted: false,
    verdict: 'broken',
    counts: { pass: 0, drift: 0, 'stale-gold': 0, invalid: 0, broken: 0, 'n/a': 0 },
    fitted: { total: 0, judged: 0, pass: 0 },
    holdout: { total: 0, judged: 0, pass: 0 },
    negative: { total: 0, judged: 0, pass: 0 },
    coverage: { modes: [], uncovered: [], negatives: 0, enforced: true, short: true },
    scenarios: [],
    detail: `hub "${hubId}" has no compiled engine registered in HUB_CHILD`,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.error) {
    process.stderr.write(`compiled-route-admission: ${args.error}\n`);
    return 2;
  }

  const hubIds = args.all ? Object.keys(HUB_CHILD).sort() : [...new Set(args.hubs)].sort();
  const hubReports = hubIds.map((hubId) => (Object.prototype.hasOwnProperty.call(HUB_CHILD, hubId)
    ? admission.evaluateHub({ hubId, route: compiledRoute, admitted: DEFAULT_ON_HUBS.has(hubId) })
    : unregisteredHub(hubId)));
  const report = admission.buildReport(hubReports);

  if (args.out) {
    fs.mkdirSync(args.out, { recursive: true });
    fs.writeFileSync(path.join(args.out, 'admission-report.json'), `${JSON.stringify(report, null, 2)}\n`);
    fs.writeFileSync(path.join(args.out, 'admission-report.md'), admission.renderMarkdown(report));
  }

  if (args.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    for (const hub of report.hubs) {
      const gaps = hub.coverage.uncovered.length > 0 ? `; ${hub.coverage.uncovered.length} mode(s) without gold` : '';
      process.stdout.write(`  ${hub.hubId.padEnd(28)}${hub.verdict.padEnd(24)}`
        + `${hub.counts.pass} pass, ${hub.counts.drift} drift, ${hub.counts['stale-gold']} stale, ${hub.counts['n/a']} n/a${gaps}\n`);
      if (hub.detail) process.stdout.write(`    ${hub.detail}\n`);
    }
    process.stdout.write(report.ok
      ? '\nEvery hub passes the admission check.\n'
      : `\n${report.hubs.filter((hub) => hub.verdict !== 'pass').length} hub(s) fail the admission check.\n`);
  }

  if (report.ok || args.warnOnly) return 0;
  return 1;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = { parseArgs, main };

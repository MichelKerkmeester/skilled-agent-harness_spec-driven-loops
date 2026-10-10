'use strict';
// Prints what the live findings parser reads from one iteration narrative.
const fs = require('node:fs');
const path = require('node:path');
const { parseIterationMarkdownFindings } = require(path.resolve('.skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs'));
const findings = parseIterationMarkdownFindings(fs.readFileSync(process.argv[2], 'utf8'), 1, process.argv[2]);
console.log(`count=${findings.length} titles=${findings.map((finding) => finding.title).join('|')}`);

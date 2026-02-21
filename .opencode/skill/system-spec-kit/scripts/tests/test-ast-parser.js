#!/usr/bin/env node
'use strict';

const path = require('path');

let passed = 0;
let failed = 0;

function pass(message) {
  passed += 1;
  console.log(`PASS: ${message}`);
}

function fail(message) {
  failed += 1;
  console.log(`FAIL: ${message}`);
}

function assertTrue(condition, message) {
  if (condition) {
    pass(message);
  } else {
    fail(message);
  }
}

function main() {
  const parserPath = path.join(__dirname, '..', 'dist', 'memory', 'ast-parser.js');
  const parser = require(parserPath);

  assertTrue(typeof parser.parseMarkdownSections === 'function', 'exports parseMarkdownSections');
  assertTrue(typeof parser.chunkMarkdown === 'function', 're-exports chunkMarkdown');
  assertTrue(typeof parser.splitIntoBlocks === 'function', 're-exports splitIntoBlocks');

  const markdown = [
    '# Top Heading',
    '',
    'Regular paragraph content.',
    '',
    '## Sub Heading',
    '',
    '```ts',
    'const x = 1;',
    '```',
    '',
    '| Col | Value |',
    '| --- | ----- |',
    '| A   | 1     |',
  ].join('\n');

  const sections = parser.parseMarkdownSections(markdown);
  assertTrue(Array.isArray(sections), 'returns section array');
  assertTrue(sections.length >= 4, 'returns multiple structured sections');
  assertTrue(sections.some((section) => section.type === 'heading'), 'captures heading section');
  assertTrue(sections.some((section) => section.type === 'code'), 'captures code section');
  assertTrue(sections.some((section) => section.type === 'table'), 'captures table section');
  assertTrue(
    sections.some((section) => section.type === 'heading' && section.title === 'Top Heading'),
    'extracts heading titles',
  );

  console.log(`\nResult: passed=${passed} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();

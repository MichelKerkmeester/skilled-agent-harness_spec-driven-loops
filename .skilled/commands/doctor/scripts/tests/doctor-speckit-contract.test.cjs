#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Speckit Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND TEXT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const ASSET_ROOT = path.resolve(__dirname, '../../assets');
const WORKFLOW = fs.readFileSync(path.join(ASSET_ROOT, 'doctor-speckit-retrieval.yaml'), 'utf8');
const PRESENTATION = fs.readFileSync(path.join(ASSET_ROOT, 'doctor-speckit-presentation.txt'), 'utf8');

function topLevelBlock(source, key) {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line === key + ':');
  if (start < 0) return '';
  const end = lines.findIndex((line, index) => index > start && /^[\w-]+:/.test(line));
  return lines.slice(start, end < 0 ? lines.length : end).join('\n');
}

function statusValues(line) {
  return line.split(':').slice(1).join(':').split('|').map((value) => value.trim().replace(/^STATUS_/, ''));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PHRASE QUALITY IS ADVISORY
// ─────────────────────────────────────────────────────────────────────────────

test('phrase quality is reported as an advisory, never as a staleness signal', () => {
  assert.doesNotMatch(topLevelBlock(WORKFLOW, 'staleness_signals'), /phraseQuality|corpus_pollution/);
  assert.doesNotMatch(WORKFLOW, /corpus_pollution/);
  const advisories = topLevelBlock(WORKFLOW, 'quality_advisories');
  assert.match(advisories, /phraseQuality/);
  assert.match(advisories, /staleness_classes and severity_max/);
  assert.match(WORKFLOW, /- quality_advisories: \[/);
  assert.match(PRESENTATION, /^Advisories: /m);
});

test('a fresh index with phrase-quality advisories can still report OK', () => {
  assert.match(WORKFLOW, /Quality advisories never change the status or the recommended command/);
  assert.match(WORKFLOW, /STALE when index_content_stale or committed_pair_mismatch fired/);
  assert.doesNotMatch(WORKFLOW, /recommend[^\n]*corpus fix first/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. STATUS VOCABULARY
// ─────────────────────────────────────────────────────────────────────────────

test('every workflow status is one the presentation can render', () => {
  const rendered = statusValues(PRESENTATION.match(/^Status: \[(.+)\]$/m)[0].replace(/[[\]]/g, ''));
  const workflowLines = WORKFLOW.match(/^\s+(?:- )?status: [A-Z_ |]+$/gm);
  assert.ok(workflowLines.length >= 3);
  for (const line of workflowLines) {
    for (const value of statusValues(line)) {
      assert.ok(rendered.includes(value), value + ' is not rendered by the presentation');
    }
  }
  assert.doesNotMatch(WORKFLOW, /DEGRADED/);
});

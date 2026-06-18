#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_STALE_AFTER_DAYS = 180;

function usage() {
  console.log('Usage: constitutional-rule-staleness.cjs [--stale-after-days N]');
}

function parse_args(argv) {
  const args = { staleAfterDays: DEFAULT_STALE_AFTER_DAYS };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg !== '--stale-after-days') {
      throw new Error(`Unknown argument: ${arg}`);
    }
    const value = argv[i + 1];
    if (!value || !/^\d+$/.test(value)) {
      throw new Error('--stale-after-days requires a positive integer');
    }
    args.staleAfterDays = Number(value);
    i += 1;
  }
  if (args.staleAfterDays < 1) {
    throw new Error('--stale-after-days must be greater than zero');
  }
  return args;
}

function parse_frontmatter(content, file) {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== '---') {
    throw new Error(`${file} is missing frontmatter`);
  }
  const end = lines.indexOf('---', 1);
  if (end === -1) {
    throw new Error(`${file} has unterminated frontmatter`);
  }
  const meta = {};
  for (const line of lines.slice(1, end)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!match) continue;
    meta[match[1]] = match[2].replace(/^['"]|['"]$/g, '').trim();
  }
  return meta;
}

function parse_iso_date(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function add_days(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY).toISOString().slice(0, 10);
}

function age_days(date, today) {
  return Math.floor((today.getTime() - date.getTime()) / MS_PER_DAY);
}

function pad(value, width) {
  return String(value).padEnd(width, ' ');
}

function main() {
  const args = parse_args(process.argv.slice(2));
  const root = path.resolve(__dirname, '../../../..');
  const rulesDir = path.resolve(__dirname, '../constitutional');
  const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');

  const rows = fs.readdirSync(rulesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md')
    .map((entry) => {
      const absolute = path.join(rulesDir, entry.name);
      const relative = path.relative(root, absolute);
      const meta = parse_frontmatter(fs.readFileSync(absolute, 'utf8'), relative);
      if (meta.importanceTier !== 'constitutional') return null;
      const confirmed = parse_iso_date(meta.last_confirmed);
      const age = confirmed ? age_days(confirmed, today) : Number.POSITIVE_INFINITY;
      const reviewBy = confirmed ? add_days(confirmed, args.staleAfterDays) : 'MISSING';
      return {
        file: relative,
        title: meta.title || entry.name,
        lastConfirmed: meta.last_confirmed || 'MISSING',
        source: meta.last_confirmed_source || 'MISSING',
        age,
        reviewBy,
        status: confirmed && age <= args.staleAfterDays ? 'fresh' : 'stale',
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b.age - a.age) || a.file.localeCompare(b.file));

  console.log(`Constitutional rule staleness as of ${today.toISOString().slice(0, 10)}`);
  console.log(`Cadence: review rules older than ${args.staleAfterDays} days`);
  console.log(`Rules: ${rows.length}`);
  console.log('');
  console.log(`${pad('age_days', 9)} ${pad('last_confirmed', 16)} ${pad('review_by', 10)} ${pad('status', 6)} ${pad('source', 19)} file`);
  console.log(`${pad('--------', 9)} ${pad('--------------', 16)} ${pad('---------', 10)} ${pad('------', 6)} ${pad('------', 19)} ----`);
  for (const row of rows) {
    console.log(`${pad(row.age, 9)} ${pad(row.lastConfirmed, 16)} ${pad(row.reviewBy, 10)} ${pad(row.status, 6)} ${pad(row.source, 19)} ${row.file}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}

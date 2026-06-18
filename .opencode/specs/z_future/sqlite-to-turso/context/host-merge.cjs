#!/usr/bin/env node
'use strict';
// Host-side per-iteration helper for the deep-context sweep in this packet.
// Stage 1 (extract): pull each seat's findings JSON out of the opencode
//   --format json NDJSON envelope and write the pure seat file.
// Stage 2 (merge): dedup across seats by path|symbol|kind, union producedBy,
//   apply the relevance gate, diff against the prior registry, and emit the
//   metrics the host needs for the canonical iteration record.
// Seats stay read-only; the reducer (reduce-state.cjs) remains the registry writer.

const fs = require('fs');
const path = require('path');

function extractText(stdout) {
  const parts = [];
  for (const line of String(stdout).split('\n')) {
    const t = line.trim();
    if (!t.startsWith('{')) continue;
    try {
      const p = JSON.parse(t);
      if (p && p.type === 'text' && p.part && typeof p.part.text === 'string') parts.push(p.part.text);
    } catch { /* skip non-JSON */ }
  }
  return parts.length ? parts.join('') : String(stdout);
}

function parseFindings(text) {
  // findings JSON may be fenced or surrounded by stray prose; take the outermost object
  const cleaned = text.replace(/```json/gi, '```');
  const candidates = [];
  const fenceRe = /```\s*([\s\S]*?)```/g;
  let m;
  while ((m = fenceRe.exec(cleaned)) !== null) candidates.push(m[1]);
  candidates.push(cleaned);
  for (const c of candidates) {
    const start = c.indexOf('{');
    const end = c.lastIndexOf('}');
    if (start === -1 || end <= start) continue;
    try {
      const obj = JSON.parse(c.slice(start, end + 1));
      if (obj && Array.isArray(obj.findings)) return obj;
    } catch { /* try next candidate */ }
  }
  return null;
}

function unitKey(f) {
  const norm = (s) => String(s || '').trim().toLowerCase();
  return `${norm(f.path)}|${norm(f.symbol)}|${norm(f.kind) || 'reuse_candidate'}`;
}

function main() {
  const [, , contextDir, iterTag, sliceFilesCsv] = process.argv;
  if (!contextDir || !iterTag) {
    console.error('usage: host-merge.cjs <contextDir> <iter-NNN> [sliceFilesCsv]');
    process.exit(2);
  }
  const seatDir = path.join(contextDir, 'seats', iterTag);
  const sliceFiles = (sliceFilesCsv || '').split(',').map((s) => s.trim()).filter(Boolean);

  const seatsSucceeded = [];
  const seatsFailed = [];
  for (const name of fs.readdirSync(seatDir)) {
    if (!name.endsWith('.raw.json')) continue;
    const label = name.replace(/\.raw\.json$/, '');
    const raw = fs.readFileSync(path.join(seatDir, name), 'utf8');
    const obj = parseFindings(extractText(raw));
    if (obj && obj.findings.length) {
      fs.writeFileSync(path.join(seatDir, `${label}.json`), JSON.stringify(obj, null, 2));
      seatsSucceeded.push(label);
    } else {
      seatsFailed.push(label);
    }
  }

  // merge across pure seat files
  const units = new Map();
  for (const label of seatsSucceeded) {
    const obj = JSON.parse(fs.readFileSync(path.join(seatDir, `${label}.json`), 'utf8'));
    for (const f of obj.findings) {
      if (!f || (!f.path && !f.symbol)) continue;
      const key = unitKey(f);
      if (!units.has(key)) units.set(key, { ...f, producedBy: [], maxRelevance: 0 });
      const u = units.get(key);
      if (!u.producedBy.includes(label)) u.producedBy.push(label);
      u.maxRelevance = Math.max(u.maxRelevance, Number(f.relevance) || 0);
    }
  }

  const RELEVANCE_GATE = 0.55;
  const AGREEMENT_MIN = 2;
  const kept = [];
  const marginal = [];
  for (const u of units.values()) {
    if (u.maxRelevance >= RELEVANCE_GATE) kept.push(u);
    else if (u.maxRelevance >= 0.40) marginal.push(u);
  }

  // prior agreement-eligible keys from registry (across all categories)
  let priorKeys = new Set();
  const regPath = path.join(contextDir, 'findings-registry.json');
  if (fs.existsSync(regPath)) {
    try {
      const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
      for (const cat of ['reuseCandidates', 'integrationPoints', 'conventions', 'dependencies', 'gaps']) {
        for (const u of reg[cat] || []) priorKeys.add(unitKey(u));
      }
    } catch { /* fresh registry */ }
  }

  const agreementEligibleUnits = kept.filter((u) => u.producedBy.length >= AGREEMENT_MIN);
  const newAgreementEligible = agreementEligibleUnits.filter((u) => !priorKeys.has(unitKey(u))).length;
  const coveredSlice = new Set(kept.map((u) => String(u.path || '').trim()).filter(Boolean));
  const sliceCoverage = sliceFiles.length
    ? sliceFiles.filter((f) => coveredSlice.has(f)).length / sliceFiles.length
    : 0;
  const reuseFiles = new Set(kept.filter((u) => (u.kind || 'reuse_candidate') === 'reuse_candidate').map((u) => u.path));
  const reuseCatalogCoverage = sliceFiles.length
    ? sliceFiles.filter((f) => reuseFiles.has(f)).length / sliceFiles.length
    : 0;
  const relevances = kept.map((u) => u.maxRelevance);
  const result = {
    seatsSucceeded,
    seatsFailed,
    mergedFindingsCount: kept.length,
    marginalCount: marginal.length,
    newAgreementEligible,
    agreementEligibleThisIter: agreementEligibleUnits.length,
    agreementRate: kept.length ? agreementEligibleUnits.length / kept.length : 0,
    relevanceFloor: relevances.length ? Math.min(...relevances) : 0,
    sliceCoverage: Number(sliceCoverage.toFixed(3)),
    reuseCatalogCoverage: Number(reuseCatalogCoverage.toFixed(3)),
    keptUnits: kept.map((u) => ({
      path: u.path, symbol: u.symbol, kind: u.kind || 'reuse_candidate',
      agreement: u.producedBy.length, producedBy: u.producedBy, relevance: u.maxRelevance,
      notes: u.notes || '',
    })),
  };
  console.log(JSON.stringify(result, null, 2));
}

main();

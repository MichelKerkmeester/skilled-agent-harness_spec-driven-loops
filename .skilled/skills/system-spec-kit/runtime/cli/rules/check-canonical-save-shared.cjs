// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Canonical-save rules: shared context                                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Every canonical-save rule reads the same packet surfaces: description.json,
// graph-metadata.json, the root spec and the child packet directories. Building
// them once here lets each rule script stay the size of its own decision.

'use strict';

const fs = require('fs');
const path = require('path');
const { parseFrontmatter } = require('@spec-kit/shared/frontmatter/parse-frontmatter.js');

const CANONICAL_SAVE_CUTOFF =
  process.env.SPECKIT_CANONICAL_SAVE_CUTOFF || '2026-05-01T00:00:00Z';
const CANONICAL_SAVE_FRESHNESS_SLACK_MS = Number(
  process.env.SPECKIT_CANONICAL_SAVE_FRESHNESS_SLACK_MS || `${10 * 60 * 1000}`,
);

function emit(ruleId, status, message, details = [], remediation = '') {
  console.log(`rule\t${ruleId}`);
  console.log(`status\t${status}`);
  console.log(`message\t${message}`);
  for (const detail of details) {
    console.log(`detail\t${detail}`);
  }
  if (remediation) {
    console.log(`detail\tRemediation: ${remediation}`);
  }
}

function normalizePacketId(rawValue) {
  if (typeof rawValue !== 'string') return null;
  let normalized = rawValue.trim();
  if (!normalized) return null;
  normalized = normalized
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
  const specsMarker = '/.opencode/specs/';
  const plainSpecsMarker = '/specs/';
  if (normalized.includes(specsMarker)) {
    normalized = normalized.split(specsMarker)[1] || normalized;
  } else if (normalized.includes(plainSpecsMarker)) {
    normalized = normalized.split(plainSpecsMarker)[1] || normalized;
  }
  normalized = normalized.replace(/^\.opencode\/specs\//, '').replace(/^specs\//, '');
  return normalized;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function derivePacketIdFromPath(folderPath) {
  const normalizedPath = folderPath.replace(/\\/g, '/');
  const markers = ['/.opencode/specs/', '/specs/'];
  for (const marker of markers) {
    const index = normalizedPath.indexOf(marker);
    if (index >= 0) {
      return normalizePacketId(normalizedPath.slice(index + marker.length));
    }
  }
  return normalizePacketId(path.basename(folderPath));
}

function readContinuityPacketPointer(folderPath) {
  const candidates = [
    'implementation-summary.md',
    'handover.md',
    'spec.md',
    'plan.md',
    'tasks.md',
    'decision-record.md',
  ];
  for (const candidate of candidates) {
    const filePath = path.join(folderPath, candidate);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    // The pointer value stays line-read verbatim; only the fence split comes
    // from the shared parser.
    const raw = parseFrontmatter(content).raw;
    if (raw === null) continue;
    const block = raw.slice(raw.indexOf('\n') + 1, raw.lastIndexOf('\n')).replace(/\r$/, '');
    const pointerMatch = block.match(
      /^[ \t]*packet_pointer:\s*(?:"([^"\n]+)"|'([^'\n]+)'|([^\n#]+))/m,
    );
    const pointer = pointerMatch?.[1] || pointerMatch?.[2] || pointerMatch?.[3];
    if (pointer) {
      return normalizePacketId(pointer);
    }
  }
  return null;
}

/** Reads the packet surfaces one folder exposes and derives its identity. */
function buildPacketContext(folder) {
  const descriptionPath = path.join(folder, 'description.json');
  const graphPath = path.join(folder, 'graph-metadata.json');
  const specPath = path.join(folder, 'spec.md');
  const description = readJson(descriptionPath);
  const graph = readJson(graphPath);
  const packetId =
  normalizePacketId(description?.specFolder)
  || normalizePacketId(graph?.spec_folder)
  || derivePacketIdFromPath(folder);
  const hasMetadataSurface = fs.existsSync(descriptionPath) || fs.existsSync(graphPath);
  const childPacketDirs = fs.existsSync(folder)
    ? fs.readdirSync(folder, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^\d{3}-/.test(entry.name))
      .map((entry) => entry.name)
  : [];
  const isLivePacketRoot = childPacketDirs.length > 0 && hasMetadataSurface;
  return { folder, descriptionPath, graphPath, specPath, description, graph, packetId, hasMetadataSurface, childPacketDirs, isLivePacketRoot };
}

/** Runs one rule over the folder named on argv and emits the bridge protocol. */
function runRule(ruleId, decide) {
  const [folder] = process.argv.slice(2);
  const context = buildPacketContext(folder);
  decide(context, (status, message, details = [], remediation = '') => emit(ruleId, status, message, details, remediation));
}

module.exports = { CANONICAL_SAVE_CUTOFF, CANONICAL_SAVE_FRESHNESS_SLACK_MS, normalizePacketId, readJson, derivePacketIdFromPath, readContinuityPacketPointer, buildPacketContext, runRule };

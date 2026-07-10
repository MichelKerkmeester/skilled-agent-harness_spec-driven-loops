'use strict';

const fs = require('fs');
const path = require('path');

const folder = process.argv[2];

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
  return normalized.replace(/^\.opencode\/specs\//, '').replace(/^specs\//, '');
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return { value: null, parseError: null };
  try {
    return { value: JSON.parse(fs.readFileSync(filePath, 'utf8')), parseError: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { value: null, parseError: `${path.basename(filePath)}: ${message}` };
  }
}

function derivePacketIdFromPath(folderPath) {
  const realPath = fs.realpathSync(folderPath).replace(/\\/g, '/');
  for (const marker of ['/.opencode/specs/', '/specs/']) {
    const index = realPath.indexOf(marker);
    if (index >= 0) return normalizePacketId(realPath.slice(index + marker.length));
  }
  return null;
}

function readContinuityPacketPointer(folderPath) {
  const candidates = [
    'implementation-summary.md',
    'handover.md',
    'spec.md',
    'plan.md',
    'tasks.md',
    'checklist.md',
    'decision-record.md',
  ];
  for (const candidate of candidates) {
    const filePath = path.join(folderPath, candidate);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) continue;
    const pointerMatch = frontmatterMatch[1].match(/^[ \t]*packet_pointer:\s*(?:"([^"\n]+)"|'([^'\n]+)'|([^\n#]+))/m);
    const pointer = pointerMatch?.[1] || pointerMatch?.[2] || pointerMatch?.[3];
    const normalized = normalizePacketId(pointer);
    if (normalized) return normalized;
  }
  return null;
}

function checkField(mismatches, label, actual, expected) {
  const normalized = normalizePacketId(actual);
  if (!normalized) return;
  if (normalized !== expected) {
    mismatches.push(`${label}=${normalized} expected=${expected}`);
  }
}

try {
  const actualPacketId = derivePacketIdFromPath(folder);
  if (!actualPacketId) {
    process.stdout.write(JSON.stringify({ actualPacketId: null, expectedParent: null, mismatches: [] }));
    process.exit(0);
  }
  const expectedParent = actualPacketId.includes('/') ? actualPacketId.split('/').slice(0, -1).join('/') : null;
  const descriptionResult = readJson(path.join(folder, 'description.json'));
  const graphResult = readJson(path.join(folder, 'graph-metadata.json'));
  const description = descriptionResult.value;
  const graph = graphResult.value;
  const parseErrors = [descriptionResult.parseError, graphResult.parseError].filter(Boolean);
  const mismatches = [];

  checkField(mismatches, 'description.specFolder', description?.specFolder, actualPacketId);
  checkField(mismatches, 'graph-metadata.spec_folder', graph?.spec_folder, actualPacketId);
  checkField(mismatches, 'graph-metadata.packet_id', graph?.packet_id, actualPacketId);
  checkField(mismatches, 'continuity.packet_pointer', readContinuityPacketPointer(folder), actualPacketId);

  const graphParent = normalizePacketId(graph?.parent_id);
  if (graphParent && expectedParent && graphParent !== expectedParent) {
    mismatches.push(`graph-metadata.parent_id=${graphParent} expected=${expectedParent}`);
  } else if (graphParent && !expectedParent) {
    mismatches.push(`graph-metadata.parent_id=${graphParent} expected=<none>`);
  }

  process.stdout.write(JSON.stringify({ actualPacketId, expectedParent, mismatches, parseErrors }));
} catch (error) {
  process.stdout.write(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
  process.exit(1);
}

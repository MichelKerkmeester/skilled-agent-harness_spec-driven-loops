'use strict';

const crypto = require('node:crypto');

const LANE_ID_VERSION = 'alignment-lane-v1';
const ARTIFACT_ID_VERSION = 'alignment-artifact-v1';

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeLaneId(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value : '';
}

function normalizeScope(scope) {
  if (!isRecord(scope)) return { type: 'unknown' };
  if (scope.type === 'paths' || scope.type === 'globs') {
    return {
      type: scope.type,
      values: Array.isArray(scope.values)
        ? scope.values.map((value) => (typeof value === 'string' ? value : String(value)))
        : [],
    };
  }
  if (scope.type === 'branchRange') {
    return {
      type: 'branchRange',
      from: typeof scope.from === 'string' ? scope.from : String(scope.from ?? ''),
      to: typeof scope.to === 'string' ? scope.to : String(scope.to ?? ''),
    };
  }
  return { type: typeof scope.type === 'string' ? scope.type : 'unknown' };
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]),
  );
}

function canonicalLaneObject(lane) {
  const authority = normalizeLaneId(lane && lane.authority) || 'unknown-authority';
  return canonicalize({
    adapter: normalizeLaneId(lane && lane.adapter) || authority,
    authority,
    artifactClass: normalizeLaneId(lane && lane.artifactClass) || 'unknown-class',
    scope: normalizeScope(lane && lane.scope),
  });
}

function canonicalLaneBytes(lane) {
  return JSON.stringify(canonicalLaneObject(lane));
}

function digestBytes(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function laneKey(lane) {
  return `${LANE_ID_VERSION}:${digestBytes(canonicalLaneBytes(lane))}`;
}

function artifactIdentityObject(artifact) {
  if (typeof artifact === 'string' && artifact.length > 0) {
    return { kind: 'path', value: artifact };
  }
  if (!isRecord(artifact)) return null;
  if (typeof artifact.path === 'string' && artifact.path.length > 0) {
    return { kind: 'path', value: artifact.path };
  }
  if (typeof artifact.ref === 'string' && artifact.ref.length > 0) {
    return { kind: 'ref', value: artifact.ref };
  }
  if (typeof artifact.target === 'string' && artifact.target.length > 0) {
    return {
      kind: 'target',
      targetType: typeof artifact.targetType === 'string' ? artifact.targetType : '',
      value: artifact.target,
    };
  }
  return null;
}

function artifactIdentity(artifact) {
  if (typeof artifact === 'string' && artifact.startsWith(`${ARTIFACT_ID_VERSION}:`)) {
    return artifact;
  }
  const identity = artifactIdentityObject(artifact);
  if (!identity) return null;
  return `${ARTIFACT_ID_VERSION}:${JSON.stringify(identity)}`;
}

function artifactIdentityCandidates(value) {
  const direct = artifactIdentity(value);
  if (direct) return [direct];
  if (typeof value !== 'string' || value.length === 0) return [];
  return [artifactIdentity(value)].filter(Boolean);
}

function normalizeEvidenceKind(value) {
  if (value === 'finding' || value === 'finding-evidence') return 'finding';
  if (value === 'content-digest' || value === 'contentDigest' || value === 'digest') return 'content-digest';
  if (value === 'adapter-check' || value === 'adapterCheck' || value === 'check-receipt') return 'adapter-check';
  return null;
}

function hasMeasuredReceipt(receipt) {
  return isRecord(receipt)
    && receipt.measured === true
    && typeof receipt.adapter === 'string'
    && isRecord(receipt.measurements)
    && Object.keys(receipt.measurements).length > 0;
}

function normalizeArtifactEvidence(entry) {
  if (!isRecord(entry)) return null;
  const nested = isRecord(entry.evidence) ? entry.evidence : {};
  const candidate = { ...nested, ...entry };
  const artifact = candidate.artifact ?? candidate.artifactIdentity ?? candidate.artifactPath ?? candidate.path ?? candidate.target;
  const identity = artifactIdentity(artifact);
  const kind = normalizeEvidenceKind(candidate.kind ?? candidate.evidenceType ?? candidate.type);
  if (!identity || !kind) return null;

  if (kind === 'finding') {
    const finding = candidate.finding;
    if (!isRecord(finding) && typeof candidate.findingId !== 'string' && typeof candidate.source !== 'string') return null;
    return { identity, kind, artifact, finding: isRecord(finding) ? finding : null };
  }

  if (kind === 'content-digest') {
    const digest = candidate.contentDigest ?? candidate.digest;
    if (typeof digest !== 'string' || !/^(?:sha256:)?[0-9a-f]{64}$/i.test(digest)) return null;
    return { identity, kind, artifact, contentDigest: digest };
  }

  const receipt = candidate.checkReceipt ?? candidate.receipt;
  if (!hasMeasuredReceipt(receipt)) return null;
  return { identity, kind, artifact, checkReceipt: receipt };
}

module.exports = {
  ARTIFACT_ID_VERSION,
  LANE_ID_VERSION,
  artifactIdentity,
  artifactIdentityCandidates,
  artifactIdentityObject,
  canonicalLaneBytes,
  canonicalLaneObject,
  canonicalize,
  laneKey,
  normalizeArtifactEvidence,
  normalizeLaneId,
  normalizeScope,
};

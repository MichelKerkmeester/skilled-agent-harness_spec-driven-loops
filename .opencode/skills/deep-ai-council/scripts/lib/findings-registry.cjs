// MODULE: Deep AI Council Findings Registry
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const SCHEMA_VERSION = '1.0';
const REGISTRY_FILE_NAME = 'deep-ai-council-findings-registry.json';
const DEFAULT_PRIOR_LIMIT = 5;
const LOCK_RETRY_MS = 10;
const LOCK_TIMEOUT_MS = 2_000;

class FindingsRegistryLockError extends Error {
  constructor(lockPath) {
    super(`Deep AI Council findings registry lock is already held: ${lockPath}`);
    this.name = 'FindingsRegistryLockError';
    this.code = 'FINDINGS_REGISTRY_LOCK_HELD';
    this.lockPath = lockPath;
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function slugify(value, fallback = 'finding') {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || fallback;
}

function normalizeClaim(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
}

function registryPath(packetPath) {
  if (typeof packetPath !== 'string' || packetPath.trim() === '') {
    throw new TypeError('packet_path must be a non-empty string');
  }
  return path.join(path.resolve(packetPath), 'ai-council', REGISTRY_FILE_NAME);
}

function lockPathFor(filePath) {
  return `${filePath}.lock`;
}

function makeEmptyRegistry(sessionId = null) {
  return {
    schema_version: SCHEMA_VERSION,
    registry_name: 'deep-ai-council-findings-registry',
    session_id: sessionId,
    findings: [],
    priors_by_topic: {},
    updated_at: null,
  };
}

function normalizeRegistryDocument(value) {
  if (Array.isArray(value)) {
    return {
      ...makeEmptyRegistry(),
      findings: value,
    };
  }
  if (!isRecord(value)) return makeEmptyRegistry();
  return {
    ...makeEmptyRegistry(value.session_id || value.sessionId || null),
    ...value,
    schema_version: value.schema_version || SCHEMA_VERSION,
    registry_name: value.registry_name || 'deep-ai-council-findings-registry',
    findings: Array.isArray(value.findings) ? value.findings : [],
    priors_by_topic: isRecord(value.priors_by_topic) ? value.priors_by_topic : {},
  };
}

function readRegistryDocument(filePath) {
  if (!fs.existsSync(filePath)) return makeEmptyRegistry();
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return makeEmptyRegistry();
  return normalizeRegistryDocument(JSON.parse(raw));
}

function fsyncDirectory(dirPath) {
  let fd;
  try {
    fd = fs.openSync(dirPath, 'r');
    fs.fsyncSync(fd);
  } catch {
    // Directory fsync is not available on every filesystem. Rename still gives
    // same-volume atomic visibility for readers.
  } finally {
    if (typeof fd === 'number') fs.closeSync(fd);
  }
}

function writeRegistryDocumentAtomic(filePath, document) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    const fd = fs.openSync(tempPath, 'wx');
    try {
      fs.writeFileSync(fd, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    fs.renameSync(tempPath, filePath);
    fsyncDirectory(path.dirname(filePath));
  } finally {
    fs.rmSync(tempPath, { force: true });
  }
}

function acquireLock(lockPath, metadata = {}, options = {}) {
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : LOCK_TIMEOUT_MS;
  const started = Date.now();

  while (true) {
    let fd;
    try {
      fd = fs.openSync(lockPath, 'wx');
      const payload = {
        owner_pid: process.pid,
        acquired_at_iso: new Date().toISOString(),
        ...metadata,
      };
      fs.writeFileSync(fd, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
      fs.fsyncSync(fd);
      return;
    } catch (error) {
      if (!error || error.code !== 'EEXIST') throw error;
      if (Date.now() - started >= timeoutMs) {
        throw new FindingsRegistryLockError(lockPath);
      }
      sleepSync(LOCK_RETRY_MS);
    } finally {
      if (typeof fd === 'number') fs.closeSync(fd);
    }
  }
}

function releaseLock(lockPath) {
  fs.rmSync(lockPath, { force: true });
}

function deriveTopicSlug(finding) {
  if (typeof finding.topic_slug === 'string' && finding.topic_slug.trim()) {
    return slugify(finding.topic_slug, 'topic');
  }
  const topicId = String(finding.topic_id || finding.topicId || 'session');
  return slugify(topicId.replace(/^topic-\d+-/, ''), 'topic');
}

function deriveClaim(finding) {
  const verdict = isRecord(finding.final_verdict) ? finding.final_verdict : finding.verdict;
  if (typeof finding.claim === 'string' && finding.claim.trim()) return normalizeClaim(finding.claim);
  if (isRecord(verdict) && typeof verdict.claim === 'string' && verdict.claim.trim()) {
    return normalizeClaim(verdict.claim);
  }
  if (isRecord(verdict) && typeof verdict.recommended_option === 'string' && verdict.recommended_option.trim()) {
    return normalizeClaim(`Recommend ${verdict.recommended_option}`);
  }
  if (typeof finding.summary === 'string' && finding.summary.trim()) return normalizeClaim(finding.summary);
  throw new TypeError('finding.claim or verdict.recommended_option is required');
}

function normalizeConfidence(value) {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.min(1, numeric));
}

function normalizeFinding(input, options = {}) {
  if (!isRecord(input)) {
    throw new TypeError('finding must be an object');
  }
  const now = options.now || new Date().toISOString();
  const topicId = String(input.topic_id || input.topicId || 'session');
  const topicSlug = deriveTopicSlug({ ...input, topic_id: topicId });
  const findingType = String(input.finding_type || input.findingType || 'decision-prior');
  const claim = deriveClaim(input);
  const claimSlug = slugify(input.claim_slug || claim, 'claim');
  const fingerprint = String(input.fingerprint || `council:${topicSlug}:${claimSlug}`);
  const contentHash = String(
    input.content_hash
      || sha256(`${topicId}\u001f${findingType}\u001f${normalizeClaim(claim).slice(0, 120)}`),
  );
  const roundId = input.round_id || input.roundId || null;
  const sourceArtifacts = Array.isArray(input.source_artifacts)
    ? input.source_artifacts.filter((entry) => typeof entry === 'string' && entry.trim())
    : [];
  const verdict = isRecord(input.final_verdict) ? input.final_verdict : input.verdict;

  return {
    fingerprint,
    content_hash: contentHash,
    topic_id: topicId,
    topic_slug: topicSlug,
    round_id: roundId,
    finding_type: findingType,
    claim,
    stance: input.stance || (findingType === 'session-synthesis' ? 'synthesis' : 'support'),
    severity: input.severity || null,
    confidence: normalizeConfidence(input.confidence ?? (isRecord(verdict) ? verdict.confidence : null)),
    evidence: input.evidence || (isRecord(verdict) ? { adjudicator_verdict: verdict } : {}),
    source_iter: input.source_iter || input.sourceIter || roundId,
    source_seat: input.source_seat || input.sourceSeat || null,
    source_artifacts: sourceArtifacts,
    introduced_at: input.introduced_at || input.introducedAt || now,
    last_seen_at: input.last_seen_at || input.lastSeenAt || now,
    superseded_by: input.superseded_by ?? input.supersededBy ?? null,
  };
}

function appendFinding(packetPath, finding, options = {}) {
  const filePath = registryPath(packetPath);
  const lockPath = options.lockPath || lockPathFor(filePath);
  acquireLock(lockPath, { registry_path: filePath, fingerprint: finding && finding.fingerprint }, options);
  try {
    const registry = readRegistryDocument(filePath);
    const normalized = normalizeFinding(finding, options);
    registry.schema_version = SCHEMA_VERSION;
    registry.session_id = registry.session_id || finding.session_id || finding.sessionId || null;
    registry.findings.push(normalized);
    registry.updated_at = normalized.last_seen_at;
    writeRegistryDocumentAtomic(filePath, registry);
    return normalized;
  } finally {
    releaseLock(lockPath);
  }
}

function loadRegistry(packetPath) {
  return readRegistryDocument(registryPath(packetPath)).findings;
}

function getCrossTopicPriors(packetPath, options = {}) {
  const limit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : DEFAULT_PRIOR_LIMIT;
  const topicId = options.topic_id || options.topicId || null;
  const seen = new Set();
  return loadRegistry(packetPath)
    .filter((finding) => isRecord(finding) && !finding.superseded_by)
    .filter((finding) => !topicId || finding.topic_id !== topicId)
    .sort((left, right) => String(right.last_seen_at || '').localeCompare(String(left.last_seen_at || '')))
    .filter((finding) => {
      if (seen.has(finding.fingerprint)) return false;
      seen.add(finding.fingerprint);
      return true;
    })
    .slice(0, limit)
    .map((finding) => ({
      fingerprint: finding.fingerprint,
      claim: finding.claim,
      stance: finding.stance,
      confidence: finding.confidence,
      topic_id: finding.topic_id,
      round_id: finding.round_id,
      finding_type: finding.finding_type,
      source_artifact: Array.isArray(finding.source_artifacts) ? finding.source_artifacts[0] || null : null,
      last_seen_at: finding.last_seen_at,
    }));
}

module.exports = {
  FindingsRegistryLockError,
  REGISTRY_FILE_NAME,
  appendFinding,
  getCrossTopicPriors,
  loadRegistry,
  normalizeFinding,
  registryPath,
};

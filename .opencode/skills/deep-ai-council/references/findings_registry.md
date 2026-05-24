---
title: "Findings Registry"
description: "Cross-topic findings registry with fingerprint-based deduplication and filesystem locking for deep-ai-council."
trigger_phrases:
  - "findings registry"
  - "cross topic priors"
  - "findings deduplication"
  - "registry fingerprint"
importance_tier: "normal"
contextType: "reference"
---

# Findings Registry

The findings registry stores council findings across topics with fingerprint-based deduplication and cross-topic prior retrieval.

---

## 1. OVERVIEW

### Core Principle

Findings persist across topics. Fingerprints prevent duplicates. Locking prevents corruption.

### When to Use

Use the registry when you need to track findings across multiple topics in a session and retrieve priors for later topics.

### Key Sources

- Registry implementation: `scripts/lib/findings-registry.cjs`

---

## 2. REGISTRY SCHEMA

### File Location

Registry file: `ai-council/deep-ai-council-findings-registry.json`

### Document Structure

```javascript
{
  schema_version: '1.0',
  registry_name: 'deep-ai-council-findings-registry',
  session_id: string | null,
  findings: Array<Finding>,
  priors_by_topic: Record<string, Finding[]>,
  updated_at: string | null,
}
```

### Finding Record

```javascript
{
  fingerprint: string,
  content_hash: string,
  topic_id: string,
  topic_slug: string,
  round_id: string | null,
  finding_type: string,
  claim: string,
  stance: string,
  severity: string | null,
  confidence: number | null,
  evidence: Record<string, unknown>,
  source_iter: string | null,
  source_seat: string | null,
  source_artifacts: string[],
  introduced_at: string,
  last_seen_at: string,
  superseded_by: string | null,
}
```

**Key fields**:
- `fingerprint`: Derived from topic slug and claim slug
- `content_hash`: SHA-256 of topic ID, finding type and claim
- `superseded_by`: Set when a finding is rolled back

---

## 3. FINGERPRINT-BASED DEDUPLICATION

### Fingerprint Derivation

Fingerprints combine topic slug and claim slug with a `council:` prefix

**Format**: `council:{topic_slug}:{claim_slug}`

### Content Hash

Content hash uses SHA-256 on topic ID, finding type and the first 120 characters of the claim

**Format**: `sha256:{hex_digest}`

### Deduplication in Cross-Topic Priors

When retrieving priors, the registry filters out duplicate fingerprints to return unique findings

---

## 4. CROSS-TOPIC PRIORS

### Retrieval Logic

`getCrossTopicPriors` returns findings from other topics, sorted by recency and limited to a configurable maximum

**Filter rules**:
- Exclude findings with `superseded_by` set
- Exclude findings from the current topic ID
- Deduplicate by fingerprint
- Sort by `last_seen_at` descending
- Limit to `DEFAULT_PRIOR_LIMIT` (5) or custom limit

### Prior Summary Structure

```javascript
{
  fingerprint: string,
  claim: string,
  stance: string,
  confidence: number | null,
  topic_id: string,
  round_id: string | null,
  finding_type: string,
  source_artifact: string | null,
  last_seen_at: string,
}
```

### Integration with Topic Briefs

Session orchestration injects priors into topic briefs after the first topic

**Enriched topic brief includes**:
- `prior_fingerprints`: Array of fingerprint strings
- `prior_findings`: Array of prior summary objects

---

## 5. FILESYSTEM LOCKING

### Lock File Path

Lock file: `{registry_path}.lock`

### Lock Acquisition

`acquireLock` creates the lock file with owner PID and timestamp

**Retry behaviour**:
- Retry every `LOCK_RETRY_MS` (10ms)
- Timeout after `LOCK_TIMEOUT_MS` (2000ms)
- Throw `FindingsRegistryLockError` on timeout

### Lock Payload

```javascript
{
  owner_pid: number,
  acquired_at_iso: string,
  registry_path: string,
  fingerprint: string,
}
```

### Lock Release

`releaseLock` removes the lock file after the write completes

### Atomic Writes

`writeRegistryDocumentAtomic` writes to a temp file, fsyncs, then renames

**Steps**:
1. Create temp file with unique name
2. Write content and fsync
3. Rename temp to target
4. Fsync parent directory
5. Clean up temp file

---

## 6. PUBLIC API

### registryPath

Resolve the full path to the registry file

```javascript
registryPath(packetPath: string): string
```

### normalizeFinding

Canonicalise a raw finding into the registry schema

```javascript
normalizeFinding(input: Record<string, unknown>, options?: { now?: string }): Record<string, unknown>
```

### appendFinding

Append a finding with locking and atomic write

```javascript
appendFinding(packetPath: string, finding: Record<string, unknown>, options?: Record<string, unknown>): Record<string, unknown>
```

### loadRegistry

Load all findings from the registry

```javascript
loadRegistry(packetPath: string): Array<Record<string, unknown>>
```

### getCrossTopicPriors

Retrieve cross-topic priors with filtering

```javascript
getCrossTopicPriors(packetPath: string, options?: { limit?: number, topic_id?: string }): Array<Record<string, unknown>>
```

---

## 7. ERROR HANDLING

### FindingsRegistryLockError

Thrown when the lock cannot be acquired within the timeout

**Properties**:
- `name`: 'FindingsRegistryLockError'
- `code`: 'FINDINGS_REGISTRY_LOCK_HELD'
- `lockPath`: Path to the contended lock file

### Claim Derivation Errors

`normalizeFinding` throws when claim derivation fails

**Claim sources in order**:
1. `finding.claim`
2. `verdict.claim`
3. `verdict.recommended_option` (prefixed with "Recommend ")
4. `finding.summary`

---

## 8. WORKED EXAMPLE

### Appending a Finding

```javascript
const finding = appendFinding('/path/to/packet', {
  session_id: 'council-001',
  topic_id: 'topic-001-runtime',
  topic_slug: 'runtime-boundary',
  round_id: 'round-002',
  finding_type: 'topic-final-verdict',
  claim: 'Extend deep-loop-runtime with council primitives',
  stance: 'support',
  confidence: 0.82,
  source_artifacts: ['ai-council/topics/topic-001-runtime/rounds/round-002/deliberation.md'],
});
```

### Retrieving Cross-Topic Priors

```javascript
const priors = getCrossTopicPriors('/path/to/packet', {
  limit: 5,
  topic_id: 'topic-003-cost-guards',
});
```

---

## 9. CROSS-REFERENCES

- State format: `references/state_format.md`
- Deep mode: `references/deep_mode.md`
- Session orchestration: `scripts/orchestrate-session.cjs`

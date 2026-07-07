---
title: "Feature Specification: Novel embedding-drift monitoring plus alerting [template:level_2/spec.md]"
description: "The re-index path has no mixed-vector guard. There is no per-chunk record of which embedding regime produced a vector, so a corpus that mixes old and new model or normalizer or strategy versions is undetectable and silently confounds every prod-mode completeRecall@3 read."
trigger_phrases:
  - "embedding drift monitor"
  - "mixed vector guard"
  - "embedding context version"
  - "normalizer fingerprint"
  - "embedding regime alert"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/004-novel-research/020-novel-embedding-drift-monitor"
    last_updated_at: "2026-07-04T17:12:06.926Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec from research novel embedding-drift row"
    next_safe_action: "Run generate-context.js to emit description.json and graph-metadata.json"
    blockers: []
    key_files:
      - "../research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Novel embedding-drift monitoring plus alerting

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `020-novel-embedding-drift-monitor` |
| **Verdict** | novel-GO (GO-on-cost) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The re-index path has no mixed-vector guard and never specified one. A chunk vector carries no first-class record of the embedding regime that produced it, so the model id and the normalizer behavior and the prefix strategy version are all invisible after the embed. The grep for `embedding_context_version` and `embeddingCoverage` and `coverageThreshold` is empty today, which research section 4 names as the missing guard the C1 chunk-prefix re-embed depends on. When a partial re-embed leaves old and new vectors mixed in one corpus, nothing detects the mixed regime, and a prod-mode completeRecall@3 read on that corpus measures a confound rather than the change under test. This is the trap research section 6 calls non-negotiable for retrieval, and the standing drift guards section 5 enumerates have no embedding-drift channel.

### Purpose
Stamp every chunk vector with a per-chunk embedding regime fingerprint and run a standing meta-check that alerts on a mixed-regime corpus, so the re-index path has the mixed-vector guard it needs and every prod-mode completeRecall@3 read is protected from the regime confound.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-chunk embedding regime fingerprint stored on the vector record, composed of the `embedding_context_version` plus the model id plus a normalizer fingerprint, so each vector declares the regime that produced it.
- A coverage readout that counts chunks per regime fingerprint and reports the corpus as single-regime or mixed-regime, the meta-check research section 4 names as the empty `embeddingCoverage` and `coverageThreshold` gap.
- A standing embedding-drift detector that emits a report-only finding and alerts when the corpus holds more than one live regime fingerprint, wired as a drift guard rather than a vector-producing change.
- A backfill of the fingerprint onto the existing roughly 2022-row corpus so the census reads a real per-regime count rather than a null column, run through the existing additive write path.
- Default-off wiring so the existing eval and prod read paths are unchanged until the fingerprint column and the census land.

### Out of Scope
- The C1 chunk-prefix re-embed and the strategy-version cache-key fold - that work is owned by `014-chunk-prefix`. This phase only stamps and counts the regime, it does not re-embed.
- Any retrieval-promotion decision or ranking-weight change - the monitor emits findings and alerts, not vector rows, so it is floor-bypassing by construction and carries no prod-mode recall claim of its own.
- The prod-mode completeRecall@3 gate - that instrument is owned by `015-prodmode-recall-gate`. This phase protects that read from a mixed-regime confound, it does not perform the read.
- Mutating any authored spec-doc body or any chunk content - the fingerprint is a metadata stamp on the vector record only.
- Auto-remediation of a mixed regime - the detector is report-only and never triggers a re-embed. The re-embed itself is the C1 surface behind its own coverage guard.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Modify | Add the `embedding_context_version` column plus the model id and normalizer fingerprint fields to the persistent vector record, alongside the existing PK at line 157 |
| `.opencode/skills/system-spec-kit/shared/embeddings.ts` | Modify | Compute and surface the per-chunk regime fingerprint at the embed seam near the in-process LRU key at lines 309-311 so the stamp matches the cache identity |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/sweep/detect-embedding-drift.ts` | Create | The standing drift detector that reads the coverage readout, counts live regime fingerprints, and emits a report-only finding plus alert on a mixed-regime corpus |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/sweep/backfill-embedding-regime.ts` | Create | A dry-run-then-apply backfill that stamps the fingerprint onto the existing corpus through the additive write path so the census reads a real per-regime count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every chunk vector SHALL carry a per-chunk regime fingerprint composed of `embedding_context_version` plus model id plus a normalizer fingerprint. | When a chunk is embedded, then its persistent vector record at `embedding-cache.ts` carries a non-null fingerprint, and two chunks embedded under the same regime carry byte-identical fingerprints. |
| REQ-002 | A coverage readout SHALL count chunks per live regime fingerprint and classify the corpus as single-regime or mixed-regime. | When the corpus holds one regime, then the readout reports single-regime. When a partial re-embed leaves two regimes, then the readout reports mixed-regime with a per-regime count. |
| REQ-003 | WHEN the corpus holds more than one live regime fingerprint the detector SHALL emit a report-only finding plus an alert and SHALL never mutate a vector or a body. | A scratch corpus seeded with two regimes produces a mixed-regime finding and alert, and no vector or source doc is rewritten by the detector. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The fingerprint and the detector SHALL be default-off, so the existing eval and prod read paths are byte-identical until the column and census land. | When the feature is off, then chunk vectors and the cache identity are unchanged from current behavior, and no existing read changes. |
| REQ-005 | The backfill SHALL run dry-run first and apply only on an explicit flag, stamping through the existing additive write path so no destructive rewrite occurs. | A dry-run reports the count of chunks that would be stamped. An apply stamps them and the census then reads a real per-regime count rather than a null column. |
| REQ-006 | The detector SHALL register as a standing drift guard alongside the coverage and storage and cross-copy guards research section 5 enumerates. | The embedding-drift channel appears in the drift-guard set so a mixed regime is caught on the standing schedule, not only on a manual check. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A backfill plus census reports the live per-regime count on the existing corpus, and the starting mixed-embedding-regime chunk census research section 5 calls for is a real number rather than a null column.
- **SC-002**: A scratch corpus seeded with two regimes raises a mixed-regime alert, and a single-regime corpus does not, proving the monitor verdicts the regime rather than always firing.
- **SC-003**: With the C1 re-embed run behind its coverage guard, the monitor confirms full single-regime coverage before any prod-mode completeRecall@3 read in `015` is trusted, removing the confound research section 6 names non-negotiable.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `014-chunk-prefix` | The monitor is the mixed-vector guard the C1 re-embed needs, so C1 cannot be trusted at the prod read without it. Note this is a guard relationship, not a build block. | Land the fingerprint and census first so a C1 partial re-embed is detectable. The two phases share the `embedding_context_version` field on the same vector record. |
| Dependency | `015-prodmode-recall-gate` | The monitor protects the C2 prod-mode completeRecall@3 read from a mixed-regime confound, and a reviewer reading prod@3 on a mixed corpus repeats the 028 saturation trap. | Surface single-regime coverage as a precondition the release reviewer reads before trusting any prod-column move. This phase is not itself C2-gated because it emits findings, not vector rows. |
| Risk | Null fingerprint on legacy vectors | High. Until the backfill runs, the existing corpus carries a null regime column and the census reads nothing. | REQ-005 runs the dry-run-then-apply backfill through the additive write path before the census is trusted. |
| Risk | Fingerprint diverges from cache identity | Med. If the stamp at `shared/embeddings.ts:309-311` does not match the cache key the same inputs produce, two chunks of one regime could fingerprint differently. | REQ-001 binds the fingerprint to the same regime inputs the cache key uses, verified by a same-regime byte-identity test. |
| Risk | Alert fatigue from a benign transition | Low. A planned re-embed is temporarily mixed by design while it runs. | The detector is report-only and the alert names the per-regime count, so a known in-flight re-embed is read as transitional rather than a fault. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fingerprint is a string stamp computed from inputs already in hand at the embed seam, so per-chunk overhead stays negligible relative to the embedding call.
- **NFR-P02**: The census is a per-regime count over a roughly 2022-row corpus, a cheap aggregate scan run on the standing drift schedule, not a per-query cost.

### Reliability
- **NFR-R01**: With the feature off, byte-identical vectors and cache identity guarantee zero regression on the existing eval and prod read paths.
- **NFR-R02**: The detector is read-only, so a failed or interrupted census never corrupts a vector or a source doc.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Legacy vector with a null fingerprint: the census counts it as an unstamped regime bucket so the mixed state is visible rather than hidden, until the backfill stamps it.
- Single chunk in the corpus: the census reports single-regime trivially and never alerts.
- Normalizer change with no model change: the normalizer fingerprint shifts the regime even when the model id is unchanged, so a normalizer-only drift is still caught.

### State Transitions
- In-flight re-embed: the census reports the transitional mixed regime with a per-regime count, and the report-only alert names it rather than blocking.
- Backfill mid-run: a partial backfill leaves a mixed unstamped-versus-stamped state that the census surfaces, and a resumed apply converges it to single-regime.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | 2 source files modified, 2 net-new sweep scripts, a one-time backfill |
| Risk | 10/25 | Touches the vector record and the embed seam, but the detector is report-only and floor-bypassing, no ranking or floor change |
| Research | 7/20 | Verdict and seams grounded in research sections 3, 4 and 5, and the unblocked prod read is owned by 015 |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is the normalizer fingerprint a hash of the normalizer config or of the normalizer code version? The config hash catches a behavior change without a code bump, the code version is cheaper to compute.
- Does the regime fingerprint share the `embedding_context_version` field with the C1 strategy version one-to-one, or is the strategy version one component of a composite fingerprint? A composite lets the model and normalizer and strategy drift independently.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Novel-GO, GO-on-cost. This is one of the four genuinely novel floor-bypassing capabilities the reuse-first slate missed, and research names it the mixed-vector guard the re-index path needs and never specified. It is floor-bypassing by construction because it emits a per-regime census and a report-only alert, not vector rows, so it carries no prod-mode completeRecall@3 claim of its own and is not itself C2-gated. Its value is a meta-check on the index: it protects every prod@3 read from the regime confound research section 6 calls non-negotiable, and it gives the standing drift-guard set the embedding-drift channel section 5 enumerates. It pairs with the C1 chunk-prefix re-embed as that phase's coverage guard and pairs with the C2 gate as the precondition a release reviewer reads before trusting a prod-column move.
<!-- /ANCHOR:verdict -->

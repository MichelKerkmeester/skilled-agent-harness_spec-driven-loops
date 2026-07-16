---
title: "Feature Specification: C1 deterministic header-path plus curated-signal chunk prefix [template:level_2/spec.md]"
description: "The embed path strips frontmatter triggers, title, and the header path before hashing, so every spec-doc chunk vector loses its strongest curated retrieval signal. C1 re-injects that signal as a deterministic chunk prefix behind a new coverage guard."
trigger_phrases:
  - "chunk prefix"
  - "header path"
  - "embedding coverage guard"
  - "dual cache key"
  - "retrieval re-embed"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/003-retrieval-gated-tuning/001-chunk-prefix"
    last_updated_at: "2026-07-04T17:11:52.520Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec from research C1 row"
    next_safe_action: "Wait for ../002-prodmode-recall-gate prod-mode proof"
    blockers:
      - "Gated on ../002-prodmode-recall-gate prod-mode completeRecall@3 proof"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts"
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
# Feature Specification: C1 deterministic header-path plus curated-signal chunk prefix

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
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `014-chunk-prefix` |
| **Verdict** | conditional-C2-gated |
| **Parent Spec** | ../spec.md |
| **Successor** | ../002-prodmode-recall-gate/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The embed path strips the highest-value curated retrieval signal before it ever reaches a vector. `normalizeContentForEmbedding` at `content-normalizer.ts:216-231` strips the YAML frontmatter at line 222, strips anchors at line 223, and flattens every markdown heading to a plain label at line 228 via `normalizeHeadings`. The frontmatter `trigger_phrases` and `title` and the header path that the author curated are gone by the time the chunk is hashed and embedded, so a spec-doc chunk vector carries only its flattened body prose and none of its strongest intent signal.

### Purpose
Re-inject a deterministic header-path plus curated-signal prefix into each chunk before embedding so the vector carries the frontmatter triggers and title and header path, gated behind a new coverage guard and a prod-mode completeRecall@3 proof.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A deterministic prefix builder that composes the frontmatter `trigger_phrases` and `title` and the chunk header path into a stable string prepended to chunk content before embedding.
- A new embedding coverage guard (`embedding_context_version` plus a coverage readout) that does not exist today, so a mixed-regime corpus is detectable before any prod-mode read trusts the new vectors.
- The dual-cache-key fix that folds the prefix strategy version into BOTH the persistent cache primary key at `embedding-cache.ts:157` and the in-process LRU key at `shared/embeddings.ts:309-311`, without which the change silently no-ops on cache hits.
- A full re-embed of the spec corpus under the new strategy version behind the coverage guard.
- Default-off wiring so the legacy corpus and the existing eval and prod paths are unchanged until the guard reads full coverage and the C2 gate passes.

### Out of Scope
- Any retrieval-promotion decision or ranking-weight change - that is owned by 015-prodmode-recall-gate and the C2 prod-mode completeRecall@3 proof, not by this phase.
- C4 metadata fusion (`alpha * text + (1 - alpha) * metadata`) - research subsumes C4 into the cheaper deterministic C1 prefix and defers fusion until the prefix shows the floor can move.
- Mutating any authored spec-doc body - the prefix is an embed-time transform only and never rewrites the source file.
- The `run-eval-v2.mjs` harness or the recall gate itself - the dual-mode harness already ships and the gate is built in 015.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts` | Modify | Add a deterministic prefix builder that re-injects frontmatter triggers and title and header path stripped at lines 222-228, applied before embedding, behind the strategy flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Modify | Fold the prefix strategy version into the persistent cache primary key at line 157 so a re-embed under the new strategy does not collide with old cached vectors |
| `.opencode/skills/system-spec-kit/shared/embeddings.ts` | Modify | Fold the same strategy version into the in-process LRU key at `getCacheKey` lines 309-311 so the change does not no-op on warm hits |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Modify | Add the `embedding_context_version` column plus a coverage readout for the new guard |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The prefix builder SHALL deterministically compose frontmatter `trigger_phrases`, `title`, and the chunk header path into a stable prefix string. | Given the same chunk and frontmatter, when the builder runs twice, then it emits byte-identical prefixes, and the prefix contains the curated triggers and title and header path that `normalizeContentForEmbedding` strips at `content-normalizer.ts:222-228`. |
| REQ-002 | The strategy version SHALL be folded into both cache keys so a re-embed under the new strategy never returns a pre-strategy cached vector. | When the strategy version changes, then the persistent PK at `embedding-cache.ts:157` and the LRU key at `shared/embeddings.ts:309-311` both miss on old entries, and a re-embed produces new vectors rather than a silent no-op. |
| REQ-003 | A coverage guard SHALL expose `embedding_context_version` plus a coverage readout, and a prod-mode read SHALL refuse to trust the new vectors until coverage is full. | When the corpus is a mixed regime, then the guard reports less-than-full coverage, and the readout is queryable before any retrieval-promotion decision. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The prefix SHALL be default-off behind the strategy flag, so the existing eval and prod paths are unchanged until the guard and the C2 gate clear. | When the flag is off, then chunk vectors and cache keys are byte-identical to the current behavior, and no existing eval or prod read changes. |
| REQ-005 | The prefix SHALL be an embed-time transform only and SHALL never mutate an authored spec-doc body. | When a chunk is prefixed for embedding, then the source `.md` on disk is unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A full re-embed under the new strategy version completes at 100-percent coverage per the new guard, with no mixed-regime chunks remaining.
- **SC-002**: The prod-mode completeRecall@3 number from `run-eval-v2.mjs` dual-mode RISES against the 015 baseline. Eval-mode @K and external @5/@10/@20 numbers are explicitly inadmissible as the promotion signal because the K=3 prod floor hides exactly that band.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 015-prodmode-recall-gate | HARD BLOCK on promotion. Every Tier-C and 027 retrieval item is gated on the prod-mode completeRecall@3 proof. C1 cannot promote without it. | Ship C1 default-off behind the coverage guard, promote only after 015 lands the gate and the prod-mode number moves. |
| Dependency | New coverage guard (`embedding_context_version` plus coverage readout) | The grep for `embeddingCoverage` and `coverageThreshold` and `embedding_context_version` is empty today, so the guard is net-new and must land before any re-embed is trusted. | Build the guard in this phase as a P0 before the full re-embed. |
| Risk | Dual-cache-key no-op | High. If the strategy version is folded into only one of the two keys, a warm LRU hit or a persistent cache hit returns the old prefix-less vector and the change is invisible. | REQ-002 requires both `embedding-cache.ts:157` and `shared/embeddings.ts:309-311` updated together, verified by a re-embed miss test. |
| Risk | Mixed-embedding-regime confound | Med. A partial re-embed leaves old and new vectors mixed, confounding the prod@3 read. | The coverage guard gates the prod read on full coverage. Pairs with the novel embedding-drift monitor noted in research section 3. |
| Risk | Full re-embed cost | Med. C1 pays a re-index tax that write-time and adherence candidates bypass. | Run the re-embed once behind the flag, measured before promotion. The cost is justified only by an SC-002 prod@3 rise. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the prefix carry the full header path or only the leaf heading? The header path is the higher-signal form, the trade is prefix length against per-chunk token budget.
- Is the strategy version a single global integer or a per-strategy tuple? A tuple lets C3/C4 re-embed independently later without a full corpus flush.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The prefix build is deterministic and string-only, so per-chunk embed-prep overhead stays negligible relative to the embedding call itself.
- **NFR-P02**: The full re-embed is a one-time corpus pass at roughly 2022-row scale, run once behind the flag, not a per-query cost.

### Reliability
- **NFR-R01**: With the flag off, byte-identical cache keys and vectors guarantee zero regression on the existing eval and prod paths.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing frontmatter triggers: the prefix degrades to title plus header path only, never errors.
- Empty header path (top-of-doc chunk): the prefix carries triggers and title only.
- Over-long prefix: the prefix is truncated to a fixed budget so it never dominates the chunk body in the embedding.

### State Transitions
- Partial re-embed: the coverage guard reports the mixed regime and blocks the prod read until coverage is full.
- Strategy version bump: both cache keys miss old entries cleanly, no manual cache flush required.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 3 source files, a net-new coverage guard, a full re-embed pass |
| Risk | 16/25 | Touches the live embed and cache path, dual-key no-op is a real foot-gun, retrieval-class so C2-gated |
| Research | 8/20 | Seams verified to file:line, the unblock measurement is owned by 015 |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

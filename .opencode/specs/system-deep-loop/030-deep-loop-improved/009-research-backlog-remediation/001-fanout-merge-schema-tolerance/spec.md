---
title: "Feature Specification: Fanout-Merge Schema Tolerance"
description: "Fix fanout-merge.cjs silently dropping 100% of a lineage's findings when its registry uses a non-canonical schema key (findings vs keyFindings), with no warning."
trigger_phrases:
  - "fanout merge schema tolerance"
  - "keyFindings alias findings"
  - "merge silent drop bug"
  - "schema_mismatch merge warning"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/001-fanout-merge-schema-tolerance"
    last_updated_at: "2026-07-01T06:35:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented by MiMo v2.5 ultraspeed, independently verified by Claude Sonnet 5"
    next_safe_action: "Phase complete; move to child 002-fanout-timeout-override"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Fanout-Merge Schema Tolerance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 |
| **Predecessor** | None |
| **Successor** | 002-fanout-timeout-override |
| **Handoff Criteria** | New regression test proves the merge no longer silently drops non-`keyFindings`-schema registries; full deep-loop-runtime suite green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:472` — `mergeResearchRegistries` does `if (!registry || !Array.isArray(registry.keyFindings)) continue;`. When a lineage's own `deep-research-findings-registry.json` uses a differently-named/shaped array (e.g. `findings` instead of `keyFindings`, or a `category`/`disposition`-shaped finding instead of `iterations`/`_lineages`), the loop silently skips that entire lineage's findings — zero warning, zero error. The function still returns `"status":"ok"` with correct-looking aggregate stats for the lineages it DID process, making the loss invisible unless an operator manually diffs the merged output against each raw per-lineage registry (as the 2026-07-01 deep-research fan-out synthesis had to do to catch it). Confirmed root-cause evidence: `research/research.md` §4.1, §6 (fanout-merge.cjs:472), and `research/lineages/glm/deep-research-findings-registry.json` (uses `findings`) vs `research/lineages/gpt/deep-research-findings-registry.json` (uses `keyFindings`) vs the merged `research/deep-research-findings-registry.json` (silently gpt-only, 8 findings instead of the true 26).

### Purpose
Make `mergeResearchRegistries` (and audit `mergeReviewRegistries` for the same class of defect) tolerant of the schema variance real detached-CLI lineages actually produce, OR fail loud with an accurate skip count — never silently succeed while discarding input.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mergeResearchRegistries` in `fanout-merge.cjs`: accept `findings` as a recognized alias for `keyFindings` (normalize on read, or run each lineage registry through a light schema-normalization step before the existing merge logic runs).
- Emit a loud, machine-readable `schema_mismatch` warning (mirroring the existing `jsonl_wrong_type` pattern already used elsewhere in this runtime) whenever a lineage registry is skipped or has fields coerced, including an accurate `skipped_findings_count`.
- Audit `mergeReviewRegistries` (same file, review-mode counterpart) for the identical class of silent-skip risk; apply the same tolerance/warning pattern if the same defect exists there.
- Add a regression test asserting `sum(per-lineage finding counts) == merged finding count` (accounting for intentional near-duplicate dedup) — this is the invariant that would have caught the original bug.

### Out of Scope
- Changing what schema the research/review reducers themselves write (that's the canonical-writer side; this phase only hardens the consumer/merge side to tolerate real-world variance from LLM-self-authored registries in detached lineages).
- Any other fanout-merge.cjs behavior not related to schema tolerance (e.g. dedup algorithm internals, attribution.md generation).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modify | Schema-tolerant `mergeResearchRegistries` (+ `mergeReviewRegistries` if same defect found); loud `schema_mismatch` warning with skip count |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modify | New regression test(s): non-`keyFindings` schema registry is no longer silently dropped; sum-invariant test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A lineage registry using `findings` instead of `keyFindings` must have its findings included in the merged output | New test: 2-lineage merge input where one uses `findings`, one uses `keyFindings` → merged `keyFindings.length` equals the sum of both (minus any genuine dedup) |
| REQ-002 | A schema mismatch must be visible, not silent | Merge output/stdout includes a `schema_mismatch` (or equivalent) event naming the affected lineage and an accurate count of findings that would otherwise have been dropped |
| REQ-003 | The sum-invariant regression test exists and passes | New vitest asserting `sum(per-lineage keyFindings/findings counts) == merged.keyFindings.length` (dedup-aware) fails on the pre-fix code (red) and passes post-fix (green) |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `mergeReviewRegistries` audited for the same defect class | Either a matching fix is applied, or the audit's conclusion (no defect present) is documented in the implementation summary with the specific code path checked |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New regression test(s) fail on pre-fix code (true RED) and pass post-fix (GREEN).
- **SC-002**: Full `deep-loop-runtime` Vitest suite passes with the new tests included.
- **SC-003**: Re-running the merge against the actual 2026-07-01 fan-out's raw per-lineage registries (`research/lineages/{glm,gpt}/deep-research-findings-registry.json`) now yields 26 (or documented-correct dedup'd) merged findings, not 8.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Behavior change | Merge now accepts a second schema shape | Could mask a genuinely malformed registry as "tolerated" | Loud warning on every non-canonical schema use, even when tolerated, so operators still see it happened |
| Scope | Review-mode counterpart may have a different defect shape | Fix could be incomplete if review registries fail differently | REQ-004 requires an explicit audit + documented conclusion, not a silent skip |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope is fully bounded by the confirmed bug in `research/research.md` §4.1/§6.
<!-- /ANCHOR:questions -->

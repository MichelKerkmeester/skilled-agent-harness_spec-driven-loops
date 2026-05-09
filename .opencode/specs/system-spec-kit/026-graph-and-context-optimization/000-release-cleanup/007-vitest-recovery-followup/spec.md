---
title: "Feature Specification: Vitest baseline recovery followup [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/007-vitest-recovery-followup/spec]"
description: "Close the 196 vitest failures escalated from 026/000/006-vitest-baseline-recovery (Unit F). 152 runtime-regression cases were skipped with `it.fails.skip` + `// followup: 026/000/007-vitest-recovery-followup` in the source tree, plus 44 fixture-drift cases that exceeded the 30-LOC repair rule. Inventory is operator-discoverable via `grep -rn 'followup: 026/000/007'`. This packet is a successor placeholder; implementation deferred."
trigger_phrases:
  - "vitest recovery followup"
  - "196 runtime regressions"
  - "026/000/007 packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/007-vitest-recovery-followup"
    last_updated_at: "2026-05-09T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded successor placeholder for Unit F's deferred 196 failures"
    next_safe_action: "Run T001 to enumerate followup-tagged tests"
    blockers: []
    key_files:
      - "../006-vitest-baseline-recovery/scratch/triage-inventory.json"
      - "../006-vitest-baseline-recovery/changelog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "vitest-recovery-followup-placeholder-2026-05-09"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Vitest baseline recovery followup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Placeholder (work deferred) |
| **Created** | 2026-05-09 |
| **Branch** | `main` |
| **Predecessor** | `006-vitest-baseline-recovery/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Sibling packet `006-vitest-baseline-recovery` (Unit F) closed its scope by triaging all 198 vitest failures into 4 buckets and fixing the 18 fixture-drift cases that fell within the 30-LOC repair rule. The remaining **196 failures** were either:
- Runtime regressions exceeding the per-fix 30-LOC threshold (152 cases), or
- Fixture drift that exceeded the same threshold (44 cases — counted alongside the 18 in-packet fixes), or
- Environmental tests that need missing daemon/fixture/auth (28 cases — these are skipped with `it.skip` + `// REASON: ...` annotations rather than failed; not counted in the 196).

Each escalated failure carries a `// followup: 026/000/007-vitest-recovery-followup` annotation in the source so this packet has a discoverable inventory.

### Purpose
Close the remaining 196 failures in batches, surface-by-surface, until the post-recovery vitest baseline reports zero net regressions vs the v3.4.1.0 measured truth. Update the v3.4.1.0 changelog row when the count converges.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enumerate every `// followup: 026/000/007-vitest-recovery-followup` annotation across the test tree.
- Cluster by surface (skill_advisor scorer, hooks, scaffold, alignment, code-graph, etc.).
- For each cluster, decide: (a) fix in this packet (ideally the smaller surfaces), or (b) escalate to a per-surface child packet for batched cli-codex remediation.
- Keep the v3.4.1.0 changelog row honest as the count drops.

### Out of Scope
- Adding new test cases. Like the predecessor, this is baseline restoration not coverage uplift.
- Touching tests classified as `it.skip` environmental — those need infrastructure work, not test fixes.
- Touching tests outside the followup-tagged set.

### Files to Change
TBD at implementation time. Expected surfaces:

| Surface | Approximate failure count |
|---------|---:|
| `skill_advisor/tests/scorer/` | 40+ (projection-fallback, native-scorer, etc.) |
| `tests/hooks/` | 30+ (cross-runtime payload schemas) |
| `tests/scaffold/` | 20+ (manifest-driven template drift) |
| `tests/alignment/` | 15+ (workflow-invariance allowlist) |
| `tests/code-graph/` | 30+ (post-parser_skip_list drift) |
| Other | ~60+ |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete to call packet done)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 196 escalated failures closed (fixed, skipped with reason, or escalated to a per-surface child packet). | `grep -rn 'followup: 026/000/007-vitest-recovery-followup'` returns 0 hits in `mcp_server/tests/` and `mcp_server/skill_advisor/tests/`. |
| REQ-002 | Net regressions: zero. | Post-fix `pnpm vitest run` reports zero NEW failures relative to the post-Unit-F baseline (11,612 passing / 196 failing / 35 skipped). |
| REQ-003 | v3.4.1.0 changelog row reflects truth. | The "Core test suites" row in `v3.4.1.0.md` is updated to match the post-recovery numbers. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each fix carries a drift-attribution comment. | Same `// drift: <packet>` comment pattern as the predecessor. |
| REQ-005 | Per-surface child packets, if used, follow the predecessor's structure. | Each child packet inherits `006-vitest-baseline-recovery`'s 4-bucket taxonomy. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 196 escalated failures closed.
- **SC-002**: `bash validate.sh 007-vitest-recovery-followup --strict` exits 0.
- **SC-003**: v3.4.1.0 changelog row updated to reflect the post-recovery baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A surface cluster turns out to be a real regression hidden behind fixture drift | High | Bucket-by-surface review; never paper-over a real bug by updating the fixture. |
| Risk | 196 is too large for one packet | Med | Per-surface child packets keep each batch tractable. |
| Dependency | `006-vitest-baseline-recovery/scratch/triage-inventory.json` | High | Source of truth for which test goes in which bucket. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: Single packet or per-surface children? (Recommendation: per-surface children for the 5 main clusters; rolls up under this packet as a phase parent if the count exceeds ~50 fixes.)
- **Q2**: Which surface to tackle first? (Recommendation: `skill_advisor/tests/scorer/` — sampled failures suggest a single root cause, fixable in one cli-codex dispatch.)
<!-- /ANCHOR:questions -->

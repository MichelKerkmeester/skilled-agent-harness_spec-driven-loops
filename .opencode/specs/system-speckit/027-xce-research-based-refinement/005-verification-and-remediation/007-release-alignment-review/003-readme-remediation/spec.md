---
title: "Feature Specification: README Currency Remediation (Track A)"
description: "Fix the confirmed README / code-README drift found by the 027 release-alignment review so docs match current post-027 reality, via gpt-5.5-fast markdown fixer seats."
trigger_phrases:
  - "readme currency remediation"
  - "027 readme drift fix"
  - "track A doc remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author README remediation spec and plan"
    next_safe_action: "Run the doc-accuracy audit and record results in implementation-summary"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-18-027-readme-remediation"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: README Currency Remediation (Track A)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-18 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Track A release-alignment review (`../001-readmes-vs-027/review/findings-all.json`) surfaced confirmed README / code-README staleness: the READMEs lag the code 027 shipped — stale tool counts, removed/renamed features described as present, dead links, and old defaults.

### Purpose
Restore README currency surgically, README by README, so docs match current post-027 reality. The fix is applied via gpt-5.5-fast markdown fixer seats that confirm-then-fix each cited claim against the live file.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirmed drift themes — surface-aware tool counts (MCP 39 vs CLI 37)
- `/speckit:resume` spelling
- Local-first embedding defaults
- Deep-loop `improvement`-mode roster
- Removed cross-encoder / rerank docs
- Dead cross-skill links
- Advisor / code-graph factual drift
- Opted-in P2 cosmetics

### Out of Scope
- The correct CLI=37 tool count (binding do-not-fix — confirmed false positive)
- `// Feature catalog:` comments (confirmed false positive)
- TSDoc example values (confirmed false positive)
- Any claim that does not reproduce against the live file (refuted at fix time)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Confirmed-stale READMEs (per `findings-all.json`) | Modified | Surgical currency corrections, no restructure |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No false-positive cluster edited | CLI=37, `// Feature catalog:` comments, TSDoc examples left untouched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Confirmed stale claims corrected against live source | Stale signatures gone (re-grep) |
| REQ-003 | Doc-accuracy audit run over the rewrites | Any wrong new value corrected |
| REQ-004 | Changes committed scoped | Review evidence retained in `../001-readmes-vs-027/review/` |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Confirmed stale claims corrected against live source; stale signatures gone on re-grep
- **SC-002**: No false-positive cluster edited
- **SC-003**: Doc-accuracy audit run; any wrong new value corrected


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-correcting a correct value (e.g. CLI=37→39) | Corrupts accurate docs | Surface-aware per-hit rule + accuracy audit |
| Risk | Fixing a refuted finding | Introduces new drift | Confirm-then-fix; skip if not reproducible |
| Dependency | `findings-all.json` review evidence | Cannot scope fixes | Retained in `../001-readmes-vs-027/review/` |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Accuracy
- **NFR-A01**: Every fix verified against the live file before applying (confirm-then-fix)
- **NFR-A02**: New values independently accuracy-audited after the fix pass

### Safety
- **NFR-S01**: Surgical edits only — no delete, no rename, no edits outside listed files
- **NFR-S02**: False-positive clusters left untouched
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Confirmation Boundaries
- **Refuted at fix time**: If a cited stale claim does not reproduce against the live file, log `refuted` and skip — never force a fix.
- **Surface-aware counts**: CLI front door = 37 (correct, leave as-is); MCP server = 39 (fix only MCP-surface "37"→"39") — per-hit check required.

### Audit Outcomes
- **Wrong new value flagged**: Correction seat applies the audit-verified truth (e.g. CLI restored to 37).
- **Imprecise reword**: Reworded rather than value-corrected where the original was directionally right.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Many READMEs, but surgical docs-only edits |
| Risk | 8/25 | Over-correction risk mitigated by accuracy audit |
| Research | 8/20 | Confirmed against round-2 review + live files |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — all themes resolved against live source and accuracy-audited.
<!-- /ANCHOR:questions -->

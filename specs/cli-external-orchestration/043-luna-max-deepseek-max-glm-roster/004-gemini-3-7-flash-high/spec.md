---
title: "Feature Specification: Gemini 3.7 Flash High Dispatch Support (cli-cursor + cli-devin)"
description: "Neither enforced roster carries a Gemini id: cli-cursor hard-rejects gemini-3.7-flash-high and cli-devin hard-rejects gemini-3-7-flash-high. Additive superset, High tier only, list-verified AND dispatch-tested 2026-08-15."
trigger_phrases:
  - "gemini 3.7 flash high cursor devin"
  - "gemini flash high roster"
  - "gemini phase 004"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-luna-max-deepseek-max-glm-roster/004-gemini-3-7-flash-high"
    last_updated_at: "2026-08-15T12:00:00Z"
    last_updated_by: "pi"
    recent_action: "Shipped Gemini 3.7 Flash High to both allowlists; dispatch-tested"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-phase-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Add all Gemini 3.7 Flash tiers or only High? RESOLVED (operator): High tier only — gemini-3.7-flash-high on cursor, gemini-3-7-flash-high on devin."
      - "List-verify or dispatch-test? RESOLVED (operator): dispatch-test both — live probe dispatches on 2026-08-15 returned exit 0 with the marker echo."
---
# Feature Specification: Gemini 3.7 Flash High Dispatch Support (cli-cursor + cli-devin)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent** | cli-external-orchestration/043-luna-max-deepseek-max-glm-roster |
| **Predecessor** | 003-glm-5-3-opencode-go |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Gemini 3.7 Flash High is live-available on both external CLIs but neither enforced roster carries any Gemini id: cli-cursor's `CURSOR_SUPPORTED_MODELS` hard-rejects `gemini-3.7-flash-high`, and cli-devin's `DEVIN_SUPPORTED_MODELS` hard-rejects `gemini-3-7-flash-high`. Both docs currently state that Gemini ids are out of scope.

### Purpose
Make Gemini 3.7 Flash High dispatchable on both modes as a pure additive superset — the first Gemini id in either curated scope — keeping the two hand-synced enforcement points and every stale count/family/out-of-scope claim consistent. High tier only (operator decision). Ids list-verified against the live CLI listings and **dispatch-tested end-to-end** on 2026-08-15 (operator decision — stronger evidence than the 2026-08-14 additions).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts` allowlists: `CURSOR_SUPPORTED_MODELS` +1 (`gemini-3.7-flash-high`), `DEVIN_SUPPORTED_MODELS` +1 (`gemini-3-7-flash-high`), sorted, honest comments recording the dispatch test.
- `fanout-run.cjs` mirrors `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS` kept byte-identical.
- Vitest fixtures: cursor exact-list 20→21, allowlist fixtures +1 each, negative fixtures for the sibling tiers; cross-check and combo-matrix derivation flow automatically.
- cli-cursor + cli-devin doc honesty sweep: counts 20→21 / five→six families, "Gemini out of scope" wording amended, roster rows, changelogs, SKILL.md version bumps, hub `smart-routing.md` mention.
- Live evidence capture: verbatim listings + dispatch receipts in `evidence/`.

### Out of Scope
- Gemini 3.7 Flash sibling tiers (cursor: `-low`/`-medium`; devin: `-minimal`/`-low`/`-medium`) — High only per operator decision; they stay hard-rejected.
- Earlier Gemini generations (3.5/3.6 flash, 3.1 pro) — not requested, still rejected.
- cli-opencode / Pi rosters — no Gemini scope in this phase.
- `sk-prompt-models` Gemini prompt-craft profile — inherits closest persona (packet 033/043 precedent).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | +1 cursor id, +1 devin uid, sorted, honest dispatch-tested comments |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Mirror the same additions in both Sets |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Cursor 20→21 exact-list assertion + negative |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Cursor +1, Devin +1 fixtures + negatives |
| `.opencode/skills/cli-external-orchestration/cli-cursor/**` | Modify | Roster +1, count 20→21 sweep, out-of-scope wording, changelog v1.4.1.0 |
| `.opencode/skills/cli-external-orchestration/cli-devin/**` | Modify | Roster +1 row, 5→6 families sweep, changelog v1.4.1.0 |
| `.opencode/skills/cli-external-orchestration/shared/references/smart-routing.md` | Modify | Devin roster mention adds Gemini |
| `.opencode/skills/cli-external-orchestration/changelog/v1.4.1.0.md` + `system-deep-loop/changelog/v2.2.1.0.md` | Create | Hub + runtime changelogs |
| `004-gemini-3-7-flash-high/evidence/` | Create | Live listings + dispatch receipts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gemini 3.7 Flash High dispatchable on cli-cursor | `isCursorModelAllowed('gemini-3.7-flash-high')` true; mirror Set identical |
| REQ-002 | Gemini 3.7 Flash High dispatchable on cli-devin | `isDevinModelAllowed('gemini-3-7-flash-high')` true; mirror Set identical |
| REQ-003 | No fabricated ids | Both ids appear verbatim in live listings captured 2026-08-15 |
| REQ-004 | Dispatch-tested end-to-end | Live probe dispatches on both CLIs exit 0 and return the marker response (receipts on file) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No stale counts or family claims | No cli-cursor doc says the old count; no cli-devin doc says "five families" or lists Gemini as out of scope |
| REQ-006 | Additive only | Every pre-existing id/uid still present; sibling Gemini tiers still rejected |
| REQ-007 | Test suite green | executor-config, fanout-run, combo-matrix vitest pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep-loop unit suite passes with the updated fixtures (190 tests).
- **SC-002**: A fanout cli-cursor / cli-devin dispatch naming a Gemini id is no longer rejected by the allowlist gate; sibling tiers still are.
- **SC-003**: `grep` finds no residual stale count / "Gemini out of scope" claim in the touched docs.
- **SC-004**: `validate.sh <folder> --strict` exits 0 on phase 004 and `--recursive --strict` on the parent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cursor-agent` / `devin` CLIs installed and authenticated | Cannot dispatch-test | Both confirmed installed; dispatch receipts captured 2026-08-15 |
| Risk | Mirror drift `executor-config.ts` vs `fanout-run.cjs` | Fanout rejects/accepts wrong id | Edited together; cross-check test asserts identical sets |
| Risk | Fabricated id (the 033 failure mode) | Dispatch fails at runtime | Every id copied verbatim from a live listing; then dispatch-tested |
| Risk | Cursor display name hides the tier | Reader concludes the tiered id is absent | "Gemini 3.7 Flash" display vs `-high` id suffix documented explicitly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No id is added that is not present verbatim in a live CLI listing (no-fabrication invariant).

### Reliability
- **NFR-R01**: `executor-config.ts` allowlists and `fanout-run.cjs` mirrors MUST list identical ids (fail-closed sync invariant asserted by the cross-check tests).
- **NFR-R02**: Every doc comment naming the added ids carries the live-verification date and honest verification level (dispatch-tested 2026-08-15).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Sibling tiers stay rejected: `gemini-3.7-flash-low` / `gemini-3.7-flash-medium` on cursor; `gemini-3-7-flash-minimal` / `-low` / `-medium` on devin — covered by new negative fixtures.
- Earlier Gemini generations (`gemini-3.6-flash-high`, `gemini-3-1-pro-high`) remain out of roster — no fixture change needed (never allowed).
- Cursor's display name for the high tier is "Gemini 3.7 Flash"; the doc and code comment name the id, not the display name.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 4 code/test files + ~14 docs; additive only |
| Risk | 9/25 | Shared deep-loop runtime (high blast) but pure superset, guarded by tests |
| Research | 5/20 | Live-listing verification + two live dispatch probes |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Both decisions resolved by the operator (see frontmatter `answered_questions`).
<!-- /ANCHOR:questions -->

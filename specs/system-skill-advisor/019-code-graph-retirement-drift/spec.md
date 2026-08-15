---
title: "Feature Specification: Code-Graph Retirement Test Drift"
description: "Retiring the code-graph skill crashed the advisor scorer on a null skill id. Hardened the scorer against retired/malformed projection entries (4 crash tests green) and triaged the remaining suite failures as unrelated concurrent drift or corpus-authoring work — without weakening any gate."
trigger_phrases:
  - "code-graph retirement drift"
  - "advisor scorer null id crash"
  - "skillNameVariants undefined crash"
  - "advisor suite triage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/019-code-graph-retirement-drift"
    last_updated_at: "2026-08-15T14:37:23Z"
    last_updated_by: "claude-code"
    recent_action: "Scorer null-id crash fixed via SOL-HIGH; remaining suite failures triaged"
    next_safe_action: "Owner decision on the unrelated drift and the corpus-authoring subset"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Are the 36 failures one code-graph issue? No — only 4 were retirement crash fallout; the rest are unrelated concurrent drift or need corpus authoring."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Code-Graph Retirement Test Drift

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A concurrent refactor retired the code-graph skill (`5a2aab0d37b`, "stop routing to the retired code-graph skill", on origin). It left the advisor scorer dereferencing a now-absent skill `id`: `skillNameVariants(undefined)` threw `Cannot read properties of undefined (reading 'toLowerCase')`, taking down four semantic-lane-promotion tests. The initial hypothesis — that all 36 red tests were one code-graph reconciliation — proved wrong: a guardrailed investigation confirmed only the crash cluster was retirement fallout; the rest are unrelated concurrent drift or need corpus authoring.

### Purpose

Harden the scorer so a retired / malformed projection entry can never crash it, and produce an honest triage of the remaining suite failures — without weakening a single gate to force a pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A defensive guard so a null / blank skill id is skipped, not dereferenced, everywhere the scorer consumes the projection.
- A guard in the holdout builder so unlabeled retired corpus rows are not pooled.
- A triage of the remaining suite failures: retirement-caused-but-needs-authoring vs unrelated concurrent drift.

### Out of Scope

- The unrelated concurrent drift (Figma, mcp-tooling, CLI-hub, sk-communication, policy serializer, playbook, vocabulary, launcher, daemon, stress) — other owners.
- Authoring corpus/fixture rows to make a gate pass (would risk baking a bug into the baseline).
- Reversing the code-graph retirement.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/mcp-server/lib/scorer/text.ts` | Modify | `skillNameVariants` returns `[]` for null/blank id |
| `system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts` | Modify | Skip projection entries with no valid string id |
| `system-skill-advisor/mcp-server/lib/scorer/fusion.ts` | Modify | Filter invalid skill ids once at the scorer boundary |
| `system-skill-advisor/mcp-server/scripts/routing-accuracy/build-holdout.mjs` | Modify | Skip unlabeled corpus rows when building holdout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:evidence -->
## 4. VERIFIED EVIDENCE

Baseline on HEAD `8b34c7adc2`: `36 failed | 839 passed | 7 skipped` (full suite, but it hangs at teardown — see risks).

### The crash was the only clean retirement fallout

`lib/scorer/text.ts skillNameVariants` dereferenced `skill.id` from a projection entry the retirement left without an id. After the guard, `tests/scorer/semantic-lane-promotion.vitest.ts` (4 tests) passes and the scorer no longer crashes on a malformed projection.

### The rest is not code-graph drift

A guardrailed SOL-HIGH pass regenerated `holdout-prompts.jsonl` via its own tool (byte-stable), **rejected** an `ambiguity-prompts.jsonl` regen whose delta carried unrelated `rr-hub6-*` changes, and **declined** to rewrite `scorer-eval-baseline.json` (its only delta was a later accuracy improvement). The remaining failures were confirmed unrelated: CLI-hub executor expectations, Figma/hub corpus parity, `sk-communication` graph symmetry, policy Gate-text bytes, playbook naming, vocabulary parsing, and launcher/settings/daemon behavior.

### Post-fix verification (focused, avoiding the hanging full run)

`tests/scorer/` + `semantic-lane-promotion` + `state-containment`: `5 failed | 141 passed | 2 skipped` — the 5 residuals are bm25 (needs corpus authoring), executor-delegation (unrelated CLI-hub), and lane-weight-sweep (a report harness). Typecheck exit 0.
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The scorer cannot crash on a null / retired skill id | A projection entry with no `id` is skipped, not dereferenced; the 4 crash tests pass |
| REQ-002 | No gate is weakened to force a pass | The diff contains no test/assertion/threshold/baseline edit — only source guards |
| REQ-003 | The remaining failures are triaged honestly | Each residual is classified retirement-needs-authoring vs unrelated concurrent drift, not force-fixed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Regeneration only via owning tooling | `holdout-prompts.jsonl` regenerated via `build-holdout.mjs`; regenerations with unattributable deltas rejected, none hand-edited |
| REQ-005 | Deferred: the corpus-authoring subset (bm25 fixture, review-corpus floor) | Left red and flagged; authoring corpus to pass a gate needs an owner decision |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: The scorer null-id crash is fixed — 4 crash tests green, scorer robust to a malformed projection. (Met.)
- **SC-002**: No gate weakened — diff is source guards only, no test/baseline edits. (Met.)
- **SC-003**: Typecheck exit 0; focused scorer verification recorded; remaining failures triaged. (Met.)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The full advisor `vitest run` hangs at teardown | Medium | `tests/launcher-bootstrap.vitest.ts` spawns a real npm install that empties `node_modules`; verified via focused runs instead — flagged as a separate test-infra bug |
| Risk | Auto-authoring corpus to pass bm25 / review-floor bakes in a bug | High | Left red and flagged for an owner decision rather than fabricated |
| Risk | The unrelated drift belongs to other in-flight sessions | Medium | Triaged and left to owners, not force-fixed |
| Dependency | The code-graph retirement `5a2aab0d37b` | Green | On origin; this packet reconciles only its crash fallout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should the corpus-authoring subset (bm25 fixture, 31-vs-32 review floor) be authored to green, or left to the corpus owner? Deferred to an operator decision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Trigger commit**: `5a2aab0d37b`
- **Sibling packet**: `017-advisor-audit-and-state-containment`

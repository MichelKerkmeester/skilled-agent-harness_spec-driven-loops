---
title: "Verification Checklist: Directive-Lifecycle Documentation Alignment"
description: "Completed verification evidence for the directive-lifecycle documentation alignment."
trigger_phrases:
  - "directive lifecycle docs alignment checklist"
  - "directive lifecycle documentation verification"
importance_tier: "normal"
contextType: "general"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/015-directive-docs-alignment"
    last_updated_at: "2026-08-11T10:10:08Z"
    last_updated_by: "claude"
    recent_action: "Grep, re-sweep, scope, strict-validation, and reconciliation gates completed"
    next_safe_action: "None; historical packet complete"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Directive-Lifecycle Documentation Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md `REQ-001..005` (`REQ-001..003` P0: canonical ENV-REFERENCE registry, lifecycle rule in every runtime doc, kill-switch values documented; `REQ-004..005` P1: docs-only scope + all four findings addressed with SAD-003 recorded no-change).
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md architecture — canonical registry (`ENV-REFERENCE.md` §1 hook-level block) + per-runtime restatement, grep-verifiable, docs-only.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Canonical hook-level env block present in ENV-REFERENCE.md §1
  - **Evidence**: §1 `Hook-level lifecycle flags` block registers `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` (ON, graduated), `SPECKIT_PI_DIRECTIVE_DEDUP` (ON, graduated), and `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` (tmpdir default) with kill-switch semantics and canonical-core pointers; block explicitly marked hook/plugin-level, outside the search-flags table.
- [x] CHK-011 [P1] Runtime docs state the lifecycle rule
  - **Evidence**: README OpenCode Plugin Note ("Since phase 014 ... full only on the first message of a session and after lifecycle boundaries; repeat turns ... route line only"); `.pi/extensions/README.md` prompt-advisor rows (013 dedup, `SPECKIT_PI_DIRECTIVE_DEDUP` default ON); cursor catalog `user-prompt-submit` row (lifecycle-deduped via shared compiled shim).
- [x] CHK-012 [P0] Kill-switch values documented wherever the feature is named
  - **Evidence**: ENV-REFERENCE block rows state `0`/`false`/`off`/`no` → always-full for both dedup switches; README and `.pi` rows state the same; cursor row names the model-context switch.
- [x] CHK-013 [P0] Comment hygiene — no ephemeral ids/spec paths in code comments
  - **Evidence**: docs-only phase; no code comments added or changed; the four doc files contain no ADR-/REQ-/CHK-/task-ids or spec paths inside any code-adjacent comment Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] ENV-REFERENCE §1 block content verified (static)
  - **Evidence**: block located at §1 (`Hook-level lifecycle flags` heading after the Auditable Savings Publication Contract subsection); three env rows present with defaults + kill-switch semantics.
- [x] CHK-021 [P1] README cadence sentence verified (static)
  - **Evidence**: OpenCode Plugin Note paragraph contains the since-014 lifecycle sentence including the `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` revert and fail-open phrasing.
- [x] CHK-022 [P1] `.pi` prompt-advisor rows verified (static)
  - **Evidence**: `.pi/extensions/README.md` adapters table row and lifecycle table row document the 013 dedup (`SPECKIT_PI_DIRECTIVE_DEDUP`, full first + boundaries, route-only repeats).
- [x] CHK-023 [P1] Cursor catalog verify-and-note verified (static)
  - **Evidence**: `cursor-hooks-and-spec-gate.md` `user-prompt-submit.ts` handler row notes the registered `beforeSubmitPrompt` proxy and lifecycle-deduped directive delivery via the shared compiled shim.
- [x] CHK-024 [P0] Grep gates run green
  - **Evidence**: `Hook-level lifecycle flags` subsection present in ENV-REFERENCE §1 with `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`, `SPECKIT_PI_DIRECTIVE_DEDUP`, `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` registered; lifecycle-rule phrasing in system-skill-advisor/README.md, .pi/extensions/README.md prompt-advisor rows, and cursor-hooks-and-spec-gate.md; kill-switch values documented beside each env.
- [x] CHK-025 [P0] No stale docs: re-sweep finds zero
  - **Evidence**: re-sweep of skills/hooks/plugins/.pi for always-full per-turn delivery claims: zero matches (only benign mentions, none asserting cadence); no doc contradicts the kill-switch semantics Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All four audit findings addressed and SAD-003 recorded no-change. Evidence: hook-level block (`ENV-REFERENCE.md` §1), README cadence sentence, `.pi` rows, cursor verify-and-note, SAD-003 note (session-less fail-open compatible — no edit).
- [x] CHK-FIX-002 [P0] Discoverability: an operator wanting always-full delivery can find both kill-switches from the canonical block. Evidence: both dedup switches documented in one `ENV-REFERENCE.md` §1 block with identical semantics phrasing.
- [x] CHK-FIX-003 [P0] No runtime doc contradicts the shipped behavior. Evidence: audit + static reads show zero stale assertions (always-full claims) across the four surfaces — `git grep` re-sweep clean.
- [x] CHK-FIX-004 [P1] Docs-only scope proven
  - **Evidence**: zero git diff attributable to this phase on `directive-lifecycle.ts`, shim, plugin, `prompt-advisor.ts`, vitest suites, and the 007 activation folder (their working-tree diffs predate this phase); phase edits confined to ENV-REFERENCE.md, system-skill-advisor/README.md, .pi/extensions/README.md, cursor-hooks-and-spec-gate.md.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Fail-open guarantee stated wherever the lifecycle rule is documented
  - **Evidence**: `ENV-REFERENCE.md` block and README paragraph both state "every uncertain path delivers the full brief (fail-open)"; `.pi` rows note the try/catch fail-open wrapper.
- [x] CHK-031 [P1] No secrets, no new external surface
  - **Evidence**: docs-only; no env values, paths, or endpoints beyond the already-live switch names and defaults; no code, imports, or I/O added Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the doc edits
  - **Evidence**: all four docs report complete; SAD-003 is recorded as no-change and `validate.sh --strict` plus scope audit passed.
- [x] CHK-041 [P1] Docs self-reference the canonical registry
  - **Evidence**: runtime docs state the rule and point at ENV-REFERENCE §1 as the registry of record rather than defining a second contract Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Writes confined to the four named docs and this packet
  - **Evidence**: edit set = ENV-REFERENCE.md, system-skill-advisor/README.md, .pi/extensions/README.md, cursor-hooks-and-spec-gate.md, and this packet; no residue outside the scoped set Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).
- [x] CHK-051 [P1] Scoped diff clean
  - **Evidence**: git status shows the four expected doc edits + this packet; no new diff on runtime code, tests, or the 007 folder beyond the pre-existing 014 feature work Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Pending gate |
|----------|-------|----------|--------------|
| P0 Items | 8 | 8/8 | 0/8 |
| P1 Items | 8 | 8/8 | 0/8 |
| P2 Items | 0 | 0/0 | 0/0 |

**Verification Date**: 2026-08-11; historical gate complete
**Verified By**: AI Assistant (Claude)

<!-- /ANCHOR:summary -->

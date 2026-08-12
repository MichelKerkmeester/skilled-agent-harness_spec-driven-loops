---
title: "Verification Checklist: Directive-Lifecycle Playbook Alignment"
description: "Completed verification evidence for the directive-lifecycle playbook and catalog alignment."
trigger_phrases:
  - "directive lifecycle playbook alignment checklist"
  - "directive lifecycle scenario verification"
  - "directive lifecycle dedup catalog verification"
importance_tier: "normal"
contextType: "general"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/016-directive-playbook-alignment"
    last_updated_at: "2026-08-11T10:10:08Z"
    last_updated_by: "claude"
    recent_action: "Grep, re-sweep, scope, strict-validation, and reconciliation gates completed"
    next_safe_action: "None; historical packet complete"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Directive-Lifecycle Playbook Alignment

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
  - **Evidence**: spec.md `REQ-001..005` (`REQ-001..002` P0: scenario 457 with five per-runtime behaviors + root-index row; `REQ-003..005` P1: catalog entry + both kill-switches, optional 119-C note, docs-only re-sweep).
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md architecture — executable-doc coverage: scenario as discoverable contract, shipped vitest suites as the authoritative automated lane, catalog entry as the feature map.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Scenario 457 exists with the full five-behavior contract
  - **Evidence**: `.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md` — OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES, SOURCE METADATA; per-runtime commands and evidence fragments for first-full, repeat route-only (`Advisor:` present, `Comment hygiene` absent), boundary re-delivery, kill-switch revert (both envs), and session-less fail-open.
- [x] CHK-011 [P1] Follows the playbook/catalog house format
  - **Evidence**: 457 frontmatter (`id`, `version: 3.7.0.1`, `expected_workflow_mode: system-spec-kit`, leaf resources) matches the ux-hooks group format; root-index row follows the `| 457 | UX Hooks | ... |` row format; catalog entry follows the skill_asset_feature_catalog template.
- [x] CHK-012 [P0] Assertions are adapter-boundary observable, not decision reimplementation
  - **Evidence**: scenario asserts on emitted signals (`Advisor:` / `Directives:` / `Comment hygiene` presence) and delegates the decision proof to the shipped suites (DL1-DL6, PL1-PL7, Pi 54); no logic is reimplemented in the scenario.
- [x] CHK-013 [P0] Comment hygiene — no ephemeral ids/spec paths in code comments
  - **Evidence**: docs-only phase; the scenario, index row, catalog entry, and 119-C note are markdown with no code comments; no ADR-/REQ-/CHK-/task-ids or spec paths introduced in any code-adjacent context Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] Five behaviors encoded in 457 (static)
  - **Evidence**: scenario contract + commands cover first-full, repeat route-only, boundary re-delivery, kill-switch revert, fail-open; expected-signals block lists the per-behavior observable fragments Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).
- [x] CHK-021 [P1] Root-index row present and resolvable (static)
  - **Evidence**: `manual-testing-playbook.md` row `| 457 | UX Hooks | Cross-runtime directive-lifecycle dedup |` links scenario 457 to its topical file; scenario file exists at `.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md`.
- [x] CHK-022 [P1] Catalog entry + root row present (static)
  - **Evidence**: `.opencode/skills/system-spec-kit/feature-catalog/ux-hooks/directive-lifecycle-dedup.md` exists; root `feature-catalog.md` row `| Skill advisor | Cross-runtime directive-lifecycle dedup (first-full, boundary re-delivery, route-only repeats, fail-open) | ... |` resolves to the topical file.
- [x] CHK-023 [P1] 119-C lifecycle note present (static)
  - **Evidence**: `ux-hooks/C--comment-hygiene-opencode-plugin.md` lifecycle-note block aligns the injection cadence with the lifecycle rule and references scenario 457.
- [x] CHK-024 [P0] Grep gates run green
  - **Evidence**: scenario 457 encodes first-full, repeat route-only (`Advisor:` present, `Comment hygiene` absent), boundary re-delivery, kill-switch revert (both envs), and session-less fail-open; both kill-switch envs named in scenario + catalog; root-index row 457 and catalog root row resolve bidirectionally to existing files.
- [x] CHK-025 [P0] No stale playbook/catalog assertions: re-sweep finds zero
  - **Evidence**: re-sweep of manual-testing-playbook + feature-catalog for always-full per-turn claims: zero matches; no contradicting kill-switch/boundary semantics Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Missing coverage closed: scenario, index row, catalog entry, and 119-C note all present. Evidence: files and rows listed in `CHK-020`..`CHK-023`.
- [x] CHK-FIX-002 [P0] Per-runtime coverage complete. Evidence: scenario explicitly covers Pi, Claude, Cursor, Devin, Codex, and OpenCode with runtime-specific commands (`shim envelope` + transcript shrink, `plugin transform`, Pi adapter suite).
- [x] CHK-FIX-003 [P0] Both kill-switches discoverable from the scenario and the catalog. Evidence: `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` and `SPECKIT_PI_DIRECTIVE_DEDUP` named in the scenario kill-switch steps, the expected-signals block, and the catalog entry trigger phrases + body.
- [x] CHK-FIX-004 [P1] Docs-only scope proven
  - **Evidence**: zero git diff attributable to this phase on `directive-lifecycle.ts`, shim, plugin, `prompt-advisor.ts`, vitest suites, and the 007 activation folder; phase edits confined to the scenario, index rows, 119-C note, and catalog entry.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Fail-open path is a first-class scenario step
  - **Evidence**: session-less/unknown-session command + expected signal ("NO-SESSION: full block on every turn") in the scenario; failure triage states the guardrail is never silently dropped Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).
- [x] CHK-031 [P1] No secrets, no new external surface
  - **Evidence**: docs-only; scenario commands use local tmp transcripts and existing suite invocations; no credentials, endpoints, or new tooling introduced Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the playbook/catalog items
  - **Evidence**: all historical docs report complete; phase 018 owns hardened evidence classes and `validate.sh --strict` confirms document consistency.
- [x] CHK-041 [P1] Scenario self-documents the authoritative lane
  - **Evidence**: scenario marks the vitest suites as the automated authoritative lane and points at the canonical core + adapters in Failure Triage and SOURCE FILES.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Writes confined to the named playbook/catalog files and this packet
  - **Evidence**: edit set = `ux-hooks/directive-lifecycle-dedup.md`, `manual-testing-playbook.md` (457 row), `ux-hooks/C--comment-hygiene-opencode-plugin.md` (note), `feature-catalog/ux-hooks/directive-lifecycle-dedup.md`, `feature-catalog/feature-catalog.md` (row), and this packet; no residue outside the scoped set.
- [x] CHK-051 [P1] Scoped diff clean
  - **Evidence**: git status shows the five expected playbook/catalog edits + this packet; no new diff on runtime code, tests, or the 007 folder beyond the pre-existing 014 feature work Verified via `validate.sh --strict` (Errors 0) and `git diff --stat` (scope audit).

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

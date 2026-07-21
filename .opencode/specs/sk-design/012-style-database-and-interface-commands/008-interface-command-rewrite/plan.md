---
title: "Implementation Plan: rewrite the /interface:* command bodies into literal design prompts"
description: "Gate the include, extend the two test files, rewrite the five wrappers to the 9-step grammar with a single @-include, and reconcile wrapper/presentation/metadata authority atomically — proven by the command test suite plus an include sentinel."
trigger_phrases:
  - "interface command rewrite plan"
  - "creation-contract include atomic reconcile plan"
  - "literal interface prompt bodies plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 plan for the gap-004 command rewrite."
    next_safe_action: "Sentinel first, then rewrite wrappers and reconcile the package."
    blockers: []
    key_files:
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-gap-plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: rewrite the /interface:* command bodies into literal design prompts

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode command Markdown (prompt templates) + JSON registry + Node ESM tests |
| **Framework** | `node --test` (built-in runner); OpenCode 1.18.4 `@`-include resolver |
| **Storage** | None — command wrappers, presentation/YAML assets, `command-metadata.json` |
| **Testing** | `interface-command-contract.test.mjs`, `design-command-surface-check.test.mjs` (15-test baseline) + an include sentinel |

### Overview

Turn five thin-router command bodies into literal, self-contained design prompts without changing routing, modes, transports, or mutation authority. The shared nine-stage lifecycle is expanded once per body through the native runtime include `@.opencode/skills/sk-design/shared/creation-contract.md`; taste stays in the selected mode; and the wrapper becomes the single normative prompt authority, with the presentation demoted to question/display fixtures. The change is correct iff the two test files stay green (extended) and the include sentinel proves the contract bytes reach the model-visible prompt.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The five corrected body cores (research §7), the canonical include token, the content-ownership matrix, and the four reconcile targets (wrapper/presentation/YAML/metadata) are confirmed and recorded in `spec.md`.
- The current 15-test baseline is green and captured before any edit.

### Definition of Done

- Include sentinel passes: the contract's bytes appear in the model-visible prompt for a wrapper carrying the canonical include.
- Each wrapper carries exactly one canonical include, the literal 9-step grammar, all four statuses, and no command-owned taste.
- Presentation assets are question/display fixtures; `command-metadata.json` mirrors the split; YAML roles unchanged — all in one atomic patch.
- `node --test interface-command-contract.test.mjs design-command-surface-check.test.mjs` green with the extended assertions.
- `validate.sh --strict` on this phase = 0 errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Literal-prompt-with-single-include. Each command body is a full creative/diagnostic prompt in its own right; the one universal fragment (the nine-stage lifecycle + schemas) is pulled in by reference, not copied. This removes the "assemble the prompt from five files" experience while avoiding five-copy schema drift.

### Content Ownership (the split the rewrite enforces)

- **Command (literal):** public mission + stakes, local intake field names, suffix control, sibling/cannot-run distinctions, route proof, ordered outcome criteria, artifact refinement. **Not:** palette/font/timing recipes, reference inventories, universal lifecycle schemas.
- **Shared contract (via include):** progressive-intake classification, assumption ledger, grounding/evidence schemas, common blocks, targeted revision, the four statuses, handoff continuity. **Not:** mode taste or verdicts.
- **Selected mode:** visual/static/temporal/diagnostic/extraction judgment, procedures, evidence interpretation, proof definition. **Not:** public routing or code mutation.
- **Transport:** retrieve/render/measure/capture only. **`sk-code`:** accepted application-code mutation + stack verification.

### Key Components

- **Five wrappers** — `commands/interface/{design,foundations,motion,audit,design-reference}.md`; body rewritten to the 9-step grammar with the `@`-include placed after the authority-split paragraph and before the ordered-outcome sequence.
- **Five presentations** — `commands/interface/assets/interface-<mode>-presentation.txt`; reduced to consolidated-question + display fixtures.
- **`command-metadata.json`** — mirrors the wrapper-normative / presentation-fixture split; route/proof/suffix/mode semantics unchanged.
- **Two test files** — the executable authority; extended with include/status/anti-dup/no-nesting/audit/md-generator assertions.

### Data Flow

At runtime OpenCode expands the wrapper body and resolves the `@`-include from `ctx.worktree`, producing a self-contained prompt = literal command mission + shared lifecycle + (downstream) the selected mode's judgment. The presentation asset feeds the consolidated `:confirm` question and display formatting only; it no longer competes as a prompt authority.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Gate & Scaffold

- [ ] Capture the green 15-test baseline (checker + contract tests) so the post-change delta is attributable.
- [ ] Run an isolated include **sentinel**: a throwaway command carrying only the canonical include; assert the contract's sentinel bytes appear in the model-visible prompt. A contradiction halts here.
- [ ] Extend `interface-command-contract.test.mjs` (include count = 1/body, all four statuses, anti-duplication, no nested public command, audit read-only, md-generator measured-only) and `design-command-surface-check.test.mjs` (frontmatter/suffix/route/sibling/proof projection parity).

### Phase 2: Rewrite & Reconcile (atomic)

- [ ] Rewrite all five wrappers from research §7 in one change — literal mission + local fields + suffix control + route proof + single `@`-include + ordered outcomes + artifact refinement + four statuses. Keep frontmatter, register/lanes, and execution wiring.
- [ ] In the same change: demote the five presentation assets to consolidated-question + display fixtures (invert every PRESENTATION BOUNDARY), and update `command-metadata.json` to mirror the split. YAML assets untouched.

### Phase 3: Verification

- [ ] `node --test interface-command-contract.test.mjs design-command-surface-check.test.mjs` green (baseline 15 + new assertions).
- [ ] Fixtures: five auto, five confirm-wait, ASK/FAIL/DEFER, proof downgrade/blocked, audit no-write, md-generator output/fidelity.
- [ ] `rg` confirms exactly one canonical include per wrapper and zero command-owned taste tables.
- [ ] `validate.sh --strict` on this phase = 0 errors. If any gate fails, whole-change rollback to the 15/15 baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Sentinel | Contract bytes reach the model-visible prompt | isolated command + prompt capture |
| Contract | Include count, four statuses, anti-duplication, no-nesting, audit read-only, md-generator fidelity | `node --test interface-command-contract.test.mjs` |
| Surface | Frontmatter/suffix/route/sibling/proof projection parity | `node --test design-command-surface-check.test.mjs` |
| Fixture | auto/confirm behavior, ASK/FAIL/DEFER, proof downgrade/blocked, audit no-write, md-generator output | deterministic fixtures |
| Manual | one-include-per-wrapper + no-taste token scans | `rg`, `ls` |

The two test files plus the sentinel are the executable contract; grep/listing evidence is corroborating.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode 1.18.4 `@`-include (project-relative from `ctx.worktree`) | External | Green | Without it the shared lifecycle cannot expand once; falls back to a rejected duplication/shell-render path |
| 15-test command baseline on the worktree runtime | Internal | Green | The rollback target and correctness gate; must be captured green first |
| Research §7 corrected body cores | Internal | Green | The authoring base for the five literal bodies |
| `commands/interface/` writable in the worktree | Internal | Green | Rewrite blocked without write access |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 1 (sentinel + tests) **gates** Phase 2: no wrapper is rewritten until the sentinel proves the include reaches the prompt and the extended tests exist to catch regressions.
- Phase 2 is **atomic**: wrapper + presentation + metadata land together; a mixed-authority intermediate is never committed.
- Phase 3 verifies; a failure triggers whole-change rollback (Phase 2 reverts as one unit).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

- **Phase 1** — ~0.5 day (baseline + sentinel + test scaffolding).
- **Phase 2** — ~1 day (five literal bodies from §7 cores + five presentation demotions + metadata mirror, in one patch).
- **Phase 3** — ~0.5 day (fixtures + validate). Total ≈ 2 days. Risk concentrated in authority reconciliation, not volume.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the include sentinel fails, the test suite goes red, a wrapper carries ≠1 include or command-owned taste, or a mixed-authority state is detected.
- **Procedure**: the work is uncommitted in the isolated `0093` worktree; revert the five wrappers, five presentations, `command-metadata.json`, and the two test files with `git restore --source=HEAD --worktree <paths>`; re-run the checker + tests to confirm the 15/15 baseline is back.
- **Blast radius**: Low and reversible. Commands are prompt text; no runtime/data is published; the default surface is unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Whole-change unit**: Phase 2 is the atomic rollback unit — never partially revert (a partial revert re-creates the two-authority state). Restore all four package facets together to the pre-change baseline.
- **Verification of rollback**: `node --test …` returns exactly the pre-change 15/15, and `rg` finds the original Read-imperative wrappers restored. Rollback is complete only when both hold.
<!-- /ANCHOR:enhanced-rollback -->

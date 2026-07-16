---
title: "Implementation Plan: Phase 9: speckit-command-goal-prompt-offer"
description: "Add a shared goal-prompt offer to the four speckit presentation contracts, a goal_prompt_choice field to all 8 workflow YAML assets, mk_goal/mk_goal_status to the relevant router allowed-tools lines, and an INT-3 contract test pinning all of it against drift."
trigger_phrases:
  - "speckit command goal prompt offer plan"
  - "phase 009 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/009-speckit-command-goal-prompt-offer"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored plan from spec.md and handover.md's pre-implementation design"
    next_safe_action: "Start Phase 1 (presentation contract offer text) once this plan is reviewed"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/assets/speckit_plan_presentation.txt"
      - ".opencode/commands/speckit/assets/speckit_plan_auto.yaml"
      - ".opencode/commands/speckit/plan.md"
    session_dedup:
      fingerprint: "sha256:a4e801e6e88aaf262bca47da0bdca9cbea62eb5e18a3e2caf0bf72d8d105b738"
      session_id: "032-remediation-authoring-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: speckit-command-goal-prompt-offer

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command routers + YAML workflow assets + plain-text presentation contracts (`.opencode/commands/speckit/`) |
| **Framework** | OpenCode command/router convention: thin `.md` router (mode selection, `allowed-tools`) delegates to `assets/*_{auto,confirm}.yaml` (execution) and `assets/*_presentation.txt` (all visible prompts/dashboards/results) |
| **Storage** | None new — goal state remains entirely owned by `mk-goal.js` via `mk_goal`/`mk_goal_status`; this phase adds callers, not storage |
| **Testing** | `node --test` `.cjs` contract test, grep-shaped, modeled on `.opencode/plugins/tests/mk-goal-export-contract.test.cjs` |

### Overview
Four command surfaces (`plan`, `complete`, `implement`, `resume`) each already have a documented, consistent three-file structure: router `.md` (mode routing + `allowed-tools`), `assets/*_presentation.txt` (owns all visible prompts/dashboards — confirmed by each file's own header: "This file owns visible prompts, dashboard layout, and final result displays"), and `assets/*_{auto,confirm}.yaml` (execution). The goal-prompt offer is additive within this existing structure: one more line in each presentation contract's already-consolidated setup prompt, one more optional field (`goal_prompt_choice`) in each YAML's existing Auto Resolution Table / setup-input schema, and two more tool names in three routers' existing `allowed-tools` frontmatter line. No new files, no new command, no new workflow steps — the offer rides inside each command's existing single-prompt-then-execute flow.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, sourced from `handover.md` design + dossier INT-1/INT-2/INT-3)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Real file set confirmed live (`ls .opencode/commands/speckit/`, `ls .opencode/commands/speckit/assets/` — 4 routers, 8 YAML assets, 4 presentation files; `goal_opencode.md` confirmed present, `goal.md` confirmed absent)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-007)
- [ ] Offer text consistent across all four presentation contracts
- [ ] `goal_prompt_choice` present in all 8 YAML assets, nowhere else
- [ ] `allowed-tools` lines match REQ-003's exact per-router breakdown
- [ ] INT-3 contract test green on a fresh `node --test` run
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive line/field insertion into three existing, well-separated layers (router frontmatter, YAML setup schema, presentation prompt template) — no new abstraction, no new command, no new workflow step.

### Key Components
- **Presentation contracts** (`speckit_plan_presentation.txt`, `speckit_complete_presentation.txt`, `speckit_implement_presentation.txt`, `speckit_resume_presentation.txt`): each has a `### Consolidated Prompt Template` (or equivalent) fenced block inside `## 1. Startup Presentation`. Gains one shared offer line, worded identically across all four, appended to that block (e.g., a `Q[N]. Session Goal (optional):` line offering to set/suggest a goal, with an explicit "skip is fine" framing consistent with each file's non-blocking design). Each file's own "never split these questions into separate visible prompts" rule is respected — the offer joins the SAME prompt, not a new one.
- **Workflow YAML assets** (all 8: `speckit_{plan,complete,implement,resume}_{auto,confirm}.yaml`): each has an Auto Resolution Table (or equivalent resolved-input schema) and a `PRE-BOUND SETUP ANSWERS`-style block (auto files) or direct question resolution (confirm files). Gains `goal_prompt_choice` with values `offer` (default under `:auto`) / `skip` / `set`, and — only when `set` — an accompanying `goal_objective` text field carrying what to pass to `mk_goal`.
- **Router frontmatter** (`plan.md`, `complete.md`, `implement.md`, `resume.md`): each has one `allowed-tools:` line (confirmed via `grep -n "allowed-tools"`). Gains `mk_goal, mk_goal_status` appended (three routers) or `mk_goal_status` appended (resume.md only) to the existing comma-separated tool list — following the exact style already used for `mcp__mk_spec_memory__*`/`mcp__mk_code_index__*` entries.
- **INT-3 contract test**: a new `.cjs` file under `.opencode/plugins/tests/` (co-located with `mk-goal-export-contract.test.cjs` since that is the only existing precedent for this exact grep-shaped assertion style) that reads each of the 16 affected files (4 presentation + 8 YAML + 4 router `.md`) and asserts: offer text present, `goal_prompt_choice` present, tool names present in the correct routers, and zero occurrences of the stale `goal.md` name.

### Data Flow
Unchanged for any choice other than `set`: `offer`/`skip` never touch `mk_goal`. When `goal_prompt_choice=set` and a `goal_objective` is resolved (from a pre-bound answer under `:auto` or an interactive answer under `:confirm`), the workflow calls `mk_goal({ action: "set", objective: goal_objective })` exactly once, mirroring `goal_opencode.md`'s own `set` dispatch shape. `mk_goal_status` may be called at dashboard-render time to show current goal state, independent of the offer choice.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `speckit_plan_presentation.txt`, `speckit_complete_presentation.txt`, `speckit_implement_presentation.txt`, `speckit_resume_presentation.txt` | Own all visible prompts/dashboards/results per command (confirmed header text in each file) | Update: add one shared, identically-worded goal-prompt offer line to each Consolidated Prompt Template | Contract test greps offer text in all four; manual read-through for wording consistency |
| `speckit_plan_auto.yaml`, `speckit_plan_confirm.yaml`, `speckit_complete_auto.yaml`, `speckit_complete_confirm.yaml`, `speckit_implement_auto.yaml`, `speckit_implement_confirm.yaml`, `speckit_resume_auto.yaml`, `speckit_resume_confirm.yaml` | Own execution + resolved-setup-input schema per command/mode | Update: add `goal_prompt_choice` (+ `goal_objective` when `set`) to each file's setup-input schema | Contract test greps `goal_prompt_choice` in all 8, and confirms it appears NOWHERE else in `.opencode/commands/speckit/` |
| `plan.md`, `complete.md`, `implement.md` (router frontmatter `allowed-tools`) | Owns the router's permitted tool set | Update: append `mk_goal, mk_goal_status` | Contract test greps both names on each of the three routers |
| `resume.md` (router frontmatter `allowed-tools`) | Owns the router's permitted tool set (narrower — no mutation tools today) | Update: append `mk_goal_status` only | Contract test greps `mk_goal_status` present AND `mk_goal` (bare, mutation tool) absent on this router's line |
| Any code path that would call `mk_goal({action:"set"...})` | New — introduced by this phase | Gate strictly behind `goal_prompt_choice=set` | Manual trace + REQ-004 acceptance criterion; contract test cannot fully verify runtime gating (YAML is data, not executed here), so this is confirmed by inspection during implementation and re-confirmed in implementation-summary.md |
| `.opencode/plugins/mk-goal.js` (`mk_goal`/`mk_goal_status` tool implementations) | Owns goal state and tool contracts | Not a consumer — untouched by this phase | No diff in `mk-goal.js` |
| `handover.md` (historical design input) | Pre-implementation design note, contains a stale `.opencode/commands/goal.md` reference at line 95 | Not touched — phase 015 owns that fix | No edits to `handover.md` in this phase |

Required inventories:
- Confirm exact `allowed-tools` lines before editing: `rg -n "allowed-tools" .opencode/commands/speckit/*.md` (already run: 4 hits, one per router, exact current tool lists captured in spec.md grounding).
- Confirm zero pre-existing `goal_prompt_choice`/`mk_goal` references in the speckit surface before adding: `rg -n "goal_prompt_choice|mk_goal" .opencode/commands/speckit/` (expect zero pre-change, confirming INT-1's "zero goal references" finding).
- Confirm no other speckit command exists beyond the four in scope: `ls .opencode/commands/speckit/*.md` (expect exactly `plan.md`, `implement.md`, `complete.md`, `resume.md`, plus `README.txt`).
- Matrix axis: `goal_prompt_choice` × mode (`:auto` vs `:confirm`) × command (4) — 8 combinations total, one per YAML file; each must resolve without requiring user input unless `:confirm` or an ambiguous `set` choice.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline And Inventory
- [ ] Confirm the pre-change zero-hit baseline: `rg -n "goal_prompt_choice|mk_goal" .opencode/commands/speckit/`
- [ ] Confirm the exact current `allowed-tools` line on each of the four routers (captured above; re-verify immediately before editing in case of drift)

### Phase 2: Presentation Contracts (REQ-001)
- [ ] Draft one shared offer line/wording, non-blocking, consistent with each file's existing question-numbering style
- [ ] Insert into `speckit_plan_presentation.txt`'s Consolidated Prompt Template
- [ ] Insert into `speckit_complete_presentation.txt`'s equivalent template
- [ ] Insert into `speckit_implement_presentation.txt`'s equivalent template
- [ ] Insert into `speckit_resume_presentation.txt`'s equivalent template, adapted to resume framing (offer to resume/reference the prior goal rather than only offering a brand-new one)

### Phase 3: Workflow YAML Fields (REQ-002)
- [ ] Add `goal_prompt_choice` (+ `goal_objective` when relevant) to all 8 `speckit_*_{auto,confirm}.yaml` files' setup-input schema, default `offer` under `:auto`

### Phase 4: Router Tool Permissions (REQ-003, REQ-004)
- [ ] Append `mk_goal, mk_goal_status` to `plan.md`, `complete.md`, `implement.md` `allowed-tools`
- [ ] Append `mk_goal_status` (only) to `resume.md` `allowed-tools`
- [ ] Trace and confirm `mk_goal` mutation is gated strictly behind `goal_prompt_choice=set` in every workflow file touched

### Phase 5: Contract Test And Verification (REQ-006)
- [ ] Author the INT-3 contract test modeled on `mk-goal-export-contract.test.cjs`'s file-read + assert pattern, covering all 16 touched files
- [ ] Run `node --test` on the new test file, paste green output
- [ ] Confirm the test fails on a scratch pre-change copy (or via a deliberate temporary mutation) to prove it actually pins the surfaces, then restore
- [ ] Run `validate.sh --strict` on this folder; update implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract (new, INT-3) | Offer text × 4 presentation files, `goal_prompt_choice` × 8 YAML files, `allowed-tools` × 4 routers, stale-name absence | `node --test`, grep-shaped assertions |
| Manual | Wording consistency read-through across all four presentation contracts | Direct read |
| Manual | Trace confirming `mk_goal` set-mutation only fires on `goal_prompt_choice=set` | Direct read of each YAML's resolution logic |
| Regression | Confirm no other speckit workflow behavior changed (spec/plan/tasks step counts, existing fields) | Diff review of each touched YAML against its pre-change version |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mk_goal`/`mk_goal_status` tool availability and contract (`mk-goal.js:1857`, `:1869`) | Internal | Green — confirmed live 2026-07-03 | None expected; this phase only adds callers |
| None from phases 015-021 | N/A | Independent | This phase can proceed regardless of the `mk-goal.js` remediation track's status |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the offer becomes a forced/blocking prompt in `:auto` mode, `mk_goal` mutates state on a non-`set` choice, or the contract test reveals wording/field drift across files
- **Procedure**: revert the touched presentation/YAML/router files via targeted `git checkout` of the pre-phase commit; all edits are additive (new optional field, new offer line, new tool-permission entries), so reverting restores today's exact zero-goal-reference behavior; the new contract test file can simply be deleted if the feature is rolled back
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

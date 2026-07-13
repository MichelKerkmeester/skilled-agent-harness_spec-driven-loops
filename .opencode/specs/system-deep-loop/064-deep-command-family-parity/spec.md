---
title: "Feature Specification: deep command-family parity — uniform workflow-YAML + presentation + create-command conformance across every /deep:* command, plus deep-* agent reconciliation"
description: "Phase parent for bringing the whole /deep:* command family to one uniform shape: every deep command owns a workflow YAML and a separate presentation asset, every command.md stays create-command (sk-doc) conformant, alignment reaches full render-pipeline parity, ai-council ships in fix mode, the two direct-dispatch commands convert to yaml-backed, and the three deep-* agents reconcile to the create-agent standard."
status: in_progress
trigger_phrases:
  - "deep command family parity"
  - "deep command workflow yaml presentation"
  - "create-command conformance deep commands"
  - "deep alignment render pipeline parity"
  - "deep agent create-agent reconciliation"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity"
    last_updated_at: "2026-07-13T14:30:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped all three children (001, 002, 003)"
    next_safe_action: "Operator review and merge of packet 064"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs"
      - ".opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json"
      - ".opencode/commands/deep/assets/deep_alignment_presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-064-deep-command-family-parity"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Force literal uniformity: convert the two intentionally-direct-dispatch commands to yaml-backed too (operator, 2026-07-13)"
      - "Include agent reconciliation: align the three deep-* agents across both runtimes to create-agent (operator, 2026-07-13)"
      - "WS5 default: bless-the-dialect (update create-agent to recognize the deep-loop section dialect) unless operator elects the full restructure at 003 kickoff"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: deep command-family parity — uniform workflow-YAML + presentation + create-command conformance across every /deep:* command, plus deep-* agent reconciliation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-07-13 |
| **Branch** | `wt/0036-deep-command-family-parity` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/064-deep-command-family-parity |
| **Predecessor** | None (new workstream; 059-deep-alignment-mode built the mode, this packet gives the command family render-pipeline + create-command parity) |
| **Successor** | None pre-scoped (CI wiring of `package_skill.py`/drift checks is a plausible follow-on tail) |
| **Handoff Criteria** | All child phases pass `validate.sh --strict`; `validate_document.py --type command` exit 0 on all 8 deep commands; `validate_document.py --type agent` exit 0 on all 6 deep-* agents; `check-contract-drift.cjs` clean for every registered command; the two converted commands' effective `loop-host.cjs` invocation is byte-identical in effect to their prior direct dispatch |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/deep:*` command family is uniform in intent but uneven in shape. All 8 deep `command.md` files already pass `validate_document.py --type command`, but three inconsistencies remain. First, `alignment` runs in `fallback` injection mode with a hand-written placeholder contract, no separate presentation asset, and no registration in `compile-command-contracts.cjs` — so it never exercises the compiled-contract render pipeline its siblings `research`/`review`/`ai-council` do. Second, `ai-council` has a freshly generated contract but is pinned to `fallback`, so its compiled contract is never injected at render time. Third, two commands (`skill-benchmark`, `ai-system-improvement`) are intentionally direct-dispatch: no workflow YAML, presentation inline. The operator has chosen to force literal uniformity across the family rather than preserve those two as a sanctioned exception. Separately, the three deep-* agent files (`deep-alignment`, `deep-review`, `deep-research`, each in `.opencode/agents/` and `.claude/agents/`) pass `validate_document.py --type agent` but carry a shared family dialect that create-agent does not yet formally recognize.

### Purpose
Bring the whole family to one uniform shape: every deep command owns a workflow YAML and a separate presentation asset; every `command.md` stays create-command conformant; `alignment` reaches full render-pipeline parity (real generated contract, `fix` mode, compiler + drift registration); `ai-council` ships in `fix` mode; the two direct-dispatch commands convert to yaml-backed while preserving their HARD-BLOCK dispatch gates and the `ai-system-improvement` self-target fork byte-for-byte in effect; and the deep-* agents reconcile to the create-agent standard. The behavioral surface of the two converted commands must not change — the top risk this packet manages.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Full render-pipeline parity for `/deep:alignment`: author `deep_alignment_presentation.txt`, register `deep/alignment` in `compile-command-contracts.cjs` and `check-contract-drift.cjs`, generate the real compiled contract, flip rollout to `fix`, update the legacy body and `command.md` owned-assets to reference the new presentation.
- `/deep:ai-council` rollout flip `fallback` → `fix` with a verified-fresh compiled contract.
- Conversion of `/deep:skill-benchmark` and `/deep:ai-system-improvement` from direct-dispatch to yaml-backed (author `_auto.yaml` + `_confirm.yaml` wrapping the exact current `loop-host.cjs` invocation, extract a presentation asset, rewire the command.md), preserving every HARD-BLOCK gate and the self-target fork.
- Reconciliation of the six deep-* agent files to the create-agent standard.
- Continued create-command conformance (`validate_document.py --type command` exit 0) on all 8 commands throughout.

### Out of Scope
- Changing any deep command's runtime BEHAVIOR beyond the injection-mode flips — the two conversions must be behavior-preserving (invocation-diff verified), not feature changes.
- Rebuilding the render/compile/drift pipeline scripts themselves — this packet registers new commands into the existing pipeline, it does not redesign it.
- The deep-loop mode packets' internal logic (`deep-alignment/`, `deep-review/`, etc.) — only the command surface, assets, rollout, and agent files are in scope.
- CI wiring of the validators/drift checks — a plausible follow-on, not built here.

### Files to Change
Aggregate file scope across all 3 phases; per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/commands/deep/assets/deep_alignment_presentation.txt` | Create | 001 | 4-section presentation, marker headings matching the compiler registration |
| `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modify | 001 | Register `deep/alignment` (leaf_dispatch, native-only tools) |
| `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` | Modify | 001 | (imports COMMANDS from compiler; verify alignment resolves) |
| `.opencode/commands/deep/assets/compiled/deep_alignment.contract.md` | Regenerate | 001 | Replace hand-written placeholder with the real generated contract |
| `.opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json` | Modify | 001 | `deep/alignment`: `fix`; `deep/ai-council`: `fallback` → `fix` |
| `.opencode/commands/deep/assets/legacy/deep_alignment.body.md` | Modify | 001 | Owned-assets row references the new presentation; drop the fallback note |
| `.opencode/commands/deep/alignment.md` | Modify | 001 | §2 Owned Assets references the new presentation |
| `.opencode/commands/deep/assets/deep_{skill-benchmark,ai-system-improvement}_{auto,confirm}.yaml` | Create | 002 | Yaml wrappers of the exact `loop-host.cjs` dispatch |
| `.opencode/commands/deep/assets/deep_{skill-benchmark,ai-system-improvement}_presentation.txt` | Create | 002 | Extracted 4-section presentations |
| `.opencode/commands/deep/{skill-benchmark,ai-system-improvement}.md` | Modify | 002 | Rewire to yaml-backed; preserve HARD-BLOCK gates + self-target fork |
| `.opencode/agents/{deep-alignment,deep-review,deep-research}.md` + `.claude/agents/*` | Modify | 003 | Reconcile to create-agent (default: bless-the-dialect) |
| `.opencode/skills/sk-doc/create-agent/*` | Modify | 003 | Recognize the deep-loop section dialect (bless-the-dialect path) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-pipeline-command-parity/ | `alignment` full render-pipeline parity (presentation + compiler/drift registration + real contract + `fix` flip + legacy/command owned-assets), and the `ai-council` `fallback` → `fix` flip | Complete |
| 2 | 002-direct-dispatch-to-yaml/ | Convert `skill-benchmark` + `ai-system-improvement` to yaml-backed with extracted presentations, preserving HARD-BLOCK gates and the self-target fork; behavior-preserving | Complete |
| 3 | 003-deep-agent-family-reconciliation/ | Reconcile the six deep-* agent files to create-agent (bless-the-dialect: sanction the deep-loop section dialect + MCP permission keys in create-agent; agents unchanged) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before the next phase begins.
- The two converted commands (phase 002) additionally require an invocation-diff proving the new YAML reproduces the prior `loop-host.cjs` dispatch byte-for-byte in effect.
- Parent spec tracks aggregate progress via this map.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-pipeline-command-parity | 002-direct-dispatch-to-yaml | alignment contract generated + fresh; ai-council fresh in `fix`; all 4 registered commands drift-clean; all 8 commands `--type command` exit 0 | `check-contract-drift.cjs`, `validate_document.py`, `validate.sh --strict` |
| 002-direct-dispatch-to-yaml | 003-deep-agent-family-reconciliation | both conversions behavior-identical (invocation-diff); HARD-BLOCK gates + self-target fork intact; all 8 commands `--type command` exit 0 | invocation-diff, gate-presence grep, `validate.sh --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None at the parent level. The two scope decisions (force literal uniformity; include agent reconciliation) are operator-locked. The one execution-time choice — WS5 bless-the-dialect vs. full agent restructure — defaults to bless-the-dialect and is confirmed with the operator at phase 003 kickoff.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Authoritative plan**: `~/.claude/plans/dynamic-herding-thompson.md`

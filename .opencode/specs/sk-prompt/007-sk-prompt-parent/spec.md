---
title: "Feature Specification: Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models"
description: "Phase parent for Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models"
trigger_phrases:
  - "007-sk-prompt-parent"
  - "phase parent"
  - "sk-prompt parent hub"
  - "merge sk-prompt sk-prompt-models"
  - "prompt-improve prompt-models"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent"
    last_updated_at: "2026-07-09T18:15:00Z"
    last_updated_by: "claude"
    recent_action: "All 8 phases complete; terminal gates PASS clean"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/commands/prompt-improve.md"
      - ".opencode/commands/deep/model-benchmark.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-sk-prompt-parent-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "prompt-improve's manual_testing_playbook stays packet-local (ADR-004)"
      - "sk-prompt-models version metadata normalized to 0.9.0.0 pre-fold; hub SKILL.md started at 1.0.0.0 (ADR-004)"
      - "routingClass stays metadata for both modes; no lexical carve-out — resolved by phase 007's router-mode benchmark, PASS 100/100"
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

# Feature Specification: Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-prompt/007-sk-prompt-parent |
| **Predecessor** | sk-prompt/006-sk-prompt-models-rename (renamed sk-prompt-models to its current name; this program folds the renamed skill into the sk-prompt hub) |
| **Successor** | None (a follow-on canon-hardening tail is expected, per the sk-code/sk-doc precedent, but is not pre-scoped here) |
| **Handoff Criteria** | `parent-skill-check.cjs .opencode/skills/sk-prompt` passes STRICT (checks 1-9, 0 warnings) and `validate.sh --recursive --strict` passes on this whole track |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-prompt` (active prompt-improvement engine: 7 frameworks, DEPTH thinking, CLEAR scoring) and `sk-prompt-models` (read-only small-model prompt-craft profile lookup for DeepSeek/Kimi/MiniMax/MiMo/GLM) are two flat, independently advisor-routable skills that already narrate their own boundary against each other in prose — each README explains how it differs from the other — but have no structural relationship: no shared registry, no advisor graph edge, tagged only by a common `family: sk-util`. This split-but-coupled shape is exactly what this repo's "parent hub with nested mode packets" canon exists to fix, and has already been applied to `sk-code`, `sk-design`, `system-deep-loop`, and `sk-doc` itself.

### Purpose
Fold both skills into one hub, `sk-prompt`, with two workflow-kind modes — `prompt-improve` (today's sk-prompt) and `prompt-models` (today's sk-prompt-models) — following the same doctrine, templates (`sk-doc/create-skill/assets/parent_skill/*`), and validation gates (`parent-skill-check.cjs`, `validate.sh --strict`) used for the three existing canonical hubs. This phased decomposition tracks that fold-in across independently executable child phase folders, mirroring `sk-code`'s original 9-phase fold-in arc (the closest precedent — also a two-independent-skill merge) trimmed by one phase since no new mode content needs authoring from scratch, only relocation of two already-complete skills.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Folding `sk-prompt` and `sk-prompt-models` into one parent hub `sk-prompt` with two `packetKind: "workflow"` modes (`prompt-improve`, `prompt-models`), zero extensions (no surface-axis, no runtime-loop, no transport-axis) — mirroring `sk-doc`'s own pure two-tier core shape.
- Full `git mv` rename of both trees so `folder == packetSkillName == workflowMode` holds exactly for both packets (operator-selected option, overriding the lower-blast-radius alternative).
- Renaming `/prompt` to `/prompt-improve`; `prompt-models` gets no command (matches its current zero-command, advisor-only routing).
- Identity dissolution: deleting `sk-prompt-models/graph-metadata.json` while folding its `enhances → cli-opencode` edge and domain/intent-signal content into the hub's single surviving `graph-metadata.json`.
- Repointing every live referrer discovered during research (hardcoded functional paths, `/deep:model-benchmark`'s write-target automation, advisor corpus rows, cross-skill doc references, the CI card-sync gate).
- Root purpose and child phase manifest for this decomposition; per-phase implementation detail lives in each child folder.

### Out of Scope
- Detailed per-phase implementation plans (live in child `plan.md`/`tasks.md`).
- Any redesign of `sk-prompt`'s 7-framework/DEPTH/CLEAR internals or `sk-prompt-models`' per-model profile content — this program relocates and re-registers existing behavior, it does not change it.
- Follow-on canon-hardening beyond the 8-phase core arc (expected as a later, separately-numbered tail, per the `sk-code`/`sk-doc` precedent).

### Files to Change
Summary of aggregate file scope; per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-prompt/{mode-registry,hub-router,description}.json` | Create | 003 | New hub routing files |
| `.opencode/skills/sk-prompt/SKILL.md` | Rewrite | 003 | Thin routing-only hub SKILL.md |
| `.opencode/skills/sk-prompt/*` (51 files) → `sk-prompt/prompt-improve/*` | Move | 004 | Relocate today's sk-prompt content |
| `.opencode/skills/sk-prompt-models/*` (2,616 files) → `sk-prompt/prompt-models/*` | Move | 005 | Relocate today's sk-prompt-models content, incl. the live `benchmarks/` write target |
| `.opencode/commands/prompt.md` → `.opencode/commands/prompt-improve.md` | Move | 004 | Command rebinding |
| `.opencode/skills/system-skill-advisor/mcp_server/{lib/scorer/executor-delegation.ts,scripts/skill_advisor.py}` | Modify | 005 | Hardcoded `model_profiles.json` path joins |
| `.opencode/commands/deep/model-benchmark.md` + `assets/deep_model-benchmark_{auto,confirm}.yaml` | Modify | 005 | Live write-target path repoint (bundled with the directory move) |
| `.opencode/skills/{cli-opencode,system-deep-loop,sk-code,sk-doc}/*` + `AGENTS.md`/`README.md`/install guides | Modify | 006 | Documentation/graph-edge referrer sweep (~50 files) |
| `.opencode/skills/sk-prompt/benchmark/router-final/*` | Create | 007 | Lane-C skill-benchmark output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research-and-context/ | Research gate (no writes): deep-research + deep-context over both skills' current state and the full referrer set; pull forward the 121 rename program as prior art | Complete |
| 2 | 002-architecture-decision/ | Decision gate: freeze the `mode-registry.json`/`hub-router.json` target shape, version-bump strategy, and manual-testing-playbook ownership call | Complete |
| 3 | 003-scaffold-hub/ | Additive-only hub skeleton: `mode-registry.json`, `hub-router.json`, `description.json`, thin routing `SKILL.md`, empty packet dirs — zero content moved | Complete |
| 4 | 004-onboard-prompt-improve/ | `git mv` sk-prompt's 51 files into `prompt-improve/`; rename `/prompt` → `/prompt-improve` | Complete |
| 5 | 005-foldin-prompt-models/ | `git mv` the full sk-prompt-models tree into `prompt-models/`; delete its `graph-metadata.json`; bundle the hardcoded write-target path repoints in the same atomic change | Complete |
| 6 | 006-advisor-and-integration/ | Sweep remaining ~50 documentation/prose referrers; regenerate `skill-graph.json`; exercise the CI card-sync gate | Complete |
| 7 | 007-routing-benchmark-and-review/ | Lane-C skill-benchmark against the new hub; independent deep-review pass over the full diff | Complete |
| 8 | 008-cutover-and-rollout/ | `parent-skill-check.cjs` STRICT (0 warnings); `validate.sh --recursive --strict`; final stale-reference grep sweep; parent rollup | Complete |
| 9 | 009-prompt-command-canon-refactor/ | Refactor `/prompt:improve` into the create-command canon: thin router with Phase 0 dispatch-context check, auto/confirm workflow-YAML triad, and presentation asset (behavior-preserving) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research-and-context | 002-architecture-decision | Research + context artifacts complete; referrer inventory verified against a fresh grep, not assumed from planning notes | Human review (research gate stops here) |
| 002-architecture-decision | 003-scaffold-hub | `decision-record.md` accepted; frozen `mode-registry.json`/`hub-router.json` target shape recorded as an appendix | Human approval required |
| 003-scaffold-hub | 004-onboard-prompt-improve | Hub skeleton exists; zero content relocated yet | `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=0` shows structural checks passing, empty-packet warnings acceptable |
| 004-onboard-prompt-improve | 005-foldin-prompt-models | sk-prompt content relocated; `/prompt-improve` resolves | Functional smoke test: run `/prompt-improve` end-to-end |
| 005-foldin-prompt-models | 006-advisor-and-integration | sk-prompt-models content relocated; exactly one `graph-metadata.json` under `sk-prompt/`; hardcoded write-target paths repointed in the same change | `cli-opencode` can resolve a small-model profile path; `/deep:model-benchmark` write target exists |
| 006-advisor-and-integration | 007-routing-benchmark-and-review | Referrer sweep complete; `grep -rl "sk-prompt-models"` returns zero hits outside `sk-prompt/` and historical spec/changelog text | Re-run the grep sweep |
| 007-routing-benchmark-and-review | 008-cutover-and-rollout | Lane-C benchmark report generated; deep-review findings resolved or explicitly deferred | Benchmark report + review sign-off |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

All three questions below were resolved during execution; kept here for the historical record.

- ~~Should `prompt-improve`'s 7-category `manual_testing_playbook/` fold up to hub level or stay packet-local?~~ **Resolved (phase 002, ADR-004): stays packet-local.**
- ~~Version-bump strategy for `sk-prompt-models`' three disagreeing version numbers?~~ **Resolved (phase 002, ADR-004): normalized to 0.9.0.0 pre-fold; hub `SKILL.md` started at 1.0.0.0.**
- ~~Does the hub's `routingClass` stay `"metadata"` for both modes, or does `prompt-models` need a lexical carve-out?~~ **Resolved (phase 007, empirical benchmark): `routingClass: "metadata"` holds for both modes — PASS 100/100 after fixing a router-weight imbalance, no carve-out needed.**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

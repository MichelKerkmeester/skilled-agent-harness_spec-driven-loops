---
title: "Feature Specification: Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code"
description: "Phase parent for Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code"
trigger_phrases:
  - "125-cli-external-parent"
  - "phase parent"
  - "cli-external parent hub"
  - "merge cli-opencode cli-claude-code"
  - "cli dispatch hub"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent"
    last_updated_at: "2026-07-10T05:03:42Z"
    last_updated_by: "claude"
    recent_action: "Marked phase 001 read-only explicitly in phase map (WS-B R5)"
    next_safe_action: "Execute phase 001 research gate"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/SKILL.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "125-cli-external-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the shared dispatch-preflight hook script lifts to hub root cli-external/scripts/ (ADR-002 sub-decision, owned by phase 002/003)"
    answered_questions:
      - "Both modes are packetKind workflow (they orchestrate; dispatched CLI writes land in this repo), zero extensions"
      - "Hub family is cli, so the delegation scorer must be rewritten to source its alias table from the hub mode-registry (ADR-005)"
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

# Feature Specification: Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/125-cli-external-parent |
| **Predecessor** | skilled-agent-orchestration/124-sk-prompt-parent (the sibling prompt-hub program whose fold-in arc, doctrine, and validation gates this program mirrors) |
| **Successor** | None (a follow-on canon-hardening tail is expected, per the sk-code/sk-doc/sk-prompt precedent, but is not pre-scoped here) |
| **Handoff Criteria** | `parent-skill-check.cjs .opencode/skills/cli-external` passes STRICT (checks 1-9, 0 warnings), the executor-delegation parity fixtures re-baseline green, and `validate.sh --recursive --strict` passes on this whole track |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-opencode` (full-runtime OpenCode dispatch orchestrator: external dispatch, parallel detached sessions, cross-AI handback) and `cli-claude-code` (Anthropic-backed reasoning, edits, reviews, and structured cross-AI handoff) are two flat, independently advisor-routable skills that already narrate their sibling boundary against each other in prose — each README explains how it differs from the other — but have no structural relationship: no shared registry, no advisor graph parent edge, tagged only by a common `family: cli`. This split-but-coupled shape is exactly what this repo's "parent hub with nested mode packets" canon exists to fix, and has already been applied to `sk-code`, `sk-design`, `system-deep-loop`, `sk-doc`, and `sk-prompt`.

### Purpose
Fold both skills into one hub, `cli-external`, with two workflow-kind modes — `cli-opencode` (today's cli-opencode) and `cli-claude-code` (today's cli-claude-code) — following the same doctrine, templates, and validation gates used for the existing canonical hubs. Because the hub inherits `family: cli`, the delegation scorer that today builds its executor alias table from a top-level `family === 'cli'` filter must be rewritten to source that table from the hub's mode-registry, so runtime dispatch continues to resolve after the two leaf skills stop existing as top-level identities. This phased decomposition tracks that fold-in and the paired scorer rewrite across independently executable child phase folders.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Folding `cli-opencode` and `cli-claude-code` into one parent hub `cli-external` with two `packetKind: "workflow"` modes (`cli-opencode`, `cli-claude-code`), zero extensions (no surface-axis, no runtime-loop, no transport-axis) — mirroring the pure two-tier core shape sk-doc and sk-prompt already use.
- Full `git mv` rename of both trees so `folder == packetSkillName == workflowMode` holds exactly for both packets, with `grandfatheredFolderMismatch: false` on both.
- Identity dissolution: deleting both children's `graph-metadata.json` and authoring one hub `graph-metadata.json` (`skill_id: cli-external`, `family: cli`) that folds the union of both children's intent-signals, trigger-phrases, and edges; the hub also gets a new `description.json` (neither child has one today).
- Rewriting the executor-delegation scorer so its alias table sources from the hub mode-registry rather than the top-level `family === 'cli'` filter, while still resolving to the executor-kind strings downstream config expects (the load-bearing change, gated in the same atomic change as the identity dissolution).
- Repointing every live referrer discovered during research: the hardcoded functional paths (the PreToolUse dispatch hook, the advisor scorer and Python alias maps, the parity fixtures, the card-sync CI script and its `.github/workflows/prompt-card-sync.yml` wiring, the outsourced-agent-handback vitest), the internal outbound relative cross-skill paths inside both trees (which break silently when nested one dir deeper and cannot be caught by an old-flat-path grep), the constitutional cli-dispatch preload path template, and the reciprocal advisor graph edges.
- No commands: neither skill has a bound `/` command today, and none is created; the hub stays outside checker 3k's command coverage (accepted gap, same as sk-prompt).
- Root purpose and child phase manifest for this decomposition; per-phase implementation detail lives in each child folder.

### Out of Scope
- Detailed per-phase implementation plans (live in child `plan.md`/`tasks.md`).
- Any redesign of either skill's dispatch behavior, self-invocation guards, prompt-craft rules, or provider handling — this program relocates and re-registers existing behavior and rewires the scorer's source-of-truth, it does not change dispatch semantics.
- Renaming provider or model references inside either skill (a concurrent, unrelated change owns those); this program is about file relocation, referrer repointing, and the scorer redesign only.
- Follow-on canon-hardening beyond the 8-phase core arc (expected as a later, separately-numbered tail, per the `sk-code`/`sk-doc`/`sk-prompt` precedent).

### Files to Change
Summary of aggregate file scope; per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/cli-external/{mode-registry,hub-router,description,graph-metadata}.json` | Create | 003 | New hub routing, descriptor, and single graph identity files |
| `.opencode/skills/cli-external/SKILL.md` | Create | 003 | Thin routing-only hub SKILL.md starting at version 1.0.0.0 |
| `.opencode/skills/cli-opencode/*` (~70 files) → `cli-external/cli-opencode/*` | Move | 004 | Relocate cli-opencode incl. the shared dispatch hook; rewrite its ~54 internal outbound relative cross-skill paths (now one dir deeper) |
| `.claude/settings.json` + `cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` | Modify | 004 | Repoint the fail-open PreToolUse hook path and make its registry hub-aware, atomic with the cli-opencode move; cli-claude-code's entry finalizes in 005 |
| `.opencode/skills/cli-claude-code/*` (~50 files) → `cli-external/cli-claude-code/*` | Move | 005 | Relocate cli-claude-code (rewriting its ~13 internal outbound relative paths) in the atomic scorer-rewrite change |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` (+ compiled dist) | Modify | 005 | Rewrite the alias-table source from the family filter to the hub mode-registry |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json` | Modify | 005 | Re-baseline the 11 cases (6 cli-opencode, 2 cli-claude-code, 2 sk-code, 1 none), preserving the negatives and asserting no scenario resolves to cli-external |
| `check-prompt-quality-card-sync.sh` (per-skill paths) | Modify | 004, 005 | Repoint each skill's card path in the SAME commit as its move to avoid a red-CI window on `.github/workflows/prompt-card-sync.yml` |
| `system-skill-advisor/mcp_server/scripts/skill_advisor.py` + `outsourced-agent-handback-docs.vitest.ts` | Modify | 006 | Repoint the hardcoded advisor alias maps and the vitest's flat cli SKILL.md / prompt_templates paths |
| `CLAUDE.md` / `AGENTS.md` / `cli-dispatch-skill-preload.md` + graph-edge referrers | Modify | 006 | Repoint the constitutional path template and reciprocal advisor edges (~sweep) |
| `.opencode/skills/cli-external/benchmark/router-final/*` | Create | 007 | Lane-C skill-benchmark output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research-and-context/ | **Read-only research gate (no writes)**: verify both skills' current state and the full referrer set, classify each referrer as functional / constitutional / logical-name / internal-outbound-path, and pull forward the 124 fold-in as prior art | Pending |
| 2 | 002-architecture-decision/ | Decision gate: freeze the five ADRs, including the load-bearing scorer-rewrite decision, and the target `mode-registry.json`/`hub-router.json`/`graph-metadata.json` shapes | Pending |
| 3 | 003-scaffold-hub/ | Additive-only hub skeleton: registry, router, description, single hub graph identity, thin routing `SKILL.md`, empty packet dirs — zero content moved | Pending |
| 4 | 004-onboard-cli-opencode/ | `git mv` cli-opencode's ~70 files into `cli-opencode/`; rewrite its ~54 internal outbound relative cross-skill paths; repoint the fail-open PreToolUse hook path and the card-sync script's cli-opencode path atomic with the move | Pending |
| 5 | 005-foldin-cli-claude-code/ | `git mv` cli-claude-code's ~50 files into `cli-claude-code/` (rewriting its ~13 relative paths + card-sync cli-claude-code path); dissolve both graph identities into one; rewrite the executor-delegation scorer and re-baseline its 11-case parity fixtures — one atomic change | Pending |
| 6 | 006-advisor-and-integration/ | Sweep remaining documentation/prose referrers; repoint the Python alias maps, the handback vitest, constitutional path template, and reciprocal graph edges; regenerate `skill-graph.json`; verify the CI card-sync gate | Pending |
| 7 | 007-routing-benchmark-and-review/ | Lane-C skill-benchmark against the new hub plus a live delegation-routing re-baseline; independent deep-review pass over the full diff | Pending |
| 8 | 008-cutover-and-rollout/ | `parent-skill-check.cjs` STRICT (0 warnings); `validate.sh --recursive --strict`; active fail-open hook trigger test; final stale-reference grep sweep; parent rollup | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research-and-context | 002-architecture-decision | Referrer inventory verified against a fresh grep, not assumed; each referrer tagged functional / constitutional / logical-name so later phases repoint paths without over-repointing stable executor-kind strings | Human review (research gate stops here) |
| 002-architecture-decision | 003-scaffold-hub | `decision-record.md` accepted; the five ADRs and the frozen registry/router/graph target shapes recorded | Human approval required |
| 003-scaffold-hub | 004-onboard-cli-opencode | Hub skeleton exists; zero content relocated yet | `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=0` shows structural checks passing, empty-packet warnings acceptable |
| 004-onboard-cli-opencode | 005-foldin-cli-claude-code | cli-opencode content relocated; the PreToolUse dispatch hook resolves and lints from its new hub-aware path | Functional smoke: trigger a dispatch-rule lint and confirm it fires |
| 005-foldin-cli-claude-code | 006-advisor-and-integration | cli-claude-code content relocated; exactly one `graph-metadata.json` under `cli-external/`; the rewritten scorer resolves both executor kinds; parity fixtures green | `executor-delegation.vitest.ts` passes; a delegation prompt resolves the right executor |
| 006-advisor-and-integration | 007-routing-benchmark-and-review | Referrer sweep complete; `grep -rl` for the old flat paths returns zero live hits outside `cli-external/` and historical spec/changelog text | Re-run the grep sweep |
| 007-routing-benchmark-and-review | 008-cutover-and-rollout | Lane-C benchmark report generated; delegation-routing re-baseline green; deep-review findings resolved or explicitly deferred | Benchmark report + review sign-off |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the shared `scripts/` tree (the dispatch-preflight hook that lints BOTH binaries but physically lives in cli-opencode today) lift to hub root `cli-external/scripts/`, or stay under the `cli-opencode/` packet? Owned by phase 002's ADR-002 sub-decision and phase 003/004 execution.
- Does the hub's `routingClass` stay `"metadata"` for both modes, or does either mode need a lexical carve-out to preserve today's advisor routing accuracy for delegation queries? Empirical question, owned by phase 007's benchmark, not pre-decided here.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

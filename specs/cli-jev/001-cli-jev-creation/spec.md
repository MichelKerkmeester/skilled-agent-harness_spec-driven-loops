---
title: "Feature Specification: cli-jev creation: add Jev as the eighth cli-external-orchestration mode, a transport packet that bridges the jev CLI and its judgment contract"
description: "cli-jev joins the hub as its first packetKind transport: a pinned contract for the jev judgment CLI, a skill packet, registration on every routing surface and executable dispatch wiring, plus a catalog and a 22-scenario playbook."
trigger_phrases:
  - "cli-jev creation"
  - "jev transport mode"
  - "typesafe jev judgment"
  - "cli-external-orchestration eighth mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/001-cli-jev-creation"
    last_updated_at: "2026-09-20T11:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phases 001 to 004 complete; phase 005 authored the parent closeout metadata"
    next_safe_action: "Run the recursive strict validation and report the operator's open steps"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/mode-registry.json"
      - ".skilled/skills/cli-external-orchestration/cli-jev/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-001-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is jev an executor? No: it returns one typed judgment and runs nothing, so it registers as a transport, not a deep-loop ExecutorKind"
      - "Can the LLM Gateway key front jev through --provider custom? Not without a translating proxy; the native System One contract is not chat completions"
      - "Does the authenticated surface hold? Yes: an operator-stored official key closed the two credentialed scenarios with observed output, and the key lives outside this repository"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: cli-jev creation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 phased packet |
| **Priority** | P1 |
| **Status** | In Progress — phases 001 to 004 Complete; phase 005 carries the closeout |
| **Created** | 2026-09-20 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | cli-jev/001-cli-jev-creation |
| **Predecessor** | `071-cli-hermes-creation` (structural precedent: the most recent hub-mode creation packet, phased the same way) |
| **Successor** | None |
| **Handoff Criteria** | Phase 001 pins the jev contract live and tags every claim source-read or live-verified; phase 002 ships a packet whose declared hard rules phase 003 implements as a bijection; phase 003 registers the mode on every routing surface and refreshes the compiled-serving manifest; phase 004's catalog and playbook pass both package validators; phase 005 reconciles the parent metadata and the recursive strict gate prints PASSED. A mode without a working `jev` binary is never routable, and the seven existing modes are untouched. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-external-orchestration` routes to seven external CLI executor modes, and every one of them conducts a session that writes into this repository. The `jev` CLI answers a different kind of request: it reads a state and a question and returns one typed value — a probability, a chosen key, a position — and writes nothing. That is neither an executor nor an evidence-only read: it is a decision the caller acts on. The hub had no class for it, so a caller who wanted a judgment had no routed mode to name, no pinned contract to read, and no rule that stopped a dispatch sending a task to something that cannot run one.

The gaps were concrete. `mode-registry.json` admitted only `packetKind: "workflow"` modes with `mutatesWorkspace: true`, and the hub compiler rejected anything else with "not a CLI workflow actor". `hub-router.json`, `ROUTER.md`, `leaf-manifest.json`, `description.json` and `graph-metadata.json` had no signal, no vocabulary class, no leaf set and no intent row for a judgment tool. The dispatch audit did not recognize a `jev` command, so no rule could ever fire, and the compiled-routing served manifest would go stale the moment the registry changed.

### Purpose
Add `cli-jev` as the hub's eighth mode and its first `packetKind: "transport"`, declared through a `transport-axis` extension, in five phases that each validate independently: a live contract pin, the skill packet, the registration plus executable wiring, the catalog and playbook, and the governance closeout. The outcome is one routable mode that returns a typed judgment, a dispatch guard that refuses the commands it declares, and a seven-mode workflow set whose behavior does not change.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A live contract pin of `jev` 0.6.2: install through `uv tool install jev-cli`, probe the six subcommands, the shared flags (including the suppressed `--endpoint`), the three state forms, the exit-code taxonomy, the four providers, the answer paths and the `jev-mcp` stdio surface, with every claim tagged source-read or live-verified — **phase 001**.
- The `cli-jev` skill packet built with `sk-create-skill`: `SKILL.md` with eight declared hard rules and their implemented checks, four references, a question-shaping asset, README, changelog, benchmark baseline and playbook root — **phase 002**.
- Registration on every routing surface (`mode-registry.json` with the entry, the `transport-axis` extension and the discriminator prose; `hub-router.json`; `ROUTER.md`; hub `SKILL.md`; `README.md`; `description.json`; `graph-metadata.json`; `leaf-manifest.json`; the hub changelog) plus the executable wiring: the dispatch audit shape, the eight rule checks with fixtures, the compiled-routing harness source list and canary, the refreshed activation manifest and the regenerated trigger index — **phase 003**.
- A feature catalog built with `sk-create-feature-catalog` and a manual-testing playbook built with `sk-create-manual-testing-playbook`, with the scenarios the pin left executable executed and recorded — **phase 004**.
- Roster mentions, the parent's completion metadata, recursive strict validation and continuity save — **phase 005**.

### Out of Scope
- A deep-loop `ExecutorKind` — jev has no file tools, no iteration model and no stop policy, so it cannot run a lineage.
- Any `jev-mcp` entry in this repository's MCP configs — the CLI is the dispatch surface, and wiring a host is documented as an operator-optional step.
- Behavior, contracts, rules or routing of the seven existing workflow modes; `tieBreak` keeps their order and appends the transport.
- Edits inside `001-cli-jev-creation/context/jev-cli-main/` — it is the read-only evidence base for the pin.
- Any new alias that could catch non-Jev traffic; every alias is replayed against an out-of-domain phrase before it ships.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin/**` | Create | 001 | Source map, live pin and probe matrix |
| `.skilled/skills/cli-external-orchestration/cli-jev/**` | Create | 002 | Skill packet: SKILL.md, README, references, assets, changelog, benchmark |
| `.skilled/skills/cli-external-orchestration/{mode-registry.json,hub-router.json,ROUTER.md,SKILL.md,README.md,description.json,graph-metadata.json,leaf-manifest.json,changelog/v1.6.0.0.md}` | Modify | 003 | Register the eighth mode and its transport axis |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and its suite; `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` and its fixtures | Modify | 003 | Dispatch shape plus the eight implemented checks |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs`, `.../fixtures/canary-cases.v1.json`, `013-live-activation/activation/cli-external-orchestration/manifest.json` | Modify | 003 | Source list, canary cases, refreshed manifest |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Modify | 003, 005 | Regenerated after the packet and spec docs land |
| `cli-jev/feature-catalog/**`, `cli-jev/manual-testing-playbook/**` | Create | 004 | Catalog and the 22-scenario playbook |
| `.skilled/agents/orchestrate.md`, `.skilled/agents/prompt-improver.md`, `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`, `.skilled/skills/cli-external-orchestration/feature-catalog/**` | Modify | 005 | Roster mentions and the hub catalog's falsified "zero extension axes" claims |
| `001-cli-jev-creation/spec.md`, `goal.md`, `005-docs-governance-and-closeout/**` | Modify | 005 | Parent completion metadata and the closeout phase's docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-jev-contract-research-and-pin/` | Source map of the vendored tree, the live install and probe matrix, the provider-reachability question, and the exit-code taxonomy with its negative controls | Complete 2026-09-20 — every claim tagged source-read or live-verified; `validate.sh --strict` PASSED |
| 2 | `002-cli-jev-skill-packet/` | The packet built with `sk-create-skill`: eight hard rules, four references, the question-shaping asset, README, changelog, benchmark baseline, playbook root | Complete 2026-09-20 — hub gate green; declared checks implemented in phase 003 |
| 3 | `003-hub-mode-registration/` | The registry entry and `transport-axis`, all routing surfaces, the dispatch audit shape, the eight implemented checks with fixtures, the compiled-routing harness and the refreshed activation manifest | Complete 2026-09-20 — `parent-skill-check` 0 failures at 8 modes, both routing stages replayed, manifest `fresh: true` |
| 4 | `004-catalog-and-playbook/` | Feature catalog with implementation anchors and a 22-scenario playbook, 20 scenarios executed without a credential and 2 recorded as skips | Complete 2026-09-20 — both package validators PASS at 0 violations |
| 5 | `005-docs-governance-and-closeout/` | Roster mentions, the parent's completion metadata, the hub catalog's falsified axis claims, recursive strict validation, trigger-index refresh and continuity save | In Progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` on its own folder before the next phase is treated as complete.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase, and run `validate.sh --recursive` on the parent to validate the packet as an integrated unit.
- A code-read claim from phase 001 may not be restated as confirmed until the pin records it; the two authenticated scenarios stay SKIP until an operator credential exists.
- No phase may invent a hard-rule check id that phase 002 did not declare, and phase 003 must implement every one it declares; the bijection test fails in both directions.
- Every routing surface is checked for a working `jev` binary before it advertises the route, and an absent binary never becomes routable.
- The hub stays the single advisor identity: no packet-local `description.json` and no packet-local `graph-metadata.json`.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 001 | 002 | The contract is pinned with every claim tagged, and the exit-code matrix carries a live negative control | `scratch/probe-matrix.txt` and `scratch/probe-surface.txt`; `validate.sh --strict` on 001 |
| 002 | 003 | The packet's declared check ids are exactly the set phase 003 will implement, and the packet passes the hub gate | `parent-skill-check` on the hub path; `SKILL.md` hard-rule inventory |
| 003 | 004 | Registration is green on every surface and both routing stages replay the new mode without breaking the seven | `compiled-route.cjs` replays, `compiled-route-manifest.cjs freshness`, both dispatch suites |
| 004 | 005 | Catalog and playbook pass their package validators, and every unexecuted scenario names its blocker | `validate_catalog_package.py`, `validate-playbook-package.cjs`, the run report |
| 005 | — | Parent and children validate recursively and the operator steps are named rather than silently skipped | `validate.sh --recursive --strict` → `RESULT: PASSED` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **The provider credential.** No `TYPESAFE_API_KEY`, `AI_GATEWAY_API_KEY`, `OPENROUTER_API_KEY` or `JEV_API_KEY` existed at close, so every authenticated playbook scenario was SKIP with that blocker. The operator then supplied an `official` key, and the authenticated verification records both scenarios as PASS with observed output; the key is stored on the operator's machine, outside this repository.
- **The gateway key as a Jev front.** The operator's LLM Gateway credential cannot front jev through `--provider custom` without a translating proxy: the request and response are the native System One contract rather than chat completions. No proxy was built or probed, and the packet does not claim one exists.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md and acceptance-criteria.md
- **Parent Spec**: None (top-level packet)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Evidence base**: `context/jev-cli-main/` (read-only vendored tree) and phase 001's `scratch/` transcripts

---
title: "Feature Specification: cli-hermes creation"
description: "Coordinate the phased integration of Hermes Agent (Nous Research's open-source, Python-based agent CLI, installed at ~/.hermes) into cli-external-orchestration as the seventh runtime: a deep-research phase first, then, once the operator confirms the findings, dedicated phases for executor support, the cli-hermes skill packet, the repo-root .hermes folder, agent/command/skill/MCP/hook bridges, model routing, playbook and governance closeout."
trigger_phrases:
  - "cli-hermes creation"
  - "hermes agent integration"
  - "hermes cli executor"
  - "nous research hermes"
  - "seventh cli runtime"
  - ".hermes folder"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/containment/quarantine/content/specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/deepseek/containment/baseline/specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/containment/baseline/specs/cli-external-orchestration/071-cli-hermes-creation"
    last_updated_at: "2026-09-14T18:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Packet scaffolded as a phase parent with nested goal.md; phase 001 deep-research authored and launched"
    next_safe_action: "Wait for the 15-iteration fan-out to finish, synthesize research/research.md, present findings and recommendations, then scaffold phases 002+ on operator confirmation"
    blockers: []
    key_files:
      - "goal.md"
      - "001-deep-research/spec.md"
      - "001-deep-research/research-angles.md"
      - "001-deep-research/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-hermes-creation-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Which Hermes headless flags give a write-permitting, non-interactive dispatch with reliable exit codes?"
      - "Does Hermes's repo-local skill discovery respect the parent-hub single-advisor-identity design when .hermes/skills symlinks to .opencode/skills?"
      - "Which of Hermes's hooks, plugins and MCP surfaces can carry this repo's guard cores and MCP servers?"
    answered_questions:
      - "Hermes is installed locally: v0.21.1 (2026.9.7), git install at ~/.hermes/hermes-agent, binary at ~/.local/bin/hermes"
      - "Hermes injects AGENTS.md, CLAUDE.md and .cursorrules from the CWD and loads repo-local skills from ./.hermes/skills and ./.agents/skills after `hermes skills trust`"
      - "Hermes has native non-interactive dispatch: `hermes chat -q|--query-file -Q --oneshot` with -m, --provider, --reasoning, --toolsets, --skills, --yolo, --max-turns, --run-budget"
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

# Feature Specification: cli-hermes creation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 phased packet |
| **Priority** | P1 |
| **Status** | In Progress — phase 001 (deep research) running; phases 002+ are candidates until the operator confirms the research findings |
| **Created** | 2026-09-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | cli-external-orchestration/071-cli-hermes-creation |
| **Predecessor** | `031-cli-pi-creation` (structural precedent: the most recent runtime creation packet, phased the same way) |
| **Successor** | None |
| **Handoff Criteria** | Phase 001 delivers a synthesized `research/research.md` with ranked findings and a recommended phase plan; the operator confirms the plan; each later phase validates independently with `validate.sh --strict`; `cli-hermes` becomes the seventh `ExecutorKind` and the seventh hub mode without breaking the six existing modes; an unavailable `hermes` binary never becomes routable. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repository dispatches work to six external coding CLIs as `cli-external-orchestration` modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`). Each one needed a contract pin, deep-loop executor wiring, a skill packet, a repo-root dotfolder that mirrors the shared agents, hooks and playbook, a model roster, and a manual-testing playbook. Hermes Agent (Nous Research) is a seventh real runtime, already installed on this machine at `~/.hermes` (v0.21.1), with its own headless dispatch, skill loader, hooks, plugins, MCP host, sub-agent delegation and a large provider roster. None of that is reachable from this repo's orchestration layer today, and nothing in the repo describes what Hermes can and cannot do compared with the six existing runtimes.

Hermes differs from the precedents in ways that change the shape of the work: it is a Python application installed as a git checkout rather than a Node or Go binary; it reads `AGENTS.md`, `CLAUDE.md` and `.cursorrules` from the working directory natively; it loads repo-local skills only after an explicit trust step and scans them; its hooks are shell scripts declared in a user-level `config.yaml` with a consent allowlist; and it carries side-effecting subsystems (memories, sessions database, curator) that write outside the repository. Whether the repo's `.opencode/skills` tree can be symlinked into `.hermes/skills`, whether Hermes's skill discovery respects the parent-hub design, and which surface carries the guard hooks are open questions that research must settle before any integration is built.

### Purpose
Bring Hermes to the same parity the other six runtimes have, in the order that worked for `031-cli-pi-creation`: research and contract-pin first, then executor support, skill packet, dotfolder, bridges, model routing, playbook and governance. Phase 001 is a forced-depth deep-research run across two model lineages that answers the open questions against the live install and Hermes's public documentation. Its synthesized findings and recommendations are presented to the operator; only after confirmation are phases 002 and later scaffolded from the confirmed plan, so that no integration phase rests on an unverified assumption about Hermes.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 15-iteration deep-research run (10 iterations DeepSeek V4 Flash Max and 5 iterations SWE-2 Max, both through `cli-devin`, no early convergence) on Hermes's dispatch contract, provider roster, repo-local configuration, skill, agent, command, hook, plugin and MCP surfaces, deep-loop fan-out fitness, and constraints compared with the six existing runtimes — **phase 001**.
- A synthesized findings-and-recommendations report presented to the operator, and a confirmed phase plan for the integration phases.
- On confirmation: `cli-hermes` as the seventh `ExecutorKind` in the deep-loop runtime; the `cli-hermes` skill packet under the hub built with `sk-create-skill`; a repo-root `.hermes/` folder with the symlinks and unique files Hermes needs; bridges so Hermes can use this repo's agents, commands, skills, hooks and MCP servers; a model roster with a fail-closed allowlist; a manual-testing playbook built with `sk-create-manual-testing-playbook`; a feature catalog built with `sk-create-feature-catalog`; READMEs built with `sk-create-readme`; and a check of `REPO RULES.md`, `AGENTS.md` and `CLAUDE.md` for roster or governance updates.
- Fan-out support so `/deep:research` and `/deep:review` lineages can run on Hermes, gated on the research finding that Hermes has a write-permitting headless mode with usable exit codes.

### Out of Scope
- Running any interactive Hermes auth or provider-login flow on the operator's behalf; credentials stay the operator's.
- Modifying Hermes itself (the `~/.hermes/hermes-agent` checkout); this packet consumes Hermes as installed.
- Hermes's messaging gateways, cron, kanban, voice and desktop surfaces; only the CLI dispatch path is integrated.
- Wiring Hermes into CI; scope is local-machine parity, matching the six precedents.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-deep-research/research/**` | Create | 001 | Fan-out lineages, merged registry, synthesized `research.md` |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts`, `runtime/scripts/fanout-run.cjs`, `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`, tests | Modify | candidate 003 | Seventh executor kind, dispatch builder, allowlist, env and state-dir maps |
| `.opencode/skills/cli-external-orchestration/cli-hermes/**` | Create | candidate 004 | Skill packet: SKILL.md, README, references, assets, changelog |
| `.opencode/skills/cli-external-orchestration/{SKILL.md,ROUTER.md,hub-router.json,mode-registry.json,leaf-manifest.json,description.json,graph-metadata.json}` | Modify | candidate 004 | Register the seventh mode; the hub stays the single advisor identity |
| `.hermes/**` (repo root) | Create | candidate 005 | Symlinks to shared agents, hooks and playbook plus Hermes-unique files |
| `.opencode/hooks/dispatch/hermes/**`, `.hermes/hooks/**` | Create | candidate 007 | Guard-core adapters for Hermes's hook surface |
| `sk-prompt/prompt-models` profiles, `cli-hermes/references/providers-and-models.md` | Create/Modify | candidate 009 | Model roster and fail-closed allowlist |
| `cli-hermes/manual-testing-playbook/**`, `cli-hermes/feature-catalog/**` | Create | candidate 010 | Playbook and feature catalog |
| `AGENTS.md`, `CLAUDE.md`, `REPO RULES.md`, agent roster docs, hub README | Modify | candidate 011 | Roster and governance mentions where the other six runtimes appear |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-deep-research/` | Forced-depth two-lineage research on Hermes's headless contract, providers, repo-local config, skills, agents, commands, hooks, plugins, MCP, fan-out fitness and constraints versus the six runtimes; synthesized findings and a recommended phase plan | In Progress |
| 2 | `002-hermes-contract-pin/` (candidate) | Live-verify the research's load-bearing claims against the installed Hermes: headless syntax, exit codes, write permissions, trust and skill discovery | Planned, pending confirmation |
| 3 | `003-deep-loop-executor-support/` (candidate) | Add `cli-hermes` as the seventh `ExecutorKind` with a fail-closed dispatch builder, allowlist, env and state-dir isolation | Planned, pending confirmation |
| 4 | `004-cli-hermes-skill-packet/` (candidate) | Build the skill packet with `sk-create-skill` and register the seventh hub mode | Planned, pending confirmation |
| 5 | `005-hermes-runtime-folder/` (candidate) | Create the repo-root `.hermes/` folder: symlinks to shared agents, hooks, playbook and skills plus Hermes-unique files | Planned, pending confirmation |
| 6 | `006-hermes-agent-command-bridge/` (candidate) | Make the repo's agents, commands and skills usable from Hermes | Planned, pending confirmation |
| 7 | `007-hermes-hook-and-plugin-layer/` (candidate) | Bridge the guard cores into Hermes hooks or plugins | Planned, pending confirmation |
| 8 | `008-hermes-mcp-host-integration/` (candidate) | Connect the repo's MCP servers under a deny-by-default policy | Planned, pending confirmation |
| 9 | `009-hermes-model-registry-and-routing/` (candidate) | Model roster, prompt-models profiles, fail-closed allowlist | Planned, pending confirmation |
| 10 | `010-hermes-playbook-and-catalog/` (candidate) | Manual-testing playbook and feature catalog with their create modes | Planned, pending confirmation |
| 11 | `011-docs-governance-and-closeout/` (candidate) | READMEs, roster and governance docs, `REPO RULES.md` and `AGENTS.md` check, recursive strict validation | Planned, pending confirmation |

The candidate phase list mirrors `031-cli-pi-creation`. Phase 001's synthesis may merge, drop or add phases; the list is frozen only when the operator confirms it, and only confirmed phases are scaffolded.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Phases 002 and later are scaffolded only after the operator confirms phase 001's findings and recommended plan
- Every routing surface must check for a working `hermes` binary before advertising or dispatching Hermes; an unavailable binary never becomes routable
- The skill packet phase must not author `cli-hermes/graph-metadata.json` or `cli-hermes/description.json`; the hub stays the single advisor identity
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Both lineages ran to their iteration caps; `research/research.md` carries ranked findings, a comparison with the six runtimes, and a recommended phase plan; the operator has confirmed the plan | 10 and 5 iteration files on disk under `research/lineages/`, merged registry present, operator confirmation recorded in the parent `goal.md` log |
| 002 | 003 | The headless dispatch syntax, exit-code behavior and write-permission mode are confirmed by live runs, not by documentation | Live stdout and exit status recorded in `002-*/implementation-summary.md` |
| 003 | 004 | `EXECUTOR_KINDS` includes `cli-hermes`, the dispatch builder is unit-tested, typecheck and existing suites stay green | Test and typecheck output recorded |
| 004 | 005 | The seventh mode is registered on every hub surface and both skill checkers pass | `parent-skill-check.cjs` and `validate_skill_package.py` output |
| 005 | 006 | A Hermes session started in the repo sees the shared agents, hooks and playbook through `.hermes/` | Live `hermes` output listing them |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which Hermes flags give a write-permitting, non-interactive dispatch, and are its exit codes reliable enough for the fan-out runner's stop-policy checks? Owned by phase 001, confirmed live in 002.
- Does Hermes's repo-local skill discovery under `./.hermes/skills` follow a symlink to `.opencode/skills`, and does it respect the parent-hub design or flatten every nested `SKILL.md` into its own skill? Owned by phase 001.
- Which surface should carry the repo's guard cores: Hermes shell hooks in `config.yaml`, a native plugin, or both? Owned by phase 001.
- Can the repo's MCP servers connect over stdio through `hermes mcp add`, and what is the deny-by-default enforcement point? Owned by phase 001.
- Which providers and models can Hermes reach with credentials already on this machine, and which of them are already in the repo's rosters for other runtimes? Owned by phase 001.
- Do Hermes's outside-repo writes (sessions database, memories, curator) interact with the fan-out write-containment guard? Owned by phase 001.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Packet goal**: `goal.md` (the durable directive; each phase carries its own `goal.md`)
- `../031-cli-pi-creation/spec.md` (structural precedent)
- `../046-cli-devin-current-cli-repair/spec.md` (headless-dispatch trap precedent for the executor used by phase 001)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

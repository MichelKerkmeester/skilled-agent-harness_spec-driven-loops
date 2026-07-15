---
title: "Feature Specification: command + agent create-skill canon conformance — template-canon structure across every command family and agent, plus Codex dual-runtime parity"
description: "Phase parent for conforming every OpenCode command family and every agent to the sk-doc create-command / create-agent template canon (numbered-section router-core, validate_document --type command|agent clean), and establishing Codex dual-runtime parity: repo-tracked markdown command prompts synced to ~/.codex/prompts/ via a new generator, plus regenerated .codex/agents/*.toml. Audited per-lane by the deep-alignment loop against the sk-doc authority."
status: in_progress
trigger_phrases:
  - "command agent canon conformance"
  - "create-command template conformance"
  - "codex command parity prompts"
  - "codex dual runtime alignment"
  - "deep-alignment command families"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance"
    last_updated_at: "2026-07-14T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded phase parent + 5-child decomposition from census + research brief"
    next_safe_action: "Author 000-foundations child + deep-alignment lane-config, then run the LUNA audit loop"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-138-command-agent-canon-conformance"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Codex command parity = repo-tracked markdown prompts + a sync-prompts.cjs generator installing to ~/.codex/prompts/ (operator, 2026-07-14); codex commands are markdown, NOT toml — agents stay toml"
      - "New top-level packet under skilled-agent-orchestration, distinct from the complete 131 reality-conformance audit (operator, 2026-07-14)"
      - "Verification engine = deep-alignment loop per lane vs sk-doc authority; executor gpt-5.6-luna-fast --variant xhigh, synthesis gpt-5.6-sol-fast --variant xhigh, verify fresh Opus 4.8 xhigh (operator, 2026-07-14)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
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

# Feature Specification: command + agent create-skill canon conformance — template-canon structure across every command family and agent, plus Codex dual-runtime parity

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Packet Type** | Phase parent (lean trio) |
| **Children** | 5 (000–004) |
| **Predecessor** | `131-command-agent-conformance-audit` (COMPLETE) — audited reality/routing drift; this packet is the orthogonal template-canon + dual-runtime axis |
| **Successor** | None pre-scoped (CI wiring of the validator/drift/sync gates is a plausible follow-on tail) |
| **Handoff Criteria** | Every `.opencode/commands/**/*.md` passes `validate_document.py --type command`; every agent passes `--type agent`; `sync-agents.cjs --check` clean; the new `sync-prompts.cjs --check` clean; `~/.codex/prompts/` at full parity with the stale symlink repaired; `validate.sh --recursive --strict` on the packet is Errors:0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The command and agent surface is uneven against the sk-doc create-skill canon along two axes that packet 131 did not touch (131 audited reality/routing drift — route manifests, asset tables, read-only proofs). First, TEMPLATE-CANON structure: `validate_document.py --type command` keys on numbered `## N.` headers and a router-core (`OWNED ASSETS` + `PRESENTATION BOUNDARY`); the `doctor/*` commands use UNNUMBERED headers, so the validator sees zero sections and they FAIL exit 1, while `memory/search.md` still ships as a compiled-stub render-bang and other families carry recommended-section warnings. Second, CODEX DUAL-RUNTIME parity: agents exist at 13/13/13 across `.opencode`/`.claude`/`.codex` but `sync-agents.cjs` (the only md→toml converter) is un-gated and drifts silently; and Codex commands — which are MARKDOWN prompts in `~/.codex/prompts/`, not toml — are absent from the repo entirely (20 drifted home-dir files + a broken `create` symlink to a non-existent `.opencode/command/` singular path).

### Purpose
Bring every command family and agent to template-canon conformance and establish durable, gated Codex dual-runtime parity. Commands: conform each family to the correct create-command template (numbered router-core), with `doctor/*` renumbering as the one hard defect. Agents: conform the 13 agents to create-agent canon across `.opencode`/`.claude`, regenerate `.codex/agents/*.toml`, and wire `sync-agents.cjs --check` into a gate. Codex commands: introduce repo-tracked markdown command prompts mirroring `.opencode/commands`, a new `sync-prompts.cjs` generator that installs them into `~/.codex/prompts/` with a `--check` drift gate, and a repaired symlink. All conformance is audited per-lane by the deep-alignment loop against the sk-doc authority; all changes are behavior-preserving.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author deep-alignment `--lane-config` JSON files (sk-doc authority × command-docs lane × agent-docs lane) and run the per-lane conformance audit that drives every child checklist.
- Template-canon conformance of all 7 OpenCode command families (`create`, `design`, `doctor`, `memory`, `speckit`, `prompt-improve`, `goal_opencode`) to create-command — numbered router-core; `doctor/*` unnumbered→numbered; `memory/search.md` render-bang decision; recommended-section warning cleanup.
- create-agent canon conformance of the 13 agents in `.opencode/agents` + `.claude/agents`; regeneration of `.codex/agents/*.toml`; `sync-agents.cjs --check` gate wiring; `HISTORICAL_SETTINGS` coverage for every agent.
- Codex command parity: repo-tracked markdown command prompts, a new `sync-prompts.cjs` generator (md→codex prompt, `--check` drift mode) mirroring `sync-agents.cjs`, install into `~/.codex/prompts/`, and repair of the stale `create` symlink.

### Out of Scope
- Reality/routing-drift conformance (route manifests, asset-table accuracy, read-only target proofs) — owned by the complete packet 131; this packet is the template-canon + dual-runtime axis only.
- Redesigning `validate_document.py`, the create-command/create-agent canon templates, or the deep-alignment engine — this packet conforms TO the canon and USES the engine.
- Changing any command's or agent's runtime BEHAVIOR — every edit is structure/parity only (numbering, section presence, cross-runtime mirroring), never a feature or dispatch change.
- CI wiring of the new gates — a plausible follow-on, not built here.

### Files to Change
Aggregate file scope across the 5 phases; per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `…/138-…/000-foundations/lane-config*.json` | Create | 000 | deep-alignment lane-config for command-docs + agent-docs lanes |
| `.opencode/commands/doctor/*.md` | Modify | 001 | Unnumbered headers → numbered router-core (INVALID→VALID on `--type command`) |
| `.opencode/commands/{create,design,memory,speckit}/*.md`, `prompt-improve.md`, `goal_opencode.md` | Modify | 001 | Recommended-section + numbering cleanup as the audit finds; `memory/search.md` render-bang decision |
| `.opencode/agents/*.md`, `.claude/agents/*.md` | Modify | 002 | create-agent canon conformance (as audit finds) |
| `.codex/agents/*.toml` | Regenerate | 002 | `sync-agents.cjs` regen after agent edits |
| `.opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs` | Modify | 002 | `HISTORICAL_SETTINGS` coverage; gate-wiring hook |
| `.codex/prompts/*.md` (new repo tree) | Create | 003 | Repo-tracked codex command prompts mirroring `.opencode/commands` |
| `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs` | Create | 003 | New md→codex-prompt generator with `--check` drift mode |
| `~/.codex/prompts/` (+ `create` symlink) | Modify | 003 | Install synced prompts; repair the stale symlink |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Child specs/checklists are populated from the deep-alignment audit findings (LUNA loop) and synthesis (SOL); each child's checklist IS its deep-alignment verifier contract.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 0 | 000-foundations/ | Freeze immutable BASE + census; author deep-alignment lane-config JSONs (command-docs + agent-docs vs sk-doc); confirm the sk-doc/create-agent adapters run live and return real findings | In progress (own gates met; CHK-024 P2 reducer-gap deferred to 015) |
| 1 | 001-command-template-conformance/ | Conform all 7 command families to create-command canon (numbered router-core). P0: `doctor/*` renumber; `memory/search.md` bang decision; recommended-section warning cleanup | Complete |
| 2 | 002-agent-canon-conformance/ | Conform 13 agents (`.opencode` + `.claude`) to create-agent; regenerate `.codex/agents/*.toml`; wire `sync-agents.cjs --check` gate; `HISTORICAL_SETTINGS` coverage | Complete |
| 3 | 003-codex-command-parity/ | Build `sync-prompts.cjs`; repo-track `.codex/prompts/` mirroring `.opencode/commands`; install to `~/.codex/prompts/`; repair the stale symlink; `--check` gate | Complete |
| 4 | 004-integrate-validate-ship/ | Recursive strict validate; all gates green (`--type command|agent`, `sync-*.cjs --check`); ship via isolated worktree FF-push | In progress (shipped + gates green; formal closeout pending packet rollup) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before the next phase begins.
- Phase 000 must produce a live deep-alignment run returning REAL findings (not blanket `could-not-validate` P1s) before phases 001–003 rely on its lane output.
- Command/agent edits (001–002) MUST re-run their `--type command|agent` verifier to prove INVALID→VALID with no behavior change.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 000-foundations | 001-command-template-conformance | lane-config resolves; deep-alignment sk-doc lane returns real P0/P1/P2 findings | `scoping.cjs` exit 0, live `deep-alignment` run |
| 001-command-template-conformance | 002-agent-canon-conformance | every `.opencode/commands/**/*.md` exits 0 on `--type command`; behavior-preserving | `validate_document.py`, invocation-diff where applicable |
| 002-agent-canon-conformance | 003-codex-command-parity | every agent exits 0 on `--type agent`; `.codex/agents/*.toml` regenerated; `sync-agents.cjs --check` clean | `validate_document.py`, `sync-agents.cjs --check` |
| 003-codex-command-parity | 004-integrate-validate-ship | `sync-prompts.cjs --check` clean; `~/.codex/prompts/` at parity; symlink repaired | `sync-prompts.cjs --check`, `readlink` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None at the parent level. The one material premise conflict — Codex commands are markdown prompts, not toml — is operator-resolved: repo-tracked markdown + `sync-prompts.cjs` install to `~/.codex/prompts/`. Per-lane conformance specifics are resolved by the deep-alignment audit findings, not by parent-level guesses.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md, checklist.md, decision-record.md
- **Predecessor audit**: `skilled-agent-orchestration/131-command-agent-conformance-audit` (complete; reality/routing axis)
- **Authority (canon)**: `.opencode/skills/sk-doc/create-command/` and `.opencode/skills/sk-doc/create-agent/`
- **Verification engine**: `.opencode/skills/system-deep-loop/deep-alignment/`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---
title: "Research Specification: Hermes Agent as a cli-external-orchestration runtime"
description: "Forced-depth two-lineage deep research on Hermes Agent's headless dispatch, providers, repo-local configuration, skill, agent, command, hook, plugin and MCP surfaces, deep-loop fan-out fitness, and constraints versus the six existing runtimes, ending in ranked findings and a recommended phase plan."
trigger_phrases:
  - "hermes runtime research"
  - "cli-hermes deep research"
  - "hermes headless dispatch"
  - "hermes skills hooks mcp"
  - ".hermes folder research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/containment/quarantine/content/specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/deepseek/containment/baseline/specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/containment/baseline/specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/research/lineages/live-a/containment/baseline/specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research"
    last_updated_at: "2026-09-14T18:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phase authored; 15-iteration fan-out launched"
    next_safe_action: "Verify lineage caps, merge, synthesize research/research.md, present findings"
    blockers: []
    key_files:
      - "research-angles.md"
      - "resource-map.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-001-deep-research"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Is Hermes's headless exit code reliable enough for the fan-out stop-policy check?"
      - "Does repo-local skill discovery follow a symlink and respect the parent-hub design?"
    answered_questions:
      - "Hermes is installed locally at ~/.hermes, v0.21.1, and has a native non-interactive chat mode"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Research Specification: Hermes Agent as a cli-external-orchestration runtime

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Hermes Agent is installed on this machine but unknown to the repo's orchestration layer. This phase runs a 15-iteration forced-depth research loop across two model lineages to establish, with citations to the installed source and live documentation, what Hermes offers as a seventh runtime and where it differs from the six existing ones. The output is a ranked findings report and a recommended phase plan that the operator confirms before any integration phase is scaffolded.

**Key Decisions**: two `cli-devin` lineages (10 iterations DeepSeek V4 Flash Max, 5 iterations SWE-2 Max) with no early convergence; ten bounded research angles; read-only access to the Hermes install.

**Critical Dependencies**: the `devin` binary and its headless dispatch (repaired in packet 046); the installed Hermes checkout at `~/.hermes/hermes-agent`; live web access from the lineages.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 1 scaffolded (candidates 2 to 11 follow on confirmation) |
| **Predecessor** | None |
| **Successor** | `002-hermes-contract-pin` (candidate) |
| **Handoff Criteria** | Both lineages reach their caps; `research/research.md` carries ranked, cited findings, a capability comparison and a recommended plan; the operator confirms the plan |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the cli-hermes creation packet.

**Scope Boundary**: research only. Writes are confined to this folder's `research/` tree. No runtime file, hub registry, dotfolder or Hermes configuration changes.

**Dependencies**:
- `devin` CLI available and dispatchable headlessly (`devin -p ... --permission-mode dangerous --respect-workspace-trust false`)
- Hermes install readable at `~/.hermes` and `~/.hermes/hermes-agent`
- `research-angles.md` and `resource-map.md` in this folder

**Deliverables**:
- `research/lineages/deepseek/` (10 iterations) and `research/lineages/swe2/` (5 iterations)
- `research/findings-registry.json` merged across lineages, `research/fanout-attribution.md`
- `research/research.md`: ranked findings, comparison table, recommended phase plan, open questions

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nothing in this repository says what Hermes Agent can do as a dispatch target, how its repo-local configuration, skills, hooks, plugins and MCP host compare with the six runtimes already integrated, or whether its headless mode is fit for deep-loop fan-out. Building the integration on assumptions would repeat the failure packet 046 fixed for Devin, where a documented headless mode turned out to reject writes.

### Purpose
Produce an evidence-cited answer to those questions and a recommended phase plan, so every later phase in this packet rests on confirmed behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The ten angles in `research-angles.md`: headless contract, providers and models, the `.hermes/` folder and instruction files, skill format compatibility, agents and commands, hooks and plugins, MCP, fan-out fitness, constraints versus the six runtimes, recommendation.
- Online research of Hermes's documentation, repository, changelog and issues, dated at fetch time.
- Read-only inspection of the installed source and read-only `hermes` commands, with at most two capped smoke dispatches per lineage.

### Out of Scope
- Any change to `~/.hermes`, to Hermes source, or to repo runtime files - this phase builds nothing.
- Hermes messaging, cron, kanban, voice, desktop and TUI surfaces - not dispatch paths.
- Scaffolding phases 002 and later - gated on operator confirmation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/**` | Create | Fan-out lineages, merged registry, attribution, synthesized `research.md` |
| `implementation-summary.md`, `acceptance-criteria.md`, `goal.md`, `tasks.md` | Modify | Evidence and closure once the run finishes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both lineages run to their iteration caps under `stop_policy: max-iterations`: 10 iteration files for `deepseek`, 5 for `swe2`, each synthesis recording `maxIterationsReached` |
| REQ-002 | `research/research.md` carries ranked findings whose citations resolve to a file and line, a command output, or a dated URL |
| REQ-003 | The synthesis includes a capability comparison with one row per capability and one column per runtime (the six existing plus Hermes) |
| REQ-004 | The synthesis recommends a phase plan for phases 002 and later, each recommendation marked required or optional with the failure it prevents |
| REQ-005 | No file outside `research/` is changed by the run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every angle has at least one finding or an explicit UNKNOWN |
| REQ-007 | The two lineages' verdicts are compared; disagreements are named, not averaged |
| REQ-008 | Findings and recommendations are presented to the operator in chat before phases 002+ are scaffolded |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` states a recommended phase plan and the operator can confirm or amend it from the chat summary alone.
- **SC-002**: The headless dispatch, skill discovery, hook and MCP questions each end in a cited finding or a named UNKNOWN with the live check that would resolve it.
- **SC-003**: Both lineages ran to cap; the fan-out attribution table shows 10 and 5 iterations.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `devin` headless dispatch | A lineage that stalls produces no findings | Packet 046 flags in the dispatch builder; salvage sweep; re-dispatch with a corrected brief if a lineage fails |
| Dependency | Live web access from a devin lineage | Online angles degrade to documentation-only | Web capability is inherit-only on `cli-devin`; the brief asks for fetch dates so unfetched claims are visible |
| Risk | A lineage changes `~/.hermes` or runs a mutating command | Operator config damaged | The angles file forbids every mutating command by name; smoke dispatches are capped and shaped |
| Risk | A lineage writes outside its directory | Run fails on containment | Fan-out write containment reverts and fails the lineage; the brief repeats the rule |
| Risk | Two lineages disagree | Ambiguous verdict | Synthesis names each disagreement and what would settle it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration completes within the 900-second executor timeout; each lineage within the 4-hour lineage ceiling.

### Security
- **NFR-S01**: No credential value from `~/.hermes/.env` appears in any artifact; key names only.

### Reliability
- **NFR-R01**: A failed iteration is redispatched once by the runner; a failed lineage is reported, not silently dropped.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a lineage that finds no Hermes install must record that as a finding and stop.
- Maximum length: the topic string stays under the CLI argument limit; angles live in the file, not the argument.

### Error Scenarios
- External service failure: a failed web fetch is recorded with the URL and marked unconfirmed.
- Network timeout: the runner's per-iteration timeout ends the iteration; the next one continues.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: research tree only, Systems: Hermes plus six runtime packets read |
| Risk | 5/25 | No runtime change; operator config read-only |
| Research | 20/20 | Ten angles, two lineages, online sources |
| Multi-Agent | 10/15 | Two fan-out lineages |
| Coordination | 8/15 | Merge, synthesis, operator confirmation gate |
| **Total** | **53/100** | **Level 3** (parent-inherited) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Devin lineage stalls at zero output | H | M | Runner heartbeat and lag ceiling; stdin closed; re-dispatch |
| R-002 | Findings restate the brief instead of the evidence | M | M | Citation rule; smoke dispatch evidence; two model families |
| R-003 | Smoke dispatch spends model budget or writes Hermes session state | L | M | Capped at two per lineage, one turn, 60-second budget |

---

## 11. USER STORIES

### US-001: Runtime comparison (Priority: P0)

**As a** repo maintainer, **I want** a cited comparison of Hermes against the six runtimes, **so that** the integration phases copy the right precedent for each surface.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Confirmed phase plan (Priority: P0)

**As the** operator, **I want** a ranked recommendation I can confirm from chat, **so that** only phases resting on confirmed behavior are scaffolded.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Is the `-Q` final response parseable enough to serve as a machine-readable event stream, as `opencode run` is today?
- Does `--yolo` grant file writes and shell execution without prompts on a non-TTY, or does an approval mode still block?
- Can a repo carry Hermes hooks at all, given hooks are declared in the user-level `config.yaml`?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Research angles**: See `research-angles.md`
- **Known context**: See `resource-map.md`
- **Parent packet**: See `../spec.md` and `../goal.md`

---

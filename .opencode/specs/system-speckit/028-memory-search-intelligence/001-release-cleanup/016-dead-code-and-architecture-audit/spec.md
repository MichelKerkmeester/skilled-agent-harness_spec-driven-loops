---
title: "Feature Specification: Dead Code, Legacy Artifact and Architecture Simplification Audit"
description: "The v4 release surface has never had a single systematic sweep for dead code, superseded legacy files, backup and scratch residue, misplaced files, structural drift, and over-engineered subsystems. Cleanup so far has been per-surface and documentation-shaped, so removable and simplifiable material is only known anecdotally."
trigger_phrases:
  - "dead code audit"
  - "legacy file cleanup audit"
  - "backup file removal audit"
  - "architecture simplification audit"
  - "overengineering audit"
  - "release cleanup 016"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/016-dead-code-and-architecture-audit"
    last_updated_at: "2026-07-27T08:56:02Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase spec, plan, tasks and checklist"
    next_safe_action: "Run the research program in section 4 before any findings work"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-016-dead-code-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase is audit-only: it produces a ranked findings report, it does not delete or refactor."
      - "Twenty forced-depth research passes run first: fifteen orchestrated, five hand-driven through Devin."
      - "Devin cannot host an orchestrated lineage, so the GLM passes run as manual dispatches."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Dead Code, Legacy Artifact and Architecture Simplification Audit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-speckit/028-memory-search-intelligence/001-release-cleanup` |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-manual-playbook-execution-sweep |
| **Successor** | `../017-findings-remediation/spec.md` |
| **Handoff Criteria** | A ranked, evidence-backed findings report exists and every finding carries a reproducible verification command |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the release-cleanup track. Phases 001-015 swept *documentation* surfaces (READMEs, SKILL.md files, catalogs, playbooks, commands, agents, changelogs) and their follow-on validation. This phase sweeps the *code and structure* surface that those phases deliberately left alone.

**Scope Boundary**: Audit and report only. No file is deleted, moved, or refactored in this phase. Remediation is planned as a separate follow-on phase once the operator has ranked the findings.

**Dependencies**:
- A completed 20-pass research program (section 4) supplies the evidence base.
- Read-only access to the full repository working tree and its git history.

**Deliverables**:
- `research/` — orchestrated lineage artifacts, manual dispatch transcripts, and the merged synthesis.
- `findings-report.md` — the ranked, evidence-backed finding set.
- `implementation-summary.md` — audit closeout, counts per category, and the remediation handoff.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The repository has grown across dozens of packets, several migrations (spec re-nesting, hyphen-case renaming, parent-hub merges), and multiple superseded experiments. Cleanup so far has been per-surface and documentation-shaped. Nobody has swept the code and structure surface end to end, so the following are known only anecdotally: unreachable or never-called code, superseded legacy files still on disk, backup and scratch residue committed by accident, files sitting in the wrong directory relative to their owning subsystem, structural drift from the documented architecture, and subsystems whose complexity is not earned by their current use.

### Purpose

Produce one ranked, evidence-backed inventory of what can be deleted, what must be moved, and what can be simplified — each finding independently verifiable — so the operator can approve a bounded remediation phase before the v4 release.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Six audit categories, each producing findings in the same shape:

| ID | Category | What counts as a finding |
|----|----------|--------------------------|
| CAT-1 | Dead code | Exported symbols, modules, scripts, CLI flags, env flags, or branches with no reachable caller in the repo and no documented external contract |
| CAT-2 | Legacy / superseded files | Files whose successor exists and is live, where the old file is retained only by inertia |
| CAT-3 | Backup / scratch residue | `.bak`, `.old`, `.orig`, `-copy`, dated snapshots, stray `node_modules`, committed temp output, and abandoned scratch trees |
| CAT-4 | Misplaced files | Files whose directory contradicts the owning subsystem's documented layout, including metadata pairs at illegal depths and runtime mirrors that drifted from their canonical source |
| CAT-5 | Architecture / structure issues | Layering violations, duplicated responsibility across subsystems, circular or surprising dependencies, and contracts documented in one place but enforced in another |
| CAT-6 | Over-engineering | Abstractions, config surfaces, flags, or indirection layers whose current usage does not justify their cost, with a concrete simpler shape proposed |

Surfaces swept: `.opencode/` (skills, commands, agents, bin, scripts, mcp-servers, runtime libraries), repository-root configuration and dotfiles, and runtime mirror directories (`.claude/`, `.codex/`, `.cursor/`, `.devin/` where present).

### Out of Scope

- **Executing any deletion, move, or refactor** — this phase reports; remediation is a separate approved phase. This is the safety boundary that makes a broad sweep cheap to run.
- **`.opencode/specs/` content** — spec packets are project records, not code; their structural drift was handled in phase 014.
- **Third-party dependency trees** (`node_modules`, lockfiles) except where a stray copy is committed inside a source tree, which is CAT-3.
- **Test coverage gaps** — absence of a test is not a finding here unless the untested code is itself a dead-code or over-engineering candidate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Lineage state, manual dispatch transcripts, deltas and merged synthesis |
| `findings-report.md` | Create | Ranked findings across CAT-1 through CAT-6 with per-finding evidence and verification command |
| `implementation-summary.md` | Modify | Audit closeout, per-category counts, remediation handoff |
| `checklist.md` | Modify | Verification evidence for each success criterion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:research-program -->
## 4. RESEARCH PROGRAM (RUNS FIRST)

The audit is evidence-driven, so twenty forced-depth research passes run **before** any findings are written. Fifteen run as an orchestrated `/deep:research` fan-out; five run as hand-driven Devin dispatches. Three model families cover the same surfaces so that no single model's blind spots define the finding set.

| Pass | Transport | Executor | Model | Count |
|------|-----------|----------|-------|-------|
| L1 | Orchestrated fan-out | `cli-opencode` | `openai/gpt-5.6-sol`, reasoning effort `high` | 10 |
| L2 | Orchestrated fan-out | `cli-cursor` | `composer-2.5-fast` | 5 |
| M1 | Manual dispatch | `cli-devin` | `glm-5-2` (GLM 5.2 High, free tier) | 5 |

**Convergence policy** (orchestrated lineages): no early convergence, expand dynamically instead.

- `--convergence-mode=divergent` — a legal STOP is translated into a three-seat direction pivot that selects a new focus and continues, rather than ending the run.
- `--stop-policy=max-iterations` — convergence is treated as telemetry; each lineage runs its full iteration budget and broadens its angle rather than synthesizing early.

The manual Devin passes have no runtime convergence machinery. Forced depth is enforced by hand: each pass gets a distinct focus no prior pass covered, and none may end the sequence early.

**Verified executor constraints** (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11`):

- Deep-loop executor kinds are exactly `native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`. `cli-devin` is not among them and appears nowhere in `fanout-run.cjs`, so Devin cannot host an orchestrated lineage. That is why M1 is a manual transport.
- `cli-devin/SKILL.md` states that orchestrated execution delegates to `fanout-run.cjs` using executor kind `cli-devin`. That capability does not exist in the runtime. The drift is recorded here and is itself a CAT-5 candidate for this audit.
- Devin exposes version-pinned GLM ids; `devin models list` confirms `glm-5-2` is GLM 5.2 High on the free tier. The `cli-devin` reference table lists only a generic `glm` short name, which the live roster does not show as an alias — a documentation gap and a CAT-5 candidate.
- The Devin CLI requires the prompt after `--` or via `--prompt-file`; a bare positional prompt is rejected with `unexpected argument`.
- `cli-cursor` accepts no reasoning-effort option; effort is encoded in the model id. `composer-2.5-fast` is on its enforced allowlist.
<!-- /ANCHOR:research-program -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 20 research passes complete before findings authoring begins | `research/` holds 10 + 5 orchestrated iterations and 5 manual transcripts, with no lineage ending on early convergence |
| REQ-002 | Every finding names a concrete path (or path set) and the category it belongs to | `findings-report.md` has zero findings without a path and a CAT-n label |
| REQ-003 | Every deletion or move candidate carries a reproducible verification command proving it is unreferenced | Each CAT-1 through CAT-4 finding row includes the exact search or graph query a reviewer can re-run |
| REQ-004 | No file is deleted, moved, or refactored during this phase | `git status` at phase close shows changes confined to this spec folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Findings are ranked by remediation value against risk, not by discovery order | Report is sorted, and each row carries a blast-radius note |
| REQ-006 | Over-engineering findings propose a concrete simpler shape, not just a complaint | Each CAT-6 row names the simpler alternative and what it would cost to adopt |
| REQ-007 | Contradictions between passes are surfaced rather than silently merged | Synthesis has a section listing claims where passes disagreed and how each was resolved |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: All 20 research passes completed, with per-lineage state logs and manual transcripts present under `research/`.
- **SC-002**: `findings-report.md` covers all six categories, with every finding carrying path, category, evidence, verification command, and blast-radius note.
- **SC-003**: A reviewer can re-run any CAT-1 through CAT-4 verification command and reproduce the unreferenced conclusion.
- **SC-004**: The working tree outside this spec folder is unchanged at phase close.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:verification -->
## 7. VERIFICATION

| Check | Command | Expected |
|-------|---------|----------|
| Spec folder validity | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence/001-release-cleanup/016-dead-code-and-architecture-audit --strict` | Exit 0 |
| Pass count | Count iteration records per lineage log plus manual transcripts under `research/` | 10, 5, 5 |
| No collateral writes | `git status --porcelain` | Only paths under this spec folder |
| Finding reproducibility | Re-run a sampled subset of per-finding verification commands | Same conclusion as recorded |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:risks -->
## 8. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A dead-looking symbol is reached dynamically (string-keyed dispatch, hook registry, YAML-named script) and deleting it would break a live path | High | Verification command must cover string-literal references, not just import graphs; remediation stays a separate gated phase |
| Risk | Research passes report findings that do not exist on disk | High | Every finding is path-checked against the real tree during synthesis; unverifiable claims are dropped, not softened |
| Risk | A concurrent session reverts or clobbers this packet's files | High | This packet was already emptied once by a concurrent checkout; commit early, and re-verify the folder before each work block |
| Risk | Dispatched passes write outside their bound artifact directory | High | Passes are read-only over the repo and write only under `research/`; verified by `git status` at phase close |
| Risk | A manual Devin pass converges on ground the orchestrated lineages already covered | Medium | Each manual pass is assigned a distinct, pre-declared focus before dispatch |
| Dependency | `cli-opencode` provider auth for the OpenAI GPT-5.6 catalog | Lineage L1 cannot start | Pre-flight `opencode providers list` |
| Dependency | `cursor-agent` CLI present and authenticated | Lineage L2 cannot start | Pre-flight `cursor-agent --list-models` |
| Dependency | `devin` CLI present and authenticated | Manual pass M1 cannot start | Pre-flight `command -v devin`; the skill refuses dispatch without it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. Transport for each model family was confirmed by the operator before authoring.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent phase map**: See `../spec.md`

---
title: "Feature Specification: Global spec-drift and prior-context-optimization deep-research sweep"
description: "30-iteration divergent-mode deep-research sweep, fanned out across 3 executor lineages (GLM, SOL, LUNA), across ALL of .opencode/specs/* to surface residual spec drift and document prior context-optimization efforts, producing a committed research/research.md before phase 007's gated memory-DB teardown."
trigger_phrases:
  - "global spec drift research"
  - "spec drift deep research sweep"
  - "prior context optimization research"
  - "006 global spec drift"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Level 2 research packet docs"
    next_safe_action: "Confirm phases 001-005 handoff criteria met"
    blockers:
      - "Blocked until sibling phases 001-005 complete"
    key_files:
      - "spec.md"
      - "plan.md"
      - ".opencode/commands/deep/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Worktree vs current-branch execution target unresolved"
      - "Exact --executors JSON payload not yet assembled"
    answered_questions:
      - "Launch via /deep:research :auto per PLAN-WORKFLOW LOCK"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Global spec-drift and prior-context-optimization deep-research sweep

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

This packet runs one `/deep:research :auto` sweep, fanned out across 3 independent executor lineages (GLM, SOL, LUNA; ~10 iterations each, 30 total), in `divergent` convergence-mode with `stop-policy=max-iterations`, over ALL of `.opencode/specs/*` to surface residual spec drift and document prior context-optimization efforts that the five numbering/reconstruction phases (001-005) did not directly target. The durable output, `research/research.md`, must exist and be committed before phase 007's gated, destructive memory-database teardown is authorized.

**Key Decisions**: use the plan-named `/deep:research` workflow exactly as specified (no hand-rolled loop, no direct `@deep-research` Task dispatch); force full 30-iteration depth via `divergent` + `max-iterations` rather than allowing early convergence, because the sweep target is the entire specs tree.

**Critical Dependencies**: phases 001-005 must each be RESOLVED before this phase begins — either completed (001 renumber, 003 code-graph cleanup, 005 sk-design reconstruct — all shipped) or intentionally skipped by operator directive (002 deep-loop renumber and 004 sk-doc alignment, both tracks under active concurrent authoring at decision time). The operator's 2026-07-16 skip decision relaxed the original "all five complete" gate; the sweep runs against the current, partially-un-renumbered tree, which is a valid drift-research input. **GATE STATUS: SATISFIED** — 001/003/005 complete, 002/004 operator-skipped, worktree clean → phase 006 is cleared to launch. Phase 007 remains blocked until this phase converges and its findings are triaged.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/000-migration-from-soa-and-cleanup |
| **Predecessor** | Phases 001-005 (system-speckit-renumber, system-deep-loop-renumber, system-code-graph-cleanup, sk-doc-alignment, sk-design-reconstruct) — all five MUST complete first, per the parent's Phase Transition Rules |
| **Successor** | 007-memory-db-teardown — blocked until this phase converges and findings are triaged |

**Note**: Scaffolded at Level 2 pre-execution. The sweep produces `research/research.md` at run time; once that durable output and architecture decisions exist, the packet may be re-leveled to 3 (adding `decision-record.md`).
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parent packet (`000-migration-from-soa-and-cleanup`) diagnosed numbering drift in exactly five tracks and scoped phases 001-005 to fix only that drift. Those five phases do not cover the rest of `.opencode/specs/*` (`cli-external-orchestration`, `sk-code`, `sk-git`, `sk-prompt`, `system-skill-advisor`, `ai-systems`, `mcp-tooling`, `z_future`, and any others), nor do they produce any consolidated record of prior context-optimization efforts already attempted across packets (compaction, pruning, summarization, or continuity-shrinking patterns) that a downstream destructive memory-database teardown (phase 007) could use as evidence. Left unresearched, phase 007 would run its gated teardown without a documented picture of residual drift or precedent for what "context optimization" has already been tried and how it fared.

### Purpose
Run a single, plan-named `/deep:research :auto` sweep — fanned out across 3 independent executor lineages for coverage breadth, in `divergent` mode with `stop-policy=max-iterations` so the loop does not converge early on a tree this large — over ALL of `.opencode/specs/*`, and synthesize a committed `research/research.md` that phase 007 can use as its pre-teardown evidence gate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Configure and launch exactly one `/deep:research :auto` run bound to this spec folder, using `--convergence-mode=divergent`, `--stop-policy=max-iterations`, and a 3-lineage `--executors` fan-out (GLM, SOL, LUNA) totaling 30 iterations (~10 per lineage), per the LAUNCH command in `plan.md`.
- Sweep target: ALL of `.opencode/specs/*` (every track, not only the five phases 001-005 tracks) for (1) residual spec drift and (2) documented prior context-optimization efforts.
- Produce `research/research.md` as the durable synthesis output and commit it before phase 007 begins.
- Triage findings (remediate trivial in-scope items inline, or explicitly defer with a recorded reason) to satisfy the parent's 006→007 Phase Handoff Criteria ("findings triaged and either remediated or explicitly deferred with a recorded reason").

### Out of Scope
- Performing larger remediation work identified by the research findings — non-trivial fixes get their own follow-on packets, not inline work in this research packet.
- Modifying phases 001-005 content, scope, or numbering decisions.
- Executing phase 007's teardown — explicitly gated behind this phase's convergence per the parent's Phase Transition Rules.
- Deciding worktree vs. current-branch execution — that ask-first choice belongs to sk-git's Git Workspace Safety gate and is left as an Open Question for whoever executes this phase.
- Hand-rolling a custom research loop, a shell fan-out script, or a direct Task-tool dispatch of `@deep-research` — the plan-named `/deep:research` workflow MUST be used verbatim, per the PLAN-WORKFLOW LOCK constraint.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` (this packet, created at execution time) | Create | Durable synthesis output of the 30-iteration sweep; not authored by this scaffolding pass. |
| `research/deep-research-config.json`, `research/deep-research-state.jsonl`, `research/lineages/{glm,sol,luna}/**` (created at execution time) | Create | Standard deep-research state packet for a fresh, root-spec research target. |
| `implementation-summary.md` (this packet, created at execution time) | Create | Records iteration counts, lineage completion evidence, and the findings triage table. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Launch the plan-named `/deep:research :auto` workflow bound to this spec folder, not a hand-rolled substitute | `research/deep-research-config.json` records `spec_folder` pointing at this packet, `convergence-mode: divergent`, and `stop-policy: max-iterations`. |
| REQ-002 | Complete 30 total iterations across exactly 3 lineages (~10 each: GLM, SOL, LUNA) | Per-lineage state under `research/lineages/{label}/` shows 10 iterations (or a documented reason for variance) for each of the three lineages; the merged findings registry reflects all three. |
| REQ-003 | Sweep target is ALL of `.opencode/specs/*`, not a narrowed subset | `research/deep-research-strategy.md` or `research/research.md` names the full-tree scope explicitly and does not silently narrow to only the five phases 001-005 tracks. |
| REQ-004 | Durable output `research/research.md` written and committed BEFORE phase 007 begins | `git log -- research/research.md` shows a commit under this packet's path that predates any phase 007 destructive action. |
| REQ-005 | Use the exact verified executor slugs and flags | `research/deep-research-config.json` fanout executor entries match: GLM = `zai-coding-plan/glm-5.2` effort `max` via `cli-opencode`; SOL = `openai/gpt-5.6-sol-fast` effort `high` via `cli-opencode` with NO `--service-tier` flag; LUNA = `cli-codex` `gpt-5.6-luna` effort `max` `service_tier: fast`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Findings triaged per the parent's 006→007 Phase Handoff Criteria | `implementation-summary.md` or `research/research.md` contains a triage table where each finding is either remediated (with evidence) or explicitly deferred (with a recorded reason). |
| REQ-007 | Verify with project gates | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research --strict` passes before completion is claimed. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists, is non-empty, and is committed to git before phase 007 begins.
- **SC-002**: Total iteration count across `research/` lineage state equals 30, split across exactly 3 lineages (GLM, SOL, LUNA).
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research --strict` exits 0.
- **SC-004**: Every finding surfaced by the sweep is either remediated with evidence or explicitly deferred with a recorded reason, before phase 007 is authorized to run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-005 must each be RESOLVED before this phase begins — completed OR operator-skipped (002/004 skipped 2026-07-16 per operator directive; 001/003/005 shipped) | High if launched before phases resolve | RESOLVED: 001/003/005 complete, 002/004 operator-skipped, worktree clean; gate satisfied. |
| Risk | The brief's literal `--executors=[glm,sol,luna]` shorthand is not valid JSON for the command's documented `--executors=<json>` schema (verified: real usage is an array of `{kind, model, label, count, reasoning_effort, service_tier}` objects) | Medium — a malformed flag would fail setup or silently fall back to single-executor | Assemble the exact JSON payload from the three EXECUTORS definitions before launch (Phase 1, Task T004); do not paste the brief's shorthand literally. |
| Risk | SOL executor (`openai/gpt-5.6-sol-fast`) throws when `--service-tier` is passed | High if triggered — aborts that lineage | Never include `--service-tier` in the SOL lineage's executor group, per explicit brief callout. |
| Risk | `divergent` + `stop-policy=max-iterations` forces the loop to run the full iteration budget even after legal convergence is reached, by design | Low (intentional) but increases wall-clock/cost | Accept as intentional per the brief ("don't converge early"); no mitigation needed beyond awareness. |
| Risk | Sweeping literally all of `.opencode/specs/*` is a very large surface and may produce broad, low-signal findings | Medium | The mandatory synthesis/triage step (REQ-006) is the control point for signal quality, not narrowing scope. |
| Dependency | The brief's `--dir <clean worktree>` execution detail implies an isolated workspace, but CLAUDE.md's Git Workspace Safety rule requires an explicit ask-first A) worktree / B) current-branch choice | Medium | This scaffold does not make that choice; it is recorded as an Open Question for whoever executes this phase. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No explicit new runtime performance target; the default 4h per-lineage wall-clock timeout applies unless raised via `--lineage-timeout-hours` for this forced-depth, 3-lineage, 30-iteration run.

### Security
- **NFR-S01**: No new credentials or secrets are introduced; executor CLI dispatch reuses existing verified cli-opencode/cli-codex authentication.

### Reliability
- **NFR-R01**: The run must fail closed per existing deep-research contract — `blockedStop`, `error`, and similar non-pivoting stop reasons do not silently continue; a lineage that errors out must be reflected honestly in the merged findings registry rather than assumed complete.

---

## 8. EDGE CASES

### Data Boundaries
- One lineage errors or stops partway through its ~10 iterations: the merged registry and `research/research.md` must document actual per-lineage completion counts rather than assuming a uniform 10/10/10 split.
- Legal convergence (`composite_converged` or `all_questions_answered`) is reached before iteration 30 in an individual lineage: under `stop-policy=max-iterations` that lineage continues to its bound iteration count regardless, per the command's documented contract (convergence becomes telemetry only).

### Error Scenarios
- Malformed `--executors` JSON at launch: setup resolution should fail fast rather than silently falling back to a single-executor run.
- `--service-tier` passed to the SOL lineage: the executor throws; the mitigation is procedural (never pass it), not a runtime guard this packet builds.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Single command launch, but sweep target is the entire `.opencode/specs/*` tree across every track. |
| Risk | 18/25 | Three heterogeneous CLI executors, gated ordering (must run after 001-005, must precede 007), executor-slug misconfiguration risk. |
| Research | 12/20 | This packet is itself a deep-research packet; setup requires confirming the real command contract and fan-out/state-file conventions (done during scaffolding). |
| Multi-Agent | 13/15 | 3 executor lineages x ~10 iterations = 30 dispatches, each a fresh-context `@deep-research` agent run. |
| Coordination | 12/15 | Depends on 5 sibling phases completing first; gates the next phase (007) on its own convergence. |
| **Total** | **73/100** | **Level 3** |

**Note**: The raw score computes to Level 3 territory, but the packet is intentionally scaffolded at Level 2 pending execution — see the re-leveling note in §1 METADATA.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Executor misconfigured (wrong slug, effort, or the forbidden `--service-tier` flag on SOL) causes a throw or a wrong-model run | H | M | Verify exact slugs/flags against `plan.md` before launch; do not deviate from the brief's verified values. |
| R-002 | Phase 006 launched before phases 001-005 actually reach the parent's Phase Handoff Criteria | H | M | Explicitly check each phase's `graph-metadata.json`/`implementation-summary.md` status before invoking launch (Phase 1). |
| R-003 | `research/research.md` never gets committed before someone proceeds to phase 007 | H | L | REQ-004 and SC-001 are hard gates in this spec and in the checklist. |
| R-004 | Divergent-mode Council pivots consume iteration budget without adding new findings | M | M | Accepted by design; the synthesis/triage step still applies regardless of pivot outcomes. |

---

## 11. USER STORIES

### US-001: Run the plan-named workflow, not a substitute (Priority: P0)

**As the** operator coordinating the parent 000 packet, **I want** the phase 006 research sweep to run the exact `/deep:research :auto` workflow specified in the brief, **so that** results are structurally consistent with every other deep-research packet in this repo and no ad hoc loop logic is introduced.

**Acceptance Criteria**:
1. Given the launch command in `plan.md`, when phase 006 is executed, then it invokes `opencode run --command deep/research` with the `:auto` suffix and the exact documented flags — never a manual shell loop or direct `@deep-research` Task dispatch.

---

### US-002: Give phase 007 a durable evidence gate (Priority: P0)

**As** the eventual executor of phase 007, **I want** a committed `research/research.md` with triaged findings, **so that** I have documented evidence before running the destructive memory-database teardown.

**Acceptance Criteria**:
1. Given phase 006 has converged, when phase 007 begins, then `research/research.md` exists, is committed, and its findings are either remediated with evidence or explicitly deferred with a recorded reason.

---

## 12. OPEN QUESTIONS

- Worktree vs. current-branch execution target for the brief's `--dir <clean worktree>` requirement — sk-git's ask-first A/B gate has not been run and this scaffold does not decide it.
- The brief's literal `--executors=[glm,sol,luna]` shorthand is not valid JSON per the command's documented `--executors=<json>` schema — the exact payload must be assembled at launch time (see `plan.md` Phase 1, Task T004), not copied verbatim.
- Whether phases 001-005 have actually reached the parent's Phase Handoff Criteria is unverified at scaffold time (all five show Draft status in the parent's Phase Documentation Map as of 2026-07-16).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: Deferred — packet is scaffolded at Level 2; `decision-record.md` is not authored in this pass and may be added if the packet is re-leveled to 3 after execution (see `checklist.md` §L3 Architecture Verification).
- **Parent Spec**: See `../spec.md`

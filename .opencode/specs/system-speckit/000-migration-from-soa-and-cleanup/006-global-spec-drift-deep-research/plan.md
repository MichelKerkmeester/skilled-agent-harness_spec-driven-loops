---
title: "Implementation Plan: Global spec-drift and prior-context-optimization deep-research sweep"
description: "Launch a single /deep:research :auto run bound to this spec folder, fanned out across 3 executor lineages (GLM, SOL, LUNA; ~10 iterations each, 30 total), divergent convergence-mode, stop-policy=max-iterations, sweeping ALL of .opencode/specs/* for spec drift and prior context-optimization efforts, synthesizing a committed research/research.md before phase 007."
trigger_phrases:
  - "global spec drift research plan"
  - "deep research fan-out plan"
  - "divergent convergence mode launch"
  - "006 research plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded implementation plan for Level 2"
    next_safe_action: "Confirm phases 001-005 handoff criteria met"
    blockers:
      - "Blocked until sibling phases 001-005 complete"
    key_files:
      - "spec.md"
      - "tasks.md"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Global spec-drift and prior-context-optimization deep-research sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode `/deep:research` command (Markdown router + YAML-orchestrated workflow); no application code changes |
| **Framework** | `system-deep-loop` deep-research packet; fan-out via `step_fanout_spawn` (CLI pool for `cli-opencode`/`cli-codex`, sequential dispatch for `native`) |
| **Storage** | This packet's own `research/` state folder: `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, `research.md`, `iterations/iteration-NNN.md`, `lineages/{label}/**` |
| **Testing** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict`; per-lineage iteration/state evidence; `git log`/`git show` proof that `research/research.md` is committed |

### Overview
Launch exactly one `/deep:research :auto` run bound to this spec folder. The command's owned YAML workflow (not this plan, and not a hand-rolled substitute) resolves setup, spawns 3 independent executor lineages under `research/lineages/{glm,sol,luna}/`, runs each to ~10 iterations in `divergent` convergence-mode with `stop-policy=max-iterations`, merges all three lineage registries via `fanout-merge.cjs`, and synthesizes the durable `research/research.md`. This plan's job is to get the launch inputs right (executor schema, ordering gate, workspace choice) and to verify the durable output before phase 007 is authorized.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| `.opencode/commands/deep/research.md` (read) | Confirms `:auto` suffix resolves setup from flags/PRE-BOUND markers, then loads `deep_research_auto.yaml`; confirms `--stop-policy`, `--convergence-mode`, `--executors`, `--concurrency` are documented workflow-input flags, not execution modes. |
| `.opencode/skills/system-deep-loop/deep-research/feature_catalog/loop_lifecycle/fanout_dispatch.md` (read) | Confirms `--executors <json>` is an escape-hatch flag whose value is an array of executor-group objects, and that 2+ executors triggers `config.fanout`; each lineage writes to an isolated `{artifact_dir}/lineages/{label}/` directory. |
| `.opencode/skills/system-deep-loop/deep-research/feature_catalog/convergence/divergent_convergence_mode.md` (read) | Confirms `divergent` only changes handling of an eligible legal STOP (`composite_converged`/`all_questions_answered`) into a bounded native Council pivot that picks a new focus and continues; `maxIterationsReached`/`error`/`blockedStop`/etc. do not pivot. |
| `.opencode/skills/system-deep-loop/deep-research/SKILL.md:307` (read) | Confirms the research state packet lives at `{spec_folder}/research/` directly for a root-spec target on a first run with an empty `research/` directory -- this packet qualifies, since it has no prior `research/` content. |
| `.opencode/commands/deep/assets/deep_research_presentation.txt:333` (grep) | Confirms the real `--executors` JSON shape: `--executors='[{"kind":"cli-opencode","model":"...","label":"...","count":N}, ...]'` -- the brief's `[glm,sol,luna]` shorthand is NOT this shape and must be translated (see §3 FIX ADDENDUM). |
| Parent `../spec.md` Phase Documentation Map (read) | Confirms phase 006 is gated behind phases 001-005 and gates phase 007; all five numbering phases show Draft status at scaffold time. |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Real command contract verified against source (`.opencode/commands/deep/research.md` and the `system-deep-loop/deep-research` feature catalog), not assumed from the brief alone.
- [ ] Phases 001-005 confirmed complete against the parent's Phase Handoff Criteria (unverified at scaffold time).

### Definition of Done
- [ ] `/deep:research :auto` launched with the exact flag set in §4 Phase 2 below.
- [ ] 30 total iterations complete across exactly 3 lineages (GLM, SOL, LUNA).
- [ ] `research/research.md` synthesized and committed.
- [ ] Findings triaged (remediated or explicitly deferred) per the parent's 006→007 handoff criteria.
- [ ] `validate.sh --strict` passes for this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-driven fan-out research loop. This plan does not implement loop mechanics; it configures and launches the existing `/deep:research :auto` workflow and verifies its output.

### Key Components
- **`/deep:research :auto` command**: owns setup resolution, YAML dispatch, per-iteration `@deep-research` agent spawns, convergence checks, divergent pivots, and synthesis. This plan never dispatches `@deep-research` directly.
- **3 executor lineages** (`glm`, `sol`, `luna`): each an independent, fully isolated research loop under `research/lineages/{label}/`, converging (or running to `max-iterations`) on its own.
- **`fanout-merge.cjs`**: consolidates all 3 lineage `findings-registry.json` files into one merged `deep-research-findings-registry.json` before synthesis.
- **`step_compile_research`**: synthesizes the merged registry plus per-lineage iteration artifacts into the durable `research/research.md`.

### Data Flow
Setup resolves `deep-research-config.json` with `convergenceMode: divergent`, `stopPolicy: max-iterations`, and `fanout.executors` = the 3-entry array below → `step_fanout_spawn` spawns the 3 CLI lineages concurrently (pool-capped at `--concurrency=3`) → each lineage runs ~10 iterations of dispatch → convergence-check → divergent-pivot-if-eligible → on all 3 lineages reaching completion, control jumps to `phase_synthesis` → `fanout-merge.cjs` merges the 3 registries → `step_compile_research` writes `research/research.md` → continuity refresh through this packet's canonical docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet is a read-only research sweep, not a code fix — the template's default producer/consumer inventory does not apply to application code. The one surface that genuinely needs an inventory-style translation before launch is the `--executors` flag itself, because the brief's shorthand is not the command's real JSON schema.

| Surface | Current Role (brief shorthand) | Required Translation | Verification |
|---------|--------------------------------|------------------------|--------------|
| GLM lineage | `glm` | `{"kind":"cli-opencode","model":"zai-coding-plan/glm-5.2","reasoning_effort":"max","label":"glm","count":1,"iters":10}` | `research/deep-research-config.json` fanout entry matches. |
| SOL lineage | `sol` | `{"kind":"cli-opencode","model":"openai/gpt-5.6-sol-fast","reasoning_effort":"high","label":"sol","count":1,"iters":10}` — **no `service_tier` key** | Config entry has no `service_tier`/`--service-tier` field; SOL lineage does not throw at spawn. |
| LUNA lineage | `luna` | `{"kind":"cli-codex","model":"gpt-5.6-luna","reasoning_effort":"max","service_tier":"fast","label":"luna","count":1,"iters":10}` | Config entry matches; lineage dispatches via `cli-codex`, not `cli-opencode`. |

Required inventories:
- Same-class producers: N/A — no application source files are read, deleted, or created by this packet's execution beyond its own `research/` state and `implementation-summary.md`.
- Consumers of changed symbols: N/A — no shared symbol, constant, or public field changes; the only "consumer" of this packet's output is phase 007, which reads `research/research.md` as its evidence gate (see `spec.md` REQ-004/SC-001).
- Matrix axes: executor kind (`cli-opencode` x2, `cli-codex` x1), effort level (`max`, `high`, `max`), and the presence/absence of `service_tier` (LUNA only) are the three axes that must each resolve correctly before launch.
- Algorithm invariant: N/A — no path/redaction/parser/resolver/security logic is touched by this packet.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phases 001-005 each independently pass `validate.sh --recursive --strict` and have clean `git status` per the parent's Phase Handoff Criteria.
- [ ] Verify the GLM/SOL/LUNA executor slugs, effort levels, and the SOL `--service-tier` prohibition against this plan's §3 FIX ADDENDUM table.
- [ ] Resolve worktree vs. current-branch execution via sk-git's ask-first A) worktree / B) current-branch gate (per CLAUDE.md Git Workspace Safety — this plan does not pre-decide it).
- [ ] Assemble the exact `--executors` JSON payload from §3 FIX ADDENDUM (three objects, `concurrency=3`).

### Phase 2: Core Implementation
- [ ] Launch:
  ```
  opencode run --command deep/research \
    ":auto 'spec drift + prior context-optimization efforts across all .opencode/specs/*' \
     --spec-folder=.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research \
     --convergence-mode=divergent --stop-policy=max-iterations \
     --executors='<assembled JSON from Phase 1>' --concurrency=3" \
    --dir <resolved workspace from Phase 1> </dev/null
  ```
- [ ] Confirm all 3 lineages (`glm`, `sol`, `luna`) reach ~10 iterations each (30 total), or capture a documented reason for variance.
- [ ] Confirm `fanout-merge.cjs` consolidates the 3 lineage `findings-registry.json` files into one merged registry.
- [ ] Confirm `step_compile_research` synthesizes `research/research.md`.

### Phase 3: Verification
- [ ] Verify `research/research.md` exists, is non-empty, and is committed to git before any phase 007 action.
- [ ] Triage findings: remediate trivial in-scope items inline with evidence, or explicitly defer with a recorded reason.
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research --strict`.
- [ ] Update `implementation-summary.md` with iteration counts, per-lineage completion evidence, and the findings triage table.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | This packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
| Research state integrity | `research/` state files | Spot-check `deep-research-state.jsonl` and per-lineage `findings-registry.json` for the expected 10/10/10 iteration split and route-proof fields (`target_agent: "deep-research"`, `resolved_route`, `agent_definition_loaded: true`) |
| Executor smoke | GLM/SOL/LUNA | `--dry-run` (confirm flow) or a single-iteration check before committing to the full 30-iteration launch, if available for the fan-out path |
| Durable-output proof | `research/research.md` | `git log`/`git show` confirming the commit predates any phase 007 action |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-005 (parent Phase Handoff Criteria) | Internal (sibling phases) | Draft (unverified complete) at scaffold time | This phase cannot begin; must wait for all five. |
| sk-git ask-first worktree/current-branch gate | Internal process gate | Not yet run | Launch's `--dir <clean worktree>` target is unresolved until this gate is answered. |
| `cli-opencode` (GLM, SOL lineages) | External CLI tool | Assumed available per brief's verified slugs | Fan-out cannot spawn those two lineages. |
| `cli-codex` (LUNA lineage) | External CLI tool | Assumed available per brief's verified slugs | Fan-out cannot spawn the LUNA lineage. |
| `fanout-merge.cjs` / `step_compile_research` | Internal script (owned by `/deep:research` workflow) | Available per SKILL.md | Would block registry merge and `research.md` synthesis — out of this plan's control to fix; escalate if it fails. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any lineage fails unrecoverably (e.g., SOL throws on a stray `--service-tier`, or an executor slug is wrong), or `research/research.md` is never produced.
- **Procedure**: Do not proceed to phase 007. Do not delete anything outside this packet's own `research/` folder. If a single lineage is recoverable, resume it individually; if the entire run is corrupted, delete only this phase's `research/` state (never the parent tree, never sibling phases) and relaunch cleanly per the deep-research command's own resume semantics.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup) -> Phase 2 (Launch + 3-lineage loop) -> Phase 3 (Verify + triage)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Parent phases 001-005 complete | Launch |
| Launch + Loop | Setup | Verification |
| Verification | Launch + Loop | Phase 007 authorization |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low (gate confirmation + JSON assembly) | 1-2 hours |
| Core Implementation | High (30 agent-autonomous iterations across 3 lineages; wall-clock dominated by lineage timeouts, not active operator effort) | 4-8 hours active / longer elapsed |
| Verification | Medium (commit proof, triage, strict validation) | 1-2 hours |
| **Total** | | **6-12 hours active effort** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Parent Phase Handoff Criteria confirmed for all five sibling phases.
- [ ] `git status` clean before launch.
- [ ] Executor JSON payload assembled and reviewed against §3 FIX ADDENDUM.

### Rollback Procedure
1. Pause or stop the affected lineage(s); do not merge partial/corrupted state into `research.md`.
2. Resume the specific lineage if its state is recoverable, or restart that lineage cleanly.
3. Re-verify `research/research.md` synthesis only once all 3 lineages report a completion state.
4. Do not authorize phase 007 until re-verification passes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete or reset only this phase's own `research/` state folder and relaunch; no other packet or track is touched.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phases 001-005 (sibling, must ALL complete)
        |
        v
   Phase 1: Setup (this packet)
        |
        v
   Phase 2: Launch /deep:research :auto
        |
   +----+----+----+
   v         v         v
 GLM       SOL       LUNA        (3 independent lineages, ~10 iters each)
   |         |         |
   +----+----+----+
        |
        v
  fanout-merge.cjs (consolidate 3 registries)
        |
        v
  step_compile_research -> research/research.md
        |
        v
   Phase 3: Verify + triage
        |
        v
  Phase 007 authorization gate
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Sibling phases 001-005 | Parent packet scope | Clean numbering state across 5 tracks | This phase's launch |
| Fan-out launch | Setup (Phase 1) | 3 running lineages | Registry merge |
| GLM/SOL/LUNA lineages | Fan-out launch | 3 independent findings registries | `fanout-merge.cjs` |
| `fanout-merge.cjs` | All 3 lineages complete | Merged findings registry | `step_compile_research` |
| `step_compile_research` | Merged registry | `research/research.md` | Phase 3 verification |
| Phase 3 verification | `research/research.md` | Committed durable output + triage | Phase 007 authorization |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm phases 001-005 reach the parent's Phase Handoff Criteria** - CRITICAL
2. **Launch the 3-lineage fan-out with the correct executor JSON** - CRITICAL
3. **All 30 iterations complete (10 per lineage)** - CRITICAL
4. **`research/research.md` synthesized, committed, and findings triaged** - CRITICAL

**Total Critical Path**: One coordinated launch plus autonomous fan-out execution plus a verification/triage pass.

**Parallel Opportunities**:
- The 3 executor lineages (GLM, SOL, LUNA) run concurrently by design (`--concurrency=3`) — this is the fan-out's whole purpose, not an optimization applied after the fact.
- Verifying the SOL/GLM/LUNA executor schema (Phase 1) can happen alongside resolving the worktree-vs-branch gate; both must finish before launch.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | Sibling-phase gate confirmed, executor JSON assembled, workspace choice resolved | Phase 1 |
| M2 | Fan-out running | 3 lineages launched under `research/lineages/{glm,sol,luna}/` | Phase 2 |
| M3 | Research converged | 30 total iterations complete, `research/research.md` committed, findings triaged, `validate.sh --strict` passes | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Use the plan-named `/deep:research :auto` fan-out workflow, not a hand-rolled loop

**Status**: Accepted

**Context**: The brief explicitly names `/deep:research :auto` with specific flags as the required launch mechanism, and CLAUDE.md's PLAN-WORKFLOW LOCK forbids silently hand-rolling a substitute for a plan-named, purpose-built workflow.

**Decision**: Launch via `opencode run --command deep/research` with the `:auto` suffix and the documented `--convergence-mode`, `--stop-policy`, `--executors`, and `--concurrency` flags, exactly as the command's own contract (`.opencode/commands/deep/research.md`) defines them — never a manual shell loop, custom `/tmp` state, or direct Task-tool dispatch of `@deep-research`.

**Consequences**:
- Positive: results are structurally consistent with every other deep-research packet in this repo (same state-file layout, same continuity integration, same convergence semantics).
- Negative + mitigation: the command's real `--executors` schema is stricter JSON than the brief's shorthand; mitigated by the translation table in §3 FIX ADDENDUM, verified against actual command documentation rather than assumed.

**Alternatives Rejected**:
- Single-executor sequential run: rejected — the brief explicitly requires 3-lineage fan-out for coverage breadth across the entire specs tree.
- Default convergence-mode: rejected — the brief explicitly wants `divergent` mode with `stop-policy=max-iterations` so the loop does not converge early on a tree this large.

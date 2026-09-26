---
title: "Goal: cli-jev workflow integration"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli-jev workflow integration goal"
  - "jev research packet goal"
  - "jev integration completion criteria"
  - "jev goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration"
    last_updated_at: "2026-09-26T16:10:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Gather context for 001-deep-research"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
# Goal: cli-jev workflow integration

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Find which Jev typed judgments earn a measured, opt-in place in `.skilled` through two forced-depth research rounds, an AI Council review and fresh Opus syntheses, then reconcile the Planned build phases with the final synthesis.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Round 1: 10 iterations each of `deepseek-v4.1-flash` max and `mimo-v2.6-pro` high (cli-pi) and `grok-4.7-xhigh-fast` (cli-cursor; no MAX tier) |
| D2 | Round 2: 5 iterations each of `grok-4.7-xhigh-fast`, `mimo-v2.6-pro` high, `swe-2-max` (cli-devin) and `deepseek-v4.1-flash` max, over the repo and `context/` |
| D3 | Both rounds: stop policy max-iterations, convergence off, all lineages concurrent |
| D4 | Opus 5.5: a fresh xhigh re-synthesizes round 1 from the council review, a fresh max synthesizes each round, high prepares angles and authors phases |
| D5 | Every feature is opt-in and dormant unless `jev auth status` exits 0; keyless it behaves exactly as today; Jev gets no secret |
| D6 | Autonomous; stop only for a missing credential, an irreversible step or a push. Worktree branch, path-scoped commits, no push or merge |
| D7 | Build phases stay Planned: amending or adding one is allowed, building one is not |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-deep-research/goal.md` |
| 002 | `002-advisor-jev-tiebreak-arm/goal.md` |
| 003 | `003-goal-verifier-jev-shadow/goal.md` |
| 004 | `004-deep-research-expansion/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `001-deep-research` is Complete: four digests, 30 angles, `grok-4.7-xhigh-fast` in both cli-cursor allowlists with a live `OK`, and three lineages of 10 iterations ending `maxIterationsReached`
- [ ] `001-deep-research/research/research.md` is re-synthesized by a fresh Opus 5.5 xhigh leaf from `001-deep-research/ai-council/council-report.md` and lists its changes
- [ ] `004-deep-research-expansion` lineages `grok`, `mimo`, `swe` and `deepseek` each hold `iteration-001.md` to `iteration-005.md` and a state log ending `maxIterationsReached`
- [ ] `004-deep-research-expansion/research/research.md`, by a fresh Opus 5.5 max leaf, ranks each recommendation build-now, next, later or drop with a seam `file:line`, metric, key gate and smallest slice
- [ ] Each build phase the final synthesis proposes is a Planned child with `spec.md`, `plan.md`, `tasks.md`, `goal.md`, binding and phase-map rows and a `jev auth status` key gate
- [ ] `validate.sh --strict --recursive` on this packet prints `RESULT: PASSED` and `check-goal.cjs` passes on the parent and every child
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Worktree | Done | `.worktrees/069-cli-jev-workflow-integration` at `f9d701bd13`, provisioned: 4 installed, 2 built, 0 failed |
| Scaffold | Done | `create.sh --phase` wrote the parent and `001-deep-research` |
| Context and angles | Done | Four digests (757 lines), `research-angles.md` with 30 angles, topic tightened by prompt-improver on Sonnet (748 chars) |
| Grok 4.7 roster | Done | `9fe8526284`; vitest 257/257, typecheck clean, guard fresh, live probe `OK` |
| Fan-out | Done | Runner exit 0, `failed: 0`; deepseek, mimo and grok each 10 state records and files ending `maxIterationsReached`, all on attempt 1 (grok 11 min, deepseek 20, mimo 44); merge 85 key findings; resource map from 30 deltas |
| Synthesis | Done | `research/research.md` (112 KB) by a fresh Opus 5.5 max leaf: 1 build-now, 1 next, 16 later, 32 drop, 3 dead ends. The host reopened 7 cited seams (all resolved) and checked R1, R2 and the compaction drop against the code |
| Build phases | Done | `002-advisor-jev-tiebreak-arm` and `003-goal-verifier-jev-shadow` authored as Planned by one Opus 5.5 high leaf each; the host reran strict validate (`RESULT: PASSED`) and `check-goal` (4/4) on both |
| Close | Done | All six criteria met: context and angles present; allowlists, vitest 257/257 and probe `OK` (`9fe8526284`); three lineages of 10 ending `maxIterationsReached`; `research.md` ranked; 002 and 003 Planned with binding, phase-map rows and the key gate; recursive strict validate 4 x `RESULT: PASSED`, `check-goal` 4/4 on all four folders. Committed `021437ceda` on the worktree branch; not pushed or merged |

### Deviations and findings

| Item | Note |
|------|------|
| Grok 4.7 MAX fast | `cursor-agent --list-models` on 2026-09-26 lists `grok-4.7-{low,medium,high,xhigh}` with `-fast` variants and no MAX tier. The highest-effort fast id, `grok-4.7-xhigh-fast`, stands in (D1). |
| Level 1 child has no `acceptance-criteria.md` | sk-create-goal's phase-parent workflow expects one per child. The approved plan keeps the research child at Level 1, as packet 030 did, so its goal criteria come from `spec.md` requirements. |
| Spec-kit CLI build | `create.sh --phase` first failed in the fresh worktree because `runtime/cli/dist/` was not built; `npm run build` under `runtime/cli` fixed it. |
| prompt-improver on Opus | The agent definition denies Opus, so the topic pass ran on Sonnet, an eligible pair. |
| Containment advisories | Each lineage flagged `scratch/synthesis-brief.md`, which the orchestrator edited after launch. No lineage wrote outside its directory. |
| Key gate (operator, 2026-09-26) | Every feature must be optional and active only when a Jev key is present. D5 and the build-phase criterion amended. Live check: `jev auth status` exits 0 for a stored or exported key and 3 with none; it tests presence, not validity, so a bad key fails on the first call. |
| Plugin paths | `.skilled/plugins` is a git symlink to `../.opencode/plugins`, so the OpenCode goal plugin is one file (one inode); a promoted 003 mode edits `.opencode/plugins/opencode-goal.js` once. |
| 002 level | `recommend-level.sh --loc 200 --files 2` scores Level 0; 002 stays Level 1 because the build-phase criterion requires `plan.md` and `tasks.md`. |
| Close report | `step_convergence_report` ran and recorded `synthesis_incomplete`: the merge rebuilt 85 of 112 count-only findings (deepseek 8 of 57; mimo and grok whole). The synthesis read all 30 iteration files directly, so its ranking stands. The merge parser gap is recorded in `research.md` section 17, not fixed here (out of scope). |
<!-- /ANCHOR:log -->

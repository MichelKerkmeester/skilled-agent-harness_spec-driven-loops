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

**Objective:** Find where a classifier model, Jev (hosted) or Deem (open weights, local), cuts the main AI's context and manual review work: research first, then reconcile the Planned build phases with a fresh synthesis.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Two backends: every feature runs on Jev or Deem, dormant unless one is available (Jev: `jev auth status --provider <p>` exits 0; Deem: the local server passes a health check). With neither, behavior is exactly today's. Jev gets no secret |
| D2 | New hub `cli-classifier` holds `cli-jev` (moved) and `cli-deem` (new). Check online for a Deem CLI first, else derive `cli-deem` from `cli-jev`. The research decides its shape |
| D3 | Deem 0.8B bf16 is served on this Mac after my yes to a plan naming its rollback, and kept current with Deem's releases. Nothing else is built |
| D4 | Round 3 in `007`: one fan-out run, max-iterations, convergence off, lineages isolated, none calls Jev: `grok-4.7-xhigh-fast` (cli-cursor), `deepseek-v4.1-flash` max, `mimo-v2.6-pro` high (cli-pi) and `swe-2-max` (cli-devin) 10 each; `glm-5.3-flash` max (cli-pi) 5 |
| D5 | One Opus 5.5 high lead per lineage reviews and steers each iteration; a fresh Opus 5.5 max synthesizes; Opus 5.5 high amends and authors phases |
| D6 | Autonomous; stop only for the Deem install yes, a missing credential or a push. Worktree 069, path-scoped commits, no push or merge, no key in any file, no `.env` opened |
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
| 005 | `005-compaction-recall-harness/goal.md` |
| 006 | `006-goal-criteria-lint/goal.md` |
| 007 | `007-classifier-deep-research/goal.md` |
| 008 | `008-cli-classifier-hub/goal.md` |
| 009 | `009-cli-jev-hub-move/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] I got a Deem install plan with its rollback before any install, and `007-classifier-deep-research/context/deem-local.md` records the 0.8B bf16 passing a health check with latency and memory, or why it does not serve
- [x] In `007-classifier-deep-research`, lineages `grok`, `deepseek`, `mimo` and `swe` each hold 10 iteration files and `glm` holds 5, and every state log ends `maxIterationsReached`
- [x] `007-classifier-deep-research/research/research.md`, by a fresh Opus 5.5 max leaf, covers Deem on this Mac, drops that flip under Deem, context reduction, validators, sk-prompt, sk-design, open discovery and build order, ranking each idea with a seam `file:line`, metric, backend gate and smallest slice
- [x] 002, 003, 005 and 006 carry the two-backend gate, and each phase the synthesis proposes, `cli-classifier` and `cli-deem` included, is a Planned child with spec, plan, tasks, goal, binding and phase-map rows
- [x] `validate.sh --strict --recursive` on this packet prints `RESULT: PASSED` and `check-goal.cjs` passes on the parent and every child
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
| Round 2 | Done | Round 1 re-synthesized from the council review; `grok`, `mimo`, `swe` and `deepseek` ran 5 iterations each to `maxIterationsReached`; a fresh Opus 5.5 max leaf wrote the final synthesis (build-now R1 and R19, next R2, R20 and R21). 002 and 003 amended and 005 and 006 authored as Planned, with binding, phase-map and handoff rows |
| Round 3 directive | Set | 2026-09-27: the operator approved the round-3 prompt (Jev and a local Deem as classifier models, a `cli-classifier` hub, context reduction and validators). Objective, decisions and criteria replaced; the prior six criteria were all met at `17bc67ad2b`. Detail binds through `007-classifier-deep-research/goal.md` |
| Deem served | Done | 0.8B bf16 on MPS at `127.0.0.1:8300` after the operator's yes, current with Deem's releases via the launchd schedule. Measured and documented in `007-classifier-deep-research/context/deem-local.md`, including update, rollback and the post-run measurements |
| Round 3 fan-out | Done | 2026-09-27, launched from `506e4e6430`: runner exit 0, 5 of 5 lineages on attempt 1, no containment advisory. grok, deepseek, mimo and swe hold 10 iterations each and glm 5, all ending `maxIterationsReached`. One Opus 5.5 high lead reviewed every iteration |
| Round 3 synthesis | Done | `007-classifier-deep-research/research/research.md` (1,665 lines) by a fresh Opus 5.5 max leaf: 2 build-now, 4 next, 18 later, 1 drop, R23 to R26 new. 136 citations checked: 130 resolved, 2 drifted, 4 failed, none load-bearing. The host reopened six citations (all resolved) and checked R1, R19 and R23, R23 by a live wire test: Deem answers `jev-cli`'s `choice` and `score` with HTTP 400 |
| Round 3 phases | Done | 002, 003, 005 and 006 amended for two backends. `008-cli-classifier-hub` and `009-cli-jev-hub-move` authored as Planned. One Opus 5.5 high leaf per phase |
| Round 3 close | Done | `validate.sh --strict --recursive`: `RESULT: PASSED` on all 10 folders with 0 errors and 0 warnings. `check-goal.cjs`: 4/4 on the parent and all nine children. `step_convergence_report` recorded `synthesis_incomplete` (57 of 173 count-only findings), as in rounds 1 and 2 |

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
| D5 provider amendment (2026-09-27) | The round-2 synthesis (C8) found that `jev auth status` checks the `official` key while judgments use `JEV_PROVIDER` (`jev_cli/__init__.py:307`, `:339`). Host-confirmed live with a dummy OpenRouter key: plain `auth status` exit 3, `--provider openrouter` exit 0. D5 now names the provider, which keeps the operator's rule (active only when a key is present) true for every provider |
| D3 amendment (2026-09-27) | The operator chose Deem 0.8B in bf16 over the 9B after comparing RAM (about 1.6 GB against 18 to 20 GB), and asked that it auto-update whenever Deem releases a new version. D3 and criterion 1 amended to match; the 9B stays a documented option in the research |
| Section 14 approval | The round-3 synthesis says each amendment to 002, 003, 005 and 006 waits for operator approval. D5 and the fourth criterion above already direct those amendments, so the host applied them and records it here |
| Round 3 run corrections | Steering reached iterations only sometimes, so the leads wrote their reviews as annotations for the synthesis. The transcript dedupe rule was completed mid-run. `deem-ctl` gained a checked update with the server stopped, an honest failed-restore message and `rollback`. Details in `007-classifier-deep-research/goal.md` |
| Deem exposure | Deem's server answers any web page (`Access-Control-Allow-Origin: *`, no authentication). It listens on localhost only, so it exposes compute, not data. Closing it needs a patch to Deem or a proxy, the operator's call |
| Close report | `step_convergence_report` ran and recorded `synthesis_incomplete`: the merge rebuilt 85 of 112 count-only findings (deepseek 8 of 57; mimo and grok whole). The synthesis read all 30 iteration files directly, so its ranking stands. The merge parser gap is recorded in `research.md` section 17, not fixed here (out of scope). |
<!-- /ANCHOR:log -->

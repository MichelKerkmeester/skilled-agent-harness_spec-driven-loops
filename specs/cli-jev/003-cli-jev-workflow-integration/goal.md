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
    last_updated_at: "2026-09-27T16:10:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Merged main into worktree 069 and released 011 to 015 for CLI-executor builds"
    next_safe_action: "Build 011 to 015 with CLI executors, verify each, and close the sixth criterion"
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

**Objective:** Find where a classifier model, Jev (hosted) or Deem (local), cuts the main AI's context and manual review work: research, then reconcile the Planned phases with a fresh synthesis, and plan and build the owner fixes it found.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Two backends: every feature runs on Jev or Deem, dormant unless one is available (Jev: `jev auth status --provider <p>` exits 0; Deem: the local server passes a health check). With neither, behavior is exactly today's. Jev gets no secret |
| D2 | New hub `cli-classifier` holds `cli-jev` (moved) and `cli-deem` (new) |
| D3 | Deem 0.8B bf16 is served on this Mac, kept current with Deem's releases. Only operator-released phases are built: 018, 010, then 011 to 015 |
| D4 | Round 3 ran in `007` |
| D5 | Opus 5.5 high leaves author and amend phases. CLI executors build them. The orchestrator verifies |
| D6 | Autonomous. Stop only for an install yes or a missing credential. Worktree 069, path-scoped commits, no push, no merge to main, no key in a file, no `.env` opened |
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
| 010 | `010-trigger-index-search-fixes/goal.md` |
| 011 | `011-spec-validator-fixes/goal.md` |
| 012 | `012-sk-doc-validator-and-reference-fixes/goal.md` |
| 013 | `013-sk-prompt-framework-docs/goal.md` |
| 014 | `014-sk-design-doc-and-routing-check/goal.md` |
| 015 | `015-fanout-merge-and-steering-fixes/goal.md` |
| 016 | `016-deem-local-hardening/goal.md` |
| 017 | `017-deem-search-narrowing-arm/goal.md` |
| 018 | `018-worktree-provision-shared-link/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] I got a Deem install plan with its rollback before any install, and `007-classifier-deep-research/context/deem-local.md` records the 0.8B bf16's health check, latency and memory
- [x] In `007-classifier-deep-research`, lineages `grok`, `deepseek`, `mimo` and `swe` each hold 10 iteration files and `glm` holds 5, and every state log ends `maxIterationsReached`
- [x] `007-classifier-deep-research/research/research.md`, by a fresh Opus 5.5 max leaf, covers Deem on this Mac, flipped drops, context reduction, validators, sk-prompt, sk-design, discovery and build order, ranking each idea by seam `file:line`, metric, backend gate and slice
- [x] 002, 003, 005 and 006 carry the two-backend gate, and those four and 008 to 018 are children with spec, plan, tasks, goal, binding and phase-map rows
- [x] `validate.sh --strict --recursive` on this packet prints `RESULT: PASSED` and `check-goal.cjs` passes on the parent and every child
- [x] 018, 010 and 011 to 015 are Complete: each child goal's criteria are ticked with evidence and `validate.sh --strict` passes on each
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
| Main sync | Done | `d6e512e6b5` merged main into worktree 069 (0 behind after it). Every conflicted roster file and both compiled-routing manifests took main's side, and the duplicate changelog `v1.4.3.0.md` was dropped. The trigger index and three fixtures were rebuilt from the merged tree, and `--check` exited 0. Route guard fresh, deep-loop vitest 257/257, trigger-index vitest 57/57, recursive strict validate 19 x `RESULT: PASSED` |
| Owner-fix phases | Done | Verified from the final state after `c000edec2f`. Criterion 4: the phase map, the folders on disk and the binding targets are equal sets of 18 (001 to 018), every target `goal.md` exists, and phases 010 to 018 each hold spec, plan, tasks, acceptance-criteria, goal and implementation-summary with status Planned. Criterion 5: `validate.sh --strict --recursive` printed `RESULT: PASSED` for all 19 folders with `Errors: 0  Warnings: 0` and exit 0, and `check-goal.cjs` printed `RESULT: PASSED` on the parent and all 18 children (19 of 19) |

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
| Parent amendment for 010 to 017 (2026-09-27) | Eight binding rows took the durable slice from 3,905 to 4,126 characters. Cuts followed the budget reference's order. D4 lost the lineage roster and D5 the leads and synthesis wording, both restated by `007-classifier-deep-research/goal.md` D2, D6 and D7. D2 lost the online-check and derive clause, which `007` D1 and D3 settled. The objective dropped two words and names the owner fixes. Criterion 4 names phases 010 to 017, and no criterion was dropped. Result: 3,986 characters, `packet_budget=ok` |
| Phase 018 added (2026-09-27) | The coordinator added `018-worktree-provision-shared-link`. One binding row and criterion 4's range (010 to 018) took the slice to 4,041 characters. D3 lost "after my yes to a plan naming its rollback", which `007-classifier-deep-research/goal.md` D1 states in full and criterion 1 still checks. No criterion was dropped. The spec's handoff row records that 008's and 009's `parent-skill-check.cjs` checks depend on 018 in a freshly provisioned worktree |
| Build release amendment (2026-09-27) | Source: the operator's answer "Amend D3, build 018 then 010". D3 now builds only operator-released phases, 018 then 010. D5 adds building, with the orchestrator verifying. A sixth criterion, unchecked, requires 018 and 010 Complete. The slice rose to 4,196 characters. Cuts in budget order, every decision ID kept because children cite D1 and D5: D4 and D5 shortened, and D6 now stops for any install yes, which covers 018's one-time worktree repair. Criterion 1 lost its "or why it does not serve" branch, since Deem serves. Criterion 3 was reworded shorter. Criterion 4 now lists its phases and drops "Planned", which stops being true once 018 and 010 are built. All six criteria stay checkable. Result: 3,997 characters, `packet_budget=ok`. `spec.md`'s out-of-scope build line now names the release. The phase map stays Planned |
| Criterion 6 closed (2026-09-27) | `018-worktree-provision-shared-link/goal.md` and `010-trigger-index-search-fixes/goal.md` each have 7 of 7 criteria ticked and 0 open, both `spec.md` files say Status Complete, and `validate.sh <phase> --strict` prints `RESULT: PASSED` on each. Build commits: `1a971ec7e6` (018 fix), `a0368b4a58` (010 code, with `--scoring-only` and the Gate 1 line in `AGENTS.md`), `2136a432ae` (docs) and `92eda999e6` (index rebuilt from a HEAD archive). Per the orchestrator, the whole-index `--check` against a fresh archive of HEAD printed 0 stale, 0 obsolete and 0 untrusted, exit 0 |
| Main sync and wave 2 release (2026-09-27) | Source: the operator's "Yes" to three asks (amend D5 so CLI executors build, sync worktree 069 with main first, release 011, 012, 013 and 015 plus 014 with gate option A), then "Take main's roster (Recommended)" after a dry run showed 19 conflicts. D3 now releases 011 to 015. D5: Opus 5.5 high leaves author and amend, CLI executors build, the orchestrator verifies. D6 now forbids a merge to main, since the operator approved merging main into 069. Criterion 6 extends to 011 to 015 and is open again. Cuts in budget order, every criterion kept: D4 lost "none calling Jev", which `007-classifier-deep-research/goal.md` D7 states; the objective's "(open weights, local)" became "(local)"; criterion 4 says "those four" for the four phases it already names. Result: 4,000 characters, `packet_budget=ok` |
| Criterion 6 closed, wave 2 (2026-09-27) | All seven named phases re-checked from the final state: each `goal.md` has every criterion ticked and 0 open (018 7, 010 7, 011 7, 012 5, 013 6, 014 7, 015 6), each `spec.md` says Status Complete, and `validate.sh <phase> --strict` prints `RESULT: PASSED` with 0 `RESULT: FAILED` on each. Builds, by CLI executors from single-change briefs, verified by the orchestrator: 013 `e3cf07f4f9`; 012 `a9dbac98ef`; 014 `fb04862cee`, `def91d168d`, `31768cc51e`; 011 `e9059c8073`, review fixes `03e567cfe7`, `baf2876802`; 015 `7de30fb16f`. Closures by Opus 5.5 high leaves: `53951dc5cf`, `e918fb71f4`, `397786588e`, `62441a3b7c`, `1a95422c70`. Deviations, each logged in its phase: codex hit its usage limit, so cursor `grok-4.7-xhigh-fast` built the remaining code briefs; 011 was committed before its cross-family review (no P0 or P1; its P2s fixed in follow-up commits); 015's first full suite failed the legacy-shadow parity test, repaired in-scope before its single build commit (final 2713 passed, baseline 2708 + 5); 014's scope row and 011's and 014's wording-only criteria were amended at close with logged reasons the operator can revert |
<!-- /ANCHOR:log -->

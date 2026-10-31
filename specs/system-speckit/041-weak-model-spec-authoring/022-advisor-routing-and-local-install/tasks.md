---
title: "Tasks: Phase 22: advisor-routing-and-local-install"
description: "Reproduce three advisor misroutes and the missing private command, fix each at its source (doctor lead phrase, graph-support bound, mode-suffix strip, worktree link step), then rerun the advisor and sk-git suites, the live and local probes and the validator."
trigger_phrases:
  - "advisor routing and local install tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 22: advisor-routing-and-local-install

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`A` is `.skilled/skills/system-skill-advisor/runtime`, and commands that name `A` run from there. `G` is `.skilled/skills/sk-git/scripts`. `P` is this phase folder, `specs/system-speckit/054-weak-model-spec-authoring/022-advisor-routing-and-local-install`. "Live" means `node .skilled/bin/skill-advisor.cjs advisor_recommend`; "local" means the scorer with an empty DB dir, semantic off and `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, the regime CI's routing tests use. Every other command runs from the repository root, and git runs with fsmonitor off. A box is ticked only when its Verify command printed what the line says.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Reproduce item 1 (`A/scripts/routing-accuracy/doctor-prompts.jsonl` row doctor-a-08). Verify: live, "disable comment hygiene gate" printed `sk-code 0.8521 0.617808` above `command-doctor-git-hooks 0.8962 0.7`.
- [x] T002 Reproduce item 2 with lane evidence. Verify: live, the rr-iter3-168 prompt ranked system-spec-kit 0.5744 above system-deep-loop 0.5664, with spec-kit's `graph_causal 0.694` drawn from `edge:system-deep-loop->system-spec-kit`; local ranked system-deep-loop first.
- [x] T003 [P] Reproduce item 3. Verify: local, "the draft auto-repair rewrote my files" printed `top null`.
- [x] T004 [P] Locate the private command. Verify: `find <primary>/.skilled/commands -maxdepth 1 -name 'local-*'` printed nothing, while worktree 217 held the router, its assets folder and five mirrors.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T005 Item 1: add `lead_phrases: ["disable comment hygiene gate"]` to the `/doctor:git hooks` route and regenerate the bridges (`.skilled/commands/doctor/_routes.yaml`). Verify: `derive-command-bridges.cjs` listed `command-bridges.generated.json`, `projection.ts` and `skill_advisor.py` as changed; `--check` then printed `"changed": []`; `route-validate.sh` printed `OK: route-validate — 18 routes validated, 2 warnings`, both warnings the existing `--dry-run` notes.
- [x] T006 Item 2: record per-seed graph support and bound it in fusion (`A/lib/scorer/lanes/graph-causal.ts`, `A/lib/scorer/fusion.ts`). Verify: `rg -n 'boundGraphSupportBySeed|positiveSupportBySeed' A/lib/scorer` lists both files.
- [x] T007 Item 3: strip command mode suffixes from prompt tokens in five lanes and the Python twin, and restore the phrase (`A/lib/scorer/text.ts`, `A/scripts/skill_advisor.py`, `.skilled/skills/system-spec-kit/graph-metadata.json`). Verify: `rg -ln tokenizePrompt A/lib/scorer/lanes` lists five files, and `rg -n '"draft auto-repair"'` on the metadata prints lines 71 and 95.
- [x] T008 Recompile the skill graph (`A/scripts/skill-graph.json`). Verify: `skill-graph-freshness.cjs --strict` printed `SIGNAL DRIFT compiled vs disk: none`, rc=0.
- [x] T009 Add the failing-before tests (`A/tests/scorer/typed-command-routing.vitest.ts`, `A/tests/python/test_skill_advisor.py`). Verify: the agent disabled each fix in turn and its case failed (Python `pass=84, fail=1`), then passed with the fix restored.
- [x] T010 Item 4: add `_wn_link_local_commands` and call it from `provision_worktree` (`G/worktree-naming.sh`), with a fixture test (`G/tests/worktree-naming.test.sh`). Verify: `bash -n` exits 0 on both files.
- [x] T011 Seed the primary checkout with the command built in worktree 217. Verify: `diff -rq` on the assets folder printed nothing and `cmp` reported all six router and mirror files the same; `git status` in the primary checkout listed none of them.
- [x] T012 Document the link step and release sk-git `1.9.7.0` (`.skilled/skills/sk-git/SKILL.md` rule 8, `G/../changelog/v1.9.7.0.md`, `.hermes/skills/sk-git/SKILL.md`). Verify: `sync-skills-hermes.cjs --check` printed `PASS: 67 Hermes skill copies in sync`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T013 Run the whole advisor suite (`A`). Verify: `npx vitest run` on the final tree printed `Test Files  150 passed (150)` and `Tests  1243 passed | 8 skipped (1251)`. An earlier full run printed `1 failed | 149 passed (150)`; its failing file was not captured, and the rerun was clean.
- [x] T014 Run the Python twin (`A`). Verify: `python3 tests/python/test_skill_advisor.py` printed `Summary: pass=85, fail=0`.
- [x] T015 Probe the five prompts live and local. Verify: both regimes ranked `command-doctor-git-hooks`, `system-deep-loop`, `system-spec-kit`, `system-spec-kit` and `system-deep-loop` first; live rr-iter3-168 read `system-deep-loop 0.564701 | system-spec-kit 0.5647`.
- [x] T016 Run the sk-git harness (`G/tests/worktree-naming.test.sh`). Verify: it printed `PASS=171 FAIL=0`; against the previous `worktree-naming.sh` it printed `FAIL=8`, the new local-command checks.
- [x] T017 Independent review of the code diff by a fresh Opus medium reviewer. Verify: it confirmed one P2 (with two typed commands, a neighbour was capped at its seed's unbounded score) and no P0 or P1; the P2 is fixed in `boundGraphSupportBySeed`, and its new test printed `1 failed | 4 passed (5)` on the old bound and `5 passed (5)` on the fix. The two items it left unconfirmed are recorded in the implementation summary.
- [x] T018 Repair derived metadata and validate this folder (`P`). Verify: `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh P --strict` printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `acceptance-criteria.md` reads Closeable: Yes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A check left open is recorded with its reason on its own line, never ticked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Each misroute is observed before its fix, with lane evidence (T001 to T003).
- [x] CHK-002 [P0] The private command's only copy is located before anything links to it (T004).
- [x] CHK-003 [P1] The link step reads the existing ignore rules rather than a new list: `rg -n "grep -E" G/worktree-naming.sh` shows it reading `$dir/.gitignore`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] The advisor builds: `npm run build` in `A` exited 0.
- [x] CHK-011 [P0] Both bash files parse: `bash -n` exits 0 on `worktree-naming.sh` and its test.
- [x] CHK-012 [P1] No added code comment names a phase, packet or finding id: the added comments state the reason (lent support, mode suffixes choose how a command runs, private entries are git-ignored). Done by reading the diff.
- [x] CHK-013 [P1] No added line holds an em dash: `git diff HEAD | rg '^\+' | rg -c '—'` printed nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is Met: `AC_CLOSURE` printed `6/6 criteria met, waived or superseded; packet is closeable`.
- [x] CHK-021 [P0] Each new test fails without its fix (T009, T016).
- [x] CHK-022 [P1] Controls hold: a plain-word seed keeps ordinary graph lending, and a prompt with no slash command keeps the word "auto" (`typed-command-routing.vitest.ts`).
- [x] CHK-023 [P1] No pinned routing fixture or divergence-ledger row changed: `git status --short A/scripts/routing-accuracy A/tests/parity` lists nothing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Done: item 1 `instance-only` (one route), item 2 `algorithmic` (graph lending), item 3 `cross-consumer` (every lane that tokenizes a prompt, in two languages), item 4 `class-of-bug` (every private command, not one).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Done: `rg -ln tokenizePrompt A/lib/scorer/lanes` lists the five prompt lanes; the sixth lane, graph-causal, takes no prompt.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Done: `provision_worktree` is called by `create_named_worktree` and the `provision` command only; the bound applies to the weighted-sum path and the RRF path is left unchanged on purpose.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Done for the link step: an existing worktree file, a local skill, a second run and the primary checkout itself are each a test row.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Done: plan.md lists suffix by position for the strip.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Done: the sk-git fixture unsets the git environment variables, and the advisor probes ran in both the live and the forced-local regime.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Open until the phase commit exists.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets. Done: the diff adds no credential or token.
- [x] CHK-031 [P0] The private command's name stays out of tracked files: a search for it over `git diff HEAD` printed nothing.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec, plan and tasks name the same four items and the same files.
- [x] CHK-041 [P1] sk-git rule 8, the `provision` usage line and the `1.9.7.0` release note all describe the link step.
- [x] CHK-042 [P2] README updated: N/A, no README describes provisioning or the scorer lanes changed here.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only: probe scripts and throwaway DB dirs lived in the session scratchpad outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion: `P/scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 14 | 13/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27. No P0 is open. CHK-FIX-007 stays open until the phase commit exists; the commit SHA goes in the parent goal log.
<!-- /ANCHOR:summary -->

---

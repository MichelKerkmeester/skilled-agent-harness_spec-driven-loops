---
title: "Implementation Plan: Fix every finding of the twelve-pass deep review of the system-skill-advisor logic"
description: "Thirteen work units fix the 19 review findings in three waves. The waves run as parallel cli-codex Luna xhigh and cli-pi DeepSeek Flash max dispatches, and each file has exactly one owning unit. A shared owner check lands first, the scorer characterization test lands before the scorer changes, and one final pass regenerates the indexes and runs the full gate set against the captured baseline."
trigger_phrases:
  - "advisor logic review fixes plan"
  - "advisor fix work units waves"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Fix every finding of the twelve-pass deep review of the system-skill-advisor logic

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime, hooks), CommonJS (`.skilled/bin`), Python 3 (fallback scorer) |
| **Framework** | Node 22 runtime compiled to `dist/`, vitest, plain Python test runner |
| **Storage** | SQLite skill graph via better-sqlite3, JSONL stores under `tmpdir()` |
| **Testing** | vitest (advisor and spec-kit runtimes), `tests/python/test_skill_advisor.py`, parity and routing ratchets |

### Overview
Eight read-only design passes produced one verified design per fix area, and a skeptic and a completeness critic corrected each one. The designs and their corrections live in `/private/tmp/plan029/designs/` (`design-*.json`, `verify-*.json`) and in `/private/tmp/plan029/codex/critic/last.txt` and `/private/tmp/plan029/codex/verify-scorer/last.txt`. The work runs as thirteen units. Each unit owns a fixed file list, so parallel workers never edit the same file. The executor is cli-codex `gpt-6-luna` at xhigh on the fast tier for units with logic changes, and cli-pi `llmgateway/deepseek-v4.1-flash-1017` at max for single-file edits, per the operator's executor change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every registry finding maps to one design (critic coverage list).
- [x] The four design decisions and the two conflict decisions are recorded by the operator.
- [x] The gate baseline is captured at `52f0bcb9a98` before any edit.

### Definition of Done
- [ ] Each gate below passes from the final tree, with counts at or above the baseline except where a removed test explains the drop.
- [ ] `validate.sh --strict` on this packet prints `RESULT: PASSED`.
- [ ] One extra native review pass runs, and `review-verdict.cjs` prints no `FAIL`.

Baseline at `52f0bcb9a98`, from `run-gates-532.sh baseline`:

| Gate | Command (from the advisor runtime unless noted) | Baseline |
|------|---------|----------|
| advisor-typecheck | `npm run typecheck` | exit 0 |
| advisor-clean-build | `npm run clean && npm run build` | exit 0 |
| advisor-test | `npm test` | 180 files, 2738 passed, 4 skipped |
| ratchet-scorer-eval | `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | 7 passed |
| ratchet-local-native | `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` | 9 passed |
| ratchet-holdout | `npx vitest run tests/parity/holdout-independent.vitest.ts` | 6 passed |
| ratchet-corpus | `python3 scripts/routing-accuracy/score-routing-corpus.py ...` | exit 0 |
| advisor-stress | `npm run test:stress -- --config vitest.stress.config.ts` | 21 files, 65 passed |
| python-tests | `python3 tests/python/test_skill_advisor.py` | exit 0, offer cases 118 |
| doctor-run-all | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` (repo root) | 7 suites passed |
| bridges-check | `derive-command-bridges.cjs --check` (repo root) | fresh |
| link-check | `check-markdown-links.cjs` (repo root) | exit 0 |
| leaf-advisor | `generate-leaf-manifest.cjs --check .skilled/skills/system-skill-advisor` | exit 0 |
| mirror-check | `sync-runtime-mirrors.cjs --check` | 260 mirrors in sync |
| catalog-advisor | `validate_catalog_package.py --package system-skill-advisor` | 0 violations |
| playbook-advisor | `validate-playbook-package.cjs --package system-skill-advisor` | 55 scenarios, 0 violations |
| speckit-typecheck | `npm run typecheck` (spec-kit) | exit 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer. Each temp-folder store and each socket client gets one ownership check before it writes or connects, the scan's delete is bounded by the root it walked, and duplicated scorer logic is pinned by one shared fixture both languages read.

### Key Components
- **`runtime/lib/owned-private-dir.ts` (new)**: `isOwnedPrivateDir(path, forbiddenModeBits)`, extracted from `hooks/lib/route-receipt.ts:283-292`. It is earned by four callers: metrics, shadow sink, feedback calibration and route receipt.
- **`checkIpcSocketOwnership` in `.skilled/bin/lib/launcher-ipc-bridge.cjs`**: the socket-side check. The CLI already loads this bridge, so the CommonJS shim needs no second copy.
- **`deleteMissingNodesUnderRoot` in `skill-graph-db.ts`**: replaces `deleteMissingNodes`, deleting only rows whose stored source lies under the scanned root, compared both as written and with symlinks resolved.
- **`tests/fixtures/scorer-predicate-cases.json` (new)**: the cases the TypeScript and Python predicates must read the same way.

### Data Flow
A prompt reaches the hook, which writes metrics through the checked store and asks the daemon through a checked socket. The daemon scores it through `scoreAdvisorPrompt`, whose stage order a characterization test pins. A scan updates the graph without deleting nodes outside its root.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Imported from the Planning Packet of `../review/review-report.md` and checked by the design passes. Imported strings are quoted as data.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/skill-graph/skill-graph-db.ts` | Producer of the graph delete | update | one-skill root keeps 15 nodes and 59 edges on a database copy |
| `runtime/skill-advisor-cli.ts` | Socket client and scan text output | update | `skill-advisor-cli-socket-ownership.vitest.ts`, `prints deletedNodes` case |
| `.skilled/bin/lib/launcher-ipc-bridge.cjs` | Socket client and shared check | update | `launcher-ipc-bridge-probe.vitest.ts` ownership cases |
| `.skilled/bin/skill-advisor.cjs` | Shim that spawns the CLI | unchanged, not a socket consumer | it never opens the socket, the CLI it spawns checks first |
| launcher session proxy reattach (`attachFreshSocket`) | Replays pending prompts to a new socket | update | `launcher-session-proxy.vitest.ts` refusal and reattach case |
| `runtime/lib/metrics.ts`, `runtime/lib/shadow/shadow-sink.ts`, `runtime/lib/scorer/feedback-calibration.ts` | Temp-folder stores | update | planted symlink and foreign owner cases per store |
| `hooks/lib/route-receipt.ts` | Existing checked store | update to call the shared check | `tests/hooks/route-receipt.vitest.ts` stays 42 of 42 |
| `runtime/lib/scorer/fusion.ts`, `ambiguity.ts`, `types.ts`, `runtime/scripts/skill_advisor.py` | Scorer predicates | update | shared predicate fixture in both languages, ratchets unchanged |
| `runtime/lib/lifecycle/` | Dead supersession, rollback and backfill code | delete the four functions | `rg` for each symbol outside `specs/` and changelogs finds nothing |
| advisor catalog, playbook, SKILL.md, references, READMEs, `.env.example`, spec-kit `ENV-REFERENCE.md` | Docs that echo the trust default or the deleted features | update | path-scoped residue grep with a baseline hit, then zero after |

Same-class producers: `rg -n "tmpdir\(\)" .skilled/skills/system-skill-advisor/runtime/lib .skilled/skills/system-skill-advisor/hooks` found the three stores and route receipt. The offline scripts under `runtime/scripts/` are out of scope per `spec.md`.

Algorithm invariant for the owner check: a folder passes only when it is not a symlink, its owner is the current user and it has no group or world write bit. A file is opened without following a symlink. A refused check skips the write and never throws into the hook.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Each unit's brief names its design file, its verify file and the critic corrections that apply, the exact files it owns and the focused test it must run.

| Unit | Executor | Owns | Findings |
|------|----------|------|----------|
| U1 owned-dir helper | Luna | `runtime/lib/owned-private-dir.ts` (new), `hooks/lib/route-receipt.ts`, its test | helper for G5-I6-P1-001 |
| U2 socket check | Luna | `.skilled/bin/lib/launcher-ipc-bridge.cjs`, spec-kit `launcher-ipc-bridge-probe.vitest.ts`, the session proxy reattach and its test | G5-I2-P1-001 |
| U3 stage-order test | Luna | `runtime/tests/scorer/score-stage-order.vitest.ts` (new) | G5-I4-P2-002 |
| U4 scan scope | Luna | `skill-graph-db.ts`, `tools/skill-graph-tools.ts`, `tests/skill-graph-db.vitest.ts`, `tests/skill-graph-handlers.vitest.ts` | G5-I1-P1-001 |
| U5 CLI | Luna | `runtime/skill-advisor-cli.ts`, `tests/skill-advisor-cli-socket-ownership.vitest.ts` (new), `tests/skill-advisor-cli-job-semantics.vitest.ts` | G5-I2-P1-001, deletedNodes output |
| U6 metrics store | Luna | `runtime/lib/metrics.ts`, `tests/metrics-file-permissions.vitest.ts` | G5-I6-P1-001 |
| U7 shadow sink | Luna | `runtime/lib/shadow/shadow-sink.ts`, `tests/shadow-sink.vitest.ts` | G5-I2-P2-002 |
| U8 calibration store | Luna | `runtime/lib/scorer/feedback-calibration.ts`, `tests/scorer/advisor-feedback-calibration.vitest.ts` | calibration sibling |
| U9 scorer | Luna | `fusion.ts`, `ambiguity.ts`, `types.ts`, `skill_advisor.py`, the predicate fixture and its README row, `scorer-predicate-cases.vitest.ts` (new), `tests/python/test_skill_advisor.py`, `rrf-determinism-spine`, `typed-command-routing`, `doctor-bridge-isolation` tests | G5-I1-P2-001 to 004, G5-I3-P2-001, G5-I5-P2-001, Python cap comments |
| U10 contracts and budget | Luna | `python-ts-constant-parity.vitest.ts` (new), `schemas/advisor-tool-schemas.ts`, `advisor-recommend-descriptor-parity.vitest.ts`, `hooks/pi/prompt-advisor.ts`, `tests/hooks/prompt-advisor.vitest.ts`, the OpenCode plugin cap test | G5-I4-P2-003, G5-I4-P2-004 |
| U11 robustness | Luna | `lib/policy-plan.ts`, `tests/policy-plan-gate-owner-load.vitest.ts` (new), `lib/freshness/generation.ts`, `tests/daemon-freshness-foundation.vitest.ts` | G5-I4-P2-005, G5-I4-P2-006 |
| U12 lifecycle code | Luna | `lib/lifecycle/supersession.ts` and `schema-migration.ts` (delete), `rollback.ts`, `status-values.ts`, `tests/lifecycle-derived-metadata.vitest.ts`, the trimmed stress test | G5-I3-P2-002 code |
| U13 docs | Luna | every Markdown and comment-only file in `design-comments-docs.json` and the doc rows of `design-dead-lifecycle.json` and `design-scan-scope.json`, `advisor-server.ts`, the `tools/*` header comments, `shared-payload.ts`, `unicode-normalization.ts`, `.env.example`, `leaf-aliases.json` via its generator | G5-I2-P2-001, G5-I4-P2-001, G5-I7-P2-001, G5-I3-P2-002 docs, R3-P2-002, playbook paths |

Wave 1 runs U1, U2 and U3. Wave 2 runs U4 to U13 in parallel once wave 1 is checked. Wave 3 is the orchestrator's: regenerate the leaf manifest, the trigger index and the frontmatter versions once, then run every gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | Each new test fails at `52f0bcb9a98` for the reason its finding names | vitest, the Python runner |
| Unit | Owner check, scoped delete, each predicate | vitest |
| Parity | Predicate fixture, cap and floor constants, Pi and Claude budget | vitest plus `test_skill_advisor.py` |
| Characterization | `scoreAdvisorPrompt` stage order over named prompts, with two mutation proofs | vitest |
| Regression | The full baseline gate set | `run-gates-532.sh` |
| Live proof | One-skill scan on a database copy | the `probe-scan2.mjs` command in `spec.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex `gpt-6-luna` xhigh fast | Executor | Live, smoke test answered | Units fall back to cli-pi DeepSeek with one change per dispatch |
| cli-pi `llmgateway/deepseek-v4.1-flash-1017` max | Executor | Live, smoke test answered | U12 moves to Luna |
| Routing ratchets and golden prompts | Gate | Green at baseline | A moved route blocks closure until explained or reverted |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate stays red after three repair attempts, or a unit edits a file outside its list.
- **Procedure**: every change is uncommitted in worktree 532, so `git diff` per unit file list shows it and `git restore -- <files>` removes it. The deleted lifecycle files come back with `git restore` from HEAD `52f0bcb9a98`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Wave 1 | Baseline captured | Wave 2 |
| Wave 2 | U1 helper, U2 socket check, U3 order test | Wave 3 |
| Wave 3 | Every wave 2 unit checked | Verification review pass |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
U1 helper ──> U6 metrics, U7 shadow, U8 calibration
U2 socket ──> U5 CLI
U3 order test ──> U9 scorer
U4 scan, U10, U11, U12, U13 ──> independent within wave 2
all ──> wave 3 indexes and gates ──> verification review pass
```

### Dependency Matrix

| Unit | Needs | Needed by |
|------|-------|-----------|
| U1 | none | U6, U7, U8 |
| U2 | none | U5 |
| U3 | none | U9 |
| U13 | none | wave 3 trigger index |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

U3 then U9 then wave 3 then the verification pass. The scorer unit is the largest and touches the ratchets, so it sets the length of wave 2.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Proof |
|-----------|-------|
| M1 wave 1 checked | the helper, socket check and order test exist and their focused tests pass |
| M2 wave 2 checked | each unit's diff stays inside its file list and its focused test passes |
| M3 gates green | `run-gates-532.sh after` matches or beats the baseline |
| M4 verdict moved | `review-verdict.cjs` prints no `FAIL` |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One standard Level 3 packet, not phase children

Level scoring gave 73 of 100 and the phase score 30 of 50, so both phase thresholds were met. The packet stays standard because all units run as one swarm against one shared gate set and land in one commit. Phase children would split that gate without letting any part land alone.

### ADR-002: The socket check lives in the launcher bridge

The CLI already loads `launcher-ipc-bridge.cjs`, and the shim only spawns the CLI. Putting the check in the bridge gives every socket client one copy without a new build step.

### ADR-003: Executors are Luna and DeepSeek, not native agents

The operator moved the work off native Opus agents after a subscription billing failure. Luna xhigh takes every unit. The deletion unit was first planned for DeepSeek Flash, but it changes six files, and the cli-pi contract limits a DeepSeek Flash build brief to one change (`cli-pi/SKILL.md` ALWAYS rule 12), so it moved to Luna as well. DeepSeek Flash stays the fallback for single-file repairs.

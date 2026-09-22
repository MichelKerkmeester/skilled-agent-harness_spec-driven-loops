---
title: "Tasks: Phase 49: gate-3-delivery-residue"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 49: gate-3-delivery-residue

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the level-2 phase child under the v4 parent, in the existing local-only worktree — **Evidence**: `create.sh --phase --parent specs/system-speckit/033-system-speckit-v4 --phase-names gate-3-delivery-residue --skip-branch --level 2` reported `PHASE_COUNT 49 (new, 49 total)` and wrote the folder plus the placeholder parent row; `validate.sh --strict` on the scaffold passed with 0 errors.
- [x] T002 Capture pre-change baselines into the packet's scratch dir — **Evidence**: `scratch/baselines.txt` records core `107/107` with module mocks, claude 13, codex 14, devin 15, cursor 17, OpenCode plugin 11, Pi vitest 9, Hermes `Ran 42 tests … OK`, plus the starting `git status --porcelain` (parent `spec.md` modified, packet untracked).
- [x] T003 Route the code work through the sk-code hub and load its authoring checklists before the first write — **Evidence**: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt …` returned `packetId sk-code-opencode`, `workflowMode sk-code-opencode`, `generation 2`; the universal, JavaScript, Python and TypeScript checklists were read and applied (component headers, no ephemeral ids in comments, `'use strict'` not required for `.mjs`, Python shebang/docstring).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch the cli-devin read-only surface sweep under the operator-approved `--permission-mode dangerous`, with the hard read-only instruction, the child-dispatch preamble and native subagents — **Evidence**: prompt at `scratch/devin-surface-sweep.prompt.md`; the run (PID captured, stdin closed) wrote `scratch/devin-surface-sweep.md`, a 155-line report with 16 findings rows, the already-current surface list and its own sk-code-opencode alignment section; `git status --porcelain` after the run showed no writer output from the dispatch.
- [x] T005 Hermes: classify the prompt on every turn, silently, and retire the dead prompt-time question read (`.hermes/plugins/repo-guards/__init__.py`) — **Evidence**: `pre_llm_call` calls `_open_spec_gate()`, which runs the Devin classify adapter and ignores its output, and the old `_spec_gate_question()` reader is gone; the module comment above `PROMPT_CONTEXT_MAX_CHARS` states that the question never rides the prompt channel.
- [x] T006 Hermes: deliver the once-per-session notice from the result hook on the first write (same file) — **Evidence**: `_spec_gate_notice()` runs the shared enforce adapter for a write tool inside the result path and merges its advisory with the post-edit pass; the adapter records its own delivery marker, so the next write resolves to nothing.
- [x] T007 Hermes: block a write in `pre_tool_call` only when enforcement is on (same file) — **Evidence**: `_spec_gate_denial()` runs the same adapter for write tools when `_spec_gate_enforced()` (strictly `SYSTEM_SPEC_GATE_ENFORCE=1`) and returns the adapter's reason as the Hermes block message; a missing reason and a non-deny decision both fall through.
- [x] T008 Hermes: repair the swallowed-defect found while wiring the hooks (same file) — **Evidence**: the deletion of `command = _command_of(tool_name, tool_args)` in `pre_tool_call` raised `NameError` on every call, which the fail-open `except Exception: return None` hid; restoring the assignment returned the dispatch-preflight, self-dispatch and delegate guards to service and the suite went from 8 failing to 2 after that single line.
- [x] T009 Hermes: rewrite the two obsolete gate tests to the mutation-time contract and add enforce-mode coverage (`.hermes/plugins/repo-guards/tests/test_repo_guards.py`) — **Evidence**: `test_the_gate_is_classified_per_prompt_and_the_notice_arrives_once_at_the_first_write`, `test_enforce_mode_blocks_the_first_write_and_the_denial_carries_the_question` and `test_the_leaf_gets_the_brief_but_never_the_gate` replace the prompt-time pair; the suite is 43 tests, `OK`.
- [x] T010 Hermes: correct the plugin's own documentation surfaces — **Evidence**: `.hermes/SYNC.md` hook-map rows for `pre_llm_call`, `pre_tool_call` and `transform_tool_result`; `.hermes/plugins/repo-guards/plugin.yaml` description; `.skilled/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md` rows 39-41.
- [x] T011 HERMES-028: rename the scenario page to the mutation-time contract and record a live result (`.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/goal-hook/`) — **Evidence**: `prompt-time-advisor-brief-and-gate-question.md` replaced by `advisor-brief-and-gate-delivery.md` with both dispatches, the state-file check and the 2026-09-22 recorded sessions (turn `ADVISOR`/`NO_GATE`; write `GATE`/`NO_GATE`); both index rows in `manual-testing-playbook.md` point at the new name.
- [x] T012 Correct every stale surface the sweep confirmed by reading the cited line — **Evidence**: `codex-hook-parity.md` (row, §2 signals, §2 pass/fail, step 2 description, live-run grep, §4 framing, §7 verdict), `spec-mutation-gate-enforce.md` step 4 expectation and the core-suite counts, `runtime/ENV-REFERENCE.md` (suppression row and the `DISABLED` wording), `.env.example`, `.pi/extensions/README.md`, `prompt-advisor.ts`, `runtime/hooks/devin/README.md`, `.opencode/plugins/system-spec-gate.js` docstring, the cli-devin goal-hook page, the Cursor confirmation page, `fanout-run.cjs`, the cli-hermes feature-catalog page, `.state/spec-gate/README.md`, the cli-codex hook-contract row and the advisor shadow README.
- [x] T013 Correct the Cursor delivery claims the codex review challenged (same docs, re-read against `spec-gate-prebind.mjs`) — **Evidence**: the adapter's header and the test `enforcement remains inert without a declaration or explicit opt-in` pin the design (no usable prompt event means no answer could arrive), so the feature-catalog row, the Cursor confirmation page and the 048 summary's known-limitation sentence now state that a default advisory Cursor session is a documented no-op rather than a hidden delivery.
- [x] T014 Add the Pi type gate and its vendored ambient types — **Evidence**: `tsconfig.pi.json` (repo root) with `preserveSymlinks: true`, `allowJs: true` and the two extension includes, plus `.pi/types/pi-coding-agent.d.ts` and `.pi/types/node-globals.d.ts`; `.skilled/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.pi.json` exits 0, and a throwaway file calling `ctx.ui.selct(...)` was rejected with exit 2 (`TS2551`) before the probe was deleted.
- [x] T015 Reconcile the review's remaining findings — **Evidence**: the OpenCode plugin docstring now says classify relays the deferral and enforce records telemetry only (the plugin has no result channel), the `tests 107` counts replaced the stale 106 in the playbook page, and the core's marker comment records the concurrent-first-mutation window as an accepted boundary.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run the whole regression battery from the final tree and read every count — **Evidence**: core `tests 107 / pass 107 / fail 0 / skipped 0` under `--experimental-test-module-mocks`; claude 13, codex 14, devin 15, cursor 17 (59 pass); OpenCode plugin 11 pass; Hermes 43 `OK`; Pi vitest `Tests 9 passed (9)`; `tsc` exit 0.
- [x] T017 Prove the sk-code drift guards add no new findings and that the repo-wide failure is pre-existing — **Evidence**: `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 1 with the same 9 ERROR rows as the 048 baseline (6 cli-jev benchmark raw scripts missing `set -uo pipefail`, 3 quarantine-copy `ROUTER-DEAD-PATH`), `verify_stack_folders.py` PASSES, and no finding names a file this phase touched; the single PY-SHEBANG warning on the touched Hermes test file was cleared so the tree scans clean.
- [x] T018 Run the live Hermes probes (turn contract, first-write notice, enforced denial) and clean up after them — **Evidence**: session `20260922_095053_5713d3` printed `ADVISOR` then `NO_GATE` and wrote gate state `{"status":"open"}`; session `20260922_095443_31c676` printed `GATE` then `NO_GATE` across two writes; both probe files were removed and `git status --short docs` was empty; the enforced run is recorded with the T019 closure evidence.
- [x] T019 Adversarial verification through cli-codex (gpt-5.6-luna, effort max, tier fast, read-only) and reconcile every finding — **Evidence**: two dispatches through `.skilled/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs`; the surviving report is `scratch/luna-review.md` with `## HIGH` empty, four MEDIUM rows and one LOW row; each MEDIUM/LOW was fixed or documented, and the Cursor row it flagged became T013.
- [x] T020 Close the packet: rewrite `tasks.md` and `acceptance-criteria.md`, author `implementation-summary.md`, register the phase in the parent map, handoff row and timeline, then regenerate derived metadata after the last document edit — **Evidence**: this file plus the packet's other documents, `specs/system-speckit/033-system-speckit-v4/spec.md` rows 49 and the 048→049 handoff, the 2026-09-22 milestone in `timeline.md`, and `repair-derived.cjs --apply` run last.
- [x] T021 Run both packet gates and commit locally, never pushing — **Evidence**: `validate.sh --strict` on the packet reports `RESULT: PASSED` 0 errors 0 warnings, and the parent `--recursive --strict` run passes on the parent and 48 of 49 children, the single failure being the pre-existing `030-spec-kit-simplification-research` goal-slice error that reproduces from the pre-change tree; `check-completion.sh` reports 100% with every P0/P1 item evidenced; the commit is local on `worktrees/058-gate-3-mutation-time-delivery` with no upstream.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Pre-change baselines captured for every suite this phase must not regress — **Evidence**: `scratch/baselines.txt` records core 107/107 (mocks), claude 13, codex 14, devin 15, cursor 17, OpenCode 11, Pi 9 and Hermes 42, all read from a clean tree before the first 049 edit.
- [x] CHK-002 [P0] The Hermes defect reproduced and stated before it was fixed — **Evidence**: the plugin's `_spec_gate_question()` read `additionalContext` from an adapter that has emitted nothing since 048, and `pre_tool_call` registered no gate entry, so a Hermes session opened state and delivered nothing; the new tests fail against the old code path.
- [x] CHK-003 [P1] Scope frozen in `spec.md` before implementation, with the sweep allowed to add surfaces only after the cited line was read — **Evidence**: the Files-to-Change table plus the "Any additional surface confirmed by the cli-devin sweep, after reading the cited line" scope line; every added file was re-read before it was edited.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Core corpus passes with module mocks: `env -u AI_SESSION_CHILD -u SYSTEM_SPEC_GATE_ENFORCE -u SYSTEM_SPEC_GATE_DISABLED node --experimental-test-module-mocks --test .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` — **Evidence**: `tests 107 / pass 107 / fail 0 / skipped 0`.
- [x] CHK-011 [P0] The four CLI adapter suites pass — **Evidence**: claude 13/13, codex 14/14, devin 15/15, cursor 17/17 = 59 pass, 0 fail.
- [x] CHK-012 [P0] The Hermes plugin suite passes — **Evidence**: `python3 -m unittest discover -s .hermes/plugins/repo-guards/tests -p 'test_*.py'` → `Ran 43 tests … OK`.
- [x] CHK-013 [P0] The Pi type gate passes and is not vacuous — **Evidence**: `tsc --noEmit -p tsconfig.pi.json` exit 0; a probe file with `ctx.ui.selct(...)` exited 2 with `TS2551: Property 'selct' does not exist on type 'ExtensionUi'`, then was deleted.
- [x] CHK-014 [P1] The OpenCode plugin suite and the Pi vitest suite pass — **Evidence**: `node --test .opencode/plugins/tests/system-spec-gate.test.cjs` → 11/11; `npx vitest run --config vitest.config.ts --project root runtime/tests/spec-gate-pi-extension.vitest.ts` → `Tests 9 passed (9)`.
- [x] CHK-015 [P1] No ephemeral artifact ids in any written comment; durable WHY preserved — **Evidence**: the phase's comment edits name behavior and contracts only (Hermes plugin module comments, the OpenCode plugin docstring, the core's marker comment, the `fanout-run.cjs` env rationale); the pre-commit comment-hygiene gate passes on the commit.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Hermes unit contract covers classify-per-prompt, first-write notice, once-only delivery, enforce denial and the leaf exemption — **Evidence**: the three rewritten/added tests in `test_repo_guards.py` assert the adapter scripts and payloads, the injected notice text, the empty second delivery, the deny block message and that the gate adapters are never consulted for an orchestrated leaf.
- [x] CHK-021 [P0] Live turn contract: the question does not ride a Hermes turn — **Evidence**: dispatch recorded in `advisor-brief-and-gate-delivery.md` — stdout `ADVISOR` then `NO_GATE`, exit 0, session `20260922_095053_5713d3`, and the session's gate state file written as `{"status":"open"}`.
- [x] CHK-022 [P0] Live mutation contract: the first write carries the notice and the second does not — **Evidence**: session `20260922_095443_31c676` printed `GATE` then `NO_GATE`; the two probe files were removed afterwards and no tracked file changed.
- [x] CHK-023 [P0] Live enforced denial: a write under `SYSTEM_SPEC_GATE_ENFORCE=1` is blocked with the gate's reason — **Evidence**: session `20260922_103547_92e186`, exit 0, stdout `BLOCKED DENIED: this Write/Edit needs a bound spec folder first.`, and no probe file was created (`docs/` was never created).
- [x] CHK-024 [P0] The Hermes denial path returns the adapter's reason as the block message — **Evidence**: the live enforced probe above returned the real adapter reason rather than a generic refusal, and the unit test `test_enforce_mode_blocks_the_first_write_and_the_denial_carries_the_question` asserts the exact `{"action": "block", "message": …}` shape.
- [x] CHK-025 [P1] Adapter-level boundary checks still hold for the CLI runtimes after the doc edits — **Evidence**: the four adapter suites' classify and enforce cases pass unchanged (59/59), and no adapter source was edited in this phase.
- [x] CHK-026 [P1] The live Hermes probe prompts were chosen so the shared classifier actually opens the gate, and the failure mode when it does not is documented — **Evidence**: an earlier probe naming `049`-style tokens never opened the gate and reported `NO_GATE` twice; the page's Failure Triage now says to check the session state file before blaming the bridge.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding carries a class: `class-of-bug` for the swallowed `NameError` sibling hunt, `cross-consumer` for the seven-runtime delivery contract, `instance-only` for the stale surfaces, `matrix/evidence` for the review's count and framing rows — **Evidence**: task wording above names the class per item (T008 class-of-bug; T005-T007 cross-consumer; T012 instance-only; T015 matrix/evidence).
- [x] CHK-FIX-002 [P0] Same-class producer inventory for the swallowed-exception class — **Evidence**: every `except` in `.hermes/plugins/repo-guards/__init__.py` was re-read with the hook entry points (`pre_llm_call`, `pre_tool_call`, `transform_tool_result`, session hooks); the only other blanket handlers wrap subprocess calls that raise nothing else, and the suite exercises each entry point.
- [x] CHK-FIX-003 [P0] Consumer inventory for the delivery contract — **Evidence**: the seven runtimes were each traced to the code that opens the gate and the code that delivers (claude/codex/devin classify+enforce, cursor prebind+enforce, OpenCode transform+event, Pi classify+enforce dialog, Hermes plugin), and the Cursor case was re-read to its adapter header and pinning test.
- [x] CHK-FIX-004 [P0] Adversarial matrix for the changed input surface (the Hermes plugin's payload handling) — **Evidence**: the suite covers empty/missing session id, malformed args, a denied-then-restored core, a leaf session, unenforced vs enforced mode, and a missing deny reason, each asserting the fail-open or block outcome.
- [x] CHK-FIX-005 [P1] Matrix axes and row count stated before completion — **Evidence**: the axes are (runtime × event path × decision), enumerated in CHK-FIX-003 and CHK-020…CHK-026.
- [x] CHK-FIX-006 [P1] Hostile environment variant executed where process-wide state is read — **Evidence**: the Hermes gate tests patch `os.environ` per case (enforce on/off, leaf pair, missing session) and the core suite is run with `AI_SESSION_CHILD`, `SYSTEM_SPEC_GATE_ENFORCE` and `SYSTEM_SPEC_GATE_DISABLED` explicitly unset.
- [x] CHK-FIX-007 [P1] Evidence pinned to an explicit artifact set rather than a moving range — **Evidence**: every citation above names a file path or a recorded session id; the commit hash is minted by the prepare-commit-msg hook at commit time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The dangerous-permission dispatch was constrained to read-only work and verified so — **Evidence**: the operator approved `--permission-mode dangerous` on the condition of an explicit read-only instruction; the prompt carries it, the run's whole output was a report, and `git status --porcelain` after the run showed only the pre-existing edits.
- [x] CHK-031 [P0] The live probes wrote nothing outside their scratch paths — **Evidence**: probe files `docs/hermes-notes.md`, `docs/hermes-notes-2.md` and the two repo-root `.hermes-049-probe-*.md` files were removed, the empty `docs/` directory was removed, and gate state lives under the gitignored `.skilled/skills/.state/spec-gate/`.
- [x] CHK-032 [P1] No secrets, credentials or absolute home paths entered the packet or the code — **Evidence**: the review prompts and reports reference repository-relative paths; the only absolute paths are the operator's own command lines, which are not committed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Every corrected surface states behavior the code actually has — **Evidence**: each edited page was re-read against its adapter after the code was final; the review's four doc rows (test counts, read-only live-run expectation, OpenCode docstring, captured A-E evidence) were fixed in T015.
- [x] CHK-041 [P1] The packet's own documents stay synchronized with the shipped state — **Evidence**: `spec.md` scope and success criteria, this checklist, `acceptance-criteria.md` rows and `implementation-summary.md` all describe the same final tree, and derived metadata is regenerated last.
- [x] CHK-042 [P2] The renamed scenario keeps its index identity — **Evidence**: both `HERMES-028` rows in `manual-testing-playbook.md` point at `goal-hook/advisor-brief-and-gate-delivery.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary artifacts live under the packet's `scratch/` directory — **Evidence**: `scratch/baselines.txt`, `scratch/devin-surface-sweep.prompt.md`, `scratch/devin-surface-sweep.md`, `scratch/luna-review.prompt.md`, `scratch/luna-review.md`; shell scratch stayed in `/tmp` and is not part of the tree.
- [x] CHK-051 [P1] `scratch/` holds only review artifacts intended to be committed — **Evidence**: the five files above are the packet's external-verification evidence; no probe, fixture or log file remains.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-22 (31/31 checklist items, `check-completion.sh` `RESULT: READY FOR COMPLETION`)
<!-- /ANCHOR:summary -->


---
title: "Tasks: Phase 1: gate-3-mutation-time-delivery"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: gate-3-mutation-time-delivery

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

- [x] T001 Create the execution worktree through sk-git's allocator, local-only (no push): `.worktrees/058-gate-3-mutation-time-delivery` on branch `worktrees/058-gate-3-mutation-time-delivery` — **Evidence**: `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create gate-3-mutation-time-delivery` reported base commit `2cb1bdb800`; `git branch -vv` shows no upstream for the branch.
- [x] T002 Scaffold the level-2 packet under the v4 parent: `specs/system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery/` with `create.sh --phase --parent` — **Evidence**: `create.sh --phase --parent specs/system-speckit/033-system-speckit-v4 --phase-names gate-3-mutation-time-delivery --skip-branch --level 2` reported `PHASE_COUNT 1 (new, 48 total)` and created the folder plus the parent map row.
- [x] T003 Capture pre-change baselines: core suite pass count, four CLI adapter suite counts (none yet) — **Evidence**: base commit `2cb1bdb800` exported with `git archive` to a temp tree with the three gitignored `dist/` trees copied in: core `tests 90 / pass 87 / fail 0 / skipped 3`; claude 13/13, codex 14/14, devin 15/15, cursor 16/16; OpenCode plugin 11/11; no Pi suite existed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Core: add the reframed question texts, one for mutation-time delivery and one deferral instruction for no-dialog classify paths (`.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`) — **Evidence**: `GATE_3_MUTATION_NOTICE` and `GATE_3_DEFERRED_INSTRUCTION` added, `GATE_3_QUESTION` left byte-identical, `GATE_3_DENY_DETAIL` recomposed as the DENIED sentence plus the notice plus `Then retry the same call.`
- [x] T005 Core: add the persisted per-session emission marker on the gate state with re-arm on a resume trigger, an answer attempt and a re-opened gate, and make `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION=0` force always-emit (same file) — **Evidence**: `questionDeliveredAtMs`/`questionDeliveredChannel`/`questionDeliveredCount` written by `recordGate3NoticeDelivered` and cleared by `rearmGate3NoticeDelivery` plus the classifyIntent re-arm sites; `gate3EmissionAlwaysOn` treats only `0`/`false`/`no`/`off` as always-emit.
- [x] T006 Core: add a programmatic answer-binding entrypoint that validates and persists a dialog answer and reports acceptance plus the resolved path (same file) — **Evidence**: exported `bindGate3Answer` persists skip/satisfied exactly like a conversational answer and rejects with `disabled`, `child_session`, `no_answer`, `gate_not_open`, `missing_path`, `binding_rejected` or `state_write_failed` without partially binding.
- [x] T007 Core: accept a not-yet-created packet path in the prior-answer binding path when its parent exists inside the repository `specs/` root and its leaf matches `^\d{3}-[a-z0-9-]+$` (same file) — **Evidence**: `resolvePlannedPacketPath` rejects `.`/`..` segments, requires the packet leaf and an existing parent under a specs root, and refuses any target that already exists (folder or file) so an existing-but-invalid path is not laundered back in.
- [x] T008 Core: cover T004-T007 and preserve every existing fail-open, child-session and shadow-delivery case (`.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs`) — **Evidence**: corpus grew from 90 to 107 tests; final run `tests 107 / pass 104 / fail 0 / skipped 3` (the 3 self-skip without module mocks) and `107/107` with `--experimental-test-module-mocks`.
- [x] T009 Pi: stop appending the menu from the classify hook; keep opening the gate, and emit the reframed one-shot instruction only when no dialog-capable UI exists (`.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts`) — **Evidence**: the hook returns `{action: "continue"}` on a dialog-capable session and transforms the turn with `GATE_3_DEFERRED_INSTRUCTION` only when `ctx.hasUI` is false; the Pi suite's first case asserts the no-menu continue.
- [x] T010 Pi: at the first non-exempt `write`/`edit` with an open gate, ask through `ctx.ui.select` plus `ctx.ui.input`, bind the answer, block that one call with the retry reason, and fall through to the shipped decision on cancel or timeout (`.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts`) — **Evidence**: dialog armed by `gateOpenUndelivered`, answer bound through `bindGate3Answer`, the blocked call's reason names the bound path, `bash` never prompts, cancel/timeout records `dialog-cancelled` and fails open.
- [x] T011 Pi: add the fake-`ExtensionAPI` suite proving no turn-time menu, the dialog at the first write, the one-time block, repeat suppression and the cancel fall-through (`.skilled/skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts`) — **Evidence**: 9 tests, 9 pass, 0 fail through the production extension handlers.
- [x] T012 Claude/Codex/Devin/Cursor: remove classify menu emission while keeping the gate open and the answer parse (`.skilled/skills/system-spec-kit/runtime/hooks/{claude,codex,devin,cursor}/spec-gate-classify.mjs`) — **Evidence**: all four adapters call `runClassifyGate` without destructuring `question` and always approve; the adapter suites assert `assertNoOutput` plus the persisted `open` state instead.
- [x] T013 Claude/Codex/Devin/Cursor: carry the reframed mutation-time notice on enforce (deny reason under enforce, tool-call context or `agent_message` under advisory) (`.skilled/skills/system-spec-kit/runtime/hooks/{claude,codex,devin,cursor}/spec-gate-enforce.mjs`) — **Evidence**: each calls `result.observe()` after its envelope so the marker is recorded only once the notice is on the wire; the deny path composes `GATE_3_DENY_DETAIL`.
- [x] T014 Claude/Codex/Devin/Cursor: update the four `node --test` suites to assert mutation-time delivery and classify silence (`.skilled/skills/system-spec-kit/runtime/hooks/{claude/spec-gate-claude.test.mjs,codex/spec-gate-codex.test.mjs,devin/spec-gate-devin.test.mjs,cursor/spec-gate-prebind.test.mjs}`) — **Evidence**: final run claude 13, codex 14, devin 15, cursor 17 = 59 tests, 59 pass, 0 fail (cursor gained the advisory-enforce case).
- [x] T015 OpenCode: make the classification injection one-shot and reframed, and reframe the throw reason (`.skilled/plugins/system-spec-gate.js`) — **Evidence**: the system-transform hook pushes `GATE_3_DEFERRED_INSTRUCTION` once via `shouldDeliverGate3Deferral` (channel `system-deferral`) and never the menu; `event()` re-arms the marker on resume/compact; the plugin suite was updated from an emission assertion to the deferral assertion and passes 11/11.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run the core suite and the four adapter suites; read counts and failures (both `node --test` commands in the Verification Checklist) — **Evidence**: core `107/104/0/3` and `107/107` with mocks; adapters `59/59/0`; no failure in any of the five suites.
- [x] T017 Run the runtime vitest project including the new pi suite — **Evidence**: `npx vitest run --config ../vitest.config.ts --project root` from `.skilled/skills/system-spec-kit/runtime`: `Test Files 106 passed | 3 skipped (109)`, `Tests 1292 passed | 13 skipped (1305)`, 0 failed; the filtered Pi run is 9/9.
- [x] T018 Run the two adapter boundary checks (classify silent, enforce carries the notice) and clean the test gate-state file afterwards — **Evidence**: the Claude classify adapter printed `stdout=[]` with the state file left `open`; the first advisory printed `additionalContext` with the mutation notice; the second printed `stdout=[]`; `SYSTEM_SPEC_GATE_ENFORCE=1` printed `permissionDecision: "deny"` with the notice embedded; the script's `rm -rf` removed the fixture and its state dir.
- [x] T019 Update the hook documentation surfaces: spec-gate README delivery and environment tables, `runtime/hooks/README.md`, per-runtime hook READMEs, `.skilled/hooks/README.md`, `.skilled/hooks/injection-contract.md`, and the mutation-gate playbook pages (`.skilled/…` docs) — **Evidence**: `lib/spec-gate/README.md` delivery/API/config/boundary/validation sections rewritten; claude/codex/cursor/devin/pi READMEs state the new delivery; `runtime/hooks/README.md` core row and artifact table updated; `.skilled/hooks/README.md` effect column is `notice / deny`; `injection-contract.md` §2 is now "Spec-Gate Mutation-Time Delivery" and the deny section names the composed detail; the playbook page's step 4/5 expectations and counts were corrected.
- [x] T020 Register the child in the parent phase map and timeline, then regenerate derived metadata (`specs/system-speckit/033-system-speckit-v4/spec.md`, `timeline.md`, derived metadata) — **Evidence**: the parent map row 48 and handoff row carry the shipped scope and verification; the timeline gained its 048 milestone; `repair-derived.cjs --apply` refreshed both graph metadata files (parent `children_ids` now ends at 048).
- [x] T021 Validate strict on the packet and recursively on the parent tree (`validate.sh`) — **Evidence**: `validate.sh 048-gate-3-mutation-time-delivery --strict` → `RESULT: PASSED` 0 errors; `validate.sh 033-system-speckit-v4 --recursive --strict` → `RESULT: PASSED` 0 errors.
- [x] T022 Clean task-created temp state, inspect the scoped diff, and commit locally in the worktree (no push) — **Evidence**: `scratch/` holds only `.gitkeep`; the temp fixture trees under `TMPDIR` and `/tmp` were removed; the scoped diff is the enumerated hook/core/test/doc set plus the packet; committed as one local commit on `worktrees/058-gate-3-mutation-time-delivery` with no upstream (never pushed).
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

- [x] CHK-001 [P0] Pre-change baselines captured for the core suite and the four adapter suites — **Evidence**: base commit `2cb1bdb800` run in an extracted tree: core `90/87/0/3`; claude 13/13, codex 14/14, devin 15/15, cursor 16/16; plugin 11/11.
- [x] CHK-002 [P0] Emission-marker invariant stated and covered: the marker changes repeat emission only, never the gate decision — **Evidence**: corpus cases `delivery: the first mutation advises once and later mutations stay silent` and `delivery: enforcement still denies after the notice was delivered` hold the line; a silent allow keeps `wouldDeny: true`.
- [x] CHK-003 [P1] Prior-packet behavior preserved: read-only turns stay silent and an incomplete answer still re-asks — **Evidence**: the 006-era corpus cases for both behaviors pass unchanged in the 104-pass core run.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Core suite passes: `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` — **Evidence**: final run `tests 107 / pass 104 / fail 0 / skipped 3`; with `--experimental-test-module-mocks` `pass 107 / fail 0`.
- [x] CHK-011 [P0] Four adapter suites pass: `node --test .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-claude.test.mjs .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-codex.test.mjs .skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs` — **Evidence**: 13+14+15+17 = 59 tests, 59 pass, 0 fail.
- [x] CHK-012 [P1] Runtime vitest project passes, including the new pi suite: `cd .skilled/skills/system-spec-kit/runtime && npx vitest run --config ../vitest.config.ts --project root` — **Evidence**: `Test Files 106 passed | 3 skipped (109)`, `Tests 1292 passed | 13 skipped (1305)`, 0 failed, Pi suite 9/9.
- [x] CHK-013 [P1] No new stdout or stderr writes from the core; every adapter keeps its fail-open exit path — **Evidence**: the corpus's static-shape case (`core never writes console output`) passes; each adapter's empty/malformed-payload case still approves.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Classify boundary check: a write-intent prompt through the Claude classify adapter prints nothing and exits 0 — **Evidence**: `stdout=[]`, exit 0, and the session state file exists with `{"status":"open"}`.
- [x] CHK-021 [P0] Enforce boundary check: a non-exempt write with an open gate prints the reframed notice (and `permissionDecision: deny` under `SYSTEM_SPEC_GATE_ENFORCE=1`) — **Evidence**: the first advisory prints `additionalContext` containing `SPEC FOLDER QUESTION`; the second mutation prints nothing; enforce-on prints `permissionDecision: "deny"` with `GATE_3_DENY_DETAIL`.
- [x] CHK-022 [P0] Pi suite proves: no turn-time menu, dialog at the first write, one-time block with the retry reason, repeat suppressed, cancel falls through to the shipped decision — **Evidence**: 9 named cases in `runtime/tests/spec-gate-pi-extension.vitest.ts`, all passing.
- [x] CHK-023 [P1] New-folder acceptance covers an existing folder, a fresh packet path, `..` traversal, an out-of-root path, an empty path and a file where a folder is expected — **Evidence**: the existing `999-test-folder` control, the fresh `.opencode/specs/048-fresh-packet` bind, and staying open for `.opencode/specs/foo/../../../etc`, `specs/../` traversal with a packet leaf, an out-of-root parent, a non-packet leaf, a bare token, `'   '`, and an existing file at a packet-pattern path — each asserted in the core corpus.
- [x] CHK-024 [P1] Child-session no-op re-verified on both entrypoints — **Evidence**: the core's child cases, the four adapter child cases and the OpenCode plugin's `AI_SESSION_CHILD=1` case all pass (no state file, no telemetry, no prompt).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: a class-of-bug fix across six runtime adapters plus one cross-consumer core change — **Evidence**: `spec.md` §1 and `plan.md` §3 name the class (turn-time menu emission in every adapter) and the shared-core change.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: every adapter that emits the question is listed by `rg -ln "runClassifyGate|runEnforceGate"` and either updated or proven unaffected — **Evidence**: matches are exactly the four CLI classify+enforce pairs, the Pi pair, the core, the core corpus and the hooks README; all updated. The OpenCode plugin consumes the core directly rather than through those names, and was updated too (`rearmGate3NoticeDelivery` on resume/compact).
- [x] CHK-FIX-003 [P0] Consumer inventory completed: `rg -ln "GATE_3_QUESTION|GATE_3_DENY_DETAIL"` readers are confirmed read-only or updated — **Evidence**: readers are the core, its corpus, the skill-advisor `policy-plan.ts` policy block (read-only, follows the unchanged `GATE_3_QUESTION`), the mutation-gate playbook page (updated) and historical spec archives (left as records).
- [x] CHK-FIX-004 [P0] Path-binding adversarial cases executed: traversal, out-of-root, file-where-folder-expected, empty path, and the valid existing-folder control — **Evidence**: each case is a named test in the core corpus and all pass; the file-where-folder case was added after a live probe showed the first guard accepted an existing file.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed: 6 runtimes x 2 entrypoints plus 4 boundary rows — **Evidence**: `plan.md` §4 behavior matrix, 16 rows.
- [x] CHK-FIX-006 [P1] Hostile env variant executed for the emission and disabled flags — **Evidence**: corpus case `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION=0 forces every mutation to advise`; plugin suite case proving `SYSTEM_SPEC_GATE_DISABLED=1` leaves `output.system` untouched; `env -u` neutralization used for every final suite run.
- [x] CHK-FIX-007 [P1] Evidence pinned to the implementation commit in the worktree — **Evidence**: one local commit on `worktrees/058-gate-3-mutation-time-delivery` whose `git show --stat` enumerates the file list below; `git status --porcelain` is empty at completion and the branch has no upstream (never pushed).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or credentials introduced — **Evidence**: the diff is hook policy, tests and documentation; no credential or token strings added.
- [x] CHK-031 [P0] Path validation rejects traversal and out-of-root candidates, with tests — **Evidence**: `resolvePlannedPacketPath` rejects `.`/`..` segments and non-specs parents, and the corpus asserts the traversal and out-of-root cases stay open.
- [x] CHK-032 [P1] No new environment variable is logged or persisted beyond the gate-state directory — **Evidence**: no new variable was introduced; the delivery marker persists inside the existing per-session gate-state file.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks are synchronized with what shipped, including the emission-marker default change — **Evidence**: `spec.md` REQ-001..REQ-008 describe the shipped behavior; the default-on suppression and the `=0` override are stated in `spec.md`, `plan.md` and the lib README's environment table.
- [x] CHK-041 [P1] Hook docs updated: delivery tables, environment table, reframed texts — **Evidence**: the lib README §2/§3/§5/§6/§7/§8, the five per-runtime READMEs, `runtime/hooks/README.md` and `.skilled/hooks/README.md`.
- [x] CHK-042 [P2] Playbook pages updated where they print the old expected output — **Evidence**: the mutation-gate page's classify expectation is now empty output, its enforce expectation carries the notice once, and its core counts are current. One out-of-spec page (`cli-external-orchestration/.../codex-hook-parity.md` step 2) still prints the old classify expectation and is recorded as a follow-up in the implementation summary rather than edited outside this packet's file list.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only — **Evidence**: `scratch/` contains only `.gitkeep`; probes and fixtures lived under `TMPDIR`/`/tmp` and were removed.
- [x] CHK-051 [P1] `scratch/` cleaned before completion — **Evidence**: `ls -la scratch/` shows `.gitkeep` only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-22
<!-- /ANCHOR:summary -->

---

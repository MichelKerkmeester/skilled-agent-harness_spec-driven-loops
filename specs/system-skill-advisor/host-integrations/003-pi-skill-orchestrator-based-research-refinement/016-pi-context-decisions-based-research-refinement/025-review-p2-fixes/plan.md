---
title: "Implementation Plan: Fix the ten P2 advisories from the lane removal deep review"
description: "Three code changes in the residue tool, each with a test that fails first: a socket-only rule for extra server names, a note for rejected dotenv lines, and a script match that accepts a spaced path. The rest is doc wording, allowlist reasons and 024 completion metadata, checked by the gates in section 5."
trigger_phrases:
  - "review p2 fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Fix the ten P2 advisories from the lane removal deep review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ES modules (`.mjs` residue tool), TypeScript Vitest tests, a CommonJS `node:test` gate test, and a GitHub Actions comment |
| **Framework** | None; the residue tool is a standalone CLI |
| **Storage** | None for the tool; the trigger index generator writes its four outputs as the last step |
| **Testing** | Vitest `cli` project for `sweep-lane-residue.vitest.ts`; `node --test` for `lane-residue-gate.test.cjs` |

### Overview
Three code changes in `sweep-lane-residue.mjs`, each with a test written first: a socket-only rule for extra server names in `checkModelServer`, a note for rejected dotenv lines in `checkDotenv`, and a script match that accepts a spaced path in `nodeScriptOf`. The rest of the packet is doc wording, allowlist reasons and 024 completion metadata, and it ends with the gates in section 5 and a follow-up review.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime/cli`, exits 0 with no failed test
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a single-file CLI with pure parse helpers and a fixture-backed test suite. Each check builds a list of findings, and the apply mode acts only on the list.

### Key Components
- **`nodeScriptOf`** (`sweep-lane-residue.mjs`, T:1244): reads the script that a node command runs. It gains the join rule for a path with spaces. Without the rule, `runsModelServer` returns false for any checkout under a spaced path.
- **`checkModelServer`** (T:1293): builds the server file list that M4 reports and apply deletes. It gains the socket-only rule for names that come from an explicit address. Without the rule, a regular file named by `HF_EMBED_SERVER_URL` is listed and deleted.
- **`checkDotenv`** (T:1475): reads key names through the value-free env-secret CLI. It gains a note when the CLI marks a file invalid. Without the note, lane keys on rejected lines go unreported with no sign of why.

### Data Flow
The machine check builds the process and file lists, and apply deletes what this checkout owns from them. The repo check reads the tracked files against the allowlist, and it reads the trigger index outputs by structure. The trigger index generator writes those outputs, so it runs after every packet and tool edit. The docs describe these flows, and the 024 metadata records the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Imported from the Planning Packet in `../024-ollama-lane-removal/review/review-report.md`, section 2. Finding classes: `destructive-path hardening gap`, `false-negative status`, `input-parsing edge case`, `gate blind spot`, `documentation drift`, `doc-to-config drift`, `doc-code drift`, `completion-metadata drift` and `evidence-less checklist rows`. The review's `fixCompletenessRequired` is `false`; this addendum stays because the verdict is CONDITIONAL and the parser and path fixes need their inventories. The review names `deleteServerFile`, and that function does not exist in the tool. The deletion set is built in `checkModelServer`, so the fix is made there.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sweep-lane-residue.mjs` `checkModelServer` extra-name loop (T:1314-1322) | Lists server files for M4 and for apply | update | V socket case (real socket) and V regular-file case |
| `sweep-lane-residue.mjs` socket-folder rule (about T:1326-1330) | Lists the socket folder only when it holds server files or is empty; the count `serverFiles` counts only listed files | unchanged | V case: a folder that holds a skipped regular file is kept |
| `sweep-lane-residue.mjs` `nodeScriptOf` (T:1244) | Reads the script a node command runs | update | Script-match table in V; measured command prints `true true` |
| `sweep-lane-residue.mjs` `runsModelServer` (T:1258) | Decides which processes are model servers for the M4 process list | unchanged (follows `nodeScriptOf`) | Measured command; V ownership cases at V:818 to V:860 |
| `sweep-lane-residue.mjs` `isOwnedModelServer` (T:1275) and its `owned` flag (T:1307) | Decides whether apply may signal a process | unchanged (follows `nodeScriptOf`) | V ownership cases at V:818 to V:860 still pass |
| `sweep-lane-residue.mjs` `checkDotenv` (T:1475-1506) | M7 lane-key finding | update (note only; status unchanged) | V dotenv bad-line case |
| `sweep-lane-residue.mjs` `machineExitCode` (T:1576-1581) | Exit 2 on NOT_CHECKED | unchanged; M7 must not become NOT_CHECKED | Machine exit assertions in V |
| `sweep-lane-residue.mjs` header, decisions 3 and 7 (line 34 onward) | Describes the allowlist and the script rule | update | `rg -n 'whole file|may contain spaces'` |
| `fixtures/lane-residue-allowlist.json` (47 rows) | Exact-path rows with reasons | update (reasons only) | `rg -n '[Ll]ines? [0-9]'` prints no line; repo mode 47 of 47 |
| `feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md` line 19 and section 2 | Describes the gate and its trigger | update | `rg -n 'every push'` prints none; the whole-file line is present |
| `.github/workflows/advisory-checks.yml` comment lines 21 to 23 | Describes the lane-residue job | update (comment only) | `git diff` shows comment lines only; trigger lines 3 to 5 unchanged |
| `.skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs` | Gate test; its planted-term case runs repo mode on a fixture | not a consumer of the edit (runs against the new tool) | `node --test` exits 0 |
| `/doctor:update apply` (machine and apply callers of the tool) | Reads exit codes and the M7 status | not a consumer of the new note | Exit 2 is not introduced; the note adds no finding |
| Trigger index generator and its four outputs: `runtime/data/trigger-index.json`, `retrieval/fixtures/generation-diagnostics.json`, `retrieval/fixtures/corpus-manifest.json`, `retrieval/fixtures/phrase-variants.json` | Repo mode reads these outputs by structure | regenerate last | Repo mode after regeneration matches 47 of 47 |
| `../024-ollama-lane-removal/008-cleanup-wiring-and-gating/plan.md` line 375 | Says every push | update | `rg -n 'every push'` prints none in that file |
| `../024-ollama-lane-removal/goal.md` criteria at lines 88 to 92 and the progress log | Parent completion state | update: ticks by hand, the log row through `goal.cjs packet-log` | `rg -n 'Complete'` shows the new row; existing rows unchanged |
| `../024-ollama-lane-removal/005-shared-embeddings-package/` spec.md (lines 36, 463), implementation-summary.md (lines 39, 113), goal.md (lines 78, 85), tasks.md (T053 at line 102, the `[B]` section, CHK-040 at line 203, the conductor row at line 282), acceptance-criteria.md (AC-014 at line 67, line 95) | Phase 005 Blocked wording | update | `rg -n 'Blocked|Unmet|not committed'` shows no status field left |
| `../024-ollama-lane-removal/spec.md` line 41 (Status) and phase-map row 5 (line 118) | Parent status | update | Strict validation of 024 |
| `../spec.md` (016 parent) row 24 (line 160) and a new row 25 | Phase map | update | `rg -n '^\| 25 \|'` prints one line |
| `../024-ollama-lane-removal/001-residue-check-and-cleanup-tool/tasks.md` (12 checked CHK rows) and `../024-ollama-lane-removal/006-prose-docs-and-changelogs/tasks.md` (11 checked CHK rows) | Checklist evidence | update: Evidence clauses only | Count of checked rows with an Evidence clause equals the checked count |
| `../024-ollama-lane-removal/review/` | Review evidence | unchanged (read only) | None |

Required inventories:
- Same-class producers: `rg -n 'MODEL_SERVER_DIR_FILES|dir\.files|lstatOrNull' .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` shows that the server file list is built in one place.
- Consumers of changed symbols: `rg -n 'nodeScriptOf|runsModelServer|isOwnedModelServer|checkDotenv' .skilled --glob '*.mjs' --glob '*.cjs' --glob '*.ts'`.
- Matrix axes, with the rows that a new test covers:
  - Address kind: socket (V:869, real socket), regular file (new), TCP address (existing V:886), fixed name (existing). Directory, symlink and absent path take the same `lstat().isSocket()` rule and have no new test; the implementation run names them as untested.
  - Command shape: plain path (existing), spaced path (new, true), first script is another file (new, false), `xhf-model-server.cjs` as a suffix of another name (new, false), other script with the server path as an argument (new, false).
  - Dotenv: all lines valid (existing), one rejected line with one lane key (new, note and status FOUND).
- Algorithm invariant, parser: `nodeScriptOf` returns the first non-option word after node when that word ends in `.js`, `.cjs`, `.mjs` or `.ts`. Otherwise it joins the following words into the shortest prefix whose last segment is exactly `hf-model-server.cjs`, and the search stops at the first later word that ends in a script extension. When no prefix matches, it returns the first non-option word, as it does today.
- Algorithm invariant, path: an extra name from an explicit address is listed only when `lstat` reports a socket. A symlink, a directory, a regular file and an absent path are not listed.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup, Implementation and Verification are the three phases below. `tasks.md` holds the ordered tasks and owns their checkboxes.

- **Setup** records the baseline on `bf3bca7a8b1`: the Vitest pass count, repo mode at 47 of 47, and the surfaces that the grep finds before any edit.
- **Implementation** writes each new test first and watches it fail, then makes the fix for R2-P2-001, R9-P2-001 and R1-P2-001; it then makes the wording, allowlist and 024 and 016 metadata edits, closes phase 005 after its typecheck and shared tests pass, and regenerates the trigger index only in Verification.
- **Verification** runs the strict validators on 025 before the index regeneration, regenerates the trigger index as the last write, then runs the read-only gates, and ends with the follow-up `/deep:review` on the native executor.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `nodeScriptOf`, `runsModelServer`, `checkModelServer` and `checkDotenv` through `sweep-lane-residue.vitest.ts` | Vitest, `cli` project |
| Integration | The gate test with its planted-term case, repo mode on this checkout, and machine and apply modes on fixtures | `node --test`, `sweep-lane-residue.mjs repo --json`, Vitest |
| Manual | None; the only operator-visible change is one M7 note | N/A |

Gates, each a separate verification step. Run them in this order: finish all edits, run G7, run G10, close the 005 and 024 metadata, run G9 as the last write, then run G1 to G6, G8 and G11 read-only.

1. **G1, Vitest file:** from `.skilled/skills/system-spec-kit/runtime/cli`, `npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts` exits 0 with no failed test. Its `npm test` script also runs `pretest` (a build) and the legacy suites, so the plan uses the direct command.
2. **G2, gate test:** `node --test .skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs` exits 0. `run-all.sh` runs the same file.
3. **G3, repo mode:** `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json` exits 0 with `counts.allowlistRowsMatched` 47 of `counts.allowlistRows` 47, after G9.
4. **G4, planted-term fixture:** the gate test case `a lane term planted in a tracked file fails repo mode` passes, which means the fixture run exits 1.
5. **G5, fixture machine mode 1 to 0:** the real-socket case in V asserts `machineExitCode` is 1 before apply and 0 after apply. That assertion is added in T005.
6. **G6, strict 024 recursive:** `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <024> --recursive --strict` prints `RESULT: PASSED`.
7. **G7, strict 025:** `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <025> --strict` prints `RESULT: PASSED`.
8. **G8, strict 016:** `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <016> --strict` prints `RESULT: PASSED`.
9. **G9, trigger index, last write:** `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` exits 0. The generator imports `@spec-kit/shared`, so the shared package must be built first (`tsc --build` in `.skilled/skills/system-spec-kit/shared`, as `trigger-index-rebuild.yml` does). No packet or tool file changes after this step.
10. **G10, operator install checks (005 T053):** `npm run typecheck` in `.skilled/skills/system-skill-advisor/runtime` and in `.skilled/skills/system-spec-kit` exit 0, and `npm test` in `.skilled/skills/system-spec-kit/shared` exits 0. It runs before T053 is ticked.
11. **G11, comment hygiene:** `rg -n -e 'R[0-9]+-P2-' -e 'SL4-00' -e '025-review' <TOOL> <VTEST>` prints no line. The check covers test names too.
12. **G12, follow-up review, last step:** a short `/deep:review` on the native executor replays the fixes and covers fixture realism. The verdict moves toward PASS only if the review records it, and it decides SL4-005.

### Term check for new text outside the allowlist

The catalog page and the workflow file have no allowlist row, so every new sentence in them is checked before it is written: a `node -e` check of each sentence against `IDENTIFIER_TERMS` and `PROSE_TERMS` (T:110 to T:160) must print no hit. `sweep-lane-residue.mjs` and `sweep-lane-residue.vitest.ts` have exact-path rows, so their new text is exempt; the new test strings still live in the test file only.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `env-secret.cjs keys` returns `valid` (`.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs`, `listKeys`) | Internal | Green | The M7 note cannot be produced; the dotenv test fails loudly |
| The operator's `npm ci --offline` in the runtime, `system-spec-kit` and `system-deep-loop` packages (005 T053) | External (operator) | Yellow | Phase 005 stays Blocked. The packet cites the operator's report for the exit status and observes the absence checks, typecheck and shared tests itself |
| The shared package build for the index generator (`tsc --build` in `system-spec-kit/shared`) | Internal | Green | G9 cannot run until the build exists |
| `node` and `git` on the PATH | External | Green | No gate can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: V or the gate test fails after the fixes, repo mode is not 47 of 47, or an apply run on a fixture deletes a regular file.
- **Procedure**: `git revert` the implementation commit on `worktrees/497-ollama-lane-removal`. The regenerated trigger index is in that commit, so the revert restores it too. Do not reset the worktree hard.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | This packet's four planning documents and the recorded baseline | Implementation |
| Implementation | Setup baseline; each new test seen failing before its fix | Verification |
| Verification | All edits, the strict pass on 025, and the regenerated trigger index | The follow-up `/deep:review` |
<!-- /ANCHOR:phase-deps -->

---

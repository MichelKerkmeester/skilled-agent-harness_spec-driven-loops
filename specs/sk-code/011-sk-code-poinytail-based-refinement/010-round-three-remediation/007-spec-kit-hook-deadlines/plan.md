---
title: "Implementation Plan: Phase 7: spec-kit-hook-deadlines"
description: "Give the spec-kit hooks' shared ESM reader a 3000 ms stdin deadline, add a compiled TypeScript twin for the dist adapters, route all fifteen unbounded readers through one of the two, and prove it with a test that holds stdin open on every hook entry."
trigger_phrases:
  - "spec kit hook deadlines plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: spec-kit-hook-deadlines

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules (`.mjs`), CommonJS (`.cjs`) and TypeScript compiled to `runtime/dist/` by `tsc --build`. Node v26.8.2 observed, `engines` asks for 20.11 or later |
| **Framework** | None. Node built-ins only |
| **Storage** | None |
| **Testing** | `node --test` for the new suite and `runtime/tests/hooks/*.test.mjs`, vitest for the `runtime/tests/*.vitest.ts` hook suites, `npm run typecheck`, ESLint, the dist freshness check |

### Overview
Fifteen readers under `.skilled/skills/system-spec-kit/runtime/hooks/` wait on stdin with no deadline, and so does the shared `readStdin` in `lib/hook-adapter-shared.mjs` that the eight spec-gate adapters import. This phase gives that shared reader the semantics of `.skilled/hooks/shared/hook-adapter-shared.cjs`: settle when the stream ends or after 3000 ms, return what arrived, remove the listeners and pause stdin so the process can exit. The plain `.mjs` hooks import it and the `.cjs` hooks load it with a dynamic import. The compiled TypeScript hooks cannot reach that file from `dist/`, so a TypeScript twin, `shared-stdin.ts`, carries the same deadline plus the 1 MB cap the `shared.ts` readers already enforce. Every hook keeps its own `JSON.parse` and fail-open branch, so an empty, partial or invalid read takes the answer it takes today.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two small shared readers with one contract, one for the uncompiled hooks and one for the compiled hooks. Every reader in the tree delegates to one of them. No hook imports from `.skilled/hooks/shared/`.

### Key Components
- **`lib/hook-adapter-shared.mjs`**: `readStdin({ timeoutMs = 3000 } = {})`, a line-for-line ESM copy of the CommonJS sibling's reader. `parseJsonFailOpen` does not change.
- **`shared-stdin.ts`** (new, at the hooks root beside `shared-provenance.ts`, the existing cross-runtime TypeScript module): `readHookStdin({ timeoutMs, maxBytes })` resolves the text, or `null` once more than `maxBytes` arrive, after destroying stdin. It compiles to `dist/hooks/shared-stdin.js`, next to the compiled adapters that import it.
- **The fifteen readers**: the table below.
- **`lib/hook-stdin-deadline.test.mjs`** (new): the table-driven deadline test and four payload tests.

### Data Flow
A host starts the hook and writes one JSON payload. The reader collects chunks until the stream ends or 3000 ms pass, then removes its listeners, pauses stdin and returns the text. The hook parses it inside its existing `try`. Empty, partial or invalid text throws there, and the hook takes the same exit it takes today. A complete payload parses and the hook continues unchanged. The compiled reader also stops early when the payload passes the caller's byte cap, which the `shared.ts` readers treat as no input, as they do today.

### Decisions
- **D1. Two readers, not one.** The compiled adapters run from `dist/hooks/<runtime>/`, and `lib/hook-adapter-shared.mjs` is not in `dist/`: `tsconfig.json` includes only `hooks/**/*.ts`, and the project is `composite`, so tsc will not pull a `.mjs` file into the build. A relative import from the source tree would resolve to a missing `dist/hooks/lib/` file. So the compiled adapters get `shared-stdin.ts`, and each file's header names the other.
- **D2. The deadline is 3000 ms**, the same default as the `.skilled/hooks` sibling, for every entry. Several entries are registered with a 3 second host timeout (the Claude `PreCompact`, `SessionStart` and `UserPromptSubmit` entries and the Codex `SessionStart` and `UserPromptSubmit` entries in `cli/runtime-mirrors/hook-registry.json`). For those the host still kills the hook at about the same moment. The Claude lifecycle hooks already stop at their own 1800 ms `withTimeout`.
- **D3. The `.cjs` hooks keep a local `readStdin` that does `await import('../lib/hook-adapter-shared.mjs')`.** A dynamic import works on every Node the package supports, resolves from the file's real path when a host runs it through a symlink, and sits inside each hook's existing `try`, so a failed load also fails open.
- **D4. The compiled reader keeps each caller's 1 MB cap** through `maxBytes`, so an oversized payload is still dropped early and never buffered whole. `claude/shared.ts` keeps its `Hook stdin exceeded` warning.
- **D5. `claude/user-prompt-submit.ts` is left alone** (see section 6).
- **D6. The new test lives at `runtime/hooks/lib/hook-stdin-deadline.test.mjs`**, inside the folder this child owns. `.skilled/scripts/run-node-tests.mjs` discovers `*.test.mjs` under `.skilled/skills`, so the repo gate runs it.
- **D7. Version 2.7.1.0, a patch.** The runtime hooks ship with system-spec-kit, and a bug fix is a patch under `sk-create-changelog` section 4.

### The fifteen readers and their routes

| # | File under `runtime/hooks/` | Reader before | Route after | Answer on an empty stdin (unchanged) |
|---|---|---|---|---|
| 1 | `lib/hook-adapter-shared.mjs` | `for await` (line 10) | becomes the deadline reader | not an entry |
| 2 | `claude/completion-evidence-stop.cjs` | private `readStdin` (54-58) | dynamic import of item 1 | nothing, exit 0 |
| 3 | `codex/completion-evidence-stop.cjs` | private `readStdin` (50-54) | same | nothing, exit 0 |
| 4 | `devin/completion-evidence-stop.cjs` | private `readStdin` (47-51) | same | nothing, exit 0 |
| 5 | `devin/post-compaction.cjs` | private `readStdin` (62-66) | same | nothing, exit 0 |
| 6 | `cursor/post-tool-use.mjs` | private `readStdin` (57-61) | named import of item 1 | `{"permission":"allow"}` |
| 7 | `cursor/spec-gate-prebind.mjs` | private `readStdin` (36-40) | same | `{"permission":"allow"}` |
| 8 | `cursor/completion-evidence-response.mjs` | private `readStdin` (29-33) | same | nothing, exit 0 |
| 9 | `devin/permission-request-policy.mjs` | private `readStdin` (153-157) | same | the deny envelope, exit 0 |
| 10 | `claude/shared.ts` | `parseHookStdin` loop (52-65) | `readHookStdin` | callers' own |
| 11 | `codex/shared.ts` | `readCodexHookInput` loop (57-70) | same | callers' own |
| 12 | `cursor/shared.ts` | `readCursorHookInput` loop (87-100) | same | callers' own |
| 13 | `devin/shared.ts` | `readDevinHookInput` loop (66-79) | same | callers' own |
| 14 | `claude/directive-lifecycle-boundary.ts` | `readInput` loop (90-92) | same | nothing, exit 1 |
| 15 | `claude/compact-inject.ts` | `readFileSync(0)` in the snapshot worker (428) | same | nothing, exit 0 |

Line numbers are from the unedited tree. `tasks.md` quotes the exact text each edit finds, and `scratch/dispatch-units.json` holds the same edits one per unit.

### Contracts that bind the edits
- `sk-code` routes this TypeScript and JavaScript to the `sk-code-opencode` surface: box-drawn `MODULE:` headers stay, comments state the durable reason only and name no spec path, phase or task id.
- `sk-doc` covers the two README edits: current-state wording, no em dashes, numbered headings untouched, and `validate_document.py` must still print `VALID`.
- `sk-create-changelog` covers the entry: global component folder `.skilled/skills/system-spec-kit/changelog/` (reached through the `.skilled/changelog/system-spec-kit` symlink), the next four-part version, the compact shape with `What's New at a Glance` and `Upgrade`.

### Handoffs
- **Hermes mirror (orchestrator).** `SKILL.md` changes, so `sync-skills-hermes.cjs` will report `DRIFT system-spec-kit`. The orchestrator runs the generator once after every child is built. The builder runs only the `--check` form.
- **Trigger index (orchestrator).** The new changelog entry declares trigger phrases. Rebuilding `runtime/data/trigger-index.json` is a repo-wide step outside this child's files.
- **Parent changelog (orchestrator).** The phase-close refresh of `../changelog/` named in `spec.md` belongs to the orchestrator.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Phase 1 records every baseline and the scope snapshot. Phase 2 reads the contracts first, then makes one edit per task, in the same order as `scratch/dispatch-units.json`. Phase 3 runs one verification per requirement and success criterion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### New suite: `runtime/hooks/lib/hook-stdin-deadline.test.mjs`
- **Deadline test** (one parent test, 32 subtests): every runnable entry, sixteen plain hooks and sixteen compiled `dist/` entries including the snapshot worker mode, is spawned at once with a stdin pipe that is never written or ended. Each must exit on its own (no signal), with its recorded exit code and stdout, no earlier than 2900 ms (1700 ms for the three Claude lifecycle hooks with their 1800 ms budget) and before 10000 ms. A disabled hook would exit at once and hide a missing deadline, so the test deletes every `*_DISABLED` variable and points `HOOK_FLAGS_CONFIG` at a missing file.
- **Payload tests** (four tests whose names contain `still`): the Cursor post-tool-use hook routes a `Write` payload to a stub chained hook and relays its output; the lifecycle boundary forwards a valid payload to a stub target; the Codex, Cursor and Devin session-start adapters answer a valid payload with session context; and the compiled reader drops a payload over 1 MB before the deadline, with the Claude warning.
- Planner runs on a full copy of the tree: before the edits `ℹ tests 37`, `ℹ pass 7`, `ℹ fail 30`: the four payload tests and the three Claude 1800 ms subtests pass, while the other 29 subtests and their parent fail. After the edits and a build, `ℹ tests 37`, `ℹ pass 37`, `ℹ fail 0` in three runs of about 3.6 seconds each.

### Existing suites, which must keep their counts
- From `.skilled/skills/system-spec-kit/runtime`: `npx vitest run tests/hook-*.vitest.ts tests/hooks-*.vitest.ts tests/user-prompt-submit-shim.vitest.ts tests/directive-lifecycle-*.vitest.ts tests/edge-cases.vitest.ts tests/completion-evidence-sentinel.vitest.ts`. This is the hooks README's validation set plus the two suites that call `parseHookStdin` and spawn the Cursor response hook. Planner baseline in the worktree: `Test Files  16 passed (16)`, `Tests  290 passed (290)`. Same after the edits on the planner's copy.
- `node --test tests/hooks/*.test.mjs`: `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0`, `ℹ skipped 3`, before and after.

### Behavior comparison
`scratch/compare-fail-open.mjs` runs the same 32 entries with an empty stdin and with `{not-json`, and compares each exit code and stdout with `scratch/baseline/fail-open-before.json`, which the planner recorded on the unedited worktree. Expected `cases=64 mismatches=0`. It printed that on the unedited tree and on the planner's edited copy.

### Exact-edit check
`scratch/build-units.py verify scratch/before` rebuilds the 21 touched files from the saved pre-edit copy plus only the planned edits and compares them byte for byte with the live files. Expected `files=21 mismatches=0`. On the unedited tree it prints `mismatches=21`.

### Other checks
- `node --check` on the nine edited `.mjs` and `.cjs` files and the new test. `npm run typecheck` exits 0. ESLint on the seven TypeScript files exits 0; the baseline has no finding in these files. `claude/user-prompt-submit.ts` carries four unused-import errors that predate this phase and is not linted here.
- `node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all` prints `All watched dist outputs are fresh.` before and after the build.
- `python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .skilled/skills/system-spec-kit/runtime/hooks`: baseline `[alignment-drift] PASS` with `Findings: 0`. It reads tracked files only, so the two new files are scanned only once staged.
- `validate_document.py` on both READMEs (baseline `VALID`, `Total issues: 0`) and on the new changelog (`VALID`, `Document type: changelog`, `Total issues: 0` on the planner's copy).

### Prototype evidence
The planner applied every unit to a full copy of the system-spec-kit skill with the runtime mirror folders copied in: every find text matched exactly once in order (`scratch/build-units.py check .` prints `edit units=35 bad=0`), typecheck and ESLint passed, `npm run build` exited 0 and emitted `dist/hooks/shared-stdin.js`, the new test went from 7 to 37 passes, both existing suites kept their counts, the symlinked entries answered as before, and the comparison printed `mismatches=0`.

### Gaps
- The test proves each entry exits at the deadline with stdin open. It does not prove how a real host behaves.
- `claude/user-prompt-submit.ts` still blocks on an open stdin (section 6).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `runtime/dist/` must exist and be fresh before Phase 1, because the compiled entries run from it. The planner's `check-all` printed `All watched dist outputs are fresh.` in the worktree.
- `.skilled/hooks/shared/hook-flags.*` and `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` are already imported by several files in this tree. THE FIX asks for no imports from `.skilled/hooks`; this phase adds none, and REQ-004 checks only that no file imports the `.skilled/hooks` stdin reader. The pre-existing flag and rule imports stay.
- Follow-up, not in this phase: `claude/user-prompt-submit.ts:81-95` reads with a `readSync(0, ...)` loop that the requirement search does not match, and it blocks on an open stdin (the planner's probe killed it at 9 seconds). `tests/user-prompt-submit-shim.vitest.ts` runs the `.ts` source directly with Node's type stripping, which needs every relative import to name an existing file, so it cannot import `../shared-stdin.js` without breaking eight tests in that suite (seen on the planner's copy). Its hosts give it 3 seconds, so a fix needs a shorter, inlined deadline.
- No Hermes regeneration task belongs to the builder. See Handoffs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- The 18 modified files are tracked, so `git restore` on them undoes the edits. Without git, copy each one back from `scratch/before/<same repo path>`; those copies are the unedited files.
- Delete the three new files: `runtime/hooks/shared-stdin.ts`, `runtime/hooks/lib/hook-stdin-deadline.test.mjs` and `changelog/v2.7.1.0.md`.
- Run `npm run build` in `.skilled/skills/system-spec-kit/runtime` so `dist/` matches the restored sources, then confirm the freshness check prints `All watched dist outputs are fresh.`
- Rerun the Phase 1 baseline commands; their counts must match.
<!-- /ANCHOR:rollback -->

---

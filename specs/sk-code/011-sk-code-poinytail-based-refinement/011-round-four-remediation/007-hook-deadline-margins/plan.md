---
title: "Implementation Plan: Phase 7: hook-deadline-margins"
description: "Give the Claude prompt-submit shim an inlined 500 ms stdin deadline with its 1 MB cap, give the seven hook entries whose host allows 3 seconds the same 500 ms deadline through the shared readers, and extend the open-stdin test to all sixteen readers."
trigger_phrases:
  - "hook deadline margins plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: hook-deadline-margins

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript compiled to `runtime/dist/` by `tsc --build`, plain ES modules (`.mjs`). Node v26.8.2 observed |
| **Framework** | None. Node built-ins only |
| **Storage** | None |
| **Testing** | `node --test` for `hooks/lib/hook-stdin-deadline.test.mjs` and `tests/hooks/*.test.mjs`, vitest for the `tests/*.vitest.ts` hook set, `npm run typecheck`, ESLint, two planner probes in `scratch/` |

### Overview
The shim `runtime/hooks/claude/user-prompt-submit.ts` reads stdin with a blocking `readSync(0, ...)` loop (lines 81-95), so it never returns while its host keeps stdin open. It gets an inlined, event-based read with a 500 ms deadline and its existing 1 MB cap, because its suite runs the `.ts` source directly and cannot import `../shared-stdin.js`. The seven entries registered with a 3 second host timeout then get the same 500 ms deadline: the compiled ones through a new `SHORT_HOST_STDIN_TIMEOUT_MS` in `shared-stdin.ts` and an optional deadline argument on `parseHookStdin` and `readCodexHookInput`, the two `.mjs` classifiers through the same constant in `lib/hook-adapter-shared.mjs`. Every other entry keeps 3000 ms, and every fail-open answer stays as it is.
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
One deadline value for the short-timeout entries, carried by the two shared readers that already hold the 3000 ms default, plus one inlined copy in the shim that cannot import either.

### Key Components
- **`shared-stdin.ts`**: keeps `HOOK_STDIN_TIMEOUT_MS = 3000` and gains `SHORT_HOST_STDIN_TIMEOUT_MS = 500`.
- **`lib/hook-adapter-shared.mjs`**: `readStdin({ timeoutMs = 3000 })` is unchanged and the file gains the same exported constant.
- **`claude/shared.ts` `parseHookStdin(timeoutMs = HOOK_STDIN_TIMEOUT_MS)`** and **`codex/shared.ts` `readCodexHookInput(event, requiredFields, timeoutMs = HOOK_STDIN_TIMEOUT_MS)`**: a default argument, so every caller that passes nothing keeps 3000 ms.
- **`claude/user-prompt-submit.ts`**: `readBoundedStdin()` returns a `Promise<Buffer>` that settles on `end`, on the 500 ms timer, or rejects with `INPUT_OVERFLOW` past 1 MB after destroying stdin. `runShim()` becomes `async` and awaits it where it used to call it, inside the same `try`, after target resolution, so every diagnostic and `{}` answer stays in place.
- **`lib/hook-stdin-deadline.test.mjs`**: replaced whole with the planner's copy in `scratch/units/`. It adds the shim entry, a `SHORT_HOST` bound of 400 ms to 2500 ms for the seven 3 second entries, a `holdOpen` option on `runHook`, and one test that writes a payload to the shim, Claude `SessionStart`, Claude `PreCompact` and Codex `SessionStart` without closing stdin.

### Data Flow
A host starts the hook and writes its payload. The reader collects chunks until the stream ends or the deadline passes, releases its listeners, pauses stdin and returns the text. With a 500 ms deadline the entry has at least 2.5 seconds left for its work before a 3 second host kills it. When the host closes stdin at once, as it normally does, the deadline never fires and nothing changes.

### Measurement that sets the deadline
The planner measured each 3 second entry on the unedited worktree with `scratch/measure-post-read-work.mjs`: the payload is written and stdin is ended at once, so the time is process start plus the work after the read. A bare `node -e 0` took a 30 ms median.

| Entry (host event) | Median, 7 runs | Max, 7 runs |
|---|---|---|
| `dist/hooks/claude/compact-inject.js` (Claude PreCompact) | 156 ms | 244 ms |
| `dist/hooks/claude/session-prime.js` (Claude SessionStart) | 111 ms | 204 ms |
| `dist/hooks/claude/user-prompt-submit.js` (Claude UserPromptSubmit) | 175 ms, then 235 ms on a warm rerun | 1748 ms on the first, cold advisor run, then 299 ms |
| `hooks/claude/spec-gate-classify.mjs` (Claude UserPromptSubmit) | 36 ms | 38 ms |
| `dist/hooks/codex/session-start.js` (Codex SessionStart) | 134 ms | 141 ms |
| `dist/hooks/codex/user-prompt-submit.js` (Codex UserPromptSubmit) | 226 ms | 314 ms |
| `hooks/codex/spec-gate-classify.mjs` (Codex UserPromptSubmit) | 35 ms | 39 ms |

`scratch/measure-open-stdin.mjs` writes the same payloads and keeps stdin open. On the unedited worktree, one run each: compact-inject 2114 ms with no payload processed, session-prime 1917 ms with no payload processed, the shim killed by the probe at 12004 ms, the two classifiers 3050 ms and 3040 ms, Codex session-start 3182 ms and Codex user-prompt-submit 3261 ms. On the planner's edited copy, three runs each: every median between 542 ms and 641 ms, every max at most 707 ms, `entries=7 late=0`.

### Decisions
- **D1. The shim gets an inlined reader, not an import.** Round three left it out (its D5 and the follow-up in its section 6) because `tests/user-prompt-submit-shim.vitest.ts` runs `hooks/claude/user-prompt-submit.ts` with Node's type stripping, and an import of `../shared-stdin.js` names a file that does not exist beside the source, which broke eight tests on its planner's copy. This plan answers that reason by keeping the shim free of new imports: the reader is a local function with the same semantics as `readHookStdin`, so the source still runs directly. The planner's edited copy passed the shim suite 8 of 8.
- **D2. The short deadline is 500 ms.** Round three set 3000 ms for every entry (its D2) to match the `.skilled/hooks` sibling, accepting that a 3 second host kills those entries at about the same moment (its Known Limitation 2). This plan answers that with the measurement above. The work after the read took at most 314 ms on a warm run and 1748 ms once, on a cold advisor start. 500 ms plus 314 ms leaves about 2.2 seconds of the 3 seconds, and even the cold outlier leaves 750 ms. 1000 ms would leave only 252 ms in that cold case. Hosts write their payload when they start the hook, so a payload still in flight after 500 ms is not a case the planner could produce.
- **D3. Seven entries get the short deadline**, every spec-kit entry whose binding in `cli/runtime-mirrors/hook-registry.json` says `"timeout":3`: `dist/hooks/claude/compact-inject.js` (PreCompact), `dist/hooks/claude/session-prime.js` (SessionStart), `dist/hooks/claude/user-prompt-submit.js` and `hooks/claude/spec-gate-classify.mjs` (UserPromptSubmit), `dist/hooks/codex/session-start.js` (SessionStart), and `dist/hooks/codex/user-prompt-submit.js` and `hooks/codex/spec-gate-classify.mjs` (UserPromptSubmit). THE FIX names five host events. Two of them, Claude and Codex UserPromptSubmit, each register two spec-kit entries, so the classifiers are included. Every other entry has a host timeout of 5 or 10 seconds and keeps 3000 ms.
- **D4. The deadline travels as an argument with a 3000 ms default.** `parseHookStdin` serves Claude `SessionStop` (10 seconds) as well, and `readCodexHookInput` serves Codex `Stop` and `PreCompact`. A default argument changes only the callers that pass the constant, and the existing `edge-cases.vitest.ts` calls to `parseHookStdin()` keep their meaning.
- **D5. The 1800 ms `withTimeout` in the Claude lifecycle hooks stays.** THE FIX keeps it. With a 500 ms read under it, Claude `SessionStart` and `PreCompact` now see a payload that arrived on a stdin that stays open, where today the 1800 ms budget fires first and drops it.
- **D6. The child timeouts stay.** The shim kills its advisor child at 2500 ms and the Codex adapters kill their Claude child at 2800 ms. Those values assume a near-zero read, and the shim suite pins the 2200 ms budget and the 2500 ms kill. If stdin stays open and the child also runs to its kill timeout, 500 ms plus that timeout passes 3 seconds and the host still kills the hook. Today the same case never ends at all, so this is a strict improvement, and it is recorded as a residual rather than changed here.
- **D7. The unused imports go.** The shim's `readSync` becomes unused once the loop goes, and THE FIX allows removing the four pre-existing unused imports (`readFileSync`, `writeFileSync`, `tmpdir`, `createHash`). The `HookInput` unused-import error in `claude/session-prime.ts:15` predates this phase and THE FIX does not name it, so it stays and the lint check expects exactly that one error there.
- **D8. The test file is replaced whole** with `cp` from `scratch/units/hook-stdin-deadline.test.mjs` and proven with `cmp`, as round three did for its new files. It would need about a dozen separate edits, and one copy is safer for a literal builder. `diff scratch/before/.../hook-stdin-deadline.test.mjs scratch/units/hook-stdin-deadline.test.mjs` shows every change for review.
- **D9. Version 2.7.2.0, a patch**, per `sk-create-changelog` section 4: a bug fix on 2.7.1.0. The entry uses the compact shape of `assets/changelog-template.md`, with an `&nbsp;` line before each H2. `changelog/v2.7.1.0.md` is not touched.

### Contracts that bind the edits
- `sk-code` routes this TypeScript and JavaScript to the `sk-code-opencode` surface: box-drawn `MODULE:` headers stay, comments state the durable reason only and name no spec path, phase or task id.
- `sk-doc` covers the three README edits: current-state wording, no em dash, no semicolon in new prose, numbered headings untouched, and `validate_document.py` must still print `VALID`.
- `sk-create-changelog` covers the entry: global component folder `.skilled/skills/system-spec-kit/changelog/` (reached through the `.skilled/changelog/system-spec-kit` symlink), the next four-part version, the compact template shape. The planner ran `hvr_scan.py` on it: 0 hard blockers.

### Handoffs
- **Hermes mirror (orchestrator).** `SKILL.md` changes, so `sync-skills-hermes.cjs --check` will report `DRIFT system-spec-kit`. The orchestrator runs the generator once after every child is built. The builder runs only the `--check` form.
- **Trigger index and retrieval fixtures (orchestrator).** The new changelog entry declares trigger phrases. Rebuilding `runtime/data/trigger-index.json` and the retrieval fixtures that list changelog files (`runtime/cli/retrieval/fixtures/corpus-manifest.json`, `phrase-variants.json`) is a repo-wide step outside this child's files. The index was already stale for 38 documents before this phase.
- **Parent changelog (orchestrator).** The phase-close refresh of `../changelog/` named in `spec.md` belongs to the orchestrator.
- No edit is handed to another child: every file this fix needs is in this child's own list.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Phase 1 records every baseline and the scope snapshot. Phase 2 reads the contracts first, copies the new test and watches it fail, then makes one edit per task in the same order as `scratch/dispatch-units.json`, then builds. Phase 3 runs one verification per requirement and success criterion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### The deadline test
- After the copy and before any source edit: `ℹ tests 39`, `ℹ pass 32`, `ℹ fail 7`. The seven failures are the two classifiers, the shim, Codex session-start and Codex user-prompt-submit subtests (each still waits 3000 ms or forever), their parent test, and the held-open payload test. About 30 seconds, because two runs wait for the 15 second kill timer.
- After the edits and a build: `ℹ tests 39`, `ℹ pass 39`, `ℹ fail 0` in three runs of about 4.2 seconds each on the planner's copy.

### Existing suites, which must keep their counts
- From `.skilled/skills/system-spec-kit/runtime`: `npx --no-install vitest run tests/hook-*.vitest.ts tests/hooks-*.vitest.ts tests/user-prompt-submit-shim.vitest.ts tests/directive-lifecycle-*.vitest.ts tests/edge-cases.vitest.ts tests/completion-evidence-sentinel.vitest.ts`: `Test Files  16 passed (16)`, `Tests  290 passed (290)` before, and the same on the planner's edited copy.
- `node --test tests/hooks/*.test.mjs`: `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0`, `ℹ skipped 3` before and after.

### Planner probes in `scratch/`
- `compare-fail-open.mjs` runs 33 entries, the 32 round three covered plus the shim, with an empty stdin and with `{not-json`, and compares each exit code and stdout with `scratch/baseline/fail-open-before.json`, recorded on the unedited worktree. Expected `cases=66 mismatches=0`, which it printed on the unedited tree and on the edited copy.
- `measure-open-stdin.mjs` checks the margin: `entries=7 late=0 margin_ms=1000 runs=3` and exit 0 after the edits, `late=5` or `late=6` and exit 1 before, depending on whether the Claude lifecycle hooks finish just under or just over 2000 ms.
- `measure-post-read-work.mjs` reruns the measurement behind D2. It prints numbers and has no pass line.
- `build-units.py check .` proves every Phase 2 find text occurs exactly once in order: `edit units=28 bad=0`. `build-units.py verify scratch/before` rebuilds the 17 touched files from the saved pre-edit copies plus only the planned units and compares them byte for byte: `files=17 mismatches=0`.

### Other checks
- `npm run typecheck` exits 0. ESLint on `claude/user-prompt-submit.ts`, `shared-stdin.ts`, `claude/shared.ts`, `codex/shared.ts`, `claude/compact-inject.ts`, `codex/session-start.ts` and `codex/user-prompt-submit.ts` exits 0, where the baseline had four errors in the shim. ESLint on `claude/session-prime.ts` shows its one pre-existing error before and after.
- `node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all` prints `All watched dist outputs are fresh.` before and after the build.
- `validate_document.py` on the three READMEs and the new changelog: `VALID`, `Total issues: 0`.

### Prototype evidence
The planner copied the system-spec-kit skill and the runtime mirror folders into `scratch/proto/`, applied every unit, built, and ran the suites there: typecheck 0, ESLint as above, `npm run build` exit 0, the deadline test 39 of 39 three times, the vitest set 290 of 290, `node --test tests/hooks` 181 passed, `compare-fail-open` 66 of 66, and `measure-open-stdin` `late=0`. With the real advisor named through `SPECKIT_USER_PROMPT_TARGET`, the edited shim answered a held-open payload with the advisor's context in 710 ms. The copy is removed before the build starts.

### Gaps
- The tests prove each entry exits on its own and acts on a held-open payload. They do not prove how a real host behaves.
- The case in D6, an open stdin plus a child that runs to its kill timeout, still exceeds 3 seconds.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `runtime/dist/` must be fresh before Phase 1, because the compiled entries run from it. The planner's `check-all` printed `All watched dist outputs are fresh.` in the worktree.
- `.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js` must exist, because the shim resolves it at run time. The deadline test's shim entry expects the `{}` answer the advisor gives on an empty payload.
- Other children of this parent are built at the same time but own no file under `.skilled/skills/system-spec-kit/`.
- No Hermes regeneration task belongs to the builder. See Handoffs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- The 16 modified files are tracked, so `git restore` on them undoes the edits. Without git, copy each one back from `scratch/before/<same repo path>`, which holds the unedited files.
- Delete the new `.skilled/skills/system-spec-kit/changelog/v2.7.2.0.md`.
- Run `npm run build` in `.skilled/skills/system-spec-kit/runtime` so `dist/` matches the restored sources, then confirm the freshness check prints `All watched dist outputs are fresh.`
- Rerun the Phase 1 baseline commands. Their counts must match.
<!-- /ANCHOR:rollback -->

---

---
title: "Implementation Summary"
description: "Every test left in spec-kit's test tree now loads, tests code that exists and runs from a package script. Fourteen dead files are gone, five live tests run again, and the three phase defects they found in create.sh and validate.sh are fixed. Follow-ups keep create.sh --json output to its payload, make a scaffold with no install match a tsx one, and fill the sk-design/020 phase map."
trigger_phrases:
  - "retire memory-era tests"
  - "dead spec-kit test files"
  - "test-phase-validation cannot load"
  - "manual playbook runner retired"
  - "memory-quality test never collected"
  - "phase map rows never filled"
  - "empty phase child skipped"
  - "no-tsx template fallback"
  - "level contract fallback"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-retire-memory-era-tests"
    last_updated_at: "2026-09-24T07:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the no-install fallbacks and the --json output, and filled the sk-design/020 phase map"
    next_safe_action: "Push the follow-up commits"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/package.json"
      - ".skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/template-utils.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/inline-gate-renderer-fallback.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/level-contract-fallback.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-035-retire-memory-era-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-retire-memory-era-tests |
| **Completed** | 2026-09-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Spec-kit's test tree no longer holds tests that cannot run. The ones written for the retired memory database, a removed template layout and a playbook runner that could not build its fixture are gone. The five that cover live features load, run inside throwaway repositories and run from the package scripts, and the three defects they found on their first real run are fixed.

### The dead tests

`npm test` at the skill root had been exiting 1 at its third step, on a factory test that loads a facade removed with the memory database, so neither workspace suite ever ran from there. That step and the file are gone, along with the other tests for removed modules, the two stub-only archive suites and the playbook runner. The live embedding factory keeps its coverage in five vitest suites, and `CONTRIBUTING.md` now points at them.

### The revived tests and what they found

The phase scripts threw at load, and when they last ran they wrote packets into the checkout's `.opencode/specs`. Brought back, they failed on three things that were real. A new phase parent's map was empty, because a template edit on 2026-09-07 renamed the row markers `create.sh` looks for. Appended phase rows landed after the blank line that ends the table. And an empty phase child had gone unchecked since the shell validator was deleted on 2026-08-29. Each fix landed on its own, with its assertion shown red first.

### Scaffolding with no install

With no `node_modules`, `create.sh` wrote no `spec.md`, `plan.md` or `tasks.md` at all, put a stray template line into `CREATED_FILES` and exited 0. Two fallbacks caused it. The template renderer's kept only the first level block, and the level contract's dropped the optional and lifecycle docs. Each is now a plain-JavaScript copy of its TypeScript source, and a parity test holds the two to identical output at every level. From a `git archive` export of the skill with no install, a Level 2 or 3 scaffold now matches a tsx scaffold byte for byte apart from its timestamps. Porting the renderer also turned up a quirk both copies shared: a template path given before `--level` was dropped, and the renderer read stdin instead. Both now read it.

### The rest

`create.sh --json` printed the description generator's status line ahead of its payload. That output now goes to stderr, and the phase test parses stdout strictly. `specs/sk-design/020-chart-and-diagram-review`, the one parent the marker defect left empty, now lists its two phases and their handoff, and its `synthesis.md` has the frontmatter it lacked, so the packet validates clean. A scaffold with no build still cannot write `description.json` or derive its graph metadata, but `create.sh` now says so on stderr, naming the missing generator and how to get it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/tests/test-bug-regressions.js`, `test-utils.js`, `test-embeddings-behavioral.js`, `test-embeddings-factory.cjs`, `test-memory-quality-lane.js`, `test-five-checks.js` | Deleted | Tests for removed modules and layouts |
| `runtime/tests/archive/` | Deleted | Two stub-only suites and their README |
| `runtime/cli/tests/manual-playbook-runner.{ts,js,vitest.ts}`, `fixtures/manual-playbook-fixture.{ts,js}` | Deleted | The runner and its fixture |
| `runtime/cli/spec/create.sh` | Modified | Row markers matched, appended rows placed inside each table |
| `runtime/cli/spec/validate.sh` | Modified | An empty phase child is validated |
| `runtime/cli/tests/test-phase-validation.js`, `test-phase-system.js`, `test-phase-system.sh` | Modified | Load as ES modules, run in sandboxes, assert current behaviour |
| `runtime/cli/tests/memory-quality-phase2-pr3.vitest.ts`, `memory-quality-phase6-migration.vitest.ts` | Renamed | Collected by the `cli` vitest project |
| `runtime/cli/package.json`, `package.json`, `runtime/vitest.config.ts` | Modified | Scripts and config follow the files |
| `runtime/cli/evals/check-source-dist-alignment.ts` | Modified | Runner allowlist entries removed |
| `CONTRIBUTING.md`, two feature-catalog entries, two playbook files, `runtime/cli/tests/fixtures/README.md` | Modified | No mention of a deleted file |
| `sk-doc/scripts/tests/code-folder/*.json` | Modified | Archive folder removed from the README snapshots |
| `runtime/cli/spec/create.sh`, `runtime/cli/tests/test-phase-system.js` | Modified | Generator output to stderr, strict `--json` parse |
| `runtime/cli/templates/inline-gate-renderer.sh`, `inline-gate-renderer.ts` | Modified | Renderer fallback copied from its source, template path read before `--level` |
| `runtime/cli/lib/template-utils.sh` | Modified | Level contract fallback copied from the resolver |
| `runtime/cli/tests/inline-gate-renderer-fallback.vitest.ts`, `level-contract-fallback.vitest.ts` | Created | Parity tests for the two fallbacks |
| `runtime/cli/tests/inline-gate-renderer.vitest.ts` | Modified | Template path before `--level` |
| `runtime/cli/tests/create-without-build.vitest.ts` | Created | Skipped generators must be reported |
| `specs/sk-design/020-chart-and-diagram-review/spec.md`, `synthesis.md` | Modified | Phase map filled, synthesis frontmatter added |

Paths are under `.skilled/skills/system-spec-kit/` except `CONTRIBUTING.md` at the repo root, `sk-doc/` under `.skilled/skills/`, and `specs/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Seven commits, one per cause. Every deletion was traced to the module or layout it needed, and every live reference outside `specs/` and the changelogs went in the same commit as its file. The revived tests ran first as they stood. Their stale expectations were matched to the code's history: the March scoring fix, the four-column map, the per-folder validation output. The assertions that caught real defects were sharpened, run red, and then turned green by the fix commits. Seven follow-up commits came after the first push, three after the second and two after the third, and the code changes among them went the same way: each fallback's parity test ran red against the old fallback first, and an injected defect in each port turned its test red again before the commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the three defects here rather than pin them as known gaps | The operator's call once the revived tests exposed them |
| Validate only a child with no files at all | Six real parents keep numbered `research/` or `review/` folders as children, and validating those as packets would turn their runs red |
| Send the generator's output to stderr rather than parse around it | The operator's call. In `--json` mode stdout belongs to the payload, and the phase test now fails on anything else |
| Keep the real renderer in the shell sandbox, and fix the fallback on its own | The phase test should exercise what a real checkout runs, and the fallback has its own parity test |
| Copy each TypeScript source line for line into its fallback rather than share one module | The fallbacks run where no build or loader exists, and several sandboxes copy only the shell file |
| Fill the sk-design/020 map here | The operator's call. A search found it was the only parent still holding the row markers |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `test-phase-validation.js` | PASS, 51 assertions; 2 failed before the validate.sh fix |
| `test-phase-system.js` | PASS, 27 assertions; 1 failed before the append fix |
| `test-phase-system.sh` | PASS, 10 assertions; 2 failed before the create.sh fixes |
| `npm run test:legacy` and `npm run test:validation` in `runtime/cli` | PASS, both |
| `cli` vitest project | PASS, 1467 tests, 19 declared skips. After the phase-parent stop, 1466 passed and `gate-3-classifier` timed out at 30s under another session's bulk validation; alone it passes 64 of 64 |
| `create-without-build.vitest.ts` | PASS, 3 tests. All 3 failed before the warnings, 2 failed again with one warning removed, and the phase-parent case failed with only its stop removed |
| `inline-gate-renderer-fallback.vitest.ts` | PASS, 13 tests: 18 templates at 7 levels, a synthetic template, stdin, errors. 11 failed on the old fallback |
| `level-contract-fallback.vitest.ts` | PASS, 17 tests: 7 levels and 7 malformed manifests. 16 failed on the old fallback |
| Injected defects in each port | Each turned its parity test red, then reverted to green |
| Install-free `create.sh` scaffold, Level 2 and 3 | Matches a tsx scaffold apart from `last_updated_at`. The old fallbacks wrote no spec, plan or tasks |
| Suites that drive create.sh (19 files) and validate.sh (16 files) | PASS after each fix, only declared skips |
| Checkout and temp directory after the phase tests | Unchanged, no leftover sandbox |
| sk-doc README manifest and verdict parity | PASS, 819 directories, 1303 READMEs |
| Source/dist alignment check and playbook provenance suite | PASS |
| Reference search outside `specs/` and changelogs | Only the generated trigger index, regenerated at push |
| `root` vitest project | PASS, 1253 tests, 13 declared skips, after a forced rebuild cleared `dist-freshness` in this checkout |
| `specs/` search for the phase row marker | No `spec.md` holds it |
| sk-design/020 validation | PASS with no errors or warnings; recursive PASS with one pre-existing warning per child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A scaffold made with no build has no `description.json` and a stub graph metadata file.** Both generators need `runtime/cli/dist/` or tsx. `create.sh` now warns for each one it skips, and a phase parent, which needs its description, stops instead, whether made with `--phase` or `--level phase-parent`.
2. **`dist-freshness` fails on timestamps alone.** The build skips writing unchanged output, so a source touched without a rebuild stays newer than its build. A forced rebuild cleared it here, but another checkout in that state fails the same way until it runs `tsc --build --force`.
3. **The shipped templates cover less than the renderer does.** None has a fence or a blank line after an inactive gate, so the parity test's synthetic template is what guards those two paths.
<!-- /ANCHOR:limitations -->

---

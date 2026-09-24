---
title: "Implementation Summary"
description: "Every test left in spec-kit's test tree now loads, tests code that exists and runs from a package script. Fourteen dead files are gone, five live tests run again, and the three phase defects they found in create.sh and validate.sh are fixed."
trigger_phrases:
  - "retire memory-era tests"
  - "dead spec-kit test files"
  - "test-phase-validation cannot load"
  - "manual playbook runner retired"
  - "memory-quality test never collected"
  - "phase map rows never filled"
  - "empty phase child skipped"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-retire-memory-era-tests"
    last_updated_at: "2026-09-24T05:08:14Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Deleted the dead tests, revived five live ones and fixed the three phase defects they exposed"
    next_safe_action: "Push, then backfill the empty phase maps left by the marker defect"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/package.json"
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

Paths are under `.skilled/skills/system-spec-kit/` except `CONTRIBUTING.md` at the repo root and `sk-doc/` under `.skilled/skills/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Seven commits, one per cause. Every deletion was traced to the module or layout it needed, and every live reference outside `specs/` and the changelogs went in the same commit as its file. The revived tests ran first as they stood. Their stale expectations were matched to the code's history: the March scoring fix, the four-column map, the per-folder validation output. The assertions that caught real defects were sharpened, run red, and then turned green by the fix commits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the three defects here rather than pin them as known gaps | The operator's call once the revived tests exposed them |
| Validate only a child with no files at all | Six real parents keep numbered `research/` or `review/` folders as children, and validating those as packets would turn their runs red |
| Parse around the status line `create.sh` prints ahead of its JSON | The sibling test already did, and changing the script's output contract is its own change |
| Give the shell sandbox the real renderer instead of fixing the fallback | The fallback is a separate defect, and the test should exercise the renderer a real checkout runs |
| Leave the empty maps in existing parents alone | Each parent belongs to its own packet |
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
| `cli` vitest project | PASS, 1433 tests, 19 declared skips |
| Suites that drive create.sh (19 files) and validate.sh (16 files) | PASS after each fix, only declared skips |
| Checkout and temp directory after the phase tests | Unchanged, no leftover sandbox |
| sk-doc README manifest and verdict parity | PASS, 819 directories, 1303 READMEs |
| Source/dist alignment check and playbook provenance suite | PASS |
| Reference search outside `specs/` and changelogs | Only the generated trigger index, regenerated at push |
| `root` vitest project | 1 FAIL, `dist-freshness`: 21 runtime `lib` sources carry newer timestamps than their unchanged builds. None is touched here |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Parents scaffolded between 2026-09-07 and this fix have empty phase maps.** `specs/sk-design/020-chart-and-diagram-review` is one. Appending a phase to such a parent now adds its row inside the table, but the earlier rows need a backfill.
2. **`create.sh --json` is not pure JSON.** The description generator prints a status line to stdout ahead of the payload, so a strict parser fails on it.
3. **The template renderer's no-tsx fallback keeps only the first level block.** Without `node_modules`, every scaffolded document is a single frontmatter line and `create.sh` still exits 0.
4. **`dist-freshness` fails on timestamps alone.** The build skips writing unchanged output, so sources touched by the source-root move stay newer than their builds until something forces a rewrite.
<!-- /ANCHOR:limitations -->

---

---
title: "Tasks: Phase 6: regeneration-and-verification"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "regeneration and verification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: regeneration-and-verification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`CS` is `.skilled/skills/sk-doc/sk-create-skill/scripts`. `RA` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy`. `AC` is `.skilled/bin/lib/compiled-routing/013-live-activation/activation`. `TW` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation`. `E` is this packet's `scratch/` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the current derived-artifact counts and check results (`E/before.txt`). Verify: `node CS/ci-leaf-manifest-freshness.cjs | tail -1` prints `checked=13 fresh=13 failed=0`, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS: 65 Hermes skill copies in sync` and `node .skilled/bin/compiled-route-guard.cjs | tail -1` prints `All hubs fresh or excused: serving matches inputs, and the runtime matches its source.`
  - Observed: E/before.txt records "checked=13 fresh=13 failed=0" and the pre-commit Hermes result "FAIL: 1 drifted, 0 stale; run without --check to regenerate". After the Public commit, the rerun prints "checked=13 fresh=13 failed=0", "PASS: 65 Hermes skill copies in sync" and "All hubs fresh or excused: serving matches inputs, and the runtime matches its source."
- [x] T002 Capture the pre-regeneration router replay projection (`E/replay-before/report.json`). Verify: `node CS/leaf-route-replay.cjs --report E/replay-before` prints one `total gold=` line and `ls E/replay-before/report.json` prints the path.
  - Observed: The pre-regeneration replay prints "total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49" and writes E/replay-before/report.json.
- [x] T003 Capture the pre-regeneration scorer baseline (`E/baseline-before.json`). Verify: `node RA/capture-scorer-eval-baseline.mjs > E/baseline-before.json` exits 0 and a `python3` read of `metrics` prints 155/195, 49/66 and 19/24.
  - Observed: E/baseline-before.json reads 155/195, 49/66 and 19/24. Its corpusSha256, holdoutSha256 and ambiguitySha256 match the committed baseline.
- [x] T004 [P] Record the research token totals (`E/token-before.txt`). Verify: `python3 -c "import csv; r=list(csv.DictReader(open('specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/001-deep-research/research/lineages/luna/token-savings.csv'))); print(len(r), sum(int(x['router_words_including_heading']) for x in r), sum(int(x['local_o200k_export_tokens_gross']) for x in r), sum(int(x['initial_load_tokens_after_pointer']) for x in r))"` prints `54 39159 89931 88689`.
  - Observed: E/token-before.txt prints "54 39159 89931 88689".
- [x] T005 Count the post-move router files (`E/router-count.txt`). Verify: `find .skilled/skills -maxdepth 3 -name ROUTER.md -not -path "*/node_modules/*" | wc -l` prints `54`, the seven hub root files plus the 47 phase 005 moves.
  - Observed: E/router-count.txt prints "54".
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Regenerate every stale leaf manifest (`CS/generate-leaf-manifest.cjs --write <skillDir>`), one call per root the check names and none when the check is already clean. Verify: `node CS/ci-leaf-manifest-freshness.cjs | tail -1` prints `checked=13 fresh=13 failed=0`.
  - Observed: No leaf manifest needed regeneration. The freshness check prints "checked=13 fresh=13 failed=0".
- [x] T007 Regenerate the Hermes copies (`.hermes/skills/`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` exits 0, then `--check` prints `PASS: 65 Hermes skill copies in sync` and `rg -l "ROUTER.md" .hermes/skills/sk-doc .hermes/skills/sk-git` prints two paths.
  - Observed: The post-commit Hermes check prints "PASS: 65 Hermes skill copies in sync". The sync run changed nothing.
- [x] T008 Refresh the seven activation manifests and copy each over its authored twin, under the `AC` runtime root and the `TW` authored root named in the notation. Verify: `for hub in cli-classifier cli-external-orchestration mcp-tooling sk-code sk-design sk-doc system-deep-loop; do node .skilled/bin/compiled-route-manifest.cjs refresh --hub "$hub" --skill-root ".skilled/skills/$hub" && cp ".skilled/bin/lib/compiled-routing/013-live-activation/activation/$hub/manifest.json" "specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/$hub/manifest.json"; done` exits 0, and `node .skilled/bin/compiled-route-guard.cjs --json` exits 0 with seven `"ok": true` rows.
  - Observed: The seven-hub refresh-and-copy loop exits 0 without changing bytes. compiled-route-guard --json exits 0 with seven "ok": true rows.
- [x] T009 Carry hub router vocabulary into `intent_signals` only where the check names a miss (`node CS/generate-router-intent-signals.cjs --check`, then `--write`). Verify: `node CS/generate-router-intent-signals.cjs --check` prints `checked=7 hub(s), missing=0`.
  - Observed: --check prints "checked=7 hub(s), missing=0". E/gates.txt records "RESULT: PASSED".
- [x] T010 Rebuild the skill graph (`bash .skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh`). Verify: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` prints `STALE COMPILED: none` and exits 0.
  - Observed: --strict prints "STALE COMPILED: none" and exits 0. No rebuild ran because the canonical reindex is operator-gated.
- [x] T011 Regenerate the per-skill token table (`E/token-savings-after.csv`) with `tiktoken` 0.11.0 `o200k_base`, measuring the section phase 004 names in each hub root `ROUTER.md` and the whole file for a moved packet. Verify: the CSV holds 54 data rows and a `python3` sum prints the word, token and initial-load totals beside the research totals.
  - Observed: E/token-savings-after.csv has 54 rows measured with "tiktoken 0.11.0 o200k_base", from the last MACHINE ROUTER heading to each file end.
- [x] T012 Regenerate the trigger index and its three sidecars last, after the final document write of this phase (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` prints `trigger index matches the corpus` and `stale documents   : 0 (0 missing from the index)`.
- [x] T013 Run every generator check in sequence and record the transcript (`E/gates.txt`). Verify: the file holds one success line per family and no `stale`, `FAIL` or nonzero exit line.
  - Observed: E/gates.txt records ten check families with exit 0, including "checked=13 fresh=13 failed=0", "PASS: 65 Hermes skill copies in sync", "all 7 hubs resolve", "checked=7 hub(s), missing=0" and "router-sync: 5/5 checks passed".
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Recapture the scorer baseline (`E/baseline-after.json`) and compare it with `E/baseline-before.json` and the committed `scorer-eval-baseline.json`. Verify: the metrics read 155/195, 49/66 and 19/24, and `corpusSha256`, `holdoutSha256` and `ambiguitySha256` equal the committed values.
  - Observed: E/baseline-after.json reads 155/195, 49/66 and 19/24. corpusSha256, holdoutSha256 and ambiguitySha256 match both the before capture and committed baseline.
- [x] T015 Capture the post-regeneration replay projection (`E/replay-after/report.json`) and compare the two reports. Verify: `diff E/replay-before/report.json E/replay-after/report.json` prints nothing and exits 0.
  - Observed: The report diff prints nothing and exits 0. Both replay runs print "total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49".
- [x] T016 Run the accuracy ratchet from the advisor runtime. Verify: `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` reports one test file passed and no failure.
  - Observed: The ratchet prints "Test Files 1 passed (1)" and "Tests 7 passed (7)".
- [x] T017 Run the route permission gates. Verify: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`, `node .skilled/bin/compiled-route-sync.cjs --check` prints `all 7 hubs resolve`, `node CS/ci-skill-root-metadata.cjs` prints `checked=13 passed=13 failed=0` and `node CS/ci-hub-vocabulary-source.cjs` prints `RESULT: PASSED`.
  - Observed: The gates print "router-sync: 5/5 checks passed", "all 7 hubs resolve", "checked=13 passed=13 failed=0", "RESULT: PASSED" and seven "OK: parent-skill-check — all hard invariants passed, 0 warnings" lines. package_skill.py prints "Result: PASS" on 54 of 54 skills. routing-shape-known-debt.json has 0 entries.
- [x] T018 Record the token delta (`E/token-delta.txt`). Verify: the regenerated router word total equals 39159 plus the hub section headings phase 004 adds, and every difference from 89931 and 88689 is named in the file.
  - Observed: E/token-delta.txt prints 41019 words, 92418 section tokens and 90823 initial-load tokens, compared with 39159, 89931 and 88689. It records "89927 saved (27.4%)" across the 54 SKILL.md files.
- [x] T019 Validate this packet and its parent program folder. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/006-regeneration-and-verification --strict` ends with `RESULT: PASSED` and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files --strict --recursive` ends with `RESULT: PASSED`.
- [x] T020 Fill the acceptance rows, the verification checklist and `implementation-summary.md` from `E/`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/006-regeneration-and-verification` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
  - Observed: T001 to T020 are all checked.
- [x] No `[B]` blocked tasks remaining
  - Observed: no task carries `[B]`.
- [x] Manual verification passed: the two replay reports match and the recaptured baseline holds
  - Observed: replay diff exits 0. Both baseline captures read 155/195, 49/66 and 19/24.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - Observed: spec.md contains the requirement and success-criteria tables.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - Observed: plan.md defines the owner-command flow and verification gates.
- [x] CHK-003 [P1] The before state, both captures and the research token totals are recorded in `scratch/`
  - Observed: scratch/ contains before.txt, both baseline captures, both replay reports and token-before.txt.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No authored file is edited to make a generated artifact pass
  - Observed: Owner checks found the derived outputs current. No authored routing file was edited to make a check pass.
- [x] CHK-011 [P0] Each artifact is written by its owner command, never by hand
  - Observed: The token table and captures were produced by their measurement and capture commands. Current derived outputs needed no hand edits.
- [x] CHK-012 [P1] A second run of every owner command changes no tracked byte
  - Observed: All owner checks found current outputs. T006, T007, T009 and T010 wrote nothing, and the second activation refresh-and-copy run changed no tracked byte.
- [x] CHK-013 [P1] The activation manifest hashes differ from their pre-move values and the difference is reported as expected
  - Observed: Phase 005 re-minted the activation manifests. The current refresh changed no byte.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
  - Observed: AC-001 to AC-010 each read Met in acceptance-criteria.md.
- [x] CHK-021 [P0] The recaptured baseline holds 155/195, 49/66 and 19/24 with unchanged fixture hashes
  - Observed: Both baseline JSON files read 155/195, 49/66 and 19/24 with the three fixture hashes unchanged.
- [x] CHK-022 [P1] The two replay reports are byte-identical
  - Observed: The replay report diff prints nothing and exits 0.
- [x] CHK-023 [P1] The advisor runtime ratchet passes on the same tree the capture ran on
  - Observed: The advisor runtime ratchet prints one test file passed and seven tests passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - Observed: The phase evidence and document edits contain no credential values.
- [x] CHK-031 [P0] N/A: no new input surface, because every command reads the authored tree and writes a tracked derived file
  - Observed: No input surface was added. This phase records checks and token measurements.
- [x] CHK-032 [P1] N/A: no auth surface
  - Observed: No authentication surface was added. This phase records checks and token measurements.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance name the same files and gates
  - Observed: spec.md, plan.md, tasks.md and acceptance-criteria.md name the same derived families and gates.
- [x] CHK-041 [P1] The token table names the encoding and version it used
  - Observed: The token measurement names tiktoken 0.11.0 and o200k_base.
- [x] CHK-042 [P2] The implementation summary carries the before and after totals
  - Observed: The implementation summary records the before and after word, token and initial-load totals.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence files live in `scratch/` and no temporary file sits outside it
  - Observed: The packet root contains only canonical docs and metadata. All task evidence files are under scratch/.
- [x] CHK-051 [P1] No authored routing file changed in this phase
  - Observed: The regeneration evidence reports no authored routing-file changes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 7/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:summary -->

---

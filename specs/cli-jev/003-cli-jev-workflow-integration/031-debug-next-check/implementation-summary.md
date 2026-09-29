---
title: "Implementation Summary"
description: "Complete at its label gate. score-debug-next-check.mjs prints a zero-call census (seam search with the generated fixture folder and its own files excluded, mined counts), validates an operator fixture outside the repository, scores the four constant answers, and holds a 30-row label gate and a jev_ok payload gate before the Jev or Deem arm. The 2026-09-29 final runs printed stop: fewer than 30 labeled rows, its 31 tests cover the gates, the baselines, both arms and the Keep Rule, and the system-spec-kit docs describe it. Built as ca40e3c2dc."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/031-debug-next-check"
    last_updated_at: "2026-09-29T23:30:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build committed as ca40e3c2dc; closed at its label gate"
    next_safe_action: "Operator: label 30 or more rows outside the repository, then run the scorer"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-031-debug-next-check"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "At least 30 labeled rows in a fixture outside the repository, then a live Deem run and a Jev run on the operator's yes"
      - "The seven recorded P2 findings"
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
| **Spec Folder** | 031-debug-next-check |
| **Status** | Complete |
| **Completed** | 2026-09-29, at its label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read what this repository holds for the debug `next_check` question: whether any tracked file outside the spec tree could call one, how many debug hypotheses exist to mine, and, on an operator-labeled fixture, how well each of the four constant answers scores and whether that leaves headroom for a model. Past a 30-row label gate, `--jev` and `--deem` each add one measured column with one verdict under the Keep Rule in `spec.md` section 4, writing `report.json` and `calls.jsonl` under `--out`. The phase closes at the label gate: no operator fixture exists, so the runs print `stop: fewer than 30 labeled rows` and no run has printed a verdict line.

### Phase 31: debug-next-check

**The script.** `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` (1,570 lines, Node ESM, standard library only) finds the repository from its own path, so the working directory changes nothing. Its usage is `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs [--fixture <file>] [--jev] [--deem] [--out <dir>]`, run from the repository root. From the final state, with logging stubs for `jev` and `cli-deem` first on `PATH`, the default run exits 0 in about 5 s with:

```text
seam: none
mined: debug_delegation=1 hypothesis_files=0
mined rows: 0
```

The seam search lists tracked files outside `specs/` that name `next_check`, leaving out the generated trigger-phrase fixture folder and every path whose name holds `debug-next-check`. The second exclusion arrived after the doc review, since the census's own script, test and catalog entry carry the search key and the build commit would have listed them as caller seams. With `--fixture <file>` the run adds `fixture: rows=<n> sha256=<sha>`, `labels: <key>=<n>` per key, one `constant <key>: <right>/<n>` line per key and `baseline: <key> <right>/<n>`, then stops on `no headroom` above nine tenths right or on `stop: fewer than 30 labeled rows` below 30. A fixture path inside the repository exits 2 with `refused: fixture path inside the repository`, and a bad row exits 2 naming its row and fault. `--jev` or `--deem` without `--out` exits 2 with `--jev or --deem need --out <dir> so every call is recorded` before any call. Past the gate, Jev runs first and reads only rows marked `jev_ok`, each withheld row leaving three `unmeasured_withheld` records, and a stub Deem backend prints `deem arm skipped: stub backend` after one `cli-deem health`.

**The tests.** `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` (752 lines, 31 cases) runs the script against synthetic fixtures and stub `jev` and `cli-deem` binaries in temp directories. It covers the default run's zero-call guard, the `--out` refusal, the seam search clean, planted and self-excluded, the fixture reader's accept and reject cases, the gate at 29 and 30, the baselines and the tie, `no headroom`, the payload split and skip, both gates passing and skipping, the Deem exit-4 recheck, no row text in `calls.jsonl` and the `keep`, `kill` and `stop (coverage)` outcomes. It prints `Tests 31 passed (31)`.

**The docs (parent D6, through sk-doc).** `SKILL.md` at `version: 4.6.0.0`, `README.md`, `runtime/scripts/README.md`, `changelog/v4.6.0.0.md`, the catalog entry `feature-catalog/tooling-and-scripts/debug-next-check.md` with its index block in `feature-catalog.md` section 2, and the playbook scenario `manual-testing-playbook/tooling-and-scripts/debug-next-check.md` (463) with its index row. The `system-spec-kit` catalog uses section blocks, not the `system-deep-loop` F and DLR ids, so the entry carries no id. Each passed `validate_document.py` (exit 0). No doc names a verdict line, since none was printed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | Created | Seam search, mined counts, fixture reader, constant baselines and headroom, the label and payload gates, both arms, the Keep Rule and the report writer, 1,570 lines. Briefs c1 to c8, fixes c2f, c7f, c9f and c9g |
| `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` | Created | 31 cases over every public surface with synthetic fixtures and stub backends, 752 lines. Briefs c1 to c8, c7f, c9g |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | One quick-reference row naming the offline measurement and that no debug step changes, `version:` bumped to `4.6.0.0`. Brief d1 |
| `.skilled/skills/system-spec-kit/README.md` | Modified | One paragraph naming the script, its zero-call default, the gates and both switches. Brief d2 |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | Modified | One tree line and one inventory row for the new folder. Brief d3 |
| `.skilled/skills/system-spec-kit/changelog/v4.6.0.0.md` | Created | The next changelog entry after 026's `v4.5.0.0.md`. Brief d4, fix f1 |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md` | Created | One catalog entry, version 4.6.0.0. Brief d5a, fix f1 |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modified | The index block in section 2. Brief d5b |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/debug-next-check.md` | Created | Scenario 463 covering the census, the gate stop and the stub-backend skip. Brief d6a, fix f1 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modified | The scenario index row and the counts. Brief d6b |
| `.hermes/skills/system-spec-kit/SKILL.md` | Regenerated | The Hermes copy of the hub `SKILL.md`, in sync |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: design, rulings, briefs, logs, evidence and facts, untracked |

`ca40e3c2dc` feat(system-spec-kit): add an offline debug next-check measurement holds 11 files and 2,558 insertions: the script, its test, the eight docs and the Hermes copy. Not pushed. The trigger index follows in its own commit. No agent, debugging reference or workflow changed, so every debug session runs exactly as today by construction.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. The session wrote every brief in `scratch/w4-build/briefs/` and ran the build through CLI executors. Parent D5, amended on 2026-09-29, allows only Pi writes with no Claude leaves: DeepSeek V4.1 Flash on Cline at `--thinking xhigh`, then OpenCode Go, then LLM Gateway at `--thinking max`, and `llmgateway/mimo-v2.6-pro` at `high`. The design ran on Devin before its daily quota ran out. The code steps c1 to c8 ran on DeepSeek V4.1 Flash through Cline, each checked by the test file; the eight docs d1 to d6b ran on Pi MiMo at `high` after the shared 026 doc files landed, each written from a facts file the session built from its own runs.

The build deviated from the design in three places. Ruling 1 excluded the generated trigger-phrase fixture folder `runtime/cli/retrieval/fixtures/` from the seam search, because it mirrors spec trigger phrases and would make the search find this phase's own spec; the doc review then found that the census's own files would appear as caller seams once tracked, and fix c9f added the second exclusion, `debug-next-check` in the path. Ruling 2 read the versions at doc time: 026 had taken 4.5.0.0 and scenario 462, so this phase wrote `changelog/v4.6.0.0.md`, `version: 4.6.0.0` and playbook scenario 463, and the design's `v4.5.0.0.md` and scenario 462 are stale. Two test fixes followed real failures: c2f narrowed the mined search from two greps over every tracked file under `specs/` (25.9 s, past vitest's 30 s limit) to one `git grep -cE '^### Hypothesis [0-9]' -- 'specs/*.md'` pass (5.6 s) under ruling 6, and c7f corrected the `verdict kill` test's schedule after the session showed the script right and the schedule wrong.

The session then reran the proof plan from the final state, with logging stubs for `jev` and `cli-deem` first on `PATH`. The default run exits 0 in 5 s with `seam: none`, `mined: debug_delegation=1 hypothesis_files=0` and `mined rows: 0`, and the stub logs were never written; `--deem --out <dir>` and `--jev --out <dir>` print the same three lines and write only `report.json`; `--deem` without `--out` exits 2 with the `--out` line before any call and with no stdout; a 29-row synthetic fixture with both switches exits 0 ending `stop: fewer than 30 labeled rows` with both stub logs empty; `git status --porcelain` was equal before and after; the key grep exits 1 and the Python comment hygiene checker exits 0 on the script and its test. The seam fix changed only the seam pathspec, so the earlier `--fixture` proofs stand.

Both cross-family reviews are read only, split by author family, with the SHA-1 over each review's files equal before and after. Pi MiMo reviewed the code (`review-code-pi.md`) and printed `VERDICT: PASS` with 7 P2. DeepSeek on Cline reviewed the docs (527 s, `review-docs-ds.md`) and printed `VERDICT: PASS` with 1 P2: the changelog's seam bullet left out the fixture-folder exclusion, and the playbook said the census's own files would appear as seam hits once tracked. The session ruled the second half a P1, because the build commit would have made every default run list this phase's own files as caller seams and every doc stating `seam: none` false. Fix c9f excludes every path whose name holds `debug-next-check`; fix c9g adds the `seam skips its own files` case; fix f1 names both exclusions in the changelog, the catalog entry and the playbook scenario. Pi MiMo rechecked c9f and c9g (`VERDICT: PASS`) and DeepSeek rechecked f1 (68 s, `VERDICT: PASS`). The seven remaining P2 findings are recorded, not chased (parent D5).

The session committed the build as `ca40e3c2dc`, 11 files, not pushed. The staged set passed the key grep (exit 1). After the commit `compiled-route-guard.cjs` lists only `sk-doc` and `system-deep-loop`, whose routing inputs other phases were editing at the time. The trigger index follows in its own commit. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exclude the generated trigger-phrase fixture folder from the seam search (ruling 1) | It mirrors spec trigger phrases, so counting it would make the search find this phase's own spec and never print `seam: none` |
| Exclude the census's own files from the seam search (fix c9f) | The script, test and catalog entry carry the search key; tracking them would list them as caller seams and make every doc stating `seam: none` false |
| Read the changelog version and scenario id at doc time (ruling 2) | Earlier sibling phases had already taken 4.5.0.0 and scenario 462, so a fixed number would collide |
| Gate Jev behind `jev_ok` and run Deem on every row | The rows are the operator's own debug notes: Jev sends only accepted rows, Deem keeps them on the machine |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its gate stop from the final state is Complete, and only the operator writes labels |
| Fix every P1 and record P2 | Parent D5 as amended on 2026-09-29. The P1 finding is closed and rechecked; the seven P2 findings are recorded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The orchestrator session reran the proof plan from the final state before the commit. The build left no `build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the session-run facts in `scratch/w4-session/docs/facts.txt`.

| Check | Result |
|-------|--------|
| Default run on the real tree, stubs first on `PATH` | Exit 0 in about 5 s with `seam: none`, `mined: debug_delegation=1 hypothesis_files=0` and `mined rows: 0`; no file written and neither stub log created (`SE` section 2) |
| `--deem --out <dir>` and `--jev --out <dir>` | Exit 0 with the same three lines and only `report.json` written; `--deem` without `--out` exits 2 with `--jev or --deem need --out <dir> so every call is recorded`, before any call and with no stdout (`SE` section 2) |
| The label gate and the refusals | A 29-row synthetic fixture with `--jev --deem --out <dir>` exits 0 ending `stop: fewer than 30 labeled rows` with both stub logs empty; a fixture inside the repository exits 2 with `refused: fixture path inside the repository`; a bad row exits 2 naming its row and fault (`SE` section 2; `facts.txt`) |
| The payload gate and the Deem skip | A 30-row fixture with every `jev_ok` false prints `jev arm skipped: payload not accepted` with no stub call; a stub `cli-deem health` reporting `stub` prints `deem arm skipped: stub backend` after one call (`SE` section 2) |
| `npx vitest run tests/debug-next-check.vitest.ts` | `Tests 31 passed (31)`, exit 0, against goal criterion 3's floor of 22 (`SE` section 2) |
| The `system-spec-kit` root suite, `npx vitest run --project root` | `Test Files 110 passed | 3 skipped (113)` and `Tests 1359 passed | 13 skipped (1372)` in 442 s, against 026's 109 files and 1,328 tests (`SE` section 2) |
| Key grep, `git status` and comment hygiene | The key grep exits 1; `git status --porcelain` was equal before and after every run; the Python comment hygiene checker exits 0 on the script and its test (`SE` section 2) |
| `validate_document.py` on the eight changed docs | Exit 0 on each (`SE` section 2) |
| Generators and packages | `sync-skills-hermes.cjs` regenerated the Hermes copy; catalog package `violations=85`, 026's baseline; playbook package `PASS ... scenarios=89 ... violations=0 warnings=1`, one scenario more than 026's 88; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`; `system-spec-kit` is not a compiled hub, so no re-mint ran (`SE` section 4) |
| Cross-family review | Pi MiMo on the code `VERDICT: PASS` (7 P2); DeepSeek on Cline on the docs `VERDICT: PASS` (1 finding ruled a P1, closed by c9f, c9g and f1, each rechecked `VERDICT: PASS`); 7 P2 findings recorded. The SHA-1 over each review's files was equal before and after (`SE` section 3) |
| Build commit | `ca40e3c2dc` feat(system-spec-kit), 11 files, not pushed, confirmed by `git show --stat` at this closure pass (`SE` section 5) |
| Trigger index | Follows in its own commit after the build commit (`SE` section 5) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0; `graph-metadata.json` re-derived |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, 0 lines matching `RESULT: FAILED`, `Errors: 0  Warnings: 0` |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars` at or under 4000; `packet_budget=unknown` by design for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and every verdict waits.** No operator fixture exists, so the runs print `stop: fewer than 30 labeled rows` and call nothing. A live Deem run and a Jev run on the operator's yes are the operator's. T016 stays `[B]`, and parent D4 puts that outside this phase's completion.
2. **No verdict line exists.** Every real run stopped at the label gate, so the Keep Rule's verdict path is pinned only on fixtures and no real column has been measured.
3. **No caller seam and no reader.** The census prints `seam: none`, so a keep alone would not reach R18's promote line. The caller and the reader stay open questions.
4. **Serving is not in this phase.** A keep wires nothing and changes no debug step, agent or methodology reference.
5. **Seven review P2 findings are recorded, not fixed** (parent D5): `unmeasured_withheld` Jev records carry no identity fields; the "a skipped arm still writes no file" comment is false; `HEALTH_TIMEOUT_MS` is 10,000 against REQ-006's 2,000 ms; `Number(1n << BigInt(n))` overflows past 1,023 disagreements; the verdict line and report column spell `0.6.2` instead of reading `JEV_VERSION`; two tests pin a live-repository count; and no test reaches `jev arm skipped: jev not on PATH`, `unmeasured_timeout` or the Jev exit-4 retry.
6. **No `build-evidence.md`.** The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record.
7. **Premise corrections at close.** `spec.md`'s Status and description now say Complete, its handoff row records the gate stop, and its seam sentence, LOC, test count and changelog rows name what was built. `plan.md`'s roster states parent D5 as amended on 2026-09-29, and `tasks.md`'s notation carries the closure record.
<!-- /ANCHOR:limitations -->

---

---
title: "Acceptance Criteria: Phase 6: dual-root-code-and-contracts"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/006-dual-root-code-and-contracts"
    last_updated_at: "2026-09-17T13:15:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Marked all 15 criteria Met with evidence observed at dadf2d19dd"
    next_safe_action: "Publish the phase and validate it on its published tip"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-006-acceptance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: dual-root-code-and-contracts

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/006-dual-root-code-and-contracts
**Level:** 2
**Status:** Complete
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The layouts (`today`, `skilled-only`, `whole-link` and the conditional `entry-links`) and component ids C1 to C15 are defined in `plan.md`. Commands under `runtime/cli` run from `.opencode/skills/system-spec-kit/runtime/cli`, advisor commands from `.opencode/skills/system-skill-advisor/runtime` and deep-loop commands from `.opencode/skills/system-deep-loop/runtime`. A pass is read from the printed result, never from the exit code alone.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given fixture trees for `today`, `skilled-only` and `whole-link`, When `findRepoRoot` runs from a start under the real source root with the default cap and with `maxDepth: 2`, Then it returns the tree root, and no hoist row (nested leak, look-alike segment, dangling link) returns a path with a `.opencode` or `.skilled` segment | Parity passes with the layout rows, and `spec-gate-core.test.mjs` reports 0 failures. Observed at `dadf2d19dd`: `package-root-parity.vitest.ts` 28 of 28, and the spec gate core 87 pass, 0 fail, 3 skipped, as at baseline. 12 parity rows fail on the start commit's resolver | Met | - |
| AC-002 | REQ-002 | Given the same three layouts, When `findAdvisorWorkspaceRoot` runs with its default sentinel and with the explicit `.opencode/skills/system-spec-kit/SKILL.md` sentinel, and `detectRepoRoot` runs on the same trees, Then every call returns the tree root | After `npm run build` in the advisor runtime, both files pass, including the lockstep row. Observed: the build exits 0, and 39 of 39 pass, 23 walk rows and 16 schema rows. 7 of them fail on the start commit's walks | Met | - |
| AC-003 | REQ-003 | Given a stub server manifest under each layout's real source root, When the launcher loads through `.opencode/bin` (`today`, `whole-link`) and through `.skilled/bin` (`skilled-only`, `whole-link`), Then `SERVER_MANIFEST_PATH` and `SERVER_ENTRYPOINT_PATH` sit under that real source root | `node --test .opencode/bin/mcp-code-mode-launcher.test.cjs` passes the layout case. Observed: 8 rows, 5 pass and 3 skip where the vendored server is absent, as the plan expects. The layout case fails on the start commit's launcher | Met | - |
| AC-004 | REQ-004 | Given a temp target holding an owned hook under one spelling plus a third-party hook, When the installer installs a source naming the other spelling in each layout, Then the target holds exactly one entry for the owned hook and keeps the third-party hook, and `--check` exits 0 afterwards | The installer test passes, and `stat -f %m ~/.codex/hooks.json` prints the same value before and after. Observed: 18 of 18 pass, 8 of them fail on the start commit's installer, and the modification time reads 1788592466 before and after every run | Met | - |
| AC-005 | REQ-005 | Given a main checkout per layout with `skills/system-spec-kit/node_modules` under its real source root, When `worktree-session.sh` runs dry and live, Then the plan links that path and puts `SPEC_KIT_DB_DIR` under the real source root. The `skilled-only` worktree has no `.opencode` path, and a main checkout holding an uncommitted rename logs the mismatch warning | `bash .opencode/bin/tests/worktree-session.test.sh` prints `PASS=<n> FAIL=0`. Observed: `PASS=41 FAIL=0`, against 25 at baseline. 7 layout rows fail on the start commit's launcher | Met | - |
| AC-006 | REQ-006 | Given a copied guard beside a seeded spec import in each layout, When it runs with no arguments, Then it exits 1 naming the import. A scan that reads zero files exits 2, and `targetResolvesUnderSpecs` flags `specs/`, `.opencode/specs` and `.skilled/specs` targets | The bin suite passes, and the three workflow calls give their expected exits by hand. Observed: 37 of 37 pass, against 25 at baseline, and 7 new rows fail on the start commit's guard. The calls exit 0, 1 and 0, and the workflow step fails a checkout whose positive fixture is missing, which its earlier version passed | Met | - |
| AC-007 | REQ-007 | Given an unchanged tree, When the drift checker runs in `today`, `skilled-only` and `whole-link`, and When the command documents name `.skilled/` instead of `.opencode/`, Then it prints `[CONTRACT DRIFT] OK` in each layout and derives the same source set for both spellings | The drift suite passes, including the regression rows, and the rehearsal records OK in both clones. Observed: `check-contract-drift.vitest.ts` 10 of 10 and `compile-command-contracts.vitest.ts` 13 of 13, with 3 rows failing on the start commit's checker and compiler. `scratch/rehearsal-results.md` records `[CONTRACT DRIFT] OK commands=3` for `skilled-only` and `whole-link` | Met | - |
| AC-008 | REQ-008 | Given a `.opencode` anchor, a `.skilled` anchor, a `.opencode -> .skilled` link and a root holding both a real `.opencode/` and the `.skilled/` placeholder, When workspace identity resolves the root and nested starts, Then each gives the tree root, and two unrelated repositories never match | After `npm run build` in `runtime/cli`, the workspace identity suite passes. Observed: the build exits 0, and 11 of 11 pass. 4 rows fail on the start commit's module | Met | - |
| AC-009 | REQ-009 | Given R1, R3 and R7 fixtures built in each layout, When the spec-root resolver, write guard, manifest, migration, config and folder detector run, Then `today` and `whole-link` match the current classes and `skilled-only` classifies canonical-only. No layout lists `.skilled/specs` as a root | The spec-root set passes, and the folder detector prints no failure. Observed: `tests/spec-root-*.vitest.ts` 13 files and 74 tests, against 56 at baseline, including the matrix at 20, configuration 5, manifest 8 and migration 8. `RESULTS: 28 passed, 0 failed, 0 skipped`, against 14. No layout lists `.skilled/specs` as a root, and a mutation that lists it fails the three auto-detect rows | Met | - |
| AC-010 | REQ-010 | Given a consumer fixture whose `.skilled` and `.opencode` link to an external tree, When `sanitizePath` and the data loader check paths inside each linked tree and outside paths, Then both linked paths are accepted, and `/etc/passwd`, a null byte and a `..` escape are rejected | `npm run test:legacy` prints `Failed: 0` for both runners. Observed: 266 passed, 0 failed, 5 skipped, and 268 passed, 0 failed, 6 skipped. T-003i and LOAD-003 fail on the start commit's allowlists | Met | - |
| AC-011 | REQ-011 | Given the three sibling targets beside a fixture checkout in each layout, When `relink-local-specs.sh` runs from its own `bin` directory, Then each link lands under `<root>/specs/` and `git diff` shows no change to the script | The relink test passes, and the script is unchanged. Observed: `PASS=21 FAIL=0`, and `git diff --quiet cfeba3e1fb dadf2d19dd -- .opencode/bin/relink-local-specs.sh` exits 0 | Met | - |
| AC-012 | REQ-012 | Given rehearsal clones in `today`, `skilled-only` and `whole-link` with a stub server, When each of the six registrations runs its own command, arguments and environment from the clone root, Then all six answer an initialize request in `today` and `whole-link`, and the `skilled-only` outcome is recorded against phase 004's shape | `scratch/rehearsal-results.md` holds a row per registration per layout, and `goal.md` names phase 004's shape. Observed: 18 registration rows. All six answer in `today` and `whole-link`, and `skilled-only` records `Cannot find module`, judged against L1 in the log row "Phase 004 shape" | Met | - |
| AC-013 | REQ-013 | Given the last TypeScript unit is committed, When `dist/` is rebuilt and the rehearsal runs, Then the staleness check passes and the rehearsal records the rebuilt tree's commit | Both builds and the three freshness reads pass, and the rehearsal names the rebuilt commit. Observed at `dadf2d19dd`: both builds exit 0, all three packages read `"stale":false`, and `scratch/rehearsal-results.md` names `dadf2d19dd5b8728e4ba1b980d5cce3a275e26ea`, the last code commit. Later commits change phase documents only | Met | - |
| AC-014 | REQ-014 | Given the five root-discovery twins listed out of scope in `spec.md` §3 and the three items phase 004's plan assigns here, When implementation is about to start, Then `goal.md`'s log names an owning phase for each of the eight. A twin assigned here meets the AC-001 layout rows in its own test, and an item assigned here appears in an amended `spec.md` §3 | `goal.md` records all eight items before the first commit of T006, and `spec.md` §3 matches. Observed: two log rows dated 2026-09-16 name all eight before `1553cbbea5` on 2026-09-17, and `spec.md` §3 lists them plus the sixth twin that joined on 2026-09-17. Each twin has rows that fail on the start commit: Gate 3 one, advisor CLI two, ledger one, graph one, router two and skill validator one. The git hook harness fails its ownership row on the start commit's installer, and ignored entries stay at 31 in all three rehearsal clones | Met | - |
| AC-015 | REQ-015 | Given phase 004 has selected its layout, When it selects per-entry links, Then the unit rows and the rehearsal pass in `entry-links` as well, and When it selects the single link, Then no `entry-links` run is required | The log records the selected layout and that `entry-links` was not required. Observed: the `goal.md` log row "Phase 004 shape" records L1 and that `entry-links` is not required | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All 15 criteria are Met, with evidence observed at `dadf2d19dd`, the last code commit. `entry-links` was not required because phase 004 chose L1, and no criterion is waived or superseded.
<!-- /ANCHOR:closure -->

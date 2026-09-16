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
    last_updated_at: "2026-09-16T21:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored one acceptance criterion per requirement, all Unmet"
    next_safe_action: "Meet the criteria in task order once phase 005 validates"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-006-acceptance"
      parent_session_id: null
    completion_pct: 0
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
**Status:** Draft
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The layouts (`today`, `skilled-only`, `whole-link` and the conditional `entry-links`) and component ids C1 to C15 are defined in `plan.md`. Commands under `runtime/cli` run from `.opencode/skills/system-spec-kit/runtime/cli`, advisor commands from `.opencode/skills/system-skill-advisor/runtime` and deep-loop commands from `.opencode/skills/system-deep-loop/runtime`. A pass is read from the printed result, never from the exit code alone.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given fixture trees for `today`, `skilled-only` and `whole-link`, When `findRepoRoot` runs from a start under the real source root with the default cap and with `maxDepth: 2`, Then it returns the tree root, and no hoist row (nested leak, look-alike segment, dangling link) returns a path with a `.opencode` or `.skilled` segment | `npx vitest run --config ../../vitest.config.ts --project cli tests/package-root-parity.vitest.ts` passes with the layout rows, and `node --test .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` reports 0 failures | Unmet | - |
| AC-002 | REQ-002 | Given the same three layouts, When `findAdvisorWorkspaceRoot` runs with its default sentinel and with the explicit `.opencode/skills/system-spec-kit/SKILL.md` sentinel, and `detectRepoRoot` runs on the same trees, Then every call returns the tree root | After `npm run build` in the advisor runtime, `npx vitest run tests/utils/workspace-root.vitest.ts tests/schemas/advisor-tool-schemas.vitest.ts` passes, including the lockstep row | Unmet | - |
| AC-003 | REQ-003 | Given a stub server manifest under each layout's real source root, When the launcher loads through `.opencode/bin` (`today`, `whole-link`) and through `.skilled/bin` (`skilled-only`, `whole-link`), Then `SERVER_MANIFEST_PATH` and `SERVER_ENTRYPOINT_PATH` sit under that real source root | `node --test .opencode/bin/mcp-code-mode-launcher.test.cjs` passes the layout case | Unmet | - |
| AC-004 | REQ-004 | Given a temp target holding an owned hook under one spelling plus a third-party hook, When the installer installs a source naming the other spelling in each layout, Then the target holds exactly one entry for the owned hook and keeps the third-party hook, and `--check` exits 0 afterwards | `node --test .opencode/bin/tests/install-codex-hooks-source-root.test.cjs` passes, and `stat -f %m ~/.codex/hooks.json` prints the same value before and after the run | Unmet | - |
| AC-005 | REQ-005 | Given a main checkout per layout with `skills/system-spec-kit/node_modules` under its real source root, When `worktree-session.sh` runs dry and live, Then the plan links that path and puts `SPEC_KIT_DB_DIR` under the real source root. The `skilled-only` worktree has no `.opencode` path, and a main checkout holding an uncommitted rename logs the mismatch warning | `bash .opencode/bin/tests/worktree-session.test.sh` prints `worktree-session tests: PASS=<n> FAIL=0` | Unmet | - |
| AC-006 | REQ-006 | Given a copied guard beside a seeded spec import in each layout, When it runs with no arguments, Then it exits 1 naming the import. A scan that reads zero files exits 2, and `targetResolvesUnderSpecs` flags `specs/`, `.opencode/specs` and `.skilled/specs` targets | `npx vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts` from `.opencode` passes, and the three calls in `.github/workflows/runtime-no-spec-import.yml:35-42` give their expected exits when run by hand | Unmet | - |
| AC-007 | REQ-007 | Given an unchanged tree, When the drift checker runs in `today`, `skilled-only` and `whole-link`, and When the command documents name `.skilled/` instead of `.opencode/`, Then it prints `[CONTRACT DRIFT] OK` in each layout and derives the same source set for both spellings | `npx vitest run --no-coverage tests/unit/check-contract-drift.vitest.ts` passes, including the regression row that fails on `728c4f3efc`, and `scratch/rehearsal-results.md` records `[CONTRACT DRIFT] OK` for the `skilled-only` and `whole-link` clones | Unmet | - |
| AC-008 | REQ-008 | Given a `.opencode` anchor, a `.skilled` anchor, a `.opencode -> .skilled` link and a root holding both a real `.opencode/` and the `.skilled/` placeholder, When workspace identity resolves the root and nested starts, Then each gives the tree root, and two unrelated repositories never match | After `npm run build` in `runtime/cli`, `npx vitest run --config ../../vitest.config.ts --project cli tests/workspace-identity.vitest.ts` passes | Unmet | - |
| AC-009 | REQ-009 | Given R1, R3 and R7 fixtures built in each layout, When the spec-root resolver, write guard, manifest, migration, config and folder detector run, Then `today` and `whole-link` match the current classes and `skilled-only` classifies canonical-only. No layout lists `.skilled/specs` as a root | `npx vitest run --config ../../vitest.config.ts --project cli tests/spec-root-validation-matrix.vitest.ts tests/spec-root-config-precedence.vitest.ts` and the full `tests/spec-root-*.vitest.ts` set pass, and `node tests/test-folder-detector-functional.js` prints `RESULTS: <n> passed, 0 failed` | Unmet | - |
| AC-010 | REQ-010 | Given a consumer fixture whose `.skilled` and `.opencode` link to an external tree, When `sanitizePath` and the data loader check paths inside each linked tree and outside paths, Then both linked paths are accepted, and `/etc/passwd`, a null byte and a `..` escape are rejected | `npm run test:legacy` in `runtime/cli` prints `Failed:  0` for both `test-scripts-modules.js` and `test-extractors-loaders.js` | Unmet | - |
| AC-011 | REQ-011 | Given the three sibling targets beside a fixture checkout in each layout, When `relink-local-specs.sh` runs from its own `bin` directory, Then each link lands under `<root>/specs/` and `git diff` shows no change to the script | `bash .opencode/bin/tests/relink-local-specs.test.sh` passes, and `git diff --quiet -- .opencode/bin/relink-local-specs.sh` exits 0 | Unmet | - |
| AC-012 | REQ-012 | Given rehearsal clones in `today`, `skilled-only` and `whole-link` with a stub server, When each of the six registrations runs its own command, arguments and environment from the clone root, Then all six answer an initialize request in `today` and `whole-link`, and the `skilled-only` outcome is recorded against phase 004's shape | `scratch/rehearsal-results.md` holds one row per registration per layout, and `goal.md`'s log names the phase 004 shape it was judged against | Unmet | - |
| AC-013 | REQ-013 | Given the last TypeScript unit is committed, When `dist/` is rebuilt and the rehearsal runs, Then the staleness check passes and the rehearsal records the rebuilt tree's commit | `npm run build` in `.opencode/skills/system-spec-kit` and the advisor runtime, then `node .opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check --package <id> --json` reads `"stale":false` for `system-spec-kit/shared`, `system-spec-kit/runtime/cli` and `system-skill-advisor/runtime`, and `scratch/rehearsal-results.md` names the same commit as `git rev-parse HEAD` | Unmet | - |
| AC-014 | REQ-014 | Given the five root-discovery twins listed out of scope in `spec.md` §3 and the three items phase 004's plan assigns here, When implementation is about to start, Then `goal.md`'s log names an owning phase for each of the eight. A twin assigned here meets the AC-001 layout rows in its own test, and an item assigned here appears in an amended `spec.md` §3 | `goal.md` log rows for all eight items, dated before the first commit of T006, and `spec.md` §3 matching them | Unmet | - |
| AC-015 | REQ-015 | Given phase 004 has selected its layout, When it selects per-entry links, Then the unit rows and the rehearsal pass in `entry-links` as well, and When it selects the single link, Then no `entry-links` run is required | `scratch/rehearsal-results.md` holds `entry-links` rows for every component, or `goal.md`'s log records the selected layout and that the row was not required | Unmet | - |

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

**Closeable:** No

The phase is planned and nothing is implemented, so all 15 criteria are Unmet. Closure waits on phase 005 validating and on every unit in `tasks.md` passing its tests.
<!-- /ANCHOR:closure -->

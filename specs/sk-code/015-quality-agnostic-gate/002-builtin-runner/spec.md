---
title: "Feature Specification: Phase 2: builtin-runner"
description: "One Node runner gives each change a single verdict with exit codes, layer states, resolved checklists and an envelope, and runs no repository command."
trigger_phrases:
  - "builtin runner"
  - "phase 2 builtin runner"
  - "quality gate runner"
  - "code-quality-run verdict"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 2: builtin-runner

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-honest-checker |
| **Successor** | 003-config-and-doctor |
| **Handoff Criteria** | The seven criteria in `goal.md` section 3 pass on the branch head, with 001-honest-checker landed. Phase 3 can add the repository config layer without changing the verdict schema |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Make sk-code-quality a codebase-agnostic, executable author gate specification.

**Scope Boundary**: This phase builds the runner and its verdict. It adds the Node entry point, scope and changed lines, the built-in sensors, one hygiene call, the syntax floor, the enforcement layer probes, checklist resolution, three renderers and the hub surface declarations. It does not read a repository config, run a repository command, change the Iron Law text, or change the verify, review or `@code` consumers.

**Dependencies**:
- `001-honest-checker` (Phase 1) must land first. This phase calls the checker with `--json`, reads the comment families that Phase 1 moves into `comment-syntax.json`, and depends on the narrowed patterns and the URL span stripping. Fixtures F01 and F02 cannot pass without them, and the hygiene part of F03 to F05 cannot either. Phase 1 also moves the checker's usage error from exit 2 to exit 3, because exit 2 already means that every file was skipped (`check-comment-hygiene.sh:13`). The runner's exit precedence depends on that move (ADR-004).
- The `declaredSurfaces` reader in `router-replay-lib.cjs` and the registry compiler already exist. This phase extends both.
- Phases 3 to 6 depend on this phase. Nothing in this phase depends on them.

**Deliverables**:
- `quality-gate.cjs`, `lib/run-check.cjs`, `assets/quality-defaults.json` and `references/runner-contract.md` under `sk-code-quality`.
- `quality.checklists` declarations for SKILLED and `sk-code-ci` in `mode-registry.json`, validated by the registry compiler.
- The per-kind marker lists in `surfaceEntry` and the runner row in `stack-detection.md`.
- Fixtures F01 to F05, F10, F12 to F14 and F16 to F18, and the two proofs in SC-003 and SC-004.
- A packet changelog at `.skilled/skills/sk-code/sk-code-quality/changelog/v1.6.0.0.md` and a hub changelog at `.skilled/skills/sk-code/changelog/v3.2.0.0.md`, with the version bumps they name.

**Changelog**:
- When this phase closes, write both changelog files named in Deliverables. Each one names the phase folder, so the change reads on its own.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The checker scans nine extensions and prints findings as text beside its exit code. It cannot say which layer enforces a rule, whether `python3` was present to run it, or whether a finding sits on a line the change touched. In a repository with no `.skilled/` tree the surface resolves to UNKNOWN, so the quality mode escalates and gives no verdict. The result is that a foreign change gets no answer a reader can act on.

### Purpose
One command prints one verdict for a change in any repository. The verdict holds a gate, an exit code, the state of each enforcement layer, the checklists that apply and an envelope the mode can complete. Success means the runner gives an honest result on a foreign Go change and on this repository's own checker.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the Node entry point `quality-gate.cjs` with scope selection (`--worktree`, `--base`, `--files`), changed-line detection and the unchecked-file report.
- Run the built-in sensors: conflict markers, secret signatures, debug leftovers, and a syntax floor chosen by shebang before extension.
- Call the hygiene checker once per run with `--json` and map its findings to the gate.
- Probe the pre-commit, CI and post-edit layers and report one state for each.
- Resolve checklists from the universal floor, the quality defaults and the hub declarations.
- Render `json`, `text` and `envelope` output, and write nothing to disk.
- Declare the SKILLED and `sk-code-ci` checklists in `mode-registry.json`, and validate them in the registry compiler.
- Extend `surfaceEntry`, add the runner row to `stack-detection.md`, and update the `Q/SKILL.md` workflow, tree, loading table and envelope section.

### Out of Scope
- Repository config `.sk-code/quality.json`, configured checks and suggested checks. Phase 3, see ADR-010 and ADR-013.
- The `/doctor:sk-code quality` route and the battery leg. Phase 3.
- The Iron Law 3 text, the UNKNOWN rows and the universal checklist retitle. Phase 4, see ADR-011 and ADR-012.
- The verify, review and `@code` consumers, the outside-skill `quality` metadata, the advisor vocabulary and the leaf manifest. Phase 5.
- The Phase 6 playbook scenarios and the benchmark report, see ADR-015.
- Any change to the whole-file scope of CI or pre-commit, see ADR-014.

### Files to Change

| File Path | Change Type | Requirement | Description |
|-----------|-------------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Create | REQ-001 to REQ-016 | CLI, scope, sensors, checklist resolution, verdict and renderers |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs` | Create | REQ-004 | Argv spawn, timeout, tool probe and the content-hash guard |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Create | REQ-015 | `node:test` cases named by fixture ID and by unit |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/fixtures.cjs` | Create | REQ-015 | Builds temporary git repositories from quoted strings and takes the snapshot |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-defaults.json` | Create | REQ-009 | Sensor defaults and quality-owned checklist rows, with no command |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Create | REQ-013 | CLI, exit codes, states, verdict, envelope grammar and rule ids |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/README.md` | Edit | REQ-019 | Replace the pointer-only statement with the new module |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md` | Edit | REQ-019 | The VALIDATION list gains the `node --test` suite beside the four bash suites |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Edit | REQ-019, REQ-022 | Workflow with the restraint step, tree, loading table, target map, enforcement table, P0 table rows that become UNVERIFIED, envelope, rules, `DEFAULT_RESOURCE` and version |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` | Edit | REQ-019 | The CQ-001 path loop follows the new ALWAYS rows, as `DEFAULT_RESOURCE` does |
| `.github/workflows/sk-code-script-tests.yml` | Edit | REQ-024 | The `node --test` row for the quality tests |
| `.skilled/skills/sk-code/mode-registry.json` | Edit | REQ-011, REQ-022 | `quality.checklists` for SKILLED and `sk-code-ci`, and the hub version |
| `.skilled/skills/sk-code/hub-router.json` | Edit | REQ-022 | Hub version |
| `.skilled/skills/sk-code/description.json` | Edit | REQ-022 | Hub version |
| `.skilled/skills/sk-code/SKILL.md` | Edit | REQ-022 | Hub version |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs` | Edit | REQ-011 | `QUALITY_DECLARATION_INVALID` beside `SURFACE_DETECTION_INVALID` |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Edit | REQ-012 | Per-kind lists beside the merged list in `surfaceEntry`, with export names unchanged |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Edit | REQ-018 | Runner row in the reader table at lines 121 to 125 |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.6.0.0.md` | Create | REQ-022 | Packet changelog |
| `.skilled/skills/sk-code/changelog/v3.2.0.0.md` | Create | REQ-022 | Hub changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `quality-gate.cjs` prints one verdict in `json`, `text` or `envelope` form and writes no file |
| REQ-002 | Scope comes from `--worktree` (the default), `--base <ref>` or `--files`. Changed lines come from `git diff -U0`. Every line of an untracked file, and every line of a file outside git, counts as changed |
| REQ-003 | The exit code follows the precedence 3, 1, 4, 2, 0. No output carries a pass value |
| REQ-004 | Each spawned command is an argv array under its own timeout, and the content-hash guard runs around it |
| REQ-005 | Hygiene runs once per run through the checker's `--json` over all in-scope files. A changed-line finding blocks. A touched-file finding blocks only when a whole-file layer is present |
| REQ-006 | Conflict markers and secret signatures block. A secret finding prints its rule and line, never the matched text. Debug leftovers are a heuristic P1 |
| REQ-007 | The syntax floor follows the shebang before the extension. It covers JSON, CommonJS compiled in-process, `.mjs` through `node --check`, Python through one `python3 -B -I` `ast.parse` run, shell through `bash -n`, YAML and TOML only when a parser imports, and plain `.js` as a heuristic |
| REQ-008 | The pre-commit, CI and post-edit layers each report one state: `present`, `absent`, `untrusted`, `broken` or `unknown` |
| REQ-009 | Checklists resolve from the universal floor, the quality defaults and the hub declarations. A hub file is written with the `hub:` prefix |
| REQ-010 | Surfaces resolve through `declaredSurfaces` and the real-path guard. A specific surface matches on any marker kind. UNKNOWN is returned when nothing matches |
| REQ-011 | `mode-registry.json` declares `quality.checklists` for SKILLED and `sk-code-ci`. The registry compiler rejects a malformed declaration with `QUALITY_DECLARATION_INVALID` |
| REQ-012 | `surfaceEntry` keeps the merged marker list and adds `pathMarkers`, `fileMarkers` and `contentMarkers` lists. The exported names stay the same |
| REQ-013 | The envelope keeps the `code-quality/v1` keys. Judgment fields read `PENDING_AGENT_JUDGMENT`. `checker_outputs` follows the grammar in `runner-contract.md` |
| REQ-014 | A private surface appears in the envelope by its label only. The envelope never contains `local-` |
| REQ-015 | Fixtures F01 to F05, F10, F12 to F14 and F16 to F18 pass. Each one asserts that the fixture snapshot is unchanged after the run |
| REQ-016 | When `python3` is absent, hygiene reports `SKIPPED_ABSENT`, the run reports UNVERIFIED with exit 4, and hygiene is never reported clean |
| REQ-017 | New code files pass the repository's comment hygiene check, and each new comment states a durable reason only |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-018 | `runner-contract.md` and the `stack-detection.md` reader table name the runner as the fourth reader |
| REQ-019 | `Q/SKILL.md` names the runner in its workflow, tree, loading table, envelope section and rules, and its target map equals the declarations in a test. The workflow applies the Design Restraint Ladder before a gate fix adds code. The P0 table moves unchecked generated drift and missing required checklist evidence to UNVERIFIED. `DEFAULT_RESOURCE` and the CQ-001 loop follow the new ALWAYS rows, and the scripts README lists the `node --test` suite |
| REQ-020 | `--lines` with `changed` or `file`, `--only`, `--skip`, `--no-run`, `--timeout` and `--explain <path>` behave as the CLI section of `runner-contract.md` states |
| REQ-021 | `--config` is rejected in this phase with a usage error and exit 3 (ADR-010) |
| REQ-022 | The packet version and the hub version move to the next minor, and each has a changelog file |
| REQ-023 | The dist adapter runs per file for declared generated paths only, with `SPECKIT_DIST_AUTO_REBUILD=0`. It reads the banner text, because the per-file mode exits 0 on every path |
| REQ-024 | The `node --test` row joins `.github/workflows/sk-code-script-tests.yml` in this phase, because the glob matches no file before the tests exist |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test` over the quality test folder exits 0 and prints `# fail 0`.
- **SC-002**: The twelve named fixtures F01 to F05, F10, F12 to F14 and F16 to F18 each pass, and the run prints `# pass 12`.
- **SC-003**: The self-run on `check-comment-hygiene.sh` names SKILLED in `resolved_surface` and has no `syntax.` finding. The check prints `true`.
- **SC-004**: The foreign smoke test on an untracked Go file with a spec-style comment prints `exit=1`, and its verdict reads `BLOCKED` with `unknown` as the surface.
- **SC-005**: `compiled-route-sync.cjs --check` and `parent-skill-check.cjs` on `sk-code` both exit 0.
- **SC-006**: The envelope for a run contains no `local-` text and no pass value.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001-honest-checker (`--json`, `comment-syntax.json`, narrowed patterns, URL span stripping) | Without it F01 and F02 cannot pass, and the hygiene part of F03 to F05 cannot pass | Start only after 001 lands. Record the JSON fields the runner reads in `runner-contract.md`, and require Phase 1 to emit them |
| Dependency | `declaredSurfaces` and the registry compiler | A change to the shared reader can alter the advisor's results | Keep export names and the existing marker merge unchanged. Run `compiled-route-sync --check` after each edit to the registry |
| Dependency | Python 3 and `ast` | Without `python3` the hygiene and Python parse checks cannot run | REQ-016 reports UNVERIFIED with exit 4. F17 covers it |
| Risk | The dist per-file mode exits 0 on every path, so the adapter reads the banner text | A banner change in the checker breaks the adapter silently | Unit test the banner prefixes `STALE DIST WARNING:` and `DIST FRESHNESS CHECK ERROR:`. Treat an unknown stdout line as ERROR |
| Risk | A later phase needs the verdict schema to change | Phases 3 to 5 would need rework | Keep `code-quality-run/v1` fixed in this phase. Any key change is a new schema version |
| Risk | The `node --test` CI row lands before the tests exist | The CI job fails on an unmatched glob | Move the row into this phase (REQ-024). Phase 1 keeps its four shell suites only |
| Risk | The design cites two files that do not say what it claims | A reader follows a dead citation | Re-check every cited line before a task relies on it (plan.md section 8) |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Built-in checks take under 2 seconds for 50 changed files. Phase 6 measures this, and this phase records the budget without gating on it.
- **NFR-P02**: One run starts at most two `python3` processes, one for hygiene and one for the Python parse.

### Security
- **NFR-S01**: The runner writes no file and runs no command named by a manifest or a surface block. The snapshot test in each fixture checks the first claim.
- **NFR-S02**: Secret findings print the rule id and the line number only. The matched text never reaches the verdict, the envelope or the text output.

### Reliability
- **NFR-R01**: Exit codes stay within 0 to 4. An internal error prints an `ERROR` verdict and exits 3, never an uncaught stack trace.
- **NFR-R02**: A checker output that cannot be parsed, or a check that times out, makes the run UNVERIFIED. It never reads as clean.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: no in-scope file. The run prints `NOTHING_CHECKED` and exits 2.
- Maximum length: a file over 2 MB goes to `coverage.unchecked` with the reason `size`. The run does not read it.
- Invalid format: a file with a NUL byte in its first 8 KB is binary. It goes to `coverage.unchecked` with the reason `binary`. A file with an extension that has no comment family goes to `coverage.unchecked` with the reason `no comment family`.

### Error Scenarios
- Checker failure: the hygiene output cannot be parsed. The check reads `ERROR`, the run is UNVERIFIED, and exit 4 applies unless a blocking P0 already set exit 1.
- Timeout: a check that exceeds its budget reads `TIMEOUT`. A required check in that state makes the run UNVERIFIED.
- Named file missing: `--files` names a path that does not exist. The run exits 3 with `FILE_NOT_FOUND`. A missing file never reads as clean.
- Not a git repository: `--files` is required. Without it the run exits 3 with `NO_GIT_REPOSITORY`.
- Symlink into another repository: the real-path guard resolves the link. The file does not count as SKILLED.

### State Transitions
- Partial completion: when one check fails to start, the other checks still run and report. The verdict lists each state.
- Session expiry: N/A. The runner keeps no state between runs, and it writes nothing that a later run reads.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 15 files across the skill, the registry, the compiler and the shared reader |
| Risk | 15/25 | Exit precedence, a shared reader used by the advisor, and the trust boundary of spawned commands |
| Research | 8/20 | The design is settled. Three runtime facts were probed. Phase 1 output shape is still open |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What field names does the Phase 1 `--json` output use for file, line, rule, reason and status? The runner reads those fields, so Phase 1 settles them before this phase starts.
- The MCP server source has no path in the current loading map (`Q/SKILL.md:107`). No MCP row is declared until someone names its path. This does not block the phase.
<!-- /ANCHOR:questions -->

---


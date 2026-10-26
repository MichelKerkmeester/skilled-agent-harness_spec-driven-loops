---
title: "Feature Specification: Phase 3: config-and-doctor"
description: "Adds the committed repository quality config at .sk-code/quality.json, argv-only configured checks behind a workspace mutation guard, the read-only quality leg of the sk-code setup battery and the approval-gated /doctor:sk-code quality route."
trigger_phrases:
  - "config and doctor"
  - "phase 3 config and doctor"
  - "sk-code quality config"
  - "doctor sk-code quality route"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 3: config-and-doctor

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-builtin-runner |
| **Successor** | 004-doctrine |
| **Handoff Criteria** | Phases 001 and 002 have landed. The design section 7 Phase 3 acceptance commands pass. The packet gates print `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Make sk-code-quality a codebase-agnostic, executable author gate specification. It adds the repository config seam that the runner reads and the doctor route that creates the config after approval.

**Scope Boundary**: Design section 7, Phase 3. Decisions D7, D8, D9, D16 and D17. Design section 4 (config location, discovery, merge rules, schema, suggestions and trust boundary). Design section 5.8 (the doctor battery leg and the new route). Fixtures F06 to F09 and F11. The phase does not change the checker engine, the runner core, the doctrine, the surface consumers or the measurement.

**Dependencies**:
- `001-honest-checker` (earlier phase, required). The checker takes the repository's ticket prefixes, extension families and extra patterns as arguments. This phase reads the flag names that phase 1 publishes (task T002) and does not invent them.
- `002-builtin-runner` (earlier phase, required). This phase extends `quality-gate.cjs`, `lib/run-check.cjs`, `assets/quality-defaults.json` and `references/runner-contract.md`. It also reuses the layer probe, the verdict and the exit codes from that phase, and the fixture helper in `scripts/tests/fixtures.cjs`. The snapshot helper that design section 6.1 uses as the read-only invariant also lands there, and this phase wires it around configured commands.
- Build order only: `004-doctrine` follows this phase in the build order. It reads none of this phase's output.
- This phase blocks `005-consumers-and-routing`, whose surface `quality` rows reuse this phase's validator, and `006-measurement`, which measures the config and the route.

**Deliverables**:
- `lib/quality-config.cjs`: discovery, parse, schema validation and merge.
- Configured checks with `{files}` and `cwd`, suggestions, and the mutation guard around each spawned command.
- `scripts/sk-code-quality-config.cjs` in the doctor folder, with `status`, `init` and `check`.
- The quality leg of the setup battery and the `/doctor:sk-code quality` route, with its YAML asset, presentation text and command doc.
- The config template and `references/quality-config.md`.
- The changelog, version and mirror updates these changes need.

**Changelog**:
- When this phase closes, write `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-003-config-and-doctor.md`. It follows the phase changelog naming of the other phased packets in this repository.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The quality gate reads only the rules this framework ships. A repository that wants its own typecheck, lint command or ticket prefixes has no committed place to name them, so the gate either skips those checks or asks the operator again on every run. Nothing reports whether a repository is ready for the gate, and nothing creates the config file without a risk of overwriting one that already exists.

### Purpose
Success means a repository commits one reviewed config file that names its own checks, the gate runs only the checks that file or the operator names, and the operator can inspect and create that file through a dry-run route that never overwrites.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Discover and validate the repository config at `.sk-code/quality.json`, then merge it over the shipped base layer.
- Run configured checks as argv arrays under timeouts, and bracket each spawn with a content-hash mutation guard.
- Report commands read from repository manifests as suggestions, with the exact config entry that would enable each one, and never run them.
- Add the read-only quality leg to the setup battery and the approval-gated `/doctor:sk-code quality` route.
- Ship the config template, its reference, and the version, changelog, mirror and advisor-bridge updates these changes need.

### Out of Scope
- Checker engine changes, which belong to `001-honest-checker`. This phase only passes config values to the checker as arguments.
- Runner core, built-in sensors and the layer probe, which belong to `002-builtin-runner`.
- Surface `quality` rows and the outside-surface metadata, which belong to `005-consumers-and-routing`.
- Iron Law 3 and the scope of the universal checklist, which belong to `004-doctrine` and wait on operator decisions D4 and D12.
- Any change to CI or pre-commit scope. Both stay whole-file (design D6), recorded in ADR-003.
- Installing tools. A missing tool gets a repair line and nothing else, as `AGENTS.md` requires for installs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` | Create | Discovery, parse, schema validation, merge and suggestion reading |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs` | Modify | Wire the content-hash guard and the argv-only spawn of configured commands (created by phase 2) |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Modify | Accept `--config` in place of the phase 2 rejection, read the config, run configured checks with `{files}` and `cwd`, pass commentHygiene values to the checker, add `suggested_checks` (created by phase 2) |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs` | Create | Discovery, validation, merge, F11 and template cases |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs` | Create | F06, F07, F08 and F09 cases |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Modify | The `unit: flags` case accepts `--config` (created by phase 2) |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json` | Create | The file `init` copies, with schema keys only |
| `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md` | Create | Schema, discovery, merge, error codes and trust boundary |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | One reference line and the minor version bump |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Modify | The config flags, the help flags, configured check rows, `suggested_checks` and the new codes (created by phase 2) |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md`, `scripts/lib/README.md` | Modify | Name `quality-config.cjs`, `spawnGroup()`, the new suites and the chained guard windows, and drop the claim that the runner runs no repository command |
| `.skilled/skills/sk-code/sk-code-quality/changelog/` | Create | The minor-version changelog entry for the config seam |
| `.skilled/skills/sk-code/changelog/` and the hub version lines | Create and Modify | Hub minor version and changelog, because this phase changes hub-owned playbook pins |
| `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md` | Modify | Eight legs and `legs=8` become nine and `legs=9` |
| `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` | Modify | DOC-382 and DOC-383 leg counts and the battery overview |
| `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-pre-v4-checkout.md` | Modify | Seven SKIP lines and `skipped=7` become eight and `skipped=8` |
| `.skilled/skills/sk-code/README.md` | Modify | The doctor paragraph names the quality leg and the quality target, and the newest changelog row moves to 3.3.0.0 |
| `.skilled/skills/sk-code/leaf-manifest.json`, the sk-code activation manifest and its authored twin | Regenerate | Written by `generate-leaf-manifest.cjs` and `compiled-route-manifest.cjs refresh`, then the twin copied over |
| `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` | Create | `status`, `init` (dry run until `--apply`) and `check` |
| `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` | Create | Dry run, apply, refusal and no-spawn cases |
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | Modify | Add the quality leg to the battery, after the probe leg in the LEGS array |
| `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` | Modify | Eight PASS lines and `legs=8` become nine |
| `.skilled/commands/doctor/scripts/README.markdown`, `scripts/tests/README.markdown` | Modify | Rows for the new script and its suite |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Add the `/doctor:sk-code` `quality` target after the setup route |
| `.skilled/commands/doctor/assets/doctor-sk-code-quality.yaml` | Create | Workflow for the quality target |
| `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt` | Modify | Argument wording, quality result table and templates |
| `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` | Modify | Eight legs become nine, and `legs=8` becomes `legs=9` |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modify | One target row for `/doctor:sk-code quality` |
| `.skilled/commands/doctor/sk-code.md` | Modify | Argument hint, mode routing and the execution target table |
| `.codex/prompts/doctor-sk-code.md`, `.pi/prompts/doctor-sk-code.md`, `.hermes/prompts/doctor-sk-code.md` | Regenerate | Runtime prompt mirrors, written by their sync scripts and never by hand. Each is a pointer stub to the router, so the sync wrote no file |
| `.hermes/skills/sk-code/SKILL.md`, `.hermes/skills/sk-code-quality/SKILL.md`, `.hermes/skills/system-skill-advisor/SKILL.md` | Regenerate | Hermes skill copies, written by `sync-skills-hermes.cjs` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify | Two bridge ids replace `command-doctor-sk-code` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerate | Output of `derive-command-bridges.cjs` |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts`, `runtime/lib/render.ts`, `runtime/scripts/skill_advisor.py` | Modify | Hardcoded bridge id and label move to the new ids |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-ordering.vitest.ts`, `runtime/tests/python/test_skill_advisor.py` | Modify | Assertions name the new ids |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Modify | The rows that named the old id name the setup bridge |
| `.skilled/skills/system-skill-advisor/changelog/` and `SKILL.md` | Create and Modify | Patch version and changelog for the bridge rename |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-003-config-and-doctor.md` | Create | Packet changelog, written when the phase closes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The runner picks one config source in this order: `--config PATH` (relative to the working directory), file-scoped git config `skcode.qualityConfig` (relative to the repository root, with `command`-scope values ignored), then `.sk-code/quality.json` at the repository root, then none. The chosen source is reported as `config.source`. |
| REQ-002 | A configured path that does not exist exits 3 with `CONFIG_PATH_MISSING` and names the missing path. The runner never falls back to the next source. |
| REQ-003 | The repository config is validated before any check spawns. `schemaVersion` must be `1`. An unknown key or malformed field is recorded in `config.errors`, and any config error exits 3 with `CONFIG_INVALID`. |
| REQ-004 | Merge rules: only the repository layer declares `checks`, and a duplicate `id` is a config error. `checklists` and `generated` append across layers. `commentHygiene` lists append, and the core patterns stay. An `exact` sensor accepts `exclude` only, and `enabled: false` on it is a config error. |
| REQ-005 | Each configured check runs as an argv array with `shell: false` under its own timeout (`timeoutSec`, default 120). `--no-run` lists configured checks with state `LISTED` and spawns none. A check matches files by `languages` and `paths`, `{files}` expands relative to its `cwd` (`"."` or `"package"`), a check with no match is `NOT_APPLICABLE`, and `required` defaults to true for P0 only. |
| REQ-006 | The mutation guard hashes `git diff --binary HEAD`, the list from `git ls-files --others --exclude-standard -z`, and the `git hash-object` of each untracked file without `-w`. A changed snapshot after a check ends the run with exit 3 `CHECK_MUTATED_WORKSPACE`, lists the changed paths and reverts nothing. A repository with no commit diffs against the empty tree `4b825dc642cb6eb9a060e54bf8d69288fbee4904`. Without git, configured checks report `ERROR` with `GUARD_UNAVAILABLE`, and a required one makes the run UNVERIFIED. |
| REQ-007 | A command read from a manifest appears under `suggested_checks` with the exact config entry that would enable it, and it never spawns. Scripts named `test`, `fix` or `format`, and any script containing `--write` or `--fix`, are never suggested. |
| REQ-008 | A required check whose `requires` tool is not on PATH reports `SKIPPED_ABSENT` with a repair line, makes the verdict UNVERIFIED and exits 4. |
| REQ-009 | A required P0 check that exits non-zero reports `RAN_FAIL`, makes the verdict BLOCKED and exits 1. |
| REQ-010 | `sk-code-quality-config.cjs` provides `status`, `init` and `check`, each with `--json`. `status` reports the config source and its errors, probes each `requires` tool on PATH as PASS (found), SKIP (no configured check names it) or DEGRADED (named and absent, with one repair line), and reports the layers. `check` validates the discovered config against the schema and reports `config.errors`, with no probe. `init` is a dry run until `--apply`. `init --apply` writes `.sk-code/quality.json` once and refuses with `CONFIG_EXISTS` and exit 1 when the file already exists. No mode spawns a configured command. |
| REQ-011 | The setup battery gains one read-only `quality` leg with five checks: Node and python3 present, runner and checker executable, `comment-syntax.json` and `quality-defaults.json` parse, the quality test suite passes, and the fixed prompt routes to `sk-code-quality`. A clean tree prints `PASS  quality` and ends with `STATUS=OK legs=9`. |
| REQ-012 | `/doctor:sk-code quality` is a route in `_routes.yaml` with `mutating: mutates` and a `gate3_location` that names `.sk-code/` at the repository root. It passes `route-validate.sh`, and the command doc, the presentation file and the YAML asset all name it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-013 | Each `commentHygiene.ticketPrefixes` entry starts with a letter and continues with up to 15 letters or digits, and each `extensions` value names a family in `comment-syntax.json`. Each `extraPatterns` entry compiles and is at most 200 characters. Any other value is a config error. |
| REQ-014 | `generated` rows run as configured checks that match on `paths`, under the same trust boundary as `checks`. |
| REQ-015 | The advisor bridge for `/doctor:sk-code` becomes `command-doctor-sk-code-setup` and `command-doctor-sk-code-quality`. No runtime file or test still names `command-doctor-sk-code` in quotes, and `derive-command-bridges.cjs` reruns clean. |
| REQ-016 | The quality test suite covers F06 to F09 and F11, and `node --test` on that suite reports `# fail 0`. |
| REQ-017 | `references/quality-config.md` and `assets/quality-config.template.json` exist under the sk-code-quality skill. The template parses as JSON and passes the schema test. The reference names the discovery order, the merge rule, the error codes and the trust boundary. |
| REQ-018 | Versions and changelogs: the sk-code-quality skill takes a minor bump with its changelog, the sk-code hub takes a minor bump with its changelog, system-skill-advisor takes a patch bump with its changelog, and the packet changelog is written when the phase closes. |
| REQ-019 | The Codex, Pi and Hermes prompt mirrors of `/doctor:sk-code` are regenerated by their sync scripts, and each script's `--check` form exits 0. No mirror file is edited by hand. |
| REQ-020 | The hub playbook entries and the battery test that name eight legs or `legs=8` name nine legs or `legs=9` after this phase. |
| REQ-021 | `quality-gate.cjs` and `sk-code-quality-config.cjs` each accept `--help` and `-h`. Either flag prints a short plain-text usage to stdout and exits 0: one line per flag, the exit codes and the config discovery order. Neither flag reads a config, starts a process or writes a file. Before this phase, `quality-gate.cjs --help` returned a `USAGE` envelope with exit 3. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` prints a `PASS  quality` line and ends with `STATUS=OK legs=9`, exit 0.
- **SC-002**: `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` prints `# fail 0`, and the suite includes the F06 to F09 and F11 cases.
- **SC-003**: In a temporary git repository, `init --apply` creates `.sk-code/quality.json` once, and a second `init --apply` exits 1 with `CONFIG_EXISTS` and leaves the file byte-identical.
- **SC-004**: A configured check that rewrites a tracked file ends its run with `CHECK_MUTATED_WORKSPACE` and exit 3, and the file keeps the rewritten content.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 checker arguments for ticket prefixes, extension families and extra patterns | Without the flag names, commentHygiene values cannot reach the checker | Task T002 reads the names phase 1 publishes and records them in `scratch/checker-args.md` before any code starts. This phase does not guess them. |
| Dependency | Phase 2 runner files, layer probe, verdict and fixture helper | Phase 3 has no base to extend | Phase 3 starts only after tasks T001 confirms the phase 2 files exist. |
| Dependency | Design operator item 3 (config name and merge rule, D16) | A different name or merge rule changes discovery, the template path and the reference | Taken as the design default in ADR-001 and ADR-002, and reversible in one path constant and one merge function. |
| Dependency | Node `node:test` with `--test-name-pattern`, and python3 for the checker | Verification commands fail on old Node or without python3 | CI runs Node 22 (`.github/workflows/sk-code-script-tests.yml`). The verification commands assume Node 18 or later and python3 on PATH. |
| Risk | A configured command is repository code | A committed config could run arbitrary commands when an operator runs the gate | Only the repository layer names commands, every command is an argv array run without a shell, each has a timeout, and the mutation guard brackets it. The doctor never runs one (REQ-005, REQ-006, REQ-010). |
| Risk | A repository has no git, so the mutation guard has no snapshot | Configured checks could mutate files without detection | Configured checks report `GUARD_UNAVAILABLE`, and a required one makes the run UNVERIFIED (REQ-006). |
| Risk | A timed-out tool forks children that survive the kill | Orphan processes keep running after the gate ends | The runner kills the whole process group on POSIX. Windows behavior is not specified by the design and stays UNKNOWN (see the open questions). |
| Risk | Config `extraPatterns` are regular expressions with a cost | A pathological pattern slows the checker | Each pattern compiles and is capped at 200 characters (REQ-013). A residual cost remains and is named in the reference. |
| Risk | Bridge rename misses one runtime reference | The advisor drops the doctor route or ranks it wrongly | REQ-015 greps the old id in quotes, and the advisor tests and the phrase-reach probe run after the change. |
| Risk | The battery run time grows with the quality leg, because check 4 runs the quality tests | The battery becomes slow for operators | The design sets no budget, so the battery time before and after is recorded in the implementation summary and reported, not gated. |
| Risk | The battery is read-only, but check 4 writes fixture repositories under the OS temp folder | An operator reads "writes nothing" as absolute | The battery header and the reference state that tests write only under the OS temp folder, and T041 proves the repository is unchanged. |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Config discovery and validation start no process except one `git config` read.
- **NFR-P02**: The battery wall time is recorded before and after the quality leg. The design sets no budget, so the increase is reported and not gated.

### Security
- **NFR-S01**: Only the repository layer names commands, and every command is an argv array run with `shell: false`.
- **NFR-S02**: No mode of the doctor script runs a configured command, and the only write is `init --apply`.

### Reliability
- **NFR-R01**: `init --apply` never overwrites. A second apply exits 1 with `CONFIG_EXISTS` and leaves the file byte-identical.
- **NFR-R02**: A malformed repository config exits 3 before any check spawns.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: no config file. The runner uses the shipped base layer only, fills `suggested_checks` and reports `config.source` as `none`.
- Maximum length: the design sets no size limit. The runner reads the file whole and reports its byte size in `config`.
- Invalid format: a JSON parse error becomes a `config.errors` entry with the parser message, and the run exits 3 with `CONFIG_INVALID`.

### Error Scenarios
- External service failure: N/A. The runner makes no network call, and the doctor reads PATH only.
- Network timeout: N/A. No network call exists in this phase.
- Concurrent access: two `init --apply` runs at once. The write goes to a temporary file that is hard-linked to the target, so the create fails for the second run with `CONFIG_EXISTS`.

### State Transitions
- Partial completion: an interrupted `init --apply` leaves no half-written `.sk-code/quality.json`, because the temporary file is removed on failure.
- Session expiry: N/A. The runner keeps no session state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | About 25 files across the quality skill, the doctor folder, the advisor runtime and two hub documents, plus two mirror trees |
| Risk | 19/25 | Configured commands run from a committed file, the guard decides exit codes, and the route writes a file after approval |
| Research | 8/20 | The design answers D7 to D17, the fixture plan and the phase boundary. Open items are listed in section 10 |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered: phase 1 publishes `--ticket-prefix PREFIX`, `--extension EXT=FAMILY` and `--extra-pattern REGEX`, each repeatable (task T002). Task T012 passes the config values through those flags.
- Still open for the operator: does the program need Windows support for configured commands? The design is silent. This phase targets POSIX, where `spawnGroup()` kills the whole process group (ADR-013), and Windows behavior stays UNKNOWN until an operator decides.
<!-- /ANCHOR:questions -->

---


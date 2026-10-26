---
title: "Acceptance Criteria: Phase 3: config-and-doctor"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "config and doctor acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/003-config-and-doctor"
    last_updated_at: "2026-10-26T08:15:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met the last criterion, AC-018, after the packet changelog was written"
    next_safe_action: "Commit the phase, then start phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-config-and-doctor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 3: config-and-doctor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/003-config-and-doctor
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `--config` path, a file-scoped git config value and a repository file, When discovery runs for each input state, Then exactly one source is chosen and `config.source` names it | `node --test --test-name-pattern="discovery" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the command, run as `node --test --test-reporter=tap --test-name-pattern="discovery" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs`, printed `# tests 4`, `# pass 4`, `# fail 0`, exit 0. | Met | - |
| AC-002 | REQ-002 | Given a `--config` path that does not exist, When the gate runs, Then it exits 3 with `CONFIG_PATH_MISSING` and names the missing path | `node --test --test-name-pattern="CONFIG_PATH_MISSING" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the command, run as `node --test --test-reporter=tap --test-name-pattern="CONFIG_PATH_MISSING" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs`, printed `# tests 2`, `# pass 2`, `# fail 0`, exit 0. | Met | - |
| AC-003 | REQ-003 | Given a repository config with an unknown key, When the gate runs, Then the error is listed in `config.errors`, no check spawns, and the run exits 3 with `CONFIG_INVALID` | `node --test --test-name-pattern="CONFIG_INVALID" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the command, run as `node --test --test-reporter=tap --test-name-pattern="CONFIG_INVALID" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs`, printed `# tests 3`, `# pass 3`, `# fail 0`, exit 0. | Met | - |
| AC-004 | REQ-004 | Given a repository config and the shipped base layer, When the layers merge, Then only the repository layer contributes checks, a duplicate id is an error, and `enabled: false` on an exact sensor is an error | `node --test --test-name-pattern="merge" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the command, run as `node --test --test-reporter=tap --test-name-pattern="merge" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs`, printed `# tests 2`, `# pass 2`, `# fail 0`, exit 0. | Met | - |
| AC-005 | REQ-005 | Given a configured check whose argv holds shell metacharacters, When it runs, Then the characters reach the program as literal text, a check over its timeout reports `TIMEOUT`, and `--no-run` spawns nothing | `node --test --test-name-pattern="argv" .skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs` prints `# fail 0`, and `rg -n "shell: *true" .skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs` prints nothing. Evidence 2026-10-26: the test command, run with `--test-reporter=tap`, printed `# tests 2`, `# pass 2`, `# fail 0`, exit 0, and `rg -n "shell: *true" .skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs` printed nothing, exit 1. | Met | - |
| AC-006 | REQ-006 | Given a configured check that rewrites a tracked file, When the run ends, Then it exits 3 with `CHECK_MUTATED_WORKSPACE`, lists the changed path, and keeps the rewritten content | `node --test --test-name-pattern="F08" .skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the command, run with `--test-reporter=tap`, printed `# tests 1`, `# pass 1`, `# fail 0`, exit 0. | Met | - |
| AC-007 | REQ-007 | Given a `package.json` whose `lint` script writes a canary file, When the gate runs, Then `lint` appears under `suggested_checks` with its config entry and the canary file does not exist | `node --test --test-name-pattern="F09" .skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the command, run with `--test-reporter=tap`, printed `# tests 1`, `# pass 1`, `# fail 0`, exit 0. | Met | - |
| AC-008 | REQ-008 | Given a required P0 check whose tool is absent, When the gate runs, Then the check reports `SKIPPED_ABSENT` with a repair line, the verdict is UNVERIFIED, and the exit code is 4 | `node --test --test-name-pattern="F06" .skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the command, run with `--test-reporter=tap`, printed `# tests 1`, `# pass 1`, `# fail 0`, exit 0. | Met | - |
| AC-009 | REQ-009 | Given a required P0 check that exits 1, When the gate runs, Then the check reports `RAN_FAIL`, the verdict is BLOCKED, and the exit code is 1 | `node --test --test-name-pattern="F07" .skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the command, run with `--test-reporter=tap`, printed `# tests 1`, `# pass 1`, `# fail 0`, exit 0. | Met | - |
| AC-010 | REQ-010 | Given a temporary git repository with no config, When `init --json` runs, Then it reports `STATUS=OK MODE=DRY_RUN`, writes no file, and `git status --porcelain` in that repository prints nothing | `node --test .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` prints `# fail 0`, and the dry run in a temporary repository leaves `git status --porcelain` empty. Evidence 2026-10-26: `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` printed `# tests 7`, `# pass 7`, `# fail 0`, exit 0. In a `mktemp -d` git repository holding a committed `package.json` with `lint` and `test` scripts, `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs init --json` printed `STATUS=OK MODE=DRY_RUN`, exit 0, and `git status --porcelain` in that repository printed nothing, 0 lines. | Met | - |
| AC-011 | REQ-011 | Given a clean tree, When the setup battery runs, Then the quality leg prints `PASS  quality`, the last line is `STATUS=OK legs=9`, and the exit code is 0 | `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` prints the line `PASS  quality` and the line `STATUS=OK legs=9`, and exits 0. Evidence 2026-10-26: `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` printed nine PASS lines, the ninth being `PASS  quality             python3, executables, tables, node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests, quality route probe`, then `STATUS=OK legs=9` as its last line, exit 0, in 33 seconds. | Met | - |
| AC-012 | REQ-012 | Given `_routes.yaml` with the new route, When the route validator runs, Then it exits 0, and the `quality` target names `mutating: mutates` with `.sk-code/` as its gate location | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0, and `rg -n "target: quality" .skilled/commands/doctor/_routes.yaml` prints one line. Evidence 2026-10-26: `bash .skilled/commands/doctor/scripts/route-validate.sh` printed `PASS: K1/K2: no read-only route declares a write or grants a mutating advisor command` and its final line reports `route-validate`, `18 routes validated, 2 warnings`, exit 0. `rg -n "target: quality" .skilled/commands/doctor/_routes.yaml` printed one line, `244:    target: quality`, and the route block at lines 243 to 250 sets `mutating: mutates` and a `gate3_location` naming `.sk-code/` at the repository root. | Met | - |
| AC-013 | REQ-013 | Given a ticket prefix that contains a symbol, or an extra pattern that does not compile, When the config loads, Then each value is a config error | `node --test --test-name-pattern="ticket" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs` and `node --test --test-name-pattern="extraPatterns" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs` each print `# fail 0`. Evidence 2026-10-26: each command, run with `--test-reporter=tap`, exited 0. The `ticket` run printed `# tests 1`, `# pass 1`, `# fail 0`, and the `extraPatterns` run printed `# tests 3`, `# pass 3`, `# fail 0`. | Met | - |
| AC-014 | REQ-014 | Given a `generated` row whose path matches a changed file, When the gate runs, Then its argv runs as a configured check under the same trust boundary as `checks` | `node --test --test-name-pattern="generated" .skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs` prints `# fail 0`. Evidence 2026-10-26: the command, run with `--test-reporter=tap`, printed `# tests 1`, `# pass 1`, `# fail 0`, exit 0. | Met | - |
| AC-015 | REQ-015 | Given the advisor bridge rename, When the runtime is searched for the old quoted id, Then nothing is found, and the bridge derivation reruns with exit 0 | `rg -n "command-doctor-sk-code['\"]" .skilled/skills/system-skill-advisor/runtime` prints nothing, and `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` exits 0. Evidence 2026-10-26: `rg -n "command-doctor-sk-code['\"]" .skilled/skills/system-skill-advisor/runtime` printed nothing, exit 1, and `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` printed `"status": "fresh"` and `"changed": []`, exit 0, with `git status --porcelain` byte-identical before and after. | Met | - |
| AC-016 | REQ-016 | Given the quality suite, When `node --test` runs over it, Then every test passes and the F06, F07, F08, F09 and F11 cases are present | `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` prints `# fail 0`. Evidence 2026-10-26: `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` printed `# tests 60`, `# pass 60`, `# fail 0`, exit 0. The F06, F07, F08 and F09 cases each appear once in `configured-checks.test.cjs`, and F11 appears once in `quality-config.test.cjs`. | Met | - |
| AC-017 | REQ-017 | Given the template and the reference, When both are checked, Then the template parses as JSON, and the reference names all four error codes | `python3 -m json.tool .skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json > /dev/null && echo parsed` prints `parsed`, and `rg -o -e CONFIG_PATH_MISSING -e CONFIG_INVALID -e CHECK_MUTATED_WORKSPACE -e GUARD_UNAVAILABLE .skilled/skills/sk-code/sk-code-quality/references/quality-config.md` names each of the four codes. Evidence 2026-10-26: `python3 -m json.tool .skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json > /dev/null && echo parsed` printed `parsed`, exit 0, and `rg -o -e CONFIG_PATH_MISSING -e CONFIG_INVALID -e CHECK_MUTATED_WORKSPACE -e GUARD_UNAVAILABLE .skilled/skills/sk-code/sk-code-quality/references/quality-config.md \| sort \| uniq -c` printed 3 matches for `CONFIG_INVALID` and 2 for each of `CONFIG_PATH_MISSING`, `CHECK_MUTATED_WORKSPACE` and `GUARD_UNAVAILABLE`. | Met | - |
| AC-018 | REQ-018 | Given the changes have landed, When the version files are read, Then each newest changelog file matches its SKILL.md version, and the packet changelog exists | `ls .skilled/skills/sk-code/sk-code-quality/changelog` lists the new minor file, `rg -n "^version:" .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints the same version, and `ls specs/sk-code/015-quality-agnostic-gate/changelog` lists the phase changelog. Failed 2026-10-26, then passed the same day. The first two clauses held: `ls .skilled/skills/sk-code/sk-code-quality/changelog` lists `v1.7.0.0.md` as the newest file by `sort -V`, and `rg -n "^version:" .skilled/skills/sk-code/sk-code-quality/SKILL.md` printed `5:version: 1.7.0.0`. The third clause failed until this phase's changelog was written, which task T048 did. Evidence 2026-10-26: `ls specs/sk-code/015-quality-agnostic-gate/changelog` printed `changelog-015-001-honest-checker.md` and `changelog-015-003-config-and-doctor.md`, exit 0, and the file was written by `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js specs/sk-code/015-quality-agnostic-gate/003-config-and-doctor --write`, which exited 0. | Met | - |
| AC-019 | REQ-019 | Given the three runtime sync scripts, When each runs with `--check`, Then each exits 0, and no mirror file was edited by hand | `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check`, `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check` and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check` each exit 0. Evidence 2026-10-26: `sync-prompts.cjs --check` printed `[codex-prompt-sync] PASS: 38 prompts are in sync.`, `sync-prompts-pi.cjs --check` printed `[pi-prompt-sync] PASS: 38 prompts are in sync.` and `sync-prompts-hermes.cjs --check` printed `[hermes-prompt-sync] PASS: 38 prompts are in sync.`, each exit 0. `git status --porcelain` showed no mirror file changed. | Met | - |
| AC-020 | REQ-020 | Given the hub playbook and the battery test, When both are searched for the old leg count, Then no old count remains | `rg -n "legs=8" .skilled/skills/sk-code/manual-testing-playbook .skilled/commands/doctor` prints nothing, and `node --test .skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` prints `# fail 0`. Evidence 2026-10-26: `rg -n "legs=8" .skilled/skills/sk-code/manual-testing-playbook .skilled/commands/doctor` printed nothing, exit 1, and `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` printed `# tests 17`, `# pass 17`, `# fail 0`, exit 0. | Met | - |
| AC-021 | REQ-021 | Given the runner and the doctor config script, When either runs with `--help` or `-h`, Then it prints a plain-text usage that starts with `Usage:` and names every flag, the exit codes and the config discovery order, and it exits 0 | `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --help; echo "exit=$?"` and `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs -h; echo "exit=$?"` each print `Usage:` and `exit=0`, and `node --test --test-name-pattern="help" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` prints `# fail 0`. Evidence 2026-10-26: `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --help; echo "exit=$?"` printed `Usage: quality-gate.cjs [scope] [options]` first, then every flag, the four-line config discovery order and the five exit codes, then `exit=0`. `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs -h; echo "exit=$?"` printed `Usage: sk-code-quality-config.cjs status\|check\|init [options]` first, then every flag, the same discovery order and its exit codes, then `exit=0`. `node --test --test-reporter=tap --test-name-pattern="help"` over both test files printed `# tests 2`, `# pass 2`, `# fail 0`, exit 0. | Met | - |

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

All 21 criteria are `Met`, and each Verification cell carries the command that was run and the output it printed. The last row to close was `AC-018`, which waited on this phase's changelog in the parent packet, and task T048 wrote it.
<!-- /ANCHOR:closure -->

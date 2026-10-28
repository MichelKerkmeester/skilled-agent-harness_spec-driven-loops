---
title: "Doctor Script Tests: Coverage For Every Doctor Script"
description: "One automated suite per doctor script, run together by run-all.sh in CI and locally."
trigger_phrases:
  - "doctor script tests"
  - "doctor test runner"
---

# Doctor Script Tests: Coverage For Every Doctor Script

> Documents `.skilled/commands/doctor/scripts/tests/`. This README uses the `.markdown` extension
> because OpenCode registers every `.md` file under `.skilled/commands/` as a command.

---

## 1. OVERVIEW AND PURPOSE

`tests/` holds the automated suites for the scripts in `.skilled/commands/doctor/scripts/`. Every script has at least one suite covering its happy path, the drift or failure it must catch and its error path. Each fixed bug has a regression test.

Current state:

- Suites build their fixtures in temporary directories and remove them. None writes into the repository.
- Scripts take a root option or an environment override so a suite can point them at a fixture tree. The parent README lists the overrides.
- `run-all.sh` runs every suite. CI calls it from the `doctor-scripts` job in `.github/workflows/spec-kit-check.yml`.

---

## 2. KEY FILES

| File | Covers |
|---|---|
| `run-all.sh` | Runs every suite below, plus `route-validate.sh --self-test` and the skill-graph freshness panel |
| `agent-roster-mirror-check.test.cjs` | `agent-roster-mirror-check.cjs` |
| `command-catalog-mirror-check.test.cjs` | `command-catalog-mirror-check.cjs` |
| `doctor-phrase-reach.test.cjs` | `doctor-phrase-reach.cjs`: every admitted phrase reaching its bridge on the built advisor, and the stale-build refusal with exit 2 |
| `sk-code-setup-check.test.cjs` | `sk-code-setup-check.cjs` against throwaway fixture roots: the passing battery, the probe verdicts, the quality leg's verdicts, the repair line for each failing leg it drives, the provision-step skip and the usage error |
| `sk-code-quality-config.test.cjs` | `sk-code-quality-config.cjs` against throwaway repositories: the init dry run, an apply and a refused second apply, the folder that leads outside the repository, the tool states, the invalid and missing config, the applied checklists with their seats, override rows and refusals, a declared row the sample cannot reach, the hygiene rules that apply, the help text and a source check that it starts no process but git and `quality-gate.cjs --explain`, and runs no configured check |
| `parent-skill-check-invariants.test.cjs` | `parent-skill-check.cjs`, one or more cases per invariant id |
| `parent-skill-check-command-column.test.cjs` | `parent-skill-check.cjs` command-column checks |
| `parent-skill-check-leaf-manifest.test.cjs` | `parent-skill-check.cjs` leaf-manifest checks |
| `parent-skill-check-root-router.test.cjs` | `parent-skill-check.cjs` root-router checks |
| `git-hook-gates.test.cjs` | `git-hook-gates.cjs` against throwaway repositories with an isolated global config, and the hook helper reading what it writes |
| `git-standards.test.cjs` | `git-standards.cjs` against throwaway repositories, each change checked with sk-git's `validate-message.mjs` |
| `git-setup-check.test.cjs` | `git-setup-check.cjs` against throwaway repositories with an isolated global config: the passing battery, each failing check with its repair, the usage errors, a no-write proof over the tree and git config, and an untrusted clone whose planted helpers must never run |
| `release-update.test.cjs` | `release-update.cjs`, every subcommand against throwaway git repositories |
| `doctor-update-contract.test.cjs` | Checks the `/doctor:update` router, workflows, presentation and command contract against each other and the engine |
| `doctor-update-compat.test.cjs` | Checks the read-only compatibility phase of `/doctor:update check` (layout states and era signal fields, with neither command writing) and the compat action: its YAML and router as contracts, the planned steps against classic, partial, interrupted and colliding fixtures, the dirty-root refusal, the failed-step contract in `on_step_failure`, the failed-packet parsing and the release gate |
| `doctor-update-compat-integration.test.cjs` | Takes a fixture v3 repository through the compat workflow end to end: layout check, preview, move, upgrade and validation |
| `doctor-speckit-contract.test.cjs` | Checks that `/doctor:speckit` reports phrase quality as an advisory outside its status, and that every workflow status is one its presentation renders |
| `doctor-mcp-contract.test.cjs` | Checks the `/doctor:mcp` unknown-flag and cross-sub-action flag errors in its router and presentation |
| `skill-advisor-route-contract.test.cjs` | The advisor commands and flags the doctor routes invoke |
| `check-mcp-mutation-class.test.sh` | `check-mcp-mutation-class.sh` and its manifest |
| `mcp-doctor.test.sh` | `mcp-doctor.sh` and `mcp-doctor-lib.sh` |
| `route-validate.test.sh` | `route-validate.sh` and `route-validate.py` |
| `ci-report.test.cjs` | `ci-report.cjs`: switch-state reporting, the four missing-setting flags, trigger and action-pin flags, drift against the README table, the rebuild-commit skip, the failing-gh degrade, the usage error, a no-write proof over the repository root and the CI profile cases: a foreign repository with its own switch names and no README, another branch, `--profile`, git config and an unknown key |
| `ci-profile.test.cjs` | `../lib/ci-profile.cjs`: the discovery order, the generic default, the strict schema and this repository's committed profile with every protected entry |
| `ci-scaffold.test.cjs` | `ci-scaffold.cjs`: this repository's render keeps every convention, a foreign render carries none of them, `--protected` and an unknown group |
| `ci-toggle.test.cjs` | `ci-toggle.cjs` with a gh stub: a foreign switch is accepted, the variable behind a required check is refused, `neverOff` and README refusals, the no-op refusal and, here, the second confirmation for the freshness and reports switches |
| `doctor-ci-contract.test.cjs` | Checks the `/doctor:ci` router, workflows, presentation and command contract against each other: the route manifest, the toggle's allowed names, the scaffold's refusals and templates |
| `doctor-setup-orphan-line.test.cjs` | The orphan-process line in `/doctor:setup`: informational output that never changes the doctor status |
| `opencode-version-battery.test.cjs` | `opencode-version-battery.cjs`: the plugin, command and MCP-prompt legs on v1 and v2, the family skips, nested roots, the argument errors and the probe count |
| `orphan-process-check.test.cjs` | `orphan-process-check.cjs`: elapsed-time and ps parsing, orphan classification, the `--json`, `--summary` and `--min-age-min` options and the guarded `--reap --yes` |
| `test_audit_descriptions.py` | `audit_descriptions.py` |

The freshness panel suite lives at `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts` because it runs on the advisor runtime's vitest.

Naming decides which runner picks a file up: `*.test.cjs` runs under `node --test`, `test_*.py` under `unittest`, and `*.test.sh` under bash. Bash suites print `PASS:` and `FAIL:` lines, end with a `Results:` line and exit non-zero on any failure. They run on macOS bash 3.2 and on Linux.

---

## 3. INSTRUCTIONS

Run from the repository root:

```bash
bash .skilled/commands/doctor/scripts/tests/run-all.sh
```

Expected result: `[run-all] N suite(s) passed, 0 failed` and exit `0`. Exit `2` means a required tool is missing: `node`, `python3` with PyYAML, or the advisor runtime's dependencies (`npm --prefix .skilled/skills/system-skill-advisor/runtime ci`).

Run one suite on its own:

```bash
node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs
bash .skilled/commands/doctor/scripts/tests/mcp-doctor.test.sh
python3 -m unittest discover -s .skilled/commands/doctor/scripts/tests -p 'test_*.py'
```

---

## 4. RELATED

- [Doctor command scripts](../README.markdown)
- [Doctor route manifest](../../../../commands/doctor/_routes.yaml)

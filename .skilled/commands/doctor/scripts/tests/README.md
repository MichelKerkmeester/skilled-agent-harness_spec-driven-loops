---
title: "Doctor Script Tests: Coverage For Every Doctor Script"
description: "One automated suite per doctor script, run together by run-all.sh in CI and locally."
trigger_phrases:
  - "doctor script tests"
  - "doctor test runner"
---

# Doctor Script Tests: Coverage For Every Doctor Script

---

## 1. OVERVIEW

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
| `parent-skill-check-invariants.test.cjs` | `parent-skill-check.cjs`, one or more cases per invariant id |
| `parent-skill-check-command-column.test.cjs` | `parent-skill-check.cjs` command-column checks |
| `parent-skill-check-leaf-manifest.test.cjs` | `parent-skill-check.cjs` leaf-manifest checks |
| `parent-skill-check-root-router.test.cjs` | `parent-skill-check.cjs` root-router checks |
| `git-hook-gates.test.cjs` | `git-hook-gates.cjs` against throwaway repositories with an isolated global config, and the hook helper reading what it writes |
| `git-standards.test.cjs` | `git-standards.cjs` against throwaway repositories, each change checked with sk-git's `validate-message.mjs` |
| `release-update.test.cjs` | `release-update.cjs`, every subcommand against throwaway git repositories |
| `doctor-update-contract.test.cjs` | Checks the `/doctor:update` router, workflows, presentation and command contract against each other and the engine |
| `skill-advisor-route-contract.test.cjs` | The advisor commands and flags the doctor routes invoke |
| `check-mcp-mutation-class.test.sh` | `check-mcp-mutation-class.sh` and its manifest |
| `mcp-doctor.test.sh` | `mcp-doctor.sh` and `mcp-doctor-lib.sh` |
| `route-validate.test.sh` | `route-validate.sh` and `route-validate.py` |
| `test_audit_descriptions.py` | `audit_descriptions.py` |

The freshness panel suite lives at `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts` because it runs on the advisor runtime's vitest.

Naming decides which runner picks a file up: `*.test.cjs` runs under `node --test`, `test_*.py` under `unittest`, and `*.test.sh` under bash. Bash suites print `PASS:` and `FAIL:` lines, end with a `Results:` line and exit non-zero on any failure. They run on macOS bash 3.2 and on Linux.

---

## 3. VALIDATION

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

- [Doctor command scripts](../README.md)
- [Doctor route manifest](../../_routes.yaml)

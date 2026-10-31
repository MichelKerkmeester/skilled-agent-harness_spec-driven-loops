# CI yaml-parser check (T010)

Taken on 2026-10-15 against the working tree. The question: which CI job runs the bridge generator (`derive-command-bridges.cjs`), directly, through `skill_advisor.py --check-command-bridges`, or through a test that calls either, and does that job install the `.skilled` packages that carry `yaml`?

## Callers of the generator

Command: `rg -l "derive-command-bridges|check-command-bridges|check_command_bridges|COMMAND_BRIDGES_DERIVER" .skilled .github --glob '!**/node_modules/**' --glob '!**/dist/**' --glob '!**/z_archive/**'`

| Caller | How it runs the generator | Reaches the yaml read? |
|--------|---------------------------|------------------------|
| `runtime/tests/typo-flags.vitest.ts` | `node derive-command-bridges.cjs --chek` | No. The unknown flag exits 2 before the manifest is read, and the deriver loads `yaml` lazily inside the manifest reader |
| `runtime/scripts/skill_advisor.py --check-command-bridges` | `node derive-command-bridges.cjs --check` subprocess | Yes, but no workflow and no test calls this flag (`rg -n "check-command-bridges" .github` finds nothing) |
| `.github/workflows/*.yml` | None calls the deriver directly | Not applicable |

## Jobs that run a caller

| Workflow, job | What it runs | `.skilled` install line |
|---------------|--------------|-------------------------|
| `skill-advisor-stress.yml` | Advisor stress vitest config | `npm --prefix .skilled ci` (line 58) |
| `spec-kit-check.yml`, doctor-scripts job | `run-all.sh` doctor suites, advisor runtime build | `npm --prefix .skilled ci` (line 191) |
| `spec-kit-check.yml`, first job | spec-kit runtime and CLI suites | `npm --prefix .skilled ci` (line 80) |
| `routing-registry-drift.yml`, golden-prompt-gate | Golden prompts, ratchet, divergence ratchet, holdout independence, corpus gate | None, and none needed: these read the generated blocks in `projection.ts` and `skill_advisor.py` and never run the deriver |

## Result

No CI job runs the generator without the `yaml` parser, so no install step was added. The plan expected the golden-prompt job to need one; reading its steps shows it never invokes the deriver, only its generated output.

Resolution proof, from the deriver's folder:

```
$ node -e "console.log(require.resolve('yaml'))"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/node_modules/yaml/dist/index.js
```

# Workflow gate run

Observed 2026-10-24 from the worktree root. `gate-run.log` holds the raw output and is gitignored, so the deciding lines are quoted here.

| command | deciding line |
|---|---|
| `bash .github/scripts/tests/check-gate-inputs.test.sh` | `check-gate-inputs: 54 passed, 0 failed` |
| `bash .github/scripts/check-gate-inputs.sh` | `files=45 inputs_resolved=236 dynamic_inputs=9 twin_pairs=340 failures=0` then `RESULT: PASSED` |
| `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"` | `YAML_OK` |

The real-tree gate resolved 236 inputs where the phase-004 baseline resolved 235; the one extra input is the drift checker path in the deep-loop-runtime step added by this phase.

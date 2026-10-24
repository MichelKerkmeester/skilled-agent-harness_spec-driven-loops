## Gate after R12

Command: `bash .github/scripts/check-gate-inputs.sh`

Output:

```text
files=45 inputs_resolved=235 dynamic_inputs=9 twin_pairs=340 failures=0
RESULT: PASSED
```

Command: `bash .github/scripts/tests/check-gate-inputs.test.sh | tail -1`

Output: `check-gate-inputs: 54 passed, 0 failed`

Command: `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"`

Output: no output; exit `0`.

# Legacy lane name sources

Each row names one entry command from `lane-commands.txt`, the shape its harness prints a test name in, and the extractor `measure-overlap.sh` applies to that lane's log. Extraction is per lane because a single global pattern would either miss a shape or capture a summary line.

| Lane command | npm script | Name shape | Extract and normalize | Proof |
|---|---|---|---|---|
| node tests/test-scripts-modules.js | test:legacy | `   ✅ <name>` | strip the 6-character prefix `   ✅ `, keep the rest verbatim | `rg -n '✅ \$\{testName\}' tests/test-scripts-modules.js` prints line 43 |
| node tests/test-extractors-loaders.js | test:legacy | `   [PASS] <name>` | strip the prefix `   [PASS] `, keep the rest verbatim | `rg -n '\[PASS\] \$\{testName\}' tests/test-extractors-loaders.js` prints line 57 |
| node tests/test-phase-validation.js | test:legacy | `PASS: <message>` at column 1 | strip the prefix `PASS: `, keep the rest verbatim | `rg -n 'console.log\(`PASS: ' tests/test-phase-validation.js` prints line 53 |
| node tests/test-phase-system.js | test:legacy | `PASS: <message>` at column 1 | strip the prefix `PASS: `, keep the rest verbatim | `rg -n 'console.log\(`PASS: ' tests/test-phase-system.js` prints line 50 |
| node tests/test-validation-system.cjs | test:validation | `   [PASS] <name>` | strip the prefix `   [PASS] `, keep the rest verbatim | `rg -n '\[PASS\] \$\{testName\}' tests/test-validation-system.cjs` prints line 60 |
| bash tests/test-validation.sh | test:validation | `  • [<category>] <name>` in `--list` mode | collect with `--list`; strip the prefix `  • `, keep the category and the name | `rg -n 'echo "  • \$test"' tests/test-validation.sh` prints line 852 |
| bash tests/test-validation-extended.sh | test:validation | `  - [<category>] <name>` in `--list` mode | collect with `--list`; strip the prefix `  - `, keep the category and the name | `rg -n 'echo "  - \$test"' tests/test-validation-extended.sh` prints line 1064 |
| bash tests/check-ac-closure.sh | test:validation | `  ok    <name>` padded to 56 columns, then a result value | strip the prefix `  ok    `, cut columns 1 to 56, trim trailing spaces | `rg -n "printf '  ok    %-56s" tests/check-ac-closure.sh` prints line 35 |
| bash tests/check-ac-coverage.sh | test:validation | `  ok    <name>` padded to 54 columns, then a result value | strip the prefix `  ok    `, cut columns 1 to 54, trim trailing spaces | `rg -n "printf '  ok    %-54s" tests/check-ac-coverage.sh` prints line 42 |
| bash tests/check-graph-metadata-child-drift.sh | test:validation | `  PASS: <message>` | strip the prefix `  PASS: `, keep the rest verbatim | `rg -n 'PASS: \$1' tests/check-graph-metadata-child-drift.sh` prints line 33 |
| bash tests/check-graph-metadata-shape-last-active-child.sh | test:validation | `  PASS: <message>` | strip the prefix `  PASS: `, keep the rest verbatim | `rg -n 'PASS: \$1' tests/check-graph-metadata-shape-last-active-child.sh` prints line 27 |
| bash tests/test-phase-system.sh | test:validation | `  PASS: <message>` | strip the prefix `  PASS: `, keep the rest verbatim | `rg -n 'PASS: \$1' tests/test-phase-system.sh` prints line 27 |

## Why two lanes collect in list mode

`test-validation.sh` and `test-validation-extended.sh` print a check mark per executed test, but the check mark line carries no category and changes with terminal color detection. Both scripts already isolate the same names in a stable `[<category>] <name>` form behind `--list`, and list mode runs no test. The collector therefore appends `--list` to those two commands only. Every other lane runs its normal command and is parsed from the run output.

## Lines that are not names

Summary lines such as `Results: 12 passed, 0 failed`, `  29 passed, 0 failed`, `  ✅ Passed: 266`, `Total: 31 tests in 9 categories` and section headings do not match any extractor prefix and are ignored. A name that begins with a prefix-like string is kept whole because the extractor strips only the documented prefix.

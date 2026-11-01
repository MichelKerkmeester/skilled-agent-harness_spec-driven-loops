# Baseline before change

```text
$ bash .skilled/commands/doctor/scripts/tests/run-all.sh
[run-all] PASS: node:test (45 files)
[run-all] PASS: unittest (1 files)
[run-all] PASS: check-mcp-mutation-class.test.sh
[run-all] PASS: mcp-doctor.test.sh
[run-all] PASS: route-validate.test.sh
[run-all] PASS: route-validate.sh --self-test
[run-all] PASS: skill-graph freshness panel (vitest)
[run-all] 7 suite(s) passed, 0 failed
ℹ tests 999
ℹ pass 999
ℹ fail 0
exit=0

$ node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs
ℹ tests 10
ℹ pass 10
ℹ fail 0
exit=0

$ node --test .skilled/commands/doctor/scripts/tests/doctor-symlink-contract.test.cjs
ℹ tests 34
ℹ pass 34
ℹ fail 0
exit=0

```

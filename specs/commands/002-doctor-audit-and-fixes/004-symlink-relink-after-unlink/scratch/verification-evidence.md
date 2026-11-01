# Verification evidence

HEAD: `e586366c8787ecf7d6ed12bfc2287c5dea8b1e33` on `main`; the change is the uncommitted working tree.

```text
$ node -c .skilled/commands/doctor/scripts/symlink-engine.cjs
exit=0

$ rg -n "slice\(0, 16\)" .skilled/commands/doctor/scripts/symlink-engine.cjs
exit=1 (1 = no line)

$ rg -n "REQ-0|T00|004-symlink|specs/" .skilled/commands/doctor/scripts/symlink-engine.cjs .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs
exit=1 (1 = no line)

$ rg -n -i "secret|password" .skilled/commands/doctor/scripts/symlink-engine.cjs
exit=1 (1 = no line)

$ rg -c "prefix>-2" .skilled/commands/doctor/symlink.md .skilled/commands/doctor/assets/doctor-symlink-link.yaml .skilled/commands/doctor/_routes.yaml
.skilled/commands/doctor/_routes.yaml:1
.skilled/commands/doctor/symlink.md:1
.skilled/commands/doctor/assets/doctor-symlink-link.yaml:1
exit=0

$ node --test --test-name-pattern "relinking the same plan" .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs
✔ relinking the same plan after unlink succeeds and keeps the earlier run record intact (800.665333ms)
ℹ tests 1
ℹ pass 1
ℹ fail 0
exit=0 (captured in a separate run without the pipe)

$ node --test --test-name-pattern "unlink refuses a run folder" .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs
✔ unlink refuses a run folder whose name does not follow the recorded digest (450.093125ms)
ℹ tests 1
ℹ pass 1
ℹ fail 0
exit=0 (captured in a separate run without the pipe)

$ node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs
ℹ tests 12
ℹ pass 12
ℹ fail 0
exit=0 (captured in a separate run without the pipe)

$ node --test .skilled/commands/doctor/scripts/tests/doctor-symlink-contract.test.cjs
ℹ tests 34
ℹ pass 34
ℹ fail 0
exit=0 (captured in a separate run without the pipe)

$ node --test .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs
ℹ tests 16
ℹ pass 16
ℹ fail 0
exit=0 (captured in a separate run without the pipe)

$ bash .skilled/commands/doctor/scripts/tests/run-all.sh
[run-all] PASS: node:test (45 files)
[run-all] PASS: unittest (1 files)
[run-all] PASS: check-mcp-mutation-class.test.sh
[run-all] PASS: mcp-doctor.test.sh
[run-all] PASS: route-validate.test.sh
[run-all] PASS: route-validate.sh --self-test
[run-all] PASS: skill-graph freshness panel (vitest)
[run-all] 7 suite(s) passed, 0 failed
ℹ tests 1001
ℹ pass 1001
ℹ fail 0
exit=0
```

## Delta

| Gate | Before | After | Delta |
|------|--------|-------|-------|
| run-all.sh suites | 7 passed, 0 failed | 7 passed, 0 failed | 0 |
| run-all.sh node:test aggregate | 999 pass, 0 fail | 1001 pass, 0 fail | +2 (the two new engine tests) |
| symlink-engine.test.cjs | 10 pass, 0 fail | 12 pass, 0 fail | +2 |
| doctor-symlink-contract.test.cjs | 34 pass, 0 fail | 34 pass, 0 fail | 0 |
| relink regression test | fail 1 (EEXIST) | pass 1 | red to green |

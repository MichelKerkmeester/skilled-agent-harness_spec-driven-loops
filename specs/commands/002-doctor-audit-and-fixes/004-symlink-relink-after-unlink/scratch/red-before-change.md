# Red before change

The regression test ran against the unmodified `symlink-engine.cjs`.

## Single test

```text
$ node --test --test-name-pattern "relinking the same plan" .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs
✖ relinking the same plan after unlink succeeds and keeps the earlier run record intact (718.535208ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 753.119375

✖ failing tests:

test at .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs:321:1
✖ relinking the same plan after unlink succeeds and keeps the earlier run record intact (718.535208ms)
  AssertionError [ERR_ASSERTION]: relinking the same plan should succeed
  ERROR: cannot create run record at /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/symlink-engine-source-SbePB6/.skilled/output/doctor-symlink/5a04d2913a6c3745/manifest.json: EEXIST: file already exists, open '/private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/symlink-engine-source-SbePB6/.skilled/output/doctor-symlink/5a04d2913a6c3745/manifest.json'
  
  
  
  2 !== 0
  
      at assertStatus (/Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs:76:10)
      at TestContext.<anonymous> (/Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs:335:3)
      at Test.runInAsyncScope (node:async_hooks:226:14)
      at Test.run (node:internal/test_runner/test:1402:25)
      at Test.start (node:internal/test_runner/test:1262:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:387:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 2,
exit=1
```

## Whole engine suite

```text
$ node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs
ℹ tests 11
ℹ pass 10
ℹ fail 1
exit=1
```

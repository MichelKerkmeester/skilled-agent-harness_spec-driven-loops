# Verification evidence

Uncommitted working tree on `main` at HEAD `eed2dd615a`.

```text
$ npx --no-install vitest run tests/schemas/advisor-tool-schemas.vitest.ts
 Test Files  1 passed (1)
      Tests  18 passed (18)

$ npm run typecheck        # exit 0, no output from tsc

$ npm run build            # dist rebuilt, "dist build attestation recorded" twice
$ grep -c isWiredToSourceTree dist/runtime/schemas/advisor-tool-schemas.js
2

$ npx --no-install vitest run            # whole advisor suite, exit 0
 Test Files  159 passed (159)
      Tests  1361 passed | 8 skipped (1369)

$ bash .skilled/commands/doctor/scripts/tests/run-all.sh    # exit 0
[run-all] 7 suite(s) passed, 0 failed
```

## Live proof

This checkout's daemon (launcher pid 23370) was stopped with SIGTERM so the allowlist reloads; the Barter coder daemon (pids 24056, 24059) was left alone. A project was made under the session scratchpad with only `.skilled` linked: `ln -s <Skilled>/.skilled <scratchpad>/advisor-link-proof/project/.skilled`.

```text
$ cd <scratchpad>/advisor-link-proof/project
$ node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
exit=0
{ "status": "ok", "data": { "freshness": "stale", ... "skillCount": 15, ... } }
```

The call relaunched the daemon (launcher 55220, server 55252). `freshness: stale` is the startup scan's state right after launch, not a refusal.

The scratchpad sits under `/private/tmp`, which the prefix allowlist already admits, so that call alone cannot tell the old rule from the new one. The built module was therefore asked directly, with its production default source root (this checkout):

```text
$ node --input-type=module -e '<import dist schemas; call the checks>'
wired(project)= true wired(plain)= false wired(/etc)= false
```

The proof project was removed afterwards with `rm -rf`, which does not follow the `.skilled` link; `ls <Skilled>/.skilled` still lists `agents`, `bin` and the rest.

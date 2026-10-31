# Contract test: passes on the shipped files, fails on each removed line

Both files resolve through an environment override, so each removal runs against a
copy in a scratch directory and no tracked line is ever deleted to prove the test.

## The shipped files

```text
$ node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs
✔ the route declares both Hermes checks in their check-only form (8.577625ms)
✔ the workflow names both Hermes checks and reports n/a when .hermes/ is absent (4.281291ms)
✔ the output block carries a generator repair line for each Hermes check (2.723625ms)
✔ the route stays read-only and never runs a mirror generator in write mode (5.105959ms)
✔ the contract fails when a Hermes line is removed from the route (5.566125ms)
✔ the contract fails when a Hermes asset, step or repair line leaves the workflow (11.393875ms)
✔ the contract fails when a step loses its n/a rule or names no surface (3.537625ms)
ℹ pass 7
ℹ fail 0
exit 0
```

## Each removed line, one at a time

```text
$ grep -v hermes/sync-skills-hermes.cjs <routes copy> > routes-no-sync-skills-hermes.yaml
$ DOCTOR_ROUTES_MANIFEST=routes-no-sync-skills-hermes.yaml node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs
✖ the route declares both Hermes checks in their check-only form (9.445666ms)
ℹ pass 6
ℹ fail 1
✖ the route declares both Hermes checks in their check-only form (9.445666ms)
exit 1

$ grep -v hermes/sync-skills-hermes.cjs <workflow copy> > workflow-no-sync-skills-hermes.yaml
$ DOCTOR_RUNTIME_MIRRORS_WORKFLOW=workflow-no-sync-skills-hermes.yaml node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs
✖ the workflow names both Hermes checks and reports n/a when .hermes/ is absent (4.673ms)
✖ the output block carries a generator repair line for each Hermes check (2.747959ms)
ℹ pass 4
ℹ fail 3
✖ the workflow names both Hermes checks and reports n/a when .hermes/ is absent (4.673ms)
✖ the output block carries a generator repair line for each Hermes check (2.747959ms)
exit 1

$ grep -v hermes/sync-prompts-hermes.cjs <routes copy> > routes-no-sync-prompts-hermes.yaml
$ DOCTOR_ROUTES_MANIFEST=routes-no-sync-prompts-hermes.yaml node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs
✖ the route declares both Hermes checks in their check-only form (9.4245ms)
ℹ pass 6
ℹ fail 1
✖ the route declares both Hermes checks in their check-only form (9.4245ms)
exit 1

$ grep -v hermes/sync-prompts-hermes.cjs <workflow copy> > workflow-no-sync-prompts-hermes.yaml
$ DOCTOR_RUNTIME_MIRRORS_WORKFLOW=workflow-no-sync-prompts-hermes.yaml node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs
✖ the workflow names both Hermes checks and reports n/a when .hermes/ is absent (4.742791ms)
✖ the output block carries a generator repair line for each Hermes check (2.682ms)
ℹ pass 4
ℹ fail 3
✖ the workflow names both Hermes checks and reports n/a when .hermes/ is absent (4.742791ms)
✖ the output block carries a generator repair line for each Hermes check (2.682ms)
exit 1

```

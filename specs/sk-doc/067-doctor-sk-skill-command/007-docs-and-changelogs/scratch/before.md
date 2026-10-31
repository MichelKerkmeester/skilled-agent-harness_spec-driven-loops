# Doc gates before any edit

Taken from the worktree at `worktrees/289-doctor-sk-skill-docs` before this phase changed a file.

| # | Gate | Command | Result | Exit |
|---|------|---------|--------|------|
| 1 | README references | `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py README.md .skilled/commands/doctor/scripts/README.markdown` | `SUMMARY files=2 pass=2 fail=0` | 0 |
| 2 | Root metadata | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | `checked=13 passed=13 failed=0 fixed=0` | 0 |
| 3 | Leaf manifest freshness | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` | `checked=13 fresh=13 failed=0` | 0 |
| 4 | Derived blocks | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs` | `checked=13 fresh=13 stale=0 errored=0` | 0 |
| 5 | Router intent signals | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` | `checked=7 hub(s), missing=0` then `RESULT: PASSED` | 0 |
| extra | Compiled-routing activation | `node .skilled/bin/compiled-route-sync.cjs --check` | `all 7 hubs resolve`, `all 55 served copies match their authored files` | 0 |

Two files this phase edits did not appear in the first row because the gate was run over the two READMEs the phase was expected to touch most. Measured later against the `HEAD` content of each file, with the working copy restored from a saved copy afterwards:

| File | Command over the `HEAD` content | Result | Exit |
|------|---------------------------------|--------|------|
| `.skilled/commands/README.txt` | `python3 .../check_readme_references.py .skilled/commands/README.txt` | `FAIL`, `unresolved=1`, line 211 `command 'specs/007-feature'` | 1 |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` | `python3 .../check_readme_references.py <playbook root>` | `FAIL`, `unresolved=5`, the section 9 test-module cells | 1 |

Both were failing before this phase. The phase repairs them because the gate has to exit 0 over every file it changes.

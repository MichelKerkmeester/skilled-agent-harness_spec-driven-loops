# Iteration 3: parent-skill-check.cjs rule 10a path fix

> dimension: correctness+regression | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P1] Canonical resolver breaks the rule 10 guard-chain test fixture**  
  `.opencode/commands/doctor/scripts/parent-skill-check.cjs:980`  
  Evidence: The checker now resolves tooling as `<target-parent>/sk-doc/create-skill/scripts`. However, `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs:54-64` creates `/tmp/parent-skill-check-leaf-manifest-*` and installs tooling inside `<target>/create-skill/scripts`. Static path evaluation confirms these become `/tmp/sk-doc/create-skill/scripts` versus `/tmp/parent-skill-check-leaf-manifest-*/create-skill/scripts`. Consequently, the clean-fixture assertion at lines 175-183 must fail 10a with “shared leaf-resource contract library/generator is missing.” The test was not executed because it writes temporary files, contrary to this review’s read-only constraint.  
  Fix: Create a temporary skills root containing sibling directories `<temp>/demo-hub` and `<temp>/sk-doc`; install the copied generator/library under `<temp>/sk-doc/create-skill/scripts`, generate the manifest through that copy, and update the stale comments at lines 13-17 and 58-59.

Adjacent observations: `node --check` passed. All seven actual parent hubs passed 10a/10b/10d, including an `sk-code` run from `.opencode/commands/doctor`; `sk-design` still has its documented pre-existing rule 6a failure.

Review status: REQUESTED_CHANGES

# Iteration 007 — Maintainability: sk-code-opencode drift guards and doc-claim checks
BINDING: target=Commits ba56b03412..5d9c970447 on main: the 37 commits of the sk-code Ponytail refinement epic, the merge 144b1d339e, then 9a74576ccc and 5d9c970447
BINDING: maxIterations=10
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=maintainability
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review
## Dimension
maintainability — sk-code-opencode drift guards and doc-claim checks: 817ff5b2a7, d2701afc3b, e9ecf8bb5f, 07189a66f8, 0da902346a. Ran run-all-drift-guards.sh live (exit 0), ran the six leaf-manifest and guard test suites live (42 tests, 0 fail), and checked the guards' prose claims against live behavior.
## Files Reviewed
| File | What was checked | Result |
|------|------------------|--------|
| .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:48 | full source read; live run of all four guards | exit 0, final line 'all 4 guards PASSED' while the alignment leg emitted 272
PYEXIT=0 [WARN] lines (R7-MNT-001) |
| .skilled/skills/sk-code/sk-code-opencode/scripts/README.md:12 | entrypoint and expected-output claims vs the live run | claims hold on exit/PASS lines; the warn-only gap is not disclosed in the summary contract |
| .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py:1 | its own warning policy note | 'warnings are non-blocking by default. Use --fail-on-warn to make warnings fail.' |
| .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs | live guard run (4/4 checks) + 12-case test run | all 4 checks PASS; 12/12 tests pass |
| .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs:16 | live guard run (5/5 checks) + gold path constant read | all 5 checks PASS; route-gold literal lives under a nested specs/ packet path |
| .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs | executed | 12 pass, 0 fail |
| .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs | executed | 5 pass, 0 fail |
| .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs | executed | 1 pass, 0 fail |
| .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs | executed | 1 pass, 0 fail |
| .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs | executed | pass, 0 fail |
| .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs | executed | 22 pass, 0 fail |
| .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:34 | HUBS closure list read | includes cli-classifier; replay passed, so the closure claim is refuted |
## Findings by Severity
### P0 Findings
None.
### P1 Findings
None.
### P2 Findings
1. **R7-MNT-001 — The single drift-guard entrypoint reports PASS while the alignment-drift leg emits 272
PYEXIT=0 non-blocking warnings because it never passes --fail-on-warn** — [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:48] — the entrypoint runs the alignment leg without --fail-on-warn, then prints 'PASS: alignment-drift' and 'run-all-drift-guards: all 4 guards PASSED' with exit 0; the verifier's own output says warnings are non-blocking by default and names --fail-on-warn as the strict switch. Live counts from a fresh run: 272
PYEXIT=0 [WARN] lines total, 25
SKEXIT=0 under sk-code/ and 25 under specs/sk-code/011. The README calls the script the one drift-guard entrypoint and documents the PASS lines as the success contract, so a reader of the aggregate result cannot tell a clean tree from a warned tree.
   Case: a contributor adds a file with a missing strict-mode or module header in an in-scope sk-code path; the guard prints a [WARN] line among ~272
PYEXIT=0, the umbrella still prints 'PASS: alignment-drift' and exits 0, and a completion gate reading the final line sees green.
   Finding class: contract clarity / observability (instance across one entrypoint)
   Scope proof: live run of the entrypoint (exit 0, final line 'run-all-drift-guards: all 4 guards PASSED') plus a direct count of the alignment leg's WARN lines; both inside the assigned focus directory .skilled/skills/sk-code/sk-code-opencode/scripts/
   Affected surface hints: ["scripts/run-all-drift-guards.sh","assets/scripts/verify_alignment_drift.py --check-router","scripts/README.md expected-output block"]
   Recommendation: either pass --fail-on-warn on the alignment leg (or a policy-selected subset) or make the umbrella summary print the warning count, so the entrypoint's final line distinguishes clean from warn-covered drift.
## Refuted Claim
The dispatched known item was: the leaf manifest tests show 26 pass 16 fail (cli-classifier closure, fixed-routing count 7 vs 6). It did NOT reproduce at HEAD. Live runs: generate-leaf-manifest-scopes.test.cjs 1 pass / 0 fail; generate-leaf-manifest-ignores.test.cjs 1 pass / 0 fail; leaf-resource-contract.test.cjs pass; leaf-route-replay.test.cjs 22 pass / 0 fail; verify_doc_claims.test.cjs 12 pass / 0 fail; verify_router_sync.test.cjs 5 pass / 0 fail — 42 green tests, 0 red. The cli-classifier closure is exercised live: leaf-route-replay.cjs line 34 lists cli-classifier among the seven HUBS and the replay suite passes. No check in the reviewed scripts computes a fixed-routing count of 6 or 7 (grep for fixed finds only an unrelated comment about a fixed path in router_replay_lib.cjs:192), so the '7 vs 6' part is neither confirmed nor confirmable in this scope.
## Traceability Checks
- core: spec_code pending; checklist_evidence pending (traceability dimension is assigned to the next iteration).
- overlay: skill_agent partial — the sk-code-opencode scripts README claims were cross-checked against the live guard behavior in this iteration; agent_cross_runtime pending; feature_catalog_code pending; playbook_capability partial — router-sync check 4 (playbook expected_resource emitted by the router) ran live and passed.
## Integration Evidence
- run-all-drift-guards.sh drives verify_alignment_drift.py --check-router, verify_stack_folders.py, verify_router_sync.cjs --checks 1a,1b,2,3,4 and verify_doc_claims.cjs; live run exit 0 with 4 PASS lines.
- verify_router_sync.test.cjs proves legs 1b and 2 on fixtures (5 pass, 0 fail); verify_doc_claims.test.cjs proves each check against known-bad input (12 pass, 0 fail).
- append-mode-event.cjs gateway: see receipt in the state log after this record; the projection remains gateway-owned.
## Edge Cases
- The worktree carries three pre-existing modified files (goal.md, spec.md, graph-metadata.json under the phase-011 parent) and the untracked 012 review packet; they predate this iteration and were not touched.
- The alignment-drift warning list is repo-wide (scratch and archived specs dominate); the finding scopes the ambiguity to the entrypoint's summary contract, not to each warning.
- The CI workflow .github/workflows/routing-registry-drift.yml was inspected only by grep; the claim that it carries the compiled side of checks 3 and 4 in warn-only mode is recorded under Not proven rather than as a finding.
## Confirmed-Clean Surfaces
- All four guards green in the live aggregate run; doc-claims 4/4, router-sync 5/5, both unit suites green (17 tests), the four leaf-manifest suites green (25 tests).
- Comment hygiene in the five focus scripts: no comment embeds a spec path, packet number or task id; the only spec-path literal is a code constant for the route-gold fixture at verify_router_sync.cjs:16.
- No source, config, registry, dashboard or mirror file was modified by this iteration.
## Ruled Out
- 'leaf manifest tests 26 pass 16 fail' — refuted by six live suite runs (42 pass, 0 fail). 26+16=42 suggests the claim was a projection over this same suite set, but every suite is green at HEAD.
- 'fixed-routing count 7 vs 6' — no such assertion exists in the reviewed focus paths; only a stale reading of 'fixed path' wording matches. Not a finding; no reproducer exists.
- Route-gold literal duplication: only one candidate file lists route-gold.typed.json outside the harness tooling, so no duplicated-constant finding is raised. The single literal's coupling to the nested specs/sk-doc packet path is a watch item only.
## Not Proven
- The README/entrypoint-comment claim that .github/workflows/routing-registry-drift.yml still covers the compiled side of checks 3 and 4 in warn-only mode: the workflow file exists and runs compiled-route-admission.cjs --all --warn-only, but whether that is exactly the same compiled-side coverage the retired router-sync suite had was not proven within this iteration's budget.
## Next Focus
- Dimension: traceability (core spec_code and checklist_evidence; overlay skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability).
- Focus area: the epic phase docs against commit evidence, and cross-runtime skill/agent surface parity for the sk-code family.
- Reason: maintainability is now covered; traceability is the last open dimension per the iteration focus plan at strategy line 245.
- Required evidence: named spec and implementation-summary claims with file:line refs and live-checkable commands; checklist rows resolved against the reviewed commit range.
Review verdict: PASS

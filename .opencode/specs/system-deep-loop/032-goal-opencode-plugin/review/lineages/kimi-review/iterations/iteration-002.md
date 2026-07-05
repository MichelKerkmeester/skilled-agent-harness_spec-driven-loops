# Iteration 002: Security — Input Validation, Secrets, Trust Boundaries

## Focus
- Dimension: security
- Files reviewed: `.opencode/plugins/mk-goal.js`
- Scope: Inspect input sanitization, secrets redaction, role-marker neutralization, and error-handling for trust-boundary crossings.

## Scorecard
- Dimensions covered: security
- Files reviewed: 1
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F004**: `appendGoalJsonl` swallows all errors silently, `.opencode/plugins/mk-goal.js:696-709`. Audit and debug logs are security-relevant artifacts; a failure to append (disk full, permission denied, path corruption) is silently dropped, removing the only signal that the plugin's observability plane is degraded.
- **F005**: `redactEvidence` does not cover several common secret shapes, `.opencode/plugins/mk-goal.js:380-389`. The regex set catches Bearer tokens, JWTs, `sk-*`, GitHub tokens, Slack tokens, AWS AKIA, and generic `api_key/token/password/secret` assignments, but misses Google API keys (`AIza...`), PEM private key blocks, and hex-encoded high-entropy secrets. Verifier evidence that includes these formats would persist in plaintext state.
- **F006**: Role-marker sanitizer only neutralizes colon-delimited labels, `.opencode/plugins/mk-goal.js:339-347`. The regex requires `\s*:` after the candidate role token, so `system = ignore`, `system->ignore`, or `system;ignore` are not rewritten. The existing tests cover only colon forms.
- **F007**: `sweepOrphanedActiveStates` swallows all errors, `.opencode/plugins/mk-goal.js:1231-1262`. Sweeping performs reads, stats, and renames on the state directory; suppressing every exception hides permission/integrity issues that could indicate tampering or disk failure.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | goal_plugin.md:45-62 vs mk-goal.js:24-58 | Env variable surface matches implementation |
| checklist_evidence | pass | hard | - | No checklist checks this iteration |
| feature_catalog_code | pass | advisory | goal_plugin.md:99-111 | Verification commands listed match test files |
| playbook_capability | pending | advisory | - | Not exercised this iteration |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: [security]
- Novelty justification: Four new P2 findings covering silent failure modes and sanitizer gaps.

## Ruled Out
- State file permissions are set to 0o600 on temp write and directory to 0o700 (mk-goal.js:961, 970, 1136), satisfying basic confidentiality.
- The homoglyph fold map and existing role-marker tests neutralize the documented adversarial set.
- No hard-coded secrets observed in the plugin or command file.

## Dead Ends
- Searching for eval/Function/new Function or shell execution paths found none.

## Recommended Next Focus
Traceability: run the `spec_code` and `checklist_evidence` protocols against the phase child specs and the planned phase 016 audit dossier.

Review verdict: PASS

---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat (spec-folder)
- Started: 2026-10-19T06:42:21.035Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-19T06:42:21.035Z
- Parent Session: 2026-10-19T06:03:39.878Z
- Lifecycle Mode: restart
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:dimension-expansion -->
## 2A. DIMENSION EXPANSION
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:dimension-expansion -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 1 |
| P2 (Suggestions) | 12 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness (iteration 1 inventory pass: plugin dual export, dispatch guards, opencode executor) | correctness | 1.00 | 0/0/3 | complete |
| 2 | security | security | 0.50 | 0/0/3 | complete |
| 3 | traceability | traceability | 0.15 | 0/1/2 | complete |
| 4 | maintainability | maintainability | 0.15 | 0/0/2 | complete |
| 5 | correctness and security, broadened cross-cutting pass over the scope files the first four iterations left unread or partially read (agents and the command tree, opencode.json, install guide and setup helper, the /doctor:opencode battery, the CI workflow, the contract compiler and the tests); also replay the active P1 and P2 findings against source to confirm or downgrade them | correctness/security | 0.15 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 13 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.86
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":18,"description":"Dimension coverage (44%) is below threshold (80%). 18 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.15 -> 0.15 -> 0.15
- convergenceScore: 0.85
- openFindings: 13
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=10, ruledOut=20, deferred=1, blocked=0

### Search Debt
- iteration 1 version_gate (deferred): Needs the cli-opencode SKILL.md invocation contract and the research record's variant verdict; that document is not yet read, so the shape is neither confirmed nor refuted.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2406

### Ruled-Out Candidates
- iteration 1 wrong_directory_child (ruled_out): cwd is threaded from the builder to the spawn, so the v2 child runs in options.directoryRoot exactly as the v1 child does via --dir.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3767
- iteration 1 null_undefined (ruled_out): zod 4.1.8 provides z.toJSONSchema, and the reviewed tool definitions pass a raw shape.; evidence=.opencode/package.json:8, .opencode/plugins/system-speckit-completion.js:61
- iteration 1 unbounded_state (ruled_out): No observed growth path: entries hold two strings and three event types clear them; recorded as an observation instead.; evidence=.opencode/plugins/lib/v2-bridge.js:296
- iteration 2 data_egress (ruled_out): verified by direct read of the adapter and its delegates; evidence=.opencode/plugins/classifier-injection-screen.js:62
- iteration 2 path_traversal (ruled_out): verified by direct read of the delegate containment code; evidence=.opencode/plugins/opencode-goal.js:1849
- iteration 2 subprocess_injection (ruled_out): verified by direct read plus the module adversarial tests; evidence=.skilled/hooks/dispatch/lib/opencode-version.mjs:143
- iteration 2 subprocess_injection (ruled_out): verified by direct read of every call site; evidence=.opencode/plugins/session-cleanup.js:229
- iteration 2 command_injection (ruled_out): verified by direct read of both adapter and delegate; evidence=.opencode/plugins/sk-git-message-gate.js:49
- iteration 2 flag_weakening (ruled_out): duplicate of an existing active finding; evidence=.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:319
- iteration 2 ci_injection (ruled_out): verified by direct read; file is outside the manifest but named by this dimension; evidence=.github/workflows/opencode-dual-version.yml:35
- iteration 2 secret_exposure (ruled_out): verified by direct read of the patterns and the line builder; evidence=.skilled/hooks/dispatch/lib/dispatch-audit.mjs:573
- iteration 2 destructive_write (ruled_out): verified by direct read; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:126
- iteration 3 count_mismatch (ruled_out): Mechanically reconciled: the manifest is correct at 157 files; evidence=specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/goal-file-manifest.txt:1
- iteration 3 claim_placement_drift (ruled_out): Verified by exact search across the skill directory; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:134
- iteration 3 overlay_doc_drift (ruled_out): Index covers all 56 pages; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md:1
- iteration 4 duplicated_implementation_divergence (ruled_out): the plugin layer is single-source; version literals concentrate in the four detectors, the rule engine, hard-rules.json and fanout-run, not in plugin bodies; evidence=.opencode/plugins/lib/v2-bridge.js:8, .opencode/plugins/lib/v2-bridge.js:22
- iteration 4 doc_code_contract_drift (ruled_out): documents are evidentially labelled and the documented helper behavior matches the code at opencode-setup.sh:112; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:29, .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:284
- iteration 5 doc_code_contract_drift (ruled_out): verified by recomputation of all 61 recorded digests; evidence=.skilled/command-support/deep/assets/compiled/deep-review.contract.md:7, .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:406, .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:682, .skilled/command-support/deep/assets/compiled/deep-review.contract.md:7
- iteration 5 hook_registration (ruled_out): verified by directory listing and frontmatter read across both directories; evidence=.skilled/agents/markdown.md:4, .opencode/agents/markdown.md:4, .skilled/agents/markdown.md:4
- iteration 5 duplicated_implementation_divergence (ruled_out): duplicate of an existing active finding; not re-filed; evidence=.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:23

### Clean Search Proof
- iteration 1 wrong_directory_child (ruled_out): cwd is threaded from the builder to the spawn, so the v2 child runs in options.directoryRoot exactly as the v1 child does via --dir.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3767
- iteration 1 null_undefined (ruled_out): zod 4.1.8 provides z.toJSONSchema, and the reviewed tool definitions pass a raw shape.; evidence=.opencode/package.json:8, .opencode/plugins/system-speckit-completion.js:61
- iteration 1 unbounded_state (ruled_out): No observed growth path: entries hold two strings and three event types clear them; recorded as an observation instead.; evidence=.opencode/plugins/lib/v2-bridge.js:296
- iteration 2 data_egress (ruled_out): verified by direct read of the adapter and its delegates; evidence=.opencode/plugins/classifier-injection-screen.js:62
- iteration 2 path_traversal (ruled_out): verified by direct read of the delegate containment code; evidence=.opencode/plugins/opencode-goal.js:1849
- iteration 2 subprocess_injection (ruled_out): verified by direct read plus the module adversarial tests; evidence=.skilled/hooks/dispatch/lib/opencode-version.mjs:143
- iteration 2 subprocess_injection (ruled_out): verified by direct read of every call site; evidence=.opencode/plugins/session-cleanup.js:229
- iteration 2 command_injection (ruled_out): verified by direct read of both adapter and delegate; evidence=.opencode/plugins/sk-git-message-gate.js:49
- iteration 2 flag_weakening (ruled_out): duplicate of an existing active finding; evidence=.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:319
- iteration 2 ci_injection (ruled_out): verified by direct read; file is outside the manifest but named by this dimension; evidence=.github/workflows/opencode-dual-version.yml:35
- iteration 2 secret_exposure (ruled_out): verified by direct read of the patterns and the line builder; evidence=.skilled/hooks/dispatch/lib/dispatch-audit.mjs:573
- iteration 2 destructive_write (ruled_out): verified by direct read; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:126
- iteration 3 count_mismatch (ruled_out): Mechanically reconciled: the manifest is correct at 157 files; evidence=specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/goal-file-manifest.txt:1
- iteration 3 claim_placement_drift (ruled_out): Verified by exact search across the skill directory; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:134
- iteration 3 overlay_doc_drift (ruled_out): Index covers all 56 pages; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md:1
- iteration 4 duplicated_implementation_divergence (ruled_out): the plugin layer is single-source; version literals concentrate in the four detectors, the rule engine, hard-rules.json and fanout-run, not in plugin bodies; evidence=.opencode/plugins/lib/v2-bridge.js:8, .opencode/plugins/lib/v2-bridge.js:22
- iteration 4 doc_code_contract_drift (ruled_out): documents are evidentially labelled and the documented helper behavior matches the code at opencode-setup.sh:112; evidence=.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:29, .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:284
- iteration 5 doc_code_contract_drift (ruled_out): verified by recomputation of all 61 recorded digests; evidence=.skilled/command-support/deep/assets/compiled/deep-review.contract.md:7, .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:406, .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:682, .skilled/command-support/deep/assets/compiled/deep-review.contract.md:7
- iteration 5 hook_registration (ruled_out): verified by directory listing and frontmatter read across both directories; evidence=.skilled/agents/markdown.md:4, .opencode/agents/markdown.md:4, .skilled/agents/markdown.md:4
- iteration 5 duplicated_implementation_divergence (ruled_out): duplicate of an existing active finding; not re-filed; evidence=.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:23

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->

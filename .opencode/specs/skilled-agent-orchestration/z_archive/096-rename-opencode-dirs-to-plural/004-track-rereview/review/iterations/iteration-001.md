# Deep Review Iteration 001 - Inventory

## Dimension

inventory

This pass replayed the 097 closed-gate findings against the 098 remediation packet. The predecessor registry is not numerically contiguous: `P1-001` was normalized to `P0-001`, `P1-005` was downgraded into the P2 bucket, and the active P1 set runs through `P1-014`. I used the 22 IDs actually present in the 097 report.

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/review-report.md:214`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild/spec.md:50`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/002-sk-deep-token-replace/implementation-summary.md:52`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/003-narrative-validation-repair/implementation-summary.md:47`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/004-hooks-resolver-tighten/implementation-summary.md:43`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/005-checklist-evidence/implementation-summary.md:49`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/implementation-summary.md:44`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/007-p2-doc-drift/implementation-summary.md:46`
- `.opencode/skills/sk-code-review/references/review_core.md:22`

## Closed-Gate Replay Table

| 097 ID | Claimed 098 phase | Replay verdict | Evidence |
| --- | --- | --- | --- |
| P0-001 | 001-dist-rebuild | RESOLVED | `index-scope-policy.ts:15-17` and `dist/code_graph/lib/index-scope-policy.js:13-15` both use plural `.opencode/skills`, `.opencode/agents`, `.opencode/commands`; 001 spec claims P0-001 at `001-dist-rebuild/spec.md:50`. |
| P1-002 | 002-sk-deep-token-replace | RESOLVED | `rg sk-deep-(review\|research)` across command assets and runtime agent mirrors returned no hits; 002 summary claims P1-002 at `002-sk-deep-token-replace/implementation-summary.md:52`. |
| P1-003 | 006-skill-advisor-python | RESOLVED | Advisor state now points to `.opencode/skills/.advisor-state` in source/dist at `generation.ts:12` and `generation.js:9`; no root `.opencode/skill` directory was present. |
| P1-004 | 003-narrative-validation-repair | RESOLVED | `validate.sh .../096-rename-opencode-dirs-to-plural --strict` exited 0; 003 summary cites the anchor fix at `003-narrative-validation-repair/implementation-summary.md:58`. |
| P1-005 | 004-hooks-resolver-tighten | DOWNGRADED | 004 intentionally deferred resolver realpath containment at `004-hooks-resolver-tighten/implementation-summary.md:83` and `:117`; resolver still path-resolves without containment at `shared/review-research-paths.cjs:200-203`. |
| P1-006 | 004-hooks-resolver-tighten | RESOLVED | Hook source gates `SPECKIT_GENERATE_CONTEXT_SCRIPT` to `NODE_ENV=test` or `SPECKIT_TEST=true` at `session-stop.ts:39-46`; dist mirrors it at `dist/hooks/claude/session-stop.js:29-35`. |
| P1-007 | 005-checklist-evidence | STILL_ACTIVE | Deferral notes exist at `094.../checklist.md:138` and related checklists, but complete packets still carry unchecked CHK items, e.g. `094.../checklist.md:47-120`, while `094.../graph-metadata.json:34-35` remains complete/100. |
| P1-008 | 002-sk-deep-token-replace | RESOLVED | No `sk-deep-*` or `skills/sk-deep` hits remain across `.opencode/agents`, `.codex/agents`, `.gemini/agents`, `.claude/agents`; 002 summary claims P1-008 at `002-sk-deep-token-replace/implementation-summary.md:52`. |
| P1-009 | 002-sk-deep-token-replace | RESOLVED | Codex review doctrine now says FAIL/BLOCK requires P0 or unresolved P1 and P1 must be fixed before pass at `.codex/agents/review.toml:412-415`; mirrors match at `.opencode/.gemini/.claude`. |
| P1-010 | 003-narrative-validation-repair | RESOLVED | 096 child specs now restore singular-to-plural source state, e.g. `001-skills/spec.md:2-3`, `002-agents/spec.md:2-3`, `003-commands/spec.md:2-3`; no plural-to-plural rename tautology hit remained. |
| P1-011 | 002-sk-deep-token-replace | RESOLVED | No `sk-deep-research` hit remains in `.opencode/agents/orchestrate.md` or runtime mirrors; 002 summary claims P1-011 at `002-sk-deep-token-replace/implementation-summary.md:52`. |
| P1-012 | 002-sk-deep-token-replace | RESOLVED | Confirm-mode and auto-mode deep-loop YAML assets have no `sk-deep-*` hits; 002 summary claims P1-012 at `002-sk-deep-token-replace/implementation-summary.md:52`. |
| P1-013 | 003-narrative-validation-repair | RESOLVED | `check-smart-router.sh` now scans `.opencode/skills` at line 68 and fails zero-coverage at line 347; 003 summary claims P1-013 at `003-narrative-validation-repair/implementation-summary.md:62`. |
| P1-014 | 006-skill-advisor-python | RESOLVED | `audit_descriptions.py` uses plural bases at lines 157, 185, and 220; `skill_advisor.py` native constants use `.opencode/skills/system-spec-kit` at lines 56-83. |
| P2-001 | 007-p2-doc-drift | RESOLVED | `rg '\.opencode/(skill\|agent\|command)/\|sk-deep-'` over `.opencode/install_guides` and root public docs returned no hits; 007 summary claims P2-001 at `007-p2-doc-drift/implementation-summary.md:46`. |
| P2-002 | 001-dist-rebuild | STILL_ACTIVE | Generated test surface still references singular `.opencode/skill` at `dist/code_graph/tests/code-graph-indexer.vitest.js:409`; source counterpart remains at `code_graph/tests/code-graph-indexer.vitest.ts:552`. |
| P2-003 | 007-p2-doc-drift | RESOLVED | Public root docs and install guides are clean for singular paths; 007 reclassified Barter as gitignored/out-of-scope at `007-p2-doc-drift/implementation-summary.md:67`. |
| P2-004 | 007-p2-doc-drift | STILL_ACTIVE | 007 explicitly deferred P2-004 at `007-p2-doc-drift/implementation-summary.md:69` and `:129`; YAML still references `buildCopilotPromptArg`/target authority at `spec_kit_deep-review_auto.yaml:690` and `:744`. |
| P2-005 | 007-p2-doc-drift | RESOLVED | Nested-fence grep over `.opencode/skills/cli-opencode/manual_testing_playbook` returned no hits; 007 summary records already-clean status at `007-p2-doc-drift/implementation-summary.md:71`. |
| P2-006 | 005-checklist-evidence | RESOLVED | 093 phase parent now has `Supersession Notice (Packet 098/005 Resolution)` at `093.../spec.md:142`; 005 summary claims P2-006 at `005-checklist-evidence/implementation-summary.md:66`. |
| P2-007 | 007-p2-doc-drift | RESOLVED | Install guides have no `sk-deep-review` or `sk-deep-research` hits; 007 summary treats inventory drift as covered by P2-001 at `007-p2-doc-drift/implementation-summary.md:73`. |
| P2-008 | 001-dist-rebuild | STILL_ACTIVE | Dist/source still carry singular schema/default text outside the fixed code-graph policy, e.g. `tool-schemas.ts:578-581`, `tool-schemas.ts:700`, `dist/tool-schemas.js:517-520`, and `dist/tool-schemas.js:633`. |

## Findings by Severity

### P0

None reopened in this inventory pass.

### P1

#### P1-007 [P1] Checklist evidence remains unchecked on complete packets

- File: `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:47`
- Claim: 098/005 made the gap explicit but did not backfill evidence or relabel all completed packets as not completion-verified.
- Evidence refs: `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:47-120`, `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:138`, `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/graph-metadata.json:34-35`.
- Counterevidence sought: deferral notes across all 7 cited checklists, plus graph status changes that would relabel completion state.
- Alternative explanation: The remediation intentionally treated explicit deferral as enough. Under review_core P1 semantics and the project checklist evidence rule, complete/100 with unchecked required CHK items is still a required traceability gap.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: Change affected packets' graph/status semantics to not completion-verified, or backfill required checklist evidence with concrete citations.

### P2

#### P1-005 [P2] Resolver containment remains deferred

- File: `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:200`
- Evidence: 098/004 explicitly deferred containment as advisory; resolver still returns roots from `path.resolve(specFolder)` without a post-resolution `.opencode/specs/` containment assertion.
- Replay status: DOWNGRADED.

#### P2-002 [P2] Generated test fixture wording still carries singular skill path

- File: `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js:409`
- Evidence: Source and dist tests still mention `.opencode/skill` candidates.
- Replay status: STILL_ACTIVE.

#### P2-004 [P2] Copilot target-authority helper remains unresolved

- File: `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:690`
- Evidence: 098/007 deferred the finding, and the YAML still references `buildCopilotPromptArg` plus the target-authority preamble.
- Replay status: STILL_ACTIVE.

#### P2-008 [P2] Singular schema/default text remains beyond code-graph policy

- File: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:578`
- Evidence: Source and dist tool schemas still document singular `.opencode/skill`, `.opencode/agent`, and `.opencode/command` paths.
- Replay status: STILL_ACTIVE.

## Traceability Checks

| Protocol | Status | Evidence |
| --- | --- | --- |
| spec_code | pass | P0 runtime code-graph policy source and dist now match plural paths; 096 strict validation exits 0. |
| checklist_evidence | fail | `094.../graph-metadata.json:34-35` is complete/100 while `094.../checklist.md:47-120` remains unchecked. |
| skill_agent | pass | `sk-deep-*` sweep over command YAML and runtime agent mirrors returned no hits. |
| agent_cross_runtime | pass | Review doctrine P1-blocking language is aligned across `.opencode`, `.codex`, `.gemini`, and `.claude` mirrors. |
| feature_catalog_code | partial | Advisor and doctor path constants are plural, but tool schema text still advertises singular roots. |
| playbook_capability | pass | cli-opencode nested-fence replay returned no hits; 093 supersession notice now points to 094 ADR context. |

## Verdict

FAIL.

The P0 is closed, and most P1 remediation is credible. The verdict does not flip because P1-007 remains active: documented deferral is better than silence, but the complete packet state still conflicts with unchecked required checklist evidence. P2-002, P2-004, P2-008, and downgraded P1-005 should feed later iterations as advisory or deferred rows.

## Next Dimension

correctness

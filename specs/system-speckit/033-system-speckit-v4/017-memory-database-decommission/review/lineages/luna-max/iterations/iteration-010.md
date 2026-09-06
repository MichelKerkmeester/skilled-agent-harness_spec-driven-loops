# Iteration 10: Final adversarial replay

## Dispatcher

- Target agent: `deep-review`.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Agent definition loaded: yes.
- Execution mode: autonomous inline executor; no nested dispatch.
- This is the configured hard ceiling. Convergence signals are recorded as telemetry; no early synthesis was performed.

## Dimension

Final replay across correctness, security, traceability, and maintainability. The pass replayed every active finding, every required bug class, the parent/child completion seams, the runtime reader/writer boundary, and the release-environment handoff. The target remained read-only.

## Files Reviewed

- `.opencode/specs/system-speckit/049-memory-decommission/spec.md:56-201`
- `.opencode/specs/system-speckit/049-memory-decommission/goal.md:84-147`
- `.opencode/specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:70-76`
- `.opencode/specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/tasks.md:188-194`
- `.opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/acceptance-criteria.md:62-70`
- `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/implementation-summary.md:203-213`
- `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:267-275`
- `.opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md:61-73`
- `.opencode/specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/tasks.md:61-74`
- `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:71-207`
- `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:369-403`
- `.opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:520-636`

## Findings by Severity

### P0

None found. The replay found no evidence of an active P0 security, data-loss, or production-integrity failure.

### P1

- **F001 — Trigger-index reader accepts malformed postings and can return incomplete results.** The reader accepts a parsed index after only shallow top-level checks, then silently skips non-array postings and missing path IDs during lookup [SOURCE: `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:71-178`]. The generator performs stronger posting-shape validation before publication, but the reader boundary and the committed artifact can still diverge, and the focused tests do not exercise a malformed committed index [SOURCE: `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:369-403`; `.opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:520-636`]. `findingClass=contract-mismatch`; `scopeProof=the replacement retrieval reader and its committed index contract`; `affectedSurfaceHints=[trigger-index-reader, committed-index, gate1-retrieval]`; `content_hash=1111111111111111111111111111111111111111111111111111111111111111`.
- **F002 — Research fold-in gates remain open while the parent declares the research integrated.** The parent phase map and progress statement describe the research amendments/worklists as folded into build phases, while T013 remains unchecked in both research task packets [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md:61-73`; `.opencode/specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/tasks.md:61-74`; `.opencode/specs/system-speckit/049-memory-decommission/spec.md:156-184`]. `findingClass=traceability-drift`; `scopeProof=target spec-folder phase handoff and research closure documents`; `affectedSurfaceHints=[phase-005-fold-in, phase-006-fold-in, parent-phase-map]`; `content_hash=2222222222222222222222222222222222222222222222222222222222222222`.
- **F003 — Phase completion gates contradict the completed status.** The phase map marks the build phases complete, but the completion-criteria sections in phases 001 and 002 still leave the all-tasks, no-blockers, and manual-verification rows unchecked [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:70-76`; `.opencode/specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/tasks.md:188-194`; `.opencode/specs/system-speckit/049-memory-decommission/spec.md:156-161`]. `findingClass=traceability-drift`; `scopeProof=target spec-folder closure documents only`; `affectedSurfaceHints=[phase-001-closure, phase-002-closure, parent-phase-map]`; `content_hash=3333333333333333333333333333333333333333333333333333333333333333`.
- **F004 — Parent exact-zero residue criterion is closed despite literal matches.** The parent completion criterion requires an exact zero-hit retired-prefix search, while its DONE WHEN evidence records retained matches and closes the row under a narrower live-surface interpretation [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/goal.md:84-98`; `.opencode/specs/system-speckit/049-memory-decommission/goal.md:124-132`]. `findingClass=traceability-drift`; `scopeProof=target spec-folder completion criterion and recorded repository scan`; `affectedSurfaceHints=[parent-completion-criterion, retired-prefix-residue, historical-allowlist]`; `content_hash=4444444444444444444444444444444444444444444444444444444444444444`.

### P2

- **F005 — Report-only exception debt has no named owner or expiry.** Phase 004 records residual warning/refusal classes and says escalation follows owner fixes, but the packet supplies no owner, due date, expiry, or renewal checkpoint [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/implementation-summary.md:203-213`; `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:267-275`; `.opencode/specs/system-speckit/049-memory-decommission/goal.md:141-147`]. `findingClass=documentation-debt`; `scopeProof=phase exception accounting and parent decision log`; `affectedSurfaceHints=[exception-inventory, owner-assignment, expiry-policy]`; `content_hash=5555555555555555555555555555555555555555555555555555555555555555`.
- **F006 — Main-checkout model-server dependency remains an explicit release-readiness caveat.** The parent records that the main checkout lacks `onnxruntime-common`, while phase 003 records live advisor/model-server acceptance evidence from the worktree environment [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/goal.md:141-142`; `.opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/acceptance-criteria.md:62-70`]. `findingClass=deployment-readiness`; `scopeProof=target spec-folder host caveat and phase-003 live evidence`; `affectedSurfaceHints=[main-checkout-node-modules, shared-model-server, release-handoff]`; `content_hash=6666666666666666666666666666666666666666666666666666666666666666`.

No new finding was introduced by the final replay. F001-F006 were all re-read and reaffirmed with the same severity and content hash; no finding was resolved by evidence available in the target packet.

## Adversarial Claim Adjudication

The following typed packets record the final replay of the active P1 claims. Each packet sought counterevidence and retained the severity because the target still contains direct contradictory evidence.

```json
{"claim":"A parseable but structurally invalid committed trigger index can be accepted by the reader and yield an incomplete lookup result without forcing regeneration.","evidenceRefs":[".opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:71-178",".opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:369-403",".opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:520-636"],"counterevidenceSought":["reader-malformed-index-test","committed-index-integrity-receipt"],"alternativeExplanation":"The publication generator may be the only trusted writer, but the reader does not enforce that assumption at its input boundary.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"none"}
{"claim":"The parent cannot claim research amendments and worklists were folded while both research packets leave their fold-in task open.","evidenceRefs":[".opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md:61-73",".opencode/specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/tasks.md:61-74",".opencode/specs/system-speckit/049-memory-decommission/spec.md:156-184"],"counterevidenceSought":["phase-005-fold-in-receipt","phase-006-fold-in-receipt"],"alternativeExplanation":"The unchecked rows could be stale checklist residue, but no packet evidence identifies them as intentionally superseded.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"none"}
{"claim":"The phase-001 and phase-002 completion sections leave required closure rows open despite the parent phase map marking those phases complete.","evidenceRefs":[".opencode/specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:70-76",".opencode/specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/tasks.md:188-194",".opencode/specs/system-speckit/049-memory-decommission/spec.md:156-161"],"counterevidenceSought":["phase-001-manual-verification-receipt","phase-002-manual-verification-receipt"],"alternativeExplanation":"The sections may be reusable template gates, but the documents do not label them informational or superseded.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"none"}
{"claim":"The parent records literal retired-prefix matches while its completion criterion requires an exact zero-hit result.","evidenceRefs":[".opencode/specs/system-speckit/049-memory-decommission/goal.md:84-98",".opencode/specs/system-speckit/049-memory-decommission/goal.md:124-132"],"counterevidenceSought":["approved-retained-residue-allowlist","revised-zero-hit-criterion"],"alternativeExplanation":"The narrower live-surface interpretation may be the intended policy, but it is not the literal predicate written in the completion criterion.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"none"}
```

## Traceability Checks

| Protocol | Result | Evidence |
| --- | --- | --- |
| `dimension-coverage` | pass | All four configured dimensions were replayed in this final pass. |
| `spec-code` | fail | Parent completion claims and child closure rows remain contradictory [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/spec.md:156-184`; `.opencode/specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:70-76`]. |
| `checklist-evidence` | fail | Research fold-in rows and phase completion rows remain unchecked [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md:61-73`; `.opencode/specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/tasks.md:188-194`]. |
| `trigger-index-structural-validation` | fail | The generator validates postings, but the reader does not validate the same closed shape before lookup [SOURCE: `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:71-178`; `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:369-403`]. |
| `security-boundary` | pass | The final replay found no distinct credential, path-traversal, or trust-boundary defect; malformed posting handling remains F001 rather than a second security finding. |
| `host-environment-parity` | partial | The packet distinguishes the successful worktree evidence from the unresolved main-checkout dependency caveat [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/goal.md:141-142`; `.opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/acceptance-criteria.md:62-70`]. |
| `resource-map` | not-applicable | No root `resource-map.md` was present when the lineage was initialized. |

## Ruled-Out Directions

- No new P0 was found after replaying all active P1/P2 evidence.
- No separate unsafe-input finding was split from F001; the malformed-posting behavior is the same reader contract seam.
- No separate state-integrity finding was opened for the document contradictions; those are already represented by F002-F004.
- No resource-map coverage finding was opened because the target packet had no resource map at initialization.

## Verdict

The review is **conditional**: no P0 is active, but four P1 findings and two P2 findings remain open. The max-iterations policy has reached its hard ceiling, so this iteration is terminal telemetry rather than evidence of convergence. Release readiness is not established by this review packet.

## Next Dimension

None. The loop has reached iteration 10 and must enter phase_synthesis with the six active findings, the failed traceability gates, and the legacy v2-shape warnings from iterations 1-9 preserved as historical evidence.

Review verdict: CONDITIONAL

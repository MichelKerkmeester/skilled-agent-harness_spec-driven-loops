# Deep Review — Iteration 2 of 5

## Dimension
Security: reconcile the stated write boundary with the run evidence and the authorized scope.

## Files Reviewed
- specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:166
- specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:71
- specs/sk-code/014-code-modes-research/spec.md:33,102,125
- specs/sk-code/014-code-modes-research/spec.md:112
- specs/sk-code/014-code-modes-research/goal.md:50
- specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-state.jsonl:3,15,23

## Findings by Severity

### P0 Findings
None.

### P1 Findings
1. **The P0 write-boundary checklist is marked met while its evidence records spec.md writes** — CHK-031 is checked at P0 and says the run wrote no file outside research/, but its evidence cell says the workflow made bounded spec.md edits. The parent spec and child implementation summary confirm those edits were allowed and occurred. The checklist therefore does not prove its claimed boundary and can leave a false security attestation marked met. [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:166] [SOURCE: specs/sk-code/014-code-modes-research/spec.md:112] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:71]

   - Case: The criterion is absolute, while its evidence describes writes outside research/.
   - Evidence: CHK-031 says no file outside research/ was written; the parent spec allows bounded spec.md edits; the phase summary records the workflow's spec.md edits.
   - User impact: A reviewer may rely on a P0 security check that does not establish the boundary it claims to establish.
   - Finding class: checklist-evidence-integrity.
   - Scope proof: The mismatch is in the phase task evidence and the parent scope contract; no reviewed file was changed during this review.
   - Affected surfaces: security checklist, write-boundary evidence, phase closeout.
   - Recommendation: Rewrite CHK-031 to distinguish permitted bounded spec.md changes from prohibited writes, then record the actual path-level evidence for both.

   Claim adjudication:
~~~json
{"findingId":"R2-P1-001","claim":"CHK-031 is marked met despite its own evidence recording bounded spec.md writes outside research/.","evidenceRefs":["specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:166","specs/sk-code/014-code-modes-research/spec.md:112","specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:71"],"counterevidenceSought":"Check whether CHK-031 is explicitly limited to unapproved writes or whether the spec.md changes happened outside the run.","alternativeExplanation":"The task may intend to exclude approved bounded spec.md edits, but its criterion text does not say so and the evidence does not show path-level containment.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"If a source decision narrows CHK-031 to unauthorized writes and the run log proves every spec.md edit was explicitly authorized, downgrade the finding to P2."}
~~~

Active from iteration 1: R1-P1-001 remains open; the ten-versus-fifteen goal drift is unchanged.

### P2 Findings
None.

## Traceability Checks
- checklist_evidence: partial. The checked P0 criterion and its evidence use incompatible write boundaries; no path-level evidence reconciles them.
- Scope authorization: the parent spec expressly permits bounded spec.md edits, so this review found a checklist wording/evidence defect, not proof of an unauthorized write.

## Search Ledger
- security_claim_integrity: finding R2-P1-001; compared task, parent scope, and phase summary.
- unapproved_external_write: ruled out on reviewed evidence; the bounded spec.md edits are authorized by the parent scope. This does not establish the absence of every other write.
- credential_exposure: deferred; credential scanning was not rerun in this review.

## Workflow Notes
- steer.md was checked before this iteration; it is absent.
- R1-P1-001 remains active. New finding ratio is measured against the two active P1 findings.
- The run continues through all five iterations regardless of convergence telemetry.

## Verdict
Review verdict: CONDITIONAL
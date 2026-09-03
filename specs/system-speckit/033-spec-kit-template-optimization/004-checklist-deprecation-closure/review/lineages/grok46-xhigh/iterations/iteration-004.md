---
title: "Iteration 4: D4 Maintainability — stale templates, fingerprints, broadening replay"
trigger_phrases: []
---
# Iteration 4: D4 Maintainability — stale templates, fingerprints, broadening replay

## Focus
Dimension: maintainability, with a broadening replay of iteration-1 P1s because `stopPolicy=max-iterations` treats earlier convergence as telemetry. Also tasks.md frontmatter, all-zero continuity fingerprints, and plan.md quality-gate checkboxes.

## Scorecard
- Dimensions covered: maintainability (replay also touched correctness/traceability)
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=3 P2=2
- New findings ratio: 0.18

## Findings

### P0, Blocker
- None.

### P1, Required
- None new. Replay: F001, F002, F003 still present at the same file:line locations.

### P2, Suggestion
- **F009**: tasks.md frontmatter description is the same GOAL_SHAPE copy as plan.md, `specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/tasks.md:3`, [Evidence: description field is "A present-file rule that checks a goal document's shape: its durable and log headings..." identical to `plan.md:8`. Trigger phrases are `goal validator`, `durable slice cap`, `binding block check` (`tasks.md:5-7`). That vocabulary belongs to packet 042, not this evidence-source fix. Related to F001; separate because tasks.md is a second canonical doc a search agent would trust.]
- **F010**: session_dedup fingerprints are the all-zero placeholder across packet docs, `specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/spec.md:24`, [Evidence: `sha256:0000…0000` in spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md, and goal.md. Continuity freshness is off unless `SPECKIT_COMPLETION_FRESHNESS` is set; still a resume/dedup landmine.]

## Claim adjudication

F001–F003 replayed against the same citations as iteration 1. No downgrade.

```json
{
  "findingId": "F001",
  "claim": "plan.md still specifies GOAL_SHAPE rather than AC_COVERAGE.",
  "evidenceRefs": [
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/plan.md:8",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/plan.md:78"
  ],
  "counterevidenceSought": "Re-read plan.md after iterations 2–3. No edit (review is observation-only). Architecture §3 unchanged.",
  "alternativeExplanation": "Same as iteration 1; still rejected.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Unchanged from iteration 1.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" },
    { "iteration": 4, "from": "P1", "to": "P1", "reason": "Broadening replay confirmed" }
  ]
}
```

```json
{
  "findingId": "F009",
  "claim": "tasks.md YAML description and trigger phrases still advertise a goal validator.",
  "evidenceRefs": [
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/tasks.md:3",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/tasks.md:5",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/plan.md:8"
  ],
  "counterevidenceSought": "Compared tasks.md body (T001–T012) which correctly describe AC_COVERAGE work. Body is right; frontmatter is the stale 042 template.",
  "alternativeExplanation": "Frontmatter is unused by validators. Still a search/resume footgun; P2 not P1 because the T-list is accurate.",
  "finalSeverity": "P2",
  "confidence": 0.9,
  "downgradeTrigger": "If frontmatter description and triggers are rewritten to coverage-source vocabulary, drop.",
  "transitions": [
    { "iteration": 4, "from": null, "to": "P2", "reason": "Initial discovery" }
  ]
}
```

## Traceability Checks
- spec_code: still partial (F001–F003).
- checklist_evidence: still partial (F007).
- Overlays unchanged from iteration 3.
- Resource map: skipped (absent at init).

## Maintainability notes that did not become findings
- plan.md Definition of Ready/Done checkboxes are all `[ ]` (`plan.md:60-67`) after a Complete status. Folded into F003 rather than a new ID.
- `bash -n` remains clean; 14 test case names still match AC-007's claim. Suite not executed.

## Adversarial self-check
- Hunter: re-read F001–F003 sites; tasks.md:1-28; spec.md:24.
- Skeptic: F009 is the same copy-paste as F001 in a second file. Kept separate P2 so remediation can edit tasks.md without waiting on a full plan rewrite, but synthesis should treat them as one workstream.
- Referee: still no P0. Three active P1s. Iteration itself is P2-only → PASS.

## Next Dimension
None. maxIterations 4 reached. Proceed to synthesis.

Review verdict: PASS

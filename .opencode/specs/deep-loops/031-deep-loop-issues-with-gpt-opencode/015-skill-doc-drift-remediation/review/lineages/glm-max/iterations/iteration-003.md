# Iteration 3: Traceability / Spec-Alignment — REQ acceptance + internal contradiction hunt

## Focus
Traceability dimension. Cross-check REQ-001..005 acceptance criteria against actual repo state, and hunt for internal contradictions *between* cli-opencode's living docs (the phase edited `manual_testing_playbook.md`). REQ-001's scoped grep is satisfied literally, but the *intent* of Cluster 1 (eliminate ai-council-is-directly-invokable confusion) must be examined across all framing, not just the literal `--agent ai-council` token.

## Scorecard
- Dimensions covered: traceability (full); REQ-001..005 mapped
- Files reviewed: 7 (spec.md REQs; checklist.md; cli-opencode SKILL.md/playbook.md/agent_delegation.md; .opencode/agents/ai-council.md registry)
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50 (P0 override floor not triggered; one new P1 weighted 5.0 / ~10.0 cumulative)

## Findings

### P1, Required
- **F001**: Residual ai-council "primary" classification contradicts Cluster 1's intent, SKILL.md, and the agent registry, `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:362`. Line 362 states: "cli-opencode distinguishes 4 primary agents (directly invokable via `--agent`: general + plan as OpenCode built-ins; **orchestrate + ai-council as repo-defined primaries**)". This is refuted by three sources: (a) ground-truth registry `.opencode/agents/ai-council.md:4` = `mode: subagent`; (b) `cli-opencode/SKILL.md:31` and `:285` list exactly THREE primaries (general, plan, orchestrate) and do NOT include ai-council; (c) `cli-opencode/SKILL.md:292` explicitly states ai-council is `mode: subagent`, "rejected at the top level". An operator reading playbook.md:362 would conclude ai-council is a directly-invokable primary and attempt `--agent ai-council`, hitting the exact subagent-rejection Cluster 1 was built to eliminate. This is the same defect category as Cluster 1, in a file the phase edited (T004 lists `manual_testing_playbook.md`), at a line outside the cited 417–423 range. [DIMENSION: traceability]

#### Claim-Adjudication Packet — F001
```json
{
  "findingId": "F001",
  "claim": "playbook.md:362 still classifies ai-council as a directly-invokable primary agent, contradicting the agent registry (mode: subagent), SKILL.md:31/285/292, and Cluster 1's stated purpose.",
  "evidenceRefs": [
    ".opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:362",
    ".opencode/agents/ai-council.md:4",
    ".opencode/skills/cli-opencode/SKILL.md:31",
    ".opencode/skills/cli-opencode/SKILL.md:285",
    ".opencode/skills/cli-opencode/SKILL.md:292"
  ],
  "counterevidenceSought": "git blame on playbook.md:362 to determine provenance (authored 2026-05-30 by caf072e39e6, i.e. PRE-EXISTING, not the remediation commit a3c983639e). Grepped all cli-opencode living docs for 'ai-council.*primary' — line 362 is the SOLE residual 'primary' classification; SKILL.md:31 and README.md now correctly omit ai-council from primaries. Checked spec.md Out-of-Scope: it excludes 'the pre-existing deep-ai-council naming mismatch (@deep-ai-council playbook expectation vs. registry's ai-council)' — a NAMING issue, distinct from this PRIMARY-vs-SUBAGENT classification issue.",
  "alternativeExplanation": "Line 362 may intentionally describe a historical 4-primary model from before ai-council became mode: subagent. However, the present-tense verb 'distinguishes' and the ground-truth mode: subagent refute a historical reading; and the phase edited this file (Cluster 1) without reconciling line 362, so the contradiction persists in living docs.",
  "finalSeverity": "P1",
  "confidence": 0.72,
  "downgradeTrigger": "If the operator considers line 362's primary/subagent classification part of the explicitly-excluded 'pre-existing ai-council naming mismatch' (spec Out of Scope), downgrade to P2 advisory. Also downgrade if a subsequent phase re-classifies ai-council back to a primary in the registry.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery: factual contradiction between playbook.md:362 and registry/SKILL.md in a file the phase edited" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | REQ-001..005 mapping below | REQ-001/002/003 literally satisfied; F001 is a REQ-001-intent gap |
| checklist_evidence | partial | hard | checklist.md:68 CHK-020 | CHK-020 grep is `--agent ai-council` literal; line 362 uses different wording so CHK-020 passes despite F001 |

### REQ Acceptance Mapping
| REQ | Criterion | Status | Evidence |
|-----|-----------|--------|----------|
| REQ-001 | No remaining direct `--agent ai-council` guidance; scoped grep confirms | LITERAL PASS / INTENT GAP | grep for `--agent ai-council` literal = all rejection-framed; but F001 (playbook.md:362 "ai-council as repo-defined primaries") undermines the intent |
| REQ-002 | No `.opencode/agents/*.toml` in 5 SKILLs + scanner + 6 docs | PASS | zero hits across deep-loop-workflows/deep-loop-runtime/cli-opencode |
| REQ-003 | plugins/README.md count matches real 6-file dir | PASS | verified iteration 2 |
| REQ-004 | Cluster 6 resolved per investigation | PASS | cli-opencode/SKILL.md:292-295 internally consistent; orchestrate.md untouched (load-bearing) |
| REQ-005 | No regressions (comment-hygiene, alignment-drift, vitest) | PASS (substance) | vitest 411/413 exactly as claimed; comment-hygiene clean (iter 4 will note the command-reproducibility gap) |

## Assessment
- New findings ratio: 0.50 — one new P1 (F001) is the highest-signal finding of the review so far.
- Dimensions addressed: traceability. The REQ sweep is overwhelmingly green; the single P1 is a residual contradiction in a touched file, not a wholesale acceptance-criteria failure.
- Novelty justification: F001 is genuinely new — it is not a restatement of phase 014's clusters (which were about `--agent ai-council` literal and `.toml` mirrors). It is a primary/subagent *classification* contradiction surfaced by cross-referencing the registry against a doc the phase edited but did not fully reconcile.

## Ruled Out
- REQ-002/003/004/005 as failures: all substantively verified in iterations 1–2 and below. [evidence: greps + vitest + validate.sh]
- "playbook.md:362 introduced by this phase": disproven by git blame (authored 2026-05-30, pre-existing).

## Dead Ends
- Hunting for `.toml` in cli-opencode itself: zero hits; Cluster 2/3 scope correctly excluded cli-opencode.

## Recommended Next Focus
Iteration 4: maintainability/completeness — broaden the residual-drift sweep (deep-improvement fixture `.toml` consistency, repo-wide `.toml` outside stated scope), and audit the *reproducibility* of every verification command in checklist.md (CHK-010 cites `python3 check-comment-hygiene.sh` — does that command actually run?). F001 is carried forward; do NOT re-litigate it unless new counterevidence appears.

Review verdict: CONDITIONAL

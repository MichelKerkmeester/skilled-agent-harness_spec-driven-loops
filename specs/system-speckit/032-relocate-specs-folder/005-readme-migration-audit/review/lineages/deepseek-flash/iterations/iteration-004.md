# Iteration 4: D4 Maintainability

## Focus

Maintainability dimension: internal consistency of the system-spec-kit doc family (main README vs templates README which already uses canonical `specs/`), and functional maintainability of the drift-marker watched-root after the symlink flip.

## Scorecard

- Dimensions covered: [correctness, security, traceability, maintainability]
- Files reviewed: 7
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=1 P2=0 (F009 upgraded P2 -> P1)
- New findings ratio: 1.0

## Findings

### P1, Required

- **F017**: drift-marker watcher has a functional blind spot post-flip (upgrades F009), `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh:16`
  - Evidence: `.opencode/specs` is now a git symlink blob (`git ls-tree HEAD .opencode/specs` => `120000 blob`). `git diff-tree --name-status HEAD~3 HEAD -- .opencode/specs` returns **0** changed paths, while the same window scoped to canonical `specs/` returns **23**. The drift-marker's pathspec no longer traverses the tree, so post-flip renames/deletes under canonical `specs/` are not detected and memory-index drift reconciliation silently stops. This is a functional maintainability/correctness break, not just doc staleness. F009 (P2 doc staleness) is upgraded to P1 with this confirmed behavior.
  - Recommendation: Re-point the drift-marker pathspec to `specs/` (or `specs .opencode/specs`) and add a regression test comparing pathspec coverage.

### P2, Suggestion

- **F018**: system-spec-kit doc family is internally inconsistent — main README uses legacy `.opencode/specs`, sibling templates/README already uses canonical `specs/`, `.opencode/skills/system-spec-kit/README.md:846` vs `.opencode/skills/system-spec-kit/templates/README.md:69,180,202,237`
  - Evidence: templates/README.md (renderer doc, same skill) writes rendered docs to `specs/`, runs `validate.sh specs/example --strict`, and its diagram shows `specs/...` canonical. The main README (lines 128, 661-663, 701-702, 748, 846) teaches `.opencode/specs/` as canonical. Two docs in the same skill disagree on the root; the templates README is correct post-flip, making the main README the outlier.
  - Recommendation: Align the main README to the canonical `specs/` form already used in templates/README.md.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | memory-drift-marker.sh:16 vs git ls-tree symlink; README.md:846 vs templates/README.md:69 | Functional blind spot + doc-family inconsistency |
| checklist_evidence | notApplicable | hard | - | No checklist.md |

## Assessment

- New findings ratio: 1.0
- Dimensions addressed: [maintainability]
- Novelty justification: F017 is a confirmed functional break discovered via git pathspec testing; F018 is an internal-consistency finding across sibling docs of the same skill.

## Ruled Out

- mcp-server hooks README (index) contains no specs-root reference — clean.
- No README pair describes drift-marker behavior contradictorily *within* the same doc; the issue is cross-doc root usage (F018) and functional coverage (F017).

## Dead Ends

- None.

## Recommended Next Focus

Broaden angle: verify remaining literal-hit READMEs I haven't fully read (sk-doc negative fixture, deep-alignment, styles/scripts, sk-create-benchmark) and check the 6 historical specs/** README hits to confirm out-of-scope classification; then scan for any README that describes `.opencode/specs` *correctly as a compat symlink* (correct-as-is cases).

## Claim Adjudication

```json
{
  "findingId": "F017",
  "claim": "The drift-marker's git pathspec on `.opencode/specs` sees zero changes because the path is now a symlink blob; post-flip drift detection under canonical `specs/` silently stops.",
  "evidenceRefs": [".opencode/scripts/git-hooks/lib/memory-drift-marker.sh:16", ".opencode/skills/system-spec-kit/scripts/git-hooks/README.md:18"],
  "counterevidenceSought": "Ran git ls-tree (mode 120000 symlink) and compared diff-tree counts: .opencode/specs pathspec = 0 changes vs specs/ = 23 changes over the same window.",
  "alternativeExplanation": "If git followed symlink pathspecs, the counts would match; the measured asymmetry proves it does not.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the drift-marker is re-pointed to canonical specs/ and a regression test proves parity, downgrade to P2.",
  "transitions": [ { "iteration": 4, "from": null, "to": "P1", "reason": "Confirmed functional blind spot via git pathspec asymmetry" } ]
}
```

```json
{
  "findingId": "F018",
  "claim": "system-spec-kit main README teaches legacy root while its sibling templates/README already uses canonical specs/.",
  "evidenceRefs": [".opencode/skills/system-spec-kit/README.md:846", ".opencode/skills/system-spec-kit/templates/README.md:69"],
  "counterevidenceSought": "Read templates/README.md lines 60-75, 180, 202, 237; confirmed canonical specs/ usage.",
  "alternativeExplanation": "None — the two docs plainly disagree on the root.",
  "finalSeverity": "P2",
  "confidence": 0.95,
  "downgradeTrigger": "N/A (already P2).",
  "transitions": [ { "iteration": 4, "from": null, "to": "P2", "reason": "Initial discovery" } ]
}
```

Review verdict: CONDITIONAL

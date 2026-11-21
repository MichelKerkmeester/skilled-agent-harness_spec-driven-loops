# Iteration 011 - Frontier node F-1-006: traceability

## Dispatcher
- Lineage opus-medium, iteration 11 (10 prior iteration records). steer.md absent. Node F-1-006, dimension traceability.
- Review focus addressed: Barter's own docs against the moved layout. README.md, CONTRIBUTING.md, developer-questions.md, AGENTS.md, REPO RULES.md, repo-rules/ and overlays/README.md were checked for any surviving reference to the old barter-overlays path or the dot-dropped layout.

## Files Reviewed
- barter/ai-speckit/overlays/README.md:8,54,424-470 (layout tree and source rule)
- barter/ai-speckit/README.md:135,388; CONTRIBUTING.md:95; AGENTS.md:323-324
- barter/ai-speckit/developer-questions.md, REPO RULES.md, repo-rules/ (rg sweep)

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- spec_code (pass): overlays/README.md's layout tree (:436-460) matches the moved folder (framework/, root/, checks/, tests/, repin-runs/, manifest, sync-state.json) and the adopt rule (:54) matches Skilled adoptSource.
- checklist_evidence (pass): 005 AC-009's allowed leftovers (spec-track name, temp fixture) are the only hits; the doc sweep finds no old-path reference in Barter's docs.

## Integration Evidence
- None beyond the Barter docs.

## Edge Cases
- overlays/README.md:460 lists `repin-runs/` as "local re-pin backups, not committed" but says nothing of `relayout-runs/`. That is the doc side of R3-P2-001 (the ignore rule), not a separate finding.
- README.md:135,388, CONTRIBUTING.md:95 and AGENTS.md:323-324 name the spec track `specs/skilled-barter-overlays/`, a different identifier from the old folder.

## Confirmed-Clean Surfaces
- The Barter docs name `overlays/` and the framework/root rule consistently.

## Ruled Out
- Old folder path in Barter docs.

## Next Focus
- Dimension: traceability
- Focus area: F-1-008 parent packet and ai-speckit close-out record (039-overlays-framework-root-layout) against the child phases
- Reason: frontier rotation

Review verdict: PASS

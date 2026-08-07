# Iteration 2 — Security: archival and destination boundaries

## Dispatcher

- Dimension: security
- Budget profile: scan
- Scope: label validation, archive collisions, and snapshot archive traversal.

## Files Reviewed

- `.opencode/skills/sk-doc/create-benchmark/scripts/archive-compiled-routing.cjs`
- `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`

## Findings - New

### P0 Findings

- None.

### P1 Findings

- None.

### P2 Findings

- None.

## Traceability Checks

- `spec_code`: pass for the archive boundary — labels are constrained, `baseline` is refused, and an occupied archive is rejected before writes.
- `checklist_evidence`: partial — security-specific execution evidence is not recorded in the target checklist, but direct source review found no actionable exposure.

## Integration Evidence

- Archive provenance converts the target root to a repo-relative form before persistence.
- Snapshot discovery reads only the archive root derived from the selected hub.

## Edge Cases

- The non-atomic default-output race remains a correctness/data-integrity issue; it does not create a path traversal because its path segments are generated internally.

## Confirmed-Clean Surfaces

- Dots, underscores, uppercase labels, the frozen anchor, and pre-existing archive labels are rejected on the compiled-routing write path.

## Ruled Out

- No injection or arbitrary-path finding survived the direct reads.

## Next Focus

- Dimension: traceability
- Focus area: reconcile packet acceptance claims, storage authorities, and emitted report files.
- Reason: prior remediation changed the writer layout and may have left target documentation stale.

Review verdict: PASS

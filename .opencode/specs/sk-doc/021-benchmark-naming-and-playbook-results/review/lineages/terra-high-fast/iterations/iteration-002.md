# Iteration 2: Security — destination and input boundaries

## Dispatcher

- Budget profile: scan.
- Resolved route: mode=review target_agent=deep-review.

## Files Reviewed

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:70-99,112-145,398-405,539-567`
- `.opencode/skills/sk-doc/create-benchmark/scripts/archive-compiled-routing.cjs:146-212,232-245`
- `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:181-226,326-347`

## Findings - New

### P0 Findings

- None.

### P1 Findings

- None new. P1-001 remains active from iteration 1.

### P2 Findings

- None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | partial | hard | `archive-compiled-routing.cjs:149-204`; `run-skill-benchmark.cjs:398-405` | Archive is collision-safe; default Lane C path remains covered by P1-001. |
| `checklist_evidence` | partial | hard | `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md` | Full evidence replay remains scheduled for traceability. |

## Integration Evidence

- The compiled-routing archiver independently rejects occupied labels before writing at `archive-compiled-routing.cjs:164-168`.

## Edge Cases

- `--outputs-dir` accepts an explicit operator path by design; this pass did not treat trusted local CLI destination selection as an exploitable boundary.

## Confirmed-Clean Surfaces

- Run-label normalization removes dots, underscores, and capitals through `slugField()` at `run-skill-benchmark.cjs:94-99`.
- The compiled-routing archive checks for an existing target directory before `fs.mkdirSync` at `archive-compiled-routing.cjs:164-168,207`.

## Ruled Out

- No untrusted shell interpolation or secret-handling path was found in the reviewed writer and archiver boundaries.

## Next Focus

- Dimension: traceability
- Focus area: compare packet claims, storage authority, writer outputs, and the rename/reference repair.
- Reason: the remaining risk is contract drift across named surfaces.
- Rotation status: next primary dimension.
- Required evidence: direct contract-to-code and reference searches.

Review verdict: PASS

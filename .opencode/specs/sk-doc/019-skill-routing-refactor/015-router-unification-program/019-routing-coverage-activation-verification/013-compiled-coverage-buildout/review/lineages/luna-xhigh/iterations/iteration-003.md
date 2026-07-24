# Iteration 3: Security - Path, Flag, and Serving Boundaries

## Dispatcher
- Target: compiled coverage buildout spec folder
- Session: `fanout-luna-xhigh-1784691838667-iv78vk`
- Route proof: `target_agent=deep-review`, `resolved_route=Resolved route: mode=review target_agent=deep-review`
- Budget profile: verify

## Files Reviewed
- `.opencode/bin/lib/compiled-route-manifest.cjs:216-270, 288-320`
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:22-122`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs:175-213`
- `.opencode/bin/tests/compiled-route-manifest.test.cjs:147-245`
- `.opencode/bin/compiled-route-sync.cjs:107-123, 348-360`

## Findings - New
### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | notApplicable | hard | `.opencode/bin/lib/compiled-route-manifest.cjs:216-270` | Security pass |
| checklist_evidence | notApplicable | hard | `.opencode/bin/tests/compiled-route-manifest.test.cjs:147-245` | Security pass |

## Integration Evidence
- Manifest source roots reject traversal, root symlinks, file symlinks, and out-of-root realpaths at `.opencode/bin/lib/compiled-route-manifest.cjs:216-252`.
- Activation directories reject symlinked roots/directories and verify real containment at `.opencode/bin/lib/compiled-route-manifest.cjs:255-270`.
- The resolver treats invalid flag values as legacy and requires both compiled authority and exact policy identity before serving at `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:52-75, 103-122`.
- Child parity probes restore the parent environment flag and use `shell:false` at `compiled-routing-parity.cjs:175-197`.

## Edge Cases
- The direct tests exercise traversal, absolute, malformed, wrong-root, source-link, root-link, activation-link, and compiler-error cases.
- The user boundary forbids graph DB writes, so no independent graph-backed no-specs-read proof was emitted; the reviewed sync verification surface reports the intended guard at `.opencode/bin/compiled-route-sync.cjs:348`.

## Confirmed-Clean Surfaces
- Invalid `SPECKIT_COMPILED_ROUTING` values fail closed to legacy rather than being coerced.
- `SPECKIT_COMPILED_ROUTING=0` is an explicit fleet-wide legacy switch.
- Compiled serving cannot bypass manifest authority or generation/hash identity checks.

## Ruled Out
- No path traversal or symlink escape finding was confirmed in the reviewed manifest and resolver boundaries.

## State Repair Note
- The reducer-created summary-only `SUMMARY-P1-001` from iteration 2 is explicitly disproved in this iteration; the sole active carried-forward finding remains `F001`.

## Next Focus
- dimension: traceability
- focus area: normative requirements, completion claims, checklist evidence, and packet lifecycle metadata
- reason: implementation security boundaries are fail-closed; the packet documents contain conflicting lifecycle states requiring direct reconciliation
- rotation status: security pass complete
- blocked/productive carry-forward: retain F001; trace every completion claim to implementation or test evidence
- required evidence: spec, plan, tasks, checklist, decision record, implementation summary, and handover cross-comparison

Review verdict: PASS

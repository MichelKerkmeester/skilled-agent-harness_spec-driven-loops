---
title: "Iteration 4: Maintainability — test isolation and follow-on safety"
trigger_phrases: []
---
# Iteration 4: Maintainability — test isolation and follow-on safety

## Dispatcher
- Executor binding: `cli-pi` / `gpt-5.6-luna` / xhigh.
- Resolved route: `mode=review target_agent=deep-review`.
- Read state before analysis: three completed dimensions, active F001-F008, next focus maintainability.
- Budget profile: scan; bounded reads of test isolation, template documentation, and generated-metadata maintenance paths.
- The configured `max-iterations=4` ceiling is reached by this pass. Convergence signals remain telemetry only until this iteration completes.
- No repository validation, repair, build, memory-save, graph, or git-write command was run.

## Dimension
Maintainability. This pass checks whether the retained verification and fingerprint tests are hermetic, whether documentation supports safe follow-on changes, and whether the retirement leaves an understandable maintenance boundary.

## Files Reviewed
- `.opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:20-38,40-95`
- `.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.cjs:280-297,410-417`
- `.opencode/skills/system-spec-kit/scripts/package.json:14-18`
- `.opencode/skills/system-spec-kit/templates/README.md:98-151`
- `.opencode/skills/system-spec-kit/templates/examples/README.md:55-82`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:730-752,1260-1320`
- `.opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts:150-181`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/implementation-summary.md:151-204`

## Findings by Severity

### P0 Findings
- None. The reviewed maintainability issue can leave a tracked reference packet mutated after an interrupted test, but no destructive production behavior or immediate security compromise was established.

### P1 Findings
- None new. F001, F002, F003, F005, F006, and F007 remain active from prior passes.

### P2 Findings

1. **The fingerprint-generation test mutates a tracked reference packet without an interruption-safe restore trap** — `.opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:20-38,40-95` — the test copies a baseline, then runs `backfill-graph-metadata.ts` directly against the tracked `$PACKET` and edits its `graph-metadata.json` and `spec.md` in place. Restoration is an ordinary function called only near the end of the happy path (`:40`, `:88-95`); the trap removes only `$WORK` (`:28`). A terminated or manually interrupted run can therefore leave the repository's reference packet changed, turning a read-only test into a persistent workspace mutation and making later failures depend on prior test interruption.

   - Finding class: `test-isolation`
   - Scope proof: The test's live packet path, mutation commands, restore function, and trap were read together; the trap does not call `restore`, and no subshell or copied packet is passed to the backfill command.
   - Affected surface hints: `["fingerprint-docset-generation.sh", "tracked reference packet", "backfill-graph-metadata.ts", "restore trap", "CI interruption handling"]`

## Traceability Checks
- `spec_code`: partial — the production retirement path is understandable, but the active test surfaces retain the F001 contradiction and the fingerprint test is not interruption-safe.
- `checklist_evidence`: fail — F005 remains an unchecked P1 without approval; no new checklist protocol was needed in this maintainability pass.
- `feature_catalog_code`: fail (advisory overlay) — F006 remains active; catalog parity was not retried.
- `playbook_capability`: notApplicable — no packet-local playbook scenario was identified.
- `resource-map.md`: absent at initialization; coverage gate skipped.

## Integration Evidence
- Test command wiring: `.opencode/skills/system-spec-kit/scripts/package.json:14-18` runs the scripts test suite that includes validation tests; the fingerprint script is an independently callable fixture test under the same scripts test surface.
- Fingerprint test mutation path: `fingerprint-docset-generation.sh:21-38` uses the live target packet and `:40-95` mutates/restores it.
- Production fingerprint contract: `graph-metadata-parser.ts:730-752` defines the generation, and `generated-metadata-integrity.ts:150-181` consumes it.
- Documentation surfaces: `templates/README.md:98-151` now names acceptance criteria and merged tasks, while `templates/examples/README.md:55-82` describes examples without reintroducing a standalone file.

## Edge Cases
- The mutation risk is conditional on interruption or an early shell exit; normal completion calls `restore`, so this remains P2 maintainability rather than a production correctness finding.
- The test's `mktemp` work directory does not isolate the packet because the backfill command still receives `$PACKET`.
- Existing F001 already covers the obsolete checklist creation in `test-validation-system.cjs`; it is not duplicated here.
- Existing F006 covers the stale feature catalog; the template README/examples were reread and no separate standalone-file pointer was found.
- Code graph and semantic memory were unavailable. Direct reads supplied the fallback evidence.

## Confirmed-Clean Surfaces
- `templates/README.md:98-151` lists `acceptance-criteria.md.tmpl` and the merged core templates, with no standalone checklist template.
- `templates/examples/README.md:55-82` does not name a `checklist.md` file; its “checklist-backed” wording was not promoted to a finding because the rendered tasks document still contains a verification checklist section.
- The fingerprint test's normal completion path restores the packet and cleans its temporary directory.
- No P0 candidate was found.

## Ruled Out
- Standalone checklist template remains in the current template README: ruled out by `.opencode/skills/system-spec-kit/templates/README.md:98-151`.
- Example README explicitly points to a standalone `checklist.md`: ruled out by `.opencode/skills/system-spec-kit/templates/examples/README.md:55-82`; the remaining terminology is compatible with the merged tasks section.
- Fingerprint test always loses mutations on normal completion: ruled out by `restore()` and its final calls at `.opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh:40,88-95`; the finding is interruption safety only.
- New maintainability P1: none; the P1 closure, path, catalog, generated-status, and active-test issues are carried forward rather than relabeled.

## Next Focus
- dimension: none — max-iterations reached
- focus area: synthesis and full-history replay of correctness, security, traceability, and maintainability findings
- reason: the hard ceiling of four iterations was reached; do not dispatch another review pass
- rotation status: all configured dimensions complete
- blocked/productive carry-forward: preserve F001-F009 as active; no convergence-based early synthesis was used
- required evidence: iteration files, deltas, state records, adjudication events, registry, and dashboard
- recovery note: maxIterationsReached is terminal for this lineage; code graph remains unavailable

## Verdict
- New findings: P0=0, P1=0, P2=1.
- Cumulative active findings: P0=0, P1=6, P2=3.
- New findings ratio: 1.0.
- Provisional iteration verdict: PASS (P2 advisory only).
- Final loop stop reason: `maxIterationsReached`.

Review verdict: PASS

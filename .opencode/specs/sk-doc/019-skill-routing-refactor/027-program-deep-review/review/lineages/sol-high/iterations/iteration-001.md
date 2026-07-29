# Deep Review Iteration 001

## Dispatcher
- Resolved route: mode=review target_agent=deep-review
- Session: `fanout-sol-high-1785257671132-a9gil1` (generation 1, lineage mode `new`)
- Focus: correctness
- Budget profile: `verify`
- Commit range used for discovery only: `2fa9fc480c..a39e6ea716`

## Files Reviewed
- `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts`
- `.opencode/skills/sk-doc/create-skill/SKILL.md`

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Authored metadata can make generated routing escape its declared containment boundary** -- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:121-139` -- The standalone config accepts any non-empty `packet` string and joins it to `skillDir` before recursively collecting leaves. Unlike alias paths, which explicitly reject absolute paths and `..` segments at lines 61-65, the packet path receives no containment check. A config such as `"packet":".."` therefore incorporates a sibling skill's leaf corpus while the generated manifest and fleet freshness check remain internally consistent. The command-metadata probe has the same class of false pass: the schema only asks `resourceExists(step.resource)` at `command-metadata-schema.cjs:155-180`, while the fleet gate resolves that unvalidated value with `path.join(repoRoot, rel)` or `path.join(skillDir, rel)` at `ci-skill-root-metadata.cjs:288-295`; `..` segments can therefore prove existence outside the repository or owning hub. This violates the spec's explicit probe-containment correctness scope [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md:51-55`].
   - Finding class: cross-consumer
   - Scope proof: Direct review covered both authored path consumers: standalone `packet` resolution and hub choreography-resource probing. The scoped test search found only a missing-resource callback assertion at `skill-root-metadata-contract.test.cjs:444-446`, with no traversal/outside-root negative case; the alias path implementation provides counterexample evidence that containment was intended.
   - Affected surface hints: `["standalone manifest generator", "fleet metadata gate", "command-metadata core schema", "contract negative tests"]`
   - Recommendation: Validate standalone `packet` as a contained skill-relative path and validate choreography resources against their documented repository/hub-relative roots before probing existence; add `..`, absolute-path, and symlink-boundary negative cases.

```json
{"type":"correctness","claim":"The generator and fleet gate accept authored paths whose normalized targets escape the owning skill/repository boundary, allowing out-of-scope resources to pass freshness and existence checks.","evidenceRefs":[".opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:61-65",".opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:103-139",".opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:155-180",".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:285-295"],"counterevidenceSought":"Checked the generator's alias validation, standalone config validation, fleet probe implementation, creation journey, workflow gate sequence, and scoped negative-test vocabulary. Alias diskPath is contained and the normal workflow runs --fix, but neither constrains standalone packet nor choreography resource traversal.","alternativeExplanation":"The metadata files are trusted authored inputs, and current fleet entries may all be contained; however, this gate is expressly the validator for author mistakes and freshness cannot detect a stable out-of-bound target.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"Downgrade to P2 only if a named upstream parser or filesystem policy—executed on every gate/generator path—proves normalized packet and choreography targets cannot leave their documented roots."}
```

### P2 Findings
None.

## Traceability Checks
- `spec_code`: **partial** — checked correctness claims for H/S required/generated files, command metadata existence probing, standalone generation/freshness, scaffolder-to-`--fix` journey, and watcher addDir/unlinkDir transitions against implementation. Remaining dimensions and broader surface fidelity rotate to later iterations.
- `checklist_evidence`: **notApplicable** — the target packet has no `checklist.md`.
- `feature_catalog_code`: **pending** — not part of this correctness pass.
- `playbook_capability`: **partial** — the create journey proves scaffolding followed by the fleet `--fix` and clean rerun at `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs:53-75`.

## Integration Evidence
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:305-357` was checked as the exact fleet-gate integration joining H/S classification, generated manifest/alias checks, and command-metadata validation.
- `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs:57-75` was checked as the exact scaffolder → fleet `--fix` → clean gate → doctor journey.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:451-479,582-620` was checked for add/remove target refresh and top-level addDir/unlinkDir state transitions; no active correctness finding was confirmed on this pass.

## Edge Cases
- The current fleet may contain no escaping path. The finding remains gate-relevant because the validator is designed to reject invalid authored declarations before they become routing data.
- Symlink containment was not adjudicated; lexical `..`/absolute-path containment is already sufficient for the active finding, while realpath/symlink policy remains follow-up evidence.
- Resource-map coverage was skipped as configured because `resource-map.md` is absent.

## Confirmed-Clean Surfaces
- H/S required-file sets consistently classify `command-metadata.json` as required for H and forbidden for S [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs:73-106`].
- Standalone scaffold omission of generated manifest/aliases is intentional in the full workflow: the journey invokes the fleet gate with `--fix` and then proves a clean non-fix run [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs:57-71`; `.opencode/skills/sk-doc/create-skill/SKILL.md:183-198`].
- Watcher removal refresh prunes removed hashes and pending dead slugs, and addDir rejects nested/hidden directories before enqueueing a top-level skill [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:451-479,599-620`].

## Ruled Out
- Ruled out the initial hypothesis that `init_skill.py` incorrectly claims a fully gate-clean standalone output: the owning workflow explicitly requires `ci-skill-root-metadata.cjs --fix`, and the journey test verifies that transition.
- Ruled out treating current authored metadata values as proof of validator containment; present-data cleanliness does not exercise the negative contract.
- Structural-impact tooling was unavailable in this runtime; direct commit-range diff mapping plus direct file reads supplied the scoped evidence.

## Next Focus
- Dimension: security
- Focus area: path trust boundaries, `--fix` write scoping, command/resource probes, and watcher quarantine interactions
- Reason: correctness found a cross-consumer containment gap that needs security-boundary adjudication without repeating the same lexical-path analysis
- Rotation status: correctness complete; rotating to D2
- Blocked/productive carry-forward: packet docs and direct source reads productive; memory MCP timed out and must not be retried this iteration
- Required evidence: concrete exploit/reachability paths, write targets, and existing containment countermeasures with exact file:line citations

Review verdict: CONDITIONAL

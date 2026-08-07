# Deep Review Iteration 005 — Cross-Reference Stabilization

## Dispatcher
- Resolved route: mode=review target_agent=deep-review
- Iteration: 5 of 5
- Session: `fanout-sol-high-1785257671132-a9gil1` (generation 1, lineage mode `new`)
- Focus: cross-reference stabilization
- Budget profile: `verify`
- Review target: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review`

## Files Reviewed
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs`
- `.github/workflows/routing-registry-drift.yml`
- `.opencode/scripts/git-hooks/pre-push`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts`

## Findings - New

### P0 Findings
None.

### P1 Findings
None new. Two carried P1 claims remain active after the replay below.

### P2 Findings
None new. P1-003 is refined and downgraded to P2 below; it is not a new finding.

## Active-Finding Replay

1. **P1-001 remains P1: authored roots can supply out-of-bound filesystem evidence** — `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:103-147`; `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:285-296` — Standalone `packet` is normalized only by `path.join()` before traversal, and choreography resources are accepted by either repository-root or skill-root `existsSync` probes. Emitted leaf IDs are separately contained, but `buildManifest()` copies `packet` without validating it, so that counterevidence does not close the producer/consumer boundary [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:104-123,343-363`].
   - Finding class: cross-consumer
   - Scope proof: Replayed the standalone generator, manifest builder, command schema, fleet-injected probes, and scoped negative tests. Tests reject traversal in emitted leaf IDs but do not test standalone `packet` or choreography-resource containment [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs:106-139`; `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:442-450`].
   - Affected surface hints: `["standalone manifest generator", "fleet command-metadata probe", "manifest packet field", "containment negative tests"]`

```json
{"type":"correctness","findingId":"P1-001","claim":"Authored standalone packet and choreography resource paths can resolve outside their documented roots and make generated or validated routing rely on out-of-bound filesystem evidence.","evidenceRefs":[".opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:103-147",".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:285-296",".opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:155-180",".opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:343-363"],"counterevidenceSought":"Rechecked leaf-id containment, generated write targets, current scoped tests, and the watcher boundary; those surfaces constrain emitted IDs or writes but do not validate the authored roots before filesystem access.","alternativeExplanation":"Current repository-authored values may all be clean and the probes are read-only, limiting exploitability; validator integrity still depends on unchecked authored paths.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade only when an always-executed boundary validates normalized and real standalone packet and choreography targets against their documented roots."}
```

2. **P1-002 remains P1: command-metadata-only changes can still skip authoritative CI** — `.github/workflows/routing-registry-drift.yml:15-52` — Neither the push nor pull-request filter matches `.opencode/skills/*/command-metadata.json`, although the workflow runs the fleet consumer at lines 101-110. The pre-push hook is meaningful counterevidence because it invokes that gate for skill-tree diffs, but it is bypassable and cannot enroll a pull request whose path filter prevents the workflow from starting [SOURCE: `.opencode/scripts/git-hooks/pre-push:165-192`].
   - Finding class: cross-consumer
   - Scope proof: Replayed both workflow trigger lists, the exact CI step, and the local caller. No broader listed CI pattern matches a command-metadata-only change.
   - Affected surface hints: `["routing-registry-drift path filters", "hub command-metadata roots", "fleet metadata gate", "pre-push parity"]`

```json
{"type":"traceability","findingId":"P1-002","claim":"A command-metadata-only push or pull request does not trigger the workflow that runs the authoritative fleet metadata gate.","evidenceRefs":[".github/workflows/routing-registry-drift.yml:15-52",".github/workflows/routing-registry-drift.yml:101-110",".opencode/scripts/git-hooks/pre-push:165-192"],"counterevidenceSought":"Compared both CI path filters with the local pre-push caller and checked whether another listed wildcard incidentally covers root command-metadata files.","alternativeExplanation":"Ordinary clean local pushes run the fleet gate, but that bypassable local integration does not make pull-request CI mandatory.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade only if another mandatory CI workflow invokes the same fleet gate for every command-metadata-only change or both filters are expanded."}
```

3. **P1-003 is downgraded to P2 and expanded to the adjacent freshness gate** — `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:79-86,372-412`; `.opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:57-71,98-132` — Both CLIs suppress enumeration errors into an empty result and return success for an existing non-directory `--skills-dir`; direct read-only executions reproduced `checked=0` and exit 0 for both. Exact production callers materially reduce the impact: CI invokes both scripts without `--skills-dir`, and pre-push invokes the root gate without it, so they use the repository skills directory derived from each script location [SOURCE: `.github/workflows/routing-registry-drift.yml:101-110`; `.opencode/scripts/git-hooks/pre-push:178-190`]. The false-green remains actionable for the documented/manual and synthetic-fleet CLI surface but no longer meets P1 on the verified callers.
   - Finding class: cross-consumer
   - Scope proof: Replayed both fleet discovery implementations, their run paths, the CI and pre-push callers, and scoped tests. The journey passes a valid temporary directory; no test covers a non-directory, unreadable root, or explicit zero-root policy [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs:53-71`; `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:362-374`].
   - Affected surface hints: `["root-metadata fleet gate", "manifest freshness fleet gate", "CLI argument validation", "zero-root tests"]`

```json
{"type":"correctness","findingId":"P1-003","claim":"Both fleet CLIs can report success without scanning roots when an existing --skills-dir cannot be enumerated as a directory.","evidenceRefs":[".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:79-86",".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:372-412",".opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:57-71",".opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:98-132",".github/workflows/routing-registry-drift.yml:101-110",".opencode/scripts/git-hooks/pre-push:178-190"],"counterevidenceSought":"Traced every scoped production caller and verified that none supplies a dynamic --skills-dir; all use the repository-root default. Also ran both CLIs against an existing file and reproduced checked=0 success.","alternativeExplanation":"A readable empty synthetic directory may intentionally contain zero roots, and production callers use a stable derived directory; neither justifies silently accepting a regular file, but both contain the release impact.","finalSeverity":"P2","confidence":0.98,"downgradeTrigger":"Re-escalate if a mandatory caller passes a dynamic/untrusted path, or if the default production path can reach this suppressed-enumeration branch while the gate still reports success."}
```

## Traceability Checks
- `spec_code` (core): **fail** — P1-002 remains active; command-metadata-only changes are still outside both CI path filters [SOURCE: `.github/workflows/routing-registry-drift.yml:15-52,101-110`].
- `checklist_evidence` (core): **notApplicable (carried, not retried)** — the packet has no `checklist.md`.
- `feature_catalog_code` (overlay): **notApplicable (carried, not retried)** — no feature-catalog implementation artifact is in the declared scope.
- `playbook_capability` (overlay): **partial (carried)** — the scaffold → fleet `--fix` → clean gate journey remains green, but it does not cover containment or discovery-error cases [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs:53-75`].

## Integration Evidence
- `.github/workflows/routing-registry-drift.yml:15-52,101-110` was reviewed as the exact CI trigger and caller for both fleet gates.
- `.opencode/scripts/git-hooks/pre-push:165-192` was reviewed as the exact local caller for the root-metadata gate; it does not invoke the separate freshness gate.
- The three scoped Node test programs passed: root-metadata contract/fleet, leaf-resource containment, and scaffold journey.
- Direct read-only CLI probes confirmed both fleet scripts return successful zero-root reports for an existing file supplied as `--skills-dir`.

## Edge Cases
- A genuinely empty readable synthetic fleet may be legal; the retained P2 concerns suppressed enumeration errors and non-directory inputs, not an unconditional ban on zero roots.
- Current authored `packet` and choreography values being clean does not prove the negative containment contract.
- The watcher uses lexical containment for event-to-skill mapping and realpath-aware filtering for derived key files; no path from P1-001 to watcher writes was confirmed [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:166-177,185-221,228-274`].
- Memory MCP timed out and structural-impact analysis remained unavailable; graph convergence therefore has no structural signals. Direct producer/consumer/caller reads and passing scoped tests are the graphless evidence for this stabilization pass.

## Confirmed-Clean Surfaces
- Manifest leaf IDs reject absolute paths and traversal and are normalized before canonical emission [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:104-135,343-363`].
- Manifest freshness byte-compares every discovered manifest and fails stale/regeneration-error results; only discovery-input validation remains advisory [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:74-92,98-132`].
- The exact scoped contract, containment, and create-journey tests pass in this worktree.

## Ruled Out
- No new P0/P1: counterevidence did not disprove P1-001 or P1-002, and exact callers justified downgrading rather than duplicating P1-003.
- Ruled out a watcher escalation: reviewed target discovery and containment do not consume standalone `packet` or command choreography values.
- P2-001 remains a carried advisory; no new family-policy drift was observed, so it was not duplicated.
- Blocked/exhausted checklist, feature-catalog, playbook, memory-MCP, structural-impact, and broad spec-code approaches were not retried.

## Next Focus
- Dimension: terminal synthesis
- Focus area: remediation planning for the two active P1 findings and two P2 advisories
- Reason: iteration 005 completes max-iterations with all four configured dimensions covered and two active P1s remaining
- Rotation status: review rotation complete; no sixth LEAF iteration is authorized
- Blocked/productive carry-forward: preserve exact generator/schema/fleet, CI/pre-push, and discovery/freshness evidence; do not reopen exhausted protocols
- Required evidence: synthesis must retain P1-001 and P1-002 as release-conditional, record P1-003 as downgraded P2, and explain graphless verification

Review verdict: CONDITIONAL

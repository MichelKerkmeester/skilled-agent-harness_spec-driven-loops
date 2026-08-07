# Deep Review Iteration 004 — Maintainability

## Dispatcher
- Resolved route: mode=review target_agent=deep-review
- Iteration: 4 of 5
- Budget profile: verify
- Dimension: maintainability
- Scope: contract ownership, duplication, failure diagnostics, scaffold/template equivalence, consumer drift, and test protection within the declared file list

## Files Reviewed
- `.opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`
- `.opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py`
- `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-command-metadata-template.json`
- `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-description-template.json`
- `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json`
- `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-router-template.json`
- `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-leaf-aliases-template.json`
- `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-registry-template.json`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill-graph-metadata-template.json`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill-leaf-manifest-config-template.json`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-watcher-new-root-ingestion.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/daemon-watcher-resource-leaks-049-005.vitest.ts`

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Fleet gate silently passes a non-directory `--skills-dir`** — `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:79-86,372-412` — `findSkillRoots()` converts every `readdirSync` failure into an empty fleet, while `run()` checks only `existsSync` and returns success whenever that empty result has no violations. A read-only verification passed the target packet's existing `spec.md` file as `--skills-dir`; the authoritative gate exited 0 and reported `checked=0 passed=0 failed=0`. This false-green path makes a typo, file path, or unreadable directory indistinguishable from a valid empty fleet. [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:79-86,372-412`; `.opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:362-374`]
   - Finding class: instance-only
   - Scope proof: The scoped gate has one fleet-discovery function and one CLI run path; direct execution with an existing non-directory reproduced exit 0, and the scoped gate test covers violations but not discovery errors or a zero-root fail-closed rule.
   - Affected surface hints: `ci-skill-root-metadata.cjs`, `routing-registry-drift.yml`, pre-push fleet gate, gate diagnostics
   - Recommendation: Validate that `skillsDir` is a readable directory, propagate enumeration errors, and decide explicitly whether a genuinely empty directory is legal rather than deriving success from an empty result.

```json
{"findingId":"P1-003","type":"correctness","claim":"The authoritative fleet metadata gate can return success without scanning any roots when --skills-dir exists but cannot be enumerated as a directory.","evidenceRefs":[".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:79-86",".opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:372-412",".opencode/skills/sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:362-374"],"counterevidenceSought":"Checked run() for stat/readability validation and the scoped gate tests for a discovery-error or zero-root case; neither exists. Executed the gate against an existing file path and observed checked=0 with exit 0.","alternativeExplanation":"An intentionally empty directory could be a valid synthetic fleet, but that does not explain accepting a regular file or suppressing enumeration errors.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade only if every production caller independently proves the argument is a readable directory and checked=0 is an intentional, monitored success state."}
```

### P2 Findings
1. **Skill-family policy remains duplicated across the doctor and advisor compiler** — `.opencode/commands/doctor/scripts/parent-skill-check.cjs:56-59`; `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:47,148-156` — Both consumers currently carry the same seven-value family set, but the doctor explicitly describes its list as a mirror and no scoped parity assertion protects the two copies. A future family addition can therefore be accepted by advisor ingestion while the parent-skill doctor rejects it (or vice versa). The lists match today, so this is schema-drift exposure rather than an active gate failure. [SOURCE: `.opencode/commands/doctor/scripts/parent-skill-check.cjs:56-59,282-285`; `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:47,148-156,769-771`]
   - Finding class: cross-consumer
   - Scope proof: Compared both runtime allowlists and the scoped contract/journey/watcher tests; current values match, but no shared source or parity check connects the two consumers.
   - Affected surface hints: parent-skill doctor, advisor skill-graph ingestion, graph-metadata templates, family-extension tests
   - Recommendation: Publish one machine-readable family contract or add an explicit cross-consumer parity test that fails when either list changes alone.

## Traceability Checks
- `spec_code`: carried as **fail** from iteration 003; not retried because the strategy marks that approach exhausted.
- `checklist_evidence`: **notApplicable**; the packet has no `checklist.md`, and the blocked protocol was not retried.
- Maintainability contract matrix: **partial** — pure leaf/root/command libraries centralize their immediate validators, but the fleet discovery error path fails open and family policy remains mirrored across exact consumers.

## Integration Evidence
- Executed `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs` in read-only mode against an existing file path and observed a false-green `checked=0` result.
- Compared the exact family gates in `.opencode/commands/doctor/scripts/parent-skill-check.cjs` and `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts`.
- Reviewed scaffold-to-gate integration in `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs`; its happy path does not exercise discovery failure.
- Reviewed watcher diagnostics in `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts` and its two scoped Vitest suites; malformed metadata and resource-lifecycle failures are surfaced and bounded.

## Edge Cases
- A truly empty but readable synthetic skills directory may be intentional; the finding is based on the indistinguishable file/unreadable-path case, not on asserting that every empty fleet must fail.
- The exact-path Grep backend surfaced sibling files outside the declared list during counterevidence search. Those hits were excluded from findings and evidence; only configured review-scope files were used.
- Memory MCP timed out before packet reads and was not retried, consistent with the strategy's blocked carry-forward.

## Confirmed-Clean Surfaces
- The root-class required/forbidden/generated policy is centralized in `skill-root-metadata-contract.cjs`, and the fleet gate consumes it directly.
- Command-metadata validation is centralized in `command-metadata-schema.cjs`; the fleet gate injects disk probes rather than duplicating the core field rules.
- Leaf identity, containment, canonical bytes, and qualified-id conversion remain centralized in `leaf-resource-contract.cjs` with focused unit coverage.
- Watcher malformed-metadata diagnostics, bounded diagnostic retention, top-level root creation, deletion, and recreation have direct scoped tests.

## Ruled Out
- No P0: the reproduced failure is a validation false-green, not an exploit, authorization bypass, destructive write, or data-loss path.
- No separate scaffold-template-equivalence finding: the parent scaffolder hard-codes a minimal valid instance while templates document richer manual authoring shapes, but the scoped journey proves the generated hub passes the fleet gate and doctor. Without a present behavioral mismatch, this remains follow-up context rather than another active finding.
- P1-001 and P1-002 were not restated; this iteration found no new evidence changing their severity or scope.

## Next Focus
- Dimension: cross-reference stabilization
- Focus area: final integration replay across gate callers, active-finding interactions, and release-readiness evidence
- Reason: all four configured dimensions are covered, while stopPolicy requires iteration 005 and three active P1 findings remain
- Rotation status: D1 correctness, D2 security, D3 traceability, and D4 maintainability complete; use the no-dimensions-remaining fallback
- Blocked/productive carry-forward: direct caller-to-gate evidence remains productive; do not retry memory MCP, structural-impact tooling, checklist evidence, feature-catalog overlay, playbook overlay, or exhausted spec-code scans
- Required evidence: exact CI/pre-push caller behavior, counterevidence for active P1s, and consistency of final state without duplicating unchanged findings

Review verdict: CONDITIONAL

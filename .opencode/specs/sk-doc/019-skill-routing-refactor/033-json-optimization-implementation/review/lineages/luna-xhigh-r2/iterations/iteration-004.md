# Deep Review Iteration 004

## Dispatcher
- Route: Resolved route: mode=review target_agent=deep-review
- Session: `fanout-luna-xhigh-r2-1785384990122-crx2xm`
- Generation: 1
- Mode: review
- Dimension: maintainability
- Budget profile: scan, target 9 tool calls
- Final configured iteration: yes

## Dimension
Maintainability — generated/projection contract maintainability, stale path declarations, duplicated strategy anchors, and long-lived review/report drift.

## Files Reviewed
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:58`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:21`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2126`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4418`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:313`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:318`
- `.opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts:42`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:106`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:131`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/schema-migration.ts:32`
- `.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/validate.ts:138`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:37`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:45`
- `.github/workflows/routing-registry-drift.yml:115`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:57`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:69`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/implementation-summary.md:52`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/checklist.md:60`

## Findings - New

### P0 Findings
(none)

### P1 Findings
(none)

### P2 Findings
1. **Deprecated TS-only derived sync writer still advertises a full-object schema path** -- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:106` -- The final derived-maintenance path is preserve-first: the shipped regenerator preserves authored `trigger_phrases`, `key_topics`, `causal_summary`, lifecycle/redirect fields, and structural arrays, then the CI freshness gate checks that committed shape [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:37`] [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:45`] [SOURCE: `.github/workflows/routing-registry-drift.yml:115`]. The older exported `syncDerivedMetadata` path still parses and writes a different `SkillDerivedV2Schema` object [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts:42`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:106`], then replaces `graphMetadata.derived` wholesale [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:131`]. The target packet already named that exact two-writer split as the motivating defect and required additive preservation instead [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:57`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/spec.md:69`]. Keeping the stale writer exported after the preserve-first migration creates a future-maintenance trap: a lifecycle or redirect caller can reintroduce the schema split without touching the canonical regenerator. No non-test production caller was found in the scoped implementation search, so this is an advisory maintainability finding rather than a gate-relevant P1.
   - Finding class: instance-only
   - Scope proof: Exact search for `syncDerivedMetadata` found the exported writer and test/stress consumers; the shipped in-scope maintenance path is `regenerate-skill-derived.cjs` plus `ci-skill-derived-freshness.cjs`, so the actionable surface is the obsolete exported writer contract, not the whole derived pipeline.
   - Affected surface hints: ["derived metadata maintenance", "lifecycle/redirect metadata", "skill-root freshness gate"]

## Traceability Checks
- core.spec_code: carried-forward fail from prior iterations; not re-entered except where phase 003 explicitly names the maintainability contract for derived metadata.
- core.checklist_evidence: carried-forward fail from prior iterations; this iteration used phase 003 checklist evidence only to confirm the preserve-first maintenance contract.
- overlay.feature_catalog_code: carried-forward partial; not re-entered.
- overlay.playbook_capability: carried-forward pass; not re-entered.
- maintainability.generated_projection_contract: partial. `aliases.ts` has a bounded generated deep-routing block with a hash [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:21`], and Python exposes projection check flags [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4418`], but the derived metadata writer surface still contains an obsolete full-object path.
- maintainability.stale_path_declarations: edge case only. The rendered scope still names `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`, while the actual file lives under `.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py`; this was already recorded in the lineage as a declared-scope path ambiguity, so it is not duplicated as a new finding.

## Integration Evidence
- `.github/workflows/routing-registry-drift.yml:115` wires the derived freshness gate into the class-contract CI step.
- `.opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:37` documents the preserve-first field set used by the canonical regenerator.
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:313` and `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:318` remain the Python-side validation contract for the canonical derived shape.

## Edge Cases
- Post-write verification found the append-only state log already contains a duplicate `type:"iteration", iteration:3` record. This iteration added exactly one `iteration:4` record and the delta first line matches it, but raw reducers that count every iteration line instead of unique iteration numbers may report five iteration records for a four-iteration lineage.
- The strategy file contained duplicate `## 11. NEXT FOCUS` anchor blocks before this iteration. The strategy update collapses the final next-focus state to a single terminal block.
- The rendered scope includes stale or missing implementation anchors. The review used actual in-tree paths where the packet's own implementation summaries identify the relocated `sk-create-skill` structure.
- A broad search over the spec folder surfaced older review-lineage artifacts. Those hits were treated as noise and were not used as evidence for active findings.

## Confirmed-Clean Surfaces
- The generated deep-loop alias projection is bounded by explicit generated markers and a hash [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:21`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:23`].
- The Python command bridge maintenance surface exposes dump, emit, and check modes for command-bridge comparison [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4424`] [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4486`].
- The shipped preserve-first regenerator matches phase 003's documented delivery and checklist evidence [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/implementation-summary.md:52`] [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration/checklist.md:60`].

## Ruled Out
- `generated_deep_alias_projection_drift`: ruled out. The generated deep routing projection in `aliases.ts` is isolated by generated markers and hash metadata.
- `python_command_bridge_uncheckable`: ruled out. The CLI exposes dump/check modes for bridge comparison; the still-unmet live generation cutover was already covered by prior correctness findings and was not re-entered.
- `p0_maintainability_blocker`: ruled out. The new issue is an obsolete exported writer contract with no evidenced immediate destructive behavior, auth bypass, or credential exposure.

## Verdict
CONDITIONAL. This iteration adds one P2 maintainability advisory and no P0/P1. The lineage remains conditional because the prior active P1 findings are still unresolved.

## Next Dimension
None. This is iteration 4 of 4 and all configured dimensions are covered.

## Next Focus
- dimension: none
- focus area: synthesis/remediation planning
- reason: final configured iteration complete; active P1s require remediation planning before promotion.
- rotation status: terminal
- blocked/productive carry-forward: do not rerun saturated correctness, security, traceability, or maintainability discovery except to verify remediation.
- required evidence: use the accumulated finding details and registry state.

Review verdict: CONDITIONAL

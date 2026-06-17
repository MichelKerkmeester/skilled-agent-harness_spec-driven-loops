# Iteration 003: Traceability

## Focus
**Dimension**: Traceability — core hard gates `spec_code` + `checklist_evidence`; the mcp-magicpath deprecation completeness sweep; spec-147 supersede; cross-skill version consistency
**Files reviewed**: `008-mcp-magicpath-deprecation/implementation-summary.md`, `008-.../checklist.md`, `147-mcp-magicpath/spec.md`, parent `spec.md`, `mcp-figma/SKILL.md`, `system-skill-advisor/mcp_server/database/skill-graph.sqlite`, three skill `SKILL.md` version fields + changelogs + tree-wide magicpath grep

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 8 (+ tree-wide grep + sqlite inspection)
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50 (P1 override)

## Findings

### P1, Required
- **F005**: The deprecated `mcp-magicpath` skill still lives in the runtime skill-advisor graph database, so the advisor can route to a skill whose files no longer exist, `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` (12 `mcp-magicpath` byte-occurrences) vs deleted `.opencode/skills/mcp-magicpath/` (absent). Phase 008's spec goal was to "sweep all live references" after deleting the skill (parent `spec.md:93`). The markdown/metadata sweep is complete and verified (clean tree-wide grep across `skills/commands/agents`, excluding changelogs). But `skill-graph.sqlite` — the live database the `skill_advisor` reads at routing time — still contains 12 occurrences of `mcp-magicpath` (node + edges), while `mcp-open-design` shows 68. Until a rescan rebuilds the DB, `advisor_recommend` can surface `mcp-magicpath`, and an agent following that recommendation would fail to `Read(".opencode/skills/mcp-magicpath/SKILL.md")` because the folder is deleted. This is degraded runtime behavior (a routable-but-nonexistent skill), not merely a doc nit. **It is disclosed**: `implementation-summary.md:124` (Known Limitation 1), the Key Decision to "Defer the skill-advisor sqlite rescan" (`implementation-summary.md:100`), and the parent `spec.md:16` `next_safe_action` ("advisor skill-graph rescan deferred") all record it as deliberately deferred maintenance.

- **Claim adjudication packet:**
```json
{
  "findingId": "F005",
  "claim": "The deleted mcp-magicpath skill is still present in skill-graph.sqlite, so skill_advisor can route to a skill whose files no longer exist on disk.",
  "evidenceRefs": [
    ".opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite:mcp-magicpath x12",
    ".opencode/skills/mcp-magicpath:absent",
    ".opencode/specs/skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/008-mcp-magicpath-deprecation/implementation-summary.md:124",
    ".opencode/specs/skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/008-mcp-magicpath-deprecation/implementation-summary.md:100"
  ],
  "counterevidenceSought": "grep -a -o over skill-graph.sqlite (12 mcp-magicpath, 68 mcp-open-design); confirmed mcp-magicpath/ folder is deleted; read the implementation-summary Known Limitations and Key Decisions to confirm the deferral is explicit and not an oversight; confirmed markdown/metadata sweep is genuinely clean.",
  "alternativeExplanation": "The deferral is a deliberate, documented scoping decision with a stated rationale (can run later without blocking the deprecation), and the surviving skills are routable, so one could argue the phase met its declared scope and this is tracked follow-up work rather than a defect (P2).",
  "finalSeverity": "P1",
  "confidence": 0.78,
  "downgradeTrigger": "Downgrade to P2 if the operator accepts that the skill-advisor sqlite rescan is explicitly out of phase-008 scope (per Key Decision implementation-summary.md:100) and is tracked as a follow-on packet — in which case it is disclosed deferred maintenance, not a release blocker.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Active runtime drift: advisor DB carries a deleted skill (12 occurrences verified). Disclosed+deferred, hence P1-with-downgrade-path rather than P0." }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `mcp-open-design/SKILL.md:9` (1.2.0), `sk-interface-design/SKILL.md:5` (1.3.0), `sk-prompt/SKILL.md` (2.3.0.0), `147-mcp-magicpath/spec.md:48` (Superseded by 150), `mcp-figma/SKILL.md:54,345` (repointed to mcp-open-design) | All checked normative claims from phases 006-008 verified against shipped state. Parent's "both skills stay advisor-routable" holds for the surviving skills. The one degradation (deleted skill still in advisor DB) is captured as F005, not a spec_code contradiction since the summary discloses it. |
| checklist_evidence | pass | hard | `008-.../checklist.md` 26/26 `[x]`, 0 unchecked; independent regression grep clean | Phase 008 checklist fully checked; the "no live reference remains" evidence is accurate for markdown/metadata (its scoped meaning). The sqlite runtime surface is carved out as a Known Limitation, so the checked items are not overstated within their declared scope. |

## Overlay protocols (advisory, spec-folder)
- `feature_catalog_code`: spot-checked — `mcp-open-design/feature_catalog/` (5 sections) and `sk-interface-design/feature_catalog/` (7 sections incl. 07--claude-design-parity) align with the shipped reference surface. No contradiction found this pass. Deeper pass deferred to maintainability.
- `playbook_capability`: `sk-interface-design/manual_testing_playbook/06--licensing-and-provenance/` scenario maps to the verified-clean de-vendor state (iteration 2). Executable as written.

## Assessment
- New findings ratio: 0.50 (P0/P1 override floor; one new P1).
- Dimensions addressed: traceability. Both core hard gates executed and passed within their declared scopes.
- Novelty justification: F005 is the only substantive traceability gap — a runtime-vs-disk drift in the advisor DB. It is independently verified (sqlite byte-count) and reconciled against the team's own disclosure, so the severity reflects active degraded behavior tempered by a documented deferral path.

## Ruled Out
- **Version drift across the three bumped skills:** ruled out — each `SKILL.md` version matches its latest changelog (mcp-open-design 1.2.0, sk-interface-design 1.3.0, sk-prompt 2.3.0.0). No stale-version P1 (the sibling deepseek lineage's F001 class) survives in current state.
- **mcp-figma version bump omission:** ruled out — the summary's Key Decision (`implementation-summary.md:101`) correctly scopes mcp-figma's edit as a sibling repoint (no behavior change → no bump). Verified figma now cites mcp-open-design and not magicpath.
- **Historical magicpath mentions in changelogs / spec 142:** correctly preserved as history (not a sweep gap) per the documented "preserve every historical mention" decision.

## Dead Ends
- None.

## Recommended Next Focus
**Dimension**: Maintainability
**Rationale**: Cover doc-structure quality (duplicate section names in `mcp-open-design/SKILL.md`), version-format convention drift (3-part `1.2.0`/`1.3.0` frontmatter vs 4-part `2.3.0.0`), the sk-interface-design `allowed-tools` least-privilege question deferred from iteration 2, and comment/reference hygiene across the touched references. Then evaluate convergence (all 4 dimensions will be covered).

Review verdict: CONDITIONAL

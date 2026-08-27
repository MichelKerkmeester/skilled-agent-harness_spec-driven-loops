# Iteration 5: D3 Traceability — spec_code core protocol (deprecation census vs executed state)

## Focus
Execute the `spec_code` core protocol against the packet's own census (`004-rehome-rules-content/research/research.md` — 61 touchpoints, classes DONE/TODO/KEEP/KEEP-AS-DOC/DELETE) and the 003/004/005/006 REQ sets. Verify: folder deletion state (H1/H2/H3/H4/H5), root-doc links (G1), command retirement (D1-D8), advisor keyword map (F10), SKILL.md (F3), schema/config surfaces (C8-C10).

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 12
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.35

## Findings

### P1, Required
- **F005**: 004 REQ-003 / SC-003 folder deletion not executed — all 8 fully-inlined rule files (H1: comment-hygiene, cli-dispatch-skill-preload, finding-is-a-hypothesis, main-branch-direct-push, regression-baseline-and-delta, gate-tool-routing; H2: deep-skill-workflow-required, recursion-control) still exist in `.opencode/skills/system-spec-kit/constitutional/`, and root docs AGENTS.md/CLAUDE.md still carry 18 load-bearing `constitutional/*.md` links (G1: AGENTS.md:41,71,72,90,116,363; CLAUDE.md:41,71,72,90,116,363; BARTER.md:59,89,90,108,134,357 — CLAUDE/AGENTS verified, BARTER asserted from census). 004 spec scope says "Delete the `constitutional/` folder"; the research recommendation (Option 1) says keep as unindexed docs but delete the 8 fully-inlined files. Executed state kept the folder wholesale. 006 REQ-003 ("no load-bearing doc/command/hook/test references the **deleted** `constitutional/` folder") is unsatisfiable as written — the folder was never deleted. Undocumented deviation between spec text and executed state.
  - Dimension: traceability

### P2, Suggestion
- **F006**: Advisor keyword map retains the retired tier: `"constitutional memory": [("system-spec-kit", 1.7)]` at `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2001` — census F10 marked this TODO ("remove keyword entry"); not executed. Stale routing keyword survives in the advisor.
  - Dimension: traceability
- **F007**: 006 spec REQ-005 names `DECISIONS.md` ("Given DECISIONS.md, the standing rules previously surfaced by constitutional are present and load every turn") but phase 002 reversed that design ("no new always-loaded surface"; 002 spec.md metadata/continuity 2026-08-26T08:10). No DECISIONS.md exists anywhere (repo-wide find: 0). The acceptance criterion references an artifact the packet deliberately did not build; the underlying steering-parity intent is met via root docs (AGENTS.md/CLAUDE.md inline the rules). Spec wording drift in the verify phase's own requirement set.
  - Dimension: traceability

## Confirmed-Good Checks (negative evidence, vs census)
- C1 indexer flip: DONE (verified iterations 2; memory-index.ts zero refs) ✓
- A1/A3/A4 search defaults + schema surface: DONE (verified iterations 1/3) ✓
- A12 tier config removal: DONE (importance-tiers.ts 6-tier union) ✓
- H5 README: REWRITTEN as plain-docs index ("Constitutional Rules: Reference Documents — No longer a searchable memory tier", README.md:1-10) ✓
- H3/H4 frontmatter strip: DONE — zero `importanceTier` frontmatter across all constitutional/*.md ✓
- F3 SKILL.md: keyword 'constitutional-tier' dropped (SKILL.md:8); non-routable note updated (SKILL.md:94) ✓
- D1 /memory:learn: DEPRECATED banner present (commands/memory/learn.md:2,9) ✓
- D7/D8 YAML tier ladders: zero constitutional in .opencode/commands/{deep,speckit}/ ✓
- C8 search-weights.json: zero constitutional ✓
- C10 budget-allocator.d.ts: zero constitutional ✓
- G3 root-runtime docs (.claude, .cursor, .pi, .codex): census says DONE ✓ (not re-verified)

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | 003 REQ-001/002 pass; 004 REQ-003/SC-003 fail (F005); 006 REQ-003 wording unsatisfiable; 006 REQ-005 stale (F007) | F005/F006/F007 |
| checklist_evidence | pending | hard | deferred to iteration 6 | - |

## Assessment
- New findings ratio: 0.35
- Dimensions addressed: traceability (spec_code)
- Novelty justification: F005 spec-vs-execution contradiction on folder deletion; F006 missed census TODO; F007 stale REQ reference.

## Claim Adjudication (F005)
```json
{
  "findingId": "F005",
  "claim": "The 004 REQ-003 folder deletion was not executed: all 8 fully-inlined rule files remain in constitutional/ and root docs still carry 18 load-bearing links, so 006 REQ-003's acceptance criterion (no references to the DELETED folder) cannot pass as written.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:1",
    ".opencode/skills/system-spec-kit/constitutional/recursion-control.md:1",
    "AGENTS.md:41",
    "CLAUDE.md:41",
    "specs/system-speckit/037-decisions-memory-redesign/004-rehome-rules-content/spec.md:104-126",
    "specs/system-speckit/037-decisions-memory-redesign/004-rehome-rules-content/research/research.md:161"
  ],
  "counterevidenceSought": "Checked for any post-census decision record reversing the deletion (002 continuity says keep-as-docs for the folder; research says delete 8 files under Option 1); searched 004/005/006 spec.md and research.md for an explicit 'deletion skipped' or 'Option 1 partial' decision — none found. Verified all 8 H1/H2 files exist on disk (Aug 26 22:15 mtimes).",
  "alternativeExplanation": "The execution may have intentionally chosen 'keep the folder wholesale' (a superset of Option 1) to minimize link churn, treating the research recommendation as advisory; under that reading the folder is kept-as-docs and links are valid — but the 004 spec's P0 REQ-003 still says 'delete the folder' and 006 REQ-003 says 'deleted folder', so the specs themselves contradict the executed state regardless.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If the packet adds a decision record (e.g., in 006 or a decision-record) explicitly documenting 'folder kept wholesale under Option 1, deletion deferred' and updates 004/006 requirement wording, downgrade to P2 doc drift.",
  "transitions": [
    { "iteration": 5, "from": null, "to": "P1", "reason": "Initial discovery: hard-gate acceptance criterion unmet as written" }
  ]
}
```

## Ruled Out
- "Folder was re-created after deletion": cannot confirm via git (no history access in leaf); mtimes (Aug 26 22:15) are consistent with the execution window writing the folder, but deletion-then-recreation is indistinguishable from never-deleted without git. Recorded as UNKNOWN provenance; the state (files present) is what matters.

## Dead Ends
- DB row deletion (H6) verification: requires opening context-index.sqlite; not executable within leaf write-surface constraints. Deferred to live verification (Deferred Items).

## Recommended Next Focus
Iteration 6 — D3 Traceability (checklist_evidence + packet hygiene): tasks.md/plan.md/implementation-summary.md template residue, 006 spec-internal consistency (description.json, graph-metadata, manifest accuracy vs actual file list), feature_catalog_code overlay.

Review verdict: CONDITIONAL

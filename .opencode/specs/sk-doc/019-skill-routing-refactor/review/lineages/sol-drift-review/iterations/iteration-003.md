# Iteration 3: Advisor and Program Traceability

## Dispatcher

- Focus: traceability
- Scope: advisor paths, program parent map, and implementation evidence

## Findings

### P0

None.

### P1

- **F002 — Advisor reference points to non-authoritative underscore source paths.** The reference cites `mcp_server/lib/scorer/*.ts` and `mcp_server/scripts/skill-graph.json`; the maintained TypeScript and graph artifact are under `mcp-server/`, and the cited underscore graph path does not exist. Copying the documented path breaks verification and sends maintainers into the compatibility tree. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:167-174] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lane-registry.ts:1] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/scoring-constants.ts:1] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json:1]

```json
{"findingId":"F002","claim":"The advisor reference cites stale underscore-tree paths instead of the maintained hyphenated TypeScript and graph sources.","evidenceRefs":[".opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:167-174",".opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lane-registry.ts:1",".opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json:1"],"counterevidenceSought":"Checked both mcp_server and mcp-server trees for the cited TypeScript and graph files; only mcp-server contains the maintained artifacts.","alternativeExplanation":"The underscore tree is a compatibility package, but that does not make the absent paths valid.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if the underscore paths are restored as generated, drift-checked aliases and the reference labels them as compatibility projections."}
```

- **F003 — Router-unification parent still presents the implementation as a seven-phase planned program.** The parent calls phase 007 planned and directs actionable work there, while its child contains completed live activation and runtime-engine evidence. This makes the phase parent's resume and program-state guidance materially stale. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/spec.md:28-43] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/011-runtime-engine/implementation-summary.md:23]

```json
{"findingId":"F003","claim":"The router-unification parent still labels its implementation child planned despite status-bearing evidence of a completed seven-hub runtime cutover.","evidenceRefs":[".opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/spec.md:28-43",".opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/011-runtime-engine/implementation-summary.md:23"],"counterevidenceSought":"Checked whether the child evidence described a separate experimental tree; it explicitly describes the live seven-hub cutover.","alternativeExplanation":"Some later milestones remain planned, but that does not support describing the entire implementation child as planned.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if the parent is explicitly marked as a historical snapshot and a current phase map is linked before the stale table."}
```

### P2

None.

## Next Focus

Inspect the implementation parent itself for exhaustive direct-child coverage.

Review verdict: CONDITIONAL

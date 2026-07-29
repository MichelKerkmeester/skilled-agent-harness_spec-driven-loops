# Iteration 005 — Ordering, verification matrix, templates, cache question

## Focus
State ordering constraints and per-class verification commands; check authoring templates and whether any DB/cache stores mode keys beyond the filesystem.

## Actions Taken
1. Inspected create-skill parent-skill templates for workflowMode/packet placeholders vs live keys.
2. Ran `parent-skill-check.cjs` against sk-code (baseline green) as a verification lever proof.
3. Searched advisor/spec-kit servers for persisted mode-key stores; noted hardcoded `code-quality` hook path in cursor post-tool-use.
4. Synthesized ordering from classes discovered in iterations 1–4.

## Findings

### F21 — Consumer class: create-skill parent-skill templates
- **Class:** Scaffold templates under `sk-doc/create-skill/assets/parent-skill/`
- **Classification:** mostly placeholders (`[mode-a]`, `[hub-prefix]-[mode-a]`) — **not** live old keys; schema label `workflowMode` must stay. Treat as documentation/template surface requiring judgment only where examples cite live hubs.
- **Evidence:** [SOURCE: parent-skill-registry-template.json:24-34], [SOURCE: parent-skill-hub-router-template.json:2,11]

### F22 — Hardcoded cross-skill path to packet scripts
- **Class:** Path position outside the hub tree
- **Classification:** path / must update with directory rename
- **Evidence:** [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:38]  
  `CLAUDE_POST_TOOL_USE_RELATIVE = '.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs'`
- **Implication:** Grep for old packet directory names must include `.opencode/skills/system-*` and hooks, not only the four hubs.

### F23 — DB/cache consumer answer (spec open question)
- Advisor handlers compute `workflowMode` at recommendation time from registry/prompt — not a separate durable mode table found in live advisor code paths searched.
- SQLite files found are advisor graph backups, deep-loop graphs, or executor lineage state — **not** confirmed mode-key stores for sk-hub routing.
- **Verdict:** No filesystem-unreachable durable store of the 21 sk- mode keys was confirmed in this lineage. Residual risk: warm advisor daemon / compiled-routing serving manifests may cache hashes of live config — after rename, restart/recompile serving authority (`compiled-route` / serving snapshot freshness) before trusting parity.
- [SOURCE: advisor-recommend.ts workflowModeForRecommendation], [SOURCE: serving-snapshot freshness fields in iter3]

### F24 — Ordering constraints (Q4)
Recommended sequence (dependency, not calendar):

1. **Freeze map** — already: `assets/rename-map.json`
2. **Directory moves** — rename 20 packet dirs; update SKILL.md `name:` in lockstep
3. **Typed hub identity** — `mode-registry.json` (`workflowMode`,`packet`,`packetSkillName`,`advisorRouting.packetSkillName`) then `hub-router.json` (`tieBreak`,`routerSignals` keys, `resources` paths) — router keys must stay bidirectional with registry [parent-skill-check 5b]
4. **Typed adjuncts** — `leaf-aliases.json`, `command-metadata.json` `ownerMode`, playbook `expected_intent`
5. **Path adjuncts** — command routers, agent template paths, cross-skill hardcoded paths (F22), hub-router resources, graph-metadata `key_files`
6. **Regenerate** — `leaf-manifest.json` via generator; refresh runtime mirrors; rebuild compiled-routing serving snapshots
7. **Judgment pass** — description/graph prose, vocabulary keyword banks, playbook narrative (never bare sweep)
8. **Verify** — doctor + Lane C gates (below)
9. **Exception hold** — `sk-create-skill-parent` key may differ from `sk-create-skill` directory forever

Shared-packet rule: rename `create-skill` directory once; both workflowModes point at the new packet id.

### F25 — Verification matrix (Q5)

| Class | Verify command / check |
|-------|------------------------|
| mode-registry ↔ hub-router ↔ packets on disk | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/<hub>` (rules 3,5,6,10) — confirmed green on sk-code pre-rename |
| leaf-manifest freshness | same check rules 10a–10d / regenerate via `generate-leaf-manifest.cjs` |
| Lane C route gold | `run-skill-benchmark.cjs --skill <hub> --route-gold on` |
| Compiled routing parity | `--compiled-routing-parity on` + `node .opencode/bin/compiled-route.cjs` serving freshness |
| Advisor registry drift | vitest `routing-registry-drift-guard.vitest.ts` under system-skill-advisor |
| Cross-skill path leftovers | `rg` old packet dir names outside renamed hubs (include system-spec-kit hooks) |
| Runtime mirrors | diff `.claude/skills/<hub>/<packet>` (and other mirrors when present) vs `.opencode/skills/...` |

## Questions Answered
- Q4 ordering constraints stated
- Q5 verification levers named per major class
- Spec open question on DB/cache: no confirmed durable mode-key store; residual daemon/compiled-cache risk noted

## Ruled Out / Dead Ends
- Ruled out treating parent-skill templates' bracket placeholders as rename targets. [SOURCE: parent-skill-registry-template.json placeholders]
- Ruled out claiming a proven SQLite table of sk- mode keys without schema evidence.

## Next Focus
None — maxIterations=5 reached; proceed to synthesis.

## SCOPE VIOLATIONS
None.

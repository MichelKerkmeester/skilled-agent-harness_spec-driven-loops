# Research Synthesis — sk- prefix rename surface discovery

**Lineage:** grok-4-5-high (`cli-cursor` / `cursor-grok-4.5-high`)  
**Session:** `fanout-grok-4-5-high-1785183212749-q9al64`  
**Stop reason:** `max_iterations` (5/5)  
**Topic:** Enumerate every surface a 20-packet / 21-workflowMode `sk-` prefix rename must touch across sk-code, sk-design, sk-doc, sk-prompt.

---

## 1. Executive answer

A rename that only moves directories will fail. Consumer classes fall into three rewrite postures:

| Posture | Meaning | Examples |
|---------|---------|----------|
| **Typed / safe-to-sweep** | Known JSON/YAML fields whose values are mode or packet ids | `mode-registry.workflowMode/packet`, `hub-router.tieBreak` + `routerSignals` keys, `leaf-aliases.workflowMode`, `command-metadata.ownerMode`, playbook `expected_intent` |
| **Path position** | Filesystem paths or path strings embedding packet dirs | Packet directories, `hub-router.resources`, SKILL `name:`, command/agent template paths, `.claude` skill mirrors, system-spec-kit hook path to `code-quality` |
| **Requires-judgment / free prose** | English or narrative where bare keys collide | `vocabularyClasses.keywords`, `description.json` / `graph-metadata` prose, playbook narrative quoting `workflowMode: interface` |

**Generated (rebuild, do not hand-edit):** `leaf-manifest.json`; compiled-routing / Lane C `benchmark/reports/**`; runtime skill mirrors after sync.

**Deliberate exception:** `sk-create-skill-parent` keeps a key that differs from directory `sk-create-skill`.

---

## 2. Consumer class catalog (REQ-001)

| ID | Class | Representative path | Field / pattern |
|----|-------|---------------------|-----------------|
| C1 | Mode registry identity | `.opencode/skills/<hub>/mode-registry.json` | `modes[].workflowMode`, `packet`, `packetSkillName`, `advisorRouting.packetSkillName` |
| C2 | Hub router keys + paths | `.opencode/skills/<hub>/hub-router.json` | `routerPolicy.tieBreak[]`, `routerSignals.<mode>`, `resources[]` paths |
| C3 | Packet directories + SKILL name | `.opencode/skills/<hub>/<packet>/` + `SKILL.md` | directory basename; frontmatter `name:` (20/20 match today) |
| C4 | Leaf manifest (generated) | `.opencode/skills/<hub>/leaf-manifest.json` | `modes[].workflowMode` + leaf paths |
| C5 | Leaf aliases | `.opencode/skills/sk-doc/leaf-aliases.json` | `workflowMode` |
| C6 | Hub advisor identity pair | `description.json`, `graph-metadata.json` | path `key_files`; prose `category`/`domains`/`causal_summary` |
| C7 | Playbook route gold | `**/manual-testing-playbook/**/*.md` | YAML `expected_intent:` |
| C8 | Playbook narrative | same | prose `workflowMode: <key>` assertions |
| C9 | Benchmark archives | `**/benchmark/reports/**` | `gold_mode`, embedded keys (regenerate) |
| C10 | Lane C fixtures | `benchmark/fixtures/**`, deep-improvement fixture assets | `expected.*` when present |
| C11 | Command routers | `.opencode/commands/interface/*.md`, `create/*.md` | `workflowMode=…`, packet path literals |
| C12 | Command metadata | `sk-design/command-metadata.json` | `ownerMode` |
| C13 | Agent definitions | `.opencode/agents/*` + runtime mirrors | template paths into packets |
| C14 | Runtime skill mirrors | `.claude/skills/<hub>/…` (others may exist elsewhere) | mirrored packet trees |
| C15 | Cross-skill hardcoded paths | e.g. system-spec-kit cursor hook | absolute-relative path to `sk-code/code-quality/...` |
| C16 | Authoring templates | `sk-doc/create-skill/assets/parent-skill/*` | placeholders — usually not live rename targets |

Frozen map authority: `.opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/assets/rename-map.json` (21 rows).

---

## 3. Typed vs prose (REQ-002)

| Class | Safe-to-sweep? | Collision risk |
|-------|----------------|----------------|
| C1 registry fields | Yes | Low in-field; high if bare `rg` for `quality`/`interface`/`diff` |
| C2 router keys / tieBreak | Yes for keys/array members | Medium — same tokens appear in keyword banks |
| C2 `resources` paths | Path rewrite | Low |
| C2 `vocabularyClasses.keywords` | **No** — judgment | **High** (English synonyms) |
| C3 dirs + SKILL name | Path / typed frontmatter | N/A |
| C5 leaf-aliases | Yes | Low |
| C6 description/graph prose | **No** | High |
| C7 expected_intent | Yes | Low in YAML; high in adjacent Markdown |
| C8 playbook narrative | Judgment | High for `interface`/`quality` |
| C11 command routers | Mixed | Path yes; prose judgment |
| C12 ownerMode | Yes | Low |
| C15 cross-skill paths | Path | Low |

**Sweep rule:** rewrite only typed fields and known path slots; never bare-token replace in Markdown or keyword synonym arrays.

---

## 4. Generated vs edited (REQ-003)

| Artifact | Action |
|----------|--------|
| `leaf-manifest.json` | Regenerate (`generate-leaf-manifest.cjs`); prove with parent-skill-check 10b |
| `benchmark/reports/**` | Re-run Lane C / compiled-routing; additive run-label folders |
| Runtime skill mirrors | Re-sync from `.opencode/skills` after directory rename |
| Compiled serving snapshots | Refresh; do not hand-edit stale snapshots |
| mode-registry, hub-router, leaf-aliases, command-metadata, playbook expected_intent, SKILL name, command path literals | Edit |
| description/graph prose, vocabulary keywords | Judgment edit |

---

## 5. Ordering constraints (REQ-004)

1. Keep rename-map frozen.  
2. Move packet directories; update SKILL `name:` with the move.  
3. Update mode-registry typed fields, then hub-router keys/paths (bidirectional).  
4. Update leaf-aliases, command-metadata, playbook `expected_intent`.  
5. Update path adjuncts (commands, agents, cross-skill hooks, graph key_files).  
6. Regenerate leaf-manifest; sync mirrors; refresh compiled serving.  
7. Judgment pass on prose/keywords.  
8. Verify (section 6).  
9. Preserve `sk-create-skill-parent` ≠ `sk-create-skill` directory exception.

Shared packet: rename `create-skill` once; both modes retarget the new packet id.

---

## 6. Verification levers (REQ-005)

| Class | Command |
|-------|---------|
| Hub structural integrity | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/<hub>` |
| Leaf manifest | Rules 10a–10d of the same check |
| Route gold | `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs --skill <hub> --route-gold on` |
| Compiled parity | add `--compiled-routing-parity on`; `node .opencode/bin/compiled-route.cjs` |
| Advisor drift | `routing-registry-drift-guard.vitest.ts` |
| Leftover old names | repo `rg` for old packet dirs / old keys in typed positions; include `system-spec-kit` hooks |
| Mirrors | diff runtime trees vs `.opencode/skills` |

Pre-rename baseline: `parent-skill-check` on sk-code returned OK (all hard invariants passed).

---

## 7. DB / cache open question

No confirmed durable database table of the 21 sk- mode keys was found. Advisor emits `workflowMode` at recommend time from live registry/prompt. Residual risk: warm daemons and compiled-routing serving manifests cache config hashes — restart/recompile after rename before trusting parity.

---

## 8. Iteration trail

| Iter | Focus | newInfoRatio | Status |
|------|-------|--------------|--------|
| 1 | Typed hub registry/router + leaf-manifest | 1.00 | complete |
| 2 | Advisor metadata, leaf-aliases, SKILL names | 0.85 | complete |
| 3 | Benchmark gold / expected_intent | 0.75 | complete |
| 4 | Commands, agents, mirrors | 0.70 | complete |
| 5 | Ordering, verify matrix, templates, cache | 0.65 | complete |

Convergence ratios trended down but stopPolicy=`max-iterations` forced full five passes (early convergence treated as telemetry only).

---

## 9. Ruled-out directions

- Sweeping `vocabularyClasses.keywords` as typed mode keys  
- Hand-editing historical `benchmark/reports/**`  
- Renaming `system-skill-advisor` workflowMode as part of this map  
- Assuming all four runtime mirrors exist in every worktree  
- Treating parent-skill template placeholders as live old keys  
- Claiming a proven SQLite mode-key table without schema evidence  

---

## 10. Independent-lineage note (REQ-006)

This document is the **grok-4-5-high** lineage only. Disagreements with the sibling `glm-5-2` lineage must be recorded at merge time, not averaged away.

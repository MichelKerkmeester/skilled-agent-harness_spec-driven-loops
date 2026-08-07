# Iteration 002 — Classify typed vs path vs prose; collision risk (Q2)

**Focus (Q2):** Classify every Class A–G occurrence as typed-safe-to-sweep, path-position, or free-prose-with-English-collision. Pull field-level evidence for Class F (graph-metadata.json) and Class G (command-metadata.json).

**Lineage:** glm-5-2 | **Executor:** cli-devin glm-5-2 | **Status:** complete

---

## Approach

Read `graph-metadata.json` (all four hubs) and `command-metadata.json` (sk-design). Classify each field carrying a workflowMode key or packet dir name by sweep safety. Collision risk is assessed per bare key: a key that is also an ordinary English word is a prose-sweep hazard.

## Class F — `graph-metadata.json` (4 files) — field evidence

Generated/derived artifact (has `derived` block with `created_at`/`last_updated_at`). Carries packet names in THREE positions:

| Field | Carries | Classification | Representative path:line |
|-------|---------|----------------|---------------------------|
| `category` | packet-family label | typed (string) — but value is a family label not the dir (`code-quality` for sk-code, `design`/`utility` for others) | [SOURCE: .opencode/skills/sk-code/graph-metadata.json:5] (`code-quality`) |
| `domains[]` | packet-name literals in prose array | free-prose (array of prose tokens) | [SOURCE: .opencode/skills/sk-code/graph-metadata.json:66] (`code-quality`) |
| `derived.key_topics[]` | packet-name + mode labels in prose | free-prose | [SOURCE: .opencode/skills/sk-code/graph-metadata.json:172] (`code-quality`), :175 (`workflowMode` literal — the discriminator name, not a key value) |
| `derived.source_docs[]` | packet-dir-prefixed relative paths | path-position | [SOURCE: .opencode/skills/sk-code/graph-metadata.json:198-205] (`code-webflow/references/...`, `code-opencode/SKILL.md`) |
| `derived.key_files[]` | absolute paths with packet dir segment | path-position | [SOURCE: .opencode/skills/sk-code/graph-metadata.json:212-228] (`.opencode/skills/sk-code/code-quality/SKILL.md`, `.../code-webflow/...`, `.../code-opencode/...`) |
| `derived.entities[].path` | absolute paths with packet dir segment | path-position | [SOURCE: .opencode/skills/sk-code/graph-metadata.json:240,246,252] |
| `derived.entities[].name` | packet-derived entity name | typed (string) | [SOURCE: .opencode/skills/sk-doc/graph-metadata.json:145] (`create-skill`), [SOURCE: .opencode/skills/sk-prompt/graph-metadata.json:140] (`prompt-improve`) |

**Verdict:** graph-metadata.json is a GENERATED artifact — the `derived` block is rebuilt by an indexer, not hand-edited. The `category`/`domains` top-level fields are also generator-emitted. → must be rebuilt, not swept (see iteration 3).

## Class G — `command-metadata.json` (sk-design; 1 file) — field evidence

| Field | Carries | Classification | Representative path:line |
|-------|---------|----------------|---------------------------|
| `[].ownerMode` | workflowMode key | typed (string) | [SOURCE: .opencode/skills/sk-design/command-metadata.json:4] (`interface`), :376 (`md-generator`) — also :239,:253,:267,:281 (sub-commands all `interface`) |
| `[].command` | slash command bound to mode | typed (string) — namespace prefix `/interface:` derives from mode | [SOURCE: .opencode/skills/sk-design/command-metadata.json:3] (`/interface:design`) |
| `[].choreography[].skill` | packetSkillName | typed (string) | [SOURCE: .opencode/skills/sk-design/command-metadata.json:84,90,96] (`design-interface`), :455,461,467 (`design-md-generator`) |
| `[].choreography[].resource` | absolute paths with packet dir segment | path-position | [SOURCE: .opencode/skills/sk-design/command-metadata.json:85,91,97] (`.../design-interface/SKILL.md`, `.../design-interface/procedures/`, `.../design-interface/references/`), :456,462,468 (`design-md-generator/...`) |
| `[].next[]`, `handoff.nextOptions[].command` | slash commands | typed (string) | [SOURCE: .opencode/skills/sk-design/command-metadata.json:108] (`/interface:design-reference`) |

24 occurrences of `design-interface`/`design-md-generator`/`design-mcp-open-design` in this file [SOURCE: grep count, .opencode/skills/sk-design/command-metadata.json].

## Q2 Classification Matrix (all classes A–G)

| Class | Field | Classification | Collision risk |
|-------|-------|----------------|----------------|
| A mode-registry | `modes[].workflowMode` | typed-safe-to-sweep | exact string — safe |
| A mode-registry | `modes[].packet`, `packetSkillName`, `advisorRouting.packetSkillName` | typed-safe-to-sweep | exact string — safe |
| A mode-registry | `modes[].command` | typed-safe-to-sweep | slash command; `/interface:`, `/create:` namespaces — safe |
| A mode-registry | `modes[].proceduresPath` | path-position | packet-dir prefix — path-aware sweep |
| A mode-registry | `modes[].aliases[]` | free-prose | **HIGH for `quality`,`interface`** (bare English); low for compound keys |
| A mode-registry | `extensions.*.surfaces[]`/`transports[]` | typed-safe-to-sweep | exact string — safe |
| B hub-router | `routerPolicy.tieBreak[]` | typed-safe-to-sweep | exact string — safe |
| B hub-router | `routerSignals.{key}` (object key) | typed-safe-to-sweep | object key — safe (structured) |
| B hub-router | `routerSignals.{key}.resources[]` | path-position | packet-dir prefix — path-aware sweep |
| B hub-router | `vocabularyClasses.{key}.keywords[]` | free-prose | **HIGH for `quality`,`interface`**; `code-quality`/`code-review` literals are compound (lower) |
| C leaf-manifest | `modes[].workflowMode`, `modes[].packet` | typed-safe-to-sweep | exact string — safe |
| C leaf-manifest | `modes[].leaves[]` | path-position (resolution root is packet dir) | leaf strings are relative to packet dir; the dir rename changes resolution root, leaf strings themselves do NOT contain the packet dir |
| D leaf-aliases | `[].workflowMode` | typed-safe-to-sweep | exact string — safe |
| D leaf-aliases | `[].diskPath` | path-position | `shared/`-prefixed — NOT packet dir; no rename needed |
| E description | `keywords[]` | free-prose | **HIGH for `quality`** ([SOURCE: .opencode/skills/sk-code/description.json:41] `code-quality` is compound, lower); `interface` not present in sk-design description keywords (verify) |
| F graph-metadata | `category`, `domains[]`, `key_topics[]` | typed / free-prose | GENERATED — rebuild, do not sweep |
| F graph-metadata | `source_docs[]`, `key_files[]`, `entities[].path` | path-position | GENERATED — rebuild, do not sweep |
| G command-metadata | `ownerMode`, `choreography[].skill`, `command`, `next[]` | typed-safe-to-sweep | exact string — safe |
| G command-metadata | `choreography[].resource` | path-position | absolute path with packet dir segment — path-aware sweep |

## Collision-risk register (bare-English workflowMode keys)

| workflowMode | English-word? | Prose-sweep hazard | Mitigation |
|--------------|---------------|--------------------|------------|
| `quality` | YES | HIGH — appears in ordinary prose ("code quality", "quality gate", "quality check") | sweep only typed fields + path positions; never regex-sweep prose for bare `quality` |
| `interface` | YES | HIGH — appears in ordinary prose ("user interface", "interface design", "API interface") | sweep only typed fields + path positions; never regex-sweep prose for bare `interface` |
| `md-generator` | no | low | — |
| `code-review`/`code-webflow`/`code-opencode` | no (compound) | low | — |
| `create-*` (11 keys) | no (prefixed) | low | — |
| `prompt-improve`/`prompt-models` | no | low | — |
| `design-mcp-open-design` | no | low | — |

**Key insight:** only TWO of the 21 workflowMode keys (`quality`, `interface`) are bare-English collision hazards. All packet dir names are compound (`code-quality`, `design-interface`, etc.) so path-position sweeps are safe. The rename to `sk-code-quality`/`sk-design-interface` ELIMINATES the collision for future sweeps because the new keys are unique prefixed tokens.

## What Worked
- `grep -n '"ownerMode"\|"skill":\|"resource":'` gave all Class G typed+path evidence in one pass.
- Cross-hub `grep` on graph-metadata.json confirmed the `category`/`key_topics`/`source_docs`/`key_files` pattern is uniform across all four hubs.

## What Failed / Ruled Out
- Could not field-verify every `keywords[]`/`aliases[]` prose entry across all hubs within budget; sampled sk-code. Ruled out exhaustive prose enumeration — prose positions are flagged as a class, not individually swept.

## Carried-Forward Open Questions
- Which artifacts are generated (must be rebuilt) vs hand-edited — graph-metadata.json and command-metadata.json are candidates; need to confirm the generator and whether command-metadata.json is hand-authored or generated (Q3).
- Command bindings (`.opencode/commands/`), agent definitions (`.opencode/agents/`), runtime mirrors (`.claude/`,`.cursor/`,`.codex/`,`.devin/`), benchmark gold — still uninspected.
- DB/cache consumers — still uninspected.

## Next Focus
Q3: identify which artifacts are generated and must be rebuilt rather than hand-edited. Inspect `.opencode/commands/` for command bindings that reference mode keys, and determine the generator behind graph-metadata.json / description.json / command-metadata.json.

## newInfoRatio: 0.7
Novelty justification: added field-level evidence for Class F and G (previously only identified), produced the full typed/path/prose classification matrix, and isolated the two bare-English collision hazards (`quality`,`interface`) — a non-trivial narrowing. Not fully novel because it builds on iteration 1's class inventory.

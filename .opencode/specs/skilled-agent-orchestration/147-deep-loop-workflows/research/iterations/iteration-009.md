# Deep-Research Iteration 009: advisor graph migration and routing parity

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

I’ll keep this read-only, first load the established context and advisor/memory routing context, then verify the specific advisor graph and routing files before making a single recommendation.
The advisor MCP transport closed, so I’m using the documented local advisor fallback before proceeding with file reads.
SKILL ROUTING: fallback advisor surfaced `deep-context` 0.95 and `system-skill-advisor` 0.94; I’ll use those as read-only guidance for context gathering and advisor internals.
The required baseline report is the source of truth for this iteration, so I’m reading it fully before touching the narrower advisor files.
I’ve finished the baseline report. Next I’m reading the advisor scorer, graph DB, parity fixtures, and the five metadata files, plus grepping hard references that source graph scans will not fully model.
One requested fixture path differs on disk: `intent-prompt-corpus.ts` is not at the tests root, so I’m locating it and reading the indexer continuation where rejected edges and cascaded deletions are handled.
The parity fixture corpus only contains `deep-ai-council`; `deep-context` is absent there too. I’m checking the projection and Python deep-routing implementation so the recommendation accounts for both native scorer and legacy parity paths.
The legacy Python router has a separate three-skill deep-routing layer, which is more than metadata aliasing; I’m reading the rest of that function before deciding the alias strategy.
Current TypeScript alias groups appear to be validation-oriented, while the Python advisor has a stronger hardcoded routing layer. I’m checking imports and command/file reference lists to avoid conflating those surfaces.
The native scorer has hardcoded per-mode scoring lanes outside `aliases.ts`, so routing granularity is not solely controlled by graph metadata. I’m reading those lane maps now.
I’m using `rg` directly now for complete file lists/counts because the regular Grep output truncates at 100 matches and this slice needs a full reference inventory.
The complete reference inventory confirms many non-metadata refs. I’m sampling the high-impact command YAML/markdown blocks and runtime graph metadata so the migration steps cite concrete edit sites rather than just counts.
The research YAML slice started just after the `skill:` line, so I’m reading the preceding block to capture the exact reference line.
I’m checking the runtime council files separately because those code references are outside skill metadata and will not be fixed by a skill-graph scan.
`deep-loop-runtime/lib/council/*.cjs` has no literal old skill IDs; the literal runtime-side code hits are in `scripts/fanout-*`. I’m checking the council replay script named by the baseline too.
I’m verifying the finite inbound graph edges named in the baseline from their source metadata, because those are the exact files that need repointing after the five old nodes disappear.
I’m verifying the trigger/intent union count from the five source metadata files so the recommendation uses measured numbers rather than only the baseline estimate.
The count probe failed because shell command substitution ate JavaScript backticks; I’m rerunning it with plain string concatenation.
Before finalizing the alias recommendation, I’m verifying whether scorer lane boosts can rank IDs that are no longer projection nodes. That decides whether old per-mode IDs can be kept as expected outputs or must become mode annotations under the new skill.
**Recommendation**

Collapse the advisor’s public skill identity to one canonical skill key, `deep-loop-workflows`, but preserve per-mode routing as a first-class mode discriminator. Do not keep the old five skill IDs as rankable advisor skills. Instead, treat `deep-research`, `deep-review`, `deep-context`, `deep-improvement`, and `deep-ai-council` as mode aliases that resolve to `skill=deep-loop-workflows` plus `mode=<research|review|context|improvement|council>`.

This is the only option that satisfies the folder-bound `skill_id` rule and preserves routing granularity. A pure one-key collapse without mode metadata flattens the workflows and violates the “preserve per-mode behavior” constraint. Keeping old per-mode IDs as advisor skill outputs conflicts with the new one-folder graph node, and the native scorer only ranks IDs that exist in the projection.

**Why This Option Wins**

The graph database enforces `skill_id === folder name`: `skill-graph-db.ts:654-658`. The merged folder must therefore expose `skill_id: "deep-loop-workflows"`, not five old IDs.

The scorer ranks only `projection.skills`: `fusion.ts:357-415`. After the five old graph nodes disappear, hardcoded lane scores for `deep-research`, `deep-review`, or `deep-improvement` become inert unless they are either remapped to `deep-loop-workflows` or represented as separate command/mode bridges.

A single flat alias group would make `deep-review` and `deep-research` equivalent under `skillMatchesAlias`, which is wrong for mode parity. Current alias equality is simple canonicalization, not a two-level “same skill, different mode” model: `aliases.ts:52-68`.

The existing parity suite already treats deep routing as mode selection, not generic skill selection. `routing-parity-deep-skills.vitest.ts:20-23` models only `deep-review | deep-research | deep-ai-council`, and tests assert mode winners in `routing-parity-deep-skills.vitest.ts:41-111`.

**Rejected Alternatives**

Reject “keep old IDs as canonical advisor skills.” It violates the folder binding and leaves a graph with fake skills after `.opencode/skills/deep-research`, `.opencode/skills/deep-review`, etc. stop being real skill folders.

Reject “collapse everything to one alias key with no mode discriminator.” It preserves the graph but loses the routing distinctions that the Python Candidate-3 router explicitly exists to protect: `skill_advisor.py:2301-2308`, `skill_advisor.py:2449-2508`.

Reject “put all old IDs into one `SKILL_ALIAS_GROUPS["deep-loop-workflows"]` and call it done.” That helps validation compare old expected labels to the new skill, but it also makes old mode IDs indistinguishable unless a separate mode-alias API is added.

**Deep-Context Routing**

`deep-context` is absent from `aliases.ts`. The file defines groups for `deep-research`, `deep-review`, `deep-improvement`, `deep-model-benchmark`, and `deep-ai-council`: `aliases.ts:13-47`.

`deep-context` is also absent from the Python Candidate-3 deep-routing tuple, which only includes `deep-review`, `deep-research`, and `deep-ai-council`: `skill_advisor.py:2307`.

It currently routes through graph/projection metadata rather than dedicated alias/routing code. Its metadata has strong `intent_signals` and trigger phrases at `deep-context/graph-metadata.json:54-77`, and the native projection loads metadata-derived signals into skill projections at `projection.ts:337-364`. The explicit and lexical lanes then score projection skills dynamically at `explicit.ts:313-323` and `lexical.ts:63-79`.

That asymmetry is real and should be fixed during migration by adding `context` to the deep-loop mode alias/router layer, not by leaving it dependent on generic metadata matching.

**Family Decision**

Use `family: "deep-loop"` for `deep-loop-workflows`.

`deep-loop` is allowed by the type and runtime allowlist: `SkillFamily` includes it at `skill-graph-db.ts:39`, and `ALLOWED_FAMILIES` includes it at `skill-graph-db.ts:133-140`. The database schema also allows it in the `CHECK` constraint at `skill-graph-db.ts:172-176`.

This means the two former `sk-util` skills should collapse into `deep-loop` as workflow modes. Current evidence: `deep-ai-council` is `family: "sk-util"` at `deep-ai-council/graph-metadata.json:3-5`, and `deep-improvement` is `family: "sk-util"` at `deep-improvement/graph-metadata.json:3-5`. The merged skill is no longer a generic utility; it is the workflow/persona layer paired with `deep-loop-runtime`.

**Routing-Parity Fixture Impact**

Skill-level expected outputs must change to `deep-loop-workflows`, or the assertions must become alias-aware against `deep-loop-workflows`.

Mode-level expected outputs should not be rewritten to `deep-loop-workflows`. They should remain `research`, `review`, `context`, `improvement`, and `council` mode assertions, preferably by changing payloads to `{ "skill": "deep-loop-workflows", "mode": "research" }`.

Concrete fixture impact:

| Path | Current shape | Recommendation |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts` | `winner` is old mode skill ID: `deep-review | deep-research | deep-ai-council` at lines 20-23 | Rename conceptually to deep-loop mode parity; keep mode winners, add/assert canonical skill if payload is extended |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts` | expects `deep-ai-council` at lines 68-70 and 127-130 | Rewrite to `expectedSkill: "deep-loop-workflows"` plus `expectedMode: "council"` |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/harder-intent-prompt-corpus.ts` | expects `deep-research`, `deep-review`, `deep-ai-council` at lines 110-142 | Rewrite skill to `deep-loop-workflows`, preserve old value as mode |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | direct expects/cases for old IDs around lines 348-356 and 391-411 | Update alias tests to separate skill canonicalization from mode canonicalization |

**Concrete Advisor Code Changes**

Change these files deliberately, not by blind search-replace:

| Path | Required change |
|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Replace single-level old skill alias semantics with a two-level model: canonical skill alias to `deep-loop-workflows`, and per-mode alias mapping for old IDs/commands |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` | Update command bridges that hardcode deep command IDs, including research/review bridge keywords at `projection.ts:46-57` and model benchmark bridge at `projection.ts:123-136` |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Remap hardcoded boosts from old IDs to `deep-loop-workflows` while preserving mode evidence, especially lines 96-99, 116-138, 163-174, 186-187, 290-302 |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts` | Replace old `CATEGORY_HINTS` keys with `deep-loop-workflows` and/or mode-aware hints; current old keys are at lines 31-33 |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Update special-case bonuses/penalties for old IDs, especially `deep-ai-council` at lines 233-235 and `deep-review`/`deep-research` bonuses at lines 264-308 |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Keep Candidate-3 as mode router, but return/propagate canonical skill separately; old alias groups are at lines 228-262, old intent boosts at lines 1639-1730, command bridges at lines 1821-1852, deep routing at lines 2301-2508 |

**Graph Metadata Migration**

Create one metadata source:

` .opencode/skills/deep-loop-workflows/graph-metadata.json`

Use:

`skill_id: "deep-loop-workflows"`

`family: "deep-loop"`

`category: "autonomous-loop"` or `"workflow"`; I recommend `"autonomous-loop"` only if all downstream category consumers tolerate council/improvement being loop modes. If category is semantically consumed elsewhere, use `"workflow"` to avoid implying every mode is graph-convergent.

Delete or stop scanning these five old metadata files after content has moved:

`.opencode/skills/deep-ai-council/graph-metadata.json`

`.opencode/skills/deep-context/graph-metadata.json`

`.opencode/skills/deep-improvement/graph-metadata.json`

`.opencode/skills/deep-research/graph-metadata.json`

`.opencode/skills/deep-review/graph-metadata.json`

The indexer deletes missing nodes before republishing edges: `skill-graph-db.ts:836-842`, `skill-graph-db.ts:938-940`. Foreign-key cascade removes node-owned edges because both `source_id` and `target_id` references use `ON DELETE CASCADE`: `skill-graph-db.ts:189-193`.

Do not naively repoint multiple same-source/same-type edges to the same target as separate entries. The table has `UNIQUE(source_id, target_id, edge_type)`: `skill-graph-db.ts:196`. Multiple `system-skill-advisor enhances deep-loop-workflows` entries would collapse into one row. Merge their contexts into one edge.

Repoint these finite inbound sources:

| Source file | Current old target evidence | Required target |
|---|---|---|
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | `deep-research`, `deep-review`, `deep-improvement`, `deep-ai-council` at lines 45-90 | One merged `enhances -> deep-loop-workflows` edge with context naming all modes |
| `.opencode/skills/sk-code-review/graph-metadata.json` | `prerequisite_for -> deep-review` at lines 23-29 and manual related at lines 35-39 | `deep-loop-workflows`, mode context `review` |
| `.opencode/skills/sk-prompt/graph-metadata.json` | `siblings -> deep-improvement` at lines 25-31 | `deep-loop-workflows`, mode context `improvement` |
| `.opencode/skills/system-spec-kit/graph-metadata.json` | `prerequisite_for -> deep-ai-council` at lines 39-43 and manual refs at lines 57-59 | `deep-loop-workflows`, mode context `council` plus research/review manual refs |
| `.opencode/skills/deep-loop-runtime/graph-metadata.json` | `enhances`/`siblings` to context/review/research at lines 16-49 and manual refs at lines 57-62 | One `enhances` and one `siblings` edge to `deep-loop-workflows`, plus manual refs collapsed |

Union metadata, do not pick one source. I measured the five source metadata files as 63 total trigger phrases, 60 unique after exact deduplication, 69 total intent signals, 63 unique, 28 domains, 25 unique.

**References A Graph Scan Will Not Catch**

These are code/command references, not graph metadata edges, so deleting nodes and rescanning is insufficient:

| Surface | Evidence |
|---|---|
| TypeScript projection command bridges | `projection.ts:46-57`, `projection.ts:123-136` |
| TypeScript explicit/lexical scorer lanes | `explicit.ts:96-99`, `explicit.ts:116-138`, `explicit.ts:163-174`, `lexical.ts:31-33` |
| Python fallback advisor aliases/routing | `skill_advisor.py:228-262`, `skill_advisor.py:1639-1730`, `skill_advisor.py:1821-1852`, `skill_advisor.py:2301-2508` |
| Command YAML skill references | context `deep_start-context-loop_auto.yaml:77-85`; research `deep_start-research-loop_auto.yaml:66-76`; review `deep_start-review-loop_auto.yaml:55-64`; improvement `deep_start-agent-improvement-loop_auto.yaml:79-95`; council `deep_ask-ai-council_auto.yaml:40-52` |
| Command markdown routers | research self-path at `start-research-loop.md:88-90`; skill benchmark `skill: deep-improvement` at `start-skill-benchmark-loop.md:1-4` and script path at lines 75-83; non-dev AI system `skill: deep-improvement` at `start-non-dev-ai-system-loop.md:1-4` and script path at lines 76-86 |
| Runtime fanout scripts | `fanout-run.cjs:130-137`, `fanout-merge.cjs:317-320`, `fanout-salvage.cjs:13-16` |
| Council replay/orchestration paths | `replay-graph-from-artifacts.cjs:21-27`, `replay-graph-from-artifacts.cjs:51-66`; deep-ai-council scripts import runtime council primitives in grep hits from `orchestrate-session.cjs` and `orchestrate-topic.cjs` |
| Generated/static advisor graph JSON | `mcp_server/scripts/skill-graph.json` and `mcp_server/database/skill-graph.json` showed old IDs in `rg`; regenerate instead of hand-editing if they are generated artifacts |

**Post-Scan Verification**

After the implementation migration, run the trusted advisor graph scan/rebuild path, then require:

`rejectedEdges === 0`

No `UNKNOWN-TARGET` warnings. The indexer emits those at `skill-graph-db.ts:992-997`.

No old skill IDs outside allowed archives/changelogs/generated historical records. Use an `rg -n` sweep over `.opencode/skills/system-skill-advisor`, `.opencode/commands`, `.opencode/skills/deep-loop-runtime`, and the new `.opencode/skills/deep-loop-workflows`.

Run routing parity in both layers:

Native scorer tests for `advisor_recommend` should assert `topSkill === "deep-loop-workflows"` plus expected mode attribution.

Python legacy `--deep-skill-routing-json` tests should assert mode winners remain distinct and should add `deep-context` and `deep-improvement` coverage.

**Risks**

The highest routing risk is accidentally making mode aliases skill-equivalent and masking `deep-review` vs `deep-research` regressions.

The highest graph risk is duplicate collapsed inbound edges silently overwriting context because of the unique `(source_id, target_id, edge_type)` constraint.

The highest parity risk is native scorer hardcoded boosts pointing at deleted projection IDs, causing old deep prompts to lose confidence after the graph node collapse.

The highest pre-existing asymmetry is `deep-context`: metadata routes it today, but aliases and Candidate-3 do not.

**Dependencies**

This recommendation assumes the command surface stays stable and commands continue to choose mode. It depends on Q-ARCH layout decisions for new paths, Q-AGENT for whether agent names stay stable, Q-CMD for whether the 8 command surfaces stay separate, Q-IMPROVE for how improvement lanes become modes/submodes, and Q-GOV for whether feature catalog/playbook trees stay mode-scoped.

I'M UNCERTAIN ABOUT THIS: whether the final advisor response schema is allowed to add an explicit `mode` field. If not, mode must be surfaced in attribution/trace first, but parity fixtures should still model `{skill, mode}` internally to avoid flattening behavior.

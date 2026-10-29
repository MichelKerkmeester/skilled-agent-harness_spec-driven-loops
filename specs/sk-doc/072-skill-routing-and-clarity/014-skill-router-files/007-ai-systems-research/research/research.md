# Research: moving the machine router of the 16 AI Systems skills into a sibling ROUTER.md

Target repository: `/Users/michelkerkmeester/MEGA/Development/AI Systems` (`Barter-BV/marketing-ai-systems`), commit `8e4573b8f`, folder `AI Systems/`, with `specs/`, `runtime/`, `scratch/` and `node_modules/` excluded.
Canon source: this repository, phase `003-check-and-template-canon` - a sibling `ROUTER.md` holding the machine router under a final `## MACHINE ROUTER` heading, and a link from `SKILL.md`.
Every `[SOURCE: ...]` path below is relative to the AI Systems checkout root unless it begins with `.skilled/`, in which case it is the vendored copy inside that checkout.

## 1. Executive Summary

The move is worth doing and cheaper than it looks. Of the 17,935 words that the 16 routing sections carry, 13,130 are machine data - about 17,460 tokens loaded on every invocation of a skill - and only 4,805 are prose a model needs to read. Four skills already prove the shape: three Moneybird packets keep their router in a sibling file and their `SKILL.md` down to 45 to 50 routing words.

Three facts decide the plan. No loader reads a file beside `SKILL.md`, so the canon's pointer link is the only way a router comes back in. Claude Projects have no automated path at all, so a Project receives a router only through a hand-written knowledge document that repeats it. And two gate families stand in the way: a Product Owner gate that treats a packet `ROUTER.md` as residue, and two benchmark gates that slice the routing prose out of `SKILL.md` by literal heading.

## 2. Background

The 16 skills live one folder deep under seven system roots. Their routing sits in `## 2. SMART ROUTING`, written as pseudocode, tables and assignment lists, and reached through one command document. Four `ROUTER.md` files exist - the Product Owner hub and three Moneybird packets - but none closes with a `## MACHINE ROUTER` section. This phase answers five questions so phase 008 can move each router without breaking a runtime, a benchmark or a Claude Project.

## 3. Objectives

- RQ-1: the prose and machine-data split per skill, with word counts.
- RQ-2: what loads these skills, and whether a loader reads a sibling file on its own.
- RQ-3: every check or benchmark gate that reads a routing section or a `ROUTER.md`, with `file:line`, and which of this repository's tools apply.
- RQ-4: the four existing `ROUTER.md` files classified against the canon.
- RQ-5: the per-skill migration, the Project changes, the token saving and a collision-safe order.
- REQ-003: one recommended way for a Claude Project to receive a router.

## 4. Methodology

Three iterations, each measured on the target repository with read-only commands.

1. A tokenizing pass over all 16 `SKILL.md` files: every routing section was cut at the next `## ` heading, every `###` sub-block was tokenized on `[A-Za-z0-9_\-/.]+`, and each sub-block was classified as machine data when it carried a fence, a table, or more than one `key: value` / backticked list item.
2. A loader pass over `opencode.json`, `.opencode/skills`, `.claude/skills`, `Commands/agent-router.md`, `AGENTS.md` and the `z - Claude Project Sync Loop` folder.
3. A gate pass: `grep -rn` for `SMART ROUTING`, `ROUTER.md` and `MACHINE ROUTER` over every script in the repository, then each hit read in place; plus a read of the four `ROUTER.md` files, the vendored router-shape tooling, `git status` and `git log`.

No `.env` file was opened. Nothing was written in that repository.

## 5. Scope and Method Boundaries

- `specs/` in the target repository holds benchmark harnesses that also read routing sections (`AI Systems/Sales - HubSpot & Automation/specs/.../harness.py`). They were excluded as the topic requires, and they are not live gates: the replay lives under `benchmark/`.
- Word counts are tokenizer counts, not `wc -w`. `wc -w` reads 8,213 words for `sk-barter-copywriter` where the tokenizer reads 8,018 for the whole file, because punctuation and markdown markers collapse differently. The rule is stated so phase 008 can reproduce the numbers.
- The `AI Systems/Commands/` path named in `AGENTS.md` does not exist; the real file is `Commands/agent-router.md` at the repository root and was read there.

## 6. Findings: RQ-1, routing prose against machine data

| Skill | Routing lines | Prose words | Machine words | Machine share |
|---|---|---|---|---|
| `Barter - Copywriter/sk-barter-copywriter` | 26-238 | 1,025 | 2,789 | 73% |
| `Barter - Deal Templates/sk-barter-deal-templates` | 50-133 | 833 | 1,002 | 55% |
| `Media Editor/sk-media-editor` | 74-130 | 347 | 258 | 43% |
| `Moneybird Accountant` (hub) | 28-40 | 329 | 0 | 0% |
| `Moneybird Accountant/cli-jortt` | 43-47 | 46 | 0 | 0% |
| `Moneybird Accountant/cli-moneybird` | 45-49 | 45 | 0 | 0% |
| `Moneybird Accountant/sk-moneybird-accountant` | 40-44 | 50 | 0 | 0% |
| `Product Owner` (hub) | 36-65 | 189 | 296 | 61% |
| `Product Owner/mcp-click-up` | 64-260 | 0 | 981 | 100% |
| `Product Owner/mcp-code-mode` | 48-204 | 0 | 776 | 100% |
| `Product Owner/mcp-figma` | 58-227 | 0 | 1,199 | 100% |
| `Product Owner/sk-create-figjam` | 32-159 | 30 | 934 | 97% |
| `Product Owner/sk-product-owner` | 42-86 | 190 | 408 | 68% |
| `Prompt Improver/sk-prompt-improver` | 65-395 | 1,177 | 1,342 | 53% |
| `Sales - Direct Communication/sk-sales-communication` | 44-282 | 468 | 1,154 | 71% |
| `Sales - HubSpot & Automation/sk-sales-hubspot-automation` | 69-337 | 76 | 1,991 | 96% |
| **Total** | | **4,805** | **13,130** | **73.2%** |

Two machine-data families exist and the target file must hold both:

- **Fenced pseudocode routers.** `mcp-click-up` (`Smart Router Pseudocode`, 742 words, plus a 20-row `Operation-to-Tool Routing Table`), `mcp-figma` (837), `mcp-code-mode` (747), `sk-create-figjam` (three fences), `sk-sales-hubspot-automation` (850), `sk-prompt-improver` (902), `sk-sales-communication` (a 434-word `Semantic Topic Registry` with two fences), `sk-barter-deal-templates` (two fences). [SOURCE: AI Systems/Product Owner/mcp-figma/SKILL.md:113]
- **Table and assignment routers.** `sk-barter-copywriter` has no fence at all: 12 of its 19 sub-blocks are tables or `key: value` lists - `Signal Weights` (283w, 10-row table), `Source Copy Recognition` (820w), `Edit Demand Override` (244w), `Artifact Resolution` (165w), `Lane Resource Sets` (210w), `Scope Triggers` (235w), `Tone And Energy Slots` (209w), `Slot Completeness` (162w) and four smaller blocks. [SOURCE: AI Systems/Barter - Copywriter/sk-barter-copywriter/SKILL.md:26]

The four Moneybird routing sections carry no machine data, and the three packets that ship a sibling router are already in the post-move shape: 329 words of prose for the hub, 45 to 50 for each packet. [SOURCE: AI Systems/Moneybird Accountant/cli-jortt/SKILL.md:43]

## 7. Findings: RQ-2, what loads these skills

| Loader | What it reads | Does it read a sibling of `SKILL.md` on its own? |
|---|---|---|
| OpenCode (`opencode.json`) | nothing about skills: the file holds `$schema`, `permission`, `mcp.code_mode`, `experimental` | No |
| `.opencode/skills` | a symlink to `Code_Environment/Public/.opencode/skills`, 17 shared skills, none of the 16 | No |
| Claude Code (`.claude/skills`) | a symlink to the same Public tree | No |
| `Commands/agent-router.md` | `{skill_folder}/SKILL.md` completely, then what `SKILL.md` marks ALWAYS | No - no sibling file is named |
| Claude Projects | hand-written kernel and knowledge files; the sync compiler was retired 2026-09-18 | No automation at all |

- `opencode.json` names no skill path: `$schema`, `permission`, one `mcp.code_mode` entry, one `experimental` flag. [SOURCE: opencode.json:1]
- `Commands/agent-router.md` step 4 reads "the named `{skill_folder}/SKILL.md` that AGENTS.md points to", and its load rule reads that file "COMPLETELY" and then loads "only what `SKILL.md` marks ALWAYS". [SOURCE: Commands/agent-router.md:329]
- `AGENTS.md` section 5: the AI System Sync Compiler "is retired and its folder was deleted on 2026-09-18", Project files are written "by hand, per the manual parity method", and "No manifest, lock file or checksum ledger is kept". [SOURCE: AGENTS.md:123]

**Consequence for the canon.** A sibling `ROUTER.md` is invisible to every runtime until `SKILL.md` links it. The pointer rule is not a convention, it is the load path.

**Consequence for Claude Projects.** A Project cannot follow a relative link. Four kernels already carry a `SMART ROUTING` section of their own - Sales - Direct Communication line 41, Prompt Improver 37, Barter - Deal Templates 126, Sales - HubSpot & Automation 107 - which is the evidence that Project routing is hand-authored text, not a mirrored file. [SOURCE: AI Systems/Sales - Direct Communication/claude project/Custom Instructions.md:41]

The sync loop's residency ledger shows that hand work already in flight: `residency/counts.md` records 98 of 327 declared statements moved, and `residency/moved-route-*.json` holds per-system statement keys. [SOURCE: AI Systems/z — Claude Project Sync Loop/residency/counts.md:1]

## 8. Findings: RQ-3, every gate that reads a routing section or a ROUTER.md

| Gate | What it reads | Evidence |
|---|---|---|
| `AI Systems/Sales - Direct Communication/benchmark/router/differential.py` | slices `## 2. SMART ROUTING` out of `SKILL.md` prose; raises `ValueError` if either heading moves | line 268 |
| same file | reads the pseudocode fence from `references/router-contract.md`, not `SKILL.md` | lines 96-99, 193 |
| `AI Systems/Barter - Deal Templates/benchmark/router/differential.py` | "The prose guards keep reading their tables out of SKILL.md"; fence in `references/`, third copy under kernel `## 12. ROUTER CODE` | lines 21, 96, 117 |
| `AI Systems/Product Owner/benchmark/gates/check_hub.py` | pins hub `ROUTER.md` frontmatter; forbids a packet `ROUTER.md`; requires packet routing in `SKILL.md` section 2 | lines 55-56, 58, 62, 185-187 |
| `AI Systems/Product Owner/benchmark/gates/check_leaf_map_parity.py` | reads hub `ROUTER.md` Python block and each packet `SKILL.md` `RESOURCE_MAP` | lines 71-75, 88-91 |
| `AI Systems/Moneybird Accountant/sk-moneybird-accountant/scripts/check-skill-words.py` | counts `ROUTER.md` and `SKILL.md` words, three routers exempted | lines 5, 54, 60-64 |
| `.../scripts/check-route-table.py` | reads `ROUTER.md` beside `SKILL.md`; `--write` regenerates the router block | lines 7, 35, 63 |
| `.../scripts/route-replay/route-replay.py` | replays `ROUTER.md` against the corpus | lines 8, 77 |
| `AI Systems/Moneybird Accountant/cli-moneybird/scripts/exit-code-parity.sh` | `TROUBLESHOOT` keywords from `cli-moneybird/ROUTER.md` | lines 45, 230 |
| `AI Systems/z — Claude Project Sync Loop/systems.cjs` | declares `ROUTER.md` as instruction surface in `extraSources` and `hvrEnforced` | lines 74, 108 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | hub `ROUTER.md`, rooted at `.skilled/skills` | lines 50, 112, 117 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs` | hub `ROUTER.md` intent signals, rooted at `.skilled/skills` | lines 30, 47 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | replays every parent-hub `ROUTER.md` | lines 10, 327 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | RS-001..RS-005 routing shape, `MACHINE ROUTER` placement | lines 199, 791, 881, 965-1008 |

Two of these decide whether the move is legal at all:

1. **`check_hub.py` forbids exactly what the canon requires.** `PACKET_RESIDUE` lists `ROUTER.md` (line 58) and `SMART_ROUTING_SECTION` (line 62, applied at 185, message at 187) requires each packet's routing to stay in its own `SKILL.md` section 2. [SOURCE: AI Systems/Product Owner/benchmark/gates/check_hub.py:58]
2. **The two `differential.py` gates slice or read `SKILL.md` prose by heading.** The Sales gate's `prose.index("## 2. SMART ROUTING")` fails the moment the prose moves; the Barter gate says in its own header that its prose guards still read the tables out of `SKILL.md`. [SOURCE: AI Systems/Sales - Direct Communication/benchmark/router/differential.py:268]

What this repository's tools contribute is narrower than it looks. The vendored `package_skill.py` and its siblings are rooted at `<repo>/.skilled/skills` (`ci-router-vocabulary-reach.cjs:50`, `generate-router-intent-signals.cjs:30`) and the known-debt ledger is keyed by path under `.skilled/skills` with 4 entries, so they do not police `AI Systems/*` today. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:50]

Their code numbers are not portable either. In the vendored copy `RS-004` is the packet/missing-router rule (lines 1006-1008) and `RS-005` is "no `## MACHINE ROUTER` section" (line 1000); in this repository's copy `RS-004` is "no sibling ROUTER.md beside SKILL.md" (line 1029) and `RS-005` is the missing pointer link (line 1113). Phase 008 must cite a code with its repository. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1000]

## 9. Findings: RQ-4, the four existing ROUTER.md files

| Router | Words / lines | Machine block today | Needed |
|---|---|---|---|
| `Product Owner/ROUTER.md` | 1,229 / 120 | `## 3. MACHINE-READABLE ROUTER (replay / benchmark source)` at line 41, fence 45-103 | Move the fence past `## 4. HOW TO READ THIS` (107) and `## RELATED RESOURCES` (116) into a final `## MACHINE ROUTER`; keep `router_state` / `skill_pointer` byte-identical |
| `Moneybird Accountant/cli-jortt/ROUTER.md` | 1,295 / 176 | `## 2. SMART ROUTING`, fence 88-176 | Split prose from the fence, retitle the machine section and make it final |
| `Moneybird Accountant/cli-moneybird/ROUTER.md` | 1,565 / 170 | `## 2. SMART ROUTING`, text block 57-65, fence 83-170 | Same, with the text block kept in the prose body |
| `Moneybird Accountant/sk-moneybird-accountant/ROUTER.md` | 2,435 / 261 | `## 2. SMART ROUTING`, fence 100-254 | Same, and the generator must emit the new heading |

- All four carry `router_state: active` and `skill_pointer: SKILL.md`, the two fields `check_hub.py` pins. [SOURCE: AI Systems/Product Owner/ROUTER.md:11]
- None has a `## MACHINE ROUTER` heading, so all four fail the destination rule. [SOURCE: AI Systems/Moneybird Accountant/cli-jortt/ROUTER.md:88]
- `check-route-table.py --write` regenerates the router block, so a hand-edited heading reverts on the generator's next run unless the generator changes first. [SOURCE: AI Systems/Moneybird Accountant/sk-moneybird-accountant/scripts/check-route-table.py:35]
- The pointer half is already satisfied in exactly four skills - `cli-jortt/SKILL.md:45`, `cli-moneybird/SKILL.md:47`, `sk-moneybird-accountant/SKILL.md:42`, `Product Owner/SKILL.md:38` - and absent in the other twelve. [SOURCE: AI Systems/Moneybird Accountant/cli-jortt/SKILL.md:45]

## 10. Findings: RQ-5, the migration

### 10.1 Target shape per skill

| Skill | Target |
|---|---|
| `sk-barter-copywriter` | `ROUTER.md` with the prose that explains the lanes, and a final `## MACHINE ROUTER` holding the 12 tables and assignment lists as one block; `SKILL.md` keeps the pointer plus the lane prose |
| `sk-barter-deal-templates` | `ROUTER.md` whose machine section holds both fences; the `Command Entry Points` list stays as prose in the router body because it is read by a person |
| `sk-media-editor` | smallest move: two fences plus one table into the machine section, 43 prose words stay |
| `sk-prompt-improver` | machine section takes the 902-word pseudocode fence and the resource tables; the six prose sub-blocks (Phase Detection, Confidence Thresholds, Natural-Language Topic Signals, Routing Workflow, Mode Mapping, Platform Detection) stay in `SKILL.md` |
| `sk-sales-communication` | machine section takes the detection fence, resource tables, pipeline selection, the 434-word `Semantic Topic Registry` and the routing example; `SKILL.md` keeps the pointer and the one-line binding note |
| `sk-sales-hubspot-automation` | machine section is 96 percent of the section: all five blocks move, `SKILL.md` keeps 76 prose words and the pointer |
| `mcp-click-up`, `mcp-code-mode`, `mcp-figma` | 100 percent machine today: the whole section moves and `SKILL.md` keeps a pointer and one sentence of intent |
| `sk-create-figjam` | 30 prose words stay; three fences plus the loading table move |
| `sk-product-owner` | detection fence and loading table move; `Router Mechanics` prose stays |
| Product Owner hub | 181-word route-resolution fence and the `Outcomes` list move; the two-stage description stays |
| Moneybird hub | no machine data: needs a pointer only if it gains a router; otherwise it keeps naming its children |
| three Moneybird packets | already moved: only the heading restructure and the generator change |

### 10.2 What changes in the Claude Project package

**Recommendation for REQ-003.** A Project receives a router through one new versionless knowledge document per System, named in the existing convention (for example `Sales Direct Communication - System - Routing.md`), holding the `## MACHINE ROUTER` payload verbatim. The kernel keeps only its interlock rules plus a pointer line naming that document, and the change is recorded as a dated parity note in the system `SYNC.md`.

Why this and not the alternatives: no Project has a routing document today (a name search for `rout` under every `claude project/` tree returns only benchmark artefacts), knowledge files already follow `<System> - <Section> - <Title>.md`, and a Project sees text rather than a path - the pointer cannot cross the repository boundary. Copying the repository `ROUTER.md` verbatim into every Project would move cost into every retrieval rather than cut it; Product Owner's router alone is 1,229 words and `sk-moneybird-accountant`'s is 2,435. [SOURCE: AI Systems/Sales - Direct Communication/claude project/knowledge]

### 10.3 Token saving per skill

At 1.33 tokens per word, the removable machine mass is:

| Skill | Tokens saved |
|---|---:|
| `sk-barter-copywriter` | 3,709 |
| `sk-sales-hubspot-automation` | 2,648 |
| `sk-prompt-improver` | 1,785 |
| `mcp-figma` | 1,595 |
| `sk-sales-communication` | 1,535 |
| `sk-barter-deal-templates` | 1,333 |
| `mcp-click-up` | 1,305 |
| `sk-create-figjam` | 1,242 |
| `mcp-code-mode` | 1,032 |
| `sk-product-owner` | 543 |
| Product Owner hub | 394 |
| `sk-media-editor` | 343 |
| **Total** | **~17,460** |

Against that, twelve pointer lines cost about 15 tokens each, roughly 180 tokens. The four Moneybird proposals cost nothing in this column: their machine data already left.

### 10.4 Order that avoids other sessions' edits

At `8e4573b8f` the working tree is clean apart from two untracked files under `Product Context/Collab Phases/`; no skill folder is dirty. Activity decides the order:

1. **Media Editor** - quiet since 2026-10-05, no benchmark gate, 258 machine words. Pilot.
2. **Prompt Improver** - quiet since 2026-10-18, no benchmark gate.
3. **Barter - Copywriter** - quiet since 2026-10-18; the only table-shaped router, so it proves the shape without a fence.
4. **Sales - Direct Communication** - its `differential.py` prose slice changes in the same commit.
5. **Sales - HubSpot & Automation** - its gate lives under `specs/`, quiet since 2026-10-01.
6. **Barter - Deal Templates** - differential gate plus the kernel `## 12. ROUTER CODE` copy; touched 2026-10-27.
7. **Moneybird cluster** - generator change, then the heading rename, then the hub pointer. No commits in 21 days, SKILL.md mtimes 2026-10-18.
8. **Product Owner cluster** - hub plus four MCP/FigJam packets last. Commits on 2026-10-28, `sk-product-owner/SKILL.md` mtime 10:17 and hub 10:10 that day; to be checked again at execution time.

Two gate edits must precede step 1, because they change every later step: `check_hub.py` must stop listing a packet `ROUTER.md` as residue and learn to read a packet's machine section, and both `differential.py` prose guards must slice the routing prose from wherever it lands.

## 11. Recommendations

1. Move the machine router, keep the prose. The 26.8 percent prose is what a skill needs on every call; the 73.2 percent machine data is what a router needs on a route.
2. Treat the pointer as the load path, not documentation. Every moved skill gets a relative markdown link, and a missing link is a broken skill, not a style issue.
3. Change the generator before the hand edit in Moneybird, or the heading reverts.
4. Relax `check_hub.py` first, and say so in the same commit that moves the first Product Owner packet.
5. Add one `<System> - System - Routing.md` knowledge document per Project, with the kernel reduced to a pointer and its interlock rules, and a dated `SYNC.md` note.
6. Cite RS codes with their repository, because the two copies disagree.

## Verification by the conductor

The load-bearing citations were reread in the AI Systems checkout at `8e4573b8f` before this synthesis was accepted:

- `check_hub.py:58` lists `ROUTER.md` in `PACKET_RESIDUE`, and line 62 defines `SMART_ROUTING_SECTION`, as cited.
- `Sales - Direct Communication/benchmark/router/differential.py:268` slices `## 2. SMART ROUTING` up to `## 3. HOW IT WORKS`, as cited.
- `Commands/agent-router.md:329` reads `SKILL.md` completely, as cited.
- `Product Owner/ROUTER.md` holds `## 3. MACHINE-READABLE ROUTER` at line 41, with `## 4. HOW TO READ THIS` at 107 and `## RELATED RESOURCES` at 116, as cited.
- `check-route-table.py --write` regenerates the router block, as cited at line 35.
- The lineage cited the sync-compiler retirement at `AGENTS.md:119`. The sentence starts at line 123, and this copy carries the corrected line.
- The working tree holds only the two untracked files under `Product Context/Collab Phases/`, as cited.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Count routing words with `wc -w` | inflates fenced blocks and tables; 8,213 vs 8,018 on the same file | tokenizer comparison | 1 |
| Treat the whole `SKILL.md` as the routing section | other sections are skill content the move must not touch | spec measured behaviour | 1 |
| Use `### Executable Contract` as a machine-data marker | it holds prose in three skills | `sk-barter-copywriter/SKILL.md:232`, `sk-barter-deal-templates/SKILL.md:115`, `sk-media-editor/SKILL.md:126` | 1 |
| Assume `.claude/skills` or `.opencode/skills` holds the 16 | both are symlinks to the Public tree's 17 shared skills | `.claude/skills`, `.opencode/skills` | 2 |
| Assume a packaging script rewrites a Project | the compiler was retired 2026-09-18 and no manifest is kept | `AGENTS.md:123` | 2 |
| Read `specs/` harnesses as live gates | excluded by the topic; the live replay is under `benchmark/` | `AGENTS.md` section 5 | 2 |
| Rename `## 2. SMART ROUTING` to `## MACHINE ROUTER` in place | leaves prose inside the machine section and, for Product Owner, two sections after it | `Product Owner/ROUTER.md:107` | 3 |
| Copy every repository `ROUTER.md` verbatim into every Project | moves cost into every retrieval; routers run 1,229 to 2,435 words | `Product Owner/ROUTER.md`, `sk-moneybird-accountant/ROUTER.md` | 3 |
| Migrate Product Owner first because it is visible | daily commits and a packet gate make it the worst first target | `git log --since="21 days ago"` | 3 |

## Divergence Map

- Saturated directions: none. Every iteration opened a direction the previous one did not cover, and the per-skill table was the only measurement repeated because RQ-5 needed the same numbers restated as tokens.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Frontier left open: the Claude Project knowledge-document authoring cost is not measured, because it depends on how much of each kernel's routing prose survives the interlock test; that is phase 008 work, and the residency ledger's 98-of-327 count is the baseline to continue from.
- One unresolved conflict travels with these results: `check_hub.py` forbids a packet `ROUTER.md` while the canon requires one per skill. The recommendation is to relax the gate first, but no measurement in this phase can settle which truth prevails.

## Open Questions

- How many kernel words survive the interlock test once a Project router document exists? The residency ledger counts statements, not words.
- Should the Moneybird hub gain a `ROUTER.md` of its own, or keep only prose naming its children? It has no machine data today, so the canon's pointer rule has nothing to point at.
- Does any Product Owner packet's `SKILL.md` section 2 also serve a human reader, making the move a genuine information loss? `sk-create-figjam`'s 30 prose words suggest not, but the packets have not been read line by line for that purpose.

## References

- Target repository: `/Users/michelkerkmeester/MEGA/Development/AI Systems` at `8e4573b8f`.
- Canon: `specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/003-check-and-template-canon/implementation-summary.md`.
- Iteration files: `research/lineages/deepseek/iterations/iteration-001.md` to `iteration-003.md`.
- `resource-map.md` beside this file maps the sources the three iterations read.

## Appendix: Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 1: RQ-1 per-skill routing prose versus machine data split (1.0); run 2: RQ-2 loaders and RQ-3 gates (1.0); run 3: RQ-4 existing routers and RQ-5 migration design (1.0)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

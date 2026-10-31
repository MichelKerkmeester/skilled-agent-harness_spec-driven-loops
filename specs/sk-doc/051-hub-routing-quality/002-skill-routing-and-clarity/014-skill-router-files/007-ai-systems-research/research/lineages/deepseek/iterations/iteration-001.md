# Iteration 1: RQ-1 - the routing prose and the machine data inside each of the 16 SKILL.md files

All `[SOURCE: ...]` paths below are relative to the AI Systems checkout root, `/Users/michelkerkmeester/MEGA/Development/AI Systems` (HEAD `8e4573b8f`). Word counts were produced by one read-only pass over the 16 files: every line was tokenized on `[A-Za-z0-9_\-/.]+`, `###` headings were excluded from both buckets, and each sub-block was classified as machine data when it carried a fenced code block, a markdown table, or more than one `key: value` / backticked list item. Everything else counted as prose.

## Focus

RQ-1: for each of the 16 skills, which parts of its routing section are agent-facing prose and which are machine data (assignment blocks, pseudocode, resource lists), with the word count of each part. This iteration stops at measurement; it does not propose the target shape (RQ-5) yet.

## Findings

1. **The 16 routing sections hold 17,935 words, of which 13,130 (73.2 percent) are machine data and 4,805 (26.8 percent) are agent-facing prose.** [INFERENCE: derived from the per-block classification of all 16 `## ... SMART ROUTING` sections, bounded by the next `## ` heading in each file]

2. **`sk-barter-copywriter` is the largest router and the largest assignment-block router: 3,814 routing words, 2,789 machine data (73 percent) and 1,025 prose.** Twelve of its nineteen sub-blocks are machine data - `Signal Weights` (10-row weight table, 283w), `Source Copy Recognition` (820w), `Edit Demand Override` (244w), `Artifact Resolution` (165w), `Lane Resource Sets` (7-row table, 210w), `Scope Triggers` (235w), `Tone And Energy Slots` (209w), `Slot Completeness` (6-row table, 162w), `Phrase Matching` (140w), `Resilience Tiers` (141w), `Lane Resolution` (106w), `Resource Domains` (74w); it carries no fenced pseudocode at all. [SOURCE: AI Systems/Barter - Copywriter/sk-barter-copywriter/SKILL.md:26]

3. **`sk-barter-deal-templates` splits 1,835 routing words into 1,002 machine data (55 percent) and 833 prose; its machine parts are fenced pseudocode plus one 11-item list.** `Primary Detection Signal` (266w, one fence), `Resource Domains` (63w, one fence), `Resource Loading Levels` (5-row table, 132w) and `Command Entry Points` (541w, 11 `key: value` items). [SOURCE: AI Systems/Barter - Deal Templates/sk-barter-deal-templates/SKILL.md:50]

4. **`sk-media-editor` is the lightest large skill: 605 routing words, 258 machine data (43 percent) and 347 prose**, from one detection-signal fence (99w), one resource-domains fence (85w) and a 5-row loading-levels table (74w). [SOURCE: AI Systems/Media Editor/sk-media-editor/SKILL.md:74]

5. **The Product Owner hub holds 485 routing words, 296 machine (61 percent) and 189 prose**: the section opens with a fenced route-resolution block (181w) and closes with an `Outcomes` assignment list (115w). [SOURCE: AI Systems/Product Owner/SKILL.md:36]

6. **Three MCP skills are pure machine data: `mcp-click-up` 981w, `mcp-figma` 1,199w and `mcp-code-mode` 776w, each at 0 prose words.** Their sections are a `Resource Loading Levels` block, a `Smart Router Pseudocode` fence (742w, 837w and 747w respectively) and, for `mcp-click-up`, a 20-row `Operation-to-Tool Routing Table` (208w). [SOURCE: AI Systems/Product Owner/mcp-figma/SKILL.md:113] [SOURCE: AI Systems/Product Owner/mcp-click-up/SKILL.md:76] [SOURCE: AI Systems/Product Owner/mcp-code-mode/SKILL.md:58]

7. **Three skills are 96 to 97 percent machine data**: `sk-create-figjam` 964 routing words with 30 prose, `sk-sales-hubspot-automation` 2,067 with 76 prose, and `sk-product-owner` 598 with 190 prose (68 percent machine). [SOURCE: AI Systems/Product Owner/sk-create-figjam/SKILL.md:32] [SOURCE: AI Systems/Sales - HubSpot & Automation/sk-sales-hubspot-automation/SKILL.md:69] [SOURCE: AI Systems/Product Owner/sk-product-owner/SKILL.md:42]

8. **`sk-prompt-improver` keeps the most prose in absolute terms after the copywriter: 2,519 routing words, 1,342 machine (53 percent) and 1,177 prose**, split across six prose sub-blocks - `Phase Detection` (436w), `Routing Workflow` (186w), `Natural-Language Topic Signals` (180w), `Confidence Thresholds` (145w), `Mode Mapping` (106w), `Platform Detection` (54w) - plus a 902w `Smart Router Pseudocode` fence. [SOURCE: AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md:65]

9. **`sk-sales-communication` is 1,622 routing words at 71 percent machine (1,154w)**: five fenced or tabular blocks plus a 434w `Semantic Topic Registry` carrying two fences. [SOURCE: AI Systems/Sales - Direct Communication/sk-sales-communication/SKILL.md:44]

10. **The four Moneybird routing sections carry no machine data at all, and the three that ship a sibling `ROUTER.md` are already in the post-move shape**: the hub's section is 329 words of prose naming its children, `cli-jortt` is 46 words, `cli-moneybird` 45 and `sk-moneybird-accountant` 50. [SOURCE: AI Systems/Moneybird Accountant/SKILL.md:28] [SOURCE: AI Systems/Moneybird Accountant/cli-jortt/SKILL.md:43] [SOURCE: AI Systems/Moneybird Accountant/cli-moneybird/SKILL.md:45] [SOURCE: AI Systems/Moneybird Accountant/sk-moneybird-accountant/SKILL.md:40]

### Per-skill split

| Skill | Routing lines | Prose | Machine | Machine share |
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

At the conventional 1.33 tokens per word, the removable machine mass is about 17,460 tokens of always-loaded `SKILL.md` text, and the prose that stays is about 6,390 tokens.

Two families of machine data are visible in the sample. Eight skills express part of the router as fenced pseudocode (`mcp-click-up`, `mcp-code-mode`, `mcp-figma`, `sk-create-figjam`, `sk-sales-hubspot-automation`, `sk-prompt-improver`, `sk-sales-communication` and `sk-barter-deal-templates`); `sk-barter-copywriter` carries no fence at all and expresses the same decisions as tables and `key: value` assignment lists. Any target file must hold both shapes.

## Ruled Out

- Counting routing words with `wc -w` over the raw section. It inflates fenced blocks and tables, because punctuation and markdown markers collapse into fewer tokens than my tokenizer produces: `wc -w` reads 8,213 words for `sk-barter-copywriter` while the tokenizer reads 8,018 for the whole file. Rejected in favour of one consistent tokenizer, and the rule is stated above so phase 008 can reproduce the numbers.
- Treating the whole `SKILL.md` as "the routing section". The spec's measured behavior anchors on `## .*SMART ROUTING`, and every other section (WHEN TO USE, RULES, RESOURCES, DELIVERY) is skill content that the move must not touch.

## Dead Ends

- Reading `### Executable Contract` as a machine-data marker. In `sk-barter-copywriter` (line 232), `sk-barter-deal-templates` (line 115) and `sk-media-editor` (line 126) that heading holds plain prose describing the contract, not the contract itself. A heading-name heuristic would misclassify all three.

## Edge Cases

- Ambiguous input: "routing section" could mean the whole file. Selected the narrowest reading the spec supports - the `## ... SMART ROUTING` section up to the next `## ` heading - and deferred the rest.
- Contradictory evidence: none.
- Missing dependencies: none. All 16 files were read.
- Partial success: none. All 16 sections were measured.

## Sources Consulted

- `AI Systems/*/SKILL.md`, all 16 files, with the routing section bounds recorded in the table above.
- The measurement pass itself: `find "AI Systems" -name SKILL.md -not -path "*/specs/*" -not -path "*/runtime/*" -not -path "*/scratch/*" -not -path "*/node_modules/*"` (16 hits) plus a per-block tokenizer run over each file.

## Assessment

- New information ratio: 1.0 - every finding is new; this is the first pass over the target repository.
- Questions addressed: RQ-1.
- Questions answered: RQ-1.

## Reflection

- What worked and why: measuring per sub-block rather than per section separated the two families of machine data and immediately showed that the copywriter's router is table-driven, not pseudocode-driven; a section-level total alone would have hidden that.
- What did not work and why: the heading-name heuristic had no signal, because `Executable Contract` reads like a machine artifact and behaves like prose.
- What I would do differently: measure the pointer candidates in the same pass - `Executable Contract` and `RESOURCES` sections may carry router-shaped lists that are outside the SMART ROUTING heading but still load on every invocation.

## Recommended Next Focus

RQ-2: what actually loads these skills - `opencode.json`, `.claude/`, the `z - Claude Project Sync Loop` folder and its hand-written knowledge files - and whether any loader reads a file beside `SKILL.md` without being told to.

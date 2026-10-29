# Iteration 3: RQ-4 and RQ-5 - the four existing routers against the canon, and the migration

`[SOURCE: ...]` paths are relative to the AI Systems checkout root at `8e4573b8f` unless the text says otherwise.

## Focus

RQ-4 classifies the four `ROUTER.md` files that exist. RQ-5 designs the move: the target shape per skill, what changes in the Claude Project package, the token saving, and an order that does not collide with other sessions. The two are one pass because a target shape that the existing four cannot reach is not a target shape.

## Findings

1. **All four existing routers carry the same two frontmatter fields, and a gate pins both.** `router_state: active` and `skill_pointer: SKILL.md` sit at Product Owner lines 11-12 and at lines 10-11 in each of the three Moneybird routers; `check_hub.py` pins them as `ROUTER_STATE_LINE` and `SKILL_POINTER_LINE`. Any restructure keeps those two lines byte-identical. [SOURCE: AI Systems/Product Owner/ROUTER.md:11] [SOURCE: AI Systems/Moneybird Accountant/cli-jortt/ROUTER.md:10]

2. **None of the four has a `## MACHINE ROUTER` heading, so all four fail the canon's destination rule.** The three Moneybird routers hold their machine block under `## 2. SMART ROUTING` (cli-jortt's fence runs lines 88-176, cli-moneybird's 83-170 after a text block at 57-65, sk-moneybird-accountant's 100-254); the Product Owner hub holds it under `## 3. MACHINE-READABLE ROUTER (replay / benchmark source)` at line 41 with the fence at 45-103. [SOURCE: AI Systems/Moneybird Accountant/cli-jortt/ROUTER.md:88] [SOURCE: AI Systems/Product Owner/ROUTER.md:41]

3. **The Product Owner hub's machine block is not even last, so renaming the heading would not be enough.** `## 4. HOW TO READ THIS` follows at line 107 and `## RELATED RESOURCES` at line 116. The canon requires the machine section to close the file, so that router needs the block physically moved past the two prose sections. [SOURCE: AI Systems/Product Owner/ROUTER.md:107]

4. **The three Moneybird routers mix prose and machine text inside one heading, so each needs a split, not a rename.** `## 2. SMART ROUTING` holds the prose description of the operation table and then the fence; the canon puts the prose in the router body and only the machine data under the final heading. [SOURCE: AI Systems/Moneybird Accountant/sk-moneybird-accountant/ROUTER.md:22]

5. **One generator writes a router block back into `ROUTER.md`, so the heading must change there too or the move reverts.** `check-route-table.py` documents `--write` as "Regenerate the router block in ROUTER.md and append the table's ..." and resolves `ROUTER_MD = os.path.join(SKILL_FOLDER, "ROUTER.md")`. A hand-edited heading that the generator does not emit will be overwritten on its next run. [SOURCE: AI Systems/Moneybird Accountant/sk-moneybird-accountant/scripts/check-route-table.py:35]

6. **The pointer half of the canon is already satisfied in exactly four skills and absent in the other twelve.** `cli-jortt/SKILL.md:45`, `cli-moneybird/SKILL.md:47`, `sk-moneybird-accountant/SKILL.md:42` and `Product Owner/SKILL.md:38` all link `ROUTER.md` as a relative markdown link. [SOURCE: AI Systems/Moneybird Accountant/cli-jortt/SKILL.md:45] [SOURCE: AI Systems/Product Owner/SKILL.md:38]

7. **The token saving is concentrated in five skills; the rest are small.** At 1.33 tokens per word the removable machine mass per skill is `mcp-figma` 1,595, `mcp-click-up` 1,305, `mcp-code-mode` 1,032, `sk-create-figjam` 1,242, `sk-product-owner` 543 from the Product Owner cluster; `sk-sales-hubspot-automation` 2,648 and `sk-sales-communication` 1,535; `sk-barter-copywriter` 3,709 and `sk-barter-deal-templates` 1,333; `sk-prompt-improver` 1,785; `sk-media-editor` 343; the Product Owner hub 394. Total about 17,460 tokens, against roughly 12 added pointer lines at about 15 tokens each. [INFERENCE: from the iteration-1 machine word counts and the 1.33 tokens/word convention]

8. **No Claude Project has a routing knowledge document today, so the Project side of the move is an authoring task, not a rewrite.** A name search for `rout` under every `claude project/` tree returns only benchmark artefacts; the knowledge files follow the `<System> - <Section> - <Title>.md` convention (`Sales Direct Communication - System - Flight Manual.md`, `Product Owner - Assets - Flow Templates.md`). [SOURCE: AI Systems/Sales - Direct Communication/claude project/knowledge]

9. **A Project cannot follow the pointer, so the only way it receives a router is a knowledge file that repeats it.** A Project sees text, not a sibling path; the kernel's SMART ROUTING sections (four Projects, iteration 2 finding 7) prove routing content already lives in hand-written Project text. The canon's link rule therefore stops at the repository boundary. [INFERENCE: from iteration 2 findings 4-7 plus the absence of any routing knowledge doc]

10. **Recommended way for a Project to receive a router: one new versionless knowledge doc per System that needs routing, holding the `## MACHINE ROUTER` payload verbatim, with the kernel reduced to a pointer plus its interlock rules.** The name follows the existing convention, for example `Sales Direct Communication - System - Routing.md`; the kernel keeps only the rules that must hold on every request and names the doc in its always row; the change is recorded as a dated parity note in the system `SYNC.md`, per `AGENTS.md` section 5. This satisfies REQ-003 and it is the only shape that keeps the kernel and `ROUTER.md` comparable, because the doc can be diffed against the router block word for word. [INFERENCE: from findings 8-9 and the `<System> - <Section> - <Title>.md` convention]

11. **The collision risk is measurable and it is concentrated in Product Owner.** At `8e4573b8f` the only working-tree entries are two untracked files under `Product Context/Collab Phases/`; no skill folder is dirty. But Product Owner took commits on 2026-10-28 (`sk-product-owner/SKILL.md` mtime 10:17, hub 10:10, `mcp-click-up` 07:53, `sk-create-figjam` 06:19) and the sync loop records its reviews in the same tree, while Moneybird has no commit in 21 days and its four SKILL.md mtimes are 2026-10-18. [SOURCE: AI Systems/Product Owner/SKILL.md] [SOURCE: AI Systems/Moneybird Accountant/sk-moneybird-accountant/SKILL.md]

12. **The order that avoids collisions runs from the quiet, gate-free skills to the hot, gate-bound ones, and puts each gate change in the same commit as the skill it guards:** Media Editor (no differential gate, mtime 2026-10-05, 258 machine words) pilot; Prompt Improver (quiet since 2026-10-18); Barter - Copywriter (quiet since 2026-10-18, and the only table-shaped router, so it proves the shape without a fence); Sales - Direct Communication (its `differential.py` prose slice changes in the same commit); Sales - HubSpot & Automation (gate lives under `specs/`, quiet since 2026-10-01); Barter - Deal Templates (differential gate plus the kernel `## 12. ROUTER CODE` copy, touched 2026-10-27); the Moneybird cluster (heading rename plus `check-route-table.py --write` before the hand edit, hub pointer added, quiet repository); the Product Owner cluster last (four MCP/FigJam packets and the hub, with `check_hub.py`'s residue rule relaxed first, then the hub `ROUTER.md` restructure, then the packets). [INFERENCE: from findings 2-5, 11 and the iteration-1 and iteration-2 gate inventory]

13. **Two gate decisions must be made before step one, because they change every later step.** `check_hub.py` must stop listing `ROUTER.md` as packet residue and must learn to read a packet's machine section, and the two `differential.py` prose guards must learn to slice the routing prose from wherever it lands. Both are in-repository gate edits, so phase 008 owns them, but the migration cannot start without them. [SOURCE: AI Systems/Product Owner/benchmark/gates/check_hub.py:58] [SOURCE: AI Systems/Sales - Direct Communication/benchmark/router/differential.py:268]

## Ruled Out

- Renaming `## 2. SMART ROUTING` to `## MACHINE ROUTER` in place. It leaves prose inside the machine section (finding 4) and, for Product Owner, leaves two sections after it (finding 3).
- Giving every Claude Project the repository's `ROUTER.md` verbatim. Product Owner's router is 1,229 words and `sk-moneybird-accountant`'s is 2,435, which would move cost into every Project retrieval rather than cut it; the residency class work in iteration 2 already shows that shape being rejected by hand.
- Migrating Product Owner first because it is the most visible. Its commit cadence (daily) and its packet gate make it the worst first target.

## Dead Ends

- Looking for an existing Project routing doc to extend. There is none, so the first one is an authoring decision and belongs in phase 008's plan rather than a find-and-replace.

## Edge Cases

- Ambiguous input: "the four existing ROUTER.md files against the new canon" could be read as file-shape only. Selected the reading that also covers what each file needs, because a classification without a needed change is not actionable.
- Contradictory evidence: recorded, not resolved - `check_hub.py` forbids packet `ROUTER.md` while the canon requires one per skill; the migration order puts the gate edit first for that reason.
- Missing dependencies: the `AI Systems/Commands/` path named by `AGENTS.md` does not exist; the real command file is `Commands/agent-router.md` and was read there.
- Partial success: none.

## Sources Consulted

- The four `ROUTER.md` files: `AI Systems/Product Owner/ROUTER.md`, `AI Systems/Moneybird Accountant/{cli-jortt,cli-moneybird,sk-moneybird-accountant}/ROUTER.md`.
- `AI Systems/*/SKILL.md` pointer lines, mtimes for all 16 files, `git status --porcelain` and `git log --since="21 days ago"` over `AI Systems`.
- `AI Systems/Product Owner/benchmark/gates/check_hub.py`, `AI Systems/Sales - Direct Communication/benchmark/router/differential.py`, `AI Systems/Moneybird Accountant/sk-moneybird-accountant/scripts/check-route-table.py`.
- `AI Systems/Product Owner/claude project/` and `AI Systems/Sales - Direct Communication/claude project/knowledge/` listings.

## Assessment

- New information ratio: 1.0 - thirteen findings, all measured this pass.
- Questions addressed: RQ-4, RQ-5, and REQ-003.
- Questions answered: RQ-4, RQ-5.

## Reflection

- What worked and why: reading the generator (`check-route-table.py --write`) turned a documentation change into a code change, which is the difference between a migration that holds and one that reverts silently.
- What did not work and why: assuming the "final heading" rule was satisfied anywhere. The four files predate the canon and none of them closes with the machine block.
- What I would do differently: measure mtimes before the gate inventory, because activity, not size, decides the order.

## Recommended Next Focus

Synthesis. Every question has a measured answer; the remaining work is to assemble the per-skill table, the gate list, the four-router classification and the migration order into `research.md`, and to record the open conflicts for phase 008.

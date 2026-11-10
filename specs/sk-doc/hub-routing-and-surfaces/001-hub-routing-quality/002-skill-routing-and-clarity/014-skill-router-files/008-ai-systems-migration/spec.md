---
title: "Feature Specification: Phase 8: ai-systems-migration"
description: "The 16 AI Systems skills load 13,130 words of machine router data on every call, and two gate families forbid or slice the shape that would move it. This phase relaxes those gates first, then moves each router into a sibling ROUTER.md, while each Claude Project keeps routing from its kernel's Router Code."
trigger_phrases:
  - "ai systems migration"
  - "phase 8 ai systems migration"
  - "ai systems router move"
  - "claude project routing document"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: ai-systems-migration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `main` of `/Users/michelkerkmeester/MEGA/Development/AI Systems` (operator choice: no worktree); planning docs on `worktrees/274-packet-router-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-ai-systems-research |
| **Successor** | 009-ai-systems-verification |
| **Handoff Criteria** | 16 skills carry a sibling `ROUTER.md` with a final `## 3. MACHINE ROUTER` and a pointer from `SKILL.md`, every gate green in `scratch/baseline.md` is still green, and the push to `Barter-BV/marketing-ai-systems` waits for the operator |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Move the machine router of each skill in the AI Systems repository into a sibling ROUTER.md specification.

**Scope Boundary**: Writes land only in the AI Systems checkout at `/Users/michelkerkmeester/MEGA/Development/AI Systems`, in the 16 skill folders research section 6 lists, the gate scripts named in section 3, the seven `<System>/SYNC.md` files, the four Project READMEs whose skill version claims move with a raised version, and `Product Owner/vendor.json` through the vendored pull. No `Custom Instructions.md` and no Sync Loop `systems.py` changes. The two untracked files under `Product Context/Collab Phases/` belong to someone else and stay untouched. No `.env` file is opened.

**Dependencies**:
- `007-ai-systems-research/research/research.md`, which names the 16 skills, the target shape per skill and the order.
- The Public canon from phase 003: `sk-create-skill/assets/skill/skill-router-template.md` and `references/shared/validation-and-packaging.md` (RS-001 to RS-005).
- Public phase 005 on Public `main`, because the AI Systems `.skilled/skills` is a symlink to the Public main checkout and the three vendored MCP packets come from there.

**Deliverables**:
- Gate edits in Product Owner, Sales - Direct Communication, Barter - Deal Templates and the other readers the baseline found, landed before the first move.
- 12 new `ROUTER.md` files (11 skill packets and the Moneybird hub) and 4 restructured ones, each linked from its `SKILL.md`.
- Seven `SYNC.md` files whose step 1 lists `ROUTER.md` beside `SKILL.md`, each with a dated note that the kernel Router Code is unchanged and still compared by that system's gate.
- `scratch/baseline.md` before the move and a matching after-run in 009.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 16 AI Systems skills keep their machine router in `## 2. SMART ROUTING` of `SKILL.md`, so 13,130 of the section's 17,935 words, about 17,460 tokens, load on every call though only the router needs them. The move cannot start as things stand: `Product Owner/benchmark/gates/check_hub.py` lists a packet `ROUTER.md` as residue and requires packet routing in `SKILL.md` section 2, and at least seven benchmark readers slice routing prose or a router fence out of `SKILL.md` by literal heading.

### Purpose
Each skill that holds machine data keeps it in a sibling `ROUTER.md` under a final `## 3. MACHINE ROUTER`, its `SKILL.md` keeps the short prose and the pointer, every gate that was green stays green, and each Claude Project keeps routing from its kernel's Router Code, which its gate still holds equal to the skill's router.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Captured read-only on AI Systems `main` at `8e4573b8f`, 2026-10-29. The full gate baseline (37 rows) is `scratch/baseline.md`.
```text
$ find "AI Systems" -name ROUTER.md -not -path '*/specs/*' -not -path '*/node_modules/*'
./Product Owner/ROUTER.md
./Moneybird Accountant/cli-moneybird/ROUTER.md
./Moneybird Accountant/cli-jortt/ROUTER.md
./Moneybird Accountant/sk-moneybird-accountant/ROUTER.md

$ grep -rlF 'before selecting skill-local resources; open only the matched files.' --include=SKILL.md "AI Systems" | grep -v /specs/ | wc -l
0

$ python3 benchmark/gates/check_hub.py            # cwd: AI Systems/Product Owner
PASSED the hub, 4 registry packets and 51 gold rows        (exit 0)

$ bash benchmark/gates/run_gates.sh               # cwd: AI Systems/Product Owner
3 of 15 gates failed                                       (exit 3)
  skilled packet contract: routing shape RS-001 ... RS-004: no sibling ROUTER.md beside SKILL.md ... RS-005: no relative markdown link to the sibling ROUTER.md

$ git rev-list --count origin/main..main
0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the gates that forbid or slice the new shape before any skill moves: `check_hub.py` `PACKET_RESIDUE` (line 58) and `SMART_ROUTING_SECTION` (lines 62, 185-187), `check_leaf_map_parity.py` (lines 88-91), the Sales - Direct Communication `differential.py` prose slice (line 268), the Barter - Deal Templates `differential.py` prose guards, and the Moneybird `check-route-table.py` generator heading.
- Change the five further readers the baseline found that research section 8 did not list: Barter - Copywriter `differential.py`, Product Owner `differential.py` (the `sk-create-figjam/SKILL.md` python lift), Media Editor `differential.py` (the `router-contract.md` naming check), and the Prompt Improver and Sales - HubSpot & Automation `kernel_parity.py`.
- Move each skill's machine data into a sibling `ROUTER.md` per research table 10.1, in the order of research 10.4, and end each `SKILL.md` SMART ROUTING with the pointer sentence.
- Restructure the four existing routers so `## 3. MACHINE ROUTER` is the last H2.
- In each of the seven system `SYNC.md` files, make step 1 list `<skill>/SKILL.md` and `<skill>/ROUTER.md` against `claude project/Custom Instructions.md`, and add a dated note that the router moved, the kernel Router Code is unchanged and the named gate still compares it.
- Fix the canon failures that predate this phase where the fix leaves routing unchanged: 4-part skill versions, the 144-character `sk-moneybird-accountant` description, the Moneybird hub name check, the Prompt Improver smart-router markers.

### Out of Scope
- Changing what any skill routes to - the move changes where a router lives, and every route object, fixture and replay result must stay identical.
- Hand-editing `mcp-click-up`, `mcp-code-mode` and `mcp-figma` - they are vendored copies tracked in `Product Owner/vendor.json`, so they arrive by `vendor-sync.py pull` from Public main.
- Pushing to `Barter-BV/marketing-ai-systems` - the push waits for operator approval.
- Repairing pre-existing red gates (`vendor sync` drift, the stale Copywriter `lane-budget-baseline.md`, the missing tiktoken cache) - they are not routing faults, and 009 compares against them as recorded.
- `specs/` harnesses in the AI Systems repository - excluded by the research topic and not live gates.
- A routing knowledge document in any Claude Project, any `Custom Instructions.md` edit and any Sync Loop `systems.py` edit - the conductor chose that each Project keeps routing from its kernel's Router Code.
- Renaming a skill (`sales-direct-communication`, `barter-deals`), adding sections to the Copywriter `SKILL.md`, or re-versioning the resource docs that carry the systems' own `0.NNN` scheme - each is wider than a routing move, and the renames reach `systems.py` and the gates.

### Files to Change

All paths are relative to `/Users/michelkerkmeester/MEGA/Development/AI Systems/AI Systems/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `Product Owner/benchmark/gates/check_hub.py` | Modify | Accept a packet `ROUTER.md`; require the pointer and a final machine section instead of `SKILL.md` section 2 routing; update the self-test residue case |
| `Product Owner/benchmark/gates/check_leaf_map_parity.py` | Modify | Read each packet `RESOURCE_MAP` from its `ROUTER.md` when one exists |
| `Product Owner/benchmark/router/differential.py` | Modify | Lift the FigJam router block and the topic table from `ROUTER.md` |
| `Sales - Direct Communication/benchmark/router/differential.py` | Modify | Slice the routing prose from `SKILL.md` plus `ROUTER.md` |
| `Barter - Deal Templates/benchmark/router/differential.py` | Modify | Prose guards read the tables wherever they land |
| `Barter - Copywriter/benchmark/router/differential.py` | Modify | Section lookups (`### Executable Contract`, detection, domains, lanes) read `ROUTER.md` too |
| `Media Editor/benchmark/router/differential.py` | Modify | Copy parity reads `SKILL.md` and `ROUTER.md` as one surface, because it needs the `### Smart Router Pseudocode` pointer heading, not only the contract path |
| `Prompt Improver/benchmark/router/kernel_parity.py`, `Sales - HubSpot & Automation/benchmark/router/kernel_parity.py` | Modify | Read the Smart Router Pseudocode fence from `ROUTER.md` |
| `Moneybird Accountant/sk-moneybird-accountant/scripts/check-route-table.py` | Modify | Accept a final `## 3. MACHINE ROUTER` as the routing section, keep the generated block inside it, read the hub links from the hub `SKILL.md` and its `ROUTER.md`, and hold the hub router's machine block to the registry. The generator itself owns no heading, so it needs no change |
| `Product Owner/sk-create-figjam/scripts/flow_check.py` | Modify | Read `DIAGRAM_TYPES` from `SKILL.md`, then `ROUTER.md`; a reader the baseline inventory missed |
| 12 folders: `ROUTER.md` | Create | Copywriter, Deal Templates, Media Editor, Prompt Improver, Sales Communication, HubSpot Automation, `sk-product-owner`, `sk-create-figjam`, the Moneybird hub, and the three vendored MCP packets by pull |
| 4 existing `ROUTER.md` | Modify | Product Owner hub and three Moneybird packets: final `## 3. MACHINE ROUTER` |
| 16 `SKILL.md` | Modify | SMART ROUTING keeps short prose and the pointer sentence, the hub pointer form for the two hubs |
| 7 `SYNC.md` | Modify | Step 1 lists `ROUTER.md`; dated note naming the gate that still compares the kernel Router Code |
| `Product Owner/vendor.json` and the three vendored trees | Modify by pull | `vendor-sync.py pull` re-baselines them at the Public main commit |
| 4 `claude project/README.md`, 2 skill `README.md` | Modify | Skill version claims follow the 4-part version so parity check 6 still matches |
| `Moneybird Accountant/mode-registry.json`, `README.md` | Modify | `repo-root-hub` extension so the canon reads the hub id as the folder name in kebab case; the README names section 3 for the Task-Type Table |
| `Prompt Improver/sk-prompt-improver/ROUTER.md` | Modify | Section 2 prose naming the canon markers its pseudocode implements |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every gate edit in section 3 lands before the first skill moves, and each edited gate still prints its baseline pass line from `scratch/baseline.md` on the unmoved tree. |
| REQ-002 | 16 skill folders hold a `ROUTER.md` with `router_state: active`, `skill_pointer: SKILL.md`, `## 1. OVERVIEW`, `## 2. INTENT MODEL` and a final `## 3. MACHINE ROUTER` holding the moved machine data verbatim. |
| REQ-003 | Each of those 16 `SKILL.md` SMART ROUTING sections ends with a pointer whose relative link to the sibling `ROUTER.md` resolves: the 14 packet and standalone skills with the sentence ending "before selecting skill-local resources; open only the matched files.", and the Product Owner and Moneybird hubs with the hub form ending "before selecting hub resources." |
| REQ-004 | Every gate that exits 0 in `scratch/baseline.md` exits 0 after the move with the same counts, and no pre-existing red row gets worse. |
| REQ-005 | No commit reaches `Barter-BV/marketing-ai-systems` before the operator approves the push. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | No Claude Project gains a routing knowledge document, and no `Custom Instructions.md` or `systems.py` changes. Each of the seven system `SYNC.md` files lists `<skill>/SKILL.md` and `<skill>/ROUTER.md` in step 1 and carries a dated 2026-10-29 note naming the gate that still compares the kernel Router Code, and each `benchmark/parity/run_parity.sh` exits 0 with its baseline pass line. |
| REQ-007 | `check-route-table.py --write` emits the new heading, and a second `--write` changes nothing. |
| REQ-008 | `package_skill.py --check --strict` prints `Result: PASS` for each of the 16 moved skills. |
| REQ-009 | The Moneybird hub gains a root `ROUTER.md` with `## 1. OVERVIEW`, `## 2. INTENT MODEL` holding the stage one rules moved out of `SKILL.md` Section 2, and a final `## 3. MACHINE ROUTER` naming the child modes as `mode-registry.json` and `hub-router.json` do. Its `SKILL.md` Section 2 ends with the hub pointer line, still names its three children, and the hub routes exactly as before. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `find` in Measured Behavior lists 16 `ROUTER.md` files, the skill pointer `grep` counts 14 and the hub pointer `grep` counts 2.
- **SC-002**: A rerun of the baseline script reproduces every passing row of `scratch/baseline.md` with the same pass line and counts.
- **SC-003**: `git rev-list --count main..origin/main` and `origin/main..main` show the local commits held until the operator says push.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Public phase 005 on Public `main` | The vendored MCP packets cannot be pulled, and `package_skill.py` (through the symlink) applies whichever canon main holds | Order those packets last; check `ls` of the upstream `ROUTER.md` before the pull |
| Risk | Another session commits in a skill folder mid-move, Product Owner most of all | High | Recheck `git log --since` per system right before its step; stop on a dirty folder |
| Risk | `check-route-table.py --write` reverts a hand-edited heading | Med | Change the generator first and prove idempotence with two `--write` runs |
| Risk | A Project kernel edit without an H1 version bump fails parity check 4 | Med | Bump the kernel H1 in the same commit, or leave the kernel untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Per-call `SKILL.md` load drops by the removable machine mass, about 17,460 tokens over 12 skills, while the 16 pointer lines add about 240.
- **NFR-P02**: No gate runtime grows by more than 20% against the 2:45 total of the baseline run.

### Security
- **NFR-S01**: No step opens a `.env` file or a credential, and no gate that needs network or credentials runs.
- **NFR-S02**: No write lands outside the AI Systems paths in section 3 and this packet's folder.

### Reliability
- **NFR-R01**: Each system moves in its own commit, so one `git revert` undoes one system.
- **NFR-R02**: Every route object stays byte-identical: differential counts (281, 221, 186, 132, 110) are unchanged.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: the Moneybird hub has no machine data in `SKILL.md`, so its new `ROUTER.md` moves only the stage one prose and its `## 3. MACHINE ROUTER` projects the registry's modes and signals instead of a moved block.
- Maximum input: `sk-barter-copywriter` carries 2,789 machine words in 12 table and assignment blocks with no fence; they move as one block under `## 3. MACHINE ROUTER`.
- Failure path: a gate that exits non-zero after a step stops the run; that system's commit is not made, and the step is repaired in place or its uncommitted edits are discarded.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 60 files across 8 systems, 9 gate scripts, one second repository |
| Risk | 16/25 | Shared gates, a vendored tree, live commits by other sessions; reversible per commit |
| Research | 8/20 | Research is done; the baseline found five more readers |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Decided here:
- Should a Claude Project get a routing knowledge document (T023, T024)? Decision: no, the conductor's option C. Each Project keeps routing from its kernel's Router Code, the gates that compare it still compare the same kernel heading (the two `kernel_parity.py` files only learned to read the skill side from `ROUTER.md`), and `systems.py` stays as committed; each `SYNC.md` records the move instead (REQ-006).
- Should the Moneybird hub gain a `ROUTER.md`? Decision: yes, by the conductor's binding correction, because the parent goal says all 16 AI Systems skills own a `ROUTER.md` linked from `SKILL.md`. Its stage one prose moves into it and its routing stays the same (REQ-009).
- Which RS codes apply? Decision: the Public canon's. The AI Systems `.skilled/skills` is a symlink to Public main, so RS-004 is the missing sibling and RS-005 the missing pointer, as the baseline output shows.
- How do the three MCP packets move? Decision: by `vendor-sync.py pull` once Public main carries their `ROUTER.md`, never by hand.
- Where does `references/router-contract.md` go? Decision: it stays; the differential gates own it, and `ROUTER.md` links to it.
- Does the kernel `## N. ROUTER CODE` copy leave the kernel? Decision: not in this phase. The Sales gate says a Project reads the kernel every turn while Knowledge loads by relevance, so the kernel copy and its parity gates stay.
- How much routing prose stays in `SKILL.md`? Decision: a short summary only. The Public canon caps SMART ROUTING at 12 non-blank lines and 180 words (RS-001), so the prose sub-blocks the research meant to keep in `SKILL.md` (Prompt Improver's six, Copywriter's lane prose, Router Mechanics) moved verbatim into `ROUTER.md` Section 2, and every gate that read them now reads both files.

Still open:
- Should the four skills that still fail the strict canon checker (Copywriter missing `HOW IT WORKS` and `REFERENCES` sections; Sales Communication and Deal Templates named unlike their folders; HubSpot with 28 resource docs on the `0.NNN` version scheme) be fixed in a follow-up packet? Each fix reaches past a routing move.
- Should the stale Copywriter `lane-budget-baseline.md` be rewritten with `lane_budget.py --write` before step 3, so its differential gate starts green?
<!-- /ANCHOR:questions -->

---

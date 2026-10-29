---
title: "Implementation Plan: Phase 8: ai-systems-migration"
description: "Relax the AI Systems gates that forbid or slice a sibling ROUTER.md, then move each skill's machine router into one, system by system in the research order, and give each Claude Project a routing knowledge document. Each step is proved by rerunning its gates against scratch/baseline.md."
trigger_phrases:
  - "ai systems migration plan"
  - "ai systems router move plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: ai-systems-migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs; Python 3.9 gate scripts (`/usr/bin/python3`); Bash runners |
| **Framework** | AI Systems benchmark gates; Public `sk-create-skill` canon through the `.skilled/skills` symlink |
| **Storage** | None. Files in the AI Systems git checkout on `main` |
| **Testing** | `run_fixtures.sh`, `run_gates.sh`, `run_parity.sh`, the Moneybird scripts, `package_skill.py --check --strict` |

### Overview
Up to ten gate scripts change first so a sibling `ROUTER.md` is legal and readable. Then each of eight systems moves in its own local commit on AI Systems `main`, in the research 10.4 order: Media Editor, Prompt Improver, Barter - Copywriter, Sales - Direct Communication, Sales - HubSpot & Automation, Barter - Deal Templates, Moneybird, Product Owner. Each step reruns its system's rows of `scratch/baseline.md` and must reproduce every pass line, and the push waits for the operator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `scratch/baseline.md` holds 37 rows with command, last lines and exit, and `git status --porcelain --ignored` was identical before and after.
- [ ] `git -C "/Users/michelkerkmeester/MEGA/Development/AI Systems" status --porcelain` prints only the two `Product Context/Collab Phases/` lines at the start of execution.
- [ ] `ls /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/mcp-tooling/mcp-figma/ROUTER.md` prints the path before the vendored pull step.

### Definition of Done
- [ ] All acceptance criteria met.
- [ ] The baseline script rerun reproduces each passing row: `check_hub.py` prints `PASSED the hub, 4 registry packets and 51 gold rows`, the seven `run_fixtures.sh` exit 0 except the recorded Copywriter lane-budget red, and the seven `run_parity.sh` exit 0.
- [ ] Docs updated (spec/plan/tasks).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gate-first, per-system migration with one commit per system.

### Key Components
- **Sibling `ROUTER.md`**: frontmatter `router_state: active` and `skill_pointer: SKILL.md`; `## 1. OVERVIEW`; `## 2. INTENT MODEL` with the human-read routing prose; final `## 3. MACHINE ROUTER` with the moved machine data verbatim, per the Public `skill-router-template.md`.
- **`SKILL.md` SMART ROUTING**: the prose a model needs on every call, ending with the pointer sentence. Where a gate requires `SKILL.md` to name `references/router-contract.md` (Media Editor, Copywriter), that line stays.
- **Benchmark gates**: read a section from `SKILL.md` first and from the sibling `ROUTER.md` second, so a gate passes on both the old and the new tree during the move.
- **Claude Project kernel**: unchanged. Each Project keeps routing from its kernel's `## N. ROUTER CODE`, which the system's differential or kernel parity gate still holds equal to the skill's router, and each `SYNC.md` step 1 lists `ROUTER.md` beside `SKILL.md`.

### Data Flow
`Commands/agent-router.md` reads `{skill_folder}/SKILL.md` completely; the pointer sentence then sends the agent to `ROUTER.md` before it opens a resource. No runtime reads a sibling of `SKILL.md` on its own, so the pointer is the load path. A Claude Project cannot follow a relative link and reads no routing knowledge document; its kernel keeps its own `## N. ROUTER CODE` copy that the parity gates hold equal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check_hub.py` lines 55-62, 185-187, self-test 549 | Forbids a packet `ROUTER.md`, requires packet routing in `SKILL.md` section 2 | update | `python3 benchmark/gates/check_hub.py` and `--self-test` exit 0 |
| `check_leaf_map_parity.py` lines 71-75, 88-91 | Reads packet `RESOURCE_MAP` from `SKILL.md` | update | prints `PASSED 9 router lanes ...` |
| Five `differential.py` and two `kernel_parity.py` (Prompt Improver, Sales HubSpot) | Slice prose or lift a fence from `SKILL.md` by heading | update | each prints its baseline pass line |
| `sk-create-figjam/scripts/flow_check.py` | Lifts `DIAGRAM_TYPES` out of `SKILL.md`; the T004 pattern misses it | update | `flow check self-test` prints `201 of 201 self-test checks passed` |
| `check-route-table.py` hub check | Requires `## 2. SMART ROUTING` in every packet router; the generator only rewrites the lines between the router-block markers | update the check, not the generator | `route-table: ok`; second `--write` leaves the nested repository's `git diff` unchanged |
| `check-skill-words.py`, `route-replay.py`, `exit-code-parity.sh` | Read `ROUTER.md` and `SKILL.md` | unchanged | baseline rows 26, 28 and 30 reproduce |
| `Commands/agent-router.md` | Loads `SKILL.md` completely | not a consumer | the pointer sentence carries the load |
| Sync Loop `systems.cjs` lines 74, 108 | Declares `ROUTER.md` an instruction surface | unchanged | `rg -n "ROUTER.md" systems.cjs` still prints both lines |
| Product Owner `vendor.json` | Hashes the three vendored MCP trees | update by `vendor-sync.py pull` only | `vendor-sync.py status` prints `in step` for the three packages |

Required inventories:
- Same-class producers: `rg -n 'SMART ROUTING|Smart Router Pseudocode|ROUTER CODE|SKILL\.md|ROUTER\.md' "AI Systems" --glob '*.py' --glob '*.sh' --glob '*.cjs' --glob '!**/specs/**' --glob '!**/reports/**'`, run before the first edit; any reader not in the table above is added before its system moves.
- Consumers of changed symbols: `rg -n 'PACKET_RESIDUE|SMART_ROUTING_SECTION|PSEUDOCODE_HEADING|KERNEL_ROUTER_HEADING' "AI Systems" --glob '*.py'`.
- Matrix axes: 8 systems x {gate edit, skill move, Project document} with 37 baseline rows; Moneybird has no Project.
- Algorithm invariant: every route object a gate computes is identical before and after its system moves.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms the tree and the upstream; Implementation lands the gate edits, then the eight systems in order, then the Project documents; Verification reruns the baseline and holds the push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each edited gate on the unmoved tree, then on the moved tree | `python3 <gate>.py`, `check_hub.py --self-test` |
| Integration | Each system's full runner | `bash benchmark/router/run_fixtures.sh`, `bash benchmark/gates/run_gates.sh`, `bash benchmark/parity/run_parity.sh` |
| Manual | Read each moved `SKILL.md` SMART ROUTING and its `ROUTER.md` side by side | `package_skill.py --check --strict <skill>` prints `Result: PASS` |

The authoritative check is the baseline runner rerun, compared row by row with `scratch/baseline.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Public phase 005 on Public `main` | Internal | Green: Public `main` carries the three `ROUTER.md` files, and the pull ran at `ca10a236d2` | None left |
| `/usr/bin/python3` with the standard library | External | Green | None |
| Seeded tiktoken cache for `route-replay.py --mode resolve` | External | Red: absent | That row stays exit 2 before and after; replay mode still runs |
| Operator approval for the push | Internal | Pending | Commits stay local |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate that passed in `scratch/baseline.md` fails after a step, or a route object changes.
- **Procedure**: before the commit, discard that step's uncommitted edits; after it, `git revert <sha>` for that one system's commit. Nothing is pushed, so no remote state needs repair.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Gate edits ──► Systems 1-8 (in order) ──► Project documents ──► Verification ──► [operator] push
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `scratch/baseline.md` | Gate edits |
| Gate edits | Setup | Every system move |
| Systems 1-8 | Gate edits; Product Owner MCP packets also on Public main | Project documents |
| Project documents | The system's `ROUTER.md` | Verification |
| Verification | All of the above | Close and push |
<!-- /ANCHOR:phase-deps -->

---

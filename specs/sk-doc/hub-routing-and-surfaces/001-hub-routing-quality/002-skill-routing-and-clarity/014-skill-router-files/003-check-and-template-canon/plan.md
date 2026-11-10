---
title: "Implementation Plan: Phase 3: check-and-template-canon"
description: "Reverse RS-004, rewrite RS-005 as the pointer rule, widen the root-router gate past hubs and record the 54 unmoved skills in a debt ledger, so phases 004 and 005 can move every router file without leaving the tree red."
trigger_phrases:
  - "check and template canon plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: check-and-template-canon

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python 3.9, Node.js |
| **Framework** | None |
| **Storage** | JSON ledgers under `.skilled/skills/sk-doc/sk-create-skill/scripts/` |
| **Testing** | pytest, `node --test` |

### Overview

The routing-shape rules change in `package_skill.py` for a single skill and in the two JS checks that share `root-router-contract.cjs`, with 12b covering a hub and its packets. The ledger records all 54 unmoved skills and modes, so the canon lands without a red tree, then the frozen snapshot makes every future raise visible to a reviewer. The proof is a fixture pair per rule, the ratchet suite, `12b` on all seven hubs, and the fleet gate printing 13 roots with 0 failures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The baseline commands in `tasks.md` T001 and T002 run on this tree

### Definition of Done
- [x] All acceptance criteria met
- [x] `python3 -m pytest` over the four Python files prints at least 84 passed, and the five `node --test` suites print 0 fail
- [x] `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints `failed=0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two shape checks and one shared contract.

### Key Components

- **`package_skill.py`**: the Python routing-shape check that `/create:skill` and the strict package gate run.
- **`parent-skill-check.cjs` checks 12a and 12b**: the hub audit. 12a owns the router contract, 12b owns the shape of the hub and every declared packet.
- **`ci-skill-root-metadata.cjs` with `root-router-contract.cjs` and `skill-root-metadata-contract.cjs`**: the fleet gate that classifies each root as `H` or `S` and enforces that class.
- **`routing-shape-known-debt.json` with `lib/routing-shape-debt.cjs`**: the migration ledger and the one JS reader both JS checks use.

### Data Flow

The fleet gate classifies each root, reads the ledger by the root's path under `.skilled/skills`, and runs the router contract on the root's `ROUTER.md`. Check 12a runs the same contract on the hub root and on each packet the registry declares, which is the target list 12b already builds at line 2127. The Python check reads `SKILL.md`, finds the sibling router and the pointer, emits one finding per broken rule, and lets a recorded code through as a warning. Both shape checks follow phase 002's precedence rule: the sibling `ROUTER.md` is the router, the `SKILL.md` section is migration debt, and a file with both is the dual declaration RS-002 reports. `--strict` promotes every remaining finding to an error.

Four decisions shape the change.

- **RS-002 is restated, although the brief names only RS-004 and RS-005.** A moved skill that keeps its inline section would carry two homes for one router, and research section 7 keeps one projection per file. A block-only test would let a prose-only section pass, which three hubs would do today. If RS-002 is left alone, phase 004 has no gate, because the seven hubs already point at `./ROUTER.md` and would pass RS-004 and RS-005 before they move anything. The ledger's `machineBlocks` field then counts RS-002 findings, which is one per remaining section, so its description and the three zero entries change in the same diff.
- **RS-005 needs a markdown link, not a bare mention.** The check resolves the link target, so a sentence that names `ROUTER.md` without a link cannot pass a file that is not there. The hub `SKILL.md` files already carry `[`ROUTER.md`](./ROUTER.md)`, so they pass unchanged.
- **A non-hub `ROUTER.md` declares `router_state: active` with its own non-empty maps.** `stage1-only` stays a hub state, because a standalone skill has no mode registry to stage against. The contract gains a target class and its messages name the skill instead of the hub. The codes stay `RRC-001` to `RRC-009`.
- **A packet's `ROUTER.md` owns that packet's map inside a final `## MACHINE ROUTER` section, and a hub's moved prose goes after its `MACHINE-READABLE ROUTER` map.** Phase 002's resolver slices from the machine-router heading to the end of the file, so a prose section placed last cannot pick up the hub's stage-two block, and the hub keeps resolving through `hub-router.json`.

What still speaks the old contract, from research section 4 and this phase's surface: the two shape checks, the fleet gate, the two contract libraries, the four create-skill workflow assets, the templates and the canon docs. Nothing outside this repository was checked, and the changelog upgrade section is the notice for a skill that lives elsewhere.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline in `scratch/before.txt`, Implementation changes the rules, the contract and the ledger, and Verification reruns both gates and every suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The three restated codes in both checks | `python3 -m pytest`, `node --test` |
| Contract | The class-aware router contract for `H`, `S` and a packet | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs` |
| Ratchet | The live ledger stays inside the frozen snapshot | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs` |
| Integration | 13 skill roots and 41 packets | `ci-skill-root-metadata.cjs`, `parent-skill-check.cjs` on each hub |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002's shared resolver | Internal | Pending | A check requires a file no reader opens |
| Node with `node --test` | Tool | Green | The four JS suites cannot run |
| pytest with PyYAML | Tool | Green | The three Python suites cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A restated code fails a skill that should pass, or a hub's replay projection changes.
- **Procedure**: Revert the phase commit, which restores the empty ledger and the prior frozen snapshot, then rerun the four suites and the fleet gate. Both ledger files are tracked, so the revert is exact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup, and phase 002's shared resolver | Verification |
| Verification | Implementation | Closure of the phase |
<!-- /ANCHOR:phase-deps -->

---

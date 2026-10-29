---
title: "Implementation Summary"
description: "Phase 3 has not started. This document records the plan of record: the routing canon moves to a sibling ROUTER.md, both checks follow, the root-router gate leaves the hub, and 54 unmoved skills pass through a debt ledger."
trigger_phrases:
  - "check and template canon implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/003-check-and-template-canon"
    last_updated_at: "2026-10-29T07:52:43Z"
    last_updated_by: "planner"
    recent_action: "Authored the phase plan, tasks and acceptance criteria"
    next_safe_action: "Run T001 after 002 lands"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-check-and-template-canon |
| **Completed** | Not complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. The phase has not started, and this document records the plan of record so the next session can begin at `tasks.md` T001.

### Phase 3: check-and-template-canon

When built, this phase lets every skill and mode own a sibling `ROUTER.md` and makes both routing-shape checks require it. It reverses RS-004, rewrites RS-005 as the pointer rule, restates RS-002 so a `## MACHINE ROUTER` section left in `SKILL.md` fails, widens the root-router gate to standalone skills and mode packets, and records the 54 unmoved skills and modes in the known-debt ledger. You gain a canon that phases 004 and 005 can act on without a red tree, and a ledger that only shrinks.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `package_skill.py` | Planned | RS-002 destination, reversed RS-004, RS-005 pointer rule |
| `parent-skill-check.cjs` | Planned | 12a per packet, 12b with the restated codes |
| `ci-skill-root-metadata.cjs` | Planned | Router contract for every class |
| `lib/root-router-contract.cjs` | Planned | Class-aware contract and non-hub messages |
| `lib/skill-root-metadata-contract.cjs` | Planned | `ROUTER.md` required for a standalone root |
| `lib/routing-shape-debt.cjs` | Planned | One JS reader for the ledger |
| `routing-shape-known-debt.json` | Planned | One entry per unmoved skill and mode |
| `scripts/tests/fixtures/routing-shape-known-debt-frozen.json` | Planned | Raised ceiling with the added codes |
| Nine test files under `scripts/tests/` and `.skilled/commands/doctor/scripts/tests/` | Planned | A case per restated code and the class-aware contract |
| The sk-create-skill templates and `init_skill.py` | Planned | Scaffold a sibling router and a pointer |
| The four create-skill workflow assets | Planned | Emit the router file and the pointer |
| The six canon docs | Planned | Describe the reversed packet rule and the five codes |
| `SKILL.md`, `changelog/v1.8.0.0.md`, `.skilled/skills/sk-doc/leaf-manifest.json` | Planned | Release entry and regenerated hub manifest |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The plan names the proof, and the baselines below were observed on the tree before any change.

Setup records the baselines in `scratch/before.txt`, Implementation changes the rules, the contract and the ledger, and Verification reruns both gates and every suite from the final tree. The build runs in `worktrees/269-skill-router-files`, after phase 002's resolver lands, and it lands through `sk-git` with a conventional commit once `validate.sh --strict` prints `RESULT: PASSED` on this packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The ledger carries the migration, not a runtime flag | One JSON file is readable by the Python check, both JS checks and a reviewer, and the frozen snapshot makes every raise show up in a diff |
| RS-002 changes destination, not only RS-004 and RS-005 | A moved skill that keeps its inline section holds two homes for one router, a block-only test would let a prose-only section pass, and phase 004 needs a gate the hubs currently fail |
| RS-005 resolves a markdown link | A bare mention cannot prove the file exists, and the hub `SKILL.md` files already carry the link form |
| A non-hub `ROUTER.md` is always `active` | A standalone skill has no mode registry to stage against, so `stage1-only` would mean an empty router |
| Widen the fleet gate and 12a instead of adding a checker | The two checks already own the classes and the packet list, and a third checker would be a third reader of one contract |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_routing_shape.py` | Not run. Baseline before this phase: 20 passed |
| `python3 -m pytest -q` over the other three Python files | Not run. Baseline before this phase: 64 passed |
| Five `node --test` suites | Not run. Baselines: 1, 1, 4, 1 and 1 passed, 0 fail |
| `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Not run. Baseline before this phase: `checked=13 passed=13 failed=0` |
| `parent-skill-check.cjs` 12b on seven hubs | Not run. Baseline before this phase: 0 known debt and 1 to 14 packets per hub |
| `validate.sh --strict` on this packet | Not run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The ledger cannot tell a finished skill from an unfinished one by itself.** A skill whose recorded codes stop firing is reported as stale only when it raises no finding at all, so phase 005 must remove each entry in the same edit that moves the router.
2. **The seven hubs already pass RS-004 and RS-005.** They keep a root `ROUTER.md` and a pointer today, so only the restated RS-002 holds them in the ledger until phase 004 moves their prose.
3. **A skill outside this repository has no ledger key.** After the release it fails `--strict` until its author adds `ROUTER.md` and the pointer, and the changelog upgrade section is the only notice.
<!-- /ANCHOR:limitations -->

---

---
title: "Implementation Summary"
description: "Built, not planned. The router canon moved into a sibling ROUTER.md, both shape checks require it, the root-router gate left the hub, and the 54 skills that have not moved pass through a known-debt ledger. No live skill has moved its router yet, which is phases 004 and 005."
trigger_phrases:
  - "check and template canon implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/003-check-and-template-canon"
    last_updated_at: "2026-10-29T11:30:00Z"
    last_updated_by: "pi"
    recent_action: "Moved the routing canon, checks, ledger and templates to the sibling ROUTER.md"
    next_safe_action: "Build 004-hub-router-merge"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-check-and-template-canon |
| **Completed** | 2026-10-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every skill and mode packet now owns a sibling `ROUTER.md`, and both routing-shape checks require it. `package_skill.py` reports RS-002 when a `## MACHINE ROUTER` section is left in `SKILL.md`, with or without a code block, because that section is a second home for a router that lives in the sibling file. RS-004 reversed: a missing sibling file is a finding, and so is a file whose real path leaves the skill folder, since a link to a parent's file would let two skills share one declaration. RS-005 became the pointer rule, a relative markdown link in the routing prose whose target names `ROUTER.md` and resolves to a file inside the folder. A fenced sample of the link pattern is not a pointer, so `_fenced_spans` keeps the scan away from it. `validate_smart_router` reads the markers from the sibling file too, so a skill that moved its pseudocode out is still checked.

The root-router gate left the hub. `ci-skill-root-metadata.cjs` runs the shared contract for `CLASS_STANDALONE` as well as `CLASS_HUB`, and check 12a runs the same contract for the hub root and for every packet the registry declares. `lib/root-router-contract.cjs` grew a target class, so a packet is held to an active router and its findings speak of a skill root, while the line's own prefix names the packet. `lib/skill-root-metadata-contract.cjs` requires `ROUTER.md` of a standalone root. Check 12b kept its codes and moved its rules onto the same shape.

One ledger carries the migration. `lib/routing-shape-debt.cjs` is the single JS reader that both checks use, and `routing-shape-known-debt.json` holds one entry for each of the 54 unmoved skills and modes, recording the SMART ROUTING line and word counts, the machine-block count and the codes it may raise. `scripts/tests/fixtures/routing-shape-known-debt-frozen.json` was raised to the same 54, so any later growth shows up in a diff. A packet with no file whose entry records RS-004 is reported as known debt by 12a, and 12b tolerates only what its entry recorded.

The templates and workflows describe the new shape. `assets/skill/skill-router-template.md` is new and carries the `## MACHINE ROUTER` heading phase 002's resolver reads. `init_skill.py` gives a fresh standalone skill its router and its pointer, gives a fresh mode packet a `references/workflow.md` as its first leaf plus a router that names it, and moves a hub's compiled-routing directive into the hub's `ROUTER.md`. The four create command assets, the two presentation summaries, the two command docs, the six canon references, the `SKILL.md` version carrier at 1.8.0.0, the new `changelog/v1.8.0.0.md` and the sk-doc leaf manifest moved with them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modified | RS-002 destination, reversed RS-004, RS-005 pointer rule, markers read from the sibling file |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | 12a per declared packet through one contract run, 12b on the shared ledger reader |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modified | Router contract for every class, ledger tolerance for a listed root |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | Modified | Target class and messages that name the skill rather than the hub |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs` | Modified | `ROUTER.md` required for a standalone root |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/routing-shape-debt.cjs` | Created | One JS reader for the ledger, shared by both checks |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` | Modified | One entry per unmoved skill and mode, 54 in all |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/routing-shape-known-debt-frozen.json` | Modified | Raised to the same 54 entries with the codes each one adds |
| Eleven suites under `.skilled/skills/sk-doc/scripts/tests/`, `sk-create-skill/scripts/tests/` and `.skilled/commands/doctor/scripts/tests/` | Modified | A case per restated code, the class-aware contract, the packet cases, and the fixtures the other doctor checks needed |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-router-template.md` | Created | The sibling router template, with the heading the resolver reads |
| The seven other sk-create-skill templates | Modified | Router block to the sibling file, pointer in the scaffold, packet rule reversed |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py` | Modified | A fresh skill and packet are born with their router and their pointer |
| The four create command assets, the two presentation summaries and the two command docs | Modified | Steps emit the router and the pointer, and no doc says a packet has none |
| The six sk-create-skill references | Modified | The five codes, the ledger and the per-class gate |
| `.skilled/bin/lib/compiled-route-manifest.cjs` and the two `registry-compiler.cjs` copies | Modified | Compiled routing reads the fallback checklist from `ROUTER.md` when a skill declares a machine router |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`, `changelog/v1.8.0.0.md`, `.skilled/skills/sk-doc/leaf-manifest.json` | Modified, created, modified | Release carrier, release entry and the regenerated hub manifest |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

In the order `tasks.md` sets: the four baselines and the old-shape copy, then the restated codes in both shape checks, then the class-aware contract and the ledger with its frozen snapshot, then the suites, then the templates, the scaffold and the canon docs, then the release entry and the hub manifest. Verification reran both gates and every suite from the final tree, and the phase closed on the strict spec gate.

Two commands prove the change in one pair. `package_skill.py --check --strict` on the copy at `scratch/old-shape/sk-git` reports RS-002, RS-004 and RS-005, and the same command on the live `sk-git` folder prints `Result: PASS`, because `sk-git` has not moved and its shape is recorded. The unfixed copy is what keeps the new rules honest: the check still rejects the shape it used to require. The copy was removed before the commit, because it is a 1.7 MB duplicate of a live skill with dangling links; `git archive origin/main .skilled/skills/sk-git` recreates it.

Two review rounds followed the first green run. The first raised one P1, a seeded `references/workflow.md` with no frontmatter, and five P2s on how Python and JS read the shape rule. Both languages were then held to one written rule. The second found three remaining JS gaps: a dangling `ROUTER.md` symlink passed as a missing file the ledger excuses, and a titled link or an image counted as the pointer. All three now fail as Python fails, and `routing-shape-parity.test.cjs` carries a fixture for each.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A non-hub router may name its own package index, `feature-catalog/feature-catalog.md` or `manual-testing-playbook/manual-testing-playbook.md`, without a manifest pair, and a hub router may not | The leaf-manifest generator excludes those index pages by design, so the pair can never be produced for them. Without the split for a non-hub, every fresh standalone skill failed RRC-006 |
| Compiled routing reads the fallback checklist and the router directives from `ROUTER.md` when a skill declares a machine router, and from `SKILL.md` as before when it does not | Every live hub still reads `SKILL.md`, so every live manifest is unchanged and phases 004 and 005 need no second compiler. The authored compiler under `specs/sk-doc/z_archive` was updated with the promoted copy |
| A packet's router names its leaves relative to the packet folder, and 12a resolves them against the packet first and the hub second | The registry and the manifest name a packet's leaves the way the packet writes them, so a hub-relative resolution would hand a packet leaf a path outside its own folder. A test pins the order |

Two smaller settlements came with those three. A fresh mode packet is scaffolded with `references/workflow.md` as its first leaf, because a README is not a leaf and the packet's router needs one real target. And the command docs `create/skill.md`, `create/skill-parent.md` and `create-skill-parent-presentation.txt` no longer say a mode packet has no `ROUTER.md`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m pytest` over the four Python files | `106 passed`, up from 84 |
| All sk-doc Python tests | `290 passed` |
| The create asset tests | `15 passed` |
| All 23 sk-create-skill JS suites | `fail 0` each, `create-journey-proof` included |
| `.skilled/commands/doctor/scripts/tests/run-all.sh` | `7 suite(s) passed, 0 failed`, `node:test` at 548 passes |
| `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | `checked=13 passed=13 failed=0 fixed=0` |
| `parent-skill-check.cjs` on the seven hubs | All hard invariants passed. 12b known debt: cli-classifier 2, cli-external-orchestration 8, mcp-tooling 9, sk-code 5, sk-design 5, sk-doc 15, system-deep-loop 4 |
| `routing-shape-parity.test.cjs` | `27 fixture(s) matched on both checks`, each against the code set the rule states |
| `package_skill.py --check --strict` on all 54 skills | 0 failures, because an unmoved skill carries its codes as recorded debt |
| `package_skill.py --check --strict` on `scratch/old-shape/sk-git` | `RS-002`, `RS-004` and `RS-005` |
| `package_skill.py --check --strict` on the live `sk-git` | `Result: PASS`, its debt recorded |
| The ledger and its frozen snapshot | 54 entries each, `rg -c '"lines":'` printing 54, and the ratchet suite `fail 0` |
| `compiled-route-sync --check` | All 55 served copies match their authored files |
| `compiled-route-guard` | 7 hubs fresh after the sk-doc re-mint |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict` | `RESULT: PASSED` after `repair-derived.cjs --apply`, `AC_COVERAGE` at 9/9 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live skill has moved its router yet.** All 54 pass as recorded debt until phases 004 and 005 move them. The 7 hubs record RS-002 alone, because they already own a root `ROUTER.md` and the link, and the 47 other skills record RS-002, RS-004 and RS-005.
2. **The ledger cannot tell a finished skill from an unfinished one by itself.** A skill whose recorded codes stop firing reads as stale only when it raises no finding at all, so phase 005 must remove each entry in the same edit that moves the router.
3. **A skill outside this repository has no ledger key.** After the release it fails `--strict` until its author adds `ROUTER.md` and the pointer, and the changelog upgrade section is the only notice.

<!-- /ANCHOR:limitations -->

---

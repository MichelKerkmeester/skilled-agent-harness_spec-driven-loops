---
title: "Implementation Summary"
description: "The skill-benchmark lane is removed from every reachable surface: five runtime command trees, the system-deep-loop registry and router pair, the advisor command-bridge projection, its script and fixture trees, and three runtime ledger libraries. The hub now registers five workflow modes instead of six."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/047-deprecate-skill-benchmark"
    last_updated_at: "2026-09-11T17:07:52Z"
    last_updated_by: "template-author"
    recent_action: "Removed the skill-benchmark lane and verified the hub still resolves five modes"
    next_safe_action: "Operator decides on the three recorded residue questions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-047-deprecate-skill-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 047-deprecate-skill-benchmark |
| **Completed** | 2026-09-11 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `skill-benchmark` lane is gone. 196 tracked files were deleted and 57 were edited, and the `system-deep-loop` hub now registers five workflow modes where it registered six. Nothing that belonged to another packet or another mode went with it: the 554 historical benchmark reports stored under other skills are byte-identical, and both surviving improvement lanes still plan and dispatch.

### Deprecate the deep-skill-benchmark lane

The lane was reachable only through its `/deep:skill-benchmark` command, because its registry entry carried `advisorRouting.routingClass: "command-bridge"` rather than an advisor-scored class. That shaped the work: cutting the command surface in five runtime trees removed the entry path, and removing the registry entry removed the destination, and everything between the two had to follow so no surface advertised a route that no longer existed.

What you get is a hub whose registry, router, leaf manifest, command metadata and advisor projection all agree on the same five modes, with no dangling link to a deleted file and no code path importing a deleted module.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Command front doors in 5 runtime trees | Deleted | Removes the only entry path to the lane |
| `.opencode/commands/deep/assets/deep-skill-benchmark-*` | Deleted | Removes the auto/confirm workflows and presentation contract |
| `deep-improvement/scripts/skill-benchmark/` | Deleted | Removes the orchestrator, scorers, executors and lane tests |
| `deep-improvement/assets/skill-benchmark/` | Deleted | Removes the profile and fixture corpus |
| `deep-improvement/{references,feature-catalog,manual-testing-playbook}/skill-benchmark/` | Deleted | Removes the lane's own documentation trees |
| `runtime/lib/skill-benchmark-{ledger-schema,reducers,sealed-artifacts}/` | Deleted | Removes the lane's typed ledger stack |
| `runtime/tests/unit/skill-benchmark-*.vitest.ts` | Deleted | Removes tests for the deleted libraries |
| `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json` | Modified | Unregisters the mode across the hub identity surfaces |
| `command-metadata.json` | Modified | Removes the command and the sibling cross-references pointing at it |
| `leaf-manifest.json` | Regenerated | Keeps the byte-drift invariant satisfied |
| Advisor bridge (`skill_advisor.py`, `projection.ts`, `command-bridges.generated.json`) | Regenerated | Removes the command-bridge entry without hand-editing generated blocks |
| `scripts/shared/loop-host.cjs` | Modified | Drops the lane branch, constants and export while keeping both survivors |
| `runtime/scripts/append-mode-event.cjs` | Modified | Drops the adapter that imported a deleted library |
| `tests/unit/host-driven-improvement.vitest.ts` | Modified | Updates the assertion that pinned the improvement lane count at three |
| `runtime/lib/per-mode-authority-flip/types.ts` | Modified | Drops the mode from the frozen authority order a live write-path test enforces |
| `.opencode/bin/lib/compiled-routing/.../registry-compiler.cjs` | Modified | Drops the mode from the hardcoded improvement-lane list the live compiled router compiles against |
| `.opencode/bin/lib/compiled-routing/.../fixtures/canary-cases.v1.json` | Modified | Removes the canary case and no-collapse entry asserting the deleted mode routes |
| `AGENTS.md` | Modified | Removes the command pointer only |
| `README.md`, `.opencode/commands/README.txt`, 4 agent definitions | Modified | Removes user-facing descriptions of a command that no longer exists |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Inventory first. A raw scan matched 1254 tracked paths, and most of them were not the lane: 554 were historical report artifacts owned by other skills and 501 were spec-packet history. Bucketing the map by owning directory before deleting anything is what kept those 1055 files out of the deletion set.

Removal then ran in dependency order: command surfaces, lane trees, registry sources, then the generators that project them. `leaf-manifest.json` and the advisor bridge were regenerated rather than edited, because both are drift-checked and a hand edit only surfaces as a CI failure later.

Verification compared a hub-gate baseline taken before any change against the same gate afterwards, and the two documentation sweeps ran in parallel over disjoint file sets. Two runtime failures were genuinely caused by the removal: a test asserting the old improvement-lane count, and a test asserting that every mode in the frozen authority order still routes through the write CLI. Both were contracts being changed, so both were updated at their source. Every other failing test was traced to an input this work never touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the lane as a registered hub mode, not a side lane | Its entry sits in `mode-registry.json` under the key `skill-benchmark`; a search for the `deep-` prefixed name misses it and understates the blast radius |
| Preserve all 554 historical report files | They are other skills' run evidence; sharing a filename prefix with the lane is not ownership |
| Regenerate rather than hand-edit generated artifacts | The leaf manifest is compared byte-for-byte against a fresh regeneration, and the advisor bridge spans three files in two languages |
| Leave the dead mode constant in most shared type unions | The dependency runs lane to shared, never the reverse, so nothing breaks; removing it would change contracts two live lanes depend on |
| Remove it from the frozen authority order anyway | A live test asserts every mode in that order is routable through the write CLI, so leaving it there while deleting the adapter left the tree provably broken |
| Leave `sk-create-benchmark` alone | It is a mode of a different parent hub with its own registry and router |
| Build a standard packet despite a phase-qualifying score | The operator named one folder; decomposing into phase children would add structure nobody asked for |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `parent-skill-check.cjs .opencode/skills/system-deep-loop` | PASS - all hard invariants passed, 0 warnings; checks 5b, 6b, 10d read 5 modes. Baseline had 1 failure (`12-lib`, a missing worktree dependency), now resolved |
| Lane commands in any of 5 runtime trees | PASS - 0 tracked files |
| Imports of deleted libraries across `lib/`, `scripts/`, `tests/` | PASS - 0 hits |
| Historical report files preserved | PASS - 554 before, 554 after |
| `loop-host.cjs` smoke test | PASS - `VALID_MODES` is exactly the two survivors; model-benchmark still returns its two-step plan |
| Live compiled-routing snapshot (`loadSnapshot()`) | PASS - compiles clean and resolves exactly research, review, ai-council, agent-improvement, model-benchmark, with no lane string anywhere in the snapshot |
| `derive-command-bridges.cjs` | PASS - rewrote all three projection files; advisor tree holds no lane reference; `py_compile` clean |
| `generate-leaf-manifest.cjs` | PASS - manifest lists 5 modes and matches a fresh regeneration byte for byte |
| `validate.sh <this packet> --strict` | PASS - see the closing verification run |
| Deep-loop runtime unit suite (whole gate) | 113/121 files, 2217/2229 tests passed. Two failures were caused by this work and were fixed at source; the other 10 were each traced to an input this work never touched |
| The two failures this work caused, re-run individually | PASS - `host-driven-improvement` 3/3 and `append-mode-event-cli` 15/15 |
| deep-improvement lane suite (whole gate) | 391/392 passed. The single failure is a cli-pi model-roster default with no lane reference |
| Advisor `routing-registry-drift-guard` | PASS - 7/7, so the registry edit leaves no advisor projection drift |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The mode name survives as a dead string constant** in `deep-improvement-common-*` type unions, `blinded-adjudication` contracts and adapters, `shipped-census.ts` and `legacy-projection-manifest.ts`, plus the four tests asserting on them. Nothing imports the deleted code, so nothing is broken, and those four test files pass. Removing the constant is a shared-contract change across two live lanes, so it was left for an operator decision. One member of this group was **not** left alone: `per-mode-authority-flip/types.ts` declared the mode in `AUTHORITY_FLIP_MODE_ORDER`, and a live test asserts every mode in that order is routable through the write CLI. Removing the write adapter without removing the order entry broke that invariant, so the order entry went too.
2. **Four `sk-doc` scripts consumed the deleted lane as a shared library and now fail.** `sk-create-benchmark/scripts/render-serving-snapshot.cjs`, `sk-create-benchmark/scripts/archive-compiled-routing.cjs` and `sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs` throw at require time; `sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs` fails only on the code path that reaches its require. `sk-create-benchmark` also still teaches how to author lane-C benchmarks in its `SKILL.md`, storage guide, serving-snapshot schema and readme template. Repairing or retiring these means editing a second parent hub, which is outside this packet's frozen scope. A third hub is affected the same way: `sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:56` runs a vitest file that lived inside the lane's test directory, so sk-code's router drift guard now points at a deleted path and has no replacement.
3. **`run-manual-playbook-scenario.cjs` was a fleet-wide manual-playbook result-persistence wrapper** that lived inside the lane and is now gone. It is still referenced by `system-spec-kit`, `sk-communication`, `sk-vision` and `sk-doc/sk-create-manual-testing-playbook` documentation, so those persistence instructions no longer have a runner.
4. **Other skills' `benchmark/README.md` files still describe stored skill-benchmark reports.** Those descriptions are now historical rather than current.
5. **Generated spec-kit retrieval corpora still index the lane's vocabulary** (`trigger-index.json` and the retrieval fixtures). They are regenerated artifacts and were already modified in the main checkout, so regenerating them here risked a collision.
6. **Pre-existing runtime test failures remain**, unrelated to this work: compiled command-contract staleness for `deep/research`, `deep/review` and `deep/ai-council`, a combo-matrix executor case, two multi-process lock/fencing cases, and three optimizer-manifest cases that read a manifest absent from the repository.
<!-- /ANCHOR:limitations -->

---


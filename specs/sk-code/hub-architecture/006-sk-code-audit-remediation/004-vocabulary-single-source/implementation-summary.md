---
title: "Implementation Summary"
description: "A frontend keyword that changes in one copy and not the others now fails the router-sync guard, and so does a registry alias that no routing class holds. The packet router no longer repeats the keywords in prose."
trigger_phrases:
  - "vocabulary single source implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/004-vocabulary-single-source"
    last_updated_at: "2026-11-14T14:41:22Z"
    last_updated_by: "implement-workflow"
    recent_action: "Made a vocabulary mismatch between the hub's copies fail check 2 of the router-sync guard"
    next_safe_action: "Start 005-hub-router-alignment"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-vocabulary-single-source"
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
| **Spec Folder** | 004-vocabulary-single-source |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A frontend keyword that changes in one copy and not the others now fails the router-sync guard, and so does a registry alias that no routing class holds. The packet router no longer repeats the keywords in prose.

### Phase 4: vocabulary-single-source

You can change a frontend keyword in `hub-router.json` and the guard tells you which other copy still disagrees. Check 2 of `verify-router-sync.cjs` holds two rules. Every registry alias must be a keyword in a `hub-router.json` class its mode routes on, which runs for all five modes. A surface listed under `vocabularyMirrors` in `hub-router.json` must hold one keyword set in its classes, the hub `INTENT_SIGNALS` rows and its own `INTENT_SIGNALS` rows. The frontend surface is listed. Section 2 of the packet router points at the machine block and keeps only what each intent loads.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modified | `keywordsOf` and `vocabularyProblems`, called from check 2 |
| `sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modified | One passing hub and one mutated hub |
| `hub-router.json` | Modified | The optional `vocabularyMirrors` list, holding `sk-code-frontend` |
| `mode-registry.json` | Modified | The alias rule in the registry description |
| `sk-code-frontend/ROUTER.md` | Modified | Section 2 points at section 3 and no longer lists keywords |
| `sk-code-skilled/scripts/README.md`, `sk-code-skilled/assets/scripts/README.md`, `README.md` | Modified | Name the vocabulary comparison and the new key |
| Two `activation/sk-code/manifest.json` files | Regenerated | Policy hash after the router and registry change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The guard was read in full and the three copies were measured for every surface before any edit. Eight literal briefs went to DeepSeek V4.1 Flash at max thinking through cli-pi. The orchestrating session ran the guard on the clean tree, the two mutations in a scratch copy of the hub, the manifest refresh, the probe replay, the three test suites, the drift guards, the setup battery and the quality runner. The code landed as `9a9bbb76aa`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The three-way match runs only for a surface listed under `vocabularyMirrors` | ADR-001. `sk-code-ci` holds 72, 58 and 12 keywords in its three copies, so a strict match would fail on the clean tree, and aligning them is a keyword change. The operator chose this on 2026-11-14 |
| The comparison lives in check 2, not in a new leg | ADR-002. A sixth leg changes the `5/5` total and the leg list that about twenty documents quote, two of them outside the hub |
| The alias rule names the classes the mode routes on | A stricter rule than any class in the file. It holds for all five modes today |
| Section 2 of the packet router keeps the resource list of each intent | All 11 playbook scenarios say section 2 names the same paths in prose. Only the keyword copy was removed |
| `hub-router.json` and the hub `README.md` changed | Both are outside the Files to Change table and inside the hub. The first carries the list the guard reads, the second documents it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `verify-router-sync.cjs` on the clean tree | `PASS check 2`, `router-sync: 5/5 checks passed`, exit 0 |
| Scratch copy with one keyword removed from `code-frontend-aliases` | `FAIL check 2` with 3 problems naming `hub-router.json`, exit 1, saved in `scratch/mutation.txt` |
| Scratch copy with a registry alias no class holds | `FAIL check 2` with 1 problem naming `mode-registry.json`, exit 1 |
| `rg -c 'fires on' sk-code-frontend/ROUTER.md` | nothing printed, exit 1 |
| `node --test verify-router-sync.test.cjs` | 18 pass, 0 fail |
| Probe replay | `13 frontend 1`, `8 negative 0`, `1 review 1` |
| `node --test` on the sk-code-skilled tests, the sk-code-quality tests and `compiled-route-surface-hint.test.cjs` | 55, 154 and 15 pass, 0 fail |
| `run-all-drift-guards.sh` | router-sync 5/5, doc-claims 4/4 and stack-folders PASS. alignment-drift fails on the same 23 files as the baseline |
| `sk-code-setup-check.cjs` | Eight legs PASS and drift-guards FAIL, as in the baseline |
| `compiled-route-guard.cjs --json` and `compiled-route-sync.cjs --check` | Both exit 0 |
| `quality-gate.cjs` | `NO_BLOCKER_FOUND` |
| `validate.sh <phase folder> --strict --quiet` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The CI surface's copies are not compared.** Ledger row `H7` records the 72, 58 and 12 keywords and the fix.
2. **The vocabulary comparison has no leg id of its own.** `--checks 2` runs it with the surface map check.
3. **`spec.md` names the guard at `sk-code-skilled/scripts/`.** The file is at `sk-code-skilled/assets/scripts/verify-router-sync.cjs`, and that is the file that changed.
<!-- /ANCHOR:limitations -->

---

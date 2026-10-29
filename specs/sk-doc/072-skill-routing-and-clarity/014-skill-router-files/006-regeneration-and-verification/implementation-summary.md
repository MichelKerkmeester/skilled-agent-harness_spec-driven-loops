---
title: "Implementation Summary"
description: "This phase has not started. It exists to regenerate every derived artifact in the routing stack from the post-move tree and to prove, with a recaptured scorer baseline and two router replay reports, that the move changed provenance and not routing."
trigger_phrases:
  - "regeneration and verification implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/006-regeneration-and-verification"
    last_updated_at: "2026-10-29T07:52:45Z"
    last_updated_by: "claude-opus"
    recent_action: "Planned the phase and wrote its five docs"
    next_safe_action: "Run phases 002 to 005, then start T001 in this packet"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs"
      - ".skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which tokenizer is authoritative for the final per-skill count"
      - "Whether phase 002 copies ROUTER.md into the Hermes view or rewrites the pointer"
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
| **Spec Folder** | 006-regeneration-and-verification |
| **Completed** | Not started |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is planned and has not started. Every task, checklist box and acceptance row is still open.

### Phase 6: regeneration-and-verification

The phase is the last step of the router file program. Phases 002 to 005 move machine router prose out of `SKILL.md` and into sibling `ROUTER.md` files, and every derived artifact in the repository still records the bytes those moves replace. This phase regenerates them from the post-move tree and proves the routing decisions did not move with them.

The proof has three arms. The scorer baseline is recaptured with `capture-scorer-eval-baseline.mjs` and compared with 155/195, 49/66 and 19/24. The router replay projection is captured with `leaf-route-replay.cjs --report` before and after regeneration and diffed. The per-skill token table is re-measured so the initial skill load shows the router tokens leaving `SKILL.md`. Every derived family also has a read-only check twin, so a stale artifact fails a command rather than drifting quietly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/*/leaf-manifest.json`, `.skilled/skills/*/*/leaf-manifest.json` | Planned modify | 13 leaf manifests regenerated from the post-move leaves |
| `.hermes/skills/*/` | Planned modify | 65 generated skill folders, 54 skills plus 11 agent mirrors |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/*/manifest.json` | Planned modify | 7 runtime activation manifests refreshed through the manifest CLI |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/*/manifest.json` | Planned modify | 7 authored twins, each copied from its runtime manifest |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Planned modify | Compiled skill-graph export rebuilt from the per-skill metadata |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and its three fixtures under `runtime/cli/retrieval/fixtures/` | Planned modify | Index and sidecars rebuilt over the post-move corpus |
| `.skilled/skills/*/graph-metadata.json` | Planned modify on a miss only | Hub vocabulary carried into `intent_signals` |
| `specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/006-regeneration-and-verification/scratch/` | Planned create | Two baseline captures, two replay reports, the regenerated token table and the gate transcript |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The plan runs in three passes: record the before state and both captures while the tree is untouched, run the owner commands for each derived family and regenerate the trigger index last, then rerun every check twin and diff the captures. The planning work itself only read the tree. Every command quoted in `spec.md` was run on the planning tree, including a full recapture of the scorer baseline that reproduced 155/195, 49/66 and 19/24.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Regenerate with the owner command for each family, never by hand | A hand edit passes a diff review and fails the next `--check`, so the artifact would be stale with no command naming it |
| Compare a before and after capture on the same tree | The activation manifests must change their hashes because the compiler hashes authored source bytes, so a hash comparison would fail for the right change. A projection comparison fails only when routing actually moves |
| Regenerate the trigger index after the last document write | The phase documents are corpus documents, so an index built before them is stale the moment the next doc is written |
| Keep the token total provisional and name the encoding | The authoritative tokenizer is UNKNOWN, so the table must say what produced its numbers rather than imply a final count |
| Accept either Hermes carry, a copied router or a rewritten pointer | Phase 002 owns that choice. The phase checks that the pointer resolves, not how it was produced |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ci-leaf-manifest-freshness.cjs` | Not run. Expects `checked=13 fresh=13 failed=0` |
| `sync-skills-hermes.cjs --check` | Not run. Expects `PASS: 65 Hermes skill copies in sync` |
| `compiled-route-guard.cjs --json` | Not run. Expects seven `"ok": true` rows |
| `skill-graph-freshness.cjs --strict` | Not run. Expects `STALE COMPILED: none` |
| `generate-trigger-index.mjs --check` | Not run. Expects `stale documents   : 0` |
| `capture-scorer-eval-baseline.mjs` | Not run. Expects 155/195, 49/66 and 19/24 with unchanged fixture hashes |
| Replay report diff | Not run. Expects no output |
| `validate.sh --strict` on this packet | Not run. Expects `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The tokenizer identity stays unknown.** The regenerated table uses `tiktoken` 0.11.0 `o200k_base`, and the research measured a packed O200K-compatible export, so per-skill token counts can differ by a few units. Compare the totals, not the individual cells.
2. **The phase cannot repair what it verifies.** If phases 002 to 005 leave a reader, a check or a debt-ledger entry unfinished, this phase fails and reports it rather than patching the authored tree, which keeps the failure attributable to the phase that owns it.
3. **A byte diff cannot prove routing.** The compiled-route hashes are designed to move with the authored bytes, so a reviewer reading only the diff sees a large hash change. The routing proof is the replay diff and the scorer capture, and the summary must present them together.
<!-- /ANCHOR:limitations -->

---

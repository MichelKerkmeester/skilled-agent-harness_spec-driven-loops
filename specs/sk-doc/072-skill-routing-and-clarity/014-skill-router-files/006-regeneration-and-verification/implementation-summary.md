---
title: "Implementation Summary"
description: "Evidence record for the regeneration checks, scorer baseline, router replay and token measurements in phase 6."
trigger_phrases:
  - "regeneration and verification implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/006-regeneration-and-verification"
    last_updated_at: "2026-10-29T16:57:00Z"
    last_updated_by: "luna"
    recent_action: "Recorded the regeneration evidence"
    next_safe_action: "Conductor rebuilds the trigger index and validates"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs"
      - ".skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The per-skill count uses tiktoken 0.11.0 o200k_base, the tokenizer the research used"
      - "Phase 002 copies ROUTER.md into each Hermes skill copy and rewrites its relative links"
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
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No tracked derived artifact changed because the owner checks found the checked outputs current. The phase also measured the token table and captured the scorer baseline and router replay before and after regeneration. The trigger index was regenerated last, after the final document write of the packet.

### Phase 6: regeneration-and-verification

The owner checks found the 13 leaf manifests, 65 Hermes copies, seven activation manifests and their authored twins, hub vocabulary and skill graph already fresh. The activation refresh-and-copy loop changed no byte. The graph freshness check printed "STALE COMPILED: none", so the operator-gated reindex did not run. The measured token table has 54 rows under scratch/.

The before and after scorer captures both read 155/195 on the full corpus, 49/66 on the holdout and 19/24 on the ambiguity slice. Their corpusSha256, holdoutSha256 and ambiguitySha256 values match the committed baseline. The replay reports are byte-identical, and both runs print "total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49".

The token measurement uses tiktoken 0.11.0 with o200k_base. Router words including the heading increased from 39,159 to 41,019. Section tokens increased from 89,931 to 92,418. Initial-load tokens increased from 88,689 to 90,823. Across the 54 SKILL.md files, the measured token count fell from 328,333 at 6a9946a800 to 238,406, saving 89,927 tokens or 27.4 percent. That figure includes all SKILL.md edits since the commit.

### Files Changed

| File | Result | Purpose |
|------|--------|---------|
| .skilled/skills/*/leaf-manifest.json, .skilled/skills/*/*/leaf-manifest.json | No change | All 13 manifests already pass freshness checks. |
| .hermes/skills/*/ | No change after the Public commit | The post-commit check passes for all 65 Hermes skill copies. |
| Runtime activation manifests and their authored twins | No change | The seven-hub refresh loop and compiled-route guard found matching bytes. |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | No change | The strict freshness check found no stale compiled graph. The reindex is operator-gated. |
| .skilled/skills/*/graph-metadata.json | No change | Router intent checks found no missing signals. |
| Trigger index and its three sidecars | Regenerated | T012 ran after the final document write of the packet. |
| scratch/token-savings-after.csv | Measured | Holds 54 rows using tiktoken 0.11.0 o200k_base. |
| tasks.md, acceptance-criteria.md, implementation-summary.md | Updated | Record observed evidence and the remaining conductor gates. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The owner checks ran on the post-move tree. The leaf manifests already matched, the Hermes check passed after the preceding Public commit, the activation refresh changed no byte, and the hub signal check found no missing entries. The skill graph freshness check found nothing stale, so T010 did not rebuild it while the canonical reindex remained operator-gated.

The before and after baseline captures hold the same three accuracy readings and fixture hashes. The replay reports match byte for byte. The token table records the 54-skill measurement with its tokenizer and encoding. The conductor will regenerate the trigger index after this document write and run strict validation afterward.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Regenerate with the owner command for each family, never by hand | A hand edit passes a diff review and fails the next `--check`, so the artifact would be stale with no command naming it |
| Compare before and after captures on the same tree | The scorer and replay comparisons show whether accuracy or routing changed across the regeneration pass. |
| Regenerate the trigger index after the last document write | The phase documents are corpus documents, so an index built before them is stale the moment the next doc is written |
| Keep the token measurement reproducible | The table names tiktoken 0.11.0 and o200k_base so the count can be reproduced. |
| Accept either Hermes carry, a copied router or a rewritten pointer | Phase 002 owns that choice. The phase checks that the pointer resolves, not how it was produced |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| ci-leaf-manifest-freshness.cjs | Exit 0, and it prints checked=13 fresh=13 failed=0. |
| sync-skills-hermes.cjs --check | Exit 0, and it prints PASS: 65 Hermes skill copies in sync. |
| compiled-route-guard.cjs --json and compiled-route-sync.cjs --check | Exit 0. It reports seven ok: true rows, all 7 hubs resolve and all 55 served copies match their authored files. |
| generate-router-intent-signals.cjs --check | Exit 0. It prints checked=7 hub(s), missing=0 and RESULT: PASSED. |
| skill-graph-freshness.cjs --strict | Exit 0. It prints STALE COMPILED: none. The reindex did not run because it is operator-gated. |
| capture-scorer-eval-baseline.mjs | Before and after captures read 155/195, 49/66 and 19/24. All three fixture hashes match the committed baseline. |
| Replay report diff | Exit 0 with no output. Both runs print total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49. |
| Advisor runtime ratchet | Test Files 1 passed (1) and Tests 7 passed (7). |
| Route permission gates | router-sync: 5/5 checks passed, all 7 hubs resolve, checked=13 passed=13 failed=0, checked=7 hub(s), drift=0 and RESULT: PASSED. |
| Parent-skill checks and strict packages | All seven hubs report that parent-skill-check passed with 0 warnings. package_skill.py --check --strict prints Result: PASS on 54 of 54 skills. routing-shape-known-debt.json has 0 entries. |
| generate-trigger-index.mjs --check | Prints trigger index matches the corpus and stale documents   : 0 (0 missing from the index). |
| validate.sh --strict on this packet and parent | This folder prints Errors: 0, Warnings: 0 and RESULT: PASSED. The recursive parent run ends with RESULT: PASSED for the parent and all 22 phases. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The skill graph was not rebuilt.** T010 found no stale compiled content because skill-graph-freshness.cjs --strict printed STALE COMPILED: none. The canonical reindex is operator-gated.
<!-- /ANCHOR:limitations -->

---

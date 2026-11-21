---
title: "Implementation Summary"
description: "Skilled main went to origin as 542748515e8 with the fixes of phases 009, 012 and 014 to 017, and Barter is re-pinned onto it with record-base naming the pin in all 74 units."
trigger_phrases:
  - "push and repin open items implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/011-push-and-repin-open-items"
    last_updated_at: "2026-11-21T08:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the operator's push of 542748515e8 and ai-speckit's re-pin onto it"
    next_safe_action: "None: phase 013 picks up the open items"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-011-push-and-repin-open-items"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 011-push-and-repin-open-items |
| **Completed** | 2026-11-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Skilled `origin/main` is `542748515e8d3a391e419b2630b21b270fe2cd20`, and Barter runs on it.

### Phase 11: push-and-repin-open-items

The operator pushed Skilled main with the owner account. The push carries phases 009, 012 and 014 to 017, merged with origin in `c94ac7e9074`, `46bd8eafa10` and `5d53e5bd671`. GitHub reported that the push bypassed the branch rules.

The ai-speckit session moved the pin from `b5a630c6efa` to `542748515e8`. The first stage was refused, the second blocked, and the third staged. The live run `20261121T071540Z-e1a262` printed `RESULT: PASSED`.

- **The refused file.** The generated `cli-external-orchestration` compiled-route manifest was refused. It was restored from `b5a630c` and refreshed after the re-pin.
- **16 rebased overlays.** Each was three-way merged with the Barter delta unchanged, and its `pinnedSha256` moved. 10 merged cleanly. 6 had adjacent-edit conflicts, resolved by keeping Barter's lines beside upstream's: `fanout-run.cjs`, `append-mode-event.cjs`, `review-research-paths.cjs`, `compiled-route-guard.cjs`, `pre-push.test.sh` and cli-opencode `providers-and-models.md`. Where a delta shrank, upstream had adopted Barter's own comment lines. The `pi-settings-default-model` json entry gained `opencode-go/glm-5.3` and `hy4-flash-free`.
- **One retired overlay.** `verify-router-sync.cjs` matched upstream byte for byte, so its entry and the `sk-code-skilled/` overlay folder with its 3 READMEs were removed.
- **record-base.** It exited 0, and 74 of 74 units name `542748515e8`, with `verified:false`.

The work is ai-speckit commits `9284f8eaaa1` (the re-pin) and `ec19959904c` (its record), both local.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `011-push-and-repin-open-items/*.md` | Modified | The pushed id and the re-pin record |
| ai-speckit `skilled/**`, `overlays/**` | Modified | The re-pin onto `542748515e8`, 16 rebased overlays and the retired router-sync overlay |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The Barter gates ran before the stage and again after the live run. One regression showed up and was fixed. The new engine refuses a linked in-tree overlay folder itself, so Barter's resolve-scope test now expects that refusal (10 of 10).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retire the router-sync overlay rather than re-pin it | Source, live file and upstream were byte-identical, so the overlay carried no Barter delta |
| Keep the `local-skilled-alignment` overlay | Barter runs cli-pi lanes only, and Skilled adds lanes and `--critic`, so the difference is deliberate in part |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate in ai-speckit | Before | After |
|--------------------|--------|-------|
| `status --audit` | PASSED, `checked=137` | PASSED, `checked=136` (one entry retired), `docs=0` |
| `pre-commit` | `allow`, exit 0 | `allow`, exit 0 |
| Both `overlays/checks` | PASSED | PASSED |
| Node tests, one file at a time | 186/186 | 186/186 |
| `tests/run-all.sh` | 8 PASS | 8 PASS |
| `pi list` | 9 | 9 |
| Overlay READMEs | not run | 207, 0 missing, 0 blocking |
| `validate.sh --strict` on ai-speckit record 041 | | `RESULT: PASSED`, exit 0 |
| `pin.commit` | `b5a630c6efa` | `542748515e8d3a391e419b2630b21b270fe2cd20` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex hooks are unapproved.** `.codex/hooks.json` in ai-speckit is unchanged.
2. **No `post-commit` hook in Barter.** git-setup-check reports `post-commit: not installed`, and Barter's hooks folder never had it.
3. **One fanout vitest case fails.** `retries a salvage-miss lineage once` fails the same way on pure upstream. Phase 013 takes it.
4. **One upstream line was not carried.** The one-line `.env.example` change stays out of ai-speckit.
5. **Alignment differences are recorded, not reconciled.** Barter's `local-skilled-alignment` lacks Skilled's finding dispositions, `surface-map.yaml` drifts both ways, and two workflow YAMLs were not read.
6. **Nothing in ai-speckit is pushed.** Its two commits are local, and the push is the operator's.
<!-- /ANCHOR:limitations -->

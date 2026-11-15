---
title: "Implementation Summary"
description: "The Vibe guard reference, its index lines and the plugin matrix now describe the hook seams phases 014 to 019 built and ran; the parent and all 22 children validate clean."
trigger_phrases:
  - "vibe hook docs correction implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/021-vibe-hook-docs-correction"
    last_updated_at: "2026-11-14T23:55:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Corrected the hook docs and validated the parent recursively"
    next_safe_action: "None: the phase and the 004 parent validate PASSED"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md"
      - ".vibe/plugins/repo-guards/spec-gate-classify.mjs"
      - ".skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A post_agent deny is a retry message capped at three per turn, so the turn-end composer uses the retry instead of a held turn"
      - "The seven ported plugins each carry a phase 014 to 019 run, and only the automatic session relaunch stays unported"
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
| **Spec Folder** | 021-vibe-hook-docs-correction |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Vibe guard reference now describes the seams phases 014 to 019 built and ran instead of the source reading it carried. Each changed row names its recording: the `post_agent` retry cap, the turn-start advisor and dist checks, the turn-end completion and ask-surface parts, the decision capture and its save-time sweep, the compaction re-injection and history locator, and the command-only relaunch tier. The five `not portable` rows are gone; only the automatic relaunch remains unported, with the reason.

### Phase 21: vibe-hook-docs-correction

- **Hook reference**: section 2's `post_agent` row and `strict` prose now describe the retry (three per turn, then force-accept), section 4's seven plugin rows name the built hook, its event and the proving run, and `What Is Not Portable` lists only the automatic relaunch, the live headless question capture and a held `post_agent` turn.
- **Code comment**: `spec-gate-classify.mjs` now says the hook appends context by choice and that a conforming `pre_agent` deny would block the message.
- **Index lines**: `SKILL.md` and `README.md` no longer call the wire format UNKNOWN, and the short dispatch block chains the home render before the run.
- **Save and catalogs**: the `/speckit:save` runtime list, the Vibe feature-catalog entry and the decision-capture catalog now name the Vibe sweep, hooks and events.
- **Coverage**: the hooks matrix gains a Vibe column and the decision-capture runtime-refusal test pins eight runtimes.
- **Env reference**: `MISTRAL_VIBE_SESSION_ROOT` is documented as the sweep's session-root override.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | Modified | `post_agent` row and strict prose, seven plugin rows, unported prose, evidence base and payload list |
| `.vibe/plugins/repo-guards/spec-gate-classify.mjs` | Modified | The `pre_agent` comment now matches Vibe's deny behavior |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md` | Modified | The guard reference index line and the render-chained dispatch block |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/README.md` | Modified | The guard reference tree line |
| `.skilled/commands/speckit/save.md` | Modified | `vibe` joins the writer's `--runtime` list |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md` | Modified | The Vibe capture, `sweep-vibe.mjs` and its source rows |
| `.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md` | Modified | A hooks-and-guards section, the seventh rule, the captured payloads and a canonical validation type |
| `.skilled/hooks/README.md` | Modified | A `Vibe` column on every coverage-matrix row |
| `.skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs` | Modified | `Vibe` joins `RUNTIMES`; header and length assertions follow it |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | `MISTRAL_VIBE_SESSION_ROOT` in the Vibe run surface and the count line |
| `scratch/targets.md` | Created | T001 anchors: 27 target lines |
| `scratch/citation-map.md` | Created | One row per target with the phase 014 to 019 run that proves it |
| `scratch/after.txt` | Created | The rerun Measured Behavior counts |
| `scratch/parent-validate.txt` | Created | The recursive strict run over the parent and 22 children |
| `graph-metadata.json`, `description.json` (parent) | Refreshed (generated) | The parent's derived pair was stale against its current spec.md; the repository backfill refreshed it before T016 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The citation map came first. Every target was anchored by its text and paired with the run phases 014 to 019 recorded, so no line changed on a source reading alone. The guard reference then took the map row by row: the `post_agent` retry from 014's `deny-always` fixture, the advisor and dist rows from 015's keyed runs, the turn-end rows from 016's fixture suite, the decision capture from 017's mapper tests, the compaction and history rows from 018's forced-compaction run, and the relaunch row from 019's prepare run and resume probe.

Three documentation gaps found during the build were fixed beside their owning tasks: the short dispatch block chains `render-home-hooks.cjs` before `vibe`, the save command's `--runtime` list names `vibe`, and the decision-capture catalog lists `sweep-vibe.mjs`.

T016's first recursive run failed on the parent's generated `graph-metadata.json`, whose description and source fingerprint were stale against the current parent `spec.md`. The repository's `backfill-graph-metadata.js` refreshed only that derived pair; no authored parent document changed. The rerun then passed for the parent and all 22 children.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Every corrected line cites a phase 014 to 019 record | The rows being replaced came from source readings that the runs overturned |
| The automatic relaunch stays the only `not portable` row | The command tier exists, but no Vibe event arms a hop; the row names both the tier and the gap |
| The live question-tool capture is documented as interactive-only | A headless run removes the tool; the save-time sweep is the headless recovery path |
| The parent's derived metadata was refreshed, not its authored docs | T016 requires the recursive validate to pass, and only the generated pair was stale |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -c '^- ' scratch/targets.md` | `27` (floor 12) |
| `rg -c '^\|' scratch/citation-map.md` | `36` (floor 29); no row's evidence is a `site-packages` path alone |
| `rg -n 'retry' .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | Section 2 lines 67 and 76, both citing phase 014 |
| `rg -c 'not portable' .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | `1` (the session-relaunch automatic arm) |
| `rg -n 'Vibe has no such tool' .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | no match (exit 1) |
| `rg -n 'a deny does not' .vibe/plugins/repo-guards/spec-gate-classify.mjs` | no match (exit 1) |
| `node --check .vibe/plugins/repo-guards/spec-gate-classify.mjs` | exit 0 |
| `rg -c 'UNKNOWN wire format' .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md` | no match (exit 1) |
| `rg -c 'UNKNOWN wire format' .skilled/skills/cli-external-orchestration/cli-mistral-vibe/README.md` | no match (exit 1) |
| `rg -c 'VIB-HK-0' ../022-vibe-hook-playbook-and-live-scenarios/tasks.md` | `53` occurrences, 26 distinct ids |
| `rg -c 'post_agent|pre_agent' .skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/` | `2` |
| `validate_document.py` on the Vibe feature-catalog entry | `Total issues: 0` |
| `rg -n 'MISTRAL_VIBE_SESSION_ROOT' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | lines 501 and 505 |
| Decision-capture coverage row | 8 runtime cells |
| `env -i PATH="$PATH" HOME="$HOME" node --test .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs` | `tests 6`, `pass 6`, `fail 0` |
| `scratch/after.txt` rerun | `not portable` = `1`; both `UNKNOWN wire format` counts no match (exit 1) |
| `validate_document.py .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | `Total issues: 0` |
| `env -i PATH="$PATH" HOME="$HOME" node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | `tests 64`, `pass 64`, `fail 0` (the render-chained dispatch block) |
| `rg -n 'dsh, cursor or vibe' .skilled/commands/speckit/save.md` | one line, 23 |
| `rg -c 'sweep-vibe' .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md` | `2`; catalog validator `Total issues: 0` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation --recursive --strict` | `RESULT: PASSED` for all 23 folders (`exit=0`, 0 failed) |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A guarded headless resume is impossible.** Vibe 3.1.2 rejects `--model` on `--resume` (`--model only applies to a new session`), while the repository's `vibe-closed-roster` hard rule refuses a resume dispatch that names no roster alias. The two cannot both be satisfied, so resuming a run stopped by `--max-turns 1` stays UNVERIFIED; phase 019 records the probe in `../019-vibe-relaunch-command-tier/scratch/resume-probe.md`.
2. **Two live behaviors remain operator-only.** The ask-surface TUI retry (phase 016 T017) and the live `ask_user_question` capture (phase 017 T017) need an interactive operator; the reference and the catalog say so instead of claiming a live capture.
3. **The parent's generated pair is volatile.** The recursive run refreshes derived metadata; a later parent edit can stale it again until the orchestrator's closeout save.
<!-- /ANCHOR:limitations -->

---

## Continuity

- **Predecessor**: `020-vibe-dispatch-hardening`
- **Successor**: `022-vibe-hook-playbook-and-live-scenarios`
- **Evidence**: `scratch/targets.md`, `scratch/citation-map.md`, `scratch/after.txt`, `scratch/parent-validate.txt`

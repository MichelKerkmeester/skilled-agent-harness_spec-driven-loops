---
title: "Implementation Summary"
description: "DeepSeek Harness now has a third roster route through Mistral; it composes and passes the dispatch guard, and the keyed proof waits on MISTRAL_API_KEY."
trigger_phrases:
  - "dsh mistral route implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/003-dsh-mistral-route"
    last_updated_at: "2026-11-14T14:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the Mistral route, roster, rules and preflight; keyless run fails only on MISTRAL_API_KEY"
    next_safe_action: "Operator exports MISTRAL_API_KEY, then run T008 and T009"
    blockers:
      - "MISTRAL_API_KEY is not exported for dispatched shells"
    key_files:
      - ".dsh/patches/route-mistral-deepseek.patch.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Which reasoning field does dsh send without a thinking format?"
    answered_questions:
      - "Mistral rejects the thinking field with 422 and accepts reasoning_effort high and max"
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
| **Spec Folder** | 003-dsh-mistral-route |
| **Completed** | Not complete: keyed proof pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can name `.dsh/patches/route-mistral-deepseek.patch.yml` on a dsh dispatch and the dispatch guard lets it through. Until `MISTRAL_API_KEY` is exported, the run stops on the missing key, which is the expected keyless result.

### Phase 3: dsh-mistral-route

The patch follows the other two routes' shape with one difference: it carries no `compat.thinkingFormat: deepseek`, because Mistral rejects a `thinking` field. The roster, both hard-rule messages and the preflight's route set now name three routes, and the docs that said "two-route" say "three-route".

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.dsh/patches/route-mistral-deepseek.patch.yml` | Created | Mistral route patch |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified | `DSH_ROUTE_PATCHES` admits the third patch |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modified | Test for the Mistral route and a doubled route |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json` | Modified | Rule messages name three routes |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md` | Modified | Mistral row and section; §5 names the preflight set |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md`, `README.md`, `references/runtime-folder-and-sync.md` | Modified | Three-route wording and patch tree |
| `.skilled/skills/cli-external-orchestration/SKILL.md`, `README.md`, `feature-catalog/` | Modified | Three-route wording and keyed-run status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The draft composed offline first, and a direct API check settled the reasoning field. After the edits, the committed patch composed with the lineage and guards patches, the dispatch tests went from 52 to 53 passing, and a keyless run passed the guard and failed with `MISSING_CREDENTIAL` naming `MISTRAL_API_KEY`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No DeepSeek thinking format | Mistral answers 422 `extra_forbidden` to a `thinking` field |
| Non-default and absent from the fan-out map | The operator asked for the route, not a new default, and no keyed run has completed |
| Hub `SKILL.md` version left at 2.0.0.0 | The hub version matches `description.json` as a release number |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `--dump-config` with route, lineage and guards patches | PASS: exit 0, empty stderr, `mistral` and `deepseek-v4-1-flash-1017` |
| Dispatch tests | PASS: 53 of 53, baseline 52 |
| Keyless dispatch | Expected failure: exit 1, `MISSING_CREDENTIAL` for `MISTRAL_API_KEY` |
| `validate_document.py` on the edited docs | PASS: 0 issues, except the feature catalog's existing type-fallback warning |
| Keyed dispatch | Not run: key not exported |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No keyed proof yet.** Export `MISTRAL_API_KEY` in `~/.zshenv`, then run T008 and T009.
2. **Playbook not extended.** The manual-testing playbook still covers the two older routes only.
<!-- /ANCHOR:limitations -->

---

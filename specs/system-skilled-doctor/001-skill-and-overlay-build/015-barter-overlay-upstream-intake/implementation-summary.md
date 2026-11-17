---
title: "Implementation Summary"
description: "Backend health checks no longer route to Obsidian, four upstream files now state what their code does, and the re-pin report traced to links the project's first vendoring never held."
trigger_phrases:
  - "barter overlay upstream intake implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake"
    last_updated_at: "2026-11-17T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Landed the item 3 and item 5 fixes and recorded five operator questions"
    next_safe_action: "Operator answers the open questions in spec.md section 7"
    blockers: []
    key_files:
      - ".skilled/skills/mcp-tooling/hub-router.json"
      - ".skilled/skills/mcp-tooling/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "barter-overlay-upstream-intake"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Item 2: which plain-status or re-pin change, if any"
      - "Item 1: rewrite the hub-routing pages or exempt them"
      - "Item 3 bullet 4: which validator exemptions to adopt"
      - "Item 4: which script changes to adopt"
      - "Item 6: hub family values or the template sentence"
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
| **Spec Folder** | 015-barter-overlay-upstream-intake |
| **Completed** | 2026-11-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A prompt such as "check the health of the gaia-services pods" no longer routes to mcp-obsidian, and "inspect the dom" and "capture repl evidence" now reach their modes. Four upstream files that a vendoring project overlaid now say what their code does, so that project can drop those overlays at its next re-pin.

### Phase 15: barter-overlay-upstream-intake

The re-pin report was not a copy defect. The five dist-freshness links were already upstream at the project's base pin `5474fd9695` and did not change through `d97c051`. The project's own vendoring commit `37ad8100c` held the five READMEs but not the links. A re-pin copies only the paths upstream changed between the two pins, as `references/overlays.md` says, so it never saw them. The vibe link survived because upstream added it after the base pin, in `add10613130`, and a re-pin diff carried it in. How the vendoring commit lost the links is UNKNOWN: their targets were present, and that step is the project's own.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/feature-catalog/governance/feature-flag-governance.md` | Modified | Lists the seven `COMPILED_ROUTING_HUBS` entries |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | Modified | Says 9b fails unless `PARENT_HUB_CHECK_STRICT=0` |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json` | Modified | Names `parent-skill-root-router-template.md` |
| `.skilled/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh` | Modified | Falls back to `obsidian_OBSIDIAN_*` |
| `.skilled/skills/mcp-tooling/hub-router.json` | Modified | Drops bare `health`, adds two phrases |
| `.skilled/skills/mcp-tooling/mode-registry.json` | Modified | Drops the `health` alias |
| `.skilled/skills/mcp-tooling/ROUTER.md` | Modified | Mirrors the keyword change in the prose fallback router |
| `.skilled/skills/mcp-tooling/graph-metadata.json` | Modified | Carries "capture repl evidence" into stage one |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-tooling/manifest.json` and its authored copy | Modified | Re-minted to the new policy hash |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each claim was checked against the code or history it named before any edit. The four file fixes landed in `c01cd42523a`, and the routing change with its re-mint landed in `4f52cd121fd`. The prompt replay, the guard, admission, the per-hub check and the compiled-route tests ran on the final routing files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirror the change in `ROUTER.md` | Without it the prose fallback, used whenever compiled serving is off, still sent bare health prompts to Obsidian |
| Keep the bare `aside` keyword the project removed | Without it, "run aside on the pricing page", "open aside and log in" and "aside, fill the form" deferred instead of routing to Aside |
| Make no overlay engine change for item 2 | The engine did what `references/overlays.md` documents, and changing what a re-pin copies or what status reports is the operator's call |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `scratch/repin-check.sh`, a README replaced by a link in the new commit | PASS: `copy 1 paths, delete 1 paths`, `RESULT: PASSED`, link present |
| `scratch/repin-check.sh`, a link upstream left alone and the tree lacks | Reproduces the report: `copy 0 paths`, `RESULT: PASSED`, link still missing |
| Prompt replay, before and after | PASS: only the three bare health prompts (now defer) and the two new phrases (now route) changed |
| `compiled-route-admission.cjs --hub mcp-tooling` | PASS: 16 pass, 0 drift, 0 stale, 0 n/a |
| `compiled-route-guard.cjs` | PASS: all seven hubs fresh |
| `parent-skill-check.cjs .skilled/skills/mcp-tooling` | PASS: all hard invariants passed, 0 warnings |
| `generate-router-intent-signals.cjs --check --hub mcp-tooling` | PASS: missing 0, orphans 0 |
| `node --test .skilled/bin/tests/*.test.cjs` | PASS: 198 tests, 197 pass, 0 fail, 1 skipped |
| `validate_document.py` on the two Markdown files | PASS: 0 issues each |
| `bash -n` and `shellcheck` on `mcp-roundtrip.sh` | PASS: both exit 0 |
| `ci-router-vocabulary-reach.cjs --hub mcp-tooling` | Before the `ROUTER.md` mirror: FAIL with one row, "figma mcp" outranked by sk-code, same as baseline. After it: NOT RUN, every probe returned `probe-error` because the advisor stayed `stale` on a watcher reindex for over three minutes, and `advisor_rebuild` needs `--trusted` |
| Doctor suite | 1234 tests, 1234 pass, 0 fail before and after |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The project's tree can still hold upstream paths that are missing.** A re-pin does not see an unowned path upstream left alone. Run `/doctor:overlay status --audit` after a vendoring step until the operator decides the item 2 question.
<!-- /ANCHOR:limitations -->

---

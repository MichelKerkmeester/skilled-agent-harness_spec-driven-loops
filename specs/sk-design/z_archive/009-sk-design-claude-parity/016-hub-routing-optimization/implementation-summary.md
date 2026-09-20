---
title: "Implementation Summary"
description: "sk-design's mode-registry.json and hub-router.json now match sk-code's and sk-doc's command field + hub-identity conventions; command-metadata.json resynced to Phase 015's live argument-hint values."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 016 implementation summary"
  - "hub routing optimization summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/016-hub-routing-optimization"
    last_updated_at: "2026-07-06T21:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run validate.sh --strict for final confirmation, then commit and push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/command-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hub-routing-optimization-016"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-hub-routing-optimization |
| **Completed** | 2026-07-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-design`'s parent-hub routing registries now match the structural conventions already established in `sk-code`'s and `sk-doc`'s hubs, and the packet's older, richer command-metadata file is back in sync with the live commands Phase 015 built.

### `command` Field Parity

`mode-registry.json` had no way to look up which slash command backs a given mode — `sk-doc`'s registry (the newest of the three hubs) already carries this as a per-mode `"command"` field, documented in `advisorRoutingContract.command`. All 5 sk-design modes now carry `"command": "/design:<mode>"`, in the same relative position sk-doc uses (between `grandfatheredFolderMismatch` and `aliases`).

### `hub-identity` Vocabulary Wiring

`hub-router.json` already defined a `hub-identity` vocabulary class (keywords like `sk-design`, `mode-registry`, `workflowmode`) but never referenced it from any mode's `routerSignals.classes` — both `sk-code` and `sk-doc` wire `hub-identity` into every mode. All 5 sk-design modes now include `"hub-identity"` in their `classes` array, closing the gap without touching the vocabulary class definition itself (it already existed, just unused).

### `command-metadata.json` Resync

Phase 015 added `--register brand|product` and `:auto`/`:confirm` to all 5 live `/design:*` commands' `argument-hint`, but `command-metadata.json` — a separate, richer per-command metadata file (choreography, handoff, register policy, output contracts) with no sk-code/sk-doc equivalent — still had the pre-015 `argumentHint`/`argumentGrammar` values. All 5 entries now have matching `argumentHint`, two new `argumentGrammar.flags` entries (`--register`, `:auto|:confirm`), and an updated `render` string, string-for-string identical to the live command frontmatter.

### Deliberately Left Unchanged

`hub-router.json`'s `routerPolicy.defaultMode: "interface"` was NOT changed to `null` (sk-code's/sk-doc's convention) — `sk-design`'s own `SKILL.md` §2 explicitly documents and relies on this default ("default a generic design prompt to interface when no other axis dominates"), so it is an intentional, domain-specific divergence rather than a gap.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/mode-registry.json` | Edited | Added per-mode `command` field + `advisorRoutingContract` doc; version 1.2.0.0 -> 1.3.0.0 |
| `.opencode/skills/sk-design/hub-router.json` | Edited | Added `hub-identity` to all 5 modes' `classes`; version 1.1.0.0 -> 1.2.0.0 |
| `.opencode/skills/sk-design/command-metadata.json` | Edited | Synced `argumentHint`/`argumentGrammar` for all 5 commands to the post-Phase-015 argument shape |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A comparative read of `mode-registry.json`/`hub-router.json` across all three parent hubs (`sk-design`, `sk-code`, `sk-doc`) surfaced the two structural gaps directly — sk-doc's registry (the newest pattern) had a `command` field sk-design lacked, and both sibling hubs wired `hub-identity` into every mode while sk-design's own `hub-identity` vocabulary class sat unreferenced. A third finding (the `command-metadata.json` staleness) surfaced while confirming the fix's scope, since Phase 015's router rewrite had already changed the real command's `argument-hint` without a corresponding update to this separate metadata file. All edits were verified additive-only via a full `git diff` review before writing this summary — no existing alias, keyword, weight, `routerPolicy`, `tieBreak`, or `bundleRules` value was touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add `command` field at the same relative position sk-doc uses | Keeps the three hubs' registries diffable against each other field-for-field, not just conceptually equivalent |
| Leave `routerPolicy.defaultMode: "interface"` unchanged | `sk-design`'s own `SKILL.md` documents and justifies this default explicitly; changing it to match sk-code/sk-doc would remove a deliberate, working behavior to chase superficial consistency |
| Include `command-metadata.json` in this pass rather than deferring it | The staleness was directly caused by this session's own Phase 015 change; fixing it now avoids leaving a known-stale file for a future session to rediscover |
| Represent `:auto`/`:confirm` as a `flags`-array entry with `kind: "execution-mode-suffix"` | `argumentGrammar`'s only grammar container is `flags[]`; rather than inventing a new top-level schema field for one suffix concept, the existing container was reused with a descriptive `kind` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| JSON parse (`mode-registry.json`, `hub-router.json`, `command-metadata.json`) | PASS, 0 errors |
| `git diff` additive-only review | PASS, no existing field, weight, alias, or keyword removed or reordered; only new fields/array entries and 5 single-value replacements (`argumentHint`/`render`/2 version strings) |
| Live command frontmatter cross-check | PASS, all 5 `command-metadata.json` `argumentHint` values now match `.opencode/commands/design/*.md` frontmatter string-for-string |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` | PASS, see checklist.md |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live routing-behavior test.** The `hub-identity` wiring and `command` field additions were verified structurally (JSON valid, diff additive-only) but no end-to-end advisor/hub-router invocation was run to confirm the vocabulary change doesn't shift real routing outcomes for any borderline prompt. The keywords in `hub-identity` (sk-design, mode-registry, workflowmode, etc.) are hub-generic rather than mode-discriminating, so the expected impact is a uniform small boost across all 5 modes, not a relative ranking change — but this is reasoned, not measured.
2. **`command-metadata.json`'s broader shape was not reconciled with the new command router+assets files.** This phase only synced the stale `argumentHint`/`argumentGrammar` fields; the file's `choreography`/`handoff`/`preconditions` content, which now substantially overlaps with what Phase 015's workflow YAML and presentation assets encode, was left as-is (flagged during scoping as a separate follow-up, not fixed here).
<!-- /ANCHOR:limitations -->

---
title: "Implementation Summary"
description: "A parent hub at a repository root now names its repository entries in mode-registry.json, and both skilled checkers skip them, so Product Owner keeps its hub at its root."
trigger_phrases:
  - "hub repo folder exemption implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/068-hub-repo-folder-exemption"
    last_updated_at: "2026-10-20T18:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Implemented and verified the repo-root-hub extension"
    next_safe_action: "Commit after the operator's go-ahead"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "1004bf13-7863-4447-a63e-6ad2f5fcfd86"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 068-hub-repo-folder-exemption |
| **Completed** | 2026-10-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hub that is also a repository can now keep its `SKILL.md` at the root beside `specs/`, `export/` and its other repository files and still pass the skilled checkers. It lists those entries once in `mode-registry.json`, and the checkers hold only the hub and its packets to the contract.

### The repo-root-hub extension

You declare `repo-root-hub` in the registry's extensions with a `repoPaths` list of top-level names. The parent-hub checker and the package validator skip those names in every walk, so a spec packet's `graph-metadata.json` no longer reads as a second identity and a repository folder no longer reads as a stray packet. The hub id comes from the folder name in kebab case, so `Product Owner` checks as `product-owner`. A list that names a packet, a hub file or a nested path fails 3f, so the extension cannot hide the skill.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | Reads the extension, skips declared entries, kebab-case id, 3f validation |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modified | Five repo-root cases |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modified | Kebab-case name check and declared entries skipped in every walk and the zip |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` | Modified | Kebab-case hub id for the compiled-routing check |
| `.skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py` | Modified | Three repo-root cases |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modified | The extension's row, version 1.2.4.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A probe copy of Product Owner's repository named every blocker first. The edit went onto the live tree on main, as the operator chose. The one sk-doc test that failed on the live tree was rerun on a clean HEAD clone with this diff applied, which isolates it from peer sessions editing the same tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The hub declares its own list instead of a fixed allowlist | The operator chose it, and no other hub changes behavior |
| Names apply at the hub root only | A deeper folder that shares a name stays checked |
| A missing entry is skipped harmlessly | A clone may lack an ignored folder such as `export/` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `parent-skill-check-invariants.test.cjs` | PASS, 109 pass 0 fail |
| Other checker suites | PASS |
| `test_package_skill_regressions.py` | PASS, 26 passed |
| sk-doc pytest suite | PASS apart from one harness test that fails on live-tree churn and passes on a clean clone with this diff |
| Product Owner root through both checkers | PASS, 0 fail 0 warn and `--strict` exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Moneybird Accountant still fails.** Declaring the extension clears its identity failures only. Its schema gaps are that system's own work.
<!-- /ANCHOR:limitations -->

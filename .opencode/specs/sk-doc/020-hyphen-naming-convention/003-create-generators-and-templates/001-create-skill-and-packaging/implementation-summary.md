---
title: "Implementation Summary: create-skill scaffolding and packaging"
description: "Create-skill scaffolds, package validation, templates and tests now enforce kebab-case generated filesystem names while preserving declared interpreter and tool names."
trigger_phrases:
  - "create-skill implementation summary"
  - "skill package naming completion"
  - "kebab-case scaffold results"
  - "generated path validation results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/001-create-skill-and-packaging"
    last_updated_at: "2026-07-20T11:09:35Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified create-skill output naming migration"
    next_safe_action: "No child work remains"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/scripts/init_skill.py"
      - ".opencode/skills/sk-doc/create-skill/scripts/package_skill.py"
      - ".opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py"
      - ".opencode/skills/sk-doc/scripts/tests/test_create_skill_contract.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-07-18-create-skill"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-create-skill-and-packaging |
| **Completed** | 2026-07-18 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

New skill packages now keep authored filesystem output in kebab-case. Parent scaffolds emit `manual-testing-playbook/`, package validation checks every non-exempt relative path and archive output keeps the hyphenated skill root.

### Generated Path Contract

The standalone and parent generators validate the public skill slug before writing. Parent creation now emits `manual-testing-playbook/` alongside exact tool names such as `SKILL.md`, `README.md` and `hub-router.json`.

Package checks retain advisory output for existing debt during ordinary validation. Strict validation and actual packaging block noncanonical generated paths. Python filenames, Python import-package directories, frozen or generated subtrees and tool-owned filenames remain exempt.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `create-skill/scripts/init_skill.py` | Modified | Emit the canonical parent playbook directory and resolve scaffold assets through facade symlinks. |
| `create-skill/scripts/package_skill.py` | Modified | Validate generated package paths and block invalid names before archive creation. |
| `create-skill/scripts/validate_skill_package.py` | Modified | Expose strict generated-path validation in the completion report. |
| `create-skill/assets/` and `create-skill/references/` | Modified | Describe kebab-case resource paths and preserve declared exemptions. |
| `sk-doc/scripts/tests/test_create_skill_contract.py` and `test_package_skill_regressions.py` | Modified | Cover generated trees, invalid paths, archive members and exemptions. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change stayed inside the child scope and used disposable pytest directories for generated trees and archives. Baseline focused coverage rose from `28 passed` to `35 passed`. The expanded create-skill suite passed `39` tests and the leaf-resource Node test passed `1/1`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep ordinary validation debt-tolerant and make packaging strict | Existing repository debt remains readable while newly generated archives cannot add noncanonical paths. |
| Exempt names by interpreter or tool ownership | Python import packages and exact tool filenames are contracts outside the authored slug policy. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Expanded Python regression suite | PASS, `39 passed in 0.31s` |
| Leaf-resource Node contract | PASS, `1/1` |
| OpenCode alignment drift | PASS, `0` findings and `0` warnings |
| Comment hygiene and Python compilation | PASS, zero violations and five files compiled with `PYTHONPYCACHEPREFIX` under `/tmp` |
| Lane C scenario loading | PASS, `sk-doc 32` and `sk-code 30` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

None identified.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/shared/references/hvr_rules.md
-->

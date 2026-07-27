---
title: "Verification Checklist: Retire the aesthetics reference folder and --mode aesthetic lane"
description: "Verification checklist for the single-commit retirement: folder deletion, five-point lane removal, manifest regeneration, and citation cleanup."
trigger_phrases:
  - "aesthetics retirement checklist"
  - "mode aesthetic lane removal checklist"
  - "design-interface aesthetics folder checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/009-aesthetics-retirement"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored verification checklist, no item checked yet"
    next_safe_action: "Verify CHK-001 once citing sites are confirmed"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/aesthetics/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Retire the aesthetics reference folder and --mode aesthetic lane
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All six citing-site groups are located and line-confirmed before any edit
  - **Evidence (planned):** `rg -n "aesthetic" .opencode/skills/sk-design/ .opencode/commands/interface/`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [folder + lane removal]

- [ ] CHK-010 [P0] All 5 `references/aesthetics/*` files are deleted
  - **Evidence (planned):** `find .opencode/skills/sk-design/design-interface/references/aesthetics` (expect "No such file or directory")
- [ ] CHK-011 [P0] `AESTHETICS` intent and `RESOURCE_MAP` entry removed from `SKILL.md`
  - **Evidence (planned):** `rg -n "AESTHETICS" .opencode/skills/sk-design/design-interface/SKILL.md`
- [ ] CHK-012 [P0] `aesthetic` task lane removed from `command-metadata.json`
  - **Evidence (planned):** `rg -n "aesthetic" .opencode/skills/sk-design/command-metadata.json`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [command surface + manifest]

- [ ] CHK-020 [P0] `commands/interface/design.md` lane row and argument-hint no longer mention `aesthetic`
  - **Evidence (planned):** `rg -n "aesthetic" .opencode/commands/interface/design.md`
- [ ] CHK-021 [P1] Both YAML asset mirrors updated
  - **Evidence (planned):** `rg -n "aesthetic" .opencode/commands/interface/assets/interface-design-auto.yaml .opencode/commands/interface/assets/interface-design-confirm.yaml`
- [ ] CHK-022 [P1] `hub-router.json` vocabulary entry removed
  - **Evidence (planned):** `rg -n "aesthetic" .opencode/skills/sk-design/hub-router.json`
- [ ] CHK-023 [P0] `leaf-manifest.json` regenerated with no dangling `aesthetics/` paths
  - **Evidence (planned):** `rg -n "aesthetics/" .opencode/skills/sk-design/leaf-manifest.json`
- [ ] CHK-024 [P0] Command task lanes match `SKILL.md` `INTENT_SIGNALS` exactly (no orphan either direction)
  - **Evidence (planned):** design-command-surface checker output
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [citation cleanup]

- [ ] CHK-030 [P1] `resource-loading-notes.md` no longer cites the retired folder
  - **Evidence (planned):** `rg -n "aesthetics/" .opencode/skills/sk-design/design-interface/references/design-process/resource-loading-notes.md`
- [ ] CHK-031 [P1] `real-ui-loop.md` no longer cites the retired folder
  - **Evidence (planned):** `rg -n "aesthetics/" .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [n/a]

- [ ] CHK-040 [P2] No secrets or credentials touched by this packet
  - **Evidence (planned):** diff review confirms markdown/JSON/YAML content only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same scope
  - **Evidence (planned):** cross-read of all five packet files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [ ] CHK-060 [P0] `rg -n "aesthetic"` across the hub (excluding `changelog/`) returns nothing
  - **Evidence (planned):** command output attached to `implementation-summary.md`
- [ ] CHK-061 [P1] Single commit lands the whole retirement, independently revertable from siblings 008/010
  - **Evidence (planned):** `git log -1 --stat` for the retirement commit
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 5 | 0/5 |
| P2 Items | 1 | 0/1 |

**Verification Date**: TBD (packet authored 2026-07-27; no work started, nothing verified yet)
<!-- /ANCHOR:summary -->

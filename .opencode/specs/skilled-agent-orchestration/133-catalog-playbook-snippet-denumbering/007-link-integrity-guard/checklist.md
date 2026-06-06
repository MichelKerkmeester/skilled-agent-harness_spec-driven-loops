---
title: "Verification Checklist: Markdown-Link Integrity Guard [133/007/checklist]"
description: "Verification Date: 2026-06-06"
trigger_phrases:
  - "007-link-integrity-guard completion"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/007-link-integrity-guard"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete; all checks verified"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Markdown-Link Integrity Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

Run the guard locally and inject a broken link; confirm CI workflow shape; validate the packet. Each item marked `[x]` with evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Confirmed existing checks don't cover markdown links (check-links.sh = wikilinks only)
- [x] CHK-002 [P1] Confirmed CI runner pattern + green-on-current-tree exclusion design
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-003 [P0] Guard uses node stdlib only; no npm deps; read-only
- [x] CHK-004 [P2] Comments carry durable WHY, no ephemeral-artifact pointers
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-005 [P0] Green on current tree — `node check-markdown-links.cjs` → exit 0, 0 broken (2997 files, 6902 links)
- [x] CHK-006 [P0] Catches breakage — injected 2 broken links → exit 1 naming them; reverted; green again
- [x] CHK-007 [P1] Allowlisted placeholder not flagged (green run with templates present)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-008 [P1] Whole-repo scan (not changed-files) so a deleted target breaking an unchanged referrer is caught
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-009 [P2] Read-only filesystem walk; no network; no secrets touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-010 [P2] Guard header documents purpose, conventions, exit codes; allowlist annotated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-011 [P2] Guard beside `check-links.sh`; workflow beside the 3 existing gates; packet under 133/007
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

All checks pass. Guard built, green on current tree, verified to catch injected breakage, CI-wired, and packet validated. No P0/P1 open.
<!-- /ANCHOR:summary -->

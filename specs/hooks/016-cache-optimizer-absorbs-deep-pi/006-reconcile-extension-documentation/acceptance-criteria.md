---
title: "Acceptance Criteria: 006-reconcile-extension-documentation"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/006-reconcile-extension-documentation"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All criteria met against observed evidence"
    next_safe_action: "None; phase closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-006-reconcile-extension-documentation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: 006-reconcile-extension-documentation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-reconcile-extension-documentation
**Level:** 3
**Status:** Complete
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the extension is retired, when live tracked files are swept, then no live document lists it as installed | `git grep -ln` over tracked files excluding `specs/` returns only `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md:46` (a baked run transcript) and `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md:24` (fork provenance) — both historical records | Met | - |
| AC-002 | REQ-002 | Given the README describes cache capabilities, when each claim is traced, then it matches the implementing code | Economics fields verified against `.pi/extensions/pi-cache-optimizer/index.ts:265` (`CacheStats`); verified-edit behavior against the hash-verified edits section of the same file | Met | - |
| AC-003 | REQ-003 | Given the root README has never described Pi extensions, when the phase closes, then the question is answered rather than drifting | Decision recorded in `spec.md:192` §7 marked RESOLVED and mirrored in `spec.md` `_memory.answered_questions` | Met | - |
| AC-004 | REQ-004 | Given ten packages are enabled, when the roster is compared, then it matches entry for entry | `.pi/PLUGINS.md` names all 10 entries of `.pi/settings.json` `packages` | Met | - |
| AC-005 | REQ-005 | Given documents changed, when the validators run, then every changed file passes | `validate_document.py` reports VALID / 0 issues on `.pi/PLUGINS.md` and `.pi/extensions/pi-cache-optimizer/README.md`; `test_readme_verdict_parity.py` reports `diff_entries=0` over 1016 files | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR. |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes. Every row is `Met` against an observation rather than an inference.

Each verification cell names a command that was run and read, not a diff that was eyeballed. Where
a check could not be run in this environment it is recorded in the phase's implementation summary
under known limitations rather than being marked met.
<!-- /ANCHOR:closure -->

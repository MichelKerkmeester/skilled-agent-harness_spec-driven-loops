---
title: "Implementation Summary"
description: "One research finding held and was fixed; one did not and was refused. The refusal is recorded with the evidence, because a dropped claim looks the same as a claim nobody checked."
trigger_phrases:
  - "remediation summary research findings"
  - "compat readme trigger phrase fixed"
  - "gitignore claim refuted"
  - "which findings survived verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/013-research-findings-remediation"
    last_updated_at: "2026-09-12T07:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Confirmed finding fixed, refuted finding recorded, suites and frontmatter gate green"
    next_safe_action: "Nothing outstanding"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/runtime/tests/compat/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01V4wzp8qRJRvyXdqxAYuJTi"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether anything else advertises a deleted suite in machine-read metadata; the instance was fixed, not the class"
    answered_questions:
      - "Does the compat README advertise retired bridge suites? Yes, at the exact cited line"
      - "Does the gitignore claim hold? No, and the surviving patterns serve mcp-code-mode"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-research-findings-remediation |
| **Completed** | 2026-09-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two claims from the third research reading were checkable in seconds, and they came apart in opposite directions. Both outcomes are recorded, because a claim quietly dropped is indistinguishable from a claim nobody checked.

### The one that held

The advisor's compatibility test README advertised "advisor plugin bridge tests" in its `trigger_phrases`. That block is not prose. The retrieval layer indexes it, so the phrase routed a reader toward a suite this packet deleted. The four suites that exist cover the daemon probe, Python parity, redirect metadata and the compatibility shim. The phrase now names two of them, and the document's key-files table, which had listed two of the four files in its own directory tree, lists all four.

This is exactly the class the reading said a sweep cannot catch. A presence check sees names that remain. It cannot see coverage that departed.

### The one that did not

The same reading named a gitignore line ignoring a renamed path with an underscore and called it the next residue candidate. No such spelling exists. The two similar patterns sit at different lines, use a hyphen, and are not dead: `mcp-code-mode` still has a directory they match. Changing them would break a working ignore rule to satisfy a finding that describes a state phase 009 already repaired. The claim was refused.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/tests/compat/README.md` | Modified | Trigger phrase naming a deleted suite replaced; key-files table completed to four rows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each claim was checked against the repository before either was acted on, which is the only reason the second one was caught. The file was read in full before editing, and the edit was confined to the two parts that were wrong. The body's own description of what the suites cover was already accurate and was left alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the trigger phrase rather than delete it | A reader searching for advisor compatibility coverage should still land here; the phrase was wrong, not unwanted |
| Complete the key-files table in the same pass | It documented half its own directory, which is the same defect class as the phrase and sits four lines away |
| Refuse the gitignore change | The patterns serve another skill. Editing them would trade a working rule for a refuted finding |
| Record the refusal in the packet | An unrecorded refusal leaves the next reader to rediscover the same wrong claim |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Compatibility suites | PASS — 4 files, 15 tests |
| Repository frontmatter gate | PASS — 2873 files, 2863 ok, 0 failures |
| Scoped diff | PASS — one file changed, as scoped |
| Gitignore claim, re-checked | REFUTED — no underscore spelling; the two hyphen patterns match `mcp-code-mode` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The instance was fixed, not the class.** Nothing here sweeps the repository for other machine-read metadata advertising deleted suites. The research says such a sweep needs a different shape than a presence check, and designing it is separate work.
2. **The three residue taxonomies remain unreconciled.** Each reading produced its own, and they overlap without agreeing. Merging them into one reference the next transport removal would find is not attempted here.
<!-- /ANCHOR:limitations -->

---

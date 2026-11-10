---
title: "Implementation Summary"
description: "PUBLIC-RELEASE.md, CONTRIBUTING.md and SECURITY.md now describe the repository as it is: the .skilled layout, link or copy adoption, the hook-enforced commit and pull request rules and the current MCP and dispatch facts."
trigger_phrases:
  - "root release docs alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/024-root-release-docs-alignment"
    last_updated_at: "2026-11-09T20:30:00Z"
    last_updated_by: "claude-fable-5-2"
    recent_action: "Corrected the three root documents and recorded the verification evidence"
    next_safe_action: "Review the three-file diff and commit it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-024-root-release-docs-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
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
| **Spec Folder** | 024-root-release-docs-alignment |
| **Completed** | 2026-11-09 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three root documents now match the tree. A reader who follows the release steps gets a commit the hook accepts, a contributor who follows the setup gets a working build and the security policy names the files that actually register hooks and MCP servers.

### Align the root release, contributing and security docs with the current repository

`PUBLIC-RELEASE.md` describes the `.skilled/` authored root, the seven runtime folders and the two ways a project adopts Skilled. Its release steps stage by path, use a `type(scope): summary` subject and publish with `/create:changelog skilled --release`. `CONTRIBUTING.md` gives the two real builds, the test scripts, the 80 and 100 character subject limits, the branch name grammar and the two headings CI requires in a pull request. `SECURITY.md` has sixteen corrections, among them the Pi and DeepSeek Harness MCP files, the OpenCode v2 flag and the count of package trees.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `PUBLIC-RELEASE.md` | Modified | Layout, adoption, release steps, current release and series history |
| `CONTRIBUTING.md` | Modified | Setup, tests, code style, commit, branch and pull request rules |
| `SECURITY.md` | Modified | Counts, flags, path lists and one new safeguard row |
| `../spec.md` | Modified | Phase map row and transition row for this child |
| `../graph-metadata.json` | Modified | Child entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baselines came first. Two read-only agents then fact-checked `CONTRIBUTING.md` and `SECURITY.md`, and each finding that reached a document was re-read at its source file. The validator and the voice scanner ran again after the edits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep "Ecosystem remediation" in the 1.2.3.x series row | It is the name that release shipped under, so the one remaining voice blocker stays |
| Correct `SECURITY.md` in place instead of adding sections | New risk sections change what the project discloses, which is the operator's call |
| Drop "Embedding providers" as a contribution area | The stack has one consumer and four providers, and no document invites more |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py PUBLIC-RELEASE.md` | `VALID`, 1 warning (type fallback). Before: `INVALID`, 1 blocking, 6 warnings |
| `validate_document.py SECURITY.md` | `VALID`, 0 issues |
| `validate_document.py CONTRIBUTING.md` | `INVALID` under the README fallback rules: no overview section. Section order kept as it was |
| `hvr_scan.py` hard blockers | `PUBLIC-RELEASE.md` 9 to 1. `CONTRIBUTING.md` 0 to 0. `SECURITY.md` 0 to 0 |
| `hvr_scan.py` ceiling | 53 to 91, 98 to 98, 97 to 97 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two commands were not executed.** `CONTRIBUTING.md` names `npm --prefix .skilled/skills/system-spec-kit test` and the advisor `test` script. Both scripts exist in their `package.json`, and neither was run.
2. **`SECURITY.md` still leaves surfaces uncovered.** The fact-check listed the session-start dist rebuild, the live-sync push, the classifier injection screen that sends fetched text to an external service, the Pi package defaults, the extra dispatch flags for Cursor, Claude and Codex and the git hook trust model. None was added.
3. **The changelog index is stale.** `.skilled/changelog/skilled/README.md` still calls v4.0.0.4 unreleased.
<!-- /ANCHOR:limitations -->

---

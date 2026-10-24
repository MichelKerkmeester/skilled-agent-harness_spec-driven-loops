---
title: "Implementation Summary"
description: "The OpenCode 2 pin moved from 2.0.32 to 2.1.4, so the setup helper no longer downgrades the installed release and CI checks the version people run."
trigger_phrases:
  - "opencode v2 pin 2.1.4 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/067-opencode-v2-pin-2-1-4"
    last_updated_at: "2026-10-24T08:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Moved the OpenCode 2 pin to 2.1.4 and verified it with the v2 battery"
    next_safe_action: "Watch the OpenCode Dual-Version Battery on the pushed commit"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh"
      - ".github/workflows/opencode-dual-version.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-067-opencode-v2-pin-2-1-4"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 067-opencode-v2-pin-2-1-4 |
| **Completed** | 2026-10-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The OpenCode 2 pin now matches the release that is installed and current. The setup helper installs 2.1.4, CI installs and expects 2.1.4, and every statement of the baseline says 2.1.4.

### Phase 67: opencode-v2-pin-2-1-4

The verified-versions note now says 2.1.4 was verified on 2026-10-24 and that flag and provider observations naming 2.0.32 were read on that release. Those observations stay as written rather than being relabelled with a version nobody re-read them on. The v1 pin stays at the verified 1.19.3, and the reference no longer claims the v1 channel is frozen there, because `latest` is now 1.19.4.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modified | `V2_PKG` is 2.1.4 |
| `.github/workflows/opencode-dual-version.yml` | Modified | Installs and expects 2.1.4 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `README.md`, `references/cli-reference.md`, `references/install-and-versions.md` | Modified | Baseline statements |
| `.github/workflows/README.md`, `.skilled/CROSS-CLI.md` | Modified | Version named in one sentence each |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The v2 battery ran on the installed 2.1.4 before any text changed. The edits were exact replacements that each had to match once.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep 2.0.32 observations as written | They were read on 2.0.32; relabelling them would claim a re-read that did not happen |
| Keep the v1 pin at 1.19.3 | It is the installed and verified v1 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| v2 version battery on 2.1.4 | PASS: family-present, plugin-active 17/17, skill-visible, command-listed 40/40 |
| node:test unit and hook suites | PASS: 129 of 129 (the one other file is a vitest suite) |
| `dispatch-audit.test.mjs` under vitest | PASS: 124 of 124 |
| Workflow YAML parse, shellcheck | PASS |
| CI on the pushed commit | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **2.0.32 observations are not re-read.** The `run --help` flag list and provider list in the references were read on 2.0.32.
<!-- /ANCHOR:limitations -->

---

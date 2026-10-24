---
title: "Implementation Summary"
description: "The OpenCode 1 pin moved from 1.19.3 to 1.19.4, so the setup helper no longer downgrades the installed release and CI checks the version this machine runs."
trigger_phrases:
  - "opencode v1 pin 1.19.4 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/069-opencode-v1-pin-1-19-4"
    last_updated_at: "2026-10-24T10:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Moved the OpenCode 1 pin to 1.19.4 and verified it with the v1 battery"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh"
      - ".github/workflows/opencode-dual-version.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-069-opencode-v1-pin-1-19-4"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 069-opencode-v1-pin-1-19-4 |
| **Completed** | 2026-10-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The OpenCode 1 pin now matches the release that is installed and current. The setup helper installs 1.19.4, CI installs and expects 1.19.4, and every statement of the baseline says 1.19.4.

### Phase 69: opencode-v1-pin-1-19-4

The verified-versions note now says 2.1.4 and 1.19.4 were verified on 2026-10-24, and that observations naming 2.0.32 or 1.19.3 were read on those releases. Those observations stay as written. Both pins are now their package's `latest`, so the reference no longer says the v1 pin trails the channel. The two `cli-reference.md` lines that named the baselines still said 2.0.32 for v2. They name 2.1.4 now, because they sit in the same sentences as the v1 baseline.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modified | `V1_PKG` is 1.19.4 |
| `.github/workflows/opencode-dual-version.yml` | Modified | Installs and expects 1.19.4 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `README.md`, `references/cli-reference.md`, `references/install-and-versions.md` | Modified | Baseline statements |
| `.hermes/skills/cli-opencode/SKILL.md` | Modified | Regenerated mirror |
| `.github/workflows/README.md`, `.skilled/CROSS-CLI.md` | Modified | Version named in one sentence each |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The v1 battery ran on the installed 1.19.4 before any text changed. Each of the 1.19.3 mentions in the edited files was classed as a pin or baseline statement, which moved, or a recorded observation, which stayed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the pin instead of reinstalling 1.19.3 | Operator's choice; 1.19.4 is `latest` and already installed |
| Keep 1.19.3 observations as written | They were read on 1.19.3; relabelling them would claim a re-read that did not happen |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| v1 version battery on 1.19.4 | PASS: family-present, plugin-discovered 17/17, plugin-load 17/17, command-listed 40/40 |
| config-shape, battery and cli-opencode node suites | PASS: 88 of 88 |
| dispatch rule checks | PASS: 42 of 42 |
| Workflow YAML parse, shellcheck, `opencode-setup.sh check` | PASS |
| CI on `db30b0f543` | PASS: OpenCode Dual-Version Battery and 17 of 18 runs green. The Routing Registry Drift Guard fails on sk-code signal drift, which it already did on the parent commit `e3beac65f4` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **1.19.3 observations are not re-read.** The `--share` behaviour, the model listing and the `opencode upgrade --help` text were read on 1.19.3.
<!-- /ANCHOR:limitations -->

---

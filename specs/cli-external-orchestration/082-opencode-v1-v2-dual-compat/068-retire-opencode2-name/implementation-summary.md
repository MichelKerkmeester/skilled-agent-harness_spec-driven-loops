---
title: "Implementation Summary"
description: "Only opencode (OpenCode 2) and opencode1 (OpenCode 1) remain on this machine, the helper retires opencode2, the skill's commands use opencode, and OpenCode 1 can no longer take the opencode name back through its auto-update."
trigger_phrases:
  - "retire opencode2 name implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/068-retire-opencode2-name"
    last_updated_at: "2026-10-24T09:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Retired opencode2 and turned off OpenCode 1 auto-update"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode2-models-form.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-068-retire-opencode2-name"
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
| **Spec Folder** | 068-retire-opencode2-name |
| **Completed** | 2026-10-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have one name per version: `opencode` runs OpenCode 2 and `opencode1` runs OpenCode 1. The skill's documented commands use `opencode`, and dispatch still accepts an `opencode2` that a plain v2 install leaves behind.

### Phase 68: retire-opencode2-name

Removing `opencode2` turned up a live failure. OpenCode 1 had updated itself to 1.19.4, and because the npm global prefix is `~/.local`, the reinstall pointed `~/.local/bin/opencode` back at v1. v1 never wrote into the migrated `opencode.db`. The `opencode1` launcher now sets `OPENCODE_DISABLE_AUTOUPDATE=1`, which both binaries read, and the helper writes the same launcher.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-opencode/scripts/opencode-setup.sh` | Modified | Retires `opencode2`; launcher turns auto-update off |
| `cli-opencode/scripts/tests/opencode-setup-both.test.cjs` | Modified | Covers both retirement paths and the launcher |
| `cli-opencode/scripts/tests/opencode2-models-form.test.cjs` | Modified | Tells the v2 and v1 listing forms apart by flags |
| cli-opencode docs and playbooks, `run-plugin-scenario.sh`, feature catalog, sk-git reference | Modified | v2 commands use `opencode` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The machine came first, then the helper and its test, then a rewrite that matched only `opencode2` followed by a subcommand. The 30 remaining mentions were read one by one: those describing the resolver's code or the package's bin names stay, and the rest were rewritten.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the resolver checking `opencode2` first | It lands on v2 on every layout; checking `opencode` first would pick v1 on the earlier layout |
| Leave OpenCode 1 command lines as `opencode` | Right on a v1-only machine; the skill says to run them as `opencode1` side by side |
| Turn off v1 auto-update in the launcher | The observed takeover came from it, and v1 is pinned anyway |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `opencode --version`, `opencode1 --version`, `command -v opencode2` | PASS: `opencode v2.1.4`, `1.19.4`, not found |
| config-shape, battery and cli-opencode node suites | PASS: 88 of 88 |
| dispatch-audit vitest suite | PASS: 124 of 124 |
| shellcheck on the helper; launcher compared with the machine's | PASS; byte-identical |
| CI on `0bf53bfadc` | PASS: OpenCode Dual-Version Battery and all 19 runs green |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **v1 is at 1.19.4, not the 1.19.3 pin.** Its auto-update ran before it was turned off. The next phase moved the pin to 1.19.4 instead of reinstalling 1.19.3.
<!-- /ANCHOR:limitations -->

---

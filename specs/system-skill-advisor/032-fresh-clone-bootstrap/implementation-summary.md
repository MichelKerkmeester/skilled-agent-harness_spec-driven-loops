---
title: "Implementation Summary"
description: "The skill-advisor launcher now installs the system-spec-kit workspace before building its runtime, so a fresh clone starts the daemon without manual installs."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/032-fresh-clone-bootstrap"
    last_updated_at: "2026-10-01T16:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed launcher bootstrap and verified on a clean clone"
    next_safe_action: "Operator reviews the diff and the issue #27 reply draft"
    blockers: []
    key_files:
      - ".skilled/bin/system-skill-advisor-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-skill-advisor-032-fresh-clone-bootstrap"
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
| **Spec Folder** | 032-fresh-clone-bootstrap |
| **Completed** | 2026-10-01 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fresh clone now starts the skill-advisor MCP server on first launch. Before this fix, the build stopped with TypeScript errors and the server never came up.

### Fix advisor launcher bootstrap on a fresh clone

The advisor runtime's build script compiles `system-spec-kit/shared` and then runs the spec-kit workspace's own `tsc`. The launcher only installed the advisor runtime, so on a clone where nobody had run `npm ci` in `system-spec-kit`, the shared build found no node types and failed. The launcher now installs that workspace first whenever its `tsc` binary is missing. Clones that already have it installed skip the extra step.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modified | `buildIfNeeded` installs the spec-kit workspace when its `tsc` is missing |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Reproduced the failure on a clean clone, applied the fix in the launcher, then ran the patched launcher on a second clean clone until the daemon reported active. Not committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix in the launcher, not the runtime build script | The launcher already owns installs. The build script is also run by developers who already have the workspace installed |
| Key the check on `system-spec-kit/node_modules/.bin/tsc` | That is the exact binary the runtime build calls, so its presence proves the workspace install the build needs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Clean clone before fix | FAIL: `tsc --build` in spec-kit shared, `TS2591 Cannot find name 'process'` |
| Clean clone after fix | PASS: `advisor-server.js` built, `Skill graph daemon active=true` |
| `node --check` on the launcher | PASS |
| Launcher vitest suites (bootstrap, lease, idle-timeout) | PASS: 37/37 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No automated test for the new step.** `buildIfNeeded` throws under vitest by design so tests never run a real `npm ci`. The clean-clone run is the proof.
<!-- /ANCHOR:limitations -->

---



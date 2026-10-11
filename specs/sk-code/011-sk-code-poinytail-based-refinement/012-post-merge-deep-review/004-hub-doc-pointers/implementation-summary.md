---
title: "Implementation Summary"
description: "The sk-code hub docs now tell you which PostToolUse hook really runs, and the stack detection table no longer cites a script that does not exist."
trigger_phrases:
  - "hub doc pointers implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/004-hub-doc-pointers"
    last_updated_at: "2026-10-10T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, verified and closed the phase"
    next_safe_action: "Commit the child"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md"
      - ".skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/check-dist-staleness-hook.md"
      - ".skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md"
      - ".skilled/skills/sk-code/shared/references/stack-detection.md"
      - ".skilled/skills/sk-code/SKILL.md"
      - ".skilled/skills/sk-code/README.md"
      - ".skilled/skills/sk-code/ROUTER.md"
      - ".skilled/skills/sk-code/description.json"
      - ".skilled/skills/sk-code/hub-router.json"
      - ".skilled/skills/sk-code/mode-registry.json"
      - ".skilled/skills/sk-code/changelog/v2.2.8.0.md"
      - ".hermes/skills/sk-code/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-hub-doc-pointers"
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
| **Spec Folder** | 004-hub-doc-pointers |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-code hub docs now tell you which PostToolUse hook really runs, and the stack detection table no longer cites a script that does not exist.

### Phase 4: hub-doc-pointers

TH-001, TH-002 and the playbook root now call `claude-posttooluse.sh` the legacy write-time hook, kept for direct tests and registered in no runtime, and point you at the live `claude-posttooluse.cjs` and its router scenario. The scenarios still run the `.sh` directly, so their steps are unchanged. The stack detection mixed-marker row cites `frontmatter-version.mjs`, a real sk-doc script, in place of a `preview-server.js` that never existed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md` | Modified | Legacy hook wording and live hook pointer |
| `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/check-dist-staleness-hook.md` | Modified | Legacy hook wording and live hook pointer |
| `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` | Modified | Legacy hook wording |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modified | Real file in the mixed-marker row |
| `.skilled/skills/sk-code/SKILL.md` | Modified | Version 2.2.8.0 |
| `.skilled/skills/sk-code/README.md` | Modified | Version 2.2.8.0 |
| `.skilled/skills/sk-code/ROUTER.md` | Modified | Version 2.2.8.0 |
| `.skilled/skills/sk-code/description.json` | Modified | Version 2.2.8.0 |
| `.skilled/skills/sk-code/hub-router.json` | Modified | Version 2.2.8.0 |
| `.skilled/skills/sk-code/mode-registry.json` | Modified | Version 2.2.8.0 |
| `.skilled/skills/sk-code/changelog/v2.2.8.0.md` | Created | Changelog entry |
| `.hermes/skills/sk-code/SKILL.md` | Modified | Regenerated Hermes copy |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each doc change went to DeepSeek V4.1 Flash at max effort through cli-pi on the DevPass route, one file per brief. The orchestrator reread every diff, moved one parenthetical in the playbook root, reran the validators and searches, and wrote the hub bump, changelog and Hermes copy.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the scenarios testing the `.sh` | The script is kept for direct tests, so its scenarios stay valid once they stop calling it live |
| Leave the hypothetical prompts alone | RD-001, CS-003 and DR-003 quote a user asking to change a preview server. They describe imagined work and claim no file exists |
| Use `frontmatter-version.mjs` | It is a real sk-doc script under the same `scripts/` folder, so the row keeps its meaning |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Stale wording search | PASS. No match |
| Dead path search | PASS. No `preview-server` in `stack-detection.md` |
| Validators | PASS. Scenarios and `stack-detection.md` 0 issues, playbook root 1 issue as before |
| Hub carriers | PASS. Six lines read 2.2.8.0 |
| Route guard after commit | PASS. `sk-code fresh` |
| Strict validation | PASS. `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Hypothetical prompts still name `preview-server`.** Three playbook prompts quote an imagined request. They are illustrative and claim no file exists.
<!-- /ANCHOR:limitations -->

---

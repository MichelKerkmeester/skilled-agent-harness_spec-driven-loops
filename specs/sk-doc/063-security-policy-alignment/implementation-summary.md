---
title: "Implementation Summary"
description: "SECURITY.md now passes the sk-doc validator and tells reporters what to send and users what Skilled runs on their machine, with every claim tied to a file in the repository."
trigger_phrases:
  - "security policy summary"
  - "security.md expanded"
  - "security threat model shipped"
  - "security policy validation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/063-security-policy-alignment"
    last_updated_at: "2026-10-02T10:42:03Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Expanded SECURITY.md and validated it against the sk-doc README rule set"
    next_safe_action: "Operator decides the open policy choices in spec.md section 7"
    blockers: []
    key_files:
      - "SECURITY.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "13974574-59f7-48b5-b4cd-aa93ca9ca737"
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
| **Spec Folder** | 063-security-policy-alignment |
| **Completed** | 2026-10-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`SECURITY.md` grew from 35 lines that only named a reporting channel to 177 lines that also say what Skilled does on your machine and how to run it safely. It now passes the sk-doc validator, which it failed before.

### Align SECURITY.md with sk-doc and expand it

If you report a problem, the policy now asks for the commit SHA, the runtime and any setting you changed, and it warns that `sk-` skill names are not API keys. If you run Skilled, it tells you that the shipped Claude Code mode is `bypassPermissions`, that write dispatches run with approval off and that first use runs npm installs with their scripts. It then shows how to turn approval back on, where to keep keys and which switches widen access when you turn them off. A safeguards table lists what the repository already does, from the 100-file push deletion ceiling to SHA-pinned CI actions.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `SECURITY.md` | Modified | README rule set structure and grounded new sections |
| `specs/sk-doc/063-security-policy-alignment/` | Created | This packet |
| `specs/sk-doc/graph-metadata.json` | Modified | Track root lists the new packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each new statement came from a file read in this session: `.claude/settings.json`, `opencode.json`, `.utcp_config.json`, `.gitignore`, the hooks and git hooks READMEs, `fanout-run.cjs`, the advisor launcher, `worktree-naming.sh`, the `hard-rules.json` sidecars and the `.github/` files. The sk-doc validator, DQI extraction and HVR scan ran before and after the edit. The documented `git diff --stat` command ran once against `HEAD~1` to prove its paths parse.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use the README rule set as the standard | No sk-doc template targets a root policy file, and `validate_document.py` already applies the README rules to `SECURITY.md` |
| Keep the numbered emoji H2 headings | The README rule set allows them and the root `README.md` uses them |
| Keep sections 2 to 5 word for word apart from the first reporter bullet | They hold the operator's policy choices, and changing them would invent a commitment |
| Describe permissive defaults without changing them | The defaults belong to the runtime configs, which are outside this packet |
| Commit the track root with the packet | `create.sh` wrote it, and the pre-push track-root gate blocks a commit whose track root does not list its packets |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py SECURITY.md` | PASS: `VALID`, exit 0. One warning that README rules were applied by fallback. Baseline was exit 1 |
| `extract_structure.py SECURITY.md` | DQI 99, band excellent. Baseline was 86 |
| `hvr_scan.py SECURITY.md` | 0 hard blockers, mechanical ceiling 98/100. Baseline ceiling was 99 on a far shorter file |
| Em dash and semicolon search | None found |
| `git diff b0f89ee5f0 -- SECURITY.md` | Removed lines are the four renumbered headings and the first reporter bullet only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Name check fails.** `check_authored_name_kebab.py SECURITY.md` reports FAIL because GitHub's required file name is uppercase and the exemption list does not include it. `CONTRIBUTING.md` fails the same way. Adding both to the tool-mandated exemptions is a separate change.
2. **Reporting channel unverified.** Whether GitHub private vulnerability reporting is switched on shows only in the repository settings, so the operator has to confirm it.
3. **Facts can drift.** The threat model quotes current defaults, such as the Claude permission mode and the unpinned MCP entries. A change to those files makes the matching sentence stale.
<!-- /ANCHOR:limitations -->

---

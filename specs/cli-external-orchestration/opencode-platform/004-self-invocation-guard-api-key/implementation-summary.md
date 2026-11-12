---
title: "Implementation Summary: Self-invocation guard ignores OPENCODE_API_KEY"
description: "The cli-opencode self-invocation guard no longer refuses a dispatch because the OpenCode Go provider key is exported. Layer 1 skips that one variable and still trips on every other OPENCODE_ variable."
trigger_phrases:
  - "self invocation guard api key implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/004-self-invocation-guard-api-key"
    last_updated_at: "2026-11-12T15:11:57Z"
    last_updated_by: "generate-context"
    recent_action: "Committed the guard exemption on the worktree branch"
    next_safe_action: "Await the operator's decision on merging worktree 351"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/references/self-invocation-guard.md"
    session_dedup:
      fingerprint: "sha256:08c832b61af2fa1364dfde5b8fb8c3f47a5d07c6011c8b5419f27f94244228de"
      session_id: "scaffold-004-self-invocation-guard-api-key"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "6f6d0815-5182-4dab-96b0-b36b0b73deea"
      workspace: "/Users/michelkerkmeester/worktrees/public/351-session-relaunch-review-remediation"
      savedAt: "2026-11-12T15:11:57Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 004-self-invocation-guard-api-key |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A dispatch to OpenCode from Claude Code is no longer refused because `OPENCODE_API_KEY` is exported. Layer 1 of the self-invocation guard skips that one variable and still refuses on every other `OPENCODE_` variable. Before this change the guard printed its error in a shell that held nothing but the key.

### Self-invocation guard ignores OPENCODE_API_KEY

The guard exists so that an AI running inside OpenCode does not start OpenCode again. Layer 1 looked for any environment variable that starts with `OPENCODE_`, on the assumption that only an OpenCode session sets one. `OPENCODE_API_KEY` breaks that assumption. It is the OpenCode Go provider key, the DeepSeek harness reads it, and you export it in your shell profile, so every runtime you start carries it.

You no longer have to override the guard to dispatch from another runtime. The guard is a contract the calling AI reads and runs, so the change is in the documents: the shell line, the Python reference and every sentence that restates the rule. Layers 2 and 3, the process ancestry and the state lock, are untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modified | The guard line drops the key before the lookup, and the rule sentence names the exemption |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/self-invocation-guard.md` | Modified | The shell check and the Python reference skip the key and say why |
| `.skilled/skills/cli-external-orchestration/cli-opencode/ROUTER.md` | Modified | The Layer 1 bullet names the exemption |
| `.skilled/skills/cli-external-orchestration/cli-opencode/README.md` | Modified | Both descriptions of Layer 1 name the exemption |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md` | Modified | Both descriptions of Layer 1 name the exemption |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | Modified | The precondition command and two precondition sentences |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md` | Modified | The precondition and the CO-001 command |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/from-claude-code.md` | Modified | The precondition and the CO-006 command |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/self-invocation-refusal.md` | Modified | The CO-008 command, plus a step that proves the key alone does not trip |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/self-invocation-guard-nested.md` | Modified | The CO-031 command |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md` | Modified | The comparison row that describes the OpenCode guard |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The old line was run first under `env -i` with only the key set, and it printed its error, which `scratch/before.txt` records. The eleven documents were then edited by exact-match replacement, each replacement asserted to match once. The new line ran in six environments and the Python rule in the same six, recorded in `scratch/after.txt`. A sweep of the skill hub found no statement of the guard without the exemption, and the document validator passed each edited file. The two playbook table commands were also run as written. The change is one commit on branch `worktrees/351-session-relaunch-review-remediation`, based on `5dafa313e8`. It is not merged and not pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exempt one named variable and keep the prefix rule | A list of known session markers would miss a marker a later OpenCode version adds. One named exemption keeps the guard strict by default |
| Match the whole name with the equals sign | `OPENCODE_API_KEY_FILE` or any other variable that starts with the key's name still trips, which the probe confirms |
| Leave `OPENCODE_BIN` alone | It is a second variable with its own reason, and the operator asked for the key. It is named below as a limitation |
| No skill version raise or changelog entry in this packet | Earlier fixes to this skill landed without one, and a later `docs(changelog)` commit recorded them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Old line, key only, under `env -i` | Printed `ERROR: Already inside OpenCode session`, in `scratch/before.txt` |
| New line, key only | `clear` |
| New line, key plus `OPENCODE_CONFIG_DIR` | `TRIPPED` |
| New line, `OPENCODE_CONFIG_DIR` only | `TRIPPED` |
| New line, no `OPENCODE_` variable | `clear` |
| New line, `OPENCODE_API_KEY_FILE` only | `TRIPPED` |
| New line, `OPENCODE_BIN` only | `TRIPPED` |
| Python rule, the same six environments | The same six answers, in `scratch/after.txt` |
| Sweep for a guard statement without the exemption | No line, `rg` exit 1 |
| `validate_document.py` on the eleven edited files | `VALID` for each. The playbook root keeps one `document_type_fallback` warning that is not about this change |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`OPENCODE_BIN` still trips Layer 1.** `SKILL.md` documents it as the override for the binary path, and an operator who exports it meets the same false refusal. Unset it for the dispatch, or extend the exemption in a follow-up.
2. **Nothing enforces the guard.** It is a contract the calling AI reads. A caller working from a cached or older copy of the skill keeps the old rule until it reloads.
3. **No live refusal was run inside OpenCode.** The proof is the documented line under `env -i`. Scenario CO-008 in the playbook is the live check, and it was not executed in this packet.
<!-- /ANCHOR:limitations -->

---


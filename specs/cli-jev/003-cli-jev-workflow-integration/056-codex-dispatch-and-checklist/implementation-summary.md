---
title: "Implementation Summary"
description: "Codex 0.160 renamed its shell tool to Bash and five repo Codex hooks stopped firing; they fire again under either name. Codex task dispatch is now n/a on probe evidence, and the JavaScript checklist asks for the header its style guide asks for."
trigger_phrases:
  - "codex dispatch and checklist implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/056-codex-dispatch-and-checklist"
    last_updated_at: "2026-10-05T15:41:55Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped the Codex Bash fix, the task-dispatch verdict and the checklist header rule"
    next_safe_action: "Operator approves the changed Codex hook entries with /hooks in an interactive Codex session"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-056-codex-dispatch-and-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 056-codex-dispatch-and-checklist |
| **Completed** | 2026-10-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Codex 0.160 renamed its shell tool from `exec` to `Bash`, and a matcher of `exec` stopped matching. Five repo hooks had gone quiet under Codex without any error: dispatch lint, dispatch audit, git preflight, the git message gate and spec-gate enforce on shell calls. They now fire under either name. The same probe settled the open Codex task-dispatch question, and the JavaScript checklist now asks for the header its style guide asks for.

### Codex shell hooks

The registry's Codex shell matchers now read `exec|Bash`, or `exec|Bash|apply_patch|edit` for spec-gate enforce, and `.codex/hooks.json` is regenerated from them. The dispatch lint, dispatch audit and spec-gate adapters each accept both names. The audit also reads the PostToolUse output as one string, the shape 0.160 sends, and still reads the older `{stdout, stderr}` object. The sk-git shell hooks already accepted `bash`, so only their comments changed.

### Codex task dispatch

A probe hook captured the spawn reaching PreToolUse as `collaborationspawn_agent` with `task_name`, `fork_turns` and a `message` encrypted as `gAAAAA...`. The guard's mode check needs that prompt, and its loop check would read every loop-executor spawn as one no command drove, so an adapter could only stay silent or warn falsely. Codex task dispatch is `n/a` in the matrix, the rationale and the task-dispatch README.

### Checklist header rule

The JavaScript checklist demanded a `╔═╗` box that the style guide forbids in new files, and said no shipped file used the COMPONENT/PURPOSE header that 12 OpenCode plugins carry. It now shows the style guide's `// MODULE:` divider and says older headers stay until a file is rewritten. The universal checklist names the same header.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/codex/dispatch-{preflight-lint,audit-posttooluse}.mjs` | Modified | Accept `Bash` and the string response |
| `.skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs` | Created | Both names and both response shapes |
| `runtime/hooks/codex/spec-gate-enforce.mjs` and `spec-gate-codex.test.mjs` | Modified | Map `Bash` to the shell tool, new test |
| `sk-git/scripts/hooks/git-{preflight-advisory,message-gate}.mjs` | Modified | Comments name the new tool |
| `hook-registry.json`, `.codex/hooks.json` | Modified and regenerated | Codex shell matchers |
| Hook README, coverage rationale, task-dispatch README, cli-codex hook contract | Modified | Verdict, rename and hook trust |
| `.codex/SYNC.md`, dispatch README, cli-codex CX-029 playbook | Modified | Name the widened matcher |
| `sk-code-opencode/assets/checklists/{javascript,universal}-checklist.md` | Modified | Header rule |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran codex-cli 0.160 with a throwaway `CODEX_HOME` holding a symlinked `auth.json`, a minimal config and a probe hook that wrote each payload to a file, and passed `--dangerously-bypass-hook-trust` so the operator's own approvals and hooks were never touched. Side-by-side `exec` and `Bash` matchers proved which one fires. The adapters, matchers, tests and docs followed from the captured payloads, and every suite and the alignment verifier were rerun.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record Codex task dispatch as `n/a` rather than build an adapter | The spawn message is encrypted, so the guard could only stay silent or warn falsely |
| Keep `exec` beside `Bash` in every matcher and adapter | Older Codex builds still send `exec` and the `{stdout, stderr}` object |
| Probe with a throwaway `CODEX_HOME` | The operator's `~/.codex` config holds their hook approvals and stays out of scope |
| Let existing COMPONENT/PURPOSE and box headers stand | The style guide keeps them until a file is next rewritten, and a mass rewrite is outside this phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec-gate Codex tests (`node --test spec-gate-codex.test.mjs`) | PASS, 15 (was 14) |
| Codex dispatch adapter test with the audit lib (vitest) | PASS, 80, of which 5 are new |
| Dispatch rule checks and sk-git hook tests | PASS, 20, and 65 plus Pi 3 |
| The phase 55 suite run (`suites5.sh`) | PASS, every suite at its phase 55 count |
| Registration, mirror and Hermes syncs, `--check` | PASS |
| `verify_alignment_drift.py` on the four changed code folders | PASS, 0 findings |
| `validate_document.py` on every changed doc | 0 issues |
| Live Codex 0.160 probe | `exec` matcher silent for `Bash`; spawn `message` encrypted |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Changed Codex hook entries need the operator's approval.** Codex records each approval as a `trusted_hash` in `~/.codex/config.toml` and skips an entry with no approval. A changed matcher likely needs approving again, which the probe did not test. Open `/hooks` in an interactive Codex session and approve every entry it lists as needing review. The git message gate entry had no approval even before this phase.
2. **Open sessions keep their old hook sets until restarted.**
<!-- /ANCHOR:limitations -->

---



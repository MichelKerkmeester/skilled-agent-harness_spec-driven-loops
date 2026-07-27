---
title: "Implementation Summary: Devin agents/skills/rules parity"
description: "Built and live-verified a native Devin code-reviewer AGENT.md profile, corrected a stale docs claim about Claude-agent auto-import, and documented devin skills list/devin rules list/commands non-applicability."
trigger_phrases:
  - "devin agents skills rules parity summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/015-devin-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T11:15:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented (GPT-5.6-LUNA); live probes completed by Claude."
    next_safe_action: "None; phase complete."
    blockers: []
    key_files: [".devin/agents/code-reviewer/AGENT.md", "cli-devin/SKILL.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["The native AGENT.md schema is documented at https://docs.devin.ai/cli/subagents.", "The code-reviewer profile resolves and dispatches live, producing a real review with a valid P1 finding."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-devin-agents-skills-rules-parity |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`.devin/agents/code-reviewer/AGENT.md`: a real, native Devin subagent profile using the live-confirmed frontmatter schema (`name`, `description`, `allowed-tools: [read, grep, glob, exec]`, `permissions.deny: [write, edit]`) plus a system-prompt body instructing it to review code for correctness, security, and repo-convention consistency, citing file/line and rating severity P0/P1/P2.

`cli-devin/SKILL.md` gained a new section documenting: live `devin skills list` output (repo-local packets discovered), live `devin rules list` output (`CLAUDE.md`/`AGENTS.md` surfaced), the new `code-reviewer` profile and how to invoke it, a correction to Devin's own docs (the claimed `.claude/agents/*.md` auto-import does not work in the installed 3000.2.17), and an explicit note that Devin has no command-file-system concept.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.devin/agents/code-reviewer/AGENT.md` | Created | First real native Devin subagent profile in this repo. |
| `cli-external-orchestration/cli-devin/SKILL.md` | Modified | Documents skills/rules discovery, the new profile, the auto-import correction, and the commands non-applicability decision. |
| `tasks.md`, `checklist.md` | Modified | Evidence for every P0/P1 item, including the completed live-dispatch probe. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Live-docs verification was done first: `docs.devin.ai/llms.txt` was used to locate the correct page (`docs.devin.ai/cli/subagents`, not the guessed `.../extensibility/subagents` path), which was then fetched and cross-checked against this repo's existing `cli-devin/references/agent-delegation.md` documentation -- no drift found. Before building, a live probe (`devin -p "List every subagent profile..."`) established a baseline and surfaced an important correction: despite Devin's docs claiming `.claude/agents/*.md` files are auto-imported, the installed 3000.2.17 build does not actually treat them as `run_subagent` profiles.

The profile was then dispatched to build via GPT-5.6-LUNA (xhigh, cli-codex). The agent correctly used the supplied live citation rather than assuming a format, built the profile and documentation, and captured real `devin skills list`/`devin rules list` output. Its own live `run_subagent` dispatch probe failed inside its sandbox with `No ModelInfo available for model 'glm-5-2'` after service DNS failures -- the sandbox's restricted network could not reach Devin's model service. The same two probes were re-run directly (outside that sandbox) and both succeeded: the profile lists as available, and an actual dispatch through it produced a real code review.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build `code-reviewer` as a read-mostly profile (`allowed-tools` limited, `write`/`edit` denied) | Matches the phase's proof-of-build intent without granting a new mutation surface. |
| Correct the Claude-agent auto-import claim rather than rely on it | A live probe proved it false for the installed version; documenting a working-but-wrong assumption would mislead future work. |
| Record commands as a non-concept rather than a gap | `devin --help` lists no `commands` subcommand and a direct probe returns an unexpected-argument error -- there is nothing to build. |
| Re-run the two live probes outside the dispatched agent's sandbox rather than accept "blocked" | The failure was network-restriction-specific to that sandbox, not a property of the profile or the CLI; re-running directly gave a real, non-speculative pass/fail. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live AGENT.md format citation | PASS: `docs.devin.ai/cli/subagents`, fetched and cross-checked against this repo's existing documentation before the profile was written. |
| `devin skills list` | PASS: executed live on Devin 3000.2.17; output captured verbatim in `SKILL.md`. |
| `devin rules list` | PASS: executed live on Devin 3000.2.17; output captured verbatim in `SKILL.md`. |
| Profile-resolution probe | PASS: `devin -p "List every subagent profile..."` lists `code-reviewer` alongside `subagent_explore`/`subagent_general`. |
| `run_subagent` dispatch probe | PASS: `devin -p "Use the code-reviewer subagent to review ..." --permission-mode auto` dispatched, ran, and returned a real review (verdict APPROVED, one valid P1 finding on a missing type guard, two P2 notes). |
| Commands non-applicability | PASS: `devin --help` roster has no `commands` entry; `devin commands` returns `error: unexpected argument 'commands' found`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The dispatched build agent's own sandbox could not reach Devin's model service over the network, so its live-dispatch probe attempt failed for an environment reason unrelated to the profile itself; this was independently re-verified outside that sandbox.
2. Only one profile (`code-reviewer`) was built, per the phase's explicit "one real profile is the proof-of-build" scope -- broader profile coverage is a follow-up if wanted.
3. `devin skills list`'s live output in this checkout showed 12 concrete `./.opencode/skills/*` paths plus an external `devin-cli` packet and an empty-path `declarative-repo-setup` entry, rather than a clean 13th local path; the actual output is preserved in `SKILL.md` rather than inventing a filesystem path for a notional 13th packet.
<!-- /ANCHOR:limitations -->

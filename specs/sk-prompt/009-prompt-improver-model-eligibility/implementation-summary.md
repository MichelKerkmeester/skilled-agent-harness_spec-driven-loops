---
title: "Implementation Summary"
description: "The prompt-improve surface now carries a route-scoped model-eligibility contract, in the canonical agent definition and in the skill a caller can run without the agent."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/009-prompt-improver-model-eligibility"
    last_updated_at: "2026-09-11T18:55:00Z"
    last_updated_by: "implementation-session"
    recent_action: "Wired the eligibility contract and proved its reach"
    next_safe_action: "Operator review of the working-tree diff; nothing is committed"
    blockers: []
    key_files:
      - ".opencode/agents/prompt-improver.md"
      - ".claude/agents/prompt-improver.md"
      - ".opencode/skills/sk-prompt/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-009-prompt-improver-model-eligibility"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Default-deny for models named in no clause: keep, or open the list?"
    answered_questions:
      - "Does the restriction belong in sk-prompt as well as the agent? Yes, they serve different readers."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-prompt-improver-model-eligibility |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Before this change, any model that happened to be running became the prompt-improve
agent, and the operator's view about which models are fit for that work lived only in
their head. It is now a written contract in two places, and a fresh runtime dispatch
quotes it back.

### Restrict which models may act as the prompt-improve agent

Eligibility is keyed on the (model, route) pair, not on the model alone. Opus and Fable
are denied on every route. Sonnet is allowed natively and through `cli-claude-code`, GPT
Luna is allowed through `cli-codex`, and any non-Luna model is allowed through `cli-pi`
or `cli-opencode`. Luna is therefore eligible on one route and denied on two, which is
deliberate, and the text says so in place so a later reader does not flatten it.

The denied list outranks the allowance list. Without that sentence the "any model except
Luna" row would admit Opus through `cli-opencode`, which is the opposite of what the
operator asked for.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/agents/prompt-improver.md` | Modified | Canonical home: `## 0.1 MODEL ELIGIBILITY (HARD BLOCK)` |
| `.claude/agents/prompt-improver.md` | Modified | Hand-kept mirror; the same section, byte-identical |
| `.pi/agents/prompt-improver.md` | Regenerated | `sync-agents-pi.cjs` |
| `.codex/agents/prompt-improver.toml` | Regenerated | `codex/sync-agents.cjs` |
| `.opencode/skills/sk-prompt/SKILL.md` | Modified | `### Model Eligibility` for the caller who picks the model |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The contract was authored by DeepSeek V4.1 Flash at `--thinking max` through `cli-pi` on
the LLM Gateway, briefed with the operator's exact words, the two anchor positions and a
write authority of three named paths. It was then reviewed adversarially by GLM 5.3 Flash
at `--thinking max` on the same route, read-only, against ten checks written to look for
the failure rather than confirm the success.

Reach was proved from outside this session. A fresh `opencode run` process, which builds
its agent registry from `.opencode/agents/` at start, was asked to dispatch the
`prompt-improver` subagent and report what it found. It quoted the new heading and the
denied rows verbatim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Eligibility is a property of the (model, route) pair | It is the only reading under which both operator clauses hold at once. Luna eligible through `cli-codex` and denied through `cli-pi` is a contradiction only if eligibility belongs to the model |
| The denied list outranks the allowance list | "Under no circumstances" has to beat a route clause, or Opus walks in through `cli-opencode` |
| The allowance list is closed | A restriction whose allowance list is open restricts nothing. Recorded as an open question because the operator did not say it in so many words |
| The contract lives in two files, not one | The agent body answers "may I run", the skill answers "whom may I dispatch". A pointer cannot serve the first: a CLI child gets the persona inlined and resolves no paths |
| No machine gate was added | No runtime here exposes the acting model's identity to a script at dispatch time. A validator would read nothing and certify nothing |
| The `/prompt:improve` command was left alone | It selects a dispatch mode, never a model, so it inherits the contract through whichever surface it routes to |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control, before the change | PASS — the live agent surface reported "NO MODEL-ELIGIBILITY RULE PRESENT" |
| Reach of the agent path, fresh `opencode run` | PASS — quoted `## 0.1 MODEL ELIGIBILITY (HARD BLOCK)`, all three denied rows, and after the fix the corrected refusal sentence, then adjudicated its own pair correctly |
| Reach of the skill path, same process | PASS — loading `sk-prompt` alone returned the heading and the precedence sentence |
| `check-agent-mirror-sync.cjs --all` | PASS — 12 agents checked, all mirrors in sync |
| `sync-runtime-mirrors.cjs --check` | PASS — 168 mirrors across 8 trees |
| `codex/sync-agents.cjs --check` | PASS — 12 agents |
| `codex/sync-prompts.cjs --check` | PASS — 34 prompts |
| `sync-hook-registrations.cjs --check` | PASS — 4 registration files, 28-hook registry |
| `agent-roster-mirror-check.cjs` | PASS — every runtime covers the roster |
| `command-catalog-mirror-check.cjs` | PASS |
| `check-comment-hygiene.sh` on all five edited files | PASS — no ephemeral markers |
| GLM 5.3 Flash adversarial review, 9 checks | PASS with one defect, fixed and re-verified |
| `validate.sh --strict` | PASS — Errors 0 |

### The defect the review found

The refusal sentence told an ineligible model to "name an eligible route in its place",
while the opening line of the same section defines eligibility as a property of the
(model, route) pair. For Opus and Fable, denied on every route, no route substitution
exists, so the instruction was unanswerable exactly where it matters most. The reviewer
supplied the replacement wording verbatim and it was applied to all three hand-edited
files, then regenerated into the Pi and Codex copies.

The review also recorded three residual risks it did not classify as defects: the table
writes "GPT Luna" in one row and "Luna" in three others, "native Claude" is a route label
the block never defines, and a reader who unions all matching table rows rather than
taking the first match sees both Yes and No for Opus through `cli-opencode` and has to
read the precedence sentence below the table to settle it. All three fail closed.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The contract is self-enforced.** It binds by being read, by the model acting as the agent and by the caller choosing one. Nothing rejects an ineligible dispatch mechanically, because no runtime here exposes model identity to a script at dispatch time.
2. **Claude Code caches its agent registry for the life of a session.** A probe inside the editing session returned the pre-change answer with an unchanged system-prompt token count. A new session picks the change up; the running one does not.
3. **The same text lives in two files and can drift.** The agent definition is named canonical and the skill says so, which is a convention, not a gate. The existing prompt-knowledge card-sync guard does not watch agent files.
4. **`.pi/agents/` has no consumer.** The Pi mirror is kept in sync because the commit gate requires it; `cli-pi/references/agent-delegation.md` records that nothing reads it and that its generator is dead code.
<!-- /ANCHOR:limitations -->

---

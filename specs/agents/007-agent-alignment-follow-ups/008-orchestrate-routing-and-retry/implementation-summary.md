---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "orchestrate routing and retry implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/008-orchestrate-routing-and-retry"
    last_updated_at: "2026-11-14T23:24:15Z"
    last_updated_by: "generate-context"
    recent_action: "Phase 8 built and verified; all acceptance rows Met"
    next_safe_action: "Commit phase 8 by named paths, merge origin/main, push HEAD:main, then start phase 009"
    packet_purpose: "Purpose: Every dispatch rule in `orchestrate.md` names a route the target accepts, a count a command can check and one owner, in a file of 600 lines or less."
    blockers: []
    key_files:
      - ".skilled/agents/orchestrate.md"
      - ".skilled/agents/agent-registry.json"
    session_dedup:
      fingerprint: "sha256:15e8dafea6a68584b7f30affab340e24ef8c26ee76ab0f683129454390745ff5"
      session_id: "scaffold-008-orchestrate-routing-and-retry"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "075da437-2fb4-4675-aa1c-d25425465570"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-14T23:07:02Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-orchestrate-routing-and-retry |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The orchestrator now sends a `/deep:*` request to its command, retries by one ladder, names one spec-doc writer and gates only on what it can measure. Its definition dropped from 910 to 599 lines, because the decomposition aids and the budget tables moved to a new `system-spec-kit` reference.

### Phase 8: orchestrate-routing-and-retry

- **Routing.** The `deep-research` routing row names `/deep:research`, and the depth rule says to run the command and never dispatch a deep-loop leaf directly. The `Deep Route:` line lost `execution`, which the mode registry does not hold, and kept `mode` and `target_agent`, which the dispatch guard parses.
- **Retry Ladder.** A `FAIL` gets two re-dispatches with the failure named. A `BLOCKED` gets one re-dispatch when the orchestrator can supply the missing input, and otherwise escalates. The ladder cites `code.md` §8 for the three-`BLOCKED` breaker. Seven failure passages now point to it.
- **One spec-doc writer.** Rule 2b no longer routes spec-doc creation through `@markdown`. Rule 6 keeps its detection table and ends in one line.
- **Definition loading.** The definition's content goes into the prompt only for `general-purpose`.
- **Measurable gates.** The 2-minute, 80% and 50,000-token gates and the self-budget tables are gone. Scores are advisory.
- **Pattern C.** Only write-capable leaves write the scratch file.
- **Stale text.** The `@code` example names `sk-code`. The orchestrator runs `/speckit:save` itself. The Single-Hop section is gone. The split row says 12 calls, matching the self-governance footer.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/orchestrate.md` | Modified | The eleven fixes, the moves and the pointers |
| `.skilled/agents/agent-registry.json` | Modified | `deep-research` task type names `/deep:research` |
| `.skilled/skills/system-spec-kit/references/workflows/orchestrator-dispatch.md` | Created | Decomposition aids, budgets and output-review tables |
| `.skilled/skills/system-spec-kit/ROUTER.md`, `leaf-manifest.json`, `leaf-aliases.json` | Modified | Reference on the DISPATCH route |
| `.claude`, `.pi`, `.codex`, `.dsh` orchestrate copies | Regenerated | Runtime mirrors |
| `system-spec-kit/runtime` trigger-index outputs | Regenerated | Index of the new reference |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max`, through cli-pi on `llmgateway/deepseek-v4.1-flash-1017`, made the ten `orchestrate.md` and registry edits, one task per dispatch. The conductor read each diff before the next dispatch. The conductor moved the sections by heading range with a script, wrote the reference from the captured blocks, and checked that each moved block appears byte-for-byte in it, after the three em dashes were replaced. Then it registered the reference, ran the mirror routine and ran every acceptance command.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| [DEVIATION] The retry ladder gives `BLOCKED` one re-dispatch when the missing input can be supplied, not an immediate escalation | `code.md` §8 offers `@debug` after three consecutive `BLOCKED` returns, which cannot happen if any `BLOCKED` escalates at once |
| [DEVIATION] Rule 7 items 3 to 7 stay | The plan named them as a fallback cut, but CHK-031 requires Rule 7 to keep seven numbered items |
| [DEVIATION] Beyond the plan's table, moved Verification Actions, Scoring Dimensions and Resource Budgeting, folded Sub-Orchestrator Pattern into section 0 and the anti-pattern row, and dropped three pointer-only headings | The planned moves left 635 lines. Table-only sections were moved ahead of behavioral protocols such as Session Recovery, which fire when the orchestrator can least fetch a reference |
| [DEVIATION] The REQ-009 grep is narrowed to the example's `Skills:` line | The original pattern also matches the generated `@review` routing row, which correctly names code-review mode |
| [DEVIATION] REQ-011 and T025 accept `Result: PASS` | The skill check now prints `Result: PASS` for a clean run, not `NO FINDINGS` |
| Moved blocks keep their bare section numbers, and the reference states they name `orchestrate.md` sections | It keeps each moved block byte-for-byte |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Every acceptance command in `spec.md` section 4 | Each prints what its row names. Output in `scratch/after.txt` |
| `wc -l` canonical and Claude fork | 599 and 587 |
| Both plugin tests | `pass 5`/`fail 0` and `pass 1`/`fail 0` |
| `sync-agent-roster.cjs --check`, `check-agent-mirror-sync.cjs` | `agent-roster: OK`, exit 0 |
| `sk-skill-check.cjs` on `system-spec-kit` | `Result: PASS` |
| `validate_document.py` on the new reference | VALID, 0 issues |
| `generate-trigger-index.mjs --check` | exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two `§9` citations stay unpointed.** `orchestrate.md:384` cites `code.md` §9, and `:579` cites the Self-Protection Rules that stay in `orchestrate.md` §9. Both are correct as written.
2. **The Resource Budgeting token and time limits moved, not deleted.** They are the same unmeasurable class as REQ-008 and sit in the reference §8. Deleting them is a follow-up.
<!-- /ANCHOR:limitations -->

---



---
title: "Implementation Summary"
description: "The cli-claude-code self-invocation guard now tells a Claude Code session to dispatch a native subagent and how to pin its model and effort."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/079-claude-code-native-dispatch"
    last_updated_at: "2026-10-05T08:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Stated effort inheritance in the guard and added a doc test"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/claude-code-native-dispatch-docs.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-code-native-dispatch"
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
| **Spec Folder** | 079-claude-code-native-dispatch |
| **Completed** | 2026-10-03; follow-up 2026-10-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude Code session that reads the cli-claude-code guard now learns where to go instead of the CLI. Before, the guard said only "use native capabilities", so a session needing Sonnet 5.5 at xhigh checked the CLI route before it dispatched a subagent.

### Native dispatch guidance in the cli-claude-code guard

The "You ARE Claude Code already" bullet now says to dispatch a subagent with the Agent tool, that its `model` parameter picks the model, and that a pinned effort comes from an agent definition whose frontmatter sets `model` and `effort`. The guard comment and the `$CLAUDECODE` rule now route to a native subagent instead of only refusing.

### Follow-up: effort inheritance

That wording read as "no matching definition, no such effort". On 2026-10-05 a session asked for Sonnet 5.5 at high found no `sonnet-high` definition and told the operator the level was unavailable. The bullet now says the Agent tool takes no effort setting, that a subagent runs at the session's effort unless its definition sets `effort`, that a definition is needed only for a different level, and that a new definition loads with no restart. It cites the `effort` row at https://code.claude.com/docs/en/sub-agents and says the page wins where they differ. The guard comment says the same in one line, and the Hermes copy is regenerated.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md` | Modified | Three guidance lines |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` and its authored copy | Modified | Re-minted for the new skill text |
| `.hermes/skills/cli-claude-code/SKILL.md` | Regenerated | Hermes copy of the skill |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/claude-code-native-dispatch-docs.vitest.ts` | Created | Fails when either copy drops the inheritance rule or says a definition is required |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator approved the exact wording. The parent session applied it, re-minted the hub manifest, copied it to its authored source and ran the routing gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A packet of its own, not the doctor packet | The change is to a different skill and has nothing to do with the doctor audit |
| Follow up in this packet | It holds the wording that caused the misreading; the operator chose it over a new packet |
| A doc test, not a hook | The failure was a misleading sentence, and a test over the sentence catches it returning; the test lives beside the other cli-skill doc tests |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration` | Exit 0, all hard invariants passed, 0 warnings |
| `node .skilled/bin/compiled-route-guard.cjs` | Exit 0 after the re-mint, all hubs fresh |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0 |
| Follow-up: `npx vitest run --config ../../vitest.config.ts --project cli tests/claude-code-native-dispatch-docs.vitest.ts` from `runtime/cli` | Failed on the stale Hermes copy ("should say subagents run at the session's effort"), passed after regeneration, 1 of 1 |
| Follow-up: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | `PASS: 70 Hermes skill copies in sync`; only `cli-claude-code` had drifted before regeneration |
| Follow-up: `parent-skill-check.cjs` on the hub | Exit 0, all hard invariants passed, 0 warnings |
| Follow-up: `compiled-route-guard.cjs` and `route-validate.sh` after the hook re-minted the hub | Exit 0, all hubs fresh; route-validate exit 0 with the same two `--dry-run` notices main shows |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `sonnet-xhigh` agent is user-level.** It lives in `~/.claude/agents/`, outside the repository, so another machine needs its own copy.
<!-- /ANCHOR:limitations -->

---

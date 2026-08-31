---
title: "Implementation Summary: Phase 6: Always-Loaded Routing Compression"
description: "Three of four AGENTS.md routing sections compressed on an independent fresh-model review, one deliberately untouched, and a decommissioned MCP server removed from the skill that still called it live. Three of the four candidates turned out to be correctness defects rather than bloat, including a command dead for six weeks and a search table naming tools this runtime does not have."
trigger_phrases:
  - "routing compression result"
  - "second lens review"
  - "decommissioned server removal"
  - "correctness defects found"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/001-repo-rules-router/006-always-loaded-routing-compression"
    last_updated_at: "2026-08-31T11:08:09Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Compressed three routing sections and removed the decommissioned server"
    next_safe_action: "Decide whether the doctor tooling fix is in scope"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-always-loaded-routing-compression"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-always-loaded-routing-compression |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three of four routing sections in the always-loaded document are compressed, one is
deliberately untouched, and a decommissioned MCP server no longer appears anywhere in the
skill that documented it as live. `AGENTS.md` is **874 bytes smaller than at the previous
commit** — which means this phase paid back phase 5's growth and then some.

The four candidates were not what they looked like. Three turned out to be **correctness
defects**, not bloat.

### A command dead for six weeks

The Quick Reference table named `/deep:ai-system-improvement`. That command was deleted on
2026-07-15 by `48c3b2e8374`, and `AGENTS.md` had been its only live reference outside
`specs/` ever since.

### A search table naming tools that do not exist

The code-search tree told agents to use `Grep` and `Glob`. Neither exists as a tool in this
runtime — every search in this session ran through Bash `rg`. The rows now name the
*capability* with the tool as a parenthetical example, which keeps the lookup affordance a
weaker reader depends on instead of trading it for abstraction.

### A skill and the always-loaded document disagreeing

`mcp-code-mode` described Sequential Thinking as a live native server in twelve places while
`AGENTS.md` correctly recorded it as decommissioned. The skill was wrong. That ordering
mattered: cutting the `AGENTS.md` registration inventory first would have left the stale
skill as the repository's only statement on the subject.

### One section deliberately left alone

The Gate 2 artifact trigger stays exactly as it was. The skill advisor **failed to connect
this session**, so Gate 2's hook path and its CLI fallback are both dead — the artifact
trigger is the only surviving routing obligation. And it cannot move into a skill, because
a skill cannot instruct an agent that has not loaded it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | B, C, D compressed; A untouched; 3,829 bytes removed |
| `.opencode/skills/mcp-code-mode/SKILL.md` | Modified | 11 stale mentions removed; the "why it went" note kept |
| `.opencode/skills/mcp-code-mode/README.md` | Modified | 3 roster mentions corrected |
| `.opencode/skills/mcp-code-mode/references/naming-convention.md` | Modified | The `cli`-manual exception added as Mistake 0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

By a second lens, because every candidate was a judgment call and the rule this packet
shipped in phase 2 says one lens is not a finding for those.

A fresh model reviewed all four independently. Its brief carried the evidence and the
binding constraints and **deliberately not the first reader's conclusions**, so agreement
between the two would mean something. It came back better-evidenced than the first read and
corrected it three times — on the measurement unit, on how far to cut the Quick Reference
table, and on what was actually wrong with the search tree.

Then the rule that matters when a review is good: its load-bearing citations were re-opened
rather than adopted. Four were checked; all four held; the review's own line-count figure
did not and was corrected before use.

Every `sequential thinking` reference in the repository was enumerated and classified before
a single edit — misleading, behavioral, historical, or a different meaning entirely. The
`depth-detection-parallel-vs-sequential` documents use the phrase for a dispatch concept, not
the server, and were correctly excluded.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use a fresh model rather than reason alone | Four judgment calls on an always-loaded document; the packet's own rule refuses a single lens for those |
| Brief the reviewer without my leanings | Telling it what I expected would have built a machine for confirming it |
| Re-verify a review that was better than mine | Being well-evidenced is exactly when the check gets skipped. One of its figures was wrong |
| Fix the skill before cutting the inventory | Until the skill was corrected, the `AGENTS.md` paragraph was the only accurate statement in the repository |
| Keep tool names as examples in the search table | The reviewer raised the weaker-model risk against its own recommendation; abstraction is the wrong direction for a weaker reader |
| Leave candidate A untouched | Its value is that it fires, not that it informs — and with the advisor down it is the only routing obligation still standing |
| Leave the doctor tooling alone | 31 references across executable tooling with its own tests. Fixing it here would be drift onto a surface this phase never exercised |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Review claims re-verified before acting | PASS - 4 of 4 held; the reviewer's line-count figure corrected |
| Dead command gone | PASS - `rg -l 'ai-system-improvement'` outside `specs/` returns nothing |
| Decommissioned server gone from its skill | PASS - 14 mentions removed; 1 explanatory note kept at `SKILL.md:276` |
| Unique content survives | PASS - "Registration is not availability" and "widen the pattern rather than trusting a single hit" both retained, both re-checked as unique first |
| Dangling references | PASS - "Grep, Glob, and Read routes" 0, "Sequential Thinking" in `AGENTS.md` 0, "decision tree below" 0 |
| Command resolution | PASS - every command named in `AGENTS.md` resolves in at least one runtime directory |
| Link resolution | PASS - 8 of 8 `repo-rules/` pointers plus the `naming-convention.md` pointer |
| Byte delta | MEASURED - `AGENTS.md` 51,211 to 50,337 bytes: 874 smaller than the prior commit; 3,829 removed by this phase |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The most consequential finding is unfixed.** `/doctor:mcp install` still runs `npx -y @modelcontextprotocol/server-sequential-thinking` — it would reinstall the decommissioned server. 31 references across `mcp-doctor.sh` and three command assets. Deliberately out of scope: executable tooling with its own tests that this phase never exercised. Named here so it is not rediscovered.
2. **A broken link in another skill was left.** `mcp-tooling/README.md` and three metadata files reference `mcp-n/`, but the directory is `mcp-magicpath`. Found in review, not named in the instruction, not fixed.
3. **The Quick Reference table was compressed, not deleted, on missing evidence.** The structural case for deleting it — that every runtime injects its own command listing — is confirmed only for Claude Code. Verifying the other five profiles would settle it.
4. **The weaker-model trade is asserted, not measured.** Compression trades a lookup affordance for lower per-turn cost. The cost is paid by every model on every turn; the affordance is used occasionally by weaker ones. No measurement exists either way.
5. **Historical references remain by design.** Changelogs, decision records and benchmark reports still name the retired server. Editing them would falsify the record of what happened.
<!-- /ANCHOR:limitations -->

---



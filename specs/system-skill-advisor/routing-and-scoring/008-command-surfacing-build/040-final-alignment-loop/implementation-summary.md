---
title: "Implementation Summary: Phase 40: final-alignment-loop"
description: "A refused or questioned command is no longer offered when the refusal follows the name, when the command is named as a document, when it sits in brackets or other marks, or beside its own doc path."
trigger_phrases:
  - "final alignment loop implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop"
    last_updated_at: "2026-11-17T05:04:07Z"
    last_updated_by: "generate-context"
    recent_action: "Closed review pass fourteen; limit class recorded"
    next_safe_action: "Run the final alignment on the branch"
    packet_purpose: "Purpose: A refused or questioned command is never offered in those shapes, a request still is, the playbook passes as written, and the four advisor tasks rank the advisor first without moving the floors."
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/implementation-summary.md"
      - ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-040-final-alignment-loop"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "77af2d6d-58e8-4180-b6da-697f12833f71"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-17T05:04:07Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 96
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-final-alignment-loop |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A command you refuse or ask about is no longer offered when the refusal comes after the name, when you name the command as a document, when it sits in brackets, parentheses, strike marks, code tags, guillemets or primes, or when its doc path sits beside your refusal. The advisor now ranks itself first for the Vibe prompt hook setup, and one testing playbook scenario uses a prompt that still reaches `/doctor:update`.

### Phase 40: final-alignment-loop

The final alignment run and review pass twelve found these gaps after the earlier passes had closed the quote and retired-name cases. You chose the full loop, so each gap got a case that fails on the old code first, then the fix. One fix overreached at first: reading a command followed by "file" as a document also caught typed requests whose argument is a file, and the routing slice caught three rows. The rule now needs "the", "this" or "that" before the name.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modified | Later refusals, document namings, the wider wrapper set, doc paths, and the typed start boundary |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | Modified | 17 new cases and twelve wrapper pairs in the invariance matrix |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md` | Modified | The third prompt |
| `.skilled/skills/system-skill-advisor/graph-metadata.json`, `runtime/scripts/skill-graph.json` | Modified | The advisor intent phrase "vibe prompt hook" and the recompiled graph |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modified | Names Mistral Vibe among the prompt-time consumers |
| `decision-record.md`, `scratch/rule-diag.mjs` | Created | ADR-001 for P05, and the row-id diagnostic |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`scratch/before.txt` reproduced every finding at `b8ebee37d75`. The 16 new cases failed there, then passed after the fix. The first gate showed three typed rows moved in the routing slice, `rule-diag.mjs` traced them by row id to the document rule, and the determiner fixed them. `scratch/after.txt` then ran the stored sets, graph freshness, build, typecheck, the suite both ways, `FLOOR`, `EVAL` and the alignment run's 15 probes. Review passes thirteen and fourteen and two more full alignment runs followed. The closing run `20261117T064814Z` found two run commands still offered when the words after the name took them back, which are fixed, and nine other P1 that ADR-002 makes operator items.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A document naming needs a determiner | A typed request puts its argument after the name, as in `/create:diff file a.md b.md`, while "read the /create:readme document" names it |
| Decline probes P05, P08 and P09 (ADR-001) | `/doctor:helper` ranks `/doctor:skill-advisor rebuild` first for P05. P08 and P09 needed common words that pulled ordinary prompts to the advisor |
| A refusal of "it" must end its clause, and a later request clause is read first | "don't run it twice" limits a run and "read the docs, then run it" asks for one, review pass thirteen |
| A run command needs request evidence, and the words after it can withdraw it | It acts without asking, so an unled naming such as "no need for /doctor:deep-loop" offers it only after a use verb or at a sentence start, the exception the operator kept in the limit class |
| Drop the wrapper marks everywhere, not only next to a name | They carry no lead word, so dropping them changes no lead reading, and the invariance matrix checks every fixture |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Guards test | PASS, 185 passed, 16 new cases fail on `b8ebee37d75` |
| Full suite, flag unset and set | PASS, 2385 passed 0 failed both ways (`scratch/after-pass-13.txt`) |
| `FLOOR`, `EVAL`, stored sets | PASS, 24/44 0/35 2/44, [160,49,21,5], unchanged |
| Closing alignment run `20261117T064814Z` | 0 P0, 11 P1: two run-command P1 fixed after it (gate `scratch/after-closing-alignment.txt` 2395 passed 0 failed both ways, floors unchanged), nine waived as operator items (ADR-002, `scratch/closing-alignment.md`) |
| Final alignment run `20261117T051824Z` | 0 P0, 2 P1 fixed: a run command offered on an unled refusal, and Vibe missing from SKILL.md; gate `scratch/after-final-alignment.txt` 2391 passed 0 failed both ways, floors unchanged |
| Generic advisor phrases | Fixed: four ordinary prompts from review pass fourteen no longer top the advisor |
| Alignment probes | 11 of 15: P05, P08 and P09 waived (ADR-001), P04 overturned by the run's critic |
| Ordinary-word leak check | PASS, none of the five review prompts tops the advisor |
| Playbook prompt through the Claude hook | PASS, `/doctor:update (ask)` parent, `(parent-named only)` child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A refusal or question with no lead word directly before the command name reads as a request.** The mention check reads a fixed list of leads ("do not run", "what does" and the like) and treats any other wording as a request, so "please refrain from /deep:review" or "never mind /create:readme" still offers the command. This includes a refusal of "it" after the name that carries a reason or a repeat adverb ("don't run it again, it broke things") and a document naming followed by a then clause. The operator accepted this class on 2026-11-17 after review passes thirteen and fourteen swung between its two sides. A new wording of it is graded P2 in review and alignment, and P1 only when it breaks a pinned fixture or offers a command whose policy is run. Every command that writes is start or ask, so the worst case is one unwanted setup question, and the reader's own words sit beside the brief.
2. **Underscore emphasis is not dropped.** A command name may hold an underscore, so `_/create:readme_` after a refusal can still read as a request. Write the name plain or in backticks.
<!-- /ANCHOR:limitations -->

---



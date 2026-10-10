---
title: "Implementation Summary"
description: "The five-part close-out status now has one owner, communication-handoff.md section 1, which Gate 6 loads before every turn ends. AGENTS.md section 10 holds a one-line pointer to it, evidence-and-proof.md section 10 points there too, and the delivery-prefix canary is unchanged."
trigger_phrases:
  - "agents md pointers implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/004-agents-md-pointers"
    last_updated_at: "2026-10-10T09:20:00Z"
    last_updated_by: "builder"
    recent_action: "Applied the AGENTS.md pointer and the two rule file edits, and passed all six goal criteria."
    next_safe_action: "Orchestrator reviews the build, runs the Hermes generators once and updates spec.md"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".skilled/repo-rules/communication-handoff.md"
      - ".skilled/repo-rules/evidence-and-proof.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-004-agents-md-pointers"
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
| **Spec Folder** | 004-agents-md-pointers |
| **Completed** | Built 2026-10-10, closeout pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

AGENTS.md section 10 no longer lists four close-out items while the repo rules list five. The list now lives once, in `communication-handoff.md` section 1, which Gate 6 loads before every turn ends, a read-only turn included. AGENTS.md keeps a one-line pointer to it, so a session that loads nothing else still knows where the status is defined.

### Phase 4: agents-md-pointers

The obvious fix was a pointer to `evidence-and-proof.md`, which already held five items. That file loads only through Gate 5 on the first write of a session, and a review, audit or explanation turn writes nothing, so the pointer would have led to a file that is not in context when the clause binds. `communication-handoff.md` is the one rule file that is guaranteed to be in context at the end of every turn, so the five parts moved there and both other files point to it.

The edit to AGENTS.md is line 296 and nothing else. The new line is 14 bytes shorter than the old one, the file reads 27,252 bytes against 27,266 before, and no byte before line 296 changed, so the 21 delivery-prefix anchors keep their end bytes. The audit in `plan.md` checked all 44 clauses of AGENTS.md. One became a pointer and 43 stay, each with the reason it cannot move.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | Line 296 became a one-line pointer to `communication-handoff.md` section 1 and holds no list |
| `.skilled/repo-rules/communication-handoff.md` | Modified | Section 1 owns the five-part status (lines 67 to 72), section 8 gained one self-check line, version 1.6.0.4 became 1.6.0.5, 198 lines became 210 |
| `.skilled/repo-rules/evidence-and-proof.md` | Modified | Section 10 swapped the five-item list for a pointer to the owner and kept the not-done paragraph, version 1.1.1.3 became 1.1.1.4, 238 lines became 233 |
| `implementation-summary.md` | Modified | This record |
| `tasks.md` | Modified | Task checkboxes with evidence |
| `goal.md` | Modified | Log rows only |
| `scratch/` | Created | Before copies, check outputs and the scope baselines |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planner applied the exact edit text to a copy of the rule tree first, and the copy passed the canary and the repo-rule checker. The build applied the same text to the real files with the Edit tool on the quoted old text, and the three edited files are byte-identical to the saved dry-run copies (`cmp` exit 0 for each). Before the first edit the build saved the three originals, a scope baseline and the baseline output of every checker. After the last edit it reran each of them against those baselines.

Nothing was committed or pushed. No router row, trigger index entry, mirror or consumer changed, and the Hermes generators were not run in write mode.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| D1: `communication-handoff.md` section 1 owns the five-part status | Gate 6 loads it before every turn ends. The rejected option, a pointer to `evidence-and-proof.md`, fails the binding test because that file loads only on the first write of a session. |
| Decision test 1, always-loaded: pass | The status binds at turn end, and `communication-handoff.md` already fires on "About to end a turn, of any kind", with the AGENTS.md section 8 precedent in the decision tests. |
| Decision test 2, scope boundary: pass | The status is posture, how a turn closes. `REPO RULES.md` section 4 lists that as In. |
| Decision test 3, home: pass | The content lands in a section of the rule that already owns the close. No new file and no new trigger row. |
| Decision test 4, restraint: pass | The failure is real today. A four-item list sits in the file every session reads, against a five-item list in a file most turns never load. |
| D2: AGENTS.md changes only at line 296 | The other 43 clauses each fail the binding test for a recorded reason, such as a gate, an anchor, a hard blocker, an unconditional standard or an AGENTS.md-owned clause. |
| D3: the global `~/.claude/CLAUDE.md` is never edited or copied over | It is a symlink to the main checkout's AGENTS.md, so a copy would write through it. |
| D4: both rule files change in content and in the fourth version segment only | No trigger row, trigger phrase or Fires-when bullet changed, so `REPO RULES.md` and the trigger index stay untouched. |
| Keep the Goal Posture clause in AGENTS.md | It restates a skill reference that loads only when its skill is routed, while the clause binds every turn. A pointer pass over skill references would be a separate fix. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Criterion 1: `diff scratch/before/AGENTS.md AGENTS.md; wc -c AGENTS.md` | PASS. Prints only `296c296`, then `diff-exit=1` and `27252 AGENTS.md`. The new line names `.skilled/repo-rules/communication-handoff.md` and `§1` and holds no list. |
| Criterion 2: owner lines, absent list, versions | PASS. Five parts at lines 67, 69, 70, 71 and 72. The search for `Five things, briefly` and `Known residual risk.` in `evidence-and-proof.md` prints nothing and exits 1. Versions read `1.6.0.5` and `1.1.1.4`. |
| Criterion 3: scope and the global file | PASS. `git status --porcelain` over the guarded paths prints exactly ` M .skilled/repo-rules/communication-handoff.md`, ` M .skilled/repo-rules/evidence-and-proof.md` and ` M AGENTS.md`. `readlink ~/.claude/CLAUDE.md` still prints the main checkout's AGENTS.md path. |
| Criterion 4: `check-rule-copies.js` and its self-test | PASS. Exit 0 with `21 delivery-prefix anchor(s)`, a prefix report identical to `scratch/rule-copies-before.txt` (`diff-exit=0`, `16373  #### Blast-Radius Management`), and the self-test ends with `All rule-canary test cases passed`. |
| Criterion 5: `check-repo-rules.cjs`, prose scan, consumers | PASS. Exit 0 with `RESULT: PASSED (11/11 checks)`, the only diff to the baseline being `max=238` to `max=233` and `links=46` to `links=48`. The prose scan prints nothing for all three files and its control hit at line 38 of `prevent-overengineering.md` is live. `sync-gate1-pointers.cjs --check` exits 0 with `PASS: 1 instruction files carry the root Gate 1 lookup.`. Vitest prints `Tests  12 passed (12)` and pytest prints `13 passed`. |
| Criterion 6: `validate.sh --strict` on this folder | PASS. Prints `RESULT: PASSED`, read together with exit 0 and `Errors: 0` in `scratch/validate-after.txt`. |
| Requirement checks beyond the six criteria | PASS. The Fires-when sections of both rule files are unchanged. Gate 6 at line 106 still names `communication-handoff.md` before ending a turn. No count word (`things, briefly`, `five parts`, `four parts`) remains in AGENTS.md or the rule files. `Known residual risk.` appears only in `communication-handoff.md`. The trigger index holds no `.skilled/repo-rules/` path (exit 1). The audit counts 44 rows, 1 POINTER and 43 KEEP. |
| Hermes copy check (`sync-skills-hermes.cjs --check`) | Not a goal criterion. Before and after the build it prints `DRIFT sk-code-quality` and `DRIFT agent-deep-review`, exit 1. Both names belong to other builders' edits, and this change adds no new name. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The global instruction file is the operator's, and it needs no copy.** `~/.claude/CLAUDE.md` is a symlink to the main checkout's AGENTS.md (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md`), so it was neither copied nor edited. Copying the new AGENTS.md there would have written through the symlink into the main checkout. The one action that belongs to the operator is landing this branch in the main checkout, which carries the new line 296 to the global file.
2. **Sibling repositories keep their own close-out wording.** The rule files are symlinked into sibling repositories, so those repositories receive the new rule text. Their own AGENTS.md copies still carry their own close-out wording, as they did before this phase.
3. **`communication-handoff.md` is now in the 201 to 250 line band.** It grew from 198 to 210 lines. The reason is content moved down from AGENTS.md, which the length-band contract names as a sufficient reason.
4. **One obligation has two self-checks.** `evidence-and-proof.md` section 12 keeps its residual-risk self-check line, and `communication-handoff.md` section 8 now has a status line too. The first checks the close-out from the evidence side and the second from the owner.
5. **A scaffold passes strict validation.** `validate.sh --strict` prints `RESULT: PASSED` on an unfilled scaffold, so the placeholder search in `tasks.md` is the real gate for unfilled text.
6. **The Hermes copies are the orchestrator's.** The `--check` form printed `DRIFT sk-code-quality`, `DRIFT agent-deep-review` and exit 1 both before and after the build, because other builders edited those two. This change needs no regeneration, and the orchestrator's single generator run after every build covers them.
<!-- /ANCHOR:limitations -->

---

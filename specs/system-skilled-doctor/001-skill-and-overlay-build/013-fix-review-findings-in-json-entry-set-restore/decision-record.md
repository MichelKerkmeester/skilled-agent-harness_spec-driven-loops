---
title: "Decision Record: Phase 13: fix-review-findings-in-json-entry-set-restore"
description: "Why nested dropped sets restore outer first, and the operator decisions for the re-pin check, the cannot-apply state and the doc scope."
trigger_phrases:
  - "fix review findings in json entry set restore decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/013-fix-review-findings-in-json-entry-set-restore"
    last_updated_at: "2026-11-16T19:46:47Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-fix-review-findings-in-json-entry-set-restore"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 13: fix-review-findings-in-json-entry-set-restore

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Restore nested dropped sets outer first, not deepest first

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-16 |
| **Deciders** | Operator, on a prototype run |

---

<!-- ANCHOR:adr-001-context -->
### Context

The handoff for this phase said to restore the deepest dropped path first, so two nested sets dropped together would both leave. A one-line prototype of that order still refused probe p01 in both write orders. Inner then outer refused `rows.a.top` as edited. Outer then inner restored the inner value, and then the outer record no longer matched.

### Constraints

- A value a person edited must still be refused, never overwritten.
- The records in `sync-state.json` carry a path, a value and an `added` flag, with no write time.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: restore the outer record first and judge it against its value with every later-written, also-dropped inner value laid on top.

**How it works**: the records keep the order their values were written, because a second write to one path now moves its record to the end. A set the entry set still lists inside the outer path is masked out of the comparison and written again after the restore. Once the outer value is the pin's, each inner record reads as the pin's value and needs no write.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Outer first with later inner values laid on** | p01 returns the file to the pin in both orders. A hand edit inside still refuses | More code than a sort | 9/10 |
| Deepest first, as the handoff said | One line | p01 still refuses in both orders | 2/10 |

**Why this one**: it is the only order of the two that clears the finding, and the paired test shows the hand-edit refusal stays.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Two nested sets dropped together both leave.
- A dropped outer set with a kept inner set now restores, and the inner set is written again. Before, it was refused.

**What it costs**:
- About 60 more lines in the restore. Mitigation: three tests pin the behavior.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An older state file holds records in first-write order | L | A wrong order can only make the comparison fail, which refuses and writes nothing |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | p01 reproduced the refusal at `35d49e8f638` |
| 2 | **Beyond Local Maxima?** | PASS | Deepest first was prototyped and failed |
| 3 | **Sufficient?** | PASS | p01 passes in both orders |
| 4 | **Fits Goal?** | PASS | The finding is in this phase's scope |
| 5 | **Open Horizons?** | PASS | No state format change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `restoreDroppedSets` sorts dropped records by path length and compares through `valueLeftBySets`.
- The `onSet` callback in `planJsonOverlay` moves a repeated path's record to the end.

**How to roll back**: revert the phase's commit. The record format is unchanged.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Nested dropped sets restore outer first, with later inner values laid on the outer record. | Deepest first was prototyped and still refused probe p01 in both orders. | None | ADR-001, overlay-engine.cjs restoreDroppedSets |
| Q002 | No choice yet: the operator asked for the pros and cons of each re-pin option. | Not stated. | None | tasks.md T002 |
| Q003 | No choice yet: the operator asked for the pros and cons of each state-label option. | Not stated. | None | tasks.md T002 |
| Q004 | The remaining silent cases are documented in overlays.md inside phase 013. | Not stated. | None | overlays.md, REQ-007 |
| Q005 | A re-pin plans json-entry files its copy leaves in place against the new commit before the backup, and refuses with exit 2. | Not stated. | Q002 | REQ-002, overlay-engine.cjs repinUnderLock |
| Q006 | The operator asked whether a new state is better UX and accepted the extra work, so a new state was built. | I dont care if its more work. | Q003 | REQ-007 |
| Q007 | A json-entry plan problem over an untouched file is reported as the new state cannot-apply. | Not stated. | Q006 | REQ-007, overlay-engine.cjs analyze and fixFor |
| Q008 | All four findings of the first Opus review are fixed in round two. | Not stated. | None | tasks.md T015-T019 |
| Q009 | The Fable 5.2 harden-and-UX question runs through the claude2 shell function, not a sub-agent. | The operator ruled out Fable sub-agents. | None | scratch/fable-harden-ux-answer.md |
| Q010 | All four Fable item groups become a follow-up phase after 013 ships. | Not stated. | None | implementation-summary.md, scratch/fable-harden-ux-answer.md |
| Q011 | The three P1s of the second Opus review are fixed in round three, and the two P2s are documented as limits. | Not stated. | None | tasks.md T020-T023, overlays.md |
| Q012 | A second, independent review of the pushed set restore runs on a different model before Barter re-pins. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/013-fix-review-findings-in-json-entry-set-restore/spec.md |
| Q013 | The fix scope covers the P0 wrong item after re-pin, the P1 re-pin refusing after writing, the P1 nested sets and index spelling, and the P1/P2 messages and no-checkout case. | Not stated. | none | specs/system-skilled-doctor/001-skill-and-overlay-build/013-fix-review-findings-in-json-entry-set-restore/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_01VRHux8kSz5PHndkHePuvdK:0 -->

Question:
```text
Nested sets dropped together (review finding 3): the handoff said to restore the deepest path first, but a run of that on probe p01 still refuses in both orders. The prototype restores the outer value first, counts a value written later inside it as part of the record, and skips sets the entry set still lists. p01 then returns the file to the pin in both orders. Which do we build?
```

Options:
```text
Outer first (Recommended)
Deepest first as written
```

Answer:
```text
Outer first (Recommended)
```

### Q002
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_01VRHux8kSz5PHndkHePuvdK:1 -->

Question:
```text
Stale base after a re-pin (finding 2 plus the P0): with the prototype, a json-entry destination the re-pin does not copy (in repin.exclude, or at the tree root) is now read against the new commit. When upstream swapped or replaced the array item, the re-pin refuses instead of writing the wrong value. That refusal comes after the backup and copy, then prints a rollback line (probe p05b). Do we also stop it before the backup?
```

Options:
```text
Refuse before backup
Accept rollback (Recommended)
```

Answer:
```text
Need more details in this negative vs benefits for each
```

### Q003
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_01VRHux8kSz5PHndkHePuvdK:2 -->

Question:
```text
Restore refusals are labeled both-changed (finding 7), though the live file was never edited. The state names and the --json output are a contract the vendoring project reads. How should a json-entry plan problem be reported?
```

Options:
```text
Keep state, fix text (Recommended)
New state name
Blocked list only
```

Answer:
```text
More detail positive vs negative per option
```

### Q004
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_01VRHux8kSz5PHndkHePuvdK:3 -->

Question:
```text
Remaining-work item 4 asks to document three silent cases from before these fixes in overlays.md: the kept-set shift, a hand swap of two items, and the insertObjectKeys leftover. They sit in the same paragraph phase 013 edits. Should they be included in phase 013?
```

Options:
```text
Yes, in 013 (Recommended)
No, separately
```

Answer:
```text
Yes, in 013 (Recommended)
```

### Q005
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_01Q55kEV11zjx5yd7GuzjbHB:0 -->

Question:
```text
Re-pin with a stale json-entry file (finding 2 plus the P0). Here is what happens today with the prototype, from probe p05b. A json-entry destination the re-pin does not copy (in repin.exclude, or at the tree root) still holds the old upstream's array. Upstream swapped or replaced the item that a dropped set pointed at. The re-pin takes the backup, copies, writes the new pin, then refuses. It exits 1 and prints a `repin --rollback <id>` command. The tree is left on the new pin, with the copied files, until a person runs that command. Nothing wrong is written to the JSON file. Which do you want?
```

Options:
```text
Refuse before backup (Recommended)
Keep the late refusal
```

Answer:
```text
Refuse before backup (Recommended)
```

### Q006
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_01Q55kEV11zjx5yd7GuzjbHB:1 -->

Question:
```text
Restore refusals are labeled both-changed (finding 7). Today every json-entry plan problem (a refused restore, a missing parent key, a bad entry set) prints `both-changed <file>  fix: resolve <entry set> and <file>, then run status`, followed by a BLOCKED line with the real reason. The live file was never edited, and the overlays.md state table says both-changed means both copies moved. Whether the vendoring project's own scripts read the state names in --json is UNKNOWN. The doctor's apply, status and repin assets and the presentation file name both-changed. How should it be reported?
```

Options:
```text
Keep state, fix text (Recommended)
New state name
Blocked list only
```

Answer:
```text
would 2 be better ux? I dont care if its more work
```

### Q007
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_017N8ttSRLWxjEcPUk26tmj5:0 -->

Question:
```text
The new state covers one case only: a json-entry overlay whose entry set the engine cannot apply to the live file, so it has no desired bytes to write. Examples are a refused restore, a missing parent key, or an operation that fails. File and marked-section 'upstream changed' cases stay both-changed, because there both copies did move. It blocks apply and re-pin like both-changed does, and its fix line points to the reason. Which name?
```

Options:
```text
cannot-apply (Recommended)
refused
entry-set-refused
```

Answer:
```text
cannot-apply (Recommended)
```

### Q008
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_01Ejmfi2hMZLg25n7YHdHfBN:0 -->

Question:
```text
The fresh Opus review of phase 013 found 4 problems, and I reproduced all 4. Two P1s: (1) a set that replaced a whole array item, then an upstream swap, still gives a duplicate item with RESULT: PASSED. This predates the phase, and the new item check misses it. (2) A regression from this phase: a dropped set beside a kept setKeyOnItem or a nested appendItems is now refused, where the base engine restored it. Two P2s: (3) the re-pin refusal does not say the old pin, and leaves out `run apply`; (4) records stored in another order by the base engine give a false 'edited' refusal. Proposed fixes: (1) for a whole-item set, require every other item of the array to match the pin, otherwise refuse; (2) leave out the values that setKeyOnItem, insertObjectKeys and nested insertItems/appendItems wrote, as already done for sets; (3) the message names the pin's copy and `run apply`, and the re-pin line says to put the array back to the current pin, apply, then re-pin; (4) also accept a live value equal to the outer record alone. What should happen?
```

Options:
```text
Fix all four (Recommended)
Fix P1s only
Commit as is
```

Answer:
```text
Fix all four (Recommended)
```

### Q009
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_01Ejmfi2hMZLg25n7YHdHfBN:1 -->

Question:
```text
Handoff item 2 asked Fable 5.2 at medium effort what to harden and how to improve UX. You said no Fable sub-agents. Should I ask it through the `claude2` shell function instead (a separate Claude session, not a sub-agent), or drop the item?
```

Options:
```text
Use claude2 (Recommended)
Drop it
```

Answer:
```text
Use claude2 (Recommended)
```

### Q010
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_01LBCUJrFMG7sigaKxvbAUXv:0 -->

Question:
```text
Fable 5.2 (medium, read-only, via claude2) listed 10 harden/UX items for the overlay engine. It ran nothing, so each is read from the code, not reproduced. Its main point: json-entry is the only scope whose bytes are computed from the live file, so the restore has to guess what the overlay wrote. That is why there have been three rounds of fixes. Its top idea: when the pinned copy is readable, also apply the entry set to the pinned text and compare (medium cost). Which items should become a follow-up phase after 013 ships? None goes into 013.
```

Options:
```text
Pinned-copy cross-check
Apply-failure state fixes
Status honesty fixes
Data-safety fixes
```

Answer:
```text
Pinned-copy cross-check, Apply-failure state fixes, Status honesty fixes, Data-safety fixes
```

### Q011
<!-- source: claude:af0bf7d0-c4f7-46b6-b600-2487a77b5e4b:toolu_01KUUXpgm9rjMaLGL1H4kz1R:0 -->

Question:
```text
The second Opus review of phase 013 found 3 P1s and 2 P2s, and all reproduced. (1) A regression from this phase: a dropped set inside an array item is refused while a kept set rewrites the whole array. The base engine restored it. (2) The base engine has the same bug, and this phase meant to fix it: when several sets together write every key of an item, the item check is empty, so a re-pin after an upstream swap writes a duplicate item at exit 0 with RESULT: PASSED. (3) The base engine has the same bug: another first-write record order still gives a false 'edited' refusal. P2s: (4) a kept inner set is not written again when the pin lacks its parent, so it is refused, which contradicts one doc sentence; (5) the function-level edit check is looser than the base engine's, but no CLI path reaches it. All three P1 fixes are small and sit in the same two functions: count a set on a path above the item as a write of the whole item; treat masks that cover every key as a whole-item write; and accept the record value with all dropped inner values laid on. Fable's pinned-copy cross-check, already chosen for the follow-up phase, is the structural answer to this kind of bug. What now?
```

Options:
```text
Fix 1-3, document 4-5 (Recommended)
Fix 1-3, ship without review
Fix 1 only, document rest
```

Answer:
```text
Fix 1-3, document 4-5 (Recommended)
```

### Q012
<!-- source: claude:3912763e-4a15-47d7-994e-71d31bbf339f:toolu_01WXuMLVXyvKwXHYAQaNbCRh:2 -->

Question:
```text
Review coverage: one reviewer, Opus 5.5, did the engine review and all three rechecks. That is one model's opinion four times, not independent views. Do you want a second, independent review of the pushed engine before Barter re-pins?
```

Options:
```text
Second model review (Recommended)
Fresh Opus review
No more review
```

Answer:
```text
Second model review (Recommended)
```

### Q013
<!-- source: claude:3912763e-4a15-47d7-994e-71d31bbf339f:toolu_01QNYC8Kbzjmu3TdYaBxPiGM:0 -->

Question:
```text
The fresh Opus review found 7 problems in the pushed set restore, all reproduced by its scripts. I reran the worst one myself: when a json-entry destination is not re-copied by a re-pin (in repin.exclude, or at the tree root) and upstream reorders the array, the re-pin writes item A's value into item B and prints RESULT: PASSED. Which do you want fixed in a new phase 013 (test first, DeepSeek on Vibe, then a review, then push)?
```

Options:
```text
P0 wrong item after re-pin
P1 re-pin refuses after writing
P1 nested sets, index spelling
P1+P2 messages and no-checkout
```

Answer:
```text
P0 wrong item after re-pin, P1 re-pin refuses after writing, "P1 nested sets, index spelling", P1+P2 messages and no-checkout
```

<!-- /ANCHOR:operator-answers-verbatim -->

---

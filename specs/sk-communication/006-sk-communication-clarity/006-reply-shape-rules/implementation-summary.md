---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/006-reply-shape-rules"
    last_updated_at: "2026-09-12T16:39:30Z"
    last_updated_by: "claude-conductor"
    recent_action: "Ten reply-shape rules landed"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-reply-shape-rules"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-reply-shape-rules |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The ten reply-shape candidates are rules now. Six went into the reply-shape half of communication.md as sections 5 through 10, three went into prose-mechanics.md, and the rationale layer closes every rule in both halves with a failure it prevents. A reply now has a stated contract for its first line, its paragraphs, its steps, its lists, its outcome, its tangents and the floor under what its cuts cost.

### Phase 6: reply-shape-rules

This phase turns the ten adopted reply-shape rows of the allocation table into rules that load when a reply loads. The reader of any reply now gets a first line that carries the outcome, paragraphs that carry them forward, numbers on multi-step work, a list that says what it shortened, an outcome that lands in two lines, and a tangent that waits its turn. The mechanics half gained the matching counterweight: sentences that state their relations, explanations that name their mechanisms, and a section that says where concise stops being shorter and starts costing the joints. Every rule states its failure, so each one can be argued with.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| repo-rules/communication.md | Modified | Sections 5 to 10 carry candidates 4, 5, 12, 15, 16 and 17, the register and no-tables rules gained their failure lines, twelve trigger phrases added, version 1.2.0.0 |
| repo-rules/prose-mechanics.md | Modified | The relation and mechanism rules joined section 1, a new section 4 carries candidate 7, the later sections renumbered, six trigger phrases added, version 1.1.0.0 |
| specs/sk-communication/006-sk-communication-clarity/006-reply-shape-rules/tasks.md | Modified | T001 to T022 closed with evidence, the strict validate RESULT recorded |
| specs/sk-communication/006-sk-communication-clarity/006-reply-shape-rules/implementation-summary.md | Modified | This record |
| specs/sk-communication/006-sk-communication-clarity/006-reply-shape-rules/scratch/size-and-marks.md | Created | Sizes before and after, the per-mark rescan, the assignment record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Written to the existing shapes, not a second one: each rule is a bold-led instruction followed by its own failure line, inside the section that governs its unit, or as a new numbered section where none did, renumbered cleanly. The corpus checker passed on its first run, nine of nine checks, which covers the 250-line ceiling, phrase uniqueness across all twelve rule files, divider parity and the router rows. The per-mark instruction set was rescanned against the 003 baseline and no mark gained a second instruction. Both halves were measured before the first edit and after the last. The packet's own strict validation gate runs at close, its RESULT line recorded in tasks.md.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| 3, 6 and 7 to the mechanics half, 4, 5, 12, 15, 16 and 17 to the reply half, 20 to neither | The unit decides: relation, mechanism naming and the cost of a cut are sentence-level, the other six govern the reply as a whole, and 20 is the failure-line layer the ten already carry |
| 20 written as a patch, two failure lines added, no new section | The register rule and the no-tables rule lacked the line, every other rule in both halves already carried one, so the layer closes without inventing a second section shape |
| Five counterweight clauses, four forward and one reciprocal | Two lines, the item cap, match length and cut filler each point at mechanics section 4, and the one-idea rule points there too, so the concise-is-not-compressed floor binds from both halves |
| Eighteen trigger phrases, two per new rule | Two satisfies the two-to-four range, the phrase-uniqueness check compares frontmatter across all twelve rule files, and 228 phrases now collide nowhere |
| communication.md allowed to reach 230 lines | The 250 ceiling holds, all ten candidates landed rather than dropping the tail, the crossed 200 note is recorded here and in scratch/size-and-marks.md |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corpus checker | PASS, RESULT: PASSED (9/9 checks), count parity 12, row coverage, phrase uniqueness 228 phrases 0 collisions, line ceiling corpus max 234 of 250, frontmatter keys, divider parity, 32 body links resolve, fires-when sections, index summaries |
| Per-mark rescan | PASS, no governed mark gained a second instruction, the rationale line for no-tables and the opener-position habit recorded in scratch/size-and-marks.md |
| Line ceiling | PASS, communication.md 230 of 250, prose-mechanics.md 140 of 250 |
| Scope | PASS, this phase's edits are the two rule halves and the three packet records, the router untouched, the working tree's other modified paths are the earlier phases' adoption work and one skill runtime database |
| Strict validate | see tasks.md, its RESULT line is recorded there |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The reply-shape half crosses the 200-line note** 230 lines against a 250 ceiling, all ten candidates landed, nothing dropped, the crossing recorded rather than repaired.
2. **The six new reply-shape rules have no self-check items** the reply half's four checklist items and the mechanics half's single marks item all predate this phase, the 003 coverage note, unchanged and recorded here.
<!-- /ANCHOR:limitations -->

---


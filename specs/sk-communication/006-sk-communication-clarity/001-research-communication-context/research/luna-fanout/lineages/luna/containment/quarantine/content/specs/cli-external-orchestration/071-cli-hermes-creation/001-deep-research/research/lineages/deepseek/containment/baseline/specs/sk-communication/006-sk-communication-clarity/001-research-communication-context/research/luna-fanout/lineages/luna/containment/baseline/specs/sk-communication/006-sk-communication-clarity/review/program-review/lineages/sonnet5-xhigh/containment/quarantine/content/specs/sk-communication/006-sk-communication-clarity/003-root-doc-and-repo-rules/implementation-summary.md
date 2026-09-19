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
    packet_pointer: "sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/containment/quarantine/content/specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/deepseek/containment/baseline/specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/luna-fanout/lineages/luna/containment/baseline/specs/sk-communication/006-sk-communication-clarity/review/program-review/lineages/sonnet5-xhigh/containment/quarantine/content/specs/sk-communication/006-sk-communication-clarity/003-root-doc-and-repo-rules"
    last_updated_at: "2026-09-12T12:44:37Z"
    last_updated_by: "claude-conductor"
    recent_action: "Split landed, both baselines recorded"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-root-doc-and-repo-rules"
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
| **Spec Folder** | 003-root-doc-and-repo-rules |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The reply-shape rule no longer fits one file, so its sentence mechanics moved out. `repo-rules/communication.md` keeps the whole-reply rules: the register, the length, the filler, the tables, the repair moves and the scope exemptions. The new `repo-rules/prose-mechanics.md` carries the sentence, paragraph, word and punctuation mechanics. The router names both, and each half's scope statement names the other, so a reader who lands in either half finds the other.

### Phase 3: root-doc-and-repo-rules

The split followed the seam assignment recorded before any edit: sections 2, 3 and 4 to the mechanics half, sections 1, 5, 6, 7 and 8 staying, and the first checklist item travelling with the punctuation section it checks. Seven frontmatter trigger phrases moved with their sections, thirteen stayed. Every moved sentence appears exactly once, worded as it was. Both halves state in one sentence what they still own and where the rest went, which keeps the three pointers in the root document true.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| repo-rules/prose-mechanics.md | Created | Carries the sentence, paragraph, word and punctuation mechanics moved out of the reply-shape rule |
| repo-rules/communication.md | Modified | Keeps the whole-reply rules, shortened description, raised version, scope sentence points at the mechanics half |
| REPO RULES.md | Modified | Added the trigger row and the index row for the new half, narrowed the communication rows to what that half still owns |
| tasks.md | Modified | T007 to T019 closed with evidence, the validate RESULT recorded |
| implementation-summary.md | Modified | This summary, the size figures and the baselines' commit |
| scratch/seam-assignment.md | Modified | SIZE AFTER SPLIT recorded under SIZE BEFORE SPLIT, same measure, wc |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The seam assignment, captured at 4512473abdec9c7f0ea02126f85bb5c709b2ac26 before any rule file changed, assigned every section, every trigger phrase and every checklist item to one side. The execution moved the assigned blocks, renumbered what stayed, and added the two router rows. Verification ran after the last governance edit: the repo-rules checker, the per-mark instruction scan against the captured baseline, the heading and divider counts in both halves, and the scoped git status.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move sections 2, 3 and 4 whole | The seam assignment assigned them to the mechanics half, the unit each governs is the sentence, the word or the mark, not the reply |
| Keep the contract lines whole in communication.md | The mechanics half states its purpose by reference, it does not carry the contract |
| Shorten the description and the router summaries rather than reword them | What the reply-shape half still owns is what the summaries must say, the mechanics units now have their own description |
| Move seven trigger phrases, keep thirteen | Each phrase goes with the section its words come from, and the checker enforces that no phrase collides across rules |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| check-repo-rules.cjs | PASS, RESULT: PASSED (9/9 checks), 12 files, 12 trigger rows, 12 index rows, 28 rule links, all resolve |
| Per-mark instruction scan | 28 baseline rows hold, every mark carries one instruction, wording unchanged, the ten instruction rows the moved sections carried now sit in prose-mechanics.md alone |
| Instruction uniqueness | Every moved phrase reads C=0 and P=1, every retained phrase reads C=1 and P=0, no instruction appears in both halves |
| Per-half size | communication.md 135 lines, 5658 characters, prose-mechanics.md 106 lines, 3945 characters, recorded in SIZE AFTER SPLIT |
| Scoped diff | AGENTS.md absent from git status, the changed set is the two halves, the router and the packet docs, the three scratch baselines were already untracked |
| Baselines | Both pin 4512473abdec9c7f0ea02126f85bb5c709b2ac26, the measurement and per-mark baselines were captured there, the size baseline records the split's output here and in SIZE AFTER SPLIT |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Per-mark line references are pre-split.** The 28 baseline rows cite communication.md line numbers at 4512473a, the retained instructions now sit higher in the shortened file, the wording and the carrier file are what the scan rechecks.
2. **The mechanics half inherits one checklist item.** Its sentence and word sections have none, and neither does the register section that stayed, the coverage note in the seam assignment records the gap.
<!-- /ANCHOR:limitations -->

---

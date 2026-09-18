---
title: "Implementation Summary: Answer the actual request — one home for the avoidance family"
description: "Six user-reported avoidance behaviors audited against the ruleset landed as one new repo rule, two router rows, and one sentence — so a warning nobody asked for, a quieter version of the ask, an invented constraint, a dressed-up refusal, and a stall dressed as diligence all read as the same failure."
trigger_phrases:
  - "implementation summary"
  - "agent avoidance anti-patterns"
  - "answer the actual request"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/012-agent-avoidance-anti-patterns"
    last_updated_at: "2026-09-18T08:45:00Z"
    last_updated_by: "devin"
    recent_action: "Authored the rule file, wired the router, amended §10, validated strict"
    next_safe_action: "Packet complete; commit when the operator is ready"
    blockers: []
    key_files:
      - "repo-rules/answer-the-actual-request.md"
      - "REPO RULES.md"
      - "repo-rules/evidence-and-proof.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-18-agents-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "New file vs amend existing: new file — the six behaviors are one failure family and get one home (this packet's own decision)"
      - "AGENTS.md untouched: root doc stays a router; umbrella mandates already exist (004 bloat-audit discipline)"
---
# Implementation Summary: Answer the actual request — one home for the avoidance family

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-agent-avoidance-anti-patterns |
| **Completed** | 2026-09-18 |
| **Level** | 2 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The pasted Reddit catalog turned out to describe one failure wearing six costumes: avoidance dressed as diligence or policy. The ruleset already punished fabricated *artifacts* and shrunken *scope*, but nobody owned fabricated *constraints*, swapped *questions*, or estimates used to *stall* — so a thirteenth repo rule now does, and the first answer to a request is either the real answer or a plainly-owned no.

### What the operator gains

Every behavior in the complaint now has a named home. Warnings must answer the ask or name a real failure. A swapped version of the request must be disclosed in the first lines. An invented rule, restriction or policy is fabrication — and one that shifts under pushback must be withdrawn, not patched. A refusal is legitimate only with its real reason. An unsolicited estimate can inform but never gate. And a "done" that becomes honest only under interrogation is a failed report the moment it is written.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `repo-rules/answer-the-actual-request.md` | Created | New rule file owning the family: §1 warnings answer the ask, §2 no silent reinterpretation, §3 invented constraints, §4 an honest no, §5 estimates inform never gate, §6 the first answer is the true one, §7–8 boundaries + self-check |
| `REPO RULES.md` | Modified | Trigger-table row (warn/narrow/cite/decline/estimate actions → the new file) and index row |
| `repo-rules/evidence-and-proof.md` | Modified | §10 close-out: the first report is the honest one — accuracy gained only under interrogation failed when written |
| `AGENTS.md` | Modified | §8: +1 routing sentence so the reply-facing trigger loads on read-only turns, where Gate 5 never fires (amended in review) |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` + 3 fixtures | Regenerated | Committed Gate 1 artifact so this packet is retrievable |
| `specs/agents/012-agent-avoidance-anti-patterns/*` | Created | Level 2 packet docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Audit first, then additive edits. All 14 governance files were read end-to-end and each anti-pattern mapped to a home or a gap in `spec.md` §3.5 before any edit. The new file was written to house structure (frontmatter → Fires when → The rule → numbered sections → what-this-is-not → self-check), each section cross-citing the existing file that owns its overlap rather than restating it. Verification: section grep on the new file, two-hit grep on `REPO RULES.md`, `interrogation` grep on §10, `git show HEAD:` negative controls returning 0, index regeneration exit 0, scoped `git status` review, and `validate.sh --strict` → `RESULT: PASSED`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One new rule file over five scattered amendments | The six behaviors are one failure — avoidance dressed as diligence. Splitting them across communication/scope/uncertainty/decisions files scatters one failure mode and creates five places to keep in sync; the repo-rule architecture's one-home principle settles it |
| `AGENTS.md` gets one §8 routing sentence, nothing more | The rule's trigger is reply-facing, and Gate 5 never fires on read-only turns — without the §8 pointer the rule was unreachable on exactly the turns the anti-patterns occur. The original "AGENTS.md untouched" decision was amended in review; everything else about the router discipline stands |
| Invented-constraint rule lives only in the new file | `uncertainty-and-honesty.md` §2 bans invented artifacts; extending its enumeration would create a second copy of the constraint ban. One home; recorded as an open question |
| Pattern 5 gets one sentence, not a section | `evidence-and-proof.md` §2/§9/§10 already owns the substance — command evidence, final-state proof, "what is not done". The gap was only the loop's name: the first report being untrue |
| `repo-rules/` stays out of the trigger-index corpus | Gate 5's trigger table is the designed discovery path for rule files; adding them to Gate 1's corpus is a separate retrieval-policy decision, deferred |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ls repo-rules/answer-the-actual-request.md` + `grep -n '^## '` | PASS — file exists; sections 1–8 all present |
| `grep -n 'answer-the-actual-request' "REPO RULES.md"` | PASS — 2 hits: trigger row line 47, index row line 67 |
| `grep -n 'interrogation' repo-rules/evidence-and-proof.md` | PASS — line 203 carries the first-report sentence |
| `grep -n 'answer-the-actual-request' AGENTS.md` | PASS — line 261 carries the §8 routing sentence; negative control `git show HEAD:AGENTS.md` → 0 |
| Negative control: `git show HEAD:` greps for new phrases | PASS — 0 hits in both pre-edit files |
| `generate-trigger-index.mjs` | PASS — exit 0, 27,278 docs scanned |
| `validate.sh --strict` on this packet | PASS — `RESULT: PASSED` |
| Scoped `git status` review | PASS — only declared files + index artifacts + packet changed; `.claude/settings.json` modification is pre-existing/runtime-managed, unrelated |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No runtime enforcement** — the rule binds through Gate 5's file load like every other repo rule; nothing mechanical forces a load on a runtime that skips the gate. Same standing as the rest of the tier.
2. **Comments not analyzed** — the Reddit thread is fetch-blocked; only the operator-pasted post text was audited. Comment-level signal (frequency, recency) is absent but the six shapes are self-described.
3. **Deferred widenings** — extending `uncertainty-and-honesty.md` §2's enumeration, adding `repo-rules/` to the index corpus, and a §12 self-check row in `evidence-and-proof.md` are recorded as open questions in `spec.md`, not done.
<!-- /ANCHOR:limitations -->

---

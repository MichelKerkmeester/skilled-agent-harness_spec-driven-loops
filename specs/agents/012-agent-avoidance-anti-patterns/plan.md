---
title: "Implementation Plan: Audit the agent behavior ruleset against six agent-avoidance anti-patterns and give the uncovered family one home"
description: "Audit-first doctrine change: one new repo-rules file owning the avoidance family, two router rows in REPO RULES.md, one sentence in evidence-and-proof.md §10. Additive only, no AGENTS.md touch."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Audit the agent behavior ruleset against six agent-avoidance anti-patterns and give the uncovered family one home

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown governance docs (AGENTS.md framework + repo-rules tier) |
| **Framework** | REPO RULES.md trigger-table router; Gate 5 load discipline |
| **Storage** | Files only; committed trigger-index.json artifact |
| **Testing** | `validate.sh --strict`; grep negative/positive controls; scoped `git status` |

### Overview
The audit in `spec.md` §3.5 already decided the shape: patterns 1–4 and 6 are one failure family (avoidance dressed as diligence or policy) with no single home, so the fix is one new rule file owning the family, wired into the `REPO RULES.md` router, plus one sentence in `evidence-and-proof.md` §10 naming the interrogation loop for pattern 5. Because the rule's trigger is reply-facing and Gate 5 never fires on read-only turns, `AGENTS.md` §8 also carries one routing sentence — the same mechanism the communication family uses. Everything else is additive; the root doc stays a router and the umbrella mandates already exist there.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` §2–§3)
- [x] Success criteria measurable (`spec.md` §5, `acceptance-criteria.md`)
- [x] Dependencies identified (full ruleset read; coverage map written)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
- [ ] Trigger index regenerated; packet retrievable by Gate 1
- [ ] Docs synchronized (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-tier governance: `AGENTS.md` holds hard blockers and gates; `REPO RULES.md` is a router that matches the *action being taken* to a rule file; each `repo-rules/*.md` owns one posture. New postures enter by adding a file plus two router rows — never by widening `AGENTS.md`.

### Key Components
- **`repo-rules/answer-the-actual-request.md`** (new): owns the family. Sections: §1 warnings answer the ask · §2 no silent reinterpretation · §3 invented constraints · §4 an honest no · §5 estimates inform, never gate · §6 the first answer is the true one · §7 what this rule is not · §8 self-check.
- **`REPO RULES.md`**: +1 trigger-table row (fires on warn/narrow/cite/decline/estimate actions), +1 index row.
- **`repo-rules/evidence-and-proof.md`** §10: +1 sentence — a report that becomes honest only under interrogation failed when it was written.

### Data Flow
Agent about to warn/narrow/cite/decline/estimate → Gate 5 loads `REPO RULES.md` → trigger row matches → `answer-the-actual-request.md` settles whether the move is honest → each section cross-cites the existing file that owns the overlapping rule.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-rules/answer-the-actual-request.md` | does not exist | create, house structure | `ls` + grep section headings |
| `REPO RULES.md` §2 trigger table | 12 rows | +1 row | `grep -n "answer-the-actual-request"` |
| `REPO RULES.md` §3 index | 12 rows | +1 row | same grep, second hit |
| `REPO RULES.md` §4 scope | "In: how to think and act, … honesty" | unchanged — new file fits existing scope | no §4 edit in diff |
| `repo-rules/evidence-and-proof.md` §10 | close-out rule | +1 sentence | `grep -n "interrogation"` |
| `AGENTS.md` §8 | reply-facing routing (communication family) | +1 routing sentence — the rule's trigger is reply-facing, Gate 5 never fires on read-only turns | `grep -n 'answer-the-actual-request' AGENTS.md` |
| `uncertainty-and-honesty.md` §2 | never-invent enumeration | unchanged — one home for invented constraints | not in diff |
| `trigger-index.json` | committed Gate 1 artifact | regenerate | generator exit 0 |

Required inventories:
- Same-class producers: `rg -l "invented|reinterpret|disclaimer|estimate" repo-rules/` — confirm no existing file already owns the family.
- Consumers of changed rows: none — router rows are additive; existing rows unaffected.
- Matrix axes: the six anti-patterns are the axes; each maps to a new-file section or an existing-coverage citation in `spec.md` §3.5.
- Invariant: no added line restates a rule another file owns; every overlap is a cross-cite.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs validate against level contract | `validate.sh --strict` → `RESULT: PASSED` |
| Retrieval | Packet discoverable by Gate 1 | `generate-trigger-index.mjs` exit 0 + `lookup-trigger-index.mjs` hit |
| Negative control | New phrases were absent pre-edit | `git show HEAD:<file>` grep returns 0 |
| Scoped diff | Only the five declared files changed | `git status --short` review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate.sh` + `generate-trigger-index.mjs` runtime | Internal | Green | Packet validity and retrievability unprovable |
| House style from the 12 existing rule files | Internal | Green — all read | New file would drift from house structure |
| Operator-supplied post text | External | Green — pasted in full | Audit source missing (fetch blocked) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any acceptance criterion unmet, or validation fails unrepairably
- **Procedure**: `git checkout -- "REPO RULES.md" repo-rules/evidence-and-proof.md` and `rm repo-rules/answer-the-actual-request.md`; revert the index with `git checkout -- .skilled/skills/system-spec-kit/runtime/data/trigger-index.json`. All changes are working-tree only — no history, no remote.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit) ──► Phase 2 (Write rule file + wire router + amend §10) ──► Phase 3 (Verify + validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit (coverage map) | None | Write |
| Write | Audit | Verify |
| Verify | Write | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Med — 14 files read end-to-end | done this session |
| Write | Low — ~130 new lines, 3 edited lines | short |
| Verify | Low — two commands + scoped diff | short |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes; no deployment; working-tree docs only
- [x] Rollback sentence written (§7)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

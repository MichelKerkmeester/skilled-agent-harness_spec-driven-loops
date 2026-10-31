---
title: "Feature Specification: Assess a proposed thinking discipline against AGENTS.md and the repo rules, and integrate what survives the repo-rule decision tests"
description: "A nine-point thinking discipline was proposed for the framework. Most of it is already law in uncertainty-and-honesty.md, evidence-and-proof.md and AGENTS.md; this packet maps each point, runs the four repo-rule decision tests, and records where the small new residue may go."
trigger_phrases:
  - "thinking discipline"
  - "assess a proposed thinking discipline against agents md"
  - "settled and reopened"
  - "reopen a settled conclusion"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Assess a proposed thinking discipline against AGENTS.md and the repo rules, and integrate what survives the repo-rule decision tests

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-07 |
| **Branch** | `scaffold/017-thinking-discipline` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator proposed a nine-point "Thinking discipline": check the request, finish one approach, stop after one check, doubt is not evidence, don't revise just to agree, new evidence reopens the case, verify against real checks, don't perform caution, and correct only material earlier errors. Adding it as written would duplicate rules the framework already has. Points 3 and 4 would also conflict with required final-state verification and with the contradiction halt.

### Purpose
Map every point to its existing home, then run the new residue through the four sk-create-repo-rule decision tests. Admit only what survives, at the narrowest home, and record the refusals.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-point coverage map with file:line citations (`research/research.md`).
- Two independent reviews: DeepSeek V4.1 Flash at max and GPT-6 Luna at max, fast tier (`research/reviews/`).
- Decision-test verdicts and recorded refusals.
- The integration the operator picked: a §7 section in `uncertainty-and-honesty.md`, its router phrase, and one AGENTS.md §3 line.
- Trimming AGENTS.md Gate 3 back under the 16 KB Devin prefix (operator-approved), so the rule-copies guard passes again.
- Making Devin load the checkout's own AGENTS.md (operator-approved): turn off its Claude import, give it a `.devin/skills` link so no skills are lost, and stop the mirror sync from pruning through that link.

### Out of Scope
- A new rule file. All three lenses refuse it on Tests 1, 3 and 4.
- Text for points 1 and 5–9, which are already covered.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/uncertainty-and-honesty.md` | Modify | New §7 SETTLED AND REOPENED, a Fires-when bullet, two trigger phrases, a self-check item, version 1.0.1.4 |
| `REPO RULES.md` | Modify | Trigger-row phrase for the new firing condition |
| `AGENTS.md` | Modify | One §3 Execution Behavior line pointing at §7, and Gate 3 options B and C plus two Gate 3 bullets trimmed by 123 bytes net |
| `.devin/config.json` | Create | `read_config_from.claude: false` |
| `.devin/skills` | Create | Symlink to `../.skilled/skills` |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Modify | Skip a symlinked `.devin/skills` parent when pruning orphans |
| `.devin/SYNC.md` | Modify | Document the skills link and the Claude-import switch |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every one of the nine points is mapped to an existing home or marked new | `research/research.md` §2 lists all nine with citations that resolve |
| REQ-002 | The new residue is put through all four decision tests | `research/research.md` §4 records a verdict per test |
| REQ-003 | No integration edit lands without the operator's choice | Nothing changed under `.skilled/repo-rules/`, `REPO RULES.md` or `AGENTS.md` before that choice |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Any admitted text keeps the carve-outs: contradiction halt, confidence bands, final-state proof, and operator's own calls | The section names all four |
| REQ-005 | Rule guards stay green after any edit | `check-repo-rules` and `check-rule-copies` exit 0, or any failure is shown to predate the edit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator can see in one place which points are already law and where.
- **SC-002**: Whatever lands is the smallest text that closes the residue, with no new numeric threshold and no new rule file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | "Stop after one check" read as skipping the final-state rerun | High | Carve-out names evidence-and-proof.md §9 and AGENTS.md FINAL-STATE VERIFICATION |
| Risk | "Doubt is not evidence" used to dismiss a real halt | Med | Carve-out names the contradiction halt and the <40% band |
| Risk | "Don't revise to agree" turns into refusing a correct operator correction | Med | Carve-out keeps the operator's reaffirm as their decision (uncertainty-and-honesty.md §3) |
| Dependency | Restraint test needs an observed failure | Med | Operator confirms or the residue is refused |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator confirmed the failure happens (Test 4 passes) and chose the rule section plus the AGENTS.md line.
<!-- /ANCHOR:questions -->

---

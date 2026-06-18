---
title: "Feature Specification: Distribute Fable 5 Operating Doctrine Across Spec-Kit Surfaces"
description: "external/Fable5.md is a distilled agent operating doctrine that lives outside the framework's enforced surfaces, so its verify-before-claim, claim-legibility, and blast-radius rules are not reliably applied. This packet absorbs that doctrine into the most reliable surfaces without bloating AGENTS.md."
trigger_phrases:
  - "fable 5"
  - "operating doctrine"
  - "claim legibility"
  - "blast radius"
  - "verify before completion"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/144-operate-like-fable-5"
    last_updated_at: "2026-06-14T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 spec docs for the Fable 5 distribution"
    next_safe_action: "Owner decides Barter git-posture contradiction"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md"
      - ".opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Barter ships main-branch-direct-push.md yet its AGENTS.md declares git read-only; owner must decide which prevails."
    answered_questions:
      - "Where should the Fable 5 doctrine land? Surgically across AGENTS.md, constitutional rules, and sk-code, not as a single AGENTS.md dump."
---
# Feature Specification: Distribute Fable 5 Operating Doctrine Across Spec-Kit Surfaces

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`external/Fable5.md` is a distilled agent operating doctrine — verify before you claim, make confirmed-vs-inferred claims legible, capture a baseline before "no regressions" and report the delta, treat a finding as a hypothesis until you open the cited code, stay in scope, name the rollback before irreversible or outward actions, and match effort to blast radius. The doctrine lives in an external note, so none of its rules are wired into the framework's enforced surfaces, and they are not reliably applied across agent work.

### Purpose
Absorb the Fable 5 doctrine into the framework's most reliable surfaces (AGENTS.md, constitutional rules, sk-code) so the rules are auto-surfaced and enforced, without bloating AGENTS.md past its line budget.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `Operating Discipline — Claim Legibility & Blast-Radius` subsection in §1 of the Public root `AGENTS.md` (and its byte-identical `CLAUDE.md` twin), cross-referencing the Four Laws and Completion Verification Rule rather than restating them.
- The same subsection in `Barter/ai-speckit/coder/AGENTS.md`, adapted to that surface's read-only-git posture.
- Two new constitutional rules in `.opencode/skills/system-spec-kit/constitutional/` (Public + Barter mirror): `regression-baseline-and-delta.md` and `finding-is-a-hypothesis.md`.
- A 5th "How to apply" bullet folded into the existing `main-branch-direct-push.md` constitutional rule covering non-git outward/irreversible actions.
- A "Baseline & blast-radius" line added to `sk-code/SKILL.md` after the Iron Law.

### Out of Scope
- sk-git embedding of the doctrine — already covered by sk-git rule #12 plus `commit_workflows.md`; adding it would duplicate.
- A direct hard-checklist edit to `orchestrate.md` §5 — superseded by the auto-surfacing `finding-is-a-hypothesis.md` rule, and `orchestrate.md` is three drifting mirrors making a direct edit drift-prone.
- A machine-checkable "shared evidence contract" wired into post-dispatch-validate — surfaced by the research as a larger follow-up, outside this packet's surgical scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` (Public root) | Modify | Add Operating Discipline subsection to §1 |
| `CLAUDE.md` (Public root) | Modify | Byte-identical auto-synced twin of AGENTS.md |
| `Barter/ai-speckit/coder/AGENTS.md` | Modify | Same subsection, read-only-git variant |
| `.opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md` | Create | Baseline-before-no-regressions rule (Public + Barter mirror) |
| `.opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md` | Create | Finding-is-a-hypothesis rule (Public + Barter mirror) |
| `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md` | Modify | Fold a 5th "How to apply" bullet for non-git outward/irreversible actions |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Add Baseline & blast-radius line after the Iron Law |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Public root `AGENTS.md` and `CLAUDE.md` stay byte-identical after the edit | `diff AGENTS.md CLAUDE.md` reports no difference |
| REQ-002 | Both Public `AGENTS.md` and Barter `AGENTS.md` stay under the ~500-line budget | Line counts: Public 446, Barter 467 |
| REQ-003 | The Operating Discipline subsection is present in all three AGENTS surfaces | grep finds the subsection heading in each file |
| REQ-004 | Two new constitutional rules are well-formed and present in Public and Barter | Files exist in both constitutional folders; rule format matches existing rules |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `main-branch-direct-push.md` covers non-git outward/irreversible actions | A 5th "How to apply" bullet names deploy/send/migrate/overwrite shared state with rollback-then-stop |
| REQ-006 | `sk-code/SKILL.md` carries the baseline/blast-radius discipline | A "Baseline & blast-radius" line follows the Iron Law |
| REQ-007 | Constitutional rules are re-indexed into spec-memory | Deferred: blocked by a pre-existing stale spec-memory dist; will index on the next daemon scan |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Fable 5 doctrine is enforced through auto-surfacing constitutional rules and the framework's most-read surfaces, not an external note.
- **SC-002**: No AGENTS.md surface exceeds its line budget and the Public AGENTS/CLAUDE pair stays byte-identical.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Auto-sync of `AGENTS.md` → `CLAUDE.md` and `.opencode` → `.claude` mirrors | Edits could drift between mirrors | Edit the source surface; verify byte-identical twin and mirrors after the sync |
| Risk | AGENTS.md bloat | Med | Cross-reference existing laws instead of restating; keep the subsection to 9 bullets / +14 lines |
| Risk | `orchestrate.md` triple-mirror drift if edited directly | Med | Rely on the auto-surfacing `finding-is-a-hypothesis.md` rule instead of a direct edit |
| Dependency | spec-memory dist for constitutional re-index | Low | Pre-existing stale dist; re-index deferred to the next daemon scan |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable change to agent runtime; this is documentation and policy text only.

### Security
- **NFR-S01**: New rules tighten safety posture (rollback-before-irreversible coverage extended to non-git outward actions); no secrets or credentials involved.

### Reliability
- **NFR-R01**: Public `AGENTS.md` ≡ `CLAUDE.md` byte-identical invariant must hold after every edit.
- **NFR-R02**: Constitutional rules must remain well-formed so the advisor can surface them.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: N/A — this is static policy text, not a runtime input path.
- Maximum length: AGENTS.md must stay under the ~500-line budget; folding rather than restating keeps it inside.
- Invalid format: A malformed constitutional rule would fail to surface; rule format is matched against existing rules in the same folder.

### Error Scenarios
- Mirror sync failure: if `CLAUDE.md` or `.claude` mirror does not match the source, the byte-identical check catches it before completion.
- Stale spec-memory dist: constitutional re-index is deferred rather than forced against a stale build.

### State Transitions
- Partial completion: each surface edit is independent; an incomplete run leaves the others valid and re-runnable.
- Pre-existing contradiction surfaced: Barter authorizes direct push via `main-branch-direct-push.md` while its AGENTS.md §1 declares git read-only; flagged for the owner rather than auto-resolved.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | ~5 files touched across two repos; +13/+13 lines in AGENTS surfaces, 2 new rule files, 2 small folds |
| Risk | 8/25 | Policy/doc only; main risk is mirror drift and budget overrun, both checkable |
| Research | 12/20 | Deep-research loop ran to convergence (5 iterations) to validate the surgical distribution and redundancy analysis |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Barter ships `main-branch-direct-push.md` (authorizes direct push) yet its `AGENTS.md` §1 declares git READ-ONLY. This pre-existing contradiction surfaced during this work and is flagged for the owner's decision; it was not auto-fixed.
- Should the larger machine-checkable "shared evidence contract" (claim_class / evidence / would_confirm / baseline / gate_delta / scope_state / child_result_verified, wired into post-dispatch-validate) be taken up as a follow-up packet?
<!-- /ANCHOR:questions -->

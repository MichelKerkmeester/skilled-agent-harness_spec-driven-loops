---
title: "Feature Specification: 075 cli-copilot Hallucination Caveat"
description: "Document P1-072-001 cli-copilot hallucination finding in cli-copilot/SKILL.md + sk-doc/SKILL.md. Two caveat blocks: when caller consumes routing-trace literally, prefer cli-codex."
trigger_phrases: ["075", "cli-copilot-hallucination-caveat", "P1-072-001 docs"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/013-cli-copilot-hallucination-caveat"
    last_updated_at: "2026-05-05T17:55:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Caveats shipped"
    next_safe_action: "Commit + push"
    blockers: []
    key_files:
      - .opencode/skills/cli-copilot/SKILL.md
      - .opencode/skills/sk-doc/SKILL.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "075-final"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 075 cli-copilot Hallucination Caveat

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Predecessor** | 072 review-report-v2 (P1-072-001 finding) |
| **Successor** | None |
| **Handoff Criteria** | Both caveats land in cli-copilot SKILL.md + sk-doc SKILL.md; one commit + push |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 072's review-report-v2.md surfaced P1-072-001: cli-copilot (claude-opus-4.7) HALLUCINATES sk-doc resource paths — citing files like `dqi_rubric.md` that don't exist in sk-doc's filesystem. cli-copilot scored 11.1% resource-accuracy vs cli-codex 66.7% on the 071 stress matrix. Maintainers and downstream consumers had no documentation warning about this behavior; if a caller naively `Read()`s cited paths, they'll get ENOENT errors.

### Purpose
Add caveat blocks in two surfaces where future consumers will look:
1. cli-copilot/SKILL.md §1 "When NOT to Use" — call out the hallucination pattern in the skill's primary discoverability surface
2. sk-doc/SKILL.md §2 "Resource Domains" — add a cross-CLI consumption note with the empirical accuracy numbers + recommendation to prefer cli-codex
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add caveat to `.opencode/skills/cli-copilot/SKILL.md` §1 "When NOT to Use" referencing 071/072 data + cli-codex preference
- Add cross-CLI consumption note to `.opencode/skills/sk-doc/SKILL.md` §2 "Resource Domains" with the per-CLI accuracy table summary
- Both caveats reference review-report-v2.md for the full evidence trail

### Out of Scope
- cli-copilot README.md (SKILL.md is the AI-loaded surface; README is for maintainers — not the discovery path for the caveat)
- Other cli-* skill READMEs (codex/opencode/gemini/claude-code don't have the hallucination behavior)
- Code changes (caveat is doc-only)
- Re-running matrix to extend evidence (072 already has the data)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-copilot/SKILL.md` | Modify | Append caveat bullet to "When NOT to Use" section |
| `.opencode/skills/sk-doc/SKILL.md` | Modify | Insert cross-CLI consumption note in §2 Resource Domains |
| `075/{spec,plan,tasks,implementation-summary}.md` | Create | Spec docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Caveat in cli-copilot/SKILL.md "When NOT to Use" | grep "Routing-trace tasks where the caller" returns >=1 |
| REQ-002 | Cross-CLI consumption note in sk-doc/SKILL.md §2 | grep "Cross-CLI consumption note" returns >=1 |
| REQ-003 | Both caveats reference review-report-v2.md or 071/072 data | grep "071/072\|review-report-v2" in both files |
| REQ-004 | One commit on main + pushed | `git push origin main` exit 0 |
| REQ-005 | validate.sh --strict on 075 exits 0 | Validator returns 0/0 |
| REQ-006 | No code changes outside the 2 SKILL.md files + 075 docs | git diff shows only SKILL.md and 075/ |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Caveat cites the empirical accuracy numbers (66.7% / 47.2% / 11.1%) | grep returns the numbers in either caveat |
| REQ-008 | Caveat names cli-codex (gpt-5.5/high/fast) as preferred default | grep "cli-codex" + "gpt-5.5" in both caveats |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both caveats shipped + pushed
- **SC-002**: Future maintainers reading cli-copilot SKILL.md or sk-doc SKILL.md see the hallucination caveat with cited evidence

### Given/When/Then Verification Scenarios

**Given** cli-copilot/SKILL.md has the new caveat, **When** an AI agent loads the skill, **Then** it sees the "When NOT to Use" section flagging routing-trace consumption with cli-codex preference.

**Given** sk-doc/SKILL.md §2 has the cross-CLI consumption note, **When** an AI agent loads sk-doc, **Then** it sees the per-CLI accuracy table summary with cli-codex preference.

**Given** both caveats reference review-report-v2.md, **When** a maintainer wants to verify the claim, **Then** they can follow the path to the empirical data.

**Given** both caveats name specific accuracy numbers, **When** consumers compare CLIs, **Then** they have empirical grounding (not just opinion).

**Given** the changes committed, **When** running `git push origin main`, **Then** push succeeds.

**Given** validate.sh --strict on 075, **When** running, **Then** 0 errors and 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Caveat becomes stale if cli-copilot improves | Low | Caveat cites packet 072 data; future packets that re-test can update |
| Risk | Maintainer overreads caveat as blanket "don't use cli-copilot" | Low | Caveat is scoped to "routing-trace tasks where caller consumes paths LITERALLY" |
| Dependency | 072 review-report-v2.md still exists at the cited path | Green |  |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

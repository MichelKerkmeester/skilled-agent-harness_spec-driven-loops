# Feature Specification: README Human Voice Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

All ~77 README files in the .opencode/ public release repo use AI-detectable writing patterns (em dashes, semicolons, Oxford commas, banned vocabulary). This project applies Human Voice Rules (HVR) from the Barter ecosystem to every README, updates the workflows-documentation skill to enforce HVR permanently, and establishes an anchor tag policy across all files.

**Key Decisions**: Adopt HVR as permanent documentation standard, remove anchor tags from all READMEs except system-spec-kit/README.md

**Critical Dependencies**: HVR reference rules from Barter ecosystem, workflows-documentation skill files

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-15 |
| **Branch** | `013-readme-human-voice-alignment` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
README files across the .opencode/ public release repo contain AI-detectable writing patterns. Em dashes, semicolons, Oxford commas, overused vocabulary (leverage, robust, seamless, utilize), and formulaic sentence structures make the documentation read like machine-generated text. This undermines the credibility and voice consistency of the public release.

### Purpose
Every README in the public release passes HVR checks with zero em dashes, zero semicolons, zero banned words, and consistent active voice throughout. The workflows-documentation skill enforces these rules for all future documentation.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply HVR to all ~77 README.md files under .opencode/
- Update workflows-documentation skill to integrate HVR as permanent standard
- Priority-align system-spec-kit/README.md and mcp_server/README.md with root README style
- Enforce anchor tag policy: only system-spec-kit/README.md keeps anchors, all others stripped
- Create decision record for adopting HVR permanently

### Out of Scope
- Non-README markdown files (spec.md, plan.md, SKILL.md, etc.) - separate effort
- Content restructuring or information changes within READMEs - voice only
- Translation or localization of any content
- Changes to the Barter ecosystem HVR source rules

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/**/README.md (~77 files) | Modify | Apply HVR: remove em dashes, semicolons, Oxford commas, banned words |
| .opencode/skill/workflows-documentation/SKILL.md | Modify | Add HVR enforcement section |
| .opencode/skill/workflows-documentation/references/*.md | Modify | Integrate HVR rules into writing standards |
| .opencode/skill/system-spec-kit/README.md | Modify | Priority alignment with root README style, keep anchors |
| .opencode/mcp_server/README.md | Modify | Priority alignment with root README style, strip anchors |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero em dashes in all README files | `grep -r '—' .opencode/**/README.md` returns 0 results |
| REQ-002 | Zero semicolons in all README files | `grep -r ';' .opencode/**/README.md` returns 0 results (excluding code blocks) |
| REQ-003 | Zero banned words remaining | No instances of: leverage, robust, seamless, utilize, comprehensive, cutting-edge, innovative, streamline, facilitate, empower, holistic, synergy, paradigm, ecosystem (when used as buzzword) |
| REQ-004 | workflows-documentation skill updated | HVR rules integrated as permanent writing standard |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Oxford commas eliminated | No serial commas before "and"/"or" in lists |
| REQ-006 | Active voice throughout | Passive constructions replaced with direct address |
| REQ-007 | Anchor tag policy enforced | Only system-spec-kit/README.md retains anchor tags; all others stripped |
| REQ-008 | No exactly-3-item inline lists | Rewrite any "X, Y, and Z" patterns |
| REQ-009 | system-spec-kit/README.md and mcp_server/README.md style-aligned | Match root README voice and structure |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All ~77 README files pass automated HVR grep checks (zero em dashes, semicolons, banned words)
- **SC-002**: workflows-documentation skill contains HVR section that future documentation must follow
- **SC-003**: Manual spot-check of 5 random READMEs shows natural, human-sounding prose
- **SC-004**: Anchor tags present only in system-spec-kit/README.md

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | HVR reference rules (Barter ecosystem) | Cannot apply rules without source | Rules already documented, copy into spec |
| Risk | Meaning drift during rewrites | Med | Review each file for semantic accuracy after HVR pass |
| Risk | Code examples containing semicolons flagged as violations | Low | Exclude fenced code blocks from checks |
| Risk | Parallel agent batches creating merge conflicts | Med | Sequential git commits per wave, not per agent |
| Risk | Over-correction making prose awkward | Med | Spot-check 5 random files after each wave |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each agent batch processes 4 files in under 15 minutes

### Quality
- **NFR-Q01**: No information loss during voice rewrites. Content meaning preserved exactly.

### Consistency
- **NFR-C01**: All 77 READMEs use the same voice, vocabulary, and punctuation standards after completion

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- README files with zero prose (only tables/code): Apply HVR to table headers and descriptions only
- README files with inline code containing semicolons: Skip code spans and fenced blocks

### Error Scenarios
- Agent dispatch fails mid-wave: Resume from last committed file, do not re-process completed files
- Banned word appears in a proper noun or project name: Exempt proper nouns (document exemptions)

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: ~77, LOC: ~27,000, Systems: 2 (READMEs + skill) |
| Risk | 10/25 | Auth: N, API: N, Breaking: N, Meaning drift: Y |
| Research | 5/20 | HVR rules already defined, minimal investigation |
| Multi-Agent | 12/15 | 4-file parallel batches across 4+ waves |
| Coordination | 10/15 | Sequential commits, anchor policy coordination |
| **Total** | **59/100** | **Level 3** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Meaning changes during rewrite | H | M | Semantic review after each wave |
| R-002 | Merge conflicts from parallel work | M | M | Sequential commits per wave |
| R-003 | Missed banned words in edge cases | L | M | Automated grep verification pass |
| R-004 | Code block semicolons flagged | L | H | Exclude fenced code from checks |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Clean README Voice (Priority: P0)

**As a** developer reading .opencode/ documentation, **I want** READMEs written in clear, direct, human-sounding prose, **so that** the documentation feels trustworthy and does not read like AI-generated text.

**Acceptance Criteria**:
1. Given any README in .opencode/, When I read it, Then I find zero em dashes, semicolons, or banned vocabulary
2. Given any README, When I check the writing style, Then all sentences use active voice and direct address

---

### US-002: Permanent HVR Standard (Priority: P1)

**As a** contributor writing new documentation, **I want** HVR rules integrated into the workflows-documentation skill, **so that** all future READMEs automatically follow the same voice standard.

**Acceptance Criteria**:
1. Given the workflows-documentation skill, When I load it for writing, Then HVR rules appear as mandatory checks
2. Given a new README being written, When the skill is active, Then the output passes all HVR checks

---

### US-003: Consistent Anchor Policy (Priority: P1)

**As a** maintainer of the .opencode/ repo, **I want** anchor tags only in system-spec-kit/README.md, **so that** other READMEs stay clean and anchor management is centralized.

**Acceptance Criteria**:
1. Given system-spec-kit/README.md, When I check for anchors, Then they are present and functional
2. Given any other README, When I check for anchors, Then none exist

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. HVR rules are fully defined and the scope is clear.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC - README Human Voice Alignment
~77 README files + workflows-documentation skill
HVR adoption as permanent standard
-->

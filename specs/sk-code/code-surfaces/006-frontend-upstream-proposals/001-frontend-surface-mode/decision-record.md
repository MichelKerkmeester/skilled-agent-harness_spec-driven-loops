---
title: "Decision Record: Phase 1: frontend-surface-mode"
description: "Decisions for the sk-code-frontend surface: canonical sk-code carries stack-agnostic React Native practice next to the web layer."
trigger_phrases:
  - "frontend surface decision record"
  - "react native in canonical sk-code"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/006-frontend-upstream-proposals/001-frontend-surface-mode"
    last_updated_at: "2026-11-03T10:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the operator's React Native ruling"
    next_safe_action: "Build the packet per tasks T004 to T013"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Ship web and native stack layers in canonical sk-code (operator, 2026-11-03)."
---
# Decision Record: Phase 1: frontend-surface-mode

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Canonical sk-code carries stack-agnostic React Native practice

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded by `007-web-only-frontend/decision-record.md` ADR-001 (operator, 2026-11-03) |
| **Date** | 2026-11-03 |
| **Deciders** | Operator (Michel Kerkmeester) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`sk-code/ROUTER.md:171` said canonical sk-code must not load React Native resources because those surfaces live in the Barter sk-code fork. Proposal rank 1 ships a React Native stack layer and five native topic files in the new `sk-code-frontend` surface. The two could not both hold.

### Constraints

- The native files must carry no Barter value: no Expo version gate, no Barter tokens and no Barter repository mode.
- The Barter fork keeps its project-specific React Native surfaces, so the sentence is narrowed, not removed.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: ship both the web and the native stack layers in `sk-code-frontend`, and amend the `ROUTER.md` section 6 sentence so canonical sk-code owns stack-agnostic React Native practice while project React Native surfaces stay in a project fork.

**How it works**: The native stack layer and the five native topic files are ported with Barter values removed. The section 6 sentence names `sk-code-frontend` as the owner of stack-agnostic frontend practice, web and native.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Web and native** | One frontend surface for both stacks; Barter can overlay both | Larger port; the section 6 sentence changes | 8/10 |
| Web only | No change to section 6; smaller port | Native practice stays Barter-only, so a non-Barter React Native repository gets nothing | 5/10 |

**Why this one**: The operator chose it, and the native practice is stack-agnostic once the Barter values are gone.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Any React Native repository gets the native layer, not only Barter's.
- Barter's eight frontend modes can overlay one upstream surface for both stacks.

**What it costs**:
- Five more files to port and keep free of Barter values. Mitigation: the REQ-004 grep covers them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A native phrase pulls Barter-fork prompts | M | Multi-word phrases only, and reach on three hubs |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Section 6 contradicted rank 1 as written |
| 2 | **Beyond Local Maxima?** | PASS | Web-only was offered and rejected |
| 3 | **Sufficient?** | PASS | One sentence changes; nothing else in the hub |
| 4 | **Fits Goal?** | PASS | The parent goal asks for a stack-agnostic surface |
| 5 | **Open Horizons?** | PASS | A project fork can still own its own native surfaces |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `sk-code-frontend/references/` gains the native stack layer and five native topic files.
- `sk-code/ROUTER.md` section 6 names `sk-code-frontend` as the owner of stack-agnostic web and native practice.

**How to roll back**: `git revert` the phase commit; the section 6 sentence and the native files go together.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Web and native | Recommended option, chosen by the operator | `sk-code/ROUTER.md:171` as written | ADR-001, REQ-010 |
| Q002 | Push at each phase end | Operator approval for this branch for the rest of the goal | - | Parent goal D5 |
| Q003 | Normal sk-git-skilled flow | The Barter no-commit rule does not bind Skilled work | The Barter no-commit rule | Parent goal D5 |
| Q004 | Wait for 12:26 | Keep the build executor when codex quota runs out; never re-route | - | Parent goal D6 |
| Q005 | Builds run on DeepSeek V4.1 Flash max via opencode-go | The operator switched the build executor rather than wait for codex quota | Q004, and the build half of parent goal D6 | Parent goal D6 (amendment pending) |
| Q006 | Amend REQ-006 | web-features Baseline covers web features only, so native topic files name the React Native version they were checked against | REQ-006 and AC-006 as first written | REQ-006, AC-006 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

- **Q001** asked whether phase 001 ships web and native or web only. Options: "Web and native (Recommended)", "Web only". Answer: "Web and native (Recommended)".
- **Q002** asked whether to push `worktrees/314-frontend-upstream-proposals` to origin. Options: "Push at each phase end", "Keep local for now". Answer: "Push at each phase end".
- **Q003** asked whether the Barter no-commit rule binds this Skilled work. Answer: "Normal sk-git-skilled flow".
- **Q004** asked how phase 001 continues after codex hit its usage limit. Options: "Wait for 12:26 (Recommended)", "Finish in this session". Answer: "Wait for 12:26 (Recommended)".
- **Q005** was given unprompted after Q004: "Use deepseek v4.1 flash max opencode go". The live route is `opencode-go/deepseek-v4.1-flash#max` on OpenCode 2.1.4; a one-turn smoke run replied `OK`.
- **Q006** was a Logic-Sync question: REQ-006 required a Baseline citation in every topic file, but the native files cite React Native 0.83. Options: "Amend REQ-006 (Recommended)", "Keep REQ-006 as written". Answer: "Amend REQ-006 (Recommended)".
<!-- /ANCHOR:operator-answers-verbatim -->

---

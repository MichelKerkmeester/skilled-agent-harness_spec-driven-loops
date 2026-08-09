---
title: "Doc-Template and Code-README Alignment"
description: "Rewrite both CHANGES-FROM-UPSTREAM.md files in the sk-doc general-README shape, add a sk-doc code-folder README to every folder of code added by this packet's work, and align that code against sk-code-opencode's TypeScript standards."
trigger_phrases:
  - "changes from upstream readme shape"
  - "code folder readme deep-pi"
  - "code folder readme pi-cache-optimizer"
  - "sk-code opencode alignment"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/010-doc-template-and-code-readme-alignment"
    last_updated_at: "2026-08-09T06:00:25Z"
    last_updated_by: "spec-author"
    recent_action: "Round 3 (2 fresh gpt-5.6-luna agents, pi-cache-optimizer + shared) fact-checked; all green"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3: new child 010 under 039, sibling to 009 — 009 is Complete and its scope stays frozen."
      - "User feedback: Round 1 GLM pass was too conservative (no comments). Round 2 used 4 fresh gpt-5.6-luna agents loading sk-code themselves, covering comments and structure."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Doc-Template and Code-README Alignment

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Created** | 2026-08-08 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 009-fork-attribution-and-changelog |
| **Successor** | 011-research-non-deepseek-optimization |

### Phase Context

009 shipped both `CHANGES-FROM-UPSTREAM.md` files as ad-hoc prose (no sk-doc template). This phase brings them onto an sk-doc template, adds a code-folder README to every folder this packet's own work added code to, and checks that code against sk-code's TypeScript standards. 009 stays Complete and frozen; this is new, distinct scope.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Both `CHANGES-FROM-UPSTREAM.md` files were authored as free-form prose sections (Upstream / What Changed / Why / Verification) without following any `sk-doc` document template, so they read differently from every other authored doc in this repo. Separately, this packet's work (phases 006 and 008) added 9 folders of real code and tests — `deep-pi/{benchmarks,extensions,extensions/deeppi,scripts,tests}`, `pi-cache-optimizer/{tests,types}`, `shared`, `shared/composition` — none of which has a code-folder README, so a developer landing in any of them has no local orientation. The code itself has never been checked against this repo's own `sk-code` TypeScript standards (it was written to make tests pass, not against a style guide).

### Purpose

Bring both changes documents onto the `sk-doc` general-README template shape (Section 5 of `sk-create-readme`), author a code-folder README (Section 6 shape) for every folder enumerated above from real file evidence, and align the touched TypeScript/JavaScript source against `sk-code-opencode`'s TypeScript standards (style guide, quality standards, universal patterns) — fixing real deviations, not cosmetic churn.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` and `.pi/extensions/deep-pi/CHANGES-FROM-UPSTREAM.md` using the `sk-doc` general-README output shape (numbered ALL-CAPS H2 sections, `---` separators, no ToC, no anchor comments), keeping every fact already fact-checked in 009 — this is a format change, not a content re-investigation.
- Author a code-folder README (`sk-doc` Section 6 shape) in each of these 9 folders, from the real file listing already gathered:
  - `.pi/extensions/deep-pi/benchmarks/`
  - `.pi/extensions/deep-pi/extensions/`
  - `.pi/extensions/deep-pi/extensions/deeppi/`
  - `.pi/extensions/deep-pi/scripts/`
  - `.pi/extensions/deep-pi/tests/`
  - `.pi/extensions/pi-cache-optimizer/tests/`
  - `.pi/extensions/pi-cache-optimizer/types/`
  - `.pi/extensions/shared/`
  - `.pi/extensions/shared/composition/`
- Audit the TypeScript/JavaScript files this packet's own work added or modified against `sk-code-opencode`'s TypeScript standards (naming, formatting, type system, TSDoc, async/error handling, universal code-organization patterns) and fix real, confirmed deviations.

### Out of Scope

- The two extension-root project READMEs (`deep-pi/README.md`, `pi-cache-optimizer/README.md`) — already correct general-README shape from 009, untouched here.
- Re-investigating or re-verifying any fact already fact-checked in 009 — this phase changes format and code style, not the underlying claims.
- Any folder or file this packet's work did not add or touch (no repo-wide code-readme sweep, no repo-wide style pass).
- Behavior changes. Style/standards fixes must not change what the code does; if a standards fix would change behavior, it is flagged, not silently applied.

### Files to Change

- `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` (rewrite)
- `.pi/extensions/deep-pi/CHANGES-FROM-UPSTREAM.md` (rewrite)
- `README.md` created in each of the 9 folders listed above
- Style/standards fixes inside the TypeScript/JavaScript files this packet added or modified (see Evidence Record in `tasks.md` for the exact file list)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both `CHANGES-FROM-UPSTREAM.md` files follow the `sk-doc` general-README shape | Numbered ALL-CAPS H2 sections, `---` between them, no ToC, no anchor comments; every fact from the 009 version is preserved, none invented |
| REQ-002 | All 9 enumerated folders have a code-folder README | Each follows the Section 6 shape (Overview, Directory Tree or flat file table per the subdirectory-count rule, Key Files, Entrypoints, Validation, Related as applicable); no invented commands or capabilities |
| REQ-003 | TypeScript/JavaScript standards audit produces real, cited findings | Each finding cites the exact file/line and the exact standard it violates; each fix is verified not to change behavior (tests still pass) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Both forks' full test suites and typechecks still pass after any code changes | `npm test` and `npm run typecheck` exit 0 in both `deep-pi` and `pi-cache-optimizer` from the final state |
| REQ-005 | No stray files from the dispatch | `git status --porcelain` across both extension directories shows only the intended additions/edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Both changes documents read as `sk-doc`-shaped documents; all 9 code-folder READMEs exist and pass the sk-doc pre-publish checks; every code-standards fix is a real, cited, behavior-preserving change.
- `npm test` and `npm run typecheck` pass in both forks from the final state; `validate.sh --recursive --strict` still passes across the whole `039` packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk/Dependency | Type | Mitigation |
|---|---|---|
| A dispatched code-standards fix silently changes behavior | Correctness | Full test suite re-run after every code change; any fix that fails a test is reverted, not force-applied |
| A code-folder README invents a capability or command not in the real source | Quality | Every drafted README fact-checked against the real file listing and source content before being applied |
| Devin's `-p` mode is a single non-interactive turn across a large, multi-file task | Execution | Scope is bounded to a concrete, pre-enumerated file/folder list handed to the dispatch, not an open-ended discovery task |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Predecessor**: `../009-fork-attribution-and-changelog/spec.md` (the content this phase re-shapes)
- **Depends on**: `.opencode/skills/sk-doc/sk-create-readme/SKILL.md` (general-README and code-folder README shapes), `.opencode/skills/sk-code/sk-code-opencode/SKILL.md` (TypeScript standards)

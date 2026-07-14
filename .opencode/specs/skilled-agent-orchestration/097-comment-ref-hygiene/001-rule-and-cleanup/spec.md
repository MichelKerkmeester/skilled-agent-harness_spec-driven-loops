---
title: "Feature Specification: Forbid ephemeral-artifact references in code comments"
description: "AI-written inline comments embed pointers to spec folders, packet/phase numbers, feature-catalog entries, and ADR/task ids that get renamed or archived, leaving dangling references. sk-code must forbid this and existing offenders in deep/system skills must be cleaned."
trigger_phrases:
  - "comment hygiene"
  - "ephemeral artifact references"
  - "spec folder references in comments"
  - "feature catalog references"
  - "sk-code comment rule"
  - "no stale references"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/097-comment-ref-hygiene/001-rule-and-cleanup"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Packet complete; cleanup sweep zero"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/universal/code_style_guide.md"
      - ".opencode/skills/sk-code/references/opencode/shared/universal_patterns.md"
      - ".opencode/skills/sk-code/references/webflow/shared/cross_language_rules.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000119"
      session_id: "119-comment-ref-hygiene-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Rule scope: Broad + revise §4 (forbid spec/packet/phase/feature-catalog/ADR/T###/REQ###/CHK### in comments)"
      - "Executor: CLI-CODEX/gpt-5.5 (Devin's scope-drift was a misdiagnosed concurrent-agent collision)"
      - "Spec folder: new Level 3 with decision-record.md"
      - "Code locations: comments only (Bucket A); leave functional literals (B) and test fixtures (C)"
---
# Feature Specification: Forbid ephemeral-artifact references in code comments

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

AI assistants routinely embed pointers to ephemeral tracking artifacts — spec folders, packet/phase numbers, feature-catalog entries, ADR ids, and task/checklist ids — directly into inline code comments. Those artifacts get renamed, renumbered, or archived while the code lives on, so the comment rots into a dangling, misleading pointer. This packet adds a durable rule to the `sk-code` skill (covering both the OpenCode and Webflow surfaces) that forbids the practice, reconciles the existing sk-code guidance that currently *teaches* it, and cleans the existing offenders out of the deep and system skills' source-code comments.

**Key Decisions**: Broad rule scope with an aggressive §4 revision; comments-only cleanup that never touches functional path literals or test fixtures; CLI-DEVIN (SWE-1.6) executes edits while CLI-CODEX (gpt-5.5) reviews each chunk.

**Critical Dependencies**: `sk-code` reference docs; CLI-DEVIN + CLI-CODEX availability; per-skill compile/test suites for the green-gate.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Phase Parent — root complete; 001-active-enforcement-layer in progress |
| **Created** | 2026-05-27 |
| **Branch** | `119-comment-ref-hygiene` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Inline code comments across the deep and system skills name specific ephemeral artifacts (`// Phase 002 T011: ...`, `// ADR-004: ...`, `feature_catalog/...`). When those spec folders / catalog entries are renamed, archived, or deleted, the comments become dangling pointers that mislead readers and erode trust in every other comment. Worse, `sk-code` — the skill that governs all code work — actively recommends this pattern (its OpenCode §4 teaches `T###`/`REQ-###`/`CHK-###` comment prefixes), so new code keeps reintroducing it.

### Purpose
Comments capture the durable WHY (constraint, decision, invariant) and never the perishable artifact label — enforced by an `sk-code` rule and proven by removing existing offenders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A canonical "no ephemeral-artifact pointers in comments" rule in the sk-code universal layer, inherited by both surfaces.
- An aggressive revision of the OpenCode `§4 REFERENCE COMMENT PATTERNS` guidance that currently contradicts the rule, plus reconciliation of all echo sites.
- A Webflow-surface pointer to the canonical rule.
- A comments-only cleanup of existing ephemeral references in the source code of the deep and system skills (~135 Bucket-A sites).

### Out of Scope
- Functional string literals the engine executes (`.opencode/specs/` path constants, globs, SQL patterns) — they are structural, not stale; editing them breaks the spec/memory engine.
- Test fixtures / assertions (fake spec folders that cannot go stale) — editing them breaks tests.
- Markdown docs, `feature_catalog/**`, `manual_testing_playbook/**`, and templates — documentation, not code comments.
- The `cli-*` and `sk-*` skills (not "deep" or "system" skills; out of the user's stated cleanup scope).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/references/universal/code_style_guide.md` | Modify | Canonical rule + fix `#1234` example |
| `.opencode/skills/sk-code/references/universal/code_quality_standards.md` | Modify | P0 mirror of the rule |
| `.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md` | Modify | Aggressive §4 revision + §3/§7 example fixes |
| `.opencode/skills/sk-code/references/webflow/shared/cross_language_rules.md` | Modify | Webflow pointer to canonical rule |
| `.opencode/skills/sk-code/references/opencode/{javascript,typescript,python,shell}/style_guide.md` | Modify | Echo-site reconciliation |
| `.opencode/skills/sk-code/references/opencode/config/quality_standards.md` | Modify | Remove contradictory P2 `REQ-###` recommendation |
| `.opencode/skills/{deep-agent-improvement,system-code-graph,system-skill-advisor,system-spec-kit}/**` | Modify | Comments-only cleanup (~135 sites) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonical rule exists in the sk-code universal layer and is reachable from both surfaces | Rule subsection present in `code_style_guide.md`; pointers from OpenCode and Webflow surface docs |
| REQ-002 | No sk-code reference file still recommends embedding spec-folder-internal pointers in comments | grep of sk-code refs finds zero `T###`/`REQ-###`/`CHK-###` *recommendations*; §4 revised |
| REQ-003 | Cleanup edits comments ONLY; no functional literal or test fixture changed | Per-chunk `git diff` shows changes only inside comment syntax; Bucket-B/C untouched |
| REQ-004 | Every touched skill's compile + test suite stays green | typecheck/lint/test pass per skill after each chunk and at the end |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Zero Bucket-A ephemeral pointers remain in cleaned skills | Completeness ripgrep restricted to comment lines returns zero |
| REQ-006 | Decision record captures the policy + the aggressive-revision choice | `decision-record.md` ADRs accepted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future AI writing code under sk-code is instructed not to embed ephemeral-artifact pointers in comments, with an allowed-vs-forbidden table and examples.
- **SC-002**: The deep and system skills contain no ephemeral-artifact pointers in inline comments, and all their test suites pass unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing a Bucket-B functional literal (`.opencode/specs/` path/glob) | High — silently breaks the spec/memory engine | Comments-only hard fence + explicit DO-NOT-TOUCH list + per-chunk compile/test gate + Codex diff audit + per-chunk revertible commits |
| Risk | Dangling prose after a pointer is removed | Low — cosmetic | Rule A rephrase / Rule B whole-line delete; Codex checks remaining comments read cleanly |
| Risk | Small-model scope drift | Med | 1–3 files/chunk within budget; allowed-writes list; validation phase on tiny skills first |
| Dependency | CLI-DEVIN (SWE-1.6) + CLI-CODEX (gpt-5.5) | Cleanup blocked if unavailable | Verify `devin auth status` / `codex` install before dispatch |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime behavior change — comment-only edits and doc edits carry zero performance impact.

### Security
- **NFR-S01**: Stable security references (`CWE-###`) are explicitly preserved by the rule and the cleanup; security context in comments must not be lost.

### Reliability
- **NFR-R01**: Each cleanup chunk leaves the touched skill's test suite green; any red reverts the chunk.

---

## 8. EDGE CASES

### Data Boundaries
- Comment that is *only* a pointer with no durable meaning: delete the whole comment line (Rule B).
- Comment mixing a forbidden instance ref with a stable standard (CWE/POSIX): keep the stable part (Rule C).

### Error Scenarios
- A pointer appears inside a quoted string within a comment (JSDoc `@example`): treat as a string literal → leave it.
- A ref looks like a spec reference but is a functional path constant/glob/SQL pattern: leave it (Bucket B).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: ~80, sites: ~135 comments + ~10 sk-code docs, Systems: 4 skills + sk-code |
| Risk | 20/25 | Auth: N, API: N, Breaking: only if a Bucket-B literal is touched |
| Research | 8/20 | Inventory + bucket classification already complete |
| Multi-Agent | 12/15 | CLI-DEVIN executor + CLI-CODEX reviewer per chunk |
| Coordination | 10/15 | Strict single-process dispatch loop across ~23-26 chunks |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Cleanup edits a `.opencode/specs/` functional literal | H | L | Comments-only fence + DO-NOT-TOUCH list + green-gate + Codex audit |
| R-002 | Rule still self-contradicts after partial reconciliation | M | L | Aggressive §4 revision + full echo-site sweep (REQ-002) |
| R-003 | Lost security/standard context during a Rule C edit | M | L | Rule C explicitly preserves CWE/POSIX/RFC; Codex checks |

---

## 11. USER STORIES

### US-001: Durable comments (Priority: P0)

**As a** future maintainer, **I want** comments to explain the durable WHY, **so that** an archived spec folder never leaves me chasing a dead pointer.

**Acceptance Criteria**:
1. Given a comment that named a now-archived packet, When the cleanup runs, Then the comment states the reasoning without the packet label (or is removed if it added nothing).

### US-002: Self-consistent guidance (Priority: P1)

**As an** AI working under sk-code, **I want** the skill to forbid ephemeral pointers and not recommend them elsewhere, **so that** I do not reintroduce the anti-pattern.

**Acceptance Criteria**:
1. Given the sk-code references, When I read the comment-convention sections, Then they forbid ephemeral pointers and contain no contradicting `T###`/`REQ-###`/`CHK-###` recommendation.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None — all four scoping questions were answered before implementation (see frontmatter `answered_questions`).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

## PHASE MAP

> **Phase-parent note**: This packet became a phase parent on 2026-05-29 when the original implementation (now the root) proved insufficient — text rules alone do not prevent violations during long sessions. The active enforcement layer (Phase 001) builds the hook and gate infrastructure that makes the rule stick.

| Phase | Title | Status |
|-------|-------|--------|
| (root) | Rule + cleanup — sk-code §4 + Bucket-A sweep | Complete |
| `001-active-enforcement-layer/` | Write-time hooks, pre-commit gate, checker script, CLAUDE.md, constitutional memory | In Progress |

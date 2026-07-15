---
title: "Implementation Plan: Phase 4: Release and Program Cleanup [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-release-and-program-cleanup/plan]"
description: "Verification-first documentation alignment pass: read each doc surface, diff against the shipped dual-stack CLI reality, patch only real drift; ENV_REFERENCE rows, changelog entries, in-flight reconciliation."
trigger_phrases:
  - "028 release cleanup plan"
  - "004 release-and-program-cleanup plan"
  - "cli transition doc cleanup plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-release-and-program-cleanup"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored plan for the release-cleanup phase"
    next_safe_action: "Execute tasks.md groups in order; reconcile in-flight rows"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 4: Release and Program Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs + YAML command assets + changelog files |
| **Framework** | None — documentation alignment over shipped 028 code |
| **Storage** | None new |
| **Testing** | validate.sh --strict, verification greps, doc-vs-code diffing |

### Overview

Sweep the 028 post-release documentation universe in eight groups (skill docs, code READMEs, top-level READMEs, commands, agent rosters, references/ENV_REFERENCE, catalogs/playbooks, changelog). Each row is verification-first: read the doc, diff against shipped behavior (CLI entry points, warm-only env vars, plugins, bridge repair), patch only real drift, record "no drift" otherwise. Rows already being executed by concurrent agents (skill READMEs, catalog/playbook) are marked IN-FLIGHT and get reconciled, not re-edited.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Workstreams 001-003 implementation complete per the parent phase map
- [x] Env var inventory grep-extracted from shipped code (11 vars; ENV_REFERENCE gap confirmed)
- [x] In-flight concurrent work identified (skill READMEs, catalog/playbook rows)

### Definition of Done

- [ ] All P0 requirements in spec.md verified with evidence
- [ ] checklist.md P0 items complete; P1 items complete or dispositioned
- [ ] `validate.sh --strict` exit 0 on this folder and the parent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Verification-first doc sweep, grouped by surface ownership; mirrors 026's `000-release-and-program-cleanup` release-gate intent compressed into a single Level 2 phase.

### Key Components

- **Truth source**: shipped code — `.opencode/bin/{spec-memory,code-index,skill-advisor}.cjs`, the three `mcp_server/` CLI entry points, hooks `lib` fallbacks, plugins `mk-spec-memory.js`/`mk-skill-advisor.js`/`mk-code-graph.js` (+ bridge), and the env var grep inventory.
- **Doc groups (a)-(h)**: enumerated as task rows in tasks.md; each row names exact file paths.
- **In-flight protocol**: concurrent agents own group (a) skill READMEs and group (g) catalog/playbook; this phase verifies and reconciles their output before closing those rows.
- **Changelog discipline**: write through skill-local changelog paths (track dirs under `.opencode/changelog/` are symlinks); claim the next free version slot at write time.

### Data Flow

Shipped code + research/phase records → per-doc diff → surgical doc patch or "no drift" evidence → checklist + validate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Pin the truth-source inventory (CLI bins, env vars, plugins, doctor route state, changelog slots)
- [ ] Snapshot in-flight agent progress on groups (a) and (g) before touching those surfaces

### Phase 2: Core Implementation

- [ ] Execute tasks.md groups (a)-(h) in order; independent groups parallelizable
- [ ] Reconcile IN-FLIGHT rows (verify concurrent agents' output, fill gaps only)

### Phase 3: Verification

- [ ] Run the SC-001 stale-claim grep and the SC-002 ENV_REFERENCE bidirectional diff
- [ ] Complete checklist.md; run `validate.sh --strict` on this folder + parent
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs + anchors | validate.sh --strict |
| Drift | ENV_REFERENCE vs code env var inventory | rg extraction + bidirectional diff |
| Drift | MCP-only access claims across in-scope docs | targeted rg sweep per surface |
| Consistency | Playbook file-count self-checks + catalog indexes | hand-check against directory listings |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Workstreams 001-003 (spec-memory, code-index, skill-advisor CLIs) | Internal | Implementation complete | Docs would describe unshipped behavior |
| Concurrent agents on skill READMEs + catalog/playbook | Internal | In flight | Reconciliation rows wait on their output |
| Changelog version slots (parallel sessions) | Internal | Open | Slot collision; check track dir at write time |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doc patch misstates shipped behavior or collides with in-flight agent work.
- **Procedure**: All changes are doc-only and additive; revert the specific file via git (`git checkout -- <path>` or scoped revert). No data or runtime state to unwind.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks | Parallelizable |
|-------|------------|--------|----------------|
| Phase 1: Setup | Workstreams 001-003 shipped | Phase 2 | No |
| Phase 2: Groups (b)-(f), (h) | Phase 1 | Phase 3 | Yes — independent surfaces |
| Phase 2: Groups (a), (g) reconciliation | In-flight agents' output | Phase 3 | Yes — after snapshot |
| Phase 3: Verification | Phase 2 | Phase close | No |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Group | Scope | Estimate |
|-------|-------|----------|
| (a) Skill SKILL.md/README x3 | Reconcile in-flight | 0.5d |
| (b) Code READMEs x5 | Verify/patch | 0.5d |
| (c) Root + skills-index READMEs | Verify/patch | 0.25d |
| (d) Commands (doctor verify; memory/speckit refs) | Verify/patch | 0.5d |
| (e) Agent rosters x3 runtimes | Verify | 0.25d |
| (f) ENV_REFERENCE + references | Author rows | 0.5d |
| (g) Catalogs + playbooks x3 systems | Reconcile in-flight + stress rows | 0.5d |
| (h) Changelog x3 tracks | Author | 0.25d |
| **Total** | | **~3.25d** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Scoped commits only (`git commit --only -- <paths>`) — shared git index across sessions
- [ ] `git show --stat HEAD` verified after each commit

### Rollback Procedure

1. Identify the offending doc patch via `git log --oneline -- <path>`.
2. Revert that file only; leave sibling group rows intact.
3. Re-run the group's verification grep and validate.sh.

### Data Reversal

- Not applicable — no databases, indexes, or runtime state are mutated by this phase.
<!-- /ANCHOR:enhanced-rollback -->

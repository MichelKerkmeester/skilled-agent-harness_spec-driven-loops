---
title: "Implementation Plan: All Skills Alignment Sweep"
description: "Batch audit and surgical documentation alignment for all 19 .opencode skills plus root README surfaces."
trigger_phrases:
  - "all skills alignment plan"
  - "skill docs batch plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep"
    last_updated_at: "2026-05-14T18:55:00Z"
    last_updated_by: "codex"
    recent_action: "Planned five-batch docs sweep"
    next_safe_action: "Run batch audits and commit each family"
    blockers: []
    key_files:
      - "research/skills-audit.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:104b411b4115e9434be631bdffb14d19a2d492c1698937d4b3022cda86c6d1ed"
      session_id: "015-all-skills-alignment-sweep"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: All Skills Alignment Sweep

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, YAML frontmatter, JSON metadata |
| **Framework** | sk-doc templates, system-spec-kit Level 3 packet |
| **Storage** | Git-tracked docs and packet metadata |
| **Testing** | sk-doc validators, `rg` current-reality probes, strict spec validation |

### Overview

This implements a doc-only audit and alignment pass across the full skill library. The work is intentionally surgical: validate all primary surfaces, edit only stale or non-compliant authored docs, record per-skill DQI proxy movement, and commit each skill family separately.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 answered: Option B, new Level 3 packet.
- [x] Required sk-doc templates read.
- [x] 013/009 handover and recent git log read.
- [x] Next free packet number verified as `015`.

### Definition of Done

- [ ] All 19 skills audited.
- [ ] Required docs patched or follow-ons recorded.
- [ ] Batch commits created on `main`.
- [ ] Packet strict validation passes.
- [ ] Final binding trace recorded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Batch-oriented documentation sweep with validation gates.

### Key Components

- **Audit layer**: `rg`, sk-doc validators, direct reads of templates, handovers and current docs.
- **Patch layer**: surgical markdown and packet-doc edits only.
- **Verification layer**: sk-doc quick validation, README validation, targeted stale-reference grep, strict packet validation.
- **Commit layer**: path-limited batch commits, no branch changes.

### Data Flow

Template rules and current-reality evidence flow into `research/skills-audit.md`. Batch edits update the skill docs. Validation evidence and final counts flow into `implementation-summary.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| CLI executor skills | Cross-runtime delegation docs | Audit and trim frontmatter where needed | `quick_validate.py` per skill |
| Deep-loop skills | State-machine and iteration docs | Audit for current state-machine and template compliance | `quick_validate.py`, targeted stale grep |
| MCP integration skills | Tool/MCP topology docs | Audit code-mode, Chrome DevTools, CocoIndex current surfaces | README validation, targeted stale grep |
| sk-* skills | General standards and templates | Audit sk-code, sk-review, sk-doc, sk-git, sk-prompt | Validator pass and direct current-reality read |
| system-* skills and root docs | Core runtime documentation | Align advisor/code-graph/root README current language | Targeted grep and README validation |

Required inventories:
- Exact stale-reference probes: `mcp_server/skill_advisor`, `dist/skill_advisor`, `system_code_graph`, `mk-code-index`, `skill-graph.sqlite`.
- Template probes: `quick_validate.py` for every `SKILL.md`; `validate_document.py --type readme` for primary READMEs.
- Scope probe: `git diff --name-only` and `git diff --cached --name-only` before each commit.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Scaffold Level 3 packet.
- [x] Read sk-doc and system-spec-kit operating instructions.
- [x] Read required templates and 013/009 handover.
- [ ] Create `research/skills-audit.md`.

### Phase 2: Core Implementation

- [ ] Batch A: CLI executor skills.
- [ ] Batch B: Deep-loop skills.
- [ ] Batch C: MCP integration skills.
- [ ] Batch D: sk-* general skills.
- [ ] Batch E: system-* core skills plus root READMEs.

### Phase 3: Verification

- [ ] Run sk-doc validation evidence.
- [ ] Run strict packet validation.
- [ ] Update checklist and implementation summary.
- [ ] Commit close-out if needed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:critical-path -->
## 4.1 CRITICAL PATH

The critical path is sequential because each batch updates the same packet audit ledger and commit ledger. Batch A establishes the validation baseline, B through D verify lower-risk skill families, and Batch E handles the highest-risk root/current-reality updates before final validation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 4.2 MILESTONES

| Milestone | Exit Criteria |
|---|---|
| M1 Scaffold and audit | Packet docs and `research/skills-audit.md` exist |
| M2 Batch A-D complete | CLI, deep-loop, MCP and sk-* commits created |
| M3 Batch E complete | system-* docs and root READMEs aligned |
| M4 Close-out | Strict validation passes and binding trace is final |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document structure | SKILL.md and README primary surfaces | `quick_validate.py`, `validate_document.py` |
| Current reality | Advisor, code-graph, CocoIndex, embedding references | `rg` targeted probes |
| Spec packet | Level 3 tracking docs | `validate.sh --strict` |
| Scope safety | Whitelist adherence | `git diff --name-only`, path-limited staging |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc templates | Internal | Green | Cannot judge compliance |
| 013/009 handover | Internal | Green | Advisor current reality uncertain |
| git log -50 | Internal | Green | Recent restructure context missing |
| Runtime configs | Internal | Mixed | Config changes are out of doc-only scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A batch introduces incorrect current-reality docs or touches out-of-scope files.
- **Procedure**: Use `git revert <batch-sha>` for committed batches, or `git restore --staged <paths>` plus targeted patch reversal before commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 scaffold/audit -> Batch A -> Batch B -> Batch C -> Batch D -> Batch E -> Verify/close
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3, templates, handover | All batches |
| Batch A | Setup | Batch B |
| Batch B | Batch A | Batch C |
| Batch C | Batch B | Batch D |
| Batch D | Batch C | Batch E |
| Batch E | Batch D | Verify |
| Verify | Batch E | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and audit | High | 1-2 hours |
| Batch edits | High | 3-6 hours |
| Verification and close | Medium | 1-2 hours |
| **Total** | | **5-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Branch remains `main`.
- [x] Pre-existing dirty files identified.
- [ ] Batch diff inspected before commit.

### Rollback Procedure

1. Identify the batch SHA from `implementation-summary.md`.
2. Run `git revert <sha>` without `--no-verify`.
3. Re-run the relevant validators.
4. Record the revert reason in the packet if rollback occurs.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Git revert only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
sk-doc templates + handover + git log
            |
            v
      research audit
            |
            v
 Batch A -> B -> C -> D -> E
            |
            v
      strict validate + binding trace
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Audit | Templates, handover, git log | Gap list | Batches |
| Batches | Audit | Doc edits and commits | Verify |
| Verify | Batch commits | Completion evidence | Final response |
<!-- /ANCHOR:dependency-graph -->

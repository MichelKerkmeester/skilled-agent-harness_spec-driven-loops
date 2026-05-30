---
title: "Implementation Plan: Forbid ephemeral-artifact references in code comments"
description: "Add a canonical sk-code rule against ephemeral-artifact pointers in comments, revise contradicting guidance, then run a comments-only cleanup of deep/system skills via CLI-DEVIN (execute) + CLI-CODEX (review)."
trigger_phrases:
  - "comment hygiene plan"
  - "sk-code rule plan"
  - "ephemeral reference cleanup"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene/001-rule-and-cleanup"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored implementation plan"
    next_safe_action: "Author sk-code prevention rule (Part A)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000119"
      session_id: "119-comment-ref-hygiene-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Forbid ephemeral-artifact references in code comments

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (sk-code rule); TypeScript / JS / `.cjs` / Python / shell (cleanup targets) |
| **Framework** | sk-code skill; system-spec-kit, system-code-graph, system-skill-advisor, deep-agent-improvement |
| **Storage** | None (source + docs only) |
| **Testing** | vitest (per skill), `tsc --noEmit`, `node --check`, `python3 -m py_compile`, `bash -n` |

### Overview
Part A (Claude): add one canonical rule in the sk-code universal layer, aggressively revise the contradicting OpenCode §4, add a Webflow pointer, reconcile echo sites. Part B (CLIs): a chunked, comments-only cleanup of ~135 Bucket-A sites across four skills, executed by CLI-DEVIN/SWE-1.6 and reviewed by CLI-CODEX/gpt-5.5, with a compile/test green-gate per chunk.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001/002)
- [x] Dependencies identified (CLIs, per-skill suites)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..006)
- [ ] Tests passing for every touched skill
- [ ] Docs synchronized (spec/plan/tasks/checklist/decision-record/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Governance-rule-as-single-source + inherited surface pointers; chunked executor/reviewer cleanup loop.

### Key Components
- **Canonical rule**: `references/universal/code_style_guide.md` §4 (+ P0 mirror in `code_quality_standards.md`).
- **OpenCode reconciliation**: `references/opencode/shared/universal_patterns.md` §3/§4/§7 + language style guides.
- **Webflow pointer**: `references/webflow/shared/cross_language_rules.md` §7.
- **Cleanup loop**: CLI-DEVIN edits → green-gate verify → CLI-CODEX diff audit → commit → next chunk.

### Data Flow
Rule authored once → inherited by surfaces → enforced by checklists; cleanup reads inventory → edits comments → verifies → reviews → commits.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This change touches shared policy (comment conventions) and many source files, so surfaces are enumerated.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-code universal refs | Define cross-surface comment policy | Add canonical rule | grep + manual read |
| sk-code OpenCode refs (§4, language guides, config QS) | Currently recommend `T###`/`REQ-###`/`CHK-###` | Revise/remove recommendation | grep zero recommendations |
| sk-code Webflow refs | No prefix recommendation (clean) | Add pointer only | manual read |
| deep/system skill source comments | Carry ephemeral pointers | Strip per Rules A–D | comment-line ripgrep = 0; suites green |
| deep/system functional literals + tests | Engine paths / fixtures | UNCHANGED (Bucket B/C) | `git diff` shows untouched |

Required inventories:
- Comment-line offenders: `rg -n -e 'ADR-\d' -e 'Packet \d' -e 'Phase \d{3}' -e 'T\d{3}' -e 'REQ-\d' -e 'CHK-\d' -e 'feature_catalog' <skill> --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.py' --glob '*.sh'` then filter to comment lines.
- Bucket-B guardrails: see `decision-record.md` ADR-003 + the plan-file DO-NOT-TOUCH list.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Gate 3 spec folder created
- [x] description.json + graph-metadata.json generated
- [ ] validate.sh --strict baseline run

### Phase 2: Core Implementation
- [ ] Part A — author canonical rule + P0 mirror
- [ ] Part A — aggressive OpenCode §4 revision + §3/§7 fixes
- [ ] Part A — Webflow pointer
- [ ] Part A — echo-site reconciliation
- [ ] Part B0 — pre-flight reads (cli-devin, cli-codex, sk-prompt-small-model); commit dirty tree; green baseline
- [ ] Part B — validation-phase cleanup (deep-agent + skill-advisor)
- [ ] Part B — code-graph cleanup
- [ ] Part B — system-spec-kit bulk cleanup

### Phase 3: Verification
- [ ] Full suites green per skill
- [ ] Completeness ripgrep = 0 in Bucket A
- [ ] validate.sh --strict Exit 0; checklist complete with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Compile | All edited code files | `tsc --noEmit`, `node --check`, `python3 -m py_compile`, `bash -n` |
| Unit | Per touched skill | vitest (`npm run test` / `test:mcp`) |
| Lint | mcp_server chunks | eslint (`npm run lint`) |
| Manual | sk-code rule readability + grep sweeps | ripgrep + Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| CLI-DEVIN (SWE-1.6) | External | Green | Cleanup execution blocked |
| CLI-CODEX (gpt-5.5) | External | Green | Per-chunk review blocked |
| Per-skill npm scripts | Internal | Green | Green-gate blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A chunk turns a suite red, or a Bucket-B literal was edited.
- **Procedure**: `git checkout -- <chunk files>` (per-chunk commits keep blast radius to one chunk); narrow the edit; retry.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Part A (rule) -> Part B0 (pre-flight) -> Part B chunks -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Part A |
| Part A | Setup | Part B0 |
| Part B0 | Part A | Part B chunks |
| Part B chunks | Part B0 | Verify |
| Verify | Part B chunks | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + Part A | Med | sk-code docs ~10 files |
| Part B cleanup | High | ~23-26 chunks, sequential |
| Verification | Med | full suites + sweeps |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Working tree committed/stashed before cleanup (clean per-chunk diffs)
- [ ] Green baseline confirmed per skill before edits

### Rollback Procedure
1. Revert the offending chunk: `git checkout -- <files>` or `git revert <chunk-commit>`.
2. Re-run the chunk's green-gate to confirm restoration.
3. Re-attempt with a tighter comment-only edit.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Part A (rule) -> Part B0 (preflight) -> B: validation -> B: code-graph -> B: spec-kit bulk -> Verify
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Part A rule | Setup | sk-code policy | Part B0 |
| Part B0 | Part A | clean baseline | all chunks |
| Validation phase | Part B0 | proven loop | code-graph |
| code-graph | validation | clean comments | spec-kit bulk |
| spec-kit bulk | code-graph | clean comments | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Part A rule + reconciliation** — sk-code self-consistent — CRITICAL
2. **Part B0 pre-flight + clean baseline** — safe dispatch — CRITICAL
3. **Part B chunked cleanup** — ~135 sites — CRITICAL
4. **End-to-end verification** — suites green + sweeps — CRITICAL

**Parallel Opportunities**: Part A doc edits can be batched; cleanup chunks are strictly sequential (single-process dispatch discipline).
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | sk-code rule live + reconciled | REQ-001/002 met | Part A done |
| M2 | Cleanup pipeline proven | validation phase green | Part B early |
| M3 | All offenders removed | REQ-003/004/005 met | Part B done |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the accepted ADRs (instance-vs-structural rule, aggressive §4 revision, comments-only scope, CLI division of labor).

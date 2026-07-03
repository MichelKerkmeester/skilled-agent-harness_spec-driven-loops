---
title: "Implementation Plan: Orchestrator Validation Parity"
description: "Plan for the strict-aware registry filter, the FILE_EXISTS started-work exemption, bridge vitest coverage, and the gated dist rebuild."
trigger_phrases:
  - "orchestrator parity plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/001-orchestrator-validation-parity"
    last_updated_at: "2026-07-03T10:40:24Z"
    last_updated_by: "gpt-5.5-opencode"
    recent_action: "Completed focused source/test implementation"
    next_safe_action: "Orchestrator runs full-suite, rebuild, bash suite, and live proofs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-001-orchestrator-parity"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Orchestrator Validation Parity

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server package) |
| **Framework** | Node validation orchestrator consumed by validate.sh via compiled dist |
| **Testing** | vitest (unit) + test-validation-extended.sh (bash integration) |

### Overview
Two behavior fixes in `orchestrator.ts` (strict-aware registry filtering; started-work exemption for completion docs), one new vitest file pinning the registry bridge and both fixes, then a single coordinated dist rebuild gated on a quiet package tree, closed out by the full bash validation suite and clearing packet 030 child 007's known false error.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both gaps verified against live code with line references (2026-07-02 session).
- [x] Rebuild-gate protocol agreed: quiet tree or explicit operator approval.

### Definition of Done
- [ ] Strict-only rules execute under strict Node-path runs; non-strict unchanged.
- [ ] Started-work exemption live in `validateFileExists` (and native level-match if shared).
- [ ] New vitest file green; full mcp_server suite 0 new failures.
- [ ] Dist rebuilt once, freshness check clean, `test-validation-extended.sh` fully green.
- [ ] 030/011/007 validates with 0 errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Minimal-delta parity fixes inside existing functions; no new modules. The started-work predicate is a small pure function mirroring the hardened shell heuristic so both paths share one definition of "started".

### Key Components
- **Registry filter** in `runRegistryShellRules`: gains awareness of the orchestrator's `strict` option.
- **`validateFileExists`**: consults the started-work predicate before requiring `implementation-summary.md`.
- **Started-work predicate**: checks checklist.md/tasks.md for `- [x]`-anchored list items only.
- **New vitest file**: fixture folders exercising both directions of both fixes plus bridge mapping/guard behavior.

### Data Flow
validate.sh -> compiled orchestrator (`--strict` flag) -> registry filter (strict-aware) -> shell rules execute -> entries merged. Folder docs -> started-work predicate -> FILE_EXISTS requirement set.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `orchestrator.ts` registry-bridge block and `validateFileExists`/`docsForLevel`/level-contract flow in full.
- [x] Read the hardened heuristic in `check-files.sh`/`check-level-match.sh` to mirror exactly.
- [x] Read existing mcp_server vitest conventions (nearest validation test file).

### Phase 2: Implementation
- [x] Strict-aware filter: include `strict_only` rules when `opts.strict === true`; `severity: skip` still always excluded.
- [x] Started-work predicate + wiring into `validateFileExists` (and native level-match required-files if it shares the gap).
- [x] New vitest file with fixture folders for all four directions (strict on/off × rule inclusion; started/not-started × requirement).

### Phase 3: Verification
- [ ] Full mcp_server vitest suite: 0 new failures.
- [ ] REBUILD GATE: confirm quiet tree (no concurrent uncommitted mcp_server sources) or obtain operator approval; then `npm run build` once.
- [ ] `test-validation-extended.sh` fully green; dist-freshness check-all clean.
- [ ] Real-world checks: strict run shows strict-only rule execution; 030/011/007 validates clean.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Registry filter strict/non-strict; status mapping; path-traversal guard; started-work predicate both directions | vitest |
| Integration | Full validation fixture suite post-rebuild | test-validation-extended.sh |
| Live | Strict validate.sh run on a real folder; 030/011/007 recursive validation | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Quiet mcp_server tree (no concurrent WIP) | Operational | Blocking at time of authoring | Rebuild deferred; source fixes cannot ship until gate clears |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Suite regression, strict runs failing on rule-execution errors (not genuine findings), or exemption misclassifying started work.
- **Procedure**: Revert `orchestrator.ts` + delete the new test file, rebuild dist once more, re-run the bash suite.
<!-- /ANCHOR:rollback -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

| Check | Status |
|-------|--------|
| Required docs read (spec, plan, tasks, decisions, checklist) | Complete |
| Rebuild gate protocol understood | Complete |
| Target files read before edit | Complete |

### Execution Rules

| Rule | Application |
|------|-------------|
| TASK-SEQ | Read docs, verify gate, edit source, focused tests, orchestrator rebuild, live proofs, document |
| TASK-SCOPE | Behavior limited to the registry filter, the started-work exemption, and the node-rule bridge |

### Status Reporting Format

Report gate state, focused test counts, mutation-check observations, rebuild and freshness results, and both live proofs (strict-only execution, exemption both directions).

### Blocked Task Protocol

If the gate is closed, the suite cannot produce totals, or live proofs contradict unit results, report BLOCKED with exact command output and stop; no partial rebuilds.

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1 | None | Entry point |
| Phase 2 | Phase 1 | Mirror the shell heuristic exactly; conventions first |
| Phase 3 | Phase 2 + rebuild gate | Ship + verify requires compiled dist |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Basis |
|-------|----------|-------|
| Phase 1 | Small | Files and lines already identified |
| Phase 2 | Small-Medium | Two focused fixes + one test file |
| Phase 3 | Medium | Rebuild coordination + full-suite + live checks |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Scenario | Detection | Action |
|----------|-----------|--------|
| Strict-only rules crash under bridge execution | Strict validate.sh errors on rule execution | Revert filter only; exemption can ship independently |
| Exemption misses real completion (false pass) | Unit fixture with `- [x]` line | Fix predicate; both directions are pinned so the regression is loud |
| Rebuild swept unexpected content | dist-freshness/content diff post-build | Rebuild again from a clean checkout of the package sources |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
shell heuristic (reference) ---> started-work predicate ---> validateFileExists
orchestrator strict opt ---> registry filter ---> strict-only rules execute
both fixes ---> vitest file ---> mcp_server suite
suite green + QUIET TREE ---> dist rebuild ---> bash suite + live checks
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Both source fixes (parallel, independent).
2. Vitest coverage (pins them).
3. Rebuild gate clearance — the only externally-blocked step.
4. Single rebuild + full bash suite + live verification.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Definition |
|-----------|------------|
| M1: Fixes compile | Both fixes in source, package typechecks |
| M2: Pinned | New vitest file green, full suite 0 new failures |
| M3: Shipped | Gate cleared, dist rebuilt once, freshness clean |
| M4: Proven live | Strict-only rule visibly runs; 030/011/007 validates clean; bash suite fully green |
<!-- /ANCHOR:milestones -->

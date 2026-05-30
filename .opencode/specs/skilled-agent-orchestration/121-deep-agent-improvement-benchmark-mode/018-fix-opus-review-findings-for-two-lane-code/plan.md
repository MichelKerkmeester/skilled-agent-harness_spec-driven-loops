---
title: "Implementation Plan: opus deep-review remediation"
description: "Remediation plan for the 017 Opus deep-review findings: shared fixture-id guard for the first-writer materializer, bundle-gate criteria-exec gate, dead Mode-4 anchor repoint, benchmark-mode promotion path, and P2 containment/integrity/attribution cleanup."
trigger_phrases:
  - "opus review remediation plan"
  - "017 findings remediation plan"
  - "benchmark-mode promotion plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/018-fix-opus-review-findings-for-two-lane-code"
    last_updated_at: "2026-05-29T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored 018 Level 3 remediation plan from 017 review"
    next_safe_action: "Implement W1 materializer guard then W2 exec gate"
    blockers: []
    key_files:
      - "../017-two-lane-opus-deep-review/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-018-20260529"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: opus deep-review remediation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (.cjs) scripts, TypeScript advisor lib, vitest |
| **Framework** | deep-agent-improvement skill runtime (loop-host, scorer, promoter) |
| **Storage** | Packet-local outputs dir, packet-local score cache |
| **Testing** | vitest in `.opencode/skills/deep-agent-improvement/scripts` |

### Overview
Remediate the four active P1 and thirteen P2 findings from the 017 Opus deep review across five workstreams (traversal hardening, hardening-gate coverage, doc and traceability accuracy, shared-helper extraction, cache integrity). The two highest-risk seams are the benchmark-mode promotion branch in `promote-candidate.cjs` (must not loosen the agent-canonical guarded path) and the shared fixture-id guard (must preserve run-benchmark reject semantics). Each FIXED finding lands with a regression or adversarial test where applicable, and every finding gets exactly one disposition recorded in decision-record.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in spec.md
- [x] Success criteria measurable
- [x] 017 findings mapped to workstreams and dispositions

### Definition of Done
- [ ] All 4 P1 fixed-or-document-accepted with evidence
- [ ] All 13 P2 fixed-or-document-accepted with evidence
- [ ] vitest green (`npx vitest run` in the scripts dir)
- [ ] Lane B benchmark-mode promotion executable and docs describe the resolved behavior
- [ ] Per-finding disposition register complete in decision-record.md
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical, file-scoped remediation against a shipped lane-separated script tree. No re-architecture.

### Key Components
- **Shared fixture-id guard (`scripts/lib/`)**: single `SAFE_FIXTURE_ID` rule required by both the materializer (first writer) and run-benchmark (second writer).
- **bundle-gate criteria-exec gate**: Layer-3 execSync routed through `DEEP_AGENT_ALLOW_CRITERIA_EXEC` so the documented fail-closed guarantee covers the D2 hard gate.
- **Benchmark-mode promotion branch (`promote-candidate.cjs`)**: a `--benchmark-report` path that promotes on a passing `benchmark-complete` report, bypassing the agent-scored-file requirement, while the agent-canonical path stays unchanged.
- **Doc-truth surfaces**: SKILL.md, the two command docs, and the Lane B YAML describe records and reducer as mode-aware and promotion as gaining a benchmark-mode branch, with the Mode-4 anchors repointed to `§4 LANE B`.

### Data Flow
Lane B loop-host plans materialize then run-benchmark, both of which now share one fixture-id guard. run-benchmark writes `report.json` with `status=benchmark-complete`. The YAML promotion step calls `promote-candidate.cjs --benchmark-report <report.json>`, which validates the report status and recommendation and promotes on that basis.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planning from a deep-review CONDITIONAL verdict with findings touching security, path handling, and shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `materialize-benchmark-fixtures.cjs:91` | First writer, no id guard | update (port shared guard before path.join) | hostile-id vitest, `rg SAFE_FIXTURE_ID` shows shared require |
| `run-benchmark.cjs:126-136` | Second writer, owns `SAFE_FIXTURE_ID` | update (consume shared guard) | existing traversal vitest still green |
| `bundle-gate.cjs:128-157` | D2 hard gate, ungated execSync | update (route through criteria-exec gate) | smoke-run no-exec vitest, `rg DEEP_AGENT_ALLOW_CRITERIA_EXEC bundle-gate.cjs` |
| `score-model-variant.cjs:107-115,209` | Deterministic gate + bundle-gate caller | unchanged caller, verify gate scope | grep audit of gate coverage |
| `promote-candidate.cjs:153,168,233` | Agent-only promoter, hard-requires scored | update (add benchmark-mode branch) | benchmark-mode promote vitest, agent path unchanged vitest |
| `SKILL.md:278, start-model-benchmark-loop.md:409,411,496` | Over-claim mode-aware promotion | update (describe resolved behavior) | `rg "mode-aware" doc` shows corrected wording |
| `start-model-benchmark-loop.md:370,497, start-agent-improvement-loop.md:514` | Dead Mode-4 anchors | update (repoint to §4 LANE B) | `rg "Mode 4"` resolves to live heading |
| `auto YAML:174-176` | Non-executable promotion step | update (benchmark-mode invocation) | YAML step matches promoter contract |
| `reduce-state.cjs:620` | Genuine record-level mode-awareness | unchanged (this is the real mode-awareness) | doc references point here |
| `explicit.ts:122-129` | Two-node projection, stale comment | update (comment only) | comment matches projection.ts |

Required inventories:
- Same-class producers: `rg -n 'path.join\(.*fixture' scripts/shared scripts/model-benchmark`.
- Consumers of changed symbols: `rg -n 'SAFE_FIXTURE_ID|assertSafeFixtureId|DEEP_AGENT_ALLOW_CRITERIA_EXEC|benchmark-report' scripts --glob '*.cjs' --glob '*.ts'`.
- Algorithm invariant: the shared fixture-id guard rejects separators, `..`, absolute syntax, and empty for both writers identically.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: W1 Traversal hardening
- [ ] Extract shared fixture-id guard into `scripts/lib/`; require it in run-benchmark and the materializer
- [ ] Add materializer hostile-id regression test
- [ ] F017-P2-03 grep/grep_absent containment check; F017-P2-13b systemFitness ref sanitize

### Phase 2: W2 Hardening-gate coverage
- [ ] Route bundle-gate Layer-3 through `DEEP_AGENT_ALLOW_CRITERIA_EXEC`; add smoke-run no-exec test
- [ ] F017-P2-12 grader prompt-injection hardening; F017-P2-13a grader cache run-scope plus key verify

### Phase 3: W3 Doc and traceability accuracy + Lane B promotion
- [ ] F017-P1-04 benchmark-mode promotion branch in promote-candidate.cjs + test
- [ ] Repoint Mode-4 anchors; correct mode-aware-promotion wording in SKILL.md, command doc, YAML
- [ ] F017-P2-01 Lane B headline framing; F017-P2-04 advisor comment; F017-P2-08 + F017-P2-11 attribution tags

### Phase 4: W4 Shared-helper extraction + W5 cache integrity
- [ ] F017-P2-05 parse-args; F017-P2-06 integration-score; F017-P2-09 profile-resolve shared helpers
- [ ] F017-P2-07 dead param; F017-P2-02 unused resolver entry
- [ ] F017-P2-10 score-cache inputHash verify
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Shared fixture-id guard reject table, bundle-gate gate-skip, benchmark-mode promotion, cache inputHash verify | vitest |
| Adversarial | Materializer hostile-id parent-dir escape, smoke-run no-exec under flag, grep containment | vitest |
| Regression | Full in-scope suite green; run-benchmark traversal test unchanged | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 017 review-report.md | Internal | Green | Findings source of truth |
| Post-015 two-lane code | Internal | Green | The code being remediated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix changes a passing 5dim score for a command-free profile, perturbs run-benchmark reject semantics, or loosens the agent-canonical promotion path.
- **Procedure**: Each fix is a discrete file-scoped edit. Revert the offending file to its post-015 state and rerun vitest. The benchmark-mode promotion branch is additive (gated behind `--benchmark-report`), so reverting it restores the agent-only promoter.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
W1 Traversal ─────┐
                  ├──► W3 Doc + Lane B promotion ──► W4/W5 cleanup ──► Verify
W2 Hardening-gate ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| W1 Traversal hardening | None | W4 (shared helpers) |
| W2 Hardening-gate coverage | None | Verify |
| W3 Doc + Lane B promotion | None | Verify |
| W4 Shared helpers + W5 cache | W1 (shared lib seam) | Verify |
| Verify | W1, W2, W3, W4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| W1 Traversal hardening | Med | 2-3 hours |
| W2 Hardening-gate coverage | Med | 2-3 hours |
| W3 Doc + Lane B promotion | High | 3-4 hours |
| W4 Shared helpers + W5 cache | Med | 2-3 hours |
| **Total** | | **9-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] In-scope vitest green before edits (baseline)
- [ ] Each fix isolated to its owned file
- [ ] No cross-lane behavior change for command-free profiles

### Rollback Procedure
1. Identify the offending file from the failing test or score-parity check
2. Revert that file to its post-015 state
3. Rerun `npx vitest run` in the scripts dir
4. Re-disposition the affected finding if the fix is withdrawn

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (file-scoped code and doc edits only)
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  W1 + W2    │────►│  W3 promote │────►│  W4 + W5    │
│  traversal  │     │  + doc-true │     │  cleanup    │
└──────┬──────┘     └─────────────┘     └─────────────┘
       │
 ┌─────▼─────┐
 │ shared    │
 │ fixture-id│
 └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Shared fixture-id guard | None | one reject rule | materializer, run-benchmark |
| Materializer guard port | shared guard | first-writer safety | W4 profile-resolve |
| bundle-gate criteria-exec gate | None | fail-closed D2 gate | Verify |
| Benchmark-mode promotion branch | None | executable Lane B promote | doc-truth surfaces |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **W1 shared fixture-id guard + materializer port** - 2-3 hours - CRITICAL
2. **W3 benchmark-mode promotion branch + doc truth** - 3-4 hours - CRITICAL
3. **Verify (vitest + disposition register)** - 1 hour - CRITICAL

**Total Critical Path**: 6-8 hours

**Parallel Opportunities**:
- W1 and W2 can run simultaneously (independent files)
- The P2 attribution-tag and advisor-comment fixes can run alongside W3
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Traversal + gate hardened | Materializer hostile-id test + bundle-gate no-exec test green | Phase 1-2 |
| M2 | Lane B promotion doc-true | Benchmark-mode promotion test green, no doc over-claim | Phase 3 |
| M3 | All findings dispositioned | 4 P1 + 13 P2 closed, vitest green | Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records live in decision-record.md
-->

---
title: "Implementation Plan: fix deep-review findings for two-lane code"
description: "Remediate the 014 two-lane deep-review findings: fix the Lane B command parser P0, harden the security and traceability P1 cluster, and disposition every P2, with regression tests and TST-1 byte-identity preserved."
trigger_phrases:
  - "two-lane remediation plan"
  - "014 findings remediation plan"
  - "Lane B parser fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/015-fix-deep-review-findings-for-two-lane-code"
    last_updated_at: "2026-05-29T12:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored 015 Level 3 plan from 014 review report"
    next_safe_action: "Implement F-P0-1 parser fix then P1 cluster"
    blockers: []
    key_files:
      - "../014-review-two-lane-workflow-implementation/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-20260529"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: fix deep-review findings for two-lane code

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) scripts + TypeScript advisor + Markdown/YAML command surfaces |
| **Framework** | deep-agent-improvement skill, deep-loop-runtime, system-skill-advisor |
| **Storage** | Packet-local JSONL state logs + `report.json`; score cache on disk |
| **Testing** | vitest (`cd .opencode/skills/deep-agent-improvement/scripts && npx vitest run`) |

### Overview
Remediate the 014 deep-review findings against the two-lane program. The single P0 is a parser mismatch: the Lane B command surfaces pass SPACE-form flags that `loop-host.cjs` `parseArgs` cannot read. Fix the parser to accept both `--key=value` and `--key value` while keeping the `=`-form path byte-identical (TST-1 safe), then harden the P1 security cluster (read-only grader dispatch, quoted YAML interpolation, fixture-id traversal guard, fail-closed criteria-exec, packet-local owner-checked cache) and the P1 traceability cluster (valid outcomes, threaded executor fields, plateau stop, consolidated config, provenance, lane ordering, candidate-keyed cache, immutable reports, packet-local pause, corrected promotion gate, repointed agent notes). Every P2 gets a FIXED or DOCUMENT-ACCEPT disposition.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 014 review-report.md and all-findings.jsonl read; each finding mapped to a workstream
- [ ] Per-finding disposition target chosen (FIXED or DOCUMENT-ACCEPT) before code changes
- [ ] TST-1 byte-identity invariant and the space-form acceptance criterion stated

### Definition of Done
- [ ] P0 fixed and verified end-to-end through the YAML path
- [ ] All 16 P1 and 16 P2 carry exactly one disposition
- [ ] vitest green; TST-1 byte-identity holds; alignment-drift clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Lane-separated CommonJS scripts under `scripts/{shared,agent-improvement,model-benchmark}/` plus `scripts/lib/`, driven by `loop-host.cjs` which plans an invocation per mode and spawns step scripts. Lane B planning forwards parsed flags into `materialize-benchmark-fixtures.cjs` then `run-benchmark.cjs`; `dispatch-model.cjs` loads only on `--grader llm`.

### Key Components
- **`loop-host.cjs` (shared)**: `parseArgs`, `resolveMode`, `planInvocation`, `resolveScriptPath`. Owns the P0 parser fix and executor-field threading.
- **`run-benchmark.cjs` (model-benchmark)**: scores fixture outputs, writes `report.json`, appends ledger rows. Owns fixture-id sanitization, scorer provenance on failure, per-iteration reports, profile provenance.
- **`dispatch-model.cjs` (model-benchmark)**: spawns external executors on `--grader llm`. Owns read-only sandbox default and packet-local pause state.
- **`score-candidate.cjs` (agent-improvement)**: Lane A scorer with an on-disk score cache. Owns packet-local owner-checked cache and candidate-keyed cache key.
- **`reduce-state.cjs` (shared)**: aggregates state; owns benchmark plateau stop and unknown-mode bucketing.
- **Lane B YAMLs + command docs + agent mirrors + advisor scorer**: command-surface fixes.

### Data Flow
Command (YAML or `.md`) renders a loop-host invocation, loop-host parses flags and plans the per-mode step sequence, step scripts read fixtures and profiles and write packet-local outputs and ledger rows, reduce-state aggregates for stop decisions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `loop-host.cjs` parseArgs | Flag producer for all modes | update: accept `--key value` additively | new space-form parser test + TST-1 plan identity assertion |
| 3 Lane B command surfaces (2 YAML + `.md`) | Consumers that emit space-form flags | update YAML interpolation to quoted/argv + valid outcome | grep for unquoted `{profile}`; outcome enum check |
| `dispatch-model.cjs` buildSpawnSpec | Spawns executors with write perms | update: read-only default + cwd sandbox assert | spawn-spec test asserts read-only mode by default |
| `run-benchmark.cjs` fixture path join | Path producer from fixture-controlled id | update: basename + resolved-inside-outputs guard | adversarial table test (separator, `..`, absolute, nested, no-op) |
| `score-candidate.cjs` cache | Persistence + trust boundary | update: packet-local owner/mode + candidate-keyed key | cache-key test + owner-mismatch miss test |
| `reduce-state.cjs` mode bucket + stop | Aggregator/policy | update: plateau stop + unknown-mode bucket | plateau-stop test + unknown-mode warning test |
| `SKILL.md` criteria-exec note | Policy doc | update: fail-closed default + opt-in | HVR-clean doc edit; default-off statement |
| agent mirrors (4) | Docs observing script paths | update: lane-separated paths | grep returns zero stale flat paths |
| advisor `explicit.ts` | Lane disambiguation policy | update: normalize penalty ids | advisor test: model-benchmark phrasing beats Lane A |

Required inventories:
- Same-class producers: `rg -n 'path.join\(outputsDir' .opencode/skills/deep-agent-improvement/scripts`.
- Consumers of changed symbols: `rg -n 'parseArgs|resolveScriptPath|agent-improvement-config|benchmark-complete' .opencode --glob '*.ts' --glob '*.cjs' --glob '*.md' --glob '*.yaml'`.
- Matrix axes: fixture-id guard axes = {plain basename, separator `/`, backslash, `..`, absolute, empty}; expected = {accept, reject, reject, reject, reject, reject}.
- Algorithm invariant: F-P0-1 - `=`-form parse output is byte-identical pre/post fix; space-form consumes exactly one following non-`--` token. F-P1-9 - resolved fixture output path must remain a child of the resolved outputs dir.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P0 - Lane B command runs (release blocker)
- [ ] Fix `loop-host.cjs` `parseArgs` to accept `--key value` additively
- [ ] Add a space-form parser regression test
- [ ] Verify the Lane B command end-to-end through the YAML path

### Phase 2: P1 security cluster
- [ ] Read-only grader/executor dispatch default + cwd sandbox assert (F-P1-1)
- [ ] Quote or argv-array YAML interpolation in both Lane B YAMLs (F-P1-2)
- [ ] Fixture-id traversal sanitization (F-P1-9)
- [ ] Criteria-exec fail-closed default + documented opt-in (F-P1-10)
- [ ] Packet-local owner-checked score cache (F-P1-11)

### Phase 3: P1 traceability cluster
- [ ] Valid Lane B session outcome (F-P1-3); thread executor/model (F-P1-4)
- [ ] Benchmark plateau stop (F-P1-5); config consolidation (F-P1-6)
- [ ] Scorer provenance on failure (F-P1-7); lane-resolution ordering (F-P1-8)
- [ ] Candidate-keyed cache (F-P1-12); per-iteration reports (F-P1-13)
- [ ] Packet-local pause (F-P1-14); promotion gate (F-P1-15); agent notes (F-P1-16)

### Phase 4: P2 dispositions + verification
- [ ] Each of 16 P2 advisories FIXED with evidence or DOCUMENT-ACCEPT with rationale
- [ ] decision-record disposition register complete (1 P0 + 1 refuted + 16 P1 + 16 P2)
- [ ] vitest green; TST-1 identity holds; alignment-drift clean
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | parseArgs space-form, fixture-id guard table, cache key, spawn-spec read-only, plateau stop, unknown-mode | vitest |
| Integration | Lane B command end-to-end through the YAML path to benchmark-complete | loop-host runtime smoke |
| Identity | TST-1 byte-identical plan for the `=`-form and Lane A paths | vitest plan assertion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 014 review-report.md + all-findings.jsonl | Internal | Green | Source of truth for findings; both present in 014 packet |
| 121/008-013 shipped two-lane code | Internal | Green | The code under remediation |
| vitest suite | Internal | Green | Regression gate for every FIXED finding |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: vitest goes red, TST-1 byte-identity breaks, or the Lane B end-to-end run regresses.
- **Procedure**: revert the offending file edit (each fix is file-scoped and additive); re-run vitest and the TST-1 identity assertion to confirm the baseline is restored before retrying.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L3: CROSS-WORKSTREAM DEPENDENCIES

- Phase 1 (P0 parser) is independent and ships first as the release blocker.
- Phase 2 (security) and Phase 3 (traceability) are largely independent per file; F-P1-4 (executor threading) shares `loop-host.cjs` with the P0 fix, so it lands after Phase 1.
- Phase 4 (P2 + verification) runs last so the disposition register reflects the final code state.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L3: EFFORT ESTIMATE

| Workstream | Findings | Relative Effort |
|------------|----------|-----------------|
| WS1 P0 parser + e2e | 1 P0 | Small |
| WS2 security cluster | 5 P1 + security P2s | Medium |
| WS3 traceability cluster | 11 P1 + traceability P2s | Medium-Large |
| WS4 doc/test sync + P2 dispositions | F-P1-16 + 16 P2 | Medium |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L3: ENHANCED ROLLBACK

- Each finding fix is a discrete, file-scoped, additive edit, so rollback is per-finding revert.
- The P0 parser fix is guarded by a TST-1 byte-identity assertion: if that assertion fails the parser change is reverted before any dependent P1 work proceeds.
- Doc-only fixes (agent notes, SKILL.md, command docs) carry no runtime risk and roll back independently of code fixes.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
WS1 (P0 parser) ──> F-P1-4 (executor threading, same file)
WS2 (security)  ──> independent per file
WS3 (traceability) ──> independent per file
WS4 (P2 + verify) ──> after WS1-WS3 (register reflects final state)
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

P0 parser fix and end-to-end verification is the critical path: Lane B does not run correctly until it lands. Everything else is fix-before-promote hardening that can proceed in parallel once the parser is correct.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criterion |
|-----------|----------------|
| M1 P0 closed | Lane B command reaches benchmark-complete through the YAML path; space-form test green |
| M2 Security closed | All 5 security P1s fixed with adversarial tests; criteria-exec fail-closed |
| M3 Traceability closed | All 11 traceability P1s fixed; agent notes repointed |
| M4 P2 dispositioned + verified | 16 P2 dispositioned; vitest green; TST-1 holds |
<!-- /ANCHOR:milestones -->

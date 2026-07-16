---
title: "Spec: 028 Playbook Findings Remediation [template:level_2/spec.md]"
description: "Remediation spec for the real product findings surfaced by the daemon-skills playbook validation (packet 011) and the core memory-search-intelligence re-run. The fixes were authored by gpt-5.5-fast high in eight clusters in worktree wt/0008-findings-remediation, each verified by vitest, typecheck, mutation checks on the risky fixes, comment hygiene and alignment drift, then landed on the 028 review-branch mainline. Isolation and harness artifacts are excluded. The code is verified per cluster and landed on the 028 review-branch mainline (system-speckit/029-memory-search-intelligence), pending a whole-suite run across all clusters together before the 028 branch merges to main."
trigger_phrases:
  - "playbook findings remediation"
  - "028 remediation cluster fixes"
  - "memory-search advisor code-graph remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-release-cleanup/012-playbook-findings-remediation"
    last_updated_at: "2026-07-04T17:31:28.233Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the remediation objective and scope across the eight clusters"
    next_safe_action: "Run the whole suite across all clusters together before the 028 review branch merges to main"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-25-spec-012-playbook-findings-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: 028 Playbook Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | COMPLETE, code verified per cluster, landed on the 028 review-branch mainline; whole-suite run before the branch merges to main remains open |
| **Created** | 2026-06-25 |
| **Phase** | 012 of 012 |
| **Branch** | Authored in worktree `wt/0008-findings-remediation`; landed on the 028 review-branch mainline `system-speckit/029-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../011-daemon-skills-playbook-validation/spec.md |
| **Successor** | ../013-drift-remediation/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The daemon-skills playbook validation (packet 011) plus the core memory-search-intelligence re-run surfaced about twenty-two real product findings across the four subsystems. They span schema drift where production code references columns the schema lacks, a dominant dead-wiring class where features are implemented and unit-tested but never hooked into the runtime, a retrievalLevel parameter the pipeline never honored, two ordering contract violations, a cluster of advisor persistence and routing regressions, three DB lifecycle gaps and a set of code-graph and quality issues. Packet 011 planned the fixes but did not apply them. The findings were live until this packet landed them.

### Purpose
Fix every real product finding from the validation, exclude the isolation and harness artifacts that were not bugs and verify each fix before claiming it. The deliverable is the remediated code plus this packet documenting which finding each fix closes and the evidence that proves it. The fixes were implemented by gpt-5.5-fast high working cluster by cluster in an isolated worktree, each cluster verified by vitest plus typecheck plus mutation checks on the risky fixes plus the comment-hygiene and alignment-drift gates, then committed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cluster A schema drift, the F11 source_kind select guard and the F12 consumption_log query_hash alignment.
- Cluster B the dead-wiring class, five features wired into the runtime (F8 scoring observability, F10 LLM backfill, llm-reformulation, query-surrogates, contextual-tree).
- Cluster C retrievalLevel honored end to end, including the strict public input schema field that was rejecting the param pre-handler.
- Cluster D ordering, the F13 folder-rank primary sort and the channel minimum-representation reservation.
- Cluster E advisor persistence and routing, the F1 through F6 fixes.
- Cluster F DB lifecycle, the db-path standardization plus a new end-to-end test over the pre-existing cross-process rebind, and the embedding-retry e2e.
- Cluster G and H code-graph write-local refresh plus quality cleanup (duplicate helper, stale tests, entity dedup, 7-layer metadata).
- The follow-up tests for B4, B5 and the C strict-schema assertion.

### Out of Scope
- The six isolation and harness artifacts that were not product bugs (see implementation-summary.md).
- Any production default flip beyond what a finding's fix requires.
- The whole-suite run across all clusters together and the eventual merge of the 028 review branch to main, which remain open and are the next safe action.

| Surface | File Path | Change Type |
|---------|-----------|-------------|
| This packet | `012-playbook-findings-remediation/*` | Add |
| Memory-search source | `lib/storage`, `lib/scoring`, `lib/search`, `handlers`, `formatters`, `schemas`, `lib/providers` | Fix |
| Advisor source | `lib/scorer`, `lib/skill-graph`, `lib/lifecycle`, `handlers`, `tools`, `scripts` | Fix |
| Code-graph source | `system-code-graph/mcp_server/lib` | Fix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR1 Every real product finding from the validation is fixed at its source.
- FR2 Each fix carries a test that fails when the fix is reverted, with mutation checks on the risky fixes.
- FR3 The six isolation and harness artifacts are excluded and recorded as not bugs.
- FR4 Each cluster is committed separately so the remediation reads finding by finding.

### Non-Functional
- NFR1 No fix flips a production default beyond what its finding requires.
- NFR2 Each cluster passes typecheck, comment hygiene and alignment drift before it is committed.
- NFR3 The fixes stay on the 028 review-branch mainline until a whole-suite run across all clusters together clears the 028 branch for merge to main.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC1 All eight clusters fixed, each with a per-cluster vitest pass recorded.
- SC2 Each risky fix mutation-checked, so the distinguishing test is confirmed to fail when the fix is reverted.
- SC3 Typecheck, comment hygiene and alignment drift clean on every touched surface.
- SC4 The excluded artifacts named so the remediation scope reads correctly.
- SC5 The open state stated honestly: code verified per cluster and landed on the 028 review-branch mainline, with a whole-suite run across all clusters together (before the 028 branch merges to main) pending.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| A fix passes its own test but breaks a neighbor | Regression | Full blast-radius vitest sweep per cluster, not just the changed file |
| A schema or wiring fix reads green without proving the bug was real | False fix | Mutation check that reintroduces the bad column or drops the registration and confirms the test goes red |
| The isolated worktree node_modules diverge from the real repo | Suite cannot run | Repaired the worktree workspace resolution to run the integration suites |
| Per-cluster green is mistaken for merge-ready | Premature merge | The whole-suite run across all clusters together is held open as the gate before the 028 review branch merges to main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The one open item is operational, not a decision: run the whole suite across all clusters together before the 028 review branch merges to main. The code is verified per cluster and landed on the 028 review-branch mainline.

<!-- ANCHOR:nfr -->
### Non-Functional Requirements Detail

| Aspect | Target | Result |
|--------|--------|--------|
| Per-cluster verification | vitest plus typecheck plus hygiene plus drift | Met for all eight clusters |
| Mutation coverage on risky fixes | Distinguishing test fails when reverted | Met for the schema, security, rollback, ordering and DB-lifecycle fixes |
| Default safety | No unrequested default flip | Met, fixes change only the finding's path |
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
### Edge Cases

- A narrow or legacy memory_index schema lacks source_kind, so the merge select must emit NULL rather than fail. Cluster A guards this with a PRAGMA table_info probe.
- An omitted retrievalLevel must default to auto, and the cache key must include the level so local and global cannot cross-contaminate. Cluster C handles both.
- A channel whose best candidate sits below the quality floor must still reserve one top-k slot without breaking the floor for the rest. Cluster D reserves it.
- The disabled-hook force-native path must error native-unavailable with a non-zero exit rather than silently succeed. Cluster E F6 closes this.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
### Complexity Notes

The remediation is complex because the findings cluster by failure mode, not by file. The dead-wiring class spans five separate call sites across the search pipeline, the schema drift spans two write paths against two tables, and the advisor persistence cluster touches the scorer lanes, the skill-graph DB, the lifecycle rollback and the CLI manifest at once. Each cluster was verified against its full blast radius rather than the single changed file, and the risky fixes were mutation-checked so a green test could not hide a fix that never proved the bug.
<!-- /ANCHOR:complexity -->

<!-- /ANCHOR:questions -->

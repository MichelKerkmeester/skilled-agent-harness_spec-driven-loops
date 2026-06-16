---
title: "Feature Specification: Fresh+Regression Deep-Review Remediation"
description: "Remediate the verified findings from the 027 fresh+regression deep-review (75 seats, three models): 5 adversarially-confirmed code defects (save-lock liveness, history-rebuild transaction, causal-generation bump, launcher TTL, provenance carry), a host-confirmed parent-metadata drift cluster, and ~19 cited-but-unverified doc-truth P1s to confirm-then-fix."
trigger_phrases:
  - "fresh regression remediation"
  - "027 review round 3 remediation"
  - "save-lock twin remediation"
  - "parent metadata drift remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded remediation packet from fresh-regression-75 verified findings"
    next_safe_action: "Confirm each asserted doc-truth P1, then fix the 5 code defects first"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fresh+Regression Deep-Review Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (findings verified; no fixes applied) |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 004-residual-design-units |
| **Successor** | None |
| **Handoff Criteria** | Each confirmed code defect fixed with a regression test; each parent-metadata drift reconciled; each asserted doc P1 confirmed-then-fixed or refuted. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This packet remediates the verified output of the third independent deep-review of the 027 epic — the **fresh+regression** round (`review/fresh-regression-75/`): 75 single-pass read-only seats across Opus 4.8 (claude2), GPT-5.5-fast and Kimi K2.7 (cli-opencode), with opposite-model adversarial Round-2 verification of every code-defect P1. That review found **0 P0** and reduced 16 code-defect P1 candidates to **5 confirmed** (7 downgraded, 3 refuted, 1 unverified), plus a host-confirmed parent-metadata drift cluster.

**Scope Boundary**: Only the deep-review's verified/cited findings. Does NOT reopen prior epic-sweep findings; does NOT touch refuted findings. The 7 Round-2 downgrades land in the P2 backlog, not here.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Three independent review rounds keep surfacing the same two failure classes on newer phases: (1) small write-path / lifecycle code defects that escaped per-phase verification, and (2) control-metadata (description.json / spec.md phase maps / graph-metadata pointers) drifting ahead of or behind shipped code. This packet fixes the confirmed instances and confirms-then-fixes the cited-but-unverified ones, so the epic can reach a clean release-readiness state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**
- 5 confirmed code defects: `spec-folder-mutex.ts:37`, `history.ts:103`, `vector-index-mutations.ts:101`, `mk-code-index-launcher.cjs:839`, `pe-gating.ts:351`.
- Parent-metadata drift: 3 omitted children (000/003/004 description.json + 000 spec.md), stale phase-parent pointers, feature-catalog 37→39 tool count.
- ~19 asserted doc-truth P1s (confirm each against cited file:line, then fix or mark refuted).
- 1 unverified P1 (`validate.sh:1062` CONTINUITY_FRESHNESS claim) — re-verify.

**Out of scope**
- The 3 refuted findings (advisor `--trusted` gating, reconsolidation default-off, benchmark stderr).
- The ~80 P2 advisory surface (separate backlog).
- Any new feature work.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** — Port the `generate-context.ts` save-lock liveness pattern (pid `process.kill(p,0)` gate + mtime heartbeat; reap only on dead/unknown) into `spec-folder-mutex.ts`.
- **R2** — Wrap the legacy history-table rebuild in a transaction so a mid-migration crash cannot lose the audit log.
- **R3** — Bump the causal-edges generation on the delete sweep path (`vector-index-mutations.ts`), restoring the epic-sweep fix-#4 invariant for deletes.
- **R4** — Retune the `mk-code-index-launcher` bootstrap-lock so the reclaim threshold ≤ the wait deadline (dead-socket respawn unblocked); apply the same audit to `mk-spec-memory-launcher`.
- **R5** — Preserve the manual `source_kind` carry through `pe-gating.ts` append-version/supersede paths.
- **R6** — Reconcile parent control metadata: add the 3 omitted children to their `description.json`/`spec.md`, refresh stale pointers, correct the tool count to the live `TOOL_DEFINITIONS.length`.
- **R7** — For each asserted doc-truth P1, open the cited file:line; fix if confirmed, mark refuted with reason otherwise.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 5 confirmed code defects fixed, each with a regression test asserting the corrected behaviour; full stack gate green with a captured baseline→after delta.
- Parent metadata reconciled; `validate.sh --strict --recursive` clean for the 027 tree.
- Every asserted doc P1 resolved (fixed or refuted-with-reason); registry updated.
- No regression to the prior epic-sweep remediations.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Save-lock and launcher changes touch live daemon lifecycle — require the isolated test-daemon harness, not live recycles.
- Causal-generation and provenance fixes touch default-path write code — gate behind regression tests before any deploy.
- The ~19 asserted P1s may include false positives (Round-2 refuted 3 of 16 code candidates); confirm before fixing.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the downgraded socket-trust P2s (`spec-memory-cli.ts:753`, `code-index-cli.ts:924`) be hardened now or deferred (single-user dev tool; server already enforces uid)?
<!-- /ANCHOR:questions -->

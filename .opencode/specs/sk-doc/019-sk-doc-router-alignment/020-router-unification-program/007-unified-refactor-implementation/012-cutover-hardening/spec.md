---
title: "Feature Specification: Compiled-Routing Cutover Hardening"
description: "Remediated the nine deep-review findings (7 P1 + 2 P2) on the P4b compiled-routing cutover: crash-safe tuple ownership, harness isolation, activation confinement, evidence reconciliation, and contract centralization. All nine are now built and verified; a fresh deep-review is recommended as follow-up."
trigger_phrases:
  - "cutover hardening"
  - "deep-review remediation router"
  - "fenced-CAS crash safety"
  - "serving flip lock recovery"
importance_tier: "high"
contextType: "implementation"
---
# Feature Specification: Compiled-Routing Cutover Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete — all nine deep-review findings (7 P1 + 2 P2) are built and verified: `node --check` clean on all 7 touched runtime files, harness `verify-runtime-engine.cjs` 9/9, LIVE activation tree byte-identical before/after (git-dirty 0). A fresh `/deep:review` has NOT yet been run over these fixes (the prior review is what surfaced them) — recommended as follow-up |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A 10-iteration `/deep:review` of the P4b compiled-routing cutover (the runtime engine `011-runtime-engine`, the activation layer `010-live-activation`, and the regression harness added in the same review cycle) returned **CONDITIONAL**: 0 P0, 7 P1, 2 P2. The routing correctness itself is sound — the review's ruled-out list confirms the discriminated-union decision shape is consistent, a hash/generation mismatch fails safe to legacy, and no P0 survived adversarial replay. The seven P1s are robustness, evidence, and isolation gaps, six of them in code added during the fix cycle. None blocks the shipped cutover (flag default-off, fail-safe, reversible), but each is independently closable before a PASS.

### Purpose
Closed the nine findings in risk order — the two zero-risk quick wins first (doc reconciliation and contract centralization), then the harness-integrity gaps, then the coordinated crash-safety / single-writer-ownership change, then the activation trust boundary — without weakening the proven routing correctness or touching the frozen benchmark scorer.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — the nine findings

| ID | Sev | Finding | Site |
|----|-----|---------|------|
| P1-001 | P1 | Interrupted serving flip is not reconciled (crash between manifest/fence/record renames → half-committed tuple the idempotent no-op accepts) | `011/lib/flip-serving.cjs` |
| P1-002 | P1 | Regression harness cleanup can erase a concurrent activation change (unconditional whole-tree restore) | `011/harness/verify-runtime-engine.cjs` |
| P1-003 | P1 | Activation identifiers unconstrained before effects (`--hub` traversal + `--child` canary executed pre-validation) | `010/lib/activate-hub.cjs` |
| P1-004 | P1 | Canonical release-readiness claims conflict (checklist overstates advisor-hook enforcement + sweep vs spec) | `010/checklist.md`, `010/spec.md` |
| P1-006 | P1 | Harness omits both-decision and isolated hash/generation-mismatch rows | `011/harness/verify-runtime-engine.cjs` |
| P1-007 | P1 | Activation bypasses the serving-flip lock (two writers can consume one epoch) | `010/lib/activate-hub.cjs`, `011/lib/flip-serving.cjs` |
| P1-008 | P1 | Crash-left lock has no safe recovery (PID-only, no lease/reclaim) | `011/lib/flip-serving.cjs` |
| P2-005 | P2 | Frozen-scorer digest authority duplicated across two writers | `011/lib/flip-serving.cjs`, `010/lib/activate-hub.cjs` |
| P2-009 | P2 | Process-lifetime engine cache lacks a refresh contract | `011/lib/compiled-route.cjs`, `011/lib/resolve.cjs` |

### Out of Scope
- The three shipped fixes' proven behavior (discriminated union, fenced-CAS binding, snapshot-identity fail-safe) — confirmed correct, not re-litigated.
- Any edit to the frozen benchmark scorer (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) — the pinned digests are preserved byte-for-byte.
- Enabling `SPECKIT_COMPILED_ROUTING` — the cutover stays flag-default-off and reversible throughout.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every touched file keeps its proven behavior and the three frozen scorer digests unchanged | `harness/verify-runtime-engine.cjs` stays green (9/9, grown from 6/6 as later tranches added fixtures); a reset→reflip of every hub stays byte-exact; the three pinned digests are byte-identical before and after |

### P1 — Required (this packet's tranche 1: the two quick wins)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Reconcile P1-004 — the `010` checklist must not claim more than the spec + impl-summaries support | The checklist states advisor-hook machine-enforcement is *in progress* (enrichment committed, flag-off byte-parity proven), and frames the post-flip sweep as the bounded 2-prompt-per-hub sample it was, citing `real-model/<hub>/verdict.json`; spec and checklist no longer contradict |
| REQ-003 | Close P2-005 — one authoritative frozen-scorer digest contract | A single read-only module exports the pinned digests + a phase-parameterized `assertScorerFrozen`; `flip-serving.cjs` and `activate-hub.cjs` both import it and embed no local digest copy; both gates still throw on drift with phase-specific messages |

### P1 — Required (tranches 2-4: crash-safety, harness, trust boundary, cache lifecycle — now built)

| ID | Requirement | Acceptance Evidence |
|----|-------------|---------------------|
| REQ-004 | Crash-safe tuple ownership + lock reclaim (P1-001, P1-007, P1-008) | **Satisfied.** `shared/hub-lock.cjs` (new) is the single per-hub lock — owner identity (pid + random nonce + timestamp) + 10-min lease; both `flip-serving.cjs` and `activate-hub.cjs` take it. `reconcileTuple()` in `flip-serving.cjs` runs on the idempotent no-op path under that lock, rebuilding a half-committed tuple from the manifest. Harness: shared-lock live-holder refused, shared-lock stale-holder reclaimed (part of 9/9). Teeth: sk-code's serving-flip-record deleted in a sandbox → `flip-serving --hub sk-code` prints "ALREADY-COMPILED (reconciled: serving-flip-record)", rebuilds with `reconciled:true` |
| REQ-005 | Deterministic regression evidence (P1-002, P1-006) | **Satisfied.** `verify-runtime-engine.cjs` rewritten to run entirely against a temp SANDBOX copy of `activation/` via a new `SPECKIT_ACTIVATION_ROOT_OVERRIDE` env hook (added to `flip-serving.cjs` and `resolve.cjs`); LIVE `010-live-activation/activation` tree byte-identical before/after a harness run (git-dirty 0). Harness adds explicit both-decision coverage and a serve-time identity-MISMATCH fixture (tampered manifest fails safe to legacy); part of the 9/9 pass |
| REQ-006 | Activation trust boundary (P1-003) | **Satisfied.** `confineArgs()` in `activate-hub.cjs` runs before any side effect: hub id must match `^[a-z0-9][a-z0-9-]*$`, the hub dir must resolve inside the activation root, `--child` must resolve inside the repo. Teeth: `activate-hub --hub "../../evil"` fails with "unsafe hub id" before any effect |
| REQ-007 | Engine cache lifecycle (P2-009) | **Satisfied.** `compiled-route.cjs` — the process-lifetime engine cache is now a documented contract (comment); safe because the resolver's serve-time identity gate fails a drifted snapshot to legacy, and a restart picks up a new policy |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `010` spec and checklist agree on the release-readiness boundary, and every retained evidence claim is traceable to a committed artifact [REQ-002].
- **SC-002**: The frozen-scorer digest authority exists in exactly one module; the two lifecycle writers import it and cannot drift independently [REQ-003].
- **SC-003**: No regression — `verify-runtime-engine.cjs` stays green (9/9, grown from 6/6), reset→reflip stays byte-exact for all seven hubs, and the three pinned digests are unchanged [REQ-001].
- **SC-004**: The remaining four requirements (REQ-004..007, covering the seven previously-deferred findings) are now built and verified — `node --check` clean on 7 files, harness 9/9, LIVE activation tree untouched (git-dirty 0) [satisfied].

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `010-live-activation/checklist.md` (CHK-051, Completion Boundary) | REQ-002's reconciliation edits a sibling packet's doc, not this packet's own | Read-only intake of the sibling's `spec.md` + both impl-summaries before editing; only the checklist's claim is corrected, no evidence is invented |
| Dependency | The two inline frozen-scorer digest copies in `flip-serving.cjs` and `activate-hub.cjs` | REQ-003's extraction must not change either gate's behavior | The shared module is a pure extract-and-import; both gates keep their own `assertScorerFrozen` call and phase-specific failure message |
| Risk | A downward doc correction could be misread as regressing prior work | Confuses "the code path is fine" with "the doc overstated it" | The checklist correction narrows only the claim (advisor-hook enforcement, sweep breadth); the underlying flag-off inertness and byte-identical routing proof are untouched |
| Risk (resolved) | The seven previously-deferred findings were real robustness gaps until built | A reader could have assumed CONDITIONAL → PASS meant all nine findings were closed before they actually were | Resolved this session: `spec.md` REQ-004..007 and `tasks.md` T003-T009 now record built-and-verified evidence (harness 9/9, `node --check` clean on 7 files, live tree untouched); a fresh `/deep:review` is recommended as follow-up since the prior review is what surfaced these findings |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

No NFRs beyond REQ-001 (every touched file keeps its proven behavior and the three frozen-scorer digests stay byte-identical before and after).

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Re-running `assertScorerFrozen` after the extraction against a hub whose scorer is already frozen: no-op pass, identical to the pre-extraction inline check.
- A future third writer that needs the frozen-scorer gate: it imports `shared/frozen-scorer-contract.cjs` directly rather than adding a fourth inline copy — the module exists precisely to close that reuse gap.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One doc correction and one pure extract-and-import refactor touching four files across two sibling folders plus one new shared module; no new routing decision |
| Risk | 5/25 | Touches no live routing, manifest write, or the frozen scorer itself; both changes are reversible via `git revert` |
| Research | 4/20 | Both fixes are fully specified by the deep-review findings; no open design question |
| **Total** | **17/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. All nine findings were fully specified by the deep-review findings and built without an open design question surfacing. The one follow-up item — a fresh `/deep:review` pass over the nine fixes — is tracked as a recommendation, not an open question.

<!-- /ANCHOR:questions -->

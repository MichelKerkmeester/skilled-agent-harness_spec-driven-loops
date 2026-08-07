---
title: "Feature Specification: Routing Regression Diagnosis and Disposition"
description: "Diagnose the reproduced -2 routing regression on holdout top-1, holdout top-3 and the delegation bucket, attribute it to a commit, and decide fix-versus-accept — before any re-pin, status flip, or metadata regeneration is allowed to run."
trigger_phrases:
  - "routing regression diagnosis"
  - "holdout accuracy dropped"
  - "delegation bucket regression"
  - "do not re-pin the baseline"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/013-routing-regression-diagnosis"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Diagnosed and fixed the routing regression"
    next_safe_action: "Proceed to phase 014"
    blockers: []
    key_files:
      - "spec.md"
      - "diagnosis-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/013-routing-regression-diagnosis"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Caused, not inherited: the pin was captured at the baseline sha at 53/72 and the in-range rename commit moved it"
      - "Disposition is fix, not accept: the cause is a stale hardcoded delegation-scorer path, restored by a one-line correction"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Routing Regression Diagnosis and Disposition

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The program closed claiming corpus neutrality, and that claim is false. Running the program's own capture script at HEAD against a byte-identical corpus reproduces a two-point drop on holdout top-1, holdout top-3 and the delegation bucket, with live holdout top-1 at 0.7083 sitting below the repository's own declared release floor of 0.725. This phase measures, attributes and dispositions that regression, and blocks every sibling phase that would otherwise reconcile status over it. Its hardest rule is negative: no baseline artifact may be re-pinned while it is open, because re-pinning would bake the drop in as the new last-known-good and destroy the evidence that anything moved.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The program closed claiming corpus neutrality. That claim is false, and the failure is measurable today.

Running the program's own capture script at the current HEAD, against corpus files whose hashes are byte-identical to the pinned baseline, reproduces a **-2 movement on three metrics**:

| Metric | Pinned baseline | Live at HEAD | Delta |
|---|---|---|---|
| `holdout_top1` | 53/72 = 0.7361 | 51/72 = 0.7083 | **-2** |
| `holdout_top3` | 55/72 = 0.7639 | 53/72 = 0.7361 | **-2** |
| `buckets.delegation` | 10/11 | 8/11 | **-2** |
| `full_corpus_top1` | 151/195 | 151/195 | zero |
| `full_corpus_top3` | 176/195 | 176/195 | zero |
| `ambiguity_top1` | 17/24 | 17/24 | zero |

Pins live at `002-baseline-capture/baseline/capture-top3.json:12-16` (top-3) and `002-baseline-capture/baseline/routing-baseline.json:36,60,84,86` (top-1 and buckets). The live figures above were reproduced independently twice.

Live `holdout_top1` at 0.7083 sits **below the repository's own declared release floor** of 0.725 (`system-skill-advisor/mcp-server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:30`).

Three things made this invisible. First, the program's final capture reports no `holdout_top1` row at all, so the metric that moved was never displayed. Second, the one test that pins holdout exactly and enforces the floors fails 5 of 7 today and is wired into no workflow — phase 014 owns that. Third, the phase 012 checklist marks the "no unexplained top-1/top-3 regression" item complete against evidence that does not support it — phase 015 owns that.

Four independent audit legs and the synthesis that followed all missed this, because every leg read documents and none executed a measurement. The synthesis went further and actively mischaracterised the evidence, concluding "this is not evidence of a routing regression" — a conclusion this phase exists to correct.

The three regressed prompts are all `cli-*` delegation cases. Since the baseline sha, the only changed routing inputs are 18 skill-root metadata files and three advisor scorer files (`executor-delegation.ts`, `lanes/lexical.ts`, `scorer/projection.ts`), all inside the program's commit range, and no post-close commit touched either surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — reproducing the full metric set at HEAD and recording it as evidence; bisecting the -2 across the program's commit range over both changed surfaces (the 18 skill-root `description.json`/`graph-metadata.json` files and the three advisor scorer sources); identifying the specific prompts that changed prediction and the specific input change responsible for each; producing a disposition decision (fix the scorer, fix the metadata, or accept with recorded rationale) backed by that attribution; and, if the disposition is fix, landing the fix behind the same corpus gate the program used.

Out of scope — re-pinning any baseline artifact (explicitly forbidden until this phase closes, see Risks); repairing or wiring the ratchet test (phase 014); rewriting checklist evidence (phase 015); regenerating packet metadata or flipping any Status field (phase 016); documentation path corrections (phase 017); dispositioning the audit's other findings (phase 018).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The current live metric set is captured as durable evidence before any change | A results artifact records `full_corpus_top1`, `full_corpus_top3`, `holdout_top1`, `holdout_top3`, `ambiguity_top1` and all three named buckets at HEAD, with the corpus file hashes alongside, proving the measurement ran against the pinned corpus and not a drifted one |
| REQ-002 | Every prompt whose prediction changed since the baseline is enumerated | The diagnosis names each changed prompt, its expected skill, its baseline prediction and its current prediction — not an aggregate count. A delta of -2 that turns out to be four changes netting to -2 must be reported as four |
| REQ-003 | The -2 is attributed to a specific input change | A bisect over the program's commit range identifies which commit or commits move each affected prompt, distinguishing the metadata surface from the scorer surface. Where a prompt's movement cannot be attributed to a commit in range, the diagnosis states UNKNOWN rather than assigning blame by proximity |
| REQ-004 | Whether the regression was caused or inherited is answered with evidence | The baseline sha is checked out and measured, establishing whether `holdout_top1` was already 51/72 before the program began. This distinguishes "the program caused it" from "the program shipped over it" — both are defects, but they have different fixes |
| REQ-005 | A disposition is recorded with rationale | The decision record states fix-scorer, fix-metadata, or accept-with-rationale, and justifies it against the attribution. Accept is permitted only with an explicit statement of why the lost delegation accuracy is tolerable, signed off by the operator — never as a default because fixing is harder |
| REQ-006 | If the disposition is fix, the fix is corpus-gated and restores the metrics | The full metric set is re-measured after the fix; `holdout_top1` returns to at least 53/72, `holdout_top3` to at least 55/72, and the delegation bucket to at least 10/11, with no other metric regressing. If a partial restoration is the best available, the shortfall is stated numerically, not described as "improved" |
| REQ-007 | No baseline artifact is re-pinned during this phase | `capture-scorer-eval-baseline.mjs --write` is not run, and no file under `002-baseline-capture/baseline/` is modified. The phase closes with the original pins intact so that the delta remains provable by anyone re-running the measurement later |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

The live metric set is recorded with corpus hashes; every changed prompt is enumerated individually with its baseline and current prediction; each is attributed to a commit or explicitly marked UNKNOWN; the caused-versus-inherited question is answered by measuring the baseline sha directly; a disposition is recorded with rationale and, where it is accept, with operator sign-off; if fixed, all three regressed metrics are restored to at least their pinned values with no new regression elsewhere; and every baseline artifact is byte-identical to its pre-phase state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | **Re-pinning the baseline would launder the regression.** Running `capture-scorer-eval-baseline.mjs --write` bakes the -2 in as the new last-known-good and permanently destroys the evidence that anything moved | REQ-007 forbids it for the duration of this phase. Any later re-pin happens only after disposition, and records the pre-pin values in the same commit |
| Risk | A sibling remediation phase flips Status fields to Complete before this phase resolves, converting a visible inconsistency into an invisible one | Phase 016 is sequenced strictly after this phase and states that dependency in its own spec. Status reconciliation follows measurement, never leads it |
| Risk | Bisecting over two surfaces at once could attribute a metadata-caused movement to a scorer commit | REQ-003 requires the surfaces to be distinguished; where a commit touches both, the bisect isolates them by reverting one surface at a time |
| Risk | The corpus itself changed after the baseline, making the comparison invalid | REQ-001 records corpus hashes with the measurement; the reproduction to date confirms they match the pin. If a future run finds drift, the comparison is void and the corpus change is diagnosed first |
| Dependency | None. This phase is the entry point of the remediation program and blocks phases 015 and 016 | — |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

The measurement must be reproducible by anyone else on the same commit: every figure this phase records carries the corpus hashes it was measured against, so a later reader can tell a scorer change from a corpus change. The diagnosis must remain non-destructive — it reads and measures, and the only write it is permitted before disposition is its own evidence artifact. Attribution must be honest about its limits: where a prompt's movement cannot be traced to a commit in range, the phase records UNKNOWN rather than assigning blame by proximity.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

If the corpus hashes no longer match the pin, the comparison is void and the corpus change is diagnosed first rather than reported as a scorer regression. If the net delta of two turns out to be four movements cancelling to two, all four are reported individually. If the baseline sha already measured 51/72, the program inherited rather than caused the drop — still a defect, since it shipped under a zero-delta claim, but a different fix. If a single commit touches both the metadata and scorer surfaces, the bisect isolates them by reverting one surface at a time rather than attributing to the commit as a whole. If the disposition is accept, the phase closes with the metrics still below the pin, and both the shortfall and the operator sign-off are recorded numerically.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

The measurement itself is cheap — one script, seconds to run. The complexity is in attribution across two independently-changing surfaces, and in the judgement call the disposition requires. The blast radius is high: the scorer is live shared code that every routing decision passes through, and the metadata surface spans eighteen files. That combination — cheap to measure, hard to attribute, expensive to get wrong — is why this phase is Level 3 despite a likely small diff.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk | Likelihood | Impact | Response |
|------|-----------|--------|----------|
| A re-pin runs before disposition and launders the regression | Medium | Critical | Forbidden by requirement; the prohibition is repeated in the plan, the tasks and this phase's continuity so it survives a context loss |
| A sibling phase flips status to Complete while this is open | Medium | High | Both dependent phases name this blocker in their own continuity, not only here |
| Attribution lands on the wrong surface | Medium | Medium | Surfaces are reverted one at a time rather than bisected together |
| The disposition defaults to accept because fixing is harder | Low | High | Accept requires an explicit written rationale and operator sign-off; it is never the default |
| The corpus drifted, invalidating the whole comparison | Low | High | Hashes are recorded with every measurement and checked before any conclusion |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

As the operator, I need to know whether routing accuracy actually dropped, by how much, and because of what — so that I can decide whether to fix it or accept it deliberately rather than discovering it later from a user report. As the next engineer to touch this scorer, I need the pinned baseline left intact, so that I can reproduce the delta myself instead of inheriting a number someone already reconciled away. As a reviewer of this packet, I need the disposition and its rationale written down, so that an accepted regression is visibly a decision rather than an oversight.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

Both questions this phase opened are now answered and closed. The program **caused** the regression rather than inheriting it: the pin was captured directly at the baseline sha and recorded a healthy 53/72 and 10/11, and the in-range rename commit `9efb3fc5612` is what moved the number (REQ-004). The disposition is **fix, not accept**: the attribution (REQ-003) is an unambiguous stale hardcoded path in the delegation scorer, not a deliberate trade-off, so a one-line correction restores every metric to its pin.

**Amendment A-001 (REQ-004 acceptance).** REQ-004's literal criterion — "the baseline sha is checked out and measured" — was satisfied by the *recorded* baseline-sha capture rather than a fresh re-checkout. The mcp-server `package.json` is gitignored and not tracked at `1e0ad1d9ba`, so its build toolchain cannot be reconstructed at that sha; a live rebuild there is infeasible. The pin is itself the baseline-sha measurement (its `capturedAtSha` is `1e0ad1d9ba`), the corpus hashes are byte-identical, and the fix restores the pinned values exactly — which together settle caused-versus-inherited more strongly than a rebuild would. Deviation recorded here per the program's amendment rule.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `plan.md` — architecture, sequencing and rollback
- `tasks.md` — execution order
- `checklist.md` — verification gates
- `decision-record.md` — the three decisions governing this phase
- `../spec.md` — parent program

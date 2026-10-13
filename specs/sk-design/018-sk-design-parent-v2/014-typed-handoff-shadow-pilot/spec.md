---
title: "Feature Specification: sk-design live routing fixes and typed-handoff shadow pilot"
description: "Two live defects sit under the compiled sk-design hub: rule 6 in the sk-design SKILL.md contradicts the hub's own contract, and canary-router.cjs calls an undefined compareText so a VALUES/REVIEW tie throws and silently falls back to legacy. This packet fixes both as a live precursor, then measures a shadow-only TypedHandoffV1 pilot against a frozen baseline."
trigger_phrases:
  - "sk-design typed handoff"
  - "compareText crash fix"
  - "sk-design rule 6 compiled routing"
  - "typed-handoff shadow pilot"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design live routing fixes and typed-handoff shadow pilot

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-23 |
| **Branch** | `worktrees/062-typed-handoff-shadow-pilot` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-fix-sk-design-for-compiled-routing |
| **Successor** | None |
| **Handoff Criteria** | The precursor serves compiled on the new identity, and the pilot verdict is recorded. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the sk-design live routing fixes and typed-handoff shadow pilot specification.

**Scope Boundary**: Fix the two live routing defects under the compiled sk-design hub, then measure a shadow-only TypedHandoffV1 pilot against a frozen baseline. The four-action decision algebra, `defaultMode` and every other hub stay untouched, and nothing the pilot builds is published.

**Dependencies**:
- 013 is complete: sk-design is the seventh compiled-routing hub, and its four sources are hashed into the policy identity the precursor has to re-mint.
- The live generation-1 activation: a re-mint selects the generation the shadow-child snapshot carries, which is `canary-cases.v1.json` `activationGeneration: 1`, so the generation stays 1 and only the hash changes.

**Deliverables**:
- The precursor fixes: a local `compareText` in `canary-router.cjs` with its tie test, and the corrected rule 6 in `.skilled/skills/sk-design/SKILL.md` with both manifests re-minted at generation 1.
- The pilot module: `validateTypedHandoff` and `evaluateWithHandoff` in `.skilled/bin/lib/compiled-route-handoff.cjs`.
- Tests and fixture: `.skilled/bin/tests/compiled-route-handoff.test.cjs` and `.skilled/bin/tests/fixtures/compiled-route-handoff-cases.v1.json`.
- The shadow verdict with `014/handover.md` from `templates/addons/handover.md.tmpl`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two live defects sit under the compiled sk-design hub, and the first one is not docs-only. Rule 6 of `.skilled/skills/sk-design/SKILL.md` contradicts the §2 contract at lines 48-52, and those bytes are one of four sources hashed into the policy identity, so serving recompiles from them and a hash mismatch falls back to legacy. Correcting the rule therefore re-mints the identity rather than editing prose.

The second defect is a crash. `canary-router.cjs:251` calls `compareText`, which is defined only in `registry-compiler.cjs:73`, so a VALUES/REVIEW tie throws and the caller silently falls back to legacy. It reproduces today: `--prompt "design review of the spacing"` returns the legacy sentinel, and no test imports `canary-router.cjs`.

### Purpose

Both defects are fixed before the baseline is frozen, then a shadow-only TypedHandoffV1 pilot is measured against that baseline and its verdict recorded, with no live route changed by the pilot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The live precursor: the `compareText` fix with its negative-control test, and the rule 6 correction with a re-mint at generation 1 and both manifests byte-equal.
- A shadow-only TypedHandoffV1 pilot: record validation, one bounded hop of evaluation and a controlled fixture, all off-closure beside `compiled-route-admission.cjs`.
- A frozen baseline of the new identity in `014/scratch/baseline-*.txt`, taken after the precursor lands and before the pilot is built.
- A shadow run of baseline and candidate on identical inputs, with rates reported as n/N and deltas written to `014/scratch/`, plus a fresh read-only second-lens audit of the evidence and the diff.
- The verdict in `014/handover.md`, with the GO conditions of the pasted plan plus one of its own: every frozen SHA-256 matches the baseline.

### Out of Scope
- Other hubs, because the pilot is one hub and shadow-only.
- `defaultMode` changes and live recovery policy. A GO authorizes only a separate decision about live one-hop recovery, which gets a new packet.
- The serving-prior refresh gap, owned by `041/019` and planned but not built. Its consequence is named in the risks below.
- The pre-existing `REFERENCES` and SD-007 debts.
- Main's unrelated dirty files.
- Any edit to `canonical.cjs`, whose `DOMAIN_TAGS` is frozen and whose `hashArtifact` throws on an unknown tag. `routeId` stays a pilot-local `sha256` of a local prefix plus `canonicalBytes(...)`.
- A synthetic `handoffHops: 1` policy. It would change the policy hash and the shared compiler rejects `handoffEdges`, so the budget is an evaluator option and identity binds to the live selected policy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs` | Modify | Add a local `compareText` byte-identical to `registry-compiler.cjs:73` |
| `.skilled/bin/lib/compiled-routing/` | Modify | The promoted `canary-router.cjs` copy, rebuilt through `compiled-route-sync.cjs` by swapping the root |
| `.skilled/bin/tests/compiled-route-sk-design-tie.test.cjs` | Create | `node:test` tie test requiring the promoted copy. It must fail before sync |
| `.skilled/skills/sk-design/SKILL.md` | Modify | Replace rule 6 at lines 202-203 so it matches the §2 contract at lines 48-52 |
| `…/013-live-activation/activation/sk-design/manifest.json` | Modify | The authored manifest. `compiled-route-manifest.cjs refresh` re-mints at generation 1 and the runtime manifest is copied over it |
| `.skilled/bin/lib/compiled-route-handoff.cjs` | Create | `validateTypedHandoff` and `evaluateWithHandoff`, off-closure beside `compiled-route-admission.cjs` |
| `.skilled/bin/tests/compiled-route-handoff.test.cjs` | Create | Validator and evaluator tests: an accepted hop, a second hop, a loop, the turn limit and a throw |
| `.skilled/bin/tests/fixtures/compiled-route-handoff-cases.v1.json` | Create | The controlled shadow cases, with handoff records supplied by the fixture rather than inferred |
| `014/scratch/` | Create | Frozen `baseline-*.txt` and the raw shadow-run output |
| `014/handover.md` | Create | The verdict, from `templates/addons/handover.md.tmpl` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The authored `canary-router.cjs` defines a local `compareText` byte-identical to `registry-compiler.cjs:73`, so a VALUES/REVIEW tie routes instead of throwing into the legacy fallback. |
| REQ-002 | `.skilled/bin/tests/compiled-route-sk-design-tie.test.cjs` asserts that the tie prompt routes and does not throw, and fails before sync as the negative control. |
| REQ-003 | Rule 6 in `.skilled/skills/sk-design/SKILL.md` matches the §2 contract at lines 48-52: quote a compiled decision only when the front door returns one, and on the sentinel or an error use the routing below. |
| REQ-004 | The re-mint keeps generation 1 and changes only the hash, and freshness then reports the new hash at generation 1 with the authored manifest byte-equal to the runtime one. |
| REQ-005 | `validateTypedHandoff(record, ctx)` accepts only a closed record of exactly five fields, with `reason` of `wrong-door` or `incomplete-route` and `evidence` of `{requestFactsHash, baseAction, baseMode, source: 'shadow'}`, rejecting extra or missing fields, unknown or self modes, bad evidence and identity mismatch. |
| REQ-006 | `evaluateWithHandoff(snapshot, input, record, budget)` makes at most one extra `evaluateCanary(snapshot, {prompt, explicitMode: toMode})` call, returns one of `accepted`, `invalid-record`, `loop`, `hop-limit`, `user-turn-limit` or `fail-closed`, never mutates state and never returns a live route, and on a throw returns the base decision marked fail-closed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `.skilled/bin/tests/fixtures/compiled-route-handoff-cases.v1.json` holds the controlled cases with fixture-supplied handoff records, and `runShadow(cases)` runs baseline and candidate on identical inputs and writes raw n/N plus deltas to `014/scratch/`. |
| REQ-008 | Identity binds to the live selected policy with the hop budget as an evaluator option, so no synthetic `handoffHops: 1` policy changes the policy hash and `canonical.cjs` is not edited. |
| REQ-009 | Every frozen SHA-256 from the baseline matches at verdict time, as an added GO condition alongside the pasted plan's own. |
| REQ-010 | `014/handover.md` from `templates/addons/handover.md.tmpl` has the six required sections, keeps confirmed facts separate from proposals, and states the exact next action. |
| REQ-011 | Code comments introduced by this packet carry durable rationale only, with no ephemeral ids or spec paths on added lines. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/bin/tests/compiled-route-sk-design-tie.test.cjs` passes, having failed before sync as the negative control.
- **SC-002**: `node --test .skilled/bin/tests/compiled-route-handoff.test.cjs` passes and `node --test .skilled/bin/tests/compiled-route-admission.test.cjs` stays green with the corpus still at 80.
- **SC-003**: `node .skilled/bin/compiled-route-status.cjs --all --no-probe --pretty` reports 7 of 7 compiled-serving and 0 stale, with sk-design showing the new hash at generation 1 and the other six unchanged.
- **SC-004**: `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "create a flowchart for the approval path"` returns a diagram route, and `--prompt "design review of the spacing"` returns a route rather than the legacy sentinel.
- **SC-005**: With `SPECKIT_COMPILED_ROUTING=0` and then `=BOGUS`, the front door returns `{"servingAuthority":"legacy","hubId":"sk-design"}` both times.
- **SC-006**: `compiled-route-manifest.cjs freshness` reports fresh with the authored manifest byte-equal to the runtime one, `check-no-spec-imports.cjs` is clean, `compiled-route-sync.cjs --check` shows the closure file set unchanged with `compiled-route-handoff` absent, and the foundation suite passes under `vitest run --config vitest.config.bin.ts`.
- **SC-007**: `validate.sh <014> --strict` returns `RESULT: PASSED` on main, and the comment-hygiene grep over added code lines returns no matches.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 013 complete: the live sk-design hub at generation 1 | Without it there is no identity to fix, freeze or re-mint | Confirm 013 is Complete and probe status before the precursor |
| Dependency | `canary-cases.v1.json` `activationGeneration: 1` | A re-mint selecting another generation would freeze the wrong identity | Refresh selects the generation the shadow-child snapshot carries, and freshness must report generation 1 |
| Risk | The tie fix silently changes live routing | High | Reproduce the legacy sentinel first as the negative control, then route both named prompts |
| Risk | The rule 6 edit changes the policy hash and drifts the hub to legacy | High | Re-mint in the same change and require freshness plus byte-equal manifests before commit |
| Risk | Rollback through `flip-serving.cjs --rollback` restores a hash the engine no longer builds, landing the hub on legacy by accident | High | Use `git revert` of the precursor plus `SPECKIT_COMPILED_ROUTING=0`; the serving-prior gap is owned by `041/019` |
| Risk | The corpus is too small for the GO gate as written: `canary-cases.v1.json` is 8 cases and the admission test pins 80 | Medium | Controlled cases go in the pilot-local fixture and rates are reported as n/N |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Shadow evaluation is bounded to at most one extra `evaluateCanary` call per handoff record, with the hop budget an evaluator option rather than a policy input.

### Security
- **NFR-S01**: The pilot is shadow-only. It never mutates state, never returns a live route and publishes nothing to the closure.
- **NFR-S02**: `check-no-spec-imports.cjs` stays clean and `compiled-route-sync.cjs --check` keeps `compiled-route-handoff` out of the closure file set.

### Reliability
- **NFR-R01**: A throw anywhere in the evaluator returns the base decision marked fail-closed instead of failing into the routing path.
- **NFR-R02**: The precursor re-mint is byte-idempotent at commit time: the pre-commit `gate:route-remint` re-run produces the same hash at generation 1 and stages both manifests.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Tie input: a VALUES/REVIEW tie routes through the local `compareText` instead of throwing.
- Handoff record with extra or missing fields: rejected as `invalid-record` before any evaluation.
- Handoff record naming an unknown or self mode: rejected as bad evidence.

### Error Scenarios
- A throw inside `evaluateWithHandoff`: the base decision returns marked fail-closed, and no live route is ever produced.
- A second hop, a loop, or exhausted budgets: the outcomes `loop`, `hop-limit` and `user-turn-limit` end the shadow evaluation without touching state.
- Identity mismatch between the record's `requestFactsHash` and the live selected policy: rejected as bad evidence.

### State Transitions
- Baseline to candidate: inputs are identical, and every frozen SHA-256 must still match before the verdict counts.
- Precursor to merge: main serves the change only after the merge, with `git revert <precursor>` and `SPECKIT_COMPILED_ROUTING=0` as the rollback.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Two precursor fixes, one off-closure pilot module, two test files, one fixture and one verdict |
| Risk | 17/25 | Live serving identity changes under the precursor, and the tie fix can silently change routing |
| Research | 12/20 | Eight pasted-plan assumptions were wrong or missing, and the corpus is too small for the GO gate as written |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether live one-hop recovery proceeds is not decided here: a GO authorizes only that separate decision, in a new packet.
- Whether the serving-prior refresh gap is fixed belongs to `041/019`, which has planned it and not built it.
<!-- /ANCHOR:questions -->

---

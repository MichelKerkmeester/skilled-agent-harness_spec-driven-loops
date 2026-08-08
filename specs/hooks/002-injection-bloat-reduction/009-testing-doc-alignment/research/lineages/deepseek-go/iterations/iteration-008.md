# Iteration 8: Independent re-verification of the P1 count finding + step-1 suite state

## Focus

Independently re-run both suites referenced by `spec-mutation-gate-enforce.md` and separate the injection-bloat-caused staleness from pre-existing worktree drift, so the must-fix list contains only change-derived staleness.

## Findings

### F29 — P1 must-fix confirmed by independent re-run: core suite is 87, playbook says 67

Second, independent run (fresh process, `env -u AI_SESSION_CHILD -u MK_SPEC_GATE_ENFORCE -u MK_SPEC_GATE_DISABLED`):

```text
ℹ tests 87
ℹ pass 87
ℹ fail 0
```

This reproduces F6 exactly. The authoritative Gate-3 playbook's step-2 expected signal `# tests 67, # pass 67` (`spec-mutation-gate-enforce.md:57-63`) is stale — it must read 87. The drift is injection-bloat-caused: the epoch>=1/observer tests added by the shadow-delivery work expanded the suite from 67 to 87 (commit `78ef96ae6b` claimed 84; the live suite is 87, with `rg -c "test("` = 88 call sites).

### F30 — Step-1 suite (mk-spec-gate.test.cjs) count is still 11, but the WS4 test's import path is a PRE-EXISTING drift, not injection-bloat-caused

Re-run of step 1: `ℹ tests 11`, but **6 fail** in this worktree. Root cause: the WS4 test block (`mk-spec-gate.test.cjs:362-371`) imports `spec-gate-core.mjs` from `skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` — a path that was consolidated away by `57c3ed338ca` ("refactor(hooks): consolidate spec-kit runtime/ hooks"). That commit is an ancestor of HEAD; the test was never updated. The real core lives at `mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs`.

This is NOT staleness against the changed injection-bloat behavior — it is a pre-existing test-path drift from the earlier hooks consolidation. The playbook's step-1 count assertion (`# tests 11`) is still arithmetically correct; whether the suite passes in this worktree depends on the pre-existing broken import. I record it as an OUT-OF-SCOPE note (the sweep targets change-derived staleness), not a must-fix.

### F31 — Scope boundary restated: the sweep's must-fix set is exactly one item

After 8 iterations, the only change-derived stale playbook assertion in the repo is the core-suite count (67→87) plus the child-env neutrality note on the same step. Everything else is either omission-stale catalogs (P2) or pre-existing drift outside the injection-bloat change (out of scope). The frozen-behavior constraint flagged zero items (nothing documents the frozen contract as active).

## Sources Consulted

- [SOURCE: independent re-run spec-gate-core.test.mjs → 87/87]
- [SOURCE: re-run mk-spec-gate.test.cjs → 11 tests, 6 fail from WS4 import path]
- [SOURCE: .opencode/plugins/tests/mk-spec-gate.test.cjs:362-371; git 57c3ed338ca]
- [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs run count]

## Assessment

newInfoRatio: 0.15
noveltyJustification: F29 independently confirms the P1 count finding; F30 cleanly separates pre-existing worktree drift from change-derived staleness, strengthening the scope boundary. F31 restates the final must-fix set.

Key questions answered: Q1-Q5 (all closed; F30 adds an explicit out-of-scope classification).

## Reflection

What worked: running both suites twice with identical results, plus git ancestry checks on the WS4 import path, cleanly separated the two failure classes.

What failed / ruled out: Ruled out the step-1 WS4 failure as injection-bloat-caused (pre-existing consolidation drift). Ruled out any further change-derived playbook staleness.

## Recommended Next Focus

Iteration 9: Final breadth check — confirm the luna sibling lineage reached its synthesis (or is still running), verify no additional catalog entries exist under `system-spec-kit/feature-catalog/` describing the spec-gate README's updated contents, and lock the findings registry in preparation for synthesis.

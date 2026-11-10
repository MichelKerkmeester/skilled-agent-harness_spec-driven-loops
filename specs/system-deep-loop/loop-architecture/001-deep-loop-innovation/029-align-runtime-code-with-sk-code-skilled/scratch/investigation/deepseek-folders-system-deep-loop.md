| folder | code files | verdict MERGE->target or STAY | reason |
|---|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/lib/authority-root` | 2 | STAY | Shared resolver imported by two independent domains (`deep-loop/fanout-effect-dispatch.ts` and `mode-append-gateway/append-mode-event.ts`), so neither consumer can own it. |
| `.skilled/skills/system-deep-loop/runtime/lib/cutover-binding` | 2 | MERGE->`lib/mode-append-gateway` | No README; `resolve-cutover-binding.ts` is imported only by `mode-append-gateway/append-mode-event.ts`, so it is that gateway's private helper. |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-authority` | 2 | MERGE->`lib/per-mode-authority-flip` | No README; `composition.ts` is a ~40-line mode-specific wrapper over `per-mode-authority-flip` with no independent consumer. |
| `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway` | 2 | STAY | Standalone mode-level append boundary with a public barrel and its own `tests/unit/mode-append-gateway.vitest.ts`. |
| `.skilled/skills/system-deep-loop/runtime/scripts/lib` | 1 | STAY | `scripts/lib/README.md` declares it the CLI-infrastructure boundary, explicitly narrower than `lib/`. |
| `.skilled/skills/system-deep-loop/runtime/scripts/tests` | 1 | MERGE->`tests/` | No README; a lone `runtime-bootstrap.test.cjs` belongs in the runtime test tree it duplicates. |
| `.skilled/skills/system-deep-loop/runtime/tests/helpers` | 2 | STAY | `tests/helpers/README.md` declares shared child-process helpers used by multiple suites. |
| `.skilled/skills/system-deep-loop/runtime/tests/lifecycle` | 1 | STAY | `tests/lifecycle/README.md` declares a distinct DB open/close + writer-lock lifecycle suite. |
| `.skilled/skills/system-deep-loop/runtime/tests/hierarchical-budgets` | 1 | STAY | `tests/hierarchical-budgets/README.md` declares the budget-authority suite, the only budget test suite (absent from `tests/unit`). |
| `.skilled/skills/system-deep-loop/runtime/tests/fixtures/council-value/data` | 1 | MERGE->`tests/fixtures/council-value` | `scenarios.cjs` is required only by the parent's `seed-helpers.ts`; the README calls it a data-only module of that fixture. |

Overlapping sibling pairs:

- `lib/dispatch-receipts/` ↔ `lib/receipts-and-effect-recovery/` — both own "receipts".
- `lib/result-envelopes/` ↔ `lib/event-envelope/` — both are payload-wrapping "envelopes".
- `lib/authority-root/` ↔ `lib/per-mode-authority-flip/` ↔ `lib/deep-research-authority/` — three sibling "authority" domains.
- `lib/legacy-projections/` ↔ `lib/transactional-projections/` — both are "projection" engines.
- `lib/mode-append-gateway/` ↔ `lib/mode-contracts/` — both "mode"-scoped.

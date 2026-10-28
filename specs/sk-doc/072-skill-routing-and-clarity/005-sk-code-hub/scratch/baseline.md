# Baseline: Phase 5 gate set before any edit

Captured 2026-10-28 between 11:30 and 11:34, before the first edit of this phase, in worktree `257-single-vocabulary-source`. The phase's own commit is `782195b82b`; the after run in `after.md` is taken from it. Runner: `specs/sk-doc/072-skill-routing-and-clarity/005-sk-code-hub/scratch/gates.sh`. Raw logs: `.scratch-dc90/072-005/baseline/`.

## 1. Gate set

All 34 gates exit 0.

| Gate | Exit |
|------|------|
| psc-cli-classifier | 0 |
| psc-cli-external-orchestration | 0 |
| psc-mcp-tooling | 0 |
| psc-sk-code | 0 |
| psc-sk-design | 0 |
| psc-sk-doc | 0 |
| psc-system-deep-loop | 0 |
| route-guard | 0 |
| route-sync-check | 0 |
| verify-router-sync | 0 |
| pkg-cli-classifier | 0 |
| pkg-cli-external-orchestration | 0 |
| pkg-cli-orca | 0 |
| pkg-mcp-code-mode | 0 |
| pkg-mcp-tooling | 0 |
| pkg-sk-code | 0 |
| pkg-sk-design | 0 |
| pkg-sk-doc | 0 |
| pkg-sk-git | 0 |
| pkg-sk-prompt | 0 |
| pkg-sk-vision | 0 |
| pkg-system-deep-loop | 0 |
| pkg-system-skill-advisor | 0 |
| pkg-system-spec-kit | 0 |
| rule-copies | 0 |
| router-reach | 0 |
| hermes | 0 |
| sk-code-setup | 0 |
| root-metadata | 0 |
| leaf-manifest | 0 |
| router-tests | 0 |
| accuracy | 0 |
| validate | 0 |
| contract-drift | 0 |

Key numbers:
- Routing accuracy (`capture-scorer-eval-baseline.mjs`): full 155/195 (0.7949), holdout 49/66 (0.7424), ambiguity 19/24 (0.7917), unknown_count 13.
- `compiled-route-guard.cjs --json`: 7 of 7 hubs `fresh`, failures 0.
- Router reach: wrong-hub 0, outranked 0, no-reach 0, allowed 9, across 7 hubs.
- router-tests: pass 40, fail 0.
- parent-skill-check: every hub `all hard invariants passed, 0 warnings`.
- `validate.sh --recursive --strict`: `RESULT: PASSED`.

## 2. The canon debt this phase closes

The routing-shape ledger at the start of the phase held four sk-code entries. `maxSmartRoutingLines` is 12 and `maxSmartRoutingWords` is 180.

| Ledger key | SMART ROUTING lines | words | machine blocks | Codes |
|------------|--------------------|-------|----------------|-------|
| `sk-code` | 67 | 787 | 1 | RS-001, RS-002 |
| `sk-code/sk-code-quality` | 102 | 1760 | 1 | RS-001, RS-002 |
| `sk-code/sk-code-review` | 312 | 2104 | 1 | RS-001, RS-002 |
| `sk-code/sk-code-skilled` | 118 | 327 | 1 | RS-001, RS-002 |

RS-001 is a SMART ROUTING section over the line or word limit; RS-002 is a machine router block outside a final `## MACHINE ROUTER` section. `sk-code-ci` is absent from the ledger because its SMART ROUTING is already 3 lines and 99 words with its machine router last.

The review packet carries 5,676 words against the 5,000-word ceiling, and `## 3. HOW IT WORKS` starts at line 415: the first instruction follows 312 lines of routing.

Phase 004 left one item open. Its stage-gap probe (`.scratch-dc90/072-004/tools/gap.cjs`, run against this tree) prints `sk-code stageGap 92 aliasGap 0 kwTrig 0 intents 12`: 92 stage-one terms in `hub-router.json` that no `ROUTER.md` intent in the owning packet names. Every other hub prints 0.

## 3. The three routing authorities, before the change

The phase 001 research finding 2 holds at this baseline:

- The hub says `mode-registry.json` is "the single source of truth" (`.skilled/skills/sk-code/SKILL.md` §2).
- Review says "Keep Section 2 (`SMART ROUTING`) as the authoritative routing source" (`.skilled/skills/sk-code/sk-code-review/SKILL.md`).
- `ROUTER.md` says its §9 "is the byte-for-byte source a deterministic router parses".

Finding 1's structural point also holds, after phase 002 removed the rows that had no §9 key: §2 is still a second keyword table, and its terms no longer match §9 in either direction. `VERIFICATION` carries `done`, `complete`, `works` and `fixed` in §2 and `alignment drift` and `completion claim` in §9; `IMPLEMENTATION` carries `script` in §2 and `authoring` in §9; `DEBUGGING` carries `fix`, `bug` and `error` in §2 and `regression` in §9. The §2 phase boost names `testing`, an intent §9 does not carry.

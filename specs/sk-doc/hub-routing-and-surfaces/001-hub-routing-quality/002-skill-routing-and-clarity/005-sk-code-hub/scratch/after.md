# After: Phase 5 gate set, final state

Captured 2026-10-28 at this phase's commit `782195b82b` in worktree `257-single-vocabulary-source`. Runner: `specs/sk-doc/072-skill-routing-and-clarity/005-sk-code-hub/scratch/gates.sh`. Raw logs: `.scratch-dc90/072-005/after/`; the table below was re-run from the commit. Baseline: `baseline.md`.

## 1. Gate set, before and after

35 of 35 exit 0. The 34 baseline gates are unchanged, and the advisor routing suites are the one gate the baseline did not run.

| Gate | Before (exit) | After (exit) |
|------|------|------|
| psc-cli-classifier | 0 | 0 |
| psc-cli-external-orchestration | 0 | 0 |
| psc-mcp-tooling | 0 | 0 |
| psc-sk-code | 0 | 0 |
| psc-sk-design | 0 | 0 |
| psc-sk-doc | 0 | 0 |
| psc-system-deep-loop | 0 | 0 |
| route-guard | 0 | 0 |
| route-sync-check | 0 | 0 |
| verify-router-sync | 0 | 0 |
| pkg-cli-classifier | 0 | 0 |
| pkg-cli-external-orchestration | 0 | 0 |
| pkg-cli-orca | 0 | 0 |
| pkg-mcp-code-mode | 0 | 0 |
| pkg-mcp-tooling | 0 | 0 |
| pkg-sk-code | 0 | 0 |
| pkg-sk-design | 0 | 0 |
| pkg-sk-doc | 0 | 0 |
| pkg-sk-git | 0 | 0 |
| pkg-sk-prompt | 0 | 0 |
| pkg-sk-vision | 0 | 0 |
| pkg-system-deep-loop | 0 | 0 |
| pkg-system-skill-advisor | 0 | 0 |
| pkg-system-spec-kit | 0 | 0 |
| rule-copies | 0 | 0 |
| router-reach | 0 | 0 |
| hermes | 0 | 0 |
| sk-code-setup | 0 | 0 |
| root-metadata | 0 | 0 |
| leaf-manifest | 0 | 0 |
| router-tests | 0 | 0 |
| accuracy | 0 | 0 |
| validate | 0 | 0 |
| contract-drift | 0 | 0 |
| advisor-routing-suites | n/a (not in the baseline runner) | 0 |

| Number | Before | After |
|--------|--------|-------|
| Routing accuracy, full / holdout / ambiguity | 155/195, 49/66, 19/24 | 155/195, 49/66, 19/24 |
| compiled-route-guard | 7 of 7 fresh | 7 of 7 fresh (sk-code re-minted) |
| Router reach | wrong-hub 0, outranked 0, no-reach 0, allowed 9 | wrong-hub 0, outranked 0, no-reach 0, allowed 9 |
| router-tests | pass 40, fail 0 | pass 40, fail 0 |
| validate.sh --recursive --strict | `RESULT: PASSED` | `RESULT: PASSED` |

## 2. Canon proof with an empty ledger

The ledger at `ROUTING_SHAPE_DEBT_FILE` carried an empty `debt` map (limits 12 lines and 180 words), so every entry had to earn its place:

```text
$ ROUTING_SHAPE_DEBT_FILE=<empty ledger> node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code
PASS: 12b-routing-shape: hub and 4 packet(s) follow the routing canon (0 known debt)
OK: parent-skill-check — all hard invariants passed, 0 warnings
```

`package_skill.py --check --strict` on each of the four packets:

| Packet | Result | Advisory |
|--------|--------|----------|
| sk-code-quality | `Result: PASS` | SKILL.md 4,203 words (recommended max 3,000) |
| sk-code-skilled | `Result: PASS` | description 256 chars (soft target 130) |
| sk-code-review | `Result: PASS` | SKILL.md 4,297 words (recommended max 3,000) |
| sk-code-ci | `Result: PASS` | description 158 chars (soft target 130) |

The four sk-code entries are gone from `routing-shape-known-debt.json`. The check passes with the shipped ledger and with the empty one, so no sk-code debt remains.

## 3. Routing shape, before and after

Counted the way `package_skill.py` counts: non-blank lines between the SMART ROUTING heading and the next heading, excluding `---`.

| File | SMART ROUTING lines | words | Machine block |
|------|--------------------|-------|---------------|
| `.skilled/skills/sk-code/SKILL.md` | 67 → 3 | 787 → 143 | in §2 → `## 6. MACHINE ROUTER`, last |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | 102 → 8 | 1760 → 147 | in §2 → `## 9. MACHINE ROUTER`, last |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | 118 → 3 | 327 → 112 | in §2b → `## 6. MACHINE ROUTER`, last |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | 312 → 8 | 2104 → 130 | in §2 → `## 10. MACHINE ROUTER`, last |
| `.skilled/skills/sk-code/sk-code-ci/SKILL.md` | 3 → 3 | 99 → 99 | `MACHINE ROUTER`, last (unchanged) |

Every section is inside the 12-line and 180-word limits, and no machine block sits outside a final `## MACHINE ROUTER`. `sk-code-ci` already met both, so it was not edited.

## 4. Review's word count and pinned lines

`sk-code-review/SKILL.md` is 4,297 words against the 5,000-word ceiling, down from 5,676. `## 3. HOW IT WORKS` now starts at line 63 instead of 415.

The Extension Floors section is byte-identical to the commit before this phase: `diff` of `### Extension Floors` through the next `## ` heading between `782195b82b^` and `HEAD` prints nothing.

`check-rule-copies.js`:

```text
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
```

`tests/check-rule-copies.test.sh` prints `All rule-canary test cases passed`, exit 0.

## 5. Routing authority and ROUTER.md section 2

`grep -i 'authoritative routing source' .skilled/skills/sk-code` finds nothing. The three claims in `baseline.md` §3 are replaced by one: `SKILL.md` §2 names `hub-router.json` as the mode vocabulary and `ROUTER.md` as the leaf-set router, and both files point back at that sentence.

`ROUTER.md` §2 no longer carries a keyword table. It points at the `INTENT_SIGNALS` block in §9, and the phase boost reads `verification, debugging, code quality`; `testing` is gone. §9 is unchanged.

## 6. The 92 stage-one terms

Phase 004's stage-gap probe (`.scratch-dc90/072-004/tools/gap.cjs`) still prints `sk-code stageGap 92 aliasGap 0 kwTrig 0 intents 12`. This phase does not carry those terms into `ROUTER.md`; the reason is recorded as a key decision in `implementation-summary.md`.

# After: phase 003 gates, suites and acceptance evidence

Recorded 2026-10-28 from the final working tree, after the Hermes sync, the sk-doc compiled-route refresh, the skill-graph export and repair-derived. Logs: `.scratch-dc90/072-003/after/`, `after-extra/`, `ac/`, `fleet/`.

## 1. Gate delta against `baseline.md`

| Gate | Before | After |
|------|--------|-------|
| parent-skill-check, 7 hubs | 0 x 7, all hard invariants passed | 0 x 7, all hard invariants passed, plus a `PASS: 12b-routing-shape` line per hub |
| compiled-route-guard --json | 0, 7 fresh | 0, 7 fresh, `"failures": 0` (sk-doc refreshed; it went stale on the sk-create-skill version step) |
| compiled-route-sync --check | 0, 55 copies match | 0, 55 copies match |
| verify-router-sync | 0, 5/5 | 0, 5/5 |
| package_skill --check --strict, 14 roots | 0 x 14 PASS | 0 x 14 PASS |
| check-rule-copies | 0, OK | 0, same OK line |
| router reach | 0, wrong-hub=0 outranked=0 no-reach=0 | 0, identical counts |
| Hermes --check | 0, 67 in sync | 0, 67 in sync (2 copies rewritten by the sync) |
| sk-code-setup-check | 0, legs=9 | 0, legs=9 |
| skill-root metadata | 0, 14/14 | 0, 14/14 |
| leaf-manifest freshness | 0, 14/14 | 0, 14/14 |
| router tests (8 files) | 0, 40/40 | 0, 40/40 |
| routing accuracy | 0, 155/195, 49/66, 19/24 | 0, identical output |
| validate.sh 072 --recursive --strict | 0, 12 x PASSED | 0, 12 x PASSED |

No gate is worse than before.

## 2. Suites outside the gate set (against `before.md`)

| Suite | Before | After |
|-------|--------|-------|
| sk-doc Python tests | 247 passed | 256 passed (+9 in `test_routing_shape.py`) |
| parent-skill-check tests | 112/112 | 113/113 (+1 `parent-skill-check-routing-shape.test.cjs`) |
| sk-create-skill node tests | 70/71, create-journey-proof failing | 71/71 |
| package_skill --strict, every mode packet | 41 PASS, 1 FAIL | 41 PASS, 1 FAIL (the same sk-code-review word limit) |

## 3. Acceptance evidence

**AC-001, proof packet.** `sk-code/sk-code-ci`: SMART ROUTING is 3 lines of prose, and the python block moved byte for byte into a final `## MACHINE ROUTER`. `verify-router-sync` 5/5 (leg 2 reads this packet's RESOURCE_MAP through `parseRouter`, so the appendix is read), `package_skill.py --check --strict` PASS, `parent-skill-check .skilled/skills/sk-code` OK with `12b-routing-shape: hub and 4 packet(s) ... (4 known debt)`, where sk-code-ci is not in debt.

**AC-002, tests fail without the change.**
- `test_routing_shape.py` against a copy of HEAD `package_skill.py` in the same layout: `9 errors`; against the new file: `9 passed`.
- `parent-skill-check-routing-shape.test.cjs` against a copy of the HEAD checker: `fail 1`; against the new checker: `pass 1`.
- `create-journey-proof.test.cjs` failed before (`3j` on the quoted `allowed-tools`) and passes after the scaffold fix.

**AC-003, templates.** `skill-md-template.md` Section 2 guidance names the three skill kinds, the 12-line limit, the final MACHINE ROUTER section and the codes, with one worked example. The scaffolds and `parent-skill-hub-template.md` show the shape.

**AC-004, fresh creation, no hand edit to shape.** `init_skill.py proof-solo` and `init_skill.py proof-hub --kind parent` (the scaffolders both create workflows run). The only strict finding is the TODO description, which the workflow fills in. With the description line replaced and nothing else changed: package_skill --strict PASS for `proof-solo`, `proof-hub` and `proof-hub-primary`; `parent-skill-check proof-hub` OK with `PASS: 12b-routing-shape: hub and 1 packet(s) follow the routing canon (0 known debt)`. The last H2 of all three is `## MACHINE ROUTER`.

**AC-005, fleet run.** parent-skill-check exits 0 on all 7 hubs, with 47 `INFO: 12b-routing-shape` known-debt lines. package_skill --strict over all 14 roots and 42 packets reports known debt on 53 and fails only sk-code-review, on its existing word limit. The ledger has 54 entries and no private names.

**AC-006, old-shape skill fixture.** A fresh standalone with its router block moved back inside SMART ROUTING:
- new package_skill --strict: exit 1, `RS-001: SMART ROUTING section has 48 lines (max 12)`, `RS-002: machine router block at line 37 ...`
- HEAD package_skill --strict: exit 0, `Result: PASS`

**AC-007, old-shape parent fixture.** A fresh parent hub whose packet has the same old shape:
- new parent-skill-check: exit 1, `FAIL: 12b-routing-shape: proof-hub/proof-hub-primary: routing shape RS-001 ...` and `RS-002 ...`
- HEAD parent-skill-check: exit 0, OK
- A packet holding `ROUTER.md`: exit 1, `RS-004`, from both checks.

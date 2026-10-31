# After: phase 003 gates, suites and acceptance evidence

Recorded 2026-10-28 from the final working tree, after the Hermes sync, the sk-doc compiled-route refresh, the skill-graph export and repair-derived. Every row names the command that reproduces it; the gate set runs through `scratch/gates.sh <log-dir>`. The raw logs were kept outside the repository and are not part of the record. Sections 1 to 3 are the first pass; section 4 is the review-fix pass, which supersedes them where they differ.

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

**AC-004, fresh creation, no hand edit to shape.** First pass, corrected in section 4: `init_skill.py proof-solo` and `init_skill.py proof-hub --kind parent`. Only `/create:skill` runs `init_skill.py`; `/create:skill-parent` authors from `parent-skill-hub-template.md` instead. The only strict finding is the TODO description, which the workflow fills in. With the description line replaced and nothing else changed: package_skill --strict PASS for `proof-solo`, `proof-hub` and `proof-hub-primary`; `parent-skill-check proof-hub` OK with `PASS: 12b-routing-shape: hub and 1 packet(s) follow the routing canon (0 known debt)`. The last H2 of all three is `## MACHINE ROUTER`.

**AC-005, fleet run.** parent-skill-check exits 0 on all 7 hubs, with 47 `INFO: 12b-routing-shape` known-debt lines. package_skill --strict over all 14 roots and 42 packets reports known debt on 53 and fails only sk-code-review, on its existing word limit. The ledger has 54 entries and no private names.

**AC-006, old-shape skill fixture.** A fresh standalone with its router block moved back inside SMART ROUTING:
- new package_skill --strict: exit 1, `RS-001: SMART ROUTING section has 48 lines (max 12)`, `RS-002: machine router block at line 37 ...`
- HEAD package_skill --strict: exit 0, `Result: PASS`

**AC-007, old-shape parent fixture.** A fresh parent hub whose packet has the same old shape:
- new parent-skill-check: exit 1, `FAIL: 12b-routing-shape: proof-hub/proof-hub-primary: routing shape RS-001 ...` and `RS-002 ...`
- HEAD parent-skill-check: exit 0, OK
- A packet holding `ROUTER.md`: exit 1, `RS-004`, from both checks.

## 4. Review-fix pass

A fresh review of the phase commit returned 3 P1 and 9 P2 findings. All twelve are fixed. The gate set was rerun from the final tree with `scratch/gates.sh`.

### 4.1 Gate delta against `baseline.md`

| Gate | Baseline | After the fixes |
|------|----------|-----------------|
| parent-skill-check, 7 hubs | 0 x 7 | 0 x 7, all hard invariants passed |
| compiled-route-guard --json | 0, 7 fresh | 0, `"failures": 0` |
| compiled-route-sync --check | 0, 55 match | 0, `all 55 served copies match their authored files` |
| verify-router-sync | 0, 5/5 | 0, 5/5 |
| package_skill --check --strict, 14 roots | 0 x 14 PASS | 0 x 14 PASS |
| check-rule-copies | 0 | 0 |
| router reach | 0, PASSED | 0, `RESULT: PASSED` |
| Hermes --check | 0, 67 in sync | 0, 67 in sync (the sync wrote 0 copies: no SKILL.md changed) |
| sk-code-setup-check | 0, legs=9 | 0, legs=9 |
| skill-root metadata | 0, 14/14 | 0, 14/14 |
| leaf-manifest freshness | 0, 14/14 | 0, 14/14 |
| router tests (8 files) | 0, 40/40 | 0, 40/40 |
| routing accuracy | 0, 155/195, 49/66, 19/24 | 0, 155/195, 49/66, 19/24 |
| validate.sh 072 --recursive --strict | 0, 12 x PASSED | 0, 12 x PASSED, after repair-derived (the first rerun flagged only this phase's generated metadata, stale after the doc edits) |

### 4.2 Suites outside the gate set

| Suite | Command | Before the fixes | After |
|-------|---------|------------------|-------|
| sk-doc Python tests | `/usr/bin/python3 -m pytest -q -p no:cacheprovider .skilled/skills/sk-doc/scripts/tests/` | 256 passed | 266 passed (`test_routing_shape.py` 9 to 19) |
| parent-skill-check tests | `node --test` over the five `parent-skill-check-*.test.cjs` files | 113/113 | 113/113 (the routing-shape file is one test; its new cases run inside it) |
| sk-create-skill node tests | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` | 71/71 | 76/76 (+1 completion gate, +4 ledger ratchet) |
| Fresh standalone DQI | `init_skill.py proof-solo`, then `extract_structure.py` on its SKILL.md | 66 at the phase commit, 70 before the phase | 70 |

### 4.3 Fail-before evidence

- `test_routing_shape.py` on a `git archive HEAD` copy of sk-doc: 19 errors (the new fixtures need the new constants). With only the two new constant names added to the HEAD copy, 11 of the 19 fail: the debt ratchet, stale, RS-004-not-recorded, machine-block count, outside-root, old integer entry, word cap, indented block, four-backtick fence, checklist block and fenced-heading cases. The invalid-JSON case passes on HEAD too; it is coverage for a behaviour HEAD already had.
- `parent-skill-check-routing-shape.test.cjs` on the HEAD copy: `fail 1`.
- `create-skill-completion-gate.test.cjs` with the HEAD `create-skill-auto.yaml`: `fail 1`; with the new file: `pass 1`.
- `routing-shape-known-debt-ratchet.test.cjs` with one count raised and one key added to the live ledger: `fail 2`; restored: `pass 4`.

### 4.4 The reviewer's reproductions

- sk-doc/sk-create-goal, a debt packet, given a `ROUTER.md`: parent-skill-check exits 1 with `RS-004 ... (not recorded in its known debt)`, and package_skill --strict prints `Result: FAIL`. Before the fix both passed.
- A copy of sk-git outside `.skilled/skills`: package_skill --strict fails on RS-001 (lines and words) and RS-002. Before the fix it passed as debt by basename.
- An old-shape standalone (a fenced `INTENT_SIGNALS` block inside SMART ROUTING): `validate_skill_package.py` exits 0 without `--strict` and 1 with it, and the `/create:skill` blocking gate now passes `--strict`.

### 4.5 Fleet

- The ledger was regenerated from the fleet in the new entry form: 56 SKILL.md files audited (14 roots plus every packet a `mode-registry.json` names), the same 54 keys as before and the same line counts. The frozen snapshot is a byte copy of it.
- Python and Node report the same 138 findings over every hub and packet with an absent ledger. The one new finding the checklist rule adds is system-deep-loop's fenced `UNKNOWN_FALLBACK_CHECKLIST` inside SMART ROUTING, recorded in its entry.
- Fresh scaffolds, with the TODO description filled: package_skill --strict PASS for `proof-solo`, `proof-hub` and `proof-hub-primary`; `validate_skill_package.py proof-solo --strict` exit 0; parent-skill-check on `proof-hub` OK with `12b-routing-shape: hub and 1 packet(s) follow the routing canon (0 known debt)`. Each last H2 is `## 8. MACHINE ROUTER`. The hub scaffold's SMART ROUTING is 6 lines and 75 words after the directive move.

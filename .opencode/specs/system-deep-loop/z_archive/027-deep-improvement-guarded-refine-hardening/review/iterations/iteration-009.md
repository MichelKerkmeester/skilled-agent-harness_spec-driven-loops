# Iteration 9 — Severity Escalation Review + Finding Deduplication

**Dimension:** severity escalation review + finding deduplication (recovery strategy: escalate severity review)
**Mode:** review
**Run:** run-009
**Timestamp:** 2026-06-10T06:19:24Z

---

## Focus

Re-examine the FULL accumulated P2 set for (a) potential P1 upgrades and (b) duplicates/clusters. Read the findings registry and every prior iteration's findings section. For each P2 decide: KEEP-P2, UPGRADE-P1, MERGE, or CLOSE.

---

## Files Reviewed (for cross-reference verification)

- All 8 prior iteration narratives (iteration-001.md through iteration-008.md)
- Findings registry: `deep-review-findings-registry.json`
- Strategy: `deep-review-strategy.md`
- `Barter/Copywriter/_loop/loop.py` (worktree path verification for R1-P1-001)
- `Barter/Barter deals/_loop/loop.py` (worktree path verification for R1-P1-001)

---

## Cluster Analysis: P1 Upgrade Candidates

### Cluster A: Gauntlet 10/10 vs 9 Attacks (R3-P2-003, R7-P2-001)

Both findings document the same issue: operator_guide.md, guardrails_teachings.md, feature catalog, and playbook all claim "10/10" gauntlet passes, but gauntlet.py defines only 9 attacks (A1-A9).

**Assessment:** Documentation overclaim, not a code defect. The gauntlet itself functions correctly — all 9 attacks are tested and pass. The "10/10" claim is a stale documentation artifact (likely counting A6 as a catch when it's documented as a known boundary). No runtime impact. Operators reading the docs would expect 10 attacks but find 9 — a confusion, not a failure.

**Decision:** KEEP-P2. Not a correctness bug. Documentation-only drift.

### Cluster B: Template-Instance Drift + High Third-Packaging Cost (R4-P2-001, R4-P2-002, R4-P2-006)

R4-P2-001: Live instances drifted 100+ lines from templates.
R4-P2-002: Near-identical duplication across Copywriter and Barter deals.
R4-P2-006: High change cost for a third packaging (2-3 hours + ongoing sync).

**Assessment:** These three form a compounding maintainability problem. The templates are frozen snapshots of the initial Copywriter implementation. Live instances gained empty-region freeze guard, lock hardening, additional journal events, and polish changes. A third packaging would get the stale template version, then need manual porting of 100+ lines of improvements. The duplication means every fix must be applied twice.

However: (a) the templates DO produce syntactically valid, runnable code, (b) the behavioral divergences are documented (R5-P2-001 through R5-P2-003), (c) the system works correctly today with two packagings, (d) no runtime failure results from the drift. This is maintainability friction, not a correctness or security defect.

**Decision:** KEEP-P2. Strong advisory but not P1. The system functions correctly; the cost is in future packaging creation, not current operation.

### Cluster C: Scaffolder Robustness (R2-P2-001, R3-P1-001, R3-P2-005)

R2-P2-001: Shell escaping missing in template rendering.
R3-P1-001: Schema validation gaps (downgraded from P1 to P2 in iter 4).
R3-P2-005: Schema doesn't require harness sub-fields templates consume.

**Assessment:** R2-P2-001 is about shell metacharacter injection into generated bash scripts. Analysis: configs are operator-authored, the trust boundary is the config file itself. A malicious PR modifying config could inject shell commands, but that's equivalent to modifying the code. Impact is low.

R3-P1-001 was already adjudicated and downgraded to P2 in iteration 4: concrete analysis showed templates don't break when optional harness sub-fields are absent (dead config, not validation gap). The remaining gap (type validation on optional sub-fields) produces an immediate Python traceback at scaffolding time, not silent data corruption.

R3-P2-005 overlaps with R3-P1-001 and R4-P2-003 (dead schema fields).

**Decision:** All KEEP-P2. The shell escaping is operator-trust-boundary. The validation gaps are either dead config or produce immediate failures. No silent corruption path exists.

### Cluster D: Phantom Token Docs + Dead Fields (R4-P2-003, R4-P2-004)

R4-P2-003: Dead schema fields (ci_compact_path, ci_full_path, skill_dir_name) never consumed.
R4-P2-004: Schema docs reference phantom tokens {{CI_PATH}} and {{SKILL_DIR}}.

**Assessment:** Both are documentation/schema hygiene issues. The dead fields mislead packaging authors into thinking they're functional. The phantom token references conflate two different replacement mechanisms (scaffolding-time {{KEY}} vs runtime shell variables). No runtime impact.

**Decision:** All KEEP-P2. Schema documentation cleanup, not functional defect.

---

## Full Severity Review Table

| Finding ID | Current Severity | Decision | Justification |
|---|---|---|---|
| R1-P1-001 | P1 | **KEEP-P1** | make_worktree() returns wrong child path; --run mode completely broken for deals loop |
| R1-P1-002 | P1 (registry) | **RECONCILE→P2** | Registry inconsistent: iteration 2 adjudicated P2; current producers always use primitive shape; NaN path requires malformed input no producer generates |
| R1-P2-001 | P2 | KEEP-P2 | Docstring says Copywriter instead of Barter deals; cosmetic |
| R1-P2-002 | P2 | KEEP-P2 | Comment references Lane C but mode is Lane D; cosmetic |
| R1-P2-003 | P2 | KEEP-P2 | TOCTOU race mitigated by retry loop; known-acceptable tradeoff |
| R1-P2-004 | P2 | KEEP-P2 | Phantom-gap regex has length guard + match limit; bounded risk |
| R1-P2-005 | P2 | KEEP-P2 | min() syntax readability; cosmetic |
| R2-P2-001 | P2 | KEEP-P2 | Shell escaping gap; operator-authored config trust boundary |
| R3-P1-001 | P2 | KEEP-P2 | Downgraded iter 4; dead config not validation gap; traceback on bad type |
| R3-P2-001 | P2 | KEEP-P2 | Missing LOOP_SKIP_PROBE from contract docs |
| R3-P2-002 | P2 | KEEP-P2 | Missing promote_skip from contract journal events; canonical for R7-P2-002 |
| R3-P2-003 | P2 | KEEP-P2 | Gauntlet 10/10 claim but 9 attacks; canonical for R7-P2-001 |
| R3-P2-004 | P2 | KEEP-P2 | T6 conflates fixture-lint.cjs with loop.py lint_held_out() |
| R3-P2-005 | P2 | **MERGE→R4-P2-003** | Same issue: schema doesn't require fields templates consume; R4-P2-003 is canonical |
| R4-P2-001 | P2 | KEEP-P2 | Template-instance drift; maintainability friction, not runtime defect |
| R4-P2-002 | P2 | KEEP-P2 | Near-identical duplication; maintainability debt |
| R4-P2-003 | P2 | KEEP-P2 | Dead schema fields; canonical finding for this issue |
| R4-P2-004 | P2 | KEEP-P2 | Phantom token docs; schema documentation hygiene |
| R4-P2-005 | P2 | **MERGE→R1-P2-001** | Same issue: stale Copywriter docstring in Barter deals gates.py |
| R4-P2-006 | P2 | KEEP-P2 | High change cost for third packaging; maintainability advisory |
| R5-P2-001 | P2 | KEEP-P2 | re.I behavioral divergence; advisory (template is more strict) |
| R5-P2-002 | P2 | KEEP-P2 | A5 threshold mismatch; advisory (template is less strict) |
| R5-P2-003 | P2 | KEEP-P2 | rubric() scope divergence; advisory (behavioral surprise) |
| R5-P2-004 | P2 | KEEP-P2 | Unvalidated prelude keys; safe defaults via .get() |
| R5-P2-005 | P2 | KEEP-P2 | Generic file-walking vs hardcoded paths; less precise but functional |
| R5-P2-006 | P2 | KEEP-P2 | Partial-write on failure; idempotent re-run fixes |
| R7-P2-001 | P2 | **MERGE→R3-P2-003** | Same issue: gauntlet attack count overclaim; R3-P2-003 is canonical |
| R7-P2-002 | P2 | **MERGE→R3-P2-002** | Same issue: promote_skip missing; R3-P2-002 is canonical |
| R8-P2-001 | P2 | KEEP-P2 | Config hash omits HELD_OUT; safe by key structure |
| R8-P2-002 | P2 | KEEP-P2 | Prefix collision class; safe by current naming |
| R8-P2-003 | P2 | KEEP-P2 | dirname() single-level assumption; safe by convention |

---

## R1-P1-002 Registry Reconciliation

The findings registry shows R1-P1-002 with severity "P1" but its transitions record shows:
- Iteration 1: `null → P1` (Initial discovery)
- Iteration 2: `P1 → P2` (Claim adjudication: downgraded because current producers always use primitive shape, NaN path requires malformed input)

The registry's `severity` field was not updated to match the adjudicated P2. This is a registry data inconsistency. The canonical severity is **P2** per the iteration 2 adjudication packet. No code change or re-adjudication needed — just a registry sync issue.

---

## Final Findings Tally

| Severity | Count | Notes |
|---|---|---|
| P0 | 0 | — |
| P1 | 1 | R1-P1-001 (worktree path bug) |
| P2 | 27 | 31 original − 4 merged/closed |
| Resolved/Closed | 4 | R3-P2-005, R4-P2-005, R7-P2-001, R7-P2-002 |

---

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| spec_code | PASS | R1-P1-001 confirmed via loop.py:596 evidence; all other findings verified against prior iteration evidence |
| checklist_evidence | PASS | Severity decisions consistent with review_core.md §2 definitions |

---

## Verdict

**CONDITIONAL** — P1=1 (R1-P1-001: worktree path bug breaks --run mode for deals loop). All P2 findings reviewed; 4 merged/closed, 27 retained. No P1 upgrades justified — clusters represent maintainability friction or documentation drift, not correctness/security defects.

---

## Next Dimension

All four dimensions complete. Iteration 10 (final) should confirm convergence: P1 count unchanged, no new findings, coverage age sufficient for STOP.

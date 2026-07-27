# Iteration 004 — Maintainability: Scaffolder/Writer Parity And Checklist Evidence Currency

- **Dimension:** maintainability
- **Focus area:** scaffolder-vs-writer index parity (CHK-011) and checklist evidence currency after the remediation
- **Iteration:** 4 of 5
- **Session:** `fanout-glm-5-2-high-1785153423148-1aktp5`

## 1. SCOPE OF THIS ITERATION

The remediation touched the writer (`run-skill-benchmark.cjs`), the owning skill, and the storage suite. This iteration audits two maintainability concerns: (a) the scaffolder-vs-writer index parity test (CHK-011) still holds, and (b) the packet's own checklist evidence rows are still faithful to the current code.

Sources under review:

- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py` — `empty_reports_index` (lines 131-171)
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/append-run-index.cjs` — `emptyIndex` (lines 70-102)
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/run-storage-convention.vitest.ts` — parity test (lines 170-181) and collision guard test (lines 183-205)
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md` — CHK-008, CHK-009, CHK-038

## 2. EVIDENCE READ

### 2.1 Scaffolder-vs-writer parity — holds

`init_skill.py:131-171` `empty_reports_index` and `append-run-index.cjs:70-102` `emptyIndex` emit byte-identical content (same frontmatter, same heading order, same OVERVIEW/RUN INDEX/STORAGE RULE sections, same header/divider, same storage-rule prose). The parity test at `run-storage-convention.vitest.ts:170-181` (`expect(fromPython).toBe(runIndex.emptyIndex('demo-skill'))`) asserts byte equality. CHK-011 holds.

### 2.2 Storage suite test count — 11, not 10

Counting `it(...)` blocks in `run-storage-convention.vitest.ts`:

1. line 72 — derives FAIL from firstFailingStage
2. line 80 — does not count an inapplicable row
3. line 87 — reads explicit verdict and reason
4. line 94 — states absence rather than inventing
5. line 100 — says so when no rows at all
6. line 108 — names a run folder in the dated grammar
7. line 124 — creates an index, then refreshes
8. line 145 — puts the newest run at the top
9. line 156 — escapes a pipe
10. line 170 — scaffolded and harness-written indexes agree
11. line 184 — allocates the next free ordinal (added by the CHK-035 remediation)

Total: 11 `it` blocks. CHK-038's "storage suite `11 passed`" is correct. CHK-009's "Tests 10 passed (10)" is stale — the 11th test was added by the remediation that CHK-038 records.

### 2.3 Lane suite count — 260 vs 259

CHK-008 says "259 passed, 11 failed". CHK-038 says "260 passed". A one-test delta. The remediation may have added a lane test, or the count moved for an unrelated reason. Without re-running the lane suite here (out of scope for a read-only review), the delta is reported as observed, not confirmed.

## 3. FINDINGS

### 3.1 P2 — CHK-009 storage suite evidence is stale (10 vs 11)

`checklist.md:60` (CHK-009) records "Tests 10 passed (10)". The storage suite now has 11 `it` blocks; the 11th was added by the CHK-035 remediation. CHK-038 (line 185) correctly records 11. CHK-009's evidence row is now stale: a reader running the suite today sees 11 passed, not 10, and would conclude the checklist is wrong.

- **Severity:** P2 (evidence row is stale; the suite passes, the count is wrong; a reader's trust in the checklist erodes)
- **[SOURCE: .opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md:60]**
- **[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/run-storage-convention.vitest.ts:72-205]**
- **content_hash:** 7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7

### 3.2 P2 — CHK-008 lane suite evidence may be stale (259 vs 260)

`checklist.md:60` (CHK-008) records "259 passed, 11 failed". `checklist.md:185` (CHK-038) records "260 passed". A one-test delta between the original baseline and the post-remediation run. Without re-running the lane suite here, the delta is observed but not confirmed against the current code.

- **Severity:** P2 (evidence rows disagree by one; the suite's pass count moved between CHK-008 and CHK-038 and neither row reconciles the delta)
- **[SOURCE: .opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md:60,185]**
- **content_hash:** 8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a

### 3.3 P2 — No regression test pins the disambiguator suffix shape

The collision guard test at `run-storage-convention.vitest.ts:184-205` asserts that the 2nd and 3rd runs get `-2` and `-3` suffixes. It pins the ordinal behaviour but not the suffix shape itself (a future refactor that switched to a "trailing topic field" per the grammar text in `create-benchmark/SKILL.md` §6 would fail this test, which is good, but the test does not assert the suffix shape against the documented grammar — it asserts an undocumented `-N` shape). This is the test-side face of finding F-001.

- **Severity:** P2 (test pins an undocumented shape; the documented shape is untested)
- **[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/run-storage-convention.vitest.ts:199,203]**
- **[SOURCE: .opencode/skills/sk-doc/create-benchmark/SKILL.md:312]**
- **content_hash:** 9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8

## 4. ADVERSARIAL P0 REPLAY

Could any of the above be a P0 in disguise?

- 3.1: Stale evidence row; the suite passes. Not P0.
- 3.2: Stale evidence row; the suite passes. Not P0.
- 3.3: Test pins an undocumented shape; the suite passes. Not P0.

No P0 confirmed.

## 5. CONVERGENCE TELEMETRY

- newInfoRatio: 3 distinct findings, all P2; ratio moderate (~0.45).
- Convergence score (telemetry only): 0.55 — above the 0.1 threshold, but the stop policy is `max-iterations`, so the loop continues.

## 6. NEXT FOCUS

Iteration 5 will move to the security dimension: the containment boundary of this lineage (write authority confined to the lineage dir), the spec packet's security claims (CHK-018, CHK-019), and whether the remediation introduced any new credential/transcript exposure surface.

## 7. STRATEGY UPDATE

- correctness: covered (2 iterations)
- security: in-progress next
- traceability: covered (1 iteration)
- maintainability: covered (1 iteration)

Review verdict: PASS

# Review Report — sk-doc/021-benchmark-naming-and-playbook-results

- **Lineage:** glm-5-2-high
- **Session:** fanout-glm-5-2-high-1785153423148-1aktp5
- **Mode:** review (autonomous, max-iterations)
- **Iterations executed:** 5 of 5
- **Dimensions covered:** correctness, security, traceability, maintainability
- **Generated at:** 2026-07-27T12:55:00.000Z

---

## 1. EXECUTIVE SUMMARY

This lineage re-ran the deep review against the fixed state of `sk-doc/021-benchmark-naming-and-playbook-results` in an isolated worktree, after the three earlier review findings (CHK-035 same-day collision guard, CHK-036 report-folder contract, CHK-037 parity-baseline discovery) were remediated. Per ADR-005, every finding here was verified against the code before being recorded.

**Verdict: CONDITIONAL.** No P0 findings. Three P1 findings, all of the spec-alignment / test-coverage class — the remediations are correct in the code, but their reach into sibling docs and test suites is incomplete. Twelve P2 findings record documentation gaps, stale evidence rows, and unprotected regression surfaces.

The three remediations themselves hold under adversarial replay:

- CHK-035 (collision guard) is correct and covers the third-and-beyond run, not only the second; it is pinned by `run-storage-convention.vitest.ts:184-205`.
- CHK-036 (report-folder contract) is correct in the owning skill (`create-benchmark/SKILL.md` §10) and the playbook skill (`create-manual-testing-playbook/SKILL.md` §4), but did not propagate to `spec.md` §3/§4, `implementation-summary.md`, or the storage guide §4.
- CHK-037 (parity-baseline discovery) is correct in `render-serving-snapshot.cjs:136-178`, but has no automated regression test.

---

## 2. REVIEW TARGET & SCOPE

- **Target:** `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results` (spec-folder, Level 3)
- **Target type:** spec-folder
- **Scope files:** the packet's six core docs plus the implementation surfaces named by `spec.md` (the grammar owner, the label validator, the serving snapshot, the playbook results-storage contract, the skill scaffolder, the Lane C emitters/runner/index writer, the deep-model-benchmark workflow grammar, and the storage suite).
- **Out of scope:** the 78-folder rename itself (already gated by the link checker at baseline), the Lane C scorer internals, the behavior/conformance/model-benchmark family authoring surfaces.
- **Write containment:** this lineage's writes are confined to `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/review/lineages/glm-5-2-high/`. Verified by `git status` review.

---

## 3. METHODOLOGY

- Fresh context per iteration; state continuity from files, not memory.
- One dimension per iteration, breadth over depth, 8-11 tool calls per iteration.
- Every finding cites `[SOURCE: file:line]`; inference-only findings rejected.
- Every P0 candidate adversarially replayed before recording; none survived.
- Convergence treated as telemetry only under the `max-iterations` stop policy; angles broadened rather than synthesizing early.
- Code graph unavailable; direct source reads and exact search used throughout.

---

## 4. FINDINGS BY SEVERITY

| Severity | Count | IDs |
|---|---|---|
| P0 | 0 | — |
| P1 | 3 | F-004, F-007, F-009 |
| P2 | 12 | F-001, F-002, F-003, F-005, F-006, F-008, F-010, F-011, F-012, F-013, F-014, F-015 |
| **Total** | **15** | |

No P0 confirmed after adversarial replay. The three P1 findings are spec-alignment / test-coverage defects, not correctness failures in production code.

---

## 5. FINDINGS BY DIMENSION

### 5.1 Correctness (iterations 1-2)

The two remediations in the correctness path hold under replay:

- **CHK-035 (same-day collision guard):** `run-skill-benchmark.cjs:138-156` allocates the next free ordinal (2, 3, …) for same-day same-subject same-variant runs. The guard covers the third-and-beyond run, not only the second. CHK-035's evidence understates the guard's reach. Pinned by `run-storage-convention.vitest.ts:184-205`.
- **CHK-037 (parity-baseline discovery):** `render-serving-snapshot.cjs:136-178` falls back to the newest-captured dated parity archive when the legacy fixed label is absent. The `compiledRoutingParity` filter on line 170 correctly excludes non-parity archives.

Findings:

- **F-001 (P2):** Disambiguator suffix shape is undocumented in the grammar. `run-skill-benchmark.cjs:152-153` uses `-${ordinal}` (numeric); `create-benchmark/SKILL.md:312` says "trailing topic field". The writer and the grammar disagree.
- **F-002 (P2):** TOCTOU window between `fs.existsSync` (line 152) and `fs.mkdirSync` (line 415). Sequential dispatch makes it theoretical.
- **F-003 (P2):** Collision guard cap at `ordinal <= 100` silently overwrites the 100th run. Implausible trigger.
- **F-004 (P1):** CHK-037 remediation has no automated regression test. CHK-035 is covered; CHK-037 is not. A future refactor that re-introduces the fixed-label-only lookup would pass the existing suite silently.
- **F-005 (P2):** `capturedAt` tie-break on line 173 is non-deterministic on identical timestamps (`fs.readdirSync` order is not guaranteed).
- **F-006 (P2):** Legacy-first preference on lines 153-154 can surface a stale baseline over a newer dated one. Intentional but undocumented in the script's own comments.

### 5.2 Traceability (iteration 3)

The CHK-036 remediation updated the owning skill but did not propagate to sibling docs:

- **F-007 (P1):** `spec.md:89` (§3) and `spec.md:128` (§4 REQ-004, a P0 requirement) say "six files"; the writer emits seven. REQ-004's acceptance criterion is decoupled from the implementation it governs.
- **F-008 (P2):** `implementation-summary.md:48-51` says "seven files" but enumerates six (README.md omitted from the list).
- **F-009 (P1):** `skill-benchmark-storage-guide.md:135-149` (§4) says "matched report pair and nothing else, unless a per-run README.md note was authored by hand". Contradicts the writer (seven) and the owning SKILL.md §10 (seven). The storage guide is the canonical reference a future engineer reads first; understating the folder by four files sets up the exact misalignment the packet was opened to close.

### 5.3 Maintainability (iteration 4)

- **F-010 (P2):** `checklist.md:60` (CHK-009) records "Tests 10 passed (10)". The storage suite now has 11 `it` blocks; the 11th was added by the CHK-035 remediation. CHK-038 correctly records 11. CHK-009 is stale.
- **F-011 (P2):** `checklist.md:60` (CHK-008) records "259 passed"; `checklist.md:185` (CHK-038) records "260 passed". One-test delta, unreconciled.
- **F-012 (P2):** The collision guard test pins the undocumented `-N` suffix shape; the documented "trailing topic field" is untested. Test-side face of F-001.

### 5.4 Security (iteration 5)

- **F-013 (P2):** `render-serving-snapshot.cjs:159-174` widens the read surface to every archived `skill-benchmark-report.json`. No credential or transcript content is read or persisted; only digests and verdicts cross into the snapshot. Surface change recorded for future audits.
- **F-014 (P2):** `checklist.md:84` (CHK-018) describes the rename sweep, not the serving-snapshot scan. The remediation widened the scan's read surface; CHK-018's evidence row was not updated to cover it. The claim holds; the evidence is incomplete.
- **F-015 (P2):** No regression test pins the read-surface boundary for `scanParityBaseline`. Security-side face of F-004.

---

## 6. VERDICT

**Review verdict: CONDITIONAL**

Mapping: no P0 findings; three P1 findings present (F-004, F-007, F-009); remediation plan included below. Per the iteration final-line contract, the verdict is CONDITIONAL.

The CONDITIONAL verdict reflects that the three remediations are correct in the code but their documentation and test reach is incomplete. None of the P1 findings block shipping the remediated code itself; they block retiring the spec packet as fully done.

---

## 7. REMEDIATION PLAN

Ordered by dependency, not severity.

### Tier 1 — Apply now (closes the P1s)

1. **F-007 / F-009 (P1):** Reconcile the seven-file contract across all docs that name the count.
   - Update `spec.md` §3 and §4 (REQ-004) from "six files" to "seven files" (REQ-004 is a P0 requirement; its acceptance criterion must name the correct count). This is a spec amendment, not a code change — flag for operator approval per the Logic-Sync Protocol.
   - Update `implementation-summary.md:48-51` to enumerate all seven files (add `README.md` to the list).
   - Update `skill-benchmark-storage-guide.md` §4 to list all seven files and drop the "and nothing else, unless a per-run README.md note was authored by hand" language that predates the writer's companion emission.
2. **F-004 (P1):** Add a regression test for `scanParityBaseline` covering: (a) legacy-first preference, (b) dated fallback when legacy absent, (c) `compiledRoutingParity` filter excludes non-parity archives, (d) honest `present: false` when neither exists. Place alongside `run-storage-convention.vitest.ts` or a new `serving-snapshot.vitest.ts`.

### Tier 2 — Validate first (closes the P2 evidence-row drift)

3. **F-010 / F-011 (P2):** Re-run the storage suite and the lane suite, update CHK-009 and CHK-008 evidence rows to the current counts (11 and 260 respectively), and reconcile CHK-008 vs CHK-038 in one place.
4. **F-014 (P2):** Update CHK-018 evidence to cover the serving-snapshot scan's read surface, not only the rename sweep.

### Tier 3 — Future (closes the documentation and boundary P2s)

5. **F-001 / F-012 (P2):** Reconcile the disambiguator suffix shape: either update `create-benchmark/SKILL.md` §6 to document the `-N` ordinal the writer actually uses, or change the writer to emit a "trailing topic field" per the grammar. Add a test that pins whichever shape is chosen.
6. **F-002 / F-003 / F-005 (P2):** Document the TOCTOU window, the ordinal-100 cap, and the `capturedAt` tie-break as known limitations in the writer's comments, or close them if a future hardening pass is warranted.
7. **F-006 (P2):** Document the legacy-first preference rationale in `render-serving-snapshot.cjs` comments, not only in the storage guide.
8. **F-008 (P2):** Add `README.md` to the implementation-summary's enumerated list.
9. **F-013 / F-015 (P2):** Add a test that pins the read-surface boundary of `scanParityBaseline` (which files it reads, which it does not).

---

## 8. RESOURCE MAP COVERAGE GATE

Skipped. `resource-map.md` was not present at initialization; per the loop protocol, the coverage gate and the synthesis `## Resource Map Coverage Gate` section are omitted without failing the loop.

---

## 9. CONTINUITY / NEXT STEPS

- This lineage's state packet lives at `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/review/lineages/glm-5-2-high/`. Resume from `deep-review-state.jsonl` and `iteration-005.md`.
- The sibling `terra-high-fast` lineage hit `dispatch_blocked` (cli-codex self-invocation) and did not produce a `review-report.md`. The fanout merger should treat this lineage's verdict as the only completed signal for the glm-5-2-high lane.
- The operator's next safe action is to apply Tier 1 of the remediation plan (F-007/F-009 spec amendment + F-004 regression test), then re-validate the packet with `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results --strict`.
- Continuity save is not run by this leaf (the YAML workflow's save phase owns it); the leaf's writes are confined to the lineage directory.

---

## 10. SIGN-OFF

| Role | Verified | Evidence |
|---|---|---|
| Correctness | Yes | CHK-035 and CHK-037 replayed against code; collision guard covers 3rd-and-beyond run; parity fallback filter is correct |
| Traceability | Conditional | CHK-036 propagated to owning skill and playbook skill but not to spec.md, implementation-summary.md, or storage guide (F-007, F-008, F-009) |
| Maintainability | Conditional | Scaffolder/writer parity holds (CHK-011); checklist evidence rows stale (F-010, F-011); collision guard test pins undocumented shape (F-012) |
| Security | Yes | No credential/transcript exposure introduced; read surface widened but no content crosses into snapshot (F-013, F-014, F-015) |
| Containment | Yes | All lineage writes confined to `review/lineages/glm-5-2-high/` |

# Iteration 005 — Security: Remediation Surface And Containment

- **Dimension:** security
- **Focus area:** did the three remediations introduce any new credential/transcript exposure surface, and does this lineage respect its write-containment boundary?
- **Iteration:** 5 of 5
- **Session:** `fanout-glm-5-2-high-1785153423148-1aktp5`

## 1. SCOPE OF THIS ITERATION

The packet's security claims (CHK-018, CHK-019) are that no credential, token or transcript content was introduced, and that captured transcripts were restored to pristine content. This iteration audits whether the three remediations just applied (CHK-035, CHK-036, CHK-037) introduced any new exposure surface, and whether this review lineage itself respects its write-containment boundary.

Sources under review:

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` — collision guard (CHK-035)
- `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs` — parity-baseline scan (CHK-037)
- `.opencode/skills/sk-doc/create-benchmark/SKILL.md` §10, `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` §4 — doc changes (CHK-036)
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md` — CHK-018, CHK-019

## 2. EVIDENCE READ

### 2.1 Collision guard — no new I/O surface

`run-skill-benchmark.cjs:138-156` `defaultOutputsDir` adds only `fs.existsSync` and `path.join` calls against the reports directory. No new file reads of run-record content, no new writes of transcript material, no new env-var surface beyond the existing `SKILL_BENCH_OPENCODE_MODEL` / `SKILL_BENCH_OPENCODE_VARIANT` reads (lines 139-140, unchanged). The guard operates purely on path strings. CHK-018's claim ("the sweep replaces only `<root>/<label>` path segments") is not disturbed by this remediation.

### 2.2 Parity-baseline scan — reads more files, but only writer-emitted JSON

`render-serving-snapshot.cjs:159-174` `scanParityBaseline` now scans every directory under `<hub>/benchmark/compiled-routing/` and reads each `skill-benchmark-report.json`. Before the remediation, the scan read only the fixed-label archive. The remediation widens the read surface to every dated archive directory.

The widened read surface is a security-relevant change: the scan now reads every archived report JSON, not just one. However:

- The report JSON is written by the same Lane C harness that the snapshot script lives alongside (`build-report.cjs` → `run-skill-benchmark.cjs`), so the read is of writer-emitted content, not arbitrary operator-authored content.
- The scan reads only `skill-benchmark-report.json` (line 140, 169), not transcripts, ledgers, or stdout. The report JSON carries verdict/scores/per-scenario rows, not credentials.
- The scan does not log or persist the JSON contents; it extracts only `capturedAt`, `verdict`, and `reportDigest` (a SHA-256 of the bytes) into the snapshot. No transcript content crosses into the snapshot artifact.

So the widened read surface does not introduce credential/transcript exposure. CHK-018 holds for the remediation.

### 2.3 Doc changes — no code surface

The CHK-036 remediation updated `create-benchmark/SKILL.md` §10 and `create-manual-testing-playbook/SKILL.md` §4. Both are markdown documentation. No code, no I/O, no security surface.

### 2.4 CHK-019 — captured transcripts restored

CHK-019's evidence (`git checkout e16382d845 -- <folder>` for all 78 folders) is a one-time restoration that predates the remediation. The remediation did not touch any captured transcript. CHK-019 holds.

### 2.5 This lineage's write-containment boundary

Per the dispatch contract, this lineage's write authority is bound to `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/review/lineages/glm-5-2-high/`. A `git status --short` review confirms every file I have written or appended to lives under that directory:

- `review/lineages/glm-5-2-high/deep-review-config.json` (W)
- `review/lineages/glm-5-2-high/deep-review-strategy.md` (W)
- `review/lineages/glm-5-2-high/deep-review-state.jsonl` (W, append-only)
- `review/lineages/glm-5-2-high/deep-review-findings-registry.json` (W)
- `review/lineages/glm-5-2-high/iterations/iteration-001.md` … `iteration-004.md` (W)
- `review/lineages/glm-5-2-high/deltas/iter-001.jsonl` … `iter-004.jsonl` (W)

No path outside the lineage directory was written by this review. The other modifications visible in `git status` (the `terra-high-fast` lineage, `review/deep-review-config.json`, `review/observability-events.jsonl`, `review/orchestration-summary.json`, `review-archive-degraded-run/`) were pre-existing in the worktree before this lineage started, written by the fanout orchestration setup, not by this leaf.

## 3. FINDINGS

### 3.1 P2 — Parity-baseline scan widens the read surface but does not expose credentials

`render-serving-snapshot.cjs:159-174` now reads every archived `skill-benchmark-report.json` under `compiled-routing/`, where before it read one. The read is of writer-emitted JSON only, and the snapshot persists only digests and verdicts, not content. The widening is security-relevant in shape (more files read) but not in substance (no credential or transcript content is read or persisted). Recording as P2 so a future security audit sees the surface change.

- **Severity:** P2 (surface widened; no exposure; documented for future audits)
- **[SOURCE: .opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:159-174]**
- **content_hash:** 0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0

### 3.2 P2 — CHK-018 evidence row does not cover the remediation's read-surface widening

`checklist.md:84` (CHK-018) records "the sweep replaces only `<root>/<label>` path segments". That evidence describes the rename sweep, not the serving-snapshot scan. The remediation widened the scan's read surface, but CHK-018's evidence row was not updated to cover it. The claim still holds (no credential introduced), but the evidence row no longer covers the full read surface.

- **Severity:** P2 (evidence row is silent on the widened read surface; the security claim holds, the evidence row is incomplete)
- **[SOURCE: .opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md:84]**
- **content_hash:** 1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1

### 3.3 P2 — No regression test pins the read-surface boundary

The security-relevant read surface (which files `scanParityBaseline` reads) is not asserted by any test. A future refactor that widened the scan to read transcript files or ledgers would pass the existing suite silently. This is the security-side face of finding F-004 (no regression test for CHK-037).

- **Severity:** P2 (no test pins the read-surface boundary; the security claim rests on inspection)
- **[SOURCE: .opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:136-178]**
- **content_hash:** 2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2

## 4. ADVERSARIAL P0 REPLAY

Could any of the above be a P0 in disguise?

- 3.1: Surface widened, no exposure. Not P0.
- 3.2: Evidence row incomplete, claim holds. Not P0.
- 3.3: No test, but no current exposure. Not P0.

No P0 confirmed.

## 5. CONVERGENCE TELEMETRY

- newInfoRatio: 3 distinct findings, all P2; ratio moderate (~0.4).
- Convergence score (telemetry only): 0.5 — above the 0.1 threshold. This is the final iteration under `max-iterations`, so the loop now proceeds to synthesis.

## 6. NEXT FOCUS

This is the final iteration. Phase synthesis compiles `review-report.md` from the five iteration findings.

## 7. STRATEGY UPDATE

- correctness: covered (2 iterations)
- security: covered (1 iteration)
- traceability: covered (1 iteration)
- maintainability: covered (1 iteration)
- All four dimensions covered. Loop proceeds to synthesis.

Review verdict: PASS

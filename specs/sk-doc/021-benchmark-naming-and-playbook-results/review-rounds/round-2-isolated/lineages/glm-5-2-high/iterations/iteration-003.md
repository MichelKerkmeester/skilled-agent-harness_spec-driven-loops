# Iteration 003 — Traceability: Seven-File vs Six-File Report Contract

- **Dimension:** traceability
- **Focus area:** CHK-036 remediation scope — does the "seven Lane C files" contract now hold across every doc that names the count?
- **Iteration:** 3 of 5
- **Session:** `fanout-glm-5-2-high-1785153423148-1aktp5`

## 1. SCOPE OF THIS ITERATION

CHK-036 closed a defect where the owning skill named a report the writer never emits. The remediation evidence says: "the owning skill now states seven Lane C files with `skill-benchmark-report.{json,md}`, and names the promotion family's `benchmark-report.md` separately." This iteration audits whether the seven-file contract is now consistent across every doc that names the count, or whether the remediation left sibling docs drifting.

Sources under review:

- `.opencode/skills/sk-doc/create-benchmark/SKILL.md` §10 (the remediation target)
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` §4 (the results-storage contract)
- `.opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md` §4
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md` §3, §4 (REQ-004)
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/implementation-summary.md`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` (the writer, ground truth)
- `.opencode/commands/deep/assets/deep-model-benchmark-auto.yaml` (grammar rule)

## 2. EVIDENCE READ

### 2.1 The writer's ground truth

`run-skill-benchmark.cjs:552-576` writes the report pair plus five companions:

```text
567|   const companions = [
568|     ['README.md', renderRunReadme(report, companionContext)],
569|     ['results.csv', renderResultsCsv(report)],
570|     ['failed-runs.md', renderFailedRuns(report)],
571|     ['findings-and-recommendations.md', renderFindings(report)],
572|     ['source.md', renderSource(report, companionContext)],
573|   ];
```

Plus the report pair written on lines 553-555 (`skill-benchmark-report.json` + `.md`). Total: **seven files**. The writer is the ground truth.

### 2.2 The remediation target — consistent

`create-benchmark/SKILL.md:493-503` (§10) lists all seven files in a table. The remediation landed correctly here.

`create-manual-testing-playbook/SKILL.md:249-256` (§4) lists all seven files in the storage tree diagram. Consistent.

### 2.3 The deep-model-benchmark grammar — consistent

`deep-model-benchmark-auto.yaml:42,60` references the fleet run-folder grammar `<YYYY-MM-DD>--<subject>--<variant>` and the regex `^[a-z0-9]+(?:-{1,2}[a-z0-9]+)*$`. This matches the owning skill's grammar declaration. No count claim here, so no inconsistency.

### 2.4 The spec packet — INCONSISTENT

`spec.md:89` (§3 In Scope) says:

> "A results-storage contract for manual-testing-playbook runs, plus the writer that emits the six files."

`spec.md:128` (§4 REQ-004 acceptance criterion) says:

> "A run with no explicit output path lands in the dated reports folder with all six files."

The writer emits seven. The remediation updated the owning skill to say seven but did not touch the spec packet's own scope and requirement text. REQ-004 is a P0 requirement, and its acceptance criterion names the wrong count. A test that asserted "six files" against REQ-004 would pass while the writer emits seven, so the requirement as written cannot fail when the writer is correct, and cannot pass when the writer is wrong — it is decoupled from the implementation it claims to govern.

### 2.5 The implementation summary — INCONSISTENT (list vs count)

`implementation-summary.md:48-51` says:

> "writes seven files: the machine record, the rendered report, a result table, a failure list, findings grouped by recorded reason, and a source map."

The count says seven; the list enumerates six items (machine record, rendered report, result table, failure list, findings, source map). The seventh — `README.md`, the entry point — is implied by the count but not named in the list. A reader counting the list against the count will see a mismatch.

### 2.6 The storage guide — INCONSISTENT

`skill-benchmark-storage-guide.md:135-149` (§4) says:

> "Every run writes a **matched report pair** and nothing else, unless a per-run `README.md` note was authored by hand."

The table on lines 145-149 lists only `skill-benchmark-report.json`, `skill-benchmark-report.md`, and an optional `README.md`. This predates the writer's companion emission and contradicts both the owning SKILL.md §10 (seven files) and the writer itself (seven files). The storage guide is the document a future engineer reads first to understand the storage shape, and it understates the folder by four files.

## 3. FINDINGS

### 3.1 P1 — spec.md §3 and §4 (REQ-004) say "six files"; writer emits seven

`spec.md:89` (§3) and `spec.md:128` (§4 REQ-004, a P0 requirement) both say "six files". The writer emits seven. The CHK-036 remediation updated the owning skill but left the spec packet's own scope and P0 acceptance criterion naming the wrong count. REQ-004's acceptance criterion is now decoupled from the implementation it governs: a test asserting "six files" would pass while the writer emits seven, so the requirement cannot fail when the writer is correct and cannot pass when the writer is wrong.

- **Severity:** P1 (P0 requirement's acceptance criterion names the wrong count; the requirement is no longer a faithful gate on the behaviour it claims to govern)
- **[SOURCE: .opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md:89,128]**
- **[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:552-576]**
- **content_hash:** 4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5

### 3.2 P2 — implementation-summary.md says "seven" but lists six

`implementation-summary.md:48-51` says "writes seven files" then enumerates six items, omitting `README.md`. A reader counting the enumerated list against the stated count sees a mismatch.

- **Severity:** P2 (count is correct; the enumerated list is incomplete; a reader can reconstruct the seventh from the owning skill, but the summary is internally inconsistent)
- **[SOURCE: .opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/implementation-summary.md:48-51]**
- **content_hash:** 5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6

### 3.3 P1 — storage guide §4 contradicts the writer and the owning skill

`skill-benchmark-storage-guide.md:135-149` (§4) says a run writes "a matched report pair and nothing else, unless a per-run `README.md` note was authored by hand" and lists only the `.json`/`.md` pair plus an optional `README.md`. The writer emits seven files; the owning SKILL.md §10 lists seven. The storage guide is the document a future engineer reads first to understand the storage shape, and it understates the folder by four files. The CHK-036 remediation updated the owning skill but did not propagate to the storage guide that cites it.

- **Severity:** P1 (the storage guide is the canonical reference for the storage shape; understating it by four files sets up a future engineer to believe companions are absent-by-design when they are emitted-by-default, which is the exact misalignment the spec packet was opened to close)
- **[SOURCE: .opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:135-149]**
- **[SOURCE: .opencode/skills/sk-doc/create-benchmark/SKILL.md:493-503]**
- **[SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:552-576]**
- **content_hash:** 6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f

## 4. ADVERSARIAL P0 REPLAY

Could any of the above be a P0 in disguise?

- 3.1: REQ-004 is a P0 requirement, but the writer is correct (emits seven). The drift is in the requirement text, not in the implementation. The implementation does not fail; the requirement is unfaithful. This is a spec-alignment P1, not a correctness P0. Not P0.
- 3.2: Count correct, list incomplete. Not P0.
- 3.3: The storage guide is wrong, but the writer is correct and the owning skill is correct. The drift is in a reference doc, not in production code. Not P0.

No P0 confirmed.

## 5. CONVERGENCE TELEMETRY

- newInfoRatio: 3 distinct findings, two P1 and one P2; ratio high (~0.6).
- Convergence score (telemetry only): 0.6 — above the 0.1 threshold, but the stop policy is `max-iterations`, so the loop continues.

## 6. NEXT FOCUS

Iteration 4 will move to the maintainability dimension: the scaffolder-vs-writer index parity test (CHK-011) and the broader question of whether the packet's own checklist evidence still holds against the current code, since the remediation touched the writer and the owning skill but the checklist's evidence rows were not re-run.

## 7. STRATEGY UPDATE

- correctness: covered (2 iterations)
- security: pending
- traceability: covered (1 iteration, 3 findings)
- maintainability: in-progress next

Review verdict: CONDITIONAL

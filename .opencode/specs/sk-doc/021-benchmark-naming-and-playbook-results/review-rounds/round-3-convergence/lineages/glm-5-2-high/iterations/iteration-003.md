# Iteration 3: Traceability — contract and migration alignment

## Dispatcher

- Budget profile: verify.
- Resolved route: mode=review target_agent=deep-review.

## Files Reviewed

- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md:84-135,179-186`
- `.opencode/skills/sk-doc/create-benchmark/SKILL.md:300-325,455-502`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:235-283`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:539-578`
- `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:121-170`
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/assets/rename-map.json` (enumerated, not exhaustively re-verified)
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md:39-46,71-77,109-118`

## Findings - New

### P0 Findings

- None.

### P1 Findings

1. **Published report contract does not describe the emitted folder** — `.opencode/skills/sk-doc/create-benchmark/SKILL.md:489-498` — the owning storage authority's "reports layer" declares six files for a curated report folder: `README.md`, `benchmark-report.md`, `failed-runs.md`, `findings-and-recommendations.md`, `results.csv`, `source.md`. The actual writer (`run-skill-benchmark.cjs:539-563`) emits seven files: `skill-benchmark-report.json`, `skill-benchmark-report.md`, `README.md`, `results.csv`, `failed-runs.md`, `findings-and-recommendations.md`, `source.md`. The playbook contract (`create-manual-testing-playbook/SKILL.md:250-256`) agrees with the writer's seven-file shape and the `skill-benchmark-report.{json,md}` naming. The owner's `benchmark-report.md` is named by no writer anywhere in the repository.
   - Finding class: `cross-consumer`
   - Scope proof: side-by-side comparison of `create-benchmark/SKILL.md` §10 "reports layer" (six files, `benchmark-report.md`), `create-manual-testing-playbook/SKILL.md` §4 (seven files, `skill-benchmark-report.{json,md}`), and `run-skill-benchmark.cjs:539-563` (seven files, `skill-benchmark-report.{json,md}`). Two of three surfaces agree; the third is the declared owner.
   - Additional locational drift: `create-benchmark/SKILL.md:459-476` "Storage Shape" diagram places a run folder directly under `benchmark/<run-label>/` (sibling to `reports/`), containing only `skill-benchmark-report.{json,md}`. The writer places the seven-file folder under `benchmark/reports/<run-label>/`. So within the same SKILL.md there are two different declarations of where a run lands and what it contains.
   - Affected surface hints: `["create-benchmark authority", "manual testing playbook", "Lane C writer", "reports index"]`
   - Recommendation: choose one canonical folder shape (six or seven files, `benchmark-report.md` or `skill-benchmark-report.md`, under `benchmark/` or under `benchmark/reports/`), then align all producer and consumer surfaces, the storage guide, the README templates, and the test assertions to that one shape.
   - Claim adjudication:
```json
{"type":"claim_adjudication","claim":"The owning report-storage contract and writer disagree on report filename, file count, and folder location.","evidenceRefs":[".opencode/skills/sk-doc/create-benchmark/SKILL.md:459-498",".opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:250-256",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:539-563"],"counterevidenceSought":"Searched for any writer that emits `benchmark-report.md` (the owner's declared name); none exists. Searched for any consumer that reads from `benchmark/<run-label>/` directly (the owner's Storage Shape); the writer always lands under `benchmark/reports/<run-label>`. The disagreement is real on both axes.","alternativeExplanation":"The owner's six-file `benchmark-report.md` contract could be a curated-only intent (separate from the raw run folder), but the SKILL.md does not state that separation, and the writer puts all seven files in the curated `reports/` folder.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"A documented separation between a raw run folder (six files, `benchmark-report.md`) and a curated reports folder (seven files, `skill-benchmark-report.*`), with the writer emitting only one of them, would lower the severity."}
```

2. **Serving snapshots still look for a retired non-dated parity label** — `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:121-134` — `scanParityBaseline()` hardcodes `label = 'router-compiled-parity-baseline'` and reads `<skillsRoot>/<hubId>/benchmark/compiled-routing/<label>/skill-benchmark-report.json`. Under the dated grammar this packet declares, new archives are named `<YYYY-MM-DD>--<subject>--<variant>`, so a freshly archived parity run cannot satisfy the fixed lookup. The snapshot will report `parityBaseline.present = false` for a hub whose dated parity archive exists.
   - Finding class: `cross-consumer`
   - Scope proof: the same file's `scanRealModelLast()` (lines 145-170) DOES iterate the archive directory and discover dated labels by `capturedAt`, so the dated-discovery pattern is already implemented in this file for the real-model lane. `scanParityBaseline()` is the asymmetry — it does not use the discovery pattern its sibling does.
   - Affected surface hints: `["compiled-routing archiver", "serving snapshot renderer", "snapshot schema", "hub benchmark README"]`
   - Recommendation: persist or derive the dated parity-baseline label (mirror `scanRealModelLast`'s directory scan), update the snapshot schema, README, and any snapshot consumer that reads `parityBaseline`.
   - Claim adjudication:
```json
{"type":"claim_adjudication","claim":"Serving snapshots cannot discover a dated replacement for the hardcoded retired parity-baseline label.","evidenceRefs":[".opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:121-134",".opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:145-170",".opencode/skills/sk-doc/create-benchmark/SKILL.md:312,323-325"],"counterevidenceSought":"Searched for any other caller that maps a dated archive back to the `router-compiled-parity-baseline` label; none exists. Confirmed `scanRealModelLast` in the same file demonstrates the dated-discovery pattern is feasible here.","alternativeExplanation":"The hardcoded label could be retained intentionally as a frozen anchor like `baseline/`, but the SKILL.md only exempts `baseline/` from the dated grammar (line 323-325); `router-compiled-parity-baseline` is not named as a second carve-out.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"An explicit second carve-out declared in the owning grammar for `router-compiled-parity-baseline` would lower the severity."}
```

### P2 Findings

- None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | fail | hard | `spec.md:105-135`; `create-benchmark/SKILL.md:459-498`; `run-skill-benchmark.cjs:539-563`; `render-serving-snapshot.cjs:121-134` | REQ-004 promises "all six files"; the writer emits seven. The frozen `baseline/` is the only declared carve-out; `router-compiled-parity-baseline` is not exempted. |
| `checklist_evidence` | partial | hard | `checklist.md:39-46,71-77,109-118` | Pre-implementation and fix-completeness rows are evidenced with commands and numbers. CHK-017 reports `folders by kind: {"lane-c":62,"retrieval":7,"workspace":9}` — 78 total, matching the rename map. The replay of completion evidence against the active contract drifts is reserved for the maintainability iteration. |
| `playbook_capability` | fail | advisory | `create-manual-testing-playbook/SKILL.md:250-256`; `create-benchmark/SKILL.md:489-498` | The playbook contract publishes a seven-file `skill-benchmark-report.*` layout; the owner publishes a six-file `benchmark-report.md` layout. They disagree on filename and file count. |

## Integration Evidence

- The rename map at `assets/rename-map.json` is collision-free (per `checklist.md:73` CHK-014: `rows: 78 | collisions: 0`), and the link checker returned to baseline (CHK-016: `85 broken`). The migration itself is sound; the contract drift is in the post-migration storage declaration, not the migration execution.
- `deep-model-benchmark-auto.yaml:42,60` declares the same grammar `^[a-z0-9]+(?:-{1,2}[a-z0-9]+)*$` and the dated form, so the workflow contract is aligned with the owning grammar. No finding there.

## Edge Cases

- A hub that has not yet archived a dated parity run would still see `parityBaseline.present = false` under the hardcoded lookup, which is the correct answer for "no archive yet." The defect is that a hub that HAS archived a dated parity run also sees `present = false`.

## Confirmed-Clean Surfaces

- The grammar is declared once in `create-benchmark/SKILL.md` §6 and cited (not restated) by the playbook contract and the workflow YAML.
- The frozen `baseline/` anchor is refused by both the archiver and the default writer.
- The rename map is collision-free and the link checker returned to the captured baseline.

## Ruled Out

- The migration execution itself is sound: 78 of 78 folders at mapped names, 0 live stale references, link checker at baseline. The traceability defects are in the post-migration storage contract, not the migration.

## Next Focus

- Dimension: maintainability
- Focus area: regression coverage and operational clarity — does the focused test suite cover the three active contract drifts, or does it pass alongside them?
- Reason: a passing focused test that does not cover the active drifts is a maintainability defect, because it gives false confidence.
- Rotation status: next primary dimension.
- Required evidence: direct read of `run-storage-convention.vitest.ts` against the three active findings.

Review verdict: CONDITIONAL

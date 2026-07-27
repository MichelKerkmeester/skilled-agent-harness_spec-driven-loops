# Iteration 3: Traceability — contract and migration alignment

## Dispatcher

- Budget profile: verify.
- Resolved route: mode=review target_agent=deep-review.

## Files Reviewed

- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md:105-135`
- `.opencode/skills/sk-doc/create-benchmark/SKILL.md:300-325,450-510`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:230-282`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:539-567`
- `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:122-141`
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/assets/rename-map.json`

## Findings - New

### P0 Findings

- None.

### P1 Findings

1. **The published six-file report contract does not describe the emitted folder** — `.opencode/skills/sk-doc/create-benchmark/SKILL.md:486-503` — the governing storage section lists `benchmark-report.md` and exactly six files, while the Lane C writer produces `skill-benchmark-report.json`, `skill-benchmark-report.md`, and five companion files. The playbook contract also documents seven files. A consumer following the owning authority cannot know the actual required shape.
   - Finding class: `cross-consumer`
   - Scope proof: direct comparison of the owner at `create-benchmark/SKILL.md:486-503`, the playbook-facing contract at `create-manual-testing-playbook/SKILL.md:243-255`, and writer emission at `run-skill-benchmark.cjs:539-567`.
   - Affected surface hints: `["create-benchmark authority", "manual testing playbook", "Lane C writer", "reports index"]`
   - Recommendation: choose one canonical six- or seven-file shape, then align owner prose, playbook contract, writer tests, and emitted filenames.
   - Claim adjudication:
```json
{"type":"claim_adjudication","claim":"The owning report-storage contract and writer disagree on both report filename and file count.","evidenceRefs":[".opencode/skills/sk-doc/create-benchmark/SKILL.md:486-503",".opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:243-255",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:539-567"],"counterevidenceSought":"Checked whether the JSON or renderer output was excluded before emission; both are written in the same folder, and the playbook diagram includes both.","alternativeExplanation":"The word curated could intend to exclude the machine JSON, but the published file table does not say that and names a different Markdown file.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"An explicit owner statement that distinguishes raw from curated files and a matching writer layout would lower the impact."}
```

2. **Serving snapshots still look for a retired non-dated parity label** — `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:122-123` — the renderer hardcodes `router-compiled-parity-baseline`, even though the owner declares dated run folders and only `baseline/` is exempt. New dated compiled-routing archives are therefore not discovered as the parity baseline, leaving snapshots to report a false not-yet-archived state.
   - Finding class: `cross-consumer`
   - Scope proof: `scanParityBaseline()` hardcodes the old label; the source map declares 78 renamed rows with no collisions, and the dated grammar is mandatory at `create-benchmark/SKILL.md:300-325`.
   - Affected surface hints: `["compiled-routing archiver", "serving snapshot renderer", "snapshot schema", "hub benchmark README"]`
   - Recommendation: store or derive the dated parity-baseline label from archival metadata, then update the schema and generated snapshots that still advertise the retired label.
   - Claim adjudication:
```json
{"type":"claim_adjudication","claim":"Serving snapshots cannot discover a dated replacement for the hardcoded retired parity-baseline label.","evidenceRefs":[".opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:122-141",".opencode/skills/sk-doc/create-benchmark/SKILL.md:300-325",".opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/assets/rename-map.json"],"counterevidenceSought":"Searched snapshot and schema consumers for a dynamic dated-label resolver; the renderer calls path.join with the fixed label.","alternativeExplanation":"The old label may be intentionally retained as a special anchor, but the owner names only baseline as the exception and the packet scope says all 78 folders converge.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"A documented second exception plus preserved dynamic lookup semantics would lower this to a documentation issue."}
```

### P2 Findings

- None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | fail | hard | `spec.md:105-135`; `create-benchmark/SKILL.md:486-503`; `run-skill-benchmark.cjs:539-567` | Report-shape contract diverges from emitted behavior. |
| `checklist_evidence` | partial | hard | `checklist.md`; `rename-map.json` | Rename map confirms 78 rows and zero collisions; broader completion evidence checked next. |
| `playbook_capability` | fail | advisory | `create-manual-testing-playbook/SKILL.md:243-255` | Playbook contract exposes a different layout than the authority. |

## Integration Evidence

- `render-serving-snapshot.cjs` consumes archive layout through the fixed parity-baseline label.
- The target's `rename-map.json` contains 78 rows and zero collisions.

## Edge Cases

- `baseline/` is a real documented exception; the hardcoded label is a different name and therefore cannot be treated as that exception without an explicit rule.

## Confirmed-Clean Surfaces

- The rename-map artifact reports zero collisions, so this iteration found no collision in the planned rename mapping itself.

## Ruled Out

- No evidence that the frozen `baseline/` anchor is overwritten by the compiled-routing archive; it is explicitly rejected.

## Next Focus

- Dimension: maintainability
- Focus area: verify tests, mapping reproducibility, and whether documentation gives operators one coherent workflow.
- Reason: remaining findings cross producer and consumer boundaries and need a final quality/replay pass.
- Rotation status: next primary dimension.
- Required evidence: focused test run and map/reference integrity checks.

Review verdict: CONDITIONAL

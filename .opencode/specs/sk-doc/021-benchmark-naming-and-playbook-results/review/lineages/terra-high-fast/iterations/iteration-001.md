# Iteration 1: Correctness — default run storage

## Dispatcher

- Budget profile: verify.
- Resolved route: mode=review target_agent=deep-review.

## Files Reviewed

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:112-145,398-405,539-567`
- `.opencode/skills/sk-doc/create-benchmark/SKILL.md:450-510`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:230-282`

## Findings - New

### P0 Findings

- None.

### P1 Findings

1. **Default dated folders can overwrite same-day evidence** — `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:398` — `defaultOutputsDir()` derives only date, subject, and variant, then `fs.mkdirSync(outputsDir, { recursive: true })` accepts an existing directory before report and companion writes overwrite its contents. Two same-day runs for the same model/trace variant therefore lose the earlier artifact instead of receiving the required trailing topic suffix or a fail-closed collision.
   - Finding class: `cross-consumer`
   - Scope proof: `runFolderName()` at lines 112-120 emits three fields only; the storage authority requires a disambiguating trailing topic field for same-day collisions at `.opencode/skills/sk-doc/create-benchmark/SKILL.md:314-325`.
   - Affected surface hints: `["Lane C default path", "report companion writer", "reports index"]`
   - Recommendation: allocate a unique suffix before creating the directory, or fail closed and require an explicit disambiguator; do not overwrite an existing dated folder.
   - Claim adjudication:
```json
{"type":"claim_adjudication","claim":"The default path can overwrite an earlier same-day run with the same subject and variant.","evidenceRefs":[".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:112-145",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:398-405",".opencode/skills/sk-doc/create-benchmark/SKILL.md:314-325"],"counterevidenceSought":"Checked for an occupancy guard or a unique suffix between path derivation and fs.mkdirSync; none is present in the path shown.","alternativeExplanation":"An operator can manually supply --outputs-dir, but that does not protect the default contract.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Documented same-folder replacement semantics plus a retained historical copy would lower the severity."}
```

### P2 Findings

- None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | fail | hard | `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md:128-134`; `run-skill-benchmark.cjs:398-405` | Spec requires same-day disambiguation; default writer does not provide one. |
| `checklist_evidence` | partial | hard | `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md` | Full checklist replay reserved for traceability iteration. |
| `playbook_capability` | partial | advisory | `create-manual-testing-playbook/SKILL.md:267-274` | Contract delegates the default path to Lane C and inherits this behavior. |

## Integration Evidence

- `create-manual-testing-playbook/SKILL.md` names `run-skill-benchmark.cjs` as the writer for a no-`--outputs-dir` playbook run.

## Edge Cases

- Explicit `--outputs-dir` is intentionally outside the index rule and does not repair the default collision.

## Confirmed-Clean Surfaces

- The default path flattens model dots through `slugField`; no evidence this iteration that it allows dots, underscores, or capitals.

## Ruled Out

- No P0: the overwrite is limited to same resolved folder and has no direct security boundary.

## Next Focus

- Dimension: security
- Focus area: path, input, and artifact-boundary handling in the writer and archiver.
- Reason: confirm the new storage path remains constrained to the target skill and does not introduce unsafe path handling.
- Rotation status: next primary dimension.
- Required evidence: direct reads of resolver and archive destination checks.

Review verdict: CONDITIONAL

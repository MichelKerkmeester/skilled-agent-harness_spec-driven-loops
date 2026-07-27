# Iteration 1: Correctness — default run storage path allocation

## Dispatcher

- Budget profile: verify.
- Resolved route: mode=review target_agent=deep-review.

## Files Reviewed

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:94-119,138-143,388-402`
- `.opencode/skills/sk-doc/create-benchmark/SKILL.md:300-325,455-502`
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md:84-114,179-186`

## Findings - New

### P0 Findings

- None.

### P1 Findings

1. **Default dated folders can overwrite same-day evidence** — `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:398-402` — `run()` resolves `outputsDir` from `defaultOutputsDir()` (lines 138-143), which composes only `<date>--<subject>--<variant>` via `runFolderName()` (lines 112-119), then unconditionally calls `fs.mkdirSync(outputsDir, { recursive: true })` and proceeds to `fs.writeFileSync` the report pair and five companions (lines 539-563). There is no occupancy check and no trailing disambiguator, so a second same-day run for the same subject and variant resolves to the same path and overwrites the earlier run's evidence in place.
   - Finding class: `cross-consumer`
   - Scope proof: `runFolderName()` emits exactly three fields joined by `--`. The owning grammar at `.opencode/skills/sk-doc/create-benchmark/SKILL.md:312` states "Two runs of the same subject and variant on one day disambiguate with a trailing topic field," and `spec.md:181` (§8 Edge Cases) repeats the same requirement. The default writer emits no trailing field and performs no collision check.
   - Asymmetry proof: `archive-compiled-routing.cjs:167-169` IS collision-safe — it refuses to overwrite an existing run-label directory or either half of a prior pair. The Lane C default writer lacks the equivalent guard, so the same operator who is protected when archiving compiled-routing evidence is not protected when running the default playbook path.
   - Affected surface hints: `["Lane C default path", "report companion writer", "reports index"]`
   - Recommendation: allocate a unique trailing suffix before creating the directory, or fail closed and require an explicit disambiguator; do not overwrite an existing dated folder. Mirror the collision guard already present in `archive-compiled-routing.cjs`.
   - Claim adjudication:
```json
{"type":"claim_adjudication","claim":"The default path can overwrite an earlier same-day run with the same subject and variant.","evidenceRefs":[".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:112-119",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:138-143",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:398-402",".opencode/skills/sk-doc/create-benchmark/SKILL.md:312",".opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md:181"],"counterevidenceSought":"Searched for an occupancy guard, a unique-suffix allocator, or a documented same-folder replacement semantic between `defaultOutputsDir()` and `fs.mkdirSync`; none is present. Checked `archive-compiled-routing.cjs` for the equivalent path and confirmed it DOES guard, so the asymmetry is real and not a project-wide convention.","alternativeExplanation":"An operator can manually supply `--outputs-dir` to avoid the collision, but that does not satisfy the default-storage contract in REQ-004 (`spec.md:128`), which promises a durable folder without the operator choosing a path.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Documented intentional same-folder replacement semantics plus a retained historical copy would lower the severity."}
```

### P2 Findings

- None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | fail | hard | `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md:181`; `run-skill-benchmark.cjs:112-119,398-402` | Spec §8 requires a same-day disambiguating suffix; the default writer emits none and performs no collision check. |
| `checklist_evidence` | partial | hard | `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md` | Full checklist replay reserved for the traceability iteration. |
| `playbook_capability` | partial | advisory | `create-manual-testing-playbook/SKILL.md:262-274` | The playbook contract delegates default path selection to `run-skill-benchmark.cjs` and therefore inherits the collision behavior. |

## Integration Evidence

- `create-manual-testing-playbook/SKILL.md` names `run-skill-benchmark.cjs` as the writer for a no-`--outputs-dir` playbook run, so the default path is the path a playbook run actually exercises.

## Edge Cases

- Explicit `--outputs-dir` is intentionally outside the index rule and does not repair the default collision.
- The same-day collision risk is documented in `spec.md:181` and `create-benchmark/SKILL.md:312` but is not enforced by the default writer.

## Confirmed-Clean Surfaces

- `slugField()` flattens dots, slashes, and underscores to single hyphens and strips leading/trailing hyphens, so the default path does not admit dots, underscores, or capitals through the variant field. The grammar's alphabet is enforced at the field level.

## Ruled Out

- No P0: the overwrite is limited to the same resolved folder for the same subject/variant and has no direct security boundary. The frozen `baseline/` anchor is not at risk because `runFolderName()` never emits `baseline` and the archiver separately refuses it (`archive-compiled-routing.cjs:151`).

## Next Focus

- Dimension: security
- Focus area: path, input, and artifact-boundary handling in the default writer, archiver, and snapshot renderer.
- Reason: confirm the new storage path remains constrained to the target skill and does not introduce unsafe path handling, secret leakage, or untrusted interpolation.
- Rotation status: next primary dimension.
- Required evidence: direct reads of resolver, archiver, and snapshot destination checks.

Review verdict: CONDITIONAL

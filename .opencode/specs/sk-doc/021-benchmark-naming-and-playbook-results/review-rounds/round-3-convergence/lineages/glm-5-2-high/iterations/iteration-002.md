# Iteration 2: Security — destination and input boundaries

## Dispatcher

- Budget profile: verify.
- Resolved route: mode=review target_agent=deep-review.

## Files Reviewed

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:70-143,388-402`
- `.opencode/skills/sk-doc/create-benchmark/scripts/archive-compiled-routing.cjs:49-169`
- `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:31-134`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:235-283`

## Findings - New

### P0 Findings

- None.

### P1 Findings

- None new. The active P1-001 from iteration 1 is a correctness/data-preservation defect, not a security boundary violation.

### P2 Findings

- None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | partial | hard | `archive-compiled-routing.cjs:49,151-169`; `run-skill-benchmark.cjs:70-143,398-402` | The archiver is collision-safe and refuses the frozen `baseline` label; the default Lane C path is not. The security boundary itself is intact: paths stay under the resolved skill root. |
| `checklist_evidence` | partial | hard | `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md:84-87` (CHK-018, CHK-019) | Reserved for traceability replay. |

## Integration Evidence

- `resolveSkillRoot()` (lines 70-73) resolves a bare skill id under `.opencode/skills/` and a path-like arg as-is. The default outputs dir is `path.join(skillRoot, 'benchmark', 'reports', <run-folder>)`, so writes stay under the resolved skill root.
- `slugField()` (lines 94-99) collapses everything outside `[a-z0-9]+` to single hyphens and strips edges, so executor identity from the environment cannot introduce `..`, slashes, dots, underscores, or capitals into the folder name. The path-traversal surface through the variant field is closed.
- `archive-compiled-routing.cjs:49` enforces `RUN_LABEL_RE = /^[a-z0-9]+(?:-{1,2}[a-z0-9]+)*$/` and at line 151 refuses the `baseline` label, so the archiver cannot be tricked into overwriting the frozen anchor or escaping the grammar.
- `render-serving-snapshot.cjs:86-103` refuses any activation root that is not the live `010-live-activation` tree, including a `006-parent-hub-rollout` shadow candidate, so a snapshot cannot attribute a never-live state to production.
- No `execFileSync`, `spawn`, or shell interpolation over untrusted input was found in the reviewed writer, archiver, or snapshot boundaries. `archive-compiled-routing.cjs:59` uses `execFileSync('git', ...)` with no untrusted interpolation — the only argument is the resolved repo root.

## Edge Cases

- A skill id supplied as `../somewhere` would resolve as a path. This is documented behavior (`resolveSkillRoot` line 71) and is the operator's intent for path-like args; it is not a security defect because the operator is the one naming the target.

## Confirmed-Clean Surfaces

- Variant field alphabet enforced by `slugField()`.
- Frozen `baseline` anchor refused by both the archiver (line 151) and `runFolderName()` (which never emits it).
- Manifest source validation in the snapshot renderer refuses shadow candidates.
- No credential, token, or transcript content is introduced by the storage path; the sweep replaces only `<root>/<label>` path segments (per `checklist.md:84-87`).

## Ruled Out

- No untrusted shell interpolation or secret-handling path was found in the reviewed writer, archiver, and snapshot boundaries. The existing P1-001 remains a correctness/data-preservation defect outside the security classification.

## Next Focus

- Dimension: traceability
- Focus area: contract and migration alignment across the owning grammar, the playbook storage contract, the writer emission, and the snapshot consumer.
- Reason: the owner promises six files including `benchmark-report.md`; the writer and playbook contract emit seven files including `skill-benchmark-report.{json,md}`. The disagreement is a traceability defect.
- Rotation status: next primary dimension.
- Required evidence: direct comparison of `create-benchmark/SKILL.md` §10, `create-manual-testing-playbook/SKILL.md` §4, and `run-skill-benchmark.cjs:539-563`.

Review verdict: PASS

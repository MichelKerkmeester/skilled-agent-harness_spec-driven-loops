# Iteration 3 — Traceability: emitted layout versus packet contract

## Dispatcher

- Dimension: traceability
- Budget profile: verify
- Scope: packet acceptance criteria, task/checklist evidence, storage guide, and the Lane C writer.

## Files Reviewed

- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md`
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/plan.md`
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/tasks.md`
- `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md`
- `.opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`

## Findings - New

### P0 Findings

- None.

### P1 Findings

1. **Packet acceptance evidence still describes the obsolete six-file layout** — `.opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md:128` — the requirement, plan, task, and CHK-033 still assert six files, while the runtime writes `skill-benchmark-report.json`, `skill-benchmark-report.md`, and five companions at `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:552-575`. The target storage guide also says the run directory contains only a pair plus an optional README at lines 135-153. The remediation note correctly describes seven files, but it does not repair the governing acceptance criteria and reference authority.
   - Finding class: cross-consumer
   - Scope proof: the same stale six-file assertion appears in spec, plan, tasks, and checklist; the writer has one shared emission list.
   - Affected surface hints: target specification; plan and checklist; storage guide; Lane C writer.
   - Recommendation: make the target's normative layout and its acceptance evidence state the emitted seven-file folder shape, then add a single contract test that compares all documented authorities to the writer list.
   - Claim adjudication: {"type":"claim_adjudication","claim":"The packet's live acceptance contract does not match the emitted report folder.","evidenceRefs":[".opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/spec.md:128",".opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/plan.md:48",".opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/tasks.md:70",".opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/checklist.md:161",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:552-575"],"counterevidenceSought":"The implementation summary and CHK-036 call the layout seven files, but they are remediation prose rather than the governing requirement and storage reference.","alternativeExplanation":"The original six might have excluded the machine JSON, but the requirement says all files in the dated folder and the writer places it there.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"A normative definition that explicitly distinguishes the six curated files from the in-folder machine record and reconciles every acceptance row."}

### P2 Findings

- None.

## Traceability Checks

- `spec_code`: fail — active P1-001 and P1-002 show a preservation and contract mismatch.
- `checklist_evidence`: fail — CHK-035 demonstrates only sequential allocation, and CHK-033 retains the obsolete file count.
- `playbook_capability`: partial — the writer is capable, but the storage authority read by operators is stale.

## Integration Evidence

- The existing index writer is invoked from the writer's post-report path, so the index claim is structurally connected to report creation.

## Edge Cases

- The dated grammar itself is accepted by the archive validator and does not explain this layout mismatch.

## Confirmed-Clean Surfaces

- `scanParityBaseline` now falls back from the legacy fixed label to dated archived records with `compiledRoutingParity`.

## Ruled Out

- The earlier fixed-label parity regression is not active: dated discovery exists at `render-serving-snapshot.cjs:153-176`.

## Next Focus

- Dimension: maintainability
- Focus area: regression coverage and whether the test suite encodes the recovered contracts.
- Reason: active findings cross producer and documentation boundaries.

Review verdict: CONDITIONAL

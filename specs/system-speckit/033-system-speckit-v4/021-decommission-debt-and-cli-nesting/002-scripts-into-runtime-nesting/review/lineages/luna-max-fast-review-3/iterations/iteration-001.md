---
iteration: 1
focus: correctness
status: complete
newInfoRatio: 0.96
dimensions:
  - correctness
---

# Iteration 001 — Correctness: packet contract and moved-tree entrypoints

## Review objective

Compare the packet's declared execution boundary and completion evidence with
the current workspace layout and the first operational documentation surfaces.
This pass intentionally does not run repository validation, builds, installs or
tests because those commands are outside the detached lineage write contract.

## Sources read

- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/spec.md:40-50,70-110,120-145`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/plan.md:40-50,105-118`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/tasks.md:45-62`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/acceptance-criteria.md:30-40,55-95`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/implementation-summary.md:50-72`
- `.opencode/skills/system-spec-kit/runtime/cli/validation/README.md:15-31`
- `.opencode/skills/system-spec-kit/runtime/cli/utils/README.md:17-23`
- `.opencode/skills/system-spec-kit/runtime/cli/types/README.md:17-27`
- `.opencode/skills/system-spec-kit/runtime/cli/spec-folder/README.md:17-39,135-137`
- `.opencode/skills/system-spec-kit/runtime/cli/extractors/README.md:13-14,40-58`

## Findings

### F001 — Packet scope and completion evidence describe incompatible realities

- **Severity:** P1
- **Class:** matrix/evidence
- **Evidence:** `spec.md:47-50` calls this a planning-only phase, `spec.md:80-90` explicitly puts the `git mv` and source changes out of scope, and `tasks.md:57-60` says T009 verified that these documents do not attempt a move. In contrast, `acceptance-criteria.md:90-92` says the move executed and was verified, while `implementation-summary.md:55-72` says both moves shipped.
- **Impact:** A reviewer or follow-on execution packet cannot determine whether the physical move is an approved result of this packet or an out-of-scope mutation. The conflicting boundary changes which requirements, rollback, level and validation evidence are authoritative.
- **Required correction:** Choose one state and reconcile `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, and generated metadata. If the move shipped, promote the packet's scope and evidence to an execution packet; if it did not, remove shipped claims and retain the handoff.

### F002 — Moved CLI documentation still teaches retired source topology

- **Severity:** P1
- **Class:** cross-consumer
- **Evidence:** The files now under `runtime/cli/` still describe their source roots as `scripts/validation/` (`validation/README.md:16`), `scripts/utils/` (`utils/README.md:18`), `scripts/types/` (`types/README.md:18`), `scripts/spec-folder/` (`spec-folder/README.md:18,32`), and `scripts/extractors/` (`extractors/README.md:14,48`). `spec-folder/README.md:136-137` also links to the retired `../memory/README.md` concept even though the moved package uses `continuity/`.
- **Impact:** Developers following the package-local documentation are sent to paths that do not exist in the current workspace or are told to edit the wrong package topology. This undermines the packet's claimed path-rename completion and makes maintenance fixes likely to land in the wrong location.
- **Required correction:** Rewrite the moved-tree READMEs and relative links to use `runtime/cli/` and `continuity/`, while preserving references to other skills' independent `scripts/` directories only where they are intentional.

### F003 — Completed verification instructions invoke the removed pre-move level script

- **Severity:** P1
- **Class:** cross-consumer
- **Evidence:** `plan.md:114-118` names `.opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh` as an internal dependency, and `tasks.md:45-48` records T007 with the same path. The current script is under `runtime/cli/spec/recommend-level.sh`; the former `scripts/` package path is not the moved workspace location.
- **Impact:** Re-running the packet's own level gate from its recorded instructions fails or resolves the wrong surface, so AC-003 cannot be independently reproduced from the packet's evidence.
- **Required correction:** Update the dependency and task command to the current `runtime/cli/spec/recommend-level.sh` path, then refresh the recorded command/evidence and any generated metadata that fingerprints these documents.

## Quality-gate notes

- Direct path inventory confirmed 453 entries in `scratch/review-scope.txt`.
- No repository production or validation command was run.
- No P0 was established in this pass; all three findings have direct file/path evidence and remain active.
- Convergence is telemetry only; the loop must continue through iteration 10.

## Next focus

Build and test discovery: package scripts, Vitest project roots, TypeScript project references and the workspace lockfile.

Review verdict: FAIL

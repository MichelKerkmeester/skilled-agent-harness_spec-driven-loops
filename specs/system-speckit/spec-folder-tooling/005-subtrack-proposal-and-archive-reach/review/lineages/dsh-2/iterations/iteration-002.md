# Iteration 2: Security of archive search and restore/refusal boundaries

## Dispatcher

- Agent: @deep-review (LEAF), lineage `dsh-2`; single iteration, mode=review.
- Target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`; scope exactly `goal-file-manifest.txt`.
- Budget profile: verify (11-13 calls).
- Operator review focus: documentation alignment against phases 006-010. This iteration covered the focus on the security-adjacent surfaces: the opt-in archive search boundary, the restore path guards (mixed track, symlink, dot segments, next-number), and the case-folded duplicate refusal. It asked whether the manifest docs state each guard the code now enforces.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:116-160,358-396,474-500,679-770`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs:472-570,1461-1472`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:100-190,339-400,470-515`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:1-120`
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:80-105`
- `.skilled/commands/speckit/search.md:108-122`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114,120`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:43-47`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:53-68`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-lifecycle-automation.md:185-230`

## Findings

### P0 Findings

[None]

### P1 Findings

[None new. F001-F003 remain active from iteration 1.]

### P2 Findings

4. **F004: The archive.sh key-file row omits the phase 008 restore guards** — `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114` — The row documents the restore-next-number hand-off and the symlink/dot-segment refusals, but says nothing about the mixed-track refusal (`archive.sh:363-396`) or the status-3 restore verdict (`archive.sh:432-440`). An operator reading the "Key files" table cannot tell that a flat restore into a sub-tracked track is refused, or that a restore whose packet fails its own validation exits 0 with a warning rather than 1.
   Finding class: cross-consumer
   Scope proof: `archive.sh:363-396` contains the only mixed-track restore guard; `archive.sh:437-440` contains the only status-3 verdict. Grepping the manifest docs for "would hold flat packets" returns no doc hit; the closest statement is the catalog paragraph already raised as F003.
   Affected surface hints: ["runtime/cli/spec/README.md archive.sh row", "archive.sh help text", "changelog Archives section"]
   Case: A track has been grouped into sub-tracks and an operator restores a flat packet into it. The README says a restore returns the folder to its home; the code prints `Restore refused: track specs/<track> would hold flat packets` and exits 1, so the operator reads a guard as a broken command. In the status-3 case the restore succeeds and exits 0, but the README offers no warning text, so the operator does not know the restored packet still needs attention.

## Traceability Checks

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| `spec_code` | core | pass | `archive.sh:120-147` vs `README.md:114` symlink clause; `rg-wrapper.mjs:377-385` vs `retrieval-conventions.md:83-84` | The path guards the docs do state match the code. |
| `checklist_evidence` | core | pass | `008/plan.md` restore-guard deliverables and `implementation-summary.md` | The guard is implemented and evidenced; only the operator doc lags. |
| `skill_agent` | overlay | notApplicable | no agent definition is in the manifest | |
| `feature_catalog_code` | overlay | partial | `README.md:114` (this finding) and `spec-lifecycle-automation.md:45` (F003) | Two operator surfaces omit the same phase 008 guards. |
| `playbook_capability` | overlay | partial | `manual-testing-playbook/tooling-and-scripts/spec-lifecycle-automation.md:185-230` copies the help text without the guard | The playbook cannot catch a regression in the mixed-track refusal. |

## Integration Evidence

- `ark` archive guards: `archive.sh:120-147` walks path segments below the specs root and refuses a link; `archive.sh:474-500` refuses a symlinked `z_archive/`; `archive.sh:679-770` refuses dot segments and an occupied exact destination before the mixed-track check.
- `rg-wrapper` archive boundary: the default recipe keeps `--glob '!**/z_archive/**'` (`rg-wrapper.mjs:116`); `--include-archive` drops only that glob. The docs at `retrieval-conventions.md:83-84` and `search.md:110-116` state the opt-in and the marking, so the boundary is documented.
- `relocate.mjs` case-fold identity: `folderIdentity` folds the unwritten tail only where the volume folds case (`relocate.mjs:472-506`), and the duplicate refusal at `:544-559` is covered generically by `README.md:120` "a destination collision" and `spec-packet-relocation.md:60` "named by two entries". No separate finding; the generic wording reaches the guard.

## Edge Cases

- The `archive.sh` help text is a code surface, not a manifest doc, but the playbook at `manual-testing-playbook/tooling-and-scripts/spec-lifecycle-automation.md:185-230` reproduces it. The copied text is the doc surface that cannot catch the guard regression.
- The mixed-track restore guard returns early when `relocate.mjs` is missing (`archive.sh:371`). That is an installation-state edge, not a reachable input under the shipped layout; recorded as a residual risk, not a finding.
- `--include-archive` on a symlinked `z_archive/` is not documented as followed or refused. `rg` does not follow symlinks by default and the wrapper adds no `-L`, so the default behavior is the safe one; no finding.

## Confirmed-Clean Surfaces

- Archive search is opt-in and the default output shape is documented: `retrieval-conventions.md:83-84`, `search.md:110-116`, `search-presentation.txt:120-128`.
- Restore path traversal and symlink refusal are stated in `README.md:114`, `archive.sh:84-89` help, and the playbook transcript.
- `relocate.mjs` confines both ends to `specs/` and refuses a link (`relocate.mjs:526-538`); the feature catalog states it at `spec-packet-relocation.md:57`.
- The case-folded duplicate refusal is reachable and the generic "named by two entries" wording covers it; no doc contradiction beyond the missing specific example recorded in iteration 3.

## Ruled Out

- **A path-traversal or symlink-following defect in the restore path**: the guards exist and are ordered before the first write; no reachable bypass was found.
- **Archive search leaking live-only state**: the flag only drops the archive exclusion; it does not add roots, raise the limit, or change the ranking function.
- **Case-fold duplicate as a security issue**: it is a data-integrity guard, and the generic doc wording reaches it; no security severity.

## Next Focus

Dimension: traceability. Align SKILL.md, the references and the changelog with the phase 006-010 behaviours: `archivedPaths` in the path JSON, the three-case non-answer list in folder-structure.md, archive-aware phase numbering, and the changelog exit-code paragraph. Include the docs that need no change.

## Verdict

Review verdict: CONDITIONAL

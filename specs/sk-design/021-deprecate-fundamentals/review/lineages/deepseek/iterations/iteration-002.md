# Deep Review Iteration 2: Traceability

## Dimension

Traceability. Scope: do the packet's own acceptance criteria, implementation summaries and
changelogs match what is actually on disk, and does the recorded evidence identify a command that
can prove the claim?

## Review Focus Addressed

Operator focus, traceability half: the change set is measured against `spec.md`'s phase map and
handoff criteria, and each phase's recorded acceptance evidence is compared with the worktree. The
routing half of the focus was covered in iteration 1; the "lost guidance" and chart-citation
accuracy parts are carried to iterations 3 and 5.

## Files Reviewed

- `specs/sk-design/021-deprecate-fundamentals/spec.md:117-136` (phase map and handoff criteria)
- `specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/acceptance-criteria.md:54-77`
- `specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/implementation-summary.md:45-90`
- `specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/acceptance-criteria.md:54-77`
- `specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/implementation-summary.md:55-75`
- `specs/sk-design/021-deprecate-fundamentals/003-chart-research-cleanup/acceptance-criteria.md:50-62`
- `specs/sk-design/021-deprecate-fundamentals/003-chart-research-cleanup/implementation-summary.md:55-90`
- the five new changelogs and the four chart references' rule groups

Command evidence used:

- `compiled-route --hub sk-code` replays for the five baseline value prompts from the phase-1
  brief (all five route `sk-code-frontend`)
- `ls` on all five changelog files
- version greps on `sk-code/SKILL.md`, `sk-code-frontend/SKILL.md`, `sk-design/SKILL.md` and
  `sk-design-chart/SKILL.md`
- row counts on `web-visual-hierarchy.md` (40 diagnosis rows, 21 review rows, 21 UX-law entries)
- line counts on the three new references (566, 618, 642)
- `git status --porcelain` compared row by row with each phase's "Files Changed" table
- `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` (5/5)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 remains active and keeps this iteration at CONDITIONAL under the active-finding
mapping.

### P2 Findings

3. **Phase 2's changed-file table names a file that never changed** -- `specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/implementation-summary.md:75` -- The row says `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/node-to-token-markup.md` was modified to point at the frontend reference. The file is byte-identical to baseline `10474a9567` and contains no fundamentals or frontend reference at all.
   Case: a reviewer or a future phase uses the table as the audit trail for the repoint, trusts
   that this scenario was updated, and skips it. `git diff 10474a9567 --stat -- <path>` prints
   nothing, while `grep -n 'fundamentals|web-visual-values'` on the file prints no line.
   Finding class: instance-only
   Scope proof: the same row-by-row comparison over all three implementation summaries found this
   one false row; the other 45 rows name paths that are in `git status`.
   Affected surface hints: ["phase 2 implementation summary", "mcp-figma playbook audit"]
   Recommendation: drop the row, or update the scenario if the intended repoint is still needed.

4. **Phase 1's routing criterion mixes a five-prompt baseline with an eight-prompt replay** -- `specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/acceptance-criteria.md:62` -- AC-005 says "Given the five baseline value prompts ... each one routes to sk-code-frontend", but its verification cell says the replay routes "all eight value, review and motion prompts". The row records a `Met` status without naming which prompt set was replayed.
   Case: a later reader repeats the gate with the five baseline prompts and cannot tell whether
   the three extra prompts are a requirement, a sample, or the real contract. The phase summary
   separately says "all eight", so the two documents disagree on the scope of the same evidence.
   Finding class: instance-only
   Scope proof: the three prompt counts appear only in this AC row and in the phase summary;
   no list of the eight prompts is recorded in the packet.
   Affected surface hints: ["phase 1 acceptance criteria", "phase 1 implementation summary", "routing evidence"]
   Recommendation: name the eight prompts and their replay output in the AC, or narrow the
   criterion to the five baseline prompts.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Phase map statuses match the worktree, the folder is deleted, the hub has three modes, the chart files have no research citation. The routing handoff criterion remains partial because R1-P1-001 shows a documented visual-review phrase outside the frontend surface. |
| `checklist_evidence` | core | partial | Ten of eleven phase-1 criteria, nine of ten phase-2 criteria and all five phase-3 criteria name a command that resolves on disk. AC-005's prompt count is ambiguous and the phase-2 file table carries one false row. |
| `playbook_capability` | overlay | pass | The new `frontend-surface-visual-values` scenario declares `WEB_VISUAL_VALUES` and the two expected resources; `verify-router-sync.cjs` check 4 prints `PASS check 4` and the suite prints `5/5 checks passed`. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog entry changes in this diff; the chart corpus and diagram feature catalogs are untouched. |
| `agent_cross_runtime` | overlay | pass | The five new changelogs exist; the canonical agent and four mirrors carry the new decide path (iteration 1 evidence). |

## Edge Cases

- The phase summaries record `validate.sh --strict` results that this lineage is forbidden to
  rerun. The review therefore checks the recorded evidence's specificity and cross-document
  agreement, and does not claim the gate was re-observed. That is the same standard the packet's
  own "Known Limitations" rows use.
- `specs/sk-design/021-deprecate-fundamentals/` is untracked in this worktree, so git cannot show
  an intra-packet delta. Baseline comparison is against `10474a9567` for the repo files and
  against the packet's own text for the untracked docs.
- The phase-2 file table's folder row shows as "not changed" in `git status` only because git
  lists the deleted files individually; that is not a false claim.

## Confirmed-Clean Surfaces

- The five baseline value prompts named in the phase-1 brief all route to `sk-code-frontend`:
  padding, type scale, palette, "why does this screen look wrong" and dropdown animation.
- The four chart files keep the three rule groups the changelog names: the role split figures,
  the radar/pie decision and the stacked-area one-row card.
- All five new changelogs exist and carry the version they announce.
- The three new references have the counts the acceptance criteria claim (566, 618, 642 lines;
  40/21/21 hierarchy rows).
- `verify-router-sync.cjs` passes all five legs, including the replay of the new visual-values
  scenario.

## Ruled Out

- **A wholesale false-files table in every phase.** Ruled out by row-by-row comparison; only one
  row is false.
- **A missing changelog or a version that disagrees with its changelog.** Ruled out by `ls` and
  `grep` on all five files.
- **A chart rule that lost its supporting figure.** Ruled out by reading the three rule groups
  against the removed citations.

## Next Focus

Dimension: maintainability. Check whether the canonical descriptions still match the new surface
content, whether any retired rule failed to move, and whether the new files' own structure is
safe to change.

Review verdict: CONDITIONAL

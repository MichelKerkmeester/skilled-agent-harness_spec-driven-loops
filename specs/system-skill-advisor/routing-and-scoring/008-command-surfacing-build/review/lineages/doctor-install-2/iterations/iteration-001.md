# Review Iteration 1 — correctness

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-2-1794570021136-noekp0`, generation 1, lineageMode new.
- Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/doctor-install-2`.
- Dimension: correctness. Budget profile: verify.
- Operator review focus: pass two of the command-surfacing review. This iteration verified the four pass-one embed-engine fixes and read the files changed since pass one in the doctor-install area. It addressed the mutating-command safety part of the focus and the claude/codex/opencode/pi/devin/dsh behaviour where the embed engine writes each runtime's instruction file. Holdout hygiene is not applicable to this area; no holdout file was opened.

## Files Reviewed

- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:644-886` (compose and the new symlink refusal), `:902-932` (allowlist), `:1052-1106` (backup), `:1308-1341` (restore), `:1343-1495` (apply), `:1623-1664` (exit mapping)
- `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:84-110` (plan, approval, write, exit branches)
- `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt:240-275` (failure summary and troubleshooting)
- `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs:612-790` (foreign line, damaged backup, write throw, restore throw), `:940-990` (symlink cases)
- `.skilled/commands/doctor/scripts/README.markdown:100-108` (engine and check rows)
- Pass-one verification input: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-report-pass-1.md:201-216`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The exit-3 contract has no branch for a restore that throws, so the route can misstate a partly written tree** -- `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:104` -- the new write-failure path returns 3 after printing `ERROR: writing ... failed`, then either `restored: ...` or `ERROR: the backup copy ... does not match ... nothing was restored`, or, when the restore itself throws, `ERROR: the restore failed: ...` with no `restored:` and no `nothing was restored` (`agents-md-embed.cjs:1425-1439`). The route text has only the first two branches, so a restore failure falls through with no instruction on what to tell the operator about the tree. The presentation contract repeats the two-branch model at `doctor-agents-md-presentation.txt:256`.
   Case: applies the new `a restore that throws is reported with the backup and undo lines and exits 3` case (`tests/agents-md-embed.test.cjs:744`): the second write throws and the hook damages `manifest.json`; the engine exits 3 with `ERROR: the restore failed: Unexpected token`, and following the route text leaves `Changed:` and the tree state unstated.
   Finding class: latent-doc-code-drift
   Scope proof: `rg -n "restore failed|nothing was restored|restored:" agents-md-embed.cjs` shows the three outcomes; the YAML at `:104` matches only the last two.
   Affected surface hints: ["apply exit 3", "failure summary", "operator undo path"]
   Claim adjudication: `{"type":"traceability","claim":"A restore that throws produces an exit-3 output the route contract does not describe, so the operator-facing reply can leave the tree state unstated or wrong.","evidenceRefs":[".skilled/commands/doctor/scripts/agents-md-embed.cjs:1434",".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:104",".skilled/commands/doctor/assets/doctor-agents-md-presentation.txt:256"],"counterevidenceSought":"read the phase 6 catch-all and the failure template; both name STATUS=FAIL but neither says whether the tree was restored","alternativeExplanation":"the operator still sees the engine's ERROR line and the backup and undo lines, so the harm is a missing state sentence rather than a lost recovery path","finalSeverity":"P2","confidence":0.9,"downgradeTrigger":"none; the engine output is reproduced by its own test"}`

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | Pass-one workstream WG1 and the four finding rows were read; the packet spec is read in iteration 4. |
| checklist_evidence | core | pending | No checklist row claimed in this iteration. |
| skill_agent | overlay | notApplicable | No skill or agent definition in this area. |
| agent_cross_runtime | overlay | partial | The embed engine writes `AGENTS.md`, `CLAUDE.md`, `.codex/AGENTS.md`, `.cursor/rules/*` and `REPO RULES.md`; claude, codex, cursor and devin are the runtimes those paths serve. opencode, pi and dsh are not embed-engine targets. |
| feature_catalog_code | overlay | pending | Scheduled for iteration 4. |
| playbook_capability | overlay | notApplicable | No playbook file in this area. |

## Integration Evidence

No command, workflow, skill or MCP tool was executed in this iteration. The integration claims are structural: the engine's `USAGE` and the YAML's exit branches name the same 0/1/2/3 contract, and the README row names `restore --run=<dir>` as the undo path. The owning file `env -u AI_SESSION_CHILD node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` passed 43 of 43.

## Edge Cases

- The plan-side `foreign` branch in `commandPlan` cannot fire from a composed document: `composition.composed` is built only from shipped section bodies plus the render block, and every shipped line is in `currentOnly`. The live guard is the apply-time check against the bytes on disk; recorded here so the dead plan branch is not mistaken for proof.
- `restoreFromBackup` can return `null` (hash mismatch) or throw (unreadable record, allowlist failure). The write-failure catch handles both without escaping, but only the hash-mismatch text is described in the route. This is the finding above.
- The backup directory is outside the repository when git does not ignore `.skilled/output/doctor-agents-md`; the test fixtures cover both branches.

## Confirmed-Clean Surfaces

- DR1-P1-001 holds: the write loop is wrapped at `agents-md-embed.cjs:1413-1440`, a throw restores from the backup and returns 3, and the test's `treeDigest` equals the pre-run digest.
- DR4-P1-001 holds: `compose` refuses a symlinked router or mirror whose action would create, replace or remove (`:819-829`), and the two new tests pass; a link the run leaves alone still plans clean.
- DR4-P2-001 holds: `restoreFromBackup` proves every recorded copy against its hash before the first path moves (`:1313-1321`), and the damaged-backup test keeps the tree as the write left it.
- DR1-P2-003 holds: plan and apply now treat `dropped` and `foreign` together (`:1281`, `:1377`), and the planted-foreign test restores and exits 1.
- The engine's exit mapping in `main` still returns 2 only for precondition and allowlist refusals and lets exit 3 travel as a normal return (`:1639-1654`).

## Ruled Out

- **The write-failure fix is incomplete** -- ruled out for the write path: the engine restores, prints `backup:` and `undo:` and exits 3. The surviving defect is the route text for the second fault, not the restore itself.
- **The symlink refusal misses a link the run would remove** -- ruled out: the action filter includes `remove`, and `restoreFromBackup` re-checks every path through `assertWritable`.
- **A hash-mismatched backup is still copied over the tree** -- ruled out: the pre-verification returns `null` before the copy loop, and the test asserts the damaged bytes never reach the root file.

## Next Focus

- Dimension: correctness and traceability
- Focus area: `agents-md-check.cjs`, its test file, and `scripts/README.markdown`
- Reason: pass-one DR1-P2-001, DR1-P2-002, DR3-P2-001, DR5-P2-003 and DR3-P2-004 all live in that engine or its docs; the check engine reads the same files the embed engine writes.
- Rotation status: first pass on the check engine in this lineage.
- Blocked/productive carry-forward: the exit-3 route finding stays open for the coordinator; do not re-read it here.
- Required evidence: direct read of the changed verdict branches and the owning test file.

Review verdict: PASS

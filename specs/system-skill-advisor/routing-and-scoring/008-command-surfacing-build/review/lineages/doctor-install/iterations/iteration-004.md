# Review Iteration 4 — security

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-1794550137809-1ecgc7`, generation 1.
- Dimension: security. Budget profile: verify.
- Operator review focus: this iteration covered holdout hygiene (counts only; no holdout prompt text was read or printed) and the write containment of the one mutating engine in this lineage. The mutating-offer safety was revisited at the filesystem boundary.

## Files Reviewed

- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:88-98, 642-841, 888-918, 1284-1305, 1429-1524`
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:632-735` (symlink handling in A10)
- `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:54-69` (hook wiring in a linked project)
- `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:25-41` (mutation boundaries)
- Count-only evidence: `routing-accuracy/holdout-prompts.jsonl` (66 lines), `routing-accuracy/command-prompts.jsonl` (176 lines; 87 none, 45 tune, 44 holdout)
- Consumer-name evidence: `routing-accuracy/run-command-behaviour.mjs:578-589`, `measure-brief-cost.mjs:105-119`, `score-command-transcripts.mjs:944-960,1157`, `command-offer.mjs:325-349`, `capture-command-routing-baseline.mjs:446-494`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A symlinked `REPO RULES.md` or `.cursor/rules/repo-local.md` is written through, so apply mutates a file its plan never named** -- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:783` -- `compose` refuses a symlinked root document (`:652-654`) and skips symlinked folded copies (`:733`), but the router and Cursor mirror branches read and replace without a symlink check (`:783-823`). `assertWritable` (`:888-906`) resolves links and rejects only a target outside the root, so a link pointing at another file **inside** the repository passes; `fs.writeFileSync` in the apply loop (`:1372`) then writes to the link target instead of the allowlisted path.
   - Case: a repository with `REPO RULES.md -> AGENTS.md` (a shape the `link` install mode itself produces) runs `/doctor:agents-md embed`; the plan prints `target REPO RULES.md: replace`, and apply overwrites `AGENTS.md` with router rows, then the proof reads the real `AGENTS.md` it just clobbered.
   - Finding class: class-of-bug
   - Scope proof: the only `isSymlink` guards in the engine are at `:652` (root file), `:733` (folded copies) and `:846,1070` (pointer); `rg -n "isSymlink" agents-md-embed.cjs` shows no guard on `routerPath` or `mirrorPath`; `assertWritable` line `:902` compares the resolved target to the real root, not to the allowlisted path.
   - Affected surface hints: ["compose router branch", "compose cursor mirror branch", "assertWritable", "commandApply write loop"]
   - Claim adjudication:
     ```json
     {"type":"security","claim":"A symlink at an allowlisted path that points inside the repository is written through, so the run mutates a file outside the bytes the plan printed.","evidenceRefs":[".skilled/commands/doctor/scripts/agents-md-embed.cjs:783",".skilled/commands/doctor/scripts/agents-md-embed.cjs:809",".skilled/commands/doctor/scripts/agents-md-embed.cjs:902",".skilled/commands/doctor/scripts/agents-md-embed.cjs:1372"],"counterevidenceSought":"read every isSymlink guard and the real-path branch of assertWritable; checked whether backup/restore would detect a different target","alternativeExplanation":"the symlink-engine link mode is expected to link instruction files, and a linked repo may be rejected earlier by A1/E1 state rather than reaching compose","finalSeverity":"P1","confidence":0.75,"downgradeTrigger":"downgrade to P2 if the router and mirror are documented as never symlinked and the embed route refuses a repository that links them"}
     ```

### P2 Findings

2. **Automatic rollback restores the backup without the allowlist and hash checks the manual restore enforces** -- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:1288` -- `restoreFromBackup` iterates `record.paths` with `path.join(root, entry.path)` (`:1289`) and `fs.copyFileSync` (`:1299`), while `commandRestore` calls `assertWritable` (`:1453`) and verifies every backup against `entry.sha256` (`:1464`). A backup that is corrupt or a record whose path was edited is copied back without either check, so the automatic rollback can write outside the allowlist or restore bytes that are not the pre-run ones.
   - Case: a partial write leaves a truncated backup file for `AGENTS.md`; the post-write proof fails and `restoreFromBackup` copies the truncated file back, reporting only `restored: N file(s)` while the tree is now neither the old nor the new state.
   - Finding class: instance-only
   - Scope proof: `rg -n "assertWritable|sha256" agents-md-embed.cjs` shows both only in `commandRestore`/`assertWritable`; the `restoreFromBackup` body `:1284-1305` contains neither.
   - Affected surface hints: ["restoreFromBackup", "commandApply rollback", "commandRestore"]

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | The embed YAML's mutation-boundary claims were checked against the code; packet `spec.md` still not read at this level. |
| checklist_evidence | core | notApplicable | Phased parent has no root `checklist.md`. |
| skill_agent | overlay | notApplicable | No skill or agent definition in scope. |
| agent_cross_runtime | overlay | pass | A linked project's `.claude`/`.codex`/`.cursor`/`.devin` hook files are symlinks into the checkout, which is why `hook-wiring-check` reads the checkout's entry; recorded as context for the symlink finding. |
| feature_catalog_code | overlay | partial | Feature catalog entry not read. |
| playbook_capability | overlay | notApplicable | No playbook file in scope. |

## Integration Evidence

Holdout consumers named: `run-command-behaviour.mjs` refuses a holdout row before its prompt is read (`:584-589`), `measure-brief-cost.mjs` refuses a holdout id (`:119`), `score-command-transcripts.mjs` marks a holdout row unscored (`:1157`), `command-offer.mjs` refuses an unknown or holdout row (`:325-349`), and `capture-command-routing-baseline.mjs` tallies holdout rows into aggregate baseline counts only (`:446-494`). No doctor-install file reads a holdout file: `rg -l "holdout" .skilled/commands/doctor` returned no path. The counts are 44 holdout rows inside `command-prompts.jsonl` and 66 rows in `holdout-prompts.jsonl`; no prompt text was opened.

## Edge Cases

- Holdout files are in the `accuracy-runner` area, not this lineage's area. They were inspected by file name, line count and split-value count only, as the review focus requires; no content was read.
- `capture-command-routing-baseline.mjs` reads holdout rows to compute aggregate tallies. That is an evaluation baseline rather than a tune path, and it writes no prompt text; recorded as an observation, not a finding, because the file is outside this lineage's area.
- The symlink finding depends on a repository state the engine's own `link` install mode can create. If the install flow always links `AGENTS.md`/`CLAUDE.md`/`REPO RULES.md` together, the router symlink is expected, not exotic.

## Confirmed-Clean Surfaces

- `assertWritable` (`agents-md-embed.cjs:888-906`) checks containment before allowlist membership and resolves the nearest existing ancestor, so a `..` segment or an outward link is refused.
- The engine never prints the Codex `trusted_hash`: `codex-hook-approval-check.cjs:15-16,196-204` reports only status, group, index and config path.
- `hook-wiring-check.cjs` and `codex-hook-approval-check.cjs` take no write path and emit no secret; both were run read-only in iteration 2.
- Backups go to a git-ignored path or the OS temp directory (`agents-md-embed.cjs:953-968`), so a backup is not published by the next commit.
- The manual restore refuses a record that names another root (`agents-md-embed.cjs:1445-1448`).

## Ruled Out

- **Holdout prompts leak through a doctor path** — ruled out: no file under `.skilled/commands/doctor` matches `holdout`, and the doctor commands never read the routing-accuracy corpora.
- **Holdout text is printed by a scoring error message** — ruled out at the code level: refusal messages carry the row id and reason only (`run-command-behaviour.mjs:589`), not the prompt.
- **The backup directory can be chosen by the caller** — ruled out: `backupBase` derives it from the root and `planFor` refuses an existing directory.

## Next Focus

- Dimension: maintainability
- Focus area: the two engines' structure and the docs that describe them, with the P1/P2 findings checked for whether a smaller change removes the class
- Reason: four iterations covered behavior, traceability and security; the remaining dimension is the cost of the next safe change
- Rotation status: first maintainability pass
- Blocked/productive carry-forward: the symlink write-through finding is the one that must survive to synthesis
- Required evidence: direct read only, no new discovery beyond the recorded sites

Review verdict: CONDITIONAL

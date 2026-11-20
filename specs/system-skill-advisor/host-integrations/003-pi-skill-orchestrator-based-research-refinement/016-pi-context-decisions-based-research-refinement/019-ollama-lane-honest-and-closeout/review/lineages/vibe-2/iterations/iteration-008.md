# Review Iteration 008

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1795172940208-84a42n`, generation 1, lineageMode `new`
- Focus: Frontier node F-1-005, dimension `maintainability`
- Review target type: `files`
- Operator review focus: the commit set `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b`, and the ten `docs(specs)` commits `2f5fe41bb9e`..`aaaff7dd9df`.

### How this iteration addressed the operator review focus

The focus asks for defects in shipped behavior and for doc claims that mislead an operator. This iteration read the older changelog inside the F-1-005 scope and found that two claims already recorded as wrong in the newer changelog and the scoring reference are stated again here, word for word. That is why the earlier findings survive a fix to one file: the claim has two homes.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:22-27,33,39`
- `.skilled/changelog/skilled/v4.1.0.0.md:229`
- `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:80`
- `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:29`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/` (10 leaves)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:281`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/` (6 leaves)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 from iteration 1 remains active and keeps this run at CONDITIONAL.

### P2 Findings

1. **Two claims already recorded as wrong are stated again in the older changelog, so fixing one file leaves the other** -- `.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:26` -- the launcher sentence "It always sets `SYSTEM_SKILL_ADVISOR_DB_DIR` for the daemon child" is the same claim R2-P2-001 recorded against `.skilled/changelog/skilled/v4.1.0.0.md:229`, and the code still only fills the variable when the operator has not set it. The coverage sentence at `:24`, "Incomplete coverage reports `incomplete_skill_vectors`", is the same claim R4-P2-001 recorded against `references/scoring/advisor-scorer.md:80`, and the code still reports `no_skill_vectors` when no vector exists. Each claim now has two homes and no single source of truth, so a fix applied to the file the earlier finding named leaves the other copy in place.
   Finding class: `maintainability`
   Scope proof: both copies are inside the declared target: `v1.3.0.0.md` is in the F-1-005 scope and `v4.1.0.0.md` and `advisor-scorer.md` are declared target entries.
   Affected surface hints: `changelog/v1.3.0.0.md`, `changelog/skilled/v4.1.0.0.md`, `references/scoring/advisor-scorer.md`, launcher DB directory documentation, `disabledReason` vocabulary.
   Case: a maintainer fixes R2-P2-001 by editing `v4.1.0.0.md:229` to say the launcher fills the variable only when unset. The changelog for the release that introduced the behavior still tells the operator it is always set, and the next reader who searches the changelogs finds the wrong sentence first because it is in the older file.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `changelog/v1.3.0.0.md:24,26`, `v4.1.0.0.md:229`, `advisor-scorer.md:80` | Two claims are duplicated across files; both copies are wrong in the same way. Recorded as R8-P2-001. |
| `checklist_evidence` | pass | `acceptance-criteria.md:56-66` | No `Unmet` row. |
| `agent_cross_runtime` | notApplicable | `.skilled/agents/` (no advisor status reference) | No agent definition integrates the advisor surface. |

## Integration Evidence

- The feature catalog index row for `scorer-fusion` states 10 leaves and the directory holds 10, and the row's topic list names all 10. No drift.
- The playbook index maps `SC-005` to `scorer-fusion/ablation.md`, and that file exists among the 6 playbook leaves.
- `v1.3.0.0.md:33` states the ablation measurement correctly: 196-row corpus, 156 with the lane at `0.05`, 161 without, 7 flips, no new gold-`none` fire, default `0`.
- `v1.3.0.0.md:22` matches the shipped background refresh: one shared refresh, local coverage check, one 500 ms probe, missing or stale rows only, failed embed keeps the old vector, `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH=off` disables it.
- `v1.3.0.0.md:25` matches the shipped status surface: `vectorCoverage` counts and `coverageComplete`, and the health check probes Ollama even at weight 0.

## Edge Cases

- **Ambiguity: whether a duplicated claim is a new finding or a restatement of two recorded ones.** The duplication is the defect the earlier findings could not see, because each cited one file. Recorded as a maintainability finding and cross-referenced to both.
- **Contradiction: the older changelog and the newer one state the same wrong sentence.** Both were read; the code is the tiebreaker and contradicts both.
- **Missing dependency: no test or check compares changelog claims across files.** Recorded, not converted into a pass.

## Confirmed-Clean Surfaces

- The feature catalog index leaf count matches the directory for `scorer-fusion`.
- The playbook index entry for `SC-005` resolves.
- The older changelog's ablation paragraph matches the packet table.
- The older changelog's background-refresh paragraph matches the shipped refresh.
- The older changelog's status paragraph matches the shipped status surface.

## Ruled Out

- **The feature catalog index undercounts its leaves.** Ruled out: the row says 10 and the directory holds 10.
- **The playbook index points at a missing scenario file.** Ruled out: `scorer-fusion/ablation.md` exists.
- **The older changelog's ablation numbers are stale.** Ruled out: they match the packet table.
- **The older changelog describes a refresh that no longer ships.** Ruled out: the described refresh matches the shipped one.

## Next Focus

- Dimension: none remaining. All four configured dimensions are covered and both frontier nodes are answered.
- Focus area: synthesis.
- Reason: the run reached legal convergence at iteration 7 and this iteration closed the last open frontier dimension.
- Rotation status: F-1-002 all four dimensions complete; F-1-005 all four dimensions complete.
- Blocked/productive carry-forward: productive — reading the older changelog for the same claim found the duplication the single-file findings missed.
- Required evidence: the findings registry and the eight iteration artifacts, for synthesis.
- Recovery note: none.

Review verdict: CONDITIONAL

# METADATA

- Iteration: 4 of 5
- Focus dimension: Dimension 4 - No over-replacement
- Executor: cli-codex / gpt-5.5 / high reasoning / fast tier
- Spec folder: `specs/skilled-agent-orchestration/070-sk-deep-rename`
- Review target write boundary: source/read-only; wrote only this iteration artifact and `review/deltas/iter-004.jsonl`

# SUMMARY

Found 1 new finding: 1 P0, 0 P1, 0 P2. Parent Packet 070 and Phase 006 narrative correctly preserve source-to-target rename wording, and the requested pre-promote backup snapshots still retain historical `sk-deep-*` references. The blocker is narrower: Phase 002's own rename docs still contain nonsensical over-replacements such as `deep-review to deep-review` and `.opencode/skills/deep-review/` renamed to itself.

# P0 FINDINGS

## P0-004 - Phase 002 rename docs still describe self-renames after over-replacement

- Evidence:
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/spec.md:7` says `"deep-review to deep-review"`.
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/spec.md:74` says to rename `.opencode/skills/deep-review/` to `.opencode/skills/deep-review/`.
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/plan.md:98` lists `.opencode/skills/deep-review/` as the old review skill root and then `git mv` to the same path.
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/tasks.md:67` marks a task complete for renaming `.opencode/skills/deep-review/` to `.opencode/skills/deep-review/`.
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/implementation-summary.md:73` records `deep-review` -> `deep-review`.
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/graph-metadata.json:19` records `"deep-review to deep-review"`.
- Why this is a P0 for this dimension: the iteration prompt defines a P0 as a spec doc that is now nonsensical, with this exact class of example. Phase 002 is the child packet that actually documents the skill folder rename, so its narrative needs the old names restored where it describes the source side.
- Impact: Packet 070 cannot honestly sign off on "no over-replacement" while the rename phase's own spec, plan, tasks, implementation summary, and graph metadata describe identity renames.
- Concrete fix: restore source-side names in Phase 002 narrative and metadata where the text documents the rename:
  - `sk-deep-review` -> `deep-review`
  - `sk-deep-research` -> `deep-research`
  Then re-run a focused grep for `deep-review to deep-review`, `deep-research to deep-research`, and same-path `.opencode/skills/deep-*` rename rows under `002-skill-folder-rename/`.

Claim adjudication:

```json
{
  "type": "claim-adjudication",
  "claim": "Phase 002 rename documentation was over-replaced and now describes self-renames instead of sk-deep-* to deep-* renames.",
  "evidenceRefs": [
    ".opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/spec.md:7",
    ".opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/spec.md:74",
    ".opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/plan.md:98",
    ".opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/tasks.md:67",
    ".opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/implementation-summary.md:73",
    ".opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/graph-metadata.json:19"
  ],
  "counterevidenceSought": "Checked the parent Packet 070 docs and Phase 006 docs to see whether the cleanup was globally restored; those surfaces do preserve sk-deep-* source names, so the defect is isolated to Phase 002 rather than every rename narrative.",
  "alternativeExplanation": "The self-rename wording could be treated as post-rename current-state prose, but the cited lines explicitly describe rename tasks, old roots, and source-to-target mappings, so identity wording is not meaningful there.",
  "finalSeverity": "P0",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade only if Phase 002 is declared outside the release-signoff scope or intentionally rewritten as post-rename-only current-state docs, which conflicts with the current Phase 002 description and task language."
}
```

# P1 FINDINGS

No new P1 findings.

# P2 FINDINGS

None.

# POSITIVE OBSERVATIONS

- Parent Packet 070 narrative is restored and contains both old and new names:
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/spec.md:4`
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/spec.md:72`
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/resource-map.md:25`
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/resource-map.md:26`
- Phase 006 narrative and metadata also preserve the real source-to-target rename:
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/006-advisor-and-validate/spec.md:63`
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/006-advisor-and-validate/spec.md:116`
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/006-advisor-and-validate/implementation-summary.md:56`
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/006-advisor-and-validate/graph-metadata.json:55`
- The requested description files are correct:
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/description.json:3` says `sk-deep-review -> deep-review + sk-deep-research -> deep-research`.
  - `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/002-skill-folder-rename/description.json:3` says `git mv .opencode/skills/sk-deep-review -> deep-review and sk-deep-research -> deep-research`.
- Pre-promote backup snapshots are preserved. A hidden-file-aware grep found old-name references in:
  - 4 files under `.opencode/specs/skilled-agent-orchestration/061-agent-optimization/008-agent-deep-review/improvement/pre-promote-backup/`
  - 4 files under `.opencode/specs/skilled-agent-orchestration/061-agent-optimization/009-agent-deep-research/improvement/pre-promote-backup/`
  - 12 files under `.opencode/specs/skilled-agent-orchestration/063-sk-doc-agent-template-alignment/improvement/pre-promote-backup/`
- Historical telemetry retains old entries. `.opencode/skills/.smart-router-telemetry/compliance.jsonl:6` and `.opencode/skills/.smart-router-telemetry/compliance.jsonl:7` still record `sk-deep-research` and `sk-deep-review`; `shadow-deltas.jsonl` files also retain historical prompt payloads with old names.
- Renamed skill changelog directories exist at `.opencode/skills/deep-review/changelog/` and `.opencode/skills/deep-research/changelog/`. The sampled historical changelogs contain current `deep-*` names and older deep-loop migration references; no illegitimate active old-name issue was found there in this pass.

# DIMENSION COVERAGE

Review actions executed:

- Checked parent Packet 070 `spec.md` and `resource-map.md` for source-to-target rename wording.
- Checked Phase 006 docs and metadata for the cleanup narrative.
- Checked Phase 002 docs, task records, implementation summary, and graph metadata for over-replacement.
- Checked the three requested pre-promote backup directories with `rg --hidden` because the backup files are dotfiles.
- Checked telemetry logs (`compliance.jsonl`, both `shadow-deltas.jsonl` copies) for historical old-name entries.
- Listed and sampled renamed skill changelog directories under `.opencode/skills/deep-review/changelog/` and `.opencode/skills/deep-research/changelog/`.

Ruled out:

- No P1 for pre-promote backups: old names are present once hidden files are included in the grep.
- No P0 in the parent Packet 070 docs: the parent `spec.md`, `resource-map.md`, `description.json`, and `graph-metadata.json` preserve source-side old names where they explain the rename.
- No P0 in Phase 006 docs: the final verification child describes restoration of `sk-deep-review`/`sk-deep-research` source-side narrative.
- No new finding for changelog `v*.md` files: the directories exist and sampled files do not show an active broken reference or nonsensical self-rename.

# NEXT ITERATION RECOMMENDATIONS

- Iteration 5 should treat P0-004 as release-blocking unless remediated before the final referee pass.
- Include a final adversarial grep for identity-rename wording under the full Packet 070 tree:
  - `deep-review to deep-review`
  - `deep-research to deep-research`
  - `.opencode/skills/deep-review/` renamed to `.opencode/skills/deep-review/`
  - `.opencode/skills/deep-research/` renamed to `.opencode/skills/deep-research/`
- Re-check carried-forward P1s from iterations 1 and 2 alongside this P0 so the final verdict separates rename-narrative blockers from advisor/graph/changelog issues.

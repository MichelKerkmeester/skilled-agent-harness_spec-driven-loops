# Iteration 3: Traceability of SKILL.md, references and changelog to phases 006-010

## Dispatcher

- Agent: @deep-review (LEAF), lineage `dsh-2`; single iteration, mode=review.
- Target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`; scope exactly `goal-file-manifest.txt`.
- Budget profile: verify (11-13 calls).
- Operator review focus: documentation alignment. This iteration covered the focus by checking the manifest's reference and skill-document surfaces (SKILL.md, structure/workflow references, retrieval contract, changelog) against the shipped phase 006-010 behaviour, and by naming the reference docs that need no change.

## Files Reviewed

- `.skilled/skills/system-spec-kit/SKILL.md:280-319`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:97-153`
- `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:240-260`
- `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md:130-145,255-270`
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:80-105`
- `.skilled/commands/speckit/search.md:108-122`
- `.skilled/commands/speckit/assets/search-presentation.txt:110-130`
- `.skilled/commands/speckit/README.txt:95-110`
- `.skilled/skills/system-spec-kit/changelog/v2.13.0.0.md:59-75,139-170`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs:41-46,140-170,254-300`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:377-385`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1808-1829`

## Findings

### P0 Findings

[None]

### P1 Findings

5. **F005: The retrieval contract documents archive marking only for the structured and count JSON recipes** — `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:84` — The sentence enumerates `archived: true|false` on "the structured and count recipes" and says nothing about the path recipe's new `archivedPaths` field. Phase 009 added that field beside `paths` so a JSON reader can tell which listed paths are archived (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:377-385`). The same omission is repeated at `.skilled/commands/speckit/search.md:116`, `.skilled/commands/speckit/assets/search-presentation.txt:120` and `.skilled/commands/speckit/README.txt:105`.
   Finding class: cross-consumer
   Scope proof: `grep -rn "archivedPaths" .skilled/skills/system-spec-kit --glob '*.md'` returns no manifest doc; the only writer is `rg-wrapper.mjs:382` and the only test is `rg-include-archive.vitest.ts:138-165`. The path recipe's `paths` array is deliberately unchanged, so `archivedPaths` is the only machine-readable marker.
   Affected surface hints: ["retrieval-conventions.md Section 2 archive mode", "speckit/search.md JSON contract", "search-presentation.txt render table", "speckit README.txt recipe table"]
   Case: A command or agent parses `rg-wrapper.mjs path '<phrase>' --include-archive --json` and, following the contract, sees only `paths` (plain strings) and no `archived` row; it cannot tell which of the two returned paths is archived. The field exists but is undocumented, so the phase 009 guarantee is invisible to a doc-led consumer.

```json
{
  "findingId": "F005",
  "claim": "The retrieval contract documents archived JSON marking only for the structured and count recipes and omits the path recipe's archivedPaths field added in phase 009.",
  "evidenceRefs": [
    ".skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:84",
    ".skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:377-385",
    ".skilled/commands/speckit/search.md:116",
    ".skilled/commands/speckit/assets/search-presentation.txt:120"
  ],
  "counterevidenceSought": "Checked the feature catalog, command README, presentation asset and the path-recipe test. No manifest doc names archivedPaths; the test proves the field is deliberate, and the phase 009 goal says a JSON reader must be able to tell which paths are archived.",
  "alternativeExplanation": "archivedPaths may be intended as an internal test-only field. The path recipe returns it on the public JSON record and phase 009's acceptance command reads it, so the public-contract reading is stronger.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If the field is declared internal and a doc-led consumer uses a different marker, downgrade to P2."
}
```

### P2 Findings

6. **F006: The structure reference still says the proposal has exactly three non-answer cases** — `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:141` — The sentence lists "three cases, each with one line and exit `0`": below threshold, no grouping, already grouped. Phase 009 added a fourth: a packet folder that is not `NNN-slug` prints `packet <folder> is not NNN-slug and must be renamed first` and `no map` (`.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs:291-300`). The same paragraph also does not say that proposed group names avoid existing undeclared folders (`suggest-subtracks.mjs:153-166,254-288`).
   Finding class: instance-only
   Scope proof: `suggest-subtracks.mjs:293` is the only producer of the non-NNN-slug line; `folder-structure.md:141` is the only reference that enumerates the non-answer cases by count.
   Affected surface hints: ["folder-structure.md When to Propose a Sub-Track", "suggest-subtracks output contract"]
   Case: A flat track holds `001-rank` and `002_rank`, both numbered but only one NNN-slug. The operator runs the proposal, sees `packet 002_rank is not NNN-slug and must be renamed first` and `no map`, and the structure reference says only three cases exist, so the operator cannot match the output to any documented branch.

7. **F007: Phase guidance does not say that an archived phase counts when numbering a new one** — `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:255` — The guidance says "Add the next sequential child phase", and `quick-reference.md:265` repeats it, without stating that the parent's `z_archive/` participates in the choice. Phase 008 changed `create.sh` to scan both the live children and `z_archive/` (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1808-1829`), so with `001-alpha` live and `z_archive/002-gamma` archived the next child is `003`, not `002`.
   Finding class: cross-consumer
   Scope proof: `create.sh:1813` is the only phase-numbering loop; `phase-definitions.md:255` and `quick-reference.md:265` are the only two guidance lines that describe adding a child phase without naming the archive.
   Affected surface hints: ["phase-definitions.md adding a phase", "quick-reference.md phased packets", "create.sh phase numbering"]
   Case: A parent holds `001-alpha` live and `002-gamma` in `z_archive/`. Following the "next sequential" wording, an operator expects `002` and is surprised by `003-delta`; the doc gives no reason the gap is skipped.

8. **F008: SKILL.md's script list omits the relocation, proposal and archive entrypoints** — `.skilled/skills/system-spec-kit/SKILL.md:317` — The "Scripts:" line names only `validate.sh`, `create.sh`, `generate-context.js` and `check-completion.sh`. It does not name `relocate.mjs`, `suggest-subtracks.mjs` or `archive.sh`, and the Quick Reference table above it has no row for relocation or archive. The skill's own `create.sh` row at `:287` names `suggest-subtracks.mjs`, so the omission is inconsistent inside the same file.
   Finding class: instance-only
   Scope proof: `grep -n "relocate\|suggest-subtracks\|archive" SKILL.md` returns only the `:287` mention; the relocation and archive tools appear nowhere else in the 319-line skill document.
   Affected surface hints: ["SKILL.md Quick Reference Commands", "SKILL.md references list", "skill discoverability"]
   Case: An agent loads system-spec-kit to move a packet and reads SKILL.md first. The Quick Reference table offers no relocation row, so the agent either hand-moves the folder (violating D3) or never discovers the deterministic engine.

9. **F009: The changelog's exit-code and archive-JSON paragraphs predate phases 008 and 009** — `.skilled/skills/system-spec-kit/changelog/v2.13.0.0.md:67` — The release note says "Exit 0 means nothing is left to do... Exit 2 means the plan was refused or a step failed" and omits status 3, which phase 008 added. Its search paragraph at `:165` says "With the flag, JSON rows carry `archived: true` or `archived: false`" and omits the path recipe's `archivedPaths`.
   Finding class: cross-consumer
   Scope proof: The changelog is the release's user-facing contract; `relocate.mjs:34-38` and `rg-wrapper.mjs:380-382` are the two behaviours it names incompletely. The detailed CLI README states both, so the changelog is the stale surface.
   Affected surface hints: ["changelog Moving Packets", "changelog Archive Search and Validation"]
   Case: An operator who reads only the release note concludes that a status-3 run is a status-2 failure and that path-recipe JSON has no archived marker, then writes automation around the wrong contract.

## Traceability Checks

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| `spec_code` | core | partial | `retrieval-conventions.md:84` vs `rg-wrapper.mjs:377-385`; `phase-definitions.md:255` vs `create.sh:1813`; `folder-structure.md:141` vs `suggest-subtracks.mjs:291-300` | Three reference/code gaps; the code itself matches the phase goals. |
| `checklist_evidence` | core | pass | phase 007/008/009 plan and summary rows | The behaviours are evidenced in the phase packets. |
| `skill_agent` | overlay | notApplicable | no agent definition in the manifest | |
| `agent_cross_runtime` | overlay | notApplicable | no mirrored agent file in the manifest | |
| `feature_catalog_code` | overlay | partial | deferred to iteration 4 | Catalog-specific to be checked there. |
| `playbook_capability` | overlay | partial | playbook 492/493/494 deferred to iteration 4 | |

## Integration Evidence

- `sk-doc/sk-create-skill/SKILL.md` requires the SKILL.md operational surface to name the shipped entrypoints; `SKILL.md:317` is the one line that should carry them.
- `sk-doc/sk-create-feature-catalog/SKILL.md:347` requires current-state claims with source anchors; the reference gaps here are upstream of the catalog pass.
- `sk-doc/sk-create-command/SKILL.md` router/presentation split: `search.md` and `search-presentation.txt` are the two halves of the same archive-JSON contract and both omit `archivedPaths`.
- `system-spec-kit` structure docs: `folder-structure.md:141` and `phase-definitions.md:255` are the two operator-facing procedure statements that the new behaviour changes.

## Edge Cases

- `folder-structure.md:143` tells an operator on an already-grouped track to "write the map by hand". Phase 009 keeps that instruction valid because `suggest-subtracks.mjs` refuses to map an already-grouped track; the finding is limited to the non-answer count and the name-collision rule at `:141`.
- `phase-definitions.md` also says "the command picks the next number after the highest numbered packet in that track" at `:82`. That sentence is about creating a parent, not a child phase, and the archive rule is the same in both cases; the finding cites the child-phase guidance at `:255` where the omission is observable.
- The reworded archive signal in `graph-metadata.json` is generated JSON outside the manifest. The manifest's `references/memory/trigger-config.md` does not state the signal, so there is no in-scope doc to align; recorded as an exclusion, not a pass.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-spec-kit/references/workflows/worked-examples.md:71` and `.skilled/commands/create/assets/*-presentation.txt` already carry the Option C sub-track wording from phase 002; no phase 006-010 change touches them.
- `AGENTS.md:80` already names the sub-track and the whole-track map; it needs no change for phases 006-010.
- `references/structure/phase-definitions.md:82` (parent creation numbering) is not contradicted by the archive-aware phase rule.
- `references/workflows/quick-reference.md:135` ("numbers the packet from the highest number in use") is consistent with `create.sh:1644`; the phase-child wording at `:265` is the gap, not the packet row.
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md` covers the phase 003 archive seeding and mixed-track diagnostics it owns; phase 006-010 does not change that page.

## Ruled Out

- **A wrong assertion that `archivedPaths` replaces `paths`**: `rg-wrapper.mjs:380` keeps `paths` as plain strings, and the docs' statement about `paths` remains true; the finding is the missing new field, not a type change.
- **`phase-definitions.md:82` as a numbering contradiction**: it describes creating the parent, and the parent-number path also counts the archive; no observable mismatch.
- **`worked-examples.md` as stale**: its only relevant text is the Option C line, which phase 002 already updated.
- **`AGENTS.md` as stale**: its Option C line is current; no phase 006-010 behaviour is stated there.

## Next Focus

Dimension: maintainability. Check the feature catalog and manual-testing playbook pages against the shipped phase 006-010 behaviour and against `sk-create-feature-catalog` / `sk-create-manual-testing-playbook`: bare-name and pre-archive rewrites, the status-3 path, the mixed-track restore, and the playbook scenarios' coverage.

## Verdict

Review verdict: CONDITIONAL

# Iteration 5: Cross-reference consolidation and active-P1 replay

## Dispatcher

- Agent: @deep-review (LEAF), lineage `dsh-2`; single iteration, mode=review.
- Target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`; scope exactly `goal-file-manifest.txt`.
- Budget profile: adjudicate (8-10 calls).
- Operator review focus: documentation alignment. This iteration consolidated the focus by replaying every active P1 against its cited code path, mapping each phase 006-010 behaviour to its final doc owner, and naming the docs that need no change. It adds one last catalog gap rather than repeating an existing finding.

## Files Reviewed

- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/sub-track-proposal.md:13-69`
- `.skilled/skills/system-spec-kit/SKILL.md:295,317`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637-1662,1808-1829`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs:34-38,1661`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:363-396,432-440`
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:84`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:377-385`
- `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/decision-record.md` (accepted residual check)

## Findings

### P0 Findings

[None]

### P1 Findings

[None new. F001, F002, F003 and F005 replay as active and confirmed; see Traceability Checks and Ruled Out.]

### P2 Findings

15. **F015: The sub-track proposal catalog's non-answer enumeration omits the non-NNN-slug refusal** — `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/sub-track-proposal.md:30` — The sentence lists three situations that produce one line and no map: already grouped, below threshold, no grouping found. Phase 009 added a fourth: a packet folder that is not `NNN-slug` prints `packet <folder> is not NNN-slug and must be renamed first` and then `no map` (`.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs:291-300`). The same catalog's source-file table still lists only `suggest-subtracks.vitest.ts` as the test anchor, so a reader cannot see the new refusal path.
   Finding class: instance-only
   Scope proof: `suggest-subtracks.mjs:293` is the only producer of the misnamed line; the catalog's non-answer sentence at `:30` is the only enumeration in the feature catalog, while `folder-structure.md:141` carries the same gap as F006.
   Affected surface hints: ["feature-catalog sub-track proposal non-answers", "folder-structure.md three-case list"]
   Case: A flat track holds `001-rank` and `002_rank`; the operator reads the feature catalog, expects one of three known non-answers, and gets a fourth line naming the underscore packet. The catalog does not explain the branch or the rename-first remedy.

## Traceability Checks

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| `spec_code` | core | pass | F001 at `SKILL.md:295` vs `create.sh:1644/1813`; F002 at catalog `:66` vs `relocate.mjs:34-38/1661`; F003 at catalog `:45` vs `archive.sh:432-440/363-395`; F005 at conventions `:84` vs `rg-wrapper.mjs:380-382` | All four P1 pairs re-read this iteration and still disagree. |
| `checklist_evidence` | core | pass | phase 006-010 `tasks.md` evidence rows | The implementation evidence is complete; the doc layer is the gap. |
| `feature_catalog_code` | overlay | partial | F002, F003, F010, F011, F015 | Five catalog claims lag the shipped behaviour. |
| `playbook_capability` | overlay | partial | F012, F013, F014, F004 | Four scenario/help surfaces cannot catch the new behaviours. |

## Integration Evidence

- `sk-doc/sk-create-feature-catalog/SKILL.md:347` requires a source anchor for every feature claim; F015 is an unanchored branch in the catalog's current-state text.
- `sk-doc/sk-create-manual-testing-playbook` deterministic-scenario contract: the playbooks in F012-F014 have stable fixtures but no step for the behaviours they now claim.
- `sk-doc/sk-create-command` router/presentation split: `search.md:116` and `search-presentation.txt:120` are the two halves of the same JSON contract; F005 already names both.
- `system-spec-kit` decision record "Residual against D3" accepts that phase-column numbers and `Phase N of M` rows keep old numbers after a renumber; this review does not reopen that accepted residual.

## Edge Cases

- F001 and F005 are both doc/code contract gaps but on different surfaces (SKILL.md allocation vs the retrieval JSON contract); neither subsumes the other.
- F002 and F009 report the same status-3 omission on two doc surfaces; they remain separate because a release note and a current-state catalog serve different readers.
- F003, F004 and F007 report the same phase 008 restore/numbering work across the catalog, the CLI README and the phase reference; they are distinct files and the operator asked for per-surface line evidence.
- The reworded archive signal remains outside the manifest (generated `graph-metadata.json`); no in-scope doc states it, so there is no finding to raise inside this scope.

## Confirmed-Clean Surfaces

- P1 replay: no active P1 can be downgraded. F001 is a live allocation command in SKILL.md; F002 and F003 state an exit contract that the code contradicts; F005 is the only machine-readable archive marker in the path JSON.
- `README.md:400-435,1195-1210` (root capability roundup) needs no phase 006-010 change; it does not state exit codes or JSON fields.
- `AGENTS.md:70-85` needs no change; Option C already names sub-tracks and the whole-track map.
- `references/workflows/worked-examples.md:71` needs no change; it is the current Option C wording.
- `references/structure/phase-definitions.md:82` needs no change; it describes parent creation, and the archive rule is the same there.
- `feature-catalog/tooling-and-scripts/track-root-children-lists.md` and `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` need no change; phases 006-010 do not alter the behaviours they own.
- `manual-testing-playbook/tooling-and-scripts/spec-validation-archive-reach.md` needs no change; it covers the phase 004 archive validation.
- `.skilled/skills/system-spec-kit/README.md:610-641` needs no change; it is an index and the detailed status-3 contract lives in `runtime/cli/spec/README.md:120`.

## Ruled Out

- **P0 escalation of the doc/code contradictions**: the failures cost a misdiagnosed exit or an undiscovered field; none is data loss, a security breach, or a hard-gate failure. P1 remains the supported ceiling.
- **A single consolidated "phase 006-010 docs are stale" finding**: the operator asked for exact file:line per gap, and the surfaces have different owners and fixes; one umbrella finding would hide them.
- **Reopening the accepted `Phase N` residual**: `decision-record.md` records the phase-column residual as out of scope; this review keeps that decision.
- **A finding for the root README, AGENTS.md, worked-examples, track-root page, validation-rule-engine page or validation playbook**: each was checked against the phase 006-010 behaviours it could state, and each is current or out of the affected surface.
- **A finding for the reworded archive signal**: the signal lives in generated `graph-metadata.json`, which the manifest excludes; no in-scope doc restates it.

## Next Focus

None. Four dimensions are covered; the loop reached `maxIterations` 5 with four active P1 findings and eleven P2 advisories. Synthesis should route the P1 set to `/speckit:plan` and carry the P2 set as closing doc updates.

## Verdict

Review verdict: CONDITIONAL

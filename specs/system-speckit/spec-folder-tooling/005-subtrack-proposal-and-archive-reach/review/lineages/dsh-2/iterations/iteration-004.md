# Iteration 4: Maintainability of feature catalog, playbooks and README surfaces

## Dispatcher

- Agent: @deep-review (LEAF), lineage `dsh-2`; single iteration, mode=review.
- Target: `specs/system-spec-kit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`; scope exactly `goal-file-manifest.txt`.
- Budget profile: verify (11-13 calls).
- Operator review focus: documentation alignment. This iteration covered the focus on the two sk-doc authoring surfaces that make a shipped capability auditable: the feature catalog (current-state source anchors) and the manual-testing playbook (deterministic scenario contract). It also checked the README/index surfaces against `sk-create-readme`.

## Files Reviewed

- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:13-104`
- `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md:13-67`
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:660-750,1060-1090`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:23-235`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/sub-track-proposal.md:23-177`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-archive-search.md:23-185`
- `.skilled/skills/system-spec-kit/README.md:610-641`
- `README.md:400-435,1195-1210`
- `AGENTS.md:70-85`
- `.skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md:170-200,340-350`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:1-120`
- `.skilled/skills/sk-doc/sk-create-readme/SKILL.md:1-120`

## Findings

### P0 Findings

[None]

### P1 Findings

[None new. F001-F003 and F005 remain active.]

### P2 Findings

10. **F010: The relocation catalog's rewrite step still describes only whole-path ids** — `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:44` — The step says references to the old path are rewritten and "An old id is matched as a whole path, so a longer id that starts with it is left alone." Phase 007 also rewrites bare sibling folder names in a phase parent's own documents (`relocate.mjs:680-753`, `:1363`) and the id a packet had before it was archived (`relocate.mjs:647-678`, `:1027`). Neither rewrite appears in the step or in the refusals paragraph.
   Finding class: instance-only
   Scope proof: `grep -n "bareNameEdits\|preArchiveAliases" relocate.mjs` finds the two producers; the catalog's rewrite list at `spec-packet-relocation.md:38-49` is the only feature-catalog enumeration of the rewrite pass.
   Affected surface hints: ["feature-catalog rewrite step", "runtime/cli/spec/README.md relocate row"]
   Case: A phase child is renumbered; the parent's Phase Documentation Map still names the old folder in bare form and a pre-archive reference still names the old id. The catalog says only whole ids are matched, so an operator expects both references to remain and may edit them by hand, which D3 forbids.

11. **F011: The archive-search catalog says the path recipe's paths stay plain strings and never names `archivedPaths`** — `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md:28` — The field exists beside `paths` (`rg-wrapper.mjs:380-382`) and phase 009's acceptance check reads it. The catalog says the `paths` list "stays a list of plain strings" without saying how a JSON reader learns which listed paths are archived.
   Finding class: cross-consumer
   Scope proof: `grep -rn "archivedPaths" feature-catalog` returns nothing; the writer and the test are the only two places the field appears.
   Affected surface hints: ["feature-catalog archive search JSON contract", "rg-include-archive.vitest.ts"]
   Case: A feature reader builds a JSON consumer from the catalog, sees only `paths`, and cannot mark archived hits; the catalog's current-state claim is incomplete for the recipe it registers.

12. **F012: The relocation playbook has no status-3 or resume scenario** — `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:226` — The Pass/Fail row requires `APPLY_EXIT=0` and a clean rerun only. Phase 006's late-step resume and phase 008's status 3 are not exercised, so the scenario cannot catch either regression. The expected output at `:193-199` shows only the all-green path.
   Finding class: instance-only
   Scope proof: `grep -n "exit 3\|FAILED\|resume" spec-packet-relocation.md` returns only the generic failure-triage line at `:233`; the two phase behaviours have no scenario step.
   Affected surface hints: ["playbook 492 scenario contract", "relocate resume/strict-validation test coverage"]
   Case: A future change reverts the late-step ledger marks or makes a failed packet validation exit 2 again; the playbook still passes because it never runs either path.

13. **F013: The proposal playbook never feeds the printed map to the relocation preflight** — `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/sub-track-proposal.md:169` — Phase 009's guarantee is that every printed map passes `relocate.mjs --map` preflight. The Pass/Fail row checks the map shape and the untouched fixture but never runs the preflight, and the fixture has no non-NNN-slug packet, so the fourth non-answer case is untested.
   Finding class: instance-only
   Scope proof: `grep -n "relocate" sub-track-proposal.md` returns no command; the feature catalog claims the map is preflight-shaped at `rg-archive-search.md`-adjacent line `sub-track-proposal.md:18`, and the code refuses misnamed packets at `suggest-subtracks.mjs:291-300`.
   Affected surface hints: ["playbook 493 scenario contract", "suggest-subtracks preflight guarantee"]
   Case: A change makes the proposal emit a `NNN_<slug>` destination or reuses an existing undeclared folder name; the playbook passes because it never asks the preflight to accept the map.

14. **F014: The archive-search playbook's Pass/Fail row checks text output only and not the path JSON record** — `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-archive-search.md:176` — The row requires `[archived]` marking in the human output and the count recipe's `archived` rows, but the path recipe's `archivedPaths` is the phase 009 contract and is never asserted. The expected JSON block at `:137-168` is the count recipe, not the path recipe.
   Finding class: instance-only
   Scope proof: `grep -n "archivedPaths" rg-archive-search.md` returns nothing; the path-recipe assertion exists only in `rg-include-archive.vitest.ts:138-165`.
   Affected surface hints: ["playbook 494 scenario contract", "rg-wrapper path JSON contract"]
   Case: A change drops `archivedPaths` from the path recipe; the playbook still passes because it only inspects the live/archived text lines and the count recipe.

## Traceability Checks

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| `spec_code` | core | pass | The code behaviours themselves match the phase 006-010 goals; F010-F014 are doc-surface gaps | No code defect found. |
| `checklist_evidence` | core | pass | `005-tests-and-closeout` and phases 006-010 `tasks.md` evidence rows | The test work is evidenced; playbook coverage is the missing verification layer. |
| `feature_catalog_code` | overlay | partial | `spec-packet-relocation.md:44`, `rg-archive-search.md:28`, `spec-lifecycle-automation.md:45`, `feature-catalog.md:678-694` | Four catalog surfaces lag their code. |
| `playbook_capability` | overlay | partial | playbook 492:226, 493:169, 494:176, 237:212-230 | Four playbook contracts do not exercise the new behaviours. |

## Integration Evidence

- `sk-doc/sk-create-feature-catalog/SKILL.md:176-200` requires each per-feature file to document the shipped behaviour with implementation and validation anchors; the two catalog findings are anchor-backed claims that no longer match the code.
- `sk-doc/sk-create-manual-testing-playbook` requires a deterministic scenario that can fail; playbooks 492-494 have stable fixtures but no step for the phase 006-010 behaviours, so they cannot fail for those regressions.
- `sk-doc/sk-create-readme` README structure: the system-spec-kit README passes the linked table and verification sections; its script table is an index and the detailed contract lives in `runtime/cli/spec/README.md:120`, so no README finding.
- Root `README.md:416-417` names both tools and `README.md:1205` names the archive search; it is a capability roundup, not an exit-code or JSON-field contract, so it needs no phase 006-010 change.

## Edge Cases

- `feature-catalog/feature-catalog.md:678-694` repeats the same summary claims as the per-feature pages. It is cited as an affected surface, not a separate finding, because the per-feature file is the source of truth.
- `manual-testing-playbook/tooling-and-scripts/spec-lifecycle-automation.md:212-230` reproduces the archive help text; F004 already names the missing guard, so this iteration does not double-count it.
- The playbook 493 fixture holds five packets, below the default threshold; it uses `--threshold 4`. That is a valid scenario and not a finding.
- `feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:35` already states archive-aware packet numbering; the phase-child case is F007, not a second lifecycle-catalog finding.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-spec-kit/README.md:610-641` is structurally current: the archive row describes the next-number restore, the relocation row links the four modes and the dry-run default. It is an index, and the detailed status-3 contract lives in the CLI README.
- Root `README.md:400-435,1195-1210` names the tools at capability level and does not claim exit codes or JSON fields; no change is needed for phases 006-010.
- `AGENTS.md:70-85` carries the current Option C sub-track wording; no phase 006-010 behaviour is stated there.
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-validation-archive-reach.md` covers the phase 004 archive validation and is unchanged by phases 006-010; no change.
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md` covers the phase 003 mix/archive seeding it owns; no change.

## Ruled Out

- **A structural README violation**: the system README and root README have the required sections, links and verification rows; the gaps are behavioural, not structural.
- **A missing feature-catalog registration**: the root catalog registers both features at `:678-694` and `:1082`; the problem is current-state text, not discovery.
- **A playbook voice or format violation**: the scenarios have the prompt, commands, expected output and Pass/Fail sections; the gap is missing coverage, not missing shape.
- **A separate finding for the feature-catalog root summaries**: the per-feature page is the source of truth and the root entry repeats it; one finding per behaviour is enough.

## Next Focus

Dimension: cross-reference consolidation. Recheck the active P1s, map each phase 006-010 behaviour to its final doc owner, and record the docs that need no change. Do not add a finding that repeats one of F001-F014.

## Verdict

Review verdict: CONDITIONAL

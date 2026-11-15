# Review Report: documentation alignment of the subtrack proposal and archive reach packet

## 1. Verdict

**CONDITIONAL.** 0 P0, 10 active P1 rows and 17 P2 rows in the merged registry, which collapse to 7 distinct P1 issues and 8 distinct P2 issues once the two lineages' duplicates are joined.

The code matches the behaviour phases 006 to 010 promised. The operator-facing documentation does not: the feature catalog, the playbook, `SKILL.md`, two references and the changelog still describe the packet as it stood after phase 005.

## 2. Run

| Item | Value |
|------|-------|
| Command | `/deep:review` auto, fan-out |
| Executor | `cli-deepseek-harness`, `deepseek-v4.1-flash-1017`, reasoning `max` |
| Lineages | `dsh-1` and `dsh-2`, 5 iterations each, both exit 0 |
| Scope | `goal-file-manifest.txt`, 74 files the packet changed outside `specs/`, generated JSON and fixtures left out |
| Dimensions | correctness, security, traceability, maintainability, plus the operator focus on standards alignment and staleness |
| Merge | `fanout-merge.cjs`, strongest restriction, `merged_verdict: CONDITIONAL` |

## 3. P1 findings, verified against the files

Each was re-read by the orchestrator, and the code side of each claim was confirmed in the source.

| # | File:line | Defect | Code that proves it | Registry ids |
|---|-----------|--------|---------------------|--------------|
| 1 | `feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66` | Exit contract lists 0, 1 and 2 only. Status 3, a landed move whose packet fails its own validation, is missing | `relocate.mjs:1661` sets status 3 | F002, R1-P1-001 |
| 2 | `feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45` | Says a failed `relocate.mjs` restore exits 1. Status 3 is a successful restore that exits 0 with a warning, and the mixed-track restore refusal is not mentioned | `archive.sh:437-441`, `archive.sh:363` `refuse_mixed_track_restore` | F003, R2-P1-004 |
| 3 | `runtime/cli/spec/README.md:114` | `archive.sh` row omits the mixed-track restore refusal and the status 3 outcome | `archive.sh:363`, `archive.sh:745` | R2-P1-005, F004 |
| 4 | `feature-catalog/retrieval/rg-archive-search.md:28` | Says the path recipe's `paths` stays plain strings and never names `archivedPaths` | `rg-wrapper.mjs:382` writes `record.archivedPaths` | R3-P1-007, F011 |
| 5 | `references/retrieval/retrieval-conventions.md:84` | Archive marking is documented for the structured and count recipes only, not the path recipe's `archivedPaths` | `rg-wrapper.mjs:382` | F005 |
| 6 | `references/structure/folder-structure.md:141` | Says `suggest-subtracks.mjs` prints no map in three cases. A packet that is not NNN-slug is a fourth | `suggest-subtracks.mjs:296` | R3-P1-008, F006, F015 |
| 7 | `SKILL.md:295` | The published next-number command is `ls -d specs/[0-9]*/`, which ignores archived packets and tracks, against decision D4 | `create.sh` counts archived packets, `archive-numbering.vitest.ts` | F001, R1-P1-002 |

## 4. P2 findings

| File:line | Defect |
|-----------|--------|
| `changelog/v2.13.0.0.md:67`, `:216` | Exit codes, archive JSON and test counts predate phases 006 to 010 |
| `feature-catalog/tooling-and-scripts/spec-packet-relocation.md:44` | Rewrite step names whole-path ids only, not the phase-map bare-name, re-parent and pre-archive id passes |
| `feature-catalog/tooling-and-scripts/spec-packet-relocation.md:91` and the playbook page | Source inventories list only `relocate.vitest.ts`, not `relocate-real-pipeline.vitest.ts` |
| `manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:27`, `:226` | No status 3 or late-step resume scenario |
| `manual-testing-playbook/tooling-and-scripts/sub-track-proposal.md:169` | Never feeds the printed map to the relocate preflight |
| `manual-testing-playbook/retrieval/rg-archive-search.md:176` | Pass row checks text output only, not the path JSON record |
| `references/structure/phase-definitions.md:255` | Does not say an archived phase counts when numbering a new phase |
| `runtime/cli/spec/archive.sh:83` | `--help` omits the mixed-track refusal and the status 3 restore outcome |
| `SKILL.md:317` | Script list omits `relocate.mjs`, `suggest-subtracks.mjs` and `archive.sh` |
| `README.md:639` (skill) | Relocation summary has no status 3; the lineages split on whether an index page needs it |

## 5. Standards alignment

| Standard | Result |
|----------|--------|
| sk-code-skilled, code | `verify_alignment_drift.py` on `runtime/cli/spec` and `runtime/cli/retrieval`: PASS, 0 findings. Neither lineage raised a code defect |
| sk-create-skill, `SKILL.md` and references | Findings 6 and 7 and the P2 script-list row |
| sk-create-feature-catalog | Findings 1, 2 and 4 and the P2 inventory and rewrite rows |
| sk-create-manual-testing-playbook | P2 rows only: missing scenarios, no structural defect |
| sk-create-command | `search.md` and `search-presentation.txt` keep the router and presentation split. No finding |
| sk-create-readme | `runtime/cli/spec/README.md` finding 3. Root `README.md` needs no change |

## 6. Needs no change

Both lineages agree on these: root `README.md`, `AGENTS.md`, `agents-md-manifest.json`, `.env.example`, `references/workflows/worked-examples.md`, `feature-catalog/retrieval/rg-flood-control.md`, `feature-catalog/tooling-and-scripts/track-root-children-lists.md`, `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md`, `manual-testing-playbook/tooling-and-scripts/spec-validation-archive-reach.md`, and the relocation command reference at `runtime/cli/spec/README.md:120`.

## 7. Fix first

Finding 2. It tells an operator that a restore which succeeded has failed, so they would rerun a move that already landed. Findings 1 and 3 fall out of the same edit.

## 8. Not done

- The continuity save was not run. It restamps `description.json` in this packet, which another session already has uncommitted.
- Nothing was fixed. Remediation waits on the operator.

## 9. Sources

`lineages/dsh-1/review-report.md`, `lineages/dsh-2/review-report.md`, `deep-review-findings-registry.json`, `fanout-attribution.md`.

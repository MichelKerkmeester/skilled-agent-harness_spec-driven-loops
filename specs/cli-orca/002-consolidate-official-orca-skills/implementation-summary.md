---
title: "Implementation Summary: Consolidate Official Orca Skills Into Standalone cli-orca"
description: "What the extraction produced, how it was verified, and what remains open at the time of writing."
trigger_phrases:
  - "cli-orca implementation summary"
  - "extraction results"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-consolidate-official-orca-skills |
| **Status** | In Progress |
| **Level** | 3 |
| **Started** | 2026-09-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Layout Revision** | 2026-09-20 - snapshots flattened to `assets/<name>.txt`, per-skill references regrouped under `references/orca-skills/`, first version set to 0.1.0.0 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

This packet records the extraction of the Orca CLI subject out of the mcp-tooling parent hub and its promotion to a standalone class-S skill named `cli-orca`, together with the upgrade that embeds the eight official Orca skills as authored references and verbatim snapshot assets. The extraction is finished: the skill corpus, the hub extraction at nine modes, the packet move, the fleet catalog updates, the advisor re-ingestion and the sixteen-gate close-out suite are all complete, and every packet claim below carries a captured result.

<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Files Changed

| Area | Paths | State |
|------|-------|-------|
| Baseline evidence | `scratch/baseline-pre-extraction.txt` | Written |
| Research artifacts | `scratch/research-official-skills.md`, `scratch/research-orca-cli-surface.md`, `scratch/research-routing-boundaries.md` | Written |
| Verbatim snapshots | `.skilled/skills/cli-orca/assets/*.txt` | Written, digest-verified |
| Provenance record | `.skilled/skills/cli-orca/assets/PROVENANCE.md` | Written |
| Skilled corpus | `.skilled/skills/cli-orca/{SKILL.md,README.md,references/**,feature-catalog/**,manual-testing-playbook/**,changelog/**,benchmark/**,graph-metadata.json,leaf-manifest.config.json}` | Written, every document validated |
| Hub extraction | `.skilled/skills/mcp-tooling/**` | Written, nine modes declared |
| Packet move | `specs/cli-orca/001-mcp-orca-cli/**` | Moved, metadata re-pointed |
| Track metadata | `specs/cli-orca/{description.json,graph-metadata.json}` | Written |
| Fleet catalogs | `.skilled/skills/README.txt`, the create-skill root metadata contract | Updated for fourteen roots |
| Gate evidence | `scratch/gate-results.md`, `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--extraction-routing-verification/**` | Captured |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Extract the subject into a standalone class-S skill | Accepted |
| ADR-002 | Carry each official skill as an authored reference plus a verbatim snapshot | Accepted |
| ADR-003 | Keep verbatim snapshots outside the documentation extension scope | Accepted |
| ADR-004 | Remove the repository copy after proving equivalence | Accepted |
| ADR-005 | Dispatch research and writing to external read-only workers | Accepted |
| ADR-006 | Keep the packet flat at Level 3 | Accepted |
| ADR-007 | Keep three deliberate Orca deferral mentions in the hub root files | Accepted |
| ADR-008 | Record the hub compiled-routing posture instead of republishing the activation manifest | Accepted |

<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:impl-decisions -->
## Key Decisions (Implementation)

- The repository copy was removed only after a recursive comparison against the vendored snapshot returned zero differences and an intact archive was located for rollback.
- The research wave ran as three parallel read-only workers, and each return was saved with a verification header and spot-checked citations before use.
- Verbatim snapshots were stored with a non-markdown extension so the fleet document gate stays honest without editing upstream bytes.
- The dispatch envelope named in the plan relocated the agent directory, which broke provider resolution. The override was dropped and the deviation is recorded below.

<!-- /ANCHOR:impl-decisions -->

---

<!-- ANCHOR:verification -->
## Verification Results

| Check | Result |
|-------|--------|
| Snapshot equivalence before removal | Passed, zero differing files |
| Snapshot bytes against the manifest digest | Passed, 8 of 8 |
| Research returns usable | Passed, three non-trivial cited reports |
| Root metadata gate | Passed, `checked=14 passed=14 failed=0` with the new root classified class S |
| Hub parent check | Passed, all hard invariants with 0 warnings at nine modes |
| Packet validation | Passed, both cli-orca packets print `RESULT: PASSED` under `--strict` with 0 errors |
| Advisor replay | Passed, the Orca phrase ranks `cli-orca` first and the OpenOrca holdout returns no recommendation |
| Feature catalog package | Passed, 0 violations |
| Playbook package | Passed, 8 scenarios across 4 categories, 0 violations and 1 advisory census warning |
| Document corpus | Passed, 32 documents with 0 blocking issues |
| Retired-leaf sweep | Passed, 0 live references to the retired leaf path outside changelog history |
| Frozen directory manifest | Passed after a sanctioned refresh, 816 directories reproduced |

### NFR Achievement

No performance, security or reliability NFR was placed at risk. The work touches documentation and metadata only.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Achievement

| Milestone | State |
|-----------|-------|
| M1 Baseline captured and snapshot removed with proof | Achieved |
| M2 Skill root authored | Achieved |
| M3 Corpus complete | Achieved |
| M4 Hub clean at nine modes | Achieved |
| M5 Packets moved and metadata live | Achieved |
| M6 Fleet catalogs, re-ingestion and gates closed | Achieved |
| M7 Post-closure review cycle closed and the leaked key remediated | Pending |

<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The live Orca runtime was not probed, because runtime mutation is operator-gated.
- The snapshot carries no source commit, so provenance is pinned by revision and digest.
- The advisor recall hole is unresolved. A long prompt that mixes an Orca phrase with generic worktree and terminal vocabulary scores below the surfacing threshold, because the lexical lane normalizes token overlap against the unexpanded prompt length. Short Orca-qualified phrases route, long mixed ones can return nothing.
- The hub compiled route reports a stale activation manifest. Republishing it needs the authored compiled-routing tree, which the sync tool cannot locate because that tree now lives under `specs/sk-doc/z_archive/`, so the hub serves through its prose router and the posture is recorded as legacy authority.

<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:risks-realized -->
## Risks Realized

| Risk | Outcome |
|------|---------|
| The repository copy might be unrecoverable | Did not materialize, an intact archive and the vendored copy both exist |
| The plan's dispatch envelope might not resolve models | Materialized, resolved by dropping the agent-directory override |
| Verbatim snapshots might fail the fleet document gate | Materialized, resolved by keeping the bytes and leaving the doc scope |
| The extraction might break an unrelated frozen fixture | Materialized, the sk-doc directory manifest was refreshed with its own writer and the test passes |
| The hub might lose compiled serving when its mode set changed | Materialized, recorded as `stale-manifest` and reported rather than hidden |

<!-- /ANCHOR:risks-realized -->

---

## What Went Well

Baseline capture happened before any destructive action, so the equivalence proof exists. Dispatch of the research wave produced cited reports without falling back to the second route.

## What Could Improve

The dispatch envelope carried an environment override that had not been tested against provider resolution, which cost one diagnostic cycle.

## Recommendations for Future

Test a dispatch envelope with a model listing before launching a wave, and treat verbatim upstream assets as an extension question rather than a frontmatter question.

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Relocate the agent directory for child runs | Ran against the real agent directory | A temporary agent directory resolves no models, so every dispatch would have failed before reaching a provider |
| Dispatch writing passes for the packet documents | Authored by the orchestrator | The packet records decisions and observed results that the orchestrator already holds |
| Store verbatim snapshots as markdown | Stored flat as `assets/<name>.txt` | Two fleet gates require a version field on markdown documents, which the snapshots may not gain |
| Move the hub evidence after the packet move | Moved in the same wave as the hub edits | The archived hub scenarios and the moved evidence need the packet to exist at its new path first |
| Remove every Orca mention from the hub root files | Three deliberate deferral mentions were kept | They point at the standalone skill and document the new cross-skill boundary, so removing them would delete the boundary contract |
| Leave the skill router pseudocode as prose | Raised to the canonical smart-router block | The create-skill contract expects the named resilience markers, and the stricter package check is part of the closing suite |
| Group the skill documents as `official-skills` | Snapshots flattened into `assets/` and the group renamed `orca-skills` in both the reference and catalog trees | The operator asked for no folder name that claims officialdom, and a flat asset directory scans faster than eight single-file subdirectories |
| Release the skill at 1.0.0.0 | Released at 0.1.0.0 | The operator set the first version, which also matches how the sibling first-release skills open |

<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [x] Split a phased parent if the remaining work needs independent child packets (not needed, the flat Level 3 packet closed)
- [ ] Re-point the compiled-routing sync tool at the archived authored tree and republish the hub activation manifest
- [ ] Address the advisor lexical normalization so a long mixed Orca prompt can surface the skill
- [ ] Refresh the snapshot when a newer upstream release is vendored

<!-- /ANCHOR:follow-up -->

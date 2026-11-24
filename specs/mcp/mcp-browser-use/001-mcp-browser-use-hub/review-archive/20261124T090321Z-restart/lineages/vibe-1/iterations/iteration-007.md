---
title: "Deep Review Iteration 007 - cross-reference convergence pass"
description: "Closes the four overlay protocols, rechecks the four carried P1 findings against current file content, and records the last new finding of the run."
importance_tier: normal
contextType: review
iteration: 7
dimension: cross-reference
sessionId: fanout-vibe-1-1795504079797-ay97sx
generation: 1
lineageMode: new
---

# Deep Review Iteration 007 - Cross-Reference Convergence Pass

## Dispatcher

- **Agent**: `@deep-review` (LEAF, single iteration, no nested dispatch)
- **Lineage**: `vibe-1`, sessionId `fanout-vibe-1-1795504079797-ay97sx`, generation 1, lineageMode `new`
- **Artifact directory**: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe-1`
- **Review target**: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- **Dimension**: cross-reference convergence pass (all four dimensions)
- **Operator review focus**: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made. This iteration addressed the focus by rechecking each carried P1 against current file content rather than assuming it still stands, and by closing the four overlay protocols so the STOP gate reads a verified state.
- **steer.md**: absent at the time of this iteration (re-checked before reading sources); no lead ruling applied.

## Files Reviewed

| File | What was checked |
|---|---|
| `.skilled/skills/mcp-browser-use/SKILL.md` | Whether the hub names any agent contract (`skill_agent`, `agent_cross_runtime`) |
| `.skilled/agents/`, `.claude/agents/`, `.opencode/agents/` | Whether any agent definition names the hub or its three modes |
| `.skilled/skills/mcp-browser-use/` | Top-level inventory; absence of `feature-catalog/` |
| `.skilled/skills/mcp-tooling/feature-catalog/feature-catalog.md` | The sibling hub's catalog contract, as the parity reference |
| `.skilled/skills/*/feature-catalog` | Which skills ship a catalog (10 of them; the hub is not among them) |
| `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md` | Index coverage of the seven case files |
| `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-browser-inspect.md` | `MT-H01`'s pass rule, as the `playbook_capability` evidence |
| `.skilled/skills/mcp-browser-use/shared/README.md` | Whether the reserved shared tier claims helpers that do not exist |
| `.skilled/skills/mcp-browser-use/hub-router.json:94-98,140-145,160-164` | R1-P1-001 recheck |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:86-102` | R1-P1-001 recheck |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:4,141` | R2-P1-001 recheck |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:32-41` | R2-P1-001 recheck |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:9,32,78` | R3-P1-001 recheck |
| `.skilled/skills/mcp-browser-use/description.json:6` | R4-P1-001 recheck |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The one P1 candidate this iteration -- that playbook case `MT-H01` records PASS on stage two alone while the durable directive D7 requires both stages -- was withdrawn as a duplicate: R4-P1-001 already states it at `iterations/iteration-004.md` ("the packet holds two verdicts for one scenario: PASS in the playbook, FAIL in the replay") and already cites `holdout-browser-inspect.md:46`. Re-raising it would inflate the count without adding evidence.

### P2 Findings

1. **The hub ships no feature catalog while its predecessor hub and nine other skills do** -- `.skilled/skills/mcp-browser-use/` -- The hub's top-level inventory holds `benchmark`, `changelog`, `manual-testing-playbook`, `shared`, the three mode packets and the six metadata files, and no `feature-catalog/`. `ls -d .skilled/skills/*/feature-catalog` returns ten skills -- `cli-classifier`, `cli-external-orchestration`, `cli-orca`, `mcp-tooling`, `sk-code`, `sk-doc`, `sk-git`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit` -- and `mcp-browser-use` is not among them. Its predecessor `mcp-tooling` keeps one at `.skilled/skills/mcp-tooling/feature-catalog/feature-catalog.md`, with the full frontmatter contract (`title`, `description`, `trigger_phrases`, `last_updated`, `version`) and a description that names its six modes. The hub therefore has no current-state capability inventory, so the `feature_catalog_code` protocol has nothing to compare against and a reader looking for the hub's capability list has to reconstruct it from `mode-registry.json` and the three `SKILL.md` files.
   Finding class: capability-inventory gap
   Scope proof: `ls -d .skilled/skills/mcp-browser-use/feature-catalog` returns "No such file or directory"; the ten-skill enumeration is a direct glob over `.skilled/skills/*/feature-catalog`; the sibling catalog was read at its head to confirm it is a real inventory rather than an empty folder.
   Affected surface hints: a new `.skilled/skills/mcp-browser-use/feature-catalog/feature-catalog.md`; no code, registry or routing surface. The parent-skill checker already exits 0 without it, so this is a parity gap rather than a gate failure.
   Case: an operator asks what the hub can do and gets `mode-registry.json`'s three mode ids plus three separate `SKILL.md` files, while the same question about `mcp-tooling` is answered by one catalog file.

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| `spec_code` (core) | pass | Criterion 2 holds; phase 005's compiled-serving claim holds; version authority holds across four files (iteration 6) |
| `checklist_evidence` (core) | partial | Criterion 5 holds per mode but not for a combined three-mode request (R1-P1-001, R2-P1-001) |
| `skill_agent` (overlay) | notApplicable | The hub's `SKILL.md` names no agent contract -- `grep -n 'agents/\|@[a-z-]*agent\|subagent\|dispatch'` over it returns nothing -- so there is no SKILL.md-to-agent pair to compare. |
| `agent_cross_runtime` (overlay) | notApplicable | No agent definition in `.skilled/agents/`, `.claude/agents/` or `.opencode/agents/` names `mcp-browser-use`, `mcp-bladebro`, `mcp-aside-devtools` or `mcp-chrome-devtools`, so no cross-runtime agent pair exists for this target. |
| `feature_catalog_code` (overlay) | partial | The hub ships no `feature-catalog/` (finding 1). The sibling `mcp-tooling` catalog was read and carries no stale browser-mode claim -- its only browser mention at `feature-catalog.md:28` is `cli-orca`'s embedded browser state, which is a different skill's capability. |
| `playbook_capability` (overlay) | partial | Seven case files, seven index entries, so index coverage is complete. One scenario is not executable to the D7 bar: `MT-H01` passes on stage two alone (`holdout-browser-inspect.md:46`) while the replay marks the same prompt FAIL at stage one (`results.csv:50`). Already recorded as R4-P1-001; not re-raised. |

Carried P1 recheck against current file content:

| Finding | Cited evidence | Current state | Status |
|---|---|---|---|
| R1-P1-001 | `hub-router.json:96-97,142-143,162`; `router.cjs:88,100` | `hub-router.json` still carries the per-mode alias blocks (`chrome-devtools-aliases` at `:94-98`, `aside-aliases` at `:140-145`, `bladebro-aliases` at `:160-164`); `router.cjs:88-92` `selectNearTiedModes` still filters by `ambiguityDelta` | Active |
| R2-P1-001 | `canary-cases.v1.json:4,141`; `resolve.cjs:34,39` | `canary-cases.v1.json:4` still opens `"cases": [` and `:141` is still `"id": "named-tools-bundle"`, with no three-mode bundle case; `resolve.cjs:32-41` still lists `mcp-browser-use` in `DEFAULT_ON_HUBS` on the strength of that corpus | Active |
| R3-P1-001 | `mcp-aside-devtools/scripts/install.sh:9,32,78` | `:9` still sets `INSTALLER_URL="https://releases.aside.com/install.sh"`; `:32` still documents the env overrides; `:78` still runs `if curl -fsSL "$INSTALLER_URL" \| bash; then` | Active |
| R4-P1-001 | `description.json:6`; `results.csv:50`; `holdout-browser-inspect.md:46` | `description.json` still carries the 17-keyword list; `results.csv:50` is still `MBU-PB-04` with `stage1=false`; `holdout-browser-inspect.md:46` still states the router-only pass rule | Active |

## Integration Evidence

- `.skilled/skills/mcp-tooling/feature-catalog/feature-catalog.md` -- the sibling hub's capability inventory, reviewed as the parity reference for finding 1.
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md` -- the playbook index, reviewed for case coverage against the seven files in `hub-routing/`.
- `.skilled/skills/mcp-browser-use/shared/README.md` -- the reserved shared tier, reviewed as a documentation surface that could overclaim.
- `.skilled/agents/`, `.claude/agents/`, `.opencode/agents/` -- the three runtime agent trees, searched to decide the two agent protocols.

## Edge Cases

- **Ambiguity: whether a feature catalog is required or optional.** No checker enforces it -- the parent-skill checker exits 0 with 0 warnings without one -- so I could not treat its absence as a gate failure. I recorded it as a P2 parity gap and stated the reason, rather than either inflating it to a gate failure or dropping it as optional.
- **Ambiguity: whether `MT-H01`'s router-only pass rule is a defect or a deliberate stage-two test.** The case's command is `compiled-route.cjs` and its failure triage points only at stage-two vocabulary, so it is deliberately a stage-two test. That reading does not remove the defect, because the same prompt is FAIL in the replay; it only locates the defect in the disagreement rather than in the case's construction. Already recorded as R4-P1-001, so recorded here as an edge case rather than a finding.
- **Deferred observation from iteration 6, resolved as not-a-finding.** `MBU-N-12` routes after the change with `hub_confidence` 0, the only one of 16 negative rows that does not defer. The report's stated pass rule is that a negative passes when the advisor does not return the hub at 0.8 or above, so the row passes by construction and the front door's route is not a contradiction of any shipped claim. I did not raise it: it is one row, the rule is explicit, and a correctness read of `router.cjs`'s scoring would be needed to call it a defect rather than the rule working as written.
- **Partial success, stated honestly.** The two agent protocols closed as `notApplicable` on a negative search, not on a positive read of an agent contract. That is the correct status for a skill with no agent surface, but it means the run never verified agent parity for this target -- there was nothing to verify.
- **Convergence state.** This iteration added one weighted P2 against 29 accumulated weighted findings, a ratio of 0.0345, below the 0.10 threshold. Four P1 findings remain active and no P0 exists, so the run converges with a CONDITIONAL verdict rather than a PASS.

## Confirmed-Clean Surfaces

- **The playbook index covers every case file.** `manual-testing-playbook.md` carries seven `Feature File` links (`MT-001`, `MT-007`, `MT-012`, `MT-013`, `MT-004`, `MT-H01`, `MT-H04`) and `hub-routing/` holds exactly seven files, so no case is orphaned and no link dangles.
- **The reserved shared tier does not overclaim.** `shared/README.md` states "No shared helper exists yet" and explains why the folder carries no `graph-metadata.json` or `description.json`. The folder holds exactly one file, so the statement is true.
- **The sibling catalog carries no stale browser-mode claim.** `mcp-tooling/feature-catalog/feature-catalog.md` mentions browser once, at `:28`, in the context of `cli-orca`'s embedded browser state -- a different skill's capability, not a leftover from the relocation.
- **All four carried P1 findings are still active at their cited lines.** No finding has been silently fixed since it was raised, so synthesis can carry all four forward without a re-derivation pass.

## Ruled Out

- **"The hub's `SKILL.md` names an agent contract that has drifted from a runtime agent definition."** Ruled out. The hub's `SKILL.md` names no agent at all, so `skill_agent` has no pair to compare.
- **"An agent definition exists for the hub and diverges across runtimes."** Ruled out. No agent file in the three runtime trees names the hub or any of its three modes.
- **"The playbook index omits a case file."** Ruled out. Seven links, seven files.
- **"`shared/` claims helpers that do not exist."** Ruled out. The README states none exists yet, and the folder holds only that README.
- **"`mcp-tooling`'s feature catalog still claims the relocated browser modes."** Ruled out. Its only browser mention is `cli-orca`'s embedded browser state.
- **"`MT-H01`'s PASS/FAIL disagreement is a new finding."** Ruled out as a duplicate. R4-P1-001 already states it and already cites `holdout-browser-inspect.md:46`.

## Next Focus

- **Dimension**: none remaining -- all four dimensions and all six cross-reference protocols are closed.
- **Focus area**: synthesis. The run has converged at a 0.0345 new-findings ratio with four active P1 findings and no P0.
- **Reason**: `maxIterations: 7` is reached and the convergence threshold is met, so the main loop has no legal next iteration.
- **Rotation status**: correctness, security, traceability, maintainability and cross-reference all complete.
- **Blocked/productive carry-forward**: productive -- rechecking each carried P1 against current content in one batch confirmed all four are still active, which is what synthesis needs and what a prose assumption would have got wrong.
- **Required evidence for synthesis**: current file:line for each of the four active P1 findings (recorded above), the 13-finding registry rollup, and the release-readiness derivation.
- **Recovery note**: if synthesis finds a carried P1 no longer reproducible, it must resolve that finding rather than carry it, and the verdict must be recomputed from the registry rather than from this narrative.

Review verdict: CONDITIONAL

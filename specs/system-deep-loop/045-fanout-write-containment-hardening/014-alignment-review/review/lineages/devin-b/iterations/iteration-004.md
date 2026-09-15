# Iteration 4: Lane D - Deep-loop command alignment

## Dispatcher
- Lineage: devin-b (fan-out lane 2 of 3), executor cli-devin model=deepseek-v4-flash-max
- Session: fanout-devin-b-1789432854146-6hhsgk, generation 1, lineageMode new
- BINDING: target=specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review
- BINDING: maxIterations=5
- BINDING: convergence=0.1 (mode off, telemetry only)
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review

## Focus
Lane D of spec.md scope: the four command YAMLs and presentation assets under `.opencode/commands/deep/assets/` and the compiled contracts under `assets/compiled/` against the runtime scripts they invoke (fanout-run.cjs, fanout-merge.cjs, write-containment.ts) and the references they digest. REQ-006 migration check for the inline containment calls; DRV-064 fanout-merge bind contract check; D2 security angle (env allowlists, sandbox flags, path handling).

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 10
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.14 (weighted 2/14 accumulated)

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion

- **F009**: Stale inline containment comments in the codex branches of the two auto YAMLs describe the pre-REQ-001 revert-and-fail behavior. `.opencode/commands/deep/assets/deep-review-auto.yaml:1517-1519` and `.opencode/commands/deep/assets/deep-research-auto.yaml:1622-1624` comment "Revert any NEW out-of-artifact-dir change it made, append a containment_violation event to the state log, and fail the iteration fail-closed", but the shipped runtime defaults to preserve (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:235,1603`: `mode?: 'preserve' | 'restore'`, default `'preserve'`) and all four YAMLs' inline `enforceWriteContainment` calls omit `mode` and treat violations as an advisory `console.error` ("left on disk") before `process.exit(dispatchExit)` — nothing reverts and nothing fails the iteration. The REQ-006 migration is behaviorally complete (preserve default reached by omission), but the comments still describe the old remedy. Finding class: stale-inline-comment, scope proof: call sites read in all four YAMLs (deep-review-auto:1521-1531, deep-research-auto:1244-1254, confirm counterparts), affected surface hints: the two auto YAMLs' codex branches, write-containment.ts docs.
  - Dimension: maintainability. Evidence: `[SOURCE: .opencode/commands/deep/assets/deep-review-auto.yaml:1517-1519]`, `[SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:1622-1624]`, `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1603]`.
- **F010**: Compiled-contracts README contradicts itself on the contract count. `.opencode/commands/deep/assets/compiled/README.md:171` says "stores the four flattened command contracts" while the directory holds three `.contract.md` files (`deep-ai-council.contract.md`, `deep-research.contract.md`, `deep-review.contract.md`) and README.md:175 says "intentionally limited to the three commands registered with the contract compiler". "Four" is stale (likely counted agent-improvement/model-benchmark fallback entries in the manifest). Finding class: doc-contradiction, scope proof: directory listing + README:175, affected surface hints: compiled/README.md §1.
  - Dimension: maintainability. Evidence: `[SOURCE: .opencode/commands/deep/assets/compiled/README.md:171]`, `[SOURCE: .opencode/commands/deep/assets/compiled/README.md:175]`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | parent spec REQ-001/REQ-006 vs YAML inline calls | Migration behaviorally complete (preserve default, advisory-only); inline comments stale (F009) |
| feature_catalog_code | partial | advisory | DRV-064 contract vs YAML | fanout-merge bind_from_output p0/p1/p2 present (deep-review-auto.yaml:2051-2058); strongest-restriction note lives in YAML step description, not review.md |

## Integration Evidence
- `step_fanout_spawn_cli` (deep-review-auto.yaml:232-240) calls `fanout-run.cjs --spec-folder ... --loop-type review --fanout-config-json ... --base-artifact-dir ...` — matches the runner's CLI surface and the fan-out lineage layout (`{artifact_dir}/lineages/{label}/`) this lane itself runs under.
- The 9-gate legal-stop bundle emitted by `step_emit_blocked_stop` (deep-review-auto.yaml:761) matches the blocked_stop JSONL schema in state-jsonl.md (convergenceGate through graphlessFallbackGate).
- `step_post_iteration_claim_adjudication` emits `claim_adjudication` events with `passed:true/false` (deep-review-auto.yaml:1915,1924) — matches the loop-protocol Step 4a contract; gate `f` (claimAdjudicationGate) wired at line 630.
- Compiled contracts manifest is an append-only render log; latest entries for deep/research and deep/review carry compiledContractSha256 matching the on-disk .contract.md files' lineage (hash continuity observed, no mismatch flagged).
- Security angle: inline dispatch branches forward sandbox flags (`--sandbox workspace-write` for codex, devin `--sandbox`), env allowlists (`CODEX_/OPENAI_/AZURE_OPENAI_`, `CLAUDE_` prefix allowlisted at deep-review-auto.yaml:1264) — consistent with the executor-config flag-support authority read in iteration 2.

## Edge Cases
- F009's comment could be read as aspirational ("fail-closed" desired) — but the code path that follows is advisory-only, and the parent REQ-001 explicitly made preserve the default with no fail-closed requirement; the comment is stale, not a spec deviation.
- The manifest's `deep/alignment` entries (compiled/manifest.jsonl) have no matching .contract.md file — the manifest is a historical render log; entries predate the contract set's final scope. No current-state contradiction beyond the README count (F010).

## Confirmed-Clean Surfaces
- step_fanout_merge bind_from_output contract: p0/p1/p2 counts bound for step_derive_verdict (deep-review-auto.yaml:2051-2058) — DRV-064 requirement satisfied.
- All four YAMLs' inline enforceWriteContainment calls omit `mode`, safely reaching the preserve default; none passes restore.
- Claim-adjudication gate wiring, blocked-stop event shape, and max-iterations hard stop (line 639: stopReason "maxIterationsReached" without legal-stop veto) all match the review JSONL contract.
- Compiled contract files exist for exactly the three commands the README's line 175 describes.

## Ruled Out
- A missing containment-mode flag in the YAMLs as a P1: the runtime default is preserve and REQ-001 only requires restore to be opt-in via runner flag/config — the YAMLs never need to opt into restore, so no functional gap.
- The `deep/alignment` manifest entries as a live finding: historical log entries, no corresponding current command.

## Dead Ends
- review.md strongest-restriction prose: the merge's strongest-restriction semantics are documented in the YAML step description and the DRV-064 playbook; review.md carries no fan-out section — a doc-location choice, not a contradiction.

## Recommended Next Focus
- Dimension: Lane E + F (deep-loop agent alignment + general architecture) + D2 security. Files: `.opencode/agents/deep-research.md`, `deep-review.md`, `deep-improvement.md`, `orchestrate.md` vs their mirrors (`.claude/agents/`, `.codex/agents/`, `.pi/agents/`), the command contracts' route-proof fields, and the containment architecture (write-containment.ts mode logic, fanout-run.cjs outcome separation, quarantine layout).
- Reason: final iteration; close agent parity (REQ-001 route-proof fields), containment behavior (REQ-001..REQ-004), and any cross-cutting architecture contradictions.

Review verdict: PASS

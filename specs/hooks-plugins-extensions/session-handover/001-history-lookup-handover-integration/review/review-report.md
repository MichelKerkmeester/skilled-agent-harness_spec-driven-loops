# Deep Review Report: history lookup offered at handoff claim

## 1. Executive Summary

- Overall verdict: FAIL. The cause is the required `coverage` gate only. The fable-medium lineage ran one iteration, and its terminal gate reports `coverage-age-below-one`, because a dimension must be seen in more than one iteration before coverage counts as aged. No P0 or P1 finding is active.
- hasAdvisories: true
- Active findings after merge: P0=0, P1=0, P2=12
- Lineages: fable-medium (cli-claude-code, claude-fable-5-2, medium, 1 iteration, lineage verdict FAIL by the coverage gate) and opus-medium (cli-claude-code, claude-opus-5-5, medium, 2 iterations, lineage verdict PASS). Both lineages ran with `stopPolicy: max-iterations` and stopped at `maxIterationsReached`.
- Review scope: the packet and the commits named in the focus below.
- Operator review focus: Review the work in these commits: 198162c7f11 7973b80ab0b 50c5472789e de26d18cbdf 8cd3fa79da9 f320d9d9bcd 4cb3db7a787 cede6d301ab 70c47ad5e00 (inspect each with git show), plus the section A Claimed Note Offers the Sender History added to .skilled/changelog/skilled/v4.0.2.1.md in merge commit 967a825df3a. Also cover files the phase docs do not list: .skilled/hooks/shared/session-readers/claude.mjs, .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs and .skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts. Do not review other commits in the surrounding history.

## 2. Planning Trigger

`/speckit:plan` is not required by severity, since nothing above P2 is active. The FAIL comes from the coverage gate, which a second fable iteration or a convergence-policy rerun would clear. Remediation waits on an operator go-ahead.

```json
{"label":"Planning Packet","triggered":false,"verdict":"FAIL","failedRequiredGateIds":["coverage"],"hasAdvisories":true,"activeFindings":["R1-P2-001","R1-P2-002","R1-P2-003","R1-P2-004","R1-P2-005","OM-001","OM-002","OM-003","OM-004","OM-005","OM-006","OM-007"],"remediationWorkstreams":["WS-1 claim-path code: transcript store root under CLAUDE_CONFIG_DIR, guard before mint, prepare mint fate, entry error code","WS-2 receiver guidance: the 30-minute locator window","WS-3 packet doc truth: phase 005 mitigation, parent scope, 004 tasks and SC-003, parent packet row, 006 counts","WS-4 catalog and playbook naming"],"specSeed":["State in the parent spec scope that only Claude Code and Codex senders get the claim-time lookup","Decide whether a claimed note needs a way to renew its locator"],"planSeed":["Make the lookup command and the Claude reader honour CLAUDE_CONFIG_DIR, or make the mint ignore it","Run placeLookup and sameCheckout before mintHandoverLocator","Drop the prepare-time mint or have the claim reuse it","Print a distinct refusal code when the compiled core cannot load"],"findingClasses":["producer-verifier-drift","trust-boundary","dead-write","undocumented-limit","misleading-error","spec drift","ordering","checklist evidence drift","naming drift","metadata drift","evidence drift"],"affectedSurfacesSeed":[".skilled/hooks/session-handover/lib/relaunch-core.cjs",".skilled/hooks/session-handover/bin/session-handover.cjs",".skilled/hooks/session-handover/bin/history-lookup.mjs",".skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts",".skilled/hooks/shared/session-readers/claude.mjs",".skilled/commands/speckit/handoff.md",".skilled/changelog/skilled/v4.0.2.1.md",".skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md","packet spec.md and phases 004, 005, 006"],"fixCompletenessRequired":false}
```

## 3. Active Finding Registry

Each entry was checked against the source by the orchestrator after the merge. "Confirmed" means the cited lines were read and show the stated behaviour.

### Code

- **R1-P2-001 (P2, correctness, fable).** The mint and the lookup command look for a Claude transcript in different places when `CLAUDE_CONFIG_DIR` is set. `relaunch-core.cjs:687` reads `env.CLAUDE_CONFIG_DIR`, while `cli.ts:289` and `claude.mjs:38` always use `~/.claude/projects`. Impact: the claim prints a section whose command answers `session_not_found`. The refusal fails closed. Fix: make both sides resolve the same root. Confirmed.
- **R1-P2-002 (P2, security, fable).** A claim mints a locator for whatever session id the note names. `claudeSessionLogPath` searches every project folder, and only the note's `cwd` is compared with the receiver's. Impact: a crafted note can point the lookup at another project's transcript on the same machine, given a known session UUID. Fix: check that the transcript's project key matches the note's folder. Confirmed by reading `relaunch-core.cjs:685-694` and `:978-990`.
- **OM-002 (P2, correctness, opus).** `handoverLookupSection` mints, which writes the sender's hook state, before the `sameCheckout` guard at `relaunch-core.cjs:987`. Impact: a note from another checkout still rewrites that session's stored locator. Fix: place and compare before minting. Confirmed.
- **R1-P2-003 / OM-003 (P2, correctness, both lineages).** The locator `prepare` stores at `session-handover.cjs:606` is overwritten by the claim's own mint at `relaunch-core.cjs:984` before anything prints it. The lookup command does read the stored locator (`cli.ts:196-206`), but no printed command carries the prepare-time handle. Opus adds that phase 004 SC-003 ("no stored locator prints no section") is false. Fix: drop the prepare mint or reuse it at claim, and correct SC-003. Confirmed for the overwrite. The absence of any other consumer is inferred from a search of non-test sources.
- **R1-P2-005 (P2, maintainability, fable).** `history-lookup.mjs:30-33` prints `operation_invalid` for any import or run failure, the same code `cli.ts` uses for bad arguments. Impact: a broken build tells the model to retry with different arguments. Confirmed.

### Receiver guidance

- **R1-P2-004 (P2, traceability, fable).** The command refuses a locator older than 30 minutes (`cli.ts:37`, `:568`), and a claimed note cannot be claimed again. The README states the window. The changelog section (`v4.0.2.1.md:165`) and receiver step 3 in `handoff.md` do not. Confirmed for the TTL.

### Packet docs and catalog

- **OM-001 (P2, downgraded from P1, opus).** Only Claude Code and Codex senders get the claim-time section (`relaunch-core.cjs:913-917`). The catalog, playbook and changelog disclose this, so opus downgraded it in iteration 2. Phase 005 `plan.md:123` still claims "Phase 004's claim tests own the offer that reaches OpenCode", and the parent spec scope never limits runtimes. Confirmed for the runtime limit in code.
- **OM-004 (P2).** Phase 004 tasks T005 and T006 are checked done for a re-stamp helper and test that were never built (`004-offer-lookup-at-claim/tasks.md:47-48`).
- **OM-005 (P2).** The catalog entry and playbook page are still named and triggered as a compaction feature (`feature-catalog/context-preservation/compaction-history-lookup.md:2`).
- **OM-006 (P2).** The parent `spec.md:55` Parent Packet row still reads `scaffold/001-history-lookup-handover-integration` after the sub-track move.
- **OM-007 (P2).** Phase 006 `implementation-summary.md:99`, `:111` and `:113` disagree on how many hop runs counted. The run folders show seven lookup-after runs: one leaked, two answered missing and four answered correct.

## 4. Remediation Workstreams

No P0 or P1 workstream exists. P2 advisories, in suggested order:

1. WS-1 claim-path code: R1-P2-001, OM-002, R1-P2-002, R1-P2-003/OM-003, R1-P2-005.
2. WS-2 receiver guidance: R1-P2-004.
3. WS-3 packet doc truth: OM-001, OM-003 (SC-003), OM-004, OM-006, OM-007.
4. WS-4 naming: OM-005.

## 5. Spec Seed

- Limit the parent spec's scope to Claude Code and Codex senders, and correct phase 005's mitigation row.
- State whether `CLAUDE_CONFIG_DIR` is a supported setup for the lookup. Fable's R1-P2-001 rises to P1 if it is.
- Decide whether a claimed note needs a way to renew its locator after 30 minutes.

## 6. Plan Seed

- Unify the Claude transcript store root between `relaunch-core.cjs`, `cli.ts` and `claude.mjs`, with a claim test that redeems through the entry under `CLAUDE_CONFIG_DIR`.
- Move `placeLookup` and `sameCheckout` ahead of `mintHandoverLocator` in `handoverLookupSection`.
- Remove the prepare-time mint, or make the claim reuse a fresh stored locator.
- Give the entry a distinct refusal code for a core that cannot load.
- Add the 30-minute window to the changelog section and receiver step 3.
- Fix the phase 004, 005 and 006 doc drift and the parent packet row. Rename the catalog and playbook entries.

## 7. Traceability Status

- `spec_code` (core): pass with notes. The phase map matches the code, except where phase 003's purpose and phase 004's code disagree (R1-P2-003/OM-003).
- `checklist_evidence` (core): partial. Phase 004 tasks T005 and T006 (OM-004) and the phase 006 counts (OM-007) drift from the evidence. Neither lineage reran the test suites.
- `agent_cross_runtime` (overlay): partial. Claude and Codex senders get the section, with Codex covered by unit tests only. Five runtimes lost the compaction offer, which the user docs disclose (OM-001).
- `feature_catalog_code` and `playbook_capability` (overlay): opus read them in iteration 2. The naming drift is OM-005.
- `skill_agent` (overlay): not applicable.
- `AC_COVERAGE`: exempt. The phases record completion in implementation summaries, and neither lineage reported an acceptance-criteria shortfall.

## 8. Deferred Items

- Run R1-P2-001 live in a sandbox with `CLAUDE_CONFIG_DIR` set. Its severity depends on whether that setup is supported.
- The compaction removal in the Claude, Pi, DSH and Devin adapters was read as a stat plus a leftover search, not hunk by hunk.

## Dimension Expansion Map

No divergent pivots or Council artifacts. Fable covered all four dimensions in one pass. Opus covered correctness and security in iteration 1, then traceability and maintainability in iteration 2.

## 9. Search Ledger

*No search-depth state captured at the fan-out root.* Per-lineage strategy and dashboard files sit under `lineages/*/`.

## 10. Audit Appendix

### Core Protocols

- Convergence: fable recorded a convergence score of 0 after its single iteration. Opus recorded 0.12. Both runs used forced depth, so convergence was telemetry only.
- Route proof: all three iteration records carry `target_agent: "deep-review"`, `resolved_route`, `agent_definition_loaded: true` and `mode: "review"`.
- Terminal gates: evidence and scope passed. Coverage failed in the fable lineage (`coverage-age-below-one`).

### Overlay Protocols

- Sources reviewed: the nine commits, the changelog section and the three named files. Full file lists are in `lineages/fable-medium/iterations/iteration-001.md` and the opus iterations.
- Ruled-out claims are recorded in each iteration's Ruled Out section.
- Run configuration: both lineages used `sandboxMode: danger-full-access`, which launches them with `bypassPermissions`. The operator chose this after a probe showed `acceptEdits` refuses the Bash calls a lineage needs.

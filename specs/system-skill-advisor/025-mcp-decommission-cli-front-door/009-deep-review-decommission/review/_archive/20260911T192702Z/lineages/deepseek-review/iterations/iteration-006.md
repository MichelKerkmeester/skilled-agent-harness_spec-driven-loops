# Iteration 6: Adversarial Replay - falsification of the active P1 set and the STOP decision

## Focus

- **Dimension(s)**: none newly explored - this pass verifies (correctness, security, traceability and maintainability evidence are all re-read as evidence, not extended)
- **Scope investigated**: every active P1 finding's cited line, re-proved against the live tree with a fresh command, plus one falsification attempt per finding (dead surface? generated file? unreachable route? path actually valid in an installed layout?); then the evidence, scope and coverage gates over the final finding set, and the composite convergence computation for the STOP decision
- **Brief classes covered**: re-verification of classes 1-6 rather than new coverage; the brief's "never trust a summary" rule applied to this lineage's own iterations 1-5
- **Reproduction constraint**: unchanged - read-only probes only (no `validate.sh`, no advisor CLI execution, no `vitest` run)

## Scorecard

- Dimensions covered: (verification pass - no new dimension claimed)
- Files re-read: 12
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=1 P2=0
- New findings ratio: 0.047 (weightedRefinement 2.5 over cumulative 53.0)
- Falsification attempts: 9 (one per active P1) - falsified: 0

## Falsification Ledger

Each active P1 was attacked at its weakest point, not merely re-read. The attacks and their outcomes:

| Finding | Attack | Command output | Outcome |
|---------|--------|----------------|---------|
| F001 | Is `mcp-server/` perhaps restored in some other location, or is the YAML key dead because a later key wins? | `test -d .opencode/skills/system-skill-advisor/mcp-server` -> `mcp-server dir: ABSENT (rm -rf proof)`; `rg -n "mcp-server" .opencode/commands/doctor/assets/doctor-mcp-install.yaml` -> lines 114/115/116/120/124/135/139/140/144 | Survives. The install steps cannot run and the keyless block still re-points `entry_point` at `mcp-server/dist/index.js`. |
| F002 | Is `mcp-doctor.sh` reachable, or stale-but-unrouted? | `rg -n "mcp-doctor.sh\|doctor-mcp-install\|doctor-mcp-debug" .opencode/commands/doctor/_routes.yaml` -> `215: yaml: doctor-mcp-install.yaml`, `225: yaml: doctor-mcp-debug.yaml`, `233: - "mcp-doctor.sh"` | Survives. The route binds it; the script is the operator's entrypoint. |
| F002 (wiring half) | Does the `.vscode/mcp.json` leg at least exist so the check is satisfiable? | `test -f .vscode/mcp.json` -> `ABSENT`; `rg -n "Not wired" .../mcp-doctor.sh` -> `437: record_warn "config" "${cfg_path}:${srv}" "Not wired"` | Survives and worsens: one of the three configs the check demands the advisor be declared in does not exist at all. |
| F004 | Is the MCP wording behind a test guard or otherwise unreachable? | `rg -n "MCP child\|real mcp-server\|MCP server" .opencode/bin/system-skill-advisor-launcher.cjs` -> `39:`, `1227:`, `1235:` | Survives. Line 1235 is outside the vitest guard and is pushed into the operator-visible actions array. |
| F005 | Does `.pi/mcp.json` maybe register the advisor after all, making the SYNC row true? | `rg -n "skill" .pi/mcp.json` -> no match, exit 1; `test -f .pi/mcp.json` -> `EXISTS` | Survives. The file the row describes exists and contains no advisor declaration. |
| F008 | Is the dead build command copied from a generator, or is `mcp-server/` alive under a symlink? | `rg -n "MCP remains\|MCP transport remains\|system_skill_advisor\|mcp-server" daemon-cli-reference.md` -> lines 17/25/33/126; no generation marker in the file | Survives. Hand-authored live reference (root `README.md:1048` links it). |
| F009 | Are the two ARCHITECTURE rows historical (an ADR log) rather than a live table? | `sed -n '157p;160p' .opencode/skills/system-spec-kit/ARCHITECTURE.md` -> the `mcp-server/database/` ownership row and the `@modelcontextprotocol/sdk` seam row | Survives. They sit in the ownership table, not an ADR log. |
| F010 | Is the ENV-REFERENCE hit count limited to the hooks documented in iteration 3, i.e. an under-claim? | `rg -c "mcp-server" .../runtime/ENV-REFERENCE.md` -> `30`; `rg -n "SKILL_ADVISOR_DOC_TRIGGERS" .claude/mcp.json .codex/config.toml opencode.json` -> no match (exit 1) | **Refined, not falsified**: the finding understated its own scope. See F010 refinement below. |
| F012 | Is `.opencode/bin/README.md` generated from a script, so the defect is mechanical? | `head -5` shows a hand-authored frontmatter; `rg -n "GENERATED\|generator"` finds no generation marker; `test -f .../runtime/dist/mcp-server/skill-advisor-cli.js` -> `printed dist path mcp-server/dist/...: ABSENT` | Survives. |
| F015 | Had phase 008 started since iteration 5 read it? | `rg -n "Not started" 008-verification-and-closeout/implementation-summary.md` -> `51:Not started. The planning artifacts exist and bind the work.`; `sed -n '150p;174,175p' ../spec.md` -> `[Phase 9 scope]`, `[Criteria TBD] x2` | Survives unchanged. |

No P1 was falsified. Two findings were strengthened by the attacks (F002 with the absent `.vscode/mcp.json`, F010 with the widened scope).

## Findings

### P0, Blocker

None. No P0 has been active in any iteration, and the adversarial pass produced no candidate: every surviving defect is a wrong instruction or a wrong claim on a live surface, none of which leaves a shipped code path incorrect.

### P1, Required

No new P1. One existing P1 was refined:

- **F010 (refinement)**: iteration 3 filed the finding on lines 142/148/193-194 and line 303's source-column note. The replay shows the stale surface is the whole advisor-owned block, not its edges:

  ```
  $ rg -c "mcp-server" .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md
  30
  $ rg -n "Set in the committed MCP registrations|pinned .true. in the runtime configs" .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md
  318:... pinned `true` in the runtime configs (`.claude/mcp.json`, `.codex/config.toml`, `opencode.json`) ...
  366:... Set in the committed MCP registrations, and callers cannot forge it. ...
  $ rg -n "SKILL_ADVISOR_DOC_TRIGGERS" .claude/mcp.json .codex/config.toml opencode.json
  (exit 1 - no matches)
  ```

  Lines 318 and 366 are worse than a stale path: they instruct an operator how a variable reaches the daemon ("pinned `true` in the runtime configs", "Set in the committed MCP registrations"), and those registrations no longer exist - the launcher supplies the defaults instead (`.opencode/bin/system-skill-advisor-launcher.cjs:84-85`). Severity stays P1; the trigger stays the integration of this block with the already-fixed `runtime/` tree.

### P2, Suggestion

None new.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | parent `spec.md:99-108` vs the re-proved tree state; `008-verification-and-closeout/latency-delta.md:20-27` | Re-run in this pass with the same result as iteration 5: the transport removal, package rename and CLI front door all hold; the failures are residual documents. |
| checklist_evidence | pass | hard | target packet has no `checklist.md` (Level 1 scaffold); nearest authoritative list is `008-verification-and-closeout/goal.md:64-68` | Re-checked 0 of 5 closure criteria satisfied; recorded as F015, unchanged. |
| feature_catalog_code | pass | advisory | `.opencode/skills/system-skill-advisor/feature-catalog/` | No new evidence; retained MCP-named leaves remain a written preserve decision. |
| playbook_capability | pass | advisory | `.opencode/skills/system-skill-advisor/manual-testing-playbook/` | No new evidence; procedures cite live CLI invocations. |

### Verification Pass Gates (final finding set)

| Gate | Rule | Result |
|------|------|--------|
| evidence | every active P0/P1 carries concrete `file:line` and no active P0/P1 relies only on inference | PASS - 14 registered + 3 iteration-5 findings = 17 active, 0 without `file:line`, all files exist on disk (`FILE-OK` for every row, `missing files: 0`) |
| scope | all findings within the review target | PASS - every finding names a surface the decommission touched or claims about it (doctor tree, launcher, plugin, bin map, `.pi`, spec-kit, install guide, packet docs); no finding requires modifying an out-of-scope packet's code to be *true* |
| coverage | all four configured dimensions examined at least once | PASS - correctness (1, 2, 4, 6), security (2, 6), traceability (3, 5, 6), maintainability (4, 6) |

## Claim Adjudication

This iteration produced no new P0/P1, so no new adjudication packet is owed. The gate is nonetheless evaluated over the full active set:

- Packets on file: F001, F002 (iteration 1), F004, F005 (iteration 2), F008, F009, F010 (iteration 3), F012 (iteration 4), F015 (iteration 5) - 9 of 9 active P1s.
- Last adjudication verdict: `rg -c "claim_adjudication" deep-review-state.jsonl` -> no match, i.e. no `passed: false` event has ever been persisted.
- Gate result: **pass** (no veto).

## Stop Decision Record

**Hard stop, step 1(a)** - `iteration_count (6) >= max_iterations (6)`: decision `STOP`, `stopReason: maxIterationsReached`, terminal. Per `step_check_convergence`, terminal ceiling reasons proceed to synthesis without legal-stop veto and preserve any failed gates as evidence; there were none to preserve.

**Composite convergence (telemetry under this stop policy)** - severity-weighted ratios across the run: 1.00, 0.52, 0.41, 0.15, 0.13, 0.047.

| Signal | Weight | Computation | Vote |
|--------|--------|-------------|------|
| Rolling average | 0.30 | mean(0.13, 0.047) = 0.0885 > 0.08 | CONTINUE |
| MAD noise floor | 0.25 | median 0.28, MAD 0.1915, noise floor 0.284; latest 0.047 <= 0.284 | STOP |
| Dimension coverage | 0.45 | 4/4 dimensions, both required protocols covered, coverage_age 2 >= 1 | STOP |

Weighted stop score = (0.25 + 0.45) / 1.00 = **0.70 >= 0.60**, so even the composite path would have promoted a STOP candidate in this iteration.

**Legal-stop gate bundle** (evaluated and recorded as terminal evidence):

| Gate | Result |
|------|--------|
| convergenceGate | pass (score 0.70; hard-stop condition met) |
| dimensionCoverageGate | pass (covered: correctness, security, traceability, maintainability; missing: []) |
| p0ResolutionGate | pass (activeP0 = 0) |
| evidenceDensityGate | pass (17/17 findings carry `file:line`; none inference-only) |
| hotspotSaturationGate | pass (doctor tree and spec-kit docs each revisited in 3+ iterations) |
| claimAdjudicationGate | pass (`last_claim_adjudication_passed != false`; active P0/P1 = 9, all adjudicated) |
| fixCompletenessReplayGate | pass trivially (`security_sensitive_fix_scope` false - this is a review of a completed decommission, not a security fix rerun) |
| candidateCoverageGate | pass (searchDebt []; `candidateCoverage.covered` covers this pass's required classes: `unfalsified_p1_evidence`, `stale_transport_doc`, `completion_claim_unverified`) |
| graphlessFallbackGate | pass (`graphCoverageMode: graphless_fallback`; one cited ledger row per required class - SL-028, SL-029, SL-030) |

**Graph prerequisite**: the review-depth-v2 search path is active for this lineage (`reviewDepthSchemaVersion: 2`, `graphCoverageMode: graphless_fallback` - no code graph is available, so the pass ran on direct reads and exact searches). The graph convergence verdict was therefore never populated (`graphDecision: null`, `graphBlockers: []`) and the graph prerequisite is not applicable; the terminal hard stop does not depend on it.

**Terminal verdict**: `CONDITIONAL` - activeP0 = 0, activeP1 = 9, activeP2 = 8. Release-readiness: `in-progress` (findings are stable but P1 remediation is outstanding).

## Assessment

- New findings ratio: 0.047 (weightedRefinement 2.5 over cumulative 53.0)
- Dimensions addressed: verification across all four
- Novelty justification: none claimed, and none should be. This iteration's job was falsification, and its product is the negative result - nine independent attacks on the nine active P1s, none successful - plus one refinement (F010) that came out of attacking the finding rather than restating it. A replay that "found something new" by re-wording a prior finding would have inflated the ratio and mis-served the verdict.

## Ruled Out

- **Severity inflation via the absent `.vscode/mcp.json`**: the file's absence makes F002's permanent false warning certain rather than hypothetical, but it does not make the finding a P0 - the route still diagnoses the remaining MCP server (`code_mode`) correctly, and the advisor branch's checks resolve against the live `runtime/` tree. There is no path from this defect to a broken runtime.
- **A hidden second copy of the MCP server** (which would have falsified F001/F005/F008/F010 and F012 at once): `test -d .../mcp-server` is negative, the built CLI dist resolves under `runtime/dist/`, and the five runtime configs carry no advisor entry - so there is no resurrected surface that would make the stale documents true.

## Dead Ends

- **Re-proving the launcher's env rehoming for the third time**: iteration 2 established it from the final state (`.opencode/bin/system-skill-advisor-launcher.cjs:84-85`) and iteration 6's ENV-REFERENCE evidence confirms the *documents*, not the code, are wrong. Re-reading the launcher again would add no decision.

## Recommended Next Focus

None - the loop is at its iteration ceiling. The findings are handed to synthesis; remediation belongs to phase 008/010 or to the owning packets (details in `review-report.md`).

Review verdict: CONDITIONAL

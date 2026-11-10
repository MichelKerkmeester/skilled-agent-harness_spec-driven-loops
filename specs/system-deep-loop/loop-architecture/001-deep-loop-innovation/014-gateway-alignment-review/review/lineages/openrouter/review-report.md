---
title: "Review Report — Gateway Alignment Deep-Review (openrouter lineage)"
trigger_phrases: []
---
# Review Report — Gateway Alignment Deep-Review (openrouter lineage)

**Session**: `fanout-openrouter-1787662335600-tvzr08` · **Mode**: review (fan-out lineage, cli-pi / stealth/ox-alpha) · **Iterations**: 10 of 10 (stop-policy max-iterations) · **Target**: gateway-alignment surface — leaf agents ×6 runtimes, 16 orchestrator YAMLs, 8 command docs, AGENTS.md, guard script

## 1. Executive Summary

**Verdict: CONDITIONAL.** Active findings: **P0 ×0, P1 ×3, P2 ×4** (`hasAdvisories: true`).

The 013 migration itself held: every leaf agent prompt in all six runtimes routes state records through the append gateway with correct mode flags and one-record event semantics; orchestrator YAML routing declarations reconcile exactly against their own directive counts; codex TOML mirrors are faithful conversions; all 26 cursor/devin symlinks resolve; the hypothesized rename straggler does not exist.

What the prior fix-and-audit passes missed lives in the *guard rails around* the aligned core: two execution lanes dispatch full-write CLI executors without the containment their siblings enforce, a mode SKILL.md still names the wrong write-authority owner, and the tripwire guard can silently lose coverage while reporting success.

## 2. Planning Trigger

Verdict is CONDITIONAL → route to `/speckit:plan` for remediation of the three P1 workstreams below. P2 advisories can ride along or defer to changelog.

## 3. Active Finding Registry

| ID | Sev | Finding | Evidence |
|----|-----|---------|----------|
| P1-001 | P1 | Confirm-mode deep-research/deep-review YAMLs run `opencode run --dangerously-skip-permissions` leaves with no `enforceWriteContainment` post-dispatch gate; auto variants revert violations, confirm variants have only prompt-level contract + human gates | [deep-research-confirm.yaml:1060-1077], [deep-review-confirm.yaml:1132-1149] vs [deep-research-auto.yaml:1329-1346] |
| P1-002 | P1 | `deep-review/SKILL.md:60` ALWAYS rule "Let reduce-state.cjs be the SINGLE state writer" contradicts the gateway-owned projection model its leaf agent enforces; the file never mentions the gateway, unlike its deep-research sibling (line 272) | [SKILL.md:60], [.claude/agents/deep-review.md:218,349] |
| P1-003 | P1 | Guard prints `checked=N` but never asserts it against 24; unresolvable agents are silently skipped (`\|\| continue`) and exit stays 0 | [check-agent-gateway.sh:26-31,57-59] |
| P2-001 | P2 | ASCII workflow arrows adjacent to `-state.jsonl` names desensitize grep-based guards | [deep-research.md:75 ×4 runtimes] |
| P2-002 | P2 | "read-only sandbox not honored" prose duplicated across YAMLs will rot when capability lands | [deep-research-confirm.yaml:1077] |
| P2-003 | P2 | Guard regexes admit single-`>` truncate, `\| tee`, and no-space backtick `--event-json`; YAMLs/docs unscanned (synthetic-probe verified) | [check-agent-gateway.sh:35-50] |
| P2-004 | P2 | deep-research SKILL.md calls the gateway's one-record input a "JSONL delta" (lines 272/439) | [SKILL.md:272,439] |

All three P1s carry claim-adjudication packets in their iteration files and were adversarially re-confirmed at iteration 010.

## 4. Remediation Workstreams

1. **Containment parity (P1-001)** — port the auto YAMLs' `enforceWriteContainment` block into both confirm YAMLs' post-dispatch steps.
2. **Doc authority repair (P1-002, P2-004)** — rewrite deep-review SKILL.md rule 60 to split write authority (gateway = state log, reducer = derived artifacts); add the gateway invocation reference; fix "JSONL delta" wording in deep-research SKILL.md.
3. **Guard hardening (P1-003, P2-003, P2-001, P2-002)** — assert checked-count floor before exit; extend patterns to single-`>`/tee/backtick shapes; consider scanning YAMLs/docs; centralize sandbox-capability notes as generated data.

## 5. Spec Seed

Add to remediation packet requirements: (a) structural write-containment parity across auto/confirm for CLI-executor modes; (b) single-source write-authority statement in each mode SKILL.md naming the gateway; (c) guard coverage-floor assertion with explicit expected manifest.

## 6. Plan Seed

- T1: copy containment block from `deep-research-auto.yaml:1266-1346` into both confirm YAMLs; add `containment_violation` handling; verify by synthetic out-of-packet-write probe.
- T2: edit `deep-review/SKILL.md:60` + add gateway section mirroring `deep-research/SKILL.md:272`; reword lines 272/439 of the latter.
- T3: guard script — fail exit 2 when `checked != expected`; add evasion-class test fixtures; optional doc-scan mode.
- T4: replace duplicated capability notes with references to one capability probe source.

## 7. Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code (core) | **pass** | Iteration 003: YAML routing declarations match measured directive counts (15=15, 19=19, exempt 2=2) |
| checklist_evidence (core) | **skipped-exempt** | Target folder has no checklist.md (lifecycle predicate) |
| Overlays (skill_agent etc.) | n/a | Covered substantively via broadened angles (004, 006, 007, 008, 009), not protocol gates |

Unresolved gaps: none within scope.

## 8. Deferred Items

- P2 advisories P2-001/P2-002/P2-003/P2-004 (above).
- The alignment-auto migration exceptions (two direct appendFileSync sites) remain documented-but-unmigrated by design; not re-audited per packet scope boundary.
- Benchmark lanes' absent state logs: coherent today; revisit if they gain iteration state.
- Continuity save via generate-context.js intentionally not executed in this fan-out lineage (write surface restricted to lineage dir); parent orchestrator owns the save phase.

## 9. Audit Appendix

**Coverage**: dimensions correctness (5 iterations incl. broadened), security (1+replay), traceability (4), maintainability (1). Surface elements per REQ-004: leaf agents ×6 runtimes ✓ (001/006/007), orchestrator YAMLs ✓ (002/003), command docs ✓ (003), AGENTS.md ✓ (003), guard ✓ (005).

**Replay validation**: full-history recomputation over the 10 stored JSONL deltas — newFindingsRatio sequence 0.33, 0.67, 0.00, 0.33, 0.33, 0.00, 0.00, 0.14, 0.00, 0.00; rolling average of last two = 0.00 < 0.08 (convergence vote STOP available from ~iteration 7) but stop-policy max-iterations forbade early synthesis; dimension coverage hit 100% at iteration 4 and aged through stabilization (010 clean). Replayed decision = recorded decision: stop at ceiling, verdict CONDITIONAL. Replay **passes**.

**Convergence evidence**: P0 override never triggered (zero P0s). Stuck count peaked at 0 (no two consecutive sub-threshold iterations on the same focus until deliberate replay at 010, which confirmed rather than churned).

**Gates**: convergenceGate pass-at-ceiling · dimensionCoverageGate pass · p0ResolutionGate trivially pass (no P0) · evidenceDensityGate pass (every finding file:line-cited) · hotspotSaturationGate pass · claimAdjudicationGate pass (3/3 packets present, replayed) · fixCompletenessReplayGate n/a (observation-only) · candidateCoverageGate/graphlessFallbackGate trivially pass (v2 search path inactive).

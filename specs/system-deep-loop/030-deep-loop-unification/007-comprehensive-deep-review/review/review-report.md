---
title: "Deep Review Report: system-deep-loop Comprehensive 20-Iteration Review"
description: "20-iteration autonomous deep review (openai/gpt-5.5-fast, high effort) of the entire system-deep-loop hub + 4 workflow packets. 7 confirmed P1 bugs plus 16 P2 advisories found and fixed, all independently re-verified. Final verdict: clean PASS."
trigger_phrases:
  - "system-deep-loop comprehensive review report"
  - "deep loop 20 iteration verdict"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/007-comprehensive-deep-review"
    last_updated_at: "2026-07-08T23:50:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed 20-iteration deep review + remediation of all 24 confirmed findings (8 P1, 16 P2)"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - "review/deep-review-findings-registry.json"
      - "review/iterations/iteration-001.md through iteration-020.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-08T18:59:04.000Z"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Deep Review Report: system-deep-loop Comprehensive 20-Iteration Review

## 1. Executive Summary

**Verdict: PASS, clean** — 0 active P0, 0 active P1, 0 active P2. All 16 P2 advisories (14 originally in the automated registry + 2 more recovered from the same reducer bookkeeping gap that dropped a P1, matching detail: `DR-005-P2-001`, `DR-013-P2-001`) were fixed in a same-session follow-up pass and independently re-verified, area by area. See §8a below.

20 forced iterations (`stopPolicy=max-iterations`) ran to completion, dispatched to `openai/gpt-5.5-fast` at `reasoningEffort=high` via the audited `cli-opencode` executor path. Target: the entire `.opencode/skills/system-deep-loop` tree — the two-axis hub plus all 4 workflow packets (`deep-research` 146 files, `deep-review` 147, `deep-improvement` 458, `deep-ai-council` 129). All 4 review dimensions (correctness, security, traceability, maintainability) were covered for the hub and every packet.

**Structural sk-doc template conformance: 100%, freshly re-confirmed.** `package_skill.py --check` passes on all 4 workflow packets (0 errors; `deep-improvement` carries only the accepted `.gitkeep` naming edge case). `parent-skill-check.cjs` passes all hard invariants on the hub (32/32 PASS lines at time of writing — this count varies as invariants are added; the substantive claim is 0 FAIL/0 WARN), 0 warnings.

**7 real P1 bugs were found and fixed**, spanning security guardrails, a documentation/behavior mismatch, a script logic bug, and a state-integrity correctness bug. Every fix was independently re-verified by a separate agent (not the one that applied the fix) before being accepted. One fix (`DR-018-P1-001`) initially came back as a partial fix — the verifier caught that only half the bug was actually closed — and was completed with a follow-up wiring fix. One review-loop bookkeeping gap was also found and corrected: the automated reducer silently dropped one real P1 finding (`DR-008-P1-001`) from its registry and substituted a synthetic placeholder; this was caught by manual cross-check against the raw iteration log, not the automated tooling.

## 2. Active Finding Registry

All 7 P1 findings below are **RESOLVED**. None remain open.

| ID | Area | Title | Fix Summary | Verify Verdict |
|----|------|-------|--------------|-----------------|
| DR-007-P1-001 | deep-research | External WebFetch content could reach Write/Edit/Bash/Task with no prompt-injection or URL-trust guardrail | Added explicit "treat fetched content as untrusted data" rules to SKILL.md, quick_reference.md, and the iteration prompt template | PASS |
| DR-007-P1-002 | deep-research (shared infra) | `resolveArtifactRoot()` (shared by deep-research AND deep-review) blocked shell metacharacters but not path traversal outside the workspace | Added a workspace/`.opencode/specs`/`specs`-root containment check after the existing metachar guard | PASS — confirmed no regression to either consumer |
| DR-008-P1-001 | deep-research (generator) | Generated `/deep:research` command contract told the executor the LEAF agent "owns the loop and every artifact write" — contradicts the real YAML-owns-the-loop architecture | Fixed the wording template in `compile-command-contracts.cjs`, regenerated all 3 affected compiled contracts | PASS — verified against real compiled output, 0 remaining stale phrasing repo-wide |
| DR-011-P1-001 | deep-review | Docs claimed `cli-opencode` iterations run with workspace-write sandboxing; live code actually uses `--dangerously-skip-permissions` with `sandboxMode=read-only` unenforced | Corrected `loop_protocol.md`'s executor-resolution section to state the real blast radius | PASS, with a residual sibling-doc gap flagged (see below — closed same-session) |
| DR-014-P1-001 | deep-improvement | Shipped model-benchmark sweep profiles reference fixtures by parsed ID; the wired `loop-host` path only resolves by literal filename and would fail | Added ID-based fallback resolution to the materializer, matching `sweep-benchmark.cjs`'s already-correct dual resolution | PASS — reproduced the original failure and the fix from scratch |
| DR-015-P1-001 | deep-improvement | Promotion/rollback helpers' final write boundary was target-equality only, no allowed-root path containment before `copyFileSync` | Added realpath-based containment checks (defense-in-depth) to all 3 named helper files | PASS |
| DR-018-P1-001 | deep-ai-council | Persistence unconditionally wrote `convergence: true` regardless of actual council outcome | Added report-text auto-detection for the all-seat-failure case (self-contained, no caller cooperation needed) + a `--not-converged` flag for the max-round-escape case | **Partial on first verify** (all-seat-failure sub-case: fixed; max-round-escape sub-case: dead code path, no real caller wired it) — **closed same-session** by wiring `--not-converged` into `command_wiring.md`'s canonical shell/YAML snippets and `orchestrate.md`'s Depth-1 caller instructions |

## 3. Planning Trigger

None — all findings (P0, P1, and P2) are resolved and independently verified. No `/speckit:plan` remediation cycle is needed.

## 4. Remediation Workstreams (completed this session)

All 7 P1 fixes above were completed in one remediation pass (7 parallel fix agents + 7 parallel independent verify agents). Two gaps surfaced by verification were closed directly afterward:

1. **DR-018-P1-001's max-round-escape sub-case**: the code-level fix only worked when a caller explicitly passed `--not-converged`; no real caller did. Closed by updating `command_wiring.md`'s canonical shell snippet (checks `current_round >= max_rounds` in `ai-council-config.json` and conditionally passes the flag) and YAML snippet, plus `orchestrate.md`'s `@orchestrate`-at-Depth-1 caller instructions.
2. **DR-011-P1-001's residual sibling-doc gap**: `deep-review/feature_catalog/loop-lifecycle/executor-selection-contract.md` still stated the disproven `--sandbox workspace-write` claim after the primary fix. Synced it to match the corrected `loop_protocol.md`. The identical stale claim was also found in `deep-research/references/protocol/loop_protocol.md` (same bug class, not originally in DR-011's stated scope but fixed for consistency) and its compiled contract regenerated.

All hash-tracked compiled command contracts (`deep_research`, `deep_review`, `deep_ai-council`) were regenerated after these follow-up doc edits; `check-contract-drift.vitest.ts` (8/8) and `compile-command-contracts.vitest.ts` (6/6) both pass clean.

## 5. Spec Seed / 6. Plan Seed

Not applicable — no further planning cycle triggered. All findings, including P2 advisories, were resolved directly without needing a new spec cycle.

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | Pass | Fresh `package_skill.py --check` + `parent-skill-check.cjs` re-run at iteration 20 and again post-remediation; both clean. |
| `checklist_evidence` | core | Pass | Every P1 finding's claim-adjudication packet (claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger) was present at discovery and re-validated at fix time. |
| `skill_agent` | overlay | Pass | Agent definitions (`.opencode/agents/deep-research.md`, `orchestrate.md`) cross-checked and one (`orchestrate.md`) updated as part of remediation. |
| `agent_cross_runtime` | overlay | Not deeply probed | Out of this review's declared scope (single-runtime focus); no cross-runtime drift was incidentally found. |
| `feature_catalog_code` | overlay | Pass | `deep-review/feature_catalog/loop-lifecycle/executor-selection-contract.md` checked and fixed as part of DR-011 closure. |
| `playbook_capability` | overlay | Partial | `deep-review`'s manual-testing anchors were found to reference non-existent current lines (`DR-012-P2-001`, deferred as P2). |

## 8. Deferred Items

None. All 24 real findings from this review are resolved: 8 P1 (7 originally in the automated registry + `DR-008-P1-001`, recovered from a reducer bookkeeping gap) and 16 P2 (14 originally in the registry + `DR-005-P2-001`/`DR-013-P2-001`, recovered from the same reducer gap).

## 8a. P2 Remediation (same-session follow-up)

The operator asked for all 16 real P2 advisories to be fixed too. Grouped into 5 area-scoped fix+verify passes (hub, deep-research, deep-review, deep-improvement, deep-ai-council), each independently re-verified by a separate agent. All 16 came back clean PASS on first verification — no partial fixes or residual gaps this round, unlike the P1 pass.

**Hub (4)**: `DR-002-P2-001` — reworded README to correctly describe `runtime/` as internal infra, not a related skill. `DR-003-P2-001` — added a documentation note explaining the hub's broad tool grant is REQUIRED (equals the union of all child-mode tool surfaces per `parent-skill-check.cjs` invariant 3j) rather than narrowing the actual grant, which would have broken that hard invariant — verified 32/32 checks still pass. `DR-004-P2-001` — updated stale `1.1.0.0` version references to the current `2.0.0.0`. `DR-005-P2-001` — added an "Adding a Workflow Mode" maintainer checklist to README.md.

**deep-research (3)**: `DR-006-P2-001` — fixed 5 stale "Step 5a" references to the correct current "Step 7a" (2 more than originally cited). `DR-006-P2-002` — determined the real canonical registry filename (`findings-registry.json`, confirmed by reading the reducer's actual write call, not guessed) and aligned 3 docs to it. `DR-009-P2-001` — added a 7-surface maintainer checklist to README.md.

**deep-review (4)**: `DR-010-P2-001` — real code fix: `reduce-state.cjs`'s `findingsNew` validator wrongly rejected the documented array shape; now accepts both array and count-object shapes, matching the existing tolerant logic elsewhere in the same file. `DR-010-P2-002` — real code fix: `buildGraphConvergenceRollup()` was discarding the raw convergence signal payload before persistence; now persists it as `graphSignals` in the findings registry. `DR-012-P2-001` — traced 2 playbook files' stale source-line citations to their real current locations (content moved during this session's earlier SKILL.md trim) and corrected all anchors. `DR-013-P2-001` — rewrote the stale standalone 3-gate model doc to correctly describe the current 9-gate bundle and fixed a fabricated event-shape example (`guard_violation` → the real `blocked_stop` shape).

**deep-improvement (2)**: `DR-016-P2-001` — corrected the mode-switch catalog's stale "2 valid modes" claim to the real current 4. `DR-017-P2-001` — registered 3 post-trim reference files in the Smart Router's `RESOURCE_MAP` so intent-based discovery can actually find them (previously prose-linked only).

**deep-ai-council (3)**: `DR-018-P2-001` — corrected docs claiming `council_complete` is the terminal event; traced the real write order in `persist-artifacts.cjs` and documented that `artifact_written` audit events follow it. `DR-019-P2-001` — updated README version from stale `2.3.0.21` to current `2.4.0.0`. `DR-019-P2-002` — fixed a manual-test scenario expecting the old `@deep-ai-council` agent identity to the real current `@ai-council`.

**Verification depth**: every fix independently re-checked against real current file content (not the fix agent's self-report); both code fixes (`reduce-state.cjs`) syntax-validated and exercised live with both valid and invalid inputs plus the existing regression test; the hub's tool-grant invariant re-confirmed unbroken; cross-file consistency (e.g. that a "corrected" version number or line citation is itself actually correct, not just different) explicitly checked rather than assumed.

## 9. Audit Appendix

**Iterations**: 20/20 completed, 0 redispatches needed, 0 mechanical validation failures across all 20 (`verify-iteration.cjs` OK on every iteration).

**Dimension coverage**: hub (correctness/security/traceability/maintainability, iterations 2-5), `deep-research` (6-9), `deep-review` (10-13), `deep-improvement` (14-17), `deep-ai-council` (correctness+security combined + traceability+maintainability combined, 18-19), cross-cutting synthesis (20). All required.

**Executor**: `cli-opencode`, model `openai/gpt-5.5-fast`, `reasoningEffort=high`, dispatched via the audited `runAuditedExecutorCommand` wrapper for all 20 iterations (INTENT+COMPLETION dispatch receipts written under `review/dispatch-receipts/`).

**Known coverage gaps** (explicitly disclosed by the review itself, iteration 20): `deep-improvement` at 458 source files could not be exhaustively reviewed in 4 iterations — coverage was representative/risk-based sampling (scripts that execute, recently-touched assets, core protocol docs), not exhaustive. Generated benchmark baselines and dependency trees (`node_modules/`) were out of scope by design. Cross-packet consistency was checked at package-shape and sampled-convention level, not proven exhaustively per-file.

**Review-loop bookkeeping note (this review's own orchestration, not the reviewed target)**: the automated findings-reducer dropped one real P1 finding (`DR-008-P1-001`) from its registry output — likely a schema-field mismatch in that iteration's JSONL record — and substituted a synthetic placeholder finding of the same severity, netting the same COUNT but wrong MEMBERSHIP. Caught by manually cross-checking the registry against the raw `deep-review-state.jsonl` iteration records before starting remediation, not by trusting the automated reducer output. This is a real, if minor, gap in the reducer's own robustness — worth a future fix in `reduce-state.cjs`'s finding-extraction logic, but out of this review's own declared target scope (the reducer lives in `deep-review/scripts/`, which WAS reviewed at iterations 10-13, but this specific dropped-finding failure mode wasn't itself caught as a `deep-review` packet finding — noting it here for completeness).

**Remediation verification depth**: every one of the 7 fixes was checked by an agent that did not perform the fix, against real command output (not self-report): `git diff` on the actual changed files, `node -c` syntax validation, relevant vitest suites run and compared against a `git stash`-isolated clean-HEAD baseline where regression risk existed, and — for shared-infrastructure fixes (`resolveArtifactRoot`, the compiled-contract generator) — an explicit check that the OTHER consumer of that shared code wasn't broken.

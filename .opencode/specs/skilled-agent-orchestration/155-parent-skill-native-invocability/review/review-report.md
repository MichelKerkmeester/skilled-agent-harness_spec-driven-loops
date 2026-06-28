# Deep Review Report — 155 post-remediation

**Target:** `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability` (all remediation work) · **Executor:** gpt-5.5 xhigh fast · **Iterations:** 10
**Generated:** 2026-06-28T14:13:04.729Z

## 1. Verdict

**FAIL** — P0=1 · P1=11 · P2=0 · total 12

## 2. Dimension coverage

- correctness: covered
- security: covered
- traceability: covered
- maintainability: covered

## 3. P0 — Blockers
### P0 (1)

- **R155-F012 [P0/maintainability]** 
  - File: ``
  - Evidence: 
  - Impact: 
  - Fix:  _(iter 10)_

## 4. P1 — Required
### P1 (11)

- **R155-F001 [P1/correctness]** 002 decision-record continuity still says R5 work remains
  - File: `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md` (15-27)
  - Evidence: Frontmatter says `next_safe_action: "Run remaining R5 validation gates"`, `completion_pct: 85`, and open question `Which R5 gates remain after R3/R4 close?`, while the same packet's plan/spec/checklist/summary all say R5 is done and only optional live-loop e2e remains.
  - Impact: Resume/memory consumers can revive a completed R5 closeout as still active, contradicting the packet's closure state.
  - Fix: Align this frontmatter with the other 002 docs: completion_pct 95, no open R5 question, and next_safe_action limited to optional live-loop e2e/metadata refresh. _(iter 1)_
- **R155-F002 [P1/correctness]** Parent-skill create templates point at a non-existent OpenCode agent directory
  - File: `.opencode/commands/create/assets/create_parent_skill_auto.yaml` (44-45)
  - Evidence: `runtime_agent_path_resolution:` sets `default: .opencode/agent`; the confirm template has the same value at line 45. Disk check shows `.opencode/agent` is missing and `.opencode/agents` exists.
  - Impact: The parent-skill workflow's default runtime-agent path is wrong for this repo and can misroute OpenCode agent lookup/generation.
  - Fix: Change the default to `.opencode/agents` in both parent-skill create templates. _(iter 1)_
- **R155-F003 [P1/correctness]** Parent packet metadata still reports in-progress after docs claim phase closure
  - File: `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/graph-metadata.json` (38)
  - Evidence: graph-metadata.json:38 says "status": "in_progress", while spec.md:17 says "Phase map reconciled; 001 done and 002 R1-R5 complete with optional live-loop e2e not run" and spec.md:54 says "Complete: R1-R5 done; all required gates green; live-loop e2e optional/not run".
  - Impact: Resume/search/status consumers still see packet 155 as active even though the parent spec advertises closure, which undercuts the remediation's reconcile-to-reality goal.
  - Fix: Regenerate or patch the parent graph metadata so its derived status matches the documented phase-parent state, or soften the parent spec to say the parent remains in progress. _(iter 2)_
- **R155-F004 [P1/traceability]** ADR-004 claims 001 carry-forward was updated, but 001 still marks it pending
  - File: `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md` (340)
  - Evidence: 002 decision-record.md:340 says "Phase 001's carry-forward note is updated to point here as the resolution." But 001 tasks.md:99 still has unchecked "NFR-S01 carried to 002 is closed or explicitly accepted there", and 001 implementation-summary.md:102 still says "NFR-S01 unresolved here."
  - Impact: ADR-004's accepted union-grant status is not traceable back through the 001 cross-refs; resume/checklist readers can still see the carry-forward as unresolved even though 002 records it as accepted.
  - Fix: Either update the 001 cross-refs/tasks/summary to say NFR-S01 is resolved by 002 ADR-004, or soften the ADR-004 implementation bullet so it does not claim the 001 carry-forward notes were reconciled. _(iter 3)_
- **R155-F005 [P1/traceability]** Fix-completeness checklist claims SHA/diff pinning but the scoped packet docs contain no pin
  - File: `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md` (104)
  - Evidence: checklist.md:104 says '- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.' Scoped rg over the requested packet docs for 'fix SHA', 'explicit diff range', 'git diff', 'commit', and commit-like hashes found only this checkbox plus tasks.md:63's 'baseline SHA' placeholder and plan.md's 'prior remediation evidence' references, with no actual SHA/range recorded.
  - Impact: R5/fix-completeness is marked done, but a reviewer cannot trace the claimed evidence set to a stable commit or diff range from the canonical scoped docs. That makes the closure branch-dependent despite the checklist saying it is pinned.
  - Fix: Record the actual baseline SHA and fix SHA or explicit diff range in the 002 docs, or replace the checked item with a precise pointer to the canonical evidence artifact. Otherwise uncheck or soften CHK-FIX-007. _(iter 4)_
- **R155-F006 [P1/security]** ADR-004 accepts a hub union grant that is not actually the union of mode tool contracts
  - File: `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md` (line 311)
  - Evidence: ADR-004 says: "Its `allowed-tools` grant is the union of the tools its nested modes require, including `WebFetch` for deep research." The live hub only grants `.opencode/skills/deep-loop-workflows/SKILL.md:5` `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch]`, while mode packets require additional tools: `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:4` includes `memory_context, memory_search`, and `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:4` includes `memory_context, memory_search, code_graph_query`.
  - Impact: NFR-S01 is closed on a permission-contract premise that does not match the repo. If hub tools govern `Skill(deep-loop-workflows)`, research/review may lose mode-required memory/code-graph tools; if mode frontmatter extends grants after dispatch, ADR-004's statement that the hub grant is the union is false and the accepted residual risk is incomplete.
  - Fix: Reconcile the contract: either make the hub `allowed-tools` the real full union and document the broader residual risk, or amend ADR-004/spec/checklist to say the hub is a partial routing grant and cite evidence that selected mode packet grants are applied after dispatch. _(iter 5)_
- **R155-F007 [P1/traceability]** C2 closeout is unchecked in plan.md but marked complete in tasks.md
  - File: `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/plan.md` (plan.md:150-153; tasks.md:111-114)
  - Evidence: plan.md:150-153 says "C2 - Live-infra execution (gated on a C0 sign-off; skip entirely if C1 closes everything)" and leaves all three C2 rows unchecked, e.g. "- [ ] Not triggered - R3 remove branch". tasks.md:111-114 maps the same C2 branch to checked tasks: "- [x] T024 Not triggered", "- [x] T025 Not triggered", and "- [x] T026 Not triggered".
  - Impact: The closeout ledger cannot be mechanically reconciled: the plan says the C2 branch remains unchecked/not executed, while the task ledger counts the same skipped branch as completed work. That makes completion claims dependent on which document a reviewer or tool counts.
  - Fix: Use one state convention for skipped branches. Either mark C2 as explicit N/A/non-checkbox in both docs, or mark the plan rows checked as 'skipped by decision' and keep T024-T026 checked with the same rationale. _(iter 7)_
- **R155-F008 [P1/maintainability]** Zeroed session fingerprints remain in canonical packet docs
  - File: `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/spec.md` (24)
  - Evidence: spec.md:24 says `fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"`; scoped rg shows the same zero fingerprint in all parent/001/002 canonical docs, while graph-metadata.json has real nonzero `source_fingerprint` values, e.g. 002 graph-metadata.json:215.
  - Impact: The packet presents placeholder dedup metadata as if it were real session identity. Resume/dedup consumers that read YAML frontmatter can treat unrelated saves as the same zero-fingerprint session, undermining the claimed reconciliation-to-ground-truth state.
  - Fix: Populate `session_dedup.fingerprint` with real content/session hashes or remove the field from frontmatter so the nonzero graph metadata remains the only fingerprint source. _(iter 8)_
- **R155-F009 [P1/maintainability]** Checklist claims no broken ai-council filesystem refs remain while tests still point at the removed path
  - File: `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md` (77)
  - Evidence: checklist.md:77 says `No known broken `ai-council` filesystem references remain after the rename`; but `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-rollback.vitest.ts:14` still requires `.opencode/skills/deep-loop-workflows/ai-council/scripts/lib/rollback.cjs`, and rg finds old `deep-loop-workflows/ai-council` paths across 8 system-spec-kit/sk-doc test files. The old folder is absent and `deep-ai-council` exists.
  - Impact: The closure checklist overclaims path hygiene. Future maintainers can trust CHK-011 and miss stale test pointers that will fail or exercise the wrong fixture path after the rename.
  - Fix: Either fix the stale system-spec-kit/sk-doc test references to `deep-ai-council`, or narrow CHK-011 to the scoped deep-loop live surfaces and explicitly list the remaining out-of-packet stale refs as unresolved. _(iter 8)_
- **R155-F010 [P1/correctness]** 001 child metadata still reports in-progress after the phase is reconciled as decision-complete
  - File: `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/graph-metadata.json` (61)
  - Evidence: graph-metadata.json:61 says "status": "in_progress", while spec.md:64 says "| **Status** | Decision complete; NFR-S01 carried to 002 |" and implementation-summary.md:48 says "| **Completed** | Decision complete: ADR-001 Accepted (Option E); no source build in 001; NFR-S01 carried to 002 |".
  - Impact: Machine-readable status still presents phase 001 as active even though the reconciled child docs and parent phase map treat it as decision-complete. Resume/search consumers can reopen the wrong phase state.
  - Fix: Regenerate or patch the 001 graph metadata to the closed enum that represents this decision-complete child state, or soften the 001 and parent prose to say the child remains in progress. _(iter 9)_
- **R155-F011 [P1/correctness]** 002 plan leaves the runtime dependency amber after R4 is closed
  - File: `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/plan.md` (187)
  - Evidence: plan.md:187 says "| deep-loop-runtime current assumptions | Internal | Amber | R4 must verify them before any simplification; default keep merged identity until evidence or sign-off |", but the same file says at line 63 "R4 is done as keep" and at line 131 "Stage 4 - runtime reconciliation (R4): keep merged identity by maintainer sign-off; drift-guard green".
  - Impact: The 002 phase is advertised as complete, but its dependency table still marks a required R4 dependency as unresolved/future-tense. That makes the parent rollup less trustworthy for readers following dependency state.
  - Fix: Update the dependency row to Green/current-state wording, or remove the 002 complete claim until the runtime-assumptions dependency is actually closed. _(iter 9)_

## 5. P2 — Suggestions
### P2 (0)

_none_

## 6. Method

Single-executor gpt-5.5 (xhigh, fast) via codex, read-only, 10 iterations across correctness/security/traceability/maintainability, each verifying remediation claims against the real repo. Orchestrator owned dedup + synthesis.

## 7. Artifacts

`review/deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `iterations/`, `deltas/`, `prompts/`.
---
title: "Implementation Summary: Skill Documentation Drift Audit"
description: "Ran a 10-iteration deep-review + 10-iteration deep-research fan-out (GPT-5.5 high-fast) over 45 candidate skill docs to check for staleness caused by packet 031's changes, then independently re-verified all 20 iterations with fresh Claude Sonnet 5 agents. Confirmed real drift: stale ai-council direct-invoke guidance across cli-opencode docs/templates/playbooks, stale .opencode/agents/*.toml mirror references across 6 deep-loop skill docs (one code-coupled), a stale plugins/README.md entrypoint count, and a stale orchestrate-routing claim in cli-opencode/SKILL.md."
trigger_phrases:
  - "implementation"
  - "summary"
  - "skill doc drift audit"
importance_tier: "high"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit"
    last_updated_at: "2026-07-01T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Follow-up fix phase 015-skill-doc-drift-remediation completed"
    next_safe_action: "None -- packet complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-014-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do any of the 45 candidate skill docs describe pre-031 behavior? Yes -- 6 confirmed drift clusters, listed below."
---
# Implementation Summary: Skill Documentation Drift Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-skill-doc-drift-audit |
| **Completed** | 2026-07-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase ran two independent 10-iteration investigations (a deep-review fan-out and a deep-research fan-out, both `cli-opencode openai/gpt-5.5-fast` at `reasoningEffort: high`, `stopPolicy: max-iterations`) over 45 candidate `SKILL.md`/`references/`/`assets/`/README files, asking whether packet 031's real behavior changes (phases 008-013: ai-council `mode: subagent`, orchestrate routing, the mk-deep-loop-guard plugin rename, `.opencode/agents/*.toml` mirror removal) left any living doc stale. Both loops completed all 10 iterations; every one of the 20 written iteration files was then independently re-verified by a **fresh** Claude Sonnet 5 agent (no shared context with the loop or with each other) that re-read the actual cited files and confirmed or rejected each claim. All 20 verifiers confirmed their assigned iteration's substantive claims against real current file content — zero fabricated citations, zero false-positive findings.

### Confirmed Drift Findings

| Cluster | Severity | Finding | Confirmed By | Evidence |
|---|---|---|---|---|
| 1 | P1 | `cli-opencode` still teaches direct `--agent ai-council` dispatch (SKILL.md, README.md, prompt template, manual playbook + CO-017) despite phase 010 converting `ai-council` to `mode: subagent` (verified rejected at runtime) | Review (F001-F004) + Research (F-A), both independently, 2 fresh verifiers each | `cli-opencode/SKILL.md:31,285`; `cli-opencode/README.md:76,164`; `cli-opencode/assets/prompt_templates.md:372,386-392`; `manual_testing_playbook.md:362,417-423`; `04--agent-routing/multi-ai-council-multi-strategy.md:27-43,51`; `.opencode/agents/ai-council.md:4` (`mode: subagent`); `010-.../implementation-summary.md:48-60` (live rejection test) |
| 2 | P1 | Core deep-loop `SKILL.md` docs (deep-research, deep-review, deep-context, deep-loop-runtime) still require a `.opencode/agents/*.toml` mirror that no longer exists anywhere in the repo | Review (F005, F008, F009) + Research (F-D), both independently | `deep-research/SKILL.md:17-20` (+ `references/guides/capability_matrix.md:51-55`); `deep-review/SKILL.md:16-20` (+ `references/protocol/loop_protocol.md:721-724`); `deep-context/SKILL.md:279-287,302`; `deep-loop-runtime/SKILL.md:253-261`; confirmed via `find .opencode/agents -name "*.toml"` → zero results |
| 3 | P1/P2 | `deep-ai-council/SKILL.md` still calls `@ai-council` "primary agent identity" and lists a nonexistent `.opencode/agents/ai-council.toml`; `output_schema.md` cross-reference repeats the same stale mirror | Review (F006 P1, F007 P2) + Research (F-F), both independently | `deep-ai-council/SKILL.md:431-432`; `deep-ai-council/references/structure/output_schema.md:27-29`; `.opencode/agents/ai-council.md:4` |
| 4 | P1 | `deep-improvement` scanner docs (README, feature_catalog, 3 references files) still describe a 3-way mirror including `.opencode/agents/{name}.toml` — **and the assumption is code-coupled**: `scripts/agent-improvement/scan-integration.cjs:18` still hardcodes that path in `MIRROR_TEMPLATES`, so the scanner will report every agent's 3rd mirror as permanently "missing" | Research only (F-E) — review loop did not examine `deep-improvement` | `deep-improvement/README.md:161`; `feature_catalog/02--integration-scanning/runtime-mirrors.md:29`; `references/agent_improvement/integration_scanning.md:42-47,80-85`; `references/agent_improvement/mirror_drift_policy.md:41-43`; `references/shared/promotion_rules.md:94`; `scripts/agent-improvement/scan-integration.cjs:18` |
| 5 | P1 | `.opencode/plugins/README.md` frontmatter says "Three plugin entrypoint files" and its Current Entrypoints table lists 5 — actual directory has 6 `.js` files; `mk-deep-loop-guard.js` (added by phase 011, renamed 2026-07-01) is missing from both the count and the table | Research only (F-C) — review loop confirmed the *new* plugin's own catalog docs are correct but did not check `plugins/README.md` itself | `.opencode/plugins/README.md:3,42-50`; directory listing shows 6 `.js` entrypoints |
| 6 | P2 (architectural tension, not clean-cut) | `cli-opencode/SKILL.md:292` says command-owned loop executors including `deep-review` must "never route through orchestrate" — but `orchestrate.md:79` explicitly lists `@deep-review` (Priority 7) as one of orchestrate's own direct dispatch targets for `/deep:review`, added deliberately in phase 009 | Research only (F-B) — flagged medium-high confidence, not full, since this may be two intentionally distinct dispatch layers rather than a bug | `cli-opencode/SKILL.md:292`; `orchestrate.md:79`; `009-.../implementation-summary.md:48-57` |

### Confirmed Non-Findings

- `cli-opencode/references/agent_delegation.md:197,229` already correctly states direct `ai-council` invocation is forbidden.
- `deep-loop-runtime/feature_catalog/03--validation/mk-deep-loop-guard.md` and its matching playbook entry already document the current plugin name/env-var/log-prefix correctly.
- `AGENTS.md:453`, `README.md:850,920,1169-1170` reference `ai-council`/`/deep:ai-council` neutrally, with no stale `mode: all` or direct-invoke claim.
- `cli-claude-code/SKILL.md:279`'s `--agent ai-council` example is Claude Code syntax (no `mode` concept exists there) — correctly out of scope for the OpenCode `mode: subagent` conversion.
- A pre-existing (likely **not** 031-caused) identity mismatch was noted: `deep-ai-council/manual_testing_playbook/.../runtime-agent-renamed-to-deep-ai-council.md:25-31` expects `@deep-ai-council` as the current runtime name, but `mode-registry.json:66-72` still dispatches agent `ai-council`. Flagged for awareness, not counted as a packet-031 finding.

### Investigation Quality Notes (process, not doc findings)

- The review fan-out's own runner (`fanout-run.cjs`) marked the review lineage `rejected` because the GPT-5.5 agent emitted `"event":"synthesis"` instead of the exact required `"synthesis_complete"` string — a real protocol-naming slip on GPT-5.5's part (notably the same class of behavioral deviation packet 031 as a whole investigates), but the actual 10 iterations and `review-report.md` were complete and correct; content was used as-is.
- One verifier (review iteration-009) cited the wrong `tasks.md` line range for its own internal scoping note (pointed at completed Phase-1 tasks instead of the actual pending Phase-2/3 items) — the underlying claim was still true, just mis-cited. Not a finding against any audited skill doc.
- One verifier (research iteration-006) made a factual slip in its own throwaway reflection text, wrongly stating `.claude/agents/ai-council.md` was absent (it exists) — did not affect any of that iteration's 6 load-bearing findings.
- One citation (research iteration-007/010, Cluster 4/`deep-improvement/README.md:81`) was an approximate rather than exact match — the line lists `.opencode/agents/` twice rather than literally containing `.toml` — the cluster's substance still holds via the other 5 citations in the same cluster.

### Files Read (no files modified — this phase is findings-only)

This phase's own docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) plus 20 generated iteration files under `review/lineages/gpt-fast-high/iterations/` and `research/lineages/gpt-fast-high/iterations/`, `review/lineages/gpt-fast-high/review-report.md`, and `research/lineages/gpt-fast-high/research.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Scaffolded `014-skill-doc-drift-audit` as a new phase under packet 031 (operator's choice over a standalone packet), then discovered fan-out was the only realistic execution path: hand-walking the deep-review/deep-research YAML step-by-step for single-iteration mode across 20 separate invocations (the operator's initial preference) would have meant hand-simulating lock acquisition, session classification, and JSONL bookkeeping 20 times over — the operator agreed to switch to continuous 10-iteration fan-out runs (`fanout-run.cjs --loop-type review|research`, single `gpt-fast-high` lineage each) once the real scale became concrete, accepting post-hoc verification instead of mid-loop gating.

Read `fanout-run.cjs`'s actual argument parser and Zod schemas before invoking it rather than guessing field names — this caught that the executor config needs `kind`/`reasoningEffort` (not `executor`/`reasoning`, which an earlier draft invocation had used and which would have silently defaulted to a native/non-GPT executor). Also discovered fan-out review mode hardcodes `review_target_type: spec-folder` and derives scope from the phase folder's own `spec.md` rather than an arbitrary file glob — this is why `spec.md` explicitly enumerates the 45 candidate files rather than relying on a `files`-type target.

Ran both loops in parallel (nothing in the investigation required them to be sequential). Review completed in ~15 minutes; research took ~20 minutes. Dispatched all 20 fresh verifier agents as soon as each loop's iteration files were written, running the 10 review verifiers in parallel while research was still executing, to avoid idle wall-clock.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| New phase `014` under packet 031, not a standalone packet | This investigates 031's own downstream doc effects specifically — operator's explicit choice. |
| Continuous 10-iteration fan-out runs instead of hand-simulated single-iteration mode | Once the real cost of manually walking a 1300+ line loop YAML 20 times became concrete (lock/state bookkeeping, real GPT-5.5 latency per call), the operator chose the loop-owned fan-out path and accepted post-hoc (not mid-loop) verification as the trade-off. |
| Trusted the review lineage's real output despite `fanout-run.cjs` marking it `rejected` | The rejection was a pure event-name mismatch (`synthesis` vs `synthesis_complete`), not a content defect — all 10 iterations and `review-report.md` were complete, coherent, and independently verified true. Discarding real evidence over a cosmetic runner-validation naming gap would have been wasteful. |
| Did not implement any fixes in this phase | `spec.md` §3 explicitly scoped this as findings-only; fixes route through a separate follow-up phase per the operator's original instruction. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-review fan-out: 10/10 iterations, `review-report.md` synthesized | PASS (content complete; runner flagged a cosmetic event-name mismatch, not a content defect) |
| Deep-research fan-out: 10/10 iterations, `research.md` synthesized | PASS (`status: fulfilled`, exit 0) |
| All 20 iteration files independently re-verified by a fresh Sonnet 5 agent | PASS — 20/20 returned; every load-bearing claim CONFIRMED against real current file content; zero fabricated citations found |
| Findings consolidated with cross-loop confirmation | PASS — 6 clusters, 4 confirmed by both loops independently, 2 found by research only |
| `bash validate.sh --strict` on this phase folder | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Review loop's scope was narrower than research's.** Review (target_type `spec-folder`, scoped via this phase's own `spec.md`) did not independently examine `deep-improvement` or `.opencode/plugins/README.md` — those two clusters (4 and 5 above) surfaced only from the research loop. A future audit round could re-run review with those files added explicitly to `spec.md`'s candidate list.
2. **Cluster 6 (orchestrate-routing tension) is a judgment call, not a clean bug.** The fix (if any) requires an operator decision on whether `cli-opencode/SKILL.md:292`'s "never through orchestrate" language should be narrowed to raw CLI dispatch only, or whether orchestrate's own `@deep-review` Priority row should be reconsidered — this phase does not recommend one over the other.
3. **Not exhaustive.** 45 candidate files were reviewed based on a targeted grep for 031-relevant keywords; a doc that never mentions those keywords but still describes stale behavior in prose would not have been caught.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Recommended Follow-Up

Open a new fix phase (e.g. `015-skill-doc-drift-remediation` under packet 031) scoped to:

1. Patch `cli-opencode`'s SKILL.md/README.md/prompt template/playbook to remove direct `--agent ai-council` guidance in favor of `/deep:ai-council` or Task-dispatch routing (Cluster 1).
2. Remove or replace the `.opencode/agents/*.toml` mirror requirement across `deep-research/SKILL.md`, `deep-review/SKILL.md` (+ its `loop_protocol.md`), `deep-context/SKILL.md`, `deep-loop-runtime/SKILL.md`, and `deep-ai-council/SKILL.md` (+ `output_schema.md`) (Clusters 2, 3).
3. Decide the `deep-improvement` scanner's TOML-mirror contract first (keep the code checking a real 3rd mirror type, or retire the check) — then update its docs to match, not the other way around (Cluster 4).
4. Add `mk-deep-loop-guard.js` to `.opencode/plugins/README.md`'s entrypoint count and table (Cluster 5).
5. Resolve the orchestrate-routing tension in Cluster 6 with an explicit operator decision before editing either file.

This phase does not implement any of the above — per `spec.md` §3, fixes are explicitly out of scope here.

## Follow-Up: Fix Phase Completed (2026-07-01)

`../015-skill-doc-drift-remediation/` implemented all 5 recommended items. Cluster 6's actual resolution differed from this doc's original framing: a dedicated investigation found orchestrate's `@deep-review` row is load-bearing (removing it would reopen the exact gap phase 009 closed and break `deep-review.md`'s own documented Caller contract), so the fix narrowed `cli-opencode/SKILL.md`'s internal self-contradiction instead of touching `orchestrate.md`. See `015-skill-doc-drift-remediation/implementation-summary.md` for full before/after evidence per cluster, plus 13 additional real `.toml`-mirror references found and fixed during that phase's own post-fix re-scan (beyond this audit's original citation sample) and a pre-existing `REPO_ROOT` path bug found and fixed in two manual-testing sandbox scripts.
<!-- /ANCHOR:followup -->

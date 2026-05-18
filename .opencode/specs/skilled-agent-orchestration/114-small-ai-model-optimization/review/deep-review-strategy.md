---
title: Deep Review Strategy — 114 small-AI-model optimization cross-validation
description: SWE-1.6 dogfood cross-validation of codex gpt-5.5-produced work across all 6 phases of the 114 packet. 20-iter loop covering correctness, security, traceability, maintainability dimensions with P0/P1/P2 severity-weighted findings.
---

# Deep Review Strategy — 114 small-AI-model optimization

## 1. OVERVIEW

### Purpose

Live state file for the deep-review loop targeting `114-small-ai-model-optimization`. The orchestrator + reducer keep this in sync with `deep-review-state.jsonl` and `deep-review-findings-registry.json`. SWE-1.6 (cli-devin) cross-validates codex gpt-5.5-produced implementation work across all 6 phases.

### Usage

- **Init:** Strategy populated with review target, the 4 dimensions, scope file lists, convergence math.
- **Per iteration:** cli-devin SWE-1.6 reads Next Focus + Open Findings, writes findings to iteration markdown + JSONL delta; reducer refreshes registry + dashboard.
- **Mutability:** Mutable — analyst-owned sections (Topic, Dimensions, Scope, Stop Conditions, Known Context, Research Boundaries) stay stable; machine-owned sections (Open Findings, Resolved Findings, What Worked, What Failed, Exhausted Approaches, Next Focus) refresh after each iter.

---

## 2. TOPIC

Cross-validate the 114-small-ai-model-optimization arc implementation across all 6 phases. Use SWE-1.6 (via cli-devin) to provide independent review of codex gpt-5.5-produced work. Surface P0/P1/P2 findings on correctness, security, traceability, and maintainability dimensions. Produce a final PASS / CONDITIONAL / FAIL verdict in `review/review-report.md`.

---

## 3. REVIEW DIMENSIONS

The 4 dimensions, with per-dimension focus areas + expected iter budget (~5 iters each):

### Correctness (iters 1-5 typical)
- Spec→impl drift: do shipped files match each phase's spec.md §3 Files to Change?
- Hallucinated APIs: does TS code in `system-spec-kit/mcp_server/lib/deep-loop/` reference real exports + real type signatures?
- Broken cross-references in `sk-small-model/references/pattern-index.md` (every path must exist)
- Missing acceptance-criteria evidence in implementation-summaries
- Mismatched scope between spec.md SCOPE and what shipped

### Security (iters 6-10 typical)
- permissions-gate.ts default-deny semantics on every code path
- Schema rejects overly-broad globs (`**`, `/*`) without annotation
- Symlink resolution depth-capped + safe (no scope escape)
- Error messages don't leak filesystem structure
- agent-config recipe `verification_enabled: false` default (backward compat)
- fallback-router.ts never recommends same-pool target

### Traceability (iters 11-15 typical)
- Each spec requirement (REQ-NNN) traces to a shipped artifact or documented skip
- Each ADR decision traces to its implementation
- Cross-references in pattern-index resolve to actual files
- Implementation-summary "Built" section enumerates the spec.md §3 files
- decision-record.md ADR rationale matches what shipped

### Maintainability (iters 16-20 typical)
- TS code quality (strict-mode, no `any` without rationale, exported types)
- Doc completeness (each new ref doc cites research §RQ + iter)
- Sentinel discipline: sk-small-model SKILL.md ≤ 200 LOC, pattern-index ≤ 100 LOC
- Backward compat preserved (all opt-in fields default false/null)
- Test coverage: 9 unit tests in permissions-gate.test, 5+ in bayesian-scorer.test, 16 pairs in fallback-router.test

---

## 4. SCOPE

### In Scope (read these for findings)

**Spec packet (114 + 6 phases):**
- `spec.md`, `description.json`, `graph-metadata.json` at phase parent
- All 6 phase children's spec/plan/tasks/checklist/decision-record/implementation-summary docs
- `roadmap/follow-on-phases.md`
- `preflight/context-card.md`
- `001-research-smallcode/research/research.md` (research synthesis)

**Implementation artifacts (cross-cutting):**
- `.opencode/skills/sk-small-model/SKILL.md` + `README.md` + `references/pattern-index.md` + `description.json` + `graph-metadata.json`
- `.opencode/skills/cli-devin/SKILL.md` (§3 cross-references) + `references/{context-budget,output-verification,quota-fallback}.md` + `assets/{per-model-budgets.json,confidence-scoring-rubric.md,prompt_templates.md,agent-config-deep-research-iter.json,agent-config-deep-review-iter.json,agent-config-synthesis.json}` + `graph-metadata.json`
- `.opencode/skills/cli-opencode/SKILL.md` (ALWAYS #13 + §3) + `references/{permissions-matrix.md,context-budget.md}` + `assets/permissions-matrix.{schema.json,example-readonly.json,example-packet-local.json,example-repo-wide.json}` + `assets/prompt_templates.md` + `graph-metadata.json`
- `.opencode/skills/sk-prompt/assets/{model-profiles.json,cli_prompt_quality_card.md}` + `references/model-profiles.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/{permissions-gate.ts,bayesian-scorer.ts,fallback-router.ts,post-dispatch-validate.ts}`
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/*.vitest.ts` (test files)
- `AGENTS.md` (Small-model dispatch rule)
- `CLAUDE.md` (auto-synced with AGENTS.md)
- `README.md` (root, 21-skill count + sk-small-model entry)

### Out of Scope

- Files outside the 114 packet not modified by phases 002-006 (unless they bear on a finding)
- Frontier-model handling (Opus, Sonnet, gpt-5.5, GLM-5.1) — explicitly excluded per user direction
- Phase 007 hardening (deleted 2026-05-18)
- 2-stage tool routing port (dropped per research iter-011)

---

## 5. STOP CONDITIONS

- **Convergence**: `newFindingsRatio < 0.15` (severity-weighted rolling avg over last 3 iters) AND graph_decision != STOP_BLOCKED AND inline 3-signal vote > 0.60 AND all 4 dimensions covered
- **Iteration cap**: 20 iters
- **P0 override**: NEW P0 finding in latest iter blocks STOP regardless of threshold
- **Stuck recovery**: 3 consecutive failures → halt for manual intervention
- **All-clean**: 0 P0 findings + 0 P1 findings after dimension coverage complete → PASS verdict

Synthesis pass runs unconditionally after stop trigger. Must cover all 4 dimensions in `review-report.md`.

---

## 6. OPEN FINDINGS

[None yet — populated as iterations surface findings]

---

<!-- ANCHOR:open-findings -->
## 7. RESOLVED FINDINGS
[None yet]
<!-- /ANCHOR:open-findings -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
[None yet]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
[None yet]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES
[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

**Iter 7 — Traceability, dimension 3/4 (REQ + adjudication).** Iter 5 retracted: F1+F2 (decision-record missing for L2 phases). Iter 6 confirmed: F4 phase-parent status drift P2. Iter 6 false-positive: F3 ADR-artifacts-missing — agent searched 114/ but artifacts live in `.opencode/skills/`; correctness iter 2 already verified all 39 files exist. Iter 7: (a) adjudicate F3-iter6 as RETRACTED; (b) REQ-NNN spot-check per phase — for each of 5 phases, read spec.md §2 Functional Requirements, pick 2 REQ-NNN entries, verify each maps to a shipped artifact using ABSOLUTE paths.

## 6. OPEN FINDINGS (post-iter-4 adjudication)

### P1 (confirmed)

- **F2 — permissions-gate.ts deny-precedence runtime gap.** `findBestRule` at `permissions-gate.ts:326-352` uses specificity + array-order tiebreak. Two rules with identical specificity (e.g., `**` allow vs `**` deny) resolve by first-match-wins → a misconfigured matrix with allow placed before deny silently grants access. Suggested fix: explicit deny precedence in tiebreak.
- **F3 — permissions-gate.ts absolute-path scope-escape.** `resolvePathTarget` at `permissions-gate.ts:200-221` calls `path.resolve(expandHome(rawPath))` and accepts absolute paths verbatim. No constraint to `repoRoot`. A glob matching `/etc/passwd`-style paths would resolve outside repo scope. Suggested fix: reject or normalize absolute paths outside `repoRoot`.

### P2 (downgraded advisories)

- F1 `**` glob annotation (doc explains; no schema enforcement)
- F4 quota_pool undefined check (TS strict mode covers it)
- F5–F9 post-dispatch-validate path-in-error-details (internal-only logs, not user-facing)
- iter-3 P2 unknown-model behavior doc gap (advisory)

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

### Background

- Phases 001 (research) + 002-006 (implementation) shipped 2026-05-18. 001 was authored by main agent + SWE-1.6 in earlier session; 002-006 were authored by codex gpt-5.5 high fast. sk-doc template alignment (sk-small-model SKILL.md + pattern-index + README) was authored by main agent.
- Research synthesis (001) is comprehensive (1204 lines, HYBRID-with-Anchor verdict).
- Per-phase strict-validate exit 0; completion_pct mostly 100, 002 at 90% (3 documented skips).
- Codex flagged deviations: T005 (generate-context.js skill-path rejection), T008 (non-invasive helper instead of wrapper edit), T009 (--force-refresh instead of --rebuild), T015 (no memory search CLI).
- Slim model scope per 2026-05-18 user direction: SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6 required; Haiku + Gemini Flash optional stubs.
- Quota-pool-aware fallback NOT small→frontier escalation.
- Phase 007 hardening deleted 2026-05-18 — no CI lint shipped.

### Citations to consult

- `001-research-smallcode/research/research.md` — Research synthesis
- `preflight/context-card.md` — Smallcode-master patterns reference
- Per-phase `decision-record.md` — ADRs explaining design choices

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 20
- Convergence threshold: 0.15 (rolling-average over 3 iters, severity-weighted)
- Per-iteration budget: 12 tool calls, 25 minutes (cli-devin SWE-1.6 fast preset)
- Progressive synthesis: true
- review/review-report.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 6-11
- Canonical pause sentinel: `review/.deep-review-pause`
- Executor: cli-devin --model swe-1.6 --permission-mode auto (free tier; no Pro quota burn)
- Per-iter agent-config recipe: `.opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json`
- Current generation: 1
- Started: 2026-05-18T19:30:00Z

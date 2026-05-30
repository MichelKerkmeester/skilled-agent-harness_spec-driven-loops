# Multi-AI Council Report: Comment Hygiene Enforcement Gap

## Task Classification
- **Type**: Architecture / root-cause + fix design
- **Council Seats Dispatched**: 4 — Critical (seat-001), Holistic (seat-002), Pragmatic (seat-003), Devil's Advocate (seat-004)
- **Dispatch Mode**: Sequential inline deliberation (single Opus 4.8 context)
- **Vantage Integrity**: SIMULATED reasoning lenses only — no external CLI (cli-codex / cli-gemini / cli-claude-code) was invoked. Every finding is grounded in direct reads of the actual implementation files, not model intuition.

## Council Composition

| Seat | Strategy Lens | Vantage (simulated) | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| seat-001 | Critical / Security-Correctness | injection-path proof | Prove the exact content-delivery defect with code | 92 |
| seat-002 | Holistic / Systems-Architecture | single-seam map | Find the one place to fix across 5 runtimes | 84 |
| seat-003 | Pragmatic / Effort | coverage-per-effort | Rank fixes by determinism and cost | 80 |
| seat-004 | Devil's Advocate | advisory != enforcement | Challenge whether hooks can ever enforce | 78 |

## Strategy Comparison

| Dimension | Weight | seat-001 | seat-002 | seat-003 | seat-004 |
| --- | --- | --- | --- | --- | --- |
| Correctness | 30% | 29 | 26 | 25 | 24 |
| Completeness | 20% | 18 | 18 | 16 | 15 |
| Elegance | 15% | 13 | 14 | 12 | 11 |
| Robustness | 20% | 17 | 16 | 18 | 19 |
| Integration | 15% | 14 | 14 | 13 | 11 |
| Pre-Critique Total | 100% | 91 | 88 | 84 | 80 |
| Post-Critique Adjustment | +/-10 | +2 | +1 | +3 | +4 |
| Final Total | 100% | **93** | 89 | 87 | 84 |

## Deliberation Notes
- **Round 1 Independent Findings**: All four seats independently confirmed the briefing's hypothesis from code — the prompt-time hooks inject a skill-routing pointer, not the rule. Analysts proposed widening the injection; critics proposed verifying/hardening the gate first.
- **Round 2 Cross-Critique**: Critics landed a real hit — even WITH the full rule, model compliance was inconsistent (Gemini stripped, Codex refusal was incidental to Gate 3), so a shorter injected directive is a *nudge*, not a guarantee. Analysts' rebuttal held that a directive naming the gate still buys cheaper write-time feedback. Critics' "gate may never have fired in the WITHOUT test" was downgraded from fact to a must-verify P0.
- **Round 3 Reconciliation**: Not required. Disagreement was about fix *priority*, not about *what is broken*. Synthesis merges both: gate-verification is P0, injection-seam is P1 early-feedback.

## Winning Strategy
- **Leader**: seat-001 (Critical / Security-Correctness), 93/100
- **Key Strength**: It supplies the single unambiguous code path that proves the defect — `render.ts` is the only string emitter and its format is pointer-only — converting the briefing's hypothesis into a verified fact.
- **Complementary Elements merged**: seat-002's single-seam injection location; seat-003's coverage-per-effort ranking; seat-004's "advisory != enforcement" reframe and the unverified-gate P0.

## Recommended Plan

**Reframe**: the prompt-time hooks were built to answer "which skill?" — they are a
fail-open, 80-token advisory channel. Comment hygiene needs a fail-closed guarantee.
You cannot convert one into the other. So run TWO tracks:

- **Track A (the guarantee)**: make the git pre-commit gate provably installed and
  unbypassable. This already blocks; the only question is whether it actually fires in
  every runtime's commit path.
- **Track B (early feedback)**: widen the single shared advisor seam to also inject a
  short hygiene directive, so non-Claude runtimes get the same write-time signal
  AGENTS.md currently provides — knowing it is a nudge, not enforcement.

## Root Cause Per Runtime

| Runtime | Why it failed WITHOUT AGENTS.md |
| --- | --- |
| **OpenCode** | Plugin injects the advisor pointer via `experimental.chat.system.transform`; grep of `.opencode/plugins` for constitutional/hygiene = 0 matches. AGENTS.md was the rule source. No write-time hook (ADR-001). |
| **Gemini** | `BeforeAgent` fires and sets `additionalContext = brief` (gemini/user-prompt-submit.ts:200-205), but `brief` is the pointer. The probe "saw the rule" because it read AGENTS.md; the dispatch session's only hygiene signal was AGENTS.md. 429 is a red herring — even a clean run would have injected only the pointer. |
| **Codex** | `UserPromptSubmit` fires (`Completed` log) and injects the pointer. The WITH-rule refusal cited AGENTS.md; the hook contributed routing only. |
| **Devin** | Identical shim and pointer payload (devin/user-prompt-submit.ts); identical AGENTS.md-only dependency. |

## Injection Path Diagnosis

- **What it injects today**: `Advisor: <freshness>; use <skillLabel> <conf>/<unc> pass.`
  — produced solely by `renderAdvisorBrief()` in
  `system-skill-advisor/mcp_server/lib/render.ts:150-159`, capped at 80 tokens
  (max 120). The envelope (`skill-advisor-brief.ts:275-282`) carries one section:
  `advisor-brief`. No code path reads `constitutional/comment-hygiene.md` and appends
  it.
- **What it needs to inject**: a short, imperative, derived directive, e.g.
  `Code comments: no spec-path / packet / ADR-/REQ-/CHK-/task ids — keep the WHY, drop
  the label. (pre-commit blocks violations.)` Source of truth stays the constitutional
  file; a tiny extractor pulls the one-liner so they never drift.
- **Why "constitutional always surfaces" did not save it**: that property is about
  `memory_search` result ORDERING, not about prompt-time push. Nothing in the hook
  pipeline calls `memory_search` and pastes the top hit.

## Concrete Fix Per Runtime / Layer

| Fix | Files | Change |
| --- | --- | --- |
| **A1 — Verify gate fires** (P0) | `.opencode/hooks/pre-commit`, `.opencode/hooks/install-hooks.sh` | Confirm the symlink is installed in each runtime's working copy; add a one-line install assertion to repo setup/onboarding. |
| **A2 — Bypass-proof the gate** (P0/P1) | CI config (create if absent) | Re-run `check-comment-hygiene.sh` server-side on push/PR so `git commit --no-verify` cannot land a violation. |
| **B1 — Constitutional directive producer** (P1) | `system-skill-advisor/mcp_server/lib/` (new small module) + `skill-advisor-brief.ts buildSharedPayload` | Add a second `sections[]` entry sourced from a one-line extract of `constitutional/comment-hygiene.md`. Fail-open (same contract as advisor). Cache via existing `advisorPromptCache`. |
| **B2 — Surface the directive in every prompt hook** (P1) | `hooks/{gemini,codex,devin}/user-prompt-submit.ts`, OpenCode plugin transform | Append the directive to `additionalContext` / transformed system message alongside the advisor pointer. ~25-token cap. |
| **C — Keep Claude PostToolUse as the gold layer** (done) | `claude-posttooluse.sh` | No change; it already runs the real checker with file content in hand. |

## Implementation Steps (for a follow-on packet — NOT executed here)
1. **Verify the floor** (Source: seat-003 + seat-004): in each of OpenCode/Codex/Gemini/Devin, stage a file with `// ADR-007: x` and attempt a real commit; confirm the gate blocks it. If it does not, A1 is the top priority. (P0)
2. **Bypass-proof** (Source: seat-004): add a CI re-run of the checker so `--no-verify` cannot merge a violation. (P0/P1)
3. **Build the directive producer** (Source: seat-002): one small module that reads a single imperative line from the constitutional file and returns it as a shared-payload section; fail-open. (P1)
4. **Wire it into the shared seam** (Source: seat-001 + seat-002): append to `additionalContext` in the four prompt-hook entries and the OpenCode transform; cap ~25 tokens. (P1)
5. **Validate** (Source: seat-001): assert the injected string now contains the forbidden-pattern tokens in a unit test; re-run the WITHOUT-AGENTS.md probe and confirm non-Claude runtimes now see the directive. (P1)

## Prerequisites
- A follow-on spec folder (this council is scoped-write to `ai-council/**` and applied no code/config changes).
- Access to each runtime's commit path to execute Step 1 verification.
- CI infrastructure for Step 2 (if none exists, Step 1 + local gate is the interim floor).

## Priority Ranking (highest coverage per effort)

| Rank | Fix | Effort | Coverage | Determinism |
| --- | --- | --- | --- | --- |
| 1 | A1 verify gate install (all 5 runtimes) | XS | 100% at commit | Deterministic |
| 2 | A2 CI server-side re-check (bypass-proof) | S | 100% at merge | Deterministic |
| 3 | B1+B2 inject hygiene directive on shared seam | S | partial, early | Probabilistic |
| 4 | per-runtime hard system rule | M | partial | Probabilistic |
| — | write-time hooks on 4 runtimes | XL | n/a | BLOCKED (ADR-001..004: API does not exist) |

## Plan Confidence
- **Overall**: 88%
- **Strategy Agreement**: Strong on root cause and layer taxonomy (all 4 seats); split only on fix priority.
- **Consensus Quality**: Strong — convergence is genuine (every seat independently confirmed the pointer-only injection from code), not artificial.
- **Risk Level**: Low for the diagnosis; Medium for Track B (injection is probabilistic and can silently no-op under load — render.ts ships a timeout-fallback for exactly that case).

## Dropped Alternatives
- **Inject the full constitutional markdown**: rejected by all seats — token budget, coupling, banner blindness.
- **Build write-time hooks for OpenCode/Codex/Gemini/Devin**: rejected — runtime APIs do not expose post-file-write events (ADR-001..004 already settled this).
- **"Better prose / stronger constitutional entry"**: rejected (seat-003) — does not change the determinism class; the entry is already well-written but un-pushed.
- **Treat the hooks as the enforcement layer**: rejected (seat-004) — advisory fail-open transport cannot carry a fail-closed guarantee.

## Risks & Mitigations
- **Risk** (seat-004): the pre-commit gate may not actually fire in the non-Claude runtimes' commit paths — the WITHOUT test appears to have measured the WRITE, not a commit attempt. **Mitigation**: Step 1 P0 verification before trusting the floor.
- **Risk** (seat-004): injected directives silently no-op under rate-limit / advisor-timeout (`renderAdvisorTimeoutFallback`). **Mitigation**: never rely on Track B as the guarantee; the gate is the guarantee. Track B is early feedback only.
- **Risk** (seat-002): a new producer in the shared pipeline is a 5-runtime blast radius. **Mitigation**: fail-open contract (return `{}`/null on any error), matching the existing advisor design.

## Council Verdict

**The prompt-time hooks/plugin do NOT provide meaningful comment-hygiene protection
today, and by design can only ever NUDGE, not ENFORCE.** They inject a skill-routing
pointer (`render.ts`), never the rule. The "always-surface constitutional memory"
mechanism governs search ranking, not prompt-time push, so it never reached the model.

**AGENTS.md is currently the only working passive hygiene layer** — and it is weak:
even when present, model compliance was inconsistent (strip vs incidental refusal).

**The git pre-commit gate is the only true enforcement** — but its universal
installation across the four non-Claude runtimes is UNVERIFIED and must be confirmed
(P0) before the stack can be trusted. Recommended path: verify + bypass-proof the gate
(the guarantee), then add a short shared-seam directive (cheap early feedback),
explicitly NOT as an enforcement layer.

## Planning-Only Boundary
- No files were modified outside `ai-council/**`.
- This report is a recommendation for a follow-on implementation packet; the council applied no code or config changes.

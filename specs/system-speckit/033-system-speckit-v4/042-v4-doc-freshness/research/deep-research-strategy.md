---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Do specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md and the root README.md still tell the truth after the last ~100 commits - the .skilled source-root migration (041), the deep-loop fixes (049-050: ledger/protocol/admission), the retirements and moves, the orca packet, and the recent documentation-correction commits? Produce claim-by-claim verdicts with cited evidence.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Which path, command or binary references in the v4 changelog point at roots that no longer exist, and which of them remain true through a compatibility alias or symlink?
- [ ] Q2: Which capability, family, mode or workflow claims in the changelog no longer match the shipped tree after the retirements, renames and moves?
- [ ] Q3: Which statements in the root README about entry points, structure, commands or setup are now false after the source-root migration and the packet moves?
- [ ] Q4: Which post-draft work (the deep-loop ledger, protocol and admission fixes, the orca packet, the documentation-correction commits) is missing from the changelog narrative?
- [ ] Q5: Does either document require a full rewrite, or are targeted corrections sufficient?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not a rewrite of either document; a rewrite recommendation is recorded, not executed.
- Not an audit of documents outside the two targets.
- Not a fix for the two known-stale items excluded by the packet (the cli-devin skill roster line, the 041 continuity block, both named in 042/spec.md).

---

## 5. STOP CONDITIONS
- Hard ceiling: ten iterations. Convergence is recorded as telemetry and never stops the loop early.
- Halt and report if the executor is unavailable on three consecutive attempts.
- Halt if a pause sentinel appears at `research/.deep-research-pause`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q3 (README vs post-migration tree), Q4 (post-draft work missing from the changelog - now includes the `mcp-orca-cli` mode), Q5 (rewrite vs targeted corrections). (iteration 2)
- Q1 residuals carried: L15 "deliberately tolerant gate" behavior; `.hermes` skills/agents mirror contents. (iteration 2)
- Q2 residuals: compiled-router closure status for sk-design; Rust placement; `@markdown`/`deep-ai-council` renames. (iteration 2)
- Q3 residuals: clone-slug redirect status (needs a network check); `ai-council` vs `deep-ai-council` mode-key naming (registry mode ids not enumerated; the packet dir is `deep-ai-council`); "121 advisor test files / 872 tests" count (pattern-based count not completed); `AC_CLOSURE`/`AC_COVERAGE` not found in `runtime/cli/spec/validate.sh` (14.5 KB thin dispatcher - check `dist/` before any verdict); Node "18+" engines claim (no root manifest; `.skilled/package.json` engines unread); `.utcp_config.json` carries 14 manual call templates vs 7 integrations listed at L894-902 (names unsampled); Related Documents links (L420-431) not individually probed; doctor 12-vs-13 and templates 16-vs-18 intent checks. (iteration 3)
- Q1 residuals (carried): L15 gate tolerance; .hermes skills/agents mirror contents. (iteration 3)
- Q4 (post-draft work missing from the changelog narrative) and Q5 (rewrite vs targeted corrections) remain open; Q3's evidence suggests targeted corrections suffice for the README. (iteration 3)
- Q2 residuals (carried): compiled-router closure status for sk-design; Rust placement; @markdown/deep-ai-council renames. (iteration 3)
- Q5 (final verdict): rewrite vs targeted corrections — evidence to date favors targeted corrections for both documents. (iteration 4)
- New residual: whether the changelog mentions `.skilled` anywhere was not directly grepped (the date evidence already settles that 041 cannot be narrated); the scan's final four match lines (changelog L581-600) were not displayed — no `orca`/`admission` occurrence was seen, and orca absence is independently confirmed by iteration 2. (iteration 4)
- Q3 residuals (carried): clone-slug redirect status; `ai-council` vs `deep-ai-council` mode-key naming; "121 advisor test files / 872 tests" count; `AC_CLOSURE`/`AC_COVERAGE` in `dist/`; Node "18+" engines; `.utcp_config.json` template count; Related Documents links; doctor 12-vs-13 and templates 16-vs-18. (iteration 4)
- Q1 residuals (carried): L15 gate tolerance; `.hermes` skills/agents mirror contents. (iteration 4)
- Q2 residuals (carried): compiled-router closure status for sk-design; Rust placement; `@markdown`/`deep-ai-council` renames. (iteration 4)
- Q1 residual: L130 anchor-resolver behavior under the two root names. (iteration 5)
- Q4: additive-gap list stands; F5 adds the `.hermes/agents` repoint to the 041 class. (iteration 5)
- Q2 residuals: compiled-router closure for `sk-design`; Rust placement; `@markdown` / `deep-ai-council` renames. (iteration 5)
- Q3 residuals (carried): clone-slug redirect; `ai-council` vs `deep-ai-council` mode-key naming; advisor test counts; `AC_CLOSURE`/`AC_COVERAGE` in `dist/`; Node "18+" engines; `.utcp_config.json` template count; Related Documents links; doctor 12-vs-13 and templates 16-vs-18. (iteration 5)
- Q3 residuals: "121 advisor test files / 872 tests" (L412) not counted; `AC_CLOSURE`/`AC_COVERAGE` presence in `dist/`; Node "18+" engines (L92); `.utcp_config.json` 14 templates vs 7 integrations (L894-902); Related Documents links (L420-431); `ai-council` vs `deep-ai-council` mode-key naming; new residuals: L609 96/76 totals; L936 "Motion.dev" naming; badge redirect behavior on shields.io. (iteration 6)
- Q4: additive-gap list stands (iterations 4-5). (iteration 6)
- README residuals carried from iteration 6: advisor test counts (L412), Node engines (L92), `.utcp_config.json` 14 vs 7 (L894-902), Related Documents links (L420-431), L609 96/76 totals, L936 Motion.dev naming, shields.io badge redirect behavior. (iteration 7)
- Q2 residuals: compiled-router closure for sk-design (L392 says planned, not shipped, and was not re-verified), Rust placement, `@markdown` and `deep-ai-council` renames. (iteration 7)
- Changelog residuals: L96 "Forty rules are registered" (not re-verified, no rules manifest found under `runtime/cli/spec`), L32/L278 "eighteen of the twenty-two hook packages" (the repo-guards plugin was not read), chart and diagram form counts (L385 29 forms, L386 27 types) not re-counted, and the historical narrative numbers (L11 28KB and 3,000 lines, L108 22 plus 16 children, L114 1,275 lines and 175 vs 944, L228 178 recommendations, L90 42 surfaces, L120 44 alerts). (iteration 7)
- The changelog's historical narrative numbers (L11 28KB and 3,000 lines, L108 22 plus 16 children, L114 1,275 lines and 175 vs 944, L228 178 recommendations, L90 42 surfaces, L120 44 alerts) were not re-verified; they are outside this iteration's named focus. (iteration 8)
- Hermes 18/22: which of the five unmatched hook packages is the bridged 18th (candidate: session-lifecycle via the session-start advisories L278 lists) — needs a deeper read of `__init__.py`. (iteration 8)
- Carried: shields.io badge redirect behavior; sk-design compiled-router closure; `@markdown` / `deep-ai-council` renames; Rust placement; the advisor 121/872 provenance if it exists outside the tree. (iteration 8)
- Changelog L130 anchor-resolver behavior and L392 compiled-router closure not re-verified. (iteration 9)
- New: the "Related Documents" anchor is missing from the README, so the 10-link row needs re-location before editing. (iteration 9)
- Hermes 18-of-22: which package is the bridged 18th (candidate: session-lifecycle via the session-start advisories). Needs a deeper `__init__.py` read. (iteration 9)
- New: README L59 "20 domain skills" taxonomy unverified. (iteration 9)
- Changelog historical numbers (L11, L90, L108, L114, L120, L228) not re-verified. (iteration 9)
- Carried: shields.io badge redirect behavior, `@markdown` and `deep-ai-council` renames, Rust placement, the advisor 121/872 provenance if it exists outside the tree. (iteration 9)
- None material for the two documents. Closed with flags and no edits: the changelog's pre-release numerics (A16) and L130 behavior note (A17), the README's L59 diagram figure (B8), Rust line (B16) and badge URL (B17), and the carried `@markdown` / `deep-ai-council` rename checks (no evidence of error, not load-bearing). Applying the lists is the orchestrator's step, not the research leaf's. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None material for the two documents. Closed with flags and no edits: the changelog's pre-release numerics (A16) and L130 behavior note (A17), the README's L59 diagram figure (B8), Rust line (B16) and badge URL (B17), and the carried `@markdown` / `deep-ai-council` rename checks (no evidence of error, not load-bearing). Applying the lists is the orchestrator's step, not the research leaf's.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
resource-map.md not present; skipping coverage gate

Prior work: 025 (docs reality alignment research) audited the system-spec-kit documentation family; 035 corrected the changelog draft once against an earlier tree state; 041 performed the source-root migration whose compatibility surface is the main open question here.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`, `README.md`, `AGENTS.md` (Gates 1-2 name the live roots), `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/`.
- Reuse candidates: the 025 research lane method (iteration findings with cited evidence, then a confirmed-findings pass).
- Integration points: the two target documents only; corrections are applied by the orchestrator after the verdicts, never by the research leaf.
- Constraints and risks: a compatibility root can make an apparently stale path still true, so each path claim needs the live tree checked rather than the commit that introduced it.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 (stop-policy: max-iterations)
- Convergence threshold: 0.05 (telemetry only on this run)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-09-19T18:46:57Z

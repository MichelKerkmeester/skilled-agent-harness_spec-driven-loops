---
title: "Research Specification: Ponytail-Based Refinement of sk-code / sk-code-review"
description: "Deep-research investigation into how the external ponytail project's logic, hooks, intensity sliders, ceiling comments, rule-invariant guard, review skill, and benchmark harness can improve the sk-code and sk-code-review skills. Research-only: diagnose and recommend, do not implement."
trigger_phrases:
  - "ponytail refinement"
  - "ponytail sk-code"
  - "lazy decision ladder"
  - "ponytail hooks"
  - "sk-code improvement research"
  - "ponytail based refinement"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/015-sk-code-ponytail-based-refinement"
    last_updated_at: 2026-06-13T11:05:00Z
    last_updated_by: claude-opus
    recent_action: "12-iter deep research complete; research.md synthesized; all facts verified"
    next_safe_action: "Operator: /speckit:plan starting with Wave A additive doc rows"
---
# Research Specification: Ponytail-Based Refinement of sk-code / sk-code-review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase parent — research complete; implementation phased (6 children) |
| **Created** | 2026-06-13 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Code under analysis** | `external/ponytail-main` (reference) -> targets `.opencode/skills/sk-code` + `.opencode/skills/sk-code-review` |
| **Type** | Phase parent. The research (read-only, complete) lives in `research/`; the implementation is decomposed into the 6 phase children below. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 146 bundles the external **ponytail** project (`external/ponytail-main/`) and asks how its *logic, hooks, etc.* can improve our `sk-code` and `sk-code-review` skills. Ponytail enforces a "lazy senior developer" discipline via a 6-rung decision ladder, SessionStart/UserPromptSubmit hooks with flag-file mode state, lite/full/ultra intensity sliders, `// ponytail:` ceiling comments, a `check-rule-copies.js` rule-invariant guard, a `ponytail-review` deletion skill, and a PromptFoo benchmark harness. None of these mechanisms has been evaluated for transplant into our code-standards (`sk-code`) and code-review (`sk-code-review`) skills, which already carry a surface-aware smart router, an Iron-Law verification loop, a Phase 1.5 comment-hygiene hook, and a findings-first P0/P1/P2 review baseline.

### Purpose
Run a 10-iteration, 2-model deep-research loop (Opus 4.8 via the account-2 `claude` CLI + gpt-5.5-fast-high via cli-opencode), 5 waves over 10 distinct angles plus an adversarial cross-verify round, to produce prioritized, file-mapped recommendations: for each ponytail mechanism, whether it is portable, which `sk-code` / `sk-code-review` file or section it would touch, value/effort, integration-risk (especially conflicts with the comment-hygiene HARD BLOCK and the Iron-Law verify loop), and explicit negative-knowledge (what NOT to adopt). This packet stops at recommendations; implementation is a separate `/speckit:plan` -> `/speckit:implement` follow-up.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Analysis of `external/ponytail-main` mechanisms: decision ladder, hooks + flag-file state, intensity sliders, ceiling comments, rule-invariant guard, ponytail-review skill, benchmark harness, single-source+adapter portability.
- Mapping each mechanism onto concrete `sk-code` and `sk-code-review` files/sections with value/effort, integration-risk, and conflict flags.
- Adversarial cross-verification of the top recommendations (each model refutes the other's picks).
- A prioritized, negative-knowledge-bearing research report.

### Out of Scope
- Editing `sk-code` / `sk-code-review` (or any skill) in this packet.
- Adopting ponytail's distribution/packaging machinery wholesale.
- Re-validating ponytail's own benchmark numbers for our context.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Final prioritized, file-mapped research report (deliverable). |
| `research/**` | Create | Deep-research state, strategy, iterations, deltas, findings registry, dashboard. |
| `spec.md` | Update | Findings fence populated at synthesis. |
| (No `sk-code` / `sk-code-review` files modified in this packet.) | — | Research-only. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Evaluate each ponytail mechanism for transplant | Each of the 8+ mechanisms has a portability verdict + concrete target file/section in sk-code or sk-code-review, with `path` evidence. |
| REQ-002 | 10 research iterations across 2 models | 10 recorded in research state: Opus 4.8 ×5, gpt-5.5-fast ×5; all 5 waves present; round-2 cross-verify recorded. |
| REQ-003 | Prioritized recommendations | Each recommendation names value/effort, integration-risk, and the exact grep-traceable target path. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Adversarial cross-verification | Each lane refutes/validates the other's top picks; confirmed/refuted/uncertain verdicts recorded. |
| REQ-005 | Conflict flags surfaced | Comment-hygiene-vs-ceiling-comment and no-loop-vs-Iron-Law tensions explicitly resolved or flagged. |
| REQ-006 | Negative-knowledge documented | Report lists ponytail mechanisms that should NOT be adopted, with why. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with prioritized, file-mapped recommendations (value/effort + integration-risk + negative-knowledge).
- **SC-002**: Every recommendation cites a real, grep-traceable path in `sk-code` / `sk-code-review` (and the ponytail source it derives from).
- **SC-003**: No `sk-code` / `sk-code-review` source modified in this packet (research-only).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | claude account-2 binary + opencode openai provider authed | Seats fail to dispatch | Preflight confirmed: claude2 wrapper + ~/.claude-account2 present; opencode + gpt-5.5-fast available. |
| Risk | gpt-5.5-fast high timeout on broad scope | Seat times out mid-analysis | Narrow per-seat scope (one angle + named files); 1200s timeout; re-dispatch narrower on exit 124. |
| Risk | Narrow seats false-positive on repo conventions | Bad recommendation survives | Round-2 adversarial cross-verify (each model refutes the other's picks). |
| Risk | Ceiling comments collide with comment-hygiene HARD BLOCK | Unshippable recommendation | Q4 explicitly evaluates the conflict; flagged in negative-knowledge if irreconcilable. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Evidence Quality
- **NFR-E01**: Findings grounded in the actual ponytail and sk-code / sk-code-review files, not the strategy doc alone.
- **NFR-E02**: Every recommendation cites a concrete `path` (and section) in the target skill.

### Method Integrity
- **NFR-M01**: Read-only seats; orchestrator owns all state writes (Gate-3 safe).
- **NFR-M02**: Generate -> cross-verify; verification is refute-first.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Comment-hygiene conflict**: `// ponytail:` ceiling comments vs the repo's ephemeral-artifact-label HARD BLOCK — durable WHY allowed, perishable labels forbidden.
- **Philosophy clash**: ponytail's "no iterative loop, gate upfront" vs sk-code's Iron-Law verify-loop — a mechanism may be conceptually portable but behaviorally incompatible.
- **Surface router interaction**: a pre-implementation ladder gate must not break OPENCODE>WEBFLOW>UNKNOWN precedence or the phase intent scoring.
- **Mirror drift**: a rule-invariant guard must account for the 3-runtime (.opencode/.claude/.codex) mirror convention.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Can the 6-rung decision ladder gate sk-code Phase 1 without breaking surface-router precedence? **(Wave 1 to resolve)**
- Do `// ponytail:` ceiling comments survive the comment-hygiene HARD BLOCK? **(Wave 2 to resolve)**
- Should sk-code gain a verification-intensity slider and sk-code-review a review-depth slider? **(Wave 2 to resolve)**

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Research complete (12 iterations: 10 generate across 5 waves + 2 adversarial cross-verify; Opus 4.8 ×6 + gpt-5.5-fast ×6). Full report: `research/research.md`.**

- **Core tension resolved as complementary:** ponytail gates *design* upfront (6-rung ladder, no loop) at Phase 1; sk-code's Iron Law verifies *result* at Phase 3. Coherent only if ponytail's "no-loop" is not imported literally to bypass READ-FIRST / SCOPE-LOCK / verification.
- **ADOPT-NOW (8):** (1) Design Restraint Ladder as a ~15-line subsection in the always-loaded `references/universal/code_quality_standards.md`, attached at the Phase 0→1 transition (NOT a new routable file — would trip the router-sync drift guard); (3) stdlib/native review rows in `code_quality_checklist.md`; (4) canary-lock the `Review status:` triplet via a standalone script+workflow (NOT vitest — none is CI-gated); (5) neutral `ceiling:` comment content, NOT the `ponytail:` brand and NOT in comment-hygiene `ALLOWED_PATTERNS`; (6) ceiling comments as P2-downgrade evidence; (7) needed-ness KISS prompt wired to removal; (8) `Replacement` field in `removal_plan.md`. **Safe first wave = the purely-additive doc rows (#3/#8/#4).**
- **DO-NOT-ADOPT (negative knowledge):** verification intensity slider (Iron-Law bypass — the "most overrated" transplant), standalone PromptFoo clone, standalone ponytail-review skill, `net -N`/LOC as a severity gate, new findingClass for over-engineering, literal `// ponytail:` brand, repo-visible flag file, byte-equality/always-on-injection/9-host fan-out for skills.
- **Bonus latent defects found + verified on disk:** Iron Law wording drifted 3 ways (`SKILL.md:45` vs `:137` vs `CLAUDE.md:11`) → canonicalize before any canary; `mirror-sync-verify.cjs` exists but is mis-scoped to promotion-time (no commit/CI gate for `.claude`/`.codex` agent-mirror drift); `STACK_FOLDERS`↔`references/` binding is unenforced.
- **Verification:** all 7 load-bearing factual claims independently grep-confirmed; round-2 refuted ZERO recommendations as already-present; 2 scope corrections applied (canary per-file scope; ladder = highest-value but highest-RISK in ADOPT-NOW, not "lowest-risk").
- **Next:** `/speckit:plan` (start Wave A = additive docs) → `/speckit:implement`. No skill code changed in this packet.
<!-- END GENERATED: deep-research/spec-findings -->

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Research complexity: high (2-model heterogeneous fan-out, 10 iterations + cross-verify, two mature target skills with strong existing invariants). Risk: low (read-only; no skill code changed). Recommendations will be localized, file-mapped changes for a follow-up implementation packet.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Reference project**: `external/ponytail-main/` (ponytail SKILL.md, hooks/, scripts/check-rule-copies.js, benchmarks/)
- **Targets**: `.opencode/skills/sk-code/**`, `.opencode/skills/sk-code-review/**`
- **Research report**: `research/research.md`
- **Research state**: `research/deep-research-strategy.md`, `research/deep-research-state.jsonl`

### Phase children (implementation)

Ordered by dependency + risk (cheap, safe wins → guards that also fix the 3 bonus bugs → the one risky workflow change last). Each maps to research.md recommendations.

| Phase | Folder | Recs | Status | Risk |
|------|--------|------|--------|------|
| 1 | `001-skreview-checklist-rows` | #2 stdlib/native rows, #6 needed-ness prompt, #7 replacement field | ✅ Implemented + verified (Opus 4.8 via claude2) | very low |
| 2 | `002-ceiling-comment-convention` | #4 neutral `ceiling:` convention, #5 P2-downgrade evidence | ✅ Implemented + verified (Opus 4.8 via claude2) | low |
| 3 | `003-wording-invariant-guards` | #3 Review-status canary, #8 Iron Law invariant lock (Bug 1) | ✅ Implemented + verified (Opus 4.8 via claude2) | low-med |
| 4 | `004-mirror-stackfolder-drift-guards` | #10 promote mirror-sync (Bug 2), STACK_FOLDERS check (Bug 3) | ✅ Implemented + verified (Opus 4.8 via claude2); 2 pre-existing drifts fixed | low |
| 5 | `005-design-restraint-ladder` | #1 Design Restraint Ladder in sk-code Phase 1 | ✅ Implemented + verified (Opus 4.8 via claude2); router-sync guard green | high |
| 6 | `006-optional-addons` | #9 benchmark metric, #11 depth alias / anti-stall / hooks | ✅ anti-stall + depth alias shipped; benchmark + hooks deferred (operator-optional) | mixed |

**Resume pointer:** All 6 phases complete. Phases 1-5 fully implemented + verified; Phase 6 shipped its 2 worthwhile add-ons (anti-stall rule + depth alias) and deferred 2 operator-optional items (benchmark metric, runtime hooks). Outstanding: commit the work (scoped, to avoid the concurrent session's changes), then optionally PR.

<!-- /ANCHOR:related-docs -->

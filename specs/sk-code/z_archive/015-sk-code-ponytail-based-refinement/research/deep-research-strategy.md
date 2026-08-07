---
title: Deep Research Strategy - Ponytail -> sk-code / sk-code-review
description: Persistent context + focus tracking for the 10-iteration, 2-model (Opus 4.8 + gpt-5.5-fast) investigation of how ponytail's logic/hooks can improve sk-code and sk-code-review.
---

# Deep Research Strategy - Ponytail -> sk-code / sk-code-review

## 1. OVERVIEW
Investigate how the external `ponytail` project (`external/ponytail-main/`) — its 6-rung lazy decision ladder, SessionStart/UserPromptSubmit hooks + flag-file mode state, lite/full/ultra intensity sliders, `// ponytail:` ceiling comments, `check-rule-copies.js` invariant guard, `ponytail-review` deletion skill, and PromptFoo benchmark harness — can improve our `sk-code` (surface-aware smart router, Iron-Law verify, Phase 1.5 comment-hygiene hook) and `sk-code-review` (findings-first P0/P1/P2 baseline, efficiency gates) skills. 5 waves × (Opus 4.8 + gpt-5.5-fast) = 10 distinct-angle iterations, then adversarial cross-verify. Research-only: diagnose + recommend, do NOT implement.

---

## 2. TOPIC
For each ponytail mechanism, determine: (a) is it portable to sk-code / sk-code-review, (b) which concrete file/section it would touch, (c) value/effort, (d) integration-risk and conflicts with existing invariants (esp. comment-hygiene HARD BLOCK and the Iron-Law verify loop), and (e) negative-knowledge — what should NOT be adopted.

---

## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Can ponytail's 6-rung decision ladder be encoded as a pre-implementation gate in sk-code Phase 1 without conflicting with the surface router precedence (OPENCODE > WEBFLOW > UNKNOWN)?
- [ ] Q2: Which ponytail hook points (SessionStart mode-activation, UserPromptSubmit rule-injection, flag-file state) map onto sk-code's existing PostToolUse comment-hygiene hook and the 4 wired Claude entrypoints?
- [ ] Q3: Should sk-code gain a lite/full/ultra-style "verification intensity" slider and sk-code-review a "review depth" slider, and how would that map to the existing phase model / P0-P1-P2 severity?
- [ ] Q4: Do `// ponytail:` ceiling comments collide with sk-code's comment-hygiene HARD BLOCK, and can sk-code-review use intentional-simplification markers to cut over-engineering false positives?
- [ ] Q5: Could a `check-rule-copies.js`-style canary-phrase guard protect the skills' multi-file references and 3-runtime (.opencode/.claude/.codex) mirrors, and how does it relate to the existing router-sync drift guard?
- [ ] Q6: Could sk-code adopt a PromptFoo-style objective over-engineering/simplicity benchmark (LOC/cost/latency) akin to deep-improvement's sweep benchmark?
- [ ] Q7: How should ponytail's "ship-the-lazy-version-then-question" behavior and YAGNI/KISS lens map onto sk-code-review's findings-first severity (new finding class / checklist item)?
- [ ] Q8: Which `ponytail-review` deletion-focused checklist items merge into sk-code-review's code_quality_checklist / removal_plan / solid_checklist?
- [ ] Q9: How does ponytail's single-source + thin-adapter portability model inform the repo's 3-runtime mirror convention and sk-code's template-customization surface?
- [ ] Q10: What is genuinely portable vs philosophically-incompatible (ponytail's no-iterative-loop stance vs sk-code's Iron-Law verify loop), ranked by value/effort, with precedence-conflict flags?

---

## 4. NON-GOALS
- Implementing any change to sk-code / sk-code-review (separate `/speckit:plan` -> `/speckit:implement` packet).
- Adopting ponytail's distribution/packaging machinery wholesale (only the reusable concepts).
- Re-litigating ponytail's benchmark numbers; treat them as motivation, not proof for our context.

---

## 5. STOP CONDITIONS
- 10 iterations complete (5 waves generate) + adversarial cross-verify, OR convergence (newInfoRatio < 0.05).
- Deliverable: prioritized, file-mapped recommendations with value/effort + integration-risk + negative-knowledge, each citing a real grep-traceable path in sk-code / sk-code-review.

---

## 6. ANSWERED QUESTIONS
[None yet]

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
[Populated after iteration 1]

---

## 8. WHAT FAILED
[Populated after iteration 1]

---

## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]

---

## 10. RULED OUT DIRECTIONS
[None yet]

---

## 11. NEXT FOCUS
Wave 1: iter 001 (Opus) traces the decision-ladder transplant into sk-code Phase 1; iter 002 (gpt-5.5-fast) maps ponytail hooks onto sk-code's hook surface. Each seat reads the real ponytail + sk-code files and proposes concrete, file-mapped changes with value/effort/risk; explicitly consider angles NOT in Key Questions.

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT (evidence baseline)

### Ponytail reusable surface (from external/ponytail-main)
- `skills/ponytail/SKILL.md` — 6-rung ladder (YAGNI -> stdlib -> native -> installed-deps -> one-liner -> minimal custom); lite/full/ultra intensity; "ship + question" pattern; ONE-runnable-check test reflex; `// ponytail:` ceiling comments.
- `AGENTS.md` — canonical compact ruleset synced across adapters.
- `hooks/hooks.json` + `ponytail-activate.js` (SessionStart) + `ponytail-mode-tracker.js` (UserPromptSubmit) + `ponytail-runtime.js`/`ponytail-config.js` — flag-file mode state (`.ponytail-active`), env>config>default resolution, instruction filtering by mode.
- `.opencode/plugins/ponytail.mjs` — OpenCode system-prompt injection per turn + `/ponytail <level>` command persistence.
- `skills/ponytail-review/SKILL.md` — deletion/over-engineering review skill.
- `scripts/check-rule-copies.js` — rule-invariant canary-phrase drift guard across adapter copies.
- `benchmarks/` — PromptFoo harness (5 tasks × 3 models × 3 arms × 10 runs) measuring LOC/cost/latency.

### sk-code (target A) — key files
- `SKILL.md` (§2 Smart Routing: surface precedence OPENCODE>WEBFLOW>UNKNOWN; phase intent scoring; Iron Law "no completion without verification evidence"; Phase 1.5 comment-hygiene gate).
- `references/{stack_detection,smart_routing,phase_detection}.md`; `references/{webflow,opencode,motion_dev}/**`.
- `scripts/check-comment-hygiene.sh` + `scripts/hooks/claude-posttooluse.sh` (write-time hygiene warning, fail-safe exit 0).
- `assets/scripts/verify_alignment_drift.py` (Phase 3 verification).

### sk-code-review (target B) — key files
- `SKILL.md` (findings-first; P0/P1/P2 never numeric-gated; baseline+surface precedence; M-1 PR-state dedup, M-2 min-evidence gate).
- `references/{review_core,code_quality_checklist,security_checklist,solid_checklist,removal_plan,fix-completeness-checklist,pr_state_dedup}.md`.

### Comment-hygiene HARD BLOCK (potential conflict with ceiling comments)
- Repo forbids ephemeral-artifact labels in code comments (spec paths, ADR/REQ/task ids). `// ponytail:` markers must be evaluated against this rule — a key integration-risk for Q4.

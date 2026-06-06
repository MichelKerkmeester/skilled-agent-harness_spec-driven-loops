Deep-research iter 4/10 cross-validation pass for packet 027.

ITER 4 FOCUS: IRQ4 — Phase 004 confidence-edge-case stress.

READ FIRST:
- 027/004-skill-advisor-first-action-mandate/spec.md (especially REQ-003 confidence ≥0.8 preserved + REQ-004 token cap + L2 EDGE CASES if present)
- 027/research/027-xce-research-based-refinement-pt-02/iterations/iteration-001.md, 002.md, 003.md (note any tone/observations on advisor brief side-effects)
- mcp_server/skill_advisor/lib/render.ts (read FULL file — current capText logic at 149-158, confidence threshold at 124-133, token cap constants at 39-65, ambiguous case at 149-152, normal case at 155-158)
- mcp_server/skill_advisor/lib/skill-advisor-brief.ts (renderSharedBrief integration, where render.ts is invoked)
- mcp_server/skill_advisor/lib/scorer/ — list files only, do NOT propose scorer changes (out-of-scope per parent 027 spec.md:129)

QUESTION: Phase 004 strengthens brief from "use ${label}" to "MUST invoke ${label} FIRST (...) — ${action_hint}" with FIRST_ACTION_HINT map covering 16 skills. Stress-test edge cases:
- Confidence boundary: at confidence ∈ {0.79, 0.80, 0.81}, does the brief shape stabilize? Specifically: 0.79 → no brief? 0.80 → MUST? Is the threshold inclusive or exclusive?
- Uncertainty > confidence: spec doesn't address. If confidence=0.80 but uncertainty=0.85, is "MUST invoke" appropriate?
- AMBIGUOUS_TOKEN_CAP=120 (line 40) vs DEFAULT_TOKEN_CAP=80 (line 39). New brief format ("MUST invoke ${label} FIRST (${score}/${uncertainty}) — ${hint}") is longer. Will it overflow either cap?
- FIRST_ACTION_HINT: spec says "must include all 16 skills". Look at the available_skills list (system prompt provided ~16 skills). What if a NEW skill is added — does the rendering fail or fall back?
- CLI skills (cli-claude-code, cli-codex, cli-gemini, cli-opencode): spec acknowledges "MUST invoke cli-claude-code FIRST" might be confusing. The risk-mitigation says "confidence ≥0.8 ensures external CLI skills only surface when prompt genuinely matches their domain." Is that correct? Test: when does cli-codex score ≥0.8?
- LEGACY behavior: existing render.ts tests that pass today must continue passing. Are the test fixtures encoded in render.vitest.ts? Do they need rewriting?
- Race: skill_advisor brief is rendered per-prompt. Does the new format affect cache hit rates in prompt-cache.ts?

DELIVERABLES (all 3 required):
1. WRITE `pt-02/iterations/iteration-004.md` with full sections + Next Focus = IRQ5
2. APPEND `>>` ONE LINE to `pt-02/deep-research-state.jsonl`:
{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"complete","focus":"IRQ4"}
3. WRITE `pt-02/deltas/iter-004.jsonl` (1 iter record + ≥3 findings with verdicts)

CONSTRAINTS: LEAF, ≤12 tools, READ-ONLY 027/* + mcp_server/, WRITE pt-02/ ONLY, file:line cites required, no scorer/ changes.

NEXT: IRQ5 — Phase 005 subprocess reliability at 24-40 sequential dispatches.

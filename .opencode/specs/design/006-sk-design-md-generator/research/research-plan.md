# Research Plan — sk-design-md-generator hardening (50 iterations)

Master driver for the host-orchestrated deep-research loop. Each iteration = one CLI seat (MiMo or DeepSeek, high) on one angle, host-written to `iterations/iteration-NNN.md` + `deltas/iter-N.jsonl` + `deep-research-state.jsonl`. Reduce after each wave. No early convergence — run all 50, broaden angles.

## Iteration allocation (50; Track D >= 20)

| Iters | Track | Theme |
|---|---|---|
| 1-10 | A | Hallucination prevention & fidelity (stop ungrounded prose) |
| 11-19 | B | Backend script logic (extraction completeness + correctness) |
| 20-27 | C | Skill context engineering (steer model to faithful output) |
| 28-50 | D | External tools/repos survey (>=23) — borrowable fidelity/anti-fabrication |

Interleaving allowed when a cross-track connection emerges (log it; keep the RESERVED question open).

## Track A backlog (hallucination prevention) — assign 1/iter, expand

A1 claims-to-token provenance: force every interpretive sentence to cite a tokens.json field; how validate.ts enforces. A2 hard check: forbid word "consistent" unless a11yTokens.focusIndicator.consistent==true AND focusStyles.length>0. A3 named-principle (gradient-depth/chromatic-depth) must cite tokens.gradients[]/shadowTokens[] or fail. A4 prompt "report absence, never invent" clause for derived/boolean fields. A5 WRITE emits claims.json sidecar (claim->token key) for mechanical verify. A6 extend checkStabilityGating beyond colors to shadows/gradients/components. A7 enforce quality_checklist banned-word/adjective list in code (currently prose-only). A8 reconsider mandated "comparative framing" (claims about OTHER systems = structural fabrication). A9 constrain named-principle vocabulary to token-derived allowlist. A10 split score into "values present" vs "claims true" so 99/100 can't be earned on hex-tracing alone. A11 structured-output mode for high-risk sections (depth/focus/motion philosophy). A12 invert checkUnknownFonts to strict allowlist. A13 per-section evidence ledger in cardinal-rules card + prompt. A14 targeted phrase check "focus is consistent" when focusIndicator.style=={}. A15 post-write adversarial self-review listing value-less sentences before VALIDATE.

## Track B backlog (backend script logic)

B1 interaction capture OFF by default (extract.ts:81; --fast forces off) nulls hover/focus/active. B2 extractA11y called without async half (extract.ts:445 vs a11y-extract.ts:361 extractA11yAsync unused) -> reducedMotion/tabOrder/lang/skipLink/altText never populated. B3 OKLCH deltaE<3 greedy clustering (cluster.ts:708) merges/splits brand colors -> corrupts frequency/stability. B4 hue circular-distance modulo-after-abs (cluster.ts:776-784) wraparound bug. B5 contrast pairs capped top-20 (cluster.ts:799) miss real text-on-bg pairs. B6 gradients raw strings only, no stop/angle/type decomposition (types.ts:124). B7 motion extracted from cssAnalyses[0] only (extract.ts:439) discards other pages. B8 breakpoints lack per-bp "Key Changes" detail (extract.ts:471). B9 cssVariables flat-concatenated not role-typed (extract.ts:451). B10 L1-L4 classify thresholds 60/30/0 (cluster.ts:429) vs SKILL contract + boundary "assign higher" rule. B11 classifyVariant default-to-Primary (cluster.ts:1256) masks variants. B12 component geometric heuristics won't generalize (cluster.ts:1150). B13 findInteraction fragile tag|class|type key drops diffs (cluster.ts:1293). B14 classifyShadow duplicated defs (cluster.ts:374 & 1047) drift + zero-blur border-shadow. B15 report/preview/proof token->section coverage map (surface zero-token sections = invention sites). B16 min-touch/min-font from global min may be hidden 1px element.

## Track C backlog (context engineering)

C1 SKILL.md WRITE phase lacks "no interpretive invention" contract (only "copy numeric verbatim"). C2 ALWAYS-loaded writing_style_guide.md is the doc most encouraging narrative — reconsider. C3 reframe mandatory "named principle"/"philosophy" as conditional-on-evidence. C4 §10 motion fallback models invented recommendations as output. C5 elevate cardinal-rules from post-check to pre-write gate. C6 anti_patterns.md loads only on EXTRACT_WRITE, absent at VALIDATE. C7 add first-class "fidelity-audit" intent. C8 inline sentinel markers [SOURCE: tokens.x] strippable but checkable. C9 add AP-29 "Interpretive Fabrication" to anti_patterns.md. C10 ESCALATE-IF "required section has no backing tokens". C11 resolve style-guide §10 deletion-test vs format-spec mandatory-philosophy contradiction. C12 section spec "required when evidence exists, else stamped ABSENT".

## Track D deep-dive list (external tools; >=23 iters, host-fed repo/docs)

Priority deep-dives (direct competitors / most borrowable): 1 DesignMD (designmd.cc) — URL->DESIGN.md, headless computed CSS, 9-section schema, AI-agent prompts. 2 design-extract/designlang (github Manavarya09, 3.3k*) — crawl+synthesis, coverage-based token election, WCAG, report cards, MCP. 3 extract-design-system (arvindrk) — AI skill, computed CSS -> W3C tokens. 4 Superposition — computed-style + unused-style filtering. 5 project-wallace/css-analyzer — static CSS -> DTCG tokens. 6 Open Design (nexu-io, 57.4k*) — DESIGN.md 9-section schema, multi-agent. 7 Style Dictionary — W3C transform reference. 8 CSS Stats — computed-style introspection + occurrence clustering. 9 W3C DTCG 2025.10 — $type/$value schema (zero-invention). 10 Dembrandt — live site -> tokens. 11 Tokens Studio — Figma vars -> W3C JSON. 12 Diez/Theo/Terrazzo — token transform patterns. 13 Parker — CSS complexity/specificity. 14 MiroMiro/StyleSniff — hover computed-style inspection. 15 contrast tooling (WebAIM/Stark CIEDE2000 nearest-compliant). 16 font-metrics extractors (OpenType tables). 17 Builder.io Visual Copilot / Anima / Locofy — design->code hierarchy mapping. 18 Supernova/Backlight/Zeroheight/Knapsack — doc platforms, Figma sync, AI drafting. 19 get-custom-properties / postcss-custom-properties — CSS var extraction. 20 Specify (SDTF composite tokens). 21 Penpot/Sketch native token export. 22 "reverse-engineer design system" articles/approaches. 23 Synthesis: cross-tool fidelity pattern taxonomy + a prioritized borrow list for this skill.

Each Track D iter: NAME | how it extracts faithfully | how it avoids fabrication | what's borrowable here | priority to adopt. Host fetches the repo README/source/docs and feeds the seat (seats do not web-search).

## Per-iteration dispatch recipe (host)

1. Build prompt file `prompts/iteration-N.md`: the angle + grounding (skill file excerpts for A/B/C; host-fetched tool docs for D) + output contract (return findings JSON: {findings:[{severity,label,detail,recommendation,evidence}], answeredQuestions:[], newInfoRatio, nextAngles:[]}).
2. Dispatch seat (background, gtimeout -k 60 1200):
   `opencode run --model <opencode-go/mimo-v2.5-pro|opencode-go/deepseek-v4-pro> --variant high --dir "$PWD" "$(cat prompts/iteration-N.md)" </dev/null`
3. On completion, host writes: `iterations/iteration-NNN.md` (Focus/Actions/Findings/Questions Answered/Questions Remaining/Next Focus), `deltas/iter-N.jsonl` (>=1 {"type":"iteration",...} + per-finding {"type":"finding",...}), append `deep-research-state.jsonl` ({"type":"iteration","run":N,"iteration":N,"status":"complete|insight","newInfoRatio":x,"focus":"...","findingsCount":n,"answeredQuestions":[...],"timestamp":"..."} — NEVER answer the RESERVED question).
4. After each wave: `node .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs .opencode/specs/design/006-sk-design-md-generator` (refreshes strategy machine-sections + dashboard + findings-registry).
5. Broaden: pull next angles, expand from nextAngles, keep RESERVED open.

## Monitoring
- <=3 concurrent seats/wave (launch-race ceiling). Host checks seat output ~every 3 min; relaunch stalled/empty seats into the same wave.
- Non-OpenCode surface required for cli-opencode dispatch (host is Claude Code — OK).

## Convergence-disable contract (do not violate)
maxIterations 50 (only stop) + convergenceThreshold 0 + stuckThreshold 999 + RESERVED question permanently open + broaden angle every iteration. Manual orchestration => convergence algorithm not invoked; coverage to 50 is host-guaranteed.

## Deliverable
`research.md` synthesis: prioritized hardening recommendations (prompt + validator + script + context-engineering, each tied to a root cause + an angle) + cataloged external-tool survey with a ranked borrow list.

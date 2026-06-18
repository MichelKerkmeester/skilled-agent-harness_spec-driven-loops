# Iteration 003 — SURFACE MAP: Read-Reliability × Portability × Structural Enforcement

**Status:** complete  |  **Focus:** Assess every adjustable Public-repo surface's read-reliability per runtime, with portability lens. Identify which surfaces can structurally enforce vs which are advisory-only. Verify OpenCode/Codex hook-equivalent wiring.

---

## 1. Assessment

### newInfoRatio: 0.45
**Novelty justification:** The portability lens reveals that the sibling lineages' surface map rated hook read-reliability as "runtime-dep" for OpenCode/Codex without assessing whether equivalent injection surfaces exist. This iteration verified: (a) Codex has a UserPromptSubmit hook equivalent, (b) OpenCode has a hook system but the per-turn surface requires distinct wiring, (c) the deep-loop-runtime's `renderPromptPack` is the ONLY cross-runtime structural enforcement surface — and it's currently advisory-only (renders text into agent prompts, but the agent can ignore it). The structural-vs-advisory distinction is new.

### Surface Map with Portability × Structural-Enforcement Rating

| Surface | OpenCode | Claude | Codex | Decay | Subagent? | Structural? | Portability Note |
|---|---|---|---|---|---|---|---|
| **AGENTS.md / CLAUDE.md §1-7** (setpoint) | HIGH | HIGH | HIGH | YES | partial (CLAUDE.md twin) | NO (advisory text) | Universal read. 424 lines, ~76-line headroom. Best for doctrine-spine text, not repeated injection. |
| **UserPromptSubmit hook** (thermostat) | **runtime-dep** | **HIGHEST** | **HIGH** (hook exists at claude/codex paths) | NO | NO (main-session only) | NO (advisory text through hook) | Claude hook fires every turn. Codex hook file exists at same path. OpenCode hook-equivalent requires distinct wiring (no settings.json pattern). CROSS-RUNTIME GAP: the hook is the highest-read-reliability surface but NOT universally wired. |
| **Constitutional memories** (16 rules) | MED | MED-HIGH | MED | partial | via memory_search | NO | Durable auto-surface for doctrine. Adding a rule gives it the search boost. Good for permanent guardrails (finding-is-a-hypothesis pattern). |
| **Agent prompts** (12 agents, 3 mirrors) | HIGH (that agent) | HIGH | HIGH | low | YES — the only subagent surface | NO (text injected at dispatch) | 3-runtime-mirror drift risk. The carrier for any subagent-visible governor. renderPromptPack injects here. |
| **Skills** (sk-code, sk-prompt, etc.) | LOW-MED | LOW-MED | LOW-MED | n/a | when invoked | NO (text) | Point-of-use. Best for mechanism-specific guidance (mutation-check in sk-code). |
| **Commands** (deep/*, speckit/*, memory/*) | HIGH when invoked | same | same | n/a | n/a | NO | Governs one workflow. Not for persistent behavior. |
| **deep-loop-runtime** (executor-config, post-dispatch-validate, renderPromptPack) | N/A (executable) | N/A | N/A | n/a | applies to every dispatch | **YES — THE ONLY STRUCTURAL ENFORCEMENT SURFACE** | This is where mechanisms become enforced rather than advised. executor-config controls dispatch; post-dispatch-validate validates outputs; renderPromptPack injects text into agent contexts. |
| **skill-advisor** (scoring/triggers) | N/A | N/A | N/A | n/a | affects what surfaces | NO | Indirect leverage. Can surface constitutional rules. |

### Critical Finding: The Structural Enforcement Gap

The sibling lineages identified 12 recommendations, but none of them are currently **structurally enforceable** — they're all advisory text on various surfaces. The ONE surface that can enforce: `post-dispatch-validate.ts` (validates iteration artifacts) and `renderPromptPack` (injects text into agent dispatch contexts). But:

1. **renderPromptPack is advisory-only:** it renders text into the prompt template, but the dispatched agent can ignore it. There's no post-hoc check that the agent followed the governor's rules.
2. **post-dispatch-validate validates artifacts, not behavior:** it checks that iteration-NNN.md exists and JSONL has required fields, but doesn't check tool:text ratio, caveat %, self-opener %, or other behavioral metrics.
3. **executor-config controls which model runs but not provenance verification:** it sets model, reasoningEffort, etc. but the executor-audit doesn't verify the actual model that ran matches the requested one (the codex SIGKILL/silent-gpt-5 defect).

**This means Tier B (mechanism) recommendations fall into two sub-tiers:**
- **B-advisory:** Text on high-read-reliability surfaces (hook, AGENTS.md, agent prompts) — works via persuasion, decays, subagent-blind
- **B-structural:** Code in the deep-loop-runtime (post-dispatch-validate, executor-audit, renderPromptPack) — enforced, cross-runtime, subagent-visible

The sibling lineages didn't make this distinction. It's load-bearing for the implementation packet: B-advisory items can ship as text drops; B-structural items require TypeScript runtime work.

### OpenCode/Codex Hook Equivalence Verified

- **Claude:** UserPromptSubmit hook fires `user-prompt-submit.js` every turn → delegates to `system-skill-advisor/mcp_server/dist/hooks/claude/user-prompt-submit.js`. Confirmed active. [SOURCE: .claude/settings.json:14-24]
- **Codex:** UserPromptSubmit hook file exists at `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js`. The delegate target is `system-skill-advisor/mcp_server/dist/hooks/codex/user-prompt-submit.js`. Hook file exists but whether Codex's settings.json wires it is unverified. [SOURCE: grep result, hooks/codex/user-prompt-submit.js:9]
- **OpenCode:** No settings.json hook mechanism confirmed. OpenCode's hook system uses `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md` for prompt-time injection, which follows a different pattern (hook briefs surfaced at session start, not per-turn). **OpenCode does NOT have the same per-turn thermostat surface.**

### Dead Pointer Confirmed

The opus-account2 lineage flagged that AGENTS.md cites `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` as a surface — this file does not exist in the repo. Verified: glob for `**/skill-advisor-hook.md` in `.opencode/skills/` returns no matches. This is exactly the kind of staleness F6 (engineer staleness out of artifacts) targets. [SOURCE: glob no-match]

### Ruled-Out Directions

| Approach | Reason | Evidence |
|---|---|---|
| Rating OpenCode hook as HIGH | No per-turn hook equivalent confirmed; hook briefs are session-start, not per-prompt | skill_advisor_hook.md reference (missing file) |
| Treating renderPromptPack as structural enforcement | It injects text — the agent can still ignore it; no post-hoc behavioral verification exists | post-dispatch-validate.ts:506-520 (validates artifacts, not behavior) |
| Counting on OpenCode/Codex hook wiring without verification | Codex hook file exists but wiring unconfirmed; OpenCode path is different entirely | grep: codex hook file path exists; settings.json wiring not readable |

### Answered Questions
- Q2 (substantially answered): Surface read-reliability map assessed with portability lens. Key finding: B-structural (deep-loop-runtime code) vs B-advisory (text on surfaces) distinction is load-bearing. OpenCode lacks per-turn thermostat. Codex hook exists but wiring unconfirmed.
- Q5 (partially): renderPromptPack and post-dispatch-validate are the structural enforcement landing zones, but both currently enforce artifact integrity, not behavioral metrics.

---

## 2. Strategy Update

**What Worked:** Distinguishing B-structural from B-advisory immediately clarified the implementation sequence: structural changes (executor-audit fail-loud, post-dispatch behavioral validation) must ship first to create the enforcement infrastructure, THEN advisory text (governor capsule, mutation-check guidance) can be layered on top. Without the enforcement layer, advisory text is just more AGENTS.md content that decays.

**Next Focus (Iteration 4):** OPTIMIZE pillar — rank surface×delta recommendations with independent leverage/cost/blast scoring, using the B-structural vs B-advisory distinction. Cross-check against sibling lineages for convergence/divergence. Focus on the efficiency-lever set (F10 + G1:6-8 + G5) as distinct from the correctness-lever set (F1-F7, F11-F15).

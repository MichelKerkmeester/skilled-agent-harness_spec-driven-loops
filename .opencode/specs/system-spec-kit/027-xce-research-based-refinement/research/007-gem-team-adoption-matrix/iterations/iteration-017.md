# Iteration 017: RQ-V4 adversarial — learning & knowledge (auto-skills + knowledge precedence)

**Focus:** RQ-V4 adversarial — learning & knowledge (auto-skills + knowledge precedence)  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.42.  
**Raw output:** prompts/iteration-017.out  ·  **Prompt:** prompts/iteration-017.prompt

### VERDICTS
| Claim | Original verdict | Adversarial result (upheld/downgraded/refuted) | Revised verdict | Strongest counter-evidence (file:line) |
|---|---|---|---|---|
| Claim 1 — Auto-skills extraction with thresholds | ADAPT | downgraded | ADAPT-NARROW: only the run-learning auto-discovery trigger is net-new; thresholded/autonomous skill creation and evaluator-gated promotion already exist | `.opencode/commands/create/assets/create_sk_skill_auto.yaml:4`, `.opencode/commands/create/assets/create_sk_skill_auto.yaml:39-40`, `.opencode/commands/create/assets/create_sk_skill_auto.yaml:347-361` |
| Claim 2 — Explicit knowledge-source precedence order | ADAPT, high value | downgraded | ADAPT-LOW/MEDIUM: not a single Gem-style PRD→code→docs ladder, but spec-kit already has local precedence ladders and Logic-Sync escalation | `.opencode/agents/context.md:29`, `.opencode/agents/context.md:160-164`, `AGENTS.md:310-312` |

### EVIDENCE
- [V-017-01] Claim 1 auto-skills: Deep-improvement does not auto-extract `SKILL.md` from run learnings. It is a bounded evaluator workflow for agent surfaces, not skill harvesting: Lane A “improves a bounded agent `.md` file” and writes exactly one packet-local candidate before scoring (`.opencode/skills/deep-improvement/SKILL.md:230-247`). Promotion is guarded by prompt scoring, benchmark status, repeatability, boundary, and approval gates (`.opencode/skills/deep-improvement/SKILL.md:276-280`), and proposal-only mode must not mutate canonical targets or promote non-canonical targets (`.opencode/skills/deep-improvement/SKILL.md:508-515`). But the claimed gap is overstated: `/create:sk-skill` already has an autonomous no-approval workflow (`.opencode/commands/create/assets/create_sk_skill_auto.yaml:1-11`, `.opencode/commands/create/assets/create_sk_skill_auto.yaml:26-40`), confidence thresholds (`.opencode/commands/create/assets/create_sk_skill_auto.yaml:55-67`), DQI thresholds (`.opencode/commands/create/assets/create_sk_skill_auto.yaml:347-361`), and template-first skill scaffolding. `sk-doc` already owns skill creation and templates (`.opencode/skills/sk-doc/SKILL.md:57-83`, `.opencode/skills/sk-doc/SKILL.md:357-367`). Net-new is not “threshold-gated skill creation”; it is specifically “automatic run-learning pattern detection that proposes a skill candidate.”
- [V-017-02] Claim 2 knowledge precedence: The “no precedence” claim is too strong. Spec-kit already states canonical continuity order for recovery: `handover.md` first, `_memory.continuity`, then packet spec docs; memory helps but does not replace packet docs as runtime truth (`.opencode/agents/context.md:29`). The context workflow repeats “CANONICAL CONTINUITY FIRST” (`.opencode/agents/context.md:52-61`) and says packet docs carry current runtime truth while memory adds history without overriding canonical packet state (`.opencode/agents/context.md:160-164`). `AGENTS.md` also defines the resume ladder and says packet-local continuity remains source-of-truth when graph is unavailable (`AGENTS.md:114-119`). However, for true contradictions, `AGENTS.md` does not pick a universal winner; Logic-Sync halts and asks which truth prevails (`AGENTS.md:310-312`). So Gem’s single fixed priority list is only partially net-new: spec-kit lacks one global PRD/code/config/memory conflict matrix, but it already has strong local precedence and explicit contradiction escalation.

### REVISED NET-NEW VALUE
Claim 1 is sub-packet-worthy only as a shadow/proposal feature: mine successful-task learnings for recurring high-confidence patterns, generate a packet-local `/create:sk-skill` pre-bound candidate, then run existing sk-doc/deep-improvement gates. Direct canonical auto-creation should stay rejected.

Claim 2 is a small clarification packet, not a high-value new mechanism: document a compact cross-source arbitration matrix that preserves existing canonical continuity order and Logic-Sync escalation. Do not replace Logic-Sync with blind “PRD always wins” precedence.

### METRICS
newInfoRatio: 0.42
novelty: Both claims survive only in narrowed form; the strongest novelty is auto-discovery from run learnings, while precedence mostly consolidates rules spec-kit already has.
status: complete
focus: RQ-V4 adversarial — learning & knowledge (auto-skills + knowledge precedence)

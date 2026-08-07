# Research Brief A6 — Skill-advisor routing + trigger phrases for GPT executors

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the analysis.

## Measured problem (packet 033)

On vague natural-language asks ("what's the best way to handle rate limiting…",
"can you make this agent better?"), ALL executors — Claude included — answered
inline instead of routing to the intended deep-loop workflow (benchmark cells
ACB-003, IMB-003, RSB-004: partial on all three legs). Routing to the heavy
machinery only happens when the ask NAMES the workflow. If we want vague asks
to route (or to at least OFFER the workflow), the routing layer must carry
that, because no executor does it from instinct.

## Your task

Read (repo-root relative):
1. `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
   — the advisor's scoring entry (skim for how trigger phrases/keywords score).
2. One deep-loop SKILL.md keyword surface:
   `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md` — its
   trigger/keyword sections (INTENT_MODEL, trigger phrases, keywords comments).
3. `CLAUDE.md` GATE 2 (SKILL ROUTING) — the ≥0.8 confidence rule and its
   fallbacks.

Diagnose: would the advisor score ≥0.8 for the three measured vague prompts
above? Which tokens in those prompts match which trigger phrases? Is the
confidence threshold the binding constraint, or the phrase inventory? Does
anything instruct an executor to OFFER the workflow at sub-threshold confidence
("this looks council-shaped — want a full deliberation?")? Identify the
cheapest change that converts vague-ask inline answers into either correct
routing or an explicit offer.

## Output contract (strict)

Markdown, no preamble, no questions. Sections:

### FINDINGS — numbered, each citing `file:line`. Mechanism-level.

### PROPOSALS — numbered. Each: **Tag** (simplify|optimize|re-approach),
**Change** (file + concrete edit), **Expected effect** (cells ACB-003, IMB-003,
RSB-004 — full routing or explicit offer), **Effort** (S|M|L), **Risk**
(over-routing casual questions to heavy workflows).

3-6 findings, 3-5 proposals.

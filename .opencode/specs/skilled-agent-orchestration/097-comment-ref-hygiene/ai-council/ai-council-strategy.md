# AI Council Strategy — Comment Hygiene Enforcement Gap

## Purpose

Diagnose why the three-tier comment-hygiene enforcement stack (AGENTS.md rule, runtime hooks/plugin, git pre-commit gate) fails to prevent forbidden code comments when the AGENTS.md rule is absent, and produce concrete per-runtime fixes.

## Task Framing

Packet 119/002 built passive + active enforcement. Test evidence shows every runtime self-corrects WITH the AGENTS.md rule in context but fails WITHOUT it — even though the prompt-time hooks/plugin demonstrably fire. The question is whether the hook/plugin injection path actually carries the hygiene rule content, or only a pointer, and what minimal change makes the hooks enforce independently of AGENTS.md.

## Selected Strategy Lenses (4 seats)

| Seat | Lens | Temp | Mandate |
| --- | --- | --- | --- |
| seat-001 | Critical (Security/Correctness) | 0.2 | Prove the exact injection-path failure with code evidence; identify what content reaches the model vs what is claimed |
| seat-002 | Holistic (Systems/Architecture) | 0.4 | Map the full hook architecture across 4 runtimes; locate the single architectural seam where the rule must be injected |
| seat-003 | Pragmatic (Effort) | 0.3 | Rank fixes by coverage-per-effort; identify the smallest change that closes the largest gap |
| seat-004 | Devil's Advocate (Critical) | 0.2 | Challenge whether hooks can ever enforce reliably; argue the AGENTS.md-only / pre-commit-only position |

## Executor / Vantage Targets

Dispatch mode: **sequential inline deliberation within a single Opus 4.8 context** (the council was invoked directly, but the runtime presents one agent context; no parallel Task dispatch and no external CLI execution occurred). All vantage targets are therefore **simulated reasoning lenses**, honestly labeled. No external AI system (cli-codex / cli-gemini / cli-claude-code) was actually invoked. Findings are grounded in direct reads of the actual implementation, not model intuition.

## Evidence Inputs (read before deliberation)

- `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` — the constitutional entry (rule + forbidden table)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` — advisor brief renderer (the actual injected string)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts` — brief producer pipeline
- `.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts` — Gemini BeforeAgent hook entry
- `.opencode/skills/system-spec-kit/mcp_server/hooks/{gemini,codex,devin}/user-prompt-submit.ts` — thin shims delegating to advisor
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` — advisor scoring (constitutional = trigger map only)
- `.claude/settings.local.json`, `.gemini/settings.json` — hook registration
- `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` — the WORKING reference hook
- `002-active-enforcement-layer/{spec,plan,decision-record}.md` — ADR-001..004 (runtime write-hook gaps already accepted)

## Convergence Rule

`two-of-three-agree` (applied as majority-of-4): declare convergence when the cross-critique round produces no new high-severity finding that overturns the leading diagnosis. Round 2 only runs if seats disagree on root cause or the fix design has unresolved high-severity risk.

## Known Constraints

- This agent is scoped-write: it writes ONLY under `ai-council/**`. No code/config changes are applied; the report is a recommendation for a follow-on implementation packet.
- ADR-001..004 already establish that OpenCode/Codex/Gemini/Devin have NO write-time (post-file-write) hooks. The only model-visible injection surface on those runtimes is the prompt-time advisor hook (BeforeAgent / UserPromptSubmit / experimental.chat.system.transform).
- The pre-commit gate is confirmed working and is the runtime-agnostic floor.

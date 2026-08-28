---
alwaysApply: true
---

# Repository Skill Routing

Use the repository's top-level skill packet before acting; these are routing pointers, not a copy of `AGENTS.md`:

- Code changes, debugging, or implementation review: `.opencode/skills/sk-code/SKILL.md`. Let it select the surface-specific packet and verification commands.
- Deciding UI values and behavior (spacing, type, color, shadow, motion, accessibility review) for a surface being built or fixed: `.opencode/skills/sk-design/SKILL.md`.
- Design-reference extraction (measure a live site's real CSS into a Style Reference DESIGN.md): `.opencode/skills/sk-design-md-generator/SKILL.md`.
- Documentation, specs, or artifact authoring: `.opencode/skills/sk-doc/SKILL.md`; use `.opencode/skills/system-spec-kit/SKILL.md` for spec packets, continuity, and validation.
- Git, worktrees, commits, or pull requests: `.opencode/skills/sk-git/SKILL.md`.
- Prompt construction or model selection: `.opencode/skills/sk-prompt/SKILL.md`.
- Deep research, deep review, iteration, or convergence workflows: `.opencode/skills/system-deep-loop/SKILL.md` and its selected mode packet.
- Cursor delegation itself: `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md`.

Load only the packets relevant to the request, follow their verification commands, and keep scope tied to the user’s task. This file is static session context. Cursor’s `beforeSubmitPrompt` adapter is registered to call the shared advisor, but its dynamic per-turn delivery is dormant under the tested CLI build; this rule is a static complement, not a substitute for that brief.

Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.codex/AGENTS.md	129	36	20f92f3891acf45f	R1:path	Run the trigger index lookup: `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "<prompt>"` → Surface relevant context. It reads the committed index and needs no daemon
.cursor/rules/skill-routing.md	9	54	578cdeae88ca30e1	R1:path	- Code changes, debugging, or implementation review: `.opencode/skills/sk-code/SKILL.md`. Let it select the surface-specific packet and verification commands.
.cursor/rules/skill-routing.md	10	132	37a81fae9bd5369b	R1:path	- Deciding UI values and behavior (spacing, type, color, shadow, motion, accessibility review) for a surface being built or fixed: `.opencode/skills/sk-design/SKILL.md`.
.cursor/rules/skill-routing.md	11	98	18b8494cbaf5f1fe	R1:path	- Design-reference extraction (measure a live site's real CSS into a Style Reference DESIGN.md): `.opencode/skills/sk-design/sk-design-md-generator/SKILL.md`.
.cursor/rules/skill-routing.md	12	48	7c9d1733bd38576e	R1:path	- Documentation, specs, or artifact authoring: `.opencode/skills/sk-doc/SKILL.md`; use `.opencode/skills/system-spec-kit/SKILL.md` for spec packets, continuity, and validation.
.cursor/rules/skill-routing.md	12	88	7c9d1733bd38576e	R1:path	- Documentation, specs, or artifact authoring: `.opencode/skills/sk-doc/SKILL.md`; use `.opencode/skills/system-spec-kit/SKILL.md` for spec packets, continuity, and validation.
.cursor/rules/skill-routing.md	13	46	deae44543129ad4a	R1:path	- Git, worktrees, commits, or pull requests: `.opencode/skills/sk-git/SKILL.md`.
.cursor/rules/skill-routing.md	14	43	efabf6bd7f17ab18	R1:path	- Prompt construction or model selection: `.opencode/skills/sk-prompt/SKILL.md`.
.cursor/rules/skill-routing.md	15	68	09f4bb9524d79a2a	R1:path	- Deep research, deep review, iteration, or convergence workflows: `.opencode/skills/system-deep-loop/SKILL.md` and its selected mode packet.
.cursor/rules/skill-routing.md	16	29	1579a7fd1419eb24	R1:path	- Cursor delegation itself: `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md`.
.cursor/rules/skill-routing.md	25	36	20f92f3891acf45f	R1:path	Run the trigger index lookup: `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "<prompt>"` → Surface relevant context. It reads the committed index and needs no daemon
AGENTS.md	47	76	450d14c4f352f859	R1:path	**⚠️ BEFORE using ANY tool (except Gate Actions: the trigger index lookup, `.opencode/bin/skill-advisor.cjs`), you MUST pass all applicable gates below.**
AGENTS.md	65	39	c42928b8ed18686c	R1:path	1. Run the trigger index lookup: `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "<prompt>"` → Surface relevant context. It reads the committed index and needs no daemon
AGENTS.md	80	109	a289bddf5d85a277	R1:path	1. A) Primary: use the automatic Skill Advisor Hook brief already surfaced by the runtime when present. See `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md`.
AGENTS.md	81	29	338e0ff7087cead6	R1:path	2. B) Direct call: run `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"[request]"}' --format json` when no hook brief is present or when diagnosing hook behavior.
AGENTS.md	174	13	445ba651656e3b7a	R1:path	1. Run `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict`. **Require an explicit `RESULT: PASSED`.** Exit status and the absence of `FAILED` have each been wrong in both directions. The four traps an
AGENTS.md	203	87	dbda462f88987397	R1:path	| **Git (sk-git)** | Worktree setup, conventional commits and PR creation. Mechanics: `.opencode/skills/sk-git/`. |
AGENTS.md	269	47	b790dc003b5e2b0a	R1:path	Use the active runtime's own agent directory, `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.cursor/agents/`, `.pi/agents/`, `.devin/agents/` or `.hermes/agents/`, and stay with it for the workflow phase.
AGENTS.md	277	71	bc92946e7b0a4e3c	R1:path	Command and skill inventories are injected by the runtime and live in `.opencode/commands/` and each skill's `SKILL.md`. Where an order matters, it is the command's own to state.
AGENTS.md	282	26	15783d74e3938f70	R1:path	- **CLI dispatch:** read `.opencode/skills/cli-external-orchestration/cli-X/SKILL.md` before composing any `cli-X` prompt.
~~~~

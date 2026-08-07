# Deep-Research Iteration 002: Agent surface

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

Low-blast, read-only research: I’ll first load only the relevant spec/skill context, then verify the agent surfaces and conversion pipeline from the actual files before making a recommendation.
SKILL ROUTING: advisor recommends `deep-context` (confidence 0.868, uncertainty 0.16), with adjacent deep-loop skills also above threshold. I’ll load `deep-context` for read-only context workflow guidance, but keep the user’s hard constraint: no file writes.
I found the relevant deep-loop context skill and will follow it as a read-only evidence sweep. Next I’m reading the established context report in full and the exact agent/mirror surfaces the recommendation depends on.
The baseline confirms the agent decision is explicitly the scoping gate: keeping names is described as low repoint, while unifying to `@deep-loop` expands the rename surface across all 15 mirrors and framework docs. I’m now checking whether the Codex mirrors are generated and where framework docs reference the agent names.
The Codex mirrors are not simple hand-only markdown copies: the repo has a mirror-sync gate that extracts `developer_instructions` from `.codex/agents/*.toml` and compares it with the `.opencode` canonical body, but the searches so far show a verifier, not a generator that rewrites TOML bodies. That means direct TOML edits can persist, but should be treated as derived-mirror edits that must remain synchronized with canonical `.opencode` and `.claude` copies.
One constraint needs a narrow caveat: `.claude/skills`, `.codex/skills`, and `.claude/commands` are symlinks to `.opencode`, but `.codex/commands` is not a symlink in this checkout from `readlink`; the agent directories are real directories as expected. I’ll avoid using that to alter the recommendation unless more evidence explains the Codex command exception.
The runtime skill itself states the intended convention: agents are real three-file mirrors and shared command/prompt/skill directories are symlinked, so a missing Codex command symlink looks like packaging drift rather than a reason to rename agents. I’m checking the Codex prompt surface before closing that caveat.
The Codex command surface is `.codex/prompts -> ../.opencode/commands`, not `.codex/commands`; so the shared command-surface constraint holds conceptually, with a runtime-specific directory name.
The shared loop YAML dispatches context/research/review by bare agent names with canonical `.opencode/agents/<name>.md` pointers. Improvement is different: the agent exists for Lane A proposal generation and the other lanes are explicitly script/model based, so a unified `@deep-loop` would not even match all modes cleanly.
The only active mirror implementation I found is verification-oriented: it treats `.codex/agents/*.toml` as an extractable mirror format, compares bodies, and fails commits/PRs on drift. I did not find a repo-local converter that regenerates TOML from `.opencode/agents/*.md`.
I’m running the existing read-only mirror-sync checker to confirm current agent mirrors are actually aligned before using them as a migration invariant.
One extra risk surfaced: `.codex/agents/deep-context.toml` exists, but `.codex/config.toml` does not register a `[agents.deep-context]` block in the lines I read. That is separate from the skill-merge decision, but a later runtime-surface angle should verify whether Codex discovers unregistered TOML files or relies only on config blocks.
The prior context report’s `speckit` reference warning is real: plan/complete workflows point at the deep-research agent file, not just the skill folder. If agent names stay stable those refs can stay stable; if unified, they become extra migration targets.
**Decision**
Keep the five native agent names: `@deep-context`, `@deep-research`, `@deep-review`, `@deep-improvement`, and `@ai-council`. Merge the five skills into `deep-loop-workflows`, but treat these agents as stable per-mode runtime seats and only repoint their internal skill-path references to the new skill package.

This is the lowest-risk option and best matches the byte-identical-artifact acceptance bar. The existing `ai-council` agent already proves that skill identity and agent identity are allowed to differ: agent `ai-council` maps to skill `deep-ai-council` today, so a skill rename does not force an agent rename.

**Why This Wins**
The current architecture dispatches mode-specific native seats by name. `deep_start-context-loop_auto.yaml` uses `agent: deep-context` and `agent_file: ".opencode/agents/deep-context.md"` at lines 98-100. Research and review do the same for `deep-research` and `deep-review` at `deep_start-research-loop_auto.yaml:81-83` and `deep_start-review-loop_auto.yaml:69-71`.

The five agents are not interchangeable wrappers. Their permissions and artifacts are materially different:
- `deep-context` is read-only and returns findings only; host writes state (`.opencode/agents/deep-context.md:1-23`, `33-37`).
- `deep-research` writes research packet artifacts and can use `WebFetch` (`.opencode/agents/deep-research.md:1-22`, `81-90`).
- `deep-review` writes review artifacts, forbids web fetch, and carries P0/P1/P2 doctrine (`.opencode/agents/deep-review.md:1-22`, `38-48`, `190-199`).
- `deep-improvement` is proposal-only and must not score or promote (`.opencode/agents/deep-improvement.md:1-20`, `22-46`).
- `ai-council` is scoped-write planning with `ai-council/**` persistence and deep-mode refs to `deep-ai-council` paths (`.opencode/agents/ai-council.md:1-23`, `35-49`, `397`, `424`, `718`).

A unified `@deep-loop` would either need union permissions, which weakens per-mode safety, or an internal mode router with mode-specific permission emulation, which is behavior work. That conflicts with the mission’s structure/docs reorg constraint.

**Blast Radius**
Keep names:
- Touch the existing 15 mirror files, but do not rename them.
- Repoint stale skill paths inside those bodies from the old five skill folders to `deep-loop-workflows`.
- Leave command `agent:` names stable for context/research/review YAML.
- Leave Speckit `agent_file: "[runtime_agent_path]/deep-research.md"` refs stable in plan/complete workflows (`speckit_plan_auto.yaml:276-279`, `speckit_plan_confirm.yaml:282-285`, `speckit_complete_auto.yaml:300-303`, `speckit_complete_confirm.yaml:309-312`).
- Update framework prose where it names the old skill rather than the agent, especially `CLAUDE.md` and `AGENTS.md` lines 365-369 where `@deep-improvement` says “via `deep-improvement`”.

Rename to unified `@deep-loop`:
- Rename/consolidate 15 agent mirror files.
- Update `.codex/config.toml` registered agent blocks for at least `ai-council`, `deep-improvement`, `deep-research`, and `deep-review` (`.codex/config.toml:5-31`).
- Update orchestrator routing tables across `.opencode`, `.claude`, and `.codex` mirrors (`.opencode/agents/orchestrate.md:178-188`, `.claude/agents/orchestrate.md:167-177`, `.codex/agents/orchestrate.toml:172-182`).
- Update loop YAML `agent:` and `agent_file:` fields, Speckit `agent_file` refs, `CLAUDE.md` / `AGENTS.md` agent lists, and internal references like native `@deep-research` as council vantage.
- Risk behavior drift because one agent would need to encode five incompatible permission and output contracts.

**Codex Mirror Finding**
`.codex/*.toml` mirrors should be treated as derived but manually maintained in this repo. The `# Converted from:` header records provenance, but I found no checked-in generator that rewrites TOML from `.opencode/agents/*.md`.

The active mechanism is a verifier:
- `mirror-sync-verify.cjs` defines `.opencode`, `.claude`, and `.codex` mirror templates and extracts Codex `developer_instructions` from TOML (`mirror-sync-verify.cjs:17-20`, `41-66`).
- It compares extracted bodies and reports missing/drift/in-sync status (`mirror-sync-verify.cjs:158-224`).
- `check-agent-mirror-sync.cjs` states agents are authored once under `.opencode/agents/<name>.md` and mirrored to `.claude` and `.codex`; it fails if mirrors drift (`check-agent-mirror-sync.cjs:6-11`, `73-134`).
- Pre-commit and CI wire that checker in (`.opencode/hooks/pre-commit:36-55`, `.github/workflows/agent-mirror-sync.yml:14-38`).
- Running `node .opencode/skills/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` returned: `agent-mirror-sync: 12 agent(s) checked — all mirrors in sync — OK`.

So Codex `developer_instructions` repoints will survive if edited, but the safe implementation rule is: edit the canonical `.opencode` agent body, mirror the equivalent body change into `.claude` and `.codex`, and run the sync checker. Do not edit only `.codex/*.toml`.

**Concrete Implementation Rule**
Preserve these filenames and frontmatter/TOML names:
- `.opencode/agents/{deep-context,deep-research,deep-review,deep-improvement,ai-council}.md`
- `.claude/agents/{deep-context,deep-research,deep-review,deep-improvement,ai-council}.md`
- `.codex/agents/{deep-context,deep-research,deep-review,deep-improvement,ai-council}.toml`

Change only old skill-folder references inside those files:
- `deep-ai-council` paths in `ai-council` are the heaviest repoint set.
- `deep-research`, `deep-review`, `deep-context`, and `deep-improvement` self-skill references become mode references under `deep-loop-workflows`.
- Keep references to out-of-set skills, such as `sk-code-review`, unchanged.

**Risks**
The exact path edits depend on the final `deep-loop-workflows` internal layout. A flat legacy-subtree layout makes this mostly single-prefix replacement; a `modes/<mode>/` layout requires deeper path rewrites.

`.codex/agents/deep-context.toml` exists, but `.codex/config.toml` lines 5-31 do not show a `[agents.deep-context]` registration. That is not a reason to rename; it is a runtime-surface follow-up to verify whether Codex discovers unregistered TOML files or relies on config blocks.

The runtime skill says shared commands/prompts/skills are symlinked and agents are real mirrors (`deep-loop-runtime/SKILL.md:253-261`). In this checkout, `.codex/prompts` is the symlink to `.opencode/commands`, not `.codex/commands`; treat that as runtime naming drift, not a blocker for the agent-name decision.

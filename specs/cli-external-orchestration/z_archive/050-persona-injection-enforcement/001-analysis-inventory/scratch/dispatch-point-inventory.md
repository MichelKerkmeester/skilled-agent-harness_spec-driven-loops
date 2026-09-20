---
trigger_phrases: []
---
## Context Package: CLI External Orchestration Persona-Injection Inventory

### Memory Context
- Record #5: Feature Specification: Terminal-Proof Discipline and Directive Injection (`specs/agents/001-terminal-proof-discipline/spec.md`) — Enforces terminal-proof discipline and directive injection across agents.
- Record #3: Implementation Summary: Terminal-Proof Discipline and Directive Injection (`specs/agents/001-terminal-proof-discipline/implementation-summary.md`) — Summarizes injection protocols and verification criteria.
- Record #4: Implementation Plan: Terminal-Proof Discipline and Directive Injection (`specs/agents/001-terminal-proof-discipline/plan.md`) — Outlines directive handling and agent execution constraints.
- Trigger Match: Evaluated `memory_match_triggers` for CLI persona injection and prompt packaging; indexed records confirm previous work focused on directive injection into agent personas.

---

### Codebase Findings

#### A. AGENT ROSTER
The canonical agent definitions live at `.opencode/agents/*.md` (`.opencode/agents/orchestrate.md:30`). Each serves specific dispatch intents:

1. `@ai-council` (`.opencode/agents/ai-council.md:1-23`): Multi-strategy planning architect utilizing diverse reasoning lenses and multi-round deliberation; scoped-write access restricted exclusively to `ai-council/**` artifacts. Intent: Multi-strategy planning and architecture synthesis (`@orchestrate` priority 3; `.opencode/agents/orchestrate.md:75`).
2. `@code` (`.opencode/agents/code.md:1-30`): Application-code implementation specialist delegating stack detection to `sk-code`; enforces `Depth: 1` caller-restriction gate. Intent: Implementation and testing (`@orchestrate` priority 7; `.opencode/agents/orchestrate.md:79`).
3. `@context` (`.opencode/agents/context.md:1-30`): Read-only context retrieval specialist; canonical continuity recovery (`handover.md` -> `_memory.continuity` -> spec docs) and Context Package synthesis. Intent: Codebase exploration, file discovery, pattern discovery, context loading (`@orchestrate` priority 1; `.opencode/agents/orchestrate.md:73`).
4. `@debug` (`.opencode/agents/debug.md:1-30`): User-invoked fresh-perspective debugger operating with isolated context and a 5-phase root-cause methodology. Intent: Root-cause debugging when `failure_count >= 3` (`@orchestrate` priority 8; `.opencode/agents/orchestrate.md:80`).
5. `@deep-alignment` (`.opencode/agents/deep-alignment.md:1-30`): LEAF iterative conformance-audit agent executing per-lane checks against named authority standards with verify-first discipline. Intent: Standards alignment loop execution (`.opencode/skills/system-deep-loop/mode-registry.json`).
6. `@deep-improvement` (`.opencode/agents/deep-improvement.md:1-30`): Proposal-only mutator for bounded candidate generation under evaluator-first rules. Intent: Agent improvement candidate mutation under `/deep:agent-improvement` (`.opencode/agents/orchestrate.md:163`).
7. `@deep-research` (`.opencode/agents/deep-research.md:1-30`): Autonomous iteration research agent executing single research cycles with externalized JSONL state. Intent: Evidence gathering and iterative technical investigation (`@orchestrate` priority 2; `.opencode/agents/orchestrate.md:74`).
8. `@deep-review` (`.opencode/agents/deep-review.md:1-30`): LEAF iterative code-audit agent executing single-dimension passes with P0/P1/P2 severity findings. Intent: Deep iterative code-quality loops under `/deep:review` (`@orchestrate` priority 6; `.opencode/agents/orchestrate.md:78`).
9. `@design` (`.opencode/agents/design.md:1-26`): Design specialist routing through `sk-design` parent hub (interface/foundations/motion/audit/md-generator). Intent: UI/visual design, design systems, style extraction (`.opencode/agents/design.md:23-26`).
10. `@markdown` (`.opencode/agents/markdown.md:1-30`): Template-first markdown and documentation executor; handles `/create:*` commands and scoped spec docs. Intent: Documentation generation and component authoring (`@orchestrate` priority 4; `.opencode/agents/orchestrate.md:76`).
11. `@orchestrate` (`.opencode/agents/orchestrate.md:1-39`): Senior orchestration agent with task decomposition, strategic delegation, quality evaluation, and delivery synthesis authority. Intent: Multi-agent coordination and top-level execution (`.opencode/agents/orchestrate.md:20-28`).
12. `@prompt-improver` (`.opencode/agents/prompt-improver.md:1-30`): Read-only prompt escalation specialist executing framework selection, DEPTH thinking, and CLEAR validation. Intent: Deep-path prompt optimization and package construction (`.opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md:90-108`).
13. `@review` (`.opencode/agents/review.md:1-30`): Read-only code review specialist providing quality scoring (0-100), pattern validation, and security assessment. Intent: Code review, security audits, pre-merge quality gates (`@orchestrate` priority 5; `.opencode/agents/orchestrate.md:77`).

---

#### B. DISPATCH POINTS INVENTORY
Across the hub, six modes, and `sk-prompt`, the following dispatch prompt composition and CLI invocation points exist:

1. **Hub (`cli-external-orchestration`)**:
   - `.opencode/skills/cli-external-orchestration/SKILL.md:44-48`: Hub compiled routing entry point (`node .opencode/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "<task>"`).
   - `.opencode/skills/cli-external-orchestration/SKILL.md:57-64`: Stage 1 router resolution mapping to `mode-registry.json`.
   - `.opencode/skills/cli-external-orchestration/SKILL.md:169`: Constitutional rule mandating reading target mode's `SKILL.md` before composing any dispatch prompt.
   - `.opencode/skills/cli-external-orchestration/mode-registry.json:17-198`: Mode definitions and tool surface declarations for all 6 modes.
   - `.opencode/skills/cli-external-orchestration/ROUTER.md:1-95`: Stage 2 surface router mapping dispatch intents to leaf sets.

2. **`cli-opencode` Mode**:
   - `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:172-174`: Default invocation shape (`opencode run --model deepseek/deepseek-v4-pro --variant high --format json --dir <repo-root> "<prompt>"`).
   - `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:182`: Non-interactive stdin redirection requirement (`</dev/null`).
   - `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:184`: Slash-command dispatch flag (`--command <family>/<name>`).
   - `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:230`: Rule 3 pinning model/variant/format/dir and forbidding top-level `--agent`.
   - `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:234-237`: Rule 7 canonical 3-tier prompt construction requirement.
   - `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:242-244`: Rules 12-14 for Code Standards Loading, Design Standards Loading, and `DESIGN_DISPATCH_MANIFEST v1` prompt injection.
   - `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:82-90`: Invocation pattern for `--agent <slug>`.
   - `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:221-233`: Agent routing matrix routing subagents via `--agent orchestrate` or prompt body.
   - `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:236-258`: `As @<agent>:` inline prompt-prefix convention.
   - `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:260-279`: Multi-agent orchestration pattern via `--agent orchestrate`.
   - `.opencode/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md:30-450`: Numbered templates (1-11, 14-16) for composing `opencode run` dispatch prompts.

3. **`cli-claude-code` Mode**:
   - `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:210-215`: Default non-interactive invocation (`claude -p "<prompt>" --model claude-sonnet-4-6 --output-format text 2>&1`).
   - `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:231-246`: Agent delegation mapping task types to `--agent <name>`.
   - `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:267`: Rule 6 requiring routing to `--agent <name>`.
   - `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:269-274`: Rule 8 canonical 3-tier prompt construction requirement.
   - `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:275-277`: Rules 9-11 for Code Standards Loading, Design Standards Loading, and `DESIGN_DISPATCH_MANIFEST v1` prompt injection.
   - `.opencode/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md:70-90`: Non-interactive CLI command patterns with `--agent <name>`.
   - `.opencode/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md:118-262`: Catalog and prompt examples for 12 agents.
   - `.opencode/skills/cli-external-orchestration/cli-claude-code/assets/prompt-templates.md:25-350`: Templates 1-12 for composing `claude -p` prompts.

4. **`cli-codex` Mode**:
   - `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:172-174`: Process construction delegation to `../../system-deep-loop/runtime/scripts/fanout-run.cjs`.
   - `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:208-215`: Default non-interactive invocation (`codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "<prompt>"`).
   - `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:237-250`: Agent delegation via `-p <profile>` referencing `$CODEX_HOME/<name>.config.toml`.
   - `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:276-280`: Rule 10 canonical 3-tier prompt construction requirement.
   - `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:280`: Rule 11 prohibiting injection of user-level `~/.codex/AGENTS.md` voice rules.
   - `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:281-283`: Rules 12-14 for Code Standards Loading, Design Standards Loading, and `DESIGN_DISPATCH_MANIFEST v1` prompt injection.
   - `.opencode/skills/cli-external-orchestration/cli-codex/references/agent-delegation.md:70-92`: Profile-based delegation patterns via `codex exec -p <profile>`.
   - `.opencode/skills/cli-external-orchestration/cli-codex/assets/prompt-templates.md:20-320`: Templates 1-11 for composing `codex exec` prompts.

5. **`cli-cursor` Mode**:
   - `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md:178-182`: Process construction delegation to `../../system-deep-loop/runtime/scripts/fanout-run.cjs`.
   - `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md:214-220`: Default non-interactive invocation (`cursor-agent -p "<prompt>" --output-format text --model composer-2.5 --auto-review --sandbox enabled`).
   - `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md:243-247`: Delegation note distinguishing internal subagents (`~/.cursor/skills-cursor/`) from CLI execution modes.
   - `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md:305-309`: Rule 10 canonical 3-tier prompt construction requirement.
   - `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md:309`: Rule 11 prohibiting user-level voice injection; notes automatic ingestion of `.cursor/rules/*.md`, `AGENTS.md`, and `CLAUDE.md`.
   - `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md:310-312`: Rules 12-14 for Code Standards Loading, Design Standards Loading, and `DESIGN_DISPATCH_MANIFEST v1` prompt injection.
   - `.opencode/skills/cli-external-orchestration/cli-cursor/references/agent-delegation.md:68-81`: Invocation pattern via `--mode plan|ask` and `--model`.
   - `.opencode/skills/cli-external-orchestration/cli-cursor/assets/prompt-templates.md:20-300`: Templates 1-10 for composing `cursor-agent -p` prompts.

6. **`cli-devin` Mode**:
   - `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:170-174`: Process construction delegation to `../../system-deep-loop/runtime/scripts/fanout-run.cjs`.
   - `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:206-212`: Default non-interactive invocation (`devin -p --model swe --permission-mode accept-edits -- "<prompt>"`).
   - `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:235-246`: Subagent delegation via `run_subagent` and subagent profiles (`subagent_explore`, `subagent_general`).
   - `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:341-345`: Rule 10 canonical 3-tier prompt construction requirement.
   - `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:345`: Rule 11 prohibiting injection of user-level voice rules from `~/.config/devin/`.
   - `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:346-348`: Rules 12-14 for Code Standards Loading, Design Standards Loading, and `DESIGN_DISPATCH_MANIFEST v1` prompt injection.
   - `.opencode/skills/cli-external-orchestration/cli-devin/references/agent-delegation.md:72-92`: Prompt pattern requesting subagents in natural language.
   - `.opencode/skills/cli-external-orchestration/cli-devin/references/agent-delegation.md:166-257`: Custom `AGENT.md` profile format and import claims.
   - `.opencode/skills/cli-external-orchestration/cli-devin/assets/prompt-templates.md:20-320`: Templates 1-11 for composing `devin -p` prompts.

7. **`cli-pi` Mode**:
   - `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:171-175`: Process construction delegation to `../../system-deep-loop/runtime/scripts/fanout-run.cjs`.
   - `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:188-195`: Headless modes (`pi -p` print mode, `--mode json`, `--mode rpc`, `--tools read,grep,find,ls`).
   - `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:210-212`: Prompt construction and spec folder handoff rules.
   - `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:234`: Rule 6 canonical 3-tier prompt construction requirement.
   - `.opencode/skills/cli-external-orchestration/cli-pi/references/agent-delegation.md:41-83`: Core tool boundary vs community `pi-subagents` package and `.pi/agents/**/*.md` project mirrors.
   - `.opencode/skills/cli-external-orchestration/cli-pi/references/agent-delegation.md:86-130`: Conductor model and structured request shape.
   - `.opencode/skills/cli-external-orchestration/cli-pi/assets/prompt-templates.md:20-300`: Templates 1-10 for composing `pi -p` prompts.

8. **`sk-prompt` Hub & Sub-Packets**:
   - `.opencode/skills/sk-prompt/SKILL.md:36-40`: Compiled routing dispatch (`node .opencode/bin/compiled-route.cjs --hub sk-prompt --prompt "<task>"`).
   - `.opencode/skills/sk-prompt/SKILL.md:48-52`: Mode discriminator (`prompt-improve` vs `prompt-models`).
   - `.opencode/skills/sk-prompt/sk-prompt-models/SKILL.md:1-50`: Model-craft lookup for small-model CLI dispatch.
   - `.opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md:15-110`: Canonical 3-tier precedence rule, 7 framework selection table, CLEAR 5-question pre-dispatch checklist, and Tier 3 deep path escalation.
   - `.opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md:125-139`: Mirror synchronization guard (`check-prompt-quality-card-sync.sh`) asserting delegating cards in all cli-* skills link to this canonical asset.
   - `.opencode/skills/sk-prompt/sk-prompt-improve/SKILL.md:1-50`: DEPTH/CLEAR prompt optimization engine for Tier 3 escalation.

---

### Pattern Analysis

#### C. NATIVE-VS-INLINE CLASSIFICATION PER MODE
Evaluation of whether the CLI natively loads the resolved agent persona on actual non-interactive dispatch paths:

| Mode | Dispatch Surface | Natively Loads Resolved Persona? | Evidence & Details |
| --- | --- | --- | --- |
| **`cli-claude-code`** | `claude -p "<prompt>" --agent <name>` | **YES** | `.opencode/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md:53-56, 94-110`: Anthropic CLI natively resolves `--agent <name>` to `.claude/agents/<name>.md`, loading system prompt and permissions. |
| **`cli-claude-code`** | `claude -p "<prompt>"` (no `--agent`) | **NO** | Runs default unspecialized agent; no persona attached (`.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:208`). |
| **`cli-opencode`** | `opencode run "<prompt>"` | **NO** | Default agent runs; no specialist persona loaded (`.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:174`). |
| **`cli-opencode`** | `opencode run --agent <slug>` (subagent) | **NO (REJECTED)** | `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:174, 198-203`: OpenCode CLI rejects `--agent general` and all `mode: subagent` files (`context`, `markdown`, `review`, `debug`, `ai-council`) at top-level `opencode run`. Only `orchestrate` and `plan` succeed. |
| **`cli-opencode`** | `opencode run --agent orchestrate` -> Task tool | **YES (via Subagent)** | `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:223-230, 260-279`: Primary agent dispatches subagents internally via Task tool, which loads `.opencode/agents/<name>.md`. |
| **`cli-opencode`** | `As @<agent>:` prompt prefix | **NO (INLINE PROMPT ONLY)** | `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:236-250`: Doc-specified convention; relies on the model reading the prompt text, not engine-level system prompt injection. |
| **`cli-codex`** | `codex exec -p <profile> "<prompt>"` | **NO (CONFIG ONLY)** | `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:250`; `cli-codex/references/agent-delegation.md:94-109`: `-p` loads `$CODEX_HOME/<name>.config.toml` (sandbox mode, reasoning effort, model), NOT a system prompt or agent persona. |
| **`cli-codex`** | `codex exec "<prompt>"` | **NO** | Attaches no profile or persona (`.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:208-215`). |
| **`cli-codex`** | `.codex/agents/*.toml` | **NO (TUI ONLY)** | `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:250`; `cli-codex/references/agent-delegation.md:108`: Persona TOML files are read strictly by the interactive multi-agent TUI (`codex`), NOT by `codex exec`. |
| **`cli-cursor`** | `cursor-agent -p "<prompt>"` | **NO** | `.opencode/skills/cli-external-orchestration/cli-cursor/references/agent-delegation.md:28-30, 66`: Cursor CLI has no `--agent` or `-p <profile>` flag for personas. |
| **`cli-cursor`** | `cursor-agent -p --mode plan\|ask` | **NO** | `.opencode/skills/cli-external-orchestration/cli-cursor/references/agent-delegation.md:86-92`: Sets read-only execution constraints, not specialized agent personas. |
| **`cli-cursor`** | `.cursor/rules/*.md`, `AGENTS.md` | **YES (GENERAL RULES ONLY)** | `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md:248-250, 309`: Auto-loads global workspace rules (`skill-routing.md`), but cannot load role-specific agent personas (`@review`, `@debug`). |
| **`cli-devin`** | `devin -p -- "<prompt>"` | **NO** | `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:206-212`: Accepts `--model` and `--permission-mode`; has no CLI flag for agent personas. |
| **`cli-devin`** | `run_subagent` tool inside session | **YES (BUILT-IN/AGENT.MD)** | `.opencode/skills/cli-external-orchestration/cli-devin/references/agent-delegation.md:107-134, 166-246`: Dispatches `subagent_explore`, `subagent_general`, or custom `.devin/agents/[name]/AGENT.md` when invoked via tool call. |
| **`cli-devin`** | `.claude/agents/*.md` auto-import claim | **NO (DOC MISMATCH)** | `.opencode/skills/cli-external-orchestration/cli-devin/references/agent-delegation.md:249-256` claims `.claude/agents/*.md` files become subagent profiles automatically; installed Devin CLI on non-interactive `-p` execution does not inject them without explicit prompt guidance or custom subagent invocation. |
| **`cli-pi`** | `pi -p "<prompt>"` | **NO** | `.opencode/skills/cli-external-orchestration/cli-pi/references/agent-delegation.md:41-56`: Core Pi has 7 basic tools and no built-in agent persona system. |
| **`cli-pi`** | Community `pi-subagents` + `.pi/agents/` | **NO (NON-CORE / UNINSTALLED)** | `.opencode/skills/cli-external-orchestration/cli-pi/references/agent-delegation.md:61-83`: Requires third-party npm package; not loaded during standard `pi -p` dispatches. |

---

#### D. GAP: UNPROTECTED DISPATCH PATHS
The following dispatch paths currently attach **NO persona**:
1. `cli-opencode`: Standard `opencode run "<prompt>"` (all non-orchestrate dispatches).
2. `cli-opencode`: Slash-command execution via `opencode run --command <family>/<name>`.
3. `cli-codex`: All `codex exec "<prompt>"` dispatches, including `-p <profile>` (which sets only sandbox/effort TOML config, not persona prompt) and `codex exec review`.
4. `cli-cursor`: All `cursor-agent -p "<prompt>"` dispatches (default, `--mode plan`, `--mode ask`).
5. `cli-devin`: All top-level `devin -p -- "<prompt>"` dispatches (the root agent receives only the raw task prompt).
6. `cli-pi`: All headless `pi -p "<prompt>"`, `pi --mode json`, and `pi --mode rpc` dispatches.
7. `cli-claude-code`: Standard `claude -p "<prompt>"` when `--agent` is omitted.
8. Shared deep-loop runtime (`../../system-deep-loop/runtime/scripts/fanout-run.cjs`): Lineage fan-out invocations for `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, and `cli-opencode` construct command-lines passing only raw task prompts with zero agent persona injection.

---

#### E. PRECEDENTS FOR REUSE
Existing persona- and standards-injection patterns in the repository that provide proven blueprints:

1. **`DESIGN_DISPATCH_MANIFEST v1` inline payload pattern** (`.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:348`, `cli-opencode/SKILL.md:244`, `cli-claude-code/SKILL.md:277`, `cli-codex/SKILL.md:283`, `cli-cursor/SKILL.md:312`):
   - Inlines a structured manifest (`skDesignLoaded`, `register`, `workflowModes`, `dials`, `loadedFiles`, `proofDemandBack`) into the prompt payload because external child CLIs cannot resolve skill paths by reference.
2. **Code Standards Loading & Design Standards Loading rules** (`.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:242-243`, `cli-claude-code/SKILL.md:275-276`, `cli-codex/SKILL.md:281-282`, `cli-cursor/SKILL.md:310-311`, `cli-devin/SKILL.md:346-347`):
   - Instructs the child session to load the root skill (`sk-code` or `sk-design`), detect the surface/mode, and apply required verification gates before returning completion claims.
3. **`cli-claude-code` `--agent <name>` native parameter** (`.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:231-246, 267`; `cli-claude-code/references/agent-delegation.md:68-90`):
   - Direct CLI parameter mapping cleanly to disk personas at `.claude/agents/<name>.md`.
4. **`cli-cursor` `.cursor/rules/*.md` and `AGENTS.md` auto-import** (`.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md:248-250, 309`):
   - Harnesses native engine rule ingestion from `.cursor/rules/skill-routing.md` for workspace-level guidance.
5. **`cli-codex` `.codex/agents/*.toml` TUI pattern** (`.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:250`; `cli-codex/references/agent-delegation.md:108`):
   - Defines structured agent roles and tool permissions in TOML schema for interactive mode.
6. **`cli-opencode` `.opencode/agents` subagent note & `As @<agent>:` convention** (`.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:174, 198-203`; `cli-opencode/references/agent-delegation.md:236-250`):
   - Documents the structural primary-vs-subagent distinction and provides the `As @<agent>:` prefix blueprint.
7. **Native Persona Loading Protocol in `@orchestrate`** (`.opencode/agents/orchestrate.md:134-144`):
   - Standardizes reading the target agent definition file (`.opencode/agents/<name>.md`) and embedding its contents directly into the task prompt before delegating to a general worker.

---

#### F. SK-PROMPT OWNERSHIP
The prompt construction pipeline is owned hierarchically by the following assets:

1. **`sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` (`.opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md:1-147`)** — **PRIMARY OWNER**:
   - Canonical single source of truth for all CLI prompt packaging across the repo.
   - Defines the 3-tier precedence protocol: Tier 1 Fast Path (`cli-prompt-quality-card.md:84-86`), Tier 2 Model Override (`cli-prompt-quality-card.md:87-89`), and Tier 3 Deep Path escalation to `@prompt-improver` (`cli-prompt-quality-card.md:90-108`).
   - Defines prompt arrangement structure (`task`, `context`, `constraints`, `output`, `verification`; `cli-prompt-quality-card.md:75`).
   - Enforces synchronization across all 6 thin delegating cards via `check-prompt-quality-card-sync.sh` (`cli-prompt-quality-card.md:125-139`).
   - Must be updated to include the canonical persona-injection step in Tier 1 and Tier 2 prompt construction.
2. **`sk-prompt/sk-prompt-models/SKILL.md` (`.opencode/skills/sk-prompt/sk-prompt-models/SKILL.md:1-50`)**:
   - Manages small-model prompt profiles, model-specific scaffolds, and framework overrides.
3. **`sk-prompt/SKILL.md` (`.opencode/skills/sk-prompt/SKILL.md:1-151`)**:
   - Parent hub routing prompt engineering queries to `prompt-improve` and `prompt-models`.
4. **`sk-prompt/sk-prompt-improve/SKILL.md` (`.opencode/skills/sk-prompt/sk-prompt-improve/SKILL.md:1-50`)**:
   - Owns the 7-framework, DEPTH-thinking, and CLEAR-scoring engine invoked when Tier 3 escalation packages prompts through `@prompt-improver`.
5. **Thin Delegating Cards in all 6 CLI modes**:
   - `cli-opencode/assets/prompt-quality-card.md:1-50`
   - `cli-claude-code/assets/prompt-quality-card.md:1-50`
   - `cli-codex/assets/prompt-quality-card.md:1-50`
   - `cli-cursor/assets/prompt-quality-card.md:1-50`
   - `cli-devin/assets/prompt-quality-card.md:1-50`
   - `cli-pi/assets/prompt-quality-card.md:1-50`
   - Each card delegates framework selection and CLEAR checks directly to the canonical card in `sk-prompt-models`.

---

### Nested Dispatch Status
- Status: `_No sub-agents dispatched (policy)_`
- Boundary: Read-only context retrieval executed directly using allowed read-only inspection tools (`read`, `find_file_by_name`, `grep`, `mcp_call_tool`). No file mutations, sub-agent dispatches, or shell execution were attempted.
- Note: All findings and citations are verified directly against disk.

---

### Gaps & Unknowns
- Gap: None. All 13 agent definitions in `.opencode/agents/*.md`, 6 mode `SKILL.md` files, hub routing contracts, references, assets, and `sk-prompt` canonical assets were read and mapped.
- Unknown: Live model execution behavior when receiving large inline personas on models with very small context windows (e.g. 8k-16k token models); will require prompt compression guidelines in `sk-prompt-models`.
- Risk: Injecting full agent persona markdown into prompt payloads for small CLI models could consume a substantial fraction of their context window if not compressed into focused persona blocks.

---

### Recommendation
- **Verdict**: `proceed`
- **Rationale**: The investigation is complete. Only 1 of the 6 CLI modes (`cli-claude-code` via `--agent`) natively loads agent personas during non-interactive dispatch. The remaining 5 modes (`cli-opencode`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`) and the shared deep-loop runtime dispatch unspecialized sessions without persona guardrails. Reusing the inline injection precedent established by `orchestrate.md` (§2 NDP) and `DESIGN_DISPATCH_MANIFEST v1` will close this gap uniformly.
- **Suggested next**: Proceed to planning the persona-injection enforcement mechanism, anchoring the prompt-construction step in `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` and standardizing inline persona wrappers across all cli-* dispatchers.

INVENTORY_COMPLETE

---

## INDEPENDENT VERIFICATION CORRECTIONS (cline / DeepSeek V4 Flash @ xhigh, review persona)

An independent tool-free verification pass (evidence: `p1-verification-cline-deepseek.md`) found and source-confirmed the following corrections to the inventory above. These supersede the corresponding original claims:

- **cli-cursor is NOT inline-only (P0 correction).** §C wrongly stated cursor "cannot load role-specific agent personas (@review, @debug)". Source `cli-cursor/SKILL.md` "#### Custom Subagents (CORRECTION -- earlier claim was wrong)": Cursor loads custom subagents from `.cursor/agents/*.md` + `.claude/agents/*.md` (project), all 13 canonical agents (symlinked), live-probed via `cursor-agent --force -p`. Cursor therefore HAS a native persona surface. Nuance: bare `cursor-agent -p` (no `--agent` selector) still runs the default agent, so INLINE remains the fallback on a bare `-p`.
- **cli-devin has a native `run_subagent` surface (already YES in §C for that row, but the "5 modes inline uniformly" recommendation was wrong).** Source `cli-devin/SKILL.md` "Agent Roster Parity": all 13 canonical agents dispatch through `run_subagent` via `.devin/agents/<name>/AGENT.md` symlinks. (The separate `.claude/agents` auto-import IS broken on the installed CLI — that part of §C stands.)
- **Recommendation "close this gap uniformly [inline]" is corrected to mode-split:** native surface where the CLI loads it (claude-code `--agent`; cursor/devin/opencode by naming the resolved subagent), INLINE elsewhere and as the universal fallback. See the corrected mechanism table in `../002-persona-injection-contract/scratch/persona-injection-contract.md` §3.
- **Minor (P1/P2):** §B does not surface `codex exec review` / `codex --search exec` as explicit dispatch rows (though §D names `codex exec review`); §F correctly lists six cli-* cards while the canonical card's own "MIRROR SYNC" text is stale ("three") — flag it in P4.

Verdict: inventory core sound (opencode/codex/devin/pi flag-level verdicts confirmed); REQUEST CHANGES resolved by the corrections above. The corrected native-surface map is authoritative in the P2 contract.

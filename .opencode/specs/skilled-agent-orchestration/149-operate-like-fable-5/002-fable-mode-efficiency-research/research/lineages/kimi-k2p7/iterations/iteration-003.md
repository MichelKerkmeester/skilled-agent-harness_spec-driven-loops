# Iteration 003 — Adjustable Public-repo surface map and read-reliability

## Focus

Inventory every adjustable Public-repo surface that could carry a fable-5 delta, and score each by read-reliability per runtime (OpenCode / Claude Code / Codex CLI). Surfaces: root operating contract, constitutional memories, skills, agents, commands, and hot mechanisms (skill-advisor hook, hook system, deep-loop runtime/executor-config).

## Sources

- `[SOURCE: file:AGENTS.md]` — root operating contract
- `[SOURCE: file:.opencode/skills/system-spec-kit/constitutional/*.md]` — 17 constitutional rules (glob result)
- `[SOURCE: file:.opencode/agents/*.md]` — 12 agent definitions (glob result)
- `[SOURCE: file:.opencode/commands/**/*.md]` — command router definitions (glob result)
- `[SOURCE: file:.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md]` — prompt-time hook contract
- `[SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/SKILL.md]` — deep-loop runtime / executor contract

---

## Findings

### Surface 1: `AGENTS.md` / `CLAUDE.md` root operating contract

- **What it is:** The framework's most-read surface. Public `AGENTS.md` and `CLAUDE.md` are byte-identical twins; Barter has a read-only-git variant.
- **Adjustable:** Yes — text edits in §1 or new subsections.
- **Read-reliability:**
  - OpenCode: HIGH (root doc injected at session start).
  - Claude Code: HIGH (same root doc / CLAUDE.md).
  - Codex CLI: MEDIUM-HIGH (root `AGENTS.md` is not native Codex context; depends on project-level injection or hook brief).
- **Round 1 state:** Already carries Operating Discipline subsection (9 bullets). No more doctrine should be dumped here; line budget (~500) is a hard constraint.
- **Best fit for new deltas:** Tier A doctrine only if extremely compact; otherwise cross-reference from constitutional rules to avoid bloat.
- **Citations:** `[SOURCE: file:AGENTS.md:1-447]`; `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/001-initial-refinement/implementation-summary.md:61-68]`

### Surface 2: `system-spec-kit/constitutional/` memories (17 rules)

- **What it is:** Auto-surfacing constitutional rules under `.opencode/skills/system-spec-kit/constitutional/` (e.g., `verify-before-completion-claims.md`, `regression-baseline-and-delta.md`, `finding-is-a-hypothesis.md`, `main-branch-direct-push.md`, `gate-tool-routing.md`, `comment-hygiene.md`, etc.).
- **Adjustable:** Yes — add new `.md` files or fold bullets into existing rules.
- **Read-reliability:**
  - OpenCode: HIGH when skill-advisor hook is live; HIGH via skill loading when skill routing triggers.
  - Claude Code: HIGH when `UserPromptSubmit` hook is registered; MEDIUM otherwise (depends on manual skill load).
  - Codex CLI: HIGH when native `UserPromptSubmit` hook is registered; MEDIUM otherwise.
- **Round 1 state:** Two new rules already added (`regression-baseline-and-delta.md`, `finding-is-a-hypothesis.md`); `main-branch-direct-push.md` folded with 5th bullet.
- **Best fit for new deltas:** Tier A doctrine and Tier B mechanism rules. Constitutional rules auto-surface without bloating AGENTS.md. This is the highest-leverage surface for most round-2 deltas.
- **Citations:** `[SOURCE: file:.opencode/skills/system-spec-kit/constitutional/]` (glob); `[SOURCE: file:.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:45-76]`

### Surface 3: Skill `SKILL.md` files (`sk-code`, `sk-prompt`, `sk-doc`, `sk-git`, `deep-loop-workflows`, `system-spec-kit`, `system-skill-advisor`)

- **What it is:** Per-skill operating instructions loaded when the skill is invoked.
- **Adjustable:** Yes — edit the skill's `SKILL.md` or add a new rule/reference.
- **Read-reliability:**
  - OpenCode: MEDIUM-HIGH (loaded via `skill` tool when task matches; depends on skill advisor routing ≥ 0.8).
  - Claude Code: MEDIUM-HIGH (same, via skill tool).
  - Codex CLI: MEDIUM (skill tool availability varies).
- **Round 1 state:** `sk-code/SKILL.md` gained a Baseline & blast-radius line after the Iron Law.
- **Best fit for new deltas:**
  - `sk-code`: mutation-check ritual, verification ladder, adversarial review schema.
  - `sk-prompt`: fable lexicon, two-register voice, minimum-qualifier rule, `// DECISION:` marker.
  - `deep-loop-workflows`: multi-agent orchestration house rules, typed output schema, two-stage review.
  - `system-spec-kit`: scar-tissue curation, cold-successor handoff protocol, rotted-list → self-auditing test.
  - `system-skill-advisor`: skill-advisor hook governor brief.
- **Citations:** `[SOURCE: file:.opencode/skills/sk-code/SKILL.md]`; `[SOURCE: file:.opencode/skills/sk-prompt/SKILL.md]`; `[SOURCE: file:.opencode/skills/system-spec-kit/SKILL.md]`

### Surface 4: Agent definitions (`.opencode/agents/*.md`)

- **What it is:** 12 agents: `orchestrate`, `code`, `review`, `context`, `debug`, `deep-research`, `deep-review`, `deep-context`, `ai-council`, `markdown`, `prompt-improver`.
- **Adjustable:** Yes — edit agent markdown or add system-prompt blocks.
- **Read-reliability:**
  - OpenCode: MEDIUM (dispatched by Task tool; reliability depends on orchestrator choosing the right agent).
  - Claude Code: MEDIUM.
  - Codex CLI: MEDIUM.
- **Round 1 state:** No fable-5 content added to agents.
- **Best fit for new deltas:**
  - `orchestrate`: multi-agent house rules, typed output schema, two-stage review.
  - `deep-research` / `deep-review`: recursion-control governor for models with anxious texture.
  - `review`: adversarial review schema (claim/verdict/evidence triple).
  - `code`: verification ladder, mutation-check ritual.
- **Citations:** `[SOURCE: file:.opencode/agents/orchestrate.md]`; `[SOURCE: file:.opencode/agents/deep-research.md]`; `[SOURCE: file:.opencode/agents/review.md]`

### Surface 5: Command router definitions (`.opencode/commands/**/*.md`)

- **What it is:** Thin routers for `/deep:*`, `/speckit:*`, `/memory:*`, `/doctor:*`, `/prompt`, `/agent_router`, `/create:*`.
- **Adjustable:** Yes — edit command markdown (presentation/contract only; workflow assets own logic).
- **Read-reliability:**
  - OpenCode: MEDIUM (command invoked by user; not automatic).
  - Claude Code: MEDIUM.
  - Codex CLI: LOW-MEDIUM (Codex command surface differs).
- **Round 1 state:** No fable-5 content added to commands.
- **Best fit for new deltas:**
  - `/doctor fable-leak` or `/doctor fable-governor`: host `leak_test.py`-style metric.
  - `/deep:benchmark` or `/deep:model-benchmark`: execution-mechanics benchmark.
  - `/speckit:plan` / `/speckit:implement`: cold-successor handoff prompts.
- **Citations:** `[SOURCE: file:.opencode/commands/doctor/speckit.md]`; `[SOURCE: file:.opencode/commands/deep/model-benchmark.md]`; `[SOURCE: file:.opencode/commands/deep/skill-benchmark.md]`

### Surface 6: Skill-advisor `UserPromptSubmit` hook + plugin bridge

- **What it is:** Prompt-time additionalContext injection that surfaces skill-advisor briefs. Native hooks for Claude Code (`mcp_server/hooks/claude/user-prompt-submit.ts`), Codex CLI (`hooks/codex/user-prompt-submit.ts`), Copilot CLI, and OpenCode plugin bridge (`mk-skill-advisor-bridge.mjs`).
- **Adjustable:** Yes — modify `mcp_server/lib/skill-advisor-brief.ts` or add a compact governor brief when certain skills/topics match.
- **Read-reliability:**
  - Claude Code: HIGH when `~/.claude/hooks.json` is registered; fail-open otherwise.
  - Codex CLI: HIGH when `~/.codex/hooks.json` is registered and `codex_hooks = true`; fail-open otherwise.
  - OpenCode: HIGH via plugin bridge (native MCP or warm CLI fallback).
  - Copilot CLI: MEDIUM (next-prompt freshness: current prompt sees prior turn's brief).
- **Round 1 state:** Hook surfaces advisor briefs; not currently carrying a fable-5 governor.
- **Best fit for new deltas:** Tier B "ride the live hook" — inject a compact fable-5 governor brief (recursion control, output-shape rules, execution mechanics) at prompt time. This is the lowest-blast, highest-read-reliability mechanism surface.
- **Citations:** `[SOURCE: file:.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:45-76]`; `[SOURCE: file:.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:1-279]`; `[SOURCE: file:.opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts:1-453]`

### Surface 7: Hook system / `SessionStart` / `PreCompact`

- **What it is:** Beyond `UserPromptSubmit`, the framework has `SessionStart` (startup context) and `PreCompact` hooks. The hook system is owned by `system-spec-kit` / `system-code-graph`.
- **Adjustable:** Yes — add new hook implementations or briefs.
- **Read-reliability:**
  - Claude Code: MEDIUM (depends on hook registration).
  - Codex CLI: MEDIUM.
  - OpenCode: MEDIUM (plugin bridge).
- **Best fit for new deltas:** Session-level governor injection (e.g., embed `governor-block.md` at session start for Opus-backed runtimes).
- **Citations:** `[SOURCE: file:.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md:45-54]`; `[SOURCE: file:.opencode/skills/system-spec-kit/references/config/hook_system.md]` (referenced in AGENTS.md)

### Surface 8: Deep-loop runtime / executor-config

- **What it is:** Shared runtime for `deep-research`, `deep-review`, `deep-context`, etc. Executor selection (`native`, `cli-codex`, `cli-claude-code`, `cli-opencode`) parsed by `executor-config.ts`.
- **Adjustable:** Yes — modify executor-config flag support, add prompt-pack templates, modify workflow YAMLs.
- **Read-reliability:**
  - OpenCode: MEDIUM (used by `/deep:*` commands).
  - Claude Code: MEDIUM.
  - Codex CLI: MEDIUM.
- **Best fit for new deltas:** Add fable-5 executor profiles (e.g., `cli-opencode` with model-specific governor block); add post-dispatch verification schema (claim/verdict/evidence); add iteration self-check prompts.
- **Citations:** `[SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md:235-253]`; `[SOURCE: file:.opencode/skills/deep-loop-runtime/SKILL.md]`

---

## Read-Reliability Summary Matrix

| Surface | OpenCode | Claude | Codex | Best Tier Fit |
|---------|----------|--------|-------|---------------|
| AGENTS.md / CLAUDE.md | HIGH | HIGH | MEDIUM-HIGH | A (compact doctrine only) |
| `system-spec-kit/constitutional/` | HIGH | HIGH* | HIGH* | A / B |
| Skill `SKILL.md` files | MEDIUM-HIGH | MEDIUM-HIGH | MEDIUM | B / C |
| Agent definitions | MEDIUM | MEDIUM | MEDIUM | B |
| Command definitions | MEDIUM | MEDIUM | LOW-MEDIUM | C |
| `UserPromptSubmit` hook | HIGH | HIGH | HIGH | B (ride the hook) |
| Hook system (SessionStart/PreCompact) | MEDIUM | MEDIUM | MEDIUM | B |
| Deep-loop runtime / executor-config | MEDIUM | MEDIUM | MEDIUM | B / C |

*HIGH when the native hook is registered; MEDIUM otherwise.

---

## Dead Ends / Ruled Out

- **`.opencode/commands/create/*.md`** are scaffolding templates; not suitable for behavioral governor injection.
- **`Barter/ai-speckit/coder/AGENTS.md`** is read-only-git per its own §1, creating a pre-existing contradiction with `main-branch-direct-push.md`. Any fable-5 delta here needs owner resolution (flagged in round 1).
- **`opus-fable-mode-main/reinject.sh`** is a deployment convenience, not a framework surface.

---

## Assessment

- **Status:** complete
- **newInfoRatio:** 0.65
- **Novelty justification:** This iteration produces a structured surface×runtime map that did not exist in iterations 1-2. Lower ratio than extraction because some surfaces (AGENTS.md, constitutional rules) were already known from round 1; the new value is the read-reliability scoring and the identification of the `UserPromptSubmit` hook as the highest-leverage mechanism surface.
- **Focus track:** surface-map
- **Key questions touched:** Q2 (answered), Q3 (partial: surfaces identified; scoring/tiering in iteration 4), Q4 (command surfaces identified for measurement host).

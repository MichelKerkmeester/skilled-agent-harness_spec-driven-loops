---
title: "Implementation Summary: Pi runtime compatibility (prompts, agents, extensions)"
description: "Built and live-verified .pi/prompts/*.md (36 commands), .pi/agents/*.md (13 agents via pi-subagents), and .pi/extensions/*.ts (7 guard-core bridges); GLM-5.2 independently re-verified every guard-core call signature and returned APPROVE WITH MINOR NOTES, all 3 actionable findings fixed."
trigger_phrases:
  - "pi runtime compatibility summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/012-pi-runtime-compatibility"
    last_updated_at: "2026-07-27T22:10:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built via LUNA, GLM-reviewed; amended twice for code-graph removal and TS alignment"
    next_safe_action: "Commit; author phase 013's manual-testing-playbook next"
    blockers: []
    key_files: [".pi/prompts/", ".pi/agents/", ".pi/extensions/"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["36 prompts + 13 agents + 7 extensions built and live-verified.", "GLM-5.2 independently re-ran export/signature verification beyond what was asked, found 0 blocking issues.", "3 actionable minor findings fixed: agent-name path-traversal guard, always-explicit tools: key, an alias-assumption comment."]
---
# Implementation Summary: Pi runtime compatibility (prompts, agents, extensions)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-pi-runtime-compatibility |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:amendment-2026-07-27 -->
## Post-Completion Amendment (2026-07-27)

`system-code-graph` is being decommissioned repo-wide (`system-code-graph/036-code-graph-decommission`). As a downstream consumer, `.pi/` no longer wires code-graph support: the `mk_code_index` server entry was removed from `.pi/mcp.json`, and `.pi/extensions/code-graph-freshness.ts` was deleted. `.pi/extensions/*.ts` now bridges **6** guard cores, not 7 (`spec-gate-enforce`, `spec-gate-classify`, `dispatch-preflight-lint`, `dispatch-audit`, `post-edit-quality`, `mcp-route-guard`); `.pi/mcp.json` now wires **4** native MCP servers, not 5. The narrative and evidence below describe what was built and verified at original completion time (2026-07-27, before this amendment) and are left as an accurate historical record rather than rewritten.

**Second amendment (2026-07-27, same day):** the 6 remaining `.pi/extensions/*.ts` files were aligned with `sk-code`'s `code-opencode` TypeScript standards (`.opencode/skills/sk-code/code-opencode/assets/checklists/typescript-checklist.md`): each file gained the required `// MODULE: ...` header block and a one-line TSDoc comment on its default export. No behavior changed; a live `pi --offline --approve` session confirmed all 6 still load without a startup error after the edit. A new `.pi/extensions/README.md` code-folder README was also authored via `sk-doc`'s `create-readme` code-folder shape, documenting the folder's purpose, per-file event/delegation mapping, boundaries, fail-open discipline, and entrypoints.
<!-- /ANCHOR:amendment-2026-07-27 -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase built the 3 real `.pi/` artifacts phases 005 (command layer), 006 (agent bridge), and 008 (hook/extension layer) had designed but explicitly deferred: `.pi/prompts/*.md` (36 files), `.pi/agents/*.md` (13 files), and `.pi/extensions/*.ts` (7 files). It was added mid-packet at the operator's explicit request, after research corrected the operator's own premise ("like devin and cursor" mirror agent/command files) — those two CLIs don't actually have such mirrors; only Codex does, for its own native per-agent/per-command registration requirement. Pi has its own real equivalents (`.pi/agents/**/*.md`, `.pi/extensions/*.ts`), confirmed in phases 006/008, which this phase builds.

### Commands: `.pi/prompts/*.md` (36 files)

`sync-prompts-pi.cjs` reuses `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs`'s exact discovery-walk and thin-pointer-stub pattern, retargeted to `.pi/prompts/`. Each stub points back to its canonical `.opencode/commands/<path>` source and passes arguments through via `$ARGUMENTS` — confirmed via a live `pi.dev/docs/latest/prompt-templates` fetch during this phase's own review to be a genuinely documented Pi substitution token (equivalent to `$@`), not an invented placeholder. `--check` reports `36 prompts are in sync`.

### Agents: `.pi/agents/*.md` (13 files)

`sync-agents-pi.cjs` is a new converter (pi-subagents' 17-field schema is too different from Codex's TOML wrapper to reuse `sync-agents.cjs`): it maps each `.opencode/agents/*.md`'s `permission:` block to pi-subagents' own `tools:` array (only `allow`-valued permissions with a literal Pi tool-name equivalent get included; unmapped OpenCode-only permissions are surfaced as a YAML comment, never silently dropped), and carries the agent body through unchanged. `--check` reports `13 agents are in sync`.

### Hooks: `.pi/extensions/*.ts` (7 of 8 planned guard cores)

One extension file per guard-core already wired into `.cursor/hooks.json`/`.devin/hooks.v1.json`/`.codex/hooks.json`: `spec-gate-enforce`, `spec-gate-classify`, `dispatch-preflight-lint`, `dispatch-audit`, `post-edit-quality`, `code-graph-freshness`, `mcp-route-guard`. Each directly imports the same shared guard-core module the other 3 runtimes' adapters already call — Pi becomes a 4th consumer, never a second reimplementation. The 8th guard core ("task-dispatch guard") was deliberately skipped: its own prerequisite (a distinguishable Pi-subagent tool name to match on) is still an open question in phase 008's own docs, and building a guess-based bridge for it would risk a false sense of coverage.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/pi/sync-prompts-pi.cjs` | Created | Command-mirror generator. |
| `.opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs` | Created | Agent-mirror generator; hardened post-review with a name-traversal guard and an always-explicit `tools:` key. |
| `.opencode/skills/system-spec-kit/scripts/pi/README.md` | Created | Documents both generators. |
| `.pi/prompts/*.md` (36 files) | Created | Generator output. |
| `.pi/agents/*.md` (13 files) | Created | Generator output. |
| `.pi/extensions/*.ts` (7 files) | Created | Guard-core bridges. |
| `.pi/settings.json` | Modified | `pi install npm:pi-subagents -l --approve` added it to the existing `packages` array (non-destructive merge, `pi-mcp-extension` preserved). |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/agent-delegation.md` | Modified | New §2A documenting the confirmed `.pi/agents/**/*.md` path/schema convention. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

LUNA (`codex exec --model gpt-5.6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" --sandbox workspace-write`) built all 3 artifact streams in one dispatch, given a brief naming every guard-core's real file path, exported function name, and event-narrowing condition (sourced from phase 008's own type-confirmed mapping table), plus the real pi-subagents schema (from phase 006). LUNA correctly refused to fabricate a `pi-subagents` install claim when it found the package genuinely absent from this worktree's `.pi/npm/` (only `pi-mcp-extension` had been installed, in phase 007) — I installed it myself afterward (`pi install npm:pi-subagents -l --approve`, real, no credentials needed) rather than have LUNA guess around the gap.

I independently re-verified every one of the 7 extension files' guard-core function calls via direct `grep` against the real cited files before dispatching for review — all confirmed real exports, not fabricated. I also confirmed nothing was written outside this worktree: the sandbox correctly blocked (EPERM) an attempted lock-file write to the operator's REAL `~/.pi/agent/settings.json.lock` during LUNA's own live-probe attempt; nothing was actually created there.

GLM-5.2 (`devin -p --model glm-5.2 -- "<review>"`) reviewed the 2 generator scripts and all 7 extension files, and went further than asked: it independently re-verified all 17 guard-core export names AND their call-argument shapes against the real function signatures (not just their existence), and traced `evaluateMutation`'s real deny conditions to confirm the fail-open discipline holds even for the specific `bash`-tool branch. Verdict: **APPROVE WITH MINOR NOTES**, 0 blocking findings. I fixed the 3 actionable findings (below) and left 2 purely informational notes as-is per GLM's own non-blocking severity assessment.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip the 8th guard core (task-dispatch guard) | Its own prerequisite (a distinguishable Pi-subagent tool name) is unresolved per phase 008's own docs; building a guess-based bridge would be worse than an honestly-documented gap. |
| Install `pi-subagents` myself rather than have LUNA guess at its absence | LUNA correctly reported the package was missing rather than fabricating an install; installing it is a real, safe, no-credential-needed action matching this session's own established precedent. |
| Fix GLM's 3 actionable findings before commit; leave 2 informational notes as-is | The 3 fixed findings (name-traversal guard, always-explicit `tools:`, an alias-assumption comment) are real, low-cost correctness/security hardening. The 2 left findings (non-atomic writes, depth-coupled `REPO_ROOT`) are GLM's own "low severity"/informational classification with `--check` drift-detection as an adequate existing safety net. |
| Always emit an explicit `tools:` key in `.pi/agents/*.md`, even when it would be empty | Confirmed via a live pi-subagents docs fetch: omitting the key makes pi-subagents fall back to Pi's full builtin tool set (default-allow) for that agent, silently discarding the source agent's own scoped-down permissions. This is a pure hardening fix -- byte-identical output for all 13 current real agents, since none currently maps to zero tools. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sync-prompts-pi.cjs --check` | PASS -- 36 prompts in sync |
| `sync-agents-pi.cjs --check` | PASS -- 13 agents in sync (re-confirmed after hardening, `Wrote 0 of 13`, byte-identical) |
| Live `pi --offline --approve -p "list your available tools"` | PASS -- exit 0; `pi-subagents` tools (`subagent`, `subagent_wait`, `subagent_supervisor`, `intercom`) present; `mk-spec-memory` + `sequential_thinking` MCP tools present; `mk_code_index` failed on the same diagnosed worktree-provisioning gap phase 007 already found (confirmed present in the main tree, not a new regression) |
| Guard-core export/signature verification | 17 export names + their call-argument shapes independently confirmed real by both me and GLM-5.2, against the actual cited files |
| Regression-guard scope check | `git status --porcelain` shows zero `.codex/`, `.cursor/`, `.devin/`, `.opencode/agents/`, `.opencode/commands/` files touched |
| GLM-5.2 independent review | APPROVE WITH MINOR NOTES; 0 blocking; 3 actionable fixed, 2 informational left as-is |
| `validate.sh --strict` against this phase folder | Run at commit time via the main-tree round-trip pattern (worktree lacks the toolchain); result recorded in the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`mk_code_index` still fails to connect in this bare worktree** (same diagnosed missing-`typescript`-toolchain gap phase 007 found, confirmed present in the main tree) — not a regression from this phase's work, and not fixed here (out of scope, matches this session's established discipline of not installing gitignored deps into a bare worktree).
2. **The 8th guard core (task-dispatch guard) is not bridged.** Its own prerequisite (a distinguishable Pi-subagent tool name to match on) remains unresolved; a future phase should revisit this once that question is answered.
3. **No individual, named custom agent could be observed as an individually-listed top-level tool** in the live probe — this matches pi-subagents' own documented delegation model (agents are invoked via the generic `subagent` tool with a name parameter, not surfaced as N separately-named tools), not a build defect, but it means this phase's live verification confirms the AGENT FILES parse and load without error, not that each individual agent can be dispatched end-to-end (that would require an actual `subagent` tool call with a real LLM turn deciding to make it, which this machine's missing provider credentials still prevent).
4. **`find`/`ls`'s exact capability-shape equivalence to OpenCode's `glob`/`list`** is asserted from Pi's type definitions (per the in-code comment added post-review), not independently capability-tested.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->

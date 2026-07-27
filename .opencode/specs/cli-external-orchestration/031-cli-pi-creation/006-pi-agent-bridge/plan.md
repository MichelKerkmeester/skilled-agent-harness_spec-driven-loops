---
title: "Implementation Plan: Pi agent bridge (pi-subagents third-party translation)"
description: "Field-map all 13 real .claude/agents/*.md files against pi-subagents' documented 17-field markdown+YAML schema, tier the translation order by MCP-dependency and cross-agent-dispatch coupling, and disposition every Claude-only runtime behavior before any future execution phase installs pi-subagents or writes .pi/agents/**/*.md."
trigger_phrases:
  - "pi agent bridge plan"
  - "pi-subagents field mapping"
  - "claude agents pi-subagents translation tiers"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/006-pi-agent-bridge"
    last_updated_at: "2026-07-27T08:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md with agent inventory, schema mapping, disposition table"
    next_safe_action: "Author tasks.md and checklist.md"
    blockers: []
    key_files: [".claude/agents/*.md (13 files, tools: frontmatter grepped verbatim 2026-07-27)", "https://pi.dev/packages/pi-subagents"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: ["Does pi-subagents support nested subagent-of-subagent dispatch, needed for ai-council/orchestrate (Tier 4)?", "What is Pi's canonical built-in tool-name vocabulary for the tools: allowlist?", "Does tools: support MCP-sourced tool names, and under what naming convention?", "Flat/unpackaged vs package-scoped agent naming - pending a collision check against pi-subagents' builtin agents directory."]
    answered_questions: ["MCP-dependent count is 11 of 13 by a fresh grep across tools: frontmatter (2026-07-27), not the 10 of 13 spec.md's Risks table states - the two non-MCP agents are deep-improvement and prompt-improver in both counts.", "code.md and review.md real frontmatter read live: name/description/tools only, no model field, confirming spec.md's finding.", "Only 2 of 13 agents (ai-council, orchestrate) carry the Agent tool (cross-agent dispatch capability) - these are the Tier 4 agents blocked on the nested-dispatch open question."]
---
# Implementation Plan: Pi agent bridge (pi-subagents third-party translation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter (agent-profile translation); no application code touched |
| **Framework** | Third-party `pi-subagents` package (`https://pi.dev/packages/pi-subagents`, author nicopreme/nicobailon), read via `.pi/agents/**/*.md` |
| **Storage** | None — planning artifacts only; this phase creates zero files under `.pi/` |
| **Testing** | N/A this phase (planning only); a future execution phase verifies via `pi-subagents`' own discovery/list surface |

### Overview
This plan inventories all 13 real `.claude/agents/*.md` frontmatter blocks (captured verbatim via a live `grep`, not assumed), maps Claude's 3 frontmatter fields plus `pi-subagents`' 14 additional documented fields into a single confirmed/inferred/unknown table, groups the 13 agents into a 4-tier translation order by MCP-dependency and cross-agent-dispatch coupling, and dispositions every Claude-only runtime behavior with no confirmed `pi-subagents` equivalent — producing a plan a future execution phase can follow without guessing at an unconfirmed schema.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. [EVIDENCE: spec.md §2/§3 state the third-party-package framing and the in/out-of-scope boundary.]
- [x] Success criteria measurable. [EVIDENCE: spec.md §5 SC-001 through SC-003 are citation-backed and `validate.sh`-checkable.]
- [x] Dependencies identified. [EVIDENCE: spec.md §6 names `001`/`004`/the `pi-subagents` page as dependencies; Phase Context cross-references `005`.]

### Definition of Done
- [ ] All acceptance criteria met. [EVIDENCE: pending — REQ-001 through REQ-006 verified against this plan.md in `checklist.md`.]
- [ ] Every one of the 13 agents assigned to exactly one of the 4 translation tiers with a cited rationale. [EVIDENCE: pending — §3 Architecture tier table below.]
- [ ] No `.pi/agents/**/*.md` file created and no `pi install` command run by this phase. [EVIDENCE: pending — confirmed by `git status` showing no changes outside this phase folder.]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Inventory-then-map-then-tier planning, grounded in two live sources captured before this document was written: a `grep` across all 13 real `tools:` frontmatter lines (this phase, 2026-07-27) and the `pi-subagents` schema fetch already recorded in spec.md's continuity block (2026-07-27). No live schema fetch is repeated here; this plan consumes spec.md's already-confirmed findings rather than re-deriving them.

### Key Components
- **Per-agent inventory** (13 rows): real `name`/`tools:` values, MCP-dependency flag, cross-agent-dispatch flag, assigned tier.
- **17-field schema mapping table**: Claude's 3 frontmatter fields (`name`, `description`, `tools`) plus `pi-subagents`' 14 additional documented fields, each marked confirmed/inferred/unknown with a citation.
- **Claude-only-behavior disposition table**: 5 identified behaviors, each assigned preserve-as-prose / open-question / routed-to-a-named-phase.
- **4-tier translation order**: Tier 1 (no-MCP, no-dispatch) → Tier 2 (single-MCP-server) → Tier 3 (multi-MCP-server) → Tier 4 (cross-agent-dispatch-coupled), lowest-risk first.

#### Per-Agent Inventory & Tier Assignment

| Agent | Real `tools:` (verbatim, `grep '^tools:' .claude/agents/*.md`) | MCP-dependent | Cross-agent dispatch (`Agent` tool) | Tier |
|---|---|---|---|---|
| `deep-improvement` | `Read, Write, Edit, Bash, Grep, Glob` | No | No | 1 |
| `prompt-improver` | `Read, Grep, Glob` | No | No | 1 |
| `code` | `Read, Write, Edit, Bash, Grep, Glob, mcp__mk_spec_memory__*` | Yes (1 server) | No | 2 |
| `debug` | `Read, Write, Edit, Bash, Grep, Glob, mcp__mk_spec_memory__*` | Yes (1 server) | No | 2 |
| `design` | `Read, Write, Edit, Bash, Grep, Glob, mcp__mk_spec_memory__*` | Yes (1 server) | No | 2 |
| `markdown` | `Read, Write, Edit, Bash, Grep, Glob, mcp__mk_spec_memory__*` | Yes (1 server) | No | 2 |
| `deep-research` | `Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch, mcp__mk_spec_memory__*` | Yes (1 server) | No | 2 |
| `context` | `Read, Grep, Glob, mcp__mk_spec_memory__*, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context, mcp__mk_code_index__code_graph_status` | Yes (2 servers) | No | 3 |
| `deep-alignment` | `Read, Bash, Grep, Glob, mcp__mk_spec_memory__*, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context` | Yes (2 servers) | No | 3 |
| `deep-review` | `Read, Write, Edit, Bash, Grep, Glob, mcp__mk_spec_memory__*, mcp__mk_code_index__detect_changes, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context` | Yes (2 servers) | No | 3 |
| `review` | `Read, Bash, Grep, Glob, mcp__mk_spec_memory__*, mcp__mk_code_index__detect_changes` | Yes (2 servers) | No | 3 |
| `ai-council` | `Read, Write, Edit, Grep, Glob, WebFetch, Agent, mcp__mk_spec_memory__*, mcp__sequential_thinking__*` | Yes (2 servers) | Yes | 4 |
| `orchestrate` | `Read, Agent, mcp__mk_spec_memory__*` | Yes (1 server) | Yes | 4 |

**Tier split**: 2 + 5 + 4 + 2 = 13 (matches the live `find` count).

**MCP-dependent count**: 11 of 13 (`grep -l 'mcp__' .claude/agents/*.md`, run 2026-07-27), the exact two exceptions being `deep-improvement` and `prompt-improver`. This is a small factual delta from spec.md's Risks table, which states "10 of the 13" — spec.md is frozen per this phase's scope lock (Files Already Good, do not touch), so the delta is flagged here rather than silently reconciled; 11 is what a `pi-subagents`-discovery verification pass would actually need to check against.

**Tier rationale**: Tier 1 agents (2) have zero MCP dependency and no cross-agent-dispatch tool, so a `tools:` translation mistake is fully self-contained — safest agents to prove the `pi-subagents` mechanism first. Tier 2 agents (5) add a single MCP-server wildcard dependency (`mcp__mk_spec_memory__*` only) — translating them next surfaces whether `tools:` even accepts an MCP-sourced name before Tier 3's more complex multi-server agents are attempted. Tier 3 agents (4) depend on two MCP servers including `mcp__mk_code_index__*`'s specific (non-wildcard) tool names — a stricter test of whether the `tools:` allowlist supports named, non-wildcard MCP tools. Tier 4 agents (2) are the only two carrying the `Agent` tool (cross-agent dispatch) — translated last because they are exactly the agents blocked by the unresolved nested-dispatch open question (see disposition table below); if `pi-subagents` cannot dispatch further subagents, `ai-council` and `orchestrate` may need a documented capability loss rather than a literal translation.

#### Frontmatter Field Mapping (17 fields)

| Claude field | `pi-subagents` field | Status | Evidence / Note |
|---|---|---|---|
| `name` | `name` | Confirmed | Direct 1:1; both required. Verbatim across all 13 Claude files (e.g. `code.md:2`, `review.md:2`). |
| `description` | `description` | Confirmed | Direct 1:1; both optional-but-always-present in practice across the 13 real files. |
| `tools` | `tools` | Inferred | Structurally analogous (both an allowlist field) but vocabulary UNCONFIRMED — `pi-subagents`' only documented example (`read, grep, find, ls, bash`) is lowercase and of unstated completeness against Claude's `Read`/`Write`/`Edit`/`Bash`/`Grep`/`Glob`/`Agent` + `mcp__*` wildcards. Routed to phase 1. |
| (none) | `package` | N/A — judgment call | Claude has no packaging concept. spec.md §7 recommends flat/unpackaged for name parity, pending a collision check against `pi-subagents`' builtin agents directory. |
| (none) | `model` | Deferred | REQ-006 forbids hardcoding any `model:` value in this plan; routed to `009-pi-model-registry-and-routing`. |
| (none) | `fallbackModels` | Deferred | Same as `model`; no Claude equivalent concept exists at the agent-frontmatter level. |
| (none) | `thinking` | Deferred | Analogous in spirit to a reasoning-effort setting; no Claude frontmatter equivalent. Routed to phase 9 alongside `model`. |
| (body prose only — RETURN-contract formatting, e.g. `code.md` §8) | `systemPromptMode` | Unknown | UNCONFIRMED whether this controls full-replace vs. append of Pi's own system prompt; the closest Claude analog lives entirely in body prose, not frontmatter, so there is no clean source value to map. |
| (implicit — Claude sub-agents always run with full CWD/project context) | `inheritProjectContext` | Inferred | Likely maps to `true`, but the field's exact default and semantics are UNCONFIRMED. |
| (body prose: "load `sk-code`"/"load `sk-design`") | `inheritSkills` | Unknown | Depends entirely on `004-pi-skill-discovery-bridge`'s outcome — whether Pi's skill discovery already exposes `.opencode/skills/` makes this field's value moot or load-bearing. |
| (body prose) | `skills` | Unknown | Same dependency as `inheritSkills`; whether an explicit per-agent `skills` array is needed on top of `.pi/settings.json`'s global `skills` pointer is UNCONFIRMED. |
| (none) | `skillPath` | Unknown | No Claude equivalent; depends on the same phase-004 outcome. |
| (body prose: RETURN/OUTPUT FORMAT contracts, e.g. `code.md` §8, `review.md` §8) | `output` | Unknown | POSSIBLE loose analog — Claude's structured RETURN contract is enforced by prose convention only, never machine-validated frontmatter; UNCONFIRMED whether `pi-subagents`' `output` field is machine-enforced or documentation-only. |
| (none) | `async` | N/A | No Claude per-agent dispatch-mode frontmatter concept. |
| (none) | `timeoutMs` | N/A | No Claude equivalent. |
| (body prose: "Complexity: low" fast-path budgets, e.g. `code.md` §2 "Max 5 tool calls", `review.md` §2 "Max 5 tool calls") | `turnBudget` | Unknown | Loosely resembles the numeric tool-call caps baked into Claude agent body prose, but those are dispatch-time hints from the orchestrator, not a static per-agent frontmatter ceiling — UNCONFIRMED whether porting the numbers is even the right translation. |
| (body prose: rubric/gate scoring, e.g. `code.md` §5 CODER ACCEPTANCE RUBRIC, `review.md` §5 QUALITY RUBRIC) | `acceptance` | Unknown | POSSIBLE loose analog to Claude's self-scored PASS/FAIL bar; UNCONFIRMED whether `pi-subagents`' `acceptance` field is machine-checked at all. |

#### Claude-Only Behavior Disposition (5 behaviors)

| Behavior | Claude mechanism | Disposition |
|---|---|---|
| Hard-block dispatch gates (e.g. `code.md`'s "⛔ DISPATCH GATE": `@code` MUST be dispatched by `@orchestrate`, checked against a `Depth: 1` marker in the dispatch prompt) | Body-prose convention-level gate; not a Claude Code runtime feature — it is markdown text the agent is instructed to obey. | Preserve-as-prose. Translated `.pi/agents/*.md` bodies carry the same gate text unchanged; whether `pi-subagents`' `acceptance` field could formalize it is an open question but not required for a literal translation. |
| "ILLEGAL NESTING" no-sub-dispatch rule (`code.md`/`review.md` §0: LEAF-only, "NEVER create sub-tasks or dispatch sub-agents"; `code.md` additionally cites `permission.task: deny` blocking the Task tool "at the OpenCode runtime layer") | Body-prose convention plus (per the cited line) a runtime permission block that is itself OpenCode-specific, not a Claude Code mechanism. | Preserve-as-prose for the 11 LEAF agents. For the 2 dispatch-capable agents (`ai-council`, `orchestrate`), this is exactly spec.md §7's open question: does `pi-subagents` support nested subagent-of-subagent dispatch at all? UNCONFIRMED — routed to phase 1's live probe, blocking Tier 4 only. |
| Hook-injected advisor-context prose ("Treat hook-injected skill-advisor recommendations as routing hints only...", present in 12 of 13 agent bodies) | Descriptive prose acknowledging Claude Code's own `UserPromptSubmit`-style hook injecting skill-advisor context; not a frontmatter field. | Open-question, routed to `008-pi-hook-extension-layer`. Until that phase confirms whether Pi's native extension system exposes an equivalent lifecycle hook, this paragraph carries over unchanged as inert documentation — harmless if Pi has no equivalent, since it merely describes an external mechanism. |
| MCP tool wildcards (`mcp__mk_spec_memory__*`, `mcp__mk_code_index__*`) in `tools:` frontmatter (11 of 13 agents, see inventory table) | Claude Code's native tool-allowlist syntax supports wildcard MCP-server scoping directly in frontmatter. | Routed to `007-pi-mcp-host-integration`. Marked "MCP-dependent, full capability blocked pending phase 007" per agent rather than silently dropped from `tools:`. |
| `@agent`-style cross-references in body prose (e.g. "dispatch via `@orchestrate`", "dispatch `@markdown`", "offer an `@debug` dispatch") | Body-prose convention referring to sibling agent files by an `@`-prefixed bare name; not machine-parsed. | Preserve-as-prose, with a mechanical rename pass once spec.md §7's flat-vs-package-scoped naming question resolves (a bare `@code` reference stays correct only if the translated file keeps the bare `code` name rather than becoming `{package}.code`). |

### Data Flow
A future execution phase installs `pi-subagents` (`001`'s confirmed `pi install` verb), then authors `.pi/agents/**/*.md` in tier order, running `pi-subagents`' own discovery/list surface after each tier to confirm parse success before starting the next tier — so a schema error in a later tier never blocks the agents already proven to translate cleanly. Per the documented discovery order (builtin → installed-package → user `~/.pi/agent/agents/**/*.md` → project `.pi/agents/**/*.md`), project files win on name collision, so the flat/unpackaged naming recommended in spec.md §7 needs a one-time collision check against `pi-subagents`' own builtin agents directory before Tier 1 starts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.claude/agents/*.md` (13 files) | Canonical Claude Code agent-profile source; read live for this phase's inventory | Read-only; zero modifications | `git status` shows no changes under `.claude/agents/` |
| `.pi/agents/**/*.md` (13 files, future) | Does not exist yet | Not created by this phase — future execution phase only, per spec.md's Files-to-Change table | N/A this phase; future phase confirms via `pi-subagents`' discovery/list surface |
| `plan.md` (this file) | Placeholder template | Populate with the inventory/mapping/tier/disposition tables | `validate.sh --strict` on this phase folder |
| `package.json` (optional `pi-subagents.agents`/`pi.subagents.agents` registration path) | Not evaluated by this phase beyond flagging it as an alternative | No change | N/A — spec.md §7 recommends the loose-file route instead |

Matrix axes: MCP-dependency tier (1-4), frontmatter field status (confirmed/inferred/unknown), Claude-only-behavior disposition (preserve-as-prose/open-question/routed).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

These are the future execution phase's steps — not performed by this planning phase.

### Phase 1: Setup
- [ ] Confirm `pi` CLI is installed and the `pi install npm:<pkg>` verb syntax matches phase 1's live-probe result before installing `pi-subagents`.
- [ ] Re-run `find .claude/agents -name '*.md' | wc -l` at execution time to catch drift from this plan's 13-agent, 2026-07-27 snapshot.
- [ ] Install `pi-subagents` via `pi install npm:pi-subagents` (or the corrected verb if phase 1 found otherwise).

### Phase 2: Core Implementation
- [ ] Translate the 2 Tier 1 agents (`deep-improvement`, `prompt-improver`); confirm parse via `pi-subagents`' discovery/list surface before Tier 2.
- [ ] Translate the 5 Tier 2 agents (`code`, `debug`, `design`, `markdown`, `deep-research`), each flagged "capability blocked pending phase 007" for their single `mcp__mk_spec_memory__*` dependency.
- [ ] Translate the 4 Tier 3 agents (`context`, `deep-alignment`, `deep-review`, `review`), confirming named (non-wildcard) `mcp__mk_code_index__*` tool translation behavior.
- [ ] Translate the 2 Tier 4 agents (`ai-council`, `orchestrate`) only after the nested-dispatch open question resolves; document a capability loss if unsupported.

### Phase 3: Verification
- [ ] Confirm every translated file parses/loads without schema errors via `pi-subagents`' discovery surface — the exact 006→007 handoff criterion.
- [ ] Spot-check project-vs-global override semantics via a deliberate name collision.
- [ ] Run `validate.sh --recursive --strict` for phase 006 and the `031` parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source read | 13 real `.claude/agents/*.md` frontmatter, captured verbatim | Direct `Read`/`grep` |
| Schema citation | `pi-subagents` documented field list | Live `pi.dev` fetch (already captured in spec.md's continuity block) |
| Packet | Phase and parent doc consistency | `validate.sh --recursive --strict` |
| Live (future execution phase, not this phase) | `pi-subagents` discovery/list parse-success per tier | Manual `pi` session probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-pi-contract-pin` (pi CLI installed + `pi install` verb confirmed) | Internal | Planned | This phase's install-plan assumes the verb syntax; a mismatch blocks Phase 1 of the future execution work, not this planning doc. |
| `004-pi-skill-discovery-bridge` (skill-path resolution for "load `sk-code`" body prose) | Internal | Planned | Affects `inheritSkills`/`skills`/`skillPath` field values only; the rest of the translation plan is independent. |
| `007-pi-mcp-host-integration` (MCP stdio-transport support) | Internal | Planned | 11 of 13 agents lose their MCP capability in translation until this resolves; already flagged per-agent in the inventory table, not a blocker for the literal frontmatter translation itself. |
| `pi-subagents` package page (`https://pi.dev/packages/pi-subagents`) | External | Confirmed live 2026-07-27 | Docs can drift before execution; re-verify rather than trusting this snapshot indefinitely (per spec.md §6). |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future execution phase's live `pi-subagents` install or discovery/list probe contradicts any confirmed/inferred cell in this plan's field-mapping table (e.g. the package page updates, or a documented field behaves differently in practice).
- **Procedure**: Amend this plan.md's mapping/tier/disposition tables before any `.pi/agents/**/*.md` file is written or re-written. Because this phase creates no files under `.pi/` and installs no software, rollback here means only revising the planning document — there is no installed state or written agent file to revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: install + inventory confirm) ──────┐
                                                    ├──► Phase 2 (Tiered translation) ──► Phase 3 (Verify parse + override semantics)
Tier ordering (1→2→3→4, this plan's §3) ───────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-pi-contract-pin` | Core (tiered translation) |
| Core — Tier 1-2 | Setup | Core — Tier 3-4, Verify |
| Core — Tier 3 | Core — Tier 1-2; partially blocked pending `007`'s stdio-transport finding | Core — Tier 4 |
| Core — Tier 4 | Core — Tier 1-3; blocked pending the nested-dispatch open question | Verify |
| Verify | All 4 tiers translated (or Tier 4 explicitly documented as unsupported) | 006→007 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Estimates below are for the **future execution phase's** work (install, translate, verify) — this planning phase's own deliverable (plan.md/tasks.md/checklist.md) is complete once these documents validate clean.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (install + inventory confirm) | Low | 0.5-1 hour |
| Core — Tier 1-2 translation (7 agents, no/single MCP dependency) | Medium | 2-3 hours |
| Core — Tier 3-4 translation (6 agents, multi-MCP + cross-dispatch, contingent on `007`/nested-dispatch resolving first) | High | 3-5 hours |
| Verification (parse check + override semantics + recursive validate) | Low | 1 hour |
| **Total** | | **6.5-10 hours** (future execution phase) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — N/A, no `.pi/` files exist yet for this phase to back up.
- [ ] Feature flag configured — N/A, translation is additive file creation, not a flagged runtime path.
- [ ] Monitoring alerts set — N/A, no running service is affected by this planning phase.

### Rollback Procedure
1. If a future execution phase's live install/parse probe contradicts this plan's tables, stop translating further tiers immediately.
2. Revert only the affected plan.md table cells (git revert or manual edit) — no installed software or `.pi/` file exists yet at planning time, so there is nothing else to revert.
3. Re-run `validate.sh --strict` on phase 006 to confirm the corrected plan still validates.
4. No stakeholder notification required — this is an internal planning artifact with no user-facing or production surface.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — no `.pi/agents/**/*.md` files or `pi-subagents` install exist as of this phase; there is nothing to reverse.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->


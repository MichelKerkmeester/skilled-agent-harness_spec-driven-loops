---
title: "Feature Specification: Pi agent bridge (pi-subagents third-party translation)"
description: "Plan installing the third-party pi-subagents package and translating this repo's 13 real .claude/agents/*.md files (name/description/tools frontmatter, no model field) into pi-subagents' richer markdown+YAML schema at .pi/agents/**/*.md, with every unmapped or unconfirmed field flagged rather than guessed."
trigger_phrases:
  - "pi agent bridge"
  - "pi-subagents translation"
  - "pi subagent schema mapping"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/006-pi-agent-bridge"
    last_updated_at: "2026-07-27T10:08:00Z"
    last_updated_by: "claude-code"
    recent_action: "Design re-verified live, zero drift; planning phase complete"
    next_safe_action: "Commit; phase 007 proceeds with the MCP-dependency list"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Does pi-subagents support nested subagent dispatch (orchestrate.md needs it)?", "What is Pi's built-in tool-name vocabulary for the tools allowlist?", "Does tools allowlist support MCP-sourced names, under what convention?", "Which model IDs are valid; should translated agents pin one or omit it?"]
    answered_questions: ["Real agent count is 13, not 14 (brief) or 12 (stale README.txt) - confirmed via find", "None of the 13 real agent files declare a model field today - only name/description/tools", "pi-subagents schema confirmed live: name required, 14 more fields optional", "pi-subagents discovery order: builtin, installed-package, user, project (project wins)"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi agent bridge (pi-subagents third-party translation)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete - planning doctrine fully verified and re-derived live with zero drift; actual `pi-subagents` install and `.pi/agents/**/*.md` creation stay out of scope (deferred to a future execution phase) |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 11 |
| **Predecessor** | `005-pi-command-layer` |
| **Successor** | `007-pi-mcp-host-integration` |
| **Handoff Criteria** | Entry (from `005-pi-command-layer`): at least one sample command from each of the 8 command groups (`create/`, `deep/`, `doctor/`, `interface/`, `memory/`, `prompt/`, `speckit/`, plus the 2 top-level commands) dispatches correctly as a flattened `/name` prompt template with working `$1`/`$2`/`$@`/`${1:-default}` argument substitution. Exit (to `007-pi-mcp-host-integration`): `pi-subagents` is installed and every translated `.pi/agents/**/*.md` file parses/loads without schema errors. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the CLI Pi creation specification.

**Scope Boundary**: Plan (not build) the translation of this repo's 13 real `.claude/agents/*.md` role files into the third-party `pi-subagents` package's markdown+YAML schema at `.pi/agents/**/*.md`. This phase owns the field-mapping table, the translation-order tiering, and the explicit disposition of every Claude-runtime-specific behavior that has no confirmed `pi-subagents` equivalent. It does not install `pi-subagents`, does not write any file under `.pi/`, and does not modify `.claude/agents/*.md`.

**Dependencies**:
- `001-pi-contract-pin` confirms the real `pi` CLI is installed and the `pi install npm:<pkg>` verb syntax — this phase's install-plan assumes but does not itself verify that.
- `004-pi-skill-discovery-bridge` determines whether `.pi/settings.json`'s `skills` pointer resolves this repo's `.opencode/skills/` tree the way translated agent bodies assume when they say "load `sk-code`"/"load `sk-design`".
- `005-pi-command-layer` (direct predecessor) — loose cross-reference only; commands and agents are separate translation surfaces with no shared schema.
- `pi-subagents` package page (`https://pi.dev/packages/pi-subagents`) — live-fetched 2026-07-27 as this phase's primary schema source.

**Deliverables**:
- A per-agent field-mapping table covering all 13 `.claude/agents/*.md` files against `pi-subagents`' documented frontmatter schema, each field marked confirmed/inferred/unknown.
- A 4-tier translation order (no-MCP-dependency agents first, orchestration/cross-agent-dispatch-coupled agents last) with a stated rationale per tier.
- An explicit disposition (preserve-as-prose / open-question / routed-to-a-named-phase) for every Claude-only runtime behavior with no confirmed `pi-subagents` equivalent.
- A precise, mechanically-checkable acceptance bar for the 006→007 handoff criterion ("parses/loads without schema errors").

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repo's 13 real `.claude/agents/*.md` role files (confirmed via `find .claude/agents -name '*.md' | wc -l` = 13, not the 14 files this phase's driving brief assumed, and not the 12 the directory's own `README.txt` inventories — `README.txt` predates `deep-alignment.md` and is stale) encode Claude Code-specific runtime conventions — hard-block dispatch gates, an "ILLEGAL NESTING" no-sub-dispatch rule, hook-injected advisor-context prose, and MCP tool wildcards (`mcp__mk_spec_memory__*`, `mcp__mk_code_index__*`) in the `tools:` frontmatter field — that have no native Pi equivalent. Pi's own multi-agent surface exists only via a THIRD-PARTY community package, `pi-subagents` (author nicopreme/nicobailon, not affiliated with Pi's own maintainer earendil-works), whose real schema (confirmed live at `https://pi.dev/packages/pi-subagents`, 2026-07-27) is both richer (`model`, `fallbackModels`, `thinking`, `systemPromptMode`, `inheritProjectContext`, `inheritSkills`, `output`, `async`, `timeoutMs`, `turnBudget`, `acceptance`) and structurally different (an optional `package`-scoped `{package}.{name}` registration; a lowercase, lower-arity example `tools:` vocabulary) from Claude's minimal `name`/`description`/`tools` frontmatter — and several of its fields (the real built-in tool-name vocabulary, whether `tools:` can reference MCP-sourced tools at all, whether subagents can dispatch further subagents) are unconfirmed against this repo's actual usage.

### Purpose
Produce a concrete, falsifiable, per-agent translation plan — grounded in the real current `.claude/agents/*.md` frontmatter (read live, not assumed) and `pi-subagents`' documented schema (fetched live, not assumed) — that a future execution phase can follow to install `pi-subagents` and author `.pi/agents/**/*.md`, with every unmapped or unconfirmed field explicitly flagged rather than silently guessed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory all 13 real `.claude/agents/*.md` files with their actual `name`/`description`/`tools` frontmatter (captured verbatim in `plan.md` §3), and reconcile the 13-vs-14-vs-12 count discrepancy.
- A field-by-field mapping table: Claude frontmatter field → `pi-subagents` frontmatter field, each cell marked confirmed (cites the live pi.dev fetch or a real file read) / inferred / unknown.
- A 4-tier translation order (see `plan.md` §3 Architecture) with rationale, prioritizing agents with no MCP dependency and no cross-agent dispatch coupling.
- A plan for verifying `pi install npm:pi-subagents` succeeds and that the documented discovery order (builtin → installed-package → user `~/.pi/agent/agents/**/*.md` → project `.pi/agents/**/*.md`, project wins on name collision) behaves as documented — the verification itself happens in a later execution phase, not this one.
- A plan for confirming Pi's real built-in tool-name vocabulary before mapping Claude's `Read`/`Write`/`Edit`/`Bash`/`Grep`/`Glob` (+ MCP wildcards) onto `pi-subagents`' `tools:` allowlist.
- An explicit non-decision on `model:`/`thinking:` values — deferred to `009-pi-model-registry-and-routing`, consistent with the precedented lesson that a competitor CLI's model/effort syntax must be live-confirmed, never assumed.

### Out of Scope
- Actually running `pi install npm:pi-subagents` or writing any file under `.pi/` — execution work for a later phase, not this planning phase.
- MCP tool wiring inside `pi-subagents`' `tools:` allowlist beyond flagging the dependency — owned by `007-pi-mcp-host-integration`.
- Translating each agent's markdown body prose (the "load `sk-code`" style instructions) — those bodies carry over largely as-is; only the frontmatter schema and skill-path resolution change, and skill-path resolution itself is `004-pi-skill-discovery-bridge`'s concern.
- Devin's/Cursor's own agents-parity phases (`029-cli-devin-revival/015-devin-agents-skills-rules-parity`, `030-cli-cursor-creation/014-cursor-agents-skills-rules-parity`) — different CLIs, tracked separately, not force-fit as precedent here since neither CLI has a shared-schema third-party subagent package like `pi-subagents`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/agents/**/*.md` (13 files, exact slugs/paths TBD pending live discovery-path confirmation in a future execution phase) | Create (future phase — **not created by this phase**) | Translated subagent profiles, one per real `.claude/agents/*.md` source. |
| `package.json` (`pi-subagents.agents` or `pi.subagents.agents` array, optional alternative registration path) | Create/Modify (future phase, optional) | Only if the packaged-agent registration route is preferred over loose `.pi/agents/**/*.md` files — this phase recommends the loose-file route for name parity with `.claude/agents/*.md` (see §7 Open Questions). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A complete, field-by-field translation-mapping table covers all 13 real `.claude/agents/*.md` files against `pi-subagents`' documented schema, every field marked confirmed/inferred/unknown. | `plan.md` §3 Architecture contains the table; zero cells are asserted without a citation to either the live `pi.dev/packages/pi-subagents` fetch or a direct `.claude/agents/*.md` read. |
| REQ-002 | The 13-vs-14-vs-12 agent-count discrepancy (this phase's driving brief vs the live `find` count vs the stale `README.txt`) is documented with the exact command evidence. | spec.md §2 states the count with the `find` evidence and flags `README.txt` as stale (missing `deep-alignment.md`). |
| REQ-003 | Every Claude-runtime-specific behavior with no confirmed `pi-subagents` equivalent (hard-block dispatch gates, ILLEGAL NESTING, hook-injected advisor context, MCP tool wildcards, `@agent`-style cross-references) is enumerated and assigned an explicit disposition. | `plan.md` §3 contains a dedicated table listing each behavior, its Claude mechanism, and its disposition — none silently dropped. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The 13 agents are grouped into a tiered translation order (no-MCP-dependency first, orchestration/cross-agent-dispatch-coupled last) with a stated rationale per tier. | `plan.md` §3 contains the tier table; each tier's rationale cites the real `tools:` frontmatter driving the grouping. |
| REQ-005 | The 006→007 handoff criterion ("parses/loads without schema errors") is defined precisely enough for a later execution phase to check it mechanically. | spec.md §5/§7 states the exact confirmation mechanism (a `pi-subagents` discovery/list surface, once confirmed live in execution) rather than a vague "looks right" bar. |
| REQ-006 | No specific `model:` ID or `thinking:` (effort) value is hardcoded into the translation plan for any agent. | spec.md/plan.md explicitly defer `model:`/`thinking:` selection to `009-pi-model-registry-and-routing`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The mapping table covers all 13 agents × every applicable `pi-subagents` field, each cell justified by a citation.
- **SC-002**: Every identified Claude-only runtime behavior has a documented disposition — none silently dropped.
- **SC-003**: Phase 006 `validate.sh --strict` passes 0 errors / 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `pi-subagents`' real built-in tool-name vocabulary may not match Claude's `Read`/`Write`/`Edit`/`Bash`/`Grep`/`Glob` names at all — the only documented example (`read, grep, find, ls, bash`) is lowercase and of unconfirmed completeness. | Medium | Treat every `tools:` line as UNKNOWN pending live confirmation of Pi's canonical tool-name vocabulary (routed to phase 1); never ship a translated file with an unverified `tools:` allowlist. A translated file must never grant tool access broader than its Claude source's `tools:` line implies — err narrower when a Claude tool has no confirmed Pi equivalent. |
| Risk | MCP-wildcard tool entries (`mcp__mk_spec_memory__*`, `mcp__mk_code_index__*`) appear in 10 of the 13 Claude agents but have no confirmed `pi-subagents` equivalent, since MCP itself is a separate third-party extension (`pi-mcp-extension`, phase 007) with unconfirmed stdio-transport support. | High | Explicitly mark MCP-dependent agents "MCP-dependent, full capability blocked pending phase 007" in the mapping table rather than shipping a `tools:` line that silently drops MCP capability. |
| Risk | `pi-subagents` is a single-maintainer, third-party community package, not covered by Pi's own MIT core — version/compatibility drift risk if it lags core Pi releases. | Medium | Recommend pinning the installed version once confirmed live (phase 1/6 execution), not floating `latest`. |
| Risk | `orchestrate.md`'s core mechanism (dispatching other agents via the `Agent` tool) may have no `pi-subagents` equivalent if subagents cannot dispatch further subagents — UNCONFIRMED from the live fetch. | High | Live-check nested-dispatch support before translating `orchestrate.md`/`ai-council.md`; if unsupported, document as a hard limitation rather than force a translation that silently loses the orchestration capability. |
| Risk | Because `pi-subagents` is third-party and single-maintainer, a translated file that references an undocumented, plausible-sounding field would silently fail or be ignored. | Low | Only use frontmatter fields documented on the package's own page (name/package/description/tools/model/fallbackModels/thinking/systemPromptMode/inheritProjectContext/inheritSkills/skills/skillPath/output/async/timeoutMs/turnBudget/acceptance) — no guessing at additional fields. |
| Dependency | `001-pi-contract-pin` confirms `pi` CLI installed and the `pi install` verb. | Planned/pending | This phase's install-plan assumes but does not itself verify — flagged, not silently relied upon. |
| Dependency | `004-pi-skill-discovery-bridge` outcome (whether "load `sk-code`" references in agent bodies resolve under Pi). | Planned/pending | Agent-body text is out of this phase's scope (§3 Out of Scope) but the dependency is named so a later execution phase does not assume it. |
| Dependency | `https://pi.dev/packages/pi-subagents` page availability/accuracy. | Confirmed live 2026-07-27 via WebFetch | Docs can drift; re-verify at execution time rather than trusting this phase's snapshot indefinitely. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `pi-subagents` support nested subagent-of-subagent dispatch (needed to preserve `orchestrate.md`'s `Agent`-tool mechanism), or is dispatch flat/one-level only? UNCONFIRMED — route to phase 1's live probe, or this phase's own execution follow-up.
- What is Pi's canonical built-in tool-name vocabulary (needed to correctly populate `tools:`)? UNCONFIRMED beyond the `pi-subagents` example's `read, grep, find, ls, bash` — route to phase 1.
- Does the `tools:` allowlist support MCP-sourced tool names at all, and under what naming convention? UNCONFIRMED — route to phase 7.
- Which `model:` IDs are valid for Pi's multi-provider setup, and should translated agents pin an explicit model or omit the field (falling back to the active session provider)? Route to phase 9.
- Should this repo register its 13 agents under a `package:` scope (yielding `{package}.{name}`, e.g. `mk-agents.code`) or as flat, unpackaged `.pi/agents/**/*.md` files (yielding bare names like `code`, `review` that match `.claude/agents/*.md` most closely)? This phase recommends flat/unpackaged for name parity, but flags it as a judgment call pending a name-collision check against `pi-subagents`' own builtin agents directory (`~/.pi/agent/extensions/subagent/agents/`).
- Does `pi install npm:pi-subagents` succeed exactly as the inferred syntax states? Already flagged in phase 1; noted here since it directly blocks this phase's own execution follow-up.
<!-- /ANCHOR:questions -->

---

## Related Documents
- `plan.md`, `tasks.md`, `checklist.md`
- `../005-pi-command-layer/spec.md` (predecessor)
- `../007-pi-mcp-host-integration/spec.md` (successor — owns the MCP-dependent agents' remaining gap)
- `.claude/agents/*.md` (13 real source files, read live for this phase)
- `https://pi.dev/packages/pi-subagents` (live-fetched schema source, 2026-07-27)
- `../../029-cli-devin-revival/015-devin-agents-skills-rules-parity/spec.md` (sibling precedent — different CLI, different mechanism; consulted for structure/tone only, not force-fit)
- `../../030-cli-cursor-creation/014-cursor-agents-skills-rules-parity/spec.md` (sibling precedent — same caveat)

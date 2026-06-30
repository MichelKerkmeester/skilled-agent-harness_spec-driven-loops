---
title: "105: cli-devin v1.0.4.0 — SWE-1.6 effectiveness improvements from 999 retrospective"
description: "Ship 8 cli-devin / deep-loop improvements identified from the 40-iter cli-devin SWE-1.6 run under packet 999. Forces sequential_thinking MCP on every cli-devin dispatch, eliminates the 72.5% stdout-fallback boilerplate, closes the 22.5% JSONL miss rate, prevents 6h silent hangs, and tightens prompt-template invariants."
trigger_phrases:
  - "105 spec"
  - "cli-devin effectiveness"
  - "swe-1.6 retrospective improvements"
  - "sequential_thinking mandatory"
  - "cli-devin v1.0.4.0"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/085-cli-devin-effectiveness-improvements"
    last_updated_at: "2026-05-16T05:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 105 packet from 999 retrospective findings"
    next_safe_action: "Dispatch 3 parallel opus agents on disjoint file sets"
    blockers: []
    key_files:
      - ".opencode/skills/cli-devin/SKILL.md"
      - ".opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json"
      - ".opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json"
      - ".opencode/skills/cli-devin/assets/agent-config-synthesis.json"
      - ".opencode/skills/cli-devin/references/deep-loop-iter-contract.md"
      - ".opencode/skills/cli-devin/references/agent-config-recipes.md"
      - ".opencode/skills/cli-devin/assets/deep-loop-iter-template.md"
      - ".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
    session_dedup:
      fingerprint: "sha256:adef9e86e2a4be45dd3d41f04e2c530337b33b010ea99aa256a97472ec9f2528"
      session_id: "105-spec-scaffolded"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Can we force SWE-1.6 to always use sequential_thinking MCP? YES — via agent-config `mcp_servers` field + system_instructions mandate. Requires devin mcp add sequential_thinking first."
      - "What was the boilerplate root cause? Read-only recipe forces devin to print to stdout with 'I cannot write...' preamble. 29/40 iter affected."
      - "What was the JSONL miss rate? 9/40 (22.5%). Root cause: prompts that back-referenced 'Same heading structure as iter 001-002' instead of inlining the JSONL row spec."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 105: cli-devin v1.0.4.0 — SWE-1.6 effectiveness improvements

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Driver retrospective** | packet 999 (40-iter cli-devin SWE-1.6 deep-research run) |
| **cli-devin version target** | v1.0.4.0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 40-iter cli-devin SWE-1.6 run for packet 999 surfaced clear improvement targets:

- 29/40 iter (72.5%) emitted stdout-fallback boilerplate ("I cannot write files...") because the research-iter recipe is read-only, wasting tokens and creating dispatch noise
- 9/40 iter (22.5%) omitted the required JSONL state-row because prompts back-referenced "Same heading structure as iter 001-002" instead of inlining the row spec
- 1/40 iter (2.5%) hung for 6+ hours silently before manual kill; dispatcher has no per-iter timeout
- 1/40 iter (2.5%) hard-failed with "A tool was rejected by the user" inside `--permission-mode auto` (Devin runtime approval gate fired anyway)
- Citation density varies 0-69 ref_tags per iter; proposal-style iter often produce prose without explicit `<ref_file>` tags
- SWE-1.6 lacks the reasoning depth of larger models; it benefits dramatically from structured pre-thought via sequential_thinking MCP, which is currently not required in cli-devin dispatches

### Purpose

Ship cli-devin v1.0.4.0 with 8 concrete improvements that lift SWE-1.6 output quality measurably across the next deep-loop run. Mandate sequential_thinking MCP usage on every cli-devin dispatch regardless of model.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

8 improvements (I-001 through I-008), grouped into 3 disjoint file-set buckets for parallel execution:

**Bucket A — Recipe + MCP registration (Agent 1, opus):**

- I-001 Register `sequential_thinking` MCP server with devin via `devin mcp add`
- I-002 Update all 3 agent-config recipes (`agent-config-deep-research-iter.json`, `agent-config-deep-review-iter.json`, `agent-config-synthesis.json`) to: (a) include `mcp_servers: ["sequential_thinking"]`, (b) grant narrow Write scope where appropriate (research-iter + review-iter for their own iter file + JSONL only), (c) update `system_instructions` to MANDATE sequential_thinking use before producing output

**Bucket B — SKILL.md + references + assets (Agent 2, opus):**

- I-003 Bump cli-devin SKILL.md to `v1.0.4.0`; add ALWAYS rule "sequential_thinking is mandatory pre-output for all dispatches"; document the recipe updates
- I-004 Update `references/deep-loop-iter-contract.md` with: (a) sequential_thinking section, (b) per-iter prompt invariants (inline output contract, no back-references, explicit ref_tag requirement)
- I-005 Update `references/agent-config-recipes.md` schema reference + per-recipe rationale to reflect the new mcp_servers + Write scope
- I-006 Update `assets/deep-loop-iter-template.md` to demand: inline JSONL row per prompt, explicit `<ref_file>` citation tags for every claim, no preamble before the first H1

**Bucket C — YAML dispatchers + per-iter timeout (Agent 3, opus):**

- I-007 Update `if_cli_devin:` branches in `deep_start-research-loop_auto.yaml` AND `deep_start-review-loop_auto.yaml`: add per-iter `gtimeout 900` wrapper, detect "A tool was rejected" stderr pattern and skip that iter, log dispatch quality (degraded if boilerplate detected)
- I-008 Update the iter-prompt rendering helper (if any exists separately from the recipes) to strip boilerplate preamble from devin stdout before writing to iter file (`sed -n '/^# Iter/,$p'` pattern)

### Out of Scope

- Refactoring how cli-codex / cli-opencode / cli-claude-code / cli-gemini handle their own MCP servers — only cli-devin in this packet
- Backporting these changes to packet 999 in-flight (999 keeps its v1.0.3.0 recipe; the 105 improvements apply to the NEXT deep-loop run)
- Changing the iter template's structural anchors — the `Framework: STAR/RCAF/BUILD` + pre-planning + scoped RQ + output contract pattern stays
- Adding a Write tool to synthesis recipe (it already has narrow Write scope from packet 059)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | Run `devin mcp add sequential_thinking npx @modelcontextprotocol/server-sequential-thinking@2025.12.18` so devin's runtime knows the server |
| REQ-002 | All 3 cli-devin agent-config JSONs include `mcp_servers: ["sequential_thinking"]` |
| REQ-003 | All 3 recipes' `system_instructions` arrays include a mandatory clause: "Before producing the output, you MUST call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts covering pre-planning, evidence reading, finding extraction, gap analysis, and JSONL row composition" |
| REQ-004 | research-iter + review-iter recipes grant narrow Write scope: `Write(<packet-root>/research/iterations/iteration-*.md)` + `Write(<packet-root>/research/deep-research-state.jsonl)` |
| REQ-005 | cli-devin SKILL.md frontmatter version: `1.0.4.0`; new ALWAYS rule documents the mandate |
| REQ-006 | All 3 reference docs (`deep-loop-iter-contract.md`, `agent-config-recipes.md`) and 1 asset (`deep-loop-iter-template.md`) reflect the new mandate |
| REQ-007 | Both YAML `if_cli_devin:` branches wrap the devin invocation in `gtimeout 900`; detect "A tool was rejected" + skip; mark JSONL row `dispatch_quality: degraded` when boilerplate pattern detected in output |
| REQ-008 | Strict-validate exits 0 on the 105 packet AND on every touched file via sk-doc |
| REQ-009 | All recipes parse via Devin's strict parser smoke-test post-update |
| REQ-010 | Final commit on `main` ships the v1.0.4.0 bundle |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- cli-devin SKILL.md frontmatter shows `version: 1.0.4.0`
- All 3 recipes parse via `devin -p --agent-config <recipe> --model swe-1.6 --permission-mode auto -- "say ok then stop"` with exit 0
- `devin mcp list` shows `sequential_thinking` in the server list
- A smoke iter dispatched with the new research-iter recipe writes to its iter file DIRECTLY (no stdout boilerplate)
- The smoke iter's iter file shows `mcp__sequential_thinking__sequentialthinking` was invoked (visible in devin's tool-trace output)
- Packet 105 strict-validate exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Devin's MCP runtime can't find sequential_thinking even after `devin mcp add` | Medium | High | Smoke-test post-registration; if discovery fails, the recipe falls back to instructions-only mandate (SWE-1.6 may use the tool less reliably but still benefits) |
| Adding Write scope to research-iter recipe widens RM-8 destructive risk surface | Low | Medium | Allowlist is NARROW (only 2 specific path globs); deny list still blocks rm/mv/cp/git destructive Exec |
| Sequential_thinking adds 5-15s per iter (5-10 thoughts × 1-2s each) | High | Low | Net win: better SWE-1.6 quality outweighs the ~10% latency increase per iter |
| Bucket A + Bucket B + Bucket C agents touch overlapping files | Low | Medium | File-set partition documented in §3 Scope; each agent's brief enumerates its file list |
| Existing 999 packet (in-flight codex loop) reads pre-v1.0.4.0 recipes | None | None | 999 keeps v1.0.3.0 recipes — 105 changes apply to the NEXT deep-loop run, not in-flight ones |

### Dependencies

- Packet 999 retrospective findings (this packet's research justification — see `research/retrospective.md`)
- cli-devin v1.0.3.0 shipped in packet 059 (baseline)
- Devin CLI v2026.5.6-8+ (confirmed working with current schema)
- sequential_thinking MCP server at `npx @modelcontextprotocol/server-sequential-thinking@2025.12.18`
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Cost**: changes are doc + config; zero runtime cost. Each cli-devin iter post-update adds ~10s for sequential_thinking but saves ~30s of boilerplate generation = net faster
- **Safety**: Write scope additions are NARROW; recipes stay schema-validated by Devin's strict parser
- **Backward compatibility**: 105 ships forward-only; existing 999 run continues with v1.0.3.0
- **Idempotency**: every recipe / SKILL / reference change is a pure replace; running the update twice is a no-op
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Devin MCP server not on PATH**: `devin mcp add` succeeds but the runtime can't launch sequential_thinking — system_instructions mandate becomes the only enforcement; SWE-1.6 may skip the tool call. Detection: smoke-test post-registration looks for the tool invocation in stderr trace
- **Narrow Write scope rejected by Devin**: if Devin's strict parser rejects `Write(<packet-root>/...)` glob, fall back to broader `Write(<repo-root>/.opencode/specs/**/research/iterations/iteration-*.md)`
- **Existing in-flight codex loop iter 041-050**: continues using v1.0.3.0 recipes (no change); 105 changes apply to NEXT loop
- **Operator on a stale devin binary**: register fails. Detection: `devin --version` check before registration
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should we also force sequential_thinking on cli-codex / cli-opencode dispatches? Likely no — those models have stronger native reasoning. Tracking for follow-on packet if SWE-1.6 improvements work.
- Should the iter-prompt template ship a `<sequential_thinking_count>5</sequential_thinking_count>` hint that the dispatcher passes to devin as an env var? Could drive minimum thought count from the operator side. Tracked for v1.0.5.0.
<!-- /ANCHOR:questions -->

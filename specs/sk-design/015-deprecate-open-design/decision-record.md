---
title: "Decision Record: Deprecate sk-design mcp-open-design transport skill and remove all live references"
description: "ADRs: full removal, native review dispatch, historical-record preservation."
trigger_phrases:
  - "deprecate open design"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/015-deprecate-open-design"
    last_updated_at: "2026-08-10T14:09:15Z"
    last_updated_by: "remnant-remediation"
    recent_action: "Removed residual transport contracts"
    next_safe_action: "None — remnant remediation verified"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-mcp-open-design/"
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deprecate-open-design-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Deprecate sk-design mcp-open-design transport skill and remove all live references

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Deprecate the Open Design MCP transport by full removal, not stubbing

<!-- ANCHOR:adr-001-context -->
### Context

The `sk-design-mcp-open-design` skill (45 files: SKILL.md, transport/*.mjs, scripts, references, feature-catalog, manual-testing-playbook, fixtures, tests, changelogs) packages the Open Design desktop-app MCP transport (`od` CLI + stdio MCP server + `open_design` registration in `.utcp_config.json`). The operator decided to retire the transport entirely. A pre-review sweep found 130+ files referencing `mcp-open-design`, `design-mcp-open-design`, or `Open Design` across the main workspace, including live routing surfaces (sk-design hub, mode registry, agents, commands, install guides, deep-alignment adapters, advisor corpus, doc fixtures, root docs). Leaving a stub or deprecated marker would keep those surfaces alive and require maintaining a dead contract.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Remove the skill tree completely (no stub), strip every live reference, and gate completion on a zero-residue grep over a frozen live-surface allowlist plus `validate.sh --strict`. Historical records — `specs/` packets (incl. `006-design-mcp-open-design`, `014-template-conformance/005-design-mcp-open-design`), changelog history, dated benchmark reports and `.private.json` benchmark corpora, sqlite memory/advisor/graph databases, and `.worktrees/` checkouts — are intentionally preserved as records and are out of the edit scope. The review packet adjudicates borderline classes (benchmark fixtures, compiled-routing canary fixture) before edits.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| Deprecation stub (SKILL.md + "DEPRECATED" banner, keep tree) | Keeps 45 dead files + every routing reference alive; fails the "deprecate completely" instruction |
| Move to `z_archive/` | `z_archive` is a specs/ convention; skills have no archive tree, and a moved skill is still discoverable/loaded by the advisor |
| Leave historical references in live docs | Stale routing claims mis-route future sessions and fail audits |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- **Positive**: Zero live surface points at a removed capability; single grep gate makes the deprecation provable.
- **Negative + mitigation**: Historical records will mention the transport indefinitely — accepted, they are records; the residue gate scopes to the live allowlist.
- **Negative + mitigation**: Derived artifacts (leaf-manifest, description.json, advisor corpus, sqlite indexes) still contain old content until regenerated — regenerated during implementation; sqlite re-indexed by scan, not hand-edited.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Answer |
|-------|--------|
| Is it reversible? | Yes — git restore of the deleted tree and edited files |
| Are the facts in the room? | Yes — inventory from grep sweeps + review iterations |
| Does it serve the goal? | Yes — "deprecate completely" |
| Does it create new obligations? | Regeneration of derived manifests + advisor corpus |
| Can it be validated? | Yes — residue grep, JSON parse, validate.sh --strict |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

- Delete `.opencode/skills/sk-design/sk-design-mcp-open-design/`.
- Remove `open_design` entry from `.utcp_config.json`.
- Strip references per the review inventory (REQ-003/004).
- Regenerate derived manifests; re-run residue gate; validate.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Run the 10-iteration deep review via native pi subagents with GPT-5.6 Luna (max thinking, fast tier)

<!-- ANCHOR:adr-002-context -->
### Context

The operator required 10 deep-review iterations using GPT-5.6 Luna MAX FAST with native pi subagents. The deep-review packet's loop is nominally owned by opencode's YAML command workflow (executor kinds: `native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-devin`, `cli-pi` — verified in `runtime/lib/deep-loop/executor-config.ts`). This session runs on the pi runtime, which does not execute those opencode YAML workflows; the operator explicitly selected native in-process subagents over any cli-* route (the dispatch directive also defaults to the native pi-subagents plugin and forbids cli-* routes unless the user names one).
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

This session is the loop owner (the YAML-equivalent role): it initializes the review packet, dispatches one LEAF `deep-review` iteration per pass through the native pi-subagents plugin (agent `deep-review` at `.pi/agents/deep-review.md`, model `openai-codex/gpt-5.6-luna`, thinking level max, service tier fast), validates each iteration's outputs (iteration file + JSONL delta), checks convergence gates, and synthesizes `review-report.md`. `reduce-state.cjs` remains the single state writer for registry/dashboard/strategy refresh, exactly as in the opencode workflow. This maps to executor kind `native` (dispatch the @deep-review agent) on the pi runtime.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| cli-pi executor kind (shell out to pi CLI per iteration) | Operator explicitly asked for native in-process subagents; cli-* route not named by the user; adds a shell layer without state-machine benefit |
| Hand-rolled parallel dispatcher script | Forbidden by the deep-review packet (no ad-hoc shell fan-out) |
| Skip the review, edit directly from the sweep | Violates the operator's 10-iteration requirement |
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- **Positive**: Operator's explicit dispatch choice honored; state artifacts match the canonical packet contract (config, JSONL, deltas, registry, dashboard, iterations, report).
- **Negative + mitigation**: No YAML orchestrator guards the loop — the orchestrator validates every iteration output after dispatch and halts on 3 consecutive failures; per-run model/thinking/service-tier params are proven on the first dispatch and corrected if unsupported.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks

| Check | Answer |
|-------|--------|
| Is it reversible? | Yes — review packet is additive and deletable |
| Are the facts in the room? | Verified: executor kinds (executor-config.ts:11), model in models-store.json + enabledModels, plugin in .pi/settings.json, LEAF agent at .pi/agents/deep-review.md |
| Does it serve the goal? | Yes — "10 iters of deep review using GPT 5.6 LUNA MAX FAST (native pi subagents)" |
| Does it create new obligations? | Orchestrator-side validation of every iteration artifact |
| Can it be validated? | Yes — 10 iteration files, 10 JSONL records, report verdict, reducer refresh |
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

- Init `review/` packet (config with `maxIterations: 10`, strategy, registry, JSONL).
- Dispatch iterations 001-010 via `subagent` (workflowScript `runs.run`, agent `deep-review`, model `openai-codex/gpt-5.6-luna`, thinking max, service tier fast).
- After each: validate outputs, run `reduce-state.cjs`, adjudicate P0/P1 claims.
- Synthesize `review/review-report.md`; save continuity.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Preserve historical records; edit only the live-surface allowlist

<!-- ANCHOR:adr-003-context -->
### Context

The sweep hits ~130 files, but many are records of the past: spec packets for the transport, changelog history, dated benchmark reports and fixture corpora, and sqlite indexes. Rewriting history would destroy audit trail and is explicitly out of the operator's request (remove references to a live surface; deprecate the skill).
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

Edits are restricted to a frozen live-surface allowlist (`git ls-files` minus documented exclusions). Historical files are never modified. The residue gate's scope is the allowlist, and the gate excludes nothing silently — every exclusion class is enumerated in `spec.md` §3 and re-checked in the final diff review.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| Rewrite historical docs/specs to remove mentions | Destroys audit trail; violates record-preservation |
| Edit sqlite DBs by hand | Regenerated by indexing; hand-edits are corruption risk |
| Modify `.worktrees/` checkouts | Separate workspaces; out of main-workspace blast radius |
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- **Positive**: Audit trail intact; blast radius bounded and reviewable in one diff.
- **Negative + mitigation**: Future greps over the whole repo (incl. history) will still match — accepted; the packet documents this in the report and checklist evidence.
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks

| Check | Answer |
|-------|--------|
| Is it reversible? | Yes — git |
| Are the facts in the room? | Yes — inventory classification |
| Does it serve the goal? | Yes — scoped deprecation |
| Does it create new obligations? | Exclusion list maintenance in spec/checklist |
| Can it be validated? | Yes — final `git status` diff review |
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation

- Freeze allowlist in scratch/ before edits.
- After edits: full `git status` review proving zero historical files changed.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---
title: "Implementation Plan: Phase 1: cli-versus-mcp"
description: "How the two Obsidian app-backed surfaces were measured: the evidence runner, the two app states, the vault-safety rules, and the gates that had to pass before the deliverable could claim a default."
trigger_phrases:
  - "obsidian surface measurement plan"
  - "cli versus mcp runners"
  - "evidence runner no pipe"
  - "vault safety rules"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: cli-versus-mcp

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and Node 20 runner scripts, Markdown deliverables |
| **Framework** | None. Two ad-hoc runners under `scratch/` |
| **Storage** | One evidence file per invocation under `scratch/evidence/` |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `generate-leaf-manifest.cjs --check`, `validate.sh --strict --recursive` |

### Overview
Drive both surfaces against the operator's live vault and write down what happens. The official CLI is invoked through a runner that writes stdout, stderr, exit status and elapsed time to four separate files, because the CLI exits 0 on failure once the app is up and a pipe would hide the only signal that remains. The MCP server is driven by two stdio JSON-RPC clients: one that starts a fresh process per call to measure cold cost, and one that holds a single session so warm per-call latency is separable from startup.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measurement runners plus documentation. No runtime code ships.

### Key Components
- **`scratch/runt.sh`**: runs one CLI invocation under a portable timeout and writes `<id>.out`, `<id>.err`, `<id>.rc`, `<id>.ms`. A first version without the timeout was replaced after `property:remove` stalled past two minutes
- **`scratch/mcpcall.cjs`**: one MCP call per server process. Measures cold cost and the app-down failure shape
- **`scratch/mcpseq.cjs`**: many calls in one server session, timing each. Declares the `elicitation` capability and auto-accepts, which is what `obsidian_delete_note` requires
- **`references/cli-versus-mcp.md`**: the deliverable. Every cell traces to a recorded invocation

### Data Flow
A capability list drives a batch of invocations. Each writes its four evidence files. The files are read back to fill the comparison table, so no number in the deliverable was carried in memory from the terminal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/cli-versus-mcp.md` | New. Owns the default | create | Both gates pass, and the file is in the hub leaf manifest |
| `README.md` router, when-to-use, FAQ | Tells an agent which surface to reach for | update | Router table and FAQ name the CLI as the app-backed default |
| `references/mcp-tools.md` §4, §5, §9 | Described the MCP as a peer of the CLI and carried a wrong inventory | update | 12 exposed of 14 built, v0.12.3, the specialist role |
| `references/obsidian-cli-commands.md` §3, §8 | Profile selection between the two CLIs | update | Names the app-backed default, records the tag write-gap |
| `references/official-cli-agent-usage.md` §5, §7, §10 | The CLI's own agent contract | update | Surface selection, the `daily:read` hazard, two settled unknowns |
| `manual-testing-playbook/manual-testing-playbook.md` §9, §10, §11 | Says what a scenario must exercise | update | Tool count, the enabled-versus-installed distinction, the elicitation requirement |
| `SKILL.md` | Compiled-policy input | not a consumer of this change | Prepared text recorded in `spec.md` §13, file untouched |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live measurement | Every capability family on both surfaces, in both app states | `runt.sh`, `mcpcall.cjs`, `mcpseq.cjs` |
| Negative control | App down, plugin disabled, missing file, unknown command, unknown vault, name collision | The same runners, results read from files |
| Document gates | Every file written or edited | `validate_document.py`, `hvr_scan.py` |
| Packet gate | The whole 019 tree | `repair-derived.cjs --apply` then `validate.sh --strict --recursive` |
| State restoration | Vault, plugin, app | File counts before and after, `obsidian plugin id=`, `pgrep -x Obsidian` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Obsidian desktop 1.13.7 | External | Green | The app-up half cannot run |
| `obsidian-local-rest-api` v5.1.0 | External | Yellow, found disabled | Every MCP vault call fails with `fetch failed` |
| `obsidian-mcp-server` via `npx` | External | Green, resolved to v0.12.3 | No MCP measurement |
| `OBSIDIAN_API_KEY` in `.env` | Internal | Green | MCP calls return 401 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a scratch note survives the run, the plugin is left enabled, or the app is left running
- **Procedure**: `obsidian delete file=<scratch> permanent` for each note the run created, `obsidian plugin:disable id=obsidian-local-rest-api` to restore the plugin, `osascript -e 'quit app \"Obsidian\"'` to close the app. The documentation changes revert with `git checkout -- <path>`, since nothing was committed
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Runner scripts and the app-closed baseline |
| Core Implementation | High | Both surfaces, both states, every capability family |
| Verification | Medium | Four gates plus state restoration |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Evidence runners | None | Four files per invocation | App-closed run, app-open run |
| App-closed run | Evidence runners | The launcher failure contract | The deliverable |
| App-open run | Evidence runners, running app, enabled plugin | The capability matrix and the timings | The deliverable |
| Deliverable | Both runs | `cli-versus-mcp.md` | The README and reference edits |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **App-closed baseline on both surfaces** - CRITICAL. It must run before the app is launched, and it cannot be repeated without quitting again
2. **Enable the REST plugin, run the app-open matrix, restore the plugin** - CRITICAL. The MCP half is impossible without this, and leaving the plugin on is a state change the operator did not ask for
3. **Vault restoration and the four gates** - CRITICAL

**Total Critical Path**: the whole run, since the two app states are mutually exclusive.

**Parallel Opportunities**:
- The document edits and the leaf-manifest regeneration can follow in any order once the deliverable exists
- Nothing in the measurement itself parallelizes, because both surfaces share one app and one vault
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | App-closed baseline recorded | Ten CLI commands at exit 1, MCP `tools/list` succeeding, app confirmed still closed | Done |
| M2 | App-open matrix complete | Every capability family exercised on both surfaces, timings captured | Done |
| M3 | Deliverable and skill updated | Both gates green, leaf manifest OK, state restored | Done |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The official CLI is the default app-backed surface

**Status**: Accepted

**Context**: The skill described both surfaces without ranking them. Three measurements settled it. Prerequisites: the CLI needs the running app, the MCP server also needs an enabled Local REST API plugin, a bearer token and a Node process. Coverage: 106 commands against 12 tools. Availability: the plugin was disabled in this vault, so the MCP path was dead as configured.

**Decision**: default to the official CLI, wrapped in a stdout error check. Escalate to the MCP server only for in-place section patching, in-note search-and-replace, tag-list writes, JSON-typed frontmatter, or a batch over roughly 20 calls.

**Consequences**:
- An agent stops re-deciding the surface per task, and gets the wider capability set by default
- The CLI's exit-0 failure contract and active-file default become the agent's problem. Mitigated by the wrapper in `cli-versus-mcp.md` §6, which is eight lines
- The better-designed error surface goes unused most of the time. Accepted, because a surface that is switched off cannot be a default

**Alternatives Rejected**:
- Default to the MCP server: it is the safer API, with typed errors, a mandatory explicit target and a create that refuses collisions, but it does less and was not switched on
- Leave the choice to the reader: that is the status quo this phase exists to end

### ADR-002: Enable the REST plugin for the measurement, then restore it

**Status**: Accepted

**Context**: `obsidian-local-rest-api` v5.1.0 was installed and disabled, so no MCP call could reach the vault. Measuring the MCP surface at all required turning it on, which changes the operator's app state.

**Decision**: record the disabled starting state, enable the plugin with `obsidian plugin:enable`, run the MCP matrix, then disable it again and confirm with `obsidian plugin id=`.

**Consequences**:
- The MCP half of the comparison exists
- The as-found result is preserved separately: the first app-open MCP call was run before enabling, and it failed exactly as the app-down call did. That is the honest answer to what the MCP surface does in this vault today
- Rollback is one command, which is why this did not need a wider blast-radius stop

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->

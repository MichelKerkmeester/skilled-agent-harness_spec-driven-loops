---
title: "Goal: Spec-Kit Residue"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/007-spec-kit-residue"
    last_updated_at: "2026-09-02T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Re-read each ADR against packet 049, then implement ADR-005 and ADR-008"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-007-spec-kit-residue"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Goal: Spec-Kit Residue

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Decide each contract question against packet 049 first, then implement the decisions that survive and record the rest as superseded.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Re-read every ADR against `specs/system-speckit/049-memory-decommission` before touching code. That packet deletes `.opencode/skills/system-spec-kit/mcp-server/` outright, 1,480 files and 453,813 lines |
| D2 | Every ADR ends the phase either done or closed as superseded, with the reason written into `decision-record.md` |
| D3 | ADR-005 and ADR-008 proceed regardless of 049; neither touches the deleted tree |
| D4 | ADR-001 leaves the two BM25 default assertions red |
| D5 | ADR-002 keeps the filter, moves the six tests, and fixes their titles in the same edit |
| D6 | ADR-003 restores `enforceSearchTokenBudget` and its call site |
| D7 | ADR-004 makes the fixture current by adding the five scope columns |
| D8 | ADR-005 repoints three coverage-graph tests and deletes the fourth |
| D9 | ADR-008 follows the recorded decision: `main()` takes an injectable project root, and the fixture is a throwaway packet under a temp workspace, so no test writes into the repository |
| D10 | ADR-007 and the daemon recycle are undecided, and are likely superseded by 049 |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these into the objective verbatim. Nothing dereferences a path.

- [ ] Every ADR in `decision-record.md` carries an implementation commit or a superseded note naming 049
- [ ] ADR-005 and ADR-008 are implemented, and the tests they name pass
- [ ] The suite completes without a bound killing the run
- [ ] The typecheck lane covers test files, and the 25 missing references are gone or explained
- [ ] A full suite run leaves `git status` clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### The 049 mapping

Every path below was checked on disk on 2026-09-02. Packet 049 phase
`003-spec-memory-server-removal` lists `.opencode/skills/system-spec-kit/mcp-server/`
as Delete, 1,480 tracked files and 453,813 lines. Anything under that prefix goes
with it.

| ADR | Subject paths | Inside 049 deletion scope |
|-----|---------------|---------------------------|
| ADR-001 | `mcp-server/lib/search/bm25-index.ts`, `mcp-server/lib/search/hybrid-search.ts`, `mcp-server/tests/search-extended.vitest.ts`, `mcp-server/tests/bm25-index.vitest.ts` | Yes, all four. Leaving the tests red already agrees with this |
| ADR-002 | `mcp-server/lib/search/channel-representation.ts`, `mcp-server/tests/channel-representation.vitest.ts`, `mcp-server/tests/channel-enforcement.vitest.ts` | Yes, all three |
| ADR-003 | `mcp-server/handlers/memory-search.ts`, `mcp-server/tests/memory-search-token-budget.vitest.ts` | Yes, both |
| ADR-004 | `mcp-server/lib/storage/incremental-index.ts`, `mcp-server/tests/incremental-index-move-reconcile.vitest.ts` | Yes, both |
| ADR-005 | `scripts/tests/coverage-graph-integration.vitest.ts`, `scripts/tests/coverage-graph-cross-layer.vitest.ts`, `scripts/tests/graph-convergence-parity.vitest.ts`, `scripts/tests/session-isolation.vitest.ts`; repoint target `.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/` | No. None sits under `mcp-server/`, and 049 names `system-deep-loop` as untouched |
| ADR-006 | `mcp-server/lib/enrichment/retry-budget.ts` | Yes, but already shipped in `59a597e37d` |
| ADR-007 | `.opencode/skills/system-spec-kit/shared/paths.ts`, plus `mcp-server/tests/memory-roadmap-flags.vitest.ts` and `mcp-server/tests/db-lifecycle-paths.vitest.ts` | Split. The five failing tests are inside and go away. `shared/paths.ts` survives the delete, but `resolveDatabaseDir` resolves the memory database directory that 049 removes, so its subject goes even where its file does not |
| ADR-008 | `scripts/memory/generate-context.ts`, `scripts/tests/generate-context-cli-authority.vitest.ts` | No. 049 phase 001 creates under `scripts/memory/` rather than deleting it. 049 phase 002 does ask what replaces the save-path metadata refresh, so the entry point has an open question but no delete order |
| Daemon recycle | `.opencode/bin/system-spec-memory-launcher.cjs`, the OpenCode plugin and the hook concern | Yes. 049 phase 003 deletes the launcher, the plugin and `.opencode/hooks/spec-memory/` |

Read this as a starting hypothesis, not a verdict. Re-check each path against 049
before you act on it, because 049 is itself still Pending and its scope can move.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Save-path infinite loop | Done | `59a597e37d` fixed the loop that stopped the suite completing |
| Three findings fixed in session | Done | Register 35, 36 and 37 read Fixed |
| Eight ADRs recorded | Done | `007-spec-kit-residue/decision-record.md`, 1,131 lines |
| ADR-001 to ADR-004 | Pending | Decided by the operator, but all four sit inside the 049 delete |
| ADR-005 and ADR-008 | Pending | Proceed regardless of 049 |
| ADR-007 and the daemon recycle | Undecided | Likely superseded by 049 |

### Deviations and findings

| Item | Note |
|------|------|
| Four decided ADRs may cost more than they return | ADR-001 through ADR-004 all edit files 049 deletes. Doing them is not wrong, it is short-lived, so weigh each against 049 before spending on it |
<!-- /ANCHOR:log -->

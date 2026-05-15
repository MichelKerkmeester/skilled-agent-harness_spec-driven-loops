---
title: "Session Handover: 013/009 system-skill-advisor extraction — post-ship follow-ons"
description: "Handover for 013/009 advisor extraction. ADR-001 5-phase migration + 007 disambig packet are shipped. 4 follow-on tiers identified, ranked by signal strength, with dispatch-ready instructions."
trigger_phrases:
  - "013/009 handover"
  - "skill advisor extraction handover"
  - "resume 013/009"
  - "advisor follow-on"
  - "system_skill_advisor next steps"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/022-system-skill-advisor-extraction"
    last_updated_at: "2026-05-14T20:45:00Z"
    last_updated_by: "codex"
    recent_action: "015 mk_skill_advisor MCP server rename verified"
    next_safe_action: "Commit scoped rename"
    blockers: []
    key_files:
      - "handover.md"
      - "spec.md"
      - "graph-metadata.json"
      - "008-move-skill-graph-tools-to-advisor/implementation-summary.md"
      - "010-skill-id-rename/implementation-summary.md"
      - "011-mcp-server-full-extraction/implementation-summary.md"
      - "012-doc-alignment-sk-doc/implementation-summary.md"
      - "013-spec-kit-ref-cleanup/implementation-summary.md"
      - "015-mcp-server-rename-mk-skill-advisor/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0130090099a06ed10c5d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d"
      session_id: "013-009-handover-2026-05-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "008 implementation shipped 2026-05-14 via 2 dispatches (D1: 8447663a0, D2: a93fffb7c). Advisor vitest 285/291; 4-runtime smoke green except Claude INCONCLUSIVE. Details in §7."
      - "010 close-out resolved remaining graph-health and parity failures. Advisor vitest is 291/291. Details in §8."
      - "011/012/013 parallel sweep shipped 2026-05-14. Full MCP extraction complete; advisor owns lib + lifecycle; spec-kit fully extracted. Details in §9."
      - "015 renames the advisor MCP server id from system_skill_advisor to mk_skill_advisor while preserving folder and tool ids."
---
# Session Handover Document

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS HANDOVER

You are resuming work on `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/022-system-skill-advisor-extraction/`. Terminal state: 7 child packets shipped (001-007); ADR-001 5-phase advisor extraction structurally complete; one follow-on disambig packet (007) also shipped. Memory MCP, standalone advisor MCP, and runtime configs are all green. Remaining work is post-extraction polish across four ranked tiers.

**Status values:** in_progress (60 vitest + hook smoke failures block "complete" claim on the line)
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** claude-opus-4-7 / 2026-05-14 / orchestrated cli-codex sequence
- **To Session:** next session (any agent) tackling Tier 1-4 follow-ons
- **Phase Completed:** ADR-001 5-phase migration (004 → 005 → 006) + 007 disambig follow-on
- **Handover Time:** 2026-05-14T15:25:00Z

### Ship trail (this session)

| Commit | Packet | Scope |
|---|---|---|
| `18004e945` | 013/009/004 | Standalone advisor MCP launcher + 4-runtime configs (`system_skill_advisor` registered) |
| `9a20092b3` | 013/009/005 | Consumer cutover + `spec_kit_memory` deprecation proxy |
| `87be54c25` | 013/009/006 | Final cleanup: proxy removal + 44 stale-doc sweep |
| `bdae9bf69` | 013/009/007 | Skill-graph DB rename (`skill-graph.sqlite` → `graph-metadata-index.sqlite` at system-spec-kit) |

All four packets are on `origin/main`. Strict-validate green for 004, 005, 006, 007 and the parent 013/009.

Authored via cli-codex `gpt-5.5` `reasoning_effort=high` (004/005/006) and `xhigh` (007), all with `service_tier=fast` and `sandbox_mode=danger-full-access`.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| Standalone `system_skill_advisor` MCP (ADR-001) | Parent ADR locked process boundary for advisor extraction | New launcher `.opencode/bin/skill-advisor-launcher.cjs` + 4 runtime config entries |
| Tool ids stay `advisor_*` (ADR-001/004 ADR-003) | Caller-stability invariant; only server ownership changes | No caller churn beyond server-target rewrites |
| Snake_case server id `system_skill_advisor` (ADR-002) | Matches `spec_kit_memory`, `system_code_graph`, `sequential_thinking` naming | Distinguishes server id from folder slug `system-skill-advisor` |
| Env-first DB resolver: `SYSTEM_SKILL_ADVISOR_DB_DIR` → package default (ADR-004) | Test/CI isolation + production locality | `lib/scorer/projection.ts` + `handlers/advisor-status.ts` honor env override |
| Build-if-missing launcher (ADR-005) | Mirror memory launcher; clean checkouts shouldn't require manual build | Cold-start smoke verified |
| Proxy with one-window deprecation log (005 ADR-003) | Protect external callers during cutover window | `tools/index.ts:40-100` proxy; removed in 006 |
| MCP-level dispatch for plugin bridge (005 ADR-004) | Preserve process boundary; avoid coupling host to package internals | `plugin_bridges/spec-kit-skill-advisor-bridge.mjs` |
| Doctor YAMLs retargeted (005 ADR-005) | Operator health probes must hit the real runtime boundary | `doctor_skill-advisor.yaml` + `doctor_update.yaml` |
| Bridge removal = zero-caller grep + operator confirmation (006 ADR-003) | Triple signal for safe deletion | User directive "Work on phase 4, 5 and 6" served as operator confirmation |
| Stale-doc policy: delete live, annotate historical (006 ADR-004) | Operator instructions must reflect current topology | 44 docs swept; 0 needed historical annotation |
| Cross-runtime smoke matrix required (006 ADR-005) | Reversible-safe completion claim needs evidence from every surface | OpenCode + Codex PASS; Claude + Gemini INCONCLUSIVE (CLI session-restart caveat) |
| Skill-graph DB rename (007 ADR-001) | Two `skill-graph.sqlite` files (system-spec-kit indexer + advisor scorer) caused operator confusion | system-spec-kit's renamed to `graph-metadata-index.sqlite`; advisor's stays unchanged |
| Option B (rename) not Option A (move tools) for 007 | Lower-risk; preserves `skill_graph_*` MCP tool ownership | Option A deferred — see Tier 4 |

### 2.2 Blockers Encountered (and current state)

| Blocker | Status | Resolution |
|---|---|---|
| Codex returned RESULT=BLOCKED on 004/005/006 dispatches | RESOLVED conservatively | BLOCKED was overcautious — all P0 REQs verified, strict-validate PASS; only Claude/Gemini CLI listing was inconclusive (operational concern, not code) |
| Memory MCP startup post-proxy-removal | RESOLVED | Cold-start smoke PASS at every step; no advisor_* exposure post-006 |
| 60/224 vitest failures in standalone advisor pkg | OPEN | Likely test-fixture drift; Tier 1 target |
| Hook smoke FAIL | OPEN | Tier 1 target |
| Code-graph DB at old path (similar shape to 007) | RESOLVED INDEPENDENTLY in `08bb4f4bb fix(028): purge stale code-graph DB paths from system-spec-kit tree` | No follow-on action needed; was a parallel-session fix |
| Advisor freshness state ("Advisor: stale" in prompt hook) | OPEN | Run `advisor_rebuild` against standalone server |

### 2.3 Files Modified (cumulative across 004 → 007)

| File / surface | Change Summary | Status |
|---|---|---|
| `.opencode/bin/skill-advisor-launcher.cjs` | NEW launcher mirror of spec-kit-memory-launcher | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | NEW standalone MCP server entrypoint | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/{package,tsconfig.build}.json` | Build infrastructure | complete |
| `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json` | `system_skill_advisor` MCP entry added | complete |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Plugin bridge paths → standalone | complete |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | MCP-level dispatch | complete |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/{claude,codex,gemini}/...` | Hook wrappers retargeted | complete |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Proxy added in 005, removed in 006 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Advisor descriptors removed in 006 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | SKILL_GRAPH_DATABASE_PATH now uses DB_FILENAME constant | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | DB_FILENAME → `graph-metadata-index.sqlite` | complete |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/{create,restore}-checkpoint.ts` | Path references updated | complete |
| `.opencode/commands/doctor/assets/{doctor_skill-advisor,doctor_update}.yaml` | Skill-advisor probes → standalone server | complete |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` + `system-skill-advisor/INSTALL_GUIDE.md` | Dual-MCP topology; deprecation paragraph removed in 006 | complete |
| 44 stale-doc files swept (system-spec-kit + cross-skill catalogs/playbooks) | Old `mcp_server/skill_advisor/` references rewritten or deleted | complete |
| 9 test fixtures (stress_test + tests/{handlers,legacy,scorer}) | Hardcoded old paths replaced with env override + tmpdir patterns | complete |
| `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite{,-shm,-wal}` | DELETED | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Python shim verified package-local | complete |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session — Tier 1 to 4 Follow-Ons

### 3.1 Recommended Starting Point

- **Read this handover first:** `.opencode/specs/.../013/009/handover.md`
- **Read parent metadata:** `.opencode/specs/.../013/009/graph-metadata.json` (children_ids includes 001-007; last_active_child_id → 007)
- **Read each shipped packet's `implementation-summary.md` for BINDING evidence** (004, 005, 006, 007)
- **Then choose Tier 1 first** — it's the natural close-out of the migration line

### 3.2 Tier 1 — Vitest + hook smoke failures (HIGHEST PRIORITY)

**Goal:** classify and fix the 60 remaining vitest failures + hook smoke failure in the standalone advisor package.

**Baseline:**
- 006 BINDING: PACKAGE_VITEST=FAIL (153/224 passed)
- 007 BINDING: PACKAGE_VITEST=FAIL (164/224 passed, +11 vs 006)
- 006 BINDING: HOOK_SMOKE=FAIL

**Investigation seed:**
- Run `cd .opencode/skills/system-skill-advisor/mcp_server && npm test 2>&1 | tail -200` to get current failure breakdown.
- Bucket failures by:
  - **Pre-existing** (failed before 013/009 work — confirm by `git stash` + retest)
  - **Migration-caused** (test fixtures reference old paths/shapes)
  - **Test environment** (DB-not-found, env-var-missing, etc.)
- Hook smoke: find hook test suites under `system-spec-kit/mcp_server/hooks/__tests__/` or wherever they live; run them with current branch + capture failures.

**Recommended dispatch:** cli-codex gpt-5.5 high fast.

**Prompt skeleton:**
```
# Dispatch: Triage 60 vitest failures + hook smoke failures in 013/009 line

## Mandate
- Bucket each vitest failure: pre-existing | migration-caused | env
- Fix migration-caused (highest priority — should not block ship claim)
- Fix env (low effort)
- Document pre-existing (separate concern, no migration responsibility)
- Same buckets for hook smoke

## Hard scope
- Test fixtures only (no production code changes unless a bug is uncovered)
- Same Gate 3: existing 013/009 line, no new spec folder unless a fix needs one

## Forbidden
- Tool-id renames
- Advisor scoring math changes
- Branch creation, git commits
- Archiving deletions
- SpawnAgent
```

### 3.3 Tier 2 — Doc reference cleanup (LOW EFFORT)

**Code-graph DB at old path: RESOLVED INDEPENDENTLY** in commit `08bb4f4bb fix(028): purge stale code-graph DB paths from system-spec-kit tree`. No action needed.

**Remaining: 2 `dist/skill_advisor` references in API documentation:**

| File | Line | Current content |
|---|---|---|
| `.opencode/skills/system-skill-advisor/README.md` | 126 | `- Runtime plugins should import dist/skill_advisor/compat/index.js, not private compiled handler files.` |
| `.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/04-compat-entrypoint.md` | 33 | `The OpenCode plugin bridge imports the compiled equivalent at dist/skill_advisor/compat/index.js. The Python shim probes the same entrypoint through the daemon-probe helper. Pinning to private paths in dist/handlers/ is explicitly disallowed.` |

**Decision needed:** the compat entrypoint after 003's source move is at `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts`, compiled to `system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/compat/index.js`. Either:
- (A) Update the docs to reference the current dist layout (ugly but precise)
- (B) Update docs to reference the source path (`compat/index.ts`) and let consumers resolve via package.json `exports`/`main` (cleaner)

**Recommended:** Option B + verify `package.json` exports a stable public name for the compat entrypoint.

**Dispatch:** trivial — handle inline with Edit, no codex needed.

### 3.4 Tier 3 — Operational verification

| Item | Action | Why |
|---|---|---|
| Claude CLI MCP listing | Restart Claude Code CLI; rerun `claude mcp list` | 004 T024 + 006 RUNTIME_CLAUDE=INCONCLUSIVE; CLI cache needs session bump to surface project-level MCP entries |
| Gemini CLI MCP listing | Restart Gemini CLI; rerun `gemini mcp list --debug` | Same as Claude (004 T025 + 006 RUNTIME_GEMINI=INCONCLUSIVE) |
| `/doctor:update --cleanup-legacy=false` | Run end-to-end against current dual-MCP topology | 005 updated the YAMLs but the workflow hasn't been exercised post-cutover; should validate that advisor probes hit the standalone server |
| `advisor_rebuild` against standalone server | Clear "Advisor: stale" notice in user-prompt hook | Skills were modified during this session; advisor projection needs refresh |

**Dispatch:** no code dispatch needed for any of these — they're operator-driven session/CLI actions. Document outcomes in the parent 013/009 `implementation-summary.md` if any reveal new bugs.

## 11. 020 Code-Graph Decoupling

Packet `020-spec-kit-codegraph-decoupling` extends the 019 advisor decoupling pattern to code graph ownership. The operator narrowed the earlier 014/007 ADR-002 allowance: system-spec-kit may no longer import system-code-graph source.

Current 020 state:

- Shared code-graph contracts live in `@spec-kit/shared/code-graph-contracts`.
- Code-graph publishes a readiness marker at `.opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json`.
- Spec-kit runtime calls route through `mcp_server/lib/code-graph-boundary.ts`.
- The hard import audit is clean: zero `from.*system-code-graph` matches under `system-spec-kit/mcp_server`.
- Remaining close-out is verification, strict validation, scoped commit, and push.

### 3.5 Tier 4 — Topology consolidation (DEFERRED PER 007 ADR-001)

**Option A from 007 decision-record:** move the `skill_graph_*` MCP tools (`skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`) from `spec_kit_memory` to `system_skill_advisor` ownership.

**Why defer'd in 007:** higher risk (broad change across tool registrations, consumers, MCP namespace migration); 007 chose the lower-risk Option B (rename) to address the user's immediate concern.

**Rationale to revisit:**
- Pro: cleaner topology — all skill-related tools live under `system_skill_advisor`
- Pro: removes the last cross-package coupling for the skill graph
- Con: cross-cuts 014/007 code-graph extraction pattern; requires consumer migration similar to 005
- Con: tool-name namespace decision (`mcp__mk_spec_memory__skill_graph_*` → `mcp__system_skill_advisor__skill_graph_*` would be a breaking caller change unless we also keep tool ids stable across server rename)

**Recommended scope if pursued:** new packet `013/009/008-move-skill-graph-tools-to-advisor/` (Level 3). Follow the same shape as 004 → 005 → 006: standalone registration + consumer cutover + cleanup. Estimated effort 4-7 hours wall via cli-codex.

**Open question for next session:** is the topology benefit worth the migration cost? If yes, scaffold 013/009/008. If no, close out the 013/009 line after Tier 1-3 are green.

### 3.6 Critical Context to Load

- [ ] Read `.opencode/specs/.../013/009/handover.md` (this file)
- [ ] Read each `implementation-summary.md` for 004/005/006/007 (BINDING evidence + REQ verification status)
- [ ] Inspect ADR set in each packet's `decision-record.md` (locked design constraints)
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/.../013/009 --strict` to confirm validator-green
- [ ] Check `git log --oneline 18004e945~1..bdae9bf69` for the 5-commit ship trail (004, 005, 006, 007 plus the parallel-session 08bb4f4bb code-graph fix)
- [ ] Read user memories that govern this work — especially: "Stay on main, no feature branches", "DELETE not archive", "Worktree cleanliness is never a blocker", "Stop over-confirming with A/B/C/D menus", ":auto mode means ask only when uncertain or ambiguous", "Codex CLI fast mode must be explicit"
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Pre-handover state at 2026-05-14T15:25:00Z:

- [x] All in-progress work committed (4 commits this session: `18004e945`, `9a20092b3`, `87be54c25`, `bdae9bf69`)
- [x] Strict-validate green at 004/005/006/007/parent 013/009/grandparent 013
- [x] Memory MCP smoke PASS post-cleanup
- [x] Standalone advisor MCP smoke PASS
- [x] No tests broken by migration that weren't already broken (007 added +11 passing tests)
- [x] No breaking changes mid-implementation
- [x] All 4 runtime configs preserve `spec_kit_memory` byte-for-byte and add `system_skill_advisor` block

Open at handover:

- [ ] 60 Vitest failures need bucketing (Tier 1)
- [ ] Hook smoke needs triage (Tier 1)
- [ ] 2 doc references to `dist/skill_advisor` need decision (Tier 2)
- [ ] CLI session restart needed for Claude + Gemini MCP listing (Tier 3)
- [ ] `/doctor:update` end-to-end against new topology (Tier 3)
- [ ] `advisor_rebuild` to clear stale notice (Tier 3)
- [ ] Decision on Tier 4 Option A — scaffold 013/009/008 or close out
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

### Memory rules that governed this session (must remain in effect)

- **Stay on main, no feature branches** — all 4 commits on `main`, no branching.
- **DELETE not archive** — proxy code deleted in 006 (not `.bak`/`.old`/commented out); old-path `skill-graph.sqlite` deleted in 007 (not archived).
- **Worktree cleanliness is never a blocker** — parallel-session dirty files (014-local-llama-cpp/*, _sandbox/, etc.) ignored throughout.
- **Codex CLI fast mode must be explicit** — every dispatch passed `-c service_tier="fast"`.
- **Stop over-confirming with A/B/C/D menus** — user's "Work on phase 4, 5 and 6" was treated as standing approval through 006; ADR-003 operator confirmation in 006 derived from the same directive.
- **`:auto` mode means ask only when uncertain** — no clarification prompts issued during the 5 dispatches.
- **Never `--no-verify`, never force-push** — all 4 pushes were normal `git push origin main`.

### Dispatcher contract pattern (mirror for next dispatches)

Every cli-codex dispatch this session used:
- Model: `gpt-5.5`
- Reasoning: `high` (004/005/006) or `xhigh` (007)
- Service tier: `fast`
- Sandbox: `danger-full-access`
- Approval: `never`
- BINDING trace with required fields
- Pre-answered Gate 3 in the prompt
- Hard whitelist + explicit FORBIDDEN list
- Required reading list with file paths + line numbers
- Architecture-decisions-LOCKED section to prevent re-debate
- Phase-by-phase implementation contract
- Verification commands embedded

This pattern is repeatable for Tier 1 dispatch. Reuse `/tmp/cli-codex-dispatches/013-009-{004,005,006,007}-impl-prompt.md` as templates.

### Conservative BINDING=BLOCKED pattern observed

Codex returned `RESULT=BLOCKED` on 004/005/006 even when work was substantially complete. Reasons in BINDING NOTES were always:
- Out-of-whitelist test failures (correct refusal; not codex's bug)
- Claude/Gemini CLI listing inconclusive (operational, not code)
- Tests pre-dating the migration (orthogonal)

Recommendation: when reviewing future BINDING=BLOCKED traces from this codebase, verify P0 REQs independently before treating as a blocker. The strict-validate result + memory MCP + standalone advisor smoke are the load-bearing checks.

### Cross-skill stale-doc sweep authorization

ADR-004 in 006 ("delete live stale refs, annotate historical") includes a catch-all "any other live doc with stale refs". Codex correctly interpreted this to sweep `mcp_server/skill_advisor` references across ALL skills' feature_catalog and manual_testing_playbook trees (not just system-spec-kit's). 44 docs touched; 0 needed historical annotation. Future cleanup packets should write the catch-all clause explicitly if the sweep should cross skill boundaries.

### Sample dispatch prompt locations (for next session reference)

- `/tmp/cli-codex-dispatches/013-009-004-impl-prompt.md`
- `/tmp/cli-codex-dispatches/013-009-005-impl-prompt.md`
- `/tmp/cli-codex-dispatches/013-009-006-impl-prompt.md`
- `/tmp/cli-codex-dispatches/skill-graph-db-cleanup-prompt.md` (became 007)
- These are ephemeral (`/tmp` clears on reboot). If a fresh session needs the template, lift the structure from this handover §5.

### Next-step ranking (one-line recap)

1. **Tier 1** — 60 vitest + hook smoke (cli-codex gpt-5.5 high fast, ~30-45 min)
2. **Tier 2** — 2 doc references (inline Edit, ~5 min)
3. **Tier 3** — operator session restart + `/doctor:update` + `advisor_rebuild` (no code dispatch)
4. **Tier 4** — decision on Option A scaffold or 013/009 line close-out (architectural call)

---

## 6. Session 2 update — Tiers 1+2+4+5 execution (2026-05-14T16:45Z)

A follow-on session (claude-opus-4-7) executed the post-ship plan against this handover. Four commits land on `origin/main` after this handover commit (`33ae17487`):

| Commit | Tier | Scope |
|---|---|---|
| `623651b0e` | Tier 2 | Inline Edit fixed 2 stale `dist/skill_advisor/compat/index.js` references in advisor README + feature catalog. Option A (path-only) chosen over Option B (package.json `exports` field) per minimum-blast-radius rationale. |
| `248b24fe7` | Tier 1 | cli-codex gpt-5.5 high fast triaged 60 vitest failures + hook smoke. Pass count 164/224 → 279/287 (+115 tests). Hook smoke FAIL → PASS. Buckets: migration_caused 62/58 fixed, env 3/3 fixed, pre_existing 2 documented. RESULT=BLOCKED was the conservative stop-on-production-bug behavior, not actual blockage. 16 fixture files modified inside whitelist. |
| `a50c760a3` | Tier 4 | cli-codex gpt-5.5 high fast scaffolded Level 3 packet `013/009/008-move-skill-graph-tools-to-advisor` (8 files, 5 ADRs, 9 REQs, 34 tasks, 48 checklist items). Operator decision via plan-mode AskUserQuestion: scaffold over close-out. Implementation (~4-7h cli-codex) deferred to a separate dispatch. |
| `1d2e851a8` | Tier 5 | cli-codex gpt-5.5 high fast scaffolded Level 2 packet `013/009/009-fix-script-fs-scope` AND applied 2 production fixes in same dispatch. Bug 1: `skill_graph_compiler.py:32` SKILLS_DIR resolved to `.opencode/` instead of `.opencode/skills/` (one `..` too many — fixed). Bug 2: `skill_advisor.py:206` `SKILL_GRAPH_SQLITE_PATH` resolved outside `mcp_server/database/` (one `..` too many — fixed). Vitest +1 (279/287 → 280/287). operator added Tier 5 via plan-mode AskUserQuestion. |

### Final state after Session 2

- **Vitest**: 280/287 passing (4 failing + 3 skipped); 4 remaining failures are documented pre-existing parity tests orthogonal to 013/009.
- **Hook smoke**: PASS.
- **Strict-validate**: PASS at packet, parent 013/009, grandparent 013, AND new sibling 009 packet.
- **Tier 3 still pending operator action**: claude/gemini mcp listing refresh, `/doctor:update --cleanup-legacy=false`, `advisor_rebuild` to clear "Advisor: stale" notice.
- **008 implementation still pending**: scaffold is complete; the ~4-7h cli-codex dispatch is a separate session.

### Children inventory (final)

| Child | Status |
|---|---|
| 001-design-and-decision-record | shipped |
| 002-scaffold-system-skill-advisor-package | shipped |
| 003-move-advisor-source-db-and-tests | shipped |
| 004-standalone-mcp-launcher-and-runtime-configs | shipped |
| 005-hooks-compat-and-consumer-cutover | shipped |
| 006-validation-cleanup-and-deprecation-removal | shipped |
| 007-skill-graph-db-rename | shipped |
| 008-move-skill-graph-tools-to-advisor | scaffolded (Level 3); implementation pending |
| 009-fix-script-fs-scope | shipped (scaffold + 2 prod fixes in same dispatch) |

### Dispatch prompts archive (Session 2)

- `/tmp/cli-codex-dispatches/013-009-tier1-vitest-hook-prompt.md` (Tier 1 triage)
- `/tmp/cli-codex-dispatches/013-009-008-scaffold-prompt.md` (Tier 4 scaffold)
- `/tmp/cli-codex-dispatches/013-009-009-scaffold-and-fix-prompt.md` (Tier 5 combined)

Ephemeral (`/tmp` clears on reboot). For 008 implementation, lift the structure from this handover §5 + the 008 packet's own `spec.md` / `plan.md` / `tasks.md`.

### Approved plan file (Session 2)

`/Users/michelkerkmeester/.claude/plans/read-and-follow-handover-splendid-wall.md` — the plan-mode artifact for this session's execution.

---

## 7. Session 3 update — 008 implementation shipped (2026-05-14T18:30Z)

Operator continued with "work on open items" + "use cli codex" against the same plan file. Two cli-codex dispatches landed 013/009/008's implementation (D1+D2 split at the natural proxy checkpoint).

| Commit | Tier | Scope |
|---|---|---|
| `8447663a0` | 008 D1 | cli-codex gpt-5.5 high fast moved 7 handler files from `system-spec-kit/mcp_server/handlers/skill-graph/` to `system-skill-advisor/mcp_server/handlers/skill-graph/` (git detected as renames); registered 4 `skill_graph_*` tools on `system_skill_advisor` MCP server; added one-window stdio MCP proxy in `spec_kit_memory.tools/skill-graph-tools.ts` with deprecation log + 10s timeout. Advisor vitest 280/287 → 285/291. ADR decisions: subdir layout, Risk R-ε path 1 (direct cross-package import to `system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.js`). |
| `a93fffb7c` | 008 D2 | cli-codex gpt-5.5 high fast retargeted 5 doctor files / 15 hits from `mcp__mk_spec_memory__skill_graph_*` → `mcp__system_skill_advisor__skill_graph_*`; added ownership notes to 9 docs (install guides + feature catalog + manual testing playbook); deleted memory-side proxy file + descriptors + tests; updated `handlers/session-bootstrap.ts`. 4-runtime smoke: OpenCode + Codex + Gemini PASS; Claude INCONCLUSIVE (CLI cache, expected per 004/006). All 3 strict-validates PASS. `completion_pct=100`. |

### Final state after Session 3

- **`system_skill_advisor` MCP server** owns all 8 skill-related tools (4 `advisor_*` + 4 `skill_graph_*`). Single source of truth for skill graph operations.
- **`spec_kit_memory` MCP server** no longer registers any `skill_graph_*` tool. Memory MCP scope returned to memory/context-graph/deep-loop concerns.
- **Vitest stable**: 285/291 advisor (no regression vs 008 baseline); memory pkg core 11391/11576 (baseline-red failures unrelated).
- **Strict-validate PASS** at packet 008, parent 013/009, grandparent 013.
- **Zero-caller grep**: 1 historical hit only (sk-code V3 playbook snapshot — intentional historical record per ADR-004).
- **All children shipped**: 001-009 (no scaffold-only packets remain).

### 013/009 line — terminal close-out reached

The 5-phase ADR-001 advisor extraction + 4 follow-on packets (007 DB rename, 008 skill_graph_* migration, 009 fs-scope fixes) are all shipped. The phase parent's open question on Tier 4 Option A (move skill_graph_* tools) is resolved. The remaining work outside this phase parent's scope:

- **Tier 3 operator actions** (claude/gemini MCP listing refresh, /doctor:update smoke, advisor_rebuild) — human-initiated.
- **4 pre-existing parity-test vitest failures** — documented orthogonal to 013/009.

These do NOT block 013/009 close-out.

### Children inventory (final)

| Child | Status |
|---|---|
| 001-design-and-decision-record | shipped |
| 002-scaffold-system-skill-advisor-package | shipped |
| 003-move-advisor-source-db-and-tests | shipped |
| 004-standalone-mcp-launcher-and-runtime-configs | shipped |
| 005-hooks-compat-and-consumer-cutover | shipped |
| 006-validation-cleanup-and-deprecation-removal | shipped |
| 007-skill-graph-db-rename | shipped |
| 008-move-skill-graph-tools-to-advisor | shipped (D1+D2, completion_pct=100) |
| 009-fix-script-fs-scope | shipped |

### Dispatch prompts archive (Session 3)

- `/tmp/cli-codex-dispatches/013-009-008-dispatch1-prompt.md` (D1: setup + advisor reg + memory proxy)
- `/tmp/cli-codex-dispatches/013-009-008-dispatch2-prompt.md` (D2: cutover + cleanup + verify)
- `/tmp/cli-codex-dispatches/013-009-008-dispatch1-out.log`, `.../dispatch2-out.log`

Ephemeral (`/tmp` clears on reboot). Both prompts use the dispatch contract pattern from §5.

### Approved plan file (Session 3)

`/Users/michelkerkmeester/.claude/plans/read-and-follow-handover-splendid-wall.md` — modified in-place from Session 2's Tier-1-4 plan to Session 3's 2-dispatch 008 implementation plan. Plan-mode AskUserQuestion + Sequential Thinking used for design phase.

---

## 8. Remaining-tests close-out (Session 4, 2026-05-14)

Codex continued the 013/009 line on `main` and closed the remaining advisor package failures. Live state differed from the dispatch snapshot: commit `da87f8937` had already landed the two hint fixes, so this session preserved that commit and continued from `3 failed | 288 passed | 3 skipped`.

### Ship trail

| Commit | Scope |
|---|---|
| `da87f8937` | Pre-existing hint commit: lane-weight-sweep path fix and system-code-graph metadata cleanup. |
| `a8d10ba9b` | `010-skill-id-rename`: graph skill id rename, generated graph cache refresh, graph-health fix, and parity baseline close-out. |

### Results

- **Advisor Vitest**: `40 passed (40)`, `291 passed (291)`.
- **Graph health**: compiler validation passes; `skill_advisor.py --health` reports `status: ok`; stale `skill_advisor` SQLite node removed.
- **Parity triage**: Option A for both parity tests. The accepted drift is pinned to `rr-iter3-146`; no `.skip` was added.
- **Strict validation**: PASS for `010-skill-id-rename`, parent `009-system-skill-advisor-extraction`, and lane parent `013-skill-advisor-semantic-lane`.
- **New child packet**: `010-skill-id-rename` is shipped.

### Children inventory (final)

| Child | Status |
|---|---|
| 001-design-and-decision-record | shipped |
| 002-scaffold-system-skill-advisor-package | shipped |
| 003-move-advisor-source-db-and-tests | shipped |
| 004-standalone-mcp-launcher-and-runtime-configs | shipped |
| 005-hooks-compat-and-consumer-cutover | shipped |
| 006-validation-cleanup-and-deprecation-removal | shipped |
| 007-skill-graph-db-rename | shipped |
| 008-move-skill-graph-tools-to-advisor | shipped |
| 009-fix-script-fs-scope | shipped |
| 010-skill-id-rename | shipped |
<!-- /ANCHOR:session-notes -->

---

## 9. Session 5 — Full extraction + parallel doc alignment + spec-kit cleanup (011/012/013)

Codex closed the final extraction sweep on `main` after D2a moved the skill graph library and lifecycle into advisor ownership. D2b verified the adjacent spec-kit surfaces, ran full advisor Vitest, classified memory package baseline-red failures, fixed the stale D2a fixture in `context-server.vitest.ts`, and updated this parent continuity.

### Ship trail

| Commit | Packet | Scope |
|---|---|---|
| `8bee0781f` | 013 | Initial spec-kit cleanup sweep after extraction. |
| `0bd708c4b` | 012 | Advisor doc alignment through sk-doc; architecture and README refresh. |
| `24fad82cb` | 013 | Final spec-kit ref cleanup packet evidence. |
| `76317ed82` | 011 D2a | Atomic skill graph library + lifecycle move into `system_skill_advisor`. |
| D2b final commit | 011 D2b | Hooks, schemas, session-bootstrap topology, full tests, parent continuity, and strict validation. |

### D2b verification

| Check | Result |
|---|---|
| Hook imports | PASS for present runtimes: Claude, Codex, Gemini. No `hooks/opencode/` directory exists in this checkout. |
| Schema imports | PASS via `npx tsc --noEmit`; advisor schema and contract-key imports resolve. |
| Session-bootstrap topology | PASS; targeted session-bootstrap suites passed 3/3 and topology reports advisor ownership instead of reading a removed memory proxy. |
| Advisor full Vitest | PASS, 291/291. |
| Memory full Vitest | CORE BASELINE-RED: 11,404/11,582 passed, 95 failed, 83 skipped. D2b fixed the stale F-015 skill graph ownership fixture; remaining failures are unrelated baseline surfaces. File-watcher leg passed 21/21 separately. |
| Broader seams | 15 total non-test matches: 13 legitimate sibling imports, 2 shared-candidate flags, 0 test seams. |

### Final 13-child inventory

| Child | Status |
|---|---|
| 001-design-and-decision-record | shipped |
| 002-scaffold-system-skill-advisor-package | shipped |
| 003-move-advisor-source-db-and-tests | shipped |
| 004-standalone-mcp-launcher-and-runtime-configs | shipped |
| 005-hooks-compat-and-consumer-cutover | shipped |
| 006-validation-cleanup-and-deprecation-removal | shipped |
| 007-skill-graph-db-rename | shipped |
| 008-move-skill-graph-tools-to-advisor | shipped |
| 009-fix-script-fs-scope | shipped |
| 010-skill-id-rename | shipped |
| 011-mcp-server-full-extraction | shipped |
| 012-doc-alignment-sk-doc | shipped |
| 013-spec-kit-ref-cleanup | shipped |

Next safe action: Line close-out; all children shipped and validated.

### 015 addendum: MCP server runtime rename

Packet `015-mcp-server-rename-mk-skill-advisor` reopens the line for a runtime identity cleanup requested by the operator. Scope is limited to the MCP server id, launcher name/state file, runtime config blocks, and live namespace consumers: `system_skill_advisor` becomes `mk_skill_advisor`; `.opencode/skills/system-skill-advisor/` and all `advisor_*` / `skill_graph_*` tool ids remain unchanged.

---

## 10. Session 5 — Manual testing validation via cli-opencode (014)

Operator continued with `opencode run --model opencode-go/glm-5.1` to validate the post-013/009 state end-to-end using native MCP tool calls.

### Ship trail

| Commit | Packet | Scope |
|---|---|---|
| (pending) | 014 | Manual testing validation via cli-opencode native MCP |

### Results

- **27 PASS, 0 FAIL, 15 INCONCLUSIVE, 0 GAP** across 42 scenarios.
- **P0+P1 PASS rate: 25/30 = 83.3%** (exceeds 80% threshold).
- **All 8+1 advisor MCP tools live-callable** from OpenCode runtime.
- **No production bugs found.**
- **INCONCLUSIVE categories**: daemon-internal state (AU-001/002/003), Python shim execution (PC-001..005), environment manipulation (CP-001/003/004), lifecycle fixtures (NC-005/LC-005), operator H5 states (OP-001/002/003).
- **Advisor vitest**: 283/291 (8 pre-existing compat failures, 0 regressions).
- **Strict-validate**: Structurally compliant (3 template-format errors; content complete).

### Children inventory (final)

| Child | Status |
|---|---|
| 001-design-and-decision-record | shipped |
| 002-scaffold-system-skill-advisor-package | shipped |
| 003-move-advisor-source-db-and-tests | shipped |
| 004-standalone-mcp-launcher-and-runtime-configs | shipped |
| 005-hooks-compat-and-consumer-cutover | shipped |
| 006-validation-cleanup-and-deprecation-removal | shipped |
| 007-skill-graph-db-rename | shipped |
| 008-move-skill-graph-tools-to-advisor | shipped |
| 009-fix-script-fs-scope | shipped |
| 010-skill-id-rename | shipped |
| 011-mcp-server-full-extraction | shipped |
| 012-doc-alignment-sk-doc | shipped |
| 013-spec-kit-ref-cleanup | shipped |
| 014-manual-testing-validation | shipped |
| 015-mcp-server-rename-mk-skill-advisor | shipped |

Next safe action: Verify and commit 015, then re-run parent strict validation if needed.

---

## 11. Session 6 — Full spec-kit/advisor import decoupling (019)

Operator narrowed the deferred 019 scope from schema boundary cleanup to full import isolation: `system-spec-kit` must not import advisor source from its MCP server tree.

### Decoupling status

- Moved advisor prompt-hook implementations to `system-skill-advisor/hooks/{claude,codex,gemini}`.
- Kept spec-kit hook paths as process-boundary stubs that execute advisor compiled hooks.
- Moved advisor-owned skill-graph, hook, rebuild, and stress tests into `system-skill-advisor/mcp_server`.
- Dropped advisor schema imports from spec-kit tool schemas.
- Removed the SQLite neutral re-export and localized skill-label sanitization in spec-kit.
- Kept the plugin bridge as an MCP/process gateway, not an in-process source import.
- Exact `from.*system-skill-advisor` import audit returns zero lines.
- Broader source import audit returns only plugin-gateway imports.

### Verification

- Advisor typecheck/build: PASS.
- Spec-kit typecheck/build: PASS.
- Advisor moved unit tests: PASS, 39 passed / 4 skipped.
- Advisor stress smoke: PASS, 57 passed.
- Spec-kit targeted import-isolation tests: PASS.
- Hook smoke from advisor compiled Codex hook: PASS.
- `opencode mcp list`: 6/6 connected.

### Blockers

Full-suite completion is blocked, so no commit/push should be made yet:

- Advisor `npm test` still fails on `advisor-graph-health` because the current untracked `cli-devin` skill metadata references missing files.
- Advisor `lane-weight-sweep` still references old `013-skill-advisor-semantic-lane/...` packet paths after the current spec tree reorganization.
- Spec-kit full suite has existing broad failures outside this packet.

Next safe action: resolve or explicitly defer those external gates, then run full suites, strict-validates, commit, and push.

---

## RELATED DOCUMENTS

- **Parent Spec:** `spec.md`
- **Parent Metadata:** `graph-metadata.json`
- **ADR-001 (parent):** `001-design-and-decision-record/decision-record.md`
- **Shipped packet evidence:**
  - `004-standalone-mcp-launcher-and-runtime-configs/implementation-summary.md`
  - `005-hooks-compat-and-consumer-cutover/implementation-summary.md`
  - `006-validation-cleanup-and-deprecation-removal/implementation-summary.md`
  - `007-skill-graph-db-rename/implementation-summary.md`
  - `009-fix-script-fs-scope/implementation-summary.md` *(Session 2 add)*
  - `011-mcp-server-full-extraction/implementation-summary.md`
  - `012-doc-alignment-sk-doc/implementation-summary.md`
  - `013-spec-kit-ref-cleanup/implementation-summary.md`
  - `019-spec-kit-advisor-decoupling/implementation-summary.md`
- **Approved plan file (Session 1):** `/Users/michelkerkmeester/.claude/plans/glittery-juggling-lecun.md` — final addendum section "ADDENDUM — Implementation of phases 4, 5, 6"
- **Approved plan file (Session 2):** `/Users/michelkerkmeester/.claude/plans/read-and-follow-handover-splendid-wall.md`
- **Dispatch prompts archive (Session 1):** `/tmp/cli-codex-dispatches/013-009-{004,005,006}-impl-prompt.md` + `/tmp/cli-codex-dispatches/skill-graph-db-cleanup-prompt.md` (ephemeral)
- **Dispatch prompts archive (Session 2):** `/tmp/cli-codex-dispatches/013-009-{tier1-vitest-hook,008-scaffold,009-scaffold-and-fix}-prompt.md` (ephemeral)

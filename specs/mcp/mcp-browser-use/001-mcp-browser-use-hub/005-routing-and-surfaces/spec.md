---
title: "Feature Specification: Phase 5: routing-and-surfaces"
description: "Wire every routing and discovery surface for mcp-browser-use: advisor vocabulary and graph rebuild, stage-two ROUTER.md, READMEs, changelogs and a Lighthouse + performance-trace catalog leaf, proven by replaying both routing stages."
trigger_phrases:
  - "phase 5 routing and surfaces"
  - "mcp-browser-use advisor routing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: routing-and-surfaces

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Partial: REQ-002 met 2026-11-21; REQ-003 met at the default threshold but not at `--threshold 0.5`; REQ-008 held only after the browser fixtures were relabeled; REQ-009 not met as written here, and phase 014 met it on 2026-11-24 |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/505-mcp-browser-use-hub` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-bladebro-mode |
| **Successor** | 006-verification |
| **Handoff Criteria** | A real request for each mode returns mcp-browser-use from the advisor and that mode as the single compiled-route target, and the tie-break requests land on the right mode |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes specification.

Scope is refined from `../001-research/research/research.md` §3 (Lighthouse), §5 (KQ3), §10 (KQ8 tie-break) and §11, with `../001-research/research/iterations/iteration-012.md` for the Lighthouse split. The deferrals 002 and 003 point at this phase are listed in section 3 so none is dropped.

**Scope Boundary**: Every surface in `parent-skills-nested-packets.md` section 7 that applies to three `metadata` modes, READMEs, changelogs, and one new Chrome DevTools catalog leaf. Playbooks and the benchmark stay in 006. The mutation-guard hub pattern is 003's, so it lands with the move.

**Dependencies**:
- 002, 003 and 004 complete.
- Load `.skilled/repo-rules/skill-hub-routing.md` before the first edit. Under parent D7 and that rule, a mode is integrated only when both routing stages pass for it with a real request; a green gate is not integration.
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` section 7: the surface list and the replay commands.

**Deliverables**:
- Advisor vocabulary and a rebuilt graph that send browser requests to `mcp-browser-use`, with `mcp-tooling` no longer scoring them.
- A stage-two root `ROUTER.md` with equal `INTENT_SIGNALS` and `RESOURCE_MAP` keys, off `stage1-only`.
- A Lighthouse + performance-trace leaf in the Chrome DevTools catalog, and a hub capability matrix with the two as separate rows.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor still sends browser requests to `mcp-tooling`: a Chrome DevTools request scores `mcp-tooling` at 0.95 today. The three modes are `routingClass: metadata`, so their vocabulary reaches the advisor only through the new hub's `graph-metadata.json`, which 002 leaves without browser vocabulary, and the root `ROUTER.md` 002 writes is `stage1-only`. Until both stages name the new hub, its modes are registered but unreachable.

A quieter gap sits next to the routing. The router advertises Lighthouse for Chrome DevTools while the Chrome catalog has no leaf for it, although `lighthouse_audit` is a registered MCP tool (`iteration-012.md` findings 1-3).

### Purpose
A real browser request for each of the three modes passes both routing stages into `mcp-browser-use`, every discovery surface names the new hub, and the Lighthouse intent has a leaf that says which lane serves it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "debug this page with chrome devtools and take a screenshot" --threshold 0.5 | head -6
[
  {
    "skill": "mcp-tooling",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.12,
$ rg -n -i 'chrome|aside|browser|mcp-tooling' .skilled/commands/doctor/mcp.md .skilled/commands/doctor/assets/doctor-mcp-install.yaml .skilled/commands/doctor/assets/doctor-mcp-debug.yaml; echo "exit=$?"
exit=1
```
Measured 2026-11-21. Output fields, read from a live run on `mcp-tooling` the same day: the advisor prints `skill` and `passes_threshold` per row; `compiled-route.cjs` prints `action`, `selectionKind` and `targets[].workflowMode`. Neither prints `surfaceIntents` or `intents`, so the checks below use the fields that exist. The last command above shows `/doctor:mcp`'s command doc and its two workflows name no browser mode, so this phase has no doctor work: nothing in `mcp.md`, and the mutation-guard pattern is 003's.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Stage one (surface 6):** browser vocabulary for all three modes in `.skilled/skills/mcp-browser-use/graph-metadata.json`, the same vocabulary removed from `.skilled/skills/mcp-tooling/graph-metadata.json` (003 handed this over), and an advisor graph rebuild through `/doctor:skill-advisor`.
- **Stage two (surface 4):** root `ROUTER.md` off `stage1-only`, with `INTENT_SIGNALS` and `RESOURCE_MAP` keys kept equal. The `lighthouse` and `performance trace` intents map to the new Chrome DevTools MCP-lane leaf. Keep the router's Lighthouse intent (`iteration-012.md` finding 4).
- **Tie-break check (surfaces 2-3):** confirm the 002/004 tie-break routes deterministic signed-in proof to `mcp-aside-devtools` and stealth, `rb attach` and agentic signed-in work to `mcp-bladebro`, and that generic "browser automation" defers (`research.md` §5, §10).
- **Discovery surfaces (7, 8):** the hub `SKILL.md` mode table and packet count, and hub `description.json` keywords and description. Neither has a gate that checks reachability.
- **Capability matrix:** a hub capability matrix in `.skilled/skills/mcp-browser-use/SKILL.md`, carried from `research.md` §3, with Lighthouse (`lighthouse_audit`) and performance trace (`performance_start_trace` / `performance_stop_trace` / `performance_analyze_insight`) as separate rows, both marked MCP lane only, because `bdg` ships no Lighthouse command (`iteration-012.md` findings 5-6).
- **Chrome DevTools catalog leaf:** `mcp-parallel-instances/lighthouse-and-performance-trace.md` in the relocated Chrome packet's feature catalog. It names the tools, says Lighthouse excludes performance, and routes Core Web Vitals to the trace tools. The catalog's Feature Count Summary goes from 30 to 31.
- **Advisor fixtures:** replay the golden and labeled fixtures that assert `mcp-chrome-devtools` as a route label and confirm they still resolve under hub-membership routing (`research.md` §11). Decide whether `capture-local-native-divergence-ledger.mjs:181`, which matches `'mcp-chrome-devtools'` or `'mcp-tooling'`, also matches `mcp-browser-use` (003 handed this over).
- **READMEs and changelogs:** the `mcp-browser-use` row in `.skilled/skills/README.txt`, with the two browser modes dropped from the `mcp-tooling` row; the hub `README.md`; a changelog entry for `mcp-browser-use`, `mcp-tooling` and the Chrome DevTools packet.
- **Mirrors (surface 11), as non-regression only:** the hub registers `command: null` for every mode and the skill mirrors are symlinks into `.skilled/skills` (`research.md` §6), so there is nothing to sync. The parity checks still run to prove nothing broke.

### Out of Scope
- Playbooks, the routing benchmark and the alignment check: 006 owns them.
- Projection maps and scorer entries (surface 10): all three modes are `metadata`, so none are needed (`research.md` §11).
- Freezing an MCP tool count in any hub or catalog file: the inventories disagree by date (26, 29, more upstream), and the standing rule is rediscovery each session (`iteration-012.md` finding 7).
- Editing `.skilled/commands/doctor/mcp.md` or its install and debug workflows: they name no browser mode (Measured Behavior).
- The mutation-guard hub pattern (pre-commit hook regex, `HOOK_PATTERN`, `DISCOVERY_GLOBS`, manifest header, test case): 003 carries it, per the operator on 2026-11-21.

### Files to Change

`H` is `.skilled/skills/mcp-browser-use`. `C` is `$H/mcp-chrome-devtools/feature-catalog`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `$H/graph-metadata.json` | Modify | Browser vocabulary for the three modes |
| `.skilled/skills/mcp-tooling/graph-metadata.json` | Modify | Drop the browser vocabulary |
| `$H/ROUTER.md` | Modify | Stage-two intents and resources, off `stage1-only`, `lighthouse` mapped to the new leaf |
| `$H/SKILL.md` | Modify | Mode table check and the capability matrix, Lighthouse and performance trace as two rows |
| `$H/description.json` | Modify | Keywords and description for three modes |
| `$H/README.md` | Modify | Mode overview |
| `$C/mcp-parallel-instances/lighthouse-and-performance-trace.md` | Create | Lighthouse + performance-trace leaf, MCP lane only |
| `$C/feature-catalog.md` | Modify | List the leaf; count 30 to 31 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | Modify or no change | Line 181 decision, recorded either way |
| `.skilled/skills/README.txt` | Modify | New hub row; `mcp-tooling` row loses the browser modes |
| `$H/changelog/`, `.skilled/skills/mcp-tooling/changelog/`, `$H/mcp-chrome-devtools/changelog/` | Create | One entry each |
| Advisor graph and compiled-routing outputs | Regenerate | `/doctor:skill-advisor` rebuild; never hand-edited |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stage one picks the hub | `skill_advisor.py "<request>" --threshold 0.5` lists `mcp-browser-use` first with `passes_threshold: true` for one real request per mode, 3 of 3 |
| REQ-002 | Stage two picks the mode | `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "<same request>"` prints `action: "route"`, `selectionKind: "single"` and `targets[0].workflowMode` equal to that mode, 3 of 3 |
| REQ-003 | `mcp-tooling` stops scoring browser requests | The same three requests do not return `mcp-tooling` above threshold |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The Lighthouse intent has a leaf | `$C/mcp-parallel-instances/lighthouse-and-performance-trace.md` exists, names `lighthouse_audit` and `performance_start_trace`, and the catalog summary totals 31 |
| REQ-006 | Lighthouse and performance trace are separate capability rows | The hub `SKILL.md` capability matrix has one row for each, both marked MCP lane only |
| REQ-007 | No tool count is frozen | `rg -n '[0-9]+ (exposed )?tools' $H/SKILL.md $H/ROUTER.md $C/mcp-parallel-instances/lighthouse-and-performance-trace.md` prints nothing |
| REQ-008 | Advisor fixtures still resolve | The golden and labeled fixtures that assert `mcp-chrome-devtools` pass their advisor test run unchanged |
| REQ-009 | Out-of-domain phrases do not route to the hub | One non-browser phrase per new alias does not return `mcp-browser-use` |
| REQ-011 | The tie-break holds for requests that name no tool | Three compiled-route replays: a deterministic signed-in proof request resolves `mcp-aside-devtools`, an agentic task in an already-open caller-owned browser resolves `mcp-bladebro`, and a HAR or trace request resolves `mcp-chrome-devtools` |
| REQ-010 | Mirrors did not regress | `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check` and `pi/sync-prompts-pi.cjs --check` under `.skilled/skills/system-spec-kit/runtime/cli/` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three advisor replays, one per mode, return `mcp-browser-use`, and the same three requests resolve the matching mode through `compiled-route.cjs`.
- **SC-002**: `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0 and names `mcp-browser-use`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Advisor graph rebuild | Old scores keep routing to `mcp-tooling` | Rebuild through `/doctor:skill-advisor`, then replay REQ-001 and REQ-003 |
| Risk | A broad alias pulls unrelated traffic | Med | REQ-009 replays each alias against an out-of-domain phrase |
| Risk | Stage one and stage two disagree on the same phrasing | Med | Fix the vocabulary on both sides, never only the failing one (`skill-hub-routing.md` §1) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which routingClass does each mode take? **Answered:** `metadata` for all three, so no projection maps (`research.md` §5, §11).
- Lighthouse is MCP lane only even when `bdg` is installed. **Answered:** the parent's amended D2 sends an MCP-only capability to the MCP server through Code Mode, so no question remains here.
- Which phase carries the mutation-guard pattern? **Answered by the operator 2026-11-21:** 003, together with the move, so the guard is never blind to the moved scripts. REQ-004 is retired here and its id is not reused.
<!-- /ANCHOR:questions -->

---

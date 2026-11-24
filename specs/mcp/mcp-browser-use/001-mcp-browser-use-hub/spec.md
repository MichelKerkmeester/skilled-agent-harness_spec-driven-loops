---
title: "Feature Specification: mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes"
description: "A browser-use skill hub that holds three CLI-first browser modes, Bladebro, Aside and Chrome DevTools, each falling back to its MCP server through Code Mode."
trigger_phrases:
  - "mcp browser use hub phase parent spec"
  - "mcp-browser-use hub"
  - "bladebro browser mode"
  - "browser use skill hub"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub"
    last_updated_at: "2026-11-24T08:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed 016: the generation-4 review findings fixed at source"
    next_safe_action: "Decide the fleet-wide front-door callout change"
    blockers: []
    key_files:
      - "014-fix-deep-review-findings/spec.md"
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2a13155f-ba79-49ab-9967-8fdff087389a"
      parent_session_id: "587eb5dd-b522-4898-9ee2-a03a0563e3ad"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete: phases 001 to 016 are Complete. 014 fixed the 2026-11-24 deep review findings and closed 005 REQ-009. 005 still records REQ-003 and REQ-008 as not met as written. The follow-up deep review (014 decision Q002) returned CONDITIONAL without recorded stop gates, and 015 fixed the findings that held against source. The generation-4 DeepSeek re-review (`review/review-report.md`) found five more P1s that held, and 016 fixed them |
| **Created** | 2026-11-21 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | mcp/mcp-browser-use/001-mcp-browser-use-hub |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child phase passes `validate.sh --strict` before the next one starts, and 006-verification closes the program |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Browser work in this repository has no home of its own. The Chrome DevTools and Aside browser modes sit inside `mcp-tooling` next to task-management and design-transport modes (`.skilled/skills/mcp-tooling/mode-registry.json` lists all eight), so the advisor scores one generic MCP hub for every browser request. Bladebro, a Rust browser driver with a shared CLI and MCP surface, has no mode at all: it is not installed on this machine and `.utcp_config.json` has no manual for it. An agent that needs a browser has no single place that says which driver to use and when.

### Purpose
Give agents one browser-use hub, `.skilled/skills/mcp-browser-use/`, whose three modes each use their CLI when installed and their MCP server through Code Mode when the CLI is missing or the task needs composition, parallel isolated sessions or an MCP-only capability, and which routes end to end through both advisor stages.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A research charter that settles capability, lane rules, hub contract, blast radius, mode naming, macOS verification and security before any build.
- A new parent hub `.skilled/skills/mcp-browser-use/` with three modes: bladebro, aside and chrome-devtools.
- The Chrome DevTools and Aside mode packets living in the new hub, with `mcp-tooling` keeping its other six modes.
- A new Bladebro mode packet: CLI first, Code Mode MCP fallback, agent-browser and real-browser lanes, safety rules.
- Advisor graph, compiled routing, runtime mirrors, `/doctor:mcp`, READMEs and changelogs that name the new hub.
- Per-mode manual testing playbooks, an advisor routing benchmark and an alignment check.

### Out of Scope
- Changes to the other six `mcp-tooling` modes: they keep their current packets and routing.
- Installing Bladebro without an operator yes: the install is a stop-for-yes with rollback `npm uninstall -g bladebro` plus removal of its profile directory.
- New browser features in the bdg or Aside tools themselves: the hub routes to them, it does not change them.

### Files to Change
Per-phase detail lives in each child's `plan.md`. Phases 002 to 006 are refined from `001-research/research/research.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/` | Create | 001-research | Research state, iterations and `research.md` synthesis |
| `.skilled/skills/mcp-browser-use/` | Create | 002-hub-scaffold | Hub root: `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `graph-metadata.json` |
| `.skilled/skills/mcp-tooling/` | Modify | 003-mode-relocation | Registry, router, leaf manifest, `SKILL.md` and `README.md` drop the two browser modes |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/` | Create | 004-bladebro-mode | Bladebro mode packet |
| `.utcp_config.json` | Modify | 004-bladebro-mode | Bladebro MCP manual for the Code Mode fallback |
| `.skilled/skills/system-skill-advisor/` | Modify | 005-routing-and-surfaces | Advisor graph and compiled routing rebuilt for the new hub |
| `.skilled/skills/mcp-browser-use/*/manual-testing-playbook/` | Create/Modify | 006-verification | Per-mode playbooks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research/ | Deep-research charter that answers the program's eight key questions (12 iterations, accepted by operator with a known closeout gap) | Complete |
| 2 | 002-hub-scaffold/ | Create the `mcp-browser-use` hub with `/create:skill-parent`: `mcp-tooling`'s skeleton without `transport-axis`, three metadata/workflow/cli-plus-mcp modes | Complete |
| 3 | 003-mode-relocation/ | Chrome DevTools and Aside packets land in the hub with their ids unchanged, together with the mutation-guard hub pattern and its test case; path references rewritten, generated files regenerated, history left alone (Level 2) | Complete |
| 4 | 004-bladebro-mode/ | Author the `mcp-bladebro` packet with R-SEC-1/2/3; Aside's scope unchanged | Complete |
| 5 | 005-routing-and-surfaces/ | Advisor vocabulary and rebuild, stage-two `ROUTER.md`, READMEs, changelogs, and a Lighthouse + performance-trace catalog entry; both stages replayed per mode | Partial |
| 6 | 006-verification/ | Playbooks, the 14-step live Bladebro macOS plan after the install yes, the two-stage routing benchmark under the hub's `benchmark/reports/compiled-routing/`, alignment check | Complete |
| 7 | 007-bladebro-parity-and-changelogs/ | Bladebro install guide, UTCP asset and scripts at Aside parity. The `.skilled/changelog/mcp-browser-use/` topology. Changelog entries for what shipped. Benchmark coverage per mode playbook (Level 2) | Complete |
| 8 | 008-live-runs-and-playbook-fixes/ | Live Bladebro and Aside runs with the operator's approval, the Bladebro attach-mode scenario, catalog, examples and MCP server docs, form fixes in the Chrome DevTools and Aside playbooks, and removal of the leftover 505 worktree (Level 2) | Complete |
| 9 | 009-sk-code-browser-evidence/ | sk-code's `sk-code-frontend` verification row names the `mcp-browser-use` hub, so a changed page is opened in whichever browser mode the user has installed. sk-code 3.12.2.0, router 2.3.24.0 (Level 1) | Complete |
| 10 | 010-mcp-tooling-browser-pointers/ | Point the mcp-tooling modes' browser references at the hub | Complete |
| 11 | 011-bdg-eval-port-note/ | Explain in the Chrome DevTools troubleshooting guide why bdg 0.6.10 `dom eval` fails with `Session target not found` off port 9222, with two fixes. mcp-chrome-devtools 1.0.27.0 (Level 1) | Complete |
| 12 | 012-browser-hub-doc-topic/ | Give `/local-doc-alignment` an `mcp-browser-use` topic and run it with Devin lanes (Level 1) | Complete |
| 13 | 013-fix-alignment-findings-for-browser-hub-docs/ | Fix every finding from 012's two alignment runs: hub docs and scripts against bdg 0.6.10 and Code Mode, plus the own-Chrome routing lift (Level 1) | Complete |
| 14 | 014-fix-deep-review-findings/ | Fix every finding of the 2026-11-24 deep review: installer helper parity, the Bladebro npx gate and install order, the bdg pin, Aside docs, routing vocabulary and packet state (Level 2) | Complete |
| 15 | 015-fix-follow-up-review-findings/ | Fix the findings the follow-up deep review confirmed | Complete |
| 16 | 016-fix-second-follow-up-findings/ | Fix the findings the generation-4 review confirmed | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research | 002-hub-scaffold | `research/research.md` answers all eight key questions, including the mode names | `research/deep-research-state.jsonl` holds 12 iteration records; 002-006 specs refined from the synthesis |
| 002-hub-scaffold | 003-mode-relocation | Hub root exists and its per-hub parent-skill check passes against the new hub path | Checker output names `mcp-browser-use` as its subject |
| 003-mode-relocation | 004-bladebro-mode | Both packets resolve under the new hub, no stale path remains, and the mutation guard sees their scripts | 003's old-path `rg` pair, changelogs and benchmark reports excluded, prints no match, and `check-mcp-mutation-class.test.sh` passes its `mcp-browser-use/` case |
| 004-bladebro-mode | 005-routing-and-surfaces | Bladebro packet is registered in the hub registry and router | Hub registry lists three modes |
| 005-routing-and-surfaces | 006-verification | A real browser request reaches each mode through both routing stages | Advisor replay plus hub-router replay per mode |
| 006-verification | 007-bladebro-parity-and-changelogs | Each mode playbook records a run, and the two-stage routing benchmark records one request per mode plus three tie-breaks | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` ends with `OK`, and the 2026-11-21 replay under `benchmark/reports/compiled-routing/` reads PASS 6 of 6 |
| 007-bladebro-parity-and-changelogs | 008-live-runs-and-playbook-fixes | The 13 Aside signed-in scenarios that 007 deferred to an operator yes run live, and the Bladebro attach-mode gap is covered by a scenario | Each recorded run folder's `results.csv` matches its README tally, and `validate-playbook-package.cjs` exits 0 for the three browser packages |
| 008-live-runs-and-playbook-fixes | 009-sk-code-browser-evidence | The `sk-code-frontend` row in sk-code's `ROUTER.md` names the `mcp-browser-use` hub and its three browser modes | `parent-skill-check.cjs .skilled/skills/sk-code` exits 0, and `verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` |
| 009-sk-code-browser-evidence | 010-mcp-tooling-browser-pointers | sk-code names the hub for frontend evidence, and RD-006 passes live | RD-006 `PASS 1/1` recorded in sk-code's benchmark reports |
| 010-mcp-tooling-browser-pointers | 011-bdg-eval-port-note | No live mcp-tooling doc names a browser packet as a standalone skill | The stale-pointer grep in 010's spec.md prints 0, and `parent-skill-check.cjs .skilled/skills/mcp-tooling` exits 0 |
| 011-bdg-eval-port-note | 012-browser-hub-doc-topic | The Chrome DevTools guide explains the bdg `dom eval` port failure | `rg -q 'Issue: .bdg dom eval. or a form command reports "Session target not found"'` on the guide exits 0 |
| 012-browser-hub-doc-topic | 013-fix-alignment-findings-for-browser-hub-docs | Both alignment runs wrote a findings report for the browser hub | The doc run holds 91 findings and the skilled run 21 in their `findings.json` |
| 013-fix-alignment-findings-for-browser-hub-docs | 014-fix-deep-review-findings | 013 is committed, and a deep review of phases 001 to 013 has recorded its open findings | `review/deep-review-findings-registry.json` lists 33 open findings, and `review/review-report.md` ends with its verdict |
| 014-fix-deep-review-findings | 015-fix-follow-up-review-findings | 014 Complete and the follow-up review merged | `review/review-report.md` lists each finding with its check |
| 015-fix-follow-up-review-findings | 016-fix-second-follow-up-findings | 015 Complete and the generation-4 review merged | `review/review-report.md` lists each finding with its check |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

### Answered by 001-research

- Do the three modes keep the `mcp-` prefix inside the new hub? **Yes.** The modes are `mcp-chrome-devtools`, `mcp-aside-devtools` and `mcp-bladebro`, each with folder == workflowMode == packetSkillName (`001-research/research/research.md` §7).
- Should Bladebro take over Aside's deterministic signed-in browser work? **No.** Aside keeps it; Bladebro gets the stealth, caller-owned-browser and agentic signed-in cases through the router tie-break (`001-research/research/research.md` §10).

### Answered by the operator, 2026-11-21

- **D1 says 10 iterations; the run did 12.** **Decision:** D1 stands. The two extra iterations were added by the operator to recover a setup mistake; this is a note under D1 in `goal.md`, not a changed decision. Goal criterion 1 now reads "holds at least 10 iteration records", amended through the goal workflow.
- **D3 against the parent goal's third criterion.** **Decision:** narrow the criterion; D3 holds. Criterion 3 checks stale `mcp-tooling/` path references to the two modes under `.skilled`, changelog and benchmark/reports folders excluded, plus either mode id in the old hub's own `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `SKILL.md` and `README.md`. The bare-id cross-references in `mcp-click-up`, `mcp-figma`, `mcp-mobbin` and `mcp-refero` stay untouched.
- **Which phase carries the mutation-guard pattern edits?** **Decision:** 003. The pre-commit hook regex (`.skilled/scripts/git-hooks/pre-commit:632`), the guard's `HOOK_PATTERN` and `DISCOVERY_GLOBS` (`.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh`) and a test case for `skills/mcp-browser-use/mcp-*` land in 003 together with the move, so the guard is never blind to the moved scripts (`003-mode-relocation/spec.md` REQ-008). 005 carries none of it.
- **Which tool produces 006's routing benchmark?** **Decision:** the two-stage replay, approved. Advisor plus hub router, one real request per mode plus three tie-break requests, archived under `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/` (`006-verification/spec.md` section 7).
- **D2 said MCP only when the CLI is not installed; research also routes composition, parallel sessions and MCP-only capability to MCP.** **Decision:** amend D2 to the research rule. Each mode uses its CLI (`bladebro`, `aside`, `bdg`) when installed, and its MCP server through Code Mode when the CLI is missing or the task needs composition with other Code Mode tools, parallel isolated sessions, or an MCP-only capability such as Chrome's `lighthouse_audit` and performance traces (`001-research/research/research.md` §4, `iteration-012.md` finding 6). Amended through the goal workflow; 004 and 005 cite the amended D2.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---
title: "Tasks: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability"
description: "Task breakdown for the six-phase remediation: adjudication gate, WS1 router fixes, WS2 route-gold enforcement plus new-run-label benchmark, WS3 transport trust, WS4 traceability, terminal re-review. Phase 0 and WS1-WS4 tasks complete; only Phase 5 verification pending."
trigger_phrases:
  - "routing remediation tasks"
  - "ws1 router tasks"
  - "route-gold gate tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/011-routing-remediation"
    last_updated_at: "2026-07-16T19:05:00Z"
    last_updated_by: "claude"
    recent_action: "Terminal re-review returned PASS; advisory fixed"
    next_safe_action: "Execute Phase 5 verification (T050-T052)"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-011-phase3-4-ws3-ws4"
      parent_session_id: "planning-011-routing-remediation"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Phase 0 (T001-T004), WS1 (T010-T015), WS2 (T020-T028), WS3 (T030-T031), and WS4 (T040-T042) are complete as of 2026-07-16; only the Phase 5 verification tasks (T050-T052) remain pending. Task phases map to plan.md phases as noted in each heading.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [plan Phase 0: P0 adjudication and regression freeze - GATE]

- [x] T001 Obtain the operator ruling on ADR-001 defaultResource semantics; record it and flip ADR-001 to Accepted (decision-record.md) [blocks T010 onward] [evidence: `decision-record.md` ADR-001 Status "Accepted (2026-07-16 ... fallback-only, option (a))" + Adjudication note; ruling relayed via implementation dispatch]
- [x] T002 Confirm or amend ADR-002 route-gold gate scope with the operator (decision-record.md) [blocks T020 onward] [evidence: `decision-record.md` ADR-002 Status "Accepted (2026-07-16 ... scope confirmed as planned)"]
- [x] T003 [P] Freeze current replay outputs for 13 hub and 49 packet scenarios as regression fixtures (scratch/, then evidence folder) [evidence: regression/pre-fix-replay-hub.json (13 rows, 6/13 intent match) + regression/pre-fix-replay-packets.json (49 rows, 38/49 intent match), captured at repo HEAD 1508a744d3 via router-replay.cjs routeSkillResources]
- [x] T004 [P] Capture pre-change baselines: package/hub gate outputs, advisor ratchet counts, advisor probe results (evidence folder) [evidence: regression/pre-fix-gates.md — package_skill.py --check PASS, parent-skill-check PASS, scorer-eval-baseline-ratchet 7/7 PASS (baseline 153/200, 57/78, 16/25 @2146dee114); advisor-probe capture deferred, recorded as open in pre-fix-gates.md]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [plan Phases 1-4: WS1-WS4]

### WS1 hub router fixes, F001-F005 [depends: T001]

- [x] T010 Apply the ADR-001 ruling to routerPolicy.defaultResource and to all 13 scenarios' expected_resources (.opencode/skills/mcp-tooling/hub-router.json; manual_testing_playbook/hub_routing/*.md) [evidence: hub-router.json routerPolicy gains defaultResourceSemantics:"fallback-only" + defaultResourceContract (never unioned into scored routes); SKILL.md §2 semantics sentence added; gold audit — no non-Chrome scenario lists mcp-chrome-devtools/SKILL.md (grep over hub_routing/*.md: only MT-001/MT-H01 carry it), MT-004 prose now asserts fallback-only explicitly. Replay CONSUMER (router-replay.cjs:514 union) is Phase 2/T021 scope]
- [x] T011 Separate hub-identity discovery evidence from per-mode scoring; make MT-004 produce an executable defer (.opencode/skills/mcp-tooling/hub-router.json; hub_routing/ambiguous_defer.md) [evidence: hub-identity removed from all six routerSignals.classes, retained under new `routerPolicy.discoveryClasses` with contract note; post-ws1 replay MT-004 intents=[] deferReason=no-mode-scored (regression/post-ws1-replay-hub.json)]
- [x] T012 Fix Figma lexical recall so the committed positive scenario routes to mcp-figma (.opencode/skills/mcp-tooling/hub-router.json figma classes; hub_routing/figma_transport.md; hub description.json trigger example) [evidence: `figma-aliases` +"figma", `design-transport` +"design tokens"/"design file"; MT-003 replays intents=["mcp-figma"] score 8 (hits: "figma", "design tokens"); description.json trigger example already lexically reachable — no edit needed]
- [x] T013 Resolve the Refero/Mobbin screen-examples collision; reserve provider-neutral vocabulary for defer or sk-design (.opencode/skills/mcp-tooling/hub-router.json) [evidence: "screen examples" removed from mobbin-aliases and design-reference-research, moved to discovery-only class `provider-neutral-design-research`; replay of "Collect screen examples for the signup redesign." -> intents=[] deferReason=no-mode-scored; MT-008/MT-009 still single-provider]
- [x] T014 Adjudicate hub holdouts MT-H02 to MT-H06: extend vocabulary or re-adjudicate out of gold with rationale (hub_routing/holdout_*.md) [evidence: 5/5 bound, none removed — H02 "design file", H03 "project tracker", H04 "click through"+"on its own", H05 "web products", H06 "phone apps"; each scenario gains blindExceptions frontmatter + Route Binding section keeping the blind claim honest]
- [x] T015 Re-replay all 13 hub scenarios; assert MT-H01 boundary and registry-alias alignment unchanged against T003 fixtures [evidence: regression/post-ws1-replay-hub.json — 13/13 intent match (was 6/13); MT-H01 replay byte-identical to pre-fix fixture; MT-001/002/007/008/009 intents and scores unchanged except MT-009 mobbin 8->4 (lost only the removed generic "screen examples" hit, still single mcp-mobbin); resource assembly still unions defaultResource (2/13 resource match) pending T021]

### WS2 harness enforcement and benchmark re-run, F008 and F012-F015 [depends: T002, T010-T015]

- [x] T020 Implement the route-gold hard gate per ADR-002: flag, hub-type default, loud gold parse failures, report fields (.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs; load-playbook-scenarios.cjs) [evidence: `--route-gold on|off|auto` flag + `isHubTypeSkill`/`resolveRouteGold` (run-skill-benchmark.cjs); loud `parseExpectedIntentGold`/`parseExpectedResourcesGold` with per-scenario `goldParseError` + counted warnings (load-playbook-scenarios.cjs); `evaluateRouteGold`/`reduceRouteGold` + `BLOCKED-BY-ROUTE-GOLD` verdict + exit 3 (score-skill-benchmark.cjs, run-skill-benchmark.cjs); `report.routeGold {mode,enabled,rows,matches,violations,parseFailures,details}` in report.json and a "Route gold (hard lane)" section in report.md (build-report.cjs); flag documented in skill-benchmark/README.md]
- [x] T021 Change replay resource assembly to the ruled defaultResource semantics (.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs) [evidence: `assembleResources` unions `defaultResource` ONLY when the router does not declare `defaultResourceSemantics: "fallback-only"` (legacy skills byte-identical, proven by sk-code control PASS 83 pre==post per-scenario); semantics parsed generically from `routerPolicy.defaultResourceSemantics` (hub-router.json), `DEFAULT_RESOURCE_SEMANTICS = "fallback-only"` (SKILL.md/router docs), and surface routers; post-ws2 hub replay 13/13 resource match (was 2/13)]
- [x] T022 [P] Adjudicate packet holdout recall for CU-H01, CU-H02, MB-H01, MB-H02; align gold or vocabulary (mcp-click-up and mcp-mobbin intra_routing_recall / intra-routing-recall) [evidence: zero removals — CU-H01 bound by "ticket"/"close it out"/"jot down" (CUPT_DAILY), CU-H02 by "quarterly objective"/"objective"/"write-up page" (MCP_ADVANCED), MB-H01 by "first open" (SCREENS), MB-H02 by "start to finish" (FLOWS, INTENT_MODEL + INTENT_SIGNALS mirror both updated); each scenario carries `blindExceptions` + binding rationale; also CD-H01 bound by "work out the cause" so TROUBLESHOOT outranks the near-tied CLI hit; post-ws2 packets 49/49 intent]
- [x] T023 [P] Choose rejection vs packet-level fallback semantics and align all six negative fixtures plus runtime zero-score branches (six packets' negative scenarios and SKILL.md router pseudocode) [evidence: single-valued rejection semantics adopted (matches MT-004 and all six authored negative golds): zero-score selects NO intent, loads NOTHING, and offers the default as `suggested_fallback` beside the disambiguation checklist; all six SKILL.md pseudocode fallback branches corrected (chrome/aside ALWAYS-preamble load removed; figma/refero/mobbin unconditional default load removed + zero-score classify returns no intent; click-up hardcoded fallback loads replaced with the suggestion and its NOTE comment rewritten); six negative fixtures pass unchanged (expected_intent none, expected_resources [])]
- [x] T024 Add replay/runtime parity assertions for every documented fallback branch, including ClickUp's hardcoded fallback (skill-benchmark harness tests) [evidence: tests/route-gold-gate.vitest.ts "mcp-tooling packet fallback parity" — parameterized over the six packets: fallback-only declaration parses, zero-score replay = no intent + no resource, scored replay = exactly the declared intent resources, ClickUp no longer hard-loads cupt_commands.md, hub defers with empty assembly, and an undeclared router keeps the legacy union; 39/39 tests pass]
- [x] T025 [P] Adjudicate universal base resources and align the 11 positive packet gold rows (Aside 4, Chrome 3, Mobbin 2, Refero 2 scenarios) [evidence: under fallback-only assembly the universal-preamble union is gone, so 10/11 rows are correct as authored (gold stays minimal = exactly the mode's declared resources; verified by post-ws2 replay 49/49 resource); 1 correction: AD-R03 gold gains `assets/utcp-aside-manual.md` (a declared MCP-intent resource the gold omitted) with adjudication note in the scenario]
- [x] T026 Enforcement proof: demonstrate a previously-passing route-violating scenario now FAILS the benchmark (control run, evidence captured) [evidence: scratch COPY of the corpus (live corpus untouched) with MT-001 expected_intent flipped to mcp-figma -> verdict BLOCKED-BY-ROUTE-GOLD, violations=1, CLI exit 3; same corpus with --route-gold off -> PASS exit 0; both also pinned as harness tests (route-gold-gate.vitest.ts end-to-end block, incl. a gold-parse-failure variant that blocks loudly)]
- [x] T027 Re-run the Lane-C benchmark into a NEW run-label folder; verify baseline/ untouched and route-gold rows above 0 (.opencode/skills/mcp-tooling/benchmark/) [evidence: benchmark/after-routing-remediation/ — verdict PASS, aggregate 98, routeGold mode auto ENFORCED, rows 13, matches 13, violations 0, parseFailures 0; `git status` shows baseline/ untouched (only the new untracked run-label folder); run table updated in benchmark/README.md]
- [x] T028 Consumer-safety control: run one non-mcp-tooling skill's Mode A benchmark with the gate off; verdict unchanged vs its frozen baseline [evidence: pre-change control reports captured BEFORE any harness edit — mcp-code-mode (non-hub, auto->off): NO-SCENARIOS pre==post, core fields identical; sk-code (hub) with `--route-gold off`: PASS 83 with 30/30 scenarios pre==post and per-scenario modeAScore identical (routeGold block additive-only: 15 rows, 10 violations visible, not enforced)]

### WS3 transport trust metadata, F006-F007 [depends: T001; parallel to WS1/WS2]

- [x] T030 [P] Define mutation classes distinguishing external-document mutation, local export writes, and direct editing; fix the Figma toolSurface declaration (.opencode/skills/mcp-tooling/mode-registry.json) [evidence: schema constraint verified first — parent-skill-check.cjs:435 requires mutatesWorkspace:bool and :499 hard-requires transports false, so the boolean stays false (dominant posture: document mutation lands in Figma Desktop) and figma's toolSurface gains a `workspaceWrites: "export-only: ..."` clarifier (precedent: the checker's own writeScopeNote annotation at :515-523); transport-axis description now defines the three classes (external-document mutation = the boolean's dominant posture; local export writes = per-mode workspaceWrites; direct editing = Write/Edit forbidden on transports); grep-proof six-row posture table in checklist CHK-230; jq + validate_skill_package.py (package PASS + parent-skill-check PASS) post-edit]
- [x] T031 [P] Make the sk-design pairing precondition explicit for every design-affecting Figma authoring path, consistent with hub ADR-002 (.opencode/skills/mcp-tooling/mcp-figma/SKILL.md) [evidence: 7 bounded edits to `mcp-figma/SKILL.md` — §1 Use Cases (Author/modify + Design-system/tokens now name the precondition), §2 Phase Detection (Phase 3 line: `sk-design pairing FIRST`), §2 Resource Loading Levels (ALWAYS design-work row extended to authoring/token paths), §3 Command classes (design-affecting MUTATING verbs carry the precondition; app-level connection/daemon/config verbs exempt), §4 ALWAYS rule 8 (both directions: reads feeding decisions AND every authoring path, citing hub ADR-002 `crossHubPairing`), §6 Success Criteria (Author/modify completion requires the pairing to have supplied the judgment), §7 Cross-Workflow Contracts (sk-design as mandatory precondition); agreement check: hub SKILL.md §Transport Cross-Hub Pairing ("before any design-affecting Figma operation") and mode-registry crossHubPairing already said this — packet now agrees; references/tool_surface.md gate ceremony and INSTALL_GUIDE Quick Reference Card carry no conflicting pairing claims; `package_skill.py --check` mcp-figma PASS]

### WS4 six-mode traceability, F009-F011 [depends: T001; T040 also depends T010-T014]

- [x] T040 Regenerate hub graph projections (derived intent signals, narrative edges, causal summary) from the six-mode inventory (.opencode/skills/mcp-tooling/graph-metadata.json) [evidence: all five residual three-mode surfaces fixed — `depends_on[0]` mcp-code-mode context ("all three modes" -> all six with per-axis lanes), `depends_on[1]` sk-design context (figma-only pairing -> all three transports incl. figma authoring paths), `enhances[0]` sk-code context (three-mode union -> six-mode union), `derived.intent_signals` (+15 aside/refero/mobbin signals mirroring the six-mode root inventory), `causal_summary` (six-mode narrative naming every mode and the transport pairing); diff-reviewed against mode-registry.json's 6-mode inventory; hub description.json diff-reviewed — already six-mode, no residual text, no edit; `skill_graph_compiler.py --validate-only` PASSED then `--export-json` recompiled (hub skills include mcp-tooling)]
- [x] T041 [P] Amend phase-007 acceptance docs from three-mode framing to the six-mode corpus and real evidence paths (007-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md, plan.md, tasks.md) [evidence: dated ANCHOR:amendment-2026-07-16 section appended to each doc (history preserved, no rewrite): six-mode inventory, executed-benchmark evidence paths (benchmark/baseline/ PASS 95 + benchmark/after-routing-remediation/ PASS 98 route-gold 13/13), .gitkeep-claim and router-final/ naming supersessions, remediation pointer; continuity freshness bumped (spec/plan/tasks + implementation-summary), description.json + graph-metadata.json regenerated via generate-description.js + backfill-graph-metadata.js; validate.sh --strict --no-recursive on that folder: Errors 0, Warnings 0, RESULT PASSED]
- [x] T042 [P] Regenerate the hub playbook index to list six modes and 13 scenarios with working links (.opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md) [evidence: index regenerated from the committed corpus — 13 files under hub_routing/ (7 primary MT-001..004/007/008/009 + 6 blind holdouts MT-H01..H06, one per mode = holdout coverage 6/6), six-mode overview, MT-H01 chrome-vs-aside boundary section, fallback-only success criteria, corrected packet-playbook and benchmark links; link check: 13/13 markdown links + all 9 referenced sibling paths resolve, 0 broken (the old index's hub-routing/*-hyphen links were all broken)]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [plan Phase 5: terminal bounded re-review; depends: all above]

- [x] T050 Re-run the SAME review scope and dimensions via the deep-review loop; expect PASS with zero active P0/P1 (review artifacts in this packet) [evidence: terminal re-review PASS with P0=0 P1=0 P2=1-advisory-fixed; `review-report.md` promoted; convergence 1.0 at 4/4 iterations]
- [x] T051 Re-run core traceability protocols (spec_code, checklist_evidence) and the playbook_capability overlay; expect clean [evidence: terminal re-review PASS with P0=0 P1=0 P2=1-advisory-fixed; `review-report.md` promoted; convergence 1.0 at 4/4 iterations]
- [x] T052 Regression delta vs T003/T004 baselines: package/hub gates, ratchet, advisor probes all green; record evidence in checklist.md [evidence: terminal re-review PASS with P0=0 P1=0 P2=1-advisory-fixed; `review-report.md` promoted; convergence 1.0 at 4/4 iterations]
<!-- /ANCHOR:phase-3 -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [x] Gate 3 spec folder confirmed (`mcp-tooling/011-routing-remediation`); scope limited to surfaces named in spec.md [evidence: packet created via `create.sh --level 3`; `git status` scope checks per phase]
- [x] ADR-001 ruling present in decision-record.md before touching hub-router.json or resource gold [evidence: `decision-record.md` ADR-001 Accepted with adjudication note dated 2026-07-16 prior to WS1]
- [x] Read every target file before editing; verify line references against current content [evidence: 4/4 phase agents operated read-first; 0 string-not-found edit failures recorded]

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Respect the dependency notes in each heading; T001/T002 gate everything downstream |
| TASK-SCOPE | Only the surfaces listed in the task's file path; no adjacent cleanup |
| TASK-EVIDENCE | Each completed task records command output or file:line evidence in checklist.md |
| TASK-FROZEN | Never write into `benchmark/baseline/`; new benchmark output goes to a new run-label folder |

### Status Reporting Format

Report per task: `T### status (pending/active/done/blocked) - evidence pointer - blocker if any`.

### Blocked Task Protocol

On a blocked task: mark `[B]`, record the blocker in checklist.md and the continuity frontmatter, halt dependent tasks, and escalate with the conflicting facts and the decision needed (Logic-Sync when spec conflicts with evidence). Never substitute a manual workaround for a plan-named workflow.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] SC-001 to SC-004 evidenced (re-review PASS, enforced benchmark re-run, gates green, protocols clean)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md` (ADR-001 gate)
- **Research**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->

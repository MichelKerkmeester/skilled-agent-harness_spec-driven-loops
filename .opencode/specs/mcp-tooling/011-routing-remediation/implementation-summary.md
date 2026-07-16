---
title: "Implementation Summary: mcp-tooling routing remediation - Phase 0 freeze, WS1 router fixes, WS2 route-gold enforcement, WS3 transport trust, WS4 six-mode traceability (in progress)"
description: "The mcp-tooling routing surface replays clean end to end (13/13 hub, 49/49 packets, route-gold hard gate enforced), the Figma transport's mutation and sk-design pairing contracts are truthful, and all six-mode traceability surfaces (graph projections, phase-007 amendments, playbook index) are regenerated. Phase 5 terminal re-review remains."
trigger_phrases:
  - "routing remediation progress"
  - "ws1 router fixes summary"
  - "ws2 route-gold gate summary"
  - "mcp-tooling replay fixtures"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/011-routing-remediation"
    last_updated_at: "2026-07-16T19:05:00Z"
    last_updated_by: "claude"
    recent_action: "Completed Phase 3 WS3 and Phase 4 WS4"
    next_safe_action: "Execute Phase 5 terminal re-review (T050-T052)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mode-registry.json"
      - ".opencode/skills/mcp-tooling/mcp-figma/SKILL.md"
      - ".opencode/skills/mcp-tooling/graph-metadata.json"
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-011-phase3-4-ws3-ws4"
      parent_session_id: "planning-011-routing-remediation"
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "ADR-001 ruling: fallback-only (option a), Accepted 2026-07-16; ADR-002 scope confirmed as planned"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-routing-remediation |
| **Completed** | In progress (Phase 0 + Phase 1/WS1 + Phase 2/WS2 + Phase 3/WS3 + Phase 4/WS4 done 2026-07-16; Phase 5 pending) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mcp-tooling hub router now routes every committed scenario to its intended intent: the deterministic replay went from 6/13 to 13/13 intent matches with the certified-clean MT-H01 boundary byte-identical. Phase 0 froze the pre-fix world (replay fixtures for 13 hub and 49 packet scenarios plus gate baselines) so every later phase has a regression anchor.

### Phase 0: adjudication and regression freeze

ADR-001 (fallback-only `defaultResource`) and ADR-002 (route-gold gate scope) are Accepted in `decision-record.md`. The `regression/` folder holds `pre-fix-replay-hub.json` (6/13 intent, 2/13 resource), `pre-fix-replay-packets.json` (38/49 intent), and `pre-fix-gates.md` (package check PASS, parent-skill-check PASS, advisor ratchet 7/7 with baseline numbers), all captured at repo HEAD `1508a744d3`.

### WS1: deterministic hub routing (F001-F005)

`hub-router.json` v1.1.0.0 now declares `defaultResourceSemantics: "fallback-only"` with an explicit contract string (F002 producer side), moves `hub-identity` and the new `provider-neutral-design-research` class to discovery-only `routerPolicy.discoveryClasses` so hub-vocabulary-only prompts defer (F003, F005), restores Figma lexical recall with the bare `figma` alias plus `design tokens`/`design file` (F001), and binds all five failing blind holdouts with provider-appropriate vocabulary recorded per scenario as `blindExceptions` (F004). The hub `SKILL.md` routing rule states the fallback-only semantics; MT-004 asserts the fallback contract explicitly. Post-fix replay: `regression/post-ws1-replay-hub.json`, 13/13 intents.

### WS2: route-gold enforcement and packet alignment (F008, F012-F015)

The shared skill-benchmark harness now consumes route gold as a hard gate. `run-skill-benchmark.cjs` gains `--route-gold on|off|auto` (auto = enforced for hub-type skills, detected by `hub-router.json`); `load-playbook-scenarios.cjs` parses `expected_intent`/`expected_resources` loudly (a present-but-unparseable block is a counted `goldParseError`, never a silent skip, and packet-pointer gold like `mcp-figma/SKILL.md` — previously dropped by the path-prefix regex — now parses as authored); `score-skill-benchmark.cjs` scores every gold row (`evaluateRouteGold`: exact intent set with `none`/`defer`/`UNKNOWN` asserting the empty set; exact resource assembly for frontmatter corpora, must-include + no-forbidden-prefix for sk-code-shape corpora) and an enforced violation flips the verdict to `BLOCKED-BY-ROUTE-GOLD` with process exit 3; `build-report.cjs` renders the lane with flag state, counts, and per-scenario detail.

The replay consumer fix (T021) makes `router-replay.cjs` honor declared default-resource semantics generically: a router declaring fallback-only never assembles its default (it is the defer-time suggestion); a router with no declaration keeps the legacy union byte-for-byte. All six packet SKILL.md routers now declare `DEFAULT_RESOURCE_SEMANTICS = "fallback-only"` and their documented fallback branches were corrected to the single-valued rejection semantics (zero-score selects no intent, loads nothing, suggests the default beside the disambiguation checklist) — including removing chrome/aside's ALWAYS-preamble load, figma/refero/mobbin's unconditional default load and guessed zero-score intent, and ClickUp's two hardcoded fallback loads (F013/F014). Corpus alignment: five holdout bindings with `blindExceptions` rationale (CD-H01, CU-H01, CU-H02, MB-H01, MB-H02 — zero removals, F012) and one F015 gold correction (AD-R03 gains the declared MCP-intent asset); the other ten F015 rows are correct as authored under fallback-only assembly.

Evidence: `regression/post-ws2-replay-{hub,packets}.json` — hub 13/13 intent + 13/13 resource, packets 49/49 + 49/49 (`scratch/replay-driver.cjs`, loader-enumerated, gold from raw frontmatter); benchmark re-run `mcp-tooling/benchmark/after-routing-remediation/` PASS 98 with routeGold `{auto, enforced, rows 13, matches 13, violations 0}`; enforcement proof (scratch-corpus injection) BLOCKED-BY-ROUTE-GOLD exit 3 and gate-off PASS; new harness suite `tests/route-gold-gate.vitest.ts` 39/39.

### WS3: transport trust metadata (F006-F007)

The Figma transport's mutation metadata is now honest without breaking the schema: `parent-skill-check.cjs` hard-requires `mutatesWorkspace` to be a boolean (3d) and transports to declare `false` (3h), so the boolean keeps the dominant posture (document mutation lands in Figma Desktop) and the figma `toolSurface` gains a `workspaceWrites` export-only clarifier naming the local export writes and their explicit-path/no-overwrite gate. The transport-axis description now defines the three mutation classes (external-document mutation, per-mode local export writes via `workspaceWrites`, direct editing forbidden). A six-row grep-proof against every mode's own command taxonomy found no other misdeclaration: the three workflow bridges honestly declare `true` (each grants Write/Edit and writes local artifacts), refero and mobbin honestly declare `false` (zero local writes, Write/Edit/Task forbidden).

The sk-design pairing is now a named precondition on every design-affecting Figma authoring path, not just on reads feeding decisions: seven bounded edits to `mcp-figma/SKILL.md` (Use Cases, Phase Detection, Resource Loading Levels, Command classes, ALWAYS rule 8, Author/modify Success Criteria, Cross-Workflow Contracts) align the packet with the hub's ADR-002 `crossHubPairing` doctrine, which already required judgment before any design-affecting Figma operation.

### WS4: six-mode traceability (F009-F011)

Hub `graph-metadata.json`'s residual three-mode narrative is gone: `derived.intent_signals` gained the aside/refero/mobbin signal block, the mcp-code-mode/sk-design/sk-code edge contexts and the `causal_summary` now narrate all six modes (with the transport pairing covering all three transports), diff-reviewed against `mode-registry.json`; the hub `description.json` was diff-reviewed and was already six-mode. The skill-graph compiler validated (12 metadata files, 0 errors) and the export recompiled.

Phase-007's acceptance docs carry dated amendment sections (spec/plan/tasks, `ANCHOR:amendment-2026-07-16`) recording the six-mode reality, the executed benchmark evidence (`benchmark/baseline/` PASS 95; `benchmark/after-routing-remediation/` PASS 98 route-gold enforced), and the `router-final/`/`.gitkeep` supersessions — history preserved, no rewrite; the folder's description/graph metadata were regenerated and it validates strict with zero errors and zero warnings.

The hub playbook index was regenerated from the committed corpus: 13 scenario files across six modes (7 primary + 6 blind holdouts, holdout coverage 6/6), the MT-H01 chrome-vs-aside boundary note, fallback-only success criteria, and a scripted link check with 0 broken links (the prior index's four hyphen-named links were all broken).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Producer-and-gold first, consumer next: every vocabulary and policy edit was verified against the frozen pre-fix fixtures by re-running the same deterministic replay driver, and the packet corpora were left untouched (their 38/49 replay result is identical pre and post, proving WS1 isolation). Gates re-ran after the edits: `jq empty` on both JSON surfaces, package check, parent-skill-check, and the advisor ratchet all PASS.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `defaultResource` and add `defaultResourceSemantics: "fallback-only"` instead of deleting the field | Preserves the zero-signal affordance and the `parent-skill-check` 5d resource-path check while making the contract explicit, per ADR-001 option (a) |
| Bind all five holdouts rather than re-adjudicating any out of gold | Each had a natural provider-appropriate anchor ("design file", "project tracker", "click through"/"on its own", "web products", "phone apps"); `blindExceptions` frontmatter keeps the blind claim honest |
| Drop "screen examples" from BOTH provider classes into a discovery-only class | MT-008/MT-009 contracts allow defer for generic phrasing naming neither tool; keeping it in either class would silently privilege one provider |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Post-WS1 hub replay (13 scenarios) | PASS at intent level: 13/13 (pre-fix 6/13); resource assembly 2/13, expected until the Phase 2 `router-replay.cjs:514` consumer fix |
| MT-H01 certified boundary | PASS: replay object byte-identical pre/post |
| Packet replay isolation (49 scenarios) | PASS: 38/49 pre and post, unchanged |
| `jq empty` hub-router.json + description.json | PASS |
| F005 dual-selection probe | PASS: unqualified screen-examples prompt replays intents=[] (defer) |
| Post-WS2 hub replay (13 scenarios) | PASS: 13/13 intent AND 13/13 resource (`regression/post-ws2-replay-hub.json`) |
| Post-WS2 packet replay (49 scenarios) | PASS: 49/49 intent AND 49/49 resource, zero gold removals (`regression/post-ws2-replay-packets.json`) |
| Benchmark re-run (new run-label, gate enforced) | PASS 98, routeGold rows 13 / matches 13 / violations 0; `baseline/` untouched |
| Enforcement proof (gate gates) | PASS: scratch-corpus injected violation -> BLOCKED-BY-ROUTE-GOLD exit 3; `--route-gold off` -> PASS exit 0; parse-failure variant also blocks |
| Consumer-safety controls | PASS: mcp-code-mode (auto->off) and sk-code (`--route-gold off`) verdicts + per-scenario scores identical to pre-change captures |
| Harness vitest (203 tests) | PASS 184 incl. new route-gold suite 39/39; 19 failures are pre-existing (stash A/B identical pre/post, unrelated fixtures/corpus outside packet scope) |
| `node --check` on touched .cjs | PASS (router-replay, load-playbook-scenarios, score-skill-benchmark, run-skill-benchmark, build-report) |
| `package_skill.py --check` hub + six packets, parent-skill-check | PASS (exit 0, all eight checks, post-WS2) |
| Advisor ratchet (7 tests) | PASS 7/7 after WS1 and again after WS2 (advisor corpus untouched) |
| Post-WS3/WS4 `jq empty` (mode-registry, hub graph-metadata) | PASS both |
| Post-WS3/WS4 `validate_skill_package.py` hub | PASS (package check + parent-skill-check both exit 0) |
| Post-WS3 `package_skill.py --check` mcp-figma | PASS (1 pre-existing-class word-count warning) |
| Skill-graph compiler | `--validate-only` VALIDATION PASSED (12 metadata files); `--export-json` recompiled clean |
| Playbook index link check | PASS: 13/13 markdown links + 9/9 referenced sibling paths resolve, 0 broken |
| Phase-007 folder re-validation | PASS: `validate.sh --strict --no-recursive` Errors 0, Warnings 0 (after amendment + metadata regeneration) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Advisor probe outputs were not captured in the Phase 0 baseline.** Recorded as open in `regression/pre-fix-gates.md`; capture them with the Phase 5 regression delta.
2. **Other hub-type skills' NEXT benchmark runs will newly enforce route gold** (per ADR-002 this is the intended default): sk-code's corpus currently carries 10 route-gold recall violations that would block an auto-mode run — true positives for that owner to triage (or run with `--route-gold off` during triage); its frozen baseline stays valid.
3. **19 pre-existing harness test failures** (missing sk-design-dispatch fixture files; sk-code corpus-count drift from concurrent sessions) fail identically before and after this workstream (stash A/B) and are outside this packet's write authority.
4. **Phase 2 evidence is pinned to the working tree over base `1508a744d3`** (WS1+WS2 are uncommitted in this session); pin final SHAs at the workstream commit.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

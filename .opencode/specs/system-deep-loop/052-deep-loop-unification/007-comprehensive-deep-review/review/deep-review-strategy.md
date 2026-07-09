---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

## 1. OVERVIEW

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

---

## 2. TOPIC
Review: `.opencode/skills/system-deep-loop` — the entire hub (SKILL.md, mode-registry.json, hub-router.json, description.json, graph-metadata.json) plus all 4 workflow packets (`deep-research`, `deep-review`, `deep-improvement`, `deep-ai-council`): their SKILL.md, references/, assets/, scripts/, changelog/. 20 forced iterations, GPT-5.5-fast at high reasoning effort. Goal: find and fix real bugs, and confirm sk-doc template alignment repo-wide (not just the SKILL.md structural checks phase 006 already confirmed).

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity, sk-doc template alignment
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
Not re-litigating the hub's two-axis architecture (already canon-clean, `parent-skill-check.cjs` 34/34, confirmed twice this session). Not touching `.opencode/specs/descriptions.json` or the SQLite/vector daemon index. Not reviewing `node_modules/` or generated benchmark-baseline artifacts.

---

## 5. STOP CONDITIONS
`stopPolicy = max-iterations`: convergence signals are telemetry-only until iteration 20. The loop runs the full 20 iterations regardless of early convergence; only the hard `maxIterationsReached` stop at iteration 20 is legal.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| correctness | PASS with P2 advisory | 2 | Hub routing contract is internally consistent across SKILL.md, registry, router, description, graph metadata, and README; one README label implies runtime/ is a standalone related skill even though it is nested non-routable infrastructure. |
| security | PASS with P2 advisory | 3 | Hub-tier path routing is documented with containment guards, and hub JSON/prose contains no secrets; one advisory remains because the hub SKILL.md frontmatter grants broad tools despite routing-only hub behavior. |
| traceability | PASS with P2 advisory | 4 | Registry packet paths, command entry points, and agent definitions match the seven live modes; secondary README/playbook version metadata still says 1.1.0.0 while the live hub is 2.0.0.0. |
| maintainability | PASS with P2 advisory | 5 | Hub routing, README, and registry extension docs are understandable; adding another workflow mode lacks one consolidated maintainer checklist across registry, router, docs/metadata, command/agent surfaces, and advisor drift guards. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 7 active
- **P2 (Minor):** 15 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
[Populated after iteration 1]

---

## 9. WHAT FAILED
[Populated after iteration 1]

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

---

## 11. RULED OUT DIRECTIONS
[Populated as review angles are investigated and eliminated]

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 1 complete (inventory pass): Actual tree shape confirmed with hub files, 4 workflow packets, `runtime/`, `shared/`, `benchmark/`, `changelog/`, `manual_testing_playbook/`, and out-of-scope `node_modules/` dependency trees. Packet file counts excluding `node_modules/`: `deep-research` 146, `deep-review` 147, `deep-improvement` 458, `deep-ai-council` 129. Highest-risk later surfaces are executable/path-writing helpers (`scripts/**/*.cjs`, `*.py`, `*.sh`, runtime/fanout helpers), cross-packet resource maps, feature catalogs, manual testing playbooks, and benchmark/reporting references. No new findings were confirmed in the inventory pass.

Iteration 2 next focus: keep the planned rotation and begin the hub tier with a correctness-focused review of `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, and `README.md`. Validate that hub routing claims match the actual packet layout above, and keep `node_modules/` plus generated benchmark report artifacts outside source-review scope.

Iteration 2 complete (hub correctness): confirmed seven workflow modes, seven hub-router signals, full tie-break coverage, all referenced vocabulary classes present, and the single graph identity invariant. Found one P2 README wording issue: `runtime/` appears in a `Related Skills` table even though the hub and graph metadata define it as nested non-routable infrastructure.

Iteration 3 next focus: continue the hub tier with security. Check that read-only/defer workflows cannot route into improvement mutation scripts, that command/agent surfaces preserve the same packet boundaries, and that runtime path references stay guarded inside the skill.

Iteration 3 complete (hub security): confirmed `SKILL.md` routing text requires `_guard_in_skill` containment and existence checks before packet loads; hub-tier `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` contain no credential/token/URL secrets; mode registry mutating surfaces are consistent with mode artifact-writing or improvement behavior. Found one P2 blast-radius issue: the hub `SKILL.md` frontmatter grants Write/Edit/Bash/Task/WebFetch even though the hub's described behavior is routing-only and delegates mode behavior to packets.

Iteration 4 next focus: continue the hub tier with traceability. Cross-check `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, README, command aliases, and agent names for consistent mode identities and packet boundaries, without re-counting the existing README/runtime label or hub tool-grant advisories as new.

Iteration 4 complete (hub traceability): confirmed all seven registry packet paths resolve to real packet SKILL.md files, all seven `/deep:*` command files correspond to registry commands, and deep-agent definitions use current mode names. Found one P2 advisory: README/manual-testing-playbook version metadata still reports 1.1.0.0 while live hub sources are 2.0.0.0.

Iteration 5 next focus: finish the hub tier with maintainability. Check whether the hub-level docs and registry surfaces make safe future updates straightforward, without re-counting existing P2 advisories.

Iteration 5 complete (hub maintainability): hub-tier review is complete. The hub tier is clean for current routing behavior: no P0/P1 findings were confirmed across correctness, security, traceability, or maintainability. Four P2 advisories remain active and carry forward only as background context: README/runtime label wording, broad hub allowed-tools, stale secondary version metadata, and the missing checklist for adding a future workflow mode. Packet-level iterations 6+ should not re-count these unless a packet-level consumer proves broader impact.

Iteration 6 next focus: begin the `deep-research` packet with correctness. Review packet-local `SKILL.md`, loop protocol, state format, prompt/rendering contracts, and executable helpers for behavior mismatches against the hub-level routing promises.

Iteration 6 complete (`deep-research` correctness): sampled packet-local `SKILL.md`, loop protocol, state-format references, config template, reducer write paths, runtime capability shim, README, manual-testing charter scenario, and four internal links. No P0/P1 runtime correctness bug was confirmed. Found two P2 documentation correctness drifts: live manual-testing docs still cite charter validation as Step 5a while the protocol now defines it as Step 7a, and top-level docs describe `deep-research-findings-registry.json` as canonical while the config/reducer writes `findings-registry.json`.

Iteration 7 next focus: continue the `deep-research` packet with security. Focus on path handling in artifact-root resolution, reducer writes, pause/lock sentinels, command YAML shell boundaries, WebFetch/tool-permission claims, and whether user-controlled spec folders or inbox records can escape the intended research packet.

Iteration 7 complete (`deep-research` security): confirmed no committed credential/API-key pattern in the packet scan and verified fixed-path writes through the reducer. Found two P1 security issues: external WebFetch content is allowed into a broad Write/Edit/Bash/Task tool surface without packet-level prompt-injection or URL/domain guardrails, and the shared artifact-root resolver rejects shell metacharacters but does not constrain resolved `specFolder` paths to workspace/spec roots before reducer writes.

Iteration 8 next focus: continue the `deep-research` packet with traceability. Cross-check packet-local docs, command entrypoints, agent definitions, feature catalog, and manual-testing playbook against the live `deep-research` contracts. Do not re-count DR-007-P1-001 or DR-007-P1-002 as new; only reference them if traceability surfaces contradict or mitigate them.

Iteration 8 complete (`deep-research` traceability): fresh `package_skill.py --check` passed with `Result: PASS`; README, latest changelog, and sampled internal links are mostly current. Found one new P1: the active generated `/deep:research` command contract assigns whole-loop and artifact-write ownership to the `deep-research` LEAF agent even though the packet SKILL, YAML, and agent definition say YAML owns the loop and the LEAF executes one iteration.

Iteration 9 next focus: continue the `deep-research` packet with maintainability. Focus on whether loop ownership, reducer-owned files, registry-name transition, generated command contracts, and LEAF boundaries are documented in a way that prevents future drift. Do not re-count DR-008-P1-001 unless new evidence broadens it beyond the command-contract generator surface.

Iteration 9 complete (`deep-research` maintainability): the packet is clear enough for current operators: `SKILL.md`, README, quick reference, and grouped `references/` provide an understandable end-to-end entry path, and the domain-subfoldered `references/` organization is appropriate for a 146-file packet. The packet is not clean: it carries forward prior active P1/P2 findings, and this pass adds one P2 maintainability advisory because feature-level docs list existing source and validation anchors but do not provide a single maintainer checklist for adding or changing a research-loop feature across SKILL routing, references, feature catalog, manual playbook, command YAML/tests, assets, and scripts.

Iteration 10 next focus: begin the `deep-review` packet with correctness. Review packet-local `SKILL.md`, quick reference, loop protocol, state references, reducer scripts, and iteration-output contracts. Carry forward the existing hub and deep-research findings as context only; do not re-count them unless a deep-review packet consumer proves a broader impact.

Iteration 10 complete (`deep-review` correctness): sampled loop protocol, state format, convergence docs, reducer code, prompt-pack template, and this review's live config/state/strategy/registry. Found two P2 correctness advisories: the reducer warns on valid `findingsNew` arrays despite the prompt/template contract, and persisted `graph_convergence` events omit signal payloads needed to replay documented rolling/MAD/dimension convergence math. No P0/P1 issue was confirmed.

Iteration 11 next focus: continue the `deep-review` packet with security. Focus on artifact-root/path containment, reducer write surfaces, shell/script boundaries, no-WebFetch claims, and whether the packet's tool/write allowances can escape the review packet. Do not re-count DR-010-P2-001 or DR-010-P2-002 unless a security consumer proves broader impact.

Iteration 11 complete (`deep-review` security): prompt-pack write paths are scoped and env allowlisting/recursion guards exist for non-native executors, but the deep-review executor references understate the live `cli-opencode` branch's permission blast radius. Found one new P1: packet docs advertise workspace-write sandboxing while the command branches run `opencode` with `--dangerously-skip-permissions` and note that read-only sandboxMode is not honored. Secrets scan of reviewed assets/references/scripts produced no real credential finding.

Iteration 12 next focus: continue the `deep-review` packet with traceability. Cross-check command contracts, agent definitions, feature catalog, manual playbook, and runtime docs against the live executor/write-boundary behavior. Do not re-count DR-010-P2-001, DR-010-P2-002, or DR-011-P1-001 unless a traceability consumer proves broader impact.

Iteration 12 complete (`deep-review` traceability): `package_skill.py --check` passed with `Result: PASS`; `SKILL.md` still links `references/protocol/completion_criteria.md`; the completion criteria file exists and carries the named quality-gate criteria; command and agent cross-references point to current packet paths. Found one P2 traceability advisory: command-flow manual testing source anchors still cite old `deep/review.md` and `deep-review/SKILL.md` line ranges that no longer exist after the command wrapper and SKILL trim.

Iteration 13 next focus: continue the `deep-review` packet with maintainability. Check whether packet maintainers have a reliable update checklist across SKILL routing, moved references, feature catalog, manual playbook anchors, command contract generation, reducer-owned files, and runtime docs. Do not re-count DR-012-P2-001 unless another consumer proves broader impact.

Iteration 13 complete (`deep-review` maintainability): the post-trim reference tree remains organized by domain (`convergence/`, `protocol/`, `state/`) and SKILL.md now mostly points to detailed references rather than duplicating them. The packet is not clean: it carries forward active DR-011-P1-001 plus DR-010-P2-001, DR-010-P2-002, DR-012-P2-001, and new DR-013-P2-001. Found one P2 maintainability advisory because `references/protocol/loop_state_and_gates.md` still presents the old three-gate STOP/`guard_violation` model as a standalone state-gate reference, while the canonical packet docs now use the 9-gate `blocked_stop` model.

Iteration 14 next focus: begin the `deep-improvement` packet with correctness. Review packet-local SKILL.md, mode/lane routing, evaluator-first contracts, benchmark harness scripts, promotion/rollback helpers, and state/output docs. Carry forward hub, deep-research, and deep-review findings as context only; do not re-count them unless a `deep-improvement` consumer proves broader impact.

Iteration 14 complete (`deep-improvement` correctness): sampled the recent skill-benchmark fixture rename across four public/private pairs and a full JSON parse/pair validation of 98 fixture files; no scenarioId mismatch or missing public/private counterpart was found. Sampled `profile-resolve.cjs`, `run-benchmark.cjs`, `score-skill-benchmark.cjs`, `improvement-journal.cjs`, `trade-off-detector.cjs`, `benchmark-stability.cjs`, runtime truth docs, and Lane B command routing. Found one new P1: shipped framework/model sweep profiles resolve fixtures by parsed fixture id under `sweep-benchmark.cjs`, but the public non-reviewer `/deep:model-benchmark` route sends them through `loop-host` -> `materialize-benchmark-fixtures.cjs`, whose literal resolver fails on those ids before scoring.

Iteration 15 next focus: continue `deep-improvement` with security. Focus on command/YAML shell boundaries, profile and fixture path containment, benchmark output roots under `.opencode/skills/sk-prompt-models/benchmarks/{run_label}`, reviewer-scorer flag gating, and whether Lane A/B/C/D helpers can write outside intended packet or benchmark output roots. Do not re-count DR-014-P1-001 unless the security pass proves path escape or broader write-boundary impact.

Iteration 15 complete (`deep-improvement` security): confirmed the current 5-dim criteria-exec and raw grader-cache gates are fail-closed/restrictive in code despite stale Lane B mechanics wording, and sampled materializer/dispatcher paths did not expose a shell-injection issue. Found one new P1: promotion and rollback helpers enforce approval, score, benchmark, repeatability, rubric, mirror-sync, and hash gates, but their final write boundary is only caller-supplied config/manifest equality rather than realpath containment under an allowed target root.

Iteration 16 next focus: continue `deep-improvement` with traceability. Cross-check command/YAML invocation paths, generated contracts, feature catalog, and operator docs against DR-014-P1-001 and DR-015-P1-001. Do not re-count either finding unless a traceability consumer proves broader impact or an independent contradiction.

Iteration 16 complete (`deep-improvement` traceability): fresh `package_skill.py --check` passed with `Result: PASS` and only the accepted `.gitkeep` snake_case warning; the fixture-stem rename recheck found no confirmed live broken filename-stem reference; sampled command and manual-testing playbook surfaces match current layout. Found one new P2: the Lane B model-benchmark `mode-switch.md` feature-catalog entry still describes only two `VALID_MODES`, while current `loop-host.cjs` exposes four modes and adjacent Lane C/D catalog entries document the newer modes.

Iteration 17 complete (`deep-improvement` maintainability): the post-trim reference tree is well organized by lane/shared concern, and the packet has a usable human navigation path through README, SKILL.md, feature catalog, manual playbook, and lane-organized references/assets. The four-lane design is documented clearly enough: Lane A/B/C/D share candidate, dispatcher, scorer, loop-host, and guard seams while keeping lane-specific references. The packet is not clean: DR-014-P1-001 and DR-015-P1-001 remain active P1s, DR-016-P2-001 remains active, and this pass adds DR-017-P2-001 because the three new post-trim references are prose-linked but absent from `RESOURCE_MAP`/on-demand router loading.

Iteration 18 next focus: begin `deep-ai-council` with a combined correctness+security pass. Review SKILL.md, council seat orchestration, artifact-write boundaries, consensus/convergence logic, and rollback/guardrail claims while carrying forward existing non-council findings as context only.

Iteration 18 complete (`deep-ai-council` correctness+security): sampled SKILL.md, loop protocol, seat diversity, convergence/failure handling, state/output schemas, config and prompt templates, persistence/audit/rollback/completion scripts, and scoped credential/tool-surface evidence. Found one new P1: full-report persistence always emits `council_complete` with `convergence:true`, contradicting max-round non-convergence and all-seat failure handling. Found one new P2: docs/tests still describe terminal `council_complete` even though current audit events may follow it and the live advisory uses presence semantics.

Iteration 19 next focus: finish `deep-ai-council` with traceability + maintainability. Focus on command/agent identity (`deep-ai-council` skill vs `ai-council` agent), feature catalog/playbook parity, changelog/version drift, graph support documentation, and whether DR-018-P1-001 is reflected consistently across operator docs.

Iteration 19 complete (`deep-ai-council` traceability+maintainability): fresh `package_skill.py --check` passed with exact `Result: PASS`; the `/deep:ai-council` command wrapper and rendered/compiled contract point at current `deep-ai-council` packet sources while preserving `{spec_folder}/ai-council` artifact writes. The multi-seat design is maintainable enough for a future seat change: SKILL.md/README/seat-diversity docs describe 2-3 seats, six lenses, one-CLI-per-round, same-CLI vantage diversity, and two-of-three convergence without harmful duplication between SKILL.md and references. The packet is not clean: DR-018-P1-001 and DR-018-P2-001 carry forward, and this pass adds two P2s for README release metadata drift and DAC-001 still expecting `@deep-ai-council` as the active runtime agent identity even though the live registry/agent preserve `@ai-council`.

Interim packet verdicts before iteration 20 synthesis: hub tier is behavior-clean with four P2 advisories; `deep-research` carries three active P1s plus P2 documentation/maintainer advisories; `deep-review` carries one active P1 plus P2 reducer/traceability/maintainability advisories; `deep-improvement` carries two active P1s plus P2 traceability/resource-routing advisories; `deep-ai-council` carries one active P1 plus three P2 advisories after iterations 18-19. No P0 findings have been confirmed across the 19 iterations. Iteration 20 should synthesize the active registry rather than re-count packet-local findings.

Iteration 20 complete (final synthesis): fresh close-out checks passed for all five packages: `deep-research`, `deep-review`, `deep-improvement`, and `deep-ai-council` all returned `Result: PASS`; `deep-improvement` retained only the accepted `.gitkeep` snake_case warning; `parent-skill-check.cjs` reported all hard hub invariants passed with 0 warnings. Cross-packet package shape is consistent, with `deep-ai-council/node_modules/` treated as the known dependency-tree exception and no new convention drift confirmed. Final registry total remains 0 P0, 7 P1, 15 P2 active. Overall tree verdict: CONDITIONAL because no P0 blockers remain and structural checks pass, but seven active P1 findings still require remediation before PASS.

**Planned iteration rotation** (area × dimension, risk-ordered correctness → security → traceability → maintainability within each area):
- Iteration 1: Inventory (whole tree)
- Iterations 2-5: Hub tier (SKILL.md, mode-registry.json, hub-router.json, description.json, graph-metadata.json) — correctness, security, traceability, maintainability
- Iterations 6-9: `deep-research` packet — correctness, security, traceability, maintainability
- Iterations 10-13: `deep-review` packet — correctness, security, traceability, maintainability
- Iterations 14-17: `deep-improvement` packet (largest, 458 files excluding `node_modules`, includes the benchmark harness + scripts) — correctness, security, traceability, maintainability
- Iterations 18-19: `deep-ai-council` packet (smallest) — correctness+security combined, traceability+maintainability combined
- Iteration 20: Cross-cutting synthesis — fresh `package_skill.py --check` + `parent-skill-check.cjs` re-run (not stale results), cross-packet consistency check, final packet-level verdict

This rotation may adjust iteration-to-iteration based on what earlier iterations find (e.g. a packet with more findings may warrant an extra pass, borrowed from a cleaner packet's dimension budget) — the orchestrator will note any deviation here.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
No prior deep-review session exists for this exact target (fresh lineage). Directly relevant prior work THIS session:
- Phase 006 (`052-deep-loop-unification/006-skillmd-template-conformance`, just completed): confirmed all 5 SKILL.md files pass structural template checks (`package_skill.py --check` PASS on all 4 packets, `parent-skill-check.cjs` 34/34 on the hub), fixed 131 non-conforming asset filenames + all broken references, fixed changelog frontmatter, trimmed 3 oversized SKILL.md files under the 3000-word soft budget with independently-verified zero content loss. This review should CONFIRM those fixes are still solid (fresh checker runs, not trusted from memory) and go deeper into content correctness/security/maintainability that phase 006 didn't specifically target.
- Packet 124 (parent-hub canon conformance, referenced in project memory): established `system-deep-loop` as one of 3 canon-clean hubs (STRICT, 0 violations) alongside `sk-code`/`sk-design`.

### Bounded Context Snapshot
- **Target pointers**: hub tier (6 files) + 4 packets (880 files total excluding `node_modules`: research 146, review 147, improvement 458, ai-council 129) + `runtime/` and `shared/` infra dirs.
- **Behavior claims**: REQ-001..REQ-005 in `spec.md` (20 iterations complete, all dimensions covered per area, confirmed findings fixed and re-verified, sk-doc alignment freshly re-confirmed, no regression).
- **Reuse and conventions**: this session's established patterns — single-pass substitution over chained sed, exact old-number+slug matching over bare-number matching, "don't rewrite closed historical records," independent adversarial re-verification before trusting any fix or finding.
- **Review risks and gaps**: `deep-improvement`'s 459 files make exhaustive per-file review infeasible in 4 iterations — expect representative sampling with explicit disclosure of what was and wasn't covered, not a false claim of exhaustiveness.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
| `hub_traceability` | overlay | partial | 4 | Routing matrix passed; secondary version metadata drift recorded as DR-004-P2-001. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `system-deep-loop/SKILL.md` + hub companion files | correctness, security, traceability, maintainability | 5 | 4 P2 | complete |
| `system-deep-loop/deep-research/` (146 files) | correctness, security, traceability, maintainability | 9 | 3 P1, 3 P2 | complete |
| `system-deep-loop/deep-review/` (147 files) | correctness, security, traceability, maintainability | 13 | 1 P1, 4 P2 | complete |
| `system-deep-loop/deep-improvement/` (459 files) | correctness, security, traceability, maintainability | 17 | 2 P1, 2 P2 | complete |
| `system-deep-loop/deep-ai-council/` (131 files) | correctness, security, traceability, maintainability | 19 | 1 P1, 3 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 20
- Convergence threshold: 0.10 (telemetry-only; stopPolicy=max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-07-08T18:59:04.000Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: skill
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Executor: cli-opencode, model=openai/gpt-5.5-fast, reasoningEffort=high
- Started: 2026-07-08T18:59:04.000Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 7
- P2 (Suggestions): 15
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `agent_cross_runtime`: pending. Runtime/agent parity should be covered during hub and runtime-focused later passes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime`: pending. Runtime/agent parity should be covered during hub and runtime-focused later passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: pending. Runtime/agent parity should be covered during hub and runtime-focused later passes.

### `allowed_tools_scope`: fail — `WebFetch` is justified by research actions, but `Write`, `Edit`, `Bash`, and `Task` remain broad when combined with unconstrained external fetches. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `allowed_tools_scope`: fail — `WebFetch` is justified by research actions, but `Write`, `Edit`, `Bash`, and `Task` remain broad when combined with unconstrained external fetches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `allowed_tools_scope`: fail — `WebFetch` is justified by research actions, but `Write`, `Edit`, `Bash`, and `Task` remain broad when combined with unconstrained external fetches.

### `allowed_tools_scope`: pass with caveat. SKILL grants Read/Write/Edit/Bash/Glob/Grep; packet docs use read/search for evidence, Write/Edit for packet-local `ai-council/**`, and Bash for helper/validation invocation. No new tool-scope finding was confirmed. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `allowed_tools_scope`: pass with caveat. SKILL grants Read/Write/Edit/Bash/Glob/Grep; packet docs use read/search for evidence, Write/Edit for packet-local `ai-council/**`, and Bash for helper/validation invocation. No new tool-scope finding was confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `allowed_tools_scope`: pass with caveat. SKILL grants Read/Write/Edit/Bash/Glob/Grep; packet docs use read/search for evidence, Write/Edit for packet-local `ai-council/**`, and Bash for helper/validation invocation. No new tool-scope finding was confirmed.

### `checklist_evidence`: not yet applicable for target-file correctness; no implementation checklist claims were adjudicated in this inventory pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: not yet applicable for target-file correctness; no implementation checklist claims were adjudicated in this inventory pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: not yet applicable for target-file correctness; no implementation checklist claims were adjudicated in this inventory pass.

### `command_yaml_shell_boundaries`: not reviewed — command YAML is outside this iteration's declared target packet, so it was not widened into scope. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `command_yaml_shell_boundaries`: not reviewed — command YAML is outside this iteration's declared target packet, so it was not widened into scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `command_yaml_shell_boundaries`: not reviewed — command YAML is outside this iteration's declared target packet, so it was not widened into scope.

### `credential_scan`: pass with caveat. Scoped credential-pattern scan found no real committed secrets; matches were documentation/examples such as hostile metadata redaction using `secret: 'leak-me'`. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `credential_scan`: pass with caveat. Scoped credential-pattern scan found no real committed secrets; matches were documentation/examples such as hostile metadata redaction using `secret: 'leak-me'`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `credential_scan`: pass with caveat. Scoped credential-pattern scan found no real committed secrets; matches were documentation/examples such as hostile metadata redaction using `secret: 'leak-me'`.

### `deep-review` quick reference loaded before final iteration artifact decisions. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `deep-review` quick reference loaded before final iteration artifact decisions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `deep-review` quick reference loaded before final iteration artifact decisions.

### `description.json` accuracy: PASS. It describes seven modes across four workflow families and names the four improvement lanes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `description.json` accuracy: PASS. It describes seven modes across four workflow families and names the four improvement lanes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `description.json` accuracy: PASS. It describes seven modes across four workflow families and names the four improvement lanes.

### `env_var_hardening`: pass for runtime safety. `DEEP_AGENT_ALLOW_CRITERIA_EXEC` is fail-closed in `score-model-variant.cjs` and shared by `bundle-gate.cjs`; raw grader cache output is redacted unless `DEEP_AGENT_GRADER_CACHE_RAW=1|true`. `lane_b_mechanics.md` line 69 still describes permissive backward-compatible defaults, but the current code does not silently default unsafe. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `env_var_hardening`: pass for runtime safety. `DEEP_AGENT_ALLOW_CRITERIA_EXEC` is fail-closed in `score-model-variant.cjs` and shared by `bundle-gate.cjs`; raw grader cache output is redacted unless `DEEP_AGENT_GRADER_CACHE_RAW=1|true`. `lane_b_mechanics.md` line 69 still describes permissive backward-compatible defaults, but the current code does not silently default unsafe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `env_var_hardening`: pass for runtime safety. `DEEP_AGENT_ALLOW_CRITERIA_EXEC` is fail-closed in `score-model-variant.cjs` and shared by `bundle-gate.cjs`; raw grader cache output is redacted unless `DEEP_AGENT_GRADER_CACHE_RAW=1|true`. `lane_b_mechanics.md` line 69 still describes permissive backward-compatible defaults, but the current code does not silently default unsafe.

### `feature_catalog_code`: sampled. Deep-improvement feature catalog entries explicitly reference scripts/assets and contain caveats worth revisiting in the deep-improvement traceability pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: sampled. Deep-improvement feature catalog entries explicitly reference scripts/assets and contain caveats worth revisiting in the deep-improvement traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: sampled. Deep-improvement feature catalog entries explicitly reference scripts/assets and contain caveats worth revisiting in the deep-improvement traceability pass.

### `feature_catalog/` currency: PARTIAL. Lane C and Lane D sampled entries match current `loop-host.cjs`; the Lane B `mode-switch.md` entry has the P2 drift above. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `feature_catalog/` currency: PARTIAL. Lane C and Lane D sampled entries match current `loop-host.cjs`; the Lane B `mode-switch.md` entry has the P2 drift above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog/` currency: PARTIAL. Lane C and Lane D sampled entries match current `loop-host.cjs`; the Lane B `mode-switch.md` entry has the P2 drift above.

### `graph-metadata.json` accuracy: PASS for hub identity and one-graph invariant. It explicitly records `runtime/` as non-routable infrastructure. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `graph-metadata.json` accuracy: PASS for hub identity and one-graph invariant. It explicitly records `runtime/` as non-routable infrastructure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `graph-metadata.json` accuracy: PASS for hub identity and one-graph invariant. It explicitly records `runtime/` as non-routable infrastructure.

### `hub-router.json` internal consistency: PASS. `routerSignals` and `routerPolicy.tieBreak` cover all seven registry modes. Every referenced vocabulary class exists under `vocabularyClasses`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `hub-router.json` internal consistency: PASS. `routerSignals` and `routerPolicy.tieBreak` cover all seven registry modes. Every referenced vocabulary class exists under `vocabularyClasses`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `hub-router.json` internal consistency: PASS. `routerSignals` and `routerPolicy.tieBreak` cover all seven registry modes. Every referenced vocabulary class exists under `vocabularyClasses`.

### `manual_testing_playbook/` currency: PASS for sampled entries. `criteria-exec-gate.md` accurately reflects the current fail-closed env gate behavior from iteration 15, and `mode-wiring-routing.md` accurately describes the Lane C `loop-host` route and unknown-mode fallback. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `manual_testing_playbook/` currency: PASS for sampled entries. `criteria-exec-gate.md` accurately reflects the current fail-closed env gate behavior from iteration 15, and `mode-wiring-routing.md` accurately describes the Lane C `loop-host` route and unknown-mode fallback.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `manual_testing_playbook/` currency: PASS for sampled entries. `criteria-exec-gate.md` accurately reflects the current fail-closed env gate behavior from iteration 15, and `mode-wiring-routing.md` accurately describes the Lane C `loop-host` route and unknown-mode fallback.

### `package_skill.py --check` for `deep-ai-council`: PASS. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `package_skill.py --check` for `deep-ai-council`: PASS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `package_skill.py --check` for `deep-ai-council`: PASS.

### `package_skill.py --check` for `deep-improvement`: PASS with one accepted `.gitkeep` naming warning. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `package_skill.py --check` for `deep-improvement`: PASS with one accepted `.gitkeep` naming warning.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `package_skill.py --check` for `deep-improvement`: PASS with one accepted `.gitkeep` naming warning.

### `package_skill.py --check` for `deep-research`: PASS. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `package_skill.py --check` for `deep-research`: PASS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `package_skill.py --check` for `deep-research`: PASS.

### `package_skill.py --check` for `deep-review`: PASS. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `package_skill.py --check` for `deep-review`: PASS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `package_skill.py --check` for `deep-review`: PASS.

### `parent-skill-check.cjs` for hub: all hard invariants passed, 0 warnings. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `parent-skill-check.cjs` for hub: all hard invariants passed, 0 warnings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `parent-skill-check.cjs` for hub: all hard invariants passed, 0 warnings.

### `playbook_capability`: sampled. Inventory confirmed packet-local manual testing playbook trees exist; scenario-to-capability validation remains for later packet passes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: sampled. Inventory confirmed packet-local manual testing playbook trees exist; scenario-to-capability validation remains for later packet passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: sampled. Inventory confirmed packet-local manual testing playbook trees exist; scenario-to-capability validation remains for later packet passes.

### `prior_findings`: carried forward existing DR-014-P1-001 only as context; no re-count. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `prior_findings`: carried forward existing DR-014-P1-001 only as context; no re-count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `prior_findings`: carried forward existing DR-014-P1-001 only as context; no re-count.

### `promotion_guardrails`: partial. Real approval, score, benchmark, repeatability, rubric, mirror-sync, and hash gates exist, but write-boundary containment is not enforced at the final mutation point. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `promotion_guardrails`: partial. Real approval, score, benchmark, repeatability, rubric, mirror-sync, and hash gates exist, but write-boundary containment is not enforced at the final mutation point.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `promotion_guardrails`: partial. Real approval, score, benchmark, repeatability, rubric, mirror-sync, and hash gates exist, but write-boundary containment is not enforced at the final mutation point.

### `README.md` accuracy: PASS with advisory. Main routing architecture is current, but the `Related Skills` label is misleading for `runtime/`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `README.md` accuracy: PASS with advisory. Main routing architecture is current, but the `Related Skills` label is misleading for `runtime/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `README.md` accuracy: PASS with advisory. Main routing architecture is current, but the `Related Skills` label is misleading for `runtime/`.

### `review_core.md` severity doctrine loaded before final severity calls. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `review_core.md` severity doctrine loaded before final severity calls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `review_core.md` severity doctrine loaded before final severity calls.

### `rollback_helper`: pass with caveat. `moveRoundToFailed()` and `markSuperseded()` operate on normalized round ids and existing artifact paths; no new rollback logic bug was confirmed in this pass. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `rollback_helper`: pass with caveat. `moveRoundToFailed()` and `markSuperseded()` operate on normalized round ids and existing artifact paths; no new rollback logic bug was confirmed in this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rollback_helper`: pass with caveat. `moveRoundToFailed()` and `markSuperseded()` operate on normalized round ids and existing artifact paths; no new rollback logic bug was confirmed in this pass.

### `rollback_safety`: partial. The shared rollback helper verifies accepted-state hashes before copy, but both shared and legacy rollback helpers share the same caller-supplied manifest/config equality boundary and lack root containment. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `rollback_safety`: partial. The shared rollback helper verifies accepted-state hashes before copy, but both shared and legacy rollback helpers share the same caller-supplied manifest/config equality boundary and lack root containment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rollback_safety`: partial. The shared rollback helper verifies accepted-state hashes before copy, but both shared and legacy rollback helpers share the same caller-supplied manifest/config equality boundary and lack root containment.

### `script_injection_surface`: pass for sampled paths. Criterion commands are behind the fail-closed env gate; model dispatch uses `spawnSync` argv arrays, not shell string concatenation; materialized fixture ids are basename-restricted before writes. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `script_injection_surface`: pass for sampled paths. Criterion commands are behind the fail-closed env gate; model dispatch uses `spawnSync` argv arrays, not shell string concatenation; materialized fixture ids are basename-restricted before writes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `script_injection_surface`: pass for sampled paths. Criterion commands are behind the fail-closed env gate; model dispatch uses `spawnSync` argv arrays, not shell string concatenation; materialized fixture ids are basename-restricted before writes.

### `scripts_shell_external_input`: partial — `verify-yaml-script-paths.sh` uses fixed YAML paths and only checks checked-in script references; `reduce-state.cjs` writes through fixed artifact filenames but inherits uncontained `specFolder` resolution. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `scripts_shell_external_input`: partial — `verify-yaml-script-paths.sh` uses fixed YAML paths and only checks checked-in script references; `reduce-state.cjs` writes through fixed artifact filenames but inherits uncontained `specFolder` resolution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `scripts_shell_external_input`: partial — `verify-yaml-script-paths.sh` uses fixed YAML paths and only checks checked-in script references; `reduce-state.cjs` writes through fixed artifact filenames but inherits uncontained `specFolder` resolution.

### `seat_count_round_count`: pass. SKILL says 2-3 seats, seat diversity caps at 3, and config defaults `seats_per_round:3`, `max_rounds:3`. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `seat_count_round_count`: pass. SKILL says 2-3 seats, seat diversity caps at 3, and config defaults `seats_per_round:3`, `max_rounds:3`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `seat_count_round_count`: pass. SKILL says 2-3 seats, seat diversity caps at 3, and config defaults `seats_per_round:3`, `max_rounds:3`.

### `seat_influence_guardrails`: pass. Protocol separates independent proposals, cross-seat critique, convergence checks, failure handling, anti-pattern detection, and simulated-vantage labeling. No direct unsafe cross-seat context mutation was confirmed. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `seat_influence_guardrails`: pass. Protocol separates independent proposals, cross-seat critique, convergence checks, failure handling, anti-pattern detection, and simulated-vantage labeling. No direct unsafe cross-seat context mutation was confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `seat_influence_guardrails`: pass. Protocol separates independent proposals, cross-seat critique, convergence checks, failure handling, anti-pattern detection, and simulated-vantage labeling. No direct unsafe cross-seat context mutation was confirmed.

### `secrets_credentials`: pass — keyword scan across `deep-research` assets, references, scripts, docs, and benchmark artifacts found no committed API key/token/private-key pattern; matches were documentation words such as `token` or `sk-doc`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `secrets_credentials`: pass — keyword scan across `deep-research` assets, references, scripts, docs, and benchmark artifacts found no committed API key/token/private-key pattern; matches were documentation words such as `token` or `sk-doc`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `secrets_credentials`: pass — keyword scan across `deep-research` assets, references, scripts, docs, and benchmark artifacts found no committed API key/token/private-key pattern; matches were documentation words such as `token` or `sk-doc`.

### `skill_agent`: sampled. Deep-review quick reference defines the YAML workflow to LEAF review-agent architecture; this iteration did not dispatch sub-agents. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: sampled. Deep-review quick reference defines the YAML workflow to LEAF review-agent architecture; this iteration did not dispatch sub-agents.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: sampled. Deep-review quick reference defines the YAML workflow to LEAF review-agent architecture; this iteration did not dispatch sub-agents.

### `spec_code`: sampled. Config scope lists hub, four packets, `runtime/`, `shared/`, and exclusions; inventory confirms these areas exist. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: sampled. Config scope lists hub, four packets, `runtime/`, `shared/`, and exclusions; inventory confirms these areas exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: sampled. Config scope lists hub, four packets, `runtime/`, `shared/`, and exclusions; inventory confirms these areas exist.

### `state_protocol_vs_writer`: fail. The writer does not preserve non-converged completion semantics for failed/max-round cases. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `state_protocol_vs_writer`: fail. The writer does not preserve non-converged completion semantics for failed/max-round cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `state_protocol_vs_writer`: fail. The writer does not preserve non-converged completion semantics for failed/max-round cases.

### `webfetch_guardrails`: fail — factual citation and source-diversity guards exist, but fetched-content instruction isolation and URL/domain restrictions were not found. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `webfetch_guardrails`: fail — factual citation and source-diversity guards exist, but fetched-content instruction isolation and URL/domain restrictions were not found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `webfetch_guardrails`: fail — factual citation and source-diversity guards exist, but fetched-content instruction isolation and URL/domain restrictions were not found.

### Already-registered findings: The existing README/runtime label advisory from iteration 2 was not re-counted as new. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Already-registered findings: The existing README/runtime label advisory from iteration 2 was not re-counted as new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Already-registered findings: The existing README/runtime label advisory from iteration 2 was not re-counted as new.

### Asset rename completeness: PARTIAL PASS. Fresh `rg` for known previously hyphenated fixture stems found live hyphenated IDs in legacy model-benchmark fixture/cache/test data such as `hard-merge-intervals`, `fixture-baseline`, `fixture-improved`, and `fixture-edge`, but those are JSON fixture IDs or cache metadata rather than live references to renamed skill-benchmark fixture filename stems. No new live broken filename-stem reference was confirmed. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Asset rename completeness: PARTIAL PASS. Fresh `rg` for known previously hyphenated fixture stems found live hyphenated IDs in legacy model-benchmark fixture/cache/test data such as `hard-merge-intervals`, `fixture-baseline`, `fixture-improved`, and `fixture-edge`, but those are JSON fixture IDs or cache metadata rather than live references to renamed skill-benchmark fixture filename stems. No new live broken filename-stem reference was confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Asset rename completeness: PARTIAL PASS. Fresh `rg` for known previously hyphenated fixture stems found live hyphenated IDs in legacy model-benchmark fixture/cache/test data such as `hard-merge-intervals`, `fixture-baseline`, `fixture-improved`, and `fixture-edge`, but those are JSON fixture IDs or cache metadata rather than live references to renamed skill-benchmark fixture filename stems. No new live broken filename-stem reference was confirmed.

### Asset rename freshness: PASS for sampled public/private fixture pairs. Read four pairs across `deep-improvement`, `deep-loop-workflows`, `sk-design`, and `sk-design-dispatch`; each sampled `scenarioId` matched the filename stem, and a full read-only Node validation parsed all 98 JSON fixture files with zero `scenarioId` mismatches and zero incomplete public/private pairs. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Asset rename freshness: PASS for sampled public/private fixture pairs. Read four pairs across `deep-improvement`, `deep-loop-workflows`, `sk-design`, and `sk-design-dispatch`; each sampled `scenarioId` matched the filename stem, and a full read-only Node validation parsed all 98 JSON fixture files with zero `scenarioId` mismatches and zero incomplete public/private pairs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Asset rename freshness: PASS for sampled public/private fixture pairs. Read four pairs across `deep-improvement`, `deep-loop-workflows`, `sk-design`, and `sk-design-dispatch`; each sampled `scenarioId` matched the filename stem, and a full read-only Node validation parsed all 98 JSON fixture files with zero `scenarioId` mismatches and zero incomplete public/private pairs.

### Changelog currency: PASS. Latest `changelog/v1.14.0.0.md:1` and `:11` describe the grouped reference-library rename and inbound-link updates; the sampled current tree has grouped `references/guides`, `references/protocol`, `references/convergence`, and `references/state` paths. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Changelog currency: PASS. Latest `changelog/v1.14.0.0.md:1` and `:11` describe the grouped reference-library rename and inbound-link updates; the sampled current tree has grouped `references/guides`, `references/protocol`, `references/convergence`, and `references/state` paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changelog currency: PASS. Latest `changelog/v1.14.0.0.md:1` and `:11` describe the grouped reference-library rename and inbound-link updates; the sampled current tree has grouped `references/guides`, `references/protocol`, `references/convergence`, and `references/state` paths.

### Clarity for future maintainer: PASS. The README gives the best entry point, `SKILL.md` explains runtime routing, quick reference gives the compact operator path, and loop/state references provide deeper protocol detail. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Clarity for future maintainer: PASS. The README gives the best entry point, `SKILL.md` explains runtime routing, quick reference gives the compact operator path, and loop/state references provide deeper protocol detail.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Clarity for future maintainer: PASS. The README gives the best entry point, `SKILL.md` explains runtime routing, quick reference gives the compact operator path, and loop/state references provide deeper protocol detail.

### Command/agent cross-reference: FAIL with new P1. The command markdown renders the compiled contract at `.opencode/commands/deep/research.md:9`, and that generated contract has stale loop-ownership wording. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Command/agent cross-reference: FAIL with new P1. The command markdown renders the compiled contract at `.opencode/commands/deep/research.md:9`, and that generated contract has stale loop-ownership wording.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command/agent cross-reference: FAIL with new P1. The command markdown renders the compiled contract at `.opencode/commands/deep/research.md:9`, and that generated contract has stale loop-ownership wording.

### Command/agent cross-reference: PASS with carried-forward context. The four improvement-lane commands reference current deep-improvement layout and ownership surfaces: Lane A/B owned YAML assets in `agent-improvement.md` and `model-benchmark.md`, Lane C reads `deep-improvement/SKILL.md` plus `references/skill_benchmark/operator_guide.md`, and Lane D reads `deep-improvement/SKILL.md` plus `references/non_dev_ai_system/operator_guide.md`. DR-014-P1-001 remains a runtime wiring bug for shipped sweep profiles, but this traceability pass did not find a new command-file layout reference issue. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Command/agent cross-reference: PASS with carried-forward context. The four improvement-lane commands reference current deep-improvement layout and ownership surfaces: Lane A/B owned YAML assets in `agent-improvement.md` and `model-benchmark.md`, Lane C reads `deep-improvement/SKILL.md` plus `references/skill_benchmark/operator_guide.md`, and Lane D reads `deep-improvement/SKILL.md` plus `references/non_dev_ai_system/operator_guide.md`. DR-014-P1-001 remains a runtime wiring bug for shipped sweep profiles, but this traceability pass did not find a new command-file layout reference issue.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command/agent cross-reference: PASS with carried-forward context. The four improvement-lane commands reference current deep-improvement layout and ownership surfaces: Lane A/B owned YAML assets in `agent-improvement.md` and `model-benchmark.md`, Lane C reads `deep-improvement/SKILL.md` plus `references/skill_benchmark/operator_guide.md`, and Lane D reads `deep-improvement/SKILL.md` plus `references/non_dev_ai_system/operator_guide.md`. DR-014-P1-001 remains a runtime wiring bug for shipped sweep profiles, but this traceability pass did not find a new command-file layout reference issue.

### Cross-file count consistency: PASS. Counted seven `workflowMode` entries, seven `routerSignals`, seven `tieBreak` entries, and one `graph-metadata.json` under `.opencode/skills/system-deep-loop/`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Cross-file count consistency: PASS. Counted seven `workflowMode` entries, seven `routerSignals`, seven `tieBreak` entries, and one `graph-metadata.json` under `.opencode/skills/system-deep-loop/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-file count consistency: PASS. Counted seven `workflowMode` entries, seven `routerSignals`, seven `tieBreak` entries, and one `graph-metadata.json` under `.opencode/skills/system-deep-loop/`.

### Cross-file script references: PARTIAL. Sampled SKILL references to the core scripts above resolve. The `SKILL.md` script inventory line is very long and was not exhaustively parsed for every script path. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Cross-file script references: PARTIAL. Sampled SKILL references to the core scripts above resolve. The `SKILL.md` script inventory line is very long and was not exhaustively parsed for every script path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-file script references: PARTIAL. Sampled SKILL references to the core scripts above resolve. The `SKILL.md` script inventory line is very long and was not exhaustively parsed for every script path.

### Cross-reference correctness: Sampled links to `references/protocol/context_snapshot.md`, `feature_catalog/01--loop-lifecycle/run-now-control.md`, `manual_testing_playbook/01--entry-points-and-modes/confirm-mode-checkpointed-execution.md`, and `behavior_benchmark/baselines/claude-baseline.md`; all resolved by direct read. Full link corpus not exhausted. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Cross-reference correctness: Sampled links to `references/protocol/context_snapshot.md`, `feature_catalog/01--loop-lifecycle/run-now-control.md`, `manual_testing_playbook/01--entry-points-and-modes/confirm-mode-checkpointed-execution.md`, and `behavior_benchmark/baselines/claude-baseline.md`; all resolved by direct read. Full link corpus not exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-reference correctness: Sampled links to `references/protocol/context_snapshot.md`, `feature_catalog/01--loop-lifecycle/run-now-control.md`, `manual_testing_playbook/01--entry-points-and-modes/confirm-mode-checkpointed-execution.md`, and `behavior_benchmark/baselines/claude-baseline.md`; all resolved by direct read. Full link corpus not exhausted.

### Duplication: PASS with prior advisory carried forward. Some command/state summaries intentionally repeat between `SKILL.md`, README, and quick reference; the only materially confusing duplication found in this area is the already-registered registry-name transition advisory from iteration 6. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Duplication: PASS with prior advisory carried forward. Some command/state summaries intentionally repeat between `SKILL.md`, README, and quick reference; the only materially confusing duplication found in this area is the already-registered registry-name transition advisory from iteration 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplication: PASS with prior advisory carried forward. Some command/state summaries intentionally repeat between `SKILL.md`, README, and quick reference; the only materially confusing duplication found in this area is the already-registered registry-name transition advisory from iteration 6.

### Executor dispatch safety: Fail for documentation/security contract alignment. The wrapper has env allowlisting and recursion guards, but live `cli-opencode` uses `--dangerously-skip-permissions` while the packet references advertise workspace-write sandboxing. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Executor dispatch safety: Fail for documentation/security contract alignment. The wrapper has env allowlisting and recursion guards, but live `cli-opencode` uses `--dangerously-skip-permissions` while the packet references advertise workspace-write sandboxing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Executor dispatch safety: Fail for documentation/security contract alignment. The wrapper has env allowlisting and recursion guards, but live `cli-opencode` uses `--dangerously-skip-permissions` while the packet references advertise workspace-write sandboxing.

### Four-lane design: PASS. SKILL.md, README, feature catalog, and manual playbook all explain why Lane A/B/C/D share one packet: common candidate, dispatcher, scorer, loop-host, and guard seams, with Lane D explicitly adapted rather than owned by this packet's loop. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Four-lane design: PASS. SKILL.md, README, feature catalog, and manual playbook all explain why Lane A/B/C/D share one packet: common candidate, dispatcher, scorer, loop-host, and guard seams, with Lane D explicitly adapted rather than owned by this packet's loop.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Four-lane design: PASS. SKILL.md, README, feature catalog, and manual playbook all explain why Lane A/B/C/D share one packet: common candidate, dispatcher, scorer, loop-host, and guard seams, with Lane D explicitly adapted rather than owned by this packet's loop.

### Hub `allowed-tools`: P2 advisory. The hub grants broad tools not needed by the described routing-only layer (`.opencode/skills/system-deep-loop/SKILL.md:5`, `.opencode/skills/system-deep-loop/SKILL.md:37`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Hub `allowed-tools`: P2 advisory. The hub grants broad tools not needed by the described routing-only layer (`.opencode/skills/system-deep-loop/SKILL.md:5`, `.opencode/skills/system-deep-loop/SKILL.md:37`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hub `allowed-tools`: P2 advisory. The hub grants broad tools not needed by the described routing-only layer (`.opencode/skills/system-deep-loop/SKILL.md:5`, `.opencode/skills/system-deep-loop/SKILL.md:37`).

### Injection via review target content: Gap. The target is read-only in the prompt contract, but I found no explicit instruction that reviewed file contents are untrusted data and must not override system/developer/allowed-write instructions. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Injection via review target content: Gap. The target is read-only in the prompt contract, but I found no explicit instruction that reviewed file contents are untrusted data and must not override system/developer/allowed-write instructions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Injection via review target content: Gap. The target is read-only in the prompt contract, but I found no explicit instruction that reviewed file contents are untrusted data and must not override system/developer/allowed-write instructions.

### Internal cross-reference integrity: PASS for this sample. `README.md` links to `feature_catalog/01--loop-lifecycle/run-now-control.md`, `feature_catalog/01--loop-lifecycle/per-iteration-memory-upsert.md`, `references/guides/quick_reference.md`, `references/protocol/loop_protocol.md`, `references/convergence/convergence.md`, `references/state/state_format.md`, `assets/deep_research_config.json`, `assets/deep_research_strategy.md`, `assets/deep_research_dashboard.md`, `assets/prompt_pack_iteration.md.tmpl`, and `assets/runtime_capabilities.json`; scoped `Glob` checks confirmed those targets exist. No `[text](./path)` links were found inside `references/` or markdown assets themselves in the sampled grep. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Internal cross-reference integrity: PASS for this sample. `README.md` links to `feature_catalog/01--loop-lifecycle/run-now-control.md`, `feature_catalog/01--loop-lifecycle/per-iteration-memory-upsert.md`, `references/guides/quick_reference.md`, `references/protocol/loop_protocol.md`, `references/convergence/convergence.md`, `references/state/state_format.md`, `assets/deep_research_config.json`, `assets/deep_research_strategy.md`, `assets/deep_research_dashboard.md`, `assets/prompt_pack_iteration.md.tmpl`, and `assets/runtime_capabilities.json`; scoped `Glob` checks confirmed those targets exist. No `[text](./path)` links were found inside `references/` or markdown assets themselves in the sampled grep.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Internal cross-reference integrity: PASS for this sample. `README.md` links to `feature_catalog/01--loop-lifecycle/run-now-control.md`, `feature_catalog/01--loop-lifecycle/per-iteration-memory-upsert.md`, `references/guides/quick_reference.md`, `references/protocol/loop_protocol.md`, `references/convergence/convergence.md`, `references/state/state_format.md`, `assets/deep_research_config.json`, `assets/deep_research_strategy.md`, `assets/deep_research_dashboard.md`, `assets/prompt_pack_iteration.md.tmpl`, and `assets/runtime_capabilities.json`; scoped `Glob` checks confirmed those targets exist. No `[text](./path)` links were found inside `references/` or markdown assets themselves in the sampled grep.

### Loop-protocol correctness: Sampled init and loop steps; found the Step 7a charter-validation canonical reference and the stale Step 5a manual-testing references above. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Loop-protocol correctness: Sampled init and loop steps; found the Step 7a charter-validation canonical reference and the stale Step 5a manual-testing references above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Loop-protocol correctness: Sampled init and loop steps; found the Step 7a charter-validation canonical reference and the stale Step 5a manual-testing references above.

### Model profile fixture references: PARTIAL. `default.json` literal refs resolve on the `run-benchmark.cjs` path. Shipped sweep profiles resolve by parsed fixture id under `sweep-benchmark.cjs`, but not by literal filename under `materialize-benchmark-fixtures.cjs`; recorded as DR-014-P1-001. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Model profile fixture references: PARTIAL. `default.json` literal refs resolve on the `run-benchmark.cjs` path. Shipped sweep profiles resolve by parsed fixture id under `sweep-benchmark.cjs`, but not by literal filename under `materialize-benchmark-fixtures.cjs`; recorded as DR-014-P1-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Model profile fixture references: PARTIAL. `default.json` literal refs resolve on the `run-benchmark.cjs` path. Shipped sweep profiles resolve by parsed fixture id under `sweep-benchmark.cjs`, but not by literal filename under `materialize-benchmark-fixtures.cjs`; recorded as DR-014-P1-001.

### Pareto / trade-off path: PASS for active workflow wiring. The auto/confirm workflows call `detectTradeOffs(getTrajectory(...))`; the unused `checkParetoDominance` helper has narrower semantics, but no active command consumer was found in this pass. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Pareto / trade-off path: PASS for active workflow wiring. The auto/confirm workflows call `detectTradeOffs(getTrajectory(...))`; the unused `checkParetoDominance` helper has narrower semantics, but no active command consumer was found in this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pareto / trade-off path: PASS for active workflow wiring. The auto/confirm workflows call `detectTradeOffs(getTrajectory(...))`; the unused `checkParetoDominance` helper has narrower semantics, but no active command consumer was found in this pass.

### Path containment: PASS. The routing prose requires guarding `mode-registry.json` inside `SKILL_ROOT`, returning fallback for missing modes, and guarding `registry[mode].packet/SKILL.md` inside `SKILL_ROOT` before load (`.opencode/skills/system-deep-loop/SKILL.md:49`, `.opencode/skills/system-deep-loop/SKILL.md:54`, `.opencode/skills/system-deep-loop/SKILL.md:55`, `.opencode/skills/system-deep-loop/SKILL.md:62`). No path-escape route was confirmed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Path containment: PASS. The routing prose requires guarding `mode-registry.json` inside `SKILL_ROOT`, returning fallback for missing modes, and guarding `registry[mode].packet/SKILL.md` inside `SKILL_ROOT` before load (`.opencode/skills/system-deep-loop/SKILL.md:49`, `.opencode/skills/system-deep-loop/SKILL.md:54`, `.opencode/skills/system-deep-loop/SKILL.md:55`, `.opencode/skills/system-deep-loop/SKILL.md:62`). No path-escape route was confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path containment: PASS. The routing prose requires guarding `mode-registry.json` inside `SKILL_ROOT`, returning fallback for missing modes, and guarding `registry[mode].packet/SKILL.md` inside `SKILL_ROOT` before load (`.opencode/skills/system-deep-loop/SKILL.md:49`, `.opencode/skills/system-deep-loop/SKILL.md:54`, `.opencode/skills/system-deep-loop/SKILL.md:55`, `.opencode/skills/system-deep-loop/SKILL.md:62`). No path-escape route was confirmed.

### Post-trim organization: PARTIAL. `references/` is lane-organized (`agent_improvement/`, `model_benchmark/`, `skill_benchmark/`, `non_dev_ai_system/`, `shared/`) and the three new files avoid bulky SKILL.md duplication by holding full runtime, Lane A stress-test, and Lane B mechanics detail. The routing map gap above weakens machine discoverability. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Post-trim organization: PARTIAL. `references/` is lane-organized (`agent_improvement/`, `model_benchmark/`, `skill_benchmark/`, `non_dev_ai_system/`, `shared/`) and the three new files avoid bulky SKILL.md duplication by holding full runtime, Lane A stress-test, and Lane B mechanics detail. The routing map gap above weakens machine discoverability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Post-trim organization: PARTIAL. `references/` is lane-organized (`agent_improvement/`, `model_benchmark/`, `skill_benchmark/`, `non_dev_ai_system/`, `shared/`) and the three new files avoid bulky SKILL.md duplication by holding full runtime, Lane A stress-test, and Lane B mechanics detail. The routing map gap above weakens machine discoverability.

### Prior findings: Existing DR-014-P1-001, DR-015-P1-001, and DR-016-P2-001 remain active for the deep-improvement packet but were not re-counted as new. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Prior findings: Existing DR-014-P1-001, DR-015-P1-001, and DR-016-P2-001 remain active for the deep-improvement packet but were not re-counted as new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prior findings: Existing DR-014-P1-001, DR-015-P1-001, and DR-016-P2-001 remain active for the deep-improvement packet but were not re-counted as new.

### README accuracy: PASS with carry-forward advisory. `README.md` matches the current packet shape and link layout for `SKILL.md`, grouped `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, and `behavior_benchmark/`; `README.md:82` still participates in the already-registered registry-name drift and was not counted as new. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: README accuracy: PASS with carry-forward advisory. `README.md` matches the current packet shape and link layout for `SKILL.md`, grouped `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, and `behavior_benchmark/`; `README.md:82` still participates in the already-registered registry-name drift and was not counted as new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: README accuracy: PASS with carry-forward advisory. `README.md` matches the current packet shape and link layout for `SKILL.md`, grouped `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, and `behavior_benchmark/`; `README.md:82` still participates in the already-registered registry-name drift and was not counted as new.

### Reference organization: PASS. The 146-file packet uses a sensible domain-subfoldered `references/` tree (`guides`, `protocol`, `convergence`, `state`) rather than an unstructured flat library. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Reference organization: PASS. The 146-file packet uses a sensible domain-subfoldered `references/` tree (`guides`, `protocol`, `convergence`, `state`) rather than an unstructured flat library.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reference organization: PASS. The 146-file packet uses a sensible domain-subfoldered `references/` tree (`guides`, `protocol`, `convergence`, `state`) rather than an unstructured flat library.

### Registry `toolSurface`: PASS. The mutating tool declarations are not new security findings because the registry modes describe artifact-producing workflows or improvement hosts, and the hub explicitly delegates per-mode behavior and guards to the packets (`.opencode/skills/system-deep-loop/SKILL.md:66`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Registry `toolSurface`: PASS. The mutating tool declarations are not new security findings because the registry modes describe artifact-producing workflows or improvement hosts, and the hub explicitly delegates per-mode behavior and guards to the packets (`.opencode/skills/system-deep-loop/SKILL.md:66`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Registry `toolSurface`: PASS. The mutating tool declarations are not new security findings because the registry modes describe artifact-producing workflows or improvement hosts, and the hub explicitly delegates per-mode behavior and guards to the packets (`.opencode/skills/system-deep-loop/SKILL.md:66`).

### Routing logic correctness: PASS. `SKILL.md` names seven public workflow modes across four families, and `mode-registry.json` contains the same seven `workflowMode` entries. Research, review, and ai-council have `backendKind: runtime-loop-type`; all four improvement lanes have `runtimeLoopType: null`; Lane D uses public `workflowMode: ai-system-improvement` with loop-host mode `non-dev-ai-system-refine`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Routing logic correctness: PASS. `SKILL.md` names seven public workflow modes across four families, and `mode-registry.json` contains the same seven `workflowMode` entries. Research, review, and ai-council have `backendKind: runtime-loop-type`; all four improvement lanes have `runtimeLoopType: null`; Lane D uses public `workflowMode: ai-system-improvement` with loop-host mode `non-dev-ai-system-refine`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Routing logic correctness: PASS. `SKILL.md` names seven public workflow modes across four families, and `mode-registry.json` contains the same seven `workflowMode` entries. Research, review, and ai-council have `backendKind: runtime-loop-type`; all four improvement lanes have `runtimeLoopType: null`; Lane D uses public `workflowMode: ai-system-improvement` with loop-host mode `non-dev-ai-system-refine`.

### Runtime truth contracts: PASS for sampled enum docs. `SKILL.md` stop reasons/session outcomes match `runtime_truth_contracts.md`, and `improvement-journal.cjs` imports the central lifecycle taxonomy rather than duplicating accepted values. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Runtime truth contracts: PASS for sampled enum docs. `SKILL.md` stop reasons/session outcomes match `runtime_truth_contracts.md`, and `improvement-journal.cjs` imports the central lifecycle taxonomy rather than duplicating accepted values.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Runtime truth contracts: PASS for sampled enum docs. `SKILL.md` stop reasons/session outcomes match `runtime_truth_contracts.md`, and `improvement-journal.cjs` imports the central lifecycle taxonomy rather than duplicating accepted values.

### Safe follow-on change cost: P2 gap. Existing feature and playbook docs are strong as inventories and validation anchors, but they do not provide one explicit maintainer checklist for feature additions or feature changes. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Safe follow-on change cost: P2 gap. Existing feature and playbook docs are strong as inventories and validation anchors, but they do not provide one explicit maintainer checklist for feature additions or feature changes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Safe follow-on change cost: P2 gap. Existing feature and playbook docs are strong as inventories and validation anchors, but they do not provide one explicit maintainer checklist for feature additions or feature changes.

### Scale/navigation: PASS with advisory. The 458-file packet has a usable top-level path through README, SKILL.md, feature catalog, manual testing playbook, and lane-organized references/assets. Future maintainers are more likely to get lost in router/resource-map drift than in the directory layout itself. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Scale/navigation: PASS with advisory. The 458-file packet has a usable top-level path through README, SKILL.md, feature catalog, manual testing playbook, and lane-organized references/assets. Future maintainers are more likely to get lost in router/resource-map drift than in the directory layout itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Scale/navigation: PASS with advisory. The 458-file packet has a usable top-level path through README, SKILL.md, feature catalog, manual testing playbook, and lane-organized references/assets. Future maintainers are more likely to get lost in router/resource-map drift than in the directory layout itself.

### Script logic: Sampled reducer path resolution, prior-registry fallback, numeric iteration-file sorting, registry/dashboard/strategy writes, and runtime capability shim. No P0/P1 logic bug found in sampled code. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Script logic: Sampled reducer path resolution, prior-registry fallback, numeric iteration-file sorting, registry/dashboard/strategy writes, and runtime capability shim. No P0/P1 logic bug found in sampled code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Script logic: Sampled reducer path resolution, prior-registry fallback, numeric iteration-file sorting, registry/dashboard/strategy writes, and runtime capability shim. No P0/P1 logic bug found in sampled code.

### Secrets exposure: PASS. The hub tier files read in this iteration contain routing metadata and descriptions only; a hub-only credential scan over `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` returned no matches for credential/token/password/private-key/internal-URL patterns. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Secrets exposure: PASS. The hub tier files read in this iteration contain routing metadata and descriptions only; a hub-only credential scan over `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` returned no matches for credential/token/password/private-key/internal-URL patterns.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secrets exposure: PASS. The hub tier files read in this iteration contain routing metadata and descriptions only; a hub-only credential scan over `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` returned no matches for credential/token/password/private-key/internal-URL patterns.

### Secrets scan: Pass. Credential-shaped grep hits in `assets/`, `references/`, and `scripts/` were generic docs/examples or benchmark text, not committed real secrets. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Secrets scan: Pass. Credential-shaped grep hits in `assets/`, `references/`, and `scripts/` were generic docs/examples or benchmark text, not committed real secrets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secrets scan: Pass. Credential-shaped grep hits in `assets/`, `references/`, and `scripts/` were generic docs/examples or benchmark text, not committed real secrets.

### sk-doc template alignment: PASS. Exact fresh output: -- BLOCKED (iteration 16, 1 attempts)
- What was tried: sk-doc template alignment: PASS. Exact fresh output:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sk-doc template alignment: PASS. Exact fresh output:

### sk-doc template alignment: PASS. Fresh command output: -- BLOCKED (iteration 8, 1 attempts)
- What was tried: sk-doc template alignment: PASS. Fresh command output:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sk-doc template alignment: PASS. Fresh command output:

### State-format correctness: Compared `state_format.md`/`state_jsonl.md` with `assets/deep_research_config.json`; the main packet files and config defaults align for config/state/strategy/dashboard/deltas, with the registry-name conflict recorded as DR-006-P2-002. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: State-format correctness: Compared `state_format.md`/`state_jsonl.md` with `assets/deep_research_config.json`; the main packet files and config defaults align for config/state/strategy/dashboard/deltas, with the registry-name conflict recorded as DR-006-P2-002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: State-format correctness: Compared `state_format.md`/`state_jsonl.md` with `assets/deep_research_config.json`; the main packet files and config defaults align for config/state/strategy/dashboard/deltas, with the registry-name conflict recorded as DR-006-P2-002.

### Weight optimizer: PASS for correctness scope sampled. `benchmark-stability.cjs` keeps recommendations advisory, enforces a minimum session threshold, and does not auto-apply weights. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Weight optimizer: PASS for correctness scope sampled. `benchmark-stability.cjs` keeps recommendations advisory, enforces a minimum session threshold, and does not auto-apply weights.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Weight optimizer: PASS for correctness scope sampled. `benchmark-stability.cjs` keeps recommendations advisory, enforces a minimum session threshold, and does not auto-apply weights.

### Write-boundary enforcement: Partial. The prompt pack constrains writes to packet artifacts and bans deletes/renames/truncating out-of-scope files, but this is a model-level contract rather than a runtime permission boundary for `cli-opencode`. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Write-boundary enforcement: Partial. The prompt pack constrains writes to packet artifacts and bans deletes/renames/truncating out-of-scope files, but this is a model-level contract rather than a runtime permission boundary for `cli-opencode`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Write-boundary enforcement: Partial. The prompt pack constrains writes to packet artifacts and bans deletes/renames/truncating out-of-scope files, but this is a model-level contract rather than a runtime permission boundary for `cli-opencode`.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->

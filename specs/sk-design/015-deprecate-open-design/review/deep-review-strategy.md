# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Tracks the 10-iteration deep review of the mcp-open-design deprecation scope: which dimensions remain, findings (P0/P1/P2), what worked/failed, and next focus. Orchestrator = this pi session (loop owner); iterations = LEAF `deep-review` agent dispatches via native pi subagents (model `openai-codex/gpt-5.6-luna`, thinking max, service tier fast); reducer = `reduce-state.cjs`.

### Usage
- **Init:** Populated by orchestrator (this file).
- **Per iteration:** LEAF agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, sets new Next Focus.
- **Mutability:** Mutable; updated by both orchestrator and LEAF agents.
- **Ownership:** Machine-owned blocks marked; operator notes live outside them.

---

## 2. TOPIC
Deprecate `sk-design-mcp-open-design` completely: confirm the FULL live reference surface (so zero references survive) and review the removal plan in `specs/sk-design/015-deprecate-open-design` (REQ-001..009, ADR-001..003) before implementation. Review target type: files. The review is observation-only; no edits to the review target.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- NOT reviewing the Open Design desktop app itself or its external files.
- NOT editing any file under review (observation-only).
- NOT rewriting historical records (specs/, changelog history, dated benchmark corpora, sqlite DBs).
- NOT assessing the md-generator skill's standalone merit beyond its transport references.
- NOT modifying `.worktrees/` checkouts.

---

## 5. STOP CONDITIONS
- 10 iterations dispatched (forced depth; `stopPolicy: max-iterations` — convergence cannot end the run early).
- 3 consecutive iteration failures (infrastructure) → halt and report.
- State file corruption → halt for repair.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 001 | Routing surfaces agree on the current transport, but the residue regex misses camelCase/uppercase identifiers and the inventory omits live mcp-tooling discovery fixtures. |
| Security | CONDITIONAL | 002 | No literal retired credential or P0 behavior was found, but NFR-S01 lacks an explicit env/path/token residue assertion; the two prior P1 gaps remain active. |
| Traceability | CONDITIONAL | 003 | REQ-001..009 have named criteria and all eight agent/runtime paths are inventoried, but checklist evidence is not pinned for claimed CHK-001..003; three prior P1 gaps remain active. |
| Maintainability | CONDITIONAL | 004 | T032 lacks an executable complete derived-artifact runbook, the promised append-only deprecation changelog entry is not task-mapped, and the live-surface exclusion allowlist is prose-only/non-reproducible; three new P1 gaps, with md-generator pairing coverage confirmed. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 19 active scoped findings (`P1-001..P1-019`); reducer summary-only entries remain historical registry state until refresh
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +4 P1, +0 P2 (`P1-016..P1-019` new; `P1-001`, `P1-010`, and `P1-015` reverified; other P1s carried)
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Read the required state/config/registry/strategy before review actions and loaded the shared severity doctrine.
- Directly cross-checked hub-router, mode-registry, design agent, interface command, and UTCP registration; their current transport dispatch claims agree.
- Variant search found a concrete camelCase/uppercase residue-gate blind spot and a separate live fixture inventory gap.
- Security sweep separated unrelated provider placeholders from retired-transport data and found no P0 secret disclosure, while exposing the missing NFR-S01 env/path/token assertion.
- Traceability sweep confirmed all REQ-001..009 have concrete acceptance criteria and all four runtime representations are named for both agent families.
- Checklist review found a concrete evidence gap: CHK-001..003 are checked without command/result or artifact evidence, while later evidence-bearing rows remain unchecked.
- Maintainability review found all five md-generator transport-reference files are covered by the broad T024/T023 scope, but found no executable T032 regeneration runbook for the stale leaf/mode/router/command artifacts.
- Direct changelog and task comparison confirmed historical entries are preserved, yet no append-only deprecation-entry task/file is named; the allowlist remains prose-only despite T010/T041 requiring reuse.
- Sibling-surface sweep classified every named file: live hits in mcp-code-mode, mcp-figma, CLI runtime SKILLs, sk-code, and sk-prompt are covered by T028; the CLI audit-trail playbook is clean and the Figma tool-surface phrase is generic.
- The dedicated sk-prompt `design-generation-patterns.md` is entirely transport-specific, but the plan says only to strip references; this produced new P1-009 requiring explicit deletion or generic rewrite scope.
- Advisor `skill_advisor.py` retains six transport-specific intent boosters while `skill-graph.json` has no child entry; T029 needs exact scorer cleanup, conditional graph regeneration, and a probe (P1-010).
- Sk-doc's frozen durable-directory and README-verdict fixtures are loaded by live tests and enumerate the deleted tree; T028 must prescribe regeneration and passing test evidence (P1-011).
- Sk-doc's validator warning allowlist, agent template, and parent-skill matrix retain the packet; the validator/reference paths are not explicit in T028 (P1-012).
- System-spec-kit `agent-io-contract.md` and the markdown-link guard retain live transport claims outside or beyond the named action contract (P1-013).
- System-spec-kit ground-truth source and tracked dist copies are active eval inputs; T028 lacks a paired update/build/parity assertion (P1-014).
- Iteration 008 loaded 43 central `sk_design_*` Lane-C fixture rows with zero load errors; 42 private-gold rows retain retired transport labels, establishing `P1-015` and a required post-removal fixture regeneration/rerun.
- Iteration 009 corrected the `OD_` boundary after ruling out substring false positives, then found four new live surfaces: `.claude/.utcp_config.json`, Cursor/Devin runtime agents/commands, advisor manual-testing playbooks, and `CLAUDE.md`.
- Iteration 009 directly reread P1-001, P1-010, and P1-015 evidence; all three remain P1 with no downgrade. Requested hooks/plugins/deep-command/config/test surfaces were clean under the corrected sweep.
- Iteration 008 adjudicated reports as historical outputs, goal archives as history-only, graph JSON as `graph-metadata.json`-derived (not `description.json`-derived), and all SQLite files as `REGENERATE-AFTER` runtime indexes with named recovery commands.

---

## 9. WHAT FAILED
- The acceptance regex in `spec.md`/`plan.md` does not cover `openDesign` or `OPEN_DESIGN`, despite live shared routing/proof identifiers and the strategy's camel-variant search axis.
- The affected-surface table names `mcp-tooling/mcp-figma` but not the tracked `mcp-aside-devtools`, `mcp-refero`, or `mcp-mobbin` discovery fixtures containing `open_design.*`; their historical status is not documented.
- NFR-S01 is stated but not executable: the generic residue regex and JSON parse do not independently assert removal of `OD_DATA_DIR`, `OD_SIDECAR_IPC_PATH`, `ELECTRON_RUN_AS_NODE`, `OD_TOOL_TOKEN`, or retired app/socket paths.
- REQ-007 requires evidence for every completed P0/P1 checklist item, but the checklist has no evidence column and CHK-001..003 provide no pinned command/result or artifact references.
- T032 says only “Regenerate derived manifests/descriptions,” omitting a command, full artifact classification, expected zero-reference assertions, and parity proof for mode-registry, hub-router, command-metadata, and leaf-manifest.
- The residue gate’s `git ls-files` minus prose exclusions is not a durable named allowlist; future operators can drift inventory and final-gate scope, independently of the already-known camel/uppercase regex gap.
- T028 is directory-level and does not define whether the transport-dedicated `sk-prompt` reference is deleted or rewritten; a literal reference-strip operation cannot leave a coherent document.
- The advisor, sk-doc, and system-spec focus sweep showed broad directory labels are insufficient for generated fixtures, executable policy tables, workflow contracts, and source/dist pairs; each requires a named action and post-change proof.
- Compiled-route runtime loading of the canary was ruled out, but the 006-sk-design harness consumes the replay fixture, so T031 must update/remove the stale transport case rather than leave it unchanged.
- The plan's four-runtime matrix and root-doc list are incomplete: Cursor/Devin agents and commands plus `CLAUDE.md` are active, and the `.claude` MCP config duplicates the retired registration outside T021.
- T029 names only advisor scorer/graph files; three live advisor manual-testing playbooks also retain transport paths and need explicit delete/classify/regenerate actions.

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach is exhausted]

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Current dispatch contradiction between hub-router, mode-registry, design agent, interface command, and `.utcp_config.json`: ruled out for current (pre-removal) behavior.
- P0-level destructive/security impact: not established in this correctness iteration; security dimension remains unreviewed.
- Transport tree write authority in the design agent: ruled out; registry and agent both constrain transport mode to Read/Bash.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: correctness
- Focus area: final iteration-010 replay of newly uncovered live surfaces and implementation-ready inventory closure
- Files: `.claude/.utcp_config.json`, `.cursor/**`, `.devin/**`, advisor manual-testing-playbook paths, `CLAUDE.md`, and the final residue/strict-validation commands
- Why: iteration 009's bounded whole-workspace sweep found four active plan gaps while confirming P1-001, P1-010, and P1-015; all dimensions remain conditional
- Carry-forward: preserve P1-001..P1-019; do not retry bounded-OD false positives or ruled-out archive/report directions
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** `.opencode/skills/sk-design/sk-design-mcp-open-design/` (45 files); `.utcp_config.json` (`open_design` entry); sk-design hub docs/JSONs; agents (design, deep-alignment × 4 runtimes); commands (interface/design*, doctor/mcp*, install-guides); deep-alignment adapters; sibling skills (mcp-code-mode, mcp-figma, cli-external-orchestration, sk-code, sk-prompt, sk-doc, system-spec-kit, system-skill-advisor); root docs (README, AGENTS, BARTER); compiled-routing canary fixture.
- **Behavior claims to verify:** REQ-001..009 acceptance criteria; zero-residue gate scope; historical-exclusion list correctness; ADR-002 native-dispatch adaptation.
- **Reuse/conventions:** deep-review state machine (config/JSONL/registry/strategy/deltas/iterations/dashboard/report); LEAF iteration contract (iteration-NNN.md + delta + single JSONL append + strategy edit); final-line verdict contract.
- **Review risks/gaps:** inventory derived from grep sweeps (variants: hyphen/underscore/spaced/camel); `.pi-subagents/` artifacts and sqlite DBs contain historical matches (excluded); benchmark corpora classification needs adjudication; memory graph unavailable (stale caveat).

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 7 | REQ-001..009 criteria are concrete, but T028/T029 omit exact advisor, sk-doc validator/fixture, system-spec workflow, and lib/dist parity actions; P1-001..P1-014 remain open |
| `checklist_evidence` | core | partial | 3 | CHK-001..003 are claimed complete without pinned evidence; CHK-010..013 remain unchecked |
| `skill_agent` | overlay | partial | 7 | Existing agent parity remains covered, but the advisor scorer and sk-doc agent/template surfaces retain transport-specific routing claims; P1-010 and P1-012 |
| `agent_cross_runtime` | overlay | pass | 3 | All four `.opencode/.claude/.codex/.pi` representations of design and deep-alignment are named and contain the same transport claims |
| `feature_catalog_code` | overlay | partial | 5 | Catalogs describe the live-render transport boundary with inconsistent abbreviated token `design-mcp-open-design`; executable adapter requires `sk-design-mcp-open-design` (P1-008). |
| `playbook_capability` | overlay | partial | 7 | P1-008 remains active; system-spec agent I/O and markdown-link playbook evidence also retain transport claims and require T028 path/action closure (P1-013) |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Per-file table populated during initialization (grouped; full allowlist in scratch/inventory-live.txt):

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/sk-design/sk-design-mcp-open-design/**` (45 files) | - | - | - | pending |
| `.utcp_config.json` | - | - | - | pending |
| `.opencode/skills/sk-design/{SKILL,README}.md` | - | - | - | pending |
| `.opencode/skills/sk-design/{mode-registry,leaf-manifest,hub-router,command-metadata,description,graph-metadata}.json` | - | - | - | pending |
| `.opencode/skills/sk-design/feature-catalog/**` | - | - | - | pending |
| `.opencode/skills/sk-design/manual-testing-playbook/**` | - | - | - | pending |
| `.opencode/skills/sk-design/shared/**` | - | - | - | pending |
| `.opencode/skills/sk-design/sk-design-md-generator/**` | - | - | - | pending |
| `.opencode/skills/sk-design/changelog/**` (deprecation entry only) | - | - | - | pending |
| Agents: `.opencode/agents/{design,deep-alignment}.md`, `.claude/agents/*`, `.codex/agents/*.toml`, `.pi/agents/*.md` | - | - | - | pending |
| Commands: `.opencode/commands/interface/{design,design-reference}.md`, `.opencode/commands/doctor/{mcp.md,assets/doctor-mcp-install.yaml}`, `.opencode/install-guides/README.md` | - | - | - | pending |
| `.opencode/skills/system-deep-loop/deep-alignment/**` (adapters, catalog, playbook, scripts, tests) | - | - | - | pending |
| `.opencode/skills/mcp-code-mode/**` | - | - | - | pending |
| `.opencode/skills/mcp-tooling/mcp-figma/**` | - | - | - | pending |
| `.opencode/skills/cli-external-orchestration/**` | - | - | - | pending |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md` | - | - | - | pending |
| `.opencode/skills/sk-prompt/sk-prompt-improve/**` | - | - | - | pending |
| `.opencode/skills/sk-doc/**` (fixtures, tests, templates) | - | - | - | pending |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/**`, `mcp-server/**/ground-truth.json` | - | - | - | pending |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/{skill_advisor.py,skill-graph.json}` | - | - | - | pending |
| `README.md`, `AGENTS.md`, `BARTER.md` | - | - | - | pending |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/006-sk-design/fixtures/canary-cases.v1.json` | - | - | - | pending (adjudicate) |
| `specs/sk-design/015-deprecate-open-design/**` (this packet) | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10 (forced depth; stopPolicy=max-iterations)
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-2026-08-10-deprecate-open-design, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 15 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-08-10T08:25:00Z
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
- P1 (Required): 37
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `agent_cross_runtime` (overlay): **pending** — mirror-wide parity not audited in this pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): **pending** — mirror-wide parity not audited in this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): **pending** — mirror-wide parity not audited in this pass.

### `agent_cross_runtime` (overlay): **pending** — mirror-wide parity was not audited in this pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): **pending** — mirror-wide parity was not audited in this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): **pending** — mirror-wide parity was not audited in this pass.

### `checklist_evidence` (core): **pending** — checklist rows were not audited in this security pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` (core): **pending** — checklist rows were not audited in this security pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): **pending** — checklist rows were not audited in this security pass.

### `checklist_evidence` (core): **pending** — checklist rows were not fully audited in this correctness pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` (core): **pending** — checklist rows were not fully audited in this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): **pending** — checklist rows were not fully audited in this correctness pass.

### `feature_catalog_code` (overlay): **pending**. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `feature_catalog_code` (overlay): **pending**.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): **pending**.

### `playbook_capability` (overlay): **pending** — only security-sensitive token/path evidence was sampled. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability` (overlay): **pending** — only security-sensitive token/path evidence was sampled.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): **pending** — only security-sensitive token/path evidence was sampled.

### `playbook_capability` (overlay): **pending**. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability` (overlay): **pending**.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): **pending**.

### `skill_agent` (overlay): **checked for routing evidence** — `.opencode/agents/design.md` explicitly maps the transport and its read/Bash-only surface; full agent-family parity remains for later dimensions. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent` (overlay): **checked for routing evidence** — `.opencode/agents/design.md` explicitly maps the transport and its read/Bash-only surface; full agent-family parity remains for later dimensions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): **checked for routing evidence** — `.opencode/agents/design.md` explicitly maps the transport and its read/Bash-only surface; full agent-family parity remains for later dimensions.

### `skill_agent` (overlay): **partial** — the doctor router/workflow and CLI-primary diagnostic distinction were checked; full agent-family parity remains unreviewed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent` (overlay): **partial** — the doctor router/workflow and CLI-primary diagnostic distinction were checked; full agent-family parity remains unreviewed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): **partial** — the doctor router/workflow and CLI-primary diagnostic distinction were checked; full agent-family parity remains unreviewed.

### `spec_code` (core): **partial / findings raised** — NFR-S01 names the required security outcome, but the executable plan checks do not assert the retired env/path/token identifiers; the two prior residue/inventory gaps remain active. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` (core): **partial / findings raised** — NFR-S01 names the required security outcome, but the executable plan checks do not assert the retired env/path/token identifiers; the two prior residue/inventory gaps remain active.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): **partial / findings raised** — NFR-S01 names the required security outcome, but the executable plan checks do not assert the retired env/path/token identifiers; the two prior residue/inventory gaps remain active.

### `spec_code` (core): **partial / findings raised** — routing implementation matches the claimed transport, but the acceptance gate and inventory are incomplete for observed live variants/surfaces. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` (core): **partial / findings raised** — routing implementation matches the claimed transport, but the acceptance gate and inventory are incomplete for observed live variants/surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): **partial / findings raised** — routing implementation matches the claimed transport, but the acceptance gate and inventory are incomplete for observed live variants/surfaces.

### No additional omitted deep-alignment catalog/playbook directory was proven beyond the broad T023/T027 scopes. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No additional omitted deep-alignment catalog/playbook directory was proven beyond the broad T023/T027 scopes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No additional omitted deep-alignment catalog/playbook directory was proven beyond the broad T023/T027 scopes.

### No additional P1 for `skill_agent` or `agent_cross_runtime`; both overlays have complete named paths and planned removal actions. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No additional P1 for `skill_agent` or `agent_cross_runtime`; both overlays have complete named paths and planned removal actions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No additional P1 for `skill_agent` or `agent_cross_runtime`; both overlays have complete named paths and planned removal actions.

### No agent cross-runtime parity defect; prior pass carries forward. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No agent cross-runtime parity defect; prior pass carries forward.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No agent cross-runtime parity defect; prior pass carries forward.

### No claim that `.goal-state/.archive` JSONs are loaded by advisor or benchmark routing; goal-core history enumeration is the only observed consumer. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No claim that `.goal-state/.archive` JSONs are loaded by advisor or benchmark routing; goal-core history enumeration is the only observed consumer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No claim that `.goal-state/.archive` JSONs are loaded by advisor or benchmark routing; goal-core history enumeration is the only observed consumer.

### No claim that changelog history should be rewritten; only an append-only current deprecation entry is recommended. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No claim that changelog history should be rewritten; only an append-only current deprecation entry is recommended.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No claim that changelog history should be rewritten; only an append-only current deprecation entry is recommended.

### No claim that current unrelated provider credentials are Open Design residue; they are separate manuals and remain outside this deprecation finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No claim that current unrelated provider credentials are Open Design residue; they are separate manuals and remain outside this deprecation finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No claim that current unrelated provider credentials are Open Design residue; they are separate manuals and remain outside this deprecation finding.

### No claim that dated benchmark reports should be rewritten; archive README contracts and live parity source paths support leaving them intact. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No claim that dated benchmark reports should be rewritten; archive README contracts and live parity source paths support leaving them intact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No claim that dated benchmark reports should be rewritten; archive README contracts and live parity source paths support leaving them intact.

### No claim that editing `sk-design/description.json` alone requires regenerating `skill-graph.json`; the advisor contract names `graph-metadata.json` as the identity source. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No claim that editing `sk-design/description.json` alone requires regenerating `skill-graph.json`; the advisor contract names `graph-metadata.json` as the identity source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No claim that editing `sk-design/description.json` alone requires regenerating `skill-graph.json`; the advisor contract names `graph-metadata.json` as the identity source.

### No current routing contradiction between `hub-router.json`, `mode-registry.json`, `.opencode/agents/design.md`, `/interface:design`, and `.utcp_config.json`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No current routing contradiction between `hub-router.json`, `mode-registry.json`, `.opencode/agents/design.md`, `/interface:design`, and `.utcp_config.json`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No current routing contradiction between `hub-router.json`, `mode-registry.json`, `.opencode/agents/design.md`, `/interface:design`, and `.utcp_config.json`.

### No downgrade of P1-001 or P1-002: their cited live hits and gate/inventory mismatch were reproduced by the variant and fixture sweeps. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No downgrade of P1-001 or P1-002: their cited live hits and gate/inventory mismatch were reproduced by the variant and fixture sweeps.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No downgrade of P1-001 or P1-002: their cited live hits and gate/inventory mismatch were reproduced by the variant and fixture sweeps.

### No downgrade of P1-001, P1-010, or P1-015: the cited evidence was reread and counterevidence did not win. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No downgrade of P1-001, P1-010, or P1-015: the cited evidence was reread and counterevidence did not win.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No downgrade of P1-001, P1-010, or P1-015: the cited evidence was reread and counterevidence did not win.

### No duplicate finding for P1-001: P1-007’s scope is allowlist lifecycle/reproducibility, not token-variant matching. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No duplicate finding for P1-001: P1-007’s scope is allowlist lifecycle/reproducibility, not token-variant matching.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No duplicate finding for P1-001: P1-007’s scope is allowlist lifecycle/reproducibility, not token-variant matching.

### No finding that `skill-graph.json` directly routes to the deleted child; its mcp family does not list that child. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No finding that `skill-graph.json` directly routes to the deleted child; its mcp family does not list that child.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No finding that `skill-graph.json` directly routes to the deleted child; its mcp family does not list that child.

### No finding that requires modifying the review target during this iteration; all code-under-review paths remained read-only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No finding that requires modifying the review target during this iteration; all code-under-review paths remained read-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No finding that requires modifying the review target during this iteration; all code-under-review paths remained read-only.

### No finding that the compiled canary is a live runtime import; it is a replay/build input and still must be updated. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No finding that the compiled canary is a live runtime import; it is a replay/build input and still must be updated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No finding that the compiled canary is a live runtime import; it is a replay/build input and still must be updated.

### No finding that the plan omitted the declared sibling directories themselves; the issue is the action classification of one dedicated file. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: No finding that the plan omitted the declared sibling directories themselves; the issue is the action classification of one dedicated file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No finding that the plan omitted the declared sibling directories themselves; the issue is the action classification of one dedicated file.

### No new agent cross-runtime parity defect; prior pass remains valid. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No new agent cross-runtime parity defect; prior pass remains valid.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new agent cross-runtime parity defect; prior pass remains valid.

### No new finding for `.opencode/bin` calibration or worktree tests after the bounded `OD_` correction. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No new finding for `.opencode/bin` calibration or worktree tests after the bounded `OD_` correction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new finding for `.opencode/bin` calibration or worktree tests after the bounded `OD_` correction.

### No new P0 condition. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No new P0 condition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new P0 condition.

### No new P0 security or data-loss issue. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No new P0 security or data-loss issue.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new P0 security or data-loss issue.

### No new security exploit, auth bypass, destructive data loss, or P0 condition. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No new security exploit, auth bypass, destructive data loss, or P0 condition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new security exploit, auth bypass, destructive data loss, or P0 condition.

### No P0 condition: no exploitable security issue, auth bypass, or destructive data-loss behavior was established in this correctness pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No P0 condition: no exploitable security issue, auth bypass, or destructive data-loss behavior was established in this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P0 condition: no exploitable security issue, auth bypass, or destructive data-loss behavior was established in this correctness pass.

### No P0 condition: no literal retired credential, auth bypass, unsafe deserialization, or destructive installer behavior was evidenced in this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No P0 condition: no literal retired credential, auth bypass, unsafe deserialization, or destructive installer behavior was evidenced in this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P0 condition: no literal retired credential, auth bypass, unsafe deserialization, or destructive installer behavior was evidenced in this iteration.

### No P0 exploit, auth bypass, destructive data loss, or credential disclosure established. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No P0 exploit, auth bypass, destructive data loss, or credential disclosure established.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P0 exploit, auth bypass, destructive data loss, or credential disclosure established.

### No P0 exploit, auth bypass, secret disclosure, or destructive DB condition established. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No P0 exploit, auth bypass, secret disclosure, or destructive DB condition established.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P0 exploit, auth bypass, secret disclosure, or destructive DB condition established.

### No P0 security, auth, credential, or destructive-data-loss issue in this maintainability sweep. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: No P0 security, auth, credential, or destructive-data-loss issue in this maintainability sweep.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P0 security, auth, credential, or destructive-data-loss issue in this maintainability sweep.

### No recommendation to rewrite historical `specs/`, changelog history, dated benchmark reports, SQLite, `.worktrees/`, or `.pi-subagents/` artifacts. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No recommendation to rewrite historical `specs/`, changelog history, dated benchmark reports, SQLite, `.worktrees/`, or `.pi-subagents/` artifacts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No recommendation to rewrite historical `specs/`, changelog history, dated benchmark reports, SQLite, `.worktrees/`, or `.pi-subagents/` artifacts.

### No recommendation to rewrite historical changelog, benchmark, or spec records; only live fixtures, docs, code, and generated eval copies are in scope. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No recommendation to rewrite historical changelog, benchmark, or spec records; only live fixtures, docs, code, and generated eval copies are in scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No recommendation to rewrite historical changelog, benchmark, or spec records; only live fixtures, docs, code, and generated eval copies are in scope.

### No recommendation to rewrite historical changelogs or benchmark material. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: No recommendation to rewrite historical changelogs or benchmark material.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No recommendation to rewrite historical changelogs or benchmark material.

### No review-target edits were made. -- BLOCKED (iteration 9, 4 attempts)
- What was tried: No review-target edits were made.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No review-target edits were made.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- dimension: correctness - focus area: final iteration-010 replay of the four newly uncovered surfaces and implementation-ready inventory closure - reason: the corrected whole-workspace sweep found four live plan gaps while confirming the three requested carried P1s; all four review dimensions and overlays remain conditionally complete - rotation status: adversarial completeness replay C2 completed conditionally in iteration 009 - blocked/productive carry-forward: productive — preserve P1-001..P1-019; do not retry bounded-OD false positives or ruled-out archive/report directions - required evidence: exact `.claude` config and Cursor/Devin path disposition, advisor playbook classification, `CLAUDE.md` root action, then final zero-residue gate and strict validation proof - recovery note: if any newly named surface is proven generated or historical, record its exact path and consumer proof before downgrading; otherwise amend T021/T025/T029/T030 and rerun the gate. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->

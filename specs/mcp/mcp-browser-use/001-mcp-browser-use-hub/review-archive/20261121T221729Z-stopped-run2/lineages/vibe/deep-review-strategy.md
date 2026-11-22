---
title: Deep Review Strategy - mcp-browser-use hub
description: Runtime strategy tracking review progress, dimension coverage, findings, and outcomes across iterations for the mcp-browser-use parent hub lineage.
trigger_phrases:
  - "deep review strategy"
  - "mcp-browser-use hub review"
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - mcp-browser-use hub

## 1. OVERVIEW

### Purpose

Persistent brain for the `vibe` fan-out lineage of the deep review over the
mcp-browser-use parent hub. Records which dimensions remain, what was found
(P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Usage

- **Init:** populated from config and the pre-bound review scope file.
- **Per iteration:** read Next Focus, review the assigned dimension/files, update
  findings, mark dimensions complete, set new Next Focus.
- **Mutability:** mutable, updated by the iteration executor.

---

## 2. TOPIC

Review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` and the 8 commits
`main..HEAD` that build the browser-use parent hub: the hub scaffold, the move of
the Chrome DevTools and Aside modes into the hub, the Bladebro stealth-browser
mode, advisor routing at both stages, nested sub-track support in
system-spec-kit, and the end-to-end verification. Pure renames of moved spec
packets are out of scope; the edited and added files are in scope.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- (none — all four canonical dimensions reviewed; iteration 5 is the cross-reference sweep)

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Pure renames of moved spec packets (`git mv` of `specs/mcp/*` packets) are not
  reviewed as content; only the edited and added files are.
- The six unchanged `mcp-tooling` modes are not re-reviewed beyond the routing
  surfaces that the hub move touched.
- No implementation fixes. Findings only.

---

## 5. STOP CONDITIONS

- `config.stopPolicy` is `max-iterations` with `config.maxIterations` = 5, so the
  loop stops at the cap and records `stopReason: maxIterationsReached`.
- Convergence below `config.convergenceThreshold` (0.10) before the cap is
  telemetry only; the loop broadens review angles instead of synthesizing early.

---

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
- P1 (Required): 2
- P2 (Suggestions): 10
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the compiled router and executing it against the compiled snapshot: the `forbidden` substring reject only surfaced when a real prompt was run, not from reading the branch. (iteration 1)
- Recompiling the hub inputs and diffing the hash against the activation manifest: this is what proved the recorded benchmark hashes stale. (iteration 1)
- Reading each mode packet's own R-SEC rules first, then checking its reference files against them: the npx pin contradiction only appears when R-SEC-3 is held beside `mcp-wiring.md`. (iteration 2)
- Re-executing both routing stages live instead of trusting the recorded replay: this is what separated "the outcomes still hold" from "the recorded provenance does not". (iteration 3)
- Parsing `ROUTER.md`'s `INTENT_SIGNALS` block and `hub-router.json`'s `vocabularyClasses` in one script and diffing the sets: reading the two documents side by side hides a three-keyword drift inside a 31-keyword class, and the script also proved Aside and Bladebro match exactly, which localizes the defect. (iteration 4)
- Sweeping the compiler for the key a config field claims to feed (`resources`) instead of assuming the field is live: the absence of a reader is what turned a plausible-looking config into a dead-configuration finding. (iteration 4)

---

## 9. WHAT FAILED

- Reading `hub-router.json` alone to judge the `ambiguityDelta` knob: the inertness only appears once the mode weights are read beside the scorer. (iteration 1)
- Treating the mode-registry `toolSurface` allow/forbid lists as an enforced gate: `registry-compiler.cjs` reads only `mutatesWorkspace`, so there is no gate to test. (iteration 2)
- Trusting the compiler's own comment that "no second keyword list can drift from the authored one": the comment is false as shipped, and only the parse-and-diff exposed it. A self-description in a source comment is not evidence of the property it claims. (iteration 4)
- Reading `ROUTER.md`'s unnumbered `## MACHINE ROUTER` heading as a contract violation: `skill-md-template.md` permits it and `RS-003` is satisfied, so the suspicion cost a check and produced no finding. (iteration 4)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A broken advisor edge after the move.** Stage one returns `mcp-browser-use` above threshold for both a DevTools and a Bladebro prompt. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A broken advisor edge after the move.** Stage one returns `mcp-browser-use` above threshold for both a DevTools and a Bladebro prompt. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broken advisor edge after the move.** Stage one returns `mcp-browser-use` above threshold for both a DevTools and a Bladebro prompt. (iteration 3)

### **A broken compiled front door after the move.** Stage two returns the expected mode for all three mode prompts at the shipped hash. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A broken compiled front door after the move.** Stage two returns the expected mode for all three mode prompts at the shipped hash. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broken compiled front door after the move.** Stage two returns the expected mode for all three mode prompts at the shipped hash. (iteration 3)

### **A dangling `mcp-tooling` browser reference.** Both `rg` sweeps and the two extra metadata files print no match. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A dangling `mcp-tooling` browser reference.** Both `rg` sweeps and the two extra metadata files print no match. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A dangling `mcp-tooling` browser reference.** Both `rg` sweeps and the two extra metadata files print no match. (iteration 3)

### **A missing research phase.** 12 iteration records and a 32 KB `research.md` satisfy criterion 1. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A missing research phase.** 12 iteration records and a 32 KB `research.md` satisfy criterion 1. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing research phase.** 12 iteration records and a 32 KB `research.md` satisfy criterion 1. (iteration 3)

### **A parent-skill checker failure.** The checker exits 0 and names the hub. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A parent-skill checker failure.** The checker exits 0 and names the hub. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A parent-skill checker failure.** The checker exits 0 and names the hub. (iteration 3)

### **A wrong mode count in either registry.** The hub lists 3 and `mcp-tooling` lists 6, matching D3 and criterion 2. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A wrong mode count in either registry.** The hub lists 3 and `mcp-tooling` lists 6, matching D3 and criterion 2. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong mode count in either registry.** The hub lists 3 and `mcp-tooling` lists 6, matching D3 and criterion 2. (iteration 3)

### **Aside MCP transport carrying credentials.** `mcp-aside-devtools/SKILL.md:95` states the stdio process "has no URL, port, token or credential field" and inherits the logged-in CLI context, so there is no transport credential to leak. (iteration 2) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Aside MCP transport carrying credentials.** `mcp-aside-devtools/SKILL.md:95` states the stdio process "has no URL, port, token or credential field" and inherits the logged-in CLI context, so there is no transport credential to leak. (iteration 2)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Aside MCP transport carrying credentials.** `mcp-aside-devtools/SKILL.md:95` states the stdio process "has no URL, port, token or credential field" and inherits the logged-in CLI context, so there is no transport credential to leak. (iteration 2)

### **Bladebro clone lane copying credentials without cleanup.** `browser-lanes.md:52` documents `rb forget` to remove the imported copy and `install-and-verify.md:76` documents removing the data root after confirming no needed sessions remain. (iteration 2) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Bladebro clone lane copying credentials without cleanup.** `browser-lanes.md:52` documents `rb forget` to remove the imported copy and `install-and-verify.md:76` documents removing the data root after confirming no needed sessions remain. (iteration 2)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Bladebro clone lane copying credentials without cleanup.** `browser-lanes.md:52` documents `rb forget` to remove the imported copy and `install-and-verify.md:76` documents removing the data root after confirming no needed sessions remain. (iteration 2)

### **Bundle lookup returning null.** Every reachable tie set has a compiled composition rule, so the `bundle ? bundle.kind : 'orderedBundle'` fallback at `router.cjs:120` is dead code rather than a live defect. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Bundle lookup returning null.** Every reachable tie set has a compiled composition rule, so the `bundle ? bundle.kind : 'orderedBundle'` fallback at `router.cjs:120` is dead code rather than a live defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Bundle lookup returning null.** Every reachable tie set has a compiled composition rule, so the `bundle ? bundle.kind : 'orderedBundle'` fallback at `router.cjs:120` is dead code rather than a live defect.

### **Cross-mode authority escalation.** Every `authorityGraph` edge is self-approving, so no mode can approve another mode's commit. (iteration 2, evidence: `registry-compiler.cjs:246`) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Cross-mode authority escalation.** Every `authorityGraph` edge is self-approving, so no mode can approve another mode's commit. (iteration 2, evidence: `registry-compiler.cjs:246`)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cross-mode authority escalation.** Every `authorityGraph` edge is self-approving, so no mode can approve another mode's commit. (iteration 2, evidence: `registry-compiler.cjs:246`)

### **Discovery-only vocabulary leaking into mode scores.** `hub-identity` and `generic-browser-automation` are referenced by no `routerSignals` entry, and the executed `"browser automation for this site"` case defers with `reason: "no-match"` as designed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Discovery-only vocabulary leaking into mode scores.** `hub-identity` and `generic-browser-automation` are referenced by no `routerSignals` entry, and the executed `"browser automation for this site"` case defers with `reason: "no-match"` as designed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Discovery-only vocabulary leaking into mode scores.** `hub-identity` and `generic-browser-automation` are referenced by no `routerSignals` entry, and the executed `"browser automation for this site"` case defers with `reason: "no-match"` as designed.

### **Duplicate destination tuples.** `destinationKey` canonicalizes the full `{backendKind, packetId, packetKind, skillId, workflowMode}` tuple and the compiler rejects duplicates, so two modes cannot collide on one authority ref. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Duplicate destination tuples.** `destinationKey` canonicalizes the full `{backendKind, packetId, packetKind, skillId, workflowMode}` tuple and the compiler rejects duplicates, so two modes cannot collide on one authority ref.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Duplicate destination tuples.** `destinationKey` canonicalizes the full `{backendKind, packetId, packetKind, skillId, workflowMode}` tuple and the compiler rejects duplicates, so two modes cannot collide on one authority ref.

### **Stale activation manifest.** The guard reports `fresh` for `mcp-browser-use`, so the manifest is not the source of the hash divergence in finding 2. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Stale activation manifest.** The guard reports `fresh` for `mcp-browser-use`, so the manifest is not the source of the hash divergence in finding 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stale activation manifest.** The guard reports `fresh` for `mcp-browser-use`, so the manifest is not the source of the hash divergence in finding 2.

### **Tool-surface declarations being silently unenforced.** The registry's own description scopes it to the discriminator and the advisor projection, and `bashAllowlist: []` is the documented hub convention, so the declarative lists are not a broken gate. (iteration 2, evidence: `mode-registry.json:5`) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Tool-surface declarations being silently unenforced.** The registry's own description scopes it to the discriminator and the advisor projection, and `bashAllowlist: []` is the documented hub convention, so the declarative lists are not a broken gate. (iteration 2, evidence: `mode-registry.json:5`)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Tool-surface declarations being silently unenforced.** The registry's own description scopes it to the discriminator and the advisor projection, and `bashAllowlist: []` is the documented hub convention, so the declarative lists are not a broken gate. (iteration 2, evidence: `mode-registry.json:5`)

### **Truncated authority refs colliding.** `authorityRef` truncates SHA-256 to 24 hex characters (96 bits), which is ample for three destinations and is additionally guarded by the duplicate-tuple check. (iteration 2, evidence: `registry-compiler.cjs:52`) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Truncated authority refs colliding.** `authorityRef` truncates SHA-256 to 24 hex characters (96 bits), which is ample for three destinations and is additionally guarded by the duplicate-tuple check. (iteration 2, evidence: `registry-compiler.cjs:52`)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Truncated authority refs colliding.** `authorityRef` truncates SHA-256 to 24 hex characters (96 bits), which is ample for three destinations and is additionally guarded by the duplicate-tuple check. (iteration 2, evidence: `registry-compiler.cjs:52`)

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Duplicate destination tuples: `destinationKey` canonicalizes the full tuple and the compiler rejects duplicates. (iteration 1, evidence: `registry-compiler.cjs:236`)
- Bundle lookup returning null: every reachable tie set has a compiled composition rule. (iteration 1, evidence: `registry-compiler.cjs:139`)
- Stale activation manifest: the guard reports `fresh` for `mcp-browser-use`. (iteration 1, evidence: `compiled-route-guard.cjs --json`)
- Discovery-only vocabulary leaking into mode scores: no `routerSignals` entry references those classes. (iteration 1, evidence: `hub-router.json:66`)
- `leaf-manifest.json` naming missing leaves: all three modes' leaves exist on disk. (iteration 1)
- Cross-mode authority escalation: every `authorityGraph` edge is self-approving. (iteration 2, evidence: `registry-compiler.cjs:246`)
- Truncated authority refs colliding: 96 bits over three destinations, plus the duplicate-tuple guard. (iteration 2, evidence: `registry-compiler.cjs:52`)
- Tool-surface declarations being silently unenforced: the registry scopes itself to the discriminator and advisor projection, and `bashAllowlist: []` is the hub convention. (iteration 2, evidence: `mode-registry.json:5`)
- Aside MCP transport carrying credentials: the stdio process has no credential field. (iteration 2, evidence: `mcp-aside-devtools/SKILL.md:95`)
- Bladebro clone lane copying credentials without cleanup: `rb forget` and the data-root removal are both documented. (iteration 2, evidence: `browser-lanes.md:52`)
- A dangling `mcp-tooling` browser reference: both `rg` sweeps and the two extra metadata files print no match. (iteration 3)
- A wrong mode count in either registry: the hub lists 3 and `mcp-tooling` lists 6. (iteration 3)
- A broken advisor edge after the move: stage one returns `mcp-browser-use` above threshold for both a DevTools and a Bladebro prompt. (iteration 3)
- A broken compiled front door after the move: stage two returns the expected mode for all three mode prompts at the shipped hash. (iteration 3)
- A missing research phase: 12 iteration records and a 32 KB `research.md` satisfy criterion 1. (iteration 3)
- A parent-skill checker failure: the checker exits 0 and names the hub. (iteration 3)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: maintainability - Focus area: the hub's `SKILL.md`, `ROUTER.md`, `README.md` and `graph-metadata.json` for pattern compliance against the `mcp-tooling` template; the three mode packets' `ROUTER.md` and `description.json`; and the `benchmark/reports/README.md` indexes - Reason: traceability is complete; maintainability is the last canonical dimension and the hub's documentation set is the largest unreviewed surface in scope - Rotation status: first pass on maintainability - Blocked/productive carry-forward: re-executing both routing stages was productive for traceability; do not re-derive the stale-hash root cause, which is already `R1-P1-002` - Required evidence: file:line for every pattern deviation and every documentation gap Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** `.skilled/skills/mcp-browser-use/` (SKILL.md, ROUTER.md,
  README.md, hub-router.json, leaf-manifest.json, leaf-scopes.json,
  mode-registry.json, description.json, graph-metadata.json, three mode folders,
  manual-testing-playbook, benchmark reports, changelog);
  `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/`
  (router.cjs, registry-compiler.cjs, policy-card.cjs, harness, fixtures);
  `.skilled/bin/compiled-route-guard.cjs`, `compiled-route-sync.cjs`,
  `lib/compiled-routing/014-runtime-engine/lib/{compiled-route,resolve}.cjs`,
  `013-live-activation/activation/mcp-browser-use/{manifest,fence-state}.json`;
  `.skilled/skills/mcp-tooling/` registry surfaces; the spec packet
  `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/` (goal.md, spec.md,
  decision-record.md, six child phases).
- **Behavior claims:** D2 (CLI-first, MCP via Code Mode fallback), D3 (mcp-tooling
  keeps six modes), D7 (a mode is integrated only when both routing stages pass),
  and the seven completion criteria in `goal.md`.
- **Reuse and conventions:** the `mcp-tooling` parent-hub pattern (mode-registry,
  hub-router, leaf-manifest, leaf-scopes) is the template the browser hub copies.
- **Review risks and gaps:** the scope file lists 277 paths, so per-iteration
  coverage is sampled by risk rather than exhaustive; moved-packet renames are
  excluded by the operator focus.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | All seven goal criteria checked; criteria 1-5 re-executed and hold; criterion 7 assessed from recorded evidence only. |
| `checklist_evidence` | core | partial | 3 | Criteria 1-5 re-executed and hold; criterion 6 carries no verdict; criterion 7 evidence location unmet for three children. |
| `skill_agent` | overlay | partial | 2 | R-SEC-3 contradicted by the unpinned npx fallback; R-SEC-1 and R-SEC-2 weakened by two ambient settings. Aside `--account` prohibition restated correctly. |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pass | 3 | All three modes carry a playbook with scenario files and a recorded run; the hub carries 7 routing scenarios. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs` | D1 | 1 | 1 P1, 2 P2 | partial |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` | D1 | 1 | 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/hub-router.json` | D1 | 1 | 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md` | D1 | 1 | 1 P1 | partial |
| `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/README.md` | D1 | 1 | 1 P1 | partial |
| `.skilled/skills/mcp-browser-use/leaf-manifest.json` | D1 | 1 | 0 | complete |
| `.skilled/skills/mcp-browser-use/leaf-scopes.json` | D1 | 1 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md` | D2 | 2 | 1 P1 | partial |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | D2 | 2 | 2 P2 | partial |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | D2 | 2 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | D2 | 2 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` | D2 | 2 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/aside-cli-reference.md` | D2 | 2 | 0 | complete |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md` | D2 | 2 | 0 | complete |
| `.skilled/skills/mcp-browser-use/shared/README.md` | D2 | 2 | 0 | complete |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` | D3 | 3 | 2 P2 | partial |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md` | D3 | 3 | 1 P2 | partial |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/tasks.md` | D3 | 3 | 0 | complete |
| `.skilled/skills/mcp-tooling/mode-registry.json` | D3 | 3 | 0 | complete |
| `.skilled/skills/mcp-tooling/graph-metadata.json` | D3 | 3 | 0 | complete |
| `.skilled/skills/mcp-tooling/ROUTER.md` | D3 | 3 | 0 | complete |
| `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/README.md` | D1, D3 | 3 | 1 P1, 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | D3 | 3 | 0 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-1795298930568-k8qdqy, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-21T22:09:31Z
<!-- MACHINE-OWNED: END -->

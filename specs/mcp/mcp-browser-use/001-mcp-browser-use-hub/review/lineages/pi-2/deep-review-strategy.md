---
title: Deep Review Strategy - mcp-browser-use hub
description: Runtime tracking file for the deep-review lineage pi-2 over the mcp-browser-use hub packet.
---

# Deep Review Strategy - mcp-browser-use hub (lineage pi-2)

## 1. OVERVIEW

### Purpose

Persistent brain for this review lineage. Records dimension order, running findings,
what worked or failed, exhausted approaches, and the next focus. Read at the start of
every iteration and updated at the end of it.

---

## 2. TOPIC

Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder target).
Pre-bound scope: `review-scope-files.txt` in this lineage, 522 repo-relative files
(hub skill tree, compiled-routing library, advisor runtime, spec phases 001-015).
Operator review focus: every phase's shipped work against its goal criteria, including the
phase 015 fixes and the advisor 2.0.3.0 id-noun change.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- No fixes, no code or doc edits under review (observation-only loop).
- No repository tooling runs that write outside this lineage (`validate.sh`, `generate-context.js`, git writes).
- No breadth beyond the 522 pre-bound scope files except cited context evidence from the target document set.

---

## 5. STOP CONDITIONS

- Legal convergence via `convergence.cjs` stop decision (composite vote, all-dimension coverage, P0 resolution, evidence density, claim adjudication).
- `maxIterations` 7 reached.
- Three consecutive failed iterations.

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
- P1 (Required): 0
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- [pending -- populated after iteration 1]

---

## 9. WHAT FAILED

- [pending -- populated after iteration 1]

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`.utcp_config.json` carries a token": ruled out -- all five browser manuals are stdio with empty `env`, and the Figma key is an indirection. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "`.utcp_config.json` carries a token": ruled out -- all five browser manuals are stdio with empty `env`, and the Figma key is an indirection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`.utcp_config.json` carries a token": ruled out -- all five browser manuals are stdio with empty `env`, and the Figma key is an indirection.

### "`shared/` or `manual-testing-playbook/` is a stale layout entry": ruled out -- both exist. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "`shared/` or `manual-testing-playbook/` is a stale layout entry": ruled out -- both exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`shared/` or `manual-testing-playbook/` is a stale layout entry": ruled out -- both exist.

### "Capability matrix overstates the Chrome DevTools MCP surface": ruled out against the Lighthouse/trace leaf and the `bdg` console/HAR lines. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Capability matrix overstates the Chrome DevTools MCP surface": ruled out against the Lighthouse/trace leaf and the `bdg` console/HAR lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Capability matrix overstates the Chrome DevTools MCP surface": ruled out against the Lighthouse/trace leaf and the `bdg` console/HAR lines.

### "Compiled policy is stale against hub-router 1.1.3.0": ruled out; 1.1.3.0-era vocabulary ("core web vitals", "fill in the form in my signed-in") routes as authored, and the live decision carries `effectivePolicyHash fc55eafa...` with `generation 1`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Compiled policy is stale against hub-router 1.1.3.0": ruled out; 1.1.3.0-era vocabulary ("core web vitals", "fill in the form in my signed-in") routes as authored, and the live decision carries `effectivePolicyHash fc55eafa...` with `generation 1`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Compiled policy is stale against hub-router 1.1.3.0": ruled out; 1.1.3.0-era vocabulary ("core web vitals", "fill in the form in my signed-in") routes as authored, and the live decision carries `effectivePolicyHash fc55eafa...` with `generation 1`.

### "OrderedBundle never fires because the router sorts by score first": ruled out by probe; equal weight 4 and one distinct keyword per mode yields an equal score, and `router.cjs:88-92` keeps every mode within `ambiguityDelta` 1. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "OrderedBundle never fires because the router sorts by score first": ruled out by probe; equal weight 4 and one distinct keyword per mode yields an equal score, and `router.cjs:88-92` keeps every mode within `ambiguityDelta` 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "OrderedBundle never fires because the router sorts by score first": ruled out by probe; equal weight 4 and one distinct keyword per mode yields an equal score, and `router.cjs:88-92` keeps every mode within `ambiguityDelta` 1.

### "Phase 015 claims 51 of 52 with stale artifacts": ruled out -- every row reproduces. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Phase 015 claims 51 of 52 with stale artifacts": ruled out -- every row reproduces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Phase 015 claims 51 of 52 with stale artifacts": ruled out -- every row reproduces.

### "The advisor 2.0.3.0 change is documented but not shipped": ruled out -- version parity holds and the six probes show the new behaviour. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The advisor 2.0.3.0 change is documented but not shipped": ruled out -- version parity holds and the six probes show the new behaviour.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The advisor 2.0.3.0 change is documented but not shipped": ruled out -- version parity holds and the six probes show the new behaviour.

### "The benchmark report index drifted like the changelog table": ruled out -- all three report directories are listed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The benchmark report index drifted like the changelog table": ruled out -- all three report directories are listed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The benchmark report index drifted like the changelog table": ruled out -- all three report directories are listed.

### "The Chrome `@latest` guide rows and the pinned UTCP registration are drift": ruled out -- phase 015 records the shared-convention decision, and the registration pins a version the guide treats as the MCP entry point. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The Chrome `@latest` guide rows and the pinned UTCP registration are drift": ruled out -- phase 015 records the shared-convention decision, and the registration pins a version the guide treats as the MCP entry point.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Chrome `@latest` guide rows and the pinned UTCP registration are drift": ruled out -- phase 015 records the shared-convention decision, and the registration pins a version the guide treats as the MCP entry point.

### "The guard cannot see the MCP handshake, so the read-only label is false": ruled out -- the packet classifies the probe as read-only in two catalogs, and the guard's contract forbids unbounded network and mutation, not a bounded local stdio handshake. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The guard cannot see the MCP handshake, so the read-only label is false": ruled out -- the packet classifies the probe as read-only in two catalogs, and the guard's contract forbids unbounded network and mutation, not a bounded local stdio handshake.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The guard cannot see the MCP handshake, so the read-only label is false": ruled out -- the packet classifies the probe as read-only in two catalogs, and the guard's contract forbids unbounded network and mutation, not a bounded local stdio handshake.

### "The hook's comment-hygiene gate trusts the working tree": ruled out -- it copies the staged blobs into a temp mirror and checks those (`.skilled/scripts/git-hooks/pre-commit:224-248`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The hook's comment-hygiene gate trusts the working tree": ruled out -- it copies the staged blobs into a temp mirror and checks those (`.skilled/scripts/git-hooks/pre-commit:224-248`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The hook's comment-hygiene gate trusts the working tree": ruled out -- it copies the staged blobs into a temp mirror and checks those (`.skilled/scripts/git-hooks/pre-commit:224-248`).

### "The mode packets need their own changelog index": ruled out -- the checker's version invariant is the contract, and no requirement asks for a per-packet table. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The mode packets need their own changelog index": ruled out -- the checker's version invariant is the contract, and no requirement asks for a per-packet table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The mode packets need their own changelog index": ruled out -- the checker's version invariant is the contract, and no requirement asks for a per-packet table.

### "The README version line 1.1.4.0 is drift": ruled out by the phase 015 ruling; only the changelog table is left open, and that is the iteration's P2. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The README version line 1.1.4.0 is drift": ruled out by the phase 015 ruling; only the changelog table is left open, and that is the iteration's P2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The README version line 1.1.4.0 is drift": ruled out by the phase 015 ruling; only the changelog table is left open, and that is the iteration's P2.

### "The registry lost the finding metadata": ruled out -- `findingClass` and `scopeProof` are null in the reducer's view but present in the iteration records and deltas, which is where the remediation reads them. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The registry lost the finding metadata": ruled out -- `findingClass` and `scopeProof` are null in the reducer's view but present in the iteration records and deltas, which is where the remediation reads them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The registry lost the finding metadata": ruled out -- `findingClass` and `scopeProof` are null in the reducer's view but present in the iteration records and deltas, which is where the remediation reads them.

### "The stop decision is CONTINUE because the review found too much": ruled out -- the graph decision is STOP_ALLOWED, the only failing gates are the two the arithmetic above explains, and no gate names a missing artifact or an unresolved finding. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The stop decision is CONTINUE because the review found too much": ruled out -- the graph decision is STOP_ALLOWED, the only failing gates are the two the arithmetic above explains, and no gate names a missing artifact or an unresolved finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The stop decision is CONTINUE because the review found too much": ruled out -- the graph decision is STOP_ALLOWED, the only failing gates are the two the arithmetic above explains, and no gate names a missing artifact or an unresolved finding.

### "The v1.1.3.0 correction hides a rewrite": ruled out -- it quotes the older claim and names the release that retired it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The v1.1.3.0 correction hides a rewrite": ruled out -- it quotes the older claim and names the release that retired it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The v1.1.3.0 correction hides a rewrite": ruled out -- it quotes the older claim and names the release that retired it.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

None yet.

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: maintainability and security, second pass - Focus area: the in-scope surfaces no iteration has opened yet -- the Chrome DevTools shared helper script, the hub `shared/` folder, the feature-catalog and playbook claims that assert counts, and the mode safety contracts the hub delegates to. - Reason: evidence density is the one thing this run can still improve honestly; the four findings are all documentation-level, and the unread half of the scope is where a behavioural defect would hide. - Required evidence: file:line for anything raised, and one command per asserted count. - Rotation status: D1 to D4 covered; this is depth, not rotation. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: hub skill tree `.skilled/skills/mcp-browser-use/`, compiled-routing library `.skilled/bin/lib/compiled-routing/`, advisor runtime `.skilled/skills/system-skill-advisor/`, spec phases `001-research` .. `015-fix-follow-up-review-findings`.
- Behavior claims: each phase's `goal.md` / `acceptance-criteria.md`; the hub routes a request to one of three browser modes (Chrome DevTools, Aside, Bladebro) and defers when ambiguous; the advisor 2.0.3.0 id-noun change keeps skill ids noun-form across scorer lanes, Python parity and docs.
- Reuse and conventions: `hub-router.json` + `mode-registry.json` are the routing source; `leaf-manifest.json` / `leaf-scopes.json` describe leaves; changelogs are per-skill versioned `.md` files; phase `implementation-summary.md` is the shipped-work record.
- Review risks and gaps: no `resource-map.md`, so the Resource Map Coverage Gate is skipped. Scope is large (522 files); a single iteration must stay inside 24 tool calls and cite only what it read.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending] | [-] | [not run yet] |
| `checklist_evidence` | core | [pending] | [-] | [not run yet] |
| `skill_agent` | overlay | [pending] | [-] | [not run yet] |
| `agent_cross_runtime` | overlay | [pending] | [-] | [not run yet] |
| `feature_catalog_code` | overlay | [pending] | [-] | [not run yet] |
| `playbook_capability` | overlay | [pending] | [-] | [not run yet] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
522 files, grouped: hub skill tree (`.skilled/skills/mcp-browser-use/**`), compiled-routing library and tests (`.skilled/bin/**`), advisor runtime and fixtures (`.skilled/skills/system-skill-advisor/**`), doctor hook scripts (`.skilled/commands/doctor/**`), spec packet docs (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/**`).

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [hub routing tables] | [-] | [-] | [-] | [-] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-pi-2-1795511024070-2cuwlj, parentSessionId=2026-11-24T09:03:35.256Z, generation=4, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
<!-- MACHINE-OWNED: END -->

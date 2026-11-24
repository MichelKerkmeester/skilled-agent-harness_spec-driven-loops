---
title: Deep Review Strategy - mcp-browser-use hub packet
description: Session tracking for the pi-1 fan-out lineage review of the mcp-browser-use hub packet.
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - mcp-browser-use hub (pi-1 lineage)

## 1. OVERVIEW

### Purpose

Persistent brain for this lineage's review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub`. Records dimension coverage, findings, what worked, what failed, and the next focus.

### Usage

The leaf reads Next Focus and Exhausted Approaches at every iteration and updates the machine-owned sections after the pass.

---

## 2. TOPIC

Review: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder, phase parent with 14 child phases).

Operator review focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-running the shipped test suites, the live browser runs, or the benchmark replays: this is an observation-only review of what the packet claims and what its files show.
- Reviewing the six `mcp-tooling` modes that the hub does not own, except where the hub's contract claims they stay unchanged.
- Implementing fixes: findings are reported, not repaired.

---

## 5. STOP CONDITIONS

- Legal convergence at `convergenceThreshold` 0.10 with all four dimensions covered, or the 7-iteration cap.
- A blocked stop whose blocker set repeats to the stuck threshold.

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
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading phase 014's own commits with `git show` and then the shipped files: the goal criteria could be checked against what actually landed, not against the summary prose (iteration 1).
- Computing the lexical arithmetic by hand (`scoreTokenOverlap` denominator of `max(3, tokenCount)`) turned a suspicion about the anchor into a concrete path from one word to the floor (iteration 1).
- Searching the packet's docs with the exact package token (`rg '@latest|chrome-devtools-mcp@'`) located an unpinned registration snippet that the phase summary's blanket claim said could not exist (iteration 2).
- Comparing an acceptance row's agreement claim against the actual metadata file it cites found two packets whose derived status never followed their docs (iteration 3).
- Reading two scripts that must agree side by side, and grepping the test that would guard them, showed Bladebro's pin and digests are declared twice with no test watching the pair (iteration 4).

---

## 9. WHAT FAILED

- Treating "no browser doc or script fetches a package without an exact version and an operator yes" as already proven because the phase said so: the Chrome install guide still teaches `@latest` (iteration 2).
- Reading an acceptance row's evidence sentence as proof of what the files say, without opening the files it cites: AC-008's agreement claim did not hold (iteration 3).
- Accepting a documented "same values as install.sh" comment as a guard: the comment records the duplication, and nothing enforces it (iteration 4).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"A bare `har` still anchors the hub."** Ruled out: `har` was removed from `TOKEN_BOOSTS` (`lanes/explicit.ts:43-46`) and from the `mcp-browser-use` category hints (`lanes/lexical.ts:30`), and the replay row MBU-T-03 still routes on the hub's own phrase "export a HAR". -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"A bare `har` still anchors the hub."** Ruled out: `har` was removed from `TOKEN_BOOSTS` (`lanes/explicit.ts:43-46`) and from the `mcp-browser-use` category hints (`lanes/lexical.ts:30`), and the replay row MBU-T-03 still routes on the hub's own phrase "export a HAR".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"A bare `har` still anchors the hub."** Ruled out: `har` was removed from `TOKEN_BOOSTS` (`lanes/explicit.ts:43-46`) and from the `mcp-browser-use` category hints (`lanes/lexical.ts:30`), and the replay row MBU-T-03 still routes on the hub's own phrase "export a HAR".

### **"The 014 hub commit broke serving authority."** Ruled out: the activation manifest and the resolver's policy-hash binding agree with the replay's recorded policy. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"The 014 hub commit broke serving authority."** Ruled out: the activation manifest and the resolver's policy-hash binding agree with the replay's recorded policy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The 014 hub commit broke serving authority."** Ruled out: the activation manifest and the resolver's policy-hash binding agree with the replay's recorded policy.

### **"The browser read-only lift still accepts a bare performance trace."** Ruled out: `readOnlyRouteAllowed` now requires `chrome performance trace` or `browser performance trace` (`fusion.ts:635-641`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"The browser read-only lift still accepts a bare performance trace."** Ruled out: `readOnlyRouteAllowed` now requires `chrome performance trace` or `browser performance trace` (`fusion.ts:635-641`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The browser read-only lift still accepts a bare performance trace."** Ruled out: `readOnlyRouteAllowed` now requires `chrome performance trace` or `browser performance trace` (`fusion.ts:635-641`).

### **A browser mode still lives inside `mcp-tooling`.** Ruled out by the exact search in parent criterion 3. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A browser mode still lives inside `mcp-tooling`.** Ruled out by the exact search in parent criterion 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A browser mode still lives inside `mcp-tooling`.** Ruled out by the exact search in parent criterion 3.

### **A browser script executes unvalidated shell input from a page.** Ruled out: the aside example evaluates one REPL string with quote/backslash guards, and the Bladebro attach example parses only its own eval envelope. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A browser script executes unvalidated shell input from a page.** Ruled out: the aside example evaluates one REPL string with quote/backslash guards, and the Bladebro attach example parses only its own eval envelope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A browser script executes unvalidated shell input from a page.** Ruled out: the aside example evaluates one REPL string with quote/backslash guards, and the Bladebro attach example parses only its own eval envelope.

### **A catalog claim contradicting the CLI reference.** Ruled out for the transport entry: envelope fields and exit codes match in three places. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A catalog claim contradicting the CLI reference.** Ruled out for the transport entry: envelope fields and exit codes match in three places.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A catalog claim contradicting the CLI reference.** Ruled out for the transport entry: envelope fields and exit codes match in three places.

### **A catalog entry silently missing its scenario.** Ruled out: the playbook root names the entries without a scenario and their reasons. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A catalog entry silently missing its scenario.** Ruled out: the playbook root names the entries without a scenario and their reasons.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A catalog entry silently missing its scenario.** Ruled out: the playbook root names the entries without a scenario and their reasons.

### **A packet version disagrees with its changelog.** Ruled out for the hub and all three modes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A packet version disagrees with its changelog.** Ruled out for the hub and all three modes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A packet version disagrees with its changelog.** Ruled out for the hub and all three modes.

### **A reviewed file changed under the review.** Ruled out: `git status --porcelain` over the three skill packets and the phase folders prints nothing, so every finding still describes HEAD. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A reviewed file changed under the review.** Ruled out: `git status --porcelain` over the three skill packets and the phase folders prints nothing, so every finding still describes HEAD.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A reviewed file changed under the review.** Ruled out: `git status --porcelain` over the three skill packets and the phase folders prints nothing, so every finding still describes HEAD.

### **An unreferenced browser script.** Ruled out: every script under the three `scripts/` folders is named by at least two packet docs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **An unreferenced browser script.** Ruled out: every script under the three `scripts/` folders is named by at least two packet docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An unreferenced browser script.** Ruled out: every script under the three `scripts/` folders is named by at least two packet docs.

### **Aside manual cloned into a dual-manual layout without isolation.** Ruled out: the packet documents one manual plus a single-writer rule and a pending isolation test (`mcp-aside-devtools/references/mcp-wiring.md:127`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Aside manual cloned into a dual-manual layout without isolation.** Ruled out: the packet documents one manual plus a single-writer rule and a pending isolation test (`mcp-aside-devtools/references/mcp-wiring.md:127`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Aside manual cloned into a dual-manual layout without isolation.** Ruled out: the packet documents one manual plus a single-writer rule and a pending isolation test (`mcp-aside-devtools/references/mcp-wiring.md:127`).

### **Bladebro digest verification runs after installed code executes.** Ruled out: `install.sh` defers the first `--version` call until after both launcher and native digests match (`mcp-bladebro/scripts/install.sh:160-180`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Bladebro digest verification runs after installed code executes.** Ruled out: `install.sh` defers the first `--version` call until after both launcher and native digests match (`mcp-bladebro/scripts/install.sh:160-180`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Bladebro digest verification runs after installed code executes.** Ruled out: `install.sh` defers the first `--version` call until after both launcher and native digests match (`mcp-bladebro/scripts/install.sh:160-180`).

### **The 014 commit is an unreviewable blast radius.** Ruled out by the file breakdown: 459 packet files plus 60 hub skill files plus 5 shared files is one fix set, not unrelated churn. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The 014 commit is an unreviewable blast radius.** Ruled out by the file breakdown: 459 packet files plus 60 hub skill files plus 5 shared files is one fix set, not unrelated churn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 014 commit is an unreviewable blast radius.** Ruled out by the file breakdown: 459 packet files plus 60 hub skill files plus 5 shared files is one fix set, not unrelated churn.

### **The Bladebro playbooks hide their one FAIL.** Ruled out: the report records BB-012 FAIL with a reason, and the playbook root links that report as the latest recorded run. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The Bladebro playbooks hide their one FAIL.** Ruled out: the report records BB-012 FAIL with a reason, and the playbook root links that report as the latest recorded run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Bladebro playbooks hide their one FAIL.** Ruled out: the report records BB-012 FAIL with a reason, and the playbook root links that report as the latest recorded run.

### **The hub router duplicates the registry's alias list.** Ruled out: `vocabularyClasses` serves routing and deliberately omits bare `aside`, with the omission explained in the file. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The hub router duplicates the registry's alias list.** Ruled out: `vocabularyClasses` serves routing and deliberately omits bare `aside`, with the omission explained in the file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hub router duplicates the registry's alias list.** Ruled out: `vocabularyClasses` serves routing and deliberately omits bare `aside`, with the omission explained in the file.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Bare `har` still anchoring the browser hub: ruled out, `har` left both the explicit token boosts and the lexical hints, and MBU-T-03 routes on the hub's own phrase (iteration 1).
- Compiled serving ignoring the activation manifest: ruled out, `resolve.cjs` gates on the runtime flag, the manifest's serving authority and a matching policy hash (iteration 1).
- The Bladebro installer being unhardened: ruled out, `--ignore-scripts`, launcher and native digests, and removal on mismatch are all present (iteration 1).
- The Aside installer running implicitly: ruled out, it is an operator-invoked wrapper documented as never implicit (iteration 2).
- A browser example executing page-controlled input: ruled out, the attach example parses only its own eval envelope (iteration 2).
- A browser mode still living inside `mcp-tooling`: ruled out by the parent's own exact search (iteration 3).
- A packet version disagreeing with its changelog: ruled out for the hub and all three modes (iteration 3).
- An unreviewable 014 commit: ruled out, 459 of its 526 files are the packet's own review archive (iteration 4).
- The hub router duplicating the registry alias list: ruled out, the routing vocabulary omits bare `aside` on purpose (iteration 4).
- An unreferenced browser script: ruled out, every script is named by at least two packet docs (iteration 4).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: hand the seven findings, the six bug classes and the goal-criteria ledger to the report, and stop the loop. - Reason: every dimension is swept, the depth ledger is complete, and the last iteration added no new finding. - Rotation status: correctness, security, traceability, maintainability and cross-reference complete. - Blocked/productive carry-forward: productive — the re-read confirmed all seven findings against HEAD. - Required evidence: a stop decision from the convergence script and a complete synthesis record.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `goal.md` (durable directive and seven completion criteria), `spec.md` (phase parent), the 14 child phase folders `001-research` .. `014-fix-deep-review-findings`, and the shipped surfaces the phases name: `.skilled/skills/mcp-browser-use/**`, `.skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,README.md}`, `.skilled/bin/lib/compiled-routing/**`, `.skilled/skills/system-skill-advisor/**`, `.skilled/bin/tests/**`, `.utcp_config.json`.
- Behavior claims to verify: the three-mode hub registry; the six unchanged `mcp-tooling` modes; both advisor stages reach every mode; the parent-skill checker exits 0; each mode has a playbook with a recorded run; `validate.sh --strict --recursive` passes.
- Reuse and conventions: phase-parent spec discipline (`spec.md` only at parent level), goal-bound phases, `MACHINE-OWNED` strategy anchors, reducer-owned registry.
- Review risks and gaps: the packet's own docs are the claim surface, so prose can be stale against shipped code; the packet carries prior review archives (`review-archive/`) that predate the 014 fixes; `resource-map.md` is absent, so the coverage gate is skipped.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | Parent criteria 1, 2, 3, 5 and 6 verified directly; 4 and 7 rest on packet-recorded command results this read-only lineage must not rerun |
| `checklist_evidence` | core | pass | 3 | Sampled 014 rows verified against the tree; two AC evidence sentences are overstated (P2 x2) |
| `skill_agent` | overlay | notApplicable | 3 | No agent definition references the hub or its modes |
| `agent_cross_runtime` | overlay | pending | - | [details] |
| `feature_catalog_code` | overlay | pending | - | [details] |
| `playbook_capability` | overlay | pass | 3 | Three playbook roots exist with recorded runs, and the one FAIL is disclosed |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [507 scope files in `review-scope-files.txt`; per-file coverage recorded per iteration] | [-] | [-] | [-] | [pending] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-pi-1-1795504079797-ay97sx, parentSessionId=2026-11-24T07:07:48.877Z, generation=3, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T07:09:59.681Z
<!-- MACHINE-OWNED: END -->

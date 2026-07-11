---
name: deep-alignment
description: "Autonomous structured conformance-review loop: audits artifacts against a named standard authority's own creation rules across resolved lanes, with verify-first findings, known-deviation suppression, and a read-only default."
allowed-tools: [Read, Grep, Glob, Task, Bash, memory_context, memory_search, code_graph_query]
argument-hint: "[target] [authority] [:auto|:confirm] [--lane-config <file.json>] [--max-iterations=N] [--convergence=N]"
version: 1.0.0.0
---
<!-- Note: read-only by default -- no Write/Edit in the default surface. Task/Bash are present but reserved for the gated, opt-in remediation pass; loop-owned state writes route through shared runtime scripts, not direct file edits. No WebFetch: alignment checks local artifacts against local authority standards. -->

<!-- Keywords: deep-alignment, alignment-lane, conformance-review, standard-authority, verify-first, known-deviation-suppression, read-only-default, gated-remediation, structured-scoping, artifact-conformance -->

# Autonomous Deep Alignment Loop

Structured conformance-review loop that checks artifacts against a named standard authority's own creation rules, not general code correctness. Each run resolves one or more alignment lanes (a standard authority, an artifact class, and a scope), audits the artifacts in each lane against that authority's own templates and standards, and reports findings that have been re-verified against live ground truth before being asserted.

## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Checking whether docs, code, configs, or git history in a scope follow a named authority's own creation standards, not general correctness
- Auditing multiple authorities in one run (for example sk-doc and sk-git and sk-design conformance together)
- Verifying a claimed "shipped to standard" state against live reality before trusting it
- Unattended or headless conformance sweeps across a repo or a spec folder

### When NOT to Use

- General code or doc correctness review with no specific named authority in mind (use `deep-review`)
- Checking hub structure such as folders, registries, or routing wiring rather than artifact content (use `parent-skill-check.cjs`)
- A single, already-known fix (go directly to implementation)
- A quick one-file check (use direct Grep/Read against the authority's own standards doc)

**Boundary**: `deep-alignment` is not `parent-skill-check.cjs` -- that script checks hub structure (folders, registries, routing wiring), not artifact content. `deep-alignment` is not `deep-review` -- that mode audits general code and doc correctness across arbitrary dimensions. `deep-alignment` audits artifact content conformance against one specific, named authority's own templates and creation standards.

### FORBIDDEN INVOCATION PATTERNS

This skill is invoked EXCLUSIVELY through the `/deep:alignment` command. The command's YAML workflow owns state, dispatch, and convergence, mirroring every other mode in this hub.

**NEVER:**
- Write a custom bash/shell dispatcher to parallelize lanes or iterations
- Invoke cli-opencode / cli-claude-code directly in a loop to simulate iterations
- Dispatch the `@deep-alignment` LEAF agent via the Task tool for iteration loops (the agent is LEAF, a single iteration, and MUST be driven by the command's workflow)
- Skip the state machine or write ad-hoc state outside the bound spec folder's `alignment/` subdirectory
- Run the gated remediation pass without an explicit, separate operator opt-in

**ALWAYS:**
- Invoke via `/deep:alignment :auto` or `/deep:alignment :confirm`
- Resolve lanes first (authority x artifact-class x scope) before any artifact is discovered
- Re-verify every finding against live ground truth before it is asserted
- Default to read-only; treat remediation as a separate, gated, opt-in pass

### Trigger Phrases

- "alignment lane" / "alignment conformance audit"
- "conformance review" / "standard authority check"
- "deep alignment" / "deep-alignment"
- "check against sk-doc/sk-git/sk-design/sk-code standards"
- "structured scoping review"

### Keyword Triggers

`deep alignment`, `alignment lane`, `conformance review`, `standard authority check`, `known-deviation suppression`, `verify-first`, `structured scoping`, `artifact conformance`

---

## 2. HOW IT WORKS

### Architecture

Each run resolves to one or more alignment lanes, one lane per (standard authority x artifact class x scope) combination the operator names, either through an interactive three-axis question or a non-interactive lane-config file for headless invocation. A per-authority adapter separates "find the artifacts" from "find the standard" from "check the artifact against the standard," so the loop itself never branches on which authority it is running -- new authorities register by implementing the same three methods, not by changing the loop. The loop reuses the same convergence engine other iterative modes in this hub already run on rather than forking a parallel one.

### State Machine

`INIT` resolves the bound spec folder and loop configuration. `SCOPE` resolves the run's alignment lanes. `DISCOVER` finds the artifacts each lane covers. `ITERATE` checks artifacts against their lane's standard, slice by slice, re-verifying every finding before it is recorded. `CONVERGE` evaluates coverage and stability against the same thresholds this hub's other convergence-driven modes use. `REPORT` emits one alignment report per lane. An optional `REMEDIATE` state follows only when explicitly requested and approved -- it never runs as part of the default, read-only loop.

### The Alignment Contract

Four invariants, enforced by the engine itself and not left to individual adapters to opt into:

1. **Verify-first** -- every finding that claims a drift from live reality is re-probed against the real validator, CLI, or registry before it is asserted. Pattern-matching alone is never sufficient grounds for a finding.
2. **Known-deviation suppression** -- each authority's own standard source carries a list of accepted, intentional conventions, so a real repo-wide convention is never flagged as drift.
3. **Read-only by default** -- the loop observes and reports. It never modifies an audited artifact unless remediation is explicitly requested.
4. **Gated remediation** -- fixing findings is a separate, opt-in, operator-approved pass, not an automatic follow-on. When it runs, it stays verify-first and respects this repo's existing safety discipline: scoped staging only, a worktree when the branch has diverged, and doc-only restraint when concurrent sessions are live.

---

## 3. RULES

### ALWAYS

1. Resolve lanes before discovering artifacts. Never guess a scope.
2. Re-verify a finding against live ground truth before recording it.
3. Check every finding against its lane's known-deviation list before asserting drift.
4. Keep the audited target read-only outside a gated remediation pass.
5. Emit one report per lane, not one blended report across authorities.

### NEVER

1. Assert a finding from pattern-matching alone without a live re-probe.
2. Flag an authority's own documented, intentional convention as drift.
3. Modify an audited artifact during the default read-only loop.
4. Run remediation without an explicit, separate operator opt-in.
5. Blend structural hub-health checks or general correctness review into an alignment finding. Route those to `parent-skill-check.cjs` or `deep-review` instead.

---

## 4. REFERENCES AND RELATED RESOURCES

Reference and asset documentation for lane resolution, the adapter contract, and convergence details lands under `references/` and `assets/` as each is built out. Related: `deep-review` for general-correctness iterative review sharing this hub's convergence engine, and `parent-skill-check.cjs` for the hub structural checks this mode does not duplicate.

---

## 5. INTEGRATION POINTS

This skill operates within the behavioral framework defined in the active runtime's root doc (CLAUDE.md or AGENTS.md). Skill routing follows this hub's own advisor wiring; file modifications during a run require the same spec-folder discipline as any other mutation. `/deep:alignment` is this mode's invocation point.

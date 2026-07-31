---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable -- analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Align and modernize the `/create:*` skill-authoring commands, the `/doctor` command surface, and `system-skill-advisor` index setup so creating a new skill is easy, current, and fully wired to live skill-routing -- covering guides, doctor diagnostics/repairs for skill-advisor and skill-routing subsystems, and their automation for the current reality of the skill and command system.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What is the current end-to-end path a developer follows to create a new skill via `/create:skill`/`/create:skill-parent` and `sk-create-skill`'s guides, and where does it diverge from the live skill-advisor index reality (mode-registry.json, hub-router.json, description.json/graph-metadata.json dual schemas, leaf-manifest.json)?
- [ ] Which `/doctor` routes (`skill-advisor`, related scripts under `.opencode/commands/doctor/scripts/`) diagnose or repair skill-advisor/skill-routing state, and are they complete, current, and correctly wired to the skill-creation lifecycle end to end?
- [ ] What gaps exist between `sk-create-skill`'s templates/guides/references and the actual parent-hub canon (skill-root metadata contract, mode-registry + hub-router requirements, leaf-manifest, command-metadata) that a new-skill author must satisfy today?
- [ ] Where is skill-advisor index setup (`advisor_rebuild`, `skill_graph_scan`/`validate`, hub-identity metadata) under-automated or under-documented relative to what `/create:*` and `/doctor` actually do or claim to do?
- [ ] What specific alignment/automation opportunities (new doctor checks, updated create-skill guides, tighter skill-advisor integration, missing or stale cross-references between the three surfaces) would most reduce friction and drift for creating and maintaining a skill end-to-end?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not designing a brand-new skill-authoring framework from scratch -- the goal is alignment and automation of what exists, not a rewrite.
- Not touching the compiled-routing runtime engine, guard, or sync tooling (`.opencode/bin/compiled-route-*`, `014-runtime-engine`) -- owned by this track's separate router-unification work.
- Not rewriting the skill-advisor scorer itself -- owned by `system-skill-advisor/001-scorer-saturation-root-fix` and related packets.
- Not implementing fixes during this research phase -- findings and recommendations only; implementation is a later phase.

---

## 5. STOP CONDITIONS
Convergence is disabled for this run (`antiConvergence.convergenceMode: "off"`) by explicit operator request -- the loop runs to `maxIterations` regardless of signal, so the effective stop condition is the iteration cap itself (20). Beyond that cap, an iteration should also stop early only on an unrecoverable state-file corruption or a discovered security concern (credentials/proprietary code) in the findings, per the skill's own escalation rules.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the create presentation, router, templates, doctor route, and installer together exposed a lifecycle gap rather than another isolated checker defect. (iteration 11)
- direct comparison of presentation and workflow assets exposed the exact lifecycle fields and avoided inferring parent metadata from the shared command name. (iteration 14)
- comparing the route manifest, router resolution contract, workflow phase, and live tool descriptor separated declaration, execution, and fallback concerns. (iteration 15)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the memory hook was unavailable, so no prior indexed context could be added; the checked-in packet state was sufficient for this iteration. (iteration 11)
- the memory trigger lookup was cancelled, and the hook installer cannot check a linked worktree without an explicit override; both were optional for this local evidence pass. (iteration 14)
- the memory trigger MCP lookup was cancelled, so no additional indexed context was available; the local contracts were internally consistent for this question. (iteration 15)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A single byte-identical formatter/test fixture is not supported by the current ownership model: create and parent-create have distinct presentation assets and distinct result shapes. The useful convergence point is a field vocabulary and command semantics. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: A single byte-identical formatter/test fixture is not supported by the current ownership model: create and parent-create have distinct presentation assets and distinct result shapes. The useful convergence point is a field vocabulary and command semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single byte-identical formatter/test fixture is not supported by the current ownership model: create and parent-create have distinct presentation assets and distinct result shapes. The useful convergence point is a field vocabulary and command semantics.

### Auto-running `skill_graph_scan` or `advisor_rebuild` as part of create or a read-only doctor route. The operations change derived/index state and should remain explicit operator actions. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Auto-running `skill_graph_scan` or `advisor_rebuild` as part of create or a read-only doctor route. The operations change derived/index state and should remain explicit operator actions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Auto-running `skill_graph_scan` or `advisor_rebuild` as part of create or a read-only doctor route. The operations change derived/index state and should remain explicit operator actions.

### Auto-running advisor_rebuild or skill_graph_scan as an implicit side effect of a read-only diagnostic route; this remains ruled out by prior iterations. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Auto-running advisor_rebuild or skill_graph_scan as an implicit side effect of a read-only diagnostic route; this remains ruled out by prior iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Auto-running advisor_rebuild or skill_graph_scan as an implicit side effect of a read-only diagnostic route; this remains ruled out by prior iterations.

### Making `description.json` the sole source of advisor truth. The parent-hub contract still assigns authority to the registry, router, graph metadata, and generated leaf/derived checks. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Making `description.json` the sole source of advisor truth. The parent-hub contract still assigns authority to the registry, router, graph metadata, and generated leaf/derived checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making `description.json` the sole source of advisor truth. The parent-hub contract still assigns authority to the registry, router, graph metadata, and generated leaf/derived checks.

### Requiring mode-registry.json, hub-router.json, description.json, or graph-metadata.json in every /create:skill contract assertion. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Requiring mode-registry.json, hub-router.json, description.json, or graph-metadata.json in every /create:skill contract assertion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Requiring mode-registry.json, hub-router.json, description.json, or graph-metadata.json in every /create:skill contract assertion.

### Retaining CLI-only validation as the canonical /doctor path; it leaves the route's native tool contract and workflow blind to structural graph failures. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Retaining CLI-only validation as the canonical /doctor path; it leaves the route's native tool contract and workflow blind to structural graph failures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retaining CLI-only validation as the canonical /doctor path; it leaves the route's native tool contract and workflow blind to structural graph failures.

### Treating /create:skill as covered indirectly by the parent-skill test. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating /create:skill as covered indirectly by the parent-skill test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating /create:skill as covered indirectly by the parent-skill test.

### Treating `--allow-worktree` as canonical-source selection. It only disables the installer’s safety refusal; it does not identify the authoritative checkout. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating `--allow-worktree` as canonical-source selection. It only disables the installer’s safety refusal; it does not identify the authoritative checkout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `--allow-worktree` as canonical-source selection. It only disables the installer’s safety refusal; it does not identify the authoritative checkout.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Auto-running `skill_graph_scan` or `advisor_rebuild` as part of create or a read-only doctor route. The operations change derived/index state and should remain explicit operator actions. (iteration 11)
- Making `description.json` the sole source of advisor truth. The parent-hub contract still assigns authority to the registry, router, graph metadata, and generated leaf/derived checks. (iteration 11)
- Treating `--allow-worktree` as canonical-source selection. It only disables the installer’s safety refusal; it does not identify the authoritative checkout. (iteration 11)
- A single byte-identical formatter/test fixture is not supported by the current ownership model: create and parent-create have distinct presentation assets and distinct result shapes. The useful convergence point is a field vocabulary and command semantics. (iteration 14)
- Requiring mode-registry.json, hub-router.json, description.json, or graph-metadata.json in every /create:skill contract assertion. (iteration 14)
- Treating /create:skill as covered indirectly by the parent-skill test. (iteration 14)
- Auto-running advisor_rebuild or skill_graph_scan as an implicit side effect of a read-only diagnostic route; this remains ruled out by prior iterations. (iteration 15)
- Retaining CLI-only validation as the canonical /doctor path; it leaves the route's native tool contract and workflow blind to structural graph failures. (iteration 15)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Whether `description.json` should remain a descriptive projection or become a generated/validated projection of registry and graph vocabulary. (iteration 1)
- Whether the intended contract is to auto-run trusted `skill_graph_scan` after `/create:*`, or to keep mutation operator-owned and make the handoff an explicit confirmation step. (iteration 1)
- Whether the hook drift is expected for this worktree/runtime generation or should be repaired in the separate runtime-mirror workstream. (iteration 1)
- Should `description.json` remain a descriptive parent-hub projection, or become a generated/validated projection of registry and graph vocabulary? (iteration 2)
- Should the create workflows record a runtime-mirror/index handoff result, or should this remain a separate post-create maintenance diagnostic? (iteration 2)
- Should `/doctor:runtime-mirrors` invoke the installer with a read-only worktree-aware mode, or should the installer gain a distinct `--check --allow-worktree` policy documented as safe only for comparison? (iteration 2)
- Should new skill creation auto-run trusted `skill_graph_scan`, or retain operator-owned mutation with an explicit confirmation handoff? (iteration 2)
- Which checkout is the canonical source when a developer has several linked worktrees, and how should the doctor surface that choice before offering a global install? (iteration 2)
- Should the installer add a separate `--check --allow-worktree` policy or should the doctor resolve and pass the primary/selected `--repo` explicitly, leaving `--allow-worktree` unavailable to mutation paths? (iteration 3)
- What exact operator-facing source-selection syntax should the runtime-mirror route expose while preserving its current read-only default? (iteration 3)
- If route-wide source selection is desired later, which shared root option should be added to the runtime-mirror, Codex generator, roster, and Pi checkers without changing their no-argument read-only behavior? (iteration 4)
- Should the route auto-select the Git primary checkout for the Codex-hook checker when invoked from a linked worktree, or require the operator to provide --repo after showing the detected primary path? (iteration 4)
- Whether post-create skill workflows should emit the same canonical-checkout/index handoff information when they leave advisor rebuild operator-owned. (iteration 5)
- Whether the same shared `--repo` option should be added to all runtime-mirror checkers or only threaded into the Codex-hook checker first. (iteration 5)
- Whether `description.json` should remain a descriptive parent-hub projection or be validated against registry and graph vocabulary. (iteration 5)
- Should `/create:skill-parent` and `/doctor:skill-advisor` emit a single post-create handoff showing the three metadata owners and the operator-owned `skill_graph_scan`/`advisor_rebuild` steps? (iteration 6)
- Should the doctor add a non-blocking warning for graph-shaped keys such as `domains` or `intent_signals` appearing in `description.json`, while preserving hub-specific descriptive extensions? (iteration 6)
- Whether the runtime-mirror route should propagate the explicit `--repo` source-selection option beyond the Codex-hook checker remains open from iteration 5. (iteration 6)
- Should the default hook check auto-select the Git primary checkout, with an explicit `--repo` override for an operator-selected checkout, while leaving all repair commands operator-owned? (iteration 7)
- Should the route’s `--repo` be named as a hook-source selector or eventually become a shared repository-root selector after the checker APIs are unified? (iteration 7)
- Should the missing Pi checker invocations be restored before any route-level source-selection work is implemented? (iteration 7)
- After Pi invocations are restored, should source selection remain a Codex-hook-only option or be generalized through a common checker API? (iteration 8)
- Should route/asset checker-set parity become a doctor-route validation invariant, a dedicated test, or both? (iteration 8)
- Should the route present the linked-worktree primary-checkout path as an explicit source-selection diagnostic before any repair command is offered? (iteration 8)
- After Pi parity is restored, should the source-selection contract stay Codex-hook-specific or be generalized across all mirror checkers through a common checker API? (iteration 9)
- Should the read-only route automatically select the Git primary checkout for the hook check, or show it and require an explicit `--repo` confirmation? This remains separate from whether repair commands require approval. (iteration 9)
- Whether the route/asset checker-set mismatch, including the Pi invocations, should be repaired before the source-selection change is implemented; iteration 8 already identified this as an ordering constraint. (iteration 10)
- Whether the route-level selector should be named `--repo` or a more narrowly scoped `--hook-source` before it is eventually generalized. (iteration 10)
- How `/create:skill-parent` and `/doctor:skill-advisor` should expose the same canonical-checkout/index handoff while leaving advisor rebuild and graph scan mutations operator-owned. (iteration 10)
- Should the shared handoff be implemented as a reusable doctor/create formatter, or as duplicated presentation fields with a contract test? (iteration 11)
- Should doctor warn when `description.json` vocabulary diverges from registry/graph vocabulary, or only report the existing structural checks? (iteration 11)
- Which exact `skill_graph_validate`/`skill_graph_scan` and `advisor_rebuild` CLI forms should the operator-facing handoff print for a newly created parent? (iteration 11)
- Should `doctor:skill-advisor` add `skill_graph_validate` to its route metadata, or should the route keep validation CLI-only while its MCP allowlist remains mutation-focused? (iteration 12)
- Should the doctor warn on `description.json` vocabulary divergence from registry/graph vocabulary, or only report the existing structural checks? (iteration 12)
- Should the shared handoff be implemented as one reusable formatter consumed by create and doctor, or as duplicated presentation fields guarded by a contract test? (iteration 12)
- Should /doctor:skill-advisor add mcp__mk_skill_advisor__skill_graph_validate to _routes.yaml, or remain CLI-only while the route’s MCP declaration stays focused on its existing workflow? (iteration 13)
- Should the parent-skill doctor emit a non-blocking warning for description.json vocabulary divergence, or keep its current structural-only projection guard? (iteration 13)
- Should the contract test cover /create:skill as well as /create:skill-parent, given the standalone create path has a separate memory/indexing presentation? (iteration 13)
- Whether the eventual test should include all four standalone operations or only the full-create/full-update branches; the presentation is unified, but reference-only and asset-only have different validation targets. (iteration 14)
- Whether description.json should remain descriptive metadata rather than a vocabulary-validated projection. (iteration 14)
- Whether the doctor-side route should expose skill_graph_validate through route metadata or retain a CLI-only validation handoff. (iteration 14)
- Should route-contract tests assert tool-set completeness against the live advisor tool registry, or only assert the selected high-value tools and workflow handoff? (iteration 15)
- What exact output fields and failure policy should the doctor presentation use for skill_graph_validate alongside graph_scan_report and advisor test results? (iteration 15)
- Should the route contract test compare the declared doctor tool set against the live advisor tool registry, or pin only the selected graph-validation and refresh tools? (iteration 16)
- Should the shared create/doctor handoff vocabulary be extracted into a small static contract fixture, given the two surfaces have separate presentation owners? (iteration 16)
- Should `description.json` remain a descriptive parent-hub projection rather than participating in graph-vocabulary validation? (iteration 16)
- Whether the route contract test should pin the selected graph-validation/refresh tools or compare the declaration with the live advisor tool registry. (iteration 17)
- Whether create and doctor should share a small field-vocabulary fixture for their operator-facing index handoff while retaining separate result adapters. (iteration 17)
- Which exact post-create handoff wording should identify `description.json`, `graph-metadata.json`, `leaf-manifest.json`, and the operator-owned `skill_graph_scan`/`advisor_rebuild` steps. (iteration 17)
- Should parent create invoke the scoped `generate-leaf-manifest.cjs --write <skillDir>` directly, or invoke the fleet root-metadata gate with `--fix` and then select the created hub's result? (iteration 18)
- Should the route update and the handoff presentation be covered by one route-contract test or by separate route-tool and output-semantics tests? (iteration 18)
- Where should the shared vocabulary contract live, and which create branches need the handoff: parent full-create/full-update only, or standalone full-create/full-update as well? (iteration 18)
- What exact narrow check should doc-only branches use to detect a routed-leaf change without importing the full H/S handoff? (iteration 19)
- Should the canonical contract be a Markdown reference plus a small machine-readable fixture, or should one machine-readable fixture be the source and the Markdown explain it? (iteration 19)
- Should the doctor route/tool-set test and the shared output-semantics test remain separate? The evidence strongly favors separate tests, but the final implementation can still place them in one test file if ownership remains explicit. (iteration 19)
- Should parent generation invoke the scoped `generate-leaf-manifest.cjs --write <skillDir>` directly or rely on `ci-skill-root-metadata.cjs --fix` and select the created hub's result? (iteration 19)
- Implementation must choose whether to add a target-scoped class-gate option or to keep the class gate fleet-wide and run it only read-only after direct manifest generation. The evidence favors the latter for the smallest blast radius. (iteration 20)
- The route update still needs an explicit decision on whether `skill_graph_validate` is exposed through `_routes.yaml`/router frontmatter or retained as a CLI-only handoff. The live tool registry proves the current omission is real. (iteration 20)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
The route update still needs an explicit decision on whether `skill_graph_validate` is exposed through `_routes.yaml`/router frontmatter or retained as a CLI-only handoff. The live tool registry proves the current omission is real.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
No prior research packet targets this exact scope (create/doctor/skill-advisor alignment) in this track; this is a fresh research pass.

### Bounded Context Snapshot

- Source pointers:
  - `.opencode/commands/create/{skill.md, skill-parent.md, command.md, agent.md, diff.md, benchmark.md}` -- the `/create:*` command family
  - `.opencode/commands/doctor/{_routes.yaml, speckit.md, update.md, mcp.md, scripts/}` -- the `/doctor` router and its scripts
  - `.opencode/skills/sk-doc/sk-create-skill/{SKILL.md, references/, scripts/, assets/}` -- skill-authoring guides and templates, including the parent-hub canon references (`references/parent-skill/parent-skills-nested-packets.md`, `references/shared/skill-root-metadata-contract.md`)
  - `.opencode/skills/system-skill-advisor/{SKILL.md, ARCHITECTURE.md, mcp-server/, scripts/, hooks/, references/, leaf-manifest.json, leaf-manifest.config.json, leaf-aliases.json}` -- the skill-advisor hub itself, its MCP server, and index setup
- Reuse candidates: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs <hub-dir>`, `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`, `advisor_rebuild`/`skill_graph_scan`/`skill_graph_validate` MCP tools
- Integration points: mode-registry.json + hub-router.json pairs per hub, `description.json`/`graph-metadata.json` dual schemas (spec-folder vs skill-advisor), `leaf-manifest.json` per hub
- Constraints and risks: this track's own compiled-routing engine/guard/sync tooling is explicitly out of scope; the skill-advisor scorer's internal ranking logic is owned elsewhere

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20
- Convergence threshold: 0.05 (informational only -- convergence forced off for this run)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-07-30T18:23:52.000Z

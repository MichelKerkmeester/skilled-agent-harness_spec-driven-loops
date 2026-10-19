
# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
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
How should Skilled treat the sk-code surfaces for external repository users? The v4.0.0.4 release note entry "One Surface Order Everywhere" (.skilled/changelog/skilled/v4.0.0.4.md) says every sk-code file that ranks the code surfaces lists OpenCode, then Obsidian, then Webflow; a prompt matching two surfaces lists them in that order; on a keyword tie the session's current surface can lead via `compiled-route.cjs --surface-hint`. The operator says this is wrong for external users: sk-code-obsidian and sk-code-webflow are the operator's personal surfaces and serve only as examples, which an external user deletes and replaces with an sk-code surface for their own project, so the doctor and everything else in Skilled should assume they are gone. sk-code-skilled is the one native surface and, for users other than the operator, should have the LOWEST priority: a user's own non-native surface outranks it. sk-code-review, sk-code-quality and the shared/ layer are stack-agnostic and serve every user. Answer with path:line or command evidence: (1) every place that encodes the surface order or treats obsidian or webflow as installed: sk-code hub-router.json tieBreak, mode-registry.json, SKILL.md, ROUTER.md, shared/references (stack-detection.md), the compiled-routing manifest and runtime (.skilled/bin/compiled-route.cjs, .skilled/bin/lib/compiled-routing/), canary fixtures, the skill advisor (graph metadata, scorer boosts, batteries), the doctor commands and checks (.skilled/commands/doctor/), install guides, READMEs and the v4.0.0.4 note; (2) what breaks today when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy outside the worktree (doctor checks, compiled-route-guard, route sync, canaries, advisor, package and parent-skill checks), and what happens when they add their own surface packet; (3) how a user-added surface should outrank sk-code-skilled: a priority or rank field in mode-registry.json, a native or fallback flag on opencode, a tieBreak derived when the manifest is minted, the --surface-hint path, or something else, compared on cost and risk with one recommendation; (4) how the operator's own repository keeps its current order with obsidian and webflow present while the shipped default assumes they are gone: configuration versus data, example versus shipped; (5) doctor and documentation changes that tell external users obsidian and webflow are examples to delete or replace, and how to scaffold their own surface (sk-doc create-skill, parent-skill mode packets); (6) ideas to reject, with reasons. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the cheaper move and why it fails.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Where is the surface order (opencode, obsidian, webflow) encoded, and where are sk-code-obsidian and sk-code-webflow treated as installed?
- [x] Q2: What breaks when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy, and what happens when they add their own surface?
- [x] Q3: How should a user-added surface outrank sk-code-skilled (registry priority field, native or fallback flag, tieBreak derived at mint time, --surface-hint, other), and which option is cheapest at acceptable risk?
- [x] Q4: How does the operator repository keep its current order while the shipped default assumes the examples are gone (configuration versus data, example versus shipped)?
- [x] Q5: Which doctor and documentation changes tell external users the two surfaces are examples, and how do they scaffold their own surface?
- [x] Q6: Which ideas should be rejected, and why?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Changing any skill, script, command, README or release note; deleting anything inside the worktree; building the recommendation.

---

## 5. STOP CONDITIONS
Stop policy is max-iterations: all 10 iterations run. An unavailable executor or a usage limit stops the lineage with no substitute.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Where is the surface order (opencode, obsidian, webflow) encoded, and where are sk-code-obsidian and sk-code-webflow treated as installed?
- Q2: What breaks when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy, and what happens when they add their own surface?
- Q3: How should a user-added surface outrank sk-code-skilled (registry priority field, native or fallback flag, tieBreak derived at mint time, --surface-hint, other), and which option is cheapest at acceptable risk?
- Q4: How does the operator repository keep its current order while the shipped default assumes the examples are gone (configuration versus data, example versus shipped)?
- Q5: Which doctor and documentation changes tell external users the two surfaces are examples, and how do they scaffold their own surface?
- Q6: Which ideas should be rejected, and why?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- targeted repository search located the explicit tie-break and all three packet registrations, while the source reads separated runtime precedence from display inventories. (iteration 1)
- reading compiler input and output paths showed that the tie-break is authored hub data copied into the compiled model. Reading the resolver, hint helper and canary assertions separated persistent precedence from a temporary session hint. (iteration 2)
- the throwaway copy separated metadata freshness from physical packet presence. Doctor and compiled route exposed hard validation failures and a successful-but-invalid route. (iteration 3)
- direct route invocations after deleting the leaves exposed a false-green freshness check and successful routes to absent packet ids. (iteration 4)
- leaf-manifest generation confirmed the packet inventory can be regenerated from the registry; doctor and canaries exposed separate hand-maintained integration surfaces. (iteration 5)
- reading the compiled router and doctor together showed the same authored list drives runtime ordering and an existing completeness gate; this grounds the recommendation in a real caller and contract. (iteration 6)
- reading the command asset beside the parent-skill contract exposed a usable scaffold path that can be linked directly, without inventing a new workflow. (iteration 8)
- comparing the router, compiler and doctor showed that one authored tieBreak already acts as persistent priority, so the alternatives add policy without closing an observed gap. (iteration 9)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- this focus did not test missing-packet behavior. That experiment belongs to Q2 and requires the external throwaway copy. (iteration 1)
- source inspection cannot establish runtime failures after packet deletion. That requires the Q2 copy experiment. (iteration 2)
- route-sync could not test deletion behavior because the prescribed copy omits specs/, including an authored resolver. Adding an empty specs/ exposed the missing resolver but did not repair the experiment boundary. (iteration 3)
- route-sync resolves the missing `specs/` path before testing deletion behavior; the approved copy recipe excludes it. The first output filter also hid the full advisor recommendation, so only its `status=ok` result is retained. (iteration 4)
- mint refuses an existing activation manifest; broad Webflow-map substitution pointed MyApp routing at files the minimal packet does not contain. (iteration 5)
- a registry-only reading would miss that --surface-hint is a post-route reorder, not a precedence input. (iteration 6)
- the doctor checks identify stale structure but do not provide the user-facing replacement steps; this pass did not test code changes. (iteration 8)
- the actual publisher could not be identified from the inspected /doctor:update paths, so the external starter split remains a recommendation rather than a confirmed shipped mechanism. (iteration 9)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### --surface-hint as the project default: it is conditional on each caller passing a matched surface hint. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: --surface-hint as the project default: it is conditional on each caller passing a matched surface hint.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: --surface-hint as the project default: it is conditional on each caller passing a matched surface hint.

### `compiled-route-sync.cjs --check` is an executable deletion probe under the required copy recipe: it stops before validation because `specs/` is absent. This limitation was seen previously and is not retried with a different copy shape. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `compiled-route-sync.cjs --check` is an executable deletion probe under the required copy recipe: it stops before validation because `specs/` is absent. This limitation was seen previously and is not retried with a different copy shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `compiled-route-sync.cjs --check` is an executable deletion probe under the required copy recipe: it stops before validation because `specs/` is absent. This limitation was seen previously and is not retried with a different copy shape.

### A native/fallback sort flag: one flag cannot order multiple custom surfaces, while the list already can. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A native/fallback sort flag: one flag cannot order multiple custom surfaces, while the list already can.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A native/fallback sort flag: one flag cannot order multiple custom surfaces, while the list already can.

### A new surface-scaffolding command or separate installer guide: the existing parent-skill workflow already creates surface packets. A new entry point would duplicate its contract. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A new surface-scaffolding command or separate installer guide: the existing parent-skill workflow already creates surface packets. A new entry point would duplicate its contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new surface-scaffolding command or separate installer guide: the existing parent-skill workflow already creates surface packets. A new entry point would duplicate its contract.

### A priority/rank field: the existing ordered list expresses the requirement without another schema and ordering source. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A priority/rank field: the existing ordered list expresses the requirement without another schema and ordering source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A priority/rank field: the existing ordered list expresses the requirement without another schema and ordering source.

### A README-only clarification: the hub SKILL.md is the canonical surface inventory and the doctor still needs actionable repair text. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A README-only clarification: the hub SKILL.md is the canonical surface inventory and the doctor still needs actionable repair text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A README-only clarification: the hub SKILL.md is the canonical surface inventory and the doctor still needs actionable repair text.

### Adding only a new directory is sufficient for routing: the custom prompt returned `action=defer` with no targets. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Adding only a new directory is sufficient for routing: the custom prompt returned `action=defer` with no targets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding only a new directory is sufficient for routing: the custom prompt returned `action=defer` with no targets.

### Deriving order from registry-array position: the registry does not currently define that position as precedence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Deriving order from registry-array position: the registry does not currently define that position as precedence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deriving order from registry-array position: the registry does not currently define that position as precedence.

### No claim is made about deletion failures. The authorized throwaway-copy experiment is deferred to the Q2 focus. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No claim is made about deletion failures. The authorized throwaway-copy experiment is deferred to the Q2 focus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No claim is made about deletion failures. The authorized throwaway-copy experiment is deferred to the Q2 focus.

### No implementation or canary test execution was attempted. This pass read the canary fixtures and tests to identify their encoded expectations. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No implementation or canary test execution was attempted. This pass read the canary fixtures and tests to identify their encoded expectations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No implementation or canary test execution was attempted. This pass read the canary fixtures and tests to identify their encoded expectations.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- No claim is made about deletion failures. The authorized throwaway-copy experiment is deferred to the Q2 focus. (iteration 2)
- No implementation or canary test execution was attempted. This pass read the canary fixtures and tests to identify their encoded expectations. (iteration 2)
- `compiled-route-sync.cjs --check` is an executable deletion probe under the required copy recipe: it stops before validation because `specs/` is absent. This limitation was seen previously and is not retried with a different copy shape. (iteration 4)
- Adding only a new directory is sufficient for routing: the custom prompt returned `action=defer` with no targets. (iteration 4)
- --surface-hint as the project default: it is conditional on each caller passing a matched surface hint. (iteration 6)
- A native/fallback sort flag: one flag cannot order multiple custom surfaces, while the list already can. (iteration 6)
- A priority/rank field: the existing ordered list expresses the requirement without another schema and ordering source. (iteration 6)
- Deriving order from registry-array position: the registry does not currently define that position as precedence. (iteration 6)
- A new surface-scaffolding command or separate installer guide: the existing parent-skill workflow already creates surface packets. A new entry point would duplicate its contract. (iteration 8)
- A README-only clarification: the hub SKILL.md is the canonical surface inventory and the doctor still needs actionable repair text. (iteration 8)

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
- Q2 through Q6 remain open. (iteration 1)
- Q1 remains open for compiled routing, canary fixtures, advisor scoring and batteries, doctor checks, install guides, the release note, and runtime behavior when packets are absent. (iteration 1)
- Q1 remains open for the advisor, doctor, install guides, release note and runtime behavior when packets are absent. (iteration 2)
- Q1 remains open for a complete occurrence inventory across advisor batteries, all doctor commands, CI/hooks, and install docs. (iteration 3)
- Q6 remains open for a full rejected-ideas pass. (iteration 3)
- Q4 remains open: the operator repository can retain its current explicit order as local registry/router data, while an external starter omits example registrations. No packaging mechanism was found in this pass that proves how those configurations are separated. (iteration 3)
- Q5 remains open for a concrete doc/doctor plan. Onboarding should call Obsidian/Webflow examples and say replacement means updating packet registration, router resources/signals, tieBreak and leaf manifest together. (iteration 3)
- Q3 remains open. Provisional recommendation: retain explicit hub-router.json tieBreak as the single precedence source; when registering a custom surface, place it before OpenCode in the same exact permutation. This is the smallest move because the doctor already validates that list. A rank field or surface-hint policy adds machinery without evidence that editing the existing list is inadequate. (iteration 3)
- Q3: compare tieBreak, priority/rank, native/fallback and surface-hint policies for a user-added surface. (iteration 4)
- Q4: establish how shipped starter data can omit examples while the operator repository retains its registrations. (iteration 4)
- Q6: reject overbuilt alternatives with a concrete cheaper move and failure evidence. (iteration 4)
- Q1: complete occurrence inventory across the advisor, doctor checks, install guides, release note and runtime. (iteration 4)
- Q5: specify doctor messaging, delete-or-replace guidance and the supported surface-scaffolding path. (iteration 4)
- Q1: complete order and presence inventory. (iteration 5)
- Q4: prove the boundary between operator-local registrations and shipped defaults. (iteration 5)
- Q5: finish doctor and onboarding guidance for replacement and scaffolding. (iteration 5)
- Q3: finish policy comparison after a fully integrated packet passes checks. (iteration 5)
- Q6: complete the rejected-ideas pass. (iteration 5)
- Q1: complete the order and installed-presence inventory across advisor, doctor, install guides and documentation. (iteration 6)
- Q4: verify how operator-local registrations stay separate from a shipped starter that omits example surfaces. (iteration 6)
- Q5: specify doctor and onboarding wording, including the supported surface-scaffolding path. (iteration 6)
- Follow-up: inspect the publish/install workflow to confirm whether it selects a starter configuration outside /doctor:update. (iteration 7)
- Q5: doctor/onboarding guidance for example replacement and surface scaffolding. (iteration 7)
- Q1: complete order/presence inventory across advisor, doctor, install guides, canaries, runtime, and release notes. (iteration 7)
- Q6: full rejected-ideas pass across the research topic. (iteration 7)
- Follow-up: the repository evidence does not establish whether a separate publisher ships a different example-free starter; iteration 7 left that boundary open. (iteration 8)
- Q6: complete the rejected-ideas pass across the whole research topic. (iteration 8)
- Q1: complete the order and installed-presence inventory across advisor, doctor, install guides, canaries, runtime, and release notes. (iteration 8)
- Follow-up: locate and inspect the actual external publisher. The checked-in /doctor:update path groups the hub as one unit, but does not establish what another publisher ships. (iteration 9)
- Q1: Complete the remaining occurrence inventory across advisor scoring and batteries, doctor checks, install guidance, canaries, compiled routing and release notes. (iteration 9)
- Actual external publisher and whether it selects a different starter remain UNKNOWN. /doctor:update unit grouping does not prove what is shipped. (iteration 10)
- Q2–Q6 were answered in prior iterations; this recheck did not overturn the conclusions. Route-sync remains unproven because the required resolver is excluded by the authorized copy recipe. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work: the v4.0.0.4 release note section "One Surface Order Everywhere"; the session-aware tie-break built in specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation; routing parity work in 021-open-ends-remediation. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-12T16:28:06.444Z

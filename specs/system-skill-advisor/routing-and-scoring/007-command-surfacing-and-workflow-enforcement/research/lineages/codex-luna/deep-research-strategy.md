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
How should the skill advisor surface slash commands (all 45 under .skilled/commands, not only /doctor) so a model either runs the matching command workflow by itself or asks the user first, and how does a request typed as plain chat with no slash command still reach the proper command workflow on every runtime? Work through ten research angles: inventory, scoring, output contract, run or ask, invocation mechanics, chat-only users, skill and command linkage, measurement, prior art, and failure modes.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which one canonical inventory reconciles command metadata, active bridge allow-list rows and doctor routing declarations for all 45 slash commands?
- [ ] How should command intent and skill intent combine so plain planning and research prompts reach the matching workflow with acceptable recall and precision?
- [ ] What should a command recommendation show, and which commands can the model invoke directly versus asking first?
- [ ] How does a plain chat request reach the appropriate command workflow across supported runtimes, and how should skills link to command front doors?
- [ ] What benchmark evidence, prior art and failure controls should validate the design?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Implementation of any advisor, hook, command or AGENTS.md change; changes to skill-to-skill scoring; repair of the Pi extension loading issue owned by its separate packet.

---

## 5. STOP CONDITIONS
Run exactly 10 iterations. Convergence is telemetry only. Stop after iteration 10 with stopReason maxIterationsReached. Do not write outside this lineage.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- comparing command names and bridge names in both directions exposed missing command identifiers and stale aliases; checking the root command file resolved the apparent 44-versus-45 discrepancy. (iteration 1)
- Bounded source reads exposed the actual ordering adjustment, eligibility helper and AGENTS action thresholds; this separates ranking facts from workflow policy. (iteration 2)
- Reading both the renderer and its tests exposed the exact user-visible string, token cap behavior and the special-case doctor mapping; hook and AGENTS sources revealed the advice/action tension. (iteration 3)
- Comparing two command families with an explicit target gate and the shared reversibility rules showed that command selection, startup input, and effect approval are distinct decisions. (iteration 4)
- Comparing the adapter table, DSH source, runtime enum and registration-path test exposed a real documentation mismatch and separated a runtime label from an active adapter. (iteration 5)
- Reading the hook, explicit lane, generated bridge example and compatibility guide established the full plain-language path and a concrete Python fallback exception. (iteration 6)
- Comparing command-metadata source entries with derived bridge rows showed which workflow detail survives into the scorer and which does not. (iteration 7)
- Comparing the scorer's gold fields, its actual metric functions, the ambiguity-slice generator and runtime test assertions exposed the gap between skill selection and command execution evidence. (iteration 8)
- Comparing official skill metadata and command-picker documentation with local hook and gate contracts separated workflow discovery, host invocation and permission to act. (iteration 9)
- Comparing test assertions with renderer implementation and loop contracts exposed the difference between an existing protective mechanism and a release gate that proves the user-visible outcome. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the filtered rg inventory omitted the root-level file, while an unfiltered recursive listing mixed command files with doctor test fixtures. Direct root and group enumeration was needed; the cause of rg's omission was not verified. (iteration 1)
- The first state path included an extra research/ directory and the initial broad grep returned excessive context; correcting to the lineage-root files and narrowing to exact line windows resolved both. (iteration 2)
- The existing renderer's label abstraction makes most commands display through a generic skill label; it does not reveal a complete command contract outside doctor. (iteration 3)
- A generic command count or advisor confidence cannot reveal per-workflow mode defaults or side effects; those live in the individual command routers and their rule owners. (iteration 4)
- The first per-runtime table and a validation playbook disagree on Copilot, so that playbook cannot be treated as authoritative for current registration without checking source paths. (iteration 5)
- The generated bridge counts are not command-file coverage counts; aliases and multi-target routes make row totals insufficient to prove that each command matches chat language. (iteration 6)
- Ownership is split between three input families, and a bridge can name both a parent skill and a leaf workflow; a single id cannot express that relationship safely. (iteration 7)
- The old doctor benchmark gives a useful structural precedent but is scoped to a route family, so it cannot establish all-command acceptance thresholds. (iteration 8)
- Vendor documentation describes its own command picker or skill activation; none offers a portable invocation API across this repository’s runtime set. (iteration 9)
- Existing positive replay tests and token-cap tests are split across layers, so neither proves end-to-end command selection plus safe action. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Adding a static table of all commands to every fallback; the prior packet rejected universal route guidance in the fallback. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Adding a static table of all commands to every fallback; the prior packet rejected universal route guidance in the fallback.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a static table of all commands to every fallback; the prior packet rejected universal route guidance in the fallback.

### Adding a static table of all commands to every fallback; the reducer marks this direction BLOCKED because prior work rejected universal route guidance in the fallback. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-127] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Adding a static table of all commands to every fallback; the reducer marks this direction BLOCKED because prior work rejected universal route guidance in the fallback. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-127]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a static table of all commands to every fallback; the reducer marks this direction BLOCKED because prior work rejected universal route guidance in the fallback. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-127]

### Allowing a one-iteration child to restart the parent loop or recursively call its own executor. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Allowing a one-iteration child to restart the parent loop or recursively call its own executor.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Allowing a one-iteration child to restart the parent loop or recursively call its own executor.

### Assuming every runtime can invoke slash commands from model context; the reducer marks this direction BLOCKED because DSH uses prompt stubs and has no command loader. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:129-132] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Assuming every runtime can invoke slash commands from model context; the reducer marks this direction BLOCKED because DSH uses prompt stubs and has no command loader. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:129-132]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming every runtime can invoke slash commands from model context; the reducer marks this direction BLOCKED because DSH uses prompt stubs and has no command loader. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:129-132]

### Assuming every runtime has an API to invoke slash commands from model context; DSH has no command loader and dispatches prompt stubs as task text. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Assuming every runtime has an API to invoke slash commands from model context; DSH has no command loader and dispatches prompt stubs as task text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming every runtime has an API to invoke slash commands from model context; DSH has no command loader and dispatches prompt stubs as task text.

### Assuming TypeScript and Python doctor matching are equivalent for chat-only requests; the bridge documentation says Python's doctor match requires a typed slash command. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Assuming TypeScript and Python doctor matching are equivalent for chat-only requests; the bridge documentation says Python's doctor match requires a typed slash command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming TypeScript and Python doctor matching are equivalent for chat-only requests; the bridge documentation says Python's doctor match requires a typed slash command.

### Copying doctor-specific thresholds unchanged across all command families. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Copying doctor-specific thresholds unchanged across all command families.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying doctor-specific thresholds unchanged across all command families.

### Counting only the top-level doctor route command fields misses the /doctor:mcp subroutes that the deriver adds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting only the top-level doctor route command fields misses the /doctor:mcp subroutes that the deriver adds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting only the top-level doctor route command fields misses the /doctor:mcp subroutes that the deriver adds.

### Inferring required route targets from prior conversation or workspace state where the route contract forbids inference. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Inferring required route targets from prior conversation or workspace state where the route contract forbids inference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inferring required route targets from prior conversation or workspace state where the route contract forbids inference.

### Letting a confidence score choose :auto or :autopilot; command workflows assign these execution modes separately. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Letting a confidence score choose :auto or :autopilot; command workflows assign these execution modes separately.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Letting a confidence score choose :auto or :autopilot; command workflows assign these execution modes separately.

### Linking a command only to a parent skill without retaining its ownerMode and leaf workflow. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Linking a command only to a parent skill without retaining its ownerMode and leaf workflow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Linking a command only to a parent skill without retaining its ownerMode and leaf workflow.

### None established. Current output coverage beyond doctor routes remains to be traced through invocation mechanics and measured against real prompt contexts. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None established. Current output coverage beyond doctor routes remains to be traced through invocation mechanics and measured against real prompt contexts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None established. Current output coverage beyond doctor routes remains to be traced through invocation mechanics and measured against real prompt contexts.

### None established. Exact-name gaps and runtime-specific matching remain open; an all-command phrase coverage map is still needed. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None established. Exact-name gaps and runtime-specific matching remain open; an all-command phrase coverage map is still needed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None established. Exact-name gaps and runtime-specific matching remain open; an all-command phrase coverage map is still needed.

### None established. Existing corpora and scoring scripts are useful, but their label schema does not yet answer command-route and action questions. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: None established. Existing corpora and scoring scripts are useful, but their label schema does not yet answer command-route and action questions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None established. Existing corpora and scoring scripts are useful, but their label schema does not yet answer command-route and action questions.

### None established. Plain-chat ranking quality and cross-runtime recall remain unmeasured. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None established. Plain-chat ranking quality and cross-runtime recall remain unmeasured.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None established. Plain-chat ranking quality and cross-runtime recall remain unmeasured.

### None established. The current metadata gives a strong linkage pattern, but its source families and runtime identifiers remain split. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: None established. The current metadata gives a strong linkage pattern, but its source families and runtime identifiers remain split.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None established. The current metadata gives a strong linkage pattern, but its source families and runtime identifiers remain split.

### None established. The representative routes show that confirmation is workflow-specific; the remaining question is how each runtime loads the workflow after the advisor selects it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None established. The representative routes show that confirmation is workflow-specific; the remaining question is how each runtime loads the workflow after the advisor selects it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None established. The representative routes show that confirmation is workflow-specific; the remaining question is how each runtime loads the workflow after the advisor selects it.

### None established. The supported hook path injects route advice; direct command execution still depends on each host's native loader or explicit workflow-file loading. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: None established. The supported hook path injects route advice; direct command execution still depends on each host's native loader or explicit workflow-file loading.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None established. The supported hook path injects route advice; direct command execution still depends on each host's native loader or explicit workflow-file loading.

### None newly established. Existing code has ambiguity, leaf and max-iteration controls, but command-specific action authority and full brief-budget behavior still need explicit coverage. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: None newly established. Existing code has ambiguity, leaf and max-iteration controls, but command-specific action authority and full brief-budget behavior still need explicit coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly established. Existing code has ambiguity, leaf and max-iteration controls, but command-specific action authority and full brief-budget behavior still need explicit coverage.

### None newly established. The comparison supports a dual entry point, but it does not establish that every host can call a native slash command. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: None newly established. The comparison supports a dual entry point, but it does not establish that every host can call a native slash command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None newly established. The comparison supports a dual entry point, but it does not establish that every host can call a native slash command.

### Recursive markdown counting as a command denominator, because it includes nested test fixtures. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Recursive markdown counting as a command denominator, because it includes nested test fixtures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recursive markdown counting as a command denominator, because it includes nested test fixtures.

### Relying on the token cap to preserve every field when the command is a truncatable companion. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Relying on the token cap to preserve every field when the command is a truncatable companion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on the token cap to preserve every field when the command is a truncatable companion.

### Requiring a leading slash before command intent can be scored; bridge metadata can carry natural-language keywords and intentSignals. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Requiring a leading slash before command intent can be scored; bridge metadata can carry natural-language keywords and intentSignals.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Requiring a leading slash before command intent can be scored; bridge metadata can carry natural-language keywords and intentSignals.

### The first filtered rg listing returned 44 grouped markdown files and missed the root-level command file; direct directory enumeration and the file itself resolved the count. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The first filtered rg listing returned 44 grouped markdown files and missed the root-level command file; direct directory enumeration and the file itself resolved the count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The first filtered rg listing returned 44 grouped markdown files and missed the root-level command file; direct directory enumeration and the file itself resolved the count.

### Treating 62 bridge rows as 62 commands, because the projection includes aliases and route-target multiplicity. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating 62 bridge rows as 62 commands, because the projection includes aliases and route-target multiplicity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating 62 bridge rows as 62 commands, because the projection includes aliases and route-target multiplicity.

### Treating a legacy alias as proof that a shipped command has a bridge under its own identifier. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating a legacy alias as proof that a shipped command has a bridge under its own identifier.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a legacy alias as proof that a shipped command has a bridge under its own identifier.

### Treating a runtime enum value or stale validation example as proof that an adapter is currently registered. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating a runtime enum value or stale validation example as proof that an adapter is currently registered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a runtime enum value or stale validation example as proof that an adapter is currently registered.

### Treating a skill match as approval to execute a command; local policy separates confidence routing from artifact, write and stop-for-yes gates. [SOURCE: AGENTS.md:63-89] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating a skill match as approval to execute a command; local policy separates confidence routing from artifact, write and stop-for-yes gates. [SOURCE: AGENTS.md:63-89]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a skill match as approval to execute a command; local policy separates confidence routing from artifact, write and stop-for-yes gates. [SOURCE: AGENTS.md:63-89]

### Treating command confidence as authorization to execute. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating command confidence as authorization to execute.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating command confidence as authorization to execute.

### Treating command-file presence as proof of an eligible route; projection has explicit disabled states, and compatibility rows can diverge by runtime identity. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating command-file presence as proof of an eligible route; projection has explicit disabled states, and compatibility rows can diverge by runtime identity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating command-file presence as proof of an eligible route; projection has explicit disabled states, and compatibility rows can diverge by runtime identity.

### Treating skill top-1 accuracy as command identity or action correctness. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating skill top-1 accuracy as command identity or action correctness.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating skill top-1 accuracy as command identity or action correctness.

### Treating the generated bridge projection as the full execution recipe; source metadata holds the task-specific choreography and argument contract. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating the generated bridge projection as the full execution recipe; source metadata holds the task-specific choreography and argument contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the generated bridge projection as the full execution recipe; source metadata holds the task-specific choreography and argument contract.

### Using bridge ids as visible labels for every command; the current renderer maps runnable strings only for doctor bridges. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Using bridge ids as visible labels for every command; the current renderer maps runnable strings only for doctor bridges.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using bridge ids as visible labels for every command; the current renderer maps runnable strings only for doctor bridges.

### Using the command ranking adjustment as an authorization rule; it appears only in result ordering. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Using the command ranking adjustment as an authorization rule; it appears only in result ordering.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the command ranking adjustment as an authorization rule; it appears only in result ordering.

### Using the positive-only prompt-fire replay as the only false-trigger regression test. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Using the positive-only prompt-fire replay as the only false-trigger regression test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the positive-only prompt-fire replay as the only false-trigger regression test.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Counting only the top-level doctor route command fields misses the /doctor:mcp subroutes that the deriver adds. (iteration 1)
- Recursive markdown counting as a command denominator, because it includes nested test fixtures. (iteration 1)
- The first filtered rg listing returned 44 grouped markdown files and missed the root-level command file; direct directory enumeration and the file itself resolved the count. (iteration 1)
- Treating 62 bridge rows as 62 commands, because the projection includes aliases and route-target multiplicity. (iteration 1)
- Treating a legacy alias as proof that a shipped command has a bridge under its own identifier. (iteration 1)
- None established. Plain-chat ranking quality and cross-runtime recall remain unmeasured. (iteration 2)
- Treating command-file presence as proof of an eligible route; projection has explicit disabled states, and compatibility rows can diverge by runtime identity. (iteration 2)
- Using the command ranking adjustment as an authorization rule; it appears only in result ordering. (iteration 2)
- Adding a static table of all commands to every fallback; the prior packet rejected universal route guidance in the fallback. (iteration 3)
- None established. Current output coverage beyond doctor routes remains to be traced through invocation mechanics and measured against real prompt contexts. (iteration 3)
- Using bridge ids as visible labels for every command; the current renderer maps runnable strings only for doctor bridges. (iteration 3)
- Inferring required route targets from prior conversation or workspace state where the route contract forbids inference. (iteration 4)
- Letting a confidence score choose :auto or :autopilot; command workflows assign these execution modes separately. (iteration 4)
- None established. The representative routes show that confirmation is workflow-specific; the remaining question is how each runtime loads the workflow after the advisor selects it. (iteration 4)
- Assuming every runtime has an API to invoke slash commands from model context; DSH has no command loader and dispatches prompt stubs as task text. (iteration 5)
- None established. The supported hook path injects route advice; direct command execution still depends on each host's native loader or explicit workflow-file loading. (iteration 5)
- Treating a runtime enum value or stale validation example as proof that an adapter is currently registered. (iteration 5)
- Assuming TypeScript and Python doctor matching are equivalent for chat-only requests; the bridge documentation says Python's doctor match requires a typed slash command. (iteration 6)
- None established. Exact-name gaps and runtime-specific matching remain open; an all-command phrase coverage map is still needed. (iteration 6)
- Requiring a leading slash before command intent can be scored; bridge metadata can carry natural-language keywords and intentSignals. (iteration 6)
- Linking a command only to a parent skill without retaining its ownerMode and leaf workflow. (iteration 7)
- None established. The current metadata gives a strong linkage pattern, but its source families and runtime identifiers remain split. (iteration 7)
- Treating the generated bridge projection as the full execution recipe; source metadata holds the task-specific choreography and argument contract. (iteration 7)
- Copying doctor-specific thresholds unchanged across all command families. (iteration 8)
- None established. Existing corpora and scoring scripts are useful, but their label schema does not yet answer command-route and action questions. (iteration 8)
- Treating skill top-1 accuracy as command identity or action correctness. (iteration 8)
- Adding a static table of all commands to every fallback; the reducer marks this direction BLOCKED because prior work rejected universal route guidance in the fallback. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-127] (iteration 9)
- Assuming every runtime can invoke slash commands from model context; the reducer marks this direction BLOCKED because DSH uses prompt stubs and has no command loader. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:129-132] (iteration 9)
- None newly established. The comparison supports a dual entry point, but it does not establish that every host can call a native slash command. (iteration 9)
- Treating a skill match as approval to execute a command; local policy separates confidence routing from artifact, write and stop-for-yes gates. [SOURCE: AGENTS.md:63-89] (iteration 9)
- Allowing a one-iteration child to restart the parent loop or recursively call its own executor. (iteration 10)
- None newly established. Existing code has ambiguity, leaf and max-iteration controls, but command-specific action authority and full brief-budget behavior still need explicit coverage. (iteration 10)
- Relying on the token cap to preserve every field when the command is a truncatable companion. (iteration 10)
- Treating command confidence as authorization to execute. (iteration 10)
- Using the positive-only prompt-fire replay as the only false-trigger regression test. (iteration 10)

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
- Q2-Q5 remain open: scoring, output contract and run-or-ask policy, chat-only routing and skill linkage, benchmark/prior-art/failure controls. (iteration 1)
- Q1: Which source should own command identity, alias status and route targets when the files, metadata, allow-list and route manifest disagree? (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1: Which source should own command identity, alias status and route targets when the files, metadata, allow-list and route manifest disagree?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior packet directories and runtime evidence are named in the dispatch. The repository resource map is absent at init; no inventory exclusion set is available.

### Bounded Context Snapshot

- Source pointers: .skilled/skills/system-skill-advisor command bridges, scorer projection and fusion, render.ts; .skilled/commands and its three command-metadata hubs, bridge allow-list and doctor routes.
- Reuse candidates: AGENTS.md Gates 2 and 4; prior packets 003-doctor-command-surfacing and system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review.
- Integration points: command metadata, bridge registries, advisor scoring/rendering, per-runtime command invocation and question surfaces.
- Constraints and risks: all writes stay in this lineage; convergence is telemetry only; synthesis stops after ten iterations; resource-map emission is disabled.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05; telemetry only under max-iterations stop policy
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
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
- Started: 2026-11-12T09:34:02Z

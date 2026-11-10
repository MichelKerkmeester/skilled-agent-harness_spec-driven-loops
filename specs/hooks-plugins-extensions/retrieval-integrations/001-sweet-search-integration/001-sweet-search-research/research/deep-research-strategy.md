# Deep Research Strategy - sweet-search integration

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
Research sweet-search (local code search for AI coding agents; source at `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/context/sweet-search-main`): how useful is it, and how could it integrate into the Skilled repo, a relevant Skilled skill, or elsewhere. Prioritize UX in this repo, UX in external repos that install Skilled, and preventing over-engineering.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: What does sweet-search actually do (tools, index, runtime, MCP/CLI surface), and what are its hard requirements (Node >=22, macOS/Linux only, native build, GPU, model downloads, disk, index time)?
- [x] Q2: How credible are its usefulness claims (5-33% cheaper runs, up to 34% less model time)? What do its eval code and data show, and where would the gain be largest or zero for Skilled-style work (large markdown/skill trees, spec folders, TypeScript runtime)?
- [x] Q3: How does it overlap with or complement what Skilled already has: the committed trigger index, the ripgrep retrieval recipes, the code-search decision tree in AGENTS.md, Code Mode/UTCP MCP registration, and the doctor install commands?
- [x] Q4: Which integration surfaces are candidates (nothing; a docs pointer; a Code Mode/UTCP manual entry; a new mcp-tooling mode; a doctor install/setup step; an sk-code or system-spec-kit retrieval hook), and what does each cost the user in this repo and in external repos that install Skilled?
- [x] Q5: What is the smallest integration that delivers most of the value, which options are over-engineering, and what are the opt-in, failure and uninstall paths (licence, maintenance, staleness, platform gaps)?
- [x] Q6: What is the strongest case against the iteration-5 recommendation (one optional sk-code pointer), and does any evidence from iterations 1-5 contradict it? Consider whether the right answer is no integration at all, or a slightly bigger one.
- [x] Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains? Compare with comparable agent code-search tools and with the built-in search Claude Code, Codex and OpenCode already ship.
- [x] Q8: External-repo UX walkthrough: following the recommended path, what exactly does a user in a fresh project repo with Skilled installed see and do, step by step, including when sweet-search is absent, half-installed, stale, or on an unsupported platform (Windows without WSL2, Node below 22)?
- [x] Q9: Where exactly would the pointer live and how would agents act on it: which sk-code file and section, the precise wording, how an agent detects that sweet-search is installed without a new script, and how it interacts with the AGENTS.md code-search decision tree?
- [x] Q10: What should phase 2 of this packet contain: the file list, the acceptance checks, and the measurement (if any) that would justify growing the integration later?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Building or prototyping the integration; that is a later phase.
- Modifying the vendored sweet-search source.
- Re-benchmarking sweet-search end to end with paid agent runs; judge from its eval code, data and a light local probe at most.

---

## 5. STOP CONDITIONS
- A verdict (adopt / adopt narrowly / skip) and one recommended surface are evidence-backed and the rejected options each carry a reason.
- Further iterations only restate the same evidence.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: What does sweet-search actually do (tools, index, runtime, MCP/CLI surface), and what are its hard requirements (Node >=22, macOS/Linux only, native build, GPU, model downloads, disk, index time)?
- Q2: How credible are its usefulness claims (5-33% cheaper runs, up to 34% less model time)? What do its eval code and data show, and where would the gain be largest or zero for Skilled-style work (large markdown/skill trees, spec folders, TypeScript runtime)?
- Q3: How does it overlap with or complement what Skilled already has: the committed trigger index, the ripgrep retrieval recipes, the code-search decision tree in AGENTS.md, Code Mode/UTCP MCP registration, and the doctor install commands?
- Q4: Which integration surfaces are candidates (nothing; a docs pointer; a Code Mode/UTCP manual entry; a new mcp-tooling mode; a doctor install/setup step; an sk-code or system-spec-kit retrieval hook), and what does each cost the user in this repo and in external repos that install Skilled?
- Q5: What is the smallest integration that delivers most of the value, which options are over-engineering, and what are the opt-in, failure and uninstall paths (licence, maintenance, staleness, platform gaps)?
- Q6: What is the strongest case against the iteration-5 recommendation (one optional sk-code pointer), and does any evidence from iterations 1-5 contradict it? Consider whether the right answer is no integration at all, or a slightly bigger one.
- Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains? Compare with comparable agent code-search tools and with the built-in search Claude Code, Codex and OpenCode already ship.
- Q8: External-repo UX walkthrough: following the recommended path, what exactly does a user in a fresh project repo with Skilled installed see and do, step by step, including when sweet-search is absent, half-installed, stale, or on an unsupported platform (Windows without WSL2, Node below 22)?
- Q9: Where exactly would the pointer live and how would agents act on it: which sk-code file and section, the precise wording, how an agent detects that sweet-search is installed without a new script, and how it interacts with the AGENTS.md code-search decision tree?
- Q10: What should phase 2 of this packet contain: the file list, the acceptance checks, and the measurement (if any) that would justify growing the integration later?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- comparing package metadata and executable code with the README exposed both the platform boundary and the optional remote summary path. (iteration 1)
- Reading the published tables alongside the analysis script and generated reports exposed which headline numbers are modeled, how they are sampled, and where subagent use changes the largest result. (iteration 2)
- comparing the actual retrieval contract, MCP tool schemas and doctor route scope showed which parts are complementary and which setup work an adopter would still own. (iteration 3)
- Reading the current external install path alongside the actual MCP and doctor contracts exposed which setup changes reach an external project automatically and which need separate configuration. (iteration 4)
- comparing the shared-skill distribution path with Sweet Search's own init and uninstall lifecycle showed how to deliver discoverability without adding another installer or registration contract. (iteration 5)
- comparing the suggested pointer with the already-supported search path and actual setup costs showed that discoverability is its only immediate benefit. (iteration 6)
- reading the agent makers' own documentation and design articles exposed the built-in baseline directly, and searching for measurement studies rather than product pages surfaced the noise-dependence result that reconciles the conflicting vendor claims. (iteration 7)
- reading `nextStep` and `formatSetupStatus` turned "what happens if half-installed" from a guess into a deterministic one-line-per-rung contract, and comparing Skilled's Node 24 prerequisite with sweet-search's Node 22 floor removed an entire failure branch. (iteration 8)
- reading the hub contract and the router map before choosing a file exposed that the file receiving every code query is not the file allowed to carry behavior. Separating "distribution point" from "lawful content home" produced a precise answer instead of restating iteration 5's hint. (iteration 9)
- reading the phase-parent handoff and the hub version contract together turned "phase 2" from a vague next step into a file list and an acceptance gate; the version contract exposed the hidden five-file cost. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the inspected project files do not quantify a full initial index run or its total disk use. Those values depend on repository size and host hardware, and need a measured run on the target repo. (iteration 1)
- The prior privacy summary relied on the source-inclusion helper without confirming that HCGS calls it; a narrow call-path trace corrected that overstatement. (iteration 2)
- the existing state row did not prove that the required narrative or delta files existed; checking the exact output paths exposed the mismatch. (iteration 3)
- The state projection does not provide a unique next iteration from row count because it has two completion rows numbered 3. The dispatcher-provided iteration_start and output path resolve this run, but the reducer should reconcile the duplicate later. (iteration 4)
- the npm page denied the fetch and the commit history did not expose a timestamp, so maintenance cadence could not be verified. (iteration 5)
- no usage data or independent tool comparison from iterations 1–5 measures whether a Skilled user would adopt the pointer or whether it improves a real task. (iteration 6)
- there is no neutral third-party evaluation of sweet-search, so the iteration can bound the plausibility of its claims but cannot confirm its numbers; every magnitude still traces back to its own eval. (iteration 7)
- no live install was run, so the walkthrough's console output is reconstructed rather than observed, and the link-mode write-through remains an inference. (iteration 8)
- the naive placement in `SKILL.md` would have violated the hub's routing-only rule; the earlier iteration had cited the hub's routing line without checking that constraint. (iteration 9)
- the parallel siblings' answers were not on disk, so Q10 could not use Q7–Q9. The decision is robust to either outcome, but phase 2 entry must re-check them. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Adding a detector script or doctor check: the MCP roster, the `.sweet-search/config.json` marker and `status --json` already answer the question with no new maintenance surface. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Adding a detector script or doctor check: the MCP roster, the `.sweet-search/config.json` marker and `status --json` already answer the question with no new maintenance surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a detector script or doctor check: the MCP roster, the `.sweet-search/config.json` marker and `status --json` already answer the question with no new maintenance surface.

### Adding a Skilled-side health check or doctor step for sweet-search. The status command already returns one next step per failure, and iteration 5 blocked doctor-owned install/setup. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Adding a Skilled-side health check or doctor step for sweet-search. The status command already returns one next step per failure, and iteration 5 blocked doctor-owned install/setup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a Skilled-side health check or doctor step for sweet-search. The status command already returns one next step per failure, and iteration 5 blocked doctor-owned install/setup.

### Code Mode/UTCP mirror: it adds a second registration path beside Sweet Search's native `init --mcp`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Code Mode/UTCP mirror: it adds a second registration path beside Sweet Search's native `init --mcp`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Code Mode/UTCP mirror: it adds a second registration path beside Sweet Search's native `init --mcp`.

### Doctor-owned install/setup: it duplicates Sweet Search's own project initialization and uninstall lifecycle. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Doctor-owned install/setup: it duplicates Sweet Search's own project initialization and uninstall lifecycle.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Doctor-owned install/setup: it duplicates Sweet Search's own project initialization and uninstall lifecycle.

### Editing `AGENTS.md`: the root file is not part of the always-linked `.skilled` set, so the pointer would not travel to external repos, and a vendor name would make a capability-framed tree tool-specific. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Editing `AGENTS.md`: the root file is not part of the always-linked `.skilled` set, so the pointer would not travel to external repos, and a vendor name would make a capability-framed tree tool-specific.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Editing `AGENTS.md`: the root file is not part of the always-linked `.skilled` set, so the pointer would not travel to external repos, and a vendor name would make a capability-framed tree tool-specific.

### Making the pointer phase 2 without a demonstrated need: it fixes no current failure and spends attention on every code query. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Making the pointer phase 2 without a demonstrated need: it fixes no current failure and spends attention on every code query.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making the pointer phase 2 without a demonstrated need: it fixes no current failure and spends attention on every code query.

### Making the pointer unconditional or install-prompting. Absent is the default; an unconditional note would advertise a tool most repos do not have. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Making the pointer unconditional or install-prompting. Absent is the default; an unconditional note would advertise a tool most repos do not have.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making the pointer unconditional or install-prompting. Absent is the default; an unconditional note would advertise a tool most repos do not have.

### Mirroring the pointer into `workflow-debug.md` as well: one doctrine file is enough to test the idea; a second edit doubles the cost before any evidence of need. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Mirroring the pointer into `workflow-debug.md` as well: one doctrine file is enough to test the idea; a second edit doubles the cost before any evidence of need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mirroring the pointer into `workflow-debug.md` as well: one doctrine file is enough to test the idea; a second edit doubles the cost before any evidence of need.

### New mcp-tooling mode: it adds routing and packet maintenance for an optional external search tool. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: New mcp-tooling mode: it adds routing and packet maintenance for an optional external search tool.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New mcp-tooling mode: it adds routing and packet maintenance for an optional external search tool.

### No new dead ends. The Q5/Q6 surface rulings still hold. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No new dead ends. The Q5/Q6 surface rulings still hold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dead ends. The Q5/Q6 surface rulings still hold.

### None new. The platform matrix resolved cleanly from the compatibility table and Skilled's own prerequisites. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: None new. The platform matrix resolved cleanly from the compatibility table and Skilled's own prerequisites.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. The platform matrix resolved cleanly from the compatibility table and Skilled's own prerequisites.

### None. The exact locations, tool names and status contract were all present in the checked-in sources. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: None. The exact locations, tool names and status contract were all present in the checked-in sources.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The exact locations, tool names and status contract were all present in the checked-in sources.

### Placing the pointer in `sk-code/SKILL.md`: the hub is routing-only by its own contract, and search behavior is workflow logic, not routing. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Placing the pointer in `sk-code/SKILL.md`: the hub is routing-only by its own contract, and search behavior is workflow logic, not routing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Placing the pointer in `sk-code/SKILL.md`: the hub is routing-only by its own contract, and search behavior is workflow logic, not routing.

### Running a paid agent benchmark inside phase 2: research non-goals exclude it; the measurement is a protocol for a later phase. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Running a paid agent benchmark inside phase 2: research non-goals exclude it; the measurement is a protocol for a later phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running a paid agent benchmark inside phase 2: research non-goals exclude it; the measurement is a protocol for a later phase.

### Searching for an independent third-party evaluation of sweet-search itself produced none; every quantitative claim about it still traces to its own checked-in eval data, consistent with iteration 2. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Searching for an independent third-party evaluation of sweet-search itself produced none; every quantitative claim about it still traces to its own checked-in eval data, consistent with iteration 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for an independent third-party evaluation of sweet-search itself produced none; every quantitative claim about it still traces to its own checked-in eval data, consistent with iteration 2.

### system-spec-kit retrieval hook: code navigation belongs on the code-search surface, not document retrieval. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: system-spec-kit retrieval hook: code navigation belongs on the code-search surface, not document retrieval.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: system-spec-kit retrieval hook: code navigation belongs on the code-search surface, not document retrieval.

### The npm package page returned 403 and the GitHub commits page did not expose a latest commit date. Upstream maintenance cadence stays UNKNOWN; the canonical README and release page were still available. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The npm package page returned 403 and the GitHub commits page did not expose a latest commit date. Upstream maintenance cadence stays UNKNOWN; the canonical README and release page were still available.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The npm package page returned 403 and the GitHub commits page did not expose a latest commit date. Upstream maintenance cadence stays UNKNOWN; the canonical README and release page were still available.

### The public evidence base on "semantic retrieval for coding agents" is dominated by vendors measuring their own product (Cursor, Zilliz's claude-context, Semlith) or by small pilots; there is no neutral, large-scale, cross-tool benchmark of the kind Q7 would ideally cite. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The public evidence base on "semantic retrieval for coding agents" is dominated by vendors measuring their own product (Cursor, Zilliz's claude-context, Semlith) or by small pilots; there is no neutral, large-scale, cross-tool benchmark of the kind Q7 would ideally cite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The public evidence base on "semantic retrieval for coding agents" is dominated by vendors measuring their own product (Cursor, Zilliz's claude-context, Semlith) or by small pilots; there is no neutral, large-scale, cross-tool benchmark of the kind Q7 would ideally cite.

### The web search snippet was stale for the Node requirement; the current opened README and local package metadata agree on Node 22+. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The web search snippet was stale for the Node requirement; the current opened README and local package metadata agree on Node 22+.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The web search snippet was stale for the Node requirement; the current opened README and local package metadata agree on Node 22+.

### Treating Anthropic's reversal as proof that no code index can help. The published reasons are maintenance, transparency, accuracy, and index-hosting liability for their own product; they do not measure third-party indexes against their harness. [SOURCE: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating Anthropic's reversal as proof that no code index can help. The published reasons are maintenance, transparency, accuracy, and index-hosting liability for their own product; they do not measure third-party indexes against their harness. [SOURCE: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Anthropic's reversal as proof that no code index can help. The published reasons are maintenance, transparency, accuracy, and index-hosting liability for their own product; they do not measure third-party indexes against their harness. [SOURCE: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk]

### Treating Cursor's 12.5% accuracy figure as transferable to sweet-search. Cursor's gain is attributed to a custom embedding model trained on agent traces, so the number describes that model, not local embeddings in general. [SOURCE: https://cursor.com/blog/semsearch] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating Cursor's 12.5% accuracy figure as transferable to sweet-search. Cursor's gain is attributed to a custom embedding model trained on agent traces, so the number describes that model, not local embeddings in general. [SOURCE: https://cursor.com/blog/semsearch]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Cursor's 12.5% accuracy figure as transferable to sweet-search. Cursor's gain is attributed to a custom embedding model trained on agent traces, so the number describes that model, not local embeddings in general. [SOURCE: https://cursor.com/blog/semsearch]

### Treating Node below 22 as a live failure state for a Skilled-installed repo. Skilled's Node 24 prerequisite makes it unreachable. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating Node below 22 as a live failure state for a Skilled-installed repo. Skilled's Node 24 prerequisite makes it unreachable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Node below 22 as a live failure state for a Skilled-installed repo. Skilled's Node 24 prerequisite makes it unreachable.

### Treating the pointer as a one-line change: the hub release cost is five files. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating the pointer as a one-line change: the hub release cost is five files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the pointer as a one-line change: the hub release cost is five files.

### Using the CodeRAG-Bench and structural-index results as direct support for sweet-search. Both evaluate retrieval or localisation components, not sweet-search's specific tool contract, and CodeRAG-Bench's repository slice is document retrieval for generation rather than agentic tool use. [SOURCE: https://code-rag-bench.github.io/] [SOURCE: https://arxiv.org/html/2606.22417] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Using the CodeRAG-Bench and structural-index results as direct support for sweet-search. Both evaluate retrieval or localisation components, not sweet-search's specific tool contract, and CodeRAG-Bench's repository slice is document retrieval for generation rather than agentic tool use. [SOURCE: https://code-rag-bench.github.io/] [SOURCE: https://arxiv.org/html/2606.22417]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the CodeRAG-Bench and structural-index results as direct support for sweet-search. Both evaluate retrieval or localisation components, not sweet-search's specific tool contract, and CodeRAG-Bench's repository slice is document retrieval for generation rather than agentic tool use. [SOURCE: https://code-rag-bench.github.io/] [SOURCE: https://arxiv.org/html/2606.22417]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Code Mode/UTCP mirror: it adds a second registration path beside Sweet Search's native `init --mcp`. (iteration 5)
- Doctor-owned install/setup: it duplicates Sweet Search's own project initialization and uninstall lifecycle. (iteration 5)
- New mcp-tooling mode: it adds routing and packet maintenance for an optional external search tool. (iteration 5)
- system-spec-kit retrieval hook: code navigation belongs on the code-search surface, not document retrieval. (iteration 5)
- The npm package page returned 403 and the GitHub commits page did not expose a latest commit date. Upstream maintenance cadence stays UNKNOWN; the canonical README and release page were still available. (iteration 5)
- The web search snippet was stale for the Node requirement; the current opened README and local package metadata agree on Node 22+. (iteration 5)
- Searching for an independent third-party evaluation of sweet-search itself produced none; every quantitative claim about it still traces to its own checked-in eval data, consistent with iteration 2. (iteration 7)
- The public evidence base on "semantic retrieval for coding agents" is dominated by vendors measuring their own product (Cursor, Zilliz's claude-context, Semlith) or by small pilots; there is no neutral, large-scale, cross-tool benchmark of the kind Q7 would ideally cite. (iteration 7)
- Treating Anthropic's reversal as proof that no code index can help. The published reasons are maintenance, transparency, accuracy, and index-hosting liability for their own product; they do not measure third-party indexes against their harness. [SOURCE: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk] (iteration 7)
- Treating Cursor's 12.5% accuracy figure as transferable to sweet-search. Cursor's gain is attributed to a custom embedding model trained on agent traces, so the number describes that model, not local embeddings in general. [SOURCE: https://cursor.com/blog/semsearch] (iteration 7)
- Using the CodeRAG-Bench and structural-index results as direct support for sweet-search. Both evaluate retrieval or localisation components, not sweet-search's specific tool contract, and CodeRAG-Bench's repository slice is document retrieval for generation rather than agentic tool use. [SOURCE: https://code-rag-bench.github.io/] [SOURCE: https://arxiv.org/html/2606.22417] (iteration 7)
- Adding a Skilled-side health check or doctor step for sweet-search. The status command already returns one next step per failure, and iteration 5 blocked doctor-owned install/setup. (iteration 8)
- Making the pointer unconditional or install-prompting. Absent is the default; an unconditional note would advertise a tool most repos do not have. (iteration 8)
- None new. The platform matrix resolved cleanly from the compatibility table and Skilled's own prerequisites. (iteration 8)
- Treating Node below 22 as a live failure state for a Skilled-installed repo. Skilled's Node 24 prerequisite makes it unreachable. (iteration 8)
- Adding a detector script or doctor check: the MCP roster, the `.sweet-search/config.json` marker and `status --json` already answer the question with no new maintenance surface. (iteration 9)
- Editing `AGENTS.md`: the root file is not part of the always-linked `.skilled` set, so the pointer would not travel to external repos, and a vendor name would make a capability-framed tree tool-specific. (iteration 9)
- Mirroring the pointer into `workflow-debug.md` as well: one doctrine file is enough to test the idea; a second edit doubles the cost before any evidence of need. (iteration 9)
- None. The exact locations, tool names and status contract were all present in the checked-in sources. (iteration 9)
- Placing the pointer in `sk-code/SKILL.md`: the hub is routing-only by its own contract, and search behavior is workflow logic, not routing. (iteration 9)
- Making the pointer phase 2 without a demonstrated need: it fixes no current failure and spends attention on every code query. (iteration 10)
- No new dead ends. The Q5/Q6 surface rulings still hold. (iteration 10)
- Running a paid agent benchmark inside phase 2: research non-goals exclude it; the measurement is a protocol for a later phase. (iteration 10)
- Treating the pointer as a one-line change: the hub release cost is five files. (iteration 10)

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
- Q4: Which integration surfaces are candidates (nothing; a docs pointer; a Code Mode/UTCP manual entry; a new mcp-tooling mode; a doctor install/setup step; an sk-code or system-spec-kit retrieval hook), and what does each cost the user in this repo and in external repos that install Skilled? (iteration 1)
- Q5: What is the smallest integration that delivers most of the value, which options are over-engineering, and what are the opt-in, failure and uninstall paths (licence, maintenance, staleness, platform gaps)? (iteration 1)
- Q2: How credible are its usefulness claims (5-33% cheaper runs, up to 34% less model time)? What do its eval code and data show, and where would the gain be largest or zero for Skilled-style work (large markdown/skill trees, spec folders, TypeScript runtime)? (iteration 1)
- Q3: How does it overlap with or complement what Skilled already has: the committed trigger index, the ripgrep retrieval recipes, the code-search decision tree in AGENTS.md, Code Mode/UTCP MCP registration, and the doctor install commands? (iteration 1)
- Q2 and Q3 are carried forward by the dispatch summary but remain checked in the current strategy. This iteration did not revisit them. (iteration 4)
- Upstream maintenance cadence and the latest published npm version remain UNKNOWN. The exact registry version and latest commit timestamp would resolve those points if they become decision-critical. (iteration 5)
- No unchecked strategy question remains after Q5. Q2 and Q3 are marked answered in the strategy; the dispatch carried them forward as context, and this iteration did not reopen them. (iteration 5)
- Q9: Where exactly would the pointer live and how would agents act on it: which sk-code file and section, the precise wording, how an agent detects that sweet-search is installed without a new script, and how it interacts with the AGENTS.md code-search decision tree? (iteration 6)
- Q10: What should phase 2 of this packet contain: the file list, the acceptance checks, and the measurement (if any) that would justify growing the integration later? (iteration 6)
- Q8: External-repo UX walkthrough: following the recommended path, what exactly does a user in a fresh project repo with Skilled installed see and do, step by step, including when sweet-search is absent, half-installed, stale, or on an unsupported platform (Windows without WSL2, Node below 22)? (iteration 6)
- Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains? Compare with comparable agent code-search tools and with the built-in search Claude Code, Codex and OpenCode already ship. (iteration 6)
- Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains? (iteration 9)
- Q10: What phase 2 of this packet should contain: file list, acceptance checks and the measurement that would justify growing the integration later. (iteration 9)
- Q8: External-repo UX walkthrough, including absent, half-installed, stale and unsupported-platform states. (iteration 9)
- `research/research.md` is still absent; it is the phase 2 entry gate. (iteration 10)
- Q7, Q8 and Q9 are with the parallel sibling iterations. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
No prior Skilled research mentions sweet-search (ripgrep over specs/ and .skilled/ found only this packet's own docs).

- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: `../../context/sweet-search-main/README.md` (92 KB, claims and quickstart), `mcp/`, `packages/`, `crates/`, `native/`, `core/`, `eval/`, `docs/`, `package.json` (Node >=22, macOS/Linux).
- Reuse candidates in Skilled: the trigger index (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`), ripgrep recipes (`.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`), Code Mode / UTCP (`.utcp_config.json`, `.skilled/skills/mcp-code-mode/`), the `mcp-tooling` hub (`.skilled/skills/mcp-tooling/`), doctor commands (`.skilled/skills/system-skilled-doctor/`, `/doctor:install`, `/doctor:mcp`), the AGENTS.md code-search decision tree (§5).
- Integration points: whichever of the above the research recommends; external-repo installs go through `system-skilled-doctor`.
- Constraints and risks: the repo rule `prevent-overengineering.md` (smallest thing that solves the stated problem); external users pay every install step; platform limits; licence (Apache-2.0 plus a CLA and THIRD_PARTY_LICENSES).

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
- Started: 2026-11-09T11:31Z
- Executor: cli-codex, gpt-6-luna, xhigh reasoning, fast service tier

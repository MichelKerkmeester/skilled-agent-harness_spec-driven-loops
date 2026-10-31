---
title: Deep Research Strategy - AI Systems skill router relocation
description: Runtime strategy for the deepseek lineage researching how the 16 AI Systems skills are routed today and how to move each machine router into a sibling ROUTER.md.
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for this lineage. Records what to investigate, what worked, what failed, and where to focus next.

### Usage

- Analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.
- Section 3 is a generated projection from the reducer registry.

---

## 2. TOPIC

Moving the machine router of each of the 16 skills in the AI Systems repository at `/Users/michelkerkmeester/MEGA/Development/AI Systems` (folder `AI Systems/`, ignoring `specs/`, `runtime/`, `scratch/` and `node_modules/`) into a sibling `ROUTER.md`, following this repository's canon: the machine router under a final `## MACHINE ROUTER` heading in `ROUTER.md`, plus a link from `SKILL.md`. The lineage answers RQ-1 to RQ-5 of the spec folder `specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/007-ai-systems-research`.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] RQ-1: For each of the 16 skills, which parts of its routing section are agent-facing prose and which are machine data (assignment blocks, pseudocode, resource lists), and what is the word count of each part?
- [x] RQ-2: What loads these skills (OpenCode through opencode.json, Claude Code through .claude/, the Claude Project sync loop in 'AI Systems/z - Claude Project Sync Loop' and its hand-written knowledge files, and any other runtime), and does each loader load a file beside SKILL.md on its own?
- [x] RQ-3: Which check, benchmark gate or script in the AI Systems repository reads a SKILL.md routing section or a ROUTER.md, with file:line, and which of this repository's tools (package_skill.py, the router resolver) apply there?
- [x] RQ-4: How does each of the four existing ROUTER.md files classify against the new canon, and what does each need?
- [x] RQ-5: What is the per-skill migration design: target shape per skill, Claude Project knowledge-file changes, token saving per skill, and the order that avoids colliding with other sessions working in that repository?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Changing any file inside `/Users/michelkerkmeester/MEGA/Development/AI Systems`; this phase reads only.
- Changing what any skill routes to: the move changes location, not decisions.
- Opening any `.env` or credential file in either repository.
- Running this repository's validators, generators or git commands against either repository.

---

## 5. STOP CONDITIONS

- The three configured iterations have run; `config.stopPolicy` is `max-iterations`, so the loop runs all three and records `maxIterationsReached`.
- A blocking dependency (a repository path that does not exist) would leave a question unanswerable; recorded as a finding instead of a halt.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- RQ-1: For each of the 16 skills, which parts of its routing section are agent-facing prose and which are machine data (assignment blocks, pseudocode, resource lists), and what is the word count of each part?
- RQ-2: What loads these skills (OpenCode through opencode.json, Claude Code through .claude/, the Claude Project sync loop in 'AI Systems/z - Claude Project Sync Loop' and its hand-written knowledge files, and any other runtime), and does each loader load a file beside SKILL.md on its own?
- RQ-3: Which check, benchmark gate or script in the AI Systems repository reads a SKILL.md routing section or a ROUTER.md, with file:line, and which of this repository's tools (package_skill.py, the router resolver) apply there?
- RQ-4: How does each of the four existing ROUTER.md files classify against the new canon, and what does each need?
- RQ-5: What is the per-skill migration design: target shape per skill, Claude Project knowledge-file changes, token saving per skill, and the order that avoids colliding with other sessions working in that repository?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- measuring per sub-block rather than per section separated the two families of machine data and immediately showed that the copywriter's router is table-driven, not pseudocode-driven; a section-level total alone would have hidden that. (iteration 1)
- reading the gates rather than the docs produced both the blocking facts (a heading slice and a residue list) and the precedent (a `references/router-contract.md` already holding a fence), which is what a migration order needs. (iteration 2)
- reading the generator (`check-route-table.py --write`) turned a documentation change into a code change, which is the difference between a migration that holds and one that reverts silently. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the heading-name heuristic had no signal, because `Executable Contract` reads like a machine artifact and behaves like prose. (iteration 1)
- looking for a loader configuration assumed a config surface that does not exist; the load path turned out to be one command document. (iteration 2)
- assuming the "final heading" rule was satisfied anywhere. The four files predate the canon and none of them closes with the machine block. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Assuming `.claude/skills` or `.opencode/skills` holds the 16 project skills. Both are symlinks into `Code_Environment/Public` and hold the same 17 shared skills; the project skills are reached only by `Commands/agent-router.md`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Assuming `.claude/skills` or `.opencode/skills` holds the 16 project skills. Both are symlinks into `Code_Environment/Public` and hold the same 17 shared skills; the project skills are reached only by `Commands/agent-router.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming `.claude/skills` or `.opencode/skills` holds the 16 project skills. Both are symlinks into `Code_Environment/Public` and hold the same 17 shared skills; the project skills are reached only by `Commands/agent-router.md`.

### Assuming a packaging script will rewrite a Claude Project from the skill source. `AGENTS.md` section 5 retires the compiler and forbids a manifest, lock or checksum, so the Project update is a hand edit or a recorded "no change needed". -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Assuming a packaging script will rewrite a Claude Project from the skill source. `AGENTS.md` section 5 retires the compiler and forbids a manifest, lock or checksum, so the Project update is a hand edit or a recorded "no change needed".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming a packaging script will rewrite a Claude Project from the skill source. `AGENTS.md` section 5 retires the compiler and forbids a manifest, lock or checksum, so the Project update is a hand edit or a recorded "no change needed".

### Counting routing words with `wc -w` over the raw section. It inflates fenced blocks and tables, because punctuation and markdown markers collapse into fewer tokens than my tokenizer produces: `wc -w` reads 8,213 words for `sk-barter-copywriter` while the tokenizer reads 8,018 for the whole file. Rejected in favour of one consistent tokenizer, and the rule is stated above so phase 008 can reproduce the numbers. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting routing words with `wc -w` over the raw section. It inflates fenced blocks and tables, because punctuation and markdown markers collapse into fewer tokens than my tokenizer produces: `wc -w` reads 8,213 words for `sk-barter-copywriter` while the tokenizer reads 8,018 for the whole file. Rejected in favour of one consistent tokenizer, and the rule is stated above so phase 008 can reproduce the numbers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting routing words with `wc -w` over the raw section. It inflates fenced blocks and tables, because punctuation and markdown markers collapse into fewer tokens than my tokenizer produces: `wc -w` reads 8,213 words for `sk-barter-copywriter` while the tokenizer reads 8,018 for the whole file. Rejected in favour of one consistent tokenizer, and the rule is stated above so phase 008 can reproduce the numbers.

### Giving every Claude Project the repository's `ROUTER.md` verbatim. Product Owner's router is 1,229 words and `sk-moneybird-accountant`'s is 2,435, which would move cost into every Project retrieval rather than cut it; the residency class work in iteration 2 already shows that shape being rejected by hand. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Giving every Claude Project the repository's `ROUTER.md` verbatim. Product Owner's router is 1,229 words and `sk-moneybird-accountant`'s is 2,435, which would move cost into every Project retrieval rather than cut it; the residency class work in iteration 2 already shows that shape being rejected by hand.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Giving every Claude Project the repository's `ROUTER.md` verbatim. Product Owner's router is 1,229 words and `sk-moneybird-accountant`'s is 2,435, which would move cost into every Project retrieval rather than cut it; the residency class work in iteration 2 already shows that shape being rejected by hand.

### Looking for an existing Project routing doc to extend. There is none, so the first one is an authoring decision and belongs in phase 008's plan rather than a find-and-replace. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for an existing Project routing doc to extend. There is none, so the first one is an authoring decision and belongs in phase 008's plan rather than a find-and-replace.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing Project routing doc to extend. There is none, so the first one is an authoring decision and belongs in phase 008's plan rather than a find-and-replace.

### Migrating Product Owner first because it is the most visible. Its commit cadence (daily) and its packet gate make it the worst first target. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Migrating Product Owner first because it is the most visible. Its commit cadence (daily) and its packet gate make it the worst first target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Migrating Product Owner first because it is the most visible. Its commit cadence (daily) and its packet gate make it the worst first target.

### Reading `### Executable Contract` as a machine-data marker. In `sk-barter-copywriter` (line 232), `sk-barter-deal-templates` (line 115) and `sk-media-editor` (line 126) that heading holds plain prose describing the contract, not the contract itself. A heading-name heuristic would misclassify all three. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading `### Executable Contract` as a machine-data marker. In `sk-barter-copywriter` (line 232), `sk-barter-deal-templates` (line 115) and `sk-media-editor` (line 126) that heading holds plain prose describing the contract, not the contract itself. A heading-name heuristic would misclassify all three.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `### Executable Contract` as a machine-data marker. In `sk-barter-copywriter` (line 232), `sk-barter-deal-templates` (line 115) and `sk-media-editor` (line 126) that heading holds plain prose describing the contract, not the contract itself. A heading-name heuristic would misclassify all three.

### Reading the AI Systems `specs/` harnesses (`AI Systems/Sales - HubSpot & Automation/specs/.../harness.py`, `AI Systems/Barter - Deal Templates/specs/.../harness.py`) as live gates. They live under `specs/`, which the topic excludes, and the replay is kept under `benchmark/`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading the AI Systems `specs/` harnesses (`AI Systems/Sales - HubSpot & Automation/specs/.../harness.py`, `AI Systems/Barter - Deal Templates/specs/.../harness.py`) as live gates. They live under `specs/`, which the topic excludes, and the replay is kept under `benchmark/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the AI Systems `specs/` harnesses (`AI Systems/Sales - HubSpot & Automation/specs/.../harness.py`, `AI Systems/Barter - Deal Templates/specs/.../harness.py`) as live gates. They live under `specs/`, which the topic excludes, and the replay is kept under `benchmark/`.

### Renaming `## 2. SMART ROUTING` to `## MACHINE ROUTER` in place. It leaves prose inside the machine section (finding 4) and, for Product Owner, leaves two sections after it (finding 3). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Renaming `## 2. SMART ROUTING` to `## MACHINE ROUTER` in place. It leaves prose inside the machine section (finding 4) and, for Product Owner, leaves two sections after it (finding 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Renaming `## 2. SMART ROUTING` to `## MACHINE ROUTER` in place. It leaves prose inside the machine section (finding 4) and, for Product Owner, leaves two sections after it (finding 3).

### Searching for a skill loader in `opencode.json`. There is no skill key to extend, so the only way a sibling router reaches a runtime is the `SKILL.md` pointer and the agent's own follow-the-link behaviour. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for a skill loader in `opencode.json`. There is no skill key to extend, so the only way a sibling router reaches a runtime is the `SKILL.md` pointer and the agent's own follow-the-link behaviour.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a skill loader in `opencode.json`. There is no skill key to extend, so the only way a sibling router reaches a runtime is the `SKILL.md` pointer and the agent's own follow-the-link behaviour.

### Treating the whole `SKILL.md` as "the routing section". The spec's measured behavior anchors on `## .*SMART ROUTING`, and every other section (WHEN TO USE, RULES, RESOURCES, DELIVERY) is skill content that the move must not touch. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the whole `SKILL.md` as "the routing section". The spec's measured behavior anchors on `## .*SMART ROUTING`, and every other section (WHEN TO USE, RULES, RESOURCES, DELIVERY) is skill content that the move must not touch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the whole `SKILL.md` as "the routing section". The spec's measured behavior anchors on `## .*SMART ROUTING`, and every other section (WHEN TO USE, RULES, RESOURCES, DELIVERY) is skill content that the move must not touch.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Counting routing words with `wc -w` over the raw section. It inflates fenced blocks and tables, because punctuation and markdown markers collapse into fewer tokens than my tokenizer produces: `wc -w` reads 8,213 words for `sk-barter-copywriter` while the tokenizer reads 8,018 for the whole file. Rejected in favour of one consistent tokenizer, and the rule is stated above so phase 008 can reproduce the numbers. (iteration 1)
- Reading `### Executable Contract` as a machine-data marker. In `sk-barter-copywriter` (line 232), `sk-barter-deal-templates` (line 115) and `sk-media-editor` (line 126) that heading holds plain prose describing the contract, not the contract itself. A heading-name heuristic would misclassify all three. (iteration 1)
- Treating the whole `SKILL.md` as "the routing section". The spec's measured behavior anchors on `## .*SMART ROUTING`, and every other section (WHEN TO USE, RULES, RESOURCES, DELIVERY) is skill content that the move must not touch. (iteration 1)
- Assuming `.claude/skills` or `.opencode/skills` holds the 16 project skills. Both are symlinks into `Code_Environment/Public` and hold the same 17 shared skills; the project skills are reached only by `Commands/agent-router.md`. (iteration 2)
- Assuming a packaging script will rewrite a Claude Project from the skill source. `AGENTS.md` section 5 retires the compiler and forbids a manifest, lock or checksum, so the Project update is a hand edit or a recorded "no change needed". (iteration 2)
- Reading the AI Systems `specs/` harnesses (`AI Systems/Sales - HubSpot & Automation/specs/.../harness.py`, `AI Systems/Barter - Deal Templates/specs/.../harness.py`) as live gates. They live under `specs/`, which the topic excludes, and the replay is kept under `benchmark/`. (iteration 2)
- Searching for a skill loader in `opencode.json`. There is no skill key to extend, so the only way a sibling router reaches a runtime is the `SKILL.md` pointer and the agent's own follow-the-link behaviour. (iteration 2)
- Giving every Claude Project the repository's `ROUTER.md` verbatim. Product Owner's router is 1,229 words and `sk-moneybird-accountant`'s is 2,435, which would move cost into every Project retrieval rather than cut it; the residency class work in iteration 2 already shows that shape being rejected by hand. (iteration 3)
- Looking for an existing Project routing doc to extend. There is none, so the first one is an authoring decision and belongs in phase 008's plan rather than a find-and-replace. (iteration 3)
- Migrating Product Owner first because it is the most visible. Its commit cadence (daily) and its packet gate make it the worst first target. (iteration 3)
- Renaming `## 2. SMART ROUTING` to `## MACHINE ROUTER` in place. It leaves prose inside the machine section (finding 4) and, for Product Owner, leaves two sections after it (finding 3). (iteration 3)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Measured in `/Users/michelkerkmeester/MEGA/Development/AI Systems` at `8e4573b8f`:
`find "AI Systems" -name SKILL.md -not -path "*/specs/*" -not -path "*/runtime/*" -not -path "*/scratch/*" -not -path "*/node_modules/*"` returns 16 files, `-name ROUTER.md` returns 4, and the working tree carries two untracked `Product Context/Collab Phases/` files.

Skill roots: `Barter - Copywriter/sk-barter-copywriter`, `Barter - Deal Templates/sk-barter-deal-templates`, `Media Editor/sk-media-editor`, `Moneybird Accountant/SKILL.md` (hub) plus `cli-jortt`, `cli-moneybird`, `sk-moneybird-accountant`, `Product Owner/SKILL.md` (hub) plus `mcp-click-up`, `mcp-code-mode`, `mcp-figma`, `sk-create-figjam`, `sk-product-owner`, `Prompt Improver/sk-prompt-improver`, `Sales - Direct Communication/sk-sales-communication`, `Sales - HubSpot & Automation/sk-sales-hubspot-automation`.
Router files that exist: `Moneybird Accountant/cli-jortt/ROUTER.md`, `Moneybird Accountant/cli-moneybird/ROUTER.md`, `Moneybird Accountant/sk-moneybird-accountant/ROUTER.md`, `Product Owner/ROUTER.md` (the hub).

### Bounded Context Snapshot

- Source pointers: `opencode.json` at the repository root; `.claude/` at the root; `AI Systems/*/SKILL.md`; `AI Systems/*/ROUTER.md`; `AI Systems/z - Claude Project Sync Loop/`.
- Canon source (this repository): `specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/003-check-and-template-canon/implementation-summary.md`, `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-router-template.md`, `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`.
- Integration points: whatever loads `SKILL.md` today, and whatever Claude Project knowledge file mirrors it.
- Constraints and risks: read-only target; other sessions may hold uncommitted edits; the `.env` files are off limits.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-10-29T11:45:00Z

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
Audit the Skilled v4 release line (v4.0.0.0 to v4.0.2.0) for the CLI and deep-loop cluster: .skilled/skills/cli-external-orchestration/**, .skilled/skills/cli-classifier/**, .skilled/skills/system-deep-loop/** and .skilled/commands/deep/**. Find seven types: drift (release note vs code vs docs), misalignment with sk-code, sk-doc or Skilled canon, bugs (each with a repro command or failing check), improvement, operator and AI-user UX, over-engineering (name what breaks if removed), extension. Each finding states type, severity P0/P1/P2, a [SOURCE: path:line] you opened this iteration, the release that introduced it, confidence and a verify command. Release notes: .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0 3fed08373e, .1 bcb775402e, .2 7980001709, .3 c9bd4b156c, .4-.10 4d8f403355, .11 e2b2e393fa, .12 7fecd5f219, .13 42b41dd286, .14 bb9b9d1c09, .15 22c3a9b2c7, .16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317; always path-limit git diff. Read-only outside your research folder.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Hermes removal (v4.0.2.0): which live references to cli-hermes, .hermes/ or the hermes shell function remain in .skilled/skills/cli-external-orchestration/**, .skilled/skills/system-deep-loop/** or .skilled/commands/deep/**?
- [x] DeepSeek Harness (v4.0.2.0): does .skilled/skills/cli-external-orchestration/cli-deepseek-harness/** match its release-note claims (thirteen dispatch rules, three patches, pinned dsh release, two-id model roster) and the cli-deepseek-harness builder in .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs?
- [ ] Fan-out parity (v4.0.0.0, v4.0.0.16): for each executor kind, do LINEAGE_COMMAND_ADAPTERS in fanout-run.cjs, EXECUTOR_KINDS, EXECUTOR_KIND_FLAG_SUPPORT and the model allowlists in runtime/lib/deep-loop/executor-config.ts, and each cli-*/SKILL.md agree?
- [ ] Single-executor dispatch: which if_cli_* branches in .skilled/commands/deep/assets/deep-research-auto.yaml and deep-review-auto.yaml carry placeholder, field-name or ordering defects that would break or mislabel a run?
- [ ] Mode retirement (v4.0.0.7): which remnants of agent-improvement or model-benchmark survive in system-deep-loop runtime code, mode-registry.json, /deep:* commands or tests?
- [ ] Convergence (v4.0.0.3, v4.0.0.16): do runtime/scripts/convergence.cjs and deep-research/scripts/reduce-state.cjs honor stopPolicy, minIterations and the four convergence modes as deep-research/references/convergence/convergence.md documents?
- [ ] Write containment and lane resume (v4.0.0.16): does runtime/lib/deep-loop/write-containment.ts and the fan-out resume path do what the v4.0.0.16 note claims?
- [ ] cli-classifier and cli-jev (v4.0.0.2, v4.0.0.3, v4.0.1.0): do the router phrases, Jev feature switches and stored-key behavior in .skilled/skills/cli-classifier/** match the notes and their own hub-router.json, mode-registry.json and ROUTER.md?
- [ ] Hub canon (v4.0.1.0): do the cli-external-orchestration and cli-classifier hubs and every mode follow the parent-hub canon and the rule that each skill routes from its own ROUTER.md?
- [ ] Over-engineering: which system-deep-loop runtime surfaces (divergent pivot, legacy projection, idea lifecycle, observability, wave planner) have no live caller or test, and what would break if each were removed?
- [ ] UX: which steps of deep-research-auto.yaml, deep-research-presentation.txt or the cli-*/SKILL.md dispatch rules are unclear, contradictory or impossible to execute for the operator or an AI user?
- [ ] Extension: which concrete extensions of the fan-out runner, the executor registry or ai-council would remove the manual steps and defects found in this cluster?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Fixing anything: findings only, no edits outside the research folder.
- Clusters owned by sibling phases (spec kit core, authoring hubs, the other cluster of this pair, doctor/git/CI/runtime mirrors).
- Releases before v4.0.0.0 and commits after the v4.0.2.0 tag, except as context.

---

## 5. STOP CONDITIONS
- Forced depth: stopPolicy is max-iterations, so the run continues to maxIterations regardless of convergence telemetry.
- The orchestrator may extend the ceiling by +5 when the depth checkpoint is not cleared.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Hermes removal (v4.0.2.0): which live references to cli-hermes, .hermes/ or the hermes shell function remain in .skilled/skills/cli-external-orchestration/**, .skilled/skills/system-deep-loop/** or .skilled/commands/deep/**?
- DeepSeek Harness (v4.0.2.0): does .skilled/skills/cli-external-orchestration/cli-deepseek-harness/** match its release-note claims (thirteen dispatch rules, three patches, pinned dsh release, two-id model roster) and the cli-deepseek-harness builder in .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

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
- What are the exact members of `DSH_ALLOWED_MODELS` and the value of `DSH_DEFAULT_MODEL`? Does the default match the verified LLM Gateway id? (iteration 1)
- Does the deep-loop prompt builder load the packet's `cli-reference.md` and `prompt-quality-card.md` as SKILL.md §2 says every run does? (iteration 1)
- Are there live Hermes references outside the three focus directories, e.g. in `.skilled/hooks/**`, runtime mirrors, root commands or generated `.dsh/` adapters? (iteration 1)
- Can any caller pass a `lineageDir` that resolves to the repository root, making F1's missing guard reachable? (iteration 1)
- Does `hard-rules.json` contain exactly thirteen entries, and does the fan-out builder enforce all thirteen or a subset? (iteration 1)
- Can any caller pass a `lineageDir` that resolves to the repository root, making F4's missing guard reachable? (iteration 2)
- Does `opencode.json` carry the same default on both OpenCode versions, as the v4.0.0.13 note also claims? (iteration 2)
- Does the deep-loop prompt builder load the packet's `cli-reference.md` and `prompt-quality-card.md` as `SKILL.md` §2 says every run does? (iteration 2)
- Is the `options.repoRoot` override on the DSH builder reachable from a production caller, or is it a test seam only? (iteration 2)
- Single-executor dispatch, mode retirement, convergence, write containment, cli-classifier/cli-jev, hub canon, over-engineering, UX and extension remain open from the strategy. (iteration 2)
- Fan-out parity: for every executor kind, do `LINEAGE_COMMAND_ADAPTERS`, `EXECUTOR_KINDS`, `EXECUTOR_KIND_FLAG_SUPPORT`, the model allowlists in `executor-config.ts`, and each `cli-*/SKILL.md` agree? (next focus) (iteration 2)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Fan-out parity: for every executor kind, do `LINEAGE_COMMAND_ADAPTERS`, `EXECUTOR_KINDS`, `EXECUTOR_KIND_FLAG_SUPPORT`, the model allowlists in `executor-config.ts`, and each `cli-*/SKILL.md` agree? (next focus)

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work: the ripgrep recipe over specs/ and .skilled/ found no prior packet for this exact topic.

Release map (tag to commit; diff between consecutive commits, always path-limited):
v4.0.0.0-beta.1 -> v4.0.0.0 3fed08373e -> v4.0.0.1 bcb775402e -> v4.0.0.2 7980001709 -> v4.0.0.3 c9bd4b156c -> v4.0.0.4..v4.0.0.10 all 4d8f403355 (tagged together: use each note and `git log --since/--until` by date or subject, not tag diffs) -> v4.0.0.11 e2b2e393fa -> v4.0.0.12 7fecd5f219 -> v4.0.0.13 42b41dd286 -> v4.0.0.14 bb9b9d1c09 -> v4.0.0.15 22c3a9b2c7 -> v4.0.0.16 f459b06479 -> v4.0.1.0 6a93a2cfeb -> v4.0.2.0 51f70a0317.
Release notes: .skilled/changelog/skilled/v4.0.<x>.md (19 files).

Evidence bar set by the orchestrator: every finding names its type (drift, misalignment, bug, improvement, UX, over-engineering, extension), severity P0/P1/P2, a [SOURCE: path:line] opened in this iteration, the release that introduced it, a confidence and a verify command. A bug needs a repro command or a failing check. Restating a release note is not a finding. The orchestrator opens at least two citations per iteration.

Cluster diff size per release (files changed, path-limited to cli-external-orchestration, cli-classifier, system-deep-loop, commands/deep): beta.1->.0 3564; .0->.1 132; .1->.2 284; .2->.3 657; .3->.4-10 1130; ->.11 19; ->.12 0; ->.13 188; ->.14 68; ->.15 294; ->.16 65; ->4.0.1.0 761; ->4.0.2.0 258.

Orchestrator observations to verify, not conclusions: deep-research-auto.yaml names the executor field `config.executor.type`, while runtime/lib/deep-loop/executor-config.ts treats `type` as a deprecated alias of `kind`. The if_cli_devin branch builds dispatchId from `{generation}` while post_dispatch_validate uses `{config.lineage.generation}`.

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
- Convergence threshold: 0.05 (telemetry only under stopPolicy max-iterations)
- Per-iteration budget: 24 tool calls, 40 minutes (executor timeout 2400s)
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
- Started: 2026-11-08T19:56:53.000Z

- resource-map.md not present; skipping coverage gate

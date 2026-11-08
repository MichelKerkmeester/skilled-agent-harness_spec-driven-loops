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
Audit the Skilled v4 release line (v4.0.0.0 to v4.0.2.0) for the advisor, hooks and relaunch cluster: .skilled/skills/system-skill-advisor/**, compiled routing (each skill's hub-router.json, ROUTER.md, mode-registry.json), .skilled/hooks/** with the runtime adapters in .claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions and .dsh/plugins, session relaunch, history after compaction and question-tool decision capture. Find seven types: drift (release note vs code vs docs), misalignment with sk-code, sk-doc or Skilled canon, bugs (each with a repro command or failing check), improvement, operator and AI-user UX, over-engineering (name what breaks if removed), extension. Each finding states type, severity P0/P1/P2, a [SOURCE: path:line] you opened this iteration, the release that introduced it, confidence and a verify command. Release notes: .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0 3fed08373e, .1 bcb775402e, .2 7980001709, .3 c9bd4b156c, .4-.10 4d8f403355, .11 e2b2e393fa, .12 7fecd5f219, .13 42b41dd286, .14 bb9b9d1c09, .15 22c3a9b2c7, .16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317; always path-limit git diff. Read-only outside your research folder.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Router files (v4.0.1.0): does every skill and mode under .skilled/skills/** have a ROUTER.md linked from SKILL.md in one line, and do each hub's hub-router.json and mode-registry.json agree with its ROUTER.md?
- [x] Advisor scoring (v4.0.0.7, v4.0.0.15, v4.0.0.16): do the path-mention rule, the confidence-floor tie rule and the typed-command owner rule in .skilled/skills/system-skill-advisor/** behave as the notes say when run through node .skilled/bin/skill-advisor.cjs advisor_recommend?
- [ ] Advisor transport (v4.0.0.0, v4.0.0.16): is the MCP transport fully gone, and do degraded local scoring and the shared daemon behave as documented in system-skill-advisor/SKILL.md and ARCHITECTURE.md?
- [ ] Advisor parity (v4.0.0.7): is the Python vs Node advisor parity check still wired into CI, and do the two advisors disagree on any prompt today?
- [ ] Advisor prompt hook (v4.0.0.1, v4.0.0.2, v4.0.2.0): does every runtime adapter (.claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins, .pi/extensions, .dsh/plugins) deliver the advisor brief from the single source in .skilled/hooks/skill-advisor, within its time limit?
- [ ] Hermes removal (v4.0.2.0): which hook, plugin, advisor or routing files still reference Hermes, .hermes/ or a hermes runtime flag?
- [ ] Session relaunch (v4.0.0.13, v4.0.0.14): do .skilled/hooks/session-relaunch and its runtime adapters implement the per-runtime SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED flags, the 80 percent trigger and the model, effort and goal carry-over as the notes claim?
- [ ] History after compaction (v4.0.2.0): does the session history lookup (.opencode/plugins/session-history-lookup.js and its counterparts) stay read-only and work on each runtime the note names?
- [ ] Question-tool capture (v4.0.2.0): do .skilled/hooks/ask-surface-guard and .skilled/hooks/decision-capture detect typed option menus as the fixtures claim, and where do they false-positive or false-negative?
- [ ] Hook safety (v4.0.0.8, v4.0.0.16): do all hook entry points honor the three-second stdin deadline and the git-call time limit?
- [ ] Over-engineering: which per-runtime hook copies, mirrors and generated artifacts could collapse into one source, and what would break if each were removed?
- [ ] UX and extension: what blocks the operator or AI user when enabling relaunch, reading the advisor brief or recovering history, and which concrete extensions would remove those blocks?

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
- Router files (v4.0.1.0): does every skill and mode under .skilled/skills/** have a ROUTER.md linked from SKILL.md in one line, and do each hub's hub-router.json and mode-registry.json agree with its ROUTER.md?
- Advisor scoring (v4.0.0.7, v4.0.0.15, v4.0.0.16): do the path-mention rule, the confidence-floor tie rule and the typed-command owner rule in .skilled/skills/system-skill-advisor/** behave as the notes say when run through node .skilled/bin/skill-advisor.cjs advisor_recommend?

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
- Advisor scoring, transport and parity questions from the strategy (not touched this iteration). (iteration 1)
- Whether any consumer outside the doctor and packaging tooling resolves `workflowMode` as a folder. (iteration 1)
- Hermes removal references, relaunch and hook questions. (iteration 1)
- Advisor transport (v4.0.0.0, v4.0.0.16), the prompt hook adapters, Hermes removal, session relaunch, history after compaction, question-tool capture and hook safety were not touched this iteration. (iteration 2)
- Advisor parity (v4.0.0.7): does the Python fallback reproduce the five routes, and does it share F-iter002-001? The loop-owner floor is hard-coded at 0.82 [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4187] and applied at [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4540], but the fallback was not executed this iteration. (iteration 2)
- Does F-iter002-001 reproduce on other prompts whose top recommendation is confidence-floored, such as a doctor prompt with a single floored winner? (iteration 2)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Does F-iter002-001 reproduce on other prompts whose top recommendation is confidence-floored, such as a doctor prompt with a single floored winner?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work: the ripgrep recipe over specs/ and .skilled/ found no prior packet for this exact topic.

Release map (tag to commit; diff between consecutive commits, always path-limited):
v4.0.0.0-beta.1 -> v4.0.0.0 3fed08373e -> v4.0.0.1 bcb775402e -> v4.0.0.2 7980001709 -> v4.0.0.3 c9bd4b156c -> v4.0.0.4..v4.0.0.10 all 4d8f403355 (tagged together: use each note and `git log --since/--until` by date or subject, not tag diffs) -> v4.0.0.11 e2b2e393fa -> v4.0.0.12 7fecd5f219 -> v4.0.0.13 42b41dd286 -> v4.0.0.14 bb9b9d1c09 -> v4.0.0.15 22c3a9b2c7 -> v4.0.0.16 f459b06479 -> v4.0.1.0 6a93a2cfeb -> v4.0.2.0 51f70a0317.
Release notes: .skilled/changelog/skilled/v4.0.<x>.md (19 files).

Evidence bar set by the orchestrator: every finding names its type (drift, misalignment, bug, improvement, UX, over-engineering, extension), severity P0/P1/P2, a [SOURCE: path:line] opened in this iteration, the release that introduced it, a confidence and a verify command. A bug needs a repro command or a failing check. Restating a release note is not a finding. The orchestrator opens at least two citations per iteration.

Cluster diff size per release (files changed, path-limited to system-skill-advisor and the hook/plugin dirs): beta.1->.0 864; .0->.1 60; .1->.2 127; .2->.3 272; .3->.4-10 269; ->.11 75; ->.12 11; ->.13 213; ->.14 125; ->.15 76; ->.16 87; ->4.0.1.0 214; ->4.0.2.0 381.

Hook sources live in .skilled/hooks/<name>/ (ask-surface-guard, decision-capture, session-relaunch, skill-advisor, goal, git-*, spec-gate and more) with runtime adapters under .claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks, .opencode/plugins (session-history-lookup.js, session-relaunch.js, decision-capture.js), .pi/extensions and .dsh/plugins.

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
- Started: 2026-11-08T19:57:04.000Z

- resource-map.md not present; skipping coverage gate

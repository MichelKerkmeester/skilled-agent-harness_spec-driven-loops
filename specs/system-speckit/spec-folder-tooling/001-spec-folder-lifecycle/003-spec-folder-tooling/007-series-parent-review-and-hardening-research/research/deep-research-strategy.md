# Deep Research Strategy

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
How to harden the series parent rule, the recent-packets listing in create.sh and the seeded trigger phrases shipped in phase 006 of specs/system-speckit/034-spec-folder-tooling, and how to improve the UX so agents group related work into phase parents instead of opening many small singleton packets, using the existing related logic (Gate 3 options and gate-3-classifier, phase thresholds, recommend-level.sh, sub-folder versioning, folder routing, trigger index and phrase judge, skill advisor, the speckit plan and complete commands) as the baseline

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: At the moment an agent decides where new work goes (Gate 3 prompt text, gate-3-classifier.ts, the Gate 3 runtime hook, /speckit:plan setup), does anything surface the series parent rule or the sibling packets, and where are the gaps that still let a related singleton be created?
- [x] Q2: Which existing mechanisms already compute relatedness (gate-3-classifier, folder-routing, the trigger index and lookup, the skill advisor, recommend-level.sh, graph-metadata) and which could detect a same-artifact sibling mechanically instead of relying on the agent to read stderr?
- [x] Q3: How reliable and actionable is the create.sh recent-packets listing (14-day window, created_at source, stderr in non-interactive runs, noise, no same-artifact matching), and what concrete changes would harden it?
- [x] Q4: Can the series parent rule be gamed into a catch-all bucket or misapplied (a correction treated as a new change, cross-track grouping, artifact drift), and what guardrails in validators or metadata would prevent that?
- [x] Q5: How should existing singleton clusters be detected and proposed for retroactive grouping (census tooling, a validator advisory, a proposal step in a speckit command) without noisy false positives or unsafe renumbering?
- [x] Q6: Are the seeded trigger phrases and the template-default judge class robust (phase-child scaffolds, punctuation, non-English text, very short descriptions), and what backfill path for the older specs is safe?
- [x] Q7: Which UX changes across Gate 3 wording, the speckit commands and create.sh output would make grouping the default choice while keeping the operator in control?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any change: this loop recommends, a later phase builds.
- Regrouping specific existing packets: each regroup is an operator decision.
- Re-litigating whether phases or series parents should exist at all.

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: all 10 iterations run; convergence is telemetry only, and a converging run broadens its focus instead of stopping.
- Stop on a pause sentinel or an unrecoverable dispatch error.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: At the moment an agent decides where new work goes (Gate 3 prompt text, gate-3-classifier.ts, the Gate 3 runtime hook, /speckit:plan setup), does anything surface the series parent rule or the sibling packets, and where are the gaps that still let a related singleton be created?
- Q2: Which existing mechanisms already compute relatedness (gate-3-classifier, folder-routing, the trigger index and lookup, the skill advisor, recommend-level.sh, graph-metadata) and which could detect a same-artifact sibling mechanically instead of relying on the agent to read stderr?
- Q3: How reliable and actionable is the create.sh recent-packets listing (14-day window, created_at source, stderr in non-interactive runs, noise, no same-artifact matching), and what concrete changes would harden it?
- Q4: Can the series parent rule be gamed into a catch-all bucket or misapplied (a correction treated as a new change, cross-track grouping, artifact drift), and what guardrails in validators or metadata would prevent that?
- Q5: How should existing singleton clusters be detected and proposed for retroactive grouping (census tooling, a validator advisory, a proposal step in a speckit command) without noisy false positives or unsafe renumbering?
- Q6: Are the seeded trigger phrases and the template-default judge class robust (phase-child scaffolds, punctuation, non-English text, very short descriptions), and what backfill path for the older specs is safe?
- Q7: Which UX changes across Gate 3 wording, the speckit commands and create.sh output would make grouping the default choice while keeping the operator in control?

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
- **Q4:** Guardrails against gaming/misapplying the series parent rule (catch-all bucket, correction-vs-new-change, cross-track grouping, artifact drift). (iteration 1)
- **Q6:** Robustness of seeded trigger phrases / template-default judge class and safe backfill for older specs. (iteration 1)
- **Q7:** UX changes across Gate 3 wording, speckit commands and create.sh output — now with the byte-pinning constraint (f-iter001-006) and the two-canon drift (f-iter001-007) as hard pre-conditions. (iteration 1)
- **Q5:** Detecting and proposing retroactive grouping of existing singleton clusters without false positives or unsafe renumbering. (iteration 1)
- **Q3:** create.sh recent-packets reliability and hardening (14-day window, `created_at` source, stderr in non-interactive runs, noise, no same-artifact matching) — this iteration adds concrete defect candidates: invisible packets without `derived.created_at`, top-level-only scan, 10-row recency cap, and no matching step. (iteration 1)
- **Q6:** Are the seeded trigger phrases and the template-default judge class robust (phase-child scaffolds, punctuation, non-English text, very short descriptions), and what backfill path for the older specs is safe? (iteration 2)
- **Q5:** How should existing singleton clusters be detected and proposed for retroactive grouping (census tooling, a validator advisory, a proposal step in a speckit command) without noisy false positives or unsafe renumbering? (iteration 2)
- **Q4:** Can the series parent rule be gamed into a catch-all bucket or misapplied (a correction treated as a new change, cross-track grouping, artifact drift), and what guardrails in validators or metadata would prevent that? (iteration 2)
- **Q7:** Which UX changes across Gate 3 wording, the speckit commands and create.sh output would make grouping the default choice while keeping the operator in control? — carry the byte-pinning constraint (f-iter001-006), the two-canon drift (f-iter001-007), and this iteration's hardening shortlist as pre-conditions. (iteration 2)
- None of the seven strategy questions remain open; Q1–Q7 are all answered. Under the max-iterations stop policy, iterations 7–10 broaden rather than stop: counterevidence probes and challenges to earlier findings. (iteration 6)
- None tracked. Iteration 8 should fold in the review's WS1-WS4 remediation list and test whether the scoped mode neutralizes the scaffold-text containment clusters (see Next Focus). (iteration 7)
- None tracked. Candidate probes for iteration 9: (a) challenge f-iter008-001's implication that a Gate 1 scope can simply be adopted — find whether any Gate 1 path can carry a scope without violating the byte-pinned delivery receipts (f-iter001-006) or the frozen runtime arrays (f-iter003-002); (b) verify the ~12 absent-carrier bound by reading the generator's exclusion and purge rules; (c) test f-iter008-002's "no conflict" verdict against the fail-loud-versus-advisory-only wording at the seeder call site. (iteration 8)
- None tracked. Candidate probes for iteration 10 (final): (a) read the template source's placeholder block and confirm it matches the perl block byte-for-byte — the baseline any fail-loud guard would compare against; (b) find whether any CI workflow runs `generate-trigger-index.mjs --check` (the mechanical side of the cadence question); (c) check whether `create-track-refresh.vitest.ts` pins the lister's advisory-only returns, so a seeder fail-loud change cannot collide with it. (iteration 9)
- None tracked. All seven strategy questions are closed; this was the tenth and final iteration. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Phase 006 (specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing) shipped: the series parent rule in references/structure/phase-definitions.md section 2, matching wording in sub-folder-versioning.md, phase-system.md, quick-reference.md, spec-folder-authoring-checklist.md, SKILL.md rule 16, AGENTS.md Gate 3 option C and the speckit plan/complete YAML; list_recent_track_packets and replace_template_default_trigger_phrases in runtime/cli/spec/create.sh; the template-default class in runtime/cli/retrieval/lib/phrase-judge.mjs. Known limitations recorded there: the global ~/.claude/CLAUDE.md copy still has the old option C wording; system-skill-advisor packet 026 groups by outcome not artifact; about 195 older specs keep the template phrases. A parallel deep review of phase 006 runs in ../review/; read review/iterations/*.md when present for defects already found. The motivating evidence: on 2026-09-29 five Level 1 packets each fixed one line of the same write recipe, and 21 packets across three tracks were grouped by hand on 2026-10-06 (see the timeline.md files of the four new phase parents).

- Source pointers: the files above plus system-spec-kit/shared/gate-3-classifier.ts, runtime/cli/spec/recommend-level.sh, references/structure/folder-routing.md, references/workflows/quick-reference.md sections 8-9, .skilled/bin/skill-advisor.cjs.
- Integration points: Gate 3 text in AGENTS.md, the speckit command YAML, create.sh output, validate.sh rules.
- Constraints and risks: the Gate 3 hook prompt is byte-compared; rule docs are shared by every runtime.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 (stopPolicy max-iterations)
- Convergence threshold: 0.05 (telemetry only)
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
- Current generation: [from config.lineage.generation]
- Started: [timestamp]

- Resource map: resource-map.md not present; skipping coverage gate.
- Started: 2026-10-07T05:19:14.761Z

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
Audit the Skilled v4 authoring hubs, .skilled/skills/sk-doc/**, .skilled/skills/sk-code/**, .skilled/skills/sk-design/**, .skilled/skills/sk-prompt/** and the commands in .skilled/commands/create/, .skilled/commands/design/ and .skilled/commands/prompt/, across releases v4.0.0.0 to v4.0.2.0. Surfaces: hub routers and mode registries, sk-doc validators, templates, changelog and playbook modes, sk-code modes, surfaces, review and quality config, sk-design chart, diagram and extract modes, sk-prompt prompt-improve and prompt-models. Releases: notes in .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0-beta.1 (baseline), v4.0.0.0 3fed08373e, v4.0.0.1 bcb775402e, v4.0.0.2 7980001709, v4.0.0.3 c9bd4b156c, v4.0.0.4 to v4.0.0.10 all 4d8f403355 (one commit: use each note plus git log --since/--until by date, not tag diffs), v4.0.0.11 e2b2e393fa, v4.0.0.12 7fecd5f219, v4.0.0.13 42b41dd286, v4.0.0.14 bb9b9d1c09, v4.0.0.15 22c3a9b2c7, v4.0.0.16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317. Always path-limit git diff: git diff <prev>..<tag> -- <cluster path>; the unlimited diff times out. Finding types: 1 drift (note vs code vs docs disagree), 2 misalignment with sk-code, sk-doc or Skilled canon, 3 bug, 4 improvement, 5 UX for the operator and the AI user, 6 over-engineering (say what breaks if removed, or that nothing does), 7 extension (a concrete way to extend the logic). Evidence bar for every finding: type, severity P0/P1/P2, [SOURCE: path:line] for a line you read this iteration, the release that introduced it, confidence, and a verify command. A bug needs a repro command or a failing check you ran. Read code, not only release notes. Read-only research: never edit, stage or commit repository files, and run commands only in read-only, check, plan or dry-run modes.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Does every mode listed in the ROUTER.md and mode-registry.json of sk-doc, sk-code, sk-design and sk-prompt resolve to a file that exists, as the parent-hub canon requires?
- [x] Does each hub's SKILL.md and README match what the v4.0.0.0 and v4.0.1.0 notes say it ships, including the sk-design consolidation and the Retired Surfaces section?
- [x] Do the sk-doc authoring validators from v4.0.0.9 pass when run on sk-code, sk-design and sk-prompt themselves, and which check fails?
- [x] Does the sk-code quality-config and review flow from v4.0.0.6 and v4.0.0.16 (Code Quality in Any Repository) work from its documented commands, and what part is untested?
- [x] Do the /create:* commands match the sk-doc mode contracts they route to, including flags, defaults and outputs?
- [x] Do the /design:* commands and sk-design modes match their stated counts (29 chart forms, 27 diagram types) and catalog files?
- [x] Does sk-prompt match its v4.0.0.0 note, and do the cli-* skills consume sk-prompt/assets/cli-prompt-quality-card.md the same way?
- [x] Did the v4.0.0.16 move Changelogs Live in Skills Only leave stale changelog paths or references in these four hubs?
- [x] Do the manual testing playbooks touched in v4.0.1.0 point at files, commands and scenarios that exist?
- [x] Which templates, references, assets or modes across the four hubs have no inbound route or duplicate another, and what breaks if each is removed?
- [x] What friction do the operator and the AI user hit in these hubs: ambiguous mode choice, unclear validator errors, large mandatory loads?
- [x] What concrete extensions would let the four hubs share validators, routing tests or templates, based on gaps found in this run?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Fixing, editing, staging or committing anything outside this run directory.
- Surfaces owned by sibling phases of the parent packet, except where they meet this cluster.
- Releases before v4.0.0.0 or after v4.0.2.0, except as context.

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: convergence is telemetry only and the loop runs to maxIterations.
- Three consecutive executor failures halt the loop for an executor switch, logged in decision-record.md.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Does every mode listed in the ROUTER.md and mode-registry.json of sk-doc, sk-code, sk-design and sk-prompt resolve to a file that exists, as the parent-hub canon requires?
- Does each hub's SKILL.md and README match what the v4.0.0.0 and v4.0.1.0 notes say it ships, including the sk-design consolidation and the Retired Surfaces section?
- Do the sk-doc authoring validators from v4.0.0.9 pass when run on sk-code, sk-design and sk-prompt themselves, and which check fails?
- Does the sk-code quality-config and review flow from v4.0.0.6 and v4.0.0.16 (Code Quality in Any Repository) work from its documented commands, and what part is untested?
- Do the /create:* commands match the sk-doc mode contracts they route to, including flags, defaults and outputs?
- Do the /design:* commands and sk-design modes match their stated counts (29 chart forms, 27 diagram types) and catalog files?
- Does sk-prompt match its v4.0.0.0 note, and do the cli-* skills consume sk-prompt/assets/cli-prompt-quality-card.md the same way?
- Did the v4.0.0.16 move Changelogs Live in Skills Only leave stale changelog paths or references in these four hubs?
- Do the manual testing playbooks touched in v4.0.1.0 point at files, commands and scenarios that exist?
- Which templates, references, assets or modes across the four hubs have no inbound route or duplicate another, and what breaks if each is removed?
- What friction do the operator and the AI user hit in these hubs: ambiguous mode choice, unclear validator errors, large mandatory loads?
- What concrete extensions would let the four hubs share validators, routing tests or templates, based on gaps found in this run?

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
### **"The legacy `SKDOC_CITE_DRIFT_CHECK` opt-out no longer works, so the READMEs are stale."** -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **"The legacy `SKDOC_CITE_DRIFT_CHECK` opt-out no longer works, so the READMEs are stale."**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The legacy `SKDOC_CITE_DRIFT_CHECK` opt-out no longer works, so the READMEs are stale."**

### **"v4.0.0.1's canary fix left a stale `CLAUDE.md` reference."** False. The diff shows all -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **"v4.0.0.1's canary fix left a stale `CLAUDE.md` reference."** False. The diff shows all
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"v4.0.0.1's canary fix left a stale `CLAUDE.md` reference."** False. The diff shows all

### **"v4.0.0.14's fsmonitor fix missed the classifier half of the citation scan."** False. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **"v4.0.0.14's fsmonitor fix missed the classifier half of the citation scan."** False.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"v4.0.0.14's fsmonitor fix missed the classifier half of the citation scan."** False.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **"The legacy `SKDOC_CITE_DRIFT_CHECK` opt-out no longer works, so the READMEs are stale."** (iteration 9)
- **"v4.0.0.1's canary fix left a stale `CLAUDE.md` reference."** False. The diff shows all (iteration 9)
- **"v4.0.0.14's fsmonitor fix missed the classifier half of the citation scan."** False. (iteration 9)

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
- Q9: Do the v4.0.1.0 manual-testing playbooks point at existing files and commands? (iteration 1)
- Q6: Do the `/design:*` commands and sk-design modes match the stated 29 chart forms and 27 diagram types? (iteration 1)
- Q5: Do the `/create:*` commands match the sk-doc mode contracts (flags, defaults, outputs)? (iteration 1)
- Q4: Does the sk-code quality-config and review flow from v4.0.0.6 and v4.0.0.16 work from its documented commands? (iteration 1)
- Q10: Which templates, references, assets or modes have no inbound route or duplicate another? (iteration 1)
- Q12: What concrete extensions would let the hubs share validators, routing tests or templates? (iteration 1)
- Q7: Does sk-prompt match its v4.0.0.0 note, and do the cli-* skills consume `cli-prompt-quality-card.md` consistently? (iteration 1)
- Q11: What friction do the operator and AI user hit? (iteration 1)
- Q8: Did the v4.0.0.16 changelog move leave stale changelog paths in these hubs? (iteration 1)
- Q3: Do the sk-doc authoring validators from v4.0.0.9 pass on sk-code, sk-design and sk-prompt themselves? (iteration 1)
- Q12: What concrete extensions would let the four hubs share validators, routing tests or templates? (iteration 3)
- Q9: Do the manual testing playbooks touched in v4.0.1.0 point at files, commands and scenarios that exist? (iteration 3)
- Q8: Did the v4.0.0.16 move Changelogs Live in Skills Only leave stale changelog paths or references in these four hubs? (iteration 3)
- Q10: Which templates, references, assets or modes across the four hubs have no inbound route or duplicate another? (iteration 3)
- Q11: What friction do the operator and the AI user hit? (iteration 3)
- Q11: What friction do the operator and the AI user hit in these hubs: ambiguous mode choice, unclear validator errors, large mandatory loads? (Partly addressed by F4 and O4.) (iteration 4)
- Q10: Which templates, references, assets or modes across the four hubs have no inbound route or duplicate another, and what breaks if each is removed? (iteration 4)
- Q12: What concrete extensions would let the four hubs share validators, routing tests or templates, based on gaps found in this run? (iteration 4)
- Q11: what friction do the operator and the AI user hit — ambiguous mode choice, unclear validator (iteration 6)
- Q10 (open half): which **templates / references / assets / scripts** in the four hubs have no (iteration 6)
- Whether `none` in sk-design's outcomes was authored deliberately or left from an earlier schema (F2's release row stays "present at v4.0.2.0" until a path-limited `git log` on `hub-router.json` settles it). (iteration 8)
- **Q11** — "What friction do the operator and the AI user hit in these hubs: ambiguous mode choice, unclear validator errors, large mandatory loads?" Only the mandatory-load half is unexamined. (iteration 8)
- **Whether `check-review-findings.js`'s exit 0 is a vacuous pass** (F6) — needs the checker read at the branch that handles a missing findings heading. (iteration 10)
- **Whether any comma-form marker is still emitted** — the emitter is absent from the tree, so F1's blast radius stays archived-mirror-only until someone regenerates a mirror. (iteration 10)
- **Q10 (open half)** — which templates, references, assets or scripts have no inbound route: still open. This iteration added two candidates (the dead marker exemption, F4) but did not sweep. (iteration 10)
- **Whether sk-prompt's missing metadata trio is deliberate** (F5) — no doc states it; the shape differs from its three peers without a stated reason. (iteration 10)
- **Q10 (open half)** — which templates, references, assets or scripts in the four hubs have no inbound route. Unchanged from iteration 10; candidate count still two (`palette-sheet-ordered.html`, `palette-sheet-categorical.html`, now attributed to `5dbd8c9480`/`v4.0.0.0`) plus the dead marker exemption. (iteration 11)
- **F4's consumer** — which script concatenates `leaf-manifest.json`'s `packet` with its `leaves`. Not found in the budget; until it is, f-iter001-001's blast radius is a hypothesis. (iteration 11)
- **Whether any v4-line note claim can be trusted without a code probe** — F2 found one claim (sk-prompt DEPTH) that was true at the tag while the packet changelog was premature, and F1 found a claim (`--apply`) that was never made at all but was recorded in the registry as made. Both suggest the registry's note-versus-code rows should all carry a `git show` of the tag, not a read of the note. (iteration 11)
- **F3's audit lesson is stated, not yet tested** — no iteration ran a `-S --follow` sweep of the whole hub tree to quantify how much survived the `.opencode` rename unchanged. The probe count here (13 of 30) is a sample from the registry, not a measured population. (iteration 11)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
None. No handover.md and no prior research in specs/system-speckit/runtime-and-release/004-v4-release-line-research/002-authoring-hubs; the free-text recipe was not run because the topic is a long brief rather than a search phrase.

resource-map.md not present; skipping coverage gate

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
- Per-iteration budget: 24 tool calls, 10 minutes (executor timeout 2400 seconds)
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
- Started: 2026-11-08T19:57:06.773Z

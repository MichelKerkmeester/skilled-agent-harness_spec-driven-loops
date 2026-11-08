---
title: "Deep Research Strategy: doctor overlay and external-repo UX"
description: "Session tracking for the 5-iteration cli-devin research on system-skilled-doctor overlay logic and external-repo user experience."
trigger_phrases:
  - "doctor ux research strategy"
importance_tier: normal
contextType: research
---

# Deep Research Strategy - Doctor Overlay and External-Repo UX

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
How can system-skilled-doctor, its /doctor commands, mainly the overlay logic (overlay-engine.cjs, /doctor:overlay status/apply/capture/repin/rollback, overlay-guard hook, .skilled-overlays.json, protectedPaths, repin.exclude, not-copied list), and the user experience for external repositories that link or copy Skilled in (INSTALL-SKILLED.md, /doctor:install, /doctor:symlink, /doctor:setup, /doctor:helper) be improved? Cover correctness gaps, confusing or missing commands and messages, onboarding friction for a new external repo, upgrade/re-pin safety, and doc accuracy versus code. Rank recommendations by user impact.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Where is overlay-engine.cjs (status/apply/capture/repin/rollback) incorrect or unsafe against its own docs and tests, for example manifest drift, protectedPaths and repin.exclude handling, the not-copied list, partial failure and rollback?
- [ ] Q2: Which /doctor command messages, prompts and outputs confuse an external-repo user or leave them without a next step (overlay, install, symlink, setup, helper)?
- [x] Q3: What onboarding friction does a brand-new external repository hit when linking or copying Skilled in, from INSTALL-SKILLED.md through /doctor:install, /doctor:symlink and /doctor:setup?
- [x] Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from?
- [ ] Q5: Where do INSTALL-SKILLED.md, overlays.md, the doctor command docs and the skill README disagree with the code, and which improvements rank highest by user impact?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any fix: this run only researches and ranks.
- Barter-specific manifests or files (never open Barter coder/.env).
- Doctor targets unrelated to overlays and external-repo onboarding (ci, mcp, deep-loop, sk-code, skill-advisor internals).

---

## 5. STOP CONDITIONS
- Stop policy max-iterations: all 5 iterations run; convergence is telemetry only.
- Stop early only on 3 consecutive failed iterations or a pause sentinel.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Where is overlay-engine.cjs (status/apply/capture/repin/rollback) incorrect or unsafe against its own docs and tests, for example manifest drift, protectedPaths and repin.exclude handling, the not-copied list, partial failure and rollback?
- Q3: What onboarding friction does a brand-new external repository hit when linking or copying Skilled in, from INSTALL-SKILLED.md through /doctor:install, /doctor:symlink and /doctor:setup?
- Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from?

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
- Carried forward: Are `status`/`apply`/`capture` classifications correct for every `skill-root` and `json-entry` shape, and does the engine detect a manifest `pin.commit` that disagrees with the bytes actually in the tree? (iteration 1)
- Q2: Which `/doctor` command messages, prompts and outputs confuse an external-repo user or leave them without a next step? (iteration 1)
- Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from? (iteration 1)
- Q5: Where do `INSTALL-SKILLED.md`, `overlays.md`, the doctor command docs and the skill README disagree with the code, and which improvements rank highest by user impact? (iteration 1)
- Q3: What onboarding friction does a brand-new external repository hit from `INSTALL-SKILLED.md` through `/doctor:install`, `/doctor:symlink` and `/doctor:setup`? (iteration 1)
- Q2: Which `/doctor` command messages, prompts and outputs confuse an external-repo user or leave them without a next step? (partially touched by F3, F9; not answered as a whole) (iteration 2)
- Carried forward from iteration 1: are `status`/`apply`/`capture` classifications correct for every `skill-root` and `json-entry` shape, and does the engine detect a manifest `pin.commit` that disagrees with the bytes actually in the tree? (iteration 2)
- Residual: `pinnedSha256` scope validation for multi-output entries; whether `apply` repairs layout links; `capture` bodies for `json-entry` and `skill-root`. (iteration 3)
- Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from? (pin-drift is now covered; the guard hook is untouched) (iteration 3)
- Residual from this iteration: the `release-update.cjs` upgrade path; whether each adapter passes a `sessionDir` that makes relative write paths resolve against the tree root rather than the hook process's cwd; whether the guard's per-path spawn is measurably slow on the largest overlay manifests. (iteration 4)
- Q2: Which `/doctor` command messages, prompts and outputs confuse an external-repo user or leave them without a next step? (partially touched; not answered as a whole) (iteration 4)
- Residual from iteration 3: `pinnedSha256` scope validation for multi-output entries; whether `apply` repairs layout links; `capture` bodies for `json-entry` and `skill-root`. (iteration 4)
- Q5: Where do `INSTALL-SKILLED.md`, `overlays.md`, the doctor command docs and the skill README disagree with the code? Still open as a whole. This iteration contributes one confirmed disagreement (F5: an enforced field with no documentation) and one partial (F1: an accepted-but-inert field with no documentation of its scope). (iteration 5)
- Q2: Which `/doctor` command messages, prompts and outputs confuse an external-repo user or leave them without a next step? Still open as a whole. This iteration adds three message-level data points (F2, F3, F6) but does not survey the install/symlink/setup/helper surface. (iteration 5)
- New residual: whether `loadManifest` rejects `pinnedSha256` on non-`file` scopes, and whether it rejects unknown keys at all. Confirming this decides whether F1 is "silently inert" or "silently inert plus a missing validation". (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
New residual: whether `loadManifest` rejects `pinnedSha256` on non-`file` scopes, and whether it rejects unknown keys at all. Confirming this decides whether F1 is "silently inert" or "silently inert plus a missing validation".

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior packets under specs/system-skilled-doctor/001-skill-and-overlay-build/ built this surface: 002 overlay engine, 003 repin, 004 guard hook, 005 Barter parity (5-iteration pi research plus fixes), 006 setup guide (INSTALL-SKILLED.md). Their spec.md, implementation-summary.md and research/ folders record what is already decided and fixed; do not re-report fixed items as new.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: .skilled/commands/doctor/scripts/overlay-engine.cjs, symlink-engine.cjs, doctor-helper-match.cjs, release-update.cjs; .skilled/commands/doctor/{overlay,install,symlink,setup,helper,update}.md and assets/; .skilled/hooks/overlay-guard/ (lib + per-runtime adapters); .skilled/skills/system-skilled-doctor/{SKILL.md,README.md,references/overlays.md,manual-testing-playbook/}; INSTALL-SKILLED.md and README.md at the repo root.
- Tests: .skilled/commands/doctor/scripts/tests/, .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs.
- Integration points: .skilled-overlays.json manifest schema, protectedPaths, repin.exclude, the not-copied list, runtime mirror folders (.claude, .opencode, .codex, .pi, .devin, .cursor).
- Resource map: resource-map.md not present; skipping coverage gate.
- Constraints and risks: research only; the doctor suite is green at 1072/1072 on this base.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 30 minutes
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
- Started: 2026-11-08T16:26:27Z

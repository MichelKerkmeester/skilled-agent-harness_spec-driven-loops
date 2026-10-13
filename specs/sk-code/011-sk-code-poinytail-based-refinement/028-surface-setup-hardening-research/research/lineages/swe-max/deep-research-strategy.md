
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
Surface setup hardening for external sk-code users. Skilled assumes every sk-code surface except sk-code-opencode (the native surface, lowest priority for an external user) and sk-code-review (workflow) is irrelevant to an external user, that sk-code-obsidian and sk-code-webflow are the operator's personal examples an external user deletes, that shared/ and sk-code-quality stay, and that any surface the user adds outranks sk-code-opencode. The tie order today is quality, review, opencode, obsidian, webflow (.skilled/skills/sk-code/hub-router.json routerPolicy.tieBreak). Already shipped and NOT to be re-recommended: phase 025 research (specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md, F1-F96, R1-R10, X1-X24; its section 14 is the final list); phase 026 built R1 (/create:skill-parent update --surfaces places a new surface ahead of sk-code-opencode), R2 (sk-code drift guards tolerate removed examples), R3 and R7 (doctor, guard and sync messages name the fix; a missing authored closure is a named failure), R8 (scaffold handoff names the canary and re-mint follow-ups), R4 and R9 (examples marked, the root README block "What Adapting `sk-code` Looks Like" is the single external-user guide, release note v4.0.0.5); phase 027 added doctor check 5l in .skilled/commands/doctor/scripts/parent-skill-check.cjs that reports a hand-placed surface after sk-code-opencode in tieBreak unless it is one of the two examples. Operator ruling R5 stands: sk-code-opencode keeps its generic language keywords (report its UX cost only). Answer with path:line or command evidence, classify every finding NEW or ALREADY-COVERED (name the 025 F/R/X id or 026/027), and observe behavior in throwaway copies only: (1) remaining ways the assumption breaks: hand edits to tieBreak, mode-registry.json or hub-router.json, skill-advisor routing (graph metadata, scorer boosts, batteries), compiled routing (manifest, canary fixtures, authored copies), the Hermes copies and the other runtimes' mirrors (.opencode, .claude, .codex, .cursor, .devin, .pi, .hermes), manual-testing playbooks, benchmarks, canaries, feature catalogs, and a fresh clone; (2) the end-to-end external-user journey from clone to a green battery (doctor, guard, sync, drift guards, advisor, one routed prompt), with every friction point; (3) automation that removes manual steps without a judgment call; (4) the operator's two shapes weighed against each other with better names: a new doctor command such as `/doctor sk-code-setup` referenced and integrated in the sk-code hub, versus a new mode inside the sk-code hub such as `sk-code-setup`; for each, where it would be referenced, what it would run, its cost and blast radius, and which existing surfaces (doctor command family under .skilled/commands/doctor/, hub mode-registry, /create:skill-parent) it would overlap; (5) ideas to reject and why. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the failure it prevents today, the smallest change, and the cheaper move that fails.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Where can the assumption still break (hand edits to tieBreak or the registries, skill-advisor routing, compiled routing, Hermes copies, runtime mirrors, playbooks, benchmarks, canaries, feature catalogs, fresh clones)?
- [x] Q2: What does an external user do from clone to a green battery, and where is each friction point?
- [x] Q3: Which manual steps can existing automation absorb without a judgment call?
- [x] Q4: Should the setup be a new doctor command or a new sk-code hub mode, what should it be called, where would it be referenced and what does each cost?
- [x] Q5: Which ideas should be rejected, and why?
- [x] Q6: Which findings are NEW and which are ALREADY-COVERED by 025, 026 or 027?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing any skill, command, script or README; this is research only.
- Re-recommending what 025, 026 or 027 already shipped.
- Changing sk-code-opencode's generic language keywords (operator ruling R5).

---

## 5. STOP CONDITIONS
- Five iterations completed (stop policy max-iterations).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q2: What does an external user do from clone to a green battery, and where is each friction point?
- Q3: Which manual steps can existing automation absorb without a judgment call?
- Q4: Should the setup be a new doctor command or a new sk-code hub mode, what should it be called, where would it be referenced and what does each cost?
- Q5: Which ideas should be rejected, and why?
- Q6: Which findings are NEW and which are ALREADY-COVERED by 025, 026 or 027?

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
### `compiled-route-admission.cjs` is not the mint entry point (rejects `--help`, interface undetermined in budget). What would settle it: find the generator of `013-live-activation/activation/*/manifest.json` — likely the admission pipeline under `.skilled/bin/lib/compiled-routing/` — and check whether `update --surfaces` calls it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `compiled-route-admission.cjs` is not the mint entry point (rejects `--help`, interface undetermined in budget). What would settle it: find the generator of `013-live-activation/activation/*/manifest.json` — likely the admission pipeline under `.skilled/bin/lib/compiled-routing/` — and check whether `update --surfaces` calls it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `compiled-route-admission.cjs` is not the mint entry point (rejects `--help`, interface undetermined in budget). What would settle it: find the generator of `013-live-activation/activation/*/manifest.json` — likely the admission pipeline under `.skilled/bin/lib/compiled-routing/` — and check whether `update --surfaces` calls it.

### Hand-editing `leaf-manifest.json`: generator-owned; `10b` byte-drift fires on same entries/different bytes. `generate-leaf-manifest.cjs --write` is the only writer. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Hand-editing `leaf-manifest.json`: generator-owned; `10b` byte-drift fires on same entries/different bytes. `generate-leaf-manifest.cjs --write` is the only writer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-editing `leaf-manifest.json`: generator-owned; `10b` byte-drift fires on same entries/different bytes. `generate-leaf-manifest.cjs --write` is the only writer.

### New copy probes this iteration: consolidation focus; the two open Q1 tails need a copy and are deferred, not dead. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: New copy probes this iteration: consolidation focus; the two open Q1 tails need a copy and are deferred, not dead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New copy probes this iteration: consolidation focus; the two open Q1 tails need a copy and are deferred, not dead.

### None definitively; the add-surface leg (slash command requires an AI runtime) is deferred, not dead. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None definitively; the add-surface leg (slash command requires an AI runtime) is deferred, not dead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None definitively; the add-surface leg (slash command requires an AI runtime) is deferred, not dead.

### None new. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: None new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new.

### None new. Iteration 1's BLOCKED directions respected: I used the provisioned copy only for the *add* leg (which needs node_modules for the generators), not to re-test the clone journey. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None new. Iteration 1's BLOCKED directions respected: I used the provisioned copy only for the *add* leg (which needs node_modules for the generators), not to re-test the clone journey.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. Iteration 1's BLOCKED directions respected: I used the provisioned copy only for the *add* leg (which needs node_modules for the generators), not to re-test the clone journey.

### Probing which single invariant blocks `resolve hubs`: exhausted 3 sync attempts with distinct fixes applied; the blocker is upstream of doctor's invariant set (activation manifest mint), not a missing packet field (frontmatter completed to match `sk-code-obsidian`'s shape and sync still failed). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Probing which single invariant blocks `resolve hubs`: exhausted 3 sync attempts with distinct fixes applied; the blocker is upstream of doctor's invariant set (activation manifest mint), not a missing packet field (frontmatter completed to match `sk-code-obsidian`'s shape and sync still failed).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Probing which single invariant blocks `resolve hubs`: exhausted 3 sync attempts with distinct fixes applied; the blocker is upstream of doctor's invariant set (activation manifest mint), not a missing packet field (frontmatter completed to match `sk-code-obsidian`'s shape and sync still failed).

### Re-reading individual 025 F-rows: sections 5-9/13-14 carry the verified rulings; row-level detail unchanged by this pass. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-reading individual 025 F-rows: sections 5-9/13-14 carry the verified rulings; row-level detail unchanged by this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reading individual 025 F-rows: sections 5-9/13-14 carry the verified rulings; row-level detail unchanged by this pass.

### Re-running the provisioned-copy recipe (APFS clone with node_modules): the dispatch's control-run is already green there and it cannot reproduce the external user's clone path — it masks the provisioning gap (same masking 025 V0 had via symlinked node_modules). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Re-running the provisioned-copy recipe (APFS clone with node_modules): the dispatch's control-run is already green there and it cannot reproduce the external user's clone path — it masks the provisioning gap (same masking 025 V0 had via symlinked node_modules).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the provisioned-copy recipe (APFS clone with node_modules): the dispatch's control-run is already green there and it cannot reproduce the external user's clone path — it masks the provisioning gap (same masking 025 V0 had via symlinked node_modules).

### Testing `sync-skills-hermes.cjs` and `test_readme_manifest.py` on the add leg: not run (clock). What would settle it: run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` (or its --check equivalent) in `$X` and observe whether a new packet produces a named drift line. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Testing `sync-skills-hermes.cjs` and `test_readme_manifest.py` on the add leg: not run (clock). What would settle it: run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` (or its --check equivalent) in `$X` and observe whether a new packet produces a named drift line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Testing `sync-skills-hermes.cjs` and `test_readme_manifest.py` on the add leg: not run (clock). What would settle it: run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` (or its --check equivalent) in `$X` and observe whether a new packet produces a named drift line.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None definitively; the add-surface leg (slash command requires an AI runtime) is deferred, not dead. (iteration 1)
- Re-running the provisioned-copy recipe (APFS clone with node_modules): the dispatch's control-run is already green there and it cannot reproduce the external user's clone path — it masks the provisioning gap (same masking 025 V0 had via symlinked node_modules). (iteration 1)
- None new. Iteration 1's BLOCKED directions respected: I used the provisioned copy only for the *add* leg (which needs node_modules for the generators), not to re-test the clone journey. (iteration 2)
- Testing `sync-skills-hermes.cjs` and `test_readme_manifest.py` on the add leg: not run (clock). What would settle it: run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` (or its --check equivalent) in `$X` and observe whether a new packet produces a named drift line. (iteration 2)
- `compiled-route-admission.cjs` is not the mint entry point (rejects `--help`, interface undetermined in budget). What would settle it: find the generator of `013-live-activation/activation/*/manifest.json` — likely the admission pipeline under `.skilled/bin/lib/compiled-routing/` — and check whether `update --surfaces` calls it. (iteration 4)
- Hand-editing `leaf-manifest.json`: generator-owned; `10b` byte-drift fires on same entries/different bytes. `generate-leaf-manifest.cjs --write` is the only writer. (iteration 4)
- Probing which single invariant blocks `resolve hubs`: exhausted 3 sync attempts with distinct fixes applied; the blocker is upstream of doctor's invariant set (activation manifest mint), not a missing packet field (frontmatter completed to match `sk-code-obsidian`'s shape and sync still failed). (iteration 4)
- New copy probes this iteration: consolidation focus; the two open Q1 tails need a copy and are deferred, not dead. (iteration 5)
- None new. (iteration 5)
- Re-reading individual 025 F-rows: sections 5-9/13-14 carry the verified rulings; row-level detail unchanged by this pass. (iteration 5)

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
- Whether the `.` and `.skilled` provision roots are individually required for the failing checks, or only for test/conformance paths (the battery passed after full provision; the subset was not isolated). (iteration 3)
- `sync-skills-hermes.cjs` / `test_readme_manifest.py` behavior on the add leg (carried from iteration 2's dead end — not retried, still unobserved). (iteration 3)
- Q1 legs unprobed this iteration: skill-advisor graph metadata/scorer boosts, Hermes copies, runtime mirrors, canary/benchmark/catalog surfaces under hand edits. (iteration 3)
- Q1 tail stays open by deferral, not exhaustion: whether `.` and `.skilled` provision roots are individually required (subset never isolated); `sync-skills-hermes.cjs`/`test_readme_manifest.py` add-leg behavior (never observed). Consolidation consumed the budget; both are recorded for the packet's open questions. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1 tail stays open by deferral, not exhaustion: whether `.` and `.skilled` provision roots are individually required (subset never isolated); `sync-skills-hermes.cjs`/`test_readme_manifest.py` add-leg behavior (never observed). Consolidation consumed the budget; both are recorded for the packet's open questions.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior synthesis: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md (section 14 is the final list). Builds: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/ (five children) and 027-surface-tie-order-warning/. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 9 minutes
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
- Started: 2026-10-13T17:31:25.170Z

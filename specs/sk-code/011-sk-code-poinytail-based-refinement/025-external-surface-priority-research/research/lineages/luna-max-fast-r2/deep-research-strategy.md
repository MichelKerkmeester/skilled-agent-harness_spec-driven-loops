
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
Round two of the external sk-code surface priority research. Round one (research/research.md in this spec folder, findings F1-F33, recommendations R1-R5, rejected ideas X1-X9, phases P1-P4) found that the one order source is sk-code hub-router.json routerPolicy.tieBreak; a user's own surface outranks the native sk-code-skilled if it is inserted ahead of opencode (R1); stack-agnostic tooling must stop naming the obsidian and webflow examples (R2); deleting the examples must become a documented, verified path including the re-mint and authored copy (R3); the two surfaces must be marked as examples (R4); R5 (opencode generic keywords) stays as is by operator ruling. Background: sk-code-obsidian and sk-code-webflow are the operator's personal example surfaces; an external user deletes them and adds their own surface, which must outrank sk-code-skilled. sk-code-review, sk-code-quality and shared/ are stack-agnostic. Round two goes deeper, with path:line or command evidence: (1) F10, ROUTER.md stack-agnostic intents (debugging, performance, deployment, accessibility, implementation) load mostly or only Webflow leaves, so after an external user deletes webflow those intents load almost nothing: what shared/ or opencode leaves could serve them, and a proposed R6; (2) F20, compiled-routing re-mint depends on the authored closure under specs/sk-doc/z_archive/019-skill-routing-refactor/, so a user who prunes specs/ cannot re-mint: cost and blast radius of fixing it versus documenting it, and R7 or a reasoned no; (3) F18, adding a surface by hand fails five doctor legs (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary): does /create:skill-parent update --surfaces (.skilled/commands/create/skill-parent.md and its assets) perform those steps, observed in a throwaway full-tree copy; (4) stress-test R1-R4: exact edit text, every file each one touches (including the auto twin of create-skill-parent-confirm.yaml, both README tables, the sk-code README), what can still break, and whether each is the smallest correct fix under .skilled/repo-rules/prevent-overengineering.md; (5) anything round one missed: other hubs or tooling that assume sk-code's examples (benchmarks, playbooks, feature catalogs, advisor batteries and fixtures, Hermes and runtime mirrors, CI workflows under .github/, install guides, /doctor:update release-engine keep-local rules) and the end-to-end external-user flow (clone, delete examples, add own surface, run doctor, route a prompt); (6) challenge the rejected ideas X1-X9 once more and name new rejections. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the cheaper move and why it fails. Number new findings from F34, new recommendations from R6 and new rejections from X10 only in the final synthesis; inside iterations use the finding-row format the preamble gives.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q7: F10, which shared/ or sk-code-skilled leaves could serve the stack-agnostic ROUTER.md intents once webflow is deleted, and what is the smallest fix (R6)?
- [x] Q8: F20, what does fixing the compiled-routing re-mint dependency on specs/sk-doc/z_archive/019-skill-routing-refactor/ cost across every hub, versus documenting it (R7 or a reasoned no)?
- [x] Q9: F18, does /create:skill-parent update --surfaces perform the five steps a hand-added surface misses (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary), observed in a throwaway full-tree copy?
- [ ] Q10: R1-R4 stress test, what exact edit text and which files does each touch, what can still break, and is each the smallest correct fix?
- [ ] Q11: What other hubs, tooling, CI, mirrors, catalogs, playbooks, batteries or release-engine rules assume the obsidian and webflow examples, and what does the end-to-end external-user flow hit?
- [x] Q12: Do the rejected ideas X1-X9 still hold, and which new ideas should be rejected?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Changing any skill, script, command, README or release note; deleting anything inside the worktree; building the recommendation; R5 (operator ruled it stays).

---

## 5. STOP CONDITIONS
Stop policy is max-iterations: all 10 iterations run. An unavailable executor or a usage limit stops the lineage with no substitute.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q7: F10, which shared/ or sk-code-skilled leaves could serve the stack-agnostic ROUTER.md intents once webflow is deleted, and what is the smallest fix (R6)?
- Q8: F20, what does fixing the compiled-routing re-mint dependency on specs/sk-doc/z_archive/019-skill-routing-refactor/ cost across every hub, versus documenting it (R7 or a reasoned no)?
- Q9: F18, does /create:skill-parent update --surfaces perform the five steps a hand-added surface misses (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary), observed in a throwaway full-tree copy?
- Q12: Do the rejected ideas X1-X9 still hold, and which new ideas should be rejected?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- parsing the router's explicit intent rows and checking actual copy paths separates a mapped path from a surviving leaf. (iteration 1)
- a fresh full-tree clone isolates the doctor output while retaining the compiled-routing closure and baseline files. (iteration 2)
- editing only the throwaway copy's tieBreak and running refresh plus the authored manifest copy isolates the ordering behavior; the canary fixture provides a concrete two-surface prompt. (iteration 4)
- the single-file verifier edit plus example-directory deletion isolated its static list from the stale authored route corpus; the integrated gate exposed both distinct failure layers. (iteration 5)
- rereading the exact doctor and hub docs isolated the external-user dead ends: the packet error has no recovery guidance, and the repair omits the authored-manifest copy. (iteration 6)
- an exact-name search across non-example runtime, tool and documentation paths surfaced consumers beyond the hub itself, especially the feature catalog, quality references and mirrored skill files. (iteration 7)
- independent full-tree copies separated the clean baseline from the example-deletion state. The actual doctor output showed the complete first failure summary, while compiled-route calls exposed the difference between OpenCode routing and an unregistered Rails prompt. (iteration 8)
- reading both workflow twins side by side exposed which add steps already exist and which promises are absent. (iteration 9)
- the isolated COPY_A deletion directly tested the known `specs/` dependency without touching the repository, and the current source reads distinguished static workflow promises from observed command behavior. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the drift guard validates router synchronization but does not emit a prompt-specific load trace; do not present the availability table as runtime execution. (iteration 1)
- a mechanical Webflow clone is not a valid authored surface; the doctor correctly exposed duplicate aliases, missing vocabulary declarations, and stale generated metadata in addition to the expected five. (iteration 2)
- the first manifest search assumed activation-manifest.json, but the refresh command exposes the actual manifest.json path. The route output also does not expose scoring, so the tie itself cannot be proven from that receipt alone. (iteration 4)
- this isolated deletion is not a complete external-user migration. The retained mode registry, hub router and prose intentionally kept references to the deleted packets. (iteration 5)
- the copy harness failed to parse (`Unexpected identifier '

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A new doctor order rule as part of minimal R1: 5e/5i have no user/native classification, so enforcing it requires a broader contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A new doctor order rule as part of minimal R1: 5e/5i have no user/native classification, so enforcing it requires a broader contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new doctor order rule as part of minimal R1: 5e/5i have no user/native classification, so enforcing it requires a broader contract.

### A README-only R1 edit: the scaffold and parent-skill checklist still omit insertion position. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A README-only R1 edit: the scaffold and parent-skill checklist still omit insertion position.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A README-only R1 edit: the scaffold and parent-skill checklist still omit insertion position.

### No source approach exhausted. The full command-runtime invocation was unavailable in the throwaway copy; the prompt expressly directs hand execution of model-driven YAML writes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No source approach exhausted. The full command-runtime invocation was unavailable in the throwaway copy; the prompt expressly directs hand execution of model-driven YAML writes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No source approach exhausted. The full command-runtime invocation was unavailable in the throwaway copy; the prompt expressly directs hand execution of model-driven YAML writes.

### None established. Deletion-dependent manual and quality paths still need a bounded throwaway-copy check. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: None established. Deletion-dependent manual and quality paths still need a bounded throwaway-copy check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None established. Deletion-dependent manual and quality paths still need a bounded throwaway-copy check.

### None established. The complete R3 migration remains untested. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None established. The complete R3 migration remains untested.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None established. The complete R3 migration remains untested.

### None. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

### Treating `--surfaces` as a complete compiled-routing re-mint: the YAML names package generation and leaf-manifest generation, while the doctor's second-copy output remains the decisive check for missing legs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `--surfaces` as a complete compiled-routing re-mint: the YAML names package generation and leaf-manifest generation, while the doctor's second-copy output remains the decisive check for missing legs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `--surfaces` as a complete compiled-routing re-mint: the YAML names package generation and leaf-manifest generation, while the doctor's second-copy output remains the decisive check for missing legs.

### Treating `compiled-route-guard.cjs` as a re-mintability check: it returned exit 0 with `specs/` absent and checks served-runtime freshness instead. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `compiled-route-guard.cjs` as a re-mintability check: it returned exit 0 with `specs/` absent and checks served-runtime freshness instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `compiled-route-guard.cjs` as a re-mintability check: it returned exit 0 with `specs/` absent and checks served-runtime freshness instead.

### Treating advisor Obsidian/Webflow marker fixtures as dependencies on installed sk-code packets: the test builds temporary workspaces and asserts the hint value directly. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating advisor Obsidian/Webflow marker fixtures as dependencies on installed sk-code packets: the test builds temporary workspaces and asserts the hint value directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating advisor Obsidian/Webflow marker fixtures as dependencies on installed sk-code packets: the test builds temporary workspaces and asserts the hint value directly.

### Treating the archived benchmark PASS as a deletion-test result: its own report has zero eligible/scored rows and routes gold to the Webflow example. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating the archived benchmark PASS as a deletion-test result: its own report has zero eligible/scored rows and routes gold to the Webflow example.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the archived benchmark PASS as a deletion-test result: its own report has zero eligible/scored rows and routes gold to the Webflow example.

### Treating the current `/create:skill-parent update --surfaces` command as a complete removal path; its command contract has no removal option, and the earlier simulations did not clear all doctor legs. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the current `/create:skill-parent update --surfaces` command as a complete removal path; its command contract has no removal option, and the earlier simulations did not clear all doctor legs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the current `/create:skill-parent update --surfaces` command as a complete removal path; its command contract has no removal option, and the earlier simulations did not clear all doctor legs.

### Treating the failed COPY_A harness as a successful deletion or full-checklist test. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the failed COPY_A harness as a successful deletion or full-checklist test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the failed COPY_A harness as a successful deletion or full-checklist test.

### Treating the minimal hand-copy failures as only five: the probe also exposed failures from duplicate aliases, absent vocabulary classes, and the intentionally stale manifest. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the minimal hand-copy failures as only five: the probe also exposed failures from duplicate aliases, absent vocabulary classes, and the intentionally stale manifest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the minimal hand-copy failures as only five: the probe also exposed failures from duplicate aliases, absent vocabulary classes, and the intentionally stale manifest.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- No source approach exhausted. The full command-runtime invocation was unavailable in the throwaway copy; the prompt expressly directs hand execution of model-driven YAML writes. (iteration 2)
- Treating `--surfaces` as a complete compiled-routing re-mint: the YAML names package generation and leaf-manifest generation, while the doctor's second-copy output remains the decisive check for missing legs. (iteration 2)
- Treating the minimal hand-copy failures as only five: the probe also exposed failures from duplicate aliases, absent vocabulary classes, and the intentionally stale manifest. (iteration 2)
- Treating `compiled-route-guard.cjs` as a re-mintability check: it returned exit 0 with `specs/` absent and checks served-runtime freshness instead. (iteration 3)
- A new doctor order rule as part of minimal R1: 5e/5i have no user/native classification, so enforcing it requires a broader contract. (iteration 4)
- A README-only R1 edit: the scaffold and parent-skill checklist still omit insertion position. (iteration 4)
- None. (iteration 4)
- None established. The complete R3 migration remains untested. (iteration 6)
- Treating the current `/create:skill-parent update --surfaces` command as a complete removal path; its command contract has no removal option, and the earlier simulations did not clear all doctor legs. (iteration 6)
- Treating the failed COPY_A harness as a successful deletion or full-checklist test. (iteration 6)
- None established. Deletion-dependent manual and quality paths still need a bounded throwaway-copy check. (iteration 7)
- Treating advisor Obsidian/Webflow marker fixtures as dependencies on installed sk-code packets: the test builds temporary workspaces and asserts the hint value directly. (iteration 7)
- Treating the archived benchmark PASS as a deletion-test result: its own report has zero eligible/scored rows and routes gold to the Webflow example. (iteration 7)

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
- Q8–Q12 remain for later iterations: re-mint dependency; surface-add workflow; R1–R4 stress test; other example assumptions and end-to-end flow; rejected ideas. (iteration 1)
- Q8: re-mint source dependency and repair cost. (iteration 2)
- Q10: exact R1-R4 edits and minimum scope. (iteration 2)
- Q12: challenge X1-X9 and identify new rejections. (iteration 2)
- Q11: other example assumptions and end-to-end external-user flow. (iteration 2)
- Q10: exact R1-R4 edits, touched files, residual breakage, and minimum scope. (iteration 3)
- Q11: other example assumptions and the complete external-user flow. (iteration 3)
- Q11: inspect other example assumptions and the complete external-user flow. (iteration 4)
- Q10: validate exact R2-R4 edits, all touched files, and their minimum scope; reconcile the prepared base with the checked-out tree. (iteration 4)
- Q10: exact R1–R4 edits, touched files, residual failures and minimum correct scope, including R3 and R4. (iteration 5)
- Q11: other example assumptions and full external-user flow. (iteration 5)
- Q12: challenge rejected ideas X1–X9 and identify new rejections. (iteration 5)
- Q11: survey other tooling assumptions and the complete external-user flow. (iteration 6)
- Q12: challenge X1-X9 and identify additional rejected options. (iteration 6)
- Q10: run all R3 edits in a fresh copy and adjudicate each required check and routing prompt. (iteration 6)
- Q10: exact R1-R4 edit set and minimum scope. (iteration 7)
- Q11: verify which located tooling actually fails after deletion, inspect any remaining runtime/release-engine hits and complete the clone-delete-add-doctor-route flow. (iteration 7)
- Q12: Rejected ideas X1-X9 and new rejections were not revisited. (iteration 8)
- Q10: Exact R1-R4 edits, all touched files, and smallest correct fix remain open. (iteration 8)
- Q11: The Rails add step, post-add doctor, prompt routing, full CI and remaining mirrors/release-engine consumers remain untested. (iteration 8)
- Q10: exact R1-R4 file set and wording still need reconciliation against the current complete repo tree, especially both YAML twins, the README tables and sk-code README. (iteration 9)
- The --surfaces workflow was not run in a throwaway copy. Static YAML is not proof that the five F18 doctor legs pass. (iteration 9)
- Q11: benchmarks, playbooks, feature catalog, CI, runtime mirrors, install guides and full clone-delete-add-doctor-route flow were not exercised in this iteration. (iteration 9)
- Q11 remains open: no complete survey of benchmarks, playbooks, feature catalogs, advisor fixtures, runtime mirrors, CI, install guides, release-engine keep-local rules, or clone-delete-add-doctor-route flow was performed. (iteration 10)
- The prior X1–X9 rejection evidence was not independently re-run in this pass. Iterations 1–4 were not fully re-opened, and the five F18 doctor legs were not observed after a real slash-workflow update. (iteration 10)
- Q10 remains partial: exact locations and candidate wording for R1/R4 were checked, but the complete file-by-file R1–R4 diff and residual validation matrix were not re-opened end to end. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q10 remains partial: exact locations and candidate wording for R1/R4 were checked, but the complete file-by-file R1–R4 diff and residual validation matrix were not re-opened end to end.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work: round one of this packet, research/research.md (F1-F33, R1-R5, X1-X9, P1-P4) and its lineages dsflash-devin and luna-max-fast under research/lineages/. resource-map.md not present for this lineage; skipping coverage gate.

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
- Started: 2026-10-12T18:58:06.247Z
`) before executing, so the requested checks were not run. (iteration 6)
- no copy run means the static dependency list does not prove which playbook or quality failure is observed at runtime, and the bounded search cannot close the end-to-end journey. (iteration 7)
- the command workflow itself is a slash-command contract, not a directly executable script in this harness. Without its runtime executor, I could not verify whether update creates a surface. The two-copy limit also prevented running the complete GitHub workflow sequence. (iteration 8)
- no slash-command executor was available in the exposed tool surface, so the requested disposable add-surface run and five-leg observation remain unverified. (iteration 9)
- the initial iteration filename pattern omitted zero-padding, and the corrected multi-file search output truncated before all prior records could be reviewed. The slash command has no exposed direct executor here, so the required end-to-end `--surfaces` run could not be observed. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A new doctor order rule as part of minimal R1: 5e/5i have no user/native classification, so enforcing it requires a broader contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A new doctor order rule as part of minimal R1: 5e/5i have no user/native classification, so enforcing it requires a broader contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new doctor order rule as part of minimal R1: 5e/5i have no user/native classification, so enforcing it requires a broader contract.

### A README-only R1 edit: the scaffold and parent-skill checklist still omit insertion position. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A README-only R1 edit: the scaffold and parent-skill checklist still omit insertion position.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A README-only R1 edit: the scaffold and parent-skill checklist still omit insertion position.

### No source approach exhausted. The full command-runtime invocation was unavailable in the throwaway copy; the prompt expressly directs hand execution of model-driven YAML writes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No source approach exhausted. The full command-runtime invocation was unavailable in the throwaway copy; the prompt expressly directs hand execution of model-driven YAML writes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No source approach exhausted. The full command-runtime invocation was unavailable in the throwaway copy; the prompt expressly directs hand execution of model-driven YAML writes.

### None. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

### Treating `--surfaces` as a complete compiled-routing re-mint: the YAML names package generation and leaf-manifest generation, while the doctor's second-copy output remains the decisive check for missing legs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `--surfaces` as a complete compiled-routing re-mint: the YAML names package generation and leaf-manifest generation, while the doctor's second-copy output remains the decisive check for missing legs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `--surfaces` as a complete compiled-routing re-mint: the YAML names package generation and leaf-manifest generation, while the doctor's second-copy output remains the decisive check for missing legs.

### Treating `compiled-route-guard.cjs` as a re-mintability check: it returned exit 0 with `specs/` absent and checks served-runtime freshness instead. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `compiled-route-guard.cjs` as a re-mintability check: it returned exit 0 with `specs/` absent and checks served-runtime freshness instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `compiled-route-guard.cjs` as a re-mintability check: it returned exit 0 with `specs/` absent and checks served-runtime freshness instead.

### Treating the minimal hand-copy failures as only five: the probe also exposed failures from duplicate aliases, absent vocabulary classes, and the intentionally stale manifest. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the minimal hand-copy failures as only five: the probe also exposed failures from duplicate aliases, absent vocabulary classes, and the intentionally stale manifest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the minimal hand-copy failures as only five: the probe also exposed failures from duplicate aliases, absent vocabulary classes, and the intentionally stale manifest.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- No source approach exhausted. The full command-runtime invocation was unavailable in the throwaway copy; the prompt expressly directs hand execution of model-driven YAML writes. (iteration 2)
- Treating `--surfaces` as a complete compiled-routing re-mint: the YAML names package generation and leaf-manifest generation, while the doctor's second-copy output remains the decisive check for missing legs. (iteration 2)
- Treating the minimal hand-copy failures as only five: the probe also exposed failures from duplicate aliases, absent vocabulary classes, and the intentionally stale manifest. (iteration 2)
- Treating `compiled-route-guard.cjs` as a re-mintability check: it returned exit 0 with `specs/` absent and checks served-runtime freshness instead. (iteration 3)
- A new doctor order rule as part of minimal R1: 5e/5i have no user/native classification, so enforcing it requires a broader contract. (iteration 4)
- A README-only R1 edit: the scaffold and parent-skill checklist still omit insertion position. (iteration 4)
- None. (iteration 4)

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
- Q8–Q12 remain for later iterations: re-mint dependency; surface-add workflow; R1–R4 stress test; other example assumptions and end-to-end flow; rejected ideas. (iteration 1)
- Q8: re-mint source dependency and repair cost. (iteration 2)
- Q10: exact R1-R4 edits and minimum scope. (iteration 2)
- Q12: challenge X1-X9 and identify new rejections. (iteration 2)
- Q11: other example assumptions and end-to-end external-user flow. (iteration 2)
- Q10: exact R1-R4 edits, touched files, residual breakage, and minimum scope. (iteration 3)
- Q11: other example assumptions and the complete external-user flow. (iteration 3)
- Q11: inspect other example assumptions and the complete external-user flow. (iteration 4)
- Q10: validate exact R2-R4 edits, all touched files, and their minimum scope; reconcile the prepared base with the checked-out tree. (iteration 4)
- Q10: exact R1–R4 edits, touched files, residual failures and minimum correct scope, including R3 and R4. (iteration 5)
- Q11: other example assumptions and full external-user flow. (iteration 5)
- Q12: challenge rejected ideas X1–X9 and identify new rejections. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q12: challenge rejected ideas X1–X9 and identify new rejections.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work: round one of this packet, research/research.md (F1-F33, R1-R5, X1-X9, P1-P4) and its lineages dsflash-devin and luna-max-fast under research/lineages/. resource-map.md not present for this lineage; skipping coverage gate.

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
- Started: 2026-10-12T18:58:06.247Z

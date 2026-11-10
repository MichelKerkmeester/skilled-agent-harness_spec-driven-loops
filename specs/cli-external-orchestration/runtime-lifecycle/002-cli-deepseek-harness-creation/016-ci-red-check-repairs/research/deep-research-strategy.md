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
Audit whether the CI red-check repair work on main is fully and correctly documented. Commits in scope: 190b103dd8 (history-locator test state dir), 509c2d707c (snake_case guard exempts research_archive), 8da131af09 (OpenCode version battery names a v1 command by its frontmatter name), 95f704cfc0 (19 workflows skip the onnxruntime CUDA download), cdd3c27db4 (leaf-aliases regen), 9932b52352 (mcp-tooling drops the isolated chrome routing phrase), 67fc950028 (sk-code drift guard skips TS module header on compiler-emitted .d.ts), a65d573299 (track roots count a numbered folder as a packet only with spec.md), b8d66a38f7 (gitignore coverage-graph-db), 478cdec696 (links repointed after the specs/hooks -> specs/hooks-plugins-extensions track rename). For each change find every doc that describes the touched behavior (skill SKILL.md, READMEs, references, feature catalogs, manual testing playbooks, skill changelogs, the release notes .skilled/changelog/skilled/v4.0.2.0.md, root README.md, INSTALL-SKILLED.md, AGENTS.md/CLAUDE.md) and report what is missing, stale or misaligned, with file:line. Also sweep for remaining stale references to specs/hooks/ and SETUP.md. Known already: no changelog entries for these fixes; track-root-children-lists.md §2 and runtime/cli/spec/README.md rows lack the spec.md rule; filesystem-naming-convention.md §3 omits research_archive; session-relaunch README lines 25-30 link the old hooks path; system-skilled-doctor changelog v1.1.1.0 names SETUP.md. Find anything beyond these. Read-only outside the spec folder; never open any .env file or anything under barter/.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Are the system-spec-kit changes (a65d573299 track roots count a numbered folder as a packet only with spec.md; 190b103dd8 history-locator test state dir) reflected in every doc that describes the touched behavior, beyond track-root-children-lists.md section 2 and runtime/cli/spec/README.md?
- [x] Q2: Are the guard changes (509c2d707c sk-doc snake_case guard exempts research_archive; 67fc950028 sk-code drift guard skips the TS module header on compiler-emitted .d.ts) reflected in their skills references, READMEs, feature catalogs and playbooks, beyond filesystem-naming-convention.md section 3?
- [x] Q3: Are the system-skilled-doctor and mcp-tooling changes (8da131af09 OpenCode version battery names a v1 command by its frontmatter name; cdd3c27db4 leaf-aliases regen; 9932b52352 mcp-tooling drops the isolated chrome routing phrase) reflected in SKILL.md, references, routing docs, feature catalogs and playbooks?
- [x] Q4: Are the CI and repo-hygiene changes (95f704cfc0 19 workflows skip the onnxruntime CUDA download; b8d66a38f7 gitignore coverage-graph-db) reflected in workflow docs, doctor:ci docs, INSTALL-SKILLED.md, root README.md, AGENTS.md/CLAUDE.md and the v4.0.2.0 release notes?
- [x] Q5: Which references to specs/hooks/ and SETUP.md remain stale after 478cdec696, beyond the session-relaunch README lines 25-30 and the system-skilled-doctor changelog v1.1.1.0, and do any skill changelogs or .skilled/changelog/skilled/v4.0.2.0.md record these ten fixes?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Fixing any doc: this run reports findings only.
- Re-reporting the five items already known (listed in Known Context) except to add new line-level detail.
- Judging whether the code changes themselves are correct; the audit is about documentation alignment.
- Anything under barter/ and any .env file: never opened.

---

## 5. STOP CONDITIONS
- stop_policy is max-iterations: all 5 iterations run.
- An opencode-go provider quota or auth failure halts the run rather than switching models.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Are the system-spec-kit changes (a65d573299 track roots count a numbered folder as a packet only with spec.md; 190b103dd8 history-locator test state dir) reflected in every doc that describes the touched behavior, beyond track-root-children-lists.md section 2 and runtime/cli/spec/README.md?
- Q2: Are the guard changes (509c2d707c sk-doc snake_case guard exempts research_archive; 67fc950028 sk-code drift guard skips the TS module header on compiler-emitted .d.ts) reflected in their skills references, READMEs, feature catalogs and playbooks, beyond filesystem-naming-convention.md section 3?
- Q3: Are the system-skilled-doctor and mcp-tooling changes (8da131af09 OpenCode version battery names a v1 command by its frontmatter name; cdd3c27db4 leaf-aliases regen; 9932b52352 mcp-tooling drops the isolated chrome routing phrase) reflected in SKILL.md, references, routing docs, feature catalogs and playbooks?
- Q4: Are the CI and repo-hygiene changes (95f704cfc0 19 workflows skip the onnxruntime CUDA download; b8d66a38f7 gitignore coverage-graph-db) reflected in workflow docs, doctor:ci docs, INSTALL-SKILLED.md, root README.md, AGENTS.md/CLAUDE.md and the v4.0.2.0 release notes?
- Q5: Which references to specs/hooks/ and SETUP.md remain stale after 478cdec696, beyond the session-relaunch README lines 25-30 and the system-skilled-doctor changelog v1.1.1.0, and do any skill changelogs or .skilled/changelog/skilled/v4.0.2.0.md record these ten fixes?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- one bounded git probe answered the decisive branch directly, and because `leaf-aliases.json` is a five-entry projection, a direct count is authoritative rather than a doc inference. (iteration 4)
- a single bounded sweep with explicit exclusions was enough to prove the live set closed, because iterations 1-2 had already mapped every surface; the registry and iteration 4 narrative were sufficient state to consolidate without rereading the corpus. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed; the policy edge is a wording judgment that evidence cannot settle on its own, so it is reported as a recommendation rather than a defect. (iteration 4)
- nothing failed. The only impedance was the missing root `CLAUDE.md`, which surfaced as `rg` exit 2 while the rest of the sweep ran; it is an absent file, not a stale doc. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Extending v4.0.2.0 in place as if it were an untagged open release: the tag exists, and the playbook's pass/fail explicitly fails a run that extends an entry whose tag exists. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Extending v4.0.2.0 in place as if it were an untagged open release: the tag exists, and the playbook's pass/fail explicitly fails a run that extends an entry whose tag exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extending v4.0.2.0 in place as if it were an untagged open release: the tag exists, and the playbook's pass/fail explicitly fails a run that extends an entry whose tag exists.

### None new. The full mcp-tooling sweep found no surviving routing phrase to remove. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None new. The full mcp-tooling sweep found no surviving routing phrase to remove.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. The full mcp-tooling sweep found no surviving routing phrase to remove.

### Re-reporting the five Known Context items without new line detail (exhausted, iteration 1). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-reporting the five Known Context items without new line detail (exhausted, iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the five Known Context items without new line detail (exhausted, iteration 1).

### Re-reporting the five Known Context items without new line detail; each was re-checked and only the added surfaces (lib README, §5, folder-structure line, wide stale set) are reported as new. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Re-reporting the five Known Context items without new line detail; each was re-checked and only the added surfaces (lib README, §5, folder-structure line, wide stale set) are reported as new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the five Known Context items without new line detail; each was re-checked and only the added surfaces (lib README, §5, folder-structure line, wide stale set) are reported as new.

### Re-sweeping `.skilled/skills/system-skilled-doctor` for battery or leaf-alias prose: iteration 1 already established that neither is described there, so nothing can be stale. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Re-sweeping `.skilled/skills/system-skilled-doctor` for battery or leaf-alias prose: iteration 1 already established that neither is described there, so nothing can be stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-sweeping `.skilled/skills/system-skilled-doctor` for battery or leaf-alias prose: iteration 1 already established that neither is described there, so nothing can be stale.

### Re-sweeping `system-skilled-doctor` for battery or leaf-alias prose (exhausted, iterations 1-2; the skill never describes either). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-sweeping `system-skilled-doctor` for battery or leaf-alias prose (exhausted, iterations 1-2; the skill never describes either).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-sweeping `system-skilled-doctor` for battery or leaf-alias prose (exhausted, iterations 1-2; the skill never describes either).

### Reading every "isolated" hit in mcp-tooling as stale routing prose: the remaining hits are the `--isolated=true` flag and Aside's isolation-gap documentation, not aliases. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading every "isolated" hit in mcp-tooling as stale routing prose: the remaining hits are the `--isolated=true` flag and Aside's isolation-gap documentation, not aliases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading every "isolated" hit in mcp-tooling as stale routing prose: the remaining hits are the `--isolated=true` flag and Aside's isolation-gap documentation, not aliases.

### Repointing `specs/hooks/` inside changelogs: `filesystem-naming-convention.md` §5 freezes changelog and archived history as the record of prior names. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Repointing `specs/hooks/` inside changelogs: `filesystem-naming-convention.md` §5 freezes changelog and archived history as the record of prior names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repointing `specs/hooks/` inside changelogs: `filesystem-naming-convention.md` §5 freezes changelog and archived history as the record of prior names.

### Searching `system-skilled-doctor` for battery/leaf-alias prose: the skill's docs never describe either, so nothing can be stale. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching `system-skilled-doctor` for battery/leaf-alias prose: the skill's docs never describe either, so nothing can be stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching `system-skilled-doctor` for battery/leaf-alias prose: the skill's docs never describe either, so nothing can be stale.

### Searching for an onnxruntime/CUDA statement in workflow standards: none exists in any Markdown or workflow asset, so there is no stale claim to correct, only an undocumented change. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for an onnxruntime/CUDA statement in workflow standards: none exists in any Markdown or workflow asset, so there is no stale claim to correct, only an undocumented change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for an onnxruntime/CUDA statement in workflow standards: none exists in any Markdown or workflow asset, so there is no stale claim to correct, only an undocumented change.

### Treating 190b103dd8 as documentation-relevant: the commit is test-only and changes no user-visible behavior. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating 190b103dd8 as documentation-relevant: the commit is test-only and changes no user-visible behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating 190b103dd8 as documentation-relevant: the commit is test-only and changes no user-visible behavior.

### Treating every `specs/` hit as a repoint target: most are completed packet transcripts frozen by the naming convention. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating every `specs/` hit as a repoint target: most are completed packet transcripts frozen by the naming convention.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every `specs/` hit as a repoint target: most are completed packet transcripts frozen by the naming convention.

### Treating every `specs/` or changelog hit as a repoint target (frozen history, iteration 2). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating every `specs/` or changelog hit as a repoint target (frozen history, iteration 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every `specs/` or changelog hit as a repoint target (frozen history, iteration 2).

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Re-reporting the five Known Context items without new line detail; each was re-checked and only the added surfaces (lib README, §5, folder-structure line, wide stale set) are reported as new. (iteration 1)
- Repointing `specs/hooks/` inside changelogs: `filesystem-naming-convention.md` §5 freezes changelog and archived history as the record of prior names. (iteration 1)
- Searching `system-skilled-doctor` for battery/leaf-alias prose: the skill's docs never describe either, so nothing can be stale. (iteration 1)
- Searching for an onnxruntime/CUDA statement in workflow standards: none exists in any Markdown or workflow asset, so there is no stale claim to correct, only an undocumented change. (iteration 1)
- Treating 190b103dd8 as documentation-relevant: the commit is test-only and changes no user-visible behavior. (iteration 1)
- Extending v4.0.2.0 in place as if it were an untagged open release: the tag exists, and the playbook's pass/fail explicitly fails a run that extends an entry whose tag exists. (iteration 2)
- Re-sweeping `.skilled/skills/system-skilled-doctor` for battery or leaf-alias prose: iteration 1 already established that neither is described there, so nothing can be stale. (iteration 2)
- Treating every `specs/` hit as a repoint target: most are completed packet transcripts frozen by the naming convention. (iteration 2)
- None new. The full mcp-tooling sweep found no surviving routing phrase to remove. (iteration 3)
- Re-reporting the five Known Context items without new line detail (exhausted, iteration 1). (iteration 3)
- Re-sweeping `system-skilled-doctor` for battery or leaf-alias prose (exhausted, iterations 1-2; the skill never describes either). (iteration 3)
- Reading every "isolated" hit in mcp-tooling as stale routing prose: the remaining hits are the `--isolated=true` flag and Aside's isolation-gap documentation, not aliases. (iteration 3)
- Treating every `specs/` or changelog hit as a repoint target (frozen history, iteration 2). (iteration 3)

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
- None of the five strategy questions remain open. Depth candidates for later iterations: whether the sk-code TypeScript style guide (not only the checklist) should state the `.d.ts` exemption, and whether v4.0.2.0 should be amended or a new release note should carry the ten CI repairs. (iteration 1)
- Q4's final branch still needs the ten-commit ancestry check against tag v4.0.2.0. (iteration 2)
- Q1 and Q3 stay open in the strategy ledger even though iteration 1 answered them at line detail; they are not re-verified here. (iteration 2)
- Policy edge: decide whether the two packet-worded track-root docs (`README.md:241-243`, `folder-structure.md:121`) should state the `spec.md` gate explicitly or are correct as written. (iteration 3)
- Q4's final branch: the ten-commit ancestry check against tag v4.0.2.0 (carried from iteration 2). (iteration 3)
- Verify `sk-doc/shared/README.md:50`'s "five alias entries / four shared paths" against `.skilled/skills/sk-doc/leaf-aliases.json` after cdd3c27db4. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Already known before this run (do not re-report as new; add detail only):
- No changelog entries exist for these ten fixes.
- track-root-children-lists.md section 2 and runtime/cli/spec/README.md rows lack the spec.md rule from a65d573299.
- filesystem-naming-convention.md section 3 omits research_archive (509c2d707c).
- The session-relaunch README lines 25-30 link the old specs/hooks path.
- The system-skilled-doctor changelog v1.1.1.0 names SETUP.md.

Continuity ladder: no handover.md; the packet spec.md (Phase 16 of 085) covers an earlier, different CI repair set (DSH prompt stub, dispatch test, playbooks, sk-doc baselines); the ten commits in scope landed after it on 2026-11-08. Use git show <sha> --stat to find the touched files of each commit.

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
- Max iterations: 5
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
- Started: 2026-11-08T16:26:02.000Z

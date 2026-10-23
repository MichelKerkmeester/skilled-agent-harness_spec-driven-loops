# Deep Research Strategy - 013 Private Surface Skills Coverage Audit

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 2. TOPIC
Coverage audit of packet sk-code/013-private-surface-skills (five phases moving sk-code-webflow and sk-code-obsidian into ignored private local-* skills). Q1 leak coverage: does 013 cover every tracked or generated surface that can leak or route the two surfaces (committed trigger index, Hermes sync and .hermes/skills, runtime mirrors, compiled routing and activation manifests, skill-graph.json from --export-json, advisor DB and scorer vocabulary, OpenCode plugins incl. system-skill-advisor.js surface detection, doctor checks, description/graph-metadata/changelog/README generators, CI artifacts, pre-commit and pre-push hooks)? Q2 phase correctness: do the phase-2 removal steps cover a fresh grep of tracked files naming the surfaces; are the ignore patterns right for a real folder and a symlink; is the advisor symlink-follow change safe; does the commit guard catch git add -f and renames? Q3 executability by a DeepSeek writer: exact files, one change per task, proving commands, acceptance criteria, rollback; flag vague tasks. Q4 is phase 5's fresh-clone proof sufficient? Q5 risks: git history retention, other repos that symlink this checkout (Obsidian Plugin project), CI drift checks. Label every claim confirmed, documented or inferred, with file:line. Output: research.md plus P0/P1/P2 amendments each naming the phase file. Do not edit phase docs.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1 Leak coverage: which tracked or generated surfaces that can carry or route sk-code-webflow / sk-code-obsidian (or a local-* private skill) does packet 013 miss? Check the committed trigger index, Hermes sync and .hermes/skills, runtime mirrors, compiled routing and activation manifests, skill-graph.json from --export-json, the advisor DB and scorer vocabulary, OpenCode plugins (system-skill-advisor.js surface detection), doctor checks, description / graph-metadata / changelog / README generators, CI artifacts, and the pre-commit and pre-push hooks.
- [x] Q2 Phase correctness: does phase 002's removal list cover a fresh `git grep` of every tracked file naming the surfaces; are the phase 001 ignore patterns right for a real folder and a symlink; is phase 003's advisor symlink-follow change safe; does the phase 001 commit guard catch `git add -f` and renames?
- [x] Q3 Executability by a DeepSeek writer: does every task name exact files, make one change, carry a proving command, map to acceptance criteria and a rollback? Which tasks are vague?
- [x] Q4 Is phase 005's fresh-clone proof sufficient to show no private byte or surface signal reaches the public repo?
- [x] Q5 Risks: git history retention, other repos that symlink this checkout (the Obsidian Plugin project), and CI drift checks that the removal or the private skills can trip.

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing any 013 phase doc (spec, plan, tasks, acceptance criteria): findings become amendments only.
- Reopening the fixed decisions D1-D6 recorded in the planner facts, except where evidence shows one is wrong.
- Implementing any phase.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: run all 5 iterations; convergence mode is off.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 Leak coverage: which tracked or generated surfaces that can carry or route sk-code-webflow / sk-code-obsidian (or a local-* private skill) does packet 013 miss? Check the committed trigger index, Hermes sync and .hermes/skills, runtime mirrors, compiled routing and activation manifests, skill-graph.json from --export-json, the advisor DB and scorer vocabulary, OpenCode plugins (system-skill-advisor.js surface detection), doctor checks, description / graph-metadata / changelog / README generators, CI artifacts, and the pre-commit and pre-push hooks.
- Q2 Phase correctness: does phase 002's removal list cover a fresh `git grep` of every tracked file naming the surfaces; are the phase 001 ignore patterns right for a real folder and a symlink; is phase 003's advisor symlink-follow change safe; does the phase 001 commit guard catch `git add -f` and renames?
- Q3 Executability by a DeepSeek writer: does every task name exact files, make one change, carry a proving command, map to acceptance criteria and a rollback? Which tasks are vague?
- Q4 Is phase 005's fresh-clone proof sufficient to show no private byte or surface signal reaches the public repo?
- Q5 Risks: git history retention, other repos that symlink this checkout (the Obsidian Plugin project), and CI drift checks that the removal or the private skills can trip.

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
- Q5: What risks remain from Git history, the Obsidian Plugin project and CI drift checks? (iteration 2)
- Q4: Does phase 005’s fresh-clone proof show that no private bytes or surface signals reach the public repository? (iteration 2)
- Q3: Does every task give a DeepSeek writer exact files, one change, proof, acceptance mapping and rollback? (iteration 2)
- Q5: What risks remain from Git history, the Obsidian Plugin project's links to this checkout and CI drift checks? (iteration 3)
- Q4: Does phase 005's fresh-clone proof establish that no private bytes or surface signals reach the public repository? (iteration 3)
- The active Obsidian Plugin checkout path and symlink targets remain UNKNOWN; verify from that checkout with the F3 command. (iteration 4)
- The exact contents of reachable tag trees and hosted release assets remain UNKNOWN; verify with the inventory commands in F4. (iteration 4)
- Q3 remains: does every task give a DeepSeek writer exact files, one change, proof, acceptance mapping, and rollback? (iteration 4)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Packet 013 was planned on base 42b41dd286 and landed at 6347717083. Phase children: 001-ignore-and-commit-guard, 002-hub-surface-removal, 003-advisor-vocabulary-cleanup, 004-private-local-skills, 005-leak-and-routing-verification. The planner recorded 93 tracked files naming the surfaces and these anchors: skill-graph-db.ts:724-745 (isDirectory skip), freshness.ts:143, skill-graph-freshness.cjs:146-148, skill_graph_compiler.py:200 and :33, sync-skills-hermes.cjs:51-68, ci-skill-root-metadata.cjs:143, corpus.mjs:200-210, lexical.ts:37-39, .opencode/plugins/system-skill-advisor.js:736-738, pre-commit insertion before line 96. Verify each anchor yourself; do not trust it.

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
- Convergence threshold: 0 (convergence mode off; stop policy max-iterations)
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
- Started: 2026-10-23T08:24:54Z

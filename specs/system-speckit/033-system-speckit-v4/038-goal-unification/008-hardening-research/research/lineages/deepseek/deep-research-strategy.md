---
title: Deep Research Strategy — Goal Unification Hardening (036 / phase 008, lineage deepseek)
description: "Five-iteration hardening research over the shipped packet-bound goal system, one angle per iteration."
trigger_phrases:
  - "goal unification hardening research"
  - "deepseek lineage strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy — Goal Unification Hardening (036 / phase 008, lineage deepseek)

## 2. TOPIC

Goal unification hardening: what makes the shipped packet-bound goal system more robust, better integrated, easier for the operator, and smaller. One angle per iteration, five iterations, `stopPolicy: max-iterations`. Research only — every recommendation names the file and function it changes, the failure it prevents or the friction it removes, and what it costs.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] **Q1 Hardening**: Where can a bound session still be lied to or left silent — races between two sessions on one packet, a goal.md rewritten mid-render, a stale `workspace` after a repo move, a packet renamed mid-session, non-UTF8/CRLF goal files, a `../` relative path in a binding row? (charter iteration 1) — answered with nine findings in `iterations/iteration-001.md`.
- [x] **Q2 Integration**: Where do the pieces still not meet — speckit YAML that instructs a bind with no CLI call, save that appends a log row by hand while the core has a locked append, plugin without `unbind`/`log`, Claude Code and Codex with no adapter reading `resend_pending`, trigger index and advisor vocabulary? (charter iteration 2) — answered with five ranked seams in `iterations/iteration-002.md`.
- [x] **Q3 Operator UX**: Walking the operator's day — set, edit a criterion, get reminded, set again, switch packets, finish — which steps are manual that could be automatic, which messages are unclear, which envelope fields nobody reads, which 4000-character paste a tool could do? (charter iteration 3) — answered with seven friction points in `iterations/iteration-003.md`.
- [x] **Q4 Overengineering**: What shipped that no current caller needs — record fields nobody reads, two-slice projection versus one, budget block in the contract JSON versus a constant, `packet` action on three surfaces, envelope lines, reminder text length, doc paragraphs restating each other? (charter iteration 4) — answered with two removals, one gate, one de-duplication and five keeps in `iterations/iteration-004.md`.
- [x] **Q5 Synthesis**: Rank every recommendation by (operator impact x confidence) / cost into do-now, do-next, do-not, each row citing file:line. (charter iteration 5) — answered with twelve do-now, twelve do-next and nine do-not rows in `iterations/iteration-005.md`.
- [ ] **Q5 Synthesis**: Rank every recommendation by (operator impact x confidence) / cost into do-now, do-next, do-not, each row citing file:line. (charter iteration 5)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-litigating the eight frozen decisions D1–D8 in `002-decisions-and-contract-freeze/decision-record.md`. Proposals stay within them.
- Implementing any fix. This lineage reports; it does not edit the goal system, the spec kit, AGENTS.md or any packet document.
- Re-running the phase-007 review. Findings F001–F015 are inputs, not targets; only their current post-fix state is checked.
- Touching the parent spec, `generate-context.js`, `validate.sh`, or git state.

---

## 5. STOP CONDITIONS

- Hard cap `maxIterations: 5`; convergence before the cap is telemetry only and broadens the angle instead of ending the loop.
- `convergenceThreshold: 0.05` on `newInfoRatio`.
- Charter table in `research/deep-research-strategy.md` at the parent level owns the angle list; each iteration closes exactly one row.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- **Q1 Hardening** (iteration 1): the bound path fails correctly for a renamed packet and serializes plain same-workspace appends, but still has nine ways to lie or go silent — reverse extractor drift (validator stricter than runtime), CR-only frontmatter leak, alias-bypassed packet lock, plugin-vs-core workspace precedence, a stat throw where fail-open is promised, destructive non-UTF8 append, mixed-ending append, lexical-only binding containment, notation-bypassed missing-child rule. Evidence: `iterations/iteration-001.md` F1-H1 to F1-H9.
- **Q2 Integration** (iteration 2): five ranked seams — the bind table that no step calls (I2-1), the plugin's missing `log`/`unbind` plus a silent unknown-action fallback (I2-2), the goal contract docs outside the retrieval corpus (I2-3), the save path's unlocked append given equal footing (I2-4), and Claude Code/Codex with no hash mechanism (I2-5). Evidence: `iterations/iteration-002.md`.
- **Q3 Operator UX** (iteration 3): seven friction points with smallest fixes and wording — the three-step resync the record can do itself (U3-1), `show` reporting bound after the document is gone (U3-2), flattened criteria (U3-3), a nonsense usage line (U3-4), a reminder naming an unreachable action on cursor/devin (U3-5), the machine envelope as the human answer (U3-6), and a rebind that drops history (U3-7). Evidence: `iterations/iteration-003.md`.
- **Q4 Overengineering** (iteration 4): remove the packet projection's unread `content`/`mtimeMs` and the unrendered `lastCheckAtMs`; gate the CLI's `injection_preview`; de-duplicate the envelope; keep the budget manifest, both slices, both `packet` surfaces and both renderers — each with its caller named. Evidence: `iterations/iteration-004.md`.
- **Q5 Synthesis** (iteration 5): twelve do-now changes, twelve do-next decisions, nine defended designs; overlaps merged with the phase-007 P2 set. Evidence: `iterations/iteration-005.md`.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading the two extractor implementations side by side (`goal-slice.cjs` vs `spec-doc-structure.ts`) inverted the parity question and surfaced F1-H1. (iteration 1)
- Tracing the lock *namespace* (what key names the locked resource) rather than the lock count exposed the alias race F1-H3. (iteration 1)
- Tracing every `workspace` decision across core, plugin and adapters exposed the precedence split F1-H4. (iteration 1)
- Grepping the bind *invocation* rather than the topic proved the reference table has no caller (I2-1). (iteration 2)
- Querying the retrieval index by operator phrasing and then reading `CORPUS_ROOTS` explained why the contract docs never surface (I2-3). (iteration 2)
- Walking the six operator moments in sequence revealed that set-again and edit-a-criterion share one root: the resync was designed for a copy only the operator holds (U3-1). (iteration 3)
- Grepping each record field name outside test files separated "written and read" from "written and rendered once", which is how the two removable fields surfaced (O4-1, O4-2). (iteration 4)
- Scoring cost explicitly kept the do-now list to changes one session can finish and moved the manifest, the two slices and the renderer merge into the defended set (iteration 5).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Searching for a second goal.md writer produced nothing: the plugin's `appendGoalBrief` is output-only and the plugin exposes no `log` action, so the log has exactly one writer. (iteration 1)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

None yet.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Normal same-workspace concurrent log appends interleave: locks live under one workspace state dir (`.opencode/skills/.state/goal`) and the packet lock is shared; only the symlink-alias case defeats serialization. (iteration 1)
- A renamed or deleted packet silently falls back to the stored objective: `renderGoalBrief` returns an empty block when the bound document is gone; the stored objective returns only after an explicit `unbind`. (iteration 1)
- Non-UTF8 input crashes a render: Node replacement-decodes; the real failure is corruption on write. (iteration 1)
- A lexical `../` binding row escapes: refused; only the symlink form survives. (iteration 1)
- Adapters disagree with core on workspace: pi, cursor and devin pass the live workspace; only the plugin re-decides. (iteration 1)
- The plugin ignores the shared slice module: it imports `goal-slice.cjs`; divergence is action coverage and workspace precedence. (iteration 2)
- Pi, cursor and devin lack a goal surface: all three render the brief and the reminder. (iteration 2)
- Resume carries an unwired bind: both resume assets are read-only by construction. (iteration 2)
- The reminder is too long to be useful: one proportionate line; the defects are what it asks and who can comply. (iteration 3)
- The operator must paste because tooling cannot write the record: `bind` rewrites objective and prompt from the file and `resent` records the hash. (iteration 3)
- `show`'s machine envelope must be replaced to become usable: a human mode can be added without touching the shape the pi adapter parses. (iteration 3)
- The two-slice projection collapses to one: `objectiveSlice` is stored and budgeted, `chatSlice` is stripped for humans; different content and caps. (iteration 4)
- Bound records' stored objective and goalPrompt are dead weight: the render fallback after `unbind` and `setGoal`'s refreshed-versus-replaced comparison read them. (iteration 4)
- The `legacy-*` actions are dead code: the README documents them as the migration path for machines that hold legacy records. (iteration 4)
- The plugin's extra actions are surface bloat: each has a command caller; the asymmetry worth fixing is the two missing actions. (iteration 4)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: all five charter angles closed; no angle required a pivot
- Pivot lineage: none
- Remaining frontier: the four inferred claims in `research.md` section 9 (alias race, non-UTF8 append, advisor routing, cursor/devin reminder loop) need live fixtures, not new angles
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

None yet.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Complete. Synthesis lives in `research.md`; the source inventory is `resource-map.md`; the ranked action list is `iterations/iteration-005.md`. Stop reason `maxIterationsReached` at 5 of 5 iterations.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- **Frozen contract**: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/002-decisions-and-contract-freeze/decision-record.md` — ADR-001 binding pointer, ADR-002 store demotion, ADR-003 strip contract, ADR-004 resend trigger, ADR-005 runtime surfaces, ADR-006 budget, ADR-007 isolation/update authority, ADR-008 AGENTS.md posture. Do not reopen.
- **Prior review**: `007-retirement-docs-and-verification/review/lineages/deepseek-review/review-report.md` — F001–F015; five P1 (F001, F002, F003, F005, F010) reported fixed, six P2 open follow-ups (F004, F006, F007, F008, F009, F013 and documentation items F011, F012, F014, F015).
- **Code surfaces**: `.opencode/hooks/goal/lib/goal-slice.cjs` (252 lines), `goal-core.cjs` (1394), `bin/goal.cjs` (420), `pi/goal-context.ts` (245), `cursor/goal-inject.mjs` (95), `devin/goal-inject.mjs` (86), `.opencode/plugins/opencode-goal.js` (3258), `spec-doc-structure.ts` (1447), `level-contract-resolver.ts` (323).
- **Docs/contracts**: `.opencode/hooks/goal/README.md`, `goal-plugin.md`, templates `addons/goal.md.tmpl`, `spec-kit-docs.json`, playbook `goal-set-string-playbook.md`, speckit YAML `packet_goal` blocks, `AGENTS.md` GOAL POSTURE RULE.
- **`resource-map.md` not present** at the parent spec folder; the repository coverage gate is informationally skipped.
- **Write boundary**: everything this run produces lives under `.../008-hardening-research/research/lineages/deepseek/`.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Executor provenance: `cli-pi`, model `deepseek-v4.1-flash`, effort `max`
- Session: `fanout-deepseek-1789123936134-uvcqh9`
- Allowed write root: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/008-hardening-research/research/lineages/deepseek`
- Evidence rule: confirm by reading; mark inferred claims and what would confirm them; every finding cites `file:line`.

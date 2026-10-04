# Deep Research Strategy - Repo rule surfacing through the advisor

## 1. OVERVIEW

### Purpose
Persistent brain for this fan-out lineage. One focus per iteration; evidence externalized to `iterations/` and `deltas/`.

### Session
- Session: `fanout-deepseek-v4-1-flash-max-1791116504576-gieznv`
- Executor: cli-devin model=deepseek-v4-1-flash-max
- Stop policy: max-iterations (4 iterations forced; convergence before the cap is telemetry only)

---

## 2. TOPIC
Should system-skill-advisor (or another surface) support and suggest repo rules from `.skilled/repo-rules/` without adding context the model does not need? Today repo rules reach the model only through Gate 5 (AGENTS.md section 2), which fires on the first write of a session; the model then matches its action against the trigger table in the root `REPO RULES.md`. Candidate surfaces to evaluate, and any other the evidence raises: (a) a pointer line in the advisor brief rendered by `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, next to the existing Directives block and its dedup in `hooks/lib/directive-lifecycle.ts`; (b) adding `.skilled/repo-rules` to `CORPUS_ROOTS` in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` so the Gate 1 trigger-index lookup can return rule files by their `trigger_phrases` frontmatter; (c) an action-keyed PreToolUse advisory, with the hooks under `.skilled/hooks/` and `.claude/settings.json` as precedent; (d) no new surface.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Q6: What did specs/hooks/022-smart-rule-injection and specs/agents/010-repo-rule-system-integration already decide, and does this run's evidence respect or overturn it?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing any surface (this packet decides; a later packet builds).
- Rewriting rule content or the `REPO RULES.md` trigger table.
- Writing anywhere outside the lineage artifact directory.

---

## 5. STOP CONDITIONS

- `config.stopPolicy = max-iterations`: the run ends at iteration 4 regardless of convergence.
- Convergence before the cap is recorded as telemetry; the response is to broaden the review angle, not to synthesize early.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] Q1: The gap is mapped (iteration 1). Gate 5 fires on the first write only (`AGENTS.md:93-94`); a second static path already exists for reply-time turns (`AGENTS.md:261`); the trigger index deliberately excludes the corpus (`retrieval-conventions.md:284`); `trigger_phrases` name dispositions, not actions (F3). The open sub-question is whether any candidate surface beats the status quo on cost, not whether a gap exists.
- [x] Q2: Candidate (a) fully characterized (iteration 2). A pointer rides the Directives capsule (three emit sites, `render.ts:441,449,486`); +~160B on full-delivery turns, 0 on deduped turns; a prompt-time reminder, not action-keyed; fails 022's bar as a disposition restatement; needs the OpenCode mirror and exact-string tests updated.
- [x] Q3: Candidate (b) characterized (iteration 3). One-line root add indexes 13 docs / 255 phrases; silence is exit-1 no-hit; +0.10% paths, +0.76% phrases on a 3.7MB index; prompt-topic matching that empirically hits action-adjacent vocabulary ("add a retry", "force push") at 0.880; a documented decision-against must be overturned; root-name choice interacts with the symlink federation.
- [x] Q4: Candidate (c) characterized (iteration 4). Action-keyed PreToolUse advisory naming rule file(s) for the matched action; spec-gate precedent proves the delivery machinery; the tool-call→row classifier is the new work; silence = no row match + once-per-session dedup; the only candidate that matches the router's own key.
- [x] Q5: Candidate (d) characterized (iteration 4). No measured miss exists in the evidence base; the flip test is a measured miss with cost; the status quo covers first-write and reply-time but not later-in-session actions.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading prior work first (022 decisions/closeout, 010 synthesis) before touching candidate code; it supplied the admission bar (F6) and the measurement rule (F7) that later iterations must apply.
- Verifying the symlink federation with `ls -la` instead of trusting 010's counts; the sibling set changed since 010 (Mobile CLI gone, corpus 11→13 files).
- Measuring byte sizes from the renderer constants instead of estimating: route 42B, label 12B, hygiene 207B (iteration 2).
- Reading the dedup module to fix delivery frequency from code (022's rule) rather than guessing per-turn cost (iteration 2).
- Running the real lookup and a real `scorePhrase` simulation instead of reasoning about hit behavior: rule vocabulary hits 0.880 when it overlaps, and single-token phrases never rank (iteration 3).
- Loading the committed index to measure it: 3.7MB, 33,688 phrases, 13,172 paths (iteration 3).
- Reading the spec-gate core to verify the tool-boundary precedent before claiming feasibility; the delivery machinery exists, the row-mapping does not (iteration 4).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Reusing 010's federation arithmetic: stale (Mobile CLI absent; 11→13 corpus; Obsidian holds 12 of 13).
- Treating `trigger_phrases` as action matchers: they are disposition vocabulary; the router matches actions.
- Expecting a repo-relevance signal in `render.ts` — the renderer is deliberately typed-output-only; any gating signal lives in the handler (iteration 2).
- Trusting the first screen of rule frontmatter: the corpus carries 255 phrases (16-29 per file), not 8 (iteration 3).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Reusing 010's federation counts as current fact (iteration 1, evidence: directory listings).
- Prompt-topic matching via `trigger_phrases` as a substitute for action matching (iteration 1, evidence: F3 vs REPO RULES.md:12).
- Naming the corpus path in any pointer text (iteration 2, evidence: three corpus locations across the federation, F9).
- Framing an advisor pointer as action-keyed (iteration 2, evidence: prompt-time surfaces cannot match actions; iteration-002.md §4).
- Root name `repo-rules` as a drop-in for `.skilled/repo-rules` in CORPUS_ROOTS (iteration 3, evidence: outside-repo symlink refusal breaks the sibling, `corpus.mjs:307-310`).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: synthesis (verdict, silence conditions, costs, ruled-out directions); all four candidates analyzed (iterations 1-4)
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Q6 resolved in synthesis: prior work respected — 022 bar applied, 010 constraint respected, candidate (b)'s decision-against left standing with a revisit condition. No carried-forward key questions remain; follow-ups live in `research.md` §12.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Complete. Synthesis written to `research.md` with `stopReason: maxIterationsReached`; resource map emitted; registry, dashboard, and this strategy closed out.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `REPO RULES.md` (root), `.skilled/repo-rules/*.md` (13 files), `AGENTS.md` Gate 5 (`:93-101`) and §8 (`:261`), `retrieval-conventions.md:284`, `specs/hooks/022-smart-rule-injection/`, `specs/agents/010-repo-rule-system-integration/research/synthesis.md`.
- Candidate source pointers: `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`, `.skilled/hooks/`, `.claude/settings.json`.
- Federation: canonical corpus `.skilled/repo-rules/`; compatibility layer `Public/repo-rules/` (13 symlinks); Obsidian Plugin holds 12 of 13 symlinked + 3 local rules; its `AGENTS.md`/`CLAUDE.md`/`.skilled` symlink back here.
- Constraints and risks: read-only on the repository; write only inside the lineage dir; every load-bearing claim needs `file:line`; the runner validates exactly 4 iteration files and 4 iteration records.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-10-04T12:25:29Z

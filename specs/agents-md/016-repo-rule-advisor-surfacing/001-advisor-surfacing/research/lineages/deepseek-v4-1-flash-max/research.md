# Repo rule surfacing through the advisor — deep-research synthesis

**Verdict (one recommended path).** Do **not** add a repo-rules pointer to the advisor brief (candidate a — it fails the corpus's own admission bar). If a new surface is built, build **candidate (c): an action-keyed PreToolUse advisory** that reuses the spec-gate delivery machinery — it is the only candidate whose matching key equals the router's key (the action about to be taken), and it is the only one that addresses later-in-session actions. Candidate (b) is not recommended on this evidence: it reverses a documented decision and matches prompt topic, not action. Candidate (d) is the fallback if the classifier cannot be made high-precision; its flip test is a measured miss with cost, which does not exist in this evidence base.

Silence condition for the admitted surface: no trigger-row match, or the matched rule was already loaded this session, or the concern is disabled. Per-turn cost: ~0; per matched action: one hook process spawn (the pattern five PreToolUse hooks already use) plus a ~100-200 byte advisory, delivered once per session per matched row.

This is one model family's four-iteration read of the repository (DeepSeek V4.1 Flash), not multi-model agreement.

---

## 1. Research Metadata

| Field | Value |
|-------|-------|
| Spec folder | `specs/agents/016-repo-rule-advisor-surfacing` |
| Lineage | `deepseek-v4-1-flash-max` (`fanout-deepseek-v4-1-flash-max-1791116504576-gieznv`) |
| Executor | cli-devin, model `deepseek-v4-1-flash-max` |
| Loop | deep-research, stopPolicy `max-iterations` (4), convergenceThreshold 0.05 (telemetry only) |
| Iterations | 4 (complete); iteration files `iterations/iteration-001.md` … `iteration-004.md` |
| Stop reason | `maxIterationsReached` |
| Date | 2026-10-04 |
| Write scope | lineage artifact directory only; repository read-only |

## 2. Request Summary

Should `system-skill-advisor` (or another surface) support and suggest repo rules from `.skilled/repo-rules/` without adding context the model does not need? Four candidates were to be evaluated, each on: what it would emit, its silence condition, per-turn context cost, action-vs-topic matching, symlink-federation portability, and evidence for and against — with prior work (022, 010) either respected or explicitly overturned.

## 3. Method and Evidence Base

Four forced iterations, one focus each: (1) the Gate 5 path, corpus shape, prior work; (2) candidate (a); (3) candidate (b); (4) candidate (c), candidate (d), portability and cross-candidate comparison. Claims were taken only from files read in this run or measurements run in this run; the committed index, the rule frontmatter, the lookup, and the scoring function were exercised directly (read-only). Line numbers were re-checked against the working tree on 2026-10-04.

## 4. What the Current Path Does, and Where the Gaps Are

**Gate 5** fires on the first write of a session only — "Read-only turns never fire it" (`AGENTS.md:93-94`) — and asks the model to match **the action about to be taken** against the `REPO RULES.md` trigger table (`AGENTS.md:96`, `REPO RULES.md:12`). Nothing fires → `AGENTS.md` alone governs (`REPO RULES.md:18`). A fire with no row phrase is a silent non-load (010 synthesis, ranked item 2).

**A second static load path already exists** where Gate 5 cannot reach: five reply-time rules are named in the always-loaded document because "These five fire on a reply rather than on a write, so Gate 5 never reaches them" (`AGENTS.md:261`). Precedent: when a class of turns cannot be reached by Gate 5, the design answer so far has been a pointer in the always-loaded doc — for rules that must bind while reading (010's constraint, `010 synthesis.md:15`).

**The corpus**: 13 rule files, 255 `trigger_phrases` total (16-29 per file; measured), naming dispositions and anti-patterns ("future proof", "frozen scope", "add a retry"), not tool actions. 7 phrases are single-token and can never rank against a longer prompt (`retrieval-conventions.md:261`).

**Prior decisions that bind**: (i) the trigger index deliberately excludes `.skilled/repo-rules` — "Decided against … indexing them would surface a rule as a context candidate" (`retrieval-conventions.md:284`); (ii) 022's admission bar — "A prompt-time injection earns its slot by naming a specific prohibition a gate enforces, not by restating a disposition the always-loaded document already carries" (`022 implementation-summary.md:51`), which refused 18 candidates; (iii) 022's measurement rule — "An event's frequency must be read from the log, never reasoned about" (`022 decisions.md:33-36`).

**Federation today**: canonical corpus `.skilled/repo-rules/` (13 files); `repo-rules/` at repo root is a 13-symlink compatibility layer; the `Obsidian Plugin` sibling holds 12 of 13 symlinked plus 3 local rules, with `AGENTS.md`/`CLAUDE.md`/`.skilled` symlinked back here (directory listings; `answer-the-actual-request.md` was never propagated). "Mobile CLI", named in 010's federation finding, no longer exists.

## 5. Candidate (a): Advisor Brief Pointer

- **Would emit**: a fixed pointer line in the Directives capsule (three emit sites: `render.ts:441`, `:449`, `:486`; capsule = `\nDirectives:` + hygiene directive, appended after the 80-token route cap, `render.ts:90-93,438-449`).
- **Silence**: the brief's own no-render conditions (`render.ts:399-430`); dedup suppression to route-only on proven repeats, full at first message and boundaries (`directive-lifecycle.ts:121-180`); no repo-relevance signal exists, so it would emit in repos without `REPO RULES.md` unless a new signal is plumbed through the handler (`render.ts:389-394`; `user-prompt-submit.ts:295`).
- **Per-turn cost (measured)**: full brief today ≈261 bytes (route 42B + label 12B + hygiene 207B); a compact pointer adds ≈162 bytes ≈40 tokens on full-delivery turns, 0 on deduped turns. Content change forces one full redelivery per session (`directive-lifecycle.ts:168`).
- **Matching**: none — a standing reminder at prompt time; it cannot match actions.
- **Portability**: hooks travel by symlink; the pointer must say `REPO RULES.md` (router), never the corpus path (three corpus locations).
- **For**: fires before the first write; survives AGENTS.md-absent runtimes (the hygiene directive's own rationale, `render.ts:110-111`); returns after compact/clear.
- **Against**: fails 022's bar — it restates a Gate-5 disposition and names no gate-enforced prohibition, unlike the one directive that survived (`injection-contract.md:54`); blast radius is three render sites plus the OpenCode plugin mirror (`plugins/system-skill-advisor.js:68-73`) plus exact-string tests (`advisor-renderer.vitest.ts:15-22`); the two directives retired before it failed the same test.
- **Disposition**: **refused**. Revisit only if a hook-capable runtime configuration is observed where AGENTS.md is genuinely absent and the pointer would be the sole carrier of a gate obligation.

## 6. Candidate (b): `.skilled/repo-rules` in `CORPUS_ROOTS`

- **Would emit**: lookup rows surfacing rule documents as context candidates (`{matchClass, path, phrases, score}`, cap 20; `lookup-trigger-index.mjs:119-212`), which the model then reads (rule files are 5.6-11.8 KB).
- **Silence**: exit 1 no-hit; `--scoring-only` drops score-0 rows (`lookup-trigger-index.mjs:22-24,204,335`). Measured today: rule-vocabulary prompts return zero results (two runs). Simulated with the real scorer: "add a retry" → root-cause, "force push" → blast-radius, "unsolicited warning" → answer-the-actual-request, all 0.880 query-containment; "flexible" alone hits nothing.
- **Cost (measured)**: index today 3,738,528 bytes / 33,688 phrases / 13,172 paths; the change adds 13 paths (+0.10%) and 255 phrases (+0.76%); estimated +10-25 KB index growth; parse dominates per cold lookup (`lookup-trigger-index.mjs:11-15`), delta sub-ms.
- **Matching**: prompt topic (user vocabulary), never the model's action; the trigger table's action phrases are absent from every rule's `trigger_phrases`.
- **Portability**: canonical `.skilled` path wins realpath dedupe (`corpus.mjs:283-327`); the sibling reads the same committed index through the shared symlink; root `repo-rules` would break the sibling (outside-repo link refusal, `corpus.mjs:307-310`); one static root cannot serve both layouts; sibling-local rules stay uncovered.
- **For**: earliest possible firing (before any write, every prompt); empirically high-quality hits when vocabulary overlaps; silence is the default; one-line change plus regeneration; no hook surface changes.
- **Against**: reverses the documented decision (`retrieval-conventions.md:284`) whose stated reason is structural; topic-keyed surfacing can fire on benign mentions ("frozen scope" in a documentation request); rule frontmatter joins a fail-closed corpus-wide publication (`generate-trigger-index.mjs:11-14`); 7 dead-weight single-token phrases; one rule phrase (`silent reinterpretation`) already belongs to another index document; the corpus checker is index-blind (`check-repo-rules.cjs:292-312`).
- **Disposition**: **not recommended on this evidence**. The empirical hit test is the strongest evidence for it, but it does not clear the bar to overturn a documented decision; revisit only with a measured topic-keyed miss (a read-only turn where a rule's knowledge was needed and the vocabulary overlapped) plus an explicit operator decision.

## 7. Candidate (c): Action-Keyed PreToolUse Advisory

- **Would emit**: on a matched tool call, an advisory naming the rule file(s) to load before proceeding, e.g. "REPO RULES: this action matches [row]; load [file]" — as tool-time context on every runtime (`injection-contract.md:143-202`).
- **Silence**: no trigger-row match; once-per-session delivery per matched row with boundary re-arm; disabled via the standard kill-switch family.
- **Per-tool-call cost**: one `node` process spawn per matched event (the existing pattern: five PreToolUse hooks already run on Bash/Write/Edit/Task, `.claude/settings.json:43-102`); ~100-200 bytes of advisory text per delivered row; ~0 per turn otherwise. Real frequency must be read from the hook's log after build — it cannot be pre-measured (022's rule).
- **Matching**: **action** — the router's own key (`REPO RULES.md:12`, `AGENTS.md:96`). The only candidate that matches the action about to be taken, and the only one that re-matches later-in-session actions.
- **Feasibility**: the delivery machinery is precedented in production — `spec-gate-enforce` fires on `Write|Edit` (`settings.json:98-102`), with tool-name sets (`spec-gate-core.mjs:140-142`), deliver-once + re-arm (`:404-452`), lifecycle epochs (`:296-314`), kill switches (`:80-82`). The **new work** is the tool-call → trigger-row classifier; no such mapping exists today (checked; spec-gate classifies spec-folder intent, not rule rows).
- **Portability**: one shared core under `.skilled/hooks/` travels by symlink; it reads whichever repo's `REPO RULES.md` it fires in; wiring is per-runtime, as spec-gate already pays.
- **For**: the router's own matching key; addresses the third structural gap (unprompted re-consultation) mechanically; silent by default; gate-serving, so it fits the 022 bar's spirit and the accepted tool-time advisory family (spec-gate denial, dispatch lint, MCP route guard).
- **Against**: the classifier is new work with false-positive risk (surfacing rules the model does not need) and false-negative risk (missing the action); per-runtime wiring and process spawns join an already five-hook surface; frequency is unmeasured until built.
- **Disposition**: **recommended**, built as the smallest version: high-precision action signatures only, deliver-once per session per row, kill switch, and post-build telemetry to read the real frequency before any widening.

## 8. Candidate (d): No New Surface

- **What it is**: keep the single Gate 5 door plus the §8 static reply-rules path.
- **For**: every candidate carries costs; Gate 5 has clear semantics; 022 refused 18 injections for less; the corpus is hand-maintained and "nothing else reads it" (`check-repo-rules.cjs:5-10`) — each new reader adds coupling.
- **Against**: the three structural gaps are real (first-write-only; read-only turns; unprompted re-consultation), and (c) closes the third by construction.
- **Flip test**: a measured miss with cost — a rule that should have bound an action did not, with evidence from a log. No such measurement exists in this evidence base, and none exists for the alternatives either; the deciding evidence here is structural fit, not frequency.
- **Disposition**: **fallback**. If the (c) classifier cannot be made high-precision, (d) is the honest choice, and the revisit trigger is the measured miss.

## 9. Ranked Recommendations

1. **Build (c), smallest version** — action-keyed PreToolUse advisory reusing the spec-gate pattern: conservative action signatures → deliver-once advisory naming the rule file(s) → re-arm at boundaries → kill switch → log. Silence: no match, already-loaded, disabled. Cost: process spawn + ~100-200B on matched events only; ~0 per turn.
2. **Instrument before widening** — emit one structured row per delivered advisory (matched row, rule file, iteration) so 022's frequency rule can be applied to real data before broadening signatures or adding surfaces.
3. **Do not add (a)** — refused under the 022 bar; revisit only on the AGENTS.md-absent configuration.
4. **Do not add (b) on this evidence** — the documented decision stands; revisit only with a measured topic-keyed miss plus an operator decision. If ever revisited, note the root-name trade-off (`.skilled/repo-rules` serves the shared corpus; `repo-rules` breaks the sibling).
5. **Keep (d) as the fallback**, with the measured-miss flip test.

## 10. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Advisor-brief pointer line (candidate a) | Restates a Gate-5 disposition; names no gate-enforced prohibition; fails the 022 bar that retired two predecessor directives | `022 implementation-summary.md:51`; `injection-contract.md:54`; `render.ts:438-449` | 2 |
| Corpus-path text in any emitted pointer | Not portable across the three federation layers | F9 listings; `REPO RULES.md:3-6` | 1, 2 |
| Action-keyed framing for prompt-time surfaces (a/b) | Prompt-time surfaces cannot match actions; the router's key is the action | `REPO RULES.md:12`; `AGENTS.md:96` | 1, 2, 3 |
| Root name `repo-rules` as a drop-in for `.skilled/repo-rules` | Outside-repo symlink refusal breaks the sibling; one static root cannot serve both layouts | `corpus.mjs:307-310`; `check-repo-rules.cjs:27-31` | 3 |
| Reusing 010's federation arithmetic as current fact | Sibling set changed (Mobile CLI gone); corpus 11→13 files; Obsidian holds 12 of 13 | directory listings | 1 |
| Single-token rule phrases as retrieval keys | Single-token phrases never rank against longer prompts (7 of 255 dead weight) | `retrieval-conventions.md:261`; measured | 3 |
| Treating the index as action-matching without a model-run action query | As wired, the lookup consumes the user prompt only | `lookup-trigger-index.mjs:132-211` | 3 |

## 11. Divergence Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none yet.
- Pivot lineage: none yet.
- Remaining frontier: none — all four candidates and the cross-candidate comparison were analyzed within the four-iteration cap; follow-up instrumentation is named in §9, not as an open pivot.
- No divergent-mode broadening occurred; this synthesis does not claim convergence. The stop was the forced cap (`maxIterationsReached`).

## 12. Open Questions

- Which exact tool-call signatures map to which trigger rows, at what precision? The classifier design is the build packet's work, not this one's; precision must be measured from delivered-advisory logs before widening.
- Does the sibling's 3 local rules (`screenshot-currency`, `spec-tree-layout`, `verification-gates`) need coverage by any future surface? Out of scope here; the shared corpus is the subject.
- Is `answer-the-actual-request.md`'s absence in the sibling a live propagation defect? Recorded (F9); remediation belongs to the rule-authoring flow, not this packet.

## 13. Confirmed, Inferred, and Unknown

- **Confirmed** (read or measured this run): Gate 5's firing contract and text (`AGENTS.md:93-101`); the router's action-matching rule (`REPO RULES.md:12`); corpus size and phrase counts (255, measured); the index artifact's size and shape (measured); the lookup's silence path (exit 1, measured); the dedup semantics (`directive-lifecycle.ts:121-180`); the spec-gate delivery machinery (`spec-gate-core.mjs`); the federation listings; the decision-against and the 022 bar.
- **Inferred** (derived, not measured): the +10-25 KB index-growth estimate (the index cannot be rebuilt inside this lineage's write surface); the (c) classifier's precision (nothing exists to measure yet); the exact byte size a final (c) advisory would use (draft wording measured at ~162B for (a), ~100-200B assumed for (c)).
- **Unknown**: the real-world miss frequency for any candidate (no log exists — 022's measurement rule applies); whether any runtime config loads hooks without AGENTS.md.

## 14. Evidence Ledger

Every load-bearing claim carries its source. Primary evidence, keyed to the findings registry:

- F1-F2 (`AGENTS.md:93-96`; `REPO RULES.md:12,18`), F3 (measured phrase counts; `prevent-overengineering.md:4-12`), F4 (`AGENTS.md:261`), F5 (`retrieval-conventions.md:284`), F6-F7 (`022 implementation-summary.md:51`; `022 decisions.md:33-36`), F8 (`injection-contract.md:52-54,64-65`), F9 (directory listings: `Public/.skilled/repo-rules`, `Public/repo-rules`, `Obsidian Plugin/repo-rules`), F10 (`010 synthesis.md:15`).
- F11-F18 (`render.ts:90-93,110-111,389-394,399-430,438-449`; `directive-lifecycle.ts:121-180`; `user-prompt-submit.ts:295,361-374`; `plugins/system-skill-advisor.js:68-73`; `advisor-renderer.vitest.ts:15-22`; node byte measurements).
- F19-F27 (`corpus.mjs:30,44-51,283-327,307-310`; `generate-trigger-index.mjs:1-45`; `lookup-trigger-index.mjs:11-15,22-26,119-212,204,335`; `freshness.mjs:4-6`; `check-repo-rules.cjs:5-10,27-31,292-312`; `retrieval-conventions.md:261,284`; measured index stats; lookup runs; scorePhrase simulation).
- F28-F34 (`spec-gate-core.mjs:80-82,140-142,296-314,404-452`; `.claude/settings.json:43-102`; `injection-contract.md:79-80,143-202`; `REPO RULES.md:12`; `AGENTS.md:96`; `010 synthesis.md:15`).

Full statements and per-finding citations: `findings-registry.json` (34 findings) and `deltas/iter-001.jsonl` … `deltas/iter-004.jsonl`.

## 15. Method and Evidence Limits

- One model family, four iterations: this is one opinion iterated, not multi-model agreement; the sibling lineage (`swe-2-max`) converges independently and the parent synthesis must report disagreements rather than average them.
- No log-based frequency evidence exists for any candidate (none is built); cost statements are code-derived (delivery paths, byte sizes, spawn patterns) and labeled as such.
- The index-growth estimate is derived, not built (write containment forbids regenerating the index here).
- The 0.880 simulation used the real scorer but hand-chosen prompts; it demonstrates the mechanism, not a hit-rate distribution.
- Line numbers were verified on 2026-10-04; prior packets' line references (e.g. 010's `AGENTS.md:122`) have drifted and were re-derived rather than trusted.

## 16. References

- `AGENTS.md` (root) — Gates, §8 communication load line, verification standards.
- `REPO RULES.md` (root) — trigger table, usage rules, §4 scope.
- `.skilled/repo-rules/*.md` — 13 rule files, 255 trigger phrases.
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`; `hooks/lib/directive-lifecycle.ts`; `hooks/claude/user-prompt-submit.ts`; `.skilled/plugins/system-skill-advisor.js`.
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`; `lookup-trigger-index.mjs`; `generate-trigger-index.mjs`; `lib/freshness.mjs`; `runtime/data/trigger-index.json`; `references/retrieval/retrieval-conventions.md`.
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`; `.claude/settings.json`.
- `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs`.
- `.skilled/hooks/injection-contract.md`.
- `specs/hooks/022-smart-rule-injection/` (decisions.md; 001-deep-research/implementation-summary.md).
- `specs/agents/010-repo-rule-system-integration/research/synthesis.md`.
- `specs/agents/016-repo-rule-advisor-surfacing/spec.md` (problem statement, requirements).
- `resource-map.md` (this lineage) — consulted sources and themes.

## 17. Convergence Report

- Stop reason: `maxIterationsReached` (forced cap; convergence before the cap was telemetry only)
- Total iterations: 4
- Questions answered: 6 / 6 (Q1-Q5 in iterations; Q6 resolved in synthesis)
- Remaining questions: 0 key questions; §12 carries follow-up conditions
- Last 3 iteration summaries: run 2 — candidate (a) characterized (pointer mechanics, dedup, byte costs, 022 bar failure); run 3 — candidate (b) characterized (one-line root, exit-1 silence, measured index growth, 0.880 simulation hits, decision-against); run 4 — candidate (c) and (d) characterized, portability and cross-candidate comparison complete
- Convergence threshold: 0.05 — newInfoRatio trend 0.90 → 0.75 → 0.80 → 0.70; no convergence claim is made
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report

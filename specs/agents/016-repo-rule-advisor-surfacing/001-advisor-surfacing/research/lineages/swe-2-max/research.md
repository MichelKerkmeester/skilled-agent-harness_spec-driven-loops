---
title: "Repo rule surfacing through the advisor — detached research synthesis"
trigger_phrases: []
---
# Repo rule surfacing through the advisor — detached research synthesis

**Lineage:** `swe-2-max`
**Session:** `fanout-swe-2-max-1791116504576-gieznv`
**Loop:** `research`, 4 iterations, `max-iterations`
**Artifact root:** `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max`

## 1. Verdict

**No new model-facing surface — candidate (d) — with one narrow admissible build and one CI-side fix named instead.**

The coverage the question asks about is already a designed partition, not a gap: the five reply-fired rules load by name on every substantive reply (`AGENTS.md:261`), the eight action-fired rules load through Gate 5's action-matched trigger table at first write (`AGENTS.md:93-101`), and the binding clauses of the reasoning rules are resident in the always-loaded document (Verification Standards "bind unconditionally, including on a read-only turn where Gate 5 never fires", `AGENTS.md:153`; Confidence Thresholds §2:70-78; Restraint Signals §3:135-147). The genuinely uncovered cell — the *expanded* text of roughly four reasoning rules (uncertainty, evidence, root-cause, delegation) on pure read-only reasoning turns — is narrow, non-blocking by precedence (rule content is level 3, `REPO RULES.md:22-27`), and has no measured failure rate.

Every proposed surface fails on evidence, not taste:

- **(a) advisor-brief pointer** fails the settled injection bar: it would restate Gate 5 text the always-loaded document already carries, and no mechanical gate enforces the trigger-table load — both prongs the comment-hygiene directive satisfies and this would not.
- **(b) trigger-index inclusion** reverses a recorded decision (`retrieval-conventions.md:284`) enforced by a parity test, matches on prompt topic where the table deliberately matches on action, fires on the read-only turns Gate 5 deliberately skips, and measurably misses sibling-local rules under federation.
- **(c) per-action PreToolUse advisory** is structurally blind to 9 of 13 rules (their triggers fire inside reasoning/prose, not at a tool boundary), and the riskiest tool actions it could catch are already guarded (`git-preflight-advisory`, `git-message-gate`, `dispatch-preflight-lint`).

**The one admissible build** is the strong form of (c): a once-per-session `additionalContext` at the first non-exempt mutation reminding the model to match its action against `REPO RULES.md` — Gate 5 given the mechanical backstop every other [HARD] gate already has. It is the only form that passes all four tests (names a declared gate's prohibition at the moment it binds; matches the action event; self-silences via the cloneable Gate-3 marker; ~one line per session at a measured ~1–33/day precedent rate). **Its admission is blocked on evidence:** no Gate-5 miss telemetry exists anywhere, and the 022 measurement rule forbids building on an unmeasured rate. Recommend it only if a miss is observed or the operator accepts the unmeasured risk.

**The real fragility the evidence points to is CI-side, not model-side:** nothing mechanically checks that `REPO RULES.md` trigger rows cover their rules' fire lists — that failure already happened once (five rows silently dropped fires, 010 item 2). The `create-repo-rule` verify step checks counts and link resolution only. That is the surface worth building: a coverage check in the authoring path, not a suggestion surface at read time.

## 2. Scope and Boundary

This lineage read the repository and the sibling checkouts on this machine; it wrote only inside its bound artifact root. It did not modify `AGENTS.md`, `REPO RULES.md`, any rule file, hook, settings file, the spec docs, shared telemetry, or git state. The `resolveArtifactRoot` node was skipped; `artifact_dir` was bound directly from `config.fanout_lineage_artifact_dir`.

The question evaluated: should `system-skill-advisor` (or another surface) support and suggest repo rules from `.skilled/repo-rules/` without adding context the model does not need? Candidates: (a) advisor-brief pointer, (b) trigger-index corpus inclusion, (c) action-keyed PreToolUse advisory, (d) no new surface, plus evidence-raised variants (advisor-scored rule recommendations; refined-(e) rule-presenting index lane).

## 3. The Candidate Matrix

| Axis | (a) brief pointer | (b) trigger-index | (c) PreToolUse advisory | (d) no new surface |
|---|---|---|---|---|
| Emits | constant 2nd directive under `Directives:` | `{matchClass,path,phrases,score}` rows in Gate 1 output | `additionalContext` at first mutation (strong) / per classified action (weak) | — |
| Silence | never self-silent; dedup-suppressed only | silent on vocabulary miss (exit 1) | silent by marker (strong) / on no-match (weak) | — |
| Cost/turn | ~0 suppressed; ~150–250 chars per full-delivery episode | 1 candidate row per matching turn; <1% artifact growth | ~1 line per session (strong form) | 0 |
| Match key | none — constant | prompt topic | tool action — ≤4/13 rules observable | — |
| 022 bar | fails both prongs | n/a (retrieval) | strong form passes | — |
| Portability | clean — shared renderer | misses sibling-local rules (out-of-root symlink skip) | weakest — per-runtime invisibility traps | — |
| Prior decision | retired-directives precedent against | decided against (`retrieval-conventions.md:284`) | Gate-3 marker precedent for | promotion remedy (022) endorses partition |
| Verdict | refuse | refuse | admissible only as strong form, gated on measured miss | verdict |

Evidence per cell is in `iterations/iteration-002.md`, `iteration-003.md`, `iteration-004.md`.

## 4. What Each Candidate Would Emit, Cost, and When It Stays Silent

**(a)** — A second constant line under `Directives:` in `renderAdvisorBrief`, appended to every brief and every fallback head (`render.ts:438-449,476-489`); registered as a new policy id beside `POLICY_COMMENT_HYGIENE_ID` (`render.ts:102-106`). Silent never — constant directives have no condition; the lifecycle dedup suppresses the whole Directives block after first proven delivery and re-delivers on lifecycle boundaries, transcript resets, or fail-open doubt (`directive-lifecycle.ts:139-178`). Cost: zero on suppressed turns, ~150–250 chars per delivery episode. Refusal test: the 022 bar — "a prompt-time injection earns its slot by naming a specific prohibition a gate enforces, not by restating a disposition the always-loaded document already carries" (`decisions.md:21-24`); hygiene survives on both prongs (pre-commit gate + `AGENTS.md`-absent runtimes, `render.ts:110-112`), this fails both.

**(b)** — `.skilled/repo-rules/*.md` rows in Gate 1 lookup output (`lookup-trigger-index.mjs:51,129`). Live check: `"name the rollback first before force pushing"` returns `results: []` today by design; indexed, `blast-radius.md` matches on two phrases. Silent on vocabulary miss (exit 1, `--scoring-only`, `:22-26`) — but never on action-irrelevance: it fires on read-only turns, inverting Gate 5's deliberate exemption (`AGENTS.md:94`). Cost: ~+300 phrases on a 3.7MB/33,688-phrase committed artifact (<1%) + one surfaced row per matching turn + a Read the model may take. Refusal test: the recorded decision itself — "indexing them would surface a rule as a context candidate" (`retrieval-conventions.md:284`), parity-test-enforced (`:271`, `corpus.mjs:30`).

**(c)** — Strong form: one `additionalContext` line at the session's first non-exempt Write|Edit, via a clone of `gate3DeliveryMarker`/`recordGate3NoticeDelivered` (`spec-gate-core.mjs:376-444,1736-1783`), seated beside `spec-gate-enforce.mjs` on the `Write|Edit` matcher (`.claude/settings.json`). Silent after first delivery per session and on read-only sessions. Cost ≈ ~1 line/session; precedent rate ~1–33/day (`spec-gate-warnings.log` histogram). Weak form: per-action classification — refused, ≤4/13 rules observable at the tool boundary (`REPO RULES.md:40-52` fire lists) and already-guarded commands.

**(d)** — Emits nothing; costs nothing. Stands because the partition was designed: §8 reply-fired loader (`AGENTS.md:261`), §4 unconditional binding (`:153`), Gate 5 action-matching (`:96`), promoted resident clauses per the 022 remedy ("a clause that must bind while reading belongs where it always loads", `implementation-summary.md:55`).

## 5. Portability (measured on the live federation)

The corpus is a double symlink chain: `Obsidian Plugin/repo-rules/*.md` → `Public/repo-rules/*.md` → `Public/.skilled/repo-rules/*.md`, plus three sibling-local rules (`screenshot-currency.md`, `spec-tree-layout.md`, `verification-gates.md`) that `.skilled/repo-rules` does not contain; the sibling `REPO RULES.md` is its own real file with its own table (`ls -la` verified on both checkouts).

- (a) is portable by construction — the renderer is shared.
- (b) indexes the shared 13 in a sibling through the linked `.skilled` dir (entries are real files, `isLink=false`, so the out-of-root refusal does not fire — `corpus.mjs:299-310`, live-probed), but structurally misses sibling-local rules at root `repo-rules/` (file links resolve outside the sibling root → skipped, `corpus.mjs:307-310`). It under-serves exactly the repos that layer their own rules — and routing is deliberately per-repo even where content is shared.
- (c) needs per-runtime adapters; the contract documents invisibility traps (mcp-route-guard `[LOG]`-only on OpenCode, `injection-contract.md:172`; post-edit-quality stdout likely invisible on Claude/Devin, `:201`; Cursor `beforeSubmitPrompt` never delivers, `:100`).

## 6. Ruled-Out Directions (with deciding tests)

1. **Constant repo-rules directive in the advisor brief** — the 022 bar; restates resident content with no enforcing gate.
2. **Trigger-index inclusion as shipped** — recorded-decision reversal; the failure mode it prevents (topic-matched surfacing on read-only turns) is the design's point.
3. **Refined-(e): rules indexed but rendered as Gate-5 loads** — answers the exclusion's literal wording but stays topic-matched; reopen only if Gate 1 gains a non-context (action/load) presentation channel.
4. **Advisor-scored rule recommendations** — scorer kinds are `'skill'|'command'` only (`scorer/types.ts:47,156`); pollutes the routing/rule layer boundary (`REPO RULES.md:90-94`).
5. **Weak-form (c) per-action classification** — ≤4/13 rules tool-observable; riskiest commands already guarded; unmeasured need.
6. **Any surface estimated rather than measured** — the 022 measurement rule (`decisions.md:33-36`); applied to this lineage's own iteration-3 estimate, which iteration 4 corrected (~5-in-2-days → ~1–33/day).

## 7. Prior Work: Respected vs Overturned

Respected: the 022 injection bar and measurement rule (`decisions.md`), the retrieval exclusion (`retrieval-conventions.md:284`), the injection-channel catalog (`injection-contract.md`), the 010 Gate-5-only-on-write finding (three-family confirmed, `cross-lineage-synthesis.md:34`), and REPO RULES.md §4's scope line. Overturned: nothing — but two prior items are reframed: 010 item 18 (mechanical coverage gap) is named here as the real fix, and the "read-only turns never fire" framing in `spec.md:38` is narrowed by the discovered §8 loader.

## 8. Remaining Unknowns / What Would Change This Verdict

- **A measured Gate-5 miss rate** — any telemetry showing models skip the trigger-table load in sessions that write would admit the strong-form (c) build.
- **A Gate 1 action/load channel** — if the lookup ever presents candidates by obligation-type rather than context-type, refined-(e) reopens.
- **Rule corpus growth** — if reply-fired rules grow beyond the five §8 names, the partition needs re-checking (the §8 list is hand-maintained).
- **Mirror-runtime Gate-5 reach** (010 item 28, still open) — if a runtime's AGENTS.md path differs, the portability matrix needs a row.

## 9. Convergence Report

- Stop reason: `maxIterationsReached` (stopPolicy `max-iterations`; convergence was telemetry-only per workflow).
- Iterations: 4/4 complete; newInfoRatio trend `[0.92, 0.80, 0.55, — ]` rolling ~0.76 — each pass produced non-redundant evidence (baseline+prior law → measured candidate shapes → portability+mechanism → verification+the §8 discovery).
- Questions: 8/8 strategy questions answered or explicitly bounded (the miss-rate question is bounded as unmeasurable-from-logs, not answered).
- Quality guards: source diversity across repo docs, runtime code, decision records, live filesystem probes, and measured logs; no single-weak-source claims — the load-bearing verdict claims each cite the code/doc line directly.

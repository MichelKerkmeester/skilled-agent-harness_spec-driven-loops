# v4 Changelog Analysis — Structure, Concision, Priority, and Major-Release Outline

**Run:** `rsr-2026-09-21T08-45-54-679Z` · **Mode:** research · **Iterations:** 10 of 10 · **Status:** complete at `maxIterationsReached`
**Target:** `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` (pinned at sha256 `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19`, commit `7076dba64b`)
**Voice standard:** root `README.md` at commit `3ad5ca25fb98916cc8cfa740212dc03800595b21`
**Execution:** `cli-pi` executor, model `llmsgateway/deepseek-v4.1-flash` at `--thinking max`, one LEAF dispatch per iteration, all state through the append gateway

---

## 1. Executive Decision

**The changelog's structure, not its sentence shape, is what costs the reader.** The voice rewrite landed: the wall census is zero and the prose conforms in the sampled constructions (5 of 10 conform outright; the divergence concentrates in two narrow classes — process-metric clauses and maintainer narration). The remaining work is structural and factual: merge the thesis restatement, compress the glance list, reorder the families to the README's own order, drop `After This Draft`, collapse `Internal Seams` into an appendix, and fix paths and counts that are wrong or already drifted.

The evidence-backed decisions, in priority order:

1. **Six path corrections are correctness fixes, not style** — `.opencode/bin/skill-advisor.cjs` (L188, L717) and `.opencode/hooks/` (L463) are dead at HEAD; the blanket "every `.opencode/*` path still resolves" sentence (L742) is false as written [SOURCE: research/iterations/iteration-004.md, F-022; iteration-007.md, F-031/F-032].
2. **One internal contradiction**: `Internal Seams` says six CLI orchestrators where the body says seven (L730 vs L274/L310/L314) [SOURCE: research/iterations/iteration-002.md, F-009].
3. **One stale census and two drifted counts**: `After This Draft` states 266 commits where 278 exist; "102 relative symlinks" measures 101; "178 recommendations" has no re-derivation source and is flagged, not corrected, by 042's own verdict [SOURCE: research/iterations/iteration-001.md, F-003; iteration-004.md, F-023].
4. **The recommended order** (Section 7) follows the README foundation order for the core block and README §7's library order for the families; the maintainer material ends in a collapsed appendix [SOURCE: research/iterations/iteration-003.md, F-018; iteration-005.md, F-025].
5. **The contract is satisfied, with three recorded departures and one non-departure**: location, frontmatter and the H1 are deliberate; the 44 `&nbsp;` separators are mandated by the contract's structure rules and must not be stripped to match the README [SOURCE: research/iterations/iteration-002.md, F-012/F-013].

**Implementation remains deferred.** This packet delivers findings, decisions, a recommended order, and an executable patch list. Nothing in `CHANGELOG-v4.0.0.0.md`, `README.md`, or the `sk-create-changelog` skill was modified by this run (verified: `git status --porcelain` clean for both pinned files at every iteration 6–10).

---

## 2. Research Objective and Boundaries

### Objective

Analyze the current v4 changelog against the live root README voice, recent commits since the rewrite baseline, the 033 parent and relevant phase specs, and the `sk-create-changelog` contract. Identify unneeded or duplicated information, stale or over-specific claims, audience and priority problems, better ordering, concise prose patterns, and gaps between the changelog and shipped work. Produce evidence-backed findings, prioritized keep/merge/move/drop decisions, a recommended section order, and a candidate changelog template/outline.

### Key questions (all answered)

| # | Question | Answer home |
|---|---|---|
| Q1 | Which content duplicates README/033/contract surfaces, and what is unneeded? | F-006, F-015, F-017 |
| Q2 | Which claims are stale or over-specific against tree and commits? | F-003–F-005, F-008–F-011, F-019, F-020, F-022, F-023 |
| Q3 | Where do audience fit and priority break down, and what order fixes it? | F-007, F-018, F-025 |
| Q4 | Where does the changelog diverge from the live README voice? | F-001, F-002, F-016, F-019 |
| Q5 | What does the contract require, and where is departure justified? | F-006, F-012, F-013, F-014 |

### Non-goals (held)

- No implementation: the changelog, README, and contract were read-only throughout.
- No release republishing or history rewrite.
- No writes outside the run's research directory and the workflow's own state surfaces.

---

## 3. Method and Evidence Provenance

Ten iterations, each a fresh-context LEAF dispatch through the `cli-pi` executor (`deepseek-v4.1-flash`, `--thinking max`, 900 s ceiling), each writing an iteration narrative, a delta JSONL, and one canonical record through the append gateway. The orchestrator rendered each prompt pack from the reducer-refreshed strategy, ran the per-iteration reducer, and persisted coverage-graph deltas.

Evidence classes used in this document:

- **Observed**: measured from the tree, the files, or git (`sha256`, `grep -c`, `git rev-list`, `find`).
- **Derived**: follows from an observation with the step shown.
- **Inferred**: labeled where it appears, with the check that would confirm it.

Known evidence limits, discovered and recorded by the run itself:

- **The machine's question-resolution channel cannot hear iteration answers.** `reduce-state.cjs` resolves a question only from `answeredQuestions`/`keyQuestions`/`focus` on the state-log iteration record; the ledger upcaster folds those fields into `outputDigest` and the projection re-emits six keys, none of them the answer fields [SOURCE: research/iterations/iteration-009.md, F-036]. The dashboard will therefore report `Answered: 0/5` at close; the substantive answers exist in iterations 2–4 and in this document. This is telemetry, not missing research.
- **The narrative parser reads a fixed heading vocabulary** (`Focus`, `Findings`, `Ruled Out`, `Dead Ends`, `Questions Remaining`, `Sources Consulted`, `Reflection`, `Recommended Next Focus`), so iterations 1–7's `## NEXT FOCUS`/`## FINDINGS` variants were invisible to the reducer until iteration 8 wrote the parsed vocabulary [SOURCE: research/iterations/iteration-008.md, F-033].
- **The delta stream's only reducer consumer is the resource map**; `graphEvents` has no reducer consumer [SOURCE: research/iterations/iteration-009.md, F-038].
- Every iteration reported **zero scope violations**; one disclosed `/tmp` cleanup deviation (iteration 8) touched no repository path.

---

## 4. The Changelog and Its Four Competing Surfaces

### 4.1 What the document is now

At the pinned blob: 747 lines, 18 H2 sections, 56 H4 items, 19 `---` rules, 44 `&nbsp;` separators, frontmatter plus an H1 version header [SOURCE: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md; measured at iterations 3, 4, 6, 7].

### 4.2 The four surfaces it shares facts with

| Surface | Overlap | Single home for the fact |
|---|---|---|
| Root README §2 OVERVIEW | One benefit-led bullet per subsystem; the changelog's 31-bullet glance fills the same role at ~5× the volume | README owns standing product copy; the changelog keeps one line per family |
| Root README §3+ (adoption) | `Upgrade Notes` duplicates install/repoint/adoption territory | README owns standing guidance; the changelog keeps one pointer to `upgrading-a-skill-to-v4.md` |
| 033 phase children | 034/035/042/043/044/045 own the durable history; `After This Draft` restates it worse | The packets own history; the changelog owns the reader digest |
| `sk-create-changelog` contract | The H4 item skeleton is followed; location, frontmatter and the H1 depart deliberately | Contract rules are followed except the three recorded departures |

[SOURCE: research/iterations/iteration-001.md, F-006; iteration-002.md, F-015]

### 4.3 Where duplication earns a merge or a drop

The duplication table (F-015) distinguishes three legitimate duplicate roles — headline, detail, action — from the duplication that costs: a section restating a mechanism instead of its role, and maintainer-only material occupying reader-facing slots. Eight of ten `Internal Seams` bullets restate a section above; the intro and `One Shape for Every Skill` restate the same thesis; the glance list previews sections in near-verbatim sentences [SOURCE: research/iterations/iteration-002.md, F-015; iteration-003.md, F-017].

---

## 5. Stale, Contradicted, and Over-Specific Claims

| # | Claim | Status at the pinned blob | Class |
|---|---|---|---|
| F-003 | "266 commits landed after the last edit (`1d43dbd38b`); none are recorded" | 278 measured; the framing is false (jev/orca are recorded) | Stale + false framing |
| F-004/F-022/F-032 | "Every `.opencode/*` path in this document still resolves, as a symlink alias" | `.opencode/bin/`, `.opencode/hooks/` and `.opencode/specs` as a symlink are dead/absent; the sentence is already false | Correctness |
| F-005 | The rewrite targeted a README snapshot | Five README voice commits landed after `7076dba64b`; the voice baseline moved | Stale baseline (now pinned, F-026) |
| F-009 | `Using "Six CLI-orchestrator skills"` (L730) | Contradicts L274/L310/L314 and the named seven-name roster | Internal contradiction |
| F-010 | "The agent names behave as before" | False: two agent renames are listed later in the same document | Internal contradiction |
| F-011 | The quality-packet rename | Named three ways; drops the `sk-` prefix | Internal inconsistency |
| F-008/F-020/F-023 | Over-specific counts | "102 relative symlinks" measures 101; "178 recommendations" not re-derivable (042 A16); "21 ids across six families", "eighteen of the twenty-two", cache-fork history soften to role | Drift-prone |
| F-019 | `.opencode/*` sweep | 11 occurrences: 6 current-path fixes, 4 historical keeps, 1 verify, 1 reword | Correctness + style |
| F-041 | — | Mechanism note, not a changelog claim: iteration `status` is a closed enum; a descriptive value is refused at append | Runtime |

The four spec-tracked corrections ("Seven hubs", "nine modes" ×2, "other six hubs") stand as landed and verified against REQ-004 [SOURCE: research/iterations/iteration-001.md, F-008; iteration-004.md, F-021].

---

## 6. Voice Conformance Against the Pinned README

Ten sampled constructions, changelog against README HEAD rule: five conform outright (thesis-first opener, second person, bold-lead-in bullets, benefit-labeled sections, short concrete closes) and the divergence concentrates in two classes [SOURCE: research/iterations/iteration-003.md, F-016]:

- **Process-metric clauses**: "28KB command", "3,000-line template", "496 lines to 284", "eighteen of the twenty-two" — README states outcomes and product surfaces, never file sizes or process ratios. Soften or drop.
- **Maintainer narration**: the benchmark pilot transcript, the cache history, the "writing this draft" close — move to the owning packets, keep the durable claims.

Two constructions need rewrites: "You feel this change everywhere" (mood sentence) and the sentence-length H4 "A Closed Roster, and Where It Is Narrower Than the Code" (retitle "A Closed Roster").

**Consequence for the implementation pass:** scope the prose edits to those two classes; leave the opener, second person, bullet pattern and close sentences alone. The prose delta is narrow compared with the structural delta.

---

## 7. Recommended Section Order

Ordering principles, in priority: why-first then what; core systems in the README §2 foundation order; families in README §7's library order; cross-cutting surfaces after the product scan; doctrine last; upgrade actions at the close; maintainer material collapsed in an appendix.

| # | Section | Change from the current document |
|---|---|---|
| 0 | Frontmatter + H1 | unchanged |
| 1 | Why This Release (intro merged with the thesis) | merge `One Shape for Every Skill` in; fix the agent-names clause (F-010) |
| 2 | What's New at a Glance | compress 31 bullets to ~15, in body order; drop near-verbatim previews |
| 3 | Spec Kit | stays first family |
| 4 | The Deep Loops, Unified and Extended | up from 4th body family to 2nd |
| 5 | Orchestrating Other AIs | 3rd, adjacent to the loops |
| 6 | The Skill Advisor | 4th — README puts the loop before the advisor |
| 7 | One Code Skill | first of the family block |
| 8 | MCP Tooling | up, per README §7 |
| 9 | The Design Surface | after MCP |
| 10 | Documentation as a System | down; keeps the sk-doc-specific half, generic hub mechanics move to the intro |
| 11 | Prompt Engineering | last family |
| 12 | Hooks, Goals and the Runtime | into the cross-cutting block; fix L463 |
| 13 | Safer Git | follows Hooks |
| 14 | Agent Discipline | doctrine |
| 15 | Plain-English Output | doctrine |
| 16 | Upgrade Notes | position kept; restructured shape |
| 17 | Appendix: Under the Hood | was `Internal Seams`, collapsed, deduped, `Six`→`Seven`, L742 reworded |
| — | `After This Draft` | removed; four facts fold into owners |

The family-block order is settled against README §7 SKILL LIBRARY: **Code → MCP → Design → Documentation → Prompt** (iteration 2's `Code → Documentation → Design → MCP → Prompt` is superseded) [SOURCE: research/iterations/iteration-003.md, F-018; iteration-005.md, F-025].

---

## 8. Keep / Merge / Move / Drop Decisions

| Section | Decision | Detail |
|---|---|---|
| Frontmatter + H1 | KEEP | departure recorded (F-013) |
| Intro | KEEP, trim | fix agent clause; keep the two breaking bullets |
| What's New at a Glance | KEEP, COMPRESS | 31 → ~15 bullets, body order |
| One Shape for Every Skill | MERGE into intro | keeps the four reasons |
| Spec Kit | KEEP | fix L101 spelling; soften `178`-class metrics |
| The Skill Advisor | MOVE down | fix L188; keep the Breaking callout |
| Documentation as a System | MOVE, SPLIT | generic mechanics to intro; sk-doc specifics stay |
| The Deep Loops | MOVE up | ledger section stays; soften `178` |
| Orchestrating Other AIs | KEEP position, TRIM | fold Pi-depth H4s; roster asymmetry to appendix |
| Hooks, Goals and the Runtime | MOVE to cross-cutting | fix L463 |
| The Design Surface | KEEP | trim double caveat |
| One Code Skill | MOVE up | absorb the retired mobile surface |
| Safer Git | KEEP | already policy-shaped |
| Prompt Engineering | KEEP last family | no change beyond order |
| MCP Tooling | KEEP | fix L660; fold cli-orca in |
| Agent Discipline | KEEP | doctrine |
| Plain-English Output | KEEP | doctrine |
| Upgrade Notes | KEEP position, RESTRUCTURE | fix F-011 naming; fold `.skilled/` root fact in; adopter bullet → one pointer |
| Internal Seams | MOVE to collapsed appendix | dedupe 8 bullets; `Six`→`Seven` |
| After This Draft | DROP | four facts to owners; hashes to the 033 packets |

Every merge/move/drop has a named owner: 017/019/021 (memory decommission), 020 (runtime rename), 040 (Gate 3), 007/009 (completion gate, rules), 023/024 (reindex/metadata), 030/032 (simplification rounds), 003/008 (templates), 031/033 (CI), 010/029/038 (goals), 044 (late-cycle), 043 (README adoption), 041 (`.skilled` migration), 035 (draft mechanics). Two classes have no 033 child — deep-loop ledger narration and `cli-*` executor internals — and travel to component-owned records instead [SOURCE: research/iterations/iteration-003.md, F-017].

---

## 9. Candidate Major-Release Outline

```text
frontmatter (title, trigger_phrases)
H1  v4.0.0.0, Fewer Skills, Safer Paths

WHY THIS RELEASE          two paragraphs of shape plus failure paths, then the two
                          must-know breaking bullets; intro trimmed per F-016
WHAT'S NEW AT A GLANCE    ~15 bullets, body order; previews deduped against README §2
THE CORE                  Spec Kit -> Deep Loops -> Orchestrating -> Advisor
THE SKILL FAMILIES        Code -> MCP -> Design -> Documentation -> Prompt
THE SYSTEM SURFACES       Hooks and Goals -> Safer Git -> Agent Discipline -> Plain-English
UPGRADE NOTES             renames to adopt / repoint what moved / drop removed surfaces /
                          changed defaults / reconcile your own skills
APPENDIX: UNDER THE HOOD  collapsed; former Internal Seams, deduped, corrections applied
```

The appendix is the only maintainer zone; it is collapsed, and the document ends there rather than on draft residue. This is the post-validation form (F-025), reconciled with F-018 and F-023 [SOURCE: research/iterations/iteration-005.md, F-025].

---

## 10. Publication-Time Patch List (deferred implementation brief)

Ordered; each item names its verification. Nothing here was executed by this research run [SOURCE: research/iterations/iteration-004.md, F-024; corrected by iteration-007.md, F-030].

**A. Path correctness**
1. L101 → `.skilled/skills/system-spec-kit/runtime/cli/`
2. L188 → `node .skilled/bin/skill-advisor.cjs`
3. L463 → `.skilled/hooks/`; drop or soften "102"
4. L660 → `.skilled/skills/mcp-tooling/mcp-figma/`
5. L716 target → `.skilled/skills/system-spec-kit/runtime/cli/` (source stays historical)
6. L717 → `node .skilled/bin/skill-advisor.cjs`
7. L168: verify the outermost-root sentence against the post-migration boundary
8. L742: reword without "every" (F-032)

**B. Internal consistency**
9. L730 `Six` → `Seven`
10. F-016 prose trims at their corrected lines: L11, L35, L36, L50, L58, L383, L705, L738

**C. Counts** (per F-023): L295 drop; L274 soften; L463 soften/drop; L393 soften; L35 soften.

**D. Structure**: merge `Internal Seams` into the collapsed appendix; drop `After This Draft`; dedupe glance vs thesis vs README; apply the F-018 order. The structural edits necessarily change the REQ-005-pinned counts (18/56/19/44); treat them as a pre-change baseline and record the delta, or amend REQ-005 in the same change [SOURCE: research/iterations/iteration-006.md, F-027].

**E. Post-edit checks**: re-run the count greps against the amended REQ; probe every remaining `.skilled/` mention; confirm no `.opencode` current-path spelling remains; re-verify the six/seven roster statement.

**Anchor discipline** (found the hard way): every mechanical item must carry whole-line oldText — `Six`, `six families`, `skill-advisor`, `twenty-two`, `496`/`284`, and `.opencode` each match multiple sites; the six F-016 prose rewrites ship no oldText and require selection during implementation [SOURCE: research/iterations/iteration-007.md, F-030].

**Pre-flight**: re-run the pin sentinel — changelog sha256 must still equal `33abcc9a…`; if it differs, re-derive F-024 before applying it [SOURCE: research/iterations/iteration-010.md, F-040].

---

## 11. Contract Departures and Non-Departures

**Three deliberate departures** (fully audience-justified; contract rule 10 says to record them rather than hide them) [SOURCE: research/iterations/iteration-002.md, F-013]:

1. **Location** — the file lives at the packet root, not `.skilled/changelog/{component}/`; v4 is one repo-wide major release no single component owns.
2. **Frontmatter + H1** — YAML frontmatter feeds the trigger index; the H1 is the page title; the contract's expanded template expects a summary paragraph instead.
3. **No Test Impact / Technical Details sections** — the release's "files changed" are the entire repository.

**One non-departure to protect**: the 44 `&nbsp;` separators and 19 `---` rules are mandated by contract structure rules 7–9. The README has none because the README is not a changelog. Do not strip them during any voice pass [SOURCE: research/iterations/iteration-002.md, F-012].

**Format choice confirmed**: v4 is a major release, so the expanded format is correct.

---

## Eliminated Alternatives

| Direction | Why eliminated | Evidence |
|---|---|---|
| Strip the `&nbsp;` separators to match the README | Contract rules 7–9 mandate them; stripping would be a defect, not a fix | F-012 |
| Sweep every `.opencode/*` occurrence to `.skilled/` | Six occurrences are historical and must stay; a blind sweep makes them wrong | F-019, F-032 |
| Re-derive "178 recommendations" from the ledger | No ledger exists; 042's own verdict (A16) ruled it non-re-derivable | F-023 |
| Keep "102 relative symlinks" as re-derived count | Already off by one (101) and a re-derived count drifts again; prefer the per-hook phrasing | F-023 |
| Re-run the prose sample / ownership map / family tie-break | Delivered in iteration 3, validated 4–7, reproducible-identical while both pins hold | F-034, iteration-008.md |
| Write the five answers into iteration-owned surfaces to force resolution | Every iteration-owned channel drops the answer fields before the ledger; only reducer-side input moves `resolvedQuestions` | F-036–F-038 |
| Treat REQ-005's counts as a standing invariant over later edits | Makes the decision sheet's largest wins impossible; the counts are a rewrite-phase acceptance already met at the pin | F-027 |

---

## Divergence Map

- **Saturated directions:** prose-conformance re-sampling, ownership-map re-derivation, family tie-break re-derivation — all settled in iteration 3 and reproducible-identical under unchanged pins (iterations 8–10).
- **Pivots taken:** none. `convergenceMode: off` for this run; no divergent pivot was prepared or executed. The run stopped at its iteration cap.
- **Council artifact references:** none.
- **Failures / audited overrides:** none in the pivot ledger.
- **Remaining frontier:** none for research. The frontier is implementation (Section 10), gated on the pin sentinel.

---

## 12. Open Questions and Residual Gaps

- **Research:** none. All five key questions have substantive answers (iterations 2–4, consolidated here).
- **Machine telemetry (not research):** the registry reports `Answered: 0/5` at close because the answer channel is dropped before the ledger (F-036/F-037). Fixing it is a reducer-side change outside this run's write authority.
- **Implementation gaps named for the deferred pass:** whether the six F-016 prose rewrites need selection at edit time (yes — they ship no oldText); whether REQ-005 is amended or recorded as baseline-plus-delta (recommended: baseline-plus-delta, F-027); whether the two no-owner content classes travel to component changelogs (yes, per the contract's component rule).

---

## 13. Implementation Handoff

1. Re-run the pin sentinel: changelog sha256 `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19`, README `3ad5ca25fb`. On mismatch, re-derive F-024 first.
2. Apply Section 10's patch list in order (A → B → C → D), with whole-line oldText per the anchor discipline.
3. Re-apply Section 7's order (D4).
4. Apply Section 9's outline as the target shape.
5. Record the post-change counts next to the pinned baseline; amend REQ-005 only if the reviewer prefers reading (B).
6. Verification: Section 10 §E checks, plus `validate.sh 045-v4-changelog-voice-rewrite --strict`.

---

## 14. Verification Matrix

| Check | Result |
|---|---|
| Ten iteration narratives + ten deltas on disk | PASS: `iterations/iteration-001..010.md`, `deltas/iter-001..010.jsonl` |
| Every iteration routed through the append gateway | PASS: `verify-iteration.cjs` exit 0 ×10; ledger frames 1–13; projection refreshed each time |
| Route proof (mode/target/agent_definition_loaded/resolved_route) | PASS: in every delta iteration record (state-log projection drops these by design; the delta is the authoritative dispatch record) |
| Reducer: 10 iterations, 0 corruption | PASS: `reduce-state.cjs` report `iterationsCompleted: 10`, `corruptionCount: 0` |
| Coverage graph | PASS with one repaired gap: 10 iterations upserted; iteration 8's leaf used non-matching node ids and was repaired by adding the referenced nodes, then the edges |
| Pins held at close | PASS: changelog sha256 `33abcc9a…`, README `3ad5ca25fb`, both files clean in `git status` |
| Scope | PASS: every iteration reported zero scope violations; one disclosed `/tmp` cleanup touched no repo path |
| Answered 5/5 (machine) | NOT ACHIEVED — mechanism (F-036/F-037); substantive answers 5/5 |

---

## 15. References

- `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` (pinned blob)
- `README.md` (pinned commit `3ad5ca25fb`)
- `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` and `references/`, `templates/changelog/`
- `specs/system-speckit/033-system-speckit-v4/spec.md`, `timeline.md`; packet children 003–045 as named in Section 8
- `specs/system-speckit/033-system-speckit-v4/045-v4-changelog-voice-rewrite/spec.md`, `plan.md`, `implementation-summary.md`, `scratch/` (census script, rewrite script, fact extractions)
- Iteration narratives and deltas: `research/iterations/`, `research/deltas/`
- Reducer and ledger contracts: `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`; `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts`; `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts`
- Resource map: `research/resource-map.md` (emitted from converged delta provenance)

---

## 16. Convergence Report

- **Stop reason:** `maxIterationsReached` (stop policy `max-iterations`; `convergenceMode: off`)
- **Total iterations:** 10
- **Questions answered:** 5 / 5 substantive (registry telemetry reports 0 / 5 — F-036/F-037)
- **Remaining questions:** none for research
- **Last 3 iteration summaries:** run 8: reducer parse contract root-caused (0.4) · run 9: answer-channel audit (0.35) · run 10: pin sentinel holds (0.05)
- **Convergence threshold:** 0.05 (telemetry only)
- **Divergence summary:** no pivots recorded; divergence mode off; no Council artifacts
- **Graph convergence at close:** `STOP_BLOCKED` (score 0.55) at iteration 2's snapshot — telemetry only under `convergenceMode: off`; graph populated across all ten iterations after the iteration-8 repair

---

## 17. Execution Audit

- **Executor path:** `cli-pi` single-executor branch of `deep-research-auto.yaml`; every dispatch built by `buildLineageCommand` (`pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max`) and run through `runAuditedExecutorCommand` with INTENT + COMPLETION receipts in `research/dispatch-receipts/`.
- **Deviations from the raw workflow, all deliberate and recorded:**
  1. The child-dispatch Gate-3 preamble was prepended to each rendered prompt pack (required by the cli-pi contract; the workflow's template does not carry it).
  2. The state log's init config row is recorded through the append gateway rather than written directly (the projection rejects direct bootstrap rows; the observed completed runs show the ledger-owned shape).
  3. Coverage-graph events were read from the leaf-written delta (the state-log projection drops `graphEvents`), and iteration 8's id-mismatched edges were repaired by adding the referenced nodes first.
  4. The lock was re-acquired with a 4-hour TTL after the 5-minute default expired between dispatches.
- **What ran:** 10 executor dispatches (all exit 0 from the audit wrapper), 10 `verify-iteration.cjs` PASSes, 10 graph upserts (1 repaired), 10 reducer passes (0 corruption), 3 telemetry rows, 13 ledger frames.
- **Files written (all under the run directory):** `research/` state surfaces, iteration/delta/prompt files, receipts, ledgers, dashboard, registry, strategy, observability + status logs, this synthesis.
- **Not written:** the changelog, the README, the contract, and every 033 packet document (implementation deferred).
- **Operator note:** the only standing work is the deferred implementation pass in Section 13, gated on the Section 10 pre-flight sentinel.

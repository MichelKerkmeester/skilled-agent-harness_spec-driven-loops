---
title: "Offer Reach After Phases 005-010 — Why a Plain Request Rarely Gets Its Command, and What to Change Next"
trigger_phrases: []
---
# Offer Reach After Phases 005-010

Lineage synthesis for the `offer-reach` lane of segment two. Four iterations, executor `cli-opencode` with `opencode-go/deepseek-v4.1-flash#max`, convergence threshold 0.05, max iterations 4. Every claim is cited to a committed file or a committed measurement; inferred row gains are marked.

## 1. Executive Summary

The plain-offer bottleneck is not obedience and not the brief. On the 16 plain tune rows the after arm delivered a command on 5 (3 exact, 2 generic `/doctor:helper`), and on the other 11 the brief carried nothing at all. When a command was offered the model usually took it. Three separate layers decide whether a plain row is offered, and each layer fails on a different family:

1. **A hub route only acts when that hub is already the top recommendation.** The three delivered create offers are the `sk-doc` hub's single-mode route attached to a top `sk-doc`; when the top is a non-hub skill or `none`, no hub is consulted. That makes "widen the hub vocabulary" a fix only for rows whose owner is already on top, and makes a scorer anchor the prerequisite everywhere else. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:300] [INFERENCE: every delivered chat offer travels through a hub or the doctor handoff]
2. **The doctor handoff already finds the right command and then names the generic helper.** The committed matcher ranks `/doctor:agents-md` 12.781, `/doctor:ci` 12.301 and `/doctor:deep-loop` 16.249 on the three chat prompts, yet the two delivered doctor offers are `/doctor:helper` and the deep-loop row gets nothing because the strong-cue list has no "stopped converging". The smallest measured fix in this whole study lives here. [SOURCE: .skilled/commands/doctor/scripts/doctor-helper-match.cjs] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:52]
3. **The semantic lane's measured gain is orthogonal to the chat set.** The real embedder lifts plain tune recall from 9 to 14 of 45, but the five gained rows are doctor env/git/symlink and speckit handoff/plan — none in the 16-row chat set. Its present configuration cannot move the 3-of-16. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/real-embedding-after.json]

A four-item build closes all 11 missing rows on paper. Ranked by expected gain in started-when-useful per unit of risk: the doctor cluster (4 rows, measured matcher scores), the `sk-doc` paraphrase aliases (3 chat rows, data-only), the deep scorer-plus-hub pair (3 rows, two layers), and the three explicit command anchors (3 rows, the only pure scoring change). The metadata re-embed is last because it cannot be measured here.

## 2. Scope, Evidence Lanes, Terminology

- **Scope:** plain-chat command offering after phases 005, 006, 008 and 010 landed and while 011 is in flight. Excluded: anything those phases built or plan, the typed path (011 owns 44 of 44), delivery/observability (cross-cli-2 lane), and brief wording/cost (ux-cost-2 lane).
- **Lane:** `offer-reach`.
- **Terms:** *delivered offer* = `offeredCommand` in the after-arm run line, read from the replayed brief head. *Captured offer* = the capture's `offered` flag, which means a command appears anywhere in the top-3 and is an upper bound, not a delivered offer. *Exact offer* = the delivered command equals the corpus `expected_command`. *Chat set* = the 16 plain tune rows present in `runs-post-final.jsonl`.
- **Rules held:** holdout prompt rows never read or printed (counts only), tune and none rows read; no model CLI, arena or daemon started; no ollama; no write outside the lineage.

## 3. Measured State

| Runtime | Start before → after | Unsafe before → after | Brief after |
|---|---|---|---|
| claude | 3/12 → 4/12 | 0 → 0 | 24/24 |
| codex | 0/12 → 0/12 | 0 → 0 | 0/24 (hooks unapproved) |
| pi | 0/11 → 2/10 | 3 → 1 | 24/24 |
| devin | 1/8 → 3/9 | 3 → 1 | 24/24 |
| opencode | 2/7 → 1/5 | 2 → 2 | plugin loaded 24, no store trace |
| dsh | 6/12 → 6/12 | 1 → 0 | 23/23 |

Chat-set offer state, from `runs-post-final.jsonl`: 3 exact (`/create:benchmark`, `/create:changelog`, `/create:feature-catalog`) plus 2 `/doctor:helper`, 11 with no offer. The committed capture marks 6 (`cmd-create-agent-plain-tune-01` adds `/create:agent` at top-3); the renderer prints only the top recommendation plus a doctor companion, so the sixth never reached a model. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:520] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:548]

Floors in force: typed recall 24 of 44, false offers 0 of 35, attached false offers 0 of 35, scorer eval `[159,50,20,5]`.

## 4. Offer Path Inventory

| Layer | What it does | Where it fails on the chat set |
|---|---|---|
| Command row top-1 | A command row wins the scorer; the renderer prints it | 0 of 16 rows — no plain chat row has a command on top |
| Compiled hub attach | When the top is a compiled hub and its route is `route`/`single`, `attachCommand` adds the mode's command | 6 of 9 create rows: hub defers/clarifies or routes to a command-less mode |
| Skill-owner attach | Typed commands only (phase 011) | not available to plain rows |
| Doctor handoff | Inserts a passing doctor bridge when a doctor problem is detected | claims the helper on the two rows where the matcher already knows the exact command |
| Meaning gate | A real cosine ≥0.72 with a 0.02 lead can pass a command row | contributes 5 tune rows, none in the chat set |

Mechanism rule (the correction to iteration 4's first table): a hub alias only acts when that hub is already the top recommendation. Rows whose top is another skill or `none` need a scorer anchor before any hub change can take effect. This is why the deep rows need both layers and why the `sk-doc` rows need only the hub.

## 5. Findings — Why the Plain Offer Rate Is Capped

1. Every delivered plain offer travels through a compiled hub route or the doctor handoff; none comes from a command row outranking its owner. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:300]
2. The `sk-doc` hub routes 3 of 9 create chat rows to a command mode, clarifies 1, defers 4 and routes 1 to command-less `sk-create-quality-control`. [SOURCE: .skilled/skills/sk-doc/hub-router.json] [INFERENCE: compiled-route runs over the 9 readable tune prompts]
3. Hub vocabulary is paraphrase-blind: it matches the corpus phrasing ("new agent", "before and after document", "front-page overview", "skill hub") and misses ordinary rewordings ("agent definition", "specialist persona file", "before and after my rewrite", "overview page", "hub skill"). [SOURCE: .skilled/skills/sk-doc/hub-router.json]
4. Four of the five non-hub-top rows are evidence absence, not placement: `create-command` loses to the `prompt` token, `create-goal` to `packet`, `create-manual-testing-playbook` needs the literal playbook phrase, `deep-review` has `audit` lifting sk-code with no deep-loop phrase. Only `create-agent-01` is placement-like (top-3, hub clarifies). A threshold change reaches none of them. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:28] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:827]
5. Generic alias widening is a measured dead end: phase 003 added "persona file" and removed it after it wrong-offered `/create:agent` on a marketing persona prompt and dropped tune combined reach 10→9. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach/implementation-summary.md:140]

## 6. Findings — The Doctor Family

1. `matchDoctorProblem` already returns the exact command and its rank score; `applyDoctorHelperHandoff` then inserts `command-doctor-helper`. `_routes.yaml` gives `/doctor:agents-md` a read-only `check` default, `/doctor:ci` a read-only `report`, and `/doctor:deep-loop` an add-only run, so the specific command's policy is resolvable. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:143] [SOURCE: .skilled/commands/doctor/_routes.yaml:512]
2. The deep-loop row passes the matcher (16.249) but never reaches it: the strong-cue regex has no gerund form ("stopped converging"), so with a passing skill the handoff returns unchanged. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:52]
3. The doctor-helper row has no matcher candidates (`{"candidates":[]}`), so it needs a direct generic-repair cue, not a better match. [SOURCE: .skilled/commands/doctor/scripts/doctor-helper-match.cjs]
4. The doctor handoff is not the only path: the specific doctor bridge does not pass on these rows, so the insertion has to construct the passing row (as the helper handoff already does) rather than promote an existing one.

## 7. Findings — The Semantic Lane and Cost

1. Real-embedder plain tune recall is 14 of 45 versus 9 of 45 stand-in; the five gained rows are outside the chat set. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/real-embedding-after.json]
2. A command passes on meaning only at a real cosine ≥0.72 with a 0.02 lead; the lane weight is 0.05; the embedded text is the skill row's name, description, domains, intent signals and derived triggers from the skill-graph DB. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:846] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:322]
3. Enriching command rows' intent signals and re-embedding is the only generalizing lever, and it cannot be measured inside this lineage. Cost context from phase 008: 262 MB on disk, about 304 MB loaded, warm 4.8 ms, cold first call 538.53 ms. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:349]

## 8. Cross-check Against Built Phases

| Already built or planned | Consequence for this list |
|---|---|
| 005 command/policy/owner in the recommendation and brief head | No brief-wording item here |
| 006 Gate 2 binding and runtime pointers | No instruction-file item here |
| 008 embedder setup, 750 ms deadline, cost measurement | No cold-start or keep-alive item here |
| 010 `offeredCommand`/`offeredPolicy`/`briefDelivered`, Codex/DSH install, hook checks | The delivered-offer measurement used here; no delivery item |
| 011 typed 44 of 44, `TRACKED_COMMANDS`, policy on hub-attached commands, visibility guard, hook health, brief cost | The policy table this list reads; no typed-delivery item |

## 9. Ranked Recommendations

Ranked by expected gain in started-when-useful per unit of risk. "Chat rows" counts only the 16 plain rows in the after arm; wider tune rows are a bonus, not a claim.

| # | Recommendation | Files | Measurable gain | Verify | Floor risk |
|---|---|---|---|---|---|
| 1 | Name the matched doctor command instead of the helper, and teach the cue list the gerund form | `ADV/lib/scorer/doctor-helper-handoff.ts` (carry the default invocation on `DoctorProblemMatch`), `ADV/lib/scorer/fusion.ts` (`applyDoctorHelperHandoff`: when the only passing doctor bridge is the helper, construct the matched `run` bridge before that early return; add "stopped converge" to the strong cue; add an explicit no-match helper insertion for "repair path"/"I have a problem", because the current handoff cannot construct anything without a matcher candidate), tests | 4 chat rows: agents-md and ci convert to exact (matcher 12.781 / 12.301); deep-loop becomes offered (16.249); doctor-helper becomes offered via the no-match insertion | `doctor-helper-match.cjs --json` scores stay as measured; new unit cases assert the matched `run` command replaces the helper, an `ask` match keeps it, and the no-match cue inserts the helper; a smoke run shows `offeredCommand` `/doctor:agents-md check`, `/doctor:ci report`, `/doctor:deep-loop`, `/doctor:helper`; false offers 0/35 | **Low.** Same firing gate for the two conversions; two cue phrases absent from all 31 none rows. Policy comes from `TRACKED_COMMANDS` (011) or a `COMMAND_ROWS` scan. |
| 2 | Add task-shaped paraphrase aliases to the `sk-doc` hub's mode vocabulary | `.skilled/skills/sk-doc/hub-router.json` (agent: "agent definition", "specialist persona file"; diff: "before and after my rewrite"; goal: "intent file"; manual: "test script package", "walk through by hand"; command: "prompt shortcut", "argument-hint"; skill-parent: "hub skill"; readme: "overview page"; repo-rule: "policy file that the repository root") plus the compiled policy snapshot and canary cases | 3 chat rows (agent-01, agent-02, diff) plus up to 5 wider tune rows; no scorer change | `compiled-route.cjs --hub sk-doc` returns `route`/`single` for the named prompts; the 22-case canary keeps `one-turn-clarify` and `zero-signal-defer` and gains one paraphrase case per widened mode; capture plain tune ≥12 of 45 stand-in; false offers 0/35 | **Low-medium.** Two artifacts (hub source plus compiled snapshot). "specialist persona file", never "persona file" (phase 003). |
| 3 | Pair a deep scorer anchor with a deep hub alias, one pair per mode | `ADV/lib/scorer/lanes/explicit.ts` (`PHRASE_BOOSTS`: "find out everything" → system-deep-loop; "many passes"/"findings stop changing" → system-deep-loop + sk-code penalty; "several models"/"final verdict" → system-deep-loop) and `.skilled/skills/system-deep-loop/hub-router.json` (same phrases into research/review/ai-council aliases) plus snapshot | 3 chat rows (deep-research, deep-review, deep-ai-council); the depth gate already passes ("everything you can", "many passes", "several models") | Capture top-1 becomes system-deep-loop on the 3 rows; compiled-route returns the right mode; `nm-system-deep-loop-01` stays silent (no depth wording); typed 24/44 and eval `[159,50,20]` re-pinned | **Medium.** Both layers are required; the sk-code penalty and the phrase boosts can reorder other rows, so the calibration override is the dry run. |
| 4 | Add one narrow explicit anchor per wrong-top create row | `ADV/lib/scorer/lanes/explicit.ts` (`/create:command`: "prompt shortcut"; `/create:goal`: "intent file"; `/create:manual-testing-playbook`: "test script package") and the matching calibration conditions in `fusion.ts` | 3 chat rows (create-command, create-goal, create-manual-testing-playbook) | Capture top-1 is the command row on the 3 rows; none rows silent; typed 24/44 unchanged; eval re-pinned | **Medium.** Pure scoring change; the phase 003 collision precedent says every key must be multi-word and grepped against the none set. |
| 5 | Enrich command intent signals and re-embed the skill graph | `ADV/scripts/` skill-graph rebuild path and per-command metadata; one real-embedding capture | Generalizes past literal phrasing; no measured chat-row gain today | `capture-command-routing-baseline.mjs --real-embedding` reports plain tune above 14 of 45 with false offers 0/35 | **Medium-high.** Needs an embedder run and a vector rebuild; unmeasurable in this lineage. |

Measurement note (not a ranked item): the capture's `offered` flag means "a command is in the top-3", not "the brief offered it". Relabel or document it so later research does not repeat the 6-versus-5 error.

## 10. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration |
|---|---|---|---|
| Lower `COMMAND_MEANING_MIN_COSINE` | Four of five wrong-top rows have no command evidence at all; the meaning gains are outside the chat set | real-embedding-after.json; baseline top-3 flags | 2 |
| Raise the semantic lane weight | Already live at 0.05; reorders rows without adding evidence | semantic-shadow.ts:376 | 2 |
| Re-add "persona file" | Measured wrong offer on a marketing persona prompt; tune 10→9 | 003 implementation summary:140 | 2 |
| A default command for a hub that defers | Fires on the deep-loop near-miss, which must stay silent | command-prompts.jsonl (nm-system-deep-loop-01) | 3 |
| A new doctor mode in the deep hub | The command row and matcher entry already exist | _routes.yaml:87; doctor-helper-match | 3 |
| Rank a top-3 command into the brief | Phase 005 froze the head to one top label plus a doctor companion | render.ts:520 | 1 |
| Threshold tuning as a substitute for evidence | No threshold reaches a row outside top-3 | baseline top-3 flags | 2 |

## Divergence Map

No divergent pivots were taken. Saturated directions: threshold lowering, semantic weight, generic alias widening, defer-time default commands, brief head restructuring. Remaining frontier: the measured row gains of the four build items, any unseen paraphrase reaching a none row, and the metadata re-embed.

## 12. Open Questions

1. Do the four items move their named rows in a real capture, and does any unseen paraphrase reach a none row? (Owner: the implementing phase; verify with the stand-in capture and the real-embedding capture.)
2. Does an offer move mutating starts on Claude and Codex? (Carried from segment one; owner: the behaviour arm, not this lane.)
3. What does a cold first prompt cost end to end? (Carried; cross-cli-2/ux-cost-2.)
4. Does OpenCode collapse a folder that holds `skill.md`? (Carried; cross-cli-2.)
5. How does a failed host invocation show up? (Carried; cross-cli-2.)
6. Is the Devin brief delivered? (Carried; cross-cli-2.)
7. Should the embed model stay warm? (Operator decision; ux-cost-2.)

## 13. References

- After arm: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`
- Captures: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json`; `008-embedder-setup-and-cost/scratch/real-embedding-after.json`
- Corpus: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (tune and none rows only)
- Hub data: `.skilled/skills/sk-doc/hub-router.json`; `.skilled/skills/system-deep-loop/hub-router.json`; `.skilled/bin/compiled-route.cjs`
- Scorer: `ADV/lib/scorer/lanes/explicit.ts`, `fusion.ts`, `scoring-constants.ts`, `lanes/semantic-shadow.ts`, `lib/command-attach.ts`, `lib/render.ts`; `ADV` is `.skilled/skills/system-skill-advisor/runtime`
- Doctor: `.skilled/commands/doctor/scripts/doctor-helper-match.cjs`; `ADV/lib/scorer/doctor-helper-handoff.ts`; `.skilled/commands/doctor/_routes.yaml`
- Canary: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json`
- Built-phase record: `005`/`006`/`008`/`010` `implementation-summary.md`; `011-typed-command-delivery-and-guards/spec.md` and `tasks.md`; `003-plain-chat-command-reach/implementation-summary.md`
- This lineage: `resource-map.md`; `iterations/iteration-001.md` … `iteration-004.md`; `deltas/iter-001.jsonl` … `iter-004.jsonl`

## 14. Answered Questions

- Which rows miss because a hub defers or routes to a command-less mode, and the smallest rule: answered (iteration 1; mechanism rule in section 4).
- Placement versus evidence absence: answered (iteration 2; four of five are evidence absence).
- Semantic lane contribution: answered (iteration 2; five tune rows, none in the chat set).
- Doctor-family strings that can score a read: answered (iteration 3; three matches measured).
- Threshold/constant risk to the floors: answered (iteration 4; false offers protected by phrase absence, typed and scorer need a re-pin).

## 15. Limitations and Confidence

- The advisor dist was stale, so no capture could be rerun and no row gain is measured. Expected gains are inferred from route results, matcher scores and code paths; each is labelled.
- The capture's `offered` flag is top-3 based and overstates delivered offers by one row on this set; the run log's `offeredCommand` is the delivered truth.
- The 16-row chat set is small; a 3-row gain is 18.75 percentage points but only six runtime observations per row.
- Matcher scores and hub route results are deterministic and were run here; the four-item gain table is not.
- This synthesis writes only inside the lineage; the workflow's `spec.md` write-back, its post-synthesis validation and the terminal telemetry row are outside this lineage's write authority and were not run.

## 16. Implementation Decision

Recommended next phase: items 1 and 2 together as one "plain offer reach" phase (doctor specific-command handoff plus `sk-doc` paraphrase aliases), because both are small, both have a committed verification surface (matcher scores, 22-case canary), and together they move 7 of the 11 missing chat rows with no scorer-weight change. Item 3 follows as its own phase because it is the only change that requires both a scorer anchor and a hub alias and carries the heaviest floor exposure. Item 4 follows once item 3's capture shows the scorer's headroom. Item 5 waits for a phase that can run the embedder and owns the next real-embedding capture.

## 17. Convergence Report

- Stop reason: `maxIterationsReached` (4 of 4; ratios 0.90, 0.85, 0.88, 0.70, none below the 0.05 threshold)
- Total iterations: 4
- Questions answered: 5 / 5 lane key questions
- Remaining questions: 2 lane questions, both measurement questions for the implementing phase; 5 segment-one questions carried to other lanes
- Last 3 iteration summaries: run 2: placement versus evidence (0.85); run 3: doctor and deep routes (0.88); run 4: verification and ranking (0.70)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

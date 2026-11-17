# Command Surfacing After Phases 011, 012 and 013 — Segment Three, offer-reach lane

Lineage `offer-reach-3`, six iterations, 2026-11-13. Measured at `HEAD` `320e7b64d4` with a fresh advisor build and the operator's real skill graph and Ollama embedder (`nomic-embed-text:v1.5`, already running).

## 1. Executive Summary

After phases 011, 012 and 013, 28 of the 45 plain tune rows render a slash command in the brief: 27 on the head line and 1 through the doctor `Also:` line. 17 render none. Every command that is rendered belongs to the expected command's family — 22 exact labels and 6 documented subcommands — so the remaining plain defect is recall, not precision.

The 17 missing rows have six distinct causes, none of which is the semantic lane: duplicate suppression (1), a hub that routes to a mode with no command (2), a hub that defers and prints `(needs a mode)` (4), a deferring or routing hub outside the mode table that stays silent (2), no recommendation at all (6), and a wrong top skill (2). Four candidate changes cover 13 of the 17; the other 4 are an intentional ask.

The two lane questions are answered. Intent-signal enrichment and re-embedding (segment-two rank 15) stays declined: the real embedder already runs in the measured regime, it moves five rows that already carried a command, it adds zero commands to the 17, and keeping the 60 vectors in step is already incremental and cheap (about 83 ms to re-embed all 14 skill vectors warm). The carried fallback question is answered too: the degraded path runs the Python scorer and then deliberately collapses untyped rows, so it loses the command, the policy, the mode label and the doctor hand-off; no recorded run hit it, and the smallest fix is to score in process with the same TypeScript path the daemon uses.

## 2. Scope, Evidence Lanes, Terminology

- **Lane:** `offer-reach-3` owns carried questions (a) and (b); it also answered (g), which no lane owned.
- **Plain tune row:** one of 45 `row_type: plain`, `split: tune` rows in `command-prompts.jsonl`. Holdout prompt text was never read; holdout appears only as counts.
- **Rendered command:** what the brief line the model reads can carry. The renderer prints one head plus an optional doctor `Also:` line, so a command at rank 2 is not rendered.
- **Reach vs precision:** reach is a rendered command of the expected family; precision is that no wrong command is rendered.
- **Real regime:** the operator's skill-graph database and live embedder. **Fixture regime:** the committed capture's deterministic vectors. The two produce different totals at one commit.

## 3. Measured State

| Measure | Value | Source |
|---|---|---|
| Plain tune rows | 45 | `command-prompts.jsonl` |
| Rendered command (head) | 27 | `prompts/tune-live.jsonl` |
| Rendered command (`Also:` only) | 1 (`cmd-doctor-deep-loop`) | same |
| No command rendered | 17 | same |
| Exact corpus label | 22 | same |
| Documented subcommand | 6 | same |
| Committed fixture capture, tune combined | 23 of 45 (8 own, 15 attached) | `command-routing-baseline.json` |
| Real-embedding capture, tune combined | 28 of 45 (13 own, 15 attached) | `prompts/real-embed-capture.json` |
| Real-embedding capture, holdout | 3 of 44 | same |
| Typed delivery | 44 of 44 (24 own, 20 attached) | same |
| False offers | 0 of 35 | same |
| Silent floor rows with a command | 0 of 35 | `prompts/none-floor-live.jsonl` |
| Scorer eval | `[160,50,21,5]` | phase 012 summary |

## 4. Offer Path Inventory

1. **Typed command** — `typedCommandForTop` attaches the typed command to the owner's row; 44 of 44 reached.
2. **Command row on top** — a bridge row such as `command-doctor-env` carries its command and policy.
3. **Hub compiled route** — `enrichCompiledRoutes` asks the hub for its route and attaches `MODE_COMMANDS[hub][workflowMode]` when the route names one mode that has a command.
4. **Doctor hand-off** — the hand-off names a `run` command when the ranker found one, else the helper.
5. **`Also:` line** — a doctor bridge below the head is rendered as a companion line.
6. **Degraded fallback** — the CLI spawns `skill_advisor.py` and collapses untyped rows to owner skills.

## 5. Findings — Why 17 Plain Tune Rows Render No Command

| Cause | Rows | Why |
|---|---|---|
| Duplicate suppression | `cmd-create-agent-plain-tune-01` | Routes `sk-create-agent` correctly, but the `create:agent` row already ranks second with `/create:agent`; `enrichCompiledRoutes` withholds a duplicate and the single-head render drops rank 2 |
| Routed mode with no command | `cmd-create-readme-plain-tune-01`, `cmd-create-with-human-voice-plain-tune-01` | Both route `sk-doc` to `sk-create-quality-control`, which is absent from `MODE_COMMANDS`; one mode cannot name two commands, so the alias must change |
| Needs-mode label | `cmd-create-repo-rule-plain-tune-01`, `cmd-doctor-sk-skill-plain-tune-01`, `cmd-speckit-complete-plain-tune-01`, `cmd-speckit-save-plain-tune-01` | `sk-doc` defers and prints `(needs a mode)`; deliberate phase 012 behaviour, an ask not a defect |
| Silent hub outside the mode table | `cmd-speckit-implement-plain-tune-01`, `cmd-doctor-sk-code-plain-tune-01` | `sk-code` defers or routes, but `routeNeedsMode` requires a `MODE_COMMANDS` row and `sk-code` has none |
| No recommendation | `cmd-create-skill-parent`, `cmd-doctor-install`, `cmd-doctor-setup`, `cmd-doctor-speckit`, `cmd-doctor-update`, `cmd-speckit-search` | The scorer returns zero rows: five commands have a scorer row and scored below threshold, `create:skill-parent` has no scorer row |
| Wrong top | `cmd-doctor-mcp-plain-tune-01`, `cmd-doctor-skill-advisor-plain-tune-01` | `mcp-code-mode` and `system-skill-advisor` outrank the doctor command rows; the latter has seven subcommands and no default |

## 6. Findings — Floor and Canary Exposure

- The 35 counted silent rows carry 0 commands at HEAD; 15 return nothing and 20 return a skill-only head.
- The doctor-family risk set is exactly three rows: `mns-chat-03` (0.090611), `nm-system-skilled-doctor-01` (0.240312), `sv-03` (0.125331). They pass the render gate on confidence 0.82 and uncertainty 0.22 to 0.34, so the floor is held by the ranking band, not a wide score margin.
- The proposed sk-doc keywords reach 0 of 35 floor rows and 0 of the other 52 `none` rows. The readme phrase appears only on its own tune row; the human-voice phrases appear only on theirs. A bare `rewrite` keyword would steal `cmd-create-diff-plain-tune-01`, which already carries `/create:diff`, so it must not be added.

## 7. Findings — The Semantic Lane, Re-embedding and Cost

- The real embedder moves five tune rows from `top1: false` to `true` (`cmd-doctor-env`, `cmd-doctor-git`, `cmd-doctor-symlink`, `cmd-speckit-handoff`, `cmd-speckit-plan`) with no loss; all five already carried a command. Brief-level gain: zero commands, five better top-1 picks.
- The real lane embeds only the `SKILL.md` frontmatter description; the fixture lane composes name, description, domains, intent signals and derived triggers. The asymmetry is why intent signals never reach the real cosine lane.
- The corpus is 60 vectors: 14 skill + 46 command, 768 dimensions, 561 KB SQLite. Refresh skips rows whose `vec_content_hash` and `vec_model_id` are unchanged, so metadata drift costs one embed per edited skill: warm median 5.95 ms, p95 8.97 ms, about 83 ms for all 14 skills and 357 ms for all 60.
- Drift detection exists: per-row content hash plus `readAdvisorEmbeddingStaleness` comparing the active pointer's model and dimension against the stored vectors.

## 8. Findings — The Degraded Fallback Path

- On an unreachable daemon the CLI's `runLocalScorer` spawns `skill_advisor.py` with the CLI's own 0.8/0.35 thresholds, then `degradedRecommendations` collapses every row whose bare command is not typed into its owner skill. Command, policy and `needsMode` are dropped by construction.
- Measured at HEAD on the plain readme prompt: live `sk-doc → /create:readme (start)`; unreachable endpoint `system-spec-kit`, no command, 644 ms.
- Runtimes: every runtime whose hook runs the CLI fallback (Claude, Pi, Devin, DSH). Codex never reaches it because its hooks are unapproved, so it gets no brief at all. OpenCode delivery is `unknown`, so its degraded behaviour is unmeasured.
- Frequency in the recorded arms: zero. Cold start no longer triggers it (`--no-warm-only` lets the CLI start the daemon); the remaining triggers are a crashed or unreachable daemon and a socket path over Darwin's `sun_path` limit.
- No persistent counter exists: only `hookHealth.rollingFailOpenRate`, written only under `SKILL_ADVISOR_DEBUG=1`.

## 9. Ranked Recommendations

Ranked by expected gain in started-when-useful per unit of risk to the floors stated by phase 012: typed recall 24 of 44, false offers 0 of 35, scorer `[160,50,21,5]`.

### R1. Make the two quality-control misroutes reach their own commands

- **File:** `.skilled/skills/sk-doc/hub-router.json` — add `overview page` and `folder overview` to `create-readme-aliases`, and `reads like a person` and `score how human` to `create-with-human-voice-aliases`; then regenerate the runtime mirrors with `sync-runtime-mirrors.cjs`.
- **Gain:** 2 rows, `cmd-create-readme-plain-tune-01` and `cmd-create-with-human-voice-plain-tune-01`, from no command to `/create:readme (start)` and `/create:with-human-voice (start)`; plain tune rendered commands 28 to 30.
- **Verify:** `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "<each prompt>"` shows `sk-create-readme` and `sk-create-with-human-voice`; `node .../capture-command-routing-baseline.mjs --real-embedding` prints tune combined 30 and false offers 0 of 35; `npx vitest run` green.
- **Floor risk:** none measured. 0 of 35 floor rows and 0 of the other 52 `none` rows can match the new keywords. Do not add a bare `rewrite` keyword; it would steal `cmd-create-diff-plain-tune-01`.

### R2. Give the five below-threshold commands scoring evidence, and `create:skill-parent` a scorer row

- **Files:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` for the plain anchors; the owning `.skilled/skills/*/command-metadata.json` for intent signals; the bridge deriver for `create:skill-parent`.
- **Gain:** up to 6 rows from no recommendation to a head command; plain rendered commands 30 to at most 36.
- **Verify:** `capture-command-routing-baseline.mjs --real-embedding` prints the tune own count and `false_offer`; the three named floor rows `mns-chat-03`, `nm-system-skilled-doctor-01` and `sv-03` stay command-free; `npx vitest run` green.
- **Floor risk:** medium. An anchor must pass the 0.8 confidence gate on the five rows while staying under three doctor-top floor rows scoring 0.09 to 0.24; five of the six commands mutate.

### R3. Stop a hub outside the mode table from staying silent

- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (`routeNeedsMode`), and `lib/render.ts` only if the label text differs.
- **Gain:** `cmd-speckit-implement-plain-tune-01` and `cmd-doctor-sk-code-plain-tune-01` get an actionable label instead of a bare skill name; no new command is offered.
- **Verify:** a unit test on `routeNeedsMode` for a hub that defers or routes with commands but no mode table, plus two live heads.
- **Floor risk:** low. Label only; no score and no command change.

### R4. Make the degraded answer the live answer with freshness `stale`

- **File:** `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` (`runLocalScorer`).
- **Gain:** on a degraded run the brief carries 28 rendered commands out of 45 instead of 0 on untyped rows, and keeps `policy`, `needsMode` and the doctor hand-off; it also replaces a measured 644 ms Python spawn.
- **Verify:** a new vitest that forces an unreachable endpoint and compares the envelope with the daemon fixtures for the three live-head prompts; one sandboxed-endpoint capture of the tune rows.
- **Floor risk:** medium. It is a second scoring path, so it must import the same scorer and enrichment rather than re-implement them; the daemon path and its floors are untouched.

### R5. Do not withhold a hub command that already ranks below the head

- **File:** `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` (`alreadyOffered`).
- **Gain:** `cmd-create-agent-plain-tune-01` gains `/create:agent (start)` on the head.
- **Verify:** the real capture moves 30 to 31 after R1; a unit test that the hub command lands on the top.
- **Floor risk:** low gain. Attach to the top; do not render a second head, which would cost bytes on every prompt.

### R6. Resolve the doctor wrong-top pair

- **Files:** the doctor family's `command-metadata.json` intent signals and `explicit.ts`.
- **Gain:** `cmd-doctor-mcp-plain-tune-01` and `cmd-doctor-skill-advisor-plain-tune-01` reach a doctor command.
- **Verify:** the real capture and the doctor slice; a policy decision recorded for the seven-subcommand family.
- **Floor risk:** medium-high. A default subcommand can run a mutating command the reader did not choose, so this item needs an explicit policy call before it is built.

## 10. Eliminated Alternatives

- **Intent-signal enrichment and re-embedding (segment-two rank 15).** Declined again. Measured brief-level gain: zero commands; the five moved rows already carried a command. Floor risk is global rerank for no reach.
- **Relabel the capture's `offered` flag.** Already built in phase 013. The remaining need is that readers use the field for what it measures, which this document records.
- **Lower the meaning threshold or raise the semantic lane weight.** Eliminated in segment two, and the 17 rows are not threshold-shaped: 6 return nothing and 11 are blocked by routing, labels or a wrong top.
- **A default command for a hub that defers.** Eliminated in segment two: it fires the deep-loop near-miss row.
- **A second rendered head for the duplicate-suppression row.** It costs brief bytes on every prompt.
- **Adding a bare `rewrite` keyword to the human-voice class.** It would steal a working `/create:diff` row.
- **Adding intent text to the 14 `SKILL.md` descriptions.** That is an operator-facing document change, not a routing fix.

## Divergence Map

- Saturated directions: none; no direction was tried from multiple angles without success.
- Pivots taken: none. This lineage investigated one lane and three carried questions.
- Pivot failures: none. Audited overrides: none.
- Remaining frontier: the fallback frequency counter, OpenCode degraded behaviour, and the subcommand-label policy.

## 12. Open Questions

1. How often does the local-scorer fallback answer in real use? Owner: a build phase that adds a persistent counter; today only debug mode records it.
2. Does OpenCode degrade at all? Owner: an OpenCode arm with a delivery marker.
3. Should the corpus name a documented subcommand instead of the base command for the 6 doctor rows? Owner: the operator.
4. Can R2's anchors pass the confidence gate while staying under the three doctor-top floor rows? Owner: the implementing phase's capture.

## 13. References

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts`
- `.skilled/skills/sk-doc/hub-router.json`
- `research/lineages/offer-reach-3/prompts/tune-live.jsonl`, `real-embed-capture.json`, `none-floor-live.jsonl`, `embedder-cost.json`, `degraded-readme.json`
- `P/011-typed-command-delivery-and-guards/implementation-summary.md`, `P/012-plain-offer-reach/implementation-summary.md`, `P/013-attribution-and-install-reach/implementation-summary.md`
- `research/research-segment-2.md` sections 3 and 4

## 14. Answered Questions

1. **Which plain tune rows still get no command after phase 012, and why, by row id?** 17 rows, six causes, each named in section 5.
2. **Would intent-signal enrichment and re-embedding move the remaining rows, and at what risk to the floors?** It moves 0 of the 17; the real embedder moves five rows that already carried a command. Floor risk is a global rerank with no reach gain.
3. **What does keeping the vectors in step cost, and how is drift detected?** 60 vectors, 561 KB, about 83 ms to re-embed all 14 skills warm; refresh is hash-gated and `readAdvisorEmbeddingStaleness` reports drift.
4. **Which runtimes hit the degraded fallback, and how often?** Every hook runtime except Codex, which has no brief at all; zero recorded occurrences, no persistent counter.
5. **What is the smallest change that makes the fallback carry the live command?** Score in process with the TypeScript fusion and the same compiled-route enrichment instead of spawning the Python scorer.

## 15. Limitations and Confidence

- Every measurement ran in the real regime on this machine with the model resident; `coldReason: "model already loaded"` means the cold path was not re-measured.
- The recommendations are projections except R1's canary count, which is measured. Each names the command that measures it.
- Holdout prompt text was never read; holdout appears only as counts (1 to 3 of 44).
- The 23-to-28 difference between the committed capture and the real capture is a regime difference at one commit, not a change in code.
- Confidence: high on the 17-row inventory and the six causes (direct per-row measurement and code reads); medium on R2's expected gain (anchor wording not written); low on the fallback frequency (no counter).
- Synthesis boundaries: the `spec.md` findings writeback, the strict spec validation and the continuity save were not run, because this detached lineage may write only inside its own folder. The parent run owns those steps after the lineage merge.

## 16. Implementation Decision

Build R1 first: it is two alias phrases, two rows, and zero measured floor exposure. Then R2 with the three named floor rows in its check, because it is the only candidate that can move more than two rows. R3 and R5 are cheap label and head fixes that ride along with either. R4 should follow, because it removes a silently different answer on every hook runtime whenever the daemon is down. R6 needs an explicit policy call on a default doctor subcommand before it is scheduled. Nothing here re-decides a segment-one or segment-two item.

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 6
- Questions answered: 5 / 5
- Remaining questions: 4 (section 12)
- Last 3 iteration summaries: run 4 focused on the validated candidate set (0.45); run 5 on floor risk of the two leading candidates (0.55); run 6 on the measurement model and closure (0.20)
- Convergence threshold: 0.05
- Novelty per iteration: 0.85, 0.80, 0.75, 0.45, 0.55, 0.20
- Divergence summary: no divergent pivots recorded

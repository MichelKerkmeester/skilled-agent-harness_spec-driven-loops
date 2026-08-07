# Iteration 34: S5-01 Deep Research Dashboard Trend and In-Progress UX

## Focus

[S5-01] Should the dashboard adopt kasper's sparkline trend (`renderSparkline`) and in-progress banner (`summarizeValidationInProgress`) so newInfoRatio/score history plus "iteration N running for Ts" render in-terminal?

## Actions Taken

- Checked recent iterations 31-33 and the findings registry search surface for prior S5-01 coverage; this exact dashboard trend and in-progress banner focus was not covered.
- Mined kasper's trend helper, status rendering, in-progress summarizer, and tests.
- Mapped the portable pieces onto our reducer-owned dashboard renderer, dashboard template, auto/confirm workflows, presentation contract, and reducer tests.
- Checked the current generated dashboard for this packet to verify current behavior: it has a table and last-three ratio text, but no sparkline, no active-running banner, and no terminal inline status beyond static summary text.

## Findings

1. Rank 1 - Add a reducer-level sparkline for newInfoRatio and convergence score history.

   Reference mechanism: kasper's `renderSparkline(scores)` normalizes a numeric history against min/max and maps values into terminal trend glyphs (`external/kasper/src/utils.ts:172-184`). Kasper status then reverses the recent sessions, maps scores, and renders a compact `Score Trend` line with the glyph string and percentages (`external/kasper/src/handlers.ts:262-270`).

   Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`. `renderDashboard()` already computes `ratios` and `lastThreeRatios` (`reduce-state.cjs:822-839`) and renders the trend block (`reduce-state.cjs:906-914`). Add a pure `renderSparkline(values, options)` helper there, then include `newInfoRatioTrend` and, when available, `convergenceScoreTrend` in `## 5. TREND`. Mirror the expected fields in `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_dashboard.md:69-74`.

   Why it helps: the dashboard currently makes operators parse a table or a three-number chain. A compact trend line makes "novelty decaying", "recovery spike", or "flatlining" visible at a glance in markdown and terminal previews.

   Port-difficulty: easy. Tag: quick-win.

2. Rank 2 - Add canonical iteration-start lifecycle events so the dashboard can render "iteration N running for Ts".

   Reference mechanism: `summarizeValidationInProgress(ctx)` reads `evaluationRunning`, `evaluationStartedAt`, queued idle sessions, pause state, merge state, and pending improvements to build status lines (`external/kasper/src/handlers.ts:36-74`). Its elapsed formatter emits seconds or minutes-plus-seconds (`external/kasper/src/handlers.ts:76-80`), and tests pin the running, idle, paused, and elapsed-time cases (`external/kasper/tests/handlers.test.ts:638-686`).

   Exact OUR target files: `.opencode/commands/deep/assets/deep_research_auto.yaml` and `.opencode/commands/deep/assets/deep_research_confirm.yaml`. Both dispatch sections jump from prompt rendering into `wait_for_completion` executor dispatch without writing a universal start event first (`deep_research_auto.yaml:582-629`, `deep_research_confirm.yaml:587-643`). `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` only writes `iteration_start` for non-native executors (`executor-audit.ts:577-619`), so native runs have no equivalent start marker. Add a canonical event before dispatch for all executors, then let the existing iteration record or a terminal event close it.

   Why it helps: a static dashboard generated after dispatch cannot know that an iteration is in flight. A typed start event gives the reducer and any terminal presenter enough state to render "Iteration 34 running for 42s" and to distinguish active work from a stale last-completed iteration.

   Port-difficulty: med. Tag: deep-rewrite.

3. Rank 3 - Surface the same trend and in-progress summary in terminal gates, not only in the markdown file.

   Reference mechanism: kasper inserts in-progress lines into the full status output immediately after the header (`external/kasper/src/handlers.ts:100-111`) and into the terse `/kasper` command response before the auto-update/help footer (`external/kasper/src/handlers.ts:991-1008`). This keeps the status visible without asking the operator to open a file.

   Exact OUR target files: `.opencode/commands/deep/assets/deep_research_confirm.yaml` and `.opencode/commands/deep/assets/deep_research_presentation.txt`. Confirm mode's pre-iteration gate currently shows focus, remaining questions, last ratio, and stuck count (`deep_research_confirm.yaml:565-580`); the post-iteration gate shows findings, newInfoRatio, status, remaining questions, stuck count, and recent summaries (`deep_research_confirm.yaml:779-795`). The presentation contract's success output only reports completion artifacts (`deep_research_presentation.txt:255-265`), despite the overview promising dashboard generation as part of the loop (`deep_research_presentation.txt:227-233`).

   Why it helps: confirm-mode users make continue/adjust/stop decisions in terminal. Showing the sparkline and active-running banner at the gate makes the markdown dashboard an audit artifact, while the terminal becomes the working cockpit.

   Port-difficulty: easy. Tag: quick-win.

4. Rank 4 - Add reducer regression coverage for sparkline and in-progress states.

   Reference mechanism: kasper tests the summarizer's empty state, paused state, running-with-idle-count state, singular/plural idle text, elapsed minute formatting, idle-waiting state, merge banner, and pending-improvement count (`external/kasper/tests/handlers.test.ts:638-735`).

   Exact OUR target file: `.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`. The fixture already creates a running deep-research packet and JSONL iteration records (`deep-research-reducer.vitest.ts:55-85`), then asserts dashboard idempotency and key dashboard fields (`deep-research-reducer.vitest.ts:241-290`). Extend that fixture with ratio history, an `iteration_started` event without a matching terminal iteration, and assertions for sparkline text plus the "running for" banner.

   Why it helps: the dashboard is reducer-owned and overwritten each pass. Without reducer tests, a future template or parser change can silently remove the new terminal-visible status and still leave the basic dashboard file present.

   Port-difficulty: easy. Tag: quick-win.

## Questions Answered

- S5-01: Yes, but split the port. The sparkline is a low-risk reducer/dashboard quick win. The "iteration N running for Ts" banner needs a first-class lifecycle event before dispatch; otherwise any dashboard value is stale or inferred.
- Kasper's reference implementation uses terminal trend glyphs rather than strict ASCII. Our implementation should decide whether to preserve block glyphs or offer an ASCII fallback for environments that cannot render them cleanly.

## Questions Remaining

- Should the canonical running event be named `iteration_started`, or should the existing non-native-only `iteration_start` sentinel be generalized and normalized by the reducer?
- Should live elapsed time be recomputed only when `reduce-state.cjs` runs, or should `/deep:research` gain a lightweight status command/view that renders directly from JSONL without rewriting the dashboard?
- How many history points should the sparkline show by default: full session, last 12, or a configurable cap?

## Next Focus

[S5-03] Could approval gates adopt loop-cli's confirm-gated action pattern with optimistic refresh and one-key Continue/Adjust/Stop, using the new dashboard delta as the visible decision surface?

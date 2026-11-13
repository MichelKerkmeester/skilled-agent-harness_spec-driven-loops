---
title: "Command Surfacing After Phases 005-008 — UX, Performance and Cross-CLI Research Synthesis"
trigger_phrases: []
---
# Command Surfacing After Phases 005-008 — UX, Performance and Cross-CLI Research Synthesis

Merged synthesis of a three-lineage fan-out (`ux`, `performance`, `cross-cli`), 13 iterations in total, executor `cli-opencode` with `opencode-go/deepseek-v4.1-flash#max`. Each lineage's own synthesis stays in `lineages/<label>/research.md`; this file merges, deduplicates and ranks them. Claims the orchestrator re-checked against source are marked `[CHECKED]`.

## 1. Executive Summary

Phases 005-008 build the right thing: the brief is the only surface that can offer a command, and those phases put the command, its policy and its runtime pointer into it. What they leave open is **reachability, attribution and first-run behaviour**, not brief wording or steady-state cost.

1. **Two runtimes cannot receive the brief on a normal install.** Codex runs a project hook only after per-entry approval (`trusted_hash` in `~/.codex/config.toml`), documented in `.codex/README.md` but never in `INSTALL-SKILLED.md`; Codex's 0 of 12 in the before arm had no brief behind it (0 of 6 raw transcripts contain `Advisor:`). DSH's prompt advisor runs only when `promptAdvisor === true`, and `INSTALL-SKILLED.md` never mentions DSH. `[CHECKED]` [SOURCE: .codex/README.md:54] [SOURCE: .dsh/plugins/repo-guards/index.mjs:53] [SOURCE: INSTALL-SKILLED.md:75]
2. **The before/after start rate cannot be attributed.** No artifact records that a command was offered, so "declined" and "never offered" are one number; capped runs sit in the denominator; a `COMMAND:` line appears with the advisor off; and argued routes such as `/doctor:git hooks` can never score a document read. Without an `offered` field the 007 delta is not evidence.
3. **The first prompt after install is the fragile one.** The embedder cascade probe defaults to 2,500 ms and the CLI waits up to 5,000 ms for a cold daemon, while the Claude shim kills its child at 2,500 ms inside a 3 s host timeout; a cold start between those bounds fails open and the person sees no brief. `/doctor:setup` reports SKIP for the advisor leg exactly when the daemon is cold. `[CHECKED]` [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts:116] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:34] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:20] [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:57]
4. **Steady-state cost is not the constraint.** Hook median 196-205 ms against a 2.5 s budget, a 60-75-token brief, warm embedding 6.57 ms. The token cost that matters is the started command's document (median about 1,131 tokens, p95 about 3,143), not the brief.

## 2. Scope, Evidence Lanes, and Terminology

- **Scope:** improvements after the planned phases 005-008 of `008-command-surfacing-build`; anything those phases already plan is excluded (see §11 cross-check).
- **Lanes:** `ux` (brief content, offer/ask/start, discovery, external install), `performance` (hook time, embedder, cold start, token cost), `cross-cli` (per-runtime start behaviour on claude, codex, opencode, pi, devin, dsh).
- **Terms:** *offered* = the brief named the command; *started* = the scorer's ADR-002 definition (document read, skill load, or `COMMAND: … started`); *capped* = run ended by the harness time cap (exit 143 or null).
- **Rules held:** no holdout corpus rows read, no pi run, no ollama control, no process kill, no full vitest suite, read-only git.

## 3. Before-Arm Baseline (rescored at synthesis, 2026-11-12T23:18Z)

The arm was still growing during the run, so each lineage saw a different snapshot (OpenCode was 3/7, 4/9, 5/10 and 5/12 at different moments). This is the single snapshot used here, from `score-command-transcripts.mjs --summary` (exit 0):

| Runtime | Rows scored | Start | `COMMAND:` lines | Capped | Unsafe |
|---|---|---|---|---|---|
| claude | 24 | 3 of 12 | 0 | 0 | 0 |
| codex | 24 | 0 of 12 | 0 | 0 | 0 |
| pi | 24 | 0 of 12 | 0 | 2 | 3 |
| devin | 24 | 3 of 12 | 0 | 6 | 3 |
| opencode | 24 | 5 of 12 | 0 | 7 | 2 |
| dsh | 18 | 5 of 12 | 1 | 0 | 0 |

Because phase 005 is unbuilt, no row was offered a command; every start above is a spontaneous document read. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl]

## 4. Six-Runtime Delivery Inventory

| Runtime | Delivery path | Processes per prompt | Brief delivered? | Command surface |
|---|---|---|---|---|
| claude | spec-kit shim → advisor hook → CLI | 3 | yes (6/6 raw transcripts) | folder tree; 32 of 44 visible (G5) |
| codex | adapter → advisor hook → CLI | 3 | **no** in the arena (hooks unapproved) | flat prompts (`create-readme`) |
| devin | adapter → advisor hook → CLI | 3 | wired; not observable in records | none (skills only) |
| pi | in-process extension → CLI | 2 | yes, in-prompt (6/6) | flat prompts |
| opencode | in-process plugin → CLI | 2 | wired; 1 of 6 sessions shows it | folder tree; same `skill.md` risk, untested |
| dsh | in-process plugin → CLI, behind `promptAdvisor` | 2 | **off by default** | flat prompts |

[SOURCE: lineages/cross-cli/research.md §4.4] [SOURCE: lineages/performance/research.md §7]

## 5. Findings — Reachability (cross-cli lane)

1. Codex hook approval is a product step that the install path omits. `[CHECKED]` [SOURCE: .codex/README.md:54] [SOURCE: INSTALL-SKILLED.md:75]
2. DSH is off by default and absent from the install guide (`grep -ci dsh INSTALL-SKILLED.md` = 0). `[CHECKED]` [SOURCE: .dsh/plugins/repo-guards/index.mjs:53]
3. A target repo that already has `.claude/settings.json` (or a codex/cursor/devin hook file) keeps it through the doctor merge and never receives the `UserPromptSubmit` entry; no setup leg checks it. [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:821]
4. Host command names differ from canonical: `/create:readme` on Claude and OpenCode, `create-readme` on Codex, Pi, DSH and Cursor, no command surface on Devin. The brief carries only the canonical form. [SOURCE: .codex/prompts/create-readme.md:2] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:202]
5. G5: `.skilled/commands/create/skill.md` is the only lowercase `skill.md` command file; its Claude mirror hides 12 sibling `create:*` commands (Claude exposes 32 of 44). The G5 listing used a stand-in folder, and OpenCode's behaviour on the same mirror is untested. `[CHECKED: file present]` [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt]
6. `AdvisorBriefRenderOptions` already carries `runtime`, so a per-runtime head is a change inside `renderAdvisorBrief`, not a new data flow. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:48]
7. Pi is the only runtime whose brief is observable inside the prompt, which makes it the clean A/B bed for head changes.

## 6. Findings — Measurement Integrity (ux and cross-cli lanes)

1. The closed diagnostic record holds `skillLabel`, `emittedBytes`, `directivesSuppressed` and no command or policy, so an offer cannot be told apart from a decline. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:50]
2. Capped runs stay in `startRows`: OpenCode 5 of 12 is at best 5 of 5 uncapped, Devin 3 of 12 at best 3 of 6. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1082]
3. The aggregate rate hides a policy split that inverts by runtime: Claude starts 3 of 4 read-only `run` rows and 0 of 8 mutating `start` rows; OpenCode and DSH start 3 of 8 mutating rows.
4. Start rate measures the path, not the outcome: Devin produced `/create:agent` artifacts while scoring `started: false`.
5. `commandParts('/doctor:git hooks')` looks up `doctor/git hooks.md`; 28 of 35 doctor strings carry an argument and can never score a document read. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:449]
6. DSH emitted a `COMMAND:` line with its advisor disabled, so the token alone does not prove an offer.
7. Policy reaches only the command: on `ask` rows with no offer, Devin created a council scratch folder and Pi wrote a fixture without asking. [SOURCE: AGENTS.md:63]

## 7. Findings — Performance and Cost (performance lane)

| Item | Measured | Source |
|---|---|---|
| Claude hook median / p95 | 205.09 / 261.92 ms (44 prompts); ux probe 196.2 / 352.4 ms (40) | `004-command-meaning-matching/scratch/hook-latency-after-3.json`; ux iteration 5 |
| Bare `node -e 0` start | 36.85 ms median (n=15) | performance lineage, local |
| Advisor CLI warm | 62.7-71.3 ms | `008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:18` |
| Warm / cold query embed | 6.57 ms / 271-277 ms | same file :12; `008.../spec.md:130` |
| Model unload | 5-minute default; no `keep_alive` sent `[CHECKED]` | `shared/embeddings/adapters/ollama.ts` |
| Brief | 242-298 bytes, 60-75 tokens; 233 bytes is the constant directive | `runtime/lib/render.ts:162` |
| Command documents (44) | median 4,524 B (~1,131 t), p95 12,573 B (~3,143 t) | `git ls-files` + stat |

1. About 100-110 ms of the Claude median is three Node process starts; the adapter spawn and the CLI spawn are each removable (estimated Claude 205 → ~131 ms).
2. Cold-start bounds are inverted on Claude and Codex: cascade probe 2,500 ms and CLI cold wait 5,000 ms against a 2,500 ms shim kill (Claude) and a 2,800 ms adapter budget (Codex). Devin and Cursor pass 10 s and are safe. A sandbox record already shows a 2,508 ms fail-open.
3. The embedder cold tax (271-277 ms) fits phase 008's planned 750 ms deadline, so it is latency, not failure; but `getAdapter(name)` takes no options, so a wrapper race would abandon a live 5 s request instead of aborting it. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/registry.ts:83]
4. Hook health (rolling p95, fail-open rate) is computed but only `advisor_validate` returns it; `advisor_status` and `/doctor:setup` do not. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:624]
5. Performance does not explain the start-rate spread: hook cost is the same order on every runtime.

## 8. Cross-Lineage Agreement and Conflict

- **Agree:** attribution fields (ux R2-R4, cross-cli R4); command document path in the head (ux R7, cross-cli R3); G5 needs a real-path test (ux R16, cross-cli R5); cold first prompt is the fragile path (ux R6, performance P1).
- **Conflict 1 — process-chain collapse.** performance P2/P3 recommends in-process adapters and daemon RPC (-36% median). ux eliminates it: p95 uses 16% of budget, the gain is not perceptible and the refactor touches the timeout boundary. This synthesis ranks it low and conditional on a measured cold-start win (§9, rank 13).
- **Conflict 2 — document path scope.** ux puts the path in every head; cross-cli limits it to codex, pi and dsh to save tokens where the host resolves commands itself. This synthesis takes the runtime-conditional form, because the Claude `create:*` case is better solved by the G5 fix, and Pi gives a clean A/B.
- **Tension with phase 008 — `keep_alive`.** performance P4 keeps the embed model loaded; phase 008 keeps it cold by design. Listed as a decision, not a recommendation.

## 9. Ranked Recommendations

Ranked by expected start-rate gain or silent failure removed, per unit of work. Each item names the file, the gain, and the check.

| # | Recommendation | File(s) | Measurable gain | Verify |
|---|---|---|---|---|
| 1 | Put Codex hook approval in the install path and add a doctor check | `INSTALL-SKILLED.md` (step after build), runtime-mirrors doctor route under `.skilled/commands/doctor/`, link from `.codex/README.md` | Codex goes from a structural 0 (no brief) to a measured runtime; up to 12 rows become attributable | One Codex smoke run's rollout contains `Advisor:`; doctor prints `WARN codex-hooks-unapproved` on a fresh clone, `PASS` after approval |
| 2 | Record the offer: `offeredCommand`/`offeredPolicy` in the diagnostic record and each arm run line | `runtime/lib/metrics.ts`, `hooks/claude/user-prompt-submit.ts`, `runtime/scripts/routing-accuracy/run-command-behaviour.mjs` | Offer rate becomes countable; today 0 rows can say a command was offered; no extra latency | Fixture serializes both fields; each run line carries them |
| 3 | Make the scorer report an attributable rate: `offered X, started Y of X`, capped excluded, `arm incomplete`, per-policy start and `wrote` counts | `runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | "3 of 12" becomes a delta that is evidence; hides no risky-class regression | 23-of-24 fixture prints `arm incomplete`; `--summary --json` shows `byPolicy.start` with `wrote` |
| 4 | Remove the cold-start fail-open: detached `advisor_status --warm-only` at SessionStart, and a cascade probe timeout below the hook budget | `.claude/settings.json` and `.codex/hooks.json` SessionStart; `.skilled/bin/system-skill-advisor-launcher.cjs` (`SPECKIT_CASCADE_PROBE_TIMEOUT_MS=750`) | First-prompt fail-open count on Claude and Codex → 0; first prompt bounded by the hook budget | Measure a cold start in a sandbox socket dir first; fresh-session `hook-latency.mjs` shows `fail_open` 0 on first prompts; a hung-stub launch returns inside budget |
| 5 | Make DSH reachable: list it in the install guide and default the prompt advisor on when the row is absent | `INSTALL-SKILLED.md`, `.dsh/plugins/repo-guards/index.mjs`, `.dsh/plugins/repo-guards/README.md` | One more runtime that can receive a brief; DSH's 5 of 12 is currently measured with the advisor off | One DSH smoke run's step payload contains `Advisor:`; `grep -ci dsh INSTALL-SKILLED.md` ≥ 2; plugin default test updated |
| 6 | Check the target repo's hook wiring on first run | new `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, called from `/doctor:symlink check --root` | A silent no-brief install becomes `hook-missing <runtime>` with a repair, across 4 native hook configs | Fixture without the entry exits 1 naming `hook-missing claude`; with it exits 0 |
| 7 | Name the command document path in the head on hosts without a folder-style registry | `runtime/lib/render.ts` (`renderAdvisorBrief`, use the existing `runtime` option); golden heads in `ADV/tests` | Removes one inference per start on codex, pi, dsh; head stays under the 140-byte guard (~+40 bytes) | Pi-only A/B over the 12 start rows: `started` rises, `unsafe` unchanged; golden paths resolve with `test -f` |
| 8 | Bind the command's run/ask policy to the skill path that runs the same workflow | `AGENTS.md` Gate 2 bullet (extends the 006 text) | Stops `ask`-row writes like the Devin and Pi ones; Pi 3 and Devin 3 unsafe in the before arm | `rg -c "policy applies to the skill path" AGENTS.md` = 1; post arm `unsafe 0` per runtime |
| 9 | Settle G5 on the real path and guard it: reproduce with a throwaway `CLAUDE_CONFIG_DIR`, also on OpenCode, then add a per-runtime visibility count to `--check` | `sync-runtime-mirrors.cjs` (`--check` counts, one-entry allowlist); `007/scratch/g5/` listings | 12 hidden `create:*` names become visible, or G5 closes as a stand-in artifact; a second `skill.md` cannot ship | Two listings per runtime diff on the 12 names; `--check` prints `claude 32/44` today and exits 1 on a new collision |
| 10 | Fix the argued-route document lookup | `score-command-transcripts.mjs` (`commandParts` / `documentTails`) | 28 of 35 doctor strings become scorable; no false decline on doctor rows | `/doctor:git hooks` case reading `doctor/git.md` returns `started: true`; targeted vitest 0 failed |
| 11 | Thread the 750 ms embed deadline into the adapter as a real abort, not a wrapper race | `shared/embeddings/registry.ts:83` (options), `runtime/lib/embedders/registry.ts`, `runtime/lib/scorer/lanes/semantic-shadow.ts:128` | Request aborts at 750 ms instead of holding a socket for 5 s; correct `disabledReason` | `tests/semantic-prompt-embedding-degrade.vitest.ts` plus an abort-vs-race assertion |
| 12 | Surface hook health and add a "prove it" install step | `runtime/handlers/advisor-status.ts`, advisor leg text in `doctor-setup.yaml`; `INSTALL-SKILLED.md` §2 | The person sees `p95 352 ms, 273 bytes` and a pass or named failure instead of SKIP on a cold install | `advisor_status --format json \| jq .data.hookHealth.rollingP95Ms` prints a number; documented command prints a recommendation |
| 13 | (Conditional) Collapse the host-adapter spawn and the CLI spawn | `runtime/hooks/codex/shared.ts` and Devin/Cursor siblings; `hooks/lib/skill-advisor-cli-fallback.ts` | About 74 ms per Claude prompt (205 → ~131 ms) | Only after rank 4's cold-start measurement shows it matters; hook-latency median ≤ 135 ms, CLI fallback tests pass |
| 14 | Small guards: native-spelling column in the 006 surface table; once-per-command clause unconditional; 44-row head-length matrix; session brief-cost script; command read-cost report flagging `start` docs over 8 KB; machine-readable `write_targets` | `hooks/skill-advisor-hook.md`; `AGENTS.md`; `ADV/tests`; new `measure-brief-cost.mjs` and `measure-command-read-cost.mjs`; `*/command-metadata.json` | Each makes one silent drift visible (5 of 44 docs over 8 KB today; worst head 136 of 140 bytes) | Each script prints its row counts; a 141-byte fixture fails; `repeated 0` in the post arm |

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| "Most runtimes have no hook wired" | Five of six have a live path; Codex and Devin proxy the Claude adapter | Delivery inventory §4 | cross-cli 1 |
| "Codex declined the offered command" | Codex received no brief: hooks unapproved, 0 of 6 transcripts with `Advisor:` | `.codex/README.md:54` | cross-cli 1-2 |
| "The hook is too slow, so the brief is dropped" | Warm median ~200 ms against 2.5 s; only the cold path fails | `measured-2026-11-12.txt` | cross-cli 1; performance 1-3 |
| "A `COMMAND:` line proves an offer" | DSH emitted one with the advisor off | runs-pre.jsonl | cross-cli 2 |
| Trim the comment-hygiene directive to save tokens | Carries a repo hard block; suppressed after the first message; at most 54 tokens per session | `render.ts:162` | ux 1, 5; performance 4 |
| Rename `.skilled/commands/create/skill.md` | Blocked by decision Q025; rank 7 and 9 reach the same commands | decision-record | ux 3 |
| Semantic or persisted prompt cache, new vector precompute | Pays an embedding to decide a hit; vectors already exist; no field hit rate measurable | `prompt-cache.ts:16`, `metrics.ts:319` | performance 4 |
| Longer cold timeout | Trades a fast fail-open for a 5 s first-prompt stall | — | performance 3 |
| Show the degraded meaning lane in the brief | Ruled out by decision Q037 | decision-record | ux 4 |
| Add a recommendation leg to `/doctor:setup` | Route invariant forbids starting the daemon; the proof goes in the install guide | `doctor-setup.yaml` | ux 4 |
| Re-run the before arm in research | Phase 007 owns the arm; research may not start CLI runs | steer.md | ux 2 |
| Treat Claude's low rate as a brief failure | Same brief yields 3 of 4 read-only starts and 0 of 8 mutating starts | runs-pre.jsonl | ux 2 |

## Divergence Map

No divergent pivots were taken in any lineage. Saturated directions: directive trimming, the `create` rename, caching and precompute, steady-state latency. Remaining frontier: the post-arm behaviour of the planned head (needs ranks 2-3 first), the cold daemon start time (needs a sandbox socket measurement), OpenCode's folder rule for `skill.md`, Devin's delivery observability, and the Codex and DSH smoke runs.

## 12. Open Questions

1. Does an offer move mutating starts on Claude and Codex? Only the post arm with ranks 2-3 in place can say.
2. What does a cold first prompt cost end to end? Unmeasured under this run's rules (no daemon or ollama control); it bounds the gain of ranks 4 and 13.
3. Does OpenCode collapse a folder that holds `skill.md`?
4. How does a failed host invocation (a model typing `/create:readme` in Codex) show up? It leaves no tool call and no scored fact today.
5. Is the Devin brief delivered? The shim is wired; the sampled records cannot show it.
6. Should the embed model stay warm (`keep_alive`) against phase 008's cold-by-design choice? Operator decision.

## 13. References

- Parent packet `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/`: `spec.md`, `decision-record.md`, `goal.md`; `plan.md` and `tasks.md` of `005`-`008`; `007/scratch/runs-pre.jsonl`, `007/scratch/g5/result.txt`; `008/scratch/measured-2026-11-12.txt`
- Lineage syntheses: `lineages/ux/research.md`, `lineages/performance/research.md`, `lineages/cross-cli/research.md`; iterations under `lineages/<label>/iterations/`
- Merged registry `findings-registry.json` (67 key findings), attribution `fanout-attribution.md`, resource map `resource-map.md`
- Runtime surfaces: `.claude/settings.json`, `.codex/README.md`, `.codex/hooks.json`, `.dsh/plugins/repo-guards/index.mjs`, `.pi/extensions/prompt-advisor.ts`, `.opencode/plugins/system-skill-advisor.js`, `INSTALL-SKILLED.md`
- Advisor code: `runtime/lib/render.ts`, `runtime/lib/metrics.ts`, `runtime/skill-advisor-cli.ts`, `runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, `hooks/lib/skill-advisor-cli-fallback.ts`; `system-spec-kit/shared/embeddings/{auto-select.ts,registry.ts,adapters/ollama.ts}`

## 14. Answered Questions

- What stops a model from starting an offered command, per runtime: Codex and DSH never get the brief on a normal install; elsewhere no offer exists yet (pre-005), and capability judgment splits read-only from mutating commands. Answered.
- Where hook time goes and what removes the fail-open: answered (§7, rank 4).
- Token cost per prompt and per start: answered (brief 60-75 tokens; started document ~1,131 tokens median).
- Discovery defects: answered (G5, three spellings, no visibility check).
- External install path: answered (no Codex approval step, no DSH, existing hook configs win, setup SKIPs cold).

## 15. Limitations and Confidence

- Executor is a flash model; numbers it reports were spot-checked by the orchestrator for the load-bearing items (Codex approval, DSH flag, cascade and cold-start timeouts, no `keep_alive`, `/doctor:setup` SKIP, `skill.md` presence). Others carry the lineage's citation only.
- The before arm grew during the run; §3 is the single snapshot used for ranking.
- Gains for ranks 4, 7 and 13 are estimates until the cold-start and Pi A/B measurements exist.
- The ux lineage ran the real hook 47 times, which appended telemetry rows under `$TMPDIR/speckit-skill-advisor-metrics/` (outside the repository).

## 16. Implementation Decision

Recommended next packet: ranks 1-6 as one reachability-and-attribution phase after 007's after arm, because ranks 2-3 are required for that arm to be evidence and ranks 1, 4, 5 and 6 decide whether a brief exists at all on four runtimes. Ranks 7-12 follow once the post arm shows which runtimes still decline. Rank 13 waits on the cold-start measurement. Operator decision needed on `keep_alive` (§12 Q6).

## 17. Convergence Report

- Stop reason: per lineage — `cross-cli` converged after 3 iterations (all 5 questions answered); `performance` reached its 5-iteration cap (last ratio 0.45); `ux` reached its 5-iteration cap (ratios 0.83-0.90).
- Total iterations: 13 (ux 5, performance 5, cross-cli 3)
- Questions answered: cross-cli 5/5, performance 5/5, ux 4/5 substantive (KQ1 half answered: model-side behaviour needs the post arm)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

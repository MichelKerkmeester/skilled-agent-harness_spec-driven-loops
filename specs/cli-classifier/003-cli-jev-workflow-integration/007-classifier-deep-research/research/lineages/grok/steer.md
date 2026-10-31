# Lead Steering: grok lineage

The lead's review of each iteration, plus steering for the next ones. It names gaps and drifted citations and never supplies conclusions. Where a steer conflicts with your angle, follow the angle.

## Review of iteration 1

Verdict: **strong**. It took angle grok-01, applied ALL-5 (the runtime, precision and device column) and carries the Independent line.
- New ground: the claim table separates the release 0.8B, the release 9B and the Qwen3-1.7B development checkpoints (`serve/README.md:130-143`). It also shows that no calibration file names the served checkpoint: 11 of 15 files name `v5_17b` and the four `*_long.json` files name none. The lead re-counted this with grep.
- The lead opened 5 citations and all hold: `calibration_v13.json:3-5`, `deem_server.py:486-489`, `leaderboard.md:97-106`, `MODEL_CARD_9B.md:22-36` and the parent `goal.md:51` and `:131`.
- Gap: the JevBench table at `MODEL_CARD_9B.md:27-30` also lists Jev at 74.1 against the 9B at 65.8. That is the only published row that sets Deem beside Jev (a vendor claim), and question A asks for accuracy against Jev. The claim table left it out.
- Weak idea: N-grok-01-1 ("do not serve the 9B") mostly restates parent D3 and adds no evidence beyond the shared-benchmark gap. It earns little.
- The answer shape is mostly met, but N-grok-01-2 has no LOC, and its gate ("refuse when temperature is 1.0") is a weak proxy. `temperature_for` also returns 1.0 for an unmatched primitive when a file is loaded (`:489`), and `health()` exposes only status, model and backend (`:774-779`).
- Containment is clean: every new file is inside `lineages/grok/`, with no sign of a `jev` or Deem call.

## Steering for next iterations

For grok-02 (iteration 2, which may already be running) and grok-03 (iteration 3):
- **grok-02:** apply ALL-8. Say field by field what a placeholder `JEV_API_KEY` means under "Jev gets no secret" and BASE2 row 67. Also confirm from code whether Deem ignores the request `model` (look near `deem_server.py:894`) and which HTTP status it returns when `criteria` arrives without `options` or `levels`.
- **grok-02:** give an exit code for each subcommand, with and without `--value`, against Deem. Cite the `jev-cli` exit mapping (`JEVSRC:436-440` and the `CliError` codes). Do not infer it.
- **grok-03:** apply the §7 grok-03 line. Count the schema bytes in `deem_mcp.py` rather than arguing the MCP question in prose. Rows 44, 47 and 49 are covered, so go to the npm `jevctl` `compact.md` and the 9B long-state claim, which round 2 did not use.
- **Any Deem idea:** say how a threshold or keep rule survives the 6-hourly auto-update (`LOCAL:55-70`, ALL-2). N-grok-01-2 ties calibration to one commit, and launchd can change that commit under it. Find out from `deem-ctl` whether an update can be pinned or held. Read it and never execute it (ALL-1).
- **Open thread for grok-07:** can a client tell which calibration is loaded? If no endpoint exposes it, the gate needs a server-side signal or a pin in the config. Check `/v1/models` (`deem_server.py:850-860`) and the startup log line (`:1002`).
- **Stop:** drop-ideas that only restate a parent decision. Record them in one line under Ruled out, not as a full per-idea record.
- **Keep:** reading fields inside a file, as you did with the `checkpoint` field, rather than trusting file names.

## Review of iteration 2

Verdict: **strong**. It took angle grok-02, carries the Independent line and applies ALL-8. It finished at 08:32:59, before this file existed at 08:33:08, so none of the iteration-1 steering reached it. Its coverage of ALL-8 and the ignored `model` came from §7 and the angle.
- New ground: a field table and a Python `jev-cli` exit table against Deem, with `jev-cli` and `jevctl` kept apart. `run` is the only subcommand that carries a Deem-shaped body.
- The lead opened 6 citations and all hold: `deem_server.py:546-550`, `:594-601` and `:876-899`; `JEVSRC:274-301` (exit map at `:296`, 60 s timeout at `:288`) and `:425-443`; `ask.ts:11-26`; `R/CLAUDE.md:23`; `provider.ts:192-200`.
- Missed, and it changes the translator: Deem's core `ChoiceQuestion` has a `criteria` field that "never appears in the rendered prompt" (`DEEM/src/deem/primitives.py:98-104`), and `parse_question` does not pass it through. The `KEY=DESCRIPTION` pairs from `jev-cli` therefore lose either the descriptions (keys sent as `options`) or the keys (descriptions sent as `options`, so the returned `choice` must be mapped back). Exit 0 is not fidelity.
- A tension to settle: N-grok-02-1 edits `jev_cli/__init__.py`, which belongs to a pip-installed third-party package. That is a fork unless upstreamed, which contradicts its own "not a fork".
- Weak kill criterion: "choice exits 0 without a translator" is already false from code. The criterion should be a measured result that would move the design to another route.
- Its preference reasoning (prefer Jev because it needs no rewrite) ignores privacy, and its Deem switch does not apply ALL-4 (refuse `backend: stub`).

## Steering for next iterations

For iteration 3 (grok-03, already queued) and iteration 4 (grok-04):
- **Carry into grok-07 (not grok-03):** compare three `cli-deem` routes with LOC and risk, each with a kill line that is a result, not a known fact. (a) Patch `jev-cli`, a fork. (b) Build a Deem-shaped body and send it through `jev run --endpoint`, which needs a placeholder key and makes `--value` unusable (`JEVSRC:390-391`). (c) A small stdlib client that sends no bearer key.
- **Fidelity:** for any translator, state what the model sees. Check `DEEM/src/deem/format.py` for how `options` and `instructions` render into the prompt, so descriptions are not silently dropped.
- **Preference:** state backend preference per feature, weighing privacy and measured accuracy. "Needs no rewrite" is not a reason on its own.
- **Deem switches:** cite ALL-4 in every Deem switch (parse `backend`, refuse `stub`).
- **grok-04 (W2):** fill the Sibling check first. Classify each drop by its load-bearing reason from the BASE1 and BASE2 rows. Reopen the hook deadlines at their source rather than trusting "2,500 ms" and "3 s" from `LOCAL:50`.
- **Stop:** citing an exit code or HTTP status as a test result. Label each inferred, as iteration 2 did.

## Review of iteration 3

Verdict: **strong**. It took angle grok-03, carries the Independent line and applies the §7 grok-03 line (a schema byte count, with rows 44, 47 and 49 treated as covered). It records "No `steer.md`". It began before the iteration-1 entry reached disk, so no steering reached it.
- New ground: `compact.ts:284-285` keeps both the call and the result when an answer is missing (`?? { keepCall: 1, keepResult: 1 }`). That contradicts the missing-answer-throws rule BASE2 adopted (`B2:400`). Also new: BASE2 has no MCP row (the lead's grep finds 0 matches), and `state` is a required argument for Deem's MCP tools (`deem_mcp.py:60`).
- The lead opened 6 citations and they hold: `compact.ts:58-68` and `:284-285`, `deem_mcp.py:56-60`, pi-jev-context `README.md:85` and `:87`, `B2:400`. The byte count reproduces at 2,224, one byte off for a trailing newline.
- One drift: `docs/compact.md:36` is blank, and the egress sentence is at `:37`.
- An honest limit: it labeled 2,225 a source size, not the wire size, and did not run Deem's module to get the wire size. Correct under the contract.
- Gap: it prefers Deem for transcript-sized state, but LOCAL's 60 ms was measured on short synthetic inputs (`LOCAL:32`). The server applies no input-length cap or truncation (`deem_server.py:204-208`; no truncation hit in `src/deem/format.py`). A transcript-sized state therefore costs an unmeasured amount per call.

## Steering for next iterations

For iterations 4 (grok-04) and 5 (grok-05). Iteration 4 should be the first to read this file.
- **grok-04 (core of question B):** when a row reopens on latency, say what input size it would send. The measured p95 of 62.8 to 78.5 ms holds only for short synthetic inputs (`LOCAL:32-38`). A row that sends history or a transcript reopens as "latency UNKNOWN at that size", not "flips".
- **grok-04:** reopen each deadline at its source. For the advisor, find the hook timeout in `.claude/settings.json` or the hook's own code. For PreCompact, the timeout. Also name what the hook already spends before any call. BASE1 rows 1 and 5 are quoted, not re-derived.
- **grok-04:** keep "no gold", "authority" and "no seam" as reasons that never flip on backend alone. Give the flip set as a short list at the end of the table.
- **grok-04 (W2):** fill the Sibling check with each sibling's newest iteration by path and number. Where you agree with a sibling, cite code you opened yourself, or say plainly that you only cite theirs.
- **grok-05:** the label-set count comes first (§7). Then check whether the intent scorer at `sk-prompt/SKILL.md:150-160` is real Python or a fenced example the model follows: search for `AMBIGUITY_DELTA` outside `SKILL.md`.
- **Carry forward:** the compact fail-open and the missing length cap both belong in grok-09's claim table. Do not re-derive them before then.

## Review of iteration 4

Verdict: **adequate**. It took angle grok-04 and has a real Sibling check: `deepseek/iterations/iteration-001.md` is read and quoted as deepseek's, and mimo, swe and glm are recorded as absent. It wrote "No `steer.md`" although this file existed, so the loop does not re-read steering. From here on, the entries below are annotations for the synthesis.
- STRONG-FINDING: all 72 drop rows sort into classes, each row once. A lead grep of `B1:1045-1087` and `B2:794-822` for cost, quota or price finds no row whose load-bearing reason is cost or quota. Row 52 is about an unreproduced price, not cost. That contests the spec's premise that many drops were "for cost, quota, latency or egress" (`spec.md` §2).
- WEAK-CLAIM: the table gives one class per row. The angle (q1) and synthesis-brief step 3 ask for every reason per row, and 25 rows sit in "other". The synthesis must re-read those 25 rows rather than inherit the bucket.
- WEAK-CLAIM: rows 1 and 5 are marked "No", but the iteration's own text says spawn cost is UNKNOWN, and N-grok-04-1's kill line would reopen row 1. Under the brief's categories, rows 1 and 5 are "unknown, pending a spawn-included p95", not "stays dropped".
- DEFECT: row 38 (`B1:1082`, a PostToolUse filter on Bash output) is classed "other/secrets" and dismissed. Its first reason is that the secrets leave the machine, which a local Deem removes. Its other reasons are "a deterministic filter needs no key" and "whether a command hook can replace tool output is UNKNOWN" (no seam). It is the clearest partial flip on the list, and it is tool-output pruning (question C). The synthesis should re-rank it as unknown or later, pending a seam check.
- DEFECT: the class rule ("the clause that stands if the other is removed") is applied unevenly. Row 72's standing clause is "duplicates R20 ... no new fact" (`B2:822`), which is not latency or egress. Row 31 is listed under both authority and the latency table.
- The lead opened 6 citations and they hold: `B1:1045`, `:1049`, `:1075` and `:1084`; `B2:249`, `:259`, `:819` and `:822`; `deepseek/.../iteration-001.md` F9, F10 and N-deepseek-01-1 and -2.
- WEAK-CLAIM: angle q3 asked it to name the budget the hook already spends. `B1:1045` gives 2,200 ms of the 2,500 ms to the advisor. The iteration left that out. deepseek-01 F9 has the settings deadlines from `.claude/settings.json`.
- WEAK-CLAIM: later items R3, R5-R7, R9, R12, R13, R16-R18 and R22 are not classed. Only R2, R4, R8, R10, R15 and R19 are.

Steering note, in case it is read: re-class row 38 with the seam question open, and use "unknown" rather than "No" where spawn cost is the only gap.

## Review of iteration 5

Verdict: **adequate**. It took angle grok-05, applied §7 (label-set count first) and has a real Sibling check: `deepseek/iterations/iteration-002.md` (N-deepseek-02-2 quoted as deepseek's). It wrote "No `steer.md`" again.
- STRONG-FINDING: sk-prompt names 7 frameworks in 5 places (`SKILL.md:3`, `:12`, `:38`, `:70`, `:309-315`), while `assets/framework-registry.json` holds 5 ids, with no `crispe` and no `craft`. TEXT_ENHANCE loads `patterns-evaluation.md` (`SKILL.md:136`), which is 36,580 bytes. The lead re-ran `wc -c` and the id count, and both match.
- DEFECT: angle q1 ("is the intent scorer at `SKILL.md:150-240` runnable code anywhere?") was skipped, and the angle says that answer decides whether a seam exists. A lead search finds `select_intents` and `AMBIGUITY_DELTA` only in `SKILL.md:155` and `:194`, in a playbook doc, in benchmark report JSON and in `sk-doc/shared/assets/skill-contract.json:167`. No runnable sk-prompt module turned up (lead's search, not exhaustive). The synthesis should record "no runtime seam" unless a lineage finds one.
- WEAK-CLAIM: N-grok-05-1 treats the registry as the label set for user requests, and saves the 36,580 bytes by loading "one registry template". The registry's own description calls its entries "data-only scaffold[s] ... that a slot renderer interpolates" (`framework-registry.json:3`). The `rcaf` entry is `applies_to: ["code"]` with a JavaScript-engineer template (`:9-11`). Outside docs and metadata, a lead `rg` finds it referenced only by benchmark material (`deep-improvement/assets/model-benchmark/benchmark-profiles/glm-5.2-frameworks.json`, `scripts/model-benchmark/MODES.md`). It looks like a benchmark fixture, not the prompt-improve renderer. That is the lead's inference, and a caller search in the synthesis would settle it. The savings line stays unproven until then.
- The lead opened 5 citations and they hold: `SKILL.md:12`, `:136` and `:321`; `serve/README.md:92-94` (the 26-option cap); `B2:803` (row 63).
- The citation `SKILL.md:313-315`, used in the hand-off for CRISPE and CRAFT, is right against the matrix at `:309-315`.
- Containment is clean: every new file is inside `lineages/grok/`.

Steering note, in case it is read: grok-06 should name which runtime file, if any, reads each sk-design artifact it counts, before calling it a seam.

## Review of iteration 6

Verdict: **adequate**. It took angle grok-06, applied §7 (it invents no hub routing number) and has a Sibling check (deepseek iteration 2; mimo, swe and glm absent). It wrote "No `steer.md`".
- STRONG-FINDING: the 53 playbook scenario files are a procedure count, not an accuracy (4 hub, 12 fundamentals, 10 diagram, 9 chart, 18 md-generator). The lead re-counted them with `find`, and they match. The benchmark README records no archived hub run (`sk-design/benchmark/README.md:26-27`).
- DEFECT: N-grok-06-1 rests on "the keyword function already returns the intent without a model call" and on BASE1 row 12's deterministic-code authority. `classify_intents` and `INTENT_MODEL` (`sk-design-fundamentals/SKILL.md:197-203`) sit in a Python block inside `SKILL.md`. A lead `rg` outside `*.md` and benchmark trees finds no runtime file that defines or imports either name in `sk-design` or `system-skill-advisor`. If it is pseudocode, the main AI runs it in context, and the premise fails. This is the same open question iteration 5 skipped for sk-prompt. The synthesis must settle whether either scorer runs anywhere before accepting either drop.
- DRIFTED-CITE: `sk-design-md-generator/references/quality-checklist.md:29` is the "Data-driven, not fabrication-driven" line. The `validate.ts` dual score and the `isPass` rule are at `:466-479` (VS-03, VS-05). The real code is `sk-design-md-generator/backend/scripts/validate.ts:57-60` and `:660`. Also, `isPass` requires `score >= 80` and `claimsScore >= 80` (`:476-477`), where `score` is not necessarily `valuesScore`.
- WEAK-CLAIM: angle q2 and q4 asked for rubric item counts, which items a `noul` could answer from text alone, and a gold count. None was given. `quality-checklist.md` holds 80 `- [ ] **[ID]**` items (lead count). Its prose-provenance items, such as VS-01-style "claim cited or `[INFERRED]`", are text judgments that `validate.ts` flags only at WARNING tier (`:459`). That is a candidate the iteration dismissed without counting.
- The lead opened 5 citations and they hold: `ROUTER.md:32-42`, `review-checklist.md:17`, `B1:1056` (row 12), `B1:1072` (row 28), `properties.json:38-43` (50.8% near chance, a vendor claim).
- `B2:825` resolves to the "Row 8 gains ..." note under What Not To Build, not a table row. That is acceptable.

Steering note, in case it is read: before any drop that says "deterministic code already does this", name the runtime file that executes it.

## Review of iteration 7

Verdict: **strong**. It took angle grok-07 and has a Sibling check (swe iteration 1, deepseek iteration 2; mimo and glm absent). It **read this file** ("`steer.md` was read", line 5 and Sources) and took up the calibration-visibility thread, the three-route comparison and the fidelity check. So steering can reach an iteration, at least from 7 on. Those threads came from the lead's steer, and the evidence is the iteration's own.
- STRONG-FINDING: no client can see which calibration is loaded. `/health` returns only status, model and backend (`deem_server.py:845-846`, calling `health()` at `:774-779`). `/v1/models` returns only the id (`:847-860`), and the startup line has model, backend and URL (`:1001-1004`). The lead reopened all three.
- STRONG-FINDING: `deem-ctl update` has no pin or hold. It compares remote and local SHAs, then downloads, switches `models/current` and checks out the source (`~/.local/share/deem/bin/deem-ctl:134-164`). The lead read it and did not execute it, and a grep for pin, hold or freeze finds nothing. So a threshold survives an update only if the measurement stores the commit pair and refuses a pair with no calibration file.
- STRONG-FINDING: fidelity. `render_prompt` shows `instructions` and then `(A) {label}` per option (`format.py:296-304`), while `criteria` is never rendered (`primitives.py:98-99`). Exit 0 therefore does not prove that `KEY=DESCRIPTION` descriptions survived. Lead-verified.
- STRONG-FINDING: 0 runtime callers. A lead `rg` over `.skilled`, `.claude` and `.opencode` for `deem_mcp`, `TYPESAFE_BASE_URL`, `DEEM_ENDPOINT` and `127.0.0.1:8300` returns 0 files. That grounds the contest of swe-01's build-now for `cli-deem`, which this iteration argues from code and a count it made itself, not from the sibling's text.
- Also holds: `cli-external-orchestration/SKILL.md:3` (seven modes, no per-mode logic) and `hub-router.json:30` (fails closed).
- DRIFTED-CITE, minor and quoted from deepseek-01: `health()` is at `deem_server.py:774-779`, not `:772-777`. And `JEVSRC:18-39` is `:20-39` for `PROVIDERS`.
- WEAK-CLAIM: route (a)'s kill line ("`pip show` says the file was not edited") does not test the route. The real reason (a) fails is that it is a fork of an installed third-party wheel, and the iteration says so in the same row.

Steering note: grok-08 should connect Tare's flip and calibration metrics to the stored commit-pair rule above, and name which Tare metric needs labels this repository lacks.

## Review of iteration 8

Verdict: **adequate**. It took angle grok-08 and has a Sibling check (deepseek iteration 3, swe iteration 1; mimo and glm absent). It **read this file** (line 14 and Sources), and it followed the iteration-7 steer on the commit pair.
- STRONG-FINDING: three different statistics share the word "flip". R1's rerun flip is capped at 0.10 as one of four keep conditions (`B2:233`). Tare's permutation flip is option-order stability (`T/probes.py:139-145`). Tare's conditioned gate passes a near-chance model by design (`T/metrics.py:454-468`). Importing the gate into R1 would loosen the keep. The lead opened all three.
- STRONG-FINDING: ECE and Brier need ground-truth outcomes (`T/metrics.py:13-15`), so no current keep rule can read them until labels exist.
- WEAK-CLAIM: N-grok-08-2 measures the flip of 3 identical reruns on Deem. Deem's server does not sample. It reads fixed letter logits, with option orders that are identity plus seeded shuffles (`deem_server.py:626-672`). An identical rerun is therefore deterministic by construction, apart from possible MPS numeric noise. The kill line "flip above 0.10" can hardly fire, so the idea adds no evidence. The flip that matters for the served model is Tare's permutation flip, which the iteration dropped.
- DEFECT: it missed the vendor's own serving-side answer to position bias. `DEEM_N_ORDERS` (`deem_server.py:985`, default 1) averages choice probabilities over `n_orders` deterministic option orderings (`:629-633`, `:665-668`). The docstring calls it "the two-order readout validated on JevBench", a vendor claim. `deem-ctl` does not set it (a lead grep for "order" finds nothing), so the served server runs a single order. Adopt or reject is a live question: 2x choice compute against Tare's permutation flip on a small label set. The synthesis should carry it as an open item for any Deem `choice` feature.
- DRIFTED-CITE: "`B2` REQ-008 note ... quoted from the phase table at `:927` area" is not a `file:line`. The synthesis should treat the coefficient-replacement claim as unverified here.
- The lead reconfirmed `benchmark-stability.cjs:102-108` (1.0 at mean 0).

Steering note: grok-09's claim table should list `DEEM_N_ORDERS=1` on the served server beside the missing calibration and the missing length cap. Each needs a local number before a Deem `choice` threshold.

## Review of iteration 9

**Steering for iteration 10 (grok-10, the final iteration). Read this first.**
1. Argue the single phase from counts this lineage already holds: 0 runtime Deem callers (iteration 7), no labels for any judgment survivor (`deem-local.md:52`) and no calibration for the served commit (iteration 1). State plainly whether the chosen phase's first slice makes zero calls or needs a labeled set. The synthesis ranks a Deem feature above later only on one of those two.
2. "What stops Deem entirely" should be a list of printed local numbers, each with a threshold you fix now: a spawn-included p95 inside a hook, latency at transcript size (no length cap, `deem_server.py:203-211`), permutation flip with `DEEM_N_ORDERS=1` (`:985`, see the iteration-8 entry), accuracy on a labeled set, and a commit pair that changes under a keep rule.
3. Contest swe-01's build-now against swe's newest iteration, not iteration 1, because it may have moved. Reopen one code line on each side of the disagreement.
4. Name the operator's decisions and when each falls due: keep Deem running with 0 callers and CORS `*` (ALL-3), or stop it; auto-update against a pin (iteration 7, `deem-ctl` has none); whether to move `cli-jev` under a hub before `cli-deem` has a caller.
5. Carry BASE1 row 38 (Bash-output filter, egress removed, seam UNKNOWN) into the order or into What Not To Build explicitly. The iteration-4 entry flags it as the clearest partial flip.

Verdict: **adequate**. It took angle grok-09, read all its own iterations and both newest sibling files (deepseek iteration 3, swe iteration 1), and **read this file**. It took up the iteration-5 and iteration-6 steers: the registry has one runtime reader, and `classify_intents` has no definition. It could not see the iteration-8 entry, which landed at 08:41:54, after iteration 8 finished at 08:41:02. So `DEEM_N_ORDERS` is missing from its table through timing, not neglect.
- STRONG-FINDING: the framework registry's only runtime reader is the model-benchmark sweeper (`deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:43-49`), with its vitest and a benchmark profile. The lead's repo-wide `rg` agrees. N-grok-05-1's byte saving is not a production saving.
- STRONG-FINDING: no `classify_intents` or `select_intents` definition exists in code. The only code hit is an archived regex over `SKILL.md` text (`source-model.cjs:183`, lead-verified). N-grok-06-1's "code already does this" premise is unverified, as the iteration-6 entry flagged.
- WEAK-CLAIM: angle q1 names Jev's prices and latency as vendor claims to list. They are absent from the table.
- WEAK-CLAIM: it keeps N-grok-08-2 at later with the kill line "flip above 0.10". The iteration-8 entry shows that identical reruns on Deem are deterministic, so that line cannot fire.
- DRIFTED-CITE, repeated: `deem_server.py:772-777` for `health()` is `:774-779`.
- The lead opened `MODEL_CARD_9B.md:27-30` (Jev 74.1, 9B 65.8, a vendor row). The iteration-1 omission is now closed.

## Review of iteration 10

Verdict: **adequate**. It took angle grok-10 and has a Sibling check (deepseek iteration 3, swe iteration 1; mimo and glm absent). It says it read this file, but it finished at 08:42:36, before the iteration-9 entry landed at 08:43:16, so the final steering never reached it. The state log's last record is `{"event":"synthesis_complete","stopReason":"maxIterationsReached","totalIterations":10}`. Confirmed.
- DEFECT: "ship no new classifier phase" and "no new client unless D3 is amended" read D3's "Nothing else is built" (`specs/cli-jev/003-cli-jev-workflow-integration/goal.md:51`) as forbidding `cli-deem`. D2 on the line before (`:50`) requires a `cli-classifier` hub holding `cli-deem` and lets the research decide its shape. The synthesis brief requires the hub among the new Planned phases. D3 governs what is installed and served; Planned phases are not built. The synthesis should read the iteration's point as timing (no build before a caller), not as a veto.
- DEFECT: the order line gates every judgment arm on N-grok-08-2's one-question flip. Identical reruns on Deem are deterministic (`deem_server.py:626-672`, iteration-8 entry), so that gate proves nothing.
- STRONG-FINDING: it names the D2 tension openly: "derive `cli-deem` from `cli-jev`" against a client that does not shell out to `jev`. Its answer is to derive the printed contract and the exit codes, not the HTTP call (`goal.md:50`).
- The lead opened `goal.md:49-51`, and it holds.

## Lineage summary for the synthesis

**Top findings (lead-verified):**
1. `jev-cli` typed subcommands cannot reach Deem unchanged. It sends `criteria` (`jev_cli/__init__.py:364-369`) where Deem needs `options` and `levels` (`deem_server.py:535-543`), and `criteria` is never rendered (`src/deem/primitives.py:98-99`, `format.py:296-304`). Exit 0 does not prove fidelity.
2. No calibration file names `deem-0.8-v1`. 11 of 15 name `v5_17b` (`serve/calibration/calibration_v13.json:3-5`), and no endpoint shows the loaded file (`deem_server.py:845-860`, `:1001-1004`).
3. `deem-ctl update` has no pin or hold (`~/.local/share/deem/bin/deem-ctl:134-164`), and the served server runs `DEEM_N_ORDERS=1` (`deem_server.py:985`).
4. The compaction path fails open (`R/jev-cli-main/src/vendor/compaction/compact.ts:284-285`), and Deem's MCP tools require `state` (`deem_mcp.py:60`). There are 0 runtime Deem callers (grep in iteration 7).
5. No drop row out of 72 rests on cost or quota (iteration 4). sk-prompt claims 7 frameworks, its registry holds 5 (`framework-registry.json:5-54`), and the registry's only reader is `sweep-benchmark.cjs:43-49`.

**Defects the synthesis must not repeat:**
- Rows 1 and 5 are "unknown pending a spawn-included p95", not "No".
- Row 38 (`B1:1082`) is a partial flip, not "other".
- N-grok-06-1's "code already does this" is false for sk-design: the hub is outside the compiled closure (`sk-design/SKILL.md:202-203`), and `classify_intents` has no code definition.
- N-grok-08-2's rerun flip cannot fire.
- `quality-checklist.md:29` should be `:466-479`.
- The D3 over-read above.

**Contested:** grok contests swe-01's build-now for the `cli-deem` client, on the 0-caller count and unmeasured accuracy. Its packaging agrees. deepseek-04 **agrees** with grok-06's deterministic-routing premise (its F3), but that agreement fails for sk-design for the reason above. No sibling contested a grok count (grep of the deepseek, swe and glm iterations).

**CORRECTION (2026-09-27):** the claim that sk-design is outside the compiled router is wrong. It appears in the iteration-10 lineage summary under Defects and Contested, and in the iteration-6 DEFECT. sk-design is in `DEFAULT_ON_HUBS` (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:36-44`) and in `serving-closure.manifest.json:12`. The orchestrator ran `compiled-route.cjs --hub sk-design` and got action `route` to `sk-design-chart`. So `sk-design/SKILL.md:202-203` (rule 6) is stale. grok-06's point stands for sk-design **mode** routing: it already runs as deterministic code, so N-grok-06-1's drop of a model mode router holds, and deepseek-04 F3's agreement stands. What remains true: `classify_intents` in `sk-design-fundamentals/SKILL.md:197-203` has no code definition. Leaf selection inside a mode is still prose the main AI follows.

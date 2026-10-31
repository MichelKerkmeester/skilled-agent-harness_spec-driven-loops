---
title: "Iteration 4 — deepseek-04: Context-reduction seams and their deadlines"
trigger_phrases: []
---

# Iteration 4 — deepseek-04: Context-reduction seams and their deadlines

## Focus

Angle **deepseek-04** (W2): *Context-reduction seams and their deadlines.* Maps to questions C and B; answers angle questions 1 to 5. Wave 2 is in force: the newest sibling iteration files were read first (Sibling check below), and the lead's steering for this angle binds (the two call paths; the restart window as the cold case).

## Corrections carried from `steer.md` (opened this iteration)

The lead's review of iterations 1 and 2 named defects and drifts. Each was confirmed in code here before adoption; the iteration record is not silently edited, so the corrections live here and in the later artifacts:

1. **The probe's pass condition becomes an allowlist, not a denylist.** `deem-ctl:59-66` passes a backend only when it parses as `torch` or as `ensemble:*` without `stub`; `EnsembleBackend.name = "ensemble:" + …` at `deem_server.py:270`. N-deepseek-01-1's `backend != "stub"` is replaced by `backend in {torch} | ensemble:* (no stub)` **plus** the model pin. [SOURCE: `~/.local/share/deem/bin/deem-ctl:59-66`; `deem_server.py:262-271`]
2. **Drifted cites corrected, confirmed:** the stub notice and `StubBackend()` are at `deem_server.py:979-984`; `serve_forever()` at `:1007`; the `KeyboardInterrupt` handler at `:1006-1008`; the vendor `DEEM_HOST=0.0.0.0` at `README.md:226`; the 1.5 s idle failsafe at `hf-model-server.cjs:52`. [SOURCE: `deem_server.py:979-984`, `:1006-1008`; `README.md:224-228`; `hf-model-server.cjs:50-53`]
3. **The rollback restart swallows its own failure.** `deem-ctl:171` is `start_server >/dev/null || true`, so exit 3 prints "restored" even if the old version never came back; iteration 2's F4/F5 implied a verified restore. Correction: the rollback restores the **symlink and checkout**, and only attempts the restart; the message's "restored" refers to the on-disk state, not to a healthy server. [SOURCE: `deem-ctl:167-172`]
4. **Smoke means "did not error", not "sane".** `smoke_decision` greps `"choice"` in a 2xx body (`deem-ctl:84`); it proves the call returned the expected field, not that the answer is right. [SOURCE: `deem-ctl:79-85`]
5. **F11's disk arithmetic corrected:** `LOCAL:28`'s 2.1 GB is the whole install with one model; two retained checkpoints come to roughly 3.5 GB (≈2.8 GB models + ≈0.7 GB venv/source, inferred from the difference). [SOURCE: `deem-ctl:177-183`; `LOCAL:20`, `:28`]
6. **The launchd job running `update` is inferred, not opened** (the plist stays closed under ALL-1). [SOURCE: `LOCAL:70`]

## Actions Taken

1. Read the advisor chain: `.skilled/hooks/skill-advisor/claude/user-prompt-submit.ts` (`DEFAULT_CLAUDE_HOOK_TIMEOUT_MS` `:115`, CLI fallback path `:303-325`) and the shim that spawns it, `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` whole (constants `:19-26`, spawn `:97-146`, child env and kill `:105-117`).
2. Read the PreCompact chain: `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` whole (`HOOK_TIMEOUT_MS` `:11-12`, budgets `:13-16`, `withTimeout` `:82-96`) and `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` (`remainingMs` `:237-239`, budgeted rendering `:241-262`, merge warning `:350-355`, snapshot budget `:440-466`, deadline construction `:488-497`, enrichment reserve `:519-545`).
3. Read the routing seams: `.skilled/bin/compiled-route.cjs` whole (front door, legacy sentinel `:40-48`) and `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:1-60` (cold-Node contract, exit codes).
4. Read the hook settings as installed: `.claude/settings.json:103-116` (UserPromptSubmit 3 s each), `:193-211` (PostToolUse 10 s and 5 s matchers), `:215-222` (PreCompact 3 s).
5. Read sibling iterations: `grok/iterations/iteration-003.md` (context-reduction patterns and drops) and `grok/iterations/iteration-006.md`; `swe/iterations/iteration-001.md` (the `cli-deem` client design). No `mimo` or `glm` file exists yet; my own `steer.md` was read first as the contract requires.
6. Quoted BASE1 WNTB rows 1, 5, 38 and 40 with their own lines; nothing was re-derived from LOCAL beyond citing it.
7. Nothing was executed: no hook, no `jev`, no Deem call.

## Sibling check

- `grok/iterations/iteration-003.md` (its iteration 3, W1): its pattern table and drop classification. This iteration contests nothing it counted — its compact-path finding (`compact.ts:284-285`, a missing batch answer defaults to keep-everything) was not reopened here (a vendored file outside my angle), so I record it as grok's own count, not as my evidence. I agree with its deadline framing and supply the missing numbers: the exact budget chain the whole drop set rests on.
- `grok/iterations/iteration-006.md` (its iteration 6, newest): design routing only, no deadline claims. No contest; its keyword-scorer argument matches F3's finding that the routing seams are deterministic CLIs, not model calls.
- `swe/iterations/iteration-001.md` (its iteration 1, W1): its N-swe-01-1 client design (a Node stdlib `fetch` to `/v1/systemone`). Push-past with code: this iteration confirms that shape is the only one that fits a hook, because the Claude hooks are already Node processes (F5); a shell-out to the Python `jev-cli` is the only path that spawns. Its wire findings were not reopened; recorded as swe's.
- `mimo/`, `glm/`: no iteration file yet, so no cross-read.

## Findings

**F1 (new; answers angle question 1's advisor row). The advisor seam's real budget chain is 3,000 ms host → 2,500 ms child kill → 2,200 ms internal, and every failure returns `{}`.** The settings hook is the system-spec-kit shim (`settings.json:103-116`, timeout 3 s); the shim spawns the advisor implementation with `timeout: CHILD_TIMEOUT_MS` = 2,500 ms and `killSignal: 'SIGKILL'` (`SSK user-prompt-submit.ts:22`, `:109-117`), and passes the child `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS = 2,500 − 300 = 2,200` unless the operator overrode it (`:105-108`, `:23-24`). The advisor implementation's own default is `DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2,500` (`skill-advisor user-prompt-submit.ts:115`), overridden by that child env. On timeout or any child failure the shim prints `{}` and exits 0 (`SSK shim:118-145`) — the prompt continues with no advisor context. Base1 row 1's "child killed at 2500 ms, hook returns `{}`, advisor gets 2200 ms" is now line-by-line confirmed, including where the 300 ms margin goes. [SOURCE: .claude/settings.json:103-116; .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:22-24, :105-117, :118-145; .skilled/hooks/skill-advisor/claude/user-prompt-submit.ts:115; BASE1 row 1]

**F2 (new; answers angle question 1's compaction row). The PreCompact seam's internal budget is 1,800 ms under a 3,000 ms hook, deadline-driven, and optional work is skipped rather than overrun.** `HOOK_TIMEOUT_MS = 1800` with the comment "must stay under 2s hard cap" (`shared.ts:11-12`); the hook takes a monotonic deadline at entry (`compact-inject.ts:494`) and computes remaining time against it (`:237-239`); the merge pipeline logs its elapsed time against the budget (`:350-355`); the optional authored-continuity snapshot is skipped when the remaining time is below its floor and is spawned with `timeout = remainingMs(deadline)` when it does run (`:440-463`); enrichment reserves `PERSISTENCE_MARGIN_MS` (`:519-531`). A live model call placed on this path competes with the merge for the same 1,800 ms and inherits its skip semantics. BASE1 row 5's "1800 ms internal budget, 3 s hook" is confirmed. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts:11-16; .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:237-239, :350-355, :440-463, :488-497, :519-531; BASE1 row 5]

**F3 (new; answers angle question 1's routing row). The routing seams are CLIs a caller runs, not hooks, so they have no hook deadline and their fail-open behavior is the only contract.** `compiled-route.cjs` takes `--hub`/`--prompt`, prints one JSON decision or `{"servingAuthority":"legacy"}`, and every failure falls to the legacy sentinel (`:10-12`, `:40-48`); it is spawned on demand by a hub that carries the compiled-routing directive. `lookup-trigger-index.mjs` is a cold-Node synchronous lookup with exit codes 0/1/2 and a default 20-candidate cap (`:6-12`, `:40-43`). The main AI pays for both as tool calls — a `Read`-class cost, not a hook budget. A classifier `choice` over leaf resources would therefore be paid at the model's own turn boundary, and its competition is the deterministic scorer, not a clock. [SOURCE: .skilled/bin/compiled-route.cjs:10-12, :40-48; .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:6-12, :40-43]

**F4 (new; answers angle question 1's pruning row). A tool-output seam exists in the settings but nothing there rewrites output; the Bash matcher runs a 5 s audit and the Write|Edit matcher a 10 s quality pass.** `PostToolUse` at `settings.json:193`; `Write|Edit` matcher `:195-200` (timeout 10) and `Bash` matcher `:205-210` (timeout 5, the dispatch audit). Neither replaces tool output; the host contract for replacing output is what BASE1 row 38 leaves UNKNOWN. So the pruning seam's budget (if one were added) would be 5-10 s — ample for a local call — but its blocker is capability, not latency. [SOURCE: .claude/settings.json:193-210; BASE1 row 38]

**F5 (new; answers angle question 2, and it is the steer's split). Two call paths have different costs, and only one spawns.** The Claude hooks are already Node processes; a loopback HTTP request to Deem costs a connect plus the call — no process spawn — and a cold server refuses instantly. A shell-out (the Python `jev-cli`, or any helper) pays a spawn on top, and for `jev` that includes credential resolution and (on a miss) exit 3. Headroom arithmetic: advisor 2,200 ms budget vs connect + the measured p50 60.2-60.5 / p95 62.8-78.5 ms warm call (`LOCAL:34-38`), leaving >2.1 s; PreCompact 1,800 ms internal vs the merge's own unmeasured spend plus the same call; offline CLIs: no clock. The connect itself is unmeasured but bounded by loopback; the shell-out spawn is unmeasured (`LOCAL:50`). This is the measurement a live form must produce before it ships, and it is not the same number for the two paths. [SOURCE: `.skilled/hooks/skill-advisor/claude/user-prompt-submit.ts:303-325` (the CLI fallback is the spawning path); `SSK user-prompt-submit.ts:109-117`; `LOCAL:34-38`, `:50`]

**F6 (new; answers angle question 3). Rows 1 and 5 re-judged: the latency halves weaken for a Deem call; neither flips yet, and both keep an evidence gate.**

| Row | Why it was dropped | Under a local call | Verdict |
|---|---|---|---|
| 1, live advisor call | 2,500 ms child kill; 2,200 ms internal; a Jev call "cannot fit" inferred until a latency existed; revival requires R1 `keep` and a p95 that fits | A Deem fetch is connect + ~60-80 ms inside a Node process already alive; no spawn. 2,200 ms leaves >2.1 s. The kill and the margin are confirmed here (F1) | **partial flip:** the deadline half is removed for a Node-native Deem call; the evidence gate stays — R1 must still print `keep`, and the measured end-to-end p95 (connect included) must be recorded before any live form. The shell-out form of `jev` keeps the original drop |
| 5, live keep-or-drop in PreCompact | 1,800 ms internal; one reported 5.6 s Jev compaction (user report); the function-hook route is R19 | A Deem call fits the 1,800 ms only if the merge leaves room; the merge's spend is uncounted, and skipping optional work when the deadline is exhausted is built in (F2). The function-hook replacement remains R19's | **not flipped for the command hook** without the merge duration and a batch count; the precompute route (deepseek-08) is the better home. The egress half is removed, the deadline half is undecided |

[SOURCE: BASE1 rows 1 and 5; F1; F2; `LOCAL:34-38`]

**F7 (new; answers angle question 4). Rows 38 and 40 re-judged: neither rest on the deadline, so the local model does not flip either.** Row 38 (a PostToolUse filter on Bash output) rests on payload sensitivity and the UNKNOWN host capability of replacing tool output (F4), not on a deadline — the 5 s Bash hook is ample. A local backend removes the egress half but not redaction risk or the capability question. Row 40 (R3's cached advisor lane) rests on cache-hit rarity (3.6% exact repeats, seat-reported) and the 2,500 ms kill; with a cheap local call the cache buys even less, so the drop is confirmed for a different reason rather than reversed. [SOURCE: BASE1 rows 38 and 40; .claude/settings.json:204-211; F4; F5]

**F8 (new; answers angle question 5). The degrade path, per seam, with the cold case from the steer.** No backend or a cold/stopped server: advisor → shim returns `{}` after a refused-or-timeout fetch, prompt proceeds with no brief (F1); PreCompact → the classifier step is skipped and the merge proceeds under its remaining budget (F2); routing CLIs → legacy sentinel (F3); an offline script → its skip line and exit 0. An update's restart window is the cold case: `deem-ctl` stops the server, switches the symlink, restarts and smokes (`deem-ctl:160-173`), so a hook that calls during those seconds gets connection refused; the correct behavior is the same skip, never a retry loop inside the hook. None of these paths may return a default score or verdict. [SOURCE: F1-F5; `deem-ctl:160-173`; BASE2 section 11]

**F9 (new; answers the steer's open item from iteration 1). Probe frequency, caching and mid-session stop.** The probe runs once per feature run (offline) or once per session (live form), and its result is cached in-process only — never in a file, because a stale file cache is exactly the "cached true while the server is gone" failure. If the server stops mid-session, the next call is refused; that call's row is `unmeasured`, and the feature prints its skip line on the following probe. No path defaults a value. This is the same lifecycle the Jev gate already uses (once per run/session; no persistent cache). [SOURCE: BASE2 section 11; F1-F5]

**F10 (new; answers the steer's gate-reuse instruction). The gate restated with the allowlist and the pin, using the tested reference.** Pass condition: HTTP 200 within the budget, JSON object, `status == "ok"`, `backend` parses as `torch` or `ensemble:*` with no `stub` substring, and `model == "deem-0.8-v1"`. `deem-ctl`'s own rule is the allowlist (`:59-66`); the model pin is this lineage's addition (iteration 2, N-deepseek-02-2), because the id string does not change across commits while the weights do (`deem_server.py:772-777`; steer note on `models/current`). The probe's `curl -m 2` equivalent must fit the 2,200 ms advisor / 1,800 ms PreCompact budgets with the reserve of F5. [SOURCE: `deem-ctl:59-66`; `deem_server.py:270`, `:772-777`; F1; F2]

## Per-Idea Records

### N-deepseek-04-1: The two-path budget rule for any live form

- **Idea:** A live classifier form may ship only with a measured end-to-end latency on the path it will use — Node-native connect+call for hooks, shell-out spawn+call for scripts — and only when that p95 fits the seam's budget after its own spend and reserve (advisor 2,200 ms; PreCompact 1,800 ms; PostToolUse 5-10 s; offline no clock). A spawn-path number cannot be reused for a hook form and vice versa.
- **Question:** C, H.
- **Builds on:** F5; the steer's split; BASE1 rows 1, 5.
- **Value:** The revival rules price a live form with the right number; no form is revived on a spawn-included p95 it will not pay.
- **Seam:** F1/F2 budgets; the future arm's timing print.
- **Metric, baseline, harness:** Metric: p95 of connect+call from inside a Node hook process; baseline: warm p50 60.2-60.5 / p95 62.8-78.5 (`LOCAL:34-38`), connect UNKNOWN; harness: the probe fixture timing 100 loopback calls from a Node script, and the arm's own header line.
- **Savings:** Enables decisions to revive or kill live forms on evidence; no token saving itself.
- **Cost, latency, privacy:** The call is local; the measurement costs one loopback run.
- **Two-backend gate:** Applies to Deem forms via the F10 probe; Jev forms keep BASE2's shell gate and pay the spawn path.
- **Rough LOC:** ~20 lines in the harness; 0 in production until a form ships.
- **Verdict:** **build-now as a measurement rule** (the harness belongs to whatever arm revives a live form).
- **Confidence:** Confirmed: the budgets and the path split. Inferred: that connect stays in single-digit milliseconds (unmeasured).

### N-deepseek-04-2: PreCompact live work goes off the critical path or nowhere

- **Idea:** Any classifier work on the compaction seam ships only as the `precompute` form (off the critical path, result cached for the coming compaction) or behind `remainingMs(deadline, reserve)` with skip-on-exhaustion; never on the merge's 1,800 ms as an unconditional step.
- **Question:** C, G.
- **Builds on:** F2; BASE2 R19's function-hook route; deepseek-08's angle.
- **Value:** Keeps the merge pipeline's budget independent of a model call; the compaction brief never degrades because the server is slow.
- **Seam:** `compact-inject.ts:440-463`, `:488-497`, `:519-531`; the precompute trigger (deepseek-08).
- **Metric, baseline, harness:** Metric: merge elapsed p50/p95 with and without the step; baseline: UNKNOWN (the hook logs its own elapsed at `:350-355` but no count exists); harness: the R19 census's per-boundary timings.
- **Savings:** Avoids a regressed compaction brief; the classifier's own saving stays R19's question.
- **Cost, latency, privacy:** Precompute moves the call earlier and local; no egress.
- **Two-backend gate:** Deem probe (F10) at precompute time; if it fails, the stock path is untouched. Jev only with a key and the same skip.
- **Rough LOC:** ~40-80 in the future arm; 0 now.
- **Verdict:** **next** (design constraint for R19's live form; not a standalone build).
- **Confidence:** Confirmed: the budget mechanics. Inferred: that the precompute result still applies at compaction time (deepseek-08 settles).

### N-deepseek-04-3: Row 1's revival measurement is connect+call, and R1 remains its gate

- **Idea:** Restate row 1's revival rule: a live advisor form returns to review only when R1 prints `keep` **and** the measured p95 of the Node-native connect+call fits the advisor's remaining budget (2,200 ms minus the advisor's own spend); the shell-out form stays dropped.
- **Question:** C, H, B.
- **Builds on:** F6; BASE1 row 1's revival rule.
- **Value:** Prevents reviving a live form on a spawn-included number it will never pay, and prevents reviving it on speed alone while R1's evidence is missing.
- **Seam:** `skill-advisor user-prompt-submit.ts:303-325`; `SSK shim:105-117`.
- **Metric, baseline, harness:** As N-deepseek-04-1, plus R1's keep rule.
- **Savings:** Guards the R1 decision.
- **Cost, latency, privacy:** Local; the measurement is one loopback run.
- **Two-backend gate:** Deem preferred (local); Jev form remains dropped on its own gate.
- **Rough LOC:** 0 (a doc-time clause).
- **Verdict:** **build-now as gate text.**
- **Confidence:** Confirmed from the budget chain.

### Dropped: an advisor result cache under a local backend (row 40)

- **Idea:** Build R3's cached advisor lane to avoid repeat calls.
- **Reason:** The drop already stands (3.6% exact repeats); with a local call of ~60-80 ms the cache saves less than it costs to keep correct. Confirmed drop, new reason.
- **Confidence:** Confirmed from BASE1 row 40 and F5.

### Dropped: a classifier PostToolUse output filter now (row 38)

- **Idea:** Put a `choice`/`noul` filter on Bash output in the 5 s PostToolUse hook.
- **Reason:** The blocker is capability (can a command hook replace output — UNKNOWN) and redaction, not the clock; the deterministic filter is the first step regardless. Dropped as a classifier-first idea.
- **Confidence:** Confirmed from F4 and BASE1 row 38.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| Advisor budget chain 3,000/2,500/2,200 with the 300 ms margin and `{}` fail-open | confirms BASE1 row 1 with code lines | settings `:103-116`; shim `:22-24`, `:105-117`, `:118-145` |
| PreCompact internal 1,800 ms, deadline-driven, skip-on-exhaustion | confirms BASE1 row 5 with code lines | `shared.ts:11-16`; `compact-inject.ts:237-239, :440-463, :488-531` |
| Routing seams are CLIs with no hook deadline; fail-open sentinel | **new** | `compiled-route.cjs:40-48`; `lookup-trigger-index.mjs:6-12` |
| PostToolUse budgets exist (10 s / 5 s) but neither rewrites output | new | settings `:193-210`; BASE1 row 38 |
| Two call paths (connect vs spawn) and the per-path headroom rule | new | F5; steer; `LOCAL:34-38`, `:50` |
| Rows 1 and 5 partial-flip analysis; rows 38 and 40 no-flip | new analysis over restated rows | F6; F7 |
| Probe frequency/caching/mid-session stop answered | new | F9 |
| Gate restated as allowlist + pin | corrects iteration 1 per steer; confirms deem-ctl's rule with code | `deem-ctl:59-66`; `deem_server.py:270`, `:772-777` |
| Jev gate | restated (BASE2 §11) | BASE2 section 11 |

## Hand-off

- deepseek-05: the flips named here (rows 1 and 5 partial) are the seam-side inputs; check them against contracts and callers.
- deepseek-08: build the precompute/cold-start design on F2 and N-deepseek-04-2; the restart window is the cold case.
- deepseek-09: F8's degrade path and N-deepseek-04-1's per-path numbers feed the failure table.
- deepseek-10: 002's R1 amendment must adopt N-deepseek-04-3's clause; 005's compaction arm must adopt N-deepseek-04-2.

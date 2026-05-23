---
round: 1
seat: seat-004
executor: simulated-deep-research-vantage
lens: critical (failure-mode)
status: returned
timestamp: 2026-05-23T17:14:00.000Z
simulated: true
---

# Seat 004 — FAILURE-MODE (Critical Lens, simulated @deep-research vantage)

## Mandate

Adversarial scenario analysis on every dispatch path. Pre-mortem the arc execution. Identify what would cause the arc to *not converge* even with the operator's "no stopping" directive intact.

## Proposed Plan

### Q1: Phase ordering

**Order by failure-blast-radius, ascending:** 002b → 003 → 009 → 006 → 008 → 005 → 007 → 004 → 010 + convergence.

Rationale (smallest-blast-first):
- **002b** (3 doc edits) — blast radius: zero, docs-only. Failure = retry mechanical edit.
- **003** (codex agents mirror) — blast radius: 12 new TOML files in `.codex/agents/`. Failure = git rm. Investigation gate caps risk.
- **009** (cascade thresholds) — blast radius: 1 TS file + 1 new test. Defaults preserved; additive only.
- **006** (cocoindex P1 Python) — blast radius: 4 Python files. Different runtime from spec-memory; isolated.
- **008** (rerank-sidecar) — blast radius: 1 new shell config + 3 modified scripts. Sourced-by pattern is well-understood.
- **005** (spec-memory P1) — blast radius: 4 TS files in shared/embeddings + cross-encoder.ts. Touches auto-select.ts cascade. Bench-diff recommended per plan.
- **007** (code-graph P1) — blast radius: 1 new config file + 6 callers. Graph behavior depends on edge weights. Bench-diff recommended per plan.
- **004** (skill-advisor 4-wave) — blast radius: 6+ files in system-skill-advisor. Scorer behavior risk. Largest blast.
- **010** (ADRs + validator) — blast radius: docs + 1 script. Low code risk but operator-approval gate.

Doing the highest-blast-radius phase (004) late means the prior 7 phases serve as a calibration corpus for "is cli-opencode working today?" If 002b through 008 ship cleanly, 004 inherits confidence. If any of 005 or 007 hit problems, we adapt the 004 dispatch.

**This contradicts VELOCITY's "do 004 wave 1 second."** I argue against: doing 004 second exposes the biggest blast radius before we have any session calibration. If wave 1 fails because deepseek-v4-pro is misbehaving today, we don't know it's the model — we attribute to prompt quality and re-spin, burning hours.

### Q2: cli-opencode + deepseek-v4-pro risk mitigation

I treat each dispatch as a 4-phase risk surface: **PRE-DISPATCH / DURING-DISPATCH / IMMEDIATELY-POST-DISPATCH / SUBSEQUENT-PHASE-IMPACT.**

**PRE-DISPATCH:**
1. `opencode providers list` — credit gate
2. `git rev-parse HEAD` + `git status --porcelain` — baseline
3. **Pre-read the dispatched-prompt's referenced files** (this is the gap RISK-AVERSE missed and ARCHITECTURE covered): if the prompt cites `fusion.ts:41-42`, Read that exact range to confirm lines + content match. Per memory `feedback_cli_devin_bundle_verification.md` + `feedback_bundle_gate_smoke_run.md`, dispatched models hallucinate line numbers + plausible function names. Pre-reading catches this at compose-time.
4. **Smoke-test the prompt's verification command** locally before dispatch: if prompt says "`rg -n '0\.8|0\.35' scorer/ → expect 0 hits post-dispatch", run the rg now to confirm baseline shows the expected non-zero count. Catches stale assumptions about file state.
5. Compose prompt; CLEAR ≥ 40/50

**DURING-DISPATCH:**
- One signal: silent process. `ps -o pid,pcpu,rss -p $PID` every 60 sec for first 5 min, every 5 min thereafter.
- If CPU stays at 0% for >180 sec after dispatch start: hung. SIGKILL.
- If RSS grows >2 GB: thermal risk per memory `feedback_deep_loop_iter_one_at_a_time.md`. SIGKILL.

**IMMEDIATELY-POST-DISPATCH:**
1. `wait_pid <PID>` returned (or background process completed)
2. `git diff --stat` shows ≥ expected file count
3. `git diff` first 200 lines look reasonable on spot-Read
4. `npm run typecheck:root` exit 0
5. New vitest invariant: pass
6. Ban-list grep: 0 hits in changed files

**SUBSEQUENT-PHASE-IMPACT:** before next dispatch:
7. `git log --oneline -5` shows the commit landed in expected order
8. Spec.md status field updated by main agent (this is OK to defer until phase finalize but check now)

Total post-dispatch: ~3 min. Pre-dispatch: ~10 min. Per-dispatch overhead: ~15 min.

Phase 004 wave granularity:
**3-dispatch sequence: wave 1 ONLY → verify → waves 2+3 → verify → wave 4.**

Rationale:
- Wave 1 is the 14 P0 closure — must be verified independently. Bundling with wave 2 makes wave 1 verification noisier.
- Waves 2+3 are tightly coupled (RoutingCalibration interface ↔ env-var overrides), bundle them.
- Wave 4 (prompt-policy externalization) is a JSON format invention. Separate dispatch lets deepseek-v4-pro start with a fresh context.

This is the most failure-resistant decomposition. Trade-off: 2-3 extra dispatch overhead vs single atomic. With 14 P0 at stake, the insurance is worth it.

### Q3: Phase 010 ADR-B handling

**Option (c) with operator escape hatch:** Separate amendment ADR (ADR-B-as-new-doc), BUT if operator vetoes, fall through to option (a) in-place edit per plan default.

Failure-mode reasoning:
- (a) in-place: failure mode = future ADR readers see edits that don't match the original ADR's narrative. Hard-to-detect quality regression on an arc whose stated goal is *making drift impossible*.
- (b) supersession: failure mode = downstream code/docs citing ADR-013/014 must learn to follow the supersession chain. Network effect cost. Reject.
- (c) separate amendment: failure mode = readers don't find the amendment when they read 013/014. Mitigate with a one-line cross-link in 013/014 (5-line edit, not a content change).

The hybrid that ARCHITECTURE proposes (option a + amendment header inside 013/014) is the failure-mode-equivalent of (c). I accept it as a viable alternative if operator prefers in-document amendment.

Either way: ADR-B's text is the same. Only the home-document changes. Operator picks before phase 010 dispatch.

### Q4: Convergence gate strength

Original 6 + 3 additions, but framed adversarially: each addition is justified by "what fails if we skip this?"

- (a) memory_index_scan + code_graph_scan refresh: **what fails:** post-arc resume context lacks new packets; future operator runs `/spec_kit:resume` and sees stale graph. Real failure. Gate it.
- (b) Reranker memory entry update: **what fails:** stale memory says jina-reranker-v3 is production default; future operator queries memory and gets wrong answer; new packets cite the wrong reranker. Real failure. Gate it.
- (c) validate-doc-model-refs.js dry-run on ALL changed docs: **what fails:** phase 010 ships validator + tests it on a subset; if convergence skips a full-arc dry-run, future doc drift slips through. Real failure. Gate it.

I disagree with VELOCITY's "don't add" and partially disagree with ARCHITECTURE's "skip (c)." The validator dry-run on full arc is a 30-second job that catches the exact failure mode the arc is supposed to prevent.

6 + 3 = 9 gates. Adds ~15 min to convergence. Within plan budget if convergence runs 30-45 min total.

### Q5: Failure-mode plan

Granularity: **dispatch boundary > file > phase > arc.**

The key insight: define rollback granularity by *what was atomically attempted*, not by file structure. A single cli-X dispatch is the atomic unit — even if it touched 6 files. If 2 of 6 files dispatched cleanly and 4 reverted silently, the entire dispatch should be re-dispatched (not partially salvaged), because the partial state is undetectable from spec.md.

State-of-truth chain:
1. **`git diff` against the dispatch's baseline commit** — primary. Captures exactly what changed in this dispatch.
2. **`/tmp/<phase>-out.log` parsed for file paths claimed** — secondary. Compare claimed-vs-actual.
3. **`npm run typecheck:root` exit code** — tertiary. Confirms no orphan imports (which would indicate partial revert).
4. **New vitest pass** — quaternary. Confirms semantic preservation.

If claimed-vs-actual mismatches: silent revert detected. Per memory `feedback_cli_dispatch_unreliability.md`, this is real and happens under parallelism > 3. Even at strict single-dispatch, deepseek-v4-pro under variant=high has been observed to silently drop edits when the prompt is too large.

Mitigation: **dispatch-internal redundancy.** Have the prompt require dispatched output to include a "FILES_TOUCHED:" trailer with explicit paths. Main-agent post-dispatch parses this trailer + cross-checks with `git diff --name-only`. Mismatch = silent revert = redispatch with reduced scope.

Partial-revert detection 5-point checklist (per ARCHITECTURE) is correct but missing the 6th: **FILES_TOUCHED trailer parse vs git diff.** Add it.

### Q6: Phase 004 wave-1-vs-wave-2

**Wave 1 alone is the safe shippable unit.** Rationale matches RISK-AVERSE:
- 14 P0 = arc-blocking priority
- Closing wave 1 = arc unblocks
- Waves 2-4 close P1/P2 = nice-to-have

**However:** the prompt should not encourage stopping at wave 1. Dispatch with all 4 waves in CRAFT prompt; let deepseek-v4-pro execute them sequentially with the existing HALT-on-failure bundle gate. If it gets all 4 done: full 004 closure. If wave 1 succeeds and wave 2 fails: scope-split to 004a + 004b post-hoc.

Pre-dispatch decision: **single dispatch, all 4 waves, with bundle gate halts.** Post-hoc decision based on what actually shipped.

This contradicts my Q2 above (3-dispatch sequence). I keep both options on the table:
- **Option Q6.1:** All 4 waves in one dispatch, post-hoc scope split if partial.
- **Option Q6.2:** 3-dispatch sequence (wave 1 / waves 2+3 / wave 4) — pre-committed split.

Operator picks at phase 004 setup. I weakly prefer Q6.2 for the calibration value (each dispatch gives signal on cli-opencode reliability today).

## Reasoning

The arc's failure modes cluster around 3 risks: (a) cli-opencode dispatch failures (silent revert, credit gate, hang), (b) ADR-B edit destroying audit trail, (c) convergence claiming closure when validator hasn't dry-run.

Order-by-blast-radius does the most to limit (a)'s impact. Each successive phase calibrates whether cli-opencode is functioning today. By the time we hit phase 004 (largest blast), we have 7 phases of empirical signal.

The arc has shipped 2 phases via main-agent direct (no cli-X dispatch). The remaining 8 mix cli-devin and cli-opencode. The cli-opencode subset (004, 005, 007) is the risk concentrate. Treating them with extra preflight ceremony + small-blast-first ordering is the right discipline given operator's "no stopping" constraint.

## Risks & Trade-offs

- Order-by-blast-radius pushes 004 to phase 9-of-10. If 004 fails late and we have to scope-split, we've already shipped 7 phases — coordination cost on post-hoc scope split is real. Trade-off accepted because failing 004 at phase 2 with no calibration is worse.
- 6-point partial-revert detection (5 + FILES_TOUCHED trailer) requires the dispatched prompt to include the trailer convention. Add to CRAFT skeleton. ~5 line cost per prompt.
- 9 convergence gates is the upper bound. ARCHITECTURE's 8 is also defensible. Trade-off accepted for catching the doc-drift failure mode.

## Assumptions and Evidence Gaps

- Assume each cli-opencode dispatch overhead is 10-15 min preflight + 30-180 min dispatch + 3 min post-dispatch. For the 3 deepseek-v4-pro phases (004, 005, 007), that's ~45 min overhead total. Within reason.
- Assume FILES_TOUCHED trailer convention works under deepseek-v4-pro. Untested. If model refuses, fall back to plain `git diff --stat` check.
- Assume the operator's "no stopping" directive means "no operator-side stops"; mid-dispatch automated SIGKILLs on credit-401 are still allowed. Reasonable inference.

## Alternative Challenged

VELOCITY argues "minimum preflight (3 commands)." I challenge: SWE-1.6 and deepseek-v4-pro both have documented hallucination patterns (`feedback_cli_devin_bundle_verification.md`, `feedback_bundle_gate_smoke_run.md`). Skipping the pre-read of cited files saves 1-2 min and risks dispatching against ghost code that doesn't exist as cited. Pre-read is mandatory.

## Confidence

**78/100** — High on Q5 (FILES_TOUCHED trailer + 6-point detection), Q2 (4-phase risk surface), Q4 (9 gates). Medium-high on Q1 (blast-radius order is failure-mode-optimal but conflicts with VELOCITY's session-length-optimal; operator picks). Medium on Q3 (option c with escape hatch; can be a + amendment header per ARCHITECTURE). Medium on Q6 (deferred to operator pick between Q6.1 and Q6.2).

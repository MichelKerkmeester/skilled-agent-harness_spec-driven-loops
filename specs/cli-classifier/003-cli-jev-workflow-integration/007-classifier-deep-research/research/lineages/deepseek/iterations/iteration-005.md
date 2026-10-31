---
title: "Iteration 5 — deepseek-05: The flip set, seam side: frozen contracts and callers"
trigger_phrases: []
---

# Iteration 5 — deepseek-05: The flip set, seam side

## Focus

Angle **deepseek-05** (W2): *The flip set, seam side: frozen contracts and callers.* Maps to question B; answers angle questions 1 to 5. Wave 2: sibling files were read first (Sibling check), and the steer corrections from iteration 4 remain in force.

## Actions Taken

1. Read `grok/iterations/iteration-004.md` (the flip-set angle) as the newest sibling on question B.
2. Searched callers and owners for each flip seam: `rg` over `.skilled/`, `.claude/`, `.opencode/`, `.hermes/` for the advisor chain, `compiled-route`, the retrieval CLI and the hook settings.
3. Opened the advisor contract doc (`system-skill-advisor/hooks/skill-advisor-hook.md:38`, `:123`), the shim test (`SSK runtime/tests/user-prompt-submit-shim.vitest.ts:9`), the advisor hook test (`system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:11`, `:123`) and the OpenCode plugin test (`.opencode/plugins/tests/system-skill-advisor.test.cjs:580`).
4. Opened the compiled-route consumer: `system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33`, `:47` (the advisor's `enrichCompiledRoutes()` shells out to `compiled-route.cjs`).
5. Opened the retrieval consumers: `SSK/ARCHITECTURE.md:126`, `:154`, `runtime/data/README.md:17`, and four agent docs that run `lookup-trigger-index.mjs` (e.g. `.skilled/agents/review.md:98`).
6. Opened the receiving phase's frozen text: `../002-advisor-jev-tiebreak-arm/spec.md:35`, `:87`, `:92`, `:102`, `:108-112`.
7. No file was executed; no backend was called.

## Sibling check

- `grok/iterations/iteration-004.md` (its iteration 4, W2): its reason-class table (72 rows, none flip) and its refusal N-grok-04-1. **Contest, by code:** its row-1 revival test uses "spawn-included p95"; the Node-native Deem path spawns no client (iteration 4 F5), so for that path the right metric is connect+call, not spawn+call. **Agreement with new evidence:** no live form revives tonight — the connect+call p95 does not exist either, and `002/spec.md:92` freezes the exclusion meanwhile (F6). Its counts are quoted as grok's own; I did not re-derive its 72-row classification.
- `grok/iterations/iteration-006.md`: design routing; no seam claim to check.
- `swe/iterations/iteration-001.md`: the client design; its Node-stdlib shape is the one the two-path rule favors (iteration 4 F5). No contest.
- `mimo/`, `glm/`: no iteration file yet.

## Findings

**F1 (new; answers angle question 1). Frozen contracts, owners and callers, seam by seam, found by search.**

| Seam | Frozen contract | Owner | Callers / pins found by search |
|---|---|---|---|
| Advisor (row 1) | stdout JSON `{}` fail-open on any failure; child kill 2,500 ms SIGKILL; child env budget 2,200 ms; `DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500` | `system-skill-advisor` (hook logic) + `system-spec-kit` (shim) | `.claude/settings.json:109` runs the shim; the constant is asserted in a shim test (`user-prompt-submit-shim.vitest.ts:9`), an advisor test (`claude-user-prompt-submit-hook.vitest.ts:11`, `:123`) and an OpenCode plugin test (`system-skill-advisor.test.cjs:580`); the Pi mirror uses the same env var (`hooks/pi/prompt-advisor.ts:194`, `:262`); documented at `skill-advisor-hook.md:38` |
| PreCompact (row 5) | 3,000 ms hook; internal `HOOK_TIMEOUT_MS = 1800`; skip-on-exhaustion for optional work | `system-spec-kit` hooks | `.claude/settings.json:215-222`; consumed by `compact-inject.ts` only |
| Leaf/skill routing | Legacy sentinel `{"servingAuthority":"legacy"}` on any failure; never surfaced as a decision | `system-skill-advisor` (consumer) + `bin` (front door) | The advisor itself: `enrichCompiledRoutes()` shells out per eligible hub (`advisor-recommend.md:33`, `:47`); hubs with the compiled-routing directive |
| Retrieval lookup | Cold-Node synchronous; exit 0/1/2; 20-candidate default | `system-spec-kit` | Agent docs (e.g. `.skilled/agents/review.md:98`) and the Gate 1 protocol; writer/reader pairing at `ARCHITECTURE.md:126`, `:154` |
| PostToolUse pruning (row 38) | No output-rewriting contract exists | dispatch hooks (audit only) | `.claude/settings.json:193-210` |

[SOURCE: `.claude/settings.json:109`, `:193-210`, `:215-222`; `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:38`, `:123`; `.skilled/skills/system-spec-kit/runtime/tests/user-prompt-submit-shim.vitest.ts:9`; `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:11`, `:123`; `.opencode/plugins/tests/system-skill-advisor.test.cjs:580`; `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33`, `:47`; `.skilled/skills/system-spec-kit/ARCHITECTURE.md:126`, `:154`; `.skilled/agents/review.md:98`]

**F2 (new; answers angle question 2). Which flips would need a deadline change or a new hook, and why the parent's decisions do not cover them.** Changing the advisor budget is not a one-line edit: the 2,500 ms constant is asserted in two test files and one plugin test, and the 2,200 ms env budget is documented in the hub's own hook contract — so raising the kill to fit a shell-out `jev` call touches five surfaces. A PostToolUse output filter needs a hook that rewrites tool output, a host capability BASE1 row 38 leaves UNKNOWN and no Planned phase owns. Both would need their own phase and an operator decision; D1/D2/D3 authorize neither. A live advisor form also contradicts `002/spec.md:92` today ("Any live, served or hook-time Jev call in the advisor"), which is exactly what deepseek-10 must amend for the two-backend gate. [SOURCE: F1 pins; `../002-advisor-jev-tiebreak-arm/spec.md:92`; BASE1 row 38; `goal.md:49` (D1-D3)]

**F3 (new; answers angle question 3). No survivor in my flip set replaces a repository fact with a judgment, and two deterministic surfaces must stay so.** The advisor's fused scorer and the compiled router are deterministic; the compiled-route consumer refuses the legacy sentinel rather than surfacing it (`advisor-recommend.md:33`), and iteration 3's forbidden set (every mechanical validator rule, `AC_CLOSURE`, the save contracts) stands. A classifier form may sit beside them as an advisory or an offline census; it must not become the picker inside the hook. [SOURCE: `advisor-recommend.md:33`, `:47`; iteration 3 F7; iteration 4 F3]

**F4 (new; answers angle question 4). The failure path under Deem, per survivor, is one skip line and no state change.** For the R1 arm (offline, switch `--jev` per `002/spec.md:87`): refused connection or stub probe → the arm prints its skip line and the census output stays byte-identical; a slow first call (cold start ≈10 s, `LOCAL:44`) fails the probe and skips; a mid-run stop makes that row `unmeasured`. For R19's future precompute form: no server → the stock summary path is untouched; a mid-run stop leaves the cached precompute stale and unused. For an advisory sibling (iteration 3): `advisory skipped: no classifier backend`, exit 0. The pattern is uniform and already frozen by BASE2 section 11 for the Jev half. [SOURCE: `../002-advisor-jev-tiebreak-arm/spec.md:87`; `LOCAL:44`; iteration 3 F8; iteration 4 F8; BASE2 section 11]

**F5 (new; contest and push-past on grok-04). The flip set does not shrink; its trigger condition changes shape.** grok-04 ends at "no row flips because spawn-included p95 is unmeasured." This iteration keeps the no-revival outcome but splits the condition: for a Node-native client the measurable number is **connect+call** (no spawn), and for a shell-out — the Python `jev-cli` — it stays spawn-included. A single "spawn-included" bar would kill a form that never spawns and pass a form that does. The agreed next artifact is one measured connect+call p95 from inside the advisor process, which nobody has produced. [SOURCE: `grok/iterations/iteration-004.md` (its N-grok-04-1); iteration 4 F5, F6; `LOCAL:34-38`, `:50`]

**F6 (new; answers angle question 2's contract half, from the receiving phase). `002` already froze the row-1 exclusion in its own spec text, so a flip is an amendment, not a default.** `spec.md:92` excludes "any live, served or hook-time Jev call in the advisor" on the 2,500 ms kill; `:35` records the census-and-arm handoff; `:87` puts the census behind `--jev`. Any Deem live form inherits that exclusion until the synthesis rewrites the clause for two backends (deepseek-10's job). [SOURCE: `../002-advisor-jev-tiebreak-arm/spec.md:35`, `:87`, `:92`, `:108-112`]

**F7 (new; a headroom fact the seam table did not have). The advisor budget is not idle: the advisor itself already shells out to the compiled router inside its own 2,200 ms window.** `enrichCompiledRoutes()` runs `.skilled/bin/compiled-route.cjs --hub <skillId> --prompt <prompt>` for eligible recommendations and attaches the parsed result, silently omitting it on a legacy sentinel or subprocess failure (`advisor-recommend.md:33`). So any added call competes with that work, and the "2.1 s of headroom" of iteration 4 F5 is an upper bound before the advisor's own spend. The measurement of F5 must therefore be taken with the advisor's normal path in place, not in a bare process. [SOURCE: `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33`, `:47`; iteration 4 F1, F5]

**F8 (new; answers angle question 5, the contract side). The seam contracts leave exactly one flip alive, conditionally: row 1 under the Node-native path, gated by R1 and a measured p95; every other candidate is contract-blocked.** Row 5 stays blocked for the command hook (merge spend uncounted; precompute route owns the live form). Row 40 stays dropped (F5 of iteration 4; cheaper local calls make a cache less valuable). Row 38 stays blocked (capability). Rows 44, 69, 72 are grok-04's class (latency/egress with standing non-latency reasons) and were not reopened here. [SOURCE: iterations 4 F6-F7; `grok/iterations/iteration-004.md`; F2-F7]

## Per-Idea Records

### N-deepseek-05-1: The seam-side flip gate as contract text

- **Idea:** Any flip passes three checks before a build phase: (a) the seam's frozen contract permits the call without a deadline or hook addition (F1), (b) the form uses the path its measurement covers (Node-native vs spawn), and (c) the receiving phase's own text is amended, not bypassed (F6).
- **Question:** B, H.
- **Builds on:** F1-F7; grok-04's refusal; BASE1 rows 1/5.
- **Value:** The synthesis can accept or reject a flip on named contracts and owners rather than on the speed number alone.
- **Seam:** F1 table; `002/spec.md:92`; `005`/`006` equivalents when their flips surface.
- **Metric, baseline, harness:** Metric: each flip names its contract line and its measurement path; baseline: none — the flip set was argued without contracts. Harness: a checklist read, no code.
- **Savings:** Prevents a build on the wrong number; no token saving itself.
- **Cost, latency, privacy:** None.
- **Two-backend gate:** Applies to Deem flips via the F10 probe (iteration 4); Jev flips keep the shell gate and their own revive rules.
- **Rough LOC:** 0 (doc-time).
- **Verdict:** **build-now as gate text.**
- **Confidence:** Confirmed from the opened contracts.

### N-deepseek-05-2: `002`'s exclusion line amended for the two-path rule

- **Idea:** Replace `002/spec.md:92`'s blanket "no live, served or hook-time call" with: no live form until R1 prints `keep` and a connect+call p95 measured from inside the advisor process (with its normal compiled-route work in place) fits the 2,200 ms budget after spend; the shell-out `jev` form stays excluded.
- **Question:** B, H.
- **Builds on:** F6; iteration 4 N-deepseek-04-3.
- **Value:** The Phase 002 amendment the synthesis must make is written now, with the measurement defined.
- **Seam:** `../002-advisor-jev-tiebreak-arm/spec.md:92`; shim constants at `SSK user-prompt-submit.ts:22-24`.
- **Metric, baseline, harness:** As N-deepseek-04-1; harness times the advice path with `enrichCompiledRoutes()` active.
- **Savings:** Guards the decision; no direct saving.
- **Cost, latency, privacy:** Local measurement only.
- **Two-backend gate:** Deem first (local, cheap); Jev form stays excluded unless its own spawn-included number and a deadline change arrive.
- **Rough LOC:** 0 (amendment text).
- **Verdict:** **build-now as amendment text** (deepseek-10 carries it into the phase).
- **Confidence:** Confirmed from the frozen text and the budget chain.

### Dropped: raising the advisor child kill or the PreCompact budget to fit a shell-out call

- **Idea:** Widen the 2,500 ms kill or the 1,800 ms internal budget so a spawning `jev` call fits.
- **Reason:** The constants are test-pinned on three surfaces and documented in the hub contract (F1-F2); no parent decision authorizes a deadline change, and the Node-native path removes the need. Dropped.
- **Confidence:** Confirmed from the pins.

### Dropped: a classifier as the deterministic router's replacement

- **Idea:** Let a Deem `choice` pick the leaf/handler where `compiled-route` or the fused scorer picks today.
- **Reason:** Both are deterministic and their failure modes are frozen (legacy sentinel; fused order); replacing them is iteration 3's forbidden seat and grok-06's refused idea. Dropped.
- **Confidence:** Confirmed from `advisor-recommend.md:33` and iteration 3 F7.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| Frozen-contract / owner / caller map per flip seam | **new** | F1 (all lines above) |
| The advisor constant is test-pinned on three surfaces and documented in the hub contract | new | `user-prompt-submit-shim.vitest.ts:9`; `claude-user-prompt-submit-hook.vitest.ts:11`, `:123`; `system-skill-advisor.test.cjs:580`; `skill-advisor-hook.md:38` |
| The advisor already shells out to the compiled router inside its budget | new | `advisor-recommend.md:33`, `:47` |
| `002/spec.md:92` already freezes the row-1 exclusion | new (receiving-phase text) | `002/spec.md:92` |
| Flip gate as three contract checks; one conditional flip (row 1, Node path) | new | F8; N-deepseek-05-1 |
| Contest of grok-04's spawn-included bar; agreement on no revival | contests a sibling with code | `grok/iterations/iteration-004.md`; iteration 4 F5 |
| Jev gate | restated (BASE2 §11) | BASE2 section 11 |

## Hand-off

- deepseek-06: the `custom` provider's failure side; the shell-out path it designs is the one that spawns, so it inherits the excluded form.
- deepseek-08: precompute is the only live compaction route per F8; check the host trigger before designing.
- deepseek-09: F4's per-survivor failure lines go into the two-backend failure table.
- deepseek-10: N-deepseek-05-2 is the exact 002 amendment; 005 gets the precompute constraint, 006 the advisory-not-gate rule.

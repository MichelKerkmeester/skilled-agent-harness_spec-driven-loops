---
title: "Iteration 3: The goal hook and compaction, the wiring"
trigger_phrases: []
---
# Iteration 3: The goal hook and compaction, the wiring

**Angle:** deepseek-03 · **Lens:** integration engineer · **Jev package under study:** Python `jev-cli` 0.6.2

## Focus

What would a Jev verifier in the goal hook and a Jev keep-or-drop pass at compaction each plug into, across the Claude, OpenCode and Pi surfaces, inside their deadlines? Hand-off target: per surface, whether a call fits the deadline, which runtime lacks the seam, and the degrade path each needs.

## Actions Taken (opened this iteration)

- `.skilled/hooks/goal/lib/goal-core.cjs:30-70`, `:560-660` (verifier, constants)
- `.skilled/hooks/goal/pi/goal-context.ts:200-250`
- `.skilled/hooks/goal/goal-plugin.md:1-60`
- `.skilled/plugins/opencode-goal.js` (verifier constants and mode selection: `:49`, `:71-78`, `:134`, `:179`, `:227-302`)
- `.skilled/hooks/goal/README.md:40-120` (surface table)
- `.skilled/hooks/goal/cursor/goal-inject.mjs` and `devin/goal-inject.mjs` (verifier grep: only an injection-only comment at cursor `:11`)
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:130-175`, `:300-360`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts:1-40`
- `R/jev-cli-main/plugin/hooks/fast-jev.ts:60-140`, `:180-290`
- `R/jev-cli-main/src/vendor/compaction/compact.ts:15-40`, `:100-120`

## Per-Idea Records

### Idea 3.1 — A `jev` supervisor verifier on the OpenCode goal plugin (and optionally Pi)

| Field | Content |
|---|---|
| **Idea** | Add `'jev'` to the goal plugin's verifier modes; the verifier asks one `choice` (`met` / `not_met` / `blocked`) over the goal objective plus the latest evidence text. |
| **Value** | Replaces or second-rates a regex supervisor whose `met` verdict is a fixed 0.72 (`goal-core.cjs:619`) and whose ambiguous cases stay `unclear`; an opt-in numeric judge can settle `unclear` with a probability the operator can threshold. |
| **Seam** | `.skilled/plugins/opencode-goal.js:71-72` (`VERIFIER_ENV`), `:134` (`VALID_VERIFIER_MODES = {heuristic, llm}`), `:249` (mode read), `:302` (`defaultSupervisorVerifierForMode`). Pi equivalent: `goal-context.ts:230` calling `core.verifyGoalHeuristic`, output consumed at `:233-239`. |
| **Metric, baseline, harness** | H12 (three unit cases, no accuracy number). Gap row "Goal verifier accuracy" names the smallest harness: 30-50 labeled transcript excerpts (met, not-met, unclear) scored for both the heuristic and a Jev arm. Baseline: tests pass/fail only (`goal-core.test.cjs`). |
| **Cost, latency, privacy** | OpenCode verifier timeout default 30 s (`opencode-goal.js:49`), configurable via `OPENCODE_GOAL_VERIFIER_TIMEOUT_MS` (`:78`); the Python client timeout is 60 s per the digest, so the wrapper must impose its own shorter timeout. One call per idle verification (OpenCode) or per turn end (Pi). State sent: objective plus up to 1200 chars of transcript evidence (`goal-core.cjs:63`, `:597`), forwarded verbatim. |
| **Opt-in and no key** | `OPENCODE_GOAL_VERIFIER=jev` follows the documented `=llm` precedent (`goal-plugin.md:53`). With no key the mode falls back to `heuristic` at startup (fail-open, the default is already `heuristic` at `opencode-goal.js:72`); mid-run exit 3/4 or a malformed answer falls back to `verifyGoalHeuristic` for that turn and does not invent a verdict. |
| **Complexity** | ~60-100 LOC: one factory branch in `opencode-goal.js`, a small `jev` spawn wrapper, one arm in the Pi adapter behind an env flag, and vocabulary mapping (`met\|not_met\|blocked` in the plugin at `:179` versus `met\|not-met\|unclear` in the core at `goal-core.cjs:586-619`). |
| **Verdict** | **next** — the plugin already has the verifier-mode switch, the timeout, and a fail-open default; the first slice must include the 30-50 excerpt labeled set so the mode arrives with its own number. |
| **Confidence** | Confirmed from code: mode switch, timeout, verdict vocabularies, evidence cap. Inferred: that Jev beats the regex on `unclear` cases; would be confirmed by the labeled set. UNKNOWN: per-call latency and cost. |

### Idea 3.2 — A Jev keep-or-drop pass inside Claude `PreCompact` (`compact-inject.ts`)

| Field | Content |
|---|---|
| **Idea** | Ask Jev which candidate sections survive into the injected compact brief (or which transcript facts to preserve). |
| **Value** | Would make the 4000-token brief smarter than frequency counting. |
| **Seam** | `compact-inject.ts:144-175` (attention signals), `:325-341` (selection metadata), `:343-357` (merge + elapsed warning) under `HOOK_TIMEOUT_MS = 1800` (`shared.ts:12`) and a 3 s hook window per the seam map (`.claude/settings.json:221-222`). |
| **Deadline** | The merge already warns above 1500 ms (`compact-inject.ts:353-357`). A live Jev call would need to fit in the leftover budget with no measured latency; the client timeout is 60 s. Does not fit. |
| **Verdict** | **drop** (live hook). The gap-row harness (fixed transcripts with must-survive facts, scored with and without a Jev pass) stays as a **later** measurement idea only; it does not justify a live PreCompact call. |
| **Confidence** | Confirmed from code: internal budget, elapsed warning, hook window via digest. |

### Idea 3.3 — Carry the vendored compaction patterns (not the feature)

| Field | Content |
|---|---|
| **Pattern 1** | Fall back to the built-in path on *any* error or below a minimum reduction ratio, with a visible notice (`fast-jev.ts:277-285`). Any future Jev compaction work here copies this: no silent half-compaction. |
| **Pattern 2** | Cap concurrency because every batch resends the whole state (`fast-jev.ts:94-96`, `:97-123`); the vendored defaults pin the newest 6 messages and keep at `keepThreshold 0.5` (`compact.ts:20-27`, `:110-114`). |
| **Pattern 3** | Log per-call decisions with probabilities so the operator can audit (`fast-jev.ts:212-235`). |
| **Verdict** | carry into any future compaction slice; no build now. |
| **Confidence** | Confirmed from vendored source (research material, not this repo's contract). |

## Findings

1. **The OpenCode goal plugin is the strongest verifier seam in the repo.** It already selects between `heuristic` and `llm` verifiers by env (`opencode-goal.js:71-72`, `:134`, `:227-302`), carries a 30 s verifier timeout (`:49`), and runs verification at idle (plugin contract `goal-plugin.md:52-53`). Adding a third mode is a value in an existing set, not new machinery.
2. **Two verdict vocabularies must be mapped.** The shared core returns `met | not-met | unclear` with `source: 'heuristic'` (`goal-core.cjs:586-588`, `:596-620`); the OpenCode plugin validates `met | not_met | blocked` (`opencode-goal.js:179`). A `jev` answer is a probability, so the wrapper owns thresholding into whichever vocabulary its surface expects. The `source` field (`goal-core.cjs:587`, `opencode-goal.js:300`) is where a Jev verdict says who judged.
3. **Pi and OpenCode have different cost profiles.** Pi verifies on every `turn_end` (`goal-context.ts:221-244`) and sends a hidden nudge when not met; the OpenCode plugin verifies at `session.idle`. A per-turn Jev call on Pi is the more expensive shape; idle-only on OpenCode is naturally cheaper.
4. **Cursor and Devin have no verifier surface at all.** The README's surface table marks them injection-only, and the Cursor adapter says in a comment that "no verify/continue mechanism exists either" (`cursor/goal-inject.mjs:11`). Done = these two runtimes cannot host idea 3.1 without first gaining a verify surface.
5. **Compaction here is injection, not transcript rewriting.** `compact-inject.ts` builds a brief and injects it; a Jev pass would choose sections for that brief, not delete messages. The vendored jevctl hook rewrites messages wholesale (`fast-jev.ts:269-287`), which is a different contract, so its shape carries over only as patterns (fallback, minimum reduction, decision log).
6. **Evidence is already capped before any judge sees it.** The core clamps transcript evidence to 1200 chars (`goal-core.cjs:63`, `:597`) and the objective to 4000 (`:598`), so the state sent to Jev is bounded and predictable; the privacy question is still real (the tail of the turn leaves the machine verbatim).
7. **Prompt-cache impact is negligible for the goal verifier** (it sends a fresh transcript tail; there is no cacheable shared prefix) and **bounded for compaction** (the brief is injected at compaction time, so a changed brief changes the post-compact prompt once, not every turn). The Hermes-sourced risk of pruning breaking caching applies to per-request pruning, not to this injection.

## Ruled Out

- **Live Jev keep-or-drop inside Claude PreCompact**: the merge pipeline warns above 1500 ms against an 1800 ms internal cap (`compact-inject.ts:353-357`, `shared.ts:12`); no measured Jev latency fits.
- **`run` batch for goal verification**: one verdict per turn is the contract; the plugin validates a single verdict value (`opencode-goal.js:179`).
- **Jev verifier on Cursor/Devin**: no verifier surface exists (README surface table; `cursor/goal-inject.mjs:11`).
- **30 s-plus spawn without a wrapper timeout**: the plugin's verifier budget is 30 s while the Python client timeout is 60 s; the wrapper must impose its own deadline, and must not start a spawn it cannot kill.

## Questions Answered

- Per surface: OpenCode fits with an idle-time async call under a 30 s verifier budget; Pi fits structurally but pays per turn; Claude PreCompact does not fit; Cursor/Devin lack the seam entirely.
- Degrade path: no key → default `heuristic` remains; error/malformed → that turn falls back to the heuristic, never a fabricated verdict.
- The flag precedent: `OPENCODE_GOAL_VERIFIER=heuristic|llm` exists; `=jev` extends it. Pi's flag family is `OPENCODE_GOAL_*` (shared core constants `goal-core.cjs:39-42`).

## Questions Remaining

- Does a Jev `choice` beat the regex on labeled transcripts, per class (met / not-met / unclear)? (H12 gap row; needs the 30-50 row set)
- What is the measured p95 of a single `jev choice` call? (latency gap row)
- Should the Pi arm exist at all before the labeled set shows a win, given the per-turn cost?

## Hand-off (for iteration 4 and later)

- Any goal-verifier proposal must name the surface vocabulary it returns (`met_…` variants differ between plugin and core) and the wrapper timeout (shorter than the 30 s verifier budget and well shorter than the 60 s client timeout).
- Compaction: do not propose a live call on the Claude PreCompact path; the vendored patterns (fallback with notice, minimum reduction, decision log) are the durable carry-overs.
- Iteration 4 (deepseek-04) enters wave 2 with the deep-loop stop decision; the same deadline-first test applies, and the reducer's state contract replaces the hook contract as the thing not to break.

## Assessment

- `newInfoRatio`: `0.75`
- Novelty justification: First pass that found the OpenCode verifier-mode switch with its 30 s budget, mapped the two verdict vocabularies, and classified each goal/compaction surface as fits/does-not-fit with code evidence.
- Confidence: high for the plugin seam and the PreCompact budget; medium for Pi latency behavior (no deadline declared); UNKNOWN for Jev accuracy and latency.

## Sources Consulted

- `.skilled/plugins/opencode-goal.js`
- `.skilled/hooks/goal/goal-plugin.md`
- `.skilled/hooks/goal/README.md`
- `.skilled/hooks/goal/lib/goal-core.cjs`
- `.skilled/hooks/goal/pi/goal-context.ts`
- `.skilled/hooks/goal/cursor/goal-inject.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts`
- `R/jev-cli-main/plugin/hooks/fast-jev.ts` (vendored research material)
- `R/jev-cli-main/src/vendor/compaction/compact.ts` (vendored research material)
- Digest claims (not reopened): `context/seam-map.md` (S08, S14), `context/measurement-digest.md` (H12, gaps)

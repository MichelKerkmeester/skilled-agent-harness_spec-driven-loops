# Iteration 003 — KQ3: Structural arg-presence vs `$ARGUMENTS`-emptiness heuristic

**Focus:** Should commands distinguish "invoked with args" from "invoked bare"
structurally rather than by `$ARGUMENTS`-emptiness heuristics? Design the robust pattern.
**Status:** complete · **newInfoRatio:** 0.62

---

## The defect, restated structurally
Today the model is the one evaluating `is $ARGUMENTS empty?` (KQ1). That pushes a
control-flow decision into the least-reliable component — the weaker model's
instruction-following. The fix is to **move the branch out of the model's judgment** and
into a deterministic pre-computation, then hand the model a *resolved* state.

## The enabling mechanic
Command templates can run shell at expansion time via `` !`…` `` injections, and inside
them `$ARGUMENTS` expands like `"$@"` (one word per argument).
[SOURCE: .opencode/skills/cli-opencode/SKILL.md:269]
This is the lever: compute the arg-presence boolean *in shell*, before the model reads
anything, and inject the **resolved query** plus an explicit **ARGS_PRESENT flag**.

> Note the `"$@"` word-splitting caveat from KQ1: the renderer script must `join` argv
> itself (e.g. capture all of `"$@"`), or a multi-word query arrives split. This is a
> real latent bug for any `` !`…` `` renderer and must be handled in the same fix.

## Proposed contract pattern (evidence-backed, four layers)

### Layer 1 — Deterministic arg-resolution header (removes the model's branch)
Inject a computed header at the very top of the command body, e.g.:
```text
ARGS_PRESENT=true
QUERY="deep research remediation handover"
```
Computed by `` !`…` `` (shell joins argv, sets the flag). The model now branches on a
**pre-decided boolean**, not on re-judging emptiness. This directly neutralizes the
KQ1 root cause (salience-driven conditional misfire) for every model.

### Layer 2 — Salience inversion (execute-path first, ask-path demoted)
Reorder the contract so the **execute-now** instruction is the first, most-imperative
content, and the startup question is a clearly-guarded fallback that only fires on
`ARGS_PRESENT=false`. Today the presentation asset leads with §1 Startup Question Policy
[SOURCE: search_presentation.txt:15-21] — the opposite of what robustness needs.
Recommendation: gate the startup section behind an explicit
`ONLY IF ARGS_PRESENT=false:` prefix and place the retrieval contract first.

### Layer 3 — Imperative no-ask guard (defense in depth for weak followers)
Add an explicit imperative the grounding evidence already prescribes — *"execute now, do
not ask"* [SOURCE: grounding-evidence.md:33] — bound to the resolved query:
```text
When ARGS_PRESENT=true you MUST execute retrieval on QUERY now.
Do NOT ask the startup question. Do NOT ask the user to restate the query.
```
This converts the implicit guard-suppression (which Kimi/MiMo failed) into an explicit
prohibition keyed to the deterministic flag.

### Layer 4 — Explicit arg echo (observability + self-correction)
Require the model to echo the bound query in the output envelope. The `MEMORY:SEARCH`
header already does this — `MEMORY:SEARCH "<query>" …` [SOURCE: search.md:58-60] — so a
dropped query becomes *visibly* wrong (empty `"<query>"`), enabling the model's own
self-check (search.md:73 already mandates a header/footer self-check) and downstream
detection.

## Why structural beats heuristic (the principle)
- The heuristic ("ask when `$ARGUMENTS` empty") requires every model to re-derive the
  same boolean correctly every time — and KQ1 proved that derivation is where weak
  followers fail.
- The structural flag derives the boolean **once, deterministically, in shell**, so model
  variance can no longer flip the control path. The model's remaining job is the part it
  is actually good at: rendering the resolved query into the fixed envelope.
- This generalizes beyond `/memory:search`: **any** command with an "ask when bare" branch
  has the same latent hazard and the same four-layer fix.

## Ruled out this iteration
- **"Just strengthen the wording of the empty-check"** — partial at best: it still leaves
  the conditional in the model's hands. Wording helps strong followers; the
  intermittent failure (MiMo) shows wording alone is non-deterministic. Keep Layer 3 as
  defense-in-depth but do **not** rely on it as the primary fix.
- **"Detect emptiness from conversation context"** — explicitly forbidden by the existing
  hard rule [SOURCE: search.md:100] and would re-introduce non-determinism. Ruled out.

## Next focus
Iteration 4 → KQ4: which output fields the contract should mandate so conversational
answers are comparable (confidence vs similarity divergence).

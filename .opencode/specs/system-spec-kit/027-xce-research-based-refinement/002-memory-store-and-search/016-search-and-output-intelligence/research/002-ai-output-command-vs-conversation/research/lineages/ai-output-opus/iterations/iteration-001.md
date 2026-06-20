# Iteration 001 — KQ1: Command-argument robustness across models (root cause)

**Focus:** Why do Kimi K2.7 and MiMo v2.5 Pro drop to the startup question under
`--command` when DeepSeek v4-pro binds `$ARGUMENTS` cleanly?
**Status:** complete · **newInfoRatio:** 0.90

---

## Evidence gathered

### The mechanical substrate is sound (rules out "injection broken")
- `--command` substitution works: `opencode run --command <family>/<name> "<args>"`
  puts the message into `$ARGUMENTS`, verified on opencode 1.17.4.
  [SOURCE: .opencode/skills/cli-opencode/SKILL.md:269]
- DeepSeek consumed `$ARGUMENTS` and rendered the full `MEMORY:SEARCH` block **both
  times** through the identical dispatch path. If the injection point itself were
  broken, DeepSeek would fail too. It did not.
  [SOURCE: grounding-evidence.md:11-13]
- Therefore the gap is **not** the injection mechanism. It is how each model
  *interprets a conditional instruction* over an already-populated `$ARGUMENTS`.

### The contract makes "ask the question" the most salient path
The command's own execution order front-loads the startup branch:
- search.md step 1: "Read the presentation asset **before responding**."
  [SOURCE: .opencode/commands/memory/search.md:22]
- The presentation asset's **§1 is "Startup Question Policy"** — literally the first
  section a model reads, and it opens with: *"When `$ARGUMENTS` is empty, ask one
  open-ended question: `What would you like to retrieve or analyze?`"*
  [SOURCE: .opencode/commands/memory/assets/search_presentation.txt:15-21]
- Retrieval (the actual job) is §2, *after* the startup policy.
  [SOURCE: search_presentation.txt:37-51]
- The hard rule "Do not infer a query from prior conversation when `$ARGUMENTS` is
  empty; ask the open-ended startup question" reinforces the ask-path as a strong
  imperative. [SOURCE: .opencode/commands/memory/search.md:100]

So the *first, most-imperative thing* a model reads when the command loads is an
instruction to ask a question. Executing retrieval requires the model to (a) hold that
instruction, (b) evaluate the guard condition "is `$ARGUMENTS` empty?", (c) correctly
conclude "no, it is populated", and (d) suppress the salient ask-path in favor of §2.
That is a multi-step conditional-suppression task.

### Why the gap maps to instruction-following strength, not the models' capability
- DeepSeek-v4-pro is the rotation's **DEPTH/reasoning escalation** model — "strongest
  reasoning depth in the opencode-go tier," rewards specificity and precise conditional
  framing. It evaluates the guard correctly and suppresses the ask-path.
  [SOURCE: sk-prompt-small-model/references/models/deepseek-v4-pro.md:48,60]
- Kimi K2.7 under `--command` "read the command's presentation asset but then asked the
  startup question … it did NOT bind `$ARGUMENTS`." Via a **direct** natural prompt it
  searched correctly. [SOURCE: grounding-evidence.md:15-18] → The model *can* search;
  it fails specifically at the contract's conditional-suppression step.
- MiMo was **mixed** — one query searched, the other dropped to the startup question
  [SOURCE: grounding-evidence.md:20-22] — the signature of a borderline
  instruction-follower that resolves the guard non-deterministically.

### Root-cause statement (confirmed by the above)
The failure is **salience-driven conditional misfire**, not a broken injection:
1. The startup-question instruction is the **first and most imperative** content the
   model loads (presentation §1 + hard rule).
2. Executing retrieval requires *actively negating* an empty-`$ARGUMENTS` guard and
   suppressing that salient instruction.
3. Strong instruction-followers (DeepSeek) perform the negation reliably; weaker /
   borderline ones (Kimi always, MiMo intermittently) anchor on the salient ask-path
   and treat populated `$ARGUMENTS` as if empty.

This is exactly the failure class the grounding evidence hypothesized: *"weaker
instruction-followers mis-read a populated `$ARGUMENTS` as empty."*
[SOURCE: grounding-evidence.md:24-26] — now mechanistically explained.

## Ruled out this iteration
- **"`$ARGUMENTS` injection is broken for Kimi/MiMo"** — refuted: same dispatch path,
  DeepSeek succeeds; Kimi succeeds via direct prompt. The transport is model-agnostic.
- **"Models can't do retrieval"** — refuted: all three retrieve correctly on the direct
  natural-language path. The defect is contract-comprehension, not capability.
- **`"$@"` word-splitting as the cause** — the `"$@"` expansion caveat applies inside
  `` !`…` `` shell injections (renderer scripts must join argv), not to the model-facing
  `$ARGUMENTS` substitution that carries the query string. [SOURCE: cli-opencode SKILL.md:269]
  Not the root cause of the startup-question drop, though it is a separate latent bug for
  any future `` !`…` `` renderer (flagged for KQ3).

## Implication for the contract (carried to KQ3)
A robust contract must remove the *conditional-suppression* burden: branch on a
**pre-computed, deterministic** arg-presence signal and make **execute-now** the
salient default, with the ask-path demoted to a clearly-guarded fallback.

## Next focus
Iteration 2 → KQ2: `--command` vs direct-prompt vs natural conversation — deterministic
renderer vs model-driven flow, and the variance each surface introduces.

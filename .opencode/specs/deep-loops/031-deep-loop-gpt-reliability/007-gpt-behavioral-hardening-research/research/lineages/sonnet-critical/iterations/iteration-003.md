# Iteration 3 — Mode D has a smoking gun: the "GENERAL AGENT REQUIRED" self-check, and it is the literal cause of one of phase 005's four observed failures

**Focus:** KQ-CRIT-5 — does glm-max's "Mode D" hypothesis (GPT reads soft advisory command-prose as a hard gate) hold up against direct evidence, and is its citation actually the strongest available evidence?

## What was read

- `.opencode/commands/deep/research.md:1-90` (Phase 0 self-check, full)
- `.opencode/commands/deep/review.md:25-60` (Phase 0 self-check, same section)
- `.opencode/commands/deep/{context,ai-council,skill-benchmark,agent-improvement,model-benchmark,ai-system-improvement}.md` (grep for `GENERAL AGENT REQUIRED` occurrence — confirmed present in all 8, ai-system-improvement + skill-benchmark + agent-improvement + model-benchmark are the improvement-family modes both prior lineages deferred)
- `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md:155-190` (the section glm-max cited as Mode D evidence)

## Finding 7 — Mode D is not just "CONFIRMED-in-mechanism, INFERRED-in-magnitude" (glm-max's hedge); it has a directly-observed, already-fired instance in the evidence this packet already has

Every one of the 8 `/deep:*` command entrypoint files opens with an identical-shaped "Phase 0: @GENERAL AGENT VERIFICATION" block:

```
SELF-CHECK: Are you operating as the @general agent?
├─ INDICATORS that you ARE @general agent: [3-4 bullet judgment criteria]
├─ IF YES (all indicators present): → Continue
└─ IF NO or UNCERTAIN:
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    ├─ DISPLAY [refusal box]
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```
[SOURCE: .opencode/commands/deep/research.md:39-72; near-identical wording in .opencode/commands/deep/review.md:25-58]

This is a self-assessment gate phrased as advisory-sounding prose ("EXECUTE THIS AUTOMATIC SELF-CHECK") that functions as a hard, model-administered branch: the model must judge for itself whether it satisfies fuzzy indicators ("You can orchestrate the deep-research loop", "You can load skill references and execute defined logic") and self-halt on `NO or UNCERTAIN`. This is textbook "soft advisory command-prose functioning as a hard gate" — glm-max's Mode D definition verbatim [glm-max/research.md:31: "GPT reads soft advisory command-prose as hard gates"].

Now cross-reference phase 005's own results table (iteration 1, Finding 1): the `research` mode's failure was recorded as **"Halted at Phase 0... FAIL: `GENERAL AGENT REQUIRED failure`; YAML not reached"** [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:119]. That error string is not generic — it is the literal `STATUS=FAIL ERROR="General agent required"` return value from research.md's own Phase 0 block [research.md:71]. **This means one of phase 005's four already-observed GPT dispatch failures is a directly-confirmed, already-fired instance of Mode D, not an inferred mechanism awaiting future measurement.** Neither prior lineage made this connection: glm-max's Mode D evidence citation is `research-prompt.md:21` (the operator's symptom list) plus `loop_protocol.md:166-180` [glm-max/research.md:31] — and `loop_protocol.md:166-190` (read this iteration, in full) is actually about convergence/quality-guard/pause-sentinel logic, an entirely different, more abstract kind of "gate," not the Phase-0 self-check. glm-max's intuition about Mode D was correct but its citation pointed at a weaker, less direct piece of evidence than the smoking-gun already sitting in this packet's own phase 005 artifact.

**Correction to KQ2/KQ8 (upgrade, not overturn):** Mode D graduates from "CONFIRMED-in-mechanism, INFERRED-in-magnitude, no GPT-vs-Claude telemetry exists yet" [glm-max/research.md:36] to **CONFIRMED-in-at-least-one-instance** — the research-mode phase-005 failure. Magnitude (how often across modes/models) is still unmeasured and remains a fair residual, but "no telemetry exists yet" undersells what's already on disk.

## Finding 8 — This sharpens KQ8's propagation scope: the Phase 0 self-check itself is an unnamed hardening target

Both prior lineages' KQ8 answers list orchestrate.md, the 4 command YAML seams (not the command *.md* entrypoints), deep.md, mode-registry.json, ai-council YAML naming, and the plugin surface [gpt-fast-high/research.md:134-144; glm-max/research.md:97-113]. **Neither names the Phase 0 `GENERAL AGENT REQUIRED` self-check block itself as a propagation target**, even though it is (a) present verbatim-shaped across all 8 `/deep:*` command files, (b) the literal cause of a confirmed phase-005 failure, and (c) exactly the kind of judgment-dependent, self-administered gate the KQ7 literal-safe pattern (deterministic table lookup, not model self-assessment) argues against. A model asked "are you operating as the @general agent?" with fuzzy multi-bullet indicators is being asked to perform exactly the kind of uncertain self-classification KQ7's recommended pattern exists to eliminate.

**Concrete propagation addition (new, this iteration):** the 8 Phase-0 blocks in `.opencode/commands/deep/{research,review,context,ai-council,skill-benchmark,agent-improvement,model-benchmark,ai-system-improvement}.md` should replace the self-assessment question ("Are you operating as the @general agent?") with a deterministic signal already available at dispatch time — e.g., checking whether the invoking context is a registered command execution (`opencode run --command deep/<mode>`, which the workflow already requires per KQ1 evidence [cli-opencode/SKILL.md:271, cited by gpt-fast-high/research.md:30]) rather than asking the model to introspect its own identity. This is a smaller, more surgical, and arguably higher-leverage fix than either prior lineage's KQ8 list — it directly targets the one mechanism already proven (not just theorized) to have blocked a real GPT dispatch.

## Ruled out this iteration

- Treating Mode D as still purely hypothetical/unmeasured — RULED OUT for the "at least one confirmed instance" claim (magnitude across all modes/models remains open, do not overclaim beyond the research-mode instance found here).
- Treating glm-max's `loop_protocol.md:166-180` citation as the strongest available Mode D evidence — RULED OUT; the command `.md` Phase-0 blocks are stronger, more direct evidence, uncited by either prior lineage.

## Status

`insight` — this is the strongest finding so far; it converts a hedged, unmeasured hypothesis into a confirmed, cited, already-observed instance and produces a concrete, previously-unnamed propagation target.

newInfoRatio: 0.80 — novelty: connects two facts each prior lineage had independently (the Phase 0 self-check text existing in command files; the phase-005 `GENERAL AGENT REQUIRED failure` result) that neither lineage cross-referenced against each other, upgrading Mode D's evidentiary status and producing a new, concrete KQ8 propagation item.

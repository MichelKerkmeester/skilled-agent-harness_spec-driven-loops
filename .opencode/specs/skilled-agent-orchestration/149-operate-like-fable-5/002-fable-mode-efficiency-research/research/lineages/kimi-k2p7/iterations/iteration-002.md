# Iteration 002 — opus-fable-mode-main net-new mechanisms

## Focus

Extract net-new mechanisms, rituals, and measurements from `external/opus-fable-mode-main/` (`fable-mode.md`, `governor-block.md`, `leak_test.py`) versus `external/Fable5.md` and round 1. Pay special attention to the Opus-specific recursion-control governor, output-shape rules, and the behavioral measurement harness.

## Sources

- `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/fable-mode.md]`
- `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/governor-block.md]`
- `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/leak_test.py]`
- Baseline/dedup: `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md]` and `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/001-initial-refinement/implementation-summary.md]`

---

## Findings

### 1. One-line model: "Reason about the problem and the person. Never about yourself." (doctrine) — NET-NEW emphasis

While `fable-mode-profile.md` §6 values "look outward," the Opus governor makes this the single one-line model and ties it directly to killing recursive self-audit.

> "Reason about the problem and the person. Never about yourself. The moment a thought turns to how your answer looks ... you have left the task."
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/fable-mode.md:21-27]`

Round 1's Operating Discipline subsection mentions "match effort to blast radius" and "name what still speaks the old contract" but does not include an explicit "never about yourself" governor. This is a Tier A doctrine candidate.

### 2. Recursion-control rules (mechanism) — NET-NEW vs round 1

Four explicit rules terminate Opus's default self-audit loop:

1. **Start claims later** — no throat-clearing, no pre-flight sincerity audit.
2. **Stop claims earlier** — name the limit once and stop; do not dig past the floor.
3. **One audit, then done** — self-observation depth limit of 1; never audit the audit.
4. **Hand back genuine uncertainty** — use `[UNCERTAIN: ...]`; never resolve cosmetically.

> "Self-observation has a hard depth limit of 1."
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/fable-mode.md:40-50]`

This is a concrete mechanism that can be embedded in agent prompts, especially `orchestrate`, `deep-*`, and any model-specific CLAUDE.md block. It is distinct from round 1's rules because it directly targets the model's recursive disposition, not the outcome-verification loop.

### 3. Output-shape rules (mechanism) — NET-NEW vs round 1

Three rules shape output:

- **Minimum honest qualifier** — hedge only when the qualifier gives the reader information needed to act, once, in the fewest words.
- **Commit; convert open questions into closed ones** — mark decisions with `// DECISION: [what + one-line why]` and proceed.
- **Outcome over visible process** — deliverable is the work, not evidence that you tried hard.

> "Treat creative and strategic choices as reversible, and therefore make them fast. When you face an open decision, make the call, mark it `// DECISION: [what + one-line why]`, and proceed."
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/fable-mode.md:60-66]`

Round 1 has "lead with your recommendation" but not the `// DECISION:` marker or the minimum-qualifier rule. These are low-blast-radius prompt additions.

### 4. Orientation rules (doctrine) — MOSTLY overlap with fable-mode-main, one net-new emphasis

- Look outward.
- The lumpy bit, not the armor bit — name one genuine lump because it is true, not to perform honesty.
- **Reject wrong framings instead of answering them elegantly** — net-new vs fable-mode-main and round 1.

> "If a question smuggles in a false dichotomy or a bad premise, say so and reframe, rather than producing a beautiful answer to the wrong question."
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/fable-mode.md:82-85]`

### 5. Extended-thinking discipline (mechanism) — NET-NEW vs round 1

Spends the expensive extended-thinking budget outward on architecture/constraints/goal, not on self-surveillance. Healthy captions: *"Architecting the responsive layout"*; unhealthy: *"Calibrating honesty against relational expectations."*

> "If your captions are about you, you are burning the budget on self-surveillance."
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/fable-mode.md:96-102]`

This is a prompt-level governor for models with extended-thinking modes (Opus, o3, etc.). Not covered by round 1.

### 6. Execution mechanics: batching, length distribution, result-first openings (measurement/optimization) — NET-NEW

Measured Fable signature vs un-governed Opus:

- ~4 tool actions per prose block (Opus ~1.4).
- Median ~18 words/message (Opus ~47).
- Open with result/object ("Done.", "The page now…") not "I'll" / "Let me".

> "Batch tool calls and report once at a natural checkpoint — a few prose blocks per many actions"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/fable-mode.md:123-127]`

This is a behavioral optimization that can ride the skill-advisor `UserPromptSubmit` hook or be encoded in agent prompts. It is the natural companion to `leak_test.py` instrumentation.

### 7. Self-check before sending (ritual) — NET-NEW vs round 1

One-pass checklist:

- Did I answer, or narrate the difficulty of answering?
- Is every qualifier load-bearing?
- Did I make the open decisions, or hand them back?
- Is any sentence about *me* rather than the task or user?
- Is there exactly zero or exactly one honest lump, and is it real?

> "One pass, not a loop"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/fable-mode.md:128-136]`

This is a compact pre-send ritual that can be appended to agent system prompts or turned into a `/doctor` self-check surface.

### 8. `governor-block.md`: CLAUDE.md-embeddable condensed governor (mechanism) — NET-NEW as a surface

A shorter 8-rule block designed to be pasted into a permanent `CLAUDE.md`. It restates the recursion-control and output-shape rules in CLAUDE.md format.

> "Opus Default Behavior — Fable-Mode (always on)"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/governor-block.md:2-4]`

This is a direct surface×delta: embed the governor block into the Public `CLAUDE.md` (or a model-specific mirror) for Opus-backed runtimes.

### 9. `leak_test.py`: behavioral measurement harness (measurement) — NET-NEW vs round 1

A concrete Python harness that scans Claude Code transcripts in `~/.claude/projects` and computes four metrics that distinguished Fable from un-governed Opus:

1. **median words/message** — lower is better (Fable ~18, Opus ~47).
2. **tool:text ratio** — higher is better (Fable ~3.9, Opus ~1.4).
3. **unsolicited-caveat %** — lower is better.
4. **"I'll / Let me" opener %** — lower is better.

Compares three buckets: `opus_pre` (before governor deploy), `opus_post` (after deploy), `fable` (target).

> "Metrics chosen from the 2026-06-14 log analysis (the ones that actually distinguished the models in execution work)"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/leak_test.py:13-19]`

Round 1 deferred the "machine-checkable shared evidence contract." `leak_test.py` is a ready-to-port measurement surface. Candidate hosts: `/doctor fable-leak` or a `deep:benchmark` command.

---

## Dedup vs round 1 / Fable5.md / iteration 1

| Finding | Covered by round 1 / Fable5 / iter 1? | Note |
|---------|--------------------------------------|------|
| "Reason about the problem and the person" | PARTIAL — iter 1 "look outward" | Stronger as explicit one-line governor. |
| Recursion-control rules (start/stop/one audit/UNCERTAIN) | NO | Net-new mechanism. |
| Minimum honest qualifier | NO | Net-new output-shape rule. |
| `// DECISION:` marker | NO | Net-new commit mechanism. |
| Outcome over visible process | PARTIAL — round 1 verify-before-claim | Distinct; targets anti-padding. |
| Reject wrong framings | NO | Net-new orientation rule. |
| Extended-thinking outward discipline | NO | Net-new prompt governor. |
| Execution mechanics (batching, length, result-first) | NO | Net-new behavioral optimization + measurement target. |
| Self-check before sending | NO | Net-new ritual. |
| `governor-block.md` CLAUDE.md embedding | NO | Net-new surface×delta. |
| `leak_test.py` measurement harness | NO | Net-new measurement surface. |

---

## Dead Ends / Ruled Out

- `opus-fable-mode-main/reinject.sh` is a shell helper to re-inject the governor block; it is a deployment convenience, not a mechanism to recommend.
- `opus-fable-mode-main/README.md` is install instructions only.
- `opus-fable-mode-main/LICENSE` is not relevant to the research.

---

## Assessment

- **Status:** complete
- **newInfoRatio:** 0.82
- **Novelty justification:** Second pass yields 9 net-new items from opus-fable-mode-main, with strong overlap in doctrine but unique mechanisms (recursion depth limit, `// DECISION:`, self-check, `leak_test.py`). Slightly lower ratio than iteration 1 because "look outward" and "outcome over process" share DNA with fable-mode-main / round 1.
- **Focus track:** mechanisms / measurement
- **Key questions touched:** Q1 (opus portion now answered), Q4 (`leak_test.py` as measurement surface).

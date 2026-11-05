### .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/findings-registry.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/findings-registry.md:22 | 4 | `## 1. OVERVIEW` opens with `### Core Principle`; `### When to Use` follows it and no `### Purpose` exists. | Replace lines 22-28 with:

  ```markdown
  ### Purpose

  Keep what the council has already established available to later topics, so a repeated claim is recognised instead of re-argued.

  ### When to Use

  Use the registry when you need to track findings across multiple topics in a session and retrieve priors for later topics.

  ### Core Principle

  Findings persist across topics. Fingerprints prevent duplicates. Locking prevents corruption.
  ```

### .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md:22 | 4 | `## 1. OVERVIEW` has no Purpose or When to Use heading; it opens with the failure-mode paragraph, and the planning-only scope sentence at line 26 is unlabelled. | Insert `### Purpose` and a blank line before line 22; insert `### When to Use` and a blank line before line 26.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/scoring/scoring-rubric.md:268 | 7 | Four distinct rules are packed into one paragraph. | Replace line 268 with:

  ```markdown
  - Close races merge only elements that improve the plan without bloating it.
  - All-low-score rounds escalate for reframing.
  - Timeout rows remain visible as `TIMEOUT (N/A)` and are excluded from scored totals.
  - Simulated external vantages must be labeled as simulated unless the CLI or native agent actually executed.
  ```

### .skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md:22 | 4 | `## 1. OVERVIEW` opens with the bold persistence rule; it has no Purpose or When to Use. | Insert before line 22:

  ```markdown
  ### Purpose

  Make every file a completed council run leaves behind traceable to the record it holds and the writer that produced it.

  ### When to Use

  - You are starting a council run and need to know what it will write.
  - You are inspecting a completed run and need to find the record for a round, a seat, or a rollback.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md:68 | 1 | The document-level cross-reference list is an unheaded block inside §1, so it is not the last H2 the template requires. | Replace line 68 `Cross-references:` with `---`, a blank line, `## 2. CROSS-REFERENCES`, and a blank line.

### .skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md:21 | 4 | `## 1. OVERVIEW` has no Purpose or When to Use heading; it opens with the source-of-truth paragraph. | Insert `### Purpose` and a blank line before line 21; insert `### When to Use`, a blank line, and these bullets before line 23:

  ```markdown
  - You are changing the report sections `@deep-ai-council` must return.
  - You are debugging why `persist-artifacts.cjs` rejected a report or wrote placeholders for optional sections.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md:25 | 10 | The cross-reference list sits inside §1, before §2-§6, so the related-resources section is not last. | Move lines 25-29 to the end of the file after line 135; change `Cross-references:` to `## 7. CROSS-REFERENCES` and add `---` plus a blank line above it.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md:52 | 5 | The `Strict-required`/`Optional` definition comes after the §2 matrix that uses the terms. | Move line 52 to directly after line 34, before the table header at line 35.

### .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:22 | 4 | `## 1. OVERVIEW` opens with the `council_complete` rule; it has no Purpose or When to Use. | Insert before line 22:

  ```markdown
  ### Purpose

  Make the event log sufficient to tell an interrupted run from a completed one.

  ### When to Use

  - You are resuming an interrupted council run.
  - You are verifying that a run completed and its artifacts were written.
  - You are adding or changing a state event type.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:156 | 10 | `## 5.1` (line 156) and `## 5.2` (line 171) are decimal H2 numbers among integer peers; `validate_document.py` reports `render_h2_numbering` at both lines. | Change both to H3: `### 5.1 WORKED EXAMPLE (V1.2 AUDIT TRAIL)` and `### 5.2 PROGRESS RECORD (v1.3, shared cross-mode)`. This keeps the `§5.1` label cited by `loop-protocol.md:153`.
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:201 | 6 | `Threshold T derivation` comes after the rules that use `T`. | Move lines 201-203 to directly before line 193 (`Rules:`).
- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:215 | 7 | §6 packs four resume branches into one paragraph. | Replace line 215 with:

  ```markdown
  The last completed event determines the next action.

  - `round_start` exists without all expected `seat_returned` events: redo or complete that round.
  - All seats returned but `deliberation_synthesized` is missing: synthesize deliberation.
  - Deliberation exists but `round_end` is missing: close the round.
  - `council_complete` exists: treat the council as done unless the user requests another round.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md:223 | 10 | The document-level cross-reference list has no heading and sits inside §7 VALIDATION POLICY, so the related-resources section is not its own last section. | Replace line 223 `Cross-references:` with `---`, a blank line, `## 8. CROSS-REFERENCES`, and a blank line.

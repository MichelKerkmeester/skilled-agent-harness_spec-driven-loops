### .skilled/skills/system-deep-loop/deep-review/README.md
- [P2] .skilled/skills/system-deep-loop/deep-review/README.md:33 | 1 | OVERVIEW opens with `### Why This Skill Exists`; the skill README template requires `### What It Does` first, with the optional problem narrative after it. | move lines 33-37 to after line 43, directly after the `It does not investigate outward knowledge...` paragraph and before `### The Dimension Coverage`.

### .skilled/skills/system-deep-loop/deep-review/ROUTER.md
- [P2] .skilled/skills/system-deep-loop/deep-review/ROUTER.md:23 | 7 | One sentence packs three resource families and a dozen paths into a semicolon chain, so a reader cannot scan for the family they need. | replace the second sentence on line 23 (from `It routes to three resource families:` to the end of the line) with `It routes to three resource families:` and three bullets: `- \`references/protocol/\` for \`quick-reference.md\`, which loads first on every invocation, plus the loop protocol, the completion criteria and the state gates.` / `- \`references/convergence/\` for the threshold semantics, the stop signals and the recovery path.` / `- \`references/state/\` with \`assets/\` for the state format, the outputs, the reducer registry, the dashboard and the strategy templates.`

### .skilled/skills/system-deep-loop/deep-review/SKILL.md
- [P1] .skilled/skills/system-deep-loop/deep-review/SKILL.md:240 | 5 | The NEVER rule sends the reader to `ALWAYS rule 14` for the canonical REFUSE wording, but the ALWAYS list ends at rule 9, so the governing wording is not where the rule points. | replace `(ALWAYS rule 14)` with `(ALWAYS rule 9)`.
- [P1] .skilled/skills/system-deep-loop/deep-review/SKILL.md:266 | 10 | `## 5. REFERENCES AND RELATED RESOURCES` is followed by `## 6. SUCCESS CRITERIA` and `## 7. INTEGRATION POINTS`; the validator reports `render_section_order` because a related-resources section must be the last H2. | rename line 266 to `## 5. REFERENCES` and move line 292 (`Related skills: ...`) to the end of §7 after line 340.
- [P2] .skilled/skills/system-deep-loop/deep-review/SKILL.md:121 | 6 | `### Architecture` is the loop overview but sits after two init-only subsections, so the reader meets resource-map and snapshot rules before learning the loop shape. | move lines 121-123 to before line 96 (`### Resource Map Coverage Gate`).
- [P2] .skilled/skills/system-deep-loop/deep-review/SKILL.md:155 | 7 | One paragraph packs three separate contracts: lifecycle modes, lineage fields, and the reducer's inputs and outputs. | replace line 155 with `Review mode is lineage-aware.` followed by three bullets: `- **Lifecycle modes:** \`new\`, \`resume\`, and \`restart\`.` / `- **Required lineage fields:** \`sessionId\`, \`parentSessionId\`, \`lineageMode\`, \`generation\`, \`continuedFromRun\`, and \`releaseReadinessState\`.` / `- **Reducer contract:** consumes the latest JSONL delta, the new iteration file, and prior reduced state, then emits finding registry, dashboard metrics, and strategy updates.`

### .skilled/skills/system-deep-loop/deep-review/assets/deep-review-dashboard.md
- [P2] .skilled/skills/system-deep-loop/deep-review/assets/deep-review-dashboard.md:51 | 10 | `## 2A. DIMENSION EXPANSION` uses a letter-suffixed H2; the validator reports `render_h2_numbering`. | renumber to `## 3. DIMENSION EXPANSION` and shift §3-§10 by one; the reducer writes the same literal heading at `runtime/scripts/reduce-state.cjs:2084`, so the reducer must change in the same commit.
- [P2] .skilled/skills/system-deep-loop/deep-review/assets/deep-review-dashboard.md:80 | 1 | The PROGRESS body is a single-cell row under a seven-column header, so the placeholder renders as one collapsed cell instead of showing the table's shape. | replace line 80 with a seven-cell placeholder row matching the header: `#`, `Focus`, `Files`, `Dimensions`, `New P0/P1/P2`, `Ratio`, `Status`.

### .skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md
- [P2] .skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md:108 | 10 | `## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER` uses a letter-suffixed H2; the validator reports `render_h2_numbering`. | renumber to `## 11. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER` and shift §11-§17 by one; the reducer upserts the literal `10A.` heading at `runtime/scripts/reduce-state.cjs:2000` and `runtime/tests/unit/deep-review-strategy-heading.vitest.ts:33` asserts it, so all three change together.
- [P2] .skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md:102 | 6 | `### [Category Name] -- PRODUCTIVE` with its `What worked` and `Prefer for` bullets sits under `## 10. EXHAUSTED APPROACHES (do not retry)`, so a productive approach is filed where the reader is told not to retry. | move lines 102-104 to after line 84 under `## 8. WHAT WORKED`.

### .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md
- [P1] .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md:26 | 1 | The asset contract requires an OVERVIEW section; `validate_document.py` fails with blocking `missing_required_section: overview`, and the first H2 is `## Meta`. | add `## Overview` as the first section inside the generated block with `Human-readable rendering of the deep-review review-mode contract: targets, dimensions, severities, gates, convergence, outputs, and validation.`; add an `overview` renderer and list `overview` first in `render.artifacts[0].sections`, then regenerate, because `render-contract-snapshot.cjs --check` compares the whole file and a hand-added H2 is reverted.

### .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence-recovery.md
- [P2] .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence-recovery.md:16 | 3 | The second sentence is a pure pointer (`This reference covers...`) that restates the Purpose and the Key References table instead of telling the reader when to open the file. | delete `This reference covers stuck-recovery strategies, the convergence report format, and graph-aware review convergence.`, leaving `When a review loop stalls or finishes, these contracts take over.`

### .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence-signals.md
- [P2] .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence-signals.md:22 | 4 | OVERVIEW is a single paragraph with no Purpose or When to Use subsection, so it does not open with the two headings the reference template requires. | insert before line 22 `### Purpose`, a blank line, the existing paragraph unchanged, a blank line, `### When to Use`, and four bullets: `- Naming the signal that is holding STOP open.` / `- Checking whether a new P0 forces another iteration.` / `- Confirming the six legal-stop conditions before synthesis.` / `- Comparing this loop's threshold with a sibling deep loop.`

### .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md
- [P1] .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:580 | 2 | `render_h2_numbering`: `## OPTIMIZER-TUNABLE THRESHOLDS` is unnumbered among numbered peers | retitle to `## 9. OPTIMIZER-TUNABLE THRESHOLDS`
- [P2] .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:436 | 9 | the reconciliation note names a spec folder (`006-gate-model-reconciliation`) in body prose | replace "was reconciled in \`006-gate-model-reconciliation\`" with "has been reconciled"
- [P2] .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:582 | 9 | "(042.004)" is a spec/task number in body prose | replace "managed by the offline loop optimizer (042.004)." with "managed by the offline loop optimizer."
- [P1] .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:201 | 10 | says "the 5-gate legal-stop bundle passes", but §6 defines nine `Gate`-suffix gates (line 438) and §1 names nine (line 128); the same stale count is repeated at line 345 as "the existing 5-gate legal-stop bundle (Section 6)" | change "5-gate" to "9-gate" at both line 201 and line 345
- [P1] .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:436 | 10 | "The §Section-1 event shape (lines 98-119)" names no real section number and points at the wrong lines; the `blocked_stop` example now spans lines 130-158 | replace "The §Section-1 event shape (lines 98-119) mirrors this set verbatim" with "The §1 event shape mirrors this set verbatim"
- [P2] .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:440 | 10 | table column header uses the same invalid section label, `Event-shape name (§Section-1)` | replace with `Event-shape name (§1)`

### .skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md
- clean

### .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md
- [P1] .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:732 | 2 | two render warnings from one cause: `render_h2_numbering` on the unnumbered `## Executor Selection Contract`, and `render_section_order` because `## 9. RELATED RESOURCES` (line 691) is no longer the last H2 | move lines 730-770 (the `---` plus the whole `## Executor Selection Contract` block) to just before line 689, retitle that H2 to `## 9. EXECUTOR SELECTION CONTRACT`, and renumber `## 9. RELATED RESOURCES` to `## 10. RELATED RESOURCES`
- [P2] .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:296 | 7 | one bullet packs six mechanisms into a single ~350-word paragraph (attribution, preserve default, restore, contested path, sibling-lineage exemption, evidence paths) | keep the bold lead as the parent bullet and split the rest into six sub-bullets at these sentence starts, text verbatim: "Attribution on a shared checkout is a guess", "So the default remedy is preserve", "Restoring is opt-in", "A path that was already dirty when the lineage started and changed again", "A path the lane itself quarantined on an earlier pass", "One exemption still applies to attribution", "The runtime records each finding's diff"
- [P2] .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:276 | 9 | implementation-spec numbers in body text: heading "(spec 018 + 019)", bullets at lines 280, 281, 282 ("(spec 018)", "(spec 019)"), and line 298 ("unchanged from spec 018") | "#### Executor Resolution (spec 018 + 019)" → "#### Executor Resolution"; "- `native` (spec 018):" → "- `native`:"; "- `cli-opencode` (spec 018):" → "- `cli-opencode`:"; "- `cli-claude-code` (spec 019):" → "- `cli-claude-code`:"; "Failure handling remains unchanged from spec 018:" → "Failure handling is unchanged:"
- [P2] .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:192 | 10 | cross-reference reads "(see `../convergence/convergence.md` §Section-1 ...)", which names no real section | replace "§Section-1" with "§1"

### .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md
- [P1] .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md:16 | 3 | the intro is a pure pointer ("This reference defines ...") and restates Purpose (line 24) almost word for word; it gives no reason to open the file. Its three claims (transitions, error handling, gates) all appear in Purpose and §2-§4 | replace line 16 with "Read this before accepting a STOP vote, or when a run has stopped advancing and you need its next legal move."
- [P1] .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md:93 | 10 | "Apply state recovery cascade (Section 6)" points at a section that does not exist in this file, which ends at §4; the cascade is `loop-protocol.md` §6 | replace "(Section 6)" with "in `loop-protocol.md` §6"

### .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md
- [P2] .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:171 | 10 | the iteration checklist numbers 1, 2, 4, 5, 6, 7, skipping 3, so the reader cannot tell whether a step was lost | renumber the items at lines 171-174 from 4, 5, 6, 7 to 3, 4, 5, 6

### .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md
- [P1] .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:23 | 4 | §1 OVERVIEW opens with the packet-file table and path-resolution examples; there is no `### Purpose` heading at all and `### When to Use` is buried at line 57, after the content | insert after line 21: "### Purpose\n\nThe review packet is reproduced from disk on every resume, so each file's format, mutability, and fields are pinned here for the reducer, the dashboard, the validator, and the resume path." then move lines 57-62 (the `### When to Use` block) to directly after that paragraph
- [P2] .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:25 | 8 | the file index under "uses 8 state files under the resolved `{artifact_dir}/`" omits `resource-map.md`, which the loop emits at `{artifact_dir}/resource-map.md` (convergence.md:40, state-outputs.md:37) | add `| \`resource-map.md\` | Markdown | Emitted once at synthesis |` to the table and change line 23 to "9 state files"

### .skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md
- [P2] .skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:465 | 9 | delivery-phase labels stand in for the actor: "Phase D may warn" (line 465) and "Phase E reducer/dashboard/report work must preserve ... Until Phase E ships" (line 469) | replace "Phase D may warn, but must not hard-fail" with "A validator may warn, but must not hard-fail", and replace "Phase E reducer/dashboard/report work must preserve" with "Reducer, dashboard, and report work must preserve", and "Until Phase E ships" with "Until that work ships"
- [P2] .skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:227 | 10 | cross-reference reads "See `../convergence/convergence.md` §Section-1", which names no real section | replace "§Section-1" with "§1"

### .skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md
- [P1] .skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md:16 | 3 | the intro is a pure pointer ("This reference explains the files operators read ...") plus a second pointer at a sibling; it gives no reason to open the file | replace line 16 with "Use this file at synthesis time, when you need to know which artifact to read and which copy wins when two of them disagree." and move the sentence "Use \`references/state/state-format.md\` for schemas and field-level contracts." verbatim into §1 under the new Purpose heading
- [P1] .skilled/skills/system-deep-loop/deep-review/references/state/state-outputs.md:22 | 4 | §1 OVERVIEW has no `### Purpose` and no `### When to Use`; line 22 is an unattributed topic sentence | retitle line 22's text as "### Purpose" (text unchanged, preceded by the new heading) and add "### When to Use\n\nLoad this when writing or validating a packet output rather than a JSONL record." followed by the moved state-format sentence

### .skilled/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md

- [P2] .skilled/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md:20 | 4 | §1 OVERVIEW has no `### Purpose` or `### When to Use` and its only paragraph repeats the intro's reducer→registry/dashboard/strategy claim, so the section adds only the "not a second source of truth" clause. | Replace lines 20-22 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Keep the findings registry, dashboard, and strategy current by deriving them from append-only evidence under the reducer, never as a second source of truth.

  ### When to Use

  - Deciding which writer owns a derived surface, or whether a hand edit is legitimate.
  - Recovering from corrupt JSONL, or rebuilding derived files that are missing.
  - Checking what a finding must carry before emission, and how duplicate findings collapse.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md:39 | 7 | One 55-word sentence carries three separate mechanisms — the projection bound, where the vocabulary and census are documented, and what the checker script enforces — so the script's role is only reachable at the end of the clause chain. | Split after "bounded by the registered stems.", keeping line 39 as the lead sentence:
  ```markdown
  Under ledger authority the JSONL the reducer reads is a projection of the ledger, bounded by the registered stems.

  - The registered vocabulary and the producer census are in `state-format.md` section 11.
  - `.skilled/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs` holds the census to the emitter surface on disk.
  ```

- [P2] .skilled/skills/system-deep-loop/deep-review/references/state/state-reducer-registry.md:83 | 6 | FINDING DEDUPLICATION sits after both recovery sections although §3 (line 53) already requires a `content hash` on every active finding; that term is defined only 36 lines later, after the corrupt-log and rebuild material, so the section reads as appended rather than placed where the registry contract is used. | Move lines 83-104 (`## 6. FINDING DEDUPLICATION` through its closing `---`) to after line 55; retitle it `## 4. FINDING DEDUPLICATION`, retitle `## 4. FAIL-CLOSED BEHAVIOR` to `## 5. FAIL-CLOSED BEHAVIOR` and `## 5. RECONSTRUCTION` to `## 6. RECONSTRUCTION`, and drop the extra blank line left before `## 7. RELATED RESOURCES`.


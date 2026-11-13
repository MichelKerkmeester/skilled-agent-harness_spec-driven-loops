# Iteration 3: Real packet evidence across saves, handovers and phase children (Q3)

## Focus

Question 3: in real packets under `specs/` that have a `handover.md` or several continuity saves, is the purpose restated, shortened or absent, and do phase children restate the parent's purpose or drift from it. Method: count and sample packet-level `handover.md` files, count continuity blocks and Purpose restatement in `implementation-summary.md`, and compare parent and child `### Purpose` paragraphs across phase parents in `specs/`. Archives, containment baselines and scratch copies were excluded.

## Findings

1. Packet-level `handover.md` uses the handover addon shape (`## 1. Handover Summary`, `## 2. Context Transfer`, `## 3. For Next Session`), not the relaunch-note shape with a `## Goal` section. Its heading set has no slot for the problem or purpose: it records what shipped, decisions, blockers, files, traps, a starting point and remaining tasks. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37-84]

2. Across 96 packet handovers under `specs/` (excluding archives, containment baselines and scratch), 71 contain no occurrence of "purpose", "problem statement", "objective", "user need" or "why this" at all, and only 9 carry an explicit Purpose/Problem/Objective heading. Purpose is therefore absent from most handovers, not shortened in them. [INFERENCE: based on a recursive grep over specs/**/handover.md, excluding research_archive, containment and scratch copies, run 2026-11-13]

3. Continuity saves are near-universal and uniformly purpose-blind. 2,857 of 2,870 `implementation-summary.md` files carry a `_memory.continuity` block, while the implementation-summary template has no Purpose section at all; its headings are Metadata, What Was Built, Files Changed, How It Was Delivered, Key Decisions, Verification and Known Limitations. [SOURCE: .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl:85-149] [INFERENCE: based on a recursive count of `_memory:`/`continuity:` in specs/**/implementation-summary.md, run 2026-11-13]

4. No implementation summary restates the packet's purpose. Of 2,315 packets that have both a non-placeholder Purpose in `spec.md` and an `implementation-summary.md`, zero carry the first 80 characters of the purpose sentence verbatim, and zero carry any Purpose heading. The save target records delivery mechanics, so the why never enters the continuity document it refreshes. [INFERENCE: based on an exact-string and heading scan over 2,315 packet pairs, run 2026-11-13]

5. Phase parents rarely carry a real purpose either: of 297 phase parents found under `specs/` (excluding archives and containment), 76 have a placeholder or empty `### Purpose` in their `spec.md` despite the template's REQUIRED root-purpose instruction. [INFERENCE: based on a scan of ### Purpose paragraphs across phase parents in specs/, run 2026-11-13] [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:35-37]

6. Phase children drift from the parent's purpose rather than restating it. Among 1,029 parent-child pairs where both purposes are real text, zero children repeat the parent's purpose (no shared 60-character run), and the median four-letter-word Jaccard overlap is 0.067; 700 of 1,029 pairs sit below 0.10. Children write a local outcome instead: for a parent purpose about deciding what should surface repo rules, one child purpose is "CI fails when a rule's Fires-when bullet has no counterpart in its router row" and another is "The corpus shrinks by 20% to 28% while every norm, test, exception ... survives". [INFERENCE: based on a parent/child ### Purpose comparison across 297 phase parents in specs/, run 2026-11-13]

7. Drift is structurally expected, not an authoring lapse: the child `spec.md` is scaffolded with a local Problem & Purpose, the parent `spec.md` is the only place the cross-phase why exists, and nothing in the child template or the save path reads the parent document. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:100-112] [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:71] [INFERENCE: based on the absence of any parent-purpose read in the child scaffold and save paths traced in iterations 1-2]

8. The relaunch note cannot compensate at packet scale: the note lives only in `.skilled/skills/.state/session-relaunch/handoffs/`, which is runtime state, and no notes were present in the checkout at measurement time. Unlike `handover.md`, a relaunch note is not a packet artifact, so it neither accumulates a history nor is validated by `validate.sh`. [SOURCE: .skilled/commands/speckit/handoff.md:28-37] [INFERENCE: based on an empty handoffs directory listing on 2026-11-13]

9. Purpose drift scales with the corpus: 2,912 `spec.md` files exist outside archives and containment, 2,622 have a non-empty Purpose, and 53 still hold the placeholder text `[One-sentence outcome statement. What does success look like?]`. A placeholder passes validation because the parent's purpose anchor is not graded for content and a v2.2 stamp skips the required-anchor check. [INFERENCE: based on a recursive scan of specs/**/spec.md, run 2026-11-13] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449]

## Ruled Out

- Treating `handover.md` as the purpose carrier across saves: the template has no purpose slot and 71 of 96 real handovers never mention purpose, problem, objective or user need.
- Treating the continuity block as a purpose carrier: the block is present in 99.5% of summaries, yet the save target has no purpose section and no summary restates the purpose sentence.
- Explaining child drift as a few bad packets: 700 of 1,029 measured pairs fall below 0.10 overlap, so drift is the corpus-wide default.

## Dead Ends

- Searching packet-level artifacts for the relaunch note format (`## Goal` / `## Done` / `## Remaining work` / `## In-flight state`) returned zero files. The relaunch note is runtime state under `.skilled/skills/.state/`, not a packet document. Candidate for "Exhausted Approaches": looking for relaunch notes inside packets.

## Edge Cases

- Ambiguous input: "several continuity saves" could mean several `handover.md` versions or the `_memory.continuity` block refreshed per save. Selected interpretation: the continuity block plus packet handovers, because saves write the block, not a new file.
- Contradictory evidence: none between sources. The measurement does conflict with the template's stated intent (the parent template calls root purpose REQUIRED); the conflict is between intent and outcome and is reported as finding 5, not resolved away.
- Missing dependencies: no real relaunch notes existed to sample, so the relaunch-note comparison rests on the command contract (iteration 2) rather than on observed notes. This limits confidence in how often a writer restates the why; it does not affect the handover or continuity measurements.
- Partial success: the exact-restatement count uses a verbatim 80-character probe, so a heavily paraphrased restatement would not be counted. The zero is therefore "no verbatim carry and no purpose heading", not proof that no summary paraphrases the purpose.

## Sources Consulted

- .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl:37-84
- .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl:85-149
- .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:100-112
- .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:35-37,71
- .skilled/skills/system-spec-kit/references/validation/validation-rules.md:449
- .skilled/commands/speckit/handoff.md:28-37
- Recursive grep over specs/**/handover.md (96 files, 2026-11-13)
- Recursive scan of specs/**/implementation-summary.md (2,870 files, 2026-11-13)
- Parent/child ### Purpose comparison over specs/**/spec.md (297 parents, 1,029 pairs, 2026-11-13)

## Assessment

- New information ratio: 0.94
- Questions addressed: Q3
- Questions answered: Q3

## Reflection

- What worked and why: measuring the corpus instead of reading more machinery converted a plausible mechanism into a quantified outcome. The pair comparison is the decisive evidence: the child template asks for a local outcome, so the child purpose answers a narrower question by design, and the parent's why is not reachable from the child document.
- What did not work and why: the first overlap pass included placeholder purposes and reported six "exact restatements" that were all identical template placeholders. Excluding placeholders changed the result to zero, which is the finding.
- What I would do differently: the next iteration should test candidate fixes against the measured failure points rather than against the operator's framing. The evidence now names three distinct failure points: an unvalidated parent purpose, a save target with no purpose slot, and a resume output with no purpose slot.

## Recommended Next Focus

Question 4: evaluate the operator's candidate changes and any evidence-backed alternative against the three measured failure points, with a cost for each. Then Question 5 in the final iteration: what is ruled out and why.
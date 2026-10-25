# Review Iteration 2 — Traceability (`spec_code`)

## Dimension

Traceability, core protocol `spec_code`: does what the packet asserts about `.skilled/` resolve against the files it cites. Two kinds of claim are checked. First, the line-numbered claims the child specs make in their own problem statements. Second, every `[SOURCE: path:line]` tag the two syntheses carry, machine-matched against the quoted text at that line.

## Files Reviewed

- `specs/sk-code/014-code-modes-research/001-quality-mode-research/spec.md:64-72`
- `specs/sk-code/014-code-modes-research/002-review-mode-research/spec.md:65-72`
- `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/research.md` (221 `[SOURCE:]` tags)
- `specs/sk-code/014-code-modes-research/002-review-mode-research/research/research.md` (80 `[SOURCE:]` tags)
- `.skilled/skills/sk-code/sk-code-review/SKILL.md:223-241,378-409,472,501-503,530-539`
- `.skilled/skills/sk-code/sk-code-quality/SKILL.md:112-131,141-159,210-216`
- `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:150-158`
- `.skilled/skills/sk-code/ROUTER.md:171,177,181,243,274,283,390`

## Findings

### P0 Findings

None.

### P1 Findings

1. **The review spec asserts an absence that the hub playbook contradicts** -- `specs/sk-code/014-code-modes-research/002-review-mode-research/spec.md:71` -- The problem statement reads "No other file under `.skilled/skills/sk-code/` mentions the quality gate's advisory envelope, so review has no documented way to read what the quality gate already checked." Both halves are contradicted by one file inside that tree. `.skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:153` is headed "What `sk-code-quality` hands forward" and lists the envelope's contents, and line 155 is headed "Where `deep-review` consumes it", naming the traceability dimension the envelope feeds. That is a documented reader, under the exact path prefix the sentence quantifies over. The child's own synthesis is narrower and correct: I-3 at `research/research.md:57` says only that "the review packet names no reader for it", which is true. The spec's broader negative claim was never narrowed to match the finding its own run produced, so the parent statement now overstates the gap that recommendation rank 6 is built on.
   Finding class: spec-mismatch
   Scope proof: the contradicted sentence and the contradicting file are both inside `.skilled/skills/sk-code/`; no file outside the declared review target was read for the finding itself.
   Affected surface hints: `002-review-mode-research/spec.md` problem statement; the External-User Modes and integration framing that inherit it; rank 6 of `research/research.md` (readiness "Decision"), whose premise is "review cannot see what the gate checked".
   Case: a later packet scoped from this spec treats the quality-to-review envelope handoff as undesigned and builds a new reader, duplicating the handoff the playbook already documents.
   Claim adjudication:
   ```json
   {"type":"finding","claim":"spec.md:71's universal negative ('no other file ... mentions') is false; the hub playbook documents both the envelope and its deep-review consumer","evidenceRefs":["specs/sk-code/014-code-modes-research/002-review-mode-research/spec.md:71",".skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:153",".skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:155","specs/sk-code/014-code-modes-research/002-review-mode-research/research/research.md:57"],"counterevidenceSought":"searched for a qualifier narrowing 'no other file' to the review packet; the sentence's quantifier is the whole sk-code skill tree, and the synthesis's narrower I-3 does not narrow the spec","alternativeExplanation":"the spec was written before the playbook note existed and the note was added later","finalSeverity":"P1","confidence":"high","downgradeTrigger":"downgrade to P2 if the playbook note is shown to postdate the spec's authoring and to be outside the run's declared starting sources, making this staleness rather than a missed read"}
   ```

### P2 Findings

1. **Ten source citations no longer land on their quoted text** -- `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/research.md:213` -- A machine match of every `[SOURCE: path:line]` tag against the quoted text at that line checked 301 tags and found 291 resolving and 10 not. All ten are `.skilled/skills/sk-code/ROUTER.md` anchors: eight in child 001 (`ROUTER.md:177`, `:181`, `:243` three times, `:274`, `:283`, `:390`) and two in child 002 (`:171`, `:283`). `ROUTER.md:243` now holds a `DEBUGGING` keyword row while the synthesis quotes `"keywords": ["lint", "format", "quality gate", ...]`; rank 12's evidence cell at `research/research.md:213` is one of the three rows carrying that anchor. The cause is dated and external: commit `5b33a8089b` ("refactor(sk-code): delete the hub performance checklist and its intent", 2026-10-25T15:10:31+01:00) landed after both runs closed at 13:00Z and 13:10Z. Every drifted tag still carries its quoted text, so a reader can still find the evidence by search; what rotted is the line anchor, not the evidence.
   Finding class: citation-drift
   Scope proof: tags parsed only from the two files named in the review target; each target line read from the working tree at review time.
   Affected surface hints: `research/research.md` in both children; rank 12 in child 001; the References sections; any downstream packet that opens a citation instead of grepping its quote.
   Case: a reader opens `ROUTER.md:243` from rank 12 and lands on the debugging intent, concluding the synthesis invented the stage-two keyword list.

### Confirmed clean

- Child 002's five line-numbered claims resolve exactly: `SKILL.md:223-241` is `detect_surface_evidence` returning SKILLED or UNKNOWN, `:378-409` is the final-line exact-string contract, `:472` is the `@review` baseline bullet, `:501-503` is the per-user cache path keyed by `sha256(git remote get-url origin)`, and `:530-539` is the never-skip sensitive-path table.
- Child 001's token-level claim holds: `CODE_QUALITY_RESULT` occurs in exactly one file under `.skilled/skills/sk-code/`, `sk-code-quality/SKILL.md:210`, as the sentence states.
- No cited source file is missing: all 301 tags resolve to a readable file, and only the `ROUTER.md` line numbers drifted.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | 291/301 citations resolve with their quoted text; 1 of 2 absolute-absence claims contradicted (`002/spec.md:71`); child 002's five line-numbered claims and child 001's token claim all resolve. |
| `checklist_evidence` | core | pending | Acceptance-criteria rows are audited in iteration 3. |

## Verdict

One P1 and one P2. The P1 is a spec statement contradicted by a file in the tree it quantifies over, and it is the premise of an integration recommendation; the P2 is post-close citation drift with the quoted evidence intact.

Review verdict: CONDITIONAL

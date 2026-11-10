# Iteration 5: Handoff to Verification and Debugging

## Focus

Angle 5 examines who consumes `CODE_QUALITY_RESULT` and where the quality handoff goes when no active surface carries a workflow document. The research remained read-only outside this iteration packet and used no network sources.

## Actions Taken

1. Read the quality-mode envelope and handoff contract, the shared verification and debugging workflows, the hub surface contract, surface detection, and the review-mode boundary.
2. Searched the active `.skilled/agents`, `.skilled/commands`, `.skilled/skills/system-deep-loop`, and `.skilled/skills/sk-code` trees for the exact `CODE_QUALITY_RESULT` token. The only result was the declaration in the quality-mode skill at line 210.
3. Checked both registered surfaces' workflow links. `sk-code-ci` and `sk-code-skilled` each link `workflow-verify.md` and `workflow-debug.md` to the shared canonical references.
4. Read the prior iteration focus summaries and state records. None of iterations 1–4 focused on this handoff angle; their recorded new-information ratios were 1.0, 0.75, 0.6, and 0.6.

## Findings

1. **OBSERVED — The envelope is request-triggered and advisory; it does not carry completion authority.** The producer appends it after prose when an orchestrator or surface workflow asks for structured evidence, names `workflow-verify.md` in the handoff field, and fixes its status to advisory. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:207] `When the orchestrator or surface workflow requests structured evidence` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:219] `verification_handoff: workflow-verify.md` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:223] `This envelope is advisory and additive only`

2. **INFERRED — No explicit active-tree parser is documented.** The exact-token search across the active agent, command, deep-loop, and sk-code trees found only the producer declaration. The producer names the orchestrator or surface workflow as the request context, but no active consumer contract says who parses the fields or what action a parser takes. An explicit workflow or agent input contract for `code-quality/v1` would confirm a machine consumer. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:207] `When the orchestrator or surface workflow requests structured evidence` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:210] `CODE_QUALITY_RESULT v1`

3. **OBSERVED — The prose handoff chooses debugging or verification by the failure state.** An unclear runtime failure goes to the surface debugging workflow with the observed command, output, and failing target; once P0 items are clear, the next step is the surface verification workflow. Debugging then returns repaired work through quality and verification. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:186] `hand to the surface's debugging workflow` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:187] `hand to the surface's verification workflow` [SOURCE: .skilled/skills/sk-code/shared/references/workflow-debug.md:24] `sends the result back through quality and verification`

4. **DERIVED — An unsupported surface has no documented automatic workflow fallback.** The hub's shared doctrine is carried by its surfaces, while verification requires the active surface and asks for the command set if the surface is unsupported or ambiguous. The UNKNOWN route applies no standards until clarified. Therefore, when a surface has no workflow document, the supported next step is to resolve the surface and verification command set before making a completion claim. [SOURCE: .skilled/skills/sk-code/SKILL.md:41] `is symlinked into each surface so the active surface carries the full workflow` [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:53] `ask for the verification command set before claiming anything` [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:28] `No standards applied until clarified`

5. **OBSERVED — Review is a separate findings-first route, not the quality handoff's verifier.** Quality directs a requested review report to `sk-code-review`; the review packet says author-side quality gates precede review and loads its own code-quality checklist. This pass confirms separate ownership but does not compare the checklist contents in depth. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:199] `If the requested output is a review report, use sk-code-review` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:43] `Author-side quality gates before review; use sk-code-quality` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:99] `assets/code-quality-checklist.md`

## Questions Answered

No complete strategy key question is closed in this iteration. The verify/debug handoff portion is supported; the quality-versus-review checklist boundary remains open for Angle 6.

## Questions Remaining

- How should sk-code-quality hand off to verify, debug and sk-code-review, and where should the boundary between the quality and review checklists sit? The handoff portion is addressed here; the checklist boundary remains open. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:40] `How should sk-code-quality hand off to verify, debug and sk-code-review`
- How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality, and where could a repository keep its own quality configuration without forking the hub? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:41] `How should a surface packet or a user-authored workflow or surface mode plug into sk-code-quality`
- Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages? [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42] `Which behaviors may no recommendation relax`

## Next Focus

Angle 6: quality and review checklist boundary. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:160] `| 6 | Quality and review boundary |`

# Review Iteration 006 - mention-13

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage (no nested dispatch).
- Session: `fanout-mention-13-1794865302020-qunumz`, generation 1, lineage `mention-13`.
- Iteration: 6 of 8. Dimension: maintainability (re-verification). Focus: which comment lines the branch actually rewrote, checked against the old tree at `b8ebee37d75`.
- Operator review focus, and how this iteration addressed it: pass thirteen's brief asks for a request that now reads as a mention and for a refusal still read as a request. This iteration asked a narrower question about F007: whether the reflow damage is the branch's or older debt. Reading the old comment shows part of it predates the branch, so F007's evidence narrows to the two lines the diff actually changed.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:421-436` (current comment)
- `b8ebee37d75:.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:419-434` (old comment, via `git show`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:440-441` (the fold itself)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. F001 and F002 remain active.

### P2 Findings

None new. F007 is re-stated below with narrowed evidence; severity and object are unchanged.

- **F007 narrowed** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:427` and `:435` -- the diff produced the 57-character line 427 and the 148-character line 435 by splitting one sentence and jamming another. The 15-character line 432 (`// maps to. The`) and the 48-character line 436 exist unchanged in `b8ebee37d75`, so they are older debt and are not attributed to this branch.
   Finding class: documentation-readability
   Scope proof: Compared the current block with `git show b8ebee37d75:.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`. Lines 425-427 and 435 differ from the old text; lines 428-434 and 436 do not. Measured widths: 427 is 57, 432 is 15, 435 is 148, 436 is 48.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
   Case: a maintainer reading the fold comment to decide whether the doc-path skip and the occurrence-lead rule are one clause or two, on the two lines the branch re-wrapped.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | F005 stands. The fold claim at `spec.md:86` matches lines 440-441. |
| `checklist_evidence` | partial | F006 stands. `CHK-FIX-001` at `tasks.md:130` says each fix names its class; this iteration confirms the mention reader's classes are producer-side, and the comment's own line set is the only documentation surface touched. |
| `skill_agent` | notApplicable | No agent definition in scope. |
| `agent_cross_runtime` | notApplicable | No runtime mirror is touched. |
| `feature_catalog_code` | notApplicable | No feature catalog update in this pass. |
| `playbook_capability` | notApplicable | No playbook scenario covers the mention guard. |

## Integration Evidence

None this iteration.

## Edge Cases

- Contradiction resolved: iteration 4 listed four damaged lines as the branch's product. The old tree shows two of them predate the branch. F007 is narrowed rather than withdrawn, because lines 427 and 435 are the branch's own and they are the ones that break the sentence a maintainer needs.
- Ambiguity: whether older debt in the same block should be reported. It is not: the review target is this branch's diff against `b8ebee37d75`, and the packet's recorded limits name other older debt. The old lines are noted here so a reader does not re-attribute them.
- Partial success: the coverage gate remains blocked by the two partial core protocols; this iteration does not change that.
- Re-verification: F001 to F004 reproduce, unchanged.

## Confirmed-Clean Surfaces

- The old fold dropped only backtick, asterisk and the two curly double quotes; the current fold drops those plus the six new mark groups. Every line of the current block that the diff did not touch is byte-identical to the old text.
- The branch's own comment additions (the strikethrough and guillemet naming at 425-426, the wrapped-command sentence at 426-427, and the doc-path clause at 435) describe exactly what the code does.

## Ruled Out

- A comment that misstates the fold: the six new mark groups in the comment match the six new character classes in the fold regex at 440-441.
- A branch-introduced orphan at line 432: it predates the branch.
- A stale claim in the typed reader's comment: unchanged by the diff and still accurate.

## Next Focus

- Dimension: traceability (re-check).
- Focus area: whether the packet's failing-first claim (`SC-001`, `AC-001`) holds for each of the sixteen new cases on `b8ebee37d75`.
- Reason: the cap is three iterations away and the coverage gate cannot pass while the core protocols stay partial, so the remaining passes should settle the packet's own claims rather than re-probe the code.
- Rotation status: re-verification pass 2 of 4 under the cap.
- Blocked/productive carry-forward: productive `git show the old file and compare rule by rule`.
- Required evidence: the old rule set and the case list from `tasks.md:45`.
- Recovery note: none.

Review verdict: CONDITIONAL

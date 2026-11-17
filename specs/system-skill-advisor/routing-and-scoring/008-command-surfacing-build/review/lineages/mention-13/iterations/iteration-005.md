# Review Iteration 005 - mention-13

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage (no nested dispatch).
- Session: `fanout-mention-13-1794865302020-qunumz`, generation 1, lineage `mention-13`.
- Iteration: 5 of 8. Dimension: correctness (re-verification). Focus: re-run every finding prompt against the final tree and probe the adjacent request shapes the new rules touch.
- Operator review focus, and how this iteration addressed it: pass thirteen's brief asks whether a request now reads as a mention. This iteration re-ran the four request prompts behind F001 and F002 and added six adjacent request phrasings with the same rule shapes, to test whether the defect class is wider than the two recorded cases.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:359-476` (re-read for the re-verification)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:172-232` (fixture set)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. F001 and F002 remain active and reproduce on the final tree.

### P2 Findings

None new.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | F005 stands: `spec.md:85` states the document shape without the determiner that `command-attach.ts:458` requires. Re-read both, no change. |
| `checklist_evidence` | partial | F006 stands: `tasks.md:131` claims matrix coverage for leads outside `PLAIN_ROWS`. Re-read both, no change. |
| `skill_agent` | notApplicable | No agent definition in scope. |
| `agent_cross_runtime` | notApplicable | No runtime mirror is touched. |
| `feature_catalog_code` | notApplicable | No feature catalog update in this pass. |
| `playbook_capability` | notApplicable | No playbook scenario covers the mention guard. |

## Integration Evidence

`typedCommandForTop` (`.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259`) still drops the typed command on both P1 prompts: F001 and F002 both return `undefined`. `attachCommand` at line 527 still withholds the hub offer on the document-then-request prompt.

## Edge Cases

- Ambiguity: whether the six adjacent probes are new findings. They are not: each reproduces one of the two recorded classes with different wording, so they extend F001 and F002's case lists rather than adding objects.
- Contradiction: none.
- Partial success: the coverage gate cannot pass while the two core protocols stay partial, which is a documented consequence of F005 and F006 rather than a defect in this iteration.
- Re-verification: all four earlier findings reproduce at their cited lines, and no cited line moved.

## Confirmed-Clean Surfaces

- F001 reproduces: `open the /deep:review command file, then run it` and `read the /deep:review docs, then do a thorough review of this diff` both read as mentions.
- F002 reproduces: `run /speckit:save and don't run it twice` and `run /deep:review but never run it without a budget` both read as mentions.
- F003 reproduces: `do not run [/create:readme](https://example.com/docs) yet` reads as a request.
- F004 reproduces: `/create:readme, what does it do?` and `/create:readme is wrong, skip it` read as requests.
- Adjacent request shapes that stay requests: `run the /deep:review command on this packet`, `use the /create:diff command to compare a.md and b.md`, `run /create:diff file a.md b.md`, `not sure, use /create:readme`, `never mind just run /speckit:save`, `without asking, run /speckit:complete`. The document noun needs a doc word after it, so a request that names the command and then its object is safe.

## Ruled Out

- A wider F001 class: a request that names the command with a determiner but no document noun (`run the /deep:review command on this packet`) stays a request, because `COMMAND_AS_DOCUMENT` needs the noun.
- A wider F002 class: `don't skip it`, `don't forget to run it` and `never mind just run` stay requests; only the negated use verb plus `it` overreaches.
- A moved finding line: every cited line resolves at the same number it did in iteration 1.

## Next Focus

- Dimension: traceability (re-check).
- Focus area: whether the two core protocol statuses can honestly move to `pass`, and what the packet owner must change for that.
- Reason: the coverage gate is blocked by the two partial core protocols, so the next pass should state the exact evidence needed rather than re-probe the code.
- Rotation status: re-verification pass 1 of 4 under the cap.
- Blocked/productive carry-forward: productive `probe the recorded finding prompts first`; it separates reproduction from discovery.
- Required evidence: the protocol rows and the acceptance rows they rest on.
- Recovery note: none.

Review verdict: CONDITIONAL

# Review Iteration 003 - mention-13

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage (no nested dispatch).
- Session: `fanout-mention-13-1794865302020-qunumz`, generation 1, lineage `mention-13`.
- Iteration: 3 of 8. Dimension: security. Focus: the trust boundary of the prompt text, the two new patterns, and the module's import, environment and secret surface.
- Operator review focus, and how this iteration addressed it: pass thirteen's brief asks whether a request now reads as a mention and whether a refusal or question still reads as a request. This iteration asked the same questions from the trust side: whether a crafted prompt can make the guard offer a command it would not otherwise offer, or can make it spend unbounded work, and whether the widened fold opens an injection path. It found no security defect; the evidence is recorded below so the clean result is a checked result rather than an assumption.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-14` (module header, import surface)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197-245` (typed reader and its boundary constants)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:316-476` (escaping, pattern construction, fold, occurrence scan)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:599-615` (generated-table contract tests)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. F001 and F002 from iteration 1 remain active and are carried forward.

### P2 Findings

None new.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Unchanged from iteration 2: the document bullet is narrower in code (F005). The security-relevant scope claim at `spec.md:165` (no holdout text read) was respected: this iteration read only source and test files. |
| `checklist_evidence` | partial | Unchanged from iteration 2: `CHK-FIX-002` overstates matrix coverage (F006). `NFR-P01` at `spec.md:162` claims a constant number of regex passes for the fold, which the fold satisfies: five `.replace` calls plus four single-pass regexes, none of them looped. |
| `skill_agent` | notApplicable | No agent definition in scope for this dimension. |
| `agent_cross_runtime` | notApplicable | No runtime mirror is touched. |
| `feature_catalog_code` | notApplicable | No feature catalog row covers a prompt-normalization security property. |
| `playbook_capability` | notApplicable | No playbook scenario exists for a security property of the mention guard. |

## Integration Evidence

None this iteration: the trust-boundary review stayed inside the module and its consumer contract already cited in iteration 1.

## Edge Cases

- Ambiguity: whether a prompt that suppresses its own command offer is a security issue. It is not: the guard can only withhold an offer, never add one, and the reader can still type the command. Recorded as out of the security boundary rather than as a finding.
- Contradiction: none.
- Partial success: the module cannot be exercised through the real advisor entry point without running the suite, which this lineage does not do; the exported functions were measured directly, which is sufficient for a cost and trust-boundary check.
- Missing dependency: no secret or environment read exists to audit, so the absence was confirmed by reading the whole file rather than by a scan of one region.

## Confirmed-Clean Surfaces

- No import, `require`, `process.env`, filesystem or network access anywhere in `command-attach.ts`: the module reads only its arguments. Verified by scanning the whole file for import and environment forms, which returned nothing.
- No prompt-controlled pattern: the `command` argument reaches the regex only through `escapePhrase` at line 316, and every caller passes a name from the generated tables (`attachCommand` line 527, `withholdMentionedCommands` at `fusion.ts:1212`, `typedCommandForTop` line 259). A prompt cannot contribute regex syntax.
- No injection or escalation path: `commandOnlyMentioned` returns a boolean, and its only effect is to withhold an offer at `attachCommand:527` and to clear `passes_threshold` at `fusion.ts:1214`. A crafted prompt cannot make the advisor emit a command it would not have emitted for the same route without the guard.
- No super-linear blow-up from the new patterns: a 100 KB prompt with one occurrence evaluates in 1.56 ms, a 25 KB or-list alternation in 1.24 ms, a 68 KB prompt whose tail repeats `and don't run it` 4,000 times in 2.08 ms, and 2,000 unled occurrences in 2.62 ms. The one costly shape, 2,000 led occurrences in 54 KB at 334 ms, is the pre-existing per-occurrence pattern construction that review pass twelve already measured and ruled out; the two new rules add one compile per occurrence to a loop that already built five.
- No output, log or error path carries prompt text: the module has no logging and no throws on the prompt path.

## Ruled Out

- ReDoS in `COMMAND_DECLINED_BY_PRONOUN`: the pattern is an alternation of fixed literals with one bounded optional adverb group and no nested quantifier over the same text; the 68 KB repetition probe stays at 2 ms.
- ReDoS in `COMMAND_AS_DOCUMENT`: the pattern is anchored at `^` and matches a fixed noun list, so it cannot backtrack across the prompt.
- A homoglyph or zero-width bypass of the fold: a form that does not name a tracked command never matches `TRACKED_COMMANDS`, so no route selects a command, and the fold never makes a non-command match one.
- A denial-of-service from the widened fold: dropping six more characters does not change the pass count, and every replace is a single global pass.

## Next Focus

- Dimension: maintainability.
- Focus area: the comment block the diff reflowed and the readability of the new rules' documentation.
- Reason: three dimensions are covered and the security pass is clean; maintainability is the last dimension and the diff visibly reflowed a comment paragraph.
- Rotation status: correctness, traceability and security complete; maintainability last.
- Blocked/productive carry-forward: productive `whole-file scan for imports and environment reads`; cheap and decisive for a clean security result.
- Required evidence: line lengths and quoted text from the reflowed comment block.
- Recovery note: none.

Review verdict: CONDITIONAL

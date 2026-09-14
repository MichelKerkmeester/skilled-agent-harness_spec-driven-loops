# Iteration 3: The class-two specimen, the memory save rule, plus the sixth, unnamed candidate

focusTrack: redundant-detail

## Focus

Does the memory save rule (AGENTS.md:280-286) explain what a delegate already owns, which of its bullets reduce to a pointer under the three-way test, and does the Documentation & Honesty mandates table (AGENTS.md:474-479) repeat the pattern? (Strategy question Q3.)

## Actions Taken

1. Rendered prompts/iteration-003.md, then read the root rule's five bullets in place (AGENTS.md:280-286) and fixed the clause inventory: the trigger clause (281), the use-it/carry-over clause (282), the no-folder hard block (283), the compose-plus-methods clause (284), the what-the-save-writes clause (285), the post-save review clause (286).
2. Read the first delegate, the save-workflow reference (627 lines, targeted): its core principle, its workflow steps, its compiled-path prefabs, its writer contract, its post-save quality review section.
3. Read the second delegate, the /speckit:save command (92 lines): its router contract, its step 6, its presentation row.
4. The sixth candidate: checked the mandates table (AGENTS.md:475-479) against the uncertainty-and-honesty rule already loaded at this session's Gate 5, whose own lines 41-42, 48-49, 62, and 72 carry the clauses.

## Findings

- **F-003-1 (OBSERVED — class two, confirmed, case one on three of five bullets).** The specimen carries what its delegates carry, and the delegates say so in their own words.
  - *The exact compiled path, five occurrences across three documents.* The root spells `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js` at AGENTS.md:285; the reference spells the same path at save-workflow.md:211, 216, 222, and 244 (the last as the preflight: "Script exists | `test -f .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`"); the command spells it at save.md:19 and :68. [SOURCES: AGENTS.md:285; .opencode/skills/system-spec-kit/references/memory/save-workflow.md:211,216,222,244; .opencode/commands/speckit/save.md:19,68]
  - *What the save writes.* The root: "The save writes metadata, not prose. The continuity writer ... refreshes the generated metadata pair, and canonical doc content is owned by a different path." (AGENTS.md:285). The delegate's own lines: "packet narrative remains in canonical docs rather than a parallel memory note" (save-workflow.md:331), the canonical-docs-continuity tree (:296), and the command: "Canonical spec-doc content is authored in the packet documents themselves; the writer owns the continuity frontmatter and the generated metadata pair." (save.md:61, repeated at :90). [SOURCES: AGENTS.md:285; save-workflow.md:296,331; save.md:61,90]
  - *The post-save quality review.* The root: "Read the post-save quality review before calling the save done. HIGH issues must be patched by hand; the review is emitted, not advisory decoration." (AGENTS.md:286). The delegate's own section: "After `generate-context.js` completes, it emits a **POST-SAVE QUALITY REVIEW** block." (save-workflow.md:553) with the table row "**HIGH** | MUST manually patch via Edit tool (fix title, trigger_phrases, importance_tier)" (:559) and "### Common HIGH Issues" (:563); the command repeats it as step 6: "run the writer, inspect the post-save quality review, and patch HIGH metadata issues when practical" (save.md:61). [SOURCES: AGENTS.md:286; save-workflow.md:553,559,563; save.md:61]
  - *Who composes what.* The root: "Compose the session JSON yourself rather than letting the generator reconstruct one — you have strictly better information about your own session than any reconstruction does. Method selection, execution paths and validation checkpoints: `system-spec-kit/references/memory/save-workflow.md`." (AGENTS.md:284). The delegate's own workflow: "3. AI agent creates structured JSON summary (the main agent or a delegated packet writer can invoke generate-context.js for memory under distributed governance) 4. AI agent calls `generate-context.js` with JSON data" (save-workflow.md:151-152), under the core principle "All paths feed the same canonical save entrypoint" (:24). [SOURCES: AGENTS.md:284; save-workflow.md:24,151-152]
  - *The three-way calls.* Bullets 284 and 286: **case one** — a delegate exists (the 627-line reference, the 92-line command) and genuinely carries the mechanics, so the root keeps a pointer; this finding quotes the delegate's own lines above. Bullet 285: **case one, with one residual** — the path, the writes-explanation, and the ownership statement are the delegate's; what survives locally is the frontmatter-shortcut clause ("Editing the continuity frontmatter directly is a legitimate shortcut when only continuity changed"), which neither the reference's frontmatter rows (:259) nor the command's :25 "Do not hand-edit generated metadata to stand in for a save" states as a shortcut; it is the one clause with no.delegate. Bullets 282-283: **case three** — prompt-time discipline: which spec folder applies, whether Gate 3 was answered in this session, and what to ask when it was not, are session state no reference can carry; they are exactly section 6's stated exception and section 8's whole design, and they stay.
- **F-003-2 (OBSERVED — the sixth, unnamed candidate, mandates table AGENTS.md:474-479: partially confirmed).** The heading's expanded-by pointer already routes to `repo-rules/uncertainty-and-honesty.md` (AGENTS.md:474). Of the three mandates: "Never fabricate | Use 'UNKNOWN' when uncertain" (477) restates the rule's own "Write `UNKNOWN: <what you don't know>` and add what would resolve it" (uncertainty-and-honesty.md:62) under the rule statement "Never fabricate. Mark the confidence you actually have" (:41-42) — **case one**, the delegate's line quoted. "Explicit uncertainty | Prefix claims with 'I'M UNCERTAIN ABOUT THIS:'" (479) restates the rule's "Flag a claim shakier than the prose around it inline: `I'M UNCERTAIN ABOUT THIS: ...`" (uncertainty-and-honesty.md:72) — **case one**, the delegate's line quoted. "Clarify threshold | Ask if confidence < 80% (see §2 Confidence Thresholds)" (478) is **case two, deliberately**: the delegate's own section 1 says "The scale is the Confidence Thresholds table in `AGENTS.md` §2 and there is exactly one of it; this file carries no second copy" (uncertainty-and-honesty.md:48-49), the delegate points back at the root, so the scale must stay. The reducible residue: mandates 477 and 479, which the pointer at 474 plus the delegate's own sections already reach; what stays is the 478 row and the pointer, which is the reference's own design, not duplication.
- **F-003-3 (OBSERVED — the duplication breeds a near-contradiction; observation, not a third class).** The root's "Editing the continuity frontmatter directly is a legitimate shortcut when only continuity changed" (AGENTS.md:285) and the command's "The writer is the only write path. Do not hand-edit generated metadata to stand in for a save." (save.md:25) plus "the writer owns the continuity frontmatter" (save.md:61) reconcile only by scope: the command's rule governs a /speckit:save run, the root's shortcut governs a continuity fix outside one. Both-true, but nothing in either document states the scope line, and the reference's :259 frontmatter row does not mention the shortcut at all. Recorded as redundancy's cost, an instruction pair the next editor will trip on; not class one (both clauses exist) and not a LOGIC-SYNC halt (nothing fails).

## Questions Answered

- Q3 answered: the specimen confirms as class two. Three of five bullets (284's pointer half, 285, 286) are case one and reducible to a pointer plus the one residual clause; the trigger pair (282-283) is case three and stays; the sixth, unnamed candidate is two-thirds case one with its 80% scale case two by the delegate's own back-pointer.

## Questions Remaining

- Q4: the five named class-two candidates (git safety table, validate.sh subsection, Gate 3, advisor metadata placement, MCP routing).
- Q5: the section 6 shape question, adjudicated after the evidence lands.

## Sources Consulted

- AGENTS.md:280-286 (the specimen), AGENTS.md:474-479 (the sixth candidate)
- .opencode/skills/system-spec-kit/references/memory/save-workflow.md:20-32, 151-152, 211-244, 255-271, 296, 331, 553-578, 616
- .opencode/commands/speckit/save.md:1-92 (router contract, step 6, presentation row)
- .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js (existence, iteration 2)
- repo-rules/uncertainty-and-honesty.md:41-42, 48-49, 62, 72 (loaded at this session's Gate 5; not re-read)

## Assessment

- newInfoRatio: 1.0
- Novelty justification: the specimen's clause-by-clause verdict, the triple-copy census of the compiled path, the sixth candidate's split, and the scope-tension observation are all first recordings in this packet; nothing repeats iterations 1-2.
- Confidence: every quoted delegate line is OBSERVED (read this session, or held from the Gate-5 load with its line numbers). The "no delegate carries the shortcut clause" call is a completeness claim over two delegate documents read this session; INFERRED residue: a third document (the command's own references) could also state it, what would confirm: grepping the presentation assets the command renders.

## Reflection

What worked: reading BOTH delegates before verdicting. The command surface turned out to carry the heaviest duplication (the exact path twice, the ownership sentence, the review step), which the reference-only reading would have missed; the case-one quotes needed the delegate that actually reaches the operator.
What failed: the first clause-coverage grep under-returned (my pattern missed "frontmatter directly"), costing one extra targeted pass; and the reference's 627 lines defeated a full-read, so the clause search was targeted, which trades recall for budget. Both noted, neither cost a finding.
Ruled out (see deltas/iter-003.jsonl): that the save mechanics lack a delegate.

## SCOPE VIOLATIONS

None. Every write this iteration stayed inside the lineage directory.

## Recommended Next Focus

Iteration 4: the five named class-two candidates, first half. The git safety table (AGENTS.md:318-331) against the sk-git skill's own documentation: which rows' mechanics the skill genuinely carries (case one, quoting its lines) and which the root must keep. Then the validate.sh subsection (AGENTS.md:272-278) against references/validation/validation-rules.md: who owns the four traps and the RESULT: PASSED requirement. Then Gate 3's vocabulary (AGENTS.md:63-77) against the classifier: does the gate-3-classifier's own stable-labels contract carry the A-E definitions, and what survives for the non-hook runtime.

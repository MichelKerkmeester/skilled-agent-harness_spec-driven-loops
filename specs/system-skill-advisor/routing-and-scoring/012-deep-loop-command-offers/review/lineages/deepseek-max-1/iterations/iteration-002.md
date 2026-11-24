# Iteration 2 - security

## Dispatcher

- Lineage: `deepseek-max-1`, generation 9, run `fanout-deepseek-max-1-1795552859377-13gxwk`
- Dimension: security
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: this pass reads the input-handling half of the traceability surface — REQ-030 (long prompts stay cheap) and REQ-049 (whitespace inside a loop phrase) — and checks them against both transports before the traceability passes map every REQ.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257` (`ADVISOR_PROMPT_MAX_CHARS`)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:481` (prompt cut before routing)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:482` (`escapePhrase`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784` (`LEAD_WINDOW`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:884` (`lowerFolded`)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` (`trackedCommandForOwner`)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1511` (`stripLeadingPastedReply` call in `degradedRecommendations`)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:216` (typed fields parsed from the Python subprocess)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52` (`ADVISOR_PROMPT_MAX_CHARS`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` (`_advisor_prompt_head`, UTF-16-unit cut)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5098` (`_fold_quotes`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5230` (`_LEAD_WINDOW`)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:254` (REQ-030)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:273` (REQ-049)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Zero-width format characters inside a loop phrase still lose the offer** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:884` -- Both gate copies fold curly apostrophes and collapse whitespace runs, and a phrase pattern keeps a literal single space between its words (`escapePhrase` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:482` escapes metacharacters only). `\s` covers U+00A0 but not U+200B or U+FEFF, so a prompt pasted out of a PDF or a web page that carries a zero-width space between `deep` and `review` offers no command at all, while the same prompt carrying a non-breaking space now keeps it. The same gap sits in the fallback at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5109`. Impact is a lost offer on pasted text, never a falsely offered command, and the stated contract names whitespace only, so this is hardening beyond REQ-049 rather than a broken requirement.
   - Finding class: input-normalization gap
   - Scope proof: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` are both on `review-scope-files.txt`, and both lines were read at this exact revision.
   - Affected surface hints: `lowerFolded`, `_fold_quotes`, every phrase pattern built through `escapePhrase`, and the fixture rows that pin REQ-049.
   - Case: a request reading `run a deep<U+200B>review of the auth module`, pasted from a page that inserts a zero-width space, is read as no loop ask because `lowerFolded` leaves the character in place and the phrase `deep review` never matches.
   - Claim adjudication:
     - `type`: `input_normalization_gap`
     - `claim`: a zero-width space (U+200B) or a byte-order mark (U+FEFF) between the words of a loop phrase prevents the phrase from matching in either gate copy, so the command the reader asked for is withheld.
     - `evidenceRefs`: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:884`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:482`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5109`
     - `counterevidenceSought`: checked whether either fold maps zero-width characters (neither pattern names them), whether the phrase patterns join words with a whitespace class rather than a literal space (`escapePhrase` leaves the space literal, and Node confirms the folded string still does not contain `deep review`), and whether a fixture row already pins this input (no row in `deep-loop-offer-cases.json` carries U+200B or U+FEFF).
     - `alternativeExplanation`: the omission may be deliberate, because a zero-width character can legitimately sit inside a word and folding it would alter a prompt the reader wrote; `lowerFolded` is documented as never rewriting the prompt.
     - `finalSeverity`: P2
     - `confidence`: 0.86
     - `downgradeTrigger`: if the team decides pasted format characters are outside the gate's contract and should be normalized by the caller, the row drops to a documentation note rather than a defect.

## Traceability Checks

- `spec_code` — partial. REQ-030 was traced on both transports: the native schema caps at `ADVISOR_PROMPT_MAX_CHARS` (`advisor-tool-schemas.ts:257`), the hook routes on that cut (`skill-advisor-brief.ts:481`), and the Python head counts JavaScript code units so an astral character costs two, which keeps the two cuts identical on every prompt (`skill_advisor.py:889`). REQ-049 was traced: both folds collapse `\s+` to one space, and the NBSP case resolves. The REQ-001 to REQ-029 and REQ-031 to REQ-048 slice is still unmapped, so the protocol stays partial.
- `checklist_evidence` — partial. This pass added the security checklist rows to the set already read: `CHK-030`, `CHK-031` and `CHK-032` name no secret in a changed file, policy `ask` on both deep commands and no auth surface, and the code read here agrees. The full task checklist is not checked yet.

## Integration Evidence

- Command surface: `.skilled/commands/deep/review.md` and `.skilled/commands/deep/research.md` reach this gate only through the advisor; neither file contains a gate copy, so a normalization fix belongs in the two runtime copies and the shared fixture, not in the command documents.
- Subprocess surface: `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:216` re-reads `command`, `policy`, `ownerSkillId` and `typed` from the Python result and only keeps well-typed values, so a malformed fallback row degrades to no command rather than an unvalidated one.
- Degraded-render surface: `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1571` reads `trackedCommandForOwner(entry.skill, entry.command)` at the point the supplied string reaches the row, which is the hardening REQ-038 asks for.

## Edge Cases

- A prompt above the cap: the native hook cuts at 10,000 code units after dropping a pasted reply, and the Python gate cuts with the same unit count. A loop phrase that sits after the cut is not read by either copy, which is the intended contract rather than a miss.
- A prompt with a zero-width character inside a word rather than between words (`rev<U+200B>iew`) is not a loop name in any reading, so the gap reported above is about the boundary between words only.
- A pasted earlier reply that contains `/deep:review` is stripped before the gate reads the prompt (`skill-advisor-cli.ts:1511`), so a quoted command is not a typed one on the degraded path.
- A tracked command supplied for another skill: `trackedCommandForOwner` returns undefined, and the row loses `command`, `policy`, `ownerSkillId` and `typed` together rather than printing a partial row.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` — the head cut counts a non-BMP character as two units, so the Python gate and the native `.slice` read the same prefix; REQ-030's parity clause holds for astral input as well as ASCII.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5230` — both copies bound a lead read at 400 characters, so a 96,000-character prompt cannot make one phrase's prefix scan quadratic.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1590` — the only commands the deep gate attaches are `/deep:review` and `/deep:research` with policy `ask`, plus `/doctor:deep-loop` on a stuck complaint; no prompt shape reached a command with policy `run` or a mutating command in this read.
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:216` — the subprocess result is re-typed field by field before it reaches a row.

## Ruled Out

- Astral-character cut divergence between the transports: ruled out at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:889`, which counts two units per non-BMP character and never splits one.
- ReDoS through an unbounded prefix scan: ruled out for the lead-reading patterns by the 400-character window in both copies; the remaining patterns are fixed alternations without nested quantifiers over the prompt.
- A forged command through the degraded renderer: ruled out at `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489`, whose tracked-table lookup drops a command the row's skill does not own.

## Next Focus

- Dimension: traceability
- Focus area: `spec_code` for REQ-001 to REQ-034 — every requirement mapped to the code or the ADR that records it, with the fail-closed clauses named.
- Reason: two dimensions are covered; the operator focus makes traceability the lead, and the REQ table is the largest unmapped surface.
- Rotation status: correctness and security done; traceability and maintainability remain.
- Blocked/productive carry-forward: productive — reading both gate copies resolves a clause faster than reading the packet's prose.
- Required evidence: one file:line per requirement, and an ADR section for every requirement an ADR amends.
- No recovery note: this pass was not a recovery iteration.

Review verdict: PASS

# Iteration 1: Packet map, process error (a) and the link-scan error class (b)

## Focus

Two things: establish the epic's map from the packet's own records (children 001 to 011, rounds one to four, the round-four parent log) so later iterations do not rediscover it, and trace the first two process errors to their producing mechanism: (a) the helper whose `String.replace` read a dollar-apostrophe sequence as a replacement pattern and pasted a tasks.md tail twice, and (b) the validator that tried to resolve link-shaped text (close-bracket open-paren) inside task text as a link. This is the dispatcher's Part 1 first slice and answers Q1 fully and Q2 partially.

## Actions Taken

1. Read the round-four parent `goal.md` log, `005-doc-claims-hardening`'s `goal.md` log, `tasks.md`, `plan.md`, `implementation-summary.md`, and its scratch `fix-chain.json`, `fix-units.json`, `check-units.cjs`.
2. Searched all packet goal logs and implementation summaries for recorded deviations, findings and re-mint steps; catalogued the round-four child list and each child's own follow-ups.
3. Read the link-scanning code paths in `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`, `heal-spec-docs.cjs` and `runtime/lib/validation/spec-doc-structure.ts`.
4. Read the changelog generator fix for the same replacement-pattern class at `nested-changelog.ts:569-577` and the user-visible incident at `system-spec-kit/changelog/v2.1.3.0.md:14`.
5. Grepped the packet's tasks.md files for the exact link-shaped byte pattern `](` outside backticks.

## Findings

1. **Process error (a) is the JavaScript replacement-pattern expansion of `$'`, and the exact triggering string survives in the packet.** T050's check text ends with `...It reports$' .skilled/...`; the same check string is carried in `fix-chain.json` and `fix-units.json`. When a JS helper inserts the fix unit into tasks.md by passing that text as the **string** replacement argument of `String.replace`, `$'` is not literal text: it expands to the portion of the target string after the match, so the tasks.md tail was inserted a second time. The packet records the outcome verbatim: "The fix-unit insertion pasted the file tail twice, because a shell `$'` sequence in T050's check text was read as a replacement pattern." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/tasks.md:79] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/fix-chain.json:2] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/goal.md:93] — **CONFIRMED** (read). **P1 by external-user impact**: the insertion helper is internal, but the same class already reached users (finding 2). **Smallest fix**: when any helper inserts authored text with `String.replace`, pass a replacer function (`() => text`) instead of a string — one line, the pattern the repo already ships (finding 2). No new module, no option.

2. **The identical class already shipped to users once, and the repo's existing fix is the canonical pattern to copy.** The nested changelog generator read `$'` or `$&` in a user-authored summary as a replacement pattern and "cut the summary short and pasted template text in its place"; its fix is a single-pass replacer function with a durable comment naming both sequences: "A string replacement reads `$&` or `$'` in a value as a pattern, and a key-by-key loop would rewrite a placeholder that an earlier value happened to contain." [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.1.3.0.md:14] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:569] — **CONFIRMED** (read). **P1**: user-authored spec text can corrupt a generated changelog through a literal `$'` in a summary. **Smallest fix**: none new — cite `nested-changelog.ts:572-577` as the pattern; any new linter for `.replace` call sites is REJECTED (see Ruled Out) because both known sites are already fixed and a scanner would have no caller today.

3. **The insertion step had no post-insertion shape check; only a pre-edit occurrence check exists.** `check-units.cjs` proves each edit unit's OLD span occurs exactly once in its file before the edit, but nothing verifies the assembled tasks.md grew by the expected amount, so the doubled tail was caught by reading, not by a check. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/check-units.cjs:14] — **CONFIRMED** (read). **P2**: the missing check lengthened the repair (the orchestrator rebuilt tasks.md from its parts); external users running packet automation can hit the same silent corruption. **Smallest fix**: in the insertion helper itself, compare `content.split('\n').length` before and after and exit non-zero on an unexpected delta — no new artifact, and it must be part of the same one-line replacer change from finding 1.

4. **Process error (b) is the link-scanner class: matchers must blank code spans and fences before resolving `](`, and the current tree guards it in three scanners.** `check-markdown-links.cjs` blanks fenced blocks and inline code spans before matching ("code spans are literal text, not link surface"; test rows "inline-code link ignored" and "real link on same line as inline code caught"); `heal-spec-docs.cjs`'s link-repoint lane skips fenced lines and blanks code spans before scanning inline link targets; the validator's anchor parser skips fences and blanks spans because "Matching inside code would read those examples as real anchors and report the surrounding document as corrupt". [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:95] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:130] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/heal-spec-docs.cjs:1244] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:601] — **CONFIRMED** as a class (read). The specific incident is **UNKNOWN** in the packet: no goal log, implementation summary or commit body names the validator run that flagged task text as a link. What would settle it: the failing run's stderr, or the pre-repair copy of the tasks.md that carried the text. **P2** while unguarded in any scanner; the guards exist, so the durable fix is to keep this behavior pinned in each scanner's tests (the link guard ships known-bad cases).

5. **The packet itself contains the exact byte shape (b) describes.** `002-surface-contract-alignment/tasks.md:65` carries the backticked regex `` `["']([^"']+)["']` `` — inside that code span, the bytes `"](` are a close-bracket/open-paren pair; a scanner that does not blank code spans reads link text `["']` and a link target `([^"']+)["']` and then tries to resolve it. This is the in-packet specimen of the class, and the reason a task-text scanner must treat code spans as inert. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/tasks.md:65] — **CONFIRMED** (read). **P2**; **smallest fix**: none — the current scanners already blank spans; this row is the regression specimen to keep in a fixture.

6. **The same producing mechanism has a silent-pass twin in the validator: single-notation matchers.** `bindingRowTarget` now accepts bare text, a code span, and a markdown link for a goal binding row, because "Recognising only one of them let the other two name a child that was never written and still pass, which is the whole failure this rule exists to catch". That is the mirror image of (b): one matcher resolved text as a link (false positive), the other failed to resolve a link-shaped binding (false negative); both stem from hand-written prose parsed by a matcher that knows one notation. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1111] — **CONFIRMED** (read). **P2** by external-user impact (packet tooling), and it feeds the validator-hardening phase in the final synthesis.

## Ruled Out

- **A new repository-wide linter that rejects `String.replace(` calls whose second argument is not a function.** Rejected under `.skilled/repo-rules/prevent-overengineering.md`: both known live sites of this class are already fixed (`nested-changelog.ts` uses a function replacer; the round-four insertion helper is a one-off that no longer runs), so the linter would add a checker with no current failing caller, and its regex would need constant maintenance for false positives. The durable fix is the function-replacer pattern, not another scanner.
- **Reproducing the (b) incident by re-running a validator on a synthetic tasks.md.** A synthetic fixture proves the class, which the code and its shipped test rows already prove (`check-markdown-links.cjs` test table). It would not identify which validator produced the incident, so it adds no root cause. Deferred unless a later iteration finds the incident record.

## Dead Ends

- The packet contains no run log or stderr from the (b) incident. `rg` over all goal logs, implementation summaries and commit bodies for "link-shaped", "tried to resolve", "task text" finds only the 013 brief's own wording. Carried as an open question with the two settling artifacts named in finding 4.

## Edge Cases

- Ambiguous input: "the spec validator" in the brief could mean `validate.sh`, `check-markdown-links.cjs`, `heal-spec-docs.cjs` or `verify_doc_claims.cjs`. Chosen interpretation: the class that resolves `](` text, traced across all candidate scanners; the incident-specific attribution stays UNKNOWN with what would settle it.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: Q1 is answered; Q2's (b) half is answered as a class with the incident unrecorded. `Status: complete` for the iteration because the evidence gathered answers the in-scope question at the class level and names the settling artifacts.
- **Contract conflict recorded (not halted on).** The deep-research prompt pack says the append gateway is the only writer of `deep-research-state.jsonl`, while the dispatcher's output contract requires the canonical state record to carry `findingsCount` per iteration. The gateway's projection drops non-schema fields (it folds the ledger event into a minimal `{type,iteration,run,status,newInfoRatio,ruledOut,timestamp}` row). Resolution followed the r3-dsflash-llmgw precedent: the rich canonical record lives in `iteration-001-record.json` and as line 1 of `deltas/iter-001.jsonl`, both carrying `findingsCount`, and the gateway-owned projection is left untouched for what the runner reads. Both facts are true in the artifacts; no write was made outside the lineage.

## Questions Answered

- Q1: What mechanism produced process error (a), where a helper's String.replace read a dollar-apostrophe sequence as a replacement pattern and pasted a tasks.md tail twice? — answered (findings 1 to 3).
- Q2: What mechanisms produced process errors (b) to (e): the validator parsing link-shaped task text, the reviewer wildcard rm, the committed regenerated scratch tree and the claims made before verification? — partial: (b) answered as a class, (c) to (e) not yet.

## Questions Remaining

- Q2 (c) to (e), Q3 to Q10.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/goal.md:93
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/tasks.md:79
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/fix-chain.json:2
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/fix-units.json:2
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/check-units.cjs:14
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/tasks.md:65
- specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/implementation-summary.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/goal.md
- .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:95,130,176
- .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1244
- .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:601,1111
- .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:569
- .skilled/skills/system-spec-kit/changelog/v2.1.3.0.md:14

## Assessment

- New information ratio: 0.90
- Questions addressed: Q1, Q2 (b half)
- Questions answered: Q1

## Reflection

- What worked and why: starting from the packet's own goal logs led straight to the recorded cause of (a); the scratch `fix-chain.json` preserved the exact `$'` trigger, which makes the root cause fully evidence-backed rather than inferred.
- What did not work and why: hunting the (b) incident through validator code and git history could not find the incident record; the packet simply does not carry it. The class-level answer is solid but the incident attribution stays UNKNOWN — cheaper to carry as an open question than to keep spending budget.
- What I would do differently: for the remaining process errors, read the specific child implementation summaries and goal logs first (each error seems anchored in one child), instead of searching repo-wide first.

## Recommended Next Focus

Iteration 2: Part 1 (c) to (e) — the reviewer wildcard `rm` that deleted scratch helpers, the regenerated scratch tree that got committed, and the claims made before verification — mined from the round-four children's goal logs and implementation summaries, then broaden into (f) the generated-artifact re-mint list.

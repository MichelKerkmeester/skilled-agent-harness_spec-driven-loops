You are a mechanical editor in one repository. Do exactly the steps below, nothing more.
Repo root: {REPO_ROOT} (all paths from there).

RUN CONTEXT + DON'T                     <- paste the two blocks from Move A verbatim, unedited

STEP 1 — {ONE-LINE CHANGE STATEMENT}
Scope: {N} files at {GLOB}. Anchor: {FILE}:{LINE} shows the current shape.
{IF SENTINEL} The edited region is delimited by {SENTINEL_BEGIN} / {SENTINEL_END}; edit only between them.
In each file:
  a. {EXACT EDIT A — the literal old text and the literal new text}
  b. {EXACT EDIT B, or omit}
Accept when: {N} files changed, each with {per-file edit count and shape}.

STEP 2 — add the {ASSERTION_NAME} checker family
In scripts/check-corpus.cjs add function {CHECK_FN}(file, src) modelled on checkLegend (line 1566):
regionsOf(stripHtmlComments(src)), tally('{ASSERTION_NAME}', 1),
record('{ASSERTION_NAME}', 'error', file, <message>).
It errors when {EXACT FAILING CONDITION}. Message states what is wrong and why.
Register beside checkLegend(name, src); / checkTooltipCard(name, src); at lines 2543-2544.
Accept when: node --check passes and the corpus run prints RESULT: PASSED.

STEP 3 — prove it fires
Copy {ONE FILE} to {PACKET}/scratch/mutant.html, reintroduce the defect, run
  node .../check-corpus.cjs --extra {PACKET}/scratch
Expect RESULT: FAILED plus unrelated copy findings; take only the {ASSERTION_NAME} line.
Append it verbatim to {PACKET}/scratch/mutations.md, then delete mutant.html.

STEP 4 — {DOC CORRECTION, or delete this step}
{DOC_FILE}:{LINE} says {CURRENT WORDING}. The shipped value is {SHIPPED}. Rewrite so {RULE}.
Change nothing else in the file.

VERIFY — paste each command with its result line
  node --check .../check-corpus.cjs
  node .../check-corpus.cjs                       # must print RESULT: PASSED
  {PROOF_GREP}                                    # {EXPECTED COUNT / no-match note}
  rg -c "{ASSERTION_NAME}" .../check-corpus.cjs   # >= 3

HANDBACK — paste the PI_HANDBACK block from Move A verbatim

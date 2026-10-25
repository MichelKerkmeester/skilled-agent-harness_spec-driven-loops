# Iteration 12: Second-model re-check 2 of 5 — RA-1, RA-2, RA-11 and ranks 1 and 3

## Focus

Re-test on current disk the three OBSERVED facts that rank 1 and rank 3 rest on, and the
rank claims themselves, under a second model family. The three facts are RA-1 (the only
positive surface marker is `.skilled/` and the detector returns only SKILLED or UNKNOWN),
RA-2 (UNKNOWN persists until the user clarifies, with no saved repository declaration) and
RA-11 (`check-rule-copies.js` is a canary with no policy loader). The focus also asked for a
repository search for any existing repo-owned review profile or policy file that review
already reads. Nothing here re-derives the rankings; it tests the quoted facts and the
premises the two INFERRED rows depend on.

## Actions Taken

1. Read `research/research.md` sections 2, 6 and 7 to take the exact claim text and the
   cited anchors for RA-1, RA-2, RA-11, rank 1 and rank 3.
2. Grep the three anchors at once across `.skilled/skills/sk-code` to confirm the quoted
   lines still sit where the synthesis says they do.
3. Read the whole `detect_surface_evidence` body in the review packet, not just the two
   anchor lines, because "returns only SKILLED or UNKNOWN" is a claim about the function's
   complete return set and cannot be settled from two isolated lines.
4. Grep `check-rule-copies.js` for every file-read and every `policy`/`profile` token, which
   is the direct test of "no policy loader" rather than a reading of the header comment.
5. Grep `.skilled` and then the repository root for repo-owned review profile or policy
   naming and content, to test whether a loader could exist that the review packet never
   names.

## Findings

**F-12-01 — RA-1: CONFIRMED (OBSERVED).** The constant is still the sole positive marker,
and the function's complete return set is the two documented values. The marker is
`SKILLED_PATH_MARKER = ".skilled/"` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:223]
and the docstring fixes the contract as `Return SKILLED or UNKNOWN, in the shared contract's
precedence.` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:226]. The body has
exactly two exits, `return "SKILLED"` at
[SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:239] and `return "UNKNOWN"` at
[SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:241]. No other marker constant and
no other return value appears between them. This matters because rank 3 proposes that a
profile declare surface evidence; the detector it would extend has no third state to put
that evidence in today.

**F-12-02 — RA-2, first half: CONFIRMED (OBSERVED).** UNKNOWN is terminal until a human
speaks. The shared contract says everything outside the hub's own directory
`stays UNKNOWN until the user clarifies the surface`
[SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:34], and the hub's
UNKNOWN row is an explicit human step, `User-selected verification command set before
completion claim` [SOURCE: .skilled/skills/sk-code/ROUTER.md:171]. So the cost of an
unrecognised repository is a question asked on every review, not a one-time setup.

**F-12-03 — RA-2, second half ("no saved repository declaration"): CONFIRMED (DERIVED from
two negative searches).** No repo-owned review profile or policy file exists in the hub, and
the detector could not read one anyway: `detect_surface_evidence` receives `read_text(path)
returns a file's text, or ""` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:229]
but never calls it, so its decision uses only the task text and the supplied path list. A
content search of `.skilled` for review/repo profile and policy naming returned 31 hits and
none belongs to `sk-code-review` or `sk-code/shared`: they are a Codex executor profile
fixture (`cli-codex/manual-testing-playbook/agent-routing/review-profile.md`), the advisor
launcher's `// Repo policy defaults, applied only when the environment stays silent`
[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:78], deep-review's
`POLICY_INPUT: 'deep-review-policy-input'` artifact type, and sk-doc playbook authoring
rules. Scope caveat: the repository-wide pass hit the 60-match cap and its visible hits were
all spec prose, so "no declaration anywhere in the checkout" is CONFIRMED only for `.skilled`
and INFERRED for the rest of the tree.

**F-12-04 — RA-11: CONFIRMED (OBSERVED + DERIVED).** The header states the role,
`It is a canary, not a generator: it asserts the load-bearing substrings still`
[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:19], and the
file has exactly one read path, `return fs.readFileSync(path.resolve(root, relPath), 'utf8');`
[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:190]. A search
for `readFileSync|require\(|policy|profile` over that file returned that single line, so no
`policy` or `profile` token appears anywhere in it and every assertion it makes is against a
fixed path list. The checker cannot carry repository values, which is the premise rank 1
uses for "tune review only by forking it".

**F-12-05 — NEW: the detector already has an unused evidence hook (DERIVED).** The signature
takes a `read_text` callback and binds it, `read = read_text or (lambda path: "")`
[SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:233], but the body between that
binding and the two returns never invokes `read`. Rank 3 as written would add a declaration
channel to a function that already advertises a content-reading parameter it does not use.
The cheapest version of rank 3 therefore extends an existing signature instead of inventing
a new one, and the absence of any call site is also the strongest single piece of evidence
that review reads no policy file today (F-12-03). This is the only fact this iteration adds;
everything else re-confirms the synthesis.

**F-12-06 — Rank 1 premise: CONFIRMED; the recommendation stays INFERRED.** Rank 1's factual
base is RA-9 plus RA-11 ("a repository can tune review only by forking it"). RA-11 is
CONFIRMED at F-12-04, and the packet-side search found no configurable policy channel, so
the premise holds. The row's INFERRED label is about the proposed design — path, schema and
precedence are still a decision, and nothing here tests whether a repo-root dot-file is read
by any layer. Verdict: premise CONFIRMED, proposal NOT TESTED.

**F-12-07 — Rank 3 premise: CONFIRMED; its routing sub-claim NOT TESTED.** Rank 3 rests on
RA-1 (F-12-01) and RA-2 (F-12-02, F-12-03), both CONFIRMED, and it cites only the marker
line. Its second column, that a routing change "must reach `hub-router.json` and `ROUTER.md`",
was not exercised; confirming it needs a fixture surface replayed through both routing stages,
which is the same proof E-4 already names. Verdict: premise CONFIRMED, routing claim NOT
TESTED.

### Claim verdicts

| Claim | Verdict | Basis |
|-------|---------|-------|
| RA-1 sole positive marker, two-value return set | CONFIRMED | F-12-01, whole function read |
| RA-2 UNKNOWN until the user clarifies | CONFIRMED | F-12-02, both contract lines |
| RA-2 no saved repository declaration | CONFIRMED for `.skilled`, INFERRED for the wider tree | F-12-03, search cap noted |
| RA-11 canary, no policy loader | CONFIRMED | F-12-04, single read helper |
| Rank 1 (repo-owned profile) | premise CONFIRMED, proposal INFERRED | F-12-06 |
| Rank 3 (profile declares surface evidence) | premise CONFIRMED, routing claim NOT TESTED | F-12-07 |
| Detector consults a policy file at runtime | REFUTED | F-12-03, `read_text` never called |

No claim from the first-pass synthesis was refuted. The one REFUTED verdict is a hypothesis
this iteration tested, not a row of `research.md`.

## Questions Answered

None of the strategy's key questions were newly answered; this is a verification pass on
facts already recorded as OBSERVED. The three facts it re-tested all survived, and the
"does a loader exist" question carried from iterations 10 and 11 is now answered negatively
for `.skilled`: no review policy loader exists, and the detector's unused `read_text`
parameter is where one would attach.

## Questions Remaining

- Does the live review runtime load any repository-owned policy file? **Answered negatively
  for `.skilled`** (F-12-03); the wider checkout is INFERRED only because the repository-wide
  search was capped at 60 matches.
- Would replacing the two-value surface label (rank 7) break the report-format consumers
  named in I-7? **Open**, untouched here.
- Does the `ROUTER.md` prose stage independently bundle CI for a path-only workflow prompt?
  **UNKNOWN** (F5 from iteration 11), untouched here.
- Can a real user-authored surface mode route into review and exchange evidence or findings?
  **UNKNOWN** (carried from iteration 9), untouched here.

## Next Focus

Second-model re-check 3 of 5: rank 6 and I-3 (does the quality gate's advisory envelope reach
review by contract, and is the named reader genuinely absent), plus E-3's payload claim. Both
are INFERRED and both rest on a named-absence argument of the same shape tested here, so the
same method applies: open the cited anchors, read the surrounding block rather than the
quoted line, and search for a consumer the synthesis may have missed. Rank 7 and I-5 should
follow, since rank 7's risk is a consumer break that only a search can settle.

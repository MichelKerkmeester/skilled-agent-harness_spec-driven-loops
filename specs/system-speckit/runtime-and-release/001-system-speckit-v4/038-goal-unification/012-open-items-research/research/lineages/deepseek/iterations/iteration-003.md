# Iteration 3: The root README goal section

## Focus

Ring 3 of the packet strategy: decide whether the root `README.md` goal section (lines 859-866)
should be covered by the goal-document contract test, joined to a retrieval lane, or left as
marketing prose that deliberately sits outside both — and say why the other two are wrong.

## Findings

**F1. The contract test does not cover it.** `.opencode/plugins/tests/goal-doc-contract.test.cjs`
pins seven documents (lines 20-28) and the root `README.md` is not among them. The first test scans
each listed document for backticked `.opencode`/host paths and fails on a missing one; the third
pins the canonical disable variable against the two engine sources. Nothing in the file reads
`README.md`. [SOURCE: `.opencode/plugins/tests/goal-doc-contract.test.cjs:20-28,68-80`]

**F2. Adding it to the path scan costs nothing today — it passes as-is.** Dry-running the test's
own citation regex over `README.md` finds five unique cited paths
(`.opencode/plugins/system-skill-advisor.js`, `.opencode/commands/doctor/_routes.yaml`,
`.opencode/hooks/goal/README.md`, `.opencode/hooks/goal/goal-plugin.md`, `.claude/mcp.json`) and
every one exists. The existing regex requires a file extension, so the section's bare directory
citation `.opencode/hooks/goal/` is out of scope for that check by construction. [SOURCE: `node -e`
replay of the test's regex against `README.md`, 2026-09-12]

**F3. The section is a restatement of the runtime support story — the duplication ring 2 analysed.**
`README.md:861-866` states the coverage mapping per runtime, one statement per host:
`/goal-opencode bind` for OpenCode (`README.md:863`), `/goal-pi` management for Pi, a session-free
packet read for Cursor, injection without a management surface for Devin (`README.md:864`), and the
native host command for Claude Code and Codex (`README.md:862`). Every one of those is checkable
in-repo except the native host command: `.opencode/commands/goal-opencode.md:7` exists;
`pi.registerCommand("goal-pi", ...)` is declared at
`.opencode/hooks/goal/pi/goal-context.ts:181`; Cursor's only goal-bearing hook event is
`sessionStart` (`.cursor/hooks.json`); Devin wires `SessionStart` and `UserPromptSubmit`
(`.devin/hooks.v1.json:2,39`). [SOURCE: the six files, read 2026-09-12]

**F4. Both retrieval lanes exclude it deliberately, with a written reason.** The corpus walker's
comment names root `README.md` among the documents "deliberately excluded from both lanes"
(`.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:24-30`), and the coverage
table gives the reason: "public-facing project marketing content with no `trigger_phrases`
convention, not spec or skill documentation"
(`.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:282`). The
document has no YAML frontmatter at all — it opens with two `#` headings (`README.md:1-2`) — so the
trigger index, which reads `trigger_phrases` out of frontmatter, cannot admit it without first
adding frontmatter to an 87,256-byte file. [SOURCE: the two files and `head README.md`]

**F5. A different workflow already covers its links, which is not the same as its claims.**
`.github/workflows/markdown-link-integrity.yml` runs a whole-repo markdown link check (step
"Check markdown link integrity (whole-repo)"), so a broken link in the goal section fails a
workflow today. Link resolution says nothing about whether "Pi also manages through `/goal-pi`" is
still true after a command rename, which is exactly the class of rot the contract test was built
for. [SOURCE: `.github/workflows/markdown-link-integrity.yml:17,26-27`]

## Sources Consulted

- `.opencode/plugins/tests/goal-doc-contract.test.cjs` (read end to end)
- `README.md:859-866` and its two-line header
- `.opencode/commands/goal-opencode.md`, `.opencode/hooks/goal/pi/goal-context.ts:181`, `.cursor/hooks.json`, `.devin/hooks.v1.json`
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:14-31`
- `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:282`
- `.github/workflows/markdown-link-integrity.yml`
- Replay of the contract test's citation regex against `README.md`

## Assessment

**newInfoRatio: 0.9.** Five findings. The contract-test gap and the retrieval exclusion were both
known in outline; new here is the exact cost of closing each (F2: zero today; F4: requires adding
frontmatter to the root README and reversing a documented decision) and the fact that link
integrity already covers a weaker property (F5). The checkability split inside the section (F3)
is the new discriminator: five of the six claims are pinnable in-repo, one is not.

**Novelty justification:** the prior synthesis listed the README section as an unowned surface; it
did not measure what closing the gap would cost or which half of the section is machine-checkable.

**Confidence:** F1-F5 observed by reading the named files; F2 by replaying the test's own regex.
The judgement that the retrieval exclusion should stand is a CLAIM grounded in the documented
decision and the missing frontmatter, not on a performance measurement.

## Reflection

**What worked.** Replaying the contract test's own regex before recommending that the README be
added to it turned "one array entry" from an estimate into a measurement: the path scan passes
today, so the change cannot land a pre-existing failure on the operator.

**What failed.** The first attempt to assess "is the README section tested" asked whether any test
mentions the file. Several do — link integrity and the doc-model reference check among them. The
real question was narrower and had to be restated: does any test pin the *facts* in this section,
not just its links.

**Ruled out.** (a) Joining a retrieval lane: it needs frontmatter added to an 87 KB marketing
document and reverses an exclusion that has a written reason; indexing marketing text would also
put the goal section in results for queries where a canonical document is the better hit. The
exclusion is the fix for a discovery problem, not for a truth problem. (b) Leaving it outside both
as marketing: it is the first goal document a new operator reads, and it is already the least
pinned of the six copies of the support story; "marketing prose is allowed to rot" is how the six
contradictions in the prior register accumulated.

## Recommended Next Focus

Ring 4 — the naming collision: judge what the word "goal" naming four unrelated things actually
costs, and enumerate every file a rename of the colliding artefact would touch.

---

## Recommendation (ring 3)

**Cover the root README goal section with the goal-document contract test; keep it out of both
retrieval lanes.**

- **The change.** Add `README.md` to the `DOCS` array in
  `.opencode/plugins/tests/goal-doc-contract.test.cjs`, which applies the existing path-existence
  scan to the section (cost measured: it passes today). Then extend the same file with the
  checkable half of the section's claims: `/goal-opencode` resolves to
  `.opencode/commands/goal-opencode.md`, `goal-pi` is registered in
  `.opencode/hooks/goal/pi/goal-context.ts`, and Cursor's goal cadence claim matches
  `.cursor/hooks.json` (sessionStart only) while Devin's matches `.devin/hooks.v1.json`
  (SessionStart + UserPromptSubmit). Leave the native-host sentence untouched and explicitly out of
  scope: nothing in the repository can verify it, and the playbook already marks it as host
  behaviour, re-checkable only against a live host.
- **Cost.** One array entry and three small assertions in one existing test file. No document
  changes, no new suite, no new runner lane.
- **Blast radius.** One test file, and from then on any edit to the README goal section that
  renames a command, moves a cited path or changes the per-runtime cadence fails a check that
  already runs in the advisory node-test lane. The README gains an obligation it did not have;
  every other goal document already carries it.

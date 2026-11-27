# Iteration 7: the rules phases, and the corpora that prove them

## Focus

012-manual-testing-scenarios, 013-skilled-and-doc-alignment and 014-deep-review. All three are phases whose deliverable is a rule or a corpus rather than a feature, and the reference evidence for them is not a requirement to mirror but the shape of the artifacts those repos actually kept: a test that exists because a CLI crashed under a pipe, a regression test named after the payload that overflowed the stack, a doc index an agent can read, and a findings note that records the hypothesis it ruled out.

## Actions Taken

1. Read the plan side: `012-manual-testing-scenarios/spec.md` (33 `BOT-nnn` scenarios and the fake-transport rule), `013-skilled-and-doc-alignment/spec.md` REQ-001 to REQ-005 (the two alignment commands and their reports), and `014-deep-review/spec.md` REQ-001 to REQ-004 plus the `suiteBaseline` floor rule.
2. Read openhuman-full's test naming across `tests/` (found `cli_sigpipe.rs`, `composio_list_tools_stack_overflow_regression.rs`, `cost_cap_removed.rs` among ~40 files) and its three `FINDINGS-*.md` notes.
3. Read openhuman-full's `llms.txt` (53 lines) and `AGENTS.md` head as the doc-index reference. Licences: openhuman GPL-3.0-only (design reference only, no text copies).

## Findings

1. **012-manual-testing-scenarios.** openhuman-full carries a test file named `cli_sigpipe.rs`, which is a test for a failure the plan's 33 scenarios do not cover and a `bots` verb will meet on its first day: a CLI whose stdout is piped into `head` receives `SIGPIPE`/`EPIPE` mid-write, and the naive outcome is a crashed process and a non-zero exit for a command that worked. The plan's scenario table has no pipe row, and the rule to add is one sentence plus one assertion: `bots activity | head -1` exits 0 and prints one row. Size S. [SOURCE: specs/system-skilled-bots/context/openhuman-full/tests/cli_sigpipe.rs:1] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:142-145] (observed)

2. **012-manual-testing-scenarios.** A second test name is a post-mortem in eight words: `composio_list_tools_stack_overflow_regression.rs`. A tool-listing call overflowed the stack on a deeply nested payload, and the fix is guarded by a test whose name carries both the call and the failure class. The plan has no scenario about a deeply nested or adversarially shaped JSON payload, and one of its own verbs reads third-party JSON (`.utcp_config.json` in 007, a channel provider's response in 011, an LLM's tool arguments in any run). Size S per verb: one fixture with nesting depth past any recursion limit and an assertion that the verb exits with a refusal rather than a stack overflow. [SOURCE: specs/system-skilled-bots/context/openhuman-full/tests/composio_list_tools_stack_overflow_regression.rs:1] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:111] (observed)

3. **012-manual-testing-scenarios.** `cost_cap_removed.rs` is a third pattern worth naming: a test that asserts a *removed* feature stays removed. The plan deletes and defers a good deal — standing grants (`grant-scope-unsupported`), a `--demo` binary, a browser computer, `bots skill accept` — and nothing in 012 asserts that a deferred verb is still absent, so a later packet can reintroduce one by accident and no scenario notices. One table row per deferral with the expected refusal or usage error is enough. Size S. [SOURCE: specs/system-skilled-bots/context/openhuman-full/tests/cost_cap_removed.rs:1] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:164] (observed)

4. **013-skilled-and-doc-alignment.** openhuman keeps a machine-facing doc index beside its human docs: `llms.txt` is 53 lines where every line is `- [Title](path): one sentence saying what the document is for`, and `llms-full.txt` is the 3,231-line concatenation of the same corpus for a reader that wants it whole; the repo root's `AGENTS.md` opens with a repository map that links the architecture documents by role. The plan's 013 proves alignment by running two generators and driving each report's `Open findings:` line to `0`, which proves *agreement between two tools* and says nothing about whether a reader can find the right document. A generated `llms.txt` — one line per doc under the skill tree, with its purpose, checked so every path resolves and every doc has a line — is a second, cheaper proof, and it is the artifact an agent reading this repo actually needs. Value **medium-high**, size **S**. [SOURCE: specs/system-skilled-bots/context/openhuman-full/llms.txt:1-14] [SOURCE: specs/system-skilled-bots/context/openhuman-full/AGENTS.md:1-12] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:154-158] (observed)

5. **014-deep-review.** openhuman's `FINDINGS-*.md` notes are the best review deliverable in the corpus, and their shape is the finding: a title naming the symptom and the ticket, a "Verdict (final, backend-confirmed)" line, evidence quoted to the byte (`exactly 182 bytes with keys details,error,errorCode,success`, a `file:line` into the backend checkout), the hypothesis it *rules out* ("which rules out the tool-declaration hypothesis below"), and a "Correction (second commit)" section that overturns the first note's reading. One of the three notes exists only to correct another. The plan's 014 requires every P0 fixed with a named proving command, which is the same rigour applied to the *fix*; what it does not require is the two halves that make a finding auditable later — the rejected hypothesis and a correction section. Both are one paragraph each in the review report. Size S, value **high**, because a review whose wrong first guess is deleted cannot be re-checked. [SOURCE: specs/system-skilled-bots/context/openhuman-full/FINDINGS-gemini-live.md:1-12] [SOURCE: specs/system-skilled-bots/context/openhuman-full/FINDINGS-voiceerr.md:1-14] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:182-185] (observed)

## Ruled Out

- **Proposing openhuman's `FINDINGS-*.md` as a required file per review.** One note per finding would duplicate what 014's review report already holds; the finding keeps the two *sections* (rejected hypothesis, correction) and not the file-per-note convention.
- **Copying `llms-full.txt` as a second generated artifact.** A 3,231-line concatenation is a distribution format for a published corpus; this repo's docs are read in place, so the index alone earns its place.
- **Reading openhuman's `e2e/` directory as a corpus.** It is a Docker Compose harness (`docker-compose.yml`, `run-local.sh`, an entrypoint script) for a containerised stack the build does not have, so its shape does not transfer.
- **Proposing a fourth alignment command.** 013 already runs two generators and a re-run loop with a parsed `Open findings:` grammar; a doc index is a generated artifact of the run, not a third command.

## Dead Ends

- The `grep -c "^| BOT-"` count of 33 is the scenario table's own count, not a coverage claim: several rows cite the same requirement, so "33 scenarios" does not mean 33 distinct behaviours. No coverage percentage is claimed from it.
- `014-deep-review/spec.md` was read for the words `ruled out`, `hypothesis` and `correction` and returned nothing, which is what finding 5 rests on; the absence of a word is weaker evidence than the presence of a requirement, so the finding is stated as "does not require" and not "forbids".

## Edge Cases

- **Contradictory evidence:** none.
- **Ambiguous input:** "which reference files and lines implement the same thing" does not fit a phase whose deliverable is a rule. The selected reading is that the reference implementation of a *testing* rule is the test corpus and of a *review* rule is the review artifact, which is why the findings cite test file names and finding notes rather than source.
- **Missing dependency:** none.
- **Partial success:** findings 1 to 3 come from *file names* plus one line each, not from reading the tests' bodies. That is enough to establish the failure class exists and was significant enough to be named, and not enough to state how each test asserts it — the findings say so.

## Sources Consulted

- specs/system-skilled-bots/context/openhuman-full/tests/cli_sigpipe.rs:1
- specs/system-skilled-bots/context/openhuman-full/tests/composio_list_tools_stack_overflow_regression.rs:1
- specs/system-skilled-bots/context/openhuman-full/tests/cost_cap_removed.rs:1
- specs/system-skilled-bots/context/openhuman-full/llms.txt:1-14
- specs/system-skilled-bots/context/openhuman-full/AGENTS.md:1-12
- specs/system-skilled-bots/context/openhuman-full/FINDINGS-gemini-live.md:1-12
- specs/system-skilled-bots/context/openhuman-full/FINDINGS-voiceerr.md:1-14
- specs/system-skilled-bots/context/openhuman-full/FINDINGS-voice-signed-url.md:1-8
- specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:111,142-145
- specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:154-158
- specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:94,182-185
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:164

## Assessment

- New information ratio: 0.90
- Questions addressed: the three rules phases, with five artifact-shaped findings
- Questions answered: none tracked; carried by findings

## Reflection

- **What worked and why:** reading `ls tests/` as a document. A test corpus's file names are a list of the failures somebody already paid for — `cli_sigpipe`, `stack_overflow_regression`, `cost_cap_removed` — and each name is a scenario the plan's table lacks, for the cost of one call. The same logic read `FINDINGS-*.md` as a deliverable shape rather than as content, which is where finding 5 came from.
- **What did not work and why:** grepping the phase parent of 010 in the previous iteration for requirements, and grepping 014 for the words `ruled out`/`hypothesis` in this one. Both are absence-based evidence: a missing word is weaker than a present requirement, so the finding had to be softened to "does not require". The stronger version would have read 014's report template, which the phase may hold elsewhere.
- **What I would do differently:** for a rules phase, list the directory before reading any single file, and treat file names and headings as the primary evidence; then read one file end to end to confirm the pattern rather than sampling five.

## Recommended Next Focus

The second net-new sweep over the vendored crates the first pass listed but did not read — `tinyflows`, `tinyeventqueues`, `tinyskills`, `tinysearch`, `tinybus`, `tinydocs`, `tinyartifacts`, `tinyjuice`, `tinycomputer`, `tinymcp`, `tinywallet`, `tinystoragedrivers` — ranked the same way, with sizes. Then a consolidated net-new ranking across all ten repos and a coverage check that every one of the fourteen phases carries at least one cited finding.

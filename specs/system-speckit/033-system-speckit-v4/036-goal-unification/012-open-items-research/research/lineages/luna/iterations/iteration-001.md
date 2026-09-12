# Iteration 1: Adversarial citation audit of the first report

## Focus

Audit the first lineage's synthesis as a hypothesis. The audit opened the cited source files and
checked the report's five rings: prose width, unowned surfaces, the root README goal section, the
word `goal`, and proposed machine checks. The central distinction is between a claim that is false,
a recommendation that is too cheap for its live dependencies, and a question whose answer is still
underspecified.

## Findings

### A1 — The report's quantitative provenance is not independently reproducible

The first report says its commands are recorded in `iterations/iteration-001..005.md` and
`deltas/iter-001..005.jsonl` ([SOURCE: `research/research.md:221-244`]), but those paths are absent
beside the root synthesis: the packet's `research/` directory contains the strategy, observability,
status, summary, and synthesis files, not `iterations/` or `deltas/` (observed with a read-only
`find` over the exact directory). A separate deepseek lineage contains similarly named files, but
the report does not link to that lineage. Therefore the corpus percentages, the 365-line
non-reproduction, and the claim that every ring was confirmed are **thin evidence**, not falsified
measurements. The report should have carried the exact command and file set in the synthesis itself.

### A2 — “No line-length rule exists anywhere” is too broad

The narrower claim is supported: the cited code guides govern source files, and no evidence here
shows a Markdown linter enforcing 100 columns. The absolute wording does not hold. The universal
code-style guide gives a soft prose-style recommendation of roughly 100–120 characters
([SOURCE: `.opencode/skills/sk-code/shared/references/universal/code-style-guide.md:196-200`]); the
skill asset template carries a `max_line_length: 100` formatting field ([SOURCE:
`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:599-601`]); the
commit hook warns on body lines over 100 ([SOURCE: `.opencode/scripts/git-hooks/commit-msg:164-168`]);
and the retrieval convention records a live 100-character phrase ceiling
([SOURCE: `.opencode/skills/system-spec-kit/references/structure/grep-convention.md:142-148`]).
These are not one general Markdown rule, but they disprove “anywhere.”

### A3 — “Retire” and “zero cost” conflate three different width questions

The first report correctly argues against introducing a blocking repo-wide Markdown lint: even its
own measured baseline says many Markdown classes exceed 100 ([SOURCE: `research/research.md:80-97`]).
It does not follow that the 100-ish readability guidance should be retired, because the universal
guide explicitly leaves it as a soft, logical-wrap convention ([SOURCE:
`.opencode/skills/sk-code/shared/references/universal/code-style-guide.md:196-200`]). If the
decision is only “do not add a prose gate,” the cost is near zero. If it is “remove the 100 concept,”
the cost includes clarifying the surviving code, commit-message, template, and retrieval-specific
contracts. The first recommendation's cost is therefore **understated** and the disagreement is
**underspecified**.

### A4 — The mass-rewrite estimate is an unsupported upper-bound narrative

The report's 216,500-line total is presented as a sum of measured classes but the measurement
commands and file lists are not retained at the report's cited paths ([SOURCE:
`research/research.md:80-97`, `research/research.md:221-244`]). Its statement that tables and links
“cannot” be rewrapped without changing rendering is stronger than the evidence: reflow can preserve
many Markdown links and table semantics, although it can change visual layout and should not be
done mechanically without review. The correct adversarial conclusion is that a blocking rewrite is
not justified, not that the exact rewrite size or impossibility is confirmed.

### A5 — The flag-roster conclusion needs a shell boundary

The Node resolver does define a hand-set goal canonical name and aliases
([SOURCE: `.opencode/hooks/shared/hook-flags.cjs:34-52`]), so the first report's “no dead
`SYSTEM_GOAL_DISABLED` in the eight rosters” observation is plausible for the enumerated Node
surfaces. The shared POSIX mirror intentionally does something different: `hook_enabled` derives
`SYSTEM_<CONCERN>_DISABLED` and never consults `CONCERN_CANONICAL` or `LEGACY_ALIASES`
([SOURCE: `.opencode/hooks/shared/hook-flags.sh:42-47`]). The shared README calls this out explicitly
([SOURCE: `.opencode/hooks/shared/README.md:29-44`]). “One shared resolver owns all flags” is thus
false if shell entrypoints are included. No current goal shell adapter was found, so this is a
boundary condition rather than a new goal defect; the report should have named it and either
excluded shell or tested it.

### A6 — The six-copy support story does not agree claim by claim

The root README says the agent resends the durable slice whenever a decision or criterion changes
([SOURCE: `README.md:859-864`]). The runtime evidence is weaker: Cursor reads and injects only when
its SessionStart adapter runs, records a turn, and renders a reminder
([SOURCE: `.opencode/hooks/goal/cursor/goal-inject.mjs:76-89`]); Devin does the analogous work on
its two hook events ([SOURCE: `.opencode/hooks/goal/devin/goal-inject.mjs:64-79`]); and Pi's reminder
is attached to an input transform ([SOURCE: `.opencode/hooks/goal/pi/goal-context.ts:186-199`]). The
contract itself describes the reminder as part of those event paths, not as a file-change observer
([SOURCE: `.opencode/hooks/injection-contract.md:138-140`]). No cited source proves an automatic
chat resend at the moment a packet file changes. The report's “agree claim by claim” finding does
not hold; this is a **thin-evidence/overclaim** correction.

### A7 — The two manifest contracts are complementary, not proven drift

The deep-review workflow validates repo-relative path shape, traversal, duplicates, existence, and
file-ness ([SOURCE: `.opencode/commands/deep/assets/deep-review-auto.yaml:373-378`]). The shell
checker separately compares manifest entries with `git ls-files` and fails closed when an entry is
untracked or Git is unavailable ([SOURCE:
`specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh:4-40`]).
They do not receive the same input in the same phase, and no invariant says the scope parser must
enforce trackedness. Calling this “two parsers with two different contracts” is true descriptively
but calling it drift is unsupported. The first report's repair recommendation rests on **thin
evidence** and dismissed the “intentional two-stage validation” alternative too quickly.

### A8 — The checker is packet-resident, but the claimed runtime dependency is overstated

The Vitest file resolves the checker through the `.opencode/specs` symlink and records its real path
([SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:10-23`]),
so the physical dependency is real. However, every test invocation passes a temporary manifest and
the explicit repository root ([SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:65-93`]).
It does not depend on the checker's default `SCRIPT_DIR/goal-file-manifest.txt` input
([SOURCE: `check-goal-file-manifest.sh:4-18`]). Relocation is a maintainability choice, not a
current behavior repair. Moving it still changes the executable path, `realpath`-based tracked
entry, and default invocation semantics, so the first report's “one test path, no behavior” price
is understated.

### A9 — The runtime-label gap is real but its ownership and cost are not one line by definition

`OPENCODE_GOAL_RUNTIME_LABEL` is read by the CLI and used to choose the displayed runtime label
([SOURCE: `.opencode/hooks/goal/bin/goal.cjs:385-396`]). It appears in the root environment example
([SOURCE: `.env.example:289-307`]) but not in the general goal configuration table
([SOURCE: `.opencode/hooks/goal/README.md:126-137`]) or the OpenCode plugin table
([SOURCE: `.opencode/hooks/goal/goal-plugin.md:58-76`]). The first report is right that discoverability
has a gap, but “one documentation line” is only true after choosing the general goal README as the
owner. Adding it to the plugin table would misplace a CLI-owned setting; adding it to both creates
two derived rows. The cost is a small ownership decision plus one authoritative row, not an
unqualified one-line fix.

### A10 — Adding README.md to the generic contract test does not test its claims

The current test owns seven documents and uses a regex that only extracts backticked paths under
selected runtime trees ([SOURCE: `.opencode/plugins/tests/goal-doc-contract.test.cjs:23-45`]).
The README's cadence and support claims are mostly prose on lines 861–866, and its resend claim is
not a backticked path ([SOURCE: `README.md:861-866`]). Replaying that regex can prove that a handful
of cited paths exist; it cannot prove `/goal-opencode`, `/goal-pi`, Cursor cadence, Devin cadence,
or resend semantics. The first report's “passes today” is therefore true only for the narrow path
scan, while its recommendation for “three small assertions” understates the semantic test design.

### A11 — Cursor cadence assertions can confuse registration with delivery

The goal adapter is a SessionStart adapter ([SOURCE: `.opencode/hooks/goal/cursor/goal-inject.mjs:1-12`]),
but the same host configuration registers unrelated `beforeSubmitPrompt` commands
([SOURCE: `.cursor/hooks.json:79-87`]). A separate sync note says that event is registered but does
not fire in the tested CLI build ([SOURCE: `.cursor/SYNC.md:81-81`]). A test that searches the host
file for event names, as the first report's compact wording suggests, can assert the wrong thing.
The test must identify the goal command specifically and preserve the known capability limitation.

### A12 — The README disposition has a lower-blast alternative the report rejected too quickly

The exclusion from both retrieval lanes is a deliberate current policy
([SOURCE: `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:276-284`]),
and the corpus walker confirms that `README.md` is not one of its roots
([SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:19-31`]). That
supports leaving it out of retrieval today. It does not require adding the whole marketing file to
the generic goal-document list. A section-specific contract fixture or a small source-owned
support-contract map could test the five in-repo claims without making the generic path regex scan
an 87 KB root document. Whether retrieval should change is **underspecified** because the report
provides no recall failure or operator query that the exclusion causes.

### A13 — The naming collision is not one deep-review-only manifest

There are six actual `goal-file-manifest.txt` files in the current tree, not one deep-review scope
file: the sk-design remediation packet, two sk-doc packets, the deep-loop whole-system gate, and
two system-speckit packets ([SOURCE: `specs/sk-design/012-sk-design-program/005-reviews-and-remediation/003-remediation-program-review/goal-file-manifest.txt:1-6`,
`specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/goal-file-manifest.txt:1-6`,
`specs/sk-doc/019-skill-routing-refactor/016-documentation-quality-program/goal-file-manifest.txt:1-6`,
`specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/goal-file-manifest.txt:1-6`,
`specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/goal-file-manifest.txt:1-6`,
`specs/system-speckit/033-system-speckit-v4/004-decisions-and-notes-system/006-memory-redesign-verification/goal-file-manifest.txt:1-6`]).
Each header describes files a goal touched and asserts that they are tracked. The first report's
label “deep-review scope manifest” is not the semantic owner of five of those artifacts.

### A14 — The proposed rename has more semantic and compatibility blast radius than reported

The workflow treats `goal-file-manifest.txt` as a generic optional spec-folder input
([SOURCE: `.opencode/commands/deep/assets/deep-review-auto.yaml:369-378`]), while the checker has a
default basename and the Vitest test hard-codes its packet path
([SOURCE: `check-goal-file-manifest.sh:4-5`, `recursive-child-manifest.vitest.ts:14-23`]).
Renaming it globally to `review-scope-manifest.txt` would misname the five goal-touch ledgers,
change the workflow's accepted input contract, require decisions about all active packet references,
and need an old-name compatibility policy for historical readers. It is not “thirteen mostly
mechanical live files with no behavior change” ([SOURCE: `research/research.md:159-182`]). The
disagreement is **underspecified**: rename the one workflow concept, or rename a shared provenance
artifact used by six packets?

### A15 — Leaving the name in place or staging an alias was dismissed without evidence of user harm

The current files already distinguish the referents through packet context and the goal README's
disambiguation note ([SOURCE: `.opencode/hooks/goal/README.md:19-22`]). No cited source records a
failed lookup, wrong parser, or operator incident caused by the name. A lower-blast alternative is
to keep the six provenance filenames, clarify the deep-review workflow's “scope input” wording, and
only introduce a distinct name if a genuinely review-owned manifest is created. If a rename is
still desired, keep a compatibility reader for the old basename while migrating. The first report
rejected “nothing/clarify” too quickly; this is **thin evidence**, not a demonstrated defect.

### A16 — The environment-variable finding is right, but the proposed generic check mixes owners

The plugin defines defaults for the three missing knobs and reads them
([SOURCE: `.opencode/plugins/opencode-goal.js:45-51`, `.opencode/plugins/opencode-goal.js:78-80`,
`.opencode/plugins/opencode-goal.js:239-247`]). The root env example lists the other goal names and
omits exactly those three ([SOURCE: `.env.example:291-306`]), so the first report correctly found a
documentation defect. Its statement that the plugin env table has 18 names is not true for the
current table, which has rows 62–76 ([SOURCE: `.opencode/hooks/goal/goal-plugin.md:60-76`]); that
table also omits the CLI-owned runtime label. A regex over all engine and plugin strings would need
an owner map to avoid treating aliases, shared settings, and CLI-only settings as one contract.

### A17 — The proposed roster-name check duplicates an existing behavior contract and misses shell

The resolver suite already asserts the canonical goal name, the plugin alias, cross-concern
non-interference, and config-file alias behavior ([SOURCE:
`.opencode/hooks/shared/hook-flags.test.cjs:35-71`]). A static scan of roster names against
`CONCERN_CANONICAL.goal` and `LEGACY_ALIASES.goal` would repeat that coverage without executing
the adapter path, while still missing the POSIX divergence in A5. The first report's “cheap check
that passes today” is therefore a weak shape; extending the existing resolver/adapter test or
explicitly excluding shell is more truthful.

### A18 — The manifest-name comparison is not sufficient to prove agreement

Comparing the YAML basename with the shell checker's default basename would catch a spelling typo,
but it would not prove that the workflow's optional manifest, the checker's default path, the six
packet copies, the `.opencode/specs` symlink, and the test's `realpath` all resolve to the same
artifact ([SOURCE: `.opencode/commands/deep/assets/deep-review-auto.yaml:373-375`,
`check-goal-file-manifest.sh:4-18`, `recursive-child-manifest.vitest.ts:14-23`]). The first report
underprices the negative-control cases needed for a reliable check: explicit manifest, default
manifest, symlink path, and a second packet.

### A19 — “State-directory README claims do not earn a check” is too categorical

The state directory is a machine contract: the core names the override and state subdirectory
([SOURCE: `.opencode/hooks/goal/lib/goal-core.cjs:39-43`), documents the precedence of explicit
option, environment, and default ([SOURCE: `.opencode/hooks/goal/lib/goal-core.cjs:169-180`), and
the plugin derives its default from the same override ([SOURCE: `.opencode/plugins/opencode-goal.js:36-37`]).
The state README describes the two storage key schemes and the active record shape
([SOURCE: `.opencode/skills/.state/goal/README.md:31-42`, `.opencode/skills/.state/goal/README.md:69-71`]).
It is reasonable not to add a prose-copy test, but an executable state-path/parity test can fail
for a real reason when this contract changes. The report's blanket exclusion is **underspecified**;
the fact may already be covered by existing tests, so the smallest action is an inventory check
before adding a new suite.

## Claim Disposition

| Ring | Survives | Does not hold or is underpriced |
|---|---|---|
| Line width | No blocking Markdown lint is evidenced; exact 100 is not a general prose gate | “Nowhere,” “zero cost,” exact mass-rewrite basis, and rejection of a non-blocking/scoped guideline |
| Unowned surfaces | Node canonical flag names, runtime-label discoverability gap, and packet-resident checker are real observations | Shell boundary, automatic-resend story, parser “drift,” and the behavior price of relocation |
| Root README | Retrieval exclusion and current path-scan gap are real | Path scan is not semantic coverage; generic DOCS inclusion is not the only or cheapest test shape |
| `goal` naming | Six physical manifests and a real context collision exist | It is not one review-only artifact; a global rename is semantically unsafe and unpriced |
| Machine checks | Three env knobs are missing from `.env.example`; blocking CLI Vitest exists | Proposed checks are redundant or too shallow without ownership, path, symlink, and event negative controls |

## Sources Consulted

- First hypothesis: `specs/system-speckit/033-system-speckit-v4/036-goal-unification/012-open-items-research/research/research.md:27-252`.
- Width guidance and ceilings: `.opencode/skills/sk-code/shared/references/universal/code-style-guide.md:196-200`,
  `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:599-601`,
  `.opencode/scripts/git-hooks/commit-msg:164-168`,
  `.opencode/skills/system-spec-kit/references/structure/grep-convention.md:142-148`.
- Goal adapters and support contract: `README.md:859-866`,
  `.opencode/hooks/injection-contract.md:138-140`,
  `.opencode/hooks/goal/cursor/goal-inject.mjs:1-27,76-89`,
  `.opencode/hooks/goal/devin/goal-inject.mjs:5-16,64-79`,
  `.opencode/hooks/goal/pi/goal-context.ts:180-214`.
- Flag ownership: `.opencode/hooks/shared/hook-flags.cjs:34-52`,
  `.opencode/hooks/shared/hook-flags.sh:42-47`, `.opencode/hooks/shared/README.md:29-44`,
  `.opencode/hooks/shared/hook-flags.test.cjs:35-71`.
- README contract and retrieval: `.opencode/plugins/tests/goal-doc-contract.test.cjs:20-45`,
  `.cursor/hooks.json:79-87`, `.cursor/SYNC.md:81-81`,
  `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:19-31`,
  `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:276-284`.
- Manifest machinery: `.opencode/commands/deep/assets/deep-review-auto.yaml:369-378`,
  `check-goal-file-manifest.sh:4-40`, `recursive-child-manifest.vitest.ts:10-23,65-93`,
  and the six current manifest headers cited in A13.
- Machine-check ownership: `.opencode/plugins/opencode-goal.js:45-51,68-80,239-247`,
  `.env.example:289-307`, `.opencode/hooks/goal/README.md:126-137`,
  `.opencode/hooks/goal/goal-plugin.md:58-76`.

## Assessment

**newInfoRatio: 0.92.** This is the first iteration of the adversarial lineage, but the evidence
adds several premise corrections rather than merely rephrasing the first report: the synthesis's
measurement trail is absent at its cited paths; width guidance exists outside the named code guides;
the resend claim is not supported by the adapters; the two manifest contracts are complementary;
and the rename would affect six semantically different provenance ledgers.

**Novelty justification:** the first report was read as a conclusion. This iteration opened the
underlying files and tested whether its compact recommendations preserved their ownership,
event-cadence, symlink, and compatibility boundaries.

**Confidence:** A2, A5, A6, A7, A8, A10, A11, A13, A16, A17, A18, and A19 are confirmed by source
lines. A1, A3, A4, A12, A14, and A15 are evidence-quality or design judgments; the missing command
outputs and absent incident/query data make them thin or underspecified rather than settled by
assertion.

## Reflection

**What worked.** Re-opening the cited source instead of trusting the first report exposed seams that
do not appear in a summary: a soft width convention, runtime-specific event limits, the distinction
between scope validation and trackedness, and six provenance artifacts behind one filename.

**What failed.** The first report's “live vs historical” rename count cannot be recovered from its
synthesis alone. A path count without a classification table is not enough to price a rename, and a
regex path scan is not enough to claim behavior coverage.

**Ruled out for this audit.** A repo-wide hard Markdown lint; a global rename of all six files to
`review-scope-manifest.txt` without a semantic owner decision; a roster check that merely compares
strings; and a README test that only proves backticked paths exist.

## Recommended Next Focus

Iteration 2: give one direct recommendation for each of the five open items. State exactly where it
differs from the first report, what evidence separates the answers, and what would have to be true
for the first report's answer to win.

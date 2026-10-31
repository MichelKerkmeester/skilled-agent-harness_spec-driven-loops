---
title: "Adversarial second-lens synthesis for goal open items"
description: "Inline two-iteration adversarial audit of the first lineage's five recommendations."
session_id: "fanout-luna-1789202042622-4x183m"
lineage: "luna"
executor: "cli-codex model=gpt-5.6-luna"
loop_type: "research"
stop_policy: "max-iterations"
max_iterations: 2
convergence_threshold: 0.05
status: "complete"
stopReason: "maxIterationsReached"
---

# Adversarial Second-Lens Synthesis

## Executive verdict

The first lineage's report was a useful hypothesis, but its five recommendations were not equally
supported. This lineage read the cited repository sources, ran two inline iterations, and kept
disagreements separate instead of averaging them. The final recommendation is:

1. Keep a soft prose-readability convention and make no blocking width gate.
2. Keep the duplicated runtime surfaces, correct the event-triggered resend story, document the
   runtime-label owner, and defer manifest-checker relocation.
3. Test the root README goal section with a targeted semantic contract while keeping it out of
   retrieval.
4. Do not globally rename the six existing `goal-file-manifest.txt` provenance ledgers.
5. Use owner-specific executable checks with negative controls; do not add shallow generic scans.

The first report still wins on the narrower conclusions “no blocking prose lint,” “do not retrieve
the root README,” and “document the missing plugin knobs.” It does not win on unqualified support
agreement, parser-drift diagnosis, global manifest rename, or a generic four-check shape. The
remaining disagreement is either `underspecified` (the policy or owner is not named) or `thin
evidence` (the report supplies no incident, query, or reproducible measurement); it is not resolved
by averaging.

## Terminal status and loop accounting

`stopReason: maxIterationsReached`

- Iteration 1: `newInfoRatio=0.92`, 19 findings; adversarial citation audit.
- Iteration 2: `newInfoRatio=0.78`, 5 findings; one direct recommendation for each open item.
- Total findings: 24 (`low=4`, `medium=13`, `high=7`, `critical=0`).
- Convergence threshold: `0.05`; `converged=false` because the configured two-iteration cap was
  reached. Convergence telemetry did not terminate the loop early.

The machine-readable route-proof records are in `deep-research-state.jsonl`; the detailed evidence
and delta records are in `iterations/iteration-001.md`, `iterations/iteration-002.md`,
`deltas/iter-001.jsonl`, and `deltas/iter-002.jsonl`.

## Evidence boundary

The first report explicitly presents its summary as a set of recommendations and then cites its
five open-item analyses (`specs/system-speckit/033-system-speckit-v4/036-goal-unification/012-open-items-research/research/research.md:37-49,71-217`). Its cited iteration and delta paths are listed near the end of that report (`.../research/research.md:238-244`), but the citation audit did not find those files beside the report; the provenance limitation and the command-level follow-up are recorded in `iterations/iteration-001.md:13-21`.

The findings below distinguish three things:

- a source-backed current behavior, which has a repository file-and-line citation;
- an inference, which is explicitly labeled as such and follows from cited sources; and
- a policy choice, which is labeled `underspecified` or `thin evidence` when the repository does
  not provide the missing decision input.

## 1. Prose line width

### What the first report claimed

The first report recommends retiring the 100-character limit and assigns zero file changes
(`.../research/research.md:71-97`). That conclusion is too broad for the current tree.

### Audited evidence

The universal style guide currently states a soft limit of roughly 100–120 characters and says to
wrap only when readability improves (`.opencode/skills/sk-code/shared/references/universal/code-style-guide.md:196-200`). A skill asset template currently declares `max_line_length: 100` (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:599-601`). The commit hook currently emits a warning for body lines over 100 characters (`.opencode/scripts/git-hooks/commit-msg:164-168`), while the retrieval convention describes a 120-character phrase ceiling and reports that its live corpus currently tops out at 100 characters (`.opencode/skills/system-spec-kit/references/structure/grep-convention.md:142-148`). These are different contracts, but together they disprove the absolute claim that no width concept remains.

### Recommendation and exact difference

Keep the non-binding readability convention, scope it explicitly to prose readability, and make the
decision “no blocking Markdown width gate.” Do not rewrap the corpus and do not add a goal-document
line-budget test. This agrees with the first report's rejection of a hard repo-wide lint, but differs
from its recommendation to retire the number everywhere (`.../research/research.md:93-97`).

The cost estimate is therefore conditional. Recording “no blocking gate” is a small documentation
decision. Removing or reconciling all soft and specialized width contracts is not the same change;
the first report's broad zero-cost statement cannot price that larger scope (`.../research/research.md:80-97`).

The first report would win only if the operator explicitly means “remove every prose-width
convention,” the universal style guide is declared out of scope, and a recovered measurement proves
that no consumer relies on the soft guidance. The disagreement is `underspecified`, as detailed in
`iterations/iteration-002.md:11-45`.

## 2. Unowned surfaces

### Audited evidence

The Node flag resolver has a canonical goal switch and legacy aliases (`.opencode/hooks/shared/hook-flags.cjs:34-52`), and its existing tests cover canonical, alias, cross-concern, and config-file behavior (`.opencode/hooks/shared/hook-flags.test.cjs:35-71`). The POSIX mirror derives `SYSTEM_<CONCERN>_DISABLED` and does not carry the Node canonical or legacy alias overrides (`.opencode/hooks/shared/hook-flags.sh:42-47`; `.opencode/hooks/shared/README.md:29-44`). This is a boundary, not proof that the shell mirror must implement the Node roster.

The root README says the agent resends a changed slice and describes OpenCode, Pi, Devin, and Cursor
cadence (`README.md:859-866`). The actual adapters produce their brief and reminder inside their
registered event paths: Cursor's adapter renders and records in its session-start path
(`.opencode/hooks/goal/cursor/goal-inject.mjs:76-89`), Devin handles `SessionStart` and
`UserPromptSubmit` (`.opencode/hooks/goal/devin/goal-inject.mjs:64-79`), and Pi transforms the input
event and restores on `session_start` (`.opencode/hooks/goal/pi/goal-context.ts:186-214`). The shared
injection contract likewise labels Cursor as `sessionStart` only and Pi as input/session-start/turn-end
(`.opencode/hooks/injection-contract.md:138-140`). The evidence supports an event-triggered reminder,
not a file-change-triggered automatic chat message.

The CLI reads `OPENCODE_GOAL_RUNTIME_LABEL` (`.opencode/hooks/goal/bin/goal.cjs:385-396`). The root
environment example lists that variable (`.env.example:289-307`), but the general goal README's
configuration table ends without it (`.opencode/hooks/goal/README.md:126-137`); the plugin-specific
table likewise lists its environment variables without the runtime-label row
(`.opencode/hooks/goal/goal-plugin.md:58-76`). The discoverability gap is real, while the owner of
the shared documentation is a policy decision.

The manifest checker defaults its input to a path beside the script and accepts an explicit manifest
and repository root (`specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh:4-18`). The current recursive-manifest tests pass temporary manifest and explicit repository-root arguments and exercise tracked, untracked, and unavailable-git cases (`.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:65-93`). The deep-review YAML validates a declared packet manifest by path, traversal, duplicate, missing, and file checks (`.opencode/commands/deep/assets/deep-review-auto.yaml:369-378`). These are complementary contracts; the cited callers do not establish a current default-path relocation dependency.

### Recommendation and exact difference

Keep the consistent Node copies and their existing behavior tests. Correct “resend” to mean a
reminder delivered on the next supported adapter event, add `OPENCODE_GOAL_RUNTIME_LABEL` to the
general goal README owner table, and defer checker relocation. Keep the POSIX limitation explicit and
add shell parity only if a goal shell entrypoint becomes an asserted surface.

This agrees with the first report's low-cost duplication and runtime-label row, but rejects its claim
that the support copies are fully consistent and defers its same-change relocation
(`.../research/research.md:101-126`). Relocation would touch the resolved path, the checker default
basename, and the test's realpath/tracked-entry assumptions (`recursive-child-manifest.vitest.ts:10-23`; `check-goal-file-manifest.sh:4-5`). The first report would win if every reusable checker is declared required to live under the live runtime tree, or if a caller is found that invokes the checker without explicit paths after archival. The owner boundary is `underspecified` and the incident evidence is `thin evidence` (`iterations/iteration-002.md:47-97`).

## 3. The root README goal section

### Audited evidence

The root README currently makes prose claims about durable goals, runtime cadence, resends, and host
support (`README.md:859-866`). The existing goal-document contract test's `DOCS` array contains
runtime-facing documentation paths, and its generic regex checks only backticked paths in selected
trees (`.opencode/plugins/tests/goal-doc-contract.test.cjs:23-45`). It therefore cannot, by itself,
prove the README's cadence or resend prose.

The Cursor goal adapter identifies itself as session-start-only and documents that the tested
`beforeSubmitPrompt` path does not deliver (`.opencode/hooks/goal/cursor/goal-inject.mjs:1-12`). The
Cursor host configuration does contain unrelated `beforeSubmitPrompt` registrations
(`.cursor/hooks.json:79-87`), while the sync document records that the event is registered but dormant
under the tested CLI (`.cursor/SYNC.md:81`). Registration is not delivery evidence; a negative control
is required.

The retrieval corpus roots currently include `specs`, skills, install guides, and hooks, but not the
repository-root README (`.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:19-31`).
The retrieval convention deliberately excludes `README.md` from both lanes because it is public-facing
marketing content without the `trigger_phrases` convention (`.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:276-284`).

### Recommendation and exact difference

Keep the root README outside retrieval, but cover its goal section with a targeted semantic contract.
Extend the existing test only if it can isolate the section; otherwise use a small section-specific
fixture or support map. Assert the actual OpenCode command, Pi registration, Cursor goal event, Devin
goal events, and Cursor's known registration-versus-delivery limitation. Treat the native Claude
Code/Codex sentence as documentation-only unless a host check is added. Qualify the automatic resend
sentence before calling the section green.

This agrees with the first report's “test, do not retrieve” direction, but rejects adding the README
to the generic `DOCS` path scan as sufficient (`.../research/research.md:130-155`). Keeping it outside
retrieval preserves the deliberate corpus boundary; adding it would couple public prose to retrieval
frontmatter and corpus behavior (`retrieval-conventions.md:276-284`; `corpus.mjs:19-31`). The first
answer would win if the contract is intentionally only path-existence citations, if the generic test
gains a reliable section parser, or if a retrieval-recall failure proves exclusion harmful. No such
recall evidence is present. The retrieval disagreement is `thin evidence` (`iterations/iteration-002.md:99-139`).

## 4. The word `goal` naming four things

### Audited evidence

The deep-review workflow currently treats `goal-file-manifest.txt` as an optional spec-folder scope
input and validates its entries as repository-relative paths (`.opencode/commands/deep/assets/deep-review-auto.yaml:369-378`). The checker also uses that basename as its default input (`check-goal-file-manifest.sh:4-18`).

Six current files carry this basename. Their headers describe files touched by the goal and assert
that those paths are tracked: the sk-design ledger (`specs/sk-design/012-sk-design-program/005-reviews-and-remediation/003-remediation-program-review/goal-file-manifest.txt:1-6`), two sk-doc ledgers (`specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/goal-file-manifest.txt:1-6`; `specs/sk-doc/019-skill-routing-refactor/016-documentation-quality-program/goal-file-manifest.txt:1-6`), the deep-loop gate ledger (`specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/goal-file-manifest.txt:1-6`), and two system-speckit ledgers (`specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/goal-file-manifest.txt:1-6`; `specs/system-speckit/033-system-speckit-v4/004-decisions-and-notes-system/006-memory-redesign-verification/goal-file-manifest.txt:1-6`). This evidence contradicts the first report's framing of one review-only artifact.

The current recursive-manifest test resolves the checker through the `.opencode/specs` symlink and
asserts tracked entries using the real path (`.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:10-23`). A global rename would therefore change an accepted workflow input, the checker default, the realpath assertion, six provenance ledgers, and active references. It is not “no behavior change” at the workflow input boundary even if the path-check algorithm stays the same.

### Recommendation and exact difference

Do not globally rename the six existing files. Keep them as goal-touch provenance ledgers, clarify in
the deep-review workflow that a packet may supply a declared scope input, and reserve
`review-scope-manifest.txt` for a new artifact whose owner is actually deep-review. If a future rename
is approved, retain an old-name compatibility reader while migrating historical and live references.

This directly rejects the first report's `goal-file-manifest.txt` to `review-scope-manifest.txt`
rename and its thirteen-file mechanical estimate (`.../research/research.md:159-182`). Keeping the
names costs no migration; renaming has path, semantic, and historical-record blast radius. The first
answer would win only if an inventory proves all six files are review-owned, or an operator incident
shows the basename causes wrong-surface use. The current headers contradict the first condition and
no incident is supplied. The question is `underspecified` and the user-harm evidence is `thin
evidence` (`iterations/iteration-002.md:141-183`).

## 5. Which facts earn a machine check

### Audited evidence

The goal plugin defines defaults for verifier timeout, continuation timeout, and JSONL size, declares
their environment names, and reads them from `process.env` (`.opencode/plugins/opencode-goal.js:45-51,68-80,239-247`). Those three names are absent from the root environment example's goal block, which currently runs through the runtime label and specs root (`.env.example:289-307`). The missing-knob finding survives the adversarial pass.

The shared resolver test already exercises canonical and alias switches, cross-concern isolation, and
config-file behavior (`.opencode/hooks/shared/hook-flags.test.cjs:35-71`). The goal contract test is
located under `.opencode/plugins/tests` and currently owns path-existence checks for its selected
documents (`.opencode/plugins/tests/goal-doc-contract.test.cjs:20-45`). The repository's CLI Vitest
project is a blocking workflow lane (`.github/workflows/spec-kit-check.yml:94-106`), while the broad
Node test runner is invoked as report-only with `continue-on-error` (`.github/workflows/advisory-checks.yml:26-35`). Test placement therefore changes CI blast radius; it is not a free implementation detail.

### Recommendation and smallest reliable shapes

Use owner-specific executable checks with negative controls:

| Fact | Machine-check decision | Smallest reliable shape |
|---|---|---|
| Three missing plugin knobs | Check | Assert `OPENCODE_GOAL_VERIFIER_TIMEOUT_MS`, `OPENCODE_GOAL_CONTINUATION_TIMEOUT_MS`, and `OPENCODE_GOAL_JSONL_MAX_BYTES` appear in `.env.example`; document CLI-only `OPENCODE_GOAL_RUNTIME_LABEL` in the general goal README owner table. |
| Goal kill switch and aliases | Keep existing check | Retain the resolver behavior tests; add a shell case only if a goal shell entrypoint becomes an asserted owner. |
| Root README command/cadence prose | Check | Parse the goal section and assert exact command/event contracts, including Cursor's registration-versus-delivery negative control. |
| Manifest basename/path | Defer | If migration is approved, test default and explicit paths, `.opencode/specs` realpath, a second packet, and compatibility; basename equality alone is insufficient. |
| State-directory behavior | Conditional check | After a coverage inventory, execute the default, environment override, and lock-location behavior; do not compare prose line by line. |
| Width, support wording, historical citations | No blocking check | Preserve as review evidence or targeted documentation until an executable failure contract exists. |

This differs from the first report's proposal for one blocking spec-kit CLI Vitest file with four
generic checks (`.../research/research.md:186-217`). The narrower recommendation retains the missing
environment checks but rejects a roster string scan, a basename comparison, and generic README path
assertions as insufficient or redundant. The first answer would win if the CLI Vitest project is
explicitly designated the cross-surface owner, a source-of-truth map is added, and the suite carries
negative controls for aliases, shell behavior, symlink paths, and event semantics. Without those
contracts, the “cheap four checks” conclusion is `thin evidence` (`iterations/iteration-002.md:185-239`).

## Cross-cutting comparison with the first report

| Question | First report | This lineage | Disagreement type |
|---|---|---|---|
| Prose width | Retire the limit entirely | Keep soft readability guidance; no blocking gate | `underspecified`: “retire” is not defined as no gate versus no convention. |
| Unowned surfaces | Keep copies, add runtime-label row, relocate checker | Repair event wording and owner docs; defer relocation | `underspecified` owner; `thin evidence` for a relocation incident. |
| Root README | Test through generic DOCS assertions; do not retrieve | Targeted semantic contract; do not retrieve | `thin evidence` for retrieval recall and generic test sufficiency. |
| Word `goal` | Rename review scope manifest/checker | Keep six goal-touch ledgers; stage any new review-specific name | `underspecified` ownership; `thin evidence` for user harm. |
| Machine checks | Four cheap checks in one blocking CLI suite | Owner-specific executable checks with negative controls | `thin evidence` for one cross-surface owner. |

The first report's narrower conclusions survive because current evidence supports them: the source
tree contains multiple non-blocking or specialized width contracts (`code-style-guide.md:196-200`; `commit-msg:164-168`; `grep-convention.md:142-148`), the root README is deliberately excluded from retrieval (`retrieval-conventions.md:276-284`; `corpus.mjs:19-31`), and the plugin's three configurable knobs are read in source but absent from the env example (`opencode-goal.js:78-80,239-247`; `.env.example:289-307`).

The broader conclusions do not survive because the live adapters are event-path driven
(`goal-inject.mjs:76-89`; `goal-context.ts:186-214`), the manifest basename spans six goal-touch
ledgers (the six file citations in section 4), and the existing checks have distinct owners and CI
lanes (`goal-doc-contract.test.cjs:20-45`; `spec-kit-check.yml:94-106`; `advisory-checks.yml:26-35`).

## Residual unknowns and handoff

Three items remain deliberately unresolved:

1. The first report's corpus percentages and exact file sets need the original measurement session or
   a reproducible rerun; its synthesis names the result but not a replayable measurement artifact
   (`.../research/research.md:71-97,221-244`; `iterations/iteration-001.md:13-21`).
2. No cited operator incident establishes that `goal-file-manifest.txt` causes wrong-surface use;
   that evidence is required before a global rename.
3. The repository does not name one owner for support-story wording, runtime-label documentation,
   and manifest migration. An implementation packet should choose the owner and the authoritative
   check before changing shared documentation or paths.

These are handoff decisions, not reasons to synthesize early. The configured cap was reached after
both required iterations, so this synthesis records `stopReason: maxIterationsReached` and does not
claim convergence.

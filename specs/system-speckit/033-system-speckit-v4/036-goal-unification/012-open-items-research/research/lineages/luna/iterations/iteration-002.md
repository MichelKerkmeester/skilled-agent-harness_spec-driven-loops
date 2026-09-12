# Iteration 2: Five direct recommendations after the adversarial audit

## Focus

Turn iteration 1's citation corrections into one recommendation for each open item. Each section
states the exact delta from the first report, the evidence that separates the answers, the cost and
blast radius, and the condition under which the first report would win. Disagreements are kept
separate: `underspecified` means the requested policy is not defined; `thin evidence` means a
decision depends on an absent incident, query, or reproducible measurement.

## 1. Prose line width

### Recommendation

Keep a non-binding readability convention around 100–120 characters, explicitly scoped to prose
readability, and make the decision “no blocking Markdown width gate.” Do not rewrap the existing
corpus and do not add a goal-document line-budget test. If the implementation packet needs a durable
decision, one sentence should clarify the scope of the convention; no production behavior changes.

### Exact difference from the first report

The first report recommends retiring the 100-character limit entirely, with no exemption clause and
zero file changes ([SOURCE: `research/research.md:93-97`]). This lineage agrees with its rejection of
a hard repo-wide lint, but rejects the broader retirement: current universal guidance still says
soft 100–120 and to wrap only when readability improves ([SOURCE:
`.opencode/skills/sk-code/shared/references/universal/code-style-guide.md:196-200`]). The repository
also contains a 100-character commit-body warning ([SOURCE: `.opencode/scripts/git-hooks/commit-msg:164-168`])
and a 100-character retrieval phrase ceiling ([SOURCE:
`.opencode/skills/system-spec-kit/references/structure/grep-convention.md:142-148`]). Those are
different contracts, but they make “retire the number everywhere” the wrong scope.

### Cost and blast radius

The recommended decision is one optional documentation clarification and zero runtime or test
changes. A hard linter would touch the broad Markdown corpus measured by the first report
([SOURCE: `research/research.md:80-97`]); that is the high-blast alternative being declined. The
first report's zero-cost estimate is valid only for recording “no blocking gate,” not for deleting
or reconciling every width convention.

### When the first report would win

The first answer wins if the operator explicitly means “remove every prose-width convention,” the
universal style guide is declared out of scope, and a recovered measurement proves that no
consumer relies on the soft guidance. The current evidence does not establish those conditions.
The disagreement is **underspecified**, not something to average.

## 2. Unowned surfaces

### Recommendation

Split the inventory by ownership and repair level:

1. Keep the consistent Node flag and runtime support restatements; the canonical Node resolver and
   existing tests already own the behavior ([SOURCE: `.opencode/hooks/shared/hook-flags.cjs:34-52`,
   `.opencode/hooks/shared/hook-flags.test.cjs:35-71`]).
2. Correct the support story so “resend” means a reminder delivered on the next supported adapter
   event, not an automatic message at packet-file change time. The current adapters inject and
   record only inside their event paths ([SOURCE: `.opencode/hooks/goal/cursor/goal-inject.mjs:76-89`,
   `.opencode/hooks/goal/devin/goal-inject.mjs:64-79`, `.opencode/hooks/goal/pi/goal-context.ts:186-199`]).
3. Add `OPENCODE_GOAL_RUNTIME_LABEL` to the general goal README's configuration table, making that
   document the owner; it is read by the CLI ([SOURCE: `.opencode/hooks/goal/bin/goal.cjs:385-396`])
   and is currently only in the root env example ([SOURCE: `.env.example:289-307`]) rather than the
   general table ([SOURCE: `.opencode/hooks/goal/README.md:126-137`]).
4. Do not relocate the manifest checker yet. The two validation stages are complementary, and the
   current Vitest callers pass explicit temporary manifest and repo-root arguments
   ([SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:65-93`]).
   Record the packet-resident path as a maintenance boundary; revisit relocation only if a live
   reusable-runtime owner is named.
5. Keep the POSIX mirror's limitation explicit: it derives default-shape flags only
   ([SOURCE: `.opencode/hooks/shared/hook-flags.sh:42-47`, `.opencode/hooks/shared/README.md:31-44`]).
   Add shell parity only if a goal shell entrypoint becomes an asserted surface.

### Exact difference from the first report

The first report agrees with keeping cheap duplication and adding one runtime-label row, but calls
the support copies fully consistent and recommends relocating the checker in the same change
([SOURCE: `research/research.md:103-126`]). This lineage rejects the automatic-resend claim and
defers relocation because the test does not use the checker's default manifest path
([SOURCE: `check-goal-file-manifest.sh:4-18`]). It also rejects calling the two contracts “drift”
without an invariant that they should enforce the same property ([SOURCE:
`.opencode/commands/deep/assets/deep-review-auto.yaml:373-378`, `check-goal-file-manifest.sh:28-40`]).

### Cost and blast radius

The smallest current change is one owned documentation row plus support-story wording. It does not
move an executable or alter a test path. A later relocation would change the path resolved through
the `.opencode/specs` symlink, the test's realpath/tracked-entry assertion, and the checker's default
basename ([SOURCE: `recursive-child-manifest.vitest.ts:10-23`, `check-goal-file-manifest.sh:4-5`]).
The first report's relocation price is understated unless it also covers those path contracts.

### When the first report would win

The first answer wins if the owner decides that every reusable checker must live under the live
runtime tree, or if a caller is shown that invokes the checker without explicit paths after the
packet is archived. It also wins if the support contract is deliberately changed to promise
file-change-triggered chat resends and an event source is added. Neither condition is shown today;
the ownership boundary is **underspecified** and the current incident evidence is **thin**.

## 3. The root README goal section

### Recommendation

Keep the root README outside both retrieval lanes, but cover the goal section with a targeted
contract test. Extend the existing goal contract test only if it can isolate the section; otherwise
use a small section-specific fixture or support-contract map. Test deterministic claims separately:
the OpenCode command file, Pi command registration, Cursor goal adapter event, Devin goal events,
and the known limitation that Cursor's `beforeSubmitPrompt` registration is not delivery evidence.
Treat the native Claude Code/Codex sentence as an explicit documentation-only claim unless an
external host check is introduced. Correct or qualify the automatic resend sentence before calling
the section green.

### Exact difference from the first report

The first report recommends adding `README.md` to the generic `DOCS` array and adding three small
assertions ([SOURCE: `research/research.md:130-155`]). This lineage agrees with “test it, do not
retrieve it,” but rejects the assumption that the existing path regex plus three assertions covers
the section. The test currently extracts only backticked runtime paths
([SOURCE: `.opencode/plugins/tests/goal-doc-contract.test.cjs:23-45`]), while the README's cadence,
support, and resend statements are prose ([SOURCE: `README.md:861-866`]). The goal adapter is
SessionStart-only, but unrelated `beforeSubmitPrompt` commands are present and known dormant
([SOURCE: `.opencode/hooks/goal/cursor/goal-inject.mjs:1-12`, `.cursor/hooks.json:79-87`,
`.cursor/SYNC.md:81-81`]).

### Cost and blast radius

The recommended scope is one focused contract extension with a section boundary and negative
controls; it is still small, but not just one array entry. Keeping the README out of retrieval avoids
frontmatter and corpus changes because the exclusion is deliberate ([SOURCE:
`.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:276-284`,
`.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:19-31`]). A whole-file generic
scan would couple unrelated marketing prose to a runtime contract and can create false confidence.

### When the first report would win

The first answer wins if the contract is intentionally limited to path-existence citations, or if
the generic test is amended with a reliable section parser and the three assertions actually cover
command, cadence, and resend semantics. If the operator supplies a retrieval-recall failure showing
that excluding README loses needed context, the retrieval decision should also be revisited. No
such query or recall evidence appears in the report, so retrieval disagreement is **thin evidence**.

## 4. The word `goal` naming four things

### Recommendation

Do not rename `goal-file-manifest.txt` globally. Keep the six current files as goal-touch provenance
ledgers, clarify in the deep-review workflow that a packet may supply a declared scope input, and
reserve `review-scope-manifest.txt` for a new artifact whose owner is actually deep-review. If a
future rename is approved, retain an old-name compatibility reader for at least the historical
packet set while migrating live references.

### Exact difference from the first report

The first report recommends renaming the deep-review scope manifest and its checker to
`review-scope-manifest.txt` / `check-review-scope-manifest.sh`, pricing thirteen mostly mechanical
files with no behavior change ([SOURCE: `research/research.md:159-182`]). The current tree shows six
physical `goal-file-manifest.txt` files across sk-design, sk-doc, system-deep-loop, and system-speckit;
each header describes files “this goal touched” and asserts tracking ([SOURCE:
`specs/sk-design/012-sk-design-program/005-reviews-and-remediation/003-remediation-program-review/goal-file-manifest.txt:1-6`,
`specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/goal-file-manifest.txt:1-6`,
`specs/sk-doc/019-skill-routing-refactor/016-documentation-quality-program/goal-file-manifest.txt:1-6`,
`specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/goal-file-manifest.txt:1-6`,
`specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/goal-file-manifest.txt:1-6`,
`specs/system-speckit/033-system-speckit-v4/004-decisions-and-notes-system/006-memory-redesign-verification/goal-file-manifest.txt:1-6`]).
The workflow consumes the basename generically when present ([SOURCE:
`.opencode/commands/deep/assets/deep-review-auto.yaml:369-378`]), so the first report's rename target
is semantically wrong for five files.

### Cost and blast radius

Keeping the names costs no migration. A clarification is a documentation-only change. A global
rename must touch six provenance files, the generic workflow's accepted input name, the checker
default, the realpath-based Vitest assertion, and active packet references such as the completion
packet's manifest contract ([SOURCE:
`specs/system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/001-completion-evidence-reconcile/spec.md:113-150`]).
It also needs a decision about whether historical citations keep the old name. “No behavior change”
is false at the workflow input boundary even if the path-check algorithm remains unchanged.

### When the first report would win

The first answer wins if an inventory proves that all six files are actually review-owned scope
manifests, or if a recorded operator failure shows that the word `goal` causes wrong-surface use.
The current headers contradict the first condition and the report supplies no incident for the
second. The rename question is **underspecified** and the user-harm evidence is **thin**.

## 5. Which facts earn a machine check

### Recommendation

Use owner-specific checks for stable executable contracts, and do not create one generic four-check
Vitest file until ownership and negative controls are explicit:

| Fact | Recommendation | Smallest reliable shape |
|---|---|---|
| Three missing plugin environment knobs | Check | Assert `OPENCODE_GOAL_VERIFIER_TIMEOUT_MS`, `OPENCODE_GOAL_CONTINUATION_TIMEOUT_MS`, and `OPENCODE_GOAL_JSONL_MAX_BYTES` are in `.env.example`; keep CLI-only `RUNTIME_LABEL` in the general goal README owner table. |
| Goal kill-switch behavior | Keep existing check; do not add a roster string scan | Existing resolver tests cover canonical, alias, cross-concern, and config-file behavior; add a shell-specific case only if `goal` is a shell-owned concern. |
| Root README commands/cadences | Check | A section-specific assertion against exact command registration and event paths, with Cursor registration-versus-delivery negative control; no prose-copy scan. |
| Manifest basename/path | Defer | If a rename/relocation is approved, test default and explicit paths, `.opencode/specs` realpath, and a second packet; a string equality assertion alone is insufficient. |
| State-directory behavior | Check only after coverage inventory | Prefer an executable default/env override/lock-location test; do not compare README prose to source line by line. |
| Prose width, support-story wording, historical citations | Do not check as blocking facts | No observed failure contract; preserve them as review evidence or targeted documentation. |

The three missing variables are confirmed by source defaults and reads
([SOURCE: `.opencode/plugins/opencode-goal.js:45-51,78-80,239-247`]) and by their absence from the
root env list ([SOURCE: `.env.example:291-306`]). The current resolver suite already covers goal
canonical and alias behavior ([SOURCE: `.opencode/hooks/shared/hook-flags.test.cjs:35-71`]). The
blocking CLI Vitest lane exists ([SOURCE: `.github/workflows/spec-kit-check.yml:94-98`]), but the
existing goal contract test lives under `.opencode/plugins/tests`
([SOURCE: `.opencode/plugins/tests/goal-doc-contract.test.cjs:20-45`]) while the broad Node test
runner is report-only in the advisory workflow ([SOURCE: `.github/workflows/advisory-checks.yml:26-35`]).
The placement decision is therefore part of the test's blast radius, not a free implementation
detail.

### Exact difference from the first report

The first report proposes one new blocking spec-kit CLI Vitest file containing checks 1–4 and says
the roster scan, README assertions, and basename comparison are cheap ([SOURCE:
`research/research.md:186-217`]). This lineage agrees that undocumented machine-consumed knobs earn
coverage and that line-width/prose-copy/historical checks do not. It rejects the roster string scan
as redundant, rejects the basename comparison as insufficient, narrows README testing to semantic
section assertions, and makes state-path behavior conditionally testable instead of categorically
excluded. It also recommends placing checks with their owning suite unless the CLI project is chosen
as a deliberate cross-surface owner.

### Cost and blast radius

The first report's three documentation lines are enough to make the `.env.example` check green, but
not enough to define ownership across the general goal README and plugin table. The proposed
owner-specific bundle is a few focused assertions distributed or explicitly mapped to existing
suites; it avoids a new generic scanner that can silently pass on prose it never parses. If the
blocking CLI lane is selected, it must import or fixture the plugin/hook paths and carry the Cursor
negative control. If not, extending the existing Node contract test keeps the ownership closer but
requires moving a report-only signal into a blocking lane. Both choices have a real CI blast radius.

### When the first report would win

The first answer wins if the repository explicitly designates the CLI Vitest project as the
cross-surface owner, defines a source-of-truth map for env variables and runtime events, and adds
negative controls for aliases, shell behavior, symlink paths, and the README's event semantics. In
that case one file can be a useful integration guard. Without those contracts, the “cheap four
checks” conclusion is **thin evidence**.

## Cross-cutting decision

Do not average the first and second lineages. The evidence supports three first-report conclusions
with narrower scope: no blocking prose lint, keep the README out of retrieval, and document the
three missing plugin knobs. It does not support the unqualified support-story agreement, parser
drift diagnosis, global manifest rename, or generic four-check shape. The remaining open decisions
are policy/ownership questions, not measurement disagreements.

## Sources Consulted

- First hypothesis and recommendations: `research/research.md:37-49,71-217`.
- Width contracts: `.opencode/skills/sk-code/shared/references/universal/code-style-guide.md:196-200`,
  `.opencode/scripts/git-hooks/commit-msg:164-168`,
  `.opencode/skills/system-spec-kit/references/structure/grep-convention.md:142-148`.
- Goal runtime ownership and cadence: `.opencode/hooks/shared/hook-flags.cjs:34-52`,
  `.opencode/hooks/shared/hook-flags.test.cjs:35-71`,
  `.opencode/hooks/shared/hook-flags.sh:42-47`,
  `.opencode/hooks/goal/cursor/goal-inject.mjs:1-12,76-89`,
  `.opencode/hooks/goal/devin/goal-inject.mjs:64-79`,
  `.opencode/hooks/goal/pi/goal-context.ts:180-214`,
  `.opencode/hooks/injection-contract.md:138-140`.
- README and retrieval: `README.md:859-866`,
  `.opencode/plugins/tests/goal-doc-contract.test.cjs:20-45`,
  `.cursor/hooks.json:79-87`, `.cursor/SYNC.md:81-81`,
  `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:19-31`,
  `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:276-284`.
- Manifest contracts and path ownership: `.opencode/commands/deep/assets/deep-review-auto.yaml:369-378`,
  `check-goal-file-manifest.sh:4-40`,
  `.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:10-23,65-93`,
  the six current manifest headers cited in §4.
- Machine-check placement: `.opencode/plugins/opencode-goal.js:45-51,68-80,239-247`,
  `.env.example:289-307`, `.opencode/hooks/goal/README.md:126-137`,
  `.opencode/hooks/goal/goal-plugin.md:58-76`,
  `.github/workflows/spec-kit-check.yml:94-106`, `.github/workflows/advisory-checks.yml:26-35`.

## Assessment

**newInfoRatio: 0.78.** The recommendations reuse iteration 1's evidence but make five explicit
decisions at the unresolved seams. New information is the narrowed contract for each item: a soft
width convention versus no gate; event-triggered rather than automatic resend; no checker move;
no global manifest rename; and owner-specific machine checks with negative controls.

**Novelty justification:** iteration 1 found where the first report's claims and prices failed;
iteration 2 converts those corrections into direct, non-averaged decisions and conditions for the
first answer to win.

**Confidence:** The five recommendations are high-confidence as scope decisions from the opened
files. The operator-facing choice of owner for the cross-surface test, the need for a manifest
rename, and the desired meaning of “retire” remain marked **underspecified** or **thin evidence**
because the repository supplies no owner declaration, incident, recall query, or recovered corpus
measurement session.

## Reflection

**What worked.** A per-item “difference / evidence / first-answer condition” structure prevented a
blended compromise: the first report's useful no-lint and no-retrieval conclusions were retained,
while its rename and generic-check proposals were rejected for specific contract reasons.

**What failed.** The repository does not contain an authoritative owner map for cross-surface tests,
nor the operator query or incident needed to justify a retrieval expansion or filename rename. Those
questions cannot be settled by more string counting in this two-iteration lineage.

**Ruled out.** Global manifest rename without semantic ownership; automatic-resend wording without
an event source; a static roster membership scan as behavior proof; a basename comparison as path
proof; and a blocking prose-width gate.

## Recommended Next Focus

Synthesis only: reconcile the two iteration records, preserve `maxIterationsReached` as the terminal
stop reason, and publish the five recommendations with their evidence-quality labels.

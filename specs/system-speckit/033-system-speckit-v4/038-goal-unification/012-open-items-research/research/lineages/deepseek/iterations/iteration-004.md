# Iteration 4: The word "goal" naming four unrelated things

## Focus

Ring 4 of the packet strategy: judge what the collision actually costs, recommend rename,
disambiguating note, or nothing — and name every file a rename would touch.

## Findings

**F1. The four referents, and how much machinery each carries.** (1) The packet `goal.md` durable
directive: 194 files in the tree outside research lineages, governed by a template
(`.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl`), a validator
(`.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts`) and the binding
contract. (2) The session goal: the runtime projection of the same directive after the unification
(`.opencode/hooks/goal/`, 14 files, plus `.opencode/plugins/opencode-goal.js`, 3,385 lines). Items
1 and 2 are one system by design — the session goal is defined as the bound packet goal — so the
shared word there is vocabulary, not collision. (3) `goal-file-manifest.txt`, the deep-review
scope manifest: six files in the main tree, one parser in a workflow YAML, one gate script, one
spec-kit test that spawns it. (4) ClickUp's goals feature:
`.opencode/skills/mcp-tooling/mcp-click-up/feature-catalog/mcp-medium-priority/manage-goals.md:19`
self-declares "Capability status: UNSUPPORTED" on a direct `list_tools()` inventory. **Only item 3
carries machinery that can be confused with item 1's contract; item 4 is a namespaced, unsupported
card; items 1 and 2 are intentionally one thing under two names.** [SOURCE: file counts, the
template, the card, read 2026-09-12]

**F2. The cost is already being paid in prose, in the wrong document.** The goal engine README
opens with a note: "The word 'goal' names more than one thing here... A deep-review scope manifest
called `goal-file-manifest.txt` and a third-party integration's own goals feature share the word
and share nothing else. Check which one a document means before acting on it."
(`.opencode/hooks/goal/README.md:19-22`). A reader who needs the warning is the one reading a
deep-review asset or a packet manifest — where the note is not. So the disambiguation exists, and
its placement is the defect: the warning is in the goal system's document, and the collision is in
deep-review's. [SOURCE: `.opencode/hooks/goal/README.md:19-22`]

**F3. The manifest name appears in two parsers with different semantics and one checker.** The
newest resolution path is named as a manifest about goals because its consumer was a goal-scoped
review run, and the format then propagated to six packets where the subject is not a goal. The
deep-review resolve step treats it as the review scope declaration
(`.opencode/commands/deep/assets/deep-review-auto.yaml:373-375`); the gate script treats it as a
trackedness assertion (`.../001-whole-system-gate/check-goal-file-manifest.sh:19-40`); and a spec-kit
vitest treats the checker as its system under test, spawning it three times
(`.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:14-17,70,80,87`).
Every one of those three is about review scope, not about a packet goal.
[SOURCE: the three files, read 2026-09-12]

**F4. A rename touches thirteen live files; the sixty-odd historical records that cite the name
must not be rewritten.** Enumerated:

| # | File | What changes |
|---|---|---|
| 1 | `specs/sk-design/012-sk-design-program/005-reviews-and-remediation/003-remediation-program-review/goal-file-manifest.txt` | file renamed |
| 2 | `specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/goal-file-manifest.txt` | file renamed |
| 3 | `specs/sk-doc/019-skill-routing-refactor/016-documentation-quality-program/goal-file-manifest.txt` | file renamed |
| 4 | `specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/goal-file-manifest.txt` | file renamed |
| 5 | `specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/goal-file-manifest.txt` | file renamed |
| 6 | `specs/system-speckit/033-system-speckit-v4/004-decisions-and-notes-system/006-memory-redesign-verification/goal-file-manifest.txt` | file renamed |
| 7 | `.opencode/commands/deep/assets/deep-review-auto.yaml` | lines 373-374 name the file |
| 8 | `.../001-whole-system-gate/check-goal-file-manifest.sh` | script renamed; line 5 default path; line 21 temp-file prefix |
| 9 | `.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts` | line 16 path constant; three spawn sites follow it |
| 10 | `.opencode/hooks/goal/README.md` | line 21 note: the manifest half is deleted, the ClickUp half stays |
| 11 | `.../005-blocker-closeout/001-completion-evidence-reconcile/spec.md` | prose citation |
| 12 | `.../005-blocker-closeout/001-completion-evidence-reconcile/plan.md` | prose citations (lines 102, 110, 137, 246) |
| 13 | `.../005-blocker-closeout/001-completion-evidence-reconcile/tasks.md` | prose citations (lines 134-135) |

The other ~60 main-tree files that cite the name are review iteration records, prompt archives,
deltas and cross-packet completion records — historical statements about runs that already
happened. A rename does not rewrite them, and any check that failed on them would be wrong.
[SOURCE: `rg -l` plus the read of each live file, 2026-09-12]

**F5. Nothing outside the enumerated list consumes the filename.** The search covered `specs`,
`.opencode` and `.github`, excluding only lineages, containment baselines and `.worktrees`
(machine-generated trees that are not live consumers). No script, hook, workflow or test outside
the three named files reads the manifest. **INFERRED:** an external consumer outside this
repository could read a manifest by name — nothing in-repo can prove otherwise; the settling
action would be an operator check of any downstream automation, and no evidence of one exists.

## Sources Consulted

- `find specs -name 'goal.md'`, `find specs -name 'goal-file-manifest.txt'`, `find .opencode/hooks/goal -type f`
- `.opencode/hooks/goal/README.md:19-22`
- `.opencode/commands/deep/assets/deep-review-auto.yaml:373-375`
- `.../001-whole-system-gate/check-goal-file-manifest.sh:5,19-40`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts:14-17,70-90`
- `.opencode/skills/mcp-tooling/mcp-click-up/feature-catalog/mcp-medium-priority/manage-goals.md:19`
- `specs/system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/001-completion-evidence-reconcile/{spec,plan,tasks}.md`
- Repository-wide citation inventory (`rg -l`), split into live and historical

## Assessment

**newInfoRatio: 0.8.** Five findings. The four-referent inventory was known from the register; new
here is the machinery test (F1: only one of the four is a collision with code attached), the
placement argument (F2: the existing note is in the wrong document), and the exact rename surface
(F4). The five non-live consumers are the useful number: the collision reads large in prose and is
small in code.

**Novelty justification:** the register called the collision a "naming hazard" and suggested an
optional note; this iteration separates the one machine-bearing collision from the three harmless
ones and prices the rename at thirteen live files.

**Confidence:** F1-F4 observed. F5 is INFERRED with its settling action named. The judgement that
the rename is worth thirteen files is a CLAIM; the counter-argument (the word is only ambiguous to
a reader who already knows both systems) is answered by F2 — the engine already paid a note, so the
ambiguity is real enough to have been documented once.

## Reflection

**What worked.** Counting machinery before counting words. "Four things named goal" sounds like a
naming crisis; measuring what each one owns shows three of the four are either the same system or
namespace-isolated, and one carries two parsers and a test.

**What failed.** The first rename inventory mixed historical and live citations: seventy-three
files cite the manifest name, and treating that as the rename surface would have produced a
recommendation to rewrite archived review records. Separating "statements about the live system"
from "statements about a past run" is what made the list actionable at thirteen files.

**Ruled out.** (a) Renaming the session-goal vocabulary: items 1 and 2 are one system after the
unification, and renaming the runtime half would undo the work the parent packet did. (b) Acting on
the ClickUp card: it self-declares unsupported and lives inside an MCP skill namespace where the
word cannot reach a packet manifest. (c) Doing nothing: the disambiguating note exists precisely
because a reader already got this wrong, and it sits in the document whose readers need it least.

## Recommended Next Focus

Ring 5 — machine checks: with rings 1-4 decided, say exactly which facts earn a test, which do not,
and the test shape for each recommendation.

---

## Recommendation (ring 4)

**Rename the deep-review scope manifest to `review-scope-manifest.txt`, and its checker to
`check-review-scope-manifest.sh`, in one change that also folds in ring 2's relocation of the
checker out of the spec packet.**

- **What it removes.** The only collision with live machinery: `rg goal-file-manifest` stops
  returning a document that has nothing to do with the packet goal; the disambiguation note in the
  engine README loses its manifest half and keeps only the ClickUp sentence; deep-review assets
  become self-describing without a warning.
- **Cost.** Thirteen live files, listed in F4: six manifest renames, one script rename with two
  internal references, one workflow YAML (two lines), one test path constant, one note trim, three
  prose documents in the packet that authored the checker. Historical records stay untouched — the
  ~60 review and delta files that cite the old name are evidence of past runs.
- **Blast radius.** No runtime code and no behaviour change: the format, the parser contract and the
  gate logic are identical, only the filename changes. Any out-of-repo automation that reads the old
  name would need a rename notice; no in-repo consumer exists beyond the thirteen files (F5,
  INFERRED for out-of-repo). The two stale copies of manifests under `.worktrees/` keep the old name
  and are not renamed, which is correct — they are other checkouts.

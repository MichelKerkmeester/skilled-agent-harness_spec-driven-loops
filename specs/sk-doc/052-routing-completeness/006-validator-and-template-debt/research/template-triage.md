---
title: "Template Voice Triage"
description: "Every template the voice scanner detects, re-measured after the masking fix, with each hard blocker sorted into author prose, emitted payload, an exemption, or a scanner defect."
trigger_phrases:
  - "template triage"
  - "template payload blockers"
  - "which template blockers are safe to fix"
  - "hvr template backlog"
importance_tier: "important"
contextType: "implementation"
---

# Template Voice Triage

The phase left a backlog with a headline count and no shape. This document gives the backlog its
shape: what each blocker is, whether fixing it changes a generated document, and what order the
work should run in.

---

## 1. OVERVIEW

Phase 6 turned payload scanning on and recorded that most templates carry a hard blocker. The
count alone cannot be acted on, because the blockers are not the same kind of thing. Some sit in
prose that only an author reads. Some sit in the block a template copies into a new file. A few
have to stay where they are. And some are there because the scanner still reads a span it masks
everywhere else.

Sections 1 through 11 are the triage as it stood on 2026-09-03, when nothing under `.opencode/`
had been edited. Their output is a per-file class, a ranked order, and a list of scanner defects
for the owner of `hvr_scan.py`. **Section 12 records the sweep the operator then authorized, and
its counts supersede every number above it.** Read it first if you want the current state.

---

## 2. METHOD AND COMMANDS

Detection is the scanner's own `is_template_path`, so the file list is what the scanner would act
on rather than a hand-picked set. The enumeration was run against the git index rather than the
working tree, so a stray file cannot change the denominator.

```bash
python3 - <<'PY'
import subprocess, sys
sys.path.insert(0, ".opencode/skills/sk-doc/sk-create-with-human-voice/scripts")
from hvr_scan import is_template_path
tracked = subprocess.run(["git", "ls-files"], capture_output=True, text=True).stdout.split()
print("\n".join(p for p in tracked if p.endswith(".md") and is_template_path(p)))
PY
```

Scanning uses the shipped entry point, every occurrence, JSON out:

```bash
python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py \
  $(cat files.txt) --all --json > scan.json
```

Each hard finding was then placed by position. A small classifier read every target twice: once
reproducing the scanner's own fence bookkeeping, and once with a nesting-aware model that closes a
fence only on a marker of the same character and at least the same length. The second read is what
tells an inner sample apart from the payload that wraps it. Positions recorded per finding: outside
any fence, inside an HTML guidance comment, inside the payload fence, inside a frontmatter block at
the head of a payload fence, and inside a paired inline code span within a payload.

Position alone does not settle the class, because templates come in three shapes and the shape
decides what reaches a new file:

| Shape | What reaches the new file | Files |
|---|---|---|
| Wrapper | Only the fenced payload. Prose outside it is guidance | Most of the set, including every `create` asset with a `markdown` or `text` fence |
| Whole file | The body itself, minus guidance comments and the `version` line | The four benchmark scaffolds that say `cp this file`, plus the root router and the skill scaffold |
| Wrapper with a dropped shell | Only a `json` fence. The whole markdown shell is discarded at authoring time | The three `model-benchmark` scaffolds |

Shape was read from each file's own usage block, not inferred. The `json` fences in the third shape
stay masked, which is why those files show no emitted blockers at all.

---

## 3. DENOMINATOR RECONCILIATION

The two numbers in the phase record measure two different roots, and one of them does not
reproduce.

| Measurement | Files detected | Files with a blocker | Blockers |
|---|---|---|---|
| Under `.opencode/`, before `82938b3e1c` | 50 | 41 | 594 |
| Under `.opencode/`, today | 50 | 38 | 520 |
| Tracked repo-wide, before `82938b3e1c` | 53 | 44 | 606 |
| Tracked repo-wide, today | 53 | 41 | 530 |

The 53 is repo-wide and the 50 is the `.opencode/` subset. The three extra targets are one archived
advisor template and two `iter-template.md` files under `specs/`. No template was added, removed or
renamed between `d229b0a24d` and today, and detection is byte-identical across that range, so the
denominator did not move at all. Only the scope of the sentence quoting it moved.

The numerator moved for a real reason. `82938b3e1c` gave a detected template the same masking every
other target gets, so a `TypeScript` sample, an inline code span and a frontmatter block stopped
reading as prose. Three files under `.opencode/` fell to zero and 74 occurrences went with them.

One figure does not reproduce. The record says 45 of 53. Re-running the pre-fix scanner gives 44 of 53, one file
lower. Holding the rule set at `d229b0a24d` returns the same 41 under `.opencode/` that today's rule
set returns, so the rule set is not the difference either. Treat 45 as unverified and 44 as the
measured baseline.

---

## 4. THE FOUR CLASSES

**PROSE.** Author-facing text in the template: guidance, headings, the usage block, an HTML comment
the author deletes. A rewrite here reaches no generated document.

**PAYLOAD-EMITTED.** Text the template copies into the new file. A rewrite changes downstream output
and needs a per-template decision.

**PAYLOAD-EXEMPT.** Content that has to carry the blocker to work. Two cases appear here: a line that
quotes the ban list back at the author, and a component name the tree uses as a proper noun.

**MASK-GAP.** The blocker sits in a span the scanner masks everywhere else, so the finding is a
scanner defect rather than a voice defect.

---

## 5. PER-FILE TRIAGE

Mix column: `P` prose, `E` emitted, `X` exempt, `G` gap. First offender gives the line and the term.

| Path | Blockers | Dominant | Mix | First offender | Proposed action |
|---|---|---|---|---|---|
| `.opencode/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md` | 62 | PROSE | P53 E9 | 21 `;` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-profile-template.md` | 38 | PROSE | P38 | 35 `—` | Rewrite guidance prose. No output change |
| `.opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | 35 | PROSE | P27 E7 X1 | 125 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | 31 | PROSE | P14 E11 G6 | 20 `;` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md` | 29 | PROSE | P29 | 29 `—` | Rewrite guidance prose. No output change |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md` | 27 | PAYLOAD-EMITTED | E22 P5 | 37 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md` | 23 | PROSE | P18 E5 | 33 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md` | 20 | PROSE | P14 E6 | 90 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md` | 20 | PROSE | P20 | 24 `—` | Rewrite guidance prose. No output change |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md` | 20 | PAYLOAD-EMITTED | E12 X4 P4 | 26 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-template.md` | 17 | PROSE | P14 E3 | 208 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` | 17 | PROSE | P10 G4 E3 | 35 `;` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md` | 16 | MASK-GAP | G9 P6 E1 | 18 `—` | Hold for the scanner ruling |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-procedure-template.md` | 16 | PROSE | P11 E5 | 22 `;` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | 14 | MASK-GAP | G6 E5 P3 | 34 `;` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-design-md-generator/assets/design-md-prompt-template.md` | 13 | PAYLOAD-EMITTED | E9 P4 | 28 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-router-template.md` | 12 | PROSE | P11 E1 | 34 `;` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rule-template.md` | 12 | PROSE | P8 G3 E1 | 41 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md` | 12 | PAYLOAD-EMITTED | E12 | 17 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/cli-external-orchestration/cli-cursor/assets/prompt-templates.md` | 11 | PROSE | P11 | 36 `—` | Rewrite guidance prose. No output change |
| `.opencode/skills/cli-external-orchestration/cli-codex/assets/prompt-templates.md` | 10 | PROSE | P10 | 39 `;` | Rewrite guidance prose. No output change |
| `.opencode/skills/cli-external-orchestration/cli-pi/assets/prompt-templates.md` | 10 | PROSE | P10 | 36 `;` | Rewrite guidance prose. No output change |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md` | 8 | PAYLOAD-EMITTED | E7 P1 | 34 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md` | 7 | PROSE | P4 E3 | 34 `;` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-readme/assets/install-guide-template.md` | 6 | PAYLOAD-EXEMPT | X5 P1 | 136 `;` | Record the exemption |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | 5 | PROSE | P5 | 37 `;` | Rewrite guidance prose. No output change |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-sync-manifest-template.md` | 5 | PAYLOAD-EMITTED | E3 G1 P1 | 44 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rules-router-template.md` | 4 | PROSE | E2 P2 | 17 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md` | 3 | PROSE | P3 | 172 `;` | Rewrite guidance prose. No output change |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` | 3 | PROSE | P3 | 84 `;` | Rewrite guidance prose. No output change |
| `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md` | 3 | PAYLOAD-EMITTED | E3 | 41 `—` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/cli-external-orchestration/cli-claude-code/assets/prompt-templates.md` | 2 | PROSE | P2 | 602 `;` | Rewrite guidance prose. No output change |
| `.opencode/skills/sk-doc/shared/assets/llmstxt-templates.md` | 2 | PROSE | P2 | 223 `journey` | Rewrite guidance prose. No output change |
| `.opencode/skills/sk-doc/sk-create-benchmark/assets/shared/benchmark-report-template.md` | 2 | PAYLOAD-EMITTED | E1 P1 | 191 `journey` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-presentation-template.md` | 2 | PAYLOAD-EMITTED | E2 | 45 `;` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/cli-external-orchestration/cli-devin/assets/prompt-templates.md` | 1 | PROSE | P1 | 530 `;` | Rewrite guidance prose. No output change |
| `.opencode/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | 1 | PAYLOAD-EMITTED | E1 | 92 `;` | Split fix. Guidance now, emitted spans by decision |
| `.opencode/skills/sk-git/assets/commit-message-template.md` | 1 | PROSE | P1 | 125 `—` | Rewrite guidance prose. No output change |

Twelve of the fifty detected templates carry no hard blocker and are absent from this table.

---

## 6. CLASS TOTALS

Across the 520 occurrences under `.opencode/`:

| Class | Occurrences | Share | Files where it is dominant |
|---|---|---|---|
| PROSE | 347 | 67% | 25 |
| PAYLOAD-EMITTED | 134 | 26% | 10 |
| MASK-GAP | 29 | 6% | 2 |
| PAYLOAD-EXEMPT | 10 | 2% | 1 |

Two thirds of the backlog never reaches a generated document. That is the finding this triage
exists to produce, and it is the difference between a review-bearing sweep and a prose pass.

Punctuation carries almost all of it. Of 520 occurrences, 507 are an em dash or a semicolon and
13 are a word blocker. The word blockers are five instances of one component name, five words
quoted from the ban list itself, two uses of `journey` as a section heading, and one in a
narrative opening.

---

## 7. RANKED ORDER, TIER 1: PROSE ONLY

Fourteen files whose blockers are all guidance, with no emitted span and no scanner defect. A
rewrite here cannot change any generated document, so these need no per-template decision and no
downstream check. 136 occurrences.

| Path | Prose blockers | Note |
|---|---|---|
| `sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-profile-template.md` | 38 | all guidance |
| `sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md` | 29 | all guidance |
| `sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md` | 20 | all guidance |
| `cli-external-orchestration/cli-cursor/assets/prompt-templates.md` | 11 | all guidance |
| `cli-external-orchestration/cli-codex/assets/prompt-templates.md` | 10 | all guidance |
| `cli-external-orchestration/cli-pi/assets/prompt-templates.md` | 10 | all guidance |
| `sk-doc/sk-create-readme/assets/install-guide-template.md` | 1 | 5 exempt alongside |
| `sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | 5 | all guidance |
| `sk-doc/sk-create-skill/assets/skill/skill-asset-template.md` | 3 | all guidance |
| `sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` | 3 | all guidance |
| `cli-external-orchestration/cli-claude-code/assets/prompt-templates.md` | 2 | all guidance |
| `sk-doc/shared/assets/llmstxt-templates.md` | 2 | all guidance |
| `cli-external-orchestration/cli-devin/assets/prompt-templates.md` | 1 | all guidance |
| `sk-git/assets/commit-message-template.md` | 1 | all guidance |

The three `model-benchmark` scaffolds hold 87 of the 136 between them, and every one of those sits
in a guidance comment or a usage block that the author discards. They are the cheapest 87
occurrences in the backlog.

---

## 8. RANKED ORDER, TIER 2: EMITTED, WITH THE CONSUMER NAMED

Twenty-four files carry at least one emitted blocker, 134 occurrences in total. Each row needs a
decision, because the rewrite changes what the next authored document contains.

| Path | Emitted blockers | Who consumes it |
|---|---|---|
| `sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md` | 22 | `sk-create-benchmark/SKILL.md` and `references/behavior-benchmark/behavior-benchmark-guide.md`. Copied by hand to `<mode>/behavior-benchmark/behavior-benchmark.md` |
| `sk-doc/sk-create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md` | 12 | `sk-create-benchmark/SKILL.md`. Copied to `<skill-hub>/benchmark/README.md` |
| `sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md` | 12 | `/create:skill-parent`, `sk-create-skill/SKILL.md`, `references/parent-skill/parent-skills-nested-packets.md`. Becomes a hub `ROUTER.md` |
| `sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | 11 | `.opencode/commands/create/skill-parent.md` and `sk-doc/ROUTER.md`. Becomes a hub `SKILL.md` |
| `cli-external-orchestration/cli-opencode/assets/prompt-templates.md` | 9 | `cli-opencode` references. Emitted as dispatch prompt text, never as a file |
| `sk-design-md-generator/assets/design-md-prompt-template.md` | 9 | `sk-design-md-generator/SKILL.md` and its feature catalog. Emitted as a prompt |
| `sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | 7 | `sk-create-frontmatter` and every skill that copies a frontmatter block |
| `sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md` | 7 | Same guide. Copied to `<mode>/behavior-benchmark/baselines/claude-baseline.md` |
| `sk-doc/sk-create-agent/assets/agent-template.md` | 6 | `/create:agent` through `.opencode/agents/markdown.md`. Becomes an agent `.md` |
| `sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md` | 5 | Same guide. Copied to `<mode>/behavior-benchmark/scenarios/<id>.md` |
| `sk-doc/sk-create-skill/assets/skill/skill-procedure-template.md` | 5 | `sk-create-skill/SKILL.md` and `sk-doc/leaf-manifest.json` |
| `sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | 5 | `/create:manual-testing-playbook` |
| `sk-doc/sk-create-command/assets/command-template.md` | 3 | `/create:command`. Becomes a slash command |
| `sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` | 3 | `/create:feature-catalog`. Becomes one catalog entry |
| `sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md` | 3 | `/create:feature-catalog`. Becomes `feature-catalog.md` |
| `sk-doc/sk-create-skill/assets/skill/skill-sync-manifest-template.md` | 3 | `sk-create-skill/SKILL.md`. Becomes a runtime sync manifest |
| `sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md` | 3 | `sk-create-skill/scripts/init_skill.py` reads and substitutes it. Pinned by two tests in `sk-doc/scripts/tests/test_skill_contract.py` |
| `sk-doc/sk-create-repo-rule/assets/repo-rules-router-template.md` | 2 | `sk-create-repo-rule/SKILL.md`. Becomes a root `REPO RULES.md` |
| `sk-doc/sk-create-command/assets/command-presentation-template.md` | 2 | `/create:command`. Becomes a presentation asset |
| `sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md` | 1 | `/create:manual-testing-playbook` |
| `sk-doc/sk-create-command/assets/command-router-template.md` | 1 | `/create:command`. Becomes a command router |
| `sk-doc/sk-create-repo-rule/assets/repo-rule-template.md` | 1 | `sk-create-repo-rule/SKILL.md`. Becomes a `repo-rules/*.md` |
| `sk-doc/sk-create-benchmark/assets/shared/benchmark-report-template.md` | 1 | `/create:benchmark` through `.opencode/agents/markdown.md`. Copied to `mcp-server/benchmarks/<date>/benchmark-report.md` |
| `sk-doc/sk-create-changelog/assets/changelog-template.md` | 1 | `/create:changelog`. Becomes a versioned changelog entry |

One consumer is a program rather than a person. `init_skill.py` reads
`skill-scaffold-template.md`, substitutes two placeholders and writes a new `SKILL.md`, and two
tests in `test_skill_contract.py` assert its heading order and its router markers. Both tests read
headings and markers rather than punctuation, so removing three em dashes from its body does not
trip them. Every other consumer in this table is a human copy step driven from a `SKILL.md`, a
`ROUTER.md` or a `/create:` command, which is why no snapshot pins their bytes.

The already-authored documents are the second half of tier 2. Correcting a template does not
correct what it seeded, and phase 6 established the order: fix the generator, then decide about the
copies. That second decision is not in scope here and no count of affected documents was taken.

---

## 9. RANKED ORDER, TIER 3: EXEMPTIONS

Ten occurrences must stay as they are.

| Path | Occurrences | Why it stays |
|---|---|---|
| `sk-doc/sk-create-readme/assets/install-guide-template.md` line 432 | 5 | The line quotes the ban list back at the author. Rewriting it deletes the instruction |
| `sk-doc/sk-create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md` lines 53, 65, 172, 190 | 4 | Names the Lane C benchmark `harness`, a component in `system-deep-loop/deep-improvement` |
| `sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` line 261 | 1 | Names the Claude Code `harness` as the runtime that imposes the limits described |

The first row is the case `scope-and-exemptions.md` section 3 already covers as text about the
banned words. The `harness` rows are the weaker case and want a ruling: the standard blocks the
word, the tree uses it as the name of a thing, and no rewrite of those four rows survives contact
with the component it points at.

The scanner has no mechanism for either. Today an exemption lives in a voice report, which the next
scanner run has never read. Two options, cheapest first. A marker comment the scanner honors on the
following line, in the shape the validators already use, keeps the reason next to the span. A path
and term allowlist parsed from `scope-and-exemptions.md` keeps every exemption in one reviewable
place and matches how the fixture-tree exemption was shared between the two gates in `d229b0a24d`.
The second is the better fit for a term like `harness` that recurs across files.

---

## 10. TIER 4: MASK-GAP FINDINGS FOR THE SCANNER OWNER

Twenty-nine occurrences are scanner defects. Both shapes are the same omission: a template payload
is read as prose all the way down, so spans that are masked in every other document stay visible
inside it.

**Shape A, inline code inside a payload. Ten occurrences, unambiguous.** `mask_untargeted` collects
its paragraph indexes only while `in_fence` is false, so `_mask_inline_spans` never runs on a line
inside the payload fence. A backticked placeholder in the emitted document is code in that document
exactly as it is in this one.

| Path | Lines | Span |
|---|---|---|
| `sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md` | 97, 109 | ``- Prompt: `{PROMPT ...}` `` |
| `sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | 315, 335, 398 | ``Prompt: `{PROMPT ...}` `` |

Each of those lines reports two blockers, one em dash and one semicolon, both inside the same paired
backtick span.

**Shape B, frontmatter at the head of a payload. Nineteen occurrences, a judgment call.** The
scanner masks a document's own frontmatter and then reads the frontmatter of the document the
template emits. Several of the flagged lines are `yaml` comments carrying a field's guidance, which
is the code-comment case rather than the prose case.

| Path | Lines | Fence |
|---|---|---|
| `sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | 108, 109 (twice), 128, 129 (twice) | `yaml` fences at 105 and 125 |
| `sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md` | 54 (twice), 55, 60, 64 | `markdown` fence at 50 |
| `sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` | 39, 40, 41, 46 | payload fence at 37 |
| `sk-doc/sk-create-repo-rule/assets/repo-rule-template.md` | 41, 42, 43 | payload fence at 36 |
| `sk-doc/sk-create-skill/assets/skill/skill-sync-manifest-template.md` | 44 | payload fence at 42 |

Shape B has a defensible reading in the other direction: an em dash in an emitted frontmatter
`description` does reach a shipped document, and catching it is why payload scanning exists. The
call belongs to the owner of `hvr_scan.py` rather than to this triage. Whichever way it goes, the
19 occurrences should be settled once rather than re-litigated per template, and the three files
whose dominant class is a gap should not be rewritten before the ruling lands.

One more thing for the same owner, found while building the position model and not counted above.
`mask_untargeted` toggles a single boolean on any fence marker and ignores the marker's length, so a
nested fence inverts the state for the rest of the block. `parent-skill-hub-template.md` opens a
four-backtick `markdown` payload at line 125 and holds three-backtick fences inside it, and the
scanner reads lines 204 and 207 as prose outside any fence when they are payload. Both readings
scanned those lines here, so the count is unaffected. On a payload holding a `bash` sample the same
inversion would mask the wrong side.

**Shape B ruled on 2026-09-04.** The operator decided an emitted frontmatter block is masked the
same way a document's own is. It is a field skeleton rather than prose, and flagging it asks an
author to change what the template produces in order to clear a finding nobody reads. The scanner
now recognises a frontmatter block wherever it sits, using the second line to tell one from a rule
between sections, since both open with three dashes. The fleet count moves 530 to 509 across seven
files, and no file changes whether it carries a blocker at all.

**Fixed on 2026-09-03.** A fence now closes only on a run of the same character at least as long as
the one that opened it, which is the rule the format itself uses. The fleet count is unchanged at
530 across 54 detected templates, which is what a latent defect should do, so a regression test is
the only thing that can prove the fix. The test builds a four-backtick payload holding a shell
sample and asserts the semicolon inside it stays masked. It fails against the previous scanner and
passes against the current one.

---

## 11. THE ASK

**All four were answered, and section 12 records what happened.** They are kept as written
because the reasoning behind each answer is easier to judge against the question that prompted it.

1. **Tier 1, 136 occurrences across 14 files. Approved and done.** Approve a prose pass over guidance text only. It
   touches no fenced payload, changes no generated document, and needs no downstream check. The
   proof is a re-scan showing those files at zero and every payload fence byte-identical.
2. **Tier 2, 134 occurrences across 24 files. Approved for every template except the exemptions.** Approve or decline per template. A yes changes what
   the next authored document contains, so the pass would be one commit per owning skill with the
   consumer named in the message. `skill-scaffold-template.md` is the only one a program reads.
3. **Tier 3, 10 occurrences. `harness` ruled literal and left in place. The mechanism is still unbuilt.** Rule on `harness`, then choose the exemption mechanism. Without a
   mechanism the next scan re-reports all ten.
4. **Tier 4, 29 occurrences plus the nesting defect. Both shapes settled.** Shape B was ruled on
   in the scanner. Shape A turned out to need no scanner change at all: all ten occurrences were
   inside `{PROMPT ...}` placeholders in the two playbook templates, and the sweep rewrote the
   placeholders, which is the better fix because the placeholder was modelling banned punctuation
   for the author who fills it in. Route to the owner of `hvr_scan.py`. Shape A
   is a straight fix. Shape B needs a ruling first.

The estimate held exactly. The sweep touched 38 template files under `.opencode/`, and 24 of them
carry an emitted blocker. Emitted output changed in 23. The twenty-fourth is
`changelog-template.md`, whose single emitted occurrence is the `&nbsp;` entity and stays.

---

## 12. THE SWEEP, 2026-09-04

The operator authorized the rewrite across every class except the exemptions, on the condition
that each emitted change is an improvement rather than a quieter scan. This section records what
the sweep did, what it declined, and what each file's consumer said before and after.

### Re-measurement against the triage

The triage's counts predate both scanner rulings, so the sweep re-enumerated first, using
`is_template_path` over `git ls-files` and the shipped entry point with `--all --json`.

| Measurement | Files detected | Files with a blocker | Blockers |
|---|---:|---:|---:|
| Tracked repo-wide, as the triage recorded it | 53 | 41 | 530 |
| Tracked repo-wide, at the start of this sweep | 54 | 41 | 509 |
| Tracked repo-wide, after the sweep | 54 | 8 | 22 |

Two numbers moved and one did not. The denominator gained a file because
`sk-create-benchmark/assets/shared/source-template.md` was added after the triage ran, and it
carries no blocker, so the count of files with a blocker held at 41. The occurrence count fell
by 21, which is the emitted-frontmatter ruling of 2026-09-04 taking 19 occurrences across five
files, plus two more the same masking change removed from files the triage listed at a higher
count. Nothing else in the triage's per-file table failed to reproduce.

### Result per file

Guidance and Emitted split the Before column by where each blocker sat. A blocker in a
discarded markdown shell counts as guidance, because nothing carries it into a new file.

| Template | Before | After | Guidance | Emitted | What it emits |
|---|---:|---:|---:|---:|---|
| `cli-external-orchestration/cli-opencode/assets/prompt-templates.md` | 62 | 0 | 53 | 9 | Dispatch prompt text, never a file |
| `sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-profile-template.md` | 38 | 0 | 38 | 0 | A benchmark profile `.json`, markdown shell discarded |
| `sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | 35 | 2 | 28 | 7 | Frontmatter blocks copied into new docs |
| `sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md` | 29 | 0 | 29 | 0 | A fixture `.json`, markdown shell discarded |
| `sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md` | 27 | 0 | 7 | 20 | `<mode>/behavior-benchmark/behavior-benchmark.md` |
| `sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | 25 | 0 | 14 | 11 | A hub `SKILL.md` |
| `sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md` | 23 | 0 | 18 | 5 | `scenarios/<id>.md` |
| `sk-doc/sk-create-agent/assets/agent-template.md` | 20 | 0 | 14 | 6 | An agent `.md` |
| `sk-doc/sk-create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md` | 20 | 0 | 20 | 0 | A fixture `.json`, markdown shell discarded |
| `sk-doc/sk-create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md` | 20 | 4 | 7 | 13 | `<hub>/benchmark/README.md` |
| `sk-doc/sk-create-command/assets/command-template.md` | 17 | 0 | 13 | 4 | A slash command |
| `sk-doc/sk-create-skill/assets/skill/skill-procedure-template.md` | 16 | 0 | 11 | 5 | A procedure card |
| `sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | 14 | 0 | 3 | 11 | A playbook index |
| `sk-design-md-generator/assets/design-md-prompt-template.md` | 13 | 2 | 4 | 9 | A write-phase prompt |
| `sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` | 13 | 0 | 10 | 3 | One catalog entry |
| `sk-doc/sk-create-command/assets/command-router-template.md` | 12 | 0 | 9 | 3 | A command router |
| `sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md` | 12 | 0 | 0 | 12 | A hub `ROUTER.md` |
| `cli-external-orchestration/cli-cursor/assets/prompt-templates.md` | 11 | 0 | 11 | 0 | Dispatch prompt text, never a file |
| `sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md` | 11 | 0 | 6 | 5 | One playbook scenario |
| `cli-external-orchestration/cli-codex/assets/prompt-templates.md` | 10 | 0 | 10 | 0 | Dispatch prompt text, never a file |
| `cli-external-orchestration/cli-pi/assets/prompt-templates.md` | 10 | 0 | 10 | 0 | Dispatch prompt text, never a file |
| `sk-doc/sk-create-repo-rule/assets/repo-rule-template.md` | 9 | 0 | 8 | 1 | A `repo-rules/*.md` |
| `sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md` | 8 | 0 | 1 | 7 | `baselines/claude-baseline.md` |
| `sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md` | 7 | 0 | 4 | 3 | `feature-catalog.md` |
| `sk-doc/sk-create-readme/assets/install-guide-template.md` | 6 | 5 | 6 | 0 | An install guide |
| `sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | 5 | 0 | 5 | 0 | Guidance only |
| `sk-doc/sk-create-repo-rule/assets/repo-rules-router-template.md` | 4 | 0 | 2 | 2 | A root `REPO RULES.md` |
| `sk-doc/sk-create-skill/assets/skill/skill-sync-manifest-template.md` | 4 | 0 | 0 | 4 | A runtime sync manifest |
| `sk-doc/sk-create-skill/assets/skill/skill-asset-template.md` | 3 | 0 | 3 | 0 | Guidance only |
| `sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` | 3 | 0 | 3 | 0 | Guidance only |
| `sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md` | 3 | 0 | 0 | 3 | A skill `SKILL.md`, written by `init_skill.py` |
| `cli-external-orchestration/cli-claude-code/assets/prompt-templates.md` | 2 | 0 | 2 | 0 | Dispatch prompt text, never a file |
| `sk-doc/shared/assets/llmstxt-templates.md` | 2 | 0 | 2 | 0 | An `llms.txt` |
| `sk-doc/sk-create-benchmark/assets/shared/benchmark-report-template.md` | 2 | 0 | 1 | 1 | `benchmarks/<date>/benchmark-report.md` |
| `sk-doc/sk-create-command/assets/command-presentation-template.md` | 2 | 0 | 0 | 2 | A presentation asset |
| `cli-external-orchestration/cli-devin/assets/prompt-templates.md` | 1 | 0 | 1 | 0 | Dispatch prompt text, never a file |
| `sk-doc/sk-create-changelog/assets/changelog-template.md` | 1 | 1 | 0 | 1 | A versioned changelog entry |
| `sk-git/assets/commit-message-template.md` | 1 | 0 | 1 | 0 | A commit message |

Under `.opencode/` the sweep closed 501 blockers down to 14, across 38 files. 354 sat in
guidance and 147 in emitted text.

### Why each emitted rewrite is an improvement

One line per file whose payload changed. The test is whether the generated document reads
better, not whether the scan is quieter.

| Template | The emitted change | Why the output is better |
|---|---|---|
| `cli-opencode/assets/prompt-templates.md` | Nine dispatch-prompt directives split at the punctuation | A model reading a rules list gets two rules where an aside used to hang off the first |
| `behavior-benchmark-index-template.md` | Twenty contract sentences in the emitted index | The index states a measurement contract, and each clause now stands as its own assertion instead of trailing a dash |
| `skill-benchmark-readme-template.md` | Thirteen lines in the emitted hub index, four left as exemptions | Same reason, and the run-label immutability rule now reads as an instruction rather than a parenthetical |
| `parent-skill-root-router-template.md` | Twelve lines including the H1 and the two state tables | The two router states are the document's whole point, and each now reads as a complete claim |
| `parent-skill-hub-template.md` | Eleven lines of the emitted hub `SKILL.md`, including the compiled-routing directive | The ALWAYS and ESCALATE bullets are read as commands, and a command should be one sentence |
| `manual-testing-playbook-template.md` | Eleven lines, including the `{PROMPT ...}` placeholders | The placeholder told an author to write a prompt while modelling banned punctuation inside it |
| `design-md-prompt-template.md` | Nine cardinal rules in the emitted write-phase prompt, two left as exemptions | Each cardinal rule is now one sentence, which is how a model reads a numbered constraint |
| `behavior-benchmark-baseline-template.md` | Seven lines including the H1 | The capture-provenance bullets each name one fact now |
| `frontmatter-templates.md` | Seven copy-paste field rows and yaml comments, one left as an exemption | A field rule that fits one sentence is easier to check against a real block |
| `agent-template.md` | Six lines of the emitted agent `.md` | The budget table cells read as two values rather than one clause |
| `skill-procedure-template.md` | Five lines of the emitted card | The proof gate and the redaction steps are now separate imperatives |
| `manual-testing-playbook-snippet-template.md` | Five lines including the prompt placeholder | Same reason as the index template |
| `behavior-benchmark-scenario-template.md` | The emitted scenario H1 separator | New scenarios stop seeding the character the standard bans, at the cost of differing from the shipped siblings until those are corrected |
| `command-template.md` | Four lines including two `**Inputs:**` rows | An input line that names a placeholder and then explains it reads better as one clause |
| `skill-sync-manifest-template.md` | Four table cells | `No, same inode` says the same thing as the dash form and survives a plain-text render |
| `command-router-template.md` | Three lines of the emitted router | The input gate and the dispatch prohibition are each one rule now |
| `feature-catalog-snippet-template.md` | Three lines, two of them Related Resources bullets | The bullets now match the separator the rest of the tree uses |
| `feature-catalog-template.md` | Three lines, same shape | Same reason |
| `skill-scaffold-template.md` | Three resource-domain bullets in the emitted `SKILL.md` | `references/ holds ...` is a sentence, where the dash form was a label |
| `command-presentation-template.md` | Two auto-resolution rules | Two rules instead of one compound rule |
| `repo-rules-router-template.md` | Two lines of the emitted `REPO RULES.md` | The Gate 5 sentence and the compose rule are each self-contained |
| `repo-rule-template.md` | The section-one scaffold line | A colon introduces the list it was already introducing |
| `benchmark-report-template.md` | The process-narrative opening | It now uses the same word its own guidance comment uses, `narrative` |

### What is left, and why

Fourteen occurrences under `.opencode/` stay, across five files. None is a punctuation habit.

| File and line | Count | Class | Reason it stays |
|---|---:|---|---|
| `sk-create-readme/assets/install-guide-template.md:432` | 5 | Quotes the ban list | The line tells an author which words are banned by naming them. A rewrite deletes the instruction |
| `sk-create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md:53, 65, 172, 190` | 4 | Literal noun | Names the Lane C benchmark `harness`, a real component under `system-deep-loop/deep-improvement`. `scope-and-exemptions.md` section 4 already rules that a term's sense decides |
| `sk-design-md-generator/assets/design-md-prompt-template.md:51` | 2 | Identifier | The two spans name the literal headings `## Tokens — Colors` and `## Tokens — Spacing & Shapes`, hardcoded in `backend/scripts/schema-v3.ts` and asserted by `backend/tests/build-write-prompt.test.ts`. Rewriting them points the prompt at sections the builder never emits |
| `sk-create-frontmatter/assets/frontmatter-templates.md:261` | 1 | Literal noun | Names the Claude Code `harness` as the runtime imposing the described limits |
| `sk-create-frontmatter/assets/frontmatter-templates.md:291` | 1 | Verbatim quotation | The 545-character `sk-code` description as it actually read before the trim. Editing it makes the before-and-after example describe something that never shipped |
| `sk-create-changelog/assets/changelog-template.md:92` | 1 | Markup token | The span is `&nbsp;`, an HTML entity used as a blank-line spacer. The character is entity syntax, not punctuation |

Three more detected templates live under `specs/` and were left alone. Two sit in a `z_archive`
tree and the third is a shipped research asset, and `scope-and-exemptions.md` section 3 puts a
shipped spec document out of scope because its bytes are the record of what was decided. They
hold eight occurrences between them.

### The exemption mechanism is still missing

Every row in the table above will be re-reported by the next scan. The scanner has no way to
express an exemption today, so the record lives here and nowhere the tooling reads.

Two of the six rows are a term whose sense is literal, one is text about the banned words, one
is a quotation, one is markup syntax, and one is an identifier. A single mechanism covers all
six: a path-and-span allowlist the scanner consults, parsed from `scope-and-exemptions.md` so
the reason sits beside the rule rather than in a report. A marker comment on the preceding line
is the cheaper build and keeps the reason next to the span, but it puts a scanner directive into
a template payload, which is exactly the kind of text a template must not carry into the file it
emits. The allowlist is the better fit for that reason alone.

### Proof the sweep changed nothing else

| Check | Scope | Result |
|---|---|---|
| Fence-position comparison against a pre-sweep copy | All 37 templates | Every changed line sits in the same position class before and after. No fence boundary moved, and no `json` payload changed at all |
| `validate_document.py` issue count | All 37 templates | Identical before and after, file by file |
| `outsourced-agent-handback-docs.vitest.ts` | cli-opencode, cli-claude-code | 2 passed, 1 skipped, before and after |
| Template inventory greps from `templates-inventory.md` | cli-opencode | 16 headers and 15 bash blocks, unchanged. The scenario's own `TEMPLATE 12 —` grep was repinned to the new separator |
| `test_create_skill_contract.py` and `test_skill_contract.py` | parent-skill-hub, hub scaffold, skill scaffold | 27 and 4 passed. The lockstep directive test needed the identical edit in `scaffold/hub-skill-scaffold.md`, which it got |
| `leaf-resource-contract.test.cjs`, `root-router-contract.test.cjs` | agent, changelog, install-guide, skill-md, root router | Exit 0, output byte-identical to the baseline |
| `validate-playbook-package.test.cjs`, `validate-playbook-topology.test.cjs` | Both playbook templates | Exit 0, output byte-identical |
| `test_validator_fixtures.py`, `validate_catalog_package.py` | Both feature-catalog templates | Fixtures exit 0. The package validator exits 1 both before and after on the same 1162 lines, a pre-existing state this sweep did not touch |
| `build-write-prompt.test.ts` | design-md prompt | 6 passed, confirming the two exempted heading identifiers still match the builder |
| `test_hvr_scan.py` | The scanner itself | Exit 0, unchanged |

---

## 13. RELATED RESOURCES

- [`../implementation-summary.md`](../implementation-summary.md) - the phase that measured the backlog.
- [`../../research/findings-register.md`](../../research/findings-register.md) - finding 26, the live backlog row.
- `.opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` - detection, masking and the two gap shapes.
- `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md` - the exemption doctrine this triage applies.

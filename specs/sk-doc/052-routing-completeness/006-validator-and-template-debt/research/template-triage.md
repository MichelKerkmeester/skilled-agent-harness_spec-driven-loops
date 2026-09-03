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

This is a triage, not a rewrite. Nothing under `.opencode/` was edited for it. The output is a
per-file class, a ranked order, and a list of scanner defects for the owner of `hvr_scan.py`.

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

---

## 11. THE ASK

The triage is done and nothing was rewritten. Four decisions, in the order the work would run.

1. **Tier 1, 136 occurrences across 14 files.** Approve a prose pass over guidance text only. It
   touches no fenced payload, changes no generated document, and needs no downstream check. The
   proof is a re-scan showing those files at zero and every payload fence byte-identical.
2. **Tier 2, 134 occurrences across 24 files.** Approve or decline per template. A yes changes what
   the next authored document contains, so the pass would be one commit per owning skill with the
   consumer named in the message. `skill-scaffold-template.md` is the only one a program reads.
3. **Tier 3, 10 occurrences.** Rule on `harness`, then choose the exemption mechanism. Without a
   mechanism the next scan re-reports all ten.
4. **Tier 4, 29 occurrences plus the nesting defect.** Route to the owner of `hvr_scan.py`. Shape A
   is a straight fix. Shape B needs a ruling first.

A rewrite pass authorized on tiers 1 and 2 together would touch 38 files under `.opencode/`, all of
them templates, and would change emitted output in 24 of them. Tier 1 alone touches 14 files and
changes no output at all.

---

## 12. RELATED RESOURCES

- [`../implementation-summary.md`](../implementation-summary.md) - the phase that measured the backlog.
- [`../../research/findings-register.md`](../../research/findings-register.md) - finding 26, the live backlog row.
- `.opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` - detection, masking and the two gap shapes.
- `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md` - the exemption doctrine this triage applies.

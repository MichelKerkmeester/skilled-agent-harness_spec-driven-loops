# Survey: chat-slice shape and bloat

Read-only survey run 2026-09-26 by an Explore agent. It is a hypothesis until re-checked. Line numbers were current on that date.

## 1. What `renderChatSlice()` strips and keeps

The projection is `renderChatSlice()` at `.skilled/hooks/goal/lib/goal-slice.cjs:73-80`, built on `extractDurableSlice()` (`:59-63`) and `splitFrontmatter()` (`:40-50`).

It strips, in this order:
- frontmatter: `FRONTMATTER_PATTERN` (`:24`);
- everything from `<!-- ANCHOR:log -->` onward: `LOG_ANCHOR` (`:19`, cut at `:61-62`);
- every HTML comment: `HTML_COMMENT_PATTERN` (`:27`, applied at `:75`), which covers anchors, `SPECKIT_TEMPLATE_SOURCE`, `HVR_REFERENCE` and the `IF` lines;
- exact `---` lines: `/\n---\n/g` (`:76`);
- numbered heading prefixes: `HEADING_SECTION_NUMBER_PATTERN` (`:31`, applied at `:77`).

Runs of three or more newlines then collapse to two, and the result is trimmed.

It keeps the H1, the blockquote, bold labels, headings, every paragraph including template instruction prose, tables and checkboxes. There is no length cap. The test at `goal-slice.test.cjs:83-124` asserts that the title, tables and bullets stay.

Callers:
- `readPacketGoal` (`goal-slice.cjs:424`);
- `describePacketGoal` (`goal-core.cjs:1152-1169`);
- `bin/goal.cjs:203-217`;
- the OpenCode plugin (`.opencode/plugins/opencode-goal.js:3101-3115`).

Bind and injection use `objectiveSlice` (`goal-core.cjs:1101-1102`, `:507-516`). The resend hash, `durableSliceHash` (`:187-193`), strips only comments and whitespace.

## 2. What the 4,000 budget measures

The budget is measured on the durable slice, comments and anchors included:
- `budgetState(durableSlice.length)` at `goal-slice.cjs:418`;
- `templates/spec-kit-docs.json:24-28`;
- `runtime/lib/validation/spec-doc-structure.ts:1030-1062`;
- `sk-create-goal/scripts/check-goal.cjs:338-355`.

Nothing measures or caps the chat slice.

Measured on `specs/sk-doc/060-create-goal-mode`:
- `packet_durable_chars=3950`;
- chat_slice 3,617;
- objective_slice 906.

## 3. Instruction prose inside 060's chat slice

| Segment | 060 `goal.md` lines | Characters |
|---|---|---|
| Blockquote under the H1 (already cut to 2 lines) | 33-34 | 156 |
| "Frozen choices. Changing one is an amendment." | 45 | 45 |
| The "### Operator copy" section | 56-67 | 754 |
| "Read the child goal before working a phase…" | 75-76 | 113 |
| "Precedence. …" | 92-93 | 145 |
| "Stop. …" | 95-96 | 103 |
| "Three to seven bullets…" | 104-106 | 208 |
| **Total** | | **about 1,524 (42% of 3,617)** |

About 2,090 characters of the chat slice are directive: the title, objective, 6 decisions, 11 binding rows and 7 criteria.

## 4. Every rule about what a goal sent in chat contains

**`AGENTS.md:187`**: "never send its frontmatter anywhere … The chat slice is the durable slice without frontmatter, HTML comments, anchor markers, `---` dividers or heading section numbers. Never send a parent goal over 4,000 characters: cut the file first. Both rules override any resend wording inside a `goal.md`." `~/.claude/CLAUDE.md` is a symlink to `AGENTS.md`.

**system-spec-kit**
- `SKILL.md:485`: the same definition, with "cut the file in the order the goal set-string playbook gives".
- `references/workflows/goal-set-string-playbook.md`:
  - `:80-90` gives the definition, plus "The title, tables and bullets stay";
  - `:91` says "Never send a parent goal whose chat slice is over 4,000 characters";
  - `:63-71` gives the cut order.
- `templates/addons/goal.md.tmpl:59-70`, the Operator copy paragraph: the same definition, plus "Never send more than 4000 characters". Its blockquote at `:34-37` says the frontmatter "is not sent in chat".

**Resend reminder** (`goal-slice.cjs:211`), injected on Pi, Cursor, Devin and OpenCode: "with no frontmatter, comments, anchors, dividers or section numbers. Never send more than 4000 characters: when the slice is longer, cut the file first."

**speckit YAMLs**
- The full definition and the 4,000 cap appear in:
  - `speckit-plan.yaml:197`
  - `speckit-implement.yaml:162`
  - `speckit-complete.yaml:255`
  - `speckit-resume-auto.yaml:47`
  - `speckit-resume-confirm.yaml:47`
- `speckit-plan.yaml:187` and its equivalents add "bounded so it fits one chat message".

**sk-create-goal**
- `SKILL.md:109` and `README.md:42,94` say to print `chat_slice`.
- `references/budget-and-handoff.md:53` says it "removes HTML comments, dividers and numbered heading prefixes". It does not name frontmatter or anchors, and gives no send cap.
- `parent-and-nested-goals.md:110,119,127-133`.

**Runtime command files**
- `.cursor/commands/goal-cursor.md:17,31`: frontmatter excluded, no cap.
- `.skilled/commands/goal-opencode.md:44`: never names the chat slice.
- `.pi/prompts/goal-pi.md`: nothing.
- Devin has only the reminder.
- `.skilled/commands/create/goal.md:75`: "print the packet's `chat_slice` and stop".

**Descriptive docs with older wording** (left open by 038/013):
- `.skilled/hooks/goal/README.md:32,81,147`
- `goal-plugin.md:119,159`
- `references/config/hook-system.md:99`

None of them names the chat slice or the cap.

**Disagreements**
- **Where the cap applies.** The validator, the manifest and `goal.cjs` measure the durable slice. The playbook (`:91`) caps the chat slice. `AGENTS.md:187` and `goal.md.tmpl:67` say neither.
- **What "operator copy" means.** In `goal.md.tmpl:59` and the playbook `:77` it is the chat slice. In `hooks/goal/README.md:65`, `goal-core.cjs:1090` and `goal-plugin.md:33` it is the stored objective slice. Within the playbook, §2 (`:30-49`) and §5 (`:80-88`) disagree.
- **What gets injected.** `SKILL.md:485` and `hook-system.md:99` say the durable slice is injected. The code injects the objective slice (`goal-core.cjs:507-516`).
- **A stale figure.** `budget-and-handoff.md:78` says 3,735; the file now measures 3,950.
- **Bloat is addressed nowhere.** No cut order (playbook `:63-71`, `budget-and-handoff.md:37-47`) treats instruction prose as cuttable. The templates forbid cutting it:
  - `goal-phase-parent-template.md:175-176`: "The blockquote, the operator-copy paragraph and the criteria and log introductions … stay word for word".
  - `goal-top-level-template.md:154` and `goal-phase-child-template.md:155` say the same.

## 5. What 038-goal-unification/013-goal-chat-send-shape decided

The packet is Complete: `spec.md:27`, `graph-metadata.json:42`, and `goal.md` shows all five criteria met.

Its decisions:
- **D1**: the chat slice is the durable slice minus frontmatter, comments, dividers and section numbers; the title, tables and bullets stay.
- **D2**: a chat slice over 4,000 is never sent; cut the file first.
- **D3**: `renderChatSlice` drops section numbers; no new enforcement.
- **D4**: `AGENTS.md` states the rules, and the 167 older goal files are not rewritten.

Its out-of-scope list (`spec.md:95-100`) covers enforcement code, rewriting existing goals and the descriptive docs. It never addressed instruction-prose bloat. Its docs still cite `.opencode/...` paths from before the source-root move.

## 6. Where the instruction prose sits in the templates

All of it is in the durable slice as plain markdown, and none of it sits inside HTML comments.

In `goal.md.tmpl` the prose is at:
- blockquote: 34-42
- Frozen: 53
- Operator copy: 59-70
- Read the child: 79-80
- Precedence: 86-87
- Stop: 89-90
- Three to seven: 99-101

The three asset templates carry the same text inside their fenced block.

| Unfilled template | Durable chars | Chat chars | Instruction prose in chat |
|---|---|---|---|
| `goal-phase-parent-template.md` | 3,156 | 2,823 | 2,005 |
| `goal-top-level-template.md` | 2,536 | 2,260 | 1,644 |
| `goal-phase-child-template.md` | 2,488 | 2,212 | 1,644 |

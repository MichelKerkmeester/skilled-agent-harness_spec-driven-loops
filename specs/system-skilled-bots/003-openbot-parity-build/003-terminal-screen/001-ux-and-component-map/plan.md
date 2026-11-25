---
title: "Implementation Plan: Phase 1: ux-and-component-map"
description: "Write four design documents that fix the terminal screen's frames, keys, glyphs and component states, prove every citation resolves, and hand the approved key map to phase 002."
trigger_phrases:
  - "ux and component map plan"
  - "terminal screen design plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: ux-and-component-map

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown only. No code, no crate, no dependency. |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg`, `ls`, `wc`, `awk` and `bash` over the four documents, plus `validate.sh --strict` |

### Overview
Four markdown documents in `design/` fix the screen: one ASCII frame per state at 80x24 and 120x40, every key with its context and drawn label, the eight glyphs with their ASCII set, and thirteen components each with a state list. The work is proven by commands that read the documents rather than by a build, because there is nothing to build yet. The one thing a command cannot prove is the operator's approval of the key map, so that is a criterion that stays `Unmet` until the operator answers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The parent's six operator decisions are recorded in `../decision-record.md`
- [ ] The four payload shapes are named by the phases that own them
- [ ] Every reference source under `specs/system-skilled-bots/context/` resolves in a checkout that has that gitignored folder, and every pointer check names its skip in one that does not

### Definition of Done
- [ ] Every acceptance criterion is `Met`, or `Waived` with an ADR
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map --strict` prints `RESULT: PASSED`
- [ ] `rg -c '\[SOURCE: ' design/*.md` prints a non-zero count for each of the four documents
- [ ] `rg -c '^\*\*80x24\*\*$' design/mockups.md` and `rg -c '^\*\*120x40\*\*$' design/mockups.md` print `26` each
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documents first, one frame per state.

### Key Components
- **`design/mockups.md`**: the frame grammar, the state index and twenty-seven states, twenty-six of them at both sizes and the too-small screen at 30x7. It is the layout contract.
- **`design/key-map.md`**: six contexts, twenty-nine bindings, the four rules that fix the pre-expansion key defects, and the approval record. It is the input contract.
- **`design/glyph-table.md`**: eight glyphs, the ASCII set, the inbox's own words and the colour rule. It is the meaning contract.
- **`design/component-inventory.md`**: thirteen components with reads, keys and states. It is the completeness contract.

### Data Flow
The payload shapes phases 001 and 002 document feed the frames. The frames fix what a row looks like, the glyph table fixes what a row means, and the key map fixes what a key does. The component inventory then walks every component and names the frame that draws each of its states, so a state with no frame is a hole rather than a paragraph. Phases 002 to 006 read the four documents and draw cells.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the parent's decisions, the four payload shapes and the reference sources, and confirms the validator passes on the scaffold. Implementation writes the four design documents, then the packet's own specification, plan, tasks, acceptance criteria and goal. Verification checks every frame's height and width, every citation, every key label and every component state, then runs `validate.sh --strict`.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes, the task state and the wave table.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each fenced frame is exactly 24 or 40 lines and no line is wider than its size, and the too-small frame is exactly 7 lines and no line wider than 30 | `perl` over the fenced blocks, because it counts characters rather than bytes |
| Integration | Every `SOURCE` pointer resolves to a file and a line inside it | A `bash` loop over the pointers |
| Integration | Every drawn label in the key map appears in at least one frame | A `bash` loop over the label column |
| Integration | The answered row's outcome word is named in the requirement, the criterion, the inventory and the glyph table | `rg -l` over the four files |
| Manual | The operator reads the key map and approves it | The operator's answer in `design/key-map.md` section 6 |

The manual row is the only one a command cannot answer, and it is the packet's exit. Every other row runs here without a tty.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The parent's operator decisions Q002 to Q007 | Internal | Green | The frames would have no fixed key set, glyph set or screenshot set |
| The reference repositories under `specs/system-skilled-bots/context/` | External | Green | A pointer would dangle and the design would lose its evidence. The folder is gitignored, so a fresh checkout skips the pointer checks by name and rebuilds it from `research/context-manifest.md` |
| `validate.sh` and the packet's templates | Internal | Green | The packet could not close |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A frame contradicts a payload shape, or the operator rejects the key map.
- **Procedure**: Revert the one commit. The four documents are new files, so a revert removes them and leaves the packet as it stood, with no code and no state to unwind.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:external-orchestration -->
## External orchestration

The build is dispatched to external CLIs, one change per brief, with the orchestrator as conductor. The roster is closed: a dispatch names one of the five executors below and one of its roster models, and nothing else. Every dispatch reads the target mode's `SKILL.md` before the prompt is composed, and attaches the resolved agent persona. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:199]

### The roster

| Executor | Model | Effort | Used for | Why this one |
|----------|-------|--------|----------|--------------|
| `cli-mistral-vibe` | `deepseek-flash` | `max`, pinned by the model row | Design work: the frames, the key contexts, the glyph meanings | Print mode is the only dispatch surface, the roster is closed to two aliases, and the row's `thinking` is `max` with no flag to lower it [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:65] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] |
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` for mechanical work, `max` for design | The default executor: table rows, citation fixes, wording passes, and the design documents when Vibe is unavailable | `--thinking` is a first-class flag independent of the model id, so one route covers both efforts [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:61] |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` or `#max`, carried in the model id | The same work when both above are unavailable | Effort goes in `-m provider/model#<level>`, so the level travels with the model [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:125] |
| `cli-devin` | `deepseek-v4-1-flash-max` | The model's max tier; there is no effort flag | Max-tier work when the three above are out of usage | Weekly quota, so a trivial read-only call probes it before a real brief [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:152] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237] |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort="xhigh"` and `-c service_tier="fast"` | The hardest task, and the last fallback | GPT models reach this packet only through Codex, and the effort and the tier are config overrides rather than flags [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:138] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:165] |

### The effort policy

| Work | Effort | Executor |
|------|--------|----------|
| A small mechanical change: one table row, one citation, one wording pass | DeepSeek flash `high` | `cli-pi`, or `cli-opencode` at `#high` |
| Design or tricky work: a frame, a key context, a glyph meaning, a state list | DeepSeek flash `max` | `cli-mistral-vibe`, or `cli-pi` at `--thinking max` |
| The hardest task, or the last fallback | Luna `xhigh` on the `fast` tier | `cli-codex` |

Vibe is not the `high` route, because its roster row pins `thinking = "max"` and no flag lowers it. A mechanical brief that wants `high` goes to Pi or OpenCode.

### The dispatch rules

| Rule | Why |
|------|-----|
| One change per brief: the file, the edit and the check that proves it | A brief that asks a child to read a subsystem before it edits spends its context first [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:168] |
| Redirect stdin on every non-interactive dispatch | A run that inherits the parent's stdin hangs with no output [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:130] |
| Pass `--offline` on every automated Pi dispatch | Without it a Pi run hung for over two minutes with no reachable network path [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:84] |
| Set `AI_SESSION_CHILD=1` and state the exemption in the prompt | The variable makes the waiver true; the prompt makes it observable |
| Count a Vibe run complete only when `export.json` records `exit_code` 0 and `outcome` `finished` | A clean stdout proves nothing, because a denied tool call still exits 0 [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:116] |
| Name the model and the effort explicitly on every dispatch | A caller's config default is not reproducible [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:235] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:165] |
| Keep GPL sources out of the brief of a worker that writes the matching module | A worker that writes `terminal.rs`, `theme.rs`, the overlay keys or the overlay view gets our design files and MIT or Apache references only. openhuman and tinychannels paths appear in design documents as provenance, never in a brief, and the orchestrator compares the finished guard and overlay with the openhuman files by eye and records that it did [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/fable-review-1.md:116] |

### The wave discipline

A wave is a set of tasks that can run at once. Parallelism follows file overlap and nothing else: two workers never write the same file, so the number of workers in a wave is the number of distinct files it writes. A wave with one file gets one worker however many tasks it holds. `tasks.md` carries the wave table with the task ids, the executor, the model, the effort and the worker count for each wave.

### The verify step after each wave

The orchestrator runs the wave's own verify commands before the next wave starts, and reads the output rather than the exit status alone. A wave that fails its verify is repaired inside the wave; a wave that cannot be repaired stops the build and the failure is reported with the command and its output.

### The fallback order

When an executor runs out of usage, fails its preflight or returns a run that does not meet its own completion contract, the wave moves to the next executor in this order:

1. `cli-mistral-vibe` `deepseek-flash` at `max`
2. `cli-pi` `llmgateway/deepseek-v4.1-flash-1017` at `high` or `max`
3. `cli-opencode` `opencode-go/deepseek-v4.1-flash` at `#high` or `#max`
4. `cli-devin` `deepseek-v4-1-flash-max`, probed with a trivial read-only call first
5. `cli-codex` `gpt-6-luna` at `xhigh` on the `fast` tier

The order is the same for every wave, so a wave that falls back twice is visible as a deviation rather than as a silent substitution. Luna is last because it is the most expensive route and the one reserved for the hardest task.

### What the orchestrator does not delegate

The operator's approval of the key map, the decision to close the packet, and the reading of the validator's `RESULT:` line. A child can write the approval row; only the operator can fill it.
<!-- /ANCHOR:external-orchestration -->

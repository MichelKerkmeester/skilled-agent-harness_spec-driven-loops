# Iteration 25: S4-01 Injection Inbox Provenance

## Focus

Dimension D2 target-mapping for S4-01: whether injected deep-research questions should go through a dedicated inbox instead of being appended directly inside the reducer-owned `key-questions` anchor, and how promotion can preserve provenance.

## Actions Taken

1. Read the deep-research output and JSONL state references to confirm reducer ownership and append-only state expectations.
2. Inspected our reducer path for `key-questions`: `parseStrategyQuestions()` keeps only checkbox state plus normalized text, and `updateStrategyContent()` rewrites the full anchor every reducer run.
3. Inspected the live strategy directive that tells a monitor to inject fresh `- [ ]` angles into the strategy.
4. Mapped kasper's injection/provenance mechanisms and loop-cli-main's first-class task records onto exact deep-research targets.
5. Checked recent iteration/delta history for prior S4-01 coverage; S2-11 covered reversible artifact mutation generally, but not question-inbox promotion.

## Findings

### S4-01A: Add `research/inbox.jsonl` as the canonical injection surface

- Reference mechanism: loop-cli-main models schedulable units as typed records with `createdAt` on `TaskDefinition` (`external/loop-cli-main/src/types.ts:10-18`), stamps `createdAt` when creating a task (`external/loop-cli-main/src/daemon/task-manager.ts:19-25`), and loads all tasks sorted by `createdAt` (`external/loop-cli-main/src/daemon/state.ts:127-129`).
- OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`; add an inbox reader before `parseStrategyQuestions()` is converted into registry open questions.
- Why it helps: injected questions become durable records with `id`, `text`, `source`, `origin`, `injectedAtIteration`, `promotedAtIteration`, and `promotedQuestionId` instead of anonymous markdown bullets.
- Port difficulty: med.
- Tag: quick-win.

### S4-01B: Promotion should preserve per-entry provenance, not rewrite it away

- Reference mechanism: kasper's `injectSectionContent()` explicitly appends new content with a per-addition timestamp rather than replacing section-level provenance (`external/kasper/src/prompt-utils.ts:121-147`, `external/kasper/src/prompt-utils.ts:157-159`), and creates the same per-entry shape for new sections (`external/kasper/src/prompt-utils.ts:184-190`).
- OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`; when inbox records are promoted, copy provenance into `registry.openQuestions[]` and later `registry.resolvedQuestions[]`.
- Why it helps: `replaceAnchorSection(..., "key-questions", ...)` rewrites the full block every iteration (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:799-801`), while `parseStrategyQuestions()` only preserves checkbox state and text (`.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:245-258`). Provenance comments placed next to bullets have no stable field.
- Port difficulty: med.
- Tag: quick-win.

### S4-01C: Add an `injected-questions` anchor only as generated display, not source of truth

- Reference mechanism: kasper supports visible section injection and hidden inline fences; inline mode wraps additions in `<!-- kasper-injected:begin/end -->` comments for dedupe and rollback when a visible heading is unwanted (`external/kasper/README.md:100-101`, `external/kasper/README.md:165-180`).
- OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md`; add a generated `injected-questions` display block near the existing `key-questions` anchor (`.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md:40-45`).
- Why it helps: operators can see pending injected angles without confusing them with promoted key questions. The reducer still owns the rendered block, so direct monitor writes do not fight the reducer.
- Port difficulty: easy.
- Tag: quick-win.

### S4-01D: Treat direct markdown injection as a legacy import path

- Reference mechanism: loop-cli-main's update contract omits `createdAt` from task updates (`external/loop-cli-main/src/types.ts:105-106`), and the update path merges input over the existing task before saving (`external/loop-cli-main/src/daemon/task-manager.ts:37-43`), so record identity and original creation provenance survive mutation.
- OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`; on reducer startup, detect unregistered strategy bullets in `key-questions`, import them into inbox/registry with `origin: "legacy-strategy-bullet"`, then render them from state on the next pass.
- Why it helps: this keeps current monitor behavior from silently losing questions while moving the long-term contract to append-only records.
- Port difficulty: med.
- Tag: deep-rewrite.

## Questions Answered

- S4-01 answered: yes, add a dedicated inbox. Prefer `research/inbox.jsonl` as canonical storage, with an optional generated `injected-questions` strategy anchor for operator visibility.
- Promotion should be a state transition: `pending -> promoted -> resolved|ruled_out`, carrying original injection provenance into the registry.

## Questions Remaining

- Exact inbox schema needs a follow-up design pass: minimum viable fields are clear, but dedupe key, trust level, and source taxonomy still need names.
- S4-05 should cover dashboard attribution: injected versus analyst-authored coverage should be visible after promotion.
- Need a reducer regression test that proves comments or metadata near `key-questions` bullets are not the durable provenance path.

## Next Focus

S4-02: define the `minIterations` plus `convergenceMode: "off"` config contract and how optimizer-managed tunables should treat it.

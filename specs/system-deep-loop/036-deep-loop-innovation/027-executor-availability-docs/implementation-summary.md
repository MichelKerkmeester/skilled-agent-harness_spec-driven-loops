---
title: "Implementation Summary"
description: "Every /deep:* contract now states the executor set its own runtime accepts and cites the constant enforcing it, replacing a three-item list that hid four working executors and advertised one that throws."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/027-executor-availability-docs"
    last_updated_at: "2026-08-31T08:33:25Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Corrected per-command executor sets across 16 deep-loop docs"
    next_safe_action: "Confirm council default-token change, then commit"
    blockers: []
    key_decisions:
      - "Per-command sets, not one global set: the four dispatch paths own separate resolvers"
      - "Cite allowlist constants; never copy model ids into docs"
    key_files:
      - ".opencode/commands/deep/assets/deep-research-presentation.txt"
      - ".opencode/commands/deep/assets/deep-review-presentation.txt"
      - ".opencode/commands/deep/assets/deep-ai-council-presentation.txt"
      - ".opencode/commands/deep/assets/deep-model-benchmark-presentation.txt"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-039-executor-availability-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Council default token moved from active-runtime to native; awaiting operator confirmation"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-executor-availability-docs |
| **Completed** | 2026-08-31 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `/deep:*` contracts told you there were three executors. There are seven, and which of them you can actually use depends on which deep command you are running. Sixteen documents now say so, each citing the constant that enforces its own set.

### Per-command executor sets

The single most useful thing this change gives you is the knowledge that there is no single answer. Four dispatch paths own four different resolvers, so "which executors can I use" is only answerable per command:

| Command | Accepted executors | Enforced by |
|---------|--------------------|-------------|
| `/deep:research`, `/deep:review` | `native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-devin`, `cli-pi` | `EXECUTOR_KINDS` in `runtime/lib/deep-loop/executor-config.ts`; adapters in `LINEAGE_COMMAND_ADAPTERS` (`runtime/scripts/fanout-run.cjs`) |
| `/deep:ai-council` | `native`, `cli-opencode`, `cli-cursor`, `cli-devin`, `cli-pi` (alias `opencode`) | `resolveExecutorKind` in `deep-ai-council/scripts/orchestrate-session.cjs` - rejects `cli-codex` by name, `cli-claude-code` generically |
| `/deep:model-benchmark` (`grader=llm`) | `cli-opencode` (default), `cli-claude-code`, `cli-cursor`, `cli-devin`, `cli-pi` | `KNOWN_EXECUTORS` in `deep-improvement/scripts/model-benchmark/dispatch-model.cjs` - no `native`, no `cli-codex` |
| `/deep:skill-benchmark` (`--trace-mode live`) | `cli-opencode` (default), `codex` via `--executor=codex`; browser scenarios to `bdg` | `dispatchScenario` in `deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs` |

All six `cli-external-orchestration` packets are wired fan-out adapters - none is dispatch-only. The narrowing is per command, not per CLI.

### Narrow sets are now labeled deliberate

Where a set is genuinely small, the contract says why, so the next reader does not "correct" it back. The skill-benchmark lane takes only opencode and codex because it scores skill activation from the executor's structured tool-use event stream, and the text-only CLIs emit no equivalent trace - routing them through it would score every run as "activated nothing" and produce false benchmark data.

### The error that ran the other way

The council contract offered `cli-claude-code` and defaulted to `active-runtime`. Neither is accepted: `resolveExecutorKind` rejects the first and has no branch for the second, which appears nowhere in any runtime source. Understating the set hid working options; this sent operators to configure a throw.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `commands/deep/assets/deep-research-presentation.txt` | Modified | Seven-kind set, Q-Exec options D-G, real fail-fast modes |
| `commands/deep/assets/deep-review-presentation.txt` | Modified | Same, plus an empty executor-hint literal repaired |
| `commands/deep/assets/deep-ai-council-presentation.txt` | Modified | Council's five-kind set; rejected kinds and `active-runtime` removed |
| `commands/deep/assets/deep-ai-council-auto.yaml` | Modified | Same set; duplicated `cli-opencode` entry removed |
| `commands/deep/assets/deep-ai-council-confirm.yaml` | Modified | Same as the auto variant |
| `commands/deep/assets/deep-model-benchmark-presentation.txt` | Modified | Five-kind grader set; ASCII panel realigned to 69 chars |
| `commands/deep/assets/deep-agent-improvement-presentation.txt` | Modified | Dispatcher line no longer names `cli-opencode` twice |
| `commands/deep/assets/deep-skill-benchmark-presentation.txt` | Modified | `codex` transport named; exclusion mechanism stated |
| `commands/deep/assets/deep-skill-benchmark-confirm.yaml` | Modified | Same live-transport correction |
| `commands/deep/skill-benchmark.md` | Modified | Same live-transport correction, two places |
| `skills/system-deep-loop/deep-review/SKILL.md` | Modified | Prohibition now covers all six CLIs |
| `skills/system-deep-loop/deep-improvement/SKILL.md` | Modified | Mixed-executor example now names two distinct executors |
| `skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md` | Modified | Duplicated dispatcher list corrected |
| `commands/deep/assets/compiled/deep-research.contract.md` | Modified (generated) | Regenerated |
| `commands/deep/assets/compiled/deep-review.contract.md` | Modified (generated) | Regenerated |
| `commands/deep/assets/compiled/deep-ai-council.contract.md` | Modified (generated) | Regenerated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every claim came from the resolver, not from a neighbouring document - the prior contracts were themselves confident, wrong documents, so treating any of them as evidence would have reproduced the defect.

The order mattered. All in-scope variants were enumerated before the first edit, because a clean diff cannot reveal a file that was never opened; that enumeration is what later caught `feature-catalog.md` carrying the same duplicated list. Edits were applied through a script that asserts exactly one match per replacement and aborts otherwise, so a silently-missed target fails loudly rather than passing quietly. Every edited region was then re-read from disk.

The drift gate was run before regeneration as a negative control (exit 2, all three commands named) and again from the final state (exit 0). Left uncommitted for operator review.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Document a set per command rather than one global set | The four paths run four different resolvers. One global list would be wrong for three of them, and wrong in the dangerous direction - naming an executor that throws |
| Cite allowlist constants instead of copying model ids | The rosters change; a copied list silently becomes a lie. The docs name `CURSOR_SUPPORTED_MODELS`, `DEVIN_SUPPORTED_MODELS`, `PI_SUPPORTED_MODELS` and list nothing |
| State the mechanism behind each narrow set | A narrow set with no stated reason reads as an oversight and invites a well-meaning "fix" that produces false benchmark data |
| Change the council default token to `native` | `active-runtime` exists in no runtime source and `resolveExecutorKind` rejects it. Where a doc and the code disagree, the code wins - flagged as an open question because it changes a documented default |
| Regenerate the compiled contracts rather than leave them | They are derived artifacts with recorded source digests; unregenerated, they would still serve the stale executor list this packet exists to remove |
| Leave `ExecutorNotWiredError` in place | Dead but harmless, and deleting exported code is outside a documentation packet's scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-contract-drift.cjs` before regeneration (negative control) | FAIL as intended - exit 2, `STALE_COMPILED_BODY` for deep/research, deep/review, deep/ai-council |
| `check-contract-drift.cjs` from final state | PASS - exit 0, `[CONTRACT DRIFT] OK commands=3` |
| `check-projection-coverage.cjs` | PASS - exit 0, `"ok":true`, `"violations":[]` |
| Residue rescan for surviving two-executor enumerations | PASS - one hit found mid-task in `feature-catalog.md`, fixed, rescan clean |
| Compiled-diff content scan | PASS - no body content beyond this change plus digest refreshes |
| ASCII panel width | PASS - the three edited panel lines measure 69 characters, matching the panel border |
| Every edited region re-read from disk | PASS - all sixteen files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The council default-token change is unconfirmed by the operator.** `active-runtime` was replaced with `native` on the evidence that no runtime code accepts the former. This is the one edit that changes a documented default rather than only widening a list, and it deserves an explicit yes.
2. **Regeneration absorbed pre-existing drift.** The drift gate was already red at HEAD: five files named in the report (`system-deep-loop/SKILL.md`, three `agents/*.md`, `deep-research-auto.yaml`) are unmodified in the working tree yet carried stale recorded digests. Regenerating refreshed those digests too. The compiled diff was scanned and contains no unrelated body content, but the digest refresh is genuinely wider than this change.
3. **Executor command recipes were not re-verified.** The Q-Exec entries for `cli-opencode` and `cli-claude-code` carry full command lines that predate this packet; they were left untouched. The four added entries deliberately describe flag support and preflight requirements instead of pasting command lines, since those were not verified against the live CLIs.
4. **Adjacent defects left in place**, reported rather than fixed: the dead `ExecutorNotWiredError`; the `--reasoning-effort` enumeration in the research and review contracts omitting the `ultra` tier present in `REASONING_EFFORTS`; and two ASCII panel lines in the model-benchmark contract that remain 72 characters against a 69-character border.
<!-- /ANCHOR:limitations -->

---



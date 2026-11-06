---
title: "Implementation Summary"
description: "The deep-loop sources list cli-deepseek-harness as an experimental choice, the contracts reproduce from source, and the council decision keeps it out of the roster."
trigger_phrases:
  - "deep loop modes and commands implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/012-deep-loop-modes-and-commands"
    last_updated_at: "2026-11-06T08:57:12Z"
    last_updated_by: "codex-gpt-6"
    recent_action: "Updated test disposition and status"
    next_safe_action: "Resolve T002, CHK-041 and CHK-050"
    blockers:
      - "T002 baseline transcript missing"
      - "CHK-041 wording is outside scope"
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
      - "decision-record.md"
      - "evidence/rerun-checks.txt"
      - "evidence/checks.txt"
      - "evidence/sandbox-test-disposition.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-012-deep-loop-modes-and-commands"
      parent_session_id: null
    completion_pct: 82
    open_questions:
      - "Disposition for T002 and CHK-041"
    answered_questions:
      - "Council seat deferred until a route is proven"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-deep-loop-modes-and-commands |
| **Completed** | No; T002 and P1 checklist items remain open |
| **Status** | In Progress |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-research and deep-review sources include `cli-deepseek-harness`, and both compiled contracts reproduce byte for byte from those sources. Both auto YAMLs and presentation lists mark the executor experimental and explicit; the default in each YAML remains `native`. The deep-review SKILL names the kind only in its NEVER list, and the protocol wording lacks the full explicit-choice framing recorded under CHK-041.

The AI Council seat question (research Q13) has a recorded answer in `decision-record.md`, ADR-001. The kind is not a council seat. The council resolver already rejects it, so no council file changed.

### Phase 12: deep-loop-modes-and-commands

An operator can choose `cli-deepseek-harness` by name in the `/deep:research` and `/deep:review` executor lists, as the experimental option labelled `I)`. No file makes it the default, and the council roster is unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Modified | Adds the kind to the fan-out adapter sentence at line 278, marked experimental |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Modified | Same sentence at line 282 |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Modified | Adds the kind to the NEVER list of CLI executors at line 47 |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modified | Shared-builder branch note at line 1580, "experimental, never a default" |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modified | Same note at line 2048 |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | Modified | Executor choice `I)` at line 165, "experimental, explicit choice only" |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Modified | Executor choice `I)` at line 206 |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerated | Output of `compile-command-contracts.cjs` |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerated | Output of `compile-command-contracts.cjs` |
| `decision-record.md` (this folder) | Created | ADR-001, the council seat decision |
| `evidence/` (this folder) | Created | `rerun-checks.txt` and the outputs it cites |

Not changed, on purpose: `deep-research/SKILL.md` (the T003 check printed nothing, see Known Limitations), both confirm YAMLs (no executor enumeration to extend) and the `deep-ai-council/` folder (no seat admitted).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The protocol, SKILL and YAML sources were edited first. The council decision came next, because it decides whether any council file changes. The contracts were compiled from the finished sources, and the checks ran last.

The recorded checks ran on 2026-11-06 between 08:08 and 08:24 local time. The saved check record reports the four deep-loop suites at 356/356. The separate sandbox disposition explains two environment-dependent assertions and records 242/242 passing in those two files outside the sandbox. This closeout did not rerun deep-loop suites, as directed. Evidence: `evidence/checks.txt:21` and `evidence/sandbox-test-disposition.txt:1` and `:4`.

1. The nine-file `rg -l` returns nine files (`rg-l-nine-files.txt`).
2. A compile dry run for `deep/research` and `deep/review` matches the on-disk contracts byte for byte (`compile-dry-run-compare.txt`).
3. Both auto YAMLs load as one document each (same file).
4. The saved full-suite result is 356/356 in `evidence/checks.txt:21`; the sandbox disposition is in `evidence/sandbox-test-disposition.txt:1` and `:4`.
5. The runtime typecheck with the repo's TypeScript 5.9.3 exits 0 (`typecheck-runtime-ts-5.9.3.txt`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compiled contracts are regenerated, never edited | The renderer rejects stale content in `fix` mode, so a hand edit breaks the command at run time |
| No AI Council seat for the kind (ADR-001) | Decision D6 keeps the kind out of default allowlists until a keyed live pin proves a route. A seat lets a council round pick it unattended, and every seat would fail on the missing key today |
| The kind is an explicit, experimental choice in the presentation lists and auto YAMLs, never a default | The default executor stays `native`. The protocol and SKILL wording is weaker, see Known Limitations |
| A byte comparison stands in for `git diff --exit-code` until the phase is committed | `git diff` against HEAD cannot exit 0 for regenerated files that are not yet committed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| `rg -l cli-deepseek-harness` over the nine Section 3 files | Nine files listed, exit 0 | `evidence/rg-l-nine-files.txt` |
| Compile dry run for `deep/research` and `deep/review` | Byte-identical to the on-disk contracts | `evidence/compile-dry-run-compare.txt` |
| Auto YAML parse | Both load as one document each | `evidence/compile-dry-run-compare.txt` |
| Deep-loop unit suites, four files | Saved run: 356/356 pass; sandbox disposition records two environment-dependent assertions and 242/242 passing in the affected files outside the sandbox. Not rerun in this closeout | `evidence/checks.txt:21`, `evidence/sandbox-test-disposition.txt:1`, `evidence/sandbox-test-disposition.txt:4` |
| Runtime typecheck with the repo TypeScript 5.9.3 | Exit 0, no diagnostics | `evidence/typecheck-runtime-ts-5.9.3.txt` |
| Council folder | `git status` is empty, no seat admitted | `decision-record.md`, `evidence/rerun-checks.txt` |
| Secret scan over `commands/deep/assets` for `api_?key` | No match | `evidence/rerun-checks.txt` |
| `validate.sh --strict` on this folder | `RESULT: PASSED`, 0 warnings | `evidence/closeout-validation.txt:51`, `:53` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CHK-041 is open.** Both `loop-protocol.md` files say `(experimental)` but not explicit or never-default. `deep-review/SKILL.md` names the kind only in its NEVER list. The presentation lists and auto YAMLs carry the full wording. These files sit outside this phase's write scope. The fix adds the same framing to both protocol sentences and a roster line to the deep-review SKILL.
2. **`deep-research/SKILL.md` was not edited, and its roster is stale.** Lines 92 to 94 name some executors in prose, and line 92 says "The seven executor kinds". `EXECUTOR_KINDS` in `runtime/lib/deep-loop/executor-config.ts` has nine entries. The T003 check (`rg -n cli-hermes`) printed nothing, so the task's own rule leaves the file alone. The stale count predates this phase, and its owner should fix it.
3. **T002 remains open.** No pre-edit suite transcript was saved. The existing 356/356 result and sandbox disposition are recorded in `evidence/checks.txt` and `evidence/sandbox-test-disposition.txt`; this closeout did not rerun the suites.
4. **T010 is not triggered** because ADR-001 admits no seat; see `decision-record.md:79`.
5. **The earlier `evidence/checks.txt` is kept as written.** It names no TypeScript binary, and its note calls `deep-research/SKILL.md` a file with no executors, which the rerun shows is not exact. `evidence/rerun-checks.txt` is the later record.
6. **The global `tsc` on PATH is TypeScript 6.0.3.** With the runtime tsconfig it exits 2 on TS5107, which reports that `moduleResolution` node10 is deprecated. The repo's TypeScript 5.9.3 exits 0. The earlier checks did not name the binary they used.
7. **CHK-050 remains open.** Check outputs are under `evidence/`, as the dispatch requested, rather than `scratch/`.
8. **Live proof belongs to phase 013.** No provider key exists yet, so nothing in this folder shows a live dsh run.
<!-- /ANCHOR:limitations -->

---

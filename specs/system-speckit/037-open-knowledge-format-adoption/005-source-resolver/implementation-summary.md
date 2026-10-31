---
title: "Implementation Summary"
description: "validate.sh now warns when a [SOURCE: path:line] tag in a new research or review artifact names a gone file, a moved file or a line past the end."
trigger_phrases:
  - "source tags rule"
  - "source tag cutoff"
  - "invented source line warning"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/005-source-resolver"
    last_updated_at: "2026-10-04T11:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the SOURCE_TAGS warn rule and its command surfaces"
    next_safe_action: "Operator reviews the diff and decides the commit"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-source-resolver |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A research or review packet created after today now gets a warning when one of its `[SOURCE: path:line]` tags points at nothing. The warning says which tag, which class of break, and for a renamed file, where the file is now. A tag that resolves proves only that the path and line exist, and every message says so.

### Phase 5: source-resolver

The new `SOURCE_TAGS` rule reads every `.md` file under a packet's `research/` and `review/` folders, lineages included, and checks the `path:line` citations inside `[SOURCE: ...]` tags. It skips `prompts/` folders, fenced blocks and tags that hold a URL or prose. Resolution is sk-doc's `resolveCitation`, the function the phase 004 census uses, so a tag and a bare citation get the same verdict through the same redirect table.

Two choices make it work on a packet that is still being written. The packet folder is a base for paths, because iterations often cite packet files from the packet root. Untracked files outside `.gitignore` count as files, so a packet's own new artifacts resolve before the first commit.

Packets created on or before `SPECKIT_SOURCE_TAG_CUTOFF` (default `2026-10-04`) are skipped, following the `AC_CLOSURE` precedent, so no existing packet sees the rule.

Writers learn about it where they read their rules: the deep-research and deep-review iteration prompt packs, the citation lines in `/speckit:plan` and `/speckit:complete`, and a per-lineage summary in `/doctor:deep-loop`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` | Created | Finds the tags, applies the cutoff, calls the shared resolver |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh` | Created | The warn rule and its messages |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modified | Registers `SOURCE_TAGS` at warn with its cutoff flag |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts` | Created | Nine fixture cases in a throwaway git repository |
| `.skilled/skills/system-spec-kit/README.md`, `ARCHITECTURE.md` | Modified | Registry count 41 to 42 |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modified | Rule section and summary row |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `references/config/environment-variables.md` | Modified | The cutoff flag |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`, `deep-review/assets/prompt-pack-iteration.md.tmpl` | Modified | Tell the writer the check exists |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.md`, `deep-review.contract.md` | Regenerated | Source digests after the prompt-pack edits |
| `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-complete.yaml` | Modified | One line naming the check beside the citation format |
| `.skilled/commands/doctor/assets/doctor-deep-loop.yaml`, `.skilled/commands/doctor/_routes.yaml` | Modified | Per-lineage tag summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The 20 comparison packets were chosen and validated before the rule existed. Each holds `path:line` tags in its research or review artifacts, and they span 14 tracks. The rule was then built, registered and run against the same 20 twice: once with the default cutoff, and once with the cutoff forced to 2000 so the rule actually ran on them.

`/deep:research` validates with an explicit `SPECKIT_RULES` list, so the rule does not run inside that workflow. It runs in the plain `validate.sh --strict` calls that `/speckit:plan`, `/speckit:implement` and `/speckit:complete` make.

This plan and the task list were written alongside the build, not before it. Nothing is committed (root decision D4).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `resolveCitation`, add no resolution logic | REQ-004 forbids a second copy, and one resolver keeps the census and the rule in agreement |
| The packet folder is a base path | Iterations cite packet files from the packet root; without it a real file reads as gone |
| Untracked files outside `.gitignore` count | Without them every new packet's citations to its own files read as guessed |
| Skip `prompts/` folders | Dispatch prompts carry instructions and example tags, not findings |
| Default cutoff `2026-10-04` | Every existing packet, this one included, stays out of scope on day one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fixture tests | PASS, 9/9 in `check-source-tags.vitest.ts`: clean tags, no tags, a lineage with one invented tag, moved and gone, packet-root and uncommitted targets, cutoff skip, malformed cutoff, and the shell rule's warn and pass messages |
| One invented tag in a fresh lineage | PASS. Exactly one warning, naming `iteration-001.md:2`, the citation `src/real.ts:999` and the class `past end`; the moved case names `now at .skilled/tool/moved.ts` |
| 20 packets, default cutoff | PASS. Identical per-folder rule sets and RESULT lines before and after, 54 folders (`scratch/p005-comparison.json`) |
| 20 packets, cutoff forced to 2000 | PASS. RESULT lines and every other rule identical; 23 folders gain a `SOURCE_TAGS` warning and none changes result |
| Metadata unchanged by the rule | PASS. On phase 001 with the cutoff lifted: 47 tags resolve, and the hashes of `description.json`, `graph-metadata.json` and `git status` are identical before and after |
| No second resolver | PASS. The helper imports `resolveCitation`, `CITATION_RE`, `FENCE_RE`, `listTrackedFiles` and `loadRedirects` from `cite-drift-scan.mjs` and defines none of them |
| Registry count | PASS, 42 rules; `validator-registry-doc-count.vitest.ts` 1/1 |
| Deep contracts | PASS. Both fresh before the edit and regenerated after; contract and prompt-pack tests 70/70 |
| Command assets | PASS. Both YAMLs parse; intake payload tests 7/7, autopilot contract 4/4, `boolean-expr` 1/1; `route-validate.sh` counts 23 invocations; its tests 19/19 |
| Env docs | PASS, `env-reference-drift.vitest.ts` 5/5 |
| CLI suite | PASS, exit 0. Vitest 1660 passed and 19 skipped in 162 files, against a baseline of 1648 in 161; the 12 added are the 9 source-tag cases and 3 phase cases from phase 003. Every legacy and validation summary line matches the baseline |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not inside `/deep:research` itself.** Its validation calls list their rules, so the warning appears at the next `/speckit:*` validation instead.
2. **Tags without a line are not checked.** `[SOURCE: file.md]` names no line, and the rule only checks `path:line`.
3. **A refused target stays silent.** An ignored file or a `.env` path is refused by the resolver, so a tag pointing at one draws no warning.
4. **Guessed is reported, not resolved.** A tag whose path matches only by file name warns as guessed, even when the guess is right.
<!-- /ANCHOR:limitations -->

---

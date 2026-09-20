---
title: "Implementation Summary"
description: "All eight cli runtime READMEs now carry a directory tree and file/role map naming every subfolder and reference file, and the cli-pi contract pin resolves again after being repointed at its archived packet."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/075-cli-runtime-readme-refresh"
    last_updated_at: "2026-09-20T10:58:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-075-cli-runtime-readme-refresh"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 075-cli-runtime-readme-refresh |
| **Completed** | 2026-09-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader could not see what a cli runtime packet contained without listing its directory. Six of the
eight READMEs had no folder map at all, three reference files that exist on disk were named nowhere,
and one README's only contract link pointed at a packet that had been archived. Each of the eight now
opens onto its own folder.

### Refresh the eight cli runtime READMEs and their folder maps

Six READMEs gained a `STRUCTURE` section inserted between `HOW IT WORKS` and
`INTEGRATION & NAVIGATION`, with the following headings renumbered to stay 1..N.
`.skilled/skills/cli-external-orchestration/cli-claude-code/README.md` is the shape they share: a fenced
`text` tree naming `SKILL.md`, `README.md`, all five subdirectories and every file under `references/`
and `assets/`, followed by a `| File | Role |` table. `cli-hermes/README.md` kept its existing section
and gained `feature-catalog/`; `cli-jev/README.md` had `## 1. WHAT THIS PACKET IS` retitled to
`## 1. OVERVIEW` and its `LAYOUT` tree extended.

Three files that existed but were named nowhere are now documented: `references/context-budget.md` and
`references/permissions-matrix.md` in `cli-opencode/README.md`, and `references/providers-and-models.md`
in `cli-pi/README.md`.

The cli-pi contract pin was repointed in one substring across the 9 files that carry it as a markdown
link, from `specs/cli-external-orchestration/031-cli-pi-creation` to the archived
`specs/cli-external-orchestration/z_archive/031-cli-pi-creation`. Relative depth is unchanged, and
`.hermes/skills/cli-pi/SKILL.md` was regenerated so the Hermes mirror matches.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-{claude-code,codex,cursor,devin,opencode,pi}/README.md` | Modified | `STRUCTURE` section added, following headings renumbered |
| `.skilled/skills/cli-external-orchestration/cli-hermes/README.md` | Modified | `feature-catalog/` added to the existing tree |
| `.skilled/skills/cli-external-orchestration/cli-jev/README.md` | Modified | Section 1 retitled to `OVERVIEW`; `LAYOUT` tree extended |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modified | 2 pin links repointed |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/{agent-delegation,cli-reference,integration-patterns,mcp-and-third-party-packages,native-skills-and-extensions,pi-tools}.md` | Modified | 6 pin links repointed |
| `.skilled/skills/cli-external-orchestration/cli-pi/assets/prompt-templates.md` | Modified | 2 pin links repointed |
| `.hermes/skills/cli-pi/SKILL.md` | Modified | Regenerated mirror of the repointed canonical body |
| `specs/cli-external-orchestration/075-cli-runtime-readme-refresh/scratch/verify.sh` | Created | The acceptance rows, runnable from the repo root |
| `specs/cli-external-orchestration/075-cli-runtime-readme-refresh/scratch/{build-prompts.cjs,dispatch-readmes.cjs,repoint-pin.sh,capture-baseline.sh,watch.sh,identify-children.sh}` | Created | Prompt emitter, runtime-backed dispatcher, and the receipts tooling |
| `specs/cli-external-orchestration/075-cli-runtime-readme-refresh/scratch/prompts/<runtime>.md` | Created | Eight committed dispatch prompts, one per runtime |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One delegated child per README, three at a time, all eight dispatched through the shared deep-loop
runtime's own `cli-pi` command builder and process runner rather than a packet-local adapter. Every child
exited 0, in 231s to 1410s. Nothing was trusted because a child said `STATUS=OK`: each claim was checked
against the file on disk, and the packet verifier was run as a negative control against the un-remediated
tree first, where it failed 6 of 9 rows and reproduced the baseline exactly.

Two dispatch mechanics were not as planned, both recorded rather than absorbed. The plan named
`scratch/dispatch-readmes.sh`; the cli-pi contract forbids a packet-local spawn path, so the dispatcher is
a `.cjs` that imports the runtime's exported builder and runner. And the plan's `--thinking high` reached
the model as `--thinking max`, because `glm-5.3-flash` carries a pinned thinking ceiling that the runtime
raises rather than dispatching below. The main session performed the link repoint and the mirror
regeneration itself, and reverted the 7 unrelated mirrors and 2 untracked mirror directories that the
regeneration also rewrote.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dispatch through the runtime's exported `buildLineageCommand` and `runLineageProcess` | A hand-rolled `pi -p` line is how a dispatch silently loses `--offline`, the stdin redirect, or the provider-qualified model id. The runtime already owns all three, so the dispatcher builds no argv of its own. |
| Leave the 3 `cli-pi/changelog/*.md` pin occurrences alone | The link checker's own `EXCLUDE_SEGMENTS` names `/changelog/` deliberately, on the ground that a changelog records what was true when written. Those three are also broken in relative depth independently, so the substring alone would not repair them. Reported as a separate defect instead of absorbed. |
| Generate each prompt from one contract rather than write eight by hand | Eight hand-written copies of one contract drift, and the drift surfaces as eight subtly different READMEs. The inventory is measured from disk at emit time and baked into the artifact, so a child anchors on a snapshot rather than on its own read. |
| Accept `cli-opencode/README.md` at +50 lines, above the +15..+45 advisory band | That packet carries the largest inventory of the eight (9 references and 6 assets files), so its tree and table are necessarily the longest. The band was advisory and the excess is explained by the file count, not by padding. |
| Build the worktree's missing `dist/` trees before running the packet gate | The gate could not load `@spec-kit/shared/dist`, which fails identically on untouched packets. The provisioning manifest names those builds as prerequisites, so building them was the prerequisite, not a change to the deliverable. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on all 8 READMEs | PASS — 8/8 `VALID`, 0 blocking errors. Before: 7/8, with `cli-jev` blocked on `missing_required_section: overview`. |
| `check-markdown-links.cjs` | PASS — 5 broken, down from 15. Zero name the cli-pi cluster or any of the 8 READMEs. The 5 that remain are the named out-of-scope files. |
| `scratch/verify.sh` | PASS — `RESULT: PASSED (passed=9 failed=0)`, exit 0. Receipt at `scratch/verify-run.txt`. |
| Folder coverage, all 8 READMEs | PASS — 42/42 immediate subdirectories and 70/70 `references/`+`assets/` files named. Before: 11 subdirectories and 7 files missing. |
| Fenced directory tree present | PASS — 8/8. Before: 2/8. |
| Sequential H2 numbering 1..N | PASS — 8/8. |
| Stale contract pin in the 9 link-bearing files | PASS — 0 occurrences, down from 11. |
| Hermes cli-pi mirror | PASS — `sync-skills-hermes.cjs --check` reports `cli-pi` in sync, drift unchanged at 7 drifted + 1 stale, none of them cli-pi. |
| Authorized-path audit | PASS — 17 changed files, every one inside the authorized set; 0 unexpected. |
| `validate.sh --strict` on the packet | PASS — `RESULT: PASSED`, exit 0, Errors: 0. |
| `scratch/verify.sh` as a negative control, pre-remediation | PASS — failed 6 of 9 rows and reproduced the baseline (7/8 VALID, 15 broken with 10 in the cluster, 11 stale pins), so the verifier discriminates rather than asserting nothing. |
| `check_derived_readme_counts.py` (advisory) | Not gated. The "three-layer guard" phrasing failures remain, unchanged by this work and deliberately not fixed — they are a heuristic class, not a defect. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Five unrelated broken links remain.** Two in
   `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md`, one
   in `.skilled/skills/system-spec-kit/runtime/hooks/cursor/README.md`, two in
   `.skilled/skills/system-spec-kit/runtime/hooks/devin/README.md`. Same class as the pin repaired here,
   different packets, out of scope by the frozen scope.

2. **Three `cli-pi/changelog/*.md` pin occurrences are unfixed**, as decided above. Repairing them means
   correcting relative depth as well as the path, which is a different repair in a different file class.

3. **The `.git/hooks/*` symlinks are stale, but the hooks are not dead — and reading only them says the
   opposite of the truth.** `pre-commit`, `commit-msg`, `pre-push` and `post-commit` under `.git/hooks/`
   all point at `.opencode/scripts/git-hooks/`, which does not exist, so none of them can fire. That much
   is real. It is also irrelevant: `core.hooksPath` is set globally to `~/.config/git/hooks`, whose live
   symlinks resolve to `.skilled/scripts/git-hooks/*`, so the gates do run. This was observed, not
   inferred — `spec-remint` and `route-remint` both blocked commits on this work, and `route-remint`
   demanded a compiled-routing re-mint and staged both manifests itself. An earlier draft of this section
   claimed no git gate ran; that draft was wrong, and running the checks by hand beforehand neither
   proves nor disproves a gate the caller cannot see. The vestigial `.git/hooks/` entries are worth
   reporting as misleading, not as a missing safety net.

4. **The worktree's `dist/` trees are built, not committed.** `system-spec-kit/shared`, `runtime` and
   `runtime/cli` were built to make the packet gate runnable. They are gitignored build output in a
   disposable worktree, so they are not part of the deliverable and a fresh worktree would need the same
   step.

5. **A delegated child reported a defect that did not survive inspection.** The `cli-cursor` child
   flagged `cli-cursor/README.md` for citing `.skilled/skills/sk-doc/scripts/validate_document.py`
   rather than the `shared/scripts/` variant. That path is a symlink to
   `../shared/scripts/validate_document.py`, and both spellings run the same validator and report
   `VALID`. The citation is correct and nothing was changed. Six of the eight READMEs use that
   spelling, so a repair here would have rewritten working documentation in five untouched sections.
<!-- /ANCHOR:limitations -->

---

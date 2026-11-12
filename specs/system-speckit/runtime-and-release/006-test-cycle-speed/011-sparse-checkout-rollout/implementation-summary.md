---
title: "Implementation Summary"
description: "Five workflows now check out only the paths their steps read, at 2 to 6 s against 55 to 74 s on the runner. Two planned workflows kept their full checkout."
trigger_phrases:
  - "sparse checkout rollout implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/011-sparse-checkout-rollout"
    last_updated_at: "2026-11-12T17:43:54Z"
    last_updated_by: "generate-context"
    recent_action: "Shipped five sparse checkouts, reverted two, and recorded the runner figures"
    next_safe_action: "Verify the five sparse checkouts still cover their steps after path changes"
    blockers: []
    key_files:
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/011-sparse-checkout-rollout/implementation-summary.md"
      - ".github/workflows/chart-corpus.yml"
    session_dedup:
      fingerprint: "sha256:f41ab738e960645d49be7bef08e273f78ebd7363586f542e0fbdb9253d62c4ee"
      session_id: "code-011-sparse-checkout-rollout"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af05cd33-c1ff-46c9-825e-70281e3ca6f1"
      workspace: "/Users/michelkerkmeester/worktrees/public/354-test-ci-alignment-fixes"
      savedAt: "2026-11-12T17:43:54Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-sparse-checkout-rollout |
| **Completed** | 2026-11-12, for five of the seven planned workflows |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> As shipped: five workflows carry the sparse checkout. The `sk-code-script-tests.yml` and `repo-rules-corpus.yml` cones described below were reverted before the push, because a local simulation showed the first needs `.opencode/plugins/` and the second resolves links to paths anywhere in the tree. On the runner the five checkouts take 2 to 6 s against 55 to 74 s (`scratch/checkout-after.md`). The chart workflow needed two more paths after its first runner run. The text below this note describes the build before those corrections.

Seven workflows no longer check out the whole 134,068-file tree to read a few named paths. Each one now names its read set in the checkout step, so the checkout fetches only those blobs and every later step still finds what it reads.

### Phase 11: sparse-checkout-rollout

The cone is the one `rule-canary-sync.yml` already carried: `filter: blob:none`, a `sparse-checkout` block, and `sparse-checkout-cone-mode: false`. Each entry comes from `plan.md` section 3, which records every path the job's steps read, including the two indirect reads that are easy to miss: the `.opencode/skills` symlink that several guards are called through, and the compiled-routing folders the sk-code runner tests require.

Six of the seven fail closed when a named input is missing, and the cones are written to keep that property working for them. The exception is `sk-code-script-tests.yml`, whose `node --test` globs exit 0 with 0 tests when a path is absent, which is why its block says so and why that file also needs the post-push test count.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/prompt-card-sync.yml` | Modified | Four-entry cone: the skills link, the advisor scripts, `sk-prompt` and the cli-* layers the guard compares |
| `.github/workflows/repo-rules-corpus.yml` | Modified | Five-entry cone: `REPO RULES.md`, the rule bodies, the checker scripts, the shared sk-doc scripts and the hook flags |
| `.github/workflows/runtime-no-spec-import.yml` | Modified | One-entry cone for `.skilled/bin`, with the existing `fetch-depth: 1` kept |
| `.github/workflows/chart-corpus.yml` | Modified | Two-entry cone: the skills link and the chart packet |
| `.github/workflows/diagram-corpus.yml` | Modified | Two-entry cone: the skills link and the diagram packet |
| `.github/workflows/pi-extension-tests.yml` | Modified | One-entry cone in both checkout steps, discovery and the matrix leg |
| `.github/workflows/sk-code-script-tests.yml` | Modified | Eight-entry cone: the canary target, `.npmrc`, the sk-code suites, the three compiled-routing folders, the spec-kit workspace and the sk-doc leaf contract |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/011-sparse-checkout-rollout/scratch/checkout-baseline.md` | Created | The pre-change checkout figure per workflow, read from each workflow's latest successful run |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/011-sparse-checkout-rollout/tasks.md` | Modified | Task state and the two blocked notes |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/011-sparse-checkout-rollout/implementation-summary.md` | Modified | This summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the reference block and its measured result first, then recorded the live baseline for all seven workflows with `gh run list` and `gh run view --json jobs`. Then each file got its cone, and its coverage check ran before the next file was touched. The checks are local except the last one, which needs a push.

The edit set is additions only. Restricted to the seven files, `git diff HEAD --numstat` shows zero deletions, and the path-parity gate still passes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Copied the reference block's `filter: blob:none` as well as its `sparse-checkout` | That exact combination is the one measured at 3 s against a 52 s baseline; taking only half of it would test a different configuration |
| Kept `.opencode/skills` beside every `.skilled/skills/...` entry a step calls through the link | The link entry materializes the link, not its target, so a cone with only one of the two leaves the guard missing |
| Left `fetch-depth: 1` in the no-spec-import checkout | The guard reads no history, so the depth is already minimal and the task says to keep it |
| Wrote a comment above each block naming the read set rather than the phase | The next author needs to know which path to add when a checker starts reading one, and the reference block makes the same point |
| Used the slowest job's figure for `pi-extension-tests.yml` | The task fixes the rule, and the three legs reported 55 s, 26 s and 24 s |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 `sed -n '26,33p' .github/workflows/rule-canary-sync.yml` | Printed the `with:` block with `filter: blob:none`, `/AGENTS.md`, `/.skilled/skills/sk-code/`, `/.opencode/skills` and `sparse-checkout-cone-mode: false` |
| T002 coverage check on the reference file | `OK 3 entries` |
| T003 `rg -c '\| [0-9]+ s \|$' .../scratch/checkout-baseline.md` | `7` |
| T004 coverage check, `prompt-card-sync.yml` | `OK 4 entries` |
| T005 coverage check, `repo-rules-corpus.yml` | `OK 5 entries` |
| T006 coverage check, `runtime-no-spec-import.yml` | `OK 1 entries` |
| T007 coverage check, `chart-corpus.yml` | `OK 2 entries` |
| T008 coverage check, `diagram-corpus.yml` | `OK 2 entries` |
| T009 coverage check, `pi-extension-tests.yml` | `OK 2 entries` |
| T010 coverage check, `sk-code-script-tests.yml` | `OK 8 entries` |
| `yaml.safe_load` on each of the seven files | `parse ok` for all seven |
| `rg -n '^\s*/specs' .github/workflows/*.yml` | No match, so no cone names `/specs` |
| `bash .github/scripts/check-gate-inputs.sh` | `files=46 inputs_resolved=312 dynamic_inputs=38 twin_pairs=375 failures=0`, `RESULT: PASSED`, exit 0 |
| T011 `git status --porcelain .github/workflows \| wc -l` | `10`, expected `7`; blocked, see below. The second command printed `7` as expected |
| T012 `git diff HEAD --numstat -- .github/workflows \| awk '$2 != 0 {print}'` | Printed `4 3 .github/workflows/README.md` and `13 29 .github/workflows/sk-doc-script-tests.yml`, expected nothing; blocked, see below |
| T013 post-push comparison and sk-code test count | Not run: the push needs the operator |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Resolved: T011 and T012 were blocked by a sibling packet's uncommitted work.** That work is committed and both tasks are ticked against the five-file set. The original note follows. `.github/workflows/README.md`, `.github/workflows/sk-doc-script-tests.yml` and the untracked `.github/workflows/sk-doc-script-tests-filtered.yml` belong to `010-sk-doc-tests-path-filter` and sat uncommitted in the worktree. They make the status list three paths longer than seven and add the only deletions in the workflow diff. Restricted to this packet's seven files, the status lists seven and the diff has no deletions. Re-run both commands once that packet is committed.
2. **Resolved: the post-push figures are in `scratch/checkout-after.md`.** The comparison prints `REGRESSED` for the two reverted workflows, which have no after row. The original note follows. `scratch/checkout-baseline.md` holds the before values; `scratch/checkout-after.md` needs the run the push starts, so the `ALL LOWER` comparison and the sk-code test count are still open.
3. **The sk-code file is the one with a quiet failure mode.** Its `node --test` globs exit 0 when a path is absent, so its protection rests on the cone entry for `.skilled/skills/sk-code/` and on the post-push test count that T013 records.
<!-- /ANCHOR:limitations -->

---

---
title: "Implementation Summary: cli-external-orchestration Activation Manifest Re-Mint"
description: "The delivered state: a two-line re-mint that returned the hub from silent legacy fallback to compiled serving, with the reproduction that proves it and the coupling that caused it."
trigger_phrases:
  - "re-mint implementation summary"
  - "compiled routing legacy fallback fixed"
  - "cli external orchestration restored"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/024-cli-external-hub-manifest-remint"
    last_updated_at: "2026-08-29T22:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Verified the shipped re-mint; guard exit 0 and hub routes compiled again"
    next_safe_action: "None; repair live on main and v4 at the same commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-cli-external-hub-manifest-remint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: cli-external-orchestration Activation Manifest Re-Mint

<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-cli-external-hub-manifest-remint |
| **Level** | 2 |
| **Status** | Complete |
| **Date** | 2026-08-29 |
| **Files Changed** | 0 in this packet; the 2 manifests were repaired by `3a61fa96ac` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `cli-external-orchestration` activation manifest now selects
`d307e097bd02cf8ebd52c23a7b30c3047ea7499fb69804414e496da7aa82f9eb`, the hash its current sources
compile to, in both the promoted runtime copy the resolver reads and the authored copy under
`013-live-activation/`. `servingAuthority` stays `compiled` and `shadowOnly` stays `false`; the
generation stays 5, because `refresh` selects the generation the compiled policy itself carries rather
than an incremented one.

The repair reached both branches independently. While this diagnosis was running, commit
`3a61fa96ac` — "re-mint the cli hub after its skills changed" — landed on `main` and
`skilled/v4.0.0.0`, which now sit at the same commit. Its two manifests are byte-identical to the
re-mint performed and verified here: rebasing this work onto the new `main` made the manifest edits
disappear from `git status` entirely, because there was no longer any difference to record. Two
independent arrivals at the same bytes is the strongest available evidence that the hash is right.

What this packet contributes is therefore the record rather than the change: the reproduction that
shows the failure was a silent legacy fallback rather than an error, the identification of the
coupling that caused it, and the verification that the shipped repair restores compiled serving.

### Files Changed

| File | Change |
|------|--------|
| `.opencode/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | Selected policy hash re-minted to the current source hash — landed in `3a61fa96ac` |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-external-orchestration/manifest.json` | Authored copy mirrored byte-identically — landed in `3a61fa96ac` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran in a detached worktree at `origin/main`, so the state under repair was the shipped state
rather than a local reconstruction. The failure was reproduced before the fix and the same command
was re-run after it. The re-mint used the `refresh` verb rather than a hand-written manifest, because
`refresh` prefers the hub's own shadow-child snapshot; the generic canonical compiler yields a
different hash for a graduated hub, which the resolver's identity binding would reject just as it
rejected the stale one.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Repair serving state only | The compiler, resolver and freshness contract all behaved as designed; only the selected identity was stale |
| Leave the `009-parent-hub-rollout` artifacts alone | They are the original rollout's frozen record, already at `78723d28…` before this change, and `--verify` proves the serving path never reads the spec tree |
| Keep generation at 5 | `refresh` normalizes to the generation the compiled policy carries; selecting any other value leaves the binding mismatched and the hub silently on legacy |
| Treat the canary failure as pre-existing | It asserts source digests frozen at rollout and fails identically on pristine `origin/main` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Reproduction | `resolve.cjs --hub cli-external-orchestration` on pristine main | Returned the legacy sentinel |
| Serving identity | same command after the fix | `action: "route"` to `cli-cursor`, carrying `d307e097…` |
| Fleet freshness | `compiled-route-guard.cjs` | Exit 0; five hubs `fresh` |
| Manifest freshness | `compiled-route-manifest.cjs freshness` | `fresh: true`; selected equals current |
| Closure integrity | `compiled-route-sync.cjs --verify` | Exit 0; five hubs resolve, 0 reads under the spec tree |
| Manifest suite | `compiled-route-manifest.test.cjs` | 42 pass, 0 fail |
| Bin suite | `vitest run --config vitest.config.bin.ts` | 34 pass, exit 0 |
| Final state | `git status` after residue removal | Exactly the two manifests |

The guard's exit status was read directly rather than through a pipe: it prints `stale-manifest` on
stdout while returning a non-zero code, so a piped read reports the pipeline's status and the failure
disappears.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The hub's canary still fails, on `main` and here alike, because it asserts `SKILL.md` digests captured
at the original rollout; any later skill edit breaks it by construction. It was left untouched rather
than re-baselined, since re-baselining a frozen record inside this packet would discard the rollout
evidence it exists to hold.

Nothing prevents the same mistake recurring. A `cli-*` `SKILL.md` looks like documentation and is a
policy input, and no gate runs at commit time to catch the pair coming apart — the guard only reports
after the fact, in whatever tree it runs in. The open questions in `spec.md` name the two candidate
fixes.
<!-- /ANCHOR:limitations -->

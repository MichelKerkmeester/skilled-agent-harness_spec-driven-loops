---
title: "Implementation Summary: Auto re-mint a hub routing manifest at commit time"
description: "What the gate does, the measured trigger set behind it, and the three cases proved against the real hook."
trigger_phrases:
  - "route remint summary"
  - "pre-commit remint results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/017-routing-manifest-auto-remint"
    last_updated_at: "2026-09-10T09:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added the gate and proved three cases against the hook"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-10-routing-auto-remint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Auto re-mint a hub routing manifest at commit time

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:status -->
## 1. STATUS

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Surface** | `.opencode/scripts/git-hooks/pre-commit`, one added block, plus five documentation catalogs |
<!-- /ANCHOR:status -->

---

<!-- ANCHOR:what -->
## 2. WHAT IT DOES

When a commit stages a routing input for one of the five hubs, the gate re-mints that hub, copies the runtime manifest over its authored counterpart and stages both, then lets the commit through. It prints one line naming the hub it fixed. When the same hub has an input staged and unstaged at once it refuses instead, because minting reads the working tree and the manifest would then describe content the commit does not carry.

This departs from the block-and-instruct shape of every gate above it, and the departure is confined to this artifact. The manifest is derived from the staged inputs with no judgment involved, so printing a command for a human to run is pure toil. The pre-push route gate is unchanged and remains the backstop if a mint ever fails.
<!-- /ANCHOR:what -->

---

<!-- ANCHOR:trigger -->
## 3. THE MEASURED TRIGGER

`loadCanonicalRouterInputs` reads three files at the hub root, but the compiler resolves the leaves the registry declares, so nested content reaches the hash too. Probing one file class at a time against the route guard settled it:

| Touched | Manifest |
|---|---|
| hub root `SKILL.md` | stale |
| nested mode `SKILL.md` | stale |
| `hub-router.json`, `mode-registry.json` | stale, direct hash inputs |
| `ROUTER.md`, `references/`, `README.md`, `assets/` | fresh |

The gate matches exactly that set. A wider trigger would re-mint on edits that change nothing, and a narrower one would miss the nested case, which is the case that actually bit.
<!-- /ANCHOR:trigger -->

---

<!-- ANCHOR:verification -->
## 4. VERIFICATION

Run against the real hook, with the tree restored afterwards and the guard reporting every hub fresh.

- `bash -n` on the hook: clean. ShellCheck: zero findings in the block, at every severity.
- The discriminator that detects a throwaway index was proved against values measured from real git: a plain commit runs with `.git/index`, `git commit -a` with `.git/index.lock` and a pathspec commit with `.git/next-index-<pid>.lock`. Only the last blocks. An earlier draft tested for "not index" and would have blocked every `-a` commit in the repository.
- No routing input staged: zero `route-remint` output, no work done.
- A nested mode `SKILL.md` staged: `re-minted cli-external-orchestration and staged both manifests`, the index carried the edit plus both manifests, and the guard reported the hub fresh.
- The same input staged and unstaged at once: exit code 1 with the file named.

Restored state after testing: index empty, no dirty file under the hub or either manifest root, all five hubs fresh.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:rollback -->
## 5. ROLLBACK

`git revert` the commit. The installed hook is a symlink to the tracked file, so every session picks the revert up at once with no reinstall. `SPECKIT_SKIP_ROUTE_REMINT=1` skips the block for one commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:review -->
## 6. WHAT AN INDEPENDENT REVIEW CHANGED

A fresh reviewer read the first version and found two reachable defects that a green run could not see. Both were reproduced before being accepted, and both are fixed here.

The first was silence. The copy, the `git add` and the report all sat behind one existence test, so a missing authored manifest skipped every one of them and exited zero with nothing staged and nothing printed. The gate now fails closed on each precondition and, after staging, re-reads the index to confirm both manifests actually arrived.

The second was the throwaway index. When a pathspec narrows a commit, git runs the hook against an index it later discards, so the manifest reached the commit while the real index kept the old blob and the next commit reverted it. Reproduced in an isolated repository: after the commit the index held the stale object while HEAD and the disk held the new one. That mode is now refused with the mint command printed, rather than auto-staged into an index that will be thrown away.

The review also corrected a claim in this packet. The pre-push guard is not a backstop for a failed auto-fix, because it reads the working tree and returns no drift when a manifest is missing. The gate carries its own proof instead.

Three smaller findings were taken: a `cp` failure now prints an attributed block rather than dying under `set -e` with a bare shell error, the failure path captures the mint output instead of re-running a command that writes, and a staged deletion no longer triggers a mint against a tree the leaf has left.

Four smaller items were carried as deferred work for one commit and are now closed:

- The pre-existing ShellCheck violation in the mirror-parity gate is fixed, so the whole hook reports zero findings at every severity rather than the block alone.
- The hub list and the activation root are read from `compiled-route-guard.cjs` and `compiled-route-layout.cjs` instead of a fourth hardcoded copy, so adding a hub to the guard reaches this gate without a second edit. A cheap pathspec pre-filter runs first, so a commit that stages nothing under `skills` never pays for a node start.
- The two definitions of a routing input now name each other. The workflow's trigger paths are deliberately wider, because it decides whether running the check is worthwhile and a false positive costs a CI minute, while this gate decides what to rewrite and a false positive would re-mint on an edit that changed nothing. Both comments say so.
- `tests/pre-commit.test.sh` covers the gate against a fixture hub with stub route modules and a stub mint tool, eight cases, all passing. It runs the real hook file rather than a copy, so a later change to the block is covered whether or not anyone remembers this harness.
<!-- /ANCHOR:review -->

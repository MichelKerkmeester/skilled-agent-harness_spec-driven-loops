---
title: "Implementation Summary [006-mk-dist-freshness-guard]"
description: "Remediation of the mk-dist-freshness-guard audit: build-attested freshness, first-class checker errors, root-resolution fix, and cross-package Claude coverage — plus the already-shipped lib/hook hardening."
trigger_phrases:
  - "mk-dist-freshness-guard remediation"
  - "dist freshness guard implementation"
  - "build attestation freshness"
  - "implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/006-mk-dist-freshness-guard"
    last_updated_at: "2026-07-10T20:17:27.808Z"
    last_updated_by: "opus-plugin-finalization"
    recent_action: "Shipped F1/F2/F6/O1; F3/F4/F5/F7/O3/O4 already-shipped; O2/O5 by-design"
    next_safe_action: "none - packet complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-dist-freshness-guard.js"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh"
      - ".opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-mk-dist-freshness-guard |
| **Completed** | 2026-07-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Remediated the mk-dist-freshness-guard audit's 12 findings (F1-F7 + O1-O5). Four findings were newly implemented this session and six were already shipped; the two remaining findings are confirmed by-design with no code change. The guard now (1) makes the dist-freshness cache build-attested rather than checker-authored, (2) treats checker errors as a first-class status distinct from fresh in every consumer, (3) resolves its standalone fallback path to the real workspace root, and (4) closes the Claude/OpenCode cross-package coverage divergence.

### Findings Shipped This Session (new)

| Finding | Task | What Changed |
|---------|------|--------------|
| **F1** — source-hash mismatch silently blessed as fresh | T003 | Build-attestation activated: `finalize-dist.mjs` records `origin:'build'` via `recordPackageBuild`, wired through `package.json` `prepare-build`. A build-origin hash mismatch now returns stale; checker/absent origin keeps the load-bearing mtime fallback. Verified `origin:build` present in the dist freshness cache. |
| **F2** — checker errors reported as fresh | T004 | `check-dist-staleness.sh` gained a `status=='error'` branch surfacing a bounded, non-blocking CHECK ERROR line (still exit 0), so an error is no longer indistinguishable from fresh. |
| **F6** — standalone fallback resolves one dir too shallow | T008 | Fixed the fallback parent traversal from 4 to 5 levels in `check-dist-staleness.sh`, reaching the workspace root and eliminating the `.opencode/.opencode/...` double-append. |
| **O1** — Claude/OpenCode coverage divergence | T009 | Added a `--all` mode to `check-dist-staleness.sh`, a Claude SessionStart registration for cross-package coverage, and a coverage-contract docstring documenting the PostToolUse edited-file scope as intentional (mirrors OpenCode's two-trigger model). |

### Findings Already Shipped (verified present)

| Finding | Task | Summary |
|---------|------|---------|
| **F3** | T005 | OpenCode plugin invalidates the stale cache in `tool.execute.before` for editor tools, closing the 2-minute TTL window. |
| **F4** | T006 | `claude-posttooluse.sh` enforces a single shared monotonic deadline under the 10s hook budget. |
| **F5** | T007 | `claude-posttooluse.sh` type-validates envelope fields and wraps `main()` in a top-level fail-open boundary. |
| **F7** | T010 | Plugin handles `session.deleted`/disposal events and adds size-bounded log rotation to `appendGuardLog`. |
| **O3** | T012 | Freshness cache anchored to dist identity (distMtime/distSize + origin); fast path requires both source and dist identity to match. |
| **O4** | T013 | `writeStoredSourceHash` best-effort sweeps stale `.dist-freshness-*.*.tmp` orphan siblings. |

### By-Design, No Code Change

- **O2** (T011) — risky-bash refreshes the cache but surfaces the warning next turn. `tool.execute.before` exposes only `{args}`; there is no non-stdout warning channel and stdout is forbidden by the TUI-safety invariant. Next-turn, non-blocking refresh is the intended contract.
- **O5** (T014) — `.json` in `SOURCE_EXTENSIONS`. Dropping it was rejected because compiled code genuinely consumes build-input JSON (advisor prompt-policy data, routing-prototypes/ground-truth JSON copied by finalize-dist); removal would create false-fresh regressions. `.json` stays watched.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both models (GPT-5.6-Sol and Opus 4.8) independently re-read the real code and produced verified fix designs (`fix-design/fix-design.md`) before any edit. F1's build-attestation was activated by wiring `recordPackageBuild` into `finalize-dist.mjs` and `prepare-build` in `package.json`, then confirming `origin:build` appeared in the on-disk freshness cache. F2/F6/O1 were shipped against `check-dist-staleness.sh` (error-status branch, 4-to-5-level parent traversal, `--all` mode + coverage docstring) plus the Claude SessionStart registration. The remaining findings (F3/F4/F5/F7/O3/O4) were already present in the lib/plugin/hook and were verified in place; O2 and O5 were confirmed by-design against the TUI-safety invariant and real JSON build-input dependencies respectively. The compiled `dist/` was rebuilt and the plugin suite plus type-check were run as the closing gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Make the cache build-attested rather than deleting the mtime branch (F1) | The prior audit fix ("any hash mismatch => stale") would false-stale every legitimate rebuild; the mtime branch is load-bearing. Build-written `origin` markers make the cache authoritative without the regression. |
| Keep PostToolUse edited-file-scoped, add cross-package coverage at SessionStart (O1) | Loading every edit with a full 8-package check-all would compound F4's timeout pressure; the two-trigger model matches OpenCode's session + per-turn injection. |
| Leave O2/O5 as by-design (no code) | Both proposed fixes were rejected on evidence — O2 has no safe non-stdout dispatch-time channel; O5's removal would break real build-input JSON freshness detection. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Notes |
|-------|--------|-------|
| Plugin test suite | Pass | 188/189. The single fail is the pre-existing `mk-goal-tool-path` deep-loops path artifact, NOT a regression from this packet. |
| Type-check | Pass | 0 errors. |
| `dist/` rebuild | Pass | Compiled `dist/` rebuilt (gitignored, non-tracked artifact). |
| F1 attestation | Pass | `origin:build` confirmed present in the dist freshness cache after a build. |
| `validate.sh --strict` | See Final State | Errors: 0 (recorded below). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One pre-existing test fail persists.** The 189th plugin test (`mk-goal-tool-path`, a deep-loops path artifact) is unrelated to mk-dist-freshness-guard and was failing before this work; it is not addressed here.
2. **O5's future-JSON risk is documented, not eliminated.** If a package later adds a non-manifest `.json` build input that must invalidate freshness, it will need an explicit `sourceExtensions`/registry entry — none exists among the current packages.
3. **Cross-package coverage relies on SessionStart wiring (O1).** PostToolUse remains edited-file-scoped by design; a stale package in another workspace area is surfaced at session start, not on every unrelated edit.
<!-- /ANCHOR:limitations -->

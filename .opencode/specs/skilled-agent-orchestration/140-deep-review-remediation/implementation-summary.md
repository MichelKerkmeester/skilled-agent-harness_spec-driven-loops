---
title: "Implementation Summary: Deep-review remediation"
description: "An 11-lineage multi-model deep review found one real P1 in the reap fix shipped this session; the stale-reclaim reap+spawn is now serialized under the respawn lock, plus convergent P2 hardening, with the launcher fixes synced to Barter."
trigger_phrases:
  - "deep review remediation done"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/140-deep-review-remediation"
    last_updated_at: "2026-06-08T11:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deferrals F1b/F4/F5/F7 resolved, verified, synced to Barter"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-140-deep-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 140-deep-review-remediation |
| **Completed** | 2026-06-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A multi-model deep review of the recent daemon-reliability and portability work ran 11 lineages: six gpt-5.5-fast xhigh through the official cli-opencode fan-out and five opus through claude2. It converged on one real P1 and a set of P2 hardening items, and round-2 verification against the actual code confirmed the P1. The P1 was fixed first, then a follow-up pass resolved the rest of the deferred findings rather than leaving them documented.

### F1 (P1): the stale-reclaim reap was not the mutex the fix claimed
The reap-before-respawn fix relied on the owner-lease acquisition being an exclusive spawn mutex. It is exclusive only when no prior lease exists (the `O_EXCL` create). When an owner lease exists but is stale, because the owner crashed without running the release path, `acquireOwnerLeaseFile` falls to a non-exclusive write plus re-read. Two fresh launchers racing that stale lease could both believe they acquired ownership and both reap and respawn, reintroducing the double-writer through a different race. The fix wraps the stale-reclaim reap and spawn in the existing exclusive respawn lock, the same primitive the dead-socket respawn path uses: the loser bails and reconnects, the winner is the single owner and writer. The overstated comment was corrected.

For the release path the fix primarily targets, the disposing owner drops its lease, so a fresh launcher hits the real `O_EXCL` path and the mutex already held; the gap was only the crashed-without-release window.

### F1c, F2, F3
`reapLeaseChildBeforeRespawn` now refuses to hand the database to a replacement when a child outlives SIGKILL within the grace window. Two `096 packet` perishable labels in the launcher comments were rewritten, and the hygiene checker gained a reversed `NNN packet` pattern that the old `packet NNN` rule missed. The live adoption test's two `execSync` shell calls became `spawnSync` with args, parsing stdout regardless of exit status because `lsof +D` exits non-zero on benign warnings.

### Follow-up: deferred findings resolved
The deep review's lower-tier deferrals were then closed rather than left documented.

**F1b (true adoption).** The stale-reclaim branch now adopts the warm daemon instead of reaping it. When the recorded `childPid` is still alive and its socket is bridgeable, the fresh launcher clears its own owner lease and bridges to the live daemon, so a session after a crashed-or-released owner reuses the warm process and never tears down a daemon a live secondary may still be bridged to. Reap and respawn now run only when the daemon is genuinely gone. The adoption test was renamed and tightened to assert the orphan survives, the new pid equals the orphan pid, and exactly one process holds the database open (F4).

**F5 (release-path sidecar escalation).** When `shutdownLauncherForSignal` releases the model server for adoption, it now waits the reap grace window and escalates a non-exiting sidecar to SIGKILL, so the release path does not leave a wedged sidecar behind.

**F7 (settings leak).** The tracked `.claude/settings.local.json` shipped machine-specific `permissions.allow` and the `SPECKIT_ABLATION` env flag to every cloner. The portable `hooks` block moved into the tracked `.claude/settings.json`, the local file was stripped to its personal `env` plus `permissions`, untracked with `git rm --cached`, and added to `.gitignore`. The same restructure was mirrored into the Barter coder mirror.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | F1 respawn-lock serialization + F1b adoption + F1c + F5 escalation + F2 comment |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | F2 comment |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Modified | F2 reversed-ordering pattern |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Modified | F3 spawnSync hardening + F4 single-writer adoption assertion |
| `.claude/settings.json` | Modified | F7 hooks moved into the tracked shared settings |
| `.claude/settings.local.json` | Untracked | F7 personal env/permissions no longer shipped (gitignored) |
| `.gitignore` | Modified | F7 ignore the local settings file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The P1 was round-2 verified by reading `acquireOwnerLeaseFile` rather than trusting the convergent reports, which confirmed the non-exclusive stale-reclaim path. The serialization reuses the existing respawn lock so it inherits a tested, non-blocking exclusive primitive, acquired only on the rare stale branch and released right after the spawn and in the finally. The first test run caught a real regression in the F3 rewrite: `execFileSync` threw on `lsof`'s benign non-zero exit and returned an empty list, so the single-writer assertion saw zero; switching to `spawnSync` and parsing stdout regardless of status fixed it. The follow-up pass then resolved the deferrals it could verify cleanly: F1b adoption (covered by the renamed single-writer adoption test), F5 sidecar escalation, and the F7 settings restructure across both repos. Only the cosmetic checker rename (F6) and the by-design hook split (F9) were left as documented decisions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Serialize with the respawn lock, not a new primitive | Reuses a tested exclusive lock the dead-socket path already uses |
| Refuse respawn on unconfirmed kill | Never spawn a second writer onto a still-live child |
| Adopt the warm daemon over reap+respawn (F1b) | A live, bridgeable daemon is reused; reap runs only when it is genuinely gone, and a secondary's transport is never torn down |
| Move hooks to the tracked settings, gitignore the local file (F7) | Shared portable hooks ship to cloners; personal permissions and ablation env stop leaking |
| Do not sync the sk-code checker to Barter | The mirror convention keeps Barter's sk-code as-is |
| Keep F6 as a documented non-fix; F9 is by-design | The `.sh`-named Python checker has 15+ stable references and works via its shebang; the claude/codex hooks intentionally forward to the migrated skill advisor |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both launchers parse (`node --check`) | PASS |
| Comment hygiene on both launchers (F1b/F5 comments) | PASS, exit 0 |
| Durability adoption suite (3 cases, F1b/F4) | PASS, 3/3 |
| Full durability suite | PASS, 18/18 |
| Launcher-lease unit suite | PASS, 11/11 |
| F7: `settings.local.json` untracked + gitignored, both JSON valid | PASS, Public + Barter |
| `validate.sh --strict` on this packet | PASS |
| Barter sync (launcher F1b/F5 + test F4 + settings, sk-code preserved) | Done |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `.sh`-named checker keeps its extension (F6).** `check-comment-hygiene.sh` is Python run through its shebang; it must be invoked directly or via `python3`, not `bash`. Renaming it touches 15+ stable references across CI, constitutional docs, and playbooks for no behavioral gain, so it stays named as-is by decision, not oversight.
2. **The claude/codex spec-kit hooks forward to the skill advisor (F9).** This is the migrated wiring, not a missing native hook; devin already points at the advisor and the others are intentional shims.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

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
    last_updated_at: "2026-06-08T11:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixes shipped, verified, synced to Barter"
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

A multi-model deep review of the recent daemon-reliability and portability work ran 11 lineages: six gpt-5.5-fast xhigh through the official cli-opencode fan-out and five opus through claude2. It converged on one real P1 and a set of P2 hardening items, and round-2 verification against the actual code confirmed the P1.

### F1 (P1): the stale-reclaim reap was not the mutex the fix claimed
The reap-before-respawn fix relied on the owner-lease acquisition being an exclusive spawn mutex. It is exclusive only when no prior lease exists (the `O_EXCL` create). When an owner lease exists but is stale, because the owner crashed without running the release path, `acquireOwnerLeaseFile` falls to a non-exclusive write plus re-read. Two fresh launchers racing that stale lease could both believe they acquired ownership and both reap and respawn, reintroducing the double-writer through a different race. The fix wraps the stale-reclaim reap and spawn in the existing exclusive respawn lock, the same primitive the dead-socket respawn path uses: the loser bails and reconnects, the winner is the single owner and writer. The overstated comment was corrected.

For the release path the fix primarily targets, the disposing owner drops its lease, so a fresh launcher hits the real `O_EXCL` path and the mutex already held; the gap was only the crashed-without-release window.

### F1c, F2, F3
`reapLeaseChildBeforeRespawn` now refuses to hand the database to a replacement when a child outlives SIGKILL within the grace window. Two `096 packet` perishable labels in the launcher comments were rewritten, and the hygiene checker gained a reversed `NNN packet` pattern that the old `packet NNN` rule missed. The live adoption test's two `execSync` shell calls became `spawnSync` with args, parsing stdout regardless of exit status because `lsof +D` exits non-zero on benign warnings.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | F1 respawn-lock serialization + F1c + F2 comment |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | F2 comment |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Modified | F2 reversed-ordering pattern |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Modified | F3 spawnSync hardening |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The P1 was round-2 verified by reading `acquireOwnerLeaseFile` rather than trusting the convergent reports, which confirmed the non-exclusive stale-reclaim path. The serialization reuses the existing respawn lock so it inherits a tested, non-blocking exclusive primitive, acquired only on the rare stale branch and released right after the spawn and in the finally. The first test run caught a real regression in the F3 rewrite: `execFileSync` threw on `lsof`'s benign non-zero exit and returned an empty list, so the single-writer assertion saw zero; switching to `spawnSync` and parsing stdout regardless of status fixed it. The lower-tier findings were triaged rather than blindly applied: the checker rename and the settings restructure are documented deferrals with rationale.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Serialize with the respawn lock, not a new primitive | Reuses a tested exclusive lock the dead-socket path already uses |
| Refuse respawn on unconfirmed kill | Never spawn a second writer onto a still-live child |
| Defer true adoption (F1b/F4) | A larger ownership-transfer enhancement, recorded for later |
| Do not sync the sk-code checker to Barter | The mirror convention keeps Barter's sk-code as-is |
| Document F6/F7/F9 rather than force them | Cosmetic rename, owner-policy settings, and by-design hook split |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both launchers parse (`node --check`) | PASS |
| Comment hygiene + checker self-test | PASS, reversed pattern catches |
| Durability adoption suite (3 cases) | PASS |
| Full durability suite | PASS, 18/18 |
| Launcher-lease unit suite | PASS, 11/11 |
| `validate.sh --strict` on this packet | PASS |
| Barter sync (launchers + test, sk-code preserved) | Done |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **True adoption is still deferred.** A fresh session after a crashed owner reaps and respawns rather than bridging to the warm daemon; a connected secondary loses transport and reconnects. F1b/F4 track the enhancement.
2. **Release-path model-server cleanup stays best-effort.** F5 (await + SIGKILL escalation for the sidecar) is deferred; the orphan is idle-bounded.
3. **Owner-policy items left as-is.** The tracked `settings.local.json` personal env (F7) and the `.sh`-extension checker (F6) are documented deferrals, not changed.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

# Review Report — opus-2 fanout lineage

**Target:** recent daemon-reliability + reap + hook-portability work (12 files, `files` target)
**Lineage:** fanout-opus-2 · executor native/opus · maxIterations=1 (cap reached)
**Verdict:** **PASS** (hasAdvisories=true) · 7 P2 advisories, 0 P0, 0 P1

---

## 1. Executive Summary

A clean, well-engineered changeset. After full reads of all 12 in-scope files and
adversarial tracing of the single-writer, lease-scoping, reap-before-respawn, re-election
release, and reconnecting-proxy paths, **no correctness or security defect rising to P0/P1
was substantiated.** The core invariants the work claims are genuinely defended in code:

- Owner-lease `O_EXCL` open as spawn mutex + post-reclaim re-read
  (`mk-spec-memory-launcher.cjs:469-481`).
- Owner-scoped lease cleanup — a secondary launcher's SIGTERM/exit cannot tear down the
  owner's daemon lease (`clearLeaseFile` pid-guard `:955`; `clearOwnerLeaseFile`
  `ownerLeasePid` guard `:529`).
- Reap-before-respawn on the stale-reclaim branch, gated under the owner-lease mutex, with
  an EPERM bail to a retryable `LEASE_HELD` error (`main()` `:1482-1502`).
- Re-election release path detaches the `exit` cleanup before dropping ownership so the
  daemon lease survives for adoption (`:1372-1385`).
- Thorough reconnecting session proxy: reattach/replay/keepalive/backpressure with
  replayable-vs-unsafe tool partitioning (`launcher-session-proxy.cjs`).
- `session-cleanup.sh` refuses the unsafe PPID fallback and re-proves session ancestry
  immediately before every kill (`:86-101`).

Active findings: **P0=0, P1=0, P2=7.** All seven are maintainability / test-weakness /
cross-runtime-parity / defense-in-depth advisories.

## 2. Planning Trigger

**Route → changelog (PASS).** No P0/P1 means no remediation-planning gate is triggered.
The 7 P2 advisories are optional follow-ups; F001 and F002 are the two worth a deliberate
accept/deny decision (see Remediation Workstreams). `hasAdvisories=true`.

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | Status |
|----|-----|-----|-------|----------|--------|
| F001 | P2 | correctness | mk-code-index stale-reclaim has no orphan-reap guard (no `childPid` in lease) | `mk-code-index-launcher.cjs:916`, `:645-650` | active |
| F002 | P2 | maintainability | Headline "secondary keeps transport across reap+respawn" untested | `daemon-reelection-adoption-live.vitest.ts:210-243`, `:183` | active |
| F003 | P2 | maintainability | Adoption test sets dead env var `SPEC_KIT_DB_DIR` | `daemon-reelection-adoption-live.vitest.ts:138` | active |
| F004 | P2 | traceability | Cross-runtime `UserPromptSubmit` hook divergence (devin→skill-advisor vs claude→spec-kit) | `.devin/hooks.v1.json:8` vs `.claude/settings.local.json:38` | active |
| F005 | P2 | maintainability | Python script behind a `.sh` extension | `check-comment-hygiene.sh:1` | active |
| F006 | P2 | correctness | Owner-lease reclaim write not fsync'd (asymmetric with own exclusive path + mk-spec-memory) | `mk-code-index-launcher.cjs:303-308` vs `mk-spec-memory-launcher.cjs:359-374` | active |
| F007 | P2 | maintainability | session-specific one-off permission `allow` entries accumulate (low confidence) | `.claude/settings.local.json:17-28` | active |

## 4. Remediation Workstreams

**Lane A — single-writer defense-in-depth (F001, F006), mk-code-index.** Decide whether
mk-code-index should reach parity with mk-spec-memory: record `childPid` in its lease and
reap a stale-reclaimable orphan before respawn (F001), and fsync the owner-lease reclaim
write (F006). Both are bounded today (SIGTERM kills the child; inherited-stdio child
self-exits on host EOF), so this is hardening, not a fix for a confirmed live bug.

**Lane B — test coverage of the headline path (F002, F003).** Add a case where a *live*
secondary is bridged while a fresh session reaps+respawns the daemon, asserting the
secondary's next call still succeeds after a reconnect blip (F002). While there, drop or
correct the dead `SPEC_KIT_DB_DIR` env line — use `MEMORY_DB_PATH` if env-driven DB
isolation is actually intended, else delete it and note isolation comes from the fake-root
copy (F003).

**Lane C — cross-runtime + hygiene (F004, F005, F007).** Confirm whether Claude should also
wire a skill-advisor `UserPromptSubmit` hook (or Devin a spec-kit one) per `hook_system.md`
(F004); rename `check-comment-hygiene.sh` → `.py` or accept the documented convention
(F005); confirm `settings.local.json` tracking status and prune one-off entries (F007).

## 5. Spec Seed

If a follow-up packet is opened: "mk-code-index single-writer parity & re-election test
hardening." Scope: (a) `childPid`-in-lease + reap-before-respawn for mk-code-index; (b)
fsync the mk-code-index owner-lease reclaim write; (c) a live-secondary-across-reap
adoption test; (d) cross-runtime UserPromptSubmit hook parity decision. Non-goal:
re-architecting the re-election design (it is sound as shipped).

## 6. Plan Seed

1. [F002] Add adoption test case: owner + live secondary, fresh session reaps+respawns,
   assert secondary recovers (covers the reconnecting-proxy rebind path).
2. [F003] Replace/remove `SPEC_KIT_DB_DIR` in the adoption test env.
3. [F001] Record `childPid` in `mk-code-index-launcher.cjs` `writeLeaseFile()`; reap a
   stale-reclaimable orphan in the `staleReclaimable` branch.
4. [F006] fsync the tmp lease in `mk-code-index` `writeOwnerLeaseFile()` before rename.
5. [F004] Decide + align UserPromptSubmit hook targets across `.claude` / `.codex` / `.devin`.
6. [F005][F007] Rename hygiene script / prune local permission entries.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core (hard) | partial | Shipped behavior matches the re-election + reap narrative in `shared-context.md:6-12`; one claim ("a live secondary keeps MCP transport") is plausible but rests on the untested reconnect path (F002). |
| checklist_evidence | core (hard) | N/A | No `checklist.md` (files target, not a spec folder). |
| agent_cross_runtime | overlay | partial | Hook path-portability consistent across runtimes; `UserPromptSubmit` target skill diverges (F004). |
| skill_agent | overlay | N/A | No skill/agent target in scope. |
| feature_catalog_code | overlay | not-run | Catalog/playbook docs out of the 12-file scope. |
| playbook_capability | overlay | not-run | Deferred (docs out of scope). |

No hard-gate failure: `spec_code` partial reflects an unverified-via-test claim, not a
contradiction between spec and code.

## 8. Deferred Items

- Read `context-server.js` UDS-bind path to confirm/deny the F002 stranding risk (out of
  the 12-file scope this pass).
- Confirm F004 hook intent against `references/config/hook_system.md`.
- `feature_catalog_code` / `playbook_capability` overlay protocols (docs out of scope).
- F007 left low-confidence pending the file's git-tracking status.

## 9. Audit Appendix

**Coverage:** 12/12 files read in full; 4/4 dimensions covered in a single iteration.

**Iteration table:**

| Iter | Dimensions | Files | New P0/P1/P2 | Ratio | Verdict |
|------|-----------|-------|--------------|-------|---------|
| 1 | all 4 | 12 | 0 / 0 / 7 | 1.0 | PASS |

**Convergence / replay:** Stop reason = `config.maxIterations=1` reached with all
dimensions covered and zero P0 outstanding. Single-pass; no rolling-average/MAD vote
applies. Replay of the JSONL iteration record reproduces P0=0/P1=0/P2=7 and verdict PASS —
consistent with the `synthesis_complete` event.

**Adversarial self-check:** No P0/P1 findings exist, so no claim-adjudication packets were
required. Two tempting P1 candidates were adversarially traced and downgraded/ruled out:
(1) "secondary SIGTERM tears down the owner's daemon lease" — disproved by the pid/ownerPid
cleanup guards; (2) "fresh-session reap kills the daemon under a live secondary" — resolves
to a by-design recover-via-reconnect, leaving only the test-gap advisory F002.

**Dimension breakdown:** correctness → F001, F006; security → clean; traceability → F004;
maintainability → F002, F003, F005, F007.

**Verdict:** PASS (hasAdvisories=true). Release-readiness: converged.

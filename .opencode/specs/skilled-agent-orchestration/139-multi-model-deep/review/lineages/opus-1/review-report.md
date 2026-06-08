# Review Report — fan-out lineage opus-1 (native opus)

Spec folder: `skilled-agent-orchestration/139-multi-model-deep`
Target type: `files` (12 files) · Dimensions: correctness, security, traceability, maintainability
Iterations: 1 / 1 (maxIterations) · Stop reason: max iterations with full 4-dimension coverage, no P0/P1.

---

## 1. Executive Summary

**Verdict: PASS** (`hasAdvisories: true`).
Active findings: **P0 = 0, P1 = 0, P2 = 5.**

The recent daemon-reliability work — the stale-lease reclaim reap fix (`7c8b221cf3`) and the cross-machine hook portability fixes (`7b082bdcf4`, `3b087a4a25`) — is **correct and shippable**. The reap fix restores the single-writer invariant by reaping the released re-election daemon before respawn, runs under the owner-lease `O_EXCL` mutex, bails safely to a lease-held JSON-RPC error on EPERM rather than risking a second writer, and is **directly proven** by the new `daemon-reelection-adoption-live.vitest.ts` case that asserts exactly one pid holds the SQLite DB open (`lsof`). The hook portability fixes correctly replace hardcoded absolute paths and `/opt/homebrew/bin/node` with `cd "${<RUNTIME>_PROJECT_DIR:-$PWD}"` + PATH `node` across all 9 hook commands in the three runtime configs.

No correctness failure, security vulnerability, or spec contradiction was found. The five findings are all P2 advisories: a silent sibling-launcher divergence, a test-coverage gap, a hook-config consistency nit, tracked-file hygiene, and a script-naming nit. None block release.

Scope: 12 declared files; 10 reviewed in full/near-full, 2 (`launcher-session-proxy.cjs`, `daemon-reelection-release-integration.vitest.ts`) characterized via cross-reference and sibling-test header rather than line-by-line.

---

## 2. Planning Trigger

**Routes to `/create:changelog`** (PASS). No P0/P1 remediation planning is required. The five P2 advisories are optional cleanups; if the maintainer chooses to act on them, F001/F003/F004/F005 are one-touch edits and F002 is a single added test case. F003 carries a conditional upgrade path (see §3) that would change the route to `/speckit:plan` only if Codex's hook schema is confirmed to require `matcher`.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last |
|----|-----|-----|-------|----------|------------|
| F001 | P2 | maintainability | Sibling launcher stale-reclaim divergence is silent (parity/doc gap) | `.opencode/bin/mk-code-index-launcher.cjs:916-918` (cf. `mk-spec-memory-launcher.cjs:1482-1502`) | 1/1 |
| F002 | P2 | traceability | Connected-secondary survival across a fresh-session reap+respawn is untested | `daemon-reelection-adoption-live.vitest.ts:210-243` | 1/1 |
| F003 | P2 | correctness | Codex `UserPromptSubmit` hook group omits `"matcher": ""` present on every other group | `.codex/hooks.json:15-25` (cf. `:5`) | 1/1 |
| F004 | P2 | maintainability | Tracked `settings.local.json` ships machine/session-specific `permissions.allow` entries | `.claude/settings.local.json:17-28` | 1/1 |
| F005 | P2 | maintainability | `check-comment-hygiene.sh` is a Python script with a `.sh` extension | `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:1` | 1/1 |

**F001** — The spec-memory launcher now reaps the recorded `childPid` on stale-reclaim with a detailed WHY comment; the code-index sibling only logs and respawns. This is **correct by design**: code-index does no re-election (no `daemonReelectionEnabled`/`detached`/`unref`/release-on-shutdown), its lease records only `{pid, startedAt}` (no `childPid`), and its child is non-detached and mirror-exits with the launcher — so no released-daemon orphan can exist. Risk is forward-looking only; suggest a one-line comment documenting the deliberate omission so a future detached/re-election change to code-index doesn't silently reintroduce a double-writer.

**F002** — The production race the fix targets composes two behaviors: a connected secondary keeps bridging to a released daemon **while** a fresh session reaps that daemon and respawns. Test case 1 covers secondary survival across owner disposal (no reap); case 2 covers reap→single-writer but with no secondary present. The reconnect across the reap+respawn (which the reconnecting session proxy should absorb) is asserted nowhere.

**F003** — Intra-file asymmetry: `SessionStart` and all sibling-runtime groups carry `"matcher": ""`; the Codex `UserPromptSubmit` group does not. Pre-existing (the portability commit only rewrote the `command`). **Upgrade trigger:** if Codex's hook schema requires `matcher`, this group silently never fires → P1.

**F004** — The portability commit fixed hook `command` paths but left the same TRACKED file carrying one-off allow entries (`/tmp/dr-009`, `/tmp/docs-011`, absolute seed-fixtures path, full one-shot `create.sh` for packet 130), leaking internal paths/packet names to all cloners.

**F005** — Shebang `python3`, body pure Python, extension `.sh`; functionally fine (explicit interpreter) but misrepresents language. Pre-existing, lowest priority.

---

## 4. Remediation Workstreams

All workstreams are **optional** (PASS verdict). Ordered by effort/value:

1. **Hook-config hygiene** (F003, F004) — add `"matcher": ""` to the Codex `UserPromptSubmit` group; prune ephemeral `permissions.allow` entries from the tracked `.claude/settings.local.json`. Both are isolated config edits.
2. **Launcher parity documentation** (F001) — add a one-line comment to the code-index stale-reclaim branch explaining no reap is needed (tethered/non-detached, no `childPid` in lease).
3. **Durability test composition** (F002) — extend `daemon-reelection-adoption-live.vitest.ts` with a case holding a live bridged secondary through a fresh-session reap, asserting post-reconnect `statsOk()`.
4. **Script naming** (F005) — rename `check-comment-hygiene.sh` → `.py`, or document the `.sh`-as-hook convention.

---

## 5. Spec Seed

No spec change is required for the reviewed work to ship. If the advisories are adopted, a minimal spec delta would record:
- Launcher single-writer invariant is **launcher-specific**: spec-memory uses detached re-election + child reap; code-index uses tethered mirror-exit with no `childPid` lease field. Document this contrast so the invariant is not assumed uniform.
- Hook configs across runtimes share a normative shape: every hook group carries `matcher`, every command uses `cd "${<RUNTIME>_PROJECT_DIR:-$PWD}"` + PATH `node`.

---

## 6. Plan Seed

Optional follow-up packet (only if advisories are pursued):
- T1: `.codex/hooks.json` — add `"matcher": ""` to `UserPromptSubmit` (F003). Verify against Codex hook schema first (resolves the P1 upgrade trigger).
- T2: `.claude/settings.local.json` — prune ephemeral allow entries (F004).
- T3: `mk-code-index-launcher.cjs:916` — add parity comment (F001).
- T4: `daemon-reelection-adoption-live.vitest.ts` — add connected-secondary-through-reap case (F002).
- T5: rename `check-comment-hygiene.sh` → `.py` and update its one hook caller (F005).

---

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core (hard) | **pass** | Reap-fix and hook-portability commit claims resolve to shipped code + an asserting durability test (`adoption-live.vitest.ts:210-243`). |
| checklist_evidence | core (hard) | **partial** | Named durability test verified to exist and assert single-writer; packet 028 `checklist.md` not opened (outside lineage scope). |
| feature_catalog_code | overlay (advisory) | **partial** | changelog/RELEASE_NOTES/ENV_REFERENCE reconciliation claimed by commit; not opened this pass. |
| skill_agent | overlay (advisory) | **N/A** | Files target. |
| agent_cross_runtime | overlay (advisory) | **N/A** | Files target. |
| playbook_capability | overlay (advisory) | **N/A** | No playbook in scope. |

Note: `checklist_evidence` is recorded **partial**, not pass — the commit's "18/18 / 11/11" claim is corroborated by the test's existence and its single-writer assertion, but the packet checklist itself was not cross-checked this pass. This does not block the PASS verdict (no active P0/P1 and the hard gate's spec_code arm passed with direct test evidence), but a complete release-readiness sign-off should close it.

---

## 8. Deferred Items

- **F005** (script naming) — lowest-priority advisory; defer unless touching that file.
- **checklist_evidence** completion — open packet 028 `checklist.md` in a follow-up pass.
- **feature_catalog_code** verification — open the reconciled changelog/RELEASE_NOTES/ENV_REFERENCE docs in a follow-up pass.
- **`launcher-session-proxy.cjs` reconnect trace** — needed to confirm/escalate F002.

---

## 9. Audit Appendix

**Coverage matrix**

| Dimension | Covered | Outcome |
|-----------|---------|---------|
| correctness | yes | reap logic sound; F003 (P2) |
| security | yes | no findings; O_EXCL mutex, EPERM bail, socket-dir ownership guards, session-scoped ancestry re-proof all verified |
| traceability | yes | spec_code pass; F002 (P2); checklist_evidence partial |
| maintainability | yes | F001, F004, F005 (P2) |

**Convergence replay** — Single iteration; `newFindingsRatio = 1.00` (5 new P2). Stop driven by `maxIterations = 1` with 4/4 dimension coverage. P0-override not triggered (no P0). Verdict math: 0 active P0 and 0 active P1 → PASS; 5 active P2 → `hasAdvisories = true`. Replay of the JSONL iteration record agrees with the recorded `synthesis_complete` event.

**Claim adjudication** — No new P0/P1 findings this run, so no typed claim-adjudication packets were required; `claimAdjudicationGate` passes trivially.

**Quality gates** — Evidence: every active finding carries `file:line`. Scope: all conclusions stay within the 12 declared files. Coverage: 4/4 dimensions + required core protocols executed (checklist_evidence partial, noted). All gates pass → STOP legal.

**Files read this pass** — `mk-spec-memory-launcher.cjs` (full), `model-server-supervision.cjs` (full), `launcher-ipc-bridge.cjs` (full), `mk-code-index-launcher.cjs` (targeted: lease/launch/shutdown/stale-reclaim), `daemon-reelection-adoption-live.vitest.ts` (full), `session-cleanup.sh` (full), `check-comment-hygiene.sh` (full), `.claude/settings.local.json` (full), `.codex/hooks.json` (full), `.devin/hooks.v1.json` (full); plus the three scoping commit diffs. Partial: `launcher-session-proxy.cjs`, `daemon-reelection-release-integration.vitest.ts`.

---

_Lineage opus-1 complete. Outputs confined to `review/lineages/opus-1/`. Fan-out merge (`fanout-merge.cjs`) applies strongest-restriction across lineages._

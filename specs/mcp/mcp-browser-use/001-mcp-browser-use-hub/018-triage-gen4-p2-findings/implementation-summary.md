---
title: "Implementation Summary"
description: "Each of the 24 generation-4 P2 findings was checked against source: 20 held and 4 were refuted. 18 are fixed, the bdg version pin is kept by decision, and the advisor evidence-cap finding waits on the advisor packet."
trigger_phrases:
  - "triage gen4 p2 findings implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/018-triage-gen4-p2-findings"
    last_updated_at: "2026-11-24T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "Triaged and fixed the generation-4 P2 findings"
    next_safe_action: "Operator decides the advisor lexical-anchor rule; P2 #15 waits on it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-triage-gen4-p2-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-triage-gen4-p2-findings |
| **Completed** | 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every P2 finding of the generation-4 review now has a verdict. The Aside wrapper no longer lets the environment change where the binary comes from. The capture example stops refusing legal folder names. The resolver CLI no longer routes with the wrong argument. The hub and epic docs state what ships.

### Phase 18: triage-gen4-p2-findings

| # | Finding | Verdict | Check and action |
|---|---------|---------|------------------|
| 1 | bdg pinned by version, no digest | Held, accepted | npm refuses to republish a version and checks registry integrity; ADR-002 |
| 2 | Continuity percentages contradict Complete phases | Held, fixed | 001, 002, 006 and 012 continuity set to 100; 005 stays at 95 as Partial |
| 3 | README version 1.1.4.0 vs metadata 1.1.3.0 | Refuted | The README `version` is its own doc version, which the commit hook bumps |
| 4 | `reject` documented as reachable from the CLI | Held, fixed | The CLI passes no constraints; `ROUTER.md` now says a CLI call never returns `reject` |
| 5 | `mcp-code-mode` still in the hub description | Refuted | The sentence says it is not a member; "set up mcp-code-mode for my tools" does not reach the hub |
| 6 | `ROUTER.md` calls itself the single projection | Held, fixed | Now the stage-two projection, beside `hub-router.json` |
| 7 | Core Web Vitals "not advertised to the advisor" | Held, fixed | The advisor ranks the hub second at 0.8669; the prose now says so |
| 8 | `selectionKinds` cannot express a `surfaceBundle` | Held, fixed | Derived from the emitted bundle kinds; today the same list, so the policy is unchanged |
| 9 | `..` guard refuses legal names | Held, fixed | Only `..` path segments are refused |
| 10 | Digest gate documented nowhere | Refuted | 016 documented it in the install guide, READMEs and catalog |
| 11 | Engine fingerprints the live manifest under a test override | Held, fixed | The engine reads the same override root as the resolver |
| 12 | README table links three of five releases | Held, fixed | Every release listed |
| 13 | README table stops at 1.1.1.0 | Held, fixed | Same fix as 12 |
| 14 | README breaks its one-file-per-release rule | Held, fixed | Same fix as 12 |
| 15 | Id-noun anchor starved by the evidence cap | Held, fixed later | Fixed in advisor 2.0.4.0: the id noun's second word is read from the skill's text, not the capped evidence list |
| 16 | Archive source is env-overridable | Held, fixed | The wrapper refuses `ASIDE_CLI_BASE_URL`; ADR-001 |
| 17 | nvm installer piped into bash | Held, fixed | Download, read, then run |
| 18 | Goal cites a report path that moved | Held, fixed | The first review row points at `review-archive/20261124T070727Z-restart/` |
| 19 | Goal BINDING stops at phase 014 | Held, fixed | Rows 015 to 018 added |
| 20 | 006 log cites only the older Chrome DevTools run | Held, fixed | The 2026-11-22 run, 4 PASS and 13 FAIL, added |
| 21 | README promises a files-changed list | Held, fixed | The entry description now matches the entries |
| 22 | Resolver CLI routes without `--hub` | Held, fixed | Prints usage and exits 2 |
| 23 | Root spec says every phase is Complete | Held, fixed | Status names 005 as Partial |
| 24 | Mode READMEs behind their `SKILL.md` | Refuted | README `version` is the doc version, as in 3 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Hub `README.md`, `ROUTER.md`, version files, `changelog/v1.1.5.0.md` | Modified, Created | Findings 4, 6, 7, 12 to 14, 21; release 1.1.5.0 |
| Aside `scripts/install.sh`, `INSTALL-GUIDE.md`, install catalog entry | Modified | Finding 16 |
| Aside `examples/repl-evidence-capture.sh` | Modified | Finding 9 |
| Chrome DevTools `references/troubleshooting.md` | Modified | Finding 17 |
| Hub `registry-compiler.cjs`, engine `resolve.cjs` and `compiled-route.cjs`, archive copies | Modified | Findings 8, 11, 22 |
| Epic `goal.md`, `spec.md`, phase continuity, `006-verification/goal.md` | Modified | Findings 2, 18, 19, 20, 23 |
| Activation manifest, archive copy, reports index, playbook pointer, `p2-triage` replay folder | Modified, Created | Re-mint and replay |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding was read against the current file, because 016 and 017 had already changed several of them. Held findings were fixed at their source and checked by direct runs. The version bump moved the policy hash, so the manifest was re-minted and the 56-row replay run once more.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refuse `ASIDE_CLI_BASE_URL` (ADR-001) | The archive is not verified, so its source must not move |
| Keep the bdg version pin (ADR-002) | npm already ties a version to one tarball |
| Fix doc facts to the measured behavior | The Core Web Vitals routing is in use and the replay passes on it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Two-stage replay, 56 rows | 55 PASS, 1 FAIL (MBU-PB-04); every row the same as the 016 run; policy `8d70ab88` |
| Hub canary harness | exit 0 |
| `compiled-route-guard.cjs --json`, `compiled-route-sync.cjs --check` | 8 fresh; 61 copies match |
| `node --test .skilled/bin/tests/*.test.cjs` | 197 tests, 197 pass |
| `parent-skill-check.cjs .skilled/skills/mcp-browser-use` | OK, 0 warnings |
| Playbook validator, hub and three modes | exit 0 each |
| Wrapper with `ASIDE_CLI_BASE_URL` set | exit 1 before any download |
| Capture guard, five folder names against a stub `aside` | `./tmp/a..b` and `./tmp/ok` pass the guard; three `..` forms refused |
| `validate.sh` on the hub epic, `--strict --recursive` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Aside archive is still unverified.** The vendor publishes no checksum for it.
2. **P2 #15 was fixed after this phase**, in advisor 2.0.4.0 (packet `system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing`).
<!-- /ANCHOR:limitations -->

---

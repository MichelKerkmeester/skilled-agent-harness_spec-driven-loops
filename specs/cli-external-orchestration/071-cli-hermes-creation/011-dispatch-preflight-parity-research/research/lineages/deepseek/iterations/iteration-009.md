---
title: "Iteration 9: Fail-Open Posture — Every Silent Disablement Path"
trigger_phrases: []
---
# Iteration 9: Fail-Open Posture — Every Silent Disablement Path

## Focus
Enumerate the failure paths that silently disable dispatch enforcement (missing skill file, parse failure, unregistered hook, renamed adapter, drift sentinel), say whether the operator would ever notice each one, and propose the cheapest detector for the ones they would not.

## Findings

1. **The fail-open design is deliberate and documented, and it converts every internal error into approval.** `readHardRules` returns `[]` on any read/parse error; `evaluate` skips unknown checks and treats a throwing check as satisfied; every adapter approves on an unparseable payload; the OpenCode plugin and audit core never throw past their boundary. The stated rationale for the availability checks — "the cost of a false refusal is a blocked dispatch while the cost of a false pass is the exec failure the caller would have seen anyway" — does not carry to the dispatch surface: there, a false pass *is* the silent hang or silent wrong result this research targets, and the caller never sees an error to recover from. The posture is defensible; what is missing is detection of the disabled state. [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:60-67,227-239] [SOURCE: .opencode/hooks/dispatch/README.md §7]

2. **Failure-path inventory with operator-noticeability and cheapest detector** (noticeability judged from what surfaces where — stderr, advisory, or nothing):

| # | Path | Mechanism | Operator notices? | Cheapest detector |
|---|---|---------|-------------------|-------------------|
| 1 | SKILL.md missing or `packetPath` renamed | `readHardRules` → `[]` → approve | no | CI: every `DISPATCH_SHAPES.packetPath` resolves to a SKILL.md that parses to ≥1 rule |
| 2 | Frontmatter parse failure (shape drift) | `parseHardRules` → `[]`; existing bijection test passes vacuously on an empty rule list | no | CI: assert parsed rule count > 0 per `cli-*` skill (one line in the existing test) |
| 3 | Unknown check id (typo) | skipped in the hot path; CI guard fails | yes, at CI | exists — `dispatch-rule-checks.test.mjs` declared→known test |
| 4 | Check throws at runtime | `evaluate` catch → satisfied → approve | no | CI: one passing and one violating fixture per check id, asserting both outcomes |
| 5 | Hook not registered (settings.json / hooks.json entry removed) | adapter never runs; nothing to fail open | no | CI: assert each runtime config declares the preflight entry for its event/tool (Claude `PreToolUse`, Codex/Devin `exec`, Cursor `Shell`, Pi extension symlink) |
| 6 | Adapter renamed or moved | command fails: Claude/Codex emit `mkHookDrift` advisories; Cursor entries have per-entry drift fallbacks; Devin's entry is a bare command with no fallback | partial | same registration test; extend the drift-fallback pattern to Devin and assert path existence |
| 7 | Kill switch persisted in `hook-flags.env` (`SYSTEM_DISPATCH_DISABLED`, `CLI_DISPATCH_AUDIT_DISABLED`, master) | `isHookEnabled('dispatch')` false → every dispatch hook no-ops; the file is gitignored and silent | no | session-start advisory listing active kill switches (the file lives per repo, so a doctor line is as good) |
| 8 | Shape registry no-match (realized: codex) | preflight resolves no skill, audit records nothing | no | CI shape-parity fixtures over one documented command per runtime |
| 9 | Pi extension symlink broken | no Pi adapter loads | no | CI: symlink-resolution assertion over `.pi/extensions/` entries |
| 10 | Wiring env gap (Hermes project-plugin opt-in / persona) | guard exists but its loader or input is absent | no | builder env unit assertions + one live lineage proving the plugin section loaded |
| 11 | Compiled dist stale | stale adapter behavior | partial (Cursor session start runs `check-dist-staleness.sh`; OpenCode has a dist-freshness guard) | exists where it applies; dispatch adapters are `.mjs` today, so latent not active |
| 12 | Malformed/non-dispatch payload | approve | n/a | none — correct by design |

3. **Registration drift is real, not hypothetical, because only one runtime is reconciled.** Codex's hooks live in a user-global file outside the repo and are reconciled by `install-codex-hooks.mjs` (with `--check` surfaced at session start by the codex-watchdog). Claude's `.claude/settings.json`, Cursor's `.cursor/hooks.json`, and Devin's `.devin/hooks.v1.json` are versioned in-repo but nothing asserts they still contain the dispatch preflight entry, and Pi's adapters load only through `.pi/extensions/` symlinks that a `find`-based check would catch. [SOURCE: .opencode/hooks/hook-install/README.md §1-2]

4. **The drift fallbacks are good where they exist and absent in exactly one runtime.** Claude's and Codex's entries emit `mkHookDrift` plus an advisory on failure; Cursor's hooks.json wraps every entry with the same pattern; Devin's dispatch entry is a plain `bash -c 'cd … && node …'` with no fallback, so a moved adapter is invisible there. [SOURCE: .claude/settings.json PreToolUse block] [SOURCE: .codex/hooks.json:69] [SOURCE: .devin/hooks.v1.json:72]

5. **The cheapest detector bundle: one CI test plus one session-start line.** The CI test — wiring + fixtures — covers paths 1, 2, 4, 5, 6, 8, 9 with assertions that are all static: DISPATCH_SHAPES paths resolve, each skill parses to ≥1 rule, each check has a pass and a violation fixture, each runtime config declares the preflight entry, and the documented-shape matrix classifies identically across both registries. Path 7 is runtime state, not repo state, so its cheapest detector is one advisory line at session start listing enabled kill switches; path 10 needs the builder unit tests plus one live lineage from iteration 8. Paths 3 and 11 already have detectors; path 12 needs none. Nothing in the bundle changes the fail-open posture — it only converts silent disablement into a loud CI failure or a visible session line. [INFERENCE: synthesis over findings 1-4]

6. **The noticeability test that matters: could the operator distinguish "enforcement disabled" from "enforcement passed"?** For 1, 2, 4, 5, 6, 7, 8, 9, 10 the two states are byte-identical at runtime — approve, exit 0, no output. That is the failure mode the existing availability-check comment describes as acceptable ("the failure the caller would have seen anyway") and exactly wrong for dispatch, where the failure the caller sees is a hung command indistinguishable from a slow model. The detectors above are the cheapest way to keep the posture while restoring the signal. [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:103-109]

## Ruled Out
- Replacing fail-open with fail-closed: a parse bug or a missing file would then block legitimate dispatch, trading a silent failure for a hard one; every repo surface documents fail-open as the posture, and the detectors recover the signal without the trade. [SOURCE: .opencode/hooks/dispatch/README.md §7]
- Adding a runtime self-test that runs checks against fixtures on every dispatch: it multiplies per-call cost to catch static conditions that CI can catch once. [INFERENCE: based on finding 5]

## Dead Ends
- Searching for an existing registration check for Claude/Cursor/Devin/Pi: none found; the hook-install concern reconciles Codex only, and the per-entry drift fallbacks are the only failure signal elsewhere. [SOURCE: .opencode/hooks/hook-install/README.md]

## Edge Cases
- Contradictory evidence: the Cursor session-start already runs several drift checks (`check-git-hooks`, `install-codex-hooks --check`, `check-dist-staleness`), which shows the repo's own pattern for loud drift — the dispatch registrations simply are not in that set. [SOURCE: .cursor/hooks.json sessionStart entries]
- Partial success: noticeability judgments for stderr-only surfaces (a Claude hook failing under `bash -c`) are inferred from the config shape, not observed in a live session; the `mkHookDrift` markers exist precisely because the maintainers found stderr insufficient.
- Missing dependencies: none; every detector is static analysis over checked-in files except the kill-switch advisory and the live lineage proof.

## Sources Consulted
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs
- .opencode/hooks/dispatch/README.md
- .opencode/hooks/shared/hook-flags.cjs
- .opencode/hooks/hook-install/README.md
- .claude/settings.json
- .codex/hooks.json
- .devin/hooks.v1.json
- .cursor/hooks.json
- .pi/extensions/ (symlink listing)
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs

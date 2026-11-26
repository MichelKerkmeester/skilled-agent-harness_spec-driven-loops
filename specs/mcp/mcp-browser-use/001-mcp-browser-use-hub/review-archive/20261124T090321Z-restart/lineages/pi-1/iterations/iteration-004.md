# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `pi-1`), target agent `@deep-review`, resolved route `Resolved route: mode=review target_agent=deep-review`.
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder).
- Dimension: maintainability.
- Operator focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made.
- Focus addressed in this iteration: what the shipped surfaces cost to change — duplicated pin and digest authorities across the Bladebro install/doctor pair, the one registration block the Chrome guide repeats four times, and whether the 014 commit's size is a coherent unit.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:17-27,85-90,166-167`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:14-27,49-74,145-155,231-239`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:303-400,950-960`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md:45-120`
- `.skilled/skills/mcp-browser-use/mode-registry.json`, `.skilled/skills/mcp-browser-use/hub-router.json`
- `.skilled/bin/tests/mcp-installers.test.cjs:40-80`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/{implementation-summary.md,log.md}`
- `git show --name-only ec3ed74ad01` (commit shape only)
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/{install.sh,doctor.sh}`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/{install.sh,doctor.sh,_utils.sh}`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The Bladebro pin and its four digests live twice with nothing checking the pair agrees** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:21-27` -- `PINNED_VERSION`, `DIGEST_DARWIN_ARM64`, `DIGEST_DARWIN_X64`, `DIGEST_LAUNCHER_BIN_JS` and `DIGEST_LAUNCHER_BINARY_CJS` are declared identically in `doctor.sh:21-27` and `install.sh:17-27`, each script carries its own verification helper (`check_digest` versus `verify_digest`), and no test guards agreement: `.skilled/bin/tests/mcp-installers.test.cjs` exercises only the helper-copy parity and the two installers that ship `_utils.sh`, so Bladebro is unmentioned. A pin bump that lands in one file splits the verdicts — the installer uninstalls a good release while the doctor calls a bad one healthy, or the reverse.
   Finding class: `config_precedence`
   Scope proof: both files are inside the review target, and the doctor's own comment at `doctor.sh:26-27` says "Same values as install.sh", so the duplication is intentional rather than accidental.
   Affected surface hints: `scripts/install.sh`, `scripts/doctor.sh`, `mcp-installers.test.cjs`, and the packet's install guide.
   Case: an operator bumps the pin, updates `install.sh`, runs the installer and the doctor in the same session, and gets two different answers about the same installed package.
2. **The Chrome install guide repeats one registration block four times, which is what let one copy drift** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:361` -- The 1,124-line guide carries the same `.utcp_config.json` manual four times (two required instances at lines 354-375, the optional live instance at 387, and a standalone verification snippet at 956), while `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md:45-120` holds the authoritative copy of the same four blocks. This holds independently of iteration 2's pin finding: even with every copy pinned, four copies of one registration contract must be edited together or they diverge, and only one of them is generated from the config.
   Finding class: `doc_code_parity`
   Scope proof: the guide and the snapshot asset are both inside the review target, and the snapshot already records the divergence at line 53.
   Affected surface hints: `INSTALL-GUIDE.md` section 4 and its troubleshooting snippet in section 9, the snapshot asset, and the operator's copy-paste path into `.utcp_config.json`.
   Case: a future pin bump edits the live config and the snapshot, leaving three guide blocks stale, which is exactly the state iteration 2 found.

## Maintainability Checks

| Check | Verdict | Evidence |
|-------|---------|----------|
| One authority per pin | fail | Bladebro's pin and four digests are declared twice (`install.sh:17-27`, `doctor.sh:21-27`) with no agreement test. |
| One authority per registration block | fail | Four copies of the Chrome manual block, one of them authoritative (`INSTALL-GUIDE.md:354-387,956` versus `assets/utcp-chrome-devtools-manuals.md:45-120`). |
| Router vocabulary versus registry aliases | pass | `hub-router.json` `vocabularyClasses` is deliberately a routing vocabulary, not a copy of the registry's `aliases` (bare `aside` is excluded on purpose), and each class names its own reason. |
| Commit as one reviewable unit | pass | `ec3ed74ad01` is 526 files but 459 of them are the packet's own review archive and 60 are the hub's shipped skills; the change is one coherent fix set rather than unrelated churn. |
| Script reachability | pass | Every script under the three `scripts/` folders is referenced by at least two packet docs; only `_utils.sh` has few references because it is sourced rather than invoked. |

## Integration Evidence

- The parity helper landed in 014 is the pattern that would remove finding 1: `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh` is byte-identical to `.skilled/skills/mcp-code-mode/scripts/_utils.sh` and asserted by the parity test, so the Chrome packet has one shared helper while Bladebro keeps two copies of its own constants.
- The doctor's exit contract is explicit and honoured: documented at `doctor.sh:14-17`, accumulated through `status=1` at `doctor.sh:72`, `doctor.sh:149` and `doctor.sh:231`, and returned at `doctor.sh:239`.

## Edge Cases

- The Bladebro duplication is documented in a comment, so it is a cost the authors accepted; the finding is that nothing enforces the pair, not that the comment is wrong.
- `git show` was used read-only to inspect the commit shape; nothing was checked out, committed or reset.
- The 1,124-line guide may be replaced by a pointer to the snapshot asset; that would resolve finding 2 and is named as the downgrade path rather than assumed.

## Ruled Out

- **The 014 commit is an unreviewable blast radius.** Ruled out by the file breakdown: 459 packet files plus 60 hub skill files plus 5 shared files is one fix set, not unrelated churn.
- **The hub router duplicates the registry's alias list.** Ruled out: `vocabularyClasses` serves routing and deliberately omits bare `aside`, with the omission explained in the file.
- **An unreferenced browser script.** Ruled out: every script under the three `scripts/` folders is named by at least two packet docs.

## Next Focus

- Dimension: cross-reference
- Focus area: re-read the landed findings against the goal criteria they touch, close the six required bug classes with a final ledger snapshot, and confirm no finding rests on a superseded file.
- Reason: all four dimensions have been swept; the remaining work is to make the depth ledger complete and to check that the verdict's evidence still holds.
- Rotation status: correctness, security, traceability and maintainability complete; cross-reference next.
- Blocked/productive carry-forward: productive — duplication findings came from reading the two scripts side by side.
- Required evidence: a complete `searchCoverage` snapshot and one disposition row per required bug class.

## Verdict

Review verdict: CONDITIONAL

# Iteration 1 — Doctor Command Routing and Release-Claim Audit

## Focus

Key question 1 (does every `/doctor:*` command route to a `system-skilled-doctor` mode or script that exists, and do the checks it lists run?) and key question 8 (which claims in the v4.0.0.3 Doctor Commands, v4.0.0.8 Install and First Use / Symlink Safety, and v4.0.1.0 Doctor Commands sections are true in code?).

## Actions Taken

1. Read the run config for the session identity (`2026-11-08T19:57:09.370Z`) and listed `.skilled/commands/doctor/`: 17 router Markdown files, `_routes.yaml`, `assets/`, `scripts/`.
2. Read `.skilled/commands/doctor/_routes.yaml` (770 lines) and `system-skilled-doctor/ROUTER.md`. The manifest declares 31 routes across 16 commands, plus a `standalone:` section for `/doctor:update` and `/doctor:env`.
3. Ran the canonical validator `bash .skilled/commands/doctor/scripts/route-validate.sh` (read-only, exit 0): 31 routes validated, 11 informational `WARN: H1` duplicate-flag warnings. D1 (route YAML assets exist), I1 (all route script invocations resolve to existing local scripts), L1 (all 76 invocations are referenced by their workflow YAML) and J1 (target parity across 14 commands) all pass.
4. Read the three release-note sections under audit: v4.0.0.3 lines 138–158, v4.0.0.8 lines 45–101, v4.0.1.0 lines 84–106.
5. Read the command contracts `/doctor:install`, `/doctor:symlink`, `/doctor:runtime-mirrors`, `/doctor:speckit` and grepped `/doctor:update`, then checked each concrete claim against the implementing code: `symlink-manifest.json`, `symlink-engine.cjs`, `archive.sh`, `heal-spec-docs.cjs`, `orchestrator.ts`, `check-agent-mirror-sync.cjs`, `.github/workflows/spec-kit-check.yml`, `README.md`, `INSTALL-SKILLED.md`, `.gitignore`.
6. Confirmed `.dsh` is a composition layer, not a linkable runtime folder, by reading `.dsh/SYNC.md` (line 8: "DeepSeek Harness (`dsh`) reads no project folder by itself"). This ruled out a suspected seven-runtime link gap before it was reported.

## Findings

### F1 — The "First Use" claim names a section and a runtime count the docs do not have

- **Type:** drift
- **Severity:** P2
- **Release:** v4.0.0.8
- **Confidence:** high (0.9)
- **Claim:** "First Use names all seven runtimes and how each one spells `/speckit:complete`." [SOURCE: .skilled/changelog/skilled/v4.0.0.8.md:49]
- **Code:** The README has no "First Use" heading; the equivalent section is "First Task". It names only `/speckit:complete` and then four runtimes: "Codex, Cursor and Pi spell commands with a hyphen, as in `/speckit-complete`. Devin reaches the same workflow through its `/system-spec-kit` skill." [SOURCE: README.md:208] The install guide repeats the same four. [SOURCE: INSTALL-SKILLED.md:65] Claude, OpenCode and dsh get no spelling line, so the note's "all seven" is not what a reader finds.
- **Verify:** `rg -n 'speckit-complete' README.md INSTALL-SKILLED.md` → 1 match in each, naming four runtimes total.

### F2 — `/doctor:speckit` is documented as "search only" but still fronts a documentation check

- **Type:** drift
- **Severity:** P2
- **Release:** v4.0.0.3
- **Confidence:** high (0.95)
- **Claim:** "It now checks spec-kit search only: the trigger index, its lookup and the search recipes." [SOURCE: .skilled/changelog/skilled/v4.0.0.3.md:142]
- **Code:** The route declares a fourth invocation, the citation-drift census, alongside the three search checks. [SOURCE: .skilled/commands/doctor/_routes.yaml:76] The router presents it as an offered diagnostic. [SOURCE: .skilled/commands/doctor/speckit.md:75] Citation drift is a sk-doc documentation check, not a spec-kit search check, so the note and the shipped route disagree about the command's scope.
- **Verify:** `rg -n 'cite-drift-scan' .skilled/commands/doctor/_routes.yaml .skilled/commands/doctor/speckit.md` → one match in each.

### F3 — "Unlink undoes one run exactly" is stronger than the documented behavior

- **Type:** drift
- **Severity:** P2
- **Release:** v4.0.1.0
- **Confidence:** high (0.9)
- **Claim:** "`unlink` undoes one run exactly." [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:94]
- **Code:** The router states that a recorded path whose state no longer matches the record is skipped as `changed since apply`. [SOURCE: .skilled/commands/doctor/symlink.md:92] Unlink is therefore a safe best-effort reversal, not an exact one; a file changed after the link is deliberately left alone.
- **Verify:** `rg -n 'changed since apply' .skilled/commands/doctor/symlink.md` → one match.

### F4 — The green route validator always prints 11 warnings

- **Type:** ux
- **Severity:** P2
- **Release:** v4.0.0.3 (the release that put every doctor script suite on CI)
- **Confidence:** high (1.0, observed)
- **Code:** `route-validate.sh` is a CI assertion whose contract is exit 0 = valid. [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:1] A healthy manifest emits 11 `WARN: H1` lines for duplicate flag names across targets (`--dry-run` in `tune`/`rebuild`, `--root` in `check`/`link`, and so on). The warnings are informational by design, but a passing run never looks clean, which trains operators to skim the one output that is supposed to be authoritative.
- **Verify:** `bash .skilled/commands/doctor/scripts/route-validate.sh 2>&1 | rg -c '^WARN'` → 11; exit code 0.

### F5 — The route validator checks YAML assets only in the `routes` section

- **Type:** extension
- **Severity:** P2
- **Release:** v4.0.0.3
- **Confidence:** high (0.95)
- **Code:** `check_yaml_assets()` iterates `routes` and reports D1 only for those. [SOURCE: .skilled/commands/doctor/scripts/route-validate.py:414] The seven `standalone:` YAML references (`/doctor:update`'s six action assets and `/doctor:env`'s one) and the `mcp_subroutes` assets are never checked for existence. [SOURCE: .skilled/commands/doctor/_routes.yaml:719] All seven exist today, so nothing is broken now; deleting one would leave CI green until the command actually runs.
- **Verify:** `rg -n 'def check_yaml_assets|for route in routes' .skilled/commands/doctor/scripts/route-validate.py` → the function takes `routes` only.

### F6 — The linkable runtime list is duplicated in three places with no cross-check

- **Type:** extension
- **Severity:** P2
- **Release:** v4.0.1.0
- **Confidence:** medium-high (0.85)
- **Code:** `/doctor:install` lists `claude, opencode, codex, cursor, devin, pi` [SOURCE: .skilled/commands/doctor/install.md:37]; `/doctor:symlink` repeats the same six [SOURCE: .skilled/commands/doctor/symlink.md:57]; the engine's manifest defines the same six keys [SOURCE: .skilled/commands/doctor/assets/symlink-manifest.json:5]. Six is correct because `.dsh` reads no project folder by itself and must not be linked. But adding or renaming a linkable runtime needs three synchronized edits, and no validator compares the router lists to the manifest keys.
- **Verify:** `rg -n '"pi"' .skilled/commands/doctor/assets/symlink-manifest.json` → the last of six runtime keys; `rg -n 'opencode,codex,cursor,devin,pi' .skilled/commands/doctor/install.md .skilled/commands/doctor/symlink.md` → both router lists.

### F7 — The symlink engine has no discoverable usage surface

- **Type:** ux
- **Severity:** P2
- **Release:** v4.0.0.8
- **Confidence:** high (1.0, observed)
- **Code:** The router documents four engine targets (`check`, `link`, `unlink`, and the plan/apply pair behind `link`). [SOURCE: .skilled/commands/doctor/symlink.md:49] Running the engine with `--help` prints `ERROR: unknown flag: --help` and exits 2, with no usage line and no pointer to the valid modes. This satisfies the release's "Every Script Refuses Unknown Options" rule, but the refusal path is also the only feedback an operator gets.
- **Verify:** `node .skilled/commands/doctor/scripts/symlink-engine.cjs --help; echo $?` → `ERROR: unknown flag: --help`, exit 2.

## Claims Verified True

| Claim | Release | Evidence |
|-------|---------|----------|
| A moved target given to `/doctor:speckit` points at the command that owns it | v4.0.0.3 | Router rule at [SOURCE: .skilled/commands/doctor/speckit.md:35], wording owned by `doctor-speckit-presentation.txt` |
| Every doctor script has tests that run locally and in CI | v4.0.0.3 | `.github/workflows/spec-kit-check.yml:257` runs `bash .opencode/commands/doctor/scripts/tests/run-all.sh`; the scripts `tests/` folder exists |
| The mirror check exits 3 with NOT CHECKABLE and the pre-commit hook warns and skips | v4.0.0.8 | [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:118] plus hook fixtures at `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:969` |
| Archive and restore refuse a symlinked archive folder, heal refuses a symlinked document | v4.0.0.8 | [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:84], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:649] |
| A linked `upgrade-baseline.json` is reported as `UPGRADE_BASELINE_LINK` | v4.0.0.8 | [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1318] |
| README asks for Node.js 24, the install builds the spec-kit workspace, and the last step sets `skilled.trustRepoHooks` | v4.0.0.8 | [SOURCE: README.md:164], [SOURCE: INSTALL-SKILLED.md:43], [SOURCE: README.md:220] |
| `/doctor:install` prints the steps and writes nothing | v4.0.1.0 | [SOURCE: .skilled/commands/doctor/install.md:10] and the workflow summary at line 75 |
| `/doctor:symlink link` writes only after its own plan digest and a yes | v4.0.1.0 | [SOURCE: .skilled/commands/doctor/symlink.md:37] and lines 88–90 |
| `/doctor:update` records stay in a gitignored folder and `.skilled/release/` is gone | v4.0.1.0 | `.skilled/release` absent; `.skilled/output/` ignored at [SOURCE: .gitignore:62] (exact record path not located this iteration) |

## Questions Answered

- **Q1:** Yes at the wiring level. All 31 routes name an existing owning router (B3), every route YAML asset exists (D1), every route script invocation resolves to an existing local script (I1), all 76 invocations are referenced by their workflow YAML (L1), and targets are in parity across 14 commands (J1). Caveat: this proves the routing graph, not that every check passes when executed; only the validator and the read-only `check` paths were run. The validator's D1 coverage excludes the `standalone:` section (F5).
- **Q8:** The three sections are largely true in code. The exceptions are F1 (First Use / seven runtimes), F2 ("search only" versus the citation-drift census), and F3 ("undoes one run exactly"). The symlink-safety, NOT CHECKABLE, Node-24, build-step, install-writes-nothing and plan-digest claims all hold.

## Questions Remaining

Q2 (install/symlink/overlay end to end), Q3 (runtime-mirror drift and `/doctor:runtime-mirrors` detection), Q4 (sk-git hook behavior with repros), Q5 (CI workflows and `/doctor:ci`), Q6 (AGENTS.md versus REPO RULES and the Devin byte cut), Q7 (agents versus AGENTS.md section 9), Q9 (no-caller / duplicate checks), Q10 (operator and AI-user friction), Q11 (sk-code / sk-doc / canon departures), Q12 (concrete extensions).

## Next Focus

Q2 and Q9. Read the `/doctor:install` → `/doctor:symlink` → `/doctor:overlay` flow end to end and run only `check`/plan modes to find the first failing step; then census the doctor scripts and the 31 routes for entries with no caller or a duplicate sibling, naming what breaks if each is removed.

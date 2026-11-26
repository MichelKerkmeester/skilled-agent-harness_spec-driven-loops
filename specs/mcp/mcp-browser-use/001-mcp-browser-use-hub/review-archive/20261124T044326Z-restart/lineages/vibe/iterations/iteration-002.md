# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `vibe`, session `fanout-vibe-1795299580084-7g6zan`, generation 1, lineageMode `new`)
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: security
- Iteration: 2 of 5 (`stopPolicy: max-iterations`)
- Operator review focus addressed: this iteration reviewed the Bladebro stealth-browser commit (`bcc330cb2b5`) and the mode-relocation commit (`e60f28021d1`) at the trust boundary — the operator-gated install, the supply-chain digest gate, the teardown/rollback runbook, and the two installer scripts that arrived with the moved modes. Decision D5 ("installing Bladebro needs an operator yes; rollback is `npm uninstall -g bladebro` and remove its profile directory") is the standard the runbook is measured against.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` (full)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` (full)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/npm-install.md` (full)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/native-binary-digest.md` (full)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md` (full)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` (sections 1-4)
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh` (grep for network, privilege and destructive operations)
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh` (grep for network, privilege and destructive operations)
- `.skilled/skills/mcp-browser-use/shared/README.md` (full)
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md` (boundary rules, for the `--account` cross-check)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The Bladebro teardown runbook hardcodes one of two data roots, drops the packet's named-session precondition, and cannot verify its own pass criterion** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:46` -- BB-014 states its objective as removing "the data root the doctor reported" (`uninstall-and-data-root.md:15`) and its pass criterion as "PASS if the package and the data root are gone" (`:33`), then runs `rm -rf ~/.local/state/blade` (`:46`) — a hardcoded path. The packet's own rollback rule says the opposite: remove "the data root `bladebro doctor` reported only after confirming no needed named sessions remain" (`references/install-and-verify.md:77`), and the doctor may report either `~/.local/state/blade` or `~/.blade` (`references/install-and-verify.md:48`). Three consequences follow. First, when the doctor reported `~/.blade`, the `rm -rf` deletes nothing and the scenario's own pass criterion is judged against a path that was never the data root. Second, when the doctor did report `~/.local/state/blade`, the command deletes named sessions with no precondition check, which is exactly what `install-and-verify.md:77` forbids. Third, the only verification command is `command -v bladebro || echo absent` (`:47`), which reports on the binary and says nothing about the data root, so the pass criterion at `:33` has no command that tests it. The recorded macOS run skipped this scenario for missing operator approval (`benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md`, BB-014 row), so the defect has not yet been exercised.
   Finding class: unsafe-procedure
   Scope proof: the runbook and the reference it contradicts are both in `reviewScopeFiles`; the contradiction is between two files in the same packet, not against an external standard.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md`, `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md`, `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/manual-testing-playbook.md` (scenario index)
   Case: an operator whose `bladebro doctor` reported `~/.blade` runs BB-014 as written; `rm -rf ~/.local/state/blade` removes nothing, `command -v bladebro` prints `absent`, and the operator records PASS while the real data root and its named sessions are still on disk.

```json
{
  "type": "claim",
  "claim": "BB-014 hardcodes one of two documented data roots, omits the named-session precondition its own reference requires, and has no command that verifies the data root is gone.",
  "evidenceRefs": [
    ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:15",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:33",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:46",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/teardown/uninstall-and-data-root.md:47",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:48",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:77"
  ],
  "counterevidenceSought": "Read the whole BB-014 file and the whole install-and-verify.md: no earlier step in BB-014 reads the doctor output, and no later step checks the data root. Searched the packet for any other teardown path that would supersede BB-014 (rg for 'data root' and 'named sessions' across mcp-bladebro): install-and-verify.md:77 is the only other statement, and it says the opposite. The recorded macOS run marks BB-014 SKIP, so no run contradicts the finding.",
  "alternativeExplanation": "The hardcoded path could be a deliberate simplification for the common macOS case, since install-and-verify.md:48 lists `~/.local/state/blade` first. That explains the choice of path but not the missing named-session precondition, and it does not explain why the pass criterion at :33 has no verifying command.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if BB-014 is documented as a macOS-only convenience scenario whose pass criterion is the binary check alone, with the data-root removal delegated to install-and-verify.md:77."
}
```

### P2 Findings

1. **The supply-chain digest scenario reads a release sidecar that no step obtains** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/native-binary-digest.md:46` -- BB-003's second command is `cat <scratch>/sidecar/bladebro-darwin-arm64.sha256` (`:46`), but the scenario never downloads the sidecar and never defines `<scratch>`. `references/install-and-verify.md:51` has the same gap: it says to verify against "the release `.sha256` sidecar with `shasum -a 256 -c`" without a step that fetches the sidecar or names its path. The gate is still usable because the expected digests are recorded inline (`install-and-verify.md:51`, `native-binary-digest.md:29`), so an operator can compare against the recorded value; the sidecar comparison itself is not reproducible from the runbook.
   Finding class: incomplete-procedure
   Scope proof: both files are in `reviewScopeFiles`; the missing input is named by the scenario's own command list.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/native-binary-digest.md`, `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md`
   Case: an operator who wants the sidecar comparison rather than the recorded digest runs BB-003 as written and gets `cat: <scratch>/sidecar/bladebro-darwin-arm64.sha256: No such file or directory`, with no documented step to obtain the file.

2. **The Aside installer pipes a remote script into bash with no integrity check** -- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:78` -- the script runs `curl -fsSL "$INSTALLER_URL" | bash` (`:78`, URL at `:31` is `https://releases.aside.com/install.sh`) and verifies only the result, never the fetched bytes. The sibling Bladebro packet sets the higher bar for the same class of action: R-SEC-3 requires pinning the exact version and verifying the resolved native package's SHA-256 against the published release sidecars before use, and prefers the standalone prebuilt binary plus digest over npm (`mcp-bladebro/SKILL.md`, R-SEC-3). The Aside script offers no digest or signature path, so the two modes in one hub hold different supply-chain standards for the same operator decision.
   Finding class: hardening-gap
   Scope proof: the script is a new file added in this branch (`git diff --name-status -M main..HEAD` reports `new file mode 100755`), so it is an added file, not a moved one.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/README.md`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/INSTALL-GUIDE.md`
   Case: an operator runs `scripts/install.sh` on a host whose DNS or TLS chain has been subverted; the script executes whatever `releases.aside.com` returns with the operator's privileges and reports success if the resulting binary answers `--version`.

3. **The Chrome DevTools installer suggests running a global npm install under sudo** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:235` -- on a failed `npm install -g "${MCP_PACKAGE}"` (`:230`) the script prints `Try running: sudo npm install -g ${MCP_PACKAGE}` (`:235`). A global npm install under sudo writes root-owned files into the npm prefix and runs package lifecycle scripts as root, which is the privilege-escalation shape the rest of the hub avoids: the Bladebro packet keeps installation an operator stop-for-yes with a pinned version and a digest check, and the Aside script gates on platform and no-ops when a binary already exists.
   Finding class: hardening-gap
   Scope proof: the script is a new file added in this branch (`git diff --name-status -M main..HEAD` reports `new file mode 100755`).
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md`
   Case: an operator hits a permissions error, follows the printed hint, and installs the package as root; every later `bdg` invocation and every package lifecycle script then runs against a root-owned prefix.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Decision D5 ("Installing Bladebro needs an operator yes. Rollback: `npm uninstall -g bladebro` and remove its profile directory") is implemented on the install side: `mcp-bladebro/SKILL.md` NEVER rule 1 forbids install, update and rollback without an operator yes, and `references/install-and-verify.md:3` states "This file never installs anything itself". The rollback half is where the P1 sits: the runbook's `rm -rf` path is hardcoded rather than the doctor-reported profile directory D5 names. |

## Integration Evidence

- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` records a real 14-step macOS arm64 run against Bladebro v4.8.2: 12 PASS, 1 FAIL (BB-012 real-mode reads, `Chrome launch failed: no page target available`), 1 SKIP (BB-014, awaiting operator approval). The install, digest and doctor steps passed, so the operator-yes gate was exercised rather than assumed.
- The same report records that the real-browser probe copied Aside's signed-in profile with `Login Data*`, `Web Data*` and `Affiliation Database*` excluded, leaving only cookies and site storage, and that `profile` mode was never used. That matches R-SEC-1's "operator must select the profile/account before control is handed over".
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:89` and `:142` state the `--account` boundary independently, so the copy of that rule inside Bladebro's R-SEC-1 is redundant rather than the only statement of it.

## Edge Cases

- **Ambiguity: is a manual-testing-playbook scenario "code" for severity purposes.** I treated BB-014 as an executable procedure because its commands are literal shell and its pass criterion is machine-checkable. If the playbook were treated as prose only, the P1 would drop to P2; I kept P1 because the `rm -rf` is a literal command an operator pastes.
- **Contradiction recorded, not resolved:** the hub holds two supply-chain standards for the same operator decision — Bladebro requires a pinned version plus digest verification, Aside pipes a remote installer to bash. Both are documented as intentional in their own packets, so I reported the divergence as P2 hardening rather than as a P1 contradiction.
- **Missing optional evidence:** no recorded run exercises BB-014, so the P1 is a static contradiction between two files rather than an observed failure. I did not convert that absence into a pass.
- **Out-of-scope note:** the two `install.sh` files are new files in this branch, not moved ones, so the review focus's "pure renames are out of scope" exclusion does not apply to them.

## Confirmed-Clean Surfaces

- No secret, token, API key or credential value appears anywhere in the hub outside `benchmark/`; the only matches for credential vocabulary are redaction rules and "no token field" statements.
- `aside mcp` is documented as a client-spawned local stdio process with `env: {}` and no URL, port, token or credential field (`mcp-aside-devtools/mcp-servers/aside-mcp/README.md:26`, `:70`).
- Cookie and credential handling is consistently redaction-first: `mcp-chrome-devtools/references/cdp-patterns.md:197`, `:203`, `:457` and `mcp-chrome-devtools/references/session-management.md:695` all require names-only output and scratch paths outside the repository.
- Bladebro's three safety rules (R-SEC-1, R-SEC-2, R-SEC-3) are quoted verbatim in `mcp-bladebro/SKILL.md` and bind both transports; R-SEC-2 makes a `blocked:` verdict terminal and forbids re-fingerprinting.
- `shared/README.md` is a reserved, non-discoverable folder with no `graph-metadata.json` and no `description.json`, so it adds no advisor identity and no tool surface.

## Ruled Out

- **The `--account` rule appearing inside Bladebro's R-SEC-1.** Ruled out as a gap: `mcp-aside-devtools/SKILL.md:89` and `:142` state the same boundary in the packet that owns it, so the Bladebro copy is redundant, not the only statement.
- **Implicit install on the Bladebro path.** Ruled out: `mcp-bladebro/SKILL.md` NEVER rule 1, `references/install-and-verify.md:3` and the macOS run's operator-approval record all keep installation behind an explicit yes.
- **Secrets exposure in the hub's MCP wiring.** Ruled out by a full-tree scan for key, token, secret, password and bearer patterns: every hit is a redaction rule or an explicit "no credential field" statement.
- **The macOS live run being fabricated or unrecorded.** Ruled out: the report carries per-scenario observed output, a 12/1/1 tally, and an explicit statement that the `$` lines are reconstructed while the output under them is quoted from scratch files.

## Next Focus

- Dimension: traceability
- Focus area: the six child-phase goals (`001-research` through `006-verification`) against the implementation, the parent goal's completion criteria 3 and 7, the advisor routing at both stages (`.skilled/skills/system-skill-advisor/`), and the nested sub-track support in `.skilled/skills/system-spec-kit/` (`runtime/cli/lib/track-roots.mjs`, `runtime/cli/spec/sweep-track-roots.mjs`, `runtime/cli/tests/nested-subtrack.vitest.ts`, `feature-catalog/tooling-and-scripts/sub-track-proposal.md`).
- Reason: the parent goal's criteria 3 and 7 are the two that a file-level review can settle without running the repo's tooling, and the nested sub-track change is the only system-spec-kit edit in the branch that the hub depends on for its `specs/mcp/` placement.
- Rotation status: correctness and security complete; traceability next in the configured order.
- Blocked/productive carry-forward: productive — reading a runbook against the reference it cites found the P1 in one pass; reuse it for goal-versus-implementation claims.
- Required evidence: the exact `rg` result for criterion 3, the `validate.sh` evidence for criterion 7, and the advisor fixture entries that name `mcp-browser-use`.
- Recovery note: not applicable.

Review verdict: CONDITIONAL

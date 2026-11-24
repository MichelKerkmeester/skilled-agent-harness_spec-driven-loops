# Review Iteration 003

## Dispatcher

- **Mode**: review
- **Target**: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- **Dimension**: security
- **Operator review focus**: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- **How this iteration addressed the focus**: it checked decision D5 ("Installing Bladebro needs an operator yes") and the packet's security posture across all three modes' install and session surfaces, plus phase 003's REQ-008 mutation-guard coverage for the moved scripts.
- **Sources read**: `.skilled/skills/mcp-browser-use/mcp-bladebro/{scripts/install.sh,scripts/doctor.sh,references/install-and-verify.md}`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/{scripts/install.sh,references/session-management.md}`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/{scripts/install.sh,references/session-management.md}`, `.skilled/commands/doctor/{assets/mcp-mutation-class-manifest.yaml,scripts/check-mcp-mutation-class.sh}`, `.skilled/scripts/git-hooks/pre-commit`

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:1-80`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:120-185`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:1-60`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:1-80`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/session-management.md:37-98`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:355-385`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/session-management.md:280-290,680-685`
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:1-100`
- `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:140-175`
- `.skilled/scripts/git-hooks/pre-commit:625-650`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The Aside installer executes unverified remote code and is the only installer in the repository that does** -- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:78` -- The wrapper runs `curl -fsSL "$INSTALLER_URL" | bash` against `https://releases.aside.com/install.sh` (`install.sh:9`) with no digest, signature or pinned-content check. Its own header claims it "verifies the result" (`install.sh:4`), but the only verification is `aside --version`, which runs the freshly installed code, so verification happens after execution. The wrapper also honours `ASIDE_CLI_BASE_URL` (`install.sh:32`), so an environment override redirects the install to any host. Its sibling in the same hub pins four SHA-256 digests and uninstalls on a mismatch (`.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:22-30`), and a repository-wide scan of skill installers finds this Aside wrapper as the only `curl | bash` and the Bladebro wrapper as the only digest-pinned one, so no repo convention excuses it.
   Finding class: security
   Scope proof: the installer is a shipped script of a mode inside the declared target's hub, and the mutation-class manifest already declares it `mutating`, so the surface is in scope and already acknowledged as privileged.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh`; `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` Aside row; the Aside install documentation that offers no verified alternative.
   Case: an operator runs the documented Aside install on a machine whose DNS or TLS path is subverted, or where `ASIDE_CLI_BASE_URL` is set by a wrapper script; the shell executes whatever the endpoint returns as the invoking user, before any check can run.

```json
{
  "type": "claim",
  "claim": "The Aside install wrapper pipes an unpinned remote script into bash with no integrity check, and it is the only skill installer in the repository that does so.",
  "evidenceRefs": [
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:9",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:32",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:78",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:22",
    ".skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:61"
  ],
  "counterevidenceSought": "Scanned every skill installer for the same pattern and for digest verification: the Aside wrapper is the only curl-pipe-bash and the Bladebro wrapper the only digest-pinned one, so this is not an accepted repo-wide convention. Searched the Aside references and SKILL.md for a documented digest or signature step and found none. Considered that the endpoint is the vendor's official installer, which lowers likelihood but not the absence of a check.",
  "alternativeExplanation": "The vendor may publish no stable digest, making pinning impractical. That explains the gap but does not close it: fetching to a file, recording and reviewing the digest, or pinning a version through the documented ASIDE_CLI_VERSION override would all give a checkable artifact, and the sibling mode shows the pattern is available.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if the Aside documentation is amended to state that the install is unverified by design and the operator accepts that risk explicitly, or if a digest or signature check is added."
}
```

### P2 Findings

2. **Neither installer enforces the operator-yes gate in code** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:8` -- Decision D5 says installing Bladebro needs an operator yes. Both install wrappers state the rule in a header comment ("Workflows must never call this implicitly", `install.sh:8`; "Workflows must never call this implicitly — installation is always an explicit operator decision", Aside `install.sh:4-5`) and then install on any invocation that is not `-h`/`--help`. Nothing in either script requires a confirmation flag, a terminal prompt or an operator token, so the gate is prose an agent must choose to honour rather than a control the script applies.
   Finding class: security
   Scope proof: both scripts are shipped install surfaces of modes inside the declared target's hub.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh` argument parsing; `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh` argument parsing; the mutation-class manifest rows that declare both `mutating`.
   Case: an agent reads `install-and-verify.md` §3, runs `scripts/install.sh` to "check the install", and installs a global npm package without ever asking the operator, because the script treats a bare invocation as consent.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:66-72` | Phase 003's REQ-008 holds: the mutation guard's `HOOK_PATTERN` (`check-mcp-mutation-class.sh:147-150`) and `DISCOVERY_GLOBS` (`:151-158`) both cover `skills/mcp-browser-use/mcp-*/scripts/*.sh`, and the manifest carries a row for each of the three moved modes with honest mutation classes. |
| `checklist_evidence` | partial | `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:78` | D5's operator-yes gate is documented but not enforced, and the Aside install path has no integrity check, so the packet's security posture is uneven across its three modes. |

## Integration Evidence

- `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` -- the guard the pre-commit hook sends moved MCP scripts to; its pattern and globs both name `mcp-browser-use`.
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` -- the guard's source of truth; rows exist for `mcp-chrome-devtools` (`:45`), `mcp-aside-devtools` (`:61`) and `mcp-bladebro` (`:66`), each with `install_script_mutation_class: mutating` and `doctor_script_mutation_class: read-only`.
- `.skilled/scripts/git-hooks/pre-commit:625-650` -- the skill-authoring gate that runs the parent-skill doctor and the leaf-manifest check for a staged skill root.

## Edge Cases

- **Ambiguity: is the Aside `curl | bash` a finding or an accepted vendor pattern?** Resolved by comparison rather than by assumption: a repository-wide scan shows no other skill installer pipes a remote script into a shell, and the sibling mode in the same hub pins digests, so the pattern is an outlier rather than a convention. Kept at P1.
- **Ambiguity: does the Bladebro `doctor.sh` mutate?** It declares `read-only` and its only write is `trap 'rm -f "$probe_out" "$probe_err"' EXIT` (`doctor.sh:182`), which removes its own temp probe files. Not a finding.
- **Partial success**: the Chrome DevTools installer was read only around its download and messaging paths (`install.sh:355-385`); it performs no remote fetch, so no integrity question arises there. Its session-management reference carries the correct guidance to keep HAR captures and cookie dumps out of the repository (`session-management.md:283,682`).
- **Missing dependency**: no live Aside or Bladebro install was performed, so the findings rest on the shipped scripts and docs rather than on observed install behaviour. Stated so the reader can weigh the evidence.

## Confirmed-Clean Surfaces

- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:22-30` pins four SHA-256 digests (two native binaries, two JS launcher files), refuses a platform with no recorded digest, and runs `npm uninstall -g bladebro` on a mismatch before any installed code runs.
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:33-53` states the operator gate, the digest values, the rollback and the "never runs npm update" rule, and matches the script's four digests.
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/session-management.md:47-50` documents the permission modes and the password boundary: saved password values stay hidden from the agent, and MFA, passkeys, CAPTCHA and vault unlock remain human-only.
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/session-management.md:60` frames unattended runs as best-effort with resumable waiting rather than bypasses, which is the correct posture for a signed-in browser.
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/session-management.md:283,682` tells the reader that HAR files, cookie dumps and saved sessions hold live secrets and must be written outside the repository and deleted.
- A repository-wide scan of the hub for `api_key`, `Bearer `, `password=`, `token=`, `secret=` and private-key markers found no embedded credential; the single hit is a usage comment in `mcp-chrome-devtools/scripts/_utils.sh:738`.

## Ruled Out

- **The mutation-class guard being blind to the moved scripts**: ruled out -- `HOOK_PATTERN` and `DISCOVERY_GLOBS` both name `mcp-browser-use`, and the manifest carries a row for all three modes.
- **The Bladebro installer running package lifecycle scripts**: ruled out -- it installs with `--ignore-scripts` and checks digests before `bladebro --version` first runs installed code.
- **Credentials embedded in the hub's docs or scripts**: ruled out by the secret-pattern scan above.
- **The Aside password boundary being agent-reachable**: ruled out -- `session-management.md:50` states saved password values stay hidden and that MFA, passkeys, CAPTCHA and vault unlock are human-only.

## Next Focus

- **Dimension**: traceability
- **Focus area**: the seven completion criteria in `goal.md` §3 against shipped evidence, and the 14 child phase goals against their own implementation summaries -- in particular whether each phase's stated goal is met by what shipped, and whether the 014 fixes closed the 2026-11-24 findings at their source.
- **Reason**: security is complete for the install and session surfaces. Traceability is the dimension the operator focus names most directly ("every phase's shipped work against its goal criteria"), and it is the largest remaining surface.
- **Rotation status**: correctness and security complete; traceability and maintainability remain.
- **Blocked/productive carry-forward**: productive -- comparing a suspect pattern against its siblings across the repository distinguished an outlier from a convention in one pass.
- **Required evidence**: file:line for each criterion's evidence, and for each phase goal claim that the shipped files do or do not support.

Review verdict: CONDITIONAL

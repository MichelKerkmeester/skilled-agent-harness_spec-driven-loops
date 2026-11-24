# Review Iteration 002 - mcp-browser-use hub

## Dispatcher

- Mode: review (LEAF, single iteration)
- Run: fanout-pi-2-1795511024070-2cuwlj, generation 4, lineageMode new
- Iteration: 2 of 7
- Dimension: security
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration addresses it for the hub's install/doctor goal criterion: an installer is operator-invoked, pinned, and verified, and a doctor is read-only. No advisor surface is touched here.

## Files Reviewed

- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:1-102`
- `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:1-445`
- `.skilled/scripts/git-hooks/pre-commit:199-283,715-742`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:1-138`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh:45-105`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:1-70,93-188`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:170-239`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:1-45,100-250`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/doctor.sh:1-103`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:1-101,226-240,355-390`
- `.utcp_config.json:1-120`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/install/install-and-doctor.md:26-38`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/feature-catalog.md:33,81,95`

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The Chrome DevTools installer pins by version only, so it cannot catch a substituted tarball the way the Bladebro installer can** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:30` -- the installer pins `browser-debugger-cli@0.6.10` (line 30, with the documented reason at 29-31) and then runs `npm install -g "${MCP_PACKAGE}"` at line 233. The only integrity signal is npm's own registry hash for that version; nothing in the packet records or checks the content digest. The sibling Bladebro installer in the same hub does the stronger thing: pinned version at `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:17`, four recorded SHA-256 values at lines 21-27, an `npm install -g --ignore-scripts` at line 152 so no package code runs before verification, and `verify_digest` at lines 96-113 that removes the install on mismatch. The manifest itself claims digest checking only for Bladebro (`mcp-mutation-class-manifest.yaml:70`), so no doc is false; the gap is that two installers in one hub answer the same supply-chain question differently, and the Chrome one is the lower bar.
   - Finding class: supply-chain-hardening
   - Scope proof: both installers and the manifest row are in the pre-bound review scope.
   - Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md`, `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh`
   Case: a registry-side substitution of the `browser-debugger-cli@0.6.10` tarball (registry compromise, mirror, or a self-hosted registry override) installs and runs unverified code, while the same substitution against the Bladebro pin is caught and the install is removed.
   ```json
   {"type":"claim-adjudication","claim":"The Chrome DevTools installer verifies its pinned CLI by version only, with no content digest, unlike the Bladebro installer, so a substituted tarball is not detected.","evidenceRefs":[".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:30",".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:233",".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:17-27",".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:152-166"],"counterevidenceSought":"Checked for a digest constant or verify function in the Chrome script (none), checked INSTALL-GUIDE for a stated pin-and-verify promise (it promises the version pin only), and read the manifest row that claims digest check for Bladebro alone.","alternativeExplanation":"npm refuses to republish an existing version, so the substitution requires compromising the registry or overriding the registry URL; the operator-invoked installer plus a pinned version may be judged sufficient.","finalSeverity":"P2","confidence":0.7,"downgradeTrigger":"P2 while the only attack is registry compromise; would become P1 if the packet's own docs claimed digest verification for the Chrome CLI or if installs could resolve through a configurable registry."}
   ```

## Traceability Checks

No traceability protocol was run in this iteration; security review does not advance `spec_code` or `checklist_evidence`, so none is recorded here rather than recorded as pending.

## Integration Evidence

- `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` (read-only guard, run from the repository root): exit 0, `GUARD PASS`; all 24 manifest-listed scripts answered their declared class, including the three browser packets:
  - `mcp-chrome-devtools/scripts/install.sh` [mutating], `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/doctor.sh` [read-only]
  - `mcp-aside-devtools/scripts/install.sh` [mutating], `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh` [read-only]
  - `mcp-bladebro/scripts/install.sh` [mutating], `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh` [read-only]
- `.skilled/scripts/git-hooks/pre-commit:715-742` wires that guard as a blocking gate, fails closed when the guard is missing (line 730), and triggers on the same path pattern the guard discovers (line 726), so the manifest's "every script the pre-commit hook sends here" contract holds.
- `.skilled/scripts/git-hooks/pre-commit:199-283` (comment-hygiene gate) checks the staged blobs, reads names NUL-separated (line 225-228), fails closed on a missing or non-executable checker (210-217), warns and applies every core rule when the quality config does not validate (line 257), and names the `// hygiene-ok` escape (line 276).
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:9-14,93-102` downloads `https://releases.aside.com/install.sh`, compares SHA-256 against the pinned `INSTALLER_SHA256` at line 14, and runs it only on a match at line 102; the header at 10-11 discloses that the archive the installer fetches is not itself verified.
- `.utcp_config.json:1-120` registers `aside`, `bladebro`, `chrome_devtools_1`, `chrome_devtools_live` and `chrome_devtools_2`; all five are stdio, carry no literal credentials, and the Chrome entries pin `chrome-devtools-mcp@0.26.0`.

## Edge Cases

- The two "read-only" doctors spawn their MCP server (`aside mcp` at `mcp-aside-devtools/scripts/doctor.sh:67`, `bladebro mcp` at `mcp-bladebro/scripts/doctor.sh:190`) and complete a JSON-RPC `initialize` + `tools/list` handshake. The guard's header names a connecting doctor as the historical bug (`.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:7-8`), so this looked like a mislabel. It is not: the packet documents the probe as read-only (`mcp-aside-devtools/feature-catalog/feature-catalog.md:81,95`; `mcp-aside-devtools/feature-catalog/install/install-and-doctor.md:26,38`), the guard's forbidden list is bounded (no `curl`/`npx`/`claude mcp` without a bound, no `rm -rf`, no profile append), and both probes are watchdog-guarded to 15 s. Recorded as a ruled-out direction rather than a finding.
- The probes' watchdog kills the backgrounded pipeline's PID (`.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:194-200`). That PID may be the subshell or the last pipeline element depending on the exec optimization, so the kill does not provably reach an EOF-ignoring server. Not raised: it needs a server that ignores stdin EOF, which contradicts the MCP stdio contract both probes rely on, and it cannot be exercised here (no Aside or Bladebro binary installed).
- `--add-profile` (`mcp-chrome-devtools/scripts/install.sh:16,58,188-208`) appends `export CHROME_PATH=` to the operator's shell profile. It is opt-in behind an explicit flag, and the installer is labeled `mutating`, so this is consent-gated behavior, not a finding.
- The comment-hygiene escape `// hygiene-ok` is a documented per-line exemption (`.skilled/scripts/git-hooks/pre-commit:276`), not a hole.
- No secret literal was found in the hub tree or `.utcp_config.json`; the config indirection `${FIGMA_API_KEY}` reads from `.env` through `load_variables_from` (`utcp_config.json:2-6,70-72`).

## Confirmed-Clean Surfaces

- Bladebro install: platform gate, pin `4.8.2`, `--ignore-scripts`, launcher and native-binary digest checks, removal on mismatch, version assertion after verification.
- Aside install: platform gate, idempotent no-op when `aside` exists, installer digest verified before execution, no `sudo`, no profile write (it prints the PATH line instead).
- Chrome install: pinned CLI (`browser-debugger-cli@0.6.10`), `set -euo pipefail` with `IFS` narrowed, quoted expansion of the package constant, and a `sudo npm install -g` string that is printed as operator guidance rather than executed.
- Mutation-class guard: manifest coverage is complete, discovery and hook pattern are the same regex, a discovered script with no row fails, a null script with a non-`none` class fails, an empty work list is a harness error (exit 2), and the read-only scanner blanks quoted strings and comments before matching so help text cannot trip it.

## Ruled Out

- "The guard cannot see the MCP handshake, so the read-only label is false": ruled out -- the packet classifies the probe as read-only in two catalogs, and the guard's contract forbids unbounded network and mutation, not a bounded local stdio handshake.
- "The hook's comment-hygiene gate trusts the working tree": ruled out -- it copies the staged blobs into a temp mirror and checks those (`.skilled/scripts/git-hooks/pre-commit:224-248`).
- "`.utcp_config.json` carries a token": ruled out -- all five browser manuals are stdio with empty `env`, and the Figma key is an indirection.

## Next Focus

- Dimension: traceability
- Focus area: phases 001-015 -- each `goal.md`/`acceptance-criteria.md` claim against the shipped implementation summary and the code or doc that proves it, with phase 015's follow-up fixes and the advisor 2.0.3.0 id-noun change as named sub-targets.
- Reason: the operator focus is goal-vs-shipped-work per phase, and the two most recent change sets carry the highest drift risk.
- Required evidence: file:line per goal criterion, plus `checklist_evidence` over tasks.md `[x]` rows.
- Rotation status: D1 and D2 covered; D3 next.

Review verdict: PASS

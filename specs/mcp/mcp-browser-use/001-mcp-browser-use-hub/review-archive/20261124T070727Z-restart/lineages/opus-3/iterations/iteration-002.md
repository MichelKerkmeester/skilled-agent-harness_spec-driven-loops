# Iteration 002 — Security

## Dispatcher

- Lineage: opus-3 (fan-out), session `fanout-opus-3-1795495435655-lf6jf3`, generation 1
- Dimension: security
- Operator focus (every phase's shipped work against its goal criteria): this pass checked 004's security goal criterion (R-SEC-1/2/3 present and verbatim to spec section 3) and whether the rest of the shipped hub honours those rules, plus the install/doctor scripts phases 004, 007 and 013 shipped.
- Sources: no `steer.md` present.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md` (R-SEC section, lane rule line 82)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` (lines 50-61, 112-116)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md:44`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh`, `INSTALL-GUIDE.md`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:28`, `SKILL.md:61`, `INSTALL-GUIDE.md`, `references/troubleshooting.md:155-170`, `references/session-management.md:640-660`
- `.utcp_config.json` (bladebro manual)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The Bladebro SKILL.md lane rule endorses `npx -y bladebro mcp`, an implicit unpinned install that R-SEC-3 forbids** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:60` -- The MCP bullet tells an agent to use "`bladebro mcp` (or `npx -y bladebro mcp`) when the binary is unavailable". With no binary, `npx -y` downloads and runs whatever `bladebro` version npm resolves at that moment, with no pin and no SHA-256 check. R-SEC-3, quoted verbatim five lines away in the same file (line 116), says "never install implicitly", pin v4.8.2 and verify the digest before use; line 61 repeats "Never install implicitly". The packet's own `references/mcp-wiring.md:44` concedes the npx launch "is an install under R-SEC-3 and needs an operator yes", but the SKILL.md bullet, which is what an agent acts on, carries no such gate. The text was copied from `004-bladebro-mode/spec.md:82` and `001-research/research/research.md:57`, so the contradiction is in the phase contract too, and 004's goal criterion (R-SEC text present and verbatim) passes while the lane rule beside it breaks the rule's substance.
   Finding class: security-contract-contradiction.
   Scope proof: the only `npx` mentions in the Bladebro packet are SKILL.md:60 (ungated) and mcp-wiring.md:44 (gated); `.utcp_config.json` itself launches the installed `bladebro` binary, so the risk is the documented agent path, not the registered manual.
   Affected surface hints: `mcp-bladebro/SKILL.md` lane rule, `004-bladebro-mode/spec.md:82`, `research.md:57`, Bladebro feature catalog transport leaf.
   Case: an agent on a machine with no `bladebro` binary follows SKILL.md:60 and runs `npx -y bladebro mcp`, executing an unpinned, digest-unverified npm package without an operator yes.

```json
{"type":"security","claim":"SKILL.md:60 directs an ungated npx -y launch when the binary is missing, contradicting R-SEC-3's no-implicit-install, pin and digest rule in the same file","evidenceRefs":[".skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:60",".skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:116",".skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md:44","specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:82"],"counterevidenceSought":"Looked for an operator gate on the npx path in SKILL.md and in the registered UTCP manual: SKILL.md has none on line 60; the UTCP manual uses the installed binary; only mcp-wiring.md gates it","alternativeExplanation":"Authors may read line 61's 'never install implicitly' as covering npx, but line 60 explicitly offers npx as the remedy for a missing binary, so the two lines conflict","finalSeverity":"P1","confidence":0.78,"downgradeTrigger":"Downgrade to P2 if SKILL.md:60 is amended to require the operator yes and the pinned version (npx -y bladebro@4.8.2) or drops the npx alternative"}
```

### P2 Findings

2. **Chrome DevTools installs a moving `browser-debugger-cli@alpha` tag while 013 aligned every doc to bdg 0.6.10** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:28` -- `MCP_PACKAGE="browser-debugger-cli@alpha"`, repeated in `SKILL.md:61`, `INSTALL-GUIDE.md:11,72,101` and as a `sudo npm install -g ...@alpha` option in `references/troubleshooting.md:163`. Phase 013 rewrote the docs against bdg 0.6.10's source (parent spec phase 13 row; 011's port note is also 0.6.10-specific), but the installer still takes whatever `@alpha` points to, so a fresh install can land a version the corrected docs do not describe, and a pre-release is pulled with no version or integrity pin. Bladebro, by contrast, pins and digest-checks.
   Finding class: supply-chain-hardening.
   Scope proof: `rg 'browser-debugger-cli@'` in the Chrome packet prints only `@alpha` forms.
   Affected surface hints: `mcp-chrome-devtools/scripts/install.sh`, `SKILL.md`, `INSTALL-GUIDE.md`, `references/troubleshooting.md`.
   Case: `@alpha` moves to 0.7.x with a changed `dom eval` or `cdp` flag; `install.sh` installs it and the 0.6.10-aligned docs from 011/013 no longer match the binary.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | R-SEC-1, R-SEC-2, R-SEC-3 lines in `mcp-bladebro/SKILL.md:112-116` are byte-identical to `004-bladebro-mode/spec.md` (shell string compare); lane-rule text contradicts R-SEC-3 (finding 1). |

## Integration Evidence

- `.utcp_config.json` `bladebro` manual: stdio, `command: bladebro`, `args: ["mcp"]`, `env: {}` — launches the installed binary, no credential.
- `mcp-bladebro/scripts/install.sh`: macOS-only gate, pin 4.8.2, SHA-256 digests for darwin arm64/x64, uninstall on mismatch, no-op when a binary exists.

## Edge Cases

- `npm install -g` runs package lifecycle scripts before `install.sh` checks the digest; whether bladebro 4.8.2 has a postinstall step cannot be verified offline. Recorded as deferred, not a finding.
- Aside's installer pipes the vendor's official script to bash (`mcp-aside-devtools/scripts/install.sh:78`); it is operator-invoked and documented as such, so treated as accepted vendor practice.

## Confirmed-Clean Surfaces

- No embedded API keys, tokens or passwords in the hub or `.utcp_config.json` (pattern scan exit 1, no match).
- No hub script binds a remote-debugging port or address.
- R-SEC-1/2/3 verbatim parity with the spec.

## Ruled Out

- `eval "$op"` in `mcp-chrome-devtools/references/session-management.md:653`: a doc helper whose operations are caller-supplied literals; no untrusted input path.
- Aside `curl | bash`: official, operator-gated installer.

## Next Focus

- Dimension: traceability
- Focus area: phases 006-013 goal criteria against shipped evidence: playbook recorded runs (`results.csv` vs README tallies), benchmark reports, changelog topology (007), 009 sk-code router row, 010 stale-pointer grep, 011 guide `rg -c`, 012 findings counts, 013 fix coverage.
- Reason: correctness covered 002-005; later phases untested.
- Rotation status: correctness, security done; traceability, maintainability remain.
- Required evidence: rerun each phase's goal command.

Review verdict: CONDITIONAL

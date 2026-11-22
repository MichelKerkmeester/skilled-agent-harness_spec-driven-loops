# Review Iteration 002

## Dispatcher

- Mode: `review`
- Target agent: `deep-review`
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Run: `fanout-vibe-1795298930568-k8qdqy`, generation 1, lineage mode `new`
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: `security`
- Operator review focus: the 8 commits `main..HEAD` that build the browser-use
  parent hub. This iteration addressed the focus by reviewing the Bladebro
  stealth-browser mode — the one new mode the focus names that carries an install
  step, a caller-owned browser attachment and its own security rules — together
  with the Aside mode's account and capture boundaries and the hub's declared
  tool surfaces. Pure renames of moved spec packets were not reviewed.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/aside-cli-reference.md`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/session-management.md`
- `.skilled/skills/mcp-browser-use/mode-registry.json`
- `.skilled/skills/mcp-browser-use/shared/README.md`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs`

## Findings - New

### P0 Findings

None. No auth bypass, credential exposure or destructive data loss was found. The
two supply-chain and consent gaps below are both gated behind an operator
decision, which keeps them below P0.

### P1 Findings

1. **The documented MCP fallback installs an unpinned Bladebro, so the digest verification R-SEC-3 requires cannot apply** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md:61` -- the reference tells an agent that "Without a global install, an MCP client can launch it through npm with `"command": "npx"` and `"args": ["-y", "bladebro", "mcp"]`". That specifier carries no version, so `npx` resolves whatever the registry serves as `latest`. R-SEC-3 in the same packet (`mcp-bladebro/SKILL.md:116`) requires the opposite: "Pin the exact version the packet was authored against (v4.8.2) ... verify the resolved native package's SHA-256 against the published release sidecars (`shasum -a 256 -c`) before use". `install-and-verify.md:47` records the two v4.8.2 macOS digests that verification depends on, and an unpinned `npx` fetch has no digest to check against them. The doc acknowledges the install gate ("that pulls the package at launch, which is an install under R-SEC-3 and needs an operator yes") but not the pin, so an operator who says yes still gets an unverified version.
   Finding class: security
   Scope proof: `mcp-wiring.md` is in the pre-bound review scope and is new in this branch (Bladebro mode commit `bcc330cb2b5`).
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:116`, `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:47`
   Case: an operator approves the MCP lane on a host without a global install; the agent writes the documented `npx -y bladebro mcp` entry, which fetches the current `latest` rather than the pinned v4.8.2, and no SHA-256 check is possible.

   ```json
   {
     "type": "security",
     "claim": "mcp-wiring.md documents an unpinned npx launch for the Bladebro MCP server, which contradicts R-SEC-3's requirement to pin v4.8.2 and verify the resolved native package's SHA-256 against the release sidecars.",
     "evidenceRefs": [
       ".skilled/skills/mcp-browser-use/mcp-bladebro/references/mcp-wiring.md:61",
       ".skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:116",
       ".skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:47"
     ],
     "counterevidenceSought": "Checked whether the npx form pins a version elsewhere in the packet, whether install-and-verify.md offers a digest for an npx-resolved package, and whether R-SEC-3 exempts the MCP lane. None of the three holds: the specifier is bare, the digests are version-specific to v4.8.2, and R-SEC-3 names no lane exemption.",
     "alternativeExplanation": "The npx form may be intended as a last-resort convenience for a host that cannot install globally. That intent does not remove the pin requirement, and a versioned specifier such as bladebro@4.8.2 would satisfy both.",
     "finalSeverity": "P1",
     "confidence": "high",
     "downgradeTrigger": "Downgrade to P2 if the fallback is rewritten to pin bladebro@4.8.2 and to state that the digest check applies, or if R-SEC-3 is amended to exempt the MCP lane explicitly."
   }
   ```

### P2 Findings

2. **`BLADE_LANE=real` selects the real-browser lane from ambient environment state, which cannot satisfy R-SEC-1's per-request operator request** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md:78` -- the configuration table lists `BLADE_LANE=real` as "Select the real-browser lane for this process (an `rb` lane: R-SEC-1 applies)". R-SEC-1 (`mcp-bladebro/SKILL.md:112`) requires that "Any real-browser (`rb`) lane requires an explicit operator request". An exported variable is not a per-request request: once it is set in a shell profile, a CI environment or an MCP server's `env` block, every later invocation runs on the operator's real browser and selected profile without a fresh request. The table asserts that R-SEC-1 applies but does not warn that the variable itself is the bypass.
   Finding class: security
   Scope proof: `cli-reference.md` is in the pre-bound review scope and is new in this branch.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:112`, `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md:88`
   Case: an operator exports `BLADE_LANE=real` once while testing; a later agent task that never asked for a real browser runs against the operator's signed-in profile.

3. **`BLADE_CONSENT=off` is listed as a plain setting with no gate note beside the stealth rules** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md:79` -- the table documents `BLADE_CONSENT` as "`reject` (default), `accept` or `off` for recognized consent dialogs" and gives no warning that `off` disables consent handling entirely. R-SEC-2 (`mcp-browser-use/mcp-bladebro/SKILL.md:114`) makes a `blocked:` verdict terminal and forbids routing around a challenge, so a setting that suppresses consent dialogs sits directly against that rule without being named as consent-sensitive.
   Finding class: security
   Scope proof: `cli-reference.md` is in the pre-bound review scope and is new in this branch.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:114`
   Case: an agent sets `BLADE_CONSENT=off` to stop a dialog interrupting a run, and a consent wall that R-SEC-2 would treat as terminal is dismissed instead.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | partial | The Bladebro packet's own R-SEC-1, R-SEC-2 and R-SEC-3 rules were checked against its four reference files. R-SEC-3 is contradicted by `mcp-wiring.md:61` (finding 1); R-SEC-1 is weakened by `cli-reference.md:78` (finding 2); R-SEC-2 is weakened by `cli-reference.md:79` (finding 3). The Aside packet's `aside-cli-reference.md:95` correctly restates R-SEC-1's `--account` prohibition, so that half of the protocol passes. |

## Integration Evidence

- `.skilled/skills/mcp-browser-use/mode-registry.json` declares `toolSurface` for all three modes with `allowed` = Read/Write/Edit/Bash/Glob/Grep/`mcp__code_mode__call_tool_chain`, `forbidden` = `[]`, `mutatesWorkspace` = `true` and `bashAllowlist` = `[]`. `registry-compiler.cjs:206` reads only `toolSurface.mutatesWorkspace`, so the allow/forbid lists are declarative metadata rather than an enforced gate; the empty `bashAllowlist` follows the documented hub convention (`cli-classifier/.../transport-classification.md:60`: "The shared dispatch engine governs the command, not a per-mode list").
- `registry-compiler.cjs:246` builds one `authorityGraph` edge per destination with `approverDestinationId` equal to `toDestinationId`, so each mode approves only its own commit and no mode can supply authority for another.

## Edge Cases

- **Documentation as the reviewed artifact.** The Bladebro mode ships reference documentation rather than executable code, so the security findings are contract contradictions between the packet's own rules and its own references. Severity is calibrated on the reach of the documented command, not on a runtime branch.
- **Unverified upstream claims.** `install-and-verify.md:15` states "None of it has run on this host", and `mcp-wiring.md:70` states "No callable name for this manual has been observed on this host." Both are honest disclosures, so the unverified digests and the predicted callable name are recorded as disclosed uncertainty rather than as findings.
- **Inherited convention.** `bashAllowlist: []` appears in every hub's `mode-registry.json`, so it is treated as the established convention and not as a browser-hub defect.

## Confirmed-Clean Surfaces

- `aside-cli-reference.md:95` states "`--account` is documented for direct tasks and `exec` only — do not invent `aside mcp --account` or `aside repl --account`", which matches R-SEC-1's prohibition exactly.
- `mcp-aside-devtools/SKILL.md:135` requires captures to stay out of the repository and out of replies, and requires cookie, credential and authorization values to be redacted from every log, transcript, capture, report and reply.
- `mcp-bladebro/SKILL.md:125` keeps cookies, storage reads, named sessions and artifacts out of the repository and out of replies.
- `cli-reference.md:82` states the data root "can hold cookies, session snapshots and page artifacts" and must be kept private.
- `browser-lanes.md:88` gates every `rb` lane behind a five-item consent checklist, and `browser-lanes.md:90` makes a `blocked:` verdict terminal.
- `install-and-verify.md:47` records both v4.8.2 macOS digests and prefers the standalone prebuilt binary plus digest over npm for higher assurance.
- `shared/README.md` is a reserved folder with no discoverable metadata and no per-mode logic, so it adds no trust surface.

## Ruled Out

- **Cross-mode authority escalation.** Every `authorityGraph` edge is self-approving, so no mode can approve another mode's commit. (iteration 2, evidence: `registry-compiler.cjs:246`)
- **Truncated authority refs colliding.** `authorityRef` truncates SHA-256 to 24 hex characters (96 bits), which is ample for three destinations and is additionally guarded by the duplicate-tuple check. (iteration 2, evidence: `registry-compiler.cjs:52`)
- **Tool-surface declarations being silently unenforced.** The registry's own description scopes it to the discriminator and the advisor projection, and `bashAllowlist: []` is the documented hub convention, so the declarative lists are not a broken gate. (iteration 2, evidence: `mode-registry.json:5`)
- **Aside MCP transport carrying credentials.** `mcp-aside-devtools/SKILL.md:95` states the stdio process "has no URL, port, token or credential field" and inherits the logged-in CLI context, so there is no transport credential to leak. (iteration 2)
- **Bladebro clone lane copying credentials without cleanup.** `browser-lanes.md:52` documents `rb forget` to remove the imported copy and `install-and-verify.md:76` documents removing the data root after confirming no needed sessions remain. (iteration 2)

## Next Focus

- Dimension: traceability
- Focus area: `goal.md` completion criteria against the shipped tree, the six child-phase packets (`001-research` through `006-verification`), the `mcp-tooling` six-mode registry, and the manual-testing-playbook scenarios for all three modes
- Reason: security is complete; traceability is the next canonical dimension and the goal's seven completion criteria are the acceptance surface the operator will read
- Rotation status: first pass on traceability
- Blocked/productive carry-forward: the Bladebro reference set was productive for security; do not re-derive the npx pin finding
- Required evidence: file:line for each completion criterion and each playbook scenario's recorded run

Review verdict: CONDITIONAL

# Review Iteration 002

## Dispatcher

- Mode: review, single iteration, LEAF-only (no sub-agent dispatch)
- Lineage: `vibe-1`, sessionId `fanout-vibe-1-1795511024070-2cuwlj`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model deepseek-flash (in-process; the fan-out lineage is its own executor)
- Dimension: security
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration addressed the focus by reading the two phase 015 trust-boundary fixes at their source -- the Aside installer digest pin and the Aside capture example's `..` guard -- and by checking whether the same class of defect survives elsewhere in the hub.
- Sources read this iteration: `steer.md` (absent, so no lead ruling applies), `review-scope-files.txt`, `goal.md`, `015-fix-follow-up-review-findings/goal.md`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh`, `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh`, `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/README.md`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/README.md`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/cli-bdg-lifecycle/install-version.md`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:1-138`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:1-91`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:84-180`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:30-92`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:175-200`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:11-81`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:945-975`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md:53`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/README.md:21`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/README.md:245`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/cli-bdg-lifecycle/install-version.md:18`

## Findings - New

### P0 Findings

None. No exploitable path, auth bypass or destructive data loss was found. The two phase 015 trust-boundary fixes hold at their source.

### P1 Findings

1. **The Node-version troubleshooting fix installs Node 18 while the same block and every other doc require Node 20 or later** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:187` -- The entry's diagnosis line at `:179` reads `# bdg requires Node.js 20.x or higher`, and the solution immediately below runs `nvm install 18` then `nvm use 18`. A reader who follows the fix ends up on a version the same block says is too old, so the reported failure is not resolved. Every other statement of the requirement in the packet says 20 or later: `INSTALL-GUIDE.md:11`, `INSTALL-GUIDE.md:180` ("browser-debugger-cli declares `engines.node >=20.0.0`"), `feature-catalog/cli-bdg-lifecycle/install-version.md:18`, `README.md:245`, `scripts/install.sh:61` and `scripts/README.md:21`.
   - Case: a reader whose `bdg` fails with a Node-version error opens the troubleshooting entry, runs the printed `nvm install 18` and `nvm use 18`, and `bdg` still refuses to start because 18 is below the declared `engines.node >=20.0.0`.
   - Finding class: class-of-bug
   - Scope proof: `rg -n "Node.js 1[0-9]|Node.js 2[0-9]|requires Node" .skilled/skills/mcp-browser-use` returns 20-or-later in seven places and 18 in exactly one -- `troubleshooting.md:187-188`. The defect is confined to that one block, so the fix is a two-line edit rather than a sweep.
   - Affected surface hints: ["troubleshooting.md Node-version entry", "INSTALL-GUIDE.md prerequisite line", "scripts/install.sh prerequisite check"]
   - Claim adjudication:
     ```json
     {"type":"claim","claim":"The troubleshooting entry's fix installs Node 18, which the same entry and every other packet doc say is below the bdg requirement of Node 20 or later, so the fix cannot resolve the failure it addresses.","evidenceRefs":["mcp-chrome-devtools/references/troubleshooting.md:179","mcp-chrome-devtools/references/troubleshooting.md:187","mcp-chrome-devtools/INSTALL-GUIDE.md:180","mcp-chrome-devtools/scripts/install.sh:61"],"counterevidenceSought":"Searched for any packet statement that Node 18 is supported, and for a bdg version whose engines field allows 18. Every packet statement says 20 or later, and install-version.md:18 pins bdg 0.6.10 to Node 20 or later.","alternativeExplanation":"The block may predate the 0.6.10 pin and describe an older bdg release, in which case the fix was correct once and is now stale rather than wrong.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if the operator confirms the entry is intentionally kept for a pre-0.6.10 bdg install, which makes it a scoping note rather than a wrong instruction."}
     ```

### P2 Findings

2. **The Node-version fix pipes a downloaded script straight into bash, the pattern phase 015 removed from the Aside installer** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:186` -- The fix runs `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`. The URL is version-pinned, but the fetched bytes are never compared against a digest before they execute. Phase 015 D2 established the opposite norm for this packet: `mcp-aside-devtools/scripts/install.sh:88-99` downloads to a temp file, compares sha256 against `INSTALLER_SHA256` and runs the script only on a match, and `changelog/v1.1.3.0.md` records that change as a fix.
   - Case: a reader follows the troubleshooting fix and executes whatever `raw.githubusercontent.com` serves for that tag at that moment, with no digest gate, so a compromised or re-tagged upstream runs unreviewed code.
   - Finding class: instance-only
   - Scope proof: `rg -n "curl.*\|.*(bash|sh)" .skilled/skills/mcp-browser-use` excluding changelog and benchmark returns this one site. The Aside installer and both Bladebro scripts already verify digests, so the pattern survives in exactly one place.
   - Affected surface hints: ["troubleshooting.md Node-version entry", "mcp-aside-devtools/scripts/install.sh digest pattern"]

## Traceability Checks

- `spec_code` -- partial. Goal decision D5 ("Installing Bladebro needs an operator yes. Rollback: `npm uninstall -g bladebro` plus its profile directory") holds: `mcp-bladebro/references/install-and-verify.md:30` makes installation an operator stop-for-yes, `:47` pins `bladebro@4.8.2` with `--ignore-scripts`, and `:81` gives the rollback. Phase 015 decision D2 ("The Aside installer runs only a script that matches a pinned sha256") holds at `mcp-aside-devtools/scripts/install.sh:94-98`.
- `checklist_evidence` -- partial. Phase 015 criterion 2's "the Aside capture example rejects `..` paths" is backed by `mcp-aside-devtools/examples/repl-evidence-capture.sh:35-45`, which rejects any `..` occurrence and then requires the `./tmp` prefix. The advisor half of that criterion is deferred to the traceability iteration.

## Integration Evidence

- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:88-99` -- the installer downloads to a `mktemp -d` file, compares `shasum -a 256` against the pinned `INSTALLER_SHA256`, and runs `bash "$installer"` only on a match. The header at `:10-11` states the pin's limit honestly: "The pin covers this script only; the archive it fetches is not verified."
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:96-113` -- `verify_digest` removes the install on a missing file or a mismatch, and `:166-173` checks `bin.js`, `binary.cjs` and the native binary before the first `--version` call at `:176`, so no installed code runs before the digests pass.
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:28-45` -- the guard rejects a single quote or backslash in either argument before splicing them into a single-quoted JavaScript string, then rejects any `..` and requires the `./tmp` prefix, so the `..` climb the phase 015 changelog names is closed.

## Edge Cases

- `mcp-chrome-devtools/INSTALL-GUIDE.md` uses `chrome-devtools-mcp@latest` in six places while `troubleshooting.md:148` pins `browser-debugger-cli@0.6.10`. Read as an unpinned-supply-chain finding, then ruled out: `assets/utcp-chrome-devtools-manuals.md:53` discloses the difference and states that the live registration pins `chrome-devtools-mcp@0.26.0` and "the live config wins". A disclosed generic snippet is not an active finding.
- `mcp-aside-devtools/scripts/install.sh:39-40` documents that the wrapper honours `ASIDE_CLI_BASE_URL`, which can redirect the archive fetch the pin does not cover. Recorded as disclosed rather than a finding: `:10-11` states the pin's scope, and the override is operator-set.
- `mcp-aside-devtools/examples/repl-evidence-capture.sh:65` greps the whole REPL output for `Error`, so a page whose URL contains that word could fail the check. Recorded as a fail-closed robustness note, not a security finding: the check can only reject a good run, never accept a bad one.

## Confirmed-Clean Surfaces

- No packet doc or script instructs an agent to print a cookie value, password or token. Every capture site says names and domains only: `mcp-chrome-devtools/references/cdp-patterns.md:197`, `:458`, `:597`, `mcp-chrome-devtools/references/session-management.md:682`, `mcp-bladebro/manual-testing-playbook/manual-testing-playbook.md:45`.
- `mcp-chrome-devtools/scripts/README.md:13` states that neither setup script touches `.utcp_config.json` or any secret, and the two scripts read that way.
- `mcp-bladebro/references/install-and-verify.md:47` keeps `--ignore-scripts` on the npm install, so no package lifecycle script runs before the digest checks.

## Ruled Out

- "The Aside installer still pipes a download into bash": ruled out, `mcp-aside-devtools/scripts/install.sh:88-99` verifies the digest first.
- "The Aside capture example still accepts `./tmp/../..`": ruled out, `repl-evidence-capture.sh:35-45` rejects any `..` before the prefix check.
- "`chrome-devtools-mcp@latest` is an unpinned supply-chain hole": ruled out as already disclosed at `assets/utcp-chrome-devtools-manuals.md:53`.
- "The Bladebro installer runs installed code before verifying it": ruled out, `mcp-bladebro/scripts/install.sh:166-176` orders the three digest checks before the first `--version`.

## Next Focus

- Dimension: traceability
- Focus area: goal completion criteria 1, 3, 4, 5 and 7 against the shipped files, plus the phase 015 advisor id-noun change and the five probe prompts
- Reason: the security pass closed the two phase 015 trust-boundary fixes; the remaining open question is whether the packet's own completion criteria are actually met by what shipped
- Rotation status: correctness and security pass 1 complete, two dimensions remain
- Blocked/productive carry-forward: productive -- reading a doc claim against the artifact it describes found both iterations' findings, so the same comparison is the right method for the criteria
- Required evidence: file:line or command output for each criterion, and the exact advisor and hub-router surfaces named

Review verdict: CONDITIONAL

# Review Iteration 007

## Dispatcher

- Mode: review, single iteration, LEAF-only (no sub-agent dispatch)
- Lineage: `vibe-1`, sessionId `fanout-vibe-1-1795511024070-2cuwlj`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model deepseek-flash (in-process; the fan-out lineage is its own executor)
- Dimension: cross-reference, convergence pass
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration addressed the focus by re-reading every active finding at its shipped file:line, by testing whether each finding's scope is wider than recorded, and by checking whether the phase 015 supply-chain decision D2 is visible at the point where a reader installs.
- Sources read this iteration: `steer.md` (absent, so no lead ruling applies), `review-scope-files.txt`, `goal.md`, `015-fix-follow-up-review-findings/{goal.md,spec.md}`, `.skilled/skills/mcp-browser-use/README.md`, `.skilled/skills/mcp-browser-use/ROUTER.md`, `.skilled/skills/mcp-browser-use/changelog/`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/{scripts/install.sh,scripts/README.md,scripts/doctor.sh,INSTALL-GUIDE.md,README.md,SKILL.md,feature-catalog/install/install-and-doctor.md,references/troubleshooting.md,mcp-servers/aside-cli/README.md,manual-testing-playbook/recovery-and-failure/missing-binary.md}`, `.skilled/skills/mcp-browser-use/mcp-bladebro/{INSTALL-GUIDE.md,scripts/install.sh,references/install-and-verify.md}`

## Files Reviewed

- `.skilled/skills/mcp-browser-use/README.md:8`
- `.skilled/skills/mcp-browser-use/README.md:64-76`
- `.skilled/skills/mcp-browser-use/changelog/` (five entries listed)
- `.skilled/skills/mcp-browser-use/ROUTER.md:33`
- `.skilled/skills/mcp-browser-use/ROUTER.md:53`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:178-196`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:84-102`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/README.md:21-67`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/install/install-and-doctor.md:24`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/INSTALL-GUIDE.md:21`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:75`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/INSTALL-GUIDE.md:69`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:39`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The Aside installer's digest gate is enforced only by `scripts/install.sh` and documented nowhere, while seventeen documentation sites present the ungated vendor `curl | bash` as the install path** -- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:88` -- The wrapper downloads the vendor installer to a temporary file, compares `shasum -a 256` against a pinned `INSTALLER_SHA256`, and exits 1 on a mismatch before running it. That is phase 015 decision D2 ("The Aside installer runs only a script that matches a pinned sha256") holding at its source. No document in the packet says so: `rg -n "digest|sha256"` across the Aside packet returns only `scripts/install.sh` itself, and `scripts/README.md:55` describes the wrapper as one that "gates on the supported platform, no-ops when an `aside` binary already exists, and verifies the result" without naming the digest. Meanwhile `releases.aside.com/install.sh` appears at seventeen sites across ten files, and `feature-catalog/install/install-and-doctor.md:24` lists the raw vendor command first and the wrapper second: "Install with `curl -fsSL https://releases.aside.com/install.sh | bash` or the packaged wrapper `bash scripts/install.sh`". So the packet's strongest supply-chain control is invisible at the point of install, and the documented first option bypasses it.
   - Case: a reader opens the Aside feature catalog to install the CLI, takes the first option it offers, and runs the vendor `curl | bash`. The packet ships a wrapper that pins the installer's sha256 and would have refused a changed installer, but nothing the reader saw mentions that the wrapper exists for that reason or that the two paths differ in verification strength.
   - Finding class: instance-only
   - Scope proof: the gate is one block in one script and the omission is one sentence in one README row. `rg -n "digest|sha256"` over the Aside packet returns only `scripts/install.sh`, so no doc anywhere states the control; `rg -n "releases.aside.com/install.sh"` returns seventeen sites across ten files, so the ungated path is the one the docs lead with. The Bladebro packet is not affected: its `scripts/install.sh:143` checks Node and its digest ordering was verified in iteration 2.
   - Affected surface hints: `mcp-aside-devtools/scripts/README.md` install.sh row, `mcp-aside-devtools/feature-catalog/install/install-and-doctor.md` install line, `mcp-aside-devtools/INSTALL-GUIDE.md` step 3, `mcp-aside-devtools/README.md` install block, `mcp-aside-devtools/SKILL.md` install guidance

## Traceability Checks

- `spec_code` -- pass. Goal criteria 1 through 6 hold on the shipped files. Criterion 7 (`validate.sh --strict --recursive`) is unverified and cannot be executed inside this lineage, because the write surface bans `validate.sh` and the command writes outside the lineage directory. Recorded as unverified, never as a pass.
- `checklist_evidence` -- pass. Phase 015 criteria 1 and 2 hold as behaviour, verified in iteration 5 by replaying the canary fixture and by running eleven advisor probes. Criterion 3's replay half is the same unexecutable `validate.sh` item.
- Cross-reference re-verification of every active finding at its shipped file:line:
  - `R2-P1-001` (P1) still active at `mcp-chrome-devtools/references/troubleshooting.md:187`: the block's own comment at `:179` says "bdg requires Node.js 20.x or higher" and the fix two lines later runs `nvm install 18` and `nvm use 18`.
  - `R5-P1-001` (P1) still active at `ROUTER.md:53`: `ASIDE_DEVTOOLS` still carries no bare `aside` keyword while `BLADEBRO` carries bare `bladebro`.
  - `R1-P1-001` (P2) still active at `ROUTER.md:33`: the Core Web Vitals claim is unchanged.
  - `R1-P2-001` (P2) still active at `README.md:8`: `version: 1.1.4.0` against `1.1.3.0` in `SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json`, and `changelog/` holds no `v1.1.4.0.md`.
  - `R2-P2-001` (P2) still active at `mcp-chrome-devtools/references/troubleshooting.md:186`: the `curl -o- … | bash` line carries no digest gate and no operator gate.
  - `R4-P2-001` (P2) still active at `README.md:70-72`: the release index lists 1.1.1.0, 1.1.0.0 and 1.0.0.0 while `changelog/` holds five entries.

## Integration Evidence

- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:88-99` -- the digest gate: `actual_sha256="$(shasum -a 256 "$installer" | awk '{print $1}')"` compared against `INSTALLER_SHA256`, with `exit 1` and a "read the new script before bumping" message on mismatch. This is the surface D2 names.
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/install/install-and-doctor.md:24` -- the install line that offers the raw vendor command before the wrapper, which is the surface where the control goes unmentioned.
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/README.md:55` -- the wrapper's own description, which names the platform gate, the no-op and the verification but not the digest.
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:143` -- the Bladebro wrapper's prerequisite check, which is the comparison surface: Bladebro's wrapper states its Node requirement in the script and in `INSTALL-GUIDE.md:69`, so the Aside wrapper's silence about its strongest control is an outlier rather than the packet family's style.

## Edge Cases

- The Node 14 sites are not drift against the Node 20 sites. Seven documents in the Bladebro packet require "Node.js 14 or later" for the npm launcher, and eleven documents in the Chrome packet require "Node.js 20 or higher" for `bdg` 0.6.10. Each packet states its own correct requirement, so `R2-P1-001`'s scope stays exactly one block in the Chrome troubleshooting reference and does not widen to the fleet.
- The Aside packet's raw `curl | bash` sites are operator-gated in prose even where they are not digest-gated in code: `INSTALL-GUIDE.md:21` says "With my confirmation, run:", `SKILL.md:75` says "let the operator decide — never install implicitly", and `scripts/README.md:21` says the script mutates the machine "only when an operator runs it deliberately". So the new P2 is about the missing disclosure of the digest control, not about an ungated install path being recommended without consent.
- `R2-P1-001` and `R2-P2-001` are adjacent lines in one code block, so they are one fix site with two defects rather than two independent workstreams. `R1-P2-001` and `R4-P2-001` are the same README release surface wrong in both directions: it claims a version with no changelog entry and omits the two entries that exist. Both pairs are recorded as merged workstreams in synthesis rather than as new findings.
- Convergence: iterations 6 and 7 both returned no new P1 or P0, and the two active P1s are unchanged since iterations 2 and 5. Discovery has converged; the verdict has not, because an active P1 keeps it at CONDITIONAL.

## Confirmed-Clean Surfaces

- The phase 015 supply-chain decision D2 holds at its source in both packets that ship an installer: the Aside wrapper pins the installer's sha256 at `install.sh:88-99`, and the Bladebro wrapper orders its digest check before execution at `install.sh:166-176`.
- The Aside packet's operator-consent discipline is consistent across every install site checked: `INSTALL-GUIDE.md:21`, `SKILL.md:75`, `scripts/README.md:21` and `scripts/doctor.sh:36` all frame installation as an explicit operator decision.
- The Bladebro packet states its Node requirement in the script, the install guide, the reference table and the feature catalog, so its prerequisite is not a doc-only claim.
- The Chrome packet's Node 20 requirement is stated in eleven places including the script, the install guide, the README and the changelog, so `R2-P1-001` is a single stale block rather than a packet-wide ambiguity.

## Ruled Out

- "The Node 14 and Node 20 requirements contradict each other across the hub": ruled out, they belong to different packets with different launchers, and each is stated consistently inside its own packet.
- "The Aside packet recommends an ungated install without operator consent": ruled out, every install site frames it as an explicit operator decision; the defect is the undisclosed digest control, not the consent gate.
- "The Bladebro installer has the same undisclosed-control gap": ruled out, `INSTALL-GUIDE.md:69` and `references/install-and-verify.md:39` both state the Node prerequisite, and iteration 2 verified the digest ordering.
- "`R2-P1-001` widens to the whole hub": ruled out, the `nvm install 18` pattern appears at exactly two lines, both inside the one Chrome troubleshooting block.
- "`R1-P2-001` and `R4-P2-001` are independent defects": not ruled out as defects, but ruled out as independent workstreams -- both are the README release surface and one edit fixes both.
- "The run has converged to a pass": ruled out, two P1 findings remain active, so the verdict stays CONDITIONAL.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: iteration 7 of 7 is complete, every dimension has been covered at least once and the two that carried the most risk twice, and the last two iterations returned no new P1 or P0
- Rotation status: correctness twice, traceability twice, security once, maintainability once, cross-reference once; rotation complete
- Blocked/productive carry-forward: productive -- the cross-reference pass found the one new P2 of this iteration by comparing a control that exists in code against the docs that never mention it
- Required evidence: none for a further iteration; synthesis needs the six active findings, their merged workstreams, and the unverified criterion 7

Review verdict: CONDITIONAL

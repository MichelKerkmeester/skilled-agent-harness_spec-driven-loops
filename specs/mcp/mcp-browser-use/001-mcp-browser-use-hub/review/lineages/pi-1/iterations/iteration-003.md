# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `pi-1`, generation 1)
- Dimension: security
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration tested phase 015's decision D2 ("The Aside installer runs only a script that matches a pinned sha256") against every surface that tells a caller how to install Aside, not only against the installer it patched.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:1-115`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh:25-42`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:70-80`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/INSTALL-GUIDE.md:15-90`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/README.md:50-60`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/troubleshooting.md:55-70`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/mcp-servers/aside-cli/README.md:20-45`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:1-175`, `scripts/doctor.sh:45-140`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/doctor.sh:60-80`
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:1-75`
- `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh:1-90`
- `.skilled/scripts/git-hooks/pre-commit:715-745`
- `.utcp_config.json:120-270`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The digest-pinned Aside installer is bypassed by every other Aside surface, including the agent instruction** -- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh:36` -- Phase 015 pinned the installer by content (`install.sh:14` `readonly INSTALLER_SHA256`, compared at `:93-99` before `bash "$installer"` at `:103`) and its decision D2 says "The Aside installer runs only a script that matches a pinned sha256" (`015/goal.md:33`). Seven shipped surfaces in the same packet still prescribe the unpinned pipeline instead of the wrapper: `scripts/doctor.sh:36`, `SKILL.md:75`, `INSTALL-GUIDE.md:21`, `:49`, `:83`, `README.md:56`, `references/troubleshooting.md:62`, and `mcp-servers/aside-cli/README.md:25` and `:43`. `SKILL.md:75` is the load-bearing one: it instructs the agent to "report the official install command (`curl -fsSL https://releases.aside.com/install.sh | bash`)" whenever the binary is absent, so the agent path routes around the digest gate by design.
Case: an operator or agent follows `SKILL.md:75` or `doctor.sh:36` when `aside` is missing and executes a script fetched at that moment with no digest comparison; the wrapper at `scripts/install.sh` that would have refused a changed script is never reached. Reach is the documented remedy line itself, which is the surface both a human and an agent act on.
Finding class: `security-remediation-gap`
Scope proof: the pin and its comparison are read in `install.sh`; all nine prescribing lines are located by one `rg` over `.skilled/skills/mcp-browser-use/`; `015/goal.md:33` carries decision D2; `check-mcp-mutation-class.sh:24-42` shows the guard scans for *executed* `curl`/`wget`, so printed guidance is outside its reach and the gate could not have caught this.
Affected surface hints: `.skills/mcp-browser-use/mcp-aside-devtools/SKILL.md`, `INSTALL-GUIDE.md`, `README.md`, `scripts/doctor.sh`, `references/troubleshooting.md`, `mcp-servers/aside-cli/README.md`, and the playbook entries that quote the install step.

```json
{
  "type": "claim",
  "claim": "The phase 015 digest pin is bypassed by the packet's own install guidance, which still prescribes an unpinned curl | bash, and one of those lines is the instruction an agent follows.",
  "evidenceRefs": [
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:14",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:103",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:75",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh:36",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/goal.md:33"
  ],
  "counterevidenceSought": "Checked whether any of the nine lines qualifies the command with the wrapper, a digest, or a 'use scripts/install.sh instead' pointer; none does. Checked whether SKILL.md:75 restricts reporting to a read-only statement the agent never executes; it says report the command to the operator, which is the documented hand-off path. Checked the mutation-class guard and the pre-commit gate for a rule that would fail the commit on printed guidance; the guard matches executed curl/wget only.",
  "alternativeExplanation": "The lines are vendor-documented install instructions, and the wrapper is a repository convenience: an operator following the vendor path is exercising their own trust decision, so nothing is broken.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade to P2 if the Aside packet states that the wrapper is one of several accepted install paths and that the vendor pipeline is the documented default, or if `SKILL.md:75` is amended to name the wrapper first."
}
```

### P2 Findings

None. The remaining security surfaces read clean; see Confirmed-Clean Surfaces.

## Traceability Checks

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | fail | Decision D2 at `015/goal.md:33` says every Aside install runs through the pinned script; the shipped guidance at `SKILL.md:75` and seven sibling surfaces says otherwise. |
| `checklist_evidence` | core | partial | `015/goal.md:43` records the installer fix as Done with "installer digest check" as its evidence. The check exists at `install.sh:93-99`, so the row is accurate about the file it names and silent about the guidance that bypasses it. |
| `playbook_capability` | overlay | partial | The Aside manual-testing playbook's install step and `references/troubleshooting.md:62` both quote the unpinned pipeline as the remedy, so the playbook's stated precondition (a digest-checked install) is not what its own instructions produce. |
| `skill_agent` | overlay | fail | `SKILL.md:75` is the agent-facing contract for a missing binary and it prescribes the unpinned pipeline; an agent obeying it never reaches `scripts/install.sh`. |

## Integration Evidence

- `.skilled/scripts/git-hooks/pre-commit:715-745` runs `check-mcp-mutation-class.sh` only when a matching script or the manifest is staged, and the guard's read-only rule matches executed `curl`/`wget`/`npx` calls (`check-mcp-mutation-class.sh:24-42`); printed guidance is therefore invisible to both, which is why the bypass survived the gate that phase 015 relied on.
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:61-65` lists the Aside installer as `mutating` and its doctor as `read-only`, so the guard's own inventory knows the installer exists and never models the guidance surfaces.
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:148-173` installs with `--ignore-scripts` and verifies the launcher and native digests afterwards, removing the install on a mismatch, with the platform without a recorded digest refused at `:120`; the ordering is documented and the package code cannot run before verification.

## Edge Cases

- **Printed guidance is not execution.** The P1 is about the path a caller is told to take, not about code that runs unaided. It is rated P1 because a shipped instruction is a real caller that produces the failing input, and because the packet's own decision D2 claims the opposite.
- **The vendor script is itself legitimate.** This is not a claim that `releases.aside.com/install.sh` is malicious; it is a claim that the pin the packet decided on is not the path its own surfaces take.
- **Nine lines, one finding.** Grouping them keeps the registry honest: fixing one without the others leaves the bypass, so the finding is the class, and the fix list is the nine surfaces.

## Confirmed-Clean Surfaces

- No hardcoded credentials anywhere in the reviewed configuration and wiring: `.utcp_config.json:130-264` passes every provider key through `${VAR}` interpolation, and `mcp-wiring.md:43` states the Aside server exposes no token or OAuth field.
- The Aside installer itself fails closed: platform gate at `install.sh:62-74`, digest comparison at `:93-99`, `bash "$installer"` only on a match at `:103`, and `trap 'rm -rf "$installer_dir"' EXIT` at `:84` so the fetched script never lingers.
- The Bladebro installer keeps package lifecycle scripts off during install (`--ignore-scripts` at `:151`) and verifies launcher and native digests with removal on mismatch (`:96-173`).
- The Chrome doctor's only network-adjacent call is bounded and local-resolution only: `timeout 5 npx --no-install --prefer-offline` at `mcp-chrome-devtools/scripts/doctor.sh:70`, which satisfies the guard's "npx needs BOTH --no-install and timeout" rule.
- The mutation-class manifest carries a row for all three browser modes (`:45-72`), each with an explicit class, so the guard's fail-closed discovery has no hole in this hub.

## Ruled Out

- **`ASIDE_CLI_BASE_URL` forwarding lets an attacker redirect the download** -- ruled out as a repository finding: the override is documented in the wrapper's usage text (`install.sh:38-41`) as an operator env, and the same comment states the pin covers the script only, so the residual is disclosed rather than silent.
- **The mutation-class guard's trigger regex misses a new mode directory** -- ruled out for this target: all three browser mode directories match `mcp-[a-z-]+` and each has a manifest row, so no reachable miss exists inside the reviewed tree.
- **The prefixed command in `repl-evidence-capture.sh` writes cookies or secrets into the repo** -- ruled out: the Chrome-side guidance write path is `"${TMPDIR:-/tmp}"` under `cdp-patterns.md`, and the example's own output path is the caller-supplied `./tmp` session dir.

## Next Focus

- Dimension: traceability
- Focus area: the phase goals 001-015 against their own completion criteria and `implementation-summary.md` continuity, with the packet-level `goal.md` and `spec.md` claims checked against shipped state
- Reason: nine of fifteen phases have never had their criteria tested in this run, and the operator focus names "every phase's shipped work against its goal criteria" as the deliverable
- Rotation status: security closed; traceability begins
- Blocked/productive carry-forward: productive, goal-criteria-first reads
- Required evidence: `goal.md` completion criteria per phase plus the shipped line each criterion names

Review verdict: CONDITIONAL

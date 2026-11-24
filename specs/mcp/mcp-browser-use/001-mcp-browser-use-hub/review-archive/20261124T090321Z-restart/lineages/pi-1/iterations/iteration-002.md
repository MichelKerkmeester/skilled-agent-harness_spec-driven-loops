# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `pi-1`), target agent `@deep-review`, resolved route `Resolved route: mode=review target_agent=deep-review`.
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder).
- Dimension: security.
- Operator focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made.
- Focus addressed in this iteration: the 014 goal's decision D2 ("no package is installed, fetched or launched to fix a finding") and the phase summary's claim "no browser doc or script fetches a package without an exact version and an operator yes" were tested against every browser packet doc and script that fetches or launches a package.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:60-81,352-392,950-960`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md:25-120`
- `.utcp_config.json:14-100`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:225-250`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:15-30,128-190`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:1-60`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh:25-45`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:1-95`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/examples/attach-read.sh:1-150`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/recovery-and-troubleshooting/sandbox-errors.md:17-23`
- `.skilled/skills/mcp-browser-use/{SKILL.md,mcp-aside-devtools/SKILL.md,mcp-bladebro/SKILL.md}` (trust-boundary rules)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/{goal.md,implementation-summary.md}`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The Chrome DevTools install guide registers an unpinned `chrome-devtools-mcp@latest` fetch** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:361` -- The guide's copy-paste `.utcp_config.json` blocks for `chrome_devtools_1` and `chrome_devtools_2` pass `chrome-devtools-mcp@latest` (`:361`, `:375`), the optional live instance is described with the same tag (`:387`), and the standalone check at `:956` runs `npx chrome-devtools-mcp@latest --version`. The shipped `.utcp_config.json` pins `0.26.0`, so the live state is safe, but the guide is the registration path an operator or an agent follows, and 014's own summary states the opposite invariant: "no browser doc or script fetches a package without an exact version and an operator yes" (`014-fix-deep-review-findings/implementation-summary.md:60`). The packet's snapshot asset even records the drift and defers to the live config (`mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md:53`), which leaves the guide teaching the unsafe form.
   Finding class: `input_boundary`
   Scope proof: the file is inside the review target and inside the phase 014 commit's file set; the three registration blocks and the verify command are the only `@latest` occurrences in the packet outside the changelog and benchmark reports.
   Affected surface hints: `.utcp_config.json` `manual_call_templates`; Code Mode MCP lane for `chrome_devtools_1`, `chrome_devtools_2`, `chrome_devtools_live`; the Hub's own "nothing vendored" claim at `mcp-chrome-devtools/SKILL.md:228`.
   Case: an operator adds the live instance exactly as `INSTALL-GUIDE.md:387` instructs, and every later Code Mode call fetches whatever `@latest` resolves to, with no version and no operator decision at launch.

```json
{
  "type": "security",
  "claim": "The Chrome DevTools install guide instructs the reader to register an unpinned npx launch, so a followed instruction turns every MCP call into an unversioned package fetch, contradicting the phase's stated no-unpinned-fetch invariant.",
  "evidenceRefs": [
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:361",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:387",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:956",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md:53",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/implementation-summary.md:60"
  ],
  "counterevidenceSought": "The live .utcp_config.json pins chrome-devtools-mcp@0.26.0, so nothing unpinned is registered today, and AC-009 only promised to clear browser-debugger-cli@alpha. Cached npx runs do not re-fetch until the tag moves.",
  "alternativeExplanation": "The guide may be treated as a historical generic snippet whose live config wins, which the snapshot asset states; the exposure then needs an operator to copy the block rather than any shipped path to execute it.",
  "finalSeverity": "P1",
  "confidence": 0.8,
  "downgradeTrigger": "Drop to P2 if the guide is reclassified as non-authoritative history and the live .utcp_config.json is named the only registration surface."
}
```

### P2 Findings

1. **The registered Chrome manuals fetch a package on every call without the operator gate the Bladebro rule requires** -- `.utcp_config.json:56` -- The three `chrome_devtools_*` manuals launch `npx chrome-devtools-mcp@0.26.0`, and the hub's Bladebro docs state the governing rule: an npx launch "pulls the package at launch, which counts as an install and needs an operator yes" (`mcp-bladebro/feature-catalog/transport/mcp-code-mode-lane.md:26`). The Chrome lane has no first-launch gate or operator notice, so the same act is gated for one mode and ungated for another. The version pin bounds the blast radius; the inconsistency is the defect.
   Finding class: `input_boundary`
   Scope proof: `.utcp_config.json` is in the review scope and the packet's own Files to Change table; the three manuals are the only browser entries that launch through `npx`.
   Affected surface hints: Code Mode MCP lane; hub safety rules; `.utcp_config.json` manual registration.
   Case: an agent's first Chrome Code Mode call installs the server from the registry with no operator decision, while the same act for Bladebro would be refused by the mode's own rule.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | 014's "no unpinned fetch" claim contradicts `INSTALL-GUIDE.md:361` (P1-001); the Bladebro npx rule and the `--ignore-scripts` installer both hold. |
| `checklist_evidence` | notApplicable this iteration | Checklist rows belong to the traceability iteration. |

## Integration Evidence

- Code Mode MCP lane: `.utcp_config.json:14-100` registers `aside`, `bladebro`, `chrome_devtools_1`, `chrome_devtools_2` and `chrome_devtools_live`; only the Chrome entries use `npx`, and only they lack an operator gate.
- Bladebro gate surface: `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:61` states the operator-yes rule for an npx launch, and the installer honours it by requiring an explicit run (`scripts/install.sh:1-16`).
- Aside install surface: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:1-60` is an operator-invoked wrapper around the vendor's `curl | bash` installer and documents that it is never called implicitly; the doctor only prints the command and exits read-only (`scripts/doctor.sh:36-44`).

## Edge Cases

- A cached `npx` package does not re-fetch, so the exposure depends on cache state and tag movement; the guide instruction is still unpinned by contract.
- The Aside `curl | bash` wrapper is unpinned upstream but is a documented operator-invoked vendor path with no repo-side digest available; it was not raised as a finding because no packet claim promises otherwise.
- `--no-sandbox` appears in the Chrome troubleshooting catalog only with a preference order and a risk table (`.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/recovery-and-troubleshooting/sandbox-errors.md:17-23`); it was not raised.

## Confirmed-Clean Surfaces

- Bladebro installer: `--ignore-scripts`, SHA-256 checks on the JS launcher and the native binary before any installed code runs, and removal on mismatch (`mcp-bladebro/scripts/install.sh:15-30,148-175`).
- Bladebro examples: the URL is validated to `http(s)://` before use (`mcp-bladebro/examples/agent-browser-read.sh:59`), the attach example reads only the eval line and never page text (`examples/attach-read.sh:12`), and the loopback CDP query is bounded by `--max-time 3` (`examples/attach-read.sh:117`).
- Aside evidence example: single quote and backslash are rejected before the values are spliced into one REPL evaluation, and the artifact is verified by PNG magic bytes (`mcp-aside-devtools/examples/repl-evidence-capture.sh:27-41,70-85`).
- Trust-boundary guidance exists for all three modes: page content is named untrusted data (`mcp-aside-devtools/SKILL.md:133`, `mcp-bladebro/SKILL.md:122`) and captures are kept out of the repository with values redacted (`mcp-chrome-devtools/SKILL.md:137`).

## Ruled Out

- **Aside manual cloned into a dual-manual layout without isolation.** Ruled out: the packet documents one manual plus a single-writer rule and a pending isolation test (`mcp-aside-devtools/references/mcp-wiring.md:127`).
- **A browser script executes unvalidated shell input from a page.** Ruled out: the aside example evaluates one REPL string with quote/backslash guards, and the Bladebro attach example parses only its own eval envelope.
- **Bladebro digest verification runs after installed code executes.** Ruled out: `install.sh` defers the first `--version` call until after both launcher and native digests match (`mcp-bladebro/scripts/install.sh:160-180`).

## Next Focus

- Dimension: traceability
- Focus area: `spec_code` and `checklist_evidence` core protocols across the parent goal's seven criteria and phase 014's twenty acceptance rows, plus the `skill_agent` overlay for the three mode packets.
- Reason: security is swept; the run still owes both core traceability protocols before STOP is legal.
- Rotation status: correctness and security complete; traceability next.
- Blocked/productive carry-forward: productive — cross-checking a phase's own claim against the doc it shipped found a real invariant violation.
- Required evidence: a `file:line` for each criterion's evidence, and an explicit `notApplicable` where a protocol does not fit a spec-folder target.

Review verdict: CONDITIONAL

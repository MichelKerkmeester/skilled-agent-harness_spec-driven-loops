# Iteration 003: Security, trust boundaries in the shipped browser surfaces

## Dimension

security (D2). Operator review focus continued: the phase 014 fixes include two installer gates and one refusal rule, so this pass reads those as controls, then the surfaces 014 did not touch but the packet ships: the MCP manuals in `.utcp_config.json`, the mutation-class guard that protects hub scripts, and the Aside example that splices input into a REPL evaluation.

## Sources

- `.utcp_config.json` (`bladebro`, `chrome_devtools_1`, `chrome_devtools_live` manuals)
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`
- `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` (`HOOK_PATTERN`, `DISCOVERY_GLOBS`)
- `.skilled/scripts/git-hooks/pre-commit` (hub script route)
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/agent-task-session.sh`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` (R-SEC-1 to R-SEC-3)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh`, `scripts/doctor.sh`

## Scorecard

- Dimensions covered: security
- Files reviewed: 10 read or grepped
- New findings: P0=0 P1=0 P2=1
- Refined findings: none
- New findings ratio: 1.0 (1 of 1 weighted units is new)

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The live-attach MCP manual is callable with no stated operator gate** -- .utcp_config.json:1 -- `chrome_devtools_live` is registered as a global Code Mode manual that runs `chrome-devtools-mcp@0.26.0 --autoConnect`, which attaches to the Chrome the user already has open and therefore to their signed-in sessions. The hub documents that use as "only for signed-in work that an isolated browser cannot do" (`mcp-chrome-devtools/SKILL.md:86`) and warns about capture hygiene (`:137`), but no rule in the packet makes the attach itself an operator stop-for-yes, while the sibling Bladebro lane does exactly that for its real-browser lanes (`mcp-bladebro/SKILL.md:112`, R-SEC-1) and for every install (`:61`, R-SEC-3). A manual, not a doc, is what a Code Mode caller can actually invoke, so the softer constraint sits one layer below the callable surface.
   Case: an agent asked to check a signed-in page calls `chrome_devtools_live` directly from Code Mode, reads the user's authenticated DOM or cookies, and quotes it into a reply, without ever asking the operator whether that browser session may be read.
   Finding class: instance-only
   Scope proof: `rg -n "chrome_devtools_live" .utcp_config.json .skilled/skills/mcp-browser-use` shows the manual and the two doc mentions only, so the gate would be one doc rule plus one manual note; `chrome_devtools_1` already carries `--isolated=true`, which is the non-attaching sibling and needs no gate.
   Affected surface hints: [".utcp_config.json", "mcp-chrome-devtools SKILL.md", "hub ROUTER.md", "Code Mode callers"]

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | pass | hard | .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:60-78 | The guard manifest names all three hub modes with the right mutation classes, and the pre-commit route matches `mcp-browser-use/`. |
| checklist_evidence | partial | hard | specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:84 | Unchanged from iteration 2: AC-002's stated verification does not hold as written. |
| playbook_capability | pass | advisory | .skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md:1 | BB-015 carries the Chrome 136+ precondition that makes the attach lane refuse rather than silently attach a branded profile. |

Controls read and holding this iteration:

- Mutation-class guard: the manifest covers `mcp-chrome-devtools`, `mcp-aside-devtools` and `mcp-bladebro` with `mutating` installers and `read-only` doctors, and `check-mcp-mutation-class.sh:147-157` both matches the hub path in `HOOK_PATTERN` and discovers it in `DISCOVERY_GLOBS`. `.skilled/scripts/git-hooks/pre-commit:726` routes `skills/mcp-browser-use/mcp-*/scripts/(doctor|install)*.sh` to the guard, so a hub script cannot be committed unchecked.
- Bladebro supply chain: `install.sh:50-53,148-152` installs with `npm install -g --ignore-scripts`, then `verify_digest` checks `bin.js`, `binary.cjs` and the platform binary against recorded digests (`:166-173`) and removes the install on a mismatch. `doctor.sh:26-27,120-124` checks the same digests before executing the binary.
- Bladebro refusal: `SKILL.md:61` refuses an implicit `npx -y` launch and hands the decision to the operator, so the unpinned path is not offered.
- Aside REPL splice: `repl-evidence-capture.sh:28-32` refuses a URL or session dir containing a single quote or backslash before splicing either into the JavaScript string, and `:34-40` confines the session dir to `./tmp`. The injection path is closed, not merely discouraged.
- Aside task prompt: `agent-task-session.sh:52-56` passes the prompt through a bash array with `"$TASK_PROMPT"`, so no shell re-splitting occurs.
- MCP manuals: `bladebro` and `chrome_devtools_1` carry empty `env` and pinned packages (`chrome-devtools-mcp@0.26.0 --isolated=true`), so no credential is embedded in the config and the default Chrome manual does not attach to a live profile.

## Integration Evidence

- `.utcp_config.json` is the callable surface for every Code Mode consumer, which is why the missing gate is reported against the manual rather than against the hub docs alone.
- `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` and `.skilled/scripts/git-hooks/pre-commit` are the two enforcement points for hub script mutations; both name the hub.

## Edge Cases

- The live-attach manual predates 014 and is not one of its findings. It is reported because the review target is the packet, and because 014 hardened the neighbouring lane (Bladebro) with a gate the Chrome lane lacks; the asymmetry is the security observation, not the existence of the feature.
- Severity stays P2: the affected user is the operator, the hub documents the intended scope of use, and no caller was observed misusing the manual. It is a missing gate on a documented capability, not an exploitable defect.

## Ruled Out

- REPL command injection through the Aside example: guarded at the splice, both characters that could break out are refused.
- Shell injection through the Aside task example: bash array, no re-splitting.
- Uncovered hub scripts in the mutation guard: manifest, hook route and discovery globs all name the hub.
- Credential leakage in `.utcp_config.json`: every manual that matters here carries an empty `env` and a pinned package.

## Recommended Next Focus

Maintainability (D4): the packet state and the duplicated routing vocabulary. Root goal log drift is already open as `PI2-I1-P2-001`; check whether `ROUTER.md`'s keyword and weight block still matches `hub-router.json`, and whether the 005 requirements that the parent status declares "not met as written" are tracked anywhere a reader will see them.

Review verdict: CONDITIONAL

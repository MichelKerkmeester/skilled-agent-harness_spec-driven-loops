# Review Iteration 002

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: security
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change
- Lineage: sessionId `fanout-vibe-2-1795511024070-2cuwlj`, generation 1, lineageMode new
- Iteration: 2 of 7

## Files Reviewed

- `.skilled/skills/mcp-browser-use/SKILL.md:62` -- the hub's compiled front-door instruction
- `.skilled/skills/mcp-browser-use/ROUTER.md:103` -- the machine-router callout
- `.skilled/bin/compiled-route.cjs:27` -- argument parsing and the `--prompt-stdin` path
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:14` -- pinned installer digest
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/install/install-and-doctor.md:24` -- install guidance
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/INSTALL-GUIDE.md:72` -- installer env overrides
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:26` -- input guards
- `.skilled/skills/mcp-browser-use/mode-registry.json:1` -- tool-surface declarations
- `.skilled/skills/mcp-browser-use/shared/README.md:1` -- shared surface

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The hub's front-door instruction splices the user task into a double-quoted shell argument** -- `.skilled/skills/mcp-browser-use/SKILL.md:62` -- the hub tells the agent to run `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "<task>"`, and `ROUTER.md:105` repeats the same form. A browser task routinely quotes on-screen text, so a task such as `click the "Sign in" button in chrome devtools` closes the argument early: the shell passes `click the ` as the prompt and `Sign`, `in`, `button` as stray tokens. Verified: that invocation returns `defer` with no targets, while the same text sent through `--prompt-stdin` returns `route` to `mcp-chrome-devtools`. A task containing `$(...)` or a backtick is command-substituted instead. `compiled-route.cjs:43` documents `--prompt-stdin` as the form for a caller routing a user's prompt, precisely because argv is both shell-unsafe and readable by any local user, and neither hub doc mentions it.
   Finding class: security
   Scope proof: both docs are hub-owned and inside the declared review target; the CLI they name is the front door the hub's own completion criterion exercises.
   Affected surface hints: `.skilled/skills/mcp-browser-use/SKILL.md`, `.skilled/skills/mcp-browser-use/ROUTER.md`, `.skilled/bin/compiled-route.cjs`
   Case: a user task that quotes UI text, such as `click the "Sign in" button in chrome devtools`, is truncated at the first inner double quote and routes to `defer` instead of `mcp-chrome-devtools`; a task containing `$(...)` executes that substitution in the caller's shell.

   ```json
   {"type":"claim","claim":"The documented front-door invocation interpolates the user task into a double-quoted shell argument, so a task containing a double quote truncates the prompt and a task containing a command substitution executes it.","evidenceRefs":["SKILL.md:62","ROUTER.md:105","compiled-route.cjs:43","compiled-route.cjs:59","observed: --prompt with inner quotes -> action defer, targets []; --prompt-stdin with the same text -> action route, mcp-chrome-devtools"],"counterevidenceSought":"Checked whether the CLI rejects or repairs a truncated prompt (it does not: the stray tokens are ignored and the short prompt scores no mode), whether the docs mention the stdin form anywhere (they do not: grep for prompt-stdin across SKILL.md, ROUTER.md and README.md returns nothing), and whether the mode packets carry their own safer callout (they carry none).","alternativeExplanation":"The placeholder may be intended as illustrative rather than literal, leaving quoting to the agent. Rejected as a full defence: the CLI ships a dedicated stdin path and documents why argv is wrong for user prompts, so the hub's own front door contradicts the tool it names, and the failure is silent rather than an error.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if the hub docs are amended to name --prompt-stdin for user tasks and the argv form is marked as literal-text-only."}
   ```

2. **The Aside feature catalog still offers the unpinned `curl | bash` install** -- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/install/install-and-doctor.md:24` -- the entry reads "Install with `curl -fsSL https://releases.aside.com/install.sh | bash` or the packaged wrapper `bash scripts/install.sh`". Phase 015 decision D2 states that the Aside installer runs only a script matching a pinned sha256, and `install.sh:14` implements exactly that. The feature catalog presents the unpinned pipe as an equal first option, so an agent that reads the capability reference rather than the wrapper bypasses the pin entirely.
   Finding class: security
   Scope proof: the feature catalog entry and the wrapper are both inside the Aside packet, which is inside the declared review target.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/install/install-and-doctor.md`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/INSTALL-GUIDE.md`
   Case: an agent asked to install the Aside CLI reads the feature catalog, runs the `curl | bash` form, and executes whatever `releases.aside.com` serves at that moment with no digest check, which is the exact path decision D2 was written to close.

   ```json
   {"type":"claim","claim":"The Aside feature catalog documents an unpinned curl-to-bash install as an equal alternative to the digest-pinned wrapper, contradicting phase 015 decision D2.","evidenceRefs":["feature-catalog/install/install-and-doctor.md:24","scripts/install.sh:14","015-fix-follow-up-review-findings/goal.md decision D2"],"counterevidenceSought":"Checked whether the feature catalog marks the curl form as deprecated or vendor-only (it does not), whether INSTALL-GUIDE.md repeats it (it documents only the env overrides), and whether the wrapper is the only packaged path (it is, so the catalog line is the sole bypass).","alternativeExplanation":"The line may be describing the vendor's own documented method for completeness. Rejected as sufficient: it is written as an install instruction with no warning, and the packet's own decision record forbids the unpinned path.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if the catalog line is rewritten to name the pinned wrapper as the only install path and to mark the vendor curl form as reference-only."}
   ```

### P2 Findings

3. **The installer pin covers the script but not the archive, and the archive source is env-overridable** -- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:14` -- the wrapper verifies `INSTALLER_SHA256` before running the downloaded script, and its comment states that "the archive it fetches is not verified". The same wrapper passes `ASIDE_CLI_BASE_URL` through to that script, so the unverified archive's source is environment-controlled. The two facts are each documented but never connected, so a reader infers more assurance from the pin than it provides.
   Finding class: security
   Scope proof: the wrapper and its documented env overrides are both inside the Aside packet.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/INSTALL-GUIDE.md`
   Case: an operator with `ASIDE_CLI_BASE_URL` set to a mirror installs an archive that no digest covers, while the wrapper reports "Installer digest verified" and exits 0.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Decision D2 is implemented in `install.sh:14` but contradicted by `install-catalog` guidance at `install-and-doctor.md:24` (finding 2). |
| `checklist_evidence` | partial | Phase 015's verification table records `node --test .skilled/bin/tests/mcp-installers.test.cjs` at pass 5, fail 0. That suite covers the wrapper, not the catalog line that bypasses it. |
| `skill_agent` | pass | `parent-skill-check.cjs` reports PASS on 3d-canon, which requires every mode to carry `toolSurface`; all three declare `mutatesWorkspace: true` with `forbidden: []`. |
| `agent_cross_runtime` | notApplicable | No agent definition carries hub logic. |
| `feature_catalog_code` | fail | The Aside install feature-catalog entry documents a path the packet's own decision record forbids (finding 2). |
| `playbook_capability` | pending | Deferred to the traceability iteration. |

## Integration Evidence

- `.skilled/bin/compiled-route.cjs` was exercised in both argument forms. `--prompt "click the "Sign in" button in chrome devtools"` returned `{"action":"defer","targets":[]}`. The same text through `--prompt-stdin` returned `{"action":"route","selectionKind":"single","targets":[{"workflowMode":"mcp-chrome-devtools"}]}`.
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh` was read end to end: platform gate, existing-binary no-op, `curl -fsSL` to a `mktemp` file, `shasum -a 256` comparison, `exit 1` on mismatch, then `bash "$installer"`.
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh` rejects `'` and `\` across the URL and session dir, then rejects any `..` substring, then requires the `./tmp` prefix.

## Edge Cases

- The `..` rejection is a substring test, so a legitimate directory such as `./tmp/a..b` is refused. That is over-restrictive rather than unsafe, so it is recorded as a usability note and not a finding.
- The capture example splices the URL into a single-quoted JavaScript string. A newline in the URL would be a JavaScript syntax error rather than an escape, so the failure is closed.
- `bashAllowlist: []` appears on all three modes beside `Bash` in `allowed`. `mcp-tooling`'s workflow modes carry the same shape, so this is the established hub pattern rather than a hub-specific grant.
- The `curl` call has no `--max-time`, so a hung connection blocks the installer indefinitely. That is an availability nit outside the security dimension's blocking set.

## Confirmed-Clean Surfaces

- `install.sh` fails closed on a digest mismatch, on a missing `curl` or `shasum`, and on a non-Darwin platform, and it never runs `aside --update`.
- `repl-evidence-capture.sh` rejects the quote and backslash classes before splicing, and rejects `..` before the prefix test, so neither traversal nor string escape reaches the REPL.
- `mode-registry.json` declares `mutatesWorkspace: true` for all three modes, and `registry-compiler.cjs` derives `effectClass: workspace-mutation-capable` from it, so the compiled policy does not understate the grant.
- `shared/README.md` is the only file under `shared/` and carries no executable surface.

## Ruled Out

- **Shell injection through the capture example's URL.** The guard rejects `'` and `\` across `"$URL$SESSION_DIR"` before either value is spliced, and the splice target is a single-quoted JavaScript string, so no shell metacharacter reaches the shell.
- **Path traversal through the capture example's session dir.** The `*..*` case runs before the `./tmp` prefix case, so a traversal cannot pass the prefix test.
- **Understated mutation posture in the compiled policy.** `mutatesWorkspace` is true on every mode and the compiler maps it to `workspace-mutation-capable`.
- **A second unpinned install path inside the wrapper.** The wrapper downloads to a `mktemp` file and never pipes to a shell.

## Next Focus

- Dimension: traceability
- Focus area: the three mode playbooks and their recorded runs, the phase 006 and 008 goal criteria, and the completion-criteria checklist against shipped evidence
- Reason: security closed the newest trust-boundary code; traceability is the dimension that decides whether each phase's goal criteria are actually met
- Rotation status: correctness and security reviewed, traceability next
- Blocked/productive carry-forward: the feature-catalog scan was productive and should be repeated for the playbook capability protocol
- Required evidence: file:line citations from `.skilled/skills/mcp-browser-use/manual-testing-playbook/` and the phase 006 and 008 goal documents

Review verdict: CONDITIONAL

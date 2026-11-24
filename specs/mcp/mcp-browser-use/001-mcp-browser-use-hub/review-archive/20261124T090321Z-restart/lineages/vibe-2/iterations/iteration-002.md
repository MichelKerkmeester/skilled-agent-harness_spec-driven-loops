# Review Iteration 002

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: security
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- Artifact dir: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe-2`
- Session: `fanout-vibe-2-1795504079797-ay97sx`, generation 1, lineageMode new
- Sources read this iteration: `steer.md` (absent), `deep-review-strategy.md`, `deep-review-findings-registry.json`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md` §2 reach calibration

## How this iteration addressed the operator focus

The focus binds every iteration. This one took the security dimension and pointed it at the two
phase 014 fixes that touch a trust boundary: the Bladebro install gate, which decides whether a
package is fetched and whether its bytes are trusted, and the Aside capture example, which splices
caller-supplied values into a JavaScript evaluation and writes a file. It also read the
compiled-routing policy card and the browser hub's fence state, because the focus names shipped
phase work and those two files are what the compiled front door serves.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:1-200`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:20-145`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:1-95`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:30,232-237`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/doctor.sh:69-76`
- `.skilled/skills/mcp-code-mode/scripts/_utils.sh` vs `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs:1-60`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/fence-state.json:1`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The Aside capture example's session-dir containment guard does not normalize the path, so a traversal that leaves `./tmp` passes a guard whose own message says it must stay under `./tmp`** -- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:33-38` -- the guard is `case "$SESSION_DIR" in ./tmp | ./tmp/*) ;; *) echo "FAIL: session-dir must stay under ./tmp ..." ; exit 1 ;; esac`. A glob prefix test matches any string that starts with `./tmp/`, so `./tmp/../../etc` passes and is then spliced into `fs.mkdir('${SESSION_DIR%/}', { recursive: true })` and `page.screenshot({ path: '$shot_path' })` at `:50`. The guard's printed message names the exact class it fails to reject.
   Finding class: security
   Scope proof: the file is inside the pre-bound scope list and is one of the phase 014 fixes the operator focus names; the guard, the splice sites and the message are all cited at line level.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh`, the Aside manual-testing playbook that invokes it, and any agent that copies the example as a template.
   Case: an agent building a session folder from a task name passes `./tmp/../<task>`; the guard accepts it, `fs.mkdir` creates the parent, and the screenshot lands outside the REPL session folder that the script's header says confines writes.

```json
{
  "type": "security",
  "claim": "The session-dir guard is a prefix glob, not a containment check, so a path that starts with ./tmp/ but resolves outside it passes a guard whose message promises the opposite.",
  "evidenceRefs": [
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:33-38",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:50"
  ],
  "counterevidenceSought": "Checked whether the second layer catches it: the script greps the REPL output for [WARN] and fails, and the header says the REPL confines writes to its session folder and redirects a /tmp path with a [WARN] line. That statement covers a /tmp path, not a .. traversal, so the second layer is not proven to catch this class. Also checked whether the argument is attacker-controlled: it is caller-supplied, and the script is an example other agents copy, so the caller class is real but not adversarial.",
  "alternativeExplanation": "The guard may be intended only as a typo catcher, with the REPL's own confinement as the real boundary. That reading is consistent with the header comment but not with the guard's own failure message, which states a containment promise.",
  "finalSeverity": "P1",
  "confidence": "medium",
  "downgradeTrigger": "Downgrade to P2 if the Aside REPL provably rejects a .. traversal inside its session folder, because the [WARN] grep would then fail the run before the file is written."
}
```

### P2 Findings

2. **The Aside capture example accepts any URL scheme, so a `file://` target is opened and screenshotted as evidence** -- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:24,50` -- `URL="${1:-https://example.com}"` is validated only for a single quote and a backslash at `:28-32`, then spliced into `openTab('$URL')`. Nothing restricts the scheme, so `file:///Users/<name>/.ssh/id_rsa` or a `javascript:` URL is opened in the signed-in browser and captured to a PNG that the script then reports as PASS.
   Finding class: security
   Scope proof: same file and same phase 014 fix as finding 1; the parameter default, the validation case and the splice site are cited at line level.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh`, the Aside playbook's evidence-capture step, and the `repl-evidence-capture` feature catalog entry.
   Case: an agent asked to capture evidence for a local file passes a `file://` URL; the browser reads the file, the screenshot passes the PNG magic-byte gate, and the run reports PASS on evidence the operator never meant to expose.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `014-fix-deep-review-findings/goal.md:60-70` vs the tree | The `npx -y bladebro` criterion holds: every match names an operator yes and `bladebro@4.8.2`; the `browser-debugger-cli@alpha` criterion holds with no match |
| `checklist_evidence` | partial | `install.sh:1-200`, `doctor.sh:20-145` | The Bladebro gate's checklist rows hold; the Aside capture checklist row does not cover path containment or URL scheme |

## Integration Evidence

- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh` and `doctor.sh` carry the same four digests (`DIGEST_DARWIN_ARM64`, `DIGEST_DARWIN_X64`, `DIGEST_LAUNCHER_BIN_JS`, `DIGEST_LAUNCHER_BINARY_CJS`), so the fresh-install path and the existing-install path verify the same three files.
- `diff .skilled/skills/mcp-code-mode/scripts/_utils.sh .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh` printed no difference, which is the phase 014 parity fix.
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:30` pins `browser-debugger-cli@0.6.10`, and `doctor.sh:70` resolves it with `npx --no-install`, so the doctor never fetches.
- `bash -n` on both shell scripts under review printed no syntax error.

## Edge Cases

- **Rollback failure is reported, not verified.** `install.sh:88-92` runs `npm uninstall -g bladebro || err "Uninstall failed; run it by hand"` and then `exit 1`. A failed uninstall therefore leaves an unverified package installed with only a stderr line as the signal. Recorded as an edge case rather than a finding because the wrapper's header promises removal and the exit code does report the failure, so the caller is not misled about the outcome.
- **The existing-install no-op path skips the digest check by design.** `install.sh:132-141` exits 0 when `bladebro` is already on PATH and points the caller at `doctor.sh`. `doctor.sh:121-141` does check the same three files, so the delegation is real and not a gap.
- **The policy card is document-only.** `policy-card.cjs:22-30` stamps `terminal: DOCUMENT_ONLY_UNATTESTED` and `replayPolicyCard` returns `draftStatus: PREPARED_DRAFT`, so a replayed card cannot claim live activation. No finding.
- **Fence state is a single epoch.** `fence-state.json` carries `{"fencingEpoch":1,"schemaVersion":"V1"}` with no per-hub divergence, so there is nothing to compare against a second hub in this lineage.

## Confirmed-Clean Surfaces

- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh`: `--ignore-scripts` on the install, every digest check before the first `--version` call, a platform gate that refuses any platform without a recorded digest, and no `npm update` or `bladebro -u` path.
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh`: verifies the launcher pair only when the resolved launcher is the npm `bin.js`, and skips the launcher check with an explicit info line otherwise.
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/doctor.sh`: `npx --no-install --prefer-offline`, so the doctor cannot fetch a package.
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs`: no live-activation claim, and `parsePolicyCard` throws on a missing payload rather than defaulting.

## Ruled Out

- **The Bladebro install gate runs package code before the digest check.** Ruled out: `--ignore-scripts` is on the install, and the first `--version` call is after all three `verify_digest` calls.
- **The Chrome DevTools install is unpinned.** Ruled out: `MCP_PACKAGE="browser-debugger-cli@0.6.10"` at `install.sh:30`, and `browser-debugger-cli@alpha` has no match in the packet outside changelog and benchmark reports.
- **The installer parity fix is one-sided.** Ruled out: the two `_utils.sh` copies are byte-identical.
- **The compiled policy card can attest live activation.** Ruled out: the card is stamped `DOCUMENT_ONLY_UNATTESTED` and replay returns `PREPARED_DRAFT`.

## Next Focus

- Dimension: traceability
- Focus area: each phase's goal criteria against the tree, the phase 014 finding registry closure, and the playbook capability claims
- Reason: security is covered; traceability is next in risk order and the operator focus is fundamentally a goal-criteria question
- Rotation status: correctness and security complete, traceability not started
- Blocked/productive carry-forward: nothing blocked; the Aside capture example is productive and may be revisited under maintainability
- Required evidence: file:line citations from the pre-bound scope list

Review verdict: CONDITIONAL

# Iteration 002: Security and write-boundary review

## Focus

Security pass over plugin workflows, BRAT release staging, MCP preflight examples, token handling, path construction, and error-to-write transitions.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:538-567`
- `.opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh:13-46,60-86`
- `.opencode/skills/mcp-tooling/mcp-obsidian/examples/README.md:288-299`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/obsidian42-brat/workflows.md:53-79,107-119`
- `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/brat-headless-install.md:46-100,108-121`
- `.opencode/skills/mcp-tooling/mcp-obsidian/assets/brat-data-entry.example.json:1-34`
- `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/doctor.sh:72-95`

## Scorecard

- Dimensions covered: security
- Earlier open findings retained: F001-F003
- Open findings after this iteration: P0=0 P1=5 P2=1
- New findings: P0=0 P1=3 P2=0
- New findings ratio: 0.5
- Credential values printed by the inspected diagnostics/fixture: none observed

## Findings - New

### P1, Required

- **F004**: `mcp-roundtrip.sh` sends `OBSIDIAN_API_KEY` in an Authorization header while unconditionally using `curl -k`, and it accepts `OBSIDIAN_BASE_URL` from the environment. The command is at `.opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh:13-15,36-41`; the skill's security guidance says TLS verification must be deliberate at `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:541,567`. A non-local or misconfigured endpoint can receive the bearer token without certificate verification.

  Claim-adjudication packet:

  ```json
  {
    "findingId": "F004",
    "claim": "The MCP preflight example can transmit the bearer token to an environment-selected endpoint with TLS verification disabled.",
    "evidenceRefs": [
      ".opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh:13-15",
      ".opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh:36-41",
      ".opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:541,567"
    ],
    "counterevidenceSought": "Checked the default endpoint and the surrounding trust guidance; the default is loopback, but BASE_URL is overrideable and the example ignores the verification setting.",
    "alternativeExplanation": "The example is intended only for a local self-signed REST API, so the operator may never set a remote endpoint.",
    "finalSeverity": "P1",
    "confidence": 0.94,
    "downgradeTrigger": "The example restricts the endpoint to trusted loopback or honors an explicit verification setting before sending the token."
  }
  ```

- **F005**: BRAT derives `PLUGIN_ID` from a downloaded release manifest and interpolates it into the vault plugin path after only checking that it is non-empty and not `null`. The flow is at `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/obsidian42-brat/workflows.md:66-76` and is copied into the manual scenario at `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/brat-headless-install.md:64-70`. No safe-ID validation or resolved-path containment check prevents `..` path segments from escaping `.obsidian/plugins/`.

  Claim-adjudication packet:

  ```json
  {
    "findingId": "F005",
    "claim": "Untrusted manifest.id data can influence a write path outside the intended plugin directory.",
    "evidenceRefs": [
      ".opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/obsidian42-brat/workflows.md:66-76",
      ".opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/brat-headless-install.md:64-70"
    ],
    "counterevidenceSought": "Checked quoting, manifest presence/version checks, and the troubleshooting contract; quoting prevents shell splitting but does not prevent path traversal.",
    "alternativeExplanation": "Official Obsidian plugin manifests normally use a simple identifier, so the risk requires a malicious or compromised release.",
    "finalSeverity": "P1",
    "confidence": 0.91,
    "downgradeTrigger": "Validate the manifest ID against the accepted plugin-ID grammar and assert the resolved destination remains below the selected vault plugin root."
  }
  ```

- **F006**: The documented Code Mode round-trip catches every error from `obsidian_get_note`, treats all failures as a missing note, and then writes a replacement body. The catch-all is at `.opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh:64-70`, while the comment only claims to handle a 404. An auth, transport, or server error can therefore turn a failed read into an empty-content write.

  Claim-adjudication packet:

  ```json
  {
    "findingId": "F006",
    "claim": "The MCP round-trip example can write after a non-404 read failure and lose existing content or create an unintended note.",
    "evidenceRefs": [
      ".opencode/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh:64-82"
    ],
    "counterevidenceSought": "Checked the surrounding comments and later tool verification steps; no status/error discriminator is present before the write.",
    "alternativeExplanation": "The MCP wrapper may expose only 404 as a thrown exception in the intended runtime, but the code does not establish that contract.",
    "finalSeverity": "P1",
    "confidence": 0.92,
    "downgradeTrigger": "Handle only a confirmed not-found response as an empty note and rethrow or stop on auth, transport, and server errors."
  }
  ```

## Findings - Existing / Refined

- **F001** remains open: missing normative target inputs.
- **F002** remains open: generic plugin route is partial.
- **F003** remains open: human resource-loading index is incomplete.
- No earlier finding was downgraded or resolved by the security pass.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | blocked | core | `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:34-39` | Normative target inputs remain absent. |
| `checklist_evidence` | blocked | core | target root inventory | No target checklist exists. |
| `feature_catalog_code` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:199-267` | Card inventory remains intact. |
| `playbook_capability` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/brat-headless-install.md:108-121` | BRAT scenario exposes the same untrusted path boundary. |

## Assessment

The diagnostics avoid printing secret values, and the fixture contains an empty token field. The reviewed examples and BRAT staging recipes still leave three actionable security boundaries: bearer-token transmission ignores TLS configuration, remote manifest metadata controls a write path without containment, and a catch-all read error can flow into a write.

## Ruled Out

- Plaintext credential values in the inspected fixture and doctor output.
- Unquoted shell expansion in the cited BRAT path writes; quoting is present, but it does not solve traversal.
- Missing backups as a blanket rule; most plugin workflows require them, although iteration 3 will inspect retention and atomicity more closely.

## Recommended Next Focus

Traceability: reconcile the target report, feature catalog, playbook, route matrix, and per-plugin reference/asset links without changing any reviewed file.

Review verdict: CONDITIONAL

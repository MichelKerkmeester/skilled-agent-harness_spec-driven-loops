---
title: "Troubleshoot"
description: "Failure classification and recovery for the aside surface: PROFILE_UNBOUND vs auth, signed-out fail-closed behavior, dead stdio child vs daemon outage, missing binary, inventory drift, and guarded fail-closed probes for unverified capabilities."
trigger_phrases:
  - "aside error"
  - "aside not working"
  - "aside troubleshoot"
  - "aside unbound profile"
version: 1.0.0.0
---

# Troubleshoot (failure classification and recovery)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries diagnosis discipline: every failure gets classified by its real cause before any recovery is attempted, and unverified capabilities fail closed instead of being promised. The taxonomy separates states that look alike: a browser-unbound REPL/MCP call (PROFILE_UNBOUND) is never a missing credential; a dead stdio child is never a daemon outage (stderr tells them apart); built-in models failing after sign-out is account state, not breakage.

All troubleshooting capabilities are READ-ONLY: diagnose, classify, report — recovery actions that mutate state (re-sign-in, respawn, reinstall) stay operator-owned or probe-scoped.

---

## 2. HOW IT WORKS

The recipes: `command not found: aside` means CLI missing or `~/.local/bin` off PATH — report the official installer as operator-invoked guidance, never install. Built-in models failing after sign-out fail closed by design — recover via `aside account use <id>` or re-sign-in; BYO API-key providers keep working. `This task is not bound to a browser profile` is PROFILE_UNBOUND — the supported binding procedure is **UNKNOWN** (undocumented); surface the error verbatim and stop, never improvise a binding workaround. A killed `aside mcp` child shows EOF/broken-pipe symptoms — distinguish from DAEMON_UNAVAILABLE via stderr, then respawn cleanly and confirm no leaked processes. MCP inventory drift from the documented single `repl` tool is a finding, not a failure — re-run discovery and save a fresh fixture.

Guarded probes cover the capability gaps: console capture (Playwright `page.on('console', ...)`) and network capture (`page.on('request'/'response', ...)`) have **no verified contract** — a clean "unsupported, fail closed" outcome is a valid PASS, and no parity with `bdg console --list` or HAR export is ever claimed. Human-only boundaries (MFA, CAPTCHA, identity checks, vault unlock, approvals) pause tasks; plan for resumable waiting, never bypasses.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/troubleshooting.md` | Shared | Full error taxonomy and recovery sequences |
| `references/session_management.md` | Shared | Binding, daemon, and concurrency model behind the failures |
| `scripts/doctor.sh` | Script | One-command read-only triage across all surfaces |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/recovery_and_failure/missing_binary.md` | Manual playbook | ASD-014 CLI_MISSING diagnosis without installing |
| `manual_testing_playbook/recovery_and_failure/dead_mcp_process.md` | Manual playbook | ASD-015 dead-child classification and clean respawn |
| `manual_testing_playbook/mcp_transport/unbound_profile_error.md` | Manual playbook | ASD-010 PROFILE_UNBOUND classification |
| `manual_testing_playbook/probes_and_gaps/console_probe.md` | Manual playbook | ASD-012 guarded console probe, fail-closed |
| `manual_testing_playbook/probes_and_gaps/network_probe.md` | Manual playbook | ASD-013 guarded network probe, fail-closed |

---

## 4. SOURCE METADATA

- Group: Troubleshoot
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `troubleshoot/troubleshooting_recipes.md`

Related references:
- [install_and_doctor.md](../install/install_and_doctor.md) covers the doctor that runs this triage end-to-end
- [mcp_transport_and_code_mode.md](../mcp/mcp_transport_and_code_mode.md) covers the transport whose failures this domain classifies

---
title: "Implementation Summary: mcp-* skill install and doctor standardization"
description: "All five mcp-* skills now share one install-and-doctor surface, the central doctor command enumerates every mcp skill, and the three design skills cross-reference each other in prose and in the skill graph."
trigger_phrases:
  - "mcp skill standardization summary"
  - "doctor.sh rollout"
  - "mcp-figma 1.0.0.0 summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/006-mcp-skill-install-doctor-standardization"
    last_updated_at: "2026-06-15T06:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented and verified all changes; packet docs authored"
    next_safe_action: "Run validate.sh --strict, then scoped commit, then stop for review"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-figma/changelog/v1.0.0.0.md"
      - ".opencode/skills/mcp-open-design/INSTALL_GUIDE.md"
      - ".opencode/skills/mcp-open-design/scripts/doctor.sh"
      - ".opencode/commands/doctor/assets/doctor_mcp_install.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-mcp-skill-install-doctor-standardization"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-mcp-skill-install-doctor-standardization |
| **Completed** | 2026-06-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The five mcp-* skills used to look different from each other at the install line. Now they match. Every mcp skill ships an INSTALL_GUIDE.md, a verify-only `install.sh`, and a read-only `doctor.sh`, the central `/doctor:mcp` command knows about all of them, and the three design skills point at each other in both their docs and the skill graph.

### mcp-figma is now 1.0.0.0

The skill was live-verified against figma-ds-cli 1.2.0 and an embedded install scaffold was added, so it graduated from its pre-1.0 line. The version string moved to 1.0.0.0 in SKILL.md, INSTALL_GUIDE.md, the references, and the playbook, the changelog was rewritten as the first stable release, and the only `0.1.0` left is the historical row in the version-history table.

### mcp-open-design reaches parity

You can now install and diagnose mcp-open-design the same way as its siblings. A new INSTALL_GUIDE.md explains that there is nothing to npm-install (the `od` CLI and the MCP server both ship inside the desktop app), and three new scripts back it: `_common.sh` resolves the bundled `daemon-cli.mjs`, `install.sh` detects the app and verifies the CLI without wiring anything, and `doctor.sh` reports app, CLI, socket, and MCP-config state read-only.

### Read-only doctors for chrome-devtools and click-up

Both skills had an installer but no diagnostic. Each now has a self-contained `doctor.sh` that checks its real CLI (the `bdg` browser-debugger for chrome-devtools, the `cupt` CLI for click-up), the runtime, the browser or auth surface, and the Code Mode manual, all read-only.

### Every mcp skill is part of the doctor setup

The central `doctor_mcp_install.yaml` gained a `cli_skill_diagnostics:` class that lists the four CLI-primary design skills with their install and doctor entry points, kept separate from the `servers:` block so the server install loop ignores them. The `/doctor:mcp` router documents the distinction.

### The three design skills cross-reference each other

mcp-figma already named the other two. Now mcp-open-design names mcp-figma in its Related Skills, sk-design-interface names mcp-figma as a sibling transport, and the skill graph carries the reciprocal edges (sk-design-interface is `prerequisite_for` both mcp-figma and mcp-open-design).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-figma/changelog/v1.0.0.0.md` | Modified | Rewritten as the 1.0.0.0 first-stable-release notes |
| `mcp-figma/{SKILL.md, INSTALL_GUIDE.md, references/figma_cli_reference.md, manual_testing_playbook/manual_testing_playbook.md}` | Modified | Version bumped to 1.0.0.0 |
| `mcp-figma/mcp-servers/{figma-cli, figma-mcp}/*` | Created (this session) | Embedded install scaffold plus optional-MCP pointer |
| `mcp-open-design/INSTALL_GUIDE.md` | Created | Install guide matching the shared standard |
| `mcp-open-design/scripts/{_common.sh, install.sh, doctor.sh}` | Created | Verify-only install and read-only doctor for the bundled od CLI |
| `mcp-open-design/mcp-servers/open-design/README.md` | Created | Pointer doc for the bundled CLI and MCP |
| `mcp-open-design/{README.md, SKILL.md}` | Modified | Cross-reference mcp-figma |
| `mcp-chrome-devtools/scripts/doctor.sh` | Created | Read-only diagnostic for the bdg CLI |
| `mcp-click-up/scripts/doctor.sh` | Created | Read-only diagnostic for the cupt CLI |
| `sk-design-interface/{README.md, SKILL.md, graph-metadata.json}` | Modified | Cross-reference and graph-link mcp-figma |
| `commands/doctor/assets/doctor_mcp_install.yaml` | Modified | Added the `cli_skill_diagnostics:` class |
| `commands/doctor/mcp.md` | Modified | Documented the CLI-skill diagnostic class |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran as three parallel gpt-5.5-fast xhigh write seats for the templated, file-disjoint chunks (the chrome-devtools doctor, the click-up doctor, and the open-design scripts), while the orchestrator handled the knowledge-heavy chunks (the figma version bump, the open-design INSTALL_GUIDE, the central wiring, and the cross-references). The original plan was to use Opus through claude2, but account-2 was logged out mid-session, so the write seats fell back to gpt-5.5-fast with the Gate-3 spec folder, house-voice, comment-hygiene, and scope-lock baked into each brief. Every generated script was host-verified against its skill's real `install.sh` before acceptance, which caught one bug: the click-up doctor matched the Code Mode manual as `"clickup"` when the registered manual is `clickup_official`, so the grep was widened.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fell back to gpt-5.5-fast write seats instead of waiting for claude2 | Account-2 was logged out and re-login is interactive; gpt-5.5-fast was the operator's other named preference and was available |
| Kept the knowledge-heavy chunks with the orchestrator | The figma bump was half-done (clobber risk) and the open-design scripts needed exact `od` facts a context-free seat could hallucinate |
| Added CLI skills to a separate `cli_skill_diagnostics:` class, not `servers:` | The design skills have no server entry point or build, so putting them in the server install loop would be a category error |
| Preserved packet 151's 0.1.0 history | Rewriting it would be revisionist; 151 genuinely shipped 0.1.0, and the promotion is recorded here |
| Created an open-design `mcp-servers/` pointer doc instead of an installer scaffold | There is no package to install (the CLI ships in the app), so a pointer mirrors figma-mcp's "nothing installed here" doc |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on all 5 new scripts | PASS |
| `package_skill --check` mcp-figma | PASS |
| `package_skill --check` mcp-open-design | PASS (1 soft warning: SKILL.md 3003/3000 words) |
| JSON validity (mcp-figma, sk-design-interface graph-metadata) | PASS |
| `doctor_mcp_install.yaml` YAML parse | PASS |
| CLI fact fidelity (bdg, cupt, od daemon-cli path, socket) | PASS, verified against real sources |
| House-voice and comment-hygiene sweep on authored content | PASS (0 em dashes, no artifact tokens in script comments) |
| `validate.sh --strict` on the packet | PENDING (final step) |
| Live execution of the new scripts against a running Figma or Open Design app | NOT RUN (scripts are read-only or verify-only; only syntax and facts were verified) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The new scripts were not executed against a live app.** `bash -n` and host fact-checking confirm syntax and the CLI facts, but `install.sh` and `doctor.sh` for open-design, chrome-devtools, and click-up were not run end to end against a running desktop app or browser. They are read-only or verify-only by design.
2. **mcp-open-design SKILL.md is 3 words over the recommended 3000.** The cross-reference addition pushed it to 3003 words. This is a soft package_skill warning, not a failure.
3. **Pre-existing em dashes remain in untouched files.** `mcp-click-up/scripts/install.sh` and two unrelated lines of `doctor_mcp_install.yaml` carry em dashes from earlier work. They were left under scope lock, since this packet did not author those lines.
<!-- /ANCHOR:limitations -->

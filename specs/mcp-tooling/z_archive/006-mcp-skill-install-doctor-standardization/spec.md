---
title: "Feature Specification: Standardize the mcp-* skills into the install-guide and doctor system"
description: "The mcp-* skills were inconsistent: mcp-figma sat at a pre-1.0 version after live verification, mcp-open-design had no INSTALL_GUIDE or install/doctor scripts, two skills lacked a read-only doctor, and the three design skills did not cross-reference each other consistently. This packet standardizes all of them."
trigger_phrases:
  - "mcp skill install standardization"
  - "doctor.sh for mcp skills"
  - "mcp-open-design install guide"
  - "design skill cross-references"
  - "mcp-figma 1.0.0.0"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/006-mcp-skill-install-doctor-standardization"
    last_updated_at: "2026-06-15T06:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented all skill changes, doctor wiring, and cross-refs; verifying"
    next_safe_action: "Run validate.sh --strict, then scoped commit, then stop for review"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-figma/changelog/v1.0.0.0.md"
      - ".opencode/skills/mcp-open-design/INSTALL_GUIDE.md"
      - ".opencode/skills/mcp-open-design/scripts/install.sh"
      - ".opencode/skills/mcp-chrome-devtools/scripts/doctor.sh"
      - ".opencode/commands/doctor/assets/doctor_mcp_install.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-mcp-skill-install-doctor-standardization"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "claude2 account-2 was logged out, so write seats ran on gpt-5.5-fast xhigh"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Standardize the mcp-* skills into the install-guide and doctor system

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Review |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five mcp-* skills had drifted out of a shared shape. mcp-figma was still labelled pre-1.0 (`0.1.0`) even though its CLI was live-verified and an embedded install scaffold was added. mcp-open-design had no INSTALL_GUIDE and no `scripts/` at all, so it could not be installed or diagnosed like its siblings. mcp-chrome-devtools and mcp-click-up had an `install.sh` but no read-only `doctor.sh`. The central `/doctor:mcp` command knew only the registered MCP servers, so the CLI-primary design skills were invisible to it. Finally, the three design skills (mcp-figma, mcp-open-design, sk-design-interface) referenced each other only partially.

### Purpose
Every mcp-* skill ships the same install-and-doctor surface and is reachable from the central doctor command, and the three design skills cross-reference each other consistently in prose and in the skill graph.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Promote mcp-figma to `1.0.0.0` across SKILL.md, INSTALL_GUIDE.md, the changelog, references, and the playbook.
- Bring mcp-open-design to install/doctor parity: a new INSTALL_GUIDE.md and `scripts/{_common.sh, install.sh, doctor.sh}`.
- Add a read-only `scripts/doctor.sh` to mcp-chrome-devtools and mcp-click-up.
- Wire all mcp skills into the central `/doctor:mcp` setup, adding a `cli_skill_diagnostics:` reference class for the CLI-primary skills.
- Make mcp-figma, mcp-open-design, and sk-design-interface cross-reference each other in README, SKILL.md, graph-metadata, and the repo READMEs.
- Add the open-design `mcp-servers/` pointer doc so its layout matches the embedded-server skills.

### Out of Scope
- Rewriting packet 151's historical records - they accurately document the 0.1.0 release; the promotion is recorded here.
- Bumping mcp-open-design, mcp-chrome-devtools, or mcp-click-up versions - only mcp-figma was promoted.
- Treating the CLI-primary design skills as registered MCP servers - they have no server entry point or build.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-figma/changelog/v1.0.0.0.md` | Modify | Rewrite as the 1.0.0.0 release notes |
| `.opencode/skills/mcp-figma/{SKILL.md,INSTALL_GUIDE.md,references/figma_cli_reference.md,manual_testing_playbook/manual_testing_playbook.md}` | Modify | Version string bump to 1.0.0.0 |
| `.opencode/skills/mcp-open-design/INSTALL_GUIDE.md` | Create | New install guide matching the shared standard |
| `.opencode/skills/mcp-open-design/scripts/{_common.sh,install.sh,doctor.sh}` | Create | Install (verify-only) and read-only doctor for the bundled od CLI |
| `.opencode/skills/mcp-chrome-devtools/scripts/doctor.sh` | Create | Read-only diagnostic for the bdg CLI |
| `.opencode/skills/mcp-click-up/scripts/doctor.sh` | Create | Read-only diagnostic for the cupt CLI |
| `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` | Modify | Add `cli_skill_diagnostics:` reference class |
| `.opencode/commands/doctor/mcp.md` | Modify | Document the CLI-skill diagnostic class |
| `.opencode/skills/mcp-open-design/{README.md,SKILL.md}` | Modify | Cross-reference mcp-figma |
| `.opencode/skills/sk-design-interface/{README.md,SKILL.md,graph-metadata.json}` | Modify | Cross-reference and graph-link mcp-figma |
| `.opencode/skills/mcp-open-design/mcp-servers/open-design/README.md` | Create | Pointer doc for the bundled CLI and MCP |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | mcp-figma promoted to 1.0.0.0 | No `0.1.0` references remain in mcp-figma except the historical version-history row; `package_skill --check` PASS |
| REQ-002 | mcp-open-design install/doctor parity | INSTALL_GUIDE.md plus `scripts/{_common.sh,install.sh,doctor.sh}` exist; `bash -n` passes; install.sh wires nothing and doctor.sh changes nothing |
| REQ-003 | doctor.sh for mcp-chrome-devtools and mcp-click-up | Both files exist, `bash -n` passes, and each checks its real CLI (bdg, cupt) read-only |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | All mcp skills part of the central doctor setup | `doctor_mcp_install.yaml` lists the 4 CLI-primary skills under `cli_skill_diagnostics:`; mcp.md documents the class; YAML still parses |
| REQ-005 | Three design skills cross-reference each other | Each of mcp-figma, mcp-open-design, sk-design-interface names the other two in its Related section; graph edges are reciprocal |
| REQ-006 | Embedded server layout consistency | mcp-figma `mcp-servers/{figma-cli,figma-mcp}` and mcp-open-design `mcp-servers/open-design` pointer docs exist, mirroring mcp-click-up |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five mcp-* skills have an INSTALL_GUIDE.md, an install.sh, and a read-only doctor.sh (or are correctly classed as a registered server).
- **SC-002**: The central `/doctor:mcp` setup enumerates every mcp skill, with CLI-primary skills in a distinct, non-server class.
- **SC-003**: mcp-figma, mcp-open-design, and sk-design-interface mutually cross-reference each other in prose and in the skill graph.
- **SC-004**: `validate.sh --strict` passes for this packet and no new house-voice or comment-hygiene violations are introduced.

### Acceptance Scenarios

- **Given** mcp-figma after the bump, **When** grepping for `0.1.0`, **Then** only the historical version-history row matches.
- **Given** a machine with the Open Design app installed, **When** `scripts/install.sh` runs, **Then** it locates the bundled od CLI and reports next steps without wiring MCP.
- **Given** the mcp-chrome-devtools doctor, **When** it runs, **Then** it reports the bdg CLI and Chrome presence read-only and exits 0.
- **Given** the click-up doctor, **When** the `clickup_official` manual is registered, **Then** it reports the ClickUp manual as present.
- **Given** the central doctor YAML, **When** parsed, **Then** `cli_skill_diagnostics:` lists the four CLI-primary skills beside the `servers:` block.
- **Given** sk-design-interface, **When** reading its Related section and graph edges, **Then** both mcp-figma and mcp-open-design appear.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | claude2 (account-2) for Opus write seats | Logged out mid-session | Fell back to gpt-5.5-fast xhigh write seats with Gate-3 baked into briefs |
| Risk | gpt-5.5 hallucinating CLI facts | Wrong binary names in doctors | Baked exact facts into briefs and host-verified every generated script against the real install.sh |
| Risk | Miscategorizing CLI skills as MCP servers | Breaks the server install loop | Added them to a separate `cli_skill_diagnostics:` class the loop ignores |
| Risk | Concurrent-session git index | Sweeping unrelated changes into a commit | Commit with `git commit --only -- <paths>` scoped to this packet's files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each doctor.sh completes quickly and never blocks on network or daemon calls (best-effort local probes only).

### Security
- **NFR-S01**: No script prints a token, key, or secret value; auth checks report presence only.
- **NFR-S02**: install.sh and doctor.sh are non-mutating: they never connect, patch, wire MCP, start a daemon, or pipe a remote installer to a shell.

### Reliability
- **NFR-R01**: doctor.sh degrades gracefully when a tool, app, or browser is absent (warn or info, never a fatal crash) and exits 0.
- **NFR-R02**: install.sh reports a missing desktop app as a warning rather than failing hard, because its job is to check wiring readiness.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: doctor.sh takes no arguments and runs the full read-only report.
- Maximum length: not applicable - these are fixed diagnostic scripts.
- Invalid format: unknown install.sh flags exit with usage and a non-zero code.

### Error Scenarios
- External service failure: the Open Design or Figma desktop app being closed is reported, not fatal.
- Network timeout: no script makes a blocking network call.
- Concurrent access: scripts are read-only or verify-only, so concurrent runs are safe.

### State Transitions
- Partial completion: a missing CLI is reported with the exact expected path and the install next step.
- Session expiry: an auth error from a gated verb is surfaced as a login requirement, never a credential prompt.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | ~12 files across 5 skills plus the doctor command, mostly additive docs and scripts |
| Risk | 8/25 | No runtime or data mutation; all scripts read-only or verify-only; reversible |
| Research | 6/20 | Required the exact od CLI and sibling-CLI facts, gathered from existing skill docs |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. The one decision point (claude2 logged out) was resolved by using gpt-5.5-fast xhigh write seats.
<!-- /ANCHOR:questions -->

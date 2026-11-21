---
title: "Tasks: MagicPath manual and authentication"
description: "Ordered work for registering the MagicPath command surface and resolving its credential."
trigger_phrases:
  - "magicpath manual tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: MagicPath manual and authentication

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the installed build's authoritative command surface — evidence: `magicpath-ai --help` on 2.6.1 lists 25 commands; `info -o json` claims 22 and omits `create-project` and `skills`, so `--help` is authoritative and `info` carries a stale list
- [x] T002 Settle the version question — evidence: `npm install -g magicpath-ai@latest` moved 2.3.2 to 2.6.1 (75 packages changed); the bridge re-read it with no re-registration, returning `version_through_bridge 2.6.1`; rollback is `npm install -g magicpath-ai@2.3.2`
- [x] T003 [P] Read the secret-resolution convention from a registered manual that already uses it — evidence: the Notion entry resolves `${notion_NOTION_TOKEN}` through the configured dotenv loader; MagicPath follows it as `${magicpath_MAGICPATH_TOKEN}`
- [x] T004 [P] Record the machine's starting authentication state — evidence: `magicpath-ai info -o json` reports `auth.authenticated false`, so no credentialed call has been possible in this phase
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Declare the read-only tools — evidence: the `cli` transport takes no inline tool list, so `.opencode/bin/magicpath-utcp-manual.cjs` emits a 14-tool UTCP manual and `.utcp_config.json` registers it as the manual `magicpath`; every command ends `-o json`
- [x] T006 Confirm every declared command exists — evidence: all 14 (`info whoami search inspect list-projects list-components list-teams list-members list-themes get-theme list-installed selection active-project share`) matched `magicpath-ai --help` on 2.6.1
- [x] T007 Act on the mutating-family decision — evidence: operator chose read-only only; `add`, `code`, `image`, `create-project` and `clone` are absent from the emitter, so they are unreachable from a tool call
- [x] T008 Express the mutation boundary — evidence: every emitted tool carries the `read-only` tag, and the emitter's header states which commands are withheld and why
- [x] T009 Resolve the credential without a manual declaration — evidence: the manual declares no `env_vars` at all. A fresh server reported `Successfully registered manual 'magicpath' with 14 tools`, and the CLI falls through to the session `magicpath-ai login` stores; no credential value is in any tracked file
- [x] T010 [P] Record the credential path in `.env.example` — evidence: the entry states that no namespaced variable exists, because a non-empty token overrides a stored login session, and that headless use exports `MAGICPATH_TOKEN` in the environment instead
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Call a read-only tool without a credential — evidence: returns structured JSON `{"error":"Not authenticated. Set MAGICPATH_TOKEN or run `magicpath-ai login`.","code":"NOT_AUTHENTICATED","suggestion":"..."}` rather than an opaque failure
- [ ] T012 Call the same tool with a credential and confirm it returns real account data
- [ ] T013 [P] Confirm `selection` and `active-project` behave sanely with no browser session open
- [ ] T014 Scan the working tree and the diff for any token value before close
- [x] T015 Confirm the config parses and untouched manuals are unchanged — evidence: `.utcp_config.json` parses with 14 manuals, `git diff --stat` shows 10 insertions and 0 deletions, and a fresh server registered the manual and discovered its 14 tools
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] A read-only tool returns real data with a credential and names what is missing without one
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Checklist

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] The authoritative command list comes from the installed build
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No declared tool names a command the installed build lacks
- [ ] CHK-011 [P0] The mutation boundary is readable from the config alone
- [ ] CHK-012 [P1] Structured output is requested wherever the CLI supports it
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in spec.md are met
- [ ] CHK-021 [P0] Both credential states are exercised and recorded
- [ ] CHK-022 [P1] A mutating tool, if registered, is exercised against a disposable target
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The manuals this packet did not touch are unchanged
- [ ] CHK-FIX-002 [P1] The phase 001 probe is promoted or gone, not orphaned
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No token value appears in any tracked file or in the diff
- [ ] CHK-032 [P1] Any remote state created while testing a mutating tool is removed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [ ] CHK-041 [P1] The credential setup an operator must perform is written down
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 8 | 0/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---

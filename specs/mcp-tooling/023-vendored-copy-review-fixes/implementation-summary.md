---
title: "Implementation Summary"
description: "The 8 P1 and 16 P2 findings a deep review of Product Owner's vendored copies raised in mcp-click-up and mcp-figma, fixed here at the upstream source or recorded with a reason."
trigger_phrases:
  - "vendored copy review fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/023-vendored-copy-review-fixes"
    last_updated_at: "2026-10-21T16:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Fixed the findings and reran the packet validators"
    next_safe_action: "Commit on the operator's go-ahead, then Product Owner pulls both packets"
    blockers: []
    key_files:
      - ".skilled/skills/mcp-tooling/mcp-click-up/scripts/doctor.sh"
      - ".skilled/skills/mcp-tooling/mcp-figma/scripts/install.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "1004bf13-7863-4447-a63e-6ad2f5fcfd86"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-vendored-copy-review-fixes |
| **Status** | Complete |
| **Completed** | 2026-10-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Product Owner vendors `mcp-click-up` and `mcp-figma` and never edits its copies, so the review's findings in them are fixed here. Of 24 findings, 22 are fixed, 1 is partly fixed and 1 is recorded as not fixed, and the unfixed parts both sit outside the packets. The review record lives in the Product Owner repository, `specs/018-product-owner-deep-review` phases 003 and 004.

### mcp-click-up, now 1.2.3.0 (2 P1, 6 P2)

| ID | Outcome |
|----|---------|
| R2-P1-001 | Fixed. `scripts/doctor.sh` finds `.utcp_config.json` with an upward search, tested at both folder depths |
| R4-P1-001 | Fixed. `SKILL.md`, `references/mcp-tools.md`, `references/cupt-commands.md`, `feature-catalog/mcp-high-priority/create-task.md` and `FEATURE-CATALOG.md` say `cupt add` creates a task and sends the plain `description` |
| R2-P2-001 | Fixed. `INSTALL-GUIDE.md` warns that a token typed on the command line lands in shell history |
| R2-P2-002 | Not fixed. The `mcp-remote` launch arguments live in each repository's `.utcp_config.json`, outside the packet, and the live file runs it unpinned |
| R4-P2-001 | Fixed. `INSTALL-GUIDE.md` states one version, 1.0.2.0 |
| R4-P2-002 | Fixed. Install and run commands in `INSTALL-GUIDE.md`, `SKILL.md` and `README.md` are packet-relative |
| R5-P2-001 | Fixed. `FEATURE-CATALOG.md` points to `json-flag.md` for the `--json` list, and `cupt-commands.md` narrows its own row |
| R5-P2-003 | Fixed. `SKILL.md` `RESOURCE_BASES` names only `references` |

### mcp-figma, now 1.1.4.0 (6 P1, 10 P2)

| ID | Outcome |
|----|---------|
| R1-P1-001 | Fixed. `tool-surface.md`, `feature-catalog.md` and `render-and-create.md` document the primitives as `create` subcommands |
| R1-P1-002 | Fixed. `scripts/_common.sh` `is_silships()` checks `--help` for "Figma design systems" before `figma_bin` accepts `figma-cli` |
| R1-P1-003 | Fixed. `scripts/connect-safe.sh` exits 2 on a non-TTY, run and observed |
| R1-P1-004 | Fixed. `scripts/doctor.sh` searches upward for the config and checks the daemon PID with `ps` |
| R2-P1-001 | Fixed. `README.md` and `INSTALL-GUIDE.md` call extract with a new positional path, guarded so it never overwrites |
| R3-P1-001 | Fixed. Seven depth-bound links in `README.md`, `SKILL.md`, `feature-catalog.md`, `references/mcp-wiring.md` and `references/troubleshooting.md` became plain-text locations |
| R1-P2-001 | Fixed. `scripts/install.sh` tests `[ "$VERBOSE" = 1 ]` |
| R1-P2-002 | Fixed. `INSTALL-GUIDE.md` is 1.0.1.0 with a history row |
| R2-P2-001 | Partly fixed. `scripts/install.sh` fetches `REPO_REF` 486b9856a6b051652d9d0a5e413046f637d6f499 by default, with `--repo-ref` to override. The `figma-developer-mcp` launch pin is not fixed, for the R2-P2-002 reason |
| R2-P2-002 | Fixed. `references/mcp-wiring.md` treats Figma-authored text as untrusted data |
| R3-P2-001 | Fixed. The playbook no longer pins a skill version |
| R3-P2-002 | Fixed. Both playbook pointers name Section 13 |
| R3-P2-003 | Fixed. `INSTALL-GUIDE.md` says extract writes 11 sections |
| R4-P2-001 | Fixed. `assets/utcp-figma-manual.md` and `mcp-servers/figma-mcp/README.md` align on `@latest` |
| R4-P2-002 | Fixed. A comment on the PID constant in `scripts/_common.sh` names the `figma-cli` collision |
| R4-P2-003 | Fixed. The Dev Mode out-of-scope sentence in `references/mcp-wiring.md` is scoped to Code Mode |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-click-up/` `SKILL.md`, `README.md`, `INSTALL-GUIDE.md`, `FEATURE-CATALOG.md`, `create-task.md`, `cupt-commands.md`, `mcp-tools.md`, `scripts/doctor.sh` | Modified | The mcp-click-up findings |
| `mcp-click-up/changelog/v1.2.3.0.md` | Created | Release note |
| `mcp-figma/` `SKILL.md`, `README.md`, `INSTALL-GUIDE.md`, `utcp-figma-manual.md`, `feature-catalog.md`, `render-and-create.md`, `manual-testing-playbook.md`, `mcp-servers/figma-mcp/README.md`, `mcp-wiring.md`, `tool-surface.md`, `troubleshooting.md` and four scripts | Modified | The mcp-figma findings |
| `mcp-figma/changelog/v1.1.4.0.md` | Created | Release note |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each cited line was reopened in the upstream file before its edit. Only `mcp-tooling` paths changed, since a peer session holds unrelated work elsewhere in this tree. Versions moved one patch step each. Nothing is committed, and Product Owner's `vendor-sync.py pull` refuses an uncommitted upstream, so the copies there stay old until the commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Depth-bound links became plain-text locations | The same file is read at two folder depths, and a relative link can only be right at one of them |
| `install.sh` pins a commit with an override flag | A pinned default stops a moving default branch from changing what runs, and the flag keeps an upgrade one argument away |
| The launch pins stay unfixed here | The packets document the arguments, and the live arguments belong to each repository's `.utcp_config.json` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_skill_package.py <packet> --strict`, both packets | `package_skill.py --check --strict: PASS (exit 0)` for each |
| `parent-skill-check.cjs .skilled/skills/mcp-tooling` | OK, all hard invariants passed, 0 warnings |
| Link sweep over both packets | 0 broken relative links |
| `bash -n` on the five changed scripts | All parse |
| `connect-safe.sh </dev/null` | Exit 2 |
| `mcp-click-up/scripts/doctor.sh` from the repository | Finds the ClickUp manual in `.utcp_config.json` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `mcp-remote` and `figma-developer-mcp` launch arguments are unpinned.** Pinning them is a change to each repository's `.utcp_config.json`, not to these packets.
2. **Product Owner still carries the old copies.** Its phase 007 pulls both packets after this work is committed.
<!-- /ANCHOR:limitations -->

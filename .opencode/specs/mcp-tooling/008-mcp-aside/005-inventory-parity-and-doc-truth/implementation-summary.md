---
title: "Implementation Summary: Phase 5: inventory-parity-and-doc-truth"
description: "mcp-aside-devtools now tells the registered-state truth everywhere: 30 stale registration claims flipped, ASD-011 ungated, doctor errors on manual absence, and the packet gains the feature catalog and byte-true manual snapshot its siblings carry."
trigger_phrases:
  - "aside parity summary"
  - "aside doc truth summary"
  - "aside registered state"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T13:16:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Completed phase; all gates green"
    next_safe_action: "Phase 006 live discovery capture in a fresh Code Mode session"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp_aside_manual.md"
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/feature_catalog/feature_catalog.md"
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-005-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-inventory-parity-and-doc-truth |
| **Completed** | 2026-07-16 |
| **Level** | 2 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The `aside` UTCP manual landed in `.utcp_config.json`, and this phase makes the `mcp-aside-devtools` packet stop lying about it. Around 30 "not registered" and "later phase" claims across 9 files now state the registered truth, the gated Code Mode discovery scenario is runnable, and the packet reaches structural parity with `mcp-mobbin` through a new feature catalog and a byte-true manual snapshot.

### Registered-state doc truth

You can now trust any registration claim in the packet: SKILL.md, README, INSTALL_GUIDE, `references/mcp_wiring.md`, both `mcp-servers/` READMEs, and the playbook all say the manual is registered (2026-07-16), that discovery pends a fresh Code Mode session, and that `aside.aside_repl` stays unconfirmed until `tool_info()` returns it. Playbook scenario ASD-011 lost its registration gate: its precondition is now a session with the code_mode MCP loaded, SKIP is valid only as "no Code Mode session available", and a missing manual is a FAIL (registration regressed). `scripts/doctor.sh` enforces the same posture: manual absence in an existing `.utcp_config.json` is an error with exit 1 instead of expected-absent info, while staying strictly read-only.

### Feature catalog

`feature_catalog/` inventories 12 capabilities across the five router intent domains (task, repl, mcp, install, troubleshoot — the exact INTENT_SIGNALS keys in SKILL.md), each leaf tracing to existing references, examples, playbook scenarios, or the completed research. UNKNOWN items stay flagged: the binding procedure, permission inheritance, the model-flag spelling, console/network capture, and the single-vs-dual-manual question.

### Registered manual asset

`assets/utcp_aside_manual.md` carries the registered entry byte-true to the live config (verified programmatically), provenance-marked "registered 2026-07-16; verify with jq, do not re-add", plus the remaining post-registration checklist and the open single-vs-dual-manual pointer. The SKILL.md router now loads it for MCP intent.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md` | Modified | Registered-state posture, asset routing, version 1.1.0.0 |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md` | Modified | Quick start, FAQ, related documents, doctor row |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/INSTALL_GUIDE.md` | Modified | MCP section registered + verify-with-jq checklist line |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp_wiring.md` | Modified | Registration section retitled REGISTERED with snapshot pointer |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/mcp-servers/aside-mcp/README.md` | Modified | Registered-entry truth, post-registration checklist framing |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/mcp-servers/aside-cli/README.md` | Modified | Cross-reference updated |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual_testing_playbook/manual_testing_playbook.md` | Modified | ASD-011 ungated; preconditions, wave plan, index |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual_testing_playbook/mcp_transport/code_mode_discovery.md` | Modified | Gate replaced with code_mode-session precondition |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh` | Modified | Manual absence err + exit 1; read-only preserved |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/feature_catalog/` (6 files) | Created | Root catalog + task/repl/mcp/install/troubleshoot leaves |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp_aside_manual.md` | Created | Byte-true registered snapshot + remaining checklist |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/changelog/v1.1.0.0.md` | Created | Release record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

A grep inventory of the stale markers drove the flip set, the `mcp-mobbin` exemplars drove the new structures, and every claim was checked against the live config or the packet's own evidence before it shipped. The asset snapshot was verified byte-true against the live `aside` entry with a python3 comparison, `doctor.sh` passed `bash -n` after the posture change, and the packet closed through `package_skill.py --check --strict` (PASS) plus `validate.sh --strict --no-recursive` on this spec child (PASSED). The historical `changelog/v1.0.0.0.md` was deliberately left untouched as an immutable release record.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Missing manual is FAIL in ASD-011, not SKIP | The manual is registered, so absence means regression; keeping SKIP would hide a real failure behind a stale blocker |
| Doctor exits 1 only on manual absence, warns on missing config file | Absence in an existing config is a provable regression; a missing config file is locational uncertainty the doctor cannot adjudicate read-only |
| Kept `changelog/v1.0.0.0.md` wording untouched | Release records are historical; rewriting them would falsify what v1.0.0.0 actually shipped |
| Embedded the jq-normalized entry as the asset snapshot | `jq '.manual_call_templates[] | select(.name == "aside")'` output is reproducible byte-for-byte, making "verify with jq" a real check instead of prose |
| One leaf doc per intent domain instead of the allowed 1-3 | The mobbin exemplar uses one per domain and the aside surface has no verified sub-capability split that would earn a second file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-aside-devtools --check --strict` | PASS ("Skill is valid!") |
| `bash -n .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh` | PASS (exit 0) |
| Residual stale-marker grep across the packet | PASS (0 hits outside changelog/v1.0.0.0.md) |
| Asset snapshot vs live `aside` entry (python3 byte comparison) | PASS (`BYTE-TRUE: True`, `SEMANTIC-EQUAL: True`) |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict --no-recursive` | PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **Callable still unconfirmed.** `aside.aside_repl` is a convention prediction; discovery needs a Code Mode session started after registration. Phase 006 captures the live result.
2. **Doctor manual check is a grep, not a schema validation.** It matches the `"name": "aside"` key in `.utcp_config.json`; a structurally broken entry with the right name would pass. The asset's jq command is the precise check.
3. **Version-pinned evidence ages.** The one-`repl`-tool inventory and CLI option list hold for `1.26.626.1517`; any upgrade requires fresh fixtures per the packet's own rediscovery mandate.
<!-- /ANCHOR:limitations -->

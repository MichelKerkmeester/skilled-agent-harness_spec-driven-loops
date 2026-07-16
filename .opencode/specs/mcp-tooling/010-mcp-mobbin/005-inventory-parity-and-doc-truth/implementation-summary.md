---
title: "Implementation Summary: Phase 5: inventory-parity-and-doc-truth"
description: "Flipped the mcp-mobbin packet from pre-registration doctrine to registered-state truth (98 stale marker lines across 15 files; doctor absence now ERR) and shipped sibling inventory parity at v1.1.0.0: examples/, install.sh, a 9-scenario playbook, and enriched catalog leaves; package gate strict PASS."
trigger_phrases:
  - "mobbin doc truth summary"
  - "mobbin inventory parity summary"
  - "mobbin phase 005 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase complete: doc truth + parity shipped, gates green"
    next_safe_action: "Run phase 006 live-verification-capture after operator reconnect + OAuth"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh"
      - ".opencode/skills/mcp-tooling/mcp-mobbin/scripts/install.sh"
      - ".opencode/skills/mcp-tooling/mcp-mobbin/changelog/v1.1.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-inventory-parity-and-doc-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is the mobbin manual registered? Yes - verified field-for-field against the researched shape; discovery and OAuth still pend"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Phase 5: inventory-parity-and-doc-truth

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Completed** | 2026-07-16 |
| **Level** | 2 |
| **Branch** | `skilled/v4.0.0.0` |
| **Phase** | 5 of 6 |
| **Predecessor** | ../004-validation-and-handoff/ |
| **Successor** | ../006-live-verification-capture/ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The `mobbin` manual now sits in `.utcp_config.json` (operator-registered 2026-07-16, byte-equivalent to the researched draft), and the packet finally says so: every doc that taught "NOT registered / absence expected / later phase" now teaches registered-state truth — registered; discovery pends a fresh Code Mode session; OAuth pends the operator; callable still INFERRED until `tool_info`. The packet also caught up with its transport siblings on inventory.

- **Doc-truth sweep (15 files, 98 baseline marker lines)**: `SKILL.md` (registration trap became a discovery trap; RULES/ESCALATE reframed to escalate-never-repair), `README.md`, `INSTALL_GUIDE.md` (Section 4 is now "Reconnect and Authenticate", operator-only), `references/{mcp_wiring,tool_surface,troubleshooting}.md`, `assets/utcp_mobbin_manual.md` (now the registered manual's reference shape, 9-item checklist executed doc-side: 3 evidenced, 6 SKIP-valid with exact commands), `feature_catalog/**`, `manual_testing_playbook/**`, `mcp-servers/mobbin-mcp/README.md`.
- **`scripts/doctor.sh`**: manual absence flipped from expected INFO to **ERR** (a broken or reverted registration to escalate); still read-only, non-interactive, `bash -n` clean.
- **`examples/` (new, 4 files)**: README plus `smoke_search_limit_1.md`, `platform_flow_research.md`, `element_intent_query.md` — each opens with the mandatory `tool_info` confirmation of the INFERRED `mobbin.mobbin_search_screens`, keeps OAuth SKIP-valid with exact commands, and traces to `references/tool_surface.md` only.
- **`scripts/install.sh` (new)**: non-interactive verify-only posture check (Node 18+/npx, manual PRESENT in `.utcp_config.json`, operator-only OAuth pointer); exit 0 on the healthy posture.
- **Playbook 6 to 9 scenarios**: MANUAL-001 renamed/rewritten (`manual_absent_expected.md` became `manual_registered_expected.md`; presence expected); new PLATFORM-001 (ios/web enum, infer-or-ask), RATELIMIT-001 (429 `Retry-After` + backoff observation, SKIP-valid), PAIDGATE-001 (401 vs entitlement vs 429 taxonomy); root index updated to 9 IDs across 5 categories and 5 waves.
- **Catalog leaves enriched**: apps/screens/flows/elements each gained query-intent recipe tables plus the cross-cutting rate-limit and plan-gating constraints, traced to `tool_surface.md`.
- **Release**: version 1.1.0.0 plus `changelog/v1.1.0.0.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-tooling/mcp-mobbin/{SKILL,README,INSTALL_GUIDE}.md` | Modified | Registered-state doctrine, operator steps reframed, v1.1.0.0 |
| `.opencode/skills/mcp-tooling/mcp-mobbin/references/*.md` + `assets/utcp_mobbin_manual.md` | Modified | Reference shape of the registered manual; checklist executed doc-side |
| `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh` | Modified | Absence now ERR; pending discovery/OAuth stated |
| `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/install.sh` | Created | Verify-only posture check |
| `.opencode/skills/mcp-tooling/mcp-mobbin/examples/*.md` (4) | Created | Worked Code Mode walkthroughs |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/**` | Modified/Created | 9-scenario index; MANUAL-001 renamed; 3 new scenarios |
| `.opencode/skills/mcp-tooling/mcp-mobbin/feature_catalog/**` | Modified | Recipes + cross-cutting constraints |
| `.opencode/skills/mcp-tooling/mcp-mobbin/changelog/v1.1.0.0.md` | Created | Release record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Single agent, verify-first: the registered manual was parsed field-for-field from `.utcp_config.json` before any doc claimed it, a packet-wide marker grep (98 lines, 15 files) drove the sweep so no stale spot survived by omission, both scripts were run live against the real repo after `bash -n`, and the strict package gate closed the loop.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Manual absence became ERR, not WARN | The registered state is now the baseline; a missing manual means a broken or reverted registration, and softening it invites the old "expected absence" misread |
| Historical records kept verbatim (`changelog/v1.0.0.0.md`, the 1.0.0.0 install-guide history row) | They truthfully describe the first release's state; rewriting history would forge the record the changelog exists to keep |
| Asset re-titled "reference shape", not "paste-ready draft" | The live config is now authoritative; the asset's job changed from staging a registration to verifying one (live config wins on any disagreement) |
| Callable stays INFERRED everywhere | No fresh Code Mode session has run discovery and OAuth is incomplete; claiming an observed callable would cross the packet's own epistemic line |
| New scenarios grounded in research workflows | Platform-filter discipline, the 429 protocol, and the paid-gate taxonomy are the three behaviors the research record pins precisely and the old playbook never exercised |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `package_skill.py .opencode/skills/mcp-tooling/mcp-mobbin --check --strict` | PASS; 1 warning: SKILL.md 4,527 words vs 3,000 recommendation (same advisory class as v1.0.0.0; hard cap 5,000) |
| `bash -n scripts/doctor.sh` and `bash -n scripts/install.sh` | PASS, both clean |
| Live `doctor.sh` run | PASS: `OK 'mobbin' manual registered` + `OK Bridge shape present: npx mcp-remote -> https://api.mobbin.com/mcp` |
| Live `install.sh` run | PASS: exit 0, `OK Posture verified` |
| Stale-marker regression grep | PASS: only historical records (v1.0.0.0 changelog, 1.0.0.0 history row) and 3 intentional flip-narrative lines remain |
| Playbook index integrity | PASS: 9 scenario IDs = 9 per-scenario files; coverage table totals 9 across 5 categories |
| Registered-manual byte check | PASS: `.utcp_config.json` `mobbin` entry matches the asset field-for-field (stdio, `npx -y mcp-remote https://api.mobbin.com/mcp`, `env: {}`) |
| `validate.sh <this folder> --strict --no-recursive` | PASSED (run after doc authoring; see checklist.md) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **Discovery has not run.** Manuals load at Code Mode startup; no session started after the registration has enumerated `mobbin.*` tools, so the callable name and live schema stay INFERRED. Phase 006 owns the capture; the command is `tool_info({ tool_name: "mobbin.mobbin_search_screens" })` in a fresh Code Mode session.
2. **OAuth is incomplete.** The operator browser round-trip has not happened; end-to-end OAuth through the bridge stays Inferred, and every live playbook/example step is SKIP-valid until it does.
3. **The parent spec's phase map still shows Phase 5 as pending with scope TBD.** `../spec.md` is outside this phase's write authority; the parent map update rides with the next parent-scoped change.
4. **SKILL.md word count remains above the 3,000 recommendation** (4,527; hard cap 5,000) — carried from v1.0.0.0 for sibling parity, unchanged in kind by this phase.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: `spec.md` · **Plan**: `plan.md` · **Tasks**: `tasks.md` · **Checklist**: `checklist.md`
- **Delivered packet**: `.opencode/skills/mcp-tooling/mcp-mobbin/` (v1.1.0.0)
- **Ground truth**: `../001-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

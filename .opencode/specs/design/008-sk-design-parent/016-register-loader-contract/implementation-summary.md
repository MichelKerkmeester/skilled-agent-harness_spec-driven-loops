---
title: "Implementation Summary: sk-design shared-register loader contract"
description: "Done. The shared register now loads on every task for interface, foundations, motion and audit through DEFAULT_RESOURCE, and the benchmark connectivity gate sanctions the parent shared dir so the cross-packet path is no longer a path escape. Verified by the connectivity gate, router replay, three adversarial fixtures, the Lane C vitest suites, package check and strict validation."
trigger_phrases:
  - "sk-design register loader status"
  - "shared register preload outcome"
importance_tier: "important"
contextType: "implementation"
status: complete
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/016-register-loader-contract"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added the gate sanction and register default in four modes, verified clean"
    next_safe_action: "Move to 017 real bugs, then 020 can normalize gold expected-resources to credit the register"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-016-register-loader-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-design shared-register loader contract

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-register-loader-contract |
| **Completed** | 2026-06-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared operating register now loads on every task for the four modes whose prose mandates it. The fix has two parts.

The connectivity gate (`d5-connectivity.cjs`) gained a `resolveRoutedPath` helper that sanctions one specific cross-packet location: the parent packet's `shared/` dir. A nested mode packet loads family-wide docs like the register from `../shared/`, so that single hop up is a legitimate resource location rather than a path escape. Every other escape, including a sibling dir that merely shares the root name prefix, still fails the gate as a P0, and a sanctioned-but-missing file is still a dead resource path.

Each mandating mode now carries `../shared/register.md` in its machine `DEFAULT_RESOURCE` (the always-loaded slot), converted to the list form the parser accepts. The modes updated are design-interface, design-foundations, design-motion and design-audit. Their illustrative `RESOURCE_BASES` lines and the interface routing note were corrected so the prose and the machine block agree that the register loads. design-md-generator was left untouched because its prose cites the register once as a reference and does not mandate it on every task.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Reading the live mechanism showed the real defect. The register was kept out of the machine router on purpose because the gate flagged any `../` entry in `RESOURCE_MAP` as a P0 path escape, so it survived only as prose and never loaded during a deterministic replay. The router-replay resource set already folds in `DEFAULT_RESOURCE` and resolves `../` paths on disk, and the gate does not escape-check `DEFAULT_RESOURCE` entries, so the always-loaded slot is the natural home for the register. The explicit parent-shared sanction was added on top so the allowlist is intentional and documented rather than resting on a quiet gap, matching the recommendation in the 015 research.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Load the register via `DEFAULT_RESOURCE`, not `RESOURCE_MAP` | The always-loaded slot matches the every-task contract and avoids the `RESOURCE_MAP` escape check, so the register loads without a gate failure |
| Add an explicit parent-shared sanction to the gate | Makes the cross-packet allowlist intentional and durable, so a later hardening of the gate cannot silently break the register, while existence is still enforced |
| Include foundations, exclude md-generator | foundations references the register as a routing input, so aligning its machine block to its prose is honesty not new scope; md-generator does not mandate it on every task |
| Defer gold expected-resource normalization to 020 | The register loads as a default regardless of gold annotation, and the default-listing convention is inconsistent across modes today, so normalizing it belongs with the fixture-seeding phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| D5 connectivity gate on all five modes | PASS. score 100, gateFailed false, 0 path escapes, 0 dead paths each |
| Router replay loads `../shared/register.md` (interface, foundations, motion, audit) | PASS. register present in routed resources, 0 missing, on all four |
| Adversarial gate fixtures | PASS. a genuine `../evil.md` escape still fails P0, a sanctioned `../shared/register.md` passes, a sanctioned-but-missing file still fails as a dead path |
| Lane C vitest suites (skill-benchmark, sk-code drift guard, playbook mode) | PASS. 71 of 71 tests across the three suites |
| `package_skill.py --check` on the four touched modes | PASS on all four |
| `validate.sh --strict` on this packet | PASSED. 0 errors, 0 warnings |
| Guard posture unchanged outside the explicit shared dir | PASS. only the parent `shared/` dir is sanctioned, every other escape still fails |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Gold expected-resources do not yet credit the register.** The register loads on every task, but the manual playbook gold lists are not normalized to include it. This is handed to 020, which seeds reproducible fixtures. The live contract is correct regardless because the register loads as a default.
2. **The sanction is scoped to the sibling `shared/` dir.** Any future cross-packet resource outside `../shared/` would need its own explicit sanction by design, so the allowlist stays tight.
<!-- /ANCHOR:limitations -->

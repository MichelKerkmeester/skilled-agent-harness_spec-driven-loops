---
title: "Implementation Summary: Doc-Template Conformance"
description: "What the real sk-doc validators found when run against sk-code-obsidian and its sibling SURFACE packets, and why the shared findings were recorded rather than fixed."
trigger_phrases:
  - "implementation summary doc template conformance"
  - "sk-code-obsidian phase 012 findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/012-doc-template-conformance"
    last_updated_at: "2026-08-28T23:55:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Doc-template conformance audit"
    next_safe_action: "Surface-reality conformance (phase 013)"
    blockers: []
    key_files:
      - "../../../../Code_Environment/Public/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md"
      - "../../../../Code_Environment/Public/.opencode/skills/sk-doc/scripts/validate_document.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-doc-template-conformance |
| **Completed** | 2026-08-28 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A tool-run audit, not an eye-read one. No `/doc:quality` command exists in this runtime, and the
owning skill `sk-create-quality-control` ships no runnable script, so the audit used the three real
validators `sk-doc` exposes: `validate_skill_package.py`, `validate-playbook-package.cjs`, and
`validate_document.py`. Each was run once against the `sk-code-obsidian` packet, and the document
validator was then re-run against every sibling SURFACE packet to check whether this packet's
findings were unique to it.

### Findings, As Measured

1. **`validate_skill_package.py` — rc 0, PASS.** It reports `Detected kind: standalone` for what is
   actually a hub SURFACE packet. SURFACE packets deliberately carry no `graph-metadata.json` — a
   nested one would be a NESTED_IDENTITY violation — so the validator has no signal to detect
   `surface` and falls back to `standalone`. This is recorded as a finding against the validator's
   classification logic, not a defect in this packet.
2. **`validate-playbook-package.cjs --package` — rc 0, PASS.** Strict mode on, `tier=FAIL_CLOSED`,
   scenarios=7, violations=0, warnings=0. This packet is confirmed NOT in the warn list ten other
   packages sit in, `sk-code` and `sk-doc` themselves included.
3. **`validate_document.py` across every non-symlinked packet markdown — 34 PASS, 3 fail.** The three
   failures are all `missing_required_section`: `SKILL.md` (missing `when_to_use`, `smart_routing`,
   `how_it_works`), `manual-testing-playbook.md` (missing `overview`), and
   `references/quality/doc-quality-gate.md` (missing `overview`).
4. **The decisive comparison.** The same validator was run against every sibling SURFACE packet:
   `sk-code-mobile-cli` (3 missing), `sk-code-webflow` (4 missing), `sk-code-opencode` (4 missing).
   The template's own playbook index fails identically. Every SURFACE packet in the family diverges
   from the validator's expected section vocabulary the same way, and `sk-code-obsidian` is
   joint-best of the four. This is what turns the audit from "fix these three files" into "record why
   these three files are not fixed here."

### Why The Findings Were Not Fixed

Renaming `## 1. WHEN THE HUB BUNDLES THIS` to a generic vocabulary header (e.g. "When to Use") would
satisfy `validate_document.py` for `SKILL.md`. It was not applied, because the operator's binding
requirement is that this packet mirror `sk-code-mobile-cli` exactly — and `sk-code-mobile-cli` uses
the identical `## 1. WHEN THE HUB BUNDLES THIS` header. Renaming it here alone would trade one
validator finding for a real, family-wide inconsistency: this packet would become the only surface
in the family whose `SKILL.md` header no longer matches its siblings. The reversal condition is
explicit: if the SURFACE-packet class ever adopts the generic vocabulary, this packet's `SKILL.md`
follows in that same change — as a class-wide edit, not a unilateral one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Replace scaffold | This leaf's record of the audit already run |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`validate_skill_package.py` was run directly against the `sk-code-obsidian` packet root, returning
rc 0 with the `standalone`-kind detection noted in its output. `validate-playbook-package.cjs` was
run with `--package` against `sk-code-obsidian/manual-testing-playbook/`, returning rc 0 with strict
mode enabled and a `FAIL_CLOSED` tier confirmed against zero violations and zero warnings across all
7 scenarios. `validate_document.py` was then run across every non-symlinked markdown file in the
packet, producing 34 passes and 3 `missing_required_section` failures with the exact missing-section
names listed per file. To determine whether those 3 failures indicated a defect specific to this
packet, the identical document validator was re-run against `sk-code-mobile-cli`, `sk-code-webflow`,
and `sk-code-opencode`, and against the template's own playbook index — each showing the same class
of failure at 3, 4, 4, and one more respectively, confirming the divergence as structural to the
SURFACE packet class rather than isolated to this packet.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use the real `sk-doc` validators instead of inventing a `/doc:quality`-equivalent check | No such command exists in this runtime and `sk-create-quality-control` ships no runnable script; substituting an ad hoc check would not be an honest audit |
| Re-run `validate_document.py` against every sibling SURFACE packet before calling the 3 findings a defect | A finding that looks unique in isolation can turn out to be class-wide; the comparison is what makes the record accurate |
| Record the `standalone`-classification result as a validator finding, not a packet defect | A hub SURFACE packet correctly carries no `graph-metadata.json`; adding one to satisfy the validator would itself be a NESTED_IDENTITY violation |
| Do not rename `## 1. WHEN THE HUB BUNDLES THIS` | The operator's binding requirement is that this packet mirror `sk-code-mobile-cli` exactly; a unilateral rename would silence one validator finding while creating a real, family-wide inconsistency |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_skill_package.py <sk-code-obsidian>` | PASS — rc 0, `Detected kind: standalone` noted as a validator-classification finding |
| `validate-playbook-package.cjs --package <playbook>` | PASS — rc 0, strict on, tier=FAIL_CLOSED, scenarios=7, violations=0, warnings=0 |
| `validate_document.py` across packet markdown | 34 PASS, 3 `missing_required_section` (SKILL.md, manual-testing-playbook.md, references/quality/doc-quality-gate.md) |
| `validate_document.py` against `sk-code-mobile-cli` | 3 missing — same class of finding |
| `validate_document.py` against `sk-code-webflow` | 4 missing — same class of finding |
| `validate_document.py` against `sk-code-opencode` | 4 missing — same class of finding |
| `sk-code-obsidian` rank among the four SURFACE packets on this check | Joint-best (tied at 3, the lowest count observed) |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 3 `missing_required_section` findings are not fixed.** They are recorded as a class-wide,
   structural divergence between the SURFACE packet family's actual header vocabulary and the
   validator's expected generic section names. Fixing them here alone would break the operator's
   binding requirement that this packet mirror `sk-code-mobile-cli` exactly.
2. **The `standalone`-classification finding is not fixed.** It is a limitation in
   `validate_skill_package.py`'s detection logic for hub SURFACE packets, which carry no
   `graph-metadata.json` by design. Fixing it requires a change to shared `sk-doc` validator code,
   outside this packet's write boundary.
3. **The reversal condition is explicit, not implied.** If the SURFACE-packet class (`sk-code-obsidian`,
   `sk-code-mobile-cli`, `sk-code-webflow`, `sk-code-opencode`) ever adopts the generic section
   vocabulary together, this packet's `SKILL.md` follows in that same change. A future phase that
   renames only this packet's header without the others would recreate the exact inconsistency this
   phase avoided.

<!-- /ANCHOR:limitations -->

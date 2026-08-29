---
title: "Implementation Plan: Doc-Template Conformance"
description: "Execution plan for running the real sk-doc validators against sk-code-obsidian and every sibling SURFACE packet, and recording each result as measured."
trigger_phrases:
  - "obsidian doc template conformance plan"
  - "sk-code-obsidian phase 012 plan"
importance_tier: "high"
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
      - "../../../../Code_Environment/Public/.opencode/skills/sk-doc/scripts/validate_document.py"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Doc-Template Conformance

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation; validators are Python (`validate_skill_package.py`, `validate_document.py`) and Node (`validate-playbook-package.cjs`) — no plugin source touched |
| **Framework** | `sk-doc`'s own package and document validators, run directly rather than through a nonexistent `/doc:quality` command |
| **Storage** | Files on disk: four replaced spec-kit scaffolds in this leaf; no packet markdown edited |
| **Testing** | `validate_skill_package.py`, `validate-playbook-package.cjs --package`, `validate_document.py` against every non-symlinked packet markdown, plus the same document validator against three sibling SURFACE packets for comparison |

### Overview
This phase audits by tool, not by eye. `sk-create-quality-control` — the mode a `/doc:quality`
command would route through — ships no runnable script, and no such command exists in this runtime,
so the audit uses the three validators `sk-doc` actually exposes: the skill-package validator, the
playbook-package validator, and the per-document section validator. Each is run once against
`sk-code-obsidian` and its result recorded exactly. Where a result looks like a defect on first read
— the package validator's `standalone` classification, the document validator's three
`missing_required_section` failures — the same validator is re-run against the sibling SURFACE
packets (`sk-code-mobile-cli`, `sk-code-webflow`, `sk-code-opencode`) before any finding is written
down as unique to this packet. The `standalone` classification turns out to be a validator limitation
against hub SURFACE packets generally (they carry no `graph-metadata.json` by design). The missing
sections turn out to be a shared, structural divergence across the entire SURFACE packet class, with
this packet joint-best of the four. Neither is fixed by editing `SKILL.md`, because the operator's
binding requirement — this packet mirrors `sk-code-mobile-cli` exactly — takes precedence over
satisfying the validator's generic vocabulary in isolation.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed no `/doc:quality` command exists in this runtime.
- [x] Confirmed `sk-create-quality-control` ships no runnable script for this purpose.
- [x] Located the three real validators `sk-doc` exposes: `validate_skill_package.py`,
      `validate-playbook-package.cjs`, `validate_document.py`.

### Definition of Done
- [x] `validate_skill_package.py` run against `sk-code-obsidian`: rc 0, PASS, `Detected kind:
      standalone` noted and explained as a validator-classification finding against a hub SURFACE
      packet, not a packet defect.
- [x] `validate-playbook-package.cjs --package` run against
      `sk-code-obsidian/manual-testing-playbook/`: rc 0, PASS, strict on, tier=FAIL_CLOSED,
      scenarios=7, violations=0, warnings=0.
- [x] `validate_document.py` run across every non-symlinked packet markdown: 34 PASS, 3
      `missing_required_section` failures (`SKILL.md`; `manual-testing-playbook.md`;
      `references/quality/doc-quality-gate.md`).
- [x] The identical document validator re-run against `sk-code-mobile-cli` (3 missing),
      `sk-code-webflow` (4 missing), `sk-code-opencode` (4 missing), and the template's own playbook
      index, confirming the divergence is class-wide and this packet is joint-best.
- [x] The decision to leave `## 1. WHEN THE HUB BUNDLES THIS` unrenamed recorded with its reasoning
      and its explicit reversal condition.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Tool-verified audit with a comparison step before any finding is classified as a defect. A result
that looks wrong in isolation (a `standalone` classification, a missing section) is checked against
the same validator run on the closest comparable packets before it is written down as this packet's
problem.

### Key Components
- **Skill-package validator (`validate_skill_package.py`)**: run against the `sk-code-obsidian`
  packet root. Passes (rc 0) but reports `Detected kind: standalone` for what is actually a hub
  SURFACE packet. SURFACE packets deliberately carry no `graph-metadata.json` — a nested one would be
  a NESTED_IDENTITY violation — so the validator has no signal to detect the `surface` kind and falls
  back to `standalone`. Recorded as a finding against the validator's classification logic.
- **Playbook-package validator (`validate-playbook-package.cjs`)**: run with `--package` against the
  manual-testing-playbook directory. Passes cleanly: strict mode on, `tier=FAIL_CLOSED`, 7 scenarios,
  0 violations, 0 warnings. This packet is confirmed NOT in the warn list ten other packages
  (including `sk-code` and `sk-doc` themselves) sit in.
- **Document validator (`validate_document.py`)**: run across every non-symlinked markdown file in
  the packet. 34 files pass; 3 fail on `missing_required_section` — `SKILL.md` is missing
  `when_to_use`, `smart_routing`, `how_it_works`; `manual-testing-playbook.md` and
  `references/quality/doc-quality-gate.md` are each missing `overview`. The content those sections
  would cover exists under this packet's own headers (e.g. `## 1. WHEN THE HUB BUNDLES THIS`,
  `## 2b. SMART ROUTING (machine-readable)`) — the validator is checking for specific literal
  section names it does not find, not for the absence of the underlying content.
- **Cross-sibling comparison (the decisive step)**: the same `validate_document.py` pass run against
  every other SURFACE packet in the family. `sk-code-mobile-cli` shows 3 missing, `sk-code-webflow`
  shows 4, `sk-code-opencode` shows 4, and the template's own playbook index fails identically. Every
  SURFACE packet diverges the same way; this packet is joint-best of the four. This is what turns the
  012 audit from "fix these three files" into "record why these three files are not fixed here."
- **Withheld fix, with a reversal condition**: renaming `## 1. WHEN THE HUB BUNDLES THIS` to a
  generic vocabulary header would satisfy `validate_document.py` for `SKILL.md`, but the operator's
  binding requirement is that this packet mirror `sk-code-mobile-cli` exactly. Renaming here alone
  would make this packet the only surface in the family whose `SKILL.md` header no longer matches its
  siblings — trading one validator finding for a real, family-wide inconsistency. The fix is deferred
  to a class-wide change: if the SURFACE-packet vocabulary is ever standardized, this packet's
  `SKILL.md` follows in that same change.

### Data Flow
`sk-doc validators` -> run once against `sk-code-obsidian` -> record exact rc/figures.
`suspicious result (standalone classification, missing sections)` -> re-run same validator against
siblings -> classify as class-wide structural finding or packet-specific defect.
`class-wide finding + binding mirror requirement` -> record decision not to fix, with reversal
condition -> this leaf's own docs.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase
state. In brief: confirm no `/doc:quality` command or `sk-create-quality-control` script exists, run
the three real validators against this packet, re-run the document validator against the three
sibling SURFACE packets and the template's playbook index for comparison, then write this leaf's docs
recording every result and the reasoning behind each accepted-not-fixed finding.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Skill-package validation | Confirm the packet passes package-level structural checks | `validate_skill_package.py <sk-code-obsidian path>` (rc 0, PASS, `Detected kind: standalone` noted) |
| Playbook-package validation | Confirm the manual-testing-playbook passes strict, fail-closed validation | `validate-playbook-package.cjs --package <playbook path>` (rc 0, PASS, strict on, tier=FAIL_CLOSED, scenarios=7, violations=0, warnings=0) |
| Per-document section validation | Confirm every packet markdown against required sections | `validate_document.py` across every non-symlinked packet markdown (34 PASS, 3 `missing_required_section`) |
| Cross-sibling comparison | Confirm whether the 3 failures are unique to this packet or class-wide | `validate_document.py` against `sk-code-mobile-cli` (3 missing), `sk-code-webflow` (4 missing), `sk-code-opencode` (4 missing), and the template's playbook index |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-doc/sk-create-skill/scripts/validate_skill_package.py` | Internal | Green — rc 0 | The only tool that checks package-level structural conformance for this packet |
| `sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Internal | Green — rc 0 | The only tool that checks the playbook package strictly, fail-closed |
| `sk-doc/scripts/validate_document.py` (and `sk-doc/shared/scripts/validate_document.py`) | Internal | Green on 34/37 files — 3 known, class-wide `missing_required_section` findings | The only per-document section validator this runtime has; no `/doc:quality` command exists as an alternative |
| Sibling SURFACE packets (`sk-code-mobile-cli`, `sk-code-webflow`, `sk-code-opencode`) | Internal | Read-only comparison targets | Without this comparison, the 3 findings would be misclassified as unique defects instead of a class-wide, structural divergence |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator result recorded here is later found to be stale (re-running it returns a
  different rc or figure), or the decision not to rename `## 1. WHEN THE HUB BUNDLES THIS` is
  reversed because the SURFACE-packet class adopts the generic vocabulary together.
- **Procedure**: this phase touches only its own four spec-kit leaf files; `git checkout` on them
  restores the pre-phase scaffold state. No packet markdown, validator script, or hub configuration
  file is modified by this phase, so there is nothing else to roll back. If the reversal condition is
  met, the header rename becomes a class-wide change applied to all four SURFACE packets together,
  tracked in a future phase — not a unilateral edit to this packet alone.

<!-- /ANCHOR:rollback -->

---
title: sk-doc Known-Deviation Suppression List
description: The seeded sk-doc known-deviation list for deep-alignment's ADR-005 suppression invariant, seeded from real 130-packet findings and re-verified against live validator config, not invented.
trigger_phrases:
  - "sk-doc known deviations"
  - "known deviation suppression list"
  - "alignment suppression list sk-doc"
  - "toc ban compact pointer card kebab case"
importance_tier: important
contextType: reference
version: 1.0.0.2
---

# sk-doc Known-Deviation Suppression List

The sk-doc authority's known-deviation list for deep-alignment's ADR-005 suppression invariant: intentional repo conventions the mode must never flag as drift.

---

## 1. OVERVIEW

### Purpose

ADR-005 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-005`) requires every authority adapter's `standardSource` to carry a known-deviation list so a real repo-wide convention is never flagged as drift. Every entry below traces to a real, already-discovered finding from the 130-packet's manual precedent review, not a hypothetical.

### Source of Truth

This document is the single source of truth for sk-doc's suppression rules. The fenced `json` block in Section 8 is parsed directly by `scripts/adapters/sk-doc.cjs`'s `loadKnownDeviations()` at runtime. There is no separate, hand-synced copy of this list in code. Editing a deviation means editing it here, once.

### Re-Verification Discipline

Each entry below was re-probed against live repo state while this list was authored (2026-07-11), not copy-pasted from the 130-packet review unchecked. Three of the five entries turned out to be currently **dormant**: they do not map to any finding type either `validate_document.py` or `extract_structure.py` can presently emit, so there is nothing for `sk-doc.cjs`'s deterministic layer to suppress today. They are kept as documented precedent for the reasoning-agent layer (so a human or LLM reviewer does not independently re-flag them) and for any future deterministic-layer extension. This distinction is itself a VERIFY-FIRST finding, not an assumption. See each entry's "Live-Reality Check".

---

## 2. TOC-POLICY DETECTOR BEHAVIOR

**Deviation name**: Repo-wide TOC ban

**Why it is not a violation**: `core-standards.md` Section 3's TOC Policy Summary states a document never gets a Table of Contents, for any document type: "NEVER add a Table of Contents to any document type." `validate_document.py`'s own module docstring nonetheless still describes "proper TOC" as part of its historical default checklist (`validate_document.py:10`), which reads as a live contradiction until checked against the actual per-type rule data.

**Evidence**:
- `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:14`, "Established corpus-wide gaps were not findings: TOC-policy detector behavior..."
- `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-002.md:116`, "Expected gaps not filed: repository-wide TOC policy..."
- `.opencode/skills/sk-doc/shared/references/core-standards.md:88-89`, TOC Policy Summary, "NEVER add a Table of Contents to any document type."

**Match rule**: suppresses `missing_toc` findings from `validate_document.py`'s `validate_toc()` check, for every document type.

**Live-Reality Check (2026-07-11)**: re-read `.opencode/skills/sk-doc/shared/assets/template-rules.json` directly (the file `validate_document.py`'s own `load_template_rules()` reads at `validate_document.py:103-111`). Every one of its 12 `documentTypes` entries (`readme`, `skill`, `command`, `install_guide`, `reference`, `asset`, `changelog`, `playbook`, `spec`, `agent`, `playbook_feature`, `feature_catalog`) has `tocRequired: false`. Since `validate_toc()` returns immediately with zero errors whenever `tocRequired` is false (`validate_document.py:244-246`), `missing_toc` cannot fire against any document today. **This entry is currently dormant, not currently load-bearing.** It is kept as defense-in-depth in case `tocRequired` is ever flipped back to `true` for a type, and as a plain record of why the historical docstring language at `validate_document.py:10` no longer matches the live config.

---

## 3. COMPACT POINTER-CARD ASSET SHAPE

**Deviation name**: Compact pointer-card DQI shape

**Why it is not a violation**: a short, intentionally minimal document (for example an embedded remote-MCP-server pointer README) is not penalized for brevity alone, provided it still passes `validate_document.py`'s structural gate (all required sections present). The 130-packet review draws this line explicitly rather than treating "compact" as a blanket exemption.

**Evidence**:
- `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:14`, "...compact pointer-card shape..." listed among established, non-finding gaps.
- The same iteration's R1-P0-001/002/003 (`iteration-001.md:20-57`) show the boundary concretely: three embedded-server READMEs were reviewed for exactly this exemption ("Counterevidence sought: Checked whether this was an established compact pointer-card exception") and the exemption was explicitly **rejected** for them, because they failed `validate_document.py`'s required-section gate outright (`missing_required_section: overview`), not merely because they were short. Their DQI-floor miss (R1-P1-001, `iteration-001.md:113-117`) was correspondingly **not suppressed** either, because the structural gate had already failed first.

**Match rule**: suppresses `dqi-below-threshold` (P2) findings only when, in the same `check()` call, `validate_document.py` exits `0` for that artifact (structurally conformant) AND `artifact.docType` is `readme` or `asset`. Never suppresses `missing_required_section` or any other blocking (P0) finding. That boundary is load-bearing, per the counterevidence check above.

**Live-Reality Check (2026-07-11)**: the DQI floor itself (75) is not a value read from `extract_structure.py`. That script only classifies a total into qualitative bands (`excellent >=90`, `good >=75`, `acceptable >=60`, `needs_work <60`, `extract_structure.py:1119-1130`) with no pass/fail semantics of its own. `75` is a review-contract policy constant carried forward from the 130-packet's real threshold (`iteration-001.md:13`, `:113-117`, `iteration-002.md:42`), not a value this adapter invented independently.

---

## 4. KEBAB-CASE LEGACY FILENAME REFERENCES

**Deviation name**: Kebab-case legacy filename references

**Why it is not a violation**: `core_standards.md` Section 2 sets lowercase snake_case as the filename convention, with three explicit, named exceptions (`README.md`, `SKILL.md` and packet-local numbered docs like `NNN-name.md`). Some in-repo references still point at older kebab-case filenames predating a rename sweep. These are treated as an accepted legacy carryover, not fresh drift.

**Evidence**:
- `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:14`, "...kebab-case legacy references..." listed among established, non-finding gaps.
- `.opencode/skills/sk-doc/shared/references/core-standards.md:37-51`, Section 2 filename conventions and named exceptions.

**Match rule**: none currently. `matchTypes` is empty. See Live-Reality Check.

**Live-Reality Check (2026-07-11)**: neither `validate_document.py` nor `extract_structure.py` contains a filename-casing check anywhere in their real code (confirmed by reading both scripts in full: the only filename-shaped logic either file has is `detect_document_type()`'s path/filename pattern matching for classification, not a convention check). `core-standards.md` Section 5's Quick Reference table attributes filename-casing enforcement to `scripts/quick_validate.py`, a **third** sk-doc script this adapter does not wrap (out of this phase's scope: see `sk-doc-adapter.md` Section 1). **This entry is currently dormant for `sk-doc.cjs`'s deterministic layer**. It exists to keep a reasoning-agent-layer reviewer from independently flagging a kebab-case reference as drift, and as a forward record for if a filename check is ever added to this adapter's `check()`.

---

## 5. CLI-FAMILY `hard_rules` FRONTMATTER

**Deviation name**: cli-family `hard_rules` frontmatter field

**Why it is not a violation**: `cli-opencode` and `cli-claude-code` (the two dispatch skills under `cli-external/`) declare a `hard_rules:` frontmatter block beyond the minimum SKILL.md frontmatter fields `core-standards.md` Section 7 lists (`name`, `description`, `allowed-tools`). This is an intentional, family-specific extension consumed by their own dispatch-preflight tooling, not an unrecognized or stray field.

**Evidence**:
- `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md:14`, "...cli-family `hard_rules` frontmatter..." listed among established, non-finding gaps.
- `.opencode/skills/cli-external/cli-claude-code/SKILL.md:6` and `.opencode/skills/cli-external/cli-opencode/SKILL.md:6`, both declare `hard_rules:` in their live frontmatter (re-confirmed by direct grep, 2026-07-11).
- `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs:5,14,21` and `.opencode/skills/cli-external/cli-opencode/scripts/lib/dispatch-rule-checks.mjs:3,22,33`, the field is actively read and enforced by real, live dispatch tooling, not vestigial.

**Match rule**: none currently. `matchTypes` is empty. See Live-Reality Check.

**Live-Reality Check (2026-07-11)**: `validate_document.py` has no "closed frontmatter schema" check for `skill`-type documents anywhere in its real code. Its only frontmatter-schema enforcement is `validate_agent_frontmatter()` (`validate_document.py:632-715`), and that function only runs for `doc_type == 'agent'`, never `'skill'`. An extra field like `hard_rules:` on a SKILL.md frontmatter block cannot trigger a finding from either wrapped tool today. **This entry is currently dormant for `sk-doc.cjs`'s deterministic layer**, kept for the reasoning-agent layer and as forward precedent.

---

## 6. CHANGELOG PLAIN-H2, NO-TOC CONVENTION

**Deviation name**: Changelog plain-H2, no-TOC shape

**Why it is not a violation**: changelog files use a plain `## What Changed` heading (not the numbered, ALL-CAPS `## N. SECTION` shape other document types require) and never carry a TOC, and this shape is the live, working convention across this hub's own changelogs, not an unaddressed gap.

**Evidence**:
- `.opencode/skills/system-deep-loop/deep-review/changelog/v1.0.0.0.md:1-10`, the cited live precedent (plain prose intro, `---` divider, plain `#### <subsection>` headings, no numbered/caps H2, no TOC).
- `.opencode/skills/system-deep-loop/deep-alignment/changelog/v1.0.0.0.md:1-24`, this packet's own changelog, independently confirming the same shape (`## What Changed` at line 7, plain `#### <subsection>` entries beneath it, no TOC).

**Match rule**: none currently. See Live-Reality Check. This entry documents a live, working structural precedent rather than a suppressed validator finding type.

**Live-Reality Check (2026-07-11)**: `template-rules.json`'s `changelog` entry has `tocRequired: false` and `h2EmojiRequired: false` (confirmed by direct read, 2026-07-11), consistent with the observed live files. Phase 003's own re-verification (`003-scaffold-mode-packet/implementation-summary.md`, Known Limitations #4) separately flagged a cosmetic difference between the two cited changelogs (the `## What Changed` H2 wrapper is present in `deep-alignment`'s own changelog but absent in `deep-review`'s) and judged it non-blocking. This document restates that finding rather than re-litigating it, since it does not change this entry's suppression scope.

---

## 7. SCOPE OF THIS LIST

**In scope**: sk-doc authority only. Each other authority adapter (sk-git, sk-design, sk-code, per phases 006/007) owns its own known-deviation list under its own `standardSource`, per ADR-005's per-authority requirement. This document does not attempt to anticipate their conventions.

**Not a dumping ground**: per `spec.md` REQ-003's acceptance criteria and the phase's own risk register, every entry here traces to a real prior finding or an explicit repo-wide convention. An entry that stops matching real repo state gets flagged for operator review at REPORT time (`spec.md` L2 Edge Cases, "State Transitions"), not silently dropped or silently kept. The dormant-entry notes above are exactly that kind of flag, surfaced at authoring time instead of waiting for a REPORT-state review.

---

## 8. MACHINE-READABLE DEVIATION LIST

`scripts/adapters/sk-doc.cjs` parses this fenced block directly (see that file's `loadKnownDeviations()`). Keep it byte-consistent with Sections 2-6 above. This block is the operative rule set, the prose above is the human-readable rationale for the same rules.

```json
{
  "authority": "sk-doc",
  "version": "1.0.0",
  "generatedFrom": "sk-doc-known-deviations.md Section 8, hand-maintained alongside Sections 2-6",
  "deviations": [
    {
      "id": "repo-wide-toc-ban",
      "name": "Repo-wide TOC ban",
      "appliesToLayer": "deterministic",
      "matchTypes": ["missing_toc"],
      "matchSubcheck": "template-conformance",
      "matchDocTypes": null,
      "requiresValidatorExitZero": false,
      "status": "dormant",
      "evidence": [
        "iteration-001.md:14",
        "iteration-002.md:116",
        "core-standards.md:88-89"
      ]
    },
    {
      "id": "compact-pointer-card-dqi",
      "name": "Compact pointer-card DQI shape",
      "appliesToLayer": "deterministic",
      "matchTypes": ["dqi-below-threshold"],
      "matchSubcheck": "template-conformance",
      "matchDocTypes": ["readme", "asset"],
      "requiresValidatorExitZero": true,
      "status": "active",
      "evidence": [
        "iteration-001.md:14",
        "iteration-001.md:20-57",
        "iteration-001.md:113-117"
      ]
    },
    {
      "id": "kebab-case-legacy-references",
      "name": "Kebab-case legacy filename references",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": null,
      "matchDocTypes": null,
      "requiresValidatorExitZero": false,
      "status": "dormant",
      "evidence": [
        "iteration-001.md:14",
        "core-standards.md:37-51"
      ]
    },
    {
      "id": "cli-family-hard-rules-frontmatter",
      "name": "cli-family hard_rules frontmatter field",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": null,
      "matchDocTypes": null,
      "requiresValidatorExitZero": false,
      "status": "dormant",
      "evidence": [
        "iteration-001.md:14",
        "cli-claude-code/SKILL.md:6",
        "cli-opencode/SKILL.md:6"
      ]
    },
    {
      "id": "changelog-plain-h2-no-toc",
      "name": "Changelog plain-H2, no-TOC convention",
      "appliesToLayer": "reasoning-agent",
      "matchTypes": [],
      "matchSubcheck": null,
      "matchDocTypes": ["changelog"],
      "requiresValidatorExitZero": false,
      "status": "dormant",
      "evidence": [
        "deep-review/changelog/v1.0.0.0.md:1-10",
        "deep-alignment/changelog/v1.0.0.0.md:1-24"
      ]
    }
  ]
}
```

---

## 9. REFERENCES AND RELATED RESOURCES

- [sk-doc-adapter.md](./sk-doc-adapter.md): the full `standardSource`/`discover`/`check` specification this list is loaded by.
- [sk-doc.cjs](../../scripts/adapters/sk-doc.cjs): the reference wiring script. `loadKnownDeviations()` parses Section 8's fenced block.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHOR `adr-005`): the alignment contract this list satisfies.

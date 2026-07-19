---
title: Evergreen Packet ID Rule
description: Prevents runtime-state documentation from referencing mutable spec or phase packet numbers.
trigger_phrases:
  - "evergreen packet id rule"
  - "no packet numbers in docs"
  - "runtime state documentation rule"
  - "feature names over packet ids"
importance_tier: important
contextType: general
version: 1.8.0.6
---

# Evergreen Packet ID Rule

Evergreen documents describe the current runtime, not the packet history that produced it.

---

## 1. OVERVIEW

### Core Principle

Packet numbers rot — feature names and source anchors don't.

### When to Use

Apply this rule whenever you author or edit any document that describes shipped runtime behavior:

- Repository-wide governance: `AGENTS.md`, `CLAUDE.md`, root `README.md`
- Skill reference docs: `SKILL.md`, `ARCHITECTURE.md`, `references/**/*.md`
- Folder-level READMEs: `mcp-server/README.md`, sub-folder READMEs
- Capability catalogs: `feature-catalog/**/*.md`, `manual-testing-playbook/**/*.md`
- Configuration references: `ENV-REFERENCE.md`, `INSTALL-GUIDE.md`

Skip this rule for spec-local docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `research-report.md`, `audit-findings.md`, `migration-plan.md`) — those ARE the packet record and naturally reference their own packet ID.

### Prerequisites

- Read [core-standards.md](./core-standards.md) for document type rules.
- Read [readme-template.md](../../create-readme/assets/readme-template.md), [feature-catalog-template.md](../../create-feature-catalog/assets/feature-catalog-template.md), and [manual-testing-playbook-template.md](../../create-manual-testing-playbook/assets/manual-testing-playbook-template.md) — these templates already enforce evergreen authoring patterns.
- Confirm the doc class (spec-local vs evergreen) before applying the audit grep, because spec-local docs are exempt by design.

---

## 2. DOCUMENT CLASSES

| Class | Examples | Packet IDs Allowed |
| --- | --- | --- |
| Spec-local docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `research-report.md`, `audit-findings.md`, `migration-plan.md` | Yes |
| Evergreen docs | `README.md`, `INSTALL-GUIDE.md`, `ARCHITECTURE.md`, `SKILL.md`, `AGENTS.md`, `CLAUDE.md`, `references/**/*.md`, `feature-catalog/**/*.md`, `manual-testing-playbook/**/*.md`, `ENV-REFERENCE.md` | No |

Spec-local docs may reference packet numbers because they are the packet record. Evergreen docs must describe the shipped state by feature name, command, file path, and source anchor.

---

## 3. EXAMPLES

**❌ BAD evergreen references:**

- "Added in packet 033"
- "Closes 013 P1-1"
- "Per 037/005 migration"
- "Shipped via 028"

**✅ GOOD evergreen references:**

- "Defined at `mcp-server/handlers/memory-retention-sweep.ts:42`"
- "Run `npm run stress` from `mcp-server/`"
- "See `references/config/hook-system.md` for the hook contract"

**Why better:** Feature-name + source-anchor references stay valid after packet renumbering, archival, or consolidation.

---

## 4. AUDIT SELF-CHECK

When auditing evergreen docs, search candidate files for packet-history references before publishing:

```bash
grep -nE '\b\d{3}-[a-z-]+\b|\b03[0-9]/00[0-9]\b|\bF-013-[0-9]+|\bP1-[0-9]+|\bpacket [0-9]{3}|\bphase [0-9]{3}|\bfrom packet|\bin packet|\bvia packet' <FILE>
```

Treat stable feature IDs, scenario IDs, and file names as false positives only when they identify current runtime artifacts rather than the packet that created them. Document any kept false positives in the audit record.

---

## 5. MIGRATION GUIDANCE

When removing packet IDs from evergreen docs:

- Replace packet-history phrases with the current feature name and source anchor.
- Prefer file paths with line numbers when the implementation anchor matters.
- Link to the current reference document when the behavior is documented elsewhere.
- Remove "Recent changes" or "History" sections unless they describe current compatibility guarantees.
- Move packet-history notes into packet-local `implementation-summary.md` when the history still matters.

The target sentence should remain true after packet renumbering.

---

## 6. RELATED RESOURCES

### Templates

- [feature-catalog-template.md](../../create-feature-catalog/assets/feature-catalog-template.md) — feature catalog evergreen-authoring shape
- [feature-catalog-snippet-template.md](../../create-feature-catalog/assets/feature-catalog-snippet-template.md) — per-feature snippet shape (OVERVIEW / CURRENT REALITY / SOURCE FILES / SOURCE METADATA)
- [manual-testing-playbook-template.md](../../create-manual-testing-playbook/assets/manual-testing-playbook-template.md) — playbook authoring shape
- [readme-template.md](../../create-readme/assets/readme-template.md) — README authoring shape
- [skill-reference-template.md](../../create-skill/assets/skill/skill-reference-template.md) — reference file structure (this file's own template)

### Standards

- [core-standards.md](./core-standards.md) — document type rules and frontmatter conventions
- [hvr-rules.md](./hvr-rules.md) — high-value content rules used by sk-doc validation


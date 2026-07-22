---
title: "Feature Specification: Existing-README Cleanup"
description: "Surgically repair the pre-existing older skill and code READMEs the audit flagged: fix real stale-path broken references and add missing OVERVIEW sections, scoped to genuine skill/code READMEs and leaving spec-folder, archive, fixture and false-positive files alone."
trigger_phrases:
  - "existing readme cleanup"
  - "stale broken reference repair"
  - "missing overview backfill"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/008-existing-readme-cleanup"
    last_updated_at: "2026-07-22T15:16:58Z"
    last_updated_by: "claude"
    recent_action: "Repaired 64 older READMEs (broken refs + OVERVIEW) and deleted the stale __tests__ duplicate."
    next_safe_action: "Proceed to phase 009 (Title-Case + config flip + code findings)."
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/references/README.md"
      - ".opencode/skills/sk-design/styles/scripts/README.md"
---

# Feature Specification: Existing-README Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-22 |
| **Branch** | `sk-doc/0097-documentation-quality` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `audit_readmes.py` fleet sweep flagged 70 template-invalid READMEs, 177 broken references and 68 missing-OVERVIEW findings across the repo's 593 READMEs. The raw numbers were inflated: the reference-resolution heuristic treats gitignored `dist/` artifacts, NodeNext `.js` import specifiers on `.ts` sources, self-referential diagram labels, and bracket-placeholder examples as broken links. A large share of the flagged files are also spec-folder docs, archived specs and test fixtures that legitimately do not follow the code/skill README template. The genuine, worth-fixing set is the older skill and code READMEs carrying real stale-path references from moves and renames, plus those genuinely missing an OVERVIEW.

### Purpose

Surgically repair the genuine skill and code READMEs: trace each real stale reference to where its target actually moved and update the link, add a numbered ALL-CAPS OVERVIEW where one is truly missing, and leave the false positives and out-of-scope files untouched. Also action the operator-approved deletion of the stale `design-mcp-open-design/__tests__` duplicate.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Repair real broken references in the ~74 genuine skill/code READMEs by locating the moved target and fixing the link, or rewording a genuinely-dead reference.
- Add a numbered ALL-CAPS OVERVIEW to the ~28 genuine READMEs missing one.
- Delete the stale byte-identical `sk-design/design-mcp-open-design/__tests__` duplicate.

### Out of Scope

- Spec-folder (`.opencode/specs/**`), archive (`z-future`, `backup`) and fixture/example READMEs, which follow their own conventions.
- The repo-wide HVR sweep (pre-existing em dashes in untouched content).
- The Title-Case offenders and the `h2UppercaseRequired` config flip (phase 009).
- Any change to the code the READMEs document, apart from the approved duplicate deletion.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P2 | Each repaired broken reference resolves to a real current path from its README's own folder, located on disk, never fabricated. |
| REQ-002 | P2 | Genuinely-dead references are reworded honestly rather than repointed to an invented path. |
| REQ-003 | P2 | Each in-scope README missing an OVERVIEW gains a numbered ALL-CAPS one, reusing existing lead prose without inventing content. |
| REQ-004 | P2 | False positives (gitignored `dist`, NodeNext `.js` specifiers, self-refs, placeholders) and out-of-scope files are left untouched. |
| REQ-005 | P2 | Every touched README reports VALID under `validate_document.py --type readme`, with no new HVR violations in authored prose. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The audit's template-invalid and broken-reference counts drop measurably (70 to 43 and 177 to 119 respectively), driven by the genuine fixes.
- Every touched README is floor-VALID and every repaired link resolves on disk.
- No em dashes appear in any line the swarm added (pre-existing em dashes in untouched content are out of scope).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Chasing heuristic noise.** Mitigated by a verified real-vs-false-positive triage before dispatch and a per-file on-disk check, so agents left false positives alone.
- **Fabricated fix paths.** Mitigated by the "locate the real target first, never guess" rule; dead refs were reworded, not invented.
- **Force-conforming the wrong files.** Mitigated by excluding spec-folder, archive and fixture READMEs from the target set.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- The repair is surgical: only the flagged issues change, existing correct content and voice are preserved.
- Coverage gaps are legible: excluded files and left false positives are documented, not silent.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- `commands/create/README.md` does not exist as a distinct file; macOS case-folding resolves it to the `readme.md` command router, which correctly has no OVERVIEW and was left untouched.
- `templates/changelog/README.md` sits in a validator-excluded template directory; it is exempt, not invalid.
- NodeNext `.js` import specifiers on `.ts` sources are correct as written and were not changed to `.ts`.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether the deferred repo-wide HVR sweep (pre-existing em dashes across untouched older content) is worth a dedicated pass is left for a future decision.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).
- `../spec.md` and `../context-index.md` (the 021 program parent).
- Previous phase: [`007-code-readmes-deep-loop`](../007-code-readmes-deep-loop/spec.md).

<!-- /ANCHOR:related-docs -->

---
title: "Acceptance Criteria: Phase 6: evidence-gated-provenance"
description: "The criteria this packet must satisfy before it may be closed."
trigger_phrases:
  - "evidence gated provenance acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: evidence-gated-provenance

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance
**Level:** 2
**Status:** Planned
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a document of a known level, When heal-spec-docs compares its anchors, Then it stamps only when the set equals the set rendered for that level | Vitest: exact level match stamps, superset and subset do not | Unmet | - |
| AC-002 | REQ-002 | Given `check-template-staleness.sh --auto-upgrade` on a fixture with an old marker, When it runs, Then it prints "removed, use upgrade-legacy", exits 2 and leaves the file byte-identical | Vitest runs the script and compares output, exit code and file hash | Unmet | - |
| AC-003 | REQ-003 | Given a markerless or old-marker document, When heal-spec-docs runs, Then no marker is added or bumped | Vitest fixture compares the document before and after | Unmet | - |
| AC-004 | REQ-004 | Given MIGRATION.md, When it is read, Then it states the never-invent-history rule and matches the code | grep for the rule in MIGRATION.md | Unmet | - |
| AC-005 | REQ-005 | Given the repo outside specs/, When it is searched, Then no script calls `--auto-upgrade` | `rg -n "auto-upgrade" .skilled --glob '!**/node_modules/**'` finds only the retired branch and its test | Unmet | - |
| AC-006 | General | Given this spec packet, When validate.sh --strict runs, Then all pass | bash validate.sh /path --strict shows RESULT: PASSED | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No (Planned)

This packet is closeable when all six criteria are Met. The --auto-upgrade decision was made by the operator on 2026-10-08 (retire) and is recorded in spec.md section 10. AC-001 through AC-005 require code changes and tests. AC-006 requires validation to pass.
<!-- /ANCHOR:closure -->

---


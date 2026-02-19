<!-- SPECKIT_LEVEL: 3 -->
# Decision Record: Documentation Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

---

<!-- ANCHOR:decisions -->
## Decisions

### ADR-007-001: Scope to existing README patterns only

**Status:** Accepted
**Date:** 2026-02-19

**Context:** The 30+ files needing updates each follow different README conventions (HVR format, ANCHOR tags, module tables). We could standardize all READMEs to a single format or preserve existing patterns.

**Decision:** Preserve each README's existing format and pattern. Only add missing content; do not restructure.

**Rationale:** Restructuring would create unnecessary diff noise, risk breaking ANCHOR tags that the memory system depends on for indexing, and increase review burden. The goal is alignment, not reformatting.

**Consequences:** Some READMEs will remain in slightly different styles. Acceptable trade-off for lower risk and faster delivery.

---

### ADR-007-002: Feature flags documented in 3 locations

**Status:** Accepted
**Date:** 2026-02-19

**Context:** `SPECKIT_ADAPTIVE_FUSION` and `SPECKIT_EXTENDED_TELEMETRY` need documentation. Options: (A) single canonical location, (B) 3 locations for discoverability.

**Decision:** Document both flags in Skill README, MCP Server README, and INSTALL_GUIDE. Each location gets the same table format: flag name, default value, purpose, source file.

**Rationale:** Users access documentation through different entry points. A developer might read the MCP Server README; a new user reads the INSTALL_GUIDE; an AI assistant reads SKILL.md. All three should surface the flags.

**Consequences:** Minor duplication (one table in 3 places). Acceptable because flag lists change rarely and the cost of missing a flag in a key doc is higher than the cost of maintaining 3 copies.

---

### ADR-007-003: New folder READMEs follow existing lib subfolder pattern

**Status:** Accepted
**Date:** 2026-02-19

**Context:** Three new folders (`contracts/`, `telemetry/`, `extraction/`) need READMEs. Options: (A) minimal stub, (B) full pattern matching existing lib subfolder READMEs.

**Decision:** Full pattern match. Each new README includes: purpose section, module count, file listing with descriptions, key exports table, and ANCHOR tags.

**Rationale:** Consistency with existing READMEs ensures the memory system indexes them correctly and developers can navigate them the same way. A stub would be insufficient for memory retrieval.

---

### ADR-007-004: Memory commands get targeted updates, not rewrites

**Status:** Accepted
**Date:** 2026-02-19

**Context:** The 5 memory command files have stale tool signature documentation. Options: (A) full rewrite, (B) targeted additions to existing parameter lists and behavior descriptions.

**Decision:** Targeted additions only. Add missing parameters, feature flag context, and mutation-ledger notes to existing sections. Do not restructure command flow or change execution logic.

**Rationale:** Memory commands are execution engines (YAML-backed workflows). Restructuring them risks breaking command behavior. The gap is informational (missing parameter docs), not structural.
<!-- /ANCHOR:decisions -->

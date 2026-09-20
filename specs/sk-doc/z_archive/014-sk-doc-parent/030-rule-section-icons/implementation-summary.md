---
title: "Implementation Summary: Rule-section icon standardization across SKILL.md files"
description: "Applied ✅ ALWAYS · ⛔ NEVER · ⚠️ ESCALATE IF uniformly across 42 SKILL.md files in 11 hubs via one idempotent sweep, unifying 8 stray ❌ headers to ⛔; sk-doc packaging stayed 11/11 PASS and every affected parent hub passed parent-skill-check STRICT."
trigger_phrases:
  - "rule section icons summary"
  - "014 sk-doc phase 030 summary"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/030-rule-section-icons"
    last_updated_at: "2026-07-17T14:36:44Z"
    last_updated_by: "claude-opus"
    recent_action: "Icon sweep complete + validated; ready to ship"
    next_safe_action: "Ship with the sk-doc router commit; user pulls in IDE"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-rule-section-icons |
| **Completed** | 2026-07-14 (applied + validated in worktree; ships with the sk-doc router commit) |
| **Level** | 1 |
| **Deliverable** | Uniform ✅/⛔/⚠️ rule-section icons across 42 SKILL.md files in 11 hubs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The SKILL.md fleet had a half-adopted icon convention: 13 files carried `✅ ALWAYS / ❌ NEVER / ⚠️ ESCALATE IF`, the rest were plain. One idempotent Python sweep (`scratchpad/icon-sweep.py`) normalized every rule header to **✅ ALWAYS · ⛔ NEVER · ⚠️ ESCALATE IF**, converting the 8 stray `❌ NEVER` headers to `⛔` so the negative glyph is uniform. The `## RULES` H2 stays plain per operator preference, and incidental prose headers ("First Step (Always)", "the always-current live branch") are left untouched.

### Files Changed
42 SKILL.md across 11 hubs — sk-doc (11), sk-design (7), system-deep-loop (6), cli-external-orchestration (4), mcp-tooling (4), sk-code (3), sk-prompt (3), mcp-code-mode (1), sk-git (1), system-code-graph (1), system-spec-kit (1) — 95 header lines.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A single idempotent sweep: strip any existing leading glyph from a rule header, re-apply the canonical one. Only headers whose text IS the rule keyword (plus `… Rules` and combined `ALWAYS / NEVER (…)` variants) match, so prose headers are safe. A dry-run previewed all 95 changes before applying; a re-run confirmed zero further changes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **`⛔` for NEVER, unifying the stray `❌`.** The operator asked for a "stop" glyph; standardizing on `⛔` everywhere (converting the 8 `❌` files) is what makes the convention actually uniform. Trivially reversible to `❌` if preferred.
2. **No glyph on the `## RULES` H2.** Per operator preference — icons live on the ALWAYS/NEVER/ESCALATE sub-headers only.
3. **Conservative matching.** Only structured rule-keyword headers are touched; incidental "Always"/"NOT" prose headers are left alone to avoid false positives.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Idempotency** — re-running the sweep reports `0 header(s) in 0 file(s)`.
- **sk-doc packaging** — `package_skill.py <pkt> --check --strict` → **11/11 PASS** (create-benchmark re-trimmed to 4993 words after the glyphs pushed it over the 5000 cap).
- **Parent hubs** — `parent-skill-check.cjs` STRICT exit 0, 0 warnings on sk-doc, sk-design, sk-prompt, system-deep-loop.
- Icons on H3 headers do not disturb H2 section detection (substring match).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Leaf-skill SKILL.md files (e.g. sk-git, system-code-graph) have no strict packaging gate; their change is a cosmetic header prefix, verified visually and by idempotency.
- Only the `ALWAYS/NEVER/ESCALATE IF` rule pattern is iconed; other semantically-negative prose headers were intentionally left plain to avoid over-reach — extendable on request.
<!-- /ANCHOR:limitations -->

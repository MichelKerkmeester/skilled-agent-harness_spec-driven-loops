---
title: "Code-Bug Hand-offs: code-opencode refinement (027/028)"
description: "Actionable owner hand-off register for the 6 code bugs + 1 doc-claim the code-opencode refinement research (027) surfaced that fall OUTSIDE this docs packet's scope. C1 (validator) was fixed in Phase 7 and C3 (posttooluse docstring) in Phase 2; the remaining items are routed here to their owning skills with symptom, exact location, and a fix sketch so each owner can pick one up directly."
trigger_phrases:
  - "code-opencode code-bug hand-offs"
  - "C2 C4 C5 C6 C7 C8 code-opencode owners"
  - "code-opencode refinement deferred code bugs"
importance_tier: "medium"
contextType: "handover"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/028-code-opencode-refinement-implementation"
    last_updated_at: "2026-07-08T20:30:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Filed the 6 remaining code-bug hand-offs (C2, C4-C8) + the .codex doc-claim to their owning skills"
    next_safe_action: "Each owner picks up its row; nothing else blocks the 028 packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Code-Bug Hand-offs: code-opencode refinement (027/028)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: handover-core | v2.2 -->

---

## 1. WHY THIS EXISTS

The 027 deep-research surfaced 8 code bugs (C1–C8) plus one stale doc-claim. Only **C1** was inside this docs packet's job (the `verify_stack_folders.py` validator — **rewritten in Phase 7**, commit `38785a1f`). **C3** turned out to be docstring-only (the live `.claude/settings.json` already invoked the hook via `python3`; the stale `bash` claim was **fixed in Phase 2**, commit `c3a8ef45`). The remaining bugs live in **other skills' code**, so fixing them here would have mixed unrelated code changes into a documentation cleanup. They are routed below to their owners — each row is self-contained (symptom → exact location → fix sketch) so an owner can act without re-reading the research.

Full evidence: `../027-code-opencode-refinement-research/research/research.md` (code-bug table) and its iteration logs.

---

## 2. OPEN HAND-OFFS

| ID | Owner | Sev | Symptom | Exact location | Fix sketch |
|----|-------|-----|---------|----------------|-----------|
| **C2** | `code-quality` (the gate) + `system-spec-kit` (the checker) | Medium | A `.sh`-extension Python checker exits **2 (skipped)** for unparseable file types, but the callers treat exit 2 identically to exit **0 (clean)** — only exit 1 counts as a violation. Result: **zero** comment-hygiene coverage for `.json` / `.css` / `.html` / `.yml` / `.toml` / `.md` (e.g. an `ADR-###` marker in a `.json` config slips through). | `system-spec-kit/scripts/rules/check-comment-hygiene.sh:7-10,50-52`; `.opencode/hooks/pre-commit:20-24`; `code-quality/scripts/hooks/claude-posttooluse.sh:77` | Decide the policy for unparseable types, then either add a real hygiene path for structured/markup files or make exit-2 an explicit, logged "not covered" (not silently == clean). Keep the two callers consistent. |
| **C4** | `system-spec-kit` | Low | `factory.ts` mixes **bare** built-in imports (`fs`, `path`, `url`) with the **prefixed** `node:` form (`node:module`) in the same file; the doc-trio should teach one form. | `system-spec-kit/shared/embeddings/factory.ts:5-8` | Normalize all Node built-in imports to the `node:` prefix (the form the TS trio now teaches after Phase 3). |
| **C5** | `system-spec-kit` | Low | Duplicate section numbering — a `// 2.` comment header appears at **both** `:69` and `:110`. | `system-spec-kit/mcp_server/lib/errors/core.ts:69,110` | Renumber the second block (`// 3.` …) so the section sequence is monotonic. |
| **C6** | `system-spec-kit` | Low | `if (error instanceof Error) { void error.message; }` — a `void error.message;` no-op that reads like a lint/suppression workaround. | `system-spec-kit/shared/embeddings/factory.ts:1112,1281` | Triage: if intentional, add a durable WHY comment; otherwise remove the dead statement. |
| **C7** | `system-spec-kit` ↔ `system-skill-advisor` (coordination) | Medium | The spec-kit `hooks/claude/` location is declared **DEPRECATED** (2026-05-16, removal 2026-08-16) with the migration target `system-skill-advisor/hooks/claude/` (+ its `dist/`) already present — but `.claude/settings.json` still points at the legacy spec-kit dist path. Migration is mid-flight. | `system-spec-kit/mcp_server/hooks/claude/README.md:1-4`; `.claude/settings.json` | Finish the migration: repoint `.claude/settings.json` at `system-skill-advisor/hooks/claude/dist/…`, verify parity, then remove the deprecated location on/after the removal date. hooks.md (Phase 2) already documents the CURRENT wiring and a "migrating to system-skill-advisor/hooks/" note. |
| **C8** | `sk-code` (alignment-verifier exclusion list) | Low | `verify_alignment_drift.py` maps `.sh` → shell and expects `#!/usr/bin/env bash` + `set -euo pipefail`, so it emits **false** `SH-SHEBANG` / `SH-STRICT-MODE` WARNs on every scan of the Python-with-`.sh` checker family. | `code-opencode/assets/scripts/verify_alignment_drift.py` (per `verified-backlog.json:757`) | Add the Python-with-`.sh` checker files (or a `#!/usr/bin/env python3` shebang test) to the verifier's exclusion/interpreter-detection path so it classifies by shebang, not extension. |
| **`.codex` line** | `.opencode/agents` owner | Low | `agents/README.txt:8` names `.codex/agents/` (`.toml`) as a live sibling runtime, but `.codex/` **does not exist** on disk. The agent-authoring checklist (Phase 5) now correctly teaches the two-runtime reality and does **not** treat `.codex` as live. | `.opencode/agents/README.txt:8` | Either build the `.codex/agents/` mirror (and wire `check-agent-mirror-sync.cjs` for a third runtime) or delete the aspirational line so the README matches reality. |

---

## 3. ALREADY RESOLVED (recorded for completeness)

| ID | Resolution |
|----|-----------|
| **C1** | `verify_stack_folders.py` rewritten against the real language axis + DR-004 rewritten — Phase 7, commit `38785a1f`. |
| **C3** | Downgraded High→Low: the live `.claude/settings.json` already invokes the hook via `python3`; only the docstring falsely showed `bash`/`settings.local.json` — fixed in Phase 2, commit `c3a8ef45`. |

---

## 4. NOTES

- These are routed, not fixed: this packet is documentation-scoped and must not carry other skills' code changes.
- Once the memory daemon is healthy and the index is refreshed, this register becomes discoverable via memory search under the 017 parent; until then it lives here next to the 028 completion record.

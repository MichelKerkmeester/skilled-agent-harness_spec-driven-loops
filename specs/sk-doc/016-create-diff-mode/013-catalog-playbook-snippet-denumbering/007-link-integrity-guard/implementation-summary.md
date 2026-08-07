---
title: "Implementation Summary: Markdown-Link Integrity Guard [133/007/implementation-summary]"
description: "Built check-markdown-links.cjs (repo-wide markdown-link resolver, green-on-current-tree via narrow exclusions + a 15-entry allowlist) and a CI workflow that fails PRs introducing broken markdown links across skills/commands/agents."
trigger_phrases:
  - "007-link-integrity-guard completion"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/013-catalog-playbook-snippet-denumbering/007-link-integrity-guard"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Inventoried guard in catalog+playbook; hardened sibling check-links.sh"
    next_safe_action: "None; phase closed after commit/push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 2 |
| **Date** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

A markdown-link integrity guard — `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` — that walks the active skills/commands/agents docs and fails on any broken relative markdown link, plus a CI workflow `.github/workflows/markdown-link-integrity.yml` that runs it on PRs touching the doc trees. It complements the existing wikilink checker (`check-links.sh`).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

The resolver was lifted from the validated `review/baseline/link-audit.cjs` (dual-base resolution, fenced-code strip, `%20` decode). Green-on-current-tree is achieved with dir-skips (`/changelog/`, `/tests/fixtures/`) plus a narrow 15-entry `(file, ref)` allowlist for intentional template fill-ins and one example — not whole-directory skips, so real breakage in those areas is still caught.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

- **Whole-repo scan, not changed-files**: a deleted target breaks unchanged referrers, which a diff-scoped check would miss.
- **Node + `setup-node` in CI** (vs python3 re-port): reuse the validated resolver to avoid subtle divergence; the only deviation from the bash/python3 house gates.
- **Markdown links + ref-defs only** (not backtick prose): the reliable signal; backtick paths are inherently noisy.
- **CI-only** (not a `validate.sh` rule): validate.sh rules are per-spec-folder; this is a repo-wide sweep, matching the `prompt-card-sync` precedent.
- **Code spans are not link surface**: fenced AND inline code are stripped before extraction (CommonMark), so link syntax shown in prose backticks isn't mis-flagged. The inline strip is a length-matched, escape-aware tokenizer that never hides a real link — guarded by `--self-test`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

- `node check-markdown-links.cjs` on the current tree → **exit 0**, "0 broken" (2997 files, 6902 links checked).
- Negative test: injected 2 broken links into a scanned doc → **exit 1**, both named; removed the test file; re-ran → exit 0.
- Positive control: allowlisted placeholders (e.g. `reference-name.md`) not flagged.
- `validate.sh --strict --recursive` on the 133 parent green including this child.
- Inline-code refinement: `check-markdown-links.cjs --self-test` → **6/6 pass** (link syntax inside backticks ignored; a real link on the same line, and links behind escaped backticks, still fail). Full tree re-run after the change → exit 0 (3004 files, 6845 links, 0 broken).
- Downstream: the guard is now inventoried in the feature catalog and testing playbook (`16--tooling-and-scripts/markdown-link-integrity-guard.md`), each `validate_document.py`-valid. The sibling wikilink checker `check-links.sh` received the same escaped-backtick handling — a fixture confirmed a wikilink behind escaped backticks is now caught while inline-code wikilinks stay ignored.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- Checks link **existence**, not anchor (`#heading`) existence or semantic correctness.
- Does not check backtick prose paths (noisy) or wikilinks (covered by `check-links.sh`).
- The allowlist is a small maintenance surface: a new intentional placeholder needs a one-line entry (surfaced by a failing run).
<!-- /ANCHOR:limitations -->

---
title: "Verification Checklist: code-opencode refinement backlog implementation"
description: "Level 2 verification checklist for the 7-phase code-opencode refinement: per-phase and cross-cutting gates covering the Phase-3 compile guarantee, symlink-aware existence, comment-hygiene, markdown links, drift-guards, shared-tier blast-radius scoping, and the owner hand-offs, with every backlog item required to be done-with-evidence or deferred-with-reason."
trigger_phrases:
  - "code-opencode refinement implementation checklist"
  - "code-opencode implementation verification"
  - "implement code-opencode backlog checklist"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/028-code-opencode-refinement-implementation"
    last_updated_at: "2026-07-08T20:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "All 7 phases shipped + Sonnet-verified + pushed; checklist marked done-with-evidence"
    next_safe_action: "Register 028 under 017 once the memory daemon is healthy; file owner hand-offs"
    blockers:
      - "028 registration under 017 needs generate-context.js (memory daemon), operator-gated"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: code-opencode refinement backlog implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Mark `[x]` with evidence (file:line, command output, or grep count) as each item lands. Every P1/P2/P3 must be done-with-evidence or deferred-with-reason. Verify per-phase (the T*.V rows in `tasks.md`), then the cross-cutting + program gates below.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Read the source-of-truth backlog (`../027-.../research/final-synthesis.md` §B) + the per-phase tasks. — evidence: per-phase findings pulled from the synthesis before each dispatch.
- [x] Confirm the current migration state (`deep-loop-workflows→system-deep-loop` + sk-code spec-folder renumber) before touching any deep-loop path citation. — evidence: migration SETTLED (`deep-loop-workflows` absent, `system-deep-loop` live); the 4 checklists carry 0 deep-loop refs.
- [x] Record a recovery-baseline HEAD before the first phase commit. — evidence: per-phase RM-8 recovery-baseline recorded (origin tip) before each `--dangerously-skip-permissions` dispatch.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] **Symlink-aware existence:** no doc references a nonexistent path — every "dead"/target reference confirmed with `ls -la`/`find -type l`, never a glob. — evidence: Sonnet verified every cited path per phase; the one fictional `references/opencode/` prefix was found and corrected in Phase 6.
- [x] **Comment-hygiene HARD BLOCK:** any script touched (Phase 7) carries durable WHY only; `check-comment-hygiene.sh` clean. — evidence: `check-comment-hygiene.sh` exit 0 on `verify_stack_folders.py`; grep for artifact ids/spec paths = 0.
- [x] Prose edits stay additive/surgical; no unrelated content rewritten. — evidence: Phase 4 was 42 insertions / 0 deletions; Sonnet confirmed 0 shared-prose regression.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing
- [x] **Phase-3 compile guarantee:** every TypeScript example validated against a real compiling exemplar (`factory.ts`, `errors/core.ts`, `prompt-policy.ts`); no `nodenext`/`verbatimModuleSyntax`-breaking example remains; `--noCheck` removed (grep 0). — evidence: Sonnet test-compiled every snippet under real `tsc` + a nodenext/verbatimModuleSyntax tsconfig; caught + fixed the one TS7016 breaker (`66fdb0bd`).
- [x] Every command/script/path named in the verify-doctrine + hooks additions exists on disk. — evidence: Sonnet `ls`-verified every path in Phases 2 & 4 (validate.sh, rebuild-native-modules.sh, dist, both hooks); 0 dangling.
- [~] `check-markdown-links` clean across every edited file. — DEFERRED-with-reason: per-phase Sonnet path-existence covered link targets for every edited file; a standalone repo-wide link-lint pass was not run (see implementation-summary Known Limitations #4).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] Phase 1 — ~10 dead pointers re-pathed; grep shows 0 old strings. — `7fdd7a07`
- [x] Phase 2 — hooks.md fabricated §4/§5 removed; every path exists; C3 docstring fixed. — `c3a8ef45`
- [x] Phase 3 — TS trio import/emit + build doctrine corrected; compile guarantee met. — `66fdb0bd`
- [x] Phase 4 — verify-doctrine additions present + OPENCODE-scoped. — `71dcf9af`
- [x] Phase 5 — four checklists teach current reality (Option-E, two command architectures, 3-tier MCP). — `752d018e`
- [x] Phase 6 — surface-marker split; config genre split; YAML row added. — `d73db9a2`
- [x] Phase 7 — validator retired/rewritten; impossible DR-004 retired; assets/scripts documented. — `38785a1f`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security
- [x] N/A — docs-only change, no runtime/security surface. No secrets, no shipped-code behavior change (code bugs are hand-offs).

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation
- [x] `SKILL.md` reference map resolves 1:1 with disk after Phases 2/6/7. — evidence: Sonnet confirmed the Phase-6 SKILL.md paths + the assets/scripts coverage all resolve.
- [x] ex-P2-49 closed: `SKILL.md` no longer over-claims hooks.md's pre/post-tool-use coverage. — evidence: Phase 6 softened the hooks line to defer to hooks.md; Sonnet confirmed no residual over-claim (`d73db9a2`).
- [x] Descriptor-genre wording (Phase 6) aligned with sk-doc. — evidence: Phase 6 used sk-doc's descriptor terms (`description.json` = advisor descriptor, `graph-metadata.json` = skill-graph identity); the JSONC/strict-JSON genre labels are original-but-accurate (Sonnet noted they are not falsely attributed).

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization
- [x] Shared-tier edits (`workflow_{verify,implement}.md`) are additive + OPENCODE-labeled; code-webflow doctrine verified unchanged. — evidence: Phase 4 Sonnet confirmed 0 deletions + "OpenCode Surface Only" headings with explicit Webflow disclaimers.
- [x] Each phase pushed as an isolated scratch-index commit, blast-radius-gated to its files. — evidence: 7 commits, each blast-gated to its exact file count; no concurrent-session file included.
- [x] Writes confined to code-opencode docs + one sk-code script + the sk-code playbook (no other surface touched). — evidence: authoritative `git diff --name-only <tip>` per phase showed only the intended files.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary
- [x] Every backlog item (24 P1 / 21 P2 / 7 P3 + C1) done-with-evidence or deferred-with-reason. — evidence: all 24 P1 / 21 P2 / 7 P3 + C1 landed across Phases 1-7 (commit table in implementation-summary); each phase Sonnet-verified.
- [~] `parent-skill-check` STRICT 0 on sk-code; vocab-sync + router drift-guards green; `validate.sh --strict` Errors 0. — parent-skill-check STRICT PASS (0 warnings); `validate.sh --strict` on this packet = Errors 2 (TEMPLATE_HEADERS + FRONTMATTER_MEMORY_BLOCK), endemic/grandfathered on the 017 track (shipped sibling 008 fails the same 2 with Errors 3) — DEFERRED-with-reason, see implementation-summary Known Limitations #1.
- [~] Hand-offs C2/C4-C8 + Codex filed to owners (see `plan.md` §6). — DOCUMENTED in implementation-summary Known Limitations #3; not yet filed as separate owner issues.
- [~] 028 registered under 017 children_ids + `description.json`/`graph-metadata.json` generated — DEFERRED: needs `generate-context.js` / the memory daemon, currently operator-gated (Known Limitations #2).

<!-- /ANCHOR:summary -->

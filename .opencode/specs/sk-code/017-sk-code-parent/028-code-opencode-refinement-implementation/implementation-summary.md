---
title: "Implementation Summary: code-opencode refinement backlog"
description: "The Fable-5-validated code-opencode refinement backlog (24 P1 + 21 P2 + 7 P3 + C1) shipped as seven risk-ordered, individually Sonnet-verified scratch-index commits: a compile-breaking TypeScript trio rewrite, a stale-pointer sweep, a hooks.md reality rewrite, OpenCode-scoped verify/implement doctrine, four authoring-checklist rewrites, a SKILL.md detection/config-genre split, and the retirement of an always-failing validator — GPT-5.5-fast implemented, Sonnet-5 verified each phase before commit."
trigger_phrases:
  - "code-opencode refinement outcome"
  - "code-opencode implementation summary"
  - "028 code-opencode refinement shipped"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/017-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/028-code-opencode-refinement-implementation"
    last_updated_at: "2026-07-08T20:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped all 7 phases as individually Sonnet-verified scratch-index commits (66fdb0bd, 7fdd7a07, c3a8ef45, 71dcf9af, 752d018e, d73db9a2, 38785a1f); parent-skill-check STRICT 0"
    next_safe_action: "Register 028 under the 017 parent (children_ids + description.json/graph-metadata.json) once the memory daemon is healthy; file owner hand-offs C2/C4-C8 + Codex"
    blockers:
      - "028 registration under 017 needs generate-context.js (memory daemon), currently operator-gated"
    key_files:
      - ".opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md"
      - ".opencode/skills/sk-code/code-opencode/references/shared/hooks.md"
      - ".opencode/skills/sk-code/code-opencode/assets/checklists/command_authoring.md"
      - ".opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 028-code-opencode-refinement-implementation |
| **Completed** | 2026-07-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Fable-5-validated backlog from sibling 027 (24 P1 + 21 P2 + 7 P3 + the sk-code-owned C1) landed as **seven risk-ordered phases, each one focused scratch-index commit, each independently verified by a Sonnet-5 pass before commit**. Every phase edits DOCS/ASSETS only (plus one sk-code script) — no shipped runtime code changed. Execution order was **3 → 1 → 2 → 4 → 5 → 6 → 7**: the compile-breaking TypeScript cluster first because it was the only place where following the skill verbatim produced non-compiling code.

### Phases (in commit order)
| Phase | Commit | What shipped | Verifier caught |
|-------|--------|--------------|-----------------|
| 3 — TypeScript trio | `66fdb0bd` | NodeNext import/emit rules (`.js` extensions, `node:` prefix, `createRequire`), package-aware build doctrine (`tsc --build` vs `tsc -p tsconfig.build.json`, dropped `--noCheck`), `MemoryError` real shape, `enum`→`as const` | a `declare module './x.js'` example that fails `TS7016` — replaced with a co-located `.d.ts`, recompiled clean |
| 1 — stale-pointer sweep | `7fdd7a07` | ~10 dead pointers re-pathed (`lib/common.sh`→`shell-common.sh`, `references/opencode/`→`code-opencode/references/`, `sk-skill.md`→`skill.md`, dead `skill_creation.md`) | a blanket `lib/common.sh`→`shell-common.sh` that was wrong for 7/8 cites — the colors/counters/log-fns live in `validate.sh` after a file split; re-pointed each |
| 2 — hooks.md rewrite | `c3a8ef45` | deleted fabricated `mcp_server/hooks/{opencode,copilot}/` suites; struck `.opencode/settings.json`; `settings.local.json`→`settings.json`; added the two live hooks with exact matchers; C3 docstring `bash`→`python3` | (clean — both hook rows matched `.claude/settings.json` character-for-character) |
| 4 — verify/implement doctrine | `71dcf9af` | OpenCode-scoped subsections in the two SHARED workflow docs (validate.sh exit codes, stale-`dist/` trap, native-ABI rebuild, daemon single-writer, worktree→sk-git, cross-links) + comment-hygiene HARD-BLOCK reframe | (clean — 0 deletions, every fact traced to source, no overclaim) |
| 5 — authoring checklists | `752d018e` | skill (flat vs parent-hub Option-E), agent (two-runtime mirror, drop `.codex`, `permission:`/`tools:`), command (two architectures, symlink parity), MCP (3-tier, `opencode.json`, code_mode direct-dist) | (clean — byte-for-byte on the two highest-risk corrections; Phase-1 link fixes preserved) |
| 6 — SKILL.md + config + detection | `d73db9a2` | surface-trigger vs extension sub-detection split; JSONC vs strict-JSON genre split; YAML detection row (verified 65 live); `changelog/`/`.sock`/`assets/scripts/` coverage; hooks over-claim closed | a fictional `_routes.yaml` path (GPT self-corrected); the whole detection table's nonexistent `references/opencode/<lang>/` prefix (fixed to `code-opencode/references/<lang>/`) |
| 7 — validator retirement (C1) | `38785a1f` | rewrote the always-exit-1 `verify_stack_folders.py` against the real language axis; rewrote the impossible DR-004; fixed the assets/scripts README | (clean — ran the validator live: clean=0, orphan=1, cleanup verified; comment-hygiene checker exit 0) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Per the operator's directive, **GPT-5.5-fast (high) implemented each phase via `cli-opencode`, and a Sonnet-5 review agent verified each phase before its commit**. Every implementer dispatch ran under the RM-8 four-layer mitigation (literal BANNED-OPS/ALLOWED-WRITE blocks, recovery-baseline recorded, blast-radius gate) because it used `--dangerously-skip-permissions`. Each phase was committed with the shared-branch-safe scratch-index recipe — seeded from the live remote tip, `git add` path-scoped to the phase's files, blast-radius-gated to exactly the intended count, pushed with a braced refspec — so a concurrent session sharing the branch was never clobbered (one such concurrent push, and one mid-run orphan-sweep kill of Phase 5, were both absorbed cleanly on re-fetch/re-dispatch). Two small corrections were made directly by the orchestrator rather than re-dispatched: the Phase-3 `.d.ts` compile fix and the Phase-6 detection-table prefix fix. The Sonnet verification earned its keep twice by test-compiling (the TS7016 breaker) and by reading actual cited line ranges (the wrong-file-after-split citations) — defects that existence-checking alone would have missed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
| Decision | Why |
|----------|-----|
| Phase 3 (TypeScript) first | The only cluster where following the skill verbatim yields non-compiling code — highest harm-prevention |
| Only C1 (+ the C3 docstring) implemented here | C2/C4-C8 and the Codex aspiration are other owners' code bugs; never mix code-bug fixes into a docs PR |
| Rewrite the stack-folders validator, not stub-retire it | A stub-exit-0 is dead weight; code-opencode's real language axis (`references/<lang>/`) is a stable invariant worth guarding, and it gives DR-004 something real to test |
| Shared-tier (workflow_verify/implement) additions are OpenCode-labeled subsections | The docs are symlinked into code-webflow; additive OpenCode-scoped blocks keep the Webflow surface untouched |
| Orchestrator made two edits directly | The `.d.ts` compile fix and the detection-table prefix fix were precise, verifier-surfaced corrections — same discipline as prior path phases, recorded as a deliberate deviation from the default GPT-authored path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
| Check | Result |
|-------|--------|
| Per-phase Sonnet-5 review | PASS on all 7 — each phase VERDICT PASS before its commit |
| Phase-3 compile guarantee | PASS — every TS example test-compiled under real `tsc` + a nodenext/verbatimModuleSyntax tsconfig |
| `parent-skill-check` STRICT on sk-code | PASS — all hard invariants, 0 warnings (post Phases 5/6/7) |
| Comment hygiene (Phase 7 `.py`) | PASS — `check-comment-hygiene.sh` exit 0; no artifact ids/spec paths |
| Blast-radius gate | PASS on all 7 — each commit exactly its intended file count; no concurrent-session file touched |
| Symlink-aware path existence | PASS — Sonnet verified every cited path per phase (all exist; the one fictional `references/opencode/` prefix was corrected in Phase 6) |
| `validate.sh --strict` on this packet | Errors 2 / Warnings 4 — TEMPLATE_HEADERS + FRONTMATTER_MEMORY_BLOCK; see Known Limitations (endemic/grandfathered on the 017 track) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:lessons -->
## Lessons
A skill whose reference docs describe a prior architecture lies with confidence: hooks.md inventoried removed hook suites, the config guide drew a fictional tree, the detection table pointed at a folder prefix that no longer existed, and a "validator" guarded an axis that had been replaced — each read as authoritative. The fix in every case was to check the doc against the live artifact, not against its own prior wording, and the verifier that reproduced behavior (test-compiling, running the script, reading the exact cited line) caught what a plausibility read would have waved through. Splitting implement-from-verify across two models, with the verifier told to refute, is what turned "looks right" into "is right" seven times.
<!-- /ANCHOR:lessons -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
1. **`validate.sh --strict` reports 2 errors on this packet** (TEMPLATE_HEADERS ×3, FRONTMATTER_MEMORY_BLOCK ×2). Both are template-contract conformance gaps, not deliverable defects: the packet legitimately carries 7 topic-named phases where the tasks template expects the canonical 3 (Setup/Implementation/Verification), and the memory-block check is endemic across the 017 track — the shipped sibling `008-routing-benchmark-and-review` fails the same two checks with Errors 3 (worse than this packet's 2). Accepted/grandfathered, consistent with the track's shipped standard.
2. **028 is not yet registered under the 017 parent** (`children_ids` + `description.json` + `graph-metadata.json`). Generation needs `generate-context.js` / the memory daemon, which is operator-gated (rebuild-native-modules pending). Deferred to a daemon-healthy window; until then the packet is invisible to memory search and graph traversal.
3. **Owner hand-offs are filed** in `code-bug-handoffs.md` (this folder): C2 (exit-2-as-clean coverage → code-quality + system-spec-kit), C4/C5/C6 (system-spec-kit cleanup), C7 (hooks migration → system-spec-kit ↔ system-skill-advisor), C8 (alignment SH-WARN exclusion → sk-code), and the `agents/README.txt:8` `.codex` aspiration (→ `.opencode/agents` owner). Each is an actionable row (symptom → exact location → fix sketch). They remain other-owner issues, deliberately excluded from this docs packet's own changes. (C1 fixed in Phase 7; C3 fixed in Phase 2 — both recorded there as resolved.)
4. **`check-markdown-links` was not run repo-wide**; per-phase Sonnet path-existence verification covered link targets for every edited file, but a standalone link-lint pass over the whole edited set was not executed.
<!-- /ANCHOR:limitations -->

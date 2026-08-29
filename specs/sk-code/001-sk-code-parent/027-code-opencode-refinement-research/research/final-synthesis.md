# code-opencode Refinement — Final Review & Implementation Rec Plan

_Independent final review of the GLM-5.2 research (research.md + iterations 001–009) by a Fable-5 reviewer, read-only, with direct source spot-checks. Orchestrated by the Opus conductor. 2026-07-08._

## A. Review verdict

**Overall: TRUSTWORTHY — accept with 3 corrections.** 26 distinct load-bearing claims verified directly against source (including running `verify_stack_folders.py` and reading live `.claude/settings.json`): **23/26 fully confirmed (~88%)**; confirmed cases held their exact file:line evidence. The 3 misses share one root cause the research itself named but failed to apply: **negative-existence claims from before iteration 9 were never re-verified symlink-aware** (its own residual-gap caveat), plus one case of trusting a file's docstring over live wiring. Honest-uncertainty handling was good; the deep-loop provisional caveat proved correct (`deep/research.md:9` already points at `system-deep-loop/runtime/...`), and the `.codex` contradiction was flagged not papered over — resolved here: **`.codex/` does not exist** (`agents/README.txt:8` is aspirational).

Process notes: only **9 iteration files** exist (iter-10 was the synthesis → `research.md`, expected). A dangling **"P2-49"** cross-reference in research.md is a *real* finding (SKILL.md §2 over-claims hooks.md's pre/post-tool-use coverage — confirmed `SKILL.md:35`) that got lost in backlog numbering — recovered below.

### Adjustments (only changed/spot-checked findings; the rest stand)

| Finding | Verdict | Reason |
|---|---|---|
| **C3** posttooluse gate "silently non-functional" | **DOWNGRADE High→Low, re-scope** | Live `.claude/settings.json:86` invokes it with `python3` — the gate WORKS. The broken `bash…bash` form exists only in the hook's own docstring (`claude-posttooluse.sh:11-14`, which also repeats the `settings.local.json` error). Fix = update the stale docstring, not repair a dead gate. |
| **P2-40** `.claude/commands/`+`.opencode/prompts/` "do not exist" | **CONFIRMED fix, CORRECTED premise** | `.claude/commands` EXISTS as a symlink → `../.opencode/commands` (populated). `.opencode/prompts/` truly absent. Fix reworded: mirror steps are wrong because parity is automatic via a repo-level symlink, not because the dir is dead. |
| **P2-44** SKILL.md §1 omits `/design` | **CUT** | No `/deep,/speckit,/memory,/doctor,/create` command list exists anywhere in current code-opencode SKILL.md/README (repo-wide grep). Premise stale — nothing to fix. |
| **C1** verify_stack_folders.py | **CONFIRMED (ran it, exit=1), RE-OWN** | Always fails; DR-004 requires exit 0 (`:31,:48,:62`) — impossible. Script parses `code-opencode/SKILL.md` (not `sk-code/SKILL.md`; both have 0 `STACK_FOLDERS`); DR-004 lives under `sk-code/manual_testing_playbook/` — owner is **sk-code**, not sk-doc. |
| **P1-10/11** hooks.md §4/§5 "fabricated" | **CONFIRMED, wording** | Dirs verifiably absent; "fabricated" → "stale, describes removed suites" (hooks.md 3.6.0.0 predates removal). Action unchanged: delete §4/§5. |
| **P1-3** bare `require` "SyntaxError" | **CONFIRMED, wording** | ESM + NodeNext → bare `require` is a runtime ReferenceError (tsc may pass it), not a SyntaxError. Fix unchanged: teach `createRequire(import.meta.url)`. |
| **P1-21** "all 4 native servers via launchers" | **CONFIRMED, nit** | 3 use launchers; `code_mode` (`opencode.json:91`) points directly at `dist/index.js`. Checklist fix stands. |
| **P1-15/P3-54** Codex third runtime | **CONFIRMED, resolved** | `.codex/` does not exist. Prescribe the TWO-runtime reality (matching `check-agent-mirror-sync.cjs`); flag `README.txt:8` for its owner; do NOT teach `.codex/agents/` as live. |
| P1-1/2, 4/5/6/7, 9, 12–20, 22–25, C2, C7, ex-P2-49 | **CONFIRMED** | Verified directly (tsconfigs, real imports, dead paths, live settings, opencode.json, agent frontmatter, stack_detection.md, DR-004, migration state). |

**Net: Cut 1 (P2-44), corrected 2 (P2-40, C3). Surviving: 24 P1, 21 P2, 7 P3 + 8 code bugs (1 downgraded).**

## B. Final validated backlog (deduplicated by target file)

### Tier 1 — teaches broken work or a dead gate (P1)
1. `references/typescript/{style_guide,quick_reference,quality_standards}.md` — NodeNext `.js`-extension rule + `node:` prefix + `createRequire` interop; fix every import example (P1-1/2/3).
2. `references/typescript/quality_standards.md` §10 — package-aware build doctrine (`tsc --build` root vs `tsc -p tsconfig.build.json` satellites); drop `--noCheck` (0 uses) (P1-9).
3. `references/shared/hooks.md` — delete §4/§5; strike `.opencode/settings.json`; `settings.local.json`→`settings.json`; add live PreToolUse/PostToolUse rows; deprecation callout; dist-freshness step (P1-10/11/12/13 + P2-35/36/37).
4. `references/shell/{style_guide,quality_standards}.md` — `lib/common.sh`→`system-spec-kit/scripts/lib/shell-common.sh` (~11 cites); prefix `spec/create.sh` (P1-4/5).
5. `references/config/style_guide.md` — fix `config/config.jsonc` evidence path; rewrite fictional §9 tree; split JSONC-behavior vs strict-JSON-descriptor genres (P1-6/7).
6. `assets/checklists/skill_authoring.md` — Option-E parent-hub branch + `graph-metadata.json`/`mode-registry.json` checks; fix dead `skill_creation.md` link (P1-14/17 + P2-39).
7. `assets/checklists/agent_authoring.md` — two-runtime canonical→mirror contract (drop triplicate + `.codex`); `permission:` vs `tools:` schemas; drop `allowed-tools:` from the agent grep (P1-15/16, P3-54).
8. `assets/checklists/command_authoring.md` — teach the two real architectures (contract-renderer + YAML router); add `argument-hint`/`allowed-tools`/PRE-BOUND SETUP; replace mirror steps with the symlink reality; `sk-skill.md`→`skill.md` (P1-18/19, P2-40-corrected).
9. `assets/checklists/mcp_server_authoring.md` — 3-tier launcher+daemon+socket assembly; `opencode.json` registration (note code_mode registers dist directly); Code Mode split; dist-freshness (P1-20/21, P2-41/42).
10. `SKILL.md:16` — separate surface trigger (path under `.opencode/`) from extension→trio sub-detection (P1-22).
11. `sk-code/shared/references/workflow_verify.md` (+`workflow_implement.md`) — OPENCODE verification-reality subsection: real command chain + dist-trap + det-env + native-ABI + `validate.sh` exit codes (P1-8 + P2-32/33/34 + P3-50).
12. Cross-file sweep (error_recovery.md, universal_patterns.md, mcp_server_authoring.md:67-68, config/quality_standards.md:97, command_authoring.md:64) — batched stale-prefix/dead-link re-pathing (P1-24).
13. `SKILL.md` §4 + `assets/scripts/README.md` + `assets/scripts/verify_stack_folders.py` + `sk-code/manual_testing_playbook/design-restraint/stack-folders-validator.md` — document `assets/scripts/`; retire/rewrite the always-failing validator + impossible DR-004; fix doubly-stale README (P1-25, P3-51).
14. `sk-code/shared/references/workflow_implement.md` §2.3 — cross-link the two shared tiers (0 links today) (P1-23).

### Tier 2 — drift/coverage (P2, surviving)
TS `as const` vs `enum`, `MemoryError` shape + JS-trio cascade, type-import interleaving (P2-26/27/28); Python argparse/import-order (P2-29/30); shebang-vs-invocation trap **evidence corrected to the docstring** (P2-31); alignment-doc scope rename (P2-38); worktree pointer (P2-45); comment-hygiene as HARD-BLOCK gate (P2-46); daemon single-writer (P2-47); YAML detection row — 62 live YAML files (P2-43); recovered ex-P2-49: SKILL.md §2 hooks.md over-claim (auto-resolves once item 3 lands the §3b/§3c rows — verify at close).

### Tier 3 — nits (P3): P3-48/49/52/53 as written.

### Underlying code bugs (separate hand-off, NOT doc PRs)
- **C1** validator always-fails + DR-004 impossible — owner **sk-code** — High.
- **C7** hooks migration mid-flight (settings → legacy spec-kit dist; skill-advisor target exists) — system-spec-kit ↔ system-skill-advisor — Medium (decides hooks.md §3 content).
- **C2** exit-2-as-clean semantics / descriptor coverage gap — code-quality + system-spec-kit — Med-Low (real gap only for `.json` markers).
- **C3** stale docstring (was "gate non-functional") — code-quality — Low.
- **C4/C5/C6** (bare-vs-`node:`, dup section numbers, `void error.message`) — system-spec-kit — Low.
- **C8** alignment-verifier false SH-WARNs on Python-with-.sh — sk-code — Low.
- **NEW** `agents/README.txt:8` names non-existent `.codex/agents/` — .opencode/agents owner — Low.

## C. Implementation rec plan (batched)

- **Batch 1 — Mechanical re-pathing sweep (now).** Items 4, 5 (evidence paths), 12, P3-51, dead checklist links. ~10 files, find-replace. Rule from P2-40: verify every target with `ls -la`/`find -type l` (symlink-aware), never glob. Effort S, risk minimal.
- **Batch 2 — hooks.md rewrite (now).** Item 3 + the C3 docstring fix (same subject). Authority: `hook_system.md` + live `.claude/settings.json`. C7 is mid-flight → document current legacy paths with a "migrating to system-skill-advisor/hooks/" note; don't pick the future state. Effort M, risk low.
- **Batch 3 — TS trio compile-breaking rewrite (now; HIGHEST VALUE).** Items 1, 2 + P2-26/27/28 + P3-48/49; close the JS cascade in-pass. 3–4 files; validate every example against a real compiling file (`factory.ts`, `errors/core.ts`, `prompt-policy.ts`). Effort M-L, risk low.
- **Batch 4 — Verify doctrine additive (now, one caution).** Items 11, 14 + P2-45/46/47. Caution: `workflow_verify`/`workflow_implement` are the SHARED tier symlinked into both surfaces — scope additions as "OPENCODE reality" subsections so code-webflow is untouched. Effort M, risk low-medium (shared blast radius).
- **Batch 5 — Four authoring-checklist rewrites (mostly now; re-verify paths at edit time).** Items 6–9. Deep-loop citations in compiled contract digests still cite `deep-loop-workflows/` → re-verify each path on edit day; if the rename is still churning, land architecture text with skill-relative paths. Codex resolved (two runtimes). Effort L, risk medium.
- **Batch 6 — SKILL.md + config genre + detection (partially waits).** Items 5 (genre split), 10 + P2-43, P3-52/53, ex-P2-49 closure. Coordinate genre wording with sk-doc. Effort M, risk low.
- **Batch 7 — Validator retirement + structural (intra-sk-code only).** Item 13 / C1. Coordination is within sk-code (playbook lives there). Effort S-M, risk low.

**Must wait for migrations to settle:** only the deep-loop *path citations* inside Batch 5 (re-verify, don't block) + P2-38's provisional deep-loop drift-tool mentions. Everything else is executable now. File C2/C4–C8 as separate issues to their owners; never mix into doc PRs.

**#1 recommendation:** ship **Batch 3 (TS trio import/emit rewrite) first** — the only cluster where following the skill verbatim yields code that cannot compile under the repo's own verified tsconfig (`nodenext` + `verbatimModuleSyntax` + `"type": "module"`, all confirmed on disk); self-contained in three files; every fix has a living compiling exemplar to copy from.

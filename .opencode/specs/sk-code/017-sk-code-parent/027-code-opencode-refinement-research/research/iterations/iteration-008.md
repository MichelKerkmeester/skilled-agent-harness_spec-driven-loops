# Iteration 008 — workflow pitfalls + implement/debug + shared tier (Facet 9)
_Executor: GLM-5.2, read-only; orchestrated by Opus._

## Iteration 8 findings — workflow pitfalls + implement/debug + shared tier

**Premise correction up front:** The objective's stated file paths (`code-opencode/references/workflow_implement.md`, `workflow_debug.md`) **do not exist** under code-opencode. Those workflow-doctrine files live in the parent-hub tier at `sk-code/shared/references/` (workflow_implement.md, workflow_debug.md, universal/error_recovery.md). `code-opencode/references/shared/` only holds `universal_patterns.md`, `code_organization.md`, `hooks.md`, `alignment_verification_automation.md`. So "the implement/debug docs + shared/universal tier" spans **two** directories. This split is itself finding P0 below.

---

**[P0] Architectural: the two "shared" tiers are unlinked from each other**
- `code-opencode` surface tier (`code-opencode/references/shared/`): code_organization, universal_patterns, hooks, alignment_verification_automation.
- `sk-code/shared/references/` workflow tier: workflow_implement, workflow_debug, workflow_verify, smart_routing, phase_detection, universal/*, universal-debugging_checklist.
- `reality:` These are sibling dirs under the same parent hub. workflow_implement.md §2.3 says "Load the minimum active-surface resource set" but **never names** the `code-opencode/references/shared/` quartet as that resource set; universal/error_recovery.md's pointers (lines 43, 108) use a *third* stale prefix scheme (`references/opencode/shared/`). Nothing cross-links the tiers, so a reader in workflow_implement cannot discover code_organization/universal_patterns.
- `recommendation:` Add a "Surface resources loaded after routing" subsection to `sk-code/shared/references/workflow_implement.md:55` that explicitly names the `code-opencode/references/shared/{universal_patterns,code_organization,hooks,alignment_verification_automation}.md` quartet. Quote to anchor: workflow_implement.md:53 "Load the minimum active-surface resource set for the intent and changed file types" — currently dangling with no pointer.

---

**[P1] Scratch-index push on a shared branch — entirely ABSENT**
- `code-opencode doc:` ABSENT (and ABSENT from the entire `sk-code/` tree: `rg 'read-tree|write-tree|commit-tree|braced|refspec|scratch.index'` → zero hits).
- `reality:` This is the safe pattern for landing file-scoped commits on a shared branch without disturbing co-authors' dirty files (read-tree from origin tip → add explicit paths → write-tree → commit-tree → blast-radius gate → push `+refs/heads/foo:refs/heads/foo`). It is empirically needed in THIS repo: `.worktrees/0001-mcp-front-proxy`, `0002-followups`, `0024-028-extract`, `0025-028-renumber` all co-exist and the main checkout frequently has unrelated dirty state.
- `recommendation:` This is genuinely sk-git's domain (owns "git/version-control intent"), not code-opencode's. But code-opencode's `workflow_implement.md` "Write" step (lines 68-76) should at least **acknowledge** that landing the edit safely on a shared branch is a downstream concern and point to sk-git, rather than implying a bare `git commit` — currently §2 "Write" step 3 ("Keep changes inside the user's scope") has no link to the commit mechanism.

---

**[P2] git worktree isolation (.worktrees/{NNNN}-name) — entirely ABSENT from code-opencode**
- `code-opencode doc:` ABSENT (`rg 'worktree|\.worktrees' code-opencode/` → zero hits).
- `reality:` `.worktrees/` exists with 4+ active worktrees using the `NNNN-name` convention (AGENTS.md §6 names this as sk-git's worktree flow). Parallel/experimental work on THIS repo is routinely worktree-based, yet the OpenCode-surface implementation playbook never mentions isolation as an option for "broad or risky work."
- `recommendation:` `workflow_implement.md:54` already says "For broad or risky work, run a bounded read-only research sweep before editing" — this is the natural hook. Add one bullet: "For parallel/experimental mutating work, isolate in a `wt/{NNNN}-{name}` worktree (see sk-git) before editing, so the main checkout's dirty state is not disturbed." Ownership stays with sk-git; code-opencode only points.

---

**[P3] Daemon single-writer model + warm-CLI reindex — entirely ABSENT**
- `code-opencode doc:` ABSENT (`rg 'single.writer|single-writer' sk-code/` → zero hits; no mention of `.opencode/bin/*.cjs` reindex anywhere in code-opencode).
- `reality:` The three daemons (spec-memory, code-index, skill-advisor) back a shared SQLite each; only one process may write. The documented reindex path (AGENTS.md §6 "Daemon CLI Transport Fallback") is the warm CLIs that exist at `.opencode/bin/code-index.cjs`, `.opencode/bin/spec-memory.cjs`, `.opencode/bin/skill-advisor.cjs` — confirmed present. Hand-editing the DB or running a second scanner while a daemon is warm corrupts state. An implementer touching `system-spec-kit`/`system-code-graph`/`system-skill-advisor` TS source routinely needs to reindex and currently has **no** guidance in their own surface skill.
- `recommendation:` This is a real OpenCode-surface process hazard and belongs in `code-opencode/references/shared/code_organization.md` §6 (which already enumerates the `scripts/` tree incl. `reindex-embeddings.ts`) or a new subsection. At minimum `workflow_implement.md` "Never" list (lines 92-99) should gain: "Never hand-edit a daemon's SQLite or spawn a parallel scanner while the warm daemon owns the DB; reindex via `.opencode/bin/{spec-memory,code-index,skill-advisor}.cjs` warm CLIs (AGENTS.md §6)."

---

**[P4] Native-module ABI / SIGBUS — absent as a hazard, present only as inert directory entries**
- `code-opencode doc:` Two inert mentions, neither teaches the hazard:
  - `code_organization.md:590-593` — bare `check-native-modules.sh` / `rebuild-native-modules.sh` entries in a directory tree dump, no WHY/WHEN.
  - `typescript/style_guide.md:649` — "optional dependencies (e.g., native modules that may not be installed)" — graceful-optional-dep typing, not ABI recovery.
  - `typescript/quality_standards.md:130` — comment example re: sqlite-vec interop typing, not ABI.
  - `SIGBUS` / `ABI` / `version skew`: zero hits across all of sk-code.
- `reality:` `rebuild-native-modules.sh` exists at `.opencode/skills/system-spec-kit/scripts/setup/rebuild-native-modules.sh` (and 4 worktree copies). The `dist-freshness-guard` preamble in THIS session shows the dist-stale trap is live. A Node-version mismatch makes `better-sqlite3`/`sqlite-vec` native modules SIGBUS under the warm daemons, and full daemon scans crash under version skew. This is a recurring THIS-repo failure mode.
- `recommendation:` This is squarely a code-opencode process hazard. Add a "Native-module ABI under daemon version skew" subsection to `code-opencode/references/shared/code_organization.md` §6 or to `shared/references/universal/error_recovery.md` Step 2 ("Isolate the surface" — add a `Native module` suspect row: `node --version` vs recorded version; if SIGBUS on daemon startup → run `scripts/setup/rebuild-native-modules.sh`). Also fix `code_organization.md:590-593` to annotate the two scripts with their purpose instead of bare listing.

---

**[P5] Comment-hygiene HARD BLOCK — taught as TASTE, not as a GATE**
- `code-opencode doc:` `universal_patterns.md` §4 "REFERENCE COMMENT PATTERNS" (lines 233-262) teaches the *style rule* well (no `T###`/`REQ-###`/`CHK-###`/spec-path pointers; durable WHY only) and links to `shared/references/universal/code_style_guide.md` §4. BUT: zero mention of the enforcement mechanism — no `check-comment-hygiene.sh`, no pre-commit hook, no posttooluse gate, no "HARD BLOCK" framing. `rg 'check-comment-hygiene|pre-commit|posttooluse|HARD.BLOCK'` in `code-opencode/references/shared/` → zero hits.
- `reality:` `check-comment-hygiene.sh` exists at **two** locations: `.opencode/skills/system-spec-kit/scripts/rules/check-comment-hygiene.sh` AND `.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh`. It is wired as a pre-commit gate AND a posttooluse gate (per AGENTS.md §1 comment-hygiene HARD BLOCK + the session preamble's "Comment hygiene [HARD BLOCK]"). So the rule is *machine-enforced*, but the surface doc presents it as a stylistic preference.
- `recommendation:` In `universal_patterns.md` §4 (around line 235), add a "Enforcement" note: "This rule is a HARD BLOCK, enforced by `check-comment-hygiene.sh` as a pre-commit hook and a posttooluse gate (see code-quality skill); violations block commit and tool-use, not just review." Also fix line 539's stale checklist path (`../../../assets/opencode/checklists/universal_checklist.md` → actual is `assets/checklists/universal_checklist.md`).

---

**[P6] Stale path references in error_recovery.md (doc wrong vs reality)**
- `code-opencode doc:` `shared/references/universal/error_recovery.md` uses an obsolete path scheme (version 3.5.0.6, predates the code-webflow/code-opencode rename). Confirmed stale by `[ -f ]` checks:
  - line 43: `references/webflow/debugging/error_recovery.md` → MISSING (real: `code-webflow/references/debugging/error_recovery.md`)
  - line 43: `references/opencode/shared/alignment_verification_automation.md` → MISSING (real: `code-opencode/references/shared/...`)
  - line 44: `assets/universal/checklists/debugging_checklist.md` → MISSING (real: `shared/references/universal-debugging_checklist.md`)
  - lines 108-109: same stale `references/webflow/` and `references/opencode/` prefixes in the surface pointer table.
  - line 129: `assets/universal/checklists/...` again.
- `reality:` 4 of 5 referenced paths resolve to nothing; the universal/code_style_guide.md link (§2.235 in universal_patterns) is the only one that resolves.
- `recommendation:` Bulk-fix the prefix scheme in error_recovery.md (lines 43, 44, 108, 109, 129, 131): `references/webflow/`→`code-webflow/references/`, `references/opencode/`→`code-opencode/references/`, `assets/universal/checklists/`→`shared/references/universal-`. Bump version past 3.5.0.6.

---

### Pitfall coverage matrix

| # | Pitfall | Status | Where it IS / should live |
|---|---------|--------|---------------------------|
| 1 | Scratch-index push on shared branch | **absent** (sk-code-wide; owned by sk-git, unlinked) | should be acknowledged in `shared/references/workflow_implement.md` §2 with sk-git pointer |
| 2 | git worktree isolation (.worktrees/) | **absent** (owned by sk-git, unlinked) | `shared/references/workflow_implement.md` §2 "Research" or "Write" |
| 3 | Daemon single-writer + warm-CLI reindex | **absent** | `code-opencode/references/shared/code_organization.md` §6 + `workflow_implement.md` Never-list |
| 4 | Native-module ABI / SIGBUS / rebuild-native-modules | **absent as hazard** (2 inert listings only) | `shared/references/universal/error_recovery.md` Step-2 table + `code_organization.md` §6 |
| 5 | Comment-hygiene HARD BLOCK | **partial** — style rule taught (universal_patterns §4), enforcement/gate mechanism absent | `code-opencode/references/shared/universal_patterns.md` §4 needs enforcement note |

Net: **0/5 taught end-to-end, 1/5 partial, 4/5 entirely absent** from the OpenCode surface. Two of the absent ones (worktree, scratch-index) are legitimately sk-git-owned and only need a pointer; three (daemon single-writer, native-module ABI, comment-hygiene gate) are genuinely code-opencode's own process hazards and are missing.

---

### Angles to pursue next

1. **Cross-tier linkage audit (P0):** Systematically check every file in `code-opencode/references/shared/` and `shared/references/universal/` for stale/`references/opencode/`-style prefixes (P6 showed the rot is systematic, not isolated). Likely affects alignment_verification_automation.md and the language quick_reference files too — candidate for a batched iteration.
2. **code-quality skill wiring (P5):** The duplicate `check-comment-hygiene.sh` at both `sk-code/code-quality/scripts/` and `system-spec-kit/scripts/rules/` suggests a hand-off/ownership story the docs don't tell — worth one iteration tracing which gate actually fires (pre-commit vs posttooluse) and whether code-quality's docs teach it.
3. **Dist-freshness trap → docs mapping:** The session-preamble `dist-freshness-guard` (3 stale dist warnings) is a SIXTH empirically-hit pitfall not in the charter's five. `workflow_implement.md` §2 "Write" and `universal/error_recovery.md` Step 3 are silent on "compiled dist must be rebuilt before trusting daemon output" — candidate for a follow-up iteration pairing the dist-trap with the daemon single-writer pitfall (P3).
4. **"Never create new files as part of debugging" sanity check:** `workflow_debug.md:95` asserts this, but the repo's own spec-folder workflow (Level 1+ mandates creating 4+ files) and the daemon-reindex reality contradict the spirit. Worth a skeptical pass on whether the Never-lists in implement/debug/verify are consistent with how THIS repo actually functions.

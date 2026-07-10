# Iteration 004 — hook contracts + alignment verifier (Facets 3+4)
_Executor: GLM-5.2, read-only; orchestrated by Opus._

## Iteration 4 findings — hook contracts + alignment verifier

Read 16 files. Two facets audited. Both council seeds **CONFIRMED** with evidence.

---

### Facet A — Hook contracts

**[P0] hooks.md §4 invents a non-existent `mcp_server/hooks/opencode/` entrypoint suite**
- `code-opencode doc:` hooks.md:108-119 documents "`mcp_server/hooks/opencode/` - 3 wired entrypoints + 1 fallback wrapper": `session-start.ts`, `user-prompt-submit.ts`, `pre-tool-use.ts`, `prompt-wrapper.ts`, citing settings wiring at `.opencode/settings.json:8/19/30`.
- `reality:` The directory **does not exist**. `ls .opencode/skills/system-spec-kit/mcp_server/hooks/` shows only `claude/` and top-level `.ts` helpers — no `opencode/`, no `copilot/`. The authoritative `mcp_server/hooks/README.md:25` states: *"OpenCode prompt-time advice is delivered by the OpenCode plugin and bridge, not by a subfolder in this directory."* The real OpenCode prompt path is `.opencode/plugins/mk-skill-advisor.js` + `system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` using `experimental.chat.system.transform` (`skill_advisor_hook.md` Runtime Matrix). The four "entrypoints" and their settings line numbers are fabricated.
- `recommendation:` Delete §4 entirely and replace with the plugin-bridge reality (point at `skill_advisor_hook.md` §2 OpenCode row + the bridge `.mjs`). The hooks.md version (3.6.0.0) predates the migration; the authoritative `hook_system.md` (3.6.0.34) and `skill_advisor_hook.md` (3.6.0.30) already record the bridge model.

**[P0] hooks.md §5 invents a non-existent `mcp_server/hooks/copilot/` managed-instructions suite**
- `code-opencode doc:` hooks.md:141-166 documents `mcp_server/hooks/copilot/` with `custom-instructions.ts`, `session-prime.ts`, `user-prompt-submit.ts`, `compact-cache.ts`, and cites `mcp_server/hooks/copilot/README.md:18` as the contract.
- `reality:` `ls .../hooks/copilot/` → `No such file or directory`. The Copilot subfolder was removed. `hook_system.md:36` references only `.github/hooks/superset-notify.json` as the current Copilot wrapper surface.
- `recommendation:` Delete §5. If Copilot coverage is still in scope for this reference, replace with the one-line reality from `hook_system.md:36-37`.

**[P1] hooks.md §2 points the OpenCode settings wiring at `.opencode/settings.json`, which does not exist**
- `code-opencode doc:` hooks.md:57, 114-116, 226-228 repeatedly cite `.opencode/settings.json` as the OpenCode wiring source-of-truth.
- `reality:` `ls .opencode/settings.json` → `No such file or directory`. There is no `.opencode/settings.json`. The authoritative `hook_system.md:37` clarifies the real predicate: *"Live native OpenCode readiness requires `[features].opencode_hooks = true` in `~/opencode.json`... plus `~/.opencode/hooks.json` or workspace `hooks.json`"* — and that the repo `.opencode/settings.json` (if it existed) would be only an *example template*. hooks.md treats a non-existent example template as the live wiring file.
- `recommendation:` Strike every `.opencode/settings.json` reference; defer to `hook_system.md` §2 "OpenCode Hook Contract Versions" table for the real registration story.

**[P1] hooks.md §3 names the wrong Claude settings file**
- `code-opencode doc:` hooks.md:80-83, 96, 227 says Claude hooks are wired in `.claude/settings.local.json` at lines 31/43/55/67.
- `reality:` `.claude/settings.local.json` contains **only** a 12-line `permissions.allow` block (and is gitignored — `git check-ignore` confirms). The actual hook wiring lives in the checked-in **`.claude/settings.json`** (lines 13-92). This inversion is systemic: `hook_system.md:19` and `hooks/claude/README.md` registration block repeat the same wrong filename.
- `recommendation:` Rename every `settings.local.json` → `settings.json` reference in hooks.md §3 (and note the systemic error for upstream docs).

**[P2] hooks.md documents a DEPRECATED hook location as canonical**
- `code-opencode doc:` hooks.md:74, 76-85 presents `mcp_server/hooks/claude/` as the canonical worked example.
- `reality:` `mcp_server/hooks/claude/README.md:1-4` carries a **DEPRECATED 2026-05-16** banner: *"This hook location is being migrated. The advisor-routing UserPromptSubmit hook now lives under `.opencode/skills/system-skill-advisor/hooks/`... After [2026-08-16] this location may be removed."* The migration target `system-skill-advisor/hooks/claude/` and its `dist/hooks/claude/` both exist, but `.claude/settings.json` still points at the old spec-kit dist path — migration is mid-flight.
- `recommendation:` Add a deprecation callout in hooks.md §3 mirroring the source README, and flag the spec-kit path as "legacy, migrating to system-skill-advisor."

**[P2] hooks.md omits two LIVE runtime hooks (PreToolUse, PostToolUse)**
- `code-opencode doc:` hooks.md covers only SessionStart/UserPromptSubmit/PreCompact/Stop. §203 cross-runtime parity table mentions Claude `PreCompact` and OpenCode `PreToolUse` (non-existent) but never a Claude `PreToolUse` or any `PostToolUse`.
- `reality:` `.claude/settings.json:14-25` wires **`PreToolUse` (matcher `Bash`)** → `.opencode/skills/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` (evaluates `hard_rules` frontmatter on `opencode run`/`claude -p` dispatches). `.claude/settings.json:80-91` wires **`PostToolUse` (matcher `Write|Edit`)** → `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh` (runs `check-comment-hygiene.sh` + `check-dist-staleness.sh`). Both fire today; neither is in hooks.md.
- `recommendation:` Add a §3b row for `PreToolUse`→dispatch-preflight-lint (owned by cli-opencode) and a §3c row for `PostToolUse`→claude-posttooluse (owned by code-quality). Note these are the *only* real pre/post-tool-use hooks in the repo.

**[P2] hooks.md §6 maintenance checklist misses the dist-freshness guard**
- `code-opencode doc:` hooks.md:172-199 editing/adding/removing checklists reference only `npm run build` and smoke tests.
- `reality:` The live `PostToolUse` hook also runs `check-dist-staleness.sh`, and `.opencode/plugins/mk-dist-freshness-guard.js` actively warns on stale dist (visible in this session's startup banner). A hook-author who rebuilds the hook dist but not a *dependency* dist (e.g. skill-advisor) will silently ship a broken hook.
- `recommendation:` Add a checklist line: "Rebuild dependent dist surfaces (spec-kit mcp_server AND skill-advisor mcp_server) — see `mk-dist-freshness-guard`."

---

### Facet B — Alignment verifier

**[P1] alignment_verification_automation.md presents a single narrow tool as the exhaustive "alignment-drift verifier"**
- `code-opencode doc:` The doc title is "Alignment Verification Automation"; §1 calls `verify_alignment_drift.py` *the* verifier and §3 enumerates only UTF-8/LF, `'use strict'`, `MODULE:` header, shebang/docstring, JSON parse.
- `reality:` The described tool **exists and is accurate** (`assets/scripts/verify_alignment_drift.py`, 15KB, coverage matches §3 verbatim — confirmed by reading source lines 1-50). But the doc omits a **sibling verifier in the same folder**: `verify_stack_folders.py` (4.4KB) validates sk-code `STACK_FOLDERS` declarations against on-disk surface folders — a pure drift check the doc's title implicitly claims to own. The folder README (`assets/scripts/README.md:4` STRUCTURE table) lists all three scripts, so the doc's own neighborhood contradicts its singleton framing.
- `recommendation:` Either (a) rename the doc to "Alignment Drift Verifier (file-level)" and add a "See also: `verify_stack_folders.py` for sk-code surface-folder drift" cross-link, or (b) expand to cover both sibling scripts. Prefer (a) — scope-honest.

**[P2] alignment doc is silent on the broader drift-guard ecosystem that actually enforces alignment at commit time**
- `code-opencode doc:` §5 RELATED RESOURCES lists only `code_organization.md`, `universal_patterns.md`, `hooks.md`. No mention of commit-time or structural drift guards.
- `reality:` The repo's real alignment enforcement is a layered system the doc doesn't map:
  - `.opencode/hooks/pre-commit` → `check-comment-hygiene.sh` (comment-hygiene drift) + `check-agent-mirror-sync.cjs` (agent-mirror drift) — both fail-open git gates.
  - `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh` — dist/source drift.
  - `.opencode/commands/doctor/scripts/parent-skill-check.cjs` (48KB) — parent-skill/mode-registry structural drift.
  - `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` — parent-hub vocabulary drift (path is **provisional** — mid-migration from `deep-loop-workflows`→`system-deep-loop` per the iteration charter).
  - The `/doctor` router surface (`route-validate.py`, `audit_descriptions.py`, `skill-graph-freshness.cjs`).
- `recommendation:` Add a §6 "Related drift-guard tooling" table mapping each guard to its scope, so a reader lands here and sees the full alignment landscape rather than one file-level checker. Mark deep-loop paths provisional.

**[P3] assets/scripts/README.md carries a stale folder path**
- `code-opencode doc:` `assets/scripts/README.md:1` frontmatter and §1 say the folder is `.opencode/skills/sk-code/assets/scripts`.
- `reality:` The scripts live at `.opencode/skills/sk-code/code-opencode/assets/scripts/` (confirmed: only one `verify_alignment_drift.py` exists, under `code-opencode/`). The README predates the two-axis parent-hub restructure that nested assets under the surface packet.
- `recommendation:` Fix the path in the README frontmatter and §1, or note it as a known-stale code README (out of scope for this facet, but surfaced because the alignment doc points here).

---

### Council-seed verification

| Seed | Verdict | Evidence |
|---|---|---|
| **hooks.md documents REMOVED OpenCode/Copilot hook infrastructure** | **CONFIRMED (strong)** | `mcp_server/hooks/opencode/` and `mcp_server/hooks/copilot/` do not exist on disk (`ls` → No such file). The authoritative `mcp_server/hooks/README.md:25` explicitly states OpenCode advice is delivered by the plugin bridge, not a subfolder. hooks.md §4/§5 fabricate entrypoint tables, settings line numbers, and README references for removed infrastructure. hooks.md version (3.6.0.0) is older than the authoritative `hook_system.md` (3.6.0.34) that already records the removal. |
| **SKILL.md over-claims post-tool-use coverage** | **CONFIRMED (strong)** | `code-opencode/SKILL.md:35` advertises hooks.md as covering "session-prime / user-prompt-submit / pre-tool-use / post-tool-use contracts." hooks.md contains **zero** mentions of `PostToolUse` or `post-tool-use`. The real PostToolUse hook (`.claude/settings.json:80-91`, matcher `Write|Edit` → `code-quality/scripts/hooks/claude-posttooluse.sh`) is entirely undocumented. The real PreToolUse hook (`dispatch-preflight-lint.mjs`) is likewise absent. SKILL.md's four-item contract list names two events hooks.md never touches. |

---

### Used-but-undocumented (worth ADDING)

1. **`dispatch-preflight-lint.mjs`** (cli-opencode) — the only real `PreToolUse` hook; evaluates `hard_rules` frontmatter on CLI dispatches. Owned by cli-opencode, not spec-kit.
2. **`claude-posttooluse.sh`** (code-quality) — the only real `PostToolUse` hook; runs comment-hygiene + dist-staleness checks on Write/Edit.
3. **`check-dist-staleness.sh`** (code-quality) — dist/source drift guard invoked by the post-tool hook; central to the dist-trap gap from iteration 2.
4. **`true-citation-mining.ts`** (spec-kit hooks/claude) — imported by `session-stop.ts:23`; absent from both hooks.md §3 and the claude/README library list. Minor (it's a helper, not an entrypoint) but worth a library-table row.
5. **`worktree-guard.sh`** (`.opencode/bin/`) — co-wired in `.claude/settings.json:59-63` SessionStart alongside session-prime; absent from hooks.md §3 SessionStart row.
6. **`session-cleanup.sh` / `session-cleanup.js`** — co-wired in `.claude/settings.json:73` Stop hook; absent from hooks.md §3 Stop row.
7. **`verify_stack_folders.py`** — sibling drift verifier in the alignment scripts folder.

---

### Angles to pursue next

1. **Gate-3 / settings-file-naming systemic error.** Three independent docs (`hooks.md`, `hook_system.md`, `hooks/claude/README.md`) plus two hook-script docstrings all call the shared file `settings.local.json` when reality is `settings.json`. Worth a dedicated finding tracing the origin and blast radius — this is exactly the kind of "doc speaks an old contract" failure the charter targets, and it spans code-opencode's neighbor docs, not just code-opencode.
2. **The DEPRECATED spec-kit hooks/claude/ location vs. live settings.json wiring.** The source README declares deprecation (2026-08-16 removal) but `.claude/settings.json` still points at the legacy dist path. Is the migration stalled, or is the spec-kit dist a re-export shim? Verify whether `system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js` re-exports from `system-skill-advisor` or is a true legacy build. This affects whether hooks.md should document the old or new path.
3. **OpenCode native hook readiness predicate.** `hook_system.md` introduces `~/opencode.json` `[features].opencode_hooks = true` + `~/.opencode/hooks.json` as the live OpenCode predicate — none of which code-opencode documents. If OpenCode is a first-class surface for this skill, the absence of the native-hook readiness story is a Facet-3-shaped gap worth its own pass.
4. **`/doctor` as the real alignment-verification surface.** The alignment doc frames a single Python script as "the verifier," but `/doctor` (with `parent-skill-check.cjs`, `route-validate.py`, `audit_descriptions.py`, `skill-graph-freshness.cjs`) is arguably the *operational* alignment verifier agents actually invoke. Worth auditing whether code-opencode should document `/doctor` as the alignment entry point and demote the Python script to "file-level sub-check."

Emitting.

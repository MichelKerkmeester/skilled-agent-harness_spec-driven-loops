---
title: "Deferred Decisions (Tier D)"
description: "Rationale plus recommendations for findings deferred from packets 002-007 of system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor that require explicit human decision before runtime or structural changes."
trigger_phrases:
  - "deferred decisions skill-advisor"
  - "tier d decisions"
  - "skill-advisor architectural deferrals"
importance_tier: "important"
---

# Deferred Decisions (Tier D)

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

This doc tracks findings from the `system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor` packet (children 001-007) that were deferred because they require:

1. Runtime config changes that need explicit human approval (F4 `.devin/hooks.v1.json`).
2. Architectural decisions about deprecation timelines (F6 dual hook locations).
3. Renumbering decisions that risk breaking checked-in inventory tests (F35, F36, F37).
4. Annotations rather than restructure for playbook scenario structure (F34, handled in 007).

Each section documents the current state, the blocker, plus the recommended action. The human reviewer plus skill maintainer decide when to act on each item. This doc itself is documentation-only and does not change runtime behavior.

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-f4-devin-hooks -->
## 2. F4: `.devin/hooks.v1.json` migration

### Status: DONE as of 2026-05-16 in packet `008-tier-d-execution`

UserPromptSubmit now points to `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js`. SessionStart now points to `.opencode/skills/system-code-graph/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js`. Pivot from original plan: SessionStart was migrated to system-code-graph (its actual conceptual owner) rather than system-skill-advisor, because the hook source carries the `// MODULE: Devin SessionStart Hook — Code Graph Startup Context` comment plus imports `code-graph-boundary.js`. The system-code-graph dist already contained a compiled artifact at the target path.

### Original-current state (preserved for history)

`.devin/hooks.v1.json` registers two hooks:

1. `UserPromptSubmit` pointing to `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/user-prompt-submit.js`
2. `SessionStart` pointing to `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js`

Both paths point to the OLD `system-spec-kit` location. The NEW location at `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/` exists plus contains a compiled `user-prompt-submit.js` but lacks `session-start.js`.

### Blocker

A complete migration of both hooks requires building `session-start.js` at the NEW location. The source TypeScript may not exist yet in the NEW package, OR the build script does not yet compile it. Verification needed before migration.

### Recommended actions (in priority order)

**Option A (preferred)**: Build the missing `session-start.js` at the NEW location, then migrate both hook entries in one commit:

1. Verify `.opencode/skills/system-skill-advisor/hooks/devin/session-start.ts` exists. If not, copy from system-spec-kit OLD location plus update import paths.
2. Add it to the package build (typically `tsc -p tsconfig.build.json` will pick it up if it is in `include[]`).
3. Run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build`.
4. Verify `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/session-start.js` exists.
5. Edit `.devin/hooks.v1.json` to point both hooks to the NEW paths in one atomic edit.
6. Restart Devin or have the operator restart their Devin session to pick up the new config.

**Option B**: Partial migration. Update only the `UserPromptSubmit` entry, leave `SessionStart` on OLD with a documented exception. Adds risk that maintainers later forget the OLD location still has live consumers.

**Option C**: Status quo. Leave both hooks on OLD. Acceptable if the OLD location is not deprecated yet (see F6 below). No action.

### Risks

- `.devin/hooks.v1.json` is runtime config consumed by Devin. A wrong path produces silent hook failure plus the operator may not notice until skill-advisor surface stops appearing in Devin output.
- The disable-flag interaction (per `INSTALL_GUIDE.md` §8): Devin hook checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first plus falls back to `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`. Migration does not change this contract.

<!-- /ANCHOR:2-f4-devin-hooks -->

---

<!-- ANCHOR:3-f6-dual-hook-locations -->
## 3. F6: dual hook location resolution

### Status: DEPRECATION BANNERS IN PLACE as of 2026-05-16 in packet `008-tier-d-execution`

All 4 OLD hook READMEs (`system-spec-kit/mcp_server/hooks/{claude,codex,gemini,devin}/README.md`) now carry the 2026-05-16 deprecation banner with a 2026-08-16 removal target (90-day window). `devin/README.md` was created (it was missing). Operators have a clear migration deadline. Actual OLD-location removal stays out of scope: it requires the 90-day window to elapse plus a verification pass that no remaining runtime consumers point at OLD paths.

### F6 audit progress (2026-05-18)

Mid-window audit while preparing for the 2026-08-16 removal:

**Runtime configs — ALL migrated to NEW:**
- `.claude/settings.local.json` — no hook entries (Claude consumes MCP only).
- `.codex/config.toml` — no hook entries.
- `.gemini/settings.json` — no hook entries.
- `.devin/hooks.v1.json` — both `UserPromptSubmit` and `SessionStart` point at NEW (`system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/...` and `system-code-graph/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js` respectively).
- OpenCode plugin (`.opencode/plugins/spec-kit-skill-advisor.js`) — owns its own loading, not affected.
- Cross-runtime grep for `system-spec-kit/mcp_server/hooks/`: zero hits in active runtime config files. Two hits in documentation (`README.md` lines 767, 769 and `DEPLOYMENT.md` line 7). Remaining hits are historical research/impl logs.

**Compiled NEW dist is self-contained:**
- Imports in `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js` only resolve to `../../mcp_server/lib/*.js` (skill-internal). No imports from OLD `system-spec-kit/mcp_server/hooks/` in the compiled output.
- `grep -rE "system-spec-kit/mcp_server/hooks" .opencode/skills/system-skill-advisor/mcp_server/dist` returns zero hits.

**OLD location contents that DO have non-hook consumers — must not be removed naively:**

| OLD path | Still in use by | Disposition for 2026-08-16 |
|---|---|---|
| `system-spec-kit/mcp_server/hooks/{claude,codex,gemini,devin}/user-prompt-submit.ts` | Nothing at runtime (NEW dist is self-contained) | Safe to delete after 2026-08-16 |
| `system-spec-kit/mcp_server/hooks/{claude,codex,gemini,devin}/README.md` | Operators migrating away | Safe to delete after 2026-08-16 |
| `system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | Documented in `DEPLOYMENT.md` L7 as the project-hash source. | Keep until separate migration packet. |
| `system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts` | Documented in `README.md` L769 as the canonical helper. | Keep until separate migration packet. |
| `system-spec-kit/mcp_server/hooks/devin/session-prime.ts` + `session-start.ts` | Code-graph SKILL.md §8.2 explicitly documents these as still-in-use under spec-kit (ADR-001 hook ownership asymmetry). | Keep — not in scope for the F6 90-day removal. |
| `system-spec-kit/mcp_server/hooks/{shared,session-stop,claude-transcript,compact-inject}.ts` | Unverified consumers. | Audit case-by-case in the removal packet. |

**Revised F6 removal scope (after 2026-08-16):**

The removal at 2026-08-16 should be limited to:
- The 4 per-runtime entry-point files `system-spec-kit/mcp_server/hooks/{claude,codex,gemini,devin}/user-prompt-submit.ts` + each runtime's `README.md`.

NOT included in the F6 removal:
- `hook-state.ts` (per DEPLOYMENT.md consumer)
- `freshness-smoke-check.ts` (per README.md consumer)
- `session-prime.ts` / `session-start.ts` (per code-graph SKILL.md ADR-001)
- `shared.ts` / `session-stop.ts` / `claude-transcript.ts` / `compact-inject.ts` (unverified consumers)

A future packet (`008-skill-advisor/010-old-hooks-helper-migration` or similar) should migrate the helpers to NEW before they can be removed from OLD. That packet is separate from F6 and is NOT bounded by the 2026-08-16 date.

### Original-current state (preserved for history)

Hooks exist at TWO locations:

- OLD: `.opencode/skills/system-spec-kit/mcp_server/hooks/{claude,codex,gemini,devin}/` with source TS plus compiled JS
- NEW: `.opencode/skills/system-skill-advisor/hooks/{claude,codex,gemini,devin}/` with source TS, plus `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/{claude,codex,gemini}/` with compiled JS (devin missing session-start.js per F4)

No README or doc explains which location is canonical or when OLD will deprecate.

### Recommended action

Mark OLD as deprecated with a 90-day migration window. Concrete steps:

1. Add a top-banner deprecation note to every README under `.opencode/skills/system-spec-kit/mcp_server/hooks/*/README.md`:

   ```markdown
   > **DEPRECATED 2026-05-16.** This hook location is being migrated to `.opencode/skills/system-skill-advisor/hooks/`. Update any runtime config (e.g. `.devin/hooks.v1.json`) before 2026-08-16. After that date this location may be removed without further notice.
   ```

2. Track migration completeness per runtime in a tracker doc or this doc's appendix:

   | Runtime | OLD path used by | NEW path ready | Action |
   |---|---|---|---|
   | Claude | `.claude/settings.local.json` hooks block | yes | Update Claude config |
   | Codex | `.codex/config.toml` hooks section | yes | Update Codex config |
   | Gemini | Gemini CLI hook config | yes | Update Gemini config |
   | Devin | `.devin/hooks.v1.json` | partial (session-start.js missing) | Resolve F4 first |
   | OpenCode plugin | `.opencode/plugins/mk-skill-advisor.js` | n/a (plugin owns its loading) | No change needed |

3. After all runtime configs are migrated plus the 90-day window passes, delete the OLD location in a separate cleanup packet.

### Risks

- Premature deletion of OLD breaks Devin hook (until F4 resolves).
- Forgetting to update one runtime's config leaves it silently using the OLD location.
- The OLD `system-spec-kit/mcp_server/hooks/` directory may have other consumers (test harnesses, internal scripts) beyond the visible runtime configs. Verify before delete.

<!-- /ANCHOR:3-f6-dual-hook-locations -->

---

<!-- ANCHOR:4-f34-playbook-structure -->
## 4. F34: playbook TEST EXECUTION structure deviation

### Current state

20 scenario files under `manual_testing_playbook/0[5-8]--*/` use a deviating §3 TEST EXECUTION structure (numbered command steps plus `### Expected Signals` plus `### Failure Modes`) instead of the canonical sk-doc subsections (`### Prompt`, `### Commands`, `### Expected`, `### Evidence`, `### Pass / Fail`, `### Failure Triage`).

### Action taken in packet 007

Each of the 20 files received a documentation note at the top of §3 TEST EXECUTION explaining the deviation is intentional and pointing here for rationale.

### Rationale

The current structure ties scenario semantics directly to runtime output checks (Expected Signals → tool response fields, Failure Modes → triage table). Restructuring to the canonical template would either:

- Duplicate the information across the new subsections, increasing maintenance cost without adding value.
- Force the runtime checks into a more abstract form, losing the directness that makes operator validation reliable.

The deviation is intentional plus shipped in packet 007 with the documentation note.

### Recommended action

None. Status quo. If a future sk-doc template revision broadens the canonical structure to include the current shape, the deviation notes can be removed in a single sweep.

<!-- /ANCHOR:4-f34-playbook-structure -->

---

<!-- ANCHOR:5-f35-catalog-toc -->
## 5. F35: catalog TOC numbering mismatch

### Current state

`feature_catalog/feature_catalog.md` TOC numbers sections 1-8 sequentially while directory layout uses 01, 02, 03, 04, 06, 07, 08 (gap at 05). Section 5 (SCORER FUSION) in the TOC maps to directory `04--scorer-fusion`, section 6 (MCP SURFACE) maps to `06--mcp-surface`, creating a mismatch.

### Action already taken (packet 004)

Gap-05 explanatory note added to feature_catalog.md §1 documenting the intentional reservation. The note states the gap is preserved for spec-folder cross-reference stability.

### Recommended action

None. Status quo. Renumbering would either:

- Force a global rename of `04--scorer-fusion` → `05--scorer-fusion` plus `06-08` shift up, breaking spec-folder cross-references in packets 058, 098, 100, plus others.
- Or renumber the TOC to match directory numbers (gap-05 in TOC too), making the TOC look broken.

Both options are worse than the current explanatory-note approach. Leave as-is.

<!-- /ANCHOR:5-f35-catalog-toc -->

---

<!-- ANCHOR:6-f36-hooks-and-plugin-numbering -->
## 6. F36: 07--hooks-and-plugin file numbering gap

### Current state

Directory `feature_catalog/07--hooks-and-plugin/` contains files 01, 03, 04, 05 (missing 02).

### Recommended action

Low-impact. Two options:

**Option A (recommended)**: Accept and move on. The gap is invisible from the root catalog (the TOC simply lists 4 features). No operator action would discover the gap unless they `ls` the directory directly.

**Option B**: Rename `03-` → `02-`, `04-` → `03-`, `05-` → `04-` to make the directory sequential. Risk: breaks any deep links to those files in other packets or in code.

Pick A unless a maintainer reports operator confusion from the gap.

<!-- /ANCHOR:6-f36-hooks-and-plugin-numbering -->

---

<!-- ANCHOR:7-f37-coverage-asymmetry -->
## 7. F37: catalog/playbook coverage asymmetry

### Status: DONE as of 2026-05-16 in packet `008-tier-d-execution`

Playbook root `manual_testing_playbook.md` now carries §17.5 "Catalog group ↔ playbook category mapping" with all 7 catalog groups mapped plus the 2 playbook-only categories (`03--compat-and-disable`, `04--operator-h5`) called out explicitly. Mapping is documented as intentionally asymmetric, with rationale ("catalog models feature ownership; playbook models operator workflow"). Renumbering decision deferred indefinitely because it would break checked-in inventory tests.

### Original-current state (preserved for history)

`manual_testing_playbook/` has 9 categories. `feature_catalog/` has 7 groups. Mapping is not 1:1:

- Playbook `03--compat-and-disable` plus `04--operator-h5` have NO corresponding feature_catalog groups.
- Catalog `01--daemon-and-freshness` has NO dedicated playbook category (split across `05--auto-update-daemon` plus `04--operator-h5`).
- Catalog `06--mcp-surface` has NO dedicated playbook category (split across `01--native-mcp-tools` plus `02--cli-hooks-and-plugin`).

### Recommended action

Document the asymmetry as intentional with a cross-reference table in the playbook root. NOT renumber. Renumbering risks breaking checked-in inventory tests (`tests/manual-testing-playbook.vitest.ts` per research finding from iter 014).

Concrete: add a §17.5 cross-reference table to `manual_testing_playbook.md` showing the catalog group → playbook category mapping (1-to-many and many-to-1 entries explicit). Operators reading the playbook then see exactly where each catalog group's scenarios live.

Status: documentation update planned for a future packet. Low urgency.

<!-- /ANCHOR:7-f37-coverage-asymmetry -->

---

<!-- ANCHOR:8-related -->
## 8. RELATED

- `001-audit-and-research/research/research.md` §4 Open Questions, original Tier D items
- `002-bug-fixes/implementation-summary.md` Known Limitations, F4/F6 first surfaced
- `004-sk-doc-1to1-alignment/implementation-summary.md` Known Limitations, F35/F36/F37 first deferred
- `006-deferred-cleanup/implementation-summary.md` Known Limitations, full deferred catalog as of pre-007 state
- `007-deferred-final/implementation-summary.md`, what 007 actually shipped plus what stays here

<!-- /ANCHOR:8-related -->

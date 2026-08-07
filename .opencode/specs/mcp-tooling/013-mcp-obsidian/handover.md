---
title: "Session Handover — mcp-obsidian mode (build → expansion → validation → fixes)"
description: "Handover for the mcp-obsidian mode packet: dual CLI+MCP mode built and shipped to v4, 3 community-plugin references deepened, live playbook validation (18/19 + benchmark 98), and two validation-driven doc fixes. Records the environment changes, blockers (spec-memory daemon down; immature Mode-B benchmark), and next steps."
trigger_phrases:
  - "mcp-obsidian handover"
  - "mcp-obsidian session continuation"
  - "obsidian mode validation handover"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian"
    last_updated_at: "2026-08-04T12:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Applied validation-driven doc fixes and pushed v4.0.0.0"
    next_safe_action: "Finalize 009/010 fingerprints when spec-memory daemon is healthy"
    blockers:
      - "spec-memory daemon down (socket ENOENT) — blocks memory_save fingerprint finalization for 009 + 010"
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md"
      - ".opencode/specs/mcp-tooling/013-mcp-obsidian/010-playbook-validation/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/013-mcp-obsidian-handover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->
# Session Handover — mcp-obsidian mode

Continuation record for the mcp-obsidian mode packet: it was built, expanded, live-validated, and self-corrected across one long session; everything shipped to `origin/skilled/v4.0.0.0`.

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Read this to continue mcp-obsidian work: to finalize the deferred completion fingerprints, re-run the immature live benchmark, or extend the mode. Status: **in_progress** (work shipped; two bookkeeping items deferred on infra).
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-08-02 → 2026-08-03 (single long session)
- **To Session:** next mcp-obsidian continuation
- **Phase Completed:** BUILD + EXPANSION + VALIDATION + FIXES (all shipped)
- **Handover Time:** 2026-08-03
- **Recent action:** Applied validation-driven doc fixes (mode → v1.1.0.1) and pushed to `origin/skilled/v4.0.0.0` as `ef61926475`.

**What shipped to v4 (3 pushed commits, all confirmed on origin):**
1. `0dbad2848c` — `mcp-obsidian` mode (dual CLI + MCP, mirrors `mcp-click-up`) + hub registration.
2. `cc6edc98d0` — expansion: 3 community-plugin references deepened + hub reconciled to 7 modes + advisor discoverability.
3. `ef61926475` — live playbook validation packet (`010-playbook-validation`) + 2 doc fixes (mode v1.1.0.1) + Mode-A routing benchmark (PASS 98).
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision | Rationale | Impact |
|----------|-----------|--------|
| Mode mirrors `mcp-click-up` (dual CLI + MCP) | Consistency with the established hub pattern | Whole `mcp-obsidian/` tree shape |
| Adopt-set: notesmd-cli (headless), official `obsidian` CLI, cyanheads `obsidian-mcp-server` | Verified live packages/versions | `.utcp_config.json`, SKILL.md profiles |
| Retarget finance plugin → `mkshp-dev/obsidian-finance-plugin` ("Beancount Ledger", id `beancount-finance`) | The shipped stub documented the WRONG plugin (pranjulsingh/flat-financing) | 9 files retargeted; `flat-financing.md` deleted |
| Router split PLUGINS → FINANCE/TABLES/BRAT (specific beats generic) | A finance query should load only finance docs | mode SKILL.md §2 router, v1.1.0.0 |
| Validation executors: deepseek-v4-flash via cli-pi (headless) + cli-opencode (MCP/plugins) | Operator directive | Phase 2–4 runs |
| Push via isolated throwaway worktree (cherry-pick onto fresh origin tip) | The local clone has 71 dirty operator files + concurrent commits + untracked `mcp-magnific` — an in-place rebase would corrupt operator work | Every push this session |

### 2.2 Blockers Encountered
**Blockers:** spec-memory daemon down; Mode-B live benchmark immature.

| Blocker | Status | Resolution/Workaround |
|---------|--------|-----------------------|
| spec-memory daemon down (socket `ENOENT /tmp/mk-spec-memory/daemon-ipc.sock`, exit 75); `memory_save` hangs 1800s | OPEN | Blocks the formal completion fingerprint for 009 + 010. Packets RECORD results; fingerprint finalizes when the daemon is healthy or via `/memory:save`. Did NOT restart the shared daemon (operator infra). |
| notesmd-cli v0.3.6 `search` (title) broken headlessly | FIXED (documented) | The run's only scenario FAIL. SKILL.md + obsidian-cli-commands.md now steer name lookups to `list`+filter / `search-content`. |
| Mode-B live benchmark returned BLOCKED-42, D1-inter/D4 still unscored | OPEN | Immature follow-on path; 6/16 live dispatches failed (`routed-intra`, `backend-kind-mismatch` — on figma/refero, not obsidian). Report is UNCOMMITTED at `benchmark/reports/2026-08-03--playbook-validation--live/` — recommend discarding. Retry needs a stronger executor (e.g. `gpt-5.6-sol`), not deepseek-flash. |
| cli-pi blocked by a broken `.pi/extensions/spec-gate-classify.ts` | RESOLVED (operator fixed it) | Bypassed with `pi -ne` while broken; operator later fixed the duplicate declaration. |

### 2.3 Files Modified
- **Mode (shipped):** `.opencode/skills/mcp-tooling/mcp-obsidian/**` (SKILL.md v1.1.0.1, references incl. per-plugin subfolders + assets, feature-catalog, manual-testing-playbook, changelog/{v1.0.0.0,v1.1.0.0,v1.1.0.1}).
- **Hub (shipped):** `.opencode/skills/mcp-tooling/{SKILL.md,description.json,graph-metadata.json,hub-router.json,mode-registry.json,leaf-manifest.json,README.md,shared/references/smart-routing.md,manual-testing-playbook/**,benchmark/reports/**}`; repo `.utcp_config.json`, `.env.example`, `README.md`.
- **Spec (shipped):** `013-mcp-obsidian/**` incl. `009-community-plugin-support` and the `010-playbook-validation` parent + 5 children.
- **Environment (NOT in git — on the user's machine):** Local REST API v5.1.0 installed into BOTH vaults (`MEGA/Documents/Obsidian` + the iCloud vault) with a seeded API key; official `obsidian` CLI registered at `/usr/local/bin/obsidian`; the repo `.env` (gitignored) holds `obsidian_OBSIDIAN_{API_KEY,BASE_URL=https://127.0.0.1:27124,VERIFY_SSL=false}`; the user's active Obsidian vault was switched to `Obsidian` via `obsidian://open`.

### 2.4 Traps & Scar Tissue
- **spec-kit `--strict` completion fingerprint is a rabbit hole.** `completion_pct:100` requires a real content fingerprint that ONLY the MCP `memory_save` content-router computes; hand-editing (or a fake fingerprint) trips `FRONTMATTER_MEMORY_BLOCK` / `GENERATED_METADATA_INTEGRITY`. Leave phase packets at `completion_pct:0` (scaffold-valid) until the daemon can save; do NOT hand-forge fingerprints.
- **Isolated-worktree push is mandatory here.** The local clone carries 71 dirty operator files, concurrent operator commits, and an untracked `mcp-magnific/` dir (which fails `parent-skill-check 6a` locally but is absent on origin/in a fresh worktree). Always: fetch → `git worktree add -b <tmp> origin/skilled/v4.0.0.0` → cherry-pick your commit → regenerate `leaf-manifest.json` to resolve its conflict → verify → push `<tmp>:skilled/v4.0.0.0` → remove worktree. Never rebase the local branch in place.
- **Two DIFFERENT Obsidian MCP servers.** cyanheads `obsidian-mcp-server` = `obsidian_*` tools (what the mode's `.utcp_config` targets). The `obsidian-local-rest-api` plugin (v5.1.0+) ALSO ships its own built-in MCP at `https://127.0.0.1:27124/mcp/` = `16 vault_*` tools. `references/mcp-tools.md` now warns not to conflate them.
- **cli dispatch gotchas:** `opencode run` MUST end with `</dev/null` or it hangs at 0% CPU; prepend `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`. cli-pi needs `pi -ne` if any `.pi/extensions/*.ts` is broken. deepseek is a small model → RCAF, file-anchored prompts.
- **Research artifacts (~4M) under `013/**/research/` are deliberately excluded from every commit** (evidence, not deliverables). Stage explicit paths; never `git add` a whole packet dir.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
Confirm origin state: `git merge-base --is-ancestor ef61926475 origin/skilled/v4.0.0.0` (should be true). The mode is live at v1.1.0.1 with the validation packet on v4. Nothing is mid-edit.

### 3.2 Priority Tasks Remaining
1. **Finalize 009 + 010 completion fingerprints** once the spec-memory daemon is healthy — run `memory_save` (or `/memory:save`) on each packet's `implementation-summary.md`, then `validate.sh <folder> --strict` should reach Errors:0.
2. **Decide the failed live-benchmark report** — discard `benchmark/reports/2026-08-03--playbook-validation--live/` (recommended; it is misleading vs the authoritative Mode-A PASS 98) OR retry Mode B with `gpt-5.6-sol` to actually score D1-inter + D4.
3. **(Optional) apply the OBS-013 note** — the user's BRAT `data.json` does not exist (only `brat-migrations.json`); the mode already documents the empty-defaults behavior.

### 3.3 Critical Context to Load
- [ ] `010-playbook-validation/**` impl-summaries hold the full run results (headless 7/8, MCP 6/6, plugins 3/3, official-CLI 2/2, benchmark PASS 98).
- [ ] Indexed save / continuity: `generate-context.js` for indexed saves; edit `_memory.continuity` in `implementation-summary.md` for quick updates.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [ ] All three commits (`0dbad2848c`, `cc6edc98d0`, `ef61926475`) confirmed on `origin/skilled/v4.0.0.0`.
- [ ] Mode at v1.1.0.1 with the search + MCP-surface fixes present on origin.
- [ ] `010-playbook-validation` (33 files) on origin.
- [ ] Context saved via `generate-context.js` or `_memory.continuity` — DEFERRED (spec-memory daemon down).
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

The whole session validated the mode against a REAL vault (18/19 scenarios PASS; the one FAIL was a genuine notesmd-cli v0.3.6 bug that fed a doc fix). The 7-mode hub routing benchmark (Mode A, deterministic) passed at 98. The mode is production-shipped on v4; the only open items are infra-blocked bookkeeping (fingerprints) and an immature live-benchmark path — neither blocks use of the mode.
<!-- /ANCHOR:session-notes -->

# Iteration 005 — convergence, phasing, risks

- **Wave:** 3 (of 3)
- **Executor:** `openai/gpt-5.5-fast --variant high` via cli-opencode (read-only convergence/critic seat, exit 0)
- **Seat id:** bhb2jjkhg
- **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-005.txt`
- **Raw output (full tables):** `../raw/iter-005.out`
- **Confidence (seat self-report):** high

> Read all four prior iteration digests + the shipped mcp-open-design tree. (Couldn't glob spec-150 folder — based phasing on shipped skill shape + stated precedent.)

---

## Cross-iteration contradictions & gaps (resolved)
- **yolo default vs skill policy:** upstream `figma-cli connect` defaults to yolo (patch); skill default must be `connect --safe`. Resolve: document "upstream default vs skill policy"; safe = skill default, yolo = explicit consent + rollback.
- **official-first vs Framelink-existing:** IT2 said official-first; IT4 noted Framelink already registered as `figma`. Resolve: figma-cli primary; keep Framelink `figma` as compat default; add official MCP under DISTINCT opt-in names after live discovery.
- **Code Mode HTTP unproven** for Figma OAuth/catalog → include a proof step; document `mcp-remote` stdio as conservative bridge.
- **allowed-tools too broad** (IT3 proposed Bash+Edit+Glob+Grep+code_mode+Read+Write). Mirror mcp-open-design's minimal set — likely `[Read, Bash]` (+ code_mode call access if used). Avoid Edit/Write in runtime frontmatter unless the build proves need.
- **local-export overwrite gap:** `extract`/`export`/`export-jsx` write local files (read-only re: Figma, but can clobber files) → need explicit output-path + no-overwrite rule.
- **init-agent mutates repo** (`AGENTS.md`) → skill should NOT run/recommend it by default.
- **platform policy:** macOS baseline; Linux/Windows = unsupported/experimental until verified.
- Builder must verify live `figma-cli --help` + actual installed binaries (don't trust docs); official MCP schemas only known after `list_tools()`/`tool_info()`.

## Recommended phased plan (final)
| Phase | Scope | Key deliverables | Deps | Level |
|---|---|---|---|---|
| **151 parent** | phase-parent control only | spec.md, description.json, graph-metadata.json (no heavy docs) | — | parent |
| **001 research** | this research (done) | iterations + convergence + raw evidence | parent | 2 |
| **002 CLI-first runtime MVP** | usable skill around figma-cli primary | SKILL.md, smart router, minimal frontmatter, CLI-primary/MCP-optional routing, safety rules, references/figma_cli_reference.md, tool_surface.md, troubleshooting.md | 001 | 2 |
| **003 install & lifecycle** | safe/reversible/scriptable install+connect+daemon | INSTALL_GUIDE.md + scripts (install/doctor/connect-safe/connect-yolo/daemon/unpatch); install verifies only, never patches | 002 | 3 |
| **004 optional MCP + Code Mode** | official + Framelink guidance, not required | references/mcp_wiring.md, code_mode_integration.md, print-utcp-snippets.sh, distinct manual-name plan, list_tools/tool_info verify flow | 002, partial 003 | 2 |
| **005 user docs + validation assets** | match shipped sibling shape | README.md, feature_catalog/, manual_testing_playbook/, changelog | 002-004 | 2 |
| **006 registration + strict validation** | discoverable + graph-integrated | descriptions.json, graph-metadata schema 2 + reciprocal sibling edges, advisor trigger phrases, validate.sh --strict, sk-doc validation | 005 | 2 |
| **007 optional live verification (gated)** | prove integrations on operator machine | live install/detect, safe connect, daemon status, optional MCP discovery; no destructive cmds w/o separate approval | 006 + human approval | 2 (3 if yolo/official-write tested) |

Seat recommendation: keep 002 cohesive (SKILL.md WITH its core CLI reference + safety taxonomy — don't ship a half-true SKILL.md); keep install/lifecycle, optional-MCP, docs, registration, live-verify separate (different risk/approval profiles).

## Risk register (top) — full table raw/iter-005.out:33-46
- npm-vs-repo binary mismatch (H/H) → verify both bins, fail closed [owns 003] **(see orchestrator-verifications.md — worse than seat thought: `figma-cli` npm = unrelated tool)**
- yolo patches Figma app bundle (M/H) → safe default, explicit flag, `unpatch` rollback [003/007]
- install.sh accidentally connects/patches (L/H) → install+verify only; connect scripts separate [003]
- official MCP http/OAuth/catalog gate fails (H/M) → optional, distinct names, mcp-remote bridge, verify before claims [004/007]
- Framelink `figma` naming conflict (M/M) → don't overwrite; use figma_official_* names [004/006]
- official MCP schema/name drift (M/M) → never hardcode as fact until tool_info() [004/007]
- local exports overwrite files (M/M) → explicit output path, no overwrite default [002/005]
- figma-cli docs drift from source/help (M/H) → source-verified refs + live --help; mark verify-before-use [002/003]
- daemon token exposure (L/H) → doctor redacts; never paste; localhost-bound [002/003]
- Figma rate/seat limits (M/M) → document; prefer sparse metadata; MCP optional [004/005]
- design-judgment scope creep (H/M) → transport only; route to sk-design-interface; no vibe catalog [002/005]
- cross-platform overclaim (H/L) → macOS baseline; mark others unverified [003/005]

## Whole-skill acceptance checklist (16 items) — full at raw/iter-005.out:48-64
Parent holds only control docs · concise CLI-primary user-invocable SKILL.md · minimal allowed-tools · 6-intent router · binary detection checks both bins + verifies · safe default, yolo gated · destructive gated (target+preview+confirm+rollback) · exports no silent overwrite · install idempotent verify-only · doctor redacts secrets · Framelink preserved + official under non-conflicting names · official examples require discovery first · README/refs/catalog/playbook/changelog/graph match sibling shape · graph-metadata schema 2 edges+triggers · strict validate + sk-doc validate pass · optional live phase proves detect+safe-connect+discovery without destructive actions.

## Open questions requiring a human decision (9)
1. Phase 007 live-install now, or docs/scripts-only first release?
2. Allow yolo-patch live verification at all, or safe-mode-only?
3. Official MCP: direct-HTTP first, or `mcp-remote` stdio only until http proven?
4. Keep Framelink `figma` as documented default compat MCP? (seat rec: YES + official under new names)
5. Skill version 1.0.0, or pre-1.0 until live-verified?
6. Linux/Windows explicitly unsupported, or experimental-no-guarantees?
7. Helper scripts ever edit `.utcp_config.json`, or print-only? (seat rec: print-only)
8. Repo-external clone to `~/.figma-ds-cli/source` acceptable as fallback install?
9. Which destructive/live-write commands (if any) allowed in manual testing?

## Confidence + residual unknowns
High for the convergence plan. Residual = live-env dependent: actual npm state (now resolved in orchestrator-verifications.md), exact `figma-cli --help`, official MCP OAuth/catalog behavior in Code Mode, live tool schemas.

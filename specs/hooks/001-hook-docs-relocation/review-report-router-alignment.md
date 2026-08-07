# Review Report — Router / Routing-Config Alignment after Hook-Doc Relocation

> Audit scope: router & routing-config files in live trees (excluded `.opencode/specs/`, `node_modules`, `z_archive`, `.git`).
> Review-only audit; the only write is this report. No router/config/doc/code file was modified.

## Verdict

**PARTIAL**

Core router configs (all 7 `hub-router.json` + 7 `mode-registry.json` pairs, `agent-router.md`,
`post-edit-router.cjs`, `shared-smart-router.md`, sk-code `SKILL.md` §2, spec-gate classify routing,
spec-memory daemon routing configs, compiled-routing routers) are aligned: no dangling old-location
references, every registry/resource target resolves, and no router doc contradicts the new AGENTS.md
mechanics. Three command-backed findings remain inside the skill-advisor routing/install surface and
one of its hook-delivery docs.

## Findings

| ID | Sev | file:line | Evidence (command + output) | Fix |
|----|-----|-----------|------------------------------|-----|
| F1 | P1 | `.opencode/skills/system-skill-advisor/INSTALL-GUIDE.md:134` | `test -e .opencode/skills/system-skill-advisor/hooks/opencode/user-prompt-submit.ts` → `MISS`; same `MISS` for `hooks/opencode/prompt-wrapper.ts` and `hooks/lib/opencode-hook-policy.ts`; `ls .opencode/skills/system-skill-advisor/hooks/opencode/` → `No such file or directory`; `find .opencode -name "*opencode-hook-policy*" -o -name "prompt-wrapper.ts"` → no matches (exit 1). Row 135 of the same file lists the real OpenCode delivery (`.opencode/plugins/mk-skill-advisor.js` + `mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`, both `test -f` OK), and the relocated canonical doc `hooks/skill-advisor-hook.md` states OpenCode goes through the plugin bridge. | Delete row 134 or repoint it to the actual OpenCode adapter path (the plugin-bridge row at line 135 already covers OpenCode). Do not reference a `hooks/opencode/user-prompt-submit.ts` source adapter — none exists. |
| F2 | P2 | `.opencode/skills/system-skill-advisor/SKILL.md:81,184,395`; `README.md:214,245`; `INSTALL-GUIDE.md:396`; `leaf-manifest.json:99`; `leaf-aliases.json:474-475` | `test -f .opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md` → `OK` (resolves), but `diff references/hooks/skill-advisor-hook.md hooks/skill-advisor-hook.md` → `DIFFERENT`; `grep "^version:"` → `references/hooks/...: 0.8.0.33` vs `hooks/...: 3.6.0.31`. The relocated canonical doc is `hooks/skill-advisor-hook.md` (per change #1 and confirmed by `system-spec-kit/references/config/hook-system.md:122`, which references the new path). `references/hooks/` is a divergent older duplicate, and `RESOURCE_MAP["HOOK"]` routes the "skill advisor hook" intent to it. | Repoint `RESOURCE_MAP["HOOK"]` (SKILL.md:184) and the §3 package references (:81, :395), plus README/INSTALL-GUIDE/leaf-manifest/leaf-aliases, to `hooks/skill-advisor-hook.md`; reconcile or remove the divergent `references/hooks/skill-advisor-hook.md` copy. |
| F3 | P2 | `.opencode/skills/system-skill-advisor/hooks/pi/README.md:19` | `grep -n "governor\|proof\|comment hygiene"` → line 19: "…plus the fixed comment-hygiene and governor directives…". `grep -n "TERMINAL_PROOF_DIRECTIVE"` on `mcp-server/lib/render.ts` → lines 65, 204, 210, 215 (and identical in compiled `dist/mcp-server/lib/render.js` lines 28, 133, 135, 139): the brief now emits THREE directives — comment hygiene + governor + proof over appearance. The pi delivery doc lists only two. | Add the proof-over-appearance directive to the pi README brief description (three directives), matching `render.ts`'s `HYGIENE_DIRECTIVE + GOVERNOR_DIRECTIVE + TERMINAL_PROOF_DIRECTIVE`. |

## Files Checked (per-file pass/fail)

| File | Result |
|------|--------|
| `.opencode/skills/cli-external-orchestration/hub-router.json` | PASS — no hook/directive refs; defaultResource + routerSignals targets exist |
| `.opencode/skills/cli-external-orchestration/mode-registry.json` | PASS — all mode packet folders + SKILL.md exist |
| `.opencode/skills/mcp-tooling/hub-router.json` | PASS |
| `.opencode/skills/mcp-tooling/mode-registry.json` | PASS |
| `.opencode/skills/sk-code/hub-router.json` | PASS |
| `.opencode/skills/sk-code/mode-registry.json` | PASS |
| `.opencode/skills/sk-design/hub-router.json` | PASS |
| `.opencode/skills/sk-design/mode-registry.json` | PASS |
| `.opencode/skills/sk-doc/hub-router.json` | PASS |
| `.opencode/skills/sk-doc/mode-registry.json` | PASS |
| `.opencode/skills/sk-prompt/hub-router.json` | PASS |
| `.opencode/skills/sk-prompt/mode-registry.json` | PASS |
| `.opencode/skills/system-deep-loop/hub-router.json` | PASS |
| `.opencode/skills/system-deep-loop/mode-registry.json` | PASS |
| `.opencode/commands/agent-router.md` | PASS — no hook/directive/old-path refs |
| `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` | PASS — all 6 `CHECKER_RELATIVE_PATHS` targets `test -f` OK |
| `.opencode/skills/system-spec-kit/references/cli/shared-smart-router.md` | PASS — no hook/directive refs |
| `.opencode/skills/sk-code/SKILL.md` §2 Smart Routing | PASS — registry-driven; referenced targets (`shared/README.md`, `shared/references/smart-routing.md`, `.opencode/bin/compiled-route.cjs`) exist |
| `.opencode/skills/system-skill-advisor/SKILL.md` routing sections | FAIL — F2 (stale `references/hooks/…` HOOK route) |
| `.opencode/skills/system-skill-advisor/README.md` | FAIL — F2 (lines 214, 245) |
| `.opencode/skills/system-skill-advisor/INSTALL-GUIDE.md` | FAIL — F1 (line 134 dangling) + F2 (line 396) |
| `.opencode/skills/system-skill-advisor/leaf-manifest.json` | FAIL — F2 (line 99) |
| `.opencode/skills/system-skill-advisor/leaf-aliases.json` | FAIL — F2 (lines 474-475) |
| `.opencode/skills/system-skill-advisor/hooks/pi/README.md` | FAIL — F3 (line 19) |
| `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md` (new canonical) | PASS — exists, v3.6.0.31, no old-location refs |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` (+ compiled `dist/…/render.js`) | PASS — three-directive capsule in source and dist |
| `.opencode/skills/system-spec-kit/SKILL.md` | PASS — uses new paths (`hooks/goal/goal-plugin.md`, `system-skill-advisor/hooks/skill-advisor-hook.md`); all `test -f` OK |
| `.opencode/skills/system-spec-kit/references/config/hook-system.md` | PASS — line 122 uses new path; target exists |
| `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` | PASS — no hook/directive refs |
| `.opencode/skills/system-spec-kit/mcp-server/configs/*` (spec-memory daemon routing) | PASS — no hook/directive refs |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/README.md` + `claude|pi|README.md`, `plugin-bridges/README.md` | PASS — new-path refs, targets exist |
| `.opencode/bin/lib/compiled-routing/**/router.cjs` / `canary-router.cjs` | PASS — no hook/directive refs |
| sk-design / sk-doc smart-router docs (pseudocode, templates, schema) | PASS — no hook/directive refs |

## Check Summary (command-backed)

- **A. Dangling old location** — `grep -rn "system-spec-kit/references/hooks"` across live router/config trees: no hits in any router file (matches only in binary SQLite data files). Old dir `.opencode/skills/system-spec-kit/references/hooks/` confirmed gone (`ls` → No such file or directory). F1 is a dangling reference to *new*-location files that were never created.
- **B. New-path correctness** — All references to the moved docs (`goal-plugin.md`, `injection-contract.md`, `skill-advisor-hook.md`, `skill-advisor-hook-validation.md`) in spec-kit routing/docs use the new locations and resolve. Exceptions: F1 (INSTALL-GUIDE opencode adapter) and F2 (skill-advisor routes to the pre-existing divergent copy under `references/hooks/` instead of the relocated `hooks/` canonical).
- **C. Registry resolution** — All 7 hub-router + 7 mode-registry entries resolve (`test -f` / folder+`SKILL.md`); all post-edit-router checker scripts exist.
- **D. Content alignment** — No router doc contradicts AGENTS.md FINAL-STATE VERIFICATION, Terminal Command Discipline, or Directive Capsule. Change #2 (three directives) is correctly present in `render.ts` source + compiled dist; the stale 2-directive description is F3.

## Final Message

Verdict: **PARTIAL** — router and routing-config core (all hub/mode registries, agent-router, post-edit-router, shared-smart-router, sk-code smart router, spec-gate, spec-memory daemon configs, compiled-routing routers) is aligned and resolves cleanly, but the skill-advisor routing/install surface carries one dangling adapter path and two stale directive-capsule references. Findings: **3** (1 × P1, 2 × P2).

Top 3 fixes:
1. **F1 (P1)** — `.opencode/skills/system-skill-advisor/INSTALL-GUIDE.md:134`: remove or repoint the dangling OpenCode row (`hooks/opencode/user-prompt-submit.ts` + `prompt-wrapper.ts` + `lib/opencode-hook-policy.ts` — none exist); line 135's plugin-bridge row is the correct OpenCode surface.
2. **F2 (P2)** — Repoint the skill-advisor HOOK route and package references (`SKILL.md:81,184,395`; `README.md:214,245`; `INSTALL-GUIDE.md:396`; `leaf-manifest.json:99`; `leaf-aliases.json:474-475`) from the divergent `references/hooks/skill-advisor-hook.md` (v0.8.0.33) to the relocated canonical `hooks/skill-advisor-hook.md` (v3.6.0.31), and reconcile/remove the duplicate.
3. **F3 (P2)** — `.opencode/skills/system-skill-advisor/hooks/pi/README.md:19`: update the brief description to the three directives (comment hygiene, governor, proof over appearance) per `render.ts` (`HYGIENE_DIRECTIVE + GOVERNOR_DIRECTIVE + TERMINAL_PROOF_DIRECTIVE`).

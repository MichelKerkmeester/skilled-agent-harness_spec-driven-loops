# Iteration 009 — structural coherence + completeness critic
_Executor: GLM-5.2, read-only; orchestrated by Opus._

## Iteration 9 findings — structural coherence + completeness critic

**Headline:** `code-opencode/SKILL.md`'s §2 REFERENCE MAP + §4 ASSETS are **structurally sound** — all 5 language trios, the 4-file `shared/` tier, the **3 workflow-doctrine symlinks**, and all 10 checklists resolve. **Methodology caveat discovered: `glob` hides symlinks** — iteration-8's premise "the workflow files don't exist under code-opencode" was a glob artifact (they're symlinks → `../../shared/references/`). The real defects are one undocumented subtree + a broken shipped verifier + a content over-claim.

### Structural findings
- **[P1] `assets/scripts/` is a structural orphan from the packet contract** — SKILL.md §4 (`:47-53`) scopes ASSETS to checklists only; the 4-file scripts subtree (incl. both verifiers) is never mentioned in SKILL.md or README §2. Only `verify_alignment_drift.py` is reachable (`alignment_verification_automation.md:30`).
- **[P1] `verify_stack_folders.py` is permanently broken AND a near-orphan AND breaks a sibling's test** — parses nonexistent `STACK_FOLDERS` → always `exit 1` (iter-2); referenced only from the stale README + external `manual_testing_playbook/08--design-restraint/stack-folders-validator.md` (DR-004, which expects a clean `exit 0` that can **never pass**) + parent `changelog/v3.4.0.0.md:47` (stale path). Cross-packet structural contradiction.
- **[P2] SKILL.md §2 `hooks.md` description over-claims** — `:35` lists "pre-tool-use / post-tool-use contracts" hooks.md does not contain (iter-4). Link resolves; content wrong.
- **[P3] `assets/scripts/README.md` doubly stale** — declares folder `sk-code/assets/scripts` (`:3,20`); the `../../SKILL.md` link (`:110`) post-restructure resolves to `code-opencode/SKILL.md`, not the labelled `sk-code/SKILL.md`; `:92` bakes ephemeral packet-id "026" into a code README.
- **[P3] `changelog/`** — acknowledged in README §2 (`:27`), absent from SKILL.md.
- **[P4] Skeleton otherwise sound** — verified via `ls -la` + `find -type l` (not glob); code-opencode correctly carries **no** graph-metadata/description.json (one-identity invariant respected).

**Orphan/dead-ref inventory:** `assets/scripts/` (subtree undocumented); `verify_stack_folders.py` (broken + unreferenced from `references/`); `test_verify_alignment_drift.py` (legit test, undocumented); `assets/scripts/README.md` (stale path + wrong link label + packet-id leak). **No dead references inside SKILL.md §2/§4 proper** — every named target resolves.

### Residual coverage gaps (not yet examined)
1. **Deep-loop runtime coding conventions (charter Facet 8)** — entirely unexamined across iters 1-8; PROVISIONAL (mid-migration).
2. **JS trio content-fidelity cascade** (iter-1 angle #3) — flagged, never closed (does `js/quality_standards.md`'s `MemoryError`/`context` match real `code`/`details`/`recoveryHint`?).
3. **Cross-packet coupling `manual_testing_playbook` ↔ `code-opencode/assets/scripts`** — newly surfaced here.
4. **Symlink-following methodology gap** — newly surfaced; affects every prior "does not exist" claim.
5. **feature_catalog** — confirmed none (out of scope).

### Top-leverage shortlist (for synthesis)
1. `typescript/{style_guide,quick_reference,quality_standards}.md` — NodeNext `.js`-extension rule + `createRequire(import.meta.url)` + `node:` prefix; fix examples (iter-1: verbatim copy fails to compile).
2. `shared/references/workflow_verify.md` (+`workflow_implement.md`) — stale-dist trap: daemon serves gitignored `dist/`; rebuild before any verify claim (iter-3: false negative).
3. `assets/scripts/verify_stack_folders.py` (+DR-004) — delete/rewrite the always-failing verifier; retire the impossible DR-004 (iter-2+9).
4. `references/shared/hooks.md` §4/§5 — delete fabricated `hooks/opencode|copilot/` suites + `.opencode/settings.json`; use live plugin-bridge reality (iter-4 P0×2).
5. `assets/checklists/skill_authoring.md` — add Option-E parent-hub checks (one `graph-metadata.json`, `mode-registry`+`hub-router`) (iter-5 P0).
6. `SKILL.md:16` — split surface trigger (`.opencode/` path) from language sub-detection (extension→trio); bare extensions aren't surface markers (iter-7, council #27).
7. `typescript/quality_standards.md` §10 — package-aware build doctrine + `tsconfig.build.json`; drop `--noCheck` (iter-3 P1: wrong verify command).
8. `references/config/style_guide.md` — JSONC-behavior vs strict-JSON-descriptor genres (iter-2 P1: descriptor corruption risk).
9. `assets/checklists/{command,mcp_server}_authoring.md` — teach the 2 real command architectures + 3-tier MCP assembly + Code-Mode split (iter-6 P1×3).
10. Cross-cutting stale-evidence-pointer sweep — `references/opencode/`→`code-opencode/`, `lib/common.sh`→`shell-common.sh`, `config/config.jsonc`, `settings.json`, `skill_creation.md`, dead `.claude/commands/`+`.opencode/prompts/` mirrors (iters 2/4/5/6/8).
11. `code_organization.md` §6 + `universal_patterns.md` §4 + `workflow_implement.md` Never-list — daemon single-writer, native-ABI/SIGBUS, comment-hygiene as HARD BLOCK gate (iter-8).
12. `SKILL.md` §4 + README §2 + `assets/scripts/README.md` — document `assets/scripts/`, fix stale path/label, strip "026", reconcile hooks.md over-claim (iter-9).

Findings written to `research/iterations/iteration-009.md` (read-only, no edits outside the packet's `research/`).

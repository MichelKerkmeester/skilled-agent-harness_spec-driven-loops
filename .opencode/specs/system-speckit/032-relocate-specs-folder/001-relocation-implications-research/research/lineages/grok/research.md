# Research Synthesis: Specs Folder Relocation Implications

**Lineage:** grok (`cli-cursor` / `cursor-grok-4.5-high`)  
**Session:** `fanout-grok-1786007920763-ma04a6`  
**Spec:** `.opencode/specs/system-speckit/032-relocate-specs-folder/001-relocation-implications-research`  
**Stop reason:** `converged` (all five key questions evidence-backed after 6 iterations)  
**Recommendation lean:** **NO-GO for a raw move now; CONDITIONAL-GO only behind a dual-root cutover program.** Prefer keeping `.opencode/specs` as the real tree unless a hard product requirement forces top-level authority.

---

## 1. Executive verdict

The codebase is mid-migration in spirit: many validators and normalizers already accept both `specs/` and `.opencode/specs`, but **create defaults, Memory discovery authority, startup-checks, findSpecsRoot, and index-scope globs still treat `.opencode/specs` as the real/canonical root**. Today's root `specs -> .opencode/specs` symlink collapses both allowlist entries to one tree, which **hides** these bugs until the symlink is inverted or removed.

A literal relocate without fixing those hotspots would: recreate packets under a resurrected `.opencode/specs`, shadow Memory indexing if a leftover canonical path remains, fail startup continuity checks, and force a large git reindex under SOURCE while changing the meaning of downstream `~/.gitignore_global` `/specs`.

---

## 2. Ranked implications

| Rank | Area | Implication | Evidence |
|------|------|-------------|----------|
| P0 | Memory MCP | Discovery walks `.opencode/specs` whenever it exists; leftover canonical path shadows a new real top-level `specs/` | `memory-index-discovery.ts:203` |
| P0 | create.sh | New packet `SPECS_DIR` hardcoded to `$REPO_ROOT/.opencode/specs` | `create.sh:811` |
| P0 | Memory startup | `startup-checks` locks paths to `.opencode/specs` only | `startup-checks.ts:264` |
| P1 | Graph parser | `findSpecsRoot` requires parent dirname `=== '.opencode'` | `graph-metadata-parser.ts:847` |
| P1 | Index scope | Default exclude glob `**/.opencode/specs/**` misses bare `specs/` | `index-scope.ts:45` |
| P1 | Git SOURCE | Tracked tree is under `.opencode/specs/**`; `specs` is mode `120000` symlink; move = mass path churn | `git ls-files -s specs`; `.gitignore:10-11` |
| P1 | Git downstream | Global `/specs` + `/.opencode/` ignore AI-SpecKit mounts; real top-level `specs/` changes ignore semantics | `~/.gitignore_global:11,16` |
| P1 | backfill default | `--all` defaults to `.opencode/specs` (validator via identity already allows bare `specs`) | `backfill-graph-metadata.ts:319,287` |
| P2 | Gate 3 / docs | `SPEC_ROOTS` dual-lists both; prompts/AGENTS still example `.opencode/specs` as canonical | `gate-3-classifier.ts:136`; `AGENTS.md:265`; `spec-gate-core.mjs:107` |
| P2 | Mirrors | Hook JSON has no specs paths; Claude SYNC documents a missing `.claude/specs` symlink | `.claude/SYNC.md:28`; hook grep empty |
| P3 | Path-ref volume | ~117 runtime code files vs thousands of md/json; naive sed unsafe | iter-5 counts |

---

## 3. Answers to key questions

### Q1 — Tooling path assumptions
- **Hardcoded defaults:** `create.sh` SPECS_DIR; `backfill-graph-metadata` default root; `findSpecsRoot` `.opencode`-parent test.
- **Dual-accept already:** `create.sh` path validator; `resolveArtifactRoot` approved roots; `resolveSpecFolderIdentity` bare-`specs` fallback.
- **Parameterized / agnostic:** `generate-description` (explicit base-path); `validate.sh` (explicit folder arg).

### Q2 — Cross-runtime mirrors
- Hooks do not embed specs roots.
- Mirrors symlink skills/commands into `.opencode`.
- Behavioral language lives in Gate 3 + AGENTS/CLAUDE.
- `.claude/SYNC.md` claims a whole-dir `specs` symlink that is **absent on disk**.

### Q3 — Git / gitignore
- SOURCE: `!specs` and `!.opencode/` override global ignores so this repo tracks the tree.
- Downstream: `/specs` and `/.opencode/` keep mounts untracked.
- Inversion requires SOURCE history/path reindex and careful downstream communication; `/.opencode/` ignore remains relevant for skills/commands.

### Q4 — Memory MCP
- Gate D: canonical `.opencode/specs` wins if present; legacy `specs/` only when canonical absent.
- Startup-checks hard-lock canonical.
- Alias SQL partially dual; index-scope glob not dual; tool schema prose drifts.

### Q5 — Path-ref scale/risk
- Actionable runtime surface ~117 files; docs dominate counts.
- Prefer dual-root + default flip over blanket replace.
- Metadata `specFolder` fields often already root-relative (0 absolute-prefix hits in sampled description/graph-metadata patterns).

---

## 4. Ruled-out directions

- Symlink-only flip as sufficient migration.
- Mirror-first work (hooks are not the blast radius).
- Claiming Memory/tooling "already fully dual-root."
- Using raw ~476k occurrence counts as rewrite estimates.
- Blanket `sed` across the repo.

---

## 5. Conditional-GO checklist (if relocation is still desired)

1. Flip or configure **create.sh** and **backfill** defaults to the chosen authoritative root.
2. Update **Memory discovery**, **startup-checks**, **findSpecsRoot**, **index-scope** together in one cutover.
3. Add regression fixtures that use a **real** top-level `specs/` directory (not only the current symlink collapse).
4. Plan SOURCE git move of `.opencode/specs/**` → `specs/**` and decide whether `.opencode/specs` becomes a compatibility symlink (and for how long).
5. Publish downstream guidance for `~/.gitignore_global` `/specs` semantics.
6. Refresh Gate 3 examples + AGENTS/CLAUDE path tables after code defaults flip.
7. Clean Claude SYNC doc vs missing `.claude/specs` symlink independently.

Until 1–3 land, **lean NO-GO**.

---

## 6. Sources (selected)

- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:713,811`
- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:287,319`
- `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:847`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:266`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203`
- `.opencode/skills/system-spec-kit/mcp-server/startup-checks.ts:264`
- `.opencode/skills/system-spec-kit/mcp-server/lib/utils/index-scope.ts:45`
- `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:282`
- `.gitignore:7-11`, `~/.gitignore_global:11,16`
- `.claude/SYNC.md:28`, `AGENTS.md:265`
- Lineage iterations `iteration-001.md` … `iteration-006.md`

---

## 7. Convergence report

| Field | Value |
|-------|-------|
| Stop reason | converged (all_questions_answered) |
| Iterations | 6 / 10 |
| Questions answered | 5 / 5 |
| newInfoRatio trend | 1.0 → 0.92 → 0.95 → 0.93 → 0.90 → 0.45 |
| Average recent novelty | declining into synthesis band |
| Quality guards | source diversity pass; coverage pass; no single-weak-source |

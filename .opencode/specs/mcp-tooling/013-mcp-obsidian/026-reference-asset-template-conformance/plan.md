# Plan — mcp-obsidian reference + asset template conformance

## Approach (as executed)

1. **Explore** — 3 agents mapped the template contract, the reference deviations (3 divider styles, 3 index templates, frontmatter drift), and the asset deviations (12 raw fixtures template-exempt; 9 `.md` docs need alignment; naming inconsistency).
2. **Isolated worktree** from `origin/skilled/v4.0.0.0` — all rewrites contained there.
3. **Content+structure harmonization** — 12 cli-codex `gpt-5.6-luna` max/fast agents (one per plugin + shared), content-preserving, each rewriting its docs to the canonical spine. A second focused re-dispatch fixed 7 docs whose first H2 was not `## 1. OVERVIEW` (with an explicit Gate-3-pre-resolved instruction, since the codex agents halted on the repo's spec-folder question).
4. **Deterministic finishing (orchestrator) — the parts luna does not do reliably:** a Python normalizer inserted the Style-A `---` dividers, aligned H1↔title, and added the missing `health-viz` frontmatter; `git mv` renamed the fixtures + relocated BRAT; a global path replace updated every reference; leaf-manifest regenerated.
5. **Verify** (below) and **commit + push** to v4.

## Verification gates run

- `validate_document.py` on all 54 docs → 0 failures.
- Style-A divider check (a `---` between every H2) → 0 missing.
- H1 == frontmatter title → 0 mismatches; frontmatter present on every doc; all versions bare.
- Dangling-link sweep → 0; `check_authored_name_kebab.py` → pass.
- Content drift guard (code-fence + table + word counts vs origin) → 0 flagged.
- `validate_skill_package.py` PASS; leaf-manifest fresh for mcp-tooling.

## Lessons

- luna passes `validate_document.py` but does NOT reliably add dividers or align titles — those are deterministic and were finished by script, not re-dispatch.
- Dispatched codex agents halt on the repo's Gate-3 spec-folder question unless it is pre-resolved in the prompt (`AI_SESSION_CHILD=1` alone only bypasses the runtime hook, not the agent reading AGENTS.md).

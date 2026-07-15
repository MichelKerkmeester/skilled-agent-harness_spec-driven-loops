# Deep-Review Strategy — Path-Reference Integrity Audit (skills / commands / agents)

**Target:** all path references across active skills, commands, and agents.
**Trigger:** post-#133 verification ("see if all path references etc are correct").
**Spec folder:** `.opencode/specs/sk-doc/013-catalog-playbook-snippet-denumbering` (artifacts in `review/`).
**Executor:** DeepSeek-v4-pro via cli-opencode (`--pure`, read-only, no `--agent`), 10 iterations.

## Approach (orchestrator-applied, read-only)

Deviation from the canonical `/deep:start-review-loop` loop is deliberate and recorded:
- The canonical cli executor uses `--dangerously-skip-permissions` (RM-8 risk — the config behind the 2026-05-04 44-file deletion). A read-only audit must not carry that risk.
- The canonical loop converges on *dimension coverage* (~3-4 passes for a path-ref audit), which does not model the user's "10 passes covering all skills/commands/agents" (coverage-by-area).
- Operator standing preference (memory): parallel fan-out, read-only dispatch, central reduce.

So: a **deterministic markdown-link resolver** provides authoritative ground truth; **10 read-only DeepSeek iterations** add what regex cannot see; the **orchestrator** writes all state (Gate-3 / RM-8 safe).

## Deterministic baseline (authoritative — `baseline/`)

- Files scanned: 3,386 active `.md` (excludes z_archive/z_future/.worktrees/research dumps).
- Refs checked: 24,512 markdown links. **Broken: 295 (98.8% resolve).**
- **0 de-number-fixable** → the #133 snippet de-numbering left zero broken numbered-snippet links. The 295 are *other* breakage.
- Fix-resolver: **79 confidently fixable** (52 unique + 27 ranked target match; 129/129 proposals verified to resolve on disk), **50 ambiguous**, **166 truly missing** (target basename exists nowhere active → deleted/never-created).
- 10,454 low-confidence backtick "paths" set aside (prose mentions, examples).

## Model-reliability finding (cross-check is mandatory)

Adversarial verification of iteration 1 (sk-code): DeepSeek correctly identified the **systemic root cause** (sk-code checklist links omit the surface-marker dir, e.g. `references/config/…` → `references/opencode/config/…`) and the right *target file*, BUT:
- its `correct_target` relative paths had the wrong `../` depth (proposed fix still broken);
- it hallucinated "FALSE_POSITIVE — exists now" on links that are still broken on disk.

⇒ Deterministic checker is authoritative for "broken or not" and for correct targets. Model output is treated as **advisory narrative + hunt candidates**, every claim cross-checked deterministically in synthesis.

## Iteration plan (10)

Triage (baseline-seeded, judgment + within-slice hunt):
1. sk-code checklists→references · 2. sk-doc assets/templates · 3. other sk-* + deep-* ·
4. system-spec-kit manual_testing_playbook · 5. cli-* + remaining catalog/playbook · 6. skill:system non-playbook.

Hunt (regex-missed classes):
7. agents frontmatter+body · 8. commands frontmatter+body · 9. cli/mcp/deep/system SKILL.md frontmatter+prose · 10. broken anchors + cross-skill + synthesis.

## Verdict mapping
FAIL if any P0; CONDITIONAL if any P1 (no P0); PASS otherwise. Per-iteration verdict recomputed from severity counts (model self-verdict unreliable).

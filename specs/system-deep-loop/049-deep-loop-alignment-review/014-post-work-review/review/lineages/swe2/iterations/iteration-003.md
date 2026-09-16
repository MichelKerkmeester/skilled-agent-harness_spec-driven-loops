# Iteration 3 — Agent Mirror Crosswalk Audit

**Focus:** D3 Traceability + D1 Correctness — Angle 3: does the six-tree agent crosswalk hold, and did phase 008's three claimed fixes actually land?
**Phase record audited:** `008-agent-mirror-parity`

## Method

1. Read the crosswalk document and checked each of its structural claims against the trees.
2. Grepped all six agent trees for the `budgetProfile`/`edgeCases` demand the phase claims to have removed.
3. Verified the `.pi` `# Unmapped` convention in both directions: present where the permission map predicts it, absent where it doesn't.
4. Verified symlink topology for `.cursor` and `.devin`, and the `.claude` tier path-reference fix.
5. Diffed the deep-review bodies of the two authored trees after applying the crosswalk's own sanctioned normalization.

## Evidence

### Crosswalk document — complete and accurate

`agent-mirror-crosswalk.md` exists [SOURCE: deep-improvement/references/shared/agent-mirror-crosswalk.md] with per-key tables for `permission` (2.1), `temperature` (2.2), `mode` (2.3), `tools` (2.4), `model` (2.5) across all six trees, plus the `.pi` `# Unmapped` rule stated as contract (:88-95), the `.codex` `sandbox_mode` boundary (:97-101), sanctioned-delta list (§3), and the manual-invocation model-drift note (§4). Both `agents/README.txt` files cite it at :11, and both carry the manual-invocation sentence [SOURCE: .opencode/agents/README.txt:14-15].

### budgetProfile/edgeCases removal — verified

Zero occurrences of either key across `.opencode/agents/`, `.claude/agents/`, `.pi/agents/`, `.codex/agents/`, `.cursor/agents/`, `.devin/agents/`. SC-003 holds.

### `.pi` `# Unmapped` convention — verified in both directions

- `deep-review`'s `.opencode` permission map allows `read, write, edit, bash, grep, glob, list` [SOURCE: .opencode/agents/deep-review.md permission block] — every allowed key maps (glob→find, list→ls), so the generated `.pi` file correctly carries **no** `# Unmapped` comment and a complete lowercase tools list [SOURCE: .pi/agents/deep-review.md:1-12].
- Eight other `.pi` agents DO carry the comment (debug, markdown, deep-improvement, prompt-improver, context, ai-council, deep-research, design) — the convention fires exactly where allowed-but-unmappable keys exist.

### Symlink topology — verified

`.cursor/agents/deep-review.md -> ../../.claude/agents/deep-review.md`; `.devin/agents/deep-review/AGENT.md -> ../../../.claude/agents/deep-review.md`. Both trees are symlinks onto `.claude` as the crosswalk states.

### `.claude` tier fix — verified

`.claude/agents/deep-review.md` refers to its own tier at :11 (path convention), :291, :561-562. `tools: Read, Write, Edit, Bash, Grep, Glob` correctly drops `list` — documented as sanctioned loss in crosswalk §2.1 (no Claude counterpart).

### Authored-tree body parity — byte-identical after sanctioned normalization

`.opencode` vs `.claude` deep-review bodies: 592 lines each, **zero real differences**. The single apparent diff line (`| .claude/agents/deep-review.md | Mirror of canonical agent |`) is a correct cross-tree reference that names the `.claude` path identically in both files — the row describes the mirror file, which lives at `.claude` regardless of which tree you read it from.

### Per-mode leaf scoping — verified

Both `leaf-scopes.json` files exist with disjoint per-mode scopes; regenerated `leaf-manifest.json` gives `agent-improvement` 23 agent-improvement+shared leaves vs `model-benchmark`'s own set — no hash collision. The collision test `generate-leaf-manifest-scopes.test.cjs` exists, and all three mirror gates (`check-agent-mirror-sync.cjs`, `agent-roster-mirror-check.cjs`, both sync generators) are present.

## Findings

None. Every claim in the phase record survived adversarial verification: the crosswalk rows match the trees, the sanctioned losses are the ones actually observed, the `# Unmapped` convention is self-consistent in both directions, and the leaf sets are genuinely distinct.

## Claims refuted

- "The crosswalk overstates coverage" — refuted: all five keys have real per-tree rows and each row matches observed reality (permission→sandbox_mode derivation, temperature loss, mode loss, tool lexicons, codex-only model pin).
- "A tree still demands budgetProfile/edgeCases" — refuted: zero occurrences anywhere.
- "The leaf sets still collide" — refuted: manifest shows disjoint per-mode sets.

## Verdict rationale

Clean pass. The phase's own claimed fixes are all present and correctly scoped; no finding emerged.

Review verdict: PASS

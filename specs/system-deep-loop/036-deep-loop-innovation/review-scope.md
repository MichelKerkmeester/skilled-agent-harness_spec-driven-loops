# 036 Deep-Loop-Innovation — Conformance Review Scope

Focused acceptance criteria for this review. The review target is this packet, but most artifacts
under audit live in the shipped `system-deep-loop` skill tree and its sibling `cli-external-orchestration`
skill; cross-reference the packet's documented work against those surfaces. Cite every finding with
`[SOURCE: file:line]`.

## Check 1 — Code ↔ sk-code (opencode surface)

All code created or changed by the 036 program must conform to `sk-code`'s opencode-surface patterns
and verification. Authority: `.opencode/skills/sk-code/SKILL.md` §2 Smart Routing (opencode surface) +
its bundled opencode-surface reference/verification.

Audit surfaces:
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/**` — typed ledger, reducers/projections,
  transition-authorization gateway, sealed artifacts, certificates/receipts, resume adapters,
  shadow-parity, rollback/mode-gates, `write-containment.ts`, `executor-config.ts`, `executor-audit.ts`.
- `.opencode/skills/system-deep-loop/runtime/scripts/**` — `fanout-run.cjs`, `reduce-state.cjs`,
  `convergence.cjs`, dispatch scripts.
- `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/**` — the 007/001 stress suite.

Finding when: code diverges from sk-code opencode conventions, or ships without the surface's
verification.

## Check 2 — Every feature ↔ manual-testing-playbook scenario + feature-catalog snippet

Every feature added or updated by the 036 program must have BOTH a corresponding
`manual-testing-playbook/` scenario AND a `feature-catalog/` snippet.

Authorities:
- `.opencode/skills/system-deep-loop/**/manual-testing-playbook/`
- `.opencode/skills/system-deep-loop/**/feature-catalog/`
- `.opencode/skills/cli-external-orchestration/**/manual-testing-playbook/` and `.../feature-catalog/`
  (the six external CLI adapters exercised by 007/001).

Finding when: a shipped 036 feature has no matching playbook scenario, or no feature-catalog snippet
(or one that no longer describes current behavior).

## Check 3 — references/assets ↔ sk-create-skill templates

All `system-deep-loop` references and assets added or created must match the templates defined in
`sk-create-skill`, INCLUDING the nested mode skills. Authority:
`.opencode/skills/sk-doc/sk-create-skill/` (templates + the shared skill-root-metadata contract).

Audit surfaces:
- `.opencode/skills/system-deep-loop/references/**`, `.opencode/skills/system-deep-loop/assets/**`.
- Nested mode skills — `deep-research/`, `deep-review/`, `deep-ai-council/`, `deep-improvement*/`,
  `agent-improvement/`, `model-benchmark/`, `skill-benchmark/`, `deep-alignment/`, `benchmark/`,
  `changelog/`, `feature-catalog/`, `manual-testing-playbook/`, `shared/` — their `references/` and
  `assets/`, plus root metadata (`graph-metadata.json`, hub-only `description.json`/`mode-registry.json`/
  `hub-router.json`).

Finding when: a reference/asset diverges from the sk-create-skill template shape (required section
anchors, structure, or root-metadata placement per the per-class matrix).

## Severity mapping

- **P0** — a shipped feature or code path with NO conformance: missing entirely, or it contradicts the
  named authority.
- **P1** — partial conformance: present but incomplete or divergent from the authority.
- **P2** — cosmetic, naming, or formatting divergence only.

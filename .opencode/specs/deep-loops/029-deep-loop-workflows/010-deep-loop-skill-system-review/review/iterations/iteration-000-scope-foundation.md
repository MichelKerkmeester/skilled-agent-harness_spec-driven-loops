# Iteration 000 — Scope Foundation (in-process scoping, pre-seat)

Three parallel in-process scoping agents mapped the review surface of 152 / 153 / 155. Their **confirmed** findings are strong leads (each opened the cited code), but per review discipline they remain HYPOTHESES until a claude2-opus / gpt-5.5 review seat independently verifies. Their **refutations** are load-bearing: do not burn seats re-flagging them.

## Consolidated risk picture (seat assignment basis)

### 147-deep-loop-workflows (9-phase merge; 736 renames; marked Complete/100%)
- **R1 [confirmed] pre-commit agent-mirror gate is INERT** — `.opencode/hooks/pre-commit:40` points at the DELETED `skills/deep-improvement/scripts/check-agent-mirror-sync.cjs`. Local mirror gate dead; only CI catches drift. (inert-guard class)
- **R2 [confirmed] sk-code dead-paths** — `sk-code/references/smart_routing.md:300` (+ benchmark READMEs) reference deleted `skills/deep-improvement/scripts/...`; 2 are runnable `node` commands that now fail.
- **R3 [confirmed] B1 /doctor council-graph coverage UNIMPLEMENTED** — phase-009's headline blocker (council-graph.sqlite probe before deletion) was never added, yet the 5-dir deletion happened. Deletion preceded its own gate.
- **R4 [confirmed] completion-metadata unreconciled** — all 9 children `spec.md: Planned (scaffold)`, 004-009 have NO implementation-summary, parent claims Complete/100%; the destructive deletion has zero recorded gate evidence.
- **R5 [confirmed] ~28 stale `/deep:start-*-loop` tokens in user docs** (`commands/README.txt`, `commands/speckit/README.txt`, install_guides, spec-kit refs) — some point at deleted files.
- **R6 [needs EXECUTION] mode-packet `../` depth resolution** — 73 `.cjs` at 4 distinct `../` depths to `deep-loop-runtime`; `node --check` proves syntax, NOT runtime resolution (the off-by-one class that already bit skill-benchmark). Seat must `require.resolve`-walk / execute entrypoints.
- **R7 [needs EXECUTION] per-mode byte-parity never replayed** — THE acceptance bar ("byte-identical single-executor artifacts per mode"); no phase actually replayed it. Re-hash the moved tree vs the 001 manifest.
- **R10 [confirmed] phase-007 governance divergence** — spec said ONE consolidated catalog/playbook root; reality is 5 per-mode trees.
- **REFUTED — do NOT re-flag:** R8 (skill-graph.json stale = cosmetic; live sqlite correct), R9 (explicit.ts virtual `deep-model-benchmark` is by-design; drift-guard 5/5 passes). The phase-006 "22 old IDs = drift" alarm is FALSE (legacyAliases by design).
- Tests (read-only this session): deep-loop-runtime 351 pass; 73 `.cjs` node --check OK; drift-guard 5/5.

### 148-mcp-skill-install-doctor-standardization (Status: Review/85% — stale; validate.sh --strict now PASSES)
- Reframe: 153 did NOT build the /doctor manifest (026/131 did); it standardized 5 mcp-* skills onto a shared install/doctor surface.
- Top risks: blesses pre-existing **mutating** installers (chrome/click-up `install.sh`: shell-profile append, global npm, pipx) under a uniform "verify-only-ish" surface; route manifest mutation-class labels have **zero CI enforcement** (drift-silent); verify-step spawns the bundled CLI (`--version`/`--help` side-effect risk); 3 doctor scripts machine-authored by gpt-5.5-fast (one factual bug already caught) → re-verify CLI facts; 4× hardcoded `../../../../.utcp_config.json` depth.

### 117-parent-nested-skill-pattern (Complete/100%; had a 10-iter review)
- **A.0 [decisive] the first review never saw phase 004** — it scoped phases 1-3 (4 commits); phase 004's ~3,966 insertions + the `/create` rename landed after the "PASS" verdict. 004 is unreviewed.
- **A1 [confirmed] surviving reach-in** — `deep-improvement/scripts/shared/reduce-state.cjs:123` hardcodes `system-spec-kit/scripts/node_modules/tsx`; seam-guard grep was scoped to deep-loop-runtime only (coverage hole) + stale "three levels up" comment vs up-4 code.
- **A2 cold-clone CI inertness** — routing-drift.yml runs `npx vitest` with no `npm ci`; if setupFiles/imports need an uninstalled dep, the keystone gate is inert.
- A3 loop-lock correctness + adoption; A4 C-plus only enforced for the canonical skill (4c WARN + hardcoded drift-guard); A5 stale post-rename docs (`003` impl-summary cites the now-deleted `parent-skill.md`); A6 research→impl fidelity; A7 MCP-free doc-coupling.
- **Part B (sk-doc dissection) — map complete:** split `skill_creation.md` (1138L) → `references/skill_creation/` subfolder: `overview.md` (§1+§2+§9), `creation_workflow.md` (§3), `validation_and_packaging.md` (§4+§8), `common_pitfalls.md` (§5), `examples_and_maintenance.md` (§6+§7), `parent_skills_nested_packets.md` (§10 whole); `skill_creation.md` → thin hub. Full inbound-reference repoint inventory captured (anchor deep-links, templates, command chain, package_skill.py section-number comments, playbook fixtures, + pre-existing-broken `references/specific/` refs to fix in the same pass).

## Wave plan (claude2-opus primary, gpt-5.5-fast-xhigh fallback; ≤3/wave)
- **Wave 1 (running, opus):** W1-A 155-A1 (reach-in repo-wide), W1-B 155-A2 (cold-CI), W1-C 153 (mutating installers + Gate-3).
- **152 (~20 seats):** R1-R5 verify+sever; R6 EXECUTE (per-depth-class); R7 EXECUTE (byte-parity); R10; confirm-R9-by-design; deeper merged-tree dives.
- **153 (~14 seats):** mutation-class routes, verify-step side-effects, enforcement-drift, small-model-authored doctor facts, utcp depth, idempotence.
- **155 (~9 seats):** A3-A7 + sk-doc dissection confirmation.
- **Round 2 (~12 seats):** adversarial REFUTE pass on every surviving P0/P1.
- Convergence: stop when fresh seats stop adding net-new P0/P1; if dry before 50, report; if P0s persist at 50, flag more warranted.

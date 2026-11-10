---
title: "Iteration 7: sync/mirror invocation post-007, optimizer agent-definitions, graph migration leftover"
trigger_phrases: []
---
# Iteration 7: Sync/mirror invocation post-007, optimizer agent-definitions, graph migration leftover

## Focus

Q7: the codex/ pi/ runtime-mirrors invocation story in the current tree — every file gets an exec-caller verdict (the doctor route (6 checks), the new CI (5), the cli-pi skill docs). Plus: round one's "optimizer/ 7 files + 3 agent-definition callers" recomputed on this tree; and graph/ per-file callers (backfill vs migrate-generated-json).

## Actions Taken

1. Inventory: codex/ (README, generate-command-routers.cjs, sync-agents.cjs, sync-prompts.cjs), pi/ (README, sync-agents-pi.cjs, sync-prompts-pi.cjs), runtime-mirrors/ (README, command-scope.cjs, sync-runtime-mirrors.cjs). Exec-caller census for each over .opencode + .github (excluding specs/dist/node_modules).
2. Doctor route read (commands/doctor/_routes.yaml:167-186): runtime-mirrors target = SIX invocations — sync-runtime-mirrors.cjs --check, codex/sync-agents.cjs --check, codex/sync-prompts.cjs --check, agent-roster-mirror-check.cjs, command-catalog-mirror-check.cjs, bin/install-codex-hooks.mjs --check — NO pi/ entry. CI (spec-kit-check.yml, verified iteration 2): the first FIVE (no install-codex-hooks --check).
3. pi/ sync scripts: caller census → only cli-external-orchestration/cli-pi skill docs (manual-testing-playbook ×4, references ×2) and pi/README itself; zero executable callers.
4. optimizer/: exec-caller census for optimizer/{promote,replay-runner,replay-corpus,search,rubric}.cjs + optimizer-manifest.json — over .opencode/.github: zero exec hits (only deep-loop's own unrelated "optimizer"-concept mentions in playbooks/configs and one benchmark JSON). Agents/modes recensus (the round-one "3 agent-definition callers"): .opencode/agents + .opencode/modes contain ZERO mentions of "optimizer". The five cli vitest suites (tests/optimizer-{replay-corpus,search,replay-runner,rubric,promote}.vitest.ts) are the only consumers.
5. graph/ per-file: backfill-graph-metadata.ts — production callers confirmed: spec/repair-derived.cjs:40,319 (`run('node', ['--import', TSX_LOADER, BACKFILL, folder])`), doctor/assets/doctor-update.yaml:280 (`dist/graph/backfill-graph-metadata.js --active-only`), doctor/scripts/doctor-runtime-bootstrap.sh:59 (GRAPH_BACKFILL_DIST). migrate-generated-json.ts — importers: ONLY tests/migrate-generated-json.vitest.ts:14; core/spec-root-registry.ts:105 is a string row (ledger text, not an import); README + graph/README + a fixture mention only.
6. The dist-path scare (`.js` with no basename) from the first grep read was verified and RETRACTED — sed of the actual YAML lines shows the full path `dist/graph/backfill-graph-metadata.js`; the earlier output was a truncated grep display, not a broken reference.

## Findings

1. **P1 — the pi/ mirror generators have zero executable callers**: `pi/sync-agents-pi.cjs` and `pi/sync-prompts-pi.cjs` (plus their README) declare "keep the Pi CLI runtime mirrors in sync with .opencode canonical sources; each generator supports --check". Observed callers: none found — not in commands/doctor/_routes.yaml runtime-mirrors (six invocations listed, no pi/), not in spec-kit-check.yml (five checks, no pi/), not in any workflow, hook or plugin; the only references are cli-pi skill documentation. Round one's "codex/, pi/ (9 productive files + their doctor _routes wiring)" does not reproduce — the pi/ half is unwired. Consequence: .pi/agents and .pi/prompts drift is CI-invisible and doctor-invisible. Severity P1 (dead sync scripts by exec; the surface they guard is the exact drift class round one's mirror finding cared about). Recommendation: **fix or remove** — wire the two `--check` calls into the doctor runtime-mirrors route and spec-kit-check.yml, or remove pi/ (and let the cli-pi docs name the removed path).

2. **P1 — optimizer/ is production-dead and test-only**: the 7 files (promote.cjs, replay-corpus.cjs, replay-runner.cjs, rubric.cjs, search.cjs, optimizer-manifest.json, README) have zero exec callers in the current tree — no command, no agent definition (agents/modes: zero "optimizer" mentions — round one's "3 agent-definition callers" is not in this tree), no hook, no workflow. The five cli vitest suites (run by the CI project now) are the only consumers — the same shape as 007's removed evals research harnesses, except the tests stayed. Declared purpose (optimizer/README): reusable replay/search/promote corpus harnesses for skill quality optimization. Observed callers: none found (production). Severity P1 (dead production directory; tests preserve it). Recommendation: **remove** (with the five suites), or relocate under a documented simulation-corpus home if the deep-loop agent-improvement lane intends to use it — this audit sees no live consumer.

3. **P1 — graph/migrate-generated-json.ts is a dead one-time migration**: 0 production importers (only tests/migrate-generated-json.vitest.ts:14); core/spec-root-registry.ts:105 names it as a ledger string; README + graph/README rows. The class is exactly 007's removal row 7 (migrate-deep-research-paths.ts: "referenced only from changelogs that record their one-time use"). Declared purpose: migrate generated graph metadata JSON. Observed callers: none found (production). Severity P1. Recommendation: **remove** (with the vitest suite), or keep as a documented one-time tool with a README note if the migration manifest M-3.3.0.0-002 still names it — the manifest reference (doctor-update.yaml:271) suggests the migration is complete.

4. **P2 — codex/generate-command-routers.cjs has no exec caller (round one's residual resolved)**: round one recorded "referenced by the commands-level checker (filename-verified), its execution: caller-not-verified". Verified now: commands/scripts/validate-command-references.cjs exists but does NOT reference generate-command-routers (grep 0); the references are sk-doc's sk-create-command SKILL.md/command-contract.json (documents the command surface), codex/README, and a fixture. Severity P2 (sync-family script, doc-referenced, no exec caller). Recommendation: **remove** or document as manual.

## Questions Answered

- (Q7 momentum) Invocation story post-007: runtime-mirrors + codex syncs run via doctor (6 checks) and CI (5 of the 6); pi/ syncs run nowhere; generate-command-routers runs nowhere; backfill-graph-metadata runs (repair-derived + doctor update); migrate-generated-json runs nowhere.

## Questions Remaining

- Q8 kept-decisions batch: sweep-track-roots documentation row, save-path phase-parent copy comment, two placeholder/comment-hygiene headers (verified), js-yaml recount (verified), four-sweeps non-abstraction, six measurement dirs, codex/pi/mirror docs (iteration 8 + 9). Duplicated helpers across cli/ ../lib/ shared/ (iteration 9). Final full-census certification (iteration 10).

## What Worked / What Failed

- Worked: re-verifying the round-one "productive files" count by CONTROLLED exec-caller grep (which found the pi/ gap) rather than file counts + docs.
- Worked: sed-verifying a suspicious path before filing (the `.js` scare) — retracted; the full line is intact.
- Failed: none; no approach exhausted.

## Ruled Out

- A broken dist path in doctor-update.yaml:280 / doctor-runtime-bootstrap.sh:59 — full lines verified intact (the truncated grep display misled).
- backfill-graph-metadata.ts as dead — production callers confirmed (repair-derived.cjs:319, doctor-update.yaml:280, bootstrap:59).
- install-codex-hooks --check as a CI gap — doctor runs 6 checks, CI runs 5 (007's summary says "five", accurate for CI; the sixth is doctor-only by design of the invoked surface).

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/{codex,pi,runtime-mirrors}/ (ls + pi/README.md)] [SOURCE: .opencode/commands/doctor/_routes.yaml:167-186] [SOURCE: .github/workflows/spec-kit-check.yml (mirrors job)] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/ (6 doc files)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/optimizer/ (exec-caller census + README)] [SOURCE: .opencode/agents + .opencode/modes (zero optimizer mentions)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/tests/optimizer-*.vitest.ts (5 files)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:40,319,465] [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml:271,280 + scripts/doctor-runtime-bootstrap.sh:59] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts + tests/migrate-generated-json.vitest.ts:14 + core/spec-root-registry.ts:105] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs + .opencode/commands/scripts/validate-command-references.cjs (grep 0)]

## Next Iteration

Iteration 8: the 007/008 kept-decisions batch — sweep-track-roots documentation row exists and names the invocation; save-path phase-parent copy comment; the four-sweeps non-abstraction row still honest; the retrieval acceptance trio (retrofit moved to ops/, sweep + latency harness documented) — verify ops/retrofit-convention.mjs and retrieval/{sweep-memory-residue,measure-cold-lookup}.mjs states; the six measurement directories' current status; and the retrieval/ + spec-folder/ README accuracy.

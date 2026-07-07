# r2-27 gaps (adversarial / completeness critic)

Angle summary: hunt the surfaces, failure modes and dependencies the 28-phase program never names. Focus slices: test docs, the skill-graph, the command runtime.

## Findings

### F1 [P1] The 23-suite verification contract has no CI home
- **Type:** SPEC-PREMISE (with LIVE-CODE evidence)
- **Evidence:** The program declares 23 distinct `*.vitest.ts` suites as its test contract across the phase docs (`grep -rhoE '[a-z0-9-]+\.vitest\.ts' | sort -u` = 23), one named per phase in `benchmark-and-test-status.md:21-52`. The 8 shipped CI workflows are all `on: pull_request` (`.github/workflows/*.yml`) and only `routing-registry-drift.yml:38-41` runs vitest, against 3 fixed suites (`routing-registry-drift-guard`, `routing-parity-deep-skills`, `routing-parity-deep-council`). The only new workflow any 005 phase adds is `.github/workflows/dq-corpus-sweep.yml`, the B1 report-only sweep (`research/research.md:97`, sole `.github/workflows/` ref in any spec/plan/tasks). No phase wires the 23 new suites into CI. The phase docs give only local `Reproduce` commands (`npx vitest run ...`, e.g. `009/plan.md:148`, `003/plan.md:151`). Net effect: every phase's `Test` cell is a contract that nothing in CI will ever execute, so the program's stated verification mechanism is unenforced. A CI-wiring phase or task is the missing dependency.

### F2 [P1] Skill-graph drift gate (A10 REQ-005) names no validate-time transport and has no provable test
- **Type:** SPEC-PREMISE + LIVE-CODE
- **Evidence:** `advisor_rebuild` and `advisor_validate` are MCP tools dispatched through the advisor server (`.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:59-63`) with a daemon CLI front door (`.opencode/bin/skill-advisor.cjs`). The A10 gates run at write/validate time, but `validate.sh` has zero advisor or skill-graph references (`grep -niE 'advisor|skill[-_]graph' validate.sh` = empty). `010/plan.md:89,106,133` says only "wire advisor_rebuild to advisor_validate ... call tools as-is" and never names how a bash or vitest gate reaches an MCP/daemon tool. The single named test is `per-surface-gates.vitest.ts` (`010/plan.md:171`), yet a vitest cannot exercise the advisor-DB drift gate without a live advisor daemon and graph, and no advisor-drift fixture is named. Despite that, `benchmark-and-test-status.md:30` blanket-claims "catch-rate 1.0 across all five gates". The error path degrades to skipped-with-reason (`010/spec.md:177`), so the gate is a silent no-op whenever the daemon is cold, which is the default at CI and write time. The one of five A10 gates that touches a separate runtime is the one with no transport, no fixture and an over-broad catch-rate claim.

### F3 [P2] No concurrent-writer failure mode considered between B1/B2 apply and the live A1 save
- **Type:** SPEC-PREMISE (failure mode not considered)
- **Evidence:** `research/research.md` has zero concurrency, race, lock or lost-update mentions (`grep -inE 'concurren|race|lock|lost update'` = empty), and 011, 012 and 026 carry no concurrency design (grep returns only `blockers:` false hits). The engine leans on atomic writes plus content_hash idempotency (`research/research.md:91,102`). Both guard against torn files and re-applying an identical fix, neither serializes two independent writers. A B1 operator-local `--apply` or B2 doctor `--confirm` apply can run while an agent's memory-save A1 path writes the same `description.json` or spec doc, and the later atomic write clobbers the earlier one (a lost update, not a torn file). The blast radius is a silently dropped safe-fix, recoverable via git, so P2 not P1, but the engine spec should state the single-writer assumption or a lock, and currently states neither.

### F4 [P2] Content-quality scoring never reaches the non-spec-doc surfaces the parent goal claims
- **Type:** SPEC-PREMISE
- **Evidence:** The parent goal is data quality "across the whole spec corpus" so "every packet retrieves better, steers AI better and reads as logic better" (`spec.md:88,79`). The keystone A1 content scorer surface is tagged "spec-doc, JSON" only (`research/research.md:18`). The skill-doc, command and context-eng surfaces get A10 structural conformance gates only, never a content-quality score (`research/research.md:27`, `010/spec.md:74-80`). That leaves the 28 command docs (`find .opencode/commands -name '*.md'` = 28), the ~20 SKILL.md and the ~30 workflow YAMLs with no content-quality measurement at all, which is the literal subject of the program. The split may be a deliberate scope cut, but no phase or the research states it as one, so the "whole spec corpus" framing overpromises against what is actually scoped.

## Slice cleanliness note
The command-runtime grounding I could check is sound: `route-validate.py` is genuinely doctor-scoped (`route-validate.py:6,8`, validates `_routes.yaml` only) and the "28 command docs" and "27 of 28 ungated" counts hold. The gaps above are about surfaces and modes left out, not about wrong counts.

---
Slice: r2-27-gaps | Findings: P0=0 P1=2 P2=2 | Most important: F1, the program's 23-suite verification contract is wired into no CI workflow, so every phase's declared test gate is unenforced.

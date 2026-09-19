# Resource Map — live-a

Evidence-derived from the deltas and iteration records of this lineage (session `fanout-live-a-1789402289626-dt269k`, 1 iteration). No packet-level `resource-map.md` existed at INIT (`resource_map_present: false`), so nothing here counts as pre-known inventory.

| Resource | Kind | Why it is in this map | Seen at |
|----------|------|-----------------------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | source under study | The topic's entire subject; read in full and parsed | iteration 1 |
| `.opencode/skills/system-deep-loop/runtime/lib/authority-root/resolve-authority-root.ts` | runtime source | Read to establish where the append gateway would write, which decided the direct-write deviation | iteration 1 |
| `.opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | runtime script | The contract-mandated state-record writer; inspected, deliberately not run | iteration 1 |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | runtime script | Owns the artifact and stop-policy validation this lineage must satisfy | iteration 1 |
| `.opencode/skills/system-deep-loop/deep-research/SKILL.md` | skill contract | Loop contract: iteration record fields, one focus per iteration, citation rule | iteration 1 |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-outputs.md` | reference | Required shape of strategy, iteration, synthesis, dashboard, resource map | iteration 1 |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-format.md` | reference | Packet layout, ownership model, file protection | iteration 1 |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md` | reference | Config and iteration record schemas | iteration 1 |
| `.opencode/skills/system-deep-loop/deep-research/assets/deep-research-config.json` | template | Field set copied for this lineage's config | init |
| `specs/system-deep-loop/045-fanout-write-containment-hardening/007-worktree-removal/` | spec packet | The packet this lineage belongs to (not read beyond its directory listing) | init |
| `REPO RULES.md` and `repo-rules/*.md` | repo-local rules | Present in this artifact dir only as captured baseline bytes from the harness's pre-dispatch snapshot | init (capture) |

## Coverage assessment

- **Source diversity:** one primary source (the module under study) carries every §1–§3 finding; the remaining entries are contract and reference documents that shaped the packet rather than evidence for the answer. For an inventory topic that is proportionate — the answer is a property of one file — but it means the findings are single-source by construction, and no second independent description of this module's API was consulted.
- **Uncovered:** the module's callers (who consumes `enforceWriteContainment`), the harness configuration that set `captureContentDir` for this fan-out, and any test file that exercises the private helpers.

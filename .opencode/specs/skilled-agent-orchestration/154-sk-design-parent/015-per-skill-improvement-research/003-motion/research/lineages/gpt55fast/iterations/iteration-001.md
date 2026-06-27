# Iteration 001: Inventory, routing, and benchmark baseline

## Focus

Inventory the actual motion packet, parent hub routing, and local benchmark evidence before proposing improvements.

## Findings

1. The requested target path is an alias, not the literal local packet path. The concrete packet is `.opencode/skills/sk-design/design-motion`, and its SKILL heading names it "Design Motion (motion)" [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:13-16]. The parent registry maps `workflowMode: motion` to `packet: design-motion` [SOURCE: .opencode/skills/sk-design/mode-registry.json:40-49].
2. Routing is parent-owned. The hub says the advisor routes to the single `sk-design` identity, then the hub resolves `workflowMode` through `mode-registry.json` [SOURCE: .opencode/skills/sk-design/SKILL.md:39-56]. This means improvements should preserve hub identity rather than making `design-motion` separately advisor-routable.
3. The local 014 benchmark artifact present in this workspace is not a motion report. It is titled `Skill Benchmark Report - design-interface`, reports aggregate 70/100, and shows D5 connectivity 100/100 [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:1-6] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:16-21]. The user's motion 100/100 claim may be true elsewhere, but it is not confirmed by the local 014 artifact set.
4. The motion packet's current scope is crisp: motion purpose, interaction feedback, timing, easing, `motion/react`, `AnimatePresence`, morphing icons, performance, and reduced motion [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:23-30]. The do-not boundary excludes static foundations, full interface concept, findings-first audits, and pure code implementation [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:32-39].
5. A documentation freshness issue surfaced immediately. The motion changelog says the initial release included a `feature_catalog/` and per-skill `graph-metadata.json` [SOURCE: .opencode/skills/sk-design/design-motion/changelog/v1.0.0.0.md:14-17], but the nested hub contract says mode packets have no per-packet `graph-metadata.json` and only the hub carries one [SOURCE: .opencode/skills/sk-design/SKILL.md:74-77] [SOURCE: .opencode/skills/sk-design/SKILL.md:90-92].

## Dead Ends

| Approach | Reason Eliminated | Evidence |
|---|---|---|
| Treat `.opencode/skills/sk-design/motion` as a literal directory | The live registry uses `design-motion` as the packet folder | `.opencode/skills/sk-design/mode-registry.json:40-49` |
| Base conclusions on a local motion benchmark artifact | The local 014 artifact set contains only a `design-interface` report | `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:1-6` |

## Assessment

newInfoRatio: 1.00. First pass established the concrete packet path, routing topology, benchmark caveat, and a documentation freshness candidate.

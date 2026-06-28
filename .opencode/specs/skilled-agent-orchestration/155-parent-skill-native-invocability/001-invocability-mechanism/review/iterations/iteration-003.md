# Iteration 3 — DeepSeek-v4-Pro (RCAF) — security

Dispatched: 2026-06-28T07:14:12.062Z | wall: 148s | billing: paid

---

Now let me check the referenced spec 154 for the implementation claim, since the decision record and implementation summary reference it as proof.
I now have all the evidence I need. Let me verify one final claim — the deep-loop-workflows hub's SKILL.md line 57 says "tool-permission guards" are per-packet, but the `allowed-tools` frontmatter tells a different story. Let me confirm the mode split:

**Hub** `deep-loop-workflows/SKILL.md:5`: `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch]`
**deep-context** `:4`: `allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]` — no Task, no WebFetch
**deep-ai-council** `:4`: `allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]` — no Task, no WebFetch
**deep-improvement** `:4`: `allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]` — no WebFetch
**sk-design hub** `:4`: `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]`
**design-foundations** `:4`: `allowed-tools: [Read, Grep, Glob, Task]` — no Write, Edit, Bash
**design-audit** `:4`: `allowed-tools: [Read, Grep, Glob, Task]` — no Write, Edit, Bash

The hub has broader tools than multiple mode packets declare. The mechanism described in this packet's decision record propagates this pattern without evaluating it against NFR-S01. That is the security finding.

---

**Summary**: I checked every target file and cross-referenced the canonical implementation files under `.opencode/skills/`. The security dimension revealed that NFR-S01 (no tool-permission widening) is stated in `spec.md` §7 but is violated by the chosen Option E mechanism as evidenced by the real per-mode `allowed-tools` declarations in both canonical parent skills (`deep-loop-workflows`, `sk-design`). The decision record never evaluates the mechanism against this NFR, and the implementation summary's claimed mechanism completion was made absent a security review. One P0 and one P1 finding.

```json
{"findings":[{"severity":"P0","dimension":"security","title":"Invokable-hub routing (Option E) widens per-mode tool-permission contracts, violating NFR-S01","file":".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/spec.md","loc":"line 157","evidence":"NFR-S01: \"No mechanism may widen a packet's tool-permission contract as a side effect of becoming invocable.\"","impact":"The canonical implementation (deep-loop-workflows) and reference implementation (sk-design) both demonstrate that when Skill(<parent>) routes to a mode, only the hub's allowed-tools governs. Mode packets that declare narrower tool sets (e.g. deep-context/allowed-tools excludes Task/WebFetch; design-foundations/allowed-tools excludes Write/Edit/Bash) silently gain those tools through the hub. The spec's own security NFR is violated by the mechanism the decision record selected.","recommendation":"Either (a) constrain each mode's effective tool set to its own allowed-tools by having the hub read and honor the mode packet's frontmatter, or (b) amend NFR-S01 and the decision record to document that hub-level allowed-tools is the single contract, removing per-mode allowed-tools as misleading."},{"severity":"P1","dimension":"security","title":"ADR-001 never evaluates the chosen mechanism against spec NFR-S01","file":".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md","loc":"lines 67-73 (Option E decision) and lines 80-91 (alternatives)","evidence":"Decision: \"We chose: Option E — invokable-hub routing.\" The section describes mechanics and lists pros/cons (single identity, no runtime change) but never mentions tool-permission contracts. The alternatives table likewise evaluates identity and surface costs, not permission widening.","impact":"The decision record selects a mechanism without auditing its most directly-stated security NFR. This is a traceability and security-review gap: the checklist (CHK-130, CHK-030–032) has all security items unchecked or deferred, and the decision record's Five Checks never include a security axis.","recommendation":"Add a security evaluation row to ADR-001 that candidly assesses Option E against NFR-S01, documents the gap (hub allowed-tools overrides per-mode declarations), and either proposes mitigation or records an accepted risk."}],"new_findings_count":2,"dimension_clean":false}
```


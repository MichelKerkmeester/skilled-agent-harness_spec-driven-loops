# Iteration 002 — Recurring family divergences

## Focus

RQ2: distinguish family-wide divergences a canon change can close from intentional policy and command-local errors.

## Evidence and findings

### F04 — Required hints without immediate gates recur across families

`create/command` declares required `<command_invocation>` and proceeds directly to overview and routing. [SOURCE: .opencode/commands/create/command.md:1-16] `design/audit` does the same for `<target>`. [SOURCE: .opencode/commands/design/audit.md:1-15] `speckit/plan`, `doctor/mcp`, and `deep/research` repeat the shape. [SOURCE: .opencode/commands/speckit/plan.md:1-14] [SOURCE: .opencode/commands/doctor/mcp.md:1-15] [SOURCE: .opencode/commands/deep/research.md:1-18] The recurrence across independently authored families points to the template contradiction, so this is a wholesale canon fix followed by regeneration, not five isolated patches.

Candidate delta: encode input ownership in the router contract and regenerate all affected routers from one corrected template.

Acceptance criterion: the all-command report classifies every required hint as `router-gated` or `target-gated`; zero commands remain unclassified.

### F05 — Thin-router policy is not measurable, and deep routers absorb workflow logic

The skill defines a thin router with behavior delegated to assets and only two blocking sections. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:318-351] `deep/research` puts execution protocol, display contract, flags, timeout semantics, and dispatch instructions into the Router Contract before reaching Owned Assets. [SOURCE: .opencode/commands/deep/research.md:11-118] Other deep routers follow the same large pre-assets shape, so this is family-wide template drift rather than one verbose command.

Candidate delta: give the canon a measurable thinness budget: permitted router concerns, maximum non-table prose before Owned Assets, and explicit exception metadata for a justified direct-dispatch command.

Acceptance criterion: the benchmark reports router-owned executable decisions and presentation blocks separately; generated workflow routers contain only normalization, target selection, asset loading, and boundary declarations.

### F06 — Default mode differs legitimately, but the policy is hidden in prose

Create routers default to confirm. [SOURCE: .opencode/commands/create/command.md:35-38] Design routers default complete invocations to auto and incomplete ones to confirm. [SOURCE: .opencode/commands/design/audit.md:54-77] `speckit/plan` asks for a mode when no suffix is present. [SOURCE: .opencode/commands/speckit/plan.md:33-38] These differences encode risk and completeness policy; forcing one global default would be incorrect. The defect is that the policy is not machine-readable or cross-checked against YAML.

Candidate delta: add `mode-resolution` to the command contract with `explicit-suffix`, `complete-default`, `incomplete-default`, and `prompt-allowed` fields.

Acceptance criterion: every routed command has a deterministic mode matrix, and command prose, workflow inputs, fixtures, and mirrors agree on every row.

### F07 — Repeated boilerplate produces repeatable prose drift

Create routers repeatedly call `.txt` presentation assets “presentation Markdown.” [SOURCE: .opencode/commands/create/command.md:25-30] The same copied phrase appears across the create family, demonstrating that manual duplication amplifies a small template defect.

Candidate delta: render shared router prose from typed asset metadata (`kind`, `path`, `owns`) and prohibit authored file-type labels when the extension is authoritative.

Acceptance criterion: changing an asset extension updates all rendered ownership prose; a mismatch between prose kind and target extension fails validation.

## Ruled out

- One universal mode default. Family risk and invocation completeness require different policies.
- A line-count-only thinness check. Tables and evidence lists can be long without owning workflow behavior.
- Manual mass edits as the primary fix. They leave the duplication mechanism intact.

## Iteration assessment

New-info ratio: 0.76. Recurring gate, thinness, and prose failures are canon-amplified; default-mode variation is intentional policy that needs explicit representation rather than normalization.

VERDICT: FIX

- [P2] `.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/command-wiring.md:20` | 1, 4 | The file's overview finding is unapplied: §1 still opens directly on the planning-only rule, so it remains the only changed reference with no Purpose or When to Use. | Insert after `## 1. OVERVIEW`:

  ```markdown
  ### Purpose

  Durable packet artifacts for a returned council report, written by the caller that holds write access.

  ### When to Use

  - A top-level caller dispatches `@deep-ai-council` and needs durable artifacts.
  - `@orchestrate` runs the council as a LEAF.
  - A command YAML or an external CLI playbook owns the persistence step.
  ```

- [P2] `.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md:57` | 6, 10 | The document-level `Cross-references:` block still sits inside §4 and is followed by §5, so the related-resources section is not last; every other changed reference ends with a headed CROSS-REFERENCES section. | Delete lines 57-59 in place, then append after the final §5 paragraph:

  ```markdown
  ---

  ## 6. CROSS-REFERENCES

  - Agent body: `.skilled/agents/ai-council.md` §16
  - Decision context: local doctor command ADRs ADR-001 and ADR-003
  ```

- [P3] `.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/depth-dispatch.md:18` | 1 | The Deep Mode move also deleted the `---` that separated the H1 intro from `## 1. OVERVIEW`; HEAD and every other reference keep that divider, so the intro now runs straight into the first H2. | Replace:

  ```markdown
  Depth controls whether a council may launch seats in parallel or must deliberate inline. The goal is useful diversity without illegal nesting.

  ## 1. OVERVIEW
  ```

  with:

  ```markdown
  Depth controls whether a council may launch seats in parallel or must deliberate inline. The goal is useful diversity without illegal nesting.

  ---

  ## 1. OVERVIEW
  ```

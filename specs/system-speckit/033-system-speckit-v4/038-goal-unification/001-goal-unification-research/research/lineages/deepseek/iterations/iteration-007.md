# Iteration 7: A7 — Authority ladder for parent mutation and child-to-parent amendment

## Focus

Decide what may mutate the parent goal unprompted, what needs operator ratification, and how a child
change propagates to the parent. Angle A7 (charter `../../deep-research-strategy.md`:57); its output feeds
D7 (isolation/authority reconciliation) in the synthesis.

## Actions Taken

1. Read the template's amendment/operator-copy rules.
2. Read the resync-rule packet (029) that introduced the operator-copy rule.
3. Checked the whitelisted goal tools per speckit command.
4. Checked whether any tool auto-maintains `goal.md` today.

## Findings

### F1. Today's authority ladder is a rule about agent behavior, not tooling

Packet 029 introduced the rule and says so explicitly: the rule is "agent behavior, not tooling"
(`[SOURCE: specs/system-speckit/033-system-speckit-v4/029-goal-operator-resync-rule/spec.md:72]`), and its
risk row accepts that existing `goal.md` files predate the paragraph because "the playbook binds the agent
regardless; packets get it at their next goal edit"
(`[SOURCE: .../029-goal-operator-resync-rule/spec.md:116]`). The template states the amendment rule where
the agent will read it: changing a frozen decision "is an amendment"
(`[SOURCE: .opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl:48]`), and the operator copy
section carries the resend rule plus the child→parent path
(`[SOURCE: .../goal.md.tmpl:54]`, `[SOURCE: .../goal.md.tmpl:58]`, `[SOURCE: .../goal.md.tmpl:60]`).

### F2. The file is scaffolded by one actor and stamped as such

`goal.md` is a lazy add-on created only with `--with-goal`
(`[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh:153]`,
`[SOURCE: .../create.sh:283]`, requested at `[SOURCE: .../create.sh:462]`), and the template's continuity
block ships `last_updated_by: "scaffold"` (`[SOURCE: .../goal.md.tmpl:16]`). Template staleness checks
already include `goal.md` in the compared doc set
(`[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:177]`).

### F3. No automated writer maintains `goal.md` today

The continuity library's canonical doc is `implementation-summary.md`
(`[SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:205]`), and the
freshness validator's attestation comment states only that document is stamped with a real fingerprint
(`[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:56]`). `goal.md`
is absent from `OPTIONAL_CONTINUITY_DOCS` (so its block is mandatory,
`[SOURCE: .../spec-doc-structure.ts:207]`) and present in `LAZY_DOCS_WITH_STATIC_ANCHORS` (so its anchors
are required, `[SOURCE: .../spec-doc-structure.ts:229]`) — but nothing regenerates its content. Its
frontmatter is therefore *validated* and *never maintained*.

### F4. A per-command authority precedent already exists in the whitelists

`allowed-tools` in the speckit commands distinguish read from write: plan, implement, and complete list
`opencode_goal, opencode_goal_status`
(`[SOURCE: .opencode/commands/speckit/plan.md:4]`, `[SOURCE: .opencode/commands/speckit/implement.md:4]`,
`[SOURCE: .opencode/commands/speckit/complete.md:4]`) while resume lists **only**
`opencode_goal_status` (`[SOURCE: .opencode/commands/speckit/resume.md:4]`). Resume is already a
read-only goal surface. Any auto-update design should extend this existing ladder rather than invent a
parallel one.

### F5. A naming collision to keep out of the design

The continuity library already has a `goal` **facet** — one of four recovery facets derived from
`nextSafeAction` (`[SOURCE: .opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:46]`,
derivation at `[SOURCE: .../thin-continuity-record.ts:211]`). It is unrelated to the packet `goal.md` and
must not be renamed or reused as the packet-goal channel; a design that says "the goal facet" will be
ambiguous in exactly the code that does continuity writes.

### F6. The durability rule already implies a write-scope split

The template separates DURABLE (above the log: directive, decisions, binding, criteria) from VOLATILE
(the log) (`[SOURCE: .../goal.md.tmpl:38]`), and the cut order forbids dropping a criterion while allowing
prose cuts (`[SOURCE: .../goal-set-string-playbook.md:63]`). That is sufficient to define *what* auto-update
may touch without operator ratification: nothing in the durable slice.

## Authority options (feeds D7)

| Option | Who may write | Cost today | What fails | Enforcement site |
|--------|---------------|-----------|------------|------------------|
| **O7-A** | Auto: log appends + `_memory.continuity` bookkeeping only. Durable slice changes are command-mediated and operator-ratified; the agent may *draft* them in chat | No new mechanism; extends the 029 behavior rule with a machine-checkable write scope | Needs a durable-slice writer that refuses unratified edits — the first place this design writes to a spec file | shared write function used by commands; hook/renderer paths stay read-only |
| **O7-B** | Agent rewrites durable sections whenever it judges fit | Nothing to build | Makes the operator's copy meaningless, and every rewrite triggers a resend (D4) → spam; also violates "the operator holds this directive as the session objective" | n/a |
| **O7-C** | Operator-only durable writes in chat | Safest | Contradicts the stated requirement that the parent goal is auto-updated and resent; stalls on unattended runs | n/a |
| **O7-D** | Command-gated: only speckit commands may mutate; hooks may never write | Follows the existing whitelist ladder (F4) | A plain conversation turn that amends a decision has no command to run — the agent must be able to *record* at least the log | `allowed-tools` whitelists + the shared writer from O7-A |

**Child→parent propagation.** The rule is already specified: a child change that alters a parent decision
or criterion is applied to the parent first and the parent is resent; a change inside the phase needs no
resend (`[SOURCE: .../goal-set-string-playbook.md:77]`, `[SOURCE: .../goal.md.tmpl:60]`). Mechanically the
honest options are: (i) at phase completion, the command diffs the child's durable slice against the
parent's binding row and criteria and asks the operator to ratify any material difference; (ii) the agent
does it by reading the binding table. Option (i) is checkable; option (ii) is today's behavior. A hook
cannot do either: "alters a parent decision" is a semantic judgment, not a diff result — consistent with
ADR-001's "never guess" (`[SOURCE: specs/hooks/009-goal-isolation/decision-record.md:41]`).

## Assessment

- `newInfoRatio`: 0.6 — the per-command whitelist asymmetry, the "validated but never maintained"
  frontmatter state, and the continuity `goal` facet collision are new; the amendment rule itself was in
  Known Context.
- Confidence: high on F1-F5. F6 → the write-scope proposal is a design claim; its enforcement site is
  named but not implemented anywhere today (marked as such).
- One sentence: auto-update may touch the log and continuity bookkeeping, the durable slice needs
  ratification, and per-command whitelists already provide the ladder to enforce it.

## Reflection

- What worked: reading 029 for *intent* — it states outright that the rule is behavior, not tooling, which
  is the precise gap a unified design must close.
- What failed: a search for an automated `goal.md` writer found none; the continuity library's `goal` facet
  initially looked like one and proved to be a naming collision (F5) — recorded so the synthesis does not
  repeat the mistake.
- Ruled out: fully automatic durable rewrites (O7-B) and operator-only writes (O7-C).

## Sources Consulted

- `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` (16, 38, 48, 54, 58, 60)
- `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` (63, 77)
- `.opencode/commands/speckit/{plan,implement,complete,resume}.md` (allowed-tools)
- `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh` (153, 283, 462)
- `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` (205, 207, 229)
- `.opencode/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts` (46, 211)
- `specs/system-speckit/033-system-speckit-v4/029-goal-operator-resync-rule/spec.md` (72, 116)
- `specs/hooks/009-goal-isolation/decision-record.md` (41)

## Recommended Next Focus

Iteration 8 (A8 / KQ8 / D6): real cap arithmetic across plugin, core, and chat; cut order; enforcement site.

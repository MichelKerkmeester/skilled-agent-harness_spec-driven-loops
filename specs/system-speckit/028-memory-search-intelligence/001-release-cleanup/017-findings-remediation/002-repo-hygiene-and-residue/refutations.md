# Phase 002 refutations — caught at re-verification

Two of six approved findings were refuted before execution. Both were deletions, and both would
have destroyed intentional benchmark evidence.

## RF-002-1 — `devin-01:F9` sk-doc dated benchmark subfolders are a documented durable archive

**Claim**: 5 dated benchmark output folders committed to the repository (CAT-3 residue).

**Why it is wrong**: `.opencode/skills/sk-doc/benchmark/README.md:61` defines the contract —
"Compiled-routing parity runs archive under `benchmark/compiled-routing/<run-label>/` — a durable,
fail-closed sibling of the run-labels above. A run never overwrites another, the active serving
manifest gates every archive, and the frozen `baseline` label is never repurposed; new parity
evidence uses additive `router-compiled-parity-baseline` / `router-compiled-parity-final` siblings."

Retention is the documented design. The folders are additive archive siblings, not residue.

**Verify**: `sed -n '61p' .opencode/skills/sk-doc/benchmark/README.md`

## RF-002-2 — `devin-01:F15` sk-git benchmark run folders are Lane C evidence

**Claim**: committed benchmark reports unreferenced by any docs (CAT-3 residue).

**Why it is wrong**: `2026-07-10--live--glm-5-2-high/` and `2026-07-10--live--kimi-2-7/` follow the
same `<date>--<mode>--<model>` run-label convention the sk-doc README documents as an additive,
never-overwritten archive. They are the retained results of a completed Lane C skill-benchmark run.
"Unreferenced by docs" is accurate and is a documentation gap; it is not grounds for deletion.

**Correct remediation**: author a `benchmark/README.md` for sk-git documenting the run-label
convention and these two runs. Routed to phase 006 (documentation drift), not executed here.

**Verify**: `ls .opencode/skills/sk-git/benchmark/` and compare naming against
`.opencode/skills/sk-doc/benchmark/README.md:61`

## Why triage missed both

Triage verified the observable fact ("dated folders exist and are committed") and treated it as
confirming the claim ("they are residue"). The claim's real content is a judgement about intent,
which requires reading the owning README. This is the same error that produced R-004 during triage
itself, where sk-code's "superseded" runs turned out to be a documented retention state.

**Rule for later phases**: before deleting anything under a `benchmark/`, `changelog/` or
`archive/` directory, read that directory's own README first. Absence of an inbound reference is
not evidence of disposability.

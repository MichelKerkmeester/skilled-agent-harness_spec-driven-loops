---
title: "create-manual-testing-playbook"
description: "Author a manual-testing-playbook package with deterministic scenarios and captured evidence, for skills and systems that need reproducible operator-facing release validation."
trigger_phrases:
  - "manual testing playbook"
  - "/create:manual-testing-playbook"
  - "deterministic scenario"
  - "release readiness"
version: 1.0.0.0
---

# create-manual-testing-playbook

> Turn a release checklist into a package of deterministic scenarios that a different operator can rerun and reach the same verdict.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Authoring `manual-testing-playbook/` packages: deterministic operator scenarios, evidence, pass/fail criteria |
| **Invoke with** | `/create:manual-testing-playbook`, "manual testing playbook", "testing playbook", "release readiness" |
| **Works on** | Skills and systems that need operator-facing manual validation ahead of a release |
| **Produces** | One root `manual-testing-playbook.md` index plus one per-feature scenario file per feature ID |

---

## 2. OVERVIEW

### Why This Skill Exists

A skill ships, and the only proof it works is a checklist row someone wrote at the last minute that nobody can rerun. Automated tests cover internals, not what an operator sees when they type a real prompt at a real CLI. When a release decision depends on structured evidence and a bullet list is the only artifact, two operators run "the same" test and reach two different verdicts, because the prompt, the command and the pass bar were never pinned down. Writing fifteen near-identical scenario write-ups by hand also just doesn't happen, so testing scope quietly shrinks to whatever fits in a paragraph.

### What It Does

`create-manual-testing-playbook` authors a `manual-testing-playbook/` package: one root `manual-testing-playbook.md` that holds shared policy, review protocol and orchestration guidance, plus one file per feature scenario with the exact prompt, the exact command sequence, expected signals, evidence to capture and a binary pass or fail bar. Every scenario is deterministic enough that a different operator, or a different agent, reproduces the same result. The canonical entry point is `/create:manual-testing-playbook`. If the ask is a capability inventory instead of executable scenarios, that is `create-feature-catalog`. If the ask is to audit or score a playbook that already exists, that is `create-quality-control`.

---

## 3. QUICK START

**Step 1: Invoke it.** `/create:manual-testing-playbook`, or read `SKILL.md` directly for the full contract.

**Step 2: Scaffold the root file.**

```bash
mkdir -p manual-testing-playbook
cp .opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md \
   manual-testing-playbook/manual-testing-playbook.md
```

You get a root playbook file with the scaffold sections ready for category folders and a feature index.

**Step 3: Verify before you rely on it.**

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py \
  manual-testing-playbook/manual-testing-playbook.md --type reference
```

Expected: zero blocking issues once frontmatter, required sections and the feature index are filled in.

---

## 4. HOW IT WORKS

Confirm the target skill or system, its feature set, and whether a feature catalog already exists, then decide categories and stable feature IDs using a `{PREFIX}-{NNN}` pattern before writing anything else. Create the root file from `assets/manual-testing-playbook-template.md`, then create one per-feature file per ID from `assets/manual-testing-playbook-snippet-template.md`. Write root package policy (review protocol, evidence rules, orchestration guidance) before scenario-specific exceptions, and fill each scenario contract with the nine required fields: Feature ID, Feature Name, Scenario Objective, Exact Prompt, Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria and Failure Triage. Link root category summaries to every per-feature file and to a matching feature-catalog entry when one exists, and explicitly note when it doesn't. Isolate destructive scenarios behind clear preconditions and a recovery path. Validate the root document with the shared validator, then manually spot-check per-feature frontmatter, section order, feature ID counts and prompt synchronization before delivery.

### Key Concept: Prompt Synchronization

A scenario's prompt lives in three places: the `SCENARIO CONTRACT`'s `Exact Prompt` field, the `Exact Prompt` column in the root's execution table, and any root category summary that previews it. All three must read identically, word for word. For example, if a scenario's contract sets `Exact Prompt: "Use memory_context in auto mode for the flaky index scan retry issue, capture the returned bounded context and return a concise pass/fail verdict"`, that exact sentence has to appear unchanged in the root playbook's execution-table row for the same feature ID. Tighten the wording in one place and forget the other, and the playbook now describes two different tests under one ID, so an operator reproducing the scenario from the root table alone gets a different result than the one who read the per-feature file.

### Verdict Discipline

Every scenario resolves to one of three states: `PASS`, `FAIL`, or `SKIP` with a specific sandbox blocker named. There is no `UNAUTOMATABLE` state. A scenario that can't run in the current sandbox still gets a `SKIP` and a reason, so the gap is visible in the playbook instead of quietly vanishing from coverage.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when five or more distinct features need manual validation, when a release decision depends on structured evidence rather than a memory of "it worked last time," or when multiple operators or agents need to run the same scenarios and get comparable results. Skip it when test steps fit cleanly in a spec-folder `checklist.md` row, the feature is one-off or experimental or automated tests already cover the only meaningful acceptance criteria.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-feature-catalog` | Owns capability inventory, not executable scenarios. Link playbook scenarios to a catalog entry when one exists |
| `create-quality-control` | Owns auditing, scoring or optimizing a playbook that already exists, without extending its scenario set |
| `system-spec-kit` | Owns spec-folder `checklist.md` rows for validation that does not need a full deterministic package |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Validator flags a missing required section | The root playbook skipped part of the required contract, like evidence requirements | Compare against `assets/manual-testing-playbook-template.md` and restore the missing section |
| Feature ID count in the root index doesn't match the per-feature files on disk | An ID was added or removed in one place but not the other | Reconcile feature ID counts between the root index and the category folders before delivery |
| Two operators get different verdicts on "the same" scenario | The prompt drifted between the scenario contract and the execution table | Resync the `Exact Prompt` field so the wording is identical everywhere it appears |
| A destructive scenario has no recovery path | Scenario design skipped safe-recovery isolation | Escalate instead of shipping it. Every destructive scenario needs isolated preconditions and a documented recovery path |
| A scenario is marked `UNAUTOMATABLE` | The three-state verdict rule was skipped | Rewrite it as a `SKIP` with the specific sandbox blocker named. `UNAUTOMATABLE` is not a valid verdict |

---

## 7. FAQ

**Q: Why not just add rows to a spec-folder `checklist.md`?**

A: Checklist rows work for small, Level 1 or 2 changes. A playbook exists for when the validation surface is big enough, or release-critical enough, that reproducibility and captured evidence matter more than a quick pass/fail line.

**Q: Why doesn't this packet's validator also check per-feature files automatically?**

A: The shared validator is root-document focused. It does not recurse into category folders. Cross-file markdown links are covered separately by the `check-markdown-links.cjs` CI guard, but per-feature structure, like frontmatter and prompt synchronization, still needs a manual spot-check.

**Q: Can I skip a feature-catalog cross-reference?**

A: Yes, when no stable catalog exists. Document that exception explicitly in the per-feature file rather than leaving the link silently absent.

**Q: What if a scenario needs live production access or privileged credentials?**

A: Escalate rather than design around it. This packet expects sandboxed, reproducible execution, and a scenario that only works with external credentials or privileged tool execution needs an explicit decision before it ships.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| Root playbook structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <path>/manual-testing-playbook.md --type reference` reports zero blocking issues |
| Feature ID reconciliation | Manually diff the root index feature IDs against the per-feature filenames in each category folder. The counts must match |
| Cross-file links | The `check-markdown-links.cjs` CI guard covers cross-file markdown links repo-wide. Per-feature structure still needs a manual review pass |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Authoritative packet contract, activation rules and the full authoring workflow |
| [`references/README.md`](./references/README.md) | Reference map routing to overflow detail |
| [`references/prompt-voice.md`](./references/prompt-voice.md) | Natural-human vs RCAF voice decision table |
| [`references/common-pitfalls.md`](./references/common-pitfalls.md) | Recurring package defects and correct fixes |
| [`references/examples.md`](./references/examples.md) | Shipped reference playbooks and scaffold templates |
| [`assets/manual-testing-playbook-template.md`](./assets/manual-testing-playbook-template.md) | Root playbook scaffold |
| [`assets/manual-testing-playbook-snippet-template.md`](./assets/manual-testing-playbook-snippet-template.md) | Per-feature file scaffold |

---
title: Review Core Doctrine
description: Shared findings-first review doctrine for both single-pass and deep-review workflows.
trigger_phrases:
  - "findings first severity ordering"
  - "review finding schema"
  - "severity contract for merge decisions"
  - "evidence file line citation"
  - "baseline surface precedence"
  - "baseline check families"
importance_tier: important
contextType: implementation
version: 1.5.7.0
---

# Review Core Doctrine

Shared doctrine consumed by both `@review` and `@deep-review`.

**Ownership.** This file owns the severity ids and their meanings (section 2), the evidence rules (section 3) and the finding schema (section 7). The deep-review contract, [`review-mode-contract.yaml`](../../../system-deep-loop/deep-review/assets/review-mode-contract.yaml), is an external consumer: it owns the deep-review loop (dimensions, verdicts, severity weights, convergence and quality gates) and reuses the severity ids defined here. When the two disagree on a severity id or its meaning, this file wins and the YAML is corrected by its owner, `deep-review`. The YAML may be stricter for its own loop, as when it requires `file:line` evidence on `P2`, but never looser.

---

## 1. OVERVIEW

Shared findings-first review doctrine for both single-pass and deep-review workflows.

Every rule in sections 2 to 7 is review floor, the part no repository or surface can change. Section 8 names the floor ids, the default lens that a repository may drop or replace, and how the review reads and reports those overrides.

---

## 2. SEVERITY DEFINITIONS

| Level | Meaning | Handling |
| --- | --- | --- |
| P0 | Blocker: exploitable security issue, auth bypass, destructive data loss | Block merge |
| P1 | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
| P2 | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional or schedule follow-up |

### Reach Calibration

A `P0` or `P1` finding names its reach: an input or call path that the code's stated contract allows, or a real caller that sends the failing input. The stated contract is what the code promises through its signature, types, doc comment, name and the checks it already makes.

- A failure that needs input outside the stated contract, such as `NaN` where the contract says a number, a wrong type, or an inverted range the code already rejects, is `P2` hardening.
- The exception is input the code claims to validate. When a guard, a thrown error or a doc line promises to reject an input class and the promise fails for an input in that class, the gap is a correctness finding and keeps `P1` or higher. A guard claims only the class it checks: an ordering check such as `min > max` does not claim that its operands are numbers.
- At a trust boundary (user input, network, files, environment, another service), every value the outside can send is in reach. The stated contract of internal code never narrows a security finding on data that crosses that boundary.
- A finding that cannot name its reach is `P2`, however severe the failure would be.

Escalation rule: if confidence is low but impact is high, classify toward the higher severity and state the uncertainty explicitly. The confidence is confidence that the reach exists. The rule raises a finding whose reach is named but not proven, such as a caller that probably sends the input. It never raises a finding with no reach, so it cannot lift an out-of-contract failure above `P2`.

### Numeric Severity Calibration

Numeric scores are advisory context, not the gate. A reviewer may add an optional `riskScore` to a finding and adjust it by `+/-2` for local context such as exploitability, blast radius, user impact, confidence, or proven containment. The merge/block decision remains the severity contract above: `P0` blocks, `P1` requires remediation, and `P2` is advisory. Do not adopt `score>=4` or any numeric threshold as a blocker.

---

## 3. EVIDENCE REQUIREMENTS

- Every `P0` and `P1` finding must include a concrete `file:line` citation.
- Evidence must tie the finding to observed code behavior, not just a general concern.
- `P2` findings should still include specific evidence when available, even if impact is advisory.
- If evidence is incomplete, state the assumption and why the risk still matters.

---

## 4. FINDINGS OUTPUT ORDERING

- Present findings before summary or praise sections.
- Order findings by severity first: `P0`, then `P1`, then `P2`.
- Keep ordering stable within a severity bucket by impact and confidence.
- Separate required fixes from optional suggestions so merge decisions stay clear.

---

## 5. BASELINE + SURFACE PRECEDENCE

Apply this skill as the baseline first, then pair it with `sk-code` surface evidence when available:

- Detected code surfaces -> the surfaces the quality runner's resolver places each reviewed file in, specific surfaces first and the `SKILLED` fallback last. Each one pairs with its `sk-code` evidence packet, such as `sk-code-skilled` for `SKILLED`. No match -> `UNKNOWN`. The resolver applies the shared detection contract, [`stack-detection.md`](../../shared/references/stack-detection.md) section 2, so the review keeps no detection of its own. Section 8 describes what it returns.
- Unclear surfaces -> baseline-only plus explicit uncertainty

Precedence rules:

- Baseline security and correctness minimums are always enforced.
- Surface style, process, build, and test conventions override generic baseline guidance.
- A repository or surface changes one default-lens rule only through a `## Rule overrides` row, by the precedence in section 8.
- Unclear conflicts must be escalated rather than guessed.

---

## 6. BASELINE CHECK FAMILIES

Mandatory baseline families:

- Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling.
- Security minimums: auth and authorization gaps, injection exposure, unsafe secrets handling, privilege misuse, and reliability risks with security impact.

These minimums cannot be relaxed by surface guidance.

---

## 7. FINDING SCHEMA

Each finding should provide:

| Field | Requirement |
| --- | --- |
| `id` | The finding's number in the Findings list, counted once across severity groups, such as `2` |
| `severity` | One of `P0`, `P1`, `P2` |
| `title` | Short, risk-oriented summary |
| `case` | The input or situation that produces the wrong result. A finding with no case is not reported |
| `file` | Primary `path:line` location |
| `evidence` | Plain-language explanation tied to observed code; for a performance finding, name the workload it assumes, such as row count, request rate or payload size |
| `userImpact` | What users or callers bear if this fix is deferred |
| `findingClass` | One of `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` |
| `scopeProof` | Grep/test/audit evidence that the recommendation covers same-class sites and consumers, or proves the finding is instance-only |
| `affectedSurfaceHints` | Optional string array of producer/consumer surfaces the fix should address; recommended for actionable findings, required for cross-consumer findings. Use free-form short strings, max about 5 entries. Optional for instance-only findings. |
| `riskScore` | Optional advisory number for relative risk calibration; never gating and never a substitute for `severity` |
| `recommendation` | Specific, scope-proportional fix or follow-up |

Suggested shape:

```markdown
### 2 [P1] Missing authorization check
- Case: a request with no session token reaches the write handler and changes a user record
- File: path/to/file.ts:42
- Evidence: Request handling reaches the write path before role validation.
- User impact: Until this is fixed, any caller can write records without a role check.
- Finding class: cross-consumer
- Scope proof: `rg -n "permission guard|write path" path/to` shows the write handler is the only unchecked consumer.
- Affected surface hints: ["request handler", "write path", "permission guard"]
- riskScore: 6 (advisory only)
- Recommendation: Enforce the existing permission guard before mutation.
```

---

## 8. FLOOR, DEFAULT LENS AND RULE OVERRIDES

Review applies two kinds of rule. The floor applies in every repository, and no source changes it. The default lens is this mode's own view of maintainable code. It applies as written until a repository or a surface drops or replaces one of its rules through the shared [rule overrides contract](../../shared/references/universal/rule-overrides.md), which this section adopts for review.

### The Floor

Sections 2 to 7 of this file are floor. The checklist sections the table names are floor too, and each one cites its id beside its heading.

| Id | What it fixes | Where |
| --- | --- | --- |
| `review.severity` | The ids `P0`, `P1` and `P2` and what each one means | Section 2 |
| `review.reach` | A `P0` or `P1` finding names an input or caller in reach | Section 2, Reach Calibration |
| `review.security-minimums` | Auth and authorization gaps, injection exposure, unsafe secrets handling, privilege misuse and reliability risks with security impact | Sections 5 and 6. Security checklist sections 2 to 6 |
| `review.correctness-minimums` | Regression risk, contract safety, spec mismatch, destructive side effects and boundary handling | Sections 5 and 6. Code quality checklist sections 2, 4 and 5. Security checklist sections 5 and 6. Test quality checklist sections 2 and 4, and the items that make a test unable to fail |

A checklist item that enforces a rule of the universal standards, [`code-quality-standards.md`](../../shared/references/universal/code-quality-standards.md), carries that rule's `floor.*` id, never a `review.*` id. A `FIXED` id, such as `floor.silent-failures`, is floor here as it is in quality. An overridable one, such as `floor.error-messages`, applies as the standards ship it until a row changes it, for review exactly as for quality.

An item in a lens section that is also an auth or authorization gap, injection exposure, unsafe secrets handling or privilege misuse is reported under `review.security-minimums`, so no row that drops the lens rule drops that finding.

The fix completeness checklist and the removal plan are process guides for turning a finding into a fix. They carry no review rule, so no row reaches them.

### The Default Lens

Each lens rule is a default that a repository may change. Its checklist item is worded as the default and names its id.

| Id | Default rule | Checklist and section | Default severity |
| --- | --- | --- | --- |
| `review.performance` | No N+1 queries, unbatched per-item calls, uncached hot-loop work, blocking work on a request path or unbounded growth | Code quality, section 3 | P2. P1 when a named workload in reach fails |
| `review.maintainability` | No repeated logic that behaves differently, hidden coupling through shared mutable state, or side effects the name does not imply | Code quality, section 6 | P2 |
| `review.magic-literals` | A domain value is a named constant, not a bare literal | Code quality, section 6 | P2 |
| `review.function-length` | A function stays at 20 lines or fewer unless its structure justifies more | Code quality, section 6 | P2 |
| `review.nesting-depth` | Control flow nests fewer than 4 levels deep | Code quality, section 6 | P2 |
| `review.law-of-demeter` | A call chain crosses at most two object boundaries | Code quality, section 6 | P2 |
| `review.todo-tracking` | A TODO, FIXME or HACK on a production path says what is left and follows the repository's tracking convention | Code quality, section 6 | P2 |
| `review.hardcoded-config` | Environment-specific values, such as URLs, ports and timeouts, are externalized | Code quality, section 6 | P2 |
| `review.prefer-native` | No hand-rolled code or dependency where the language, runtime or platform already provides the behavior | Code quality, section 6 | P2 |
| `review.kiss` | No abstraction, option or code path without a current requirement | Code quality, section 7 | P2. P1 when it adds attack surface, contract obligations or regression risk |
| `review.dry` | No duplicated rules, copy-paste branches or repeated validation that should share one source | Code quality, section 7 | P2. P1 when the duplication carries behavior risk |
| `review.rule-of-three` | Consolidate on the third instance of a shared concept, not the second | Code quality, section 7 | P2 |
| `review.ceiling-marker` | A concrete `ceiling:` comment marks an intentional simplification and downgrades a KISS or YAGNI finding on it | Code quality, section 7 | Lowers a P2 only |
| `review.solid` | The SOLID prompts and architecture smells | SOLID checklist, sections 2 to 4 | P2 |
| `review.test-structure` | A test name states the scenario, and setup does not hide the behavior under test | Test quality, section 3 | P2 |
| `review.test-aaa-layout` | A test separates Arrange, Act and Assert | Test quality, section 3 | P2 |
| `review.test-magic-values` | A magic value in test data carries a comment that says why it matters | Test quality, section 3 | P2 |
| `review.test-single-concern` | A test function holds one concern rather than several unrelated assertions | Test quality, section 3 | P2. P1 when an early failure masks a later one |
| `review.test-smells` | Tests are not coupled to implementation detail, branched or copy-pasted | Test quality, section 5 | P2 |
| `review.test-pyramid` | Each test sits at the level that fits what it checks | Test quality, section 6 | P2. P1 when the wrong level leaves a confidence gap |
| `review.rate-limiting` | Code that serves HTTP limits authentication and expensive endpoints | Security, section 7 | P2. P1 when the abuse path is in reach |
| `review.security-headers` | Code that serves HTTP sets CSP, the standard security headers, a narrow CORS policy and `SameSite` on sensitive cookies | Security, section 8 | P2 |
| `review.supply-chain` | Dependencies are pinned, audited and from maintained sources, and the lock file is committed | Security, section 9 | P2. P1 for a known vulnerability in reach |
| `review.audit-logging` | Security-sensitive actions leave an audit trail with enough context | Security, section 10 | P2 |
| `review.data-privacy` | Personal data is collected, stored and moved only as far as its purpose needs | Security, section 11 | P2 |

Every severity above still follows the reach rule in section 2, and a `replace:` row keeps the severity of the rule it replaces.

### Where the Rules for a File Come From

The review reads the rules for each reviewed file from one resolver, the quality runner's explain entry ([`runner-contract.md`](../../sk-code-quality/references/runner-contract.md) section 3). [`SKILL.md`](../SKILL.md) section 3 holds the command. For each file the output names its surfaces, the folder each surface loads from, every checklist that applies with the seat that declared it, and each checklist's `## Rule overrides` section already read through the contract's linter. Its `config.hygiene.disabled` lists the comment-hygiene rules the repository switched off.

A surface the hub's router bundles from request words alone is a candidate. It applies only to the files the resolver places in it: the file's `surfaces` holds its label, or a checklist it declares applies to the file. With no file to review there is nothing to resolve, and [`SKILL.md`](../SKILL.md) section 3 says which evidence stays.

### Precedence

The level of a checklist comes from its seat in the resolver's output. A checklist that several seats list takes the highest of them.

| Seat in the resolver's `sources` | Level |
| --- | --- |
| None. The floor above | 1. The hard floor, which no source changes |
| `repo-config` | 2. The repository checklist |
| `hub-surface` outside the SKILLED packet, or `outside-skill` | 3. A specific surface |
| `hub-surface` inside the SKILLED packet, `sk-code-skilled` | 4. The SKILLED fallback |
| `default`, or no row at all | 5. The default lens, the rule as this mode ships it |

For each rule and each file, the highest level that speaks to it wins. Two checklists at the same level that disagree on one rule for one file are a conflict: the review applies the default, lists the rule under `Conflicts` and names the conflict in its Next Steps for the repository to settle. Two rows that give the same action and the same text agree.

### Outcomes

| The resolver shows | The review | `Rule sources` group |
| --- | --- | --- |
| A checklist with `overrides.refused` true, such as a row that names a floor id | Applies none of that checklist's rows | `Refused: <checklist file>` |
| A valid row, the highest source for its rule | `none` drops the rule for the files the checklist covers. `replace: <text>` applies the text in its place | `Overrides: <rule id> <none\|replace> from <checklist file>` |
| A row whose id names no rule review applies: not a lens id above, not a `floor.*` id of the universal standards and not a `hygiene.*` id of the comment-hygiene checker | Ignores the row | `Ignored: <rule id> from <checklist file>` |
| Two checklists at the same level that disagree | Applies the default | `Conflicts: <rule id> <checklist file> <checklist file>` |
| A hygiene rule in `config.hygiene.disabled` | Treats it as a `none` row from the repository config | `Overrides: hygiene.<name> none from <config path>` |

### Hygiene Ids and the TODO Rule

Quality's comment-hygiene checker flags artifact labels in comments, each under a `hygiene.*` id ([`runner-contract.md`](../../sk-code-quality/references/runner-contract.md) section 5). Six of them are tracker ids: `hygiene.issue`, `hygiene.task`, `hygiene.adr`, `hygiene.req`, `hygiene.rc` and `hygiene.chk`. Review maps its own judgments onto the same ids, so a rule a repository switches off in quality never comes back as a review finding.

- When the repository switches a hygiene rule off, through `commentHygiene.disableRules` or a `none` row for its id, the review raises no finding for a label of that kind in a comment, at any severity. That covers `floor.ephemeral-pointers`, the judgment half of the same rules.
- While a tracker-id rule is on, the review never asks a TODO to carry an id of that kind, because quality would block the comment that carries it. `review.todo-tracking` then asks only that the TODO says what is left and why.
- A repository that wants a tracker reference on every TODO says so with a `replace:` row on `review.todo-tracking`, and switches off the hygiene rule for that id kind. A replacement that asks for an id a hygiene rule still flags is a conflict between two rules: the review applies the default and lists `review.todo-tracking` under `Conflicts`.

### The Rule Sources Line

Every full review states the rules it applied in one `Rule sources:` line in its summary, directly under `Quality gate evidence`. It is the contract's format, section 7:

```text
Rule sources: <checklist file>, <checklist file>. Overrides: <rule id> <none|replace> from <checklist file>. Refused: <checklist file>. Ignored: <rule id> from <checklist file>. Conflicts: <rule id> <checklist file> <checklist file>
```

- List each checklist by its `file` value in the resolver's output, in the order the files first reach it, and separate entries within one group with `; `.
- Write `none` for an empty group, and `Rule sources: none` when no file was resolved.
- A path segment that starts with `local-` prints as `<LABEL>`, the label its private surface declares, or `<PRIVATE>`, the redaction the quality envelope applies, because a report may be pasted into a tracked file.
- The line is plain text and never starts with `Review status:`, `Not checked:` or `Overall assessment`, so the two report checkers read the rest of the report as before. When the line is present, `scripts/check-review-final-line.js` fails a second `Rule sources:` line, a missing or reordered group and an entry whose shape does not match the format above. A report without the line still passes. The M-1 and M-2 skip outputs carry no `Rule sources:` line.

---

## 9. THE RESOLVER ALGORITHM

The review reads the rules for a reviewed file from one resolver, the quality runner's explain entry, and this section is the algorithm that turns its output into the floor, the lens and the `Rule sources:` line. It is pseudocode: `ResolverError` is the caller's own error type, reported on the `Not checked:` line, and `load()` is the resource loader the router supplies.

```python
# The quality runner's explain entry is the one resolver for which surfaces, skill
# folders, checklists and rule overrides apply to a file. Review runs it and keeps no
# surface markers of its own. HUB_ROOT is the sk-code folder this mode was loaded from.
HUB_ROOT = SKILL_ROOT.parent
QUALITY_RUNNER = HUB_ROOT / "sk-code-quality" / "scripts" / "quality-gate.cjs"
SKILLED_PACKET = "sk-code-skilled"
# bundled_surfaces holds the router's surface bundle, each with its label and packet.
# known_rule_ids() reads the lens table of review-core.md section 8, the Id column of
# the universal standards and the hygiene checker's rule names. redact_private()
# prints a local-* path segment as its surface label, the envelope's redaction.

def resolvable_files(files: list[str], cwd: str) -> tuple[list[str], list[str]]:
    """Split the reviewed paths into existing regular files and the rest.

    A path the change deleted has nothing to resolve, and one missing path makes
    --explain stop the whole call with FILE_NOT_FOUND, exit 3. So deleted paths never
    reach it: the review lists them on its Not checked line where they matter.
    """
    present = [f for f in files if (Path(cwd) / f).is_file()]
    return present, [f for f in files if f not in present]

def resolve_rule_sources(files: list[str], cwd: str) -> dict | None:
    """Return the code-quality-explain/v1 document for the reviewed files, or None.

    --explain runs nothing, writes nothing and always exits 2. Only existing regular
    files reach it, from resolvable_files. Exit 3 is then a usage or root fault: the
    caller catches ResolverError, reports it on the Not checked line and reviews
    those files against the baseline only.
    """
    files, _deleted = resolvable_files(files, cwd)
    if not files:
        return None
    run = subprocess.run(["node", str(QUALITY_RUNNER), "--explain", *files],
                         cwd=cwd, capture_output=True, text=True)
    if run.returncode != 2:
        raise ResolverError(run.stderr.strip() or f"--explain exited {run.returncode}")
    return json.loads(run.stdout)

def inside_hub_checkout(cwd: str) -> bool:
    """True when the working directory shares the hub's git common dir."""
    def common_dir(where):
        out = subprocess.run(["git", "-c", "core.fsmonitor=false", "-C", str(where),
                              "rev-parse", "--path-format=absolute", "--git-common-dir"],
                             capture_output=True, text=True)
        return Path(out.stdout.strip()).resolve() if out.returncode == 0 else None
    hub = common_dir(HUB_ROOT)
    return hub is not None and common_dir(cwd) == hub

def surface_evidence(explained, bundled_surfaces, cwd) -> list[str]:
    """Labels in the resolver's order. A router-bundled surface is only a candidate."""
    if explained is None:
        # No files to resolve: keep the bundle, except that SKILLED stays only inside
        # the hub's own checkout, because a word like "typescript" says nothing about
        # whose code this is.
        return [s.label for s in bundled_surfaces
                if s.packet != SKILLED_PACKET or inside_hub_checkout(cwd)] or ["UNKNOWN"]
    labels = []
    for entry in explained["files"]:
        placed = list(entry["surfaces"]) + [
            s.label for s in bundled_surfaces
            if any(c["file"].startswith(f"hub:{HUB_ROOT.name}/{s.packet}/") for c in entry["checklists"])]
        for label in placed:
            if label != "UNKNOWN" and label not in labels:
                labels.append(label)
    return labels or ["UNKNOWN"]

def checklist_level(checklist) -> int:
    """2 repository, 3 specific surface, 4 SKILLED fallback, 5 shipped default."""
    def seat(source):
        if source == "repo-config":
            return 2
        if source == "outside-skill":
            return 3
        if source == "hub-surface":
            return 4 if checklist["file"].startswith(f"hub:{HUB_ROOT.name}/{SKILLED_PACKET}/") else 3
        return 5
    return min(seat(source) for source in checklist["sources"])

def applied_overrides(explained, known_ids) -> dict:
    """The winning row per (file, rule id) and the groups of the Rule sources line.

    known_ids holds the lens ids of review-core.md section 8, the floor.* ids of
    the universal standards and the checker's hygiene.* ids. The linter already
    refused every hard-floor row, so a refused checklist contributes nothing.
    """
    groups = {"sources": [], "overrides": [], "refused": [], "ignored": [], "conflicts": []}
    winners = {}
    if explained is None:
        return {"winners": winners, "groups": groups}
    disabled = explained["config"].get("hygiene", {}).get("disabled", [])
    for entry in explained["files"]:
        candidates = {}
        for rule_id in disabled:
            candidates.setdefault(rule_id, []).append(
                (2, explained["config"]["path"], {"id": rule_id, "action": "none", "text": None}))
        for checklist in entry["checklists"]:
            if checklist["file"] not in groups["sources"]:
                groups["sources"].append(checklist["file"])
            overrides = checklist.get("overrides") or {}
            if overrides.get("refused"):
                groups["refused"].append(checklist["file"])
                continue
            for row in overrides.get("rows", []):
                if row["id"] not in known_ids:
                    groups["ignored"].append(f'{row["id"]} from {checklist["file"]}')
                    continue
                candidates.setdefault(row["id"], []).append((checklist_level(checklist), checklist["file"], row))
        for rule_id, rows in candidates.items():
            top = min(level for level, _, _ in rows)
            best = [(f, r) for level, f, r in rows if level == top]
            if len({(r["action"], r["text"]) for _, r in best}) > 1:
                groups["conflicts"].append(f'{rule_id} {best[0][0]} {best[1][0]}')
                continue
            winners[(entry["file"], rule_id)] = best[0][1]
            groups["overrides"].append(f'{rule_id} {best[0][1]["action"]} from {best[0][0]}')
    for name, values in groups.items():
        groups[name] = list(dict.fromkeys(values))
    return {"winners": winners, "groups": groups}

def rule_sources_line(groups) -> str:
    """The one Rule sources line of review-core.md section 8, private names redacted."""
    def join(values):
        return "; ".join(redact_private(v) for v in values) if values else "none"
    return (f'Rule sources: {", ".join(redact_private(v) for v in groups["sources"]) or "none"}. '
            f'Overrides: {join(groups["overrides"])}. Refused: {join(groups["refused"])}. '
            f'Ignored: {join(groups["ignored"])}. Conflicts: {join(groups["conflicts"])}')
```

---

## 10. RELATED RESOURCES

- [review-ux-single-pass.md](./review-ux-single-pass.md) - Interactive single-pass report flow and next-step prompts.
- [quick-reference.md](./quick-reference.md) - Lightweight index across baseline review references.
- [security-checklist.md](../assets/security-checklist.md) - Security and reliability checks.
- [code-quality-checklist.md](../assets/code-quality-checklist.md) - Correctness, KISS, DRY, and maintainability checks.
- [rule-overrides.md](../../shared/references/universal/rule-overrides.md) - The shared override format, ids, hard floor and precedence.

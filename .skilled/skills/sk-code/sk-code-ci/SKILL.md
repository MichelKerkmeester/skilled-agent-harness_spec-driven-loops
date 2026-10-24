---
name: sk-code-ci
description: "Read-only GitHub Actions workflow evidence: trigger, filter, permission, timeout, concurrency and caching rules, the protected set and the scaffold templates."
allowed-tools: [Read, Bash, Grep, Glob]
version: 0.1.0.0
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
---

<!-- Keywords: github-actions, ci-workflow, workflow-yaml, path-filters, timeout-minutes, concurrency, permissions, protected-workflow, required-status-check, composite-action, surface-evidence, sk-code -->

# CI Surface: GitHub Actions Workflow Evidence

**Domain evidence** for the repository's GitHub Actions workflows under `.github/workflows/`. The packet states each workflow rule with the file and line that prove it, names the workflows that must never be weakened, records the one trigger that looks like drift and is not, and carries two scaffold templates. It writes nothing. The workflow mode the hub pairs it with reads the evidence and applies it.

A workflow change looks small and has a wide effect. One path filter decides which workflows a commit starts, one missing twin entry fails the gate that guards the source tree, and one switched-off workflow can remove the only check a branch ruleset requires. This packet keeps those facts in one place so a reviewer or author does not rebuild them from the workflow files and review history.

## 1. WHEN THE HUB BUNDLES THIS

- The task adds, edits or reviews a file under `.github/workflows/`, `.github/actions/` or `.github/scripts/`.
- A request names a GitHub Actions workflow, a path filter, a job timeout, a concurrency group, a permissions block or a required status check.
- A request asks whether a workflow trigger is intentional or drift.
- A request asks for the shape of a new workflow or job before it is written.
- The task edits, reviews or scaffolds a workflow, so the acting mode needs the rules and the protected set rather than a guess.

Formal findings-first review stays with `sk-code-review` and author-side quality gates stay with `sk-code-quality`. This surface supplies the workflow evidence both apply.

---

## 2. REFERENCE MAP

Rule data (`references/`):
- `references/ci-workflow-standards.md`: the rule index. Path parity, SHA-pinned actions, a README row per workflow, `set -euo pipefail`, fork and secret safety, matrix and `fail-fast`. Each row says whether a machine gate enforces it.
- `references/trigger-and-filter-rules.md`: the twin rule, the rebuild-commit skip rule, push-only scope for generated-path filters and the intentional exceptions table.
- `references/job-shape-rules.md`: timeouts, least-privilege permissions, the concurrency template, the composite setup action and the switch `if:` shape.
- `references/protected-set.md`: the workflows protected by function and the rules that follow from it.

Scaffold templates (`assets/`):
- `assets/workflow-template.yml`: a whole-workflow starting point.
- `assets/job-block-template.yml`: a single job starting point.

Workflow doctrine: the implement, debug and verify phases are the shared doctrine symlinked in as `references/workflow-implement.md`, `references/workflow-debug.md` and `references/workflow-verify.md`. The acting agent applies it.

## 2b. SMART ROUTING (machine-readable)

This block is the deterministic projection of the packet's own reference routing. Keep it in sync with the parent hub union.

```python
# sk-code-ci owns its intent -> reference routing. Paths are relative to this
# skill root. The parent sk-code hub RESOURCE_MAP carries the same four paths
# under the same key, re-prefixed with sk-code-ci/. The router-sync guard
# (sk-code-skilled/assets/scripts/verify-router-sync.cjs, leg 2) checks that equality.
# Every keyword is multi-word, so a bare "workflow" never scores this surface.
DEFAULT_RESOURCE = [
    "references/ci-workflow-standards.md",
]

INTENT_SIGNALS = {
    "CI_WORKFLOW": {"weight": 4, "keywords": ["github actions workflow", "ci workflow", "github actions yaml", "workflow path filters", "github workflow timeout", "github workflow concurrency", "github workflow permissions", "required status check workflow"]},
}

RESOURCE_MAP = {
    "CI_WORKFLOW": [
        "references/ci-workflow-standards.md",
        "references/trigger-and-filter-rules.md",
        "references/job-shape-rules.md",
        "references/protected-set.md",
    ],
}
```

---

## 3. SURFACE STANDARDS (the non-negotiables)

The rules below hold for every workflow change, whoever applies it.

### ✅ ALWAYS

- **ALWAYS** cite the workflow file and line behind a rule, and re-read that line before relying on it, because the workflow files change faster than this packet.
- **ALWAYS** read `references/protected-set.md` before any change to a workflow, a ruleset context or a repository variable that gates one.
- **ALWAYS** read the intentional exceptions table in `references/trigger-and-filter-rules.md` before flagging a trigger as drift.
- **ALWAYS** keep generated-path filters push-only, because a `pull_request:` filter that ignores a path can leave a required check pending.
- **ALWAYS** name a rule with no machine enforcement as honour-system, so a reader knows nothing will catch a lapse.

### ⛔ NEVER

- **NEVER** write, edit or scaffold a workflow from this packet. The tool surface is `Read`, `Bash`, `Grep` and `Glob`, and the acting mode or a doctor command applies any change.
- **NEVER** switch off or weaken a protected workflow without a second named confirmation that restates its role.
- **NEVER** switch off `message-contract.yml` while its ruleset context is required.
- **NEVER** treat the message-contract every-branch push trigger as drift. It is a recorded exception.
- **NEVER** copy a live secret, token or repository variable value into a template or a reference.

### ⚠️ ESCALATE IF

- A request needs a workflow file edited, because that is the acting mode's work and not this packet's.
- A cited line no longer matches the quoted text, so the rule data is stale and needs a refresh before it is trusted.
- A change would touch a protected workflow, a ruleset context or a repository variable.
- Two rules disagree about the same workflow, for example a filter that satisfies one and breaks the other.

---

## 4. INTEGRATION POINTS

- Input: requests the `sk-code` hub bundles beside a workflow mode when the task is about a GitHub Actions workflow.
- Output: the rule evidence, the protected set, the exception record and the scaffold templates the paired mode applies.
- `sk-code-review` applies the rules to a workflow diff and `sk-code-quality` applies them to a workflow being authored.
- The hub registration lives in `../mode-registry.json`, `../hub-router.json` and `../ROUTER.md`.

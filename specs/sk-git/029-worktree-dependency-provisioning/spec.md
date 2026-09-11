---
title: "Feature Specification: A New Worktree Should Be Able To Build"
description: "Creating a worktree provisions its dependencies, because an unprovisioned one fails checks in ways that read as broken code."
trigger_phrases:
  - "worktree provisioning"
  - "fresh worktree dependencies"
  - "worktree node_modules"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/029-worktree-dependency-provisioning"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the specification"
    next_safe_action: "Implement the provision step"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/scripts/worktree-naming.sh"
      - ".opencode/bin/worktree-session.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-029"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: A New Worktree Should Be Able To Build

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`worktree-naming.sh create` allocates a number, runs `git worktree add`, and
returns. It installs nothing. The worktree it hands back cannot build, cannot
run its tests, and cannot pass its own commit gates, because every dependency
tree in this repository is gitignored and therefore absent from a fresh
checkout.

That would be tolerable if the failures announced themselves. They do not.
Provisioning a worktree for one change surfaced six distinct levels of missing
dependencies, and the two worst failures were silent successes:

| Missing | What it looked like |
|---|---|
| repo root | a hub conformance check reported the hub broken |
| `.opencode` | plugin tests could not import their runtime |
| `system-spec-kit` | the commit was blocked by a mirror-parity gate |
| `system-spec-kit/runtime` | **`npm run build` exited 0 having compiled nothing** |
| `system-skill-advisor/runtime` | the package build failed |
| `sk-doc` | a fixture that copies a hub lost the hub's dependencies |

`npm ci` in a package with no lockfile fails, the build script's `&&` chain
stops after its first step, and the whole thing exits 0. A caller reading the
exit code concludes the build succeeded. Separately, a check that copies a real
skill hub into a temporary directory carries that hub's `node_modules` with it
in a provisioned checkout and loses it in a fresh one, so the check fails on a
hub that is entirely correct.

The workaround people reach for makes it worse. Symlinking a package's
`node_modules` from the main checkout imports that package's workspace
self-links, which are relative and resolve back into the source checkout. The
worktree then compiles against another tree's build output. In the run that
prompted this packet, that produced a type error for a property the worktree's
own source declared correctly.

The purpose is to make a created worktree usable, and to make the remaining
failure modes loud.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- A `provision` step that installs the dependency trees a worktree needs.
- `create` running that step by default, with an opt-out.
- One list of provisioned paths, read by both the allocator and the launch
  wrapper instead of each carrying its own.
- Recording why installing is correct and symlinking is not.

**Out of scope**

- Changing what any package depends on.
- The launch wrapper's session, database and socket isolation.
- Making `npm run build` fail loudly when its first step fails. That is the
  build script's defect and belongs to the package that owns it; this packet
  records it and does not reach into it.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | `worktree-naming.sh provision <dir>` installs every path in the shared list that is missing from that worktree, and is safe to re-run. |
| REQ-002 | `create` provisions the worktree it made, unless `--no-provision` is passed. |
| REQ-003 | The provisioned path list lives in one file that both the allocator and the launch wrapper read. |
| REQ-004 | Provisioning installs into the worktree. It never symlinks a dependency tree that contains workspace self-links. |
| REQ-005 | A provision run reports each path it installed, skipped, or failed, and exits non-zero if any install failed. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A worktree created with `create` builds and runs its test suites without any
  further manual install.
- Re-running `provision` on an already-provisioned worktree changes nothing and
  exits 0.
- The path list exists in exactly one place.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS

| Risk | Mitigation |
|------|------------|
| `create` becomes slow, since installing six trees takes minutes where the old command took seconds | `--no-provision` keeps the old behaviour for callers who only want the branch |
| An install fails on a machine with no network | The step reports the failing path and exits non-zero rather than leaving a half-provisioned tree that looks fine |
| The path list drifts from what packages actually need | The list is data in one file; a missing entry shows up as the same loud failure it does today, not a silent one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCS

- `.opencode/skills/sk-git/SKILL.md` — worktree rules, including the existing
  guidance to defer toolchain work to the main checkout.
- `.opencode/bin/worktree-session.sh` — the launch wrapper that shares paths today.
<!-- /ANCHOR:related-docs -->

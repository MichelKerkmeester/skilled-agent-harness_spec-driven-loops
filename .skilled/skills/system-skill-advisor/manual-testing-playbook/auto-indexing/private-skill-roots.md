---
title: "AI-007 Private Skill Roots Variable"
description: "Manual validation that SPECKIT_PRIVATE_SKILL_ROOTS decides which top-level local-* skill links the advisor's skill discovery follows, in a throwaway skills root."
trigger_phrases:
  - "ai-007"
  - "private skill roots"
  - "SPECKIT_PRIVATE_SKILL_ROOTS"
  - "local skill link discovery"
version: 1.0.0.0
id: AI-007
category: auto_indexing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# AI-007 Private Skill Roots Variable

Prompt: Check that my private local skill shows up in the advisor only when its folder sits inside a root I named in SPECKIT_PRIVATE_SKILL_ROOTS.

---

## 1. OVERVIEW

Validate that `SPECKIT_PRIVATE_SKILL_ROOTS` decides which top-level `local-*` links the advisor's skill discovery follows. A link is followed only when its real target sits inside the skills root or inside a root the variable names. The variable takes several roots joined by the platform path delimiter, and an empty segment adds no root. The scenario runs the Python discovery against a throwaway skills root, so it touches no tracked file and needs no daemon.

### Why This Matters

A private skill lives in another repository and reaches the skills tree as a gitignored link. If the variable is ignored, the private skill never routes. If an empty segment or a look-alike folder name widens trust, a stray link pulls an outside tree into the advisor.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that discovery follows a `local-*` link only into a declared root, never into a sibling folder whose name merely starts with the declared root's name, and that an empty variable or an empty segment trusts nothing extra.
- Real user request: `Check that my private local skill shows up in the advisor only when its folder sits inside a root I named in SPECKIT_PRIVATE_SKILL_ROOTS.`
- Prompt: `Check that my private local skill shows up in the advisor only when its folder sits inside a root I named in SPECKIT_PRIVATE_SKILL_ROOTS.`
- Preconditions: Repository root as the working directory, with `python3` and a POSIX shell. No build and no daemon are needed.
- Expected execution process: Build the throwaway skills root, run discovery four times with a different variable value each time, read each printed list and remove the fixture.
- Expected signals: Unset prints `['alpha']`. One declared root prints `['alpha', 'local-beta']`. Two roots joined with an empty segment between them print `['alpha', 'local-beta', 'local-gamma']`. An empty value prints `['alpha']`. Every run exits 0.
- Desired user-visible outcome: The operator sees the private skill appear only once its root is declared, and the sibling folder stay out until it is declared too.
- Pass/fail: PASS if all four lists match and every run exits 0. FAIL if `local-gamma` appears while only `private` is declared, if `local-beta` appears with the variable unset or empty, or if any run exits non-zero.

---

## 3. TEST EXECUTION

### Prompt

```
Check that my private local skill shows up in the advisor only when its folder sits inside a root I named in SPECKIT_PRIVATE_SKILL_ROOTS.
```

### Commands

Run the commands from the repository root in one shell session, so the variables set in step 1 stay defined.

1. Build the fixture: one real skill, one private root holding `beta`, and a sibling folder `private-x` holding `gamma`, each linked into the skills root under a `local-*` name.

```bash
CHECKOUT="$(pwd)"
FIXTURE="$(mktemp -d)"
mkdir -p "$FIXTURE/skills/alpha" "$FIXTURE/private/beta" "$FIXTURE/private-x/gamma"
for d in skills/alpha private/beta private-x/gamma; do printf -- '---\nname: %s\n---\n' "${d##*/}" > "$FIXTURE/$d/SKILL.md"; done
ln -s "$FIXTURE/private/beta" "$FIXTURE/skills/local-beta"
ln -s "$FIXTURE/private-x/gamma" "$FIXTURE/skills/local-gamma"
SCRIPTS="$CHECKOUT/.skilled/skills/system-skill-advisor/runtime/scripts"
DISCOVER='import os, sys; sys.path.insert(0, sys.argv[1]); import skill_advisor_runtime as r; print(sorted(os.path.basename(os.path.dirname(p)) for p in r._discover_skill_files(sys.argv[2])))'
```

2. Run discovery with the variable unset.

```bash
env -u SPECKIT_PRIVATE_SKILL_ROOTS python3 -c "$DISCOVER" "$SCRIPTS" "$FIXTURE/skills"; echo "exit $?"
```

3. Declare the `private` root only.

```bash
SPECKIT_PRIVATE_SKILL_ROOTS="$FIXTURE/private" python3 -c "$DISCOVER" "$SCRIPTS" "$FIXTURE/skills"; echo "exit $?"
```

4. Declare both roots, joined by the path delimiter with an empty segment between them.

```bash
SPECKIT_PRIVATE_SKILL_ROOTS="$FIXTURE/private::$FIXTURE/private-x" python3 -c "$DISCOVER" "$SCRIPTS" "$FIXTURE/skills"; echo "exit $?"
```

5. Set the variable to an empty value.

```bash
SPECKIT_PRIVATE_SKILL_ROOTS="" python3 -c "$DISCOVER" "$SCRIPTS" "$FIXTURE/skills"; echo "exit $?"
```

6. Remove the fixture.

```bash
rm -rf "$FIXTURE" && test ! -e "$FIXTURE" && echo CLEANED
```

### Expected

- Step 2 prints `['alpha']`, then `exit 0`.
- Step 3 prints `['alpha', 'local-beta']`, then `exit 0`. The sibling `private-x` is not trusted by the `private` root.
- Step 4 prints `['alpha', 'local-beta', 'local-gamma']`, then `exit 0`.
- Step 5 prints `['alpha']`, then `exit 0`.
- Step 6 prints `CLEANED`.

### Evidence

- Capture the printed list and the exit line of steps 2 to 5, and the `CLEANED` line of step 6.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any printed list differs, any run exits non-zero, or step 6 does not print `CLEANED`.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| `local-beta` missing in step 3 | The list is `['alpha']` | Check that `_trusted_private_roots` reads `SPECKIT_PRIVATE_SKILL_ROOTS` and splits on `os.pathsep`. |
| `local-gamma` present in step 3 | The list holds three names | Containment compares path prefixes as strings. Inspect `_path_inside`, which must compare by relative path. |
| `local-beta` present in step 2 or 5 | The list holds two names | An unset or empty value widened trust. Inspect the empty-segment skip in `_trusted_private_roots`. |
| Import error | Traceback before any list | Confirm `SCRIPTS` points at the advisor `runtime/scripts` folder. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [AI-003](../../manual-testing-playbook/auto-indexing/provenance-and-trust-lanes.md), provenance fingerprints and trust lanes.
- Feature [`feature-catalog/auto-indexing/private-skill-containment.md`](../../feature-catalog/auto-indexing/private-skill-containment.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py` (Python discovery) and `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts` (TypeScript containment).
- Automated test: `.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Indexing
- Playbook ID: AI-007
- Canonical root source: manual-testing-playbook.md
- Feature file path: auto-indexing/private-skill-roots.md

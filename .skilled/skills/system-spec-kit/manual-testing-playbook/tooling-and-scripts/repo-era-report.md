---
title: "472 -- Repository era report"
description: "This scenario validates the repository era report for `472`. It focuses on the v4 and v3 layout readings, the frontmatter, template and generated-metadata counts and the guarantee that the report writes nothing."
version: 1.0.0.0
id: tooling-and-scripts-repo-era-report
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 472 -- Repository era report

## 1. OVERVIEW

This scenario validates `repo-era.mjs`, the read-only report that classifies a checkout as a v3 or v4 spec layout and counts how far its packets have moved. It runs on two disposable trees. The first is a v4 tree with a `specs` folder and two packets, one of which lacks frontmatter. The second is a v3 tree whose packets sit only under the legacy `.opencode` spec root.

### Why This Matters

The layout kind decides which migration applies, so a wrong reading would send an operator down the wrong upgrade path. The counts show how much of the tree is already current. This scenario proves that the report reads both layouts correctly and that it does not change the tree it reads.

---

## 2. SCENARIO CONTRACT

Operators run the era report against a v4 tree and a v3 tree, then read the layout kind and the counts.

- Objective: Prove that the era report reads a v4 tree as `kind: v4` with the expected counts, reads a v3-only tree as `kind: v3` with `source: legacy-root`, and writes no file.
- Playbook ID: 472.
- Real user request: `Tell me whether this checkout is still on the v3 spec layout and how many packets already carry the current frontmatter.`
- Prompt: `Tell me whether this checkout is still on the v3 spec layout and how many packets already carry the current frontmatter.`
- Preconditions: A checkout that holds `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs`, with Node, rsync, bash and mktemp available. The report reads the disposable trees only and needs no git repository.
- Expected execution process: Build the v4 tree and the v3 tree, run the report on each, read the signals and confirm the trees are unchanged.
- Expected signals: The v4 tree reads `kind: v4`, `packetCount: 2`, frontmatter `present: 2, missing: 1`, template markers `none: 3`, generated metadata `missing: 2`. The v3 tree reads `kind: v3`, `source: legacy-root`, `packetCount: 1`.
- Desired user-visible outcome: The operator sees the layout and the counts, and the trees are unchanged.
- Pass/fail: PASS if both layouts read as expected and the counts match. FAIL if the v3 tree reads as v4, the v4 tree reads as v3, or a count differs from the expected values.

---

## 3. TEST EXECUTION

### Prompt

```
Tell me whether this checkout is still on the v3 spec layout and how many packets already carry the current frontmatter.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the v4 tree with a leveled packet and an unleveled packet, then build the v3 tree.

```bash
CHECKOUT="$(pwd)"
ERA="$CHECKOUT/.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs"
OUT="$(mktemp -d)"
V4="$(mktemp -d)/v4repo"
mkdir -p "$V4/specs/legacy-track/001-leveled-packet" "$V4/specs/legacy-track/002-unleveled-packet"
cat > "$V4/specs/legacy-track/001-leveled-packet/spec.md" <<'SPEC'
---
title: "Leveled fixture"
description: "Lane mode fixture"
---

<!-- SPECKIT_LEVEL: 1 -->

## 1. SUMMARY

Text.
SPEC
printf '# Plan\n' > "$V4/specs/legacy-track/001-leveled-packet/plan.md"
printf -- '---\ntitle: "Unleveled"\ndescription: "No level"\n---\n\n# Unleveled\n' > "$V4/specs/legacy-track/002-unleveled-packet/spec.md"
V3="$(mktemp -d)/v3repo"
mkdir -p "$V3/.opencode/specs/legacy-track/001-old-packet"
printf -- '---\ntitle: "Old"\ndescription: "Legacy"\n---\n\n# Old\n' > "$V3/.opencode/specs/legacy-track/001-old-packet/spec.md"
find "$V4" "$V3" -type f | sort > "$OUT/before.txt"
```

2. Run the report on the v4 tree and read the signals.

```bash
node "$ERA" "$V4" > "$OUT/era-v4.json"
echo "exit=$?"
node -p 'JSON.stringify({ packetCount: require(process.argv[1]).packetCount, kind: require(process.argv[1]).signals.layout.kind, frontmatter: require(process.argv[1]).signals.frontmatter, templateMarkers: require(process.argv[1]).signals.templateMarkers, generatedMetadata: require(process.argv[1]).signals.generatedMetadata })' "$OUT/era-v4.json"
```

3. Run the report on the v3 tree and read the layout.

```bash
node "$ERA" "$V3" > "$OUT/era-v3.json"
echo "exit=$?"
node -p 'JSON.stringify({ packetCount: require(process.argv[1]).packetCount, layout: require(process.argv[1]).signals.layout })' "$OUT/era-v3.json"
```

4. Confirm that both trees are unchanged.

```bash
find "$V4" "$V3" -type f | sort | diff "$OUT/before.txt" - && echo "no file added or removed"
```

### Expected

Step 2 prints `exit=0`, then `{"packetCount":2,"kind":"v4","frontmatter":{"present":2,"missing":1},"templateMarkers":{"new":0,"legacy":0,"none":3},"generatedMetadata":{"present":0,"stub":0,"missing":2}}`. Step 3 prints `exit=0`, then a JSON object with `"packetCount":1` and a `layout` object with `"v3":true`, `"v4":false`, `"kind":"v3"` and `"provenance":{"source":"legacy-root","residueCount":0}`. Step 4 prints `no file added or removed`.

### Evidence

- The exit codes and the JSON lines from steps 2 and 3.
- The `diff` result from step 4.

### Pass / Fail

- **Pass**: The v4 tree reads `kind: v4` with the expected counts, the v3 tree reads `kind: v3` with `source: legacy-root`, and step 4 confirms no file changed.
- **Fail**: Either tree reads the wrong layout kind, a count differs from the expected values, or step 4 reports a file change.

### Failure Triage

If the v3 tree reads as v4, check that the fixture has no `specs` folder at its root, since a `specs` folder changes the reading. If `packetCount` is lower than expected, check that each packet sits under a track folder, because the report counts only `specs/<track>/<packet>`. Reset the fixture by deleting the `$V4` and `$V3` directories and building them again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [repo-era-report.md](../../feature-catalog/tooling-and-scripts/repo-era-report.md)
- Implementation: [repo-era.mjs](../../runtime/cli/spec/repo-era.mjs)

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs <root>

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 472
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/repo-era-report.md`

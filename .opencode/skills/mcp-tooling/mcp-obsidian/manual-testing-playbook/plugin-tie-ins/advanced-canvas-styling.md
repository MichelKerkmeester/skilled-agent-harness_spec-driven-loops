---
title: "OBS-024 -- advanced-canvas-styling"
description: "This scenario validates the Advanced Canvas file-layer contract by building a throwaway .canvas JSON document with styled text nodes, a styled edge, and a metadata.startNode presentation marker, then verifying headlessly that the file is valid JSON, every edge endpoint and the start node reference an existing node id, and every styleAttributes value is drawn from the confirmed Advanced JSON Canvas enumerations."
stage: routing
version: "0.1.0.0"
---

# OBS-024 -- advanced-canvas-styling

## 1. OVERVIEW

This scenario validates that the mode can operate Advanced Canvas at the file layer: a throwaway `.canvas` JSON document is built with two styled `text` nodes (a `pill` terminal and a `diamond` decision), a styled edge between them (`short-dashed` path, `a-star` pathfinding), and a top-level `metadata` block whose `startNode` names an existing node. Validity, referential integrity and the confirmed `styleAttributes` enumerations are verified headlessly with python3, jq and git. Rendering the shapes, the routed edge and the presentation deck needs a running Obsidian and a canvas reload; that is the render step, not the write.

### Why This Matters

Advanced Canvas is fully AI-operable only because every extension is an additive JSON key on a `.canvas` file — but an unlisted `shape`, `arrow` or `pathfindingMethod` value silently renders as the default rather than erroring, and an edge or `metadata.startNode` that names a node id the canvas does not carry renders nothing. If the mode can author the extended keys, keep the native `nodes`/`edges` fields intact, and prove from the file that every style value is in the confirmed enumeration and every id reference resolves, then styled canvases and presentation decks are fully delegable to the vault files.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-024
- Feature Name: Advanced Canvas file-layer node/edge styling round-trip
- Scenario Objective: Build one throwaway `.canvas` with two styled `text` nodes, a styled edge between them, and a `metadata.startNode` marker, then verify the file is valid JSON, every edge endpoint and the start node reference an existing node id, and every `styleAttributes` value is drawn from the confirmed node/edge enumerations.
- Exact Prompt: Turn my throwaway canvas into a small flowchart — a pill "Start" node, a diamond "Decision?" node, a dashed A-star edge between them, and make Start the presentation's first slide.
- Exact Command Sequence: 1. Create the throwaway vault 2. Write the `.canvas` JSON with two styled nodes, one styled edge and a `metadata` block 3. Confirm the file is valid JSON with jq 4. Validate node/edge shape, referential integrity and the `styleAttributes` enumerations with python3 5. Cross-check the extended keys with rg 6. Prove exactly one canvas changed with git
- Expected Signals: The `.canvas` parses as JSON; `nodes` and `edges` are arrays and `metadata` is an object; every node has the native `id`/`type`/`x`/`y`/`width`/`height` fields; every edge `fromNode`/`toNode` and `metadata.startNode` resolves to a node `id` present in the file; every node `styleAttributes.shape`/`textAlign`/`border` and every edge `styleAttributes.path`/`arrow`/`pathfindingMethod` is a confirmed enumeration value; git status shows exactly one canvas.
- Evidence: Canvas text, jq parse output, python validation output, rg extended-key hits, git status output.
- Pass/Fail Criteria: PASS if the file is valid JSON, every id reference resolves, and every `styleAttributes` value is in the confirmed enumeration; FAIL if the JSON is malformed, an edge or `startNode` names a missing node, a style value is outside the enumeration, or a native field was dropped; SKIP if python3 or jq are unavailable.
- Failure Triage: 1. Re-parse the file with jq to isolate a JSON syntax error. 2. List the node ids and compare each edge endpoint and `metadata.startNode` against them. 3. Compare each `styleAttributes` value against the confirmed enumerations in the data model. 4. Confirm the native `id`/`type`/`x`/`y`/`width`/`height` fields survive on every node. 5. Fix the JSON and re-run the checks.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Run entirely inside `/tmp/_pbtest-advanced-canvas`. Real vaults (MEGA/Documents/Obsidian, iCloud, Barter) are never read or written. The checks prove the file layer only; a PASS never claims a rendered shape, a routed edge or a running presentation.

### Prompt

Turn my throwaway canvas into a small flowchart — a pill "Start" node, a diamond "Decision?" node, a dashed A-star edge between them, and make Start the presentation's first slide.

### Commands

1. Create the throwaway vault.

   ~~~sh
   VAULT="/tmp/_pbtest-advanced-canvas"
   rm -rf "$VAULT"
   mkdir -p "$VAULT/Maps"
   ~~~

2. Write the `.canvas` with two styled nodes, one styled edge and a `metadata` block. Node ids avoid `-` (the portal composite-id delimiter); every style value is a confirmed enumeration member.

   ~~~sh
   cat > "$VAULT/Maps/Flow.canvas" <<'EOF'
   {
     "nodes": [
       {
         "id": "start", "type": "text",
         "x": 0, "y": 0, "width": 200, "height": 80,
         "text": "Start", "color": "4",
         "styleAttributes": { "shape": "pill", "textAlign": "center" }
       },
       {
         "id": "decision", "type": "text",
         "x": 0, "y": 200, "width": 200, "height": 120,
         "text": "Decision?",
         "styleAttributes": { "shape": "diamond", "border": "dashed" }
       }
     ],
     "edges": [
       {
         "id": "e1", "fromNode": "start", "toNode": "decision",
         "fromSide": "bottom", "toSide": "top",
         "styleAttributes": { "path": "short-dashed", "arrow": "circle", "pathfindingMethod": "a-star" }
       }
     ],
     "metadata": { "version": "1.0-1.0", "frontmatter": {}, "startNode": "start" }
   }
   EOF
   ~~~

3. Confirm the file is valid JSON.

   ~~~sh
   jq empty "$VAULT/Maps/Flow.canvas" && echo "canvas JSON OK"
   ~~~

4. Validate shape, referential integrity and the `styleAttributes` enumerations.

   ~~~sh
   python3 - "$VAULT/Maps/Flow.canvas" <<'EOF'
   import json, sys
   canvas = json.load(open(sys.argv[1]))
   assert isinstance(canvas.get("nodes"), list), "nodes is not an array"
   assert isinstance(canvas.get("edges"), list), "edges is not an array"
   assert isinstance(canvas.get("metadata"), dict), "metadata is not an object"

   NODE_NATIVE = ("id", "type", "x", "y", "width", "height")
   NODE_SHAPE = {"pill", "diamond", "parallelogram", "circle", "predefined-process", "document", "database"}
   NODE_ALIGN = {"center", "right"}
   NODE_BORDER = {"dashed", "dotted", "invisible"}
   EDGE_PATH = {"dotted", "short-dashed", "long-dashed"}
   EDGE_ARROW = {"triangle-outline", "thin-triangle", "halved-triangle", "diamond",
                 "diamond-outline", "circle", "circle-outline", "blunt"}
   EDGE_PATHFIND = {"direct", "square", "a-star"}

   ids = set()
   for n in canvas["nodes"]:
       for f in NODE_NATIVE:
           assert f in n, f"node missing native field {f!r}: {n.get('id')!r}"
       assert n["id"] not in ids, f"duplicate node id {n['id']!r}"
       ids.add(n["id"])
       sa = n.get("styleAttributes", {})
       if "shape" in sa:
           assert sa["shape"] in NODE_SHAPE, f"bad node shape {sa['shape']!r}"
       if "textAlign" in sa:
           assert sa["textAlign"] in NODE_ALIGN, f"bad node textAlign {sa['textAlign']!r}"
       if "border" in sa:
           assert sa["border"] in NODE_BORDER, f"bad node border {sa['border']!r}"

   for e in canvas["edges"]:
       for f in ("id", "fromNode", "toNode"):
           assert f in e, f"edge missing field {f!r}: {e.get('id')!r}"
       assert e["fromNode"] in ids, f"edge fromNode {e['fromNode']!r} names no node"
       assert e["toNode"] in ids, f"edge toNode {e['toNode']!r} names no node"
       sa = e.get("styleAttributes", {})
       if "path" in sa:
           assert sa["path"] in EDGE_PATH, f"bad edge path {sa['path']!r}"
       if "arrow" in sa:
           assert sa["arrow"] in EDGE_ARROW, f"bad edge arrow {sa['arrow']!r}"
       if "pathfindingMethod" in sa:
           assert sa["pathfindingMethod"] in EDGE_PATHFIND, f"bad pathfindingMethod {sa['pathfindingMethod']!r}"

   sn = canvas["metadata"].get("startNode")
   assert sn is None or sn in ids, f"metadata.startNode {sn!r} names no node"
   print("node ids:", sorted(ids))
   print("startNode:", sn)
   print("canvas OK: native fields present, references resolve, style values in enumeration")
   EOF
   ~~~

5. Cross-check the extended keys with rg.

   ~~~sh
   rg -n "styleAttributes|startNode|\"shape\"|\"pathfindingMethod\"|\"portal\"" "$VAULT/Maps/Flow.canvas"
   ~~~

6. Prove exactly one canvas changed and no stray files.

   ~~~sh
   cd "$VAULT"
   git init -q
   git add .
   git status --porcelain
   git diff --cached --stat
   ~~~

7. Grade honestly. A PASS proves the `.canvas` is valid Advanced JSON Canvas at the file layer — valid JSON, resolved references, style values in the confirmed enumerations, native fields intact. Rendering the pill/diamond shapes, the A-star routed edge and the presentation deck needs an in-app reload, so the PASS states that limitation rather than claiming a rendered flowchart.

### Grading

| Verdict | Criteria |
|---|---|
| PASS | File is valid JSON; `nodes`/`edges` arrays and `metadata` object present; every node keeps its native `id`/`type`/`x`/`y`/`width`/`height`; every edge endpoint and `metadata.startNode` resolves to a node id; every `styleAttributes` value is a confirmed enumeration member; git shows exactly one canvas; real vaults untouched |
| FAIL | Malformed JSON, a dropped native field, an edge or `startNode` naming a missing node, a `styleAttributes` value outside the enumeration, or a real vault file was touched |
| SKIP | python3 or jq unavailable (git is optional for the single-file proof) |

---

## 4. CLEANUP

Remove the throwaway vault. Nothing outside `/tmp/_pbtest-advanced-canvas` was created, so this one command restores the machine to its prior state.

~~~sh
rm -rf /tmp/_pbtest-advanced-canvas
~~~

---

## 5. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [../manual-testing-playbook.md](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [../../references/plugins/advanced-canvas/advanced-canvas.md](../../references/plugins/advanced-canvas/advanced-canvas.md) | Advanced Canvas plugin identity and file-layer index |
| [../../references/plugins/advanced-canvas/data-model.md](../../references/plugins/advanced-canvas/data-model.md) | Advanced JSON Canvas schema: native fields, extended node/edge keys, the confirmed `styleAttributes` enumerations, portals and the `metadata` block |
| [../../references/plugins/advanced-canvas/workflows.md](../../references/plugins/advanced-canvas/workflows.md) | Numbered file-layer recipes: styled node, styled edge, floating edge, portal, presentation and export |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [../../references/plugins/advanced-canvas/troubleshooting.md](../../references/plugins/advanced-canvas/troubleshooting.md) | Node/edge not rendering, invalid style value, broken portal, presentation not starting, version-gating and native-reader compatibility |
| [../../references/plugins/plugin-operation-logic.md](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI operation boundary |

---

## 6. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: OBS-024
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugin-tie-ins/advanced-canvas-styling.md

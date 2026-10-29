---
id: OC-012
category: surface_detection
title: 'SKILLED surface detection'
description: "This scenario validates the surface detection that bundles the packet for `OC-012`. It confirms `mode-registry.json` declares the `SKILLED` surface as the fallback with the `.skilled/` path marker, so a Skilled-surface prompt resolves to this packet before any language or intent is scored."
expected_surface: SKILLED
expected_surface_role: fallback
expected_detection_markers:
  - .skilled/
  - .opencode/
version: 1.0.1.0
---

# OC-012: SKILLED surface detection

This document captures the surface-detection contract, execution process, source anchors, and metadata for
`OC-012`.

---

## 1. OVERVIEW

This scenario validates the surface detection that bundles this packet for `OC-012`. It focuses on
confirming that the hub's `mode-registry.json` declares the `SKILLED` surface with a `fallback` role, the
`.skilled/` and `.opencode/` path markers, and the `sk-code-skilled` packet, and that the `SKILL.md` preamble states
the same two-step detection in prose.

Every other scenario in this playbook assumes detection has already resolved `SKILLED`; this one proves the
declaration those scenarios assume, so the packet's premise is graded rather than presumed.

### Why This Matters

The packet exists only because work under `.skilled/` selects it. If the `surfaceDetection` block loses its
label, its path markers or its fallback role, a Skilled-surface prompt would be bundled with no surface
evidence or with the wrong packet, and every intent scenario in this playbook would grade a route the
surface never took. The registry compiler also rejects a hub whose fallback is not ranked last, so the role
is load-bearing and not descriptive.

---

## 2. SCENARIO CONTRACT

Operators confirm the `SKILLED` surface declaration for `OC-012` matches what the `SKILL.md` preamble says, without
contradictory evidence.

- Objective: confirm the declared surface carries label `SKILLED`, role `fallback`, packet
  `sk-code-skilled`, and the `.skilled/` and `.opencode/` path markers.
- Real user request: `Which surface does a .skilled/ task resolve to, and why does the skill-code packet load with it?`
- Prompt: `Which surface does a .skilled/ task resolve to, and why does the skill-code packet load with it?`

**Exact prompt**:
```text
Which surface does a .skilled/ task resolve to, and why does the skill-code packet load with it?
```

- Expected execution process: the reader resolves `mode-registry.json`, finds the `sk-code-skilled` mode,
  reads its `surfaceDetection` block, and compares it with the two-step detection prose in the `SKILL.md` preamble.
- Expected signals: step 2 prints the two-step detection bullets, step 3 prints one line for `SKILLED` with
  `role=fallback`, `packet=sk-code-skilled` and both path markers, and step 4 prints the same block as JSON.
- Desired user-visible outcome: the answer names `SKILLED` as the surface for `.skilled/` work, cites the
  registry block rather than prose alone, and explains that the packet is bundled as surface evidence
  beside the resolved workflow mode.
- Pass/fail: PASS if the declared label, role, packet and both path markers match the frontmatter; FAIL if
  any of them differs or the mode entry is absent.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Which surface does a .skilled/ task resolve to, and why does the skill-code packet load with it?`

### Commands

1. `sed -n '/^---$/,/^---$/p' .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/routing-tier/skilled-surface-detection.md`
2. `sed -n '/^Detection has two steps:/,/^- Then use file extensions/p' .skilled/skills/sk-code/sk-code-skilled/SKILL.md`
3. `node -e "const l=require('./.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs');l.declaredSurfaces('.skilled/skills/sk-code').forEach((s)=>console.log(s.label+' role='+s.role+' packet='+s.packet+' markers='+s.markers.join(' ')));"`
4. `python3 -c "import json;d=json.load(open('.skilled/skills/sk-code/mode-registry.json'));m=[x for x in d['modes'] if x['workflowMode']=='sk-code-skilled'][0];print(json.dumps(m['surfaceDetection'],indent=2))"`

### Expected

Step 1 shows `expected_surface: SKILLED`, `expected_surface_role: fallback` and the two detection markers
in the frontmatter. Step 2 prints the two detection bullets from the `SKILL.md` preamble, the first naming `.skilled/`.
Step 3 prints one line: `SKILLED role=fallback packet=sk-code-skilled markers=.skilled/ .opencode/ skill.md
.ts .tsx .cjs .mjs .py .sh .rs graph-metadata spec-folder argparse`. Step 4 prints the same block as JSON
with `"label": "SKILLED"`, `"role": "fallback"`, and `pathMarkers` holding `.skilled/` and `.opencode/`.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the `surfaceDetection` JSON from step 4;
the detection prose excerpt from step 2.

### Pass / Fail

- **Pass**: the declared label is `SKILLED`, the role is `fallback`, the packet is `sk-code-skilled`, and
  both markers in `expected_detection_markers` appear in the block step 3 and step 4 print.
- **Fail**: the mode entry is absent, or the label, role, packet or a marker differs from the frontmatter,
  or the prose in step 2 names a different path.

### Failure Triage

1. If step 4 cannot find the mode, confirm the `workflowMode` key in `mode-registry.json` still reads
   `sk-code-skilled` and that the packet folder with the same name still exists beside it.
2. If a marker differs, compare step 3 with step 4 to see whether the registry changed or the replay library
   reads a different block.
3. If step 2 prints no bullets, confirm the `SKILL.md` preamble still opens with the detection sentence this step
   anchors on, and update the anchor if the prose was rewritten.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../../feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | Feature-catalog entry whose declared surface-detection order this scenario checks |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) preamble | The two-step detection prose this scenario compares against |
| [mode-registry.json](../../../mode-registry.json) | The `surfaceDetection` block this scenario reads |
| [router-replay-lib.cjs](../../assets/scripts/router-replay-lib.cjs) | `declaredSurfaces` reader the guard uses |
| [declared-surfaces-parity.test.cjs](../../scripts/tests/declared-surfaces-parity.test.cjs) | Proves the replay library and the plugin declare the same surfaces |

---

## 5. SOURCE METADATA

- Group: sk-code-skilled routing
- Playbook ID: OC-012
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `routing-tier/skilled-surface-detection.md`

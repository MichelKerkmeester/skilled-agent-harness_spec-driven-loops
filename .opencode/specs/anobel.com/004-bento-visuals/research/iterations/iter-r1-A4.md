Fetching the three candidate sources and extracting implementation mechanisms, then mapping them directly to the RC ledger and A4 pipeline decision.The PDF URL returned an over-size tool response, so I’m using the arXiv HTML/abstract surface for the same paper to recover the actionable method while recording the PDF fetch failure.# A4 findings

## What the sources actually say

**https://arxiv.org/pdf/2412.16829**

PDF fetch failed: tool response exceeded the 5MB limit. I continued with the same paper via `https://arxiv.org/html/2412.16829` and `https://arxiv.org/abs/2412.16829`.

Technique: split visual critique into separate generator, filter, box-generation, refinement, validation, and text-refinement stages.

Exact mechanism:
The paper’s pipeline uses six LLM roles: `TextGen`, `TextFilter`, `BoxGen`, `BoxRefine`, `Validation`, and `TextRefine`. It first generates critique text, filters invalid comments, grounds each valid comment with a bounding box, refines the box using coordinate-marked screenshots plus a zoomed-in patch, validates the text/box pair, then routes failures back to either box or text refinement.

Concrete evidence:
In the UI critique task, each critique is explicitly a text issue plus a bounding box mapped to the relevant screenshot region. The method adds coordinate markers to screenshots for grounding, uses a zoomed-in patch around the candidate bounding box, keeps refinement history, and stops when validation says the pair is correct or max iterations is reached. Few-shot visual prompting plus iterative refinement improved bounding-box IoU from `0.120` zero-shot to `0.357` for Gemini and from `0.233` to `0.345` for GPT-4o. Source: arXiv 2412.16829, sections 3-5.3.

Applicable technique:
For this project, MiniMax `issue` strings should not remain free text. They should become visually grounded repair objects: issue text plus target region/element plus defect class plus required layout/contrast/title/glyph change plus verification gate.

**https://github.com/madaan/self-refine**

Technique: use a `FEEDBACK -> REFINE -> FEEDBACK` loop where feedback is actionable and localized.

Exact mechanism:
Self-Refine defines separate task prompts for `Init`, `Feedback`, and `Iterate`. The feedback module identifies specific problem locations and gives instructions to improve them. The refine module receives the previous output plus feedback and produces the next output. The loop retains history by appending prior outputs so the model can avoid repeating mistakes. Source: GitHub README, “Framework Description”, “Components”, “Key Features”, and “General setup”.

Important correction:
The fetched Self-Refine repo primarily presents a single-LLM loop. The strongest source for separate generator/refiner to reduce self-bias is the 2412.16829 paper, which explicitly says it uses a separate LLM for bounding-box refinement to avoid self-bias and cites prior self-bias work.

Applicable technique:
A4 should keep GLM as generator and MiniMax as auditor. Do not ask GLM to critique its own output, because this run already showed GLM confabulating non-existent “orange CTA” and `#cccccc`.

**https://arxiv.org/html/2510.16062v1**

Technique: compare intrinsic correction, external correction, mixtures, correction rate, and misjudgment rate instead of assuming self-correction works.

Exact mechanism:
CorrectBench models correction as iterative prompting where the next prompt includes the previous response. It separates intrinsic correction from external correction. External correction uses outside resources/tools to address model gaps. The paper reports external correction generally gives more stable gains than intrinsic correction, but with more compute cost. It also defines `Correction Rate` as wrong examples successfully corrected and `Misjudgment Rate` as correct examples wrongly changed.

Concrete evidence:
RARR, an external correction method, achieved overall `CR=47.1` and `MR=4.5`, better than CoVe’s `CR=40.8` and `MR=7.5` in the reported correction/misjudgment table. For code generation, HumanEval baseline was `72.71`; RARR reached `77.35 (+4.64)`. The paper also warns that extra correction adds latency and that reasoning models with strong built-in correction can show marginal gains. Source: arXiv 2510.16062v1, sections 2.1, 4.3, 4.6, 4.7, 4.8.

Applicable technique:
Measure A4 with both conversion and false-fix metrics. Do not run it blindly on all tiles forever. Use it on the 18 FIX tiles, compare structured MiniMax feedback against generic “improve this”, and track whether passing dimensions regress.

## How it maps to THIS run’s defects

A4 directly targets the defects MiniMax already saw:

- RC-1 vertical overflow: accountbeheer-4 scored `35`; orders-facturen-4 scored `52`; aangepast-assortiment-3 scored `58`; `overflow:true` appears in 8 audit rows. MiniMax findings like “matrix content spills past the inner panel” should become typed fixes with `defect_type: vertical_overflow`, `required_change: reduce rows / compress row height / reserve bottom title block`.
- RC-2 2D node collisions: oci-4 scored `58` with 6 absolute-positioned elements; goedkeuringssysteem-4 scored `55`; collision and clipping are exactly the kind of visually grounded issue the 2412.16829 text+box validation loop is designed to structure.
- RC-3 title-bottom failure: low diagram tiles place the title top-left or let the diagram claim the canvas. MiniMax text should become a hard fix: `reserve_bottom_title_block_px >= 96` and `title_region: bottom-left`.
- RC-4 uppercase/glyph drift: grep-confirmed `text-transform:uppercase` counts and wrong anchor glyphs are machine-fixable once typed as `typography_contract` or `icon_contract`.
- RC-5/contrast class from the angle: MiniMax saw too-light grey PO rows, but deterministic `contrast_check.py` must be paired because MiniMax can miss subtle clips/contrast failures.
- RC-8 from the angle: MiniMax already emitted 18 file-grounded findings, so A4 does not need a new critique capability. It needs an adapter that converts known-good critique into a GLM repair contract.

## Concrete, testable recommendation

Add one pipeline step between MiniMax audit and GLM round-2:

```text
PIPELINE STEP A4: minimax_issue_to_fixlist_round2

Input:
- tile_id
- round1 rendered image
- round1 source/code
- MiniMax score
- MiniMax issue strings
- deterministic gate results: proof_check.py, contrast_check.py

Process:
1. Convert MiniMax issue strings into typed fix-list JSON.
2. Inject fix-list into GLM round-2 prompt.
3. Regenerate only the failing tile.
4. Run proof_check.py and contrast_check.py.
5. Re-score with MiniMax.
6. Adopt round-2 only if gates pass and no previously passing dimension regresses.
```

Small schema:

```json
{
  "tile_id": "accountbeheer-4",
  "round": 2,
  "source_auditor": "MiniMax-M3",
  "baseline_score": 35,
  "fixes": [
    {
      "id": "fix-001",
      "defect_type": "vertical_overflow",
      "rc_ids": ["RC-1", "RC-3"],
      "severity": "blocking",
      "target_element": "inner matrix panel rows and bottom title block",
      "evidence": "matrix content spills past the inner panel and overlaps bottom title/description",
      "required_change": "Reserve a bottom title block before laying out the diagram. Reduce matrix rows or row height so all diagram content remains inside the visual panel.",
      "layout_contract": {
        "tile_height_px": 480,
        "reserved_bottom_title_block_px": 104,
        "diagram_max_bottom_y_px": 348,
        "max_visible_rows": 3,
        "forbidden": [
          "absolute positioning outside diagram panel",
          "content overlapping title or description",
          "title above diagram"
        ]
      },
      "verification": ["proof_check.py:overflow=false", "proof_check.py:title_at_bottom=true"]
    }
  ],
  "adopt_if": {
    "proof_check_pass": true,
    "contrast_check_pass": true,
    "minimax_score_delta_min": 5,
    "false_fix_allowed": false
  }
}
```

Round-2 GLM prompt template:

```text
You are regenerating one maritime-B2B dashboard bento tile.

Do not reinterpret the product story. Apply only the typed fix-list below.

Hard layout contract:
- Canvas height is 480px.
- Reserve the bottom 104px for the title and description.
- The title and description must remain bottom-left and unobstructed.
- Diagram content must end at or above y=348px.
- Prefer linear-flow or stacked-list primitives over free 2D absolute positioning.
- If a diagram needs more than 3 rows/nodes, summarize or group it.
- Do not use uppercase eyebrow text.
- Do not substitute glyphs. Use only the specified icon/token from the original contract.
- Do not reduce text contrast. Body/detail text must pass contrast_check.py.

Typed fix-list:
{{FIX_LIST_JSON}}

Previous failing evidence:
{{MINIMAX_ISSUES}}

Previous code:
{{ROUND1_CODE}}

Return only the corrected tile code.
```

Adapter rules for MiniMax `issue` strings:

```text
If issue mentions spill, clipped, overlaps bottom title, past panel, bleed, outside rounded corners:
  defect_type = vertical_overflow
  rc_ids include RC-1
  add reserved_bottom_title_block_px and diagram_max_bottom_y_px constraints

If issue mentions overlaps, collides, crowding, popover clipped, node truncates text:
  defect_type = node_collision
  rc_ids include RC-2
  require linear-flow/stacked primitive or explicit non-overlap constraint

If issue mentions title missing, title clipped, title top, bottom card edge:
  defect_type = title_position
  rc_ids include RC-3
  require bottom-left title block reservation

If issue mentions uppercase, all-caps, wrong glyph, icon mismatch:
  defect_type = typography_or_icon_contract
  rc_ids include RC-4

If issue mentions low contrast, too light, near illegible:
  defect_type = contrast
  rc_ids include RC-5
  require contrast_check.py exit 0
```

Experiment design:

```text
Population:
- 18 FIX tiles with MiniMax file-grounded findings.

Arm A:
- Round-2 GLM with structured MiniMax fix-list.

Arm B:
- Round-2 GLM with generic instruction: "Improve this tile and fix visible issues."

Metrics:
- FIX->SHIP conversion count.
- MiniMax score delta.
- proof_check.py pass rate.
- contrast_check.py exit-0 rate.
- false-fix rate: previously passing dimension becomes failing.
- diagram-vs-linear score delta after round-2.
```

Adoption rule:

```text
Adopt round-2 if:
- proof_check.py passes,
- contrast_check.py exits 0,
- MiniMax score improves by >= 5 or crosses the existing SHIP threshold,
- no false-fix on title position, overflow, contrast, eyebrow casing, or glyph contract.

Otherwise keep round-1 and log the failed fix-list item.
```

## Predicted effect

Predicted SHIP effect:
A structured MiniMax fix-list should convert roughly `5-8` of the 18 FIX tiles, moving baseline from `27/45 = 60%` to about `32-35/45 = 71-78%`.

Why not higher:
RC-1 and RC-2 are partly GLM layout-primitive limitations. Structured critique can force simpler primitives, but it cannot make GLM reliably solve arbitrary 2D collision geometry.

Predicted contrast effect:
Contrast exit-0 should improve strongly on contrast-labeled fixes, likely `+20-35pp` within the affected FIX subset, because the required change is local and deterministic.

Predicted diagram-vs-linear delta:
The low 2D diagram band (`35-58`) should move toward the `65-78` range when the prompt forces linear-flow or stacked-list fallbacks. It probably will not reach the `86-94` linear-flow high band without a separate layout primitive change.

Cost:
For the 18 FIX tiles only: one adapter pass, one extra GLM generation, deterministic gates, and one MiniMax re-score. Expect about `1.7-2.3x` latency for affected tiles, but much less for the full 45-tile batch if only failures enter round-2. Token cost is mainly previous code plus fix-list injection; the schema itself is small.

## Open questions for the next iteration

- What exact MiniMax score threshold currently defines `SHIP`?
- Are MiniMax findings available with bounding boxes/regions, or only free-text `issue` strings?
- Does `proof_check.py` already detect bounding-box/node overlap, or only overflow/title placement?
- Should A4 force all RC-1/RC-2 fixes to abandon absolute 2D layouts, or allow one retry with constrained absolute positioning?
- What is the measured false-fix rate when GLM receives multiple fixes at once versus one fix per round?
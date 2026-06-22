# Iteration 6: maintainability — refactor quality + types

Reviewed: .opencode/skills/sk-design-md-generator/tool/scripts/types.ts, .opencode/skills/sk-design-md-generator/tool/scripts/cluster.ts, .opencode/skills/sk-design-md-generator/tool/scripts/css-analyzer.ts, .opencode/skills/sk-design-md-generator/tool/scripts/extract.ts

Findings: 5 (P0=0 P1=0 P2=5)


## F006-01 [P2] Section dividers duplicated and interleaved across file
- File: .opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:40
- Evidence: The style guide (§4 Standard Section Order) prescribes: 1 IMPORTS → 2 TYPE DEFINITIONS → 3 CONSTANTS → 4 HELPERS → 5 CORE LOGIC → 6 EXPORTS — each section number appears once. extract.ts has section 2 TYPE DEFINITIONS at lines 40 AND 193, section 4 HELPERS at lines 160 AND 563, and section 5 CORE LOGIC at lines 57, 203, AND 576. Sections are interleaved (1→2→5→4→2→5→4→5→6) instead of grouped.
- Fix: Reorganize extract.ts so each section number appears once in standard order: move all type definitions to a single section 2, all helpers (printUsage, log, urlToSlug) to section 4, and keep core logic (parseArgs, extract, CLI entry point) in section 5.


## F006-02 [P2] Section 5 (CORE LOGIC) appears before Section 4 (HELPERS)
- File: .opencode/skills/sk-design-md-generator/tool/scripts/cluster.ts:72
- Evidence: Line 72: `// 5. CORE LOGIC` containing `parseColor` function. Line 186: `// 4. HELPERS` containing `hslToRgb`, `clampByte`, etc. The style guide §4 standard order is HELPERS (4) before CORE LOGIC (5). The file places core logic `parseColor` before its helper functions it depends on.
- Fix: Move the HELPERS section (lines 186-324: hslToRgb, clampByte, clamp01, rgbaToHex, rgbaKey, extractShadowColors, extractGradientColors, relativeLuminance, wcagContrast, gcd, mode, parsePxValue) before the CORE LOGIC section (parseColor and clusterTokens).


## F006-03 [P2] Duplicate classifyShadow function: exported version (line 374) and nested version (line 1044)
- File: .opencode/skills/sk-design-md-generator/tool/scripts/cluster.ts:374
- Evidence: `export function classifyShadow` at line 374 and `function classifyShadow` nested inside `clusterTokens` at line 1044 have identical logic (same shadow-splitting, same numeric analysis, same return types). The nested one shadows the exported one within `clusterTokens` (line 1087 calls the inner version). Two functions with the same name and identical behavior is redundant and confusing.
- Fix: Remove the nested `classifyShadow` at line 1044 and call the exported `classifyShadow` at line 374 instead. If the nested version intentionally differs, document why and rename to avoid collision.


## F006-04 [P2] CONSTANTS (section 2) and TYPE DEFINITIONS (section 3) are reversed from standard order
- File: .opencode/skills/sk-design-md-generator/tool/scripts/css-analyzer.ts:24
- Evidence: Line 21-23: `// 2. CONSTANTS` contains `TRACKED_PSEUDO_CLASSES`. Line 34-36: `// 3. TYPE DEFINITIONS` contains `CSSSource`. The style guide §4 standard order: 2 TYPE DEFINITIONS, 3 CONSTANTS. The file has them swapped (CONSTANTS first, TYPE DEFINITIONS second).
- Fix: Swap sections: move the `interface CSSSource` block to section 2 TYPE DEFINITIONS and `const TRACKED_PSEUDO_CLASSES` to section 3 CONSTANTS.


## F006-05 [P2] PageExtraction interface duplicated in cluster.ts and extract.ts instead of shared in types.ts
- File: .opencode/skills/sk-design-md-generator/tool/scripts/cluster.ts:36
- Evidence: `interface PageExtraction` defined at cluster.ts:36 and again at extract.ts:195 with identical shape (`{ url: string; dom: DOMCollection; css?: CSSAnalysis; interactions?: InteractionData }`). Neither imports from the other; TypeScript structural typing makes it work but risks silent divergence if one definition changes. types.ts already holds all other shared interfaces (CSSAnalysis, InteractionData, etc.).
- Fix: Move `PageExtraction` to types.ts as an exported interface, then import it from both cluster.ts and extract.ts. Remove the local definitions in both files.

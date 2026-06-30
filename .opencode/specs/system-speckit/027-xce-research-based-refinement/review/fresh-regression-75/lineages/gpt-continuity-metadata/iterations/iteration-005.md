# Seat gpt-continuity-metadata — iteration 5 (global #53)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-continuity-metadata
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=0 P2=1

## Analysis

I have enough verified evidence. Let me record my analysis.

## Review Analysis — seat `gpt-continuity-metadata`

**Angle:** accuracy of "current home / current folder" columns in 027's `context-index.md` files for phases that were folded/renamed/consolidated. **Lens:** traceability.

### What I verified (read personally + disk cross-check)

**1. Main "Six-Track Grouping" table (`context-index.md:9-40`) — ACCURATE.**
All 30 old→new rows resolve to real directories. I enumerated every numbered child under `001-research-and-doctrine` … `005-verification-and-remediation` and every "Current home" path in the table exists on disk. All 30 old top-level numbers `001`–`030` appear exactly once; contiguity claim (line 7) holds. The "six tracks" = `000-release-cleanup` + `001`–`005` is internally consistent.

**2. New phases not in the bridge — NOT a defect.**
Disk has three children with no bridge row: `003-advisor-and-codegraph/004-skill-advisor-suite-repair`, `004-shared-infrastructure/008-mcp-config-alignment-reelection-default`, `004-shared-infrastructure/009-code-graph-code-only-indexing`. These are net-new phases with no prior top-level identity; the doc's stated job is resolving *old* paths, so their absence is correct.

**3. Peck Teachings second table (`context-index.md:76-83`) — stale but DISCLOSED.**
Its "Current 027 child folder" column gives pre-grouping paths (e.g. `002-memory-write-safety/`, now `002-memory-store-and-search/001-memory-write-safety/`). The line-42 resolution note ("Where they name a `027-.../0NN-…` child … Resolve any such old path through the table above first") covers these generically. Not a separate finding.

**4. Sub-folder `004-shared-infrastructure/001-mcp-to-cli-tool-transition/context-index.md` — historical record, DISCLOSED.**
Its self-paths use the old standalone packet name `028-mcp-to-cli-tool-transition/`; the doc explicitly frames itself as a historical reorganization bridge (lines 2-3, 24). Disclosed; not a defect.

### The one real finding

**"027 to 028 Split" section (`context-index.md:44-62`) points to a packet that does not exist.** Lines 46/62 send the moved Code Graph + CocoIndex phases (9 rows, table at lines 50-60) to sibling packet `028-code-graph-and-cocoindex`. I searched the entire `.opencode/specs` tree: no such directory exists at any depth. The track's actual `028` packet is `028-memory-search-intelligence` (contents: only `.gitkeep` + `external/` — a near-empty placeholder). So every "New 028 folder" value (e.g. `005-cocoindex-complete-fork`) is a dead pointer. Unlike the other prior-wave sections, this one is *not* covered by the line-42 resolution note (which only addresses `027-.../0NN-` children), and line 62 is worded as present-tense live guidance ("Use `028-code-graph-and-cocoindex` for the moved … children"), contradicting the header's promise (line 3) to resolve to *current* homes.

Severity P2: real, evidence-backed traceability inaccuracy, but low blast-radius — the content left the 027 tree entirely, no data loss, and it reads partly as a historical event record. Fix is a forward note on what became of `028-code-graph-and-cocoindex`, or marking the section history-only.

```json
{"seat":"gpt-continuity-metadata","model":"openai/gpt-5.5-fast","angle":"context-index.md current-folder columns accuracy for phases folded/renamed/consolidated.","verdict":"CONDITIONAL","summary":"Main 30-row six-track bridge is fully accurate on disk. One stale section: the '027 to 028 Split' resolves 9 moved phases to sibling packet 028-code-graph-and-cocoindex, which exists nowhere on disk.","files_reviewed":[".opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md",".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/context-index.md"],"findings":[{"severity":"P2","dimension":"traceability","title":"'027 to 028 Split' current-folder column points to a nonexistent packet","file":".opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:62","evidence":"Lines 46/62 and the table at lines 50-60 resolve 9 moved Code Graph/CocoIndex phases to sibling packet '028-code-graph-and-cocoindex' (e.g. '005-cocoindex-complete-fork'). A full find over .opencode/specs returns no directory named 028-code-graph-and-cocoindex at any depth; the track's actual 028 packet is '028-memory-search-intelligence', which contains only .gitkeep + external/. Line 62 uses present-tense live guidance ('Use 028-code-graph-and-cocoindex for the moved ... children'), and the line-42 resolution note only covers 027-.../0NN- children, not this external packet.","why":"The doc's header (line 3) promises resolution to 'current homes', but this section's entire current-folder column is dangling — a reader/resume-agent locating a moved phase lands on a path that does not exist, with no forward pointer to its real fate.","recommendation":"Add a forward note recording what happened to 028-code-graph-and-cocoindex after the 2026-05-28 split (renamed/abandoned; current track 028 is 028-memory-search-intelligence), or explicitly mark the section as a historical event record and rephrase line 62 out of present-tense live guidance."}]}
```

# System Spec: Prompt Improver

---

## Overview

AI prompt engineering assistant. Analyses, improves, and rewrites prompts using 8 prompt frameworks (RCAF, COSTAR, TIDD-EC, CRAFT, RACE, CIDI, CRISPE, RISEN). Triple scoring system: CLEAR (50pt) + EVOKE (50pt) + VISUAL (60/70pt). Supports visual/image/video creative modes with refinement loops. Heavy DEPTH user with 19 round references and 25 RICCE references.

---

## System Path

`Prompt Improver/knowledge base/system/`

## Key Characteristics

| Attribute | Value |
|-----------|-------|
| **Scoring System** | CLEAR (50pt) + EVOKE (50pt) + VISUAL (60/70pt) |
| **Validation** | RICCE (25 references — needs removal) |
| **DEPTH Energy** | Raw (0) / Standard (10) / Deep (10+) — custom labels, needs migration |
| **Frameworks** | 8 prompt frameworks |
| **Creative Modes** | Visual, Image, Video (with refinement loops) |
| **Format Options** | Markdown, JSON, YAML |
| **Platform Detection** | 20+ platforms |
| **Commands** | `$vibe` (requires Component library gate) |
| **Export** | Downloadable files (not artifacts) |

## Current File Versions

| File | Version | Lines | Status |
|------|---------|-------|--------|
| DEPTH Framework | v0.131 | 506 | Legacy (19 round refs, 25 RICCE refs) |
| Interactive Mode | v0.700 | 622 | Legacy (most depth_rounds refs: 14) |
| System Prompt | v0.982 | 643 | Legacy |

---

## Sub-Folder Index

| Folder | Description | Status |
|--------|-------------|--------|
| (none) | No audit or work started yet | — |

---

## Known Remaining Work

- **Full system audit**: Never audited — should receive same treatment as other systems
- **DEPTH redesign**: Migrate from rounds to energy levels, remove RICCE (25 references), remove depth_rounds (14 references in Interactive Mode alone)
- **Quality gate**: Remove RICCE, keep CLEAR/EVOKE/VISUAL as quality gate

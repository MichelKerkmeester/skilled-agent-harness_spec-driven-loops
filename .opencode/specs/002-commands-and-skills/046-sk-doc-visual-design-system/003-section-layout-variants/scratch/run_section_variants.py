#!/usr/bin/env python3

import concurrent.futures
import json
import re
import subprocess
import textwrap
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple


WORKSPACE = Path("/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public")
SKILL_ROOT = WORKSPACE / ".opencode/skill/sk-doc-visual"
SECTIONS_DIR = SKILL_ROOT / "assets/sections"
PHASE_ROOT = WORKSPACE / "specs/002-commands-and-skills/046-sk-doc-visual-design-system/003-section-layout-variants"

RESEARCH_BRIEF = PHASE_ROOT / "scratch/research/layout-best-practices.md"
OUTPUT_DIR = PHASE_ROOT / "scratch/outputs"
LOG_DIR = PHASE_ROOT / "scratch/logs"
PROMPT_DIR = PHASE_ROOT / "scratch/prompts"
QA_DIR = PHASE_ROOT / "scratch/qa"

MAX_CONCURRENCY = 8
MAX_ATTEMPTS = 2
MODEL = "gemini-3.1-pro-preview"


@dataclass(frozen=True)
class SectionSpec:
    key: str
    filename: str
    purpose: str


SECTIONS: List[SectionSpec] = [
    SectionSpec("hero", "hero-section.html", "Top-level hero introducing the document with immediate context and identity."),
    SectionSpec("quick-start", "quick-start-section.html", "Fast onboarding path with prerequisites and first executable steps."),
    SectionSpec("feature-grid", "feature-grid-section.html", "Feature overview block highlighting capabilities in scannable cards."),
    SectionSpec(
        "operations-overview",
        "operations-overview-section.html",
        "Operational summary combining governance, lifecycle steps, and action examples.",
    ),
    SectionSpec(
        "setup-and-usage",
        "setup-and-usage-section.html",
        "Detailed setup and practical usage section with config and command examples.",
    ),
    SectionSpec("support", "support-section.html", "Troubleshooting and FAQ section for self-serve support."),
    SectionSpec("extensibility", "extensibility-section.html", "Extension model section explaining customization and adaptation paths."),
    SectionSpec(
        "related-documents",
        "related-documents-section.html",
        "Cross-reference and index section linking adjacent documentation resources.",
    ),
]


DIRECTIONS: Dict[str, List[Tuple[int, str, str]]] = {
    "hero": [
        (1, "Editorial Monument", "Large typographic hierarchy with restrained metadata rail."),
        (2, "Product Signal Strip", "Compact status strip plus concise centered narrative."),
        (3, "Split Narrative Canvas", "Left narrative with right supporting panel."),
        (4, "Diagrammatic Masthead", "Header integrated with subtle schematic framing."),
    ],
    "quick-start": [
        (1, "Checklist Console", "Prerequisites and setup commands in a compact console rhythm."),
        (2, "Two-Lane Onboarding", "Parallel lanes for new and existing users."),
        (3, "Progressive Steps Rail", "Vertical step rail with concise command inserts."),
        (4, "Recipe Card Sequence", "Action-oriented stacked cards with minimal explanation."),
    ],
    "feature-grid": [
        (1, "Evidence Matrix", "Claim-proof-impact framing using a structured matrix grid."),
        (2, "Tiered Value Bands", "Grouped capabilities by maturity or depth bands."),
        (3, "Workflow Capability Grid", "Map features to an explicit workflow sequence."),
        (4, "Comparative Pillars", "Pillar-style presentation emphasizing distinctions."),
    ],
    "operations-overview": [
        (1, "Command Center Ledger", "Ledger-like operational table with calm status emphasis."),
        (2, "Lifecycle Railboard", "Horizontal lifecycle rail with linked operational snippets."),
        (3, "Policy Procedure Split", "Two-pane governance rules and execution examples."),
        (4, "Audit Snapshot Panel", "Top summary panel followed by detailed operations breakdown."),
    ],
    "setup-and-usage": [
        (1, "Guided Pipeline Stack", "Sequential setup stack with explicit checkpoints."),
        (2, "Decision-First Config", "Mode selection first, then tailored config and commands."),
        (3, "Environment Tabbed Manual", "Environment-specific usage tracks with equal emphasis."),
        (4, "Failure-Aware Cookbook", "Each step paired with quick failure diagnosis."),
    ],
    "support": [
        (1, "Triage Desk", "Issue prioritization table with direct next-action paths."),
        (2, "Assurance Center", "FAQ grouped by confidence and escalation guidance."),
        (3, "Troubleshooting Atlas", "Symptom-to-resolution map in compact blocks."),
        (4, "Service Playbook", "Support process cards with escalation checkpoints."),
    ],
    "extensibility": [
        (1, "Contract-First Extensions", "Extension points organized by interface contracts."),
        (2, "Module Catalog", "Catalog-style extension inventory with compatibility signals."),
        (3, "Pattern Library Lens", "Patterns organized by when-to-use guidance."),
        (4, "Philosophy Practice Split", "Balanced conceptual and practical extension guidance."),
    ],
    "related-documents": [
        (1, "Knowledge Hub Index", "Intent-based document hub with clear categories."),
        (2, "Journey Reading Map", "Beginner-to-advanced reading progression."),
        (3, "Dependency Links Board", "Documents grouped by dependency relevance."),
        (4, "Curated Shelf", "Editorial shelves for start-here and deep-dive paths."),
    ],
}


def rel(path: Path) -> str:
    return path.relative_to(WORKSPACE).as_posix()


def strip_fences(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```[a-zA-Z0-9_-]*\n", "", cleaned)
        cleaned = re.sub(r"\n```$", "", cleaned)
    return cleaned.strip() + "\n"


def validate_html(html: str) -> List[str]:
    required_signals = [
        '<meta name="color-scheme" content="light dark">',
        "prefers-reduced-motion",
        "<section",
        "var(--bg)",
        "var(--surface)",
        "var(--text)",
        "var(--accent)",
        "var(--border)",
    ]
    missing: List[str] = []
    for signal in required_signals:
        if signal not in html:
            missing.append(signal)
    flashy_signals = ["neon", "particle", "parallax", "3d transform", "setInterval("]
    lowered = html.lower()
    for signal in flashy_signals:
        if signal in lowered:
            missing.append(f"flashy_or_forbidden:{signal}")
    return missing


def build_prompt(section: SectionSpec, variant_number: int, direction_name: str, direction_desc: str, retry_hint: str = "") -> str:
    return textwrap.dedent(
        f"""
        As @write agent, generate one complete standalone HTML file for a documentation section layout variant.

        TASK
        - Section key: {section.key}
        - Variant: v{variant_number}
        - Direction: {direction_name}
        - Direction intent: {direction_desc}
        - Section purpose: {section.purpose}

        HARD REQUIREMENTS
        1) Adhere to style tokens and variables from supplied files (colors, typography, layout).
        2) Keep visual style non-flashy, calm, and deliberate.
        3) Allow meaningful structural divergence from the current baseline layout.
        4) Produce desktop + mobile responsive behavior.
        5) Include reduced-motion support and dual-theme compatibility signals.
        6) Use semantic structure and keep the section readable/scannable.
        7) You are NOT constrained to existing component composition patterns.

        OUTPUT FORMAT
        - Return ONLY raw HTML (no markdown fences, no explanation).
        - Full standalone HTML document is required.
        - Keep placeholder pattern style compatible with template defaults where useful.

        UNIQUENESS CONTROLS
        - Make this variant materially different in at least 3 axes:
          information flow, container strategy, grouping logic, emphasis model, or navigation treatment.
        - Do not do color-only or icon-only changes.

        QUALITY CONTROLS
        - Avoid aggressive visual effects.
        - Avoid decorative noise.
        - Maintain clear hierarchy and implementation practicality.

        {retry_hint}
        """
    ).strip()


def run_job(section: SectionSpec, variant_number: int, direction_name: str, direction_desc: str) -> Dict[str, object]:
    section_out_dir = OUTPUT_DIR / section.key
    section_out_dir.mkdir(parents=True, exist_ok=True)
    PROMPT_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    output_file = section_out_dir / f"{section.key}-v{variant_number}.html"
    prompt_file = PROMPT_DIR / f"{section.key}-v{variant_number}.prompt.txt"
    log_file = LOG_DIR / f"{section.key}-v{variant_number}.log"

    retry_hint = ""
    last_missing: List[str] = []
    for attempt in range(1, MAX_ATTEMPTS + 1):
        prompt = build_prompt(section, variant_number, direction_name, direction_desc, retry_hint)
        prompt_file.write_text(prompt, encoding="utf-8")

        cmd = [
            "gemini",
            prompt,
            "-m",
            MODEL,
            "-o",
            "text",
            f"@{rel(SECTIONS_DIR / section.filename)}",
            f"@{rel(RESEARCH_BRIEF)}",
            "@.opencode/skill/sk-doc-visual/references/quick_reference.md",
            "@.opencode/skill/sk-doc-visual/assets/variables/colors.css",
            "@.opencode/skill/sk-doc-visual/assets/variables/typography.css",
            "@.opencode/skill/sk-doc-visual/assets/variables/layout.css",
        ]

        proc = subprocess.run(
            cmd,
            cwd=WORKSPACE,
            text=True,
            capture_output=True,
            timeout=480,
        )

        log_body = textwrap.dedent(
            f"""
            attempt: {attempt}
            section: {section.key}
            variant: v{variant_number}
            direction: {direction_name}
            return_code: {proc.returncode}

            ---- STDERR ----
            {proc.stderr}

            ---- STDOUT PREVIEW ----
            {proc.stdout[:3000]}
            """
        ).strip()
        log_file.write_text(log_body + "\n", encoding="utf-8")

        if proc.returncode != 0:
            retry_hint = (
                "Previous attempt returned a non-zero exit code. Regenerate complete HTML only and satisfy all constraints."
            )
            continue

        html = strip_fences(proc.stdout)
        missing = validate_html(html)
        if missing:
            last_missing = missing
            retry_hint = (
                "Previous attempt failed validation. Missing/forbidden signals: "
                + ", ".join(missing)
                + ". Regenerate complete HTML only and satisfy all constraints exactly."
            )
            continue

        output_file.write_text(html, encoding="utf-8")
        return {
            "section": section.key,
            "variant": variant_number,
            "direction": direction_name,
            "success": True,
            "output": rel(output_file),
            "attempts": attempt,
        }

    return {
        "section": section.key,
        "variant": variant_number,
        "direction": direction_name,
        "success": False,
        "output": rel(output_file),
        "attempts": MAX_ATTEMPTS,
        "missing": last_missing,
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    PROMPT_DIR.mkdir(parents=True, exist_ok=True)
    QA_DIR.mkdir(parents=True, exist_ok=True)

    all_results: List[Dict[str, object]] = []
    for wave in range(1, 5):
        jobs: List[Tuple[SectionSpec, int, str, str]] = []
        for section in SECTIONS:
            variant_number, direction_name, direction_desc = DIRECTIONS[section.key][wave - 1]
            jobs.append((section, variant_number, direction_name, direction_desc))

        print(f"Starting wave {wave} with {len(jobs)} jobs (concurrency={MAX_CONCURRENCY})")
        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_CONCURRENCY) as executor:
            futures = [executor.submit(run_job, *job) for job in jobs]
            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                all_results.append(result)
                status = "OK" if result["success"] else "FAIL"
                print(
                    f"[{status}] {result['section']} v{result['variant']} ({result['direction']}) attempts={result['attempts']}"
                )

    succeeded = [r for r in all_results if r["success"]]
    failed = [r for r in all_results if not r["success"]]

    manifest = {
        "total": len(all_results),
        "succeeded": len(succeeded),
        "failed": len(failed),
        "concurrency": MAX_CONCURRENCY,
        "model": MODEL,
        "results": all_results,
    }

    manifest_path = QA_DIR / "generation-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print("---")
    print(f"Done. succeeded={len(succeeded)} failed={len(failed)}")
    print(f"Manifest: {rel(manifest_path)}")
    if failed:
        print("Failed jobs:")
        for row in failed:
            print(f"- {row['section']} v{row['variant']} ({row['direction']})")


if __name__ == "__main__":
    main()

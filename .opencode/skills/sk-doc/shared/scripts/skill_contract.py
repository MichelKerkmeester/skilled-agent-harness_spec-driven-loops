#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: SKILL CONTRACT LOADER
# ───────────────────────────────────────────────────────────────

"""Load the create-skill contract with cached, degrade-on-error accessors."""

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SKILL_CONTRACT_PATH = Path(__file__).parent.parent / "assets" / "skill_contract.json"
_SKILL_CONTRACT_CACHE: Optional[Dict[str, Any]] = None


# ───────────────────────────────────────────────────────────────
# 2. LOADER
# ───────────────────────────────────────────────────────────────

def load_skill_contract() -> Dict[str, Any]:
    """Load and cache the create-skill contract, returning an empty dict on failure."""
    global _SKILL_CONTRACT_CACHE

    if _SKILL_CONTRACT_CACHE is not None:
        return _SKILL_CONTRACT_CACHE

    try:
        with SKILL_CONTRACT_PATH.open("r", encoding="utf-8") as handle:
            parsed = json.load(handle)
        if not isinstance(parsed, dict):
            raise ValueError("contract root must be a JSON object")
        _SKILL_CONTRACT_CACHE = parsed
    except Exception as exc:
        detail = str(exc).replace("\n", " ")
        print(f"[skill-contract] Warning: failed to load {SKILL_CONTRACT_PATH}: {detail}", file=sys.stderr)
        _SKILL_CONTRACT_CACHE = {}

    return _SKILL_CONTRACT_CACHE


# ───────────────────────────────────────────────────────────────
# 3. ACCESSORS
# ───────────────────────────────────────────────────────────────

def description_budget(kind: str = "skill") -> Dict[str, int]:
    """Return the kind-specific description budget plus shared hard ceilings."""
    budgets = load_skill_contract().get("descriptionBudget")
    if not isinstance(budgets, dict):
        return {}

    kind_budget = budgets.get(kind)
    if not isinstance(kind_budget, dict):
        return {}

    result = {
        key: value
        for key, value in kind_budget.items()
        if isinstance(key, str) and isinstance(value, int) and not isinstance(value, bool)
    }
    for key in ("hardCap", "projectCeiling"):
        value = budgets.get(key)
        if isinstance(value, int) and not isinstance(value, bool):
            result[key] = value
    return result


def name_rule() -> Dict[str, Any]:
    """Return a copy of the converged skill-name rule."""
    rule = load_skill_contract().get("nameRule")
    return dict(rule) if isinstance(rule, dict) else {}


def required_sections() -> List[str]:
    """Return the canonical required SKILL.md sections in validation order."""
    sections = load_skill_contract().get("sections")
    if not isinstance(sections, dict):
        return []
    skill_sections = sections.get("skill")
    if not isinstance(skill_sections, dict):
        return []
    required = skill_sections.get("required")
    if not isinstance(required, list):
        return []
    return [section for section in required if isinstance(section, str)]


def smart_router_markers() -> Dict[str, List[str]]:
    """Return copies of the required and recommended smart-router marker lists."""
    markers = load_skill_contract().get("smartRouterMarkers")
    if not isinstance(markers, dict):
        return {}

    result: Dict[str, List[str]] = {}
    for key in ("required", "recommended"):
        values = markers.get(key)
        if isinstance(values, list):
            result[key] = [value for value in values if isinstance(value, str)]
    return result

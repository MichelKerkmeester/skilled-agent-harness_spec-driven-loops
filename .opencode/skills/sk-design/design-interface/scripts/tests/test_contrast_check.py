#!/usr/bin/env python3
"""Tests for contrast_check.py.

This checker exists so a contrast-pair inventory cannot claim a pass on
eyeballed arithmetic -- which means its arithmetic is the thing worth pinning.
The reference vectors below are WCAG 2.x definitional values, so a regression
in the luminance curve or the ratio formula fails loudly rather than quietly
green-lighting an inaccessible pair.
"""
import json
import subprocess
import sys
from pathlib import Path

import pytest

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
SCRIPT = SCRIPTS_DIR / "contrast_check.py"

sys.path.insert(0, str(SCRIPTS_DIR))
import contrast_check as cc  # noqa: E402


def run(args, cwd):
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args],
        cwd=str(cwd), capture_output=True, text=True,
    )


# --- WCAG reference vectors -------------------------------------------------

def test_black_on_white_is_the_maximum_21_to_1():
    assert cc.contrast_ratio("#000000", "#ffffff") == 21.0


def test_identical_colors_are_1_to_1():
    assert cc.contrast_ratio("#787878", "#787878") == 1.0


def test_ratio_is_symmetric():
    assert cc.contrast_ratio("#06458c", "#ffffff") == cc.contrast_ratio("#ffffff", "#06458c")


def test_relative_luminance_endpoints():
    assert cc.relative_luminance("#000000") == 0.0
    assert cc.relative_luminance("#ffffff") == pytest.approx(1.0)


def test_three_digit_hex_expands_like_six_digit():
    assert cc.contrast_ratio("#fff", "#000") == cc.contrast_ratio("#ffffff", "#000000")


def test_hex_without_leading_hash_is_accepted():
    assert cc.contrast_ratio("000000", "ffffff") == 21.0


@pytest.mark.parametrize("bad", ["#12345", "", "#xyzxyz", "nope"])
def test_malformed_hex_raises_value_error(bad):
    with pytest.raises(ValueError):
        cc.relative_luminance(bad)


# --- the documented borderline pair ----------------------------------------

def test_readme_example_pair_fails_body_but_passes_large_ui():
    """#787878 on #ffffff is the README's example of a pair that looks fine and is not."""
    result = cc.evaluate("#787878", "#ffffff")
    assert 4.3 < result["ratio"] < cc.BODY_AA
    assert result["body_aa"] is False
    assert result["large_ui_aa"] is True


def test_evaluate_reports_both_wcag_and_apca():
    result = cc.evaluate("#000000", "#ffffff")
    assert result["body_aa"] is True
    assert result["apca_lc"] > 0, "dark-on-light should carry positive APCA polarity"
    assert result["apca_body"] is True


def test_apca_polarity_flips_for_light_on_dark():
    assert cc.apca_lc("#ffffff", "#000000") < 0
    assert cc.apca_lc("#000000", "#ffffff") > 0


def test_apca_returns_zero_for_identical_colors():
    assert cc.apca_lc("#787878", "#787878") == 0.0


# --- CLI contract -----------------------------------------------------------

def test_failing_pair_exits_1_so_it_can_gate_a_build(tmp_path):
    assert run(["#787878", "#ffffff"], cwd=tmp_path).returncode == 1


def test_passing_pair_exits_0(tmp_path):
    assert run(["#000000", "#ffffff"], cwd=tmp_path).returncode == 0


def test_multiple_pairs_are_all_evaluated(tmp_path):
    proc = run(["--json", "#000000", "#ffffff", "#787878", "#ffffff"], cwd=tmp_path)
    payload = json.loads(proc.stdout)
    assert len(payload["results"]) == 2
    assert payload["any_body_fail"] is True


@pytest.mark.parametrize("args", [[], ["#000000"], ["#000000", "#ffffff", "#123456"]])
def test_odd_or_missing_arguments_exit_2(args, tmp_path):
    assert run(args, cwd=tmp_path).returncode == 2

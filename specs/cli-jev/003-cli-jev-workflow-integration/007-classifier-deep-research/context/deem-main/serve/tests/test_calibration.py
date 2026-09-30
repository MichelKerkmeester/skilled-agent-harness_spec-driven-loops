"""Calibration file loading and temperature lookup."""

import math

import pytest

from conftest import FixedBackend
from deem_server import BackendError, Calibration


def test_flat_primitive_temperatures():
    cal = Calibration.from_dict({"choice": 1.5, "noul": 2.0, "score": 3.0})
    assert cal.temperature_for("choice") == 1.5
    assert cal.temperature_for("noul") == 2.0
    assert cal.temperature_for("score") == 3.0


def test_per_primitive_nested_shape():
    cal = Calibration.from_dict({
        "per_primitive": {
            "choice": {"temperature": 0.99},
            "noul": {"temperature": 4.33},
            "score": {"temperature": 3.12},
        }
    })
    assert cal.temperature_for("choice") == 0.99
    assert cal.temperature_for("noul") == 4.33


def test_temperature_v4_json_shape():
    """The emitted temperature_v4.json form: versioned wrapper keys."""
    data = {
        "n_dev_rows": 4970,
        "v3": {
            "per_primitive": {"choice": {"temperature": 1.1}},
            "per_dataset": {"ag_news": {"temperature": 1.1}},
        },
        "v4": {
            "per_primitive": {"choice": {"temperature": 0.988}},
            "per_dataset": {"ag_news": {"temperature": 0.988}},
        },
    }
    cal = Calibration.from_dict(data, key="v4")
    assert cal.temperature_for("choice") == 0.988
    # without a key: the first versioned entry found
    cal_default = Calibration.from_dict(data)
    assert cal_default.temperature_for("choice") == 1.1
    with pytest.raises(BackendError):
        Calibration.from_dict(data, key="v9")


def test_dataset_overrides_primitive():
    cal = Calibration.from_dict({
        "per_primitive": {"choice": 2.0},
        "per_dataset": {"ag_news": 5.0},
    })
    assert cal.temperature_for("choice", "ag_news") == 5.0
    assert cal.temperature_for("choice", "snli") == 2.0
    assert cal.temperature_for("noul") == 1.0


def test_default_temperature_is_one():
    cal = Calibration()
    assert cal.temperature_for("choice") == 1.0
    assert cal.temperature_for("noul", "anything") == 1.0


def test_invalid_temperature_rejected():
    with pytest.raises(BackendError):
        Calibration(primitive_temps={"choice": -1.0})
    with pytest.raises(BackendError):
        Calibration(primitive_temps={"choice": 0.0})
    with pytest.raises(BackendError):
        Calibration(primitive_temps={"choice": float("nan")})
    with pytest.raises(BackendError):
        Calibration.from_dict([1, 2, 3])


def test_unknown_dataset_falls_back_to_primitive():
    cal = Calibration.from_dict({
        "per_primitive": {"noul": 4.33},
        "per_dataset": {"boolq": 2.0},
    })
    assert cal.temperature_for("noul", "civil_comments") == 4.33


def test_flat_dict_values_with_temperature_key():
    cal = Calibration.from_dict({"choice": {"temperature": 1.23}})
    assert cal.temperature_for("choice") == 1.23


# ---------------------------------------------------------------------


def _two_option_request(base_url):
    from conftest import post

    return post(
        base_url,
        "/v1/systemone",
        {
            "state": "ping is up",
            "questions": {
                "q": {
                    "type": "choice",
                    "instructions": "Pick a reply",
                    "options": ["yes", "no"],
                }
            },
        },
    )


def test_calibration_end_to_end_temperature(tmp_path):
    """Per-primitive temperature flows through the whole server stack."""
    import json
    from conftest import live_server

    cal_path = tmp_path / "calib.json"
    cal_path.write_text(json.dumps({"per_primitive": {"choice": 2.0}}))
    cal = Calibration.from_file(cal_path)
    backend = FixedBackend(fn=lambda p, n: [2.0, 0.0])
    with live_server(backend=backend, calibration=cal) as url:
        status, body = _two_option_request(url)
        assert status == 200
        answer = body["answers"]["q"]
        # softmax([2/2, 0/2]) = [e^1 / (e^1 + 1), 1 / (e^1 + 1)]
        expected = math.exp(1.0) / (math.exp(1.0) + 1.0)
        assert answer["probabilities"]["yes"] == pytest.approx(expected)
        assert answer["temperature"] == 2.0


# ---------------------------------------------------------------------
# v6 per-class calibration
# ---------------------------------------------------------------------


def _v6_payload(dataset=None):
    """A 3-option choice question, optionally tagged with a dataset."""
    question = {
        "type": "choice",
        "instructions": "Pick one",
        "options": ["a", "b", "c"],
    }
    if dataset is not None:
        question["dataset"] = dataset
    return {"state": "s", "questions": {"q": question}}


def _softmax(z):
    m = max(z)
    e = [math.exp(x - m) for x in z]
    s = sum(e)
    return [x / s for x in e]
V6_FILE = {
    "v6": {
        "per_primitive": {"choice": {"temperature": 1.0}},
        "per_dataset": {
            "tagged": {
                "temperature": 1.5,
                "primitive": "choice",
                "calibrator": {
                    "kind": "per_class_temperature",
                    "temperatures": [1.0, 2.0, 4.0],
                },
            }
        },
    }
}


def test_v6_per_class_temperatures_loaded():
    cal = Calibration.from_dict(V6_FILE, key="v6")
    assert cal.temperature_for("choice", "tagged") == 1.5
    assert cal.class_temperatures_for("tagged", 3) == [1.0, 2.0, 4.0]
    # wrong arity or unknown dataset -> scalar chain
    assert cal.class_temperatures_for("tagged", 2) is None
    assert cal.class_temperatures_for("tagged", 4) is None
    assert cal.class_temperatures_for("other", 3) is None


def test_v6_per_class_application_end_to_end():
    """Per-class temperatures scale each logit by its own temperature."""
    from conftest import live_server, post

    cal = Calibration.from_dict(V6_FILE, key="v6")
    backend = FixedBackend(fn=lambda p, n: [3.0, 2.0, 1.0])
    with live_server(backend=backend, calibration=cal) as url:
        status, body = post(url, "/v1/systemone", _v6_payload("tagged"))
        assert status == 200
        answer = body["answers"]["q"]
        probs = answer["probabilities"]
        expected = _softmax([3.0 / 1.0, 2.0 / 2.0, 1.0 / 4.0])
        for got, want in zip(
            [probs["a"], probs["b"], probs["c"]], expected
        ):
            assert got == pytest.approx(want)
        # reported temperature is the scalar fallback (per-dataset)
        assert answer["temperature"] == 1.5
        # scalar scaling would have produced a different distribution
        scalar = _softmax([3.0 / 1.5, 2.0 / 1.5, 1.0 / 1.5])
        assert probs["a"] != pytest.approx(scalar[0])


def test_v6_fallback_chain():
    """per-class -> per-dataset scalar -> per-primitive -> 1.0."""
    from conftest import live_server, post

    data = {
        "per_primitive": {"choice": 2.5, "noul": 4.0},
        "per_dataset": {
            "with_class": {
                "temperature": 1.5,
                "calibrator": {
                    "kind": "per_class_temperature",
                    "temperatures": [1.0, 1.0, 1.0],
                },
            },
            "scalar_only": {"temperature": 3.0},
        },
    }
    cal = Calibration.from_dict(data)
    backend = FixedBackend(fn=lambda p, n: [3.0, 2.0, 1.0])
    with live_server(backend=backend, calibration=cal) as url:
        # 1. per-class applies (all-ones -> identical to raw logits)
        _, body = post(url, "/v1/systemone", _v6_payload("with_class"))
        probs = body["answers"]["q"]["probabilities"]
        for got, want in zip(
            [probs["a"], probs["b"], probs["c"]],
            _softmax([3.0, 2.0, 1.0]),
        ):
            assert got == pytest.approx(want)

        # 2. scalar per-dataset fallback (arity mismatch drops per-class)
        _, body = post(url, "/v1/systemone", _v6_payload("scalar_only"))
        answer = body["answers"]["q"]
        assert answer["temperature"] == 3.0
        probs = answer["probabilities"]
        for got, want in zip(
            [probs["a"], probs["b"], probs["c"]],
            _softmax([3.0 / 3.0, 2.0 / 3.0, 1.0 / 3.0]),
        ):
            assert got == pytest.approx(want)

        # 3. per-primitive fallback (unknown dataset)
        _, body = post(url, "/v1/systemone", _v6_payload("unknown_ds"))
        answer = body["answers"]["q"]
        assert answer["temperature"] == 2.5
        probs = answer["probabilities"]
        for got, want in zip(
            [probs["a"], probs["b"], probs["c"]],
            _softmax([3.0 / 2.5, 2.0 / 2.5, 1.0 / 2.5]),
        ):
            assert got == pytest.approx(want)


def test_v6_invalid_per_class_rejected():
    data = {
        "per_dataset": {
            "bad": {
                "temperature": 1.0,
                "calibrator": {
                    "kind": "per_class_temperature",
                    "temperatures": [1.0, 0.0],
                },
            }
        }
    }
    with pytest.raises(BackendError):
        Calibration.from_dict(data)


def test_v6_real_files_load():
    """The shipped v6 and v5 calibration files both load and parse."""
    import json
    from pathlib import Path

    repo = Path(__file__).resolve().parents[2]
    v6_path = repo / "scripts" / "sft" / "calibration_v6.json"
    if not v6_path.exists():  # pragma: no cover
        pytest.skip("scripts/sft/calibration_v6.json not checked out")
    with open(v6_path, encoding="utf-8") as f:
        data = json.load(f)
    cal = Calibration.from_dict(data, key="v6")
    # every shipped dataset has a per-class vector and a legacy scalar
    for ds, entry in data["v6"]["per_dataset"].items():
        temps = cal.class_temperatures_for(
            ds, len(entry["calibrator"]["temperatures"])
        )
        assert temps is not None
        assert cal.class_temperatures_for(ds, 1) is None  # arity guard
        assert cal.temperature_for("choice", ds) == pytest.approx(
            entry["temperature"]
        )

    v5_path = repo / "scripts" / "sft" / "temperature_v5.json"
    if not v5_path.exists():  # pragma: no cover
        pytest.skip("scripts/sft/temperature_v5.json not checked out")
    with open(v5_path, encoding="utf-8") as f:
        cal = Calibration.from_dict(json.load(f))
    # v5 compat: no per-class vectors, scalar chain intact
    assert cal.dataset_class_temps == {}
    assert cal.temperature_for("choice", "ag_news") > 0

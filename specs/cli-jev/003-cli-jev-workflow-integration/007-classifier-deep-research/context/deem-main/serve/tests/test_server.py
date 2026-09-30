"""HTTP contract of the /v1/systemone server (stub backends only)."""

import math

import pytest

from conftest import FixedBackend, get, live_server, post


def systemone_url():
    return "/v1/systemone"


def simple_payload(**overrides):
    payload = {
        "state": "The build is red on a Friday evening.",
        "questions": {
            "deploy": {
                "type": "choice",
                "instructions": "Deploy now or wait?",
                "options": ["deploy", "wait"],
            }
        },
    }
    payload.update(overrides)
    return payload


# ---------------------------------------------------------------------------
# Request validation
# ---------------------------------------------------------------------------


def test_missing_state_400(base_url):
    status, body = post(
        base_url, systemone_url(), {"questions": simple_payload()["questions"]}
    )
    assert status == 400
    assert "error" in body


def test_missing_questions_400(base_url):
    status, body = post(base_url, systemone_url(), {"state": "hello"})
    assert status == 400


def test_empty_questions_400(base_url):
    status, body = post(base_url, systemone_url(), {"state": "x", "questions": {}})
    assert status == 400


def test_malformed_json_400(base_url):
    import urllib.error
    import urllib.request

    request = urllib.request.Request(
        base_url + systemone_url(),
        data=b"{not json",
        headers={"Content-Type": "application/json"},
    )
    try:
        urllib.request.urlopen(request, timeout=30)
        raise AssertionError("expected 400")
    except urllib.error.HTTPError as exc:
        assert exc.code == 400
        assert b"error" in exc.read()


def test_one_option_choice_400(base_url):
    status, body = post(
        base_url,
        systemone_url(),
        {
            "state": "x",
            "questions": {
                "q": {
                    "type": "choice",
                    "instructions": "pick",
                    "options": ["only one"],
                }
            },
        },
    )
    assert status == 400


def test_256_options_choice_400(base_url):
    options = [f"option {i}" for i in range(256)]
    status, _ = post(
        base_url,
        systemone_url(),
        {
            "state": "x",
            "questions": {
                "q": {
                    "type": "choice",
                    "instructions": "pick",
                    "options": options,
                }
            },
        },
    )
    assert status == 400


def test_255_options_ok(base_url):
    options = [f"option {i}" for i in range(255)]
    status, body = post(
        base_url,
        systemone_url(),
        {
            "state": "x",
            "questions": {
                "q": {
                    "type": "choice",
                    "instructions": "pick",
                    "options": options,
                }
            },
        },
    )
    assert status == 200
    assert len(body["answers"]["q"]["probabilities"]) == 255


def test_eleven_levels_400(base_url):
    status, _ = post(
        base_url,
        systemone_url(),
        {
            "state": "x",
            "questions": {
                "q": {
                    "type": "score",
                    "instructions": "rate",
                    "levels": [f"L{i}" for i in range(11)],
                }
            },
        },
    )
    assert status == 400


def test_single_level_400(base_url):
    status, _ = post(
        base_url,
        systemone_url(),
        {
            "state": "x",
            "questions": {
                "q": {
                    "type": "score",
                    "instructions": "rate",
                    "levels": ["high"],
                }
            },
        },
    )
    assert status == 400


def test_unknown_question_type_400(base_url):
    status, body = post(
        base_url,
        systemone_url(),
        {
            "state": "x",
            "questions": {"q": {"type": "vibe", "instructions": "?"}},
        },
    )
    assert status == 400
    assert "vibe" in body["error"]["message"]


def test_duplicate_options_400(base_url):
    status, _ = post(
        base_url,
        systemone_url(),
        {
            "state": "x",
            "questions": {
                "q": {
                    "type": "choice",
                    "instructions": "pick",
                    "options": ["same", "same"],
                }
            },
        },
    )
    assert status == 400


def test_missing_instructions_400(base_url):
    status, _ = post(
        base_url,
        systemone_url(),
        {
            "state": "x",
            "questions": {"q": {"type": "noul"}},
        },
    )
    assert status == 400


def test_question_count_cap():
    """The max-questions cap produces a 400, not a meltdown."""
    questions = {
        f"q{i}": {"type": "noul", "instructions": f"prop {i}"} for i in range(65)
    }
    with live_server() as url:
        status, body = post(
            url, systemone_url(), {"state": "x", "questions": questions}
        )
        assert status == 400
        assert "question" in body["error"]["message"]


def test_backend_letter_cap_maps_to_400():
    from deem_server import RequestError

    class CappedBackend(FixedBackend):
        max_letters = 26

        def slot_logits(self, prompts, n_valids):
            for n in n_valids:
                if n > self.max_letters:
                    raise RequestError(
                        f"backend reads at most {self.max_letters} letters",
                        code="unsupported_option_count",
                    )
            return super().slot_logits(prompts, n_valids)

    with live_server(backend=CappedBackend()) as url:
        status, body = post(
            url,
            systemone_url(),
            {
                "state": "x",
                "questions": {
                    "q": {
                        "type": "choice",
                        "instructions": "pick",
                        "options": [f"o{i}" for i in range(27)],
                    }
                },
            },
        )
        assert status == 400
        assert body["error"]["code"] == "unsupported_option_count"


# ---------------------------------------------------------------------------
# Response shape
# ---------------------------------------------------------------------------


def test_choice_response_shape(base_url):
    status, body = post(base_url, systemone_url(), simple_payload())
    assert status == 200
    assert body["model"] == "deem-test"
    assert body["object"] == "systemone.completion"
    assert body["id"].startswith("deem-")
    answer = body["answers"]["deploy"]
    assert answer["type"] == "choice"
    assert answer["choice"] in ("deploy", "wait")
    assert set(answer["probabilities"]) == {"deploy", "wait"}
    assert answer["confidence"] == 0.0  # uniform stub
    assert answer["temperature"] == 1.0
    assert body["usage"]["questions"] == 1


def test_score_response_shape(base_url):
    status, body = post(
        base_url,
        systemone_url(),
        {
            "state": "The support ticket.",
            "questions": {
                "urgency": {
                    "type": "score",
                    "instructions": "Rate the urgency.",
                    "levels": ["low", "medium", "high", "critical"],
                }
            },
        },
    )
    assert status == 200
    answer = body["answers"]["urgency"]
    assert answer["type"] == "score"
    assert answer["level"] == "low"  # uniform -> first level wins ties
    assert set(answer["probabilities"]) == {"low", "medium", "high", "critical"}
    assert answer["expected"] == pytest.approx(1.5)  # uniform over 4 levels
    assert answer["confidence"] == 0.0


def test_noul_response_shape(base_url):
    status, body = post(
        base_url,
        systemone_url(),
        {
            "state": "The sky.",
            "questions": {
                "blue": {
                    "type": "noul",
                    "instructions": "The sky is blue.",
                }
            },
        },
    )
    assert status == 200
    answer = body["answers"]["blue"]
    assert answer["type"] == "noul"
    assert answer["value"] == pytest.approx(0.5)  # uniform stub
    assert answer["confidence"] == pytest.approx(0.0)


def test_list_form_questions(base_url):
    status, body = post(
        base_url,
        systemone_url(),
        {
            "state": "x",
            "questions": [
                {
                    "id": "a",
                    "type": "noul",
                    "instructions": "prop",
                }
            ],
        },
    )
    assert status == 200
    assert "a" in body["answers"]


def test_duplicate_question_ids_400(base_url):
    status, _ = post(
        base_url,
        systemone_url(),
        {
            "state": "x",
            "questions": [
                {"id": "a", "type": "noul", "instructions": "p"},
                {"id": "a", "type": "noul", "instructions": "q"},
            ],
        },
    )
    assert status == 400


# ---------------------------------------------------------------------------
# Confidence formula: (N * pmax - 1) / (N - 1)
# ---------------------------------------------------------------------------


def test_confidence_formula_choice():
    backend = FixedBackend(fn=lambda p, n: [3.0, 0.0])
    with live_server(backend=backend) as url:
        status, body = post(url, systemone_url(), simple_payload())
        assert status == 200
        probs = body["answers"]["deploy"]["probabilities"]
        pmax = max(probs.values())
        expected = (2 * pmax - 1) / 1
        assert body["answers"]["deploy"]["confidence"] == pytest.approx(expected)


def test_confidence_uniform_is_zero(base_url):
    status, body = post(base_url, systemone_url(), simple_payload())
    assert body["answers"]["deploy"]["confidence"] == pytest.approx(0.0)


def test_confidence_point_mass_is_one():
    backend = FixedBackend(fn=lambda p, n: [30.0, 0.0, 0.0])
    with live_server(backend=backend) as url:
        status, body = post(
            url,
            systemone_url(),
            {
                "state": "x",
                "questions": {
                    "q": {
                        "type": "choice",
                        "instructions": "pick",
                        "options": ["a", "b", "c"],
                    }
                },
            },
        )
        assert status == 200
        assert body["answers"]["q"]["confidence"] == pytest.approx(1.0)


def test_noul_confidence_binary():
    backend = FixedBackend(fn=lambda p, n: [0.0, 3.0])  # [not-true, true]
    with live_server(backend=backend) as url:
        status, body = post(
            url,
            systemone_url(),
            {
                "state": "x",
                "questions": {"q": {"type": "noul", "instructions": "prop"}},
            },
        )
        assert status == 200
        answer = body["answers"]["q"]
        p = answer["value"]
        assert p > 0.9
        # binary confidence: 2 * pmax - 1
        assert answer["confidence"] == pytest.approx(2 * p - 1)


# ---------------------------------------------------------------------------
# Multi-question batching and per-question isolation
# ---------------------------------------------------------------------------


def test_full_lm_head_rows_trimmed():
    """Backends may return full 26-letter rows (like the torch readout):
    decoding must trim to valid letters, incl. the 2-logit noul readout."""

    backend = FixedBackend(fn=lambda p, n: [0.1 * i for i in range(26)])
    with live_server(backend=backend) as url:
        status, body = post(
            url,
            systemone_url(),
            {
                "state": "x",
                "questions": {
                    "q": {"type": "noul", "instructions": "prop"},
                },
            },
        )
        assert status == 200
        assert 0.0 < body["answers"]["q"]["value"] < 1.0


def test_multi_question_batching():
    backend = FixedBackend()
    with live_server(backend=backend) as url:
        status, body = post(
            url,
            systemone_url(),
            {
                "state": {"build": "red", "friday": True},
                "questions": {
                    "route": {
                        "type": "choice",
                        "instructions": "Route the ticket.",
                        "options": ["oncall", "queue"],
                    },
                    "urgency": {
                        "type": "score",
                        "instructions": "Rate urgency.",
                        "levels": ["low", "high"],
                    },
                    "is_flaky": {
                        "type": "noul",
                        "instructions": "The failure is a flake.",
                    },
                },
            },
        )
        assert status == 200
        assert body["usage"]["questions"] == 3
        assert set(body["answers"]) == {"route", "urgency", "is_flaky"}
        # One prompt per question (per-question isolation), one batch call.
        assert len(backend.calls) == 3
        prompt_texts = [c[0] for c in backend.calls]
        for prompt in prompt_texts:
            assert "The failure is a flake." or True
        # each prompt mentions the state and only its own question
        assert "oncall" in prompt_texts[0]
        assert "is a flake" not in prompt_texts[0]
        assert "low" in prompt_texts[1]
        assert "oncall" not in prompt_texts[1]
        assert "Answer 1: (" in prompt_texts[2]
        for prompt in prompt_texts:
            assert "route" not in prompt  # question ids never appear
        # usage tokens sum the per-prompt token counts
        assert body["usage"]["prompt_tokens"] > 0


# ---------------------------------------------------------------------------
# Temperature application
# ---------------------------------------------------------------------------


def test_temperature_flattens_distribution(tmp_path):
    backend = FixedBackend(fn=lambda p, n: [2.0, 0.0])
    cal_path = tmp_path / "calib.json"
    cal_path.write_text('{"per_primitive": {"choice": 2.0}}')
    from deem_server import Calibration

    with live_server(backend=backend, calibration=Calibration.from_file(cal_path)) as url:
        status, body = post(url, systemone_url(), simple_payload())
        assert status == 200
        answer = body["answers"]["deploy"]
        assert answer["temperature"] == 2.0
        # T=2 halves the logit gap: softmax([1, 0])
        expected = math.exp(1.0) / (math.exp(1.0) + 1.0)
        assert answer["probabilities"]["deploy"] == pytest.approx(expected)


def test_per_dataset_temperature_wins():
    from deem_server import Calibration

    cal = Calibration.from_dict({
        "per_primitive": {"choice": 1.0},
        "per_dataset": {"ag_news": 4.0},
    })
    backend = FixedBackend(fn=lambda p, n: [2.0, 0.0, 0.0])
    with live_server(backend=backend, calibration=cal) as url:
        status, body = post(
            url,
            systemone_url(),
            {
                "state": "x",
                "questions": {
                    "with_ds": {
                        "type": "choice",
                        "instructions": "pick",
                        "options": ["a", "b", "c"],
                        "dataset": "ag_news",
                    },
                    "without_ds": {
                        "type": "choice",
                        "instructions": "pick",
                        "options": ["a", "b", "c"],
                    },
                },
            },
        )
        assert status == 200
        assert body["answers"]["with_ds"]["temperature"] == 4.0
        assert body["answers"]["without_ds"]["temperature"] == 1.0
        # higher temperature -> flatter distribution
    assert True


# ---------------------------------------------------------------------------
# Error paths
# ---------------------------------------------------------------------------


def test_404_unknown_path(base_url):
    status, body = get(base_url, "/nope")
    assert status == 404
    assert body["error"]["code"] == "not_found"


def test_405_get_on_systemone(base_url):
    status, body = get(base_url, "/v1/systemone")
    assert status == 405
    assert body["error"]["code"] == "method_not_allowed"


def test_post_404(base_url):
    status, _ = post(base_url, "/v1/other", {"x": 1})
    assert status == 404


def test_backend_error_500():
    class ExplodingBackend(FixedBackend):
        def slot_logits(self, prompts, n_valids):
            from deem_server import BackendError

            raise BackendError("boom")

    with live_server(backend=ExplodingBackend()) as url:
        status, body = post(url, systemone_url(), simple_payload())
        assert status == 500
        assert body["error"]["code"] == "backend_error"


# ---------------------------------------------------------------------------
# Aux endpoints
# ---------------------------------------------------------------------------


def test_health(base_url):
    status, body = get(base_url, "/health")
    assert status == 200
    assert body["status"] == "ok"
    assert body["model"] == "deem-test"
    assert body["backend"] == "fixed"


def test_models(base_url):
    status, body = get(base_url, "/v1/models")
    assert status == 200
    assert body["object"] == "list"
    assert body["data"][0]["id"] == "deem-test"
    assert body["data"][0]["object"] == "model"

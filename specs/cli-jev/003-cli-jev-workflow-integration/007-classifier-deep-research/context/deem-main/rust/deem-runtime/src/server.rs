//! `/v1/systemone` HTTP server — wire-compatible with `serve/deem_server.py`.

use crate::format::{build_prompt, read_answers_with_temps, Answer, Question, QuestionSet};
use crate::readout::Readout;
use serde_json::{json, Value};
use std::io::Read;
use std::sync::Arc;

pub struct Calibration {
    per_primitive: std::collections::HashMap<String, f32>,
    per_dataset: std::collections::HashMap<String, f32>,
}

impl Calibration {
    pub fn load(path: &std::path::Path, key: Option<&str>) -> Self {
        let mut cal = Calibration {
            per_primitive: Default::default(),
            per_dataset: Default::default(),
        };
        let Ok(text) = std::fs::read_to_string(path) else {
            return cal;
        };
        let Ok(parsed) = serde_json::from_str::<Value>(&text) else {
            return cal;
        };
        let root = match key {
            Some(k) => parsed.get(k).unwrap_or(&parsed),
            None => &parsed,
        };
        if let Some(pp) = root.get("per_primitive").and_then(|v| v.as_object()) {
            for (k, v) in pp {
                if let Some(f) = v.as_f64() {
                    cal.per_primitive.insert(k.clone(), f as f32);
                }
            }
        }
        if let Some(pd) = root.get("per_dataset").and_then(|v| v.as_object()) {
            for (k, v) in pd {
                if let Some(f) = v.as_f64() {
                    cal.per_dataset.insert(k.clone(), f as f32);
                }
            }
        }
        if cal.per_primitive.is_empty() {
            for (k, v) in parsed.as_object().into_iter().flatten() {
                if let Some(f) = v.as_f64() {
                    cal.per_primitive.insert(k.clone(), f as f32);
                }
            }
        }
        cal
    }

    fn temperature(&self, question_type: &str, dataset: Option<&str>) -> f32 {
        if let Some(d) = dataset {
            if let Some(t) = self.per_dataset.get(d) {
                return *t;
            }
        }
        self.per_primitive
            .get(question_type)
            .cloned()
            .unwrap_or(1.0)
    }
}

struct ParsedQuestion {
    question: Question,
    dataset: Option<String>,
    qid: String,
    qtype: String,
}

fn parse_request(body: &Value) -> Result<(Value, Vec<ParsedQuestion>), String> {
    let state = body.get("state").ok_or("missing state")?.clone();
    let questions_value = body.get("questions").ok_or("missing questions")?;
    // Both wire forms, matching parse_questions in serve/deem_server.py:
    let questions: Vec<(String, &Value)> = if let Some(obj) = questions_value.as_object() {
        if obj.is_empty() {
            return Err("'questions' must contain at least one question".to_string());
        }
        obj.iter().map(|(k, v)| (k.clone(), v)).collect()
    } else if let Some(arr) = questions_value.as_array() {
        let mut items = Vec::with_capacity(arr.len());
        for q in arr {
            let qid = q
                .get("id")
                .or_else(|| q.get("qid"))
                .and_then(|v| v.as_str())
                .ok_or("list-form questions need an 'id' field")?;
            items.push((qid.to_string(), q));
        }
        items
    } else {
        return Err("'questions' must be an object or a list".to_string());
    };

    let top_dataset = body
        .get("dataset")
        .and_then(|d| d.as_str())
        .map(|s| s.to_string());

    let mut parsed = Vec::new();
    for (qid, q) in questions {
        let qtype = q
            .get("type")
            .and_then(|t| t.as_str())
            .ok_or(format!("question {qid}: missing type"))?
            .to_string();
        let instructions = q
            .get("instructions")
            .and_then(|t| t.as_str())
            .ok_or(format!("question {qid}: missing instructions"))?
            .to_string();
        let dataset = q
            .get("dataset")
            .and_then(|d| d.as_str())
            .or_else(|| top_dataset.as_deref())
            .map(|s| s.to_string());

        let question = match qtype.as_str() {
            "choice" => {
                let options: Vec<String> = q
                    .get("options")
                    .and_then(|o| o.as_array())
                    .map(|a| {
                        a.iter()
                            .filter_map(|x| x.as_str().map(|s| s.to_string()))
                            .collect()
                    })
                    .ok_or(format!("question {qid}: missing options"))?;
                if options.len() < 2 || options.len() > 255 {
                    return Err(format!("question {qid}: choice needs 2-255 options"));
                }
                if q.get("dataset").is_none() && top_dataset.is_some() {
                    // dataset applies to questions lacking their own
                }
                Question::Choice { instructions, options }
            }
            "score" => {
                let levels: Vec<String> = q
                    .get("levels")
                    .and_then(|o| o.as_array())
                    .map(|a| {
                        a.iter()
                            .filter_map(|x| x.as_str().map(|s| s.to_string()))
                            .collect()
                    })
                    .ok_or(format!("question {qid}: missing levels"))?;
                if levels.len() < 2 || levels.len() > 10 {
                    return Err(format!("question {qid}: score needs 2-10 levels"));
                }
                Question::Score { instructions, levels }
            }
            "noul" => Question::Noul { instructions },
            other => return Err(format!("question {qid}: unknown type {other}")),
        };
        parsed.push(ParsedQuestion {
            question,
            dataset,
            qid,
            qtype,
        });
    }
    Ok((state, parsed))
}

pub fn run(
    readout: Arc<Readout>,
    host: &str,
    port: u16,
    model_id: &str,
    calibration: Option<Calibration>,
) -> ! {
    use tiny_http::Server;
    let addr = format!("{host}:{port}");
    let server = Server::http(&addr).expect("bind failed");
    let model_id = Arc::new(model_id.to_string());
    let cal = Arc::new(calibration);
    eprintln!("[deem-rust] serving {addr} model={model_id}");
    for mut request in server.incoming_requests() {
        let readout = readout.clone();
        let model_id = model_id.clone();
        let cal = cal.clone();
        std::thread::spawn(move || {
            let response = handle_request(&readout, &mut request, &model_id, &cal);
            request.respond(response).ok();
        });
    }
    unreachable!()
}

fn error_body(message: &str, typ: &str, code: u16) -> String {
    serde_json::to_string(&json!({
        "error": {"message": message, "type": typ, "code": code}
    }))
    .unwrap()
}

fn handle_request(
    readout: &Arc<Readout>,
    request: &mut tiny_http::Request,
    model_id: &str,
    calibration: &Option<Calibration>,
) -> tiny_http::Response<std::io::Cursor<Vec<u8>>> {
    let method = request.method().clone();
    let url = request.url().to_string();

    if method == tiny_http::Method::Get && url.starts_with("/v1/models") {
        return tiny_http::Response::from_string(
            serde_json::to_string(&json!({
                "object": "list",
                "data": [{"id": model_id, "object": "model", "created": 0,
                          "owned_by": "deem"}],
            }))
            .unwrap(),
        );
    }
    if method == tiny_http::Method::Get && url.starts_with("/health") {
        return tiny_http::Response::from_string(
            serde_json::to_string(&json!({
                "status": "ok", "model": model_id, "backend": "rust",
            }))
            .unwrap(),
        );
    }
    if method == tiny_http::Method::Post && url.starts_with("/v1/systemone") {
        let mut body = String::new();
        if request.as_reader().read_to_string(&mut body).is_err() {
            return tiny_http::Response::from_string(error_body(
                "read error",
                "invalid_request_error",
                400,
            ))
            .with_status_code(400);
        }
        match complete(readout, &body, model_id, calibration) {
            Ok(text) => tiny_http::Response::from_string(text),
            Err((code, msg)) => {
                tiny_http::Response::from_string(error_body(&msg, "invalid_request_error", code))
                    .with_status_code(code)
            }
        }
    } else {
        tiny_http::Response::from_string(error_body(
            "not found",
            "not_found",
            404,
        ))
        .with_status_code(404)
    }
}

fn complete(
    readout: &Arc<Readout>,
    body: &str,
    model_id: &str,
    calibration: &Option<Calibration>,
) -> Result<String, (u16, String)> {
    let payload: Value = serde_json::from_str(body)
        .map_err(|e| (400u16, format!("invalid JSON: {e}")))?;
    let (state, questions) = parse_request(&payload).map_err(|e| (400, e))?;
    if questions.is_empty() {
        return Err((400, "no questions".to_string()));
    }
    if questions.len() > 64 {
        return Err((400, "too many questions (max 64)".to_string()));
    }

    // per-question isolation: one row per question
    let mut slot_logits = Vec::with_capacity(questions.len());
    let mut total_tokens = 0usize;
    for q in &questions {
        let mut qs = QuestionSet::default();
        qs.push(q.qid.clone(), q.question.clone());
        let prompt = build_prompt(&state, &qs, &Default::default());
        let (logits, tokens) = readout.slot_logits(&prompt);
        total_tokens += tokens;
        slot_logits.push(logits);
    }

    let default_cal = Calibration {
        per_primitive: Default::default(),
        per_dataset: Default::default(),
    };
    let cal = calibration.as_ref().unwrap_or(&default_cal);
    let temperatures: Vec<f32> = questions
        .iter()
        .map(|q| cal.temperature(&q.qtype, q.dataset.as_deref()))
        .collect();

    let question_set = {
        let mut qs = QuestionSet::default();
        for q in &questions {
            qs.push(q.qid.clone(), q.question.clone());
        }
        qs
    };
    let answers = read_answers_with_temps(
        &question_set,
        &slot_logits,
        &Default::default(),
        &temperatures,
    );

    let mut out = serde_json::Map::new();
    for (i, (qid, ans)) in answers.iter().enumerate() {
        out.insert(qid.clone(), answer_json(ans, temperatures[i]));
    }

    let created = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    Ok(serde_json::to_string(&json!({
        "id": format!("deem-{:032x}", created),
        "object": "systemone.completion",
        "created": created,
        "model": model_id,
        "answers": out,
        "usage": {"prompt_tokens": total_tokens, "completion_tokens": 0,
                  "total_tokens": total_tokens, "questions": questions.len()},
    }))
    .unwrap())
}

fn answer_json(ans: &Answer, temperature: f32) -> Value {
    match ans {
        Answer::Choice {
            choice,
            probabilities,
            confidence,
        } => {
            let probs: serde_json::Map<String, Value> = probabilities
                .iter()
                .map(|(k, v)| (k.clone(), json!(round5(*v))))
                .collect();
            json!({
                "type": "choice", "choice": choice,
                "probabilities": probs,
                "confidence": round5(*confidence),
                "temperature": temperature,
            })
        }
        Answer::Score {
            level,
            probabilities,
            expected,
            confidence,
        } => {
            let probs: serde_json::Map<String, Value> = probabilities
                .iter()
                .map(|(k, v)| (k.clone(), json!(round5(*v))))
                .collect();
            json!({
                "type": "score", "level": level,
                "probabilities": probs,
                "expected": round5(*expected),
                "confidence": round5(*confidence),
                "temperature": temperature,
            })
        }
        Answer::Noul { value, confidence } => json!({
            "type": "noul", "value": round5(*value),
            "confidence": round5(*confidence),
            "temperature": temperature,
        }),
    }
}

fn round5(v: f32) -> f32 {
    (v * 100000.0).round() / 100000.0
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn parse_request_object_form() {
        let body = json!({
            "state": "s",
            "questions": {
                "q1": {"type": "choice", "instructions": "pick",
                        "options": ["a", "b"]},
            },
        });
        let (_, questions) = parse_request(&body).unwrap();
        assert_eq!(questions.len(), 1);
        assert_eq!(questions[0].qid, "q1");
    }

    #[test]
    fn parse_request_list_form() {
        // The form used by the README quickstart and serve/deem_server.py.
        let body = json!({
            "state": "s",
            "questions": [
                {"id": "q1", "type": "noul", "instructions": "is it?"},
                {"qid": "q2", "type": "score", "instructions": "how much?",
                 "levels": ["low", "high"]},
            ],
        });
        let (_, questions) = parse_request(&body).unwrap();
        assert_eq!(questions.len(), 2);
        assert_eq!(questions[0].qid, "q1");
        assert_eq!(questions[0].qtype, "noul");
        assert_eq!(questions[1].qid, "q2");
        assert_eq!(questions[1].qtype, "score");
    }

    #[test]
    fn parse_request_list_form_requires_id() {
        let body = json!({
            "state": "s",
            "questions": [{"type": "noul", "instructions": "is it?"}],
        });
        assert!(parse_request(&body).is_err());
    }

    #[test]
    fn parse_request_rejects_scalar_questions() {
        let body = json!({"state": "s", "questions": "all of them"});
        assert!(parse_request(&body).is_err());
    }
}

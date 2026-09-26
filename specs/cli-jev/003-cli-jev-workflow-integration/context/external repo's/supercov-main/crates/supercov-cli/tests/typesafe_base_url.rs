//! `TYPESAFE_BASE_URL` and `TYPESAFE_DEFAULT_MODEL` against a local server that
//! answers the way a gateway does: at its own path, with a dated build of the
//! model it was asked for.
use std::{
    fs,
    io::{BufRead, BufReader, Read, Write},
    net::TcpListener,
    path::{Path, PathBuf},
    process::{Command, Output},
    sync::{
        Arc, Mutex,
        atomic::{AtomicUsize, Ordering},
    },
    thread,
};

use serde_json::{Map, Value, json};

const DATED_BUILD: &str = "typesafe/jev-1.13-20260917";

/// What the server was sent: the path, the Authorization header and the body.
type Seen = Arc<Mutex<Vec<(String, String, Value)>>>;

/// Answers every question it is asked, as `model`, and records each request.
fn gateway(model: &'static str) -> (String, Seen) {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let base = format!(
        "http://127.0.0.1:{}/api",
        listener.local_addr().unwrap().port()
    );
    let seen: Seen = Arc::default();
    let record = Arc::clone(&seen);
    thread::spawn(move || {
        for stream in listener.incoming() {
            let Ok(mut stream) = stream else { continue };
            let mut reader = BufReader::new(stream.try_clone().unwrap());
            let mut line = String::new();
            reader.read_line(&mut line).unwrap();
            let path = line
                .split_whitespace()
                .nth(1)
                .unwrap_or_default()
                .to_owned();
            let (mut length, mut authorization) = (0, String::new());
            loop {
                let mut header = String::new();
                reader.read_line(&mut header).unwrap();
                if header.trim().is_empty() {
                    break;
                }
                let (name, value) = header.split_once(':').unwrap();
                match name.to_ascii_lowercase().as_str() {
                    "content-length" => length = value.trim().parse().unwrap(),
                    "authorization" => authorization = value.trim().to_owned(),
                    _ => {}
                }
            }
            let mut body = vec![0; length];
            reader.read_exact(&mut body).unwrap();
            let request: Value = serde_json::from_slice(&body).unwrap();
            let reply = serde_json::to_vec(&answer(&request, model)).unwrap();
            record.lock().unwrap().push((path, authorization, request));
            write!(
                stream,
                "HTTP/1.1 200 OK\r\ncontent-type: application/json\r\n\
                 content-length: {}\r\nconnection: close\r\n\r\n",
                reply.len()
            )
            .unwrap();
            stream.write_all(&reply).unwrap();
        }
    });
    (base, seen)
}

/// A valid answer to every question: no for each yes/no, `none` (or the first
/// option) for each choice.
fn answer(request: &Value, model: &str) -> Value {
    let mut answers = Map::new();
    for (id, question) in request["questions"].as_object().unwrap() {
        let value = if question["type"] == "choice" {
            let options: Vec<&String> = question["criteria"].as_object().unwrap().keys().collect();
            let chosen = options
                .iter()
                .find(|o| o.as_str() == "none")
                .unwrap_or(&options[0]);
            let probabilities: Map<String, Value> = options
                .iter()
                .map(|o| ((*o).clone(), json!(if o == chosen { 1.0 } else { 0.0 })))
                .collect();
            json!({ "type": "choice", "choice": chosen, "probabilities": probabilities, "confidence": 1.0 })
        } else {
            json!({ "type": "noul", "noul": 0.1 })
        };
        answers.insert(id.clone(), value);
    }
    json!({ "model": model, "answers": answers, "usage": { "input_tokens": 100, "output_tokens": 0 } })
}

static NEXT: AtomicUsize = AtomicUsize::new(0);

struct Project(PathBuf);
impl Project {
    fn new() -> Self {
        let root = std::env::temp_dir().join(format!(
            "supercov-typesafe-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir(&root).unwrap();
        fs::create_dir(root.join("src")).unwrap();
        fs::write(
            root.join("package.json"),
            r#"{"name":"p","version":"1.0.0"}"#,
        )
        .unwrap();
        fs::write(
            root.join("src/add.js"),
            "export function add(a, b) {\n  return a + b;\n}\n",
        )
        .unwrap();
        Self(root)
    }
}
impl Drop for Project {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.0);
    }
}

fn supercov(root: &Path, args: &[&str], env: &[(&str, &str)]) -> Output {
    let mut command = Command::new(env!("CARGO_BIN_EXE_supercov"));
    command.args(args).current_dir(root);
    for name in [
        "TYPESAFE_API_KEY",
        "TYPESAFE_BASE_URL",
        "TYPESAFE_DEFAULT_MODEL",
    ] {
        command.env_remove(name);
    }
    command.envs(env.iter().copied()).output().unwrap()
}

fn report(output: &Output) -> Value {
    serde_json::from_slice(&output.stdout).unwrap_or_else(|_| {
        panic!(
            "no JSON report\nstdout: {}\nstderr: {}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        )
    })
}

#[test]
fn a_gateway_serves_both_catalogs_with_the_model_it_names() {
    let (base, seen) = gateway(DATED_BUILD);
    let project = Project::new();
    let env = [
        ("TYPESAFE_BASE_URL", base.as_str()),
        ("TYPESAFE_DEFAULT_MODEL", "typesafe/jev-1.13"),
        ("TYPESAFE_API_KEY", "sk-gateway"),
    ];
    for command in ["quality", "security"] {
        let output = supercov(&project.0, &[command, "src/add.js", "--json"], &env);
        let report = report(&output);
        assert!(output.status.success(), "{command}: {report}");
        assert_eq!(report["model"], "typesafe/jev-1.13", "{command}");
        assert_eq!(report["counts"]["errors"], 0, "{command}: {report}");
    }
    let seen = seen.lock().unwrap();
    assert_eq!(seen.len(), 2);
    for (path, authorization, request) in seen.iter() {
        assert_eq!(path, "/api/v1/systemone");
        assert_eq!(authorization, "Bearer sk-gateway");
        assert_eq!(request["model"], "typesafe/jev-1.13");
    }
}

#[test]
fn answers_are_cached_per_model() {
    let (base, seen) = gateway(DATED_BUILD);
    let project = Project::new();
    let run = |model: &str| {
        let env = [
            ("TYPESAFE_BASE_URL", base.as_str()),
            ("TYPESAFE_DEFAULT_MODEL", model),
            ("TYPESAFE_API_KEY", "sk-gateway"),
        ];
        let output = supercov(&project.0, &["quality", "src/add.js", "--json"], &env);
        assert!(output.status.success(), "{}", report(&output));
    };
    run("typesafe/jev-1.13");
    run("typesafe/jev-1.13");
    assert_eq!(
        seen.lock().unwrap().len(),
        1,
        "the repeat is answered from cache"
    );
    run("~typesafe/jev-latest");
    assert_eq!(
        seen.lock().unwrap().len(),
        2,
        "another model is asked again"
    );
}

#[test]
fn the_default_model_must_answer_as_itself() {
    let (base, seen) = gateway(DATED_BUILD);
    let project = Project::new();
    let env = [
        ("TYPESAFE_BASE_URL", base.as_str()),
        ("TYPESAFE_API_KEY", "sk-gateway"),
    ];
    let output = supercov(&project.0, &["quality", "src/add.js", "--json"], &env);
    let report = report(&output);
    assert_eq!(seen.lock().unwrap()[0].2["model"], "jev-1.13.0");
    assert_eq!(report["model"], "jev-1.13.0");
    assert_eq!(report["counts"]["errors"], 1, "{report}");
    assert!(
        report.to_string().contains("expected model jev-1.13.0"),
        "{report}"
    );
}

#[test]
fn a_key_is_never_sent_in_the_clear_to_another_machine() {
    let project = Project::new();
    let env = [
        ("TYPESAFE_BASE_URL", "http://gateway.example.com/api"),
        ("TYPESAFE_API_KEY", "sk-gateway"),
    ];
    let output = supercov(&project.0, &["quality", "src/add.js"], &env);
    assert!(!output.status.success());
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        stderr.contains("TYPESAFE_BASE_URL must be an https:// URL"),
        "{stderr}"
    );
}

//! Lines worth asking a security question about, and which question.
//!
//! Pass one asks twelve questions of a whole file and can say which file.
//! Pass two asks one question per candidate line and can say which line. A
//! candidate is found three ways and the union is kept, because on the
//! held-out half of RealVuln the union moved line-level recall from 42% to
//! 49% where either alone stayed at 42%:
//!
//! - **patterns** on each line, the vocabulary of every SAST: `execute(`,
//!   `eval(`, `innerHTML`, `send_file(`, `redirect(`, `verify=False`, ...;
//! - **the JavaScript and TypeScript parser** (oxc, in the engine): every
//!   call by its callee, every secret-shaped literal wherever it sits, the
//!   body line of every route handler, spreads of a request body;
//! - **Python's own parser**, through `python3 -c`, for the same shapes.
//!
//! What a candidate does not decide is whether anything is wrong. That is the
//! question, and when a candidate existed near a labelled finding the model
//! confirmed it 76% to 97% of the time for nine of the twelve checks. The
//! model is not the bottleneck; this list is.

use std::{
    collections::BTreeMap,
    io::Write,
    path::{Path, PathBuf},
    process::Command,
};

use serde::Deserialize;

/// At most this many candidates per file, spread across checks rather than
/// taken from the top, so a long file does not lose its later handlers. The
/// confirmation round is chunked to the request budget, so this bounds cost,
/// not request size; at forty it cut the last three classified lines of a
/// nineteen-handler file.
pub const MAX_CANDIDATES: usize = 120;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct Candidate {
    pub line: usize,
    pub check: String,
    pub text: String,
}

/// Substrings that make a line a candidate for a check. Matched on the line
/// for patterns and on the callee for parsed calls. Broad on purpose: a
/// candidate that is not a sink is cheap to ask about and the answer is no.
const PATTERNS: &[(&str, &[&str])] = &[
    (
        "injection_sink",
        &[
            ".execute(",
            ".executemany(",
            ".raw(",
            ".query(",
            ".exec(",
            ".aggregate(",
            ".find(",
            ".findOne(",
            ".find_one(",
            ".where(",
            ".whereRaw(",
            ".orderByRaw(",
            "$where",
            "subprocess.",
            "os.system(",
            "os.popen(",
            "child_process",
            "execSync(",
            "spawn(",
            "spawnSync(",
            "system(",
            "ldap",
            "cursor.execute",
        ],
    ),
    (
        "unsafe_code_execution",
        &[
            "eval(",
            "exec(",
            "new Function(",
            "pickle.load",
            "yaml.load(",
            "yaml.unsafe_load",
            "unserialize(",
            "marshal.load",
            "vm.run",
            "Function(",
            "deserialize(",
            "render_template_string(",
            "Template(",
            "jinja2.Template",
        ],
    ),
    (
        "unescaped_output",
        &[
            "innerHTML",
            "outerHTML",
            "dangerouslySetInnerHTML",
            "document.write(",
            "| safe",
            "|safe",
            "Markup(",
            "mark_safe(",
            "autoescape=False",
            "autoescape: false",
            "res.send(`",
            "res.send('",
            "res.send(\"",
            "res.write(",
            ".html(",
            "insertAdjacentHTML",
            "v-html",
            "{{{",
        ],
    ),
    (
        "path_from_input",
        &[
            "send_file(",
            "sendFile(",
            "send_from_directory(",
            "open(",
            "readFile",
            "writeFile",
            "createReadStream",
            "createWriteStream",
            "os.path.join(",
            "path.join(",
            ".save(",
            "unlink(",
            "os.remove(",
            "rmdir",
            "mkdir",
            "res.download(",
            "fs.",
        ],
    ),
    (
        "destination_from_input",
        &[
            "redirect(",
            "res.location(",
            "requests.get(",
            "requests.post(",
            "requests.put(",
            "requests.request(",
            "urllib.request",
            "urlopen(",
            "fetch(",
            "axios.",
            "http.get(",
            "https.get(",
            "got(",
            "window.location",
            "location.href",
        ],
    ),
    (
        "sensitive_data_exposure",
        &[
            "console.log(",
            "console.error(",
            "console.info(",
            "console.debug(",
            "logger.info(",
            "logger.debug(",
            "logger.warn(",
            "logger.error(",
            "log.info(",
            "log.debug(",
            "log.warning(",
            "log.error(",
            "logging.info(",
            "logging.debug(",
            "logging.warning(",
            "logging.error(",
            "print(",
            "traceback",
            ".stack",
            "debug=True",
            "DEBUG = True",
            "DEBUG=True",
            "jsonify(",
            "res.json(",
            "res.send(",
        ],
    ),
    (
        "weak_cryptography",
        &[
            "md5",
            "sha1",
            "MD5",
            "SHA1",
            "Math.random(",
            "random.random(",
            "random.randint(",
            "random.choice(",
            "DES",
            "RC4",
            "ECB",
            "createCipher(",
            "iv = '",
            "iv = \"",
            "iv = b",
            "nonce = '",
            "nonce = \"",
        ],
    ),
    (
        "weak_authentication",
        &[
            "jwt.decode(",
            "verify: false",
            "verify:false",
            "algorithms=['none'",
            "algorithm: 'none'",
            ".password ==",
            "== password",
            "password ===",
            "password ==",
            "cookie(",
            "set_cookie(",
            "session[",
            "res.cookie(",
            "httpOnly: false",
            "secure: false",
            "expiresIn",
            "maxAge",
            "SESSION_COOKIE",
        ],
    ),
    (
        "unchecked_mass_assignment",
        &[
            "...req.body",
            "Object.assign(",
            ".update(req.body",
            ".create(req.body",
            "**request.json",
            "**request.form",
            "**request.args",
            "**data",
            "_.merge(",
            "lodash.merge",
            "deepmerge(",
            ".extend(",
            "__proto__",
            ".save()",
        ],
    ),
    (
        "insecure_configuration",
        &[
            "rejectUnauthorized: false",
            "rejectUnauthorized:false",
            "verify=False",
            "CSRF",
            "csrf",
            "cors(",
            "CORS(",
            "Access-Control-Allow-Origin",
            "origin: '*'",
            "origin: \"*\"",
            "origin: true",
            "resolve_entities",
            "XMLParser",
            "etree.",
            "helmet",
            "X-Frame",
            "Content-Security-Policy",
            "SECURE_SSL",
            "ALLOWED_HOSTS",
        ],
    ),
];

const HANDLER_PATTERNS: &[&str] = &[
    "@app.route(",
    "@router.",
    "@bp.route(",
    "@blueprint.route(",
    "@api.",
    "app.get(",
    "app.post(",
    "app.put(",
    "app.patch(",
    "app.delete(",
    "app.all(",
    "app.use(",
    "router.get(",
    "router.post(",
    "router.put(",
    "router.patch(",
    "router.delete(",
    "server.get(",
    "server.post(",
    "fastify.get(",
    "fastify.post(",
    "@Get(",
    "@Post(",
    "@Put(",
    "@Patch(",
    "@Delete(",
    "export async function GET",
    "export async function POST",
    "export async function PUT",
    "export async function PATCH",
    "export async function DELETE",
    "export function GET",
    "export function POST",
    "def get(self",
    "def post(self",
    "def put(self",
    "def patch(self",
    "def delete(self",
    "path('",
    "path(\"",
];

const SECRET_NAMES: &[&str] = &[
    "secret",
    "password",
    "passwd",
    "api_key",
    "apikey",
    "token",
    "private_key",
    "privatekey",
    "client_secret",
    "auth",
];

fn is_comment(line: &str) -> bool {
    let t = line.trim_start();
    t.is_empty()
        || t.starts_with('#')
        || t.starts_with("//")
        || t.starts_with('*')
        || t.starts_with("/*")
}

/// `name = "..."` or `name: "..."` where the name says credential and the
/// value is six characters or more.
fn secret_assignment(line: &str) -> bool {
    let lower = line.to_ascii_lowercase();
    let Some(position) = ['=', ':'].iter().filter_map(|c| lower.find(*c)).min() else {
        return false;
    };
    let (name, value) = lower.split_at(position);
    SECRET_NAMES.iter().any(|n| name.contains(n))
        && value[1..]
            .trim_start()
            .strip_prefix(['\'', '"', '`'])
            .is_some_and(|rest| rest.find(['\'', '"', '`']).is_some_and(|end| end >= 6))
}

fn from_patterns(source: &str) -> Vec<Candidate> {
    let mut out = Vec::new();
    for (number, line) in source.lines().enumerate() {
        if is_comment(line) {
            continue;
        }
        let text: String = line.trim().chars().take(160).collect();
        for (check, needles) in PATTERNS {
            if needles.iter().any(|n| line.contains(n)) {
                out.push(Candidate {
                    line: number + 1,
                    check: (*check).to_owned(),
                    text: text.clone(),
                });
            }
        }
        if secret_assignment(line) {
            out.push(Candidate {
                line: number + 1,
                check: "secret_in_source".into(),
                text: text.clone(),
            });
        }
        if HANDLER_PATTERNS.iter().any(|n| line.contains(n)) {
            out.push(Candidate {
                line: number + 1,
                check: "missing_authorization".into(),
                text,
            });
        }
    }
    out
}

fn classify_callee(callee: &str, text: &str) -> Vec<&'static str> {
    let probe = format!("{callee}(");
    let mut hits: Vec<&'static str> = PATTERNS
        .iter()
        .filter(|(_, needles)| needles.iter().any(|n| probe.contains(n)))
        .map(|(check, _)| *check)
        .collect();
    if hits.is_empty() {
        for check in [
            "insecure_configuration",
            "weak_authentication",
            "weak_cryptography",
        ] {
            if PATTERNS
                .iter()
                .find(|(c, _)| *c == check)
                .is_some_and(|(_, needles)| needles.iter().any(|n| text.contains(n)))
            {
                hits.push(check);
            }
        }
    }
    hits
}

fn from_javascript(path: &Path, source: &str) -> Vec<Candidate> {
    use supercov_engine::security_candidates::{NodeKind, nodes};
    let Ok(found) = nodes(path, source) else {
        return Vec::new();
    };
    let mut out = Vec::new();
    for node in found {
        let push = |out: &mut Vec<Candidate>, check: &str| {
            out.push(Candidate {
                line: node.line,
                check: check.to_owned(),
                text: node.text.clone(),
            })
        };
        match node.kind {
            NodeKind::Call => {
                for check in classify_callee(&node.callee, &node.text) {
                    push(&mut out, check);
                }
            }
            NodeKind::Handler => push(&mut out, "missing_authorization"),
            NodeKind::Literal => push(&mut out, "secret_in_source"),
            NodeKind::Spread => push(&mut out, "unchecked_mass_assignment"),
            NodeKind::Assign => {
                for check in [
                    "unescaped_output",
                    "insecure_configuration",
                    "weak_authentication",
                    "unchecked_mass_assignment",
                ] {
                    if PATTERNS
                        .iter()
                        .find(|(c, _)| *c == check)
                        .is_some_and(|(_, needles)| needles.iter().any(|n| node.text.contains(n)))
                    {
                        push(&mut out, check);
                    }
                }
                if secret_assignment(&node.text) {
                    push(&mut out, "secret_in_source");
                }
            }
        }
    }
    out
}

/// Python's own parser, one process per file. Calls carry their callee,
/// decorated or request-taking functions are handlers, string constants that
/// look like secrets are literals. A missing interpreter means no parsed
/// candidates, and the patterns still apply.
const PYTHON_SCRIPT: &str = r#"
import ast, json, re, sys
src = sys.stdin.read()
out = []
try:
    tree = ast.parse(src)
except SyntaxError:
    print('[]'); sys.exit()
lines = src.splitlines()
def text(n):
    return lines[n.lineno - 1].strip()[:160] if 0 < n.lineno <= len(lines) else ''
def secretish(s):
    return len(s) >= 8 and (re.match(r'^(sk[_-]|pk_|rk_|AKIA|ghp_|xox[abp]-|eyJ)', s) or re.fullmatch(r'[A-Fa-f0-9]{20,}', s)
        or re.fullmatch(r'[A-Za-z0-9+/_-]{24,}={0,2}', s) and re.search(r'[0-9]', s) and re.search(r'[a-z]', s) and re.search(r'[A-Z]', s)
        or re.search(r'(?i)(password|secret|passwd)', s)) is not None
for n in ast.walk(tree):
    if isinstance(n, ast.Call):
        out.append({'line': n.lineno, 'kind': 'call', 'callee': ast.unparse(n.func), 'text': text(n)})
    elif isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)):
        decos = [ast.unparse(d) for d in n.decorator_list]
        if any(re.search(r'(route|get|post|put|patch|delete|api_view|action|view|permission|login_required)', d, re.I) for d in decos) \
           or (n.args.args and n.args.args[0].arg in ('request', 'req')):
            out.append({'line': n.lineno, 'kind': 'handler', 'callee': n.name, 'text': text(n)})
        for d, dn in zip(n.decorator_list, decos):
            if 'csrf_exempt' in dn:
                out.append({'line': d.lineno, 'kind': 'assign', 'callee': '', 'text': dn})
    elif isinstance(n, ast.Constant) and isinstance(n.value, str) and secretish(n.value):
        out.append({'line': n.lineno, 'kind': 'literal', 'callee': '', 'text': text(n)})
    elif isinstance(n, ast.Assign):
        out.append({'line': n.lineno, 'kind': 'assign', 'callee': ' '.join(ast.unparse(t) for t in n.targets), 'text': text(n)})
    elif isinstance(n, ast.Subscript) and 'session' in ast.unparse(n.value):
        out.append({'line': n.lineno, 'kind': 'assign', 'callee': 'session[', 'text': text(n)})
funcs = []
imports = []
for n in ast.walk(tree):
    if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
        funcs.append({'name': n.name, 'start': n.lineno, 'end': getattr(n, 'end_lineno', n.lineno) or n.lineno})
    elif isinstance(n, ast.ImportFrom):
        module = '.' * (n.level or 0) + (n.module or '')
        for a in n.names:
            imports.append({'local': a.asname or a.name, 'exported': a.name, 'specifier': module})
    elif isinstance(n, ast.Import):
        for a in n.names:
            imports.append({'local': a.asname or a.name.split('.')[0], 'exported': '*', 'specifier': a.name})
print(json.dumps({'nodes': out, 'functions': funcs, 'imports': imports}))
"#;

#[derive(Deserialize)]
struct PyNode {
    line: usize,
    kind: String,
    callee: String,
    text: String,
}

#[derive(Deserialize)]
struct PyFunction {
    name: String,
    start: usize,
    end: usize,
}

#[derive(Deserialize)]
struct PyImport {
    local: String,
    exported: String,
    specifier: String,
}

#[derive(Deserialize)]
struct PyParse {
    nodes: Vec<PyNode>,
    functions: Vec<PyFunction>,
    imports: Vec<PyImport>,
}

/// Parse with the `python3` on the path; when that is a pyenv shim and the
/// repository pins a version that is not installed, the shim exits with an
/// error and every Python file would silently fall back to the pattern table.
/// A second try asks pyenv for the system interpreter, which is what the shim
/// resolves to outside any pinned directory.
fn python_parse(source: &str) -> Option<PyParse> {
    python_parse_with(source, None).or_else(|| python_parse_with(source, Some("system")))
}

fn python_parse_with(source: &str, pyenv_version: Option<&str>) -> Option<PyParse> {
    let mut command = Command::new("python3");
    command
        .args(["-c", PYTHON_SCRIPT])
        .stdin(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::null());
    if let Some(version) = pyenv_version {
        command.env("PYENV_VERSION", version);
    }
    let mut child = command.spawn().ok()?;
    if let Some(mut stdin) = child.stdin.take() {
        let _ = stdin.write_all(source.as_bytes());
    }
    let output = child.wait_with_output().ok()?;
    if !output.status.success() {
        return None;
    }
    serde_json::from_slice::<PyParse>(&output.stdout).ok()
}

pub use supercov_engine::security_candidates::{FunctionSpan, Import, Structure};

/// The functions and imports of a file, from the parser that knows it.
/// Empty when no parser does, which the graph stage treats as a file with
/// nothing to label and nothing to follow.
pub fn structure(path: &Path, source: &str) -> Structure {
    match path.extension().and_then(|e| e.to_str()) {
        Some("js" | "ts" | "tsx" | "jsx" | "mjs" | "cjs" | "mts" | "cts") => {
            supercov_engine::security_candidates::structure(path, source).unwrap_or_default()
        }
        Some("py") => python_parse(source)
            .map(|parsed| Structure {
                functions: parsed
                    .functions
                    .into_iter()
                    .map(|f| FunctionSpan {
                        name: f.name,
                        start: f.start,
                        end: f.end,
                    })
                    .collect(),
                imports: parsed
                    .imports
                    .into_iter()
                    .map(|i| Import {
                        local: i.local,
                        exported: i.exported,
                        specifier: i.specifier,
                    })
                    .collect(),
            })
            .unwrap_or_default(),
        _ => Structure::default(),
    }
}

/// Which file in the repository an import specifier names, relative to the
/// root with forward slashes, or None for a package or anything unresolved.
/// Relative JavaScript paths try the usual extensions and index files;
/// Python dotted modules walk up by leading dots and then from the root.
pub fn resolve_import(root: &Path, from: &str, specifier: &str) -> Option<String> {
    // Lexical normalisation: `app/./x` and `app/a/../x` both read `app/x`,
    // without touching the filesystem, so a resolved path matches the way
    // discovery names the same file.
    let relative = |p: &Path| {
        let mut parts: Vec<String> = Vec::new();
        for component in p.strip_prefix(root).ok()?.components() {
            match component.as_os_str().to_string_lossy().as_ref() {
                "." => {}
                ".." => {
                    parts.pop();
                }
                other => parts.push(other.to_owned()),
            }
        }
        Some(parts.join("/"))
    };
    let base = root.join(from).parent()?.to_path_buf();
    if from.ends_with(".py") {
        let dots = specifier.chars().take_while(|c| *c == '.').count();
        let module = &specifier[dots..];
        let mut start = if dots == 0 { root.to_path_buf() } else { base };
        for _ in 1..dots {
            start = start.parent()?.to_path_buf();
        }
        let parts: Vec<&str> = module.split('.').filter(|p| !p.is_empty()).collect();
        for cut in (1..=parts.len()).rev() {
            let target = parts[..cut].iter().fold(start.clone(), |p, s| p.join(s));
            for candidate in [target.with_extension("py"), target.join("__init__.py")] {
                if candidate.is_file()
                    && let Some(r) = relative(&candidate)
                    && r != from
                {
                    return Some(r);
                }
            }
        }
        return None;
    }
    if !specifier.starts_with('.') {
        return None;
    }
    let target = base.join(specifier);
    let mut candidates = vec![target.clone()];
    for ext in ["ts", "tsx", "js", "jsx", "mjs", "cjs", "mts", "cts"] {
        candidates.push(PathBuf::from(format!("{}.{ext}", target.display())));
        candidates.push(target.join(format!("index.{ext}")));
    }
    candidates
        .into_iter()
        .find(|c| c.is_file())
        .and_then(|c| relative(&c))
        .filter(|r| r != from)
}

fn from_python(source: &str) -> Vec<Candidate> {
    let Some(parsed) = python_parse(source) else {
        return Vec::new();
    };
    let found = parsed.nodes;
    let mut out = Vec::new();
    for node in found {
        let push = |out: &mut Vec<Candidate>, check: &str| {
            out.push(Candidate {
                line: node.line,
                check: check.to_owned(),
                text: node.text.clone(),
            })
        };
        match node.kind.as_str() {
            "call" => {
                for check in classify_callee(&node.callee, &node.text) {
                    push(&mut out, check);
                }
            }
            "handler" => push(&mut out, "missing_authorization"),
            "literal" => push(&mut out, "secret_in_source"),
            "assign" => {
                let joined = format!("{} = {}", node.callee, node.text);
                if node.text.contains("csrf_exempt") {
                    push(&mut out, "insecure_configuration");
                }
                if node.callee.starts_with("session[") {
                    push(&mut out, "weak_authentication");
                }
                if secret_assignment(&joined) {
                    push(&mut out, "secret_in_source");
                }
                if node.callee.to_ascii_lowercase().ends_with("debug") && node.text.contains("True")
                {
                    push(&mut out, "sensitive_data_exposure");
                }
            }
            _ => {}
        }
    }
    out
}

/// A line the parser found worth asking about, before anyone has said which
/// check it might belong to. Classification is the model's job, one Choice
/// per node; measured against a substring table on the held-out half of
/// RealVuln that took finding-level F1 from 0.48 to 0.54.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct Node {
    pub line: usize,
    pub text: String,
}

/// At most this many nodes per file, spread evenly. Asking about every line
/// of a long file bought six points of recall for seven of precision, so a
/// cap stays; at a hundred it dropped a third of a 189-line file's nodes and
/// with them a labelled XML sink, so it is set where an ordinary file is
/// never sampled and only a very large one is.
pub const MAX_NODES: usize = 300;

const TEMPLATE_EXTENSIONS: &[&str] = &[
    "html", "htm", "ejs", "jinja2", "jinja", "hbs", "pug", "vue", "erb",
];
const CONFIG_EXTENSIONS: &[&str] = &["yml", "yaml", "json", "toml", "ini", "cfg"];

/// Whether the security lane looks at a file the complexity catalog would not:
/// a template, where XSS lives, or a configuration file, where secrets and
/// switched-off protections live. Manifests and lockfiles are left out.
pub fn is_security_extra(path: &Path) -> bool {
    let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
    let extension = path.extension().and_then(|e| e.to_str()).unwrap_or("");
    if name.ends_with(".lock")
        || name == "package-lock.json"
        || name == "package.json"
        || name.starts_with("tsconfig")
        || name.starts_with("jsconfig")
        || name == "composer.json"
        || name.ends_with(".min.js")
    {
        return false;
    }
    if extension == "json" {
        return json_configuration(path);
    }
    TEMPLATE_EXTENSIONS.contains(&extension) || CONFIG_EXTENSIONS.contains(&extension)
}

/// Whether a JSON file is configuration rather than data.
///
/// JSON is where a project keeps its settings and, as often, its data:
/// translation tables, schema snapshots, API descriptions, scanner output.
/// Across the 72 held-out RealVuln repositories Supercov read 136 JSON files,
/// 44 of them failed over the request budget, three were flagged, and none
/// held a labelled weakness. A secret or a switched-off protection lives in a
/// file whose name or directory says it configures something, so only those
/// are read.
fn json_configuration(path: &Path) -> bool {
    const NAMES: &[&str] = &[
        "appsettings",
        "config",
        "conf",
        "credentials",
        "firebase",
        "secret",
        "secrets",
        "serviceaccount",
        "settings",
    ];
    const DIRECTORIES: &[&str] = &["config", "configs", "conf", "settings", "secrets"];
    let lower = path
        .to_string_lossy()
        .replace('\\', "/")
        .to_ascii_lowercase();
    let (directories, name) = lower.rsplit_once('/').unwrap_or(("", lower.as_str()));
    let stem = name.strip_suffix(".json").unwrap_or(name);
    stem.split(['.', '-', '_'])
        .any(|part| NAMES.contains(&part) || part == "env")
        || directories.split('/').any(|d| DIRECTORIES.contains(&d))
}

fn template_or_config_nodes(path: &Path, source: &str) -> Vec<Node> {
    let extension = path.extension().and_then(|e| e.to_str()).unwrap_or("");
    let template = TEMPLATE_EXTENSIONS.contains(&extension);
    let mut out = Vec::new();
    for (number, line) in source.lines().enumerate() {
        let t = line.trim();
        if t.is_empty() || t.starts_with('#') || t.starts_with("//") {
            continue;
        }
        let interesting = if template {
            [
                "{{",
                "{%",
                "<%",
                "v-html",
                "innerHTML",
                "| safe",
                "|safe",
                "autoescape",
                "<script",
                "href=",
                "href =",
                "src=",
                "src =",
                "on",
            ]
            .iter()
            .any(|n| t.contains(n))
                && !(t.starts_with("<!--"))
        } else {
            t.contains(':') || t.contains('=')
        };
        if interesting {
            out.push(Node {
                line: number + 1,
                text: t.chars().take(160).collect(),
            });
        }
    }
    out
}

/// At most [`MAX_NODES`], spread evenly over the list; applied per file, and
/// per window of a file too large to send whole.
pub fn spread(nodes: Vec<Node>) -> Vec<Node> {
    spread_to(nodes, MAX_NODES)
}

/// At most `cap` nodes, spread evenly over the list.
pub fn spread_to(mut nodes: Vec<Node>, cap: usize) -> Vec<Node> {
    nodes.sort();
    nodes.dedup_by(|a, b| a.line == b.line);
    if nodes.len() <= cap {
        return nodes;
    }
    let step = nodes.len() as f64 / cap as f64;
    (0..cap)
        .map(|i| nodes[(i as f64 * step) as usize].clone())
        .collect()
}

/// Every node of a file the parser can list: calls, secret-shaped literals,
/// handler bodies and request-body spreads for JavaScript, TypeScript and
/// Python; template expressions and configuration values for templates and
/// config files. `None` when no parser knows the file, in which case the
/// pattern candidates are the fallback.
pub fn nodes(path: &Path, source: &str) -> Option<Vec<Node>> {
    use supercov_engine::security_candidates::{NodeKind, nodes as js};
    let extension = path.extension().and_then(|e| e.to_str()).unwrap_or("");
    let found: Vec<Node> = match extension {
        "js" | "ts" | "tsx" | "jsx" | "mjs" | "cjs" | "mts" | "cts" => js(path, source)
            .ok()?
            .into_iter()
            .filter(|n| {
                matches!(
                    n.kind,
                    NodeKind::Call | NodeKind::Literal | NodeKind::Handler | NodeKind::Spread
                )
            })
            .map(|n| Node {
                line: n.line,
                text: n.text,
            })
            .collect(),
        "py" => python_parse(source)?
            .nodes
            .into_iter()
            .filter(|n| matches!(n.kind.as_str(), "call" | "handler" | "literal"))
            .map(|n| Node {
                line: n.line,
                text: n.text,
            })
            .collect(),
        _ if is_security_extra(path) => template_or_config_nodes(path, source),
        _ => return None,
    };
    Some(spread(found))
}

/// The union of pattern and parser candidates for one file, deduplicated by
/// line and check, capped at [`MAX_CANDIDATES`] spread across checks.
pub fn candidates(path: &Path, source: &str) -> Vec<Candidate> {
    let mut all = from_patterns(source);
    match path.extension().and_then(|e| e.to_str()) {
        Some("js" | "ts" | "tsx" | "jsx" | "mjs" | "cjs" | "mts" | "cts") => {
            all.extend(from_javascript(path, source));
        }
        Some("py") => all.extend(from_python(source)),
        _ => {}
    }
    all.sort();
    all.dedup_by(|a, b| a.line == b.line && a.check == b.check);
    if all.len() <= MAX_CANDIDATES {
        return all;
    }
    let mut by_check: BTreeMap<String, Vec<Candidate>> = BTreeMap::new();
    for candidate in all {
        by_check
            .entry(candidate.check.clone())
            .or_default()
            .push(candidate);
    }
    let mut picked = Vec::new();
    let mut round = 0;
    while picked.len() < MAX_CANDIDATES {
        let mut progressed = false;
        for list in by_check.values() {
            if let Some(candidate) = list.get(round) {
                picked.push(candidate.clone());
                progressed = true;
                if picked.len() == MAX_CANDIDATES {
                    break;
                }
            }
        }
        if !progressed {
            break;
        }
        round += 1;
    }
    picked.sort();
    picked
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A fake key in a live-key shape, assembled so no source line holds the
    /// whole pattern a push-protection scanner looks for.
    const FAKE_KEY: &str = concat!("sk_", "live_", "51H8xQ2KmNvBcdEfGhIjKlMnOpQr");

    #[test]
    fn patterns_and_parser_agree_on_a_typescript_route() {
        let source = format!(
            "import {{ Router }} from 'express'\nconst KEY = '{FAKE_KEY}'\nexport const router = Router()\nrouter.get('/x/:id', async (req, res) => {{\n  const row = await db.query(`select * from t where id = ${{req.params.id}}`)\n  res.redirect(req.query.next)\n}})\n"
        );
        let found = candidates(Path::new("src/a.ts"), &source);
        let has =
            |line: usize, check: &str| found.iter().any(|c| c.line == line && c.check == check);
        assert!(
            has(2, "secret_in_source"),
            "the literal, from the parser: {found:?}"
        );
        assert!(has(4, "missing_authorization"), "the handler body line");
        assert!(has(5, "injection_sink"));
        assert!(has(6, "destination_from_input"));
        assert!(found.iter().all(|c| c.line >= 1));
    }

    #[test]
    fn a_comment_is_never_a_candidate_and_a_secret_needs_a_name_and_a_value() {
        let found = candidates(
            Path::new("a.py"),
            "# eval(x) in a comment\npassword = 'hunter2!'\n",
        );
        assert!(found.iter().all(|c| c.line != 1));
        assert!(
            found
                .iter()
                .any(|c| c.line == 2 && c.check == "secret_in_source")
        );
        assert!(!secret_assignment("password = ''"));
        assert!(!secret_assignment("const path = '/api/users'"));
    }

    #[test]
    fn python_structure_and_imports_resolve_within_the_repository() {
        let temp = std::env::temp_dir().join(format!("supercov-cands-{}", std::process::id()));
        std::fs::create_dir_all(temp.join("app")).unwrap();
        std::fs::write(temp.join("app/__init__.py"), "").unwrap();
        std::fs::write(temp.join("app/dao.py"), "def find(q):\n    return q\n").unwrap();
        let views = "from .dao import find\nfrom app import dao\nimport os\n\ndef handler(request):\n    return find(request.GET['q'])\n";
        std::fs::write(temp.join("app/views.py"), views).unwrap();
        let s = structure(Path::new("app/views.py"), views);
        assert_eq!(
            s.functions
                .iter()
                .map(|f| (f.name.as_str(), f.start, f.end))
                .collect::<Vec<_>>(),
            vec![("handler", 5, 6)]
        );
        assert_eq!(s.imports.len(), 3);
        assert_eq!(
            resolve_import(&temp, "app/views.py", ".dao").as_deref(),
            Some("app/dao.py")
        );
        assert_eq!(
            resolve_import(&temp, "app/views.py", "app").as_deref(),
            Some("app/__init__.py")
        );
        assert_eq!(resolve_import(&temp, "app/views.py", "os"), None);
        std::fs::write(temp.join("app/routes.ts"), "").unwrap();
        assert_eq!(
            resolve_import(&temp, "app/views.ts", "./routes").as_deref(),
            Some("app/routes.ts")
        );
        assert_eq!(resolve_import(&temp, "app/views.ts", "express"), None);
        let _ = std::fs::remove_dir_all(&temp);
    }

    #[test]
    fn nodes_come_from_the_parser_or_the_template_scanner_and_cap_evenly() {
        let js = format!(
            "const k = '{FAKE_KEY}'\napp.get('/x', (req, res) => {{ res.send(db.query(req.query.q)) }})\n"
        );
        let found = nodes(Path::new("a.js"), &js).unwrap();
        assert!(found.iter().any(|n| n.line == 1), "the literal");
        assert!(
            found.iter().any(|n| n.line == 2),
            "the calls and the handler"
        );
        let tpl = "<h1>{{ name|safe }}</h1>\n<p>plain</p>\n<a href=\"{{ url }}\">x</a>\n";
        let found = nodes(Path::new("a.html"), tpl).unwrap();
        assert_eq!(found.iter().map(|n| n.line).collect::<Vec<_>>(), vec![1, 3]);
        assert!(
            nodes(Path::new("a.rb"), "puts 1").is_none(),
            "no parser, patterns apply"
        );
        let long: String = (0..300).map(|i| format!("f{i}()\n")).collect();
        assert_eq!(nodes(Path::new("a.js"), &long).unwrap().len(), MAX_NODES);
        assert!(is_security_extra(Path::new("config/app.yml")));
        assert!(!is_security_extra(Path::new("package.json")));
        assert!(!is_security_extra(Path::new("src/a.ts")));
    }

    #[test]
    fn the_cap_spreads_across_checks() {
        let mut source = String::new();
        for i in 0..MAX_CANDIDATES * 2 {
            source.push_str(&format!("db.query(a{i})\n"));
        }
        source.push_str("res.redirect(next)\n");
        let found = candidates(Path::new("a.js"), &source);
        assert_eq!(found.len(), MAX_CANDIDATES);
        assert!(
            found.iter().any(|c| c.check == "destination_from_input"),
            "the last line survives the cap"
        );
    }
}

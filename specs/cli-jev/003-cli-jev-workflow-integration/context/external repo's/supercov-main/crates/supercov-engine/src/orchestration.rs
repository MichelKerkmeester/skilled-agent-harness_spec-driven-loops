//! Language-neutral execution plans over the Rust process supervisor.
//!
//! Frontends prepare instrumentation and runtime shims, then provide explicit
//! commands. This layer owns ordering, fail-fast behavior, timings and the
//! single persistent signal guard across every external phase.

use std::{
    fs::{self, File},
    io::{Read, Seek, SeekFrom, Write},
    path::Path,
    time::Instant,
};

use serde::{Deserialize, Serialize};

use crate::process_supervision::{
    CommandSpec, ForwardedSignal, ProcessSupervisor, SupervisedResult, SupervisionError,
    SupervisionOptions,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PhaseKind {
    Frontend,
    Build,
    Test,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ExecutionPhase {
    pub name: String,
    pub kind: PhaseKind,
    pub command: CommandSpec,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ExecutionPlan {
    pub preparation: Vec<ExecutionPhase>,
    pub test: ExecutionPhase,
}

#[derive(Debug)]
pub enum OrchestrationError {
    InvalidPlan(String),
    PhaseSetup { phase: String, reason: String },
    Supervision(SupervisionError),
}

impl std::fmt::Display for OrchestrationError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::InvalidPlan(reason) => write!(formatter, "invalid execution plan: {reason}"),
            Self::PhaseSetup { phase, reason } => {
                write!(formatter, "could not prepare {phase} phase: {reason}")
            }
            Self::Supervision(error) => write!(formatter, "{error}"),
        }
    }
}

impl std::error::Error for OrchestrationError {}

impl From<SupervisionError> for OrchestrationError {
    fn from(value: SupervisionError) -> Self {
        Self::Supervision(value)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhaseExecution {
    pub name: String,
    pub kind: PhaseKind,
    pub duration_ms: u64,
    pub result: SupervisedResult,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExecutionResult {
    pub phases: Vec<PhaseExecution>,
    pub exit_code: i32,
    pub interrupted_signal: Option<ForwardedSignal>,
}

fn duration_milliseconds(started: Instant) -> u64 {
    u64::try_from(started.elapsed().as_millis()).unwrap_or(u64::MAX)
}

const CAPTURED_OUTPUT_LIMIT: u64 = 1024 * 1024;

fn verbose_output() -> bool {
    std::env::var("SUPERCOV_VERBOSE")
        .or_else(|_| std::env::var("SUPERCOV_DEBUG"))
        .is_ok_and(|value| matches!(value.as_str(), "1" | "true" | "yes"))
}

fn publish_captured_output(path: &Path, phase: &str, failed: bool, writer: &mut dyn Write) {
    if failed || verbose_output() {
        let result = (|| -> std::io::Result<()> {
            let mut file = File::open(path)?;
            let length = file.metadata()?.len();
            if length > CAPTURED_OUTPUT_LIMIT {
                file.seek(SeekFrom::End(-(CAPTURED_OUTPUT_LIMIT as i64)))?;
                writeln!(
                    writer,
                    "[supercov] {phase} output truncated to the final {} bytes",
                    CAPTURED_OUTPUT_LIMIT
                )?;
            }
            let mut buffer = Vec::with_capacity(length.min(CAPTURED_OUTPUT_LIMIT) as usize);
            file.read_to_end(&mut buffer)?;
            writer.write_all(&buffer)?;
            writer.flush()
        })();
        if let Err(error) = result {
            let _ = writeln!(writer, "[supercov] could not read {phase} output: {error}");
        }
    }
    let _ = fs::remove_file(path);
}

fn validate(plan: &ExecutionPlan) -> Result<(), OrchestrationError> {
    if plan.test.kind != PhaseKind::Test {
        return Err(OrchestrationError::InvalidPlan(
            "the terminal command must be a test phase".into(),
        ));
    }
    if plan.test.name.trim().is_empty() {
        return Err(OrchestrationError::InvalidPlan(
            "phase names must not be empty".into(),
        ));
    }
    for phase in &plan.preparation {
        if phase.kind == PhaseKind::Test {
            return Err(OrchestrationError::InvalidPlan(
                "a test phase cannot appear before the terminal test command".into(),
            ));
        }
        if phase.name.trim().is_empty() {
            return Err(OrchestrationError::InvalidPlan(
                "phase names must not be empty".into(),
            ));
        }
    }
    Ok(())
}

pub fn execute_plan(
    plan: &ExecutionPlan,
    options: SupervisionOptions,
    writer: &mut dyn Write,
    before_phase: impl FnMut(&ExecutionPhase, &mut dyn Write) -> Result<(), OrchestrationError>,
) -> Result<ExecutionResult, OrchestrationError> {
    let supervisor = ProcessSupervisor::new()?;
    execute_plan_with_supervisor(&supervisor, plan, options, writer, before_phase)
}

pub fn execute_plan_with_supervisor(
    supervisor: &ProcessSupervisor,
    plan: &ExecutionPlan,
    options: SupervisionOptions,
    writer: &mut dyn Write,
    mut before_phase: impl FnMut(&ExecutionPhase, &mut dyn Write) -> Result<(), OrchestrationError>,
) -> Result<ExecutionResult, OrchestrationError> {
    validate(plan)?;
    // One guard spans every external phase. Signals received after a build
    // exits but before the test spawns remain pending and prevent that spawn.
    let mut executions = Vec::new();
    for phase in plan.preparation.iter().chain(std::iter::once(&plan.test)) {
        before_phase(phase, writer)?;
        let started = Instant::now();
        let result = match supervisor.supervise(&phase.command, options, writer) {
            Ok(result) => result,
            Err(error) => {
                if let Some(path) = &phase.command.captured_output {
                    publish_captured_output(path, &phase.name, true, writer);
                }
                return Err(error.into());
            }
        };
        let exit_code = result.exit_code();
        if let Some(path) = &phase.command.captured_output {
            publish_captured_output(path, &phase.name, exit_code != 0, writer);
        }
        let interrupted_signal = result.interrupted_signal;
        executions.push(PhaseExecution {
            name: phase.name.clone(),
            kind: phase.kind,
            duration_ms: duration_milliseconds(started),
            result,
        });
        if exit_code != 0 {
            return Ok(ExecutionResult {
                phases: executions,
                exit_code,
                interrupted_signal,
            });
        }
    }
    Ok(ExecutionResult {
        phases: executions,
        exit_code: 0,
        interrupted_signal: None,
    })
}

#[cfg(test)]
mod tests {
    use std::{
        ffi::OsString,
        fs,
        path::{Path, PathBuf},
        sync::atomic::{AtomicU64, Ordering},
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::*;

    fn temporary() -> PathBuf {
        // The clock ticks once per microsecond, so four tests that start
        // together were drawing the same directory: one test read another's
        // `successful.log` and another's command exited nonzero because its
        // script had just been deleted by a neighbour's cleanup. The counter is
        // what makes each name its own, and `create_dir` -- not
        // `create_dir_all` -- means a repeat is a failure here rather than a
        // mystery somewhere else.
        static UNIQUE: AtomicU64 = AtomicU64::new(0);
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let path = std::env::temp_dir().join(format!(
            "supercov-orchestration-{}-{nonce}-{}",
            std::process::id(),
            UNIQUE.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir(&path).unwrap();
        path
    }

    fn shell(root: &Path, name: &str, script: &str) -> ExecutionPhase {
        ExecutionPhase {
            name: name.into(),
            kind: if name == "test" {
                PhaseKind::Test
            } else {
                PhaseKind::Build
            },
            command: CommandSpec {
                program: OsString::from("/bin/sh"),
                arguments: vec![OsString::from("-c"), OsString::from(script)],
                cwd: root.into(),
                environment: None,
                captured_output: None,
            },
        }
    }

    #[cfg(unix)]
    #[test]
    fn executes_build_then_test_and_reports_each_result() {
        let root = temporary();
        let order = root.join("order");
        let plan = ExecutionPlan {
            preparation: vec![shell(&root, "build", "printf build > order")],
            test: shell(&root, "test", "printf -- '-test' >> order"),
        };
        let mut seen = Vec::new();
        let result = execute_plan(
            &plan,
            SupervisionOptions::default(),
            &mut Vec::new(),
            |phase, _| {
                seen.push(phase.kind);
                Ok(())
            },
        )
        .unwrap();
        assert_eq!(result.exit_code, 0);
        assert_eq!(seen, [PhaseKind::Build, PhaseKind::Test]);
        assert_eq!(fs::read_to_string(order).unwrap(), "build-test");
        assert_eq!(result.phases.len(), 2);
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn a_failed_build_never_starts_the_test() {
        let root = temporary();
        let plan = ExecutionPlan {
            preparation: vec![shell(&root, "build", "exit 7")],
            test: shell(&root, "test", "touch incorrectly-started"),
        };
        let result = execute_plan(
            &plan,
            SupervisionOptions::default(),
            &mut Vec::new(),
            |_, _| Ok(()),
        )
        .unwrap();
        assert_eq!(result.exit_code, 7);
        assert_eq!(result.phases.len(), 1);
        assert!(!root.join("incorrectly-started").exists());
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn rejects_an_ambiguous_or_nonterminal_test_plan_before_spawning() {
        let root = temporary();
        let mut invalid_test = shell(&root, "test", "touch incorrectly-started");
        invalid_test.kind = PhaseKind::Build;
        let plan = ExecutionPlan {
            preparation: Vec::new(),
            test: invalid_test,
        };
        let result = execute_plan(
            &plan,
            SupervisionOptions::default(),
            &mut Vec::new(),
            |_, _| Ok(()),
        );
        assert!(matches!(result, Err(OrchestrationError::InvalidPlan(_))));
        assert!(!root.join("incorrectly-started").exists());
        fs::remove_dir_all(root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn successful_preparation_is_quiet_but_failed_output_is_retained() {
        let root = temporary();
        let successful_log = root.join("successful.log");
        let mut successful = shell(&root, "build", "printf noisy-success");
        successful.command.captured_output = Some(successful_log.clone());
        let mut writer = Vec::new();
        let result = execute_plan(
            &ExecutionPlan {
                preparation: vec![successful],
                test: shell(&root, "test", "exit 0"),
            },
            SupervisionOptions::default(),
            &mut writer,
            |_, _| Ok(()),
        )
        .unwrap();
        assert_eq!(result.exit_code, 0);
        assert!(writer.is_empty());
        assert!(!successful_log.exists());

        let failed_log = root.join("failed.log");
        let mut failed = shell(&root, "build", "printf useful-failure; exit 7");
        failed.command.captured_output = Some(failed_log.clone());
        let result = execute_plan(
            &ExecutionPlan {
                preparation: vec![failed],
                test: shell(&root, "test", "exit 0"),
            },
            SupervisionOptions::default(),
            &mut writer,
            |_, _| Ok(()),
        )
        .unwrap();
        assert_eq!(result.exit_code, 7);
        assert!(
            String::from_utf8(writer)
                .unwrap()
                .contains("useful-failure")
        );
        assert!(!failed_log.exists());
        fs::remove_dir_all(root).unwrap();
    }
}

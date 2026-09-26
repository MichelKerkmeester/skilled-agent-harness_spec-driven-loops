//! Run-owned assertion map lifecycle and execution-backed, agent-assessed score.
use crate::{
    assertion_inputs::ARCHIVE_PATH,
    assertion_map::{self as model, *},
    coverage_report::{
        ArchiveReportRequest, CoverageReport, ExitCodeInput, analyze_coverage_archive,
    },
    evidence_archive::read_archive_selected,
    lifecycle::atomic_write,
    run_store::{RunFingerprint, RunMetadata, StoredRun, discover_runs},
    source_units::named,
};
use serde_json::{Value, json};
use sha2::{Digest, Sha256};
use std::{
    collections::{BTreeMap, BTreeSet},
    fs,
    path::Path,
};

pub const MAP_FILE: &str = "assertions.json";
pub const STATE_FILE: &str = "assertions.state.json";
const REPORT_CACHE_FILE: &str = "assertions.report.cache.json";
/// Kept apart from the full report so a summary can never be read back as one.
const SUMMARY_CACHE_FILE: &str = "assertions.summary.cache.json";
/// The run's archived assertion inputs, written beside the archive at
/// publication so a later run inheriting its map need not decompress a
/// whole archive for one entry. Used only while the archive's digest is the
/// one it records.
const INPUTS_CACHE_FILE: &str = "assertions.inputs.cache.json";

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct InputsCache {
    evidence_digest: String,
    manifest: InputManifest,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    legacy_digest: Option<String>,
    #[serde(default)]
    statement_exclusions: Vec<Value>,
}
pub struct RunManifest {
    pub manifest: InputManifest,
    pub evidence_digest: String,
    legacy_digest: Option<String>,
    pub statement_exclusions: Vec<Value>,
}
pub struct RunInputs {
    pub inputs: Inputs,
    pub stored: RunManifest,
}
impl std::ops::Deref for RunInputs {
    type Target = RunManifest;
    fn deref(&self) -> &RunManifest {
        &self.stored
    }
}
pub fn load_inputs(root: &Path, run: &StoredRun) -> Result<RunInputs, String> {
    let stored = load_manifest(run)?;
    let inputs = crate::assertion_inputs::current_sources(root, &stored.manifest)?;
    Ok(RunInputs { inputs, stored })
}
pub fn load_manifest(run: &StoredRun) -> Result<RunManifest, String> {
    load_optional_manifest(run)?.ok_or_else(|| {
        "This older run has no assertion manifest. Run tests once with this version of Supercov"
            .into()
    })
}
fn load_optional_manifest(run: &StoredRun) -> Result<Option<RunManifest>, String> {
    if run.metadata.merged == Some(true) {
        return Err(
            "Use a single run for assertion maps; merged runs have multiple input manifests".into(),
        );
    }
    let bytes = fs::read(&run.evidence_path).map_err(|e| e.to_string())?;
    let evidence_digest = format!("{:x}", Sha256::digest(&bytes));
    if let Some(cached) = fs::read(run.directory.join(INPUTS_CACHE_FILE))
        .ok()
        .and_then(|bytes| serde_json::from_slice::<InputsCache>(&bytes).ok())
        .filter(|cached| cached.evidence_digest == evidence_digest)
        .filter(|cached| validate_manifest(&cached.manifest).is_ok())
    {
        return Ok(Some(RunManifest {
            manifest: cached.manifest,
            evidence_digest,
            legacy_digest: cached.legacy_digest,
            statement_exclusions: cached.statement_exclusions,
        }));
    }
    let entries = read_archive_selected(&run.evidence_path, |path| {
        path == ARCHIVE_PATH || path == "statement-exclusions.json"
    })
    .map_err(|e| e.to_string())?;
    let Some(input) = entries.iter().find(|e| e.path == ARCHIVE_PATH) else {
        return Ok(None);
    };
    let value: Value = serde_json::from_slice(&input.contents).map_err(|e| e.to_string())?;
    let (manifest, legacy_digest) = match value["schemaVersion"].as_u64() {
        Some(2) => (
            serde_json::from_value::<InputManifest>(value).map_err(|e| e.to_string())?,
            None,
        ),
        Some(1) => {
            // Import old maps without requiring their former checkout. Legacy
            // sources are used only to obtain hashes, never as today's source.
            let legacy: Inputs = serde_json::from_value(value).map_err(|e| e.to_string())?;
            if legacy
                .assertions
                .iter()
                .any(|s| s.at.offset(&legacy.files).is_none())
            {
                return Err("Invalid legacy assertion inputs".into());
            }
            (legacy.manifest(), Some(digest(&legacy)))
        }
        _ => return Err("Unsupported assertion input schema".into()),
    };
    validate_manifest(&manifest)?;
    if fs::read(&run.evidence_path).map_err(|e| e.to_string())? != bytes {
        return Err("Run archive changed during read".into());
    }
    Ok(Some(RunManifest {
        manifest,
        evidence_digest,
        legacy_digest,
        statement_exclusions: entries
            .iter()
            .find(|e| e.path == "statement-exclusions.json")
            .map(|entry| serde_json::from_slice(&entry.contents).map_err(|e| e.to_string()))
            .transpose()?
            .unwrap_or_default(),
    }))
}

fn validate_manifest(manifest: &InputManifest) -> Result<(), String> {
    if manifest.files.iter().any(|(p, f)| {
        !local_path(p) || f.sha256.len() != 64 || !f.sha256.bytes().all(|b| b.is_ascii_hexdigit())
    }) || manifest.assertions.iter().any(|s| {
        !manifest.files.contains_key(&s.at.file)
            || s.at.line == 0
            || s.at.column == 0
            || s.at.text.is_empty()
    }) {
        return Err("Invalid assertion input manifest".into());
    }
    Ok(())
}

/// The manifest a run archived, from the inputs the frontend archived it
/// from and the digest publication took of the archive: what reading the
/// archive back would give, without decompressing it to find one entry.
pub(crate) fn archived_manifest(
    manifest: InputManifest,
    evidence_digest: String,
) -> Result<RunManifest, String> {
    validate_manifest(&manifest)?;
    Ok(RunManifest {
        manifest,
        evidence_digest,
        legacy_digest: None,
        statement_exclusions: Vec::new(),
    })
}
pub fn load(run: &StoredRun, input: &RunManifest) -> Result<(AssertionMap, State), String> {
    let read = |file: &str| {
        fs::read(run.directory.join(file))
            .map_err(|e| format!("{file}: {e}; new test runs create assertion maps automatically"))
    };
    let map = model::parse_stored(&read(MAP_FILE)?).map_err(|e| format!("{MAP_FILE}: {e}"))?;
    let state = model::parse_state(
        &read(STATE_FILE)?,
        &map,
        &input.manifest,
        &input.evidence_digest,
        input.legacy_digest.as_deref(),
    )?;
    Ok((map, state))
}
fn write_json(
    root: &Path,
    run: &StoredRun,
    name: &str,
    value: &impl serde::Serialize,
) -> Result<(), String> {
    let mut bytes = serde_json::to_vec_pretty(value).map_err(|e| e.to_string())?;
    bytes.push(b'\n');
    atomic_write(root, &run.directory.join(name), &bytes).map_err(|e| e.to_string())
}
/// Create the map inside the unpublished run directory. The lifecycle publishes
/// evidence, map and review state together with one directory rename. Older
/// archives without assertion manifests and merged runs retain their existing behavior.
///
/// `analysed` is the run's coverage when the caller has already analysed its
/// evidence -- publication does so once for everything it derives. Without it
/// the archive is analysed here.
#[cfg(test)]
pub(crate) fn prepare_publication(
    root: &Path,
    directory: &Path,
    metadata: &RunMetadata,
    analysed: Option<&CoverageReport>,
) -> Result<(), String> {
    prepare_publication_with(root, directory, metadata, analysed, None)
}

/// `prepare_publication`, with the run's archived manifest when the caller
/// holds it (see `archived_manifest`).
pub(crate) fn prepare_publication_with(
    root: &Path,
    directory: &Path,
    metadata: &RunMetadata,
    analysed: Option<&CoverageReport>,
    archived: Option<RunManifest>,
) -> Result<(), String> {
    if metadata.merged == Some(true) {
        return Ok(());
    }
    let run = StoredRun {
        id: metadata.id.clone(),
        directory: directory.into(),
        evidence_path: directory.join("evidence.raw.gz"),
        metadata_path: directory.join("run.json"),
        query_index_path: directory.join(crate::run_store::RUST_QUERY_INDEX_FILE),
        metadata: metadata.clone(),
    };
    let input = match archived {
        Some(input) => input,
        None => match load_optional_manifest(&run)? {
            Some(input) => input,
            None => return Ok(()),
        },
    };
    // Refuse replacement even if this helper is accidentally called twice.
    if directory.join(MAP_FILE).exists() || directory.join(STATE_FILE).exists() {
        return Err("Refusing to replace an existing assertion map or review state".into());
    }
    let current = crate::assertion_inputs::current_sources(root, &input.manifest);
    let inventory = discover_runs(root).map_err(|e| e.to_string())?;
    let mut inheritance = Inheritance::default();
    let mut inherited = None;
    for previous in &inventory.runs {
        if previous.id == run.id
            || previous.metadata.merged == Some(true)
            || previous.metadata.command != metadata.command
            || (!previous.directory.join(MAP_FILE).exists()
                && !previous.directory.join(STATE_FILE).exists())
        {
            continue;
        }
        let attempt = (|| {
            let old = load_manifest(previous)?;
            if old.manifest.language != input.manifest.language {
                return Ok(None);
            }
            let (map, state) = load(previous, &old)?;
            let a = &previous.metadata.integrity.fingerprint;
            let b = &metadata.integrity.fingerprint;
            let delta = context_delta(
                a,
                b,
                &old.manifest.context_digest,
                &input.manifest.context_digest,
            );
            let context_changed = delta.execution;
            let dependencies_changed = delta.dependencies;
            let current = match &current {
                Ok(current) => current,
                Err(reason) => {
                    // Publish the run even if files were edited during testing.
                    // Preserve authored work as suggestions instead of guessing
                    // locations in a checkout that no longer matches this run.
                    let (mut next, mut next_state) =
                        seed_manifest(&input.manifest, &input.evidence_digest);
                    next.retired_assertions = map.retired_assertions;
                    for assertion in map.assertions {
                        if let Some(site) =
                            next.assertions.iter_mut().find(|a| a.at == assertion.at)
                        {
                            *site = assertion;
                        } else {
                            next.retired_assertions.push(Retired {
                                assertion,
                                reason: reason.clone(),
                            });
                        }
                    }
                    let mut reserved = next
                        .retired_assertions
                        .iter()
                        .map(|r| r.assertion.id.clone())
                        .chain(
                            next.assertions
                                .iter()
                                .filter(|a| !a.flows.is_empty())
                                .map(|a| a.id.clone()),
                        )
                        .collect::<BTreeSet<_>>();
                    for assertion in next.assertions.iter_mut().filter(|a| a.flows.is_empty()) {
                        while !reserved.insert(assertion.id.clone()) {
                            assertion.id.push('_');
                        }
                    }
                    invalidate(&mut next_state, &next, reason);
                    add_change(
                        &mut next_state,
                        None,
                        None,
                        None,
                        reason.clone(),
                        BTreeSet::new(),
                        BTreeSet::new(),
                    );
                    return Ok(Some((next, next_state)));
                }
            };
            model::carry(
                &map,
                &state,
                &old.manifest,
                current,
                &input.evidence_digest,
                context_changed,
            )
            .map(|(next, mut next_state)| {
                if dependencies_changed {
                    add_change(
                        &mut next_state,
                        None,
                        Some(a.dependencies.clone()),
                        Some(b.dependencies.clone()),
                        "installed dependencies changed".into(),
                        BTreeSet::new(),
                        BTreeSet::new(),
                    );
                }
                Some((next, next_state))
            })
        })();
        match attempt {
            Ok(Some(pair)) => {
                inheritance.from = Some(previous.id.clone());
                inherited = Some(pair);
                break;
            }
            Ok(None) => (),
            Err(reason) => inheritance.skipped.push(SkippedMap {
                run: previous.id.clone(),
                reason,
            }),
        }
    }
    let (map, mut state) =
        inherited.unwrap_or_else(|| seed_manifest(&input.manifest, &input.evidence_digest));
    // A malformed newer map might contain changed claims. An older fallback
    // preserves work, but must not silently restore its previous credit.
    if !inheritance.skipped.is_empty() {
        invalidate(
            &mut state,
            &map,
            "newer assertion map could not be reused; inspect inherited claims",
        );
    }
    // What each test ran, so the next carry can tell a change the test saw
    // from one it could not have. Evidence that will not analyse leaves the
    // record out; every flow is then judged by its files, as before.
    let owned;
    let analysed = match analysed {
        Some(report) => Some(report),
        None => {
            owned = coverage(&run).ok();
            owned.as_ref()
        }
    };
    state.executions = analysed.and_then(|report| {
        executions(
            report,
            &input.manifest,
            current.as_ref().ok().map(|inputs| &inputs.files),
        )
    });
    if let Err(reason) = &current {
        invalidate(&mut state, &map, reason);
        add_change(
            &mut state,
            None,
            None,
            None,
            reason.clone(),
            BTreeSet::new(),
            BTreeSet::new(),
        );
    }
    state.inheritance = Some(inheritance);
    write_json(root, &run, MAP_FILE, &map)?;
    write_json(root, &run, STATE_FILE, &state)?;
    // A cache: a run that cannot write it is read from its archive instead.
    let _ = write_json(
        root,
        &run,
        INPUTS_CACHE_FILE,
        &InputsCache {
            evidence_digest: input.evidence_digest.clone(),
            manifest: input.manifest.clone(),
            legacy_digest: input.legacy_digest.clone(),
            statement_exclusions: input.statement_exclusions.clone(),
        },
    );
    // The summary `runs latest` shows, from the coverage already in hand. It is
    // a cache: failing to write it costs the first query the analysis, nothing
    // more, so it never fails the publication.
    if let (Some(report), Ok(inputs)) = (analysed, current) {
        // These inputs were already validated for this publication. Reopening
        // them would decompress and validate the whole archive a second time.
        // Queries still load current sources before accepting this cache.
        let input = RunInputs {
            inputs,
            stored: input,
        };
        let _ = report_with_inputs(root, &run, None, false, Some(report), &input);
    }
    Ok(())
}
/// Each test's execution, placed in the declarations of the run's own
/// manifest: for every probe a test fired, the innermost unit holding it.
/// Also which units hold a probe at all, per file, since only a change
/// confined to such units can be said to have missed a test. Sources are
/// needed to place JavaScript columns; without them there is no record.
pub fn executions(
    coverage: &CoverageReport,
    manifest: &InputManifest,
    sources: Option<&Files>,
) -> Option<Executions> {
    // Each point's file, by index into `files`, and unit. Hits are looked up
    // millions of times on a large run, so the lookup hashes with Fx and a
    // test's hits are grouped by file index before any name is copied.
    let mut located: crate::interned::FastMap<&str, (usize, usize)> = Default::default();
    let mut files: Vec<&str> = Vec::new();
    let mut file_indexes: std::collections::HashMap<&str, usize> = std::collections::HashMap::new();
    let mut probed: BTreeMap<String, BTreeSet<usize>> = BTreeMap::new();
    for point in &coverage.view.points {
        let meta = &point.meta;
        let Some(code) = manifest
            .files
            .get(&meta.file)
            .and_then(|fingerprint| fingerprint.code.as_ref())
        else {
            continue;
        };
        let column = if manifest.language == "javascript" {
            let source = sources?.get(&meta.file)?;
            let Some(column) = byte_column(source, meta.line, meta.column, &manifest.language)
            else {
                continue;
            };
            column
        } else {
            meta.column + 1
        };
        let unit = code.unit_at(meta.line, column);
        let file = *file_indexes.entry(meta.file.as_str()).or_insert_with(|| {
            files.push(meta.file.as_str());
            files.len() - 1
        });
        located.insert(meta.id.as_str(), (file, unit));
        if code.units[unit].is_code() {
            probed.entry(meta.file.clone()).or_default().insert(unit);
        }
    }
    // Everything the run reached, whoever reached it. Collected before the
    // per-test loop because the record that holds what no test could be
    // credited with has no test file, and the loop below skips it -- which is
    // exactly the record a parallel suite's coverage lives in.
    let mut covered_by_file = vec![Vec::new(); files.len()];
    for test in &coverage.view.tests {
        for hit in &test.hits {
            if let Some((file, unit)) = located.get(hit.as_str()) {
                covered_by_file[*file].push(*unit);
            }
        }
    }
    let covered = files
        .iter()
        .zip(covered_by_file)
        .filter(|(_, units)| !units.is_empty())
        .map(|(file, units)| {
            (
                (*file).to_owned(),
                units.into_iter().collect::<BTreeSet<_>>(),
            )
        })
        .collect::<BTreeMap<_, _>>();

    let mut tests: BTreeMap<TestSelector, Execution> = BTreeMap::new();
    for test in &coverage.view.tests {
        let Some(file) = &test.file else {
            continue;
        };
        let selector = TestSelector {
            file: file.clone(),
            name: test.name.clone(),
        };
        let record = tests.entry(selector.clone()).or_insert_with(|| Execution {
            test: selector,
            passed: false,
            files: BTreeMap::new(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.to_owned(),
        });
        record.passed |= test.outcome == "passed";
        // One name can be recorded more than once -- retries, a test declared
        // in two files -- and a single incomplete appearance is enough to make
        // the whole record's file list a lower bound.
        if !crate::coverage_report::coverage_is_complete(&record.attribution) {
            // already the weaker claim
        } else if !crate::coverage_report::coverage_is_complete(&test.attribution) {
            record.attribution = test.attribution.clone();
        }
        let mut reached = test
            .hits
            .iter()
            .filter_map(|hit| located.get(hit.as_str()).copied())
            .collect::<Vec<_>>();
        reached.sort_unstable();
        for group in reached.chunk_by(|left, right| left.0 == right.0) {
            record
                .files
                .entry(files[group[0].0].to_owned())
                .or_default()
                .extend(group.iter().map(|(_, unit)| *unit));
        }
    }
    let mut tests = tests.into_values().collect::<Vec<_>>();
    for record in &mut tests {
        for units in record.files.values_mut() {
            units.sort_unstable();
            units.dedup();
        }
    }
    Some(Executions {
        tests,
        probed: probed
            .into_iter()
            .map(|(file, units)| (file, units.into_iter().collect()))
            .collect(),
        covered: covered
            .into_iter()
            .map(|(file, units)| (file, units.into_iter().collect()))
            .collect(),
    })
}
/// Which of a run's tests the current checkout's changes could have reached,
/// from what each test executed and what has changed since, declaration by
/// declaration. A test is affected by a change in code it ran, in its test
/// file, or in a file it ran code in whose declarations changed shape; not by
/// a change confined to code it never ran; not by comments or blank lines. A
/// test that did not pass is listed as affected regardless: it has a result to
/// establish. What this cannot see is a file the run never captured -- a file
/// added since -- and the run's dependencies and configuration, which the
/// working-tree check answers for.
pub fn affected_tests(root: &Path, run: &StoredRun) -> Result<Value, String> {
    let stored = load_manifest(run)?;
    let (_, state) = load(run, &stored)?;
    let Some(executions) = &state.executions else {
        return Err(
            "This run has no per-test execution record; rerun tests with this version of Supercov"
                .into(),
        );
    };
    let root = crate::workspace::canonicalize_simplified(root).map_err(|e| e.to_string())?;
    let manifest = &stored.manifest;
    let now = manifest
        .files
        .keys()
        .filter_map(|file| {
            let path = root.join(file);
            let canonical = crate::workspace::canonicalize_simplified(&path).ok()?;
            if !canonical.starts_with(&root) || !canonical.is_file() {
                return None;
            }
            let text = fs::read_to_string(canonical).ok()?;
            Some((file.clone(), FileFingerprint::read(file, &text)))
        })
        .collect::<FileManifest>();
    let changes = manifest
        .files
        .keys()
        .filter_map(|file| {
            model::file_change(
                manifest.files.get(file),
                now.get(file),
                executions.probed.get(file).map(Vec::as_slice),
            )
            .map(|change| (file.as_str(), change))
        })
        .collect::<BTreeMap<_, _>>();
    let files = changes
        .iter()
        .filter_map(|(file, change)| {
            let (kind, detail) = match change {
                FileChange::Same | FileChange::Added => return None,
                FileChange::CommentsOnly => ("formatting", None),
                FileChange::Removed => ("removed", None),
                FileChange::Bytes => ("changed", None),
                FileChange::Code {
                    before,
                    after,
                    diff,
                    narrow,
                } => (
                    if *narrow { "bodies" } else { "declarations" },
                    Some(model::describe(before, after, diff)),
                ),
            };
            Some(json!({"file":file,"change":kind,"detail":detail}))
        })
        .collect::<Vec<_>>();
    // What a test whose own reach is unknown could have reached.
    //
    // Nothing can narrow such a test below the run it ran in, and nothing
    // needs to go wider: its reach is bounded above by what the run covered.
    // So a change inside that bound could have reached it, and a change
    // outside it -- code no test in the run ever ran, a file added since --
    // could not have reached any test, this one included.
    //
    // That is a real narrowing rather than "always affected". It is also the
    // only safe direction: reading an empty file list as "this change missed
    // it" is what let a change to code every test exercised report `0 of 2
    // tests affected` and exit 0, which an agent running only affected tests
    // would act on by running nothing.
    let beyond_the_run = changes
        .iter()
        .filter_map(|(file, change)| match change {
            FileChange::Same | FileChange::CommentsOnly | FileChange::Added => None,
            FileChange::Removed => Some(format!("{file} removed (the run covered code in it)")),
            FileChange::Bytes => Some(format!("{file} changed (the run covered code in it)")),
            FileChange::Code { before, diff, .. } => {
                // Unit by unit rather than file by file: a function no test
                // ran sits in the same file as the ones they did, so asking
                // whether the file was covered would make every change to it
                // reach every test.
                let code = manifest.files.get(*file).and_then(|f| f.code.as_ref());
                let reached = executions
                    .covered
                    .get(*file)
                    .map(Vec::as_slice)
                    .unwrap_or_default()
                    .iter()
                    .flat_map(|unit| match code {
                        Some(code) if *unit < code.units.len() => {
                            code.ancestors(*unit).collect::<Vec<_>>()
                        }
                        _ => vec![*unit],
                    })
                    .collect::<BTreeSet<_>>();
                let hit = diff
                    .changed
                    .iter()
                    .filter(|unit| reached.contains(unit))
                    .filter_map(|unit| before.units.get(*unit))
                    .collect::<Vec<_>>();
                (!hit.is_empty())
                    .then(|| format!("{file}: {} changed (the run covered it)", named(hit)))
            }
        })
        .collect::<Vec<_>>();

    let mut affected = Vec::new();
    let mut undetermined = Vec::new();
    let mut unaffected = Vec::new();
    for record in &executions.tests {
        let mut reasons = Vec::new();
        if !record.passed {
            reasons.push("did not pass in the run".to_owned());
        }
        match changes.get(record.test.file.as_str()) {
            None | Some(FileChange::Same | FileChange::CommentsOnly | FileChange::Added) => {}
            Some(FileChange::Removed) => reasons.push("test file removed".to_owned()),
            Some(FileChange::Bytes) => reasons.push("test file changed".to_owned()),
            Some(FileChange::Code {
                before,
                after,
                diff,
                ..
            }) => reasons.push(format!(
                "test file changed: {}",
                model::describe(before, after, diff)
            )),
        }
        for (file, units) in &record.files {
            let code = manifest.files.get(file).and_then(|f| f.code.as_ref());
            let ran = units
                .iter()
                .flat_map(|unit| match code {
                    Some(code) if *unit < code.units.len() => {
                        code.ancestors(*unit).collect::<Vec<_>>()
                    }
                    _ => vec![*unit],
                })
                .collect::<BTreeSet<_>>();
            match changes.get(file.as_str()) {
                None | Some(FileChange::Same | FileChange::CommentsOnly | FileChange::Added) => {}
                Some(FileChange::Removed) => {
                    reasons.push(format!("{file} removed (this test ran code in it)"));
                }
                Some(FileChange::Bytes) => {
                    reasons.push(format!("{file} changed (this test ran code in it)"));
                }
                Some(FileChange::Code {
                    before,
                    after,
                    diff,
                    narrow,
                }) => {
                    if *narrow {
                        let hit = diff
                            .changed
                            .iter()
                            .filter(|i| ran.contains(i))
                            .map(|i| &before.units[*i])
                            .collect::<Vec<_>>();
                        if !hit.is_empty() {
                            reasons
                                .push(format!("{file}: {} changed (this test ran it)", named(hit)));
                        }
                    } else {
                        reasons.push(format!(
                            "{file}: {} changed (this test ran code in this file)",
                            model::describe(before, after, diff)
                        ));
                    }
                }
            }
        }
        if !crate::coverage_report::coverage_is_complete(&record.attribution) {
            // What its own record proves is the strong claim, and it keeps it:
            // a Ruby test credited with the changed line ran the changed line,
            // whatever else it also ran unrecorded.
            let proven = !reasons.is_empty();
            // The run's bound is what stands in for a record this test does
            // not have. Where it has one that already proves the change
            // reached it, saying so twice says nothing twice.
            if !proven {
                reasons.extend(beyond_the_run.iter().cloned());
                reasons.sort();
                reasons.dedup();
            }
            let entry = json!({
                "file": record.test.file,
                "name": record.test.name,
                "reasons": reasons,
                "attribution": record.attribution,
            });
            if proven {
                affected.push(entry);
            } else if reasons.is_empty() {
                unaffected.push(entry);
            } else {
                undetermined.push(entry);
            }
            continue;
        }
        let entry = json!({"file":record.test.file,"name":record.test.name,"reasons":reasons});
        if reasons.is_empty() {
            unaffected.push(entry);
        } else {
            affected.push(entry);
        }
    }
    Ok(json!({
        "run": run.id,
        "affected": affected,
        // Kept apart from `affected` because they are a different claim. A
        // test is affected when a change reached code it is recorded as having
        // run; it is undetermined when nothing recorded what it ran and the
        // change is inside what the run as a whole covered. Merging them would
        // report a precision the run does not have -- but both have to be run,
        // so both are in `--names`.
        "undetermined": undetermined,
        "unaffected": unaffected,
        "changedFiles": files,
        "summary": {
            "tests": executions.tests.len(),
            "affected": affected.len(),
            "undetermined": undetermined.len(),
            "unaffected": unaffected.len(),
            "changedFiles": files.len(),
        },
        "meaning": "Tests whose recorded execution a change since the run could have reached, and those whose execution nothing recorded: a test that ran alongside others has no coverage of its own, so it is undetermined whenever a change reaches anything the run covered. Run both. A file the run never captured, a dependency or a configuration change is not seen here; see workingTree."
    }))
}
/// How a difference between two runs reaches the flows inherited across it.
struct ContextDelta {
    /// What actually executes moved, so every inherited flow has to be read
    /// again before it can be trusted.
    execution: bool,
    /// The installed dependency set moved. Recorded as one change to assess
    /// rather than as staleness on every flow.
    dependencies: bool,
}

/// Source hashes are checked through anchors and watches by `carry`; this is
/// only about what surrounds them.
///
/// The instrumenter is deliberately absent. It is Supercov's own version, so
/// including it made every release mark every map in the world stale -- for
/// claims that are about the project's code, not about Supercov. When the
/// meaning of credit itself changes, the basis domain is the thing that moves.
///
/// Dependencies are separated rather than dropped. An upgrade can falsify an
/// authored explanation without touching a single project file, so it cannot
/// pass unsaid; but it usually falsifies nothing, and making every flow stale
/// for it spends the attention the author needs for the changes that do
/// matter. An acknowledgement demanded six hundred times at once stops being
/// read, which is the opposite of what it is for.
fn context_delta(
    a: &RunFingerprint,
    b: &RunFingerprint,
    old_context: &str,
    new_context: &str,
) -> ContextDelta {
    ContextDelta {
        execution: a.configuration != b.configuration || old_context != new_context,
        dependencies: a.dependencies != b.dependencies,
    }
}

pub fn coverage(run: &StoredRun) -> Result<CoverageReport, String> {
    analyze_coverage_archive(&ArchiveReportRequest {
        archive_path: run.evidence_path.clone(),
        run_id: run.id.clone(),
        generated_at: run.metadata.started_at.clone(),
        integrity: None,
        test_exit_code: ExitCodeInput::Present(run.metadata.test_exit_code),
    })
    .map_err(|e| format!("{e:?}"))
}
fn byte_column(source: &str, line: usize, column: usize, language: &str) -> Option<usize> {
    byte_column_in(
        source,
        &crate::assertion_map::line_starts(source),
        line,
        column,
        language,
    )
}

/// `byte_column`, given where each line starts, so that resolving a whole
/// file's statements looks each line up instead of walking the file to it.
fn byte_column_in(
    source: &str,
    starts: &[usize],
    line: usize,
    column: usize,
    language: &str,
) -> Option<usize> {
    if line == 0 {
        return None;
    }
    let line = crate::assertion_map::line_text(source, starts, line)?;
    if language != "javascript" {
        // Native Rust, Python and Ruby manifests use zero-based byte columns.
        return column.checked_add(1);
    }
    if column == 0 {
        return None;
    }
    let mut units = 0;
    for (byte, ch) in line.char_indices() {
        if units == column - 1 {
            return Some(byte + 1);
        }
        units += ch.len_utf16();
    }
    (units == column - 1).then_some(line.len() + 1)
}
fn phase_location<'a>(
    phase: &'a crate::coverage_report::CoveragePhase,
    inputs: &Inputs,
) -> Option<(&'a str, usize, usize)> {
    if phase.kind != "assertion" || phase.status.as_deref() != Some("passed") {
        return None;
    }
    let source = phase
        .operation
        .strip_prefix("Rust assertion at ")
        .or(phase.source.as_deref());
    let location = source?;
    let mut parts = location.rsplitn(3, ':');
    let column = parts.next()?.parse::<usize>().ok()?;
    let line = parts.next()?.parse::<usize>().ok()?;
    let file = parts.next()?;
    let column = byte_column(inputs.files.get(file)?, line, column, &inputs.language)?;
    Some((file, line, column))
}

/// Cache derived assessments separately from immutable coverage evidence.
/// Every query still verifies current source, map and managed-state identities.
pub fn report(root: &Path, run: &StoredRun) -> Result<Value, String> {
    report_with_detail(root, run, None, true)
}
/// The report `runs latest` shows: every count, none of the per-statement and
/// per-line lists. See `assess_summary`.
pub fn report_summary(root: &Path, run: &StoredRun) -> Result<Value, String> {
    report_with_detail(root, run, None, false)
}
/// Read authored flows and their assessment from the same map snapshot.
pub fn assertion(root: &Path, run: &StoredRun, id: &str) -> Result<Value, String> {
    report_with_detail(root, run, Some(id), true)
}
fn report_with_detail(
    root: &Path,
    run: &StoredRun,
    id: Option<&str>,
    detail: bool,
) -> Result<Value, String> {
    report_with_detail_using(root, run, id, detail, None)
}
/// `report_with_detail`, given the run's coverage when it is already analysed.
fn report_with_detail_using(
    root: &Path,
    run: &StoredRun,
    id: Option<&str>,
    detail: bool,
    analysed: Option<&CoverageReport>,
) -> Result<Value, String> {
    let input = load_inputs(root, run)?;
    report_with_inputs(root, run, id, detail, analysed, &input)
}

fn report_with_inputs(
    root: &Path,
    run: &StoredRun,
    id: Option<&str>,
    detail: bool,
    analysed: Option<&CoverageReport>,
    input: &RunInputs,
) -> Result<Value, String> {
    let (map, state) = load(run, input)?;
    let cache_key = digest(&(
        env!("SUPERCOV_ENGINE_SOURCE_SHA256"),
        &run.id,
        run.metadata.test_exit_code,
        &map,
        &state,
        &input.evidence_digest,
    ));
    let cache_file = if detail {
        REPORT_CACHE_FILE
    } else {
        SUMMARY_CACHE_FILE
    };
    let cache_path = run.directory.join(cache_file);
    let mut report = read_report_cache(&cache_path, &cache_key).unwrap_or_else(|| Value::Null);
    if report.is_null() {
        let owned;
        let coverage = match analysed {
            Some(report) => report,
            None => {
                owned = coverage(run)?;
                &owned
            }
        };
        report = assess_with(
            &map,
            &state,
            &input.inputs,
            coverage,
            run.metadata.test_exit_code == Some(0),
            detail,
        );
        if detail {
            report["excludedStatements"] = json!(input.statement_exclusions);
        }
        report["summary"]["excludedStatements"] = json!(input.statement_exclusions.len());
        // This is disposable acceleration. A read-only directory or corrupt
        // cache must never prevent a freshly computed report from working.
        let cached = json!({"key":cache_key,"digest":digest(&report),"report":report});
        let _ = write_json(root, run, cache_file, &cached);
    }
    if let Some(id) = id {
        let matches = report["assertions"]
            .as_array()
            .unwrap()
            .iter()
            .filter(|a| a["id"] == id)
            .collect::<Vec<_>>();
        let mut row = match matches.as_slice() {
            [row] => (*row).clone(),
            [] => {
                return Err(format!(
                    "Unknown assertion ID: {id}; use runs {} assertions to list IDs",
                    run.id
                ));
            }
            _ => {
                return Err(format!(
                    "Ambiguous assertion ID: {id}; repair duplicate IDs in assertions.json"
                ));
            }
        };
        if let Some(authored) = map.assertions.iter().find(|a| a.id == id) {
            for (flow, authored) in row["flows"]
                .as_array_mut()
                .unwrap()
                .iter_mut()
                .zip(&authored.flows)
            {
                let assessment = flow.as_object().unwrap().clone();
                *flow = serde_json::to_value(authored).map_err(|e| e.to_string())?;
                flow.as_object_mut().unwrap().extend(assessment);
            }
        }
        report["assertion"] = row;
    }
    report["inheritance"] = json!(state.inheritance);
    report["revision"] = json!(digest(&(&map, &state, &input.evidence_digest)));
    Ok(report)
}

fn read_report_cache(path: &Path, key: &str) -> Option<Value> {
    if fs::metadata(path).ok()?.len() > 256 * 1024 * 1024 {
        return None;
    }
    let cached: Value = serde_json::from_slice(&fs::read(path).ok()?).ok()?;
    let report = &cached["report"];
    (cached["key"] == key
        && cached["digest"] == digest(report)
        && report["summary"].is_object()
        && report["assertions"].is_array())
    .then(|| report.clone())
}

pub fn assess(
    map: &AssertionMap,
    state: &State,
    inputs: &Inputs,
    coverage: &CoverageReport,
    passed: bool,
) -> Value {
    assess_with(map, state, inputs, coverage, passed, true)
}

/// The assessment's summary and everything but its per-statement and per-line
/// lists. `runs latest` shows five fields of the assessment and used to build
/// all of it to get them: every measured statement, each carrying the source of
/// the node around it. On a 300-file project that was 300,000 entries, a 177 MB
/// cache, and 4 GB held to print a handful of counts. Every count is computed
/// the same way here as in the full assessment; only the lists are skipped.
pub fn assess_summary(
    map: &AssertionMap,
    state: &State,
    inputs: &Inputs,
    coverage: &CoverageReport,
    passed: bool,
) -> Value {
    assess_with(map, state, inputs, coverage, passed, false)
}

fn assess_with(
    map: &AssertionMap,
    state: &State,
    inputs: &Inputs,
    coverage: &CoverageReport,
    passed: bool,
    detail: bool,
) -> Value {
    let manifest = inputs.manifest();
    // Every statement is located in its file below, so each file's line starts
    // are found once here rather than by a walk from the top per statement.
    let lines = crate::assertion_map::LineIndex::new(&inputs.files);
    let ledger = model::Ledger::new(map, state, &manifest);
    let validation = model::validation(map, state, inputs);
    let errors = validation["errors"]
        .as_array()
        .unwrap()
        .iter()
        .map(|e| e.as_str().unwrap().to_owned())
        .collect::<Vec<_>>();
    let pending_changes = validation["changes"]
        .as_array()
        .unwrap()
        .iter()
        .filter(|c| c["current"] != true)
        .count();
    let view = &coverage.filters.passed;
    let tests = view
        .tests
        .iter()
        .filter(|t| t.role == "test")
        .map(|t| (t.id.as_str(), t))
        .collect::<BTreeMap<_, _>>();
    let measured_statements = view
        .points
        .iter()
        .filter(|p| p.measured && p.meta.kind == crate::coverage_analysis::PointKind::Statement)
        .collect::<Vec<_>>();
    let all_points = coverage
        .view
        .points
        .iter()
        .map(|p| (&p.meta.id, p))
        .collect::<BTreeMap<_, _>>();
    let all_tests = coverage
        .view
        .tests
        .iter()
        .map(|t| (t.id.as_str(), t))
        .collect::<BTreeMap<_, _>>();
    let mut by_file = BTreeMap::<&str, Vec<(usize, &crate::coverage_report::PointResult)>>::new();
    let mut by_line = BTreeMap::<(String, usize), Vec<&crate::coverage_report::PointResult>>::new();
    for point in &measured_statements {
        by_line
            .entry((point.meta.file.clone(), point.meta.line))
            .or_default()
            .push(point);
        if let Some((text, starts)) = lines.get(&point.meta.file)
            && let Some(column) = byte_column_in(
                text,
                starts,
                point.meta.line,
                point.meta.column,
                &inputs.language,
            )
        {
            let at = Anchor {
                file: point.meta.file.clone(),
                line: point.meta.line,
                column,
                text: point.meta.source.clone(),
            };
            if let Some(start) = at.offset_in(text, starts) {
                by_file
                    .entry(&point.meta.file)
                    .or_default()
                    .push((start, point));
            }
        }
    }
    for points in by_file.values_mut() {
        points.sort_by_key(|(pos, _)| *pos);
    }
    let mut rows = Vec::new();
    let mut claimed_points = BTreeSet::new();
    let mut credited_points = BTreeSet::new();
    let mut point_flows = BTreeMap::<String, BTreeSet<String>>::new();
    let mut draft_flows = 0;
    let mut stale_flows = 0;
    let mut invalid_flows = 0;
    let mut current_flows = 0;
    let mut credit_flows = 0;
    let mut assertions_without_current_explanation = 0;
    let mut line_assertions = BTreeMap::<(String, usize), BTreeSet<String>>::new();
    // Duplicate identities invalidate all credit; stale anchors only invalidate
    // their own flow, so an agent can repair a large map incrementally.
    let identities_valid = state.inputs_digest == inputs.identity()
        && errors.iter().all(|e| {
            !e.contains("duplicate") && !e.contains("schema") && !e.contains("assertion ID")
        });
    // Join exact identities once, rather than rescanning the complete inventory
    // for every assertion/phase pair. This is evidence lookup, not inference.
    let mut phases_by_location = BTreeMap::new();
    for p in &view.phases {
        if !tests.contains_key(p.test.as_str()) {
            continue;
        }
        if let Some(location) = phase_location(&p.phase, inputs) {
            phases_by_location
                .entry(location)
                .or_insert_with(Vec::new)
                .push(p);
        }
    }
    let mut inventory = BTreeMap::<&Anchor, BTreeSet<&str>>::new();
    for site in &inputs.assertions {
        inventory
            .entry(&site.at)
            .or_default()
            .insert(&site.operation);
    }
    let mapped_anchors = map
        .assertions
        .iter()
        .map(|a| &a.at)
        .collect::<BTreeSet<_>>();
    let mut used_ids = map
        .assertions
        .iter()
        .map(|a| a.id.clone())
        .chain(
            map.retired_assertions
                .iter()
                .map(|r| r.assertion.id.clone()),
        )
        .collect::<BTreeSet<_>>();
    let missing = seed(inputs, "")
        .0
        .assertions
        .into_iter()
        .filter(|a| !mapped_anchors.contains(&a.at))
        .map(|mut a| {
            while !used_ids.insert(a.id.clone()) {
                a.id.push('_');
            }
            a
        })
        .collect::<Vec<_>>();
    for (a, in_map) in map
        .assertions
        .iter()
        .map(|a| (a, true))
        .chain(missing.iter().map(|a| (a, false)))
    {
        let witnesses = phases_by_location
            .get(&(a.at.file.as_str(), a.at.line, a.at.column))
            .into_iter()
            .flatten()
            // Coordinates alone cannot identify a JS assertion: retain the
            // complete inventoried expression and operation requirement.
            .filter(|p| {
                inputs.language != "javascript"
                    || inventory
                        .get(&a.at)
                        .is_some_and(|operations| operations.contains(p.phase.operation.as_str()))
            })
            .map(|p| p.test.clone())
            .collect::<BTreeSet<_>>();
        let mut flows = Vec::new();
        for f in &a.flows {
            let dirty = model::reasons_with(a, f, state, inputs, &manifest, &ledger);
            let valid = model::validate_flow(f, &inputs.files).is_empty()
                && a.at.offset(&inputs.files).is_some();
            let freshness = if f.basis.is_none() {
                draft_flows += 1;
                "draft"
            } else if f.basis.as_deref()
                != Some(model::expected_basis_with(a, f, state, &manifest, &ledger).as_str())
            {
                stale_flows += 1;
                "stale"
            } else {
                "current"
            };
            if !valid {
                invalid_flows += 1;
            }
            if dirty.is_empty() {
                current_flows += 1;
            }
            // A file + exact displayed name must resolve to one logical test.
            // Retry attempts remain under that identity; duplicate names do not.
            let mut resolved = BTreeSet::new();
            let mut selectors = Vec::new();
            for selector in &f.applies_to {
                let matches = coverage
                    .view
                    .tests
                    .iter()
                    .filter(|t| {
                        t.file.as_deref() == Some(selector.file.as_str()) && t.name == selector.name
                    })
                    .collect::<Vec<_>>();
                let status = match matches.as_slice() {
                    [test]
                        if witnesses.contains(test.id.as_str())
                            && tests.contains_key(test.id.as_str()) =>
                    {
                        resolved.insert(test.id.clone());
                        "observed"
                    }
                    [] => "missing",
                    [_] => "unobserved",
                    _ => "ambiguous",
                };
                selectors.push(json!({"file":selector.file,"name":selector.name,"status":status,
                    "outcomes":matches.iter().map(|t| &t.outcome).collect::<Vec<_>>(),
                    "reason":match matches.as_slice() {
                        [] => "No test execution record matches this selector. The test may be disabled or outside this run.",
                        [test] if test.outcome != "passed" => "The selected test has no passing outcome.",
                        [_] if status == "unobserved" => "The test passed but this assertion occurrence was not recorded. Its branch may not have run, or attribution may be missing.",
                        [_] => "A passing assertion occurrence matches this test.",
                        _ => "Multiple test identities match this selector."
                    }}));
            }
            let applicable = resolved;
            let eligible = passed && identities_valid && dirty.is_empty() && !applicable.is_empty();
            let mut blockers = Vec::new();
            if !passed {
                blockers.push("run did not pass");
            }
            if !identities_valid {
                blockers.push("invalid map identities");
            }
            if !dirty.is_empty() {
                blockers.push("flow requires review or reference repair");
            }
            if applicable.is_empty() {
                blockers.push("no matching passing assertion occurrence for appliesTo");
            }
            if eligible {
                credit_flows += 1;
            }
            let mut lines = BTreeSet::new();
            let mut node_credit = Vec::new();
            for node in &f.nodes {
                let claimed = f.counts_as_asserted.contains(&node.id);
                let start = node.at.offset(&inputs.files);
                let mut matched = Vec::new();
                if let Some(start) = start
                    && let Some(points) = by_file.get(node.at.file.as_str())
                {
                    let first = points.partition_point(|(pos, _)| *pos < start);
                    for (_, point) in points[first..].iter().take_while(|(pos, _)| *pos == start) {
                        // Exact statement identity only: a guard/block does not
                        // include its nested statements in the score or diagnostic.
                        if point.meta.source == node.at.text {
                            matched.push(*point);
                        }
                    }
                }
                let matching_tests = matched
                    .iter()
                    .filter(|p| p.covered)
                    .flat_map(|p| p.tests.iter())
                    .filter(|test| applicable.contains(test.as_str()))
                    .collect::<BTreeSet<_>>();
                let credited = claimed && eligible && !matching_tests.is_empty();
                let mut reasons = Vec::new();
                let mut reason = |code: &str, message: String| {
                    reasons.push(json!({"code":code,"message":message}));
                };
                if !claimed {
                    reason(
                        "context_only",
                        "The agent included this node as context, not in countsAsAsserted.".into(),
                    );
                } else if credited {
                    reason("same_test_execution", "Current agent claim, passing assertion, and statement execution in the same selected test.".into());
                } else {
                    if start.is_none() {
                        reason(
                            "invalid_source_anchor",
                            "The node's source anchor does not match the run's current source."
                                .into(),
                        );
                    } else if matched.is_empty() {
                        reason("no_measured_statement", "The node does not exactly identify a measured production statement in this run.".into());
                    }
                    if !passed {
                        reason("run_failed", "The test run did not pass.".into());
                    }
                    if !identities_valid {
                        reason("invalid_map_identity", "Map identities or managed input state are invalid; see validation errors.".into());
                    }
                    if !dirty.is_empty() {
                        reason(
                            "flow_needs_attention",
                            format!(
                                "Flow needs investigation: {}",
                                dirty.iter().cloned().collect::<Vec<_>>().join("; ")
                            ),
                        );
                    }
                    if applicable.is_empty() {
                        reason("no_passing_assertion", "No selected test has a matching passing occurrence of this assertion; see flow selectors.".into());
                    }
                    if !matched.is_empty() {
                        if !matched.iter().any(|p| p.covered) {
                            let executed = matched
                                .iter()
                                .filter_map(|p| all_points.get(&p.meta.id))
                                .filter(|p| p.covered)
                                .collect::<Vec<_>>();
                            if !executed.is_empty() {
                                let setup = executed.iter().flat_map(|p| &p.tests).any(|id| {
                                    all_tests
                                        .get(id.as_str())
                                        .is_some_and(|t| t.role == "setup")
                                });
                                reason(if setup {"shared_setup_execution"} else {"execution_outside_passing_tests"},
                                    if setup {"Execution was recorded in a separate setup scope. Shared setup is not automatically credited to consuming tests."} else {"Execution was recorded outside passing tests (for example module initialization, background work or a failed test). It cannot establish same-test execution."}.into());
                            }
                            reason(
                                "no_passing_execution",
                                "No execution evidence from passing tests for this statement."
                                    .into(),
                            );
                        } else if !applicable.is_empty() && matching_tests.is_empty() {
                            if matched.iter().flat_map(|p| &p.tests).any(|id| {
                                all_tests
                                    .get(id.as_str())
                                    .is_some_and(|t| t.role == "setup")
                            }) {
                                reason("shared_setup_execution", "Execution was recorded in a separate setup scope. Shared setup is not automatically credited to consuming tests.".into());
                            }
                            reason("no_same_test_execution", "No execution evidence attributed to a selected passing test for this assertion.".into());
                        }
                    }
                }
                node_credit.push(json!({
                    "nodeId":node.id,
                    "location":{"file":node.at.file,"line":node.at.line,"column":node.at.column},
                    "status":if !claimed {"context"} else if credited {"credited"} else {"notCredited"},
                    "statementIds":matched.iter().map(|p| &p.meta.id).collect::<Vec<_>>(),
                    "matchingTests":matching_tests,
                    "reasons":reasons,
                }));
                for point in matched.into_iter().filter(|_| claimed) {
                    claimed_points.insert(point.meta.id.clone());
                    if eligible
                        && point.covered
                        && point.tests.iter().any(|t| applicable.contains(t.as_str()))
                    {
                        credited_points.insert(point.meta.id.clone());
                        point_flows
                            .entry(point.meta.id.clone())
                            .or_default()
                            .insert(flow_key(a, f));
                        lines.insert((node.at.file.clone(), point.meta.line));
                        line_assertions
                            .entry((node.at.file.clone(), point.meta.line))
                            .or_default()
                            .insert(a.id.clone());
                    }
                }
            }
            let notices = state
                .flows
                .get(&flow_key(a, f))
                .map(|s| s.notices.clone())
                .unwrap_or_default();
            let exposed_to = state
                .changes
                .iter()
                .filter(|c| c.exposed.contains(&flow_key(a, f)))
                .map(|c| c.id.clone())
                .collect::<Vec<_>>();
            flows.push(json!({"id":f.id,"freshness":freshness,"valid":valid,"current":dirty.is_empty(),"expectedBasis":model::expected_basis_with(a,f,state,&manifest,&ledger),"selectors":selectors,"questions":f.questions,"reasons":dirty,"notices":notices,"exposedTo":exposed_to,"eligible":eligible,"blockers":blockers,"matchingTests":applicable,"creditedStatementLines":lines,"nodeCredit":node_credit}));
        }
        let observation = if !witnesses.is_empty() {
            "Passing assertion occurrence recorded."
        } else if flows
            .iter()
            .flat_map(|f| f["selectors"].as_array().into_iter().flatten())
            .any(|s| s["status"] == "missing")
        {
            "No passing occurrence. Some selected tests have no execution record (for example disabled tests or tests outside this run)."
        } else if flows
            .iter()
            .flat_map(|f| f["selectors"].as_array().into_iter().flatten())
            .any(|s| {
                s["outcomes"]
                    .as_array()
                    .is_some_and(|outcomes| outcomes.iter().any(|o| o == "skipped"))
            })
        {
            "No passing occurrence. Selected tests include skipped/TODO executions."
        } else {
            "No passing occurrence recorded. The assertion may be in an untaken branch or its execution attribution may be missing; inspect the selected tests."
        };
        // Keep the exact anchor lookup typed. Scanning and serializing the
        // entire inventory for each JSON row made publication quadratic in
        // assertion count, including for maps with no authored flows.
        if inventory.contains_key(&a.at)
            && !witnesses.is_empty()
            && !flows.iter().any(|f| f["eligible"] == true)
        {
            assertions_without_current_explanation += 1;
        }
        rows.push(json!({"observation":observation,"id":a.id,"at":a.at,"questions":a.questions,"inMap":in_map,"observes":a.observes,"operations":inventory.get(&a.at).cloned().unwrap_or_default(),"observedPassingTests":witnesses,"flows":flows}));
    }
    // Only lines carrying a measured statement can ever be asserted: credit is
    // claimed per statement, and statements are keyed by their anchor line. A
    // measured line without one — a continuation line of a multi-line
    // statement, or a nested function/arrow body with no statement of its own —
    // is unclaimable by construction, so counting it here would cap the
    // percentage below 100% for structural reasons and list it under
    // `unassertedLines` as if an agent could act on it.
    let denominator = coverage
        .view
        .lines
        .iter()
        .filter(|l| l.measured)
        .map(|l| (l.file.clone(), l.line))
        .filter(|location| by_line.contains_key(location))
        .collect::<BTreeSet<_>>();
    let mut credited = BTreeSet::new();
    let mut declared = BTreeSet::new();
    for location in &denominator {
        let statements = by_line.get(location).map(Vec::as_slice).unwrap_or(&[]);
        if !statements.is_empty()
            && statements
                .iter()
                .all(|p| claimed_points.contains(&p.meta.id))
        {
            declared.insert(location.clone());
        }
        if !statements.is_empty()
            && statements
                .iter()
                .all(|p| credited_points.contains(&p.meta.id))
        {
            credited.insert(location.clone());
        }
    }
    let missing_inventory = inputs
        .assertions
        .iter()
        .filter(|s| !mapped_anchors.contains(&s.at))
        .count();
    let (status, reason) = if !passed || !identities_valid {
        ("unavailable", "Run failed or map identities are invalid")
    } else if pending_changes > 0 {
        ("pending", "Source changes need impact assessment")
    } else if measured_statements.is_empty() {
        ("notApplicable", "No measured statements")
    } else if credit_flows > 0 {
        (
            "available",
            "Agent-assessed statements; mapping completeness is unknown",
        )
    } else if map.assertions.iter().all(|a| a.flows.is_empty()) {
        ("notAssessed", "No recorded flow explanations")
    } else {
        (
            "pending",
            "No current flow with matching passing assertion evidence",
        )
    };
    let total = denominator.len();
    // Each measured statement is located once. The detail list and the
    // summary's count of statements that cannot be located read these same
    // answers, so a summary built without the list cannot disagree with it.
    let located = measured_statements
        .iter()
        .map(|p| {
            let (text, starts) = lines.get(&p.meta.file)?;
            let column =
                byte_column_in(text, starts, p.meta.line, p.meta.column, &inputs.language)?;
            crate::assertion_map::locate(
                &p.meta.file,
                p.meta.line,
                column,
                &p.meta.source,
                text,
                starts,
            )
            .map(|_| column)
        })
        .collect::<Vec<_>>();
    let unanchored = located.iter().filter(|column| column.is_none()).count();
    let statements = if !detail {
        Vec::new()
    } else {
        measured_statements.iter().zip(&located).map(|(p, column)| {
        let at = column.map(|column| Anchor { file: p.meta.file.clone(), line: p.meta.line, column, text: p.meta.source.clone() });
        let all = all_points.get(&p.meta.id);
        json!({"id":p.meta.id,"file":p.meta.file,"line":p.meta.line,"at":at,"covered":p.covered,"tests":p.tests,"declared":claimed_points.contains(&p.meta.id),"asserted":credited_points.contains(&p.meta.id),"flows":point_flows.get(&p.meta.id).cloned().unwrap_or_default(),
            "executionEvidence":{"anyExecution":all.is_some_and(|p| p.covered),"passingTests":p.tests.iter().filter(|id| tests.contains_key(id.as_str())).collect::<Vec<_>>(),
                "outsidePassingTests":all.into_iter().flat_map(|p| &p.tests).filter(|id| !tests.contains_key(id.as_str())).collect::<Vec<_>>()}})
    }).collect::<Vec<_>>()
    };
    json!({"basis":"agent-assessed; passing assertion identity and same-test execution required; not mutation resistance",
        "summary":{"status":status,"reason":reason,"pendingChanges":pending_changes,"metric":"measured statements","statements":{"asserted":credited_points.len(),"declared":claimed_points.len(),"total":measured_statements.len(),"percentage":if status != "available" { None } else {Some(credited_points.len() as f64 * 100.0 / measured_statements.len() as f64)}},"assertions":map.assertions.len(),"inventoryAssertions":inputs.assertions.len(),"missingInventoryAssertions":missing_inventory,
            "assertionsWithFlows":rows.iter().filter(|a| a["flows"].as_array().is_some_and(|f| !f.is_empty())).count(),
            "assertionsWithoutFlows":rows.iter().filter(|a| a["flows"].as_array().is_none_or(Vec::is_empty)).count(),
            "observedAssertionsWithoutCurrentExplanation":assertions_without_current_explanation,
            "questions":map.assertions.iter().map(|a| a.questions.len()+a.flows.iter().map(|f| f.questions.len()).sum::<usize>()).sum::<usize>(),
            "currentFlows":current_flows,"draftFlows":draft_flows,"staleFlows":stale_flows,"invalidFlows":invalid_flows,"eligibleFlows":credit_flows,"retiredAssertions":map.retired_assertions.len(),
            "unobservedAssertions":rows.iter().filter(|a| a["observedPassingTests"].as_array().is_none_or(Vec::is_empty)).count(),
            "inventoryFailures":inputs.limitations.iter().filter(|s| s.starts_with("Inventory unavailable for ")).count(),
            "unanchoredStatements":unanchored,
            "runPassed":passed,
            "lines":{"asserted":credited.len(),"declared":declared.len(),"total":total,"percentage":if total==0 || status != "available" {None} else {Some(credited.len() as f64 * 100.0 / total as f64)}}},
        "assertions":rows,"statements":statements,"tests":coverage.view.tests.iter().map(|t| json!({"id":t.id,"file":t.file,"name":t.name,"role":t.role,"outcome":t.outcome,"provenance":t.provenance,
            "hasExecutionEvidence":!t.hits.is_empty() || !t.decisions.is_empty() || !t.lines.is_empty()})).collect::<Vec<_>>(),
        "creditedLines":if !detail { Vec::new() } else { credited.iter().map(|loc| json!({"file":loc.0,"line":loc.1,"assertions":line_assertions.get(loc)})).collect::<Vec<_>>() },
        "unassertedLines":if !detail { Vec::new() } else { denominator.difference(&credited).map(|(f,l)| json!({"file":f,"line":l})).collect::<Vec<_>>() },
        "changes":validation["changes"],"validationErrors":errors,"advisories":model::advisories(map),"limitations":inputs.limitations})
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::evidence_archive::read_archive;
    fn fingerprint() -> RunFingerprint {
        RunFingerprint {
            algorithm: "sha256".into(),
            source: "source".into(),
            tests: "tests".into(),
            dependencies: "dependencies".into(),
            configuration: "configuration".into(),
            instrumenter: "instrumenter".into(),
            execution: "execution".into(),
            combined: "combined".into(),
            source_files: 1,
            test_files: 1,
        }
    }

    /// `byte_column` as it was before it took line starts.
    fn reference_byte_column(
        source: &str,
        line: usize,
        column: usize,
        language: &str,
    ) -> Option<usize> {
        if line == 0 {
            return None;
        }
        let line = source.lines().nth(line - 1)?;
        if language != "javascript" {
            return column.checked_add(1);
        }
        if column == 0 {
            return None;
        }
        let mut units = 0;
        for (byte, ch) in line.char_indices() {
            if units == column - 1 {
                return Some(byte + 1);
            }
            units += ch.len_utf16();
        }
        (units == column - 1).then_some(line.len() + 1)
    }

    #[test]
    fn a_column_from_line_starts_agrees_with_walking_the_file() {
        // JavaScript columns count UTF-16 units, so text whose widths differ --
        // accents, and an emoji that is two units -- is where they could part.
        for source in [
            "",
            "a",
            "a\n",
            "a\r\nb\r\n",
            "x\r",
            "héllo\nwörld\n",
            "😀x\ny😀z\n",
            "const a = 1;\n  b();\n",
        ] {
            let starts = crate::assertion_map::line_starts(source);
            for language in ["javascript", "python"] {
                for line in 0..source.len() + 3 {
                    for column in 0..source.len() + 4 {
                        assert_eq!(
                            byte_column_in(source, &starts, line, column, language),
                            reference_byte_column(source, line, column, language),
                            "{language} {line}:{column} in {source:?}"
                        );
                    }
                }
            }
        }
    }

    #[test]
    fn upgrading_supercov_does_not_make_every_map_stale() {
        // The instrumenter digest covers Supercov's own source, so every
        // release of it moved. The claims in a map are about the project's
        // code; a new Supercov re-derives the evidence they rest on rather than
        // making them wrong.
        let before = fingerprint();
        let mut after = fingerprint();
        after.instrumenter = "a new supercov".into();
        let delta = context_delta(&before, &after, "context", "context");
        assert!(!delta.execution);
        assert!(!delta.dependencies);
    }

    #[test]
    fn a_dependency_upgrade_is_reported_without_invalidating_anything() {
        // It is separated, not ignored: an upgrade can falsify an authored
        // explanation with no project file touched. One assessment answers for
        // it, and credit survives in the meantime.
        let before = fingerprint();
        let mut after = fingerprint();
        after.dependencies = "an upgraded lockfile".into();
        let delta = context_delta(&before, &after, "context", "context");
        assert!(delta.dependencies);
        assert!(!delta.execution, "an upgrade must not invalidate flows");
    }

    #[test]
    fn what_actually_executes_still_invalidates_every_flow() {
        // tsconfig, Babel and the declared context decide what runs. A flow
        // acknowledged under the old one has to be read again.
        let before = fingerprint();
        let mut after = fingerprint();
        after.configuration = "a different tsconfig".into();
        assert!(context_delta(&before, &after, "context", "context").execution);
        assert!(
            context_delta(&before, &fingerprint(), "context", "another context").execution,
            "declared context variables still count"
        );
        assert!(!context_delta(&before, &fingerprint(), "context", "context").execution);
    }

    #[test]
    fn report_cache_requires_exact_revision_and_intact_payload() {
        let directory =
            std::env::temp_dir().join(format!("supercov-report-cache-{}", std::process::id()));
        fs::create_dir_all(&directory).unwrap();
        let path = directory.join(REPORT_CACHE_FILE);
        let report = json!({"summary":{"statements":{"asserted":4,"percentage":97.02842377260981}},"assertions":[]});
        let mut cache = json!({"key":"revision-one","digest":digest(&report),"report":report});
        fs::write(&path, serde_json::to_vec(&cache).unwrap()).unwrap();
        assert_eq!(read_report_cache(&path, "revision-one"), Some(report));
        assert!(read_report_cache(&path, "revision-two").is_none());
        cache["report"]["summary"]["statements"]["asserted"] = json!(100);
        fs::write(&path, serde_json::to_vec(&cache).unwrap()).unwrap();
        assert!(read_report_cache(&path, "revision-one").is_none());
        fs::write(&path, "interrupted write").unwrap();
        assert!(read_report_cache(&path, "revision-one").is_none());
        fs::remove_dir_all(directory).unwrap();
    }
    use crate::evidence_archive::{EvidenceArchiveEntry, write_archive};

    /// Publication writes the summary `runs latest` shows from the coverage it
    /// analysed; a query that computes it from the evidence must arrive at the
    /// same cache, byte for byte.
    #[test]
    fn the_summary_written_at_publication_is_the_one_a_query_computes() {
        let root = std::env::temp_dir().join(format!(
            "supercov-summary-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir_all(root.join("src")).unwrap();
        fs::create_dir_all(root.join("tests")).unwrap();
        fs::write(
            root.join("src/app.js"),
            "function work() {\n  return 1;\n}\nfunction idle() {\n  return 2;\n}\n",
        )
        .unwrap();
        fs::write(
            root.join("tests/app.test.js"),
            "import assert from 'node:assert/strict';\nassert.equal(work(), 1);\n",
        )
        .unwrap();
        let inputs = crate::assertion_inputs::capture(
            &root,
            "python",
            ["src/app.js".into(), "tests/app.test.js".into()],
        )
        .unwrap();
        let directory = crate::run_store::create_analyzable_test_run(&root, "first");
        let path = directory.join("evidence.raw.gz");
        let entries =
            crate::assertion_inputs::append(read_archive(&path).unwrap(), &inputs).unwrap();
        let archive = write_archive(entries, &path).unwrap();
        let metadata_path = directory.join("run.json");
        let mut metadata: RunMetadata =
            serde_json::from_slice(&fs::read(&metadata_path).unwrap()).unwrap();
        metadata.raw_evidence.files = archive.files;
        metadata.raw_evidence.compressed_bytes = archive.compressed_bytes;
        metadata.raw_evidence.uncompressed_bytes = archive.uncompressed_bytes;
        fs::write(&metadata_path, serde_json::to_vec(&metadata).unwrap()).unwrap();
        let run = discover_runs(&root).unwrap().runs.remove(0);
        let analysed = crate::run_store::analyze_stored_run(&run).unwrap();
        // The one analysis publication makes is the one the assertion store
        // made for itself, but for the run's integrity record, which neither
        // the summary nor the execution record reads.
        let mut own = coverage(&run).unwrap();
        for (view, published) in [
            (&mut own.view, &analysed.view),
            (&mut own.filters.passed, &analysed.filters.passed),
            (&mut own.filters.failed, &analysed.filters.failed),
        ] {
            assert!(view.integrity.is_none() && published.integrity.is_some());
            view.integrity = published.integrity.clone();
        }
        assert_eq!(own, analysed);
        prepare_publication(&root, &directory, &metadata, Some(&analysed)).unwrap();
        // A frontend that archived the inputs hands them over instead of the
        // store reading them back; what it writes is the same.
        let files = [MAP_FILE, STATE_FILE, SUMMARY_CACHE_FILE];
        let from_archive = files.map(|file| fs::read(directory.join(file)).unwrap());
        for file in files {
            fs::remove_file(directory.join(file)).unwrap();
        }
        let digest = format!("{:x}", Sha256::digest(fs::read(&path).unwrap()));
        prepare_publication_with(
            &root,
            &directory,
            &metadata,
            Some(&analysed),
            Some(archived_manifest(inputs.manifest(), digest).unwrap()),
        )
        .unwrap();
        for (file, expected) in files.iter().zip(&from_archive) {
            assert_eq!(
                &fs::read(directory.join(file)).unwrap(),
                expected,
                "{file} is the one the archive gives"
            );
        }
        let cache = directory.join(SUMMARY_CACHE_FILE);
        let written = fs::read(&cache).expect("publication wrote the summary");
        let summary = report_summary(&root, &run).unwrap();
        fs::remove_file(&cache).unwrap();
        let computed = report_summary(&root, &run).unwrap();
        assert_eq!(fs::read(&cache).unwrap(), written, "the same cache");
        assert_eq!(summary, computed, "and the same summary");
        fs::write(root.join("src/app.js"), "function work() { return 3; }\n").unwrap();
        assert!(
            report_summary(&root, &run).is_err(),
            "a warmed summary must not bypass current-source validation"
        );
        fs::remove_dir_all(root).unwrap();
    }

    /// Publish one run over a two-function file whose test ran one of them,
    /// then ask which tests each edit affects.
    #[test]
    fn publication_records_what_each_test_ran_and_affected_tests_reads_it() {
        let root = std::env::temp_dir().join(format!("supercov-affected-{}", std::process::id()));
        let _ = fs::remove_dir_all(&root);
        fs::create_dir_all(root.join("src")).unwrap();
        fs::create_dir_all(root.join("tests")).unwrap();
        // The fixture's one point sits at line 1, column 0, so `work` has to
        // start the file: an `export` keyword there would belong to the top
        // level, not to the function.
        let app = "function work() {\n  return 1;\n}\nfunction idle() {\n  return 2;\n}\n";
        let test = "import assert from 'node:assert/strict';\nassert.equal(work(), 1);\n";
        fs::write(root.join("src/app.js"), app).unwrap();
        fs::write(root.join("tests/app.test.js"), test).unwrap();
        // The fixture run's one point sits at line 1, column 0 of src/app.js
        // with a zero-based byte column, which is how every non-JavaScript
        // frontend reports; the language is named for that.
        let inputs = crate::assertion_inputs::capture(
            &root,
            "python",
            ["src/app.js".into(), "tests/app.test.js".into()],
        )
        .unwrap();
        let directory = crate::run_store::create_analyzable_test_run(&root, "first");
        let path = directory.join("evidence.raw.gz");
        let entries =
            crate::assertion_inputs::append(read_archive(&path).unwrap(), &inputs).unwrap();
        let archive = write_archive(entries, &path).unwrap();
        let metadata_path = directory.join("run.json");
        let mut metadata: RunMetadata =
            serde_json::from_slice(&fs::read(&metadata_path).unwrap()).unwrap();
        metadata.raw_evidence.files = archive.files;
        metadata.raw_evidence.compressed_bytes = archive.compressed_bytes;
        metadata.raw_evidence.uncompressed_bytes = archive.uncompressed_bytes;
        fs::write(&metadata_path, serde_json::to_vec(&metadata).unwrap()).unwrap();
        prepare_publication(&root, &directory, &metadata, None).unwrap();
        let run = discover_runs(&root).unwrap().runs.remove(0);
        let stored = load_manifest(&run).unwrap();
        let (_, state) = load(&run, &stored).unwrap();
        let executions = state.executions.as_ref().expect("a record");
        let code = stored.manifest.files["src/app.js"].code.as_ref().unwrap();
        let work = code.units.iter().position(|u| u.path == "work").unwrap();
        let idle = code.units.iter().position(|u| u.path == "idle").unwrap();
        assert_eq!(executions.tests.len(), 1);
        let record = &executions.tests[0];
        assert_eq!(record.test.file, "tests/app.test.js");
        assert_eq!(record.test.name, "test");
        assert!(record.passed);
        assert_eq!(record.files["src/app.js"], vec![work]);
        assert_eq!(
            executions.probed["src/app.js"],
            vec![work],
            "idle holds no probe in this run"
        );
        let _ = idle;

        let names = |value: &Value, key: &str| {
            value[key]
                .as_array()
                .unwrap()
                .iter()
                .map(|t| t["name"].as_str().unwrap().to_owned())
                .collect::<Vec<_>>()
        };
        // Nothing changed.
        let report = affected_tests(&root, &run).unwrap();
        assert!(names(&report, "affected").is_empty(), "{report}");
        assert_eq!(names(&report, "unaffected"), ["test"]);
        assert_eq!(report["summary"]["changedFiles"], 0);
        // A comment: still nothing.
        fs::write(root.join("src/app.js"), format!("// about\n{app}")).unwrap();
        let report = affected_tests(&root, &run).unwrap();
        assert!(names(&report, "affected").is_empty(), "{report}");
        assert_eq!(report["changedFiles"][0]["change"], "formatting");
        // A body the test ran: affected, and it says which.
        fs::write(
            root.join("src/app.js"),
            app.replace("return 1;", "return 1 + 0;"),
        )
        .unwrap();
        let report = affected_tests(&root, &run).unwrap();
        assert_eq!(names(&report, "affected"), ["test"]);
        assert_eq!(
            report["affected"][0]["reasons"][0],
            "src/app.js: work (line 1) changed (this test ran it)"
        );
        // A body the test did not run, once idle has a probe of its own: not
        // affected. Here idle holds none, so the change is not one that can
        // be said to have missed the test, and it counts.
        fs::write(
            root.join("src/app.js"),
            app.replace("return 2;", "return 2 + 0;"),
        )
        .unwrap();
        let report = affected_tests(&root, &run).unwrap();
        assert_eq!(names(&report, "affected"), ["test"], "{report}");
        assert!(
            report["affected"][0]["reasons"][0]
                .as_str()
                .unwrap()
                .contains("this test ran code in this file"),
            "{report}"
        );
        // A declaration added: affected, the file's shape changed.
        fs::write(
            root.join("src/app.js"),
            format!("{app}function more() {{}}\n"),
        )
        .unwrap();
        let report = affected_tests(&root, &run).unwrap();
        assert_eq!(names(&report, "affected"), ["test"]);
        assert_eq!(report["changedFiles"][0]["change"], "declarations");
        // The test file itself.
        fs::write(root.join("src/app.js"), app).unwrap();
        fs::write(root.join("tests/app.test.js"), test.replace("1)", "2)")).unwrap();
        let report = affected_tests(&root, &run).unwrap();
        assert_eq!(names(&report, "affected"), ["test"]);
        assert!(
            report["affected"][0]["reasons"][0]
                .as_str()
                .unwrap()
                .starts_with("test file changed"),
            "{report}"
        );
        // A source file removed.
        fs::write(root.join("tests/app.test.js"), test).unwrap();
        fs::remove_file(root.join("src/app.js")).unwrap();
        let report = affected_tests(&root, &run).unwrap();
        assert_eq!(
            report["affected"][0]["reasons"][0],
            "src/app.js removed (this test ran code in it)"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_test_that_ran_beside_others_is_undetermined_rather_than_unaffected() {
        // A parallel suite's coverage sits in the record nobody could claim,
        // and the tests beside it hold nothing of their own. Reading "this
        // test's record does not mention the changed file" as "this test is
        // unaffected" would answer `0 of 1 tests affected` for a change to the
        // only code the run executed -- and an agent running only the affected
        // tests would run nothing. The run's own bound is what stands in.
        let root = std::env::temp_dir().join(format!(
            "supercov-undetermined-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        let _ = fs::remove_dir_all(&root);
        fs::create_dir_all(root.join("src")).unwrap();
        fs::create_dir_all(root.join("tests")).unwrap();
        let app = "function work() {\n  return 1;\n}\nfunction idle() {\n  return 2;\n}\n";
        let test = "import assert from 'node:assert/strict';\nassert.equal(work(), 1);\n";
        fs::write(root.join("src/app.js"), app).unwrap();
        fs::write(root.join("tests/app.test.js"), test).unwrap();
        let inputs = crate::assertion_inputs::capture(
            &root,
            "python",
            ["src/app.js".into(), "tests/app.test.js".into()],
        )
        .unwrap();
        let directory = crate::run_store::create_run_wide_test_run(&root, "parallel");
        let path = directory.join("evidence.raw.gz");
        let entries =
            crate::assertion_inputs::append(read_archive(&path).unwrap(), &inputs).unwrap();
        let archive = write_archive(entries, &path).unwrap();
        let metadata_path = directory.join("run.json");
        let mut metadata: RunMetadata =
            serde_json::from_slice(&fs::read(&metadata_path).unwrap()).unwrap();
        metadata.raw_evidence.files = archive.files;
        metadata.raw_evidence.compressed_bytes = archive.compressed_bytes;
        metadata.raw_evidence.uncompressed_bytes = archive.uncompressed_bytes;
        fs::write(&metadata_path, serde_json::to_vec(&metadata).unwrap()).unwrap();
        prepare_publication(&root, &directory, &metadata, None).unwrap();
        let run = discover_runs(&root).unwrap().runs.remove(0);

        let (_, state) = load(&run, &load_manifest(&run).unwrap()).unwrap();
        let executions = state.executions.as_ref().expect("a record");
        assert_eq!(executions.tests.len(), 1, "the named test, not the record");
        let record = &executions.tests[0];
        assert_eq!(
            record.attribution,
            crate::coverage_report::ATTRIBUTION_RUN_WIDE
        );
        assert!(
            record.files.is_empty(),
            "it is credited with nothing: {:?}",
            record.files
        );
        assert!(
            !executions.covered["src/app.js"].is_empty(),
            "and the run is credited with what it reached"
        );

        let bucket = |value: &Value, key: &str| {
            value[key]
                .as_array()
                .unwrap()
                .iter()
                .map(|t| t["name"].as_str().unwrap().to_owned())
                .collect::<Vec<_>>()
        };

        // Nothing changed: nothing to rerun, and the run's bound says nothing
        // either.
        let report = affected_tests(&root, &run).unwrap();
        assert_eq!(bucket(&report, "unaffected"), ["test"], "{report}");
        assert!(bucket(&report, "undetermined").is_empty(), "{report}");

        // The one function the run executed changed. The test's own record
        // cannot say whether it reached it, and the run's can.
        fs::write(
            root.join("src/app.js"),
            app.replace("return 1;", "return 3;"),
        )
        .unwrap();
        let report = affected_tests(&root, &run).unwrap();
        assert!(
            bucket(&report, "affected").is_empty(),
            "nothing proves it ran the change: {report}"
        );
        assert_eq!(
            bucket(&report, "undetermined"),
            ["test"],
            "the run reached it, so this test might have: {report}"
        );
        assert_eq!(
            report["undetermined"][0]["attribution"],
            crate::coverage_report::ATTRIBUTION_RUN_WIDE,
            "{report}"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn a_lower_bound_still_proves_what_it_recorded() {
        // Ruby's is the other incomplete attribution: the test is credited
        // with coverage, and that coverage is a floor rather than the whole of
        // what it ran. The floor is still evidence -- a test credited with the
        // changed line ran the changed line -- so it is affected outright,
        // with its own reason, rather than swept into the bucket for tests
        // nothing can say anything about.
        let root = std::env::temp_dir().join(format!(
            "supercov-partial-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        let _ = fs::remove_dir_all(&root);
        fs::create_dir_all(root.join("src")).unwrap();
        fs::create_dir_all(root.join("tests")).unwrap();
        let app = "function work() {\n  return 1;\n}\nfunction idle() {\n  return 2;\n}\n";
        let test = "import assert from 'node:assert/strict';\nassert.equal(work(), 1);\n";
        fs::write(root.join("src/app.js"), app).unwrap();
        fs::write(root.join("tests/app.test.js"), test).unwrap();
        let inputs = crate::assertion_inputs::capture(
            &root,
            "python",
            ["src/app.js".into(), "tests/app.test.js".into()],
        )
        .unwrap();
        let directory = crate::run_store::create_partial_test_run(&root, "partial");
        let path = directory.join("evidence.raw.gz");
        let entries =
            crate::assertion_inputs::append(read_archive(&path).unwrap(), &inputs).unwrap();
        let archive = write_archive(entries, &path).unwrap();
        let metadata_path = directory.join("run.json");
        let mut metadata: RunMetadata =
            serde_json::from_slice(&fs::read(&metadata_path).unwrap()).unwrap();
        metadata.raw_evidence.files = archive.files;
        metadata.raw_evidence.compressed_bytes = archive.compressed_bytes;
        metadata.raw_evidence.uncompressed_bytes = archive.uncompressed_bytes;
        fs::write(&metadata_path, serde_json::to_vec(&metadata).unwrap()).unwrap();
        prepare_publication(&root, &directory, &metadata, None).unwrap();
        let run = discover_runs(&root).unwrap().runs.remove(0);

        let (_, state) = load(&run, &load_manifest(&run).unwrap()).unwrap();
        let record = &state.executions.as_ref().expect("a record").tests[0];
        assert_eq!(
            record.attribution,
            crate::coverage_report::ATTRIBUTION_PARTIAL
        );
        assert!(
            !record.files.is_empty(),
            "a lower bound is coverage it was credited with"
        );

        let names = |value: &Value, key: &str| {
            value[key]
                .as_array()
                .unwrap()
                .iter()
                .map(|t| t["name"].as_str().unwrap().to_owned())
                .collect::<Vec<_>>()
        };
        fs::write(
            root.join("src/app.js"),
            app.replace("return 1;", "return 3;"),
        )
        .unwrap();
        let report = affected_tests(&root, &run).unwrap();
        assert_eq!(
            names(&report, "affected"),
            ["test"],
            "what its own record proves, it proves: {report}"
        );
        assert!(names(&report, "undetermined").is_empty(), "{report}");
        // And the reason is its own, not the run's stand-in.
        let reasons = report["affected"][0]["reasons"].as_array().unwrap();
        assert_eq!(reasons.len(), 1, "{report}");
        let reason = reasons[0].as_str().unwrap();
        assert!(
            reason.contains("this test ran it"),
            "the reason is its own: {report}"
        );
        assert!(
            !reason.contains("the run covered"),
            "and not the run's stand-in: {report}"
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn legacy_maps_import_without_the_old_checkout_and_require_review() {
        let root = std::env::temp_dir().join(format!("supercov-legacy-map-{}", std::process::id()));
        fs::create_dir_all(&root).unwrap();
        let source = "import assert from 'node:assert/strict'; assert.equal(1, 1);\n";
        fs::write(root.join("test.js"), source).unwrap();
        let old =
            crate::assertion_inputs::capture(&root, "javascript", ["test.js".into()]).unwrap();
        let directory = crate::run_store::create_analyzable_test_run(&root, "legacy");
        let path = directory.join("evidence.raw.gz");
        let mut entries = read_archive(&path).unwrap();
        entries.push(EvidenceArchiveEntry {
            path: ARCHIVE_PATH.into(),
            contents: serde_json::to_vec(&old).unwrap(),
        });
        let archive = write_archive(entries, &path).unwrap();
        let metadata_path = directory.join("run.json");
        let mut metadata: RunMetadata =
            serde_json::from_slice(&fs::read(&metadata_path).unwrap()).unwrap();
        metadata.raw_evidence.files = archive.files;
        metadata.raw_evidence.compressed_bytes = archive.compressed_bytes;
        metadata.raw_evidence.uncompressed_bytes = archive.uncompressed_bytes;
        fs::write(&metadata_path, serde_json::to_vec(&metadata).unwrap()).unwrap();
        let run = discover_runs(&root).unwrap().runs.remove(0);
        let stored = load_manifest(&run).unwrap();
        let (map, _) = seed(&old, &stored.evidence_digest);
        let legacy_map = json!({"schemaVersion":1,"assertions":[{"id":map.assertions[0].id,"at":map.assertions[0].at,"analysis":"mapped","observes":[],"flows":[{
            "id":"constant","explanation":"The assertion checks the constant one.","appliesTo":[],"nodes":[],"edges":[],"countsAsAsserted":[],"watch":[{"kind":"span","at":map.assertions[0].at}]
        }]}]});
        let legacy_state = json!({"schemaVersion":1,"inputsDigest":digest(&old),"evidenceDigest":stored.evidence_digest,"reviews":{},"scopeReview":[]});
        write_json(&root, &run, MAP_FILE, &legacy_map).unwrap();
        write_json(&root, &run, STATE_FILE, &legacy_state).unwrap();
        let map = model::parse_stored(&serde_json::to_vec(&legacy_map).unwrap()).unwrap();
        let map_bytes = fs::read(directory.join(MAP_FILE)).unwrap();
        let state_bytes = fs::read(directory.join(STATE_FILE)).unwrap();

        fs::write(root.join("test.js"), format!("\n{source}")).unwrap();
        assert!(load_inputs(&root, &run).is_err());
        let (imported, state) = load(&run, &stored).unwrap();
        let new =
            crate::assertion_inputs::capture(&root, "javascript", ["test.js".into()]).unwrap();
        let (next, state) =
            carry(&imported, &state, &stored.manifest, &new, "new-run", false).unwrap();
        assert_eq!(next.assertions[0].id, map.assertions[0].id);
        assert_eq!(
            next.assertions[0].flows[0].explanation,
            map.assertions[0].flows[0].explanation
        );
        assert!(next.assertions[0].flows[0].basis.is_none());
        assert!(!next.assertions[0].flows[0].questions.is_empty());
        assert_eq!(fs::read(directory.join(MAP_FILE)).unwrap(), map_bytes);
        assert_eq!(fs::read(directory.join(STATE_FILE)).unwrap(), state_bytes);

        // A checkout edited during a run must not prevent publication or
        // discard explanations. The run manifest still identifies its sites.
        let next_directory = crate::run_store::create_analyzable_test_run(&root, "next");
        let mut entries = read_archive(&path).unwrap();
        entries
            .iter_mut()
            .find(|e| e.path == ARCHIVE_PATH)
            .unwrap()
            .contents = serde_json::to_vec(&old.manifest()).unwrap();
        let raw = write_archive(entries, &next_directory.join("evidence.raw.gz")).unwrap();
        let mut next_metadata = metadata.clone();
        next_metadata.id = "next".into();
        next_metadata.started_at = "next".into();
        next_metadata.raw_evidence.compressed_bytes = raw.compressed_bytes;
        next_metadata.raw_evidence.uncompressed_bytes = raw.uncompressed_bytes;
        fs::write(
            next_directory.join("run.json"),
            serde_json::to_vec(&next_metadata).unwrap(),
        )
        .unwrap();
        fs::remove_file(root.join("test.js")).unwrap();
        prepare_publication(&root, &next_directory, &next_metadata, None).unwrap();
        let next_run = discover_runs(&root)
            .unwrap()
            .runs
            .into_iter()
            .find(|r| r.id == "next")
            .unwrap();
        let next_manifest = load_manifest(&next_run).unwrap();
        let (pending, pending_state) = load(&next_run, &next_manifest).unwrap();
        assert_eq!(pending.assertions[0], map.assertions[0]);
        assert!(!pending_state.changes.is_empty());
        assert!(
            !pending_state.flows
                [&flow_key(&pending.assertions[0], &pending.assertions[0].flows[0])]
                .reasons
                .is_empty()
        );
        assert!(load_inputs(&root, &next_run).is_err());
        assert_eq!(fs::read(directory.join(MAP_FILE)).unwrap(), map_bytes);
        assert_eq!(fs::read(directory.join(STATE_FILE)).unwrap(), state_bytes);

        let mut corrupt = state.clone();
        corrupt.evidence_digest = "wrong".into();
        write_json(&root, &run, STATE_FILE, &corrupt).unwrap();
        assert!(load(&run, &stored).is_err());
        fs::remove_dir_all(root).unwrap();
    }
}

//! Reading a saved quality snapshot.
//!
//! Nothing here contacts the provider, needs a credential, or produces a grade.
//! Every number shown was Jev's answer when the snapshot was written; this
//! module only selects, orders and explains.
//!
//! Every value here came from the named-property catalog. A health number is
//! arithmetic this CLI did over those answers, never something the model was
//! asked for, and the text views say so where a reader meets one.

use super::*;

/// How many rows a listing shows unless the caller says otherwise.
pub const DEFAULT_LIMIT: usize = 20;

fn limited<T>(rows: Vec<T>, limit: usize) -> (usize, Vec<T>) {
    let total = rows.len();
    match limit {
        0 => (total, rows),
        limit => (total, rows.into_iter().take(limit).collect()),
    }
}

struct Snapshot {
    id: String,
    manifest: Value,
    files: Vec<Value>,
}

fn open(root: &Path, lane: &str, snapshot: Option<&str>) -> Result<Snapshot, String> {
    let id = store::resolve(root, lane, snapshot)?;
    let (manifest, record) = store::read(root, lane, &id)?;
    Ok(Snapshot {
        id,
        manifest,
        files: record["files"]
            .as_array()
            .ok_or("invalid snapshot file record")?
            .clone(),
    })
}

/// Which instrument wrote a snapshot. Snapshots written before the catalog
/// existed carry no marker and are rubric snapshots.
fn instrument(manifest: &Value) -> &str {
    manifest["instrument"].as_str().unwrap_or("rubric")
}

/// Both catalogs write findings a reader can narrow to; only the rubric did not.
fn is_catalog(snapshot: &Snapshot) -> bool {
    matches!(instrument(&snapshot.manifest), "catalog" | "security")
}

fn is_security(snapshot: &Snapshot) -> bool {
    instrument(&snapshot.manifest) == "security"
}

/// A catalog snapshot read back: the tree, then the weakest files.
fn show_catalog(snapshot: &Snapshot, limit: usize) -> Value {
    let rows: Vec<Value> = snapshot
        .files
        .iter()
        .map(|file| {
            json!({
                "path": file["path"], "health": file["health"], "status": file["status"],
                "present": file["present"], "bytes": file["bytes"],
            })
        })
        .collect();
    let (total, shown) = limited(rows, limit);
    json!({
        "view": if is_security(snapshot) { "security" } else { "quality" },
        "instrument": instrument(&snapshot.manifest), "snapshot": snapshot.id,
        "created_at": snapshot.manifest["created_at"],
        "by_check": snapshot.manifest["by_check"],
        "catalog_version": snapshot.manifest["catalog_version"],
        "model": snapshot.manifest["model"],
        "health": snapshot.manifest["health"],
        "counts": snapshot.manifest["counts"],
        "bytes": snapshot.manifest["bytes"],
        "directories": snapshot.manifest["directories"],
        "total": total, "shown": shown.len(), "files": shown,
    })
}

/// Only the files something fired on, the way `runs gaps` shows only files with
/// uncovered behaviour. The whole point of a default command is that the next
/// question narrows it.
pub fn gaps(
    root: &Path,
    lane: &str,
    snapshot: Option<&str>,
    limit: usize,
) -> Result<Value, String> {
    let snapshot = open(root, lane, snapshot)?;
    if !is_catalog(&snapshot) {
        return Err(format!(
            "snapshot {} was written by the rubric, which has no findings to narrow to; \
             run `supercov quality` to assess with the catalog",
            snapshot.id
        ));
    }
    let rows: Vec<Value> = snapshot
        .files
        .iter()
        .filter(|file| {
            file["present"]
                .as_array()
                .is_some_and(|present| !present.is_empty())
                || file["status"] == "failed"
        })
        .cloned()
        .collect();
    let quiet = snapshot.files.len() - rows.len();
    let (total, shown) = limited(rows, limit);
    Ok(json!({
        "view": "gaps", "instrument": instrument(&snapshot.manifest), "snapshot": snapshot.id,
        "catalog_version": snapshot.manifest["catalog_version"],
        "clean": quiet, "total": total, "shown": shown.len(), "files": shown,
    }))
}

/// One file with every check, and what is known about each one, so a reader can
/// weigh a finding without leaving the output.
fn file_catalog(snapshot: &Snapshot, path: &str) -> Result<Value, String> {
    let file = snapshot
        .files
        .iter()
        .find(|file| file["path"] == path)
        .ok_or_else(|| format!("{path} is not in snapshot {}", snapshot.id))?;
    let empty = Vec::new();
    let known: std::collections::BTreeMap<&str, &Value> = snapshot.manifest["catalog"]
        .as_array()
        .unwrap_or(&empty)
        .iter()
        .filter_map(|entry| Some((entry["check"].as_str()?, entry)))
        .collect();
    let mut checks: Vec<Value> = file["checks"]
        .as_object()
        .map(|values| {
            values
                .iter()
                .map(|(id, value)| {
                    let entry = known.get(id.as_str());
                    json!({
                        "check": id, "value": value,
                        "present": value.as_f64().unwrap_or(0.0) >= super::catalog::PRESENT_AT,
                        "asks": entry.map(|e| e["asks"].clone()),
                        "evidence": entry.map(|e| e["evidence"].clone()),
                    })
                })
                .collect()
        })
        .unwrap_or_default();
    checks.sort_by(|a, b| {
        b["value"]
            .as_f64()
            .unwrap_or(0.0)
            .total_cmp(&a["value"].as_f64().unwrap_or(0.0))
    });
    Ok(json!({
        "view": "file", "instrument": instrument(&snapshot.manifest), "snapshot": snapshot.id,
        "path": path, "health": file["health"], "bytes": file["bytes"],
        "status": file["status"], "checks": checks,
    }))
}

/// What changed between two assessments.
///
/// This is the decline gate. A file's health is the mean of its answers, and a
/// check that fired in the newer snapshot and not the older is a property that
/// appeared. Comparing across catalog versions or models is refused: the
/// questions would differ, and the difference would be read as a change in the
/// code.
pub fn diff(root: &Path, lane: &str, from: &str, to: &str, limit: usize) -> Result<Value, String> {
    let (before, after) = (open(root, lane, Some(from))?, open(root, lane, Some(to))?);
    if before.id == after.id {
        return Err(format!("{} is the same snapshot twice", before.id));
    }
    for snapshot in [&before, &after] {
        if !is_catalog(snapshot) {
            return Err(format!(
                "snapshot {} was not written by the catalog and cannot be compared with one",
                snapshot.id
            ));
        }
    }
    for field in ["catalog_version", "model"] {
        if before.manifest[field] != after.manifest[field] {
            return Err(format!(
                "snapshot {} has {field} {} and {} has {}; only snapshots of the same catalog \
                 and model can be compared, because the questions would otherwise differ",
                before.id, before.manifest[field], after.id, after.manifest[field]
            ));
        }
    }
    let index = |snapshot: &Snapshot| -> BTreeMap<String, Value> {
        snapshot
            .files
            .iter()
            .filter(|file| file["status"] == "completed")
            .filter_map(|file| Some((file["path"].as_str()?.to_owned(), file.clone())))
            .collect()
    };
    let (old, new) = (index(&before), index(&after));
    let fired = |file: &Value| -> BTreeSet<String> {
        file["present"]
            .as_array()
            .map(|present| {
                present
                    .iter()
                    .filter_map(|p| p["check"].as_str().map(str::to_owned))
                    .collect()
            })
            .unwrap_or_default()
    };

    let (mut declined, mut improved, mut added, mut removed) =
        (Vec::new(), Vec::new(), Vec::new(), Vec::new());
    let mut unchanged = 0usize;
    for (path, file) in &new {
        let Some(was) = old.get(path) else {
            added.push(json!({ "path": path, "health": file["health"],
                "present": file["present"] }));
            continue;
        };
        let (before_health, after_health) = (was["health"].as_f64(), file["health"].as_f64());
        let appeared: Vec<String> = fired(file).difference(&fired(was)).cloned().collect();
        let gone: Vec<String> = fired(was).difference(&fired(file)).cloned().collect();
        let same_source = was["bytes"] == file["bytes"];
        let row = json!({
            "path": path, "from": before_health, "to": after_health,
            "movement": match (before_health, after_health) {
                (Some(a), Some(b)) => json!(((b - a) * 100.0).round() / 100.0),
                _ => Value::Null,
            },
            "appeared": appeared, "no_longer_present": gone,
            // Identical bytes mean the same question was asked twice, so a
            // movement is the model's own variation rather than a change.
            "same_source": same_source,
        });
        match (before_health, after_health) {
            (Some(a), Some(b)) if b < a => declined.push(row),
            (Some(a), Some(b)) if b > a => improved.push(row),
            _ if !appeared.is_empty() || !gone.is_empty() => declined.push(row),
            _ => unchanged += 1,
        }
    }
    for (path, file) in &old {
        if !new.contains_key(path) {
            removed.push(json!({ "path": path, "health": file["health"] }));
        }
    }
    let by_movement = |rows: &mut Vec<Value>| {
        rows.sort_by(|a, b| {
            a["movement"]
                .as_f64()
                .unwrap_or(0.0)
                .total_cmp(&b["movement"].as_f64().unwrap_or(0.0))
        });
    };
    by_movement(&mut declined);
    by_movement(&mut improved);
    improved.reverse();
    let appeared_total: usize = declined
        .iter()
        .map(|row| row["appeared"].as_array().map(Vec::len).unwrap_or(0))
        .sum();
    let (declined_total, declined_rows) = limited(declined, limit);
    let (improved_total, improved_rows) = limited(improved, limit);
    Ok(json!({
        "view": "quality-diff",
        "from": before.id, "to": after.id,
        "from_created_at": before.manifest["created_at"],
        "to_created_at": after.manifest["created_at"],
        "catalog_version": after.manifest["catalog_version"],
        "model": after.manifest["model"],
        "health": {
            "from": before.manifest["health"], "to": after.manifest["health"],
        },
        "counts": {
            "declined": declined_total, "improved": improved_total,
            "unchanged": unchanged, "added": added.len(), "removed": removed.len(),
            "properties_appeared": appeared_total,
        },
        "declined": declined_rows, "improved": improved_rows,
        "added": added, "removed": removed,
    }))
}

pub fn snapshots(root: &Path, lane: &str, limit: usize) -> Result<Value, String> {
    let rows: Vec<Value> = store::list(root, lane)?
        .into_iter()
        .map(|(id, manifest)| {
            json!({
                "id": id,
                "created_at": manifest["created_at"],
                "paths": manifest["paths"],
                "model": manifest["model"],
                "instrument": instrument(&manifest),
                "rubric_version": manifest["rubric_version"],
                "catalog_version": manifest["catalog_version"],
                "counts": manifest["counts"],
                "parent": manifest["parent"],
                "deepened": manifest["deepened"],
            })
        })
        .collect();
    let (total, shown) = limited(rows, limit);
    Ok(
        json!({"view": "snapshots", "lane": lane, "total": total, "shown": shown.len(),
        "snapshots": shown}),
    )
}

pub fn show(
    root: &Path,
    lane: &str,
    snapshot: Option<&str>,
    limit: usize,
) -> Result<Value, String> {
    Ok(show_catalog(&open(root, lane, snapshot)?, limit))
}

pub fn file(root: &Path, lane: &str, path: &str, snapshot: Option<&str>) -> Result<Value, String> {
    file_catalog(&open(root, lane, snapshot)?, path)
}

/// One text rendering for every view, chosen by the tag the view carries.
/// One band rather than a decimal, because the measured resolution of these
/// judgments is about a point and two decimals would claim precision nobody
/// observed. The number stays in `--json`, where something has to sort.
fn band(health: Option<f64>) -> &'static str {
    // Banded on the number a reader sees, not the one behind it, so 4.95 can
    // never print as `weak (5.0/10)`.
    match health.map(|h| (h * 10.0).round() / 10.0) {
        Some(h) if h >= 8.0 => "good",
        Some(h) if h >= 5.0 => "fair",
        Some(_) => "weak",
        None => "—",
    }
}

fn render_quality(view: &Value) -> String {
    let empty = Vec::new();
    let mut out = String::new();
    let health = view["health"].as_f64();
    out.push_str(&format!(
        "Quality {} ({:.1}/10) over {} files.\n",
        band(health),
        health.unwrap_or(0.0),
        view["counts"]["scored"].as_u64().unwrap_or(0)
    ));
    out.push_str(&format!(
        "Catalog {}, model {}, snapshot {}.\n\n",
        view["catalog_version"].as_str().unwrap_or("?"),
        view["model"].as_str().unwrap_or("?"),
        view["snapshot"].as_str().unwrap_or("?")
    ));
    let files = view["files"].as_array().unwrap_or(&empty);
    if !files.is_empty() {
        out.push_str("Weakest first:\n");
    }
    for file in files {
        let fired: Vec<&str> = file["present"]
            .as_array()
            .unwrap_or(&empty)
            .iter()
            .filter_map(|p| p["check"].as_str())
            .collect();
        out.push_str(&format!(
            "  {:>5}  {}\n",
            band(file["health"].as_f64()),
            file["path"].as_str().unwrap_or("?")
        ));
        if !fired.is_empty() {
            out.push_str(&format!("         {}\n", fired.join(", ")));
        }
    }
    let total = view["total"].as_u64().unwrap_or(0) as usize;
    if total > files.len() {
        out.push_str(&format!("  ... and {} more\n", total - files.len()));
    }
    out.push_str("\nNarrow with `quality gaps`, or read one with `quality file <path>`.\n");
    out
}

/// A saved security assessment: no number, flagged files first.
fn render_security(view: &Value) -> String {
    let empty = Vec::new();
    let mut out = String::new();
    let counts = &view["counts"];
    let assessed = counts["assessed"].as_u64().unwrap_or(0);
    let flagged = counts["flagged"].as_u64().unwrap_or(0);
    out.push_str(&format!(
        "Security: {flagged} of {assessed} files flagged, {} clean.\n",
        assessed.saturating_sub(flagged)
    ));
    if let Some(by_check) = view["by_check"].as_object()
        && !by_check.is_empty()
    {
        let mut pairs: Vec<(&String, u64)> = by_check
            .iter()
            .map(|(c, n)| (c, n.as_u64().unwrap_or(0)))
            .collect();
        pairs.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(b.0)));
        let named: Vec<String> = pairs.iter().map(|(c, n)| format!("{c} {n}")).collect();
        out.push_str(&format!("  {}\n", named.join(", ")));
    }
    out.push_str(&format!(
        "Catalog {}, model {}, snapshot {}.\n\n",
        view["catalog_version"].as_str().unwrap_or("?"),
        view["model"].as_str().unwrap_or("?"),
        view["snapshot"].as_str().unwrap_or("?")
    ));
    let files = view["files"].as_array().unwrap_or(&empty);
    let mut listed = 0usize;
    for file in files {
        let fired = file["present"].as_array().unwrap_or(&empty);
        if fired.is_empty() {
            continue;
        }
        if listed == 0 {
            out.push_str("Flagged:\n");
        }
        listed += 1;
        out.push_str(&format!("  {}\n", file["path"].as_str().unwrap_or("?")));
        for finding in fired {
            out.push_str(&format!(
                "    {:.2}  {}\n",
                finding["value"].as_f64().unwrap_or(0.0),
                finding["check"].as_str().unwrap_or("?")
            ));
        }
    }
    let total = view["total"].as_u64().unwrap_or(0) as usize;
    if total > files.len() {
        out.push_str(&format!("  ... and {} more files\n", total - files.len()));
    }
    out.push_str("\nNarrow with `security gaps`, or read one with `security file <path>`.\n");
    out
}

fn render_gaps(view: &Value) -> String {
    let empty = Vec::new();
    let files = view["files"].as_array().unwrap_or(&empty);
    let mut out = String::new();
    if files.is_empty() {
        return "Nothing fired on any assessed file.\n".into();
    }
    out.push_str(&format!(
        "{} files with findings, {} clean.\n\n",
        view["total"].as_u64().unwrap_or(0),
        view["clean"].as_u64().unwrap_or(0)
    ));
    for file in files {
        out.push_str(&format!("{}\n", file["path"].as_str().unwrap_or("?")));
        for finding in file["present"].as_array().unwrap_or(&empty) {
            out.push_str(&format!(
                "  {:.2}  {}\n",
                finding["value"].as_f64().unwrap_or(0.0),
                finding["check"].as_str().unwrap_or("?")
            ));
        }
    }
    out
}

fn render_file_catalog(view: &Value) -> String {
    let empty = Vec::new();
    let mut out = String::new();
    match view["health"].as_f64() {
        Some(health) => out.push_str(&format!(
            "{}  quality {} ({health:.1}/10)\n\n",
            view["path"].as_str().unwrap_or("?"),
            band(Some(health))
        )),
        None => out.push_str(&format!(
            "{}  security surface\n\n",
            view["path"].as_str().unwrap_or("?")
        )),
    }
    for check in view["checks"].as_array().unwrap_or(&empty) {
        let present = check["present"].as_bool().unwrap_or(false);
        out.push_str(&format!(
            "  {}  {:.2}  {}\n",
            if present { "yes" } else { " no" },
            check["value"].as_f64().unwrap_or(0.0),
            check["check"].as_str().unwrap_or("?")
        ));
        if present && let Some(asks) = check["asks"].as_str() {
            out.push_str(&format!("            {asks}\n"));
        }
    }
    out.push_str("\nEach line is a model judgment you can check against the file.\n");
    out
}

fn render_scope(view: &Value) -> String {
    let empty = Vec::new();
    let summary = &view["summary"];
    let mut out = String::new();
    out.push_str(&format!(
        "Source scope, {} mode: {} included, {} ambiguous, {} excluded.\n",
        summary["mode"].as_str().unwrap_or("?"),
        summary["included"].as_u64().unwrap_or(0),
        summary["ambiguous"].as_u64().unwrap_or(0),
        summary["excluded"].as_u64().unwrap_or(0)
    ));
    let roots: Vec<&str> = summary["roots"]
        .as_array()
        .unwrap_or(&empty)
        .iter()
        .filter_map(|r| r.as_str())
        .collect();
    out.push_str(&format!(
        "Roots: {}\n",
        if roots.is_empty() {
            "(none found)".to_owned()
        } else {
            roots.join(", ")
        }
    ));
    if let Some(reasons) = summary["reasons"].as_object() {
        out.push('\n');
        for (reason, count) in reasons {
            out.push_str(&format!("  {:>5}  {reason}\n", count.as_u64().unwrap_or(0)));
        }
    }
    let shown = view["not_included"].as_array().unwrap_or(&empty);
    if !shown.is_empty() {
        out.push_str("\nNot assessed:\n");
    }
    for entry in shown {
        out.push_str(&format!(
            "  {:<10} {}  ({})\n",
            entry["status"].as_str().unwrap_or("?"),
            entry["path"].as_str().unwrap_or("?"),
            entry["reason"].as_str().unwrap_or("?")
        ));
    }
    let total = view["total_not_included"].as_u64().unwrap_or(0) as usize;
    if total > shown.len() {
        out.push_str(&format!("  ... and {} more\n", total - shown.len()));
    }
    if let Some(limitation) = view["limitation"].as_str() {
        out.push_str(&format!("\n{limitation}\n"));
    }
    out
}

fn render_quality_diff(view: &Value) -> String {
    let empty = Vec::new();
    let mut out = String::new();
    let counts = &view["counts"];
    out.push_str(&format!(
        "Comparing {} with {}.\n",
        view["from"].as_str().unwrap_or("?"),
        view["to"].as_str().unwrap_or("?")
    ));
    let (was, now) = (
        view["health"]["from"].as_f64(),
        view["health"]["to"].as_f64(),
    );
    match (was, now) {
        (Some(a), Some(b)) => out.push_str(&format!(
            "Health {} ({a:.1}) to {} ({b:.1}).\n\n",
            band(was),
            band(now)
        )),
        _ => out.push('\n'),
    }
    out.push_str(&format!(
        "{} declined, {} improved, {} unchanged, {} added, {} removed.\n",
        counts["declined"].as_u64().unwrap_or(0),
        counts["improved"].as_u64().unwrap_or(0),
        counts["unchanged"].as_u64().unwrap_or(0),
        counts["added"].as_u64().unwrap_or(0),
        counts["removed"].as_u64().unwrap_or(0),
    ));
    let appeared = counts["properties_appeared"].as_u64().unwrap_or(0);
    if appeared > 0 {
        out.push_str(&format!(
            "{appeared} properties appeared that were not there before.\n"
        ));
    }
    let none: Vec<Value> = Vec::new();
    let section = |out: &mut String, title: &str, rows: &Vec<Value>| {
        if rows.is_empty() {
            return;
        }
        out.push_str(&format!("\n{title}\n"));
        for row in rows {
            let movement = row["movement"].as_f64().unwrap_or(0.0);
            out.push_str(&format!(
                "  {movement:+.2}  {}\n",
                row["path"].as_str().unwrap_or("?")
            ));
            let appeared: Vec<&str> = row["appeared"]
                .as_array()
                .unwrap_or(&none)
                .iter()
                .filter_map(|v| v.as_str())
                .collect();
            if !appeared.is_empty() {
                out.push_str(&format!("          appeared: {}\n", appeared.join(", ")));
            }
            if row["same_source"] == true {
                out.push_str(
                    "          the file did not change, so this is the model's own variation\n",
                );
            }
        }
    };
    section(
        &mut out,
        "Declined:",
        view["declined"].as_array().unwrap_or(&empty),
    );
    section(
        &mut out,
        "Improved:",
        view["improved"].as_array().unwrap_or(&empty),
    );
    out
}

pub fn render(view: &Value) -> String {
    match view["view"].as_str().unwrap_or_default() {
        "quality-diff" => render_quality_diff(view),
        "scope" => render_scope(view),
        "quality" => render_quality(view),
        "security" => render_security(view),
        "gaps" => render_gaps(view),
        "file" => render_file_catalog(view),
        "snapshots" => render_snapshots(view),
        other => format!("unknown quality view: {other}\n"),
    }
}

fn render_snapshots(view: &Value) -> String {
    let rows = view["snapshots"].as_array().map_or(&[][..], Vec::as_slice);
    let lane = view["lane"].as_str().unwrap_or("quality");
    if rows.is_empty() {
        return format!(
            "No {lane} snapshots here yet. Assess some source: supercov {lane} <path>\n"
        );
    }
    let mut text = format!(
        "{} {lane} snapshots, most recent first (showing {}).\n",
        view["total"], view["shown"]
    );
    for row in rows {
        let counts = &row["counts"];
        text.push_str(&format!(
            "\n{} — {}\n   {} assessed, {} windowed, {} errors; scanned {}\n",
            row["id"].as_str().unwrap_or("?"),
            row["created_at"].as_str().unwrap_or("?"),
            counts["assessed"],
            counts["partial"],
            counts["errors"],
            row["paths"].as_array().map_or(String::new(), |paths| paths
                .iter()
                .filter_map(|p| p.as_str())
                .collect::<Vec<_>>()
                .join(" ")),
        ));
        if let Some(parent) = row["parent"].as_str() {
            text.push_str(&format!(
                "   {} declarations assessed, deepened from {parent}: {}\n",
                counts["declarations"],
                row["deepened"]
                    .as_array()
                    .map_or(String::new(), |paths| paths
                        .iter()
                        .filter_map(|path| path.as_str())
                        .collect::<Vec<_>>()
                        .join(" ")),
            ));
        }
    }
    text
}

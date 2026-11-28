use serde::{Deserialize, Deserializer};

use crate::state::{BotId, EpochMs, ItemId};

/// The contract major an absent `version` key reads as.
fn contract_one() -> u32 {
    1
}

/// Reads a JSON null as an empty list, so a null `options` key parses.
fn null_as_empty<'de, D>(deserializer: D) -> Result<Vec<String>, D::Error>
where
    D: Deserializer<'de>,
{
    let value = Option::<Vec<String>>::deserialize(deserializer)?;
    Ok(value.unwrap_or_default())
}

/// The `status --json` payload.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct StatusPayload {
    /// The payload contract major.
    #[serde(default = "contract_one")]
    pub version: u32,
    /// When the index was built.
    pub built_at: Option<String>,
    /// When the index was last updated, the field the header ages.
    pub updated_at: Option<String>,
    /// Whether the index is stale.
    pub stale: bool,
    /// One row per bot.
    pub rows: Vec<StatusRow>,
}

/// One bot's row in the status payload.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct StatusRow {
    /// The row's kind.
    pub kind: String,
    /// The bot's identity.
    pub identity: String,
    /// The bot's id.
    pub bot_id: String,
    /// The bot's state word.
    pub state: String,
    /// The checkout the bot's job runs against, on a bot row.
    pub path: Option<String>,
    /// The item's id, on a needs-you row.
    pub item_id: Option<String>,
}

/// The `activity --json` payload.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct ActivityPayload {
    /// The payload contract major.
    #[serde(default = "contract_one")]
    pub version: u32,
    /// The groups the pane draws in order.
    pub groups: Vec<ActivityGroup>,
}

/// One group of activity rows.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct ActivityGroup {
    /// The group's id.
    pub id: String,
    /// The group's heading.
    pub title: String,
    /// The rows the group holds.
    pub rows: Vec<ActivityRow>,
}

/// One activity row.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct ActivityRow {
    /// The bot's id.
    pub bot_id: String,
    /// The bot's identity.
    pub identity: String,
    /// The row's state.
    pub state: RunState,
    /// The row's timestamp.
    pub at: String,
    /// Who or what started the run.
    pub actor: Option<String>,
    /// The run's id, absent on a scheduled or recurring row.
    pub run_id: Option<String>,
    /// The start's summary phrase on a recurring row.
    pub schedule: Option<String>,
}

/// The `inbox --json` payload.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct InboxPayload {
    /// The payload contract major.
    #[serde(default = "contract_one")]
    pub version: u32,
    /// The items the pane draws in order.
    pub items: Vec<InboxItem>,
}

/// One inbox item.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct InboxItem {
    /// The item's id, the selection key and the answer target.
    pub id: ItemId,
    /// The bot's id.
    pub bot_id: String,
    /// The item's kind, absent until a later packet writes one.
    pub kind: Option<String>,
    /// The question the item asks.
    pub question: String,
    /// The item's state.
    pub state: ItemState,
    /// The item's timestamp.
    pub at: String,
    /// The choices the item offers, empty for a decision.
    #[serde(deserialize_with = "null_as_empty")]
    pub options: Vec<String>,
    /// When the item stops being answerable.
    pub expires_at: String,
    /// The grant the item carries, when it carries one.
    pub grants: Option<Grant>,
}

/// A grant an inbox item carries.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct Grant {
    /// The grant's kind.
    pub kind: String,
    /// The grant's rung.
    pub rung: String,
}

/// The `routines --json` payload.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct RoutinesPayload {
    /// The payload contract major.
    #[serde(default = "contract_one")]
    pub version: u32,
    /// The routines the pane draws in order.
    pub routines: Vec<Routine>,
}

/// One routine, drawn as a sentence.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct Routine {
    /// The routine's bot id, the selection key.
    pub bot_id: BotId,
    /// What the routine does, in one phrase.
    pub what: String,
    /// The starts that trigger it.
    pub starts: Vec<Start>,
    /// What it does once started.
    pub does: String,
    /// The condition that stops it.
    pub until: Option<String>,
    /// When the stop condition was met.
    pub until_met_at: Option<String>,
    /// How many runs in a row have failed.
    pub failure_streak: u32,
    /// The switch's state word.
    pub switch: String,
}

/// One start that triggers a routine.
#[derive(Clone, Debug, Default, PartialEq, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct Start {
    /// The start's kind.
    pub kind: String,
    /// The start's expression, when it has one.
    pub expression: Option<String>,
    /// The start's name, when it has one.
    pub name: Option<String>,
    /// The start's summary phrase.
    pub summary: Option<String>,
}

/// A run's state word.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum RunState {
    /// The run is waiting for an answer.
    NeedsYou,
    /// The run is in progress.
    Working,
    /// The run is scheduled and has not started.
    Scheduled,
    /// The run finished.
    Done,
    /// The run was stopped.
    Stopped,
    /// The run failed.
    Failed,
    /// The run repeats on a schedule.
    Recurring,
    /// A state word this build does not know, kept as it arrived.
    Unknown(String),
}

impl RunState {
    /// Reads a wire state word, keeping an unknown one as it arrived.
    pub fn from_raw(raw: &str) -> Self {
        match raw {
            "needs_you" => RunState::NeedsYou,
            "working" => RunState::Working,
            "scheduled" => RunState::Scheduled,
            "done" => RunState::Done,
            "stopped" => RunState::Stopped,
            "failed" => RunState::Failed,
            "recurring" => RunState::Recurring,
            other => RunState::Unknown(other.to_string()),
        }
    }

    /// The wire state word, or the raw text of an unknown one.
    pub fn as_str(&self) -> &str {
        match self {
            RunState::NeedsYou => "needs_you",
            RunState::Working => "working",
            RunState::Scheduled => "scheduled",
            RunState::Done => "done",
            RunState::Stopped => "stopped",
            RunState::Failed => "failed",
            RunState::Recurring => "recurring",
            RunState::Unknown(raw) => raw,
        }
    }
}

impl Default for RunState {
    fn default() -> Self {
        RunState::Unknown(String::new())
    }
}

impl<'de> Deserialize<'de> for RunState {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let raw = String::deserialize(deserializer)?;
        Ok(RunState::from_raw(&raw))
    }
}

/// An inbox item's state word.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ItemState {
    /// The item is waiting for an answer.
    Open,
    /// The item has been answered.
    Answered,
    /// The item stopped being answerable.
    Expired,
    /// A state word this build does not know, kept as it arrived.
    Unknown(String),
}

impl ItemState {
    /// Reads a wire state word, keeping an unknown one as it arrived.
    pub fn from_raw(raw: &str) -> Self {
        match raw {
            "open" => ItemState::Open,
            "answered" => ItemState::Answered,
            "expired" => ItemState::Expired,
            other => ItemState::Unknown(other.to_string()),
        }
    }

    /// The wire state word, or the raw text of an unknown one.
    pub fn as_str(&self) -> &str {
        match self {
            ItemState::Open => "open",
            ItemState::Answered => "answered",
            ItemState::Expired => "expired",
            ItemState::Unknown(raw) => raw,
        }
    }
}

impl Default for ItemState {
    fn default() -> Self {
        ItemState::Unknown(String::new())
    }
}

impl<'de> Deserialize<'de> for ItemState {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let raw = String::deserialize(deserializer)?;
        Ok(ItemState::from_raw(&raw))
    }
}

/// Reads exactly `width` ASCII digits at `start`, or None when any byte is not a digit.
fn digits_at(bytes: &[u8], start: usize, width: usize) -> Option<u32> {
    let end = start.checked_add(width)?;
    let field = bytes.get(start..end)?;
    let mut value = 0u32;
    for byte in field {
        if !byte.is_ascii_digit() {
            return None;
        }
        value = value * 10 + u32::from(byte - b'0');
    }
    Some(value)
}

/// Whether the byte at `index` is `expected`.
fn byte_is(bytes: &[u8], index: usize, expected: u8) -> bool {
    bytes.get(index) == Some(&expected)
}

/// Whether a year is a leap year by the Gregorian rule.
fn is_leap_year(year: u32) -> bool {
    year.is_multiple_of(4) && (!year.is_multiple_of(100) || year.is_multiple_of(400))
}

/// The number of days a month holds, or None when the month is out of range.
fn days_in_month(year: u32, month: u32) -> Option<u32> {
    match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => Some(31),
        4 | 6 | 9 | 11 => Some(30),
        2 => Some(if is_leap_year(year) { 29 } else { 28 }),
        _ => None,
    }
}

/// The day count since 1970-01-01 for a civil date, by the days-from-civil arithmetic.
fn days_from_civil(year: i64, month: i64, day: i64) -> i64 {
    let year = if month <= 2 { year - 1 } else { year };
    let era = (if year >= 0 { year } else { year - 399 }) / 400;
    let year_of_era = year - era * 400;
    let shifted_month = if month > 2 { month - 3 } else { month + 9 };
    let day_of_year = (153 * shifted_month + 2) / 5 + day - 1;
    let day_of_era = year_of_era * 365 + year_of_era / 4 - year_of_era / 100 + day_of_year;
    era * 146_097 + day_of_era - 719_468
}

/// Parses an ISO 8601 UTC timestamp into milliseconds since the epoch.
pub fn parse_utc(text: &str) -> Option<EpochMs> {
    let bytes = text.as_bytes();
    // The shortest accepted shape is `YYYY-MM-DDTHH:MM:SSZ`.
    if bytes.len() < 20 {
        return None;
    }

    let year = digits_at(bytes, 0, 4)?;
    if !byte_is(bytes, 4, b'-') {
        return None;
    }
    let month = digits_at(bytes, 5, 2)?;
    if !byte_is(bytes, 7, b'-') {
        return None;
    }
    let day = digits_at(bytes, 8, 2)?;
    if !byte_is(bytes, 10, b'T') {
        return None;
    }
    let hour = digits_at(bytes, 11, 2)?;
    if !byte_is(bytes, 13, b':') {
        return None;
    }
    let minute = digits_at(bytes, 14, 2)?;
    if !byte_is(bytes, 16, b':') {
        return None;
    }
    let second = digits_at(bytes, 17, 2)?;

    let mut cursor = 19;
    let mut millis = 0i64;
    if byte_is(bytes, cursor, b'.') {
        cursor += 1;
        let start = cursor;
        while bytes.get(cursor).is_some_and(u8::is_ascii_digit) {
            cursor += 1;
        }
        let fraction = bytes.get(start..cursor)?;
        if fraction.is_empty() || fraction.len() > 9 {
            return None;
        }
        // A fraction is truncated to whole milliseconds, so only its first three digits count.
        let mut digits = fraction.iter();
        for _ in 0..3 {
            let digit = digits.next().map_or(0, |byte| i64::from(byte - b'0'));
            millis = millis * 10 + digit;
        }
    }
    if !byte_is(bytes, cursor, b'Z') || cursor + 1 != bytes.len() {
        return None;
    }

    if !(1..=12).contains(&month) {
        return None;
    }
    let month_days = days_in_month(year, month)?;
    if !(1..=month_days).contains(&day) {
        return None;
    }
    if hour > 23 || minute > 59 || second > 59 {
        return None;
    }

    let days = days_from_civil(i64::from(year), i64::from(month), i64::from(day));
    let seconds =
        days * 86_400 + i64::from(hour) * 3_600 + i64::from(minute) * 60 + i64::from(second);
    Some(seconds * 1_000 + millis)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::state::BotId;

    #[test]
    fn missing_key_takes_default() {
        let row: ActivityRow = serde_json::from_str(
            r#"{"botId":"hello","identity":"skilled-scratch/hello","state":"working","at":"2026-11-25T21:12:04.000Z"}"#,
        )
        .expect("an activity row with the four required keys parses");
        assert!(row.actor.is_none());
        assert!(row.run_id.is_none());
        assert!(row.schedule.is_none());

        let status: StatusPayload = serde_json::from_str(r#"{"rows": []}"#)
            .expect("a status payload with no version parses");
        assert_eq!(status.version, 1);

        let item: InboxItem = serde_json::from_str(
            r#"{"id":"20261125T211204Z-7c1e9a40","botId":"hello","question":"Ship the release?","state":"open","at":"2026-11-25T21:12:04.000Z","expiresAt":"2026-11-26T21:12:04.000Z"}"#,
        )
        .expect("an inbox item with no options key parses");
        assert!(item.options.is_empty());
    }

    #[test]
    fn unknown_state_keeps_raw() {
        let row: ActivityRow = serde_json::from_str(
            r#"{"botId":"hello","identity":"skilled-scratch/hello","state":"paused-forever","at":"2026-11-25T21:12:04.000Z"}"#,
        )
        .expect("an activity row with an unknown state parses");
        assert_eq!(row.state, RunState::Unknown("paused-forever".into()));

        let item: InboxItem = serde_json::from_str(
            r#"{"id":"20261125T211204Z-7c1e9a40","botId":"hello","question":"Ship the release?","state":"snoozed","at":"2026-11-25T21:12:04.000Z","expiresAt":"2026-11-26T21:12:04.000Z"}"#,
        )
        .expect("an inbox item with an unknown state parses");
        assert_eq!(item.state, ItemState::Unknown("snoozed".into()));

        assert_eq!(RunState::from_raw("needs_you"), RunState::NeedsYou);
        assert_eq!(RunState::from_raw("needs_you").as_str(), "needs_you");
    }

    #[test]
    fn null_options_parse_as_empty() {
        let null_item: InboxItem = serde_json::from_str(
            r#"{"id":"20261125T211204Z-7c1e9a40","botId":"hello","question":"Ship the release?","state":"open","at":"2026-11-25T21:12:04.000Z","options":null,"expiresAt":"2026-11-26T21:12:04.000Z"}"#,
        )
        .expect("an inbox item with null options parses");
        assert!(null_item.options.is_empty());

        let listed: InboxItem = serde_json::from_str(
            r#"{"id":"20261125T210504Z-3f9d2b11","botId":"digest","question":"Which channel?","state":"open","at":"2026-11-25T21:05:04.000Z","options":["email","chat"],"expiresAt":"2026-11-26T21:05:04.000Z"}"#,
        )
        .expect("an inbox item with two options parses");
        assert_eq!(
            listed.options,
            vec!["email".to_string(), "chat".to_string()]
        );
    }

    #[test]
    fn parse_utc_reads_the_runtime_shape() {
        assert_eq!(parse_utc("1970-01-01T00:00:00Z"), Some(0));
        assert_eq!(
            parse_utc("2026-11-25T21:14:04.000Z"),
            Some(1_795_641_244_000)
        );
        assert_eq!(parse_utc("2026-11-25T21:14:04Z"), Some(1_795_641_244_000));
        assert_eq!(parse_utc("2026-11-25T21:14:04.5Z"), Some(1_795_641_244_500));
        assert!(parse_utc("2024-02-29T00:00:00Z").is_some());
    }

    #[test]
    fn parse_utc_refuses_other_shapes() {
        for text in [
            "2026-11-25T21:14:04",
            "2026-11-25T21:14:04+01:00",
            "2026-11-25",
            "",
            "2026-13-01T00:00:00Z",
            "2023-02-29T00:00:00Z",
            "2026-11-25T24:00:00Z",
        ] {
            assert!(parse_utc(text).is_none(), "{text} must not parse");
        }
    }

    #[test]
    fn sample_payloads_parse() {
        let status: StatusPayload = serde_json::from_str(include_str!(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/tests/fixtures/payloads/status.json"
        )))
        .expect("the status sample parses");
        assert_eq!(status.rows.len(), 7);
        assert_eq!(
            status.rows.iter().filter(|row| row.kind == "bot").count(),
            4
        );
        assert_eq!(status.version, 1);
        assert_eq!(
            status.updated_at.as_deref(),
            Some("2026-11-25T21:13:52.000Z")
        );

        let activity: ActivityPayload = serde_json::from_str(include_str!(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/tests/fixtures/payloads/activity.json"
        )))
        .expect("the activity sample parses");
        assert_eq!(activity.groups.len(), 7);
        let rows: usize = activity.groups.iter().map(|group| group.rows.len()).sum();
        assert_eq!(rows, 10);

        let inbox: InboxPayload = serde_json::from_str(include_str!(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/tests/fixtures/payloads/inbox.json"
        )))
        .expect("the inbox sample parses");
        assert_eq!(inbox.items.len(), 3);
        assert_eq!(
            inbox.items[1].options,
            vec!["email".to_string(), "chat".to_string()]
        );
        assert_eq!(inbox.items[2].state, ItemState::Expired);

        let routines: RoutinesPayload = serde_json::from_str(include_str!(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/tests/fixtures/payloads/routines.json"
        )))
        .expect("the routines sample parses");
        assert_eq!(routines.routines.len(), 2);
        assert_eq!(routines.routines[0].bot_id, BotId("digest".into()));
        assert_eq!(routines.routines[0].failure_streak, 0);
    }
}

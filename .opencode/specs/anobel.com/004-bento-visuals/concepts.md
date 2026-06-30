# Anobel Vloot-functie concepts — visual brief

Source: 9 reference shells (operator images #11–#19). Each is a 560×480-class white card on a dark canvas, with a **"⚓ Vloot-functie"** eyebrow chip (brand blue `#06458c`) top-right, a brand-blue title, and a muted Dutch description. The body is EMPTY — these define the concept + copy; the visuals fill the body in the dashboard-fragment house style (handover §5.5).

House constraints (all visuals): page `#eceef0`; white card radius 22, no border, soft layered shadow; inner panels `#fefefe` + 1px `#ececec` + tight shadow; title 21px/700 `#0a1a2f`; muted text `#4e4e4e` (never `#787878`); palette brand `#06458c`/`#043367`, green `#367e39` status-only, red `#c9140f` alerts-only, **orange = 0**; Hanken Grotesk; reduced-motion guard. Keep the eyebrow chip + ship icon.

## 1. Concepts (verbatim copy from the shells)

| # | Title | Description (NL) | Existing feature family |
|---|---|---|---|
| 1 | **Goedkeuringssysteem** | Controleer bestellingen van de vloot voordat ze worden verwerkt | goedkeuringssysteem |
| 2 | **OCI-koppeling** | Koppel eenvoudig uw systeem met de webshop via een OCI | oci-koppeling |
| 3 | **Accountbeheer** | Neem vloot-accounts 'realtime' over en bekijk o.a. hun slimme winkelwagen | accountbeheer |
| 4 | **Één factuur.** | Ontvang één overzichterlijke factuur met alle gemaakte kosten per maand | maandfactuur |
| 5 | **Aangepast assortiment** | Bepaal welke producten zichtbaar mogen zijn voor uw vloot | aangepast-assortiment |
| 6 | **Favorieten.** | Maak gepersonaliseerde lijsten of schema's om producten te groeperen en behoud structuur. | standaardlijsten |
| 7 | **Orders & facturen.** | Bekijk, volg en download al uw bestellingen en facturen op één centrale plek. | orders-facturen (new) |
| 8 | **Prijzen & condities.** | Bekijk direct uw persoonlijke prijzen en condities voor de meeste productgroepen in de webshop. | prijzen-condities (new) |
| 9 | **Kwartaalcijfers.** | Download elk kwartaal een kostenoverzicht. | kwartaalcijfers |

## 2. Per-concept treatment plan (5 DISTINCT directions each)

Each visual = one signature/thesis moment grounded in the maritime-B2B subject; no two treatments per concept repeat a form.

1. **Goedkeuringssysteem** — (a) approval-queue table (schip · bedrag · Te keuren/Goedgekeurd badge + checkbox); (b) vertical approval timeline (aangevraagd → ter goedkeuring → goedgekeurd → verwerkt); (c) single pending-order approve card (Keur goed / Wijs af); (d) approval-routing/threshold diagram (drempelbedrag → beheerder); (e) approval-ratio donut + month stats.
2. **OCI-koppeling** — (a) connection-status header + live KPIs + encrypted footer; (b) punch-out round-trip flow (ERP → punch-out → catalogus → terug in ERP); (c) live PO-sync feed; (d) SAP↔Nobel node diagram; (e) uptime/availability gauge.
3. **Accountbeheer** — (a) fleet-account list + "neem over" action; (b) active takeover/impersonation session card; (c) the taken-over account's slimme-winkelwagen preview; (d) rights/permissions matrix; (e) account-sessions activity timeline.
4. **Één factuur** — (a) single consolidated invoice document (totaal + per-ship lines); (b) cost-per-ship breakdown (stacked bar / waffle); (c) month total hero number + sub-stats; (d) MANY→ONE consolidation (ship invoices funnel into one); (e) per-month invoice timeline.
5. **Aangepast assortiment** — (a) product-visibility toggle list; (b) catalogus → curated-subset scope; (c) ship × category visibility matrix; (d) included/excluded count stat; (e) full-catalog → gefilterd assortiment funnel.
6. **Favorieten** — (a) named favorite lists w/ item counts; (b) schema/folder tree of grouped products; (c) one list detail (e.g. "Dek onderhoud"); (d) quick-add-to-list interaction; (e) pinned/starred grid.
7. **Orders & facturen** — (a) combined orders+invoices table (status + download); (b) order-tracking timeline (besteld → verzonden → geleverd); (c) download center (invoice list); (d) order-status overview stats; (e) single order detail w/ invoice.
8. **Prijzen & condities** — (a) per-product-group price list (groep · uw prijs · korting); (b) personal-vs-list price comparison; (c) staffel/volume-discount tiers; (d) product card w/ personal price highlighted; (e) conditions/agreement summary.
9. **Kwartaalcijfers** — (a) Q1–Q4 cost bars; (b) download card (kwartaaloverzicht + button); (c) cost-trend area chart over quarters; (d) quarter category breakdown; (e) year-over-year comparison.

## 3. Build method (per visual)

Proven this session: **GLM 5.2 vision-to-code** via the direct Z.AI Coding Plan API (`POST https://api.z.ai/api/coding/paas/v4/chat/completions`, base64 `image_url`, large `max_tokens`) — NOT opencode `--file` (broken per #20802). Fresh GLM call per visual; each prompt carries the reference shell image + the sk-design contract above + the specific treatment direction. After generation: write `<concept>-glm-<n>.html`, run `contrast_check.py` + `proof_check.py` + palette/anti-tell greps, headless-render, then a sk-design **audit** (accessibility / performance / responsive / anti-slop / on-brand) with a score per visual. Adopt-if-better; no silent caps.

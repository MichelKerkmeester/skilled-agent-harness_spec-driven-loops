# sk-design styles — extracted from Refero

## 1. OVERVIEW

Local design-token library extracted from [styles.refero.design](https://styles.refero.design/).
Each `<slug>/` folder holds the four Extended tabs (`DESIGN.md`, `css-variables.css`, `tailwind-v4.css`,
`design-tokens.json`) plus `<slug>-canonical.json` provenance and a `source.md` linking back to the
original style. The extraction harness + crawl state live in [`_harness/`](_harness/) and `_manifest.json`.

## 2. STYLES-LIBRARY UTILIZATION

[`lib/engine/style-library.mjs`](lib/engine/style-library.mjs) is the committed retrieval surface over all 1,290 bundles. It supports `build --write`, non-writing `build --check`, `query` and `hydrate`. Query applies deterministic eligibility before lexical ordering and returns compact generation-bound cards. Hydration re-derives the live record, enforces generation and artifact hashes, contains real paths and refuses stale, restricted or escaping requests.

The engine supplies evidence, not taste. Downstream work keeps this order: user brief and owned system, selected-mode judgment, target evidence and deterministic checks, corpus reference evidence, then transport output. Corpus evidence is advisory-only and `CORPUS_USE_PROOF v1` must bind any claimed influence to the checked manifest.

```bash
node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs build --check
node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs query --request '{"text":"product interface restrained motion","useFts":false,"limit":2}'
```

**Extracted: 1290 of 1,290 styles** (0 errors).

| Style | Folder | Refero source |
|-------|--------|---------------|
| 099 SUPPLY | [`099-supply/`](099-supply/) | [style](https://styles.refero.design/style/e4a7b5f3-f393-4f6d-b4a5-ecf874024bed) |
| 10X HUB | [`10x-hub/`](10x-hub/) | [style](https://styles.refero.design/style/4acc13a0-c553-40d7-b78d-a9b6a4e94486) |
| 11x– Digital workers | [`11x-digital-workers/`](11x-digital-workers/) | [style](https://styles.refero.design/style/850ee61c-4ecd-4558-9c0c-fab99721b34c) |
| 12th Berlin Biennale for Contemporary Art | [`12th-berlin-biennale-for-contemporary-art/`](12th-berlin-biennale-for-contemporary-art/) | [style](https://styles.refero.design/style/1c2d4a33-7ee4-4b61-a77e-dab91631d19b) |
| 14islands | [`14islands/`](14islands/) | [style](https://styles.refero.design/style/139c4bee-396d-494c-baf0-fe211bf4928d) |
| 15five | [`15five/`](15five/) | [style](https://styles.refero.design/style/88a00b3e-1c1e-49d3-ae0f-9fbc1f35ad99) |
| 19–86 | [`19-86/`](19-86/) | [style](https://styles.refero.design/style/6f428c12-ba43-48e3-9a52-299ec1ce509b) |
| 2.AG | [`2-ag/`](2-ag/) | [style](https://styles.refero.design/style/8b4a1a95-9dbf-4565-ace7-c4cf48eb028a) |
| 2020 | [`2020/`](2020/) | [style](https://styles.refero.design/style/ac660bff-3b21-4753-a80f-3692da6e735e) |
| 21 TSI | [`21-tsi/`](21-tsi/) | [style](https://styles.refero.design/style/7b28c99e-ed17-451b-a39e-bd4722bc43f5) |
| 21n | [`21n/`](21n/) | [style](https://styles.refero.design/style/68d18deb-bb09-4258-8024-001af9c844c0) |
| 601 Inc. | [`601-inc/`](601-inc/) | [style](https://styles.refero.design/style/1cb31aee-608e-4dec-a44d-5745e4fd6bab) |
| 70Materia | [`70materia/`](70materia/) | [style](https://styles.refero.design/style/f22a5ad1-2770-48d5-aff4-d1aaf0b789b8) |
| 7shifts | [`7shifts/`](7shifts/) | [style](https://styles.refero.design/style/736830b5-90b1-47b0-99dd-d79454a0d22a) |
| 8returns | [`8returns/`](8returns/) | [style](https://styles.refero.design/style/d5799c71-f9ae-4bad-aef3-4c07bac42c08) |
| A-dam | [`a-dam/`](a-dam/) | [style](https://styles.refero.design/style/0fc184f7-6143-4303-8e3d-0e2f075f76b2) |
| A-WARE | [`a-ware/`](a-ware/) | [style](https://styles.refero.design/style/5681f7b6-c665-44b8-a065-da7180133149) |
| a16z speedrun | [`a16z-speedrun/`](a16z-speedrun/) | [style](https://styles.refero.design/style/4fa31278-33ea-4f1c-b7ac-cdc871e36089) |
| A24 | [`a24/`](a24/) | [style](https://styles.refero.design/style/6afa22a6-bec8-47c3-b5ee-5d11d64902cb) |
| Aaply | [`aaply/`](aaply/) | [style](https://styles.refero.design/style/357e6fee-72db-40cf-b858-254b802018bd) |
| Aaron Poe & Co | [`aaron-poe-co/`](aaron-poe-co/) | [style](https://styles.refero.design/style/3240fdc0-ffea-4054-a996-a5f6b942eff0) |
| Aaru | [`aaru/`](aaru/) | [style](https://styles.refero.design/style/ad98aac8-347c-47da-91c5-9c020febeb92) |
| AATHER | [`aather/`](aather/) | [style](https://styles.refero.design/style/3b080dc3-1992-43fe-91d6-2a721f934435) |
| aave.com | [`aave-com/`](aave-com/) | [style](https://styles.refero.design/style/e352ec32-830a-4650-b7c2-d32a5f559f7e) |
| Abel | [`abel/`](abel/) | [style](https://styles.refero.design/style/f3f7122e-d8d3-48f7-9d9d-df6e71545010) |
| Abetterlou | [`abetterlou/`](abetterlou/) | [style](https://styles.refero.design/style/6a5f9438-7ae6-4743-a0bd-f9087d467eff) |
| Ableton | [`ableton/`](ableton/) | [style](https://styles.refero.design/style/e5081033-bd79-479a-aef6-8b002df6086a) |
| Aboard | [`aboard/`](aboard/) | [style](https://styles.refero.design/style/7b083729-e694-4b66-82a3-befb08451722) |
| Aboard | [`aboard-fabacd2a/`](aboard-fabacd2a/) | [style](https://styles.refero.design/style/fabacd2a-acb6-46c4-939c-4a464df15440) |
| Acceptandproceed | [`acceptandproceed/`](acceptandproceed/) | [style](https://styles.refero.design/style/f63b4703-db8b-4bc9-8d8f-17262b12d4b3) |
| ACCOMPANY | [`accompany/`](accompany/) | [style](https://styles.refero.design/style/5af60925-9c29-48fe-a19b-0f8cf12505ab) |
| Acctual | [`acctual/`](acctual/) | [style](https://styles.refero.design/style/aeefc294-a8f7-443d-b76a-538dddc29afe) |
| Acme Cups New Zealand | [`acme-cups-new-zealand/`](acme-cups-new-zealand/) | [style](https://styles.refero.design/style/14f6777e-1f6e-4b33-a7ed-d89c33f35722) |
| Acne Studios | [`acne-studios/`](acne-studios/) | [style](https://styles.refero.design/style/234e9a17-236d-4446-9d58-f83f6806d012) |
| Acolorbright | [`acolorbright/`](acolorbright/) | [style](https://styles.refero.design/style/b1ec0888-1dbe-439c-bccd-ba2c39effb70) |
| Active Theory | [`active-theory/`](active-theory/) | [style](https://styles.refero.design/style/3416bd14-96bb-4c23-bd01-b2ea178ba5ce) |
| Ada | [`ada/`](ada/) | [style](https://styles.refero.design/style/f23e132d-3bfb-498d-a2e4-6d069b4dbc59) |
| Adaline | [`adaline/`](adaline/) | [style](https://styles.refero.design/style/312423bf-72ea-42fb-b8f5-ab0104e778f3) |
| Adam Lippes | [`adam-lippes/`](adam-lippes/) | [style](https://styles.refero.design/style/cdc4a162-cefa-49a1-81e7-4857e421ae24) |
| Adanola | [`adanola/`](adanola/) | [style](https://styles.refero.design/style/a54e5114-bfb1-44ce-ab07-a133a1226117) |
| Adaptive ML | [`adaptive-ml/`](adaptive-ml/) | [style](https://styles.refero.design/style/f08ee8f2-2ba5-4ae8-aba7-fec7cea40ae4) |
| Adcker | [`adcker/`](adcker/) | [style](https://styles.refero.design/style/e48b2dd0-328a-42ab-ad0f-ed24901bac4c) |
| Adnaut | [`adnaut/`](adnaut/) | [style](https://styles.refero.design/style/5d210b76-702a-45cf-97ed-ed90c47b1eb0) |
| Adopt | [`adopt/`](adopt/) | [style](https://styles.refero.design/style/6d360718-91b8-4c74-a6f0-91f4731a6671) |
| Adora | [`adora/`](adora/) | [style](https://styles.refero.design/style/26a9840f-f128-4cfc-84a5-feb7db1bf577) |
| Advene | [`advene/`](advene/) | [style](https://styles.refero.design/style/ba0e947f-0ffa-4ea9-b483-86c981a42464) |
| Aevi Wellness | [`aevi-wellness/`](aevi-wellness/) | [style](https://styles.refero.design/style/c2fadeda-8ef3-4ab2-9909-ffdf02ab0a24) |
| Affinity | [`affinity/`](affinity/) | [style](https://styles.refero.design/style/6fd5c4e6-7003-4768-bc62-1b9c0c774054) |
| Afterglo | [`afterglo/`](afterglo/) | [style](https://styles.refero.design/style/b13069df-7475-4b51-a734-621e3da75f8b) |
| Agence Foudre | [`agence-foudre/`](agence-foudre/) | [style](https://styles.refero.design/style/c1534c74-f7b8-44de-a913-586d0f78fb08) |
| Agence K72 | [`agence-k72/`](agence-k72/) | [style](https://styles.refero.design/style/1ff3bd9c-827d-450a-a382-300839768d66) |
| Agencja brandingowa | [`agencja-brandingowa/`](agencja-brandingowa/) | [style](https://styles.refero.design/style/c43237e3-dae2-4fc6-a917-519b25c870e5) |
| AgentQL | [`agentql/`](agentql/) | [style](https://styles.refero.design/style/d5307f56-76de-4d13-9741-f969c42e9aa5) |
| Agronomy Workshop | [`agronomy-workshop/`](agronomy-workshop/) | [style](https://styles.refero.design/style/37f752a0-879e-4451-a4a4-0a82896e3890) |
| AI for Business | [`ai-for-business/`](ai-for-business/) | [style](https://styles.refero.design/style/ee403055-480e-4bd4-9216-07c9ae2dde2e) |
| AI Product Generation | [`ai-product-generation/`](ai-product-generation/) | [style](https://styles.refero.design/style/186775da-7568-49e5-8110-4fd0bbc7bbe3) |
| Air | [`air/`](air/) | [style](https://styles.refero.design/style/d3289fe7-a85e-42d8-96b7-eb7faa62a104) |
| Aira | [`aira/`](aira/) | [style](https://styles.refero.design/style/750387be-bda4-448b-950f-c9356c3ec25f) |
| Airbnb | [`airbnb/`](airbnb/) | [style](https://styles.refero.design/style/c2325884-4391-4688-85cd-e143f5107517) |
| Airbnb | [`airbnb-194faa2f/`](airbnb-194faa2f/) | [style](https://styles.refero.design/style/194faa2f-2f69-4bbf-9e29-290f28fa8ca2) |
| Airtable | [`airtable/`](airtable/) | [style](https://styles.refero.design/style/f4ef80f4-f6e5-4aea-8045-f99efaf208b8) |
| AIUC | [`aiuc/`](aiuc/) | [style](https://styles.refero.design/style/6b9ab3aa-13ea-49e5-9889-d0c9ae629add) |
| Akash Tyagi | [`akash-tyagi/`](akash-tyagi/) | [style](https://styles.refero.design/style/f3d2bfdb-ba92-42c4-91c6-58c829b094bf) |
| Aker | [`aker/`](aker/) | [style](https://styles.refero.design/style/4aa6d64c-fa61-4b21-8ad6-3d7130ed5161) |
| Alden | [`alden/`](alden/) | [style](https://styles.refero.design/style/b6f25b86-ffcf-42f1-9f37-5e37d08cb4ce) |
| Alejandro Mejias | [`alejandro-mejias/`](alejandro-mejias/) | [style](https://styles.refero.design/style/5f802b93-5f46-470f-baaf-173737189c9d) |
| alet | [`alet/`](alet/) | [style](https://styles.refero.design/style/9b5203a8-07c8-4987-94c5-6411970896d2) |
| ALIGNE | [`aligne/`](aligne/) | [style](https://styles.refero.design/style/4c637873-7632-46c0-ac36-5744efa00444) |
| Alison Roman | [`alison-roman/`](alison-roman/) | [style](https://styles.refero.design/style/b2ace2c1-d6ee-4d57-915e-901224cded11) |
| Allbirds | [`allbirds/`](allbirds/) | [style](https://styles.refero.design/style/79d83fce-84bf-4e12-8039-5d283c98917c) |
| Allfeat | [`allfeat/`](allfeat/) | [style](https://styles.refero.design/style/2f9bf724-3829-4c62-bcc8-391b32925d1b) |
| Allier Ho | [`allier-ho/`](allier-ho/) | [style](https://styles.refero.design/style/a85c74b9-2166-4fa3-be49-a2cc48990c6a) |
| Alpine Bio | [`alpine-bio/`](alpine-bio/) | [style](https://styles.refero.design/style/1995b916-d3f1-4b13-8eb0-c1317ab63ccb) |
| Alpine Hearing Protection | [`alpine-hearing-protection/`](alpine-hearing-protection/) | [style](https://styles.refero.design/style/76c761d8-4af1-4ed5-ba93-eeb60f7006b5) |
| ALSO | [`also/`](also/) | [style](https://styles.refero.design/style/d04a3970-45f0-4030-8375-d0d26c083c0f) |
| Alt–Border | [`alt-border/`](alt-border/) | [style](https://styles.refero.design/style/5fd2cdc0-05ac-4290-b67c-72e7525a532c) |
| Altason | [`altason/`](altason/) | [style](https://styles.refero.design/style/e99ae628-89df-4de9-ab80-9885b1be4dc0) |
| Altitude | [`altitude/`](altitude/) | [style](https://styles.refero.design/style/0e971626-ca51-45ba-acf6-35a53c561b2c) |
| Altitude Beverages | [`altitude-beverages/`](altitude-beverages/) | [style](https://styles.refero.design/style/243a3dde-80a8-47a9-87f8-c549726ec6f3) |
| Altius | [`altius/`](altius/) | [style](https://styles.refero.design/style/227ff379-9b46-44fc-8ff1-37e0472239a6) |
| Alveos One | [`alveos-one/`](alveos-one/) | [style](https://styles.refero.design/style/811f0fc6-3353-4ed6-bf3e-c98b261dcc1c) |
| Amaterasu | [`amaterasu/`](amaterasu/) | [style](https://styles.refero.design/style/01b3bfc1-95df-425f-9b7a-15cff09adc5f) |
| Ambrook | [`ambrook/`](ambrook/) | [style](https://styles.refero.design/style/f3c955e4-0fea-462d-b05f-868552e9628c) |
| Ameba | [`ameba/`](ameba/) | [style](https://styles.refero.design/style/371df039-a090-402b-b2e4-21ab38e07625) |
| Amie | [`amie/`](amie/) | [style](https://styles.refero.design/style/29567671-da1e-4f85-ae52-8b611fecc384) |
| amp | [`amp/`](amp/) | [style](https://styles.refero.design/style/261a4ad3-e835-4f7a-beb7-72187f84d462) |
| Amplemarket | [`amplemarket/`](amplemarket/) | [style](https://styles.refero.design/style/db451eca-8de6-43a9-a5d5-35271befdffd) |
| amra | [`amra/`](amra/) | [style](https://styles.refero.design/style/d5ed8712-0e42-4c6c-83b1-b3d7f27d1d10) |
| Amrit Palace | [`amrit-palace/`](amrit-palace/) | [style](https://styles.refero.design/style/b753dfda-cbe1-41e4-b341-b98d69c8422f) |
| Anacuna | [`anacuna/`](anacuna/) | [style](https://styles.refero.design/style/bb961b10-d437-4023-9201-a44349fe591f) |
| Analogue | [`analogue/`](analogue/) | [style](https://styles.refero.design/style/98ab0172-9474-43b5-9055-98cf1a6a2401) |
| Analogue aF-1 | [`analogue-af-1/`](analogue-af-1/) | [style](https://styles.refero.design/style/6607e4ff-2de6-4a6a-a7ed-53a9e4b550b9) |
| Analogue | [`analogue-f68dd3d8/`](analogue-f68dd3d8/) | [style](https://styles.refero.design/style/f68dd3d8-e8fa-4d2c-8c59-28aba06c9d8a) |
| Andercore | [`andercore/`](andercore/) | [style](https://styles.refero.design/style/2d4ced28-e579-4fa0-84bc-836dd008034f) |
| André Cândido | [`andre-ca-ndido/`](andre-ca-ndido/) | [style](https://styles.refero.design/style/b3fb8359-84c7-4bc0-b1cf-e8d225bcaa77) |
| Andrei Rybin | [`andrei-rybin/`](andrei-rybin/) | [style](https://styles.refero.design/style/519ca09b-9a85-4eec-8630-0d7aae5ac2da) |
| AngelList | [`angellist/`](angellist/) | [style](https://styles.refero.design/style/c75603c7-492d-4c26-9744-9acc22fe6225) |
| Angellist | [`angellist-6db40006/`](angellist-6db40006/) | [style](https://styles.refero.design/style/6db40006-05ac-4770-b63e-dfd9ebfd534c) |
| Aninix | [`aninix/`](aninix/) | [style](https://styles.refero.design/style/653b7b25-f610-4a46-90e1-e3eed98b1f24) |
| Ankar AI | [`ankar-ai/`](ankar-ai/) | [style](https://styles.refero.design/style/478c8660-f1a0-4339-ac8c-4cf7ca4cf738) |
| Anna Jóna | [`anna-jo-na/`](anna-jo-na/) | [style](https://styles.refero.design/style/71717c5a-324a-40ed-8a09-9a35df74f1d3) |
| Anthropic | [`anthropic/`](anthropic/) | [style](https://styles.refero.design/style/d469cba4-c448-4a43-a033-883f8bfcdc42) |
| Antimetal | [`antimetal/`](antimetal/) | [style](https://styles.refero.design/style/9f9a4a4f-1a27-47ca-a65b-68b9850a84e4) |
| Anuc Home | [`anuc-home/`](anuc-home/) | [style](https://styles.refero.design/style/5e9409c4-d130-42f3-b224-5bd66cdfbe28) |
| Anything | [`anything/`](anything/) | [style](https://styles.refero.design/style/edf7f95d-da5f-42bf-94c5-b33ade0a2ba2) |
| Aplós | [`aplo-s/`](aplo-s/) | [style](https://styles.refero.design/style/765e6ba8-af87-4519-afb7-774ceedc463d) |
| Apollo | [`apollo/`](apollo/) | [style](https://styles.refero.design/style/3963a727-8dec-4308-80c0-3ae198d15b87) |
| Apollo | [`apollo-5fbdad0a/`](apollo-5fbdad0a/) | [style](https://styles.refero.design/style/5fbdad0a-d102-41c2-8253-f201ad6a6673) |
| Apollographql | [`apollographql/`](apollographql/) | [style](https://styles.refero.design/style/65b30976-3663-40b2-8751-7a360ba74539) |
| Apple | [`apple/`](apple/) | [style](https://styles.refero.design/style/aecac5da-f397-4ddf-b71f-de1efc434cb8) |
| Apple (España) | [`apple-espan-a/`](apple-espan-a/) | [style](https://styles.refero.design/style/a48ef430-8c6a-42d8-8c53-ab7bb43cf33b) |
| Apple (España) | [`apple-espan-a-022cf675/`](apple-espan-a-022cf675/) | [style](https://styles.refero.design/style/022cf675-42d1-44e7-953a-68facc802117) |
| Apple (España) | [`apple-espan-a-569ba4c0/`](apple-espan-a-569ba4c0/) | [style](https://styles.refero.design/style/569ba4c0-0431-44fb-92df-0dbea7f3e63d) |
| Apple (España) | [`apple-espan-a-764b6a64/`](apple-espan-a-764b6a64/) | [style](https://styles.refero.design/style/764b6a64-c233-4e0f-b8e1-bc01e2f8aa16) |
| Apple (España) | [`apple-espan-a-96eae189/`](apple-espan-a-96eae189/) | [style](https://styles.refero.design/style/96eae189-95ad-4a38-83d1-840497e5daf3) |
| Apple (España) | [`apple-espan-a-a4f123f2/`](apple-espan-a-a4f123f2/) | [style](https://styles.refero.design/style/a4f123f2-cd4b-4d26-998f-a3d3ee158024) |
| Apple (España) | [`apple-espan-a-c9cabb96/`](apple-espan-a-c9cabb96/) | [style](https://styles.refero.design/style/c9cabb96-32fa-4896-837a-f2497ce1c856) |
| Apple (España) | [`apple-espan-a-da7e5084/`](apple-espan-a-da7e5084/) | [style](https://styles.refero.design/style/da7e5084-9e5d-4eb2-bb10-4c2d7733a56e) |
| Applied Labs | [`applied-labs/`](applied-labs/) | [style](https://styles.refero.design/style/e68d2972-4344-4954-b00c-56fdf97d9de4) |
| Aptos Network | [`aptos-network/`](aptos-network/) | [style](https://styles.refero.design/style/9a23d457-a23a-404a-9f75-12007ea7eb0f) |
| Aqua Voice | [`aqua-voice/`](aqua-voice/) | [style](https://styles.refero.design/style/6734fe92-6a02-45d5-8d72-0c55b37ace82) |
| Arc | [`arc/`](arc/) | [style](https://styles.refero.design/style/ca93daf1-daf3-41b7-8248-8f63082761e8) |
| Arc | [`arc-acfb6fa1/`](arc-acfb6fa1/) | [style](https://styles.refero.design/style/acfb6fa1-3aed-4e64-8522-7f332a796de8) |
| Arcade | [`arcade/`](arcade/) | [style](https://styles.refero.design/style/f65b0b91-bdd1-458d-8775-2f6fa8a9d4b1) |
| Arcadia | [`arcadia/`](arcadia/) | [style](https://styles.refero.design/style/b52981ce-fdb2-4ba0-86bb-f5ce0c27a9c6) |
| AREA 17 | [`area-17/`](area-17/) | [style](https://styles.refero.design/style/143d553e-d71f-4e86-98ed-b80b9ef78ea9) |
| ARKET | [`arket/`](arket/) | [style](https://styles.refero.design/style/3c605c8e-daf2-4d46-94d7-2cb705a93b7b) |
| Arsenijs Fabrica | [`arsenijs-fabrica/`](arsenijs-fabrica/) | [style](https://styles.refero.design/style/eb3bf6c1-a18f-4d72-801e-50c2cdbbaa21) |
| Art In DUMBO | [`art-in-dumbo/`](art-in-dumbo/) | [style](https://styles.refero.design/style/5d79f0c2-526e-4c37-b780-08404f60839b) |
| Artandcommerce | [`artandcommerce/`](artandcommerce/) | [style](https://styles.refero.design/style/bc4b420c-be08-4165-95a3-c8338b5a9c3c) |
| Artboard | [`artboard/`](artboard/) | [style](https://styles.refero.design/style/989d8d71-c161-4410-8157-ad6ade0bd4be) |
| arte* | [`arte/`](arte/) | [style](https://styles.refero.design/style/2f94c1f0-cd23-4bf1-95f3-0e531174c4f4) |
| Arthursimonini | [`arthursimonini/`](arthursimonini/) | [style](https://styles.refero.design/style/6778ff21-44eb-40f3-ba85-2ee7de935f8f) |
| ARTU | [`artu/`](artu/) | [style](https://styles.refero.design/style/d1941450-00be-4988-beaa-76bb68ae09ff) |
| ARTWORLD | [`artworld/`](artworld/) | [style](https://styles.refero.design/style/bab94db1-25ec-459d-8c81-5905a0324b65) |
| Arva | [`arva/`](arva/) | [style](https://styles.refero.design/style/15846be3-8df8-42e4-a05c-d9395dcec369) |
| Asana | [`asana/`](asana/) | [style](https://styles.refero.design/style/6b2a0513-df80-4140-87a8-38b1fef34313) |
| Ashleyandco | [`ashleyandco/`](ashleyandco/) | [style](https://styles.refero.design/style/645d7583-8391-455b-83d2-c95fb7fe91dc) |
| Ashton Bespoke | [`ashton-bespoke/`](ashton-bespoke/) | [style](https://styles.refero.design/style/34534515-c044-4d37-940d-44352d62ee44) |
| Aspelin Reitan | [`aspelin-reitan/`](aspelin-reitan/) | [style](https://styles.refero.design/style/3a331157-f5a5-4640-ada8-8a3ad262ee6a) |
| Assembly Coffee London | [`assembly-coffee-london/`](assembly-coffee-london/) | [style](https://styles.refero.design/style/8288950a-2731-44fd-85ef-211aecd8091d) |
| Assurestor | [`assurestor/`](assurestor/) | [style](https://styles.refero.design/style/0ed40a3a-2541-4ffa-acdd-f1170858bc5d) |
| Astro | [`astro/`](astro/) | [style](https://styles.refero.design/style/e8c604cc-1c8d-42a3-aeca-fcfc25e70344) |
| Atelier Deux-Cé | [`atelier-deux-ce/`](atelier-deux-ce/) | [style](https://styles.refero.design/style/d531f0ec-ea94-4a40-b568-3073ff2bd8ed) |
| Athletics | [`athletics/`](athletics/) | [style](https://styles.refero.design/style/fd36c7c7-4f8c-4d2a-9346-72e3d8403f01) |
| Atlantic.vc | [`atlantic-vc/`](atlantic-vc/) | [style](https://styles.refero.design/style/6f365ecd-a040-4533-88c1-3f60fe062632) |
| Atlas Card | [`atlas-card/`](atlas-card/) | [style](https://styles.refero.design/style/3f6ef3c1-f98f-4cd9-bdf0-545059758705) |
| Atlassian | [`atlassian/`](atlassian/) | [style](https://styles.refero.design/style/c08ebca5-87d4-4c19-a5d7-ae5e670dae11) |
| ATMOS | [`atmos/`](atmos/) | [style](https://styles.refero.design/style/36cba9c4-9852-4f59-a52d-17be741f6ed8) |
| Atoms | [`atoms/`](atoms/) | [style](https://styles.refero.design/style/537641a0-5a24-4203-ae9b-cd29516aa3f8) |
| Atoms | [`atoms-4433dfe7/`](atoms-4433dfe7/) | [style](https://styles.refero.design/style/4433dfe7-315a-4459-bfd7-f59ccdc09bad) |
| Attio | [`attio/`](attio/) | [style](https://styles.refero.design/style/08c8700c-f278-42bc-812e-f60dc6ce996e) |
| Audyr | [`audyr/`](audyr/) | [style](https://styles.refero.design/style/afde66c4-ad74-4d19-94df-0216e945ac5e) |
| Augen Pro | [`augen-pro/`](augen-pro/) | [style](https://styles.refero.design/style/0f7da1b2-9d06-4ef5-b5a8-ef7f92e57ab2) |
| August Health EHR | [`august-health-ehr/`](august-health-ehr/) | [style](https://styles.refero.design/style/81bd6ad6-b02b-4fb3-a600-91ecf8324171) |
| Aurora | [`aurora/`](aurora/) | [style](https://styles.refero.design/style/fe7b8533-f56b-46bd-8713-f18886a1e986) |
| Auros | [`auros/`](auros/) | [style](https://styles.refero.design/style/21cfe0c1-778d-4613-9f47-a5718eb929b3) |
| Authkit | [`authkit/`](authkit/) | [style](https://styles.refero.design/style/e80231a2-e4d6-406a-a2c9-2e6109679690) |
| Automate Supplier Payments | [`automate-supplier-payments/`](automate-supplier-payments/) | [style](https://styles.refero.design/style/dfbcffc2-79a3-4349-b5c6-1aa9fae4fcf4) |
| AutoSend | [`autosend/`](autosend/) | [style](https://styles.refero.design/style/3d6eda0c-16ab-4e7e-aca6-5f9a5432bfd1) |
| Awesomic | [`awesomic/`](awesomic/) | [style](https://styles.refero.design/style/8512e28d-5385-4c20-a336-214568c4370c) |
| Awwwards | [`awwwards/`](awwwards/) | [style](https://styles.refero.design/style/a77a7289-3438-46ba-8194-214739e47514) |
| Axelar | [`axelar/`](axelar/) | [style](https://styles.refero.design/style/109e52eb-e70f-493e-9527-84d672b00c7b) |
| Axiom | [`axiom/`](axiom/) | [style](https://styles.refero.design/style/c809190a-035c-458d-87ed-4758807dd84e) |
| Ayaka B. Ito | [`ayaka-b-ito/`](ayaka-b-ito/) | [style](https://styles.refero.design/style/8ac43b3b-7139-4777-bc77-217614e01e89) |
| B—Line | [`b-line/`](b-line/) | [style](https://styles.refero.design/style/3b9ed801-511c-48b6-b516-68b1aa8a36ea) |
| Backlight | [`backlight/`](backlight/) | [style](https://styles.refero.design/style/ca9bff3b-d488-46e5-8a32-2d858bb5eed2) |
| Baggu | [`baggu/`](baggu/) | [style](https://styles.refero.design/style/39105d96-3cb1-497a-8f9f-507a1bed4d30) |
| Ballpark | [`ballpark/`](ballpark/) | [style](https://styles.refero.design/style/9342e89b-c2fe-4acf-9993-53b44e0c13b5) |
| Balsa | [`balsa/`](balsa/) | [style](https://styles.refero.design/style/ebbfbc6a-988b-4f33-b261-d431b2327545) |
| Bang & Olufsen | [`bang-olufsen/`](bang-olufsen/) | [style](https://styles.refero.design/style/27a4a4fa-4b1a-4e7e-b2c3-3e5bf57f00e5) |
| Bareis + Nicolaus | [`bareis-nicolaus/`](bareis-nicolaus/) | [style](https://styles.refero.design/style/e80c5b4a-fd03-460e-a577-49928a4ab5db) |
| Base | [`base/`](base/) | [style](https://styles.refero.design/style/530eb4cf-7e75-4833-95c9-746818050db7) |
| Base Design | [`base-design/`](base-design/) | [style](https://styles.refero.design/style/6be758be-344f-4301-8ff9-60706356ea00) |
| Base44 | [`base44/`](base44/) | [style](https://styles.refero.design/style/e869e214-f672-4ac3-bfc2-bd25de7b003b) |
| Basedash | [`basedash/`](basedash/) | [style](https://styles.refero.design/style/77b723ca-9583-4349-9b5e-2ef8b4fde002) |
| BaseHub | [`basehub/`](basehub/) | [style](https://styles.refero.design/style/2cfb738d-6c44-4628-a2f5-e9c9fc92a0ca) |
| basement.studio | [`basement-studio/`](basement-studio/) | [style](https://styles.refero.design/style/e06224b2-6d52-4d06-bbde-115cec719b47) |
| Basic.Space | [`basic-space/`](basic-space/) | [style](https://styles.refero.design/style/d7096101-d33c-43b8-8b0b-d9dfff802db2) |
| Bécane | [`be-cane/`](be-cane/) | [style](https://styles.refero.design/style/d5017f8f-fa0f-4241-9319-527b0751f66f) |
| Bear Markdown Notes | [`bear-markdown-notes/`](bear-markdown-notes/) | [style](https://styles.refero.design/style/4afe77ff-e7fa-41d8-96d6-ce8cdc159f97) |
| Beau | [`beau/`](beau/) | [style](https://styles.refero.design/style/c73ba3d8-42fe-4d53-bec1-b6643949c582) |
| Beautiful™ | [`beautiful/`](beautiful/) | [style](https://styles.refero.design/style/8e1c35bf-f0e8-4889-b869-d9883bb76767) |
| Becklyn | [`becklyn/`](becklyn/) | [style](https://styles.refero.design/style/3389358b-68b2-4fca-82a8-52c07b3a3475) |
| beehiiv | [`beehiiv/`](beehiiv/) | [style](https://styles.refero.design/style/350b1557-56f0-4361-8c8b-b7a88081982b) |
| BEHAVE Candy | [`behave-candy/`](behave-candy/) | [style](https://styles.refero.design/style/5cc6e3be-1cbd-4d09-9958-9cb82b2487db) |
| BelArosa Chalet | [`belarosa-chalet/`](belarosa-chalet/) | [style](https://styles.refero.design/style/46c8dbc5-47c8-4796-b94c-5e46dcda3532) |
| bella Kitchen Appliances | [`bella-kitchen-appliances/`](bella-kitchen-appliances/) | [style](https://styles.refero.design/style/e327d332-270d-4779-a55c-cd82b8624d2a) |
| Bento | [`bento/`](bento/) | [style](https://styles.refero.design/style/59ac8248-1d64-4df3-92f1-919b50e05602) |
| Better Stack | [`better-stack/`](better-stack/) | [style](https://styles.refero.design/style/1de273f2-166f-4526-8442-16cc39fc7fd5) |
| Bibliothèque | [`bibliothe-que/`](bibliothe-que/) | [style](https://styles.refero.design/style/5acff005-1871-4237-bc25-cdddf50edc70) |
| BitcoinOS | [`bitcoinos/`](bitcoinos/) | [style](https://styles.refero.design/style/bfd97dc2-5c12-483b-9101-ebfaf82ba83e) |
| Blok | [`blok/`](blok/) | [style](https://styles.refero.design/style/7d10f1d6-f2a8-43ce-b055-6ddd74e3c7e1) |
| Bluesky Social | [`bluesky-social/`](bluesky-social/) | [style](https://styles.refero.design/style/aa9234ca-0cc8-470b-bd38-398712de3e95) |
| BlueYard Capital | [`blueyard-capital/`](blueyard-capital/) | [style](https://styles.refero.design/style/ea11696a-17c0-41f8-9b08-c820851e0ea9) |
| BMW.com | [`bmw-com/`](bmw-com/) | [style](https://styles.refero.design/style/b8899cbd-e2ca-4069-83cf-d8f8b0d71100) |
| Bōjka Studio | [`bo-jka-studio/`](bo-jka-studio/) | [style](https://styles.refero.design/style/286b6ba8-a45d-48e0-b556-ff6aeac68058) |
| Bolt | [`bolt/`](bolt/) | [style](https://styles.refero.design/style/711a2c41-a5f4-49d5-930b-f0abaad6933d) |
| Bongusta | [`bongusta/`](bongusta/) | [style](https://styles.refero.design/style/588b79ff-97ee-4e90-951e-401ece6c5fe1) |
| boords.com | [`boords-com/`](boords-com/) | [style](https://styles.refero.design/style/c955d25a-b32a-441d-9f07-a260d1df897b) |
| Boostinsurance | [`boostinsurance/`](boostinsurance/) | [style](https://styles.refero.design/style/e60c61d3-2657-429e-a581-568aea27a448) |
| Bpowell | [`bpowell/`](bpowell/) | [style](https://styles.refero.design/style/7afd842e-44d4-4f01-9ef5-683c31d820c9) |
| Brainfish | [`brainfish/`](brainfish/) | [style](https://styles.refero.design/style/800734fd-eb95-41f3-b6f4-15fc19e127f0) |
| Brand | [`brand/`](brand/) | [style](https://styles.refero.design/style/f6fbc2fb-ea5d-44cc-a37d-d7896005acbd) |
| Branding | [`branding/`](branding/) | [style](https://styles.refero.design/style/4d4772a3-e1da-415f-a6d7-658dcefdcecd) |
| Break Maiden | [`break-maiden/`](break-maiden/) | [style](https://styles.refero.design/style/02610b06-d16e-47bd-a1ea-18979a9ed4f5) |
| Brex | [`brex/`](brex/) | [style](https://styles.refero.design/style/b58d92f6-68a8-4358-8fc9-6ea58e6d483b) |
| Brisbane Web Developer | [`brisbane-web-developer/`](brisbane-web-developer/) | [style](https://styles.refero.design/style/23d83a89-8f22-405a-aa33-74fd0ebde9d8) |
| Browserbase | [`browserbase/`](browserbase/) | [style](https://styles.refero.design/style/34d438ad-0647-471e-9a6f-7c1fa29d5df6) |
| Buddy | [`buddy/`](buddy/) | [style](https://styles.refero.design/style/1329b661-39d8-4f0b-a12a-11ed13671ccb) |
| Bumble | [`bumble/`](bumble/) | [style](https://styles.refero.design/style/f32595cf-478e-4ccd-8722-0daffa693d76) |
| Bun | [`bun/`](bun/) | [style](https://styles.refero.design/style/408a149c-702f-4442-99df-bea49d9c0d9b) |
| Busuu | [`busuu/`](busuu/) | [style](https://styles.refero.design/style/72b85d0a-1ff8-4dd3-b33a-f55aad6df5c9) |
| Busy Bee Honey | [`busy-bee-honey/`](busy-bee-honey/) | [style](https://styles.refero.design/style/9836e7c2-ac8e-453d-bdef-2677eb078d59) |
| BUTT STUDIO | [`butt-studio/`](butt-studio/) | [style](https://styles.refero.design/style/c6e55968-fa2d-47c9-b833-2c4ad1e74906) |
| Buymeacoffee | [`buymeacoffee/`](buymeacoffee/) | [style](https://styles.refero.design/style/1b2aaf14-43b0-4c23-bd25-1d49924fe85e) |
| Cake Equity | [`cake-equity/`](cake-equity/) | [style](https://styles.refero.design/style/4c33d8fe-81d5-46cb-9dc1-dd231be1c9ec) |
| Cal.com | [`cal-com/`](cal-com/) | [style](https://styles.refero.design/style/5d7aa503-8cfa-49a4-bd3b-0c2f0f075c70) |
| Caldera | [`caldera/`](caldera/) | [style](https://styles.refero.design/style/fe8cdcf9-c850-4d52-be07-5ad269bf9ebf) |
| Calendly.com | [`calendly-com/`](calendly-com/) | [style](https://styles.refero.design/style/9946887b-ffa9-4276-af81-ae6352795afb) |
| Campsite | [`campsite/`](campsite/) | [style](https://styles.refero.design/style/5d8ad116-b3d8-4890-a969-5b856b35c678) |
| Campsite | [`campsite-e8589e7c/`](campsite-e8589e7c/) | [style](https://styles.refero.design/style/e8589e7c-5ba9-4923-aa7f-0f1bf0d679be) |
| Canva | [`canva/`](canva/) | [style](https://styles.refero.design/style/17d0a00e-5de6-48c7-9f3b-25b04f7dab4c) |
| Canva | [`canva-62f89392/`](canva-62f89392/) | [style](https://styles.refero.design/style/62f89392-609d-45b7-b9df-7a5acd529864) |
| Cap | [`cap/`](cap/) | [style](https://styles.refero.design/style/08c0ead0-1899-47b4-bfdc-865ab459bbe5) |
| Cards Against Humanity | [`cards-against-humanity/`](cards-against-humanity/) | [style](https://styles.refero.design/style/51b5d80e-d898-4d70-bd16-9e50406e014c) |
| Cards Against Humanity | [`cards-against-humanity-cef9a300/`](cards-against-humanity-cef9a300/) | [style](https://styles.refero.design/style/cef9a300-8513-46c2-9c2c-c0016e5a5d30) |
| Carrot | [`carrot/`](carrot/) | [style](https://styles.refero.design/style/a7a69d27-e1a9-4322-b58f-3c7633fdc60d) |
| Caserne | [`caserne/`](caserne/) | [style](https://styles.refero.design/style/c2702938-b670-414c-ba47-94618212085e) |
| Cassette | [`cassette/`](cassette/) | [style](https://styles.refero.design/style/fb4cfe58-00b5-4e6a-b251-0c65e60b6649) |
| CHAIBOY | [`chaiboy/`](chaiboy/) | [style](https://styles.refero.design/style/442dfaf8-c0c6-467b-a8d4-54e953c049f3) |
| Champions4good | [`champions4good/`](champions4good/) | [style](https://styles.refero.design/style/e02671e1-ba31-465f-bb7f-b124bf91ab5e) |
| Changelog | [`changelog/`](changelog/) | [style](https://styles.refero.design/style/a5cc9b0f-d274-458a-b990-d18482b70838) |
| Channel Studio | [`channel-studio/`](channel-studio/) | [style](https://styles.refero.design/style/4c19bf7b-d5e8-4e2a-b3e3-69a9bde19b7a) |
| Chantlings | [`chantlings/`](chantlings/) | [style](https://styles.refero.design/style/5090ce54-9097-4d29-a741-2847dbacc419) |
| Charlie | [`charlie/`](charlie/) | [style](https://styles.refero.design/style/34aa811f-6084-484c-b4c0-f587b514e970) |
| Charlie Phipps | [`charlie-phipps/`](charlie-phipps/) | [style](https://styles.refero.design/style/7f6799d9-0733-4523-9a94-036b9ad3bf28) |
| Chat for impact | [`chat-for-impact/`](chat-for-impact/) | [style](https://styles.refero.design/style/18975f37-2e5d-47ca-9367-8b201d20390d) |
| ChatGPT | [`chatgpt/`](chatgpt/) | [style](https://styles.refero.design/style/52a007ed-ad1b-46a6-bd44-b76f91df6d0c) |
| Checkly | [`checkly/`](checkly/) | [style](https://styles.refero.design/style/78558b01-c101-4b8e-8401-db91269b1150) |
| CHELSEA | [`chelsea/`](chelsea/) | [style](https://styles.refero.design/style/905beb8c-9788-4ff4-888b-13370cacd4b0) |
| Chester's Garden | [`chester-s-garden/`](chester-s-garden/) | [style](https://styles.refero.design/style/a639fa6c-1705-47c2-b452-d4479469a734) |
| CHRISTOPHER IRELAND CREATIVE | [`christopher-ireland-creative/`](christopher-ireland-creative/) | [style](https://styles.refero.design/style/295beab5-cd8a-473b-ab7d-3df6cda30231) |
| Chronicle | [`chronicle/`](chronicle/) | [style](https://styles.refero.design/style/1c60b014-473b-443b-b0f5-220612feebb7) |
| Circle | [`circle/`](circle/) | [style](https://styles.refero.design/style/ab8450d9-1b42-4395-aa24-9e277f021aa1) |
| Ciridae | [`ciridae/`](ciridae/) | [style](https://styles.refero.design/style/a1b78a21-a304-482b-8ce5-f612d95d44fe) |
| Clase bcn | [`clase-bcn/`](clase-bcn/) | [style](https://styles.refero.design/style/73359194-de93-436e-af53-81d4029f5e7a) |
| clau.as.kee | [`clau-as-kee/`](clau-as-kee/) | [style](https://styles.refero.design/style/9aad4722-413d-4b32-bda7-6f94bbd9938c) |
| Claude | [`claude/`](claude/) | [style](https://styles.refero.design/style/47cb86b6-cb2d-41c8-94ba-8607cd7c41cd) |
| Claude Type | [`claude-type/`](claude-type/) | [style](https://styles.refero.design/style/134cfb76-12e0-4e2e-9995-5a1617190c56) |
| Clay | [`clay/`](clay/) | [style](https://styles.refero.design/style/b5ca4e9a-2322-4796-b4c5-3b3bf194821f) |
| Clearbit | [`clearbit/`](clearbit/) | [style](https://styles.refero.design/style/6221ba67-26e7-4657-91b7-efd77cbb1f12) |
| Clerk | [`clerk/`](clerk/) | [style](https://styles.refero.design/style/ed10ae04-24ec-4e42-9bf2-ea12a4b58d67) |
| ClickHouse | [`clickhouse/`](clickhouse/) | [style](https://styles.refero.design/style/bd96c1a6-32ba-42e0-bd5c-23c70a23142c) |
| ClickUp™ | [`clickup/`](clickup/) | [style](https://styles.refero.design/style/efcb73cb-b84a-4ae7-9a2b-e1116f79f130) |
| Clipdrop | [`clipdrop/`](clipdrop/) | [style](https://styles.refero.design/style/935f22cb-04ec-48c8-a6da-aa8c2c5abe8b) |
| CLOU architects | [`clou-architects/`](clou-architects/) | [style](https://styles.refero.design/style/febf1c02-2c4d-46e6-ad16-8ee2a99ae0d5) |
| Cluely | [`cluely/`](cluely/) | [style](https://styles.refero.design/style/72da35d5-1cfd-41a3-94f6-cb6b8c07a670) |
| Clutch Security | [`clutch-security/`](clutch-security/) | [style](https://styles.refero.design/style/802bdc0e-ec2e-4d2d-bf5d-de98c0899f66) |
| Clyde | [`clyde/`](clyde/) | [style](https://styles.refero.design/style/39098e34-b911-4ad3-bcb5-ee80a392cd95) |
| Co Projects | [`co-projects/`](co-projects/) | [style](https://styles.refero.design/style/5c9743ad-fe33-4d21-9185-db012f6f96c7) |
| Coda | [`coda/`](coda/) | [style](https://styles.refero.design/style/0f0d4cb7-5109-4e81-8c8d-f6bd0441b27c) |
| Coda | [`coda-e0ad1a25/`](coda-e0ad1a25/) | [style](https://styles.refero.design/style/e0ad1a25-5609-45e6-a355-9bdeec86c5ae) |
| Codex.io | [`codex-io/`](codex-io/) | [style](https://styles.refero.design/style/c55d2f24-deb1-44c1-9846-66a3523beb29) |
| Cohere | [`cohere/`](cohere/) | [style](https://styles.refero.design/style/f1bff240-fa05-41db-9ae1-b165ea6ea2cb) |
| Coinbase Spain | [`coinbase-spain/`](coinbase-spain/) | [style](https://styles.refero.design/style/df5e2be4-c2bd-42bb-bbc7-409bae6355c3) |
| Column | [`column/`](column/) | [style](https://styles.refero.design/style/a76ec6ba-20b3-495c-9d89-1e58281e79e7) |
| Common | [`common/`](common/) | [style](https://styles.refero.design/style/54bfd692-3299-48ab-8cf5-784e632227b1) |
| Composer | [`composer/`](composer/) | [style](https://styles.refero.design/style/1e675740-7935-4a49-b4c8-e5aa9fda06dd) |
| Compound | [`compound/`](compound/) | [style](https://styles.refero.design/style/cd31ecdb-297a-4fc5-a727-05f835ff917f) |
| Concrete Club Studio | [`concrete-club-studio/`](concrete-club-studio/) | [style](https://styles.refero.design/style/f8ab25e8-87c1-4d7b-a633-daf3ea39b916) |
| Contra | [`contra/`](contra/) | [style](https://styles.refero.design/style/1608cf19-b249-46d4-bd37-b4c6a7fc4b56) |
| Contract | [`contract/`](contract/) | [style](https://styles.refero.design/style/76faeb42-b43d-4cc7-ac03-1e4bd74f04b7) |
| Contractbook | [`contractbook/`](contractbook/) | [style](https://styles.refero.design/style/fbc60c55-da20-4684-a279-0ed86590272e) |
| Contrast | [`contrast/`](contrast/) | [style](https://styles.refero.design/style/effca480-81fb-4b8f-ab9c-3aa8c219c82a) |
| Control | [`control/`](control/) | [style](https://styles.refero.design/style/f4e3f701-0fa0-4601-b652-ecfc5c573f86) |
| Convex | [`convex/`](convex/) | [style](https://styles.refero.design/style/f71e92b0-d7a5-4203-b975-394f185218c2) |
| Copilot Money | [`copilot-money/`](copilot-money/) | [style](https://styles.refero.design/style/91b110da-902b-4d09-8bf0-26bd1f25f8b2) |
| Copy | [`copy/`](copy/) | [style](https://styles.refero.design/style/1ae4bcfe-c613-42fc-aab7-f9583381e7cc) |
| Cora | [`cora/`](cora/) | [style](https://styles.refero.design/style/1ab3cde9-0833-4e38-8ada-fc23156f730e) |
| cord.com | [`cord-com/`](cord-com/) | [style](https://styles.refero.design/style/485ae5fb-8f25-4aa3-a4e4-1deb1590d7d6) |
| Cori Corinne | [`cori-corinne/`](cori-corinne/) | [style](https://styles.refero.design/style/2c18e573-0ffb-4f0d-848c-ff72a5839fd3) |
| COS | [`cos/`](cos/) | [style](https://styles.refero.design/style/7922b756-2d0f-4a58-8fa6-39d40264fe66) |
| Cosmos | [`cosmos/`](cosmos/) | [style](https://styles.refero.design/style/eb804e3a-1b75-446c-8374-114bbabaf0cd) |
| Cosmos Network | [`cosmos-network/`](cosmos-network/) | [style](https://styles.refero.design/style/60ee0386-cfad-409a-8310-762bfc2e4816) |
| Counterprint | [`counterprint/`](counterprint/) | [style](https://styles.refero.design/style/36ab47c3-3d47-42a5-af2e-1760bc348bcd) |
| Cowboy | [`cowboy/`](cowboy/) | [style](https://styles.refero.design/style/00ce9181-45be-4340-b6a6-75a4d5d60cef) |
| CQCM | [`cqcm/`](cqcm/) | [style](https://styles.refero.design/style/12db22d6-7738-4aee-ab6b-6d6731c7e1e0) |
| Craft | [`craft/`](craft/) | [style](https://styles.refero.design/style/329075e8-97ed-4722-8952-d9bf001de233) |
| Craft Docs | [`craft-docs/`](craft-docs/) | [style](https://styles.refero.design/style/9f228e72-997a-4410-9190-68359028e3d0) |
| Craftwork | [`craftwork/`](craftwork/) | [style](https://styles.refero.design/style/47c9e353-bed3-4d6c-8316-63a2db5cc377) |
| Creative Giants | [`creative-giants/`](creative-giants/) | [style](https://styles.refero.design/style/ff8f39ee-a10e-4a9d-a94d-6993c6084060) |
| Cron Calendar | [`cron-calendar/`](cron-calendar/) | [style](https://styles.refero.design/style/476184db-a4e6-440b-aa53-27294668361c) |
| cthdrl | [`cthdrl/`](cthdrl/) | [style](https://styles.refero.design/style/565bfc50-3a19-4224-9a4c-125edaeb7bef) |
| Cup of Couple | [`cup-of-couple/`](cup-of-couple/) | [style](https://styles.refero.design/style/f4e1b510-6085-4fb8-8597-05d479d3c00c) |
| Current | [`current/`](current/) | [style](https://styles.refero.design/style/84b951e2-eaae-4f56-8f3f-d90407517a56) |
| Cursor | [`cursor/`](cursor/) | [style](https://styles.refero.design/style/4e3b4717-84c8-4599-baaf-a343c3d619b6) |
| Custo | [`custo/`](custo/) | [style](https://styles.refero.design/style/3ad131ed-b603-49a3-9491-7407db6cb423) |
| Customer.io | [`customer-io/`](customer-io/) | [style](https://styles.refero.design/style/abbaa70a-5fe2-44a9-9c5f-272e68c450c3) |
| Cycle | [`cycle/`](cycle/) | [style](https://styles.refero.design/style/3677bc04-7461-4aa4-aec7-5291bac41b0b) |
| D.S. & DURGA | [`d-s-durga/`](d-s-durga/) | [style](https://styles.refero.design/style/391bd401-06d7-4444-8243-8573e96eab24) |
| Daniël van der Winden | [`danie-l-van-der-winden/`](danie-l-van-der-winden/) | [style](https://styles.refero.design/style/e8eda526-d686-4e45-a60d-61b6503a8eda) |
| Daniel Sun | [`daniel-sun/`](daniel-sun/) | [style](https://styles.refero.design/style/8d1b6c70-e045-4ce6-891d-aba5d5c00e0d) |
| Daniel Triendl | [`daniel-triendl/`](daniel-triendl/) | [style](https://styles.refero.design/style/14f10100-a102-427a-88d1-7cc80cbb332d) |
| Daniela and Moe Wedding 2019 | [`daniela-and-moe-wedding-2019/`](daniela-and-moe-wedding-2019/) | [style](https://styles.refero.design/style/0f1b3cd0-de5a-4418-8711-0e1afe04707c) |
| Daniellelevitt | [`daniellelevitt/`](daniellelevitt/) | [style](https://styles.refero.design/style/1a8d2d66-bb84-4929-acbe-2685fc9ab6e7) |
| Danilo Rodrigues | [`danilo-rodrigues/`](danilo-rodrigues/) | [style](https://styles.refero.design/style/0d68dc70-15ec-494a-855d-fdb6a4e7c982) |
| Dash Digital Studio | [`dash-digital-studio/`](dash-digital-studio/) | [style](https://styles.refero.design/style/6036b661-3886-4f76-a5e6-bb8960eb7db5) |
| Dashlane | [`dashlane/`](dashlane/) | [style](https://styles.refero.design/style/722f32e7-8217-4808-843d-b454eea7320a) |
| Datalands | [`datalands/`](datalands/) | [style](https://styles.refero.design/style/a7530405-e523-4268-bba5-ef13549fd61c) |
| David Kirschberg | [`david-kirschberg/`](david-kirschberg/) | [style](https://styles.refero.design/style/004f4856-4b01-4c23-a9fb-866303d5013b) |
| Daylit | [`daylit/`](daylit/) | [style](https://styles.refero.design/style/5076959f-f849-4b50-8f8a-2040d4756f98) |
| ddna | [`ddna/`](ddna/) | [style](https://styles.refero.design/style/0e8e546b-004c-46b6-a960-5dd88968ae07) |
| Decide AI | [`decide-ai/`](decide-ai/) | [style](https://styles.refero.design/style/5d9e1cc2-4b81-40fe-aa92-640f2e1d7420) |
| Deel | [`deel/`](deel/) | [style](https://styles.refero.design/style/5ec4eb4f-a37c-4787-b4c1-de49e01770e7) |
| Deezer | [`deezer/`](deezer/) | [style](https://styles.refero.design/style/502af24a-b765-44b2-828f-dd610f27a125) |
| Default | [`default/`](default/) | [style](https://styles.refero.design/style/eeeb6ac9-fc07-4965-935a-e1989ed831f1) |
| Delphi | [`delphi/`](delphi/) | [style](https://styles.refero.design/style/43c1b150-0dab-42f9-9bce-fe0be3dde26c) |
| Dennis Snellenberg | [`dennis-snellenberg/`](dennis-snellenberg/) | [style](https://styles.refero.design/style/28e8e762-8d8c-4e88-84ed-858f9917cb58) |
| Deno | [`deno/`](deno/) | [style](https://styles.refero.design/style/973dcf14-2237-4346-81af-3d8c811666c2) |
| Depot | [`depot/`](depot/) | [style](https://styles.refero.design/style/f4636c5b-1342-48b2-b9b1-a82e2182440e) |
| Descript | [`descript/`](descript/) | [style](https://styles.refero.design/style/fe955d4a-c56d-4ab0-a6b3-8d985ab9570c) |
| Design | [`design/`](design/) | [style](https://styles.refero.design/style/bbfbe753-a417-43ec-9af7-ef6c08a5140d) |
| Design Full-Time | [`design-full-time/`](design-full-time/) | [style](https://styles.refero.design/style/80b2cc74-62c5-4898-bc2b-12aa94ed2943) |
| Designmodo | [`designmodo/`](designmodo/) | [style](https://styles.refero.design/style/c60a19c1-259a-4001-95d9-6a3826f5c06e) |
| Desktop.fm | [`desktop-fm/`](desktop-fm/) | [style](https://styles.refero.design/style/cb266ff9-f168-4a42-a522-f0e84508f90f) |
| destroytoday.com | [`destroytoday-com/`](destroytoday-com/) | [style](https://styles.refero.design/style/b8fd5772-ac2b-4bfd-b5e5-d182261b09c5) |
| Deta Surf | [`deta-surf/`](deta-surf/) | [style](https://styles.refero.design/style/51752cfb-4fd4-464f-8b78-ecbc813830e1) |
| Dezeen | [`dezeen/`](dezeen/) | [style](https://styles.refero.design/style/9e2dceb8-0c87-45db-8830-9df961b02b32) |
| Dia Browser | [`dia-browser/`](dia-browser/) | [style](https://styles.refero.design/style/b458ca1a-70f0-4f85-b745-f879a4d08457) |
| Diabla | [`diabla/`](diabla/) | [style](https://styles.refero.design/style/5528d10f-2e7d-4502-aa49-7bde290e8fe2) |
| Dialog | [`dialog/`](dialog/) | [style](https://styles.refero.design/style/c8c22958-ec50-47f1-aedc-a131d7aeb442) |
| DICE | [`dice/`](dice/) | [style](https://styles.refero.design/style/f4af4c42-2cba-4aa6-8d06-2f728bce702d) |
| Dimension | [`dimension/`](dimension/) | [style](https://styles.refero.design/style/fbcf9cbb-7c6b-449d-862a-bce521a8ab1d) |
| Discord | [`discord/`](discord/) | [style](https://styles.refero.design/style/faec4b0c-cf93-4150-97de-0a8e7eed1840) |
| Discover | [`discover/`](discover/) | [style](https://styles.refero.design/style/86de6781-d22b-4879-90df-44acb1fe20f3) |
| Ditto | [`ditto/`](ditto/) | [style](https://styles.refero.design/style/2db41cd9-c898-4f59-b704-3042c0d87f45) |
| Ditto | [`ditto-e9001d5a/`](ditto-e9001d5a/) | [style](https://styles.refero.design/style/e9001d5a-504d-47ed-aef0-d0d35fa86418) |
| DJI | [`dji/`](dji/) | [style](https://styles.refero.design/style/f11750fc-d7c0-4d26-b32a-3b1d2098ae34) |
| DNA | [`dna/`](dna/) | [style](https://styles.refero.design/style/bd9fdad0-ebe6-4546-a5c0-ed132ed0a471) |
| DNCO | [`dnco/`](dnco/) | [style](https://styles.refero.design/style/c072c00a-ee7f-4160-bd06-645cca12f7a8) |
| Dock | [`dock/`](dock/) | [style](https://styles.refero.design/style/d7fb1721-1878-4cbb-a24b-051800557c75) |
| Dollar Shave Club | [`dollar-shave-club/`](dollar-shave-club/) | [style](https://styles.refero.design/style/6d72f05e-dce6-43ad-9532-f61bf211ed46) |
| Doo | [`doo/`](doo/) | [style](https://styles.refero.design/style/d486c348-fc1b-4b01-9064-1213e4dbcb1b) |
| dope.security | [`dope-security/`](dope-security/) | [style](https://styles.refero.design/style/e1f18a7e-5af1-46b3-8f89-bce6c78b80d4) |
| Dopper | [`dopper/`](dopper/) | [style](https://styles.refero.design/style/734ab03c-a326-43e3-a463-c5f90247404f) |
| Doppler | [`doppler/`](doppler/) | [style](https://styles.refero.design/style/10654184-eb92-4b75-a7af-bd92bc6cdc5c) |
| (dot)connect | [`dot-connect/`](dot-connect/) | [style](https://styles.refero.design/style/981d90e9-7be3-497f-a899-52a0a9ec16f4) |
| Dot Inc. | [`dot-inc/`](dot-inc/) | [style](https://styles.refero.design/style/4bcd0728-0d28-4835-ba9f-d61554f797b1) |
| Doug–Alves | [`doug-alves/`](doug-alves/) | [style](https://styles.refero.design/style/24c54bfb-959d-4ca3-b274-e76ba823f3c0) |
| Dovetail | [`dovetail/`](dovetail/) | [style](https://styles.refero.design/style/1d51a2db-18fc-4de3-bff7-d1e73ace8b6e) |
| Dovetail | [`dovetail-108e2695/`](dovetail-108e2695/) | [style](https://styles.refero.design/style/108e2695-6970-47d5-b5b0-eea8fc34e048) |
| Dovetail | [`dovetail-6f9452a4/`](dovetail-6f9452a4/) | [style](https://styles.refero.design/style/6f9452a4-3b64-4c6f-a05e-528d7a586f24) |
| DrawHistory | [`drawhistory/`](drawhistory/) | [style](https://styles.refero.design/style/25246b10-83a4-4f51-a411-cf85503b94a8) |
| Drepute | [`drepute/`](drepute/) | [style](https://styles.refero.design/style/523d3e7b-b0a2-4979-a626-00f1487b6e4d) |
| Dribbble | [`dribbble/`](dribbble/) | [style](https://styles.refero.design/style/b8ce0a90-40c6-4518-940c-8c97ccf9c1a0) |
| Dries Bos | [`dries-bos/`](dries-bos/) | [style](https://styles.refero.design/style/6d0db1c7-5500-40cd-b2f3-d3d9abbd3a2f) |
| Drive Capital | [`drive-capital/`](drive-capital/) | [style](https://styles.refero.design/style/241ebab6-1f3a-4637-8754-4f6b164ea090) |
| Drizzle ORM | [`drizzle-orm/`](drizzle-orm/) | [style](https://styles.refero.design/style/972925c4-0caa-4dc2-9c00-798b5be0ad70) |
| Drop | [`drop/`](drop/) | [style](https://styles.refero.design/style/36d939b8-e3b5-45c7-8d81-f7c4d7c8fdaa) |
| Dropbox.com | [`dropbox-com/`](dropbox-com/) | [style](https://styles.refero.design/style/2b41e7c4-1e8c-4ea2-a87f-51e24c57886e) |
| Dropmark | [`dropmark/`](dropmark/) | [style](https://styles.refero.design/style/5618f26a-4df6-42cb-8081-15e4318b54ff) |
| Dub | [`dub/`](dub/) | [style](https://styles.refero.design/style/b0d80806-b724-4ed1-a1d1-074edd3c9bc9) |
| Dub Links | [`dub-links/`](dub-links/) | [style](https://styles.refero.design/style/7bbbf1bc-e375-4200-8d71-e373a3c78654) |
| Dul Zorigoo | [`dul-zorigoo/`](dul-zorigoo/) | [style](https://styles.refero.design/style/c8ca6c83-3197-4b19-af1c-b29d6f829c5f) |
| Duna | [`duna/`](duna/) | [style](https://styles.refero.design/style/8cf4a580-bfb6-4090-a899-f734ffe62370) |
| Duolingo | [`duolingo/`](duolingo/) | [style](https://styles.refero.design/style/7088d695-362b-4e09-b325-fa8136d4f350) |
| Duolingo | [`duolingo-95b472c5/`](duolingo-95b472c5/) | [style](https://styles.refero.design/style/95b472c5-fc07-46a8-a11f-c5432e290fcd) |
| Duties.xyz | [`duties-xyz/`](duties-xyz/) | [style](https://styles.refero.design/style/e75b3106-fc5b-4bb8-8d7d-a7ab224fd27d) |
| Dylanbrouwer | [`dylanbrouwer/`](dylanbrouwer/) | [style](https://styles.refero.design/style/b1e82907-d1cf-46cd-8ae7-3561c5b15fd0) |
| Dyotanya | [`dyotanya/`](dyotanya/) | [style](https://styles.refero.design/style/1b13360a-cdca-4798-969d-57ebb20a3b30) |
| Dyson | [`dyson/`](dyson/) | [style](https://styles.refero.design/style/96845df2-7ddb-420a-814e-c339f95a6554) |
| Earlydog | [`earlydog/`](earlydog/) | [style](https://styles.refero.design/style/707a1648-eaef-4629-9c5a-b835cedde250) |
| Ease Health | [`ease-health/`](ease-health/) | [style](https://styles.refero.design/style/e9f5e976-53f7-42f5-a882-4e63b3c2f734) |
| Eat Real Food | [`eat-real-food/`](eat-real-food/) | [style](https://styles.refero.design/style/3d32f841-490d-4e5f-aba0-43c9d0c13130) |
| Eclipse | [`eclipse/`](eclipse/) | [style](https://styles.refero.design/style/fd2e0187-e67b-4869-8cfd-9de9e58d2868) |
| Eco | [`eco/`](eco/) | [style](https://styles.refero.design/style/9cc537fc-97d8-4632-8703-f9aa296c2206) |
| Ecosia | [`ecosia/`](ecosia/) | [style](https://styles.refero.design/style/198d4f13-0e88-4372-86fd-7abf34a668b1) |
| Eddie | [`eddie/`](eddie/) | [style](https://styles.refero.design/style/5f446754-1fb7-4a99-8cee-7bd5de3bfd9e) |
| Eduardo del Fraile | [`eduardo-del-fraile/`](eduardo-del-fraile/) | [style](https://styles.refero.design/style/e11be5e4-cd8f-410e-bfe1-8763ed62fac3) |
| Egstad | [`egstad/`](egstad/) | [style](https://styles.refero.design/style/ec17bdec-c8fa-4221-abd6-da717bf38d96) |
| Eight Sleep | [`eight-sleep/`](eight-sleep/) | [style](https://styles.refero.design/style/e4e8fe86-47ed-4ddd-a6c6-2c28eae9aabe) |
| Eindhoven Design District | [`eindhoven-design-district/`](eindhoven-design-district/) | [style](https://styles.refero.design/style/c90b584e-de5b-4971-9e13-8ab991bd96c0) |
| Electronic Materials Office® | [`electronic-materials-office/`](electronic-materials-office/) | [style](https://styles.refero.design/style/297f65f7-0fbd-4521-ab91-a5f6e17175d9) |
| Elektron | [`elektron/`](elektron/) | [style](https://styles.refero.design/style/6b5a0bf4-3d2a-4c3b-aa2e-652f1acb82c0) |
| Elementor | [`elementor/`](elementor/) | [style](https://styles.refero.design/style/4bbc63cf-c995-4c56-9873-e7f300f1c9e7) |
| ElevenLabs | [`elevenlabs/`](elevenlabs/) | [style](https://styles.refero.design/style/031056ff-7af1-46db-8daa-115f731c5d26) |
| ElevenReader | [`elevenreader/`](elevenreader/) | [style](https://styles.refero.design/style/c51c8371-0e42-4bdf-9766-c9eac5eee9a5) |
| Elva | [`elva/`](elva/) | [style](https://styles.refero.design/style/9568198a-5a51-4cbb-9dc3-b7610757cdd6) |
| Elvina Prasad | [`elvina-prasad/`](elvina-prasad/) | [style](https://styles.refero.design/style/717a2f6f-bc7d-4f9a-adcb-1465fdf77c9a) |
| Emmalewisham | [`emmalewisham/`](emmalewisham/) | [style](https://styles.refero.design/style/1e93f444-0b01-4412-aa2b-877be5ef08d7) |
| Employment Hero | [`employment-hero/`](employment-hero/) | [style](https://styles.refero.design/style/f4ebfdf4-c79c-4d95-8221-9330254fb1f9) |
| Empower | [`empower/`](empower/) | [style](https://styles.refero.design/style/8d3dc65e-4443-4bb3-b1a9-b0fc98381db9) |
| Endlesstools | [`endlesstools/`](endlesstools/) | [style](https://styles.refero.design/style/667c59e3-aaba-46e8-a2b3-255254328b6e) |
| Enter GmbH | [`enter-gmbh/`](enter-gmbh/) | [style](https://styles.refero.design/style/87da9872-f6cc-4354-bf6a-1c02f0394d45) |
| entire studios | [`entire-studios/`](entire-studios/) | [style](https://styles.refero.design/style/cef25151-078c-4631-8f02-4f204f071b8b) |
| Enviar Dinero | [`enviar-dinero/`](enviar-dinero/) | [style](https://styles.refero.design/style/46c16139-b0bb-49e6-95dc-74bef576e5ce) |
| EPIC agency | [`epic-agency/`](epic-agency/) | [style](https://styles.refero.design/style/6eb778ca-6808-4cc6-ac8a-7beea5a25c36) |
| Epidemicsound | [`epidemicsound/`](epidemicsound/) | [style](https://styles.refero.design/style/d1f5ece3-ec6c-467d-8a59-51ee259cc023) |
| Equals | [`equals/`](equals/) | [style](https://styles.refero.design/style/dae7cbf2-0485-433b-8f63-eea8716ad14d) |
| Era | [`era/`](era/) | [style](https://styles.refero.design/style/715a3ad2-5b6d-421f-b72b-3aa6fec86351) |
| Eraser | [`eraser/`](eraser/) | [style](https://styles.refero.design/style/77c31465-7b28-4ab7-b7ff-c9811cda0df0) |
| Erno Forsström | [`erno-forsstro-m/`](erno-forsstro-m/) | [style](https://styles.refero.design/style/cffa5959-4283-41d2-ad11-bada2d731419) |
| Escape Coffee Company | [`escape-coffee-company/`](escape-coffee-company/) | [style](https://styles.refero.design/style/b5532c58-620a-4d69-8861-35b2b6443956) |
| Essie Wine | [`essie-wine/`](essie-wine/) | [style](https://styles.refero.design/style/07f5281d-2a18-4e12-a8ff-d54d3e03d198) |
| ethereum.org | [`ethereum-org/`](ethereum-org/) | [style](https://styles.refero.design/style/f53b2759-5b4a-4509-9311-51ab74238326) |
| Eventbrite | [`eventbrite/`](eventbrite/) | [style](https://styles.refero.design/style/1fa0d9da-966f-4d43-9775-e156bec3a3b3) |
| Evergreen | [`evergreen/`](evergreen/) | [style](https://styles.refero.design/style/a4314209-7688-4750-842a-432c3918a21b) |
| Everlane | [`everlane/`](everlane/) | [style](https://styles.refero.design/style/34b4856c-cc2b-4164-ab90-1b87cf8e0213) |
| Evermade | [`evermade/`](evermade/) | [style](https://styles.refero.design/style/b22f68eb-7ed1-47b6-995e-2c0afc79ac7e) |
| Evernote | [`evernote/`](evernote/) | [style](https://styles.refero.design/style/0c0b6140-2b6c-44f8-8bba-4ecfcadba420) |
| Evervault | [`evervault/`](evervault/) | [style](https://styles.refero.design/style/03dcd158-bc4d-447b-aaf2-8e522671a109) |
| EVOKE | [`evoke/`](evoke/) | [style](https://styles.refero.design/style/a69de146-6ff1-4ea8-b4a4-9d182ca2de31) |
| Exante | [`exante/`](exante/) | [style](https://styles.refero.design/style/af3641fb-7d3c-40f4-aba1-42770dfaf091) |
| Exhibition Magazine | [`exhibition-magazine/`](exhibition-magazine/) | [style](https://styles.refero.design/style/597355de-6167-4f37-8f14-b3897919a94c) |
| Exo Ape | [`exo-ape/`](exo-ape/) | [style](https://styles.refero.design/style/18e84ffd-4a5d-453d-aeff-dae2847aa3c9) |
| Expo | [`expo/`](expo/) | [style](https://styles.refero.design/style/b054773d-2d14-4a35-b366-81b4ac00f171) |
| ExpressVPN | [`expressvpn/`](expressvpn/) | [style](https://styles.refero.design/style/eddfa579-89f1-467d-a486-99a56be36c30) |
| Extract | [`extract/`](extract/) | [style](https://styles.refero.design/style/c4e125b6-e3a3-4509-b06f-f0169216a394) |
| Fable | [`fable/`](fable/) | [style](https://styles.refero.design/style/ab650279-aa18-43e5-a998-34190d7bedc7) |
| Fabric | [`fabric/`](fabric/) | [style](https://styles.refero.design/style/67cdbe0a-a9d5-4a41-91a6-5b26550efc69) |
| Face Formula | [`face-formula/`](face-formula/) | [style](https://styles.refero.design/style/78ac71e1-cd4c-4b4d-bac5-e7e6c65cd3fa) |
| Factory | [`factory/`](factory/) | [style](https://styles.refero.design/style/13d6fc89-eba2-4724-ac37-20f4f2e5efec) |
| Faire ES | [`faire-es/`](faire-es/) | [style](https://styles.refero.design/style/6fb648be-cc69-4a84-a798-9f0f006922a0) |
| Fallen Grape | [`fallen-grape/`](fallen-grape/) | [style](https://styles.refero.design/style/17ce9ad2-f22d-4e48-92de-e28fb8551cc5) |
| Family | [`family/`](family/) | [style](https://styles.refero.design/style/1bcae895-2245-4d33-aa43-1c1e80719554) |
| FARFETCH España | [`farfetch-espan-a/`](farfetch-espan-a/) | [style](https://styles.refero.design/style/600002c5-c5f5-4df0-adf6-6324ee6255c0) |
| fastht.ml | [`fastht-ml/`](fastht-ml/) | [style](https://styles.refero.design/style/786f99e5-8c40-4205-a878-bf006b330f4e) |
| Favorit Studio | [`favorit-studio/`](favorit-studio/) | [style](https://styles.refero.design/style/7e03ab3b-1344-43d7-a7c4-2f31395758ae) |
| FeedHive | [`feedhive/`](feedhive/) | [style](https://styles.refero.design/style/45080e55-1fbe-4726-be23-4c9f54e442aa) |
| Felt | [`felt/`](felt/) | [style](https://styles.refero.design/style/127a4efb-685c-42c3-83eb-72bb410a8429) |
| Ferrari | [`ferrari/`](ferrari/) | [style](https://styles.refero.design/style/80164adf-a898-4f7c-bce7-12f3f62e1649) |
| Fey | [`fey/`](fey/) | [style](https://styles.refero.design/style/733e6475-892a-4138-8835-bf40344df317) |
| Fey | [`fey-a0630421/`](fey-a0630421/) | [style](https://styles.refero.design/style/a0630421-7b66-48b4-aa14-6194a3b2c2b9) |
| Fiasco | [`fiasco/`](fiasco/) | [style](https://styles.refero.design/style/ef73c742-1c3b-48b9-a174-de365ecc4691) |
| Fictional | [`fictional/`](fictional/) | [style](https://styles.refero.design/style/af2e0bc4-ef1c-4365-a25d-00b691218431) |
| Fidèle Editions | [`fide-le-editions/`](fide-le-editions/) | [style](https://styles.refero.design/style/957da5c3-7063-4992-9d25-e255752dc9b3) |
| Figma | [`figma/`](figma/) | [style](https://styles.refero.design/style/5fd3b3b4-02ab-456a-87aa-e4395636b671) |
| Figma | [`figma-60793669/`](figma-60793669/) | [style](https://styles.refero.design/style/60793669-28e2-41bd-bf9d-972151630f7c) |
| Figma Config | [`figma-config/`](figma-config/) | [style](https://styles.refero.design/style/8caa5004-a8cc-4c7e-a2bb-00ff60618729) |
| Figura | [`figura/`](figura/) | [style](https://styles.refero.design/style/5e427a82-a223-4b69-be7f-01c6656ce823) |
| Filling Pieces | [`filling-pieces/`](filling-pieces/) | [style](https://styles.refero.design/style/f401f04f-c45b-4261-9441-f502c6569a29) |
| Fingerprint | [`fingerprint/`](fingerprint/) | [style](https://styles.refero.design/style/da6ad92d-4f29-4f92-a59a-3a46295d0d1c) |
| Finn | [`finn/`](finn/) | [style](https://styles.refero.design/style/07546cf0-b9df-49dd-9da9-319d7a654703) |
| Firecrawl | [`firecrawl/`](firecrawl/) | [style](https://styles.refero.design/style/78fec83e-4b27-44ab-9f64-31e9dee53e46) |
| Firstandforemost | [`firstandforemost/`](firstandforemost/) | [style](https://styles.refero.design/style/ac86af87-6f60-42a2-b805-87a168792e55) |
| Fiverr.com | [`fiverr-com/`](fiverr-com/) | [style](https://styles.refero.design/style/c3b34927-0638-463e-bf85-180d73bfc367) |
| Flatfile | [`flatfile/`](flatfile/) | [style](https://styles.refero.design/style/1ded7f89-3df0-4e7c-9cac-28218d038575) |
| Flayks | [`flayks/`](flayks/) | [style](https://styles.refero.design/style/77a193de-2472-4637-802f-d930ec61c180) |
| Flecto | [`flecto/`](flecto/) | [style](https://styles.refero.design/style/fdc72952-9b36-443a-9e0c-20b366aee29f) |
| Flighty | [`flighty/`](flighty/) | [style](https://styles.refero.design/style/0d0de64c-1891-4984-9e12-8976e042ce11) |
| Flim | [`flim/`](flim/) | [style](https://styles.refero.design/style/94ed6ce8-c2e5-45bf-83bd-e5d1daf63efc) |
| FLORA | [`flora/`](flora/) | [style](https://styles.refero.design/style/cf8cd07d-bff0-41dc-ab70-fa85750f6168) |
| Flowers For Society | [`flowers-for-society/`](flowers-for-society/) | [style](https://styles.refero.design/style/e00519a1-7b8a-4171-b49b-550c64a57d3c) |
| Flowmapp | [`flowmapp/`](flowmapp/) | [style](https://styles.refero.design/style/caca412f-7fc7-4510-aacc-5664d4f8ce9f) |
| Flox | [`flox/`](flox/) | [style](https://styles.refero.design/style/8fd92584-c3c1-421b-92f8-338ae80ba72e) |
| FlutterFlow | [`flutterflow/`](flutterflow/) | [style](https://styles.refero.design/style/4e1ac04c-02ae-41cf-b588-3f6226a882f8) |
| Flutterwave Design | [`flutterwave-design/`](flutterwave-design/) | [style](https://styles.refero.design/style/97bbc1bd-873f-4048-b4cc-b20ea2e70097) |
| Fluz | [`fluz/`](fluz/) | [style](https://styles.refero.design/style/7ce6bd42-e498-47c0-ad02-7b3a0f5d94e0) |
| Fly.io | [`fly-io/`](fly-io/) | [style](https://styles.refero.design/style/0c77bb2a-c7cd-499b-b5cd-90268eefe906) |
| Flying Papers | [`flying-papers/`](flying-papers/) | [style](https://styles.refero.design/style/7d254296-6817-487a-a58c-4d5eca89cbf3) |
| Fold | [`fold/`](fold/) | [style](https://styles.refero.design/style/4d1d50ff-18b8-4acf-a356-48eb5c414711) |
| Fonts In Use | [`fonts-in-use/`](fonts-in-use/) | [style](https://styles.refero.design/style/348c83bc-bed3-4562-841a-26a30ee19a9b) |
| Foodnoms | [`foodnoms/`](foodnoms/) | [style](https://styles.refero.design/style/1e7dae3b-cb34-4fcf-8c32-051152aebbab) |
| FORA | [`fora/`](fora/) | [style](https://styles.refero.design/style/9929101b-90d4-4306-bc4a-4d8f65b527f5) |
| Forner | [`forner/`](forner/) | [style](https://styles.refero.design/style/2a830d03-cebc-48f0-a50f-ad78168c5026) |
| Foundry | [`foundry/`](foundry/) | [style](https://styles.refero.design/style/896f0ea9-6f1a-40a6-aba7-fdaa579c7352) |
| Frame.io | [`frame-io/`](frame-io/) | [style](https://styles.refero.design/style/30c3aa18-4323-4448-8ddd-3ca933fe5780) |
| Framer | [`framer/`](framer/) | [style](https://styles.refero.design/style/d417b42f-824d-45ba-a02e-cbef3b8ea0d8) |
| Framer | [`framer-242db326/`](framer-242db326/) | [style](https://styles.refero.design/style/242db326-a6f3-482a-b12e-5e7f8af94981) |
| Franco Maria Ricci Editore | [`franco-maria-ricci-editore/`](franco-maria-ricci-editore/) | [style](https://styles.refero.design/style/6120469b-a1c8-46d3-b7fd-8aa6dc22c0d9) |
| FRANKY'S | [`franky-s/`](franky-s/) | [style](https://styles.refero.design/style/7c84da5d-b7a0-436f-bfaa-68d0a14f8e86) |
| Free Podcast Hosting | [`free-podcast-hosting/`](free-podcast-hosting/) | [style](https://styles.refero.design/style/b409c050-ab0f-4cf0-a388-95fd7072cd6a) |
| Free Resume Builder | [`free-resume-builder/`](free-resume-builder/) | [style](https://styles.refero.design/style/41e65213-1c4a-41c4-b715-50427fa8926e) |
| Freelance frontend UI developer and designer, Rou Hun Fan | [`freelance-frontend-ui-developer-and-designer-rou-hun-fan/`](freelance-frontend-ui-developer-and-designer-rou-hun-fan/) | [style](https://styles.refero.design/style/ffb945f9-2d70-45e8-9024-492900318fa8) |
| Freitag | [`freitag/`](freitag/) | [style](https://styles.refero.design/style/d75a643b-a518-4550-b430-679cd989a447) |
| Freshman | [`freshman/`](freshman/) | [style](https://styles.refero.design/style/a6284fcd-fa69-4469-ac40-4239e5b84a39) |
| Freytag Anderson | [`freytag-anderson/`](freytag-anderson/) | [style](https://styles.refero.design/style/2d4fc4ba-2ea4-465f-8644-f3ff5c6713a2) |
| Front | [`front/`](front/) | [style](https://styles.refero.design/style/3281b445-805b-4dc7-933f-42b544a6d798) |
| Frontier AI LLMs | [`frontier-ai-llms/`](frontier-ai-llms/) | [style](https://styles.refero.design/style/d3caa7bf-2e2e-489a-845d-5cab274e7a92) |
| Frontify | [`frontify/`](frontify/) | [style](https://styles.refero.design/style/8f42603d-7ff9-446e-99a3-6bdd1f388ae5) |
| Fruitful | [`fruitful/`](fruitful/) | [style](https://styles.refero.design/style/3634d5eb-ccfa-4881-b234-3dd735fb7ae4) |
| Function | [`function/`](function/) | [style](https://styles.refero.design/style/21b71be3-78a0-4681-a5b9-64cc4b40eb67) |
| Fuser | [`fuser/`](fuser/) | [style](https://styles.refero.design/style/bf5616e4-7bd1-40ce-8b2d-aae84c2e4ebd) |
| Galileo-ft | [`galileo-ft/`](galileo-ft/) | [style](https://styles.refero.design/style/10a77cbd-7847-4e1b-a09e-447ebad0f7c6) |
| Gamma | [`gamma/`](gamma/) | [style](https://styles.refero.design/style/4782832c-1c23-4fe3-997c-2a08d7b6c5d1) |
| Garden Eight | [`garden-eight/`](garden-eight/) | [style](https://styles.refero.design/style/e4593570-e43f-4eda-8618-0bb704d5ebb7) |
| General Intelligence Company | [`general-intelligence-company/`](general-intelligence-company/) | [style](https://styles.refero.design/style/34baa524-5d5b-4165-bbab-d01f05e6d6b9) |
| Generative AI | [`generative-ai/`](generative-ai/) | [style](https://styles.refero.design/style/14cc44e6-41bf-4178-b834-fc61bfeed4ae) |
| Geniestudio | [`geniestudio/`](geniestudio/) | [style](https://styles.refero.design/style/2ffd50d4-93b7-4acf-9bc2-e86e61b63f27) |
| Genway | [`genway/`](genway/) | [style](https://styles.refero.design/style/a81607e2-254f-4f53-b357-68c39c9cfc03) |
| Getanchor | [`getanchor/`](getanchor/) | [style](https://styles.refero.design/style/51734338-9046-47eb-a595-77ffa37b4725) |
| Getburnt | [`getburnt/`](getburnt/) | [style](https://styles.refero.design/style/002cc5a7-0d34-4d8d-afa0-c5fad69477d5) |
| Getclockwise | [`getclockwise/`](getclockwise/) | [style](https://styles.refero.design/style/6024d069-8a74-4534-917f-5f5b11224cc5) |
| Getharvest | [`getharvest/`](getharvest/) | [style](https://styles.refero.design/style/1eee9aa2-1e23-4675-9f6e-fb98c93969bd) |
| Ghia | [`ghia/`](ghia/) | [style](https://styles.refero.design/style/156462ab-7b11-4029-be45-c2dba853e894) |
| Ghost | [`ghost/`](ghost/) | [style](https://styles.refero.design/style/532b3211-cca9-4207-a11c-812cfabc1a73) |
| Giga | [`giga/`](giga/) | [style](https://styles.refero.design/style/607e0dbf-e2fc-45c9-b939-946b8981c156) |
| Gigantic | [`gigantic/`](gigantic/) | [style](https://styles.refero.design/style/22e11001-8786-4af7-bdb9-f9419ce8ad1a) |
| Gitbook | [`gitbook/`](gitbook/) | [style](https://styles.refero.design/style/ea8a4150-e062-4c0e-94ca-668a3033eb63) |
| GitHub | [`github/`](github/) | [style](https://styles.refero.design/style/c3ceca5c-d329-4559-b947-016172941ba2) |
| Glassnode | [`glassnode/`](glassnode/) | [style](https://styles.refero.design/style/a79b6a74-6b67-4c9f-9d69-bff80869b943) |
| Gleap | [`gleap/`](gleap/) | [style](https://styles.refero.design/style/2eab438d-32cd-40c2-b160-1e4127dac569) |
| Glein | [`glein/`](glein/) | [style](https://styles.refero.design/style/2e4ce685-9f49-47a3-9577-bc4f196bd8f7) |
| Glideapps | [`glideapps/`](glideapps/) | [style](https://styles.refero.design/style/a80cb179-2d90-4896-b52d-4e674b421498) |
| Glitch Blog | [`glitch-blog/`](glitch-blog/) | [style](https://styles.refero.design/style/8472cc85-e4fa-4011-b742-1b9fc7966d76) |
| Glossier | [`glossier/`](glossier/) | [style](https://styles.refero.design/style/efd8dda0-b7dc-4b0b-b65f-348849d2cd65) |
| Glow | [`glow/`](glow/) | [style](https://styles.refero.design/style/6d9b6fe6-51f4-4978-82dd-a791c28db5cf) |
| Glyphy | [`glyphy/`](glyphy/) | [style](https://styles.refero.design/style/6ec18fa7-41ff-41e0-8824-94f6fa104a75) |
| Gocardless | [`gocardless/`](gocardless/) | [style](https://styles.refero.design/style/48ae4f04-21cb-4ab3-8752-33b626a48c95) |
| Going™ | [`going/`](going/) | [style](https://styles.refero.design/style/3461e90e-35d2-4269-9f11-cbe935f0a3a2) |
| Good Glyphs | [`good-glyphs/`](good-glyphs/) | [style](https://styles.refero.design/style/41220ec0-ca0d-4697-a2fc-7a9a50d52e7c) |
| Goodnotes | [`goodnotes/`](goodnotes/) | [style](https://styles.refero.design/style/c7fe6b78-9ce3-4d69-a3f0-b8310c779e7a) |
| Google for Education | [`google-for-education/`](google-for-education/) | [style](https://styles.refero.design/style/c57ba3f8-1d76-4660-8ba4-48ddce26e759) |
| Graf Lantz | [`graf-lantz/`](graf-lantz/) | [style](https://styles.refero.design/style/f1a690c7-234d-4ee9-9806-5790934e7043) |
| Grafbase | [`grafbase/`](grafbase/) | [style](https://styles.refero.design/style/1c1d3939-8d82-4907-aa3c-c9b2fcfbab4f) |
| Grafik | [`grafik/`](grafik/) | [style](https://styles.refero.design/style/0226e028-3cd3-440d-b469-ca459267161d) |
| Grain | [`grain/`](grain/) | [style](https://styles.refero.design/style/04793c2a-ca1a-4edd-a661-56c965e42aec) |
| Grammarly | [`grammarly/`](grammarly/) | [style](https://styles.refero.design/style/be2af3f3-3886-4d70-973f-f7b5ab8d1a99) |
| Granola | [`granola/`](granola/) | [style](https://styles.refero.design/style/d6c2a911-45ed-4860-a992-43df22793c2a) |
| Graphy | [`graphy/`](graphy/) | [style](https://styles.refero.design/style/7f9eabb2-3f76-477d-849f-e868e698f421) |
| GRAZA | [`graza/`](graza/) | [style](https://styles.refero.design/style/f2a84e0f-cf77-41fa-ade0-b062a3a42495) |
| Groq | [`groq/`](groq/) | [style](https://styles.refero.design/style/8efa9029-b39c-48db-a8ec-c97c645a7a58) |
| Grove AI | [`grove-ai/`](grove-ai/) | [style](https://styles.refero.design/style/7f7d3ff7-7a74-40f1-9098-a946ce53d4d4) |
| Gsap | [`gsap/`](gsap/) | [style](https://styles.refero.design/style/00537a20-e99e-4ef2-b119-c6f532c44cc9) |
| Gt-america | [`gt-america/`](gt-america/) | [style](https://styles.refero.design/style/abdac0a6-64f7-46f7-98af-82ce921fe78c) |
| Gt-planar | [`gt-planar/`](gt-planar/) | [style](https://styles.refero.design/style/3f22028a-05d4-4648-a6d1-591134af06a4) |
| GTE | [`gte/`](gte/) | [style](https://styles.refero.design/style/5d273906-0110-48cf-99cd-63a72eb9c586) |
| Guglieri | [`guglieri/`](guglieri/) | [style](https://styles.refero.design/style/5b7ecaf1-de2d-4fb9-9995-9f0665e77862) |
| Gumroad | [`gumroad/`](gumroad/) | [style](https://styles.refero.design/style/d67e1407-6d16-47e8-89cf-22f5c5f2dd88) |
| GUSTAVO Faria © | [`gustavo-faria/`](gustavo-faria/) | [style](https://styles.refero.design/style/cd3546fc-b6d0-4ec9-8624-580549af347d) |
| Haley Park | [`haley-park/`](haley-park/) | [style](https://styles.refero.design/style/c47654a9-7d7a-4b2c-8e0a-cd9296719c69) |
| Halfhelix | [`halfhelix/`](halfhelix/) | [style](https://styles.refero.design/style/36fb90f7-3547-4dfd-a34e-592aa140078a) |
| Handhold | [`handhold/`](handhold/) | [style](https://styles.refero.design/style/28a7115a-bcf8-4b05-89a5-5290f5842a3c) |
| Handshake | [`handshake/`](handshake/) | [style](https://styles.refero.design/style/dba3eb4f-c1c2-437f-beb2-708e9d074729) |
| Handsome Frank | [`handsome-frank/`](handsome-frank/) | [style](https://styles.refero.design/style/19d4103a-9f4a-49f0-ad7d-af6588bab904) |
| Hardworkclub | [`hardworkclub/`](hardworkclub/) | [style](https://styles.refero.design/style/1775bf6a-afdd-48b1-8435-b92ec585c674) |
| Harness.io | [`harness-io/`](harness-io/) | [style](https://styles.refero.design/style/6f3652cf-583f-411d-a117-3a03f6342917) |
| Hartzler Family Dairy | [`hartzler-family-dairy/`](hartzler-family-dairy/) | [style](https://styles.refero.design/style/14efe0a8-5abf-441c-919d-add271317bf9) |
| HashiCorp | [`hashicorp/`](hashicorp/) | [style](https://styles.refero.design/style/834ce97f-61f2-4b12-bf5c-e9fad2544456) |
| Hashnode | [`hashnode/`](hashnode/) | [style](https://styles.refero.design/style/6a8bf4c2-8cf2-463a-bcb9-36c15ea177c2) |
| Hatch | [`hatch/`](hatch/) | [style](https://styles.refero.design/style/e1afed53-6854-40dd-8157-dfc1dd3505f0) |
| Haus Otto | [`haus-otto/`](haus-otto/) | [style](https://styles.refero.design/style/0057e55a-8a66-4ffc-9c21-f0b757e580b3) |
| HBO Max | [`hbo-max/`](hbo-max/) | [style](https://styles.refero.design/style/898f0127-d235-4832-bf33-ab21104f0529) |
| Headspace | [`headspace/`](headspace/) | [style](https://styles.refero.design/style/035a098b-5a27-48a3-8a3a-c68a698e3eab) |
| Healthy Together | [`healthy-together/`](healthy-together/) | [style](https://styles.refero.design/style/d577e44e-bc63-4cbe-b759-25262d089b95) |
| Heart Aerospace | [`heart-aerospace/`](heart-aerospace/) | [style](https://styles.refero.design/style/bf523387-03fc-4243-86ca-25af34daa0ce) |
| Heavyweight | [`heavyweight/`](heavyweight/) | [style](https://styles.refero.design/style/d991c31d-2ffa-4a94-ab37-7f7d8f7d6a0c) |
| Helloivy | [`helloivy/`](helloivy/) | [style](https://styles.refero.design/style/5af6b791-6cad-4497-9e94-ace28e4fbd51) |
| Hellotime | [`hellotime/`](hellotime/) | [style](https://styles.refero.design/style/dbc5ecba-7309-456f-93b4-4356c6b0d293) |
| Henry | [`henry/`](henry/) | [style](https://styles.refero.design/style/ff4b9eff-dc0b-4886-bd65-c2f5e9069318) |
| Henry | [`henry-a9941737/`](henry-a9941737/) | [style](https://styles.refero.design/style/a9941737-7a01-47b0-b187-df2bb16b27d8) |
| herding.app | [`herding-app/`](herding-app/) | [style](https://styles.refero.design/style/6d1d19a3-294d-4bad-9f8b-f775cb24b47a) |
| HeroKit | [`herokit/`](herokit/) | [style](https://styles.refero.design/style/b3f7b44d-6564-4015-902a-259b4790b9de) |
| Hex | [`hex/`](hex/) | [style](https://styles.refero.design/style/3e32db74-a61d-4e72-93b8-1fb949af2c00) |
| Hey Low | [`hey-low/`](hey-low/) | [style](https://styles.refero.design/style/7829a500-242b-4932-b42d-7ce40c254101) |
| Heynds | [`heynds/`](heynds/) | [style](https://styles.refero.design/style/7027ecd6-41d9-4bc6-b919-3df5c573b950) |
| Hims App | [`hims-app/`](hims-app/) | [style](https://styles.refero.design/style/0a489bce-4f93-4b38-b612-d87b1d00999e) |
| HNST Studio | [`hnst-studio/`](hnst-studio/) | [style](https://styles.refero.design/style/7de578bc-9fbd-4664-a731-6223515bb601) |
| Holiday 100 | [`holiday-100/`](holiday-100/) | [style](https://styles.refero.design/style/48fa5bef-d910-40e1-b9b0-c0fcad055c6f) |
| Home | [`home/`](home/) | [style](https://styles.refero.design/style/1a519123-071a-449f-b5df-0def73ed7f35) |
| Home | [`home-2230ba53/`](home-2230ba53/) | [style](https://styles.refero.design/style/2230ba53-445e-411d-b483-16410a072639) |
| Home | [`home-604af0f7/`](home-604af0f7/) | [style](https://styles.refero.design/style/604af0f7-b4c3-4921-93af-9da03df81493) |
| Home | [`home-606d4af9/`](home-606d4af9/) | [style](https://styles.refero.design/style/606d4af9-9d8c-41ea-a122-f515f38f20e5) |
| Home | [`home-657e55de/`](home-657e55de/) | [style](https://styles.refero.design/style/657e55de-8cff-4d24-9a4e-17d3b7593a55) |
| Home | [`home-7e21f6e1/`](home-7e21f6e1/) | [style](https://styles.refero.design/style/7e21f6e1-deec-4bc4-a30e-f2c9d3320314) |
| Home | [`home-84c9c7ab/`](home-84c9c7ab/) | [style](https://styles.refero.design/style/84c9c7ab-c0b5-437f-b2bf-dc2fd8a61681) |
| Home | [`home-ad529e8a/`](home-ad529e8a/) | [style](https://styles.refero.design/style/ad529e8a-3427-4152-bed9-6ec5097f25b6) |
| Home | [`home-f9221afc/`](home-f9221afc/) | [style](https://styles.refero.design/style/f9221afc-f5cb-4de8-89cd-40172e765124) |
| Home page | Impossible Foods | [`home-page-impossible-foods/`](home-page-impossible-foods/) | [style](https://styles.refero.design/style/04961c7d-8ca6-4e87-ba88-6ad7ffa3b245) |
| HoneyBook | [`honeybook/`](honeybook/) | [style](https://styles.refero.design/style/26dac924-d1c8-4097-af0f-0417ccb12128) |
| Honk | [`honk/`](honk/) | [style](https://styles.refero.design/style/ca4708f7-7175-4da2-a47f-ce8f5e601f99) |
| HOUSEPLANT | [`houseplant/`](houseplant/) | [style](https://styles.refero.design/style/7fdd9506-0a85-41a5-b2a7-c5ce1f31d863) |
| How Many Plants | [`how-many-plants/`](how-many-plants/) | [style](https://styles.refero.design/style/4e616d96-14ea-43d6-9662-0ad3fa19ef7c) |
| HubSpot | [`hubspot/`](hubspot/) | [style](https://styles.refero.design/style/3e100552-a8ad-4179-b89a-6aa5113b92e1) |
| Huddle | [`huddle/`](huddle/) | [style](https://styles.refero.design/style/2cfd1a08-e5b1-4bd8-9270-29aa08f80aa0) |
| Hugging Face | [`hugging-face/`](hugging-face/) | [style](https://styles.refero.design/style/4363070d-02da-4954-88e4-d4a2101c5204) |
| Hugo & Marie | [`hugo-marie/`](hugo-marie/) | [style](https://styles.refero.design/style/58a36cba-3fc4-48fa-a7d9-7f14592b7857) |
| Huly | [`huly/`](huly/) | [style](https://styles.refero.design/style/d018e81d-6bb6-4445-86d7-39fd6be7e74d) |
| Humble | [`humble/`](humble/) | [style](https://styles.refero.design/style/a6950b49-8ce4-4330-9499-26ca08061599) |
| Hume AI | [`hume-ai/`](hume-ai/) | [style](https://styles.refero.design/style/2e67105f-9f9a-45b5-9281-29734e753bd6) |
| Hungry Tiger | [`hungry-tiger/`](hungry-tiger/) | [style](https://styles.refero.design/style/47f15da7-8905-45b3-bcab-06a4277c6168) |
| Hyer Aviation | [`hyer-aviation/`](hyer-aviation/) | [style](https://styles.refero.design/style/f61cf515-ccd5-4494-bdd1-be9fe4d7258c) |
| Hyper Foundation | [`hyper-foundation/`](hyper-foundation/) | [style](https://styles.refero.design/style/369ac603-c1e9-4231-9369-a198493f8e47) |
| Hyper Tria | [`hyper-tria/`](hyper-tria/) | [style](https://styles.refero.design/style/6665a3dd-606f-4fd1-80dd-a84e3b3a6226) |
| HyperAktiv | [`hyperaktiv/`](hyperaktiv/) | [style](https://styles.refero.design/style/d19c6fc3-1fc6-44a0-9c22-a0a82f7f79b4) |
| Hyperstudio | [`hyperstudio/`](hyperstudio/) | [style](https://styles.refero.design/style/8eb9c53e-d69c-497a-b640-610856cf3a60) |
| Iad-lab | [`iad-lab/`](iad-lab/) | [style](https://styles.refero.design/style/7d66c966-6cee-4c82-b2e4-2bf1ca7b2ccd) |
| iconwerk | [`iconwerk/`](iconwerk/) | [style](https://styles.refero.design/style/6e22b676-90e0-4e1a-a230-2b52f331d0e4) |
| IDHEAL | [`idheal/`](idheal/) | [style](https://styles.refero.design/style/8d8d5861-dee0-431b-826d-56f3fa4e1f84) |
| Idle Finance | [`idle-finance/`](idle-finance/) | [style](https://styles.refero.design/style/11fed738-a5b5-4509-b4e2-3295ceab3604) |
| IFTTT | [`ifttt/`](ifttt/) | [style](https://styles.refero.design/style/635b7769-7517-48ac-bb95-2ad7fa337e54) |
| IKEA | [`ikea/`](ikea/) | [style](https://styles.refero.design/style/e7b37c82-239c-48d5-b293-79a2bfa235cc) |
| ilovecreatives | [`ilovecreatives/`](ilovecreatives/) | [style](https://styles.refero.design/style/9afa0254-423b-4354-a852-8894c33d2e6b) |
| Impilo | [`impilo/`](impilo/) | [style](https://styles.refero.design/style/b44b0bb2-4ba3-4599-9706-3c3e0c8c2522) |
| Incident | [`incident/`](incident/) | [style](https://styles.refero.design/style/d9a60077-619a-4cb7-95ed-0c428c2b51ed) |
| Incommonwith | [`incommonwith/`](incommonwith/) | [style](https://styles.refero.design/style/1f9089e1-4170-482f-b988-afe1124a70a9) |
| Increase | [`increase/`](increase/) | [style](https://styles.refero.design/style/1ad4f49f-275a-4268-8ed1-677dc3c6e475) |
| Index | [`index/`](index/) | [style](https://styles.refero.design/style/b1ec2120-ceb0-42d1-9f96-2c9db2bf009b) |
| Index | [`index-7f8c0c07/`](index-7f8c0c07/) | [style](https://styles.refero.design/style/7f8c0c07-86e9-4b7c-a042-a7563b169143) |
| Index | [`index-b136f0a0/`](index-b136f0a0/) | [style](https://styles.refero.design/style/b136f0a0-8064-4978-a18e-db54b9362c24) |
| INFRINGE | [`infringe/`](infringe/) | [style](https://styles.refero.design/style/36e7c3f9-b7cb-48a2-9695-db726e3dccdb) |
| Ingmar Coenen | [`ingmar-coenen/`](ingmar-coenen/) | [style](https://styles.refero.design/style/f8c92b6b-a3a7-4141-ae61-3d865a106761) |
| INK | [`ink/`](ink/) | [style](https://styles.refero.design/style/6262b0bb-ea6f-481b-b706-65df29507b6c) |
| Inngest | [`inngest/`](inngest/) | [style](https://styles.refero.design/style/62e8e59e-17a5-4eba-a6c6-1c7f67ded518) |
| INO | [`ino/`](ino/) | [style](https://styles.refero.design/style/57388b47-f789-441f-8b8d-13f1838a9ac6) |
| Instagram Sans Typeface | [`instagram-sans-typeface/`](instagram-sans-typeface/) | [style](https://styles.refero.design/style/7d6a8722-a6f4-40de-a761-16ea479630a9) |
| Instrument | [`instrument/`](instrument/) | [style](https://styles.refero.design/style/dcd215e5-3511-4e40-87ff-95c095f44ad6) |
| Integrated Biosciences | [`integrated-biosciences/`](integrated-biosciences/) | [style](https://styles.refero.design/style/80099f79-72b7-4367-b2e9-6a3d4a3e9e6a) |
| Intercom | [`intercom/`](intercom/) | [style](https://styles.refero.design/style/12255b63-e506-4bc1-a4cd-d05487de32f3) |
| International Magic | [`international-magic/`](international-magic/) | [style](https://styles.refero.design/style/c406697b-677f-40c7-a3a2-10ea545278f1) |
| Inthememory | [`inthememory/`](inthememory/) | [style](https://styles.refero.design/style/8872694d-261d-4eb4-b355-fb39ee4c37ad) |
| Intra | [`intra/`](intra/) | [style](https://styles.refero.design/style/16a8de02-a4c6-4077-9d3a-ef6b5c10db12) |
| INVERSA | [`inversa/`](inversa/) | [style](https://styles.refero.design/style/8a6dc9c8-7892-4eab-baaa-3c342d5671f2) |
| Invisibletech | [`invisibletech/`](invisibletech/) | [style](https://styles.refero.design/style/c6136c4a-9e89-4dc5-93d3-e1adf58dbc2f) |
| Isla Beauty | [`isla-beauty/`](isla-beauty/) | [style](https://styles.refero.design/style/0b9da6ef-bec5-4073-90af-66c67e72f2a4) |
| Itsnicethat | [`itsnicethat/`](itsnicethat/) | [style](https://styles.refero.design/style/3e70af05-a07f-4c11-98ca-6ecb4765e967) |
| iUSPC by Coinshift | [`iuspc-by-coinshift/`](iuspc-by-coinshift/) | [style](https://styles.refero.design/style/46bca11b-6920-4d70-8dd7-c4e3dbc123c7) |
| Jakub Reis | [`jakub-reis/`](jakub-reis/) | [style](https://styles.refero.design/style/3af36935-8383-49e7-857e-9fb5caa06966) |
| Jam | [`jam/`](jam/) | [style](https://styles.refero.design/style/5e9d8377-e6f2-4063-b678-9f1bbfc24598) |
| Jasper | [`jasper/`](jasper/) | [style](https://styles.refero.design/style/02a9c799-eb91-425b-8d68-3776b5e84229) |
| JetBrains | [`jetbrains/`](jetbrains/) | [style](https://styles.refero.design/style/bc4fb98b-37ec-480a-b7a9-acd197cbebb9) |
| Jeton | [`jeton/`](jeton/) | [style](https://styles.refero.design/style/1f32d914-6fdd-4692-b4fc-fcee2c414766) |
| Jitter | [`jitter/`](jitter/) | [style](https://styles.refero.design/style/ab1e41e9-7d21-4762-b498-51b8c63ae7ce) |
| Joby Aviation | [`joby-aviation/`](joby-aviation/) | [style](https://styles.refero.design/style/c1052d8d-3663-46a4-a882-e50d9b8a1166) |
| Join Parker | [`join-parker/`](join-parker/) | [style](https://styles.refero.design/style/f08f9870-2018-4c0b-80d4-0b2e525ff49c) |
| Jonas Pelzer | [`jonas-pelzer/`](jonas-pelzer/) | [style](https://styles.refero.design/style/dd96b76a-b691-49e7-ba8f-1cdc8f7172e6) |
| Josephmark | [`josephmark/`](josephmark/) | [style](https://styles.refero.design/style/58c0af12-8706-428f-8282-482d57d7b90e) |
| Josh Warner | [`josh-warner/`](josh-warner/) | [style](https://styles.refero.design/style/e2e9b80c-b548-4f86-a4d7-7a6b07d1c2e1) |
| Jp | [`jp/`](jp/) | [style](https://styles.refero.design/style/60b529c2-c0f7-49be-9a77-8d3762838f05) |
| Juicebox.ai | [`juicebox-ai/`](juicebox-ai/) | [style](https://styles.refero.design/style/2186dddd-60ee-4898-b11d-88483daf477e) |
| Julia Krantz | [`julia-krantz/`](julia-krantz/) | [style](https://styles.refero.design/style/92857b05-1c01-4c7a-b196-beb4e4871998) |
| July Fund | [`july-fund/`](july-fund/) | [style](https://styles.refero.design/style/adc127f5-c6ec-4892-984d-5445c2b6104e) |
| jun.works | [`jun-works/`](jun-works/) | [style](https://styles.refero.design/style/02ba867b-49e3-4ab4-ad23-c30baf345078) |
| June | [`june/`](june/) | [style](https://styles.refero.design/style/40e4d3ef-cd28-483b-8c8a-b9cf44281b03) |
| Kajabi | [`kajabi/`](kajabi/) | [style](https://styles.refero.design/style/a6bf8730-6515-4a47-9d5f-927e1e0c67d5) |
| Kalstore® | [`kalstore/`](kalstore/) | [style](https://styles.refero.design/style/e854a4f7-4243-44a7-92e2-e22db22bef1b) |
| Karl | [`karl/`](karl/) | [style](https://styles.refero.design/style/dd8b7191-a992-4dab-88f8-f67e8819b461) |
| Katherine Pihl | [`katherine-pihl/`](katherine-pihl/) | [style](https://styles.refero.design/style/a6b2d6dc-7d71-4d2d-af3e-b34a8b665744) |
| KeepGrading | [`keepgrading/`](keepgrading/) | [style](https://styles.refero.design/style/2f0a053b-0596-4212-a4f4-8a7b580acb90) |
| Kikin | [`kikin/`](kikin/) | [style](https://styles.refero.design/style/87574d45-e35d-4ffd-8560-99fee4008d2b) |
| Kindsight | [`kindsight/`](kindsight/) | [style](https://styles.refero.design/style/f22f1195-837d-4b1d-a48c-9123b122bf87) |
| Kinfolk | [`kinfolk/`](kinfolk/) | [style](https://styles.refero.design/style/ac9b040e-36aa-4881-ada5-72d4744947a4) |
| Kippo | [`kippo/`](kippo/) | [style](https://styles.refero.design/style/917048a3-53b3-44e6-ab33-faefc4dcc9df) |
| Kit | [`kit/`](kit/) | [style](https://styles.refero.design/style/7f7d24b9-6878-4548-82ca-a26bbf7a6f2c) |
| Klarna ES | [`klarna-es/`](klarna-es/) | [style](https://styles.refero.design/style/49dba9e1-0d9d-4997-805a-bfea7525252d) |
| Klim | [`klim/`](klim/) | [style](https://styles.refero.design/style/0dad8530-9422-4d9e-8622-1f50ee4bc702) |
| Ko-fi | [`ko-fi/`](ko-fi/) | [style](https://styles.refero.design/style/35ae81e1-273c-43d7-9bcd-ea186d062c13) |
| Kobu | [`kobu/`](kobu/) | [style](https://styles.refero.design/style/355d4b38-1a53-4544-911e-0f5073ab836b) |
| Koox | [`koox/`](koox/) | [style](https://styles.refero.design/style/d1ca41ff-1bcc-4081-b1fd-bdcf380ba749) |
| Koto | [`koto/`](koto/) | [style](https://styles.refero.design/style/a88fa835-1d5e-4b8e-b3d5-602597870563) |
| Kraken | [`kraken/`](kraken/) | [style](https://styles.refero.design/style/14389660-81ff-4ca0-957f-b0dcc8fbe120) |
| Krea | [`krea/`](krea/) | [style](https://styles.refero.design/style/50833119-cb36-4b75-b0cc-be48afea050a) |
| Krepling | [`krepling/`](krepling/) | [style](https://styles.refero.design/style/055f12af-b7b9-46af-81b7-93e0ed6d5ce2) |
| Krisp | [`krisp/`](krisp/) | [style](https://styles.refero.design/style/3b3fa99e-cee4-41f3-ac26-777b4b6a8b12) |
| Lama Lama | [`lama-lama/`](lama-lama/) | [style](https://styles.refero.design/style/8e26bf8a-44b8-4fe1-9b4b-188dd5827c0f) |
| Lamanna | [`lamanna/`](lamanna/) | [style](https://styles.refero.design/style/057d7c66-76b7-4272-849c-4058543e6799) |
| Lamborghini.com | [`lamborghini-com/`](lamborghini-com/) | [style](https://styles.refero.design/style/c9c5be5a-aaa1-4338-9681-8378d2e24fbd) |
| Langbase | [`langbase/`](langbase/) | [style](https://styles.refero.design/style/ad48f4ad-42c0-4c91-a189-fa7a73a7a9e9) |
| Lattice | [`lattice/`](lattice/) | [style](https://styles.refero.design/style/cbb335e5-c8df-49be-a0fc-0ec5dfa0d61f) |
| LaunchDarkly | [`launchdarkly/`](launchdarkly/) | [style](https://styles.refero.design/style/18a75348-513a-49d8-94f5-e2df8c118b6b) |
| Laura Monin | [`laura-monin/`](laura-monin/) | [style](https://styles.refero.design/style/2b9e90ad-51d9-4f29-8f7e-a343dc741eab) |
| Lazy | [`lazy/`](lazy/) | [style](https://styles.refero.design/style/2b939c70-c08e-4bb6-8fac-ade99b0d1cf0) |
| ldd | [`ldd/`](ldd/) | [style](https://styles.refero.design/style/e186e08f-e7ce-4b48-bd65-68bc300d2193) |
| LE CAMP | [`le-camp/`](le-camp/) | [style](https://styles.refero.design/style/45267374-ee40-43d9-8bfe-8d6566ce852d) |
| Le Puzz | [`le-puzz/`](le-puzz/) | [style](https://styles.refero.design/style/66e7b131-d68c-4751-954c-f5d0d8869647) |
| Leandra-isler | [`leandra-isler/`](leandra-isler/) | [style](https://styles.refero.design/style/515da65c-f9e3-4296-a05d-0d921f5cdab1) |
| Legora | [`legora/`](legora/) | [style](https://styles.refero.design/style/f89bad29-019a-48d7-9724-c40a0d7d8171) |
| Leif Products | [`leif-products/`](leif-products/) | [style](https://styles.refero.design/style/3f56ea4d-ed9d-4a36-8fb5-a801519ef80b) |
| Lens | [`lens/`](lens/) | [style](https://styles.refero.design/style/63c0e759-3175-4f62-a8e3-b9e285f9e998) |
| Leonardo.ai | [`leonardo-ai/`](leonardo-ai/) | [style](https://styles.refero.design/style/8c3f2805-dfce-4edd-8a9c-946bee4f1cff) |
| Leonid Kostetskyi | [`leonid-kostetskyi/`](leonid-kostetskyi/) | [style](https://styles.refero.design/style/5a7ba5ff-0476-4f3f-99f9-0b920534dde5) |
| Letter | [`letter/`](letter/) | [style](https://styles.refero.design/style/bcfc6cb0-1b39-4f3f-a95e-bd7b563b0efc) |
| Letterboxd | [`letterboxd/`](letterboxd/) | [style](https://styles.refero.design/style/d98dea0b-00a4-4c15-b4a9-d196e2c3e4b4) |
| Letters | [`letters/`](letters/) | [style](https://styles.refero.design/style/04109c48-f591-4110-9739-622243d4ecc2) |
| Lightdash | [`lightdash/`](lightdash/) | [style](https://styles.refero.design/style/d0f65d12-a8e6-4631-99f7-bb7cdcd5b6c5) |
| Lightship | [`lightship/`](lightship/) | [style](https://styles.refero.design/style/fdcd4cbb-4db6-4138-9cfd-964795f1e1d6) |
| Limitless | [`limitless/`](limitless/) | [style](https://styles.refero.design/style/626ae2de-c402-4805-b859-2c6adca41022) |
| Limón | [`limo-n/`](limo-n/) | [style](https://styles.refero.design/style/f1b6a7d6-1ecb-4f1c-95b0-e03323363999) |
| Linear | [`linear/`](linear/) | [style](https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1) |
| Linktr | [`linktr/`](linktr/) | [style](https://styles.refero.design/style/b04c379c-7c33-4d69-8882-8d85d7768654) |
| Linus Rogge | [`linus-rogge/`](linus-rogge/) | [style](https://styles.refero.design/style/81a66e75-23af-4525-8a4e-f4a54c2700e7) |
| Liquid Death | [`liquid-death/`](liquid-death/) | [style](https://styles.refero.design/style/b6f2b036-e48e-452f-b003-941c491015c0) |
| Liron Moran Interiors | [`liron-moran-interiors/`](liron-moran-interiors/) | [style](https://styles.refero.design/style/43400d73-ca89-4750-8fa6-78cd2c661943) |
| Literal | [`literal/`](literal/) | [style](https://styles.refero.design/style/7e698bf6-6b31-40ed-a89a-40f4c37ade38) |
| Lithic | [`lithic/`](lithic/) | [style](https://styles.refero.design/style/077aecd0-4401-4696-a196-164d74ac8746) |
| Little Amps | [`little-amps/`](little-amps/) | [style](https://styles.refero.design/style/ca522706-03ed-48cb-acb3-1bb2a22f2eda) |
| Little Troop | [`little-troop/`](little-troop/) | [style](https://styles.refero.design/style/bd62b51f-e1be-4e4f-b3d9-e9b91f817625) |
| Liveblocks | [`liveblocks/`](liveblocks/) | [style](https://styles.refero.design/style/9b9b0ca1-5067-4115-b62f-ee0e43d1f37f) |
| Locomotive | [`locomotive/`](locomotive/) | [style](https://styles.refero.design/style/131d07b0-f71b-4bd2-8046-f61485ed545c) |
| LogoArchive | [`logoarchive/`](logoarchive/) | [style](https://styles.refero.design/style/b63cc4ca-52c6-4b70-9a5a-cb04bae15edb) |
| Look inc | [`look-inc/`](look-inc/) | [style](https://styles.refero.design/style/ab1b113a-ed21-4512-acc2-d10c8927c410) |
| Loom | [`loom/`](loom/) | [style](https://styles.refero.design/style/bc2c6ecc-7a0d-4693-86e5-9fa93b165601) |
| Loops | [`loops/`](loops/) | [style](https://styles.refero.design/style/4d832c12-dd14-45b0-bba7-2d3bc25d8264) |
| LottieFiles | [`lottiefiles/`](lottiefiles/) | [style](https://styles.refero.design/style/a80507cb-afda-46dd-a2b9-ba91f3a78e78) |
| Lottielab | [`lottielab/`](lottielab/) | [style](https://styles.refero.design/style/1f782141-d407-4c27-8cee-2246720a9f42) |
| Lovable | [`lovable/`](lovable/) | [style](https://styles.refero.design/style/9ff62d34-e48d-4fcb-9fd9-c018e2747542) |
| Lovi | [`lovi/`](lovi/) | [style](https://styles.refero.design/style/51a9246f-9238-47dd-b254-48983b8713a2) |
| Lpalo | [`lpalo/`](lpalo/) | [style](https://styles.refero.design/style/79b4ebc4-30f6-45b6-b2d2-922e28e05ca9) |
| Luffu | [`luffu/`](luffu/) | [style](https://styles.refero.design/style/3da7b444-ded8-406b-90b7-96851604b92b) |
| LUNCH | [`lunch/`](lunch/) | [style](https://styles.refero.design/style/cd3fbf9d-8d35-411b-9e69-89a03018b677) |
| Luro | [`luro/`](luro/) | [style](https://styles.refero.design/style/4e10797e-03eb-4efb-a16d-1d93272e1cab) |
| Lusion | [`lusion/`](lusion/) | [style](https://styles.refero.design/style/1b44386e-31a8-40b0-a577-27c088b51264) |
| Lyssna | [`lyssna/`](lyssna/) | [style](https://styles.refero.design/style/65f775f1-6dcc-4c49-80d2-b5a017b76f59) |
| MA Quilts | [`ma-quilts/`](ma-quilts/) | [style](https://styles.refero.design/style/6d4ef8f4-badd-4e3c-a168-0cc89c833b26) |
| Maciej Zadykowicz | [`maciej-zadykowicz/`](maciej-zadykowicz/) | [style](https://styles.refero.design/style/f1b76a42-050e-4c9e-96e3-a77fbd718c68) |
| Made With Gsap | [`made-with-gsap/`](made-with-gsap/) | [style](https://styles.refero.design/style/44e4d78b-d78a-4d00-bd10-94b14ac083c9) |
| Madebyon | [`madebyon/`](madebyon/) | [style](https://styles.refero.design/style/64ba8e77-d1be-48a2-a47d-bdd46e139b8f) |
| Maëlan Le Meur | [`mae-lan-le-meur/`](mae-lan-le-meur/) | [style](https://styles.refero.design/style/ea0d7b5a-c887-4b6b-9260-6ca4d1fd7caa) |
| Mage | [`mage/`](mage/) | [style](https://styles.refero.design/style/ba07accb-b2cc-4ad9-a25f-c50b0f90f34e) |
| Magicbeans | [`magicbeans/`](magicbeans/) | [style](https://styles.refero.design/style/5af8ba79-c73f-4388-8ea8-b805e24599f8) |
| Magnetism | [`magnetism/`](magnetism/) | [style](https://styles.refero.design/style/a8a1e9e6-d252-49c7-b201-91b3055487df) |
| Mailchimp | [`mailchimp/`](mailchimp/) | [style](https://styles.refero.design/style/24929007-7e62-4c96-a940-7de65438a578) |
| Maisonmargiela | [`maisonmargiela/`](maisonmargiela/) | [style](https://styles.refero.design/style/44a6d2a5-16ef-42cd-a69c-33a7af16638d) |
| MAKR | [`makr/`](makr/) | [style](https://styles.refero.design/style/f2bf6db7-37b6-4394-be97-6bbb2c45c268) |
| MANNA | [`manna/`](manna/) | [style](https://styles.refero.design/style/d83fd0b1-afde-41ff-b970-c622bfed9f59) |
| Mapbox | [`mapbox/`](mapbox/) | [style](https://styles.refero.design/style/be34bbe8-9a50-4f36-b379-840328f6350c) |
| Marco | [`marco/`](marco/) | [style](https://styles.refero.design/style/88e9d606-7e8f-479c-9508-1b081e254ed9) |
| Martin Laxenaire | [`martin-laxenaire/`](martin-laxenaire/) | [style](https://styles.refero.design/style/0e8db8d0-4d8f-48ac-a8e7-aaea9601e3ce) |
| Marylou Faure | [`marylou-faure/`](marylou-faure/) | [style](https://styles.refero.design/style/6b2e2cb8-b217-4395-a664-8795b6002315) |
| MasterClass | [`masterclass/`](masterclass/) | [style](https://styles.refero.design/style/4367b4cd-b002-4719-a418-cbce020f0d33) |
| Max Yinger | [`max-yinger/`](max-yinger/) | [style](https://styles.refero.design/style/a7891223-a93e-4731-a1aa-4079f1ee928b) |
| Maze | [`maze/`](maze/) | [style](https://styles.refero.design/style/966a03d5-13e9-48d8-9b01-28e6ae3f3967) |
| Medium | [`medium/`](medium/) | [style](https://styles.refero.design/style/9c92c3d1-a2fe-4a27-a324-826b19501774) |
| MekaVerse | [`mekaverse/`](mekaverse/) | [style](https://styles.refero.design/style/09e43758-12c5-4a2b-8ae8-ded156ef66bf) |
| Memorisely | [`memorisely/`](memorisely/) | [style](https://styles.refero.design/style/e1497817-b9f1-4d7a-842f-58a08dd9e455) |
| Mercury | [`mercury/`](mercury/) | [style](https://styles.refero.design/style/3172cd4d-118a-4a16-a259-6b634d32322e) |
| Merlin | [`merlin/`](merlin/) | [style](https://styles.refero.design/style/ed97c4e8-4b0c-46b7-9957-c814854229f7) |
| Mesh | [`mesh/`](mesh/) | [style](https://styles.refero.design/style/1a03b8d7-9204-4c16-ad3c-16306f99fba9) |
| Metalab | [`metalab/`](metalab/) | [style](https://styles.refero.design/style/da087e69-8832-418a-aa1b-42e1acabb39e) |
| Metamask | [`metamask/`](metamask/) | [style](https://styles.refero.design/style/6248749d-b440-4561-b4d7-2d39c0fd4fd3) |
| MetaMusic | [`metamusic/`](metamusic/) | [style](https://styles.refero.design/style/6ffe7b61-a418-4cbd-9e7a-a5129db6c589) |
| Metaview | [`metaview/`](metaview/) | [style](https://styles.refero.design/style/f99856e1-3627-4624-a811-f6053a978b62) |
| Mews | [`mews/`](mews/) | [style](https://styles.refero.design/style/6b2777fd-7021-4a96-add3-ec4a32374214) |
| Mezmo | [`mezmo/`](mezmo/) | [style](https://styles.refero.design/style/691e7b4e-fee9-4f08-a2e9-9a2742c22b7b) |
| Michael Wandelmaier | [`michael-wandelmaier/`](michael-wandelmaier/) | [style](https://styles.refero.design/style/5b405eec-67ba-4dd0-8dab-ace000151a78) |
| Micro | [`micro/`](micro/) | [style](https://styles.refero.design/style/cc43cfe3-195b-4081-b586-c42db054a466) |
| Microsoft | [`microsoft/`](microsoft/) | [style](https://styles.refero.design/style/c70a9990-bc4b-4a64-a69b-aeb7b344fb74) |
| Microsoft | [`microsoft-5f39e778/`](microsoft-5f39e778/) | [style](https://styles.refero.design/style/5f39e778-d204-42a9-8b8b-a1519dbd3971) |
| Microsoft AI | [`microsoft-ai/`](microsoft-ai/) | [style](https://styles.refero.design/style/46781641-8afd-4b01-9f67-06046b6eda71) |
| Midday | [`midday/`](midday/) | [style](https://styles.refero.design/style/3f2b79c1-d980-4380-a903-29856975fc37) |
| Midjourney | [`midjourney/`](midjourney/) | [style](https://styles.refero.design/style/225059ac-0450-49d3-b2b7-d0e98b7ae938) |
| Mike Matas | [`mike-matas/`](mike-matas/) | [style](https://styles.refero.design/style/04f6cb02-de90-4d78-9c5f-0eb52f826484) |
| MindMarket | [`mindmarket/`](mindmarket/) | [style](https://styles.refero.design/style/9130ad37-bf80-458f-b808-ac0ef6a8d1e9) |
| Minimal Collective | [`minimal-collective/`](minimal-collective/) | [style](https://styles.refero.design/style/94c15607-2f19-4dc4-9aec-2b40f28b754f) |
| Mintlify | [`mintlify/`](mintlify/) | [style](https://styles.refero.design/style/80d7ef36-ed7e-48bb-b558-f772eb40106f) |
| Miranda | [`miranda/`](miranda/) | [style](https://styles.refero.design/style/3f6e3076-e77f-487e-b212-3b5946a34e87) |
| mishmash® | [`mishmash/`](mishmash/) | [style](https://styles.refero.design/style/ebac84e6-b22c-4d21-845f-9165158af844) |
| Miti Navi | [`miti-navi/`](miti-navi/) | [style](https://styles.refero.design/style/887f0c74-c696-4589-82ae-85705ecda919) |
| Mobbin | [`mobbin/`](mobbin/) | [style](https://styles.refero.design/style/ef44a995-6745-4dc7-86ab-f7227f108f81) |
| Mockups made easy | [`mockups-made-easy/`](mockups-made-easy/) | [style](https://styles.refero.design/style/ef545f0f-e7ad-4296-b3eb-65f8d045a5d9) |
| Modal | [`modal/`](modal/) | [style](https://styles.refero.design/style/68c15685-5db9-4869-b71d-27240568c9d8) |
| Modern Business Intelligence | [`modern-business-intelligence/`](modern-business-intelligence/) | [style](https://styles.refero.design/style/7479c233-6fee-468b-af95-9169d01a293e) |
| Modern companies are built on Capital | [`modern-companies-are-built-on-capital/`](modern-companies-are-built-on-capital/) | [style](https://styles.refero.design/style/37e20981-1f35-4314-87c1-fdb61ab2f0c0) |
| Moffitt.Moffitt. - | [`moffitt-moffitt/`](moffitt-moffitt/) | [style](https://styles.refero.design/style/4244637b-e27b-4962-b586-cb3ac605e5aa) |
| Monad | [`monad/`](monad/) | [style](https://styles.refero.design/style/fc84e9f0-2058-4a0a-8d26-9cc1ba84ec9c) |
| Monarch | [`monarch/`](monarch/) | [style](https://styles.refero.design/style/a9dd8050-c03a-4901-b7fa-a9cc0ca54812) |
| monday.com | [`monday-com/`](monday-com/) | [style](https://styles.refero.design/style/77ee57e9-9f8e-4ec1-93f7-cc1c4b84307a) |
| mono | [`mono/`](mono/) | [style](https://styles.refero.design/style/859f6be7-9d2d-4da6-a9b7-baa658172696) |
| Monocle | [`monocle/`](monocle/) | [style](https://styles.refero.design/style/9165ecb1-f068-4093-8783-1f3c98898b8a) |
| Monologue | [`monologue/`](monologue/) | [style](https://styles.refero.design/style/8401cb26-91a3-4b46-941e-1c75790821eb) |
| monopo saigon | [`monopo-saigon/`](monopo-saigon/) | [style](https://styles.refero.design/style/3e52dd36-6ab1-48c6-bc40-47ef6d33abc2) |
| Monotype. | [`monotype/`](monotype/) | [style](https://styles.refero.design/style/be5cf0d7-fc29-4b7f-bf86-f87185b122fc) |
| Monte | [`monte/`](monte/) | [style](https://styles.refero.design/style/fb6ac216-c11a-47c3-88e8-0423541da69c) |
| Monzo | [`monzo/`](monzo/) | [style](https://styles.refero.design/style/e8a1d114-6924-4f03-acd2-996dd30f15a6) |
| Moonli | [`moonli/`](moonli/) | [style](https://styles.refero.design/style/74be1036-f867-4cee-959a-a9a9129111c0) |
| Morflax | [`morflax/`](morflax/) | [style](https://styles.refero.design/style/2e24c0ca-dd46-4519-b66e-cc03701d3b8c) |
| Morphic | [`morphic/`](morphic/) | [style](https://styles.refero.design/style/1d4cbd69-ee0f-4f13-ba7d-14d3eaed7349) |
| mostlikely | [`mostlikely/`](mostlikely/) | [style](https://styles.refero.design/style/4040f97b-42cf-49ef-ab2d-a77c00fe8285) |
| Mother Design | [`mother-design/`](mother-design/) | [style](https://styles.refero.design/style/f40e6a6c-1704-407a-b21b-6141fb90adfe) |
| MotherDuck | [`motherduck/`](motherduck/) | [style](https://styles.refero.design/style/2bd7363d-7aae-4b1f-9d5a-1edeb17ca567) |
| Motto® | [`motto/`](motto/) | [style](https://styles.refero.design/style/6eb5fc89-d0db-4293-8bff-13c5aa530a28) |
| Moving Parts | [`moving-parts/`](moving-parts/) | [style](https://styles.refero.design/style/fb459c9d-c089-4d0b-b5b0-d147b1c4ebd7) |
| Moxie | [`moxie/`](moxie/) | [style](https://styles.refero.design/style/7f70ee10-123b-43cc-bd04-498cfc5b5ac0) |
| Mr. Pops | [`mr-pops/`](mr-pops/) | [style](https://styles.refero.design/style/ab7996ed-e0ed-40a0-81a5-d37f19ef35b0) |
| Munro Partners | [`munro-partners/`](munro-partners/) | [style](https://styles.refero.design/style/d2e327b2-1181-4203-82a6-2dc15a72078a) |
| Mural | [`mural/`](mural/) | [style](https://styles.refero.design/style/2b6642d9-fa66-4c06-9804-30f56e544a6d) |
| Mux | [`mux/`](mux/) | [style](https://styles.refero.design/style/a26f1a4d-758c-4df0-a61e-88a7ca0931ce) |
| My Brentano | [`my-brentano/`](my-brentano/) | [style](https://styles.refero.design/style/d211aaa4-e09b-4ef9-a9bf-f6fa8495de73) |
| mymind | [`mymind/`](mymind/) | [style](https://styles.refero.design/style/5bfe6c1d-1b15-4f8d-b0c9-677a33291c5d) |
| Myrch Club | [`myrch-club/`](myrch-club/) | [style](https://styles.refero.design/style/528683fb-6b17-4fc6-b37e-d831ee1b20e2) |
| N8n | [`n8n/`](n8n/) | [style](https://styles.refero.design/style/8601c8ef-e1ea-4186-adb2-6f9a74caf436) |
| Nakedcityfilms | [`nakedcityfilms/`](nakedcityfilms/) | [style](https://styles.refero.design/style/b7fc2173-c9b1-45ed-bd3a-9999320b3248) |
| NaN | [`nan/`](nan/) | [style](https://styles.refero.design/style/71db2a51-118e-42b1-879d-29872d52142f) |
| Nathan Riley | [`nathan-riley/`](nathan-riley/) | [style](https://styles.refero.design/style/1c516bc6-278b-4cf6-bfe8-c5a39118e730) |
| Navan | [`navan/`](navan/) | [style](https://styles.refero.design/style/a5089389-4220-4fc2-82d9-973203d2e2f5) |
| Navigate | [`navigate/`](navigate/) | [style](https://styles.refero.design/style/045e9f2b-91d3-44cc-bc99-1ce5f3fd4ed6) |
| NCDA | [`ncda/`](ncda/) | [style](https://styles.refero.design/style/f654d52c-42de-4f3b-a377-9287b1536ad0) |
| NEAR | [`near/`](near/) | [style](https://styles.refero.design/style/a8c07777-ae41-4b69-9aa7-b05700ff7a14) |
| Neon | [`neon/`](neon/) | [style](https://styles.refero.design/style/cc38369a-41e3-4bcd-b619-230ccffe7e8e) |
| NEON Rated | [`neon-rated/`](neon-rated/) | [style](https://styles.refero.design/style/d7d9c36d-fec9-4218-9e17-3d129dfb2dee) |
| Netflix Spain | [`netflix-spain/`](netflix-spain/) | [style](https://styles.refero.design/style/0e4d933c-aa07-4787-9884-40a0e6c338e4) |
| Netflix Spain | [`netflix-spain-32959012/`](netflix-spain-32959012/) | [style](https://styles.refero.design/style/32959012-f50d-4465-bb01-2aa4d506e0a8) |
| Neuralink | [`neuralink/`](neuralink/) | [style](https://styles.refero.design/style/7510b18e-63c3-4c2a-97c3-39fa7dfa6ae3) |
| NEVERHACK | [`neverhack/`](neverhack/) | [style](https://styles.refero.design/style/05a82625-786e-4343-a554-3ba8f4de23d7) |
| New Genre | [`new-genre/`](new-genre/) | [style](https://styles.refero.design/style/2318d650-b229-4be0-9adc-9f17cecfd253) |
| NGLORA | [`nglora/`](nglora/) | [style](https://styles.refero.design/style/24c0de95-295d-42aa-8240-4e36683cf35b) |
| Nike.com | [`nike-com/`](nike-com/) | [style](https://styles.refero.design/style/d7ace114-0548-41f5-a2ff-2afbf32be94d) |
| Nile Postgres | [`nile-postgres/`](nile-postgres/) | [style](https://styles.refero.design/style/7671d0fc-b9fc-462e-9c74-38511264aabd) |
| Nofilter.space | [`nofilter-space/`](nofilter-space/) | [style](https://styles.refero.design/style/4235ebdc-a070-46ef-abbf-692151449bea) |
| Nomen Nescio | [`nomen-nescio/`](nomen-nescio/) | [style](https://styles.refero.design/style/2fd71e12-12fc-4346-8281-52afe12bb951) |
| Norgram | [`norgram/`](norgram/) | [style](https://styles.refero.design/style/17e5ff99-38c1-4ad6-8910-648f5798b3a5) |
| Nornorm | [`nornorm/`](nornorm/) | [style](https://styles.refero.design/style/0769ff4c-f719-4865-98df-de2f44c694a6) |
| North Kingdom | [`north-kingdom/`](north-kingdom/) | [style](https://styles.refero.design/style/145e70b3-e0a4-4fbd-8d9e-23bd93dd0021) |
| Not Real | [`not-real/`](not-real/) | [style](https://styles.refero.design/style/c0a3f588-74b7-4fad-b557-1fc7cd7bd777) |
| Notion | [`notion/`](notion/) | [style](https://styles.refero.design/style/2bf4c61f-de10-4614-ba1b-20c0453bd2a9) |
| Notion | [`notion-f58e99d1/`](notion-f58e99d1/) | [style](https://styles.refero.design/style/f58e99d1-940d-4254-8822-5d856bba6505) |
| Numbered | [`numbered/`](numbered/) | [style](https://styles.refero.design/style/50f0b6d5-9e96-42a1-9564-a6e99c289f98) |
| Nuri | [`nuri/`](nuri/) | [style](https://styles.refero.design/style/a0cb71ee-c2f2-4c37-a527-9e8ff0a0b312) |
| Oakâme | [`oaka-me/`](oaka-me/) | [style](https://styles.refero.design/style/a6791bc8-c49d-4e7a-a09d-877afcd04c25) |
| Obscura | [`obscura/`](obscura/) | [style](https://styles.refero.design/style/c445eb73-e403-4a00-8b90-f454c9181fd6) |
| Obsidian | [`obsidian/`](obsidian/) | [style](https://styles.refero.design/style/e793a53c-537e-46b0-881d-b15b63b9ff26) |
| Obviously | [`obviously/`](obviously/) | [style](https://styles.refero.design/style/c21fd0f0-1375-4094-83e7-0de484940100) |
| Odin's Crow | [`odin-s-crow/`](odin-s-crow/) | [style](https://styles.refero.design/style/65c01b0f-7ae5-42ff-ad5b-162bbdce8e01) |
| Oevra | [`oevra/`](oevra/) | [style](https://styles.refero.design/style/01d6013d-a176-4a22-b7dd-fbd113592956) |
| OFF+BRAND. | [`off-brand/`](off-brand/) | [style](https://styles.refero.design/style/6b667ffc-5158-4000-9252-3a107d5161ee) |
| OFF WHITE | [`off-white/`](off-white/) | [style](https://styles.refero.design/style/cf49b88a-fb38-4520-8fbb-ab3efa983517) |
| OFFFICE : | [`offfice/`](offfice/) | [style](https://styles.refero.design/style/190d4a0b-0353-4fc8-be09-affa6e977146) |
| Officevibe | [`officevibe/`](officevibe/) | [style](https://styles.refero.design/style/ced1c98f-d489-48f7-a01f-1fa59a07b706) |
| OhDada | [`ohdada/`](ohdada/) | [style](https://styles.refero.design/style/d69af89b-cb31-426d-b9aa-c21d127b8947) |
| OHZI Interactive Studio / Dive into digital magic. | [`ohzi-interactive-studio-dive-into-digital-magic/`](ohzi-interactive-studio-dive-into-digital-magic/) | [style](https://styles.refero.design/style/03e03554-d7aa-40da-9764-79320ecfa1d0) |
| OLIPOP | [`olipop/`](olipop/) | [style](https://styles.refero.design/style/c6ec55c7-0bd9-47c5-a4d2-669b7790c9cc) |
| ON.energy | [`on-energy/`](on-energy/) | [style](https://styles.refero.design/style/31e00a99-6946-4f07-829a-b0904a39a20d) |
| ONE | [`one/`](one/) | [style](https://styles.refero.design/style/71745af1-2e53-4925-992e-82773e55ccd6) |
| OpenAI | [`openai/`](openai/) | [style](https://styles.refero.design/style/dc541737-8bf2-4b31-b729-0352f696e82f) |
| OpenAI Developers | [`openai-developers/`](openai-developers/) | [style](https://styles.refero.design/style/5c94c49f-0612-4261-842c-e1d501f3e13d) |
| Opennote | [`opennote/`](opennote/) | [style](https://styles.refero.design/style/24d3b281-04a6-4cc7-8a74-634b08472291) |
| OpenSea | [`opensea/`](opensea/) | [style](https://styles.refero.design/style/61f1902f-6da3-4af7-b046-3b08bc1377f6) |
| OpenServ | [`openserv/`](openserv/) | [style](https://styles.refero.design/style/063be10d-593d-4c81-a99e-a7543737b9db) |
| OpenWeb | [`openweb/`](openweb/) | [style](https://styles.refero.design/style/c38d077b-3cdb-48c6-899c-e8a543508c31) |
| Operate | [`operate/`](operate/) | [style](https://styles.refero.design/style/f682f0ea-632d-4d09-bfdf-6a43f5e5a7d8) |
| OPX Studio | [`opx-studio/`](opx-studio/) | [style](https://styles.refero.design/style/bd395e2e-58a8-4626-acfa-9be8d6cdf604) |
| Orderful | [`orderful/`](orderful/) | [style](https://styles.refero.design/style/d95a35c2-d3f7-49e7-9ba7-282d52d3211d) |
| Ordinal | [`ordinal/`](ordinal/) | [style](https://styles.refero.design/style/4657db98-0c6c-4848-91e9-c339f3bb7815) |
| Ori | [`ori/`](ori/) | [style](https://styles.refero.design/style/4ef4a6dc-bee9-420a-b197-f20415b9caaa) |
| Origin Financial | [`origin-financial/`](origin-financial/) | [style](https://styles.refero.design/style/c60f05ff-2420-4a24-92db-80c4b6a74683) |
| Ortto | [`ortto/`](ortto/) | [style](https://styles.refero.design/style/45c4f990-e6b4-472d-89a4-06870ac17b9f) |
| ORYZO AI | [`oryzo-ai/`](oryzo-ai/) | [style](https://styles.refero.design/style/1f204e95-454a-437e-845b-c1b169d35607) |
| Osmo | [`osmo/`](osmo/) | [style](https://styles.refero.design/style/7976704d-549b-4ba6-9a0f-c792766a9df3) |
| Oura Ring | [`oura-ring/`](oura-ring/) | [style](https://styles.refero.design/style/9decde51-2a8b-4212-bba5-be9457efc62e) |
| Outseta | [`outseta/`](outseta/) | [style](https://styles.refero.design/style/859d51e6-fc3f-45e0-a4c4-fe280c400ca7) |
| Outsource Consultants | [`outsource-consultants/`](outsource-consultants/) | [style](https://styles.refero.design/style/16be276a-d8ce-484e-8f7a-cbbb09f717f7) |
| Overflow | [`overflow/`](overflow/) | [style](https://styles.refero.design/style/6845a075-8573-4bdc-9346-58cb09b83547) |
| Oxide Computer Company | [`oxide-computer-company/`](oxide-computer-company/) | [style](https://styles.refero.design/style/b721fa94-72e6-49ad-a9bc-bab3d075f19c) |
| Pa'lais | [`pa-lais/`](pa-lais/) | [style](https://styles.refero.design/style/5ef5e1ff-3cb3-4383-9f66-26474409d9ae) |
| Palette Supply | [`palette-supply/`](palette-supply/) | [style](https://styles.refero.design/style/542453bb-1895-45fe-95c9-66dbacbf1b08) |
| Pally | [`pally/`](pally/) | [style](https://styles.refero.design/style/029d3ce0-0fe5-4a8c-99c4-4f9d704f1c60) |
| Palmer | [`palmer/`](palmer/) | [style](https://styles.refero.design/style/7cae43cd-dd0e-4658-86e6-d66935cfb213) |
| pampam.city | [`pampam-city/`](pampam-city/) | [style](https://styles.refero.design/style/001480cb-05f4-4802-be39-84b942169481) |
| Pangram Pangram Foundry | [`pangram-pangram-foundry/`](pangram-pangram-foundry/) | [style](https://styles.refero.design/style/6d64a4da-ef40-453e-86f7-4bfabc0c9051) |
| Panxo | [`panxo/`](panxo/) | [style](https://styles.refero.design/style/8b5cfe6d-a2bd-4edb-854e-9185cec46c09) |
| Paper | [`paper/`](paper/) | [style](https://styles.refero.design/style/01771d1f-43c6-4e91-88c5-e4d213fe4ff2) |
| Paradigm | [`paradigm/`](paradigm/) | [style](https://styles.refero.design/style/73cd9a6a-f861-4376-a3e1-e12f83c8960e) |
| Paragraph | [`paragraph/`](paragraph/) | [style](https://styles.refero.design/style/37dd9612-4df0-4cdd-b942-bd97dd0efbd2) |
| Parallel Web Systems | [`parallel-web-systems/`](parallel-web-systems/) | [style](https://styles.refero.design/style/32845f27-6b24-48be-af25-8e664f826b30) |
| Parloa | [`parloa/`](parloa/) | [style](https://styles.refero.design/style/c90e63f8-76c1-4159-9460-29e0d18751ae) |
| Partiful | [`partiful/`](partiful/) | [style](https://styles.refero.design/style/6db1057d-3457-4173-9184-df160415f060) |
| Passionfroot | [`passionfroot/`](passionfroot/) | [style](https://styles.refero.design/style/aaaa705d-3042-4355-ad30-13360f04e403) |
| Passwords | [`passwords/`](passwords/) | [style](https://styles.refero.design/style/da0bfca3-df1d-49d9-ae25-61d8f348426f) |
| Paste | [`paste/`](paste/) | [style](https://styles.refero.design/style/742b500d-3e10-4daa-bb89-d0d26272e5f6) |
| Pastel | [`pastel/`](pastel/) | [style](https://styles.refero.design/style/409d92b9-00a8-4e21-a430-ab95ea48204f) |
| Patch | [`patch/`](patch/) | [style](https://styles.refero.design/style/7af0134b-c299-42f8-9d95-7004e2d0e278) |
| Patreon | [`patreon/`](patreon/) | [style](https://styles.refero.design/style/bb94375b-cf09-47d4-a2e3-7b332b2c9216) |
| Patrick Miller | [`patrick-miller/`](patrick-miller/) | [style](https://styles.refero.design/style/bb63a015-b018-4bd9-be66-0973ac6be753) |
| Payments | [`payments/`](payments/) | [style](https://styles.refero.design/style/123a15b8-4e17-4812-83ec-899cce45db5b) |
| Peak Design | [`peak-design/`](peak-design/) | [style](https://styles.refero.design/style/6f3fb64d-d4c9-4ec1-86a1-7983e5180985) |
| Peggy | [`peggy/`](peggy/) | [style](https://styles.refero.design/style/0ed4e85f-f3e9-438c-bc34-2a726863c602) |
| Peloton | [`peloton/`](peloton/) | [style](https://styles.refero.design/style/355e8465-df7d-486a-9d76-2ace37d076a2) |
| PencilBooth | [`pencilbooth/`](pencilbooth/) | [style](https://styles.refero.design/style/47b15ce2-34c8-46e3-b2de-f7eed0b6a3b9) |
| Penpot | [`penpot/`](penpot/) | [style](https://styles.refero.design/style/7be94705-3666-4fb1-a389-0cfd7cb223cd) |
| Pentagram | [`pentagram/`](pentagram/) | [style](https://styles.refero.design/style/86b56f02-57da-48a1-a647-fda9bbdf2c97) |
| Peppermint | [`peppermint/`](peppermint/) | [style](https://styles.refero.design/style/c03d3f6f-91f9-4571-9840-7fd4da539322) |
| Perk | [`perk/`](perk/) | [style](https://styles.refero.design/style/75c06591-34d2-493a-bd49-70551b5e4a53) |
| Perplexity AI | [`perplexity-ai/`](perplexity-ai/) | [style](https://styles.refero.design/style/81afaa5c-73ac-4ef4-9a99-296da325ea6c) |
| Perplexity AI | [`perplexity-ai-7c4e9339/`](perplexity-ai-7c4e9339/) | [style](https://styles.refero.design/style/7c4e9339-591c-46c3-ac3d-20c1b5b5a568) |
| Perplexity AI | [`perplexity-ai-e9fff87a/`](perplexity-ai-e9fff87a/) | [style](https://styles.refero.design/style/e9fff87a-63ce-4c19-840f-98233db62f58) |
| Petertarka | [`petertarka/`](petertarka/) | [style](https://styles.refero.design/style/40a590a3-1f0d-41ab-9c39-30adf86dd400) |
| Phantom | [`phantom/`](phantom/) | [style](https://styles.refero.design/style/6144c3ae-fc57-4efe-b6ed-2b5eab2dc108) |
| Phantom | [`phantom-80028bf5/`](phantom-80028bf5/) | [style](https://styles.refero.design/style/80028bf5-0c05-43a4-8c9e-b98750d610bd) |
| Phantom Studios | [`phantom-studios/`](phantom-studios/) | [style](https://styles.refero.design/style/1f0cc2ef-9de0-4cbb-909f-ca120ef6d0ae) |
| Photographer | [`photographer/`](photographer/) | [style](https://styles.refero.design/style/837ba115-568f-4ada-8182-3dc100c8b3e4) |
| Piet Oudolf | [`piet-oudolf/`](piet-oudolf/) | [style](https://styles.refero.design/style/3cc1d30c-3b08-48af-bbf0-df195d77835f) |
| Pietrastudio | [`pietrastudio/`](pietrastudio/) | [style](https://styles.refero.design/style/577eb7d8-3555-4378-83df-0cebebc4782f) |
| Pika | [`pika/`](pika/) | [style](https://styles.refero.design/style/9fe9f106-44d2-45fc-9873-10c6ddcfa59b) |
| Pinterest | [`pinterest/`](pinterest/) | [style](https://styles.refero.design/style/8ff3bfb4-6f5e-4e07-83be-56e62ce80d2f) |
| Pipe | [`pipe/`](pipe/) | [style](https://styles.refero.design/style/ab201ed7-928f-4080-ba95-c3992311e39d) |
| Pirsch Analytics | [`pirsch-analytics/`](pirsch-analytics/) | [style](https://styles.refero.design/style/e4b9d41a-8165-47dd-818a-5f6810046ea9) |
| Pitch | [`pitch/`](pitch/) | [style](https://styles.refero.design/style/da332394-784c-4df2-9e66-c3f7b1d28f28) |
| Pixso | [`pixso/`](pixso/) | [style](https://styles.refero.design/style/155dbf6e-1187-424e-9ce8-59ffecff7e6b) |
| Plain | [`plain/`](plain/) | [style](https://styles.refero.design/style/9501cfdc-3eb3-4b64-90f6-9afdded48945) |
| PlanetScale | [`planetscale/`](planetscale/) | [style](https://styles.refero.design/style/a6771960-b826-49bc-9ee7-7f7a5e29642b) |
| Planhat | [`planhat/`](planhat/) | [style](https://styles.refero.design/style/94c4fc51-4323-4f06-a4a4-27517e190445) |
| Planpoint | [`planpoint/`](planpoint/) | [style](https://styles.refero.design/style/fc96be71-d71b-4fc1-a041-f13b3eae7dd5) |
| PLATFORM | [`platform/`](platform/) | [style](https://styles.refero.design/style/81507860-e43d-4c50-b371-7267af9a914b) |
| Playdate | [`playdate/`](playdate/) | [style](https://styles.refero.design/style/2175034b-96d7-417e-886f-ff5a4d8551ae) |
| Playful | [`playful/`](playful/) | [style](https://styles.refero.design/style/f93ac72e-73b2-4b2c-80eb-351ddfa56f4d) |
| Podcorn | [`podcorn/`](podcorn/) | [style](https://styles.refero.design/style/8d4b0738-c302-45c6-98c9-b3cd36e04613) |
| Podia | [`podia/`](podia/) | [style](https://styles.refero.design/style/342f1c3b-a123-49b6-a980-3491bc7793db) |
| Podscan.fm | [`podscan-fm/`](podscan-fm/) | [style](https://styles.refero.design/style/542d4d5c-fd8f-4a8b-a4f7-4694728f7e12) |
| Poly | [`poly/`](poly/) | [style](https://styles.refero.design/style/d8e01e43-d260-4fa3-8f42-ae39e5c6ac84) |
| Pop Site | [`pop-site/`](pop-site/) | [style](https://styles.refero.design/style/e7d4a7de-aeaf-4d49-8c0c-0dedd05a8992) |
| Popcorn | [`popcorn/`](popcorn/) | [style](https://styles.refero.design/style/93fe74fd-bac8-4d13-9d5b-3b5e242f74e6) |
| Portal | [`portal/`](portal/) | [style](https://styles.refero.design/style/632b65d0-17de-4972-a3d1-63d5ab062ab8) |
| Portal | [`portal-b9aeb945/`](portal-b9aeb945/) | [style](https://styles.refero.design/style/b9aeb945-2f6e-4557-9115-e3ff3a8f8dc8) |
| PORTO ROCHA | [`porto-rocha/`](porto-rocha/) | [style](https://styles.refero.design/style/701c8312-5e98-49a8-b2c4-25f1cb66de15) |
| Portrait | [`portrait/`](portrait/) | [style](https://styles.refero.design/style/6b51388b-d00f-4b22-8297-68fb9fc00bc7) |
| Postevand | [`postevand/`](postevand/) | [style](https://styles.refero.design/style/76bfda6b-125f-4d9b-96c0-356de1e9fc10) |
| PostHog | [`posthog/`](posthog/) | [style](https://styles.refero.design/style/56cd3725-3ff0-459e-894d-5da58d1fc549) |
| PostNew | [`postnew/`](postnew/) | [style](https://styles.refero.design/style/4f76756b-0f06-47a3-baad-d3846b23e132) |
| Pravah | [`pravah/`](pravah/) | [style](https://styles.refero.design/style/30a8b128-a5bb-4d86-85eb-743b78091596) |
| Preply | [`preply/`](preply/) | [style](https://styles.refero.design/style/476fea7c-d578-4625-b9e6-36e95faa6ca4) |
| Prevalent | [`prevalent/`](prevalent/) | [style](https://styles.refero.design/style/b1e0a894-7440-44b8-9737-0ea4c988fc24) |
| Prisma | [`prisma/`](prisma/) | [style](https://styles.refero.design/style/8e9e585f-5ad4-4273-8418-e1f82cdb51cf) |
| Prisma Labs | [`prisma-labs/`](prisma-labs/) | [style](https://styles.refero.design/style/8d37e9dd-1d6b-4b60-a636-55aa3e0fc238) |
| Prismic | [`prismic/`](prismic/) | [style](https://styles.refero.design/style/cc20715c-e9ab-42a7-a34b-d43d76677219) |
| Privy | [`privy/`](privy/) | [style](https://styles.refero.design/style/78d9ece2-9033-479a-997a-ede94fc87fda) |
| Programa | [`programa/`](programa/) | [style](https://styles.refero.design/style/41af8353-6a8f-416d-947b-57932f591497) |
| Promly | [`promly/`](promly/) | [style](https://styles.refero.design/style/9117a4f5-6171-44ad-aa85-a387a5d80620) |
| Promova | [`promova/`](promova/) | [style](https://styles.refero.design/style/dae5e893-ca18-44c3-8f83-358cb52af237) |
| ProtoPie | [`protopie/`](protopie/) | [style](https://styles.refero.design/style/031302e5-3269-4735-ab56-d4c7d02edc01) |
| Public | [`public/`](public/) | [style](https://styles.refero.design/style/9d16aa65-cef7-4bf7-83c8-91837a248cd9) |
| Qatalog | [`qatalog/`](qatalog/) | [style](https://styles.refero.design/style/7eed2626-ab11-472c-b04a-603476ff8957) |
| Qatchup | [`qatchup/`](qatchup/) | [style](https://styles.refero.design/style/1b010453-80df-406a-8b1a-72630c4a5165) |
| Quicken | [`quicken/`](quicken/) | [style](https://styles.refero.design/style/75eb47d6-2526-4936-b15a-7474cf4cdc69) |
| Quin | [`quin/`](quin/) | [style](https://styles.refero.design/style/5dc8ca28-26fe-41f2-979a-cda2669c262a) |
| Quizlet | [`quizlet/`](quizlet/) | [style](https://styles.refero.design/style/528eb1d4-8508-4dc6-87b4-c7b92d648dac) |
| Quo (formerly OpenPhone) | [`quo-formerly-openphone/`](quo-formerly-openphone/) | [style](https://styles.refero.design/style/792089e6-c045-498c-8ba1-48d72c206c66) |
| Raad Cycling | [`raad-cycling/`](raad-cycling/) | [style](https://styles.refero.design/style/a59e7f31-1fca-46c1-a6b0-8d1294b33a7c) |
| Ragged Edge | [`ragged-edge/`](ragged-edge/) | [style](https://styles.refero.design/style/fdc0f631-442c-466d-ab79-e1fff2bfdb7d) |
| Railway | [`railway/`](railway/) | [style](https://styles.refero.design/style/5c32375f-6ef1-4345-9418-ebbb7e887343) |
| Rainbow | [`rainbow/`](rainbow/) | [style](https://styles.refero.design/style/1680693c-aed8-47e8-917a-04eb89497b09) |
| RainbowKit | [`rainbowkit/`](rainbowkit/) | [style](https://styles.refero.design/style/7421c174-a1b1-4695-a9e7-a82dc6f5ea3b) |
| Rains INT | [`rains-int/`](rains-int/) | [style](https://styles.refero.design/style/38c8a8c9-4d2e-462a-bff0-80c9d9619ef2) |
| Raise | [`raise/`](raise/) | [style](https://styles.refero.design/style/63d44e1f-e3e9-40dc-bba4-1aa6efc4db87) |
| Rally | [`rally/`](rally/) | [style](https://styles.refero.design/style/ed492f55-eddf-40ed-81cb-550b013787c8) |
| Ramp | [`ramp/`](ramp/) | [style](https://styles.refero.design/style/b38702a0-75ab-474c-9106-00b624535825) |
| Rarible | [`rarible/`](rarible/) | [style](https://styles.refero.design/style/44c69f5d-68bf-4507-8f00-e6aa1c96246b) |
| Raus | [`raus/`](raus/) | [style](https://styles.refero.design/style/d28732de-1b7a-4d37-b7aa-edfa7caf428b) |
| Raw Materials | [`raw-materials/`](raw-materials/) | [style](https://styles.refero.design/style/274e85fb-a34d-4e41-9369-be03065b971b) |
| Raycast | [`raycast/`](raycast/) | [style](https://styles.refero.design/style/3b6a17f0-3bdf-418c-a95e-0b89e5a8b2f8) |
| React Email | [`react-email/`](react-email/) | [style](https://styles.refero.design/style/9905b62f-007b-4b3a-9357-84e85c07ef96) |
| Readwise | [`readwise/`](readwise/) | [style](https://styles.refero.design/style/34c8dbee-f5d9-4495-a0e0-a25c6ca4b95b) |
| Ready | [`ready/`](ready/) | [style](https://styles.refero.design/style/aaca1e02-7b5a-4c03-ac40-454f0d477356) |
| Readymag | [`readymag/`](readymag/) | [style](https://styles.refero.design/style/1287abc9-da90-410d-a997-96b8b11ad646) |
| reboot | [`reboot/`](reboot/) | [style](https://styles.refero.design/style/ac14ea36-ea3e-4a25-bd16-11fb50d806fb) |
| Recess | [`recess/`](recess/) | [style](https://styles.refero.design/style/2c7a280c-7cc1-4766-b043-bc8bdd9b868c) |
| Reclaim | [`reclaim/`](reclaim/) | [style](https://styles.refero.design/style/71c7b9ad-44cc-483f-9c53-3cf73e0522a4) |
| Redbrick Coffee | [`redbrick-coffee/`](redbrick-coffee/) | [style](https://styles.refero.design/style/9307193e-7ce3-48c1-b650-8ab77aa83c3f) |
| Redis Agency | [`redis-agency/`](redis-agency/) | [style](https://styles.refero.design/style/4406799b-1586-4d84-aac9-e6acdee0f679) |
| Reducto | [`reducto/`](reducto/) | [style](https://styles.refero.design/style/af55f85e-1c82-44c1-a8d0-32634bfa6296) |
| Refero | [`refero/`](refero/) | [style](https://styles.refero.design/style/3f296d6e-6a1c-45db-829b-afb078d49ab4) |
| Reflect Notes | [`reflect-notes/`](reflect-notes/) | [style](https://styles.refero.design/style/e7f92774-3c08-402b-917d-020ba1f3d489) |
| Regisgrumberg | [`regisgrumberg/`](regisgrumberg/) | [style](https://styles.refero.design/style/1a2ca4fb-1087-4fd0-83ba-590bc63f54ee) |
| REKKI | [`rekki/`](rekki/) | [style](https://styles.refero.design/style/65b8df27-36a3-47a6-be53-735d1f6a485d) |
| Relace | [`relace/`](relace/) | [style](https://styles.refero.design/style/9623a699-230d-4ee2-a174-8209e1e9ef16) |
| Relate | [`relate/`](relate/) | [style](https://styles.refero.design/style/337ade6a-4bae-49ba-b4aa-8994ac805a81) |
| Relate dot App | [`relate-dot-app/`](relate-dot-app/) | [style](https://styles.refero.design/style/6bc9448b-5d39-4aba-9007-25c7a2aedbad) |
| Relief | [`relief/`](relief/) | [style](https://styles.refero.design/style/e6b53c1e-644b-4300-b42f-0e64905d1443) |
| Relieve Furniture | [`relieve-furniture/`](relieve-furniture/) | [style](https://styles.refero.design/style/4e7daadc-3dc4-4211-bf25-626ea7b216e6) |
| Relume | [`relume/`](relume/) | [style](https://styles.refero.design/style/b2dab9ac-9e35-43f5-a8bb-dd9d6702acf0) |
| Render | [`render/`](render/) | [style](https://styles.refero.design/style/c14bfde7-6f08-4b54-bd9b-39989d10cfef) |
| Repeat | [`repeat/`](repeat/) | [style](https://styles.refero.design/style/53538d2d-d5a1-4719-9c7a-d7ab1f3a8c8a) |
| Replay | [`replay/`](replay/) | [style](https://styles.refero.design/style/74417603-5cb1-49d1-96bd-435382f054bd) |
| Replicate | [`replicate/`](replicate/) | [style](https://styles.refero.design/style/71c21f97-ba85-4439-b259-198a66f4b3d2) |
| replit | [`replit/`](replit/) | [style](https://styles.refero.design/style/c556ab50-a242-4854-9395-450c0004bac5) |
| Resend | [`resend/`](resend/) | [style](https://styles.refero.design/style/0d914ef0-fa84-4c60-a9aa-cef0b5eb6e5d) |
| Resident | [`resident/`](resident/) | [style](https://styles.refero.design/style/f451c085-f048-4c9c-ae3b-03acc88320ab) |
| Retool | [`retool/`](retool/) | [style](https://styles.refero.design/style/c45b115b-dcb5-446d-8952-85aef740f8e4) |
| Revenuecat | [`revenuecat/`](revenuecat/) | [style](https://styles.refero.design/style/b5fdba21-fd4d-427e-b551-1e22c51e42db) |
| Revolut | [`revolut/`](revolut/) | [style](https://styles.refero.design/style/a3161c3c-26d4-425b-aaa3-4fc3f06b77ee) |
| Reworkd | [`reworkd/`](reworkd/) | [style](https://styles.refero.design/style/95913740-3ff7-45ec-a05b-4acf040850a0) |
| Riptype Foundry | [`riptype-foundry/`](riptype-foundry/) | [style](https://styles.refero.design/style/3e397dc6-0e68-435f-9dee-1966a9d245d3) |
| Rive | [`rive/`](rive/) | [style](https://styles.refero.design/style/6323a42b-3b47-4774-92e4-15651a9ba2ac) |
| Riverside | [`riverside/`](riverside/) | [style](https://styles.refero.design/style/09b5a06b-29dc-4d17-8722-d29bd93010c8) |
| Rivian | [`rivian/`](rivian/) | [style](https://styles.refero.design/style/a5dc5626-1103-42e3-9edb-a6d52fb9a210) |
| Roberta's Pizza | [`roberta-s-pizza/`](roberta-s-pizza/) | [style](https://styles.refero.design/style/3e497155-bd96-4134-a4a5-855bd885a25c) |
| robot.com | [`robot-com/`](robot-com/) | [style](https://styles.refero.design/style/30dfffb4-ff6d-4128-b3e5-39046ba258f0) |
| Rootly | [`rootly/`](rootly/) | [style](https://styles.refero.design/style/a037c352-4315-4650-a16c-08392ffca597) |
| Rows | [`rows/`](rows/) | [style](https://styles.refero.design/style/8d4a4e15-31f1-4509-8d13-7746f85c20d7) |
| Rox | [`rox/`](rox/) | [style](https://styles.refero.design/style/66eb1c37-a8e5-4e6c-b17f-a75385b462e7) |
| Runway | [`runway/`](runway/) | [style](https://styles.refero.design/style/874aaea0-c718-454e-8a58-f3beed1284ec) |
| Runway | [`runway-8f623d19/`](runway-8f623d19/) | [style](https://styles.refero.design/style/8f623d19-51f6-4da2-bc45-05573cc98283) |
| Ryan Stephen | [`ryan-stephen/`](ryan-stephen/) | [style](https://styles.refero.design/style/4080f6e4-e61c-4d3c-ab93-de74a1b5dfc2) |
| Sackville & Co. | [`sackville-co/`](sackville-co/) | [style](https://styles.refero.design/style/8a3d3f72-9ef0-466d-adde-77189ddff797) |
| Safepal | [`safepal/`](safepal/) | [style](https://styles.refero.design/style/a74d60e1-0a09-48a1-8721-13f1f45727f1) |
| Samara | [`samara/`](samara/) | [style](https://styles.refero.design/style/934a61aa-50ff-4e90-852b-4ad0b8262d54) |
| San Rita | [`san-rita/`](san-rita/) | [style](https://styles.refero.design/style/f6b396e6-0ad6-402e-9ab9-0034df0d204d) |
| Sana Agents | [`sana-agents/`](sana-agents/) | [style](https://styles.refero.design/style/5bfbe8b0-de0e-470f-b130-929f50437160) |
| Sandclock | [`sandclock/`](sandclock/) | [style](https://styles.refero.design/style/ccbb774f-d1a9-4cc6-b1be-31379ba0baf1) |
| Sandland Sleep | [`sandland-sleep/`](sandland-sleep/) | [style](https://styles.refero.design/style/be17feca-c2bd-4e17-b4d2-ed3ae019a84c) |
| Sanity.io | [`sanity-io/`](sanity-io/) | [style](https://styles.refero.design/style/a3af7369-b61c-4923-a628-931861c8097f) |
| SAPGOODENERGY | [`sapgoodenergy/`](sapgoodenergy/) | [style](https://styles.refero.design/style/0cead5f0-0a56-401f-b637-81d1fe457259) |
| Sauce Labs | [`sauce-labs/`](sauce-labs/) | [style](https://styles.refero.design/style/d271a6c4-942f-4abf-a3de-66795f15f031) |
| SaveDay | [`saveday/`](saveday/) | [style](https://styles.refero.design/style/21da2822-cfe3-4a6a-b333-1be48e855e36) |
| Savee | [`savee/`](savee/) | [style](https://styles.refero.design/style/c6d8490d-e3f2-45c8-aebf-fe5f11daf116) |
| Savvycal | [`savvycal/`](savvycal/) | [style](https://styles.refero.design/style/83b71dd8-de08-4c57-80b2-9fced17a0ca5) |
| Say Briefly | [`say-briefly/`](say-briefly/) | [style](https://styles.refero.design/style/8b91f4c9-74e5-4925-90a3-3dd31fd5725e) |
| Scale | [`scale/`](scale/) | [style](https://styles.refero.design/style/e81d4724-9615-4159-8678-cef35f986cab) |
| Scheduling | [`scheduling/`](scheduling/) | [style](https://styles.refero.design/style/7ad5549e-9baa-4fda-ac43-79d568a86b98) |
| Schema | [`schema/`](schema/) | [style](https://styles.refero.design/style/2b07d62c-d706-4c9d-a3fb-9c163da09f03) |
| School | [`school/`](school/) | [style](https://styles.refero.design/style/a521abb9-d84b-4870-b5a8-363be7c3f94a) |
| Secure | [`secure/`](secure/) | [style](https://styles.refero.design/style/7942590d-b11b-4cfb-8fe8-945b3867d865) |
| Secure and powerful crypto wallet | Ctrl Wallet | [`secure-and-powerful-crypto-wallet-ctrl-wallet/`](secure-and-powerful-crypto-wallet-ctrl-wallet/) | [style](https://styles.refero.design/style/88b02f2c-d82e-495a-8fb6-e750a0fb1211) |
| Seed | [`seed/`](seed/) | [style](https://styles.refero.design/style/cd723d5a-e7ea-4e4c-a3bb-6cf56e05057a) |
| Seline Analytics | [`seline-analytics/`](seline-analytics/) | [style](https://styles.refero.design/style/7967c6d9-e50c-42b5-b4d1-74003ba41781) |
| Sequel | [`sequel/`](sequel/) | [style](https://styles.refero.design/style/1bd3b2ba-9ad9-44ed-9130-03f9d94de821) |
| Sequence | [`sequence/`](sequence/) | [style](https://styles.refero.design/style/5b188bcc-95f6-45b4-b0af-1c78e2ef05f2) |
| Sequence | [`sequence-707a9081/`](sequence-707a9081/) | [style](https://styles.refero.design/style/707a9081-3d1d-4a0b-b1aa-b58b3fab09af) |
| Shade | [`shade/`](shade/) | [style](https://styles.refero.design/style/e549766e-b8b1-48a2-bd72-8cc04e9e4e9d) |
| Shares | [`shares/`](shares/) | [style](https://styles.refero.design/style/cd293b92-71a3-4cc2-a56b-0fa60425b42a) |
| Shelby | [`shelby/`](shelby/) | [style](https://styles.refero.design/style/c01ccb7b-46c9-487c-8a4e-0e9d6627f0d6) |
| Shelby Kay | [`shelby-kay/`](shelby-kay/) | [style](https://styles.refero.design/style/2ab2f666-6da7-4cd8-bc91-52a28bd560ad) |
| Shop | [`shop/`](shop/) | [style](https://styles.refero.design/style/4fa67bd1-f01d-454a-b522-4a0359ff9815) |
| Shopify | [`shopify/`](shopify/) | [style](https://styles.refero.design/style/f212ff99-24fa-4646-a0f2-46a815736ecd) |
| Shopify | [`shopify-1a8ba699/`](shopify-1a8ba699/) | [style](https://styles.refero.design/style/1a8ba699-24cb-4b35-8db1-c595c578199c) |
| Shortcut | [`shortcut/`](shortcut/) | [style](https://styles.refero.design/style/7c984a81-a08f-41a3-b790-8d4a9ed92031) |
| Shupatto | [`shupatto/`](shupatto/) | [style](https://styles.refero.design/style/17824ea8-ac7d-42ca-97e2-9bf92ebea7e1) |
| Shuttle | [`shuttle/`](shuttle/) | [style](https://styles.refero.design/style/7b0f403f-5428-49dc-9ae3-addbe64261ae) |
| SICK AGENCY | [`sick-agency/`](sick-agency/) | [style](https://styles.refero.design/style/9ff03bd9-2ce0-474c-8c73-1905dbacc23b) |
| Sigmaphoto | [`sigmaphoto/`](sigmaphoto/) | [style](https://styles.refero.design/style/67c60ee4-ac38-41ee-834e-ed2a92146417) |
| Signal Messenger | [`signal-messenger/`](signal-messenger/) | [style](https://styles.refero.design/style/41c479a9-7b41-445b-9ea7-c7a6331828f0) |
| Silencio | [`silencio/`](silencio/) | [style](https://styles.refero.design/style/e67ac20e-6497-4756-b7e2-17859a794fb6) |
| Simon Liesinger | [`simon-liesinger/`](simon-liesinger/) | [style](https://styles.refero.design/style/a90dbcb6-e42c-4992-a83b-94879699dd4f) |
| Simone Sniekers | [`simone-sniekers/`](simone-sniekers/) | [style](https://styles.refero.design/style/017ce823-c338-417d-849d-497c97701c4c) |
| Sing-sing | [`sing-sing/`](sing-sing/) | [style](https://styles.refero.design/style/12b20c12-27f8-4938-89ba-569404d36fe8) |
| Sketch | [`sketch/`](sketch/) | [style](https://styles.refero.design/style/4caadb3c-3865-4a4d-9e1a-46478ac71078) |
| Skillshare | [`skillshare/`](skillshare/) | [style](https://styles.refero.design/style/162e9ba9-7487-4b57-aee8-0bbeadcc586d) |
| Slab | [`slab/`](slab/) | [style](https://styles.refero.design/style/f240ed7d-d466-478e-bbce-6c93420dfd1c) |
| Slack | [`slack/`](slack/) | [style](https://styles.refero.design/style/e26cb9b0-f876-41ff-9f24-fd67a6b9776c) |
| Slash | [`slash/`](slash/) | [style](https://styles.refero.design/style/7c38e84b-aea0-4c8f-b3e9-60b994ee6c6b) |
| Sleeve | [`sleeve/`](sleeve/) | [style](https://styles.refero.design/style/2b49d4b2-8461-4985-b7ee-cf9517e19803) |
| Slingshot | [`slingshot/`](slingshot/) | [style](https://styles.refero.design/style/e683efcd-b005-4a35-a5ea-d25bcf3de5c0) |
| Slite | [`slite/`](slite/) | [style](https://styles.refero.design/style/607c2098-bbbb-40bb-b23e-adf2b72c63dd) |
| Slush | [`slush/`](slush/) | [style](https://styles.refero.design/style/8b6b547f-a357-4f1b-9842-4579c62dd42b) |
| Smiling Wolf | [`smiling-wolf/`](smiling-wolf/) | [style](https://styles.refero.design/style/75be52f8-4dbe-45da-9a0e-a11bc92f6927) |
| Sneak in Peace | [`sneak-in-peace/`](sneak-in-peace/) | [style](https://styles.refero.design/style/643f90ba-dc30-428b-a145-26f02fe70551) |
| Sociotype | [`sociotype/`](sociotype/) | [style](https://styles.refero.design/style/973332dc-4e10-4e90-85d8-3bce9c3cd3ed) |
| Solana | [`solana/`](solana/) | [style](https://styles.refero.design/style/f493133e-e289-4fb1-9729-f611d9816aae) |
| Somos incansáveis pra você não precisar ser | Nubank | [`somos-incansa-veis-pra-voce-na-o-precisar-ser-nubank/`](somos-incansa-veis-pra-voce-na-o-precisar-ser-nubank/) | [style](https://styles.refero.design/style/f1a2100a-7cda-4787-b8af-5c5edcfcdff0) |
| Sonos | [`sonos/`](sonos/) | [style](https://styles.refero.design/style/8d315332-6267-4dc0-a14c-e8b49c26b0e1) |
| SoundCloud | [`soundcloud/`](soundcloud/) | [style](https://styles.refero.design/style/35f89ccd-614d-4f8f-9cce-bb94309df237) |
| Spacelab | [`spacelab/`](spacelab/) | [style](https://styles.refero.design/style/7fdcf5eb-4d65-49a2-b887-60119bca4edc) |
| SpaceX | [`spacex/`](spacex/) | [style](https://styles.refero.design/style/13b74e34-b824-4d1d-bd2c-bb9bfbc2d6e1) |
| Sparkles | [`sparkles/`](sparkles/) | [style](https://styles.refero.design/style/eefc0305-818c-4f57-80ce-a4bc1f7aac92) |
| SpatialChat | [`spatialchat/`](spatialchat/) | [style](https://styles.refero.design/style/5b90e218-b325-4901-a1c5-ea1134339826) |
| Spécialiste Belge | [`spe-cialiste-belge/`](spe-cialiste-belge/) | [style](https://styles.refero.design/style/a6729614-4079-4275-ad22-cee04d90ba0c) |
| Speakeasy | [`speakeasy/`](speakeasy/) | [style](https://styles.refero.design/style/a0244aab-0dba-45fe-a595-416c1f0715be) |
| Specht Studio | [`specht-studio/`](specht-studio/) | [style](https://styles.refero.design/style/dd646da4-36f5-42b1-83dd-6a1c90cf8983) |
| Specify | [`specify/`](specify/) | [style](https://styles.refero.design/style/fa8ecd97-5052-4909-a4b4-50419ad9d00a) |
| Spellbook | [`spellbook/`](spellbook/) | [style](https://styles.refero.design/style/9dced8d7-3d19-45d3-9dc5-e5906c3e1578) |
| Splice | [`splice/`](splice/) | [style](https://styles.refero.design/style/1f69df96-675d-4ee0-aa85-e085d9d39981) |
| Spline | [`spline/`](spline/) | [style](https://styles.refero.design/style/b36d5c7c-9b28-4c99-b5a8-69ce03621410) |
| Spotify | [`spotify/`](spotify/) | [style](https://styles.refero.design/style/cc59e195-fed0-4928-96d1-303752786073) |
| Spotify | [`spotify-1514a95f/`](spotify-1514a95f/) | [style](https://styles.refero.design/style/1514a95f-878c-4d4d-bb14-99d1b83f6227) |
| Sprig | [`sprig/`](sprig/) | [style](https://styles.refero.design/style/cbd8a058-6ecb-4f1b-9b5a-2bf2597826ee) |
| Spring/Summer | [`spring-summer/`](spring-summer/) | [style](https://styles.refero.design/style/d56508d7-c307-47f7-ad30-052e5a69f01f) |
| Sprout Social | [`sprout-social/`](sprout-social/) | [style](https://styles.refero.design/style/da7c4464-f135-41fc-b635-99c6f4dc58e6) |
| SquadEasy | [`squadeasy/`](squadeasy/) | [style](https://styles.refero.design/style/3e5c272b-8d68-40d8-9726-b4d6914b4b16) |
| Square | [`square/`](square/) | [style](https://styles.refero.design/style/86a6814d-2485-4fad-b6fd-56c2d0a23620) |
| Squarespace | [`squarespace/`](squarespace/) | [style](https://styles.refero.design/style/8618f649-6d1c-45ca-aff8-e7f04928d8dd) |
| Ssense | [`ssense/`](ssense/) | [style](https://styles.refero.design/style/fa157687-ee42-443e-a992-5f8a3fcdd48f) |
| SST | [`sst/`](sst/) | [style](https://styles.refero.design/style/19f92be1-65ac-4432-a82b-0aa1e685d97d) |
| Stability AI | [`stability-ai/`](stability-ai/) | [style](https://styles.refero.design/style/f532c703-1179-465d-9933-7736df44d0ae) |
| Stable Audio | [`stable-audio/`](stable-audio/) | [style](https://styles.refero.design/style/c363a216-873c-4112-b960-8e823db76f74) |
| Stark | [`stark/`](stark/) | [style](https://styles.refero.design/style/ea9c37e8-c56c-42aa-8e81-9b55222a5cd3) |
| Statamic | [`statamic/`](statamic/) | [style](https://styles.refero.design/style/1efb4cc9-0923-4d4f-884a-b06d4fca4db2) |
| Status | [`status/`](status/) | [style](https://styles.refero.design/style/4ce66adb-ed8b-4e71-8066-15d92c4d2be0) |
| Steep | [`steep/`](steep/) | [style](https://styles.refero.design/style/75fdb89f-ca64-41b3-af36-7a78bd09448e) |
| Stellar | [`stellar/`](stellar/) | [style](https://styles.refero.design/style/98a1ad40-90e2-4665-b49f-e5ffd4d4b90b) |
| Stink Studios | [`stink-studios/`](stink-studios/) | [style](https://styles.refero.design/style/e287e026-3433-4a1d-9b23-9a65f8b9c138) |
| Stocketa | [`stocketa/`](stocketa/) | [style](https://styles.refero.design/style/c1f7749f-319b-491b-8243-22050e85994f) |
| Strava | [`strava/`](strava/) | [style](https://styles.refero.design/style/efdd6d8f-4488-4312-86a7-4ee8e016c83a) |
| Streamtime | [`streamtime/`](streamtime/) | [style](https://styles.refero.design/style/9be20798-843b-424c-bc87-192edc0cce22) |
| Stripe | [`stripe/`](stripe/) | [style](https://styles.refero.design/style/48e5de76-05d5-4c4e-a269-c7c245b291ec) |
| Structured | [`structured/`](structured/) | [style](https://styles.refero.design/style/6c0b77d3-71f9-469d-98aa-4ce1d6d76ac8) |
| Strut | [`strut/`](strut/) | [style](https://styles.refero.design/style/deb6c017-d2d3-4945-aaee-fa3d9ea6de70) |
| Stryds | [`stryds/`](stryds/) | [style](https://styles.refero.design/style/6b4e6620-5c06-4dc1-931b-82265116f6f2) |
| Studio Emmerer | [`studio-emmerer/`](studio-emmerer/) | [style](https://styles.refero.design/style/670869ea-9576-4f9d-af3a-038910f8b9b8) |
| Studio Few | [`studio-few/`](studio-few/) | [style](https://styles.refero.design/style/d5931dff-2ae3-44c7-b76f-9e5936f90611) |
| Studio Gruhl | [`studio-gruhl/`](studio-gruhl/) | [style](https://styles.refero.design/style/9e3fde24-cc7d-4b96-a70a-7c172882aa8f) |
| Studio HEED | [`studio-heed/`](studio-heed/) | [style](https://styles.refero.design/style/10b9e7bb-9ffb-43eb-9360-5628d8390107) |
| Studio Oker | [`studio-oker/`](studio-oker/) | [style](https://styles.refero.design/style/e045b276-ae8d-442e-98de-fa8650e284de) |
| Studio Thomas | [`studio-thomas/`](studio-thomas/) | [style](https://styles.refero.design/style/f2b24dce-5b1f-47c2-8ef6-bbbd08b68826) |
| Stykka | [`stykka/`](stykka/) | [style](https://styles.refero.design/style/b43fdb3c-85e9-4282-9262-1d3deb4b679d) |
| 큰그림컴퍼니 | [`style-eafe33bf/`](style-eafe33bf/) | [style](https://styles.refero.design/style/eafe33bf-6f53-4619-b279-686ad5869799) |
| Subframe | [`subframe/`](subframe/) | [style](https://styles.refero.design/style/c65db621-7faa-45f3-8e30-dc3ef9ffe660) |
| Sublime | [`sublime/`](sublime/) | [style](https://styles.refero.design/style/80392d80-3970-46f0-a7ed-f213f316c933) |
| Subset | [`subset/`](subset/) | [style](https://styles.refero.design/style/a4dcee26-dd31-415a-ac99-64299959e7f1) |
| Substack | [`substack/`](substack/) | [style](https://styles.refero.design/style/14e563d8-a35a-4867-b4bf-15d1620ddae7) |
| sunday | [`sunday/`](sunday/) | [style](https://styles.refero.design/style/d703d9f7-4821-468e-8fe4-c8b5790b00ed) |
| Sunday | [`sunday-c521be99/`](sunday-c521be99/) | [style](https://styles.refero.design/style/c521be99-14af-4d57-8f8f-34c76c9ade61) |
| Suno | [`suno/`](suno/) | [style](https://styles.refero.design/style/3b5ff57f-a371-4c7f-82ae-5fc5485da073) |
| Supabase | [`supabase/`](supabase/) | [style](https://styles.refero.design/style/632249f1-fd78-4c77-9b34-7bae37ff3e9b) |
| Supahub | [`supahub/`](supahub/) | [style](https://styles.refero.design/style/a6d39bad-6e32-462e-afce-67c9cb76cf40) |
| Super | [`super/`](super/) | [style](https://styles.refero.design/style/25863c92-a287-491e-bae7-4da37a1f9a98) |
| SuperHi | [`superhi/`](superhi/) | [style](https://styles.refero.design/style/90b8631c-4e2c-407e-86a3-d2bff456dc93) |
| SuperHi Basic Income | [`superhi-basic-income/`](superhi-basic-income/) | [style](https://styles.refero.design/style/e57d9536-22a7-49db-8bd4-4306d8927ec3) |
| SuperHi Plus | [`superhi-plus/`](superhi-plus/) | [style](https://styles.refero.design/style/a1f9e844-c4b6-4526-9cfc-81208c50aee1) |
| Superhuman | [`superhuman/`](superhuman/) | [style](https://styles.refero.design/style/418b374a-be64-44f0-b17e-1d45308c7e62) |
| Superintelligence for work | [`superintelligence-for-work/`](superintelligence-for-work/) | [style](https://styles.refero.design/style/1db2adc9-2f10-4f20-af1b-27fa4b25f729) |
| Superlative | [`superlative/`](superlative/) | [style](https://styles.refero.design/style/10ab6120-3d03-48ff-aebe-0b4910edc046) |
| Superlist | [`superlist/`](superlist/) | [style](https://styles.refero.design/style/13f27e7a-d84f-4ff9-a030-ae4e2c930757) |
| Superlocal | [`superlocal/`](superlocal/) | [style](https://styles.refero.design/style/a865ac1d-a4c2-425b-90db-2a7ec6d461a3) |
| SuperMush | [`supermush/`](supermush/) | [style](https://styles.refero.design/style/71a9583d-1710-4696-9269-50ca8c9a2cfa) |
| Superpower | [`superpower/`](superpower/) | [style](https://styles.refero.design/style/5d34568d-4bdc-445d-a527-c6f5249fa8fb) |
| Superr | [`superr/`](superr/) | [style](https://styles.refero.design/style/cfd0fec1-f25a-4b9b-9bd0-d5b66960f2f2) |
| Superthread | [`superthread/`](superthread/) | [style](https://styles.refero.design/style/aa87c258-0eb8-4c14-9f2f-96f16fb926b8) |
| Superwhisper | [`superwhisper/`](superwhisper/) | [style](https://styles.refero.design/style/b8a8976c-52d9-4ebb-95ea-4c40f4a9acab) |
| Surface | [`surface/`](surface/) | [style](https://styles.refero.design/style/e6c20874-c6f9-4c31-b6b2-2cb27cbf15f2) |
| Surfshark | [`surfshark/`](surfshark/) | [style](https://styles.refero.design/style/4fc7a535-3c99-4ffe-8365-7d025d33274e) |
| Svelte | [`svelte/`](svelte/) | [style](https://styles.refero.design/style/303ca7ea-e6fa-4e95-8acb-8008c4d3c068) |
| Swap | [`swap/`](swap/) | [style](https://styles.refero.design/style/15d10d6c-1844-46c6-ae69-c99a56e6ad41) |
| sweetgreen | [`sweetgreen/`](sweetgreen/) | [style](https://styles.refero.design/style/d91841cf-c717-43ef-97a2-400778fa6e1a) |
| SwimClub | [`swimclub/`](swimclub/) | [style](https://styles.refero.design/style/d7a73e16-4b3e-4b9d-aef2-2c31a9db7457) |
| Switch-Lit | [`switch-lit/`](switch-lit/) | [style](https://styles.refero.design/style/97f7787e-bba0-4d37-8b74-4b0cb8d5a57c) |
| Swwim | [`swwim/`](swwim/) | [style](https://styles.refero.design/style/5cb1fbe8-b539-4482-b645-74a745332965) |
| Syllabus | [`syllabus/`](syllabus/) | [style](https://styles.refero.design/style/b78edcaa-6754-41d7-ac00-0119b41ad88a) |
| Symbol Audio | [`symbol-audio/`](symbol-audio/) | [style](https://styles.refero.design/style/3b742f76-25ad-446c-a942-09b09b93f6a3) |
| Symbolic.ai | [`symbolic-ai/`](symbolic-ai/) | [style](https://styles.refero.design/style/694723e9-0df7-4b9f-ba07-83fc598532d6) |
| Synthesia | [`synthesia/`](synthesia/) | [style](https://styles.refero.design/style/36a7e1ed-8d14-456b-b828-ff4f47797a74) |
| T1 Energy | [`t1-energy/`](t1-energy/) | [style](https://styles.refero.design/style/e79b761d-f476-4c5d-8943-e31a58664e4d) |
| Tableland | [`tableland/`](tableland/) | [style](https://styles.refero.design/style/573fe0d5-8f0b-4c59-bae3-3f2e67cc63f0) |
| Tailark Pro | [`tailark-pro/`](tailark-pro/) | [style](https://styles.refero.design/style/ee8698fd-bb1e-4813-9571-5db39e508542) |
| Tailscale | [`tailscale/`](tailscale/) | [style](https://styles.refero.design/style/5b679fb6-8d53-402d-a77b-c88bfb397623) |
| Tailwind CSS | [`tailwind-css/`](tailwind-css/) | [style](https://styles.refero.design/style/8f79ab5b-a91a-4bf4-a64f-4a5ba3ada7d5) |
| Tally Forms | [`tally-forms/`](tally-forms/) | [style](https://styles.refero.design/style/4e3aa524-b146-416c-907f-382c079ea80c) |
| Tana | [`tana/`](tana/) | [style](https://styles.refero.design/style/f7bf0618-817c-4b7d-9568-cbd9c476c599) |
| Tapbots | [`tapbots/`](tapbots/) | [style](https://styles.refero.design/style/8ce08850-085e-4954-a2f0-16acfb8dce23) |
| Tatem | [`tatem/`](tatem/) | [style](https://styles.refero.design/style/cb6e4ab0-b8fe-45b0-bd22-6339b073e26d) |
| Tech Barcelona | [`tech-barcelona/`](tech-barcelona/) | [style](https://styles.refero.design/style/271172f7-9f6d-4d6f-9baa-91a41648d8be) |
| Tedy | [`tedy/`](tedy/) | [style](https://styles.refero.design/style/9fd54812-6eb1-4445-83e6-124af21387db) |
| teenage engineering | [`teenage-engineering/`](teenage-engineering/) | [style](https://styles.refero.design/style/aecf9dda-5cba-4dc7-9e73-59b65d895cdf) |
| TeePublic | [`teepublic/`](teepublic/) | [style](https://styles.refero.design/style/0231caf5-0347-4f2d-ba20-5bab8fcaf2ce) |
| Telepathic Instruments | [`telepathic-instruments/`](telepathic-instruments/) | [style](https://styles.refero.design/style/5183054c-4c6e-4ecf-bd90-f7d794d5eb17) |
| Telescope | [`telescope/`](telescope/) | [style](https://styles.refero.design/style/e6fb72b4-877d-46ab-8f94-590b971d4dc1) |
| Tella | [`tella/`](tella/) | [style](https://styles.refero.design/style/41547c7a-3bbe-49f0-95d6-9701c9df9a5e) |
| Tesla | [`tesla/`](tesla/) | [style](https://styles.refero.design/style/7266b546-2fb0-465c-acd6-79001c39829a) |
| Textla | [`textla/`](textla/) | [style](https://styles.refero.design/style/fb812ddb-d7c0-4540-82d7-1562dff16f09) |
| The Beams | [`the-beams/`](the-beams/) | [style](https://styles.refero.design/style/b321ca45-2971-4828-9165-82b77f676bfd) |
| The Fascination The Fascination | [`the-fascination-the-fascination/`](the-fascination-the-fascination/) | [style](https://styles.refero.design/style/9c60e0a4-a702-49af-9fc1-52edbc9dd902) |
| The Leap | [`the-leap/`](the-leap/) | [style](https://styles.refero.design/style/6b201ccd-16ae-4c2d-84bb-498f7cb568dd) |
| The online bank | [`the-online-bank/`](the-online-bank/) | [style](https://styles.refero.design/style/e9f07a27-bdd4-4f6a-8132-329d014aa5f4) |
| The Pop Manifesto | [`the-pop-manifesto/`](the-pop-manifesto/) | [style](https://styles.refero.design/style/80913fb2-60ee-4d6c-b2c8-17600351096a) |
| The Verge | [`the-verge/`](the-verge/) | [style](https://styles.refero.design/style/e8c4206d-9a2a-4c08-9524-6f14a25e792f) |
| The1 | [`the1/`](the1/) | [style](https://styles.refero.design/style/04d2e256-61b0-4184-a834-e36c15d09ea5) |
| TheyDo | [`theydo/`](theydo/) | [style](https://styles.refero.design/style/b490cff8-9d2c-4225-9118-6468e4f3213d) |
| Things | [`things/`](things/) | [style](https://styles.refero.design/style/ec0f5bca-8367-49e7-b8aa-73b3fa09a4a0) |
| Thisispam | [`thisispam/`](thisispam/) | [style](https://styles.refero.design/style/f352b093-1ba7-49c7-9ce3-ad73cf9a1aee) |
| Thomas Hedger | [`thomas-hedger/`](thomas-hedger/) | [style](https://styles.refero.design/style/9fe18d8b-58b7-404d-bcc6-9e8a73b8862c) |
| Thomas Vimare | [`thomas-vimare/`](thomas-vimare/) | [style](https://styles.refero.design/style/1b293bed-e6fc-4880-9691-2dbf04339bd5) |
| ThoughtLab | [`thoughtlab/`](thoughtlab/) | [style](https://styles.refero.design/style/82d52a5f-b1bb-4a69-91a3-15a7eb8bbe99) |
| Threads | [`threads/`](threads/) | [style](https://styles.refero.design/style/3b46c64e-b733-4d70-8cd0-531ca1f92937) |
| Threads | [`threads-182f8743/`](threads-182f8743/) | [style](https://styles.refero.design/style/182f8743-fe22-45d3-98bc-9fd29d058602) |
| Three | [`three/`](three/) | [style](https://styles.refero.design/style/57160546-4cf7-4d52-bb05-cd8b88e1fbf9) |
| Tilda | [`tilda/`](tilda/) | [style](https://styles.refero.design/style/6d8dc9bb-78b7-4eaa-9b08-66b431760e9f) |
| Timescale | [`timescale/`](timescale/) | [style](https://styles.refero.design/style/ae175f23-1ec7-47ea-9380-7bff7041028b) |
| Tines | [`tines/`](tines/) | [style](https://styles.refero.design/style/18e2c0b4-f29c-4e84-90b0-1d8066b59409) |
| Tinybird | [`tinybird/`](tinybird/) | [style](https://styles.refero.design/style/e5d7b80d-f473-439f-87a5-84716c448a05) |
| TinyFaces NFT | [`tinyfaces-nft/`](tinyfaces-nft/) | [style](https://styles.refero.design/style/2112d018-bf95-4a87-a1f3-6e948330b207) |
| Titan | [`titan/`](titan/) | [style](https://styles.refero.design/style/964b9215-396b-492c-abec-7bd778d7b1c9) |
| ToDesktop | [`todesktop/`](todesktop/) | [style](https://styles.refero.design/style/dd89ce6c-f0aa-4ca8-bd63-19dcd81920a7) |
| Todoist | [`todoist/`](todoist/) | [style](https://styles.refero.design/style/729ba7a8-35d5-44f3-abc0-1078ff6a3467) |
| Together AI | [`together-ai/`](together-ai/) | [style](https://styles.refero.design/style/461da0f0-fde6-46bc-8137-7eca006260a8) |
| Toggl Track | [`toggl-track/`](toggl-track/) | [style](https://styles.refero.design/style/813be405-c2b9-41be-9864-7b53d66483dc) |
| TOMO | [`tomo/`](tomo/) | [style](https://styles.refero.design/style/6f148ff6-ae72-496a-a21d-84d7779825ff) |
| Tomorro | [`tomorro/`](tomorro/) | [style](https://styles.refero.design/style/bc7458ba-6b81-4f3e-ab5a-4126ee1eaf80) |
| Touchy Coffee | [`touchy-coffee/`](touchy-coffee/) | [style](https://styles.refero.design/style/6da76890-6e04-452a-834d-ff019e232c2b) |
| Tparkes | [`tparkes/`](tparkes/) | [style](https://styles.refero.design/style/a21cf7a4-80e0-4f4a-9297-823a5180c2d3) |
| Tracky | [`tracky/`](tracky/) | [style](https://styles.refero.design/style/34788d94-1147-4d38-8df7-6f47ef7efb12) |
| Transform | [`transform/`](transform/) | [style](https://styles.refero.design/style/91939ad3-9e22-4256-a396-a1716a064ac4) |
| Trawelt | [`trawelt/`](trawelt/) | [style](https://styles.refero.design/style/fade1fe1-bbd3-4b1a-ae19-fe88f6744fe0) |
| Trigger.dev | [`trigger-dev/`](trigger-dev/) | [style](https://styles.refero.design/style/86541d12-7870-4d51-8c47-0880fdb1ea01) |
| Tripolis-Park™ | [`tripolis-park/`](tripolis-park/) | [style](https://styles.refero.design/style/bce52fd3-ac16-4e67-a45f-78bfc2350aad) |
| Trunk | [`trunk/`](trunk/) | [style](https://styles.refero.design/style/48971df7-919d-453c-9d0b-4600cd24c583) |
| Tuple | [`tuple/`](tuple/) | [style](https://styles.refero.design/style/1003d7c5-536c-485d-b191-a34178415eac) |
| Turso | [`turso/`](turso/) | [style](https://styles.refero.design/style/5a7ec81f-03b6-4d21-a706-0d1d323d8899) |
| Twingate | [`twingate/`](twingate/) | [style](https://styles.refero.design/style/0acef011-07da-4416-b874-ccdd675140f6) |
| Twitch | [`twitch/`](twitch/) | [style](https://styles.refero.design/style/40030487-56e3-447d-904f-b955ebadd0b5) |
| Twocreate | [`twocreate/`](twocreate/) | [style](https://styles.refero.design/style/8b6970fa-3478-4c1b-aadf-41ffe1ef68e6) |
| TWOMUCH.STUDIO | [`twomuch-studio/`](twomuch-studio/) | [style](https://styles.refero.design/style/12b3e1b6-31b9-4843-9b3b-8f39c9dd1474) |
| TWOTWO | [`twotwo/`](twotwo/) | [style](https://styles.refero.design/style/170a690b-7424-4c2e-9d08-975725cf9261) |
| Typeform | [`typeform/`](typeform/) | [style](https://styles.refero.design/style/a0d54731-58dc-448b-a6b0-ed543f397ab1) |
| Typewolf | [`typewolf/`](typewolf/) | [style](https://styles.refero.design/style/c46ecd77-9c92-4a85-9162-c6d4afd99d95) |
| Uber | [`uber/`](uber/) | [style](https://styles.refero.design/style/caf8d2ef-4173-4431-9d26-05be0272e9f8) |
| Udemy | [`udemy/`](udemy/) | [style](https://styles.refero.design/style/c03afcbd-96ed-4b7f-8d0a-277fc0042ba7) |
| UGLYCASH | [`uglycash/`](uglycash/) | [style](https://styles.refero.design/style/680cf16b-0093-473b-854f-f1de9af5e698) |
| Ui | [`ui/`](ui/) | [style](https://styles.refero.design/style/0fd67ec5-7e9c-4ca9-b368-5d9c7388477a) |
| Uizard | [`uizard/`](uizard/) | [style](https://styles.refero.design/style/8065e38a-cdb7-4645-b168-98e6f80e7118) |
| Umbrel | [`umbrel/`](umbrel/) | [style](https://styles.refero.design/style/9e5bd4b1-0ba8-4592-a5ec-a935bd4ea9c6) |
| Unicorn Studio | [`unicorn-studio/`](unicorn-studio/) | [style](https://styles.refero.design/style/6bd8007f-01bc-46cc-8599-b396a39c1474) |
| Uniswap | [`uniswap/`](uniswap/) | [style](https://styles.refero.design/style/b0cb2465-ad7b-4657-a2e4-b8c793355cd3) |
| Uniswap Cup | [`uniswap-cup/`](uniswap-cup/) | [style](https://styles.refero.design/style/fabb51a0-0f83-4177-b83e-4969705a389c) |
| Uniswap | [`uniswap-e5b95270/`](uniswap-e5b95270/) | [style](https://styles.refero.design/style/e5b95270-9148-417a-89c6-32138d83a251) |
| until | [`until/`](until/) | [style](https://styles.refero.design/style/ded6d7c4-2801-45f4-8b8a-089f1b37842d) |
| Upstash | [`upstash/`](upstash/) | [style](https://styles.refero.design/style/e050061c-346d-44cc-92ba-6b22beb4a91f) |
| User Interviews | [`user-interviews/`](user-interviews/) | [style](https://styles.refero.design/style/376baf20-9ace-405d-bf4a-086016f2b1e3) |
| UY Studio | [`uy-studio/`](uy-studio/) | [style](https://styles.refero.design/style/b376d42c-b2cb-4a52-8cec-ebf19cf1883f) |
| V–A–C | [`v-a-c/`](v-a-c/) | [style](https://styles.refero.design/style/40154dc4-e681-4df9-be01-a6681d5887a6) |
| V–A–C Sreda | [`v-a-c-sreda/`](v-a-c-sreda/) | [style](https://styles.refero.design/style/b634cbce-b4db-44a6-b2a4-b58d9d2fe93d) |
| v0 by Vercel | [`v0-by-vercel/`](v0-by-vercel/) | [style](https://styles.refero.design/style/50aa2b8e-4760-4379-a3c1-59b65d8576a7) |
| V7labs | [`v7labs/`](v7labs/) | [style](https://styles.refero.design/style/1ab79e76-a07f-48fd-8e93-0a0fee12abd7) |
| Val Town | [`val-town/`](val-town/) | [style](https://styles.refero.design/style/4d0a5051-1c4c-4338-8406-2babdc97915c) |
| VALIENTE BRANDS | [`valiente-brands/`](valiente-brands/) | [style](https://styles.refero.design/style/f63bf016-5b53-4ddf-9f8c-da43f75a9e2b) |
| Valo | [`valo/`](valo/) | [style](https://styles.refero.design/style/f65c3888-2eb3-41a1-87b3-f410b667097e) |
| Vana | [`vana/`](vana/) | [style](https://styles.refero.design/style/2a3cdb2e-effe-406b-932e-37e4dc88ab1d) |
| Vanmoof | [`vanmoof/`](vanmoof/) | [style](https://styles.refero.design/style/4887c681-d4e6-41d3-b83c-5650cf925ee9) |
| Vanta | [`vanta/`](vanta/) | [style](https://styles.refero.design/style/6b4c8ca5-476e-442b-b713-d5fc58cf04ac) |
| Vapi | [`vapi/`](vapi/) | [style](https://styles.refero.design/style/bab34295-03fc-4993-ae42-b440fe78647b) |
| Varo Bank | [`varo-bank/`](varo-bank/) | [style](https://styles.refero.design/style/2c05cf8d-97c5-4f35-96ef-eb53fc03ea81) |
| Vectary | [`vectary/`](vectary/) | [style](https://styles.refero.design/style/dfe5faa4-a108-45a8-a68c-ed19be2db766) |
| VEED | [`veed/`](veed/) | [style](https://styles.refero.design/style/fff821ec-a3bf-41a5-aea2-626185bcd227) |
| Ventriloc | [`ventriloc/`](ventriloc/) | [style](https://styles.refero.design/style/f99aca3e-5289-4595-a7cc-77a72052f4b8) |
| Vercel | [`vercel/`](vercel/) | [style](https://styles.refero.design/style/f24daf3a-d43f-4dec-85a9-8ac1d5148a03) |
| Verse | [`verse/`](verse/) | [style](https://styles.refero.design/style/486c3132-9ff7-4e27-9eef-ca2e130bd827) |
| Vetric | [`vetric/`](vetric/) | [style](https://styles.refero.design/style/d51a3a30-965c-427e-9e40-ff177786889f) |
| Vibrants | [`vibrants/`](vibrants/) | [style](https://styles.refero.design/style/f73ce3e0-4452-4b21-b36f-6fde27de2cd6) |
| Videoconferencia | [`videoconferencia/`](videoconferencia/) | [style](https://styles.refero.design/style/206c6c51-df38-425f-8d07-b0cc9dd065cf) |
| Viewport | [`viewport/`](viewport/) | [style](https://styles.refero.design/style/754ad72f-9abd-43df-ac72-c6abf2036ed4) |
| Vimeo | [`vimeo/`](vimeo/) | [style](https://styles.refero.design/style/be6c7488-9cea-43db-bb28-2606f53ade14) |
| VISIONNAIRE | [`visionnaire/`](visionnaire/) | [style](https://styles.refero.design/style/0ecfea58-c1f3-4671-806d-5ae0eb779f38) |
| Visitors | [`visitors/`](visitors/) | [style](https://styles.refero.design/style/e7876363-181a-44a9-9e5c-2255cf98aea5) |
| Visual | [`visual/`](visual/) | [style](https://styles.refero.design/style/d2c0ed7b-c649-4d77-91de-1bd69dd10a9e) |
| VITURE | [`viture/`](viture/) | [style](https://styles.refero.design/style/390cfba6-8c2f-4273-8c9e-750d470b6e2e) |
| Vivid+Co | [`vivid-co/`](vivid-co/) | [style](https://styles.refero.design/style/8875b14e-c59a-492f-8780-8027a480f21c) |
| Vivid Spain | [`vivid-spain/`](vivid-spain/) | [style](https://styles.refero.design/style/c25e8eb5-634d-4aca-b30b-d8ba5a50dc5a) |
| Voiceflow | [`voiceflow/`](voiceflow/) | [style](https://styles.refero.design/style/03b3d707-2a30-4f53-a524-347d1b70eb2c) |
| Voicenotes | [`voicenotes/`](voicenotes/) | [style](https://styles.refero.design/style/cafcbe97-58eb-4331-9a0a-c5e6969e8a04) |
| Volume | [`volume/`](volume/) | [style](https://styles.refero.design/style/edc0c03e-8c20-4e22-badd-2735fcb9f4a8) |
| VSCO® | [`vsco/`](vsco/) | [style](https://styles.refero.design/style/759c0588-ea22-44c1-a1cf-42cb81eb6cb0) |
| Vucko | [`vucko/`](vucko/) | [style](https://styles.refero.design/style/cc5b19fd-12cf-4b30-801c-8a0363646e48) |
| Waabi | [`waabi/`](waabi/) | [style](https://styles.refero.design/style/91174f53-6770-4398-b3e7-ad14b1c39b6d) |
| Waka Waka | [`waka-waka/`](waka-waka/) | [style](https://styles.refero.design/style/ea55601d-e953-48b3-99db-374b39bf2f56) |
| Walden | [`walden/`](walden/) | [style](https://styles.refero.design/style/31903c2b-99bf-4fa8-8c92-238858f3563c) |
| WalletConnect | [`walletconnect/`](walletconnect/) | [style](https://styles.refero.design/style/29392960-0acf-4891-ad33-28a72f6a9b75) |
| Wallpaper Projects | [`wallpaper-projects/`](wallpaper-projects/) | [style](https://styles.refero.design/style/0a2bcda6-b5b9-463d-bc8d-2c7ccaa2b776) |
| Warp | [`warp/`](warp/) | [style](https://styles.refero.design/style/d4c51049-58eb-404a-9fcb-f195928b1c99) |
| Warp | [`warp-720c9806/`](warp-720c9806/) | [style](https://styles.refero.design/style/720c9806-2d70-4dd1-9a19-12efd71fc742) |
| Warp | [`warp-79714b4e/`](warp-79714b4e/) | [style](https://styles.refero.design/style/79714b4e-c89a-44b3-8da4-931daa9a466f) |
| Watch new Originals | [`watch-new-originals/`](watch-new-originals/) | [style](https://styles.refero.design/style/e586b296-bfac-4e93-add2-daa384712b39) |
| Wayfinder | [`wayfinder/`](wayfinder/) | [style](https://styles.refero.design/style/d9fbc68b-0d42-4c09-829d-1207b781f46a) |
| Wealthsimple | [`wealthsimple/`](wealthsimple/) | [style](https://styles.refero.design/style/043341c3-cf82-4be1-9142-fa5e6a370ca9) |
| Webflow | [`webflow/`](webflow/) | [style](https://styles.refero.design/style/31471407-598a-45fd-a505-d921980d8855) |
| Websmith Studio | [`websmith-studio/`](websmith-studio/) | [style](https://styles.refero.design/style/11cfc460-807b-42c5-b10a-7b042c60f3e8) |
| Wellfound | [`wellfound/`](wellfound/) | [style](https://styles.refero.design/style/f8286b32-cc41-43e3-8b43-067333bb2e32) |
| Wemakethings | [`wemakethings/`](wemakethings/) | [style](https://styles.refero.design/style/15d57573-513b-49aa-91c7-1b7f87bb1a55) |
| WGSN | [`wgsn/`](wgsn/) | [style](https://styles.refero.design/style/6cf3aec4-d028-44b0-b634-cc93e6c08e3c) |
| WhatsApp.com | [`whatsapp-com/`](whatsapp-com/) | [style](https://styles.refero.design/style/a643f3a0-6c99-4076-b03f-6f0691c21bd0) |
| Whimsical | [`whimsical/`](whimsical/) | [style](https://styles.refero.design/style/8e153a14-40a9-4793-b94b-c144d325c730) |
| WHOOP | [`whoop/`](whoop/) | [style](https://styles.refero.design/style/05053a60-1964-4154-9d58-ebdf6352ed3a) |
| Whop | [`whop/`](whop/) | [style](https://styles.refero.design/style/9eeab5f0-eece-4898-a1d2-2db48ac2bc7d) |
| Winamp | [`winamp/`](winamp/) | [style](https://styles.refero.design/style/bc4b4dee-8b32-494c-9a2d-d56fcd450b79) |
| Windsurf | [`windsurf/`](windsurf/) | [style](https://styles.refero.design/style/cfab7b43-ed24-41e9-9272-c858700b865b) |
| Wise | [`wise/`](wise/) | [style](https://styles.refero.design/style/367c0c6e-73a7-441c-a8ff-91d139ac60dc) |
| Wise Design | [`wise-design/`](wise-design/) | [style](https://styles.refero.design/style/c5326639-873a-4257-ad1a-7da9111e9286) |
| Wispr Flow | [`wispr-flow/`](wispr-flow/) | [style](https://styles.refero.design/style/ac53825c-1e06-4ae0-8489-cace5c5e0339) |
| wix.com | [`wix-com/`](wix-com/) | [style](https://styles.refero.design/style/a31f5b99-6e7d-4e13-9b80-cd60e455bd76) |
| Wiza | [`wiza/`](wiza/) | [style](https://styles.refero.design/style/3720657f-2b59-475e-a43d-b18cac718325) |
| Wizz | [`wizz/`](wizz/) | [style](https://styles.refero.design/style/408d0b89-be7d-4a09-bc29-8a8ce13d0a7b) |
| Wonder | [`wonder/`](wonder/) | [style](https://styles.refero.design/style/c81d2be0-05b7-4755-8046-f2d19fbc448c) |
| Wope | [`wope/`](wope/) | [style](https://styles.refero.design/style/3882ed21-8ef8-4bc9-b125-7791c0f136bb) |
| Workable | [`workable/`](workable/) | [style](https://styles.refero.design/style/0ab4c544-6147-4998-8365-3a0f6191e54f) |
| Workflow | [`workflow/`](workflow/) | [style](https://styles.refero.design/style/71451d9e-9a8a-4858-9a91-fbe44047e110) |
| Worth Agency | [`worth-agency/`](worth-agency/) | [style](https://styles.refero.design/style/906ef782-4be7-45ee-9800-0514d46e7518) |
| Woset | [`woset/`](woset/) | [style](https://styles.refero.design/style/430813c0-f0c7-434f-92ef-d3a0780ba734) |
| WOUQ | [`wouq/`](wouq/) | [style](https://styles.refero.design/style/4fc87190-9783-4a85-bdc1-35800a2ec690) |
| Woven | [`woven/`](woven/) | [style](https://styles.refero.design/style/76483bd1-37d3-4fb9-889b-aecf27b08b83) |
| Wrike | [`wrike/`](wrike/) | [style](https://styles.refero.design/style/e1c7cab3-dae7-47c3-bb2c-c8f616a8124f) |
| WRITER | [`writer/`](writer/) | [style](https://styles.refero.design/style/ddd9ffaa-d831-4cb4-a5bf-a1efce421dca) |
| X (formerly Twitter) | [`x-formerly-twitter/`](x-formerly-twitter/) | [style](https://styles.refero.design/style/655340ae-abff-4a90-8545-8feb62411f68) |
| xAI | [`xai/`](xai/) | [style](https://styles.refero.design/style/3b83dfe4-2f53-4a4d-819d-e6045ca5f7dc) |
| Xbox.com | [`xbox-com/`](xbox-com/) | [style](https://styles.refero.design/style/3792d0ca-6c74-4667-a64d-76efe9f87076) |
| Yellowbird® | [`yellowbird/`](yellowbird/) | [style](https://styles.refero.design/style/22cc86bc-6c5f-4413-a4a2-66b8ddc82ad0) |
| Yinka Ilori Studio | [`yinka-ilori-studio/`](yinka-ilori-studio/) | [style](https://styles.refero.design/style/deccaba1-8d53-4a82-b4c7-e2b99a3dc326) |
| Yllw | [`yllw/`](yllw/) | [style](https://styles.refero.design/style/9483a10e-e098-4f94-ae22-ab5a63702243) |
| Your workplace has the answer. Just ask Dala for it. | [`your-workplace-has-the-answer-just-ask-dala-for-it/`](your-workplace-has-the-answer-just-ask-dala-for-it/) | [style](https://styles.refero.design/style/e5f5f8cf-e68d-4ed1-bbf5-6b67569af648) |
| YouTube | [`youtube/`](youtube/) | [style](https://styles.refero.design/style/8fc58a26-47be-406e-8429-37925551c0ec) |
| Ysl | [`ysl/`](ysl/) | [style](https://styles.refero.design/style/bb2a2b0b-c84e-48ee-9dd9-7b623f81a422) |
| Yuga | [`yuga/`](yuga/) | [style](https://styles.refero.design/style/5f2dd17d-72e6-4aa4-88e6-6be9e41299ab) |
| Yung Studio | [`yung-studio/`](yung-studio/) | [style](https://styles.refero.design/style/2d43b251-ad01-4e59-9068-502457aa0592) |
| Zapier | [`zapier/`](zapier/) | [style](https://styles.refero.design/style/63295283-c1a3-4adb-891a-d1365a47a50b) |
| Zara | [`zara/`](zara/) | [style](https://styles.refero.design/style/97823ba1-ee1e-489d-aefd-8d72a578669a) |
| Zed | [`zed/`](zed/) | [style](https://styles.refero.design/style/a541789c-36e7-45a4-9d1d-143921a82a8b) |
| Zellerfeld | [`zellerfeld/`](zellerfeld/) | [style](https://styles.refero.design/style/a6efcd16-dcd8-435b-9bd6-8c590589b424) |
| Zelt | [`zelt/`](zelt/) | [style](https://styles.refero.design/style/beba80a3-8f10-48fd-9e6c-a3436112f45b) |
| Zendesk | [`zendesk/`](zendesk/) | [style](https://styles.refero.design/style/240234ba-9cf5-4a91-b618-76963551d425) |
| Zeus Jones | [`zeus-jones/`](zeus-jones/) | [style](https://styles.refero.design/style/b619e1b9-86ee-4a10-b6e6-47b10927c3a2) |
| Zipline | [`zipline/`](zipline/) | [style](https://styles.refero.design/style/4a248569-2b5a-4416-bb2a-c78890218b9f) |
| zkPass | [`zkpass/`](zkpass/) | [style](https://styles.refero.design/style/3a398f82-579e-4ec4-a442-9962bf007edf) |
| Zoox | [`zoox/`](zoox/) | [style](https://styles.refero.design/style/e85a82b1-c70e-42de-8c42-4bd95dd5e047) |
| Zora | [`zora/`](zora/) | [style](https://styles.refero.design/style/5c4eb249-fa38-4254-81e0-a32ee22766e2) |

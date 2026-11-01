# love-court: "Love Trial" demo prototype

Demo of the "Love Trial" feature (side content for a dating app), seen from one juror ("me", ME). Everyone else is scripted.

## Language
- English for code, comments, file names and docs. Only on-screen text is Korean, and it lives in SCENARIO CONFIG.
- Internal keys stay English (judge, prosecutor, defender, juror, innocent, protest).

## Project rules
- Single file index.html. No network requests, CDN, packages or font downloads. Fonts: local files in fonts/ only (Galmuri, SIL OFL; fonts/LICENSE.txt stays with them). No emoji: draw shapes in CSS/SVG.
- Change only what was asked; report only the changed file paths when done.
- Never read, print or commit secrets (.env, keys, tokens). Secrets go by environment variable name only.
- Git only when asked: English messages, no secrets, no force push.
- Every visual change goes behind a version switch (`*_V<n>`, false = the previous state); values go in DESIGN CONFIG.

## Direction
- Demo first; a playable multi-user game follows. Scripted parts (NPC lines, NPC votes, auto entry) should sit behind demo-mode flags so real input can replace them. Today only the role card has demo settings (DEMO_PICK_ROLE, DEMO_ALLOWED_ROLES); NPC lines/votes/entry have no flag yet.
- Only the verdict text will call a real AI: key by env var name, needs a server, fallback text on failure. Not hooked up yet (no network code; JUDGMENT_TEXTS are the fallback).

## Decisions
- Case "12-hour no-contact". Options A not guilty / B protest justified. 7 votes, no tie; NPC_VOTES make A win.
- Gauge (stages 6~10): the speaking side rises (GAUGE_LINES per stage + speaker, GAUGE_MODE zero_sum).
- Chat filter is staged only (masked dots, block notice); never real profanity.
- Close-up gavel strikes, verdict stamp (VERDICT_STAMPS), TTS via speechSynthesis ko-KR with timer fallback.

## Stages (STAGES in code: 14 entries, 0~13)
0 role select (logo intro) -> 1 entry -> 2 judge enters -> 3 opening -> 4 case intro -> 5 opening statements -> 6 issue arguments -> 7 closing -> 8 jury discussion (chat) -> 9 chat filter demo -> 10 verdict vote -> 11 verdict reading (close-up) -> 12 reactions + adjournment -> 13 outro (trailer popup / trailer)

## Systems and switches
- Dialogue box, trial log (CHAT_READABILITY_V2, CHAT_PADDING_V22, CHAT_INPUT_PAD_V32), gauge (PIXEL_UI_V29 restyle, GAUGE_SCALE_V30).
- Cut-ins with portraits: CUTIN_PLACEMENT_V20, CUTIN_SOUND_ENABLED. Speaking order: SPEECH_ORDER_V24.
- Furniture/layout: FURNITURE_FIX_V2, BALANCE_FIX_V3, FURNITURE_FIX_V4, STAND_FIX_V5, LAYOUT_FIX_V6, JUROR_RAISE_V7, SEATED_FIX_V9, WALK_FIX_V10, JUDGE_TOPVIEW_V18, PROPS_ENABLED, DOOR_ANIM_ENABLED.
- Nameplates: NAMEPLATE_FIT_V11, NAMEPLATE_SIZE_V12/V13/V15, NAMEPLATE_ADJUST_V21.
- Pixel avatars: AVATAR_V2 (AVATAR_PALETTE, AVATAR_LAYERS). Pixel font: PIXEL_FONT_V28, PIXEL_WEIGHT_V31.
- Role card: ROLE_CARD_V25, ROLE_OPEN_V26, ROLE_CARD_V27, ROLE_NAME_V30. Logo: LOGO_INTRO_ENABLED.
- Trailer: TRAILER_ENABLED, TRAILER_POPUP_ENABLED, TRAILER_AVATAR_V23. Gavel: GAVEL_ENABLED.
- Speaker shots (virtual camera): not built.

## Visuals (images/)
- In use: bg-top.png, bg-front.png, logo.png, prosecutor-point.png, defender-point.png.
- Unused by default: judge-neutral.png (only with JUDGE_USE_PORTRAIT = true).
- Not made: bg-prosecutor, bg-defender. reference/ is never used or committed.

## Branches
- `scenario`: SCENARIO CONFIG and flow only. `design`: DESIGN CONFIG and visuals only. Both merge into `main`.
- Check the current branch before starting; commit before a large change.

## Open items
- Merge design into main (unverified: design is ahead of main since the last merge).
- Verdict AI hookup; real chat filter and anonymization; real-time multi-user play.
- Missing assets (speaker-shot backgrounds); speaker shots.

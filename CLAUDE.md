# love-court: "Love Trial" demo prototype

Demo of the "Love Trial" feature (side content for a dating app), seen from one juror ("me", ME). Everyone else is scripted.

## Versions
Three copies of the page share the root assets (images/, fonts/, sounds/; paths are ../images etc.). Today the three index.html files are identical, and so are the two server/index.js files:
- `demo/`: video recording. Fixed case only, no server (CASE_GENERATION_ENABLED, TEST_PANEL_ENABLED false).
- `single-api/` (+ `server/`): the API version. The server has one route, `/api/generate` (case generation via OpenAI Chat; OPENAI_API_KEY, OPENAI_MODEL in server/.env). CASE_GENERATION_ENABLED is false for now, so it plays like demo.
- `multiplayer/` (+ `server/`): future multi-user play; for now a copy of single-api.
- Root `index.html` and `server/` are the pre-split originals (still hold the old TTS code and `/api/tts`), kept until the user decides to delete them.
- Each `server/` needs its own `.env` (not copied); both servers default to port 8787, so run one at a time.

## Language
- English for code, comments, file names and docs. Only on-screen text is Korean, and it lives in SCENARIO CONFIG.
- Internal keys stay English (judge, prosecutor, defender, juror, innocent, protest).

## Project rules
- Single file index.html. No CDN, packages or font downloads. Fonts: local files in fonts/ only (Galmuri, SIL OFL; fonts/LICENSE.txt stays with them). No emoji: draw shapes in CSS/SVG.
- Network: only local. The page fetches ../sounds for loudness matching and gavel onset (needs http://; on file:// it falls back to SFX_VOLUME and GAVEL_ONSET_MS_FALLBACK), and calls the local server only when CASE_GENERATION_ENABLED or TEST_PANEL_ENABLED is on.
- Change only what was asked; report only the changed file paths when done.
- Never read, print or commit secrets (.env, keys, tokens). Secrets go by environment variable name only.
- Git only when asked: English messages, no secrets, no force push.
- Every visual change goes behind a version switch (`*_V<n>`, false = the previous state); values go in DESIGN CONFIG.

## Direction
- Demo first; a playable multi-user game follows. Scripted parts (NPC lines, NPC votes, auto entry) should sit behind demo-mode flags so real input can replace them. Today only the role card has demo settings (DEMO_PICK_ROLE, DEMO_ALLOWED_ROLES); NPC lines/votes/entry have no flag yet.
- AI calls go through the server (key by env var name), with fallback on failure. Case generation is hooked up (CASE_GENERATION_URL, applyGeneratedCase; falls back to the fixed case). Verdict text is not (JUDGMENT_TEXTS are the fallback).

## Decisions
- Case "12-hour no-contact". Options A not guilty / B protest justified. 7 votes, no tie; NPC_VOTES make A win.
- Jurors j1~j7: 이창식 (me), 한가람, 최강두, 김정식, 제임스, 올리비아, 강주미.
- Gauge (stages 6~10): the speaking side rises (GAUGE_LINES per stage + speaker, GAUGE_MODE zero_sum).
- Chat filter is staged only (masked dots, block notice); never real profanity. It stays in stage 8/9 (jury discussion), never from the vote on.
- Close-up gavel strikes, verdict stamp (VERDICT_STAMPS).
- No TTS: lines are silent and hold LINE_HOLD_AFTER_TYPING_MS after typing. Only the advocates' cut-in shouts are voiced, with pre-made recordings (CUTIN_VOICE_FILES; issue 1/2 x prosecutor/defender). New voice lines follow the same pattern: a file in sounds/ plus a mapping.

## Stages (STAGES in code: 14 entries, 0~13)
0 role select (logo intro) -> 1 entry -> 2 judge enters -> 3 opening -> 4 case intro -> 5 opening statements -> 6 issue arguments -> 7 closing -> 8 jury discussion (chat) -> 9 chat filter demo -> 10 verdict vote -> 11 verdict reading (close-up) -> 12 reactions + adjournment -> 13 outro (trailer popup / trailer)

## Systems and switches
- Dialogue box, trial log (CHAT_READABILITY_V2, CHAT_PADDING_V22, CHAT_INPUT_PAD_V32), gauge (PIXEL_UI_V29 restyle, GAUGE_SCALE_V30).
- Cut-ins with portraits: CUTIN_PLACEMENT_V20, CUTIN_SOUND_ENABLED, CUTIN_SPEECH_INDEXES; recorded shouts CUTIN_VOICE_FILES (CUTIN_VOICE_DELAY_MS, CUTIN_VOICE_VOLUME). Speaking order: SPEECH_ORDER_V24.
- Sound effects: SOUND_FX_ENABLED, SFX_VOLUME. Loudness match to alien.mp3: SFX_MATCH_ALIEN, SFX_MAX_GAIN. Gavel clip from its first strike: GAVEL_ONSET_THRESHOLD, GAVEL_PREROLL_MS, GAVEL_CLIP_MS. Crowd noise in stages 0~1, fades from stage 2 (NOISE, NOISE_FADE_MS). Keyboard while chat types (stage 8), warning in the filter demo, alien blip on advocate lines (ALIEN_BLIP_MS), trailer alien/cat (TRAILER_SFX_SWITCH_LINE).
- Furniture/layout: FURNITURE_FIX_V2, BALANCE_FIX_V3, FURNITURE_FIX_V4, STAND_FIX_V5, LAYOUT_FIX_V6, JUROR_RAISE_V7, SEATED_FIX_V9, WALK_FIX_V10, JUDGE_TOPVIEW_V18, PROPS_ENABLED, DOOR_ANIM_ENABLED.
- Nameplates: NAMEPLATE_FIT_V11, NAMEPLATE_SIZE_V12/V13/V15, NAMEPLATE_ADJUST_V21. Juror name labels: JUROR_LABEL_V33 (JUROR_LABEL_FONT_SCALE_V33, JUROR_SPREAD_V33).
- Pixel avatars: AVATAR_V2 (AVATAR_PALETTE, AVATAR_LAYERS). Pixel font: PIXEL_FONT_V28, PIXEL_WEIGHT_V31.
- Role card: ROLE_CARD_V25, ROLE_OPEN_V26, ROLE_CARD_V27, ROLE_NAME_V30. Logo: LOGO_INTRO_ENABLED.
- Trailer: TRAILER_ENABLED, TRAILER_POPUP_ENABLED, TRAILER_AVATAR_V23. Gavel: GAVEL_ENABLED.
- Server hooks (off): CASE_GENERATION_ENABLED, TEST_PANEL_ENABLED (temporary test panel, block at the end of the script). Console logs: DEBUG_LOG.
- Speaker shots (virtual camera): not built.

## Assets
- images/ in use: bg-top.png, bg-front.png, logo.png, prosecutor-point.png, defender-point.png. Unused by default: judge-neutral.png (only with JUDGE_USE_PORTRAIT = true). Not made: bg-prosecutor, bg-defender.
- sounds/: user-supplied effects and cut-in recordings. Unused: people-noise-background.mp3.
- reference/ is never used or committed.

## Branches
- `scenario`: SCENARIO CONFIG and flow only. `design`: DESIGN CONFIG and visuals only. Both merge into `main`.
- `server`: version split, server and sound work; main was fast-forwarded to it.
- Check the current branch before starting; commit before a large change.

## Open items
- Browser check not done yet: sound timing and levels, gavel onset, cut-in voice order, juror label overlap.
- Servers: app.listen ignores its error (port in use still logs success and exits 0).
- Decide: delete root index.html and server/; remove demo-only temp code (test panel); commit the .env.example files after a manual check.
- Verdict AI hookup; real chat filter and anonymization; real-time multi-user play.
- Missing assets (speaker-shot backgrounds); speaker shots.

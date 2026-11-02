# love-court: "Love Trial" demo prototype

Demo of the "Love Trial" feature (side content for a dating app), seen from one juror ("me", ME). Everyone else is scripted.

## Scope
- One file: root `index.html`, the scripted demo for presentation (assets in images/, fonts/, sounds/). No server and no real-time multi-user play are planned for now.
- The demo/, single-api/, multiplayer/ and server/ folders were removed (history in git, last at commit 3b39952).

## Language
- English for code, comments, file names and docs. Only on-screen text is Korean, and it lives in SCENARIO CONFIG.
- Internal keys stay English (judge, prosecutor, defender, juror, innocent, protest).

## Project rules
- Single file index.html. No CDN, packages or font downloads. Fonts: local files in fonts/ only (Galmuri, SIL OFL; fonts/LICENSE.txt stays with them). No emoji: draw shapes in CSS/SVG.
- Network: none beyond the page's own files. It fetches sounds/ for loudness matching and gavel onset (needs http://; on file:// it falls back to SFX_VOLUME and GAVEL_ONSET_MS_FALLBACK).
- Change only what was asked; report only the changed file paths when done.
- Never read, print or commit secrets (.env, keys, tokens). Secrets go by environment variable name only.
- Git only when asked: English messages, no secrets, no force push.
- Every visual change goes behind a version switch (`*_V<n>`, false = the previous state); values go in DESIGN CONFIG.

## Direction
- Presentation demo only; a multi-user game is not planned for now. Demo settings exist only for the role card (DEMO_PICK_ROLE, DEMO_ALLOWED_ROLES).
- All content is scripted (fixed case, JUDGMENT_TEXTS). No AI calls; the case-generation and test-panel code was removed with the server.

## Decisions
- Case "12-hour no-contact". Options A not guilty / B protest justified. 7 votes, no tie; NPC_VOTES make A win.
- Jurors j1~j7: 이창식 (me), 한가람, 최강두, 김정식, 제임스, 올리비아, 강주미.
- Gauge (stages 6~10): the speaking side rises (GAUGE_LINES per stage + speaker, GAUGE_MODE zero_sum).
- Chat filter is staged only (masked dots, block notice); never real profanity. It stays in stage 8/9 (jury discussion), never from the vote on.
- Close-up gavel strikes, verdict stamp (VERDICT_STAMPS).
- No TTS: voiced lines are pre-made recordings in sounds/. Judge lines by stage (JUDGE_VOICE_FILES: 3, 4, 7, 11, 12; the stage waits for the audio, stage 11 paces the verdict text to it) and the advocates' cut-in shouts (CUTIN_VOICE_FILES). Other lines are silent and hold LINE_HOLD_AFTER_TYPING_MS after typing.

## Stages (STAGES in code: 14 entries, 0~13)
0 role select (logo intro) -> 1 entry -> 2 judge enters -> 3 opening -> 4 case intro -> 5 opening statements -> 6 issue arguments -> 7 closing -> 8 jury discussion (chat) -> 9 chat filter demo -> 10 verdict vote -> 11 verdict reading (close-up) -> 12 reactions + adjournment -> 13 outro (trailer popup / trailer)

## Systems and switches
- Dialogue box, trial log (CHAT_READABILITY_V2, CHAT_PADDING_V22, CHAT_INPUT_PAD_V32), gauge (PIXEL_UI_V29 restyle, GAUGE_SCALE_V30).
- Cut-ins with portraits: CUTIN_PLACEMENT_V20, CUTIN_SOUND_ENABLED, CUTIN_SPEECH_INDEXES, CUTIN_PORTRAIT_V34 (issue 1 uses prosecutor.png / defender.png); recorded shouts CUTIN_VOICE_FILES (CUTIN_VOICE_DELAY_MS, CUTIN_VOICE_VOLUME). Speaking order: SPEECH_ORDER_V24.
- Sound effects: SOUND_FX_ENABLED, SFX_VOLUME. Loudness match to alien.mp3: SFX_MATCH_ALIEN, SFX_MAX_GAIN. Gavel clip from its first strike: GAVEL_ONSET_THRESHOLD, GAVEL_PREROLL_MS, GAVEL_CLIP_MS. Crowd noise in stages 0~1, fades from stage 2 (NOISE, NOISE_FADE_MS). Keyboard while chat types (stage 8), warning in the filter demo, ping when all 7 votes are in, alien blip on advocate lines (ALIEN_BLIP_MS), trailer alien/cat (TRAILER_SFX_SWITCH_LINE).
- Furniture/layout: FURNITURE_FIX_V2, BALANCE_FIX_V3, FURNITURE_FIX_V4, STAND_FIX_V5, LAYOUT_FIX_V6, JUROR_RAISE_V7, SEATED_FIX_V9, WALK_FIX_V10, JUDGE_TOPVIEW_V18, PROPS_ENABLED, DOOR_ANIM_ENABLED.
- Nameplates: NAMEPLATE_FIT_V11, NAMEPLATE_SIZE_V12/V13/V15, NAMEPLATE_ADJUST_V21. Juror name labels: JUROR_LABEL_V33 (JUROR_LABEL_FONT_SCALE_V33, JUROR_SPREAD_V33).
- Pixel avatars: AVATAR_V2 (AVATAR_PALETTE, AVATAR_LAYERS). Pixel font: PIXEL_FONT_V28, PIXEL_WEIGHT_V31.
- Role card: ROLE_CARD_V25, ROLE_OPEN_V26, ROLE_CARD_V27, ROLE_NAME_V30. Logo: LOGO_INTRO_ENABLED.
- Trailer: TRAILER_ENABLED, TRAILER_POPUP_ENABLED, TRAILER_AVATAR_V23. Gavel: GAVEL_ENABLED.
- Vote mark over juror heads: VOTE_MARK_V35 (VOTE_MARK_STYLE_V35). Console logs: DEBUG_LOG.
- Speaker shots (virtual camera): not built.

## Assets
- images/ in use: bg-top.png, bg-front.png, logo.png, prosecutor-point.png, defender-point.png, prosecutor.png, defender.png. judge-neutral.png was removed (JUDGE_USE_PORTRAIT = true now falls back to the pixel judge). Not made: bg-prosecutor, bg-defender.
- sounds/: user-supplied effects and voice recordings; all are in use.
- reference/ (if recreated) is never used or committed.

## Branches
- `main` only (scenario, design and server were merged and deleted). Commit before a large change.

## Open items
- Advocates' regular lines have no recordings yet (only their cut-in shouts are voiced).
- Before recording the video: DEBUG_LOG false, open over http://.
- Missing assets (speaker-shot backgrounds); speaker shots.

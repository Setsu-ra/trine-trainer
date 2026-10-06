'use strict';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const sideStartButton = document.getElementById('sideStartButton');
const overlay = document.getElementById('resultOverlay');
const resultTitle = document.getElementById('resultTitle');
const resultReason = document.getElementById('resultReason');
const retryButton = document.getElementById('retryButton');
const replayButton = document.getElementById('replayButton');
const sideReplayButton = document.getElementById('sideReplayButton');
const castBar = document.getElementById('castBar');
const castBarFill = document.getElementById('castBarFill');
const castBarLabel = document.getElementById('castBarLabel');
const phaseText = document.getElementById('phaseText');
const timeText = document.getElementById('timeText');
const patternText = document.getElementById('patternText');
const distanceText = document.getElementById('distanceText');
const npcText = document.getElementById('npcText');
const roleButtons = Array.from(document.querySelectorAll('#roleSelector button[data-role]'));
const slotSetting = document.getElementById('slotSetting');
const slotSelector = document.getElementById('slotSelector');
const hitboxToggle = document.getElementById('hitboxToggle');
const tankTargetToggle = document.getElementById('tankTargetToggle');
const markerToggle = document.getElementById('markerToggle');
const manualTrineToggle = document.getElementById('manualTrineToggle');
const manualTrineSetting = document.getElementById('manualTrineSetting');
const manualTrinePattern = document.getElementById('manualTrinePattern');
const manualTrineNote = document.getElementById('manualTrineNote');
const dualArmRampageToggle = document.getElementById('dualArmRampageToggle');
const trineWingOnlyToggle = document.getElementById('trineWingOnlyToggle');
const soilButton = document.getElementById('soilButton');
const actionPanel = document.getElementById('actionPanel');
const action1Label = document.getElementById('action1Label');
const action2Label = document.getElementById('action2Label');
const action1State = document.getElementById('action1State');
const action2State = document.getElementById('action2State');
const gateState = document.getElementById('gateState');
const hotbar = document.getElementById('hotbar');
const hotbarSlots = [1,2,3].map(i => document.getElementById(`hotbarSlot${i}`));
const hotbarNote = document.getElementById('hotbarNote');

const FIELD = { x: 400, y: 400, radius: 363, radiusYalms: 22 };
const PX_PER_YALM = FIELD.radius / FIELD.radiusYalms;
const PLAYER_RADIUS = 11;
const PLAYER_HIT_RADIUS_YALMS = 0.4;
const PLAYER_HIT_RADIUS = PLAYER_HIT_RADIUS_YALMS * PX_PER_YALM;
const NPC_RADIUS = PLAYER_RADIUS;
const MOVE_SPEED = 185;
const NPC_SPEED = 145;
const AFTERMATH_DEPARTURE_TIME = 10.65; // ②着弾後、③着弾に間に合うタイミングで移動開始
const AFTERMATH_ARRIVAL_TIME = 12.46; // 全NPCは③着弾の約0.04秒前に到着
const CENTRAL_WAIT_SPEED = 34; // 中央付近でのゆっくりした待機移動
const SOIL_DURATION_SECONDS = 15;
const SOIL_BUFF_DURATION_SECONDS = 5;
const SOIL_BUFF_REFRESH_INTERVAL_SECONDS = 3;
const TRINE_SIDE = 10 * PX_PER_YALM;
const TRINE_AOE_RADIUS_YALMS = 6.5;
const TRINE_AOE_RADIUS = TRINE_AOE_RADIUS_YALMS * PX_PER_YALM;
const TANK_WING_AOE_RADIUS_YALMS = 8.0;
const TANK_WING_AOE_RADIUS = TANK_WING_AOE_RADIUS_YALMS * PX_PER_YALM;
const START_OFFSET_YALMS = 2.5;
const DPS_HEALER_STACK_RADIUS_YALMS = 14.0;
const DPS_HEALER_STACK_RADIUS_TOLERANCE = 0.35;
const DISTANCE_REFERENCE_YALMS = 15; // 陣の半径を距離換算の基準にする
const SOIL_RADIUS_YALMS = DISTANCE_REFERENCE_YALMS;
const SOIL_RADIUS = SOIL_RADIUS_YALMS * PX_PER_YALM;
const D1_COOLDOWN_SECONDS = 10;
const D1_BACKSTEP_DISTANCE_YALMS = DISTANCE_REFERENCE_YALMS * (2 / 3); // 10m
const D1_DASH_MAX_RANGE_YALMS = 20;
const D1_BACKSTEP_MAX_BOSS_DISTANCE_YALMS = 5;
const D2_SHARED_COOLDOWN_SECONDS = 20;
const D2_MOVE_DISTANCE_YALMS = DISTANCE_REFERENCE_YALMS; // 15m
const D2_GATE_DURATION_SECONDS = 10;
const D2_SHUKUCHI_COOLDOWN_SECONDS = 60;
const D2_SHUKUCHI_MAX_STACKS = 2;
const D2_SHUKUCHI_MAX_RANGE_YALMS = 20;
const DASH_DURATION_SECONDS = 0.18;
const BOSS_DASH_STOP_DISTANCE_YALMS = 8.85; // ターゲットサークル外周のわずか手前（中心距離）
const H1_COOLDOWN_SECONDS = 60;
const H1_FORWARD_DISTANCE_YALMS = 15;
const H1_WHEEL_RADIUS_YALMS = 8;
const H1_WHEEL_BUFF_RANGE_YALMS = 30;
const H1_WHEEL_BUFF_DURATION_SECONDS = 10;
const H1_STAR_DURATION_SECONDS = 20;
const H1_STAR_RADIUS_YALMS = 30;
const H2_KERACHOLE_COOLDOWN_SECONDS = 30;
const H2_KERACHOLE_RANGE_YALMS = 30;
const H2_KERACHOLE_BUFF_DURATION_SECONDS = 15;
const MT_DASH_COOLDOWN_SECONDS = 30;
const MT_DASH_MAX_STACKS = 2;
const D3_DASH_COOLDOWN_SECONDS = 30;
const D3_DASH_MAX_STACKS = 3;
const D3_FORWARD_DISTANCE_YALMS = 10;
const D4_SMUDGE_COOLDOWN_SECONDS = 30;
const D4_SMUDGE_DISTANCE_YALMS = 15;
const D4_SMUDGE_BUFF_DURATION_SECONDS = 5;
const D4_SMUDGE_SPEED_BONUS_YALMS_PER_SECOND = 1;
const D4_LEYLINES_COOLDOWN_SECONDS = 120;
const D4_RETURN_COOLDOWN_SECONDS = 3;
const D4_RETURN_MAX_RANGE_YALMS = 25;
const D4_LEYLINES_DURATION_SECONDS = 20;
const D4_LEYLINES_RADIUS_YALMS = 3;
const STACK_SHARE_CAST_DELAY_SECONDS = 1;
const STACK_SHARE_CAST_DURATION_SECONDS = 5;
const STACK_SHARE_RADIUS_YALMS = 8;
const ST_FOLLOW_MAX_DISTANCE_YALMS = 5;
const ST_FOLLOW_TARGET_DISTANCE_YALMS = 2.0;
const STACK_SHARE_RADIUS = STACK_SHARE_RADIUS_YALMS * PX_PER_YALM;
const BOSS_BOSS_TARGET_CIRCLE_RADIUS_YALMS = 8; // 床模様の中心から3本目（4m, 6m, 8m）
const BOSS_TARGET_CIRCLE_RADIUS = BOSS_BOSS_TARGET_CIRCLE_RADIUS_YALMS * PX_PER_YALM;
const keys = new Set();
let selectedRole = 'MT';
let selectedSlot = 'MT';
let lastFrame = performance.now();
let lastReplayData = null;
let showHitboxes = true;
let showTankTargets = false;
let showMarkers = true;
let soilPointer = null;
let shukuchiPointer = null;
let lastCanvasPointer = { x: FIELD.x, y: FIELD.y };
let manualTrineEnabled = false;
let selectedManualTrinePattern = '0,1,2';
let dualArmRampageEnabled = false;
let trineWingOnlyEnabled = false;

const markerOrder = ['A', '2', 'B', '3', 'C', '4', 'D', '1'];
const markerColors = {
  A:'#ff665f', B:'#ffd84f', C:'#55a4ff', D:'#a56aff',
  '1':'#ff665f', '2':'#ffd84f', '3':'#55a4ff', '4':'#a56aff'
};
const partyRoster = [
  { id:'MT', label:'MT', color:'#78d7ff' },
  { id:'ST', label:'ST', color:'#78d7ff' },
  { id:'H1', label:'H1', color:'#72e8a2' },
  { id:'H2', label:'H2', color:'#72e8a2' },
  { id:'D1', label:'D1', color:'#ff8290' },
  { id:'D2', label:'D2', color:'#ff8290' },
  { id:'D3', label:'D3', color:'#ff8290' },
  { id:'D4', label:'D4', color:'#ff8290' }
];

function yalmsToPoint(xY, yY) {
  return { x: FIELD.x + xY * PX_PER_YALM, y: FIELD.y + yY * PX_PER_YALM };
}

function getStartPosition(role) {
  return yalmsToPoint(0, role === 'MT' ? -START_OFFSET_YALMS : START_OFFSET_YALMS);
}

function controlledPartyId() {
  return selectedSlot;
}

function canPlaceSoil() {
  return selectedSlot === 'H2' && !game.replayMode;
}

function updateSoilButtonState() {
  soilButton.disabled = !canPlaceSoil();
  soilButton.textContent = game.soilPlacementMode
    ? '設置場所をクリック（1でキャンセル）'
    : '陣を手動設置（1）';
  soilButton.classList.toggle('active-placement', Boolean(game.soilPlacementMode));
}

function cancelSoilPlacement() {
  game.soilPlacementMode = false;
  soilPointer = null;
  cancelD2ShukuchiPlacement();
  updateSoilButtonState();
}

function beginSoilPlacement() {
  if (!canPlaceSoil()) return;
  game.soilPlacementMode = !game.soilPlacementMode;
  if (game.soilPlacementMode) {
    // マウスを動かさなくても再入力直後からプレビューを表示する。
    soilPointer = { ...lastCanvasPointer };
  } else {
    soilPointer = null;
  }
  updateSoilButtonState();
}

function getLivePartyParticipants() {
  return [
    { id: controlledPartyId(), x: game.player.x, y: game.player.y, isPlayer: true },
    ...game.npcs.map(npc => ({ id: npc.id, x: npc.x, y: npc.y, isPlayer: false }))
  ];
}

function applySoilBuffPulse() {
  if (!game.soil) return;
  for (const member of getLivePartyParticipants()) {
    const inside = Math.hypot(member.x - game.soil.x, member.y - game.soil.y) <= game.soil.radius + PLAYER_HIT_RADIUS;
    if (inside) game.soilBuffs[member.id] = game.elapsed + SOIL_BUFF_DURATION_SECONDS;
  }
}

function createSoil(x, y) {
  game.soil = {
    x, y,
    radius: SOIL_RADIUS,
    placedAt: game.elapsed,
    expiresAt: game.elapsed + SOIL_DURATION_SECONDS,
    nextBuffRefreshAt: game.elapsed + SOIL_BUFF_REFRESH_INTERVAL_SECONDS
  };
  applySoilBuffPulse();
}

function placeSoilAt(x, y) {
  if (!canPlaceSoil()) return;
  createSoil(x, y);
  cancelSoilPlacement();
}

function placeSoilAtBoss() {
  if (!canPlaceSoil()) return;
  createSoil(FIELD.x, FIELD.y);
  cancelSoilPlacement();
}

function canvasPointFromPointer(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height
  };
}

function slotOptionsForRole(role) {
  if (role === 'DPS') return ['D1','D2','D3','D4'];
  if (role === 'HEALER') return ['H1','H2'];
  return [role];
}

function renderSlotSelector() {
  const options = slotOptionsForRole(selectedRole);
  if (!options.includes(selectedSlot)) selectedSlot = options[0];
  slotSelector.replaceChildren(...options.map(id => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.slot = id;
    button.textContent = id;
    button.classList.toggle('active', id === selectedSlot);
    button.disabled = game.running;
    return button;
  }));
  slotSetting.classList.toggle('hidden', options.length === 1);
}

const game = {
  running: false,
  finished: false,
  elapsed: 0,
  player: getStartPosition('MT'),
  wingSide: 'left',
  rotationStep: 0,
  centerPattern: 0,
  outerLayout: null,
  trineGroups: [],
  events: [],
  activeAoEs: [],
  telegraphWing: false,
  wingCastStart: null,
  wingCastEnd: null,
  castType: null,
  tankWingTargets: [],
  stackShareTargetId: 'MT',
  stackShareMarker: false,
  mtStackIntrude: false,
  mtStackIntrudeDepthYalms: 0,
  visibleTrines: [],
  phase: '待機中',
  npcs: [],
  npcState: '待機',
  bossPulse: 0,
  timelineStep: '待機',
  failureReasons: [],
  replayMode: false,
  replayFrames: [],
  replayCursor: 0,
  recordingFrames: [],
  runConfig: null,
  soil: null,
  soilPlacementMode: false,
  soilBuffs: {},
  dash: null,
  d1CooldownUntil: { 1: 0, 2: 0 },
  d2CooldownUntil: 0,
  d2Gate: null,
  d2ShukuchiRechargeEnds: [],
  d2ShukuchiPlacementMode: false,
  actionMessage: '',
  actionMessageUntil: 0,
  h1CooldownUntil: { 1: 0, 2: 0, 3: 0 },
  h1Wheel: null,
  h1Star: null,
  h1StarFlashUntil: 0,
  h2KeracholeCooldownUntil: 0,
  h2KeracholeFlashUntil: 0,
  roleBuffs: {},
  mtDashRechargeEnds: [],
  stDashRechargeEnds: [],
  d3DashRechargeEnds: [],
  d4SmudgeCooldownUntil: 0,
  d4SpeedBuffUntil: 0,
  d4LeyLinesCooldownUntil: 0,
  d4ReturnCooldownUntil: 0,
  d4LeyLines: null,
  stackRetreatTriggered: false,
  stackShareMtTarget: null,
  stackShareMtPattern: 'northOutside',
  stackShareStPattern: 'followMT',
  dualArmRampageMode: false,
  stackTankNormalSetup: false,
  stackIntruderId: null,
  stackIntruderVariant: null,
  stackIntruderStartOffset: null,
  stackIntruderTriggered: false,
  stackEscapeTriggered: false,
  stackIntruderWheel: null,
  stackNorthIntrusionHandled: false,
  stackNorthRetreatTriggered: false,
  stackSouthRetreatStartOffset: null,
  stackSouthRetreatTriggered: false,
  stackEmergencyRunTriggered: false,
  stackRescueTriggered: false,
  stackRescueHealerId: null,
  stackRescueTargetId: null,
  stackRescueOrigin: null,
  stackRescuedHoldId: null,
  stackRescuedHoldPoint: null,
  stackRescuePartnerHoldId: null,
  stackRescuePartnerHoldPoint: null,
  stackRetreatTargets: {},
  mtDashLandingPoint: null,
  stDashLandingPoint: null,
  runtimeErrorMessage: ''
};


function isMT() { return selectedSlot === 'MT'; }
function isST() { return selectedSlot === 'ST'; }
function isTankPracticeSelected() { return selectedSlot === 'MT' || selectedSlot === 'ST'; }
function isD1() { return selectedSlot === 'D1'; }
function isD2() { return selectedSlot === 'D2'; }
function isD3() { return selectedSlot === 'D3'; }
function isD4() { return selectedSlot === 'D4'; }

function secondsRemaining(until) {
  return Math.max(0, until - game.elapsed);
}

function startDashTo(x, y, duration = DASH_DURATION_SECONDS) {
  if (!game.running || game.replayMode || game.dash) return false;
  game.dash = {
    fromX: game.player.x,
    fromY: game.player.y,
    toX: x,
    toY: y,
    startAt: game.elapsed,
    endAt: game.elapsed + duration
  };
  const dx = x - game.player.x;
  const dy = y - game.player.y;
  if (Math.hypot(dx, dy) > 0.01) game.player.facing = Math.atan2(dy, dx);
  return true;
}

function setActionMessage(message, duration = 1.8) {
  game.actionMessage = message;
  game.actionMessageUntil = game.elapsed + duration;
}


function availableStacks(rechargeEnds, maxStacks) {
  return Math.max(0, maxStacks - rechargeEnds.filter(end => end > game.elapsed).length);
}

function consumeStack(rechargeEnds, cooldownSeconds, maxStacks) {
  while (rechargeEnds.length && rechargeEnds[0] <= game.elapsed) rechargeEnds.shift();
  if (availableStacks(rechargeEnds, maxStacks) <= 0) return false;
  const base = rechargeEnds.length ? Math.max(game.elapsed, rechargeEnds[rechargeEnds.length - 1]) : game.elapsed;
  rechargeEnds.push(base + cooldownSeconds);
  return true;
}

function nextStackRemaining(rechargeEnds) {
  while (rechargeEnds.length && rechargeEnds[0] <= game.elapsed) rechargeEnds.shift();
  return rechargeEnds.length ? Math.max(0, rechargeEnds[0] - game.elapsed) : 0;
}

function dashToBossWithRange(maxRangeYalms) {
  const bossDistanceYalms = Math.hypot(game.player.x - FIELD.x, game.player.y - FIELD.y) / PX_PER_YALM;
  if (bossDistanceYalms > maxRangeYalms) {
    setActionMessage(`突進不可：ボスから${maxRangeYalms}m以内で使用できます`);
    return false;
  }
  const dx = game.player.x - FIELD.x;
  const dy = game.player.y - FIELD.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 0.01) return false;
  const stop = BOSS_DASH_STOP_DISTANCE_YALMS * PX_PER_YALM;
  const targetDistance = Math.min(distance, stop);
  return startDashTo(FIELD.x + dx / distance * targetDistance, FIELD.y + dy / distance * targetDistance);
}

function useMTAction(keyNumber) {
  if (!isMT() || keyNumber !== 1 || !game.running || game.replayMode || game.dash) return;
  if (availableStacks(game.mtDashRechargeEnds, MT_DASH_MAX_STACKS) <= 0) return;
  if (!dashToBossWithRange(D1_DASH_MAX_RANGE_YALMS)) return;
  consumeStack(game.mtDashRechargeEnds, MT_DASH_COOLDOWN_SECONDS, MT_DASH_MAX_STACKS);
  setActionMessage('MT：ボスへ突進');
}

function useSTAction(keyNumber) {
  if (!isST() || keyNumber !== 1 || !game.running || game.replayMode || game.dash) return;
  if (availableStacks(game.stDashRechargeEnds, MT_DASH_MAX_STACKS) <= 0) return;
  if (!dashToBossWithRange(D1_DASH_MAX_RANGE_YALMS)) return;
  consumeStack(game.stDashRechargeEnds, MT_DASH_COOLDOWN_SECONDS, MT_DASH_MAX_STACKS);
  setActionMessage('ST：ボスへ突進');
}

function useD3Action(keyNumber) {
  if (!isD3() || keyNumber !== 1 || !game.running || game.replayMode || game.dash) return;
  if (availableStacks(game.d3DashRechargeEnds, D3_DASH_MAX_STACKS) <= 0) return;
  const distance = D3_FORWARD_DISTANCE_YALMS * PX_PER_YALM;
  const tx = game.player.x + Math.cos(game.player.facing) * distance;
  const ty = game.player.y + Math.sin(game.player.facing) * distance;
  if (!startDashTo(tx, ty)) return;
  consumeStack(game.d3DashRechargeEnds, D3_DASH_COOLDOWN_SECONDS, D3_DASH_MAX_STACKS);
  setActionMessage('D3：前方へ10m移動');
}

function useD4Action(keyNumber) {
  if (!isD4() || !game.running || game.replayMode || game.dash) return;
  if (keyNumber === 1) {
    if (secondsRemaining(game.d4SmudgeCooldownUntil) > 0) return;
    const distance = D4_SMUDGE_DISTANCE_YALMS * PX_PER_YALM;
    const tx = game.player.x + Math.cos(game.player.facing) * distance;
    const ty = game.player.y + Math.sin(game.player.facing) * distance;
    if (startDashTo(tx, ty)) {
      game.d4SmudgeCooldownUntil = game.elapsed + D4_SMUDGE_COOLDOWN_SECONDS;
      game.d4SpeedBuffUntil = game.elapsed + D4_SMUDGE_BUFF_DURATION_SECONDS;
      setActionMessage('スマッジ：前方15m＋移動速度上昇');
    }
  } else if (keyNumber === 2) {
    if (secondsRemaining(game.d4LeyLinesCooldownUntil) > 0) return;
    game.d4LeyLines = { x: game.player.x, y: game.player.y, placedAt: game.elapsed, expiresAt: game.elapsed + D4_LEYLINES_DURATION_SECONDS, radius: D4_LEYLINES_RADIUS_YALMS * PX_PER_YALM };
    game.d4LeyLinesCooldownUntil = game.elapsed + D4_LEYLINES_COOLDOWN_SECONDS;
    setActionMessage('魔紋を足元に設置');
  } else if (keyNumber === 3) {
    if (!game.d4LeyLines) {
      setActionMessage('魔紋が設置されていません');
      return;
    }
    if (secondsRemaining(game.d4ReturnCooldownUntil) > 0) return;
    const distanceYalms = Math.hypot(game.player.x - game.d4LeyLines.x, game.player.y - game.d4LeyLines.y) / PX_PER_YALM;
    if (distanceYalms > D4_RETURN_MAX_RANGE_YALMS) {
      setActionMessage('魔紋から25m以内で使用できます');
      return;
    }
    if (startDashTo(game.d4LeyLines.x, game.d4LeyLines.y, 0.12)) {
      game.d4ReturnCooldownUntil = game.elapsed + D4_RETURN_COOLDOWN_SECONDS;
      setActionMessage('魔紋の中心へ移動');
    }
  }
}

function useD1Action(keyNumber) {
  if (!isD1() || !game.running || game.replayMode || game.dash) return;
  if (secondsRemaining(game.d1CooldownUntil[keyNumber]) > 0) return;
  const bossDistanceYalms = Math.hypot(game.player.x - FIELD.x, game.player.y - FIELD.y) / PX_PER_YALM;
  if (keyNumber === 1) {
    if (bossDistanceYalms > D1_DASH_MAX_RANGE_YALMS) {
      setActionMessage('突進不可：ボスから20m以内で使用できます');
      return;
    }
    if (dashToBossWithRange(D1_DASH_MAX_RANGE_YALMS)) {
      game.d1CooldownUntil[1] = game.elapsed + D1_COOLDOWN_SECONDS;
      setActionMessage('ボスへ突進');
    }
  } else {
    if (bossDistanceYalms > D1_BACKSTEP_MAX_BOSS_DISTANCE_YALMS) {
      setActionMessage('後方移動不可：ボスから5m以内で使用できます');
      return;
    }
    const distance = D1_BACKSTEP_DISTANCE_YALMS * PX_PER_YALM;
    const tx = game.player.x - Math.cos(game.player.facing) * distance;
    const ty = game.player.y - Math.sin(game.player.facing) * distance;
    if (startDashTo(tx, ty)) {
      game.d1CooldownUntil[2] = game.elapsed + D1_COOLDOWN_SECONDS;
      setActionMessage('後方へ10m移動');
    }
  }
}

function clearD2Gate() {
  game.d2Gate = null;
  game.h1CooldownUntil = { 1: 0, 2: 0, 3: 0 };
  game.h1Wheel = null;
  game.h1Star = null;
  game.h1StarFlashUntil = 0;
  game.h2KeracholeCooldownUntil = 0;
  game.h2KeracholeFlashUntil = 0;
  game.roleBuffs = {};
}

function returnToD2Gate() {
  if (!game.d2Gate || game.replayMode || !game.running) return;
  game.player.x = game.d2Gate.x;
  game.player.y = game.d2Gate.y;
  game.dash = null;
  clearD2Gate();
}


function cancelD2ShukuchiPlacement() {
  game.d2ShukuchiPlacementMode = false;
  shukuchiPointer = null;
}

function toggleD2ShukuchiPlacement() {
  if (!isD2() || !game.running || game.replayMode || game.dash) return;
  if (availableStacks(game.d2ShukuchiRechargeEnds, D2_SHUKUCHI_MAX_STACKS) <= 0) {
    setActionMessage('縮地：スタックがありません');
    return;
  }
  game.d2ShukuchiPlacementMode = !game.d2ShukuchiPlacementMode;
  shukuchiPointer = game.d2ShukuchiPlacementMode ? { ...lastCanvasPointer } : null;
}

function useD2ShukuchiAt(x, y) {
  if (!isD2() || !game.running || game.replayMode || !game.d2ShukuchiPlacementMode) return false;
  const distanceFromPlayer = Math.hypot(x - game.player.x, y - game.player.y) / PX_PER_YALM;
  const distanceFromField = Math.hypot(x - FIELD.x, y - FIELD.y);
  if (distanceFromPlayer > D2_SHUKUCHI_MAX_RANGE_YALMS || distanceFromField + PLAYER_HIT_RADIUS > FIELD.radius) {
    setActionMessage('縮地：自身から20m以内の場内を指定してください');
    return false;
  }
  if (!consumeStack(game.d2ShukuchiRechargeEnds, D2_SHUKUCHI_COOLDOWN_SECONDS, D2_SHUKUCHI_MAX_STACKS)) return false;
  const dx = x - game.player.x;
  const dy = y - game.player.y;
  game.player.x = x;
  game.player.y = y;
  if (Math.hypot(dx, dy) > 0.01) game.player.facing = Math.atan2(dy, dx);
  game.dash = null;
  cancelD2ShukuchiPlacement();
  setActionMessage('縮地');
  return true;
}

function useD2Action(keyNumber) {
  if (!isD2() || !game.running || game.replayMode || game.dash) return;
  if (keyNumber === 3) { toggleD2ShukuchiPlacement(); return; }
  cancelD2ShukuchiPlacement();
  if (game.d2Gate && game.d2Gate.returnKey === keyNumber) {
    returnToD2Gate();
    return;
  }
  if (game.d2Gate || secondsRemaining(game.d2CooldownUntil) > 0) return;
  const origin = { x: game.player.x, y: game.player.y };
  const sign = keyNumber === 1 ? 1 : -1;
  const distance = D2_MOVE_DISTANCE_YALMS * PX_PER_YALM;
  const tx = origin.x + Math.cos(game.player.facing) * distance * sign;
  const ty = origin.y + Math.sin(game.player.facing) * distance * sign;
  if (!startDashTo(tx, ty)) return;
  game.d2CooldownUntil = game.elapsed + D2_SHARED_COOLDOWN_SECONDS;
  game.d2Gate = {
    x: origin.x,
    y: origin.y,
    createdAt: game.elapsed,
    expiresAt: game.elapsed + D2_GATE_DURATION_SECONDS,
    sourceKey: keyNumber,
    returnKey: keyNumber === 1 ? 2 : 1
  };
}

function isH1() { return selectedSlot === 'H1'; }
function isH2() { return selectedSlot === 'H2'; }

function applyTimedRoleBuff(buffKey, durationSeconds, rangeYalms, originX = FIELD.x, originY = FIELD.y) {
  const range = rangeYalms * PX_PER_YALM;
  for (const member of getLivePartyParticipants()) {
    if (Math.hypot(member.x - originX, member.y - originY) <= range + PLAYER_HIT_RADIUS) {
      if (!game.roleBuffs[member.id]) game.roleBuffs[member.id] = {};
      game.roleBuffs[member.id][buffKey] = game.elapsed + durationSeconds;
    }
  }
}

function useH1Action(keyNumber) {
  if (!isH1() || !game.running || game.replayMode || game.dash) return;
  if (keyNumber === 3 && game.h1Star) {
    detonateH1Star();
    return;
  }
  if (secondsRemaining(game.h1CooldownUntil[keyNumber]) > 0) return;
  if (keyNumber === 1) {
    const distance = H1_FORWARD_DISTANCE_YALMS * PX_PER_YALM;
    const tx = game.player.x + Math.cos(game.player.facing) * distance;
    const ty = game.player.y + Math.sin(game.player.facing) * distance;
    if (startDashTo(tx, ty)) {
      game.h1CooldownUntil[1] = game.elapsed + H1_COOLDOWN_SECONDS;
      setActionMessage('前方へ15m移動');
    }
  } else if (keyNumber === 2) {
    game.h1Wheel = { x: game.player.x, y: game.player.y, radius: H1_WHEEL_RADIUS_YALMS * PX_PER_YALM };
    applyTimedRoleBuff('運命の輪', H1_WHEEL_BUFF_DURATION_SECONDS, H1_WHEEL_BUFF_RANGE_YALMS, game.player.x, game.player.y);
    game.h1CooldownUntil[2] = game.elapsed + H1_COOLDOWN_SECONDS;
    setActionMessage('運命の輪を展開');
  } else if (keyNumber === 3) {
    game.h1Star = { x: FIELD.x, y: FIELD.y, radius: H1_STAR_RADIUS_YALMS * PX_PER_YALM, placedAt: game.elapsed, expiresAt: game.elapsed + H1_STAR_DURATION_SECONDS };
    game.h1CooldownUntil[3] = game.elapsed + H1_COOLDOWN_SECONDS;
    setActionMessage('アーサリースター設置');
  }
}

function detonateH1Star() {
  if (!game.h1Star) return;
  game.h1Star = null;
  game.h1StarFlashUntil = game.elapsed + 0.5;
  setActionMessage('アーサリースター起爆');
}

function useH2Action(keyNumber) {
  if (!isH2() || !game.running || game.replayMode) return;
  if (keyNumber === 1) beginSoilPlacement();
  else if (keyNumber === 2) placeSoilAtBoss();
  else if (keyNumber === 3 && secondsRemaining(game.h2KeracholeCooldownUntil) <= 0) {
    applyTimedRoleBuff('ケーラコレ', H2_KERACHOLE_BUFF_DURATION_SECONDS, H2_KERACHOLE_RANGE_YALMS, game.player.x, game.player.y);
    game.h2KeracholeCooldownUntil = game.elapsed + H2_KERACHOLE_COOLDOWN_SECONDS;
    game.h2KeracholeFlashUntil = game.elapsed + 0.55;
    setActionMessage('ケーラコレ');
  }
}

function handleActionKey(keyNumber) {
  if (isMT()) useMTAction(keyNumber);
  else if (isST()) useSTAction(keyNumber);
  else if (isD1()) useD1Action(keyNumber);
  else if (isD2()) useD2Action(keyNumber);
  else if (isD3()) useD3Action(keyNumber);
  else if (isD4()) useD4Action(keyNumber);
  else if (isH1()) useH1Action(keyNumber);
  else if (isH2()) useH2Action(keyNumber);
}

function formatCooldown(value) {
  return value <= 0 ? 'Ready' : `${value.toFixed(1)}s`;
}

function setHotbarSlot(index, name, state, options = {}) {
  const slot = hotbarSlots[index - 1];
  const nameEl = slot.querySelector('.hotbar-name');
  const stateEl = slot.querySelector('.hotbar-state');
  nameEl.textContent = name;
  stateEl.textContent = state;
  slot.disabled = Boolean(options.disabled);
  slot.classList.toggle('ready', options.ready === true);
  slot.classList.toggle('cooldown', options.cooldown === true);
  slot.classList.toggle('return', options.return === true);
  slot.classList.toggle('active', options.active === true);
  slot.classList.toggle('hidden', options.hidden === true);
}

function updateActionPanel() {
  actionPanel.classList.add('hidden');
  hotbar.classList.remove('hidden');
  hotbarSlots.forEach(slot => slot.classList.remove('hidden'));
  let note = game.actionMessageUntil > game.elapsed ? game.actionMessage : '';

  if (isMT()) {
    const stacks = availableStacks(game.mtDashRechargeEnds, MT_DASH_MAX_STACKS);
    const next = nextStackRemaining(game.mtDashRechargeEnds);
    const bossDistanceYalms = Math.hypot(game.player.x - FIELD.x, game.player.y - FIELD.y) / PX_PER_YALM;
    setHotbarSlot(1, 'MT突進', stacks > 0 ? `${stacks}/${MT_DASH_MAX_STACKS}` : formatCooldown(next), { ready: stacks > 0 && bossDistanceYalms <= D1_DASH_MAX_RANGE_YALMS, cooldown: stacks === 0, disabled: stacks === 0 || bossDistanceYalms > D1_DASH_MAX_RANGE_YALMS || !game.running || game.replayMode });
    setHotbarSlot(2, '未設定', '-', { hidden: true });
    setHotbarSlot(3, '未設定', '-', { hidden: true });
    if (!note) note = `2スタック / 1スタック30秒 / ボス20m以内`;
  } else if (isST()) {
    const stacks = availableStacks(game.stDashRechargeEnds, MT_DASH_MAX_STACKS);
    const next = nextStackRemaining(game.stDashRechargeEnds);
    const bossDistanceYalms = Math.hypot(game.player.x - FIELD.x, game.player.y - FIELD.y) / PX_PER_YALM;
    setHotbarSlot(1, 'ST突進', stacks > 0 ? `${stacks}/${MT_DASH_MAX_STACKS}` : formatCooldown(next), { ready: stacks > 0 && bossDistanceYalms <= D1_DASH_MAX_RANGE_YALMS, cooldown: stacks === 0, disabled: stacks === 0 || bossDistanceYalms > D1_DASH_MAX_RANGE_YALMS || !game.running || game.replayMode });
    setHotbarSlot(2, '未設定', '-', { hidden: true });
    setHotbarSlot(3, '未設定', '-', { hidden: true });
    if (!note) note = `2スタック / 1スタック30秒 / ボス20m以内`;
  } else if (isD1()) {
    const bossDistanceYalms = Math.hypot(game.player.x - FIELD.x, game.player.y - FIELD.y) / PX_PER_YALM;
    const cd1 = secondsRemaining(game.d1CooldownUntil[1]);
    const cd2 = secondsRemaining(game.d1CooldownUntil[2]);
    setHotbarSlot(1, 'ボスへ突進', cd1 > 0 ? formatCooldown(cd1) : (bossDistanceYalms <= D1_DASH_MAX_RANGE_YALMS ? 'Ready' : '20m以内'), { ready: cd1 <= 0 && bossDistanceYalms <= D1_DASH_MAX_RANGE_YALMS, cooldown: cd1 > 0, disabled: !game.running || game.replayMode });
    setHotbarSlot(2, '後方10m', cd2 > 0 ? formatCooldown(cd2) : (bossDistanceYalms <= D1_BACKSTEP_MAX_BOSS_DISTANCE_YALMS ? 'Ready' : '5m以内'), { ready: cd2 <= 0 && bossDistanceYalms <= D1_BACKSTEP_MAX_BOSS_DISTANCE_YALMS, cooldown: cd2 > 0, disabled: !game.running || game.replayMode });
    setHotbarSlot(3, '未設定', '-', { hidden: true });
    if (!note) note = `ボス距離 ${bossDistanceYalms.toFixed(1)}m / 個別RC 10秒`;
  } else if (isD2()) {
    const shared = secondsRemaining(game.d2CooldownUntil);
    if (game.d2Gate) {
      setHotbarSlot(1, game.d2Gate.returnKey === 1 ? 'ゲートへ戻る' : '前方15m', game.d2Gate.returnKey === 1 ? 'Return' : '使用不可', { return: game.d2Gate.returnKey === 1, disabled: game.d2Gate.returnKey !== 1 || !game.running || game.replayMode });
      setHotbarSlot(2, game.d2Gate.returnKey === 2 ? 'ゲートへ戻る' : '後方15m', game.d2Gate.returnKey === 2 ? 'Return' : '使用不可', { return: game.d2Gate.returnKey === 2, disabled: game.d2Gate.returnKey !== 2 || !game.running || game.replayMode });
      if (!note) note = `Gate ${secondsRemaining(game.d2Gate.expiresAt).toFixed(1)}s / 共有RC ${shared.toFixed(1)}s`;
    } else {
      setHotbarSlot(1, '前方15m', formatCooldown(shared), { ready: shared <= 0, cooldown: shared > 0, disabled: shared > 0 || !game.running || game.replayMode });
      setHotbarSlot(2, '後方15m', formatCooldown(shared), { ready: shared <= 0, cooldown: shared > 0, disabled: shared > 0 || !game.running || game.replayMode });
      if (!note) note = '共有リキャスト20秒 / ゲート10秒';
    }
    const shukuchiStacks = availableStacks(game.d2ShukuchiRechargeEnds, D2_SHUKUCHI_MAX_STACKS);
    const shukuchiNext = nextStackRemaining(game.d2ShukuchiRechargeEnds);
    setHotbarSlot(3, game.d2ShukuchiPlacementMode ? '縮地を取消' : '縮地', game.d2ShukuchiPlacementMode ? '位置選択中' : (shukuchiStacks > 0 ? `${shukuchiStacks}/${D2_SHUKUCHI_MAX_STACKS}` : formatCooldown(shukuchiNext)), { ready: shukuchiStacks > 0 && !game.d2ShukuchiPlacementMode, active: game.d2ShukuchiPlacementMode, cooldown: shukuchiStacks === 0, disabled: !game.running || game.replayMode });
    if (!note) note = `共有RC20秒 / ゲート10秒 / 縮地 ${shukuchiStacks}/${D2_SHUKUCHI_MAX_STACKS}`;
  } else if (isD3()) {
    const stacks = availableStacks(game.d3DashRechargeEnds, D3_DASH_MAX_STACKS);
    const next = nextStackRemaining(game.d3DashRechargeEnds);
    setHotbarSlot(1, '前方10m', stacks > 0 ? `${stacks}/${D3_DASH_MAX_STACKS}` : formatCooldown(next), { ready: stacks > 0, cooldown: stacks === 0, disabled: stacks === 0 || !game.running || game.replayMode });
    setHotbarSlot(2, '未設定', '-', { hidden: true });
    setHotbarSlot(3, '未設定', '-', { hidden: true });
    if (!note) note = '3スタック / 1スタック30秒';
  } else if (isD4()) {
    const cd1 = secondsRemaining(game.d4SmudgeCooldownUntil);
    const cd2 = secondsRemaining(game.d4LeyLinesCooldownUntil);
    const cd3 = secondsRemaining(game.d4ReturnCooldownUntil);
    const speedBuff = secondsRemaining(game.d4SpeedBuffUntil);
    const distanceToLey = game.d4LeyLines ? Math.hypot(game.player.x-game.d4LeyLines.x, game.player.y-game.d4LeyLines.y)/PX_PER_YALM : Infinity;
    setHotbarSlot(1, 'スマッジ', cd1 > 0 ? formatCooldown(cd1) : 'Ready', { ready: cd1 <= 0, cooldown: cd1 > 0, disabled: cd1 > 0 || !game.running || game.replayMode });
    setHotbarSlot(2, '魔紋設置', cd2 > 0 ? formatCooldown(cd2) : 'Ready', { ready: cd2 <= 0, cooldown: cd2 > 0, active: Boolean(game.d4LeyLines), disabled: cd2 > 0 || !game.running || game.replayMode });
    const returnState = !game.d4LeyLines ? '未設置' : (distanceToLey > D4_RETURN_MAX_RANGE_YALMS ? '25m以内' : formatCooldown(cd3));
    setHotbarSlot(3, '魔紋へ移動', returnState, { ready: Boolean(game.d4LeyLines) && distanceToLey <= D4_RETURN_MAX_RANGE_YALMS && cd3 <= 0, cooldown: cd3 > 0, disabled: !game.d4LeyLines || distanceToLey > D4_RETURN_MAX_RANGE_YALMS || cd3 > 0 || !game.running || game.replayMode });
    if (!note) note = speedBuff > 0 ? `移動速度+1：${speedBuff.toFixed(1)}s` : (game.d4LeyLines ? `魔紋 ${secondsRemaining(game.d4LeyLines.expiresAt).toFixed(1)}s / 距離 ${distanceToLey.toFixed(1)}m / 半径3m` : '魔紋未設置');
  } else if (isH1()) {
    const cd1 = secondsRemaining(game.h1CooldownUntil[1]);
    const cd2 = secondsRemaining(game.h1CooldownUntil[2]);
    const cd3 = secondsRemaining(game.h1CooldownUntil[3]);
    setHotbarSlot(1, '前方15m移動', formatCooldown(cd1), { ready: cd1 <= 0, cooldown: cd1 > 0, disabled: cd1 > 0 || !game.running || game.replayMode });
    setHotbarSlot(2, '運命の輪', game.h1Wheel ? '展開中' : formatCooldown(cd2), { ready: cd2 <= 0, cooldown: cd2 > 0, active: Boolean(game.h1Wheel), disabled: cd2 > 0 || !game.running || game.replayMode });
    if (game.h1Star) {
      setHotbarSlot(3, 'スター起爆', `${secondsRemaining(game.h1Star.expiresAt).toFixed(1)}s`, { active: true, disabled: !game.running || game.replayMode });
    } else {
      setHotbarSlot(3, 'アーサリースター', formatCooldown(cd3), { ready: cd3 <= 0, cooldown: cd3 > 0, disabled: cd3 > 0 || !game.running || game.replayMode });
    }
    if (!note) note = '各スキル個別RC 60秒 / スターは20秒で自動起爆';
  } else if (isH2()) {
    setHotbarSlot(1, game.soilPlacementMode ? '陣設置を取消' : '陣を手動設置', game.soilPlacementMode ? '選択中' : 'Ready', { ready: !game.soilPlacementMode, active: game.soilPlacementMode, disabled: !game.running || game.replayMode });
    setHotbarSlot(2, '陣を中央設置', 'Ready', { ready: true, disabled: !game.running || game.replayMode });
    const cd3 = secondsRemaining(game.h2KeracholeCooldownUntil);
    setHotbarSlot(3, 'ケーラコレ', formatCooldown(cd3), { ready: cd3 <= 0, cooldown: cd3 > 0, disabled: cd3 > 0 || !game.running || game.replayMode });
    if (!note) note = game.soil ? `陣 ${secondsRemaining(game.soil.expiresAt).toFixed(1)}s / ケーラコレRC 30秒` : '陣15秒 / ケーラコレ15秒バフ';
  } else {
    setHotbarSlot(1, '未設定', '-', { disabled: true });
    setHotbarSlot(2, '未設定', '-', { disabled: true });
    setHotbarSlot(3, '未設定', '-', { disabled: true });
    note = 'この担当には固有アクションがありません';
  }
  hotbarNote.textContent = note;
}

function snapshotReplayFrame() {
  return {
    t: game.elapsed,
    x: game.player.x,
    y: game.player.y,
    facing: game.player.facing,
    d2Gate: game.d2Gate ? { ...game.d2Gate } : null,
    d1CooldownUntil: { ...game.d1CooldownUntil },
    d2CooldownUntil: game.d2CooldownUntil,
    d2ShukuchiRechargeEnds: [...game.d2ShukuchiRechargeEnds],
    mtDashRechargeEnds: [...game.mtDashRechargeEnds],
    d3DashRechargeEnds: [...game.d3DashRechargeEnds],
    d4LeyLines: game.d4LeyLines ? { ...game.d4LeyLines } : null,
    d4SpeedBuffUntil: game.d4SpeedBuffUntil
  };
}

function rotatePoint(point, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: FIELD.x + point.x * c - point.y * s,
    y: FIELD.y + point.x * s + point.y * c
  };
}

function localPointFromPolar(radiusYalms, angle) {
  const radius = radiusYalms * PX_PER_YALM;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

function buildOuterTriangle(slot, rotationAngle) {
  const rayAngle = -Math.PI / 2 + slot * Math.PI / 3;
  const inner = localPointFromPolar(10, rayAngle);
  const outer = localPointFromPolar(20, rayAngle);
  const midpoint = localPointFromPolar(15, rayAngle);
  const height = Math.sqrt(3) * TRINE_SIDE / 2;
  const tangentAngle = rayAngle + Math.PI / 2;
  const apex = {
    x: midpoint.x + Math.cos(tangentAngle) * height,
    y: midpoint.y + Math.sin(tangentAngle) * height
  };
  return {
    id: `outer-${slot}`,
    kind: 'outer',
    slot,
    vertices: [inner, outer, apex].map(point => rotatePoint(point, rotationAngle))
  };
}

function buildCenterTriangle(pattern, rotationAngle) {
  const circumradius = TRINE_SIDE / Math.sqrt(3);
  const direction = pattern === 0 ? 0 : Math.PI;
  const vertices = [0, 1, 2].map(i => {
    const angle = direction + i * Math.PI * 2 / 3;
    return rotatePoint({
      x: Math.cos(angle) * circumradius,
      y: Math.sin(angle) * circumradius
    }, rotationAngle);
  });
  return { id: 'center', kind: 'center', vertices };
}

function areCircularNeighbors(a, b) {
  const distance = Math.abs(a - b);
  return distance === 1 || distance === 5;
}

function hasAdjacentPair(slots) {
  return slots.some((slot, index) =>
    slots.slice(index + 1).some(other => areCircularNeighbors(slot, other))
  );
}

function combinations(values, count) {
  const result = [];
  function visit(start, selected) {
    if (selected.length === count) {
      result.push([...selected]);
      return;
    }
    for (let i = start; i <= values.length - (count - selected.length); i += 1) {
      selected.push(values[i]);
      visit(i + 1, selected);
      selected.pop();
    }
  }
  visit(0, []);
  return result;
}


// デバッグ用の1回目トライン候補。
// 現在の外周6枠から3枠を選ぶ全20組を登録し、各候補に連続型／分離型を明記する。
// 連続型: 円周上で3つの枠が連続している配置。
// 分離型: それ以外の配置。
const TRINE_SECTOR_LABELS = ['北', '北東', '南東', '南', '南西', '北西'];
const REAL_FIRST_TRINE_PATTERNS = combinations([0, 1, 2, 3, 4, 5], 3)
  .map(slots => [...slots].sort((a, b) => a - b));

function parseManualPatternValue(value = selectedManualTrinePattern) {
  const slots = String(value || '')
    .split(',')
    .map(Number)
    .filter(slot => Number.isInteger(slot) && slot >= 0 && slot < 6);
  const unique = [...new Set(slots)].sort((a, b) => a - b);
  return unique.length === 3 ? unique : [...REAL_FIRST_TRINE_PATTERNS[0]];
}

function manualPatternConfig(value = selectedManualTrinePattern) {
  return {
    rotationStep: 0,
    first: parseManualPatternValue(value)
  };
}

function isContinuousFirstTrinePattern(valueOrSlots) {
  const slots = Array.isArray(valueOrSlots)
    ? [...valueOrSlots].sort((a, b) => a - b)
    : parseManualPatternValue(valueOrSlots);
  const selected = new Set(slots);
  for (let start = 0; start < 6; start += 1) {
    if ([0, 1, 2].every(offset => selected.has((start + offset) % 6))) {
      return true;
    }
  }
  return false;
}

function patternTypeLabel(valueOrSlots) {
  return isContinuousFirstTrinePattern(valueOrSlots) ? '連続型' : '分離型';
}

function patternDisplayLabel(valueOrSlots, includeType = true) {
  const slots = Array.isArray(valueOrSlots)
    ? [...valueOrSlots].sort((a, b) => a - b)
    : parseManualPatternValue(valueOrSlots);
  const directions = slots.map(slot => TRINE_SECTOR_LABELS[slot]).join('・');
  return includeType ? `【${patternTypeLabel(slots)}】 ${directions}` : directions;
}

function populateManualTrinePatterns() {
  const fragments = document.createDocumentFragment();
  for (const type of ['連続型', '分離型']) {
    const group = document.createElement('optgroup');
    group.label = type;
    const patterns = REAL_FIRST_TRINE_PATTERNS.filter(slots => patternTypeLabel(slots) === type);
    patterns.forEach(slots => {
      const option = document.createElement('option');
      option.value = slots.join(',');
      option.textContent = patternDisplayLabel(slots);
      group.appendChild(option);
    });
    fragments.appendChild(group);
  }
  manualTrinePattern.replaceChildren(fragments);
  if (!REAL_FIRST_TRINE_PATTERNS.some(slots => slots.join(',') === selectedManualTrinePattern)) {
    selectedManualTrinePattern = REAL_FIRST_TRINE_PATTERNS[0].join(',');
  }
  manualTrinePattern.value = selectedManualTrinePattern;
}

function updateManualTrineControls() {
  manualTrineSetting.classList.toggle('hidden', !manualTrineEnabled);
  manualTrinePattern.disabled = game.running || !manualTrineEnabled;
  manualTrineToggle.disabled = game.running;
  if (manualTrineEnabled) {
    const cfg = manualPatternConfig();
    manualTrineNote.textContent = `${patternDisplayLabel(cfg.first)}を固定。2回目・3回目と中央向きは通常どおりランダムです。`;
  } else {
    manualTrineNote.textContent = '1回目トラインの全20配置を、連続型／分離型の分類付きで選択できます。';
  }
}

function chooseOuterLayoutForFirst(firstSlots) {
  const first = [...firstSlots];
  const remaining = [0, 1, 2, 3, 4, 5].filter(slot => !first.includes(slot));
  const second = remaining[Math.floor(Math.random() * remaining.length)];
  return {
    first,
    second,
    thirdOuter: remaining.filter(slot => slot !== second)
  };
}

function updateManualTrineControls() {
  manualTrineSetting.classList.toggle('hidden', !manualTrineEnabled);
  manualTrinePattern.disabled = game.running || !manualTrineEnabled;
  manualTrineToggle.disabled = game.running;
  if (manualTrineEnabled) {
    const cfg = manualPatternConfig();
    manualTrineNote.textContent = `${patternDisplayLabel(cfg.type, cfg.rotationStep)}を固定。②・③と中央向きは通常どおりランダムです。`;
  } else {
    manualTrineNote.textContent = '2つの基本形×60°回転から選択します。';
  }
}

function buildOuterLayoutCandidates() {
  const slots = [0, 1, 2, 3, 4, 5];
  const candidates = [];
  for (const first of combinations(slots, 3)) {
    if (!hasAdjacentPair(first)) continue;
    const remaining = slots.filter(slot => !first.includes(slot));
    // 2回目は残り3枠から1枠をランダムに担当し、
    // 残った2枠を3回目の外周トラインとして使用する。
    // 3回目の外周2個には隣接条件を設けない。
    for (const second of remaining) {
      const thirdOuter = remaining.filter(slot => slot !== second);
      candidates.push({ first, second, thirdOuter });
    }
  }
  return candidates;
}

const OUTER_LAYOUT_CANDIDATES = buildOuterLayoutCandidates();

function chooseOuterLayout() {
  const candidate = OUTER_LAYOUT_CANDIDATES[
    Math.floor(Math.random() * OUTER_LAYOUT_CANDIDATES.length)
  ];
  return {
    first: [...candidate.first],
    second: candidate.second,
    thirdOuter: [...candidate.thirdOuter]
  };
}

function buildTrineGroups() {
  const rotationAngle = game.rotationStep * Math.PI / 3;
  const outer = Array.from({ length: 6 }, (_, slot) => buildOuterTriangle(slot, rotationAngle));
  const center = buildCenterTriangle(game.centerPattern, rotationAngle);
  const layout = game.outerLayout;
  game.trineGroups = [
    layout.first.map(slot => outer[slot]),
    [outer[layout.second]],
    [...layout.thirdOuter.map(slot => outer[slot]), center]
  ];
}

function npcStartPosition(id) {
  if (id === 'MT') return yalmsToPoint(0, -2.5);
  const order = ['ST','H1','H2','D1','D2','D3','D4'];
  const i = order.indexOf(id);
  const xOffsets = [-1.8, -1.2, -.6, 0, .6, 1.2, 1.8];
  return yalmsToPoint(xOffsets[Math.max(i, 0)], 2.7 + Math.abs(xOffsets[Math.max(i, 0)]) * .15);
}

function idInitialFacing(id) {
  // MTは南（ボス側）、その他は北（ボス側）を向いて開始する。
  return id === 'MT' ? Math.PI / 2 : -Math.PI / 2;
}

function roleIsDpsOrHealer(id) {
  return id.startsWith('D') || id.startsWith('H');
}

function buildNPCs() {
  const controlled = controlledPartyId();
  game.npcs = partyRoster
    .filter(member => member.id !== controlled)
    .map(member => {
      const start = npcStartPosition(member.id);
      return { ...member, x:start.x, y:start.y, tx:start.x, ty:start.y, moveSpeed:NPC_SPEED, facing: idInitialFacing(member.id) };
    });
  game.npcState = '開始位置';
}

function pointIsSafeForTrineGroup(xY, yY, groupIndex = 0) {
  const point = yalmsToPoint(xY, yY);
  const distanceFromCenter = Math.hypot(xY, yY);
  if (distanceFromCenter > FIELD.radiusYalms) return false;

  const group = game.trineGroups[groupIndex] || [];
  for (const trine of group) {
    for (const vertex of trine.vertices) {
      if (Math.hypot(point.x - vertex.x, point.y - vertex.y) <= TRINE_AOE_RADIUS) {
        return false;
      }
    }
  }
  return true;
}

function buildSafeScatterCandidates(groupIndex = 0) {
  const candidates = [];
  const step = 0.5;
  for (let y = -FIELD.radiusYalms; y <= FIELD.radiusYalms; y += step) {
    for (let x = -FIELD.radiusYalms; x <= FIELD.radiusYalms; x += step) {
      if (!pointIsSafeForTrineGroup(x, y, groupIndex)) continue;
      candidates.push({ xY:x, yY:y, radius:Math.hypot(x, y) });
    }
  }
  return candidates;
}

function directionTier(candidate, group) {
  const eps = 0.25;
  if (group === 'tank') {
    if (candidate.yY < -eps) return 0; // 北を最優先
    if (candidate.xY < -eps) return 1; // 北がなければ西
    if (candidate.xY > eps) return 2;  // 北・西が使えない場合のみ東
    return 3;                         // 南は最後の手段
  }
  if (candidate.yY > eps) return 0;    // 南を最優先
  if (candidate.xY > eps) return 1;    // 次に東
  if (candidate.xY < -eps) return 2;   // 南・東が使えない場合のみ西
  return 3;                            // 北は最後の手段
}

function cardinalDirection(candidate) {
  if (Math.abs(candidate.yY) >= Math.abs(candidate.xY)) {
    return candidate.yY < 0 ? 'north' : 'south';
  }
  return candidate.xY < 0 ? 'west' : 'east';
}

function firstTrineDirectionSet() {
  const directions = new Set();
  const rotationAngle = game.rotationStep * Math.PI / 3;
  for (const slot of game.outerLayout?.first || []) {
    const angle = -Math.PI / 2 + slot * Math.PI / 3 + rotationAngle;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    if (y < -0.7) directions.add('north');
    else if (y > 0.7) directions.add('south');
    else if (x > 0) directions.add('east');
    else directions.add('west');
  }
  return directions;
}

function isNorthEastWestFirstPattern() {
  const directions = firstTrineDirectionSet();
  return directions.size === 3
    && directions.has('north')
    && directions.has('east')
    && directions.has('west');
}

function normalizeAngle(angle) {
  const full = Math.PI * 2;
  return ((angle % full) + full) % full;
}

function angularDistance(a, b) {
  const full = Math.PI * 2;
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return Math.min(diff, full - diff);
}

function sectorNameFromAngle(angle) {
  // 北を0番として時計回りに、北・北東・南東・南・南西・北西。
  const northBased = normalizeAngle(angle + Math.PI / 2);
  const index = Math.round(northBased / (Math.PI / 3)) % 6;
  return ['north', 'northEast', 'southEast', 'south', 'southWest', 'northWest'][index];
}

function firstTrineSectorSet() {
  const sectors = new Set();
  const rotationAngle = game.rotationStep * Math.PI / 3;
  for (const slot of game.outerLayout?.first || []) {
    const angle = -Math.PI / 2 + slot * Math.PI / 3 + rotationAngle;
    sectors.add(sectorNameFromAngle(angle));
  }
  return sectors;
}

function secondTrineSectorName() {
  const slot = game.outerLayout?.second;
  if (!Number.isInteger(slot)) return null;
  const rotationAngle = game.rotationStep * Math.PI / 3;
  const angle = -Math.PI / 2 + slot * Math.PI / 3 + rotationAngle;
  return sectorNameFromAngle(angle);
}

function isSouthWestSouthSouthEastFirstPattern() {
  const sectors = firstTrineSectorSet();
  return sectors.size === 3
    && sectors.has('southWest')
    && sectors.has('south')
    && sectors.has('southEast');
}

function isSouthWestNorthWestEastFirstPattern() {
  const sectors = firstTrineSectorSet();
  return sectors.size === 3
    && sectors.has('southWest')
    && sectors.has('northWest')
    && sectors.has('east');
}

function isNorthEastSouthWestNorthWestFirstPattern() {
  const sectors = firstTrineSectorSet();
  return sectors.size === 3
    && sectors.has('northEast')
    && sectors.has('southWest')
    && sectors.has('northWest');
}

function formationDirectionTier(candidate, group) {
  if (isNorthEastSouthWestNorthWestFirstPattern()) {
    const sector = sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY));
    if (group === 'tank') return ({ northWest:0, southWest:1, west:2, north:3, south:4, northEast:5, southEast:5, east:6 })[sector] ?? 9;
    return ({ east:0, northEast:1, southEast:1, south:2, north:3, southWest:4, northWest:4 })[sector] ?? 9;
  }

  if (isSouthWestNorthWestEastFirstPattern()) {
    const sector = sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY));
    if (group === 'tank') return ({ northWest:0, southWest:1, north:2, south:3, east:4, southEast:5, northEast:5 })[sector] ?? 9;
    return ({ east:0, southEast:1, northEast:1, south:2, north:3, southWest:4, northWest:4 })[sector] ?? 9;
  }

  if (isSouthWestSouthSouthEastFirstPattern()) {
    const angle = Math.atan2(candidate.yY, candidate.xY);
    // この配置の一般方向スコア。専用配置ではMT=南、ST=西、DPS/ヒーラー=南東を個別決定する。
    const targetAngle = group === 'tank' ? Math.PI : Math.PI / 4;
    return angularDistance(angle, targetAngle);
  }

  if (!isNorthEastWestFirstPattern()) return directionTier(candidate, group);

  const direction = cardinalDirection(candidate);
  if (group === 'tank') {
    return ({ north:0, west:1, east:2, south:3 })[direction];
  }
  // 北・東・西の①配置では、DPS/ヒーラーは東を固定優先する。
  return ({ east:0, south:1, west:2, north:3 })[direction];
}

function farEnoughFromAssigned(candidate, assigned, minDistance = 1.6) {
  return assigned.every(point => Math.hypot(candidate.xY - point.xY, candidate.yY - point.yY) >= minDistance);
}

function chooseCandidate(candidates, assigned, comparator) {
  const sorted = [...candidates].sort(comparator);
  return sorted.find(candidate => farEnoughFromAssigned(candidate, assigned)) || sorted[0];
}

function pointIsInsideFirstTrineAftermath(candidate) {
  const point = yalmsToPoint(candidate.xY, candidate.yY);
  const firstGroup = game.trineGroups[0] || [];
  return firstGroup.some(trine => trine.vertices.some(vertex =>
    Math.hypot(point.x - vertex.x, point.y - vertex.y) <= TRINE_AOE_RADIUS * 0.92
  ));
}

function pointIsSafeForLaterTrines(candidate) {
  return pointIsSafeForTrineGroup(candidate.xY, candidate.yY, 1)
    && pointIsSafeForTrineGroup(candidate.xY, candidate.yY, 2);
}

function buildAftermathGatherTargets() {
  // ①着弾地点の内側を候補にし、②・③の攻撃範囲にも入らない地点を選ぶ。
  const allFieldCandidates = [];
  const step = 0.25;
  for (let y = -FIELD.radiusYalms; y <= FIELD.radiusYalms; y += step) {
    for (let x = -FIELD.radiusYalms; x <= FIELD.radiusYalms; x += step) {
      if (Math.hypot(x, y) <= FIELD.radiusYalms) {
        allFieldCandidates.push({ xY:x, yY:y, radius:Math.hypot(x, y) });
      }
    }
  }
  const candidates = allFieldCandidates.filter(candidate =>
    pointIsInsideFirstTrineAftermath(candidate) && pointIsSafeForLaterTrines(candidate)
  );
  const aftermathOnly = allFieldCandidates.filter(pointIsInsideFirstTrineAftermath);
  const pool = candidates.length ? candidates : aftermathOnly;
  const targets = new Map();

  function finalizeTargets() {
    const mtPoint = targets.get('MT');
    if (!mtPoint) return targets;
    const otherPoints = [...targets.entries()]
      .filter(([id]) => id !== 'MT')
      .map(([, point]) => point);
    const minDistance = TANK_WING_AOE_RADIUS + PLAYER_HIT_RADIUS + 3;
    const isClear = point => otherPoints.every(other =>
      Math.hypot(point.x - other.x, point.y - other.y) > minDistance
    );
    if (isClear(mtPoint)) return targets;

    const mtXY = { xY:(mtPoint.x-FIELD.x)/PX_PER_YALM, yY:(mtPoint.y-FIELD.y)/PX_PER_YALM };
    const mtSector = sectorNameFromAngle(Math.atan2(mtXY.yY, mtXY.xY));
    const stackPoint = targets.get('H1') || targets.get('H2') || targets.get('D3');
    const stackRadius = stackPoint ? Math.hypot(stackPoint.x-FIELD.x, stackPoint.y-FIELD.y) / PX_PER_YALM : Infinity;
    const candidatesByPreference = [
      pool.filter(c => sectorNameFromAngle(Math.atan2(c.yY,c.xY)) === mtSector && c.radius < stackRadius),
      pool.filter(c => c.radius < stackRadius),
      pool
    ];
    for (const candidates of candidatesByPreference) {
      const candidate = [...candidates]
        .map(c => ({ c, point:yalmsToPoint(c.xY,c.yY) }))
        .filter(item => isClear(item.point))
        .sort((a,b) => {
          const da = Math.hypot(a.point.x-mtPoint.x,a.point.y-mtPoint.y);
          const db = Math.hypot(b.point.x-mtPoint.x,b.point.y-mtPoint.y);
          return da-db;
        })[0];
      if (candidate) {
        targets.set('MT', candidate.point);
        break;
      }
    }
    return targets;
  }

  const markerAngles = markerOrder.map((_, index) => -Math.PI / 2 + index * Math.PI / 4);
  function angularDistance(a, b) {
    let diff = Math.abs(a - b) % (Math.PI * 2);
    return Math.min(diff, Math.PI * 2 - diff);
  }
  function markerDistance(candidate) {
    const angle = Math.atan2(candidate.yY, candidate.xY);
    return Math.min(...markerAngles.map(markerAngle => angularDistance(angle, markerAngle)));
  }

  const stackComparator = (a, b) => {
    const tierDiff = formationDirectionTier(a, 'southEast') - formationDirectionTier(b, 'southEast');
    if (tierDiff) return tierDiff;
    const markerDiff = markerDistance(a) - markerDistance(b);
    if (Math.abs(markerDiff) > 0.001) return markerDiff;
    const radiusDiff = Math.abs(a.radius - DPS_HEALER_STACK_RADIUS_YALMS)
      - Math.abs(b.radius - DPS_HEALER_STACK_RADIUS_YALMS);
    if (Math.abs(radiusDiff) > 0.001) return radiusDiff;
    return a.yY - b.yY;
  };

  const tankComparator = (mode) => (a, b) => {
    const tierDiff = formationDirectionTier(a, 'tank') - formationDirectionTier(b, 'tank');
    if (tierDiff) return tierDiff;
    const radial = mode === 'near' ? a.radius - b.radius : b.radius - a.radius;
    if (Math.abs(radial) > 0.01) return radial;
    const north = a.yY - b.yY;
    if (Math.abs(north) > 0.01) return north;
    return a.xY - b.xY;
  };

  function findSouthWestSouthSouthEastFormation() {
    if (!isSouthWestSouthSouthEastFirstPattern()) return null;

    const bySector = (sector) => pool.filter(candidate =>
      sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY)) === sector
    );

    const stackCandidates = bySector('southEast').sort(stackComparator);
    const mtCandidates = bySector('south').sort((a, b) => a.radius - b.radius);
    const stCandidates = bySector('southWest').concat(bySector('northWest')).sort((a, b) => b.radius - a.radius);
    if (!stackCandidates.length || !mtCandidates.length || !stCandidates.length) return null;

    const requiredTankDistance = TANK_WING_AOE_RADIUS_YALMS + PLAYER_HIT_RADIUS_YALMS + 0.15;

    // 1回目が南西・南・南東、2回目が北西の形では、
    // MTは西側のうちボスに最も近い安置を最優先する。
    // STとの破壊の翼AoEが重なる候補だけを除外し、重ならない限り南へ固定しない。
    if (secondTrineSectorName() === 'northWest') {
      const westTankCandidates = bySector('northWest').concat(bySector('southWest'));
      for (const stackTarget of stackCandidates) {
        const mtPool = westTankCandidates
          .filter(candidate => candidate.radius < stackTarget.radius - 0.1)
          .sort((a, b) => a.radius - b.radius);
        const stPool = westTankCandidates
          .filter(candidate => candidate.radius > stackTarget.radius + 0.1)
          .sort((a, b) => b.radius - a.radius);
        const usableMt = mtPool.length ? mtPool : [...westTankCandidates].sort((a, b) => a.radius - b.radius);
        const usableSt = stPool.length ? stPool : [...westTankCandidates].sort((a, b) => b.radius - a.radius);

        for (const mt of usableMt) {
          const st = usableSt.find(candidate => candidate !== mt
            && Math.hypot(candidate.xY - mt.xY, candidate.yY - mt.yY) >= requiredTankDistance);
          if (st) return { mt, stackTarget, st };
        }
      }
    }

    for (const stackTarget of stackCandidates) {
      const validMt = mtCandidates.filter(candidate => candidate.radius < stackTarget.radius - 0.1);
      const validSt = stCandidates.filter(candidate => candidate.radius > stackTarget.radius + 0.1);
      const mtPool = validMt.length ? validMt : mtCandidates;
      const stPool = validSt.length ? validSt : stCandidates;

      for (const st of stPool) {
        // MTはまず南の最内周を選び、STに近すぎる場合だけ南安置内で位置をずらす。
        const safeMt = mtPool.find(mt =>
          Math.hypot(mt.xY - st.xY, mt.yY - st.yY) >= requiredTankDistance
        );
        if (safeMt) return { mt: safeMt, stackTarget, st };

        // 厳密な距離を満たす候補がない場合も、MT側を動かしてSTとの距離を最大化する。
        const adjustedMt = [...mtPool].sort((a, b) => {
          const da = Math.hypot(a.xY - st.xY, a.yY - st.yY);
          const db = Math.hypot(b.xY - st.xY, b.yY - st.yY);
          if (Math.abs(db - da) > 0.01) return db - da;
          return a.radius - b.radius;
        })[0];
        if (adjustedMt) return { mt: adjustedMt, stackTarget, st };
      }
    }
    return null;
  }

  function findNorthEastSouthWestNorthWestFormation() {
    if (!isNorthEastSouthWestNorthWestFirstPattern()) return null;

    const bySector = (sector) => pool.filter(candidate =>
      sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY)) === sector
    );
    const eastCandidates = bySector('northEast').concat(bySector('southEast'));
    const stackCandidates = [...eastCandidates].sort(stackComparator);
    if (!stackCandidates.length) return null;
    const westCandidates = bySector('northWest').concat(bySector('southWest'));
    if (!westCandidates.length) return null;
    const requiredTankDistance = TANK_WING_AOE_RADIUS_YALMS + PLAYER_HIT_RADIUS_YALMS + 0.15;

    for (const stackTarget of stackCandidates) {
      const mtPool = westCandidates.filter(c => c.radius < stackTarget.radius - 0.1).sort((a,b)=>a.radius-b.radius);
      const stPool = westCandidates.filter(c => c.radius > stackTarget.radius + 0.1).sort((a,b)=>b.radius-a.radius);
      const usableMt = mtPool.length ? mtPool : [...westCandidates].sort((a,b)=>a.radius-b.radius);
      const usableSt = stPool.length ? stPool : [...westCandidates].sort((a,b)=>b.radius-a.radius);
      for (const st of usableSt) {
        const mt = usableMt.find(c => c !== st && Math.hypot(c.xY-st.xY,c.yY-st.yY) >= requiredTankDistance);
        if (mt) return { mt, st, stackTarget };
      }
    }
    return null;
  }

  function findSouthWestNorthWestEastFormation() {
    if (!isSouthWestNorthWestEastFirstPattern()) return null;

    const bySector = (sector) => pool.filter(candidate =>
      sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY)) === sector
    );

    // DPS・ヒーラーは東側の固定半径付近へ集合する。
    const stackCandidates = bySector('east').sort(stackComparator);
    if (!stackCandidates.length) return null;

    const requiredTankDistance = TANK_WING_AOE_RADIUS_YALMS + PLAYER_HIT_RADIUS_YALMS + 0.15;

    for (const stackTarget of stackCandidates) {
      // タンクは北西を最優先し、候補が成立しない場合だけ南西へ切り替える。
      for (const tankSector of ['northWest', 'southWest']) {
        const tankCandidates = bySector(tankSector);
        const mtPool = tankCandidates
          .filter(candidate => candidate.radius < stackTarget.radius - 0.1)
          .sort((a, b) => a.radius - b.radius);
        const stPool = tankCandidates
          .filter(candidate => candidate.radius > stackTarget.radius + 0.1)
          .sort((a, b) => b.radius - a.radius);
        const usableMt = mtPool.length ? mtPool : [...tankCandidates].sort((a, b) => a.radius - b.radius);
        const usableSt = stPool.length ? stPool : [...tankCandidates].sort((a, b) => b.radius - a.radius);

        for (const st of usableSt) {
          const mt = usableMt.find(candidate =>
            candidate !== st
            && Math.hypot(candidate.xY - st.xY, candidate.yY - st.yY) >= requiredTankDistance
          );
          if (mt) return { mt, stackTarget, st };
        }
      }
    }
    return null;
  }


  function findOrderedFormation(stackCandidates, requireOpposite, margin) {
    for (const stackTarget of stackCandidates) {
      let tankPool = pool.filter(candidate => {
        if (!requireOpposite) return true;
        if (isNorthEastWestFirstPattern()) {
          // 1回目が北・東・西の場合は、タンクを必ず北側へ割り当てる。
          return cardinalDirection(candidate) === 'north';
        }
        if (isNorthEastSouthWestNorthWestFirstPattern()) {
          const sector = sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY));
          return sector === 'northWest' || sector === 'southWest';
        }
        if (isNorthEastSouthWestNorthWestFirstPattern()) {
          const sector = sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY));
          return sector === 'northWest' || sector === 'southWest';
        }
        if (isSouthWestNorthWestEastFirstPattern()) {
          const sector = sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY));
          return sector === 'northWest' || sector === 'southWest';
        }
        if (isSouthWestSouthSouthEastFirstPattern()) {
          // 1回目が南西・南・南東の場合は、タンクを西側へ割り当てる。
          return candidate.xY < -0.25;
        }
        return candidate.xY * stackTarget.xY + candidate.yY * stackTarget.yY <= 0;
      });
      if (!tankPool.length) continue;

      // 距離順を MT < DPS/ヒーラー < ST に固定する。
      // DPS/ヒーラーは固定半径上に置き、角度だけを安置に合わせる。
      const mtPool = tankPool
        .filter(candidate => candidate.radius <= stackTarget.radius - margin)
        .sort(tankComparator('near'));
      const stPool = tankPool
        .filter(candidate => candidate.radius >= stackTarget.radius + margin)
        .sort(tankComparator('far'));

      for (const mt of mtPool) {
        const st = stPool.find(candidate =>
          Math.hypot(candidate.xY - mt.xY, candidate.yY - mt.yY) >= 1.0
        );
        if (st) return { mt, stackTarget, st };
      }
    }
    return null;
  }

  // DPS/ヒーラーはマーカー内側の外周寄り、半径14yに固定する。
  // 厳密な候補がない場合のみ許容幅を段階的に広げる。
  const fixedRadiusStacks = pool.filter(candidate =>
    Math.abs(candidate.radius - DPS_HEALER_STACK_RADIUS_YALMS) <= DPS_HEALER_STACK_RADIUS_TOLERANCE
  );
  const relaxedRadiusStacks = pool.filter(candidate =>
    Math.abs(candidate.radius - DPS_HEALER_STACK_RADIUS_YALMS) <= 0.75
  );
  const broadRadiusStacks = pool.filter(candidate =>
    Math.abs(candidate.radius - DPS_HEALER_STACK_RADIUS_YALMS) <= 1.25
  );
  const preferredStacks = [...(
    fixedRadiusStacks.length ? fixedRadiusStacks
      : relaxedRadiusStacks.length ? relaxedRadiusStacks
      : broadRadiusStacks.length ? broadRadiusStacks
      : pool
  )].sort(stackComparator);

  // 南西・南・南東は通常優先度へ流さず、専用ルールだけで完結させる。
  // 候補が厳密条件を満たさない場合も、同じ3方向内から必ず目的地を確定する。
  function forcedSouthWestSouthSouthEastFormation() {
    if (!isSouthWestSouthSouthEastFirstPattern()) return null;
    const bySector = sector => pool.filter(candidate =>
      sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY)) === sector
    );
    const nearest = (sector, radius, radialMode = 'near') => {
      const sectorPool = bySector(sector);
      const source = sectorPool.length ? sectorPool : pool;
      return [...source].sort((a, b) => {
        const radialA = Math.abs(a.radius - radius);
        const radialB = Math.abs(b.radius - radius);
        if (Math.abs(radialA - radialB) > 0.001) return radialA - radialB;
        return radialMode === 'far' ? b.radius - a.radius : a.radius - b.radius;
      })[0] || null;
    };

    const strict = findSouthWestSouthSouthEastFormation();
    if (strict) return strict;

    const mt = nearest('south', 7.5, 'near');
    const st = nearest('southWest', 18.0, 'far');
    const stackTarget = nearest('southEast', DPS_HEALER_STACK_RADIUS_YALMS, 'near');
    return mt && st && stackTarget ? { mt, st, stackTarget } : null;
  }

  let formation;
  if (isSouthWestSouthSouthEastFirstPattern()) {
    formation = forcedSouthWestSouthSouthEastFormation();
  } else {
    formation = findNorthEastSouthWestNorthWestFormation()
      || findSouthWestNorthWestEastFormation()
      || findOrderedFormation(preferredStacks, true, 0.5)
      || findOrderedFormation(preferredStacks, true, 0.1)
      || findOrderedFormation(preferredStacks, false, 0.1);
  }

  if (formation) {
    targets.set('MT', yalmsToPoint(formation.mt.xY, formation.mt.yY));
    targets.set('ST', yalmsToPoint(formation.st.xY, formation.st.yY));
    const stackPoint = yalmsToPoint(formation.stackTarget.xY, formation.stackTarget.yY);
    for (const id of ['H1','H2','D1','D2','D3','D4']) targets.set(id, stackPoint);
    return finalizeTargets();
  }

  // 最終フォールバックでもDPS/ヒーラーは固定半径に最も近い候補を選ぶ。
  const stackTarget = preferredStacks[0] || [...pool].sort(stackComparator)[0];
  if (stackTarget) {
    const stackPoint = yalmsToPoint(stackTarget.xY, stackTarget.yY);
    for (const id of ['H1','H2','D1','D2','D3','D4']) targets.set(id, stackPoint);
  }
  const tankPool = stackTarget
    ? pool.filter(candidate => {
        if (isNorthEastWestFirstPattern()) return cardinalDirection(candidate) === 'north';
        if (isNorthEastSouthWestNorthWestFirstPattern()) {
          const sector = sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY));
          return sector === 'northWest' || sector === 'southWest';
        }
        if (isNorthEastSouthWestNorthWestFirstPattern()) {
          const sector = sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY));
          return sector === 'northWest' || sector === 'southWest';
        }
        if (isSouthWestNorthWestEastFirstPattern()) {
          const sector = sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY));
          return sector === 'northWest' || sector === 'southWest';
        }
        if (isSouthWestSouthSouthEastFirstPattern()) {
          const sector = sectorNameFromAngle(Math.atan2(candidate.yY, candidate.xY));
          return sector === 'south' || sector === 'southWest' || sector === 'northWest';
        }
        return candidate.xY * stackTarget.xY + candidate.yY * stackTarget.yY <= 0;
      })
    : pool;
  const usableTankPool = tankPool.length ? tankPool : pool;
  const mtCandidates = stackTarget
    ? usableTankPool.filter(candidate => candidate.radius < stackTarget.radius)
    : usableTankPool;
  const stCandidates = stackTarget
    ? usableTankPool.filter(candidate => candidate.radius > stackTarget.radius)
    : usableTankPool;
  const mt = [...(mtCandidates.length ? mtCandidates : usableTankPool)].sort(tankComparator('near'))[0];
  const st = [...(stCandidates.length ? stCandidates : usableTankPool)].sort(tankComparator('far'))[0];
  if (mt) targets.set('MT', yalmsToPoint(mt.xY, mt.yY));
  if (st) targets.set('ST', yalmsToPoint(st.xY, st.yY));

  // 候補不足時にも全NPCへ必ず移動先を与える。
  // 特に1回目が南西・南・南東の配置では、MT=南内周、ST=南西外周、
  // DPS/ヒーラー=南東の順で、利用可能な①跡地候補へ寄せる。
  function nearestPoolCandidate(targetAngle, targetRadius) {
    if (!pool.length) return null;
    return [...pool].sort((a, b) => {
      const angleA = Math.atan2(a.yY, a.xY);
      const angleB = Math.atan2(b.yY, b.xY);
      const scoreA = angularDistance(angleA, targetAngle) * 8 + Math.abs(a.radius - targetRadius);
      const scoreB = angularDistance(angleB, targetAngle) * 8 + Math.abs(b.radius - targetRadius);
      return scoreA - scoreB;
    })[0];
  }

  if (isSouthWestSouthSouthEastFirstPattern()) {
    if (!targets.has('MT')) {
      const candidate = nearestPoolCandidate(Math.PI / 2, 7.5);
      if (candidate) targets.set('MT', yalmsToPoint(candidate.xY, candidate.yY));
    }
    if (!targets.has('ST')) {
      const candidate = nearestPoolCandidate(5 * Math.PI / 6, 18.0);
      if (candidate) targets.set('ST', yalmsToPoint(candidate.xY, candidate.yY));
    }
    const stackCandidate = nearestPoolCandidate(Math.PI / 6, DPS_HEALER_STACK_RADIUS_YALMS);
    if (stackCandidate) {
      const point = yalmsToPoint(stackCandidate.xY, stackCandidate.yY);
      for (const id of ['H1','H2','D1','D2','D3','D4']) {
        if (!targets.has(id)) targets.set(id, point);
      }
    }
  }

  // 最終保護。特殊配置以外でも候補欠落で処理を止めない。
  const genericStack = nearestPoolCandidate(Math.PI / 4, DPS_HEALER_STACK_RADIUS_YALMS);
  const genericMt = nearestPoolCandidate(-Math.PI / 2, 7.5);
  const genericSt = nearestPoolCandidate(Math.PI, 18.0);
  if (genericStack) {
    const point = yalmsToPoint(genericStack.xY, genericStack.yY);
    for (const id of ['H1','H2','D1','D2','D3','D4']) {
      if (!targets.has(id)) targets.set(id, point);
    }
  }
  if (!targets.has('MT') && genericMt) targets.set('MT', yalmsToPoint(genericMt.xY, genericMt.yY));
  if (!targets.has('ST') && genericSt) targets.set('ST', yalmsToPoint(genericSt.xY, genericSt.yY));
  return finalizeTargets();
}

function npcFormationTarget(id, state, scatterTargets = null) {
  const safeSign = game.wingSide === 'left' ? 1 : -1;
  const formations = {
    '半面回避': {
      MT:[1.8,-1.8], ST:[2.4,-.8], H1:[2.8,.1], H2:[2.3,.9],
      D1:[1.5,1.4], D2:[.7,1.9], D3:[3.2,1.6], D4:[3.5,.7]
    },
    '中央集合': {
      MT:[0,-.55], ST:[0,.55], H1:[-.35,.15], H2:[.35,.15],
      D1:[-.65,.45], D2:[.65,.45], D3:[-.45,.75], D4:[.45,.75]
    }
  };
  if (state === '開始位置') return npcStartPosition(id);
  if (state === '跡地集合') {
    if (scatterTargets?.has(id)) return scatterTargets.get(id);
    // 安置探索が候補を返せなかった場合も中央で停止させず、
    // 役割別の安全寄り予備位置へ移動させる。
    const fallbackYalms = {
      MT:[0,7.5], ST:[-9.0,15.5],
      H1:[9.0,11.0], H2:[9.0,11.0], D1:[9.0,11.0],
      D2:[9.0,11.0], D3:[9.0,11.0], D4:[9.0,11.0]
    };
    const fallback = fallbackYalms[id] || [0, 10.0];
    return clampPointInsideField(yalmsToPoint(fallback[0], fallback[1]));
  }
  if (state === '接敵') {
    const engage = {
      // 現在位置から各着地点へ直線移動する。ターゲットサークル外周を基準に配置する。
      // 北がボス正面、南が背面。D2は前方移動後に南東側面のサークル外へ着地する。
      MT:[0,-8.85], ST:[0,-10.6],
      D1:[-1.1,8.85], D2:[6.35,6.35], D3:[0,9.7], D4:[2.6,9.2],
      H1:[-1.7,10.4], H2:[1.7,10.4]
    };
    const [x,y] = engage[id];
    return yalmsToPoint(x,y);
  }
  if (state === '中央待機') {
    const [x, y] = formations['中央集合'][id];
    return yalmsToPoint(x, y);
  }
  const [x, y] = formations[state][id];
  return yalmsToPoint(safeSign * Math.abs(x), y);
}


function setTankPostDashWalkTargets() {
  for (const id of ['MT', 'ST']) {
    const npc = game.npcs.find(member => member.id === id);
    if (!npc) continue;
    const target = npcFormationTarget(id, '接敵');
    npc.tx = target.x;
    npc.ty = target.y;
    // 突進後は実戦の微調整を再現し、頭割り位置まで徒歩でゆっくり移動する。
    npc.moveSpeed = id === 'MT' ? 82 : 88;
  }
}

function setD1PostDashWalkTarget() {
  const npc = game.npcs.find(member => member.id === 'D1');
  if (!npc) return;
  const target = npcFormationTarget('D1', '接敵');
  npc.tx = target.x;
  npc.ty = target.y;
  npc.moveSpeed = NPC_SPEED * 0.72;
}

function setD2PostSkillWalkTarget() {
  const npc = game.npcs.find(member => member.id === 'D2');
  if (!npc) return;
  const target = npcFormationTarget('D2', '接敵');
  npc.tx = target.x;
  npc.ty = target.y;
  // 15m前方移動の着地後は、ターゲットサークル外まで徒歩で微調整する。
  npc.moveSpeed = NPC_SPEED * 0.72;
}

function setNPCTargets(state) {
  game.npcState = state;
  game.timelineStep = state;
  const scatterTargets = state === '跡地集合' ? buildAftermathGatherTargets() : null;
  game.npcs.forEach(npc => {
    let target;
    if (state === '接敵' && (npc.id === 'MT' || npc.id === 'ST')) {
      // ③着弾後、現在位置からボスへ直線突進し、ターゲットサークル外周手前で一度停止する。
      const dx = FIELD.x - npc.x;
      const dy = FIELD.y - npc.y;
      const distance = Math.max(0.001, Math.hypot(dx, dy));
      const stopDistance = BOSS_DASH_STOP_DISTANCE_YALMS * PX_PER_YALM;
      const travel = Math.max(0, distance - stopDistance);
      target = {
        x: npc.x + dx / distance * travel,
        y: npc.y + dy / distance * travel
      };
      if (npc.id === 'MT') game.mtDashLandingPoint = { x: target.x, y: target.y };
      if (npc.id === 'ST') game.stDashLandingPoint = { x: target.x, y: target.y };
      startNpcSkillEscape(npc, target, `${npc.id}突進`, 0.28);
    } else if (state === '接敵' && npc.id === 'D1') {
      // 3回目トライン後、現在位置からボスへまっすぐ突進する。
      const dx = FIELD.x - npc.x;
      const dy = FIELD.y - npc.y;
      const distance = Math.max(0.001, Math.hypot(dx, dy));
      const stopDistance = BOSS_DASH_STOP_DISTANCE_YALMS * PX_PER_YALM;
      const travel = Math.max(0, distance - stopDistance);
      target = { x: npc.x + dx / distance * travel, y: npc.y + dy / distance * travel };
      startNpcSkillEscape(npc, target, 'D1突進', 0.28);
    } else if (state === '接敵' && npc.id === 'D2') {
      // ③着弾後、安置からボス方向へ15mの前方移動スキルを直線使用する。
      const dx = FIELD.x - npc.x;
      const dy = FIELD.y - npc.y;
      const distance = Math.max(0.001, Math.hypot(dx, dy));
      const skillDistance = D2_MOVE_DISTANCE_YALMS * PX_PER_YALM;
      target = {
        x: npc.x + dx / distance * skillDistance,
        y: npc.y + dy / distance * skillDistance
      };
      npc.moveSpeed = 950;
    } else if (state === '接敵' && npc.id === 'D4') {
      const xY = (npc.x - FIELD.x) / PX_PER_YALM;
      const yY = (npc.y - FIELD.y) / PX_PER_YALM;
      const radiusY = Math.hypot(xY, yY);
      // D4は南側、または十分外周寄りの安全地点にいるならその場を維持する。
      target = (yY >= 2.0 || radiusY >= 12.0)
        ? { x: npc.x, y: npc.y }
        : npcFormationTarget(npc.id, state, scatterTargets);
    } else {
      target = npcFormationTarget(npc.id, state, scatterTargets);
    }
    npc.tx = target.x;
    npc.ty = target.y;
    if (state === '跡地集合') {
      const distance = Math.hypot(npc.tx - npc.x, npc.ty - npc.y);
      const remaining = Math.max(0.25, AFTERMATH_ARRIVAL_TIME - game.elapsed);
      // ③着弾前の到着を保証しつつ、移動開始までは安置を見せない。
      npc.moveSpeed = Math.max(20, (distance / remaining) * 1.005);
    } else if (state === '接敵') {
      if (npc.id === 'H1' || npc.id === 'H2' || npc.id === 'D3') {
        // ③トライン着弾後、ヒーラーとD3はスキルを使わず徒歩でゆっくり接敵する。
        // 頭割り着弾までに南側の担当位置へ到着できる歩行速度に固定する。
        npc.moveSpeed = 52;
      } else if (npc.id !== 'D1' && npc.id !== 'D2' && npc.id !== 'MT' && npc.id !== 'ST') {
        npc.moveSpeed = 560;
      }
    } else if (state === '中央待機') {
      npc.moveSpeed = CENTRAL_WAIT_SPEED;
    } else {
      npc.moveSpeed = NPC_SPEED;
    }
  });
}

function setRoleSelectionLocked(locked) {
  roleButtons.forEach(button => { button.disabled = locked; });
  slotSelector.querySelectorAll('button').forEach(button => { button.disabled = locked; });
  document.getElementById('roleSelector').classList.toggle('locked', locked);
  slotSetting.classList.toggle('locked', locked);
  manualTrineToggle.disabled = locked;
  dualArmRampageToggle.disabled = locked;
  trineWingOnlyToggle.disabled = locked;
  manualTrinePattern.disabled = locked || !manualTrineEnabled;
  manualTrineSetting.classList.toggle('locked', locked);
}

function resetGame(replayData = null) {
  game.running = true;
  setRoleSelectionLocked(true);
  game.finished = false;
  game.elapsed = 0;
  game.failureReasons = [];
  game.replayMode = Boolean(replayData);
  game.trineWingOnlyMode = replayData?.config?.trineWingOnlyMode ?? trineWingOnlyEnabled;
  game.replayFrames = replayData ? replayData.frames.map(frame => ({ ...frame })) : [];
  game.replayCursor = 0;
  game.recordingFrames = [];

  if (replayData) {
    selectedRole = replayData.role;
    selectedSlot = replayData.slot;
    roleButtons.forEach(button => button.classList.toggle('active', button.dataset.role === selectedRole));
    renderSlotSelector();
    slotSelector.querySelectorAll('button').forEach(button => button.classList.toggle('active', button.dataset.slot === selectedSlot));
  }

  game.player = { ...getStartPosition(selectedRole), facing: selectedRole === 'MT' ? Math.PI / 2 : -Math.PI / 2 };
  game.soil = null;
  game.soilPlacementMode = false;
  game.soilBuffs = {};
  // Retry / Startごとに、すべての固有アクション状態を初期化する。
  game.dash = null;
  game.d1CooldownUntil = { 1: 0, 2: 0 };
  game.d2CooldownUntil = 0;
  game.d2Gate = null;
  game.d2ShukuchiRechargeEnds = [];
  game.d2ShukuchiPlacementMode = false;
  shukuchiPointer = null;
  game.actionMessage = '';
  game.actionMessageUntil = 0;
  game.h1CooldownUntil = { 1: 0, 2: 0, 3: 0 };
  game.h1Wheel = null;
  game.h1Star = null;
  game.h1StarFlashUntil = 0;
  game.h2KeracholeCooldownUntil = 0;
  game.h2KeracholeFlashUntil = 0;
  game.roleBuffs = {};
  game.mtDashRechargeEnds = [];
  game.stDashRechargeEnds = [];
  game.d3DashRechargeEnds = [];
  game.d4SmudgeCooldownUntil = 0;
  game.d4SpeedBuffUntil = 0;
  game.d4LeyLinesCooldownUntil = 0;
  game.d4ReturnCooldownUntil = 0;
  game.d4LeyLines = null;
  game.stackShareTargetId = 'MT';
  game.stackShareMarker = false;
  game.stackRetreatTriggered = false;
  game.stackShareMtTarget = null;
  game.dualArmRampageMode = replayData?.config?.dualArmRampageMode ?? dualArmRampageEnabled;
  if (game.dualArmRampageMode) {
    game.stackShareMtPattern = replayData?.config?.stackShareMtPattern
      || ['northOutside', 'dashHold', 'centerNear'][Math.floor(Math.random() * 3)];
    game.stackShareStPattern = replayData?.config?.stackShareStPattern
      || (selectedSlot === 'MT'
        ? ['northOutside', 'south', 'dashHold'][Math.floor(Math.random() * 3)]
        : (selectedSlot === 'ST'
          ? 'player'
          // MTがNPCの場合も、STが南へ行く事故パターンを抽選する。
          : ['followMT', 'south'][Math.floor(Math.random() * 2)]));
  } else {
    // 通常モードでは安定した正規処理に固定する。
    game.stackShareMtPattern = 'northOutside';
    game.stackShareStPattern = selectedSlot === 'ST' ? 'player' : (selectedSlot === 'MT' ? 'northOutside' : 'followMT');
  }
  game.stackTankNormalSetup = false;
  game.stackIntruderId = replayData?.config?.stackIntruderId ?? null;
  game.stackIntruderVariant = replayData?.config?.stackIntruderVariant ?? null;
  game.stackIntruderStartOffset = replayData?.config?.stackIntruderStartOffset ?? null;
  game.stackIntruderTriggered = false;
  game.stackEscapeTriggered = false;
  game.stackIntruderWheel = null;
  for (const npc of game.npcs) {
    npc.pendingStackWheel = false;
    npc.stackWheelHoldUntil = 0;
    if (npc.id === 'H1') {
      npc.skillLabel = null;
      npc.skillFlashUntil = 0;
    }
  }
  game.stackNorthIntrusionHandled = false;
  game.stackNorthRetreatTriggered = false;
  game.stackSouthRetreatStartOffset = replayData?.config?.stackSouthRetreatStartOffset ?? null;
  game.stackSouthRetreatTriggered = false;
  game.stackEmergencyRunTriggered = false;
  game.stackRescueTriggered = false;
  game.stackRescueHealerId = replayData?.config?.stackRescueHealerId ?? null;
  game.stackRescueTargetId = replayData?.config?.stackRescueTargetId ?? null;
  game.stackRescueOrigin = null;
  game.stackRescuedHoldId = null;
  game.stackRescuedHoldPoint = null;
  game.stackRescuePartnerHoldId = null;
  game.stackRescuePartnerHoldPoint = null;
  game.stackRetreatTargets = replayData?.config?.stackRetreatTargets ? structuredClone(replayData.config.stackRetreatTargets) : {};
  game.mtDashLandingPoint = null;
  game.stDashLandingPoint = null;
  game.runtimeErrorMessage = '';
  // MTのターゲットサークルめり込み仕様は一旦無効化。
  game.mtStackIntrude = false;
  game.mtStackIntrudeDepthYalms = 0;
  updateSoilButtonState();
  updateActionPanel();
  game.wingSide = replayData ? replayData.config.wingSide : (Math.random() < .5 ? 'left' : 'right');
  game.centerPattern = replayData ? replayData.config.centerPattern : Math.floor(Math.random() * 2);
  if (replayData) {
    game.rotationStep = replayData.config.rotationStep;
    game.outerLayout = {
      first: [...replayData.config.outerLayout.first],
      second: replayData.config.outerLayout.second,
      thirdOuter: [...replayData.config.outerLayout.thirdOuter]
    };
  } else if (manualTrineEnabled) {
    const manual = manualPatternConfig();
    game.rotationStep = manual.rotationStep;
    game.outerLayout = chooseOuterLayoutForFirst(manual.first);
  } else {
    game.rotationStep = Math.floor(Math.random() * 6);
    game.outerLayout = chooseOuterLayout();
  }
  game.runConfig = {
    wingSide: game.wingSide,
    rotationStep: game.rotationStep,
    centerPattern: game.centerPattern,
    stackShareMtPattern: game.stackShareMtPattern,
    stackShareStPattern: game.stackShareStPattern,
    dualArmRampageMode: game.dualArmRampageMode,
    trineWingOnlyMode: game.trineWingOnlyMode,
    stackIntruderId: game.stackIntruderId,
    stackIntruderVariant: game.stackIntruderVariant,
    stackIntruderStartOffset: game.stackIntruderStartOffset,
    stackSouthRetreatStartOffset: game.stackSouthRetreatStartOffset,
    stackRescueHealerId: game.stackRescueHealerId,
    stackRescueTargetId: game.stackRescueTargetId,
    stackRetreatTargets: structuredClone(game.stackRetreatTargets),
    manualTrine: manualTrineEnabled ? selectedManualTrinePattern : null,
    outerLayout: {
      first: [...game.outerLayout.first],
      second: game.outerLayout.second,
      thirdOuter: [...game.outerLayout.thirdOuter]
    }
  };
  game.activeAoEs = [];
  game.telegraphWing = false;
  game.wingCastStart = null;
  game.wingCastEnd = null;
  game.castType = null;
  game.tankWingTargets = [];
  game.visibleTrines = [];
  game.phase = '開始位置';
  game.bossPulse = 0;
  game.timelineStep = '開始位置';
  overlay.classList.add('hidden');
  resultReason.replaceChildren();
  castBar.classList.add('hidden');
  castBarFill.style.width = '0%';
  castBarLabel.textContent = '破壊の翼';
  buildTrineGroups();
  buildNPCs();
  if (!game.replayMode) game.recordingFrames.push(snapshotReplayFrame());

  const coreEvents = [
    { time: 0.5, action: () => { game.phase = '1回目トライン表示（外周3個）'; showTrineGroup(0); } },
    { time: 1.5, action: () => {
      game.phase = '② トライン表示 / 破壊の翼 詠唱';
      showTrineGroup(1);
      game.telegraphWing = true;
      game.castType = 'half';
      game.wingCastStart = game.elapsed;
      game.wingCastEnd = 3.5;
      castBarLabel.textContent = '破壊の翼（半面）';
      setNPCTargets('半面回避');
    } },
    { time: 3.5, action: () => {
      game.phase = '③ トライン表示 / 破壊の翼 発動';
      showTrineGroup(2);
      activateWing();
    } },
    { time: 4.0, action: () => setNPCTargets('中央集合') },
    { time: 8.5, action: () => {
      game.phase = '1回目トライン発動 / 破壊の翼（AoE）詠唱開始';
      activateTrineGroup(0);
      startTankWingCast();
    } },
    { time: 8.55, action: () => { game.phase = '中央付近で待機（安置判断時間）'; setNPCTargets('中央待機'); } },
    { time: 10.5, action: () => { game.phase = '② トライン発動'; activateTrineGroup(1); } },
    { time: AFTERMATH_DEPARTURE_TIME, action: () => { game.phase = '1回目跡地へ移動（3回目着弾までに到着）'; setNPCTargets('跡地集合'); } },
    { time: 12.5, action: () => { game.phase = '③ トライン発動'; activateTrineGroup(2); } },
    { time: 13.0, action: () => { game.phase = '破壊の翼（AoE）発動'; activateTankWingAoE(); } }
  ];

  if (game.trineWingOnlyMode) {
    game.events = [
      ...coreEvents,
      { time: 13.95, action: () => {
        game.phase = 'トライン＋破壊の翼 完了';
        if (game.failureReasons.length === 0) finish(true, '');
      } }
    ];
  } else {
    game.events = [
      ...coreEvents,
      { time: 13.05, action: () => { game.phase = 'ボスへ接敵'; setNPCTargets('接敵'); } },
      { time: 13.34, action: () => { setTankPostDashWalkTargets(); setD1PostDashWalkTarget(); setD2PostSkillWalkTarget(); } },
      { time: 14.0, action: () => { game.phase = '終末の双腕 詠唱'; startStackShareCast(); } },
      { time: 19.0, action: () => { game.phase = '終末の双腕 発動'; activateStackShare(); } },
      { time: 20.0, action: () => { if (game.failureReasons.length === 0) finish(true, ''); } }
    ];
  }
}

function showTrineGroup(groupIndex) {
  for (const trine of game.trineGroups[groupIndex]) {
    if (!game.visibleTrines.some(item => item.id === trine.id)) {
      game.visibleTrines.push({ ...trine, appearedAt: game.elapsed, groupIndex });
    }
  }
}

function activateWing() {
  game.telegraphWing = false;
  game.wingCastStart = null;
  game.wingCastEnd = null;
  game.castType = null;
  castBar.classList.add('hidden');
  game.activeAoEs.push({ type:'wing', side:game.wingSide, started:game.elapsed, expires:game.elapsed + .65 });
  game.bossPulse = 1;
  checkWingHitAtActivation();
}


function startTankWingCast() {
  game.telegraphWing = false;
  game.castType = 'tankAoE';
  game.wingCastStart = game.elapsed;
  game.wingCastEnd = 13.0;
  castBarLabel.textContent = '破壊の翼（AoE）';
}

function getPartyParticipants() {
  return [
    { id: controlledPartyId(), x: game.player.x, y: game.player.y, isPlayer: true },
    ...game.npcs.map(npc => ({ id: npc.id, x: npc.x, y: npc.y, isPlayer: false }))
  ];
}

function activateTankWingAoE() {
  game.telegraphWing = false;
  game.wingCastStart = null;
  game.wingCastEnd = null;
  game.castType = null;
  castBar.classList.add('hidden');

  const participants = getPartyParticipants().map(member => ({
    ...member,
    distanceFromBoss: Math.hypot(member.x - FIELD.x, member.y - FIELD.y)
  }));
  participants.sort((a, b) => a.distanceFromBoss - b.distanceFromBoss || a.id.localeCompare(b.id));
  const nearest = participants[0];
  const farthest = [...participants].reverse().find(member => member.id !== nearest.id) || nearest;
  game.tankWingTargets = [nearest, farthest];
  game.activeAoEs.push({
    type: 'tankWing',
    targets: game.tankWingTargets.map(target => ({ ...target })),
    aoeRadius: TANK_WING_AOE_RADIUS,
    started: game.elapsed,
    expires: game.elapsed + .85
  });
  game.bossPulse = 1;
  checkTankWingHitsAtActivation(participants, game.tankWingTargets);
}

function checkTankWingHitsAtActivation(participants, targets) {
  if (!game.running) return;
  const reasons = [];
  for (const target of targets) {
    for (const member of participants) {
      if (member.id === target.id) continue;
      const hitRadius = PLAYER_HIT_RADIUS;
      if (Math.hypot(member.x - target.x, member.y - target.y) <= TANK_WING_AOE_RADIUS + hitRadius) {
        reasons.push(member.isPlayer
          ? `破壊の翼（AoE）に巻き込まれました（対象:${target.id}）`
          : `${member.id}が破壊の翼（AoE）に巻き込まれました（対象:${target.id}）`);
      }
    }
  }
  addFailureReasons(reasons);
}

function getParticipantById(id) {
  return getPartyParticipants().find(member => member.id === id) || null;
}

function setStackShareNpcPositions() {
  const mtNpc = game.npcs.find(member => member.id === 'MT');
  if (!mtNpc) {
    game.stackShareMtTarget = null;
    return;
  }

  let target;
  let moveSpeed = 42;
  if (game.stackShareMtPattern === 'dashHold') {
    // 突進着地点でそのまま頭割りを処理する。
    const landing = game.mtDashLandingPoint;
    target = landing && Number.isFinite(landing.x) && Number.isFinite(landing.y)
      ? { x: landing.x, y: landing.y }
      : { x: mtNpc.x, y: mtNpc.y };
    moveSpeed = 0;
  } else if (game.stackShareMtPattern === 'centerNear') {
    // ボスの真下付近から、中心よりわずかに北側まで深く歩く。
    target = yalmsToPoint(0, -1.2);
    moveSpeed = 48;
  } else {
    // 通常どおり、北側のターゲットサークル外で頭割りを処理する。
    target = yalmsToPoint(0, -(BOSS_BOSS_TARGET_CIRCLE_RADIUS_YALMS + 0.8));
    moveSpeed = 42;
  }

  if (!Number.isFinite(target.x) || !Number.isFinite(target.y)) {
    game.stackShareMtTarget = null;
    return;
  }
  game.stackShareMtTarget = { x: target.x, y: target.y };
  mtNpc.tx = target.x;
  mtNpc.ty = target.y;
  mtNpc.moveSpeed = moveSpeed;
}

function setStackShareStPosition() {
  if (game.stackRescuedHoldId === 'ST' || game.stackRescuePartnerHoldId === 'ST') return;
  const stNpc = game.npcs.find(member => member.id === 'ST');
  if (!stNpc) return;

  // ST南事故はMTがプレイヤーかNPCかに関係なく発生する。
  // STが操作キャラクターの場合だけ自動移動させない。
  if (game.dualArmRampageMode && game.stackShareStPattern === 'south' && selectedSlot !== 'ST') {
    // ST南事故ではボス中央付近で止まらず、頭割り着弾まで南方向へ走り抜ける。
    // 目的地をフィールド南端近くへ置くことで、詠唱中に中間地点へ到着して停止しないようにする。
    const southRunTargetYalms = FIELD.radiusYalms - 1.25;
    const target = yalmsToPoint(0, southRunTargetYalms);
    stNpc.tx = target.x;
    stNpc.ty = target.y;
    stNpc.moveSpeed = 44;
    return;
  }

  // 双腕暴走モードでDPS・ヒーラーの侵入行動が始まった後は、
  // ST NPCが頭割り着弾までMT（プレイヤー／NPC）を毎フレーム追従する。
  // STが操作キャラクターの場合は自動追従させない。
  if (game.dualArmRampageMode && game.stackIntruderTriggered && game.stackIntruderId && selectedSlot !== 'ST') {
    const mt = getParticipantById('MT');
    if (mt) {
      let dx = mt.x - FIELD.x;
      let dy = mt.y - FIELD.y;
      let dist = Math.hypot(dx, dy);
      if (dist < 0.001) {
        dx = 0;
        dy = -1;
        dist = 1;
      }
      const offset = ST_FOLLOW_TARGET_DISTANCE_YALMS * PX_PER_YALM;
      const target = clampPointInsideField({
        x: mt.x + dx / dist * offset,
        y: mt.y + dy / dist * offset
      });
      stNpc.tx = target.x;
      stNpc.ty = target.y;
      // MTが大きく移動しても5m以内へ素早く戻れるよう、距離に応じて追従速度を上げる。
      const currentDistance = Math.hypot(stNpc.x - mt.x, stNpc.y - mt.y);
      stNpc.moveSpeed = currentDistance > ST_FOLLOW_MAX_DISTANCE_YALMS * PX_PER_YALM ? 150 : 72;
      return;
    }
  }

  // MTが操作キャラクターの場合は、ST NPCが試行ごとの3パターンを使用する。
  if (selectedSlot === 'MT') {
    let target;
    if (game.stackShareStPattern === 'south') {
      target = yalmsToPoint(0, BOSS_BOSS_TARGET_CIRCLE_RADIUS_YALMS + 1.4);
    } else if (game.stackShareStPattern === 'dashHold') {
      const landing = game.stDashLandingPoint;
      target = landing && Number.isFinite(landing.x) && Number.isFinite(landing.y)
        ? { x: landing.x, y: landing.y }
        : { x: stNpc.x, y: stNpc.y };
    } else {
      target = yalmsToPoint(0, -(BOSS_BOSS_TARGET_CIRCLE_RADIUS_YALMS + 1.4));
    }
    if (Number.isFinite(target.x) && Number.isFinite(target.y)) {
      stNpc.tx = target.x;
      stNpc.ty = target.y;
      stNpc.moveSpeed = game.stackShareStPattern === 'dashHold' ? 0 : 44;
    }
    return;
  }

  // STが操作キャラクターの場合、NPC側の追従処理は行わない。
  if (selectedSlot === 'ST') return;

  // MT・STがともにNPCの場合は、STがMTを追従して頭割り範囲内を維持する。
  const mtNpc = game.npcs.find(member => member.id === 'MT');
  if (!mtNpc) return;
  const dx = mtNpc.x - FIELD.x;
  const dy = mtNpc.y - FIELD.y;
  const dist = Math.max(0.001, Math.hypot(dx, dy));
  const offset = 1.7 * PX_PER_YALM;
  stNpc.tx = mtNpc.x + dx / dist * offset;
  stNpc.ty = mtNpc.y + dy / dist * offset;
  stNpc.moveSpeed = 52;
}

function plannedPartyPosition(id) {
  if (selectedSlot === id) return { x: game.player.x, y: game.player.y };
  const npc = game.npcs.find(member => member.id === id);
  if (!npc) return null;
  return {
    x: Number.isFinite(npc.tx) ? npc.tx : npc.x,
    y: Number.isFinite(npc.ty) ? npc.ty : npc.y
  };
}

function isNormalStackTankSetup() {
  // タンクを操作していない場合は、暴走モードで選ばれたAIパターンから判定する。
  if (selectedSlot !== 'MT' && selectedSlot !== 'ST') {
    return game.stackShareMtPattern === 'northOutside' && game.stackShareStPattern === 'followMT';
  }

  const mt = plannedPartyPosition('MT');
  const st = plannedPartyPosition('ST');
  if (!mt || !st) return false;
  const mtDx = (mt.x - FIELD.x) / PX_PER_YALM;
  const mtDy = (mt.y - FIELD.y) / PX_PER_YALM;
  const stDx = (st.x - FIELD.x) / PX_PER_YALM;
  const stDy = (st.y - FIELD.y) / PX_PER_YALM;
  const mtRadius = Math.hypot(mtDx, mtDy);
  const stRadius = Math.hypot(stDx, stDy);
  const pairDistance = Math.hypot(mt.x - st.x, mt.y - st.y);
  const northSide = mtDy < -0.5 && stDy < -0.3;
  const outsideCircle = mtRadius >= BOSS_BOSS_TARGET_CIRCLE_RADIUS_YALMS - 1.1
    && stRadius >= BOSS_BOSS_TARGET_CIRCLE_RADIUS_YALMS - 1.1;
  const together = pairDistance <= STACK_SHARE_RADIUS - PLAYER_HIT_RADIUS * 0.5;
  return northSide && outsideCircle && together;
}

function pointTowardDistance(from, desired, distanceYalms) {
  const dx = desired.x - from.x;
  const dy = desired.y - from.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.001) return { x: from.x, y: from.y };
  const travel = Math.min(dist, distanceYalms * PX_PER_YALM);
  return clampPointInsideField({ x: from.x + dx / dist * travel, y: from.y + dy / dist * travel });
}

function chooseStackIntruderVariant(id) {
  if (id === 'D1') return 'bossUnder';
  if (id === 'H1') return Math.random() < 0.5 ? 'tankWheel' : 'rescue';
  if (id === 'H2') return Math.random() < 0.5 ? 'northEast' : 'rescue';
  if (id === 'D4') {
    const d4Choices = ['bossUnder', 'tankSideLeft', 'tankSideRight', 'tankNorthLeft', 'tankNorthRight', 'chargeMT'];
    return d4Choices[Math.floor(Math.random() * d4Choices.length)];
  }
  const choices = ['bossUnder', 'tankSideLeft', 'tankSideRight', 'tankNorthLeft', 'tankNorthRight'];
  const positionVariant = choices[Math.floor(Math.random() * choices.length)];
  // D2は前方移動と縮地のどちらかを使って侵入する。
  return id === 'D2' && Math.random() < 0.5 ? `shukuchi:${positionVariant}` : positionVariant;
}

function normalizedIntruderVariant(variant) {
  return typeof variant === 'string' && variant.startsWith('shukuchi:')
    ? variant.slice('shukuchi:'.length)
    : variant;
}

function isStSouthEmergencyPattern() {
  return game.dualArmRampageMode
    && game.stackShareStPattern === 'south'
    && selectedSlot !== 'ST';
}

function updateMtFollowStForSouthPattern() {
  if (game.stackRescuedHoldId === 'MT' || game.stackRescuePartnerHoldId === 'MT') return;
  // MTがNPCのST南事故では、通常の追従方向を反転し、MTがSTを追う。
  // 頭割り成立を優先し、着弾まで常に5m以内を維持する。
  if (!game.running || game.castType !== 'stackShare' || !game.stackShareMarker) return;
  if (!isStSouthEmergencyPattern() || selectedSlot === 'MT') return;
  const mtNpc = game.npcs.find(member => member.id === 'MT');
  const st = getParticipantById('ST');
  if (!mtNpc || !st) return;

  let dx = st.x - FIELD.x;
  let dy = st.y - FIELD.y;
  let radial = Math.hypot(dx, dy);
  if (radial < 0.001) {
    dx = 0;
    dy = 1;
    radial = 1;
  }
  // STより少しボス寄りに並び、完全には重ならない。
  const offset = 2.8 * PX_PER_YALM;
  const target = clampPointInsideField({
    x: st.x - dx / radial * offset,
    y: st.y - dy / radial * offset
  });
  mtNpc.tx = target.x;
  mtNpc.ty = target.y;
  const currentDistance = Math.hypot(mtNpc.x - st.x, mtNpc.y - st.y);
  mtNpc.moveSpeed = currentDistance > 5 * PX_PER_YALM ? 150 : 68;

  // フレーム遅延で5mを超えた場合だけ、安全側へ即時補正する。
  if (currentDistance > 5 * PX_PER_YALM) {
    const mx = mtNpc.x - st.x;
    const my = mtNpc.y - st.y;
    const len = Math.max(0.001, Math.hypot(mx, my));
    const corrected = clampPointInsideField({
      x: st.x + mx / len * 4.8 * PX_PER_YALM,
      y: st.y + my / len * 4.8 * PX_PER_YALM
    });
    mtNpc.x = corrected.x;
    mtNpc.y = corrected.y;
  }
}

function configureStackSouthRetreatEvent() {
  // 暴走モードでタンクが通常処理でない場合は、侵入イベントを行わず6人全員が退避する。
  if (!game.dualArmRampageMode || game.stackTankNormalSetup) {
    game.stackSouthRetreatStartOffset = null;
    return;
  }
  if (!(game.replayMode && Number.isFinite(game.runConfig?.stackSouthRetreatStartOffset))) {
    // 終末の双腕の詠唱50〜80%で全員が退避を開始する。
    game.stackSouthRetreatStartOffset = STACK_SHARE_CAST_DURATION_SECONDS * (0.5 + Math.random() * 0.3);
  }
  if (game.runConfig) {
    game.runConfig.stackSouthRetreatStartOffset = game.stackSouthRetreatStartOffset;
    game.runConfig.stackIntruderId = null;
    game.runConfig.stackIntruderVariant = null;
    game.runConfig.stackIntruderStartOffset = null;
  }
}

function configureStackIntruderEvent() {
  // タンク操作中かつNPCタンクが通常処理している場合は、必ず他6人からNPC1人を侵入者に選ぶ。
  const tankPractice = isTankPracticeSelected();
  if (!game.dualArmRampageMode || !game.stackTankNormalSetup || !tankPractice) {
    game.stackIntruderId = null;
    game.stackIntruderVariant = null;
    game.stackIntruderStartOffset = null;
    return;
  }
  if (game.replayMode && game.runConfig?.stackIntruderId) return;
  const candidates = ['D1','D2','D3','D4','H1','H2']
    .filter(id => id !== selectedSlot && game.npcs.some(npc => npc.id === id));
  if (!candidates.length) {
    // パーティ生成異常を黙って「何も起きない回」にしない。
    throw new Error('双腕暴走モード: 侵入候補NPCが見つかりません');
  }
  game.stackIntruderId = candidates[Math.floor(Math.random() * candidates.length)];
  game.stackIntruderVariant = chooseStackIntruderVariant(game.stackIntruderId);
  const intrusionWindowRatio = game.stackIntruderId === 'H2' ? 0.25 : 0.5;
  game.stackIntruderStartOffset = Math.random() * (STACK_SHARE_CAST_DURATION_SECONDS * intrusionWindowRatio);
  // 通常処理時は退避イベントを無効化し、必ず侵入イベントを優先する。
  game.stackSouthRetreatStartOffset = null;
  if (game.runConfig) {
    game.runConfig.stackIntruderId = game.stackIntruderId;
    game.runConfig.stackIntruderVariant = game.stackIntruderVariant;
    game.runConfig.stackIntruderStartOffset = game.stackIntruderStartOffset;
    game.runConfig.stackSouthRetreatStartOffset = null;
  }
}


function getRecordedRetreatTarget(key) {
  const saved = game.stackRetreatTargets?.[key];
  if (!saved || !Number.isFinite(saved.x) || !Number.isFinite(saved.y)) return null;
  return clampPointInsideField({ x: saved.x, y: saved.y });
}

function rememberRetreatTarget(key, target) {
  if (!key || !target || !Number.isFinite(target.x) || !Number.isFinite(target.y)) return;
  if (!game.stackRetreatTargets) game.stackRetreatTargets = {};
  game.stackRetreatTargets[key] = { x: target.x, y: target.y };
  if (game.runConfig) game.runConfig.stackRetreatTargets = structuredClone(game.stackRetreatTargets);
}

function resolveRetreatTarget(key, fallbackFactory) {
  const recorded = getRecordedRetreatTarget(key);
  if (recorded) return recorded;
  const target = clampPointInsideField(fallbackFactory());
  rememberRetreatTarget(key, target);
  return target;
}

function assignNpcRetreat(npc, target, options = {}) {
  if (!npc || !target) return;
  const {
    dashDuration = null,
    moveSpeed = 72,
    key = null,
    force = false
  } = options;
  const safeTarget = clampPointInsideField(target);
  if (key) rememberRetreatTarget(key, safeTarget);

  // 同じ退避先へ移動中なら再発行しない。緊急退避では速度だけ引き上げる。
  const sameTarget = Number.isFinite(npc.tx) && Number.isFinite(npc.ty)
    && Math.hypot(npc.tx - safeTarget.x, npc.ty - safeTarget.y) < 0.25 * PX_PER_YALM;
  if (sameTarget && !force) {
    npc.moveSpeed = Math.max(npc.moveSpeed || 0, moveSpeed);
    npc.skillLabel = null;
    npc.skillFlashUntil = 0;
    return;
  }

  npc.skillLabel = null;
  npc.skillFlashUntil = 0;
  if (dashDuration != null) {
    startNpcSkillEscape(npc, safeTarget, null, dashDuration);
    return;
  }
  npc.skillDash = null;
  npc.tx = safeTarget.x;
  npc.ty = safeTarget.y;
  npc.moveSpeed = moveSpeed;
}

function isPointOutsideDanger(point, origins, minimumYalms = 9) {
  return origins.every(origin => !origin || Math.hypot(point.x - origin.x, point.y - origin.y) / PX_PER_YALM >= minimumYalms);
}

function chooseDistributedRetreatTarget(npc, index, origins, requireWithinYalms = null) {
  const maxRadius = FIELD.radius / PX_PER_YALM - 1.0;
  const radii = [maxRadius, Math.max(13, maxRadius - 3), Math.max(11, maxRadius - 6)];
  const angles = [0,60,120,180,240,300,30,90,150,210,270,330].map(v => v * Math.PI / 180);
  const candidates = [];
  for (const radius of radii) {
    for (let step = 0; step < angles.length; step++) {
      const angle = angles[(step + index * 2) % angles.length];
      const point = clampPointInsideField({
        x: FIELD.x + Math.cos(angle) * radius * PX_PER_YALM,
        y: FIELD.y + Math.sin(angle) * radius * PX_PER_YALM
      });
      const travel = Math.hypot(point.x - npc.x, point.y - npc.y) / PX_PER_YALM;
      if (requireWithinYalms != null && travel > requireWithinYalms) continue;
      if (!isPointOutsideDanger(point, origins, 9.2)) continue;
      candidates.push({ point, travel });
    }
  }
  candidates.sort((a,b) => a.travel - b.travel);
  if (candidates.length) return candidates[0].point;

  const origin = origins.find(Boolean) || {x:FIELD.x,y:FIELD.y};
  let dx = npc.x - origin.x, dy = npc.y - origin.y;
  let len = Math.hypot(dx,dy);
  if (len < 0.001) { dx=0; dy=1; len=1; }
  const travel = (requireWithinYalms ?? 12) * PX_PER_YALM;
  return clampPointInsideField({x:npc.x+dx/len*travel,y:npc.y+dy/len*travel});
}

function retreatAllNonTanksFromPoint(origin) {
  const members = game.npcs.filter(npc => ['D1','D2','D3','D4','H1','H2'].includes(npc.id));
  const stackCenter = getParticipantById('MT') || origin;
  const origins = [origin, stackCenter];
  members.forEach((npc, index) => {
    const key = `rescue:${game.stackRescueHealerId || 'healer'}:${npc.id}`;
    const target = resolveRetreatTarget(key, () =>
      chooseDistributedRetreatTarget(npc, index, origins, npc.id === 'D2' ? 20 : null));
    assignNpcRetreat(npc, target, {
      key,
      dashDuration: npc.id === 'D2' ? 0.12 : null,
      moveSpeed: 88
    });
  });
}

function pullTankByRescue(healer, targetId) {
  const target = getParticipantById(targetId);
  if (!healer || !target) return false;
  const facing = Number.isFinite(healer.facing) ? healer.facing : -Math.PI / 2;
  const landing = clampPointInsideField({
    x: healer.x + Math.cos(facing) * 1.4 * PX_PER_YALM,
    y: healer.y + Math.sin(facing) * 1.4 * PX_PER_YALM
  });

  game.stackRescuedHoldId = null;
  game.stackRescuedHoldPoint = null;
  game.stackRescuePartnerHoldId = null;
  game.stackRescuePartnerHoldPoint = null;

  if (selectedSlot === targetId) {
    // 操作対象が救出された場合は、位置だけ強制移動する。
    game.player.x = landing.x;
    game.player.y = landing.y;

    // もう一方のNPCタンクは北側の現在位置から動かず待機する。
    const partnerId = targetId === 'MT' ? 'ST' : 'MT';
    const partner = game.npcs.find(member => member.id === partnerId);
    if (partner) {
      game.stackRescuePartnerHoldId = partnerId;
      game.stackRescuePartnerHoldPoint = { x: partner.x, y: partner.y };
      partner.tx = partner.x;
      partner.ty = partner.y;
      partner.moveSpeed = 0;
      partner.skillDash = null;
    }
  } else {
    const npc = game.npcs.find(member => member.id === targetId);
    if (!npc) return false;
    npc.skillDash = {
      fromX: npc.x, fromY: npc.y,
      toX: landing.x, toY: landing.y,
      startAt: game.elapsed, endAt: game.elapsed + 0.18
    };
    npc.tx = landing.x;
    npc.ty = landing.y;
    npc.moveSpeed = 0;

    // NPCが救出された場合は、救出先で頭割り終了まで待機する。
    game.stackRescuedHoldId = targetId;
    game.stackRescuedHoldPoint = { x: landing.x, y: landing.y };
  }
  game.stackRescueOrigin = { x: healer.x, y: healer.y };
  return true;
}

function triggerRescueIntrusion(healer) {
  if (!healer || game.stackRescueTriggered) return;
  game.stackRescueTriggered = true;
  game.stackRescueHealerId = healer.id;
  if (!game.stackRescueTargetId) game.stackRescueTargetId = Math.random() < 0.5 ? 'MT' : 'ST';
  if (game.runConfig) {
    game.runConfig.stackRescueHealerId = game.stackRescueHealerId;
    game.runConfig.stackRescueTargetId = game.stackRescueTargetId;
  }
  healer.skillLabel = '救出';
  healer.skillFlashUntil = game.elapsed + 1.2;
  const rescued = pullTankByRescue(healer, game.stackRescueTargetId);
  if (!rescued) return;
  // NPCタンクが救出された場合のみ、もう一方のNPCタンクは救出先へ追従する。
  // 操作対象が救出された場合は、相方NPCタンクを北側で待機させる。
  const partnerId = game.stackRescueTargetId === 'MT' ? 'ST' : 'MT';
  if (selectedSlot !== game.stackRescueTargetId && selectedSlot !== partnerId) {
    const partner = game.npcs.find(member => member.id === partnerId);
    const rescuedTank = getParticipantById(game.stackRescueTargetId);
    if (partner && rescuedTank) {
      const dx = rescuedTank.x - FIELD.x;
      const dy = rescuedTank.y - FIELD.y;
      const len = Math.max(0.001, Math.hypot(dx, dy));
      const follow = clampPointInsideField({
        x: rescuedTank.x + dx / len * 2.5 * PX_PER_YALM,
        y: rescuedTank.y + dy / len * 2.5 * PX_PER_YALM
      });
      partner.tx = follow.x;
      partner.ty = follow.y;
      partner.moveSpeed = 150;
    }
  }
  // 救出した本人を含む全DPS・ヒーラーが救出地点から9m以上離れる。
  DualArmRampageController.partyAI.onRescue(game.stackRescueOrigin);
}

function retreatTanksFromIntruder(intruder) {
  if (!intruder) return;
  // プレイヤータンクは自動移動させない。NPCのMTだけが侵入者と反対へ即座に移動し、STは追従する。
  if (selectedSlot !== 'MT') {
    const mtNpc = game.npcs.find(npc => npc.id === 'MT');
    if (mtNpc) {
      let dx = mtNpc.x - intruder.x;
      let dy = mtNpc.y - intruder.y;
      let len = Math.hypot(dx, dy);
      if (len < 0.001) { dx = 0; dy = -1; len = 1; }
      const target = clampPointInsideField({
        x: mtNpc.x + dx / len * 4.5 * PX_PER_YALM,
        y: mtNpc.y + dy / len * 4.5 * PX_PER_YALM
      });
      mtNpc.tx = target.x;
      mtNpc.ty = target.y;
      mtNpc.moveSpeed = 130;
      game.stackShareMtTarget = { x: target.x, y: target.y };
    }
  }
  // STの追従はsetStackShareStPositionの毎フレーム処理に任せる。
}

function triggerStackIntruder() {
  if (game.stackIntruderTriggered || !game.stackIntruderId) return;
  const npc = game.npcs.find(member => member.id === game.stackIntruderId);
  const mt = getParticipantById('MT');
  if (!npc || !mt) return;
  game.stackIntruderTriggered = true;
  const rawVariant = game.stackIntruderVariant;
  const variant = normalizedIntruderVariant(rawVariant);
  const usesShukuchi = npc.id === 'D2' && typeof rawVariant === 'string' && rawVariant.startsWith('shukuchi:');
  if (variant === 'rescue' && (npc.id === 'H1' || npc.id === 'H2')) {
    triggerRescueIntrusion(npc);
    return;
  }
  // 「ボス下」侵入は中心そのものではなく、頭割り側へ少し北寄りにする。
  const center = { x: FIELD.x, y: FIELD.y - 2.0 * PX_PER_YALM };
  let desired = center;
  if (variant === 'tankSideLeft') {
    desired = { x: mt.x - 2.2 * PX_PER_YALM, y: mt.y + 0.2 * PX_PER_YALM };
  } else if (variant === 'tankSideRight') {
    desired = { x: mt.x + 2.2 * PX_PER_YALM, y: mt.y + 0.2 * PX_PER_YALM };
  } else if (variant === 'tankNorthLeft') {
    desired = { x: mt.x - 0.8 * PX_PER_YALM, y: mt.y - 2.0 * PX_PER_YALM };
  } else if (variant === 'tankNorthRight') {
    desired = { x: mt.x + 0.8 * PX_PER_YALM, y: mt.y - 2.0 * PX_PER_YALM };
  } else if (variant === 'northEast') {
    // H2は徒歩なので早めに動き、ターゲットサークル北東の中央寄りまで入る。
    desired = yalmsToPoint(3.8, -3.8);
  } else if (variant === 'chargeMT') {
    // D4専用。MTへ一直線に突進し、頭割り範囲内でそのまま留まる。
    desired = { x: mt.x + 0.7 * PX_PER_YALM, y: mt.y + 0.2 * PX_PER_YALM };
  } else if (variant === 'tankWheel') {
    desired = { x: mt.x + 1.8 * PX_PER_YALM, y: mt.y + 0.7 * PX_PER_YALM };
  }
  desired = clampPointInsideField(desired);

  if (npc.id === 'D1') {
    // D1は移動スキルではなく、通常歩行より明確に速い走行で侵入する。
    npc.tx = desired.x;
    npc.ty = desired.y;
    npc.moveSpeed = 112;
    npc.skillLabel = null;
    npc.skillFlashUntil = 0;
  } else if (npc.id === 'D2') {
    if (usesShukuchi) {
      // 縮地は自身から20m以内の指定地点へ瞬間移動する。
      startNpcSkillEscape(npc, pointTowardDistance(npc, desired, 20), null, 0.12);
    } else {
      startNpcSkillEscape(npc, pointTowardDistance(npc, desired, 15), null, 0.26);
    }
  } else if (npc.id === 'D3') {
    startNpcSkillEscape(npc, pointTowardDistance(npc, desired, 10), '前方10m', 0.24);
  } else if (npc.id === 'D4') {
    if (variant === 'chargeMT') {
      startNpcSkillEscape(npc, desired, 'MTへ突進', 0.22);
    } else {
      startNpcSkillEscape(npc, pointTowardDistance(npc, desired, 15), 'スマッジ', 0.25);
    }
  } else if (npc.id === 'H1') {
    // H1はタンク横へ前方移動スキルで素早く移動し、着地後に運命の輪を展開する。
    // 展開後は終末の双腕着弾までその場から動かない。
    const landing = pointTowardDistance(npc, desired, H1_FORWARD_DISTANCE_YALMS);
    startNpcSkillEscape(npc, landing, null, 0.22);
    npc.pendingStackWheel = true;
    npc.stackWheelHoldUntil = game.wingCastEnd || (game.elapsed + STACK_SHARE_CAST_DURATION_SECONDS);
    npc.skillLabel = null;
    npc.skillFlashUntil = 0;
  } else if (npc.id === 'H2') {
    // H2は移動スキルを持たないため、侵入時は走って北東へ向かう。
    npc.tx = desired.x;
    npc.ty = desired.y;
    npc.moveSpeed = 108;
    // 移動行動名は頭上に表示しない。バフ表示のみを残す。
    npc.skillLabel = null;
    npc.skillFlashUntil = 0;
  }
  DualArmRampageController.tankAI.onIntrusion(npc);
  handleNorthSideDpsIntrusion();
}

function safeRetreatPoint(npc, distanceYalms) {
  const mt = getParticipantById('MT');
  const source = mt || { x: FIELD.x, y: FIELD.y };
  let dx = npc.x - source.x;
  let dy = npc.y - source.y;
  if (Math.hypot(dx, dy) < 0.001) { dx = 0; dy = 1; }
  const len = Math.hypot(dx, dy);
  return clampPointInsideField({
    x: npc.x + dx / len * distanceYalms * PX_PER_YALM,
    y: npc.y + dy / len * distanceYalms * PX_PER_YALM
  });
}


function isNorthSideDpsIntrusion() {
  return ['D1','D2','D3','D4'].includes(game.stackIntruderId)
    && ['tankNorthLeft','tankNorthRight','chargeMT'].includes(normalizedIntruderVariant(game.stackIntruderVariant));
}

function retreatPointForStackMember(npc, index) {
  const angles = [150, 120, 60, 30, 210, 330].map(deg => deg * Math.PI / 180);
  const angle = angles[index % angles.length];
  const radiusYalms = Math.min((FIELD.radius / PX_PER_YALM) - 1.2, 15.5);
  return clampPointInsideField({
    x: FIELD.x + Math.cos(angle) * radiusYalms * PX_PER_YALM,
    y: FIELD.y + Math.sin(angle) * radiusYalms * PX_PER_YALM
  });
}

function retreatRemainingFiveFromNorthIntrusion() {
  if (game.stackNorthRetreatTriggered || !isNorthSideDpsIntrusion()) return;
  game.stackNorthRetreatTriggered = true;
  const mt = getParticipantById('MT');
  const candidates = game.npcs.filter(npc => !['MT','ST', game.stackIntruderId].includes(npc.id));
  candidates.forEach((npc, index) => {
    const key = `northIntrusion:${game.stackIntruderId}:${npc.id}`;
    const target = resolveRetreatTarget(key, () =>
      chooseDistributedRetreatTarget(npc, index, [mt], npc.id === 'D2' ? 20 : null));
    const dashIds = new Set(['D1','D2','D3','D4','H1']);
    assignNpcRetreat(npc, target, {
      key,
      dashDuration: dashIds.has(npc.id) ? (npc.id === 'D2' ? 0.18 : 0.24) : null,
      moveSpeed: 68
    });
  });
}

function handleNorthSideDpsIntrusion() {
  if (game.stackNorthIntrusionHandled || !isNorthSideDpsIntrusion()) return;
  game.stackNorthIntrusionHandled = true;

  // MT NPCは侵入者と反対側へ頭割り位置をずらす。操作キャラクターのMTは自動移動させない。
  if (selectedSlot !== 'MT') {
    const mtNpc = game.npcs.find(npc => npc.id === 'MT');
    if (mtNpc) {
      const intruder = getParticipantById(game.stackIntruderId);
      const intrusionVariant = normalizedIntruderVariant(game.stackIntruderVariant);
      const intruderOnLeft = intrusionVariant === 'tankNorthLeft'
        || (intrusionVariant === 'chargeMT' && intruder && intruder.x < mtNpc.x);
      const sideYalms = intruderOnLeft ? 3.4 : -3.4;
      const northYalms = -(BOSS_BOSS_TARGET_CIRCLE_RADIUS_YALMS + 0.5);
      const target = yalmsToPoint(sideYalms, northYalms);
      mtNpc.tx = target.x;
      mtNpc.ty = target.y;
      mtNpc.moveSpeed = 54;
      game.stackShareMtTarget = { x: target.x, y: target.y };
      mtNpc.skillLabel = null;
      mtNpc.skillFlashUntil = 0;
    }
  }

  // ST NPCは以後の毎フレーム追従処理でMTへ合わせる。
  retreatRemainingFiveFromNorthIntrusion();
}

function freeRetreatPointOutsideStack(npc, index, requireWithinYalms = null) {
  const st = getParticipantById('ST');
  const mt = getParticipantById('MT');
  // ST南事故では最終的な頭割り中心はST付近になるため、STを優先して基準にする。
  const stackCenter = isStSouthEmergencyPattern() && st ? st : (mt || { x: FIELD.x, y: FIELD.y });
  const maxRadius = FIELD.radius / PX_PER_YALM - 1.0;
  const radii = [maxRadius, Math.max(12, maxRadius - 3), Math.max(10, maxRadius - 6)];
  const baseAngles = [0, 60, 120, 180, 240, 300, 30, 90, 150, 210, 270, 330];
  const candidates = [];
  for (const radius of radii) {
    for (let i = 0; i < baseAngles.length; i++) {
      const deg = baseAngles[(i + index * 2) % baseAngles.length];
      const angle = deg * Math.PI / 180;
      const point = clampPointInsideField({
        x: FIELD.x + Math.cos(angle) * radius * PX_PER_YALM,
        y: FIELD.y + Math.sin(angle) * radius * PX_PER_YALM
      });
      const stackDistance = Math.hypot(point.x - stackCenter.x, point.y - stackCenter.y) / PX_PER_YALM;
      const travelDistance = Math.hypot(point.x - npc.x, point.y - npc.y) / PX_PER_YALM;
      if (stackDistance <= STACK_SHARE_RADIUS / PX_PER_YALM + 1.0) continue;
      if (requireWithinYalms != null && travelDistance > requireWithinYalms) continue;
      candidates.push({ point, stackDistance, travelDistance });
    }
  }
  if (!candidates.length) {
    // 縮地の20m制約などで候補がない場合は、現在位置から頭割り中心と反対へ最大距離移動。
    let dx = npc.x - stackCenter.x;
    let dy = npc.y - stackCenter.y;
    let len = Math.hypot(dx, dy);
    if (len < 0.001) { dx = 0; dy = 1; len = 1; }
    const travel = (requireWithinYalms ?? 12) * PX_PER_YALM;
    return clampPointInsideField({ x: npc.x + dx / len * travel, y: npc.y + dy / len * travel });
  }
  // 頭割りから遠く、かつ移動距離が過剰でない候補を優先する。
  candidates.sort((a, b) => (b.stackDistance - a.stackDistance) || (a.travelDistance - b.travelDistance));
  return candidates[0].point;
}

function retreatAllNonTanksForStSouth() {
  if (game.stackSouthRetreatTriggered || !game.dualArmRampageMode || game.stackTankNormalSetup) return;
  game.stackSouthRetreatTriggered = true;

  game.stackIntruderId = null;
  game.stackIntruderVariant = null;
  game.stackIntruderStartOffset = null;
  game.stackIntruderTriggered = false;

  const mt = getParticipantById('MT');
  const st = getParticipantById('ST');
  const forceAll = isStSouthEmergencyPattern();
  const stackCenter = forceAll && st ? st : mt;
  const candidates = game.npcs.filter(npc => {
    if (['MT','ST'].includes(npc.id)) return false;
    if (forceAll) return true;
    if (!stackCenter) return false;
    const currentRisk = Math.hypot(npc.x-stackCenter.x,npc.y-stackCenter.y) <= STACK_SHARE_RADIUS + PLAYER_HIT_RADIUS;
    const px=Number.isFinite(npc.tx)?npc.tx:npc.x, py=Number.isFinite(npc.ty)?npc.ty:npc.y;
    const plannedRisk = Math.hypot(px-stackCenter.x,py-stackCenter.y) <= STACK_SHARE_RADIUS + PLAYER_HIT_RADIUS;
    return currentRisk || plannedRisk;
  });

  candidates.forEach((npc,index)=>{
    const key = `${forceAll?'stSouth':'abnormalTank'}:${npc.id}`;
    const target = resolveRetreatTarget(key, () =>
      chooseDistributedRetreatTarget(npc,index,[stackCenter],npc.id==='D2'?20:null));
    assignNpcRetreat(npc,target,{
      key,
      dashDuration: forceAll && npc.id==='D2' ? 0.12 : (!forceAll && ['D1','D2','D3','D4','H1'].includes(npc.id) ? (npc.id==='D2'?0.18:0.24) : null),
      moveSpeed: forceAll ? 68 : 72
    });
  });
}

function retreatNonTanksFromStackShare() {
  if (game.stackEscapeTriggered || game.stackTankNormalSetup) return;
  const mt = getParticipantById('MT');
  if (!mt) return;
  game.stackEscapeTriggered = true;
  for (const npc of game.npcs) {
    if (npc.id === 'MT' || npc.id === 'ST') continue;
    const atRisk = Math.hypot(npc.x - mt.x, npc.y - mt.y) <= STACK_SHARE_RADIUS + PLAYER_HIT_RADIUS + 0.5 * PX_PER_YALM;
    if (!atRisk) continue;
    if (npc.id === 'D1') startNpcSkillEscape(npc, safeRetreatPoint(npc, 10), '後方ステップ', 0.22);
    else if (npc.id === 'D2') startNpcSkillEscape(npc, safeRetreatPoint(npc, 15), '縮地', 0.18);
    else if (npc.id === 'D3') startNpcSkillEscape(npc, safeRetreatPoint(npc, 10), '前方10m', 0.22);
    else if (npc.id === 'D4') startNpcSkillEscape(npc, safeRetreatPoint(npc, 15), 'スマッジ', 0.22);
    else if (npc.id === 'H1') startNpcSkillEscape(npc, safeRetreatPoint(npc, 15), '前方15m', 0.24);
    else {
      const target = safeRetreatPoint(npc, 8);
      npc.tx = target.x;
      npc.ty = target.y;
      npc.moveSpeed = 58;
      npc.skillLabel = '退避';
      npc.skillFlashUntil = game.elapsed + 0.8;
    }
  }
}


function chooseEmergencyRunPoint(npc, mt, index) {
  const safeRadiusYalms = 11.2;
  let baseAngle = Math.atan2(npc.y - mt.y, npc.x - mt.x);
  if (!Number.isFinite(baseAngle)) baseAngle = Math.PI / 2;
  const offsets = [0, 0.42, -0.42, 0.78, -0.78, 1.15, -1.15, Math.PI];
  let best = null;
  for (let i = 0; i < offsets.length; i++) {
    const angle = baseAngle + offsets[(i + index) % offsets.length];
    const point = clampPointInsideField({
      x: mt.x + Math.cos(angle) * safeRadiusYalms * PX_PER_YALM,
      y: mt.y + Math.sin(angle) * safeRadiusYalms * PX_PER_YALM
    });
    const distanceFromMt = Math.hypot(point.x - mt.x, point.y - mt.y) / PX_PER_YALM;
    if (distanceFromMt <= 9.4) continue;
    const travel = Math.hypot(point.x - npc.x, point.y - npc.y);
    if (!best || travel < best.travel) best = { point, travel };
  }
  if (best) return best.point;
  return freeRetreatPointOutsideStack(npc, index, null);
}

function triggerLastMomentEmergencyRun() {
  if (game.stackEmergencyRunTriggered) return;
  if (!game.running || game.castType !== 'stackShare' || !game.stackShareMarker) return;
  if (!Number.isFinite(game.wingCastEnd)) return;
  const remaining = game.wingCastEnd - game.elapsed;
  if (remaining > 0.7 || remaining < 0) return;

  const mt = getParticipantById('MT');
  if (!mt) return;
  game.stackEmergencyRunTriggered = true;

  const runners = game.npcs.filter(npc =>
    ['D1','D2','D3','D4','H1','H2'].includes(npc.id)
    && Math.hypot(npc.x-mt.x,npc.y-mt.y) <= 9 * PX_PER_YALM);

  runners.forEach((npc,index)=>{
    const key = `emergency:${npc.id}`;
    const target = resolveRetreatTarget(key, () => chooseEmergencyRunPoint(npc,mt,index));
    assignNpcRetreat(npc,target,{key,moveSpeed:245,force:true});
  });
}

function enforceStackShareStMaxDistance() {
  if (game.stackRescuedHoldId === 'ST' || game.stackRescuePartnerHoldId === 'ST') return;
  // 双腕暴走モードの侵入イベント中は、ST NPCを常にMTから5m以内に保つ。
  // 通常の追従移動に加え、1フレームの遅れで5mを超えた場合だけ境界内へ補正する。
  if (!game.running || game.castType !== 'stackShare' || !game.stackShareMarker) return;
  if (!game.dualArmRampageMode || !game.stackIntruderTriggered || !game.stackIntruderId) return;
  if (selectedSlot === 'ST') return;
  const mt = getParticipantById('MT');
  const stNpc = game.npcs.find(member => member.id === 'ST');
  if (!mt || !stNpc) return;
  const dx = stNpc.x - mt.x;
  const dy = stNpc.y - mt.y;
  const distance = Math.hypot(dx, dy);
  const maxDistance = ST_FOLLOW_MAX_DISTANCE_YALMS * PX_PER_YALM;
  if (!Number.isFinite(distance) || distance <= maxDistance) return;
  const safeDistance = (ST_FOLLOW_MAX_DISTANCE_YALMS - 0.15) * PX_PER_YALM;
  const ux = distance > 0.001 ? dx / distance : 0;
  const uy = distance > 0.001 ? dy / distance : -1;
  const corrected = clampPointInsideField({
    x: mt.x + ux * safeDistance,
    y: mt.y + uy * safeDistance
  });
  stNpc.x = corrected.x;
  stNpc.y = corrected.y;
  stNpc.tx = corrected.x;
  stNpc.ty = corrected.y;
}

function updateStackShareFollowerAndRetreat() {
  // v1.3.0互換ラッパー。判断は統合コントローラーへ委譲する。
  DualArmRampageController.update();
}

function clampPointInsideField(point, marginYalms = 0.6) {
  const dx = point.x - FIELD.x;
  const dy = point.y - FIELD.y;
  const dist = Math.hypot(dx, dy);
  const maxDist = FIELD.radius - marginYalms * PX_PER_YALM;
  if (dist <= maxDist || dist < 0.001) return point;
  return { x: FIELD.x + dx / dist * maxDist, y: FIELD.y + dy / dist * maxDist };
}

function startNpcSkillEscape(npc, target, label, duration = 0.24) {
  const safeTarget = clampPointInsideField(target);
  npc.skillDash = {
    fromX: npc.x,
    fromY: npc.y,
    toX: safeTarget.x,
    toY: safeTarget.y,
    startAt: game.elapsed,
    endAt: game.elapsed + duration
  };
  npc.tx = safeTarget.x;
  npc.ty = safeTarget.y;
  npc.skillLabel = label;
  npc.skillFlashUntil = game.elapsed + 0.9;
}


function enforceRescueTankHolds() {
  if (!game.running || game.castType !== 'stackShare' || !game.stackShareMarker) return;

  if (game.stackRescuedHoldId && game.stackRescuedHoldPoint) {
    const npc = game.npcs.find(member => member.id === game.stackRescuedHoldId);
    if (npc) {
      const dashActive = npc.skillDash && game.elapsed < npc.skillDash.endAt;
      if (!dashActive) {
        npc.x = game.stackRescuedHoldPoint.x;
        npc.y = game.stackRescuedHoldPoint.y;
        npc.tx = game.stackRescuedHoldPoint.x;
        npc.ty = game.stackRescuedHoldPoint.y;
        npc.moveSpeed = 0;
        npc.skillDash = null;
      }
    }
  }

  if (game.stackRescuePartnerHoldId && game.stackRescuePartnerHoldPoint) {
    const npc = game.npcs.find(member => member.id === game.stackRescuePartnerHoldId);
    if (npc) {
      npc.x = game.stackRescuePartnerHoldPoint.x;
      npc.y = game.stackRescuePartnerHoldPoint.y;
      npc.tx = game.stackRescuePartnerHoldPoint.x;
      npc.ty = game.stackRescuePartnerHoldPoint.y;
      npc.moveSpeed = 0;
      npc.skillDash = null;
    }
  }
}

/**
 * 双腕暴走モード統合コントローラー (v1.3.5)
 *
 * 既存の描画・移動関数は維持しつつ、判断の入口を次の4領域へ統一する。
 * 1. eventManager: 侵入／全員退避の選択
 * 2. tankAI: MT/ST追従・侵入者回避・救出後追従
 * 3. partyAI: DPS/ヒーラー侵入・通常退避・救出後退避
 * 4. emergencyAI: 着弾直前9m判定
 */
const DualArmRampageController = Object.freeze({
  eventManager: Object.freeze({
    configureForCast() {
      configureStackSouthRetreatEvent();
      configureStackIntruderEvent();
    },
    update() {
      if (!game.dualArmRampageMode) return;
      if (game.stackTankNormalSetup) {
        // タンク操作時、NPCタンクに異常行動がない回は必ずNPC6人から1人が侵入する。
        if (!game.stackIntruderId) configureStackIntruderEvent();
        if (isTankPracticeSelected() && !game.stackIntruderId) {
          throw new Error('双腕暴走モード: 必須侵入イベントの選択に失敗しました');
        }
        const startAt = (game.wingCastStart || 0) + (game.stackIntruderStartOffset || 0);
        if (!game.stackIntruderTriggered && game.elapsed >= startAt) triggerStackIntruder();
        if (game.stackIntruderTriggered) handleNorthSideDpsIntrusion();
        return;
      }
      // タンクが通常処理でない場合、侵入は発生させずDPS/ヒーラーを退避。
      const startAt = (game.wingCastStart || 0) + (game.stackSouthRetreatStartOffset || 0);
      if (!game.stackSouthRetreatTriggered && game.elapsed >= startAt) {
        retreatAllNonTanksForStSouth();
      }
    }
  }),
  tankAI: Object.freeze({
    update() {
      enforceRescueTankHolds();
      // 通常のST追従、ST南事故時のMT逆追従を同じ入口から更新。
      setStackShareStPosition();
      updateMtFollowStForSouthPattern();
      enforceStackShareStMaxDistance();
    },
    onIntrusion(intruder) {
      retreatTanksFromIntruder(intruder);
    }
  }),
  partyAI: Object.freeze({
    onRescue(origin) {
      retreatAllNonTanksFromPoint(origin);
    },
    onAbnormalTankSetup() {
      retreatAllNonTanksForStSouth();
    }
  }),
  emergencyAI: Object.freeze({
    update() {
      triggerLastMomentEmergencyRun();
    }
  }),
  configureForCast() {
    this.eventManager.configureForCast();
  },
  update() {
    if (!game.running || game.castType !== 'stackShare' || !game.stackShareMarker) return;
    this.tankAI.update();
    this.emergencyAI.update();
    this.eventManager.update();
  }
});

function startStackShareCast() {
  game.castType = 'stackShare';
  game.wingCastStart = game.elapsed;
  game.wingCastEnd = game.elapsed + STACK_SHARE_CAST_DURATION_SECONDS;
  game.stackShareMarker = true;
  setStackShareNpcPositions();
  setStackShareStPosition();
  game.stackTankNormalSetup = isNormalStackTankSetup();
  DualArmRampageController.configureForCast();
  castBarLabel.textContent = '終末の双腕';
}

function activateStackShare() {
  game.wingCastStart = null;
  game.wingCastEnd = null;
  game.castType = null;
  game.stackShareMarker = false;
  game.stackIntruderWheel = null;
  game.stackNorthIntrusionHandled = false;
  game.stackNorthRetreatTriggered = false;
  game.stackSouthRetreatTriggered = false;
  game.stackEmergencyRunTriggered = false;
  game.stackRescueTriggered = false;
  game.stackRescueOrigin = null;
  game.stackRescuedHoldId = null;
  game.stackRescuedHoldPoint = null;
  game.stackRescuePartnerHoldId = null;
  game.stackRescuePartnerHoldPoint = null;
  castBar.classList.add('hidden');
  const participants = getPartyParticipants();
  const mt = participants.find(member => member.id === 'MT');
  if (!mt) {
    addFailureReason('終末の双腕：MTが見つかりません');
    return;
  }
  const inside = participants.filter(member => Math.hypot(member.x - mt.x, member.y - mt.y) <= STACK_SHARE_RADIUS + PLAYER_HIT_RADIUS);
  const ids = new Set(inside.map(member => member.id));
  const reasons = [];
  if (!ids.has('ST')) reasons.push('終末の双腕：STが頭割り範囲にいません');

  for (const member of inside) {
    if (member.id !== 'MT' && member.id !== 'ST') reasons.push(`終末の双腕：${member.id}が頭割り範囲に入りました`);
  }
  game.activeAoEs.push({ type:'stackShare', x:mt.x, y:mt.y, aoeRadius:STACK_SHARE_RADIUS, started:game.elapsed, expires:game.elapsed + 0.8 });
  addFailureReasons(reasons);
}

function activateTrineGroup(groupIndex) {
  const group = game.trineGroups[groupIndex];
  const ids = new Set(group.map(trine => trine.id));
  game.visibleTrines = game.visibleTrines.filter(trine => !ids.has(trine.id));
  const vertices = group.flatMap(trine => trine.vertices);
  game.activeAoEs.push({
    type:'trine', groupIndex, vertices,
    aoeRadius:TRINE_AOE_RADIUS,
    started:game.elapsed,
    expires:game.elapsed + .75
  });
  checkTrineHitAtActivation(vertices);
}

function addFailureReason(reason) {
  if (!reason || game.finished) return;
  if (!game.failureReasons.includes(reason)) game.failureReasons.push(reason);
}

function addFailureReasons(reasons) {
  for (const reason of reasons) addFailureReason(reason);
}

function saveReplayData(clear) {
  if (game.replayMode) return;
  lastReplayData = {
    role: selectedRole,
    slot: selectedSlot,
    config: {
      wingSide: game.runConfig.wingSide,
      rotationStep: game.runConfig.rotationStep,
      centerPattern: game.runConfig.centerPattern,
      stackShareMtPattern: game.runConfig.stackShareMtPattern,
      stackShareStPattern: game.runConfig.stackShareStPattern,
      dualArmRampageMode: game.runConfig.dualArmRampageMode,
      trineWingOnlyMode: game.runConfig.trineWingOnlyMode,
      stackIntruderId: game.runConfig.stackIntruderId,
      stackIntruderVariant: game.runConfig.stackIntruderVariant,
      stackIntruderStartOffset: game.runConfig.stackIntruderStartOffset,
      stackSouthRetreatStartOffset: game.runConfig.stackSouthRetreatStartOffset,
      stackRescueHealerId: game.runConfig.stackRescueHealerId,
      stackRescueTargetId: game.runConfig.stackRescueTargetId,
      outerLayout: {
        first: [...game.runConfig.outerLayout.first],
        second: game.runConfig.outerLayout.second,
        thirdOuter: [...game.runConfig.outerLayout.thirdOuter]
      }
    },
    frames: game.recordingFrames.map(frame => ({ ...frame })),
    clear,
    reasons: [...game.failureReasons]
  };
  replayButton.disabled = false;
  sideReplayButton.disabled = false;
}

function finish(clear, reason = '') {
  if (game.finished) return;
  if (!clear && reason) addFailureReason(reason);
  if (!clear && game.failureReasons.length === 0) addFailureReason('不明な失敗');

  game.running = false;
  game.finished = true;
  game.phase = clear ? (game.replayMode ? 'リプレイ完了' : '完了') : (game.replayMode ? 'リプレイ失敗' : '失敗');
  resultTitle.textContent = clear ? (game.replayMode ? 'Replay Clear' : 'Clear!') : (game.replayMode ? 'Replay Failed' : 'Failed');
  resultReason.replaceChildren();
  if (!clear) {
    const list = document.createElement('ul');
    for (const item of game.failureReasons) {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    }
    resultReason.appendChild(list);
  }
  game.telegraphWing = false;
  game.wingCastStart = null;
  game.wingCastEnd = null;
  game.castType = null;
  castBar.classList.add('hidden');
  overlay.classList.remove('hidden');
  setRoleSelectionLocked(false);
  saveReplayData(clear);
  replayButton.disabled = !lastReplayData;
  sideReplayButton.disabled = !lastReplayData;
}

function checkWingHitAtActivation() {
  if (!game.running) return;
  const hit = game.wingSide === 'left'
    ? game.player.x - PLAYER_HIT_RADIUS < FIELD.x
    : game.player.x + PLAYER_HIT_RADIUS > FIELD.x;
  if (hit) addFailureReason('破壊の翼（半面）に当たりました');
}

function checkTrineHitAtActivation(vertices) {
  if (!game.running) return;
  const hitCount = vertices.filter(vertex =>
    Math.hypot(game.player.x - vertex.x, game.player.y - vertex.y) <= TRINE_AOE_RADIUS + PLAYER_HIT_RADIUS
  ).length;
  if (hitCount > 0) addFailureReason(`トラインAoEに当たりました${hitCount > 1 ? `（${hitCount}箇所）` : ''}`);
}

function updateNPCs(dt) {
  for (const npc of game.npcs) {
    // 不正座標が1体に発生してもシミュレーション全体を停止させない。
    if (![npc.x, npc.y, npc.tx, npc.ty].every(Number.isFinite)) {
      const fallback = npcFormationTarget(npc.id, '接敵');
      npc.x = Number.isFinite(npc.x) ? npc.x : fallback.x;
      npc.y = Number.isFinite(npc.y) ? npc.y : fallback.y;
      npc.tx = Number.isFinite(npc.tx) ? npc.tx : fallback.x;
      npc.ty = Number.isFinite(npc.ty) ? npc.ty : fallback.y;
      npc.skillDash = null;
    }
    if (npc.skillDash) {
      const span = Math.max(0.001, npc.skillDash.endAt - npc.skillDash.startAt);
      const t = Math.max(0, Math.min(1, (game.elapsed - npc.skillDash.startAt) / span));
      const eased = 1 - Math.pow(1 - t, 3);
      npc.x = npc.skillDash.fromX + (npc.skillDash.toX - npc.skillDash.fromX) * eased;
      npc.y = npc.skillDash.fromY + (npc.skillDash.toY - npc.skillDash.fromY) * eased;
      const dx = npc.skillDash.toX - npc.skillDash.fromX;
      const dy = npc.skillDash.toY - npc.skillDash.fromY;
      if (Math.hypot(dx, dy) > 0.01) npc.facing = Math.atan2(dy, dx);
      if (t < 1) continue;
      npc.x = npc.skillDash.toX;
      npc.y = npc.skillDash.toY;
      npc.skillDash = null;
      if (npc.pendingStackWheel) {
        npc.pendingStackWheel = false;
        npc.tx = npc.x;
        npc.ty = npc.y;
        npc.moveSpeed = 0;
        npc.stackWheelHoldUntil = npc.stackWheelHoldUntil || game.wingCastEnd || (game.elapsed + 5);
        game.stackIntruderWheel = {
          ownerId: npc.id,
          radius: H1_WHEEL_RADIUS_YALMS * PX_PER_YALM,
          expiresAt: npc.stackWheelHoldUntil
        };
        applyTimedRoleBuff('運命の輪', H1_WHEEL_BUFF_DURATION_SECONDS, H1_WHEEL_BUFF_RANGE_YALMS, npc.x, npc.y);
        npc.skillLabel = '運命の輪';
        npc.skillFlashUntil = npc.stackWheelHoldUntil;
      }
    }
    if (npc.stackWheelHoldUntil && game.elapsed < npc.stackWheelHoldUntil) {
      npc.tx = npc.x;
      npc.ty = npc.y;
      npc.moveSpeed = 0;
      continue;
    } else if (npc.stackWheelHoldUntil && game.elapsed >= npc.stackWheelHoldUntil) {
      npc.stackWheelHoldUntil = 0;
      npc.skillLabel = null;
      npc.skillFlashUntil = 0;
    }
    if (game.npcState === '中央待機') {
      const index = partyRoster.findIndex(member => member.id === npc.id);
      const base = npcFormationTarget(npc.id, '中央待機');
      const phase = game.elapsed * 0.85 + index * 0.9;
      const driftRadius = (0.18 + (index % 3) * 0.04) * PX_PER_YALM;
      npc.tx = base.x + Math.cos(phase) * driftRadius;
      npc.ty = base.y + Math.sin(phase * 0.9) * driftRadius;
      npc.moveSpeed = CENTRAL_WAIT_SPEED;
    }
    const dx = npc.tx - npc.x;
    const dy = npc.ty - npc.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 1) {
      npc.facing = Math.atan2(dy, dx);
      const step = Math.min(dist, (npc.moveSpeed || NPC_SPEED) * dt);
      npc.x += dx / dist * step;
      npc.y += dy / dist * step;
    }
  }
}


function readGamepadInput() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const pad = Array.from(pads || []).find(Boolean);
  if (!pad) {
    return { x: 0, y: 0 };
  }

  const deadzone = 0.18;
  let x = Number.isFinite(pad.axes?.[0]) ? pad.axes[0] : 0;
  let y = Number.isFinite(pad.axes?.[1]) ? pad.axes[1] : 0;
  const magnitude = Math.hypot(x, y);
  if (magnitude < deadzone) {
    x = 0;
    y = 0;
  } else if (magnitude > 1) {
    x /= magnitude;
    y /= magnitude;
  }

  return { x, y };
}

function update(dt) {
  if (!game.running) return;
  game.elapsed += dt;
  game.bossPulse = Math.max(0, game.bossPulse - dt * 2.2);
  if (game.soil) {
    while (game.elapsed >= game.soil.nextBuffRefreshAt && game.soil.nextBuffRefreshAt < game.soil.expiresAt) {
      applySoilBuffPulse();
      game.soil.nextBuffRefreshAt += SOIL_BUFF_REFRESH_INTERVAL_SECONDS;
    }
    if (game.elapsed >= game.soil.expiresAt) game.soil = null;
  }
  for (const [id, expiresAt] of Object.entries(game.soilBuffs)) {
    if (game.elapsed >= expiresAt) delete game.soilBuffs[id];
  }
  for (const [id, buffs] of Object.entries(game.roleBuffs)) {
    for (const [name, expiresAt] of Object.entries(buffs)) {
      if (game.elapsed >= expiresAt) delete buffs[name];
    }
    if (!Object.keys(buffs).length) delete game.roleBuffs[id];
  }
  if (game.h1Star && game.elapsed >= game.h1Star.expiresAt) detonateH1Star();
  if (game.d4LeyLines && game.elapsed >= game.d4LeyLines.expiresAt) game.d4LeyLines = null;
  if (game.h1Wheel && Math.hypot(game.player.x - game.h1Wheel.x, game.player.y - game.h1Wheel.y) > 0.5) {
    game.h1Wheel = null;
  }

  if (game.replayMode) {
    while (game.replayCursor + 1 < game.replayFrames.length
      && game.replayFrames[game.replayCursor + 1].t <= game.elapsed) {
      game.replayCursor += 1;
    }
    const current = game.replayFrames[game.replayCursor];
    const next = game.replayFrames[Math.min(game.replayCursor + 1, game.replayFrames.length - 1)];
    if (current && next) {
      const span = Math.max(0.0001, next.t - current.t);
      const alpha = Math.max(0, Math.min(1, (game.elapsed - current.t) / span));
      const replayDx = next.x - current.x;
      const replayDy = next.y - current.y;
      if (current.facing !== undefined) game.player.facing = current.facing;
      else if (Math.hypot(replayDx, replayDy) > 0.2) game.player.facing = Math.atan2(replayDy, replayDx);
      game.player.x = current.x + replayDx * alpha;
      game.player.y = current.y + replayDy * alpha;
      game.d2Gate = current.d2Gate ? { ...current.d2Gate } : null;
      game.d1CooldownUntil = current.d1CooldownUntil ? { ...current.d1CooldownUntil } : { 1: 0, 2: 0 };
      game.d2CooldownUntil = current.d2CooldownUntil || 0;
      game.d2ShukuchiRechargeEnds = [...(current.d2ShukuchiRechargeEnds || [])];
      game.mtDashRechargeEnds = current.mtDashRechargeEnds ? [...current.mtDashRechargeEnds] : [];
      game.d3DashRechargeEnds = current.d3DashRechargeEnds ? [...current.d3DashRechargeEnds] : [];
      game.d4LeyLines = current.d4LeyLines ? { ...current.d4LeyLines } : null;
      game.d4SpeedBuffUntil = current.d4SpeedBuffUntil || 0;
    }
  } else {
    if (game.dash) {
      const span = Math.max(0.001, game.dash.endAt - game.dash.startAt);
      const alpha = Math.max(0, Math.min(1, (game.elapsed - game.dash.startAt) / span));
      const eased = 1 - Math.pow(1 - alpha, 3);
      game.player.x = game.dash.fromX + (game.dash.toX - game.dash.fromX) * eased;
      game.player.y = game.dash.fromY + (game.dash.toY - game.dash.fromY) * eased;
      if (alpha >= 1) game.dash = null;
    } else {
      let dx = 0;
      let dy = 0;
      if (keys.has('KeyW') || keys.has('ArrowUp')) dy -= 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) dy += 1;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) dx -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) dx += 1;
      const gamepad = readGamepadInput();
      dx += gamepad.x;
      dy += gamepad.y;
      if (dx || dy) {
        const len = Math.hypot(dx, dy);
        const scale = Math.min(1, len);
        game.player.facing = Math.atan2(dy, dx);
        const moveSpeed = MOVE_SPEED + (game.d4SpeedBuffUntil > game.elapsed ? D4_SMUDGE_SPEED_BONUS_YALMS_PER_SECOND * PX_PER_YALM : 0);
        game.player.x += dx / len * moveSpeed * scale * dt;
        game.player.y += dy / len * moveSpeed * scale * dt;
      }
    }
    if (game.d2Gate && game.elapsed >= game.d2Gate.expiresAt) clearD2Gate();
    game.recordingFrames.push(snapshotReplayFrame());
  }

  DualArmRampageController.update();
  updateNPCs(dt);

  const dist = Math.hypot(game.player.x - FIELD.x, game.player.y - FIELD.y);
  if (dist + PLAYER_HIT_RADIUS > FIELD.radius) addFailureReason('フィールド外へ落下しました');

  for (const event of game.events) {
    if (!event.done && game.elapsed >= event.time) {
      event.done = true;
      event.action();
    }
  }

  if (game.failureReasons.length > 0) {
    finish(false);
    return;
  }

  game.activeAoEs = game.activeAoEs.filter(aoe => aoe.expires > game.elapsed);

  const hasActiveBossCast =
    game.castType !== null &&
    game.wingCastStart !== null &&
    game.wingCastEnd !== null;

  if (hasActiveBossCast) {
    const duration = Math.max(0.001, game.wingCastEnd - game.wingCastStart);
    const progress = Math.max(0, Math.min(1, (game.elapsed - game.wingCastStart) / duration));
    castBar.classList.remove('hidden');
    castBarFill.style.width = `${progress * 100}%`;
  } else {
    castBar.classList.add('hidden');
    castBarFill.style.width = '0%';
  }
}

function drawFloorCircles() {
  for (let radiusYalms = FIELD.radiusYalms; radiusYalms >= 4; radiusYalms -= 2) {
    ctx.beginPath();
    ctx.arc(FIELD.x, FIELD.y, radiusYalms * PX_PER_YALM, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawWingBlade(side, angle, glowing) {
  const direction = side === 'left' ? -1 : 1;
  ctx.save();
  ctx.translate(FIELD.x + direction * 34, FIELD.y - 3);
  ctx.rotate(direction * angle);
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.lineTo(direction * 64, -13);
  ctx.lineTo(direction * 94, 0);
  ctx.lineTo(direction * 64, 13);
  ctx.lineTo(0, 5);
  ctx.closePath();
  ctx.fillStyle = glowing ? '#ffffff' : '#e7e7ee';
  ctx.strokeStyle = glowing ? '#ffffff' : '#bfc3cf';
  ctx.lineWidth = glowing ? 3.5 : 2;
  if (glowing) {
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 14;
  }
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawBossWing(side, glowing) {
  drawWingBlade(side, Math.PI / 5, glowing);
  drawWingBlade(side, -Math.PI / 5, glowing);
}

function drawBoss() {
  ctx.save();
  ctx.translate(FIELD.x, FIELD.y);
  // ターゲットサークルは薄い赤色。後方（南側）の1/4だけ枠線を開ける。
  ctx.beginPath();
  ctx.arc(0, 0, BOSS_TARGET_CIRCLE_RADIUS, Math.PI * 3 / 4, Math.PI * 2 + Math.PI / 4);
  ctx.strokeStyle='rgba(255,120,120,.38)';
  ctx.lineWidth=3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0,-BOSS_TARGET_CIRCLE_RADIUS);
  ctx.lineTo(-10,-BOSS_TARGET_CIRCLE_RADIUS+16);
  ctx.lineTo(10,-BOSS_TARGET_CIRCLE_RADIUS+16);
  ctx.closePath();
  ctx.fillStyle='rgba(255,120,120,.9)';
  ctx.fill();
  ctx.restore();
  const allWingsGlow = game.castType === 'tankAoE';
  drawBossWing('left', allWingsGlow || (game.telegraphWing && game.wingSide === 'left'));
  drawBossWing('right', allWingsGlow || (game.telegraphWing && game.wingSide === 'right'));
  ctx.save();
  ctx.translate(FIELD.x, FIELD.y);
  if (game.bossPulse > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, 48 + (1-game.bossPulse)*22, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(255,224,138,${game.bossPulse})`;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0,0,30,0,Math.PI*2);
  ctx.fillStyle = '#3a2b48';
  ctx.fill();
  ctx.strokeStyle = '#d8b6ee';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0,0,11,0,Math.PI*2);
  ctx.fillStyle = '#8e6aa6';
  ctx.fill();
  ctx.restore();
}

function drawTrines() {
  for (const trine of game.visibleTrines) {
    const age = Math.max(0, game.elapsed - trine.appearedAt);
    const intro = Math.min(1, age / .22);
    const glow = 8;
    const cx = trine.vertices.reduce((sum,p)=>sum+p.x,0)/3;
    const cy = trine.vertices.reduce((sum,p)=>sum+p.y,0)/3;
    ctx.save();
    ctx.translate(cx,cy);
    ctx.scale(.82 + .18*intro,.82 + .18*intro);
    ctx.translate(-cx,-cy);
    ctx.beginPath();
    ctx.moveTo(trine.vertices[0].x, trine.vertices[0].y);
    ctx.lineTo(trine.vertices[1].x, trine.vertices[1].y);
    ctx.lineTo(trine.vertices[2].x, trine.vertices[2].y);
    ctx.closePath();
    const grad = ctx.createLinearGradient(trine.vertices[0].x,trine.vertices[0].y,trine.vertices[2].x,trine.vertices[2].y);
    grad.addColorStop(0,'rgba(255,244,77,.18)');
    grad.addColorStop(.5,'rgba(255,224,28,.40)');
    grad.addColorStop(1,'rgba(255,247,117,.22)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,239,48,.99)';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = 'rgba(255,220,28,.9)';
    ctx.shadowBlur = glow;
    ctx.stroke();
    ctx.shadowBlur = 0;
    for (const vertex of trine.vertices) {
      ctx.beginPath();
      ctx.arc(vertex.x,vertex.y,5.5,0,Math.PI*2);
      ctx.fillStyle='rgba(255,250,188,.95)';
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawActiveAoEs() {
  for (const aoe of game.activeAoEs) {
    const life = Math.max(0, Math.min(1, (aoe.expires-game.elapsed)/(aoe.expires-aoe.started)));
    const flash = 1-life;
    if (aoe.type === 'wing') {
      const x = aoe.side === 'left' ? 0 : FIELD.x;
      const grad = ctx.createLinearGradient(x,0,x+FIELD.x,0);
      grad.addColorStop(0,`rgba(255,38,75,${.48*life})`);
      grad.addColorStop(1,`rgba(255,150,94,${.72*life})`);
      ctx.fillStyle = grad;
      ctx.fillRect(x,0,FIELD.x,canvas.height);
      ctx.fillStyle=`rgba(255,242,206,${.25*(1-flash)})`;
      ctx.fillRect(x,0,FIELD.x,canvas.height);
    } else if (aoe.type === 'stackShare') {
      ctx.beginPath();
      ctx.arc(aoe.x, aoe.y, aoe.aoeRadius, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,70,70,${0.28*life})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255,180,180,${0.95*life})`;
      ctx.lineWidth = 4;
      ctx.stroke();
    } else if (aoe.type === 'tankWing') {
      for (const target of aoe.targets) {
        const radius = aoe.aoeRadius;
        const grad = ctx.createRadialGradient(target.x,target.y,0,target.x,target.y,radius);
        grad.addColorStop(0,`rgba(196,126,255,${.38*life})`);
        grad.addColorStop(.72,`rgba(126,54,220,${.52*life})`);
        grad.addColorStop(1,`rgba(78,21,142,${.30*life})`);
        ctx.beginPath();
        ctx.arc(target.x,target.y,radius,0,Math.PI*2);
        ctx.fillStyle=grad;
        ctx.fill();
        ctx.strokeStyle=`rgba(211,157,255,${.92*life})`;
        ctx.lineWidth=3;
        ctx.stroke();
      }
    } else {
      for (const vertex of aoe.vertices) {
        // 判定と表示を常に同じ半径にする。
        // 以前は発動直後だけ表示が88%に縮んでおり、見た目の外側でも
        // 内部判定に接触するように見えるずれが発生していた。
        const radius = aoe.aoeRadius;
        const grad = ctx.createRadialGradient(vertex.x,vertex.y,0,vertex.x,vertex.y,radius);
        grad.addColorStop(0,`rgba(255,252,207,${.68*life})`);
        grad.addColorStop(.25,`rgba(255,217,53,${.64*life})`);
        grad.addColorStop(1,`rgba(255,104,27,${.34*life})`);
        ctx.beginPath();
        ctx.arc(vertex.x,vertex.y,radius,0,Math.PI*2);
        ctx.fillStyle=grad;
        ctx.fill();
        ctx.strokeStyle=`rgba(255,244,157,${.95*life})`;
        ctx.lineWidth=3;
        ctx.stroke();
      }
    }
  }
}

function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.beginPath();
  ctx.arc(FIELD.x, FIELD.y, FIELD.radius, 0, Math.PI * 2);
  ctx.clip();
  const gradient = ctx.createRadialGradient(FIELD.x, FIELD.y, 35, FIELD.x, FIELD.y, FIELD.radius);
  gradient.addColorStop(0, '#1b2638');
  gradient.addColorStop(.7, '#101827');
  gradient.addColorStop(1, '#090f19');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(190,205,230,.22)';
  ctx.lineWidth = 1.7;
  drawFloorCircles();
  drawBoss();
  drawTrines();
  drawActiveAoEs();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(FIELD.x, FIELD.y, FIELD.radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#a7c8ff';
  ctx.lineWidth = 5;
  ctx.stroke();
}

function drawMarkers() {
  if (!showMarkers) return;
  const letterMarkerRadius = 16 * PX_PER_YALM;
  const numberMarkerRadius = 15 * PX_PER_YALM;
  markerOrder.forEach((label, index) => {
    const angle = -Math.PI / 2 + index * Math.PI / 4;
    const markerRadius = /^[A-D]$/.test(label) ? letterMarkerRadius : numberMarkerRadius;
    const x = FIELD.x + Math.cos(angle) * markerRadius;
    const y = FIELD.y + Math.sin(angle) * markerRadius;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fillStyle = markerColors[label];
    ctx.globalAlpha = .48;
    ctx.fill();
    ctx.globalAlpha = .9;
    ctx.strokeStyle = markerColors[label];
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.font = 'bold 22px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(5, 8, 16, .9)';
    ctx.strokeText(label, 0, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, 0, 1);
    ctx.restore();
  });
}


function drawHitboxCircle(radius, strokeStyle, fillStyle) {
  if (!showHitboxes) return;
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 2.4, 0, Math.PI * 2);
  ctx.fillStyle = strokeStyle;
  ctx.fill();
  ctx.restore();
}

function drawSoilCircle(soil, preview = false) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(soil.x, soil.y, soil.radius, 0, Math.PI * 2);
  ctx.fillStyle = preview ? 'rgba(86, 185, 255, .07)' : 'rgba(86, 185, 255, .12)';
  ctx.fill();
  ctx.strokeStyle = preview ? 'rgba(165, 235, 255, .72)' : 'rgba(126, 220, 255, .9)';
  ctx.lineWidth = preview ? 1.5 : 2;
  ctx.setLineDash(preview ? [8, 6] : []);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(soil.x, soil.y, soil.radius * .62, 0, Math.PI * 2);
  ctx.strokeStyle = preview ? 'rgba(126, 220, 255, .25)' : 'rgba(126, 220, 255, .42)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

function drawSoil() {
  if (game.soil) {
    drawSoilCircle(game.soil);
    const remaining = Math.max(0, game.soil.expiresAt - game.elapsed);
    ctx.save();
    ctx.font = 'bold 13px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(205,247,255,.95)';
    ctx.strokeStyle = 'rgba(3,8,15,.9)';
    ctx.lineWidth = 3;
    const label = `${remaining.toFixed(1)}s`;
    ctx.strokeText(label, game.soil.x, game.soil.y);
    ctx.fillText(label, game.soil.x, game.soil.y);
    ctx.restore();
  }
  if (game.soilPlacementMode && soilPointer) {
    drawSoilCircle({ x: soilPointer.x, y: soilPointer.y, radius: SOIL_RADIUS }, true);
  }
}

function drawFacingMarker(angle, color = '#ffffff') {
  // 視覚用のみ。攻撃・場外・キャラクター衝突の判定には使用しない。
  ctx.save();
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(PLAYER_RADIUS + 8, 0);
  ctx.lineTo(PLAYER_RADIUS + 1, -4.5);
  ctx.lineTo(PLAYER_RADIUS + 1, 4.5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(3,7,12,.9)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function drawSoilBuffIndicator(id) {
  const expiresAt = game.soilBuffs[id];
  if (!expiresAt || expiresAt <= game.elapsed) return;
  const remaining = Math.max(0, expiresAt - game.elapsed);
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, PLAYER_RADIUS + 5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(104, 231, 255, .95)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = 'bold 9px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(3,8,15,.95)';
  ctx.strokeText(`陣 ${remaining.toFixed(1)}`, 0, -(PLAYER_RADIUS + 8));
  ctx.fillStyle = '#c9f7ff';
  ctx.fillText(`陣 ${remaining.toFixed(1)}`, 0, -(PLAYER_RADIUS + 8));
  ctx.restore();
}


function drawRoleEffects() {
  if (game.stackIntruderWheel) {
    const owner = game.npcs.find(npc => npc.id === game.stackIntruderWheel.ownerId);
    if (owner) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(owner.x, owner.y, game.stackIntruderWheel.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(113, 99, 255, .10)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(185, 176, 255, .9)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
  }
  if (game.h1Wheel) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(game.h1Wheel.x, game.h1Wheel.y, game.h1Wheel.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(113, 99, 255, .10)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(185, 176, 255, .9)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }
  if (game.h1Star) {
    const remaining = Math.max(0, game.h1Star.expiresAt - game.elapsed);
    ctx.save();
    ctx.beginPath();
    ctx.arc(FIELD.x, FIELD.y, FIELD.radius - 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(90, 190, 255, .62)';
    ctx.lineWidth = 4;
    ctx.setLineDash([13, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#bfe9ff';
    ctx.fillText(`Star ${remaining.toFixed(1)}s`, FIELD.x, FIELD.y + 45);
    ctx.restore();
  }
  if (game.h1StarFlashUntil > game.elapsed) {
    const alpha = (game.h1StarFlashUntil - game.elapsed) / 0.5;
    ctx.save();
    ctx.beginPath();
    ctx.arc(FIELD.x, FIELD.y, FIELD.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(80,180,255,${0.28 * alpha})`;
    ctx.fill();
    ctx.restore();
  }
  if (game.d4LeyLines) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(game.d4LeyLines.x, game.d4LeyLines.y, game.d4LeyLines.radius || D4_LEYLINES_RADIUS_YALMS * PX_PER_YALM, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(125, 80, 220, .16)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(196, 160, 255, .88)';
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e5d5ff';
    ctx.fillText(`魔紋 ${secondsRemaining(game.d4LeyLines.expiresAt).toFixed(1)}s`, game.d4LeyLines.x, game.d4LeyLines.y + 4);
    ctx.restore();
  }
  if (game.h2KeracholeFlashUntil > game.elapsed) {
    const alpha = (game.h2KeracholeFlashUntil - game.elapsed) / 0.55;
    ctx.save();
    ctx.beginPath();
    ctx.arc(game.player.x, game.player.y, Math.min(FIELD.radius, H2_KERACHOLE_RANGE_YALMS * PX_PER_YALM), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(90,220,255,${0.85 * alpha})`;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
  }
}

function drawRoleBuffIndicator(id) {
  const buffs = game.roleBuffs[id];
  if (!buffs) return;
  const active = Object.entries(buffs).filter(([, t]) => t > game.elapsed);
  active.forEach(([name, expiresAt], index) => {
    const remaining = Math.max(0, expiresAt - game.elapsed);
    ctx.save();
    ctx.font = 'bold 8px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(3,8,15,.95)';
    ctx.strokeText(`${name} ${remaining.toFixed(1)}`, 0, -(PLAYER_RADIUS + 20 + index * 10));
    ctx.fillStyle = name === 'ケーラコレ' ? '#9cecff' : '#e1d9ff';
    ctx.fillText(`${name} ${remaining.toFixed(1)}`, 0, -(PLAYER_RADIUS + 20 + index * 10));
    ctx.restore();
  });
}

function drawD2Gate() {
  if (!game.d2Gate) return;
  ctx.save();
  ctx.translate(game.d2Gate.x, game.d2Gate.y);
  const pulse = 1 + Math.sin(game.elapsed * 7) * 0.06;
  ctx.scale(pulse, pulse);
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(174,102,255,.20)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(220,180,255,.95)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,.85)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawNPCs() {
  for (const npc of game.npcs) {
    ctx.save();
    ctx.translate(npc.x,npc.y);
    ctx.beginPath();
    ctx.arc(0,0,NPC_RADIUS+3,0,Math.PI*2);
    ctx.fillStyle='rgba(4,8,14,.62)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0,0,NPC_RADIUS,0,Math.PI*2);
    ctx.fillStyle=npc.color;
    ctx.globalAlpha=.88;
    ctx.fill();
    ctx.globalAlpha=1;
    ctx.strokeStyle='rgba(255,255,255,.85)';
    ctx.lineWidth=1.5;
    ctx.stroke();
    ctx.font='bold 10px system-ui';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillStyle='#07101a';
    ctx.fillText(npc.label,0,.5);
    drawFacingMarker(npc.facing ?? -Math.PI / 2, 'rgba(255,255,255,.95)');
    const visibleBuffLabels = new Set(['運命の輪', 'ケーラコレ', '陣', '救出']);
    if (npc.skillFlashUntil && game.elapsed < npc.skillFlashUntil && visibleBuffLabels.has(npc.skillLabel)) {
      const pulse = 1 - Math.max(0, Math.min(1, (npc.skillFlashUntil - game.elapsed) / 0.9));
      ctx.beginPath();
      ctx.arc(0, 0, NPC_RADIUS + 7 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(120,220,255,.9)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.font = 'bold 9px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(4,7,12,.95)';
      ctx.strokeText(npc.skillLabel, 0, -(NPC_RADIUS + 14));
      ctx.fillStyle = '#bfefff';
      ctx.fillText(npc.skillLabel, 0, -(NPC_RADIUS + 14));
    }
    drawSoilBuffIndicator(npc.id);
    drawRoleBuffIndicator(npc.id);
    drawHitboxCircle(PLAYER_HIT_RADIUS, 'rgba(255,255,255,.95)', 'rgba(255,255,255,.08)');
    ctx.restore();
  }
}

function drawTankAoETargets() {
  if (!showTankTargets || !game.tankWingTargets.length) return;
  const nearestId = game.tankWingTargets[0]?.id;
  const farthestId = game.tankWingTargets[1]?.id;
  const participants = getPartyParticipants();

  for (const member of participants) {
    if (member.id !== nearestId && member.id !== farthestId) continue;
    const label = member.id === nearestId ? '最近' : '最遠';
    ctx.save();
    ctx.translate(member.x, member.y);
    ctx.beginPath();
    ctx.arc(0, 0, PLAYER_RADIUS + 8, 0, Math.PI * 2);
    ctx.strokeStyle = member.id === nearestId ? 'rgba(255,235,110,.98)' : 'rgba(215,130,255,.98)';
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(4,7,12,.95)';
    ctx.strokeText(label, 0, -(PLAYER_RADIUS + 11));
    ctx.fillStyle = '#fff';
    ctx.fillText(label, 0, -(PLAYER_RADIUS + 11));
    ctx.restore();
  }
}

function drawStackShareMarker() {
  if (!game.stackShareMarker) return;
  const participant = getPartyParticipants().find(member => member.id === 'MT');
  if (!participant) return;

  // 上下左右から中心へ向かう4つの「>」形マーカー。
  // 1秒周期で外側から内側へ移動し、互いに接触しない距離で止まる。
  const cycle = ((game.elapsed % 1) + 1) % 1;
  const eased = 1 - Math.pow(1 - cycle, 2);
  const outerDistance = 30;
  const innerDistance = 15;
  const distance = outerDistance + (innerDistance - outerDistance) * eased;

  ctx.save();
  ctx.translate(participant.x, participant.y - PLAYER_RADIUS - 34);
  ctx.strokeStyle = '#ff3434';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(255,45,45,.85)';
  ctx.shadowBlur = 7;

  function drawInwardChevron(x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    // ローカル座標では右向きの「>」。先端は中心側を向く。
    const depth = 8;
    const halfHeight = 7;
    ctx.beginPath();
    ctx.moveTo(-depth, -halfHeight);
    ctx.lineTo(0, 0);
    ctx.lineTo(-depth, halfHeight);
    ctx.stroke();
    ctx.restore();
  }

  // 上：下向き、右：左向き、下：上向き、左：右向き。
  drawInwardChevron(0, -distance, Math.PI / 2);
  drawInwardChevron(distance, 0, Math.PI);
  drawInwardChevron(0, distance, -Math.PI / 2);
  drawInwardChevron(-distance, 0, 0);

  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawPlayer() {
  const p = game.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.shadowColor='rgba(84,228,255,.75)';
  ctx.shadowBlur=12;
  ctx.beginPath();
  ctx.arc(0, 0, PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#e9fbff';
  ctx.fill();
  ctx.strokeStyle = '#54e4ff';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.shadowBlur=0;
  drawFacingMarker(p.facing ?? -Math.PI / 2, '#54e4ff');
  ctx.font = 'bold 13px system-ui';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.fillText(selectedSlot, 0, 31);
  drawSoilBuffIndicator(controlledPartyId());
  drawRoleBuffIndicator(controlledPartyId());
  drawHitboxCircle(PLAYER_HIT_RADIUS, 'rgba(84,228,255,1)', 'rgba(84,228,255,.10)');
  ctx.restore();
}


function drawD2ShukuchiPreview() {
  if (!isD2() || !game.d2ShukuchiPlacementMode || !game.running || game.replayMode) return;
  ctx.save();
  ctx.beginPath();
  ctx.arc(game.player.x, game.player.y, D2_SHUKUCHI_MAX_RANGE_YALMS * PX_PER_YALM, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(130,220,255,.65)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.stroke();
  ctx.setLineDash([]);
  if (shukuchiPointer) {
    const distance = Math.hypot(shukuchiPointer.x - game.player.x, shukuchiPointer.y - game.player.y) / PX_PER_YALM;
    const insideField = Math.hypot(shukuchiPointer.x - FIELD.x, shukuchiPointer.y - FIELD.y) + PLAYER_HIT_RADIUS <= FIELD.radius;
    const valid = distance <= D2_SHUKUCHI_MAX_RANGE_YALMS && insideField;
    ctx.beginPath();
    ctx.arc(shukuchiPointer.x, shukuchiPointer.y, PLAYER_RADIUS + 5, 0, Math.PI * 2);
    ctx.fillStyle = valid ? 'rgba(110,235,255,.22)' : 'rgba(255,90,90,.18)';
    ctx.fill();
    ctx.strokeStyle = valid ? 'rgba(170,245,255,.95)' : 'rgba(255,110,110,.95)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.restore();
}

function draw() {
  drawField();
  drawMarkers();
  drawSoil();
  drawRoleEffects();
  drawD2Gate();
  drawD2ShukuchiPreview();
  drawNPCs();
  drawPlayer();
  drawTankAoETargets();
  drawStackShareMarker();
  phaseText.textContent = game.replayMode && game.running ? `REPLAY / ${game.phase}` : game.phase;
  timeText.textContent = `${game.elapsed.toFixed(1)} s`;
  patternText.textContent = game.running || game.finished
    ? `${game.runConfig?.manualTrine ? '手動:' + patternDisplayLabel(game.runConfig.manualTrine) + ' / ' : ''}練習:${game.trineWingOnlyMode ? 'トライン＋翼' : 'フル'} / 双腕暴走:${game.dualArmRampageMode ? 'ON' : 'OFF'} / 翼:${game.wingSide === 'left' ? '左' : '右'} / AoE対象:${showTankTargets && game.tankWingTargets.length ? game.tankWingTargets.map(t=>t.id).join('・') : '非表示'} / 回転:${game.rotationStep * 60}° / 中央:${game.centerPattern + 1} / 頭割りMT:${({northOutside:'北外',dashHold:'突進位置',centerNear:'中央寄り'})[game.stackShareMtPattern] || game.stackShareMtPattern} / 侵入:${game.stackIntruderId || 'なし'} / 1回目:${game.outerLayout.first.join('-')} ②:${game.outerLayout.second} ③:${game.outerLayout.thirdOuter.join('-')}+C`
    : '-';
  const distPx = Math.hypot(game.player.x - FIELD.x, game.player.y - FIELD.y);
  distanceText.textContent = `${(distPx / PX_PER_YALM).toFixed(1)}y / ${FIELD.radiusYalms}y`;
  npcText.textContent = `${game.npcs.length || 7}人・${game.npcState}`;
  updateActionPanel();
}

function loop(now) {
  const dt = Math.min(Math.max((now - lastFrame) / 1000, 0), .033);
  lastFrame = now;
  try {
    update(dt);
    draw();
  } catch (error) {
    console.error('Simulation frame error:', error);
    game.runtimeErrorMessage = error instanceof Error ? error.message : String(error);
    // 1フレームの例外でrequestAnimationFrameを失わないよう、描画だけ再試行する。
    try { draw(); } catch (_) {}
  } finally {
    requestAnimationFrame(loop);
  }
}

window.addEventListener('keydown', event => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Digit1','Digit2','Digit3'].includes(event.code)) event.preventDefault();
  if (!event.repeat && event.code === 'Digit1') {
    handleActionKey(1);
    return;
  }
  if (!event.repeat && event.code === 'Digit2') {
    handleActionKey(2);
    return;
  }
  if (!event.repeat && event.code === 'Digit3') {
    handleActionKey(3);
    return;
  }
  if (!game.replayMode) keys.add(event.code);
});
window.addEventListener('keyup', event => keys.delete(event.code));
startButton.addEventListener('click', () => resetGame());
sideStartButton.addEventListener('click', () => resetGame());
retryButton.addEventListener('click', () => resetGame());
replayButton.addEventListener('click', () => { if (lastReplayData) resetGame(lastReplayData); });
sideReplayButton.addEventListener('click', () => { if (lastReplayData) resetGame(lastReplayData); });
hitboxToggle.addEventListener('change', () => { showHitboxes = hitboxToggle.checked; });
tankTargetToggle.addEventListener('change', () => { showTankTargets = tankTargetToggle.checked; });
markerToggle.addEventListener('change', () => { showMarkers = markerToggle.checked; });
manualTrineToggle.addEventListener('change', () => {
  manualTrineEnabled = manualTrineToggle.checked;
  updateManualTrineControls();
});
manualTrinePattern.addEventListener('change', () => {
  selectedManualTrinePattern = manualTrinePattern.value;
  updateManualTrineControls();
});
dualArmRampageToggle.addEventListener('change', () => {
  dualArmRampageEnabled = dualArmRampageToggle.checked;
});
trineWingOnlyToggle.addEventListener('change', () => {
  trineWingOnlyEnabled = trineWingOnlyToggle.checked;
  // 専用モードでは終末の双腕を実行しないため、暴走設定は保持するが参照しない。
});
soilButton.addEventListener('click', beginSoilPlacement);
hotbarSlots.forEach((slot, index) => slot.addEventListener('click', () => handleActionKey(index + 1)));
canvas.addEventListener('mousemove', event => {
  lastCanvasPointer = canvasPointFromPointer(event);
  if (game.soilPlacementMode) soilPointer = { ...lastCanvasPointer };
  if (game.d2ShukuchiPlacementMode) shukuchiPointer = { ...lastCanvasPointer };
});
canvas.addEventListener('mouseenter', event => {
  lastCanvasPointer = canvasPointFromPointer(event);
  if (game.soilPlacementMode) soilPointer = { ...lastCanvasPointer };
  if (game.d2ShukuchiPlacementMode) shukuchiPointer = { ...lastCanvasPointer };
});
canvas.addEventListener('mouseleave', () => { soilPointer = null; shukuchiPointer = null; });
canvas.addEventListener('click', event => {
  const point = canvasPointFromPointer(event);
  if (game.d2ShukuchiPlacementMode && isD2()) {
    useD2ShukuchiAt(point.x, point.y);
    return;
  }
  if (!game.soilPlacementMode || !canPlaceSoil()) return;
  const fromCenter = Math.hypot(point.x - FIELD.x, point.y - FIELD.y);
  if (fromCenter > FIELD.radius) return;
  placeSoilAt(point.x, point.y);
});
document.getElementById('roleSelector').addEventListener('click', event => {
  const button = event.target.closest('button[data-role]');
  if (!button || button.disabled || game.running) return;
  selectedRole = button.dataset.role;
  selectedSlot = slotOptionsForRole(selectedRole)[0];
  roleButtons.forEach(item => item.classList.toggle('active', item === button));
  renderSlotSelector();
  game.player = { ...getStartPosition(selectedRole), facing: selectedRole === 'MT' ? Math.PI / 2 : -Math.PI / 2 };
  game.soil = null;
  game.soilPlacementMode = false;
  soilPointer = null;
  cancelD2ShukuchiPlacement();
  updateSoilButtonState();
  updateActionPanel();
  buildNPCs();
});
slotSelector.addEventListener('click', event => {
  const button = event.target.closest('button[data-slot]');
  if (!button || button.disabled || game.running) return;
  selectedSlot = button.dataset.slot;
  slotSelector.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
  game.soil = null;
  game.soilPlacementMode = false;
  soilPointer = null;
  cancelD2ShukuchiPlacement();
  updateSoilButtonState();
  updateActionPanel();
  buildNPCs();
});

renderSlotSelector();
populateManualTrinePatterns();
updateManualTrineControls();
buildNPCs();
updateSoilButtonState();
updateActionPanel();
requestAnimationFrame(loop);

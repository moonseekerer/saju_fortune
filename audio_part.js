
// --- 웹 오디오 API를 이용한 배경음악 생성 ---

let audioCtx = null;
let isPlaying = false;
let nextNoteTime = 0;
let soundTimer = null;

// 동양적인 느낌의 5음계 (Pentatonic Scale)
// C4, D4, E4, G4, A4, C5...
const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playNote() {
    if (!isPlaying) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // 부드러운 사인파 (풍경 소리 느낌)
    osc.type = 'sine';

    // 랜덤 음계 선택
    const note = scale[Math.floor(Math.random() * scale.length)];
    // 약간의 피치 변화로 자연스러움 추가
    const detune = (Math.random() - 0.5) * 10;

    osc.frequency.value = note + detune;

    // 엔벨로프 (부드럽게 시작해서 길게 사라짐)
    const now = audioCtx.currentTime;
    const attack = 0.05;
    const release = 4.0; // 긴 여운

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + attack); // 볼륨을 너무 크지 않게
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + release);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + attack + release);

    // 다음 음 재생 스케줄링 (랜덤 간격)
    const delay = 1000 + Math.random() * 3000; // 1~4초 간격
    soundTimer = setTimeout(playNote, delay);
}

function toggleSound() {
    const btn = document.getElementById('sound-btn');

    if (isPlaying) {
        // 끄기
        isPlaying = false;
        if (soundTimer) clearTimeout(soundTimer);
        if (audioCtx) audioCtx.suspend();
        btn.innerText = '🔇';
        btn.classList.remove('playing');
    } else {
        // 켜기
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        isPlaying = true;
        playNote(); // 첫 음 재생
        btn.innerText = '🔊';
        btn.classList.add('playing');
    }
}

export interface ShareData {
  level: string;
  accuracy: number;
  correct: number;
  total: number;
  timeSpent: number;
  streak: number;
  maxCombo: number;
}

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

export const generateShareImage = (data: ShareData): Promise<string> => {
  return new Promise((resolve) => {
    const W = 600;
    const H = 360;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#1e1b4b');
    bg.addColorStop(1, '#4c1d95');
    ctx.fillStyle = bg;
    ctx.roundRect(0, 0, W, H, 24);
    ctx.fill();

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Brand tag
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('MathStreak', W / 2, 34);

    // Title
    ctx.font = 'bold 34px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Session Complete! 🎉', W / 2, 80);

    // Level pill
    const levelText = data.level.toUpperCase() + ' LEVEL';
    ctx.font = 'bold 13px system-ui, sans-serif';
    const pillW = ctx.measureText(levelText).width + 28;
    const pillX = W / 2 - pillW / 2;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(pillX, 92, pillW, 26, 13);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(levelText, W / 2, 110);

    // Stat cards
    const stats = [
      { label: 'ACCURACY', value: `${data.accuracy}%`, color: '#34d399' },
      { label: 'SCORE',    value: `${data.correct}/${data.total}`, color: '#60a5fa' },
      { label: 'TIME',     value: formatTime(data.timeSpent), color: '#f59e0b' },
      { label: 'COMBO',    value: `×${data.maxCombo}`, color: '#f472b6' },
    ];

    const cardW = 120;
    const cardH = 90;
    const gap = 16;
    const totalW = stats.length * cardW + (stats.length - 1) * gap;
    const startX = (W - totalW) / 2;
    const cardY = 140;

    stats.forEach((s, i) => {
      const x = startX + i * (cardW + gap);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.roundRect(x, cardY, cardW, cardH, 14);
      ctx.fill();

      ctx.font = `bold 26px system-ui, sans-serif`;
      ctx.fillStyle = s.color;
      ctx.textAlign = 'center';
      ctx.fillText(s.value, x + cardW / 2, cardY + 42);

      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(s.label, x + cardW / 2, cardY + 65);
    });

    // Streak bar
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.textAlign = 'center';
    ctx.fillText(`🔥 ${data.streak}-day streak`, W / 2, 268);

    // Footer
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText('mathstreak.app  •  Train your brain daily', W / 2, 320);

    resolve(canvas.toDataURL('image/png'));
  });
};

export const shareResult = async (dataUrl: string, text: string) => {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'mathstreak-score.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: 'My MathStreak Score', text, files: [file] });
    } else {
      // Desktop fallback: trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mathstreak-score.png';
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Share failed:', error);
  }
};
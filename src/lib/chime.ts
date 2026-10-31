/**
 * Tiny synthesised door chime (two soft sine notes, "ding-dong") — no
 * audio files, created on demand after a user gesture so autoplay policies
 * are respected. Fails silently when audio is unavailable.
 */
let ctx: AudioContext | null = null;

export function playDoorChime(): void {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();

    const t0 = ctx.currentTime + 0.01;
    const note = (freq: number, at: number) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t0 + at);
      gain.gain.exponentialRampToValueAtTime(0.14, t0 + at + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + at + 1.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0 + at);
      osc.stop(t0 + at + 1.2);
    };
    note(659.25, 0); // E5 — ding
    note(523.25, 0.32); // C5 — dong
  } catch {
    /* audio unavailable — stay silent */
  }
}

import confetti from 'canvas-confetti';

export function fireCelebrationBurst(): void {
  // Center burst
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#F59E0B', '#EF4444', '#10B981', '#38BDF8', '#FDE047'],
  });
}

export function fireGrandFireworks(): void {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    // Left and right bursts like sky rockets bursting
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#EF4444', '#F59E0B', '#E11D48', '#FDE047'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B'],
    });
  }, 250);
}

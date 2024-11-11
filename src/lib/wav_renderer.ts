export class WavRenderer {
  static drawBars(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    frequencies: Float32Array,
    color: string,
    barCount: number,
    minDecibels: number,
    smoothingTimeConstant: number
  ) {
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / barCount;
    const barSpacing = barWidth * 0.2;
    const adjustedBarWidth = barWidth - barSpacing;

    ctx.fillStyle = color;

    for (let i = 0; i < barCount; i++) {
      const value = frequencies[Math.floor((i / barCount) * frequencies.length)] || 0;
      const normalizedValue = Math.max(0, Math.min(1, (value + Math.abs(minDecibels)) / Math.abs(minDecibels)));
      const smoothedValue = normalizedValue * smoothingTimeConstant;
      
      const barHeight = height * smoothedValue;
      const x = i * barWidth + barSpacing / 2;
      const y = height - barHeight;

      ctx.fillRect(x, y, adjustedBarWidth, barHeight);
    }
  }
}

import { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Custom plugin that draws arrows between nodes
const arrowPlugin = {
  id: 'flowArrows',
  afterDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const edges = chart.config.options.plugins.flowArrows?.edges || [];
    const colors = chart.config.options.plugins.flowArrows?.edgeColors || {};

    edges.forEach(([from, to]) => {
      const pFrom = meta.data[from];
      const pTo = meta.data[to];
      if (!pFrom || !pTo) return;

      const x1 = pFrom.x, y1 = pFrom.y;
      const x2 = pTo.x, y2 = pTo.y;
      const r1 = pFrom.options.radius || 20;
      const r2 = pTo.options.radius || 20;

      // Shorten line to stop at bubble edges
      const dx = x2 - x1, dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < r1 + r2 + 5) return;
      const ux = dx / dist, uy = dy / dist;
      const sx = x1 + ux * (r1 + 4), sy = y1 + uy * (r1 + 4);
      const ex = x2 - ux * (r2 + 4), ey = y2 - uy * (r2 + 4);

      const color = colors[`${from}-${to}`] || 'rgba(196,181,253,0.4)';

      // Draw line
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrowhead
      const headLen = 8;
      const angle = Math.atan2(ey - sy, ex - sx);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - headLen * Math.cos(angle - 0.4), ey - headLen * Math.sin(angle - 0.4));
      ctx.lineTo(ex - headLen * Math.cos(angle + 0.4), ey - headLen * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  },
};

// Custom plugin for group labels (phase brackets)
const groupLabelPlugin = {
  id: 'groupLabels',
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    const groups = chart.config.options.plugins.groupLabels?.groups || [];

    groups.forEach(g => {
      const xPx = chart.scales.x.getPixelForValue(g.x);
      const y = chartArea.bottom + 18;

      ctx.save();
      ctx.fillStyle = g.color || 'rgba(196,181,253,0.6)';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(g.label, xPx, y);
      ctx.restore();
    });
  },
};

export default function FlowChart({ nodes, edges, groups, height = 220 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const xMin = Math.min(...xs) - 1, xMax = Math.max(...xs) + 1;
    const yMin = Math.min(...ys) - 1, yMax = Math.max(...ys) + 1;

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bubble',
      plugins: [arrowPlugin, groupLabelPlugin],
      data: {
        datasets: [{
          data: nodes.map(n => ({ x: n.x, y: n.y, r: n.r || 22 })),
          backgroundColor: nodes.map(n => n.bg || 'rgba(196,181,253,0.25)'),
          borderColor: nodes.map(n => n.border || '#c4b5fd'),
          borderWidth: 2,
          hoverRadius: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        layout: { padding: { bottom: 28, top: 10, left: 10, right: 10 } },
        scales: {
          x: {
            min: xMin, max: xMax,
            display: false,
          },
          y: {
            min: yMin, max: yMax,
            display: false,
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          flowArrows: { edges, edgeColors: {} },
          groupLabels: { groups: groups || [] },
        },
      },
    });

    // Draw labels on top of bubbles after chart renders
    const origDraw = chartRef.current.draw.bind(chartRef.current);
    const drawLabels = () => {
      origDraw();
      const ctx = chartRef.current.ctx;
      const meta = chartRef.current.getDatasetMeta(0);
      nodes.forEach((n, i) => {
        const pt = meta.data[i];
        if (!pt) return;
        ctx.save();
        ctx.fillStyle = n.textColor || '#e6e0ff';
        ctx.font = `bold ${n.fontSize || 11}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Multi-line support
        const lines = n.label.split('\n');
        const lineH = (n.fontSize || 11) + 2;
        const startY = pt.y - ((lines.length - 1) * lineH) / 2;
        lines.forEach((line, li) => {
          ctx.fillText(line, pt.x, startY + li * lineH);
        });
        ctx.restore();
      });
    };
    chartRef.current.draw = drawLabels;
    chartRef.current.update();

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [nodes, edges, groups]);

  return (
    <div style={{ height, maxWidth: 800, margin: '0 auto' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

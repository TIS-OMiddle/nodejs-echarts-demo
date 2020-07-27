import echarts from 'echarts';
import { Canvas } from 'canvas';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import { svg2png } from 'svg-png-converter';

(echarts as any).setCanvasCreator(() => {
  return new Canvas(100, 100);
});
const { window } = new JSDOM();
globalThis.window = window as any;
globalThis.navigator = window.navigator;
globalThis.document = window.document;

async function doit() {
  const root = document.createElement('div');
  root.style.cssText = 'width: 500px; height: 500px;';

  const chart = echarts.init(root, undefined, {
    renderer: 'svg',
  });
  chart.setOption({
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 120],
        type: 'line',
      },
    ],
  });

  const svgContent = root.querySelector('svg');
  if (svgContent) {
    let outputBuffer = await svg2png({
      input: svgContent.outerHTML,
      encoding: 'buffer',
      format: 'png',
    });
    fs.writeFileSync('test.png', outputBuffer);
    chart.dispose();
  }
}
doit();

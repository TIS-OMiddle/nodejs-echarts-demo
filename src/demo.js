const echarts = require('echarts')
const { Canvas } = require('canvas')
const fs = require('fs')
const { JSDOM } = require('jsdom');
const { svg2png } = require('svg-png-converter');

echarts.setCanvasCreator(() => {
  return new Canvas(100, 100);
});
const { window } = new JSDOM();
global.window = window;
global.navigator = window.navigator;
global.document = window.document;

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

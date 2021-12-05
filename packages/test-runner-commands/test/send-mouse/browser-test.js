import { sendMouse } from '../../browser/commands.mjs';
import { expect } from '../chai.js';

// document.addEventListener('mousedown', event => {
//   console.log('mousedown', event);
// });

// document.addEventListener('mouseup', event => {
//   console.log('mouseup', event);
// });

// // Sending mouse down...
// await sendMouse({ type: 'down', button: 'right' });
// // Sending mouse up...
// await sendMouse({ type: 'up', button: 'right' });

function spyEvent() {
  let events = [];

  const callback = event => events.push(event);
  callback.getEvents = () => events;
  callback.getLastEvent = () => events[events.length - 1];
  callback.resetHistory = () => {
    events = [];
  };

  return callback;
}

function getMiddleOfElement(element) {
  const { top, left, width, height } = element.getBoundingClientRect();

  return [
    Math.floor(left + window.pageXOffset + height / 2),
    Math.floor(top + window.pageYOffset + width / 2),
  ];
}

let div;

before(() => {
  document.body.style.display = 'flex';
  document.body.style.alignItems = 'center';
  document.body.style.justifyContent = 'center';
  document.body.style.height = '100vh';
});

beforeEach(() => {
  div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';

  document.body.appendChild(div);
});

afterEach(() => {
  document.body.removeChild(div);
});

describe('move', () => {
  let spy;

  beforeEach(() => {
    spy = spyEvent();
    document.addEventListener('mousemove', spy);
  });

  afterEach(() => {
    document.removeEventListener('mousemove', spy);
  });

  it('can move mouse to a position', async () => {
    const [x, y] = getMiddleOfElement(div);

    await sendMouse({ type: 'move', position: [x, y] });

    expect(spy.getLastEvent()).to.include({ type: 'mousemove', pageX: x, pageY: y });
  });
});

describe('click', () => {
  let spy, x, y;

  beforeEach(async () => {
    spy = spyEvent();
    document.addEventListener('mousedown', spy);
    document.addEventListener('mouseup', spy);

    [x, y] = getMiddleOfElement(div);

    await sendMouse({ type: 'move', position: [0, 0] });
  });

  afterEach(() => {
    document.removeEventListener('mousedown', spy);
    document.removeEventListener('mouseup', spy);
  });

  it('can click the left mouse button', async () => {
    await sendMouse({ type: 'click', position: [x, y], button: 'left' });

    expect(spy.getEvents()[0]).to.include({ type: 'mousedown', button: 0, pageX: x, pageY: y });
    expect(spy.getEvents()[1]).to.include({ type: 'mouseup', button: 0, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(2);
  });

  it('should click the left mouse button by default', async () => {
    await sendMouse({ type: 'click', position: [x, y] });

    expect(spy.getEvents()[0]).to.include({ type: 'mousedown', button: 0, pageX: x, pageY: y });
    expect(spy.getEvents()[1]).to.include({ type: 'mouseup', button: 0, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(2);
  });

  it('can click the middle mouse button', async () => {
    await sendMouse({ type: 'click', position: [x, y], button: 'middle' });

    expect(spy.getEvents()[0]).to.include({ type: 'mousedown', button: 1, pageX: x, pageY: y });
    expect(spy.getEvents()[1]).to.include({ type: 'mouseup', button: 1, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(2);
  });

  it('can click the right mouse button', async () => {
    await sendMouse({ type: 'click', position: [x, y], button: 'right' });

    expect(spy.getEvents()[0]).to.include({ type: 'mousedown', button: 2, pageX: x, pageY: y });
    expect(spy.getEvents()[1]).to.include({ type: 'mouseup', button: 2, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(2);
  });
});

describe('down and up', () => {
  let spy, x, y;

  beforeEach(async () => {
    spy = spyEvent();
    document.addEventListener('mousedown', spy);
    document.addEventListener('mouseup', spy);

    [x, y] = getMiddleOfElement(div);

    await sendMouse({ type: 'move', position: [x, y] });
  });

  afterEach(() => {
    document.removeEventListener('mousedown', spy);
    document.removeEventListener('mouseup', spy);
  });

  it('can down and up the left mouse button', async () => {
    await sendMouse({ type: 'down', button: 'left' });

    expect(spy.getEvents()[0]).to.include({ type: 'mousedown', button: 0, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(1);

    spy.resetHistory();
    await sendMouse({ type: 'up', button: 'left' });

    expect(spy.getEvents()[0]).to.include({ type: 'mouseup', button: 0, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(1);
  });

  it('should down and up the left mouse button by default', async () => {
    await sendMouse({ type: 'down' });

    expect(spy.getEvents()[0]).to.include({ type: 'mousedown', button: 0, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(1);

    spy.resetHistory();
    await sendMouse({ type: 'up' });

    expect(spy.getEvents()[0]).to.include({ type: 'mouseup', button: 0, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(1);
  });

  it('can down and up the middle mouse button', async () => {
    await sendMouse({ type: 'down', button: 'middle' });

    expect(spy.getEvents()[0]).to.include({ type: 'mousedown', button: 1, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(1);

    spy.resetHistory();
    await sendMouse({ type: 'up', button: 'middle' });

    expect(spy.getEvents()[0]).to.include({ type: 'mouseup', button: 1, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(1);
  });

  it('can down and up the right mouse button', async () => {
    await sendMouse({ type: 'down', button: 'right' });

    expect(spy.getEvents()[0]).to.include({ type: 'mousedown', button: 2, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(1);

    spy.resetHistory();
    await sendMouse({ type: 'up', button: 'right' });

    expect(spy.getEvents()[0]).to.include({ type: 'mouseup', button: 2, pageX: x, pageY: y });
    expect(spy.getEvents()).to.have.lengthOf(1);
  });
});

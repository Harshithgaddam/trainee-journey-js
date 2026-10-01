import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Basic JavaScript tests', () => {
  it('should add two numbers correctly', () => {
    assert.equal(2 + 3, 5);
  });

  it('should convert a port to a number', () => {
    assert.equal(Number('3000'), 3000);
  });
});

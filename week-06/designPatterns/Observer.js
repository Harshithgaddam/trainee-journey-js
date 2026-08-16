class EventEmitter {
  constructor() {
    this._events = new Map();
  }

  
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    if (!this._events.has(event)) {
      this._events.set(event, new Set());
    }

    this._events.get(event).add(listener);
    return this; 
  }

  
  off(event, listener) {
    if (!this._events.has(event)) return this;

    const listeners = this._events.get(event);

    for (const fn of listeners) {
      if (fn === listener || fn.originalListener === listener) {
        listeners.delete(fn);
        break;
      }
    }

    if (listeners.size === 0) {
      this._events.delete(event);
    }

    return this;
  }

  
  once(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };

    wrapper.originalListener = listener;

    return this.on(event, wrapper);
  }

  
  emit(event, ...args) {
    if (!this._events.has(event)) return false;

    const listeners = Array.from(this._events.get(event));

    for (const listener of listeners) {
      try {
        listener.apply(this, args);
      } catch (err) {
        console.error(`Error executing listener for event "${event}":`, err);
      }
    }

    return true;
  }
}
export default EventEmitter;
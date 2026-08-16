import EventEmitter from './Observer.js';

console.log("=== TESTING OBSERVER PATTERN (EventEmitter) ===");
const emitter = new EventEmitter();


const logHandler = (data) => {
  console.log(`[EVENT RECEIVED] Type: ${data.type} | Msg: ${data.message}`);
};


const auditHandler = () => {
  console.log("[AUDIT] First notification logged.");
};


emitter.on("notify", logHandler);
emitter.once("notify", auditHandler);


console.log("--- First Emit ---");
emitter.emit("notify", { type: "email", message: "First Message" });


console.log("--- Second Emit ---");
emitter.emit("notify", { type: "sms", message: "Second Message" });


emitter.off("notify", logHandler);


console.log("--- Third Emit ---");
const wasHandled = emitter.emit("notify", { type: "push", message: "Third Message" });
console.log("Were any listeners triggered on third emit?:", wasHandled);
This Repo consists of .js files  implementing  .call(),.apply(),.bind() methods along with closure,var-let scoping bugs and how event loop executes a script consists of macrotask,microtask,synchronous code.

##Microtask vs Macrotask Ordering
    JavaScript is single-threaded, so it executes only one task at a time. To handle asynchronous operations efficiently, it uses the Event Loop along with two important queues:

    Microtask Queue – Higher priority
    Macrotask Queue (Callback Queue) – Lower priority

When the Call Stack becomes empty, the Event Loop first checks the Microtask Queue. It executes all pending microtasks before processing one macrotask. If that macrotask creates new microtasks, those microtasks are executed immediately before moving to the next macrotask.

Execution Order:
1. Execute all Synchronous Code
            ↓
2. Execute ALL Microtasks
            ↓
3. Execute ONE Macrotask
            ↓
4. Repeat the cycle
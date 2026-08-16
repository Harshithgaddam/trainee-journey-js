import { NotificationFactory } from './Factory.js';


const emailNotifier = NotificationFactory.createNotification("email");
const smsNotifier = NotificationFactory.createNotification("sms");
const pushNotifier = NotificationFactory.createNotification("push");

console.log(emailNotifier.send("alice@example.com", "Hello via Email"));
console.log(smsNotifier.send("+1234567890", "Hello via SMS"));
console.log(pushNotifier.send("Device-ID-99", "Hello via Push"));


try {
  NotificationFactory.createNotification("carrier-pigeon");
} catch (err) {
  console.log("Factory Error Caught Successfully:", err.message);
}
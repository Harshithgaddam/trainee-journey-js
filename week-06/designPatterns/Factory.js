class Notification {
  send(recipient, message) {
    throw new Error("Method 'send()' must be implemented.");
  }
}

class EmailNotification extends Notification {
  send(recipient, message) {
    return `[EMAIL] Sent to ${recipient}: "${message}"`;
  }
}

class SMSNotification extends Notification {
  send(recipient, message) {
    return `[SMS] Sent to ${recipient}: "${message}"`;
  }
}

class PushNotification extends Notification {
  send(recipient, message) {
    return `[PUSH] Sent to device ${recipient}: "${message}"`;
  }
}

export class NotificationFactory {
  static #registry = new Map([
    ['email', EmailNotification],
    ['sms', SMSNotification],
    ['push', PushNotification]
  ]);

  
  static createNotification(type) {
    const TargetClass = this.#registry.get(type?.toLowerCase());

    if (!TargetClass) {
      throw new Error(`Unsupported notification type: "${type}". Allowed types: ${Array.from(this.#registry.keys()).join(', ')}`);
    }

    return new TargetClass();
  }


  static registerNotificationType(type, notificationClass) {
    this.#registry.set(type.toLowerCase(), notificationClass);
  }
}

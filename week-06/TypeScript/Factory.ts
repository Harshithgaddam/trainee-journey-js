interface Notification{
    send(recipient:string, message: string):string;
}

// class Notification {
//   send(recipient:string, message: string):string {
//     throw new Error("Method 'send()' must be implemented.");
//   }
// }

class EmailNotification implements Notification {
  send(recipient:string, message: string):string {
    return `[EMAIL] Sent to ${recipient}: "${message}"`;
  }
}

class SMSNotification implements Notification {
  send(recipient:string, message: string):string {
    return `[SMS] Sent to ${recipient}: "${message}"`;
  }
}

class PushNotification implements Notification {
  send(recipient:string, message: string):string {
    return `[PUSH] Sent to device ${recipient}: "${message}"`;
  }
}
type NotificationConstructor = new () => Notification;

export class NotificationFactory {
  static #registry = new Map<string,NotificationConstructor>([
    ['email', EmailNotification],
    ['sms', SMSNotification],
    ['push', PushNotification]
  ]);

  
  static createNotification(type:string):Notification {
    const TargetClass = this.#registry.get(type?.toLowerCase());

    if (!TargetClass) {
      throw new Error(`Unsupported notification type: "${type}". Allowed types: ${Array.from(this.#registry.keys()).join(', ')}`);
    }

    return new TargetClass();
  }


  static registerNotificationType(type:string, notificationClass:NotificationConstructor) {
    this.#registry.set(type.toLowerCase(), notificationClass);
  }
}

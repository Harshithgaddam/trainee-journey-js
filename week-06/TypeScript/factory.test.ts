import { NotificationFactory } from './Factory';

describe('NotificationFactory', () => {
  it('should create an EmailNotification instance and send message', () => {
    const notification = NotificationFactory.createNotification('email');
    const result = notification.send('test@example.com', 'Hello Email');
    expect(result).toBe('[EMAIL] Sent to test@example.com: "Hello Email"');
  });

  it('should create an SMSNotification instance (case-insensitive type)', () => {
    const notification = NotificationFactory.createNotification('SMS');
    const result = notification.send('1234567890', 'Hello SMS');
    expect(result).toBe('[SMS] Sent to 1234567890: "Hello SMS"');
  });

  it('should create a PushNotification instance', () => {
    const notification = NotificationFactory.createNotification('push');
    const result = notification.send('device_xyz', 'Hello Push');
    expect(result).toBe('[PUSH] Sent to device device_xyz: "Hello Push"');
  });

  it('should throw an error for unsupported notification types', () => {
    expect(() => {
      NotificationFactory.createNotification('carrier-pigeon');
    }).toThrow(/Unsupported notification type/);
  });

  it('should allow registering and creating a custom notification type', () => {
    class SlackNotification {
      send(recipient: string, message: string): string {
        return `[SLACK] Sent to @${recipient}: "${message}"`;
      }
    }

    NotificationFactory.registerNotificationType('slack', SlackNotification);
    const notification = NotificationFactory.createNotification('SLACK');
    const result = notification.send('johndoe', 'Hello Slack');

    expect(result).toBe('[SLACK] Sent to @johndoe: "Hello Slack"');
  });
});
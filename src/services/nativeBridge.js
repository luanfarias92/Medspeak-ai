import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { LocalNotifications } from "@capacitor/local-notifications";

export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

export async function initNativeShell() {
  if (!isNativeApp()) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#020617" });
  } catch {
    // Ignora em ambientes sem suporte
  }
}

export async function triggerLightHaptic() {
  if (!isNativeApp()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Ignora
  }
}

export async function scheduleDaily20MinReminder(hour = 20, minute = 0) {
  if (!isNativeApp()) return { ok: true, simulated: true };
  try {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== "granted") {
      return { ok: false, reason: "Permissão de notificação negada." };
    }
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 2026,
          title: "MedSpeak AI — 20 min diários",
          body: "Hora da sua micro-sessão de inglês médico, voz ativa e vocabulário!",
          schedule: {
            on: { hour, minute },
            repeats: true,
            allowWhileIdle: true
          }
        }
      ]
    });
    return { ok: true, simulated: false };
  } catch (err) {
    return { ok: false, reason: err?.message || "Erro ao agendar lembrete." };
  }
}

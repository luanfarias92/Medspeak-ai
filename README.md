# MedSpeak AI — Projeto Mobile (Android & iOS)

Este pacote contém a estrutura completa do **MedSpeak AI** pronta para rodar como **PWA** no navegador mobile e compilar para **Android** e **iOS** via **Capacitor**.

## 1. Configuração da API Key
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_GEMINI_API_KEY=SUA_CHAVE_GEMINI_AQUI
```

## 2. Rodar Localmente na Web / Mobile
```bash
npm install
npm run dev
```

## 3. Gerar Builds Nativos para Android e iOS (Capacitor)
```bash
npm run build
npx cap add android
npx cap add ios
```

### Android (Android Studio)
1. Execute `npm run cap:android` (ou abra a pasta `android` no Android Studio).
2. No `android/app/src/main/AndroidManifest.xml`, garanta as permissões:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```
3. Gere o `.apk` ou `.aab` pelo menu **Build > Generate Signed Bundle / APK**.

### iOS (Xcode — exige macOS)
1. Execute `npm run cap:ios` (ou abra `ios/App/App.xcworkspace` no Xcode).
2. No `ios/App/App/Info.plist`, adicione a permissão de microfone:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>O MedSpeak AI usa o microfone para simular conversas com pacientes e treinar pronúncia em inglês.</string>
```
3. Selecione seu **Team** em *Signing & Capabilities* e rode no simulador ou iPhone físico.

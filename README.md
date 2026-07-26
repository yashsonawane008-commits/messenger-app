# Real-Time Messenger Application

A full-stack, cross-platform mobile messenger application built to replicate core WhatsApp functionality. Engineered with a focus on seamless UI/UX, responsive state management, and local data persistence.

## 🚀 Features

*   **Dynamic Chat Routing:** Multi-screen navigation utilizing Expo Router and nested layouts.
*   **Bottom Tab Navigation:** Clean, modern UI separating active chats from user profile settings.
*   **Local Data Persistence:** Messages are saved directly to device memory using `AsyncStorage` to ensure chat histories survive app restarts.
*   **Hardware Integration:** Integrated with the device camera roll via `expo-image-picker` to support sending image-based messages.
*   **Custom Emoji Engine:** Built a lightweight, custom emoji tray component that dynamically interacts with the device's native keyboard states.
*   **Cross-Platform:** Fully compatible with both iOS, Android, and Web environments.

## 🛠️ Technology Stack

*   **Framework:** React Native / Expo
*   **Navigation:** Expo Router (File-based routing & Tab Layouts)
*   **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`)
*   **Storage:** `@react-native-async-storage/async-storage`
*   **Hardware API:** `expo-image-picker`
*   **Icons:** `@expo/vector-icons`

## 👨‍💻 Developer
**Yash Sonawane**

## 📱 Running the Project Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/messenger-app.git](https://github.com/yourusername/messenger-app.git)

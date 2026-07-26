import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// 1. Our custom array of popular emojis!
const POPULAR_EMOJIS = [
  "😀",
  "😂",
  "🥺",
  "😍",
  "🥰",
  "😎",
  "🔥",
  "👍",
  "❤️",
  "🙌",
  "🎉",
  "✨",
  "😭",
  "🤔",
  "👀",
  "💯",
  "🙏",
  "💡",
];

export default function ChatScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: string; image?: string }[]
  >([]);

  // 2. State to track if the emoji tray is open or closed
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const chatKey = `chat_${name}`;

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem(chatKey);
        if (savedMessages !== null) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    loadMessages();
  }, [chatKey]);

  useEffect(() => {
    const saveMessages = async () => {
      try {
        if (messages.length > 0) {
          await AsyncStorage.setItem(chatKey, JSON.stringify(messages));
        }
      } catch (error) {
        console.error("Error saving messages:", error);
      }
    };
    saveMessages();
  }, [messages, chatKey]);

  const sendMessage = () => {
    if (message.trim().length > 0) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), text: message, sender: "me" },
      ]);
      setMessage("");
      setShowEmojiPicker(false); // Close emojis after sending
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: "",
          sender: "me",
          image: result.assets[0].uri,
        },
      ]);
    }
  };

  // 3. Logic to toggle the emoji tray and hide the real keyboard
  const toggleEmojiPicker = () => {
    if (!showEmojiPicker) {
      Keyboard.dismiss();
    }
    setShowEmojiPicker(!showEmojiPicker);
  };

  // 4. Logic to add the tapped emoji to our text input
  const appendEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarMiniText}>{name ? name[0] : "U"}</Text>
          </View>
          <Text style={styles.headerTitle}>{name || "Chat"}</Text>
        </View>
        <View style={styles.headerRight}>
          <Ionicons
            name="videocam"
            size={22}
            color="#fff"
            style={styles.headerIcon}
          />
          <Ionicons
            name="call"
            size={20}
            color="#fff"
            style={styles.headerIcon}
          />
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "me" ? styles.myMessage : styles.theirMessage,
            ]}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.messageImage} />
            ) : null}
            {item.text.length > 0 ? (
              <Text style={styles.messageText}>{item.text}</Text>
            ) : null}
          </View>
        )}
      />

      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          {/* Made the emoji icon clickable */}
          <TouchableOpacity onPress={toggleEmojiPicker}>
            <MaterialIcons
              name="emoji-emotions"
              size={24}
              // Icon turns green when tray is open!
              color={showEmojiPicker ? "#128C7E" : "#8696a0"}
              style={styles.inputIcon}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Message"
            placeholderTextColor="#8696a0"
            value={message}
            onChangeText={setMessage}
            // Automatically close the emoji tray if they tap the text box to type
            onFocus={() => setShowEmojiPicker(false)}
          />

          <TouchableOpacity onPress={pickImage}>
            <Ionicons
              name="attach"
              size={24}
              color="#8696a0"
              style={styles.inputIcon}
            />
          </TouchableOpacity>
          {message.length === 0 && (
            <TouchableOpacity onPress={pickImage}>
              <Ionicons
                name="camera"
                size={24}
                color="#8696a0"
                style={styles.inputIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          {message.length > 0 ? (
            <Ionicons name="send" size={20} color="#fff" />
          ) : (
            <MaterialIcons name="mic" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* 5. The Emoji Tray UI (Only shows when showEmojiPicker is true) */}
      {showEmojiPicker && (
        <View style={styles.emojiTray}>
          <FlatList
            data={POPULAR_EMOJIS}
            numColumns={6}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => appendEmoji(item)}
                style={styles.emojiButton}
              >
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFEAE2" },
  header: {
    backgroundColor: "#075E54",
    padding: 15,
    paddingTop: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  backButton: { marginRight: 5 },
  headerIcon: { marginRight: 20 },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarMiniText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  messageList: { padding: 15 },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  messageText: { fontSize: 16 },
  messageImage: { width: 200, height: 200, borderRadius: 8, marginBottom: 5 },
  inputArea: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: "center",
    minHeight: 50,
    marginRight: 10,
  },
  inputIcon: { marginHorizontal: 5 },
  input: { flex: 1, fontSize: 16, paddingVertical: 10, paddingHorizontal: 5 },
  sendButton: {
    backgroundColor: "#128C7E",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  // New styles for the emoji tray!
  emojiTray: {
    backgroundColor: "#fff",
    height: 250,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  emojiButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  emojiText: { fontSize: 28 },
});
